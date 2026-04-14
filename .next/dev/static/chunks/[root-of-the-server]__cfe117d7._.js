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
                    // 0. NXUS-001 Exclusive Check (Hard rejection for Call Sessions)
                    if (item.path === '/call-sessions' && currentUser.employeeId !== 'NXUS-001') return false;
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
"[project]/components/BottomNav.tsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/styled-jsx/style.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/router.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
;
;
const BottomNav = /*#__PURE__*/ _s((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["memo"])(_c = _s(function BottomNav({ activeNav, userRole, isSuperAdmin, isClient, designation, employeeId }) {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const [isVisible, setIsVisible] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [lastScrollY, setLastScrollY] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [scrollTimer, setScrollTimer] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [hideTimer, setHideTimer] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [mounted, setMounted] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // Directly use props - AppLayout guarantees them
    // We don't need local state for role since it's passed down
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "BottomNav.BottomNav.useEffect": ()=>{
            setMounted(true);
        }
    }["BottomNav.BottomNav.useEffect"], []);
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
    const navItems = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "BottomNav.BottomNav.useMemo[navItems]": ()=>{
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
            return allNavItems.filter({
                "BottomNav.BottomNav.useMemo[navItems]": (item)=>{
                    // Special override for Call Sessions for NXUS-001
                    if (item.id === 'call-sessions' && isSpecialUser) return true;
                    // Admin check
                    if (item.adminOnly && !isAdminState) return false;
                    // User page visibility check
                    if (item.id === 'users' && !isUserPageVisible) return false;
                    // Org page visibility check
                    if (item.id === 'organization' && !isOrgVisible) return false;
                    // Team page visibility check
                    if (item.id === 'team' && !isTeamPageVisible) return false;
                    return true;
                }
            }["BottomNav.BottomNav.useMemo[navItems]"]);
        }
    }["BottomNav.BottomNav.useMemo[navItems]"], [
        mounted,
        isAdmin,
        isClient,
        designation,
        employeeId,
        allNavItems
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "BottomNav.BottomNav.useEffect": ()=>{
            const handleScroll = {
                "BottomNav.BottomNav.useEffect.handleScroll": ()=>{
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
                    const newScrollTimer = setTimeout({
                        "BottomNav.BottomNav.useEffect.handleScroll.newScrollTimer": ()=>{
                            // Show navbar after 3 seconds of no scrolling
                            setIsVisible(true);
                            // Hide navbar after 6 more seconds
                            const newHideTimer = setTimeout({
                                "BottomNav.BottomNav.useEffect.handleScroll.newScrollTimer.newHideTimer": ()=>{
                                    setIsVisible(false);
                                }
                            }["BottomNav.BottomNav.useEffect.handleScroll.newScrollTimer.newHideTimer"], 6000);
                            setHideTimer(newHideTimer);
                        }
                    }["BottomNav.BottomNav.useEffect.handleScroll.newScrollTimer"], 3000);
                    setScrollTimer(newScrollTimer);
                }
            }["BottomNav.BottomNav.useEffect.handleScroll"];
            window.addEventListener("scroll", handleScroll, {
                passive: true
            });
            return ({
                "BottomNav.BottomNav.useEffect": ()=>{
                    window.removeEventListener("scroll", handleScroll);
                    if (scrollTimer) clearTimeout(scrollTimer);
                    if (hideTimer) clearTimeout(hideTimer);
                }
            })["BottomNav.BottomNav.useEffect"];
        }
    }["BottomNav.BottomNav.useEffect"], [
        lastScrollY,
        scrollTimer,
        hideTimer
    ]);
    const handleNavClick = (path)=>{
        router.push(path);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            width: "90%",
            maxWidth: "400px"
        },
        className: "jsx-83037452c623c470" + " " + `lg:hidden fixed left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ease-in-out ${isVisible ? "bottom-8" : "-bottom-24"}`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    border: "1.5px solid white"
                },
                className: "jsx-83037452c623c470" + " " + "backdrop-blur-sm bg-white/80 shadow-2xl rounded-2xl overflow-hidden",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "jsx-83037452c623c470" + " " + "px-2 py-2.5 overflow-x-auto scrollbar-hide",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "jsx-83037452c623c470" + " " + "flex items-center justify-start sm:justify-around gap-1 min-w-max px-2",
                        children: navItems.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>handleNavClick(item.path),
                                style: {
                                    fontFamily: "'Poppins', sans-serif"
                                },
                                className: "jsx-83037452c623c470" + " " + `flex-shrink-0 flex items-center justify-center p-3 rounded-xl transition-all ${activeNav === item.id || router.pathname === item.path ? "scale-110 bg-indigo-50/50" : "hover:bg-gray-100"}`,
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                    className: "jsx-83037452c623c470" + " " + `fi flex ${item.icon} text-xl transition-colors ${activeNav === item.id || router.pathname === item.path || router.pathname === '/portal' + item.path ? "text-[#4b33e8]" : "text-gray-600"}`
                                }, void 0, false, {
                                    fileName: "[project]/components/BottomNav.tsx",
                                    lineNumber: 215,
                                    columnNumber: 17
                                }, this)
                            }, item.id, false, {
                                fileName: "[project]/components/BottomNav.tsx",
                                lineNumber: 205,
                                columnNumber: 15
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/components/BottomNav.tsx",
                        lineNumber: 203,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/components/BottomNav.tsx",
                    lineNumber: 202,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/BottomNav.tsx",
                lineNumber: 198,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                id: "83037452c623c470",
                children: ".scrollbar-hide.jsx-83037452c623c470::-webkit-scrollbar{display:none}.scrollbar-hide.jsx-83037452c623c470{-ms-overflow-style:none;scrollbar-width:none}"
            }, void 0, false, void 0, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/BottomNav.tsx",
        lineNumber: 191,
        columnNumber: 5
    }, this);
}, "1WB7qiLzD+alFVr2EMGYAzlKDk4=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
})), "1WB7qiLzD+alFVr2EMGYAzlKDk4=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c1 = BottomNav;
const __TURBOPACK__default__export__ = BottomNav;
var _c, _c1;
__turbopack_context__.k.register(_c, "BottomNav$memo");
__turbopack_context__.k.register(_c1, "BottomNav");
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
"[project]/components/AppLayout.tsx [client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>AppLayout
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/router.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Sidebar$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/Sidebar.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Header$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/Header.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$BottomNav$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/BottomNav.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$UserContext$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/context/UserContext.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$authService$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/authService.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$monitoring$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/monitoring.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$UtilitySidebar$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/UtilitySidebar.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$AppLogo$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/AppLogo.tsx [client] (ecmascript)");
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
function AppLayout({ children, hideSidebar = false, hideHeader = false }) {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const { user, loading: authLoading, error, mounted, statusMessage } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$UserContext$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["useUser"])();
    const handleLogoutClick = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AppLayout.useCallback[handleLogoutClick]": async ()=>{
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$authService$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["handleLogout"])(router);
        }
    }["AppLayout.useCallback[handleLogoutClick]"], [
        router
    ]);
    // 🛰️ Sentinel: Track Page Visits
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AppLayout.useEffect": ()=>{
            if (mounted && user && !router.pathname.includes('/login')) {
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$monitoring$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["logSystemEvent"])({
                    event_type: 'READ',
                    description: `Page Visit: ${router.pathname}`,
                    path: router.pathname,
                    user_name: user.displayName || 'User',
                    organization_id: user.organization_id || undefined
                });
            }
        }
    }["AppLayout.useEffect"], [
        router.pathname,
        user?.uid,
        mounted
    ]);
    const isAuthPage = [
        '/portal/login',
        '/portal/signup',
        '/portal/signup-success'
    ].includes(router.pathname);
    // Loading state: Wait for mount, auth finish, and user availability
    if (!mounted || authLoading || !user && !isAuthPage) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex flex-col min-h-screen items-center justify-center bg-[#f6f5ff]",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-col items-center gap-6 animate-in fade-in zoom-in duration-500",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "scale-125 mb-4",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$AppLogo$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                            fileName: "[project]/components/AppLayout.tsx",
                            lineNumber: 51,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/AppLayout.tsx",
                        lineNumber: 50,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-col items-center gap-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "w-12 h-12 border-4 border-[#4b33e8] border-t-transparent rounded-full animate-spin"
                            }, void 0, false, {
                                fileName: "[project]/components/AppLayout.tsx",
                                lineNumber: 54,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-[#263238] font-bold text-lg animate-pulse",
                                style: {
                                    fontFamily: "'Poppins', sans-serif"
                                },
                                children: statusMessage || "Retrieving logged details..."
                            }, void 0, false, {
                                fileName: "[project]/components/AppLayout.tsx",
                                lineNumber: 55,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-[#787E9D] text-sm font-medium",
                                children: "Please wait while we sync your session"
                            }, void 0, false, {
                                fileName: "[project]/components/AppLayout.tsx",
                                lineNumber: 58,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/AppLayout.tsx",
                        lineNumber: 53,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/AppLayout.tsx",
                lineNumber: 49,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/components/AppLayout.tsx",
            lineNumber: 48,
            columnNumber: 7
        }, this);
    }
    // Error/Redirect state
    if (error) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex min-h-screen items-center justify-center",
            style: {
                backgroundColor: "#f6f5f7"
            },
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-lg mb-4 text-red-500",
                        children: error
                    }, void 0, false, {
                        fileName: "[project]/components/AppLayout.tsx",
                        lineNumber: 73,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-sm",
                        style: {
                            color: "#4b33e8"
                        },
                        children: "Redirecting to login..."
                    }, void 0, false, {
                        fileName: "[project]/components/AppLayout.tsx",
                        lineNumber: 74,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/AppLayout.tsx",
                lineNumber: 72,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/components/AppLayout.tsx",
            lineNumber: 68,
            columnNumber: 7
        }, this);
    }
    // Determine role props
    const userRole = user?.role || null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex min-h-screen w-full overflow-x-hidden",
        style: {
            backgroundColor: "#f6f5f7",
            maxWidth: "100vw"
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("style", {
                children: `
        .recharts-wrapper:focus, .recharts-surface:focus { outline: none !important; }
        button:focus { outline: none !important; }
        .recharts-area-rectangle:focus, .recharts-bar-rectangle:focus, .recharts-pie-sector:focus { outline: none !important; }
      `
            }, void 0, false, {
                fileName: "[project]/components/AppLayout.tsx",
                lineNumber: 90,
                columnNumber: 7
            }, this),
            !hideSidebar && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Sidebar$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                user: user,
                userRole: userRole,
                onLogout: handleLogoutClick
            }, void 0, false, {
                fileName: "[project]/components/AppLayout.tsx",
                lineNumber: 98,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: `flex-1 flex flex-col ${!hideSidebar ? 'lg:ml-52' : ''} w-full min-w-0 overflow-x-hidden`,
                children: [
                    !hideHeader && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Header$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                        user: user,
                        onLogout: handleLogoutClick,
                        hideSidebar: hideSidebar
                    }, void 0, false, {
                        fileName: "[project]/components/AppLayout.tsx",
                        lineNumber: 109,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                        className: `flex-1 overflow-y-auto overflow-x-hidden min-w-0 max-w-full ${!hideHeader ? 'pt-[60px] lg:pt-[70px]' : ''}`,
                        style: {
                            backgroundColor: "#f6f5f7"
                        },
                        children: children
                    }, void 0, false, {
                        fileName: "[project]/components/AppLayout.tsx",
                        lineNumber: 117,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/AppLayout.tsx",
                lineNumber: 106,
                columnNumber: 7
            }, this),
            !hideSidebar && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$BottomNav$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                activeNav: router.pathname.replace('/portal', '').replace('/', '') || 'dashboard',
                userRole: userRole,
                isClient: user?.isClient,
                designation: user?.designation,
                employeeId: user?.employeeId
            }, void 0, false, {
                fileName: "[project]/components/AppLayout.tsx",
                lineNumber: 127,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$UtilitySidebar$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/components/AppLayout.tsx",
                lineNumber: 137,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/AppLayout.tsx",
        lineNumber: 86,
        columnNumber: 5
    }, this);
}
_s(AppLayout, "McqxV0YD8MtaNlIX9Gq/YR6Gb18=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$UserContext$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["useUser"]
    ];
});
_c = AppLayout;
var _c;
__turbopack_context__.k.register(_c, "AppLayout");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/CampaignCard.tsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/router.js [client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
const CampaignCard = ({ campaign, onEdit, onDelete, isEditVisible = true, isDeleteVisible = true })=>{
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRouter"])();
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
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        onClick: handleCardClick,
        className: "group relative bg-white rounded-2xl p-5 shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden cursor-pointer",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-gray-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            }, void 0, false, {
                fileName: "[project]/components/CampaignCard.tsx",
                lineNumber: 73,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative z-10",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mb-0",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-start justify-between mb-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
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
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: `flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(campaign.status)}`,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: `w-1.5 h-1.5 rounded-full ${getStatusDotColor(campaign.status)}`
                                            }, void 0, false, {
                                                fileName: "[project]/components/CampaignCard.tsx",
                                                lineNumber: 88,
                                                columnNumber: 29
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
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
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
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
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-2 mb-4 bg-blue-50/50 p-2 rounded-lg border border-blue-100 group-hover:bg-blue-50 transition-colors",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "w-6 h-6 rounded-md bg-blue-500 flex items-center justify-center text-white shrink-0 shadow-sm",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
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
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex-1 min-w-0",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-[10px] uppercase font-black text-blue-400 tracking-widest leading-none mb-0.5",
                                                children: "Assigned Asset"
                                            }, void 0, false, {
                                                fileName: "[project]/components/CampaignCard.tsx",
                                                lineNumber: 105,
                                                columnNumber: 29
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-xs font-bold text-blue-900 truncate",
                                                children: [
                                                    campaign.organizations?.company_name || 'Individual Managed',
                                                    campaign.organizations?.org_code && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
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
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-3 gap-2 mb-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex flex-col items-center justify-center p-2 rounded-xl bg-gray-50 group-hover:bg-purple-50/50 transition-colors border border-gray-100",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mb-1 text-blue-600",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
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
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-lg font-bold text-gray-700",
                                        children: campaign.pending_calls ?? 0
                                    }, void 0, false, {
                                        fileName: "[project]/components/CampaignCard.tsx",
                                        lineNumber: 120,
                                        columnNumber: 25
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
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
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex flex-col items-center justify-center p-2 rounded-xl bg-gray-50 group-hover:bg-purple-50/50 transition-colors border border-gray-100",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center mb-1 text-purple-600",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
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
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-lg font-bold text-gray-700",
                                        children: campaign.upcoming_followups ?? 0
                                    }, void 0, false, {
                                        fileName: "[project]/components/CampaignCard.tsx",
                                        lineNumber: 127,
                                        columnNumber: 25
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
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
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex flex-col items-center justify-center p-2 rounded-xl bg-gray-50 group-hover:bg-purple-50/50 transition-colors border border-gray-100",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "w-8 h-8 rounded-full bg-red-100 flex items-center justify-center mb-1 text-red-600",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
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
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-lg font-bold text-gray-700",
                                        children: campaign.overdue_followups ?? 0
                                    }, void 0, false, {
                                        fileName: "[project]/components/CampaignCard.tsx",
                                        lineNumber: 134,
                                        columnNumber: 25
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
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
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-2 gap-2 mb-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center justify-center gap-2 h-[35px] rounded-xl bg-gray-50/80 group-hover:bg-purple-50/50 transition-colors border border-gray-100",
                                title: "Talktime",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                        className: "fi flex fi-rr-microphone-alt text-blue-500 text-[10px]"
                                    }, void 0, false, {
                                        fileName: "[project]/components/CampaignCard.tsx",
                                        lineNumber: 142,
                                        columnNumber: 25
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
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
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center justify-center gap-2 h-[35px] rounded-xl bg-gray-50/80 group-hover:bg-purple-50/50 transition-colors border border-gray-100",
                                title: "Total Dials",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                        className: "fi flex fi-rr-phone-call text-purple-500 text-[10px]"
                                    }, void 0, false, {
                                        fileName: "[project]/components/CampaignCard.tsx",
                                        lineNumber: 146,
                                        columnNumber: 25
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
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
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-between pt-4 border-t border-gray-100",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex flex-col gap-1",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-xs text-gray-400 group-hover:text-purple-500 transition-colors flex items-center gap-1.5 cursor-pointer",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                className: "fi flex fi-rr-users-alt text-sm"
                                            }, void 0, false, {
                                                fileName: "[project]/components/CampaignCard.tsx",
                                                lineNumber: 154,
                                                columnNumber: 29
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
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
                                    (campaign.created_by || campaign.employee_id) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-xs mt-1 text-gray-400 group-hover:text-purple-500 transition-colors flex items-center gap-1.5 cursor-pointer",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                className: "fi flex fi-rr-user text-sm"
                                            }, void 0, false, {
                                                fileName: "[project]/components/CampaignCard.tsx",
                                                lineNumber: 161,
                                                columnNumber: 33
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
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
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-2 opacity-80 group-hover:opacity-100 transition-opacity",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        className: "w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:text-purple-600 hover:bg-purple-50 transition-all focus:outline-none",
                                        title: "Call",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
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
                                    isEditVisible && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        className: "w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-all focus:outline-none",
                                        title: "Edit",
                                        onClick: (e)=>{
                                            e.stopPropagation();
                                            onEdit?.(campaign);
                                        },
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
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
                                    isDeleteVisible && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        className: "w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 transition-all focus:outline-none",
                                        title: "Delete",
                                        onClick: (e)=>{
                                            e.stopPropagation();
                                            onDelete?.(campaign.id);
                                        },
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
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
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-4 flex justify-end",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                            className: "text-xs font-semibold text-gray-400 group-hover:text-purple-600 flex items-center gap-1 transition-colors cursor-pointer",
                            children: [
                                "View Details ",
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
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
_s(CampaignCard, "fN7XvhJ+p5oE6+Xlo0NJmXpxjC8=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = CampaignCard;
const __TURBOPACK__default__export__ = CampaignCard;
var _c;
__turbopack_context__.k.register(_c, "CampaignCard");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/AddCampaignModal.tsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>AddCampaignModal
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabase.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$UserContext$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/context/UserContext.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$monitoring$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/monitoring.ts [client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
;
;
;
function AddCampaignModal({ isOpen, onClose, onSuccess, users, loadingUsers, campaign }) {
    _s();
    const { user: currentUser } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$UserContext$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["useUser"])();
    const [campaignName, setCampaignName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [campaignDescription, setCampaignDescription] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [selectedUsers, setSelectedUsers] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [campaignId, setCampaignId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [isSubmitting, setIsSubmitting] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [searchTerm, setSearchTerm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [campaignStatus, setCampaignStatus] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])("active");
    const [activeTab, setActiveTab] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])("info"); // info, org, team
    const [organizations, setOrganizations] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [selectedOrgId, setSelectedOrgId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [loadingOrgs, setLoadingOrgs] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // Fetch organizations
    const fetchOrganizations = async ()=>{
        try {
            setLoadingOrgs(true);
            const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["supabase"].from('organizations').select('id, company_name, org_code').eq('is_active', true);
            if (error) throw error;
            setOrganizations(data || []);
        } catch (err) {
            console.error("Error fetching organizations:", err);
        } finally{
            setLoadingOrgs(false);
        }
    };
    // Initialize form when modal opens or campaign changes
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AddCampaignModal.useEffect": ()=>{
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
                        setSelectedUsers(campaign.users.map({
                            "AddCampaignModal.useEffect": (u)=>u.user_id || u.id
                        }["AddCampaignModal.useEffect"]).filter(Boolean));
                    } else {
                        setSelectedUsers([]);
                    }
                } else {
                    // Creation mode - Sequential ID generation
                    const getNextId = {
                        "AddCampaignModal.useEffect.getNextId": async ()=>{
                            try {
                                const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["supabase"].from('campaigns').select('id').order('id', {
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
                        }
                    }["AddCampaignModal.useEffect.getNextId"];
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
        }
    }["AddCampaignModal.useEffect"], [
        isOpen,
        campaign
    ]);
    // Clear selected users that don't belong to the new organization
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AddCampaignModal.useEffect": ()=>{
            if (selectedOrgId && users.length > 0) {
                setSelectedUsers({
                    "AddCampaignModal.useEffect": (prev)=>{
                        // Find IDs of users that are selected but don't belong to the selected org
                        const invalidIds = prev.filter({
                            "AddCampaignModal.useEffect.invalidIds": (uid)=>{
                                const user = users.find({
                                    "AddCampaignModal.useEffect.invalidIds.user": (u)=>u.user_id === uid || u.id === uid
                                }["AddCampaignModal.useEffect.invalidIds.user"]);
                                // If user not found (maybe loading) or org doesn't match, it's invalid
                                // Note: If user data doesn't have organization_id yet (legacy), we might skip this check 
                                // or assume it's valid? adhering strictly: if org_id mismatches, remove.
                                return user && user.organization_id && user.organization_id !== selectedOrgId;
                            }
                        }["AddCampaignModal.useEffect.invalidIds"]);
                        if (invalidIds.length > 0) {
                            return prev.filter({
                                "AddCampaignModal.useEffect": (uid)=>!invalidIds.includes(uid)
                            }["AddCampaignModal.useEffect"]);
                        }
                        return prev;
                    }
                }["AddCampaignModal.useEffect"]);
            }
        }
    }["AddCampaignModal.useEffect"], [
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
            const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["supabase"].from("campaigns").upsert([
                campaignData
            ]);
            if (error) {
                alert("Error saving campaign: " + error.message);
            } else {
                onSuccess();
                onClose();
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$monitoring$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["logSystemEvent"])({
                    event_type: 'WRITE',
                    description: campaign ? `Update Campaign: ${campaignName}` : `Create Campaign: ${campaignName}`,
                    metadata: {
                        campaign_id: campaignId,
                        campaign_name: campaignName,
                        organization_id: selectedOrgId,
                        user_count: selectedUsers.length
                    },
                    payload_size: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$monitoring$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["estimateSize"])(campaignData),
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
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed inset-0 z-[120] backdrop-blur-sm bg-black/30 flex items-center justify-center p-4 text-xs font-sans",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "relative w-full max-w-4xl transform rounded-lg bg-white  flex flex-col border border-gray-100 overflow-hidden animate-in fade-in zoom-in duration-200 h-[85vh]",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-white shrink-0",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-4",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        className: "font-bold text-gray-800",
                                        children: campaign ? 'Modify Campaign' : 'Initiate Campaign'
                                    }, void 0, false, {
                                        fileName: "[project]/components/AddCampaignModal.tsx",
                                        lineNumber: 246,
                                        columnNumber: 29
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
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
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: onClose,
                            className: "text-gray-400 hover:text-gray-600 p-1",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
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
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex border-b border-gray-100 bg-white shrink-0",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>setActiveTab("info"),
                            className: `flex-1 py-4 flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-widest transition-all relative ${activeTab === 'info' ? 'text-indigo-600' : 'text-gray-400 hover:text-gray-600'}`,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                    className: `fi flex ${activeTab === 'info' ? 'fi-sr-info' : 'fi-rr-info'} text-sm`
                                }, void 0, false, {
                                    fileName: "[project]/components/AddCampaignModal.tsx",
                                    lineNumber: 268,
                                    columnNumber: 25
                                }, this),
                                "Basic Information",
                                activeTab === 'info' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                        !currentUser?.isClient && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>setActiveTab("org"),
                            className: `flex-1 py-4 flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-widest transition-all relative ${activeTab === 'org' ? 'text-indigo-600' : 'text-gray-400 hover:text-gray-600'}`,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                    className: `fi flex ${activeTab === 'org' ? 'fi-sr-building' : 'fi-rr-building'} text-sm`
                                }, void 0, false, {
                                    fileName: "[project]/components/AddCampaignModal.tsx",
                                    lineNumber: 277,
                                    columnNumber: 29
                                }, this),
                                "Organization",
                                activeTab === 'org' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>setActiveTab("team"),
                            className: `flex-1 py-4 flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-widest transition-all relative ${activeTab === 'team' ? 'text-indigo-600' : 'text-gray-400 hover:text-gray-600'}`,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                    className: `fi flex ${activeTab === 'team' ? 'fi-sr-users' : 'fi-rr-users'} text-sm`
                                }, void 0, false, {
                                    fileName: "[project]/components/AddCampaignModal.tsx",
                                    lineNumber: 286,
                                    columnNumber: 25
                                }, this),
                                "Team Personnel",
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: `ml-1.5 px-1.5 py-0.5 rounded text-[8px] font-bold ${selectedUsers.length > 0 ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-400'}`,
                                    children: selectedUsers.length
                                }, void 0, false, {
                                    fileName: "[project]/components/AddCampaignModal.tsx",
                                    lineNumber: 288,
                                    columnNumber: 26
                                }, this),
                                activeTab === 'team' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex-1 overflow-y-auto custom-scrollbar",
                    children: [
                        activeTab === 'info' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "p-6 space-y-6",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "grid grid-cols-1 md:grid-cols-2 gap-6",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "space-y-6",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "bg-white p-5 rounded-lg border border-gray-100  space-y-4",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                    className: "text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4",
                                                    children: "Protocol Metadata"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/AddCampaignModal.tsx",
                                                    lineNumber: 304,
                                                    columnNumber: 41
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "space-y-1.5",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            className: "text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-0.5",
                                                            children: "Campaign ID"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/AddCampaignModal.tsx",
                                                            lineNumber: 307,
                                                            columnNumber: 45
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "relative",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                    type: "text",
                                                                    value: campaignId,
                                                                    readOnly: true,
                                                                    className: "w-full h-9 px-3 bg-gray-50 border border-gray-200 rounded text-[11px] font-mono font-bold text-gray-500 outline-none"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/AddCampaignModal.tsx",
                                                                    lineNumber: 309,
                                                                    columnNumber: 49
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
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
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "space-y-1.5",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            className: "text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-0.5",
                                                            children: "Functional Status"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/AddCampaignModal.tsx",
                                                            lineNumber: 320,
                                                            columnNumber: 45
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            onClick: ()=>setCampaignStatus((prev)=>prev === 'active' ? 'inactive' : 'active'),
                                                            className: `w-full h-9 rounded border cursor-pointer transition-all flex items-center justify-between px-3 ${campaignStatus === 'active' ? 'bg-emerald-50 border-emerald-100' : 'bg-rose-50 border-rose-100'}`,
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "flex items-center gap-2",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: `w-2 h-2 rounded-full ${campaignStatus === 'active' ? 'bg-emerald-500' : 'bg-rose-500'}`
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/AddCampaignModal.tsx",
                                                                            lineNumber: 326,
                                                                            columnNumber: 53
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
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
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: `w-8 h-4 rounded-full relative transition-all ${campaignStatus === 'active' ? 'bg-emerald-500' : 'bg-gray-300'}`,
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "space-y-6",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "bg-white p-5 rounded-lg border border-gray-100  space-y-4",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                    className: "text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4",
                                                    children: "Identity Details"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/AddCampaignModal.tsx",
                                                    lineNumber: 341,
                                                    columnNumber: 41
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "space-y-1.5",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            className: "text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-0.5",
                                                            children: "Campaign Name *"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/AddCampaignModal.tsx",
                                                            lineNumber: 344,
                                                            columnNumber: 45
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
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
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "space-y-1.5",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            className: "text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-0.5",
                                                            children: "Strategic Description"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/AddCampaignModal.tsx",
                                                            lineNumber: 355,
                                                            columnNumber: 45
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
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
                        activeTab === 'org' && !currentUser?.isClient && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "p-6 space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
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
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4",
                                    children: loadingOrgs ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "col-span-full py-20 flex flex-col items-center justify-center gap-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"
                                            }, void 0, false, {
                                                fileName: "[project]/components/AddCampaignModal.tsx",
                                                lineNumber: 380,
                                                columnNumber: 41
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
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
                                    }, this) : organizations.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "col-span-full py-10 bg-gray-50/50 rounded-lg border border-dashed border-gray-200 text-center",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
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
                                    }, this) : organizations.filter((org)=>!currentUser?.isClient || org.id === currentUser.organization_id).map((org)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            onClick: ()=>{
                                                if (!currentUser?.isClient) {
                                                    setSelectedOrgId(org.id);
                                                }
                                            },
                                            className: `relative p-4 rounded-lg border transition-all ${currentUser?.isClient ? 'cursor-default' : 'cursor-pointer'} ${selectedOrgId === org.id ? 'bg-indigo-50 border-indigo-500 ' : 'bg-white border-gray-100 hover:border-indigo-200'}`,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center justify-between mb-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "w-8 h-8 rounded bg-white border border-gray-100 flex items-center justify-center text-gray-400",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
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
                                                        selectedOrgId === org.id && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
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
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                    className: "text-[11px] font-bold text-gray-800 truncate uppercase tracking-tight",
                                                    children: org.company_name
                                                }, void 0, false, {
                                                    fileName: "[project]/components/AddCampaignModal.tsx",
                                                    lineNumber: 410,
                                                    columnNumber: 45
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
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
                        activeTab === 'team' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "h-full flex flex-col md:flex-row animate-in fade-in slide-in-from-bottom-2 duration-300",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "w-full md:w-[320px] p-5 bg-white border-r border-gray-100 flex flex-col shrink-0",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "mb-4",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: "block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 pl-0.5",
                                                    children: "Personnel Pool Search"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/AddCampaignModal.tsx",
                                                    lineNumber: 425,
                                                    columnNumber: 37
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "relative",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
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
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
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
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar",
                                            children: loadingUsers ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "py-10 text-center",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/AddCampaignModal.tsx",
                                                        lineNumber: 441,
                                                        columnNumber: 45
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
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
                                            }, this) : filteredUsers.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "py-10 text-center bg-gray-50/50 rounded-lg",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
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
                                            }, this) : filteredUsers.map((user)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: `w-3.5 h-3.5 rounded border flex items-center justify-center transition-all ${selectedUsers.includes(user.user_id) ? 'bg-indigo-600 border-indigo-600' : 'bg-white border-gray-300'}`,
                                                            children: selectedUsers.includes(user.user_id) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
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
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "w-7 h-7 rounded overflow-hidden shrink-0 border border-gray-100",
                                                            children: user.profile_pic_url ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                                src: user.profile_pic_url,
                                                                className: "w-full h-full object-cover",
                                                                alt: ""
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/AddCampaignModal.tsx",
                                                                lineNumber: 468,
                                                                columnNumber: 57
                                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex-1 min-w-0",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                                    className: "text-[10px] font-bold text-gray-800 truncate uppercase mt-0.5",
                                                                    children: user.user_name || 'N/A'
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/AddCampaignModal.tsx",
                                                                    lineNumber: 476,
                                                                    columnNumber: 53
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
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
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex-1 p-5 bg-gray-50/30 overflow-y-auto custom-scrollbar",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center justify-between mb-4",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
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
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "grid grid-cols-1 sm:grid-cols-2 gap-3",
                                            children: selectedUsers.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "col-span-full h-40 flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-lg bg-white/50",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
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
                                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center gap-3 bg-white border border-gray-100 p-2 rounded-lg  group",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "w-8 h-8 rounded border border-gray-100 shrink-0 bg-indigo-50 flex items-center justify-center text-indigo-400 font-bold text-[10px]",
                                                            children: u?.user_name?.charAt(0) || 'U'
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/AddCampaignModal.tsx",
                                                            lineNumber: 501,
                                                            columnNumber: 53
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex-1 min-w-0",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                                    className: "text-[10px] font-bold text-gray-800 truncate uppercase",
                                                                    children: u?.user_name || 'Anonymous'
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/AddCampaignModal.tsx",
                                                                    lineNumber: 505,
                                                                    columnNumber: 57
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
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
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            onClick: ()=>setSelectedUsers((prev)=>prev.filter((id)=>id !== uid)),
                                                            className: "p-1 px-1.5 text-gray-300 hover:text-rose-500 transition-all opacity-0 group-hover:opacity-100",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
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
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "px-5 py-3 border-t border-gray-100 flex items-center justify-between bg-white shrink-0 rounded-b-lg",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: onClose,
                            className: "px-4 py-1.5 border border-gray-200 text-gray-600 rounded hover:bg-gray-50 font-semibold transition-all",
                            children: "Abort Sequence"
                        }, void 0, false, {
                            fileName: "[project]/components/AddCampaignModal.tsx",
                            lineNumber: 526,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
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
_s(AddCampaignModal, "IIUC9HTMpB/xxBo35vEwpr3mI8Y=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$UserContext$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["useUser"]
    ];
});
_c = AddCampaignModal;
var _c;
__turbopack_context__.k.register(_c, "AddCampaignModal");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/pages/portal/campaign.tsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Campaign
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/router.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$AppLayout$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/components/AppLayout.tsx [client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$UserContext$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/context/UserContext.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabase.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$monitoring$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/monitoring.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$CampaignCard$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/CampaignCard.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$AddCampaignModal$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/AddCampaignModal.tsx [client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
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
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const { user, mounted } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$UserContext$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["useUser"])();
    const [activeNav] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])("campaign");
    const [campaigns, setCampaigns] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loadingCampaigns, setLoadingCampaigns] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [showAddCampaignModal, setShowAddCampaignModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [editingCampaign, setEditingCampaign] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [searchQuery, setSearchQuery] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])("");
    // Campaign creation state moved to AddCampaignModal component
    const [users, setUsers] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loadingUsers, setLoadingUsers] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const permissionFlags = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "Campaign.useMemo[permissionFlags]": ()=>{
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
        }
    }["Campaign.useMemo[permissionFlags]"], [
        user,
        mounted
    ]);
    const fetchCampaigns = async ()=>{
        if (!user) return; // Wait for user
        try {
            setLoadingCampaigns(true);
            // 1. Base Query
            let query = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["supabase"].from("campaigns").select("*, organizations(id, company_name, org_code)").order("created_at", {
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
                    const { data: teamData } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["supabase"].from('teams').select('members').eq('leader_id', user.uid).eq('is_active', true);
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
                const { data: allOrgCamps } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["supabase"].from('campaigns').select('*, organizations(id, company_name, org_code)').eq('organization_id', user.organization_id);
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
            const { data: statsData, error: statsError } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["supabase"].rpc('get_campaign_stats');
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
            const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["supabase"].from("user_profiles").select("id, user_id, email, user_name, profile_pic_url, employee_id, organization_id").order("created_at", {
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
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Campaign.useEffect": ()=>{
            if (mounted && user) {
                fetchCampaigns();
            }
            const handleFocus = {
                "Campaign.useEffect.handleFocus": ()=>{
                    if (mounted && user) fetchCampaigns();
                }
            }["Campaign.useEffect.handleFocus"];
            window.addEventListener("focus", handleFocus);
            return ({
                "Campaign.useEffect": ()=>window.removeEventListener("focus", handleFocus)
            })["Campaign.useEffect"];
        // eslint-disable-next-line react-hooks/exhaustive-deps
        }
    }["Campaign.useEffect"], [
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
                const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["supabase"].from("campaigns").delete().eq("id", id);
                if (error) {
                    alert("Error deleting campaign: " + error.message);
                } else {
                    alert("Campaign deleted successfully!");
                    fetchCampaigns();
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$monitoring$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["logSystemEvent"])({
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
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                                        children: "Campaigns"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/portal/campaign.tsx",
                                        lineNumber: 354,
                                        columnNumber: 11
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
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
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "relative overflow-hidden rounded-2xl p-4 sm:p-5 transition-all duration-200 flex flex-col hover:shadow-lg hover:scale-105 h-30 sm:h-38",
                                    style: {
                                        backgroundColor: "white"
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "absolute inset-0",
                                            style: {
                                                backgroundColor: "radial-gradient(circle at top right, rgba(75, 51, 232, 0.12), transparent 60%)"
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/pages/portal/campaign.tsx",
                                            lineNumber: 363,
                                            columnNumber: 11
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "absolute -right-8 -top-8 w-32 h-32 rounded-full bg-purple-200/20 blur-2xl"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/portal/campaign.tsx",
                                            lineNumber: 364,
                                            columnNumber: 11
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "absolute -right-2 -bottom-2",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
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
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "relative flex flex-col h-full z-10",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-start justify-between mb-auto",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
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
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "mt-auto",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
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
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
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
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "relative overflow-hidden rounded-2xl p-4 sm:p-5 transition-all duration-200 flex flex-col hover:shadow-lg hover:scale-105 h-30 sm:h-38",
                                    style: {
                                        backgroundColor: "white"
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "absolute inset-0",
                                            style: {
                                                background: "radial-gradient(circle at top right, rgba(16, 185, 129, 0.12), transparent 60%)"
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/pages/portal/campaign.tsx",
                                            lineNumber: 380,
                                            columnNumber: 11
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "absolute -right-8 -top-8 w-32 h-32 rounded-full bg-green-200/20 blur-2xl"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/portal/campaign.tsx",
                                            lineNumber: 381,
                                            columnNumber: 11
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "absolute -right-2 -bottom-2",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
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
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "relative flex flex-col h-full z-10",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-start justify-between mb-auto",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
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
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "mt-auto",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
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
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
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
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "relative overflow-hidden rounded-2xl p-4 sm:p-5 transition-all duration-200 flex flex-col hover:shadow-lg hover:scale-105 h-30 sm:h-38",
                                    style: {
                                        backgroundColor: "white"
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "absolute inset-0",
                                            style: {
                                                background: "radial-gradient(circle at top right, rgba(249, 115, 22, 0.12), transparent 60%)"
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/pages/portal/campaign.tsx",
                                            lineNumber: 397,
                                            columnNumber: 11
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "absolute -right-8 -top-8 w-32 h-32 rounded-full bg-orange-200/20 blur-2xl"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/portal/campaign.tsx",
                                            lineNumber: 398,
                                            columnNumber: 11
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "absolute -right-2 -bottom-2",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
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
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "relative flex flex-col h-full z-10",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-start justify-between mb-auto",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
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
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "mt-auto",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
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
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
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
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "relative overflow-hidden rounded-2xl pt-4 sm:pt-5 px-4 sm:px-5 pb-0 transition-all duration-200 flex flex-col hover:shadow-lg hover:scale-105 h-30 sm:h-38",
                                    style: {
                                        backgroundColor: "#4b33e8",
                                        color: 'white'
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "absolute inset-0",
                                            style: {
                                                background: "linear-gradient(135deg, #4b33e8 0%, #6366f1 100%)"
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/pages/portal/campaign.tsx",
                                            lineNumber: 414,
                                            columnNumber: 11
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "absolute -bottom-12 -right-12 w-40 h-40 rounded-full bg-white/10 blur-3xl"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/portal/campaign.tsx",
                                            lineNumber: 415,
                                            columnNumber: 11
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "relative flex flex-col h-full z-10",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-start justify-between mb-4",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex flex-col",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
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
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "flex items-center gap-1.5 mt-1 bg-white/10 px-2 py-0.5 rounded-full w-fit",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "w-1 h-1 rounded-full bg-green-400 animate-pulse"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/pages/portal/campaign.tsx",
                                                                            lineNumber: 422,
                                                                            columnNumber: 15
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
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
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "text-right flex flex-col items-end",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-[9px] text-white/60 leading-none uppercase font-bold tracking-wider mb-0.5",
                                                                    children: "Avg Yield"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/campaign.tsx",
                                                                    lineNumber: 427,
                                                                    columnNumber: 14
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
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
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex-1 flex items-end gap-2 min-h-0",
                                                    children: campaigns.filter((c)=>c.status === 'active').length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex flex-col items-center justify-center w-full h-full opacity-40",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                                className: "fi flex fi-rr-chart-line-up text-xl mb-1"
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/campaign.tsx",
                                                                lineNumber: 439,
                                                                columnNumber: 15
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
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
                                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex-1 flex flex-col items-center group/bar relative h-full justify-end",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
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
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "w-full bg-white/30 rounded-t-[4px] transition-all duration-500 hover:bg-white hover:shadow-[0_0_20px_rgba(255,255,255,0.6)] cursor-help relative",
                                                                    style: {
                                                                        height: `${Math.max(perf, 5)}%`
                                                                    },
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "absolute -top-12 left-1/2 -translate-x-1/2 bg-white text-[#4b33e8] px-2 py-1 rounded-md text-[8px] font-black opacity-0 group-hover/bar:opacity-100 transition-opacity whitespace-nowrap shadow-xl z-20 pointer-events-none border border-purple-100 uppercase tracking-tighter",
                                                                        children: [
                                                                            c.name || 'CAM',
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mt-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex flex-col lg:flex-row lg:items-center gap-3 w-full lg:w-auto",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "w-full lg:w-auto",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "relative w-full min-w-[180px] sm:min-w-[220px]",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
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
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
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
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex flex-wrap lg:flex-nowrap items-center gap-2 sm:gap-3 justify-start lg:justify-end w-full lg:w-auto",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                type: "button",
                                                className: "inline-flex items-center justify-center gap-2 px-3 h-[42px] w-[42px] sm:w-auto rounded-xl border border-gray-300 bg-white text-xs sm:text-sm text-gray-700 hover:bg-gray-50 transition-colors",
                                                style: {
                                                    fontFamily: "'Poppins', sans-serif"
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                        className: "fi flex fi-rr-filter text-xs sm:text-sm"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/campaign.tsx",
                                                        lineNumber: 494,
                                                        columnNumber: 13
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
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
                                            permissionFlags.isCreateCampaginButtonVisible && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
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
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                        className: "fi flex fi-rr-plus text-base"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/campaign.tsx",
                                                        lineNumber: 506,
                                                        columnNumber: 14
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
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
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4",
                            children: loadingCampaigns ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "col-span-full text-center py-8",
                                children: "Loading campaigns..."
                            }, void 0, false, {
                                fileName: "[project]/pages/portal/campaign.tsx",
                                lineNumber: 516,
                                columnNumber: 11
                            }, this) : filtered.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "col-span-full text-center py-8 text-gray-500",
                                children: "No campaigns found."
                            }, void 0, false, {
                                fileName: "[project]/pages/portal/campaign.tsx",
                                lineNumber: 518,
                                columnNumber: 11
                            }, this) : filtered.map((c)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$CampaignCard$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {
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
            showAddCampaignModal && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$AddCampaignModal$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {
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
_s(Campaign, "7gV3+YX42+hm+/83YB1RNpxFoBU=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$UserContext$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["useUser"]
    ];
});
_c = Campaign;
var _c;
__turbopack_context__.k.register(_c, "Campaign");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[next]/entry/page-loader.ts { PAGE => \"[project]/pages/portal/campaign.tsx [client] (ecmascript)\" } [client] (ecmascript)", ((__turbopack_context__, module, exports) => {

const PAGE_PATH = "/portal/campaign";
(window.__NEXT_P = window.__NEXT_P || []).push([
    PAGE_PATH,
    ()=>{
        return __turbopack_context__.r("[project]/pages/portal/campaign.tsx [client] (ecmascript)");
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
"[hmr-entry]/hmr-entry.js { ENTRY => \"[project]/pages/portal/campaign.tsx\" }", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.r("[next]/entry/page-loader.ts { PAGE => \"[project]/pages/portal/campaign.tsx [client] (ecmascript)\" } [client] (ecmascript)");
}),
]);

//# sourceMappingURL=%5Broot-of-the-server%5D__cfe117d7._.js.map