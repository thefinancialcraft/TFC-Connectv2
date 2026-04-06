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
;
var _s = __turbopack_context__.k.signature();
;
;
;
function CallSessionsPage() {
    _s();
    const { user, mounted } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$UserContext$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["useUser"])();
    const [sessions, setSessions] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [isAuthorized, setIsAuthorized] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(null);
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
                    fetchSessions();
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
    const fetchSessions = async ()=>{
        try {
            setLoading(true);
            // 1. Fetch sessions
            const { data: sessionData, error: sessionError } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["supabase"].from('call_sessions').select('*').order('updated_at', {
                ascending: false
            });
            if (sessionError) throw sessionError;
            if (!sessionData || sessionData.length === 0) {
                setSessions([]);
                return;
            }
            // 2. Collect IDs for enrichment
            const userIds = Array.from(new Set(sessionData.map((s)=>s.user_id)));
            const campaignIds = Array.from(new Set(sessionData.map((s)=>s.campaign_id)));
            const customerIds = Array.from(new Set(sessionData.map((s)=>s.customer_id).filter((id)=>!!id)));
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
            const enriched = sessionData.map((s)=>({
                    ...s,
                    agentName: userMap[s.user_id]?.user_name || 'Unknown',
                    employeeId: userMap[s.user_id]?.employee_id || '--',
                    campaignName: campaignMap[s.campaign_id] || s.campaign_id,
                    customerName: customerMap[s.customer_id]?.customer_name || 'N/A',
                    customerPhone: customerMap[s.customer_id]?.phone_no || ''
                }));
            setSessions(enriched);
        } catch (err) {
            console.error("Error fetching call sessions:", err);
        } finally{
            setLoading(false);
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
                lineNumber: 120,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/pages/portal/call-sessions.tsx",
            lineNumber: 119,
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
                        lineNumber: 129,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/pages/portal/call-sessions.tsx",
                    lineNumber: 128,
                    columnNumber: 11
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                    className: "text-2xl font-bold text-gray-900 mb-2",
                    children: "Access Restricted"
                }, void 0, false, {
                    fileName: "[project]/pages/portal/call-sessions.tsx",
                    lineNumber: 131,
                    columnNumber: 11
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-gray-500 max-w-md",
                    children: "This module is reserved for system administrators (NXUS-001). Please contact support if you believe this is an error."
                }, void 0, false, {
                    fileName: "[project]/pages/portal/call-sessions.tsx",
                    lineNumber: 132,
                    columnNumber: 11
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/pages/portal/call-sessions.tsx",
            lineNumber: 127,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "p-4 w-full h-full min-h-0 overflow-auto bg-[#fbfcfe]",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-wrap items-center justify-between gap-3 mb-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-2",
                        children: [
                            [
                                'All Agents',
                                'All Campaigns',
                                'Status'
                            ].map((filter)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-100 rounded-lg text-[10px] font-bold text-gray-600 shadow-sm hover:border-gray-200 cursor-pointer transition-all",
                                    children: [
                                        filter,
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                            className: "fi fi-rr-angle-small-down"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/portal/call-sessions.tsx",
                                            lineNumber: 147,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, filter, true, {
                                    fileName: "[project]/pages/portal/call-sessions.tsx",
                                    lineNumber: 145,
                                    columnNumber: 13
                                }, this)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "w-8 h-8 rounded-lg bg-white border border-gray-100 flex items-center justify-center text-gray-400 shadow-sm hover:text-indigo-600 cursor-pointer",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                    className: "fi fi-rr-filter"
                                }, void 0, false, {
                                    fileName: "[project]/pages/portal/call-sessions.tsx",
                                    lineNumber: 151,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/pages/portal/call-sessions.tsx",
                                lineNumber: 150,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/pages/portal/call-sessions.tsx",
                        lineNumber: 143,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-2 flex-1 max-w-md md:ml-auto",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "relative flex-1",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                        className: "fi fi-rr-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/portal/call-sessions.tsx",
                                        lineNumber: 157,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "text",
                                        placeholder: "Search sessions...",
                                        className: "w-full pl-9 pr-4 py-1.5 bg-white border border-gray-100 rounded-lg text-[10px] focus:outline-none focus:ring-1 focus:ring-indigo-500 shadow-sm"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/portal/call-sessions.tsx",
                                        lineNumber: 158,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/portal/call-sessions.tsx",
                                lineNumber: 156,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: "flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-100 rounded-lg text-[10px] font-bold text-gray-600 shadow-sm hover:bg-gray-50 uppercase tracking-tight",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                        className: "fi fi-rr-file-export"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/portal/call-sessions.tsx",
                                        lineNumber: 165,
                                        columnNumber: 13
                                    }, this),
                                    "Export"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/portal/call-sessions.tsx",
                                lineNumber: 164,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/pages/portal/call-sessions.tsx",
                        lineNumber: 155,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/pages/portal/call-sessions.tsx",
                lineNumber: 142,
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
                                            className: "px-3 py-3 border-b border-gray-100 text-center",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "checkbox",
                                                className: "rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/portal/call-sessions.tsx",
                                                lineNumber: 178,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/pages/portal/call-sessions.tsx",
                                            lineNumber: 177,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                            className: "px-3 py-3 border-b border-gray-100 text-[11px] font-black text-gray-500 uppercase tracking-widest whitespace-nowrap",
                                            children: "Agent & Org"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/portal/call-sessions.tsx",
                                            lineNumber: 180,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                            className: "px-3 py-3 border-b border-gray-100 text-[11px] font-black text-gray-500 uppercase tracking-widest whitespace-nowrap",
                                            children: "Auto Session"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/portal/call-sessions.tsx",
                                            lineNumber: 181,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                            className: "px-3 py-3 border-b border-gray-100 text-[11px] font-black text-gray-500 uppercase tracking-widest whitespace-nowrap text-center",
                                            children: "Status"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/portal/call-sessions.tsx",
                                            lineNumber: 182,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                            className: "px-3 py-3 border-b border-gray-100 text-[11px] font-black text-gray-500 uppercase tracking-widest whitespace-nowrap text-center",
                                            children: "Overrides"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/portal/call-sessions.tsx",
                                            lineNumber: 183,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                            className: "px-3 py-3 border-b border-gray-100 text-[11px] font-black text-gray-500 uppercase tracking-widest whitespace-nowrap text-center",
                                            children: "Flags"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/portal/call-sessions.tsx",
                                            lineNumber: 184,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                            className: "px-3 py-3 border-b border-gray-100 text-[11px] font-black text-gray-500 uppercase tracking-widest whitespace-nowrap text-right",
                                            children: "Heartbeat"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/portal/call-sessions.tsx",
                                            lineNumber: 185,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/portal/call-sessions.tsx",
                                    lineNumber: 176,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/pages/portal/call-sessions.tsx",
                                lineNumber: 175,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                                className: "divide-y divide-gray-50",
                                children: sessions.length > 0 ? sessions.map((session, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                        className: "hover:bg-slate-50 transition-colors group",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                className: "px-3 py-3 text-center",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "checkbox",
                                                    className: "rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/call-sessions.tsx",
                                                    lineNumber: 193,
                                                    columnNumber: 24
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/pages/portal/call-sessions.tsx",
                                                lineNumber: 192,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                className: "px-3 py-3",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex flex-col gap-1.5",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center gap-2 pr-3 py-1 pl-1 border border-indigo-100 rounded-full bg-indigo-50/50 w-fit",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "w-5 h-5 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-[10px]",
                                                                    children: session.agentName.charAt(0)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/call-sessions.tsx",
                                                                    lineNumber: 198,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "flex flex-col",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "text-[12px] font-black text-gray-800 leading-none",
                                                                            children: session.agentName
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/pages/portal/call-sessions.tsx",
                                                                            lineNumber: 202,
                                                                            columnNumber: 29
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "text-[9px] font-bold text-indigo-400 leading-none mt-1 uppercase",
                                                                            children: session.employeeId || 'ID_ERR'
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/pages/portal/call-sessions.tsx",
                                                                            lineNumber: 203,
                                                                            columnNumber: 29
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/pages/portal/call-sessions.tsx",
                                                                    lineNumber: 201,
                                                                    columnNumber: 27
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/pages/portal/call-sessions.tsx",
                                                            lineNumber: 197,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-[9px] font-bold text-gray-400 pl-1 uppercase tracking-tight",
                                                            children: session.organization_id || 'NO_ORGANIZATION'
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/call-sessions.tsx",
                                                            lineNumber: 206,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/pages/portal/call-sessions.tsx",
                                                    lineNumber: 196,
                                                    columnNumber: 23
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/pages/portal/call-sessions.tsx",
                                                lineNumber: 195,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                className: "px-3 py-3",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex flex-col gap-1",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-[11px] font-black text-gray-700 leading-none flex items-center gap-1.5",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                                    className: "fi fi-rr-bullhorn text-[10px] text-gray-400 flex"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/call-sessions.tsx",
                                                                    lineNumber: 211,
                                                                    columnNumber: 118
                                                                }, this),
                                                                " ",
                                                                session.campaignName
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/pages/portal/call-sessions.tsx",
                                                            lineNumber: 211,
                                                            columnNumber: 27
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-[10px] font-bold text-indigo-500 leading-none flex items-center gap-1.5",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                                    className: "fi fi-rr-user-md text-[10px] flex"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/call-sessions.tsx",
                                                                    lineNumber: 212,
                                                                    columnNumber: 119
                                                                }, this),
                                                                " ",
                                                                session.customerName !== 'N/A' ? `${session.customerName} (${session.customerPhone})` : 'IDLE'
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/pages/portal/call-sessions.tsx",
                                                            lineNumber: 212,
                                                            columnNumber: 27
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/pages/portal/call-sessions.tsx",
                                                    lineNumber: 210,
                                                    columnNumber: 24
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/pages/portal/call-sessions.tsx",
                                                lineNumber: 209,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                className: "px-3 py-3 text-center",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: `inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black leading-none border uppercase ${session.status === 'active' ? 'bg-green-50 text-green-600 border-green-100' : session.status === 'assigned' ? 'bg-blue-50 text-blue-600 border-blue-100' : session.status === 'disposition_pending' ? 'bg-orange-50 text-orange-600 border-orange-100' : 'bg-slate-50 text-gray-500 border-gray-100'}`,
                                                    children: session.status.replace('_', ' ')
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/call-sessions.tsx",
                                                    lineNumber: 216,
                                                    columnNumber: 23
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/pages/portal/call-sessions.tsx",
                                                lineNumber: 215,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                className: "px-3 py-3 text-center",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex flex-col items-center gap-1",
                                                    children: session.manual_status || session.manual_campaign_id ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-[10px] font-black text-purple-600 border border-purple-100 bg-purple-50 px-2 py-0.5 rounded-lg flex",
                                                                children: session.manual_status || 'MANUAL'
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/call-sessions.tsx",
                                                                lineNumber: 229,
                                                                columnNumber: 31
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-[8px] font-bold text-gray-400 uppercase",
                                                                children: session.manual_campaign_id || '---'
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/call-sessions.tsx",
                                                                lineNumber: 230,
                                                                columnNumber: 31
                                                            }, this)
                                                        ]
                                                    }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-[10px] font-bold text-gray-200",
                                                        children: "NONE"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/call-sessions.tsx",
                                                        lineNumber: 233,
                                                        columnNumber: 29
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/call-sessions.tsx",
                                                    lineNumber: 226,
                                                    columnNumber: 24
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/pages/portal/call-sessions.tsx",
                                                lineNumber: 225,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                className: "px-3 py-3 text-center text-[10px]",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center justify-center gap-1.5",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: `px-2 py-1 rounded-lg text-[8px] font-black border flex ${session.is_manual ? 'bg-purple-50 text-purple-600 border-purple-100' : 'bg-slate-50 text-slate-400 border-slate-100'}`,
                                                            children: session.is_manual ? 'M-MODE' : 'A-SYNC'
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/call-sessions.tsx",
                                                            lineNumber: 239,
                                                            columnNumber: 27
                                                        }, this),
                                                        session.is_unassigned && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "bg-red-50 text-red-500 px-2 py-1 rounded-lg text-[8px] font-black border border-red-100 flex",
                                                            children: "UNASGND"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/call-sessions.tsx",
                                                            lineNumber: 243,
                                                            columnNumber: 29
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/pages/portal/call-sessions.tsx",
                                                    lineNumber: 238,
                                                    columnNumber: 24
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/pages/portal/call-sessions.tsx",
                                                lineNumber: 237,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                className: "px-3 py-3 text-right",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex flex-col items-end gap-1",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-[11px] font-black text-indigo-600 flex items-center gap-1.5 transition-all",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                                    className: "fi fi-rr-bolt animate-pulse flex"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/call-sessions.tsx",
                                                                    lineNumber: 249,
                                                                    columnNumber: 120
                                                                }, this),
                                                                " ",
                                                                formatTimeSafe(session.updated_at)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/pages/portal/call-sessions.tsx",
                                                            lineNumber: 249,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-[9px] font-bold text-gray-300 leading-none",
                                                            children: formatDateSafe(session.updated_at)
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/call-sessions.tsx",
                                                            lineNumber: 250,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/pages/portal/call-sessions.tsx",
                                                    lineNumber: 248,
                                                    columnNumber: 23
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/pages/portal/call-sessions.tsx",
                                                lineNumber: 247,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, `${session.user_id}-${session.campaign_id}`, true, {
                                        fileName: "[project]/pages/portal/call-sessions.tsx",
                                        lineNumber: 191,
                                        columnNumber: 19
                                    }, this)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                        colSpan: 8,
                                        className: "px-6 py-20 text-center",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex flex-col items-center gap-2 opacity-30",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                    className: "fi fi-rr-box-open text-4xl"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/call-sessions.tsx",
                                                    lineNumber: 259,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-[10px] font-black uppercase tracking-widest",
                                                    children: "No active sessions matched"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/call-sessions.tsx",
                                                    lineNumber: 260,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/portal/call-sessions.tsx",
                                            lineNumber: 258,
                                            columnNumber: 21
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/pages/portal/call-sessions.tsx",
                                        lineNumber: 257,
                                        columnNumber: 19
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/pages/portal/call-sessions.tsx",
                                    lineNumber: 256,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/pages/portal/call-sessions.tsx",
                                lineNumber: 188,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/pages/portal/call-sessions.tsx",
                        lineNumber: 174,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/pages/portal/call-sessions.tsx",
                    lineNumber: 173,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/pages/portal/call-sessions.tsx",
                lineNumber: 172,
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
                                lineNumber: 272,
                                columnNumber: 115
                            }, this),
                            " Previous"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/pages/portal/call-sessions.tsx",
                        lineNumber: 272,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: "w-6 h-6 flex items-center justify-center bg-indigo-600 text-white rounded text-[10px] font-bold",
                        children: "1"
                    }, void 0, false, {
                        fileName: "[project]/pages/portal/call-sessions.tsx",
                        lineNumber: 273,
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
                                lineNumber: 274,
                                columnNumber: 130
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/pages/portal/call-sessions.tsx",
                        lineNumber: 274,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/pages/portal/call-sessions.tsx",
                lineNumber: 271,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/pages/portal/call-sessions.tsx",
        lineNumber: 140,
        columnNumber: 5
    }, this);
}
_s(CallSessionsPage, "IiFUKumNxLStAjku9JN1sXZ90Mw=", false, function() {
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

//# sourceMappingURL=%5Broot-of-the-server%5D__b18468c4._.js.map