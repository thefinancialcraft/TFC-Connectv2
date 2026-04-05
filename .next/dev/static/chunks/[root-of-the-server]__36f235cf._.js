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
"[project]/hooks/useActivityData.ts [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useActivityData",
    ()=>useActivityData
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabase.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$UserContext$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/context/UserContext.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$phoneUtils$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/phoneUtils.ts [client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
;
;
;
;
function useActivityData() {
    _s();
    const { user, mounted } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$UserContext$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["useUser"])();
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [source, setSource] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])('crm');
    const [activities, setActivities] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [mobileActivities, setMobileActivities] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])([]); // New state for mobile history
    const [selectedDate, setSelectedDate] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])({
        "useActivityData.useState": ()=>{
            const today = new Date();
            return today.toISOString().split('T')[0];
        }
    }["useActivityData.useState"]);
    const [searchQuery, setSearchQuery] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [stats, setStats] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])({
        totalDials: 0,
        totalTalkTime: 0,
        contactable: 0,
        uncontactable: 0,
        lastCallTime: "N/A",
        idleFrom: "N/A"
    });
    const abortControllerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const fetchActivities = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useActivityData.useCallback[fetchActivities]": async (isBackground = false)=>{
            if (!mounted || !user) return;
            // Abort previous request
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
            abortControllerRef.current = new AbortController();
            try {
                if (!isBackground) setLoading(true);
                setError("");
                const localDate = new Date(selectedDate + 'T00:00:00'); // Parse as local
                const startOfDay = new Date(localDate.getFullYear(), localDate.getMonth(), localDate.getDate(), 0, 0, 0, 0).toISOString();
                const endOfDay = new Date(localDate.getFullYear(), localDate.getMonth(), localDate.getDate(), 23, 59, 59, 999).toISOString();
                // Base query
                // Note: We use !inner on agent join to allow filtering by agent's organization_id for Level 3
                let query = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["supabase"].from("call_logs").select(`
          *,
          agent:user_profiles!agent_id!inner(user_name, employee_id, organization_id),
          campaign:campaigns!campaign_id(name)
        `).gte("created_at", startOfDay).lte("created_at", endOfDay).order("created_at", {
                    ascending: false
                });
                // Apply Security Levels
                if (user.isClient) {
                    // Level 1: Client Agent (Own activities only)
                    if (user.designation === 'agent' || !user.designation) {
                        if (user.uid) {
                            query = query.eq('agent_id', user.uid);
                        }
                    } else if (user.designation === 'team_leader') {
                        let teamMemberIds = [
                            user.uid
                        ];
                        if (user.uid) {
                            const { data: teamData } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["supabase"].from('teams').select('members').eq('leader_id', user.uid).eq('is_active', true);
                            if (teamData) {
                                teamData.forEach({
                                    "useActivityData.useCallback[fetchActivities]": (team)=>{
                                        // Parse members JSONB similar to other pages
                                        if (Array.isArray(team.members)) {
                                            team.members.forEach({
                                                "useActivityData.useCallback[fetchActivities]": (m)=>{
                                                    if (typeof m === 'string') teamMemberIds.push(m);
                                                }
                                            }["useActivityData.useCallback[fetchActivities]"]);
                                        } else if (typeof team.members === 'string') {
                                            try {
                                                const parsed = JSON.parse(team.members);
                                                if (Array.isArray(parsed)) parsed.forEach({
                                                    "useActivityData.useCallback[fetchActivities]": (id)=>teamMemberIds.push(String(id))
                                                }["useActivityData.useCallback[fetchActivities]"]);
                                            } catch (e) {}
                                        }
                                    }
                                }["useActivityData.useCallback[fetchActivities]"]);
                            }
                        }
                        teamMemberIds = [
                            ...new Set(teamMemberIds)
                        ]; // Unique keys
                        if (teamMemberIds.length > 0) {
                            query = query.in('agent_id', teamMemberIds);
                        }
                    } else if ([
                        'ceo',
                        'developer'
                    ].includes(user.designation || '')) {
                        if (user.organization_id) {
                            // Filter by agent's organization_id (using the !inner join alias)
                            query = query.eq('agent.organization_id', user.organization_id);
                        } else {
                            // Fail secure
                            query = query.eq('id', '00000000-0000-0000-0000-000000000000');
                        }
                    }
                }
                // Level 4: Internal Staff (!isClient) gets explicit Global Access (no filters added)
                // --- START: COMBINED FETCH LOGIC ---
                // 1. Fetch Call Logs (Primary source)
                const { data: callLogs, error: logError } = await query;
                if (logError) throw logError;
                // 2. Fetch Rejected Leads for the same day
                let rejectedQuery = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["supabase"].from('rejected_leads').select('*, agent:user_profiles!agent_id(user_name, employee_id, organization_id), campaign:campaigns!campaign_id(name)').gte('rejected_at', startOfDay).lte('rejected_at', endOfDay);
                // 3. Fetch Closed Deals for the same day
                let closedQuery = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["supabase"].from('closed_deals').select('*, agent:user_profiles!agent_id(user_name, employee_id, organization_id), campaign:campaigns!campaign_id(name)').gte('closed_at', startOfDay).lte('closed_at', endOfDay);
                // Apply same user filters to rejected/closed queries
                if (user.isClient) {
                    if (user.designation === 'agent' || !user.designation) {
                        rejectedQuery = rejectedQuery.eq('agent_id', user.uid);
                        closedQuery = closedQuery.eq('agent_id', user.uid);
                    } else if (user.organization_id && [
                        'ceo',
                        'developer'
                    ].includes(user.designation)) {
                        rejectedQuery = rejectedQuery.eq('agent.organization_id', user.organization_id);
                        closedQuery = closedQuery.eq('agent.organization_id', user.organization_id);
                    }
                // (TL filter skipped for brevity but usually follows similar logic if needed)
                }
                const [{ data: rejectedLeads }, { data: closedDeals }] = await Promise.all([
                    rejectedQuery,
                    closedQuery
                ]);
                // --- 4. MAP AND MERGE ---
                const mappedLogs = (callLogs || []).map({
                    "useActivityData.useCallback[fetchActivities].mappedLogs": (log)=>({
                            ...log,
                            created_at: log.created_at,
                            activity_type: 'call'
                        })
                }["useActivityData.useCallback[fetchActivities].mappedLogs"]);
                const mappedRejected = (rejectedLeads || []).filter({
                    "useActivityData.useCallback[fetchActivities].mappedRejected": (r)=>!mappedLogs.some({
                            "useActivityData.useCallback[fetchActivities].mappedRejected": (l)=>l.customer_id === r.customer_id && Math.abs(new Date(l.created_at).getTime() - new Date(r.rejected_at).getTime()) < 5000
                        }["useActivityData.useCallback[fetchActivities].mappedRejected"])
                }["useActivityData.useCallback[fetchActivities].mappedRejected"]).map({
                    "useActivityData.useCallback[fetchActivities].mappedRejected": (r)=>({
                            ...r,
                            id: `rej-${r.id}`,
                            created_at: r.rejected_at,
                            customer: {
                                customer_name: r.customer_name
                            },
                            is_connected: 'contactable',
                            activity_type: 'rejection'
                        })
                }["useActivityData.useCallback[fetchActivities].mappedRejected"]);
                const mappedClosed = (closedDeals || []).filter({
                    "useActivityData.useCallback[fetchActivities].mappedClosed": (c)=>!mappedLogs.some({
                            "useActivityData.useCallback[fetchActivities].mappedClosed": (l)=>l.customer_id === c.customer_id && Math.abs(new Date(l.created_at).getTime() - new Date(c.closed_at).getTime()) < 5000
                        }["useActivityData.useCallback[fetchActivities].mappedClosed"])
                }["useActivityData.useCallback[fetchActivities].mappedClosed"]).map({
                    "useActivityData.useCallback[fetchActivities].mappedClosed": (c)=>({
                            ...c,
                            id: `cls-${c.id}`,
                            created_at: c.closed_at,
                            customer: {
                                customer_name: c.customer_name
                            },
                            status: 'closed',
                            is_connected: 'contactable',
                            activity_type: 'closing',
                            disposition: c.final_disposition
                        })
                }["useActivityData.useCallback[fetchActivities].mappedClosed"]);
                const combined = [
                    ...mappedLogs,
                    ...mappedRejected,
                    ...mappedClosed
                ].sort({
                    "useActivityData.useCallback[fetchActivities].combined": (a, b)=>new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
                }["useActivityData.useCallback[fetchActivities].combined"]);
                setActivities(combined);
                // Hydrate missing customer names AND phone numbers
                try {
                    // Hydrate Logic: 
                    // 1. Identify missing IDs
                    const missingCustomerIds = combined.filter({
                        "useActivityData.useCallback[fetchActivities].missingCustomerIds": (a)=>!a.customer?.customer_name && a.customer_id
                    }["useActivityData.useCallback[fetchActivities].missingCustomerIds"]).map({
                        "useActivityData.useCallback[fetchActivities].missingCustomerIds": (a)=>a.customer_id
                    }["useActivityData.useCallback[fetchActivities].missingCustomerIds"]);
                    const uniqueIds = [
                        ...new Set(missingCustomerIds)
                    ];
                    // 2. Identify missing Hashes (mostly for mobile history if any)
                    const missingHashes = combined.filter({
                        "useActivityData.useCallback[fetchActivities].missingHashes": (a)=>!a.customer?.customer_name && !a.customer_id && a.phone_search_hash
                    }["useActivityData.useCallback[fetchActivities].missingHashes"]).map({
                        "useActivityData.useCallback[fetchActivities].missingHashes": (a)=>a.phone_search_hash
                    }["useActivityData.useCallback[fetchActivities].missingHashes"]);
                    const uniqueHashes = [
                        ...new Set(missingHashes)
                    ];
                    let activeHydrate = [], rHydrate = [], cHydrate = [];
                    const promises = [];
                    if (uniqueIds.length > 0) {
                        // Active (by id)
                        promises.push(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["supabase"].from('customers').select('id, customer_name, phone_no, phone_search_hash').in('id', uniqueIds).then({
                            "useActivityData.useCallback[fetchActivities]": (r)=>activeHydrate.push(...r.data || [])
                        }["useActivityData.useCallback[fetchActivities]"]));
                        // Rejected/Closed: Check 'customer_id' column (mapped from original id) AND 'id' (new pk)
                        promises.push(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["supabase"].from('rejected_leads').select('id, customer_id, customer_name, phone_no, phone_search_hash').in('customer_id', uniqueIds).then({
                            "useActivityData.useCallback[fetchActivities]": (r)=>rHydrate.push(...r.data || [])
                        }["useActivityData.useCallback[fetchActivities]"]));
                        promises.push(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["supabase"].from('rejected_leads').select('id, customer_id, customer_name, phone_no, phone_search_hash').in('id', uniqueIds).then({
                            "useActivityData.useCallback[fetchActivities]": (r)=>rHydrate.push(...r.data || [])
                        }["useActivityData.useCallback[fetchActivities]"]));
                        promises.push(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["supabase"].from('closed_deals').select('id, customer_id, customer_name, phone_no, phone_search_hash').in('customer_id', uniqueIds).then({
                            "useActivityData.useCallback[fetchActivities]": (r)=>cHydrate.push(...r.data || [])
                        }["useActivityData.useCallback[fetchActivities]"]));
                        promises.push(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["supabase"].from('closed_deals').select('id, customer_id, customer_name, phone_no, phone_search_hash').in('id', uniqueIds).then({
                            "useActivityData.useCallback[fetchActivities]": (r)=>cHydrate.push(...r.data || [])
                        }["useActivityData.useCallback[fetchActivities]"]));
                    }
                    if (uniqueHashes.length > 0) {
                        promises.push(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["supabase"].from('customers').select('customer_name, phone_no, phone_search_hash').in('phone_search_hash', uniqueHashes).then({
                            "useActivityData.useCallback[fetchActivities]": (r)=>activeHydrate.push(...r.data || [])
                        }["useActivityData.useCallback[fetchActivities]"]));
                        promises.push(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["supabase"].from('rejected_leads').select('customer_name, phone_no, phone_search_hash').in('phone_search_hash', uniqueHashes).then({
                            "useActivityData.useCallback[fetchActivities]": (r)=>rHydrate.push(...r.data || [])
                        }["useActivityData.useCallback[fetchActivities]"]));
                        promises.push(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["supabase"].from('closed_deals').select('customer_name, phone_no, phone_search_hash').in('phone_search_hash', uniqueHashes).then({
                            "useActivityData.useCallback[fetchActivities]": (r)=>cHydrate.push(...r.data || [])
                        }["useActivityData.useCallback[fetchActivities]"]));
                    }
                    if (promises.length > 0) {
                        await Promise.all(promises);
                        setActivities({
                            "useActivityData.useCallback[fetchActivities]": (prev)=>prev.map({
                                    "useActivityData.useCallback[fetchActivities]": (act)=>{
                                        if (act.customer?.customer_name) return act;
                                        // Match Priority: 
                                        // 1. Customer ID (Exact match to id or customer_id)
                                        // 2. Phone Hash
                                        let match = null;
                                        if (act.customer_id) {
                                            match = activeHydrate.find({
                                                "useActivityData.useCallback[fetchActivities]": (a)=>a.id === act.customer_id
                                            }["useActivityData.useCallback[fetchActivities]"]) || rHydrate.find({
                                                "useActivityData.useCallback[fetchActivities]": (r)=>r.id === act.customer_id || r.customer_id === act.customer_id
                                            }["useActivityData.useCallback[fetchActivities]"]) || cHydrate.find({
                                                "useActivityData.useCallback[fetchActivities]": (c)=>c.id === act.customer_id || c.customer_id === act.customer_id
                                            }["useActivityData.useCallback[fetchActivities]"]);
                                        }
                                        if (!match && act.phone_search_hash) {
                                            match = activeHydrate.find({
                                                "useActivityData.useCallback[fetchActivities]": (a)=>a.phone_search_hash === act.phone_search_hash
                                            }["useActivityData.useCallback[fetchActivities]"]) || rHydrate.find({
                                                "useActivityData.useCallback[fetchActivities]": (r)=>r.phone_search_hash === act.phone_search_hash
                                            }["useActivityData.useCallback[fetchActivities]"]) || cHydrate.find({
                                                "useActivityData.useCallback[fetchActivities]": (c)=>c.phone_search_hash === act.phone_search_hash
                                            }["useActivityData.useCallback[fetchActivities]"]);
                                        }
                                        if (match) {
                                            return {
                                                ...act,
                                                customer: {
                                                    ...act.customer,
                                                    customer_name: match.customer_name || "Unknown"
                                                },
                                                phone_no: match.phone_no
                                            };
                                        }
                                        return act;
                                    }
                                }["useActivityData.useCallback[fetchActivities]"])
                        }["useActivityData.useCallback[fetchActivities]"]);
                    }
                } catch (err) {
                    console.error("Hydration failed:", err);
                }
                // Calculate Stats
                const totalTalkTimeSec = combined.reduce({
                    "useActivityData.useCallback[fetchActivities].totalTalkTimeSec": (acc, curr)=>acc + (curr.duration || 0)
                }["useActivityData.useCallback[fetchActivities].totalTalkTimeSec"], 0);
                const contactableCount = combined.filter({
                    "useActivityData.useCallback[fetchActivities]": (cl)=>cl.is_connected === 'contactable'
                }["useActivityData.useCallback[fetchActivities]"]).length;
                const lastCall = combined.length > 0 ? new Date(combined[0].created_at).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                }) : "N/A";
                setStats({
                    totalDials: combined.length,
                    totalTalkTime: totalTalkTimeSec,
                    contactable: contactableCount,
                    uncontactable: combined.length - contactableCount,
                    lastCallTime: lastCall,
                    idleFrom: combined.length > 0 ? lastCall : "N/A"
                });
            } catch (err) {
                if (err.name !== 'AbortError') {
                    console.error("Error fetching activities:", err);
                    setError("Failed to load activities");
                }
            } finally{
                if (!isBackground) setLoading(false);
            }
        }
    }["useActivityData.useCallback[fetchActivities]"], [
        selectedDate,
        user,
        mounted
    ]);
    // Fetch Mobile History
    const fetchMobileHistory = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useActivityData.useCallback[fetchMobileHistory]": async (isBackground = false)=>{
            if (!mounted || !user) return;
            try {
                if (!isBackground) setLoading(true);
                // Parse Date Range
                const localDate = new Date(selectedDate + 'T00:00:00');
                const startOfDay = new Date(localDate.getFullYear(), localDate.getMonth(), localDate.getDate(), 0, 0, 0, 0).toISOString();
                const endOfDay = new Date(localDate.getFullYear(), localDate.getMonth(), localDate.getDate(), 23, 59, 59, 999).toISOString();
                let query = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["supabase"].from('call_history').select('*').gte('timestamp', startOfDay).lte('timestamp', endOfDay).order('timestamp', {
                    ascending: false
                });
                // Filter by Employee ID (Security)
                if (user.isClient) {
                    if (user.designation === 'agent' || !user.designation) {
                        if (user.employeeId) query = query.eq('employee_id', user.employeeId);
                        else if (user.uid) query = query.eq('id', '00000000-0000-0000-0000-000000000000'); // Fail safe
                    } else if (user.organization_id && [
                        'ceo',
                        'developer'
                    ].includes(user.designation || '')) {
                        // Admin sees all? call_history has employee_id. We might need to join user_profiles to check org?
                        // call_history doesn't have org_id. It has employee_id.
                        // We'd need to fetch all employee_ids for the org first.
                        const { data: orgUsers } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["supabase"].from('user_profiles').select('employee_id').eq('organization_id', user.organization_id);
                        if (orgUsers) {
                            const empIds = orgUsers.map({
                                "useActivityData.useCallback[fetchMobileHistory].empIds": (u)=>u.employee_id
                            }["useActivityData.useCallback[fetchMobileHistory].empIds"]).filter(Boolean);
                            if (empIds.length > 0) query = query.in('employee_id', empIds);
                        }
                    }
                }
                const { data, error } = await query;
                if (error) throw error;
                let finalUniqueData = [];
                if (data && data.length > 0) {
                    const empIds = [
                        ...new Set(data.map({
                            "useActivityData.useCallback[fetchMobileHistory]": (d)=>d.employee_id
                        }["useActivityData.useCallback[fetchMobileHistory]"]).filter(Boolean))
                    ];
                    let profileMap = {};
                    if (empIds.length > 0) {
                        const { data: profiles } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["supabase"].from('user_profiles').select('employee_id, user_name').in('employee_id', empIds);
                        profileMap = Object.fromEntries((profiles || []).map({
                            "useActivityData.useCallback[fetchMobileHistory]": (p)=>[
                                    p.employee_id,
                                    p.user_name
                                ]
                        }["useActivityData.useCallback[fetchMobileHistory]"]));
                    }
                    const hydratedData = data.map({
                        "useActivityData.useCallback[fetchMobileHistory].hydratedData": (d)=>({
                                ...d,
                                user_name: profileMap[d.employee_id] || "Unknown"
                            })
                    }["useActivityData.useCallback[fetchMobileHistory].hydratedData"]);
                    // DEDUPLICATION LOGIC: Filter by Number + Timestamp + Duration
                    const seenKeys = new Set();
                    finalUniqueData = hydratedData.filter({
                        "useActivityData.useCallback[fetchMobileHistory]": (item)=>{
                            const timestamp = new Date(item.timestamp);
                            const timeStr = timestamp.toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit'
                            });
                            const dateStr = timestamp.toLocaleDateString();
                            const key = `${item.number}-${item.employee_id}-${dateStr}-${timeStr}-${item.duration}`;
                            if (!seenKeys.has(key)) {
                                seenKeys.add(key);
                                return true;
                            }
                            return false;
                        }
                    }["useActivityData.useCallback[fetchMobileHistory]"]);
                }
                setMobileActivities(finalUniqueData);
                // Update Stats from Mobile History if Source is Mobile
                if (source === 'mobile') {
                    const totalTalkTimeSec = finalUniqueData.reduce({
                        "useActivityData.useCallback[fetchMobileHistory].totalTalkTimeSec": (acc, curr)=>acc + (curr.duration || 0)
                    }["useActivityData.useCallback[fetchMobileHistory].totalTalkTimeSec"], 0);
                    const lastCall = finalUniqueData.length > 0 ? new Date(finalUniqueData[0].timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                    }) : "N/A";
                    setStats({
                        totalDials: finalUniqueData.length,
                        totalTalkTime: totalTalkTimeSec,
                        contactable: 0,
                        uncontactable: 0,
                        lastCallTime: lastCall,
                        idleFrom: lastCall
                    });
                }
            } catch (e) {
                console.error("Error fetching mobile history:", e);
            } finally{
                if (!isBackground) setLoading(false);
            }
        }
    }["useActivityData.useCallback[fetchMobileHistory]"], [
        selectedDate,
        user,
        mounted,
        source
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useActivityData.useEffect": ()=>{
            if (source === 'mobile') {
                fetchMobileHistory();
            } else {
                fetchActivities();
            }
        }
    }["useActivityData.useEffect"], [
        source,
        fetchActivities,
        fetchMobileHistory
    ]);
    const filteredActivities = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "useActivityData.useMemo[filteredActivities]": ()=>{
            const targetData = source === 'mobile' ? mobileActivities : activities;
            const query = searchQuery.toLowerCase();
            if (!query) return targetData;
            // Check if query looks like a phone number
            const cleanQuery = query.replace(/\D/g, '');
            const isPhoneSearch = cleanQuery.length > 3;
            const queryHash = isPhoneSearch ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$phoneUtils$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["computePhoneHash"])(cleanQuery) : null;
            return targetData.filter({
                "useActivityData.useMemo[filteredActivities]": (a)=>{
                    // 1. Phone Search Strategy
                    if (isPhoneSearch) {
                        // A. Exact Hash Match
                        if (a.phone_search_hash && a.phone_search_hash === queryHash) return true;
                        // B. Decryption / Plain Match
                        if (a.phone_no || a.number) {
                            const phoneField = a.phone_no || a.number;
                            const plainPhone = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$phoneUtils$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["decryptPhone"])(phoneField);
                            if (plainPhone.includes(cleanQuery)) return true;
                        }
                    }
                    // 2. Standard Text Search
                    // Mobile History Fields: name, number, employee_id, device_id
                    if (source === 'mobile') {
                        return a.name && a.name.toLowerCase().includes(query) || a.number && a.number.toLowerCase().includes(query) || a.employee_id && a.employee_id.toLowerCase().includes(query) || a.device_id && a.device_id.toLowerCase().includes(query);
                    }
                    // CRM Fields
                    return a.agent?.user_name?.toLowerCase().includes(query) || a.customer?.customer_name?.toLowerCase().includes(query) || a.disposition && a.disposition.toLowerCase().includes(query) || a.sub_disposition && a.sub_disposition.toLowerCase().includes(query) || a.agent?.employee_id?.toLowerCase().includes(query) || a.campaign?.name?.toLowerCase().includes(query) || a.notes && a.notes.toLowerCase().includes(query);
                }
            }["useActivityData.useMemo[filteredActivities]"]);
        }
    }["useActivityData.useMemo[filteredActivities]"], [
        activities,
        mobileActivities,
        searchQuery,
        source
    ]);
    // Utility formatters memoized or optimized
    const formatSeconds = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useActivityData.useCallback[formatSeconds]": (seconds)=>{
            const hrs = Math.floor(seconds / 3600);
            const mins = Math.floor(seconds % 3600 / 60);
            const secs = seconds % 60;
            return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
    }["useActivityData.useCallback[formatSeconds]"], []);
    const formatTime = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useActivityData.useCallback[formatTime]": (dateString)=>{
            return new Date(dateString).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });
        }
    }["useActivityData.useCallback[formatTime]"], []);
    const formatDisplayDate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useActivityData.useCallback[formatDisplayDate]": (dateString)=>{
            if (!dateString) return "";
            const date = new Date(dateString);
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();
            return `${day}/${month}/${year}`;
        }
    }["useActivityData.useCallback[formatDisplayDate]"], []);
    return {
        loading,
        error,
        activities,
        filteredActivities,
        stats,
        selectedDate,
        setSelectedDate,
        searchQuery,
        setSearchQuery,
        fetchActivities,
        formatSeconds,
        formatTime,
        formatDisplayDate,
        source,
        setSource
    };
}
_s(useActivityData, "kSzhG07g07UCtX8LoP5GVWBS1+A=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$UserContext$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["useUser"]
    ];
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/pages/portal/activity.tsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Activity
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
// Removed AppLayout import as it's now handled globally in PortalContainer
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useActivityData$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/useActivityData.ts [client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
;
function Activity() {
    _s();
    const { loading, error, filteredActivities, stats, selectedDate, setSelectedDate, searchQuery, setSearchQuery, formatSeconds, formatTime, formatDisplayDate, source, setSource } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useActivityData$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["useActivityData"])();
    const [activeNav] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])("activity");
    const [showDatePicker, setShowDatePicker] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [currentMonth, setCurrentMonth] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(new Date());
    const getDaysInMonth = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "Activity.useCallback[getDaysInMonth]": (date)=>{
            const year = date.getFullYear();
            const month = date.getMonth();
            const firstDay = new Date(year, month, 1);
            const lastDay = new Date(year, month + 1, 0);
            const daysInMonth = lastDay.getDate();
            const startingDayOfWeek = firstDay.getDay();
            const days = [];
            for(let i = 0; i < startingDayOfWeek; i++){
                const prevMonthDay = new Date(year, month, -startingDayOfWeek + i + 1);
                days.push({
                    date: prevMonthDay,
                    isCurrentMonth: false
                });
            }
            for(let i = 1; i <= daysInMonth; i++){
                days.push({
                    date: new Date(year, month, i),
                    isCurrentMonth: true
                });
            }
            const remainingDays = 42 - days.length;
            for(let i = 1; i <= remainingDays; i++){
                days.push({
                    date: new Date(year, month + 1, i),
                    isCurrentMonth: false
                });
            }
            return days;
        }
    }["Activity.useCallback[getDaysInMonth]"], []);
    const formatMonthYear = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "Activity.useCallback[formatMonthYear]": (date)=>{
            return date.toLocaleDateString('en-US', {
                month: 'long',
                year: 'numeric'
            });
        }
    }["Activity.useCallback[formatMonthYear]"], []);
    const isSameDay = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "Activity.useCallback[isSameDay]": (date1, date2)=>{
            const d2 = new Date(date2);
            return date1.getDate() === d2.getDate() && date1.getMonth() === d2.getMonth() && date1.getFullYear() === d2.getFullYear();
        }
    }["Activity.useCallback[isSameDay]"], []);
    const handlePrevMonth = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "Activity.useCallback[handlePrevMonth]": ()=>{
            setCurrentMonth({
                "Activity.useCallback[handlePrevMonth]": (prev)=>new Date(prev.getFullYear(), prev.getMonth() - 1)
            }["Activity.useCallback[handlePrevMonth]"]);
        }
    }["Activity.useCallback[handlePrevMonth]"], []);
    const handleNextMonth = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "Activity.useCallback[handleNextMonth]": ()=>{
            setCurrentMonth({
                "Activity.useCallback[handleNextMonth]": (prev)=>new Date(prev.getFullYear(), prev.getMonth() + 1)
            }["Activity.useCallback[handleNextMonth]"]);
        }
    }["Activity.useCallback[handleNextMonth]"], []);
    const handleDateSelect = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "Activity.useCallback[handleDateSelect]": (date)=>{
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            setSelectedDate(`${year}-${month}-${day}`);
            setShowDatePicker(false);
        }
    }["Activity.useCallback[handleDateSelect]"], [
        setSelectedDate
    ]);
    const calendarDays = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "Activity.useMemo[calendarDays]": ()=>getDaysInMonth(currentMonth)
    }["Activity.useMemo[calendarDays]"], [
        currentMonth,
        getDaysInMonth
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "container mx-auto px-3 sm:px-4 md:px-6 py-6 sm:py-8 pb-20 sm:pb-24 lg:pb-8 max-w-7xl",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-6 sm:space-y-8",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mb-6 flex items-start justify-between",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                    className: "text-xl sm:text-2xl md:text-3xl font-bold mb-2",
                                    style: {
                                        color: "#263238",
                                        fontFamily: "'Poppins', sans-serif"
                                    },
                                    children: "Activity"
                                }, void 0, false, {
                                    fileName: "[project]/pages/portal/activity.tsx",
                                    lineNumber: 90,
                                    columnNumber: 19
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-sm sm:text-base",
                                    style: {
                                        color: "#787E9D",
                                        fontFamily: "'Roboto', sans-serif"
                                    },
                                    children: "Track your calling activities and performance metrics"
                                }, void 0, false, {
                                    fileName: "[project]/pages/portal/activity.tsx",
                                    lineNumber: 99,
                                    columnNumber: 19
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/pages/portal/activity.tsx",
                            lineNumber: 89,
                            columnNumber: 17
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/pages/portal/activity.tsx",
                        lineNumber: 88,
                        columnNumber: 15
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "relative overflow-hidden rounded-2xl p-4 sm:p-5 transition-shadow duration-200 flex flex-col hover:shadow-md",
                                style: {
                                    backgroundColor: "white"
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "absolute inset-0",
                                        style: {
                                            background: "radial-gradient(circle at top right, rgba(75, 51, 232, 0.08), transparent 60%)"
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/pages/portal/activity.tsx",
                                        lineNumber: 116,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "absolute -bottom-16 -right-16 h-48 w-48 rounded-full bg-purple-100/30 blur-2xl"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/portal/activity.tsx",
                                        lineNumber: 123,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "absolute top-0 left-0 w-32 h-32 rounded-full bg-purple-200/20 blur-xl"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/portal/activity.tsx",
                                        lineNumber: 124,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "absolute top-8 right-8 w-16 h-16 rounded-full bg-purple-300/15 blur-lg"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/portal/activity.tsx",
                                        lineNumber: 125,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "absolute -right-2 -bottom-2 opacity-5",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                            className: "fi flex fi-rr-phone-call text-5xl sm:text-6xl",
                                            style: {
                                                color: "#4b33e8"
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/pages/portal/activity.tsx",
                                            lineNumber: 127,
                                            columnNumber: 21
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/pages/portal/activity.tsx",
                                        lineNumber: 126,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "absolute inset-0 opacity-[0.03]",
                                        style: {
                                            backgroundImage: "radial-gradient(circle, #4b33e8 1px, transparent 1px)",
                                            backgroundSize: "20px 20px"
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/pages/portal/activity.tsx",
                                        lineNumber: 132,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "relative flex flex-col h-full z-10",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-start justify-between mb-auto",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-xs sm:text-sm font-medium",
                                                        style: {
                                                            color: "#787E9D",
                                                            fontFamily: "'Roboto', sans-serif"
                                                        },
                                                        children: "Total Dials"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/activity.tsx",
                                                        lineNumber: 142,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl",
                                                        style: {
                                                            backgroundColor: "transparent"
                                                        },
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                            className: "fi flex fi-rr-phone-call text-lg sm:text-xl",
                                                            style: {
                                                                color: "#4b33e8"
                                                            }
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/activity.tsx",
                                                            lineNumber: 157,
                                                            columnNumber: 25
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/activity.tsx",
                                                        lineNumber: 151,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/pages/portal/activity.tsx",
                                                lineNumber: 141,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "mt-auto",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-3xl sm:text-4xl font-semibold",
                                                        style: {
                                                            color: "#263238",
                                                            fontFamily: "'Poppins', sans-serif"
                                                        },
                                                        children: stats.totalDials
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/activity.tsx",
                                                        lineNumber: 164,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-xs sm:text-sm mt-1",
                                                        style: {
                                                            color: "#787E9D",
                                                            fontFamily: "'Roboto', sans-serif"
                                                        },
                                                        children: "Total calls made"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/activity.tsx",
                                                        lineNumber: 173,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/pages/portal/activity.tsx",
                                                lineNumber: 163,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/portal/activity.tsx",
                                        lineNumber: 140,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/portal/activity.tsx",
                                lineNumber: 112,
                                columnNumber: 17
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "relative overflow-hidden rounded-2xl p-4 sm:p-5 transition-shadow duration-200 flex flex-col hover:shadow-md",
                                style: {
                                    backgroundColor: "white"
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "absolute inset-0",
                                        style: {
                                            background: "radial-gradient(circle at top right, rgba(16, 185, 129, 0.08), transparent 60%)"
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/pages/portal/activity.tsx",
                                        lineNumber: 190,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "absolute -bottom-16 -right-16 h-48 w-48 rounded-full bg-green-100/30 blur-2xl"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/portal/activity.tsx",
                                        lineNumber: 197,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "absolute top-0 left-0 w-32 h-32 rounded-full bg-green-200/20 blur-xl"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/portal/activity.tsx",
                                        lineNumber: 198,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "absolute top-8 right-8 w-16 h-16 rounded-full bg-green-300/15 blur-lg"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/portal/activity.tsx",
                                        lineNumber: 199,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "absolute -right-2 -bottom-2 opacity-5",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                            className: "fi flex fi-rr-clock text-5xl sm:text-6xl",
                                            style: {
                                                color: "#10b981"
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/pages/portal/activity.tsx",
                                            lineNumber: 201,
                                            columnNumber: 21
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/pages/portal/activity.tsx",
                                        lineNumber: 200,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "absolute inset-0 opacity-[0.03]",
                                        style: {
                                            backgroundImage: "radial-gradient(circle, #10b981 1px, transparent 1px)",
                                            backgroundSize: "20px 20px"
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/pages/portal/activity.tsx",
                                        lineNumber: 206,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "relative flex flex-col h-full z-10",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-start justify-between mb-auto",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-xs sm:text-sm font-medium",
                                                        style: {
                                                            color: "#787E9D",
                                                            fontFamily: "'Roboto', sans-serif"
                                                        },
                                                        children: "Total Talk Time"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/activity.tsx",
                                                        lineNumber: 216,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl",
                                                        style: {
                                                            backgroundColor: "transparent"
                                                        },
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                            className: "fi flex fi-rr-clock text-lg sm:text-xl",
                                                            style: {
                                                                color: "#10b981"
                                                            }
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/activity.tsx",
                                                            lineNumber: 231,
                                                            columnNumber: 25
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/activity.tsx",
                                                        lineNumber: 225,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/pages/portal/activity.tsx",
                                                lineNumber: 215,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "mt-auto",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-3xl sm:text-4xl font-semibold",
                                                        style: {
                                                            color: "#263238",
                                                            fontFamily: "'Poppins', sans-serif"
                                                        },
                                                        children: formatSeconds(stats.totalTalkTime).substring(0, 5)
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/activity.tsx",
                                                        lineNumber: 238,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-xs sm:text-sm mt-1",
                                                        style: {
                                                            color: "#787E9D",
                                                            fontFamily: "'Roboto', sans-serif"
                                                        },
                                                        children: "HH:MM"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/activity.tsx",
                                                        lineNumber: 247,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/pages/portal/activity.tsx",
                                                lineNumber: 237,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/portal/activity.tsx",
                                        lineNumber: 214,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/portal/activity.tsx",
                                lineNumber: 186,
                                columnNumber: 17
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "relative p-0 flex flex-col overflow-hidden",
                                style: {
                                    backgroundColor: "transparent",
                                    border: "none"
                                },
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "grid grid-cols-2 gap-3 h-full",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "relative overflow-hidden rounded-xl p-3 transition-shadow duration-200 hover:shadow-md",
                                            style: {
                                                background: "linear-gradient(135deg, #10b981, #059669)"
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "absolute inset-0",
                                                    style: {
                                                        background: "radial-gradient(circle at top left, rgba(255,255,255,0.15), transparent 50%)"
                                                    }
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/activity.tsx",
                                                    lineNumber: 271,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "absolute -bottom-12 -right-12 h-32 w-32 rounded-full bg-white/10 blur-2xl"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/activity.tsx",
                                                    lineNumber: 278,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "absolute top-2 left-2 w-16 h-16 rounded-full bg-white/8 blur-lg"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/activity.tsx",
                                                    lineNumber: 279,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "absolute -right-1 -bottom-1 opacity-10",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                        className: "fi flex fi-rr-check-circle text-3xl text-white"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/activity.tsx",
                                                        lineNumber: 281,
                                                        columnNumber: 25
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/activity.tsx",
                                                    lineNumber: 280,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "absolute inset-0 opacity-[0.08]",
                                                    style: {
                                                        backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.4) 1px, transparent 1px)",
                                                        backgroundSize: "15px 15px"
                                                    }
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/activity.tsx",
                                                    lineNumber: 283,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "relative flex flex-col justify-between h-full z-10",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-start justify-end mb-1",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                                className: "fi flex fi-rr-check-circle text-base sm:text-lg",
                                                                style: {
                                                                    color: "#ffffff"
                                                                }
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/activity.tsx",
                                                                lineNumber: 293,
                                                                columnNumber: 27
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/activity.tsx",
                                                            lineNumber: 292,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-xl sm:text-2xl font-bold mb-1",
                                                                    style: {
                                                                        color: "#ffffff",
                                                                        fontFamily: "'Poppins', sans-serif"
                                                                    },
                                                                    children: stats.contactable
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/activity.tsx",
                                                                    lineNumber: 299,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-[10px] sm:text-xs font-medium",
                                                                    style: {
                                                                        color: "#ffffff",
                                                                        fontFamily: "'Roboto', sans-serif"
                                                                    },
                                                                    children: "Contactable"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/activity.tsx",
                                                                    lineNumber: 308,
                                                                    columnNumber: 27
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/pages/portal/activity.tsx",
                                                            lineNumber: 298,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/pages/portal/activity.tsx",
                                                    lineNumber: 291,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/portal/activity.tsx",
                                            lineNumber: 265,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "relative overflow-hidden rounded-xl p-3 transition-shadow duration-200 hover:shadow-md",
                                            style: {
                                                background: "linear-gradient(135deg, #ef4444, #dc2626)"
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "absolute inset-0",
                                                    style: {
                                                        background: "radial-gradient(circle at top left, rgba(255,255,255,0.15), transparent 50%)"
                                                    }
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/activity.tsx",
                                                    lineNumber: 327,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "absolute -bottom-12 -right-12 h-32 w-32 rounded-full bg-white/10 blur-2xl"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/activity.tsx",
                                                    lineNumber: 334,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "absolute top-2 left-2 w-16 h-16 rounded-full bg-white/8 blur-lg"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/activity.tsx",
                                                    lineNumber: 335,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "absolute -right-1 -bottom-1 opacity-10",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                        className: "fi flex fi-rr-cross-circle text-3xl text-white"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/activity.tsx",
                                                        lineNumber: 337,
                                                        columnNumber: 25
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/activity.tsx",
                                                    lineNumber: 336,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "absolute inset-0 opacity-[0.08]",
                                                    style: {
                                                        backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.4) 1px, transparent 1px)",
                                                        backgroundSize: "15px 15px"
                                                    }
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/activity.tsx",
                                                    lineNumber: 339,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "relative flex flex-col justify-between h-full z-10",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-start justify-end mb-1",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                                className: "fi flex fi-rr-cross-circle text-base sm:text-lg",
                                                                style: {
                                                                    color: "#ffffff"
                                                                }
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/activity.tsx",
                                                                lineNumber: 349,
                                                                columnNumber: 27
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/activity.tsx",
                                                            lineNumber: 348,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-xl sm:text-2xl font-bold mb-1",
                                                                    style: {
                                                                        color: "#ffffff",
                                                                        fontFamily: "'Poppins', sans-serif"
                                                                    },
                                                                    children: stats.uncontactable
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/activity.tsx",
                                                                    lineNumber: 355,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-[10px] sm:text-xs font-medium",
                                                                    style: {
                                                                        color: "#ffffff",
                                                                        fontFamily: "'Roboto', sans-serif"
                                                                    },
                                                                    children: "Uncontactable"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/activity.tsx",
                                                                    lineNumber: 364,
                                                                    columnNumber: 27
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/pages/portal/activity.tsx",
                                                            lineNumber: 354,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/pages/portal/activity.tsx",
                                                    lineNumber: 347,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/portal/activity.tsx",
                                            lineNumber: 321,
                                            columnNumber: 21
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/portal/activity.tsx",
                                    lineNumber: 264,
                                    columnNumber: 19
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/pages/portal/activity.tsx",
                                lineNumber: 260,
                                columnNumber: 17
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "relative p-0 flex flex-col overflow-hidden",
                                style: {
                                    backgroundColor: "transparent",
                                    border: "none"
                                },
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "grid grid-cols-2 gap-3 h-full",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "relative overflow-hidden rounded-xl p-3 transition-shadow duration-200 hover:shadow-md",
                                            style: {
                                                background: "linear-gradient(135deg, #f59e0b, #d97706)"
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "absolute inset-0",
                                                    style: {
                                                        background: "radial-gradient(circle at top left, rgba(255,255,255,0.15), transparent 50%)"
                                                    }
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/activity.tsx",
                                                    lineNumber: 390,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "absolute -bottom-12 -right-12 h-32 w-32 rounded-full bg-white/10 blur-2xl"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/activity.tsx",
                                                    lineNumber: 397,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "absolute top-2 left-2 w-16 h-16 rounded-full bg-white/8 blur-lg"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/activity.tsx",
                                                    lineNumber: 398,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "absolute -right-1 -bottom-1 opacity-10",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                        className: "fi flex fi-rr-time-forward text-3xl text-white"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/activity.tsx",
                                                        lineNumber: 400,
                                                        columnNumber: 25
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/activity.tsx",
                                                    lineNumber: 399,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "absolute inset-0 opacity-[0.08]",
                                                    style: {
                                                        backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.4) 1px, transparent 1px)",
                                                        backgroundSize: "15px 15px"
                                                    }
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/activity.tsx",
                                                    lineNumber: 402,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "relative flex flex-col justify-between h-full z-10",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-start justify-end mb-1",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                                className: "fi flex fi-rr-time-forward text-base sm:text-lg",
                                                                style: {
                                                                    color: "#ffffff"
                                                                }
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/activity.tsx",
                                                                lineNumber: 412,
                                                                columnNumber: 27
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/activity.tsx",
                                                            lineNumber: 411,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-xs sm:text-sm font-bold mb-1",
                                                                    style: {
                                                                        color: "#ffffff",
                                                                        fontFamily: "'Poppins', sans-serif"
                                                                    },
                                                                    children: stats.idleFrom
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/activity.tsx",
                                                                    lineNumber: 418,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-[10px] sm:text-xs font-medium",
                                                                    style: {
                                                                        color: "#ffffff",
                                                                        fontFamily: "'Roboto', sans-serif"
                                                                    },
                                                                    children: "Idle From"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/activity.tsx",
                                                                    lineNumber: 427,
                                                                    columnNumber: 27
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/pages/portal/activity.tsx",
                                                            lineNumber: 417,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/pages/portal/activity.tsx",
                                                    lineNumber: 410,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/portal/activity.tsx",
                                            lineNumber: 384,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "relative overflow-hidden rounded-xl p-3 transition-shadow duration-200 hover:shadow-md",
                                            style: {
                                                background: "linear-gradient(135deg, #3b82f6, #2563eb)"
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "absolute inset-0",
                                                    style: {
                                                        background: "radial-gradient(circle at top left, rgba(255,255,255,0.15), transparent 50%)"
                                                    }
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/activity.tsx",
                                                    lineNumber: 446,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "absolute -bottom-12 -right-12 h-32 w-32 rounded-full bg-white/10 blur-2xl"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/activity.tsx",
                                                    lineNumber: 453,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "absolute top-2 left-2 w-16 h-16 rounded-full bg-white/8 blur-lg"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/activity.tsx",
                                                    lineNumber: 454,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "absolute -right-1 -bottom-1 opacity-10",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                        className: "fi flex fi-rr-phone-pause text-3xl text-white"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/activity.tsx",
                                                        lineNumber: 456,
                                                        columnNumber: 25
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/activity.tsx",
                                                    lineNumber: 455,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "absolute inset-0 opacity-[0.08]",
                                                    style: {
                                                        backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.4) 1px, transparent 1px)",
                                                        backgroundSize: "15px 15px"
                                                    }
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/activity.tsx",
                                                    lineNumber: 458,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "relative flex flex-col justify-between h-full z-10",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-start justify-end mb-1",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                                className: "fi flex fi-rr-phone-pause text-base sm:text-lg",
                                                                style: {
                                                                    color: "#ffffff"
                                                                }
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/activity.tsx",
                                                                lineNumber: 468,
                                                                columnNumber: 27
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/activity.tsx",
                                                            lineNumber: 467,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-xs sm:text-sm font-bold mb-1",
                                                                    style: {
                                                                        color: "#ffffff",
                                                                        fontFamily: "'Poppins', sans-serif"
                                                                    },
                                                                    children: stats.lastCallTime !== "N/A" ? `${formatDisplayDate(selectedDate)} / ${stats.lastCallTime}` : "N/A"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/activity.tsx",
                                                                    lineNumber: 474,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-[10px] sm:text-xs font-medium",
                                                                    style: {
                                                                        color: "#ffffff",
                                                                        fontFamily: "'Roboto', sans-serif"
                                                                    },
                                                                    children: "Last Call At"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/activity.tsx",
                                                                    lineNumber: 483,
                                                                    columnNumber: 27
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/pages/portal/activity.tsx",
                                                            lineNumber: 473,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/pages/portal/activity.tsx",
                                                    lineNumber: 466,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/portal/activity.tsx",
                                            lineNumber: 440,
                                            columnNumber: 21
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/portal/activity.tsx",
                                    lineNumber: 383,
                                    columnNumber: 19
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/pages/portal/activity.tsx",
                                lineNumber: 379,
                                columnNumber: 17
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/pages/portal/activity.tsx",
                        lineNumber: 111,
                        columnNumber: 15
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-8",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "bg-white rounded-xl border border-gray-200 p-4 sm:p-6",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "mb-4 sm:hidden",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center justify-between mb-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                    className: "text-lg font-bold",
                                                    style: {
                                                        color: "#263238",
                                                        fontFamily: "'Poppins', sans-serif"
                                                    },
                                                    children: "Activity Details"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/activity.tsx",
                                                    lineNumber: 503,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "relative",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            onClick: ()=>setShowDatePicker(!showDatePicker),
                                                            className: "px-3 py-1.5 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-gray-700 hover:border-purple-400 transition-colors flex items-center gap-2",
                                                            style: {
                                                                fontFamily: "'Roboto', sans-serif"
                                                            },
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                                    className: "fi flex fi-rr-calendar text-xs",
                                                                    style: {
                                                                        color: "#4b33e8"
                                                                    }
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/activity.tsx",
                                                                    lineNumber: 518,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    children: formatDisplayDate(selectedDate)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/activity.tsx",
                                                                    lineNumber: 519,
                                                                    columnNumber: 27
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/pages/portal/activity.tsx",
                                                            lineNumber: 513,
                                                            columnNumber: 25
                                                        }, this),
                                                        showDatePicker && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "absolute right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl p-4 z-50 w-72",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "flex items-center justify-between mb-4",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                            onClick: handlePrevMonth,
                                                                            className: "p-1 hover:bg-gray-100 rounded-full transition-colors",
                                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                                                className: "fi flex fi-rr-angle-left text-sm",
                                                                                style: {
                                                                                    color: "#263238"
                                                                                }
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/pages/portal/activity.tsx",
                                                                                lineNumber: 528,
                                                                                columnNumber: 33
                                                                            }, this)
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/pages/portal/activity.tsx",
                                                                            lineNumber: 524,
                                                                            columnNumber: 31
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "text-sm font-semibold",
                                                                            style: {
                                                                                color: "#263238",
                                                                                fontFamily: "'Poppins', sans-serif"
                                                                            },
                                                                            children: formatMonthYear(currentMonth)
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/pages/portal/activity.tsx",
                                                                            lineNumber: 530,
                                                                            columnNumber: 31
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                            onClick: handleNextMonth,
                                                                            className: "p-1 hover:bg-gray-100 rounded-full transition-colors",
                                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                                                className: "fi flex fi-rr-angle-right text-sm",
                                                                                style: {
                                                                                    color: "#263238"
                                                                                }
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/pages/portal/activity.tsx",
                                                                                lineNumber: 537,
                                                                                columnNumber: 33
                                                                            }, this)
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/pages/portal/activity.tsx",
                                                                            lineNumber: 533,
                                                                            columnNumber: 31
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/pages/portal/activity.tsx",
                                                                    lineNumber: 523,
                                                                    columnNumber: 29
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "grid grid-cols-7 gap-1 mb-2",
                                                                    children: [
                                                                        'Su',
                                                                        'Mo',
                                                                        'Tu',
                                                                        'We',
                                                                        'Th',
                                                                        'Fr',
                                                                        'Sa'
                                                                    ].map((day)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "text-center text-xs font-medium py-2",
                                                                            style: {
                                                                                color: "#787E9D",
                                                                                fontFamily: "'Roboto', sans-serif"
                                                                            },
                                                                            children: day
                                                                        }, day, false, {
                                                                            fileName: "[project]/pages/portal/activity.tsx",
                                                                            lineNumber: 542,
                                                                            columnNumber: 33
                                                                        }, this))
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/activity.tsx",
                                                                    lineNumber: 540,
                                                                    columnNumber: 29
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "grid grid-cols-7 gap-1",
                                                                    children: calendarDays.map((day, index)=>{
                                                                        const isSelected = isSameDay(day.date, selectedDate);
                                                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                            onClick: ()=>handleDateSelect(day.date),
                                                                            className: `text-xs py-2 rounded-lg transition-all ${isSelected ? 'text-white font-semibold' : day.isCurrentMonth ? 'text-gray-700 hover:bg-gray-100' : 'text-gray-400'}`,
                                                                            style: {
                                                                                backgroundColor: isSelected ? '#4b33e8' : 'transparent',
                                                                                fontFamily: "'Roboto', sans-serif"
                                                                            },
                                                                            children: day.date.getDate()
                                                                        }, index, false, {
                                                                            fileName: "[project]/pages/portal/activity.tsx",
                                                                            lineNumber: 551,
                                                                            columnNumber: 35
                                                                        }, this);
                                                                    })
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/activity.tsx",
                                                                    lineNumber: 547,
                                                                    columnNumber: 29
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/pages/portal/activity.tsx",
                                                            lineNumber: 522,
                                                            columnNumber: 27
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/pages/portal/activity.tsx",
                                                    lineNumber: 512,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/portal/activity.tsx",
                                            lineNumber: 502,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-xs mb-3",
                                            style: {
                                                color: "#787E9D",
                                                fontFamily: "'Roboto', sans-serif"
                                            },
                                            children: "Detailed view of all employee activities"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/portal/activity.tsx",
                                            lineNumber: 576,
                                            columnNumber: 22
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex bg-gray-100 p-1 rounded-lg mb-4 w-full sm:w-auto self-start",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>setSource('crm'),
                                                    className: `flex-1 sm:flex-none px-4 py-1.5 text-xs font-semibold rounded-md transition-all ${source === 'crm' ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`,
                                                    style: {
                                                        fontFamily: "'Poppins', sans-serif"
                                                    },
                                                    children: "CRM Activity"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/activity.tsx",
                                                    lineNumber: 588,
                                                    columnNumber: 25
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>setSource('mobile'),
                                                    className: `flex-1 sm:flex-none px-4 py-1.5 text-xs font-semibold rounded-md transition-all ${source === 'mobile' ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`,
                                                    style: {
                                                        fontFamily: "'Poppins', sans-serif"
                                                    },
                                                    children: "Mobile History"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/activity.tsx",
                                                    lineNumber: 599,
                                                    columnNumber: 25
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/portal/activity.tsx",
                                            lineNumber: 587,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "mb-3 flex items-center gap-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "relative flex-1",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                            className: "fi flex  fi-rr-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xs"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/activity.tsx",
                                                            lineNumber: 614,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                            type: "text",
                                                            placeholder: "Search activities...",
                                                            value: searchQuery,
                                                            onChange: (e)=>setSearchQuery(e.target.value),
                                                            className: "w-full pl-9 h-9 pr-4 py-2 text-xs border border-gray-300 text-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent",
                                                            style: {
                                                                fontFamily: "'Roboto', sans-serif"
                                                            }
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/activity.tsx",
                                                            lineNumber: 615,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/pages/portal/activity.tsx",
                                                    lineNumber: 613,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    className: "h-9 px-3 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors flex items-center justify-center",
                                                    style: {
                                                        fontFamily: "'Roboto', sans-serif"
                                                    },
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                        className: "fi flex fi-rr-filter text-sm text-gray-600"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/activity.tsx",
                                                        lineNumber: 628,
                                                        columnNumber: 25
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/activity.tsx",
                                                    lineNumber: 624,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/portal/activity.tsx",
                                            lineNumber: 612,
                                            columnNumber: 21
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/portal/activity.tsx",
                                    lineNumber: 501,
                                    columnNumber: 19
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "hidden sm:flex sm:items-center sm:justify-between mb-6",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                    className: "text-xl font-bold mb-1",
                                                    style: {
                                                        color: "#263238",
                                                        fontFamily: "'Poppins', sans-serif"
                                                    },
                                                    children: "Activity Details"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/activity.tsx",
                                                    lineNumber: 636,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-sm",
                                                    style: {
                                                        color: "#787E9D",
                                                        fontFamily: "'Roboto', sans-serif"
                                                    },
                                                    children: "Detailed view of all employee activities"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/activity.tsx",
                                                    lineNumber: 645,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/portal/activity.tsx",
                                            lineNumber: 635,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex bg-gray-100 p-1 rounded-lg",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>setSource('crm'),
                                                    className: `px-4 py-1.5 text-xs font-semibold rounded-md transition-all ${source === 'crm' ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`,
                                                    style: {
                                                        fontFamily: "'Poppins', sans-serif"
                                                    },
                                                    children: "CRM Activity"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/activity.tsx",
                                                    lineNumber: 658,
                                                    columnNumber: 25
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>setSource('mobile'),
                                                    className: `px-4 py-1.5 text-xs font-semibold rounded-md transition-all ${source === 'mobile' ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`,
                                                    style: {
                                                        fontFamily: "'Poppins', sans-serif"
                                                    },
                                                    children: "Mobile History"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/activity.tsx",
                                                    lineNumber: 669,
                                                    columnNumber: 25
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/portal/activity.tsx",
                                            lineNumber: 657,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center gap-3",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "relative w-64",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                            className: "fi flex fi-rr-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/activity.tsx",
                                                            lineNumber: 684,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                            type: "text",
                                                            placeholder: "Search activities...",
                                                            value: searchQuery,
                                                            onChange: (e)=>setSearchQuery(e.target.value),
                                                            className: "w-full pl-9 pr-4 py-2 text-sm border border-gray-300 text-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent",
                                                            style: {
                                                                fontFamily: "'Roboto', sans-serif"
                                                            }
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/activity.tsx",
                                                            lineNumber: 685,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/pages/portal/activity.tsx",
                                                    lineNumber: 683,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    className: "h-10 px-3 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors flex items-center justify-center",
                                                    style: {
                                                        fontFamily: "'Roboto', sans-serif"
                                                    },
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                        className: "fi flex fi-rr-filter text-sm text-gray-600"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/activity.tsx",
                                                        lineNumber: 698,
                                                        columnNumber: 25
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/activity.tsx",
                                                    lineNumber: 694,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "relative",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            onClick: ()=>setShowDatePicker(!showDatePicker),
                                                            className: "pl-5 pr-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-gray-700 hover:border-purple-400 transition-colors flex items-center gap-2 w-38",
                                                            style: {
                                                                fontFamily: "'Roboto', sans-serif"
                                                            },
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                                    className: "fi flex fi-rr-calendar absolute top-1/2 transform -translate-y-1/2 text-sm",
                                                                    style: {
                                                                        color: "#4b33e8"
                                                                    }
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/activity.tsx",
                                                                    lineNumber: 706,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "ml-6",
                                                                    children: formatDisplayDate(selectedDate)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/activity.tsx",
                                                                    lineNumber: 707,
                                                                    columnNumber: 27
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/pages/portal/activity.tsx",
                                                            lineNumber: 701,
                                                            columnNumber: 25
                                                        }, this),
                                                        showDatePicker && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "absolute right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl p-4 z-50 w-80",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "flex items-center justify-between mb-4",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                            onClick: handlePrevMonth,
                                                                            className: "p-1.5 hover:bg-gray-100 rounded-full transition-colors",
                                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                                                className: "fi flex fi-rr-angle-left text-base",
                                                                                style: {
                                                                                    color: "#263238"
                                                                                }
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/pages/portal/activity.tsx",
                                                                                lineNumber: 716,
                                                                                columnNumber: 33
                                                                            }, this)
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/pages/portal/activity.tsx",
                                                                            lineNumber: 712,
                                                                            columnNumber: 31
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "text-sm font-semibold",
                                                                            style: {
                                                                                color: "#263238",
                                                                                fontFamily: "'Poppins', sans-serif"
                                                                            },
                                                                            children: formatMonthYear(currentMonth)
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/pages/portal/activity.tsx",
                                                                            lineNumber: 718,
                                                                            columnNumber: 31
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                            onClick: handleNextMonth,
                                                                            className: "p-1.5 hover:bg-gray-100 rounded-full transition-colors",
                                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                                                className: "fi flex fi-rr-angle-right text-base",
                                                                                style: {
                                                                                    color: "#263238"
                                                                                }
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/pages/portal/activity.tsx",
                                                                                lineNumber: 725,
                                                                                columnNumber: 33
                                                                            }, this)
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/pages/portal/activity.tsx",
                                                                            lineNumber: 721,
                                                                            columnNumber: 31
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/pages/portal/activity.tsx",
                                                                    lineNumber: 711,
                                                                    columnNumber: 29
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "grid grid-cols-7 gap-1 mb-2",
                                                                    children: [
                                                                        'Su',
                                                                        'Mo',
                                                                        'Tu',
                                                                        'We',
                                                                        'Th',
                                                                        'Fr',
                                                                        'Sa'
                                                                    ].map((day)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "text-center text-xs font-medium py-2",
                                                                            style: {
                                                                                color: "#787E9D",
                                                                                fontFamily: "'Roboto', sans-serif"
                                                                            },
                                                                            children: day
                                                                        }, day, false, {
                                                                            fileName: "[project]/pages/portal/activity.tsx",
                                                                            lineNumber: 730,
                                                                            columnNumber: 33
                                                                        }, this))
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/activity.tsx",
                                                                    lineNumber: 728,
                                                                    columnNumber: 29
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "grid grid-cols-7 gap-1",
                                                                    children: calendarDays.map((day, index)=>{
                                                                        const isSelected = isSameDay(day.date, selectedDate);
                                                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                            onClick: ()=>handleDateSelect(day.date),
                                                                            className: `text-sm py-2.5 rounded-lg transition-all ${isSelected ? 'text-white font-semibold' : day.isCurrentMonth ? 'text-gray-700 hover:bg-gray-100' : 'text-gray-400'}`,
                                                                            style: {
                                                                                backgroundColor: isSelected ? '#4b33e8' : 'transparent',
                                                                                fontFamily: "'Roboto', sans-serif"
                                                                            },
                                                                            children: day.date.getDate()
                                                                        }, index, false, {
                                                                            fileName: "[project]/pages/portal/activity.tsx",
                                                                            lineNumber: 739,
                                                                            columnNumber: 35
                                                                        }, this);
                                                                    })
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/activity.tsx",
                                                                    lineNumber: 735,
                                                                    columnNumber: 29
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/pages/portal/activity.tsx",
                                                            lineNumber: 710,
                                                            columnNumber: 27
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/pages/portal/activity.tsx",
                                                    lineNumber: 700,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/portal/activity.tsx",
                                            lineNumber: 682,
                                            columnNumber: 21
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/portal/activity.tsx",
                                    lineNumber: 634,
                                    columnNumber: 19
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "overflow-x-auto",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                                        className: "w-full",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                                                className: "bg-[#e4ebf5] sticky top-0 z-10",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                    children: source === 'mobile' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                className: "px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider",
                                                                style: {
                                                                    fontFamily: "'Roboto', sans-serif"
                                                                },
                                                                children: "Emp. ID"
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/activity.tsx",
                                                                lineNumber: 771,
                                                                columnNumber: 33
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                className: "px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider",
                                                                style: {
                                                                    fontFamily: "'Roboto', sans-serif"
                                                                },
                                                                children: "Emp. Name"
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/activity.tsx",
                                                                lineNumber: 777,
                                                                columnNumber: 33
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                className: "px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider",
                                                                style: {
                                                                    fontFamily: "'Roboto', sans-serif"
                                                                },
                                                                children: "Time"
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/activity.tsx",
                                                                lineNumber: 783,
                                                                columnNumber: 33
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                className: "px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider",
                                                                style: {
                                                                    fontFamily: "'Roboto', sans-serif"
                                                                },
                                                                children: "Type"
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/activity.tsx",
                                                                lineNumber: 789,
                                                                columnNumber: 33
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                className: "px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider",
                                                                style: {
                                                                    fontFamily: "'Roboto', sans-serif"
                                                                },
                                                                children: "Customer"
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/activity.tsx",
                                                                lineNumber: 795,
                                                                columnNumber: 33
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                className: "px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider",
                                                                style: {
                                                                    fontFamily: "'Roboto', sans-serif"
                                                                },
                                                                children: "Number"
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/activity.tsx",
                                                                lineNumber: 801,
                                                                columnNumber: 33
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                className: "px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider",
                                                                style: {
                                                                    fontFamily: "'Roboto', sans-serif"
                                                                },
                                                                children: "Duration"
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/activity.tsx",
                                                                lineNumber: 807,
                                                                columnNumber: 33
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                className: "px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider",
                                                                style: {
                                                                    fontFamily: "'Roboto', sans-serif"
                                                                },
                                                                children: "Device"
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/activity.tsx",
                                                                lineNumber: 813,
                                                                columnNumber: 33
                                                            }, this)
                                                        ]
                                                    }, void 0, true) : // CRM Columns (Reverting to original style)
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                className: "px-2 md:px-6 py-3 md:py-4 text-left text-[10px] md:text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[100px] md:min-w-[120px]",
                                                                children: "Emp. ID"
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/activity.tsx",
                                                                lineNumber: 823,
                                                                columnNumber: 28
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                className: "px-2 md:px-6 py-3 md:py-4 text-left text-[10px] md:text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[150px] md:min-w-[180px]",
                                                                children: "Emp Name"
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/activity.tsx",
                                                                lineNumber: 824,
                                                                columnNumber: 28
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                className: "px-2 md:px-6 py-3 md:py-4 text-left text-[10px] md:text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[150px] md:min-w-[180px]",
                                                                children: "Customer"
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/activity.tsx",
                                                                lineNumber: 825,
                                                                columnNumber: 28
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                className: "px-2 md:px-6 py-3 md:py-4 text-left text-[10px] md:text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[120px] md:min-w-[150px]",
                                                                children: "Callback"
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/activity.tsx",
                                                                lineNumber: 826,
                                                                columnNumber: 28
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                className: "px-2 md:px-6 py-3 md:py-4 text-left text-[10px] md:text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[120px] md:min-w-[180px]",
                                                                children: "Disposition"
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/activity.tsx",
                                                                lineNumber: 827,
                                                                columnNumber: 28
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                className: "px-2 md:px-6 py-3 md:py-4 text-left text-[10px] md:text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[120px] md:min-w-[150px]",
                                                                children: "Campaign"
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/activity.tsx",
                                                                lineNumber: 828,
                                                                columnNumber: 28
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                className: "px-2 md:px-6 py-3 md:py-4 text-left text-[10px] md:text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[120px] md:min-w-[150px]",
                                                                children: "Last Call"
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/activity.tsx",
                                                                lineNumber: 829,
                                                                columnNumber: 28
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                className: "px-2 md:px-6 py-3 md:py-4 text-left text-[10px] md:text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[100px] md:min-w-[120px]",
                                                                children: "Talk Time"
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/activity.tsx",
                                                                lineNumber: 830,
                                                                columnNumber: 28
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                className: "px-2 md:px-6 py-3 md:py-4 text-left text-[10px] md:text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[100px] md:min-w-[120px]",
                                                                children: "Dialed"
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/activity.tsx",
                                                                lineNumber: 831,
                                                                columnNumber: 28
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                className: "px-2 md:px-6 py-3 md:py-4 text-left text-[10px] md:text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[150px] md:min-w-[200px]",
                                                                children: "Remark"
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/activity.tsx",
                                                                lineNumber: 832,
                                                                columnNumber: 28
                                                            }, this)
                                                        ]
                                                    }, void 0, true)
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/activity.tsx",
                                                    lineNumber: 768,
                                                    columnNumber: 25
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/pages/portal/activity.tsx",
                                                lineNumber: 767,
                                                columnNumber: 23
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                                                className: "bg-white divide-y divide-gray-200",
                                                children: filteredActivities.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        colSpan: source === 'mobile' ? 8 : 10,
                                                        className: "px-6 py-12 text-center",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex flex-col items-center justify-center",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "flex h-16 w-16 items-center justify-center rounded-full mx-auto mb-4",
                                                                    style: {
                                                                        background: "linear-gradient(to bottom right, rgba(75, 51, 232, 0.1), rgba(75, 51, 232, 0.05))"
                                                                    },
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                                        className: "fi fi-rr-search text-2xl text-purple-600"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/portal/activity.tsx",
                                                                        lineNumber: 843,
                                                                        columnNumber: 35
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/activity.tsx",
                                                                    lineNumber: 842,
                                                                    columnNumber: 34
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                                    className: "text-lg font-medium text-gray-900 mb-1",
                                                                    children: "No activities found"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/activity.tsx",
                                                                    lineNumber: 845,
                                                                    columnNumber: 34
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-sm text-gray-500",
                                                                    children: "Try adjusting your search or date filter"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/activity.tsx",
                                                                    lineNumber: 846,
                                                                    columnNumber: 34
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/pages/portal/activity.tsx",
                                                            lineNumber: 841,
                                                            columnNumber: 32
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/activity.tsx",
                                                        lineNumber: 840,
                                                        columnNumber: 30
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/activity.tsx",
                                                    lineNumber: 839,
                                                    columnNumber: 28
                                                }, this) : filteredActivities.map((activity, index)=>{
                                                    if (source === 'mobile') {
                                                        // Mobile History Row
                                                        const callDate = new Date(activity.timestamp);
                                                        const type = (activity.call_type || 'unknown').toLowerCase();
                                                        let iconClass = "fi-rr-question";
                                                        let iconColor = "text-gray-400";
                                                        if (type.includes('outgoing')) {
                                                            iconClass = "fi-rr-arrow-up-right";
                                                            iconColor = "text-blue-500";
                                                        } else if (type.includes('incoming')) {
                                                            iconClass = "fi-rr-arrow-down-left";
                                                            iconColor = "text-green-500";
                                                        } else if (type.includes('missed')) {
                                                            iconClass = "fi-rr-cross-circle";
                                                            iconColor = "text-red-500";
                                                        } else if (type.includes('reject')) {
                                                            iconClass = "fi-rr-ban";
                                                            iconColor = "text-red-500";
                                                        }
                                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                            className: "hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                    className: "px-4 py-3 whitespace-nowrap text-xs text-blue-600 font-bold",
                                                                    children: activity.employee_id || "N/A"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/activity.tsx",
                                                                    lineNumber: 869,
                                                                    columnNumber: 39
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                    className: "px-4 py-3 whitespace-nowrap text-xs text-gray-800 font-semibold",
                                                                    children: activity.user_name || "Unknown"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/activity.tsx",
                                                                    lineNumber: 872,
                                                                    columnNumber: 39
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                    className: "px-4 py-3 whitespace-nowrap text-xs text-gray-600",
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "flex flex-col",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: "font-medium text-gray-800",
                                                                                children: callDate.toLocaleTimeString([], {
                                                                                    hour: '2-digit',
                                                                                    minute: '2-digit'
                                                                                })
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/pages/portal/activity.tsx",
                                                                                lineNumber: 877,
                                                                                columnNumber: 45
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: "text-[10px] text-gray-400",
                                                                                children: [
                                                                                    callDate.getDate(),
                                                                                    "/",
                                                                                    callDate.getMonth() + 1
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/pages/portal/activity.tsx",
                                                                                lineNumber: 878,
                                                                                columnNumber: 45
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/pages/portal/activity.tsx",
                                                                        lineNumber: 876,
                                                                        columnNumber: 42
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/activity.tsx",
                                                                    lineNumber: 875,
                                                                    columnNumber: 39
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                    className: "px-4 py-3 whitespace-nowrap",
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "flex items-center gap-2",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                                                className: `fi flex ${iconClass} ${iconColor} text-sm`
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/pages/portal/activity.tsx",
                                                                                lineNumber: 883,
                                                                                columnNumber: 45
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: "text-xs uppercase font-semibold text-gray-600",
                                                                                children: type
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/pages/portal/activity.tsx",
                                                                                lineNumber: 884,
                                                                                columnNumber: 45
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/pages/portal/activity.tsx",
                                                                        lineNumber: 882,
                                                                        columnNumber: 41
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/activity.tsx",
                                                                    lineNumber: 881,
                                                                    columnNumber: 39
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                    className: "px-4 py-3 whitespace-nowrap text-xs text-gray-800 font-medium",
                                                                    children: activity.name || "Unknown"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/activity.tsx",
                                                                    lineNumber: 887,
                                                                    columnNumber: 39
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                    className: "px-4 py-3 whitespace-nowrap text-xs text-blue-600 font-mono",
                                                                    children: activity.number || "—"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/activity.tsx",
                                                                    lineNumber: 890,
                                                                    columnNumber: 39
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                    className: "px-4 py-3 whitespace-nowrap text-xs text-gray-600",
                                                                    children: formatSeconds(activity.duration || 0)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/activity.tsx",
                                                                    lineNumber: 893,
                                                                    columnNumber: 39
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                    className: "px-4 py-3 whitespace-nowrap text-xs text-gray-500",
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "flex items-center gap-1",
                                                                        title: activity.device_id,
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                                                className: "fi flex fi-rr-smartphone text-xs"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/pages/portal/activity.tsx",
                                                                                lineNumber: 898,
                                                                                columnNumber: 45
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: "max-w-[100px] truncate",
                                                                                children: activity.device_id || "Unknown"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/pages/portal/activity.tsx",
                                                                                lineNumber: 899,
                                                                                columnNumber: 45
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/pages/portal/activity.tsx",
                                                                        lineNumber: 897,
                                                                        columnNumber: 41
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/activity.tsx",
                                                                    lineNumber: 896,
                                                                    columnNumber: 39
                                                                }, this)
                                                            ]
                                                        }, activity.id || index, true, {
                                                            fileName: "[project]/pages/portal/activity.tsx",
                                                            lineNumber: 865,
                                                            columnNumber: 37
                                                        }, this);
                                                    } else {
                                                        // Default CRM Row
                                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                            className: "hover:bg-gray-50 transition-colors",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                    className: "px-2 md:px-6 py-3 md:py-4 text-xs font-medium text-gray-900",
                                                                    children: activity.agent?.employee_id || "N/A"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/activity.tsx",
                                                                    lineNumber: 908,
                                                                    columnNumber: 35
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                    className: "px-2 md:px-6 py-3 md:py-4 text-xs font-semibold text-gray-800",
                                                                    children: activity.agent?.user_name || "Unknown Agent"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/activity.tsx",
                                                                    lineNumber: 911,
                                                                    columnNumber: 35
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                    className: "px-2 md:px-6 py-3 md:py-4 text-xs text-gray-700 font-medium",
                                                                    children: activity.customer?.customer_name || activity.rejected_customer?.customer_name || "Unknown Customer"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/activity.tsx",
                                                                    lineNumber: 914,
                                                                    columnNumber: 35
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                    className: "px-2 md:px-6 py-3 md:py-4 text-xs text-gray-600",
                                                                    children: activity.next_called_at ? formatDisplayDate(activity.next_called_at) : "No Followup"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/activity.tsx",
                                                                    lineNumber: 917,
                                                                    columnNumber: 35
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                    className: "px-2 md:px-6 py-3 md:py-4 text-xs font-bold text-slate-700",
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "flex flex-col",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: "text-indigo-600 font-black tracking-tight",
                                                                                children: activity.disposition || "N/A"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/pages/portal/activity.tsx",
                                                                                lineNumber: 922,
                                                                                columnNumber: 40
                                                                            }, this),
                                                                            activity.sub_disposition && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: "text-[10px] text-gray-400 font-medium lowercase italic leading-none",
                                                                                children: activity.sub_disposition
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/pages/portal/activity.tsx",
                                                                                lineNumber: 924,
                                                                                columnNumber: 42
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/pages/portal/activity.tsx",
                                                                        lineNumber: 921,
                                                                        columnNumber: 37
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/activity.tsx",
                                                                    lineNumber: 920,
                                                                    columnNumber: 35
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                    className: "px-2 md:px-6 py-3 md:py-4 text-xs text-indigo-600 font-bold uppercase tracking-tighter",
                                                                    children: activity.campaign?.name || "General"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/activity.tsx",
                                                                    lineNumber: 928,
                                                                    columnNumber: 35
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                    className: "px-2 md:px-6 py-3 md:py-4 text-xs text-gray-600",
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "flex flex-col",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: "text-gray-900 font-medium",
                                                                                children: formatTime(activity.created_at)
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/pages/portal/activity.tsx",
                                                                                lineNumber: 933,
                                                                                columnNumber: 39
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: "text-[10px] text-gray-400",
                                                                                children: formatDisplayDate(activity.created_at)
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/pages/portal/activity.tsx",
                                                                                lineNumber: 934,
                                                                                columnNumber: 39
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/pages/portal/activity.tsx",
                                                                        lineNumber: 932,
                                                                        columnNumber: 37
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/activity.tsx",
                                                                    lineNumber: 931,
                                                                    columnNumber: 35
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                    className: "px-2 md:px-6 py-3 md:py-4 text-xs font-mono font-bold text-gray-600",
                                                                    children: activity.duration ? formatSeconds(activity.duration) : "00:00:00"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/activity.tsx",
                                                                    lineNumber: 937,
                                                                    columnNumber: 35
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                    className: "px-2 md:px-6 py-3 md:py-4",
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: `px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${activity.is_connected === 'contactable' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`,
                                                                        children: activity.is_connected || "N/A"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/portal/activity.tsx",
                                                                        lineNumber: 941,
                                                                        columnNumber: 37
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/activity.tsx",
                                                                    lineNumber: 940,
                                                                    columnNumber: 35
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                    className: "px-2 md:px-6 py-3 md:py-4 text-xs text-gray-500 italic max-w-xs truncate",
                                                                    title: activity.notes,
                                                                    children: activity.notes || "No remark provided"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/activity.tsx",
                                                                    lineNumber: 945,
                                                                    columnNumber: 35
                                                                }, this)
                                                            ]
                                                        }, activity.id, true, {
                                                            fileName: "[project]/pages/portal/activity.tsx",
                                                            lineNumber: 907,
                                                            columnNumber: 33
                                                        }, this);
                                                    }
                                                })
                                            }, void 0, false, {
                                                fileName: "[project]/pages/portal/activity.tsx",
                                                lineNumber: 837,
                                                columnNumber: 23
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/portal/activity.tsx",
                                        lineNumber: 766,
                                        columnNumber: 21
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/pages/portal/activity.tsx",
                                    lineNumber: 765,
                                    columnNumber: 19
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/pages/portal/activity.tsx",
                            lineNumber: 500,
                            columnNumber: 17
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/pages/portal/activity.tsx",
                        lineNumber: 499,
                        columnNumber: 15
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/pages/portal/activity.tsx",
                lineNumber: 87,
                columnNumber: 13
            }, this)
        }, void 0, false, {
            fileName: "[project]/pages/portal/activity.tsx",
            lineNumber: 86,
            columnNumber: 11
        }, this)
    }, void 0, false);
}
_s(Activity, "HOyH7TVsMkWS8Z2LGaPUvgt4dIc=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useActivityData$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["useActivityData"]
    ];
});
_c = Activity;
var _c;
__turbopack_context__.k.register(_c, "Activity");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[next]/entry/page-loader.ts { PAGE => \"[project]/pages/portal/activity.tsx [client] (ecmascript)\" } [client] (ecmascript)", ((__turbopack_context__, module, exports) => {

const PAGE_PATH = "/portal/activity";
(window.__NEXT_P = window.__NEXT_P || []).push([
    PAGE_PATH,
    ()=>{
        return __turbopack_context__.r("[project]/pages/portal/activity.tsx [client] (ecmascript)");
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
"[hmr-entry]/hmr-entry.js { ENTRY => \"[project]/pages/portal/activity.tsx\" }", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.r("[next]/entry/page-loader.ts { PAGE => \"[project]/pages/portal/activity.tsx [client] (ecmascript)\" } [client] (ecmascript)");
}),
]);

//# sourceMappingURL=%5Broot-of-the-server%5D__36f235cf._.js.map