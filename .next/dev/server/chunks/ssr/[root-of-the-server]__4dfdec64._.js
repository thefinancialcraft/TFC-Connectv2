module.exports = [
"[project]/hooks/useSessionState.ts [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useSessionState",
    ()=>useSessionState
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
;
function useSessionState(key, initialValue) {
    const [state, setState] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(()=>{
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        return initialValue;
    });
    const setValue = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useCallback"])((value)=>{
        try {
            setState((prevState)=>{
                const valueToStore = value instanceof Function ? value(prevState) : value;
                if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
                ;
                return valueToStore;
            });
        } catch (error) {
            console.warn(`Error setting sessionStorage key "${key}":`, error);
        }
    }, [
        key
    ]);
    return [
        state,
        setValue
    ];
}
}),
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
"[project]/components/ImportCustomersModal.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "default",
    ()=>ImportCustomersModal
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabase.ts [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$phoneUtils$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/phoneUtils.ts [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$monitoring$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/monitoring.ts [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$AppLayout$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/components/AppLayout.tsx [ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$UserContext$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/context/UserContext.tsx [ssr] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$AppLayout$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$AppLayout$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
;
;
;
function ImportCustomersModal({ show, onClose, onSuccess, preselectedOrgId = "", preselectedCampaignId = "" }) {
    const { user } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$UserContext$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["useUser"])();
    const [showImportModal, setShowImportModal] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(show);
    const [showMappingModal, setShowMappingModal] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const [importFile, setImportFile] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(null);
    const [importing, setImporting] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const [importError, setImportError] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])("");
    const [importSuccess, setImportSuccess] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])("");
    const fileInputRef = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useRef"])(null);
    const [csvColumns, setCsvColumns] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])([]);
    const [fieldMapping, setFieldMapping] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])({});
    const [mergedFields, setMergedFields] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])({});
    const [customFields, setCustomFields] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])([]);
    const [selectedFields, setSelectedFields] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])({
        name: true,
        phone: true,
        expiry_date: true
    });
    const [organizations, setOrganizations] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])([]);
    const [campaigns, setCampaigns] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])([]);
    const [selectedOrgId, setSelectedOrgId] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(preselectedOrgId);
    const [selectedCampaignId, setSelectedCampaignId] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(preselectedCampaignId);
    const [customExpiryDate, setCustomExpiryDate] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])("");
    const [duplicates, setDuplicates] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])([]);
    const [showConflictModal, setShowConflictModal] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    // New states for Step 1 - File Verification
    const [fileConflicts, setFileConflicts] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])([]);
    const [showFileConflictModal, setShowFileConflictModal] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const [selectedFileConflicts, setSelectedFileConflicts] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(new Set());
    const [fullyProcessedCustomers, setFullyProcessedCustomers] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])([]);
    const [isVerificationComplete, setIsVerificationComplete] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const [initialRecordCount, setInitialRecordCount] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(0);
    // New states for Step 2 - Database Verification
    const [dbConflicts, setDbConflicts] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])([]);
    const [showDbConflictModal, setShowDbConflictModal] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const [isScanningDb, setIsScanningDb] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const [isDbScanComplete, setIsDbScanComplete] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const [isFinalizing, setIsFinalizing] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const [selectedDbConflicts, setSelectedDbConflicts] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(new Set());
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        setShowImportModal(show);
        if (show) {
            setSelectedOrgId(preselectedOrgId);
            setSelectedCampaignId(preselectedCampaignId);
            fetchOrganizations();
            fetchCampaigns(preselectedOrgId); // Fetch campaigns for the preselected org
        } else {
            // Reset all internal states when modal is closed
            setImportFile(null);
            setCsvColumns([]);
            setFieldMapping({});
            setMergedFields({});
            setCustomFields([]);
            setImportError("");
            setImportSuccess("");
            setDuplicates([]);
            setFileConflicts([]);
            setShowFileConflictModal(false);
            setSelectedFileConflicts(new Set());
            setFullyProcessedCustomers([]);
            setIsVerificationComplete(false);
            setDbConflicts([]);
            setShowDbConflictModal(false);
            setIsScanningDb(false);
            setIsDbScanComplete(false);
            setInitialRecordCount(0);
            setSelectedDbConflicts(new Set());
        }
    }, [
        show,
        preselectedOrgId,
        preselectedCampaignId
    ]);
    // Re-fetch campaigns when selected organization changes
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        if (showImportModal) {
            fetchCampaigns(selectedOrgId);
            // If we change org, we should probably clear campaign unless it's the preselected one
            if (selectedOrgId !== preselectedOrgId) {
                setSelectedCampaignId("");
            } else {
                setSelectedCampaignId(preselectedCampaignId);
            }
        }
    }, [
        selectedOrgId
    ]);
    const fetchCampaigns = async (orgId)=>{
        try {
            let query = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from("campaigns").select("id, name").eq("status", "active").order("name", {
                ascending: true
            });
            if (orgId) {
                query = query.eq("organization_id", orgId);
            }
            const { data, error } = await query;
            if (!error) setCampaigns(data || []);
        } catch (err) {
            console.error("Error fetching campaigns:", err);
        }
    };
    const fetchOrganizations = async ()=>{
        try {
            const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from("organizations").select("id, company_name, org_code").eq("is_active", true).order("company_name", {
                ascending: true
            });
            if (!error) setOrganizations(data || []);
        } catch (err) {
            console.error("Error fetching organizations:", err);
        }
    };
    const handleClose = ()=>{
        setShowImportModal(false);
        setShowMappingModal(false);
        setShowFileConflictModal(false);
        setShowDbConflictModal(false);
        setShowConflictModal(false);
        setImportFile(null);
        setImportError("");
        setImportSuccess("");
        setFileConflicts([]);
        setFullyProcessedCustomers([]);
        setIsVerificationComplete(false);
        onClose();
    };
    const parseCSVLine = (line)=>{
        const result = [];
        let current = "";
        let inQuotes = false;
        for(let i = 0; i < line.length; i++){
            const char = line[i];
            if (char === '"') inQuotes = !inQuotes;
            else if (char === "," && !inQuotes) {
                result.push(current.trim());
                current = "";
            } else current += char;
        }
        result.push(current.trim());
        return result;
    };
    const getFieldValue = (row, fieldKey, fieldMapping, mergedFields)=>{
        const mainColumn = fieldMapping[fieldKey];
        if (!mainColumn) return "";
        let value = row[mainColumn] || "";
        const merged = mergedFields[fieldKey] || [];
        if (merged.length > 0) {
            const mergedValues = merged.filter((col)=>col && row[col]).map((col)=>row[col]).join(" ");
            if (mergedValues) value = value ? `${value} ${mergedValues}` : mergedValues;
        }
        return value.trim();
    };
    const generateLeadId = ()=>{
        return `LEAD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    };
    const verifyFileData = async ()=>{
        if (!importFile) {
            setImportError("Please select a file to upload");
            return;
        }
        if (!selectedOrgId) {
            setImportError("Please select an Organization.");
            return;
        }
        setImporting(true);
        setImportError("");
        setImportSuccess("");
        try {
            const text = await importFile.text();
            const lines = text.split("\n").filter((line)=>line.trim());
            if (lines.length < 2) {
                setImportError("CSV file must contain at least a header row and one data row");
                setImporting(false);
                return;
            }
            const headers = parseCSVLine(lines[0]);
            const customers = [];
            const errors = [];
            for(let i = 1; i < lines.length; i++){
                try {
                    const values = parseCSVLine(lines[i]);
                    if (values.length === 0 || values.every((v)=>!v.trim())) continue;
                    const row = {};
                    headers.forEach((header, index)=>{
                        row[header.trim()] = values[index]?.trim() || "";
                    });
                    const customerName = getFieldValue(row, "name", fieldMapping, mergedFields);
                    const phoneNo = getFieldValue(row, "phone", fieldMapping, mergedFields);
                    const expiryDate = fieldMapping["expiry_date"] === '__CUSTOM_DATE__' ? customExpiryDate : getFieldValue(row, "expiry_date", fieldMapping, mergedFields);
                    if (!customerName || !phoneNo) continue;
                    const customerDetails = {};
                    customFields.forEach((cf)=>{
                        let value = row[cf.mappedTo] || "";
                        const merged = mergedFields[cf.id] || [];
                        if (merged.length > 0) {
                            const mergedValues = merged.filter((col)=>col && row[col]).map((col)=>row[col]).join(" ");
                            if (mergedValues) value = value ? `${value} ${mergedValues}` : mergedValues;
                        }
                        if (value) {
                            const suffix = selectedFields[`custom_${cf.id}`] !== false ? "_checked" : "_unchecked";
                            customerDetails[`${cf.name || cf.mappedTo}${suffix}`] = value.trim();
                        }
                    });
                    // Robust Date parsing
                    let parsedExpiryDate = null;
                    if (expiryDate) {
                        try {
                            const cleanDate = expiryDate.toString().replace(/₹/g, "").trim();
                            const parseDMY = (str)=>{
                                const match = str.match(/^(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{2,4})$/);
                                if (match) {
                                    let d = match[1].padStart(2, '0'), m = match[2].padStart(2, '0'), y = match[3];
                                    if (y.length === 2) y = "20" + y;
                                    return `${y}-${m}-${d}`;
                                }
                                return null;
                            };
                            const parseYMD = (str)=>{
                                const match = str.match(/^(\d{4})[\/\-\.](\d{1,2})[\/\-\.](\d{1,2})$/);
                                if (match) {
                                    let y = match[1], m = match[2].padStart(2, '0'), d = match[3].padStart(2, '0');
                                    return `${y}-${m}-${d}`;
                                }
                                return null;
                            };
                            parsedExpiryDate = parseDMY(cleanDate) || parseYMD(cleanDate);
                            if (!parsedExpiryDate) {
                                const date = new Date(cleanDate);
                                if (!isNaN(date.getTime())) parsedExpiryDate = date.toISOString().split("T")[0];
                            }
                        } catch (e) {}
                    }
                    customers.push({
                        lead_id: generateLeadId(),
                        customer_name: customerName,
                        phone_no: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$phoneUtils$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["encryptPhone"])(phoneNo),
                        display_phone: phoneNo,
                        phone_search_hash: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$phoneUtils$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["computePhoneHash"])(phoneNo),
                        expiry_date: parsedExpiryDate,
                        campaign_id: selectedCampaignId || null,
                        organization_id: selectedOrgId || null,
                        customer_details: {
                            active_details: "details-1",
                            history: {
                                "details-1": customerDetails
                            }
                        },
                        status: "active"
                    });
                } catch (e) {}
            }
            // STEP 1: Internal File Verification
            const hashCount = {};
            customers.forEach((c, idx)=>{
                if (!c.phone_search_hash) return;
                if (!hashCount[c.phone_search_hash]) hashCount[c.phone_search_hash] = [];
                hashCount[c.phone_search_hash].push(idx);
            });
            const internalConflicts = [];
            const uniqueIndices = new Set();
            const processedHashes = new Set();
            Object.entries(hashCount).forEach(([hash, indices])=>{
                if (indices.length > 1) {
                    // Duplicate found in file
                    internalConflicts.push({
                        hash,
                        indices,
                        records: indices.map((idx)=>customers[idx])
                    });
                } else {
                    uniqueIndices.add(indices[0]);
                }
            });
            if (internalConflicts.length > 0) {
                console.log(`[File Check] Internal duplicates found in file: ${internalConflicts.length} groups.`);
                console.log("[File Check] Conflict details:", internalConflicts);
                setFileConflicts(internalConflicts);
                setFullyProcessedCustomers(customers);
                setInitialRecordCount(customers.length);
                setShowFileConflictModal(true);
                setImportError(`File contains ${internalConflicts.length} duplicate groups out of ${customers.length} total records.`);
            } else {
                console.log("[File Check] No internal duplicates found in file.");
                setFullyProcessedCustomers(customers);
                setInitialRecordCount(customers.length);
                setIsVerificationComplete(true);
                setImportSuccess(`Verification complete! All ${customers.length} records ready for Stage 2.`);
            }
        } catch (err) {
            setImportError(`Error verifying file: ${err}`);
        } finally{
            setImporting(false);
        }
    };
    const handleFileMerge = (conflictIndex)=>{
        const conflict = fileConflicts[conflictIndex];
        const newList = [
            ...fullyProcessedCustomers
        ];
        // Merge this one
        const records = conflict.records;
        const primaryRecord = {
            ...records[0]
        };
        // Combine history from all records
        const newHistory = {};
        let detailCounter = 1;
        records.forEach((rec)=>{
            if (rec.customer_details.history) {
                Object.values(rec.customer_details.history).forEach((hVal)=>{
                    newHistory[`details-${detailCounter++}`] = hVal;
                });
            } else {
                // Fallback for flat structure if any
                newHistory[`details-${detailCounter++}`] = rec.customer_details;
            }
        });
        primaryRecord.customer_details = {
            active_details: "details-1",
            history: newHistory
        };
        const idsToRemove = new Set(records.map((r)=>r.lead_id));
        const filteredList = newList.filter((rec)=>!idsToRemove.has(rec.lead_id));
        filteredList.push(primaryRecord);
        setFullyProcessedCustomers(filteredList);
        const newConflicts = [
            ...fileConflicts
        ];
        newConflicts.splice(conflictIndex, 1);
        setFileConflicts(newConflicts);
        setSelectedFileConflicts(new Set()); // Reset selection
        if (newConflicts.length === 0) {
            setShowFileConflictModal(false);
            setIsVerificationComplete(true);
            setImportSuccess(`Deduplication complete! Total: ${initialRecordCount} records. Moving ${filteredList.length} records to Stage 2.`);
        }
    };
    const handleFileReject = (conflictIndex)=>{
        const conflict = fileConflicts[conflictIndex];
        const newList = [
            ...fullyProcessedCustomers
        ];
        const idsToRemove = new Set(conflict.records.slice(1).map((r)=>r.lead_id));
        const filteredList = newList.filter((rec)=>!idsToRemove.has(rec.lead_id));
        setFullyProcessedCustomers(filteredList);
        const newConflicts = [
            ...fileConflicts
        ];
        newConflicts.splice(conflictIndex, 1);
        setFileConflicts(newConflicts);
        setSelectedFileConflicts(new Set()); // Reset selection
        if (newConflicts.length === 0) {
            setShowFileConflictModal(false);
            setIsVerificationComplete(true);
            setImportSuccess(`Deduplication complete! Total: ${initialRecordCount} records. Moving ${filteredList.length} records to Stage 2.`);
        }
    };
    const handleBulkFileMerge = ()=>{
        if (selectedFileConflicts.size === 0) return;
        let currentList = [
            ...fullyProcessedCustomers
        ];
        const conflictsToRemoveIndices = Array.from(selectedFileConflicts).sort((a, b)=>b - a); // Sort descending to splice correctly
        conflictsToRemoveIndices.forEach((idx)=>{
            const conflict = fileConflicts[idx];
            const primaryRecord = {
                ...conflict.records[0]
            };
            const newHistory = {};
            let detailCounter = 1;
            conflict.records.forEach((rec)=>{
                if (rec.customer_details.history) {
                    Object.values(rec.customer_details.history).forEach((hVal)=>{
                        newHistory[`details-${detailCounter++}`] = hVal;
                    });
                } else {
                    newHistory[`details-${detailCounter++}`] = rec.customer_details;
                }
            });
            primaryRecord.customer_details = {
                active_details: "details-1",
                history: newHistory
            };
            const idsToRemove = new Set(conflict.records.map((r)=>r.lead_id));
            currentList = currentList.filter((rec)=>!idsToRemove.has(rec.lead_id));
            currentList.push(primaryRecord);
        });
        setFullyProcessedCustomers(currentList);
        const newConflicts = fileConflicts.filter((_, idx)=>!selectedFileConflicts.has(idx));
        setFileConflicts(newConflicts);
        setSelectedFileConflicts(new Set());
        if (newConflicts.length === 0) {
            setShowFileConflictModal(false);
            setIsVerificationComplete(true);
            setImportSuccess(`Deduplication complete (Bulk Merge)! Total: ${initialRecordCount} records. Moving ${currentList.length} records to Stage 2.`);
        }
    };
    const handleBulkFileReject = ()=>{
        if (selectedFileConflicts.size === 0) return;
        let currentList = [
            ...fullyProcessedCustomers
        ];
        const conflictsToRemoveIndices = Array.from(selectedFileConflicts);
        conflictsToRemoveIndices.forEach((idx)=>{
            const conflict = fileConflicts[idx];
            const idsToRemove = new Set(conflict.records.slice(1).map((r)=>r.lead_id));
            currentList = currentList.filter((rec)=>!idsToRemove.has(rec.lead_id));
        });
        setFullyProcessedCustomers(currentList);
        const newConflicts = fileConflicts.filter((_, idx)=>!selectedFileConflicts.has(idx));
        setFileConflicts(newConflicts);
        setSelectedFileConflicts(new Set());
        if (newConflicts.length === 0) {
            setShowFileConflictModal(false);
            setIsVerificationComplete(true);
            setImportSuccess(`Deduplication complete (Bulk Reject)! Total: ${initialRecordCount} records. Moving ${currentList.length} records to Stage 2.`);
        }
    };
    const toggleSelectAllConflicts = ()=>{
        if (selectedFileConflicts.size === fileConflicts.length) {
            setSelectedFileConflicts(new Set());
        } else {
            setSelectedFileConflicts(new Set(fileConflicts.map((_, i)=>i)));
        }
    };
    const toggleConflictSelection = (idx)=>{
        const next = new Set(selectedFileConflicts);
        if (next.has(idx)) next.delete(idx);
        else next.add(idx);
        setSelectedFileConflicts(next);
    };
    const uploadCustomersToSupabase = async ()=>{
        if (!fullyProcessedCustomers.length) return;
        setIsScanningDb(true);
        setImportError("");
        setImportSuccess("");
        try {
            const hashes = fullyProcessedCustomers.map((c)=>c.phone_search_hash).filter((h)=>h); // Ensure no empty hashes enter the query
            const batchSize = 100; // Reduced batch size further to prevent URL length (URI Too Long) errors
            let existingRecords = [];
            // Check in batches for 2k+ records support
            for(let i = 0; i < hashes.length; i += batchSize){
                const batch = hashes.slice(i, i + batchSize);
                const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from("customers").select("*").in("phone_search_hash", batch).eq("campaign_id", selectedCampaignId).eq("organization_id", selectedOrgId);
                if (error) throw error;
                if (data && data.length > 0) {
                    console.log(`[DB Check] Batch ${Math.floor(i / batchSize) + 1}: Found ${data.length} matches.`);
                    existingRecords = [
                        ...existingRecords,
                        ...data
                    ];
                }
            }
            console.log(`[DB Check] Total existing records found: ${existingRecords.length}`);
            if (existingRecords && existingRecords.length > 0) {
                // Determine conflicts
                const conflicts = existingRecords.map((dbRec)=>{
                    const fileRec = fullyProcessedCustomers.find((f)=>f.phone_search_hash === dbRec.phone_search_hash);
                    return {
                        fileRecord: fileRec,
                        dbRecord: dbRec
                    };
                });
                console.log("[DB Check] Conflicts found:", conflicts);
                setDbConflicts(conflicts);
                setShowDbConflictModal(true);
                setImportError(`Stage 2: Found ${conflicts.length} matches in CRM. ${fullyProcessedCustomers.length - conflicts.length} records are new.`);
            } else {
                setImportSuccess(`Stage 2 Complete! All ${fullyProcessedCustomers.length} records are new and ready for CRM.`);
                setIsDbScanComplete(true);
            }
        } catch (err) {
            console.error("Database Check Error:", err);
            setImportError(`Error checking database: ${err.message || String(err)}`);
        } finally{
            setIsScanningDb(false);
        }
    };
    const handleFinalUpload = async ()=>{
        if (!fullyProcessedCustomers.length || isFinalizing) return;
        setIsFinalizing(true);
        setImportError("");
        setImportSuccess("");
        try {
            // Separate records into updates (with ID) and new inserts (without ID)
            const toUpdate = [];
            const toInsert = [];
            fullyProcessedCustomers.forEach(({ display_phone, ...rest })=>{
                const payload = {
                    ...rest,
                    customer_details: typeof rest.customer_details === 'object' ? JSON.stringify(rest.customer_details) : rest.customer_details
                };
                if (rest.id) {
                    toUpdate.push(payload);
                } else {
                    // For new records, explicitly DO NOT provide the id key
                    const { id, ...insertPayload } = payload;
                    toInsert.push(insertPayload);
                }
            });
            // Perform operations in parallel
            const promises = [];
            if (toUpdate.length > 0) {
                promises.push(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from("customers").upsert(toUpdate));
            }
            if (toInsert.length > 0) {
                promises.push(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from("customers").insert(toInsert));
            }
            const results = await Promise.all(promises);
            const firstError = results.find((r)=>r.error)?.error;
            if (firstError) throw firstError;
            // Log monitoring event
            const totalRecords = toUpdate.length + toInsert.length;
            const inputSize = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$monitoring$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["estimateSize"])([
                ...toUpdate,
                ...toInsert
            ]);
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$monitoring$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["logSystemEvent"])({
                event_type: 'WRITE',
                description: `Bulk Import: ${totalRecords} leads processed (${toUpdate.length} updates, ${toInsert.length} new)`,
                metadata: {
                    organization_id: selectedOrgId,
                    campaign_id: selectedCampaignId,
                    record_count: totalRecords
                },
                payload_size: inputSize,
                user_name: user?.displayName || 'System User',
                organization_id: selectedOrgId || undefined
            });
            setImportSuccess(`Import Successful! ${totalRecords} records processed (${toUpdate.length} updated, ${toInsert.length} newly added).`);
            // Short delay to show success then close
            setTimeout(()=>{
                handleClose(); // Resets all states and calls onClose
                onSuccess?.();
            }, 1000);
        } catch (err) {
            console.error("Final Upload Error:", err);
            setImportError(`Error uploading records: ${err.message || err}`);
        } finally{
            setIsFinalizing(false);
        }
    };
    const toggleDbConflictSelection = (idx)=>{
        const newSelected = new Set(selectedDbConflicts);
        if (newSelected.has(idx)) newSelected.delete(idx);
        else newSelected.add(idx);
        setSelectedDbConflicts(newSelected);
    };
    const toggleSelectAllDbConflicts = ()=>{
        if (selectedDbConflicts.size === dbConflicts.length) {
            setSelectedDbConflicts(new Set());
        } else {
            setSelectedDbConflicts(new Set(dbConflicts.map((_, i)=>i)));
        }
    };
    const handleDbMergeSelected = ()=>{
        if (selectedDbConflicts.size === 0) return;
        let workingCustomers = [
            ...fullyProcessedCustomers
        ];
        const conflictsToHandle = Array.from(selectedDbConflicts).sort((a, b)=>b - a);
        conflictsToHandle.forEach((idx)=>{
            const conflict = dbConflicts[idx];
            // Merging Database details into the file record
            // Keep existing DB ID but merge file information or vice versa?
            // User usually wants to update the existing record.
            const dbRec = conflict.dbRecord;
            const fileRec = conflict.fileRecord;
            // Simple merge strategy: Update existing DB record with new CSV details (keeping history)
            const dbDetails = typeof dbRec.customer_details === 'string' ? JSON.parse(dbRec.customer_details) : dbRec.customer_details || {
                active_details: "details-1",
                history: {
                    "details-1": {}
                }
            };
            const fileDetails = fileRec.customer_details;
            // New history entry in DB details
            const newIndex = Object.keys(dbDetails.history || {}).length + 1;
            const newKey = `details-${newIndex}`;
            if (!dbDetails.history) dbDetails.history = {};
            // Source the current active details from file or merge them
            dbDetails.history[newKey] = fileDetails.history?.[fileDetails.active_details] || {};
            dbDetails.active_details = newKey;
            // Updated record for DB (targeting existing ID)
            const mergedRecord = {
                ...fileRec,
                id: dbRec.id,
                customer_details: dbDetails,
                updated_at: new Date().toISOString()
            };
            // Replace or Update in the fullyProcessedCustomers list
            const fIndex = workingCustomers.findIndex((c)=>c.phone_search_hash === fileRec.phone_search_hash);
            if (fIndex !== -1) {
                workingCustomers[fIndex] = mergedRecord;
            }
        });
        setFullyProcessedCustomers(workingCustomers);
        // Remove handled ones from dbConflicts
        const remainingConflicts = dbConflicts.filter((_, i)=>!selectedDbConflicts.has(i));
        setDbConflicts(remainingConflicts);
        setSelectedDbConflicts(new Set());
        if (remainingConflicts.length === 0) {
            setShowDbConflictModal(false);
            setIsDbScanComplete(true);
            setImportSuccess(`Stage 2 Complete! ${workingCustomers.length} records finalized for CRM.`);
        }
    };
    const handleDbSkipSelected = ()=>{
        if (selectedDbConflicts.size === 0) return;
        const phoneHashesToSkip = Array.from(selectedDbConflicts).map((idx)=>dbConflicts[idx].fileRecord.phone_search_hash);
        // Remove these from fullyProcessedCustomers (Rejecting the new import for these phones)
        const workingCustomers = fullyProcessedCustomers.filter((c)=>!phoneHashesToSkip.includes(c.phone_search_hash));
        setFullyProcessedCustomers(workingCustomers);
        // Remove from dbConflicts
        const remainingConflicts = dbConflicts.filter((_, i)=>!selectedDbConflicts.has(i));
        setDbConflicts(remainingConflicts);
        setSelectedDbConflicts(new Set());
        if (remainingConflicts.length === 0) {
            setShowDbConflictModal(false);
            setIsDbScanComplete(true);
            setImportSuccess(`Stage 2 Complete! ${workingCustomers.length} records finalized for CRM.`);
        }
    };
    const handleFileUpload = async (e)=>{
        const file = e.target.files?.[0];
        if (!file) return;
        setImportFile(file);
        const text = await file.text();
        const firstLine = text.split("\n")[0];
        if (firstLine) {
            const cols = parseCSVLine(firstLine);
            setCsvColumns(cols);
            const initialMapping = {};
            const coreFields = [
                "name",
                "phone",
                "expiry_date"
            ];
            const mappedCols = new Set();
            coreFields.forEach((f)=>{
                const match = cols.find((c)=>c.toLowerCase().includes(f.toLowerCase()));
                if (match) {
                    initialMapping[f] = match;
                    mappedCols.add(match);
                }
            });
            // Auto-generate custom fields for all other columns
            const autoCustomFields = cols.filter((col)=>!mappedCols.has(col) && col.trim() !== "").map((col)=>({
                    id: `auto_${Date.now()}_${Math.random()}`,
                    name: col,
                    mappedTo: col,
                    isEdited: false
                }));
            setFieldMapping(initialMapping);
            setCustomFields(autoCustomFields);
            setShowMappingModal(true);
        }
    };
    /* Custom Fields Logic */ const addCustomField = ()=>{
        setCustomFields([
            ...customFields,
            {
                id: Date.now().toString(),
                name: "",
                mappedTo: "",
                isEdited: false
            }
        ]);
    };
    const removeCustomField = (id)=>{
        setCustomFields(customFields.filter((f)=>f.id !== id));
    };
    /* Merged Fields Logic */ const addMergedField = (fieldKey)=>{
        setMergedFields((prev)=>({
                ...prev,
                [fieldKey]: [
                    ...prev[fieldKey] || [],
                    ""
                ]
            }));
    };
    const removeMergedField = (fieldKey, index)=>{
        setMergedFields((prev)=>{
            const current = [
                ...prev[fieldKey] || []
            ];
            current.splice(index, 1);
            return {
                ...prev,
                [fieldKey]: current
            };
        });
    };
    const updateMergedField = (fieldKey, index, value)=>{
        setMergedFields((prev)=>{
            const current = [
                ...prev[fieldKey] || []
            ];
            current[index] = value;
            return {
                ...prev,
                [fieldKey]: current
            };
        });
    };
    const updateCustomField = (id, key, value)=>{
        setCustomFields(customFields.map((f)=>{
            if (f.id !== id) return f;
            if (key === "name") {
                return {
                    ...f,
                    name: value,
                    isEdited: true
                };
            } else if (key === "mappedTo") {
                // Auto-fill name if it hasn't been manually edited
                const shouldUpdateName = !f.isEdited;
                return {
                    ...f,
                    mappedTo: value,
                    name: shouldUpdateName ? value : f.name
                };
            }
            return f;
        }));
    };
    // Get set of all currently mapped columns
    const getUsedColumns = ()=>{
        const used = new Set();
        // Add standard field mappings
        Object.values(fieldMapping).forEach((val)=>{
            if (val) used.add(val);
        });
        // Add merged fields
        Object.values(mergedFields).forEach((arr)=>{
            arr.forEach((val)=>{
                if (val) used.add(val);
            });
        });
        // Add custom mapped fields
        customFields.forEach((f)=>{
            if (f.mappedTo) used.add(f.mappedTo);
        });
        return used;
    };
    const handleMergeDuplicate = async (duplicate)=>{
        try {
            const existingDetails = typeof duplicate.existing.customer_details === 'string' ? JSON.parse(duplicate.existing.customer_details) : duplicate.existing.customer_details || {};
            const newDetails = typeof duplicate.new.customer_details === 'string' ? JSON.parse(duplicate.new.customer_details) : duplicate.new.customer_details || {};
            // If newDetails is already structured, extract flat data
            const flatIncoming = newDetails.history && newDetails.active_details ? newDetails.history[newDetails.active_details] : newDetails;
            let finalStructured;
            if (existingDetails.history && existingDetails.active_details) {
                const nextIndex = Object.keys(existingDetails.history).length + 1;
                const nextId = `details-${nextIndex}`;
                finalStructured = {
                    ...existingDetails,
                    active_details: nextId,
                    history: {
                        ...existingDetails.history,
                        [nextId]: flatIncoming
                    }
                };
            } else {
                // Migrate flat to structured
                finalStructured = {
                    active_details: "details-2",
                    history: {
                        "details-1": existingDetails,
                        "details-2": flatIncoming
                    }
                };
            }
            const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from("customers").update({
                customer_details: JSON.stringify(finalStructured)
            }).eq("id", duplicate.existing.id);
            if (error) throw error;
            // Remove from duplicates list
            setDuplicates((prev)=>{
                const remaining = prev.filter((d)=>d.existing.id !== duplicate.existing.id);
                if (remaining.length === 0) {
                    setImportSuccess("All duplicates resolved!");
                    if (onSuccess) onSuccess();
                    setTimeout(handleClose, 1500);
                }
                return remaining;
            });
        } catch (err) {
            console.error("Merge error:", err);
        }
    };
    const handleRejectDuplicate = (id)=>{
        setDuplicates((prev)=>{
            const remaining = prev.filter((d)=>d.existing.id !== id);
            if (remaining.length === 0) {
                setImportSuccess("All duplicates handled.");
                if (onSuccess) onSuccess();
                setTimeout(handleClose, 1500);
            }
            return remaining;
        });
    };
    const handleMergeAll = async ()=>{
        if (!confirm(`Are you sure you want to merge all ${duplicates.length} duplicates? This will update existing records with new information.`)) return;
        setImporting(true);
        let mergedCount = 0;
        try {
            for (const duplicate of duplicates){
                const existingDetails = typeof duplicate.existing.customer_details === 'string' ? JSON.parse(duplicate.existing.customer_details) : duplicate.existing.customer_details || {};
                const newDetails = typeof duplicate.new.customer_details === 'string' ? JSON.parse(duplicate.new.customer_details) : duplicate.new.customer_details || {};
                const flatIncoming = newDetails.history && newDetails.active_details ? newDetails.history[newDetails.active_details] : newDetails;
                let finalStructured;
                if (existingDetails.history && existingDetails.active_details) {
                    const nextIndex = Object.keys(existingDetails.history).length + 1;
                    const nextId = `details-${nextIndex}`;
                    finalStructured = {
                        ...existingDetails,
                        active_details: nextId,
                        history: {
                            ...existingDetails.history,
                            [nextId]: flatIncoming
                        }
                    };
                } else {
                    finalStructured = {
                        active_details: "details-2",
                        history: {
                            "details-1": existingDetails,
                            "details-2": flatIncoming
                        }
                    };
                }
                await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from("customers").update({
                    customer_details: JSON.stringify(finalStructured)
                }).eq("id", duplicate.existing.id);
                mergedCount++;
            }
            setDuplicates([]);
            setShowConflictModal(false);
            setImportSuccess(`Successfully merged ${mergedCount} duplicates!`);
            if (onSuccess) onSuccess();
            setTimeout(handleClose, 2000);
        } catch (err) {
            console.error("Merge all error:", err);
            setImportError("Error during bulk merge. Some records may not have been updated.");
        } finally{
            setImporting(false);
        }
    };
    const usedColumns = getUsedColumns(); // Calculate for render
    const renderDetailsPreview = (details)=>{
        if (!details) return null;
        let data = details;
        if (typeof details === 'string') {
            try {
                data = JSON.parse(details);
            } catch (e) {
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                    className: "text-[10px] text-gray-400 italic",
                    children: details
                }, void 0, false, {
                    fileName: "[project]/components/ImportCustomersModal.tsx",
                    lineNumber: 985,
                    columnNumber: 16
                }, this);
            }
        }
        if (typeof data !== 'object' || data === null) return null;
        // Support structured JSON in preview
        let displayData = data;
        if (data.active_details && data.history) {
            displayData = data.history[data.active_details] || {};
        }
        return Object.entries(displayData).slice(0, 4).map(([k, v])=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "flex justify-between text-[11px] gap-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                        className: "text-gray-400 truncate",
                        children: [
                            k.split('_')[0],
                            ":"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/ImportCustomersModal.tsx",
                        lineNumber: 998,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                        className: "font-semibold text-gray-600 truncate",
                        children: String(v)
                    }, void 0, false, {
                        fileName: "[project]/components/ImportCustomersModal.tsx",
                        lineNumber: 999,
                        columnNumber: 9
                    }, this)
                ]
            }, k, true, {
                fileName: "[project]/components/ImportCustomersModal.tsx",
                lineNumber: 997,
                columnNumber: 7
            }, this));
    };
    if (!showImportModal && !showMappingModal && !showConflictModal) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["Fragment"], {
        children: [
            showImportModal && !showMappingModal && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "fixed inset-0 backdrop-blur-lg flex items-center justify-center z-[60] p-4",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: "bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "flex items-center justify-between p-6 border-b border-gray-200",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                                    className: "text-xl font-bold",
                                    style: {
                                        color: "#263238",
                                        fontFamily: "'Poppins', sans-serif"
                                    },
                                    children: "Import Customers"
                                }, void 0, false, {
                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                    lineNumber: 1013,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                    onClick: handleClose,
                                    className: "text-gray-400 hover:text-gray-600",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                        className: "fi flex fi-rr-cross text-xl"
                                    }, void 0, false, {
                                        fileName: "[project]/components/ImportCustomersModal.tsx",
                                        lineNumber: 1015,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                    lineNumber: 1014,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/ImportCustomersModal.tsx",
                            lineNumber: 1012,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "p-6",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "mb-6 p-4 bg-blue-50 rounded-lg text-sm text-gray-700",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("strong", {
                                            children: "Instructions:"
                                        }, void 0, false, {
                                            fileName: "[project]/components/ImportCustomersModal.tsx",
                                            lineNumber: 1020,
                                            columnNumber: 17
                                        }, this),
                                        " Upload a CSV file with customer data."
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                    lineNumber: 1019,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "grid grid-cols-1 md:grid-cols-2 gap-4 mb-6",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "space-y-1.5",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center justify-between",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                                        className: "text-xs font-bold text-gray-500 uppercase tracking-wider",
                                                        children: "Select Organization"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/ImportCustomersModal.tsx",
                                                        lineNumber: 1026,
                                                        columnNumber: 21
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                                    lineNumber: 1025,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("select", {
                                                    value: selectedOrgId,
                                                    onChange: (e)=>setSelectedOrgId(e.target.value),
                                                    disabled: !!preselectedOrgId,
                                                    className: `w-full px-4 py-2.5 text-gray-500 bg-gray-50 border border-gray-200 rounded-xl text-sm ${preselectedOrgId ? 'opacity-60 cursor-not-allowed' : ''}`,
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                            value: "",
                                                            children: "Select Organization"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/ImportCustomersModal.tsx",
                                                            lineNumber: 1034,
                                                            columnNumber: 21
                                                        }, this),
                                                        organizations.map((org)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                                value: org.id,
                                                                children: [
                                                                    org.company_name,
                                                                    " (",
                                                                    org.org_code,
                                                                    ")"
                                                                ]
                                                            }, org.id, true, {
                                                                fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                lineNumber: 1035,
                                                                columnNumber: 47
                                                            }, this))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                                    lineNumber: 1028,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/ImportCustomersModal.tsx",
                                            lineNumber: 1024,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "space-y-1.5",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center justify-between",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                                        className: "text-xs font-bold text-gray-500 uppercase tracking-wider",
                                                        children: "Select Campaign"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/ImportCustomersModal.tsx",
                                                        lineNumber: 1040,
                                                        columnNumber: 21
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                                    lineNumber: 1039,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("select", {
                                                    value: selectedCampaignId,
                                                    onChange: (e)=>setSelectedCampaignId(e.target.value),
                                                    disabled: !!preselectedCampaignId,
                                                    className: `w-full px-4 py-2.5 text-gray-500 bg-gray-50 border border-gray-200 rounded-xl text-sm ${preselectedCampaignId ? 'opacity-60 cursor-not-allowed' : ''}`,
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                            value: "",
                                                            children: "Select Campaign"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/ImportCustomersModal.tsx",
                                                            lineNumber: 1048,
                                                            columnNumber: 21
                                                        }, this),
                                                        campaigns.map((camp)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                                value: camp.id,
                                                                children: camp.name
                                                            }, camp.id, false, {
                                                                fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                lineNumber: 1049,
                                                                columnNumber: 44
                                                            }, this))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                                    lineNumber: 1042,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/ImportCustomersModal.tsx",
                                            lineNumber: 1038,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                    lineNumber: 1023,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "relative border-2 border-dashed border-gray-300 rounded-lg p-10 text-center hover:border-[#4b33e8] transition-colors",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                            ref: fileInputRef,
                                            type: "file",
                                            accept: ".csv",
                                            onChange: handleFileUpload,
                                            className: "absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        }, void 0, false, {
                                            fileName: "[project]/components/ImportCustomersModal.tsx",
                                            lineNumber: 1055,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                            className: "fi flex fi-rr-upload text-3xl text-gray-400 mb-2 justify-center"
                                        }, void 0, false, {
                                            fileName: "[project]/components/ImportCustomersModal.tsx",
                                            lineNumber: 1056,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                            className: "text-sm text-gray-500",
                                            children: "Click or drag CSV file here"
                                        }, void 0, false, {
                                            fileName: "[project]/components/ImportCustomersModal.tsx",
                                            lineNumber: 1057,
                                            columnNumber: 17
                                        }, this),
                                        importFile && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                            className: "mt-2 text-sm text-[#4b33e8] font-bold",
                                            children: importFile.name
                                        }, void 0, false, {
                                            fileName: "[project]/components/ImportCustomersModal.tsx",
                                            lineNumber: 1058,
                                            columnNumber: 32
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                    lineNumber: 1054,
                                    columnNumber: 15
                                }, this),
                                importError && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "mt-4 p-3 bg-red-50 text-red-600 rounded text-sm",
                                    children: importError
                                }, void 0, false, {
                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                    lineNumber: 1061,
                                    columnNumber: 31
                                }, this),
                                importSuccess && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "mt-4 p-3 bg-green-50 text-green-600 rounded text-sm",
                                    children: importSuccess
                                }, void 0, false, {
                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                    lineNumber: 1062,
                                    columnNumber: 33
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "flex justify-end gap-3 mt-6",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                        onClick: handleClose,
                                        className: "px-6 py-2 bg-gray-100 rounded-lg text-sm font-medium",
                                        children: "Cancel"
                                    }, void 0, false, {
                                        fileName: "[project]/components/ImportCustomersModal.tsx",
                                        lineNumber: 1065,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                    lineNumber: 1064,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/ImportCustomersModal.tsx",
                            lineNumber: 1018,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/ImportCustomersModal.tsx",
                    lineNumber: 1011,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/ImportCustomersModal.tsx",
                lineNumber: 1010,
                columnNumber: 9
            }, this),
            showMappingModal && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "fixed inset-0 backdrop-blur-lg flex items-center justify-center z-[70] p-4",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: "bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "flex items-center justify-between p-6 border-b border-gray-200",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                                    className: "text-xl text-[#4b33e8] font-semibold",
                                    children: "Map CSV Columns"
                                }, void 0, false, {
                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                    lineNumber: 1077,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                    onClick: handleClose,
                                    className: "text-gray-400 hover:text-gray-600",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                        className: "fi flex fi-rr-cross text-xl"
                                    }, void 0, false, {
                                        fileName: "[project]/components/ImportCustomersModal.tsx",
                                        lineNumber: 1079,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                    lineNumber: 1078,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/ImportCustomersModal.tsx",
                            lineNumber: 1076,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "p-6",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "grid grid-cols-1 md:grid-cols-2 gap-4 mb-6",
                                    children: [
                                        "name",
                                        "phone",
                                        "expiry_date"
                                    ].map((field)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "space-y-1",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center justify-between",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                                            className: "text-xs font-bold text-gray-500 uppercase",
                                                            children: field.replace("_", " ")
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/ImportCustomersModal.tsx",
                                                            lineNumber: 1087,
                                                            columnNumber: 24
                                                        }, this),
                                                        field === 'expiry_date' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center gap-2",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                                                    type: "checkbox",
                                                                    id: `check_${field}`,
                                                                    checked: !!selectedFields[field],
                                                                    onChange: (e)=>setSelectedFields({
                                                                            ...selectedFields,
                                                                            [field]: e.target.checked
                                                                        }),
                                                                    className: "w-3 h-3 text-[#4b33e8] border-gray-300 rounded focus:ring-[#4b33e8]"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                    lineNumber: 1090,
                                                                    columnNumber: 30
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                                                    htmlFor: `check_${field}`,
                                                                    className: "text-[10px] text-gray-400 cursor-pointer",
                                                                    children: "Show in App"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                    lineNumber: 1097,
                                                                    columnNumber: 30
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/components/ImportCustomersModal.tsx",
                                                            lineNumber: 1089,
                                                            columnNumber: 27
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                                    lineNumber: 1086,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "flex gap-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: "flex flex-col w-full gap-2",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("select", {
                                                                    value: fieldMapping[field] || "",
                                                                    onChange: (e)=>setFieldMapping({
                                                                            ...fieldMapping,
                                                                            [field]: e.target.value
                                                                        }),
                                                                    className: "w-full text-gray-500 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                                            value: "",
                                                                            children: "Select column..."
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                            lineNumber: 1108,
                                                                            columnNumber: 31
                                                                        }, this),
                                                                        field === 'expiry_date' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                                            value: "__CUSTOM_DATE__",
                                                                            className: "font-bold text-[#4b33e8]",
                                                                            children: "✨ Set Custom Date"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                            lineNumber: 1110,
                                                                            columnNumber: 33
                                                                        }, this),
                                                                        csvColumns.filter((col)=>!usedColumns.has(col) || col === fieldMapping[field]).map((col)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                                                value: col,
                                                                                children: col
                                                                            }, col, false, {
                                                                                fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                                lineNumber: 1112,
                                                                                columnNumber: 122
                                                                            }, this))
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                    lineNumber: 1103,
                                                                    columnNumber: 29
                                                                }, this),
                                                                field === 'expiry_date' && fieldMapping[field] === '__CUSTOM_DATE__' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                                                    type: "date",
                                                                    value: customExpiryDate,
                                                                    onChange: (e)=>setCustomExpiryDate(e.target.value),
                                                                    className: "w-full px-3 py-2 bg-[#f0f2ff] border border-[#4b33e8] rounded-lg text-sm text-[#4b33e8] font-bold focus:outline-none focus:ring-1 focus:ring-[#4b33e8] animate-in fade-in slide-in-from-top-1"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                    lineNumber: 1117,
                                                                    columnNumber: 33
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/components/ImportCustomersModal.tsx",
                                                            lineNumber: 1102,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                            onClick: ()=>addMergedField(field),
                                                            className: "p-2 w-9 h-9 bg-blue-50 text-[#4b33e8] rounded-lg hover:bg-blue-100 transition-colors",
                                                            title: "Merge another column",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                className: "fi fi-rr-plus text-xs"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                lineNumber: 1130,
                                                                columnNumber: 29
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/ImportCustomersModal.tsx",
                                                            lineNumber: 1125,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                                    lineNumber: 1101,
                                                    columnNumber: 21
                                                }, this),
                                                mergedFields[field] && mergedFields[field].map((val, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: "flex gap-2 mt-1 pl-4 relative",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                className: "absolute left-0 top-1/2 -translate-y-1/2 w-4 h-px bg-gray-300"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                lineNumber: 1136,
                                                                columnNumber: 29
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("select", {
                                                                value: val,
                                                                onChange: (e)=>updateMergedField(field, idx, e.target.value),
                                                                className: "w-full text-gray-500 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                                        value: "",
                                                                        children: "Select column to merge..."
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                        lineNumber: 1142,
                                                                        columnNumber: 33
                                                                    }, this),
                                                                    csvColumns.filter((col)=>!usedColumns.has(col) || col === val).map((col)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                                            value: col,
                                                                            children: col
                                                                        }, col, false, {
                                                                            fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                            lineNumber: 1143,
                                                                            columnNumber: 108
                                                                        }, this))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                lineNumber: 1137,
                                                                columnNumber: 29
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                onClick: ()=>removeMergedField(field, idx),
                                                                className: "p-2 w-9 h-9 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                    className: "fi fi-rr-trash text-xs"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                    lineNumber: 1149,
                                                                    columnNumber: 33
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                lineNumber: 1145,
                                                                columnNumber: 29
                                                            }, this)
                                                        ]
                                                    }, idx, true, {
                                                        fileName: "[project]/components/ImportCustomersModal.tsx",
                                                        lineNumber: 1135,
                                                        columnNumber: 25
                                                    }, this))
                                            ]
                                        }, field, true, {
                                            fileName: "[project]/components/ImportCustomersModal.tsx",
                                            lineNumber: 1085,
                                            columnNumber: 19
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                    lineNumber: 1083,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "mb-6 border-t border-gray-100 pt-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "flex items-center justify-between mb-3",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                                    className: "text-xs font-bold text-gray-500 uppercase",
                                                    children: "Additional Columns (Auto-Detected)"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                                    lineNumber: 1160,
                                                    columnNumber: 20
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                    onClick: addCustomField,
                                                    className: "text-xs text-[#4b33e8] font-bold hover:underline flex items-center gap-1",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                            className: "fi fi-rr-plus"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/ImportCustomersModal.tsx",
                                                            lineNumber: 1165,
                                                            columnNumber: 22
                                                        }, this),
                                                        " Add Field"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                                    lineNumber: 1161,
                                                    columnNumber: 20
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/ImportCustomersModal.tsx",
                                            lineNumber: 1159,
                                            columnNumber: 17
                                        }, this),
                                        customFields.length > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "space-y-3",
                                            children: customFields.map((cf)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "space-y-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: "flex gap-3 items-center",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                    className: "flex items-center pt-2",
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                                                        type: "checkbox",
                                                                        checked: selectedFields[`custom_${cf.id}`] !== false,
                                                                        onChange: (e)=>setSelectedFields({
                                                                                ...selectedFields,
                                                                                [`custom_${cf.id}`]: e.target.checked
                                                                            }),
                                                                        className: "w-4 h-4 text-[#4b33e8] border-gray-300 rounded focus:ring-[#4b33e8]",
                                                                        title: "Show in Customer Details"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                        lineNumber: 1175,
                                                                        columnNumber: 31
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                    lineNumber: 1174,
                                                                    columnNumber: 28
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                                                    placeholder: "Field Name (e.g. Plan Type)",
                                                                    className: "flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#4b33e8]",
                                                                    value: cf.name,
                                                                    onChange: (e)=>updateCustomField(cf.id, "name", e.target.value)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                    lineNumber: 1183,
                                                                    columnNumber: 28
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                    className: "fi fi-rr-arrow-right text-gray-300"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                    lineNumber: 1189,
                                                                    columnNumber: 28
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                    className: "flex-1 flex gap-2",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("select", {
                                                                            className: "w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-500 focus:outline-none focus:ring-1 focus:ring-[#4b33e8]",
                                                                            value: cf.mappedTo,
                                                                            onChange: (e)=>updateCustomField(cf.id, "mappedTo", e.target.value),
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                                                    value: "",
                                                                                    children: "Select CSV column..."
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                                    lineNumber: 1196,
                                                                                    columnNumber: 37
                                                                                }, this),
                                                                                csvColumns.filter((col)=>!usedColumns.has(col) || col === cf.mappedTo).map((col)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                                                        value: col,
                                                                                        children: col
                                                                                    }, col, false, {
                                                                                        fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                                        lineNumber: 1198,
                                                                                        columnNumber: 39
                                                                                    }, this))
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                            lineNumber: 1191,
                                                                            columnNumber: 32
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                            onClick: ()=>addMergedField(cf.id),
                                                                            className: "p-2 w-9 h-9 bg-blue-50 text-[#4b33e8] rounded-lg hover:bg-blue-100 transition-colors flex-shrink-0",
                                                                            title: "Merge another column",
                                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                                className: "fi fi-rr-plus text-xs"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                                lineNumber: 1206,
                                                                                columnNumber: 35
                                                                            }, this)
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                            lineNumber: 1201,
                                                                            columnNumber: 32
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                    lineNumber: 1190,
                                                                    columnNumber: 28
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                    onClick: ()=>removeCustomField(cf.id),
                                                                    className: "p-2 w-9 h-9 flex items-center justify-center rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors flex-shrink-0",
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                        className: "fi flex fi-rr-trash text-sm"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                        lineNumber: 1213,
                                                                        columnNumber: 30
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                    lineNumber: 1209,
                                                                    columnNumber: 28
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/components/ImportCustomersModal.tsx",
                                                            lineNumber: 1173,
                                                            columnNumber: 25
                                                        }, this),
                                                        mergedFields[cf.id] && mergedFields[cf.id].map((val, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                className: "flex gap-2 pl-[calc(2rem_+_1px)] relative",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                        className: "absolute left-[1rem] top-1/2 -translate-y-1/2 w-4 h-px bg-gray-300"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                        lineNumber: 1219,
                                                                        columnNumber: 33
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                        className: "flex-1"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                        lineNumber: 1220,
                                                                        columnNumber: 33
                                                                    }, this),
                                                                    " ",
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                        className: "flex-1 flex gap-2",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("select", {
                                                                                value: val,
                                                                                onChange: (e)=>updateMergedField(cf.id, idx, e.target.value),
                                                                                className: "w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-500 focus:outline-none focus:ring-1 focus:ring-[#4b33e8]",
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                                                        value: "",
                                                                                        children: "Select column to merge..."
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                                        lineNumber: 1227,
                                                                                        columnNumber: 42
                                                                                    }, this),
                                                                                    csvColumns.filter((col)=>!usedColumns.has(col) || col === val).map((col)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                                                            value: col,
                                                                                            children: col
                                                                                        }, col, false, {
                                                                                            fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                                            lineNumber: 1228,
                                                                                            columnNumber: 117
                                                                                        }, this))
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                                lineNumber: 1222,
                                                                                columnNumber: 38
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                                onClick: ()=>removeMergedField(cf.id, idx),
                                                                                className: "p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors flex-shrink-0",
                                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                                    className: "fi fi-rr-trash text-xs"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                                    lineNumber: 1234,
                                                                                    columnNumber: 42
                                                                                }, this)
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                                lineNumber: 1230,
                                                                                columnNumber: 38
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                className: "w-8"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                                lineNumber: 1236,
                                                                                columnNumber: 38
                                                                            }, this),
                                                                            " "
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                        lineNumber: 1221,
                                                                        columnNumber: 33
                                                                    }, this)
                                                                ]
                                                            }, idx, true, {
                                                                fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                lineNumber: 1218,
                                                                columnNumber: 29
                                                            }, this))
                                                    ]
                                                }, cf.id, true, {
                                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                                    lineNumber: 1172,
                                                    columnNumber: 23
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/components/ImportCustomersModal.tsx",
                                            lineNumber: 1170,
                                            columnNumber: 19
                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "text-sm text-gray-400 italic text-center py-2 bg-gray-50 rounded-lg border border-dashed border-gray-200",
                                            children: "No custom fields added"
                                        }, void 0, false, {
                                            fileName: "[project]/components/ImportCustomersModal.tsx",
                                            lineNumber: 1244,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                    lineNumber: 1158,
                                    columnNumber: 15
                                }, this),
                                importError && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "mb-4 p-3 bg-red-50 text-red-600 rounded text-sm",
                                    children: importError
                                }, void 0, false, {
                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                    lineNumber: 1250,
                                    columnNumber: 31
                                }, this),
                                importSuccess && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "mb-4 p-3 bg-green-50 text-green-600 rounded text-sm",
                                    children: importSuccess
                                }, void 0, false, {
                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                    lineNumber: 1251,
                                    columnNumber: 33
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "flex justify-end gap-3 border-t pt-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                            onClick: ()=>setShowMappingModal(false),
                                            className: "px-6 py-2 bg-gray-100 rounded-lg text-sm",
                                            children: "Back"
                                        }, void 0, false, {
                                            fileName: "[project]/components/ImportCustomersModal.tsx",
                                            lineNumber: 1254,
                                            columnNumber: 17
                                        }, this),
                                        isVerificationComplete ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                            onClick: isDbScanComplete ? handleFinalUpload : uploadCustomersToSupabase,
                                            disabled: isScanningDb || isFinalizing,
                                            className: `px-6 py-2 rounded-lg text-sm font-bold flex items-center gap-2 ${isDbScanComplete ? 'bg-indigo-600 hover:bg-indigo-700 animate-pulse-subtle' : 'bg-green-600 hover:bg-green-700'} text-white transition-all`,
                                            children: isScanningDb ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["Fragment"], {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: "w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/ImportCustomersModal.tsx",
                                                        lineNumber: 1262,
                                                        columnNumber: 31
                                                    }, this),
                                                    " Checking DB..."
                                                ]
                                            }, void 0, true) : isFinalizing ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["Fragment"], {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: "w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/ImportCustomersModal.tsx",
                                                        lineNumber: 1264,
                                                        columnNumber: 32
                                                    }, this),
                                                    " Finalizing..."
                                                ]
                                            }, void 0, true) : isDbScanComplete ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["Fragment"], {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                        className: "fi fi-rr-upload text-sm"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/ImportCustomersModal.tsx",
                                                        lineNumber: 1266,
                                                        columnNumber: 31
                                                    }, this),
                                                    " Upload Now"
                                                ]
                                            }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["Fragment"], {
                                                children: [
                                                    "Success: ",
                                                    fullyProcessedCustomers.length,
                                                    " Records Ready - Next Step"
                                                ]
                                            }, void 0, true)
                                        }, void 0, false, {
                                            fileName: "[project]/components/ImportCustomersModal.tsx",
                                            lineNumber: 1256,
                                            columnNumber: 21
                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                            onClick: verifyFileData,
                                            disabled: importing,
                                            className: "px-6 py-2 bg-[#4b33e8] text-white rounded-lg text-sm font-bold flex items-center gap-2",
                                            children: importing ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["Fragment"], {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: "w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/ImportCustomersModal.tsx",
                                                        lineNumber: 1277,
                                                        columnNumber: 40
                                                    }, this),
                                                    " Verifying..."
                                                ]
                                            }, void 0, true) : "Verify File Data"
                                        }, void 0, false, {
                                            fileName: "[project]/components/ImportCustomersModal.tsx",
                                            lineNumber: 1272,
                                            columnNumber: 21
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                    lineNumber: 1253,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/ImportCustomersModal.tsx",
                            lineNumber: 1082,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/ImportCustomersModal.tsx",
                    lineNumber: 1075,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/ImportCustomersModal.tsx",
                lineNumber: 1074,
                columnNumber: 9
            }, this),
            showFileConflictModal && fileConflicts.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "fixed inset-0 z-[130] flex items-center justify-center bg-black/30 backdrop-blur-sm p-4 text-xs",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: "bg-white rounded-lg w-full max-w-4xl shadow-2xl flex flex-col max-h-[80vh] border border-gray-100 overflow-hidden",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-white",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "flex items-center gap-3 mr-2",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                                type: "checkbox",
                                                checked: selectedFileConflicts.size === fileConflicts.length && fileConflicts.length > 0,
                                                onChange: toggleSelectAllConflicts,
                                                className: "w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                                            }, void 0, false, {
                                                fileName: "[project]/components/ImportCustomersModal.tsx",
                                                lineNumber: 1295,
                                                columnNumber: 28
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/components/ImportCustomersModal.tsx",
                                            lineNumber: 1294,
                                            columnNumber: 25
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                className: "fi flex fi-rr-copy-alt text-sm"
                                            }, void 0, false, {
                                                fileName: "[project]/components/ImportCustomersModal.tsx",
                                                lineNumber: 1303,
                                                columnNumber: 28
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/components/ImportCustomersModal.tsx",
                                            lineNumber: 1302,
                                            columnNumber: 25
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                                                    className: "font-bold text-gray-800",
                                                    style: {
                                                        fontFamily: "'Poppins', sans-serif"
                                                    },
                                                    children: "File Internal Duplicates"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                                    lineNumber: 1306,
                                                    columnNumber: 27
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                    className: "text-[10px] text-gray-400 font-medium",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                            className: "text-indigo-600 font-bold",
                                                            children: fileConflicts.length
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/ImportCustomersModal.tsx",
                                                            lineNumber: 1308,
                                                            columnNumber: 29
                                                        }, this),
                                                        " repeating numbers found in this CSV ",
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                            className: "text-gray-300 mx-1",
                                                            children: "|"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/ImportCustomersModal.tsx",
                                                            lineNumber: 1308,
                                                            columnNumber: 139
                                                        }, this),
                                                        " Total Records: ",
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                            className: "text-gray-600 font-bold",
                                                            children: fullyProcessedCustomers.length
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/ImportCustomersModal.tsx",
                                                            lineNumber: 1308,
                                                            columnNumber: 200
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                                    lineNumber: 1307,
                                                    columnNumber: 27
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/ImportCustomersModal.tsx",
                                            lineNumber: 1305,
                                            columnNumber: 25
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                    lineNumber: 1293,
                                    columnNumber: 23
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                    onClick: ()=>setShowFileConflictModal(false),
                                    className: "w-8 h-8 rounded-lg hover:bg-gray-50 flex items-center justify-center text-gray-400 transition-colors",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                        className: "fi flex fi-rr-cross-small text-xl"
                                    }, void 0, false, {
                                        fileName: "[project]/components/ImportCustomersModal.tsx",
                                        lineNumber: 1317,
                                        columnNumber: 25
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                    lineNumber: 1313,
                                    columnNumber: 23
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/ImportCustomersModal.tsx",
                            lineNumber: 1292,
                            columnNumber: 19
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "flex-1 overflow-y-auto custom-scrollbar bg-white",
                            children: [
                                fileConflicts.slice(0, 10).map((conflict, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "bg-white",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "px-5 py-2 bg-gray-50/50 flex items-center justify-between border-y border-gray-50",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: "flex items-center gap-3",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                                                type: "checkbox",
                                                                checked: selectedFileConflicts.has(idx),
                                                                onChange: ()=>toggleConflictSelection(idx),
                                                                className: "w-3.5 h-3.5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                lineNumber: 1328,
                                                                columnNumber: 39
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                className: "font-bold text-gray-500 uppercase text-[10px] tracking-tight ml-1",
                                                                children: [
                                                                    "Repeating Group #",
                                                                    idx + 1
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                lineNumber: 1334,
                                                                columnNumber: 39
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/ImportCustomersModal.tsx",
                                                        lineNumber: 1327,
                                                        columnNumber: 35
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: "flex gap-4 items-center",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                className: "text-[10px] text-indigo-500 font-bold bg-indigo-50 px-2 py-0.5 rounded uppercase",
                                                                children: [
                                                                    conflict.records.length,
                                                                    " Records Found"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                lineNumber: 1337,
                                                                columnNumber: 38
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                className: "h-4 w-px bg-gray-200"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                lineNumber: 1338,
                                                                columnNumber: 38
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                onClick: ()=>handleFileMerge(idx),
                                                                className: "text-[10px] font-bold text-indigo-600 hover:text-indigo-800 transition-colors flex items-center gap-1",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                        className: "fi flex fi-rr-check text-[9px]"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                        lineNumber: 1343,
                                                                        columnNumber: 41
                                                                    }, this),
                                                                    " Merge All"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                lineNumber: 1339,
                                                                columnNumber: 38
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                onClick: ()=>handleFileReject(idx),
                                                                className: "text-[10px] font-bold text-rose-500 hover:text-rose-700 transition-colors flex items-center gap-1",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                        className: "fi flex fi-rr-trash text-[9px]"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                        lineNumber: 1349,
                                                                        columnNumber: 41
                                                                    }, this),
                                                                    " Reject"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                lineNumber: 1345,
                                                                columnNumber: 38
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/ImportCustomersModal.tsx",
                                                        lineNumber: 1336,
                                                        columnNumber: 35
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/ImportCustomersModal.tsx",
                                                lineNumber: 1326,
                                                columnNumber: 31
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("table", {
                                                className: "w-full text-left table-fixed",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("thead", {
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("tr", {
                                                            className: "text-gray-400 uppercase text-[9px] font-bold border-b border-gray-100 bg-gray-50/20",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                                    className: "px-5 py-3 w-[25%]",
                                                                    children: "Name / Info"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                    lineNumber: 1357,
                                                                    columnNumber: 43
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                                    className: "px-3 py-3 w-[45%]",
                                                                    children: "Mapped Details"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                    lineNumber: 1358,
                                                                    columnNumber: 43
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                                    className: "px-3 py-3 w-[15%]",
                                                                    children: "Row Index"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                    lineNumber: 1359,
                                                                    columnNumber: 43
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                                    className: "px-5 py-3 w-[15%] text-right",
                                                                    children: "Status"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                    lineNumber: 1360,
                                                                    columnNumber: 43
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/components/ImportCustomersModal.tsx",
                                                            lineNumber: 1356,
                                                            columnNumber: 39
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/ImportCustomersModal.tsx",
                                                        lineNumber: 1355,
                                                        columnNumber: 35
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("tbody", {
                                                        className: "divide-y divide-gray-50",
                                                        children: conflict.records.map((rec, ridx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("tr", {
                                                                className: "hover:bg-gray-50/5 transition-colors group",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                                        className: "px-5 py-4 align-top",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                className: "font-bold text-gray-800 text-[11px] leading-tight truncate",
                                                                                children: rec.customer_name
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                                lineNumber: 1367,
                                                                                columnNumber: 51
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                className: "text-[10px] text-indigo-500 font-bold mt-1 tracking-tight",
                                                                                children: rec.display_phone || 'N/A'
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                                lineNumber: 1368,
                                                                                columnNumber: 51
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                        lineNumber: 1366,
                                                                        columnNumber: 47
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                                        className: "px-3 py-4 align-top text-wrap",
                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                            className: "flex flex-wrap gap-1.5",
                                                                            children: Object.entries(rec.customer_details.history?.[rec.customer_details.active_details] || {}).slice(0, 6).map(([k, v])=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                    className: "flex flex-col bg-slate-50 p-1.5 rounded border border-gray-100 min-w-[90px] max-w-[150px]",
                                                                                    children: [
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                            className: "text-[7px] font-bold text-gray-400 uppercase tracking-tighter leading-none mb-1",
                                                                                            children: k.replace('detail_', '').replace(/_/g, ' ')
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                                            lineNumber: 1378,
                                                                                            columnNumber: 63
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                            className: "text-[10px] text-slate-700 font-semibold truncate",
                                                                                            children: String(v) || '—'
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                                            lineNumber: 1381,
                                                                                            columnNumber: 63
                                                                                        }, this)
                                                                                    ]
                                                                                }, k, true, {
                                                                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                                    lineNumber: 1377,
                                                                                    columnNumber: 59
                                                                                }, this))
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                            lineNumber: 1373,
                                                                            columnNumber: 51
                                                                        }, this)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                        lineNumber: 1372,
                                                                        columnNumber: 47
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                                        className: "px-3 py-4 align-top",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                className: "flex items-center gap-1.5 text-gray-500",
                                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                    className: "font-mono text-[11px] font-bold",
                                                                                    children: [
                                                                                        "#",
                                                                                        conflict.indices[ridx] + 1
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                                    lineNumber: 1390,
                                                                                    columnNumber: 53
                                                                                }, this)
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                                lineNumber: 1389,
                                                                                columnNumber: 51
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                                className: "text-[8px] text-gray-400 uppercase mt-1",
                                                                                children: "Row Num"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                                lineNumber: 1392,
                                                                                columnNumber: 51
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                        lineNumber: 1388,
                                                                        columnNumber: 47
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                                        className: "px-5 py-4 align-top text-right",
                                                                        children: ridx === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                            className: "text-[9px] font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full border border-emerald-100 uppercase tracking-tighter",
                                                                            children: "PRIMARY"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                            lineNumber: 1396,
                                                                            columnNumber: 55
                                                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                            className: "text-[9px] font-bold text-amber-500 bg-amber-50 px-2 py-1 rounded-full border border-amber-100 uppercase tracking-tighter",
                                                                            children: "DUPLICATE"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                            lineNumber: 1398,
                                                                            columnNumber: 55
                                                                        }, this)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                        lineNumber: 1394,
                                                                        columnNumber: 47
                                                                    }, this)
                                                                ]
                                                            }, ridx, true, {
                                                                fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                lineNumber: 1365,
                                                                columnNumber: 43
                                                            }, this))
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/ImportCustomersModal.tsx",
                                                        lineNumber: 1363,
                                                        columnNumber: 35
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/ImportCustomersModal.tsx",
                                                lineNumber: 1354,
                                                columnNumber: 31
                                            }, this)
                                        ]
                                    }, idx, true, {
                                        fileName: "[project]/components/ImportCustomersModal.tsx",
                                        lineNumber: 1324,
                                        columnNumber: 27
                                    }, this)),
                                fileConflicts.length > 10 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "p-8 text-center bg-gray-50/50 border-t border-gray-100",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                        className: "text-xs font-bold text-gray-400 uppercase tracking-widest leading-loose",
                                        children: [
                                            "And ",
                                            fileConflicts.length - 10,
                                            " more duplicate clusters...",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("br", {}, void 0, false, {
                                                fileName: "[project]/components/ImportCustomersModal.tsx",
                                                lineNumber: 1411,
                                                columnNumber: 93
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                className: "text-[10px] font-medium lowercase",
                                                children: "Please handle these first to proceed."
                                            }, void 0, false, {
                                                fileName: "[project]/components/ImportCustomersModal.tsx",
                                                lineNumber: 1412,
                                                columnNumber: 35
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/ImportCustomersModal.tsx",
                                        lineNumber: 1410,
                                        columnNumber: 31
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                    lineNumber: 1409,
                                    columnNumber: 27
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/ImportCustomersModal.tsx",
                            lineNumber: 1322,
                            columnNumber: 19
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "px-5 py-3 border-t border-gray-100 flex items-center justify-between bg-white rounded-b-lg",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                            className: "text-gray-400 font-medium",
                                            children: [
                                                "Total groups: ",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                    className: "text-gray-700 font-bold",
                                                    children: fileConflicts.length
                                                }, void 0, false, {
                                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                                    lineNumber: 1422,
                                                    columnNumber: 43
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/ImportCustomersModal.tsx",
                                            lineNumber: 1421,
                                            columnNumber: 25
                                        }, this),
                                        selectedFileConflicts.size > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "flex items-center gap-2 animate-in slide-in-from-left-2 duration-200",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "h-4 w-px bg-gray-200"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                                    lineNumber: 1426,
                                                    columnNumber: 33
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                    className: "text-[11px] font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg",
                                                    children: [
                                                        selectedFileConflicts.size,
                                                        " Selected"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                                    lineNumber: 1427,
                                                    columnNumber: 33
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                    onClick: handleBulkFileReject,
                                                    className: "px-4 py-1.5 bg-rose-50 text-rose-600 rounded-lg font-bold text-[11px] hover:bg-rose-100 transition-all border border-rose-100",
                                                    children: "Reject Selected"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                                    lineNumber: 1430,
                                                    columnNumber: 33
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                    onClick: handleBulkFileMerge,
                                                    className: "px-4 py-1.5 bg-indigo-600 text-white rounded-lg font-bold text-[11px] hover:bg-slate-900 transition-all shadow-lg shadow-indigo-100",
                                                    children: "Merge Selected"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                                    lineNumber: 1436,
                                                    columnNumber: 33
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/ImportCustomersModal.tsx",
                                            lineNumber: 1425,
                                            columnNumber: 29
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                    lineNumber: 1420,
                                    columnNumber: 23
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "flex gap-2",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                        onClick: ()=>setShowFileConflictModal(false),
                                        className: "px-5 py-2 bg-gray-50 text-gray-600 rounded-lg font-bold text-[11px] hover:bg-gray-100 transition-all border border-gray-200",
                                        children: "Review CSV"
                                    }, void 0, false, {
                                        fileName: "[project]/components/ImportCustomersModal.tsx",
                                        lineNumber: 1446,
                                        columnNumber: 25
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                    lineNumber: 1445,
                                    columnNumber: 23
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/ImportCustomersModal.tsx",
                            lineNumber: 1419,
                            columnNumber: 19
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/ImportCustomersModal.tsx",
                    lineNumber: 1289,
                    columnNumber: 15
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/ImportCustomersModal.tsx",
                lineNumber: 1288,
                columnNumber: 11
            }, this),
            showDbConflictModal && dbConflicts.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "fixed inset-0 z-[140] flex items-center justify-center bg-black/30 backdrop-blur-sm p-4 text-xs",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: "bg-white rounded-lg w-full max-w-5xl shadow-2xl flex flex-col max-h-[85vh] border border-gray-100 overflow-hidden",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "px-5 py-4 border-b border-amber-50 flex items-center justify-between bg-white",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "flex items-center gap-3 mr-2",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                                type: "checkbox",
                                                checked: selectedDbConflicts.size === dbConflicts.length && dbConflicts.length > 0,
                                                onChange: toggleSelectAllDbConflicts,
                                                className: "w-4 h-4 rounded border-gray-300 text-amber-600 focus:ring-amber-500 cursor-pointer"
                                            }, void 0, false, {
                                                fileName: "[project]/components/ImportCustomersModal.tsx",
                                                lineNumber: 1467,
                                                columnNumber: 28
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/components/ImportCustomersModal.tsx",
                                            lineNumber: 1466,
                                            columnNumber: 25
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                className: "fi flex fi-rr-database text-sm"
                                            }, void 0, false, {
                                                fileName: "[project]/components/ImportCustomersModal.tsx",
                                                lineNumber: 1475,
                                                columnNumber: 28
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/components/ImportCustomersModal.tsx",
                                            lineNumber: 1474,
                                            columnNumber: 25
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                                                    className: "font-bold text-gray-800",
                                                    style: {
                                                        fontFamily: "'Poppins', sans-serif"
                                                    },
                                                    children: "Database Correlation Check"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                                    lineNumber: 1478,
                                                    columnNumber: 27
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                    className: "text-[10px] text-amber-500 font-bold uppercase tracking-tight",
                                                    children: [
                                                        "Stage 2: ",
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                            className: "text-amber-600 font-black",
                                                            children: dbConflicts.length
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/ImportCustomersModal.tsx",
                                                            lineNumber: 1480,
                                                            columnNumber: 38
                                                        }, this),
                                                        " records already exist in CRM (out of ",
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                            className: "text-gray-600",
                                                            children: fullyProcessedCustomers.length
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/ImportCustomersModal.tsx",
                                                            lineNumber: 1480,
                                                            columnNumber: 147
                                                        }, this),
                                                        " total records)"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                                    lineNumber: 1479,
                                                    columnNumber: 28
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/ImportCustomersModal.tsx",
                                            lineNumber: 1477,
                                            columnNumber: 25
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                    lineNumber: 1465,
                                    columnNumber: 23
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                    onClick: ()=>setShowDbConflictModal(false),
                                    className: "w-8 h-8 rounded-lg hover:bg-gray-50 flex items-center justify-center text-gray-400 transition-colors",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                        className: "fi flex fi-rr-cross-small text-xl"
                                    }, void 0, false, {
                                        fileName: "[project]/components/ImportCustomersModal.tsx",
                                        lineNumber: 1489,
                                        columnNumber: 25
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                    lineNumber: 1485,
                                    columnNumber: 23
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/ImportCustomersModal.tsx",
                            lineNumber: 1464,
                            columnNumber: 19
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "flex-1 overflow-y-auto custom-scrollbar bg-white",
                            children: [
                                dbConflicts.slice(0, 10).map((conflict, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "bg-white",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "px-5 py-2 bg-amber-50/20 flex items-center justify-between border-y border-amber-50/50",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: "flex items-center gap-3",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                                                type: "checkbox",
                                                                checked: selectedDbConflicts.has(idx),
                                                                onChange: ()=>toggleDbConflictSelection(idx),
                                                                className: "w-3.5 h-3.5 rounded border-gray-300 text-amber-600 focus:ring-amber-500 cursor-pointer"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                lineNumber: 1500,
                                                                columnNumber: 39
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                className: "font-bold text-amber-700 uppercase text-[10px] tracking-tight ml-1 leading-none",
                                                                children: [
                                                                    "Correlation Match #",
                                                                    idx + 1
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                lineNumber: 1506,
                                                                columnNumber: 39
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/ImportCustomersModal.tsx",
                                                        lineNumber: 1499,
                                                        columnNumber: 35
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: "flex gap-4 items-center",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                className: "text-[10px] text-gray-400 font-medium",
                                                                children: [
                                                                    "Phone: ",
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                        className: "text-gray-700 font-bold",
                                                                        children: conflict.fileRecord.display_phone
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                        lineNumber: 1509,
                                                                        columnNumber: 101
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                lineNumber: 1509,
                                                                columnNumber: 38
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                className: "h-4 w-px bg-amber-100"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                lineNumber: 1510,
                                                                columnNumber: 38
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                onClick: ()=>{
                                                                    setSelectedDbConflicts(new Set([
                                                                        idx
                                                                    ]));
                                                                    handleDbMergeSelected();
                                                                },
                                                                className: "text-[10px] font-bold text-amber-600 hover:text-amber-800 transition-colors flex items-center gap-1",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                        className: "fi flex fi-rr-check text-[9px]"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                        lineNumber: 1518,
                                                                        columnNumber: 41
                                                                    }, this),
                                                                    " Merge Choice"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                lineNumber: 1511,
                                                                columnNumber: 38
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                onClick: ()=>{
                                                                    setSelectedDbConflicts(new Set([
                                                                        idx
                                                                    ]));
                                                                    handleDbSkipSelected();
                                                                },
                                                                className: "text-[10px] font-bold text-rose-500 hover:text-rose-700 transition-colors flex items-center gap-1",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                        className: "fi flex fi-rr-cross text-[9px]"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                        lineNumber: 1527,
                                                                        columnNumber: 41
                                                                    }, this),
                                                                    " Reject New"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                lineNumber: 1520,
                                                                columnNumber: 38
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/ImportCustomersModal.tsx",
                                                        lineNumber: 1508,
                                                        columnNumber: 35
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/ImportCustomersModal.tsx",
                                                lineNumber: 1498,
                                                columnNumber: 31
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "grid grid-cols-2 divide-x divide-gray-100 border-b border-gray-50",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: "p-4 bg-indigo-50/5",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                className: "flex items-center justify-between mb-2",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                    className: "text-[9px] font-black text-indigo-400 uppercase tracking-widest",
                                                                    children: "Incoming Data"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                    lineNumber: 1537,
                                                                    columnNumber: 43
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                lineNumber: 1536,
                                                                columnNumber: 39
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                className: "flex items-start gap-3",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                    className: "flex-1",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                            className: "text-[11px] font-bold text-gray-800 leading-tight",
                                                                            children: conflict.fileRecord.customer_name
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                            lineNumber: 1541,
                                                                            columnNumber: 47
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                            className: "flex flex-wrap gap-1 mt-2",
                                                                            children: Object.entries(conflict.fileRecord.customer_details.history?.[conflict.fileRecord.customer_details.active_details] || {}).slice(0, 4).map(([k, v])=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                    className: "bg-white px-2 py-1 rounded border border-indigo-100 text-[10px]",
                                                                                    children: [
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                            className: "text-gray-400 font-bold text-[8px] mr-1",
                                                                                            children: [
                                                                                                k.replace('_checked', '').replace(/_/g, ' '),
                                                                                                ":"
                                                                                            ]
                                                                                        }, void 0, true, {
                                                                                            fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                                            lineNumber: 1547,
                                                                                            columnNumber: 60
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                            className: "text-indigo-600 font-bold",
                                                                                            children: String(v)
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                                            lineNumber: 1548,
                                                                                            columnNumber: 60
                                                                                        }, this)
                                                                                    ]
                                                                                }, k, true, {
                                                                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                                    lineNumber: 1546,
                                                                                    columnNumber: 56
                                                                                }, this))
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                            lineNumber: 1542,
                                                                            columnNumber: 47
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                    lineNumber: 1540,
                                                                    columnNumber: 43
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                lineNumber: 1539,
                                                                columnNumber: 39
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/ImportCustomersModal.tsx",
                                                        lineNumber: 1535,
                                                        columnNumber: 35
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: "p-4 bg-amber-50/5",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                className: "flex items-center justify-between mb-2",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                        className: "text-[9px] font-black text-amber-500 uppercase tracking-widest",
                                                                        children: "Database Record"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                        lineNumber: 1559,
                                                                        columnNumber: 43
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                        className: "px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full text-[9px] font-bold border border-amber-200 uppercase tracking-tighter",
                                                                        children: "EXISTS IN CRM"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                        lineNumber: 1560,
                                                                        columnNumber: 43
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                lineNumber: 1558,
                                                                columnNumber: 39
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                className: "flex items-start gap-3",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                    className: "flex-1",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                            className: `text-[11px] font-bold leading-tight ${conflict.dbRecord.customer_name !== conflict.fileRecord.customer_name ? 'text-rose-500' : 'text-gray-800'}`,
                                                                            children: [
                                                                                conflict.dbRecord.customer_name,
                                                                                conflict.dbRecord.customer_name !== conflict.fileRecord.customer_name && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                    className: "block text-[8px] font-medium italic mt-0.5 uppercase",
                                                                                    children: "(Name Mismatch)"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                                    lineNumber: 1567,
                                                                                    columnNumber: 55
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                            lineNumber: 1564,
                                                                            columnNumber: 47
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                            className: "flex flex-wrap gap-1 mt-2",
                                                                            children: (()=>{
                                                                                const dbDetails = typeof conflict.dbRecord.customer_details === 'string' ? JSON.parse(conflict.dbRecord.customer_details) : conflict.dbRecord.customer_details || {};
                                                                                const historyKey = dbDetails.active_details || Object.keys(dbDetails.history || {})[0] || 'details-1';
                                                                                const currentDetails = dbDetails.history?.[historyKey] || {};
                                                                                return Object.entries(currentDetails).slice(0, 4).map(([k, v])=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                        className: "bg-white px-2 py-1 rounded border border-amber-100 text-[10px]",
                                                                                        children: [
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                                className: "text-gray-400 font-bold text-[8px] mr-1",
                                                                                                children: [
                                                                                                    k.replace('_checked', '').replace(/_/g, ' '),
                                                                                                    ":"
                                                                                                ]
                                                                                            }, void 0, true, {
                                                                                                fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                                                lineNumber: 1581,
                                                                                                columnNumber: 65
                                                                                            }, this),
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                                className: "text-amber-600 font-bold",
                                                                                                children: String(v)
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                                                lineNumber: 1582,
                                                                                                columnNumber: 65
                                                                                            }, this)
                                                                                        ]
                                                                                    }, k, true, {
                                                                                        fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                                        lineNumber: 1580,
                                                                                        columnNumber: 61
                                                                                    }, this));
                                                                            })()
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                            lineNumber: 1570,
                                                                            columnNumber: 47
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                    lineNumber: 1563,
                                                                    columnNumber: 43
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                lineNumber: 1562,
                                                                columnNumber: 39
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/ImportCustomersModal.tsx",
                                                        lineNumber: 1557,
                                                        columnNumber: 35
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/ImportCustomersModal.tsx",
                                                lineNumber: 1533,
                                                columnNumber: 31
                                            }, this)
                                        ]
                                    }, idx, true, {
                                        fileName: "[project]/components/ImportCustomersModal.tsx",
                                        lineNumber: 1496,
                                        columnNumber: 27
                                    }, this)),
                                dbConflicts.length > 10 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "p-8 text-center bg-gray-50/50 border-t border-gray-100",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                        className: "text-xs font-bold text-gray-400 uppercase tracking-widest leading-loose",
                                        children: [
                                            "And ",
                                            dbConflicts.length - 10,
                                            " more Database matches found...",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("br", {}, void 0, false, {
                                                fileName: "[project]/components/ImportCustomersModal.tsx",
                                                lineNumber: 1597,
                                                columnNumber: 95
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                className: "text-[10px] font-medium lowercase italic",
                                                children: "Conflict strategy must be chosen for all."
                                            }, void 0, false, {
                                                fileName: "[project]/components/ImportCustomersModal.tsx",
                                                lineNumber: 1598,
                                                columnNumber: 35
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/ImportCustomersModal.tsx",
                                        lineNumber: 1596,
                                        columnNumber: 31
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                    lineNumber: 1595,
                                    columnNumber: 27
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/ImportCustomersModal.tsx",
                            lineNumber: 1494,
                            columnNumber: 19
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "px-5 py-3 border-t border-gray-100 flex items-center justify-between bg-white rounded-b-lg shadow-[0_-4px_10px_rgba(0,0,0,0.02)]",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                            className: "text-gray-400 font-medium",
                                            children: [
                                                "Total overlaps: ",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                    className: "text-gray-700 font-bold",
                                                    children: dbConflicts.length
                                                }, void 0, false, {
                                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                                    lineNumber: 1608,
                                                    columnNumber: 45
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/ImportCustomersModal.tsx",
                                            lineNumber: 1607,
                                            columnNumber: 25
                                        }, this),
                                        selectedDbConflicts.size > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "flex items-center gap-2 animate-in slide-in-from-left-2 duration-200",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "h-4 w-px bg-gray-200"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                                    lineNumber: 1612,
                                                    columnNumber: 33
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                    className: "text-[11px] font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded-lg",
                                                    children: [
                                                        selectedDbConflicts.size,
                                                        " Selected"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                                    lineNumber: 1613,
                                                    columnNumber: 33
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                    onClick: handleDbSkipSelected,
                                                    className: "px-4 py-1.5 bg-rose-50 text-rose-600 rounded-lg font-bold text-[11px] hover:bg-rose-100 transition-all border border-rose-100",
                                                    children: "Reject Selected"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                                    lineNumber: 1616,
                                                    columnNumber: 33
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                    onClick: handleDbMergeSelected,
                                                    className: "px-4 py-1.5 bg-amber-600 text-white rounded-lg font-bold text-[11px] hover:bg-amber-700 transition-all shadow-lg shadow-amber-100",
                                                    children: "Merge & Update CRM"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                                    lineNumber: 1622,
                                                    columnNumber: 33
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/ImportCustomersModal.tsx",
                                            lineNumber: 1611,
                                            columnNumber: 29
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                    lineNumber: 1606,
                                    columnNumber: 23
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "flex gap-2",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                        onClick: ()=>setShowDbConflictModal(false),
                                        className: "px-5 py-2 bg-gray-50 text-gray-600 rounded-lg font-bold text-[11px] hover:bg-gray-100 transition-all border border-gray-200",
                                        children: "Back to Map"
                                    }, void 0, false, {
                                        fileName: "[project]/components/ImportCustomersModal.tsx",
                                        lineNumber: 1632,
                                        columnNumber: 25
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                    lineNumber: 1631,
                                    columnNumber: 23
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/ImportCustomersModal.tsx",
                            lineNumber: 1605,
                            columnNumber: 19
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/ImportCustomersModal.tsx",
                    lineNumber: 1461,
                    columnNumber: 15
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/ImportCustomersModal.tsx",
                lineNumber: 1460,
                columnNumber: 11
            }, this),
            showConflictModal && duplicates.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "fixed inset-0 backdrop-blur-lg flex items-center justify-center z-[80] p-4",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: "bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col border border-gray-100",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "flex items-center justify-between p-6 border-b border-amber-100 bg-amber-50/50",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-600 shadow-inner",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                className: "fi flex fi-rr-triangle-warning text-xl"
                                            }, void 0, false, {
                                                fileName: "[project]/components/ImportCustomersModal.tsx",
                                                lineNumber: 1651,
                                                columnNumber: 20
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/components/ImportCustomersModal.tsx",
                                            lineNumber: 1650,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                                                    className: "text-xl font-bold text-amber-900",
                                                    style: {
                                                        fontFamily: "'Poppins', sans-serif"
                                                    },
                                                    children: "Duplicate Conflicts Detected"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                                    lineNumber: 1654,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                    className: "text-xs font-medium text-amber-600 uppercase tracking-widest",
                                                    children: [
                                                        duplicates.length,
                                                        " overlapping records found"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                                    lineNumber: 1655,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/ImportCustomersModal.tsx",
                                            lineNumber: 1653,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                    lineNumber: 1649,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                    onClick: ()=>setShowConflictModal(false),
                                    className: "w-10 h-10 rounded-xl hover:bg-white flex items-center justify-center text-gray-400 hover:text-gray-600 transition-all",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                        className: "fi flex fi-rr-cross text-lg"
                                    }, void 0, false, {
                                        fileName: "[project]/components/ImportCustomersModal.tsx",
                                        lineNumber: 1659,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                    lineNumber: 1658,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/ImportCustomersModal.tsx",
                            lineNumber: 1648,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "p-8 overflow-y-auto flex-1 custom-scrollbar space-y-6 bg-slate-50/30",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "p-4 bg-white border border-amber-100 rounded-xl text-sm text-amber-800 flex items-start gap-3",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                            className: "fi fi-rr-info mt-0.5"
                                        }, void 0, false, {
                                            fileName: "[project]/components/ImportCustomersModal.tsx",
                                            lineNumber: 1665,
                                            columnNumber: 18
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                            children: [
                                                "The following customers are already in your database. You can choose to ",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("strong", {
                                                    children: "Merge"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                                    lineNumber: 1666,
                                                    columnNumber: 93
                                                }, this),
                                                " the new information (update existing record) or ",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("strong", {
                                                    children: "Reject"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                                    lineNumber: 1666,
                                                    columnNumber: 164
                                                }, this),
                                                " the new entry (keep existing data)."
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/ImportCustomersModal.tsx",
                                            lineNumber: 1666,
                                            columnNumber: 18
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                    lineNumber: 1664,
                                    columnNumber: 15
                                }, this),
                                duplicates.slice(0, 10).map((dup, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "bg-slate-50 px-5 py-3 border-b border-gray-100 flex justify-between items-center",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: "flex items-center gap-2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                className: "text-xs font-bold text-slate-500 bg-slate-200 px-2 py-0.5 rounded-full",
                                                                children: [
                                                                    "#",
                                                                    idx + 1
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                lineNumber: 1673,
                                                                columnNumber: 24
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                className: "text-sm font-bold text-slate-700",
                                                                children: "Phone Conflict"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                lineNumber: 1674,
                                                                columnNumber: 24
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/ImportCustomersModal.tsx",
                                                        lineNumber: 1672,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                        className: "text-[10px] font-mono text-slate-400 bg-white px-2 py-1 rounded border border-gray-100",
                                                        children: [
                                                            "HASH: ",
                                                            dup.existing.phone_search_hash?.substring(0, 8),
                                                            "..."
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/ImportCustomersModal.tsx",
                                                        lineNumber: 1676,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/ImportCustomersModal.tsx",
                                                lineNumber: 1671,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "grid grid-cols-2 gap-px bg-gray-100",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: "bg-white p-6",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                className: "flex items-center gap-2 mb-4",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                        className: "w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500 border border-slate-200",
                                                                        children: "DB"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                        lineNumber: 1682,
                                                                        columnNumber: 25
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                        className: "text-[10px] font-black text-slate-400 uppercase tracking-widest",
                                                                        children: "Existing Record"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                        lineNumber: 1683,
                                                                        columnNumber: 25
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                lineNumber: 1681,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                className: "text-lg font-bold text-slate-900 mb-4",
                                                                children: dup.existing.customer_name || "Unnamed Customer"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                lineNumber: 1685,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                className: "space-y-2 p-3 bg-slate-50 rounded-xl border border-slate-100 min-h-[100px]",
                                                                children: [
                                                                    renderDetailsPreview(dup.existing.customer_details),
                                                                    !dup.existing.customer_details && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                        className: "text-[11px] text-slate-400 italic",
                                                                        children: "No details available"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                        lineNumber: 1688,
                                                                        columnNumber: 60
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                lineNumber: 1686,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/ImportCustomersModal.tsx",
                                                        lineNumber: 1680,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: "bg-white p-6",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                className: "flex items-center gap-2 mb-4",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                        className: "w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-[10px] font-bold text-white shadow-lg shadow-indigo-100",
                                                                        children: "CSV"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                        lineNumber: 1694,
                                                                        columnNumber: 25
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                        className: "text-[10px] font-black text-indigo-600 uppercase tracking-widest",
                                                                        children: "Incoming Row"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                        lineNumber: 1695,
                                                                        columnNumber: 25
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                lineNumber: 1693,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                className: "text-lg font-bold text-slate-900 mb-4",
                                                                children: dup.new.customer_name || "Unnamed Customer"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                lineNumber: 1697,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                className: "space-y-2 p-3 bg-indigo-50/50 rounded-xl border border-indigo-100/50 min-h-[100px]",
                                                                children: renderDetailsPreview(dup.new.customer_details)
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                lineNumber: 1698,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/ImportCustomersModal.tsx",
                                                        lineNumber: 1692,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/ImportCustomersModal.tsx",
                                                lineNumber: 1678,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "p-4 bg-slate-50 border-t border-gray-100 flex justify-end gap-3",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                        onClick: ()=>handleRejectDuplicate(dup.existing.id),
                                                        className: "px-5 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-white hover:text-slate-700 transition-all border border-transparent hover:border-slate-200",
                                                        children: "Reject Entry"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/ImportCustomersModal.tsx",
                                                        lineNumber: 1704,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                        onClick: ()=>handleMergeDuplicate(dup),
                                                        className: "px-6 py-2 rounded-xl text-xs font-bold bg-indigo-600 text-white hover:bg-slate-900 transition-all shadow-lg shadow-indigo-200 active:scale-95",
                                                        children: "Merge & Update"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/ImportCustomersModal.tsx",
                                                        lineNumber: 1710,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/ImportCustomersModal.tsx",
                                                lineNumber: 1703,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, idx, true, {
                                        fileName: "[project]/components/ImportCustomersModal.tsx",
                                        lineNumber: 1670,
                                        columnNumber: 17
                                    }, this)),
                                duplicates.length > 10 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "py-8 text-center bg-white rounded-2xl border border-dashed border-slate-200",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                            className: "text-sm font-bold text-slate-400 uppercase tracking-widest",
                                            children: [
                                                "+",
                                                duplicates.length - 10,
                                                " more conflicts remaining"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/ImportCustomersModal.tsx",
                                            lineNumber: 1721,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                            className: "text-xs text-slate-300 mt-1",
                                            children: "Please resolve the visible items to see more."
                                        }, void 0, false, {
                                            fileName: "[project]/components/ImportCustomersModal.tsx",
                                            lineNumber: 1722,
                                            columnNumber: 21
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                    lineNumber: 1720,
                                    columnNumber: 18
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/ImportCustomersModal.tsx",
                            lineNumber: 1663,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "p-6 border-t border-gray-200 bg-white flex justify-between items-center",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                    onClick: ()=>{
                                        if (confirm("Are you sure you want to reject all remaining duplicates?")) {
                                            setDuplicates([]);
                                            setShowConflictModal(false);
                                            setImportSuccess("Import complete. All duplicates were rejected.");
                                            if (onSuccess) onSuccess();
                                            setTimeout(handleClose, 2000);
                                        }
                                    },
                                    className: "text-xs font-bold text-slate-400 hover:text-red-500 transition-colors uppercase tracking-widest px-4",
                                    children: "Reject All Remaining"
                                }, void 0, false, {
                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                    lineNumber: 1728,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                            className: "text-xs font-bold text-slate-400",
                                            children: [
                                                duplicates.length,
                                                " items left"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/ImportCustomersModal.tsx",
                                            lineNumber: 1743,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                            onClick: handleMergeAll,
                                            disabled: importing,
                                            className: "px-6 py-3 bg-indigo-600 text-white rounded-xl text-xs font-bold shadow-xl hover:bg-slate-900 transition-all active:scale-95 disabled:opacity-50",
                                            children: importing ? "Merging..." : `Merge All (${duplicates.length})`
                                        }, void 0, false, {
                                            fileName: "[project]/components/ImportCustomersModal.tsx",
                                            lineNumber: 1745,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                            onClick: ()=>setShowConflictModal(false),
                                            className: "px-8 py-3 bg-slate-200 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-300 transition-all active:scale-95",
                                            children: "Close"
                                        }, void 0, false, {
                                            fileName: "[project]/components/ImportCustomersModal.tsx",
                                            lineNumber: 1753,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                    lineNumber: 1742,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/ImportCustomersModal.tsx",
                            lineNumber: 1727,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/ImportCustomersModal.tsx",
                    lineNumber: 1647,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/ImportCustomersModal.tsx",
                lineNumber: 1646,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true);
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/components/campaign/CampaignStatsGrid.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
;
const CampaignStatsGrid = ({ stats })=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        className: "grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-5 mb-8",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "relative overflow-hidden rounded-2xl p-4 sm:p-5 transition-all duration-200 flex flex-col hover:shadow-lg hover:scale-105 h-32 sm:h-38 bg-white border border-gray-100",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "absolute inset-0",
                        style: {
                            background: "radial-gradient(circle at right top, rgba(59, 130, 246, 0.12), transparent 60%)"
                        }
                    }, void 0, false, {
                        fileName: "[project]/components/campaign/CampaignStatsGrid.tsx",
                        lineNumber: 23,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "absolute -right-2 -bottom-2",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                            className: "fi flex fi-rr-users text-5xl",
                            style: {
                                color: "#3b82f6",
                                opacity: 0.15
                            }
                        }, void 0, false, {
                            fileName: "[project]/components/campaign/CampaignStatsGrid.tsx",
                            lineNumber: 25,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/components/campaign/CampaignStatsGrid.tsx",
                        lineNumber: 24,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "relative flex flex-col h-full z-10",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "flex items-start justify-between mb-auto",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                    className: "text-xs sm:text-sm font-medium",
                                    style: {
                                        color: "#787E9D",
                                        fontFamily: "'Roboto', sans-serif"
                                    },
                                    children: "Total Leads"
                                }, void 0, false, {
                                    fileName: "[project]/components/campaign/CampaignStatsGrid.tsx",
                                    lineNumber: 29,
                                    columnNumber: 25
                                }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/components/campaign/CampaignStatsGrid.tsx",
                                lineNumber: 28,
                                columnNumber: 21
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "mt-auto",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                        className: "text-xl   sm:text-4xl font-semibold",
                                        style: {
                                            color: "#263238",
                                            fontFamily: "'Poppins', sans-serif"
                                        },
                                        children: stats.totalCustomers
                                    }, void 0, false, {
                                        fileName: "[project]/components/campaign/CampaignStatsGrid.tsx",
                                        lineNumber: 32,
                                        columnNumber: 25
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                        className: "text-[10px] sm:text-[11px] mt-1 font-bold text-[#787E9D]",
                                        children: "Assigned to campaign"
                                    }, void 0, false, {
                                        fileName: "[project]/components/campaign/CampaignStatsGrid.tsx",
                                        lineNumber: 33,
                                        columnNumber: 25
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/campaign/CampaignStatsGrid.tsx",
                                lineNumber: 31,
                                columnNumber: 21
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/campaign/CampaignStatsGrid.tsx",
                        lineNumber: 27,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/components/campaign/CampaignStatsGrid.tsx",
                lineNumber: 22,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "relative overflow-hidden rounded-2xl p-4 sm:p-5 transition-all duration-200 flex flex-col hover:shadow-lg hover:scale-105 h-32 sm:h-38 bg-white border border-gray-100",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "absolute inset-0",
                        style: {
                            background: "radial-gradient(circle at right top, rgba(139, 92, 246, 0.12), transparent 60%)"
                        }
                    }, void 0, false, {
                        fileName: "[project]/components/campaign/CampaignStatsGrid.tsx",
                        lineNumber: 40,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "absolute -right-2 -bottom-2",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                            className: "fi flex fi-rr-bulb text-5xl",
                            style: {
                                color: "#8b5cf6",
                                opacity: 0.15
                            }
                        }, void 0, false, {
                            fileName: "[project]/components/campaign/CampaignStatsGrid.tsx",
                            lineNumber: 42,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/components/campaign/CampaignStatsGrid.tsx",
                        lineNumber: 41,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "relative flex flex-col h-full z-10",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "flex items-start justify-between mb-auto",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                    className: "text-xs sm:text-sm font-medium",
                                    style: {
                                        color: "#787E9D",
                                        fontFamily: "'Roboto', sans-serif"
                                    },
                                    children: "Fresh"
                                }, void 0, false, {
                                    fileName: "[project]/components/campaign/CampaignStatsGrid.tsx",
                                    lineNumber: 46,
                                    columnNumber: 25
                                }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/components/campaign/CampaignStatsGrid.tsx",
                                lineNumber: 45,
                                columnNumber: 21
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "mt-auto",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                        className: "text-xl   sm:text-4xl font-semibold",
                                        style: {
                                            color: "#263238",
                                            fontFamily: "'Poppins', sans-serif"
                                        },
                                        children: stats.freshProspects
                                    }, void 0, false, {
                                        fileName: "[project]/components/campaign/CampaignStatsGrid.tsx",
                                        lineNumber: 49,
                                        columnNumber: 25
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                        className: "text-[10px] sm:text-[11px] mt-1 font-bold text-[#787E9D]",
                                        children: "Not yet assigned"
                                    }, void 0, false, {
                                        fileName: "[project]/components/campaign/CampaignStatsGrid.tsx",
                                        lineNumber: 50,
                                        columnNumber: 25
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/campaign/CampaignStatsGrid.tsx",
                                lineNumber: 48,
                                columnNumber: 21
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/campaign/CampaignStatsGrid.tsx",
                        lineNumber: 44,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/components/campaign/CampaignStatsGrid.tsx",
                lineNumber: 39,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "relative overflow-hidden rounded-2xl p-4 sm:p-5 transition-all duration-200 flex flex-col hover:shadow-lg hover:scale-105 h-32 sm:h-38 bg-white border border-gray-100",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "absolute inset-0",
                        style: {
                            background: "radial-gradient(circle at right top, rgba(249, 115, 22, 0.12), transparent 60%)"
                        }
                    }, void 0, false, {
                        fileName: "[project]/components/campaign/CampaignStatsGrid.tsx",
                        lineNumber: 57,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "absolute -right-2 -bottom-2",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                            className: "fi flex fi-rr-phone-call text-5xl",
                            style: {
                                color: "#f97316",
                                opacity: 0.15
                            }
                        }, void 0, false, {
                            fileName: "[project]/components/campaign/CampaignStatsGrid.tsx",
                            lineNumber: 59,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/components/campaign/CampaignStatsGrid.tsx",
                        lineNumber: 58,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "relative flex flex-col h-full z-10",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "flex items-start justify-between mb-auto",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                    className: "text-xs sm:text-sm font-medium",
                                    style: {
                                        color: "#787E9D",
                                        fontFamily: "'Roboto', sans-serif"
                                    },
                                    children: "Follow-ups"
                                }, void 0, false, {
                                    fileName: "[project]/components/campaign/CampaignStatsGrid.tsx",
                                    lineNumber: 63,
                                    columnNumber: 25
                                }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/components/campaign/CampaignStatsGrid.tsx",
                                lineNumber: 62,
                                columnNumber: 21
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "mt-auto",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                        className: "text-xl   sm:text-4xl font-semibold",
                                        style: {
                                            color: "#263238",
                                            fontFamily: "'Poppins', sans-serif"
                                        },
                                        children: stats.followupCount
                                    }, void 0, false, {
                                        fileName: "[project]/components/campaign/CampaignStatsGrid.tsx",
                                        lineNumber: 66,
                                        columnNumber: 25
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                        className: "text-[10px] sm:text-[11px] mt-1 font-bold text-[#787E9D]",
                                        children: "Pending action"
                                    }, void 0, false, {
                                        fileName: "[project]/components/campaign/CampaignStatsGrid.tsx",
                                        lineNumber: 67,
                                        columnNumber: 25
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/campaign/CampaignStatsGrid.tsx",
                                lineNumber: 65,
                                columnNumber: 21
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/campaign/CampaignStatsGrid.tsx",
                        lineNumber: 61,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/components/campaign/CampaignStatsGrid.tsx",
                lineNumber: 56,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "relative overflow-hidden rounded-2xl p-4 sm:p-5 transition-all duration-200 flex flex-col hover:shadow-lg hover:scale-105 h-32 sm:h-38 bg-white border border-gray-100",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "absolute inset-0",
                        style: {
                            background: "radial-gradient(circle at right top, rgba(16, 185, 129, 0.12), transparent 60%)"
                        }
                    }, void 0, false, {
                        fileName: "[project]/components/campaign/CampaignStatsGrid.tsx",
                        lineNumber: 74,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "absolute -right-2 -bottom-2",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                            className: "fi flex fi-rr-calendar-clock text-5xl",
                            style: {
                                color: "#10b981",
                                opacity: 0.15
                            }
                        }, void 0, false, {
                            fileName: "[project]/components/campaign/CampaignStatsGrid.tsx",
                            lineNumber: 76,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/components/campaign/CampaignStatsGrid.tsx",
                        lineNumber: 75,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "relative flex flex-col h-full z-10",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "flex items-start justify-between mb-auto",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                    className: "text-xs sm:text-sm font-medium",
                                    style: {
                                        color: "#787E9D",
                                        fontFamily: "'Roboto', sans-serif"
                                    },
                                    children: "Upcoming"
                                }, void 0, false, {
                                    fileName: "[project]/components/campaign/CampaignStatsGrid.tsx",
                                    lineNumber: 80,
                                    columnNumber: 25
                                }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/components/campaign/CampaignStatsGrid.tsx",
                                lineNumber: 79,
                                columnNumber: 21
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "mt-auto",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                        className: "text-xl   sm:text-4xl font-semibold",
                                        style: {
                                            color: "#263238",
                                            fontFamily: "'Poppins', sans-serif"
                                        },
                                        children: stats.upcomingProspects
                                    }, void 0, false, {
                                        fileName: "[project]/components/campaign/CampaignStatsGrid.tsx",
                                        lineNumber: 83,
                                        columnNumber: 25
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                        className: "text-[10px] sm:text-[11px] mt-1 font-bold text-[#787E9D]",
                                        children: "Scheduled leads"
                                    }, void 0, false, {
                                        fileName: "[project]/components/campaign/CampaignStatsGrid.tsx",
                                        lineNumber: 84,
                                        columnNumber: 25
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/campaign/CampaignStatsGrid.tsx",
                                lineNumber: 82,
                                columnNumber: 21
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/campaign/CampaignStatsGrid.tsx",
                        lineNumber: 78,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/components/campaign/CampaignStatsGrid.tsx",
                lineNumber: 73,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "relative overflow-hidden rounded-2xl p-4 sm:p-5 transition-all duration-200 flex flex-col hover:shadow-lg hover:scale-105 h-32 sm:h-38 bg-white border border-gray-100",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "absolute inset-0",
                        style: {
                            background: "radial-gradient(circle at right top, rgba(185, 22, 16, 0.12), transparent 60%)"
                        }
                    }, void 0, false, {
                        fileName: "[project]/components/campaign/CampaignStatsGrid.tsx",
                        lineNumber: 91,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "absolute -right-2 -bottom-2",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                            className: "fi flex fi-rr-time-watch-calendar text-5xl",
                            style: {
                                color: "#ef4444",
                                opacity: 0.15
                            }
                        }, void 0, false, {
                            fileName: "[project]/components/campaign/CampaignStatsGrid.tsx",
                            lineNumber: 93,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/components/campaign/CampaignStatsGrid.tsx",
                        lineNumber: 92,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "relative flex flex-col h-full z-10",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "flex items-start justify-between mb-auto",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                    className: "text-xs sm:text-sm font-medium",
                                    style: {
                                        color: "#787E9D",
                                        fontFamily: "'Roboto', sans-serif"
                                    },
                                    children: "Overdue"
                                }, void 0, false, {
                                    fileName: "[project]/components/campaign/CampaignStatsGrid.tsx",
                                    lineNumber: 97,
                                    columnNumber: 25
                                }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/components/campaign/CampaignStatsGrid.tsx",
                                lineNumber: 96,
                                columnNumber: 21
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "mt-auto",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                        className: "text-xl   sm:text-4xl font-semibold text-red-600",
                                        style: {
                                            color: "#263238",
                                            fontFamily: "'Poppins', sans-serif"
                                        },
                                        children: stats.overdueCount
                                    }, void 0, false, {
                                        fileName: "[project]/components/campaign/CampaignStatsGrid.tsx",
                                        lineNumber: 100,
                                        columnNumber: 25
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                        className: "text-[10px] sm:text-[11px] mt-1 font-bold text-red-400",
                                        children: "Past due date"
                                    }, void 0, false, {
                                        fileName: "[project]/components/campaign/CampaignStatsGrid.tsx",
                                        lineNumber: 101,
                                        columnNumber: 25
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/campaign/CampaignStatsGrid.tsx",
                                lineNumber: 99,
                                columnNumber: 21
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/campaign/CampaignStatsGrid.tsx",
                        lineNumber: 95,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/components/campaign/CampaignStatsGrid.tsx",
                lineNumber: 90,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/components/campaign/CampaignStatsGrid.tsx",
        lineNumber: 20,
        columnNumber: 9
    }, ("TURBOPACK compile-time value", void 0));
};
const __TURBOPACK__default__export__ = CampaignStatsGrid;
}),
"[project]/components/campaign/CampaignHeader.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
;
const CampaignHeader = ({ id, campaign, campaignStats, calling, onStartCalling })=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        className: "relative overflow-hidden rounded-3xl bg-white p-6 md:p-8 shadow-sm border border-gray-100 mb-8 group",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-700"
            }, void 0, false, {
                fileName: "[project]/components/campaign/CampaignHeader.tsx",
                lineNumber: 33,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "absolute top-0 right-0 p-8 opacity-[0.03] transform group-hover:scale-110 transition-transform duration-700",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                    className: "fi flex fi-rr-megaphone text-9xl"
                }, void 0, false, {
                    fileName: "[project]/components/campaign/CampaignHeader.tsx",
                    lineNumber: 35,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/components/campaign/CampaignHeader.tsx",
                lineNumber: 34,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "max-w-3xl",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-4 mb-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-[#4b33e8] shadow-sm",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                            className: "fi flex fi-rr-megaphone text-xl"
                                        }, void 0, false, {
                                            fileName: "[project]/components/campaign/CampaignHeader.tsx",
                                            lineNumber: 42,
                                            columnNumber: 29
                                        }, ("TURBOPACK compile-time value", void 0))
                                    }, void 0, false, {
                                        fileName: "[project]/components/campaign/CampaignHeader.tsx",
                                        lineNumber: 41,
                                        columnNumber: 25
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h1", {
                                                className: "text-xl  md:text-xl   font-black text-gray-800",
                                                style: {
                                                    color: "#263238",
                                                    fontFamily: "'Poppins', sans-serif"
                                                },
                                                children: campaign?.name
                                            }, void 0, false, {
                                                fileName: "[project]/components/campaign/CampaignHeader.tsx",
                                                lineNumber: 45,
                                                columnNumber: 29
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-2 mt-1",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                        className: `px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest ${campaign?.status === 'active' ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-orange-100 text-orange-700 border border-orange-200'}`,
                                                        children: campaign?.status
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/campaign/CampaignHeader.tsx",
                                                        lineNumber: 49,
                                                        columnNumber: 33
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: "w-1 h-1 rounded-full bg-gray-300 mx-1"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/campaign/CampaignHeader.tsx",
                                                        lineNumber: 53,
                                                        columnNumber: 33
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                        className: "text-[10px] text-gray-400 font-bold uppercase tracking-tight",
                                                        children: [
                                                            "Campaign ID: ",
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                className: "text-gray-600",
                                                                children: id
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/campaign/CampaignHeader.tsx",
                                                                lineNumber: 54,
                                                                columnNumber: 125
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/campaign/CampaignHeader.tsx",
                                                        lineNumber: 54,
                                                        columnNumber: 33
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/campaign/CampaignHeader.tsx",
                                                lineNumber: 48,
                                                columnNumber: 29
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/campaign/CampaignHeader.tsx",
                                        lineNumber: 44,
                                        columnNumber: 25
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/campaign/CampaignHeader.tsx",
                                lineNumber: 40,
                                columnNumber: 21
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                className: "text-gray-500 text-sm leading-relaxed mb-6 font-medium",
                                children: campaign?.description || 'No description provided for this campaign.'
                            }, void 0, false, {
                                fileName: "[project]/components/campaign/CampaignHeader.tsx",
                                lineNumber: 58,
                                columnNumber: 21
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "flex flex-wrap items-center gap-6",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-2 text-[11px] font-bold text-gray-400 uppercase tracking-tight",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "w-6 h-6 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                    className: "fi flex fi-rr-calendar"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/campaign/CampaignHeader.tsx",
                                                    lineNumber: 64,
                                                    columnNumber: 33
                                                }, ("TURBOPACK compile-time value", void 0))
                                            }, void 0, false, {
                                                fileName: "[project]/components/campaign/CampaignHeader.tsx",
                                                lineNumber: 63,
                                                columnNumber: 29
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                children: [
                                                    "Created: ",
                                                    campaign?.created_at ? new Date(campaign.created_at).toLocaleDateString() : 'N/A'
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/campaign/CampaignHeader.tsx",
                                                lineNumber: 66,
                                                columnNumber: 29
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/campaign/CampaignHeader.tsx",
                                        lineNumber: 62,
                                        columnNumber: 25
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-2 text-[11px] font-bold text-gray-400 uppercase tracking-tight",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "w-6 h-6 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                    className: "fi flex fi-rr-user"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/campaign/CampaignHeader.tsx",
                                                    lineNumber: 70,
                                                    columnNumber: 33
                                                }, ("TURBOPACK compile-time value", void 0))
                                            }, void 0, false, {
                                                fileName: "[project]/components/campaign/CampaignHeader.tsx",
                                                lineNumber: 69,
                                                columnNumber: 29
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                children: [
                                                    "Creator: ",
                                                    campaign?.created_by || 'System',
                                                    " ",
                                                    campaign?.employee_id ? `(#${campaign.employee_id})` : ''
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/campaign/CampaignHeader.tsx",
                                                lineNumber: 72,
                                                columnNumber: 29
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/campaign/CampaignHeader.tsx",
                                        lineNumber: 68,
                                        columnNumber: 25
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    campaign?.organizations && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-2 text-[11px] font-bold text-gray-400 uppercase tracking-tight",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "w-6 h-6 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                    className: "fi flex fi-rr-building"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/campaign/CampaignHeader.tsx",
                                                    lineNumber: 77,
                                                    columnNumber: 37
                                                }, ("TURBOPACK compile-time value", void 0))
                                            }, void 0, false, {
                                                fileName: "[project]/components/campaign/CampaignHeader.tsx",
                                                lineNumber: 76,
                                                columnNumber: 33
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                className: "text-blue-600",
                                                children: [
                                                    "Org: ",
                                                    campaign.organizations.company_name,
                                                    " ",
                                                    campaign.organizations.org_code ? `(${campaign.organizations.org_code})` : ''
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/campaign/CampaignHeader.tsx",
                                                lineNumber: 79,
                                                columnNumber: 33
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/campaign/CampaignHeader.tsx",
                                        lineNumber: 75,
                                        columnNumber: 29
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/campaign/CampaignHeader.tsx",
                                lineNumber: 61,
                                columnNumber: 21
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/campaign/CampaignHeader.tsx",
                        lineNumber: 39,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "flex flex-wrap gap-4 items-center self-start lg:self-center",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-3 bg-white px-5 py-4 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shadow-sm transition-transform hover:scale-110",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                            className: "fi flex fi-rr-microphone-alt text-base"
                                        }, void 0, false, {
                                            fileName: "[project]/components/campaign/CampaignHeader.tsx",
                                            lineNumber: 89,
                                            columnNumber: 29
                                        }, ("TURBOPACK compile-time value", void 0))
                                    }, void 0, false, {
                                        fileName: "[project]/components/campaign/CampaignHeader.tsx",
                                        lineNumber: 88,
                                        columnNumber: 25
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "flex flex-col",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                className: "text-[10px] font-bold text-gray-400 uppercase tracking-wider leading-none mb-1.5",
                                                children: "Talk Time"
                                            }, void 0, false, {
                                                fileName: "[project]/components/campaign/CampaignHeader.tsx",
                                                lineNumber: 92,
                                                columnNumber: 29
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                className: "text-base font-black text-gray-800 leading-none",
                                                children: campaignStats.talkTime
                                            }, void 0, false, {
                                                fileName: "[project]/components/campaign/CampaignHeader.tsx",
                                                lineNumber: 93,
                                                columnNumber: 29
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/campaign/CampaignHeader.tsx",
                                        lineNumber: 91,
                                        columnNumber: 25
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/campaign/CampaignHeader.tsx",
                                lineNumber: 87,
                                columnNumber: 21
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-3 bg-white px-5 py-4 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 shadow-sm transition-transform hover:scale-110",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                            className: "fi flex fi-rr-phone-call text-base"
                                        }, void 0, false, {
                                            fileName: "[project]/components/campaign/CampaignHeader.tsx",
                                            lineNumber: 100,
                                            columnNumber: 29
                                        }, ("TURBOPACK compile-time value", void 0))
                                    }, void 0, false, {
                                        fileName: "[project]/components/campaign/CampaignHeader.tsx",
                                        lineNumber: 99,
                                        columnNumber: 25
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "flex flex-col",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                className: "text-[10px] font-bold text-gray-400 uppercase tracking-wider leading-none mb-1.5",
                                                children: "Total Dials"
                                            }, void 0, false, {
                                                fileName: "[project]/components/campaign/CampaignHeader.tsx",
                                                lineNumber: 103,
                                                columnNumber: 29
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                className: "text-base font-black text-gray-800 leading-none",
                                                children: campaignStats.totalDials
                                            }, void 0, false, {
                                                fileName: "[project]/components/campaign/CampaignHeader.tsx",
                                                lineNumber: 104,
                                                columnNumber: 29
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/campaign/CampaignHeader.tsx",
                                        lineNumber: 102,
                                        columnNumber: 25
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/campaign/CampaignHeader.tsx",
                                lineNumber: 98,
                                columnNumber: 21
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                onClick: onStartCalling,
                                disabled: calling,
                                className: `flex items-center gap-4 px-7 py-4 rounded-2xl border border-white/10 shadow-xl shadow-indigo-200/50 transition-all hover:scale-[1.03] active:scale-95 group/btn relative overflow-hidden h-18 ${calling ? 'opacity-80' : ''}`,
                                style: {
                                    background: 'linear-gradient(135deg, #4b33e8 0%, #8b5cf6 100%)'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "absolute inset-0 bg-white/10 opacity-0 group-hover/btn:opacity-100 transition-opacity"
                                    }, void 0, false, {
                                        fileName: "[project]/components/campaign/CampaignHeader.tsx",
                                        lineNumber: 117,
                                        columnNumber: 25
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "relative z-10 w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white group-hover/btn:bg-white/30 transition-colors shadow-sm ring-1 ring-white/30",
                                        children: calling ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"
                                        }, void 0, false, {
                                            fileName: "[project]/components/campaign/CampaignHeader.tsx",
                                            lineNumber: 121,
                                            columnNumber: 33
                                        }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                            className: "fi flex fi-rr-play text-sm ml-0.5"
                                        }, void 0, false, {
                                            fileName: "[project]/components/campaign/CampaignHeader.tsx",
                                            lineNumber: 123,
                                            columnNumber: 33
                                        }, ("TURBOPACK compile-time value", void 0))
                                    }, void 0, false, {
                                        fileName: "[project]/components/campaign/CampaignHeader.tsx",
                                        lineNumber: 119,
                                        columnNumber: 25
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "relative z-10 flex flex-col items-start translate-y-[1px]",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                className: "text-[10px] font-bold text-white/70 uppercase tracking-widest leading-none mb-1.5",
                                                children: calling ? 'Assigning...' : 'Mission'
                                            }, void 0, false, {
                                                fileName: "[project]/components/campaign/CampaignHeader.tsx",
                                                lineNumber: 127,
                                                columnNumber: 29
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                className: "text-base font-black text-white leading-none",
                                                children: calling ? 'Finding Lead' : 'Start Calling'
                                            }, void 0, false, {
                                                fileName: "[project]/components/campaign/CampaignHeader.tsx",
                                                lineNumber: 128,
                                                columnNumber: 29
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/campaign/CampaignHeader.tsx",
                                        lineNumber: 126,
                                        columnNumber: 25
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/campaign/CampaignHeader.tsx",
                                lineNumber: 109,
                                columnNumber: 21
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/campaign/CampaignHeader.tsx",
                        lineNumber: 85,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/components/campaign/CampaignHeader.tsx",
                lineNumber: 38,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/components/campaign/CampaignHeader.tsx",
        lineNumber: 32,
        columnNumber: 9
    }, ("TURBOPACK compile-time value", void 0));
};
const __TURBOPACK__default__export__ = CampaignHeader;
}),
"[project]/pages/portal/campaign/[id].tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "default",
    ()=>CampaignDetails
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/router.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$authService$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/authService.ts [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabase.ts [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$UserContext$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/context/UserContext.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useSessionState$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/useSessionState.ts [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$chart$2f$AreaChart$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/chart/AreaChart.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$Area$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/cartesian/Area.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$XAxis$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/cartesian/XAxis.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$YAxis$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/cartesian/YAxis.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$CartesianGrid$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/cartesian/CartesianGrid.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$component$2f$Tooltip$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/component/Tooltip.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$component$2f$ResponsiveContainer$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/component/ResponsiveContainer.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$chart$2f$BarChart$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/chart/BarChart.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$Bar$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/cartesian/Bar.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$component$2f$Cell$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/component/Cell.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$chart$2f$PieChart$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/chart/PieChart.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$polar$2f$Pie$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/polar/Pie.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$component$2f$Legend$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/component/Legend.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ImportCustomersModal$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ImportCustomersModal.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$phoneUtils$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/phoneUtils.ts [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$campaign$2f$CampaignStatsGrid$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/campaign/CampaignStatsGrid.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$campaign$2f$CampaignHeader$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/campaign/CampaignHeader.tsx [ssr] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$authService$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ImportCustomersModal$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$authService$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ImportCustomersModal$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
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
const COLORS = [
    '#4b33e8',
    '#00C49F',
    '#FFBB28',
    '#FF8042',
    '#FF4560',
    '#775DD0'
];
function CampaignDetails() {
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const { id } = router.query;
    const { user, loading: authLoading, mounted: userMounted } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$UserContext$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["useUser"])();
    // Permission Flags using the global user
    const isLevel1User = user?.isClient === true && (user?.designation?.toLowerCase() === 'agent' || !user?.designation);
    const isLevel2User = user?.isClient === true && (user?.designation?.toLowerCase() === 'team_leader' || user?.designation?.toLowerCase() === 'manager');
    const userId = user?.uid;
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(true);
    const [campaign, setCampaign] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(null);
    const [stats, setStats] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])({
        totalCustomers: 0,
        followupCount: 0,
        overdueCount: 0,
        freshProspects: 0,
        upcomingProspects: 0,
        recentCount: 0,
        managedCount: 0
    });
    const [analytics, setAnalytics] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])({
        hourly_calls: [],
        agent_performance: [],
        disposition_stats: [],
        hourly_detailed: [],
        caller_performance: []
    });
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])("");
    const [selectedDate, setSelectedDate] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useSessionState$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["useSessionState"])("camp_selectedDate", new Date().toISOString().split('T')[0]);
    const [leads, setLeads] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])([]);
    const [recentCalls, setRecentCalls] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])([]);
    const [overdueLeads, setOverdueLeads] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])([]);
    const [upcomingLeads, setUpcomingLeads] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])([]);
    const [managedLeads, setManagedLeads] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])([]);
    const [loadingLeads, setLoadingLeads] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const [expandedChart, setExpandedChart] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(null);
    const [campaignStats, setCampaignStats] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])({
        talkTime: '0h 0m',
        totalDials: 0
    });
    const dateInputRef = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useRef"])(null);
    const [currentPage, setCurrentPage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useSessionState$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["useSessionState"])("camp_currentPage", 1);
    const [leadsPerPage] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(10);
    const [totalLeadsCount, setTotalLeadsCount] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(0);
    const [mounted, setMounted] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const [teamMemberIds, setTeamMemberIds] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])([]);
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        setMounted(true);
    }, []);
    const [searchQuery, setSearchQuery] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useSessionState$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["useSessionState"])("camp_searchQuery", "");
    const [selectedLeads, setSelectedLeads] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])([]);
    const [selectedUserFilter, setSelectedUserFilter] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useSessionState$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["useSessionState"])("camp_selectedUserFilter", "");
    const [selectedDispositionFilter, setSelectedDispositionFilter] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useSessionState$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["useSessionState"])("camp_selectedDispFilter", "");
    const [showImportModal, setShowImportModal] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
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
    const fetchCampaignData = async ()=>{
        if (!id) return;
        try {
            setLoading(true);
            // 1. Fetch Campaign Details with organization
            const { data: cRows, error: campaignError } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from('campaigns').select('*, organizations(id, company_name, org_code)').eq('id', id).limit(1);
            const campaignData = cRows ? cRows[0] : null;
            if (campaignError) throw campaignError;
            setCampaign(campaignData);
            const now = new Date().toISOString();
            const twentyFourHoursAgoCount = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
            // 2. Fetch Stats & Analytics in Parallel
            // User constraints are now defined at the component level
            // --- LEVEL 2: Fetch Team Members if applicable ---
            let effectiveTeamMembers = [];
            if (isLevel2User && userId) {
                const { data: teamData } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from('teams').select('members').eq('leader_id', userId).eq('is_active', true);
                if (teamData && teamData.length > 0) {
                    // Collect all members from teams where user is leader
                    const allMembers = teamData.flatMap((t)=>t.members || []);
                    // Intersection with campaign users
                    const campaignUserIds = (campaignData?.users || []).map((u)=>u.user_id || u.id);
                    effectiveTeamMembers = allMembers.filter((mid)=>campaignUserIds.includes(mid));
                    // Also include the TL themselves if they are in the campaign
                    if (campaignUserIds.includes(userId) && !effectiveTeamMembers.includes(userId)) {
                        effectiveTeamMembers.push(userId);
                    }
                    console.log('--- TL Debug ---', {
                        userId,
                        allMembers,
                        campaignUserIds,
                        effectiveTeamMembers
                    });
                    setTeamMemberIds(effectiveTeamMembers);
                }
            }
            const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
            // Prepare Queries based on User Level
            // Total Customers
            let qTotal = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from('customers').select('*', {
                count: 'exact',
                head: true
            }).eq('campaign_id', id);
            if (isLevel1User && userId) qTotal = qTotal.eq('assigned_to', userId);
            if (isLevel2User) qTotal = effectiveTeamMembers.length > 0 ? qTotal.in('assigned_to', effectiveTeamMembers) : qTotal.eq('assigned_to', '00000000-0000-0000-0000-000000000000');
            // Follow-ups
            let qFollowup = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from('customers').select('*', {
                count: 'exact',
                head: true
            }).eq('campaign_id', id).eq('status', 'followup');
            if (isLevel1User && userId) qFollowup = qFollowup.eq('assigned_to', userId);
            if (isLevel2User) qFollowup = effectiveTeamMembers.length > 0 ? qFollowup.in('assigned_to', effectiveTeamMembers) : qFollowup.eq('assigned_to', '00000000-0000-0000-0000-000000000000');
            // Overdue
            let qOverdue = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from('customers').select('*', {
                count: 'exact',
                head: true
            }).eq('campaign_id', id).eq('status', 'followup').lt('expiry_date', now);
            if (isLevel1User && userId) qOverdue = qOverdue.eq('assigned_to', userId);
            if (isLevel2User) qOverdue = effectiveTeamMembers.length > 0 ? qOverdue.in('assigned_to', effectiveTeamMembers) : qOverdue.eq('assigned_to', '00000000-0000-0000-0000-000000000000');
            // Upcoming
            let qUpcoming = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from('customers').select('*', {
                count: 'exact',
                head: true
            }).eq('campaign_id', id).eq('status', 'followup').gte('expiry_date', now);
            if (isLevel1User && userId) qUpcoming = qUpcoming.eq('assigned_to', userId);
            if (isLevel2User) qUpcoming = effectiveTeamMembers.length > 0 ? qUpcoming.in('assigned_to', effectiveTeamMembers) : qUpcoming.eq('assigned_to', '00000000-0000-0000-0000-000000000000');
            // Managed
            let qManaged = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from('customers').select('*', {
                count: 'exact',
                head: true
            }).eq('campaign_id', id).not('managed_by', 'is', null);
            if (isLevel1User && userId) qManaged = qManaged.eq('assigned_to', userId);
            if (isLevel2User) qManaged = effectiveTeamMembers.length > 0 ? qManaged.in('assigned_to', effectiveTeamMembers) : qManaged.eq('assigned_to', '00000000-0000-0000-0000-000000000000');
            // Fresh (Unassigned or explicitly Fresh)
            let qFresh = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from('customers').select('*', {
                count: 'exact',
                head: true
            }).eq('campaign_id', id).is('disposition', null).eq('attempt_count', 0);
            // Recent (Calls made by specific user if L1, or team if L2)
            let qRecentCount = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from('call_logs').select('*', {
                count: 'exact',
                head: true
            }).eq('campaign_id', id).gte('created_at', twentyFourHoursAgoCount);
            if (isLevel1User && userId) qRecentCount = qRecentCount.eq('agent_id', userId);
            if (isLevel2User) qRecentCount = effectiveTeamMembers.length > 0 ? qRecentCount.in('agent_id', effectiveTeamMembers) : qRecentCount.eq('agent_id', '00000000-0000-0000-0000-000000000000');
            // Analytics (Client-side aggregation to avoid RPC timeout)
            const rangeStart = new Date(selectedDate);
            rangeStart.setHours(0, 0, 0, 0);
            const rangeEnd = new Date(selectedDate);
            rangeEnd.setHours(23, 59, 59, 999);
            const startISO = rangeStart.toISOString();
            const endISO = rangeEnd.toISOString();
            const analyticsPromise = (async ()=>{
                try {
                    const { data: logs, error: logsError } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from('call_logs').select('agent_id, duration, created_at, disposition, is_connected').eq('campaign_id', id).gte('created_at', startISO).lte('created_at', endISO);
                    if (logsError) throw logsError;
                    const hourlyMap = {};
                    const callerMap = {};
                    const dispMap = {};
                    (logs || []).forEach((log)=>{
                        // Hourly Stats
                        const hour = new Date(log.created_at).getHours();
                        if (!hourlyMap[hour]) {
                            hourlyMap[hour] = {
                                hour,
                                total_calls: 0,
                                connected_calls: 0,
                                outgoing_calls: 0,
                                incoming_calls: 0,
                                missed_calls: 0,
                                total_duration: 0
                            };
                        }
                        const hStats = hourlyMap[hour];
                        hStats.total_calls++;
                        hStats.total_duration += log.duration || 0;
                        // Disposition Stats
                        const disp = log.disposition || 'No Disposition';
                        dispMap[disp] = (dispMap[disp] || 0) + 1;
                        // Caller Performance
                        const agentId = log.agent_id;
                        if (!callerMap[agentId]) {
                            callerMap[agentId] = {
                                user_id: agentId,
                                total_calls: 0,
                                connected_calls: 0,
                                total_duration: 0,
                                incoming_calls: 0,
                                outgoing_calls: 0,
                                missed_calls: 0
                            };
                        }
                        const cStats = callerMap[agentId];
                        cStats.total_calls++;
                        cStats.total_duration += log.duration || 0;
                        const isConnected = (log.duration || 0) > 0 || String(log.is_connected).toLowerCase() === 'true' || String(log.is_connected).toLowerCase() === 'yes';
                        if (isConnected) {
                            hStats.connected_calls++;
                            cStats.connected_calls++;
                        } else {
                            hStats.missed_calls++;
                            cStats.missed_calls++;
                        }
                        // Assuming outgoing for campaign dashboard stats
                        hStats.outgoing_calls++;
                        cStats.outgoing_calls++;
                    });
                    return {
                        data: {
                            hourly_calls: Object.values(hourlyMap).map((h)=>({
                                    hour: h.hour,
                                    count: h.total_calls
                                })).sort((a, b)=>a.hour - b.hour),
                            agent_performance: [],
                            disposition_stats: Object.entries(dispMap).map(([d, c])=>({
                                    name: d,
                                    value: c
                                })),
                            hourly_detailed: Object.values(hourlyMap).sort((a, b)=>a.hour - b.hour),
                            caller_performance: Object.values(callerMap)
                        },
                        error: null
                    };
                } catch (e) {
                    console.error("Failed to aggregate analytics:", e);
                    return {
                        data: null,
                        error: e
                    };
                }
            })();
            const [{ count: totalCount }, { count: followupCount }, { count: overdueCount }, { count: freshCount }, { count: upcomingCount }, { count: recentCount }, { count: managedCount }, analyticsResponse, todayStatsResponse] = await Promise.all([
                qTotal,
                qFollowup,
                qOverdue,
                qFresh,
                qUpcoming,
                qRecentCount,
                qManaged,
                analyticsPromise,
                __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].rpc('get_today_campaign_stats', {
                    campaign_id_input: id
                }) // 8
            ]);
            setStats({
                totalCustomers: totalCount || 0,
                followupCount: followupCount || 0,
                overdueCount: overdueCount || 0,
                freshProspects: freshCount || 0,
                upcomingProspects: upcomingCount || 0,
                recentCount: recentCount || 0,
                managedCount: managedCount || 0
            });
            // Process Analytics (Always use aggregation result)
            const { data: analyticsResult, error: analyticsError } = analyticsResponse;
            // --- USER PROFILES: Fetch all profiles needed for analytics and tiles ---
            // Collect all agent IDs that appear in today's analytics
            const analyticsAgentIds = (analyticsResult?.caller_performance || []).map((p)=>p.user_id).filter(Boolean);
            const allRequiredProfileIds = [
                ...new Set([
                    userId,
                    ...effectiveTeamMembers,
                    ...analyticsAgentIds
                ])
            ].filter(Boolean);
            let userProfiles = [];
            if (allRequiredProfileIds.length > 0) {
                const { data: profiles } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from('user_profiles').select('id, user_id, user_name, employee_id').or(`user_id.in.(${allRequiredProfileIds.join(',')}),id.in.(${allRequiredProfileIds.join(',')})`);
                userProfiles = profiles || [];
            }
            const findUser = (targetId)=>userProfiles.find((p)=>p.user_id === targetId || p.id === targetId);
            if (!analyticsError && analyticsResult) {
                // Enrich caller_performance with names from userProfiles
                const enrichedCallerPerformance = (analyticsResult.caller_performance || []).map((perf)=>{
                    const profile = findUser(perf.user_id);
                    return {
                        ...perf,
                        caller: profile?.user_name || 'Unknown Agent',
                        user_name: profile?.user_name || 'Unknown Agent',
                        employee_id: profile?.employee_id || 'N/A'
                    };
                });
                setAnalytics({
                    hourly_calls: analyticsResult.hourly_calls || [],
                    agent_performance: analyticsResult.agent_performance || [],
                    disposition_stats: analyticsResult.disposition_stats || [],
                    hourly_detailed: analyticsResult.hourly_detailed || [],
                    caller_performance: enrichedCallerPerformance
                });
                // Update Campaign-wide Stats (Talktime & Dials) from the new data source
                const perfData = analyticsResult.caller_performance || [];
                const totalDials = perfData.reduce((sum, row)=>sum + (Number(row.total_calls) || 0), 0);
                const totalDuration = perfData.reduce((sum, row)=>sum + (Number(row.total_duration) || 0), 0);
                const hours = Math.floor(totalDuration / 3600);
                const minutes = Math.floor(totalDuration % 3600 / 60);
                setCampaignStats({
                    talkTime: `${hours}h ${minutes}m`,
                    totalDials: totalDials
                });
            } else if (analyticsError) {
                console.error("Analytics fetch error:", analyticsError);
            }
            // 3. Fetch Tile Data (Recent, Overdue, Upcoming, Managed) in Parallel
            // Prepare Tile Queries (Modified to avoid Relationship error on call_logs -> customers)
            let qRecentLogs = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from('call_logs').select(`id, disposition, sub_disposition, created_at, agent_id, customer_id`).eq('campaign_id', id).gte('created_at', twentyFourHoursAgo).order('created_at', {
                ascending: false
            }).limit(3);
            if (isLevel1User && userId) qRecentLogs = qRecentLogs.eq('agent_id', userId);
            if (isLevel2User) qRecentLogs = effectiveTeamMembers.length > 0 ? qRecentLogs.in('agent_id', effectiveTeamMembers) : qRecentLogs.eq('agent_id', '00000000-0000-0000-0000-000000000000');
            let qOverdueLeads = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from('customers').select('id, customer_name, disposition, sub_disposition, expiry_date, assigned_to, managed_by').eq('campaign_id', id).eq('status', 'followup').lt('expiry_date', now).order('expiry_date', {
                ascending: true
            }).limit(3);
            if (isLevel1User && userId) qOverdueLeads = qOverdueLeads.eq('assigned_to', userId);
            if (isLevel2User) qOverdueLeads = effectiveTeamMembers.length > 0 ? qOverdueLeads.in('assigned_to', effectiveTeamMembers) : qOverdueLeads.eq('assigned_to', '00000000-0000-0000-0000-000000000000');
            let qUpcomingLeads = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from('customers').select('id, customer_name, disposition, sub_disposition, expiry_date, assigned_to, managed_by').eq('campaign_id', id).eq('status', 'followup').gte('expiry_date', now).order('expiry_date', {
                ascending: true
            }).limit(3);
            if (isLevel1User && userId) qUpcomingLeads = qUpcomingLeads.eq('assigned_to', userId);
            if (isLevel2User) qUpcomingLeads = effectiveTeamMembers.length > 0 ? qUpcomingLeads.in('assigned_to', effectiveTeamMembers) : qUpcomingLeads.eq('assigned_to', '00000000-0000-0000-0000-000000000000');
            let qManagedLeads = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from('customers').select('id, customer_name, managed_by, assigned_to').eq('campaign_id', id).not('managed_by', 'is', null).order('created_at', {
                ascending: false
            }).limit(3);
            if (isLevel1User && userId) qManagedLeads = qManagedLeads.eq('assigned_to', userId);
            if (isLevel2User) qManagedLeads = effectiveTeamMembers.length > 0 ? qManagedLeads.in('assigned_to', effectiveTeamMembers) : qManagedLeads.eq('assigned_to', '00000000-0000-0000-0000-000000000000');
            const [recentRes, overdueRes, upcomingRes, managedRes] = await Promise.all([
                qRecentLogs,
                qOverdueLeads,
                qUpcomingLeads,
                qManagedLeads
            ]);
            const recentData = recentRes.data || [];
            const overdueData = overdueRes.data || [];
            const upcomingData = upcomingRes.data || [];
            const managedData = managedRes.data || [];
            // 4. Manual Join for Recent Logs Customers (Fixing missing FK)
            const recentCustomerIds = [
                ...new Set(recentData.map((d)=>d.customer_id).filter(Boolean))
            ];
            let recentCustomerMap = {};
            if (recentCustomerIds.length > 0) {
                const { data: cData } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from('customers').select('id, customer_name, expiry_date').in('id', recentCustomerIds);
                if (cData) {
                    cData.forEach((c)=>{
                        recentCustomerMap[c.id] = c;
                    });
                }
            }
            // 4b. Collect additional User IDs that might have appeared in Tile data but not in team/agent lists
            const extraUserIds = [
                ...new Set([
                    ...recentData.map((d)=>d.agent_id),
                    ...overdueData.map((d)=>d.assigned_to),
                    ...overdueData.map((d)=>d.managed_by),
                    ...upcomingData.map((d)=>d.assigned_to),
                    ...upcomingData.map((d)=>d.managed_by),
                    ...managedData.map((d)=>d.managed_by),
                    ...managedData.map((d)=>d.assigned_to)
                ])
            ].filter((id)=>id && !userProfiles.some((p)=>p.user_id === id || p.id === id));
            if (extraUserIds.length > 0) {
                const { data: extraProfiles } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from('user_profiles').select('id, user_id, user_name, employee_id').or(`user_id.in.(${extraUserIds.join(',')}),id.in.(${extraUserIds.join(',')})`);
                if (extraProfiles) {
                    userProfiles = [
                        ...userProfiles,
                        ...extraProfiles
                    ];
                }
            }
            // Enrich Recent Calls
            setRecentCalls(recentData.map((log)=>{
                const caller = findUser(log.agent_id);
                const customer = recentCustomerMap[log.customer_id];
                return {
                    ...log,
                    caller_name: caller?.user_name || 'System',
                    caller_emp_id: caller?.employee_id || 'N/A',
                    customers: customer ? {
                        customer_name: customer.customer_name,
                        expiry_date: customer.expiry_date
                    } : null
                };
            }));
            // Enrich Overdue
            setOverdueLeads(overdueData.map((lead)=>{
                const agent = findUser(lead.assigned_to);
                return {
                    ...lead,
                    agent_name: agent?.user_name || 'Unassigned',
                    agent_emp_id: agent?.employee_id || '—'
                };
            }));
            // Enrich Upcoming
            setUpcomingLeads(upcomingData.map((lead)=>{
                const agent = findUser(lead.assigned_to);
                return {
                    ...lead,
                    agent_name: agent?.user_name || 'Unassigned',
                    agent_emp_id: agent?.employee_id || '—'
                };
            }));
            // Enrich Managed Leads
            setManagedLeads(managedData.map((lead)=>{
                const manager = findUser(lead.managed_by);
                const agent = findUser(lead.assigned_to);
                return {
                    ...lead,
                    manager_name: manager?.user_name || 'Unknown',
                    manager_emp_id: manager?.employee_id || 'N/A',
                    agent_name: agent?.user_name || 'Unassigned',
                    agent_emp_id: agent?.employee_id || '—'
                };
            }));
            // 2. Fetch Leads - Pass effective members directly to avoid waiting for state update
            fetchLeads(undefined, effectiveTeamMembers);
        } catch (err) {
            console.error("Error fetching campaign details:", err);
            setError(err.message || "Failed to load campaign details");
        } finally{
            setLoading(false);
        }
    };
    const fetchLeads = async (pageOverride, teamIdsOverride)=>{
        if (!id) return;
        try {
            setLoadingLeads(true);
            // Use the override if provided (e.g. when search changes), otherwise use state
            const targetPage = pageOverride || currentPage;
            // Build base query for count
            let countQuery = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from('customers').select('*', {
                count: 'exact',
                head: true
            }).eq('campaign_id', id);
            if (isLevel1User && user?.uid) {
                countQuery = countQuery.eq('assigned_to', user.uid);
            } else if (isLevel2User) {
                const activeTeamIds = teamIdsOverride || teamMemberIds;
                countQuery = activeTeamIds.length > 0 ? countQuery.in('assigned_to', activeTeamIds) : countQuery.eq('assigned_to', '00000000-0000-0000-0000-000000000000');
            }
            if (searchQuery) {
                let orConditions = `customer_name.ilike.%${searchQuery}%,phone_no.ilike.%${searchQuery}%`;
                // If search looks like a phone number
                if (searchQuery.replace(/\D/g, '').length > 0) {
                    const hash = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$phoneUtils$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["computePhoneHash"])(searchQuery);
                    if (hash) {
                        orConditions += `,phone_search_hash.eq.${hash}`;
                    }
                }
                countQuery = countQuery.or(orConditions);
            }
            if (selectedUserFilter && selectedUserFilter !== 'ALL') {
                countQuery = countQuery.eq('assigned_to', selectedUserFilter);
            }
            if (selectedDispositionFilter) {
                if (selectedDispositionFilter === 'Fresh') {
                    countQuery = countQuery.is('disposition', null);
                } else {
                    countQuery = countQuery.eq('disposition', selectedDispositionFilter);
                }
            }
            const { count: totalCount } = await countQuery;
            setTotalLeadsCount(totalCount || 0);
            const from = (targetPage - 1) * leadsPerPage;
            const to = from + leadsPerPage - 1;
            // Build base query for data
            let dataQuery = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from('customers').select('*').eq('campaign_id', id);
            if (isLevel1User && user?.uid) {
                dataQuery = dataQuery.eq('assigned_to', user.uid);
            } else if (isLevel2User) {
                const activeTeamIds = teamIdsOverride || teamMemberIds;
                dataQuery = activeTeamIds.length > 0 ? dataQuery.in('assigned_to', activeTeamIds) : dataQuery.eq('assigned_to', '00000000-0000-0000-0000-000000000000');
            }
            if (searchQuery) {
                let orConditions = `customer_name.ilike.%${searchQuery}%,phone_no.ilike.%${searchQuery}%`;
                // If search looks like a phone number
                if (searchQuery.replace(/\D/g, '').length > 0) {
                    const hash = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$phoneUtils$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["computePhoneHash"])(searchQuery);
                    if (hash) {
                        orConditions += `,phone_search_hash.eq.${hash}`;
                    }
                }
                dataQuery = dataQuery.or(orConditions);
            }
            if (selectedUserFilter && selectedUserFilter !== 'ALL') {
                dataQuery = dataQuery.eq('assigned_to', selectedUserFilter);
            }
            if (selectedDispositionFilter) {
                if (selectedDispositionFilter === 'Fresh') {
                    dataQuery = dataQuery.is('disposition', null);
                } else {
                    dataQuery = dataQuery.eq('disposition', selectedDispositionFilter);
                }
            }
            const { data, error } = await dataQuery.order('expiry_date', {
                ascending: true
            }).range(from, to);
            if (error) throw error;
            // Fetch assigned user names and last updated by info
            const allUserIds = [
                ...new Set((data || []).flatMap((c)=>[
                        c.assigned_to,
                        c.last_updated_by,
                        c.managed_by
                    ]).filter((userId)=>userId))
            ];
            let userMap = {};
            if (allUserIds.length > 0) {
                const { data: userData } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from("user_profiles").select("user_id, user_name, employee_id").in("user_id", allUserIds);
                if (userData) {
                    userData.forEach((u)=>{
                        const info = {
                            name: u.user_name || "Unknown",
                            empId: u.employee_id || "N/A"
                        };
                        userMap[u.user_id] = info;
                    });
                }
            }
            // Re-fetch with 'id' to be absolutely sure we can map both
            if (allUserIds.length > 0) {
                const { data: userDataById } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from("user_profiles").select("id, user_name, employee_id").in("id", allUserIds);
                if (userDataById) {
                    userDataById.forEach((u)=>{
                        userMap[u.id] = {
                            name: u.user_name || "Unknown",
                            empId: u.employee_id || "N/A"
                        };
                    });
                }
            }
            const enrichedLeads = (data || []).map((lead)=>({
                    ...lead,
                    // assigned_to mapping
                    assigned_user_name: lead.assigned_to ? userMap[lead.assigned_to]?.name : "Unassigned",
                    assigned_user_info: lead.assigned_to ? userMap[lead.assigned_to] : null,
                    // managed_by mapping
                    managed_by_name: lead.managed_by ? userMap[lead.managed_by]?.name : "Self",
                    managed_by_id: lead.managed_by ? userMap[lead.managed_by]?.empId : null,
                    // last_updated_by mapping
                    last_updated_by_info: lead.last_updated_by ? userMap[lead.last_updated_by] : null
                }));
            setLeads(enrichedLeads);
        } catch (err) {
            console.error("Error fetching leads:", err);
            setLeads([]);
        } finally{
            setLoadingLeads(false);
        }
    };
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        if (!router.isReady || !id || authLoading || !userId) return;
        fetchCampaignData();
    }, [
        router.isReady,
        id,
        userId,
        isLevel1User,
        authLoading,
        selectedDate
    ]);
    // Effect for Page Change (Standard pagination)
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        if (id) fetchLeads();
    }, [
        id,
        currentPage
    ]);
    // Handle pagination change
    const onPageChange = (newPage)=>{
        setCurrentPage(newPage);
        fetchLeads(newPage);
    };
    // Handle Search
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        const timer = setTimeout(()=>{
            setCurrentPage(1);
            fetchLeads(1);
        }, 500);
        return ()=>clearTimeout(timer);
    }, [
        searchQuery
    ]);
    // Handle Filter Changes
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        setCurrentPage(1);
        fetchLeads(1);
    }, [
        selectedUserFilter,
        selectedDispositionFilter
    ]);
    const toggleSelect = (id)=>{
        setSelectedLeads((prev)=>prev.includes(id) ? prev.filter((l)=>l !== id) : [
                ...prev,
                id
            ]);
    };
    const toggleSelectAll = ()=>{
        const pageIds = leads.map((l)=>l.id);
        const allSelected = pageIds.every((id)=>selectedLeads.includes(id));
        if (allSelected) {
            setSelectedLeads((prev)=>prev.filter((id)=>!pageIds.includes(id)));
        } else {
            setSelectedLeads((prev)=>[
                    ...new Set([
                        ...prev,
                        ...pageIds
                    ])
                ]);
        }
    };
    const [calling, setCalling] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const handleStartCalling = async ()=>{
        if (!id || !user) return;
        try {
            setCalling(true);
            // 0. Check for active/pending sessions across ALL campaigns first
            const { data: allSessions } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from('call_sessions').select('*').eq('user_id', user.uid).in('status', [
                'active',
                'disposition_pending'
            ]);
            if (allSessions && allSessions.length > 0) {
                const activeSession = allSessions[0];
                console.log('[Session] Found active session in cross-campaign check, redirecting...', activeSession);
                router.push(`/campaign/${activeSession.campaign_id}/${activeSession.customer_id}`);
                return;
            }
            // 1. Check if user already has a session for THIS campaign
            const { data: campaignSession } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from('call_sessions').select('*').eq('user_id', user.uid).eq('campaign_id', id).maybeSingle();
            if (campaignSession && campaignSession.status === 'assigned') {
                console.log('[Session] Found existing assigned session for this campaign, resuming...', campaignSession);
                router.push(`/campaign/${campaignSession.campaign_id}/${campaignSession.customer_id}`);
                return;
            }
            // 1. Assign Next Lead via RPC
            const { data: leadId, error: rpcError } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].rpc('assign_next_lead', {
                p_campaign_id: id,
                p_user_id: user.uid
            });
            if (rpcError) throw rpcError;
            if (!leadId) {
                alert("No compatible leads found for assignment.");
                return;
            }
            // 2. Create/Update Call Session
            await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from('call_sessions').upsert({
                user_id: user.uid,
                campaign_id: id,
                customer_id: leadId,
                organization_id: campaign?.organization_id,
                status: 'assigned',
                updated_at: new Date().toISOString()
            });
            // 3. Redirect to Lead Page
            if (id && leadId) {
                router.push(`/campaign/${id}/${leadId}`);
            } else {
                throw new Error("Missing campaign ID or lead ID for redirection");
            }
        } catch (err) {
            console.error("Error starting call assignment:", err);
            alert(err.message || "Failed to assign lead");
        } finally{
            setCalling(false);
        }
    };
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        if (id) {
            fetchCampaignData();
        }
    }, [
        id
    ]);
    const handleLogoutClick = async ()=>{
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$authService$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["handleLogout"])(router);
    };
    const SkeletonTile = ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
            className: "bg-white rounded-2xl p-6 border border-gray-100 min-h-[320px] animate-pulse",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: "flex items-center justify-between mb-6",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "w-10 h-10 rounded-xl bg-gray-100"
                                }, void 0, false, {
                                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                                    lineNumber: 843,
                                    columnNumber: 21
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "h-4 w-24 bg-gray-100 rounded"
                                }, void 0, false, {
                                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                                    lineNumber: 844,
                                    columnNumber: 21
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/pages/portal/campaign/[id].tsx",
                            lineNumber: 842,
                            columnNumber: 17
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "w-7 h-7 rounded-full bg-gray-100"
                        }, void 0, false, {
                            fileName: "[project]/pages/portal/campaign/[id].tsx",
                            lineNumber: 846,
                            columnNumber: 17
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                    lineNumber: 841,
                    columnNumber: 13
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: "space-y-4",
                    children: [
                        1,
                        2,
                        3
                    ].map((i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "h-16 bg-gray-50 rounded-2xl"
                        }, i, false, {
                            fileName: "[project]/pages/portal/campaign/[id].tsx",
                            lineNumber: 850,
                            columnNumber: 21
                        }, this))
                }, void 0, false, {
                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                    lineNumber: 848,
                    columnNumber: 13
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/pages/portal/campaign/[id].tsx",
            lineNumber: 840,
            columnNumber: 9
        }, this);
    const SkeletonTable = ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
            className: "bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: "p-6 border-b border-gray-50 flex justify-between",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "h-4 w-48 bg-gray-100 rounded"
                    }, void 0, false, {
                        fileName: "[project]/pages/portal/campaign/[id].tsx",
                        lineNumber: 859,
                        columnNumber: 17
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                    lineNumber: 858,
                    columnNumber: 13
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: "p-6 space-y-4",
                    children: [
                        1,
                        2,
                        3,
                        4,
                        5
                    ].map((i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "h-10 bg-gray-50 rounded"
                        }, i, false, {
                            fileName: "[project]/pages/portal/campaign/[id].tsx",
                            lineNumber: 863,
                            columnNumber: 21
                        }, this))
                }, void 0, false, {
                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                    lineNumber: 861,
                    columnNumber: 13
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/pages/portal/campaign/[id].tsx",
            lineNumber: 857,
            columnNumber: 9
        }, this);
    if ((loading || authLoading) && !campaign) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
            className: "max-w-[1600px] mx-auto space-y-8 p-4 md:p-8",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: "h-32 bg-white rounded-3xl border border-gray-100 animate-pulse"
                }, void 0, false, {
                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                    lineNumber: 873,
                    columnNumber: 17
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: "grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4",
                    children: [
                        1,
                        2,
                        3,
                        4,
                        5,
                        6,
                        7
                    ].map((i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "h-24 bg-white rounded-2xl border border-gray-100 animate-pulse"
                        }, i, false, {
                            fileName: "[project]/pages/portal/campaign/[id].tsx",
                            lineNumber: 878,
                            columnNumber: 25
                        }, this))
                }, void 0, false, {
                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                    lineNumber: 876,
                    columnNumber: 17
                }, this),
                userMounted && !isLevel1User && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: "grid grid-cols-1 lg:grid-cols-3 gap-6",
                    children: [
                        1,
                        2,
                        3
                    ].map((i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "h-[300px] bg-white rounded-2xl border border-gray-100 animate-pulse"
                        }, i, false, {
                            fileName: "[project]/pages/portal/campaign/[id].tsx",
                            lineNumber: 886,
                            columnNumber: 29
                        }, this))
                }, void 0, false, {
                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                    lineNumber: 884,
                    columnNumber: 21
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(SkeletonTable, {}, void 0, false, {
                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                    lineNumber: 892,
                    columnNumber: 17
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: "grid grid-cols-1 sm:grid-cols-2 gap-6",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(SkeletonTile, {}, void 0, false, {
                            fileName: "[project]/pages/portal/campaign/[id].tsx",
                            lineNumber: 896,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(SkeletonTile, {}, void 0, false, {
                            fileName: "[project]/pages/portal/campaign/[id].tsx",
                            lineNumber: 897,
                            columnNumber: 21
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                    lineNumber: 895,
                    columnNumber: 17
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/pages/portal/campaign/[id].tsx",
            lineNumber: 871,
            columnNumber: 13
        }, this);
    }
    if (error) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
            className: "flex min-h-screen items-center justify-center bg-[#f6f5f7]",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "text-center p-8 bg-white rounded-2xl shadow-sm border border-red-100 max-w-md",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                        className: "fi flex fi-rr-cross-circle text-4xl text-red-500 mb-4 justify-center"
                    }, void 0, false, {
                        fileName: "[project]/pages/portal/campaign/[id].tsx",
                        lineNumber: 907,
                        columnNumber: 21
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                        className: "text-xl font-bold text-gray-800 mb-2",
                        children: "Error Occurred"
                    }, void 0, false, {
                        fileName: "[project]/pages/portal/campaign/[id].tsx",
                        lineNumber: 908,
                        columnNumber: 21
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                        className: "text-gray-500 mb-6",
                        children: error
                    }, void 0, false, {
                        fileName: "[project]/pages/portal/campaign/[id].tsx",
                        lineNumber: 909,
                        columnNumber: 21
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                        onClick: ()=>router.push('/campaign'),
                        className: "px-6 py-2 bg-[#4b33e8] text-white rounded-xl font-semibold shadow-md hover:opacity-90 transition-all",
                        children: "Back to Campaigns"
                    }, void 0, false, {
                        fileName: "[project]/pages/portal/campaign/[id].tsx",
                        lineNumber: 910,
                        columnNumber: 21
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/pages/portal/campaign/[id].tsx",
                lineNumber: 906,
                columnNumber: 17
            }, this)
        }, void 0, false, {
            fileName: "[project]/pages/portal/campaign/[id].tsx",
            lineNumber: 905,
            columnNumber: 13
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["Fragment"], {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
            className: "max-w-[1600px] mx-auto space-y-8 p-4 md:p-8",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: "flex items-center gap-2 text-xs text-gray-400 mb-8 px-1",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                            className: "cursor-pointer hover:text-[#4b33e8] transition-colors",
                            onClick: ()=>router.push('/campaign'),
                            children: "Campaigns"
                        }, void 0, false, {
                            fileName: "[project]/pages/portal/campaign/[id].tsx",
                            lineNumber: 926,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                            className: "fi flex fi-rr-angle-small-right text-[10px]"
                        }, void 0, false, {
                            fileName: "[project]/pages/portal/campaign/[id].tsx",
                            lineNumber: 927,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                            className: "text-gray-600 font-bold",
                            children: campaign?.name
                        }, void 0, false, {
                            fileName: "[project]/pages/portal/campaign/[id].tsx",
                            lineNumber: 928,
                            columnNumber: 21
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                    lineNumber: 925,
                    columnNumber: 17
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$campaign$2f$CampaignHeader$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                    id: id,
                    campaign: campaign,
                    campaignStats: campaignStats,
                    calling: calling,
                    onStartCalling: handleStartCalling
                }, void 0, false, {
                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                    lineNumber: 932,
                    columnNumber: 17
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$campaign$2f$CampaignStatsGrid$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                    stats: stats
                }, void 0, false, {
                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                    lineNumber: 941,
                    columnNumber: 17
                }, this),
                (isLevel2User || !isLevel1User) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["Fragment"], {
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8",
                        children: [
                            (campaign?.ishourlyactivitywidgevisible || isLevel2User) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: `bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-[300px] relative transition-all duration-300 ${expandedChart === 'hourly' ? 'lg:col-span-3' : 'col-span-1 lg:col-span-1'}`,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                                        className: "text-sm font-bold text-gray-800 mb-4 flex items-center gap-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                className: "fi fi-rr-chart-histogram text-[#4b33e8]"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                lineNumber: 953,
                                                columnNumber: 41
                                            }, this),
                                            "Hourly Activity (Today) ",
                                            isLevel2User && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                className: "text-[10px] bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full ml-2",
                                                children: "Team Mode"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                lineNumber: 954,
                                                columnNumber: 82
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/portal/campaign/[id].tsx",
                                        lineNumber: 952,
                                        columnNumber: 37
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "flex-1 w-full min-h-0",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$component$2f$ResponsiveContainer$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["ResponsiveContainer"], {
                                            width: "100%",
                                            height: "100%",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$chart$2f$AreaChart$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["AreaChart"], {
                                                data: analytics.hourly_calls,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("defs", {
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("linearGradient", {
                                                            id: "colorCount",
                                                            x1: "0",
                                                            y1: "0",
                                                            x2: "0",
                                                            y2: "1",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("stop", {
                                                                    offset: "5%",
                                                                    stopColor: "#4b33e8",
                                                                    stopOpacity: 0.3
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                                    lineNumber: 961,
                                                                    columnNumber: 62
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("stop", {
                                                                    offset: "95%",
                                                                    stopColor: "#4b33e8",
                                                                    stopOpacity: 0
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                                    lineNumber: 962,
                                                                    columnNumber: 62
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                            lineNumber: 960,
                                                            columnNumber: 53
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                        lineNumber: 959,
                                                        columnNumber: 49
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$CartesianGrid$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["CartesianGrid"], {
                                                        strokeDasharray: "3 3",
                                                        vertical: false,
                                                        stroke: "#f0f0f0"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                        lineNumber: 965,
                                                        columnNumber: 54
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$XAxis$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["XAxis"], {
                                                        dataKey: "hour",
                                                        tick: {
                                                            fontSize: 10,
                                                            fill: '#9ca3af'
                                                        },
                                                        axisLine: false,
                                                        tickLine: false,
                                                        tickFormatter: (tick)=>`${tick}:00`
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                        lineNumber: 966,
                                                        columnNumber: 54
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$YAxis$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["YAxis"], {
                                                        hide: true
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                        lineNumber: 973,
                                                        columnNumber: 54
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$component$2f$Tooltip$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["Tooltip"], {
                                                        contentStyle: {
                                                            borderRadius: '12px',
                                                            border: 'none',
                                                            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                                                        },
                                                        labelStyle: {
                                                            color: '#6b7280',
                                                            fontSize: '10px',
                                                            fontWeight: 'bold'
                                                        }
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                        lineNumber: 974,
                                                        columnNumber: 54
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$Area$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["Area"], {
                                                        type: "monotone",
                                                        dataKey: "count",
                                                        stroke: "#4b33e8",
                                                        strokeWidth: 3,
                                                        fillOpacity: 1,
                                                        fill: "url(#colorCount)"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                        lineNumber: 978,
                                                        columnNumber: 54
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                lineNumber: 958,
                                                columnNumber: 45
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/pages/portal/campaign/[id].tsx",
                                            lineNumber: 957,
                                            columnNumber: 41
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/pages/portal/campaign/[id].tsx",
                                        lineNumber: 956,
                                        columnNumber: 37
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                        onClick: ()=>setExpandedChart(expandedChart === 'hourly' ? null : 'hourly'),
                                        className: "absolute bottom-4 right-4 text-gray-400 hover:text-[#4b33e8] transition-colors p-2 hover:bg-gray-50 rounded-lg",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                            className: `fi ${expandedChart === 'hourly' ? 'fi-rr-compress' : 'fi-rr-expand'} text-xs`
                                        }, void 0, false, {
                                            fileName: "[project]/pages/portal/campaign/[id].tsx",
                                            lineNumber: 993,
                                            columnNumber: 46
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/pages/portal/campaign/[id].tsx",
                                        lineNumber: 989,
                                        columnNumber: 42
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/portal/campaign/[id].tsx",
                                lineNumber: 949,
                                columnNumber: 33
                            }, this),
                            (campaign?.istopagentvwidgetvisible || isLevel2User) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: `bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-[300px] relative transition-all duration-300 ${expandedChart === 'users' ? 'lg:col-span-3' : 'col-span-1 lg:col-span-1'}`,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                                        className: "text-sm font-bold text-gray-800 mb-4 flex items-center gap-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                className: "fi fi-rr-trophy text-yellow-500"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                lineNumber: 1004,
                                                columnNumber: 46
                                            }, this),
                                            "Top Agents (Today) ",
                                            isLevel2User && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                className: "text-[10px] bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full ml-2",
                                                children: "Team Mode"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                lineNumber: 1005,
                                                columnNumber: 82
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/portal/campaign/[id].tsx",
                                        lineNumber: 1003,
                                        columnNumber: 42
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "flex-1 w-full min-h-0",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$component$2f$ResponsiveContainer$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["ResponsiveContainer"], {
                                            width: "100%",
                                            height: "100%",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$chart$2f$BarChart$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["BarChart"], {
                                                data: analytics.agent_performance.filter((row)=>campaign?.users?.some((u)=>u.employee_id && u.employee_id === row.employee_id || u.name && u.name.toLowerCase() === row.name.toLowerCase())).slice(0, expandedChart === 'users' ? 20 : 5),
                                                layout: "vertical",
                                                barSize: 12,
                                                margin: {
                                                    top: 5,
                                                    right: 30,
                                                    left: 40,
                                                    bottom: 5
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$CartesianGrid$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["CartesianGrid"], {
                                                        strokeDasharray: "3 3",
                                                        horizontal: true,
                                                        vertical: false,
                                                        stroke: "#f0f0f0"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                        lineNumber: 1022,
                                                        columnNumber: 54
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$XAxis$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["XAxis"], {
                                                        type: "number",
                                                        hide: true
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                        lineNumber: 1023,
                                                        columnNumber: 54
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$YAxis$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["YAxis"], {
                                                        dataKey: "name",
                                                        type: "category",
                                                        tick: {
                                                            fontSize: 10,
                                                            fill: '#4b5563',
                                                            fontWeight: 600
                                                        },
                                                        width: 60,
                                                        axisLine: false,
                                                        tickLine: false,
                                                        tickFormatter: (val)=>val.split(' ')[0]
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                        lineNumber: 1024,
                                                        columnNumber: 54
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$component$2f$Tooltip$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["Tooltip"], {
                                                        cursor: {
                                                            fill: 'transparent'
                                                        },
                                                        contentStyle: {
                                                            borderRadius: '8px'
                                                        }
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                        lineNumber: 1033,
                                                        columnNumber: 54
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$Bar$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["Bar"], {
                                                        dataKey: "calls",
                                                        fill: "#00C49F",
                                                        radius: [
                                                            0,
                                                            4,
                                                            4,
                                                            0
                                                        ],
                                                        background: {
                                                            fill: '#f9fafb',
                                                            radius: 4
                                                        }
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                        lineNumber: 1034,
                                                        columnNumber: 54
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                lineNumber: 1009,
                                                columnNumber: 50
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/pages/portal/campaign/[id].tsx",
                                            lineNumber: 1008,
                                            columnNumber: 46
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/pages/portal/campaign/[id].tsx",
                                        lineNumber: 1007,
                                        columnNumber: 42
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                        onClick: ()=>setExpandedChart(expandedChart === 'users' ? null : 'users'),
                                        className: "absolute bottom-4 right-4 text-gray-400 hover:text-[#4b33e8] transition-colors p-2 hover:bg-gray-50 rounded-lg",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                            className: `fi ${expandedChart === 'users' ? 'fi-rr-compress' : 'fi-rr-expand'} text-xs`
                                        }, void 0, false, {
                                            fileName: "[project]/pages/portal/campaign/[id].tsx",
                                            lineNumber: 1042,
                                            columnNumber: 46
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/pages/portal/campaign/[id].tsx",
                                        lineNumber: 1038,
                                        columnNumber: 42
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/portal/campaign/[id].tsx",
                                lineNumber: 1000,
                                columnNumber: 38
                            }, this),
                            (campaign?.iscalloutcomeswidgetvisible || isLevel2User) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "bg-white p-6 rounded-2xl shadow-sm border border-gray-100 col-span-1 lg:col-span-1 flex flex-col h-[300px]",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                                        className: "text-sm font-bold text-gray-800 mb-4 flex items-center gap-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                className: "fi fi-rr-pie-chart text-pink-500"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                lineNumber: 1051,
                                                columnNumber: 46
                                            }, this),
                                            "Call Outcomes ",
                                            isLevel2User && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                className: "text-[10px] bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full ml-2",
                                                children: "Team Mode"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                lineNumber: 1052,
                                                columnNumber: 77
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/portal/campaign/[id].tsx",
                                        lineNumber: 1050,
                                        columnNumber: 42
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "flex-1 w-full min-h-0 relative",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$component$2f$ResponsiveContainer$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["ResponsiveContainer"], {
                                                width: "100%",
                                                height: "100%",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$chart$2f$PieChart$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["PieChart"], {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$polar$2f$Pie$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["Pie"], {
                                                            data: analytics.disposition_stats,
                                                            cx: "50%",
                                                            cy: "50%",
                                                            innerRadius: 60,
                                                            outerRadius: 80,
                                                            paddingAngle: 5,
                                                            dataKey: "value",
                                                            children: analytics.disposition_stats.map((entry, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$component$2f$Cell$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["Cell"], {
                                                                    fill: COLORS[index % COLORS.length],
                                                                    strokeWidth: 0
                                                                }, `cell-${index}`, false, {
                                                                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                                    lineNumber: 1067,
                                                                    columnNumber: 62
                                                                }, this))
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                            lineNumber: 1057,
                                                            columnNumber: 54
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$component$2f$Tooltip$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["Tooltip"], {
                                                            contentStyle: {
                                                                borderRadius: '8px'
                                                            }
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                            lineNumber: 1070,
                                                            columnNumber: 54
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$component$2f$Legend$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["Legend"], {
                                                            verticalAlign: "middle",
                                                            align: "right",
                                                            layout: "vertical",
                                                            iconType: "circle",
                                                            iconSize: 8,
                                                            wrapperStyle: {
                                                                fontSize: '10px'
                                                            }
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                            lineNumber: 1071,
                                                            columnNumber: 54
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                    lineNumber: 1056,
                                                    columnNumber: 50
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                lineNumber: 1055,
                                                columnNumber: 46
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "absolute inset-0 flex items-center justify-center pointer-events-none pr-14",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "text-center",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                            className: "text-xs text-gray-400 font-bold block",
                                                            children: "TOTAL"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                            lineNumber: 1077,
                                                            columnNumber: 54
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                            className: "text-xl font-black text-gray-800",
                                                            children: analytics.disposition_stats.reduce((acc, curr)=>acc + curr.value, 0)
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                            lineNumber: 1078,
                                                            columnNumber: 54
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                    lineNumber: 1076,
                                                    columnNumber: 50
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                lineNumber: 1075,
                                                columnNumber: 46
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/portal/campaign/[id].tsx",
                                        lineNumber: 1054,
                                        columnNumber: 42
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/portal/campaign/[id].tsx",
                                lineNumber: 1049,
                                columnNumber: 38
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/pages/portal/campaign/[id].tsx",
                        lineNumber: 946,
                        columnNumber: 25
                    }, this)
                }, void 0, false),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: "space-y-8 mb-8",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "p-6 border-b border-gray-50 flex items-center justify-between",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                                            className: "text-sm font-bold text-gray-800 flex items-center gap-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                    className: "fi fi-rr-time-check text-[#4b33e8]"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                    lineNumber: 1096,
                                                    columnNumber: 45
                                                }, this),
                                                "Hourly Performance Breakdown"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/portal/campaign/[id].tsx",
                                            lineNumber: 1095,
                                            columnNumber: 41
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "relative",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "group relative",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                        onClick: ()=>dateInputRef.current?.showPicker(),
                                                        className: "flex items-center gap-2 px-3 py-1.5 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold text-gray-700 hover:border-indigo-200 hover:bg-white hover:shadow-sm transition-all focus:ring-2 focus:ring-indigo-100 outline-none cursor-pointer",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                className: "fi fi-rr-calendar text-indigo-500 text-[10px]"
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                                lineNumber: 1105,
                                                                columnNumber: 53
                                                            }, this),
                                                            new Date(selectedDate).toLocaleDateString('en-IN', {
                                                                day: '2-digit',
                                                                month: 'short',
                                                                year: 'numeric'
                                                            })
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                        lineNumber: 1101,
                                                        columnNumber: 49
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                                        ref: dateInputRef,
                                                        type: "date",
                                                        value: selectedDate,
                                                        onChange: (e)=>setSelectedDate(e.target.value),
                                                        className: "absolute inset-0 opacity-0 pointer-events-none w-full"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                        lineNumber: 1108,
                                                        columnNumber: 49
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                lineNumber: 1100,
                                                columnNumber: 45
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/pages/portal/campaign/[id].tsx",
                                            lineNumber: 1099,
                                            columnNumber: 41
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                                    lineNumber: 1094,
                                    columnNumber: 33
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "overflow-x-auto",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("table", {
                                        className: "w-full text-left",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("thead", {
                                                className: "bg-[#f9fafb]",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("tr", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                            className: "px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider",
                                                            children: "Hour"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                            lineNumber: 1122,
                                                            columnNumber: 49
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                            className: "px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider",
                                                            children: "Total Calls"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                            lineNumber: 1123,
                                                            columnNumber: 49
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                            className: "px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider",
                                                            children: "Connected Calls"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                            lineNumber: 1124,
                                                            columnNumber: 49
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                            className: "px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider",
                                                            children: "Outgoing Calls"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                            lineNumber: 1125,
                                                            columnNumber: 49
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                            className: "px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider",
                                                            children: "Incoming Calls"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                            lineNumber: 1126,
                                                            columnNumber: 49
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                            className: "px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider",
                                                            children: "Missed Calls"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                            lineNumber: 1127,
                                                            columnNumber: 49
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                            className: "px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider",
                                                            children: "Talktime"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                            lineNumber: 1128,
                                                            columnNumber: 49
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                    lineNumber: 1121,
                                                    columnNumber: 45
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                lineNumber: 1120,
                                                columnNumber: 41
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("tbody", {
                                                className: "divide-y divide-gray-50",
                                                children: analytics.hourly_detailed.length > 0 ? analytics.hourly_detailed.map((row, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("tr", {
                                                        className: "hover:bg-gray-50/50 transition-colors",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                                className: "px-6 py-4 text-xs font-bold text-gray-700",
                                                                children: [
                                                                    "Time - ",
                                                                    row.hour % 12 === 0 ? 12 : row.hour % 12,
                                                                    " ",
                                                                    row.hour >= 12 ? 'pm' : 'am'
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                                lineNumber: 1135,
                                                                columnNumber: 61
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                                className: "px-6 py-4 text-xs font-medium text-gray-600",
                                                                children: row.total_calls
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                                lineNumber: 1138,
                                                                columnNumber: 61
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                                className: "px-6 py-4 text-xs font-medium text-green-600",
                                                                children: row.connected_calls
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                                lineNumber: 1139,
                                                                columnNumber: 61
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                                className: "px-6 py-4 text-xs font-medium text-gray-600",
                                                                children: row.outgoing_calls
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                                lineNumber: 1140,
                                                                columnNumber: 61
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                                className: "px-6 py-4 text-xs font-medium text-gray-600",
                                                                children: row.incoming_calls
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                                lineNumber: 1141,
                                                                columnNumber: 61
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                                className: "px-6 py-4 text-xs font-medium text-red-500",
                                                                children: row.missed_calls
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                                lineNumber: 1142,
                                                                columnNumber: 61
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                                className: "px-6 py-4 text-xs font-medium text-gray-600",
                                                                children: new Date(row.total_duration * 1000).toISOString().substr(11, 8)
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                                lineNumber: 1143,
                                                                columnNumber: 61
                                                            }, this)
                                                        ]
                                                    }, index, true, {
                                                        fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                        lineNumber: 1134,
                                                        columnNumber: 57
                                                    }, this)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("tr", {
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                        colSpan: 7,
                                                        className: "px-6 py-10 text-center text-xs text-gray-400 font-medium",
                                                        children: "No data available for today"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                        lineNumber: 1150,
                                                        columnNumber: 53
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                    lineNumber: 1149,
                                                    columnNumber: 49
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                lineNumber: 1131,
                                                columnNumber: 41
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/portal/campaign/[id].tsx",
                                        lineNumber: 1119,
                                        columnNumber: 37
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                                    lineNumber: 1118,
                                    columnNumber: 37
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/pages/portal/campaign/[id].tsx",
                            lineNumber: 1093,
                            columnNumber: 30
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm mb-8",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "p-6 border-b border-gray-50 flex items-center justify-between",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                                            className: "text-sm font-bold text-gray-800 flex items-center gap-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                    className: "fi fi-rr-headset text-[#4b33e8]"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                    lineNumber: 1164,
                                                    columnNumber: 45
                                                }, this),
                                                "Caller Performance Breakdown"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/portal/campaign/[id].tsx",
                                            lineNumber: 1163,
                                            columnNumber: 41
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "relative",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "group relative",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                        onClick: ()=>dateInputRef.current?.showPicker(),
                                                        className: "flex items-center gap-2 px-3 py-1.5 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold text-gray-700 hover:border-indigo-200 hover:bg-white hover:shadow-sm transition-all focus:ring-2 focus:ring-indigo-100 outline-none cursor-pointer",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                className: "fi fi-rr-calendar text-indigo-500 text-[10px]"
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                                lineNumber: 1173,
                                                                columnNumber: 53
                                                            }, this),
                                                            new Date(selectedDate).toLocaleDateString('en-IN', {
                                                                day: '2-digit',
                                                                month: 'short',
                                                                year: 'numeric'
                                                            })
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                        lineNumber: 1169,
                                                        columnNumber: 49
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                                        ref: dateInputRef,
                                                        type: "date",
                                                        value: selectedDate,
                                                        onChange: (e)=>setSelectedDate(e.target.value),
                                                        className: "absolute inset-0 opacity-0 pointer-events-none w-full"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                        lineNumber: 1176,
                                                        columnNumber: 49
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                lineNumber: 1168,
                                                columnNumber: 45
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/pages/portal/campaign/[id].tsx",
                                            lineNumber: 1167,
                                            columnNumber: 41
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                                    lineNumber: 1162,
                                    columnNumber: 33
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "overflow-x-auto",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("table", {
                                        className: "w-full text-left",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("thead", {
                                                className: "bg-[#f9fafb]",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("tr", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                            className: "px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider",
                                                            children: "Caller"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                            lineNumber: 1190,
                                                            columnNumber: 49
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                            className: "px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider",
                                                            children: "Total Calls"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                            lineNumber: 1191,
                                                            columnNumber: 49
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                            className: "px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider",
                                                            children: "Connected Calls"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                            lineNumber: 1192,
                                                            columnNumber: 49
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                            className: "px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider",
                                                            children: "Outgoing Calls"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                            lineNumber: 1193,
                                                            columnNumber: 49
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                            className: "px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider",
                                                            children: "Incoming Calls"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                            lineNumber: 1194,
                                                            columnNumber: 49
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                            className: "px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider",
                                                            children: "Missed Calls"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                            lineNumber: 1195,
                                                            columnNumber: 49
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                            className: "px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider",
                                                            children: "Talktime"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                            lineNumber: 1196,
                                                            columnNumber: 49
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                    lineNumber: 1189,
                                                    columnNumber: 45
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                lineNumber: 1188,
                                                columnNumber: 41
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("tbody", {
                                                className: "divide-y divide-gray-50",
                                                children: analytics.caller_performance.filter((row)=>campaign?.users?.some((u)=>u.employee_id && row.employee_id && u.employee_id === row.employee_id || u.name && row.caller && u.name.toLowerCase() === row.caller.toLowerCase() || u.id && row.user_id && u.id === row.user_id)).length > 0 ? analytics.caller_performance.filter((row)=>campaign?.users?.some((u)=>u.employee_id && row.employee_id && u.employee_id === row.employee_id || u.name && row.caller && u.name.toLowerCase() === row.caller.toLowerCase() || u.id && row.user_id && u.id === row.user_id)).map((row, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("tr", {
                                                        className: "hover:bg-gray-50/50 transition-colors",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                                className: "px-6 py-4 text-xs font-bold text-gray-700 capitalize",
                                                                children: row.caller || 'Unknown Agent'
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                                lineNumber: 1217,
                                                                columnNumber: 61
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                                className: "px-6 py-4 text-xs font-medium text-gray-600",
                                                                children: row.total_calls
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                                lineNumber: 1220,
                                                                columnNumber: 61
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                                className: "px-6 py-4 text-xs font-medium text-green-600",
                                                                children: row.connected_calls
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                                lineNumber: 1221,
                                                                columnNumber: 61
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                                className: "px-6 py-4 text-xs font-medium text-gray-600",
                                                                children: row.outgoing_calls
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                                lineNumber: 1222,
                                                                columnNumber: 61
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                                className: "px-6 py-4 text-xs font-medium text-gray-600",
                                                                children: row.incoming_calls
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                                lineNumber: 1223,
                                                                columnNumber: 61
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                                className: "px-6 py-4 text-xs font-medium text-red-500",
                                                                children: row.missed_calls
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                                lineNumber: 1224,
                                                                columnNumber: 61
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                                className: "px-6 py-4 text-xs font-medium text-gray-600",
                                                                children: new Date((row.total_duration || 0) * 1000).toISOString().substr(11, 8)
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                                lineNumber: 1225,
                                                                columnNumber: 61
                                                            }, this)
                                                        ]
                                                    }, index, true, {
                                                        fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                        lineNumber: 1216,
                                                        columnNumber: 57
                                                    }, this)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("tr", {
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                        colSpan: 7,
                                                        className: "px-6 py-10 text-center text-xs text-gray-400 font-medium",
                                                        children: "No data available for today"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                        lineNumber: 1232,
                                                        columnNumber: 53
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                    lineNumber: 1231,
                                                    columnNumber: 49
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                lineNumber: 1199,
                                                columnNumber: 41
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/portal/campaign/[id].tsx",
                                        lineNumber: 1187,
                                        columnNumber: 37
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                                    lineNumber: 1186,
                                    columnNumber: 33
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/pages/portal/campaign/[id].tsx",
                            lineNumber: 1161,
                            columnNumber: 29
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                    lineNumber: 1091,
                    columnNumber: 25
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: "space-y-6",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-1 sm:grid-cols-2 gap-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "bg-white rounded-2xl p-6  border border-gray-100 flex flex-col min-h-[320px] relative overflow-hidden group hover:shadow-lg transition-all",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "absolute inset-0",
                                        style: {
                                            background: "#ffffff"
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/pages/portal/campaign/[id].tsx",
                                        lineNumber: 1251,
                                        columnNumber: 38
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "flex items-center justify-between mb-6 relative z-10",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-3",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: "w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-500 group-hover:bg-indigo-50 group-hover:text-[#4b33e8] transition-colors",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                            className: "fi flex fi-rr-time-past text-sm"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                            lineNumber: 1255,
                                                            columnNumber: 50
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                        lineNumber: 1254,
                                                        columnNumber: 46
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                                                                className: "font-bold text-gray-800 text-sm italic",
                                                                style: {
                                                                    color: "#263238",
                                                                    fontFamily: "'Poppins', sans-serif"
                                                                },
                                                                children: "Recent Calls"
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                                lineNumber: 1258,
                                                                columnNumber: 50
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                className: "text-[9px] text-gray-400 font-bold uppercase tracking-widest leading-none mt-1",
                                                                children: "Last 24 Hours"
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                                lineNumber: 1259,
                                                                columnNumber: 50
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                        lineNumber: 1257,
                                                        columnNumber: 46
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                lineNumber: 1253,
                                                columnNumber: 42
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "w-7 h-7 rounded-full bg-gray-50 flex items-center justify-center text-[11px] font-black text-gray-400 border border-gray-100",
                                                children: stats.recentCount
                                            }, void 0, false, {
                                                fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                lineNumber: 1262,
                                                columnNumber: 42
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/portal/campaign/[id].tsx",
                                        lineNumber: 1252,
                                        columnNumber: 38
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "flex-1 flex flex-col relative z-10",
                                        children: recentCalls.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "flex flex-col items-center justify-center h-full py-8",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center mb-2 border border-dashed border-gray-200",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                        className: "fi flex fi-rr-time-past text-gray-300 text-lg"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                        lineNumber: 1270,
                                                        columnNumber: 54
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                    lineNumber: 1269,
                                                    columnNumber: 50
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                    className: "text-[10px] text-gray-400 font-black uppercase tracking-widest",
                                                    children: "No recent records"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                    lineNumber: 1272,
                                                    columnNumber: 50
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/portal/campaign/[id].tsx",
                                            lineNumber: 1268,
                                            columnNumber: 46
                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "space-y-3",
                                            children: recentCalls.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center justify-between p-3 rounded-2xl border border-gray-50 bg-gray-50/30 hover:bg-white hover:border-gray-200 transition-all group/item",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: "flex flex-col min-w-0 pr-2",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                    className: "text-[11px] font-bold text-gray-800 truncate leading-none mb-2 capitalize",
                                                                    children: item.customers?.customer_name || 'Anonymous'
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                                    lineNumber: 1279,
                                                                    columnNumber: 62
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                    className: "flex flex-col gap-1.5",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                            className: "flex items-center gap-2 flex-wrap",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                    className: "text-[9px] font-black text-[#4b33e8] bg-indigo-50 px-2 py-1 rounded inline-block uppercase tracking-tighter",
                                                                                    children: [
                                                                                        item.caller_name?.split(' ')[0],
                                                                                        " (",
                                                                                        item.caller_emp_id,
                                                                                        ")"
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                                                    lineNumber: 1282,
                                                                                    columnNumber: 70
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                    className: "text-[9px] font-black text-gray-500 bg-gray-50 px-2 py-1 rounded inline-block uppercase tracking-tighter",
                                                                                    children: [
                                                                                        item.disposition || 'Call',
                                                                                        item.sub_disposition && ` > ${item.sub_disposition}`
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                                                    lineNumber: 1285,
                                                                                    columnNumber: 70
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                                            lineNumber: 1281,
                                                                            columnNumber: 66
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                            className: "flex items-center gap-1.5 text-gray-400",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                                    className: "fi fi-rr-clock text-[8px]"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                                                    lineNumber: 1291,
                                                                                    columnNumber: 70
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                    className: "text-[9px] font-bold leading-none",
                                                                                    children: formatDate(item.created_at)
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                                                    lineNumber: 1292,
                                                                                    columnNumber: 70
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                    className: "text-[8px] font-medium leading-none",
                                                                                    children: new Date(item.created_at).toLocaleTimeString([], {
                                                                                        hour: '2-digit',
                                                                                        minute: '2-digit'
                                                                                    })
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                                                    lineNumber: 1293,
                                                                                    columnNumber: 70
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                                            lineNumber: 1290,
                                                                            columnNumber: 66
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                                    lineNumber: 1280,
                                                                    columnNumber: 63
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                            lineNumber: 1278,
                                                            columnNumber: 58
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                            onClick: ()=>{
                                                                if (id && item.customer_id) {
                                                                    router.push(`/campaign/${id}/${item.customer_id}`);
                                                                }
                                                            },
                                                            className: "w-8 h-8 rounded-lg bg-white flex items-center justify-center text-gray-400 hover:bg-[#4b33e8] hover:text-white transition-all shadow-sm group-hover/item:scale-110 active:scale-95 border border-gray-100",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                className: "fi flex fi-rr-phone-call text-[10px]"
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                                lineNumber: 1305,
                                                                columnNumber: 62
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                            lineNumber: 1297,
                                                            columnNumber: 58
                                                        }, this)
                                                    ]
                                                }, item.id, true, {
                                                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                    lineNumber: 1277,
                                                    columnNumber: 54
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/pages/portal/campaign/[id].tsx",
                                            lineNumber: 1275,
                                            columnNumber: 46
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/pages/portal/campaign/[id].tsx",
                                        lineNumber: 1266,
                                        columnNumber: 38
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/portal/campaign/[id].tsx",
                                lineNumber: 1250,
                                columnNumber: 34
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "bg-white rounded-2xl p-6  border border-gray-100 flex flex-col min-h-[320px] relative overflow-hidden group hover:shadow-lg transition-all",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "absolute inset-0 opacity-[0.03]",
                                        style: {
                                            backgroundImage: "radial-gradient(circle, rgb(239, 68, 68) 1px, transparent 1px)",
                                            backgroundSize: "20px 20px"
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/pages/portal/campaign/[id].tsx",
                                        lineNumber: 1316,
                                        columnNumber: 38
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "flex items-center justify-between mb-6 relative z-10",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-3",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: "w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-red-500",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                            className: "fi flex fi-rr-pending text-sm"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                            lineNumber: 1320,
                                                            columnNumber: 50
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                        lineNumber: 1319,
                                                        columnNumber: 46
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                                                                className: "font-bold text-gray-800 text-sm italic",
                                                                style: {
                                                                    color: "#263238",
                                                                    fontFamily: "'Poppins', sans-serif"
                                                                },
                                                                children: "Overdue"
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                                lineNumber: 1323,
                                                                columnNumber: 50
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                className: "text-[9px] text-red-400 font-bold uppercase tracking-widest leading-none mt-1",
                                                                children: "Action Required"
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                                lineNumber: 1324,
                                                                columnNumber: 50
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                        lineNumber: 1322,
                                                        columnNumber: 46
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                lineNumber: 1318,
                                                columnNumber: 42
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "w-7 h-7 rounded-full bg-red-500 flex items-center justify-center text-[11px] font-black text-white border border-red-600 shadow-lg shadow-red-100",
                                                children: stats.overdueCount
                                            }, void 0, false, {
                                                fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                lineNumber: 1327,
                                                columnNumber: 42
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/portal/campaign/[id].tsx",
                                        lineNumber: 1317,
                                        columnNumber: 38
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "flex-1 flex flex-col relative z-10",
                                        children: overdueLeads.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "flex flex-col items-center justify-center h-full py-8",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mb-2 border border-red-100",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                        className: "fi flex fi-rr-check opacity-50 text-red-500 text-lg"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                        lineNumber: 1335,
                                                        columnNumber: 54
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                    lineNumber: 1334,
                                                    columnNumber: 50
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                    className: "text-[10px] text-red-500 font-black opacity-50 uppercase tracking-widest",
                                                    children: "All caught up"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                    lineNumber: 1337,
                                                    columnNumber: 50
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/portal/campaign/[id].tsx",
                                            lineNumber: 1333,
                                            columnNumber: 46
                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "space-y-3",
                                            children: overdueLeads.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center justify-between p-3 rounded-2xl border border-red-50 bg-red-50/10 hover:bg-white hover:border-red-200 transition-all group/item shadow-[0_0_15px_-10px_rgba(239,68,68,0.2)]",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: "flex flex-col min-w-0 pr-2",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                    className: "text-[11px] font-bold text-gray-800 truncate leading-none mb-2 capitalize",
                                                                    children: item.customer_name || 'Anonymous'
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                                    lineNumber: 1344,
                                                                    columnNumber: 62
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                    className: "flex flex-col gap-1.5",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                            className: "flex items-center gap-2 flex-wrap",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                    className: "text-[9px] font-black text-red-600 bg-red-50 px-2 py-1 rounded inline-block uppercase tracking-tighter",
                                                                                    children: [
                                                                                        item.agent_name?.split(' ')[0],
                                                                                        " (",
                                                                                        item.agent_emp_id,
                                                                                        ")"
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                                                    lineNumber: 1347,
                                                                                    columnNumber: 70
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                    className: "text-[9px] font-black text-red-400 border border-red-100 px-2 py-1 rounded inline-block uppercase tracking-tighter",
                                                                                    children: [
                                                                                        item.disposition || 'Follow Up',
                                                                                        item.sub_disposition && ` > ${item.sub_disposition}`
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                                                    lineNumber: 1350,
                                                                                    columnNumber: 70
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                                            lineNumber: 1346,
                                                                            columnNumber: 66
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                            className: "flex items-center gap-1.5 text-red-400",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                                    className: "fi fi-rr-calendar-clock text-[9px]"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                                                    lineNumber: 1356,
                                                                                    columnNumber: 70
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                    className: "text-[9px] font-bold leading-none",
                                                                                    children: formatDate(item.expiry_date)
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                                                    lineNumber: 1357,
                                                                                    columnNumber: 70
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                    className: "text-[8px] font-medium leading-none",
                                                                                    children: item.expiry_date && String(item.expiry_date).includes('T') ? new Date(item.expiry_date).toLocaleTimeString([], {
                                                                                        hour: '2-digit',
                                                                                        minute: '2-digit'
                                                                                    }) : 'No Time'
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                                                    lineNumber: 1358,
                                                                                    columnNumber: 70
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                                            lineNumber: 1355,
                                                                            columnNumber: 66
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                                    lineNumber: 1345,
                                                                    columnNumber: 63
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                            lineNumber: 1343,
                                                            columnNumber: 58
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                            onClick: ()=>router.push(`/campaign/${id}/${item.id}`),
                                                            className: "w-8 h-8 rounded-lg bg-white flex items-center justify-center text-red-400 hover:bg-red-500 hover:text-white transition-all shadow-sm group-hover/item:scale-110 active:scale-95 border border-red-100",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                className: "fi flex fi-rr-phone-call text-[10px]"
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                                lineNumber: 1366,
                                                                columnNumber: 62
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                            lineNumber: 1362,
                                                            columnNumber: 58
                                                        }, this)
                                                    ]
                                                }, item.id, true, {
                                                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                    lineNumber: 1342,
                                                    columnNumber: 54
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/pages/portal/campaign/[id].tsx",
                                            lineNumber: 1340,
                                            columnNumber: 46
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/pages/portal/campaign/[id].tsx",
                                        lineNumber: 1331,
                                        columnNumber: 38
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/portal/campaign/[id].tsx",
                                lineNumber: 1315,
                                columnNumber: 34
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "bg-white rounded-2xl p-6  border border-gray-100 flex flex-col min-h-[320px] relative overflow-hidden group hover:shadow-lg transition-all",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "absolute inset-0 opacity-[0.03]",
                                        style: {
                                            backgroundImage: "radial-gradient(circle, rgb(59, 130, 246) 1px, transparent 1px)",
                                            backgroundSize: "20px 20px"
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/pages/portal/campaign/[id].tsx",
                                        lineNumber: 1377,
                                        columnNumber: 38
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "flex items-center justify-between mb-6 relative z-10",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-3",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: "w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                            className: "fi flex fi-rr-clock text-sm"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                            lineNumber: 1381,
                                                            columnNumber: 50
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                        lineNumber: 1380,
                                                        columnNumber: 46
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                                                                className: "font-bold text-gray-800 text-sm italic",
                                                                style: {
                                                                    color: "#263238",
                                                                    fontFamily: "'Poppins', sans-serif"
                                                                },
                                                                children: "Upcoming"
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                                lineNumber: 1384,
                                                                columnNumber: 50
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                className: "text-[9px] text-blue-400 font-bold uppercase tracking-widest leading-none mt-1",
                                                                children: "Scheduled Tasks"
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                                lineNumber: 1385,
                                                                columnNumber: 50
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                        lineNumber: 1383,
                                                        columnNumber: 46
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                lineNumber: 1379,
                                                columnNumber: 42
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "w-7 h-7 rounded-full bg-gray-50 flex items-center justify-center text-[11px] font-black text-gray-500 border border-gray-100",
                                                children: stats.upcomingProspects
                                            }, void 0, false, {
                                                fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                lineNumber: 1388,
                                                columnNumber: 42
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/portal/campaign/[id].tsx",
                                        lineNumber: 1378,
                                        columnNumber: 38
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "flex-1 flex flex-col relative z-10",
                                        children: upcomingLeads.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "flex flex-col items-center justify-center h-full py-8",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mb-2",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                        className: "fi flex fi-rr-clock text-blue-300 text-lg"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                        lineNumber: 1396,
                                                        columnNumber: 54
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                    lineNumber: 1395,
                                                    columnNumber: 50
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                    className: "text-[10px] text-gray-400 font-black uppercase tracking-widest",
                                                    children: "No scheduled tasks"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                    lineNumber: 1398,
                                                    columnNumber: 50
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/portal/campaign/[id].tsx",
                                            lineNumber: 1394,
                                            columnNumber: 46
                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "space-y-3",
                                            children: upcomingLeads.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center justify-between p-3 rounded-2xl border border-blue-50 bg-blue-50/10 hover:bg-white hover:border-blue-200 transition-all group/item",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: "flex flex-col min-w-0 pr-2",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                    className: "text-[11px] font-bold text-gray-800 truncate leading-none mb-2 capitalize",
                                                                    children: item.customer_name || 'Anonymous'
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                                    lineNumber: 1405,
                                                                    columnNumber: 62
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                    className: "flex flex-col gap-1.5",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                            className: "flex items-center gap-2 flex-wrap",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                    className: "text-[9px] font-black text-blue-600 bg-blue-50 px-2 py-1 rounded inline-block uppercase tracking-tighter",
                                                                                    children: [
                                                                                        "Agent: ",
                                                                                        item.agent_name?.split(' ')[0],
                                                                                        " (",
                                                                                        item.agent_emp_id,
                                                                                        ")"
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                                                    lineNumber: 1408,
                                                                                    columnNumber: 70
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                    className: "text-[9px] font-black text-blue-400 border border-blue-100 px-2 py-1 rounded inline-block uppercase tracking-tighter",
                                                                                    children: [
                                                                                        item.disposition || 'Scheduled',
                                                                                        item.sub_disposition && ` > ${item.sub_disposition}`
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                                                    lineNumber: 1411,
                                                                                    columnNumber: 70
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                                            lineNumber: 1407,
                                                                            columnNumber: 66
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                            className: "flex items-center gap-1.5 text-blue-400",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                                    className: "fi fi-rr-calendar-clock text-[9px]"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                                                    lineNumber: 1417,
                                                                                    columnNumber: 70
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                    className: "text-[9px] font-bold leading-none",
                                                                                    children: formatDate(item.expiry_date)
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                                                    lineNumber: 1418,
                                                                                    columnNumber: 70
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                    className: "text-[8px] font-medium leading-none",
                                                                                    children: item.expiry_date && String(item.expiry_date).includes('T') ? new Date(item.expiry_date).toLocaleTimeString([], {
                                                                                        hour: '2-digit',
                                                                                        minute: '2-digit'
                                                                                    }) : 'No Time'
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                                                    lineNumber: 1419,
                                                                                    columnNumber: 70
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                                            lineNumber: 1416,
                                                                            columnNumber: 66
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                                    lineNumber: 1406,
                                                                    columnNumber: 63
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                            lineNumber: 1404,
                                                            columnNumber: 58
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                            onClick: ()=>router.push(`/campaign/${id}/${item.id}`),
                                                            className: "w-8 h-8 rounded-lg bg-white flex items-center justify-center text-blue-400 hover:bg-blue-500 hover:text-white transition-all shadow-sm group-hover/item:scale-110 active:scale-95 border border-blue-100",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                className: "fi flex fi-rr-phone-call text-[10px]"
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                                lineNumber: 1427,
                                                                columnNumber: 62
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                            lineNumber: 1423,
                                                            columnNumber: 58
                                                        }, this)
                                                    ]
                                                }, item.id, true, {
                                                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                    lineNumber: 1403,
                                                    columnNumber: 54
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/pages/portal/campaign/[id].tsx",
                                            lineNumber: 1401,
                                            columnNumber: 46
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/pages/portal/campaign/[id].tsx",
                                        lineNumber: 1392,
                                        columnNumber: 38
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/portal/campaign/[id].tsx",
                                lineNumber: 1376,
                                columnNumber: 34
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "bg-white rounded-2xl p-6  border border-gray-100 flex flex-col min-h-[320px] relative overflow-hidden group hover:shadow-lg transition-all",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "absolute inset-0 opacity-[0.03]",
                                        style: {
                                            backgroundImage: "radial-gradient(circle, rgb(20, 184, 166) 1px, transparent 1px)",
                                            backgroundSize: "20px 20px"
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/pages/portal/campaign/[id].tsx",
                                        lineNumber: 1438,
                                        columnNumber: 38
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "flex items-center justify-between mb-6 relative z-10",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-3",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: "w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-teal-500",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                            className: "fi flex fi-rr-briefcase text-sm"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                            lineNumber: 1442,
                                                            columnNumber: 50
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                        lineNumber: 1441,
                                                        columnNumber: 46
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                                                                className: "font-bold text-gray-800 text-sm italic",
                                                                style: {
                                                                    color: "#263238",
                                                                    fontFamily: "'Poppins', sans-serif"
                                                                },
                                                                children: "Managed By"
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                                lineNumber: 1445,
                                                                columnNumber: 50
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                className: "text-[9px] text-teal-400 font-bold uppercase tracking-widest leading-none mt-1",
                                                                children: "Assigned Leads"
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                                lineNumber: 1446,
                                                                columnNumber: 50
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                        lineNumber: 1444,
                                                        columnNumber: 46
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                lineNumber: 1440,
                                                columnNumber: 42
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "w-7 h-7 rounded-full bg-gray-50 flex items-center justify-center text-[11px] font-black text-gray-500 border border-gray-100",
                                                children: stats.managedCount
                                            }, void 0, false, {
                                                fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                lineNumber: 1449,
                                                columnNumber: 42
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/portal/campaign/[id].tsx",
                                        lineNumber: 1439,
                                        columnNumber: 38
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "flex-1 flex flex-col relative z-10",
                                        children: managedLeads.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "flex flex-col items-center justify-center h-full py-8",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "w-12 h-12 rounded-full bg-teal-50 flex items-center justify-center mb-2",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                        className: "fi flex fi-rr-user-add text-teal-300 text-lg"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                        lineNumber: 1457,
                                                        columnNumber: 54
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                    lineNumber: 1456,
                                                    columnNumber: 50
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                    className: "text-[10px] text-gray-400 font-black uppercase tracking-widest",
                                                    children: "No managed leads"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                    lineNumber: 1459,
                                                    columnNumber: 50
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/portal/campaign/[id].tsx",
                                            lineNumber: 1455,
                                            columnNumber: 46
                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "space-y-3",
                                            children: managedLeads.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center justify-between p-3 rounded-2xl border border-teal-50 bg-teal-50/10 hover:bg-white hover:border-teal-200 transition-all group/item",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: "flex flex-col min-w-0 pr-2",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                    className: "text-[11px] font-bold text-gray-800 truncate leading-none mb-2 capitalize",
                                                                    children: item.customer_name || 'Anonymous'
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                                    lineNumber: 1466,
                                                                    columnNumber: 62
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                    className: "flex flex-col gap-1.5 min-w-[120px]",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                            className: "flex items-center gap-2",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                    className: "text-[9px] font-black text-teal-600 bg-teal-50 px-2 py-0.5 rounded inline-block uppercase tracking-tighter",
                                                                                    children: [
                                                                                        "M: ",
                                                                                        item.manager_name?.split(' ')[0]
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                                                    lineNumber: 1470,
                                                                                    columnNumber: 70
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                    className: "text-[8px] font-bold text-teal-400",
                                                                                    children: [
                                                                                        "(",
                                                                                        item.manager_emp_id,
                                                                                        ")"
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                                                    lineNumber: 1473,
                                                                                    columnNumber: 70
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                                            lineNumber: 1469,
                                                                            columnNumber: 66
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                            className: "flex items-center gap-2",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                    className: "text-[9px] font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded inline-block uppercase tracking-tighter",
                                                                                    children: [
                                                                                        "A: ",
                                                                                        item.agent_name?.split(' ')[0]
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                                                    lineNumber: 1477,
                                                                                    columnNumber: 70
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                    className: "text-[8px] font-bold text-indigo-400",
                                                                                    children: [
                                                                                        "(",
                                                                                        item.agent_emp_id,
                                                                                        ")"
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                                                    lineNumber: 1480,
                                                                                    columnNumber: 70
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                                            lineNumber: 1476,
                                                                            columnNumber: 66
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                                    lineNumber: 1467,
                                                                    columnNumber: 62
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                            lineNumber: 1465,
                                                            columnNumber: 58
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                            onClick: ()=>router.push(`/campaign/${id}/${item.id}`),
                                                            className: "w-8 h-8 rounded-lg bg-white flex items-center justify-center text-teal-400 hover:bg-teal-500 hover:text-white transition-all shadow-sm group-hover/item:scale-110 active:scale-95 border border-teal-100",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                className: "fi flex fi-rr-phone-call text-[10px]"
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                                lineNumber: 1488,
                                                                columnNumber: 62
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                            lineNumber: 1484,
                                                            columnNumber: 58
                                                        }, this)
                                                    ]
                                                }, item.id, true, {
                                                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                    lineNumber: 1464,
                                                    columnNumber: 54
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/pages/portal/campaign/[id].tsx",
                                            lineNumber: 1462,
                                            columnNumber: 46
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/pages/portal/campaign/[id].tsx",
                                        lineNumber: 1453,
                                        columnNumber: 38
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/portal/campaign/[id].tsx",
                                lineNumber: 1437,
                                columnNumber: 34
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/pages/portal/campaign/[id].tsx",
                        lineNumber: 1248,
                        columnNumber: 29
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                    lineNumber: 1246,
                    columnNumber: 25
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: "bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 min-h-[400px] relative overflow-hidden group hover:shadow-md transition-all",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "absolute top-0 right-0 w-64 h-64 bg-indigo-50/20 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"
                        }, void 0, false, {
                            fileName: "[project]/pages/portal/campaign/[id].tsx",
                            lineNumber: 1501,
                            columnNumber: 33
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 relative z-10",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-[#4b33e8] border border-indigo-100/50 shadow-sm",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                className: "fi flex fi-rr-users text-lg font-bold"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                lineNumber: 1506,
                                                columnNumber: 45
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/pages/portal/campaign/[id].tsx",
                                            lineNumber: 1505,
                                            columnNumber: 41
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                                                    className: "font-bold text-gray-800 text-xl leading-none mb-2",
                                                    style: {
                                                        color: "#263238",
                                                        fontFamily: "'Poppins', sans-serif"
                                                    },
                                                    children: "All Leads"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                    lineNumber: 1509,
                                                    columnNumber: 45
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center gap-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                            className: "text-[10px] text-gray-400 font-semibold tracking-[0.2em]",
                                                            children: [
                                                                "Campaign Database • ",
                                                                totalLeadsCount,
                                                                " Records"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                            lineNumber: 1511,
                                                            columnNumber: 49
                                                        }, this),
                                                        selectedLeads.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                            className: "bg-[#4b33e8] text-white px-2 py-0.5 rounded text-[10px] font-bold  animate-in fade-in slide-in-from-left-4 duration-300",
                                                            children: [
                                                                selectedLeads.length,
                                                                " Selected"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                            lineNumber: 1513,
                                                            columnNumber: 53
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                    lineNumber: 1510,
                                                    columnNumber: 45
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/portal/campaign/[id].tsx",
                                            lineNumber: 1508,
                                            columnNumber: 41
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                                    lineNumber: 1504,
                                    columnNumber: 37
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "flex flex-wrap items-center gap-3",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "relative group/filter min-w-[140px]",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                        className: "fi flex fi-rr-user text-gray-400 text-xs"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                        lineNumber: 1525,
                                                        columnNumber: 49
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                    lineNumber: 1524,
                                                    columnNumber: 45
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("select", {
                                                    value: selectedUserFilter || "ALL",
                                                    onChange: (e)=>setSelectedUserFilter(e.target.value),
                                                    className: "w-full h-[42px] pl-8 pr-8 rounded-xl bg-gray-50 border border-gray-100 text-[10px] font-bold text-gray-600 focus:bg-white focus:border-[#4b33e8]/30 focus:ring-4 focus:ring-[#4b33e8]/5 outline-none transition-all uppercase tracking-wider appearance-none cursor-pointer",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                            value: "ALL",
                                                            children: "All Users"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                            lineNumber: 1532,
                                                            columnNumber: 49
                                                        }, this),
                                                        campaign?.users?.map((u)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                                value: u.user_id || u.id,
                                                                children: u.name || u.displayName || 'User'
                                                            }, u.id, false, {
                                                                fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                                lineNumber: 1534,
                                                                columnNumber: 53
                                                            }, this))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                    lineNumber: 1527,
                                                    columnNumber: 45
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                        className: "fi flex fi-rr-angle-small-down text-gray-400"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                        lineNumber: 1538,
                                                        columnNumber: 49
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                    lineNumber: 1537,
                                                    columnNumber: 45
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/portal/campaign/[id].tsx",
                                            lineNumber: 1523,
                                            columnNumber: 41
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "relative group/filter min-w-[140px]",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                        className: "fi flex fi-rr-filter text-gray-400 text-xs"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                        lineNumber: 1545,
                                                        columnNumber: 49
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                    lineNumber: 1544,
                                                    columnNumber: 45
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("select", {
                                                    value: selectedDispositionFilter,
                                                    onChange: (e)=>setSelectedDispositionFilter(e.target.value),
                                                    className: "w-full h-[42px] pl-8 pr-8 rounded-xl bg-gray-50 border border-gray-100 text-[10px] font-bold text-gray-600 focus:bg-white focus:border-[#4b33e8]/30 focus:ring-4 focus:ring-[#4b33e8]/5 outline-none transition-all uppercase tracking-wider appearance-none cursor-pointer",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                            value: "",
                                                            children: "All Status"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                            lineNumber: 1552,
                                                            columnNumber: 49
                                                        }, this),
                                                        [
                                                            'Fresh',
                                                            'Call Back',
                                                            'Not Interested',
                                                            'Converted',
                                                            'Follow Up',
                                                            'DNE',
                                                            'Busy',
                                                            'No Answer',
                                                            'Invalid Number',
                                                            'Wrong Number',
                                                            'Not Reachable'
                                                        ].map((d)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                                value: d,
                                                                children: d
                                                            }, d, false, {
                                                                fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                                lineNumber: 1554,
                                                                columnNumber: 53
                                                            }, this))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                    lineNumber: 1547,
                                                    columnNumber: 45
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                        className: "fi flex fi-rr-angle-small-down text-gray-400"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                        lineNumber: 1558,
                                                        columnNumber: 49
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                    lineNumber: 1557,
                                                    columnNumber: 45
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/portal/campaign/[id].tsx",
                                            lineNumber: 1543,
                                            columnNumber: 41
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "relative group/search min-w-[240px]",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                        className: "fi flex fi-rr-search text-gray-400 text-xs group-focus-within/search:text-[#4b33e8] transition-colors"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                        lineNumber: 1564,
                                                        columnNumber: 49
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                    lineNumber: 1563,
                                                    columnNumber: 45
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                                    type: "text",
                                                    placeholder: "SEARCH NAME OR PHONE...",
                                                    value: searchQuery,
                                                    onChange: (e)=>setSearchQuery(e.target.value),
                                                    className: "w-full h-[42px] pl-10 pr-4 rounded-xl bg-gray-50 border border-gray-100 text-[10px] font-black text-gray-600 focus:bg-white focus:border-[#4b33e8]/30 focus:ring-4 focus:ring-[#4b33e8]/5 outline-none transition-all placeholder:text-gray-300 tracking-widest uppercase"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                    lineNumber: 1566,
                                                    columnNumber: 45
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/portal/campaign/[id].tsx",
                                            lineNumber: 1562,
                                            columnNumber: 41
                                        }, this),
                                        !isLevel1User && !isLevel2User && campaign?.isaddbulkbuttonvisible && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                            onClick: ()=>setShowImportModal(true),
                                            className: "flex items-center gap-2 px-6 h-[42px] bg-indigo-50 text-[#4b33e8] border border-indigo-100 rounded-xl text-xs font-bold hover:bg-indigo-100 transition-all uppercase tracking-widest",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                    className: "fi flex fi-rr-upload"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                    lineNumber: 1584,
                                                    columnNumber: 50
                                                }, this),
                                                "Add Bulk"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/portal/campaign/[id].tsx",
                                            lineNumber: 1580,
                                            columnNumber: 46
                                        }, this),
                                        !isLevel1User && !isLevel2User && campaign?.isaddleadbuttonvisible && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                            className: "flex items-center gap-2 px-6 h-[42px] bg-[#4b33e8] text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-100 hover:opacity-90 transition-all uppercase tracking-widest",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                    className: "fi flex fi-rr-plus"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                    lineNumber: 1592,
                                                    columnNumber: 50
                                                }, this),
                                                "Add Lead"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/portal/campaign/[id].tsx",
                                            lineNumber: 1591,
                                            columnNumber: 46
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                                    lineNumber: 1521,
                                    columnNumber: 37
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/pages/portal/campaign/[id].tsx",
                            lineNumber: 1503,
                            columnNumber: 33
                        }, this),
                        loadingLeads ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "flex flex-col items-center justify-center py-20",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "animate-spin rounded-full h-8 w-8 border-4 border-t-transparent border-[#4b33e8] mb-4"
                                }, void 0, false, {
                                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                                    lineNumber: 1602,
                                    columnNumber: 41
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                    className: "text-xs text-gray-400 font-bold",
                                    children: "Fetching leads..."
                                }, void 0, false, {
                                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                                    lineNumber: 1603,
                                    columnNumber: 41
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/pages/portal/campaign/[id].tsx",
                            lineNumber: 1601,
                            columnNumber: 37
                        }, this) : leads.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "flex-1 flex flex-col items-center justify-center py-12",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "w-20 h-20 rounded-3xl bg-gray-50 flex items-center justify-center mb-6 border border-gray-100/50",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                        className: "fi flex fi-rr-phone-call text-gray-200 text-3xl"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/portal/campaign/[id].tsx",
                                        lineNumber: 1608,
                                        columnNumber: 45
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                                    lineNumber: 1607,
                                    columnNumber: 41
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h4", {
                                    className: "text-gray-400 font-black text-sm mb-2",
                                    children: "No leads found"
                                }, void 0, false, {
                                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                                    lineNumber: 1610,
                                    columnNumber: 41
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                    className: "text-[10px] text-gray-300 font-bold max-w-[200px] text-center",
                                    children: "There are no leads assigned to this campaign yet."
                                }, void 0, false, {
                                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                                    lineNumber: 1611,
                                    columnNumber: 41
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/pages/portal/campaign/[id].tsx",
                            lineNumber: 1606,
                            columnNumber: 37
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "overflow-x-auto -mx-2",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("table", {
                                className: "w-full text-left",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("thead", {
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("tr", {
                                            className: "border-b border-gray-50",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                    className: "px-4 py-4 w-10",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: "flex items-center justify-center",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                                            type: "checkbox",
                                                            checked: leads.length > 0 && leads.every((l)=>selectedLeads.includes(l.id)),
                                                            onChange: toggleSelectAll,
                                                            className: "w-4 h-4 rounded border-gray-300 text-[#4b33e8] focus:ring-[#4b33e8] cursor-pointer"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                            lineNumber: 1620,
                                                            columnNumber: 61
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                        lineNumber: 1619,
                                                        columnNumber: 57
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                    lineNumber: 1618,
                                                    columnNumber: 53
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                    className: "px-4 py-4 text-[10px] font-medium text-gray-400 uppercase tracking-widest",
                                                    children: "Customer Name"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                    lineNumber: 1628,
                                                    columnNumber: 53
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                    className: "px-4 py-4 text-[10px] font-medium text-gray-400 uppercase tracking-widest",
                                                    children: "Contact Info"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                    lineNumber: 1629,
                                                    columnNumber: 53
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                    className: "px-4 py-4 text-[10px] font-medium text-gray-400 uppercase tracking-widest text-center",
                                                    children: "Status"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                    lineNumber: 1630,
                                                    columnNumber: 53
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                    className: "px-4 py-4 text-[10px] font-medium text-gray-400 uppercase tracking-widest text-center",
                                                    children: "Disposition/Sub"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                    lineNumber: 1631,
                                                    columnNumber: 53
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                    className: "px-4 py-4 text-[10px] font-medium text-gray-400 uppercase tracking-widest",
                                                    children: "Expiry Date"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                    lineNumber: 1632,
                                                    columnNumber: 53
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                    className: "px-4 py-4 text-[10px] font-medium text-gray-400 uppercase tracking-widest",
                                                    children: "Assigned To"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                    lineNumber: 1633,
                                                    columnNumber: 53
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                    className: "px-4 py-4 text-[10px] font-medium text-gray-400 uppercase tracking-widest text-center",
                                                    children: "Manage By"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                    lineNumber: 1634,
                                                    columnNumber: 53
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                    className: "px-4 py-4 text-[10px] font-medium text-gray-400 uppercase tracking-widest",
                                                    children: "Last Called"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                    lineNumber: 1635,
                                                    columnNumber: 53
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                    className: "px-4 py-4 text-[10px] font-medium text-gray-400 uppercase tracking-widest",
                                                    children: "Last Updated By"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                    lineNumber: 1636,
                                                    columnNumber: 53
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/portal/campaign/[id].tsx",
                                            lineNumber: 1617,
                                            columnNumber: 49
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/pages/portal/campaign/[id].tsx",
                                        lineNumber: 1616,
                                        columnNumber: 45
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("tbody", {
                                        className: "divide-y divide-gray-50",
                                        children: leads.map((lead)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("tr", {
                                                onClick: ()=>{
                                                    if (id && lead.id) {
                                                        router.push(`/campaign/${id}/${lead.id}`);
                                                    }
                                                },
                                                className: "group hover:bg-indigo-50/30 transition-all cursor-pointer border-b border-gray-50/50 last:border-0",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                        className: "px-4 py-4",
                                                        onClick: (e)=>e.stopPropagation(),
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center justify-center",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                                                type: "checkbox",
                                                                checked: selectedLeads.includes(lead.id),
                                                                onChange: ()=>toggleSelect(lead.id),
                                                                className: "w-4 h-4 rounded border-gray-300 text-[#4b33e8] focus:ring-[#4b33e8] cursor-pointer"
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                                lineNumber: 1652,
                                                                columnNumber: 65
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                            lineNumber: 1651,
                                                            columnNumber: 61
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                        lineNumber: 1650,
                                                        columnNumber: 57
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                        className: "px-4 py-4",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center gap-3",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                    className: "w-10 h-10 flex-shrink-0 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shadow-lg shadow-indigo-100 uppercase",
                                                                    children: lead.customer_name?.charAt(0) || 'C'
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                                    lineNumber: 1662,
                                                                    columnNumber: 65
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                    className: "text-xs font-medium text-gray-800",
                                                                    style: {
                                                                        color: "#263238",
                                                                        fontFamily: "'Poppins', sans-serif"
                                                                    },
                                                                    children: lead.customer_name || 'Anonymous'
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                                    lineNumber: 1665,
                                                                    columnNumber: 65
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                            lineNumber: 1661,
                                                            columnNumber: 61
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                        lineNumber: 1660,
                                                        columnNumber: 57
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                        className: "px-4 py-4",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: "flex flex-col",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                    className: "text-xs font-medium text-gray-700 leading-none mb-1",
                                                                    children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$phoneUtils$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["formatMaskedPhone"])(lead.phone_no)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                                    lineNumber: 1670,
                                                                    columnNumber: 65
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                    className: "text-[9px] text-gray-400 font-medium uppercase tracking-tighter",
                                                                    children: "Verified Lead"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                                    lineNumber: 1671,
                                                                    columnNumber: 65
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                            lineNumber: 1669,
                                                            columnNumber: 61
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                        lineNumber: 1668,
                                                        columnNumber: 57
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                        className: "px-4 py-4 text-center",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: "flex justify-center",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                className: `px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest flex items-center gap-1.5 ${lead.status === 'active' ? 'bg-green-50 text-green-600 border border-green-100' : lead.status === 'followup' ? 'bg-orange-50 text-orange-600 border border-orange-100' : lead.status === 'closed' ? 'bg-indigo-50 text-indigo-600 border border-indigo-100' : 'bg-gray-50 text-gray-600 border border-gray-100'}`,
                                                                children: [
                                                                    lead.status === 'closed' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                        className: "fi fi-rr-check-circle flex text-[10px]"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                                        lineNumber: 1682,
                                                                        columnNumber: 98
                                                                    }, this),
                                                                    lead.status
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                                lineNumber: 1676,
                                                                columnNumber: 65
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                            lineNumber: 1675,
                                                            columnNumber: 61
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                        lineNumber: 1674,
                                                        columnNumber: 57
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                        className: "px-4 py-4",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: "flex flex-col items-center",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                    className: "text-[10px] font-bold text-gray-700 leading-none mb-1",
                                                                    children: lead.disposition || 'Fresh'
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                                    lineNumber: 1689,
                                                                    columnNumber: 65
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                    className: "text-[8px] font-black text-indigo-400 uppercase tracking-widest",
                                                                    children: lead.sub_disposition || '---'
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                                    lineNumber: 1692,
                                                                    columnNumber: 65
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                            lineNumber: 1688,
                                                            columnNumber: 61
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                        lineNumber: 1687,
                                                        columnNumber: 57
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                        className: "px-4 py-4",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: "flex flex-col",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                    className: "text-[10px] font-bold text-indigo-600",
                                                                    children: formatDate(lead.expiry_date)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                                    lineNumber: 1699,
                                                                    columnNumber: 65
                                                                }, this),
                                                                lead.expiry_date && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                    className: "text-[8px] text-gray-400 font-medium",
                                                                    children: new Date(lead.expiry_date).toLocaleTimeString([], {
                                                                        hour: '2-digit',
                                                                        minute: '2-digit'
                                                                    })
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                                    lineNumber: 1701,
                                                                    columnNumber: 69
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                            lineNumber: 1698,
                                                            columnNumber: 61
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                        lineNumber: 1697,
                                                        columnNumber: 57
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                        className: "px-4 py-4",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center gap-2",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                    className: `w-1.5 h-1.5 rounded-full ${lead.assigned_user_name === 'Unassigned' ? 'bg-gray-300' : 'bg-indigo-400'}`
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                                    lineNumber: 1709,
                                                                    columnNumber: 65
                                                                }, this),
                                                                lead.assigned_user_info ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                    className: "flex flex-col",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                            className: "text-[10px] font-medium text-gray-800 leading-none mb-0.5",
                                                                            children: lead.assigned_user_info.name
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                                            lineNumber: 1712,
                                                                            columnNumber: 73
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                            className: "text-[8px] font-black text-gray-400 uppercase tracking-tighter",
                                                                            children: [
                                                                                "ID: ",
                                                                                lead.assigned_user_info.empId
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                                            lineNumber: 1715,
                                                                            columnNumber: 73
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                                    lineNumber: 1711,
                                                                    columnNumber: 69
                                                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                    className: "text-[10px] font-medium text-gray-600 uppercase tracking-tighter",
                                                                    children: lead.assigned_user_name
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                                    lineNumber: 1720,
                                                                    columnNumber: 70
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                            lineNumber: 1708,
                                                            columnNumber: 61
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                        lineNumber: 1707,
                                                        columnNumber: 57
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                        className: "px-4 py-4 text-center",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: "flex flex-col items-center justify-center gap-1",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                    className: "inline-flex items-center px-2 py-0.5 rounded-full bg-indigo-50/40 border border-indigo-100/50 backdrop-blur-sm",
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                        className: "text-[10px] font-extrabold text-indigo-600 uppercase tracking-tighter",
                                                                        children: lead.managed_by_name
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                                        lineNumber: 1729,
                                                                        columnNumber: 69
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                                    lineNumber: 1728,
                                                                    columnNumber: 65
                                                                }, this),
                                                                lead.managed_by_id && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                    className: "text-[8px] font-black text-gray-400 uppercase tracking-widest leading-none",
                                                                    children: [
                                                                        "ID: ",
                                                                        lead.managed_by_id
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                                    lineNumber: 1732,
                                                                    columnNumber: 69
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                            lineNumber: 1727,
                                                            columnNumber: 61
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                        lineNumber: 1726,
                                                        columnNumber: 57
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                        className: "px-4 py-4",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: "flex flex-col",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                    className: "text-[10px] font-bold text-gray-700",
                                                                    children: formatDate(lead.last_called_at)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                                    lineNumber: 1738,
                                                                    columnNumber: 65
                                                                }, this),
                                                                lead.last_called_at && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                    className: "text-[8px] text-gray-400 font-medium",
                                                                    children: new Date(lead.last_called_at).toLocaleTimeString([], {
                                                                        hour: '2-digit',
                                                                        minute: '2-digit'
                                                                    })
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                                    lineNumber: 1740,
                                                                    columnNumber: 69
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                            lineNumber: 1737,
                                                            columnNumber: 61
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                        lineNumber: 1736,
                                                        columnNumber: 57
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                        className: "px-4 py-4",
                                                        children: lead.last_updated_by_info ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: "flex flex-col",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                    className: "text-[10px] font-bold text-gray-800 leading-none mb-1",
                                                                    children: lead.last_updated_by_info.name
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                                    lineNumber: 1749,
                                                                    columnNumber: 69
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                    className: "text-[9px] text-indigo-500 font-black uppercase tracking-tighter",
                                                                    children: [
                                                                        "ID: ",
                                                                        lead.last_updated_by_info.empId
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                                    lineNumber: 1750,
                                                                    columnNumber: 69
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                            lineNumber: 1748,
                                                            columnNumber: 65
                                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                            className: "text-[10px] text-gray-300 italic",
                                                            children: "No Updates"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                            lineNumber: 1753,
                                                            columnNumber: 65
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                        lineNumber: 1746,
                                                        columnNumber: 57
                                                    }, this)
                                                ]
                                            }, lead.id, true, {
                                                fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                lineNumber: 1641,
                                                columnNumber: 53
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/pages/portal/campaign/[id].tsx",
                                        lineNumber: 1639,
                                        columnNumber: 45
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/portal/campaign/[id].tsx",
                                lineNumber: 1615,
                                columnNumber: 41
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/pages/portal/campaign/[id].tsx",
                            lineNumber: 1614,
                            columnNumber: 37
                        }, this),
                        !loadingLeads && totalLeadsCount > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-50 pt-6",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                    className: "text-[10px] text-gray-400 font-black uppercase tracking-widest",
                                    children: [
                                        "Showing ",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                            className: "text-gray-800",
                                            children: (currentPage - 1) * leadsPerPage + 1
                                        }, void 0, false, {
                                            fileName: "[project]/pages/portal/campaign/[id].tsx",
                                            lineNumber: 1767,
                                            columnNumber: 53
                                        }, this),
                                        " to ",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                            className: "text-gray-800",
                                            children: Math.min(currentPage * leadsPerPage, totalLeadsCount)
                                        }, void 0, false, {
                                            fileName: "[project]/pages/portal/campaign/[id].tsx",
                                            lineNumber: 1767,
                                            columnNumber: 134
                                        }, this),
                                        " of ",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                            className: "text-gray-800",
                                            children: totalLeadsCount
                                        }, void 0, false, {
                                            fileName: "[project]/pages/portal/campaign/[id].tsx",
                                            lineNumber: 1767,
                                            columnNumber: 232
                                        }, this),
                                        " Leads"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                                    lineNumber: 1766,
                                    columnNumber: 41
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                            onClick: ()=>setCurrentPage((prev)=>Math.max(prev - 1, 1)),
                                            disabled: currentPage === 1,
                                            className: `w-10 h-10 rounded-xl flex items-center justify-center border transition-all ${currentPage === 1 ? 'bg-gray-50 border-gray-100 text-gray-300 cursor-not-allowed' : 'bg-white border-gray-200 text-gray-600 hover:border-indigo-500 hover:text-indigo-500 shadow-sm'}`,
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                className: "fi fi-rr-angle-small-left text-lg"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                lineNumber: 1780,
                                                columnNumber: 49
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/pages/portal/campaign/[id].tsx",
                                            lineNumber: 1771,
                                            columnNumber: 45
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "flex items-center gap-1",
                                            children: [
                                                ...Array(Math.ceil(totalLeadsCount / leadsPerPage))
                                            ].map((_, idx)=>{
                                                const pgNum = idx + 1;
                                                // Show only few pages if there are many
                                                if (pgNum === 1 || pgNum === Math.ceil(totalLeadsCount / leadsPerPage) || pgNum >= currentPage - 1 && pgNum <= currentPage + 1) {
                                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                        onClick: ()=>setCurrentPage(pgNum),
                                                        className: `w-10 h-10 rounded-xl text-[11px] font-bold transition-all ${currentPage === pgNum ? 'bg-[#4b33e8] text-white shadow-lg shadow-indigo-100' : 'bg-white border border-gray-200 text-gray-500 hover:border-indigo-400 hover:text-indigo-500'}`,
                                                        children: pgNum
                                                    }, pgNum, false, {
                                                        fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                        lineNumber: 1793,
                                                        columnNumber: 61
                                                    }, this);
                                                } else if (pgNum === currentPage - 2 && pgNum > 1 || pgNum === currentPage + 2 && pgNum < Math.ceil(totalLeadsCount / leadsPerPage)) {
                                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                        className: "text-gray-300 px-1",
                                                        children: "..."
                                                    }, pgNum, false, {
                                                        fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                        lineNumber: 1809,
                                                        columnNumber: 64
                                                    }, this);
                                                }
                                                return null;
                                            })
                                        }, void 0, false, {
                                            fileName: "[project]/pages/portal/campaign/[id].tsx",
                                            lineNumber: 1783,
                                            columnNumber: 45
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                            onClick: ()=>setCurrentPage((prev)=>Math.min(prev + 1, Math.ceil(totalLeadsCount / leadsPerPage))),
                                            disabled: currentPage === Math.ceil(totalLeadsCount / leadsPerPage),
                                            className: `w-10 h-10 rounded-xl flex items-center justify-center border transition-all ${currentPage === Math.ceil(totalLeadsCount / leadsPerPage) ? 'bg-gray-50 border-gray-100 text-gray-300 cursor-not-allowed' : 'bg-white border-gray-200 text-gray-600 hover:border-indigo-500 hover:text-indigo-500 shadow-sm'}`,
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                className: "fi fi-rr-angle-small-right text-lg"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                lineNumber: 1824,
                                                columnNumber: 49
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/pages/portal/campaign/[id].tsx",
                                            lineNumber: 1815,
                                            columnNumber: 45
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                                    lineNumber: 1770,
                                    columnNumber: 41
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/pages/portal/campaign/[id].tsx",
                            lineNumber: 1765,
                            columnNumber: 37
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                    lineNumber: 1500,
                    columnNumber: 29
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ImportCustomersModal$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                    show: showImportModal,
                    onClose: ()=>setShowImportModal(false),
                    onSuccess: ()=>{
                        fetchLeads(1);
                        fetchCampaignData();
                    },
                    preselectedOrgId: campaign?.organization_id || "",
                    preselectedCampaignId: id
                }, void 0, false, {
                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                    lineNumber: 1832,
                    columnNumber: 29
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/pages/portal/campaign/[id].tsx",
            lineNumber: 923,
            columnNumber: 13
        }, this)
    }, void 0, false);
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__4dfdec64._.js.map