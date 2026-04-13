module.exports = [
"[externals]/crypto-js/sha256.js [external] (crypto-js/sha256.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto-js/sha256.js", () => require("crypto-js/sha256.js"));

module.exports = mod;
}),
"[externals]/crypto-js/aes.js [external] (crypto-js/aes.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto-js/aes.js", () => require("crypto-js/aes.js"));

module.exports = mod;
}),
"[externals]/crypto-js/enc-utf8.js [external] (crypto-js/enc-utf8.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto-js/enc-utf8.js", () => require("crypto-js/enc-utf8.js"));

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
var __TURBOPACK__imported__module__$5b$externals$5d2f$crypto$2d$js$2f$aes$2e$js__$5b$external$5d$__$28$crypto$2d$js$2f$aes$2e$js$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/crypto-js/aes.js [external] (crypto-js/aes.js, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$crypto$2d$js$2f$enc$2d$utf8$2e$js__$5b$external$5d$__$28$crypto$2d$js$2f$enc$2d$utf8$2e$js$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/crypto-js/enc-utf8.js [external] (crypto-js/enc-utf8.js, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$localStorageUtils$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/localStorageUtils.ts [ssr] (ecmascript)");
;
;
;
;
/**
 * Utility for phone number encryption and decryption
 * Currently Active: v1 (Simple XOR) - prefix "__enc__"
 * Supported for Read: v2 (AES-256) - prefix "__v2__"
 */ const SECRET_KEY = ("TURBOPACK compile-time value", "TfcV2_Secure_9Xk2Lp5Nm8Qj4Rs7Vw1Zy3Bd6G") || "RYNXLY_SECURE_PHONE_VAULT";
const computePhoneHash = (phone)=>{
    if (!phone) return null;
    const normalized = phone.replace(/[^0-9]/g, '');
    if (!normalized) return null;
    return (0, __TURBOPACK__imported__module__$5b$externals$5d2f$crypto$2d$js$2f$sha256$2e$js__$5b$external$5d$__$28$crypto$2d$js$2f$sha256$2e$js$2c$__cjs$29$__["default"])(normalized).toString();
};
const encryptPhone = (phone)=>{
    if (!phone) return "";
    // Safety check: Don't re-encrypt
    if (phone.startsWith("__enc__") || phone.startsWith("__v2__")) return phone;
    try {
        // XOR Cipher Logic
        const encrypted = phone.split('').map((char, i)=>String.fromCharCode(char.charCodeAt(0) ^ SECRET_KEY.charCodeAt(i % SECRET_KEY.length))).join('');
        // Convert to Base64 for storage
        return `__enc__${btoa(encrypted)}`;
    } catch (e) {
        console.error("XOR Encryption Failed:", e);
        return phone;
    }
};
const decryptPhone = (phone, orgId)=>{
    if (!phone) return "";
    // CASE 1: Legacy XOR (v1) - Primary
    if (phone.startsWith("__enc__")) {
        try {
            const base64Data = phone.substring(7);
            const encrypted = atob(base64Data);
            const decrypted = encrypted.split('').map((char, i)=>String.fromCharCode(char.charCodeAt(0) ^ SECRET_KEY.charCodeAt(i % SECRET_KEY.length))).join('');
            return decrypted;
        } catch (e) {
            return phone;
        }
    }
    // CASE 2: AES-256 (v2) - Fallback for newly saved data
    if (phone.startsWith("__v2__")) {
        try {
            const INTERNAL_SALT = "TFC_SMART_SHIELD_V2_2024"; // Support for transition data
            const contextOrgId = orgId || (("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : "");
            const dynamicKey = SECRET_KEY + (contextOrgId || "");
            const ciphertext = phone.substring(6);
            const bytes = __TURBOPACK__imported__module__$5b$externals$5d2f$crypto$2d$js$2f$aes$2e$js__$5b$external$5d$__$28$crypto$2d$js$2f$aes$2e$js$2c$__cjs$29$__["default"].decrypt(ciphertext, dynamicKey);
            let decryptedWithSalt = bytes.toString(__TURBOPACK__imported__module__$5b$externals$5d2f$crypto$2d$js$2f$enc$2d$utf8$2e$js__$5b$external$5d$__$28$crypto$2d$js$2f$enc$2d$utf8$2e$js$2c$__cjs$29$__["default"]);
            if (decryptedWithSalt && decryptedWithSalt.endsWith(INTERNAL_SALT)) {
                return decryptedWithSalt.substring(0, decryptedWithSalt.length - INTERNAL_SALT.length);
            }
            return decryptedWithSalt || phone;
        } catch (e) {
            return phone;
        }
    }
    return phone;
};
const formatMaskedPhone = (phone, orgId)=>{
    const realPhone = decryptPhone(phone, orgId);
    if (!realPhone) return "—";
    if (realPhone.length < 4) return realPhone;
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
            if (user?.isClient && user.organization_id) {
                setSelectedOrgId(user.organization_id);
                fetchCampaigns(user.organization_id);
            } else {
                setSelectedOrgId(preselectedOrgId);
                fetchCampaigns(preselectedOrgId);
            }
            setSelectedCampaignId(preselectedCampaignId);
            fetchOrganizations();
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
        preselectedCampaignId,
        user
    ]);
    // Re-fetch campaigns when selected organization changes
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        if (showImportModal && selectedOrgId) {
            fetchCampaigns(selectedOrgId);
            // If we change org, we should probably clear campaign unless it's the preselected one
            if (selectedOrgId !== preselectedOrgId) {
                setSelectedCampaignId("");
            } else {
                setSelectedCampaignId(preselectedCampaignId);
            }
        } else if (showImportModal && !selectedOrgId) {
            setCampaigns([]);
            setSelectedCampaignId("");
        }
    }, [
        selectedOrgId
    ]);
    const fetchCampaigns = async (orgId)=>{
        if (!orgId && !preselectedOrgId) {
            setCampaigns([]);
            return;
        }
        try {
            let query = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from("campaigns").select("id, name").eq("status", "active").order("name", {
                ascending: true
            });
            const targetOrgId = orgId || preselectedOrgId;
            if (targetOrgId) {
                query = query.eq("organization_id", targetOrgId);
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
                    lineNumber: 998,
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
                        lineNumber: 1011,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                        className: "font-semibold text-gray-600 truncate",
                        children: String(v)
                    }, void 0, false, {
                        fileName: "[project]/components/ImportCustomersModal.tsx",
                        lineNumber: 1012,
                        columnNumber: 9
                    }, this)
                ]
            }, k, true, {
                fileName: "[project]/components/ImportCustomersModal.tsx",
                lineNumber: 1010,
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
                                    lineNumber: 1026,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                    onClick: handleClose,
                                    className: "text-gray-400 hover:text-gray-600",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                        className: "fi flex fi-rr-cross text-xl"
                                    }, void 0, false, {
                                        fileName: "[project]/components/ImportCustomersModal.tsx",
                                        lineNumber: 1028,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                    lineNumber: 1027,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/ImportCustomersModal.tsx",
                            lineNumber: 1025,
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
                                            lineNumber: 1033,
                                            columnNumber: 17
                                        }, this),
                                        " Upload a CSV file with customer data."
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                    lineNumber: 1032,
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
                                                        lineNumber: 1039,
                                                        columnNumber: 21
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                                    lineNumber: 1038,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("select", {
                                                    value: selectedOrgId || (user?.isClient ? user.organization_id || "" : ""),
                                                    onChange: (e)=>setSelectedOrgId(e.target.value),
                                                    disabled: !!preselectedOrgId || user?.isClient,
                                                    className: `w-full px-4 py-2.5 text-gray-500 border border-gray-200 rounded-xl text-sm ${preselectedOrgId || user?.isClient ? 'opacity-60 cursor-not-allowed bg-gray-100' : 'bg-gray-50'}`,
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                            value: "",
                                                            children: "Select Organization"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/ImportCustomersModal.tsx",
                                                            lineNumber: 1047,
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
                                                                lineNumber: 1048,
                                                                columnNumber: 47
                                                            }, this))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                                    lineNumber: 1041,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/ImportCustomersModal.tsx",
                                            lineNumber: 1037,
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
                                                        lineNumber: 1053,
                                                        columnNumber: 21
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                                    lineNumber: 1052,
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
                                                            lineNumber: 1061,
                                                            columnNumber: 21
                                                        }, this),
                                                        campaigns.map((camp)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                                value: camp.id,
                                                                children: camp.name
                                                            }, camp.id, false, {
                                                                fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                lineNumber: 1062,
                                                                columnNumber: 44
                                                            }, this))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                                    lineNumber: 1055,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/ImportCustomersModal.tsx",
                                            lineNumber: 1051,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                    lineNumber: 1036,
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
                                            lineNumber: 1068,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                            className: "fi flex fi-rr-upload text-3xl text-gray-400 mb-2 justify-center"
                                        }, void 0, false, {
                                            fileName: "[project]/components/ImportCustomersModal.tsx",
                                            lineNumber: 1069,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                            className: "text-sm text-gray-500",
                                            children: "Click or drag CSV file here"
                                        }, void 0, false, {
                                            fileName: "[project]/components/ImportCustomersModal.tsx",
                                            lineNumber: 1070,
                                            columnNumber: 17
                                        }, this),
                                        importFile && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                            className: "mt-2 text-sm text-[#4b33e8] font-bold",
                                            children: importFile.name
                                        }, void 0, false, {
                                            fileName: "[project]/components/ImportCustomersModal.tsx",
                                            lineNumber: 1071,
                                            columnNumber: 32
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                    lineNumber: 1067,
                                    columnNumber: 15
                                }, this),
                                importError && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "mt-4 p-3 bg-red-50 text-red-600 rounded text-sm",
                                    children: importError
                                }, void 0, false, {
                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                    lineNumber: 1074,
                                    columnNumber: 31
                                }, this),
                                importSuccess && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "mt-4 p-3 bg-green-50 text-green-600 rounded text-sm",
                                    children: importSuccess
                                }, void 0, false, {
                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                    lineNumber: 1075,
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
                                        lineNumber: 1078,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                    lineNumber: 1077,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/ImportCustomersModal.tsx",
                            lineNumber: 1031,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/ImportCustomersModal.tsx",
                    lineNumber: 1024,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/ImportCustomersModal.tsx",
                lineNumber: 1023,
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
                                    lineNumber: 1090,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                    onClick: handleClose,
                                    className: "text-gray-400 hover:text-gray-600",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                        className: "fi flex fi-rr-cross text-xl"
                                    }, void 0, false, {
                                        fileName: "[project]/components/ImportCustomersModal.tsx",
                                        lineNumber: 1092,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                    lineNumber: 1091,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/ImportCustomersModal.tsx",
                            lineNumber: 1089,
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
                                                            lineNumber: 1100,
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
                                                                    lineNumber: 1103,
                                                                    columnNumber: 30
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                                                    htmlFor: `check_${field}`,
                                                                    className: "text-[10px] text-gray-400 cursor-pointer",
                                                                    children: "Show in App"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                    lineNumber: 1110,
                                                                    columnNumber: 30
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/components/ImportCustomersModal.tsx",
                                                            lineNumber: 1102,
                                                            columnNumber: 27
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                                    lineNumber: 1099,
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
                                                                            lineNumber: 1121,
                                                                            columnNumber: 31
                                                                        }, this),
                                                                        field === 'expiry_date' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                                            value: "__CUSTOM_DATE__",
                                                                            className: "font-bold text-[#4b33e8]",
                                                                            children: "✨ Set Custom Date"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                            lineNumber: 1123,
                                                                            columnNumber: 33
                                                                        }, this),
                                                                        csvColumns.filter((col)=>!usedColumns.has(col) || col === fieldMapping[field]).map((col)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                                                value: col,
                                                                                children: col
                                                                            }, col, false, {
                                                                                fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                                lineNumber: 1125,
                                                                                columnNumber: 122
                                                                            }, this))
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                    lineNumber: 1116,
                                                                    columnNumber: 29
                                                                }, this),
                                                                field === 'expiry_date' && fieldMapping[field] === '__CUSTOM_DATE__' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                                                    type: "date",
                                                                    value: customExpiryDate,
                                                                    onChange: (e)=>setCustomExpiryDate(e.target.value),
                                                                    className: "w-full px-3 py-2 bg-[#f0f2ff] border border-[#4b33e8] rounded-lg text-sm text-[#4b33e8] font-bold focus:outline-none focus:ring-1 focus:ring-[#4b33e8] animate-in fade-in slide-in-from-top-1"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                    lineNumber: 1130,
                                                                    columnNumber: 33
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/components/ImportCustomersModal.tsx",
                                                            lineNumber: 1115,
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
                                                                lineNumber: 1143,
                                                                columnNumber: 29
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/ImportCustomersModal.tsx",
                                                            lineNumber: 1138,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                                    lineNumber: 1114,
                                                    columnNumber: 21
                                                }, this),
                                                mergedFields[field] && mergedFields[field].map((val, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: "flex gap-2 mt-1 pl-4 relative",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                className: "absolute left-0 top-1/2 -translate-y-1/2 w-4 h-px bg-gray-300"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                lineNumber: 1149,
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
                                                                        lineNumber: 1155,
                                                                        columnNumber: 33
                                                                    }, this),
                                                                    csvColumns.filter((col)=>!usedColumns.has(col) || col === val).map((col)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                                            value: col,
                                                                            children: col
                                                                        }, col, false, {
                                                                            fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                            lineNumber: 1156,
                                                                            columnNumber: 108
                                                                        }, this))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                lineNumber: 1150,
                                                                columnNumber: 29
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                onClick: ()=>removeMergedField(field, idx),
                                                                className: "p-2 w-9 h-9 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                    className: "fi fi-rr-trash text-xs"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                    lineNumber: 1162,
                                                                    columnNumber: 33
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                lineNumber: 1158,
                                                                columnNumber: 29
                                                            }, this)
                                                        ]
                                                    }, idx, true, {
                                                        fileName: "[project]/components/ImportCustomersModal.tsx",
                                                        lineNumber: 1148,
                                                        columnNumber: 25
                                                    }, this))
                                            ]
                                        }, field, true, {
                                            fileName: "[project]/components/ImportCustomersModal.tsx",
                                            lineNumber: 1098,
                                            columnNumber: 19
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                    lineNumber: 1096,
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
                                                    lineNumber: 1173,
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
                                                            lineNumber: 1178,
                                                            columnNumber: 22
                                                        }, this),
                                                        " Add Field"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                                    lineNumber: 1174,
                                                    columnNumber: 20
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/ImportCustomersModal.tsx",
                                            lineNumber: 1172,
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
                                                                        lineNumber: 1188,
                                                                        columnNumber: 31
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                    lineNumber: 1187,
                                                                    columnNumber: 28
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                                                    placeholder: "Field Name (e.g. Plan Type)",
                                                                    className: "flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#4b33e8]",
                                                                    value: cf.name,
                                                                    onChange: (e)=>updateCustomField(cf.id, "name", e.target.value)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                    lineNumber: 1196,
                                                                    columnNumber: 28
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                    className: "fi fi-rr-arrow-right text-gray-300"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                    lineNumber: 1202,
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
                                                                                    lineNumber: 1209,
                                                                                    columnNumber: 37
                                                                                }, this),
                                                                                csvColumns.filter((col)=>!usedColumns.has(col) || col === cf.mappedTo).map((col)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                                                        value: col,
                                                                                        children: col
                                                                                    }, col, false, {
                                                                                        fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                                        lineNumber: 1211,
                                                                                        columnNumber: 39
                                                                                    }, this))
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                            lineNumber: 1204,
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
                                                                                lineNumber: 1219,
                                                                                columnNumber: 35
                                                                            }, this)
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                            lineNumber: 1214,
                                                                            columnNumber: 32
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                    lineNumber: 1203,
                                                                    columnNumber: 28
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                    onClick: ()=>removeCustomField(cf.id),
                                                                    className: "p-2 w-9 h-9 flex items-center justify-center rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors flex-shrink-0",
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                        className: "fi flex fi-rr-trash text-sm"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                        lineNumber: 1226,
                                                                        columnNumber: 30
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                    lineNumber: 1222,
                                                                    columnNumber: 28
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/components/ImportCustomersModal.tsx",
                                                            lineNumber: 1186,
                                                            columnNumber: 25
                                                        }, this),
                                                        mergedFields[cf.id] && mergedFields[cf.id].map((val, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                className: "flex gap-2 pl-[calc(2rem_+_1px)] relative",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                        className: "absolute left-[1rem] top-1/2 -translate-y-1/2 w-4 h-px bg-gray-300"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                        lineNumber: 1232,
                                                                        columnNumber: 33
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                        className: "flex-1"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                        lineNumber: 1233,
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
                                                                                        lineNumber: 1240,
                                                                                        columnNumber: 42
                                                                                    }, this),
                                                                                    csvColumns.filter((col)=>!usedColumns.has(col) || col === val).map((col)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                                                            value: col,
                                                                                            children: col
                                                                                        }, col, false, {
                                                                                            fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                                            lineNumber: 1241,
                                                                                            columnNumber: 117
                                                                                        }, this))
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                                lineNumber: 1235,
                                                                                columnNumber: 38
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                                onClick: ()=>removeMergedField(cf.id, idx),
                                                                                className: "p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors flex-shrink-0",
                                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                                    className: "fi fi-rr-trash text-xs"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                                    lineNumber: 1247,
                                                                                    columnNumber: 42
                                                                                }, this)
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                                lineNumber: 1243,
                                                                                columnNumber: 38
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                className: "w-8"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                                lineNumber: 1249,
                                                                                columnNumber: 38
                                                                            }, this),
                                                                            " "
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                        lineNumber: 1234,
                                                                        columnNumber: 33
                                                                    }, this)
                                                                ]
                                                            }, idx, true, {
                                                                fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                lineNumber: 1231,
                                                                columnNumber: 29
                                                            }, this))
                                                    ]
                                                }, cf.id, true, {
                                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                                    lineNumber: 1185,
                                                    columnNumber: 23
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/components/ImportCustomersModal.tsx",
                                            lineNumber: 1183,
                                            columnNumber: 19
                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "text-sm text-gray-400 italic text-center py-2 bg-gray-50 rounded-lg border border-dashed border-gray-200",
                                            children: "No custom fields added"
                                        }, void 0, false, {
                                            fileName: "[project]/components/ImportCustomersModal.tsx",
                                            lineNumber: 1257,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                    lineNumber: 1171,
                                    columnNumber: 15
                                }, this),
                                importError && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "mb-4 p-3 bg-red-50 text-red-600 rounded text-sm",
                                    children: importError
                                }, void 0, false, {
                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                    lineNumber: 1263,
                                    columnNumber: 31
                                }, this),
                                importSuccess && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "mb-4 p-3 bg-green-50 text-green-600 rounded text-sm",
                                    children: importSuccess
                                }, void 0, false, {
                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                    lineNumber: 1264,
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
                                            lineNumber: 1267,
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
                                                        lineNumber: 1275,
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
                                                        lineNumber: 1277,
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
                                                        lineNumber: 1279,
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
                                            lineNumber: 1269,
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
                                                        lineNumber: 1290,
                                                        columnNumber: 40
                                                    }, this),
                                                    " Verifying..."
                                                ]
                                            }, void 0, true) : "Verify File Data"
                                        }, void 0, false, {
                                            fileName: "[project]/components/ImportCustomersModal.tsx",
                                            lineNumber: 1285,
                                            columnNumber: 21
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                    lineNumber: 1266,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/ImportCustomersModal.tsx",
                            lineNumber: 1095,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/ImportCustomersModal.tsx",
                    lineNumber: 1088,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/ImportCustomersModal.tsx",
                lineNumber: 1087,
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
                                                lineNumber: 1308,
                                                columnNumber: 28
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/components/ImportCustomersModal.tsx",
                                            lineNumber: 1307,
                                            columnNumber: 25
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                className: "fi flex fi-rr-copy-alt text-sm"
                                            }, void 0, false, {
                                                fileName: "[project]/components/ImportCustomersModal.tsx",
                                                lineNumber: 1316,
                                                columnNumber: 28
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/components/ImportCustomersModal.tsx",
                                            lineNumber: 1315,
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
                                                    lineNumber: 1319,
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
                                                            lineNumber: 1321,
                                                            columnNumber: 29
                                                        }, this),
                                                        " repeating numbers found in this CSV ",
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                            className: "text-gray-300 mx-1",
                                                            children: "|"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/ImportCustomersModal.tsx",
                                                            lineNumber: 1321,
                                                            columnNumber: 139
                                                        }, this),
                                                        " Total Records: ",
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                            className: "text-gray-600 font-bold",
                                                            children: fullyProcessedCustomers.length
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/ImportCustomersModal.tsx",
                                                            lineNumber: 1321,
                                                            columnNumber: 200
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                                    lineNumber: 1320,
                                                    columnNumber: 27
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/ImportCustomersModal.tsx",
                                            lineNumber: 1318,
                                            columnNumber: 25
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                    lineNumber: 1306,
                                    columnNumber: 23
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                    onClick: ()=>setShowFileConflictModal(false),
                                    className: "w-8 h-8 rounded-lg hover:bg-gray-50 flex items-center justify-center text-gray-400 transition-colors",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                        className: "fi flex fi-rr-cross-small text-xl"
                                    }, void 0, false, {
                                        fileName: "[project]/components/ImportCustomersModal.tsx",
                                        lineNumber: 1330,
                                        columnNumber: 25
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                    lineNumber: 1326,
                                    columnNumber: 23
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/ImportCustomersModal.tsx",
                            lineNumber: 1305,
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
                                                                lineNumber: 1341,
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
                                                                lineNumber: 1347,
                                                                columnNumber: 39
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/ImportCustomersModal.tsx",
                                                        lineNumber: 1340,
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
                                                                lineNumber: 1350,
                                                                columnNumber: 38
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                className: "h-4 w-px bg-gray-200"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                lineNumber: 1351,
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
                                                                        lineNumber: 1356,
                                                                        columnNumber: 41
                                                                    }, this),
                                                                    " Merge All"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                lineNumber: 1352,
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
                                                                        lineNumber: 1362,
                                                                        columnNumber: 41
                                                                    }, this),
                                                                    " Reject"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                lineNumber: 1358,
                                                                columnNumber: 38
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/ImportCustomersModal.tsx",
                                                        lineNumber: 1349,
                                                        columnNumber: 35
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/ImportCustomersModal.tsx",
                                                lineNumber: 1339,
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
                                                                    lineNumber: 1370,
                                                                    columnNumber: 43
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                                    className: "px-3 py-3 w-[45%]",
                                                                    children: "Mapped Details"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                    lineNumber: 1371,
                                                                    columnNumber: 43
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                                    className: "px-3 py-3 w-[15%]",
                                                                    children: "Row Index"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                    lineNumber: 1372,
                                                                    columnNumber: 43
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                                    className: "px-5 py-3 w-[15%] text-right",
                                                                    children: "Status"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                    lineNumber: 1373,
                                                                    columnNumber: 43
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/components/ImportCustomersModal.tsx",
                                                            lineNumber: 1369,
                                                            columnNumber: 39
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/ImportCustomersModal.tsx",
                                                        lineNumber: 1368,
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
                                                                                lineNumber: 1380,
                                                                                columnNumber: 51
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                className: "text-[10px] text-indigo-500 font-bold mt-1 tracking-tight",
                                                                                children: rec.display_phone || 'N/A'
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                                lineNumber: 1381,
                                                                                columnNumber: 51
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                        lineNumber: 1379,
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
                                                                                            lineNumber: 1391,
                                                                                            columnNumber: 63
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                            className: "text-[10px] text-slate-700 font-semibold truncate",
                                                                                            children: String(v) || '—'
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                                            lineNumber: 1394,
                                                                                            columnNumber: 63
                                                                                        }, this)
                                                                                    ]
                                                                                }, k, true, {
                                                                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                                    lineNumber: 1390,
                                                                                    columnNumber: 59
                                                                                }, this))
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                            lineNumber: 1386,
                                                                            columnNumber: 51
                                                                        }, this)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                        lineNumber: 1385,
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
                                                                                    lineNumber: 1403,
                                                                                    columnNumber: 53
                                                                                }, this)
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                                lineNumber: 1402,
                                                                                columnNumber: 51
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                                className: "text-[8px] text-gray-400 uppercase mt-1",
                                                                                children: "Row Num"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                                lineNumber: 1405,
                                                                                columnNumber: 51
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                        lineNumber: 1401,
                                                                        columnNumber: 47
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                                        className: "px-5 py-4 align-top text-right",
                                                                        children: ridx === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                            className: "text-[9px] font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full border border-emerald-100 uppercase tracking-tighter",
                                                                            children: "PRIMARY"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                            lineNumber: 1409,
                                                                            columnNumber: 55
                                                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                            className: "text-[9px] font-bold text-amber-500 bg-amber-50 px-2 py-1 rounded-full border border-amber-100 uppercase tracking-tighter",
                                                                            children: "DUPLICATE"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                            lineNumber: 1411,
                                                                            columnNumber: 55
                                                                        }, this)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                        lineNumber: 1407,
                                                                        columnNumber: 47
                                                                    }, this)
                                                                ]
                                                            }, ridx, true, {
                                                                fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                lineNumber: 1378,
                                                                columnNumber: 43
                                                            }, this))
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/ImportCustomersModal.tsx",
                                                        lineNumber: 1376,
                                                        columnNumber: 35
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/ImportCustomersModal.tsx",
                                                lineNumber: 1367,
                                                columnNumber: 31
                                            }, this)
                                        ]
                                    }, idx, true, {
                                        fileName: "[project]/components/ImportCustomersModal.tsx",
                                        lineNumber: 1337,
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
                                                lineNumber: 1424,
                                                columnNumber: 93
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                className: "text-[10px] font-medium lowercase",
                                                children: "Please handle these first to proceed."
                                            }, void 0, false, {
                                                fileName: "[project]/components/ImportCustomersModal.tsx",
                                                lineNumber: 1425,
                                                columnNumber: 35
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/ImportCustomersModal.tsx",
                                        lineNumber: 1423,
                                        columnNumber: 31
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                    lineNumber: 1422,
                                    columnNumber: 27
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/ImportCustomersModal.tsx",
                            lineNumber: 1335,
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
                                                    lineNumber: 1435,
                                                    columnNumber: 43
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/ImportCustomersModal.tsx",
                                            lineNumber: 1434,
                                            columnNumber: 25
                                        }, this),
                                        selectedFileConflicts.size > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "flex items-center gap-2 animate-in slide-in-from-left-2 duration-200",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "h-4 w-px bg-gray-200"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                                    lineNumber: 1439,
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
                                                    lineNumber: 1440,
                                                    columnNumber: 33
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                    onClick: handleBulkFileReject,
                                                    className: "px-4 py-1.5 bg-rose-50 text-rose-600 rounded-lg font-bold text-[11px] hover:bg-rose-100 transition-all border border-rose-100",
                                                    children: "Reject Selected"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                                    lineNumber: 1443,
                                                    columnNumber: 33
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                    onClick: handleBulkFileMerge,
                                                    className: "px-4 py-1.5 bg-indigo-600 text-white rounded-lg font-bold text-[11px] hover:bg-slate-900 transition-all shadow-lg shadow-indigo-100",
                                                    children: "Merge Selected"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                                    lineNumber: 1449,
                                                    columnNumber: 33
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/ImportCustomersModal.tsx",
                                            lineNumber: 1438,
                                            columnNumber: 29
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                    lineNumber: 1433,
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
                                        lineNumber: 1459,
                                        columnNumber: 25
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                    lineNumber: 1458,
                                    columnNumber: 23
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/ImportCustomersModal.tsx",
                            lineNumber: 1432,
                            columnNumber: 19
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/ImportCustomersModal.tsx",
                    lineNumber: 1302,
                    columnNumber: 15
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/ImportCustomersModal.tsx",
                lineNumber: 1301,
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
                                                lineNumber: 1480,
                                                columnNumber: 28
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/components/ImportCustomersModal.tsx",
                                            lineNumber: 1479,
                                            columnNumber: 25
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                className: "fi flex fi-rr-database text-sm"
                                            }, void 0, false, {
                                                fileName: "[project]/components/ImportCustomersModal.tsx",
                                                lineNumber: 1488,
                                                columnNumber: 28
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/components/ImportCustomersModal.tsx",
                                            lineNumber: 1487,
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
                                                    lineNumber: 1491,
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
                                                            lineNumber: 1493,
                                                            columnNumber: 38
                                                        }, this),
                                                        " records already exist in CRM (out of ",
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                            className: "text-gray-600",
                                                            children: fullyProcessedCustomers.length
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/ImportCustomersModal.tsx",
                                                            lineNumber: 1493,
                                                            columnNumber: 147
                                                        }, this),
                                                        " total records)"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                                    lineNumber: 1492,
                                                    columnNumber: 28
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/ImportCustomersModal.tsx",
                                            lineNumber: 1490,
                                            columnNumber: 25
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                    lineNumber: 1478,
                                    columnNumber: 23
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                    onClick: ()=>setShowDbConflictModal(false),
                                    className: "w-8 h-8 rounded-lg hover:bg-gray-50 flex items-center justify-center text-gray-400 transition-colors",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                        className: "fi flex fi-rr-cross-small text-xl"
                                    }, void 0, false, {
                                        fileName: "[project]/components/ImportCustomersModal.tsx",
                                        lineNumber: 1502,
                                        columnNumber: 25
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                    lineNumber: 1498,
                                    columnNumber: 23
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/ImportCustomersModal.tsx",
                            lineNumber: 1477,
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
                                                                lineNumber: 1513,
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
                                                                lineNumber: 1519,
                                                                columnNumber: 39
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/ImportCustomersModal.tsx",
                                                        lineNumber: 1512,
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
                                                                        lineNumber: 1522,
                                                                        columnNumber: 101
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                lineNumber: 1522,
                                                                columnNumber: 38
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                className: "h-4 w-px bg-amber-100"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                lineNumber: 1523,
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
                                                                        lineNumber: 1531,
                                                                        columnNumber: 41
                                                                    }, this),
                                                                    " Merge Choice"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                lineNumber: 1524,
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
                                                                        lineNumber: 1540,
                                                                        columnNumber: 41
                                                                    }, this),
                                                                    " Reject New"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                lineNumber: 1533,
                                                                columnNumber: 38
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/ImportCustomersModal.tsx",
                                                        lineNumber: 1521,
                                                        columnNumber: 35
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/ImportCustomersModal.tsx",
                                                lineNumber: 1511,
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
                                                                    lineNumber: 1550,
                                                                    columnNumber: 43
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                lineNumber: 1549,
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
                                                                            lineNumber: 1554,
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
                                                                                            lineNumber: 1560,
                                                                                            columnNumber: 60
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                            className: "text-indigo-600 font-bold",
                                                                                            children: String(v)
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                                            lineNumber: 1561,
                                                                                            columnNumber: 60
                                                                                        }, this)
                                                                                    ]
                                                                                }, k, true, {
                                                                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                                    lineNumber: 1559,
                                                                                    columnNumber: 56
                                                                                }, this))
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                            lineNumber: 1555,
                                                                            columnNumber: 47
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                    lineNumber: 1553,
                                                                    columnNumber: 43
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                lineNumber: 1552,
                                                                columnNumber: 39
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/ImportCustomersModal.tsx",
                                                        lineNumber: 1548,
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
                                                                        lineNumber: 1572,
                                                                        columnNumber: 43
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                        className: "px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full text-[9px] font-bold border border-amber-200 uppercase tracking-tighter",
                                                                        children: "EXISTS IN CRM"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                        lineNumber: 1573,
                                                                        columnNumber: 43
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                lineNumber: 1571,
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
                                                                                    lineNumber: 1580,
                                                                                    columnNumber: 55
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                            lineNumber: 1577,
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
                                                                                                lineNumber: 1594,
                                                                                                columnNumber: 65
                                                                                            }, this),
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                                className: "text-amber-600 font-bold",
                                                                                                children: String(v)
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                                                lineNumber: 1595,
                                                                                                columnNumber: 65
                                                                                            }, this)
                                                                                        ]
                                                                                    }, k, true, {
                                                                                        fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                                        lineNumber: 1593,
                                                                                        columnNumber: 61
                                                                                    }, this));
                                                                            })()
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                            lineNumber: 1583,
                                                                            columnNumber: 47
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                    lineNumber: 1576,
                                                                    columnNumber: 43
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                lineNumber: 1575,
                                                                columnNumber: 39
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/ImportCustomersModal.tsx",
                                                        lineNumber: 1570,
                                                        columnNumber: 35
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/ImportCustomersModal.tsx",
                                                lineNumber: 1546,
                                                columnNumber: 31
                                            }, this)
                                        ]
                                    }, idx, true, {
                                        fileName: "[project]/components/ImportCustomersModal.tsx",
                                        lineNumber: 1509,
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
                                                lineNumber: 1610,
                                                columnNumber: 95
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                className: "text-[10px] font-medium lowercase italic",
                                                children: "Conflict strategy must be chosen for all."
                                            }, void 0, false, {
                                                fileName: "[project]/components/ImportCustomersModal.tsx",
                                                lineNumber: 1611,
                                                columnNumber: 35
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/ImportCustomersModal.tsx",
                                        lineNumber: 1609,
                                        columnNumber: 31
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                    lineNumber: 1608,
                                    columnNumber: 27
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/ImportCustomersModal.tsx",
                            lineNumber: 1507,
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
                                                    lineNumber: 1621,
                                                    columnNumber: 45
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/ImportCustomersModal.tsx",
                                            lineNumber: 1620,
                                            columnNumber: 25
                                        }, this),
                                        selectedDbConflicts.size > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "flex items-center gap-2 animate-in slide-in-from-left-2 duration-200",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "h-4 w-px bg-gray-200"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                                    lineNumber: 1625,
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
                                                    lineNumber: 1626,
                                                    columnNumber: 33
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                    onClick: handleDbSkipSelected,
                                                    className: "px-4 py-1.5 bg-rose-50 text-rose-600 rounded-lg font-bold text-[11px] hover:bg-rose-100 transition-all border border-rose-100",
                                                    children: "Reject Selected"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                                    lineNumber: 1629,
                                                    columnNumber: 33
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                    onClick: handleDbMergeSelected,
                                                    className: "px-4 py-1.5 bg-amber-600 text-white rounded-lg font-bold text-[11px] hover:bg-amber-700 transition-all shadow-lg shadow-amber-100",
                                                    children: "Merge & Update CRM"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                                    lineNumber: 1635,
                                                    columnNumber: 33
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/ImportCustomersModal.tsx",
                                            lineNumber: 1624,
                                            columnNumber: 29
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                    lineNumber: 1619,
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
                                        lineNumber: 1645,
                                        columnNumber: 25
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                    lineNumber: 1644,
                                    columnNumber: 23
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/ImportCustomersModal.tsx",
                            lineNumber: 1618,
                            columnNumber: 19
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/ImportCustomersModal.tsx",
                    lineNumber: 1474,
                    columnNumber: 15
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/ImportCustomersModal.tsx",
                lineNumber: 1473,
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
                                                lineNumber: 1664,
                                                columnNumber: 20
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/components/ImportCustomersModal.tsx",
                                            lineNumber: 1663,
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
                                                    lineNumber: 1667,
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
                                                    lineNumber: 1668,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/ImportCustomersModal.tsx",
                                            lineNumber: 1666,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                    lineNumber: 1662,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                    onClick: ()=>setShowConflictModal(false),
                                    className: "w-10 h-10 rounded-xl hover:bg-white flex items-center justify-center text-gray-400 hover:text-gray-600 transition-all",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                        className: "fi flex fi-rr-cross text-lg"
                                    }, void 0, false, {
                                        fileName: "[project]/components/ImportCustomersModal.tsx",
                                        lineNumber: 1672,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                    lineNumber: 1671,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/ImportCustomersModal.tsx",
                            lineNumber: 1661,
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
                                            lineNumber: 1678,
                                            columnNumber: 18
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                            children: [
                                                "The following customers are already in your database. You can choose to ",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("strong", {
                                                    children: "Merge"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                                    lineNumber: 1679,
                                                    columnNumber: 93
                                                }, this),
                                                " the new information (update existing record) or ",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("strong", {
                                                    children: "Reject"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                                    lineNumber: 1679,
                                                    columnNumber: 164
                                                }, this),
                                                " the new entry (keep existing data)."
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/ImportCustomersModal.tsx",
                                            lineNumber: 1679,
                                            columnNumber: 18
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                    lineNumber: 1677,
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
                                                                lineNumber: 1686,
                                                                columnNumber: 24
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                className: "text-sm font-bold text-slate-700",
                                                                children: "Phone Conflict"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                lineNumber: 1687,
                                                                columnNumber: 24
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/ImportCustomersModal.tsx",
                                                        lineNumber: 1685,
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
                                                        lineNumber: 1689,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/ImportCustomersModal.tsx",
                                                lineNumber: 1684,
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
                                                                        lineNumber: 1695,
                                                                        columnNumber: 25
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                        className: "text-[10px] font-black text-slate-400 uppercase tracking-widest",
                                                                        children: "Existing Record"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                        lineNumber: 1696,
                                                                        columnNumber: 25
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                lineNumber: 1694,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                className: "text-lg font-bold text-slate-900 mb-4",
                                                                children: dup.existing.customer_name || "Unnamed Customer"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                lineNumber: 1698,
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
                                                                        lineNumber: 1701,
                                                                        columnNumber: 60
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                lineNumber: 1699,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/ImportCustomersModal.tsx",
                                                        lineNumber: 1693,
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
                                                                        lineNumber: 1707,
                                                                        columnNumber: 25
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                        className: "text-[10px] font-black text-indigo-600 uppercase tracking-widest",
                                                                        children: "Incoming Row"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                        lineNumber: 1708,
                                                                        columnNumber: 25
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                lineNumber: 1706,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                className: "text-lg font-bold text-slate-900 mb-4",
                                                                children: dup.new.customer_name || "Unnamed Customer"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                lineNumber: 1710,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                className: "space-y-2 p-3 bg-indigo-50/50 rounded-xl border border-indigo-100/50 min-h-[100px]",
                                                                children: renderDetailsPreview(dup.new.customer_details)
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                lineNumber: 1711,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/ImportCustomersModal.tsx",
                                                        lineNumber: 1705,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/ImportCustomersModal.tsx",
                                                lineNumber: 1691,
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
                                                        lineNumber: 1717,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                        onClick: ()=>handleMergeDuplicate(dup),
                                                        className: "px-6 py-2 rounded-xl text-xs font-bold bg-indigo-600 text-white hover:bg-slate-900 transition-all shadow-lg shadow-indigo-200 active:scale-95",
                                                        children: "Merge & Update"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/ImportCustomersModal.tsx",
                                                        lineNumber: 1723,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/ImportCustomersModal.tsx",
                                                lineNumber: 1716,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, idx, true, {
                                        fileName: "[project]/components/ImportCustomersModal.tsx",
                                        lineNumber: 1683,
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
                                            lineNumber: 1734,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                            className: "text-xs text-slate-300 mt-1",
                                            children: "Please resolve the visible items to see more."
                                        }, void 0, false, {
                                            fileName: "[project]/components/ImportCustomersModal.tsx",
                                            lineNumber: 1735,
                                            columnNumber: 21
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                    lineNumber: 1733,
                                    columnNumber: 18
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/ImportCustomersModal.tsx",
                            lineNumber: 1676,
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
                                    lineNumber: 1741,
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
                                            lineNumber: 1756,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                            onClick: handleMergeAll,
                                            disabled: importing,
                                            className: "px-6 py-3 bg-indigo-600 text-white rounded-xl text-xs font-bold shadow-xl hover:bg-slate-900 transition-all active:scale-95 disabled:opacity-50",
                                            children: importing ? "Merging..." : `Merge All (${duplicates.length})`
                                        }, void 0, false, {
                                            fileName: "[project]/components/ImportCustomersModal.tsx",
                                            lineNumber: 1758,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                            onClick: ()=>setShowConflictModal(false),
                                            className: "px-8 py-3 bg-slate-200 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-300 transition-all active:scale-95",
                                            children: "Close"
                                        }, void 0, false, {
                                            fileName: "[project]/components/ImportCustomersModal.tsx",
                                            lineNumber: 1766,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                    lineNumber: 1755,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/ImportCustomersModal.tsx",
                            lineNumber: 1740,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/ImportCustomersModal.tsx",
                    lineNumber: 1660,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/ImportCustomersModal.tsx",
                lineNumber: 1659,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true);
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/components/AddCustomerModal.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "default",
    ()=>AddCustomerModal
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabase.ts [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$phoneUtils$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/phoneUtils.ts [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$UserContext$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/context/UserContext.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$monitoring$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/monitoring.ts [ssr] (ecmascript)");
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
function AddCustomerModal({ show, onClose, onSuccess, preselectedOrgId = "", preselectedCampaignId = "" }) {
    const { user } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$UserContext$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["useUser"])();
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])("");
    const [success, setSuccess] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])("");
    const [formData, setFormData] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])({
        name: "",
        phone: "",
        expiry_date: "",
        organization_id: preselectedOrgId,
        campaign_id: preselectedCampaignId
    });
    const [customFields, setCustomFields] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])([]);
    const [organizations, setOrganizations] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])([]);
    const [campaigns, setCampaigns] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])([]);
    const [showCalendar, setShowCalendar] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const calendarRef = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useRef"])(null);
    const [expiryRaw, setExpiryRaw] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])("");
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        const handleClickOutside = (event)=>{
            if (calendarRef.current && !calendarRef.current.contains(event.target)) {
                setShowCalendar(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return ()=>document.removeEventListener("mousedown", handleClickOutside);
    }, []);
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        if (formData.expiry_date) {
            setExpiryRaw(formData.expiry_date.split('-').reverse().join('/'));
        } else if (!show) {
            setExpiryRaw("");
        }
    }, [
        formData.expiry_date,
        show
    ]);
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        if (show) {
            fetchOrganizations();
            // Handle client-side organization locking
            if (user?.isClient && user.organization_id) {
                setFormData((prev)=>({
                        ...prev,
                        organization_id: user.organization_id || ""
                    }));
            } else {
                // Reset form if opening fresh for non-clients
                if (!preselectedOrgId) setFormData((prev)=>({
                        ...prev,
                        organization_id: ""
                    }));
            }
            if (!preselectedCampaignId) setFormData((prev)=>({
                    ...prev,
                    campaign_id: ""
                }));
            if (formData.organization_id || user?.isClient && user.organization_id) {
                fetchCampaigns(formData.organization_id || user?.organization_id || "");
            }
        }
    }, [
        show,
        preselectedOrgId,
        preselectedCampaignId
    ]);
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        if (formData.organization_id) {
            fetchCampaigns(formData.organization_id);
        } else {
            setCampaigns([]);
        }
    }, [
        formData.organization_id
    ]);
    const fetchOrganizations = async ()=>{
        const { data } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from("organizations").select("id, company_name, org_code").eq("is_active", true).order("company_name");
        if (data) setOrganizations(data);
    };
    const fetchCampaigns = async (orgId)=>{
        const { data } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from("campaigns").select("id, name").eq("organization_id", orgId).eq("status", "active").order("name");
        if (data) setCampaigns(data);
    };
    const handleClose = ()=>{
        setFormData({
            name: "",
            phone: "",
            expiry_date: "",
            organization_id: preselectedOrgId,
            campaign_id: preselectedCampaignId
        });
        setCustomFields([]);
        setError("");
        setSuccess("");
        onClose();
    };
    const addCustomField = ()=>{
        setCustomFields([
            ...customFields,
            {
                id: Date.now().toString(),
                name: "",
                value: "",
                showInApp: true
            }
        ]);
    };
    const removeCustomField = (id)=>{
        setCustomFields(customFields.filter((f)=>f.id !== id));
    };
    const updateCustomField = (id, key, val)=>{
        setCustomFields(customFields.map((f)=>f.id === id ? {
                ...f,
                [key]: val
            } : f));
    };
    const generateLeadId = ()=>{
        return `LEAD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    };
    const handleSubmit = async (e)=>{
        e.preventDefault();
        if (!formData.name || !formData.phone || !formData.organization_id) {
            setError("Please fill in Name, Phone, and Organization.");
            return;
        }
        setLoading(true);
        setError("");
        setSuccess("");
        try {
            // Check for duplicates
            const phoneHash = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$phoneUtils$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["computePhoneHash"])(formData.phone);
            const { data: existing } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from("customers").select("id").eq("phone_search_hash", phoneHash).single();
            if (existing) {
                setError("A customer with this phone number already exists.");
                setLoading(false);
                return;
            }
            // Construct customer details JSON
            const customerDetails = {};
            customFields.forEach((cf)=>{
                if (cf.name && cf.value) {
                    const suffix = cf.showInApp ? "_checked" : "_unchecked";
                    customerDetails[`${cf.name}${suffix}`] = cf.value.trim();
                }
            });
            const customerData = {
                lead_id: generateLeadId(),
                customer_name: formData.name,
                phone_no: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$phoneUtils$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["encryptPhone"])(formData.phone),
                phone_search_hash: phoneHash,
                expiry_date: formData.expiry_date || null,
                organization_id: formData.organization_id,
                campaign_id: formData.campaign_id || null,
                status: "active",
                customer_details: Object.keys(customerDetails).length > 0 ? JSON.stringify({
                    active_details: "details-1",
                    history: {
                        "details-1": customerDetails
                    }
                }) : null
            };
            const { error: insertError } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from("customers").insert(customerData);
            if (insertError) throw insertError;
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$monitoring$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["logSystemEvent"])({
                event_type: 'WRITE',
                description: `Add Customer: ${formData.name} created manually`,
                metadata: {
                    customer_id: customerData.lead_id,
                    customer_name: formData.name
                },
                payload_size: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$monitoring$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["estimateSize"])(customerData),
                user_name: user?.displayName || 'Admin',
                organization_id: user?.organization_id || undefined
            });
            setSuccess("Customer added successfully!");
            if (onSuccess) onSuccess();
            setTimeout(handleClose, 1500);
        } catch (err) {
            setError(err.message || "Failed to add customer");
        } finally{
            setLoading(false);
        }
    };
    // Tiny Custom Calendar Picker Helper
    const daysInMonth = (year, month)=>new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = (year, month)=>new Date(year, month, 1).getDay();
    const [calMonth, setCalMonth] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(new Date().getMonth());
    const [calYear, setCalYear] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(new Date().getFullYear());
    if (!show) return null;
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
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        className: "fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-[110] p-4 text-xs font-sans",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
            className: "bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col border border-gray-100",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: "px-5 py-4 border-b border-gray-100 flex items-center justify-between",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                                    className: "font-bold text-gray-800",
                                    children: "Add Single Customer"
                                }, void 0, false, {
                                    fileName: "[project]/components/AddCustomerModal.tsx",
                                    lineNumber: 229,
                                    columnNumber: 14
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                    className: "px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded text-[10px] font-bold uppercase tracking-widest border border-indigo-100",
                                    children: "Manual Entry"
                                }, void 0, false, {
                                    fileName: "[project]/components/AddCustomerModal.tsx",
                                    lineNumber: 230,
                                    columnNumber: 14
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/AddCustomerModal.tsx",
                            lineNumber: 228,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                            onClick: handleClose,
                            className: "text-gray-400 hover:text-gray-600 p-1",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                className: "fi fi-rr-cross-small text-xl leading-none"
                            }, void 0, false, {
                                fileName: "[project]/components/AddCustomerModal.tsx",
                                lineNumber: 233,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/AddCustomerModal.tsx",
                            lineNumber: 232,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/AddCustomerModal.tsx",
                    lineNumber: 227,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("form", {
                    onSubmit: handleSubmit,
                    className: "flex-1 overflow-y-auto p-6 space-y-5 custom-scrollbar",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "grid grid-cols-1 md:grid-cols-2 gap-5",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "space-y-1.5",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                            className: "text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-0.5",
                                            children: "Customer Name *"
                                        }, void 0, false, {
                                            fileName: "[project]/components/AddCustomerModal.tsx",
                                            lineNumber: 240,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                            type: "text",
                                            required: true,
                                            value: formData.name,
                                            onChange: (e)=>setFormData({
                                                    ...formData,
                                                    name: e.target.value
                                                }),
                                            placeholder: "Full Name",
                                            className: "w-full h-9 px-3 bg-white border border-gray-200 rounded text-[11px] font-medium text-gray-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all font-sans"
                                        }, void 0, false, {
                                            fileName: "[project]/components/AddCustomerModal.tsx",
                                            lineNumber: 241,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/AddCustomerModal.tsx",
                                    lineNumber: 239,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "space-y-1.5",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                            className: "text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-0.5",
                                            children: "Phone Number *"
                                        }, void 0, false, {
                                            fileName: "[project]/components/AddCustomerModal.tsx",
                                            lineNumber: 251,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                            type: "tel",
                                            required: true,
                                            value: formData.phone,
                                            onChange: (e)=>setFormData({
                                                    ...formData,
                                                    phone: e.target.value
                                                }),
                                            placeholder: "e.g. 9876543210",
                                            className: "w-full h-9 px-3 bg-white border border-gray-200 rounded text-[11px] font-medium text-gray-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all font-sans"
                                        }, void 0, false, {
                                            fileName: "[project]/components/AddCustomerModal.tsx",
                                            lineNumber: 252,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/AddCustomerModal.tsx",
                                    lineNumber: 250,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "space-y-1.5 relative",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                            className: "text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-0.5",
                                            children: "Expiry Date (DD/MM/YYYY)"
                                        }, void 0, false, {
                                            fileName: "[project]/components/AddCustomerModal.tsx",
                                            lineNumber: 262,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "relative",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                                    type: "text",
                                                    value: expiryRaw,
                                                    onChange: (e)=>{
                                                        const val = e.target.value.replace(/\D/g, "").substring(0, 8);
                                                        setExpiryRaw(val.replace(/^(\d{2})(\d{2})(\d{4})$/, "$1/$2/$3").replace(/^(\d{2})(\d{2})$/, "$1/$2").replace(/^(\d{2})$/, "$1"));
                                                        // If fully typed, update internal state
                                                        if (val.length === 8) {
                                                            const d = val.substring(0, 2);
                                                            const m = val.substring(2, 4);
                                                            const y = val.substring(4, 8);
                                                            setFormData((prev)=>({
                                                                    ...prev,
                                                                    expiry_date: `${y}-${m}-${d}`
                                                                }));
                                                        } else {
                                                            setFormData((prev)=>({
                                                                    ...prev,
                                                                    expiry_date: ""
                                                                }));
                                                        }
                                                    },
                                                    placeholder: "DD/MM/YYYY",
                                                    className: "w-full h-9 px-3 bg-white border border-gray-200 rounded text-[11px] font-medium text-gray-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all font-sans"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/AddCustomerModal.tsx",
                                                    lineNumber: 264,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                    type: "button",
                                                    onClick: ()=>setShowCalendar(!showCalendar),
                                                    className: "absolute right-3 top-1/2 -translate-y-1/2 text-indigo-500 hover:text-indigo-600 p-1",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                        className: "fi flex fi-rr-calendar"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/AddCustomerModal.tsx",
                                                        lineNumber: 291,
                                                        columnNumber: 21
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/components/AddCustomerModal.tsx",
                                                    lineNumber: 286,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/AddCustomerModal.tsx",
                                            lineNumber: 263,
                                            columnNumber: 15
                                        }, this),
                                        showCalendar && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            ref: calendarRef,
                                            className: "absolute top-full mt-2 left-0 z-50 bg-white rounded-lg shadow-2xl border border-gray-100 p-4 w-64 animate-in fade-in slide-in-from-top-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center justify-between mb-4",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                            type: "button",
                                                            onClick: ()=>{
                                                                if (calMonth === 0) {
                                                                    setCalMonth(11);
                                                                    setCalYear((prev)=>prev - 1);
                                                                } else setCalMonth((prev)=>prev - 1);
                                                            },
                                                            className: "w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                className: "fi flex fi-rr-angle-left"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/AddCustomerModal.tsx",
                                                                lineNumber: 300,
                                                                columnNumber: 25
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/AddCustomerModal.tsx",
                                                            lineNumber: 299,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: "text-[11px] font-bold text-gray-800",
                                                            children: [
                                                                months[calMonth],
                                                                " ",
                                                                calYear
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/components/AddCustomerModal.tsx",
                                                            lineNumber: 302,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                            type: "button",
                                                            onClick: ()=>{
                                                                if (calMonth === 11) {
                                                                    setCalMonth(0);
                                                                    setCalYear((prev)=>prev + 1);
                                                                } else setCalMonth((prev)=>prev + 1);
                                                            },
                                                            className: "w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                className: "fi flex fi-rr-angle-right"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/AddCustomerModal.tsx",
                                                                lineNumber: 304,
                                                                columnNumber: 25
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/AddCustomerModal.tsx",
                                                            lineNumber: 303,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/AddCustomerModal.tsx",
                                                    lineNumber: 298,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "grid grid-cols-7 text-center mb-2",
                                                    children: [
                                                        'S',
                                                        'M',
                                                        'T',
                                                        'W',
                                                        'T',
                                                        'F',
                                                        'S'
                                                    ].map((d)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: "text-[9px] font-bold text-gray-300 uppercase",
                                                            children: d
                                                        }, d, false, {
                                                            fileName: "[project]/components/AddCustomerModal.tsx",
                                                            lineNumber: 308,
                                                            columnNumber: 66
                                                        }, this))
                                                }, void 0, false, {
                                                    fileName: "[project]/components/AddCustomerModal.tsx",
                                                    lineNumber: 307,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "grid grid-cols-7 gap-1",
                                                    children: [
                                                        Array.from({
                                                            length: firstDayOfMonth(calYear, calMonth)
                                                        }).map((_, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {}, `empty-${i}`, false, {
                                                                fileName: "[project]/components/AddCustomerModal.tsx",
                                                                lineNumber: 311,
                                                                columnNumber: 95
                                                            }, this)),
                                                        Array.from({
                                                            length: daysInMonth(calYear, calMonth)
                                                        }).map((_, i)=>{
                                                            const day = i + 1;
                                                            const isSelected = formData.expiry_date === `${calYear}-${String(calMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                type: "button",
                                                                onClick: ()=>{
                                                                    const d = String(day).padStart(2, '0');
                                                                    const m = String(calMonth + 1).padStart(2, '0');
                                                                    const y = String(calYear);
                                                                    setFormData({
                                                                        ...formData,
                                                                        expiry_date: `${y}-${m}-${d}`
                                                                    });
                                                                    setExpiryRaw(`${d}/${m}/${y}`);
                                                                    setShowCalendar(false);
                                                                },
                                                                className: `w-7 h-7 rounded text-[10px] font-bold transition-all ${isSelected ? 'bg-indigo-600 text-white shadow-md' : 'hover:bg-indigo-50 text-gray-600'}`,
                                                                children: day
                                                            }, day, false, {
                                                                fileName: "[project]/components/AddCustomerModal.tsx",
                                                                lineNumber: 316,
                                                                columnNumber: 25
                                                            }, this);
                                                        })
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/AddCustomerModal.tsx",
                                                    lineNumber: 310,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/AddCustomerModal.tsx",
                                            lineNumber: 297,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/AddCustomerModal.tsx",
                                    lineNumber: 261,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "space-y-1.5",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                            className: "text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-0.5",
                                            children: "Organization *"
                                        }, void 0, false, {
                                            fileName: "[project]/components/AddCustomerModal.tsx",
                                            lineNumber: 338,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("select", {
                                            required: true,
                                            value: formData.organization_id,
                                            disabled: user?.isClient,
                                            onChange: (e)=>setFormData({
                                                    ...formData,
                                                    organization_id: e.target.value,
                                                    campaign_id: ""
                                                }),
                                            className: `w-full h-9 px-3 border border-gray-200 rounded text-[11px] font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all font-sans ${user?.isClient ? 'bg-gray-100 cursor-not-allowed text-gray-400' : 'bg-white text-gray-700'}`,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                    value: "",
                                                    children: "Select Organization"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/AddCustomerModal.tsx",
                                                    lineNumber: 346,
                                                    columnNumber: 17
                                                }, this),
                                                organizations.map((org)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                        value: org.id,
                                                        children: org.company_name
                                                    }, org.id, false, {
                                                        fileName: "[project]/components/AddCustomerModal.tsx",
                                                        lineNumber: 347,
                                                        columnNumber: 43
                                                    }, this))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/AddCustomerModal.tsx",
                                            lineNumber: 339,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/AddCustomerModal.tsx",
                                    lineNumber: 337,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "space-y-1.5",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                            className: "text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-0.5",
                                            children: "Campaign"
                                        }, void 0, false, {
                                            fileName: "[project]/components/AddCustomerModal.tsx",
                                            lineNumber: 351,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("select", {
                                            value: formData.campaign_id,
                                            onChange: (e)=>setFormData({
                                                    ...formData,
                                                    campaign_id: e.target.value
                                                }),
                                            className: "w-full h-9 px-3 bg-white border border-gray-200 rounded text-[11px] font-medium text-gray-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all font-sans",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                    value: "",
                                                    children: "Select Campaign"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/AddCustomerModal.tsx",
                                                    lineNumber: 357,
                                                    columnNumber: 17
                                                }, this),
                                                campaigns.map((camp)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                        value: camp.id,
                                                        children: camp.name
                                                    }, camp.id, false, {
                                                        fileName: "[project]/components/AddCustomerModal.tsx",
                                                        lineNumber: 358,
                                                        columnNumber: 40
                                                    }, this))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/AddCustomerModal.tsx",
                                            lineNumber: 352,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/AddCustomerModal.tsx",
                                    lineNumber: 350,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/AddCustomerModal.tsx",
                            lineNumber: 238,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "pt-4 border-t border-gray-100",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "flex items-center justify-between mb-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                                            className: "text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-0.5",
                                            children: "Custom Data Fields"
                                        }, void 0, false, {
                                            fileName: "[project]/components/AddCustomerModal.tsx",
                                            lineNumber: 366,
                                            columnNumber: 16
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                            type: "button",
                                            onClick: addCustomField,
                                            className: "px-3 py-1 bg-indigo-50 text-indigo-600 rounded text-[10px] font-bold uppercase tracking-widest hover:bg-indigo-100 transition-colors flex items-center gap-1.5 border border-indigo-100",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                    className: "fi fi-rr-plus"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/AddCustomerModal.tsx",
                                                    lineNumber: 372,
                                                    columnNumber: 19
                                                }, this),
                                                " Add Field"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/AddCustomerModal.tsx",
                                            lineNumber: 367,
                                            columnNumber: 16
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/AddCustomerModal.tsx",
                                    lineNumber: 365,
                                    columnNumber: 13
                                }, this),
                                customFields.length > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "space-y-3",
                                    children: customFields.map((cf)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "flex gap-3 items-center group animate-in slide-in-from-top-2 duration-200",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center",
                                                    title: "Show in Portal",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                                        type: "checkbox",
                                                        checked: cf.showInApp,
                                                        onChange: (e)=>updateCustomField(cf.id, "showInApp", e.target.checked),
                                                        className: "w-3.5 h-3.5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 cursor-pointer"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/AddCustomerModal.tsx",
                                                        lineNumber: 381,
                                                        columnNumber: 27
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/components/AddCustomerModal.tsx",
                                                    lineNumber: 380,
                                                    columnNumber: 24
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                                    placeholder: "Label (e.g. Plan)",
                                                    className: "flex-1 h-8 px-3 bg-white border border-gray-200 rounded text-[11px] font-medium text-gray-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all",
                                                    value: cf.name,
                                                    onChange: (e)=>updateCustomField(cf.id, "name", e.target.value)
                                                }, void 0, false, {
                                                    fileName: "[project]/components/AddCustomerModal.tsx",
                                                    lineNumber: 388,
                                                    columnNumber: 24
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                                    placeholder: "Value",
                                                    className: "flex-[1.5] h-8 px-3 bg-white border border-gray-200 rounded text-[11px] font-medium text-gray-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all",
                                                    value: cf.value,
                                                    onChange: (e)=>updateCustomField(cf.id, "value", e.target.value)
                                                }, void 0, false, {
                                                    fileName: "[project]/components/AddCustomerModal.tsx",
                                                    lineNumber: 394,
                                                    columnNumber: 24
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                    type: "button",
                                                    onClick: ()=>removeCustomField(cf.id),
                                                    className: "p-1.5 text-gray-300 hover:text-rose-500 transition-colors",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                        className: "fi flex fi-rr-trash text-sm"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/AddCustomerModal.tsx",
                                                        lineNumber: 405,
                                                        columnNumber: 26
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/components/AddCustomerModal.tsx",
                                                    lineNumber: 400,
                                                    columnNumber: 24
                                                }, this)
                                            ]
                                        }, cf.id, true, {
                                            fileName: "[project]/components/AddCustomerModal.tsx",
                                            lineNumber: 379,
                                            columnNumber: 21
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/components/AddCustomerModal.tsx",
                                    lineNumber: 377,
                                    columnNumber: 16
                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "text-center py-5 bg-gray-50/50 rounded-lg border border-dashed border-gray-200",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                        className: "text-[10px] text-gray-400 font-bold uppercase tracking-tighter",
                                        children: "No custom fields added yet."
                                    }, void 0, false, {
                                        fileName: "[project]/components/AddCustomerModal.tsx",
                                        lineNumber: 412,
                                        columnNumber: 19
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/AddCustomerModal.tsx",
                                    lineNumber: 411,
                                    columnNumber: 16
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/AddCustomerModal.tsx",
                            lineNumber: 364,
                            columnNumber: 11
                        }, this),
                        error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "p-2.5 bg-rose-50 text-rose-600 rounded font-bold border border-rose-100 text-[11px] animate-in fade-in slide-in-from-bottom-2",
                            children: error
                        }, void 0, false, {
                            fileName: "[project]/components/AddCustomerModal.tsx",
                            lineNumber: 417,
                            columnNumber: 21
                        }, this),
                        success && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "p-2.5 bg-emerald-50 text-emerald-600 rounded font-bold border border-emerald-100 text-[11px] animate-in fade-in slide-in-from-bottom-2",
                            children: success
                        }, void 0, false, {
                            fileName: "[project]/components/AddCustomerModal.tsx",
                            lineNumber: 418,
                            columnNumber: 23
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/AddCustomerModal.tsx",
                    lineNumber: 237,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: "px-5 py-3 border-t border-gray-100 flex items-center justify-between bg-white rounded-b-lg",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                            type: "button",
                            onClick: handleClose,
                            className: "px-4 py-1.5 border border-gray-200 text-gray-600 rounded hover:bg-gray-50 font-semibold transition-all",
                            children: "Cancel"
                        }, void 0, false, {
                            fileName: "[project]/components/AddCustomerModal.tsx",
                            lineNumber: 422,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                            type: "button",
                            onClick: handleSubmit,
                            disabled: loading,
                            className: "px-6 py-1.5 bg-[#4b33e8] text-white rounded font-bold uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-sm shadow-indigo-100 disabled:opacity-50 flex items-center gap-2",
                            children: loading ? "Saving..." : "Create Customer"
                        }, void 0, false, {
                            fileName: "[project]/components/AddCustomerModal.tsx",
                            lineNumber: 423,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/AddCustomerModal.tsx",
                    lineNumber: 421,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/AddCustomerModal.tsx",
            lineNumber: 225,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/AddCustomerModal.tsx",
        lineNumber: 224,
        columnNumber: 5
    }, this);
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/pages/portal/customer.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "default",
    ()=>Customer
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/router.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$head$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/head.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$AppLayout$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/components/AppLayout.tsx [ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$UserContext$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/context/UserContext.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabase.ts [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$monitoring$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/monitoring.ts [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ImportCustomersModal$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ImportCustomersModal.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$AddCustomerModal$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/AddCustomerModal.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$phoneUtils$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/phoneUtils.ts [ssr] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$AppLayout$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ImportCustomersModal$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$AddCustomerModal$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$AppLayout$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ImportCustomersModal$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$AddCustomerModal$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
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
function Customer() {
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const { user, mounted: userLoaded } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$UserContext$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["useUser"])();
    const [mounted, setMounted] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        setMounted(true);
    }, []);
    // Permission Flags Logic
    const permissionFlags = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useMemo"])(()=>{
        // Default: Hide all restricted actions
        const flags = {
            isImportButtonVisible: false,
            isExportButtonVisible: false,
            isAddCustomerButtonVisible: false,
            isChangeOrganizationButtonVisible: false,
            isChangeCampaginButtonVisible: false,
            isChangeAssignedButtonVisible: false,
            isChangeDispostionButtonVisible: false,
            isDeleteButtonVisible: false,
            isCheckBoxVisible: false,
            isDeleteFromLeadButtonVisible: false,
            isMoveFreshButtonVisible: false
        };
        if (!mounted || !user) return flags;
        // Level 1: Client Agent (isClient: true, designation: agent)
        // Only assigned organization and self-assigned leads shown
        // All buttons remain HIDDEN (default false)
        if (user.isClient && (user.designation === 'agent' || !user.designation)) {
            return flags;
        }
        // Level 2: Team Leader (isClient: true, designation: team_leader)
        // Assigned organization and team members' leads shown
        // All buttons remain HIDDEN (default false)
        if (user.isClient && user.designation === 'team_leader') {
            return flags;
        }
        // Level 3: Client Admin (isClient: true, designation: ceo | developer)
        // Assigned organization leads shown (Filtered in fetchCustomers)
        // All buttons VISIBLE
        if (user.isClient && [
            'ceo',
            'developer'
        ].includes(user.designation || '')) {
            return {
                isImportButtonVisible: true,
                isExportButtonVisible: true,
                isAddCustomerButtonVisible: true,
                isChangeOrganizationButtonVisible: true,
                isChangeCampaginButtonVisible: true,
                isChangeAssignedButtonVisible: true,
                isChangeDispostionButtonVisible: true,
                isDeleteButtonVisible: true,
                isCheckBoxVisible: true,
                isDeleteFromLeadButtonVisible: true,
                isMoveFreshButtonVisible: true
            };
        }
        // Level 4: Internal Staff (isClient: false)
        // All leads shown (No hard filters)
        // All buttons VISIBLE
        if (!user.isClient) {
            return {
                isImportButtonVisible: true,
                isExportButtonVisible: true,
                isAddCustomerButtonVisible: true,
                isChangeOrganizationButtonVisible: true,
                isChangeCampaginButtonVisible: true,
                isChangeAssignedButtonVisible: true,
                isChangeDispostionButtonVisible: true,
                isDeleteButtonVisible: true,
                isCheckBoxVisible: true,
                isDeleteFromLeadButtonVisible: true,
                isMoveFreshButtonVisible: true
            };
        }
        return flags;
    }, [
        user,
        mounted
    ]);
    const [activeNav] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])("customer");
    const [allCustomers, setAllCustomers] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])([]);
    const [loadingCustomers, setLoadingCustomers] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(true);
    const [searchQuery, setSearchQuery] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])("");
    const [tempSearchQuery, setTempSearchQuery] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])("");
    const [currentPage, setCurrentPage] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(1);
    const [totalCustomers, setTotalCustomers] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(0);
    const [freshCustomersCount, setFreshCustomersCount] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(0);
    const [pendingFollowUps, setPendingFollowUps] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(0);
    const [upcomingFollowUps, setUpcomingFollowUps] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(0);
    const [overdueFollowUps, setOverdueFollowUps] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(0);
    const [pageSize, setPageSize] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(100);
    const [viewType, setViewType] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])("list");
    const [showImportModal, setShowImportModal] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const [showAddCustomerModal, setShowAddCustomerModal] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const [showCustomerDetailsModal, setShowCustomerDetailsModal] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const [selectedCustomer, setSelectedCustomer] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(null);
    const [viewingDetailsKey, setViewingDetailsKey] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(null);
    const [selectedCustomers, setSelectedCustomers] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(new Set());
    const [isDeleting, setIsDeleting] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const [dataSource, setDataSource] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])("live");
    // Duplicate Modal States
    const [showDuplicateModal, setShowDuplicateModal] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const [duplicateLeads, setDuplicateLeads] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])([]);
    const [loadingDuplicates, setLoadingDuplicates] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const [duplicateDispositionFilter, setDuplicateDispositionFilter] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])("");
    const [duplicateCampaignFilter, setDuplicateCampaignFilter] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])("");
    const [selectedDuplicateLeads, setSelectedDuplicateLeads] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(new Set());
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        if (selectedCustomer?.customer_details) {
            try {
                const data = typeof selectedCustomer.customer_details === 'string' ? JSON.parse(selectedCustomer.customer_details) : selectedCustomer.customer_details;
                if (data?.active_details) {
                    setViewingDetailsKey(data.active_details);
                }
            } catch (e) {}
        }
    }, [
        selectedCustomer
    ]);
    const fetchDuplicates = async ()=>{
        try {
            setLoadingDuplicates(true);
            setShowDuplicateModal(true);
            // 1. Get duplicate summaries from RPC
            const { data: initialData, error: rpcError } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].rpc('get_duplicate_leads');
            if (rpcError) throw rpcError;
            let items = initialData || [];
            if (items.length > 0) {
                // 2. Fetch full records from ALL tables to ensure all fields are present
                const leadIds = items.map((i)=>i.lead_id).filter(Boolean);
                if (leadIds.length > 0) {
                    const [liveRes, rejRes, closedRes] = await Promise.all([
                        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from('customers').select('*').in('lead_id', leadIds),
                        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from('rejected_leads').select('*').in('lead_id', leadIds),
                        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from('closed_deals').select('*').in('lead_id', leadIds)
                    ]);
                    const allFullRecords = [
                        ...liveRes.data || [],
                        ...rejRes.data || [],
                        ...closedRes.data || []
                    ];
                    if (allFullRecords.length > 0) {
                        const recordMap = new Map(allFullRecords.map((r)=>[
                                r.lead_id,
                                r
                            ]));
                        items = items.map((item)=>({
                                ...item,
                                ...recordMap.get(item.lead_id) || {}
                            }));
                    }
                }
                // 3. Resolve Campaign Names
                // Check for campaign_id (UUID) or campaign (often used as name or ID in some tables)
                const campaignIds = [
                    ...new Set(items.map((c)=>c.campaign_id || c.campaign).filter((id)=>id && id.length > 20))
                ];
                let campaignMap = {};
                if (campaignIds.length > 0) {
                    const { data: cData } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from("campaigns").select("id, name").in("id", campaignIds);
                    if (cData) cData.forEach((c)=>{
                        campaignMap[c.id] = c.name;
                    });
                }
                // 4. Resolve Agent Names
                const allUserIds = [
                    ...new Set(items.map((c)=>c.assigned_to || c.agent_id).filter((id)=>id))
                ];
                let userMap = {};
                if (allUserIds.length > 0) {
                    const { data: userData } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from("user_profiles").select("user_id, id, user_name").or(`user_id.in.("${allUserIds.join('","')}"),id.in.("${allUserIds.join('","')}")`);
                    if (userData) {
                        userData.forEach((u)=>{
                            userMap[u.user_id] = u.user_name || "Unknown";
                            userMap[u.id] = u.user_name || "Unknown";
                        });
                    }
                }
                // 5. Final Mapping
                const mappedData = items.map((item)=>{
                    const agentId = item.assigned_to || item.agent_id;
                    const campId = item.campaign_id || item.campaign;
                    // Campaign logic: Use resolved name, or string in 'campaign' field if it's not a UUID
                    let resolvedCampaign = item.campaign_name;
                    if (!resolvedCampaign && campId) {
                        resolvedCampaign = campaignMap[campId] || (campId.length < 20 ? campId : null);
                    }
                    return {
                        ...item,
                        campaign_name: resolvedCampaign || "N/A",
                        assigned_to_name: item.assigned_to_name || (agentId ? userMap[agentId] || "Unknown" : "Unassigned")
                    };
                });
                setDuplicateLeads(mappedData);
            } else {
                setDuplicateLeads([]);
            }
        } catch (err) {
            console.error("Error fetching duplicates:", err);
            alert("Failed to fetch duplicate leads.");
        } finally{
            setLoadingDuplicates(false);
        }
    };
    const handleDeleteDuplicateEntry = async (item)=>{
        // Using lead_id as the primary identifier (e.g., LEAD-1772796342061-975)
        const targetLeadId = item.lead_id;
        if (!targetLeadId) {
            console.error("No Lead ID found for item:", item);
            alert("Error: Could not find Lead ID. Deletion failed.");
            return;
        }
        if (!confirm(`Are you sure you want to delete this specific lead record (${targetLeadId}) for ${item.customer_name}?`)) return;
        try {
            // Determine the correct table based on the item stage
            const table = item.stage === "Live" ? "customers" : item.stage === "Rejected" ? "rejected_leads" : "closed_deals";
            // Attempt to delete. This uses lead_id to ensure the exact business record is removed
            const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from(table).delete().eq("lead_id", targetLeadId);
            if (error) throw error;
            // Update local duplicateLeads state to reflect deletion
            setDuplicateLeads((prev)=>prev.filter((lead)=>!(lead.lead_id === targetLeadId && lead.stage === item.stage)));
            // Also refresh the main customer table if it's currently showing that data source
            fetchCustomers(currentPage);
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$monitoring$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["logSystemEvent"])({
                event_type: 'WRITE',
                description: `Delete Duplicate: Record ${targetLeadId} removed from ${table} for ${item.customer_name}`,
                metadata: {
                    lead_id: targetLeadId,
                    table,
                    customer_name: item.customer_name
                },
                payload_size: 0,
                user_name: user?.displayName || 'Admin',
                organization_id: user?.organization_id || undefined
            });
        } catch (err) {
            console.error("Error deleting duplicate entry:", err);
            alert("Failed to delete entry: " + (err.message || "Unknown error"));
        }
    };
    const filteredDuplicateLeads = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useMemo"])(()=>{
        return duplicateLeads.filter((lead)=>{
            const matchesDisposition = !duplicateDispositionFilter || lead.disposition === duplicateDispositionFilter;
            const matchesCampaign = !duplicateCampaignFilter || lead.campaign_name === duplicateCampaignFilter || lead.campaign_id === duplicateCampaignFilter;
            return matchesDisposition && matchesCampaign;
        });
    }, [
        duplicateLeads,
        duplicateDispositionFilter,
        duplicateCampaignFilter
    ]);
    const handleDeleteMultipleDuplicates = async (items)=>{
        if (items.length === 0) return;
        if (!confirm(`Are you sure you want to delete ${items.length} selected lead(s)?`)) return;
        setLoadingDuplicates(true);
        try {
            // Group by table stage
            const liveItems = items.filter((i)=>i.stage === "Live").map((i)=>i.lead_id);
            const rejectedItems = items.filter((i)=>i.stage === "Rejected").map((i)=>i.lead_id);
            const closedItems = items.filter((i)=>i.stage === "Closed").map((i)=>i.lead_id);
            const deletePromises = [];
            if (liveItems.length > 0) deletePromises.push(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from('customers').delete().in('lead_id', liveItems));
            if (rejectedItems.length > 0) deletePromises.push(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from('rejected_leads').delete().in('lead_id', rejectedItems));
            if (closedItems.length > 0) deletePromises.push(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from('closed_deals').delete().in('lead_id', closedItems));
            const results = await Promise.all(deletePromises);
            const firstError = results.find((r)=>r.error)?.error;
            if (firstError) throw firstError;
            const deletedIds = new Set(items.map((i)=>i.lead_id));
            setDuplicateLeads((prev)=>prev.filter((l)=>!deletedIds.has(l.lead_id)));
            setSelectedDuplicateLeads(new Set());
            await fetchCustomers(currentPage);
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$monitoring$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["logSystemEvent"])({
                event_type: 'WRITE',
                description: `Bulk Delete Duplicates: ${items.length} records removed (${liveItems.length} Live, ${rejectedItems.length} Rejected, ${closedItems.length} Closed)`,
                metadata: {
                    record_count: items.length,
                    live_count: liveItems.length,
                    rejected_count: rejectedItems.length,
                    closed_count: closedItems.length
                },
                payload_size: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$monitoring$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["estimateSize"])(items),
                user_name: user?.displayName || 'Admin',
                organization_id: user?.organization_id || undefined
            });
            alert(`Successfully deleted ${items.length} records.`);
        } catch (err) {
            console.error("Bulk delete error:", err);
            alert("Failed to delete records: " + (err.message || "Unknown error"));
        } finally{
            setLoadingDuplicates(false);
        }
    };
    // Filter Modal States
    const [showFilterModal, setShowFilterModal] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const [filterStats, setFilterStats] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])({
        organizations: [],
        campaigns: [],
        agents: [],
        dispositions: [
            "Not Intrested",
            "Language barrier",
            "DND",
            "Wrong NO",
            "Not Contactable",
            "Call Back",
            "Deal Done"
        ]
    });
    const [filters, setFilters] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])({
        organization: "",
        campaign: "",
        assignedTo: "",
        disposition: "",
        startDate: "",
        endDate: "",
        createdStartDate: "",
        createdEndDate: ""
    });
    // Bulk Action States
    const [showBulkActionModal, setShowBulkActionModal] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const [isUpdatingBulk, setIsUpdatingBulk] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const [bulkUpdates, setBulkUpdates] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])({
        organization_id: "",
        campaign_id: "",
        assigned_to: "",
        disposition: ""
    });
    // Format date safely for SSR (only format on client)
    const formatDate = (dateString)=>{
        if (!mounted || !dateString) return "N/A";
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return "N/A";
            const day = String(date.getDate()).padStart(2, "0");
            const month = String(date.getMonth() + 1).padStart(2, "0");
            const year = date.getFullYear();
            return `${day}/${month}/${year}`;
        } catch (error) {
            return "N/A";
        }
    };
    const fetchCustomers = async (page = currentPage)=>{
        try {
            setLoadingCustomers(true);
            const todayISO = new Date();
            todayISO.setHours(0, 0, 0, 0);
            const table = dataSource === "live" ? "customers" : dataSource === "rejected" ? "rejected_leads" : "closed_deals";
            const dispCol = dataSource === "closed" ? "final_disposition" : "disposition";
            // 1. Fetch Shared Team Members for TL (Re-use in all sub-queries)
            let sharedTeamMemberIds = [];
            if (user?.isClient && user.designation === 'team_leader') {
                const { data: teamData } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from('teams').select('members').eq('leader_id', user.uid).eq('is_active', true);
                if (teamData) {
                    teamData.forEach((team)=>{
                        if (Array.isArray(team.members)) {
                            team.members.forEach((member)=>{
                                if (typeof member === 'string') sharedTeamMemberIds.push(member);
                            });
                        } else if (typeof team.members === 'string') {
                            try {
                                const parsedIds = JSON.parse(team.members);
                                if (Array.isArray(parsedIds)) parsedIds.forEach((id)=>sharedTeamMemberIds.push(String(id)));
                            } catch (e) {}
                        }
                    });
                }
                sharedTeamMemberIds.push(user.uid);
                sharedTeamMemberIds = [
                    ...new Set(sharedTeamMemberIds)
                ];
            }
            // 2. Helper function to apply user filters consistently
            const applyUserFilters = (q)=>{
                if (user?.isClient && (user.designation === 'agent' || !user.designation)) {
                    if (user.organization_id) q = q.eq('organization_id', user.organization_id);
                    if (user.uid) q = q.eq(dataSource === 'live' ? 'assigned_to' : 'agent_id', user.uid);
                } else if (user?.isClient && user.designation === 'team_leader') {
                    if (user.organization_id) q = q.eq('organization_id', user.organization_id);
                    if (sharedTeamMemberIds.length > 0) q = q.in(dataSource === 'live' ? 'assigned_to' : 'agent_id', sharedTeamMemberIds);
                    else q = q.eq(dataSource === 'live' ? 'assigned_to' : 'agent_id', user.uid);
                } else if (user?.isClient && [
                    'ceo',
                    'developer',
                    'manager'
                ].includes(user.designation || '')) {
                    if (user.organization_id) q = q.eq('organization_id', user.organization_id);
                    else q = q.eq('id', '00000000-0000-0000-0000-000000000000');
                }
                return q;
            };
            // 3. Get total count
            let countQuery = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from(table).select("*", {
                count: "exact",
                head: true
            });
            if (searchQuery) {
                countQuery = countQuery.or(`customer_name.ilike.%${searchQuery}%,phone_no.ilike.%${searchQuery}%,lead_id.ilike.%${searchQuery}%,campaign_id.ilike.%${searchQuery}%`);
            }
            countQuery = applyUserFilters(countQuery);
            if (filters.organization) countQuery = countQuery.eq("organization_id", filters.organization);
            if (filters.campaign) countQuery = countQuery.eq("campaign_id", filters.campaign);
            if (filters.assignedTo) {
                if (filters.assignedTo === "unassigned") countQuery = countQuery.is(dataSource === 'live' ? 'assigned_to' : 'agent_id', null);
                else countQuery = countQuery.eq(dataSource === 'live' ? 'assigned_to' : 'agent_id', filters.assignedTo);
            }
            if (filters.disposition) countQuery = countQuery.eq(dispCol, filters.disposition);
            const dateField = "expiry_date";
            if (filters.startDate) countQuery = countQuery.gte(dateField, `${filters.startDate}T00:00:00`);
            if (filters.endDate) countQuery = countQuery.lte(dateField, `${filters.endDate}T23:59:59`);
            const lifecycleDateField = dataSource === "rejected" ? "rejected_at" : dataSource === "closed" ? "closed_at" : "created_at";
            if (filters.createdStartDate) countQuery = countQuery.gte(lifecycleDateField, `${filters.createdStartDate}T00:00:00`);
            if (filters.createdEndDate) countQuery = countQuery.lte(lifecycleDateField, `${filters.createdEndDate}T23:59:59`);
            const { count, error: countError } = await countQuery;
            if (countError) console.error("Error fetching customer count:", countError);
            else setTotalCustomers(count || 0);
            try {
                let pendingQuery = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from(table).select("*", {
                    count: "exact",
                    head: true
                }).eq(dispCol, "Call Back");
                pendingQuery = applyUserFilters(pendingQuery);
                let overdueQuery = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from(table).select("*", {
                    count: "exact",
                    head: true
                }).eq(dispCol, "Call Back").lt("updated_at", todayISO.toISOString());
                overdueQuery = applyUserFilters(overdueQuery);
                let freshCountQuery = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from(table).select("*", {
                    count: "exact",
                    head: true
                });
                if (dataSource === 'live') {
                    freshCountQuery = freshCountQuery.eq("attempt_count", 0).is(dispCol, null);
                } else {
                    freshCountQuery = freshCountQuery.eq('id', '00000000-0000-0000-0000-000000000000');
                }
                freshCountQuery = applyUserFilters(freshCountQuery);
                if (filters.organization) {
                    pendingQuery = pendingQuery.eq("organization_id", filters.organization);
                    overdueQuery = overdueQuery.eq("organization_id", filters.organization);
                    freshCountQuery = freshCountQuery.eq("organization_id", filters.organization);
                }
                if (filters.campaign) {
                    pendingQuery = pendingQuery.eq("campaign_id", filters.campaign);
                    overdueQuery = overdueQuery.eq("campaign_id", filters.campaign);
                    freshCountQuery = freshCountQuery.eq("campaign_id", filters.campaign);
                }
                if (filters.assignedTo) {
                    const agentCol = dataSource === 'live' ? 'assigned_to' : 'agent_id';
                    if (filters.assignedTo === "unassigned") {
                        pendingQuery = pendingQuery.is(agentCol, null);
                        overdueQuery = overdueQuery.is(agentCol, null);
                        freshCountQuery = freshCountQuery.is(agentCol, null);
                    } else {
                        pendingQuery = pendingQuery.eq(agentCol, filters.assignedTo);
                        overdueQuery = overdueQuery.eq(agentCol, filters.assignedTo);
                        freshCountQuery = freshCountQuery.eq(agentCol, filters.assignedTo);
                    }
                }
                if (filters.startDate) {
                    pendingQuery = pendingQuery.gte(dateField, `${filters.startDate}T00:00:00`);
                    overdueQuery = overdueQuery.gte(dateField, `${filters.startDate}T00:00:00`);
                    freshCountQuery = freshCountQuery.gte(dateField, `${filters.startDate}T00:00:00`);
                }
                if (filters.endDate) {
                    pendingQuery = pendingQuery.lte(dateField, `${filters.endDate}T23:59:59`);
                    overdueQuery = overdueQuery.lte(dateField, `${filters.endDate}T23:59:59`);
                    freshCountQuery = freshCountQuery.lte(dateField, `${filters.endDate}T23:59:59`);
                }
                if (filters.createdStartDate) {
                    pendingQuery = pendingQuery.gte(lifecycleDateField, `${filters.createdStartDate}T00:00:00`);
                    overdueQuery = overdueQuery.gte(lifecycleDateField, `${filters.createdStartDate}T00:00:00`);
                    freshCountQuery = freshCountQuery.gte(lifecycleDateField, `${filters.createdStartDate}T00:00:00`);
                }
                if (filters.createdEndDate) {
                    pendingQuery = pendingQuery.lte(lifecycleDateField, `${filters.createdEndDate}T23:59:59`);
                    overdueQuery = overdueQuery.lte(lifecycleDateField, `${filters.createdEndDate}T23:59:59`);
                    freshCountQuery = freshCountQuery.lte(lifecycleDateField, `${filters.createdEndDate}T23:59:59`);
                }
                if (dataSource === "closed") {
                    setPendingFollowUps(0);
                    setOverdueFollowUps(0);
                    setUpcomingFollowUps(0);
                    setFreshCustomersCount(0);
                } else {
                    const [pStats, oStats, fStats] = await Promise.all([
                        pendingQuery,
                        overdueQuery,
                        freshCountQuery
                    ]);
                    setPendingFollowUps(pStats.count || 0);
                    setOverdueFollowUps(oStats.count || 0);
                    setUpcomingFollowUps((pStats.count || 0) - (oStats.count || 0));
                    setFreshCustomersCount(fStats.count || 0);
                }
            } catch (statsErr) {
                console.warn("Follow-up/Fresh stats failed to load:", statsErr);
            }
            // 5. Fetch Main Data
            const orderCol = dataSource === "rejected" ? "rejected_at" : dataSource === "closed" ? "closed_at" : "created_at";
            let query = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from(table).select("*").order(orderCol, {
                ascending: false
            });
            if (searchQuery) {
                let orConditions = `customer_name.ilike.%${searchQuery}%,phone_no.ilike.%${searchQuery}%,lead_id.ilike.%${searchQuery}%,campaign_id.ilike.%${searchQuery}%`;
                if (searchQuery.replace(/\D/g, '').length > 0) {
                    const hash = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$phoneUtils$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["computePhoneHash"])(searchQuery);
                    if (hash) orConditions += `,phone_search_hash.eq.${hash}`;
                }
                query = query.or(orConditions);
            }
            query = applyUserFilters(query);
            if (filters.organization) query = query.eq("organization_id", filters.organization);
            if (filters.campaign) query = query.eq("campaign_id", filters.campaign);
            if (filters.assignedTo) {
                if (filters.assignedTo === "unassigned") query = query.is(dataSource === 'live' ? 'assigned_to' : 'agent_id', null);
                else query = query.eq(dataSource === 'live' ? 'assigned_to' : 'agent_id', filters.assignedTo);
            }
            if (filters.disposition) query = query.eq(dispCol, filters.disposition);
            if (filters.startDate) query = query.gte(dateField, `${filters.startDate}T00:00:00`);
            if (filters.endDate) query = query.lte(dateField, `${filters.endDate}T23:59:59`);
            if (filters.createdStartDate) query = query.gte(lifecycleDateField, `${filters.createdStartDate}T00:00:00`);
            if (filters.createdEndDate) query = query.lte(lifecycleDateField, `${filters.createdEndDate}T23:59:59`);
            let data = null;
            let error = null;
            if (pageSize === "all") {
                let allData = [];
                let hasMore = true;
                let pageIndex = 0;
                const batchSize = 1000;
                while(hasMore){
                    let batchQuery = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from(table).select("*").order(orderCol, {
                        ascending: false
                    });
                    if (searchQuery) {
                        let orConditions = `customer_name.ilike.%${searchQuery}%,phone_no.ilike.%${searchQuery}%,lead_id.ilike.%${searchQuery}%,campaign_id.ilike.%${searchQuery}%`;
                        if (searchQuery.replace(/\D/g, '').length > 0) {
                            const hash = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$phoneUtils$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["computePhoneHash"])(searchQuery);
                            if (hash) orConditions += `,phone_search_hash.eq.${hash}`;
                        }
                        batchQuery = batchQuery.or(orConditions);
                    }
                    batchQuery = applyUserFilters(batchQuery);
                    if (filters.organization) batchQuery = batchQuery.eq("organization_id", filters.organization);
                    if (filters.campaign) batchQuery = batchQuery.eq("campaign_id", filters.campaign);
                    if (filters.assignedTo) {
                        if (filters.assignedTo === "unassigned") batchQuery = batchQuery.is(dataSource === 'live' ? 'assigned_to' : 'agent_id', null);
                        else batchQuery = batchQuery.eq(dataSource === 'live' ? 'assigned_to' : 'agent_id', filters.assignedTo);
                    }
                    if (filters.disposition) batchQuery = batchQuery.eq(dispCol, filters.disposition);
                    if (filters.startDate) batchQuery = batchQuery.gte(dateField, `${filters.startDate}T00:00:00`);
                    if (filters.endDate) batchQuery = batchQuery.lte(dateField, `${filters.endDate}T23:59:59`);
                    if (filters.createdStartDate) batchQuery = batchQuery.gte(lifecycleDateField, `${filters.createdStartDate}T00:00:00`);
                    if (filters.createdEndDate) batchQuery = batchQuery.lte(lifecycleDateField, `${filters.createdEndDate}T23:59:59`);
                    const { data: batch, error: batchError } = await batchQuery.range(pageIndex * batchSize, (pageIndex + 1) * batchSize - 1);
                    if (batchError) {
                        error = batchError;
                        break;
                    }
                    if (batch && batch.length > 0) {
                        allData = [
                            ...allData,
                            ...batch
                        ];
                        if (batch.length < batchSize) hasMore = false;
                        pageIndex++;
                    } else {
                        hasMore = false;
                    }
                }
                data = allData;
            } else {
                const offset = (page - 1) * pageSize;
                const { data: pagedData, error: pagedError } = await query.range(offset, offset + pageSize - 1);
                data = pagedData;
                error = pagedError;
            }
            if (error) {
                console.error("Error fetching customers:", error);
                setAllCustomers([]);
            } else {
                // Fetch related data
                const allUserIds = [
                    ...new Set((data || []).flatMap((c)=>[
                            c.assigned_to || c.agent_id,
                            c.managed_by
                        ]).filter((id)=>id))
                ];
                let userMap = {};
                if (allUserIds.length > 0) {
                    const { data: userData } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from("user_profiles").select("user_id, id, user_name, employee_id").or(`user_id.in.("${allUserIds.join('","')}"),id.in.("${allUserIds.join('","')}")`);
                    if (userData) {
                        userData.forEach((u)=>{
                            const info = {
                                user_name: u.user_name,
                                employee_id: u.employee_id
                            };
                            userMap[u.user_id] = info;
                            userMap[u.id] = info;
                        });
                    }
                }
                const campaignIds = [
                    ...new Set((data || []).map((c)=>c.campaign_id).filter((id)=>id))
                ];
                let campaignMap = {};
                if (campaignIds.length > 0) {
                    const { data: cData } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from("campaigns").select("id, name").in("id", campaignIds);
                    if (cData) cData.forEach((c)=>{
                        campaignMap[c.id] = c.name;
                    });
                }
                const orgIds = [
                    ...new Set((data || []).map((c)=>c.organization_id).filter((id)=>id))
                ];
                let orgMap = {};
                if (orgIds.length > 0) {
                    const { data: oData } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from("organizations").select("id, company_name").in("id", orgIds);
                    if (oData) oData.forEach((o)=>{
                        orgMap[o.id] = o.company_name;
                    });
                }
                // Map data
                const mappedData = (data || []).map((customer)=>({
                        ...customer,
                        assigned_to: customer.assigned_to || customer.agent_id,
                        disposition: customer.disposition || customer.final_disposition || (dataSource === 'closed' ? 'Deal Done' : null),
                        assigned_user_name: userMap[customer.assigned_to || customer.agent_id]?.user_name || null,
                        assigned_employee_id: userMap[customer.assigned_to || customer.agent_id]?.employee_id || null,
                        managed_by_name: customer.managed_by ? userMap[customer.managed_by]?.user_name || "Unknown" : "Self",
                        managed_by_id: customer.managed_by ? userMap[customer.managed_by]?.employee_id || customer.managed_by.slice(0, 8).toUpperCase() : null,
                        campaign_name: customer.campaign_id ? campaignMap[customer.campaign_id] || null : null,
                        organization_name: customer.organization_id ? orgMap[customer.organization_id] || null : null
                    }));
                setAllCustomers(mappedData);
            }
        } catch (err) {
            console.error("Critical error in fetchCustomers:", err);
            setAllCustomers([]);
        } finally{
            setLoadingCustomers(false);
        }
    };
    // Initial fetch on mount or user change - but restricted to prevent focus/tab-switch loops
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        if ((user || userLoaded) && mounted) {
            // Only trigger if we don't have customers yet or it's the first stable mount
            if (allCustomers.length === 0) {
                setCurrentPage(1);
                fetchCustomers(1);
                fetchFilterMetadata();
            }
            setSelectedCustomers(new Set());
            setSearchQuery("");
            setTempSearchQuery("");
            // Initialize filters for clients
            if (user?.isClient && user.organization_id) {
                setFilters((prev)=>({
                        ...prev,
                        organization: user.organization_id || ""
                    }));
                setBulkUpdates((prev)=>({
                        ...prev,
                        organization_id: user.organization_id || ""
                    }));
            }
        }
    }, [
        user?.uid,
        userLoaded,
        mounted
    ]); // Dependency on user?.uid is more stable than the whole user object
    const fetchFilterMetadata = async ()=>{
        try {
            let orgQuery = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from("organizations").select("id, company_name").order("company_name");
            let campQuery = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from("campaigns").select("id, name, organization_id, users").order("name");
            let agentQuery = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from("user_profiles").select("id, user_id, user_name, organization_id").order("user_name");
            if (user?.isClient) {
                if (user.organization_id) {
                    orgQuery = orgQuery.eq('id', user.organization_id);
                    campQuery = campQuery.eq('organization_id', user.organization_id);
                    agentQuery = agentQuery.eq('organization_id', user.organization_id);
                } else {
                    orgQuery = orgQuery.eq('id', '00000000-0000-0000-0000-000000000000');
                    campQuery = campQuery.eq('id', '00000000-0000-0000-0000-000000000000');
                    agentQuery = agentQuery.eq('id', '00000000-0000-0000-0000-000000000000');
                }
            }
            const [{ data: orgs }, { data: camps }, { data: agents }] = await Promise.all([
                orgQuery,
                campQuery,
                agentQuery
            ]);
            setFilterStats((prev)=>({
                    ...prev,
                    organizations: orgs || [],
                    campaigns: camps || [],
                    agents: agents || []
                }));
        } catch (err) {
            console.error("Error fetching filter metadata:", err);
        }
    };
    const handleBulkUpdate = async (updates)=>{
        if (!selectedCustomers.size || Object.keys(updates).length === 0) return;
        setIsUpdatingBulk(true);
        try {
            const ids = Array.from(selectedCustomers);
            // Check for special "Move Fresh" action
            if (updates.action === "Move Fresh") {
                const { error: resetError } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from("customers").update({
                    disposition: null,
                    sub_disposition: null,
                    assigned_to: null,
                    status: "active",
                    last_called_at: null,
                    last_updated_by: null,
                    is_connected: null,
                    attempt_count: 0,
                    last_attempt_at: null,
                    managed_by: null
                }).in("id", ids);
                if (resetError) throw resetError;
            } else {
                // Check for Rejected Disposition move
                const rejectedValue = updates.disposition;
                if (rejectedValue && [
                    "Wrong NO",
                    "DND",
                    "Language barrier"
                ].includes(rejectedValue)) {
                    // 1. Fetch the leads first to move them
                    const { data: leads, error: fetchError } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from("customers").select("*").in("id", ids);
                    if (fetchError) throw fetchError;
                    if (leads && leads.length > 0) {
                        const rejectedLeads = leads.map((lead)=>({
                                customer_id: lead.id,
                                customer_name: lead.customer_name,
                                phone_no: lead.phone_no,
                                phone_search_hash: lead.phone_search_hash || (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$phoneUtils$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["computePhoneHash"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$phoneUtils$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["decryptPhone"])(lead.phone_no)),
                                campaign_id: updates.campaign_id || lead.campaign_id,
                                disposition: updates.disposition || lead.disposition,
                                sub_disposition: lead.sub_disposition,
                                agent_id: updates.assigned_to || lead.assigned_to,
                                rejected_at: new Date().toISOString(),
                                managed_by: lead.managed_by,
                                organization_id: updates.organization_id || lead.organization_id
                            }));
                        // 2. Insert into rejected
                        const { error: insertError } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from("rejected_leads").insert(rejectedLeads);
                        if (insertError) throw insertError;
                        // 3. Delete from customers
                        const { error: deleteError } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from("customers").delete().in("id", ids);
                        if (deleteError) throw deleteError;
                    }
                } else {
                    // Standard bulk update for any fields provided
                    const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from("customers").update(updates).in("id", ids);
                    if (error) throw error;
                }
            }
            setSelectedCustomers(new Set());
            await fetchCustomers(currentPage);
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$monitoring$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["logSystemEvent"])({
                event_type: 'WRITE',
                description: `Bulk Update: Applied changes ${JSON.stringify(updates)} to ${ids.length} records.`,
                metadata: {
                    updates,
                    record_count: ids.length
                },
                payload_size: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$monitoring$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["estimateSize"])({
                    updates,
                    ids
                }),
                user_name: user?.displayName || 'Admin',
                organization_id: user?.organization_id || undefined
            });
            setShowBulkActionModal(false);
            setBulkUpdates({
                organization_id: "",
                campaign_id: "",
                assigned_to: "",
                disposition: ""
            });
        } catch (err) {
            console.error("Error updating customers:", err);
            alert("Failed to update customers. Please try again.");
        } finally{
            setIsUpdatingBulk(false);
        }
    };
    const [isMovingToLive, setIsMovingToLive] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const handleMoveToLive = async ()=>{
        if (!selectedCustomers.size || dataSource !== 'rejected') return;
        setIsMovingToLive(true);
        try {
            const ids = Array.from(selectedCustomers);
            // 1. Fetch from rejected_leads
            const { data: rejectedLeads, error: fetchError } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from("rejected_leads").select("*").in("id", ids);
            if (fetchError) throw fetchError;
            if (rejectedLeads && rejectedLeads.length > 0) {
                // 2. Map back to customers
                const liveCustomers = rejectedLeads.map((lead)=>({
                        id: lead.customer_id,
                        customer_name: lead.customer_name,
                        phone_no: lead.phone_no,
                        phone_search_hash: lead.phone_search_hash,
                        campaign_id: lead.campaign_id,
                        disposition: lead.disposition,
                        sub_disposition: lead.sub_disposition,
                        assigned_to: lead.agent_id,
                        managed_by: lead.managed_by,
                        organization_id: lead.organization_id,
                        status: "active",
                        updated_at: new Date().toISOString()
                    }));
                // 3. Insert into customers
                const { error: insertError } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from("customers").upsert(liveCustomers); // Use upsert in case the record somehow exists
                if (insertError) throw insertError;
                // 4. Delete from rejected_leads
                const { error: deleteError } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from("rejected_leads").delete().in("id", ids);
                if (deleteError) throw deleteError;
            }
            setSelectedCustomers(new Set());
            await fetchCustomers(currentPage);
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$monitoring$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["logSystemEvent"])({
                event_type: 'WRITE',
                description: `Move to Live: ${rejectedLeads?.length || 0} records restored from rejected_leads`,
                metadata: {
                    record_count: rejectedLeads?.length || 0,
                    source: 'rejected_leads',
                    target: 'customers'
                },
                payload_size: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$monitoring$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["estimateSize"])(rejectedLeads),
                user_name: user?.displayName || 'Admin',
                organization_id: user?.organization_id || undefined
            });
            alert(`Successfully moved ${rejectedLeads?.length} lead(s) back to Live.`);
        } catch (err) {
            console.error("Error moving to live:", err);
            alert("Failed to move leads back to live. Please try again.");
        } finally{
            setIsMovingToLive(false);
        }
    };
    const handleExportCustomers = async ()=>{
        if (allCustomers.length === 0) {
            alert("No customers to export.");
            return;
        }
        try {
            // Create CSV content
            const headers = [
                "Lead ID",
                "Name",
                "Phone",
                "Organization",
                "Campaign",
                "Assigned To",
                "Disposition",
                "Created At"
            ];
            const csvData = allCustomers.map((customer)=>[
                    `"${customer.lead_id || ''}"`,
                    `"${customer.customer_name || ''}"`,
                    `"${customer.phone_no || ''}"`,
                    `"${customer.organization_name || ''}"`,
                    `"${customer.campaign_name || ''}"`,
                    `"${customer.assigned_user_name || ''}"`,
                    `"${customer.disposition || ''}"`,
                    `"${customer.created_at || ''}"`
                ]);
            const csvContent = [
                headers,
                ...csvData
            ].map((e)=>e.join(",")).join("\n");
            const blob = new Blob([
                csvContent
            ], {
                type: 'text/csv;charset=utf-8;'
            });
            const link = document.createElement("a");
            const url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", `customers_export_${new Date().toISOString().split('T')[0]}.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$monitoring$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["logSystemEvent"])({
                event_type: 'READ',
                description: `Export Customers: ${allCustomers.length} records exported to CSV`,
                metadata: {
                    record_count: allCustomers.length,
                    format: 'csv'
                },
                payload_size: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$monitoring$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["estimateSize"])(allCustomers),
                user_name: user?.displayName || 'Admin',
                organization_id: user?.organization_id || undefined
            });
        } catch (err) {
            console.error("Error exporting customers:", err);
            alert("Failed to export customers. Please try again.");
        }
    };
    // Fetch customers when page size changes
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        if (mounted) {
            setCurrentPage(1); // Reset to page 1 when page size changes
            fetchCustomers(1);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        pageSize
    ]);
    // Fetch customers when search query changes
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        if (mounted) {
            setCurrentPage(1);
            fetchCustomers(1);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        searchQuery
    ]);
    // Reset search immediately if tempSearchQuery is cleared
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        if (tempSearchQuery === "") {
            setSearchQuery("");
            setCurrentPage(1);
        }
    }, [
        tempSearchQuery
    ]);
    // Fetch customers when page changes (only if not showing all)
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        if (mounted && pageSize !== "all") {
            fetchCustomers(currentPage);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        currentPage
    ]);
    // Use allCustomers directly since it is now filtered by the API
    const filteredCustomers = allCustomers;
    // Calculate pagination
    const effectivePageSize = pageSize === "all" ? totalCustomers : pageSize;
    const totalPages = pageSize === "all" ? 1 : Math.ceil(totalCustomers / pageSize);
    const startIndex = pageSize === "all" ? 1 : (currentPage - 1) * pageSize + 1;
    const endIndex = pageSize === "all" ? totalCustomers : Math.min(currentPage * pageSize, totalCustomers);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$head$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("title", {
                    children: "Customers | TFC Connect"
                }, void 0, false, {
                    fileName: "[project]/pages/portal/customer.tsx",
                    lineNumber: 1022,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/pages/portal/customer.tsx",
                lineNumber: 1021,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "container mx-auto px-3 sm:px-4 md:px-6 py-6 sm:py-8 pb-20 sm:pb-24 lg:pb-8 max-w-7xl",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: "space-y-6 sm:space-y-8",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "mb-6 flex items-start justify-between",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h1", {
                                            className: "text-xl sm:text-2xl md:text-3xl font-bold mb-2",
                                            style: {
                                                color: "#263238",
                                                fontFamily: "'Poppins', sans-serif"
                                            },
                                            children: "Customers"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/portal/customer.tsx",
                                            lineNumber: 1032,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                            className: "text-sm sm:text-base",
                                            style: {
                                                color: "#787E9D",
                                                fontFamily: "'Roboto', sans-serif"
                                            },
                                            children: "View and manage all customers in the system"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/portal/customer.tsx",
                                            lineNumber: 1041,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/portal/customer.tsx",
                                    lineNumber: 1031,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "bg-gray-100/80 backdrop-blur-sm p-1.5 rounded-xl gap-2 flex items-center md:min-w-[300px]",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                            onClick: ()=>{
                                                setDataSource("live");
                                                setFilters((prev)=>({
                                                        ...prev,
                                                        disposition: ""
                                                    }));
                                                setCurrentPage(1);
                                                fetchCustomers(1);
                                            },
                                            className: `flex-1 flex items-center justify-center gap-2 py-2.5 px-3 md:px-4 rounded-xl text-sm font-bold transition-all duration-300 ${dataSource === "live" ? "bg-white text-[#4b33e8] scale-[1.02] shadow-sm" : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50"}`,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                    className: `fi text-base flex ${dataSource === "live" ? "fi-sr-bolt" : "fi-rr-bolt"}`
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/customer.tsx",
                                                    lineNumber: 1067,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                    className: "hidden md:inline",
                                                    children: "Live"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/customer.tsx",
                                                    lineNumber: 1068,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/portal/customer.tsx",
                                            lineNumber: 1054,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                            onClick: ()=>{
                                                setDataSource("rejected");
                                                setFilters((prev)=>({
                                                        ...prev,
                                                        disposition: ""
                                                    }));
                                                setCurrentPage(1);
                                                fetchCustomers(1);
                                            },
                                            className: `flex-1 flex items-center justify-center gap-2 py-2.5 px-3 md:px-4 rounded-xl text-sm font-bold transition-all duration-300 ${dataSource === "rejected" ? "bg-white text-rose-600 scale-[1.02] shadow-sm" : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50"}`,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                    className: `fi text-base flex ${dataSource === "rejected" ? "fi-sr-cross-circle" : "fi-rr-cross-circle"}`
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/customer.tsx",
                                                    lineNumber: 1083,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                    className: "hidden md:inline",
                                                    children: "Rejected"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/customer.tsx",
                                                    lineNumber: 1084,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/portal/customer.tsx",
                                            lineNumber: 1070,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                            onClick: ()=>{
                                                setDataSource("closed");
                                                setFilters((prev)=>({
                                                        ...prev,
                                                        disposition: ""
                                                    }));
                                                setCurrentPage(1);
                                                fetchCustomers(1);
                                            },
                                            className: `flex-1 flex items-center justify-center gap-2 py-2.5 px-3 md:px-4 rounded-xl text-sm font-bold transition-all duration-300 ${dataSource === "closed" ? "bg-white text-emerald-600 scale-[1.02] shadow-sm" : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50"}`,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                    className: `fi text-base flex ${dataSource === "closed" ? "fi-sr-check-circle" : "fi-rr-check-circle"}`
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/customer.tsx",
                                                    lineNumber: 1099,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                    className: "hidden md:inline",
                                                    children: "Closed"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/customer.tsx",
                                                    lineNumber: 1100,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/portal/customer.tsx",
                                            lineNumber: 1086,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/portal/customer.tsx",
                                    lineNumber: 1053,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/pages/portal/customer.tsx",
                            lineNumber: 1030,
                            columnNumber: 15
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "relative overflow-hidden rounded-2xl p-4 sm:p-5 transition-shadow duration-200 flex flex-col hover:shadow-md",
                                    style: {
                                        backgroundColor: "white"
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "absolute inset-0",
                                            style: {
                                                background: "radial-gradient(circle at top right, rgba(75, 51, 232, 0.08), transparent 60%)"
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/pages/portal/customer.tsx",
                                            lineNumber: 1112,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "absolute -bottom-16 -right-16 h-48 w-48 rounded-full bg-purple-100/30 blur-2xl"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/portal/customer.tsx",
                                            lineNumber: 1119,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "absolute top-0 left-0 w-32 h-32 rounded-full bg-purple-200/20 blur-xl"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/portal/customer.tsx",
                                            lineNumber: 1121,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "absolute top-8 right-8 w-16 h-16 rounded-full bg-purple-300/15 blur-lg"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/portal/customer.tsx",
                                            lineNumber: 1122,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "absolute -right-2 -bottom-2 opacity-5",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                className: "fi flex fi-rr-users text-5xl sm:text-6xl",
                                                style: {
                                                    color: "#4b33e8"
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/pages/portal/customer.tsx",
                                                lineNumber: 1125,
                                                columnNumber: 21
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/pages/portal/customer.tsx",
                                            lineNumber: 1124,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "absolute inset-0 opacity-[0.03]",
                                            style: {
                                                backgroundImage: "radial-gradient(circle, #4b33e8 1px, transparent 1px)",
                                                backgroundSize: "20px 20px"
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/pages/portal/customer.tsx",
                                            lineNumber: 1131,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "relative flex flex-col h-full z-10",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "flex items-start justify-between mb-auto",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                            className: "text-xs sm:text-sm font-medium",
                                                            style: {
                                                                color: "#787E9D",
                                                                fontFamily: "'Roboto', sans-serif"
                                                            },
                                                            children: "Total Customer"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/customer.tsx",
                                                            lineNumber: 1141,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: "flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl",
                                                            style: {
                                                                backgroundColor: "transparent"
                                                            },
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                className: "fi flex fi-rr-users text-lg sm:text-xl",
                                                                style: {
                                                                    color: "#4b33e8"
                                                                }
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/customer.tsx",
                                                                lineNumber: 1156,
                                                                columnNumber: 25
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/customer.tsx",
                                                            lineNumber: 1150,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/pages/portal/customer.tsx",
                                                    lineNumber: 1140,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "mt-auto",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                            className: "text-3xl sm:text-4xl font-semibold",
                                                            style: {
                                                                color: "#263238",
                                                                fontFamily: "'Poppins', sans-serif"
                                                            },
                                                            children: totalCustomers
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/customer.tsx",
                                                            lineNumber: 1163,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                            className: "text-xs sm:text-sm mt-1",
                                                            style: {
                                                                color: "#787E9D",
                                                                fontFamily: "'Roboto', sans-serif"
                                                            },
                                                            children: "Total customers"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/customer.tsx",
                                                            lineNumber: 1172,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/pages/portal/customer.tsx",
                                                    lineNumber: 1162,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/portal/customer.tsx",
                                            lineNumber: 1139,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/portal/customer.tsx",
                                    lineNumber: 1108,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "relative overflow-hidden rounded-2xl p-4 sm:p-5 transition-shadow duration-200 flex flex-col hover:shadow-md",
                                    style: {
                                        backgroundColor: "white"
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "absolute inset-0",
                                            style: {
                                                background: "radial-gradient(circle at top right, rgba(16, 185, 129, 0.08), transparent 60%)"
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/pages/portal/customer.tsx",
                                            lineNumber: 1190,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "absolute -bottom-16 -right-16 h-48 w-48 rounded-full bg-green-100/30 blur-2xl"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/portal/customer.tsx",
                                            lineNumber: 1197,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "absolute top-0 left-0 w-32 h-32 rounded-full bg-green-200/20 blur-xl"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/portal/customer.tsx",
                                            lineNumber: 1199,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "absolute top-8 right-8 w-16 h-16 rounded-full bg-green-300/15 blur-lg"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/portal/customer.tsx",
                                            lineNumber: 1200,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "absolute -right-2 -bottom-2 opacity-5",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                className: "fi flex fi-rr-user-add text-5xl sm:text-6xl",
                                                style: {
                                                    color: "#10b981"
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/pages/portal/customer.tsx",
                                                lineNumber: 1203,
                                                columnNumber: 21
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/pages/portal/customer.tsx",
                                            lineNumber: 1202,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "absolute inset-0 opacity-[0.03]",
                                            style: {
                                                backgroundImage: "radial-gradient(circle, #10b981 1px, transparent 1px)",
                                                backgroundSize: "20px 20px"
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/pages/portal/customer.tsx",
                                            lineNumber: 1209,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "relative flex flex-col h-full z-10",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "flex items-start justify-between mb-auto",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                            className: "text-xs sm:text-sm font-medium",
                                                            style: {
                                                                color: "#787E9D",
                                                                fontFamily: "'Roboto', sans-serif"
                                                            },
                                                            children: "Fresh Customers"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/customer.tsx",
                                                            lineNumber: 1219,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: "flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl",
                                                            style: {
                                                                backgroundColor: "transparent"
                                                            },
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                className: "fi flex fi-rr-user-add text-lg sm:text-xl",
                                                                style: {
                                                                    color: "#10b981"
                                                                }
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/customer.tsx",
                                                                lineNumber: 1234,
                                                                columnNumber: 25
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/customer.tsx",
                                                            lineNumber: 1228,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/pages/portal/customer.tsx",
                                                    lineNumber: 1218,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "mt-auto",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                            className: "text-3xl sm:text-4xl font-semibold",
                                                            style: {
                                                                color: "#263238",
                                                                fontFamily: "'Poppins', sans-serif"
                                                            },
                                                            children: freshCustomersCount
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/customer.tsx",
                                                            lineNumber: 1241,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                            className: "text-xs sm:text-sm mt-1",
                                                            style: {
                                                                color: "#787E9D",
                                                                fontFamily: "'Roboto', sans-serif"
                                                            },
                                                            children: "Unassigned leads"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/customer.tsx",
                                                            lineNumber: 1250,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/pages/portal/customer.tsx",
                                                    lineNumber: 1240,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/portal/customer.tsx",
                                            lineNumber: 1217,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/portal/customer.tsx",
                                    lineNumber: 1186,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "relative overflow-hidden rounded-2xl p-4 sm:p-5 transition-all duration-200 backdrop-blur flex flex-col text-white hover:shadow-md",
                                    style: {
                                        backgroundColor: "#4b33e8"
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "absolute inset-0",
                                            style: {
                                                background: "radial-gradient(circle at top left, rgba(255,255,255,0.28), transparent 55%)"
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/pages/portal/customer.tsx",
                                            lineNumber: 1268,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-white/10 blur-3xl"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/portal/customer.tsx",
                                            lineNumber: 1275,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "absolute top-4 left-4 w-24 h-24 rounded-full bg-white/5 blur-xl"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/portal/customer.tsx",
                                            lineNumber: 1277,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "absolute top-12 right-12 w-20 h-20 rounded-full bg-white/8 blur-lg"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/portal/customer.tsx",
                                            lineNumber: 1278,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "absolute -right-2 -bottom-2 opacity-10",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                className: "fi flex fi-rr-calendar-check text-5xl sm:text-6xl text-white"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/portal/customer.tsx",
                                                lineNumber: 1281,
                                                columnNumber: 21
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/pages/portal/customer.tsx",
                                            lineNumber: 1280,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "absolute inset-0 opacity-[0.05]",
                                            style: {
                                                backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)",
                                                backgroundSize: "25px 25px"
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/pages/portal/customer.tsx",
                                            lineNumber: 1284,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "relative flex flex-col h-full z-10",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "flex items-start justify-between mb-auto",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                            className: "text-xs sm:text-sm font-medium",
                                                            style: {
                                                                color: "#ffffff",
                                                                fontFamily: "'Roboto', sans-serif"
                                                            },
                                                            children: "Follow ups"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/customer.tsx",
                                                            lineNumber: 1294,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: "flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl border border-white/30 bg-white/10 backdrop-blur-lg",
                                                            style: {
                                                                color: "#ffffff"
                                                            },
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                className: "fi flex fi-rr-calendar-check text-lg sm:text-xl",
                                                                style: {
                                                                    color: "#ffffff"
                                                                }
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/customer.tsx",
                                                                lineNumber: 1309,
                                                                columnNumber: 25
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/customer.tsx",
                                                            lineNumber: 1303,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/pages/portal/customer.tsx",
                                                    lineNumber: 1293,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "mt-auto",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                            className: "text-3xl sm:text-4xl font-semibold",
                                                            style: {
                                                                color: "#ffffff",
                                                                fontFamily: "'Poppins', sans-serif"
                                                            },
                                                            children: pendingFollowUps
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/customer.tsx",
                                                            lineNumber: 1316,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                            className: "text-xs sm:text-sm mt-1",
                                                            style: {
                                                                color: "rgba(255, 255, 255, 0.8)",
                                                                fontFamily: "'Roboto', sans-serif"
                                                            },
                                                            children: "Pending follow ups"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/customer.tsx",
                                                            lineNumber: 1325,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/pages/portal/customer.tsx",
                                                    lineNumber: 1315,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/portal/customer.tsx",
                                            lineNumber: 1292,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/portal/customer.tsx",
                                    lineNumber: 1264,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "relative p-0 flex flex-col overflow-hidden",
                                    style: {
                                        backgroundColor: "transparent",
                                        border: "none"
                                    },
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "flex flex-col gap-3 h-full",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "relative overflow-hidden flex-1 rounded-xl p-3 transition-shadow duration-200 hover:shadow-md",
                                                style: {
                                                    background: "linear-gradient(135deg, #3b82f6, #2563eb)"
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: "absolute inset-0",
                                                        style: {
                                                            background: "radial-gradient(circle at top left, rgba(255,255,255,0.15), transparent 50%)"
                                                        }
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/customer.tsx",
                                                        lineNumber: 1351,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: "absolute -bottom-12 -right-12 h-32 w-32 rounded-full bg-white/10 blur-2xl"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/customer.tsx",
                                                        lineNumber: 1358,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: "absolute top-2 left-2 w-16 h-16 rounded-full bg-white/8 blur-lg"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/customer.tsx",
                                                        lineNumber: 1360,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: "absolute top-4 right-4 w-12 h-12 rounded-full bg-white/6 blur-md"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/customer.tsx",
                                                        lineNumber: 1361,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: "absolute -right-1 -bottom-1 opacity-10",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                            className: "fi flex fi-rr-clock text-3xl text-white"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/customer.tsx",
                                                            lineNumber: 1364,
                                                            columnNumber: 25
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/customer.tsx",
                                                        lineNumber: 1363,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: "absolute inset-0 opacity-[0.08]",
                                                        style: {
                                                            backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.4) 1px, transparent 1px)",
                                                            backgroundSize: "15px 15px"
                                                        }
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/customer.tsx",
                                                        lineNumber: 1367,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: "relative flex items-start justify-between z-10",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                className: "flex-1",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                        className: "text-xs font-medium mb-1",
                                                                        style: {
                                                                            color: "#ffffff",
                                                                            fontFamily: "'Roboto', sans-serif"
                                                                        },
                                                                        children: "Upcoming follow ups"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/portal/customer.tsx",
                                                                        lineNumber: 1377,
                                                                        columnNumber: 27
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                        className: "text-xl font-bold",
                                                                        style: {
                                                                            color: "#ffffff",
                                                                            fontFamily: "'Poppins', sans-serif"
                                                                        },
                                                                        children: upcomingFollowUps
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/portal/customer.tsx",
                                                                        lineNumber: 1386,
                                                                        columnNumber: 27
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/pages/portal/customer.tsx",
                                                                lineNumber: 1376,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                className: "flex h-8 w-8 items-center justify-center rounded-lg",
                                                                style: {
                                                                    backgroundColor: "transparent"
                                                                },
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                    className: "fi flex fi-rr-clock text-sm",
                                                                    style: {
                                                                        color: "#ffffff"
                                                                    }
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/customer.tsx",
                                                                    lineNumber: 1402,
                                                                    columnNumber: 27
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/customer.tsx",
                                                                lineNumber: 1396,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/pages/portal/customer.tsx",
                                                        lineNumber: 1375,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/pages/portal/customer.tsx",
                                                lineNumber: 1345,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "relative overflow-hidden flex-1 rounded-xl p-3 transition-shadow duration-200 hover:shadow-md",
                                                style: {
                                                    background: "linear-gradient(135deg, #ef4444, #dc2626)"
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: "absolute inset-0",
                                                        style: {
                                                            background: "radial-gradient(circle at top left, rgba(255,255,255,0.15), transparent 50%)"
                                                        }
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/customer.tsx",
                                                        lineNumber: 1417,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: "absolute -bottom-12 -right-12 h-32 w-32 rounded-full bg-white/10 blur-2xl"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/customer.tsx",
                                                        lineNumber: 1424,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: "absolute top-2 left-2 w-16 h-16 rounded-full bg-white/8 blur-lg"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/customer.tsx",
                                                        lineNumber: 1426,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: "absolute top-4 right-4 w-12 h-12 rounded-full bg-white/6 blur-md"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/customer.tsx",
                                                        lineNumber: 1427,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: "absolute -right-1 -bottom-1 opacity-10",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                            className: "fi flex fi-rr-clock text-3xl text-white"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/customer.tsx",
                                                            lineNumber: 1430,
                                                            columnNumber: 25
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/customer.tsx",
                                                        lineNumber: 1429,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: "absolute inset-0 opacity-[0.08]",
                                                        style: {
                                                            backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.4) 1px, transparent 1px)",
                                                            backgroundSize: "15px 15px"
                                                        }
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/customer.tsx",
                                                        lineNumber: 1433,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: "relative flex items-start justify-between z-10",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                className: "flex-1",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                        className: "text-xs font-medium mb-1",
                                                                        style: {
                                                                            color: "#ffffff",
                                                                            fontFamily: "'Roboto', sans-serif"
                                                                        },
                                                                        children: "Overdue follow ups"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/portal/customer.tsx",
                                                                        lineNumber: 1443,
                                                                        columnNumber: 27
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                        className: "text-xl font-bold",
                                                                        style: {
                                                                            color: "#ffffff",
                                                                            fontFamily: "'Poppins', sans-serif"
                                                                        },
                                                                        children: overdueFollowUps
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/portal/customer.tsx",
                                                                        lineNumber: 1452,
                                                                        columnNumber: 27
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/pages/portal/customer.tsx",
                                                                lineNumber: 1442,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                className: "flex h-10 w-10 items-center justify-center rounded-lg",
                                                                style: {
                                                                    backgroundColor: "transparent"
                                                                },
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                    className: "fi flex fi-rr-clock text-sm",
                                                                    style: {
                                                                        color: "#ffffff"
                                                                    }
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/customer.tsx",
                                                                    lineNumber: 1468,
                                                                    columnNumber: 27
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/customer.tsx",
                                                                lineNumber: 1462,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/pages/portal/customer.tsx",
                                                        lineNumber: 1441,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/pages/portal/customer.tsx",
                                                lineNumber: 1411,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/portal/customer.tsx",
                                        lineNumber: 1343,
                                        columnNumber: 19
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/pages/portal/customer.tsx",
                                    lineNumber: 1339,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/pages/portal/customer.tsx",
                            lineNumber: 1106,
                            columnNumber: 15
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "mt-8",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "bg-white rounded-xl border border-gray-200 p-4 sm:p-6",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "mb-4 sm:hidden",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                                                className: "text-lg font-bold mb-1",
                                                style: {
                                                    color: "#263238",
                                                    fontFamily: "'Poppins', sans-serif"
                                                },
                                                children: [
                                                    "All Customers",
                                                    selectedCustomers.size > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                        className: "ml-2 bg-[#4b33e8] text-white px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider animate-in fade-in slide-in-from-left-4 duration-300 align-middle",
                                                        children: [
                                                            selectedCustomers.size,
                                                            " SELECTED"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/pages/portal/customer.tsx",
                                                        lineNumber: 1493,
                                                        columnNumber: 25
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/pages/portal/customer.tsx",
                                                lineNumber: 1484,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                className: "text-xs",
                                                style: {
                                                    color: "#787E9D",
                                                    fontFamily: "'Roboto', sans-serif"
                                                },
                                                children: "Manage and view all your customers"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/portal/customer.tsx",
                                                lineNumber: 1498,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/portal/customer.tsx",
                                        lineNumber: 1483,
                                        columnNumber: 19
                                    }, this),
                                    !selectedCustomers.size && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "mb-4 sm:hidden",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "flex gap-2 w-full",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "relative flex-1",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                            className: "fi flex fi-rr-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/customer.tsx",
                                                            lineNumber: 1514,
                                                            columnNumber: 27
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                                            type: "text",
                                                            placeholder: "Search...",
                                                            value: tempSearchQuery,
                                                            onChange: (e)=>setTempSearchQuery(e.target.value),
                                                            onKeyDown: (e)=>e.key === 'Enter' && setSearchQuery(tempSearchQuery),
                                                            className: "w-full pl-9 pr-4 py-2 text-sm border border-gray-300 text-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent font-medium"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/customer.tsx",
                                                            lineNumber: 1515,
                                                            columnNumber: 27
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/pages/portal/customer.tsx",
                                                    lineNumber: 1513,
                                                    columnNumber: 25
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>setSearchQuery(tempSearchQuery),
                                                    className: "px-4 bg-[#4b33e8] text-white rounded-lg text-sm font-bold flex items-center justify-center shadow-sm active:scale-95 transition-transform",
                                                    children: "Search"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/customer.tsx",
                                                    lineNumber: 1524,
                                                    columnNumber: 25
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/portal/customer.tsx",
                                            lineNumber: 1512,
                                            columnNumber: 23
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/pages/portal/customer.tsx",
                                        lineNumber: 1511,
                                        columnNumber: 21
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "mb-4 sm:hidden flex flex-wrap items-center gap-2",
                                        children: [
                                            selectedCustomers.size > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["Fragment"], {
                                                children: dataSource !== 'rejected' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["Fragment"], {
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["Fragment"], {
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                            onClick: ()=>setShowBulkActionModal(true),
                                                            className: "h-10 px-4 border border-indigo-200 rounded-lg bg-indigo-50 hover:bg-indigo-100 transition-colors flex items-center justify-center text-indigo-600 gap-2 shadow-sm shadow-indigo-100",
                                                            title: "Bulk Actions",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                    className: "fi flex fi-rr-menu-dots-vertical text-sm"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/customer.tsx",
                                                                    lineNumber: 1547,
                                                                    columnNumber: 31
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                    className: "text-xs font-bold uppercase tracking-wider",
                                                                    children: [
                                                                        "Actions (",
                                                                        selectedCustomers.size,
                                                                        ")"
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/pages/portal/customer.tsx",
                                                                    lineNumber: 1548,
                                                                    columnNumber: 31
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/pages/portal/customer.tsx",
                                                            lineNumber: 1542,
                                                            columnNumber: 29
                                                        }, this)
                                                    }, void 0, false)
                                                }, void 0, false)
                                            }, void 0, false),
                                            selectedCustomers.size > 0 && dataSource === 'rejected' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                onClick: handleMoveToLive,
                                                disabled: isMovingToLive,
                                                className: "h-10 px-3 border border-emerald-200 rounded-lg bg-emerald-50 hover:bg-emerald-100 transition-colors flex items-center justify-center text-emerald-600 gap-1.5",
                                                title: "Move to Live",
                                                children: isMovingToLive ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "animate-spin rounded-full h-4 w-4 border-2 border-emerald-600 border-t-transparent"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/customer.tsx",
                                                    lineNumber: 1564,
                                                    columnNumber: 29
                                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["Fragment"], {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                            className: "fi flex fi-rr-redo text-sm"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/customer.tsx",
                                                            lineNumber: 1567,
                                                            columnNumber: 31
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                            className: "text-[10px] font-bold",
                                                            children: "LIVE"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/customer.tsx",
                                                            lineNumber: 1568,
                                                            columnNumber: 31
                                                        }, this)
                                                    ]
                                                }, void 0, true)
                                            }, void 0, false, {
                                                fileName: "[project]/pages/portal/customer.tsx",
                                                lineNumber: 1557,
                                                columnNumber: 25
                                            }, this),
                                            selectedCustomers.size > 0 && permissionFlags.isDeleteButtonVisible && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                onClick: async ()=>{
                                                    if (confirm(`Are you sure you want to delete ${selectedCustomers.size} customer(s)?`)) {
                                                        setIsDeleting(true);
                                                        try {
                                                            const customerIds = Array.from(selectedCustomers);
                                                            // Delete in batches of 50 to avoid URL length and query limits
                                                            const batchSize = 50;
                                                            let successCount = 0;
                                                            let failCount = 0;
                                                            const errors = [];
                                                            for(let i = 0; i < customerIds.length; i += batchSize){
                                                                const batch = customerIds.slice(i, i + batchSize);
                                                                const table = dataSource === "live" ? "customers" : dataSource === "rejected" ? "rejected_leads" : "closed_deals";
                                                                const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from(table).delete().in("id", batch);
                                                                if (error) {
                                                                    console.error(`Error deleting batch ${Math.floor(i / batchSize) + 1}:`, error);
                                                                    failCount += batch.length;
                                                                    errors.push(`Batch ${Math.floor(i / batchSize) + 1}: ${error.message}`);
                                                                } else {
                                                                    successCount += batch.length;
                                                                }
                                                            }
                                                            if (failCount > 0) {
                                                                alert(`Deleted ${successCount} customer(s). ${failCount} failed. ${errors.slice(0, 2).join("; ")}`);
                                                            } else {
                                                                // All successful
                                                                setSelectedCustomers(new Set());
                                                                await fetchCustomers(currentPage);
                                                                (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$monitoring$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["logSystemEvent"])({
                                                                    event_type: 'WRITE',
                                                                    description: `Bulk Delete: ${customerIds.length} records removed from ${dataSource === "live" ? "customers" : dataSource === "rejected" ? "rejected_leads" : "closed_deals"} (Mobile View)`,
                                                                    metadata: {
                                                                        record_count: customerIds.length
                                                                    },
                                                                    payload_size: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$monitoring$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["estimateSize"])(customerIds),
                                                                    user_name: user?.displayName || 'Admin',
                                                                    organization_id: user?.organization_id || undefined
                                                                });
                                                            }
                                                        } catch (err) {
                                                            console.error("Error deleting customers:", err);
                                                            alert("Failed to delete customers. Please try again.");
                                                        } finally{
                                                            setIsDeleting(false);
                                                        }
                                                    }
                                                },
                                                disabled: isDeleting,
                                                className: "h-10 px-3 border border-red-300 rounded-lg bg-red-50 hover:bg-red-100 transition-colors flex items-center justify-center text-red-600",
                                                style: {
                                                    fontFamily: "'Roboto', sans-serif"
                                                },
                                                children: isDeleting ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "animate-spin rounded-full h-4 w-4 border-2 border-red-600 border-t-transparent"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/customer.tsx",
                                                    lineNumber: 1658,
                                                    columnNumber: 27
                                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                    className: "fi flex fi-rr-trash text-sm"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/customer.tsx",
                                                    lineNumber: 1660,
                                                    columnNumber: 27
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/pages/portal/customer.tsx",
                                                lineNumber: 1575,
                                                columnNumber: 23
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                onClick: ()=>fetchCustomers(currentPage),
                                                className: `h-10 px-3 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors flex items-center justify-center text-gray-600 ${loadingCustomers ? 'opacity-50' : ''}`,
                                                title: "Refresh Data",
                                                disabled: loadingCustomers,
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                    className: `fi flex fi-rr-refresh text-sm ${loadingCustomers ? 'animate-spin' : ''}`
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/customer.tsx",
                                                    lineNumber: 1670,
                                                    columnNumber: 23
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/pages/portal/customer.tsx",
                                                lineNumber: 1664,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                onClick: ()=>setShowFilterModal(true),
                                                className: `h-10 px-3 border rounded-lg transition-colors flex items-center justify-center gap-2 ${Object.values(filters).some((v)=>v) ? "bg-indigo-50 border-indigo-200 text-indigo-600" : "bg-white border-gray-300 text-gray-600 hover:bg-gray-50"}`,
                                                style: {
                                                    fontFamily: "'Roboto', sans-serif"
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                        className: "fi flex fi-rr-filter text-sm"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/customer.tsx",
                                                        lineNumber: 1682,
                                                        columnNumber: 23
                                                    }, this),
                                                    Object.values(filters).some((v)=>v) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                        className: "w-2 h-2 rounded-full bg-indigo-600"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/customer.tsx",
                                                        lineNumber: 1684,
                                                        columnNumber: 25
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/pages/portal/customer.tsx",
                                                lineNumber: 1673,
                                                columnNumber: 21
                                            }, this),
                                            permissionFlags.isImportButtonVisible && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                onClick: ()=>setShowImportModal(true),
                                                className: "h-10 px-3 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors flex items-center justify-center",
                                                style: {
                                                    fontFamily: "'Roboto', sans-serif"
                                                },
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                    className: "fi flex fi-rr-upload text-sm text-gray-600"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/customer.tsx",
                                                    lineNumber: 1694,
                                                    columnNumber: 23
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/pages/portal/customer.tsx",
                                                lineNumber: 1689,
                                                columnNumber: 21
                                            }, this),
                                            permissionFlags.isExportButtonVisible && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                onClick: handleExportCustomers,
                                                className: "h-10 px-3 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors flex items-center justify-center",
                                                style: {
                                                    fontFamily: "'Roboto', sans-serif"
                                                },
                                                title: "Export Data",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                    className: "fi flex fi-rr-download text-sm text-gray-600"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/customer.tsx",
                                                    lineNumber: 1705,
                                                    columnNumber: 23
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/pages/portal/customer.tsx",
                                                lineNumber: 1699,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-1 bg-gray-100 rounded-lg p-1 h-10",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                        onClick: ()=>setViewType("list"),
                                                        className: `px-3 h-full rounded text-xs font-medium transition-colors flex items-center justify-center ${viewType === "list" ? "bg-white text-purple-600 shadow-sm" : "text-gray-600 hover:text-gray-900"}`,
                                                        style: {
                                                            fontFamily: "'Roboto', sans-serif"
                                                        },
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                            className: "fi flex fi-rr-list"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/customer.tsx",
                                                            lineNumber: 1718,
                                                            columnNumber: 25
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/customer.tsx",
                                                        lineNumber: 1710,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                        onClick: ()=>setViewType("grid"),
                                                        className: `px-3 h-full rounded text-xs font-medium transition-colors flex items-center justify-center ${viewType === "grid" ? "bg-white text-purple-600 shadow-sm" : "text-gray-600 hover:text-gray-900"}`,
                                                        style: {
                                                            fontFamily: "'Roboto', sans-serif"
                                                        },
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                            className: "fi flex fi-rr-grid"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/customer.tsx",
                                                            lineNumber: 1728,
                                                            columnNumber: 25
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/customer.tsx",
                                                        lineNumber: 1720,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/pages/portal/customer.tsx",
                                                lineNumber: 1709,
                                                columnNumber: 21
                                            }, this),
                                            permissionFlags.isAddCustomerButtonVisible && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                onClick: ()=>setShowAddCustomerModal(true),
                                                className: "h-10 w-10 rounded-lg transition-colors flex items-center justify-center hover:opacity-90",
                                                style: {
                                                    fontFamily: "'Roboto', sans-serif",
                                                    backgroundColor: "#4b33e8"
                                                },
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                    className: "fi flex fi-rr-user-add text-sm text-white"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/customer.tsx",
                                                    lineNumber: 1741,
                                                    columnNumber: 23
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/pages/portal/customer.tsx",
                                                lineNumber: 1733,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/portal/customer.tsx",
                                        lineNumber: 1535,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "hidden sm:flex sm:items-center sm:justify-between mb-6",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                                                        className: "text-xl font-bold mb-1",
                                                        style: {
                                                            color: "#263238",
                                                            fontFamily: "'Poppins', sans-serif"
                                                        },
                                                        children: [
                                                            "All Customers",
                                                            selectedCustomers.size > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                className: "ml-2 bg-[#4b33e8] text-white px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider animate-in fade-in slide-in-from-left-4 duration-300 align-middle",
                                                                children: [
                                                                    selectedCustomers.size,
                                                                    " SELECTED"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/pages/portal/customer.tsx",
                                                                lineNumber: 1758,
                                                                columnNumber: 27
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/pages/portal/customer.tsx",
                                                        lineNumber: 1749,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                        className: "text-sm",
                                                        style: {
                                                            color: "#787E9D",
                                                            fontFamily: "'Roboto', sans-serif"
                                                        },
                                                        children: "Manage and view all your customers"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/customer.tsx",
                                                        lineNumber: 1763,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/pages/portal/customer.tsx",
                                                lineNumber: 1748,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-3",
                                                children: [
                                                    selectedCustomers.size > 0 && permissionFlags.isDeleteButtonVisible && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                        onClick: async ()=>{
                                                            if (confirm(`Are you sure you want to delete ${selectedCustomers.size} customer(s)?`)) {
                                                                setIsDeleting(true);
                                                                try {
                                                                    const customerIds = Array.from(selectedCustomers);
                                                                    // Delete in batches of 50 to avoid URL length and query limits
                                                                    const batchSize = 50;
                                                                    let successCount = 0;
                                                                    let failCount = 0;
                                                                    const errors = [];
                                                                    for(let i = 0; i < customerIds.length; i += batchSize){
                                                                        const batch = customerIds.slice(i, i + batchSize);
                                                                        const table = dataSource === "live" ? "customers" : dataSource === "rejected" ? "rejected_leads" : "closed_deals";
                                                                        const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from(table).delete().in("id", batch);
                                                                        if (error) {
                                                                            console.error(`Error deleting batch ${Math.floor(i / batchSize) + 1}:`, error);
                                                                            failCount += batch.length;
                                                                            errors.push(`Batch ${Math.floor(i / batchSize) + 1}: ${error.message}`);
                                                                        } else {
                                                                            successCount += batch.length;
                                                                        }
                                                                    }
                                                                    if (failCount > 0) {
                                                                        alert(`Deleted ${successCount} customer(s). ${failCount} failed. ${errors.slice(0, 2).join("; ")}`);
                                                                    } else {
                                                                        // All successful
                                                                        setSelectedCustomers(new Set());
                                                                        await fetchCustomers(currentPage);
                                                                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$monitoring$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["logSystemEvent"])({
                                                                            event_type: 'WRITE',
                                                                            description: `Bulk Delete: ${customerIds.length} records removed from ${dataSource === "live" ? "customers" : dataSource === "rejected" ? "rejected_leads" : "closed_deals"} (Desktop View)`,
                                                                            metadata: {
                                                                                record_count: customerIds.length
                                                                            },
                                                                            payload_size: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$monitoring$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["estimateSize"])(customerIds),
                                                                            user_name: user?.displayName || 'Admin',
                                                                            organization_id: user?.organization_id || undefined
                                                                        });
                                                                    }
                                                                } catch (err) {
                                                                    console.error("Error deleting customers:", err);
                                                                    alert("Failed to delete customers. Please try again.");
                                                                } finally{
                                                                    setIsDeleting(false);
                                                                }
                                                            }
                                                        },
                                                        disabled: isDeleting,
                                                        className: "h-10 px-3 border border-red-300 rounded-lg bg-red-50 hover:bg-red-100 transition-colors flex items-center justify-center text-red-600",
                                                        style: {
                                                            fontFamily: "'Roboto', sans-serif"
                                                        },
                                                        children: isDeleting ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: "animate-spin rounded-full h-4 w-4 border-2 border-red-600 border-t-transparent"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/customer.tsx",
                                                            lineNumber: 1860,
                                                            columnNumber: 29
                                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                            className: "fi flex fi-rr-trash text-sm"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/customer.tsx",
                                                            lineNumber: 1862,
                                                            columnNumber: 29
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/customer.tsx",
                                                        lineNumber: 1776,
                                                        columnNumber: 25
                                                    }, this),
                                                    !selectedCustomers.size ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: "flex gap-2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                className: "relative w-64 text-gray-800",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                        className: "fi flex fi-rr-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/portal/customer.tsx",
                                                                        lineNumber: 1870,
                                                                        columnNumber: 29
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                                                        type: "text",
                                                                        placeholder: "Search customers...",
                                                                        value: tempSearchQuery,
                                                                        onChange: (e)=>setTempSearchQuery(e.target.value),
                                                                        onKeyDown: (e)=>e.key === 'Enter' && setSearchQuery(tempSearchQuery),
                                                                        className: "w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4b33e8] focus:border-transparent font-medium"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/portal/customer.tsx",
                                                                        lineNumber: 1871,
                                                                        columnNumber: 29
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/pages/portal/customer.tsx",
                                                                lineNumber: 1869,
                                                                columnNumber: 27
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                onClick: fetchDuplicates,
                                                                className: "h-[38px] px-4 bg-rose-50 text-rose-600 border border-rose-100 rounded-lg text-sm font-bold hover:bg-rose-100 transition-all flex items-center gap-2",
                                                                title: "Scan for Duplicate Numbers",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                    className: "fi flex fi-rr-copy-alt text-xs"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/customer.tsx",
                                                                    lineNumber: 1885,
                                                                    columnNumber: 29
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/customer.tsx",
                                                                lineNumber: 1880,
                                                                columnNumber: 27
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/pages/portal/customer.tsx",
                                                        lineNumber: 1868,
                                                        columnNumber: 25
                                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: "flex items-center gap-2 animate-in fade-in slide-in-from-right-4 duration-300",
                                                        children: [
                                                            dataSource !== 'rejected' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["Fragment"], {
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                    onClick: ()=>setShowBulkActionModal(true),
                                                                    className: "h-10 px-4 border border-indigo-200 rounded-lg bg-indigo-50 hover:bg-indigo-100 transition-colors flex items-center justify-center text-indigo-600 gap-2 shadow-sm shadow-indigo-100",
                                                                    title: "Bulk Actions",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                            className: "fi flex fi-rr-menu-dots-vertical text-sm"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/pages/portal/customer.tsx",
                                                                            lineNumber: 1905,
                                                                            columnNumber: 33
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                            className: "text-xs font-bold uppercase tracking-widest",
                                                                            children: [
                                                                                "Bulk Actions (",
                                                                                selectedCustomers.size,
                                                                                ")"
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/pages/portal/customer.tsx",
                                                                            lineNumber: 1906,
                                                                            columnNumber: 33
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/pages/portal/customer.tsx",
                                                                    lineNumber: 1900,
                                                                    columnNumber: 31
                                                                }, this)
                                                            }, void 0, false),
                                                            dataSource === 'rejected' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                onClick: handleMoveToLive,
                                                                disabled: isMovingToLive,
                                                                className: "h-10 px-4 border border-emerald-200 rounded-lg bg-emerald-50 hover:bg-emerald-100 transition-colors flex items-center justify-center text-emerald-600 gap-2 font-bold text-xs",
                                                                title: "Move to Live",
                                                                children: isMovingToLive ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                    className: "animate-spin rounded-full h-4 w-4 border-2 border-emerald-600 border-t-transparent"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/customer.tsx",
                                                                    lineNumber: 1920,
                                                                    columnNumber: 33
                                                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["Fragment"], {
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                            className: "fi flex fi-rr-redo text-sm"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/pages/portal/customer.tsx",
                                                                            lineNumber: 1923,
                                                                            columnNumber: 35
                                                                        }, this),
                                                                        "MOVE TO LIVE"
                                                                    ]
                                                                }, void 0, true)
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/customer.tsx",
                                                                lineNumber: 1913,
                                                                columnNumber: 29
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/pages/portal/customer.tsx",
                                                        lineNumber: 1897,
                                                        columnNumber: 25
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                        onClick: ()=>fetchCustomers(currentPage),
                                                        className: `h-10 px-3 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors flex items-center justify-center text-gray-600 ${loadingCustomers ? 'opacity-50' : ''}`,
                                                        title: "Refresh Data",
                                                        disabled: loadingCustomers,
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                            className: `fi flex fi-rr-refresh text-sm ${loadingCustomers ? 'animate-spin' : ''}`
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/customer.tsx",
                                                            lineNumber: 1938,
                                                            columnNumber: 25
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/customer.tsx",
                                                        lineNumber: 1932,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                        onClick: ()=>setShowFilterModal(true),
                                                        className: `h-10 px-3 border rounded-lg transition-colors flex items-center justify-center gap-2 ${Object.values(filters).some((v)=>v) ? "bg-indigo-50 border-indigo-200 text-indigo-600 font-bold" : "bg-white border-gray-300 text-gray-600 hover:bg-gray-50 font-medium"}`,
                                                        style: {
                                                            fontFamily: "'Roboto', sans-serif"
                                                        },
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                className: "fi flex fi-rr-filter text-sm"
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/customer.tsx",
                                                                lineNumber: 1951,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                children: "Filter"
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/customer.tsx",
                                                                lineNumber: 1952,
                                                                columnNumber: 25
                                                            }, this),
                                                            Object.values(filters).some((v)=>v) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                className: "ml-1 px-1.5 py-0.5 rounded-full bg-indigo-600 text-white text-[10px]",
                                                                children: Object.values(filters).filter((v)=>v).length
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/customer.tsx",
                                                                lineNumber: 1954,
                                                                columnNumber: 27
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/pages/portal/customer.tsx",
                                                        lineNumber: 1942,
                                                        columnNumber: 23
                                                    }, this),
                                                    permissionFlags.isImportButtonVisible && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                        onClick: ()=>setShowImportModal(true),
                                                        className: "h-10 px-3 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors flex items-center justify-center",
                                                        style: {
                                                            fontFamily: "'Roboto', sans-serif"
                                                        },
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                            className: "fi flex fi-rr-upload text-sm text-gray-600"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/customer.tsx",
                                                            lineNumber: 1967,
                                                            columnNumber: 25
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/customer.tsx",
                                                        lineNumber: 1962,
                                                        columnNumber: 23
                                                    }, this),
                                                    permissionFlags.isExportButtonVisible && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                        onClick: handleExportCustomers,
                                                        className: "h-10 px-3 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors flex items-center justify-center",
                                                        style: {
                                                            fontFamily: "'Roboto', sans-serif"
                                                        },
                                                        title: "Export Data",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                            className: "fi flex fi-rr-download text-sm text-gray-600"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/customer.tsx",
                                                            lineNumber: 1978,
                                                            columnNumber: 25
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/customer.tsx",
                                                        lineNumber: 1972,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: "flex items-center gap-1 bg-gray-100 rounded-lg p-1 h-10",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                onClick: ()=>setViewType("list"),
                                                                className: `px-3 h-full rounded text-xs font-medium transition-colors flex items-center justify-center ${viewType === "list" ? "bg-white text-purple-600 shadow-sm" : "text-gray-600 hover:text-gray-900"}`,
                                                                style: {
                                                                    fontFamily: "'Roboto', sans-serif"
                                                                },
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                    className: "fi flex fi-rr-list"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/customer.tsx",
                                                                    lineNumber: 1991,
                                                                    columnNumber: 27
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/customer.tsx",
                                                                lineNumber: 1983,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                onClick: ()=>setViewType("grid"),
                                                                className: `px-3 h-full rounded text-xs font-medium transition-colors flex items-center justify-center ${viewType === "grid" ? "bg-white text-purple-600 shadow-sm" : "text-gray-600 hover:text-gray-900"}`,
                                                                style: {
                                                                    fontFamily: "'Roboto', sans-serif"
                                                                },
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                    className: "fi flex fi-rr-grid"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/customer.tsx",
                                                                    lineNumber: 2001,
                                                                    columnNumber: 27
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/customer.tsx",
                                                                lineNumber: 1993,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/pages/portal/customer.tsx",
                                                        lineNumber: 1982,
                                                        columnNumber: 23
                                                    }, this),
                                                    permissionFlags.isAddCustomerButtonVisible && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                        onClick: ()=>setShowAddCustomerModal(true),
                                                        className: "h-10 w-10 rounded-lg transition-colors flex items-center justify-center hover:opacity-90",
                                                        style: {
                                                            fontFamily: "'Roboto', sans-serif",
                                                            backgroundColor: "#4b33e8"
                                                        },
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                            className: "fi flex fi-rr-user-add text-sm text-white"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/customer.tsx",
                                                            lineNumber: 2014,
                                                            columnNumber: 25
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/customer.tsx",
                                                        lineNumber: 2006,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/pages/portal/customer.tsx",
                                                lineNumber: 1773,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/portal/customer.tsx",
                                        lineNumber: 1747,
                                        columnNumber: 19
                                    }, this),
                                    loadingCustomers ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "text-center py-12",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "animate-spin rounded-full h-8 w-8 border-4 border-t-transparent mx-auto mb-4",
                                                style: {
                                                    borderColor: "#4b33e8"
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/pages/portal/customer.tsx",
                                                lineNumber: 2023,
                                                columnNumber: 23
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                className: "text-gray-500 text-sm",
                                                style: {
                                                    fontFamily: "'Roboto', sans-serif"
                                                },
                                                children: "Loading customers..."
                                            }, void 0, false, {
                                                fileName: "[project]/pages/portal/customer.tsx",
                                                lineNumber: 2027,
                                                columnNumber: 23
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/portal/customer.tsx",
                                        lineNumber: 2022,
                                        columnNumber: 21
                                    }, this) : filteredCustomers.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "text-center py-12",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                            className: "text-gray-500",
                                            style: {
                                                fontFamily: "'Roboto', sans-serif"
                                            },
                                            children: searchQuery ? "No customers found matching your search." : "No customers found."
                                        }, void 0, false, {
                                            fileName: "[project]/pages/portal/customer.tsx",
                                            lineNumber: 2036,
                                            columnNumber: 23
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/pages/portal/customer.tsx",
                                        lineNumber: 2035,
                                        columnNumber: 21
                                    }, this) : viewType === "list" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "overflow-x-auto",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
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
                                                                    children: permissionFlags.isCheckBoxVisible && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                        className: "flex items-center justify-center",
                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                                                            type: "checkbox",
                                                                            checked: allCustomers.length > 0 && selectedCustomers.size === allCustomers.length,
                                                                            onChange: (e)=>{
                                                                                if (e.target.checked) {
                                                                                    const allIds = new Set(allCustomers.map((c)=>c.id));
                                                                                    setSelectedCustomers(allIds);
                                                                                } else {
                                                                                    setSelectedCustomers(new Set());
                                                                                }
                                                                            },
                                                                            className: "w-4 h-4 rounded border-gray-300 text-[#4b33e8] focus:ring-[#4b33e8] cursor-pointer"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/pages/portal/customer.tsx",
                                                                            lineNumber: 2054,
                                                                            columnNumber: 37
                                                                        }, this)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/portal/customer.tsx",
                                                                        lineNumber: 2053,
                                                                        columnNumber: 35
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/customer.tsx",
                                                                    lineNumber: 2051,
                                                                    columnNumber: 34
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                                    className: "px-4 py-4 text-[10px] font-medium text-gray-400 uppercase tracking-widest",
                                                                    children: "Customer Name"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/customer.tsx",
                                                                    lineNumber: 2076,
                                                                    columnNumber: 33
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                                    className: "px-4 py-4 text-[10px] font-medium text-gray-400 uppercase tracking-widest text-center",
                                                                    children: "Status"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/customer.tsx",
                                                                    lineNumber: 2079,
                                                                    columnNumber: 33
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                                    className: "px-4 py-4 text-[10px] font-medium text-gray-400 uppercase tracking-widest",
                                                                    children: "Campaign"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/customer.tsx",
                                                                    lineNumber: 2082,
                                                                    columnNumber: 34
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                                    className: "px-4 py-4 text-[10px] font-medium text-gray-400 uppercase tracking-widest",
                                                                    children: "Organization"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/customer.tsx",
                                                                    lineNumber: 2085,
                                                                    columnNumber: 33
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                                    className: "px-4 py-4 text-[10px] font-medium text-gray-400 uppercase tracking-widest",
                                                                    children: "Assigned To"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/customer.tsx",
                                                                    lineNumber: 2088,
                                                                    columnNumber: 33
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                                    className: "px-4 py-4 text-[10px] font-medium text-gray-400 uppercase tracking-widest",
                                                                    children: "Managed By"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/customer.tsx",
                                                                    lineNumber: 2091,
                                                                    columnNumber: 33
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                                    className: "px-4 py-4 text-[10px] font-medium text-gray-400 uppercase tracking-widest",
                                                                    children: "Disposition"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/customer.tsx",
                                                                    lineNumber: 2094,
                                                                    columnNumber: 33
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                                    className: "px-4 py-4 text-[10px] font-medium text-gray-400 uppercase tracking-widest",
                                                                    children: dataSource === "closed" ? "Final Status" : dataSource === "rejected" ? "Rejection Reason" : "Expiry Date"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/customer.tsx",
                                                                    lineNumber: 2097,
                                                                    columnNumber: 33
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                                    className: "px-4 py-4 text-[10px] font-medium text-gray-400 uppercase tracking-widest",
                                                                    children: dataSource === "closed" ? "Closed Date" : dataSource === "rejected" ? "Rejected Date" : "Created Date"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/customer.tsx",
                                                                    lineNumber: 2100,
                                                                    columnNumber: 33
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                                    className: "px-4 py-4 text-[10px] font-medium text-gray-400 uppercase tracking-widest text-right",
                                                                    children: "Action"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/customer.tsx",
                                                                    lineNumber: 2103,
                                                                    columnNumber: 33
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/pages/portal/customer.tsx",
                                                            lineNumber: 2050,
                                                            columnNumber: 31
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/customer.tsx",
                                                        lineNumber: 2049,
                                                        columnNumber: 29
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("tbody", {
                                                        className: "divide-y divide-gray-50",
                                                        children: filteredCustomers.map((customer)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("tr", {
                                                                className: "group hover:bg-indigo-50/30 transition-all cursor-pointer border-b border-gray-50/50 last:border-0",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                                        className: "px-4 py-4",
                                                                        children: permissionFlags.isCheckBoxVisible && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                            className: "flex items-center justify-center",
                                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                                                                type: "checkbox",
                                                                                checked: selectedCustomers.has(customer.id),
                                                                                onChange: (e)=>{
                                                                                    const newSelected = new Set(selectedCustomers);
                                                                                    if (e.target.checked) {
                                                                                        newSelected.add(customer.id);
                                                                                    } else {
                                                                                        newSelected.delete(customer.id);
                                                                                    }
                                                                                    setSelectedCustomers(newSelected);
                                                                                },
                                                                                className: "w-4 h-4 rounded border-gray-300 text-[#4b33e8] focus:ring-[#4b33e8] cursor-pointer"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/pages/portal/customer.tsx",
                                                                                lineNumber: 2117,
                                                                                columnNumber: 39
                                                                            }, this)
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/pages/portal/customer.tsx",
                                                                            lineNumber: 2116,
                                                                            columnNumber: 37
                                                                        }, this)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/portal/customer.tsx",
                                                                        lineNumber: 2114,
                                                                        columnNumber: 35
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                                        className: "px-4 py-4",
                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                            className: "flex items-center gap-3",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                    className: "w-10 h-10 flex-shrink-0 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shadow-lg shadow-indigo-100 uppercase",
                                                                                    children: customer.customer_name ? customer.customer_name.charAt(0).toUpperCase() : "C"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/pages/portal/customer.tsx",
                                                                                    lineNumber: 2138,
                                                                                    columnNumber: 39
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                    className: "text-xs font-medium text-gray-800",
                                                                                    style: {
                                                                                        fontFamily: "'Poppins', sans-serif",
                                                                                        color: "#263238"
                                                                                    },
                                                                                    children: customer.customer_name || "N/A"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/pages/portal/customer.tsx",
                                                                                    lineNumber: 2145,
                                                                                    columnNumber: 39
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/pages/portal/customer.tsx",
                                                                            lineNumber: 2137,
                                                                            columnNumber: 37
                                                                        }, this)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/portal/customer.tsx",
                                                                        lineNumber: 2136,
                                                                        columnNumber: 35
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                                        className: "px-4 py-4 text-center",
                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                            className: "flex justify-center",
                                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                className: `px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest flex items-center gap-1.5 ${dataSource === "closed" ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : dataSource === "rejected" ? "bg-rose-50 text-rose-600 border border-rose-100" : customer.status === "active" ? "bg-green-50 text-green-600 border border-green-100" : customer.status === "inactive" ? "bg-gray-50 text-gray-600 border border-gray-100" : "bg-orange-50 text-orange-600 border border-orange-100"}`,
                                                                                children: dataSource === "closed" ? "Deal Done" : dataSource === "rejected" ? "Rejected" : customer.status === "active" ? "Active" : customer.status === "inactive" ? "Inactive" : "Pending"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/pages/portal/customer.tsx",
                                                                                lineNumber: 2159,
                                                                                columnNumber: 39
                                                                            }, this)
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/pages/portal/customer.tsx",
                                                                            lineNumber: 2158,
                                                                            columnNumber: 37
                                                                        }, this)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/portal/customer.tsx",
                                                                        lineNumber: 2157,
                                                                        columnNumber: 35
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                                        className: "px-4 py-4",
                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                            className: "px-2 py-1 rounded-md bg-indigo-50 text-indigo-700 text-[10px] font-bold uppercase tracking-wide",
                                                                            children: customer.campaign_name || "No Campaign"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/pages/portal/customer.tsx",
                                                                            lineNumber: 2176,
                                                                            columnNumber: 37
                                                                        }, this)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/portal/customer.tsx",
                                                                        lineNumber: 2175,
                                                                        columnNumber: 36
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                                        className: "px-4 py-4",
                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                            className: "flex items-center gap-2",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                                    className: "fi flex fi-rr-building text-[#4b33e8] text-xs"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/pages/portal/customer.tsx",
                                                                                    lineNumber: 2182,
                                                                                    columnNumber: 39
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                    className: "text-[12px] font-medium text-gray-700",
                                                                                    style: {
                                                                                        fontFamily: "'Roboto', sans-serif"
                                                                                    },
                                                                                    children: customer.organization_name || "N/A"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/pages/portal/customer.tsx",
                                                                                    lineNumber: 2183,
                                                                                    columnNumber: 39
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/pages/portal/customer.tsx",
                                                                            lineNumber: 2181,
                                                                            columnNumber: 37
                                                                        }, this)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/portal/customer.tsx",
                                                                        lineNumber: 2180,
                                                                        columnNumber: 35
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                                        className: "px-4 py-4",
                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                            className: "text-xs font-medium text-gray-600",
                                                                            children: customer.assigned_user_name || customer.assigned_employee_id || "Unassigned"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/pages/portal/customer.tsx",
                                                                            lineNumber: 2194,
                                                                            columnNumber: 37
                                                                        }, this)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/portal/customer.tsx",
                                                                        lineNumber: 2193,
                                                                        columnNumber: 35
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                                        className: "px-4 py-4",
                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                            className: "flex flex-col",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                    className: "text-xs font-semibold text-gray-800",
                                                                                    children: customer.managed_by_name || "Self"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/pages/portal/customer.tsx",
                                                                                    lineNumber: 2202,
                                                                                    columnNumber: 39
                                                                                }, this),
                                                                                customer.managed_by_id && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                    className: "text-[10px] text-gray-400 font-medium",
                                                                                    children: [
                                                                                        "ID: ",
                                                                                        customer.managed_by_id
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/pages/portal/customer.tsx",
                                                                                    lineNumber: 2206,
                                                                                    columnNumber: 41
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/pages/portal/customer.tsx",
                                                                            lineNumber: 2201,
                                                                            columnNumber: 37
                                                                        }, this)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/portal/customer.tsx",
                                                                        lineNumber: 2200,
                                                                        columnNumber: 35
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                                        className: "px-4 py-4",
                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                            className: "text-xs font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded-lg border border-amber-100 uppercase tracking-tighter",
                                                                            children: customer.disposition || "No Status"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/pages/portal/customer.tsx",
                                                                            lineNumber: 2213,
                                                                            columnNumber: 37
                                                                        }, this)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/portal/customer.tsx",
                                                                        lineNumber: 2212,
                                                                        columnNumber: 36
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                                        className: "px-4 py-4",
                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                            className: "flex flex-col",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                    className: "text-xs font-medium text-gray-700 leading-none mb-1",
                                                                                    children: dataSource === "closed" || dataSource === "rejected" ? customer.disposition || "N/A" : customer.expiry_date ? formatDate(customer.expiry_date) : "---"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/pages/portal/customer.tsx",
                                                                                    lineNumber: 2219,
                                                                                    columnNumber: 39
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                    className: "text-[9px] text-gray-400 font-medium uppercase tracking-tighter",
                                                                                    children: dataSource === "closed" || dataSource === "rejected" ? "Disposition" : "Expires"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/pages/portal/customer.tsx",
                                                                                    lineNumber: 2224,
                                                                                    columnNumber: 39
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/pages/portal/customer.tsx",
                                                                            lineNumber: 2218,
                                                                            columnNumber: 37
                                                                        }, this)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/portal/customer.tsx",
                                                                        lineNumber: 2217,
                                                                        columnNumber: 35
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                                        className: "px-4 py-4",
                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                            className: "flex flex-col",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                    className: "text-xs font-medium text-gray-700 leading-none mb-1",
                                                                                    children: formatDate(dataSource === "closed" ? customer.closed_at : dataSource === "rejected" ? customer.rejected_at : customer.created_at)
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/pages/portal/customer.tsx",
                                                                                    lineNumber: 2231,
                                                                                    columnNumber: 39
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                    className: "text-[9px] text-gray-400 font-medium uppercase tracking-tighter",
                                                                                    children: dataSource === "closed" ? "Closed" : dataSource === "rejected" ? "Rejected" : "Created"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/pages/portal/customer.tsx",
                                                                                    lineNumber: 2234,
                                                                                    columnNumber: 39
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/pages/portal/customer.tsx",
                                                                            lineNumber: 2230,
                                                                            columnNumber: 37
                                                                        }, this)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/portal/customer.tsx",
                                                                        lineNumber: 2229,
                                                                        columnNumber: 35
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                                        className: "px-4 py-4 text-right",
                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                            className: "flex items-center justify-end gap-2",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                                    onClick: ()=>{
                                                                                        setSelectedCustomer(customer);
                                                                                        setShowCustomerDetailsModal(true);
                                                                                    },
                                                                                    className: "text-purple-600 hover:text-purple-700 transition-colors p-1.5 hover:bg-purple-50 rounded",
                                                                                    title: "View Details",
                                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                                        className: "fi flex fi-rr-info text-sm"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/pages/portal/customer.tsx",
                                                                                        lineNumber: 2249,
                                                                                        columnNumber: 41
                                                                                    }, this)
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/pages/portal/customer.tsx",
                                                                                    lineNumber: 2241,
                                                                                    columnNumber: 39
                                                                                }, this),
                                                                                permissionFlags.isDeleteFromLeadButtonVisible && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                                    className: "text-red-600 hover:text-red-700 transition-colors p-1.5 hover:bg-red-50 rounded",
                                                                                    title: "Delete",
                                                                                    onClick: async ()=>{
                                                                                        if (confirm("Are you sure you want to delete this customer?")) {
                                                                                            try {
                                                                                                const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from("customers").delete().eq("id", customer.id);
                                                                                                if (error) {
                                                                                                    console.error("Error deleting customer:", error);
                                                                                                    alert("Failed to delete customer");
                                                                                                } else {
                                                                                                    await fetchCustomers(currentPage);
                                                                                                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$monitoring$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["logSystemEvent"])({
                                                                                                        event_type: 'WRITE',
                                                                                                        description: `Delete Customer: ${customer.customer_name || 'N/A'} (ID: ${customer.id}) removed`,
                                                                                                        metadata: {
                                                                                                            customer_id: customer.id,
                                                                                                            customer_name: customer.customer_name
                                                                                                        },
                                                                                                        payload_size: 0,
                                                                                                        user_name: user?.displayName || 'Admin',
                                                                                                        organization_id: user?.organization_id || undefined
                                                                                                    });
                                                                                                }
                                                                                            } catch (err) {
                                                                                                console.error("Error deleting customer:", err);
                                                                                                alert("Failed to delete customer");
                                                                                            }
                                                                                        }
                                                                                    },
                                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                                        className: "fi flex fi-rr-trash text-sm"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/pages/portal/customer.tsx",
                                                                                        lineNumber: 2298,
                                                                                        columnNumber: 41
                                                                                    }, this)
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/pages/portal/customer.tsx",
                                                                                    lineNumber: 2252,
                                                                                    columnNumber: 39
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/pages/portal/customer.tsx",
                                                                            lineNumber: 2240,
                                                                            columnNumber: 37
                                                                        }, this)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/portal/customer.tsx",
                                                                        lineNumber: 2239,
                                                                        columnNumber: 35
                                                                    }, this)
                                                                ]
                                                            }, customer.id, true, {
                                                                fileName: "[project]/pages/portal/customer.tsx",
                                                                lineNumber: 2110,
                                                                columnNumber: 33
                                                            }, this))
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/customer.tsx",
                                                        lineNumber: 2108,
                                                        columnNumber: 29
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/pages/portal/customer.tsx",
                                                lineNumber: 2048,
                                                columnNumber: 27
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/pages/portal/customer.tsx",
                                            lineNumber: 2047,
                                            columnNumber: 23
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/pages/portal/customer.tsx",
                                        lineNumber: 2046,
                                        columnNumber: 21
                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4",
                                        children: filteredCustomers.map((customer)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "relative bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: "absolute top-2 right-2 flex items-center gap-1 z-10",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                onClick: (e)=>{
                                                                    e.stopPropagation();
                                                                    setSelectedCustomer(customer);
                                                                    setShowCustomerDetailsModal(true);
                                                                },
                                                                className: "text-purple-600 hover:text-purple-700 transition-colors p-1.5 hover:bg-purple-50 rounded",
                                                                title: "View Details",
                                                                style: {
                                                                    fontFamily: "'Roboto', sans-serif"
                                                                },
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                    className: "fi flex fi-rr-info text-sm"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/customer.tsx",
                                                                    lineNumber: 2330,
                                                                    columnNumber: 31
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/customer.tsx",
                                                                lineNumber: 2318,
                                                                columnNumber: 29
                                                            }, this),
                                                            permissionFlags.isDeleteFromLeadButtonVisible && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                onClick: async (e)=>{
                                                                    e.stopPropagation();
                                                                    if (confirm("Are you sure you want to delete this customer?")) {
                                                                        try {
                                                                            const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from("customers").delete().eq("id", customer.id);
                                                                            if (error) {
                                                                                console.error("Error deleting customer:", error);
                                                                                alert("Failed to delete customer");
                                                                            } else {
                                                                                await fetchCustomers(currentPage);
                                                                                (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$monitoring$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["logSystemEvent"])({
                                                                                    event_type: 'WRITE',
                                                                                    description: `Delete Customer: ${customer.customer_name || 'N/A'} (ID: ${customer.id}) removed from Grid`,
                                                                                    metadata: {
                                                                                        customer_id: customer.id,
                                                                                        customer_name: customer.customer_name
                                                                                    },
                                                                                    payload_size: 0,
                                                                                    user_name: user?.displayName || 'Admin',
                                                                                    organization_id: user?.organization_id || undefined
                                                                                });
                                                                            }
                                                                        } catch (err) {
                                                                            console.error("Error deleting customer:", err);
                                                                            alert("Failed to delete customer");
                                                                        }
                                                                    }
                                                                },
                                                                className: "text-red-600 hover:text-red-700 transition-colors p-1.5 hover:bg-red-50 rounded",
                                                                title: "Delete",
                                                                style: {
                                                                    fontFamily: "'Roboto', sans-serif"
                                                                },
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                    className: "fi flex fi-rr-trash text-sm"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/customer.tsx",
                                                                    lineNumber: 2379,
                                                                    columnNumber: 31
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/customer.tsx",
                                                                lineNumber: 2333,
                                                                columnNumber: 29
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/pages/portal/customer.tsx",
                                                        lineNumber: 2317,
                                                        columnNumber: 27
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: "flex items-center gap-3 mb-3",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                className: "w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-lg",
                                                                children: customer.customer_name ? customer.customer_name.charAt(0).toUpperCase() : "C"
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/customer.tsx",
                                                                lineNumber: 2384,
                                                                columnNumber: 29
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                className: "flex-1 min-w-0",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                                                                        className: "text-sm font-semibold text-gray-900 truncate",
                                                                        style: {
                                                                            fontFamily: "'Poppins', sans-serif"
                                                                        },
                                                                        children: customer.customer_name || "N/A"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/portal/customer.tsx",
                                                                        lineNumber: 2390,
                                                                        columnNumber: 31
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                        className: "text-xs text-gray-600 truncate",
                                                                        style: {
                                                                            fontFamily: "'Roboto', sans-serif"
                                                                        },
                                                                        children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$phoneUtils$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["formatMaskedPhone"])(customer.phone_no) || "N/A"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/portal/customer.tsx",
                                                                        lineNumber: 2396,
                                                                        columnNumber: 31
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/pages/portal/customer.tsx",
                                                                lineNumber: 2389,
                                                                columnNumber: 29
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/pages/portal/customer.tsx",
                                                        lineNumber: 2383,
                                                        columnNumber: 27
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: "space-y-3 text-xs mt-4",
                                                        children: [
                                                            customer.lead_id && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                className: "flex items-center gap-2 text-gray-600",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                        className: "fi flex fi-rr-id-card text-[10px]"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/portal/customer.tsx",
                                                                        lineNumber: 2407,
                                                                        columnNumber: 33
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                        className: "truncate",
                                                                        style: {
                                                                            fontFamily: "'Roboto', sans-serif"
                                                                        },
                                                                        children: customer.lead_id
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/portal/customer.tsx",
                                                                        lineNumber: 2408,
                                                                        columnNumber: 33
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/pages/portal/customer.tsx",
                                                                lineNumber: 2406,
                                                                columnNumber: 31
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                className: "flex items-center gap-2 text-gray-600",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                        className: "fi flex fi-rr-bullhorn text-[10px]"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/portal/customer.tsx",
                                                                        lineNumber: 2417,
                                                                        columnNumber: 31
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                        className: "truncate",
                                                                        style: {
                                                                            fontFamily: "'Roboto', sans-serif"
                                                                        },
                                                                        children: customer.campaign_name || "N/A"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/portal/customer.tsx",
                                                                        lineNumber: 2418,
                                                                        columnNumber: 31
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/pages/portal/customer.tsx",
                                                                lineNumber: 2416,
                                                                columnNumber: 29
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                className: "flex items-center gap-2 text-gray-600",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                        className: "fi flex fi-rr-building text-[10px]"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/portal/customer.tsx",
                                                                        lineNumber: 2426,
                                                                        columnNumber: 31
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                        className: "truncate",
                                                                        style: {
                                                                            fontFamily: "'Roboto', sans-serif"
                                                                        },
                                                                        children: customer.organization_name || "N/A"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/portal/customer.tsx",
                                                                        lineNumber: 2427,
                                                                        columnNumber: 31
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/pages/portal/customer.tsx",
                                                                lineNumber: 2425,
                                                                columnNumber: 29
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                className: "flex items-center gap-2 text-gray-600",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                        className: "fi flex fi-rr-headset text-[10px]"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/portal/customer.tsx",
                                                                        lineNumber: 2435,
                                                                        columnNumber: 31
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                        className: "truncate",
                                                                        style: {
                                                                            fontFamily: "'Roboto', sans-serif"
                                                                        },
                                                                        children: customer.assigned_user_name || "Unassigned"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/portal/customer.tsx",
                                                                        lineNumber: 2436,
                                                                        columnNumber: 31
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/pages/portal/customer.tsx",
                                                                lineNumber: 2434,
                                                                columnNumber: 29
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                className: "flex items-center gap-2 text-gray-600",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                        className: "fi flex fi-rr-user text-[10px]"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/portal/customer.tsx",
                                                                        lineNumber: 2444,
                                                                        columnNumber: 31
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                        className: "truncate",
                                                                        style: {
                                                                            fontFamily: "'Roboto', sans-serif"
                                                                        },
                                                                        children: customer.managed_by_name || "Self"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/portal/customer.tsx",
                                                                        lineNumber: 2445,
                                                                        columnNumber: 31
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/pages/portal/customer.tsx",
                                                                lineNumber: 2443,
                                                                columnNumber: 29
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                className: "flex items-center justify-between pt-2 border-t border-gray-50 mt-2",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                        className: `px-2 py-0.5 rounded-full inline-flex items-center gap-1 ${customer.status === "active" ? "bg-green-100" : customer.status === "inactive" ? "bg-gray-100" : "bg-orange-100"}`,
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                className: `w-1 h-1 rounded-full ${customer.status === "active" ? "bg-green-500" : customer.status === "inactive" ? "bg-gray-400" : "bg-orange-400"}`
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/pages/portal/customer.tsx",
                                                                                lineNumber: 2463,
                                                                                columnNumber: 33
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                className: `text-[10px] font-semibold ${customer.status === "active" ? "text-green-700" : customer.status === "inactive" ? "text-gray-600" : "text-orange-700"}`,
                                                                                children: customer.status === "active" ? "Active" : customer.status === "inactive" ? "Inactive" : "Pending"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/pages/portal/customer.tsx",
                                                                                lineNumber: 2472,
                                                                                columnNumber: 33
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/pages/portal/customer.tsx",
                                                                        lineNumber: 2454,
                                                                        columnNumber: 31
                                                                    }, this),
                                                                    customer.expiry_date && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                        className: "flex items-center gap-2 text-gray-400",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                                className: "fi flex fi-rr-calendar text-[10px]"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/pages/portal/customer.tsx",
                                                                                lineNumber: 2491,
                                                                                columnNumber: 35
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                style: {
                                                                                    fontFamily: "'Roboto', sans-serif"
                                                                                },
                                                                                children: formatDate(customer.expiry_date)
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/pages/portal/customer.tsx",
                                                                                lineNumber: 2492,
                                                                                columnNumber: 35
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/pages/portal/customer.tsx",
                                                                        lineNumber: 2490,
                                                                        columnNumber: 33
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/pages/portal/customer.tsx",
                                                                lineNumber: 2453,
                                                                columnNumber: 29
                                                            }, this),
                                                            customer.customer_details && (()=>{
                                                                try {
                                                                    const rawData = JSON.parse(customer.customer_details);
                                                                    let details = rawData;
                                                                    if (rawData.active_details && rawData.history) {
                                                                        details = rawData.history[rawData.active_details] || {};
                                                                    }
                                                                    const checkedFields = Object.entries(details).filter(([key])=>key.endsWith("_checked")).map(([key, value])=>({
                                                                            fieldName: key.replace("_checked", ""),
                                                                            value: String(value)
                                                                        }));
                                                                    if (checkedFields.length === 0) return null;
                                                                    return checkedFields.map((field)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                            className: "flex items-center gap-2 text-gray-500 pt-1",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                                    className: "fi flex fi-rr-check text-[10px] text-green-500"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/pages/portal/customer.tsx",
                                                                                    lineNumber: 2525,
                                                                                    columnNumber: 39
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                    className: "truncate",
                                                                                    style: {
                                                                                        fontFamily: "'Roboto', sans-serif"
                                                                                    },
                                                                                    title: `${field.fieldName}: ${field.value}`,
                                                                                    children: [
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                            className: "font-medium text-gray-700",
                                                                                            children: [
                                                                                                field.fieldName,
                                                                                                ":"
                                                                                            ]
                                                                                        }, void 0, true, {
                                                                                            fileName: "[project]/pages/portal/customer.tsx",
                                                                                            lineNumber: 2533,
                                                                                            columnNumber: 41
                                                                                        }, this),
                                                                                        " ",
                                                                                        field.value
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/pages/portal/customer.tsx",
                                                                                    lineNumber: 2526,
                                                                                    columnNumber: 39
                                                                                }, this)
                                                                            ]
                                                                        }, field.fieldName, true, {
                                                                            fileName: "[project]/pages/portal/customer.tsx",
                                                                            lineNumber: 2521,
                                                                            columnNumber: 37
                                                                        }, this));
                                                                } catch (e) {
                                                                    return null;
                                                                }
                                                            })()
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/pages/portal/customer.tsx",
                                                        lineNumber: 2404,
                                                        columnNumber: 27
                                                    }, this)
                                                ]
                                            }, customer.id, true, {
                                                fileName: "[project]/pages/portal/customer.tsx",
                                                lineNumber: 2312,
                                                columnNumber: 25
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/pages/portal/customer.tsx",
                                        lineNumber: 2310,
                                        columnNumber: 21
                                    }, this),
                                    !loadingCustomers && totalCustomers > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-3 bg-white border-t border-gray-200 rounded-b-lg",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-3",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: "text-sm text-gray-600",
                                                        style: {
                                                            fontFamily: "'Roboto', sans-serif"
                                                        },
                                                        children: [
                                                            "Showing ",
                                                            startIndex,
                                                            " to ",
                                                            endIndex,
                                                            " of ",
                                                            totalCustomers,
                                                            " ",
                                                            "customers"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/pages/portal/customer.tsx",
                                                        lineNumber: 2554,
                                                        columnNumber: 25
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: "flex items-center gap-2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                                                className: "text-xs text-gray-600",
                                                                style: {
                                                                    fontFamily: "'Roboto', sans-serif"
                                                                },
                                                                children: "Per page:"
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/customer.tsx",
                                                                lineNumber: 2563,
                                                                columnNumber: 27
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("select", {
                                                                value: pageSize,
                                                                onChange: (e)=>{
                                                                    const newPageSize = e.target.value === "all" ? "all" : parseInt(e.target.value);
                                                                    setPageSize(newPageSize);
                                                                },
                                                                className: "px-2 py-1.5 text-sm border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500",
                                                                style: {
                                                                    fontFamily: "'Roboto', sans-serif"
                                                                },
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                                        value: "50",
                                                                        children: "50"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/portal/customer.tsx",
                                                                        lineNumber: 2581,
                                                                        columnNumber: 29
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                                        value: "100",
                                                                        children: "100"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/portal/customer.tsx",
                                                                        lineNumber: 2582,
                                                                        columnNumber: 29
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                                        value: "200",
                                                                        children: "200"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/portal/customer.tsx",
                                                                        lineNumber: 2583,
                                                                        columnNumber: 29
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                                        value: "all",
                                                                        children: "All"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/portal/customer.tsx",
                                                                        lineNumber: 2584,
                                                                        columnNumber: 29
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/pages/portal/customer.tsx",
                                                                lineNumber: 2569,
                                                                columnNumber: 27
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/pages/portal/customer.tsx",
                                                        lineNumber: 2562,
                                                        columnNumber: 25
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/pages/portal/customer.tsx",
                                                lineNumber: 2553,
                                                columnNumber: 23
                                            }, this),
                                            pageSize !== "all" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                        onClick: ()=>{
                                                            if (currentPage > 1) {
                                                                setCurrentPage(currentPage - 1);
                                                            }
                                                        },
                                                        disabled: currentPage === 1 || loadingCustomers,
                                                        className: `px-2 py-1.5 w-8 h-8 rounded-lg text-sm font-medium transition-colors ${currentPage === 1 || loadingCustomers ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`,
                                                        style: {
                                                            fontFamily: "'Roboto', sans-serif"
                                                        },
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                            className: "fi flex fi-rr-angle-left"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/customer.tsx",
                                                            lineNumber: 2603,
                                                            columnNumber: 29
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/customer.tsx",
                                                        lineNumber: 2590,
                                                        columnNumber: 27
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: "flex items-center gap-1",
                                                        children: Array.from({
                                                            length: Math.min(5, totalPages)
                                                        }, (_, i)=>{
                                                            let pageNum;
                                                            if (totalPages <= 5) {
                                                                pageNum = i + 1;
                                                            } else if (currentPage <= 3) {
                                                                pageNum = i + 1;
                                                            } else if (currentPage >= totalPages - 2) {
                                                                pageNum = totalPages - 4 + i;
                                                            } else {
                                                                pageNum = currentPage - 2 + i;
                                                            }
                                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                onClick: ()=>setCurrentPage(pageNum),
                                                                disabled: loadingCustomers,
                                                                className: `w-8 h-8 rounded-lg text-sm font-medium transition-colors ${currentPage === pageNum ? "bg-[#4b33e8] text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`,
                                                                style: {
                                                                    fontFamily: "'Roboto', sans-serif"
                                                                },
                                                                children: pageNum
                                                            }, pageNum, false, {
                                                                fileName: "[project]/pages/portal/customer.tsx",
                                                                lineNumber: 2620,
                                                                columnNumber: 35
                                                            }, this);
                                                        })
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/customer.tsx",
                                                        lineNumber: 2605,
                                                        columnNumber: 27
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                        onClick: ()=>{
                                                            if (currentPage < totalPages) {
                                                                setCurrentPage(currentPage + 1);
                                                            }
                                                        },
                                                        disabled: currentPage >= totalPages || loadingCustomers,
                                                        className: `px-3 w-8 h-8 py-1.5 rounded-lg text-sm font-medium transition-colors ${currentPage >= totalPages || loadingCustomers ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`,
                                                        style: {
                                                            fontFamily: "'Roboto', sans-serif"
                                                        },
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                            className: "fi flex fi-rr-angle-right "
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/customer.tsx",
                                                            lineNumber: 2653,
                                                            columnNumber: 29
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/customer.tsx",
                                                        lineNumber: 2638,
                                                        columnNumber: 27
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/pages/portal/customer.tsx",
                                                lineNumber: 2589,
                                                columnNumber: 25
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/portal/customer.tsx",
                                        lineNumber: 2552,
                                        columnNumber: 21
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/portal/customer.tsx",
                                lineNumber: 1481,
                                columnNumber: 17
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/pages/portal/customer.tsx",
                            lineNumber: 1480,
                            columnNumber: 15
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/pages/portal/customer.tsx",
                    lineNumber: 1028,
                    columnNumber: 13
                }, this)
            }, void 0, false, {
                fileName: "[project]/pages/portal/customer.tsx",
                lineNumber: 1027,
                columnNumber: 11
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ImportCustomersModal$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                show: showImportModal,
                onClose: ()=>setShowImportModal(false),
                onSuccess: ()=>fetchCustomers(1)
            }, void 0, false, {
                fileName: "[project]/pages/portal/customer.tsx",
                lineNumber: 2666,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$AddCustomerModal$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                show: showAddCustomerModal,
                onClose: ()=>setShowAddCustomerModal(false),
                onSuccess: ()=>{
                    setShowAddCustomerModal(false);
                    fetchCustomers(); // Refresh data
                }
            }, void 0, false, {
                fileName: "[project]/pages/portal/customer.tsx",
                lineNumber: 2672,
                columnNumber: 7
            }, this),
            showCustomerDetailsModal && selectedCustomer && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "fixed inset-0 backdrop-blur-lg flex items-center justify-center z-50 p-4",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: "bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white z-10",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                                    className: "text-xl font-bold",
                                    style: {
                                        color: "#263238",
                                        fontFamily: "'Poppins', sans-serif"
                                    },
                                    children: "Customer Details"
                                }, void 0, false, {
                                    fileName: "[project]/pages/portal/customer.tsx",
                                    lineNumber: 2687,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                    onClick: ()=>{
                                        setShowCustomerDetailsModal(false);
                                        setSelectedCustomer(null);
                                        setViewingDetailsKey(null);
                                    },
                                    className: "text-gray-400 hover:text-gray-600 transition-colors",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                        className: "fi flex fi-rr-cross text-xl"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/portal/customer.tsx",
                                        lineNumber: 2704,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/pages/portal/customer.tsx",
                                    lineNumber: 2696,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/pages/portal/customer.tsx",
                            lineNumber: 2686,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "p-6",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "mb-6",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                                            className: "text-lg font-semibold mb-4",
                                            style: {
                                                color: "#263238",
                                                fontFamily: "'Poppins', sans-serif"
                                            },
                                            children: "Basic Information"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/portal/customer.tsx",
                                            lineNumber: 2712,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "grid grid-cols-1 md:grid-cols-2 gap-4",
                                            children: [
                                                selectedCustomer.customer_details && (()=>{
                                                    try {
                                                        const rawData = JSON.parse(selectedCustomer.customer_details);
                                                        if (rawData.active_details && rawData.history) {
                                                            const keys = Object.keys(rawData.history).sort((a, b)=>{
                                                                const numA = parseInt(a.split('-')[1]);
                                                                const numB = parseInt(b.split('-')[1]);
                                                                return numA - numB;
                                                            });
                                                            if (keys.length > 1) {
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
                                                                    className: "md:col-span-2 mt-4",
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                        className: "flex items-center justify-between bg-indigo-50 p-1.5 rounded-2xl border border-indigo-100 shadow-sm mb-4",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                                onClick: handlePrev,
                                                                                className: "w-9 h-9 flex items-center justify-center bg-white border border-indigo-200 rounded-xl text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all active:scale-90 shadow-sm",
                                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                                    className: "fi flex fi-rr-angle-left mt-0.5"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/pages/portal/customer.tsx",
                                                                                    lineNumber: 2753,
                                                                                    columnNumber: 51
                                                                                }, this)
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/pages/portal/customer.tsx",
                                                                                lineNumber: 2749,
                                                                                columnNumber: 47
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                className: "flex flex-col items-center",
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                        className: "text-[8px] font-black text-indigo-300 uppercase tracking-tighter",
                                                                                        children: "DATA HISTORY"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/pages/portal/customer.tsx",
                                                                                        lineNumber: 2757,
                                                                                        columnNumber: 51
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                        className: "text-xs font-black text-indigo-900",
                                                                                        children: String(viewingDetailsKey || rawData.active_details).replace('details-', 'RECORD #')
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/pages/portal/customer.tsx",
                                                                                        lineNumber: 2758,
                                                                                        columnNumber: 51
                                                                                    }, this)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/pages/portal/customer.tsx",
                                                                                lineNumber: 2756,
                                                                                columnNumber: 47
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                                onClick: handleNext,
                                                                                className: "w-9 h-9 flex items-center justify-center bg-white border border-indigo-200 rounded-xl text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all active:scale-90 shadow-sm",
                                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                                    className: "fi flex fi-rr-angle-right mt-0.5"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/pages/portal/customer.tsx",
                                                                                    lineNumber: 2767,
                                                                                    columnNumber: 51
                                                                                }, this)
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/pages/portal/customer.tsx",
                                                                                lineNumber: 2763,
                                                                                columnNumber: 47
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/pages/portal/customer.tsx",
                                                                        lineNumber: 2748,
                                                                        columnNumber: 43
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/customer.tsx",
                                                                    lineNumber: 2747,
                                                                    columnNumber: 39
                                                                }, this);
                                                            }
                                                        }
                                                    } catch (e) {}
                                                    return null;
                                                })(),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                                            className: "text-xs font-medium text-gray-500 block mb-1",
                                                            style: {
                                                                fontFamily: "'Roboto', sans-serif"
                                                            },
                                                            children: "Customer Name"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/customer.tsx",
                                                            lineNumber: 2778,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                            className: "text-sm text-gray-900",
                                                            style: {
                                                                fontFamily: "'Roboto', sans-serif"
                                                            },
                                                            children: selectedCustomer.customer_name || "N/A"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/customer.tsx",
                                                            lineNumber: 2784,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/pages/portal/customer.tsx",
                                                    lineNumber: 2777,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                                            className: "text-xs font-medium text-gray-500 block mb-1",
                                                            style: {
                                                                fontFamily: "'Roboto', sans-serif"
                                                            },
                                                            children: "Phone Number"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/customer.tsx",
                                                            lineNumber: 2792,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                            className: "text-sm text-gray-900",
                                                            style: {
                                                                fontFamily: "'Roboto', sans-serif"
                                                            },
                                                            children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$phoneUtils$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["formatMaskedPhone"])(selectedCustomer.phone_no) || "N/A"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/customer.tsx",
                                                            lineNumber: 2798,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/pages/portal/customer.tsx",
                                                    lineNumber: 2791,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                                            className: "text-xs font-medium text-gray-500 block mb-1",
                                                            style: {
                                                                fontFamily: "'Roboto', sans-serif"
                                                            },
                                                            children: "Lead ID"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/customer.tsx",
                                                            lineNumber: 2806,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                            className: "text-sm text-gray-900",
                                                            style: {
                                                                fontFamily: "'Roboto', sans-serif"
                                                            },
                                                            children: selectedCustomer.lead_id || "N/A"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/customer.tsx",
                                                            lineNumber: 2812,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/pages/portal/customer.tsx",
                                                    lineNumber: 2805,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                                            className: "text-xs font-medium text-gray-500 block mb-1",
                                                            style: {
                                                                fontFamily: "'Roboto', sans-serif"
                                                            },
                                                            children: "Expiry Date"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/customer.tsx",
                                                            lineNumber: 2820,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                            className: "text-sm text-gray-900",
                                                            style: {
                                                                fontFamily: "'Roboto', sans-serif"
                                                            },
                                                            children: selectedCustomer.expiry_date ? formatDate(selectedCustomer.expiry_date) : "N/A"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/customer.tsx",
                                                            lineNumber: 2826,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/pages/portal/customer.tsx",
                                                    lineNumber: 2819,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                                            className: "text-xs font-medium text-gray-500 block mb-1",
                                                            style: {
                                                                fontFamily: "'Roboto', sans-serif"
                                                            },
                                                            children: "Assigned To"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/customer.tsx",
                                                            lineNumber: 2836,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                            className: "text-sm text-gray-900",
                                                            style: {
                                                                fontFamily: "'Roboto', sans-serif"
                                                            },
                                                            children: selectedCustomer.assigned_user_name || selectedCustomer.assigned_employee_id || "N/A"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/customer.tsx",
                                                            lineNumber: 2842,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/pages/portal/customer.tsx",
                                                    lineNumber: 2835,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                                            className: "text-xs font-medium text-gray-500 block mb-1",
                                                            style: {
                                                                fontFamily: "'Roboto', sans-serif"
                                                            },
                                                            children: "Managed By"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/customer.tsx",
                                                            lineNumber: 2852,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: "flex flex-col",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                    className: "text-sm font-semibold text-gray-900",
                                                                    style: {
                                                                        fontFamily: "'Roboto', sans-serif"
                                                                    },
                                                                    children: selectedCustomer.managed_by_name || "Self"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/customer.tsx",
                                                                    lineNumber: 2859,
                                                                    columnNumber: 23
                                                                }, this),
                                                                selectedCustomer.managed_by_id && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                    className: "text-[10px] text-gray-400",
                                                                    style: {
                                                                        fontFamily: "'Roboto', sans-serif"
                                                                    },
                                                                    children: [
                                                                        "ID: ",
                                                                        selectedCustomer.managed_by_id
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/pages/portal/customer.tsx",
                                                                    lineNumber: 2866,
                                                                    columnNumber: 25
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/pages/portal/customer.tsx",
                                                            lineNumber: 2858,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/pages/portal/customer.tsx",
                                                    lineNumber: 2851,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                                            className: "text-xs font-medium text-gray-500 block mb-1",
                                                            style: {
                                                                fontFamily: "'Roboto', sans-serif"
                                                            },
                                                            children: "Status"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/customer.tsx",
                                                            lineNumber: 2876,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: "inline-flex items-center gap-2",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                className: `px-2.5 py-1 rounded-full inline-flex items-center gap-1.5 ${selectedCustomer.status === "active" ? "bg-green-100" : selectedCustomer.status === "inactive" ? "bg-gray-100" : "bg-orange-100"}`,
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                        className: `w-1.5 h-1.5 rounded-full ${selectedCustomer.status === "active" ? "bg-green-500" : selectedCustomer.status === "inactive" ? "bg-gray-400" : "bg-orange-400"}`
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/portal/customer.tsx",
                                                                        lineNumber: 2891,
                                                                        columnNumber: 25
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                        className: `text-xs font-semibold ${selectedCustomer.status === "active" ? "text-green-700" : selectedCustomer.status === "inactive" ? "text-gray-600" : "text-orange-700"}`,
                                                                        children: selectedCustomer.status === "active" ? "Active" : selectedCustomer.status === "inactive" ? "Inactive" : "Pending"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/portal/customer.tsx",
                                                                        lineNumber: 2899,
                                                                        columnNumber: 25
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/pages/portal/customer.tsx",
                                                                lineNumber: 2883,
                                                                columnNumber: 23
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/customer.tsx",
                                                            lineNumber: 2882,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/pages/portal/customer.tsx",
                                                    lineNumber: 2875,
                                                    columnNumber: 19
                                                }, this),
                                                selectedCustomer.campaign_id && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                                            className: "text-xs font-medium text-gray-500 block mb-1",
                                                            style: {
                                                                fontFamily: "'Roboto', sans-serif"
                                                            },
                                                            children: "Campaign ID"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/customer.tsx",
                                                            lineNumber: 2918,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                            className: "text-sm text-gray-900",
                                                            style: {
                                                                fontFamily: "'Roboto', sans-serif"
                                                            },
                                                            children: selectedCustomer.campaign_id
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/customer.tsx",
                                                            lineNumber: 2924,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/pages/portal/customer.tsx",
                                                    lineNumber: 2917,
                                                    columnNumber: 21
                                                }, this),
                                                selectedCustomer.utilities && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                                            className: "text-xs font-medium text-gray-500 block mb-1",
                                                            style: {
                                                                fontFamily: "'Roboto', sans-serif"
                                                            },
                                                            children: "Utilities"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/customer.tsx",
                                                            lineNumber: 2934,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                            className: "text-sm text-gray-900",
                                                            style: {
                                                                fontFamily: "'Roboto', sans-serif"
                                                            },
                                                            children: selectedCustomer.utilities
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/customer.tsx",
                                                            lineNumber: 2940,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/pages/portal/customer.tsx",
                                                    lineNumber: 2933,
                                                    columnNumber: 21
                                                }, this),
                                                selectedCustomer.customer_details && (()=>{
                                                    try {
                                                        const rawData = JSON.parse(selectedCustomer.customer_details);
                                                        let details = rawData;
                                                        if (rawData.active_details && rawData.history) {
                                                            details = rawData.history[viewingDetailsKey || rawData.active_details] || {};
                                                        }
                                                        const checkedFields = Object.entries(details).filter(([key])=>key.endsWith("_checked")).map(([key, value])=>({
                                                                fieldName: key.replace("_checked", ""),
                                                                value: String(value)
                                                            }));
                                                        return checkedFields.map((field)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                                                        className: "text-xs font-medium text-gray-500 block mb-1",
                                                                        style: {
                                                                            fontFamily: "'Roboto', sans-serif"
                                                                        },
                                                                        children: field.fieldName
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/portal/customer.tsx",
                                                                        lineNumber: 2966,
                                                                        columnNumber: 29
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                        className: "text-sm text-gray-900",
                                                                        style: {
                                                                            fontFamily: "'Roboto', sans-serif"
                                                                        },
                                                                        children: field.value
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/portal/customer.tsx",
                                                                        lineNumber: 2972,
                                                                        columnNumber: 29
                                                                    }, this)
                                                                ]
                                                            }, field.fieldName, true, {
                                                                fileName: "[project]/pages/portal/customer.tsx",
                                                                lineNumber: 2965,
                                                                columnNumber: 27
                                                            }, this));
                                                    } catch (e) {
                                                        return null;
                                                    }
                                                })()
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/portal/customer.tsx",
                                            lineNumber: 2721,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/portal/customer.tsx",
                                    lineNumber: 2711,
                                    columnNumber: 15
                                }, this),
                                selectedCustomer.customer_details && (()=>{
                                    try {
                                        const rawData = JSON.parse(selectedCustomer.customer_details);
                                        let details = rawData;
                                        if (rawData.active_details && rawData.history) {
                                            details = rawData.history[viewingDetailsKey || rawData.active_details] || {};
                                        }
                                        const uncheckedFields = Object.entries(details).filter(([key])=>key.endsWith("_unchecked"));
                                        if (uncheckedFields.length === 0) return null;
                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "mb-6",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                                                    className: "text-lg font-semibold mb-4",
                                                    style: {
                                                        color: "#263238",
                                                        fontFamily: "'Poppins', sans-serif"
                                                    },
                                                    children: "Policy Details"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/customer.tsx",
                                                    lineNumber: 3004,
                                                    columnNumber: 25
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "grid grid-cols-1 md:grid-cols-2 gap-4",
                                                    children: uncheckedFields.map(([key, value])=>{
                                                        const displayKey = key.replace("_unchecked", "");
                                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                                                    className: "text-xs font-medium text-gray-500 block mb-1",
                                                                    style: {
                                                                        fontFamily: "'Roboto', sans-serif"
                                                                    },
                                                                    children: displayKey
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/customer.tsx",
                                                                    lineNumber: 3018,
                                                                    columnNumber: 33
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                    className: "text-sm text-gray-900",
                                                                    style: {
                                                                        fontFamily: "'Roboto', sans-serif"
                                                                    },
                                                                    children: String(value)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/customer.tsx",
                                                                    lineNumber: 3024,
                                                                    columnNumber: 33
                                                                }, this)
                                                            ]
                                                        }, key, true, {
                                                            fileName: "[project]/pages/portal/customer.tsx",
                                                            lineNumber: 3017,
                                                            columnNumber: 31
                                                        }, this);
                                                    })
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/customer.tsx",
                                                    lineNumber: 3013,
                                                    columnNumber: 25
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/portal/customer.tsx",
                                            lineNumber: 3003,
                                            columnNumber: 23
                                        }, this);
                                    } catch (e) {
                                        return null;
                                    }
                                })(),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "mb-6",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                                            className: "text-lg font-semibold mb-4",
                                            style: {
                                                color: "#263238",
                                                fontFamily: "'Poppins', sans-serif"
                                            },
                                            children: "Additional Information"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/portal/customer.tsx",
                                            lineNumber: 3043,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "grid grid-cols-1 md:grid-cols-2 gap-4",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                                            className: "text-xs font-medium text-gray-500 block mb-1",
                                                            style: {
                                                                fontFamily: "'Roboto', sans-serif"
                                                            },
                                                            children: "Created Date"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/customer.tsx",
                                                            lineNumber: 3054,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                            className: "text-sm text-gray-900",
                                                            style: {
                                                                fontFamily: "'Roboto', sans-serif"
                                                            },
                                                            children: formatDate(selectedCustomer.created_at)
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/customer.tsx",
                                                            lineNumber: 3060,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/pages/portal/customer.tsx",
                                                    lineNumber: 3053,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                                            className: "text-xs font-medium text-gray-500 block mb-1",
                                                            style: {
                                                                fontFamily: "'Roboto', sans-serif"
                                                            },
                                                            children: "Last Updated"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/customer.tsx",
                                                            lineNumber: 3068,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                            className: "text-sm text-gray-900",
                                                            style: {
                                                                fontFamily: "'Roboto', sans-serif"
                                                            },
                                                            children: formatDate(selectedCustomer.updated_at)
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/customer.tsx",
                                                            lineNumber: 3074,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/pages/portal/customer.tsx",
                                                    lineNumber: 3067,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/portal/customer.tsx",
                                            lineNumber: 3052,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/portal/customer.tsx",
                                    lineNumber: 3042,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "flex justify-end pt-4 border-t border-gray-200",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                        onClick: ()=>{
                                            setShowCustomerDetailsModal(false);
                                            setSelectedCustomer(null);
                                            setViewingDetailsKey(null);
                                        },
                                        className: "px-6 py-2 bg-[#4b33e8] hover:bg-[#3d28b8] text-white rounded-lg text-sm font-medium transition-colors",
                                        style: {
                                            fontFamily: "'Roboto', sans-serif"
                                        },
                                        children: "Close"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/portal/customer.tsx",
                                        lineNumber: 3086,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/pages/portal/customer.tsx",
                                    lineNumber: 3085,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/pages/portal/customer.tsx",
                            lineNumber: 2709,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/pages/portal/customer.tsx",
                    lineNumber: 2684,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/pages/portal/customer.tsx",
                lineNumber: 2683,
                columnNumber: 9
            }, this),
            showFilterModal && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "fixed inset-0 z-[110] flex items-center justify-center bg-black/30 backdrop-blur-sm p-4 text-xs font-sans",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: "bg-white rounded-lg w-full max-w-md shadow-2xl flex flex-col border border-gray-100",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "px-5 py-4 border-b border-gray-100 flex items-center justify-between",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                                            className: "font-bold text-gray-800",
                                            children: "Filter Customers"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/portal/customer.tsx",
                                            lineNumber: 3110,
                                            columnNumber: 17
                                        }, this),
                                        (Object.values(filters).some((v)=>v) || filters.createdStartDate || filters.createdEndDate) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                            className: "px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded text-[10px] font-bold uppercase tracking-widest border border-indigo-100",
                                            children: "Active Filters"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/portal/customer.tsx",
                                            lineNumber: 3112,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/portal/customer.tsx",
                                    lineNumber: 3109,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                    onClick: ()=>setShowFilterModal(false),
                                    className: "text-gray-400 hover:text-gray-600 p-1",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                        className: "fi fi-rr-cross-small text-xl leading-none"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/portal/customer.tsx",
                                        lineNumber: 3121,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/pages/portal/customer.tsx",
                                    lineNumber: 3117,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/pages/portal/customer.tsx",
                            lineNumber: 3108,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "p-5 space-y-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                            className: "block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 pl-0.5",
                                            children: "Organization"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/portal/customer.tsx",
                                            lineNumber: 3128,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("select", {
                                            value: filters.organization || (user?.isClient ? user.organization_id || "" : ""),
                                            disabled: user?.isClient,
                                            onChange: (e)=>{
                                                const newOrg = e.target.value;
                                                setFilters((prev)=>({
                                                        ...prev,
                                                        organization: newOrg,
                                                        campaign: "",
                                                        assignedTo: ""
                                                    }));
                                            },
                                            className: `w-full h-9 px-3 border border-gray-200 rounded text-[11px] font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all font-sans ${user?.isClient ? 'bg-gray-50 cursor-not-allowed text-gray-500' : 'bg-white cursor-pointer text-gray-700'}`,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                    value: "",
                                                    children: "All Organizations"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/customer.tsx",
                                                    lineNumber: 3145,
                                                    columnNumber: 19
                                                }, this),
                                                filterStats.organizations.map((org)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                        value: org.id,
                                                        children: org.company_name
                                                    }, org.id, false, {
                                                        fileName: "[project]/pages/portal/customer.tsx",
                                                        lineNumber: 3147,
                                                        columnNumber: 21
                                                    }, this))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/portal/customer.tsx",
                                            lineNumber: 3131,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/portal/customer.tsx",
                                    lineNumber: 3127,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                            className: "block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 pl-0.5",
                                            children: "Campaign"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/portal/customer.tsx",
                                            lineNumber: 3154,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("select", {
                                            value: filters.campaign,
                                            onChange: (e)=>{
                                                const newCamp = e.target.value;
                                                setFilters((prev)=>({
                                                        ...prev,
                                                        campaign: newCamp,
                                                        assignedTo: ""
                                                    }));
                                            },
                                            className: "w-full h-9 px-3 bg-white border border-gray-200 rounded text-[11px] font-medium text-gray-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all cursor-pointer font-sans",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                    value: "",
                                                    children: "All Campaigns"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/customer.tsx",
                                                    lineNumber: 3169,
                                                    columnNumber: 19
                                                }, this),
                                                filterStats.campaigns.filter((camp)=>filters.organization && camp.organization_id === filters.organization).map((camp)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                        value: camp.id,
                                                        children: camp.name
                                                    }, camp.id, false, {
                                                        fileName: "[project]/pages/portal/customer.tsx",
                                                        lineNumber: 3173,
                                                        columnNumber: 23
                                                    }, this))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/portal/customer.tsx",
                                            lineNumber: 3157,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/portal/customer.tsx",
                                    lineNumber: 3153,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "grid grid-cols-2 gap-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                                    className: "block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 pl-0.5",
                                                    children: "Assigned To"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/customer.tsx",
                                                    lineNumber: 3181,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("select", {
                                                    value: filters.assignedTo,
                                                    onChange: (e)=>setFilters((prev)=>({
                                                                ...prev,
                                                                assignedTo: e.target.value
                                                            })),
                                                    className: "w-full h-9 px-3 bg-white border border-gray-200 rounded text-[11px] font-medium text-gray-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all cursor-pointer font-sans",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                            value: "",
                                                            children: "All Agents"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/customer.tsx",
                                                            lineNumber: 3189,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                            value: "unassigned",
                                                            children: "Unassigned"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/customer.tsx",
                                                            lineNumber: 3190,
                                                            columnNumber: 21
                                                        }, this),
                                                        (()=>{
                                                            const selectedCampaign = filterStats.campaigns.find((c)=>c.id === filters.campaign);
                                                            const campaignUserIds = selectedCampaign?.users?.map((u)=>u.user_id) || [];
                                                            return filterStats.agents.filter((agent)=>{
                                                                const orgMatch = filters.organization && agent.organization_id === filters.organization;
                                                                const campaignMatch = !filters.campaign || campaignUserIds.includes(agent.user_id);
                                                                return orgMatch && campaignMatch;
                                                            }).map((agent)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                                    value: agent.user_id || agent.id,
                                                                    children: agent.user_name
                                                                }, agent.id, false, {
                                                                    fileName: "[project]/pages/portal/customer.tsx",
                                                                    lineNumber: 3202,
                                                                    columnNumber: 27
                                                                }, this));
                                                        })()
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/pages/portal/customer.tsx",
                                                    lineNumber: 3184,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/portal/customer.tsx",
                                            lineNumber: 3180,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                                    className: "block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 pl-0.5",
                                                    children: "Disposition"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/customer.tsx",
                                                    lineNumber: 3208,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("select", {
                                                    value: filters.disposition,
                                                    onChange: (e)=>setFilters((prev)=>({
                                                                ...prev,
                                                                disposition: e.target.value
                                                            })),
                                                    className: "w-full h-9 px-3 bg-white border border-gray-200 rounded text-[11px] font-medium text-gray-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all cursor-pointer font-sans",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                            value: "",
                                                            children: "All Stats"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/customer.tsx",
                                                            lineNumber: 3216,
                                                            columnNumber: 21
                                                        }, this),
                                                        filterStats.dispositions.map((disp)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                                value: disp,
                                                                children: disp
                                                            }, disp, false, {
                                                                fileName: "[project]/pages/portal/customer.tsx",
                                                                lineNumber: 3218,
                                                                columnNumber: 23
                                                            }, this))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/pages/portal/customer.tsx",
                                                    lineNumber: 3211,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/portal/customer.tsx",
                                            lineNumber: 3207,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/portal/customer.tsx",
                                    lineNumber: 3179,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "pt-3 border-t border-gray-100 space-y-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                    className: "text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 pl-0.5",
                                                    children: "Lead Generation Date"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/customer.tsx",
                                                    lineNumber: 3228,
                                                    columnNumber: 20
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "grid grid-cols-2 gap-4",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                                            type: "date",
                                                            value: filters.createdStartDate,
                                                            onChange: (e)=>setFilters((prev)=>({
                                                                        ...prev,
                                                                        createdStartDate: e.target.value
                                                                    })),
                                                            className: "w-full h-9 px-3 bg-white border border-gray-200 rounded text-[11px] font-medium text-gray-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all font-sans"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/customer.tsx",
                                                            lineNumber: 3230,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                                            type: "date",
                                                            value: filters.createdEndDate,
                                                            onChange: (e)=>setFilters((prev)=>({
                                                                        ...prev,
                                                                        createdEndDate: e.target.value
                                                                    })),
                                                            className: "w-full h-9 px-3 bg-white border border-gray-200 rounded text-[11px] font-medium text-gray-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all font-sans"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/customer.tsx",
                                                            lineNumber: 3236,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/pages/portal/customer.tsx",
                                                    lineNumber: 3229,
                                                    columnNumber: 20
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/portal/customer.tsx",
                                            lineNumber: 3227,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                    className: "text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 pl-0.5",
                                                    children: "Policy Expiry Window"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/customer.tsx",
                                                    lineNumber: 3247,
                                                    columnNumber: 20
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "grid grid-cols-2 gap-4",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                                            type: "date",
                                                            value: filters.startDate,
                                                            onChange: (e)=>setFilters((prev)=>({
                                                                        ...prev,
                                                                        startDate: e.target.value
                                                                    })),
                                                            className: "w-full h-9 px-3 bg-white border border-gray-200 rounded text-[11px] font-medium text-gray-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all font-sans"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/customer.tsx",
                                                            lineNumber: 3249,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                                            type: "date",
                                                            value: filters.endDate,
                                                            onChange: (e)=>setFilters((prev)=>({
                                                                        ...prev,
                                                                        endDate: e.target.value
                                                                    })),
                                                            className: "w-full h-9 px-3 bg-white border border-gray-200 rounded text-[11px] font-medium text-gray-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all font-sans"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/customer.tsx",
                                                            lineNumber: 3255,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/pages/portal/customer.tsx",
                                                    lineNumber: 3248,
                                                    columnNumber: 20
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/portal/customer.tsx",
                                            lineNumber: 3246,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/portal/customer.tsx",
                                    lineNumber: 3225,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/pages/portal/customer.tsx",
                            lineNumber: 3125,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "px-5 py-3 border-t border-gray-100 flex items-center justify-between bg-white rounded-b-lg",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                    onClick: ()=>{
                                        setFilters({
                                            organization: "",
                                            campaign: "",
                                            assignedTo: "",
                                            disposition: "",
                                            startDate: "",
                                            endDate: "",
                                            createdStartDate: "",
                                            createdEndDate: ""
                                        });
                                    },
                                    className: "px-4 py-1.5 border border-gray-200 text-gray-600 rounded hover:bg-gray-50 font-semibold transition-all",
                                    children: "Reset"
                                }, void 0, false, {
                                    fileName: "[project]/pages/portal/customer.tsx",
                                    lineNumber: 3268,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                    onClick: ()=>{
                                        setShowFilterModal(false);
                                        fetchCustomers(1);
                                    },
                                    className: "px-6 py-1.5 bg-[#1e1b4b] text-white rounded font-bold uppercase tracking-widest hover:bg-indigo-900 transition-all shadow-sm shadow-indigo-100",
                                    children: "Apply Records"
                                }, void 0, false, {
                                    fileName: "[project]/pages/portal/customer.tsx",
                                    lineNumber: 3285,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/pages/portal/customer.tsx",
                            lineNumber: 3267,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/pages/portal/customer.tsx",
                    lineNumber: 3106,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/pages/portal/customer.tsx",
                lineNumber: 3105,
                columnNumber: 9
            }, this),
            showDuplicateModal && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "fixed inset-0 z-[130] flex items-center justify-center bg-black/30 backdrop-blur-sm p-4 text-xs",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: "bg-white rounded-lg w-full max-w-4xl shadow-2xl flex flex-col max-h-[80vh] border border-gray-100",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "px-5 py-4 border-b border-gray-100 flex items-center justify-between",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-6",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                                            className: "font-bold text-gray-800",
                                            children: "Duplicate Entries"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/portal/customer.tsx",
                                            lineNumber: 3306,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "flex items-center gap-3 ml-4 bg-gray-50 rounded-lg p-1 border border-gray-100",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center gap-2 px-2 border-r border-gray-200 pr-3",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                                            type: "checkbox",
                                                            className: "w-4 h-4 rounded border-gray-300 text-rose-600 focus:ring-rose-500 cursor-pointer",
                                                            checked: filteredDuplicateLeads.length > 0 && filteredDuplicateLeads.every((l)=>selectedDuplicateLeads.has(l.lead_id)),
                                                            onChange: (e)=>{
                                                                const newSelected = new Set(selectedDuplicateLeads);
                                                                filteredDuplicateLeads.forEach((l)=>{
                                                                    if (e.target.checked) newSelected.add(l.lead_id);
                                                                    else newSelected.delete(l.lead_id);
                                                                });
                                                                setSelectedDuplicateLeads(newSelected);
                                                            }
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/customer.tsx",
                                                            lineNumber: 3310,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                            className: "text-[10px] font-bold text-gray-500 uppercase tracking-tighter",
                                                            children: "Select All"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/customer.tsx",
                                                            lineNumber: 3323,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/pages/portal/customer.tsx",
                                                    lineNumber: 3309,
                                                    columnNumber: 20
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("select", {
                                                    value: duplicateDispositionFilter,
                                                    onChange: (e)=>setDuplicateDispositionFilter(e.target.value),
                                                    className: "px-2 py-1 bg-transparent text-[11px] text-gray-600 focus:outline-none min-w-[130px]",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                            value: "",
                                                            children: "All Dispositions"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/customer.tsx",
                                                            lineNumber: 3331,
                                                            columnNumber: 21
                                                        }, this),
                                                        [
                                                            ...new Set(duplicateLeads.map((l)=>l.disposition).filter(Boolean))
                                                        ].sort().map((disp)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                                value: disp,
                                                                children: disp
                                                            }, disp, false, {
                                                                fileName: "[project]/pages/portal/customer.tsx",
                                                                lineNumber: 3333,
                                                                columnNumber: 23
                                                            }, this))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/pages/portal/customer.tsx",
                                                    lineNumber: 3326,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("select", {
                                                    value: duplicateCampaignFilter,
                                                    onChange: (e)=>setDuplicateCampaignFilter(e.target.value),
                                                    className: "px-2 py-1.5 bg-white border border-gray-200 rounded text-[11px] text-gray-600 focus:outline-none min-w-[140px]",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                            value: "",
                                                            children: "All Campaigns"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/customer.tsx",
                                                            lineNumber: 3341,
                                                            columnNumber: 21
                                                        }, this),
                                                        [
                                                            ...new Set(duplicateLeads.map((l)=>l.campaign_name || l.campaign_id).filter(Boolean))
                                                        ].sort().map((camp)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                                value: camp,
                                                                children: camp
                                                            }, camp, false, {
                                                                fileName: "[project]/pages/portal/customer.tsx",
                                                                lineNumber: 3343,
                                                                columnNumber: 23
                                                            }, this))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/pages/portal/customer.tsx",
                                                    lineNumber: 3336,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/portal/customer.tsx",
                                            lineNumber: 3308,
                                            columnNumber: 18
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/portal/customer.tsx",
                                    lineNumber: 3305,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                    onClick: ()=>{
                                        setShowDuplicateModal(false);
                                        setDuplicateDispositionFilter("");
                                        setDuplicateCampaignFilter("");
                                    },
                                    className: "text-gray-400 hover:text-gray-600 p-1",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                        className: "fi fi-rr-cross-small text-xl leading-none"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/portal/customer.tsx",
                                        lineNumber: 3357,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/pages/portal/customer.tsx",
                                    lineNumber: 3349,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/pages/portal/customer.tsx",
                            lineNumber: 3304,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "flex-1 overflow-y-auto custom-scrollbar",
                            children: loadingDuplicates ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "py-20 text-center text-gray-400 uppercase tracking-widest text-[10px] font-medium",
                                children: "Scanning for duplicates..."
                            }, void 0, false, {
                                fileName: "[project]/pages/portal/customer.tsx",
                                lineNumber: 3363,
                                columnNumber: 17
                            }, this) : duplicateLeads.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "py-20 text-center text-gray-400 text-sm",
                                children: "No duplicates found."
                            }, void 0, false, {
                                fileName: "[project]/pages/portal/customer.tsx",
                                lineNumber: 3367,
                                columnNumber: 17
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "divide-y divide-gray-100",
                                children: Object.values(filteredDuplicateLeads.reduce((acc, lead)=>{
                                    if (!acc[lead.phone_search_hash]) acc[lead.phone_search_hash] = [];
                                    acc[lead.phone_search_hash].push(lead);
                                    return acc;
                                }, {})).map((group, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
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
                                                                className: "w-4 h-4 rounded border-gray-300 text-rose-600 focus:ring-rose-500 cursor-pointer",
                                                                checked: group.every((item)=>selectedDuplicateLeads.has(item.lead_id)),
                                                                onChange: (e)=>{
                                                                    const newSelected = new Set(selectedDuplicateLeads);
                                                                    group.forEach((item)=>{
                                                                        if (e.target.checked) newSelected.add(item.lead_id);
                                                                        else newSelected.delete(item.lead_id);
                                                                    });
                                                                    setSelectedDuplicateLeads(newSelected);
                                                                }
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/customer.tsx",
                                                                lineNumber: 3380,
                                                                columnNumber: 28
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                className: "font-bold text-gray-500 uppercase text-[10px]",
                                                                children: [
                                                                    "Group ",
                                                                    idx + 1
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/pages/portal/customer.tsx",
                                                                lineNumber: 3393,
                                                                columnNumber: 28
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/pages/portal/customer.tsx",
                                                        lineNumber: 3379,
                                                        columnNumber: 25
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: "flex items-center gap-4",
                                                        children: [
                                                            group.some((item)=>selectedDuplicateLeads.has(item.lead_id)) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                onClick: ()=>{
                                                                    const selectedItemsInGroup = group.filter((item)=>selectedDuplicateLeads.has(item.lead_id));
                                                                    handleDeleteMultipleDuplicates(selectedItemsInGroup);
                                                                },
                                                                className: "text-[10px] font-bold text-rose-600 hover:text-rose-700 uppercase tracking-tight flex items-center gap-1.5 transition-colors",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                        className: "fi fi-rr-trash"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/portal/customer.tsx",
                                                                        lineNumber: 3404,
                                                                        columnNumber: 32
                                                                    }, this),
                                                                    "Delete Selected"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/pages/portal/customer.tsx",
                                                                lineNumber: 3397,
                                                                columnNumber: 30
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                className: "text-[10px] text-gray-400",
                                                                children: [
                                                                    group.length,
                                                                    " records"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/pages/portal/customer.tsx",
                                                                lineNumber: 3408,
                                                                columnNumber: 28
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/pages/portal/customer.tsx",
                                                        lineNumber: 3395,
                                                        columnNumber: 25
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/pages/portal/customer.tsx",
                                                lineNumber: 3378,
                                                columnNumber: 23
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("table", {
                                                className: "w-full text-left",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("thead", {
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("tr", {
                                                            className: "text-gray-400 uppercase text-[9px] font-bold border-b border-gray-50",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                                    className: "px-5 py-2 w-10"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/customer.tsx",
                                                                    lineNumber: 3414,
                                                                    columnNumber: 29
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                                    className: "px-5 py-2",
                                                                    children: "Customer / Phone"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/customer.tsx",
                                                                    lineNumber: 3415,
                                                                    columnNumber: 29
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                                    className: "px-3 py-2",
                                                                    children: "Lead ID"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/customer.tsx",
                                                                    lineNumber: 3416,
                                                                    columnNumber: 29
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                                    className: "px-3 py-2",
                                                                    children: "Date"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/customer.tsx",
                                                                    lineNumber: 3417,
                                                                    columnNumber: 29
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                                    className: "px-3 py-2",
                                                                    children: "Stage"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/customer.tsx",
                                                                    lineNumber: 3418,
                                                                    columnNumber: 29
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                                    className: "px-3 py-2",
                                                                    children: "Campaign"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/customer.tsx",
                                                                    lineNumber: 3419,
                                                                    columnNumber: 29
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                                    className: "px-3 py-2",
                                                                    children: "Agent"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/customer.tsx",
                                                                    lineNumber: 3420,
                                                                    columnNumber: 29
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                                    className: "px-3 py-2",
                                                                    children: "Status"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/customer.tsx",
                                                                    lineNumber: 3421,
                                                                    columnNumber: 29
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                                    className: "px-5 py-2"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/customer.tsx",
                                                                    lineNumber: 3422,
                                                                    columnNumber: 29
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/pages/portal/customer.tsx",
                                                            lineNumber: 3413,
                                                            columnNumber: 27
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/customer.tsx",
                                                        lineNumber: 3412,
                                                        columnNumber: 25
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("tbody", {
                                                        className: "divide-y divide-gray-50",
                                                        children: group.map((item, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("tr", {
                                                                className: `hover:bg-gray-50/30 transition-colors text-[11px] ${selectedDuplicateLeads.has(item.lead_id) ? 'bg-rose-50/20' : ''}`,
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                                        className: "px-5 py-3",
                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                                                            type: "checkbox",
                                                                            className: "w-3.5 h-3.5 rounded border-gray-300 text-rose-600 focus:ring-rose-500 cursor-pointer",
                                                                            checked: selectedDuplicateLeads.has(item.lead_id),
                                                                            onChange: ()=>{
                                                                                const newSelected = new Set(selectedDuplicateLeads);
                                                                                if (newSelected.has(item.lead_id)) newSelected.delete(item.lead_id);
                                                                                else newSelected.add(item.lead_id);
                                                                                setSelectedDuplicateLeads(newSelected);
                                                                            }
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/pages/portal/customer.tsx",
                                                                            lineNumber: 3429,
                                                                            columnNumber: 33
                                                                        }, this)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/portal/customer.tsx",
                                                                        lineNumber: 3428,
                                                                        columnNumber: 31
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                                        className: "px-5 py-3",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                className: "font-semibold text-gray-800",
                                                                                children: item.customer_name
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/pages/portal/customer.tsx",
                                                                                lineNumber: 3442,
                                                                                columnNumber: 33
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                className: "text-gray-400",
                                                                                children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$phoneUtils$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["formatMaskedPhone"])(item.phone_no)
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/pages/portal/customer.tsx",
                                                                                lineNumber: 3443,
                                                                                columnNumber: 33
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/pages/portal/customer.tsx",
                                                                        lineNumber: 3441,
                                                                        columnNumber: 31
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                                        className: "px-3 py-3 text-gray-500",
                                                                        children: item.lead_id || '-'
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/portal/customer.tsx",
                                                                        lineNumber: 3445,
                                                                        columnNumber: 31
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                                        className: "px-3 py-3 text-gray-500",
                                                                        children: item.created_at ? new Date(item.created_at).toLocaleDateString('en-GB') : '-'
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/portal/customer.tsx",
                                                                        lineNumber: 3446,
                                                                        columnNumber: 31
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                                        className: "px-3 py-3",
                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                            className: `font-bold ${item.stage === 'Live' ? 'text-indigo-600' : item.stage === 'Rejected' ? 'text-rose-500' : 'text-emerald-600'}`,
                                                                            children: item.stage
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/pages/portal/customer.tsx",
                                                                            lineNumber: 3450,
                                                                            columnNumber: 33
                                                                        }, this)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/portal/customer.tsx",
                                                                        lineNumber: 3449,
                                                                        columnNumber: 31
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                                        className: "px-3 py-3 text-gray-600",
                                                                        children: item.campaign_name || item.campaign_id || '-'
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/portal/customer.tsx",
                                                                        lineNumber: 3458,
                                                                        columnNumber: 31
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                                        className: "px-3 py-3 text-gray-600",
                                                                        children: item.assigned_to_name || '-'
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/portal/customer.tsx",
                                                                        lineNumber: 3459,
                                                                        columnNumber: 31
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                                        className: "px-3 py-3 text-gray-600",
                                                                        children: item.disposition || '-'
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/portal/customer.tsx",
                                                                        lineNumber: 3460,
                                                                        columnNumber: 31
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                                        className: "px-5 py-3 text-right",
                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                            onClick: ()=>handleDeleteDuplicateEntry(item),
                                                                            className: "text-gray-300 hover:text-rose-500 transition-colors",
                                                                            title: "Delete Entry",
                                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                                className: "fi fi-rr-trash"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/pages/portal/customer.tsx",
                                                                                lineNumber: 3467,
                                                                                columnNumber: 35
                                                                            }, this)
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/pages/portal/customer.tsx",
                                                                            lineNumber: 3462,
                                                                            columnNumber: 33
                                                                        }, this)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/portal/customer.tsx",
                                                                        lineNumber: 3461,
                                                                        columnNumber: 31
                                                                    }, this)
                                                                ]
                                                            }, i, true, {
                                                                fileName: "[project]/pages/portal/customer.tsx",
                                                                lineNumber: 3427,
                                                                columnNumber: 29
                                                            }, this))
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/customer.tsx",
                                                        lineNumber: 3425,
                                                        columnNumber: 25
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/pages/portal/customer.tsx",
                                                lineNumber: 3411,
                                                columnNumber: 23
                                            }, this)
                                        ]
                                    }, idx, true, {
                                        fileName: "[project]/pages/portal/customer.tsx",
                                        lineNumber: 3377,
                                        columnNumber: 21
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/pages/portal/customer.tsx",
                                lineNumber: 3371,
                                columnNumber: 17
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/pages/portal/customer.tsx",
                            lineNumber: 3361,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "px-5 py-3 border-t border-gray-100 flex items-center justify-between bg-white rounded-b-lg",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-6",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                            className: "text-gray-400 font-medium",
                                            children: [
                                                "Groups: ",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                    className: "text-gray-700 font-bold",
                                                    children: Object.keys(filteredDuplicateLeads.reduce((acc, l)=>({
                                                            ...acc,
                                                            [l.phone_search_hash]: 1
                                                        }), {})).length
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/customer.tsx",
                                                    lineNumber: 3484,
                                                    columnNumber: 27
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/portal/customer.tsx",
                                            lineNumber: 3483,
                                            columnNumber: 17
                                        }, this),
                                        selectedDuplicateLeads.size > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                            onClick: ()=>{
                                                const itemsToDelete = filteredDuplicateLeads.filter((l)=>selectedDuplicateLeads.has(l.lead_id));
                                                handleDeleteMultipleDuplicates(itemsToDelete);
                                            },
                                            className: "px-3 py-1 bg-rose-600 text-white rounded text-[10px] font-bold uppercase tracking-wider hover:bg-rose-700 transition-colors flex items-center gap-2 shadow-sm shadow-rose-100",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                    className: "fi fi-rr-trash"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/customer.tsx",
                                                    lineNumber: 3494,
                                                    columnNumber: 21
                                                }, this),
                                                "Delete All Selected (",
                                                selectedDuplicateLeads.size,
                                                ")"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/portal/customer.tsx",
                                            lineNumber: 3487,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/portal/customer.tsx",
                                    lineNumber: 3482,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                    onClick: ()=>{
                                        setShowDuplicateModal(false);
                                        setDuplicateDispositionFilter("");
                                        setDuplicateCampaignFilter("");
                                    },
                                    className: "px-4 py-1.5 border border-gray-200 text-gray-600 rounded hover:bg-gray-50 font-semibold transition-all",
                                    children: "Done"
                                }, void 0, false, {
                                    fileName: "[project]/pages/portal/customer.tsx",
                                    lineNumber: 3499,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/pages/portal/customer.tsx",
                            lineNumber: 3481,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/pages/portal/customer.tsx",
                    lineNumber: 3302,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/pages/portal/customer.tsx",
                lineNumber: 3301,
                columnNumber: 9
            }, this),
            showBulkActionModal && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "fixed inset-0 z-[120] flex items-center justify-center bg-black/30 backdrop-blur-sm p-4 text-xs font-sans",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: "bg-white rounded-lg w-full max-w-lg shadow-2xl flex flex-col border border-gray-100",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "px-5 py-4 border-b border-gray-100 flex items-center justify-between",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-3",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                                            className: "font-bold text-gray-800",
                                            children: "Bulk Update Records"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/portal/customer.tsx",
                                            lineNumber: 3520,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                            className: "px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded text-[10px] font-bold uppercase tracking-widest border border-indigo-100",
                                            children: [
                                                selectedCustomers.size,
                                                " Items"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/portal/customer.tsx",
                                            lineNumber: 3521,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/portal/customer.tsx",
                                    lineNumber: 3519,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                    onClick: ()=>setShowBulkActionModal(false),
                                    className: "text-gray-400 hover:text-gray-600 p-1",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                        className: "fi fi-rr-cross-small text-xl leading-none"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/portal/customer.tsx",
                                        lineNumber: 3529,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/pages/portal/customer.tsx",
                                    lineNumber: 3525,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/pages/portal/customer.tsx",
                            lineNumber: 3518,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "p-6 space-y-5",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "grid grid-cols-1 sm:grid-cols-2 gap-4",
                                    children: [
                                        permissionFlags.isChangeOrganizationButtonVisible && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "space-y-1.5",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                                    className: "text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-0.5",
                                                    children: "Organization"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/customer.tsx",
                                                    lineNumber: 3538,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("select", {
                                                    value: bulkUpdates.organization_id || (user?.isClient ? user.organization_id || "" : ""),
                                                    disabled: user?.isClient,
                                                    onChange: (e)=>setBulkUpdates((prev)=>({
                                                                ...prev,
                                                                organization_id: e.target.value
                                                            })),
                                                    className: `w-full h-9 px-3 border border-gray-200 rounded text-[11px] font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all font-sans ${user?.isClient ? 'bg-gray-50 cursor-not-allowed text-gray-500' : 'bg-white text-gray-700'}`,
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                            value: "",
                                                            children: "No Change"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/customer.tsx",
                                                            lineNumber: 3545,
                                                            columnNumber: 23
                                                        }, this),
                                                        filterStats.organizations.map((org)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                                value: org.id,
                                                                children: org.company_name
                                                            }, org.id, false, {
                                                                fileName: "[project]/pages/portal/customer.tsx",
                                                                lineNumber: 3547,
                                                                columnNumber: 25
                                                            }, this))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/pages/portal/customer.tsx",
                                                    lineNumber: 3539,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/portal/customer.tsx",
                                            lineNumber: 3537,
                                            columnNumber: 19
                                        }, this),
                                        permissionFlags.isChangeCampaginButtonVisible && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "space-y-1.5",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                                    className: "text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-0.5",
                                                    children: "Campaign"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/customer.tsx",
                                                    lineNumber: 3556,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("select", {
                                                    value: bulkUpdates.campaign_id,
                                                    onChange: (e)=>setBulkUpdates((prev)=>({
                                                                ...prev,
                                                                campaign_id: e.target.value
                                                            })),
                                                    className: "w-full h-9 px-3 bg-white border border-gray-200 rounded text-[11px] font-medium text-gray-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all font-sans",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                            value: "",
                                                            children: "No Change"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/customer.tsx",
                                                            lineNumber: 3562,
                                                            columnNumber: 23
                                                        }, this),
                                                        filterStats.campaigns.filter((camp)=>bulkUpdates.organization_id && camp.organization_id === bulkUpdates.organization_id).map((camp)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                                value: camp.id,
                                                                children: camp.name
                                                            }, camp.id, false, {
                                                                fileName: "[project]/pages/portal/customer.tsx",
                                                                lineNumber: 3566,
                                                                columnNumber: 25
                                                            }, this))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/pages/portal/customer.tsx",
                                                    lineNumber: 3557,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/portal/customer.tsx",
                                            lineNumber: 3555,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/portal/customer.tsx",
                                    lineNumber: 3534,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "grid grid-cols-1 sm:grid-cols-2 gap-4",
                                    children: [
                                        permissionFlags.isChangeAssignedButtonVisible && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "space-y-1.5",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                                    className: "text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-0.5",
                                                    children: "Assign To"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/customer.tsx",
                                                    lineNumber: 3577,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("select", {
                                                    value: bulkUpdates.assigned_to,
                                                    onChange: (e)=>setBulkUpdates((prev)=>({
                                                                ...prev,
                                                                assigned_to: e.target.value
                                                            })),
                                                    className: "w-full h-9 px-3 bg-white border border-gray-200 rounded text-[11px] font-medium text-gray-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all font-sans",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                            value: "",
                                                            children: "No Change"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/customer.tsx",
                                                            lineNumber: 3583,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                            value: "unassigned",
                                                            children: "Unassigned (Clear Agent)"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/customer.tsx",
                                                            lineNumber: 3584,
                                                            columnNumber: 23
                                                        }, this),
                                                        filterStats.agents.filter((a)=>bulkUpdates.organization_id && a.organization_id === bulkUpdates.organization_id).map((agent)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                                value: agent.user_id || agent.id,
                                                                children: agent.user_name
                                                            }, agent.id, false, {
                                                                fileName: "[project]/pages/portal/customer.tsx",
                                                                lineNumber: 3588,
                                                                columnNumber: 25
                                                            }, this))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/pages/portal/customer.tsx",
                                                    lineNumber: 3578,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/portal/customer.tsx",
                                            lineNumber: 3576,
                                            columnNumber: 19
                                        }, this),
                                        permissionFlags.isChangeDispostionButtonVisible && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "space-y-1.5",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                                    className: "text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-0.5",
                                                    children: "Disposition"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/customer.tsx",
                                                    lineNumber: 3597,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("select", {
                                                    value: bulkUpdates.disposition,
                                                    onChange: (e)=>setBulkUpdates((prev)=>({
                                                                ...prev,
                                                                disposition: e.target.value
                                                            })),
                                                    className: "w-full h-9 px-3 bg-white border border-gray-200 rounded text-[11px] font-medium text-gray-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all font-sans",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                            value: "",
                                                            children: "No Change"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/customer.tsx",
                                                            lineNumber: 3603,
                                                            columnNumber: 23
                                                        }, this),
                                                        filterStats.dispositions.map((disp)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                                value: disp,
                                                                children: disp
                                                            }, disp, false, {
                                                                fileName: "[project]/pages/portal/customer.tsx",
                                                                lineNumber: 3605,
                                                                columnNumber: 25
                                                            }, this))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/pages/portal/customer.tsx",
                                                    lineNumber: 3598,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/portal/customer.tsx",
                                            lineNumber: 3596,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/portal/customer.tsx",
                                    lineNumber: 3573,
                                    columnNumber: 15
                                }, this),
                                permissionFlags.isMoveFreshButtonVisible && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "pt-2",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                        onClick: ()=>{
                                            if (confirm(`Are you sure you want to reset ${selectedCustomers.size} leads to Fresh state? This will clear all history and assignments.`)) {
                                                handleBulkUpdate({
                                                    action: "Move Fresh"
                                                });
                                            }
                                        },
                                        className: "w-full h-9 flex items-center justify-center gap-2 border border-rose-200 bg-rose-50 text-rose-600 rounded text-[10px] font-bold uppercase tracking-widest hover:bg-rose-100 transition-all",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                className: "fi flex fi-rr-refresh"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/portal/customer.tsx",
                                                lineNumber: 3623,
                                                columnNumber: 21
                                            }, this),
                                            "Reset to Fresh Leads"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/portal/customer.tsx",
                                        lineNumber: 3615,
                                        columnNumber: 19
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/pages/portal/customer.tsx",
                                    lineNumber: 3614,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/pages/portal/customer.tsx",
                            lineNumber: 3533,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "px-5 py-3 border-t border-gray-100 flex items-center justify-between bg-white rounded-b-lg",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                    onClick: ()=>setShowBulkActionModal(false),
                                    className: "px-4 py-1.5 border border-gray-200 text-gray-600 rounded hover:bg-gray-50 font-semibold transition-all",
                                    children: "Cancel"
                                }, void 0, false, {
                                    fileName: "[project]/pages/portal/customer.tsx",
                                    lineNumber: 3631,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                    disabled: isUpdatingBulk || !Object.entries(bulkUpdates).some(([k, v])=>v !== ""),
                                    onClick: ()=>{
                                        const cleanUpdates = {};
                                        if (bulkUpdates.organization_id) cleanUpdates.organization_id = bulkUpdates.organization_id;
                                        if (bulkUpdates.campaign_id) cleanUpdates.campaign_id = bulkUpdates.campaign_id;
                                        if (bulkUpdates.assigned_to) cleanUpdates.assigned_to = bulkUpdates.assigned_to === "unassigned" ? null : bulkUpdates.assigned_to;
                                        if (bulkUpdates.disposition) cleanUpdates.disposition = bulkUpdates.disposition;
                                        handleBulkUpdate(cleanUpdates);
                                    },
                                    className: "px-6 py-1.5 bg-indigo-600 text-white rounded font-bold uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-sm shadow-indigo-100 disabled:opacity-50",
                                    children: isUpdatingBulk ? "Updating..." : `Apply Changes (${selectedCustomers.size})`
                                }, void 0, false, {
                                    fileName: "[project]/pages/portal/customer.tsx",
                                    lineNumber: 3637,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/pages/portal/customer.tsx",
                            lineNumber: 3630,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/pages/portal/customer.tsx",
                    lineNumber: 3516,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/pages/portal/customer.tsx",
                lineNumber: 3515,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true);
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__28b1b0ee._.js.map