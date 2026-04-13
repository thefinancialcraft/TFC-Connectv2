module.exports = [
"[externals]/crypto-js/sha256.js [external] (crypto-js/sha256.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto-js/sha256.js", () => require("crypto-js/sha256.js"));

module.exports = mod;
}),
"[project]/lib/phoneUtils.ts [ssr] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$externals$5d2f$crypto$2d$js$2f$sha256$2e$js__$5b$external$5d$__$28$crypto$2d$js$2f$sha256$2e$js$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/crypto-js/sha256.js [external] (crypto-js/sha256.js, cjs)");
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
    return (0, __TURBOPACK__imported__module__$5b$externals$5d2f$crypto$2d$js$2f$sha256$2e$js__$5b$external$5d$__$28$crypto$2d$js$2f$sha256$2e$js$2c$__cjs$29$__["default"])(normalized).toString();
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
}),
"[project]/pages/portal/campaign/[id]/[customerId].tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "default",
    ()=>CallingPage
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$styled$2d$jsx$2f$style$2e$js__$5b$external$5d$__$28$styled$2d$jsx$2f$style$2e$js$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/styled-jsx/style.js [external] (styled-jsx/style.js, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/router.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$SessionContext$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/context/SessionContext.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Sidebar$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/Sidebar.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Header$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/Header.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$authService$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/authService.ts [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabase.ts [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$BottomNav$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/BottomNav.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$flutterBridge$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/flutterBridge.ts [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$phoneUtils$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/phoneUtils.ts [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$monitoring$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/monitoring.ts [ssr] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$SessionContext$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Header$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$authService$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$flutterBridge$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$context$2f$SessionContext$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Header$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$authService$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$flutterBridge$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
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
function CallingPage() {
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const { id: campaignId, customerId } = router.query;
    const { currentSession: globalHotSession, allSessions } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$SessionContext$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["useSession"])();
    const handleLogoutClick = async ()=>{
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$authService$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["handleLogout"])(router);
    };
    const [user, setUser] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(null);
    const [customer, setCustomer] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(null);
    const [viewingDetailsKey, setViewingDetailsKey] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(null);
    const [campaign, setCampaign] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(null);
    const [history, setHistory] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])([]);
    const [mobileLogs, setMobileLogs] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])([]);
    const [timelineView, setTimelineView] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])('timeline');
    const [scheduledCalls, setScheduledCalls] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])([]);
    const [selectedScheduleDate, setSelectedScheduleDate] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(new Date());
    const [managedByInfo, setManagedByInfo] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(true);
    const [saving, setSaving] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])("");
    const [isAssigning, setIsAssigning] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const [assignmentCountdown, setAssignmentCountdown] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(3);
    const [targetNextLead, setTargetNextLead] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(null);
    const [isAccessDeniedManual, setIsAccessDeniedManual] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    // Call States
    const [isCalling, setIsCalling] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const [postCall, setPostCall] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const [callDuration, setCallDuration] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(0);
    const [callStartTime, setCallStartTime] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(null);
    const [serverTimeOffset, setServerTimeOffset] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(0);
    const [disposition, setDisposition] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])("");
    const [subDisposition, setSubDisposition] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])("");
    const [callbackDate, setCallbackDate] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(()=>{
        const now = new Date();
        return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    });
    const [callbackTime, setCallbackTime] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(()=>{
        const now = new Date();
        return now.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });
    });
    const [tempHour, setTempHour] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])("09");
    const [tempMinute, setTempMinute] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])("00");
    const [tempAmPm, setTempAmPm] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])("AM");
    const [notes, setNotes] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])("");
    const [isDatePickerOpen, setIsDatePickerOpen] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const [isTimePickerOpen, setIsTimePickerOpen] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const [isAssignPickerOpen, setIsAssignPickerOpen] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const [isPhoneUnmasked, setIsPhoneUnmasked] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const [calendarViewDate, setCalendarViewDate] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(new Date());
    const [callAlive, setCallAlive] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const [localCallingStatus, setLocalCallingStatus] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(null);
    const [showCalendarModal, setShowCalendarModal] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const [isNotesExpanded, setIsNotesExpanded] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const [attachments, setAttachments] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])([]);
    const [showAttachmentModal, setShowAttachmentModal] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const [showEnlargedNotes, setShowEnlargedNotes] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const [liveNotes, setLiveNotes] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])("");
    const [isSavingLiveNotes, setIsSavingLiveNotes] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const [attachmentSearch, setAttachmentSearch] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])("");
    const [pendingFile, setPendingFile] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(null);
    const [customFileName, setCustomFileName] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])("");
    // Conflict states
    const [conflictInfo, setConflictInfo] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(null);
    const [checkingSlot, setCheckingSlot] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const [showNewLeadAlert, setShowNewLeadAlert] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const prevCustomerId = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useRef"])(null);
    const [isEditingExpiry, setIsEditingExpiry] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const [tempExpiryDate, setTempExpiryDate] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])("");
    const [isEditingDetails, setIsEditingDetails] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const [tempDetails, setTempDetails] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])([]);
    const [prefetchStatus, setPrefetchStatus] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])('idle');
    const [dailyLeadCount, setDailyLeadCount] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(0);
    const [activePreset, setActivePreset] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(null);
    const [isRefreshing, setIsRefreshing] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const [isManualMode, setIsManualMode] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const [isInterruption, setIsInterruption] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const expiryDatePickerRef = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useRef"])(null);
    const detailsEditRef = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useRef"])(null);
    // Slider State
    const [dragX, setDragX] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(0);
    const [isDragging, setIsDragging] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const startXRef = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useRef"])(0);
    const containerRef = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useRef"])(null);
    const sliderHandleRef = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useRef"])(null);
    const skipTextRef = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useRef"])(null);
    const hourScrollRef = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useRef"])(null);
    const minuteScrollRef = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useRef"])(null);
    const hasMovedRef = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useRef"])(false);
    const lastActiveRef = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useRef"])(Date.now());
    // 🔄 STALE SESSION AUTO-RELOAD (Reload if user returns after 5+ minutes)
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        const handleVisibilityChange = ()=>{
            if (document.visibilityState === "visible") {
                const now = Date.now();
                const diffMinutes = (now - lastActiveRef.current) / (1000 * 60);
                if (diffMinutes >= 5) {
                    console.log(`[AutoReload] Returning after ${Math.round(diffMinutes)} mins. Refreshing lead data.`);
                    window.location.reload();
                }
            } else {
                // Mark timestamp when the user leaves the tab
                lastActiveRef.current = Date.now();
            }
        };
        const updateActivityTime = ()=>{
            lastActiveRef.current = Date.now();
        };
        window.addEventListener("visibilitychange", handleVisibilityChange);
        document.addEventListener("mousedown", updateActivityTime);
        document.addEventListener("keydown", updateActivityTime);
        return ()=>{
            window.removeEventListener("visibilitychange", handleVisibilityChange);
            document.removeEventListener("mousedown", updateActivityTime);
            document.removeEventListener("keydown", updateActivityTime);
        };
    }, []);
    // Time Picker Drag State
    const [timePickerPos, setTimePickerPos] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])({
        x: 0,
        y: 0
    });
    const [isTimePickerDragging, setIsTimePickerDragging] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const timePickerDragRef = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useRef"])(null);
    // Time Picker Drag Logic
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        const handleMouseMove = (e)=>{
            if (!isTimePickerDragging || !timePickerDragRef.current) return;
            const dx = e.clientX - timePickerDragRef.current.startX;
            const dy = e.clientY - timePickerDragRef.current.startY;
            setTimePickerPos({
                x: timePickerDragRef.current.initialX + dx,
                y: timePickerDragRef.current.initialY + dy
            });
        };
        const handleMouseUp = ()=>{
            setIsTimePickerDragging(false);
            timePickerDragRef.current = null;
        };
        if (isTimePickerDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        }
        return ()=>{
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [
        isTimePickerDragging
    ]);
    // 🕒 Auto-scroll Time Picker when opened or selection changes
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        if (isTimePickerOpen) {
            // Small delay to ensure state and DOM are perfectly synced
            const timer = setTimeout(()=>{
                const activeHour = hourScrollRef.current?.querySelector('[data-active="true"]');
                const activeMinute = minuteScrollRef.current?.querySelector('[data-active="true"]');
                if (activeHour) {
                    activeHour.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center'
                    });
                }
                if (activeMinute) {
                    activeMinute.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center'
                    });
                }
            }, 100);
            return ()=>clearTimeout(timer);
        }
    }, [
        isTimePickerOpen,
        tempHour,
        tempMinute
    ]);
    const handleTimePickerMouseDown = (e)=>{
        // Prevent drag on interactive elements
        if (e.target.closest('button')) return;
        setIsTimePickerDragging(true);
        timePickerDragRef.current = {
            startX: e.clientX,
            startY: e.clientY,
            initialX: timePickerPos.x,
            initialY: timePickerPos.y
        };
    };
    // Calculate Lead Score based on unique interactions
    const leadScore = (()=>{
        const uniqueAgents = new Set([
            ...mobileLogs.map((log)=>log.employee_id).filter(Boolean),
            ...(history || []).map((log)=>log.created_by).filter(Boolean)
        ]);
        const count = uniqueAgents.size;
        if (count === 0) return {
            label: 'Fresh',
            color: 'text-emerald-500',
            icon: 'fi-rr-sparkles'
        };
        if (count <= 3) return {
            label: 'High',
            color: 'text-blue-500',
            icon: 'fi-sr-star'
        };
        if (count <= 8) return {
            label: 'Medium',
            color: 'text-amber-500',
            icon: 'fi-sr-star'
        };
        return {
            label: 'Low',
            color: 'text-rose-500',
            icon: 'fi-sr-star'
        };
    })();
    // --- 💾 STATE PERSISTENCE ENGINE ---
    const isApiUpdatingRef = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useRef"])(false); // Prevents polling conflict during call start/end
    const datePickerRef = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useRef"])(null);
    const timePickerRef = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useRef"])(null);
    const assignPickerRef = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useRef"])(null);
    const fileInputRef = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useRef"])(null);
    const textareaRef = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useRef"])(null);
    const lineNumbersRef = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useRef"])(null);
    const syncScroll = ()=>{
        if (textareaRef.current && lineNumbersRef.current) {
            lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
        }
    };
    // Get Last Interaction for Follow Ups
    const lastInteraction = history?.length > 0 ? history[0] : null;
    const handleWhatsAppClick = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useCallback"])(()=>{
        if (!customer?.phone_no) {
            alert("No phone number available");
            return;
        }
        // 1. Decrypt if necessary
        let rawPhone = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$phoneUtils$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["decryptPhone"])(customer.phone_no);
        // 2. Comprehensive Cleaning
        // Remove all non-numeric characters first
        let cleanNumber = rawPhone.replace(/\D/g, '');
        // 3. Remove all leading zeros (e.g., 0091... or 098...)
        cleanNumber = cleanNumber.replace(/^0+/, '');
        // 4. International Normalization (Primarily for India '91')
        if (cleanNumber.length === 10) {
            // Case: 9876543210 -> 919876543210 (Classic 10-digit)
            cleanNumber = '91' + cleanNumber;
        } else if (cleanNumber.length > 10) {
            // Check if it's an Indian number already (12 digits starting with 91)
            // But verify it doesn't have a '0' after 91 (e.g. 9109876...)
            const isStandardIndian = cleanNumber.startsWith('91') && cleanNumber.length === 12 && cleanNumber[2] !== '0';
            if (!isStandardIndian) {
                // If it's mangled (e.g. 009198..., 91098..., +91-98...), take the reliable last 10 digits
                const last10 = cleanNumber.slice(-10);
                cleanNumber = '91' + last10;
            }
        }
        // 5. Final validation: Ensure it's not empty and has a reasonable length
        if (cleanNumber.length < 10) {
            alert("Invalid phone number format: " + rawPhone);
            return;
        }
        console.log(`[WhatsApp] Final formatted number: ${cleanNumber}`);
        const waUrl = `https://wa.me/${cleanNumber}`;
        window.open(waUrl, '_blank');
    }, [
        customer?.phone_no
    ]);
    const handleEndCall = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useCallback"])(async (isFromBridge = false)=>{
        isApiUpdatingRef.current = true; // LOCK ON IMMEDIATELY
        console.log(`🤙 [EndCall] Initiated. Source: ${isFromBridge ? 'Native Bridge' : 'User UI'}`);
        // If the call never reached 'connected' status, force duration to 0
        if (localCallingStatus !== 'connected') {
            console.log('🤙 [EndCall] Call never connected. Forcing Talk Time to 0.');
            setCallDuration(0);
        }
        setIsCalling(false);
        setPostCall(true);
        setCallAlive(false);
        setLocalCallingStatus(null);
        // Pre-fill callback date/time with current values + 5 mins for disposition
        const now = new Date();
        const future = new Date(now.getTime() + 5 * 60000); // Add 5 minutes
        const localDate = `${future.getFullYear()}-${String(future.getMonth() + 1).padStart(2, '0')}-${String(future.getDate()).padStart(2, '0')}`;
        const localTime = future.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });
        setCallbackDate(localDate);
        setCallbackTime(localTime);
        console.log('🤙 [EndCall] State flags updated: isCalling=false, postCall=true, callAlive=false, localStatus=null');
        // Notify Flutter bridge to disconnect the call
        if (customer?.phone_no) {
            const decryptedPhone = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$phoneUtils$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["decryptPhone"])(customer.phone_no);
            console.log(`🤙 [EndCall] Customer phone: ${decryptedPhone}`);
            // Only send command to flutter if we initiated it from UI
            if (!isFromBridge) {
                console.log('🤙 [EndCall] Notifying Flutter to disconnect...');
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$flutterBridge$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["notifyFlutter"])('call_disconnect', decryptedPhone);
            } else {
                console.log('🤙 [EndCall] Skipping Flutter notification (already disconnected on native side)');
            }
            // Sync disconnect to SyncMeta table
            if (user?.employeeId) {
                if (isFromBridge) {
                    console.log(`🤙 [EndCall] Clearing SyncMeta busy status for employee: ${user.employeeId}`);
                    // If bridge already disconnected, just clear the busy state in DB
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$flutterBridge$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["updateSyncMetaCallStatus"])(user.employeeId, '', "");
                } else {
                    console.log(`🤙 [EndCall] Updating SyncMeta with call_disconnect for: ${user.employeeId}`);
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$flutterBridge$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["updateSyncMetaCallStatus"])(user.employeeId, 'call_disconnect', decryptedPhone || "");
                }
            } else {
                console.warn('🤙 [EndCall] Employee ID missing, skipping SyncMeta update');
            }
        } else {
            console.warn('🤙 [EndCall] Customer phone number missing');
        }
        // Update state to disposition_pending in call_sessions table
        if (user?.uid) {
            console.log('🤙 [EndCall] Fetching auth session for API update...');
            const { data: { session: authSession } } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].auth.getSession();
            if (authSession) {
                console.log(`🤙 [EndCall] Auth session found. Updating session status for campaign ${campaignId}, customer ${customerId}`);
                try {
                    const response = await fetch("/api/auth/update-call-session", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${authSession.access_token}`
                        },
                        body: JSON.stringify({
                            campaign_id: campaignId,
                            customer_id: customerId,
                            status: 'disposition_pending'
                        })
                    });
                    const resData = await response.json();
                    console.log('🤙 [EndCall] API Update Response:', resData);
                    // Release lock after a short delay to allow DB propagation
                    setTimeout(()=>{
                        isApiUpdatingRef.current = false; // LOCK OFF
                    }, 2000);
                } catch (error) {
                    console.error('🤙 [EndCall] Failed to update call session via API:', error);
                    isApiUpdatingRef.current = false;
                }
            } else {
                console.error('🤙 [EndCall] No auth session found, cannot update session status');
                isApiUpdatingRef.current = false;
            }
        } else {
            console.warn('🤙 [EndCall] User UID missing, skipping call_sessions update');
            isApiUpdatingRef.current = false;
        }
        console.log('🤙 [EndCall] Process complete.');
    }, [
        campaignId,
        customerId,
        customer?.phone_no,
        user?.uid,
        user?.employeeId,
        user?.employeeId
    ]);
    const fetchSchedules = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useCallback"])(async ()=>{
        if (!user?.uid) return;
        try {
            // Fetch from customers table as requested
            const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from('customers').select('id, customer_name, next_called_at, campaign_id, disposition, sub_disposition, notes, phone_no').or(`managed_by.eq.${user.uid},assigned_to.eq.${user.uid}`).eq('disposition', 'Call Back').not('next_called_at', 'is', null).order('next_called_at', {
                ascending: true
            });
            if (error) throw error;
            // Map data to ensure it has campaign_name if possible (optional, or stick to provided data)
            setScheduledCalls(data || []);
        } catch (err) {
            console.error("Error fetching schedules:", err);
        }
    }, [
        user?.uid
    ]);
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        fetchSchedules();
    }, [
        fetchSchedules
    ]);
    // Auto-scrolling for active tabs/buttons
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        // We delay slightly to ensure DOM is updated and animations are ready
        const timer = setTimeout(()=>{
            const activeElements = document.querySelectorAll('[data-active="true"]');
            activeElements.forEach((el)=>{
                el.scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest',
                    inline: 'center'
                });
            });
        }, 100);
        return ()=>clearTimeout(timer);
    }, [
        timelineView
    ]);
    // Bridge Message Listener
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        if ("TURBOPACK compile-time truthy", 1) return;
        //TURBOPACK unreachable
        ;
        const handleMessage = undefined;
    }, [
        user,
        campaignId,
        customerId,
        customer?.phone_no,
        isCalling,
        handleEndCall
    ]);
    // Track lead changes for notification
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        if (customerId && prevCustomerId.current && customerId !== prevCustomerId.current) {
            console.log('[Lead-Change] New lead detected, showing alert');
            setShowNewLeadAlert(true);
            const timer = setTimeout(()=>setShowNewLeadAlert(false), 8000);
            return ()=>clearTimeout(timer);
        }
        if (customerId) {
            prevCustomerId.current = customerId;
        }
    }, [
        customerId
    ]);
    // Close pickers on outside click
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        function handleClickOutside(event) {
            if (datePickerRef.current && !datePickerRef.current.contains(event.target)) {
                setIsDatePickerOpen(false);
            }
            if (timePickerRef.current && !timePickerRef.current.contains(event.target)) {
                setIsTimePickerOpen(false);
            }
            if (assignPickerRef.current && !assignPickerRef.current.contains(event.target)) {
                setIsAssignPickerOpen(false);
            }
            if (expiryDatePickerRef.current && !expiryDatePickerRef.current.contains(event.target)) {
                setIsEditingExpiry(false);
            }
            if (detailsEditRef.current && !detailsEditRef.current.contains(event.target)) {
                setIsEditingDetails(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return ()=>document.removeEventListener("mousedown", handleClickOutside);
    }, []);
    const dispositionHierarchy = {
        "Not Intrested": [],
        "Language barrier": [],
        "DND": [],
        "Wrong NO": [],
        "Ported / Expired": [],
        "Not Contactable": [
            "busy",
            "Switch off",
            "Ring",
            "not reacable",
            "others"
        ],
        "Call Back": [
            "Interested",
            "Follow up",
            "Not Connected"
        ],
        "Deal Done": []
    };
    const [outcome, setOutcome] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])("");
    const [userOutcomes, setUserOutcomes] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])([]);
    const [newOutcomeInput, setNewOutcomeInput] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])("");
    const [isAddingOutcome, setIsAddingOutcome] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        if (user && subDisposition && (disposition === 'Call Back' || disposition === 'Not Contactable')) {
            fetchUserOutcomes();
        } else {
            setUserOutcomes([]);
        }
    }, [
        user,
        subDisposition,
        disposition
    ]);
    const fetchUserOutcomes = async ()=>{
        if (!user?.uid || !subDisposition) return;
        const { data } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from('user_outcomes').select('*').eq('user_id', user.uid).eq('parent_category', subDisposition);
        setUserOutcomes(data || []);
    };
    const handleAddOutcome = async ()=>{
        if (!newOutcomeInput.trim() || !user?.uid || !subDisposition) return;
        try {
            const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from('user_outcomes').insert({
                user_id: user.uid,
                parent_category: subDisposition,
                outcome_label: newOutcomeInput.trim()
            });
            if (error) throw error;
            setNewOutcomeInput("");
            setIsAddingOutcome(false);
            fetchUserOutcomes();
        } catch (e) {
            console.error("Error adding outcome:", e);
            alert("Failed to add outcome");
        }
    };
    const handleDeleteOutcome = async (id)=>{
        try {
            await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from('user_outcomes').delete().eq('id', id);
            fetchUserOutcomes();
        } catch (e) {
            console.error("Error deleting outcome:", e);
        }
    };
    const handleSkipCall = async ()=>{
        if (!user?.uid || !campaignId || !customerId) return;
        try {
            // Update the callback timestamp to null effectively skipping/rescheduling it later
            // Or better, keep it but just move to next lead without calling.
            // Requirement was: "skip follow up call" which usually means treat as done or move forward.
            // Let's assume it means "Mark as skipped/done for now" or just find next lead.
            // Based on context of "Skip", we probably just want to execute "End/Next" logic without placing a call.
            // Actually, handleEndCall(false) might try to update SyncMeta logs which is fine.
            // But we didn't start a call.
            // To be safe, let's just use the router logic to go to next or dashboard 
            // similar to handleSaveDisposition's flow but simpler.
            // OR reuse handleEndCall logic if it handles "no call started" gracefully.
            // Looking at handleEndCall: "if localCallingStatus !== connected ... setCallDuration(0)"
            // It seems safe to call handleEndCall(false) to trigger the "Post Call" state 
            // so user can disposition it as "Skipped" or "Not Contactable" etc.
            // Wait, UI text says "Skip Follow Up". If we drag, does it mean "Don't call this guy, give me next"?
            // If so, we should probably just navigate away.
            // Let's assume the user wants to Disposition it as "Skipped" or just return to queue.
            // For now, let's make it trigger the "Post Call" view immediately without dialing.
            handleEndCall(false);
        } catch (error) {
            console.error("Error skipping call:", error);
        }
    };
    const primaryDispositions = isAccessDeniedManual && customer?.disposition !== 'Not Contactable' ? [
        "Call Back",
        "Deal Done"
    ] : Object.keys(dispositionHierarchy);
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        let interval;
        const updateDuration = ()=>{
            if (isCalling && callStartTime) {
                // Calibrate duration using server offset
                const now = Date.now() + serverTimeOffset;
                const diff = Math.floor((now - callStartTime) / 1000);
                setCallDuration(diff > 0 ? diff : 0);
            }
        };
        if (isCalling && callStartTime && !isAssigning) {
            updateDuration(); // Sync immediately
            interval = setInterval(updateDuration, 1000);
        } else {
            clearInterval(interval);
        }
        return ()=>clearInterval(interval);
    }, [
        isCalling,
        callStartTime,
        serverTimeOffset,
        isAssigning
    ]);
    const formatTime = (seconds)=>{
        const hours = Math.floor(seconds / 3600);
        const mins = Math.floor(seconds % 3600 / 60);
        const secs = seconds % 60;
        if (hours > 0) {
            return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };
    const formatDate = (dateStr)=>{
        if (!dateStr) return '—';
        try {
            const date = new Date(dateStr);
            if (isNaN(date.getTime())) return '—';
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = String(date.getFullYear());
            return `${day}/${month}/${year}`;
        } catch (e) {
            return '—';
        }
    };
    const formatFileSize = (bytes)=>{
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = [
            'Bytes',
            'KB',
            'MB',
            'GB'
        ];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    };
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        if (customer?.customer_details) {
            try {
                const data = typeof customer.customer_details === 'string' ? JSON.parse(customer.customer_details) : customer.customer_details;
                if (data?.active_details) {
                    setViewingDetailsKey(data.active_details);
                }
            } catch (e) {}
        }
    }, [
        customer
    ]);
    const renderCleanedDetails = (details)=>{
        if (!details) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
            className: "text-gray-400 italic",
            children: "No information available"
        }, void 0, false, {
            fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
            lineNumber: 730,
            columnNumber: 30
        }, this);
        let rawData = details;
        if (typeof details === 'string') {
            try {
                rawData = JSON.parse(details);
            } catch (e) {
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                    className: "italic",
                    children: [
                        '"',
                        details,
                        '"'
                    ]
                }, void 0, true, {
                    fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                    lineNumber: 737,
                    columnNumber: 24
                }, this);
            }
        }
        if (typeof rawData !== 'object' || rawData === null) {
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                className: "italic",
                children: [
                    '"',
                    String(rawData),
                    '"'
                ]
            }, void 0, true, {
                fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                lineNumber: 742,
                columnNumber: 20
            }, this);
        }
        let data = rawData;
        let isStructured = false;
        let keys = [];
        if (rawData.active_details && rawData.history) {
            isStructured = true;
            keys = Object.keys(rawData.history).sort((a, b)=>{
                const numA = parseInt(a.split('-')[1]);
                const numB = parseInt(b.split('-')[1]);
                return numA - numB;
            });
            const currentKey = viewingDetailsKey || rawData.active_details;
            data = rawData.history[currentKey] || {};
        }
        const handleNext = ()=>{
            const currentKey = viewingDetailsKey || rawData.active_details;
            const currentIndex = keys.indexOf(currentKey);
            const nextIndex = (currentIndex + 1) % keys.length;
            setViewingDetailsKey(keys[nextIndex]);
        };
        const handlePrev = ()=>{
            const currentKey = viewingDetailsKey || rawData.active_details;
            const currentIndex = keys.indexOf(currentKey);
            const prevIndex = (currentIndex - 1 + keys.length) % keys.length;
            setViewingDetailsKey(keys[prevIndex]);
        };
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
            className: "flex flex-col h-full",
            children: [
                isStructured && keys.length > 1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: "flex items-center justify-between mb-5 bg-indigo-50 p-1.5 rounded-2xl border border-indigo-100 shadow-sm",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                            onClick: handlePrev,
                            className: "w-9 h-9 flex items-center justify-center bg-white border border-indigo-200 rounded-xl text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all active:scale-90 shadow-sm",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                className: "fi flex fi-rr-angle-left mt-0.5"
                            }, void 0, false, {
                                fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                lineNumber: 782,
                                columnNumber: 29
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                            lineNumber: 778,
                            columnNumber: 25
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "flex flex-col items-center",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                    className: "text-[8px] font-black text-indigo-300 uppercase tracking-tighter",
                                    children: "DATA HISTORY"
                                }, void 0, false, {
                                    fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                    lineNumber: 786,
                                    columnNumber: 29
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                    className: "text-xs font-black text-indigo-900",
                                    children: String(viewingDetailsKey || rawData.active_details).replace('details-', 'RECORD #')
                                }, void 0, false, {
                                    fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                    lineNumber: 787,
                                    columnNumber: 29
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                            lineNumber: 785,
                            columnNumber: 25
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                            onClick: handleNext,
                            className: "w-9 h-9 flex items-center justify-center bg-white border border-indigo-200 rounded-xl text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all active:scale-90 shadow-sm",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                className: "fi flex fi-rr-angle-right mt-0.5"
                            }, void 0, false, {
                                fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                lineNumber: 796,
                                columnNumber: 29
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                            lineNumber: 792,
                            columnNumber: 25
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                    lineNumber: 777,
                    columnNumber: 21
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: "grid grid-cols-1 gap-3",
                    children: Object.entries(data).map(([key, value])=>{
                        const cleanKey = key.replace(/_(un)?checked/gi, '').replace(/_/g, ' ');
                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "flex flex-col border-b border-gray-50 pb-2 last:border-0 last:pb-0",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                    className: "text-[10px] font-semibold uppercase tracking-wider mb-0.5",
                                    style: {
                                        color: "#787E9D",
                                        fontFamily: "'Roboto', sans-serif"
                                    },
                                    children: cleanKey
                                }, void 0, false, {
                                    fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                    lineNumber: 805,
                                    columnNumber: 33
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                    className: "text-[13px] font-semibold",
                                    style: {
                                        color: "#263238",
                                        fontFamily: "'Poppins', sans-serif"
                                    },
                                    children: String(value)
                                }, void 0, false, {
                                    fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                    lineNumber: 806,
                                    columnNumber: 33
                                }, this)
                            ]
                        }, key, true, {
                            fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                            lineNumber: 804,
                            columnNumber: 29
                        }, this);
                    })
                }, void 0, false, {
                    fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                    lineNumber: 800,
                    columnNumber: 17
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
            lineNumber: 775,
            columnNumber: 13
        }, this);
    };
    const fetchAuth = async ()=>{
        const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$authService$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["checkAuthAndFetchProfile"])();
        if (result.shouldRedirect) {
            router.push("/portal/login");
            return;
        }
        if (result.user) setUser(result.user);
        // Calibration
        if (result.serverNow) {
            const serverMs = new Date(result.serverNow).getTime();
            const localMs = Date.now();
            const offset = serverMs - localMs;
            console.log(`[Time-Calib] Server Offset: ${offset}ms`);
            setServerTimeOffset(offset);
        }
    };
    const handleUpdateManagedBy = async (userId)=>{
        if (!customer?.id) return;
        try {
            const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from('customers').update({
                managed_by: userId
            }).eq('id', customer.id);
            if (error) throw error;
            setCustomer((prev)=>({
                    ...prev,
                    managed_by: userId
                }));
            // Update local info immediately
            const foundInCampaign = campaign?.users?.find((u)=>(u.user_id || u.id) === userId);
            if (foundInCampaign) {
                setManagedByInfo({
                    name: foundInCampaign.name,
                    empId: foundInCampaign.employee_id || userId.slice(0, 8).toUpperCase()
                });
            } else {
                setManagedByInfo({
                    name: "Self",
                    empId: ""
                });
            }
            setIsAssignPickerOpen(false);
        } catch (err) {
            console.error("Error updating managed_by:", err);
            alert("Failed to update manager");
        }
    };
    const handleUpdateExpiry = async (newDate)=>{
        if (!customer?.id || !newDate) return;
        setSaving(true);
        try {
            const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from('customers').update({
                expiry_date: newDate
            }).eq('id', customer.id);
            if (error) throw error;
            setCustomer((prev)=>({
                    ...prev,
                    expiry_date: newDate
                }));
            setIsEditingExpiry(false);
        } catch (err) {
            console.error("Error updating expiry_date:", err);
            alert("Failed to update expiry date");
        } finally{
            setSaving(false);
        }
    };
    const handleEditDetailsClick = ()=>{
        let currentData = {};
        if (customer?.customer_details) {
            try {
                const rawData = typeof customer.customer_details === 'string' ? JSON.parse(customer.customer_details) : customer.customer_details;
                if (rawData?.active_details && rawData?.history) {
                    const activeKey = viewingDetailsKey || rawData.active_details;
                    currentData = rawData.history[activeKey] || {};
                } else if (rawData && typeof rawData === 'object') {
                    currentData = rawData;
                }
            } catch (e) {
                console.error("Error parsing details for editor:", e);
                // If it's a string but NOT JSON, we treat it as value for a generic 'Note' field
                if (typeof customer.customer_details === 'string') {
                    currentData = {
                        "Details": customer.customer_details
                    };
                }
            }
        }
        // Convert to array of objects for easier editing
        const detailsArray = Object.entries(currentData).map(([key, value])=>({
                id: Math.random().toString(36).substring(2, 9),
                key: key.replace(/_(un)?checked/gi, '').replace(/_/g, ' '),
                originalKey: key,
                value: String(value)
            }));
        setTempDetails(detailsArray);
        setIsEditingDetails(true);
    };
    const handleSaveDetails = async ()=>{
        if (!customer?.id) return;
        setSaving(true);
        try {
            const updatedSubData = {};
            tempDetails.forEach((item)=>{
                if (!item.key.trim()) return;
                // Use original key if it hasn't changed, otherwise derive from key name
                const k = item.originalKey || item.key.trim().replace(/\s+/g, '_').toLowerCase();
                updatedSubData[k] = item.value;
            });
            let finalDetails = customer.customer_details;
            if (typeof finalDetails === 'string') {
                try {
                    finalDetails = JSON.parse(finalDetails);
                } catch (e) {
                    // Not JSON? Overwrite with object
                    finalDetails = updatedSubData;
                }
            }
            if (finalDetails && typeof finalDetails === 'object' && finalDetails.active_details && finalDetails.history) {
                const activeKey = viewingDetailsKey || finalDetails.active_details;
                finalDetails.history[activeKey] = updatedSubData;
            } else {
                finalDetails = updatedSubData;
            }
            const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from('customers').update({
                customer_details: typeof finalDetails === 'string' ? finalDetails : JSON.stringify(finalDetails)
            }).eq('id', customer.id);
            if (error) throw error;
            setCustomer((prev)=>({
                    ...prev,
                    customer_details: finalDetails
                }));
            setIsEditingDetails(false);
        } catch (err) {
            console.error("Error saving details:", err);
            alert("Failed to save details");
        } finally{
            setSaving(false);
        }
    };
    const fetchData = async (overrideId)=>{
        const idToFetch = overrideId || customerId;
        if (!campaignId || !idToFetch || !user) return;
        setError("");
        // ⚡ INSTANT PRE-FETCH RESTORATION
        const isPrefetched = prefetchedDataRef.current && String(prefetchedDataRef.current.id) === String(idToFetch);
        if (isPrefetched) {
            setCustomer(prefetchedDataRef.current.customer);
            setLiveNotes(prefetchedDataRef.current.customer?.live_notes || "");
            if (prefetchedDataRef.current.history) setHistory(prefetchedDataRef.current.history);
            setLoading(false);
        // Removed setIsAssigning(false) from here to prevent flicker
        }
        // Refresh schedules and timeline when loading a lead (if no cache)
        fetchSchedules();
        fetchDailyStats();
        try {
            if (!isPrefetched) {
                setLoading(true);
            }
            // 0. STRICT PERMISSION GUARD (Optimized: Skip network if campaign is already cached)
            let campData = null;
            if (campaign && String(campaign.id) === String(campaignId)) {
                campData = campaign;
            } else {
                const { data: fetchedCamp, error: campErr } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from('campaigns').select('*, organizations(id, company_name, org_code)').eq('id', campaignId).single();
                if (campErr) throw campErr;
                campData = fetchedCamp;
            }
            if (campData && user) {
                const normalizedDesignation = (user.designation || "").toLowerCase();
                const assignedList = Array.isArray(campData.users) ? campData.users : [];
                // Robust Assignment Check (Checks both user_id and id for compatibility)
                const isAssignee = assignedList.some((u)=>u.user_id && String(u.user_id) === String(user.uid) || u.id && String(u.id) === String(user.uid));
                let hasAccess = !user.isClient; // Internal staff always has global access
                if (user.isClient) {
                    // 1. Organization Check (Mandatory)
                    if (campData.organization_id === user.organization_id) {
                        // 2. Role Check
                        if ([
                            'ceo',
                            'developer',
                            'manager'
                        ].includes(normalizedDesignation)) {
                            hasAccess = true; // Admins see everything in their org
                        } else if (normalizedDesignation === 'team_leader') {
                            // For TL, we just check if they are explicitly assigned to this CAM
                            if (isAssignee) hasAccess = true;
                            else hasAccess = isAssignee;
                        } else {
                            // Agents MUST be assigned
                            hasAccess = isAssignee;
                        }
                    }
                    // 3. SPECIAL MANUAL OVERRIDE (Allow if an active manual session exists for this user/campaign)
                    if (!hasAccess) {
                        try {
                            const { data: guardSession } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from('call_sessions').select('is_unassigned, is_manual, manual_customer_id').eq('user_id', user.uid).eq('campaign_id', campaignId).maybeSingle();
                            if (guardSession?.is_manual && guardSession?.manual_customer_id === idToFetch) {
                                console.log("[Guard] Allowing temporary access for unauthorized manual dial.");
                                hasAccess = true;
                                setIsAccessDeniedManual(true);
                            } else if (guardSession?.is_unassigned && guardSession?.is_manual) {
                                console.log("[Guard] Allowing access via active unassigned manual session.");
                                hasAccess = true;
                            }
                        } catch (e) {
                            console.error("[Guard] Manual session check error:", e);
                        }
                    }
                }
                if (!hasAccess && user.isClient) {
                    console.warn(`[Guard] Access Denied for ${user.email} (Role: ${normalizedDesignation}) to Campaign ${campaignId}. Redirecting.`);
                    setLoading(false);
                    router.push(`/portal/campaign`);
                    return;
                }
            }
            // 1. Fetch Campaign (Static for the page)
            // Use the data retrieved during the guard to avoid double query
            if (campData) {
                setCampaign(campData);
            } else if (!campaign) {
                const { data: fallbackData } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from('campaigns').select('*, organizations(id, company_name, org_code)').eq('id', campaignId).limit(1);
                if (fallbackData?.[0]) setCampaign(fallbackData[0]);
            }
            // 2. Fetch Customer (Try all three tables)
            let foundCustomer = null;
            if (isPrefetched) {
                foundCustomer = prefetchedDataRef.current.customer;
                prefetchedDataRef.current = null; // Clear now that we've used it
                console.log('⚡ [Pre-fetch] Sync complete!');
            } else {
                // Try primary customers table
                const { data: cDataRows } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from('customers').select('*').eq('id', idToFetch).limit(1);
                if (cDataRows && cDataRows[0]) {
                    foundCustomer = cDataRows[0];
                } else {
                    // Try closed_deals
                    const { data: clDataRows } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from('closed_deals').select('*').eq('id', idToFetch).limit(1);
                    if (clDataRows && clDataRows[0]) {
                        foundCustomer = clDataRows[0];
                    } else {
                        // Try rejected_leads
                        const { data: rDataRows } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from('rejected_leads').select('*').eq('id', idToFetch).limit(1);
                        if (rDataRows && rDataRows[0]) foundCustomer = rDataRows[0];
                    }
                }
            }
            if (foundCustomer) {
                // User Requirement: Treat as unauthorized if assigned to someone else
                if (foundCustomer.assigned_to && String(foundCustomer.assigned_to) !== String(user.uid)) {
                    console.warn(`[Guard] Lead assigned to another user: ${foundCustomer.assigned_to}. Restricting access.`);
                    setIsAccessDeniedManual(true);
                }
                setCustomer(foundCustomer);
                setLiveNotes(foundCustomer.live_notes || "");
                if (typeof customerId === 'string') {
                    fetchAttachments(String(customerId));
                }
                // Resolve Manager Info
                if (foundCustomer.managed_by) {
                    // Try global user profiles
                    const { data: mRows } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from('user_profiles').select('user_name, employee_id').eq('user_id', foundCustomer.managed_by).limit(1);
                    const mData = mRows ? mRows[0] : null;
                    if (mData) {
                        setManagedByInfo({
                            name: mData.user_name || "Unknown",
                            empId: mData.employee_id || foundCustomer.managed_by.slice(0, 8).toUpperCase()
                        });
                    } else {
                        // Fallback to campaign users
                        const campUser = campaign?.users?.find((u)=>(u.user_id || u.id) === foundCustomer.managed_by);
                        setManagedByInfo({
                            name: campUser?.name || "Unknown",
                            empId: campUser?.employee_id || foundCustomer.managed_by.slice(0, 8).toUpperCase()
                        });
                    }
                } else {
                    setManagedByInfo({
                        name: "Self",
                        empId: ""
                    });
                }
            } else {
                console.warn(`[Fetch] Customer ${idToFetch} not found in any table.`);
                // Ghost Session Recovery: If this missing customer is currently assigned to the user, clear it and re-assign.
                const { data: ghostSession } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from('call_sessions').select('*').eq('user_id', user.uid).eq('campaign_id', campaignId).maybeSingle();
                const sessionData = ghostSession;
                // If user has a session for THIS missing customer, clear and re-assign
                if (sessionData && sessionData.customer_id === idToFetch) {
                    console.log(`[Ghost-Recovery] Ghost session detected for customer ${idToFetch}. Clearing and re-assigning...`);
                    await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from('call_sessions').delete().eq('user_id', user.uid).eq('campaign_id', campaignId);
                    const { data: nextLeadId } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].rpc('assign_next_lead', {
                        p_campaign_id: campaignId,
                        p_user_id: user.uid
                    });
                    const targetCampaignId = campaignId || campaign?.id;
                    if (nextLeadId && targetCampaignId) {
                        await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from('call_sessions').upsert({
                            user_id: user.uid,
                            campaign_id: targetCampaignId,
                            customer_id: nextLeadId,
                            organization_id: campData?.organization_id,
                            status: 'assigned',
                            is_manual: false,
                            manual_campaign_id: null,
                            manual_customer_id: null,
                            manual_status: null,
                            call_start_at: null,
                            updated_at: new Date().toISOString()
                        }, {
                            onConflict: 'user_id,campaign_id'
                        });
                        setLocalCallingStatus(null);
                        setIsAssigning(true);
                        setAssignmentCountdown(3);
                        setTargetNextLead({
                            id: nextLeadId,
                            campaignId: targetCampaignId
                        });
                        fetchDailyStats();
                        return;
                    } else if (targetCampaignId) {
                        setIsAssigning(true);
                        setAssignmentCountdown(3);
                        setTargetNextLead({
                            id: "",
                            campaignId: targetCampaignId
                        }); // fallback to campaign list
                        fetchDailyStats();
                        return;
                    } else {
                        setIsAssigning(true);
                        setAssignmentCountdown(3);
                        setTargetNextLead(null); // default fallback
                        fetchDailyStats();
                        return;
                    }
                } else {
                    // No matching session for this missing customer, but page is broken. 
                    // Redirect to dashboard to be safe.
                    console.warn(`[Fetch] No session matches missing customer ${idToFetch}. Redirecting to safety.`);
                    const targetCampaignId = campaignId || campaign?.id;
                    if (targetCampaignId) {
                        router.push(`/portal/campaign/${targetCampaignId}`);
                    } else {
                        router.push('/portal/campaign');
                    }
                    return;
                }
            }
            // 3. Fetch History (Call Logs) - Use Secure API to bypass RLS
            // Skip ONLY IF history was already set via prefetch above
            if (!history || history.length === 0 || history[0]?.customer_id !== idToFetch) {
                try {
                    const historyResponse = await fetch(`/api/call/history?customerId=${idToFetch}`);
                    const historyResult = await historyResponse.json();
                    if (historyResult.success && historyResult.data) {
                        console.log(`[Fetch] Found ${historyResult.data.length} history records via API.`);
                        setHistory(historyResult.data);
                    } else {
                        console.error("[Fetch] History API error:", historyResult.error);
                        setHistory([]);
                    }
                } catch (err) {
                    console.error("[Fetch] History API exception:", err);
                    setHistory([]);
                }
            }
            // 4. Fetch Mobile Call Logs (New Logic)
            if (foundCustomer?.phone_no) {
                try {
                    // Clean phone number for matching (remove special chars, take last 10 digits)
                    const rawPhone = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$phoneUtils$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["decryptPhone"])(foundCustomer.phone_no);
                    const cleanPhone = String(rawPhone || "").replace(/\D/g, '').slice(-10);
                    if (cleanPhone && cleanPhone.length >= 10) {
                        const { data: mobileData, error: mobileError } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from('call_history').select('*').or(`number.eq.${cleanPhone},number.ilike.%${cleanPhone}`).order('timestamp', {
                            ascending: false
                        });
                        if (mobileError) throw mobileError;
                        // Fetch User Names
                        let enrichedLogs = mobileData || [];
                        if (enrichedLogs.length > 0) {
                            const empIds = [
                                ...new Set(enrichedLogs.map((l)=>l.employee_id).filter(Boolean))
                            ];
                            const deviceIds = [
                                ...new Set(enrichedLogs.map((l)=>l.device_id).filter(Boolean))
                            ];
                            const promises = [];
                            if (empIds.length > 0) {
                                promises.push(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from('user_profiles').select('employee_id, user_name').in('employee_id', empIds));
                            }
                            if (deviceIds.length > 0) {
                                promises.push(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from('sync_meta').select('device_id, device_model, employee_id').in('device_id', deviceIds));
                            }
                            const results = await Promise.all(promises);
                            const rawUsers = empIds.length > 0 ? results[0].data : [];
                            const devices = deviceIds.length > 0 ? empIds.length > 0 ? results[1]?.data : results[0]?.data : [];
                            // If some logs didn't have employee_id, try to recover from sync_meta and fetch more users
                            let allUsers = [
                                ...rawUsers
                            ];
                            const recoveredEmpIds = devices?.map((d)=>d.employee_id).filter((id)=>id && !empIds.includes(id));
                            if (recoveredEmpIds && recoveredEmpIds.length > 0) {
                                const { data: moreUsers } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from('user_profiles').select('employee_id, user_name').in('employee_id', recoveredEmpIds);
                                if (moreUsers) allUsers = [
                                    ...allUsers,
                                    ...moreUsers
                                ];
                            }
                            enrichedLogs = enrichedLogs.map((log)=>{
                                const foundDevice = devices?.find((d)=>d.device_id === log.device_id);
                                const effectiveEmpId = log.employee_id || foundDevice?.employee_id;
                                const foundUser = allUsers?.find((u)=>u.employee_id === effectiveEmpId);
                                return {
                                    ...log,
                                    employee_id: effectiveEmpId,
                                    agent_name: foundUser?.user_name,
                                    device_model: foundDevice?.device_model
                                };
                            });
                        }
                        setMobileLogs(enrichedLogs);
                    } else {
                        setMobileLogs([]);
                    }
                } catch (err) {
                    console.error("[Fetch] Mobile logs error:", err);
                    setMobileLogs([]);
                }
            }
            // 4. Initial Session State (Active Call/Disposition Recovery)
            // Check if there is an active session for the CURRENT lead (Primary or Manual)
            const { data: currentSession } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from('call_sessions').select('*').eq('user_id', user.uid).eq('campaign_id', campaignId).maybeSingle();
            if (currentSession) {
                const session = currentSession;
                const isManualModeFromSession = session.is_manual === true;
                // Determine which lead this session is actually tracking for the current view
                const sessionCustomerId = isManualModeFromSession ? session.manual_customer_id : session.customer_id;
                const sessionStatus = isManualModeFromSession ? session.manual_status || session.status : session.status;
                const sessionStartTime = session.call_start_at;
                if (String(sessionCustomerId) === String(idToFetch)) {
                    console.log(`[Fetch-Session] Active session found for this lead: ${sessionStatus}`);
                    setIsManualMode(isManualModeFromSession);
                    // Check for interruption: Manual customer != Preserved customer
                    if (isManualModeFromSession && session.manual_customer_id && session.customer_id && String(session.manual_customer_id) !== String(session.customer_id)) {
                        setIsInterruption(true);
                    } else {
                        setIsInterruption(false);
                    }
                    if (sessionStatus === 'active') {
                        setIsCalling(true);
                        setPostCall(false);
                        if (sessionStartTime) {
                            const start = parseUTCtoMS(sessionStartTime);
                            if (start) setCallStartTime(start);
                        }
                    } else if (sessionStatus === 'disposition_pending') {
                        setIsCalling(false);
                        setPostCall(true);
                    }
                }
            }
        } catch (err) {
            console.error("[Fetch] Error in fetchData:", err);
            setError(err.message);
        } finally{
            setLoading(false);
            // Automatically clear transition screen after 3.5s if it gets stuck
            if (isAssigning) {
                setTimeout(()=>setIsAssigning(false), 3500);
            }
        }
    };
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        fetchAuth();
    }, []);
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        if (router.isReady && user) {
            // Reset states for new customer
            setCustomer(null);
            setHistory([]);
            setDisposition("");
            setSubDisposition("");
            setNotes("");
            const cNow = new Date();
            const futureLoad = new Date(cNow.getTime() + 5 * 60000);
            setCallbackDate(`${futureLoad.getFullYear()}-${String(futureLoad.getMonth() + 1).padStart(2, '0')}-${String(futureLoad.getDate()).padStart(2, '0')}`);
            setCallbackTime(futureLoad.toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            }));
            setCallDuration(0);
            setIsCalling(false);
            setPostCall(false);
            setLocalCallingStatus(null);
            setIsAccessDeniedManual(false);
            setError("");
            setLocalCallingStatus(null);
            setIsAccessDeniedManual(false);
            setError("");
            // Reset assignment ONLY if it wasn't triggered intentionally (safety)
            if (!targetNextLead) {
                setIsAssigning(false);
                setAssignmentCountdown(3);
            }
            setIsPhoneUnmasked(false);
            fetchData();
        }
    }, [
        router.isReady,
        campaignId,
        customerId,
        user?.uid
    ]);
    // ⏱️ Consolidated Countdown & Navigation Logic
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        if (!isAssigning) return;
        const timer = setInterval(()=>{
            setAssignmentCountdown((prev)=>{
                if (prev <= 1) {
                    clearInterval(timer);
                    // Navigation trigger
                    if (targetNextLead?.id) {
                        router.push(`/portal/campaign/${targetNextLead.campaignId}/${targetNextLead.id}`);
                    } else if (targetNextLead?.campaignId) {
                        router.push(`/portal/campaign/${targetNextLead.campaignId}`);
                    } else {
                        router.push('/portal/campaign');
                    }
                    setIsAssigning(false);
                    setTargetNextLead(null);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return ()=>clearInterval(timer);
    }, [
        isAssigning,
        targetNextLead,
        router
    ]);
    const parseUTCtoMS = (timestamp)=>{
        if (!timestamp) return null;
        // Normalize: replace space with T, and handle offsets
        let normalized = timestamp.replace(" ", "T");
        // If it ends with +00 or +00:00, replace with Z for absolute UTC parsing
        if (normalized.includes("+00")) {
            normalized = normalized.split("+")[0] + "Z";
        }
        const date = new Date(normalized);
        const ms = date.getTime();
        if (isNaN(ms)) {
            console.error('[Time] Invalid timestamp format:', timestamp);
            return null;
        }
        return ms; // Returns UTC milliseconds
    };
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        if (isApiUpdatingRef.current) return;
        const currentCustomerId = String(customerId || "");
        // Find if there's a session for the lead we are CURRENTLY viewing
        // This allows the UI to stay 'active' even if we are manually inspecting while another lead is 'Hot'
        const thisLeadSession = allSessions.find((s)=>String(s.customer_id) === currentCustomerId);
        // We prioritize the globalHotSession if we are NOT manually locked, 
        // but if we are manually on THIS page, we use thisLeadSession to drive the buttons/timer.
        const sessionToProcess = thisLeadSession || globalHotSession;
        if (!sessionToProcess) {
            setIsCalling(false);
            setPostCall(false);
            setCallDuration(0);
            return;
        }
        const isManualModeFromSession = sessionToProcess.is_manual === true;
        const sessionStatus = isManualModeFromSession ? sessionToProcess.manual_status || sessionToProcess.status : sessionToProcess.status;
        setIsManualMode(isManualModeFromSession);
        setIsInterruption(!!(isManualModeFromSession && sessionToProcess.manual_customer_id && sessionToProcess.customer_id && String(sessionToProcess.manual_customer_id) !== String(sessionToProcess.customer_id)));
        if (sessionStatus === 'active') {
            setPostCall(false);
            setIsCalling(true);
            if (sessionToProcess.call_start_at) {
                const start = parseUTCtoMS(sessionToProcess.call_start_at);
                if (start) setCallStartTime(start);
            }
        } else if (sessionStatus === 'assigned') {
            setIsCalling(false);
            setPostCall(false);
            setIsAssigning(false);
            setCallDuration(0);
            setCallStartTime(null);
        } else if (sessionStatus === 'disposition_pending') {
            setIsCalling(false);
            setPostCall(true);
        } else if (sessionStatus === 'closed') {
            setIsCalling(false);
            setPostCall(false);
            setIsAssigning(false);
            setCallDuration(0);
            setCallStartTime(null);
        }
    }, [
        globalHotSession,
        allSessions,
        customerId
    ]);
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        // Only check status if calling is active
        if (!user?.employeeId || !isCalling) return;
        const fetchStatus = async ()=>{
            try {
                const { data } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from('sync_meta').select('calling_status').eq('employee_id', user.employeeId).eq('is_primary', true).maybeSingle();
                if (data?.calling_status) {
                    setLocalCallingStatus(data.calling_status);
                }
            } catch (e) {
                console.error("Status polling error:", e);
            }
        };
        fetchStatus();
        const interval = setInterval(fetchStatus, 30000); // 30s status polling (matching heartbeat)
        return ()=>clearInterval(interval);
    }, [
        user?.employeeId,
        isCalling
    ]);
    // Initial State Restoration
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        if (user && campaignId && customerId) {
            const session = user.currentCallSession;
            // Check if this is the active session for the current page
            if (session && String(session.campaign_id) === String(campaignId) && String(session.customer_id) === String(customerId)) {
                if (session.status === 'active') {
                    setIsCalling(true);
                    setPostCall(false);
                    // Calculate duration since start
                    if (session.call_start_at) {
                        const start = parseUTCtoMS(session.call_start_at);
                        if (start) setCallStartTime(start);
                    }
                } else if (session.status === 'assigned') {
                    setIsCalling(false);
                    setPostCall(false);
                } else if (session.status === 'disposition_pending') {
                    setIsCalling(false);
                    setPostCall(true);
                }
            }
        }
    }, [
        user,
        campaignId,
        customerId
    ]);
    // Prevent Past Time Selection: If user picks a time that passed today, show alert
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        if (!callbackTime || !callbackDate || loading) return;
        const now = new Date();
        const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
        if (callbackDate === todayStr) {
            const [hours, minutes] = callbackTime.split(':').map(Number);
            const selectedDateTime = new Date();
            selectedDateTime.setHours(hours, minutes, 0, 0);
            // 1-minute grace period to avoid annoying alerts on just-passed seconds
            if (selectedDateTime.getTime() < now.getTime() - 60000) {
                alert("⚠️ Cannot schedule a callback in the past! Please select a future time.");
                // Reset to current time
                const correctedTime = new Date();
                setCallbackTime(correctedTime.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false
                }));
            }
        }
        // Clear conflict on change to allow new check
        if (conflictInfo) setConflictInfo(null);
    }, [
        callbackTime,
        callbackDate,
        loading
    ]);
    const fetchDailyStats = async ()=>{
        if (!user?.uid || !campaignId) return;
        try {
            const todayStart = new Date();
            todayStart.setHours(0, 0, 0, 0);
            const { count, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from('call_logs').select('*', {
                count: 'exact',
                head: true
            }).eq('last_updated_by', user.uid).eq('campaign_id', campaignId).gte('created_at', todayStart.toISOString());
            if (!error && count !== null) {
                setDailyLeadCount(count);
            }
        } catch (e) {
            console.error("Error fetching daily stats:", e);
        }
    };
    // 🔥 SYNC GLOBAL CALL STATUS FLAG
    // This ensures that the CallReminderOverlay (and other components) know the user is busy
    // whenever they are either on an active call OR pending a disposition.
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        const isBusy = isCalling || postCall;
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
    }, [
        isCalling,
        postCall
    ]);
    // Background Lead Pre-fetching
    const prefetchPromiseRef = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useRef"])(null);
    const prefetchedDataRef = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        // USER RULE: 
        // 1. Standard CRM Lead (isManualMode == false) -> Prefetch Next
        // 2. Manual Call on THE SAME lead (Manual == System) -> Prefetch Next
        // 3. Manual Interruption (Manual != System) -> DONT Prefetch
        const shouldPrefetch = !isManualMode || isManualMode && !isInterruption;
        if (disposition && user?.uid && campaignId && customerId && prefetchStatus === 'idle' && shouldPrefetch) {
            console.log('⚡ [Pre-fetch] Background fetching next lead & data...');
            setPrefetchStatus('fetching');
            const performPrefetch = async (retryCount = 0)=>{
                try {
                    // Set a timeout of 10 seconds for lead assignment
                    const timeoutPromise = new Promise((_, rej)=>setTimeout(()=>rej(new Error("Timeout")), 10000));
                    const rpcPromise = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].rpc('assign_next_lead', {
                        p_campaign_id: campaignId,
                        p_user_id: user.uid,
                        p_exclude_lead_id: customerId
                    });
                    const res = await Promise.race([
                        rpcPromise,
                        timeoutPromise
                    ]);
                    if (res.data) {
                        const nextId = res.data;
                        // Case 4: Duplicate Check -> Recount if we got the same lead back
                        if (String(nextId) === String(customerId) && retryCount < 2) {
                            console.log('🔄 [Pre-fetch] Duplicate lead detected. Retrying...');
                            return performPrefetch(retryCount + 1);
                        }
                        try {
                            const [cRes, hRes] = await Promise.all([
                                __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from('customers').select('*').eq('id', nextId).limit(1).maybeSingle(),
                                fetch(`/api/call/history?customerId=${nextId}`).then((r)=>r.json()).catch(()=>null)
                            ]);
                            prefetchedDataRef.current = {
                                id: nextId,
                                customer: cRes.data,
                                history: hRes?.success ? hRes.data : []
                            };
                            setPrefetchStatus('ready');
                            console.log('⚡ [Pre-fetch] Ready for:', nextId);
                        } catch (e) {
                            console.error('Prefetch data error:', e);
                            setPrefetchStatus('ready'); // Fallback: ID is ready even if profile fetch failed
                        }
                    } else {
                        // Case 1: No Lead Available
                        console.log('🚫 [Pre-fetch] No more leads in campaign.');
                        setPrefetchStatus('none');
                    }
                } catch (err) {
                    console.error('[Pre-fetch] Error or Timeout:', err);
                    setPrefetchStatus('error');
                // Case 3 fallback: Handled during Save attempt
                }
            };
            performPrefetch();
            prefetchPromiseRef.current = true; // Mark as started
        }
        // Reset if disposition is cleared
        if (!disposition) {
            setPrefetchStatus('idle');
            prefetchPromiseRef.current = null;
            prefetchedDataRef.current = null;
        }
    }, [
        disposition,
        user?.uid,
        campaignId,
        customerId,
        prefetchStatus,
        isManualMode,
        isInterruption
    ]);
    const handleStartCall = async ()=>{
        isApiUpdatingRef.current = true; // LOCK ON IMMEDIATELY
        const cId = campaignId;
        const custId = customerId;
        if (!cId || !custId) {
            console.error('[Session] Missing campaignId or customerId in router query');
            return;
        }
        // Flag is now handled automatically by the centralized useEffect watcher above
        // --- Optimistic UI Update ---
        // Set state immediately using local time so the timer starts without waiting for API
        const localNow = new Date();
        setCallStartTime(localNow.getTime());
        setIsCalling(true);
        setPostCall(false);
        setCallDuration(0);
        // ----------------------------
        if (customer?.phone_no) {
            // Trigger Flutter bridge call event
            // SET FLAG: Inform GlobalCallHandler that this is NOT a manual dial
            if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
            ;
            const decryptedPhone = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$phoneUtils$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["decryptPhone"])(customer.phone_no);
            const bridgeConnected = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$flutterBridge$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["notifyFlutter"])('call_to', decryptedPhone);
            if (bridgeConnected) {
                setCallAlive(true);
            } else {
                window.location.href = `tel:${decryptedPhone}`;
            }
            // Sync to SyncMeta table for real-time header reflection
            if (user?.employeeId) {
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$flutterBridge$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["updateSyncMetaCallStatus"])(user.employeeId, 'call_to', decryptedPhone || "");
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$flutterBridge$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["updateSyncMetaCallingStatus"])(user.employeeId, 'preparing');
            }
            setLocalCallingStatus('preparing');
        }
        setDisposition("");
        setSubDisposition("");
        setNotes("");
        const now = new Date();
        const futureCall = new Date(now.getTime() + 5 * 60000);
        setCallbackDate(`${futureCall.getFullYear()}-${String(futureCall.getMonth() + 1).padStart(2, '0')}-${String(futureCall.getDate()).padStart(2, '0')}`);
        setCallbackTime(futureCall.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        }));
        // Persist session to call_sessions table in real-time
        if (user?.uid) {
            console.log('[Session] Attempting to create active session in DB...');
            try {
                const { data: { session: authSession } } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].auth.getSession();
                if (authSession) {
                    const response = await fetch("/api/auth/update-call-session", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${authSession.access_token}`
                        },
                        body: JSON.stringify({
                            campaign_id: cId,
                            customer_id: custId,
                            status: 'active'
                        })
                    });
                    const result = await response.json();
                    if (result.success && result.session?.call_start_at) {
                        console.log('[Session] Active session synced with server time');
                        // Recalibrate offset
                        if (result.server_now) {
                            const sNow = new Date(result.server_now).getTime();
                            const lNow = Date.now();
                            setServerTimeOffset(sNow - lNow);
                        }
                        // Sync with server time to ensure all devices are identical
                        const serverStart = parseUTCtoMS(result.session.call_start_at);
                        if (serverStart) setCallStartTime(serverStart);
                    } else if (!result.success) {
                        console.error('[Session] Failed to persist session:', result.error);
                    }
                } else {
                    isApiUpdatingRef.current = false;
                }
                // Release lock after a short delay for DB to propagate
                setTimeout(()=>{
                    isApiUpdatingRef.current = false; // LOCK OFF
                }, 2000);
            } catch (err) {
                console.error('[Session] Network error persisting session:', err);
                isApiUpdatingRef.current = false;
            }
        }
    };
    const handleSaveLiveNotes = async (content)=>{
        const finalContent = content !== undefined ? content : liveNotes;
        if (!customerId || !user?.uid) return;
        setIsSavingLiveNotes(true);
        try {
            const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from('customers').update({
                live_notes: finalContent,
                last_updated_by: user.uid,
                updated_at: new Date().toISOString()
            }).eq('id', customerId);
            if (error) throw error;
        } catch (err) {
            console.error("Error saving live notes:", err);
        } finally{
            setIsSavingLiveNotes(false);
        }
    };
    const fetchAttachments = async (cid)=>{
        try {
            const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from('customer_attachments').select('*').eq('customer_id', cid).order('created_at', {
                ascending: false
            });
            if (error) throw error;
            setAttachments(data || []);
        } catch (err) {
            console.error("Error fetching attachments:", err);
        }
    };
    const handleFileSelect = (e)=>{
        const file = e.target.files?.[0];
        if (!file) return;
        setPendingFile(file);
        setCustomFileName(file.name.split('.').slice(0, -1).join('.'));
    };
    const confirmUpload = async ()=>{
        if (!pendingFile || !customerId || !user?.uid) return;
        setSaving(true);
        try {
            const fileExt = pendingFile.name.split('.').pop();
            const fileName = customFileName ? `${customFileName}.${fileExt}` : pendingFile.name;
            const filePath = `${customerId}/${Date.now()}_${fileName}`;
            // 1. Upload to Storage
            const { error: uploadError } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].storage.from('customer_attachments').upload(filePath, pendingFile);
            if (uploadError) throw uploadError;
            // 2. Save Meta to DB
            const { error: dbError } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from('customer_attachments').insert({
                customer_id: customerId,
                file_path: filePath,
                file_name: fileName,
                file_type: pendingFile.type,
                file_size: pendingFile.size,
                uploaded_by: user.uid
            });
            if (dbError) throw dbError;
            // Success
            setPendingFile(null);
            setCustomFileName("");
            fetchAttachments(customerId);
        } catch (err) {
            console.error("Upload error:", err);
            alert("Failed to upload file. Please check storage permissions.");
        } finally{
            setSaving(false);
        }
    };
    const deleteAttachment = async (id, path)=>{
        if (!confirm("Remove this attachment forever?")) return;
        try {
            // 1. Delete from Storage
            const { error: storageError } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].storage.from('customer_attachments').remove([
                path
            ]);
            if (storageError) throw storageError;
            // 2. Delete from DB
            const { error: dbError } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from('customer_attachments').delete().eq('id', id);
            if (dbError) throw dbError;
            fetchAttachments(customerId);
        } catch (err) {
            console.error("Delete error:", err);
            alert("Failed to delete attachment.");
        }
    };
    const handlePointerDown = (e)=>{
        if ((customer?.status || 'Active').toLowerCase() !== 'followup') return;
        setIsDragging(true);
        startXRef.current = e.clientX;
        try {
            e.target.setPointerCapture(e.pointerId);
        } catch (err) {
        // Ignore
        }
    };
    const handlePointerMove = (e)=>{
        if (!isDragging) return;
        const currentX = e.clientX;
        const diff = currentX - startXRef.current;
        if (diff > 0) {
            setDragX(diff);
        }
    };
    const handlePointerUp = (e)=>{
        if (!isDragging) return;
        setIsDragging(false);
        try {
            e.target.releasePointerCapture(e.pointerId);
        } catch (err) {}
        const containerWidth = containerRef.current?.clientWidth || 300;
        const threshold = containerWidth * 0.4;
        if (dragX > threshold) {
            handleSkipCall();
            setTimeout(()=>setDragX(0), 500);
        } else {
            if (dragX < 5) {
                handleStartCall();
            }
            setDragX(0);
        }
    };
    const handleSkipCalendar = async ()=>{
        if (!user?.uid) return;
        try {
            const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from('user_profiles').update({
                google_calendar_skipped: true
            }).eq('user_id', user.uid);
            if (!error) {
                setUser((prev)=>prev ? {
                        ...prev,
                        googleCalendarSkipped: true
                    } : null);
                setShowCalendarModal(false);
                // Continue with saving disposition after state is updated
                executeSaveDisposition();
            }
        } catch (err) {
            console.error("Error skipping calendar:", err);
            setShowCalendarModal(false);
            executeSaveDisposition();
        }
    };
    const handleConnectCalendar = ()=>{
        // Redirect to Google OAuth
        // Note: Client ID and Redirect URI are managed in Supabase Dashboard
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].auth.signInWithOAuth({
            provider: 'google',
            options: {
                queryParams: {
                    access_type: 'offline',
                    prompt: 'consent'
                },
                scopes: 'https://www.googleapis.com/auth/calendar.events',
                redirectTo: `${window.location.origin}/campaign/${campaignId}/${customerId}`
            }
        });
    };
    const handleSaveDisposition = async ()=>{
        if (!disposition) {
            alert("Please select a primary status");
            return;
        }
        // Flag will be cleared automatically by the watcher when postCall becomes false
        if (dispositionHierarchy[disposition]?.length > 0 && !subDisposition) {
            alert("Please select a specific sub-disposition");
            return;
        }
        if (disposition === 'Call Back') {
            if (!callbackDate || !callbackTime) {
                alert("Please select both Date and Time for Call Back");
                return;
            }
            const selectedDateTime = new Date(`${callbackDate}T${callbackTime}`);
            const now = new Date();
            if (selectedDateTime < now) {
                alert("Cannot schedule a call for a past date/time. Please select a future time.");
                // Reset to current time if past
                const currentFormattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
                const currentFormattedTime = now.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false
                });
                setCallbackDate(currentFormattedDate);
                setCallbackTime(currentFormattedTime);
                return;
            }
            // Slot conflict check before saving
            setCheckingSlot(true);
            try {
                // Ensure minute-level precision by truncating seconds/ms
                const checkDate = new Date(selectedDateTime);
                checkDate.setSeconds(0, 0);
                // Use a 1-minute window check (00 to 59 seconds)
                const startRange = checkDate.toISOString();
                const endRange = new Date(checkDate.getTime() + 59999).toISOString();
                // BUG FIX: Use .limit(1) instead of .maybeSingle(). 
                // .maybeSingle() errors out if multiple conflicts already exist, 
                // which was allowing even more duplicates to be created!
                const { data: conflicts, error: conflictErr } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from('customers').select('id, customer_name, campaign_id, disposition, sub_disposition, outcome, next_called_at').or(`managed_by.eq.${user?.uid},assigned_to.eq.${user?.uid}`).gte('next_called_at', startRange).lte('next_called_at', endRange).neq('id', customerId).limit(1);
                if (conflictErr) console.error("Slot check DB error:", conflictErr);
                if (conflicts && conflicts.length > 0) {
                    setConflictInfo(conflicts[0]);
                    setCheckingSlot(false);
                    return;
                }
            } catch (err) {
                console.error("Slot check execution error:", err);
            }
            setCheckingSlot(false);
        }
        const isFollowup = disposition === 'Call Back' || subDisposition?.toLowerCase().includes('interested') || subDisposition?.toLowerCase().includes('follow up');
        // Show Calendar Modal if user hasn't connected or skipped, AND NOT on mobile (Flutter)
        const isMobile = ("TURBOPACK compile-time value", "undefined") !== 'undefined' && !!window.flutter_inappwebview;
        if (isFollowup && user && !user.googleCalendarConnected && !user.googleCalendarSkipped && !isMobile) {
            setShowCalendarModal(true);
            return;
        }
        executeSaveDisposition();
    };
    const executeSaveDisposition = async (overrideDate, overrideTime)=>{
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        try {
            setSaving(true);
            const finalDate = overrideDate || callbackDate;
            const finalTime = overrideTime || callbackTime;
            // 0. CAPTURE CAMPAIGN PERMISSION EARLY
            let isAssignedToCampaign = false;
            try {
                const { data: campData } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from('campaigns').select('users').eq('id', campaignId).single();
                if (campData?.users && user?.uid) {
                    const assignedUsers = Array.isArray(campData.users) ? campData.users : [];
                    isAssignedToCampaign = assignedUsers.some((u)=>String(u.user_id) === String(user.uid));
                }
                if (user && !user.isClient) isAssignedToCampaign = true;
            } catch (err) {
                console.error("[Disposition] Permission check failed:", err);
            }
            const now = new Date().toISOString();
            // Determine Connection Status
            const isConnected = disposition === 'Call Back' || disposition === 'Deal Done' || disposition === 'Not Intrested' || disposition === 'Language barrier' || disposition === 'DND' || disposition === 'Wrong NO' ? 'contactable' : disposition === 'Not Contactable' ? 'uncontactable' : null;
            // Calculate preliminary log values
            const isRejected = disposition === 'DND' || disposition === 'Language barrier' || disposition === 'Wrong NO' || disposition === 'Ported / Expired' || disposition === 'Not Intrested';
            const isClosed = disposition === 'Deal Done';
            let logNextCalledAt = null;
            let logStatus = 'active';
            let logAssignedTo = null;
            // Pre-calculate status for log
            if (isRejected) logStatus = 'rejected';
            else if (isClosed) logStatus = 'closed';
            else if (disposition === 'Call Back' || subDisposition === 'intrested' || subDisposition === 'Interested' || subDisposition === 'follow up' || subDisposition === 'Follow up') {
                logStatus = 'followup';
                logAssignedTo = user?.uid;
                if (disposition === 'Call Back' && finalDate) {
                    const combinedDT = finalTime ? new Date(`${finalDate}T${finalTime}`) : new Date(finalDate);
                    // Always truncate to the start of the minute for consistency in conflict checks
                    combinedDT.setSeconds(0, 0);
                    logNextCalledAt = combinedDT.toISOString();
                }
            }
            // Determine Correct Assignment for Log
            // Priority: Existing Owner > New Owner (Self)
            const currentOwner = customer?.assigned_to;
            let finalLogAssignedTo = currentOwner;
            // If no owner, or if we are taking ownership (logic below handles the DB update, but log needs to reflect INTENT)
            // Ideally, we should mirror the logic we are about to run?
            // "assigned_to" in call_logs usually means "Who is responsible for this lead AFTER this call?"
            // Re-evaluating the user requirement: "assigned_to me actual assigned user id"
            // If I am overriding, the actual assigned user is the OTHER person.
            // If I am taking ownership, the actual assigned user is ME.
            const shouldAssignToSelfLog = !currentOwner || currentOwner === user?.uid;
            if (shouldAssignToSelfLog) {
                // If it was unassigned, or mine, it is now mine (or stays mine)
                // UNLESS it is valid for retry/followup?
                if (logStatus === 'followup' || logStatus === 'active') {
                    finalLogAssignedTo = user?.uid;
                } else {
                    finalLogAssignedTo = null; // Closed/Rejected have no owner usually
                }
            } else {
                // It is owned by someone else. We preserve that owner in the log.
                finalLogAssignedTo = currentOwner;
            }
            // 1. Save Call Log FIRST
            // agent_id: The "Lead Owner" (or the person responsible).
            //           If lead is owned by someone else -> Use THEIR ID.
            //           If lead is mine or fresh -> Use MY ID.
            // last_updated_by: The person doing the work (Me/TL)
            const logAgentId = finalLogAssignedTo || user?.uid;
            const { error: logError } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from('call_logs').insert({
                customer_id: customerId,
                campaign_id: campaignId,
                organization_id: campaign?.organization_id || customer?.organization_id,
                agent_id: logAgentId,
                last_updated_by: user?.uid,
                disposition: disposition,
                sub_disposition: subDisposition,
                is_connected: isConnected,
                notes: notes,
                duration: disposition === 'Not Contactable' ? 0 : callDuration,
                last_called_at: now,
                updated_at: now,
                next_called_at: logNextCalledAt,
                status: logStatus,
                assigned_to: finalLogAssignedTo,
                outcome: outcome // New outcome field
            });
            if (logError) throw logError;
            // 2. Perform Movement Logic or Update Status
            // 2. Perform Movement Logic or Update Status
            if (isRejected) {
                // Move to rejected table and delete from customers
                const { error: rejectError } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].rpc('move_to_rejected', {
                    p_customer_id: customerId,
                    p_agent_id: user?.uid,
                    p_notes: notes,
                    p_disposition: disposition,
                    p_sub_disposition: subDisposition,
                    p_phone_search_hash: customer?.phone_search_hash || (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$phoneUtils$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["computePhoneHash"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$phoneUtils$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["decryptPhone"])(customer?.phone_no)),
                    p_outcome: outcome
                });
                if (rejectError) throw rejectError;
                fetchSchedules();
            } else if (isClosed) {
                // Move to closed table and delete from customers
                const finalDisposition = subDisposition ? `${disposition} > ${subDisposition}` : disposition;
                const { error: closeError } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].rpc('move_to_closed', {
                    p_customer_id: customerId,
                    p_agent_id: user?.uid,
                    p_notes: notes,
                    p_final_disposition: finalDisposition,
                    p_phone_search_hash: customer?.phone_search_hash || (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$phoneUtils$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["computePhoneHash"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$phoneUtils$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["decryptPhone"])(customer?.phone_no)),
                    p_outcome: outcome
                });
                if (closeError) throw closeError;
                fetchSchedules();
            } else if (disposition === 'Not Contactable') {
                // Return to General Pool immediately (per new user requirement)
                const updatePayload = {
                    last_called_at: now,
                    updated_at: now,
                    last_updated_by: user?.uid,
                    is_connected: isConnected,
                    // Reset assignment (Keep attempts tracking)
                    attempt_count: (customer?.attempt_count || 0) + 1,
                    last_attempt_at: now,
                    next_called_at: null,
                    ref_date: now,
                    assigned_to: null,
                    status: 'active',
                    disposition: disposition,
                    sub_disposition: subDisposition,
                    outcome: outcome
                };
                logStatus = 'active';
                const { error: customerUpdateError } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from('customers').update(updatePayload).eq('id', customerId);
                if (customerUpdateError) throw customerUpdateError;
                fetchSchedules();
            } else {
                // Regular Update (Call Back, etc.)
                const isFollowup = disposition === 'Call Back' || subDisposition === 'intrested' || subDisposition === 'Interested' || subDisposition === 'follow up' || subDisposition === 'Follow up';
                let updatePayload = {
                    disposition: disposition,
                    sub_disposition: subDisposition,
                    notes: notes,
                    is_connected: isConnected,
                    status: isFollowup ? 'followup' : 'active',
                    last_called_at: now,
                    updated_at: now,
                    last_updated_by: user?.uid,
                    outcome: outcome
                };
                // ASSIGNMENT GUARD LOGIC:
                const currentAssignedTo = customer?.assigned_to;
                const shouldAssignToSelf = !currentAssignedTo || currentAssignedTo === user?.uid;
                if (isFollowup && shouldAssignToSelf && isAssignedToCampaign) {
                    updatePayload.assigned_to = user?.uid;
                    logAssignedTo = user?.uid;
                } else if (isFollowup && !isAssignedToCampaign) {
                    // Unauthorized: Preserve existing owner for manual lead.
                    updatePayload.assigned_to = currentAssignedTo;
                    logAssignedTo = currentAssignedTo;
                    console.warn("[Disposition] Unauthorized assignment preserved for manual lead.");
                }
                // Else: if follow-up but owned by someone else -> Keep original owner
                // Unless we want to explicitly steal it? Requirement says NO conflict. 
                // So we preserve the original owner.
                if (!isFollowup && shouldAssignToSelf) {
                    // If moving back to active/fresh state and was mine -> release it?
                    // Usually standard flow releases it to NULL.
                    updatePayload.assigned_to = null;
                    logAssignedTo = null;
                }
                updatePayload.attempt_count = (customer?.attempt_count || 0) + 1;
                updatePayload.last_attempt_at = now;
                if (disposition === 'Call Back' && finalDate) {
                    const combinedDT = finalTime ? new Date(`${finalDate}T${finalTime}`) : new Date(finalDate);
                    // Force minute-level alignment for all callbacks
                    combinedDT.setSeconds(0, 0);
                    const finalISO = combinedDT.toISOString();
                    updatePayload.next_called_at = finalISO;
                    updatePayload.ref_date = finalISO; // Unified priority column
                    logNextCalledAt = finalISO;
                    // --- Google Calendar Sync Logic ---
                    if (user?.googleCalendarConnected) {
                        try {
                            const { data: { session } } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].auth.getSession();
                            let providerToken = session?.provider_token;
                            // Fallback: Try to retrieve from localStorage if session token is missing
                            if (!providerToken) {
                                providerToken = localStorage.getItem("google_provider_token");
                                if (providerToken) console.log("🔄 [Calendar] Using fallback stored token.");
                            }
                            if (providerToken) {
                                const endTime = new Date(new Date(finalISO).getTime() + 30 * 60000).toISOString(); // +30 mins
                                fetch('/api/google/create-event', {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json'
                                    },
                                    body: JSON.stringify({
                                        summary: `Call Back: ${customer?.customer_name || 'Customer'}`,
                                        description: `
👤 Customer: ${customer?.customer_name || 'N/A'}
📅 Expiry Date: ${customer?.expiry_date ? new Date(customer.expiry_date).toDateString() : 'N/A'}

📋 Customer Details:
${(()=>{
                                            let details = customer?.customer_details;
                                            if (!details) return 'N/A';
                                            if (typeof details === 'string') {
                                                try {
                                                    details = JSON.parse(details);
                                                } catch  {
                                                    return String(details);
                                                }
                                            }
                                            if (typeof details !== 'object') return String(details);
                                            return Object.entries(details).map(([k, v])=>`• ${k.replace(/_(un)?checked/gi, '').replace(/_/g, ' ').toUpperCase()}: ${v}`).join('\n');
                                        })()}

📊 Status:
• Disposition: ${disposition}
• Sub-Disposition: ${subDisposition || 'N/A'}
• Outcome: ${outcome || 'N/A'}

📝 Notes: 
${notes || 'No notes provided'}

Campaign: ${campaign?.name || campaignId}
                                        `.trim(),
                                        startTime: finalISO,
                                        endTime: endTime,
                                        providerToken: providerToken
                                    })
                                }).then(async (res)=>{
                                    const data = await res.json();
                                    if (data.success) {
                                        console.log("✅ [Calendar] Event created successfully:", data.eventId);
                                        alert("Calendar invite sent!");
                                    } else {
                                        console.warn("⚠️ [Calendar] Failed to create event:", data.error);
                                        alert(`Failed to create calendar event: ${data.error}`);
                                    }
                                }).catch((err)=>{
                                    console.error("❌ [Calendar] Network error:", err);
                                    alert("Network error while creating calendar event.");
                                });
                            } else {
                                console.warn("⚠️ [Calendar] No provider_token found in session or storage.");
                                alert("Google Calendar Token missing. Please go to Settings > Integrations and Reconnect Google Calendar.");
                            }
                        } catch (calErr) {
                            console.error("❌ [Calendar] execution error:", calErr);
                        }
                    }
                } else {
                    updatePayload.next_called_at = null;
                    updatePayload.ref_date = now; // For active leads, ref_date defaults to current time
                }
                logStatus = updatePayload.status;
                const { error: customerUpdateError } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from('customers').update(updatePayload).eq('id', customerId);
                if (customerUpdateError) throw customerUpdateError;
                // Success: Refresh schedules to show the newly added/removed callback
                fetchSchedules();
                // Log monitoring event
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$monitoring$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["logSystemEvent"])({
                    event_type: 'WRITE',
                    description: `Disposition Saved: ${disposition} for ${customer?.customer_name || 'Customer'}`,
                    metadata: {
                        disposition,
                        sub_disposition: subDisposition,
                        customer_id: customerId,
                        duration: callDuration
                    },
                    payload_size: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$monitoring$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["estimateSize"])(updatePayload),
                    user_name: user?.displayName || 'Agent',
                    organization_id: user?.organization_id || undefined
                });
            }
            // 1. Save Call Log (Moved here to include calculated metadata)
            // (Call log already saved above)
            // 2.5 Check if this is a manual call before clearing session
            let isManualCall = false;
            let isUnassignedCall = false;
            let currentIsInterruption = false;
            let preservedCampaignId = null;
            let preservedCustomerId = null;
            let preservedStatus = null;
            if (user?.uid) {
                const { data: sRows } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from('call_sessions').select('is_manual, campaign_id, customer_id, manual_customer_id, is_unassigned, status').eq('user_id', user.uid).eq('campaign_id', campaignId).limit(1);
                const currentSession = sRows ? sRows[0] : null;
                if (currentSession) {
                    isManualCall = currentSession.is_manual || false;
                    isUnassignedCall = currentSession.is_unassigned || false;
                    preservedCampaignId = currentSession.campaign_id;
                    preservedCustomerId = currentSession.customer_id;
                    preservedStatus = currentSession.status;
                    const manualCustId = currentSession.manual_customer_id;
                    console.log('[Disposition] Session Match Check:', {
                        isManualCall,
                        preservedCustomerId,
                        manualCustId,
                        savingId: customerId
                    });
                    // 🛡️ MANUAL SHIELD: Check if this was a manual dial (Ad-hoc)
                    if (isManualCall) {
                        // Determine if we should go back to a DIFFERENT lead (Interruption)
                        if (manualCustId && String(manualCustId) !== String(preservedCustomerId)) {
                            currentIsInterruption = true;
                        }
                    }
                    console.log('[Disposition] Final check:', {
                        isManualCall,
                        isUnassignedCall,
                        currentIsInterruption
                    });
                }
            }
            // 3. Handle Manual Call vs CRM Call differently
            // USER RULE: 
            // - Interrupted manual dials (Manual != System) restore to the preserved lead.
            // - Same-lead manual dials (Manual == System) proceed to NEXT lead (CRM Flow).
            // Redirect Logic:
            // Only use "Scenario 1 (Restore)" if it was a manual interruption.
            // If it was the SAME lead, we treat it like a primary lead disposed.
            if (isAccessDeniedManual || !isAssignedToCampaign || isManualCall && currentIsInterruption) {
                console.log(`[Disposition] Flow Exit Path: IsAccessDeniedManual=${isAccessDeniedManual}, IsManual=${isManualCall}, IsUnassigned=${isUnassignedCall}, IsAuthorized=${isAssignedToCampaign}.`);
                try {
                    const { data: { session: authSession } } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].auth.getSession();
                    if (!authSession) throw new Error("No Auth Session");
                    if (isAccessDeniedManual || isUnassignedCall || !isAssignedToCampaign) {
                        // Scenario 2: Unassigned or Unauthorized Manual Call -> DELETE & REDIRECT
                        console.log(`[Disposition] Cleaning up unauthorized/unassigned session: ${campaignId}`);
                        // 1. Force unassign lead if it was unauthorizedly dialled
                        // 2. Terminate the session via API for reliable cleanup
                        await fetch("/api/auth/update-call-session", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${authSession.access_token}`
                            },
                            body: JSON.stringify({
                                campaign_id: campaignId,
                                terminate: true
                            })
                        });
                        // 3. Find another session to redirect to (Self-correction)
                        const { data: otherSessions } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from('call_sessions').select('campaign_id, customer_id, is_manual, manual_customer_id, status, manual_status').eq('user_id', user?.uid).neq('campaign_id', campaignId).or('status.in.(active,disposition_pending,assigned),manual_status.in.(active,disposition_pending)').order('updated_at', {
                            ascending: false
                        }).limit(1);
                        if (otherSessions && otherSessions.length > 0) {
                            const target = otherSessions[0];
                            const isManualTarget = target.manual_status === 'active' || target.manual_status === 'disposition_pending';
                            const tid = isManualTarget ? target.manual_customer_id : target.customer_id;
                            console.log(`[Disposition] Redirecting to another available session: ${tid}`);
                            router.push(`/portal/campaign/${target.campaign_id}/${tid}`);
                        } else {
                            console.log(`[Disposition] No other sessions found. Returning to campaign dashboard.`);
                            router.push(`/portal/campaign`);
                        }
                    } else {
                        // Scenario 1: Authorized Manual Interrupt -> RESTORE Primary Lead Context
                        console.log(`[Disposition] Restoring original lead context for authorized campaign: ${campaignId}`);
                        if (preservedCampaignId && preservedCustomerId) {
                            await fetch("/api/auth/update-call-session", {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                    Authorization: `Bearer ${authSession.access_token}`
                                },
                                body: JSON.stringify({
                                    campaign_id: preservedCampaignId,
                                    customer_id: preservedCustomerId,
                                    status: preservedStatus || 'assigned',
                                    manual_override: true
                                })
                            });
                            router.push(`/portal/campaign/${preservedCampaignId}/${preservedCustomerId}`);
                        } else {
                            router.push(`/portal/campaign/${campaignId}`);
                        }
                    }
                } catch (err) {
                    console.error("[Disposition] Cleanup/Redirect error:", err);
                    router.push(`/portal/campaign`);
                }
                setSaving(false);
                return;
            } else {
                // This is a CRM/Authorized call - we should have a next lead or no more leads.
                console.log('[Disposition] CRM/Primary lead disposed. Handling next step...');
                // 🛡️ Case 3 Check: Network/Timeout Error
                if (prefetchStatus === 'error') {
                    alert("⚠️ Logic Sync Error: Facing some network issues. Redirection might be delayed. Refreshing page...");
                    window.location.reload();
                    setSaving(false);
                    return;
                }
                // 🛡️ Case 2 Check: Save Button Lock (Fallback safeguard)
                if (prefetchStatus === 'fetching') {
                    alert("Please wait 1 second for system to finalize next lead...");
                    setSaving(false);
                    return;
                }
                // 🛡️ Case 1 Check: No More Leads Available
                if (prefetchStatus === 'none') {
                    alert("✅ Good job! No more leads available in this campaign.");
                    try {
                        const { data: { session: authSession } } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].auth.getSession();
                        if (authSession?.access_token) {
                            await fetch("/api/auth/update-call-session", {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                    Authorization: `Bearer ${authSession.access_token}`
                                },
                                body: JSON.stringify({
                                    campaign_id: campaignId,
                                    terminate: true
                                })
                            });
                        }
                    } catch (e) {
                        console.error("Session cleanup error:", e);
                    }
                    router.push(`/portal/campaign/${campaignId}`);
                    setSaving(false);
                    return;
                }
                let nextLeadId = prefetchedDataRef.current?.id;
                // Final safeguard for Campaign ID
                const effectiveCampaignId = campaignId || campaign?.id || preservedCampaignId;
                if (nextLeadId && user?.uid && effectiveCampaignId) {
                    // Update session to 'assigned' for the NEW lead
                    console.log(`[Disposition] Redirecting to next lead: ${nextLeadId}`);
                    await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from('call_sessions').upsert({
                        user_id: user.uid,
                        campaign_id: effectiveCampaignId,
                        customer_id: nextLeadId,
                        organization_id: campaign?.organization_id,
                        status: 'assigned',
                        is_manual: false,
                        manual_campaign_id: null,
                        manual_customer_id: null,
                        manual_status: null,
                        call_start_at: null,
                        updated_at: new Date().toISOString()
                    }, {
                        onConflict: 'user_id,campaign_id'
                    });
                    setLocalCallingStatus(null);
                    setIsAssigning(true); // Trigger modern transition screen
                    setAssignmentCountdown(3); // Start at 3s
                    setTargetNextLead({
                        id: nextLeadId,
                        campaignId: effectiveCampaignId || ""
                    });
                    fetchDailyStats(); // Refresh stats for the motivational screen
                    return;
                } else {
                    // Fallback if something went wrong but no specific error state caught
                    setIsAssigning(true); // Still show transition for consistency
                    setAssignmentCountdown(3);
                    setTargetNextLead({
                        id: "",
                        campaignId: campaignId || ""
                    });
                    fetchDailyStats();
                    return;
                }
            }
            //TURBOPACK unreachable
            ;
        } catch (err) {
            console.error("Error saving disposition:", err);
            alert("Failed to save disposition. Please try again.");
        } finally{
            setSaving(false);
            if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
            ;
        }
    };
    const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
    ];
    const weekDays = [
        "Su",
        "Mo",
        "Tu",
        "We",
        "Th",
        "Fr",
        "Sa"
    ];
    const generateCalendarDays = ()=>{
        const year = calendarViewDate.getFullYear();
        const month = calendarViewDate.getMonth();
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const daysInPrevMonth = new Date(year, month, 0).getDate();
        const days = [];
        // Prev month days
        for(let i = firstDay - 1; i >= 0; i--){
            days.push({
                day: daysInPrevMonth - i,
                currentMonth: false,
                month: month - 1,
                year
            });
        }
        // Current month days
        for(let i = 1; i <= daysInMonth; i++){
            days.push({
                day: i,
                currentMonth: true,
                month,
                year
            });
        }
        // Next month days
        const totalSlots = 42;
        const remainingSlots = totalSlots - days.length;
        for(let i = 1; i <= remainingSlots; i++){
            days.push({
                day: i,
                currentMonth: false,
                month: month + 1,
                year
            });
        }
        return days;
    };
    const handleDateSelect = (day, month, year)=>{
        const selectedDate = new Date(year, month, day);
        const now = new Date();
        now.setHours(0, 0, 0, 0);
        if (selectedDate < now) {
            alert("⚠️ Cannot select a past date.");
            return;
        }
        const dateStr = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`;
        setCallbackDate(dateStr);
        setActivePreset(null);
        setIsDatePickerOpen(false);
    };
    const timeOptions = [
        "09:00",
        "09:30",
        "10:00",
        "10:30",
        "11:00",
        "11:30",
        "12:00",
        "12:30",
        "13:00",
        "13:30",
        "14:00",
        "14:30",
        "15:00",
        "15:30",
        "16:00",
        "16:30",
        "17:00",
        "17:30",
        "18:00",
        "18:30",
        "19:00",
        "19:30",
        "20:00"
    ];
    if (isAssigning) {
        // Dynamic Motivational Messages
        const getMotivationalQuote = ()=>{
            if (dailyLeadCount <= 5) return "Great start! Momentum is building.";
            if (dailyLeadCount <= 20) return "You're on fire! Keep it up.";
            if (dailyLeadCount <= 50) return "Unstoppable! You're dominating.";
            return "Absolute Legend! Dialling machine.";
        };
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
            className: "jsx-b39f0cf342ec66c8" + " " + "flex min-h-screen items-center justify-center bg-[#f8fafc] relative overflow-hidden font-sans",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: "jsx-b39f0cf342ec66c8" + " " + "absolute inset-0 pointer-events-none",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "jsx-b39f0cf342ec66c8" + " " + "absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-200/20 rounded-full blur-[100px]"
                        }, void 0, false, {
                            fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                            lineNumber: 2735,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "jsx-b39f0cf342ec66c8" + " " + "absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-violet-200/20 rounded-full blur-[100px]"
                        }, void 0, false, {
                            fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                            lineNumber: 2736,
                            columnNumber: 21
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                    lineNumber: 2734,
                    columnNumber: 17
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: "jsx-b39f0cf342ec66c8" + " " + "relative z-10 w-full max-w-[340px] sm:max-w-md mx-4 text-center",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "jsx-b39f0cf342ec66c8" + " " + "bg-white/70 backdrop-blur-2xl border border-white/50 rounded-[2rem] p-6 sm:p-10 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.06)] animate-in fade-in zoom-in duration-700",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "jsx-b39f0cf342ec66c8" + " " + "relative w-24 h-24 mx-auto mb-6",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("svg", {
                                        className: "jsx-b39f0cf342ec66c8" + " " + "absolute inset-0 w-full h-full -rotate-90",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("circle", {
                                                cx: "48",
                                                cy: "48",
                                                r: "44",
                                                stroke: "currentColor",
                                                strokeWidth: "4",
                                                fill: "transparent",
                                                className: "jsx-b39f0cf342ec66c8" + " " + "text-slate-100"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                lineNumber: 2747,
                                                columnNumber: 33
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("circle", {
                                                cx: "48",
                                                cy: "48",
                                                r: "44",
                                                stroke: "currentColor",
                                                strokeWidth: "4",
                                                fill: "transparent",
                                                strokeDasharray: 276,
                                                strokeDashoffset: 276 - 276 * (3 - assignmentCountdown + 1) / 3,
                                                strokeLinecap: "round",
                                                className: "jsx-b39f0cf342ec66c8" + " " + "text-indigo-600 transition-all duration-1000 ease-linear"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                lineNumber: 2756,
                                                columnNumber: 33
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                        lineNumber: 2746,
                                        columnNumber: 29
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "jsx-b39f0cf342ec66c8" + " " + "absolute inset-0 flex flex-col items-center justify-center",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                className: "jsx-b39f0cf342ec66c8" + " " + "text-3xl font-black text-indigo-600 tabular-nums animate-pulse",
                                                children: assignmentCountdown
                                            }, void 0, false, {
                                                fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                lineNumber: 2771,
                                                columnNumber: 33
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                className: "jsx-b39f0cf342ec66c8" + " " + "text-[8px] font-bold text-slate-400 uppercase tracking-widest -mt-1",
                                                children: "Sec"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                lineNumber: 2772,
                                                columnNumber: 33
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                        lineNumber: 2770,
                                        columnNumber: 29
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                lineNumber: 2744,
                                columnNumber: 25
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "jsx-b39f0cf342ec66c8" + " " + "mb-8",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                                        className: "jsx-b39f0cf342ec66c8" + " " + "text-xl sm:text-2xl font-black text-slate-900 tracking-tight mb-1",
                                        children: "Assigning Lead"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                        lineNumber: 2778,
                                        columnNumber: 29
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                        className: "jsx-b39f0cf342ec66c8" + " " + "text-[10px] sm:text-[11px] font-bold text-indigo-500 uppercase tracking-[0.2em] opacity-70",
                                        children: "Syncing Next Opportunity"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                        lineNumber: 2779,
                                        columnNumber: 29
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                lineNumber: 2777,
                                columnNumber: 25
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "jsx-b39f0cf342ec66c8" + " " + "bg-slate-900 rounded-2xl p-4 sm:p-5 text-white mb-8 shadow-xl shadow-indigo-100/50 group hover:scale-[1.02] transition-transform duration-500",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "jsx-b39f0cf342ec66c8" + " " + "flex items-center justify-between px-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "jsx-b39f0cf342ec66c8" + " " + "text-left",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                        className: "jsx-b39f0cf342ec66c8" + " " + "text-[10px] font-bold text-indigo-300 uppercase tracking-widest mb-0.5",
                                                        children: "Today"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                        lineNumber: 2786,
                                                        columnNumber: 37
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: "jsx-b39f0cf342ec66c8" + " " + "flex items-baseline gap-1",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                className: "jsx-b39f0cf342ec66c8" + " " + "text-3xl font-black tabular-nums tracking-tighter",
                                                                children: dailyLeadCount
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                lineNumber: 2788,
                                                                columnNumber: 41
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                className: "jsx-b39f0cf342ec66c8" + " " + "text-[10px] font-bold text-slate-400 uppercase",
                                                                children: "Dials"
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                lineNumber: 2789,
                                                                columnNumber: 41
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                        lineNumber: 2787,
                                                        columnNumber: 37
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                lineNumber: 2785,
                                                columnNumber: 33
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "jsx-b39f0cf342ec66c8" + " " + "h-10 w-px bg-slate-800"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                lineNumber: 2792,
                                                columnNumber: 33
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "jsx-b39f0cf342ec66c8" + " " + "text-right max-w-[50%]",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                        className: "jsx-b39f0cf342ec66c8" + " " + "text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-1",
                                                        children: "Spirit"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                        lineNumber: 2794,
                                                        columnNumber: 37
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                        className: "jsx-b39f0cf342ec66c8" + " " + "text-[11px] sm:text-xs font-bold leading-tight line-clamp-2",
                                                        children: [
                                                            '"',
                                                            getMotivationalQuote(),
                                                            '"'
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                        lineNumber: 2795,
                                                        columnNumber: 37
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                lineNumber: 2793,
                                                columnNumber: 33
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                        lineNumber: 2784,
                                        columnNumber: 29
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "jsx-b39f0cf342ec66c8" + " " + "mt-4 h-1 w-full bg-slate-800 rounded-full overflow-hidden",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            style: {
                                                width: '40%'
                                            },
                                            className: "jsx-b39f0cf342ec66c8" + " " + "h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full animate-[progress_3s_ease-in-out_infinite]"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                            lineNumber: 2803,
                                            columnNumber: 33
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                        lineNumber: 2802,
                                        columnNumber: 29
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                lineNumber: 2783,
                                columnNumber: 25
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "jsx-b39f0cf342ec66c8" + " " + "flex justify-center gap-1.5 mb-10",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "jsx-b39f0cf342ec66c8" + " " + "w-1.5 h-1.5 rounded-full bg-slate-200 animate-[bounce_1s_infinite_-0.3s]"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                        lineNumber: 2809,
                                        columnNumber: 29
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "jsx-b39f0cf342ec66c8" + " " + "w-1.5 h-1.5 rounded-full bg-indigo-500 animate-[bounce_1s_infinite_-0.15s]"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                        lineNumber: 2810,
                                        columnNumber: 29
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "jsx-b39f0cf342ec66c8" + " " + "w-1.5 h-1.5 rounded-full bg-slate-200 animate-[bounce_1s_infinite]"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                        lineNumber: 2811,
                                        columnNumber: 29
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                lineNumber: 2808,
                                columnNumber: 25
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "jsx-b39f0cf342ec66c8" + " " + "flex flex-col gap-6",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                        onClick: ()=>router.push(`/portal/campaign/${campaignId}`),
                                        className: "jsx-b39f0cf342ec66c8" + " " + "inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-slate-50 border border-slate-100 text-slate-500 hover:text-rose-500 hover:bg-rose-50 hover:border-rose-100 transition-all duration-300 group",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                className: "jsx-b39f0cf342ec66c8" + " " + "fi flex fi-rr-exit text-sm transition-transform group-hover:-translate-x-1"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                lineNumber: 2820,
                                                columnNumber: 33
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                className: "jsx-b39f0cf342ec66c8" + " " + "text-[10px] font-black uppercase tracking-widest",
                                                children: "Cancel Assignment"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                lineNumber: 2821,
                                                columnNumber: 33
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                        lineNumber: 2816,
                                        columnNumber: 29
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                        className: "jsx-b39f0cf342ec66c8" + " " + "text-[9px] font-bold text-slate-300 uppercase tracking-[0.2em]",
                                        children: "Rynxly Engine 2.5"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                        lineNumber: 2824,
                                        columnNumber: 29
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                lineNumber: 2815,
                                columnNumber: 25
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                        lineNumber: 2741,
                        columnNumber: 21
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                    lineNumber: 2739,
                    columnNumber: 17
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$styled$2d$jsx$2f$style$2e$js__$5b$external$5d$__$28$styled$2d$jsx$2f$style$2e$js$2c$__cjs$29$__["default"], {
                    id: "b39f0cf342ec66c8",
                    children: "@keyframes progress{0%{transform:translate(-100%)}to{transform:translate(250%)}}"
                }, void 0, false, void 0, this)
            ]
        }, void 0, true, {
            fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
            lineNumber: 2732,
            columnNumber: 13
        }, this);
    }
    if (loading || !user) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
            className: "flex min-h-screen items-center justify-center bg-white",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "flex flex-col items-center max-w-xs text-center px-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "relative w-14 h-14 mb-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "absolute inset-0 border-4 border-slate-100 rounded-full"
                            }, void 0, false, {
                                fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                lineNumber: 2846,
                                columnNumber: 25
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "absolute inset-0 border-4 border-indigo-600 rounded-full animate-spin border-t-transparent border-l-transparent"
                            }, void 0, false, {
                                fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                lineNumber: 2847,
                                columnNumber: 25
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "absolute inset-0 flex items-center justify-center",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                    className: "fi flex fi-rr-shuffle text-indigo-600 text-sm animate-pulse"
                                }, void 0, false, {
                                    fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                    lineNumber: 2849,
                                    columnNumber: 29
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                lineNumber: 2848,
                                columnNumber: 25
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                        lineNumber: 2845,
                        columnNumber: 21
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                        className: "text-lg font-bold text-slate-900 mb-1",
                        children: "Assigning Lead"
                    }, void 0, false, {
                        fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                        lineNumber: 2853,
                        columnNumber: 21
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                        className: "text-xs font-medium text-slate-400 tracking-wide uppercase",
                        children: "Syncing your lead data..."
                    }, void 0, false, {
                        fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                        lineNumber: 2854,
                        columnNumber: 21
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "mt-6 flex gap-1.5",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "w-1.5 h-1.5 rounded-full bg-indigo-600 animate-bounce [animation-delay:-0.3s]"
                            }, void 0, false, {
                                fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                lineNumber: 2858,
                                columnNumber: 25
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "w-1.5 h-1.5 rounded-full bg-indigo-600 animate-bounce [animation-delay:-0.15s]"
                            }, void 0, false, {
                                fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                lineNumber: 2859,
                                columnNumber: 25
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "w-1.5 h-1.5 rounded-full bg-indigo-600 animate-bounce"
                            }, void 0, false, {
                                fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                lineNumber: 2860,
                                columnNumber: 25
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                        lineNumber: 2857,
                        columnNumber: 21
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                lineNumber: 2843,
                columnNumber: 17
            }, this)
        }, void 0, false, {
            fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
            lineNumber: 2842,
            columnNumber: 13
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        style: {
            backgroundColor: "#f8fafc",
            maxWidth: "100vw"
        },
        className: "jsx-bd40b562327a6f52" + " " + "flex min-h-screen w-full",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Sidebar$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                activeNav: "campaign",
                user: user ? {
                    displayName: user.displayName,
                    email: user.email,
                    employeeId: user.employeeId,
                    profilePicUrl: user.profilePicUrl,
                    isClient: user.isClient,
                    designation: user.designation,
                    lastSignInAt: user.lastSignInAt
                } : undefined,
                onLogout: handleLogoutClick
            }, void 0, false, {
                fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                lineNumber: 2869,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "jsx-bd40b562327a6f52" + " " + "flex-1 flex flex-col w-full min-w-0",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Header$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                        user: user ? {
                            displayName: user.displayName,
                            email: user.email,
                            employeeId: user.employeeId,
                            profilePicUrl: user.profilePicUrl,
                            lastSignInAt: user.lastSignInAt,
                            uid: user.uid
                        } : undefined,
                        onLogout: handleLogoutClick,
                        hideSidebar: false
                    }, void 0, false, {
                        fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                        lineNumber: 2886,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("main", {
                        style: {
                            backgroundColor: "#f8fafc"
                        },
                        className: "jsx-bd40b562327a6f52" + " " + "flex-1 overflow-y-auto overflow-x-hidden min-w-0 max-w-full relative",
                        children: [
                            showNewLeadAlert && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "jsx-bd40b562327a6f52" + " " + "fixed top-20 left-1/2 -translate-x-1/2 z-[100] w-[calc(100%-2rem)] max-w-md animate-in fade-in slide-in-from-top-4 duration-500",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "jsx-bd40b562327a6f52" + " " + "bg-slate-900 text-white p-4 rounded-2xl shadow-2xl flex items-center justify-between border border-white/10 backdrop-blur-xl",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "jsx-bd40b562327a6f52" + " " + "flex items-center gap-4",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "jsx-bd40b562327a6f52" + " " + "w-10 h-10 rounded-xl bg-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-500/20",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                        className: "jsx-bd40b562327a6f52" + " " + "fi flex  fi-rr-bolt text-lg"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                        lineNumber: 2906,
                                                        columnNumber: 41
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                    lineNumber: 2905,
                                                    columnNumber: 37
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "jsx-bd40b562327a6f52" + " " + "flex flex-col",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                            className: "jsx-bd40b562327a6f52" + " " + "text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400",
                                                            children: "Assignment Success"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                            lineNumber: 2909,
                                                            columnNumber: 41
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                            className: "jsx-bd40b562327a6f52" + " " + "text-sm font-bold truncate max-w-[200px]",
                                                            children: customer?.customer_name || 'New Lead Assigned'
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                            lineNumber: 2910,
                                                            columnNumber: 41
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                    lineNumber: 2908,
                                                    columnNumber: 37
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                            lineNumber: 2904,
                                            columnNumber: 33
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                            onClick: ()=>setShowNewLeadAlert(false),
                                            className: "jsx-bd40b562327a6f52" + " " + "w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center transition-colors",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                className: "jsx-bd40b562327a6f52" + " " + "fi flex  fi-rr-cross-small"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                lineNumber: 2917,
                                                columnNumber: 37
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                            lineNumber: 2913,
                                            columnNumber: 33
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                    lineNumber: 2903,
                                    columnNumber: 29
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                lineNumber: 2902,
                                columnNumber: 25
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "jsx-bd40b562327a6f52" + " " + "container mx-auto px-3 sm:px-6 py-4 sm:py-8 pb-32 lg:pb-12 max-w-7xl",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "jsx-bd40b562327a6f52" + " " + "grid grid-cols-1 md:grid-cols-24 gap-2 mb-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "jsx-bd40b562327a6f52" + " " + "md:col-span-11",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "jsx-bd40b562327a6f52" + " " + "h-full relative rounded-[1rem] bg-white border border-slate-200 overflow-hidden group       transition-shadow duration-500",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: "jsx-bd40b562327a6f52" + " " + "absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-50/50 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                            lineNumber: 2935,
                                                            columnNumber: 37
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: "jsx-bd40b562327a6f52" + " " + "absolute bottom-0 left-0 w-[300px] h-[300px] bg-blue-50/30 rounded-full blur-[60px] translate-y-1/2 -translate-x-1/3 pointer-events-none"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                            lineNumber: 2936,
                                                            columnNumber: 37
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: "jsx-bd40b562327a6f52" + " " + "relative z-10 p-6 h-full flex flex-col justify-between gap-3",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                    className: "jsx-bd40b562327a6f52" + " " + "flex flex-col sm:flex-row items-center sm:items-start sm:justify-between w-full",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                            className: "jsx-bd40b562327a6f52" + " " + "sm:hidden mb-3 text-center",
                                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                className: "jsx-bd40b562327a6f52" + " " + `flex items-center justify-center gap-1.5 px-3 py-1 bg-slate-50 rounded-full border border-slate-100`,
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                                        className: "jsx-bd40b562327a6f52" + " " + `fi ${leadScore.icon} ${leadScore.color} text-[10px]`
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                        lineNumber: 2944,
                                                                                        columnNumber: 53
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                        className: "jsx-bd40b562327a6f52" + " " + "text-[10px] font-bold text-slate-600 uppercase tracking-widest",
                                                                                        children: [
                                                                                            leadScore.label,
                                                                                            " Lead"
                                                                                        ]
                                                                                    }, void 0, true, {
                                                                                        fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                        lineNumber: 2945,
                                                                                        columnNumber: 53
                                                                                    }, this)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                lineNumber: 2943,
                                                                                columnNumber: 49
                                                                            }, this)
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                            lineNumber: 2942,
                                                                            columnNumber: 45
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                            className: "jsx-bd40b562327a6f52" + " " + "flex flex-col sm:flex-row items-center sm:items-start gap-3 sm:gap-4",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                    className: "jsx-bd40b562327a6f52" + " " + "relative hidden sm:block",
                                                                                    children: [
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                            className: "jsx-bd40b562327a6f52" + " " + "w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-700 flex items-center justify-center text-white text-xl font-bold",
                                                                                            children: customer?.customer_name?.charAt(0) || 'C'
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                            lineNumber: 2952,
                                                                                            columnNumber: 53
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                            className: "jsx-bd40b562327a6f52" + " " + `absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-[3px] border-white flex items-center justify-center ${customer?.status === 'followup' ? 'bg-amber-400' : 'bg-emerald-500'}`,
                                                                                            children: customer?.status === 'followup' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                                                className: "jsx-bd40b562327a6f52" + " " + "fi flex fi-rr-clock text-[10px] text-white mt-0.5"
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                                lineNumber: 2959,
                                                                                                columnNumber: 61
                                                                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                                                className: "jsx-bd40b562327a6f52" + " " + "fi flex fi-rr-check text-[10px] text-white mt-0.5"
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                                lineNumber: 2961,
                                                                                                columnNumber: 61
                                                                                            }, this)
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                            lineNumber: 2955,
                                                                                            columnNumber: 53
                                                                                        }, this)
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                    lineNumber: 2951,
                                                                                    columnNumber: 49
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                    className: "jsx-bd40b562327a6f52" + " " + "text-center sm:text-left",
                                                                                    children: [
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                            className: "jsx-bd40b562327a6f52" + " " + "flex items-center justify-center sm:justify-start gap-2 mb-1",
                                                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                                                                                                className: "jsx-bd40b562327a6f52" + " " + "text-2xl font-bold text-slate-800 tracking-tight",
                                                                                                children: customer?.customer_name || 'Anonymous User'
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                                lineNumber: 2969,
                                                                                                columnNumber: 57
                                                                                            }, this)
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                            lineNumber: 2968,
                                                                                            columnNumber: 53
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                            className: "jsx-bd40b562327a6f52" + " " + "flex   items-center justify-center sm:justify-start gap-4 text-slate-500",
                                                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                                className: "jsx-bd40b562327a6f52" + " " + "flex items-center gap-1.5",
                                                                                                children: [
                                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                                                        className: "jsx-bd40b562327a6f52" + " " + "fi flex  fi-rr-id-badge text-xs opacity-50"
                                                                                                    }, void 0, false, {
                                                                                                        fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                                        lineNumber: 2975,
                                                                                                        columnNumber: 61
                                                                                                    }, this),
                                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                                        className: "jsx-bd40b562327a6f52" + " " + "text-[10px] font-semibold tracking-wide",
                                                                                                        children: [
                                                                                                            "#",
                                                                                                            customer?.lead_id
                                                                                                        ]
                                                                                                    }, void 0, true, {
                                                                                                        fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                                        lineNumber: 2976,
                                                                                                        columnNumber: 61
                                                                                                    }, this)
                                                                                                ]
                                                                                            }, void 0, true, {
                                                                                                fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                                lineNumber: 2974,
                                                                                                columnNumber: 57
                                                                                            }, this)
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                            lineNumber: 2973,
                                                                                            columnNumber: 53
                                                                                        }, this)
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                    lineNumber: 2967,
                                                                                    columnNumber: 49
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                            lineNumber: 2949,
                                                                            columnNumber: 45
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                            className: "jsx-bd40b562327a6f52" + " " + "hidden sm:block text-right",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                                    className: "jsx-bd40b562327a6f52" + " " + "text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1",
                                                                                    children: "Lead Score"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                    lineNumber: 2984,
                                                                                    columnNumber: 49
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                    className: "jsx-bd40b562327a6f52" + " " + "flex items-center justify-end gap-1",
                                                                                    children: [
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                                            className: "jsx-bd40b562327a6f52" + " " + `fi flex mr-2 ${leadScore.icon} ${leadScore.color} text-sm`
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                            lineNumber: 2986,
                                                                                            columnNumber: 53
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                            className: "jsx-bd40b562327a6f52" + " " + "text-xl font-black text-slate-800",
                                                                                            children: leadScore.label
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                            lineNumber: 2987,
                                                                                            columnNumber: 53
                                                                                        }, this)
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                    lineNumber: 2985,
                                                                                    columnNumber: 49
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                            lineNumber: 2983,
                                                                            columnNumber: 45
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                    lineNumber: 2940,
                                                                    columnNumber: 41
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                    className: "jsx-bd40b562327a6f52" + " " + "flex  flex-wrap md:flex-nowrap items-center gap-2 px-1 w-full",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                            className: "jsx-bd40b562327a6f52" + " " + "order-1 flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-lg border border-slate-200 shrink-0",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                                    className: "jsx-bd40b562327a6f52" + " " + "fi flex  fi-rr-clock-three text-slate-400 text-[10px]"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                    lineNumber: 2996,
                                                                                    columnNumber: 49
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                    className: "jsx-bd40b562327a6f52" + " " + "text-[10px] font-bold text-slate-600 uppercase tracking-wide",
                                                                                    children: [
                                                                                        history?.length || 0,
                                                                                        " Attempts"
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                    lineNumber: 2997,
                                                                                    columnNumber: 49
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                            lineNumber: 2995,
                                                                            columnNumber: 45
                                                                        }, this),
                                                                        lastInteraction && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                            className: "jsx-bd40b562327a6f52" + " " + "order-3 md:order-2 w-full md:w-auto flex items-center gap-2 px-3 py-1.5 bg-purple-50 rounded-lg border border-purple-100 md:flex-none md:max-w-[60%] min-w-0 overflow-hidden",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                                    className: "jsx-bd40b562327a6f52" + " " + "fi flex  fi-rr-vector-alt text-purple-400 text-[10px] shrink-0"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                    lineNumber: 3005,
                                                                                    columnNumber: 54
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                    className: "jsx-bd40b562327a6f52" + " " + "flex items-center gap-1 text-[10px] font-semibold text-purple-700 truncate",
                                                                                    children: [
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                            className: "jsx-bd40b562327a6f52" + " " + "truncate",
                                                                                            children: lastInteraction.disposition || 'N/A'
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                            lineNumber: 3007,
                                                                                            columnNumber: 57
                                                                                        }, this),
                                                                                        lastInteraction.sub_disposition && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["Fragment"], {
                                                                                            children: [
                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                                    className: "jsx-bd40b562327a6f52" + " " + "text-purple-300",
                                                                                                    children: "/"
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                                    lineNumber: 3010,
                                                                                                    columnNumber: 65
                                                                                                }, this),
                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                                    className: "jsx-bd40b562327a6f52" + " " + "truncate",
                                                                                                    children: lastInteraction.sub_disposition
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                                    lineNumber: 3011,
                                                                                                    columnNumber: 65
                                                                                                }, this)
                                                                                            ]
                                                                                        }, void 0, true),
                                                                                        lastInteraction.outcome && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["Fragment"], {
                                                                                            children: [
                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                                    className: "jsx-bd40b562327a6f52" + " " + "text-purple-300",
                                                                                                    children: "/"
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                                    lineNumber: 3016,
                                                                                                    columnNumber: 65
                                                                                                }, this),
                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                                    className: "jsx-bd40b562327a6f52" + " " + "truncate text-purple-900 font-bold",
                                                                                                    children: lastInteraction.outcome
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                                    lineNumber: 3017,
                                                                                                    columnNumber: 65
                                                                                                }, this)
                                                                                            ]
                                                                                        }, void 0, true)
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                    lineNumber: 3006,
                                                                                    columnNumber: 54
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                            lineNumber: 3004,
                                                                            columnNumber: 49
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                            className: "jsx-bd40b562327a6f52" + " " + "order-2 md:order-3 flex items-center -space-x-2 shrink-0 ml-auto pl-2",
                                                                            children: [
                                                                                mobileLogs?.slice(0, 3).map((log, i)=>{
                                                                                    const type = (log.type || '').toLowerCase();
                                                                                    // Mobile logs usually have 'incoming', 'outgoing', 'missed' as types
                                                                                    const isMissed = type === 'missed' || type === 'rejected';
                                                                                    const isIncoming = type === 'incoming';
                                                                                    let bgClass = 'bg-blue-500';
                                                                                    let iconClass = 'fi-rr-arrow-up-right';
                                                                                    let rotateClass = 'rotate-12';
                                                                                    if (isMissed) {
                                                                                        bgClass = 'bg-red-500';
                                                                                        iconClass = 'fi-rr-arrow-up-right'; // Or different icon for missed
                                                                                        rotateClass = 'rotate-45';
                                                                                    } else if (isIncoming) {
                                                                                        bgClass = 'bg-emerald-500';
                                                                                        iconClass = 'fi-rr-arrow-down-left';
                                                                                        rotateClass = '-rotate-12';
                                                                                    }
                                                                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                        style: {
                                                                                            zIndex: 30 - i * 10
                                                                                        },
                                                                                        title: `${isMissed ? 'Missed Call' : isIncoming ? 'Incoming Call' : 'Outgoing Call'} • ${log.duration ? formatTime(log.duration) : '0s'}`,
                                                                                        className: "jsx-bd40b562327a6f52" + " " + `relative flex items-center justify-center w-8 h-8 rounded-full ${bgClass} border-2 border-white ring-1 ring-slate-100 shadow-sm transition-transform hover:scale-110 hover:z-50`,
                                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                                            className: "jsx-bd40b562327a6f52" + " " + `fi flex ${iconClass} text-white text-[10px] transform ${rotateClass}`
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                            lineNumber: 3053,
                                                                                            columnNumber: 61
                                                                                        }, this)
                                                                                    }, i, false, {
                                                                                        fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                        lineNumber: 3047,
                                                                                        columnNumber: 57
                                                                                    }, this);
                                                                                }),
                                                                                (!mobileLogs || mobileLogs.length === 0) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                    className: "jsx-bd40b562327a6f52" + " " + "w-8 h-8 rounded-full bg-slate-50 border-2 border-white flex items-center justify-center",
                                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                                        className: "jsx-bd40b562327a6f52" + " " + "fi flex  fi-rr-minus text-slate-200 text-xs"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                        lineNumber: 3059,
                                                                                        columnNumber: 57
                                                                                    }, this)
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                    lineNumber: 3058,
                                                                                    columnNumber: 53
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                            lineNumber: 3025,
                                                                            columnNumber: 45
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                    lineNumber: 2993,
                                                                    columnNumber: 41
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                    className: "jsx-bd40b562327a6f52" + " " + "grid grid-cols-4 gap-1.5",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                            className: "jsx-bd40b562327a6f52" + " " + "p-1 sm:p-2 rounded-2xl bg-transparent flex flex-col items-center justify-center text-center gap-0.5 hover:bg-slate-50 transition-all cursor-default group/tile",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                    className: "jsx-bd40b562327a6f52" + " " + "w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white border border-slate-100 flex items-center justify-center text-slate-400 mb-0.5 group-hover/tile:scale-110 transition-transform",
                                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                                        className: "jsx-bd40b562327a6f52" + " " + "fi flex  fi-rr-user flex text-xs sm:text-sm"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                        lineNumber: 3070,
                                                                                        columnNumber: 54
                                                                                    }, this)
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                    lineNumber: 3069,
                                                                                    columnNumber: 49
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                                    className: "jsx-bd40b562327a6f52" + " " + "text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-wide",
                                                                                    children: "Manager"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                    lineNumber: 3072,
                                                                                    columnNumber: 49
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                                    className: "jsx-bd40b562327a6f52" + " " + "text-[10px] sm:text-xs font-bold text-slate-800 truncate w-full px-1 sm:px-2",
                                                                                    children: managedByInfo?.name || 'Self'
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                    lineNumber: 3073,
                                                                                    columnNumber: 49
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                            lineNumber: 3068,
                                                                            columnNumber: 45
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                            className: "jsx-bd40b562327a6f52" + " " + "p-1 sm:p-3 rounded-2xl flex flex-col items-center justify-center text-center gap-0.5 hover:bg-slate-50 transition-all cursor-default group/tile",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                    className: "jsx-bd40b562327a6f52" + " " + "w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white border border-slate-100 flex items-center justify-center text-purple-400 mb-0.5 group-hover/tile:scale-110 transition-transform",
                                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                                        className: "jsx-bd40b562327a6f52" + " " + "fi flex  fi-rr-comment-alt text-xs sm:text-sm"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                        lineNumber: 3079,
                                                                                        columnNumber: 54
                                                                                    }, this)
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                    lineNumber: 3078,
                                                                                    columnNumber: 49
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                                    className: "jsx-bd40b562327a6f52" + " " + "text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-wide",
                                                                                    children: "Status"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                    lineNumber: 3081,
                                                                                    columnNumber: 49
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                                    className: "jsx-bd40b562327a6f52" + " " + "text-[10px] sm:text-xs font-bold text-purple-600 truncate w-full px-1 sm:px-2",
                                                                                    children: customer?.disposition || 'Fresh'
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                    lineNumber: 3082,
                                                                                    columnNumber: 49
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                            lineNumber: 3077,
                                                                            columnNumber: 45
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                            className: "jsx-bd40b562327a6f52" + " " + "p-1 sm:p-3 rounded-2xl flex flex-col items-center justify-center text-center gap-0.5 hover:bg-slate-50 transition-all cursor-default group/tile relative",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                    className: "jsx-bd40b562327a6f52" + " " + "w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white border border-slate-100 flex items-center justify-center text-amber-400 mb-0.5 group-hover/tile:scale-110 transition-transform",
                                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                                        className: "jsx-bd40b562327a6f52" + " " + "fi flex  fi-rr-calendar-clock text-xs sm:text-sm"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                        lineNumber: 3088,
                                                                                        columnNumber: 54
                                                                                    }, this)
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                    lineNumber: 3087,
                                                                                    columnNumber: 49
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                                    className: "jsx-bd40b562327a6f52" + " " + "text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-wide",
                                                                                    children: "Expiry"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                    lineNumber: 3090,
                                                                                    columnNumber: 49
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                    className: "jsx-bd40b562327a6f52" + " " + "flex items-center gap-1 group/expiry",
                                                                                    children: [
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                                            className: "jsx-bd40b562327a6f52" + " " + "text-[10px] sm:text-xs font-bold text-slate-700 truncate max-w-[80px] px-1 sm:px-2",
                                                                                            children: formatDate(customer?.expiry_date)
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                            lineNumber: 3092,
                                                                                            columnNumber: 53
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                                            onClick: (e)=>{
                                                                                                e.stopPropagation();
                                                                                                // Convert to YYYY-MM-DD for input date
                                                                                                let dStr = "";
                                                                                                if (customer?.expiry_date) {
                                                                                                    try {
                                                                                                        const d = new Date(customer.expiry_date);
                                                                                                        if (!isNaN(d.getTime())) {
                                                                                                            dStr = d.toISOString().split('T')[0];
                                                                                                        }
                                                                                                    } catch (err) {}
                                                                                                }
                                                                                                setTempExpiryDate(dStr);
                                                                                                setIsEditingExpiry(!isEditingExpiry);
                                                                                            },
                                                                                            className: "jsx-bd40b562327a6f52" + " " + "w-5 h-5 flex items-center justify-center rounded-md hover:bg-amber-50 text-slate-300 hover:text-amber-500 transition-all opacity-0 group-hover/tile:opacity-100",
                                                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                                                className: "jsx-bd40b562327a6f52" + " " + "fi flex fi-rr-edit text-[10px]"
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                                lineNumber: 3111,
                                                                                                columnNumber: 57
                                                                                            }, this)
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                            lineNumber: 3093,
                                                                                            columnNumber: 53
                                                                                        }, this)
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                    lineNumber: 3091,
                                                                                    columnNumber: 49
                                                                                }, this),
                                                                                isEditingExpiry && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                    ref: expiryDatePickerRef,
                                                                                    className: "jsx-bd40b562327a6f52" + " " + "absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-[60] bg-white p-3 rounded-2xl shadow-2xl border border-slate-300 w-48 animate-in fade-in zoom-in duration-200",
                                                                                    children: [
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                                            className: "jsx-bd40b562327a6f52" + " " + "text-[10px] font-bold text-slate-400 uppercase mb-2",
                                                                                            children: "Update Expiry"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                            lineNumber: 3121,
                                                                                            columnNumber: 57
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                            className: "jsx-bd40b562327a6f52" + " " + "relative mb-3 group/exp-input",
                                                                                            children: [
                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                                    className: "jsx-bd40b562327a6f52" + " " + "w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold flex items-center justify-between",
                                                                                                    children: [
                                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                                            className: "jsx-bd40b562327a6f52" + " " + "text-slate-700",
                                                                                                            children: tempExpiryDate ? (()=>{
                                                                                                                const [y, m, d] = tempExpiryDate.split('-');
                                                                                                                return `${d}/${m}/${y}`;
                                                                                                            })() : 'DD/MM/YYYY'
                                                                                                        }, void 0, false, {
                                                                                                            fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                                            lineNumber: 3124,
                                                                                                            columnNumber: 65
                                                                                                        }, this),
                                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                                                            className: "jsx-bd40b562327a6f52" + " " + "fi fi-rr-calendar text-slate-400"
                                                                                                        }, void 0, false, {
                                                                                                            fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                                            lineNumber: 3130,
                                                                                                            columnNumber: 65
                                                                                                        }, this)
                                                                                                    ]
                                                                                                }, void 0, true, {
                                                                                                    fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                                    lineNumber: 3123,
                                                                                                    columnNumber: 61
                                                                                                }, this),
                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                                                                                    type: "date",
                                                                                                    value: tempExpiryDate,
                                                                                                    onChange: (e)=>setTempExpiryDate(e.target.value),
                                                                                                    className: "jsx-bd40b562327a6f52" + " " + "absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                                    lineNumber: 3132,
                                                                                                    columnNumber: 61
                                                                                                }, this)
                                                                                            ]
                                                                                        }, void 0, true, {
                                                                                            fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                            lineNumber: 3122,
                                                                                            columnNumber: 57
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                            className: "jsx-bd40b562327a6f52" + " " + "flex gap-2",
                                                                                            children: [
                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                                                    onClick: (e)=>{
                                                                                                        e.stopPropagation();
                                                                                                        setIsEditingExpiry(false);
                                                                                                    },
                                                                                                    className: "jsx-bd40b562327a6f52" + " " + "flex-1 py-1.5 rounded-lg bg-slate-100 text-slate-600 text-[10px] font-bold hover:bg-slate-200 transition-all",
                                                                                                    children: "Cancel"
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                                    lineNumber: 3140,
                                                                                                    columnNumber: 61
                                                                                                }, this),
                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                                                    onClick: (e)=>{
                                                                                                        e.stopPropagation();
                                                                                                        handleUpdateExpiry(tempExpiryDate);
                                                                                                    },
                                                                                                    disabled: saving,
                                                                                                    className: "jsx-bd40b562327a6f52" + " " + "flex-1 py-1.5 rounded-lg bg-indigo-600 text-white text-[10px] font-bold hover:bg-indigo-700 transition-all flex items-center justify-center gap-1",
                                                                                                    children: saving ? '...' : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["Fragment"], {
                                                                                                        children: [
                                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                                                                className: "jsx-bd40b562327a6f52" + " " + "fi flex fi-rr-check text-[8px]"
                                                                                                            }, void 0, false, {
                                                                                                                fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                                                lineNumber: 3159,
                                                                                                                columnNumber: 73
                                                                                                            }, this),
                                                                                                            "Save"
                                                                                                        ]
                                                                                                    }, void 0, true)
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                                    lineNumber: 3149,
                                                                                                    columnNumber: 61
                                                                                                }, this)
                                                                                            ]
                                                                                        }, void 0, true, {
                                                                                            fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                            lineNumber: 3139,
                                                                                            columnNumber: 57
                                                                                        }, this)
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                    lineNumber: 3117,
                                                                                    columnNumber: 53
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                            lineNumber: 3086,
                                                                            columnNumber: 46
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                            className: "jsx-bd40b562327a6f52" + " " + "p-1 sm:p-3 rounded-2xl flex flex-col items-center justify-center text-center gap-0.5 hover:bg-slate-50 transition-all cursor-default group/tile",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                    className: "jsx-bd40b562327a6f52" + " " + "w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white border border-slate-100 flex items-center justify-center text-emerald-500 mb-0.5 group-hover/tile:scale-110 transition-transform",
                                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                                        className: "jsx-bd40b562327a6f52" + " " + "fi flex  fi-rr-bullhorn text-xs sm:text-sm"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                        lineNumber: 3172,
                                                                                        columnNumber: 54
                                                                                    }, this)
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                    lineNumber: 3171,
                                                                                    columnNumber: 49
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                                    className: "jsx-bd40b562327a6f52" + " " + "text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-wide",
                                                                                    children: "Campaign"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                    lineNumber: 3174,
                                                                                    columnNumber: 49
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                                    className: "jsx-bd40b562327a6f52" + " " + "text-[10px] sm:text-xs font-bold text-emerald-600 truncate w-full px-1 sm:px-2",
                                                                                    children: campaign?.name || 'Global'
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                    lineNumber: 3175,
                                                                                    columnNumber: 49
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                            lineNumber: 3170,
                                                                            columnNumber: 46
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                    lineNumber: 3066,
                                                                    columnNumber: 41
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                            lineNumber: 2938,
                                                            columnNumber: 37
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                    lineNumber: 2933,
                                                    columnNumber: 33
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                lineNumber: 2932,
                                                columnNumber: 29
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "jsx-bd40b562327a6f52" + " " + "md:col-span-6 flex flex-col",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "jsx-bd40b562327a6f52" + " " + "h-full relative rounded-2xl bg-white border border-slate-200 overflow-hidden group transition-all duration-500 flex flex-col pt-4",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: "jsx-bd40b562327a6f52" + " " + "absolute inset-0 overflow-hidden pointer-events-none",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                    className: "jsx-bd40b562327a6f52" + " " + "absolute -top-12 -left-12 w-64 h-64 rounded-full bg-indigo-50/50 blur-[80px]"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                    lineNumber: 3187,
                                                                    columnNumber: 41
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                    className: "jsx-bd40b562327a6f52" + " " + "absolute -bottom-12 -right-12 w-64 h-64 rounded-full bg-violet-50/50 blur-[80px]"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                    lineNumber: 3188,
                                                                    columnNumber: 41
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                            lineNumber: 3186,
                                                            columnNumber: 37
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: "jsx-bd40b562327a6f52" + " " + "relative z-10 flex flex-col h-full gap-2 px-4 pb-4",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                    onClick: ()=>{
                                                                        if (window.innerWidth < 768) {
                                                                            setIsNotesExpanded(!isNotesExpanded);
                                                                        }
                                                                    },
                                                                    className: "jsx-bd40b562327a6f52" + " " + "flex items-center justify-between mb-1 cursor-pointer md:cursor-default",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                            className: "jsx-bd40b562327a6f52" + " " + "flex items-center gap-2",
                                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                className: "jsx-bd40b562327a6f52" + " " + "flex items-center gap-2",
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                                                                                        style: {
                                                                                            fontFamily: "'Poppins', sans-serif"
                                                                                        },
                                                                                        className: "jsx-bd40b562327a6f52" + " " + "text-[12px] font-bold text-slate-800 uppercase tracking-widest",
                                                                                        children: "Persistent Notes"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                        lineNumber: 3202,
                                                                                        columnNumber: 53
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                        className: "jsx-bd40b562327a6f52" + " " + `w-1.5 h-1.5 rounded-full transition-all duration-500 ${liveNotes.trim().length > 0 ? isSavingLiveNotes ? 'bg-amber-400' : 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-slate-200'}`
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                        lineNumber: 3203,
                                                                                        columnNumber: 53
                                                                                    }, this),
                                                                                    isSavingLiveNotes && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                        className: "jsx-bd40b562327a6f52" + " " + "text-[8px] font-bold text-amber-500 tracking-tighter animate-pulse",
                                                                                        children: "Saving..."
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                        lineNumber: 3204,
                                                                                        columnNumber: 75
                                                                                    }, this)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                lineNumber: 3201,
                                                                                columnNumber: 49
                                                                            }, this)
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                            lineNumber: 3200,
                                                                            columnNumber: 45
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                            className: "jsx-bd40b562327a6f52" + " " + "flex items-center gap-2",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                                    onClick: (e)=>{
                                                                                        e.stopPropagation();
                                                                                        setShowEnlargedNotes(true);
                                                                                    },
                                                                                    title: "Expand Notes",
                                                                                    className: "jsx-bd40b562327a6f52" + " " + "w-7 h-7 flex items-center justify-center rounded-lg bg-slate-50 border border-slate-100 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 hover:border-indigo-100 transition-all",
                                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                                        className: "jsx-bd40b562327a6f52" + " " + "fi flex  fi-rr-expand text-[10px]"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                        lineNumber: 3217,
                                                                                        columnNumber: 53
                                                                                    }, this)
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                    lineNumber: 3209,
                                                                                    columnNumber: 49
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                                    className: "jsx-bd40b562327a6f52" + " " + `md:hidden w-7 h-7 flex items-center justify-center rounded-lg bg-slate-50 border border-slate-100 text-slate-400 transition-transform duration-300 ${isNotesExpanded ? 'rotate-180' : ''}`,
                                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                                        className: "jsx-bd40b562327a6f52" + " " + "fi flex  fi-rr-angle-small-down"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                        lineNumber: 3224,
                                                                                        columnNumber: 53
                                                                                    }, this)
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                    lineNumber: 3221,
                                                                                    columnNumber: 49
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                            lineNumber: 3208,
                                                                            columnNumber: 45
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                    lineNumber: 3192,
                                                                    columnNumber: 41
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                    className: "jsx-bd40b562327a6f52" + " " + `transition-all duration-500 ease-in-out overflow-hidden flex-1 flex flex-col ${isNotesExpanded ? 'max-h-[500px] opacity-100' : 'max-h-0 md:max-h-none opacity-0 md:opacity-100'}`,
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                        className: "jsx-bd40b562327a6f52" + " " + "h-[180px] relative flex bg-slate-50/30 rounded-xl border border-slate-200 overflow-hidden focus-within:border-indigo-300 focus-within:ring-4 focus-within:ring-indigo-50/50 transition-all",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                ref: lineNumbersRef,
                                                                                className: "jsx-bd40b562327a6f52" + " " + "w-8 py-3 bg-slate-100/30 border-r border-slate-200 flex flex-col items-center text-[8px] font-bold text-slate-300 select-none overflow-hidden",
                                                                                children: (liveNotes.split('\n').length > 0 ? liveNotes.split('\n') : [
                                                                                    ''
                                                                                ]).map((_, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                        className: "jsx-bd40b562327a6f52" + " " + "leading-6 h-6",
                                                                                        children: i + 1
                                                                                    }, i, false, {
                                                                                        fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                        lineNumber: 3237,
                                                                                        columnNumber: 57
                                                                                    }, this))
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                lineNumber: 3232,
                                                                                columnNumber: 49
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("textarea", {
                                                                                ref: textareaRef,
                                                                                onScroll: syncScroll,
                                                                                value: liveNotes,
                                                                                onChange: (e)=>{
                                                                                    setLiveNotes(e.target.value);
                                                                                },
                                                                                onBlur: ()=>handleSaveLiveNotes(),
                                                                                placeholder: "Write Something Here...",
                                                                                style: {
                                                                                    fontFamily: "'Plus Jakarta Sans', sans-serif"
                                                                                },
                                                                                className: "jsx-bd40b562327a6f52" + " " + "flex-1 h-full bg-transparent text-slate-700 p-3 pt-[13px] text-[12px] font-medium outline-none transition-all resize-none leading-6 placeholder:text-slate-300 overflow-y-auto custom-scrollbar"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                lineNumber: 3240,
                                                                                columnNumber: 49
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                        lineNumber: 3230,
                                                                        columnNumber: 45
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                    lineNumber: 3229,
                                                                    columnNumber: 41
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                    className: "jsx-bd40b562327a6f52" + " " + "flex items-center justify-between mt-2",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                            className: "jsx-bd40b562327a6f52" + " " + "flex items-center gap-1.5",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                                                                    type: "file",
                                                                                    ref: fileInputRef,
                                                                                    multiple: true,
                                                                                    onChange: handleFileSelect,
                                                                                    className: "jsx-bd40b562327a6f52" + " " + "hidden"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                    lineNumber: 3257,
                                                                                    columnNumber: 53
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                                    onClick: ()=>setShowAttachmentModal(true),
                                                                                    title: "Manage Attachments",
                                                                                    className: "jsx-bd40b562327a6f52" + " " + "flex items-center gap-1.5 px-2 py-1 rounded-md bg-slate-50 border border-slate-100 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 hover:border-indigo-100 transition-all duration-300 group/attach",
                                                                                    children: [
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                                            className: "jsx-bd40b562327a6f52" + " " + "fi flex  fi-rr-clip text-[10px] group-hover/attach:rotate-12 transition-transform"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                            lineNumber: 3269,
                                                                                            columnNumber: 57
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                            className: "jsx-bd40b562327a6f52" + " " + "text-[9px] font-black uppercase tracking-widest",
                                                                                            children: "Attachment"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                            lineNumber: 3270,
                                                                                            columnNumber: 57
                                                                                        }, this),
                                                                                        attachments.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                            className: "jsx-bd40b562327a6f52" + " " + "ml-0.5 w-3.5 h-3.5 rounded-full bg-indigo-600 text-white text-[8px] flex items-center justify-center font-bold",
                                                                                            children: attachments.length
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                            lineNumber: 3272,
                                                                                            columnNumber: 61
                                                                                        }, this)
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                    lineNumber: 3264,
                                                                                    columnNumber: 53
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                            lineNumber: 3256,
                                                                            columnNumber: 49
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                            onClick: ()=>{
                                                                                if (confirm("Clear all persistent notes?")) {
                                                                                    setLiveNotes("");
                                                                                    handleSaveLiveNotes("");
                                                                                }
                                                                            },
                                                                            title: "Clear All",
                                                                            className: "jsx-bd40b562327a6f52" + " " + `p-1 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all duration-300 ${liveNotes.length > 0 ? 'opacity-100' : 'opacity-0 pointer-events-none'}`,
                                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                                className: "jsx-bd40b562327a6f52" + " " + "fi flex  fi-rr-trash-undo text-xs"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                lineNumber: 3288,
                                                                                columnNumber: 53
                                                                            }, this)
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                            lineNumber: 3278,
                                                                            columnNumber: 49
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                    lineNumber: 3255,
                                                                    columnNumber: 41
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                            lineNumber: 3191,
                                                            columnNumber: 37
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                    lineNumber: 3184,
                                                    columnNumber: 33
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                lineNumber: 3183,
                                                columnNumber: 29
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "jsx-bd40b562327a6f52" + " " + "md:col-span-7 flex flex-col",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "jsx-bd40b562327a6f52" + " " + `flex-1 relative overflow-hidden rounded-[1rem] transition-all duration-1000 flex flex-col ${isCalling ? 'bg-gradient-to-br from-indigo-700 via-indigo-600 to-violet-800' : 'bg-white border border-slate-200   '}`,
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: "jsx-bd40b562327a6f52" + " " + "absolute inset-0 overflow-hidden pointer-events-none",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                    className: "jsx-bd40b562327a6f52" + " " + `absolute -top-24 -left-24 w-80 h-80 rounded-full blur-[100px] transition-all duration-1000 ${isCalling ? 'bg-white/15' : 'bg-indigo-50/50'}`
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                    lineNumber: 3303,
                                                                    columnNumber: 41
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                    className: "jsx-bd40b562327a6f52" + " " + `absolute -bottom-24 -right-24 w-80 h-80 rounded-full blur-[100px] transition-all duration-1000 ${isCalling ? 'bg-purple-500/20' : 'bg-violet-50/50'}`
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                    lineNumber: 3304,
                                                                    columnNumber: 41
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                            lineNumber: 3302,
                                                            columnNumber: 37
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: "jsx-bd40b562327a6f52" + " " + "relative z-10 p-3 h-full flex flex-col",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                className: "jsx-bd40b562327a6f52" + " " + "flex flex-col h-full justify-between gap-1 relative z-20",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                        className: "jsx-bd40b562327a6f52" + " " + "w-full text-center space-y-1 pt-1",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                className: "jsx-bd40b562327a6f52" + " " + `inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border    backdrop-blur-md transition-all duration-500 mx-auto ${isCalling ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-100' : 'bg-white/60 border-indigo-100 text-indigo-600'}`,
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                        className: "jsx-bd40b562327a6f52" + " " + "relative flex h-1.5 w-1.5",
                                                                                        children: [
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                                className: "jsx-bd40b562327a6f52" + " " + `animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isCalling ? 'bg-emerald-400' : 'bg-indigo-400'}`
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                                lineNumber: 3338,
                                                                                                columnNumber: 57
                                                                                            }, this),
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                                className: "jsx-bd40b562327a6f52" + " " + `relative inline-flex rounded-full h-1.5 w-1.5 ${isCalling ? 'bg-emerald-500' : 'bg-indigo-500'}`
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                                lineNumber: 3339,
                                                                                                columnNumber: 57
                                                                                            }, this)
                                                                                        ]
                                                                                    }, void 0, true, {
                                                                                        fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                        lineNumber: 3337,
                                                                                        columnNumber: 53
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                        className: "jsx-bd40b562327a6f52" + " " + "text-[8px] font-black uppercase tracking-widest leading-none pt-px",
                                                                                        children: localCallingStatus === 'preparing' ? 'Establishing' : localCallingStatus === 'connecting' ? 'Connecting' : isCalling ? 'Live' : postCall ? 'Done' : 'Ready'
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                        lineNumber: 3341,
                                                                                        columnNumber: 53
                                                                                    }, this)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                lineNumber: 3331,
                                                                                columnNumber: 49
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                className: "jsx-bd40b562327a6f52",
                                                                                children: isCalling ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                    className: "jsx-bd40b562327a6f52" + " " + "animate-in zoom-in duration-300 flex flex-col items-center",
                                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h1", {
                                                                                        style: {
                                                                                            textShadow: '0 2px 8px rgba(0,0,0,0.1)'
                                                                                        },
                                                                                        className: "jsx-bd40b562327a6f52" + " " + "text-2xl sm:text-3xl mt-2 font-bold text-white tracking-tighter tabular-nums ",
                                                                                        children: formatTime(callDuration)
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                        lineNumber: 3354,
                                                                                        columnNumber: 61
                                                                                    }, this)
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                    lineNumber: 3353,
                                                                                    columnNumber: 57
                                                                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                    className: "jsx-bd40b562327a6f52" + " " + "flex flex-col items-center",
                                                                                    children: [
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                                                                                            className: "jsx-bd40b562327a6f52" + " " + `text-xl mt-4 sm:text-2xl font-extrabold tracking-tight ${postCall ? 'text-slate-400' : 'text-slate-800'}`,
                                                                                            children: postCall ? 'Ended' : 'Ready To Call'
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                            lineNumber: 3360,
                                                                                            columnNumber: 61
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                                            className: "jsx-bd40b562327a6f52" + " " + "text-[9px] font-medium text-slate-400 max-w-[160px] leading-tight mt-0.5",
                                                                                            children: postCall ? 'Mark outcome.' : 'Line ready.'
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                            lineNumber: 3363,
                                                                                            columnNumber: 61
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                            onClick: ()=>setIsPhoneUnmasked(!isPhoneUnmasked),
                                                                                            className: "jsx-bd40b562327a6f52" + " " + "flex mt-4 flex-wrap justify-center items-center gap-1.5 px-2 py-1 rounded-full bg-blue-50 border border-blue-100 transition-all hover:bg-blue-100 hover:border-blue-200 cursor-pointer group/phone active:scale-95",
                                                                                            children: [
                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                                                    className: "jsx-bd40b562327a6f52" + " " + "fi flex fi-rr-phone-call text-xs text-blue-400 group-hover/phone:text-blue-500 transition-colors"
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                                    lineNumber: 3372,
                                                                                                    columnNumber: 65
                                                                                                }, this),
                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                                    className: "jsx-bd40b562327a6f52" + " " + "text-xs font-bold font-heading text-blue-700 group-hover/phone:text-blue-800 transition-colors",
                                                                                                    children: isPhoneUnmasked ? customer?.phone_no ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$phoneUtils$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["decryptPhone"])(customer.phone_no) : 'N/A' : (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$phoneUtils$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["formatMaskedPhone"])(customer?.phone_no) || 'N/A'
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                                    lineNumber: 3373,
                                                                                                    columnNumber: 65
                                                                                                }, this),
                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                                    className: "jsx-bd40b562327a6f52" + " " + `px-2 ml-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${(customer?.status || 'Active') !== 'Active' ? 'bg-orange-50 text-orange-600 border-orange-200' : 'bg-slate-100 text-slate-500 border-slate-200'}`,
                                                                                                    children: customer?.status || 'Active'
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                                    lineNumber: 3379,
                                                                                                    columnNumber: 61
                                                                                                }, this)
                                                                                            ]
                                                                                        }, void 0, true, {
                                                                                            fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                            lineNumber: 3368,
                                                                                            columnNumber: 62
                                                                                        }, this)
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                    lineNumber: 3359,
                                                                                    columnNumber: 57
                                                                                }, this)
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                lineNumber: 3351,
                                                                                columnNumber: 49
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                className: "jsx-bd40b562327a6f52" + " " + "flex mt-4 items-center justify-center min-h-[15px] py-1",
                                                                                children: isCalling && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                    className: "jsx-bd40b562327a6f52" + " " + "flex items-center gap-1 h-4",
                                                                                    children: [
                                                                                        ...Array(5)
                                                                                    ].map((_, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                            style: {
                                                                                                animationDelay: `${i * 0.12}s`,
                                                                                                height: `${30 + Math.random() * 70}%`
                                                                                            },
                                                                                            className: "jsx-bd40b562327a6f52" + " " + "w-1 bg-white/60 rounded-full animate-[bounce_1s_infinite]"
                                                                                        }, i, false, {
                                                                                            fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                            lineNumber: 3396,
                                                                                            columnNumber: 65
                                                                                        }, this))
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                    lineNumber: 3394,
                                                                                    columnNumber: 57
                                                                                }, this)
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                lineNumber: 3392,
                                                                                columnNumber: 49
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                        lineNumber: 3329,
                                                                        columnNumber: 45
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                        className: "jsx-bd40b562327a6f52" + " " + "w-full pb-0",
                                                                        children: isCalling ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                            className: "jsx-bd40b562327a6f52" + " " + "grid grid-cols-[1fr_auto] gap-2",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                                    onClick: ()=>handleEndCall(false),
                                                                                    className: "jsx-bd40b562327a6f52" + " " + "w-full h-12 rounded-xl bg-red-500 hover:bg-red-600 active:bg-red-700 text-white shadow-lg shadow-red-500/20 transition-all hover:scale-[1.01] active:scale-95 flex items-center justify-center gap-2 group overflow-hidden relative",
                                                                                    children: [
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                            className: "jsx-bd40b562327a6f52" + " " + "w-6 h-6 mr-3 rounded-full bg-white/20 flex items-center justify-center relative z-10 group-hover:rotate-12 transition-transform",
                                                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                                                className: "jsx-bd40b562327a6f52" + " " + "fi flex  fi-rr-phone-slash text-sm"
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                                lineNumber: 3413,
                                                                                                columnNumber: 65
                                                                                            }, this)
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                            lineNumber: 3412,
                                                                                            columnNumber: 61
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                            className: "jsx-bd40b562327a6f52" + " " + "font-extrabold text-[10px] uppercase tracking-widest relative z-10",
                                                                                            children: "End"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                            lineNumber: 3415,
                                                                                            columnNumber: 61
                                                                                        }, this)
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                    lineNumber: 3408,
                                                                                    columnNumber: 57
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                                    onClick: handleWhatsAppClick,
                                                                                    className: "jsx-bd40b562327a6f52" + " " + "h-12 w-12 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20 transition-all hover:scale-105 active:scale-95 flex items-center justify-center group",
                                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                                        className: "jsx-bd40b562327a6f52" + " " + "fi flex  fi-brands-whatsapp text-xl group-hover:rotate-12 transition-transform"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                        lineNumber: 3421,
                                                                                        columnNumber: 61
                                                                                    }, this)
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                    lineNumber: 3417,
                                                                                    columnNumber: 59
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                            lineNumber: 3407,
                                                                            columnNumber: 53
                                                                        }, this) : !postCall ? // CONDITIONAL LAYOUT: Follow-up vs Standard
                                                                        (customer?.status || 'Active').toLowerCase() === 'followup' ? // FOLLOW-UP LAYOUT (Unified Container)
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                            className: "jsx-bd40b562327a6f52" + " " + "w-full flex flex-col gap-2 p-2 rounded-2xl bg-orange-50/80 border border-orange-100",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                    className: "jsx-bd40b562327a6f52" + " " + "px-1 flex flex-col gap-0.5",
                                                                                    children: [
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                            className: "jsx-bd40b562327a6f52" + " " + "flex justify-between items-end",
                                                                                            children: [
                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                                    className: "jsx-bd40b562327a6f52" + " " + "text-[9px] font-bold text-orange-400 uppercase tracking-wider",
                                                                                                    children: "Last Interaction"
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                                    lineNumber: 3434,
                                                                                                    columnNumber: 69
                                                                                                }, this),
                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                                    className: "jsx-bd40b562327a6f52" + " " + "text-[9px] font-medium text-orange-800/60",
                                                                                                    children: lastInteraction ? formatDate(lastInteraction.created_at) : 'No history'
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                                    lineNumber: 3435,
                                                                                                    columnNumber: 69
                                                                                                }, this)
                                                                                            ]
                                                                                        }, void 0, true, {
                                                                                            fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                            lineNumber: 3433,
                                                                                            columnNumber: 66
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                                            className: "jsx-bd40b562327a6f52" + " " + "text-[10px] font-semibold text-orange-900 border-l-2 border-orange-300 pl-2 line-clamp-2 italic leading-tight",
                                                                                            children: [
                                                                                                '"',
                                                                                                lastInteraction?.notes || 'No notes available',
                                                                                                '"'
                                                                                            ]
                                                                                        }, void 0, true, {
                                                                                            fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                            lineNumber: 3437,
                                                                                            columnNumber: 66
                                                                                        }, this)
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                    lineNumber: 3432,
                                                                                    columnNumber: 61
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                    className: "jsx-bd40b562327a6f52" + " " + "flex items-center gap-2 w-full",
                                                                                    children: [
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                            ref: containerRef,
                                                                                            onPointerDown: (e)=>{
                                                                                                setIsDragging(true);
                                                                                                startXRef.current = e.clientX;
                                                                                                hasMovedRef.current = false;
                                                                                                if (sliderHandleRef.current) {
                                                                                                    sliderHandleRef.current.style.transition = 'none';
                                                                                                }
                                                                                                if (skipTextRef.current) {
                                                                                                    skipTextRef.current.style.transition = 'none';
                                                                                                }
                                                                                                try {
                                                                                                    e.target.setPointerCapture(e.pointerId);
                                                                                                } catch (err) {}
                                                                                            },
                                                                                            onPointerMove: (e)=>{
                                                                                                if (!isDragging || !containerRef.current || !sliderHandleRef.current || !skipTextRef.current) return;
                                                                                                const currentX = e.clientX;
                                                                                                const diff = currentX - startXRef.current;
                                                                                                if (Math.abs(diff) > 10) {
                                                                                                    hasMovedRef.current = true;
                                                                                                }
                                                                                                const containerWidth = containerRef.current.clientWidth;
                                                                                                const maxDrag = containerWidth * 0.85;
                                                                                                const x = Math.max(0, Math.min(diff, maxDrag));
                                                                                                sliderHandleRef.current.style.transform = `translateX(${x}px)`;
                                                                                                // Subtle Reveal logic (x/10 factor for subtle movement)
                                                                                                const opacity = Math.min(1, x / 40);
                                                                                                const lateralMove = Math.min(0, x / 10 - 15);
                                                                                                skipTextRef.current.style.opacity = String(opacity);
                                                                                                skipTextRef.current.style.transform = `translateX(${lateralMove}px)`;
                                                                                            },
                                                                                            onPointerUp: (e)=>{
                                                                                                if (!isDragging) return;
                                                                                                setIsDragging(false);
                                                                                                try {
                                                                                                    e.target.releasePointerCapture(e.pointerId);
                                                                                                } catch (err) {}
                                                                                                const containerWidth = containerRef.current?.clientWidth || 300;
                                                                                                const currentTransform = sliderHandleRef.current?.style.transform || "";
                                                                                                const match = currentTransform.match(/translateX\(([\d.]+)px\)/);
                                                                                                const x = match ? parseFloat(match[1]) : 0;
                                                                                                const threshold = containerWidth * 0.4;
                                                                                                if (x > threshold) {
                                                                                                    handleSkipCall();
                                                                                                } else if (!hasMovedRef.current && x < 5) {
                                                                                                    handleStartCall();
                                                                                                }
                                                                                                if (sliderHandleRef.current) {
                                                                                                    sliderHandleRef.current.style.transition = 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
                                                                                                    sliderHandleRef.current.style.transform = 'translateX(0px)';
                                                                                                }
                                                                                                if (skipTextRef.current) {
                                                                                                    skipTextRef.current.style.transition = 'all 0.3s ease';
                                                                                                    skipTextRef.current.style.opacity = '0';
                                                                                                    skipTextRef.current.style.transform = 'translateX(-15px)';
                                                                                                }
                                                                                            },
                                                                                            onPointerLeave: ()=>{
                                                                                                if (isDragging) {
                                                                                                    setIsDragging(false);
                                                                                                    if (sliderHandleRef.current) {
                                                                                                        sliderHandleRef.current.style.transition = 'transform 0.3s ease';
                                                                                                        sliderHandleRef.current.style.transform = 'translateX(0px)';
                                                                                                    }
                                                                                                    if (skipTextRef.current) {
                                                                                                        skipTextRef.current.style.transition = 'all 0.3s ease';
                                                                                                        skipTextRef.current.style.opacity = '0';
                                                                                                        skipTextRef.current.style.transform = 'translateX(-15px)';
                                                                                                    }
                                                                                                }
                                                                                            },
                                                                                            className: "jsx-bd40b562327a6f52" + " " + "relative h-[54px] flex-1 rounded-2xl bg-orange-100/50 overflow-hidden select-none touch-none shadow-inner border border-orange-200 group/slider",
                                                                                            children: [
                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                                    className: "jsx-bd40b562327a6f52" + " " + "absolute inset-0 flex items-center justify-start pl-6 bg-transparent pointer-events-none",
                                                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                                        ref: skipTextRef,
                                                                                                        style: {
                                                                                                            transform: 'translateX(-15px)'
                                                                                                        },
                                                                                                        className: "jsx-bd40b562327a6f52" + " " + "text-orange-500 font-black uppercase text-[11px] tracking-widest flex items-center gap-2 opacity-0 inline-block",
                                                                                                        children: [
                                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                                                                className: "jsx-bd40b562327a6f52" + " " + "fi flex  fi-rr-forward-step text-sm"
                                                                                                            }, void 0, false, {
                                                                                                                fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                                                lineNumber: 3535,
                                                                                                                columnNumber: 82
                                                                                                            }, this),
                                                                                                            " Skip Lead"
                                                                                                        ]
                                                                                                    }, void 0, true, {
                                                                                                        fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                                        lineNumber: 3530,
                                                                                                        columnNumber: 77
                                                                                                    }, this)
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                                    lineNumber: 3529,
                                                                                                    columnNumber: 73
                                                                                                }, this),
                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                                    ref: sliderHandleRef,
                                                                                                    style: {
                                                                                                        cursor: isDragging ? 'grabbing' : 'grab'
                                                                                                    },
                                                                                                    className: "jsx-bd40b562327a6f52" + " " + `absolute inset-0 w-full bg-gradient-to-r from-orange-500 to-amber-600 rounded-2xl flex items-center justify-center gap-3 shadow-lg shadow-orange-500/30 will-change-transform z-10 ${isDragging ? 'shadow-2xl brightness-110' : ''}`,
                                                                                                    children: [
                                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                                                            className: "jsx-bd40b562327a6f52" + " " + "fi flex  fi-rr-phone-call text-white text-lg"
                                                                                                        }, void 0, false, {
                                                                                                            fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                                            lineNumber: 3547,
                                                                                                            columnNumber: 77
                                                                                                        }, this),
                                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                                            className: "jsx-bd40b562327a6f52" + " " + "flex flex-col items-start leading-none",
                                                                                                            children: [
                                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                                                    className: "jsx-bd40b562327a6f52" + " " + "text-white font-black text-xs uppercase tracking-widest",
                                                                                                                    children: "Connect Now"
                                                                                                                }, void 0, false, {
                                                                                                                    fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                                                    lineNumber: 3549,
                                                                                                                    columnNumber: 81
                                                                                                                }, this),
                                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                                                    className: "jsx-bd40b562327a6f52" + " " + "text-white/70 font-bold text-[8px] uppercase tracking-tighter",
                                                                                                                    children: "Follow Up Call"
                                                                                                                }, void 0, false, {
                                                                                                                    fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                                                    lineNumber: 3550,
                                                                                                                    columnNumber: 81
                                                                                                                }, this)
                                                                                                            ]
                                                                                                        }, void 0, true, {
                                                                                                            fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                                            lineNumber: 3548,
                                                                                                            columnNumber: 77
                                                                                                        }, this)
                                                                                                    ]
                                                                                                }, void 0, true, {
                                                                                                    fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                                    lineNumber: 3540,
                                                                                                    columnNumber: 73
                                                                                                }, this)
                                                                                            ]
                                                                                        }, void 0, true, {
                                                                                            fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                            lineNumber: 3445,
                                                                                            columnNumber: 69
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                                            onClick: handleWhatsAppClick,
                                                                                            className: "jsx-bd40b562327a6f52" + " " + "h-[54px] w-[54px] rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white transition-all hover:scale-105 active:scale-95 flex items-center justify-center group shrink-0",
                                                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                                                className: "jsx-bd40b562327a6f52" + " " + "fi flex  fi-brands-whatsapp text-2xl group-hover:rotate-12 transition-transform"
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                                lineNumber: 3560,
                                                                                                columnNumber: 69
                                                                                            }, this)
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                            lineNumber: 3556,
                                                                                            columnNumber: 65
                                                                                        }, this)
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                    lineNumber: 3443,
                                                                                    columnNumber: 61
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                            lineNumber: 3430,
                                                                            columnNumber: 57
                                                                        }, this) : // STANDARD LAYOUT (Grid)
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                            className: "jsx-bd40b562327a6f52" + " " + "grid grid-cols-[1fr_auto] gap-2",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                                    onClick: handleStartCall,
                                                                                    className: "jsx-bd40b562327a6f52" + " " + "h-12 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-[11px] uppercase tracking-widest shadow-lg shadow-indigo-500/25 transition-all hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-2 group relative overflow-hidden",
                                                                                    children: [
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                            className: "jsx-bd40b562327a6f52" + " " + "w-6 h-6 rounded-lg flex items-center justify-center relative z-10 group-hover:shake",
                                                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                                                className: "jsx-bd40b562327a6f52" + " " + "fi flex  fi-rr-phone-call text-sm"
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                                lineNumber: 3572,
                                                                                                columnNumber: 69
                                                                                            }, this)
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                            lineNumber: 3571,
                                                                                            columnNumber: 65
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                            className: "jsx-bd40b562327a6f52" + " " + "relative z-10",
                                                                                            children: "Call Now"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                            lineNumber: 3574,
                                                                                            columnNumber: 65
                                                                                        }, this)
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                    lineNumber: 3567,
                                                                                    columnNumber: 61
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                                    onClick: handleWhatsAppClick,
                                                                                    className: "jsx-bd40b562327a6f52" + " " + "h-12 w-12 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20 transition-all hover:scale-105 active:scale-95 flex items-center justify-center group",
                                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                                        className: "jsx-bd40b562327a6f52" + " " + "fi flex  fi-brands-whatsapp text-xl group-hover:rotate-12 transition-transform"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                        lineNumber: 3581,
                                                                                        columnNumber: 65
                                                                                    }, this)
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                    lineNumber: 3577,
                                                                                    columnNumber: 61
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                            lineNumber: 3566,
                                                                            columnNumber: 57
                                                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                            className: "jsx-bd40b562327a6f52" + " " + "grid grid-cols-2 gap-2 animate-in fade-in slide-in-from-bottom-2 duration-300",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                                    onClick: handleStartCall,
                                                                                    className: "jsx-bd40b562327a6f52" + " " + "h-10 rounded-lg bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-600 font-bold text-[9px] uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 hover:  ",
                                                                                    children: [
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                                            className: "jsx-bd40b562327a6f52" + " " + "fi flex  fi-rr-refresh text-xs"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                            lineNumber: 3591,
                                                                                            columnNumber: 61
                                                                                        }, this),
                                                                                        " Redial"
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                    lineNumber: 3587,
                                                                                    columnNumber: 57
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                                    onClick: handleWhatsAppClick,
                                                                                    className: "jsx-bd40b562327a6f52" + " " + "h-10 rounded-lg bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-600 font-bold text-[9px] uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 hover:  ",
                                                                                    children: [
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                                            className: "jsx-bd40b562327a6f52" + " " + "fi flex  fi-brands-whatsapp text-xs"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                            lineNumber: 3597,
                                                                                            columnNumber: 61
                                                                                        }, this),
                                                                                        " Chat"
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                    lineNumber: 3593,
                                                                                    columnNumber: 57
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                            lineNumber: 3586,
                                                                            columnNumber: 53
                                                                        }, this)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                        lineNumber: 3405,
                                                                        columnNumber: 45
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                lineNumber: 3325,
                                                                columnNumber: 37
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                            lineNumber: 3324,
                                                            columnNumber: 37
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                    lineNumber: 3296,
                                                    columnNumber: 33
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                lineNumber: 3294,
                                                columnNumber: 29
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                        lineNumber: 2929,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "jsx-bd40b562327a6f52" + " " + "grid grid-cols-1 md:grid-cols-12 gap-6",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "jsx-bd40b562327a6f52" + " " + "md:col-span-3 bg-white rounded-2xl p-5 sm:p-8 border border-slate-200 relative overflow-hidden h-auto xl:min-h-[800px] flex flex-col",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: "jsx-bd40b562327a6f52" + " " + "absolute top-0 right-0 w-24 h-24 bg-indigo-50/30 rounded-bl-[3rem] -z-0"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                        lineNumber: 3613,
                                                        columnNumber: 41
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: "jsx-bd40b562327a6f52" + " " + "relative z-10 flex flex-col h-full",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                className: "jsx-bd40b562327a6f52" + " " + "flex items-center gap-3 mb-8",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                        className: "jsx-bd40b562327a6f52" + " " + "w-10 h-10 rounded-2xl bg-indigo-600 shadow-lg shadow-indigo-100 flex items-center justify-center text-white",
                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                            className: "jsx-bd40b562327a6f52" + " " + "fi flex   fi-rr-info text-sm"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                            lineNumber: 3617,
                                                                            columnNumber: 53
                                                                        }, this)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                        lineNumber: 3616,
                                                                        columnNumber: 49
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                        className: "jsx-bd40b562327a6f52" + " " + "flex-1",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                className: "jsx-bd40b562327a6f52" + " " + "flex items-center justify-between",
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                                                                                        className: "jsx-bd40b562327a6f52" + " " + "font-semibold text-slate-800",
                                                                                        children: " Details"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                        lineNumber: 3621,
                                                                                        columnNumber: 57
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                                        onClick: handleEditDetailsClick,
                                                                                        className: "jsx-bd40b562327a6f52" + " " + "flex items-center  px-3 py-3 rounded-lg bg-indigo-50  text-indigo-600 hover:bg-slate-900 hover:text-white transition-all group/editbtn",
                                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                                            className: "jsx-bd40b562327a6f52" + " " + "fi flex fi-rr-edit text-[9px] group-hover/editbtn:text-indigo-300"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                            lineNumber: 3626,
                                                                                            columnNumber: 61
                                                                                        }, this)
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                        lineNumber: 3622,
                                                                                        columnNumber: 57
                                                                                    }, this)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                lineNumber: 3620,
                                                                                columnNumber: 53
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                                className: "jsx-bd40b562327a6f52" + " " + "text-[10px] font-semibold text-slate-400 ",
                                                                                children: "Reference Data"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                lineNumber: 3630,
                                                                                columnNumber: 53
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                        lineNumber: 3619,
                                                                        columnNumber: 49
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                lineNumber: 3615,
                                                                columnNumber: 45
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                className: "jsx-bd40b562327a6f52" + " " + "flex-initial xl:flex-1 xl:overflow-y-auto overflow-visible pr-2 custom-scrollbar",
                                                                children: renderCleanedDetails(customer?.customer_details)
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                lineNumber: 3633,
                                                                columnNumber: 46
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                        lineNumber: 3614,
                                                        columnNumber: 41
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                lineNumber: 3612,
                                                columnNumber: 37
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "jsx-bd40b562327a6f52" + " " + `md:col-span-5 bg-white rounded-2xl p-5 border border-slate-200 relative transition-opacity duration-500 h-auto xl:min-h-[800px] flex flex-col ${!postCall ? 'opacity-40 grayscale pointer-events-none' : 'opacity-100'}`,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: "jsx-bd40b562327a6f52" + " " + "absolute top-0 right-0 w-24 h-24 bg-purple-50/30 rounded-bl-[3rem] z-0"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                        lineNumber: 3641,
                                                        columnNumber: 41
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: "jsx-bd40b562327a6f52" + " " + "relative z-10 space-y-6 flex-1 pb-24",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                className: "jsx-bd40b562327a6f52" + " " + "flex items-center gap-3",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                        className: "jsx-bd40b562327a6f52" + " " + "w-10 h-10 rounded-2xl bg-purple-600 shadow-lg shadow-purple-100 flex items-center justify-center text-white",
                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                            className: "jsx-bd40b562327a6f52" + " " + "fi flex   fi-rr-check-circle text-sm"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                            lineNumber: 3645,
                                                                            columnNumber: 53
                                                                        }, this)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                        lineNumber: 3644,
                                                                        columnNumber: 49
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                        className: "jsx-bd40b562327a6f52",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                                                                                className: "jsx-bd40b562327a6f52" + " " + "text-lg font-bold text-slate-900 tracking-tight",
                                                                                children: "Set Outcome"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                lineNumber: 3648,
                                                                                columnNumber: 53
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                                className: "jsx-bd40b562327a6f52" + " " + "text-[10px] font-bold text-slate-400 uppercase tracking-widest",
                                                                                children: "Post-Call Disposition"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                lineNumber: 3649,
                                                                                columnNumber: 53
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                        lineNumber: 3647,
                                                                        columnNumber: 49
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                lineNumber: 3643,
                                                                columnNumber: 45
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                className: "jsx-bd40b562327a6f52" + " " + "space-y-4",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                        className: "jsx-bd40b562327a6f52" + " " + "space-y-3",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                className: "jsx-bd40b562327a6f52" + " " + "flex items-center justify-between px-1",
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                                        className: "jsx-bd40b562327a6f52" + " " + "text-[10px] font-bold text-slate-400 uppercase tracking-widest",
                                                                                        children: "Primary Status"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                        lineNumber: 3657,
                                                                                        columnNumber: 57
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                        ref: assignPickerRef,
                                                                                        className: "jsx-bd40b562327a6f52" + " " + "relative",
                                                                                        children: [
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                                                onClick: ()=>setIsAssignPickerOpen(!isAssignPickerOpen),
                                                                                                className: "jsx-bd40b562327a6f52" + " " + "flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-50 border border-indigo-100/50 hover:bg-slate-900 hover:text-white transition-all group",
                                                                                                children: [
                                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                                                        className: "jsx-bd40b562327a6f52" + " " + "fi flex fi-rr-user-gear flex text-[10px] text-indigo-500 group-hover:text-indigo-300"
                                                                                                    }, void 0, false, {
                                                                                                        fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                                        lineNumber: 3664,
                                                                                                        columnNumber: 65
                                                                                                    }, this),
                                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                                        className: "jsx-bd40b562327a6f52" + " " + "text-[9px] font-bold uppercase tracking-tight text-indigo-600 group-hover:text-white",
                                                                                                        children: "Assigned To"
                                                                                                    }, void 0, false, {
                                                                                                        fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                                        lineNumber: 3665,
                                                                                                        columnNumber: 65
                                                                                                    }, this),
                                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                                                        className: "jsx-bd40b562327a6f52" + " " + `fi fi-rr-angle-small-down flex text-[10px] transition-transform ${isAssignPickerOpen ? 'rotate-180' : ''}`
                                                                                                    }, void 0, false, {
                                                                                                        fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                                        lineNumber: 3666,
                                                                                                        columnNumber: 65
                                                                                                    }, this)
                                                                                                ]
                                                                                            }, void 0, true, {
                                                                                                fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                                lineNumber: 3660,
                                                                                                columnNumber: 61
                                                                                            }, this),
                                                                                            isAssignPickerOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                                className: "jsx-bd40b562327a6f52" + " " + "absolute top-full mt-2 right-0 w-[180px] bg-white rounded-2xl shadow-2xl border border-slate-200 p-2 z-[110] animate-in fade-in zoom-in-95 duration-200",
                                                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                                    className: "jsx-bd40b562327a6f52" + " " + "max-h-[200px] overflow-y-auto custom-scrollbar",
                                                                                                    children: !campaign?.users || campaign.users.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                                        className: "jsx-bd40b562327a6f52" + " " + "p-4 text-center",
                                                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                                                            className: "jsx-bd40b562327a6f52" + " " + "text-[10px] text-slate-400 font-bold uppercase",
                                                                                                            children: "No Users Found"
                                                                                                        }, void 0, false, {
                                                                                                            fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                                            lineNumber: 3674,
                                                                                                            columnNumber: 81
                                                                                                        }, this)
                                                                                                    }, void 0, false, {
                                                                                                        fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                                        lineNumber: 3673,
                                                                                                        columnNumber: 77
                                                                                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                                        className: "jsx-bd40b562327a6f52" + " " + "space-y-1",
                                                                                                        children: campaign.users.map((u)=>{
                                                                                                            const targetId = u.user_id || u.id;
                                                                                                            const isSelected = customer?.managed_by === targetId;
                                                                                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                                                                onClick: ()=>handleUpdateManagedBy(targetId),
                                                                                                                className: "jsx-bd40b562327a6f52" + " " + `w-full flex items-center gap-2 p-2 rounded-xl transition-all hover:bg-indigo-50 ${isSelected ? 'bg-indigo-600 text-white hover:bg-indigo-600' : 'text-slate-600'}`,
                                                                                                                children: [
                                                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                                                        className: "jsx-bd40b562327a6f52" + " " + `w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-bold ${isSelected ? 'bg-white/20' : 'bg-indigo-100 text-indigo-600'}`,
                                                                                                                        children: u.name?.charAt(0) || 'U'
                                                                                                                    }, void 0, false, {
                                                                                                                        fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                                                        lineNumber: 3687,
                                                                                                                        columnNumber: 93
                                                                                                                    }, this),
                                                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                                                        className: "jsx-bd40b562327a6f52" + " " + "text-left overflow-hidden",
                                                                                                                        children: [
                                                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                                                                                className: "jsx-bd40b562327a6f52" + " " + "text-[10px] font-bold truncate leading-tight",
                                                                                                                                children: u.name || 'Unknown'
                                                                                                                            }, void 0, false, {
                                                                                                                                fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                                                                lineNumber: 3691,
                                                                                                                                columnNumber: 97
                                                                                                                            }, this),
                                                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                                                                                className: "jsx-bd40b562327a6f52" + " " + `text-[8px] truncate ${isSelected ? 'text-indigo-200' : 'text-slate-400'}`,
                                                                                                                                children: u.email || 'No email'
                                                                                                                            }, void 0, false, {
                                                                                                                                fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                                                                lineNumber: 3692,
                                                                                                                                columnNumber: 97
                                                                                                                            }, this)
                                                                                                                        ]
                                                                                                                    }, void 0, true, {
                                                                                                                        fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                                                        lineNumber: 3690,
                                                                                                                        columnNumber: 93
                                                                                                                    }, this)
                                                                                                                ]
                                                                                                            }, u.id, true, {
                                                                                                                fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                                                lineNumber: 3682,
                                                                                                                columnNumber: 89
                                                                                                            }, this);
                                                                                                        })
                                                                                                    }, void 0, false, {
                                                                                                        fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                                        lineNumber: 3677,
                                                                                                        columnNumber: 77
                                                                                                    }, this)
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                                    lineNumber: 3671,
                                                                                                    columnNumber: 69
                                                                                                }, this)
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                                lineNumber: 3670,
                                                                                                columnNumber: 65
                                                                                            }, this)
                                                                                        ]
                                                                                    }, void 0, true, {
                                                                                        fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                        lineNumber: 3659,
                                                                                        columnNumber: 57
                                                                                    }, this)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                lineNumber: 3656,
                                                                                columnNumber: 53
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                className: "jsx-bd40b562327a6f52" + " " + "grid grid-cols-2 sm:grid-cols-3 gap-2",
                                                                                children: primaryDispositions.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                                        onClick: ()=>{
                                                                                            setDisposition(item);
                                                                                            setSubDisposition("");
                                                                                            // Auto-set current time + 5m when selecting Call Back
                                                                                            if (item === 'Call Back') {
                                                                                                const now = new Date();
                                                                                                const futureBtn = new Date(now.getTime() + 5 * 60000);
                                                                                                const dStr = `${futureBtn.getFullYear()}-${String(futureBtn.getMonth() + 1).padStart(2, '0')}-${String(futureBtn.getDate()).padStart(2, '0')}`;
                                                                                                const tStr = futureBtn.toLocaleTimeString([], {
                                                                                                    hour: '2-digit',
                                                                                                    minute: '2-digit',
                                                                                                    hour12: false
                                                                                                });
                                                                                                setCallbackDate(dStr);
                                                                                                setCallbackTime(tStr);
                                                                                            }
                                                                                        },
                                                                                        className: "jsx-bd40b562327a6f52" + " " + `px-3 py-4 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all border ${disposition === item ? 'bg-indigo-600 text-white border-indigo-600   scale-105' : 'bg-white text-slate-500 border-slate-200 hover:border-indigo-400 hover:text-indigo-600 hover:  '}`,
                                                                                        children: item
                                                                                    }, item, false, {
                                                                                        fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                        lineNumber: 3706,
                                                                                        columnNumber: 61
                                                                                    }, this))
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                lineNumber: 3704,
                                                                                columnNumber: 54
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                        lineNumber: 3655,
                                                                        columnNumber: 49
                                                                    }, this),
                                                                    disposition && dispositionHierarchy[disposition]?.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                        className: "jsx-bd40b562327a6f52" + " " + "space-y-4 animate-in fade-in slide-in-from-top-2 duration-300",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                                className: "jsx-bd40b562327a6f52" + " " + "text-[10px] font-bold text-indigo-400 uppercase tracking-widest pl-1 text-[10px]",
                                                                                children: "Reason / Type"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                lineNumber: 3736,
                                                                                columnNumber: 57
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                className: "jsx-bd40b562327a6f52" + " " + "grid grid-cols-2 sm:grid-cols-3 gap-2",
                                                                                children: dispositionHierarchy[disposition].map((sub)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                                        onClick: ()=>{
                                                                                            setSubDisposition(sub);
                                                                                            setOutcome("");
                                                                                        },
                                                                                        className: "jsx-bd40b562327a6f52" + " " + `px-1 py-4 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all border ${subDisposition === sub ? 'bg-indigo-600 text-white border-indigo-600   scale-105' : 'bg-white text-indigo-500 border-indigo-100 hover:border-indigo-400 hover:bg-indigo-50 hover:  '}`,
                                                                                        children: sub
                                                                                    }, sub, false, {
                                                                                        fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                        lineNumber: 3739,
                                                                                        columnNumber: 69
                                                                                    }, this))
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                lineNumber: 3737,
                                                                                columnNumber: 58
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                        lineNumber: 3735,
                                                                        columnNumber: 53
                                                                    }, this),
                                                                    (disposition === 'Call Back' || disposition === 'Not Contactable') && subDisposition && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                        className: "jsx-bd40b562327a6f52" + " " + "space-y-4 animate-in fade-in slide-in-from-top-2 duration-300",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                className: "jsx-bd40b562327a6f52" + " " + "flex items-center justify-between pl-1",
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                                        className: "jsx-bd40b562327a6f52" + " " + "text-[10px] font-bold text-indigo-400 uppercase tracking-widest",
                                                                                        children: "Outcome"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                        lineNumber: 3762,
                                                                                        columnNumber: 61
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                                        onClick: ()=>setIsAddingOutcome(true),
                                                                                        className: "jsx-bd40b562327a6f52" + " " + "text-[10px] text-indigo-600 font-bold hover:text-indigo-800 flex items-center gap-1 bg-indigo-50 px-2 py-1 rounded-lg border border-indigo-100 transition-all hover:bg-indigo-100",
                                                                                        children: [
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                                                className: "jsx-bd40b562327a6f52" + " " + "fi flex  fi-rr-plus-small"
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                                lineNumber: 3767,
                                                                                                columnNumber: 65
                                                                                            }, this),
                                                                                            " Add New"
                                                                                        ]
                                                                                    }, void 0, true, {
                                                                                        fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                        lineNumber: 3763,
                                                                                        columnNumber: 61
                                                                                    }, this)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                lineNumber: 3761,
                                                                                columnNumber: 57
                                                                            }, this),
                                                                            isAddingOutcome && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                className: "jsx-bd40b562327a6f52" + " " + "flex items-center gap-2 mb-2 animate-in fade-in slide-in-from-top-1 bg-indigo-50/50 p-2 rounded-xl border border-indigo-100",
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                                                                        type: "text",
                                                                                        value: newOutcomeInput,
                                                                                        onChange: (e)=>setNewOutcomeInput(e.target.value),
                                                                                        placeholder: "New outcome label...",
                                                                                        autoFocus: true,
                                                                                        className: "jsx-bd40b562327a6f52" + " " + "flex-1 text-gray-500 px-3 py-2 text-xs border border-indigo-200 rounded-lg focus:outline-none focus:border-indigo-500 bg-white"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                        lineNumber: 3773,
                                                                                        columnNumber: 65
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                                        onClick: handleAddOutcome,
                                                                                        className: "jsx-bd40b562327a6f52" + " " + "px-3 py-2 bg-indigo-600 text-white rounded-lg text-xs font-bold hover:bg-indigo-700 shadow-md shadow-indigo-200",
                                                                                        children: "Add"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                        lineNumber: 3781,
                                                                                        columnNumber: 65
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                                        onClick: ()=>setIsAddingOutcome(false),
                                                                                        className: "jsx-bd40b562327a6f52" + " " + "px-3 py-2 bg-white text-slate-500 rounded-lg text-xs font-bold hover:bg-slate-50 border border-slate-200",
                                                                                        children: "Cancel"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                        lineNumber: 3787,
                                                                                        columnNumber: 65
                                                                                    }, this)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                lineNumber: 3772,
                                                                                columnNumber: 61
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                className: "jsx-bd40b562327a6f52" + " " + "flex flex-wrap gap-2",
                                                                                children: [
                                                                                    userOutcomes.map((out)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                            onClick: ()=>setOutcome(out.outcome_label),
                                                                                            className: "jsx-bd40b562327a6f52" + " " + `group relative flex items-center px-3 py-2 rounded-lg border transition-all cursor-pointer ${outcome === out.outcome_label ? 'bg-indigo-600 text-white border-indigo-600 shadow-md scale-105' : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300 hover:bg-indigo-50'}`,
                                                                                            children: [
                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                                    className: "jsx-bd40b562327a6f52" + " " + "text-[10px] font-bold uppercase tracking-wider",
                                                                                                    children: out.outcome_label
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                                    lineNumber: 3807,
                                                                                                    columnNumber: 69
                                                                                                }, this),
                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                                                    onClick: (e)=>{
                                                                                                        e.stopPropagation();
                                                                                                        handleDeleteOutcome(out.id);
                                                                                                    },
                                                                                                    className: "jsx-bd40b562327a6f52" + " " + `absolute -top-2 -right-2 w-5 h-5 bg-white text-red-500 border border-red-100 rounded-full items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hidden group-hover:flex    hover:bg-red-50`,
                                                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                                                        className: "jsx-bd40b562327a6f52" + " " + "fi flex fi-rr-cross-small text-[10px]"
                                                                                                    }, void 0, false, {
                                                                                                        fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                                        lineNumber: 3815,
                                                                                                        columnNumber: 74
                                                                                                    }, this)
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                                    lineNumber: 3808,
                                                                                                    columnNumber: 69
                                                                                                }, this)
                                                                                            ]
                                                                                        }, out.id, true, {
                                                                                            fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                            lineNumber: 3798,
                                                                                            columnNumber: 65
                                                                                        }, this)),
                                                                                    userOutcomes.length === 0 && !isAddingOutcome && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                        className: "jsx-bd40b562327a6f52" + " " + "w-full text-center py-4 bg-slate-50 rounded-xl border border-dashed border-slate-200",
                                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                                            className: "jsx-bd40b562327a6f52" + " " + "text-[10px] text-slate-400 italic",
                                                                                            children: 'No custom outcomes added yet. Click "+ Add New" to create one.'
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                            lineNumber: 3821,
                                                                                            columnNumber: 69
                                                                                        }, this)
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                        lineNumber: 3820,
                                                                                        columnNumber: 66
                                                                                    }, this)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                lineNumber: 3796,
                                                                                columnNumber: 57
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                        lineNumber: 3760,
                                                                        columnNumber: 53
                                                                    }, this),
                                                                    disposition === 'Call Back' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                        className: "jsx-bd40b562327a6f52" + " " + "space-y-3 p-6 rounded-2xl bg-indigo-50/40 border border-indigo-100/50 backdrop-blur-sm animate-in zoom-in-95 duration-500 relative",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                className: "jsx-bd40b562327a6f52" + " " + "absolute inset-0 overflow-hidden rounded-2xl pointer-events-none",
                                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                    className: "jsx-bd40b562327a6f52" + " " + "absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl -mr-16 -mt-16"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                    lineNumber: 3835,
                                                                                    columnNumber: 61
                                                                                }, this)
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                lineNumber: 3834,
                                                                                columnNumber: 57
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                className: "jsx-bd40b562327a6f52" + " " + "flex items-center justify-between relative z-10",
                                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                    className: "jsx-bd40b562327a6f52" + " " + "flex items-center gap-2.5",
                                                                                    children: [
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                            className: "jsx-bd40b562327a6f52" + " " + "w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-200",
                                                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                                                className: "jsx-bd40b562327a6f52" + " " + "fi flex  fi-rr-calendar-clock text-xs"
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                                lineNumber: 3841,
                                                                                                columnNumber: 69
                                                                                            }, this)
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                            lineNumber: 3840,
                                                                                            columnNumber: 65
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                            className: "jsx-bd40b562327a6f52",
                                                                                            children: [
                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                                                    className: "jsx-bd40b562327a6f52" + " " + "text-[10px] font-bold text-slate-800 uppercase tracking-widest leading-none mb-1",
                                                                                                    children: "Schedule Call"
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                                    lineNumber: 3844,
                                                                                                    columnNumber: 69
                                                                                                }, this),
                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                                                    className: "jsx-bd40b562327a6f52" + " " + "text-[12px] font-semibold text-slate-400",
                                                                                                    children: callbackDate ? `Interaction set for ${formatDate(callbackDate)}` : 'Next interaction timeline'
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                                    lineNumber: 3845,
                                                                                                    columnNumber: 69
                                                                                                }, this)
                                                                                            ]
                                                                                        }, void 0, true, {
                                                                                            fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                            lineNumber: 3843,
                                                                                            columnNumber: 65
                                                                                        }, this)
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                    lineNumber: 3839,
                                                                                    columnNumber: 61
                                                                                }, this)
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                lineNumber: 3838,
                                                                                columnNumber: 57
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                className: "jsx-bd40b562327a6f52" + " " + "flex flex-wrap mt-4 gap-1.5 relative z-10",
                                                                                children: [
                                                                                    {
                                                                                        label: '10 Min',
                                                                                        icon: 'clock',
                                                                                        action: ()=>{
                                                                                            const now = new Date();
                                                                                            now.setMinutes(now.getMinutes() + 10);
                                                                                            const localDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
                                                                                            setCallbackDate(localDate);
                                                                                            setCallbackTime(now.toLocaleTimeString([], {
                                                                                                hour: '2-digit',
                                                                                                minute: '2-digit',
                                                                                                hour12: false
                                                                                            }));
                                                                                            setActivePreset('10 Min');
                                                                                        }
                                                                                    },
                                                                                    {
                                                                                        label: 'In 1 Hr',
                                                                                        icon: 'clock-three',
                                                                                        action: ()=>{
                                                                                            const now = new Date();
                                                                                            now.setHours(now.getHours() + 1);
                                                                                            const localDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
                                                                                            setCallbackDate(localDate);
                                                                                            setCallbackTime(now.toLocaleTimeString([], {
                                                                                                hour: '2-digit',
                                                                                                minute: '2-digit',
                                                                                                hour12: false
                                                                                            }));
                                                                                            setActivePreset('In 1 Hr');
                                                                                        }
                                                                                    },
                                                                                    {
                                                                                        label: '3 Hr',
                                                                                        icon: 'stopwatch',
                                                                                        action: ()=>{
                                                                                            const now = new Date();
                                                                                            now.setHours(now.getHours() + 3);
                                                                                            const localDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
                                                                                            setCallbackDate(localDate);
                                                                                            setCallbackTime(now.toLocaleTimeString([], {
                                                                                                hour: '2-digit',
                                                                                                minute: '2-digit',
                                                                                                hour12: false
                                                                                            }));
                                                                                            setActivePreset('3 Hr');
                                                                                        }
                                                                                    },
                                                                                    {
                                                                                        label: 'Tomorrow',
                                                                                        icon: 'sunrise',
                                                                                        action: ()=>{
                                                                                            const now = new Date();
                                                                                            const tomorrow = new Date(now);
                                                                                            tomorrow.setDate(tomorrow.getDate() + 1);
                                                                                            const localDate = `${tomorrow.getFullYear()}-${String(tomorrow.getMonth() + 1).padStart(2, '0')}-${String(tomorrow.getDate()).padStart(2, '0')}`;
                                                                                            setCallbackDate(localDate);
                                                                                            setCallbackTime(now.toLocaleTimeString([], {
                                                                                                hour: '2-digit',
                                                                                                minute: '2-digit',
                                                                                                hour12: false
                                                                                            }));
                                                                                            setActivePreset('Tomorrow');
                                                                                        }
                                                                                    }
                                                                                ].map((preset)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                                        type: "button",
                                                                                        onClick: preset.action,
                                                                                        className: "jsx-bd40b562327a6f52" + " " + `px-2.5 py-1.5 rounded-lg border text-[10px] font-bold transition-all flex items-center gap-1.5 ${activePreset === preset.label ? 'bg-indigo-600 text-white border-indigo-600 transform scale-105' : 'bg-white text-indigo-600 border-indigo-100 hover:border-indigo-300 hover:bg-indigo-50'}`,
                                                                                        children: [
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                                                className: "jsx-bd40b562327a6f52" + " " + `fi flex fi-rr-${preset.icon} text-[10px]`
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                                lineNumber: 3916,
                                                                                                columnNumber: 69
                                                                                            }, this),
                                                                                            preset.label
                                                                                        ]
                                                                                    }, preset.label, true, {
                                                                                        fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                        lineNumber: 3906,
                                                                                        columnNumber: 65
                                                                                    }, this))
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                lineNumber: 3853,
                                                                                columnNumber: 57
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                className: "jsx-bd40b562327a6f52" + " " + "grid grid-cols-1 md:grid-cols-2 gap-3 relative z-50",
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                        ref: datePickerRef,
                                                                                        className: "jsx-bd40b562327a6f52" + " " + "relative group/date",
                                                                                        children: [
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                                className: "jsx-bd40b562327a6f52" + " " + "absolute  inset-y-0 left-3 flex items-center pointer-events-none z-10",
                                                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                                                    className: "jsx-bd40b562327a6f52" + " " + "fi flex  fi-rr-calendar text-slate-400 text-[12px]"
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                                    lineNumber: 3926,
                                                                                                    columnNumber: 69
                                                                                                }, this)
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                                lineNumber: 3925,
                                                                                                columnNumber: 65
                                                                                            }, this),
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                                                type: "button",
                                                                                                onClick: ()=>setIsDatePickerOpen(!isDatePickerOpen),
                                                                                                className: "jsx-bd40b562327a6f52" + " " + "w-full h-[40px] bg-white rounded-xl pl-9 pr-3 text-[10px] font-bold text-slate-700 border border-slate-200 flex items-center hover:border-indigo-200 transition-all uppercase tracking-tight",
                                                                                                children: callbackDate ? formatDate(callbackDate) : 'Select Date'
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                                lineNumber: 3928,
                                                                                                columnNumber: 65
                                                                                            }, this),
                                                                                            isDatePickerOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                                className: "jsx-bd40b562327a6f52" + " " + "absolute top-full mt-2 left-0 w-[240px] bg-white rounded-2xl shadow-2xl border border-slate-200 p-4 z-[100] animate-in fade-in zoom-in-95 duration-200",
                                                                                                children: [
                                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                                        className: "jsx-bd40b562327a6f52" + " " + "flex items-center justify-between mb-4",
                                                                                                        children: [
                                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                                                                type: "button",
                                                                                                                onClick: ()=>setCalendarViewDate(new Date(calendarViewDate.getFullYear(), calendarViewDate.getMonth() - 1)),
                                                                                                                className: "jsx-bd40b562327a6f52" + " " + "w-8 h-8 rounded-lg hover:bg-slate-50 flex items-center justify-center text-slate-400",
                                                                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                                                                    className: "jsx-bd40b562327a6f52" + " " + "fi flex fi-rr-angle-left text-[10px]"
                                                                                                                }, void 0, false, {
                                                                                                                    fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                                                    lineNumber: 3945,
                                                                                                                    columnNumber: 81
                                                                                                                }, this)
                                                                                                            }, void 0, false, {
                                                                                                                fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                                                lineNumber: 3940,
                                                                                                                columnNumber: 77
                                                                                                            }, this),
                                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                                                                className: "jsx-bd40b562327a6f52" + " " + "text-[12px] font-bold text-slate-800",
                                                                                                                children: [
                                                                                                                    months[calendarViewDate.getMonth()],
                                                                                                                    " ",
                                                                                                                    calendarViewDate.getFullYear()
                                                                                                                ]
                                                                                                            }, void 0, true, {
                                                                                                                fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                                                lineNumber: 3947,
                                                                                                                columnNumber: 77
                                                                                                            }, this),
                                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                                                                type: "button",
                                                                                                                onClick: ()=>setCalendarViewDate(new Date(calendarViewDate.getFullYear(), calendarViewDate.getMonth() + 1)),
                                                                                                                className: "jsx-bd40b562327a6f52" + " " + "w-8 h-8 rounded-lg hover:bg-slate-50 flex items-center justify-center text-slate-400",
                                                                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                                                                    className: "jsx-bd40b562327a6f52" + " " + "fi flex fi-rr-angle-right text-[10px]"
                                                                                                                }, void 0, false, {
                                                                                                                    fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                                                    lineNumber: 3955,
                                                                                                                    columnNumber: 81
                                                                                                                }, this)
                                                                                                            }, void 0, false, {
                                                                                                                fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                                                lineNumber: 3950,
                                                                                                                columnNumber: 77
                                                                                                            }, this)
                                                                                                        ]
                                                                                                    }, void 0, true, {
                                                                                                        fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                                        lineNumber: 3939,
                                                                                                        columnNumber: 73
                                                                                                    }, this),
                                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                                        className: "jsx-bd40b562327a6f52" + " " + "grid grid-cols-7 mb-2",
                                                                                                        children: weekDays.map((d)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                                                className: "jsx-bd40b562327a6f52" + " " + "text-[10px] font-bold text-slate-400 text-center",
                                                                                                                children: d
                                                                                                            }, d, false, {
                                                                                                                fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                                                lineNumber: 3962,
                                                                                                                columnNumber: 81
                                                                                                            }, this))
                                                                                                    }, void 0, false, {
                                                                                                        fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                                        lineNumber: 3960,
                                                                                                        columnNumber: 73
                                                                                                    }, this),
                                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                                        className: "jsx-bd40b562327a6f52" + " " + "grid grid-cols-7 gap-1",
                                                                                                        children: generateCalendarDays().map((d, i)=>{
                                                                                                            const dateObj = new Date(d.year, d.month, d.day);
                                                                                                            const isToday = new Date().toDateString() === dateObj.toDateString();
                                                                                                            const isSelected = callbackDate === `${d.year}-${String(d.month + 1).padStart(2, '0')}-${String(d.day).padStart(2, '0')}`;
                                                                                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                                                                type: "button",
                                                                                                                onClick: ()=>handleDateSelect(d.day, d.month, d.year),
                                                                                                                className: "jsx-bd40b562327a6f52" + " " + `h-7 rounded-lg text-[10px] font-bold transition-all flex items-center justify-center ${isSelected ? 'bg-indigo-600 text-white' : !d.currentMonth ? 'text-slate-300 hover:bg-slate-50' : isToday ? 'text-indigo-600 bg-indigo-50' : 'text-slate-600 hover:bg-slate-50'}`,
                                                                                                                children: d.day
                                                                                                            }, i, false, {
                                                                                                                fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                                                lineNumber: 3974,
                                                                                                                columnNumber: 85
                                                                                                            }, this);
                                                                                                        })
                                                                                                    }, void 0, false, {
                                                                                                        fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                                        lineNumber: 3967,
                                                                                                        columnNumber: 73
                                                                                                    }, this)
                                                                                                ]
                                                                                            }, void 0, true, {
                                                                                                fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                                lineNumber: 3937,
                                                                                                columnNumber: 69
                                                                                            }, this)
                                                                                        ]
                                                                                    }, void 0, true, {
                                                                                        fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                        lineNumber: 3924,
                                                                                        columnNumber: 61
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                        ref: timePickerRef,
                                                                                        className: "jsx-bd40b562327a6f52" + " " + "relative",
                                                                                        children: [
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                                className: "jsx-bd40b562327a6f52" + " " + "absolute inset-y-0 left-3 flex items-center pointer-events-none",
                                                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                                                    className: "jsx-bd40b562327a6f52" + " " + "fi flex  fi-rr-clock-three text-slate-400 text-[12px]"
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                                    lineNumber: 4000,
                                                                                                    columnNumber: 69
                                                                                                }, this)
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                                lineNumber: 3999,
                                                                                                columnNumber: 65
                                                                                            }, this),
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                                                type: "button",
                                                                                                onClick: ()=>{
                                                                                                    if (!isTimePickerOpen) {
                                                                                                        setTimePickerPos({
                                                                                                            x: 0,
                                                                                                            y: 0
                                                                                                        });
                                                                                                        if (callbackTime) {
                                                                                                            const [h24, m] = callbackTime.split(':').map(Number);
                                                                                                            const h12 = h24 % 12 || 12;
                                                                                                            setTempHour(String(h12).padStart(2, '0'));
                                                                                                            setTempMinute(String(m || 0).padStart(2, '0'));
                                                                                                            setTempAmPm(h24 >= 12 ? "PM" : "AM");
                                                                                                        } else {
                                                                                                            const now = new Date();
                                                                                                            const h24 = now.getHours();
                                                                                                            const h12 = h24 % 12 || 12;
                                                                                                            setTempHour(String(h12).padStart(2, '0'));
                                                                                                            setTempMinute(String(now.getMinutes()).padStart(2, '0'));
                                                                                                            setTempAmPm(h24 >= 12 ? "PM" : "AM");
                                                                                                        }
                                                                                                    }
                                                                                                    setIsTimePickerOpen(!isTimePickerOpen);
                                                                                                },
                                                                                                className: "jsx-bd40b562327a6f52" + " " + "w-full h-[40px] bg-white rounded-xl pl-9 pr-3 text-[10px] font-bold text-slate-700 border border-slate-200 flex items-center hover:border-indigo-200 transition-all uppercase tracking-tight",
                                                                                                children: callbackTime ? (()=>{
                                                                                                    const [h24, min] = callbackTime.split(':').map(Number);
                                                                                                    const h12 = h24 % 12 || 12;
                                                                                                    const ampm = h24 >= 12 ? 'PM' : 'AM';
                                                                                                    return `${String(h12).padStart(2, '0')}:${String(min).padStart(2, '0')} ${ampm}`;
                                                                                                })() : 'Select Time'
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                                lineNumber: 4002,
                                                                                                columnNumber: 66
                                                                                            }, this),
                                                                                            isTimePickerOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                                style: {
                                                                                                    transform: `translate(${timePickerPos.x}px, ${timePickerPos.y}px)`
                                                                                                },
                                                                                                className: "jsx-bd40b562327a6f52" + " " + "absolute top-full mt-2 right-0 w-[240px] bg-white rounded-2xl shadow-2xl border border-slate-200 p-4 z-[100] animate-in fade-in zoom-in-95 duration-200",
                                                                                                children: [
                                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                                        onMouseDown: handleTimePickerMouseDown,
                                                                                                        className: "jsx-bd40b562327a6f52" + " " + "flex items-center justify-between mb-4 pl-1 cursor-grab active:cursor-grabbing select-none",
                                                                                                        children: [
                                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                                                                className: "jsx-bd40b562327a6f52" + " " + "text-[10px] font-bold text-slate-400 uppercase tracking-widest pointer-events-none",
                                                                                                                children: "Set Callback Time"
                                                                                                            }, void 0, false, {
                                                                                                                fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                                                lineNumber: 4045,
                                                                                                                columnNumber: 77
                                                                                                            }, this),
                                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                                                className: "jsx-bd40b562327a6f52" + " " + "p-1 hover:bg-slate-50 rounded-md transition-colors",
                                                                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                                                                    className: "jsx-bd40b562327a6f52" + " " + "fi flex fi-rr-apps text-slate-300 text-xs"
                                                                                                                }, void 0, false, {
                                                                                                                    fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                                                    lineNumber: 4047,
                                                                                                                    columnNumber: 82
                                                                                                                }, this)
                                                                                                            }, void 0, false, {
                                                                                                                fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                                                lineNumber: 4046,
                                                                                                                columnNumber: 77
                                                                                                            }, this)
                                                                                                        ]
                                                                                                    }, void 0, true, {
                                                                                                        fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                                        lineNumber: 4041,
                                                                                                        columnNumber: 73
                                                                                                    }, this),
                                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                                        className: "jsx-bd40b562327a6f52" + " " + "flex items-center justify-between gap-2 mb-6 bg-slate-50 p-3 rounded-2xl border border-slate-100",
                                                                                                        children: [
                                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                                                className: "jsx-bd40b562327a6f52" + " " + "flex-1 flex flex-col items-center gap-1",
                                                                                                                children: [
                                                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                                                        className: "jsx-bd40b562327a6f52" + " " + "text-[8px] font-bold text-slate-400 uppercase mb-1",
                                                                                                                        children: "HH"
                                                                                                                    }, void 0, false, {
                                                                                                                        fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                                                        lineNumber: 4054,
                                                                                                                        columnNumber: 81
                                                                                                                    }, this),
                                                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                                                        ref: hourScrollRef,
                                                                                                                        className: "jsx-bd40b562327a6f52" + " " + "h-[120px] overflow-y-auto w-full custom-scrollbar flex flex-col gap-1 items-center px-1 py-[44px]",
                                                                                                                        children: Array.from({
                                                                                                                            length: 12
                                                                                                                        }).map((_, i)=>{
                                                                                                                            const h = String(i + 1).padStart(2, '0');
                                                                                                                            const isSel = tempHour === h;
                                                                                                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                                                                                onClick: ()=>setTempHour(h),
                                                                                                                                "data-active": isSel,
                                                                                                                                className: "jsx-bd40b562327a6f52" + " " + `w-full py-2 rounded-xl text-[11px] font-bold transition-all ${isSel ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'text-slate-500 hover:bg-white hover:text-indigo-600'}`,
                                                                                                                                children: h
                                                                                                                            }, h, false, {
                                                                                                                                fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                                                                lineNumber: 4063,
                                                                                                                                columnNumber: 93
                                                                                                                            }, this);
                                                                                                                        })
                                                                                                                    }, void 0, false, {
                                                                                                                        fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                                                        lineNumber: 4055,
                                                                                                                        columnNumber: 81
                                                                                                                    }, this)
                                                                                                                ]
                                                                                                            }, void 0, true, {
                                                                                                                fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                                                lineNumber: 4053,
                                                                                                                columnNumber: 77
                                                                                                            }, this),
                                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                                                className: "jsx-bd40b562327a6f52" + " " + "text-slate-300 font-bold",
                                                                                                                children: ":"
                                                                                                            }, void 0, false, {
                                                                                                                fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                                                lineNumber: 4076,
                                                                                                                columnNumber: 77
                                                                                                            }, this),
                                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                                                className: "jsx-bd40b562327a6f52" + " " + "flex-1 flex flex-col items-center gap-1",
                                                                                                                children: [
                                                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                                                        className: "jsx-bd40b562327a6f52" + " " + "text-[8px] font-bold text-slate-400 uppercase mb-1",
                                                                                                                        children: "MM"
                                                                                                                    }, void 0, false, {
                                                                                                                        fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                                                        lineNumber: 4080,
                                                                                                                        columnNumber: 81
                                                                                                                    }, this),
                                                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                                                        ref: minuteScrollRef,
                                                                                                                        className: "jsx-bd40b562327a6f52" + " " + "h-[120px] overflow-y-auto w-full custom-scrollbar flex flex-col gap-1 items-center px-1 py-[44px]",
                                                                                                                        children: Array.from({
                                                                                                                            length: 60
                                                                                                                        }).map((_, i)=>{
                                                                                                                            const m = String(i).padStart(2, '0');
                                                                                                                            const isSel = tempMinute === m;
                                                                                                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                                                                                onClick: ()=>setTempMinute(m),
                                                                                                                                "data-active": isSel,
                                                                                                                                className: "jsx-bd40b562327a6f52" + " " + `w-full py-2 rounded-xl text-[11px] font-bold transition-all ${isSel ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'text-slate-500 hover:bg-white hover:text-indigo-600'}`,
                                                                                                                                children: m
                                                                                                                            }, m, false, {
                                                                                                                                fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                                                                lineNumber: 4089,
                                                                                                                                columnNumber: 93
                                                                                                                            }, this);
                                                                                                                        })
                                                                                                                    }, void 0, false, {
                                                                                                                        fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                                                        lineNumber: 4081,
                                                                                                                        columnNumber: 81
                                                                                                                    }, this)
                                                                                                                ]
                                                                                                            }, void 0, true, {
                                                                                                                fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                                                lineNumber: 4079,
                                                                                                                columnNumber: 77
                                                                                                            }, this),
                                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                                                className: "jsx-bd40b562327a6f52" + " " + "w-px bg-slate-200 h-10 mx-1"
                                                                                                            }, void 0, false, {
                                                                                                                fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                                                lineNumber: 4102,
                                                                                                                columnNumber: 77
                                                                                                            }, this),
                                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                                                className: "jsx-bd40b562327a6f52" + " " + "flex-none w-[50px] flex flex-col items-center gap-1",
                                                                                                                children: [
                                                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                                                        className: "jsx-bd40b562327a6f52" + " " + "text-[8px] font-bold text-slate-400 uppercase mb-1",
                                                                                                                        children: "Period"
                                                                                                                    }, void 0, false, {
                                                                                                                        fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                                                        lineNumber: 4106,
                                                                                                                        columnNumber: 81
                                                                                                                    }, this),
                                                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                                                        className: "jsx-bd40b562327a6f52" + " " + "flex flex-col gap-1 w-full",
                                                                                                                        children: [
                                                                                                                            "AM",
                                                                                                                            "PM"
                                                                                                                        ].map((p)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                                                                                onClick: ()=>setTempAmPm(p),
                                                                                                                                "data-active": tempAmPm === p,
                                                                                                                                className: "jsx-bd40b562327a6f52" + " " + `w-full py-2 rounded-xl text-[10px] font-black transition-all ${tempAmPm === p ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:bg-white'}`,
                                                                                                                                children: p
                                                                                                                            }, p, false, {
                                                                                                                                fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                                                                lineNumber: 4109,
                                                                                                                                columnNumber: 89
                                                                                                                            }, this))
                                                                                                                    }, void 0, false, {
                                                                                                                        fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                                                        lineNumber: 4107,
                                                                                                                        columnNumber: 81
                                                                                                                    }, this)
                                                                                                                ]
                                                                                                            }, void 0, true, {
                                                                                                                fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                                                lineNumber: 4105,
                                                                                                                columnNumber: 77
                                                                                                            }, this)
                                                                                                        ]
                                                                                                    }, void 0, true, {
                                                                                                        fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                                        lineNumber: 4051,
                                                                                                        columnNumber: 73
                                                                                                    }, this),
                                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                                        className: "jsx-bd40b562327a6f52" + " " + "grid grid-cols-2 gap-2 mb-4",
                                                                                                        children: [
                                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                                                                type: "button",
                                                                                                                onClick: ()=>setIsTimePickerOpen(false),
                                                                                                                className: "jsx-bd40b562327a6f52" + " " + "py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-slate-50 transition-all border border-slate-100",
                                                                                                                children: "Cancel"
                                                                                                            }, void 0, false, {
                                                                                                                fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                                                lineNumber: 4123,
                                                                                                                columnNumber: 77
                                                                                                            }, this),
                                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                                                                type: "button",
                                                                                                                onClick: ()=>{
                                                                                                                    let h = Number(tempHour);
                                                                                                                    if (tempAmPm === "PM" && h < 12) h += 12;
                                                                                                                    if (tempAmPm === "AM" && h === 12) h = 0;
                                                                                                                    setCallbackTime(`${String(h).padStart(2, '0')}:${tempMinute}`);
                                                                                                                    setActivePreset(null);
                                                                                                                    setIsTimePickerOpen(false);
                                                                                                                },
                                                                                                                className: "jsx-bd40b562327a6f52" + " " + "py-2.5 rounded-xl bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all active:scale-95",
                                                                                                                children: "Apply"
                                                                                                            }, void 0, false, {
                                                                                                                fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                                                lineNumber: 4130,
                                                                                                                columnNumber: 77
                                                                                                            }, this)
                                                                                                        ]
                                                                                                    }, void 0, true, {
                                                                                                        fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                                        lineNumber: 4122,
                                                                                                        columnNumber: 73
                                                                                                    }, this),
                                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                                        className: "jsx-bd40b562327a6f52" + " " + "h-px bg-slate-100 mb-4"
                                                                                                    }, void 0, false, {
                                                                                                        fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                                        lineNumber: 4146,
                                                                                                        columnNumber: 73
                                                                                                    }, this),
                                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                                                        className: "jsx-bd40b562327a6f52" + " " + "text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 pl-1",
                                                                                                        children: "Popular Slots"
                                                                                                    }, void 0, false, {
                                                                                                        fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                                        lineNumber: 4148,
                                                                                                        columnNumber: 73
                                                                                                    }, this),
                                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                                        className: "jsx-bd40b562327a6f52" + " " + "grid grid-cols-2 gap-2 max-h-[100px] overflow-y-auto pr-1 custom-scrollbar",
                                                                                                        children: timeOptions.map((t)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                                                                type: "button",
                                                                                                                onClick: ()=>{
                                                                                                                    setCallbackTime(t);
                                                                                                                    setActivePreset(null);
                                                                                                                    setIsTimePickerOpen(false);
                                                                                                                },
                                                                                                                className: "jsx-bd40b562327a6f52" + " " + `py-1.5 rounded-xl text-[10px] font-bold transition-all border ${callbackTime === t ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-indigo-200 hover:text-indigo-600'}`,
                                                                                                                children: (()=>{
                                                                                                                    const [h24, min] = t.split(':').map(Number);
                                                                                                                    const h12 = h24 % 12 || 12;
                                                                                                                    const p = h24 >= 12 ? 'PM' : 'AM';
                                                                                                                    return `${String(h12).padStart(2, '0')}:${String(min).padStart(2, '0')} ${p}`;
                                                                                                                })()
                                                                                                            }, t, false, {
                                                                                                                fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                                                lineNumber: 4151,
                                                                                                                columnNumber: 81
                                                                                                            }, this))
                                                                                                    }, void 0, false, {
                                                                                                        fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                                        lineNumber: 4149,
                                                                                                        columnNumber: 73
                                                                                                    }, this)
                                                                                                ]
                                                                                            }, void 0, true, {
                                                                                                fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                                lineNumber: 4037,
                                                                                                columnNumber: 69
                                                                                            }, this)
                                                                                        ]
                                                                                    }, void 0, true, {
                                                                                        fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                        lineNumber: 3998,
                                                                                        columnNumber: 61
                                                                                    }, this),
                                                                                    callbackDate && callbackTime && new Date(`${callbackDate}T${callbackTime}`) < new Date() && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                        className: "jsx-bd40b562327a6f52" + " " + "flex items-center gap-2 mt-2 px-1 animate-pulse",
                                                                                        children: [
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                                                className: "jsx-bd40b562327a6f52" + " " + "fi flex fi-rr-info text-red-500 text-[12px]"
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                                lineNumber: 4180,
                                                                                                columnNumber: 69
                                                                                            }, this),
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                                                className: "jsx-bd40b562327a6f52" + " " + "text-red-500 text-[10px] font-bold uppercase tracking-tight",
                                                                                                children: "Cannot schedule for a past time!"
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                                lineNumber: 4181,
                                                                                                columnNumber: 69
                                                                                            }, this)
                                                                                        ]
                                                                                    }, void 0, true, {
                                                                                        fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                        lineNumber: 4179,
                                                                                        columnNumber: 65
                                                                                    }, this)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                lineNumber: 3922,
                                                                                columnNumber: 57
                                                                            }, this),
                                                                            conflictInfo && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                className: "jsx-bd40b562327a6f52" + " " + "mt-4 p-4 rounded-2xl bg-rose-50 border border-rose-100 animate-in fade-in slide-in-from-top-2 duration-300 relative z-10",
                                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                    className: "jsx-bd40b562327a6f52" + " " + "flex items-start gap-3",
                                                                                    children: [
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                            className: "jsx-bd40b562327a6f52" + " " + "w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center shrink-0",
                                                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                                                className: "jsx-bd40b562327a6f52" + " " + "fi flex  fi-rr-triangle-warning text-rose-500 text-sm"
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                                lineNumber: 4191,
                                                                                                columnNumber: 73
                                                                                            }, this)
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                            lineNumber: 4190,
                                                                                            columnNumber: 69
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                            className: "jsx-bd40b562327a6f52" + " " + "flex-1 min-w-0",
                                                                                            children: [
                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                                                    className: "jsx-bd40b562327a6f52" + " " + "text-[11px] font-black text-rose-900 uppercase tracking-widest mb-1",
                                                                                                    children: "Slot Conflict Detected"
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                                    lineNumber: 4194,
                                                                                                    columnNumber: 73
                                                                                                }, this),
                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                                    className: "jsx-bd40b562327a6f52" + " " + "space-y-1 bg-white/50 p-2 rounded-lg border border-rose-100/50 mb-3",
                                                                                                    children: [
                                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                                                            className: "jsx-bd40b562327a6f52" + " " + "text-[12px] font-bold text-slate-800 truncate",
                                                                                                            children: [
                                                                                                                "👤 ",
                                                                                                                conflictInfo.customer_name
                                                                                                            ]
                                                                                                        }, void 0, true, {
                                                                                                            fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                                            lineNumber: 4196,
                                                                                                            columnNumber: 77
                                                                                                        }, this),
                                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                                                            className: "jsx-bd40b562327a6f52" + " " + "text-[10px] text-slate-500 font-medium truncate",
                                                                                                            children: [
                                                                                                                "📂 Campaign ID: ",
                                                                                                                conflictInfo.campaign_id
                                                                                                            ]
                                                                                                        }, void 0, true, {
                                                                                                            fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                                            lineNumber: 4197,
                                                                                                            columnNumber: 77
                                                                                                        }, this),
                                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                                                            className: "jsx-bd40b562327a6f52" + " " + "text-[10px] text-slate-500 font-medium",
                                                                                                            children: [
                                                                                                                "🏷️ ",
                                                                                                                conflictInfo.disposition,
                                                                                                                " - ",
                                                                                                                conflictInfo.sub_disposition || 'N/A'
                                                                                                            ]
                                                                                                        }, void 0, true, {
                                                                                                            fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                                            lineNumber: 4198,
                                                                                                            columnNumber: 77
                                                                                                        }, this)
                                                                                                    ]
                                                                                                }, void 0, true, {
                                                                                                    fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                                    lineNumber: 4195,
                                                                                                    columnNumber: 73
                                                                                                }, this),
                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                                    className: "jsx-bd40b562327a6f52" + " " + "flex flex-col gap-2",
                                                                                                    children: [
                                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                                                            onClick: async ()=>{
                                                                                                                const dt = new Date(`${callbackDate}T${callbackTime}`);
                                                                                                                dt.setMinutes(dt.getMinutes() + 15);
                                                                                                                const newDate = `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}-${String(dt.getDate()).padStart(2, '0')}`;
                                                                                                                const newTime = dt.toLocaleTimeString([], {
                                                                                                                    hour: '2-digit',
                                                                                                                    minute: '2-digit',
                                                                                                                    hour12: false
                                                                                                                });
                                                                                                                setCallbackDate(newDate);
                                                                                                                setCallbackTime(newTime);
                                                                                                                setConflictInfo(null);
                                                                                                                // Recursive check
                                                                                                                const nextDt = new Date(`${newDate}T${newTime}`);
                                                                                                                nextDt.setSeconds(0, 0);
                                                                                                                const sR = nextDt.toISOString();
                                                                                                                const eR = new Date(nextDt.getTime() + 59999).toISOString();
                                                                                                                const { data: nextConflicts, error: nextConflictErr } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from('customers').select('id, customer_name, campaign_id, disposition, sub_disposition, outcome').or(`managed_by.eq.${user?.uid},assigned_to.eq.${user?.uid}`).gte('next_called_at', sR).lte('next_called_at', eR).neq('id', customerId).limit(1);
                                                                                                                if (nextConflicts && nextConflicts.length > 0) {
                                                                                                                    setConflictInfo(nextConflicts[0]);
                                                                                                                } else {
                                                                                                                    // If slot free, proceed with save using the updated time directly
                                                                                                                    executeSaveDisposition(newDate, newTime);
                                                                                                                }
                                                                                                            },
                                                                                                            className: "jsx-bd40b562327a6f52" + " " + "w-full py-2.5 bg-rose-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-700 transition-all flex items-center justify-center gap-2",
                                                                                                            children: "Check Next Slot (+15m)"
                                                                                                        }, void 0, false, {
                                                                                                            fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                                            lineNumber: 4202,
                                                                                                            columnNumber: 77
                                                                                                        }, this),
                                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                                                            onClick: ()=>{
                                                                                                                setConflictInfo(null);
                                                                                                                setCallbackDate("");
                                                                                                                setCallbackTime("");
                                                                                                            },
                                                                                                            className: "jsx-bd40b562327a6f52" + " " + "w-full py-2.5 bg-white text-slate-500 rounded-xl text-[10px] font-black uppercase tracking-widest border border-slate-200 hover:bg-slate-50 transition-all",
                                                                                                            children: "Cancel & Reset"
                                                                                                        }, void 0, false, {
                                                                                                            fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                                            lineNumber: 4239,
                                                                                                            columnNumber: 77
                                                                                                        }, this)
                                                                                                    ]
                                                                                                }, void 0, true, {
                                                                                                    fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                                    lineNumber: 4201,
                                                                                                    columnNumber: 73
                                                                                                }, this)
                                                                                            ]
                                                                                        }, void 0, true, {
                                                                                            fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                            lineNumber: 4193,
                                                                                            columnNumber: 69
                                                                                        }, this)
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                    lineNumber: 4189,
                                                                                    columnNumber: 65
                                                                                }, this)
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                lineNumber: 4188,
                                                                                columnNumber: 61
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                        lineNumber: 3832,
                                                                        columnNumber: 53
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                        className: "jsx-bd40b562327a6f52" + " " + "space-y-2",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                                className: "jsx-bd40b562327a6f52" + " " + "text-[12px] font-bold text-slate-400 uppercase tracking-widest pl-1",
                                                                                children: "Session Notes"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                lineNumber: 4258,
                                                                                columnNumber: 53
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("textarea", {
                                                                                value: notes,
                                                                                onChange: (e)=>setNotes(e.target.value),
                                                                                placeholder: "Add specific details about the conversation...",
                                                                                className: "jsx-bd40b562327a6f52" + " " + "w-full bg-slate-50/50 text-gray-700 rounded-2xl p-4 text-xs font-semibold border border-slate-200 focus:ring-2 focus:ring-indigo-100 focus:bg-white focus:outline-none transition-all min-h-[80px] resize-none"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                lineNumber: 4259,
                                                                                columnNumber: 53
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                        lineNumber: 4257,
                                                                        columnNumber: 49
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                        disabled: saving || !postCall || prefetchStatus === 'fetching',
                                                                        onClick: handleSaveDisposition,
                                                                        className: "jsx-bd40b562327a6f52" + " " + `w-full h-11 rounded-2xl font-semibold text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 ${prefetchStatus === 'fetching' ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-slate-900 text-white shadow-lg active:scale-95'}`,
                                                                        children: saving ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["Fragment"], {
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                    className: "jsx-bd40b562327a6f52" + " " + "w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                    lineNumber: 4274,
                                                                                    columnNumber: 61
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                    className: "jsx-bd40b562327a6f52",
                                                                                    children: "Processing..."
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                    lineNumber: 4275,
                                                                                    columnNumber: 61
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true) : prefetchStatus === 'fetching' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["Fragment"], {
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                    className: "jsx-bd40b562327a6f52" + " " + "w-3 h-3 border-2 border-slate-300 border-t-slate-500 rounded-full animate-spin"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                    lineNumber: 4279,
                                                                                    columnNumber: 61
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                    className: "jsx-bd40b562327a6f52",
                                                                                    children: "Syncing Lead..."
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                    lineNumber: 4280,
                                                                                    columnNumber: 61
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true) : 'Save & Continue'
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                        lineNumber: 4267,
                                                                        columnNumber: 49
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                lineNumber: 3653,
                                                                columnNumber: 45
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                        lineNumber: 3642,
                                                        columnNumber: 42
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                lineNumber: 3640,
                                                columnNumber: 37
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "jsx-bd40b562327a6f52" + " " + "md:col-span-4 bg-white rounded-2xl p-5 sm:p-8 border border-slate-200 h-auto xl:min-h-[800px] flex flex-col",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: "jsx-bd40b562327a6f52" + " " + "flex items-center justify-between mb-6 gap-4",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                className: "jsx-bd40b562327a6f52" + " " + "flex bg-slate-100 p-1 rounded-xl overflow-x-auto whitespace-nowrap custom-scrollbar no-scrollbar scroll-smooth",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                        onClick: ()=>setTimelineView('timeline'),
                                                                        "data-active": timelineView === 'timeline',
                                                                        className: "jsx-bd40b562327a6f52" + " " + `px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${timelineView === 'timeline' ? 'bg-white    text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`,
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                                className: "jsx-bd40b562327a6f52" + " " + "fi flex fi-rr-time-past"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                lineNumber: 4299,
                                                                                columnNumber: 49
                                                                            }, this),
                                                                            "Timeline"
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                        lineNumber: 4294,
                                                                        columnNumber: 45
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                        onClick: ()=>setTimelineView('call_logs'),
                                                                        "data-active": timelineView === 'call_logs',
                                                                        className: "jsx-bd40b562327a6f52" + " " + `px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${timelineView === 'call_logs' ? 'bg-white    text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`,
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                                className: "jsx-bd40b562327a6f52" + " " + "fi flex fi-rr-call-history"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                lineNumber: 4307,
                                                                                columnNumber: 49
                                                                            }, this),
                                                                            "Logs"
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                        lineNumber: 4302,
                                                                        columnNumber: 45
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                        onClick: ()=>setTimelineView('schedules'),
                                                                        "data-active": timelineView === 'schedules',
                                                                        className: "jsx-bd40b562327a6f52" + " " + `px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${timelineView === 'schedules' ? 'bg-white    text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`,
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                                className: "jsx-bd40b562327a6f52" + " " + "fi flex fi-rr-calendar-clock"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                lineNumber: 4315,
                                                                                columnNumber: 49
                                                                            }, this),
                                                                            "Schedules"
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                        lineNumber: 4310,
                                                                        columnNumber: 45
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                lineNumber: 4293,
                                                                columnNumber: 45
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                className: "jsx-bd40b562327a6f52" + " " + "w-9 h-9 shrink-0 rounded-full bg-slate-50 flex items-center justify-center text-[11px] font-bold text-slate-600 border border-slate-200 shadow-sm",
                                                                children: timelineView === 'timeline' ? history.length : timelineView === 'call_logs' ? mobileLogs.length : scheduledCalls.length
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                lineNumber: 4319,
                                                                columnNumber: 41
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                        lineNumber: 4292,
                                                        columnNumber: 41
                                                    }, this),
                                                    timelineView === 'timeline' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: "jsx-bd40b562327a6f52" + " " + "h-[650px] overflow-y-auto px-4 custom-scrollbar",
                                                        children: history.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: "jsx-bd40b562327a6f52" + " " + "h-full flex flex-col items-center justify-center text-center opacity-30 grayscale py-20",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                    className: "jsx-bd40b562327a6f52" + " " + "w-20 h-20 rounded-2xl bg-slate-100 flex items-center justify-center mb-4",
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                        className: "jsx-bd40b562327a6f52" + " " + "fi flex   fi-rr-box-open text-2xl"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                        lineNumber: 4329,
                                                                        columnNumber: 57
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                    lineNumber: 4328,
                                                                    columnNumber: 53
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                    className: "jsx-bd40b562327a6f52" + " " + "text-xs font-semibold ",
                                                                    children: "No Activity Yet"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                    lineNumber: 4331,
                                                                    columnNumber: 53
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                            lineNumber: 4327,
                                                            columnNumber: 49
                                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: "jsx-bd40b562327a6f52" + " " + "relative pl-6 border-l-2 border-slate-200 space-y-6",
                                                            children: history.map((log)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                    className: "jsx-bd40b562327a6f52" + " " + "relative",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                            className: "jsx-bd40b562327a6f52" + " " + `absolute -left-[33px] top-1 w-4 h-4 rounded-full border-4 border-white    ${log.disposition === 'Deal Done' ? 'bg-green-500' : log.disposition === 'Call Back' ? 'bg-amber-500' : log.disposition === 'Not Contactable' ? 'bg-red-400' : 'bg-indigo-500'}`
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                            lineNumber: 4338,
                                                                            columnNumber: 57
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                            className: "jsx-bd40b562327a6f52" + " " + "space-y-2",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                    className: "jsx-bd40b562327a6f52" + " " + "flex items-center justify-between",
                                                                                    children: [
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                            className: "jsx-bd40b562327a6f52" + " " + "flex items-center gap-2",
                                                                                            children: [
                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                                    className: "jsx-bd40b562327a6f52" + " " + `text-[10px] font-bold uppercase tracking-tight ${log.disposition === 'Deal Done' ? 'text-green-600' : log.disposition === 'Call Back' ? 'text-amber-600' : log.disposition === 'Not Contactable' ? 'text-red-500' : 'text-slate-900'}`,
                                                                                                    children: log.disposition || 'N/A'
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                                    lineNumber: 4349,
                                                                                                    columnNumber: 69
                                                                                                }, this),
                                                                                                log.sub_disposition && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                                    className: "jsx-bd40b562327a6f52" + " " + "text-[10px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full",
                                                                                                    children: log.sub_disposition
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                                    lineNumber: 4356,
                                                                                                    columnNumber: 73
                                                                                                }, this)
                                                                                            ]
                                                                                        }, void 0, true, {
                                                                                            fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                            lineNumber: 4348,
                                                                                            columnNumber: 65
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                            className: "jsx-bd40b562327a6f52" + " " + "text-[10px] font-semibold text-slate-400",
                                                                                            children: formatDate(log.created_at)
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                            lineNumber: 4361,
                                                                                            columnNumber: 65
                                                                                        }, this)
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                    lineNumber: 4347,
                                                                                    columnNumber: 61
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                    className: "jsx-bd40b562327a6f52" + " " + "p-4 rounded-2xl  border border-slate-200 group hover:border-indigo-100 hover:bg-white    transition-all space-y-3",
                                                                                    children: [
                                                                                        log.notes && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                                            className: "jsx-bd40b562327a6f52" + " " + "text-sm font-medium text-slate-700 leading-relaxed italic",
                                                                                            children: [
                                                                                                '"',
                                                                                                log.notes,
                                                                                                '"'
                                                                                            ]
                                                                                        }, void 0, true, {
                                                                                            fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                            lineNumber: 4370,
                                                                                            columnNumber: 69
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                            className: "jsx-bd40b562327a6f52" + " " + "grid grid-cols-2 gap-2 pt-2 border-t border-slate-200",
                                                                                            children: log.next_called_at && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                                className: "jsx-bd40b562327a6f52" + " " + "flex items-center gap-1.5 col-span-2",
                                                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                                    className: "jsx-bd40b562327a6f52" + " " + "flex grid",
                                                                                                    children: [
                                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                                            className: "jsx-bd40b562327a6f52" + " " + "text-[10px] flex font-medium text-slate-400",
                                                                                                            children: [
                                                                                                                " ",
                                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                                                                    className: "jsx-bd40b562327a6f52" + " " + "fi flex  mr-2 fi-rr-calendar-clock text-[10px] text-amber-400"
                                                                                                                }, void 0, false, {
                                                                                                                    fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                                                    lineNumber: 4383,
                                                                                                                    columnNumber: 144
                                                                                                                }, this),
                                                                                                                " Follow Up: "
                                                                                                            ]
                                                                                                        }, void 0, true, {
                                                                                                            fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                                            lineNumber: 4383,
                                                                                                            columnNumber: 81
                                                                                                        }, this),
                                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                                            className: "jsx-bd40b562327a6f52" + " " + "text-[10px] font-semibold text-amber-600",
                                                                                                            children: new Date(log.next_called_at).toLocaleString('en-IN', {
                                                                                                                day: '2-digit',
                                                                                                                month: 'short',
                                                                                                                year: 'numeric',
                                                                                                                hour: '2-digit',
                                                                                                                minute: '2-digit'
                                                                                                            })
                                                                                                        }, void 0, false, {
                                                                                                            fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                                            lineNumber: 4384,
                                                                                                            columnNumber: 81
                                                                                                        }, this)
                                                                                                    ]
                                                                                                }, void 0, true, {
                                                                                                    fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                                    lineNumber: 4382,
                                                                                                    columnNumber: 77
                                                                                                }, this)
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                                lineNumber: 4380,
                                                                                                columnNumber: 73
                                                                                            }, this)
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                            lineNumber: 4376,
                                                                                            columnNumber: 65
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                            className: "jsx-bd40b562327a6f52" + " " + "flex items-center gap-3 pt-2",
                                                                                            children: [
                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                                    className: "jsx-bd40b562327a6f52" + " " + "flex items-center gap-1.5 px-2 py-1 rounded-lg bg-indigo-50 text-indigo-600 text-[12px] font-semibold uppercase",
                                                                                                    children: [
                                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                                                            className: "jsx-bd40b562327a6f52" + " " + "fi flex  fi-rr-clock-three"
                                                                                                        }, void 0, false, {
                                                                                                            fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                                            lineNumber: 4401,
                                                                                                            columnNumber: 73
                                                                                                        }, this),
                                                                                                        formatTime(log.duration || 0)
                                                                                                    ]
                                                                                                }, void 0, true, {
                                                                                                    fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                                    lineNumber: 4400,
                                                                                                    columnNumber: 69
                                                                                                }, this),
                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                                    className: "jsx-bd40b562327a6f52" + " " + "text-[12px] font-semibold text-slate-300",
                                                                                                    children: new Date(log.created_at).toLocaleTimeString([], {
                                                                                                        hour: '2-digit',
                                                                                                        minute: '2-digit'
                                                                                                    })
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                                    lineNumber: 4404,
                                                                                                    columnNumber: 69
                                                                                                }, this)
                                                                                            ]
                                                                                        }, void 0, true, {
                                                                                            fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                            lineNumber: 4399,
                                                                                            columnNumber: 65
                                                                                        }, this)
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                    lineNumber: 4367,
                                                                                    columnNumber: 61
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                    className: "jsx-bd40b562327a6f52" + " " + "flex items-center gap-1.5",
                                                                                    children: [
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                                            className: "jsx-bd40b562327a6f52" + " " + "fi flex  fi-rr-user mt-1 text-[12px] text-indigo-400"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                            lineNumber: 4411,
                                                                                            columnNumber: 73
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                            className: "jsx-bd40b562327a6f52" + " " + "truncate",
                                                                                            children: [
                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                                    className: "jsx-bd40b562327a6f52" + " " + "text-[12px] font-semibold text-slate-400",
                                                                                                    children: "Agent: "
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                                    lineNumber: 4413,
                                                                                                    columnNumber: 77
                                                                                                }, this),
                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                                    className: "jsx-bd40b562327a6f52" + " " + "text-[12px] font-bold text-slate-600",
                                                                                                    children: [
                                                                                                        log.agent?.user_name || 'N/A',
                                                                                                        log.agent?.employee_id && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                                            className: "jsx-bd40b562327a6f52" + " " + "text-slate-400",
                                                                                                            children: [
                                                                                                                " (",
                                                                                                                log.agent.employee_id,
                                                                                                                ")"
                                                                                                            ]
                                                                                                        }, void 0, true, {
                                                                                                            fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                                            lineNumber: 4417,
                                                                                                            columnNumber: 85
                                                                                                        }, this)
                                                                                                    ]
                                                                                                }, void 0, true, {
                                                                                                    fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                                    lineNumber: 4414,
                                                                                                    columnNumber: 77
                                                                                                }, this)
                                                                                            ]
                                                                                        }, void 0, true, {
                                                                                            fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                            lineNumber: 4412,
                                                                                            columnNumber: 73
                                                                                        }, this)
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                    lineNumber: 4410,
                                                                                    columnNumber: 69
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                    className: "jsx-bd40b562327a6f52" + " " + "flex items-center gap-1.5",
                                                                                    children: [
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                                            className: "jsx-bd40b562327a6f52" + " " + "fi flex  fi-rr-pencil mt-1 text-[12px] text-purple-400"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                            lineNumber: 4425,
                                                                                            columnNumber: 73
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                            className: "jsx-bd40b562327a6f52" + " " + "truncate",
                                                                                            children: [
                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                                    className: "jsx-bd40b562327a6f52" + " " + "text-[12px] font-semibold text-slate-400",
                                                                                                    children: "Updated: "
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                                    lineNumber: 4427,
                                                                                                    columnNumber: 77
                                                                                                }, this),
                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                                    className: "jsx-bd40b562327a6f52" + " " + "text-[12px] font-bold text-slate-600",
                                                                                                    children: [
                                                                                                        log.updater?.user_name || 'N/A',
                                                                                                        log.updater?.employee_id && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                                            className: "jsx-bd40b562327a6f52" + " " + "text-slate-400",
                                                                                                            children: [
                                                                                                                " (",
                                                                                                                log.updater.employee_id,
                                                                                                                ")"
                                                                                                            ]
                                                                                                        }, void 0, true, {
                                                                                                            fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                                            lineNumber: 4431,
                                                                                                            columnNumber: 85
                                                                                                        }, this)
                                                                                                    ]
                                                                                                }, void 0, true, {
                                                                                                    fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                                    lineNumber: 4428,
                                                                                                    columnNumber: 77
                                                                                                }, this)
                                                                                            ]
                                                                                        }, void 0, true, {
                                                                                            fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                            lineNumber: 4426,
                                                                                            columnNumber: 73
                                                                                        }, this)
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                    lineNumber: 4424,
                                                                                    columnNumber: 69
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                            lineNumber: 4345,
                                                                            columnNumber: 57
                                                                        }, this)
                                                                    ]
                                                                }, log.id, true, {
                                                                    fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                    lineNumber: 4336,
                                                                    columnNumber: 53
                                                                }, this))
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                            lineNumber: 4334,
                                                            columnNumber: 45
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                        lineNumber: 4325,
                                                        columnNumber: 41
                                                    }, this) : timelineView === 'call_logs' ? // MOBILE LOGS VIEW
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: "jsx-bd40b562327a6f52" + " " + "h-[650px] overflow-y-auto pr-2 custom-scrollbar space-y-4",
                                                        children: mobileLogs.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: "jsx-bd40b562327a6f52" + " " + "h-full flex flex-col items-center justify-center text-center opacity-30 grayscale py-20",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                    className: "jsx-bd40b562327a6f52" + " " + "w-20 h-20 rounded-2xl bg-slate-100 flex items-center justify-center mb-4",
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                        className: "jsx-bd40b562327a6f52" + " " + "fi flex  fi-rr-smartphone text-2xl"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                        lineNumber: 4452,
                                                                        columnNumber: 57
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                    lineNumber: 4451,
                                                                    columnNumber: 53
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                    className: "jsx-bd40b562327a6f52" + " " + "text-xs font-semibold ",
                                                                    children: "No Mobile Logs Found"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                    lineNumber: 4454,
                                                                    columnNumber: 53
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                            lineNumber: 4450,
                                                            columnNumber: 49
                                                        }, this) : mobileLogs.map((log)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                className: "jsx-bd40b562327a6f52" + " " + "relative p-4 rounded-xl bg-white border border-slate-200/80 hover:border-slate-200 hover:shadow-lg transition-all duration-300 group overflow-hidden",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                        className: "jsx-bd40b562327a6f52" + " " + `absolute top-0 right-0 w-16 h-16 rounded-bl-full opacity-5 transition-colors ${log.type === 'INCOMING' ? 'bg-emerald-500' : log.type === 'OUTGOING' ? 'bg-blue-500' : 'bg-red-500'}`
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                        lineNumber: 4460,
                                                                        columnNumber: 58
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                        className: "jsx-bd40b562327a6f52" + " " + "flex items-start gap-4 relative z-10",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                className: "jsx-bd40b562327a6f52" + " " + `w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-md transform transition-transform group-hover:scale-110 duration-300 mt-1 ${log.type === 'INCOMING' ? 'bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-emerald-200' : log.type === 'OUTGOING' ? 'bg-gradient-to-br from-blue-400 to-blue-600 shadow-blue-200' : 'bg-gradient-to-br from-red-400 to-red-600 shadow-red-200'}`,
                                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                                    className: "jsx-bd40b562327a6f52" + " " + `fi text-lg flex ${log.type === 'INCOMING' ? 'fi-rr-call-incoming' : log.type === 'OUTGOING' ? 'fi-rr-call-outgoing' : 'fi-rr-phone-cross'}`
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                    lineNumber: 4473,
                                                                                    columnNumber: 65
                                                                                }, this)
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                lineNumber: 4468,
                                                                                columnNumber: 61
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                className: "jsx-bd40b562327a6f52" + " " + "flex-1 min-w-0",
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                        className: "jsx-bd40b562327a6f52" + " " + "flex items-center justify-between mb-1",
                                                                                        children: [
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                                className: "jsx-bd40b562327a6f52" + " " + "flex items-center gap-2",
                                                                                                children: [
                                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                                        className: "jsx-bd40b562327a6f52" + " " + "text-sm font-bold text-slate-800 tracking-tight font-heading",
                                                                                                        children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$phoneUtils$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["formatMaskedPhone"])(log.number)
                                                                                                    }, void 0, false, {
                                                                                                        fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                                        lineNumber: 4484,
                                                                                                        columnNumber: 73
                                                                                                    }, this),
                                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                                        className: "jsx-bd40b562327a6f52" + " " + `text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border ${log.type === 'INCOMING' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : log.type === 'OUTGOING' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-red-50 text-red-600 border-red-100'}`,
                                                                                                        children: log.type
                                                                                                    }, void 0, false, {
                                                                                                        fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                                        lineNumber: 4485,
                                                                                                        columnNumber: 73
                                                                                                    }, this)
                                                                                                ]
                                                                                            }, void 0, true, {
                                                                                                fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                                lineNumber: 4483,
                                                                                                columnNumber: 69
                                                                                            }, this),
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                                className: "jsx-bd40b562327a6f52" + " " + "text-[10px] font-semibold text-slate-400 flex items-center gap-1",
                                                                                                children: [
                                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                                                        className: "jsx-bd40b562327a6f52" + " " + "fi flex fi-rr-calendar-clock text-[10px] opacity-60"
                                                                                                    }, void 0, false, {
                                                                                                        fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                                        lineNumber: 4492,
                                                                                                        columnNumber: 73
                                                                                                    }, this),
                                                                                                    new Date(log.timestamp).toLocaleDateString([], {
                                                                                                        day: '2-digit',
                                                                                                        month: 'short'
                                                                                                    })
                                                                                                ]
                                                                                            }, void 0, true, {
                                                                                                fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                                lineNumber: 4491,
                                                                                                columnNumber: 69
                                                                                            }, this)
                                                                                        ]
                                                                                    }, void 0, true, {
                                                                                        fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                        lineNumber: 4482,
                                                                                        columnNumber: 65
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                        className: "jsx-bd40b562327a6f52" + " " + "flex items-center gap-4 text-[11px] text-slate-500 font-medium mt-1.5",
                                                                                        children: [
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                                className: "jsx-bd40b562327a6f52" + " " + "flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-md border border-slate-200",
                                                                                                children: [
                                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                                                        className: "jsx-bd40b562327a6f52" + " " + "fi flex fi-rr-clock-three text-[10px] text-slate-400"
                                                                                                    }, void 0, false, {
                                                                                                        fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                                        lineNumber: 4500,
                                                                                                        columnNumber: 74
                                                                                                    }, this),
                                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                                        className: "jsx-bd40b562327a6f52" + " " + "text-slate-600 font-bold",
                                                                                                        children: formatTime(log.duration || 0)
                                                                                                    }, void 0, false, {
                                                                                                        fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                                        lineNumber: 4501,
                                                                                                        columnNumber: 74
                                                                                                    }, this)
                                                                                                ]
                                                                                            }, void 0, true, {
                                                                                                fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                                lineNumber: 4499,
                                                                                                columnNumber: 69
                                                                                            }, this),
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                                className: "jsx-bd40b562327a6f52" + " " + "h-4 w-px bg-slate-200"
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                                lineNumber: 4503,
                                                                                                columnNumber: 69
                                                                                            }, this),
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                                className: "jsx-bd40b562327a6f52" + " " + "text-slate-400",
                                                                                                children: new Date(log.timestamp).toLocaleTimeString([], {
                                                                                                    hour: '2-digit',
                                                                                                    minute: '2-digit'
                                                                                                })
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                                lineNumber: 4504,
                                                                                                columnNumber: 69
                                                                                            }, this)
                                                                                        ]
                                                                                    }, void 0, true, {
                                                                                        fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                        lineNumber: 4498,
                                                                                        columnNumber: 66
                                                                                    }, this)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                lineNumber: 4481,
                                                                                columnNumber: 61
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                        lineNumber: 4466,
                                                                        columnNumber: 58
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                        className: "jsx-bd40b562327a6f52" + " " + "relative z-10 flex items-center justify-between mt-4 pt-4 border-t border-dashed border-slate-200",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                className: "jsx-bd40b562327a6f52" + " " + "flex items-center gap-2",
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                        className: "jsx-bd40b562327a6f52" + " " + "w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0 border border-indigo-100",
                                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                                            className: "jsx-bd40b562327a6f52" + " " + "fi flex fi-rr-circle-user text-[14px]"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                            lineNumber: 4513,
                                                                                            columnNumber: 70
                                                                                        }, this)
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                        lineNumber: 4512,
                                                                                        columnNumber: 65
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                        className: "jsx-bd40b562327a6f52" + " " + "flex flex-col",
                                                                                        children: [
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                                className: "jsx-bd40b562327a6f52" + " " + "text-[11px] font-bold text-slate-700 leading-none mb-0.5",
                                                                                                children: log.agent_name || 'Unknown Agent'
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                                lineNumber: 4516,
                                                                                                columnNumber: 69
                                                                                            }, this),
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                                className: "jsx-bd40b562327a6f52" + " " + "text-[9px] font-semibold text-slate-400 uppercase tracking-tight flex items-center gap-1",
                                                                                                children: [
                                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                                        className: "jsx-bd40b562327a6f52" + " " + "w-1 h-1 rounded-full bg-indigo-400"
                                                                                                    }, void 0, false, {
                                                                                                        fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                                        lineNumber: 4520,
                                                                                                        columnNumber: 73
                                                                                                    }, this),
                                                                                                    log.employee_id || 'N/A'
                                                                                                ]
                                                                                            }, void 0, true, {
                                                                                                fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                                lineNumber: 4519,
                                                                                                columnNumber: 69
                                                                                            }, this)
                                                                                        ]
                                                                                    }, void 0, true, {
                                                                                        fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                        lineNumber: 4515,
                                                                                        columnNumber: 65
                                                                                    }, this)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                lineNumber: 4511,
                                                                                columnNumber: 61
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                title: `Device: ${log.device_id || 'Unknown'}`,
                                                                                className: "jsx-bd40b562327a6f52" + " " + "flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200",
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                                        className: "jsx-bd40b562327a6f52" + " " + "fi flex fi-rr-smartphone text-[12px] text-slate-400"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                        lineNumber: 4526,
                                                                                        columnNumber: 65
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                        className: "jsx-bd40b562327a6f52" + " " + "text-[10px] font-semibold text-slate-500 font-mono tracking-tight",
                                                                                        children: log.device_model || (log.device_id ? log.device_id.substring(0, 8) + '...' : 'Unknown')
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                        lineNumber: 4527,
                                                                                        columnNumber: 65
                                                                                    }, this)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                lineNumber: 4525,
                                                                                columnNumber: 61
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                        lineNumber: 4510,
                                                                        columnNumber: 58
                                                                    }, this)
                                                                ]
                                                            }, log.id, true, {
                                                                fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                lineNumber: 4458,
                                                                columnNumber: 53
                                                            }, this))
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                        lineNumber: 4448,
                                                        columnNumber: 46
                                                    }, this) : // SCHEDULES VIEW
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: "jsx-bd40b562327a6f52" + " " + "h-[650px] overflow-y-auto pr-2 custom-scrollbar",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: "jsx-bd40b562327a6f52" + " " + "mb-8",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                    className: "jsx-bd40b562327a6f52" + " " + "flex items-center justify-start mb-6",
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                        className: "jsx-bd40b562327a6f52" + " " + "flex items-center",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                className: "jsx-bd40b562327a6f52" + " " + "flex items-center bg-slate-50 p-1 rounded-xl border border-slate-100",
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                                        onClick: ()=>{
                                                                                            const current = selectedScheduleDate || new Date();
                                                                                            const prev = new Date(current);
                                                                                            prev.setDate(prev.getDate() - 1);
                                                                                            setSelectedScheduleDate(prev);
                                                                                        },
                                                                                        className: "jsx-bd40b562327a6f52" + " " + "w-9 h-9 rounded-lg bg-white flex items-center justify-center text-slate-400 hover:text-indigo-600 transition-all active:scale-95 border-none",
                                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                                            className: "jsx-bd40b562327a6f52" + " " + "fi flex fi-rr-angle-small-left text-lg"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                            lineNumber: 4553,
                                                                                            columnNumber: 65
                                                                                        }, this)
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                        lineNumber: 4544,
                                                                                        columnNumber: 61
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                        className: "jsx-bd40b562327a6f52" + " " + "relative px-4 flex flex-col items-center min-w-[130px]",
                                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                            className: "jsx-bd40b562327a6f52" + " " + "relative cursor-pointer group/date-input",
                                                                                            children: [
                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                                    className: "jsx-bd40b562327a6f52" + " " + "flex items-center gap-2 py-1",
                                                                                                    children: [
                                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                                                            className: "jsx-bd40b562327a6f52" + " " + `fi fi-rr-calendar text-[10px] ${selectedScheduleDate && new Date().toDateString() === selectedScheduleDate.toDateString() ? 'text-indigo-600' : 'text-slate-300'}`
                                                                                                        }, void 0, false, {
                                                                                                            fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                                            lineNumber: 4559,
                                                                                                            columnNumber: 73
                                                                                                        }, this),
                                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                                            className: "jsx-bd40b562327a6f52" + " " + `text-[11px] font-bold uppercase tracking-tight ${selectedScheduleDate && new Date().toDateString() === selectedScheduleDate.toDateString() ? 'text-indigo-600' : 'text-slate-600'}`,
                                                                                                            children: selectedScheduleDate ? selectedScheduleDate.toLocaleDateString('en-GB') : 'Select Date'
                                                                                                        }, void 0, false, {
                                                                                                            fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                                            lineNumber: 4560,
                                                                                                            columnNumber: 73
                                                                                                        }, this)
                                                                                                    ]
                                                                                                }, void 0, true, {
                                                                                                    fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                                    lineNumber: 4558,
                                                                                                    columnNumber: 69
                                                                                                }, this),
                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                                                                                    type: "date",
                                                                                                    value: selectedScheduleDate ? `${selectedScheduleDate.getFullYear()}-${String(selectedScheduleDate.getMonth() + 1).padStart(2, '0')}-${String(selectedScheduleDate.getDate()).padStart(2, '0')}` : '',
                                                                                                    onChange: (e)=>{
                                                                                                        if (e.target.value) {
                                                                                                            const [y, m, d] = e.target.value.split('-').map(Number);
                                                                                                            setSelectedScheduleDate(new Date(y, m - 1, d));
                                                                                                        } else {
                                                                                                            setSelectedScheduleDate(null);
                                                                                                        }
                                                                                                    },
                                                                                                    className: "jsx-bd40b562327a6f52" + " " + "absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                                    lineNumber: 4564,
                                                                                                    columnNumber: 69
                                                                                                }, this)
                                                                                            ]
                                                                                        }, void 0, true, {
                                                                                            fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                            lineNumber: 4557,
                                                                                            columnNumber: 65
                                                                                        }, this)
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                        lineNumber: 4556,
                                                                                        columnNumber: 61
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                                        onClick: ()=>{
                                                                                            const current = selectedScheduleDate || new Date();
                                                                                            const next = new Date(current);
                                                                                            next.setDate(next.getDate() + 1);
                                                                                            setSelectedScheduleDate(next);
                                                                                        },
                                                                                        className: "jsx-bd40b562327a6f52" + " " + "w-9 h-9 rounded-lg bg-white flex items-center justify-center text-slate-400 hover:text-indigo-600 transition-all active:scale-95 border-none",
                                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                                            className: "jsx-bd40b562327a6f52" + " " + "fi flex fi-rr-angle-small-right text-lg"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                            lineNumber: 4589,
                                                                                            columnNumber: 65
                                                                                        }, this)
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                        lineNumber: 4580,
                                                                                        columnNumber: 61
                                                                                    }, this)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                lineNumber: 4543,
                                                                                columnNumber: 57
                                                                            }, this),
                                                                            selectedScheduleDate && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                                onClick: ()=>setSelectedScheduleDate(new Date()),
                                                                                title: "Reset to Today",
                                                                                className: "jsx-bd40b562327a6f52" + " " + "ml-2 w-11 h-11 rounded-xl bg-indigo-50 text-indigo-500 flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all border-none",
                                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                                    className: "jsx-bd40b562327a6f52" + " " + "fi flex fi-rr-undo text-[14px]"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                    lineNumber: 4599,
                                                                                    columnNumber: 65
                                                                                }, this)
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                lineNumber: 4594,
                                                                                columnNumber: 61
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                        lineNumber: 4542,
                                                                        columnNumber: 53
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                    lineNumber: 4540,
                                                                    columnNumber: 49
                                                                }, this),
                                                                (()=>{
                                                                    const now = new Date();
                                                                    const filtered = (selectedScheduleDate ? scheduledCalls.filter((c)=>new Date(c.next_called_at).toDateString() === selectedScheduleDate.toDateString()) : scheduledCalls).sort((a, b)=>{
                                                                        const timeA = new Date(a.next_called_at).getTime();
                                                                        const timeB = new Date(b.next_called_at).getTime();
                                                                        const nowTime = now.getTime();
                                                                        const isAFuture = timeA >= nowTime;
                                                                        const isBFuture = timeB >= nowTime;
                                                                        // If one is future and other is past, future comes first
                                                                        if (isAFuture && !isBFuture) return -1;
                                                                        if (!isAFuture && isBFuture) return 1;
                                                                        // If both are future, closest to 'now' first (Ascending)
                                                                        if (isAFuture && isBFuture) return timeA - timeB;
                                                                        // If both are past, most recently missed first (Descending)
                                                                        return timeB - timeA;
                                                                    });
                                                                    if (filtered.length === 0) {
                                                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                            className: "jsx-bd40b562327a6f52" + " " + "h-full flex flex-col items-center justify-center text-center opacity-30 grayscale py-20",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                    className: "jsx-bd40b562327a6f52" + " " + "w-20 h-20 rounded-2xl bg-slate-100 flex items-center justify-center mb-4",
                                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                                        className: "jsx-bd40b562327a6f52" + " " + "fi flex  fi-rr-calendar-clock text-2xl"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                        lineNumber: 4632,
                                                                                        columnNumber: 69
                                                                                    }, this)
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                    lineNumber: 4631,
                                                                                    columnNumber: 65
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                                    className: "jsx-bd40b562327a6f52" + " " + "text-xs font-semibold ",
                                                                                    children: "No Schedules Found"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                    lineNumber: 4634,
                                                                                    columnNumber: 65
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                            lineNumber: 4630,
                                                                            columnNumber: 61
                                                                        }, this);
                                                                    }
                                                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                        className: "jsx-bd40b562327a6f52" + " " + "relative pl-16 space-y-1 py-4",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                className: "jsx-bd40b562327a6f52" + " " + "absolute left-16 top-0 bottom-0 w-px bg-slate-100"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                lineNumber: 4642,
                                                                                columnNumber: 61
                                                                            }, this),
                                                                            filtered.map((call)=>{
                                                                                const date = new Date(call.next_called_at);
                                                                                const timeStr = date.toLocaleTimeString([], {
                                                                                    hour: '2-digit',
                                                                                    minute: '2-digit',
                                                                                    hour12: true
                                                                                });
                                                                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                    onClick: ()=>router.push(`/campaign/${call.campaign_id}/${call.id}`),
                                                                                    className: "jsx-bd40b562327a6f52" + " " + "relative py-3 group cursor-pointer",
                                                                                    children: [
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                            className: "jsx-bd40b562327a6f52" + " " + "absolute -left-16 w-12 text-right",
                                                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                                                className: "jsx-bd40b562327a6f52" + " " + "text-[10px] font-bold text-slate-400 uppercase tracking-tighter mt-1.5",
                                                                                                children: timeStr
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                                lineNumber: 4652,
                                                                                                columnNumber: 77
                                                                                            }, this)
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                            lineNumber: 4651,
                                                                                            columnNumber: 73
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                            className: "jsx-bd40b562327a6f52" + " " + "absolute left-[-4px] top-4 w-2 h-2 rounded-full border-2 border-white bg-slate-200 group-hover:bg-indigo-500 z-10 transition-colors"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                            lineNumber: 4658,
                                                                                            columnNumber: 73
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                            className: "jsx-bd40b562327a6f52" + " " + "bg-white border border-slate-200 rounded-2xl px-4 py-3 flex flex-col gap-1 hover:border-indigo-200 hover:shadow-md transition-all duration-300 ml-4 group-hover:bg-indigo-50/10",
                                                                                            children: [
                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                                    className: "jsx-bd40b562327a6f52" + " " + "flex items-center justify-between",
                                                                                                    children: [
                                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                                                            className: "jsx-bd40b562327a6f52" + " " + "text-[13px] font-bold text-slate-800 tracking-tight",
                                                                                                            children: call.customer_name || 'Customer'
                                                                                                        }, void 0, false, {
                                                                                                            fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                                            lineNumber: 4663,
                                                                                                            columnNumber: 81
                                                                                                        }, this),
                                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                                            className: "jsx-bd40b562327a6f52" + " " + "w-6 h-6 rounded-md bg-indigo-50 flex items-center justify-center shadow-sm shrink-0",
                                                                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                                                className: "jsx-bd40b562327a6f52" + " " + "text-[10px] font-black text-indigo-400",
                                                                                                                children: "G"
                                                                                                            }, void 0, false, {
                                                                                                                fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                                                lineNumber: 4667,
                                                                                                                columnNumber: 85
                                                                                                            }, this)
                                                                                                        }, void 0, false, {
                                                                                                            fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                                            lineNumber: 4666,
                                                                                                            columnNumber: 81
                                                                                                        }, this)
                                                                                                    ]
                                                                                                }, void 0, true, {
                                                                                                    fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                                    lineNumber: 4662,
                                                                                                    columnNumber: 77
                                                                                                }, this),
                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                                    className: "jsx-bd40b562327a6f52" + " " + "flex items-center gap-2",
                                                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                                        className: "jsx-bd40b562327a6f52" + " " + "px-2 py-0.5 rounded-full bg-slate-50 text-[10px] font-bold text-slate-500 border border-slate-100",
                                                                                                        children: [
                                                                                                            call.disposition,
                                                                                                            call.sub_disposition ? ` - ${call.sub_disposition}` : ''
                                                                                                        ]
                                                                                                    }, void 0, true, {
                                                                                                        fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                                        lineNumber: 4672,
                                                                                                        columnNumber: 81
                                                                                                    }, this)
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                                    lineNumber: 4671,
                                                                                                    columnNumber: 77
                                                                                                }, this),
                                                                                                call.notes && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                                                    className: "jsx-bd40b562327a6f52" + " " + "text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed bg-slate-50/50 p-2 rounded-lg border border-slate-50 italic",
                                                                                                    children: [
                                                                                                        '"',
                                                                                                        call.notes,
                                                                                                        '"'
                                                                                                    ]
                                                                                                }, void 0, true, {
                                                                                                    fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                                    lineNumber: 4678,
                                                                                                    columnNumber: 81
                                                                                                }, this)
                                                                                            ]
                                                                                        }, void 0, true, {
                                                                                            fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                            lineNumber: 4661,
                                                                                            columnNumber: 73
                                                                                        }, this)
                                                                                    ]
                                                                                }, call.id, true, {
                                                                                    fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                                    lineNumber: 4649,
                                                                                    columnNumber: 69
                                                                                }, this);
                                                                            })
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                        lineNumber: 4640,
                                                                        columnNumber: 57
                                                                    }, this);
                                                                })()
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                            lineNumber: 4539,
                                                            columnNumber: 45
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                        lineNumber: 4538,
                                                        columnNumber: 41
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: "jsx-bd40b562327a6f52" + " " + "mt-8 p-4 rounded-2xl bg-slate-900 text-white flex items-center justify-between",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                className: "jsx-bd40b562327a6f52" + " " + "flex items-center gap-3",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                        className: "jsx-bd40b562327a6f52" + " " + "w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center",
                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                            className: "jsx-bd40b562327a6f52" + " " + "fi flex   fi-rr-phone-call text-xs"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                            lineNumber: 4696,
                                                                            columnNumber: 49
                                                                        }, this)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                        lineNumber: 4695,
                                                                        columnNumber: 45
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                        className: "jsx-bd40b562327a6f52" + " " + "text-[10px] font-semibold ",
                                                                        children: "Total Connects"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                        lineNumber: 4698,
                                                                        columnNumber: 45
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                lineNumber: 4694,
                                                                columnNumber: 41
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                className: "jsx-bd40b562327a6f52" + " " + "text-sm font-semibold",
                                                                children: history.filter((h)=>h.duration > 0).length
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                lineNumber: 4700,
                                                                columnNumber: 41
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                        lineNumber: 4693,
                                                        columnNumber: 37
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                lineNumber: 4291,
                                                columnNumber: 29
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                        lineNumber: 3610,
                                        columnNumber: 25
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                lineNumber: 2923,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                        lineNumber: 2899,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                lineNumber: 2885,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$BottomNav$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                activeNav: "campaign",
                userRole: user?.role || null
            }, void 0, false, {
                fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                lineNumber: 4707,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$styled$2d$jsx$2f$style$2e$js__$5b$external$5d$__$28$styled$2d$jsx$2f$style$2e$js$2c$__cjs$29$__["default"], {
                id: "bd40b562327a6f52",
                children: '@import "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@200;300;400;500;600;700;800&display=swap";body{font-family:Plus Jakarta Sans,sans-serif}.custom-scrollbar::-webkit-scrollbar{width:4px}.custom-scrollbar::-webkit-scrollbar-track{background:0 0}.custom-scrollbar::-webkit-scrollbar-thumb{background:#e2e8f0;border-radius:10px}.custom-scrollbar::-webkit-scrollbar-thumb:hover{background:#cbd5e1}.no-scrollbar::-webkit-scrollbar{display:none}.no-scrollbar{-ms-overflow-style:none;scrollbar-width:none}'
            }, void 0, false, void 0, this),
            showCalendarModal && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "jsx-bd40b562327a6f52" + " " + "fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: "jsx-bd40b562327a6f52" + " " + "bg-white rounded-[2rem] shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-300 border border-slate-100",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "jsx-bd40b562327a6f52" + " " + "h-32 bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center relative",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    style: {
                                        backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                                        backgroundSize: '20px 20px'
                                    },
                                    className: "jsx-bd40b562327a6f52" + " " + "absolute inset-0 opacity-10"
                                }, void 0, false, {
                                    fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                    lineNumber: 4744,
                                    columnNumber: 29
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "jsx-bd40b562327a6f52" + " " + "w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg transform -rotate-6",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                        className: "jsx-bd40b562327a6f52" + " " + "fi flex fi-brands-google text-3xl text-indigo-600"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                        lineNumber: 4746,
                                        columnNumber: 33
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                    lineNumber: 4745,
                                    columnNumber: 29
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "jsx-bd40b562327a6f52" + " " + "w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg absolute transform translate-x-8 translate-y-4 rotate-12",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                        className: "jsx-bd40b562327a6f52" + " " + "fi flex fi-rr-calendar-clock text-3xl text-blue-500"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                        lineNumber: 4749,
                                        columnNumber: 33
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                    lineNumber: 4748,
                                    columnNumber: 29
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                            lineNumber: 4743,
                            columnNumber: 25
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "jsx-bd40b562327a6f52" + " " + "p-8 pt-10 text-center",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                                    className: "jsx-bd40b562327a6f52" + " " + "text-2xl font-black text-slate-800 mb-2",
                                    children: "Connect Google Calendar?"
                                }, void 0, false, {
                                    fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                    lineNumber: 4754,
                                    columnNumber: 29
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                    className: "jsx-bd40b562327a6f52" + " " + "text-slate-500 text-sm leading-relaxed mb-8",
                                    children: "Get automatic reminders for your follow-ups directly on your phone and laptop by connecting your Google Calendar."
                                }, void 0, false, {
                                    fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                    lineNumber: 4755,
                                    columnNumber: 29
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "jsx-bd40b562327a6f52" + " " + "space-y-3",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                            onClick: handleConnectCalendar,
                                            className: "jsx-bd40b562327a6f52" + " " + "w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold flex items-center justify-center gap-3 transition-all shadow-lg shadow-indigo-100 active:scale-95",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                    className: "jsx-bd40b562327a6f52" + " " + "fi flex fi-brands-google"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                    lineNumber: 4764,
                                                    columnNumber: 37
                                                }, this),
                                                "Connect & Sync Now"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                            lineNumber: 4760,
                                            columnNumber: 33
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                            onClick: handleSkipCalendar,
                                            className: "jsx-bd40b562327a6f52" + " " + "w-full py-3 bg-slate-50 hover:bg-slate-100 text-slate-500 rounded-2xl font-bold transition-all active:scale-95 text-sm",
                                            children: "Skip for now"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                            lineNumber: 4768,
                                            columnNumber: 33
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                    lineNumber: 4759,
                                    columnNumber: 29
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                    className: "jsx-bd40b562327a6f52" + " " + "mt-6 text-[11px] text-slate-400 font-medium",
                                    children: "You can also connect this later from your Profile Settings."
                                }, void 0, false, {
                                    fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                    lineNumber: 4776,
                                    columnNumber: 29
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                            lineNumber: 4753,
                            columnNumber: 25
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                    lineNumber: 4741,
                    columnNumber: 21
                }, this)
            }, void 0, false, {
                fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                lineNumber: 4740,
                columnNumber: 17
            }, this),
            showAttachmentModal && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "jsx-bd40b562327a6f52" + " " + "fixed inset-0 z-[1001] flex items-center justify-center p-4 bg-slate-900/30 backdrop-blur-sm animate-in fade-in duration-300",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: "jsx-bd40b562327a6f52" + " " + "bg-white rounded-3xl shadow-2xl w-full max-w-md h-[520px] overflow-hidden flex flex-col animate-in zoom-in-95 duration-300 border border-slate-100",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "jsx-bd40b562327a6f52" + " " + "px-5 py-4 border-b border-slate-50 flex items-center justify-between bg-white",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "jsx-bd40b562327a6f52" + " " + "flex items-center gap-3",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "jsx-bd40b562327a6f52" + " " + "w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-100",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                className: "jsx-bd40b562327a6f52" + " " + "fi flex fi-rr-clip text-lg"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                lineNumber: 4792,
                                                columnNumber: 37
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                            lineNumber: 4791,
                                            columnNumber: 33
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "jsx-bd40b562327a6f52",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                                                    className: "jsx-bd40b562327a6f52" + " " + "text-base font-bold text-slate-800 tracking-tight",
                                                    children: "Lead Attachments"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                    lineNumber: 4795,
                                                    columnNumber: 37
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                    className: "jsx-bd40b562327a6f52" + " " + "text-[10px] font-bold text-indigo-500 uppercase tracking-widest",
                                                    children: [
                                                        attachments.length,
                                                        " Files"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                    lineNumber: 4796,
                                                    columnNumber: 37
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                            lineNumber: 4794,
                                            columnNumber: 33
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                    lineNumber: 4790,
                                    columnNumber: 29
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                    onClick: ()=>setShowAttachmentModal(false),
                                    className: "jsx-bd40b562327a6f52" + " " + "w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 transition-colors",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                        className: "jsx-bd40b562327a6f52" + " " + "fi flex fi-rr-cross-small text-lg"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                        lineNumber: 4803,
                                        columnNumber: 33
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                    lineNumber: 4799,
                                    columnNumber: 29
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                            lineNumber: 4789,
                            columnNumber: 25
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "jsx-bd40b562327a6f52" + " " + "px-5 py-4 flex flex-col gap-3 bg-slate-50/30",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "jsx-bd40b562327a6f52" + " " + "relative",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                            className: "jsx-bd40b562327a6f52" + " " + "fi flex fi-rr-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 text-xs"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                            lineNumber: 4810,
                                            columnNumber: 33
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                            type: "text",
                                            placeholder: "Search...",
                                            value: attachmentSearch,
                                            onChange: (e)=>setAttachmentSearch(e.target.value),
                                            className: "jsx-bd40b562327a6f52" + " " + "w-full h-10 pl-10 pr-4 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-indigo-50 focus:border-indigo-200 transition-all outline-none"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                            lineNumber: 4811,
                                            columnNumber: 33
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                    lineNumber: 4809,
                                    columnNumber: 29
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                    onClick: ()=>fileInputRef.current?.click(),
                                    className: "jsx-bd40b562327a6f52" + " " + "w-full h-10 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md shadow-indigo-100 active:scale-95",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                            className: "jsx-bd40b562327a6f52" + " " + "fi flex fi-rr-plus-small text-lg"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                            lineNumber: 4823,
                                            columnNumber: 33
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                            className: "jsx-bd40b562327a6f52",
                                            children: "Upload Attachment"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                            lineNumber: 4824,
                                            columnNumber: 33
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                    lineNumber: 4819,
                                    columnNumber: 29
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                            lineNumber: 4808,
                            columnNumber: 25
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "jsx-bd40b562327a6f52" + " " + "flex-1 overflow-y-auto px-5 pb-5 custom-scrollbar",
                            children: pendingFile ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "jsx-bd40b562327a6f52" + " " + "py-6 animate-in slide-in-from-bottom-4 duration-300",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "jsx-bd40b562327a6f52" + " " + "p-4 rounded-2xl bg-indigo-50/30 border border-indigo-100 mb-4 text-center",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "jsx-bd40b562327a6f52" + " " + "w-12 h-12 rounded-xl bg-white border border-indigo-100 flex items-center justify-center text-indigo-600 mx-auto mb-2 shadow-sm",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                    className: "jsx-bd40b562327a6f52" + " " + `fi ${pendingFile.type.includes('image') ? 'fi-rr-picture' : pendingFile.type.includes('pdf') ? 'fi-rr-document' : 'fi-rr-file'} text-xl`
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                    lineNumber: 4834,
                                                    columnNumber: 45
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                lineNumber: 4833,
                                                columnNumber: 41
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                className: "jsx-bd40b562327a6f52" + " " + "text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none",
                                                children: "Selected File"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                lineNumber: 4839,
                                                columnNumber: 41
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                className: "jsx-bd40b562327a6f52" + " " + "text-[11px] font-bold text-slate-600 truncate px-4",
                                                children: pendingFile.name
                                            }, void 0, false, {
                                                fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                lineNumber: 4840,
                                                columnNumber: 41
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                        lineNumber: 4832,
                                        columnNumber: 37
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "jsx-bd40b562327a6f52" + " " + "space-y-4",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "jsx-bd40b562327a6f52",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                                        className: "jsx-bd40b562327a6f52" + " " + "text-[10px]  font-black text-slate-400 uppercase tracking-widest mb-1.5 block ml-1",
                                                        children: "Document Name"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                        lineNumber: 4845,
                                                        columnNumber: 45
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                                        type: "text",
                                                        autoFocus: true,
                                                        placeholder: "Enter a friendly name...",
                                                        value: customFileName,
                                                        onChange: (e)=>setCustomFileName(e.target.value),
                                                        onKeyDown: (e)=>e.key === 'Enter' && confirmUpload(),
                                                        className: "jsx-bd40b562327a6f52" + " " + "w-full h-11 text-gray-400 px-4 bg-white border border-slate-200 rounded-xl text-xs font-bold focus:ring-4 focus:ring-indigo-50 focus:border-indigo-300 transition-all outline-none"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                        lineNumber: 4846,
                                                        columnNumber: 45
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                lineNumber: 4844,
                                                columnNumber: 41
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "jsx-bd40b562327a6f52" + " " + "flex gap-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                        onClick: ()=>{
                                                            setPendingFile(null);
                                                            if (fileInputRef.current) fileInputRef.current.value = '';
                                                        },
                                                        className: "jsx-bd40b562327a6f52" + " " + "flex-1 h-11 rounded-xl bg-slate-50 text-slate-500 text-xs font-bold hover:bg-slate-100 transition-all",
                                                        children: "Cancel"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                        lineNumber: 4858,
                                                        columnNumber: 45
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                        onClick: confirmUpload,
                                                        className: "jsx-bd40b562327a6f52" + " " + "flex-[2] h-11 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 active:scale-95",
                                                        children: "Finalize Upload"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                        lineNumber: 4867,
                                                        columnNumber: 45
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                lineNumber: 4857,
                                                columnNumber: 41
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                        lineNumber: 4843,
                                        columnNumber: 37
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                lineNumber: 4831,
                                columnNumber: 33
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "jsx-bd40b562327a6f52" + " " + "space-y-1.5 pt-2",
                                children: [
                                    attachments.filter((a)=>a.file_name.toLowerCase().includes(attachmentSearch.toLowerCase())).map((file)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "jsx-bd40b562327a6f52" + " " + "p-3 rounded-2xl bg-white border border-slate-100 hover:border-indigo-50 hover:bg-indigo-50/10 transition-all group flex items-center justify-between",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "jsx-bd40b562327a6f52" + " " + "flex items-center gap-3 flex-1 min-w-0",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: "jsx-bd40b562327a6f52" + " " + "w-9 h-9 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-white group-hover:text-indigo-600 shadow-sm transition-colors border border-transparent group-hover:border-indigo-50",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                className: "jsx-bd40b562327a6f52" + " " + `fi ${file.file_type?.includes('image') ? 'fi-rr-picture' : file.file_type?.includes('pdf') ? 'fi-rr-document' : 'fi-rr-file'} text-sm`
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                lineNumber: 4887,
                                                                columnNumber: 54
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                            lineNumber: 4886,
                                                            columnNumber: 50
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: "jsx-bd40b562327a6f52" + " " + "truncate",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h4", {
                                                                    className: "jsx-bd40b562327a6f52" + " " + "text-[11px] font-bold text-slate-700 truncate leading-tight",
                                                                    children: file.file_name
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                    lineNumber: 4893,
                                                                    columnNumber: 54
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                    className: "jsx-bd40b562327a6f52" + " " + "flex items-center gap-2 mt-0.5",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                            className: "jsx-bd40b562327a6f52" + " " + "text-[9px] font-bold text-slate-400 uppercase tracking-tight",
                                                                            children: formatFileSize(file.file_size)
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                            lineNumber: 4895,
                                                                            columnNumber: 58
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                            className: "jsx-bd40b562327a6f52" + " " + "w-1 h-1 rounded-full bg-slate-200"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                            lineNumber: 4896,
                                                                            columnNumber: 58
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                            className: "jsx-bd40b562327a6f52" + " " + "text-[9px] font-bold text-slate-300 uppercase tracking-tight",
                                                                            children: formatDate(file.created_at)
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                            lineNumber: 4897,
                                                                            columnNumber: 58
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                    lineNumber: 4894,
                                                                    columnNumber: 54
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                            lineNumber: 4892,
                                                            columnNumber: 50
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                    lineNumber: 4885,
                                                    columnNumber: 46
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "jsx-bd40b562327a6f52" + " " + "flex items-center gap-1.5 ml-3",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                            title: "View",
                                                            onClick: async ()=>{
                                                                const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].storage.from('customer_attachments').createSignedUrl(file.file_path, 3600);
                                                                if (error) {
                                                                    alert("Failed to create viewing link.");
                                                                } else if (data?.signedUrl) {
                                                                    window.open(data.signedUrl, '_blank');
                                                                }
                                                            },
                                                            className: "jsx-bd40b562327a6f52" + " " + "w-8 h-8 rounded-lg bg-white border border-slate-100 hover:border-indigo-600 hover:text-white hover:bg-indigo-600 text-slate-400 shadow-sm transition-all flex items-center justify-center",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                className: "jsx-bd40b562327a6f52" + " " + "fi flex fi-rr-eye text-xs"
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                lineNumber: 4917,
                                                                columnNumber: 54
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                            lineNumber: 4903,
                                                            columnNumber: 50
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                            title: "Delete",
                                                            onClick: ()=>deleteAttachment(file.id, file.file_path),
                                                            className: "jsx-bd40b562327a6f52" + " " + "w-8 h-8 rounded-lg bg-white border border-slate-100 hover:border-rose-500 hover:text-white hover:bg-rose-500 text-slate-400 shadow-sm transition-all flex items-center justify-center",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                className: "jsx-bd40b562327a6f52" + " " + "fi flex fi-rr-trash text-xs"
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                lineNumber: 4924,
                                                                columnNumber: 54
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                            lineNumber: 4919,
                                                            columnNumber: 50
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                    lineNumber: 4902,
                                                    columnNumber: 46
                                                }, this)
                                            ]
                                        }, file.id, true, {
                                            fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                            lineNumber: 4881,
                                            columnNumber: 42
                                        }, this)),
                                    attachments.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "jsx-bd40b562327a6f52" + " " + "py-12 text-center",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "jsx-bd40b562327a6f52" + " " + "w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-3 border border-slate-100",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                    className: "jsx-bd40b562327a6f52" + " " + "fi flex fi-rr-folder-open text-2xl text-slate-200"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                    lineNumber: 4933,
                                                    columnNumber: 49
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                lineNumber: 4932,
                                                columnNumber: 45
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h4", {
                                                className: "jsx-bd40b562327a6f52" + " " + "text-slate-600 text-sm font-bold mb-1",
                                                children: "Empty Vault"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                lineNumber: 4935,
                                                columnNumber: 45
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                className: "jsx-bd40b562327a6f52" + " " + "text-slate-400 text-[10px] font-medium uppercase tracking-widest",
                                                children: "No attachments found"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                lineNumber: 4936,
                                                columnNumber: 45
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                        lineNumber: 4931,
                                        columnNumber: 41
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                lineNumber: 4877,
                                columnNumber: 33
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                            lineNumber: 4829,
                            columnNumber: 25
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                    lineNumber: 4787,
                    columnNumber: 21
                }, this)
            }, void 0, false, {
                fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                lineNumber: 4786,
                columnNumber: 17
            }, this),
            showEnlargedNotes && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "jsx-bd40b562327a6f52" + " " + "fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: "jsx-bd40b562327a6f52" + " " + "bg-white rounded-2xl shadow-2xl w-full max-w-3xl h-[70vh] overflow-hidden animate-in zoom-in-95 duration-300 border border-slate-200 flex flex-col relative",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "jsx-bd40b562327a6f52" + " " + "relative z-10 flex flex-col h-full",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "jsx-bd40b562327a6f52" + " " + "flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50/50",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "jsx-bd40b562327a6f52" + " " + "flex items-center gap-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "jsx-bd40b562327a6f52" + " " + "w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-sm",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                    className: "jsx-bd40b562327a6f52" + " " + "fi flex fi-rr-edit text-white text-sm"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                    lineNumber: 4955,
                                                    columnNumber: 41
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                lineNumber: 4954,
                                                columnNumber: 37
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "jsx-bd40b562327a6f52",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                                                        className: "jsx-bd40b562327a6f52" + " " + "text-sm font-bold text-slate-800 tracking-tight",
                                                        children: "Focus Notes"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                        lineNumber: 4958,
                                                        columnNumber: 41
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                        className: "jsx-bd40b562327a6f52" + " " + "text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mt-0.5",
                                                        children: [
                                                            "Editing Mode • ",
                                                            notes.split('\n').length,
                                                            " Lines"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                        lineNumber: 4959,
                                                        columnNumber: 41
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                lineNumber: 4957,
                                                columnNumber: 37
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                        lineNumber: 4953,
                                        columnNumber: 33
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                        onClick: ()=>setShowEnlargedNotes(false),
                                        className: "jsx-bd40b562327a6f52" + " " + "w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-400 hover:text-rose-500 hover:bg-rose-50 hover:border-rose-100 transition-all flex items-center justify-center group",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                            className: "jsx-bd40b562327a6f52" + " " + "fi flex fi-rr-cross-small text-lg group-hover:rotate-90 transition-transform"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                            lineNumber: 4966,
                                            columnNumber: 37
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                        lineNumber: 4962,
                                        columnNumber: 33
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                lineNumber: 4952,
                                columnNumber: 29
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "jsx-bd40b562327a6f52" + " " + "flex-1 p-3 overflow-hidden",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "jsx-bd40b562327a6f52" + " " + "h-full relative flex bg-slate-50/20 rounded-xl border border-slate-200 overflow-hidden focus-within:border-indigo-300 focus-within:ring-4 focus-within:ring-indigo-50/30 transition-all",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "jsx-bd40b562327a6f52" + " " + "w-8 py-3 bg-slate-100/30 border-r border-slate-100 flex flex-col items-center text-[8px] font-bold text-slate-300 select-none overflow-hidden",
                                            children: liveNotes.split('\n').map((_, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "jsx-bd40b562327a6f52" + " " + "leading-6 h-6",
                                                    children: i + 1
                                                }, i, false, {
                                                    fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                    lineNumber: 4978,
                                                    columnNumber: 45
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                            lineNumber: 4974,
                                            columnNumber: 37
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("textarea", {
                                            autoFocus: true,
                                            value: liveNotes,
                                            onChange: (e)=>setLiveNotes(e.target.value),
                                            onBlur: ()=>handleSaveLiveNotes(),
                                            placeholder: "Start typing...",
                                            style: {
                                                fontFamily: "'Plus Jakarta Sans', sans-serif"
                                            },
                                            className: "jsx-bd40b562327a6f52" + " " + "flex-1 h-full bg-transparent text-slate-700 p-3 pt-[13px] text-[13px] font-medium outline-none transition-all resize-none leading-6 placeholder:text-slate-300 custom-scrollbar"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                            lineNumber: 4981,
                                            columnNumber: 37
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                    lineNumber: 4972,
                                    columnNumber: 33
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                lineNumber: 4971,
                                columnNumber: 29
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "jsx-bd40b562327a6f52" + " " + "px-4 py-2 flex items-center justify-between bg-slate-50/50 border-t border-slate-100",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "jsx-bd40b562327a6f52" + " " + "flex items-center gap-1.5",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                className: "jsx-bd40b562327a6f52" + " " + `w-1.5 h-1.5 rounded-full ${notes.length > 0 ? 'bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.3)]' : 'bg-slate-300'}`
                                            }, void 0, false, {
                                                fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                lineNumber: 4996,
                                                columnNumber: 37
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                className: "jsx-bd40b562327a6f52" + " " + "text-[9px] font-bold text-slate-400 uppercase tracking-widest",
                                                children: [
                                                    notes.length,
                                                    " Characters"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                lineNumber: 4997,
                                                columnNumber: 37
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                        lineNumber: 4995,
                                        columnNumber: 33
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                        onClick: ()=>{
                                            handleSaveLiveNotes();
                                            setShowEnlargedNotes(false);
                                        },
                                        className: "jsx-bd40b562327a6f52" + " " + "px-4 py-1.5 bg-slate-900 text-white rounded-lg text-[10px] font-bold hover:bg-indigo-600 transition-all shadow-sm",
                                        children: "Save & Done"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                        lineNumber: 5001,
                                        columnNumber: 33
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                lineNumber: 4994,
                                columnNumber: 29
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                        lineNumber: 4950,
                        columnNumber: 25
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                    lineNumber: 4949,
                    columnNumber: 21
                }, this)
            }, void 0, false, {
                fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                lineNumber: 4948,
                columnNumber: 17
            }, this),
            isEditingDetails && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "jsx-bd40b562327a6f52" + " " + "fixed inset-0 z-[1001] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    ref: detailsEditRef,
                    className: "jsx-bd40b562327a6f52" + " " + "bg-white rounded-3xl shadow-2xl w-full max-w-md max-h-[85vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200 ring-1 ring-slate-200",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "jsx-bd40b562327a6f52" + " " + "px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "jsx-bd40b562327a6f52" + " " + "flex items-center gap-3",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "jsx-bd40b562327a6f52" + " " + "w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center text-white shrink-0",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                className: "jsx-bd40b562327a6f52" + " " + "fi flex fi-rr-edit-alt text-sm"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                lineNumber: 5026,
                                                columnNumber: 37
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                            lineNumber: 5025,
                                            columnNumber: 33
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "jsx-bd40b562327a6f52",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                                                    className: "jsx-bd40b562327a6f52" + " " + "text-base font-bold text-slate-800 tracking-tight",
                                                    children: "Modify Details"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                    lineNumber: 5029,
                                                    columnNumber: 37
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                    className: "jsx-bd40b562327a6f52" + " " + "text-[9px] font-bold text-slate-400 uppercase tracking-widest",
                                                    children: "Customer Reference Data"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                    lineNumber: 5030,
                                                    columnNumber: 37
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                            lineNumber: 5028,
                                            columnNumber: 33
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                    lineNumber: 5024,
                                    columnNumber: 29
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                    onClick: ()=>setIsEditingDetails(false),
                                    className: "jsx-bd40b562327a6f52" + " " + "w-8 h-8 rounded-full hover:bg-slate-50 flex items-center justify-center text-slate-400 transition-colors",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                        className: "jsx-bd40b562327a6f52" + " " + "fi flex fi-rr-cross-small text-lg"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                        lineNumber: 5037,
                                        columnNumber: 33
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                    lineNumber: 5033,
                                    columnNumber: 29
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                            lineNumber: 5023,
                            columnNumber: 25
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "jsx-bd40b562327a6f52" + " " + "flex-1 overflow-y-auto px-6 py-5 custom-scrollbar bg-white",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "jsx-bd40b562327a6f52" + " " + "space-y-3",
                                children: [
                                    tempDetails.map((item, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "jsx-bd40b562327a6f52" + " " + "group relative p-2 px-3 rounded-2xl bg-white border border-slate-200/60 hover:border-slate-300 transition-all",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "jsx-bd40b562327a6f52" + " " + "flex items-center gap-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: "jsx-bd40b562327a6f52" + " " + "flex-1 space-y-0.5",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                                                type: "text",
                                                                value: item.key,
                                                                onChange: (e)=>{
                                                                    const newArr = [
                                                                        ...tempDetails
                                                                    ];
                                                                    newArr[index].key = e.target.value;
                                                                    setTempDetails(newArr);
                                                                },
                                                                placeholder: "LABEL",
                                                                className: "jsx-bd40b562327a6f52" + " " + "w-full text-[9px] font-black text-slate-400 uppercase tracking-widest bg-transparent border-none outline-none placeholder:text-slate-200"
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                lineNumber: 5049,
                                                                columnNumber: 49
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("textarea", {
                                                                value: item.value,
                                                                onChange: (e)=>{
                                                                    const newArr = [
                                                                        ...tempDetails
                                                                    ];
                                                                    newArr[index].value = e.target.value;
                                                                    setTempDetails(newArr);
                                                                },
                                                                rows: 1,
                                                                placeholder: "Add information...",
                                                                className: "jsx-bd40b562327a6f52" + " " + "w-full min-h-[20px] bg-transparent border-none p-0 text-[12px] font-semibold text-slate-700 outline-none resize-none placeholder:text-slate-300 custom-scrollbar"
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                                lineNumber: 5060,
                                                                columnNumber: 49
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                        lineNumber: 5048,
                                                        columnNumber: 45
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                        onClick: ()=>{
                                                            const newArr = tempDetails.filter((_, i)=>i !== index);
                                                            setTempDetails(newArr);
                                                        },
                                                        className: "jsx-bd40b562327a6f52" + " " + "w-7 h-7 rounded-lg flex items-center justify-center text-slate-200 hover:text-rose-500 transition-colors shrink-0",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                            className: "jsx-bd40b562327a6f52" + " " + "fi flex fi-rr-trash text-[10px]"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                            lineNumber: 5080,
                                                            columnNumber: 49
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                        lineNumber: 5073,
                                                        columnNumber: 45
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                lineNumber: 5046,
                                                columnNumber: 41
                                            }, this)
                                        }, item.id, false, {
                                            fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                            lineNumber: 5045,
                                            columnNumber: 37
                                        }, this)),
                                    tempDetails.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "jsx-bd40b562327a6f52" + " " + "py-8 text-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-200",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                            className: "jsx-bd40b562327a6f52" + " " + "text-[10px] font-bold text-slate-400 uppercase tracking-widest",
                                            children: "No details recorded"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                            lineNumber: 5088,
                                            columnNumber: 41
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                        lineNumber: 5087,
                                        columnNumber: 37
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                        onClick: ()=>{
                                            setTempDetails([
                                                ...tempDetails,
                                                {
                                                    id: Math.random().toString(36).substring(2, 9),
                                                    key: "",
                                                    value: ""
                                                }
                                            ]);
                                        },
                                        className: "jsx-bd40b562327a6f52" + " " + "w-full py-3 rounded-2xl border border-dashed border-slate-200 text-slate-400 hover:border-slate-400 hover:text-slate-600 transition-all flex items-center justify-center gap-2 group/add",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                className: "jsx-bd40b562327a6f52" + " " + "fi flex fi-rr-plus-small text-lg"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                lineNumber: 5098,
                                                columnNumber: 37
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                className: "jsx-bd40b562327a6f52" + " " + "text-[10px] font-bold uppercase tracking-widest",
                                                children: "New Field"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                                lineNumber: 5099,
                                                columnNumber: 37
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                        lineNumber: 5092,
                                        columnNumber: 33
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                lineNumber: 5043,
                                columnNumber: 29
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                            lineNumber: 5042,
                            columnNumber: 25
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "jsx-bd40b562327a6f52" + " " + "px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3 font-semibold",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                    onClick: ()=>setIsEditingDetails(false),
                                    className: "jsx-bd40b562327a6f52" + " " + "px-4 py-2 text-slate-500 text-xs hover:text-slate-800 transition-colors",
                                    children: "Cancel"
                                }, void 0, false, {
                                    fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                    lineNumber: 5106,
                                    columnNumber: 29
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                    onClick: handleSaveDetails,
                                    disabled: saving,
                                    className: "jsx-bd40b562327a6f52" + " " + "px-6 py-2.5 rounded-xl bg-slate-900 text-white text-xs hover:bg-black transition-all shadow-lg active:scale-95 disabled:opacity-50 flex items-center gap-2",
                                    children: [
                                        saving ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "jsx-bd40b562327a6f52" + " " + "w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                            lineNumber: 5118,
                                            columnNumber: 37
                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                            className: "jsx-bd40b562327a6f52" + " " + "fi flex fi-rr-disk-check"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                            lineNumber: 5120,
                                            columnNumber: 37
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                            className: "jsx-bd40b562327a6f52",
                                            children: "Save Changes"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                            lineNumber: 5122,
                                            columnNumber: 33
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                                    lineNumber: 5112,
                                    columnNumber: 29
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                            lineNumber: 5105,
                            columnNumber: 25
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                    lineNumber: 5018,
                    columnNumber: 21
                }, this)
            }, void 0, false, {
                fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
                lineNumber: 5017,
                columnNumber: 17
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/pages/portal/campaign/[id]/[customerId].tsx",
        lineNumber: 2868,
        columnNumber: 9
    }, this);
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__4c685c81._.js.map