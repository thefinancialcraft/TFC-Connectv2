(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[turbopack]/browser/dev/hmr-client/hmr-client.ts [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/// <reference path="../../../shared/runtime-types.d.ts" />
/// <reference path="../../runtime/base/dev-globals.d.ts" />
/// <reference path="../../runtime/base/dev-protocol.d.ts" />
/// <reference path="../../runtime/base/dev-extensions.ts" />
__turbopack_context__.s([
    "connect",
    ()=>connect,
    "setHooks",
    ()=>setHooks,
    "subscribeToUpdate",
    ()=>subscribeToUpdate
]);
function connect({ addMessageListener, sendMessage, onUpdateError = console.error }) {
    addMessageListener((msg)=>{
        switch(msg.type){
            case 'turbopack-connected':
                handleSocketConnected(sendMessage);
                break;
            default:
                try {
                    if (Array.isArray(msg.data)) {
                        for(let i = 0; i < msg.data.length; i++){
                            handleSocketMessage(msg.data[i]);
                        }
                    } else {
                        handleSocketMessage(msg.data);
                    }
                    applyAggregatedUpdates();
                } catch (e) {
                    console.warn('[Fast Refresh] performing full reload\n\n' + "Fast Refresh will perform a full reload when you edit a file that's imported by modules outside of the React rendering tree.\n" + 'You might have a file which exports a React component but also exports a value that is imported by a non-React component file.\n' + 'Consider migrating the non-React component export to a separate file and importing it into both files.\n\n' + 'It is also possible the parent component of the component you edited is a class component, which disables Fast Refresh.\n' + 'Fast Refresh requires at least one parent function component in your React tree.');
                    onUpdateError(e);
                    location.reload();
                }
                break;
        }
    });
    const queued = globalThis.TURBOPACK_CHUNK_UPDATE_LISTENERS;
    if (queued != null && !Array.isArray(queued)) {
        throw new Error('A separate HMR handler was already registered');
    }
    globalThis.TURBOPACK_CHUNK_UPDATE_LISTENERS = {
        push: ([chunkPath, callback])=>{
            subscribeToChunkUpdate(chunkPath, sendMessage, callback);
        }
    };
    if (Array.isArray(queued)) {
        for (const [chunkPath, callback] of queued){
            subscribeToChunkUpdate(chunkPath, sendMessage, callback);
        }
    }
}
const updateCallbackSets = new Map();
function sendJSON(sendMessage, message) {
    sendMessage(JSON.stringify(message));
}
function resourceKey(resource) {
    return JSON.stringify({
        path: resource.path,
        headers: resource.headers || null
    });
}
function subscribeToUpdates(sendMessage, resource) {
    sendJSON(sendMessage, {
        type: 'turbopack-subscribe',
        ...resource
    });
    return ()=>{
        sendJSON(sendMessage, {
            type: 'turbopack-unsubscribe',
            ...resource
        });
    };
}
function handleSocketConnected(sendMessage) {
    for (const key of updateCallbackSets.keys()){
        subscribeToUpdates(sendMessage, JSON.parse(key));
    }
}
// we aggregate all pending updates until the issues are resolved
const chunkListsWithPendingUpdates = new Map();
function aggregateUpdates(msg) {
    const key = resourceKey(msg.resource);
    let aggregated = chunkListsWithPendingUpdates.get(key);
    if (aggregated) {
        aggregated.instruction = mergeChunkListUpdates(aggregated.instruction, msg.instruction);
    } else {
        chunkListsWithPendingUpdates.set(key, msg);
    }
}
function applyAggregatedUpdates() {
    if (chunkListsWithPendingUpdates.size === 0) return;
    hooks.beforeRefresh();
    for (const msg of chunkListsWithPendingUpdates.values()){
        triggerUpdate(msg);
    }
    chunkListsWithPendingUpdates.clear();
    finalizeUpdate();
}
function mergeChunkListUpdates(updateA, updateB) {
    let chunks;
    if (updateA.chunks != null) {
        if (updateB.chunks == null) {
            chunks = updateA.chunks;
        } else {
            chunks = mergeChunkListChunks(updateA.chunks, updateB.chunks);
        }
    } else if (updateB.chunks != null) {
        chunks = updateB.chunks;
    }
    let merged;
    if (updateA.merged != null) {
        if (updateB.merged == null) {
            merged = updateA.merged;
        } else {
            // Since `merged` is an array of updates, we need to merge them all into
            // one, consistent update.
            // Since there can only be `EcmascriptMergeUpdates` in the array, there is
            // no need to key on the `type` field.
            let update = updateA.merged[0];
            for(let i = 1; i < updateA.merged.length; i++){
                update = mergeChunkListEcmascriptMergedUpdates(update, updateA.merged[i]);
            }
            for(let i = 0; i < updateB.merged.length; i++){
                update = mergeChunkListEcmascriptMergedUpdates(update, updateB.merged[i]);
            }
            merged = [
                update
            ];
        }
    } else if (updateB.merged != null) {
        merged = updateB.merged;
    }
    return {
        type: 'ChunkListUpdate',
        chunks,
        merged
    };
}
function mergeChunkListChunks(chunksA, chunksB) {
    const chunks = {};
    for (const [chunkPath, chunkUpdateA] of Object.entries(chunksA)){
        const chunkUpdateB = chunksB[chunkPath];
        if (chunkUpdateB != null) {
            const mergedUpdate = mergeChunkUpdates(chunkUpdateA, chunkUpdateB);
            if (mergedUpdate != null) {
                chunks[chunkPath] = mergedUpdate;
            }
        } else {
            chunks[chunkPath] = chunkUpdateA;
        }
    }
    for (const [chunkPath, chunkUpdateB] of Object.entries(chunksB)){
        if (chunks[chunkPath] == null) {
            chunks[chunkPath] = chunkUpdateB;
        }
    }
    return chunks;
}
function mergeChunkUpdates(updateA, updateB) {
    if (updateA.type === 'added' && updateB.type === 'deleted' || updateA.type === 'deleted' && updateB.type === 'added') {
        return undefined;
    }
    if (updateA.type === 'partial') {
        invariant(updateA.instruction, 'Partial updates are unsupported');
    }
    if (updateB.type === 'partial') {
        invariant(updateB.instruction, 'Partial updates are unsupported');
    }
    return undefined;
}
function mergeChunkListEcmascriptMergedUpdates(mergedA, mergedB) {
    const entries = mergeEcmascriptChunkEntries(mergedA.entries, mergedB.entries);
    const chunks = mergeEcmascriptChunksUpdates(mergedA.chunks, mergedB.chunks);
    return {
        type: 'EcmascriptMergedUpdate',
        entries,
        chunks
    };
}
function mergeEcmascriptChunkEntries(entriesA, entriesB) {
    return {
        ...entriesA,
        ...entriesB
    };
}
function mergeEcmascriptChunksUpdates(chunksA, chunksB) {
    if (chunksA == null) {
        return chunksB;
    }
    if (chunksB == null) {
        return chunksA;
    }
    const chunks = {};
    for (const [chunkPath, chunkUpdateA] of Object.entries(chunksA)){
        const chunkUpdateB = chunksB[chunkPath];
        if (chunkUpdateB != null) {
            const mergedUpdate = mergeEcmascriptChunkUpdates(chunkUpdateA, chunkUpdateB);
            if (mergedUpdate != null) {
                chunks[chunkPath] = mergedUpdate;
            }
        } else {
            chunks[chunkPath] = chunkUpdateA;
        }
    }
    for (const [chunkPath, chunkUpdateB] of Object.entries(chunksB)){
        if (chunks[chunkPath] == null) {
            chunks[chunkPath] = chunkUpdateB;
        }
    }
    if (Object.keys(chunks).length === 0) {
        return undefined;
    }
    return chunks;
}
function mergeEcmascriptChunkUpdates(updateA, updateB) {
    if (updateA.type === 'added' && updateB.type === 'deleted') {
        // These two completely cancel each other out.
        return undefined;
    }
    if (updateA.type === 'deleted' && updateB.type === 'added') {
        const added = [];
        const deleted = [];
        const deletedModules = new Set(updateA.modules ?? []);
        const addedModules = new Set(updateB.modules ?? []);
        for (const moduleId of addedModules){
            if (!deletedModules.has(moduleId)) {
                added.push(moduleId);
            }
        }
        for (const moduleId of deletedModules){
            if (!addedModules.has(moduleId)) {
                deleted.push(moduleId);
            }
        }
        if (added.length === 0 && deleted.length === 0) {
            return undefined;
        }
        return {
            type: 'partial',
            added,
            deleted
        };
    }
    if (updateA.type === 'partial' && updateB.type === 'partial') {
        const added = new Set([
            ...updateA.added ?? [],
            ...updateB.added ?? []
        ]);
        const deleted = new Set([
            ...updateA.deleted ?? [],
            ...updateB.deleted ?? []
        ]);
        if (updateB.added != null) {
            for (const moduleId of updateB.added){
                deleted.delete(moduleId);
            }
        }
        if (updateB.deleted != null) {
            for (const moduleId of updateB.deleted){
                added.delete(moduleId);
            }
        }
        return {
            type: 'partial',
            added: [
                ...added
            ],
            deleted: [
                ...deleted
            ]
        };
    }
    if (updateA.type === 'added' && updateB.type === 'partial') {
        const modules = new Set([
            ...updateA.modules ?? [],
            ...updateB.added ?? []
        ]);
        for (const moduleId of updateB.deleted ?? []){
            modules.delete(moduleId);
        }
        return {
            type: 'added',
            modules: [
                ...modules
            ]
        };
    }
    if (updateA.type === 'partial' && updateB.type === 'deleted') {
        // We could eagerly return `updateB` here, but this would potentially be
        // incorrect if `updateA` has added modules.
        const modules = new Set(updateB.modules ?? []);
        if (updateA.added != null) {
            for (const moduleId of updateA.added){
                modules.delete(moduleId);
            }
        }
        return {
            type: 'deleted',
            modules: [
                ...modules
            ]
        };
    }
    // Any other update combination is invalid.
    return undefined;
}
function invariant(_, message) {
    throw new Error(`Invariant: ${message}`);
}
const CRITICAL = [
    'bug',
    'error',
    'fatal'
];
function compareByList(list, a, b) {
    const aI = list.indexOf(a) + 1 || list.length;
    const bI = list.indexOf(b) + 1 || list.length;
    return aI - bI;
}
const chunksWithIssues = new Map();
function emitIssues() {
    const issues = [];
    const deduplicationSet = new Set();
    for (const [_, chunkIssues] of chunksWithIssues){
        for (const chunkIssue of chunkIssues){
            if (deduplicationSet.has(chunkIssue.formatted)) continue;
            issues.push(chunkIssue);
            deduplicationSet.add(chunkIssue.formatted);
        }
    }
    sortIssues(issues);
    hooks.issues(issues);
}
function handleIssues(msg) {
    const key = resourceKey(msg.resource);
    let hasCriticalIssues = false;
    for (const issue of msg.issues){
        if (CRITICAL.includes(issue.severity)) {
            hasCriticalIssues = true;
        }
    }
    if (msg.issues.length > 0) {
        chunksWithIssues.set(key, msg.issues);
    } else if (chunksWithIssues.has(key)) {
        chunksWithIssues.delete(key);
    }
    emitIssues();
    return hasCriticalIssues;
}
const SEVERITY_ORDER = [
    'bug',
    'fatal',
    'error',
    'warning',
    'info',
    'log'
];
const CATEGORY_ORDER = [
    'parse',
    'resolve',
    'code generation',
    'rendering',
    'typescript',
    'other'
];
function sortIssues(issues) {
    issues.sort((a, b)=>{
        const first = compareByList(SEVERITY_ORDER, a.severity, b.severity);
        if (first !== 0) return first;
        return compareByList(CATEGORY_ORDER, a.category, b.category);
    });
}
const hooks = {
    beforeRefresh: ()=>{},
    refresh: ()=>{},
    buildOk: ()=>{},
    issues: (_issues)=>{}
};
function setHooks(newHooks) {
    Object.assign(hooks, newHooks);
}
function handleSocketMessage(msg) {
    sortIssues(msg.issues);
    handleIssues(msg);
    switch(msg.type){
        case 'issues':
            break;
        case 'partial':
            // aggregate updates
            aggregateUpdates(msg);
            break;
        default:
            // run single update
            const runHooks = chunkListsWithPendingUpdates.size === 0;
            if (runHooks) hooks.beforeRefresh();
            triggerUpdate(msg);
            if (runHooks) finalizeUpdate();
            break;
    }
}
function finalizeUpdate() {
    hooks.refresh();
    hooks.buildOk();
    // This is used by the Next.js integration test suite to notify it when HMR
    // updates have been completed.
    // TODO: Only run this in test environments (gate by `process.env.__NEXT_TEST_MODE`)
    if (globalThis.__NEXT_HMR_CB) {
        globalThis.__NEXT_HMR_CB();
        globalThis.__NEXT_HMR_CB = null;
    }
}
function subscribeToChunkUpdate(chunkListPath, sendMessage, callback) {
    return subscribeToUpdate({
        path: chunkListPath
    }, sendMessage, callback);
}
function subscribeToUpdate(resource, sendMessage, callback) {
    const key = resourceKey(resource);
    let callbackSet;
    const existingCallbackSet = updateCallbackSets.get(key);
    if (!existingCallbackSet) {
        callbackSet = {
            callbacks: new Set([
                callback
            ]),
            unsubscribe: subscribeToUpdates(sendMessage, resource)
        };
        updateCallbackSets.set(key, callbackSet);
    } else {
        existingCallbackSet.callbacks.add(callback);
        callbackSet = existingCallbackSet;
    }
    return ()=>{
        callbackSet.callbacks.delete(callback);
        if (callbackSet.callbacks.size === 0) {
            callbackSet.unsubscribe();
            updateCallbackSets.delete(key);
        }
    };
}
function triggerUpdate(msg) {
    const key = resourceKey(msg.resource);
    const callbackSet = updateCallbackSets.get(key);
    if (!callbackSet) {
        return;
    }
    for (const callback of callbackSet.callbacks){
        callback(msg);
    }
    if (msg.type === 'notFound') {
        // This indicates that the resource which we subscribed to either does not exist or
        // has been deleted. In either case, we should clear all update callbacks, so if a
        // new subscription is created for the same resource, it will send a new "subscribe"
        // message to the server.
        // No need to send an "unsubscribe" message to the server, it will have already
        // dropped the update stream before sending the "notFound" message.
        updateCallbackSets.delete(key);
    }
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
"[project]/pages/portal/call-sessions.tsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>CallSessionsPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabase.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$UserContext$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/context/UserContext.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$phoneUtils$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/phoneUtils.ts [client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
;
;
;
// Module-level cache to persist data across page navigation in the same session
let cachedSessions = [];
let lastFetchTime = 0;
const CACHE_DURATION = 30000; // 30 seconds
function CallSessionsPage() {
    _s();
    const { user, mounted } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$UserContext$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["useUser"])();
    const [sessions, setSessions] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(cachedSessions);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(cachedSessions.length === 0);
    const [isRefetching, setIsRefetching] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isAuthorized, setIsAuthorized] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [searchQuery, setSearchQuery] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])("");
    const filteredItems = sessions.filter((s)=>{
        const q = searchQuery.toLowerCase();
        return s.agentName?.toLowerCase().includes(q) || s.employeeId?.toLowerCase().includes(q) || s.campaignName?.toLowerCase().includes(q) || s.customerName?.toLowerCase().includes(q) || s.manualCampaignName?.toLowerCase().includes(q) || s.manualCustomerName?.toLowerCase().includes(q) || s.status?.toLowerCase().includes(q);
    });
    const formatTimeSafe = (date)=>{
        if (!date) return '--:--:--';
        try {
            return new Date(date).toLocaleTimeString('en-IN', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: true
            });
        } catch (e) {
            return '--:--:--';
        }
    };
    const formatDateSafe = (date)=>{
        if (!date) return '-- -- --';
        try {
            return new Date(date).toLocaleDateString('en-IN', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
            });
        } catch (e) {
            return '-- -- --';
        }
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CallSessionsPage.useEffect": ()=>{
            if (mounted && user) {
                // Check authorization: only NXUS-001
                if (user.employeeId === 'NXUS-001') {
                    setIsAuthorized(true);
                    const now = Date.now();
                    if (cachedSessions.length === 0 || now - lastFetchTime > CACHE_DURATION) {
                        fetchSessions(cachedSessions.length === 0); // Only show full loader if no cache
                    }
                } else {
                    setIsAuthorized(false);
                    setLoading(false);
                }
            } else if (mounted && !user) {
                setIsAuthorized(false);
                setLoading(false);
            }
        }
    }["CallSessionsPage.useEffect"], [
        user,
        mounted
    ]);
    const fetchSessions = async (showFullLoader = true)=>{
        try {
            if (showFullLoader) setLoading(true);
            else setIsRefetching(true);
            // 1. Fetch sessions
            const { data: sessionData, error: sessionError } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["supabase"].from('call_sessions').select('*').order('updated_at', {
                ascending: false
            });
            if (sessionError) throw sessionError;
            if (!sessionData || sessionData.length === 0) {
                setSessions([]);
                cachedSessions = [];
                return;
            }
            // 2. Collect ALL IDs for enrichment (both auto and manual)
            const userIds = Array.from(new Set(sessionData.map((s)=>s.user_id)));
            const campaignIds = Array.from(new Set([
                ...sessionData.map((s)=>s.campaign_id),
                ...sessionData.map((s)=>s.manual_campaign_id).filter((id)=>!!id)
            ]));
            const customerIds = Array.from(new Set([
                ...sessionData.map((s)=>s.customer_id).filter((id)=>!!id),
                ...sessionData.map((s)=>s.manual_customer_id).filter((id)=>!!id)
            ]));
            // 3. Fetch related data in parallel
            const [usersRes, campaignsRes, customersRes] = await Promise.all([
                __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["supabase"].from('user_profiles').select('user_id, user_name, employee_id').in('user_id', userIds),
                __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["supabase"].from('campaigns').select('id, name').in('id', campaignIds),
                __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["supabase"].from('customers').select('id, customer_name, phone_no').in('id', customerIds)
            ]);
            // 4. Map names
            const userMap = Object.fromEntries((usersRes.data || []).map((u)=>[
                    u.user_id,
                    u
                ]));
            const campaignMap = Object.fromEntries((campaignsRes.data || []).map((c)=>[
                    c.id,
                    c.name
                ]));
            const customerMap = Object.fromEntries((customersRes.data || []).map((c)=>[
                    c.id,
                    c
                ]));
            // 5. Enrich sessions
            const enriched = sessionData.map((s)=>{
                const cust = customerMap[s.customer_id];
                const manualCust = customerMap[s.manual_customer_id];
                return {
                    ...s,
                    agentName: userMap[s.user_id]?.user_name || 'Unknown',
                    employeeId: userMap[s.user_id]?.employee_id || '--',
                    campaignName: campaignMap[s.campaign_id] || s.campaign_id,
                    customerName: cust?.customer_name || 'N/A',
                    customerPhone: cust?.phone_no ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$phoneUtils$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["decryptPhone"])(cust.phone_no) : '',
                    // Override details
                    manualCampaignName: campaignMap[s.manual_campaign_id] || s.manual_campaign_id || '---',
                    manualCustomerName: manualCust?.customer_name || 'N/A',
                    manualCustomerPhone: manualCust?.phone_no ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$phoneUtils$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["decryptPhone"])(manualCust.phone_no) : ''
                };
            });
            setSessions(enriched);
            cachedSessions = enriched;
            lastFetchTime = Date.now();
        } catch (err) {
            console.error("Error fetching call sessions:", err);
        } finally{
            setLoading(false);
            setIsRefetching(false);
        }
    };
    const getStatusColor = (status)=>{
        switch(status){
            case 'active':
                return 'bg-green-100 text-green-700 border-green-200';
            case 'assigned':
                return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'disposition_pending':
                return 'bg-orange-100 text-orange-700 border-orange-200';
            case 'paused':
                return 'bg-gray-100 text-gray-700 border-gray-200';
            case 'closed':
                return 'bg-red-100 text-red-700 border-red-200';
            default:
                return 'bg-gray-100 text-gray-500 border-gray-200';
        }
    };
    if (!mounted || loading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex items-center justify-center min-h-screen bg-slate-50",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"
            }, void 0, false, {
                fileName: "[project]/pages/portal/call-sessions.tsx",
                lineNumber: 164,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/pages/portal/call-sessions.tsx",
            lineNumber: 163,
            columnNumber: 7
        }, this);
    }
    if (isAuthorized === false) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex flex-col items-center justify-center min-h-screen bg-slate-50 text-center p-8",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-4",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                        className: "fi fi-rr-lock text-2xl"
                    }, void 0, false, {
                        fileName: "[project]/pages/portal/call-sessions.tsx",
                        lineNumber: 173,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/pages/portal/call-sessions.tsx",
                    lineNumber: 172,
                    columnNumber: 11
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                    className: "text-2xl font-bold text-gray-900 mb-2",
                    children: "Access Restricted"
                }, void 0, false, {
                    fileName: "[project]/pages/portal/call-sessions.tsx",
                    lineNumber: 175,
                    columnNumber: 11
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-gray-500 max-w-md",
                    children: "This module is reserved for system administrators (NXUS-001). Please contact support if you believe this is an error."
                }, void 0, false, {
                    fileName: "[project]/pages/portal/call-sessions.tsx",
                    lineNumber: 176,
                    columnNumber: 11
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/pages/portal/call-sessions.tsx",
            lineNumber: 171,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "p-4 w-full h-full min-h-0 overflow-auto bg-[#fbfcfe]",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-wrap items-center justify-between gap-4 mb-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-3",
                        children: [
                            [
                                'All Agents',
                                'All Campaigns',
                                'Status'
                            ].map((filter)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-3 px-4 py-2 bg-white border border-gray-100 rounded-xl text-[10px] font-black text-gray-700 hover:border-indigo-200 cursor-pointer transition-all uppercase tracking-wider",
                                    children: [
                                        filter,
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                            className: "fi fi-rr-angle-small-down text-[14px]"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/portal/call-sessions.tsx",
                                            lineNumber: 191,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, filter, true, {
                                    fileName: "[project]/pages/portal/call-sessions.tsx",
                                    lineNumber: 189,
                                    columnNumber: 13
                                }, this)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "w-12 h-12 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-indigo-600 cursor-pointer transition-colors",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                    className: "fi fi-rr-filter text-[16px]"
                                }, void 0, false, {
                                    fileName: "[project]/pages/portal/call-sessions.tsx",
                                    lineNumber: 195,
                                    columnNumber: 14
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/pages/portal/call-sessions.tsx",
                                lineNumber: 194,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/pages/portal/call-sessions.tsx",
                        lineNumber: 187,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-3",
                        children: [
                            isRefetching && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-[10px] font-black text-indigo-400 animate-pulse uppercase tracking-widest mr-2",
                                children: "Syncing Live..."
                            }, void 0, false, {
                                fileName: "[project]/pages/portal/call-sessions.tsx",
                                lineNumber: 200,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                onClick: ()=>fetchSessions(true),
                                className: "px-5 py-3 bg-indigo-600 text-white rounded-xl text-[10px] font-black cursor-pointer hover:bg-indigo-700 active:scale-95 transition-all flex items-center gap-2 uppercase tracking-widest ",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                        className: `fi fi-rr-refresh text-[10px] ${isRefetching ? 'animate-spin' : ''}`
                                    }, void 0, false, {
                                        fileName: "[project]/pages/portal/call-sessions.tsx",
                                        lineNumber: 206,
                                        columnNumber: 15
                                    }, this),
                                    "Refresh Panel"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/portal/call-sessions.tsx",
                                lineNumber: 202,
                                columnNumber: 12
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/pages/portal/call-sessions.tsx",
                        lineNumber: 198,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/pages/portal/call-sessions.tsx",
                lineNumber: 186,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-wrap items-center justify-between gap-4 mb-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-3 flex-1 max-w-2xl",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "relative flex-1",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                        className: "fi fi-rr-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-[14px]"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/portal/call-sessions.tsx",
                                        lineNumber: 215,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "text",
                                        placeholder: "Search by agent, campaign, customer or status...",
                                        value: searchQuery,
                                        onChange: (e)=>setSearchQuery(e.target.value),
                                        className: "w-full pl-11 pr-14 py-3 bg-white border border-gray-100 rounded-xl text-[12px] font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all placeholder:text-gray-300 shadow-none"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/portal/call-sessions.tsx",
                                        lineNumber: 216,
                                        columnNumber: 13
                                    }, this),
                                    searchQuery && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>setSearchQuery(""),
                                        className: "absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-black text-indigo-500 hover:text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg uppercase transition-colors",
                                        style: {
                                            zIndex: 10
                                        },
                                        children: "Clear"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/portal/call-sessions.tsx",
                                        lineNumber: 224,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/portal/call-sessions.tsx",
                                lineNumber: 214,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: "flex items-center gap-2 px-5 py-3 bg-white border border-gray-100 rounded-xl text-[12px] font-black text-gray-700 hover:bg-gray-50 transition-all uppercase tracking-tight shadow-none flex-shrink-0",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                        className: "fi fi-rr-file-export text-[14px]"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/portal/call-sessions.tsx",
                                        lineNumber: 235,
                                        columnNumber: 13
                                    }, this),
                                    "Export"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/portal/call-sessions.tsx",
                                lineNumber: 234,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/pages/portal/call-sessions.tsx",
                        lineNumber: 213,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-col items-end gap-1",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-[10px] font-black text-gray-300 uppercase tracking-widest leading-none",
                                children: "Status: Monitoring Enabled"
                            }, void 0, false, {
                                fileName: "[project]/pages/portal/call-sessions.tsx",
                                lineNumber: 241,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-[10px] font-bold text-indigo-300 uppercase tracking-widest leading-none",
                                children: [
                                    "Last Refreshed: ",
                                    lastFetchTime > 0 ? formatTimeSafe(new Date(lastFetchTime)) : 'WAITING...'
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/portal/call-sessions.tsx",
                                lineNumber: 242,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/pages/portal/call-sessions.tsx",
                        lineNumber: 240,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/pages/portal/call-sessions.tsx",
                lineNumber: 212,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden mb-6",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "overflow-x-auto",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                        className: "w-full text-left border-collapse",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                    className: "bg-gray-50/50",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                            className: "px-4 py-4 border-b border-gray-100 text-center",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "checkbox",
                                                className: "rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/portal/call-sessions.tsx",
                                                lineNumber: 255,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/pages/portal/call-sessions.tsx",
                                            lineNumber: 254,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                            className: "px-4 py-4 border-b border-gray-100 text-[12px] font-black text-gray-500 uppercase tracking-widest whitespace-nowrap",
                                            children: "Agent & Org"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/portal/call-sessions.tsx",
                                            lineNumber: 257,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                            className: "px-4 py-4 border-b border-gray-100 text-[12px] font-black text-gray-500 uppercase tracking-widest whitespace-nowrap",
                                            children: "Auto Session"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/portal/call-sessions.tsx",
                                            lineNumber: 258,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                            className: "px-4 py-4 border-b border-gray-100 text-[12px] font-black text-gray-500 uppercase tracking-widest whitespace-nowrap text-center",
                                            children: "Status"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/portal/call-sessions.tsx",
                                            lineNumber: 259,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                            className: "px-4 py-4 border-b border-gray-100 text-[12px] font-black text-gray-500 uppercase tracking-widest whitespace-nowrap text-center",
                                            children: "Overrides"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/portal/call-sessions.tsx",
                                            lineNumber: 260,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                            className: "px-4 py-4 border-b border-gray-100 text-[12px] font-black text-gray-500 uppercase tracking-widest whitespace-nowrap text-center",
                                            children: "Flags"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/portal/call-sessions.tsx",
                                            lineNumber: 261,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                            className: "px-4 py-4 border-b border-gray-100 text-[12px] font-black text-gray-500 uppercase tracking-widest whitespace-nowrap text-right",
                                            children: "Heartbeat"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/portal/call-sessions.tsx",
                                            lineNumber: 262,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/portal/call-sessions.tsx",
                                    lineNumber: 253,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/pages/portal/call-sessions.tsx",
                                lineNumber: 252,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                                className: "divide-y divide-gray-50",
                                children: filteredItems.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                        colSpan: 8,
                                        className: "px-6 py-24 text-center",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex flex-col items-center gap-3 opacity-30",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                    className: "fi fi-rr-search-heart text-5xl"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/call-sessions.tsx",
                                                    lineNumber: 270,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-[12px] font-black uppercase tracking-widest text-slate-400",
                                                    children: searchQuery ? `No sessions found for "${searchQuery}"` : 'No active sessions monitored'
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/call-sessions.tsx",
                                                    lineNumber: 271,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/portal/call-sessions.tsx",
                                            lineNumber: 269,
                                            columnNumber: 21
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/pages/portal/call-sessions.tsx",
                                        lineNumber: 268,
                                        columnNumber: 19
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/pages/portal/call-sessions.tsx",
                                    lineNumber: 267,
                                    columnNumber: 17
                                }, this) : filteredItems.map((session, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                        className: "hover:bg-slate-50 transition-colors group",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                className: "px-4 py-4 text-center",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "checkbox",
                                                    className: "rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/call-sessions.tsx",
                                                    lineNumber: 281,
                                                    columnNumber: 24
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/pages/portal/call-sessions.tsx",
                                                lineNumber: 280,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                className: "px-4 py-4",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex flex-col gap-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center gap-3 pr-4 py-1.5 pl-1.5 border border-indigo-100 rounded-full bg-indigo-50/50 w-fit",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center text-white font-black text-[14px]",
                                                                    children: session.agentName.charAt(0)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/call-sessions.tsx",
                                                                    lineNumber: 286,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "flex flex-col",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "text-[14px] font-black text-gray-900 leading-none",
                                                                            children: session.agentName
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/pages/portal/call-sessions.tsx",
                                                                            lineNumber: 290,
                                                                            columnNumber: 29
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "text-[11px] font-bold text-indigo-500 leading-none mt-1 uppercase tracking-wider",
                                                                            children: session.employeeId || 'ID_ERR'
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/pages/portal/call-sessions.tsx",
                                                                            lineNumber: 291,
                                                                            columnNumber: 29
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/pages/portal/call-sessions.tsx",
                                                                    lineNumber: 289,
                                                                    columnNumber: 27
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/pages/portal/call-sessions.tsx",
                                                            lineNumber: 285,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-[10px] font-black text-gray-400 pl-2 uppercase tracking-widest",
                                                            children: session.organization_id || 'NO_ORGANIZATION'
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/call-sessions.tsx",
                                                            lineNumber: 294,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/pages/portal/call-sessions.tsx",
                                                    lineNumber: 284,
                                                    columnNumber: 23
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/pages/portal/call-sessions.tsx",
                                                lineNumber: 283,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                className: "px-4 py-4",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex flex-col gap-1.5",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-[13px] font-black text-gray-800 leading-none flex items-center gap-2",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                                    className: "fi fi-rr-bullhorn text-[12px] text-gray-400 flex"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/call-sessions.tsx",
                                                                    lineNumber: 299,
                                                                    columnNumber: 116
                                                                }, this),
                                                                " ",
                                                                session.campaignName
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/pages/portal/call-sessions.tsx",
                                                            lineNumber: 299,
                                                            columnNumber: 27
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-[12px] font-semibold text-indigo-600 leading-none flex items-center gap-2",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                                    className: "fi fi-rr-user-md text-[12px] flex"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/call-sessions.tsx",
                                                                    lineNumber: 300,
                                                                    columnNumber: 121
                                                                }, this),
                                                                " ",
                                                                session.customerName !== 'N/A' ? `${session.customerName}` : 'IDLE'
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/pages/portal/call-sessions.tsx",
                                                            lineNumber: 300,
                                                            columnNumber: 27
                                                        }, this),
                                                        session.customerPhone && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-[11px] font-bold text-gray-400 pl-5 flex items-center gap-2 italic",
                                                            children: session.customerPhone
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/call-sessions.tsx",
                                                            lineNumber: 302,
                                                            columnNumber: 30
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/pages/portal/call-sessions.tsx",
                                                    lineNumber: 298,
                                                    columnNumber: 24
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/pages/portal/call-sessions.tsx",
                                                lineNumber: 297,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                className: "px-4 py-4 text-center",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: `inline-flex items-center px-4 py-1.5 rounded-full text-[11px] font-black leading-none border uppercase ${session.status === 'active' ? 'bg-green-50 text-green-600 border-green-100' : session.status === 'assigned' ? 'bg-blue-50 text-blue-600 border-blue-100' : session.status === 'disposition_pending' ? 'bg-orange-50 text-orange-600 border-orange-100' : 'bg-slate-50 text-gray-500 border-gray-100'}`,
                                                    children: session.status.replace('_', ' ')
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/call-sessions.tsx",
                                                    lineNumber: 307,
                                                    columnNumber: 23
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/pages/portal/call-sessions.tsx",
                                                lineNumber: 306,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                className: "px-4 py-4",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex flex-col gap-1.5",
                                                    children: session.manual_status || session.manual_campaign_id ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex items-center gap-2 mb-1",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-[10px] font-black text-purple-600 border border-purple-100 bg-purple-50 px-2.5 py-0.5 rounded-lg uppercase tracking-widest whitespace-nowrap",
                                                                    children: session.manual_status || 'MANUAL'
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/call-sessions.tsx",
                                                                    lineNumber: 321,
                                                                    columnNumber: 33
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/call-sessions.tsx",
                                                                lineNumber: 320,
                                                                columnNumber: 31
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-[13px] font-black text-gray-800 leading-none flex items-center gap-2",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                                        className: "fi fi-rr-bullhorn text-[12px] text-purple-400 flex"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/portal/call-sessions.tsx",
                                                                        lineNumber: 323,
                                                                        columnNumber: 120
                                                                    }, this),
                                                                    " ",
                                                                    session.manualCampaignName
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/pages/portal/call-sessions.tsx",
                                                                lineNumber: 323,
                                                                columnNumber: 31
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-[12px] font-semibold text-purple-600 leading-none flex items-center gap-2",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                                        className: "fi fi-rr-user-md text-[12px] flex"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/portal/call-sessions.tsx",
                                                                        lineNumber: 324,
                                                                        columnNumber: 125
                                                                    }, this),
                                                                    " ",
                                                                    session.manualCustomerName
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/pages/portal/call-sessions.tsx",
                                                                lineNumber: 324,
                                                                columnNumber: 31
                                                            }, this),
                                                            session.manualCustomerPhone && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-[11px] font-bold text-gray-400 pl-5 flex items-center gap-2 italic",
                                                                children: session.manualCustomerPhone
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/call-sessions.tsx",
                                                                lineNumber: 326,
                                                                columnNumber: 33
                                                            }, this)
                                                        ]
                                                    }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "text-center w-full",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-[12px] font-bold text-gray-200",
                                                            children: "NO OVERRIDE"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/call-sessions.tsx",
                                                            lineNumber: 331,
                                                            columnNumber: 32
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/call-sessions.tsx",
                                                        lineNumber: 330,
                                                        columnNumber: 29
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/call-sessions.tsx",
                                                    lineNumber: 317,
                                                    columnNumber: 24
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/pages/portal/call-sessions.tsx",
                                                lineNumber: 316,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                className: "px-4 py-4 text-center",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center justify-center gap-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: `px-3 py-1.5 rounded-xl text-[10px] font-black border flex tracking-wider ${session.is_manual ? 'bg-purple-50 text-purple-600 border-purple-100' : 'bg-slate-50 text-slate-400 border-slate-100'}`,
                                                            children: session.is_manual ? 'M-MODE' : 'A-SYNC'
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/call-sessions.tsx",
                                                            lineNumber: 338,
                                                            columnNumber: 27
                                                        }, this),
                                                        session.is_unassigned && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "bg-red-50 text-red-500 px-3 py-1.5 rounded-xl text-[10px] font-black border border-red-100 flex",
                                                            children: "UNASGND"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/call-sessions.tsx",
                                                            lineNumber: 342,
                                                            columnNumber: 29
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/pages/portal/call-sessions.tsx",
                                                    lineNumber: 337,
                                                    columnNumber: 24
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/pages/portal/call-sessions.tsx",
                                                lineNumber: 336,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                className: "px-4 py-4 text-right",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex flex-col items-end gap-1.5",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-[13px] font-black text-indigo-700 flex items-center gap-2",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                                    className: "fi fi-rr-bolt animate-pulse flex text-[14px]"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/call-sessions.tsx",
                                                                    lineNumber: 348,
                                                                    columnNumber: 103
                                                                }, this),
                                                                " ",
                                                                formatTimeSafe(session.updated_at)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/pages/portal/call-sessions.tsx",
                                                            lineNumber: 348,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-[11px] font-bold text-gray-300 leading-none",
                                                            children: formatDateSafe(session.updated_at)
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/call-sessions.tsx",
                                                            lineNumber: 349,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/pages/portal/call-sessions.tsx",
                                                    lineNumber: 347,
                                                    columnNumber: 23
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/pages/portal/call-sessions.tsx",
                                                lineNumber: 346,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, `${session.user_id}-${session.campaign_id}`, true, {
                                        fileName: "[project]/pages/portal/call-sessions.tsx",
                                        lineNumber: 279,
                                        columnNumber: 19
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/pages/portal/call-sessions.tsx",
                                lineNumber: 265,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/pages/portal/call-sessions.tsx",
                        lineNumber: 251,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/pages/portal/call-sessions.tsx",
                    lineNumber: 250,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/pages/portal/call-sessions.tsx",
                lineNumber: 249,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-center gap-2 mt-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: "px-3 py-1 bg-white border border-gray-100 rounded text-[10px] font-bold text-gray-400",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                className: "fi fi-rr-angle-left"
                            }, void 0, false, {
                                fileName: "[project]/pages/portal/call-sessions.tsx",
                                lineNumber: 362,
                                columnNumber: 115
                            }, this),
                            " Previous"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/pages/portal/call-sessions.tsx",
                        lineNumber: 362,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: "w-6 h-6 flex items-center justify-center bg-indigo-600 text-white rounded text-[10px] font-bold",
                        children: "1"
                    }, void 0, false, {
                        fileName: "[project]/pages/portal/call-sessions.tsx",
                        lineNumber: 363,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: "px-3 py-1 bg-white border border-gray-100 rounded text-[10px] font-bold text-gray-400 font-bold",
                        children: [
                            "Next ",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                className: "fi fi-rr-angle-right"
                            }, void 0, false, {
                                fileName: "[project]/pages/portal/call-sessions.tsx",
                                lineNumber: 364,
                                columnNumber: 130
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/pages/portal/call-sessions.tsx",
                        lineNumber: 364,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/pages/portal/call-sessions.tsx",
                lineNumber: 361,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/pages/portal/call-sessions.tsx",
        lineNumber: 184,
        columnNumber: 5
    }, this);
}
_s(CallSessionsPage, "ucNsZtO6Kt43DpwKjYZTBZEIA/A=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$UserContext$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["useUser"]
    ];
});
_c = CallSessionsPage;
var _c;
__turbopack_context__.k.register(_c, "CallSessionsPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[next]/entry/page-loader.ts { PAGE => \"[project]/pages/portal/call-sessions.tsx [client] (ecmascript)\" } [client] (ecmascript)", ((__turbopack_context__, module, exports) => {

const PAGE_PATH = "/portal/call-sessions";
(window.__NEXT_P = window.__NEXT_P || []).push([
    PAGE_PATH,
    ()=>{
        return __turbopack_context__.r("[project]/pages/portal/call-sessions.tsx [client] (ecmascript)");
    }
]);
// @ts-expect-error module.hot exists
if (module.hot) {
    // @ts-expect-error module.hot exists
    module.hot.dispose(function() {
        window.__NEXT_P.push([
            PAGE_PATH
        ]);
    });
}
}),
"[hmr-entry]/hmr-entry.js { ENTRY => \"[project]/pages/portal/call-sessions.tsx\" }", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.r("[next]/entry/page-loader.ts { PAGE => \"[project]/pages/portal/call-sessions.tsx [client] (ecmascript)\" } [client] (ecmascript)");
}),
]);

//# sourceMappingURL=%5Broot-of-the-server%5D__29b47c60._.js.map