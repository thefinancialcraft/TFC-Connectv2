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
"[project]/components/AppLogo.tsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>AppLogo
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
;
function AppLogo({ size = 'default' }) {
    const isSmall = size === 'small';
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex flex-col items-start justify-center",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-start gap-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: `inline-flex items-center justify-center rounded-full shrink-0 ${isSmall ? 'h-5 w-5' : 'h-[24px] w-[24px] md:h-[22px] md:w-[22px]'}`,
                        style: {
                            background: 'transparent'
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
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
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        className: `font-[700]  leading-none mt-1.5 ${isSmall ? 'text-xl md:text-xl' : 'text-[26px] md:text-2xl'}`,
                        style: {
                            color: '#4b33e8',
                            fontFamily: "'Roboto', sans-serif"
                        },
                        children: [
                            "Rynx",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    color: '#263238ff'
                                },
                                children: "ly"
                            }, void 0, false, {
                                fileName: "[project]/components/AppLogo.tsx",
                                lineNumber: 43,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
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
            !isSmall && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
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
_c = AppLogo;
var _c;
__turbopack_context__.k.register(_c, "AppLogo");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
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
"[project]/components/Sidebar.tsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/router.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/link.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$AppLogo$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/AppLogo.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$localStorageUtils$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/localStorageUtils.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$config$2f$navigation$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/config/navigation.ts [client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
;
;
;
;
;
const Sidebar = /*#__PURE__*/ _s((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["memo"])(_c = _s(function Sidebar({ user, activeNav = "dashboard", onNavChange, userRole, isSuperAdmin, onLogout }) {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const [isLoggingOut, setIsLoggingOut] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [mounted, setMounted] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // Initialize with cached user data for ghost loading immediately
    const [cachedUser] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])({
        "Sidebar.Sidebar.useState": ()=>{
            if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
            ;
            const cached = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$localStorageUtils$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["getStoredUserData"])();
            if (cached) {
                return {
                    displayName: cached.user_name || cached.displayName || null,
                    email: cached.email || '',
                    employeeId: cached.employee_id || null,
                    lastSignInAt: null,
                    profilePicUrl: cached.profile_pic_url || null,
                    isClient: cached.is_client,
                    designation: cached.designation,
                    allowed_tabs: cached.allowed_tabs
                };
            }
            return undefined;
        }
    }["Sidebar.Sidebar.useState"]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Sidebar.Sidebar.useEffect": ()=>{
            setMounted(true);
        }
    }["Sidebar.Sidebar.useEffect"], []);
    // Memoize display user to prevent unnecessary recalculations
    const displayUser = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "Sidebar.Sidebar.useMemo[displayUser]": ()=>{
            return mounted ? user || cachedUser : user;
        }
    }["Sidebar.Sidebar.useMemo[displayUser]"], [
        mounted,
        user,
        cachedUser
    ]);
    // Memoize admin status
    const isAdmin = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "Sidebar.Sidebar.useMemo[isAdmin]": ()=>{
            return userRole === 'admin' || userRole === 'super_admin' || isSuperAdmin === true;
        }
    }["Sidebar.Sidebar.useMemo[isAdmin]"], [
        userRole,
        isSuperAdmin
    ]);
    // Stable logout handler
    const handleLogout = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "Sidebar.Sidebar.useCallback[handleLogout]": async ()=>{
            if (isLoggingOut || !onLogout) return;
            setIsLoggingOut(true);
            try {
                onLogout();
            } catch (err) {
                console.error("Logout exception:", err);
                setIsLoggingOut(false);
            }
        }
    }["Sidebar.Sidebar.useCallback[handleLogout]"], [
        isLoggingOut,
        onLogout
    ]);
    // Memoize derived UI values
    const initials = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "Sidebar.Sidebar.useMemo[initials]": ()=>{
            if (!mounted) return "U";
            if (displayUser?.displayName) {
                return displayUser.displayName.trim().charAt(0).toUpperCase();
            }
            if (displayUser?.email) {
                return displayUser.email.slice(0, 2).toUpperCase();
            }
            return "U";
        }
    }["Sidebar.Sidebar.useMemo[initials]"], [
        mounted,
        displayUser
    ]);
    const profilePicUrl = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "Sidebar.Sidebar.useMemo[profilePicUrl]": ()=>{
            // Priority: 1. Props (user), 2. Cached (cachedUser)
            if (user?.profilePicUrl) return user.profilePicUrl;
            return mounted ? cachedUser?.profilePicUrl : null;
        }
    }["Sidebar.Sidebar.useMemo[profilePicUrl]"], [
        mounted,
        user?.profilePicUrl,
        cachedUser?.profilePicUrl
    ]);
    const formattedLastLogin = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "Sidebar.Sidebar.useMemo[formattedLastLogin]": ()=>{
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
        }
    }["Sidebar.Sidebar.useMemo[formattedLastLogin]"], [
        displayUser?.lastSignInAt
    ]);
    // Memoize filtered navigation items
    const navItems = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "Sidebar.Sidebar.useMemo[navItems]": ()=>{
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
            const filtered = __TURBOPACK__imported__module__$5b$project$5d2f$config$2f$navigation$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["NAV_ITEMS"].filter({
                "Sidebar.Sidebar.useMemo[navItems].filtered": (item)=>{
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
                    // 4. NXUS-001 Exclusive Check
                    if (item.path === '/call-sessions' && currentUser.employeeId !== 'NXUS-001') return false;
                    return false;
                }
            }["Sidebar.Sidebar.useMemo[navItems].filtered"]);
            return filtered;
        }
    }["Sidebar.Sidebar.useMemo[navItems]"], [
        isAdmin,
        user,
        cachedUser,
        mounted
    ]);
    // Effect to sync calculated nav items back to cache
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Sidebar.Sidebar.useEffect": ()=>{
            if (mounted && navItems.length > 0) {
                const { getStoredUserData, storeUserData } = __turbopack_context__.r("[project]/lib/localStorageUtils.ts [client] (ecmascript)");
                const currentData = getStoredUserData();
                if (currentData) {
                    const newPaths = navItems.map({
                        "Sidebar.Sidebar.useEffect.newPaths": (item)=>item.path
                    }["Sidebar.Sidebar.useEffect.newPaths"]);
                    // Only update if changed to avoid loops
                    if (JSON.stringify(currentData.allowed_tabs) !== JSON.stringify(newPaths)) {
                        storeUserData({
                            ...currentData,
                            allowed_tabs: newPaths
                        });
                    }
                }
            }
        }
    }["Sidebar.Sidebar.useEffect"], [
        navItems,
        mounted
    ]);
    const handleNavClick = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "Sidebar.Sidebar.useCallback[handleNavClick]": (path)=>{
            onNavChange?.(path);
        }
    }["Sidebar.Sidebar.useCallback[handleNavClick]"], [
        onNavChange
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
        className: "hidden lg:flex flex-col w-52 bg-white border-r fixed left-0 top-0 h-screen z-40",
        style: {
            borderColor: "#E0E0E0"
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "h-[70px] border-b flex items-center justify-center",
                style: {
                    borderColor: "#E0E0E0"
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$AppLogo$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                    fileName: "[project]/components/Sidebar.tsx",
                    lineNumber: 198,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/Sidebar.tsx",
                lineNumber: 197,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                className: "flex-1 p-3 space-y-1 overflow-y-auto",
                suppressHydrationWarning: true,
                children: navItems.length > 0 ? navItems.map((item)=>{
                    const isOnPath = router.pathname.startsWith(item.path) || router.pathname.startsWith('/portal' + item.path);
                    const isExactDashboard = item.path === '/dashboard' && (router.pathname === '/dashboard' || router.pathname === '/portal/dashboard');
                    const isActive = item.path === '/dashboard' ? isExactDashboard : isOnPath || activeNav === item.path;
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                        href: item.path,
                        onClick: ()=>handleNavClick(item.path),
                        className: `flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all duration-300 relative ${isActive ? "text-white shadow-md" : "text-gray-600 hover:bg-gray-50"}`,
                        style: {
                            backgroundColor: isActive ? "#4b33e8" : "transparent"
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                className: `fi ${item.icon} flex text-sm`
                            }, void 0, false, {
                                fileName: "[project]/components/Sidebar.tsx",
                                lineNumber: 223,
                                columnNumber: 17
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "font-medium px-1.5 text-sm",
                                style: {
                                    fontFamily: "'Poppins', sans-serif"
                                },
                                children: item.name
                            }, void 0, false, {
                                fileName: "[project]/components/Sidebar.tsx",
                                lineNumber: 224,
                                columnNumber: 17
                            }, this)
                        ]
                    }, item.path, true, {
                        fileName: "[project]/components/Sidebar.tsx",
                        lineNumber: 210,
                        columnNumber: 15
                    }, this);
                }) : // Skeleton Links - Only shown if cache is completely empty
                [
                    1,
                    2,
                    3,
                    4,
                    5
                ].map((i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-2 px-3 py-2 rounded-lg animate-pulse",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "w-5 h-5 rounded bg-gray-100"
                            }, void 0, false, {
                                fileName: "[project]/components/Sidebar.tsx",
                                lineNumber: 237,
                                columnNumber: 17
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "h-3 w-24 bg-gray-100 rounded"
                            }, void 0, false, {
                                fileName: "[project]/components/Sidebar.tsx",
                                lineNumber: 238,
                                columnNumber: 17
                            }, this)
                        ]
                    }, i, true, {
                        fileName: "[project]/components/Sidebar.tsx",
                        lineNumber: 236,
                        columnNumber: 13
                    }, this))
            }, void 0, false, {
                fileName: "[project]/components/Sidebar.tsx",
                lineNumber: 202,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "p-3 border-t space-y-2",
                style: {
                    borderColor: "#E0E0E0",
                    backgroundColor: "#FAFAFA"
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-white border rounded-lg p-3 shadow-sm hover:shadow-md transition-all duration-300",
                    style: {
                        borderColor: "#E0E0E0"
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-start gap-2.5 mb-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm shrink-0  overflow-hidden",
                                    style: {
                                        background: profilePicUrl ? "transparent" : "#4b33e8"
                                    },
                                    children: mounted && profilePicUrl ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                        src: profilePicUrl,
                                        alt: displayUser?.displayName || 'User',
                                        className: "w-full h-full object-cover"
                                    }, void 0, false, {
                                        fileName: "[project]/components/Sidebar.tsx",
                                        lineNumber: 258,
                                        columnNumber: 17
                                    }, this) : initials
                                }, void 0, false, {
                                    fileName: "[project]/components/Sidebar.tsx",
                                    lineNumber: 251,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex-1 min-w-0",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-sm font-semibold truncate mb-0.5",
                                            style: {
                                                color: "#263238",
                                                fontFamily: "'Poppins', sans-serif"
                                            },
                                            children: mounted ? displayUser?.displayName || displayUser?.email?.split("@")[0] || "User" : "User"
                                        }, void 0, false, {
                                            fileName: "[project]/components/Sidebar.tsx",
                                            lineNumber: 268,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-xs truncate",
                                            style: {
                                                color: "#787E9D",
                                                fontFamily: "'Roboto', sans-serif"
                                            },
                                            children: mounted ? displayUser?.email || "user@example.com" : "user@example.com"
                                        }, void 0, false, {
                                            fileName: "[project]/components/Sidebar.tsx",
                                            lineNumber: 274,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/Sidebar.tsx",
                                    lineNumber: 267,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/Sidebar.tsx",
                            lineNumber: 250,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-1.5 mb-3 pt-2 border-t",
                            style: {
                                borderColor: "#E0E0E0"
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center justify-between text-xs",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            style: {
                                                color: "#787E9D",
                                                fontFamily: "'Roboto', sans-serif"
                                            },
                                            children: "Employee ID:"
                                        }, void 0, false, {
                                            fileName: "[project]/components/Sidebar.tsx",
                                            lineNumber: 285,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "font-medium",
                                            style: {
                                                color: "#263238",
                                                fontFamily: "'Roboto', sans-serif"
                                            },
                                            children: mounted ? displayUser?.employeeId || "Not assigned" : "Not assigned"
                                        }, void 0, false, {
                                            fileName: "[project]/components/Sidebar.tsx",
                                            lineNumber: 288,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/Sidebar.tsx",
                                    lineNumber: 284,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center justify-between text-xs",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            style: {
                                                color: "#787E9D",
                                                fontFamily: "'Roboto', sans-serif"
                                            },
                                            children: "Last Login:"
                                        }, void 0, false, {
                                            fileName: "[project]/components/Sidebar.tsx",
                                            lineNumber: 296,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "font-medium",
                                            style: {
                                                color: "#263238",
                                                fontFamily: "'Roboto', sans-serif"
                                            },
                                            children: formattedLastLogin
                                        }, void 0, false, {
                                            fileName: "[project]/components/Sidebar.tsx",
                                            lineNumber: 299,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/Sidebar.tsx",
                                    lineNumber: 295,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/Sidebar.tsx",
                            lineNumber: 283,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex gap-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
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
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                        className: "fi flex fi-rr-settings text-sm"
                                    }, void 0, false, {
                                        fileName: "[project]/components/Sidebar.tsx",
                                        lineNumber: 330,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/Sidebar.tsx",
                                    lineNumber: 309,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
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
                                    children: isLoggingOut ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "w-4 h-4 border-2 border-t-transparent border-current rounded-full animate-spin"
                                    }, void 0, false, {
                                        fileName: "[project]/components/Sidebar.tsx",
                                        lineNumber: 358,
                                        columnNumber: 17
                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                className: "fi flex px-1 fi-rr-exit text-sm"
                                            }, void 0, false, {
                                                fileName: "[project]/components/Sidebar.tsx",
                                                lineNumber: 361,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "Logout"
                                            }, void 0, false, {
                                                fileName: "[project]/components/Sidebar.tsx",
                                                lineNumber: 362,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true)
                                }, void 0, false, {
                                    fileName: "[project]/components/Sidebar.tsx",
                                    lineNumber: 332,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/Sidebar.tsx",
                            lineNumber: 308,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/Sidebar.tsx",
                    lineNumber: 246,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/Sidebar.tsx",
                lineNumber: 245,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/Sidebar.tsx",
        lineNumber: 193,
        columnNumber: 5
    }, this);
}, "1OKE11HEq0ZJKeU7EOp5Zh/gx6M=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
})), "1OKE11HEq0ZJKeU7EOp5Zh/gx6M=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c1 = Sidebar;
const __TURBOPACK__default__export__ = Sidebar;
var _c, _c1;
__turbopack_context__.k.register(_c, "Sidebar$memo");
__turbopack_context__.k.register(_c1, "Sidebar");
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
"[project]/components/Header.tsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/styled-jsx/style.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/router.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bell$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Bell$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/bell.js [client] (ecmascript) <export default as Bell>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bell$2d$ring$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BellRing$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/bell-ring.js [client] (ecmascript) <export default as BellRing>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/check.js [client] (ecmascript) <export default as Check>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/trash-2.js [client] (ecmascript) <export default as Trash2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.js [client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$info$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Info$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/info.js [client] (ecmascript) <export default as Info>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/triangle-alert.js [client] (ecmascript) <export default as AlertTriangle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$localStorageUtils$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/localStorageUtils.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabase.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$flutterBridge$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/flutterBridge.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dialogUtils$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/dialogUtils.ts [client] (ecmascript)");
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
function HeaderComponent({ user, onLogout, hideSidebar = false }) {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const [serverStatus, setServerStatus] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])('online');
    const [showFullStatus, setShowFullStatus] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [mounted, setMounted] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [deviceStatus, setDeviceStatus] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isBridgeActive, setIsBridgeActive] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isLoggingOut, setIsLoggingOut] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [localEntryId, setLocalEntryId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [tick, setTick] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const lastProcessedRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const lastSentCommandRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const isOnCallRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRef"])(false);
    // Notification States
    const [notifications, setNotifications] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [showNotifications, setShowNotifications] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [unreadCount, setUnreadCount] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(0);
    // Initialize with cached data, then update with props if different (ghost update)
    const [cachedUser, setCachedUser] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])({
        "HeaderComponent.useState": ()=>{
            if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
            ;
             // SSR safety
            const cached = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$localStorageUtils$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["getStoredUserData"])();
            if (cached) {
                return {
                    displayName: cached.user_name || cached.displayName || null,
                    email: cached.email || '',
                    employeeId: cached.employee_id || null,
                    profilePicUrl: cached.profile_pic_url || null,
                    uid: cached.id || cached.uid || null // Grab UID/ID
                };
            }
            return undefined;
        }
    }["HeaderComponent.useState"]);
    // Use cached user for display (prevents "User / Not assigned" flicker)
    // Memoize displayUser to prevent recalculation on every render
    const displayUser = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "HeaderComponent.useMemo[displayUser]": ()=>{
            return mounted ? user || cachedUser : user;
        }
    }["HeaderComponent.useMemo[displayUser]"], [
        mounted,
        user,
        cachedUser
    ]);
    const initials = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "HeaderComponent.useMemo[initials]": ()=>{
            if (!mounted) return "U"; // Return default during SSR to prevent hydration mismatch
            if (displayUser?.displayName) {
                return displayUser.displayName.trim().charAt(0).toUpperCase();
            }
            if (displayUser?.email) {
                return displayUser.email.slice(0, 2).toUpperCase();
            }
            return "U";
        }
    }["HeaderComponent.useMemo[initials]"], [
        mounted,
        displayUser
    ]);
    // Only use profilePicUrl after mount to prevent hydration mismatch
    const profilePicUrl = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "HeaderComponent.useMemo[profilePicUrl]": ()=>{
            // Priority: 1. Props (user), 2. Cached (cachedUser)
            // DEBUG LOG
            // if (user?.profilePicUrl) console.log('Header: Using Prop Pic', user.profilePicUrl);
            // else if (cachedUser?.profilePicUrl) console.log('Header: Using Cached Pic', cachedUser.profilePicUrl);
            // else console.log('Header: No Pic Found', { user: user, cached: cachedUser });
            if (user?.profilePicUrl) return user.profilePicUrl;
            return mounted ? cachedUser?.profilePicUrl : null;
        }
    }["HeaderComponent.useMemo[profilePicUrl]"], [
        mounted,
        user?.profilePicUrl,
        cachedUser?.profilePicUrl
    ]);
    // Set mounted and check for Flutter Bridge
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "HeaderComponent.useEffect": ()=>{
            setMounted(true);
            if (("TURBOPACK compile-time value", "object") !== 'undefined' && window.flutter_inappwebview) {
                setIsBridgeActive(true);
                // Request initial device info
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$flutterBridge$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["requestDeviceInfoFromFlutter"])();
                // Listen for incoming bridge messages from Flutter
                const handleMessage = {
                    "HeaderComponent.useEffect.handleMessage": (e)=>{
                        const payload = e.detail;
                        if (payload?.type === 'device_info' && payload?.value?.androidId) {
                            const androidId = payload.value.androidId;
                            const employeeId = displayUser?.employeeId;
                            if (employeeId) {
                                const entryId = `${employeeId}_${androidId}`;
                                console.log(`🆔 [Header] Identity established: ${entryId}`);
                                setLocalEntryId(entryId);
                                localStorage.setItem('android_id', androidId);
                                localStorage.setItem('entry_id', entryId);
                                // Update Session Metadata in DB
                                const updateSessionMeta = {
                                    "HeaderComponent.useEffect.handleMessage.updateSessionMeta": async ()=>{
                                        try {
                                            const { data: { session } } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["supabase"].auth.getSession();
                                            const tokenId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$localStorageUtils$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["getStoredUserData"])()?.token_id;
                                            if (session && tokenId) {
                                                await fetch('/api/auth/update-session-meta', {
                                                    method: 'POST',
                                                    headers: {
                                                        'Content-Type': 'application/json',
                                                        'Authorization': `Bearer ${session.access_token}`
                                                    },
                                                    body: JSON.stringify({
                                                        device_info: payload.value,
                                                        token_id: tokenId
                                                    })
                                                });
                                                console.log("✅ [Header] Session metadata updated in DB");
                                            }
                                        } catch (err) {
                                            console.error("❌ [Header] Failed to sync session meta:", err);
                                        }
                                    }
                                }["HeaderComponent.useEffect.handleMessage.updateSessionMeta"];
                                updateSessionMeta();
                            }
                        }
                        // --- Persistent Lock Release ---
                        // Clear the last sent command lock when a disconnect message is received from Flutter
                        const isDisconnectMsg = payload?.type === 'call_disconected' || payload?.type === 'call_disconnect' || payload?.type === 'call_disconnected';
                        if (isDisconnectMsg) {
                            console.log("🛡️ [Header] Disconnect received from bridge. Clearing command lock.");
                            lastSentCommandRef.current = null;
                            lastProcessedRef.current = null; // Also clear short-term deduplication
                        }
                    }
                }["HeaderComponent.useEffect.handleMessage"];
                window.addEventListener('tfc-bridge-message', handleMessage);
                // Set up periodic identity refresh every 30 minutes
                const refreshInterval = setInterval({
                    "HeaderComponent.useEffect.refreshInterval": ()=>{
                        console.log("🔄 [Header] Periodic device info refresh");
                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$flutterBridge$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["requestDeviceInfoFromFlutter"])();
                    }
                }["HeaderComponent.useEffect.refreshInterval"], 30 * 60 * 1000);
                return ({
                    "HeaderComponent.useEffect": ()=>{
                        window.removeEventListener('tfc-bridge-message', handleMessage);
                        clearInterval(refreshInterval);
                    }
                })["HeaderComponent.useEffect"];
            } else {
                // Fallback for non-bridge (desktop) - read from storage if exists
                const savedEntryId = localStorage.getItem('entry_id');
                if (savedEntryId) setLocalEntryId(savedEntryId);
            }
        }
    }["HeaderComponent.useEffect"], [
        displayUser?.employeeId
    ]);
    // Fetch and Subscribe to Device Status
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "HeaderComponent.useEffect": ()=>{
            if (!mounted || !displayUser?.employeeId) return;
            const fetchPrimaryStatus = {
                "HeaderComponent.useEffect.fetchPrimaryStatus": async ()=>{
                    // Fetch specifically by localEntryId if we have it, else fallback to primary discover
                    const query = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["supabase"].from('sync_meta').select('id, entry_id, on_call, device_model, android_id, status, is_primary, last_seen');
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
                }
            }["HeaderComponent.useEffect.fetchPrimaryStatus"];
            // Initial fetch
            fetchPrimaryStatus();
            // --- REFACTORED: NO REALTIME SUBSCRIPTION (Saves 100% Messaging Quota) ---
            // Instead, we use a 5s polling loop for absolute responsiveness (REST API - Free Quota)
            const interval = setInterval(fetchPrimaryStatus, 5000);
            return ({
                "HeaderComponent.useEffect": ()=>{
                    clearInterval(interval);
                }
            })["HeaderComponent.useEffect"];
        }
    }["HeaderComponent.useEffect"], [
        mounted,
        displayUser?.employeeId,
        isBridgeActive,
        localEntryId
    ]);
    // SENDER: Heartbeat Loop (Only if bridge is active)
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "HeaderComponent.useEffect": ()=>{
            const empId = displayUser?.employeeId;
            if (!isBridgeActive || !empId) return;
            // Send initial heartbeat
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$flutterBridge$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["sendHeartbeat"])(empId);
            // Set up interval for every 30 seconds (Increased from 10s to save 66% messaging quota)
            const interval = setInterval({
                "HeaderComponent.useEffect.interval": ()=>{
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$flutterBridge$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["sendHeartbeat"])(empId);
                }
            }["HeaderComponent.useEffect.interval"], 30000);
            return ({
                "HeaderComponent.useEffect": ()=>clearInterval(interval)
            })["HeaderComponent.useEffect"];
        }
    }["HeaderComponent.useEffect"], [
        isBridgeActive,
        displayUser?.employeeId
    ]);
    // Ticker: Force re-render periodically to update "ago" time and offline status
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "HeaderComponent.useEffect": ()=>{
            const interval = setInterval({
                "HeaderComponent.useEffect.interval": ()=>{
                    setTick({
                        "HeaderComponent.useEffect.interval": (t)=>t + 1
                    }["HeaderComponent.useEffect.interval"]);
                }
            }["HeaderComponent.useEffect.interval"], 5000); // Check every 5 seconds
            return ({
                "HeaderComponent.useEffect": ()=>clearInterval(interval)
            })["HeaderComponent.useEffect"];
        }
    }["HeaderComponent.useEffect"], []);
    // Logic: Check if device is actually online based on last_seen
    const deviceOnlineStatus = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "HeaderComponent.useMemo[deviceOnlineStatus]": ()=>{
            if (!deviceStatus?.last_seen) return 'offline';
            const lastSeen = new Date(deviceStatus.last_seen).getTime();
            const now = Date.now();
            const diffSeconds = (now - lastSeen) / 1000;
            // Mark offline if no heartbeat for 20 seconds (Stable for 5s polling)
            return diffSeconds < 20 ? 'online' : 'offline';
        }
    }["HeaderComponent.useMemo[deviceOnlineStatus]"], [
        deviceStatus?.last_seen,
        tick
    ]);
    // Ghost update: Only update if props actually changed
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "HeaderComponent.useEffect": ()=>{
            if (user) {
                setCachedUser({
                    "HeaderComponent.useEffect": (prev)=>{
                        // ... (existing code)
                        if (!prev) return user;
                        const hasChanged = prev.displayName !== user.displayName || prev.employeeId !== user.employeeId || prev.email !== user.email || prev.profilePicUrl !== user.profilePicUrl || prev.uid !== user.uid;
                        if (hasChanged) return user;
                        return prev;
                    }
                }["HeaderComponent.useEffect"]);
            }
        }
    }["HeaderComponent.useEffect"], [
        user?.displayName,
        user?.employeeId,
        user?.email,
        user?.profilePicUrl,
        user?.uid
    ]);
    // Real-time Notification Listener
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "HeaderComponent.useEffect": ()=>{
            let currentUid = displayUser?.uid;
            // Fallback: If UID is still missing, try to get it from active auth session
            const syncNotificationChannel = {
                "HeaderComponent.useEffect.syncNotificationChannel": async ()=>{
                    if (!mounted) return;
                    let activeUid = currentUid;
                    if (!activeUid) {
                        const { data: { session } } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["supabase"].auth.getSession();
                        if (session?.user?.id) {
                            activeUid = session.user.id;
                            console.log("🔑 [Header] Recovered UID from session:", activeUid);
                        }
                    }
                    if (!activeUid) return;
                    // 1. Initial Fetch
                    const fetchNotifications = {
                        "HeaderComponent.useEffect.syncNotificationChannel.fetchNotifications": async ()=>{
                            const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["supabase"].from('notifications').select('*').eq('user_id', activeUid).order('created_at', {
                                ascending: false
                            }).limit(20);
                            if (!error && data) {
                                setNotifications(data);
                                setUnreadCount(data.filter({
                                    "HeaderComponent.useEffect.syncNotificationChannel.fetchNotifications": (n)=>!n.is_seen
                                }["HeaderComponent.useEffect.syncNotificationChannel.fetchNotifications"]).length);
                            }
                        }
                    }["HeaderComponent.useEffect.syncNotificationChannel.fetchNotifications"];
                    fetchNotifications();
                    const channelName = `agent_notifications_${activeUid}`;
                    console.log(`📡 [Header] Monitoring notifications: ${channelName}`);
                    // 2. Real-time Subscription (Full Sync: Insert, Update, Delete)
                    const channel = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["supabase"].channel(channelName).on('postgres_changes', {
                        event: '*',
                        schema: 'public',
                        table: 'notifications',
                        filter: `user_id=eq.${activeUid}`
                    }, {
                        "HeaderComponent.useEffect.syncNotificationChannel.channel": (payload)=>{
                            console.log(`🔔 [Header] Realtime Database ${payload.eventType}:`, payload);
                            if (payload.eventType === 'INSERT') {
                                setNotifications({
                                    "HeaderComponent.useEffect.syncNotificationChannel.channel": (prev)=>[
                                            payload.new,
                                            ...prev
                                        ].slice(0, 20)
                                }["HeaderComponent.useEffect.syncNotificationChannel.channel"]);
                                setUnreadCount({
                                    "HeaderComponent.useEffect.syncNotificationChannel.channel": (c)=>c + 1
                                }["HeaderComponent.useEffect.syncNotificationChannel.channel"]);
                                if (payload.new.type === 'lead_access') {
                                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dialogUtils$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["showWarning"])(payload.new.message, "Lead Access Alert");
                                }
                            } else if (payload.eventType === 'UPDATE') {
                                setNotifications({
                                    "HeaderComponent.useEffect.syncNotificationChannel.channel": (prev)=>prev.map({
                                            "HeaderComponent.useEffect.syncNotificationChannel.channel": (n)=>n.id === payload.new.id ? payload.new : n
                                        }["HeaderComponent.useEffect.syncNotificationChannel.channel"])
                                }["HeaderComponent.useEffect.syncNotificationChannel.channel"]);
                                if (payload.old && !payload.old.is_seen && payload.new.is_seen) {
                                    setUnreadCount({
                                        "HeaderComponent.useEffect.syncNotificationChannel.channel": (c)=>Math.max(0, c - 1)
                                    }["HeaderComponent.useEffect.syncNotificationChannel.channel"]);
                                } else if (payload.old && payload.old.is_seen && !payload.new.is_seen) {
                                    setUnreadCount({
                                        "HeaderComponent.useEffect.syncNotificationChannel.channel": (c)=>c + 1
                                    }["HeaderComponent.useEffect.syncNotificationChannel.channel"]);
                                }
                            } else if (payload.eventType === 'DELETE') {
                                setNotifications({
                                    "HeaderComponent.useEffect.syncNotificationChannel.channel": (prev)=>{
                                        const deletedItem = prev.find({
                                            "HeaderComponent.useEffect.syncNotificationChannel.channel.deletedItem": (n)=>n.id === payload.old.id
                                        }["HeaderComponent.useEffect.syncNotificationChannel.channel.deletedItem"]);
                                        if (deletedItem && !deletedItem.is_seen) setUnreadCount({
                                            "HeaderComponent.useEffect.syncNotificationChannel.channel": (c)=>Math.max(0, c - 1)
                                        }["HeaderComponent.useEffect.syncNotificationChannel.channel"]);
                                        return prev.filter({
                                            "HeaderComponent.useEffect.syncNotificationChannel.channel": (n)=>n.id !== payload.old.id
                                        }["HeaderComponent.useEffect.syncNotificationChannel.channel"]);
                                    }
                                }["HeaderComponent.useEffect.syncNotificationChannel.channel"]);
                            }
                        }
                    }["HeaderComponent.useEffect.syncNotificationChannel.channel"]).subscribe();
                    return channel;
                }
            }["HeaderComponent.useEffect.syncNotificationChannel"];
            const channelPromise = syncNotificationChannel();
            return ({
                "HeaderComponent.useEffect": ()=>{
                    channelPromise.then({
                        "HeaderComponent.useEffect": (channel)=>{
                            if (channel) __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["supabase"].removeChannel(channel);
                        }
                    }["HeaderComponent.useEffect"]);
                }
            })["HeaderComponent.useEffect"];
        }
    }["HeaderComponent.useEffect"], [
        mounted,
        displayUser?.uid
    ]);
    const markAsSeen = async (id)=>{
        try {
            const { data: { session } } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["supabase"].auth.getSession();
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
                const { data: { session } } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["supabase"].auth.getSession();
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
    const handleLogout = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "HeaderComponent.useCallback[handleLogout]": async ()=>{
            if (isLoggingOut || !onLogout) return;
            setIsLoggingOut(true);
            try {
                onLogout();
            } catch (err) {
                console.error("Logout exception:", err);
                setIsLoggingOut(false);
            }
        }
    }["HeaderComponent.useCallback[handleLogout]"], [
        isLoggingOut,
        onLogout
    ]);
    // Mobile header design
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                style: {
                    borderColor: "#E0E0E0",
                    backgroundColor: "rgba(255, 255, 255, 0.8)"
                },
                className: "jsx-85a9f6e6ef799593" + " " + "lg:hidden border-b fixed top-0 left-0 right-0 z-50 backdrop-blur-sm",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "jsx-85a9f6e6ef799593" + " " + "px-4 py-3 flex items-center justify-between",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>router.push("/settings"),
                            style: {
                                background: profilePicUrl ? "transparent" : "#4b33e8"
                            },
                            "aria-label": "Open Settings",
                            className: "jsx-85a9f6e6ef799593" + " " + "w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-base shrink-0 transition-colors cursor-pointer overflow-hidden",
                            children: mounted && profilePicUrl ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
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
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "jsx-85a9f6e6ef799593" + " " + "flex-1 flex flex-col items-center justify-center",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
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
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
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
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "jsx-85a9f6e6ef799593" + " " + "flex items-center gap-2 shrink-0",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "jsx-85a9f6e6ef799593" + " " + "relative",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>setShowNotifications(!showNotifications),
                                        className: "jsx-85a9f6e6ef799593" + " " + "p-2 rounded-xl bg-gray-50/80 hover:bg-gray-100 transition-all active:scale-95 text-gray-600 relative overflow-visible",
                                        children: unreadCount > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bell$2d$ring$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BellRing$3e$__["BellRing"], {
                                                    className: "w-5 h-5 text-indigo-600 animate-[bell_2s_infinite]"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/Header.tsx",
                                                    lineNumber: 508,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "jsx-85a9f6e6ef799593" + " " + "absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white",
                                                    children: unreadCount
                                                }, void 0, false, {
                                                    fileName: "[project]/components/Header.tsx",
                                                    lineNumber: 509,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bell$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Bell$3e$__["Bell"], {
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
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: handleLogout,
                                    disabled: isLoggingOut,
                                    "aria-label": "Logout",
                                    className: "jsx-85a9f6e6ef799593" + " " + "p-2 rounded-xl bg-red-50/50 hover:bg-red-100 transition-all text-[#EF4444] disabled:opacity-50",
                                    children: isLoggingOut ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "jsx-85a9f6e6ef799593" + " " + "w-5 h-5 border-2 border-t-transparent border-current rounded-full animate-spin"
                                    }, void 0, false, {
                                        fileName: "[project]/components/Header.tsx",
                                        lineNumber: 526,
                                        columnNumber: 17
                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
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
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                style: {
                    borderColor: "#E0E0E0",
                    left: hideSidebar ? "0" : "208px",
                    width: hideSidebar ? "100%" : "calc(100% - 208px)",
                    backgroundColor: "rgba(255, 255, 255, 0.8)"
                },
                className: "jsx-85a9f6e6ef799593" + " " + "hidden lg:block border-b fixed top-0 z-50 backdrop-blur-sm h-[70px]",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "jsx-85a9f6e6ef799593" + " " + "w-full h-full px-6 flex items-center justify-between",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "jsx-85a9f6e6ef799593" + " " + "flex items-center gap-2.5",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        background: profilePicUrl ? "transparent" : "#4b33e8"
                                    },
                                    className: "jsx-85a9f6e6ef799593" + " " + "w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold text-xs shrink-0 overflow-hidden",
                                    children: mounted && profilePicUrl ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
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
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "jsx-85a9f6e6ef799593" + " " + "flex-1 min-w-0",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
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
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
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
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "jsx-85a9f6e6ef799593" + " " + "flex items-center gap-3 lg:gap-3 shrink-0 ml-auto",
                            children: [
                                deviceStatus && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "jsx-85a9f6e6ef799593" + " " + "flex items-center gap-3 px-3 py-1.5 bg-gray-50/50 rounded-xl border border-gray-200/50",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "jsx-85a9f6e6ef799593" + " " + `w-8 h-8 rounded-xl flex items-center justify-center ${deviceOnlineStatus === 'offline' ? 'bg-gray-100 text-gray-400' : deviceStatus.on_call ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'}`,
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
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
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "jsx-85a9f6e6ef799593" + " " + "flex flex-col",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "jsx-85a9f6e6ef799593" + " " + "text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1",
                                                    children: deviceStatus.device_model
                                                }, void 0, false, {
                                                    fileName: "[project]/components/Header.tsx",
                                                    lineNumber: 601,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "jsx-85a9f6e6ef799593" + " " + "flex items-center gap-1.5",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "jsx-85a9f6e6ef799593" + " " + `w-1 h-1 rounded-full ${deviceOnlineStatus === 'online' ? deviceStatus.on_call ? 'bg-amber-500' : 'bg-emerald-500' : 'bg-gray-400'}`
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/Header.tsx",
                                                            lineNumber: 605,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
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
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "jsx-85a9f6e6ef799593" + " " + "relative",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>setShowNotifications(!showNotifications),
                                        className: "jsx-85a9f6e6ef799593" + " " + "p-3 rounded-xl  bg-gray-50/50 rounded-xl border border-gray-200/50 hover:bg-gray-100 transition-all active:scale-95 text-gray-600 group relative",
                                        children: unreadCount > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bell$2d$ring$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BellRing$3e$__["BellRing"], {
                                                    className: "w-5 h-5 text-indigo-600 animate-[bell_2s_infinite]"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/Header.tsx",
                                                    lineNumber: 631,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "jsx-85a9f6e6ef799593" + " " + "absolute top-1 right-1 w-4.5 h-4.5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white shadow-sm transition-transform active:scale-110",
                                                    children: unreadCount > 20 ? '20+' : unreadCount
                                                }, void 0, false, {
                                                    fileName: "[project]/components/Header.tsx",
                                                    lineNumber: 632,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bell$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Bell$3e$__["Bell"], {
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
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                id: "85a9f6e6ef799593",
                children: "@keyframes bell{0%,to{transform:rotate(0)}10%,30%,50%,70%,90%{transform:rotate(-10deg)}20%,40%,60%,80%{transform:rotate(10deg)}}"
            }, void 0, false, void 0, this),
            showNotifications && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Fragment"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        onClick: ()=>setShowNotifications(false),
                        className: "jsx-85a9f6e6ef799593" + " " + "fixed inset-0 z-40 bg-black/5"
                    }, void 0, false, {
                        fileName: "[project]/components/Header.tsx",
                        lineNumber: 656,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            fontFamily: "'Poppins', sans-serif"
                        },
                        className: "jsx-85a9f6e6ef799593" + " " + "fixed top-20 right-4 lg:right-6 w-[calc(100vw-32px)] sm:w-80 md:w-96 z-50 bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col max-h-[85vh] transition-all animate-in fade-in slide-in-from-top-4 duration-300",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-85a9f6e6ef799593" + " " + "px-6 py-5 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "jsx-85a9f6e6ef799593",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                className: "jsx-85a9f6e6ef799593" + " " + "text-base font-bold text-gray-900 leading-none",
                                                children: "Notifications"
                                            }, void 0, false, {
                                                fileName: "[project]/components/Header.tsx",
                                                lineNumber: 668,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
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
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "jsx-85a9f6e6ef799593" + " " + "flex items-center gap-2",
                                        children: [
                                            unreadCount > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>markAsSeen(),
                                                title: "Mark all as read",
                                                className: "jsx-85a9f6e6ef799593" + " " + "p-2 rounded-lg hover:bg-white hover:shadow-sm text-indigo-600 transition-all active:scale-95",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
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
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>setShowNotifications(false),
                                                className: "jsx-85a9f6e6ef799593" + " " + "p-2 rounded-lg hover:bg-white hover:shadow-sm text-gray-400 hover:text-gray-600 transition-all active:scale-95",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
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
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-85a9f6e6ef799593" + " " + "flex-1 overflow-y-auto bg-white",
                                children: notifications.length > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "jsx-85a9f6e6ef799593" + " " + "divide-y divide-gray-50",
                                    children: notifications.map((notif)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "jsx-85a9f6e6ef799593" + " " + `px-6 py-4 flex gap-4 transition-colors relative group ${notif.is_seen ? 'opacity-80' : 'bg-indigo-50/30'}`,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "jsx-85a9f6e6ef799593" + " " + `w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${notif.type === 'lead_access' ? 'bg-amber-100 text-amber-600' : 'bg-indigo-100 text-indigo-600'}`,
                                                    children: notif.type === 'lead_access' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__["AlertTriangle"], {
                                                        className: "w-5 h-5"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/Header.tsx",
                                                        lineNumber: 703,
                                                        columnNumber: 57
                                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$info$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Info$3e$__["Info"], {
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
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "jsx-85a9f6e6ef799593" + " " + "flex-1 min-w-0",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "jsx-85a9f6e6ef799593" + " " + "flex items-center justify-between gap-2 mb-1",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "jsx-85a9f6e6ef799593" + " " + "text-[10px] font-black uppercase tracking-wider text-gray-400",
                                                                    children: notif.type.replace('_', ' ')
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/Header.tsx",
                                                                    lineNumber: 708,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
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
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "jsx-85a9f6e6ef799593" + " " + `text-sm leading-relaxed ${notif.is_seen ? 'text-gray-500' : 'text-gray-800 font-medium'}`,
                                                            children: notif.message
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/Header.tsx",
                                                            lineNumber: 715,
                                                            columnNumber: 25
                                                        }, this),
                                                        notif.metadata?.employee_id && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "jsx-85a9f6e6ef799593" + " " + "flex flex-col gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity",
                                                    children: [
                                                        !notif.is_seen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            onClick: (e)=>{
                                                                e.stopPropagation();
                                                                markAsSeen(notif.id);
                                                            },
                                                            className: "jsx-85a9f6e6ef799593" + " " + "p-1.5 bg-white shadow-sm border border-gray-100 rounded-lg text-indigo-600 hover:bg-slate-50",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
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
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            onClick: (e)=>{
                                                                e.stopPropagation();
                                                                deleteNotification(notif.id);
                                                            },
                                                            className: "jsx-85a9f6e6ef799593" + " " + "p-1.5 bg-white shadow-sm border border-gray-100 rounded-lg text-red-500 hover:bg-slate-50",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__["Trash2"], {
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
                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "jsx-85a9f6e6ef799593" + " " + "px-6 py-12 flex flex-col items-center justify-center text-center",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "jsx-85a9f6e6ef799593" + " " + "w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bell$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Bell$3e$__["Bell"], {
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
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                            className: "jsx-85a9f6e6ef799593" + " " + "text-sm font-bold text-gray-900 mb-1 caps",
                                            children: "No Notifications Yet"
                                        }, void 0, false, {
                                            fileName: "[project]/components/Header.tsx",
                                            lineNumber: 756,
                                            columnNumber: 20
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
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
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-85a9f6e6ef799593" + " " + "p-4 bg-gray-50/50 border-t border-gray-100",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
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
_s(HeaderComponent, "hnrGDqIoHcbfKpJ535udMKTTSNg=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = HeaderComponent;
const Header = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["memo"])(HeaderComponent);
_c1 = Header;
const __TURBOPACK__default__export__ = Header;
var _c, _c1;
__turbopack_context__.k.register(_c, "HeaderComponent");
__turbopack_context__.k.register(_c1, "Header");
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
"[project]/pages/portal/organization/create.tsx [client] (ecmascript)", ((__turbopack_context__, module, exports) => {

const e = new Error("Could not parse module '[project]/pages/portal/organization/create.tsx'\n\nExpected '</', got 'jsx text (\r\n      )'");
e.code = 'MODULE_UNPARSABLE';
throw e;
}),
"[next]/entry/page-loader.ts { PAGE => \"[project]/pages/portal/organization/create.tsx [client] (ecmascript)\" } [client] (ecmascript)", ((__turbopack_context__, module, exports) => {

const PAGE_PATH = "/portal/organization/create";
(window.__NEXT_P = window.__NEXT_P || []).push([
    PAGE_PATH,
    ()=>{
        return __turbopack_context__.r("[project]/pages/portal/organization/create.tsx [client] (ecmascript)");
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
"[hmr-entry]/hmr-entry.js { ENTRY => \"[project]/pages/portal/organization/create.tsx\" }", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.r("[next]/entry/page-loader.ts { PAGE => \"[project]/pages/portal/organization/create.tsx [client] (ecmascript)\" } [client] (ecmascript)");
}),
]);

//# sourceMappingURL=%5Broot-of-the-server%5D__16175860._.js.map