import React, { useState, useRef, useEffect } from "react";
import * as XLSX from "xlsx";
import { supabase } from "@/lib/supabase";
import { encryptPhone, computePhoneHash } from "@/lib/phoneUtils";
import { logSystemEvent, estimateSize } from "@/lib/monitoring";

interface AppendLeadsModalProps {
  show: boolean;
  onClose: () => void;
  onSuccess: () => void;
  workflow: any;
}

export default function AppendLeadsModal({
  show,
  onClose,
  onSuccess,
  workflow,
}: AppendLeadsModalProps) {
  // Modal visibility states
  const [showImportModal, setShowImportModal] = useState(show);
  const [showMappingModal, setShowMappingModal] = useState(false);
  const [showFileConflictModal, setShowFileConflictModal] = useState(false);
  const [showDbConflictModal, setShowDbConflictModal] = useState(false);

  // File and Column states
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [fileHeaders, setFileHeaders] = useState<string[]>([]);
  const [fileRawRows, setFileRawRows] = useState<Record<string, any>[]>([]);

  // Mapping states
  const [fieldMapping, setFieldMapping] = useState<Record<string, string>>({
    name: "",
    phone: "",
    expiry_date: "",
  });
  const [mergedFields, setMergedFields] = useState<Record<string, string[]>>({});
  const [customFields, setCustomFields] = useState<
    Array<{ id: string; name: string; mappedTo: string; isEdited?: boolean }>
  >([]);
  const [selectedFields, setSelectedFields] = useState<Record<string, boolean>>({
    name: true,
    phone: true,
    expiry_date: true,
  });
  const [customExpiryDate, setCustomExpiryDate] = useState("");
  const [sourceName, setSourceName] = useState("");

  // Processing & verification states
  const [importing, setImporting] = useState(false);
  const [importError, setImportError] = useState("");
  const [importSuccess, setImportSuccess] = useState("");
  const [initialRecordCount, setInitialRecordCount] = useState(0);
  const [fullyProcessedLeads, setFullyProcessedLeads] = useState<any[]>([]);

  // Step 1: Internal File Deduplication
  const [fileConflicts, setFileConflicts] = useState<any[]>([]);
  const [selectedFileConflicts, setSelectedFileConflicts] = useState<Set<number>>(new Set());
  const [isFileVerificationComplete, setIsFileVerificationComplete] = useState(false);

  // Step 2: Database Correlation Check (Customers CRM & Lead Scheduled)
  const [dbConflicts, setDbConflicts] = useState<any[]>([]);
  const [selectedDbConflicts, setSelectedDbConflicts] = useState<Set<number>>(new Set());
  const [isScanningDb, setIsScanningDb] = useState(false);
  const [isDbScanComplete, setIsDbScanComplete] = useState(false);
  const [isFinalizing, setIsFinalizing] = useState(false);

  // Extended end date state if existing end_date is expired
  const isEndDateExpired = workflow?.end_date && new Date(workflow.end_date) < new Date();
  const [newEndDate, setNewEndDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return d.toISOString().split("T")[0];
  });

  useEffect(() => {
    setShowImportModal(show);
    if (!show) {
      handleReset();
    }
  }, [show]);

  const handleReset = () => {
    setImportFile(null);
    setFileHeaders([]);
    setFileRawRows([]);
    setFieldMapping({ name: "", phone: "", expiry_date: "" });
    setMergedFields({});
    setCustomFields([]);
    setImportError("");
    setImportSuccess("");
    setSourceName("");
    setFileConflicts([]);
    setShowFileConflictModal(false);
    setSelectedFileConflicts(new Set());
    setFullyProcessedLeads([]);
    setIsFileVerificationComplete(false);
    setDbConflicts([]);
    setShowDbConflictModal(false);
    setIsScanningDb(false);
    setIsDbScanComplete(false);
    setIsFinalizing(false);
    setInitialRecordCount(0);
    setSelectedDbConflicts(new Set());
  };

  const handleClose = () => {
    handleReset();
    setShowImportModal(false);
    setShowMappingModal(false);
    setShowFileConflictModal(false);
    setShowDbConflictModal(false);
    onClose();
  };

  // Helper to extract value with merged fields
  const getFieldValue = (
    row: Record<string, any>,
    fieldKey: string,
    mapping: Record<string, string>,
    merged: Record<string, string[]>
  ): string => {
    const mainColumn = mapping[fieldKey];
    if (!mainColumn) return "";
    let value = String(row[mainColumn] || "");
    const extras = merged[fieldKey] || [];
    if (extras.length > 0) {
      const mergedValues = extras
        .filter((col) => col && row[col])
        .map((col) => String(row[col]))
        .join(" ");
      if (mergedValues) value = value ? `${value} ${mergedValues}` : mergedValues;
    }
    return value.trim();
  };

  // Upload & parse file (supports CSV, XLSX, XLS)
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImportError("");
    setImportFile(file);
    setSourceName(file.name.replace(/\.[^/.]+$/, ""));

    try {
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: "array" });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const rows: Record<string, any>[] = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

      if (rows.length === 0) {
        setImportError("Uploaded file is empty or contains no records.");
        return;
      }

      const headers = Object.keys(rows[0] || {}).map((h) => h.trim());
      setFileHeaders(headers);
      setFileRawRows(rows);

      // Smart auto-detection of core CRM fields
      const savedMap = workflow?.column_mapping || {};
      const nameMatch =
        (savedMap.name && headers.includes(savedMap.name) ? savedMap.name : "") ||
        headers.find((h) => /name|customer|client|full_name/i.test(h)) ||
        headers[0] ||
        "";

      const phoneMatch =
        (savedMap.phone && headers.includes(savedMap.phone) ? savedMap.phone : "") ||
        headers.find((h) => /phone|mobile|contact|cell|number/i.test(h)) ||
        headers[1] ||
        "";

      const expiryMatch =
        (savedMap.expiry && headers.includes(savedMap.expiry) ? savedMap.expiry : "") ||
        headers.find((h) => /expiry|exp|due_date|valid/i.test(h)) ||
        "";

      const initialMapping: Record<string, string> = {
        name: nameMatch,
        phone: phoneMatch,
        expiry_date: expiryMatch,
      };

      const mappedCols = new Set<string>([nameMatch, phoneMatch, expiryMatch].filter(Boolean));

      // Auto-generate custom fields for all other remaining columns
      const autoCustomFields = headers
        .filter((col) => !mappedCols.has(col) && col.trim() !== "")
        .map((col) => ({
          id: `col_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
          name: col,
          mappedTo: col,
          isEdited: false,
        }));

      setFieldMapping(initialMapping);
      setCustomFields(autoCustomFields);
      setShowMappingModal(true);
    } catch (err: any) {
      console.error("File parsing error:", err);
      setImportError(err.message || "Failed to read file.");
    }
  };

  /* Custom Fields Management */
  const addCustomField = () => {
    setCustomFields([
      ...customFields,
      { id: Date.now().toString(), name: "", mappedTo: "", isEdited: false },
    ]);
  };

  const removeCustomField = (id: string) => {
    setCustomFields(customFields.filter((f) => f.id !== id));
  };

  const updateCustomField = (id: string, key: "name" | "mappedTo", value: string) => {
    setCustomFields(
      customFields.map((f) => {
        if (f.id !== id) return f;
        if (key === "name") {
          return { ...f, name: value, isEdited: true };
        } else if (key === "mappedTo") {
          const shouldUpdateName = !f.isEdited;
          return {
            ...f,
            mappedTo: value,
            name: shouldUpdateName ? value : f.name,
          };
        }
        return f;
      })
    );
  };

  /* Merged Fields Management */
  const addMergedField = (fieldKey: string) => {
    setMergedFields((prev) => ({
      ...prev,
      [fieldKey]: [...(prev[fieldKey] || []), ""],
    }));
  };

  const removeMergedField = (fieldKey: string, index: number) => {
    setMergedFields((prev) => {
      const current = [...(prev[fieldKey] || [])];
      current.splice(index, 1);
      return { ...prev, [fieldKey]: current };
    });
  };

  const updateMergedField = (fieldKey: string, index: number, value: string) => {
    setMergedFields((prev) => {
      const current = [...(prev[fieldKey] || [])];
      current[index] = value;
      return { ...prev, [fieldKey]: current };
    });
  };

  // Helper to list all mapped columns to avoid accidental duplicates
  const getUsedColumns = () => {
    const used = new Set<string>();
    Object.values(fieldMapping).forEach((val) => {
      if (val && val !== "__CUSTOM_DATE__") used.add(val);
    });
    Object.values(mergedFields).forEach((arr) => {
      arr.forEach((val) => {
        if (val) used.add(val);
      });
    });
    customFields.forEach((f) => {
      if (f.mappedTo) used.add(f.mappedTo);
    });
    return used;
  };

  /* =========================================================================
     STAGE 1: INTERNAL FILE VERIFICATION & DEDUPLICATION
     ========================================================================= */
  const verifyFileData = async () => {
    if (!fieldMapping.name) {
      setImportError("Please map the Customer Name column.");
      return;
    }
    if (!fieldMapping.phone) {
      setImportError("Please map the Phone Number column.");
      return;
    }

    setImporting(true);
    setImportError("");
    setImportSuccess("");

    try {
      const parsedLeads: any[] = [];
      const currentTotal = workflow?.total_leads || 0;

      fileRawRows.forEach((row, idx) => {
        const customerName = getFieldValue(row, "name", fieldMapping, mergedFields);
        const rawPhone = getFieldValue(row, "phone", fieldMapping, mergedFields);

        if (!customerName || !rawPhone) return;

        let expiryVal =
          fieldMapping["expiry_date"] === "__CUSTOM_DATE__"
            ? customExpiryDate
            : getFieldValue(row, "expiry_date", fieldMapping, mergedFields);

        // Date normalization
        let parsedExpiryDate: string | null = null;
        if (expiryVal) {
          try {
            const clean = expiryVal.toString().replace(/₹/g, "").trim();
            const d = new Date(clean);
            if (!isNaN(d.getTime())) {
              parsedExpiryDate = d.toISOString();
            }
          } catch (e) {}
        }

        // Build customer_details JSON in CRM format
        const detailsObj: Record<string, any> = {};
        customFields.forEach((cf) => {
          let val = String(row[cf.mappedTo] || "");
          const merged = mergedFields[cf.id] || [];
          if (merged.length > 0) {
            const mergedValues = merged
              .filter((col) => col && row[col])
              .map((col) => String(row[col]))
              .join(" ");
            if (mergedValues) val = val ? `${val} ${mergedValues}` : mergedValues;
          }
          if (val) {
            const suffix = selectedFields[`custom_${cf.id}`] !== false ? "_checked" : "_unchecked";
            detailsObj[`${cf.name || cf.mappedTo}${suffix}`] = val.trim();
          }
        });

        const phoneHash = computePhoneHash(rawPhone);
        const encPhone = encryptPhone(rawPhone);

        parsedLeads.push({
          row_index: currentTotal + idx + 1,
          lead_id: `LEAD-LP-${Date.now().toString().slice(-6)}-${(currentTotal + idx + 1).toString().padStart(4, "0")}`,
          customer_name: customerName,
          phone_no: encPhone,
          display_phone: rawPhone,
          phone_search_hash: phoneHash,
          expiry_date: parsedExpiryDate,
          customer_details: {
            active_details: "details-1",
            history: {
              "details-1": detailsObj,
            },
          },
          upload_status: "pending",
        });
      });

      if (parsedLeads.length === 0) {
        setImportError("No valid rows found in file. Ensure name and phone columns contain data.");
        setImporting(false);
        return;
      }

      setInitialRecordCount(parsedLeads.length);

      // Check duplicates within the file itself
      const hashGroups: Record<string, number[]> = {};
      parsedLeads.forEach((item, idx) => {
        if (!item.phone_search_hash) return;
        if (!hashGroups[item.phone_search_hash]) hashGroups[item.phone_search_hash] = [];
        hashGroups[item.phone_search_hash].push(idx);
      });

      const internalConflicts: any[] = [];
      Object.entries(hashGroups).forEach(([hash, indices]) => {
        if (indices.length > 1) {
          internalConflicts.push({
            hash,
            indices,
            records: indices.map((i) => parsedLeads[i]),
          });
        }
      });

      if (internalConflicts.length > 0) {
        setFileConflicts(internalConflicts);
        setFullyProcessedLeads(parsedLeads);
        setShowFileConflictModal(true);
        setImportError(
          `File contains ${internalConflicts.length} repeating phone numbers (${parsedLeads.length} total rows).`
        );
      } else {
        setFullyProcessedLeads(parsedLeads);
        setIsFileVerificationComplete(true);
        setImportSuccess(
          `Stage 1 Complete: All ${parsedLeads.length} rows verified with no internal duplicates.`
        );
      }
    } catch (err: any) {
      console.error("Verification error:", err);
      setImportError(`Verification error: ${err.message || err}`);
    } finally {
      setImporting(false);
    }
  };

  // Stage 1 Resolution Handlers
  const handleFileMerge = (conflictIndex: number) => {
    const conflict = fileConflicts[conflictIndex];
    let currentList = [...fullyProcessedLeads];
    const records = conflict.records;
    const primaryRecord = { ...records[0] };

    // Combine history
    const combinedHistory: any = {};
    let counter = 1;
    records.forEach((rec: any) => {
      if (rec.customer_details?.history) {
        Object.values(rec.customer_details.history).forEach((hVal) => {
          combinedHistory[`details-${counter++}`] = hVal;
        });
      }
    });

    primaryRecord.customer_details = {
      active_details: "details-1",
      history: combinedHistory,
    };

    const idsToRemove = new Set(records.map((r: any) => r.lead_id));
    currentList = currentList.filter((rec: any) => !idsToRemove.has(rec.lead_id));
    currentList.push(primaryRecord);

    setFullyProcessedLeads(currentList);
    const newConflicts = [...fileConflicts];
    newConflicts.splice(conflictIndex, 1);
    setFileConflicts(newConflicts);
    setSelectedFileConflicts(new Set());

    if (newConflicts.length === 0) {
      setShowFileConflictModal(false);
      setIsFileVerificationComplete(true);
      setImportSuccess(
        `Stage 1 Complete! Deduplication resolved. Moving ${currentList.length} rows to Stage 2.`
      );
    }
  };

  const handleFileReject = (conflictIndex: number) => {
    const conflict = fileConflicts[conflictIndex];
    let currentList = [...fullyProcessedLeads];
    const idsToRemove = new Set(conflict.records.slice(1).map((r: any) => r.lead_id));
    currentList = currentList.filter((rec: any) => !idsToRemove.has(rec.lead_id));

    setFullyProcessedLeads(currentList);
    const newConflicts = [...fileConflicts];
    newConflicts.splice(conflictIndex, 1);
    setFileConflicts(newConflicts);
    setSelectedFileConflicts(new Set());

    if (newConflicts.length === 0) {
      setShowFileConflictModal(false);
      setIsFileVerificationComplete(true);
      setImportSuccess(
        `Stage 1 Complete! Deduplication resolved. Moving ${currentList.length} rows to Stage 2.`
      );
    }
  };

  const handleBulkFileMerge = () => {
    if (selectedFileConflicts.size === 0) return;
    let currentList = [...fullyProcessedLeads];
    const sortedIndices = Array.from(selectedFileConflicts).sort((a, b) => b - a);

    sortedIndices.forEach((idx) => {
      const conflict = fileConflicts[idx];
      const records = conflict.records;
      const primaryRecord = { ...records[0] };

      const combinedHistory: any = {};
      let counter = 1;
      records.forEach((rec: any) => {
        if (rec.customer_details?.history) {
          Object.values(rec.customer_details.history).forEach((hVal) => {
            combinedHistory[`details-${counter++}`] = hVal;
          });
        }
      });

      primaryRecord.customer_details = {
        active_details: "details-1",
        history: combinedHistory,
      };

      const idsToRemove = new Set(records.map((r: any) => r.lead_id));
      currentList = currentList.filter((rec: any) => !idsToRemove.has(rec.lead_id));
      currentList.push(primaryRecord);
    });

    setFullyProcessedLeads(currentList);
    const newConflicts = fileConflicts.filter((_, idx) => !selectedFileConflicts.has(idx));
    setFileConflicts(newConflicts);
    setSelectedFileConflicts(new Set());

    if (newConflicts.length === 0) {
      setShowFileConflictModal(false);
      setIsFileVerificationComplete(true);
      setImportSuccess(
        `Stage 1 Complete! Deduplication resolved. Moving ${currentList.length} rows to Stage 2.`
      );
    }
  };

  const handleBulkFileReject = () => {
    if (selectedFileConflicts.size === 0) return;
    let currentList = [...fullyProcessedLeads];
    const sortedIndices = Array.from(selectedFileConflicts);

    sortedIndices.forEach((idx) => {
      const conflict = fileConflicts[idx];
      const idsToRemove = new Set(conflict.records.slice(1).map((r: any) => r.lead_id));
      currentList = currentList.filter((rec: any) => !idsToRemove.has(rec.lead_id));
    });

    setFullyProcessedLeads(currentList);
    const newConflicts = fileConflicts.filter((_, idx) => !selectedFileConflicts.has(idx));
    setFileConflicts(newConflicts);
    setSelectedFileConflicts(new Set());

    if (newConflicts.length === 0) {
      setShowFileConflictModal(false);
      setIsFileVerificationComplete(true);
      setImportSuccess(
        `Stage 1 Complete! Deduplication resolved. Moving ${currentList.length} rows to Stage 2.`
      );
    }
  };

  /* =========================================================================
     STAGE 2: DATABASE CORRELATION CHECK (CUSTOMERS & LEAD_SHEDULED)
     ========================================================================= */
  const checkDatabaseCorrelations = async () => {
    if (!fullyProcessedLeads.length) return;

    setIsScanningDb(true);
    setImportError("");
    setImportSuccess("");

    try {
      const hashes = fullyProcessedLeads.map((c) => c.phone_search_hash).filter(Boolean);
      const BATCH_SIZE = 100;

      let foundInCustomers: any[] = [];
      let foundInScheduled: any[] = [];

      // Query both tables in chunked batches
      for (let i = 0; i < hashes.length; i += BATCH_SIZE) {
        const chunk = hashes.slice(i, i + BATCH_SIZE);

        // 1. Check in customers table (CRM live leads)
        const { data: custData, error: custErr } = await supabase
          .from("customers")
          .select("id, customer_name, phone_search_hash, customer_details, campaign_id, status")
          .in("phone_search_hash", chunk)
          .eq("organization_id", workflow.organization_id);

        if (custErr) throw custErr;
        if (custData && custData.length > 0) {
          foundInCustomers = [...foundInCustomers, ...custData];
        }

        // 2. Check in lead_sheduled table (Already staged leads in this workflow / campaign)
        const { data: schedData, error: schedErr } = await supabase
          .from("lead_sheduled")
          .select("id, customer_name, phone_search_hash, customer_details, upload_status, pilotlead_id")
          .in("phone_search_hash", chunk)
          .eq("organization_id", workflow.organization_id);

        if (schedErr) throw schedErr;
        if (schedData && schedData.length > 0) {
          foundInScheduled = [...foundInScheduled, ...schedData];
        }
      }

      // Map conflicts
      const dbMatchesMap = new Map<string, { cust?: any; sched?: any }>();

      foundInCustomers.forEach((c) => {
        if (!dbMatchesMap.has(c.phone_search_hash)) {
          dbMatchesMap.set(c.phone_search_hash, { cust: c });
        } else {
          dbMatchesMap.get(c.phone_search_hash)!.cust = c;
        }
      });

      foundInScheduled.forEach((s) => {
        if (!dbMatchesMap.has(s.phone_search_hash)) {
          dbMatchesMap.set(s.phone_search_hash, { sched: s });
        } else {
          dbMatchesMap.get(s.phone_search_hash)!.sched = s;
        }
      });

      if (dbMatchesMap.size > 0) {
        const correlationConflicts: any[] = [];
        dbMatchesMap.forEach((val, hash) => {
          const fileLead = fullyProcessedLeads.find((f) => f.phone_search_hash === hash);
          if (fileLead) {
            correlationConflicts.push({
              hash,
              fileRecord: fileLead,
              customerMatch: val.cust || null,
              scheduledMatch: val.sched || null,
              conflictType:
                val.cust && val.sched ? "both" : val.cust ? "customer" : "scheduled",
            });
          }
        });

        setDbConflicts(correlationConflicts);
        setShowDbConflictModal(true);
        setImportError(
          `Stage 2: Found ${correlationConflicts.length} matching phone numbers in Database (${foundInCustomers.length} in CRM Customers, ${foundInScheduled.length} in Workflow Pool).`
        );
      } else {
        setIsDbScanComplete(true);
        setImportSuccess(
          `Stage 2 Complete! All ${fullyProcessedLeads.length} leads are 100% fresh and unique in CRM & Workflow.`
        );
      }
    } catch (err: any) {
      console.error("Database Correlation Check Error:", err);
      setImportError(`Error checking database: ${err.message || err}`);
    } finally {
      setIsScanningDb(false);
    }
  };

  // Stage 2 Handlers
  const handleDbSkipSelected = () => {
    if (selectedDbConflicts.size === 0) return;
    const hashesToSkip = Array.from(selectedDbConflicts).map(
      (idx) => dbConflicts[idx].hash
    );

    const filtered = fullyProcessedLeads.filter(
      (lead) => !hashesToSkip.includes(lead.phone_search_hash)
    );
    setFullyProcessedLeads(filtered);

    const remainingConflicts = dbConflicts.filter((_, i) => !selectedDbConflicts.has(i));
    setDbConflicts(remainingConflicts);
    setSelectedDbConflicts(new Set());

    if (remainingConflicts.length === 0) {
      setShowDbConflictModal(false);
      setIsDbScanComplete(true);
      setImportSuccess(
        `Stage 2 Complete! Skipped duplicates. ${filtered.length} unique leads finalized for workflow.`
      );
    }
  };

  const handleDbMergeSelected = () => {
    if (selectedDbConflicts.size === 0) return;
    let working = [...fullyProcessedLeads];
    const selectedIndices = Array.from(selectedDbConflicts).sort((a, b) => b - a);

    selectedIndices.forEach((idx) => {
      const conflict = dbConflicts[idx];
      const fileRec = conflict.fileRecord;
      const existingMatch = conflict.customerMatch || conflict.scheduledMatch;

      // Extract existing history
      let existingDetails: any = {};
      try {
        existingDetails =
          typeof existingMatch?.customer_details === "string"
            ? JSON.parse(existingMatch.customer_details)
            : existingMatch?.customer_details || {};
      } catch (e) {}

      const newHistory = { ...(existingDetails.history || {}) };
      const nextId = `details-${Object.keys(newHistory).length + 1}`;
      newHistory[nextId] = fileRec.customer_details?.history?.["details-1"] || {};

      const mergedRec = {
        ...fileRec,
        customer_details: {
          active_details: nextId,
          history: newHistory,
        },
      };

      const targetIdx = working.findIndex(
        (l) => l.phone_search_hash === fileRec.phone_search_hash
      );
      if (targetIdx !== -1) {
        working[targetIdx] = mergedRec;
      }
    });

    setFullyProcessedLeads(working);
    const remainingConflicts = dbConflicts.filter((_, i) => !selectedDbConflicts.has(i));
    setDbConflicts(remainingConflicts);
    setSelectedDbConflicts(new Set());

    if (remainingConflicts.length === 0) {
      setShowDbConflictModal(false);
      setIsDbScanComplete(true);
      setImportSuccess(
        `Stage 2 Complete! Merged records. ${working.length} leads finalized for workflow.`
      );
    }
  };

  /* =========================================================================
     STAGE 3: FINAL STAGING AND WORKFLOW INGESTION
     ========================================================================= */
  const handleFinalUpload = async () => {
    if (!fullyProcessedLeads.length || isFinalizing) return;

    setIsFinalizing(true);
    setImportError("");
    setImportSuccess("Staging verified leads into workflow...");

    try {
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();

      const totalRows = initialRecordCount;
      const validRowsCount = fullyProcessedLeads.length;
      const duplicateRowsCount = totalRows - validRowsCount;

      // 1. Insert Audit Log into pilotlead_uploads
      const { data: uploadLog, error: uploadLogErr } = await supabase
        .from("pilotlead_uploads")
        .insert({
          pilotlead_id: workflow.id,
          organization_id: workflow.organization_id,
          file_name: importFile?.name || `${sourceName}.xlsx`,
          file_size_bytes: importFile?.size || 0,
          total_rows: totalRows,
          valid_rows: validRowsCount,
          duplicate_rows: duplicateRowsCount,
          uploaded_by: authUser?.id || null,
        })
        .select()
        .single();

      if (uploadLogErr) throw uploadLogErr;

      // 2. Stage rows in chunks into public.lead_sheduled
      const CHUNK_SIZE = 250;
      for (let i = 0; i < validRowsCount; i += CHUNK_SIZE) {
        const chunk = fullyProcessedLeads.slice(i, i + CHUNK_SIZE);
        const stagedRows = chunk.map((lead, idx) => ({
          pilotlead_id: workflow.id,
          upload_id: uploadLog?.id || null,
          organization_id: workflow.organization_id,
          campaign_id: workflow.campaign_id,
          source_id: workflow.source_id,
          source_file_name: importFile?.name || `${sourceName}.xlsx`,
          lead_id: lead.lead_id,
          customer_name: lead.customer_name,
          phone_no: lead.phone_no,
          phone_search_hash: lead.phone_search_hash,
          expiry_date: lead.expiry_date,
          customer_details: JSON.stringify(lead.customer_details),
          row_index: lead.row_index,
          upload_status: "pending",
        }));

        const { error: insertErr } = await supabase
          .from("lead_sheduled")
          .insert(stagedRows);

        if (insertErr) throw insertErr;
      }

      // 3. Update workflow metrics
      const newPending = (workflow.pending_leads || 0) + validRowsCount;
      const newTotal = (workflow.total_leads || 0) + validRowsCount;
      const newFilesCount = (Number(workflow.total_files_uploaded) || 0) + 1;

      let targetEndDate = workflow.end_date;
      if (isEndDateExpired) {
        targetEndDate = newEndDate;
      }

      // Recompute next_execution_at if workflow was completed or uncalculated
      let nextExec = workflow.next_execution_at;
      let newStatus = workflow.status;

      if (workflow.status === "completed" || !nextExec) {
        const { data: recomputedNext } = await supabase.rpc(
          "calculate_leadpilot_next_execution",
          {
            p_batch_times: workflow.batch_times || ["10:00", "14:00", "18:00"],
            p_pause_days: workflow.pause_days || [],
            p_start_date: workflow.start_date,
            p_end_date: targetEndDate,
            p_from_time: new Date().toISOString(),
          }
        );
        nextExec = recomputedNext;
        newStatus = "scheduled";
      }

      const activeMapping = {
        name: fieldMapping.name,
        phone: fieldMapping.phone,
        expiry: fieldMapping.expiry_date,
      };

      await supabase
        .from("leadpilot")
        .update({
          total_leads: newTotal,
          pending_leads: newPending,
          total_files_uploaded: newFilesCount,
          column_mapping: activeMapping,
          end_date: targetEndDate,
          status: newStatus,
          next_execution_at: nextExec,
          updated_at: new Date().toISOString(),
        })
        .eq("id", workflow.id);

      // 4. Update system_logs telemetry record
      await supabase
        .from("system_logs")
        .update({
          total_leads: newTotal,
        })
        .eq("source_id", workflow.source_id);

      // 5. Audit event
      logSystemEvent({
        event_type: "WRITE",
        description: `Workflow Upload: ${validRowsCount} leads staged into workflow '${workflow.name}' (${duplicateRowsCount} duplicates filtered)`,
        metadata: {
          workflow_id: workflow.id,
          source_id: workflow.source_id,
          total_rows: totalRows,
          staged_count: validRowsCount,
        },
        user_name: authUser?.email || "System User",
        organization_id: workflow.organization_id,
      });

      setImportSuccess(
        `Successfully staged ${validRowsCount.toLocaleString()} leads into workflow! Automated scheduling is active.`
      );

      setTimeout(() => {
        handleClose();
        onSuccess?.();
      }, 1100);
    } catch (err: any) {
      console.error("Final upload error:", err);
      setImportError(`Error staging leads: ${err.message || err}`);
      setIsFinalizing(false);
    }
  };

  if (!show || !workflow) return null;

  const isFirstUpload = (workflow.total_leads || 0) === 0;

  return (
    <>
      {/* 1. INITIAL DROPZONE MODAL */}
      {showImportModal && !showMappingModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-xl border border-gray-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between bg-white">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#4b33e8]/10 text-[#4b33e8] flex items-center justify-center text-sm">
                  <i className="fi flex fi-rr-cloud-upload"></i>
                </div>
                <div>
                  <h2 className="text-sm font-bold text-gray-900 leading-tight">
                    {isFirstUpload ? "Upload Initial Leads" : "Upload More Leads"}
                  </h2>
                  <p className="text-[11px] text-gray-500 font-medium">
                    Workflow: <span className="font-semibold text-[#4b33e8]">{workflow.name}</span>
                  </p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="w-7 h-7 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 flex items-center justify-center transition-colors"
              >
                <i className="fi flex fi-rr-cross text-[11px]"></i>
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4">
              {importError && (
                <div className="p-3 rounded-lg bg-rose-50 border border-rose-100 text-rose-600 text-xs font-medium flex items-center gap-2">
                  <i className="fi flex fi-rr-exclamation text-xs"></i>
                  <span>{importError}</span>
                </div>
              )}

              {isEndDateExpired && (
                <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs space-y-2">
                  <div className="flex items-center gap-2 font-bold">
                    <i className="fi flex fi-rr-info"></i>
                    <span>Previous Workflow End Date Expired</span>
                  </div>
                  <p className="text-[11px] leading-relaxed">
                    The previous end date ({workflow.end_date}) has passed. Please specify an extended end date to allow upcoming batch dispatches.
                  </p>
                  <input
                    type="date"
                    value={newEndDate}
                    onChange={(e) => setNewEndDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-amber-300 text-xs bg-white text-black font-semibold outline-none"
                  />
                </div>
              )}

              {/* Dropzone */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Select Lead Sheet (.csv or .xlsx)
                </label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-200 hover:border-[#4b33e8] rounded-2xl p-8 text-center cursor-pointer transition-all bg-gray-50/50 hover:bg-[#4b33e8]/[0.02] group"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv,.xlsx,.xls"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                  <div className="w-12 h-12 rounded-xl bg-[#4b33e8]/10 text-[#4b33e8] flex items-center justify-center mx-auto mb-2 text-xl group-hover:scale-110 transition-transform">
                    <i className="fi flex fi-rr-cloud-upload"></i>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-700">Click or Drag & Drop File Here</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">Supports CSV, XLSX, and XLS sheets</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-1.5 rounded-lg text-xs font-semibold text-gray-500 hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. COLUMN MAPPING MODAL (MATCHING CUSTOMER IMPORT) */}
      {showMappingModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-xl border border-gray-200 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between bg-white shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#4b33e8]/10 text-[#4b33e8] flex items-center justify-center text-sm">
                  <i className="fi flex fi-rr-settings-sliders"></i>
                </div>
                <div>
                  <h2 className="text-sm font-bold text-gray-900 leading-tight">Map File Columns</h2>
                  <p className="text-[11px] text-gray-500 font-medium">
                    File: <span className="font-semibold text-gray-800">{importFile?.name}</span> ({fileRawRows.length.toLocaleString()} rows)
                  </p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="w-7 h-7 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 flex items-center justify-center transition-colors"
              >
                <i className="fi flex fi-rr-cross text-[11px]"></i>
              </button>
            </div>

            {/* Body */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1">
              {importError && (
                <div className="p-3 rounded-lg bg-rose-50 border border-rose-100 text-rose-600 text-xs font-medium flex items-center gap-2">
                  <i className="fi flex fi-rr-exclamation text-xs"></i>
                  <span>{importError}</span>
                </div>
              )}

              {importSuccess && (
                <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-600 text-xs font-medium flex items-center gap-2">
                  <i className="fi flex fi-rr-check text-xs"></i>
                  <span>{importSuccess}</span>
                </div>
              )}

              {/* Core CRM Fields */}
              <div>
                <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Core Fields
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Customer Name */}
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-gray-600 uppercase">
                      Customer Name <span className="text-rose-500">*</span>
                    </label>
                    <div className="flex gap-1.5">
                      <select
                        value={fieldMapping.name || ""}
                        onChange={(e) => setFieldMapping({ ...fieldMapping, name: e.target.value })}
                        className="w-full px-2.5 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-semibold text-black outline-none focus:border-[#4b33e8]"
                      >
                        <option value="">Select column...</option>
                        {fileHeaders.map((col) => (
                          <option key={col} value={col}>
                            {col}
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={() => addMergedField("name")}
                        className="p-2 w-8 h-8 bg-blue-50 text-[#4b33e8] rounded-lg hover:bg-blue-100 flex items-center justify-center shrink-0"
                        title="Merge another column (e.g. Last Name)"
                      >
                        <i className="fi flex fi-rr-plus text-[10px]"></i>
                      </button>
                    </div>

                    {/* Merged Name Fields */}
                    {mergedFields["name"] &&
                      mergedFields["name"].map((val, idx) => (
                        <div key={idx} className="flex gap-1.5 mt-1 pl-2">
                          <select
                            value={val}
                            onChange={(e) => updateMergedField("name", idx, e.target.value)}
                            className="w-full px-2.5 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-semibold text-black outline-none"
                          >
                            <option value="">Merge column...</option>
                            {fileHeaders.map((col) => (
                              <option key={col} value={col}>
                                + {col}
                              </option>
                            ))}
                          </select>
                          <button
                            type="button"
                            onClick={() => removeMergedField("name", idx)}
                            className="p-1.5 w-8 h-8 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 flex items-center justify-center shrink-0"
                          >
                            <i className="fi flex fi-rr-trash text-[10px]"></i>
                          </button>
                        </div>
                      ))}
                  </div>

                  {/* Phone Number */}
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-gray-600 uppercase">
                      Phone Number <span className="text-rose-500">*</span>
                    </label>
                    <div className="flex gap-1.5">
                      <select
                        value={fieldMapping.phone || ""}
                        onChange={(e) => setFieldMapping({ ...fieldMapping, phone: e.target.value })}
                        className="w-full px-2.5 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-semibold text-black outline-none focus:border-[#4b33e8]"
                      >
                        <option value="">Select column...</option>
                        {fileHeaders.map((col) => (
                          <option key={col} value={col}>
                            {col}
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={() => addMergedField("phone")}
                        className="p-2 w-8 h-8 bg-blue-50 text-[#4b33e8] rounded-lg hover:bg-blue-100 flex items-center justify-center shrink-0"
                        title="Merge another column"
                      >
                        <i className="fi flex fi-rr-plus text-[10px]"></i>
                      </button>
                    </div>

                    {/* Merged Phone Fields */}
                    {mergedFields["phone"] &&
                      mergedFields["phone"].map((val, idx) => (
                        <div key={idx} className="flex gap-1.5 mt-1 pl-2">
                          <select
                            value={val}
                            onChange={(e) => updateMergedField("phone", idx, e.target.value)}
                            className="w-full px-2.5 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-semibold text-black outline-none"
                          >
                            <option value="">Merge column...</option>
                            {fileHeaders.map((col) => (
                              <option key={col} value={col}>
                                + {col}
                              </option>
                            ))}
                          </select>
                          <button
                            type="button"
                            onClick={() => removeMergedField("phone", idx)}
                            className="p-1.5 w-8 h-8 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 flex items-center justify-center shrink-0"
                          >
                            <i className="fi flex fi-rr-trash text-[10px]"></i>
                          </button>
                        </div>
                      ))}
                  </div>

                  {/* Expiry Date */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] font-bold text-gray-600 uppercase">
                        Expiry Date
                      </label>
                      <div className="flex items-center gap-1.5">
                        <input
                          type="checkbox"
                          id="check_expiry_date"
                          checked={Boolean(selectedFields["expiry_date"])}
                          onChange={(e) =>
                            setSelectedFields({ ...selectedFields, expiry_date: e.target.checked })
                          }
                          className="w-3 h-3 text-[#4b33e8] border-gray-300 rounded cursor-pointer"
                        />
                        <label htmlFor="check_expiry_date" className="text-[9px] text-gray-400 cursor-pointer">
                          Show in App
                        </label>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <select
                        value={fieldMapping.expiry_date || ""}
                        onChange={(e) =>
                          setFieldMapping({ ...fieldMapping, expiry_date: e.target.value })
                        }
                        className="w-full px-2.5 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-semibold text-black outline-none focus:border-[#4b33e8]"
                      >
                        <option value="">None (Optional)</option>
                        <option value="__CUSTOM_DATE__" className="font-bold text-[#4b33e8]">
                          ✨ Set Custom Fixed Date
                        </option>
                        {fileHeaders.map((col) => (
                          <option key={col} value={col}>
                            {col}
                          </option>
                        ))}
                      </select>

                      {fieldMapping.expiry_date === "__CUSTOM_DATE__" && (
                        <input
                          type="date"
                          value={customExpiryDate}
                          onChange={(e) => setCustomExpiryDate(e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-[#f0f2ff] border border-[#4b33e8] rounded-lg text-xs text-black font-semibold outline-none"
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Columns (Auto-Detected) */}
              <div className="border-t border-gray-100 pt-4">
                <div className="flex items-center justify-between mb-2.5">
                  <label className="text-[11px] font-bold text-gray-700 uppercase tracking-wider">
                    Additional Columns ({customFields.length} Detected)
                  </label>
                  <button
                    type="button"
                    onClick={addCustomField}
                    className="text-xs text-[#4b33e8] font-bold hover:underline flex items-center gap-1"
                  >
                    <i className="fi flex fi-rr-plus text-[10px]"></i>
                    <span>Add Field</span>
                  </button>
                </div>

                {customFields.length > 0 ? (
                  <div className="space-y-2 max-h-52 overflow-y-auto p-1">
                    {customFields.map((cf) => (
                      <div key={cf.id} className="space-y-1.5 bg-gray-50/70 p-2.5 rounded-lg border border-gray-100">
                        <div className="flex gap-2 items-center">
                          <input
                            type="checkbox"
                            checked={selectedFields[`custom_${cf.id}`] !== false}
                            onChange={(e) =>
                              setSelectedFields({
                                ...selectedFields,
                                [`custom_${cf.id}`]: e.target.checked,
                              })
                            }
                            className="w-3.5 h-3.5 text-[#4b33e8] border-gray-300 rounded cursor-pointer"
                            title="Show in CRM Details"
                          />
                          <input
                            placeholder="Field Name (e.g. Plan Type)"
                            className="flex-1 px-2.5 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-semibold text-black outline-none focus:border-[#4b33e8]"
                            value={cf.name}
                            onChange={(e) => updateCustomField(cf.id, "name", e.target.value)}
                          />
                          <i className="fi flex fi-rr-arrow-right text-gray-300 text-xs"></i>
                          <div className="flex-1 flex gap-1.5">
                            <select
                              className="w-full px-2.5 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-semibold text-black outline-none focus:border-[#4b33e8]"
                              value={cf.mappedTo}
                              onChange={(e) => updateCustomField(cf.id, "mappedTo", e.target.value)}
                            >
                              <option value="">Select column...</option>
                              {fileHeaders.map((col) => (
                                <option key={col} value={col}>
                                  {col}
                                </option>
                              ))}
                            </select>
                            <button
                              type="button"
                              onClick={() => addMergedField(cf.id)}
                              className="p-1.5 w-7 h-7 bg-blue-50 text-[#4b33e8] rounded-md hover:bg-blue-100 flex items-center justify-center shrink-0"
                              title="Merge another column"
                            >
                              <i className="fi flex fi-rr-plus text-[9px]"></i>
                            </button>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeCustomField(cf.id)}
                            className="p-1.5 w-7 h-7 flex items-center justify-center rounded-md bg-red-50 text-red-500 hover:bg-red-100 shrink-0"
                          >
                            <i className="fi flex fi-rr-trash text-[10px]"></i>
                          </button>
                        </div>

                        {/* Merged custom fields */}
                        {mergedFields[cf.id] &&
                          mergedFields[cf.id].map((val, idx) => (
                            <div key={idx} className="flex gap-2 pl-6">
                              <select
                                value={val}
                                onChange={(e) => updateMergedField(cf.id, idx, e.target.value)}
                                className="w-full px-2.5 py-1 bg-white border border-gray-200 rounded-lg text-xs font-semibold text-black outline-none"
                              >
                                <option value="">Select column to merge...</option>
                                {fileHeaders.map((col) => (
                                  <option key={col} value={col}>
                                    + {col}
                                  </option>
                                ))}
                              </select>
                              <button
                                type="button"
                                onClick={() => removeMergedField(cf.id, idx)}
                                className="p-1 w-6 h-6 bg-red-50 text-red-500 rounded flex items-center justify-center shrink-0"
                              >
                                <i className="fi flex fi-rr-trash text-[9px]"></i>
                              </button>
                            </div>
                          ))}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-xs text-gray-400 italic text-center py-2 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                    No additional custom fields mapped
                  </div>
                )}
              </div>

              {/* Source Name */}
              <div className="border-t border-gray-100 pt-3">
                <label className="text-[10px] font-bold text-gray-600 uppercase tracking-wider block mb-1">
                  Source / Batch Name
                </label>
                <input
                  type="text"
                  placeholder="Enter source name"
                  value={sourceName}
                  onChange={(e) => setSourceName(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs text-black font-semibold outline-none focus:border-[#4b33e8]"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between shrink-0">
              <button
                type="button"
                onClick={() => setShowMappingModal(false)}
                className="px-4 py-1.5 rounded-lg text-xs font-semibold text-gray-600 hover:bg-gray-200 transition-colors"
              >
                Back
              </button>

              <div className="flex items-center gap-2">
                {!isFileVerificationComplete ? (
                  <button
                    type="button"
                    onClick={verifyFileData}
                    disabled={importing}
                    className="px-5 py-2 rounded-lg bg-[#4b33e8] hover:bg-[#3d28d0] text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-none"
                  >
                    {importing && (
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    )}
                    <span>Verify File Data (Step 1)</span>
                  </button>
                ) : !isDbScanComplete ? (
                  <button
                    type="button"
                    onClick={checkDatabaseCorrelations}
                    disabled={isScanningDb}
                    className="px-5 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-none"
                  >
                    {isScanningDb && (
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    )}
                    <span>Check CRM & Workflow Duplicates (Step 2)</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleFinalUpload}
                    disabled={isFinalizing}
                    className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-none"
                  >
                    {isFinalizing && (
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    )}
                    <i className="fi flex fi-rr-upload text-xs"></i>
                    <span>Upload Now ({fullyProcessedLeads.length} Fresh Leads)</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. STEP 1: FILE INTERNAL CONFLICT MODAL */}
      {showFileConflictModal && fileConflicts.length > 0 && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-xs p-3 sm:p-4 text-xs">
          <div className="bg-white rounded-xl w-full max-w-4xl shadow-2xl flex flex-col max-h-[85vh] border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between bg-white shrink-0">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={
                    selectedFileConflicts.size === fileConflicts.length &&
                    fileConflicts.length > 0
                  }
                  onChange={() => {
                    if (selectedFileConflicts.size === fileConflicts.length) {
                      setSelectedFileConflicts(new Set());
                    } else {
                      setSelectedFileConflicts(new Set(fileConflicts.map((_, i) => i)));
                    }
                  }}
                  className="w-4 h-4 rounded border-gray-300 text-[#4b33e8] cursor-pointer"
                />
                <div className="w-8 h-8 rounded-lg bg-[#4b33e8]/10 flex items-center justify-center text-[#4b33e8]">
                  <i className="fi flex fi-rr-copy-alt text-sm"></i>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">File Internal Duplicates</h3>
                  <p className="text-[11px] text-gray-500 font-medium">
                    <span className="text-[#4b33e8] font-bold">{fileConflicts.length}</span> repeating numbers in this sheet | Total Records:{" "}
                    <span className="text-gray-800 font-bold">{fullyProcessedLeads.length}</span>
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowFileConflictModal(false)}
                className="w-7 h-7 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 flex items-center justify-center transition-colors"
              >
                <i className="fi flex fi-rr-cross text-[11px]"></i>
              </button>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50/50">
              {fileConflicts.slice(0, 15).map((conflict, idx) => (
                <div key={idx} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-none">
                  <div className="px-4 py-2 bg-gray-50 flex items-center justify-between border-b border-gray-100">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedFileConflicts.has(idx)}
                        onChange={() => {
                          const next = new Set(selectedFileConflicts);
                          if (next.has(idx)) next.delete(idx);
                          else next.add(idx);
                          setSelectedFileConflicts(next);
                        }}
                        className="w-3.5 h-3.5 rounded border-gray-300 text-[#4b33e8] cursor-pointer"
                      />
                      <span className="font-bold text-gray-700 uppercase text-[10px]">
                        Repeating Group #{idx + 1}
                      </span>
                      <span className="text-[10px] text-[#4b33e8] font-bold bg-[#4b33e8]/10 px-2 py-0.5 rounded-full">
                        {conflict.records.length} Records
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleFileMerge(idx)}
                        className="px-2.5 py-1 rounded bg-[#4b33e8]/10 text-[#4b33e8] hover:bg-[#4b33e8]/20 font-bold text-[10px] transition-colors"
                      >
                        Merge All
                      </button>
                      <button
                        onClick={() => handleFileReject(idx)}
                        className="px-2.5 py-1 rounded bg-rose-50 text-rose-600 hover:bg-rose-100 font-bold text-[10px] transition-colors"
                      >
                        Keep 1 & Reject Dups
                      </button>
                    </div>
                  </div>

                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="text-gray-400 uppercase text-[9px] font-bold border-b border-gray-100 bg-white">
                        <th className="px-4 py-2 w-[35%]">Name & Phone</th>
                        <th className="px-4 py-2 w-[45%]">Mapped Details</th>
                        <th className="px-4 py-2 w-[20%] text-right">Action Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {conflict.records.map((rec: any, ridx: number) => (
                        <tr key={ridx} className="hover:bg-gray-50/50">
                          <td className="px-4 py-2.5 align-top">
                            <div className="font-bold text-gray-900">{rec.customer_name}</div>
                            <div className="text-[11px] text-[#4b33e8] font-semibold mt-0.5">
                              {rec.display_phone}
                            </div>
                          </td>
                          <td className="px-4 py-2.5 align-top">
                            <div className="flex flex-wrap gap-1">
                              {Object.entries(
                                rec.customer_details?.history?.[
                                  rec.customer_details?.active_details
                                ] || {}
                              ).map(([k, v]) => (
                                <span
                                  key={k}
                                  className="bg-gray-100 px-1.5 py-0.5 rounded text-[10px] text-gray-700 font-medium"
                                >
                                  {k.replace("_checked", "")}: {String(v)}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="px-4 py-2.5 align-top text-right">
                            {ridx === 0 ? (
                              <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                                PRIMARY
                              </span>
                            ) : (
                              <span className="text-[9px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100">
                                DUPLICATE
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="px-5 py-3 border-t border-gray-100 flex items-center justify-between bg-white shrink-0">
              <span className="text-xs text-gray-500 font-medium">
                Groups: <span className="font-bold text-gray-800">{fileConflicts.length}</span>
              </span>

              <div className="flex items-center gap-2">
                {selectedFileConflicts.size > 0 && (
                  <>
                    <button
                      onClick={handleBulkFileReject}
                      className="px-3 py-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 text-xs font-bold transition-colors"
                    >
                      Reject Selected ({selectedFileConflicts.size})
                    </button>
                    <button
                      onClick={handleBulkFileMerge}
                      className="px-3 py-1.5 rounded-lg bg-[#4b33e8] hover:bg-[#3d28d0] text-white text-xs font-bold transition-colors"
                    >
                      Merge Selected ({selectedFileConflicts.size})
                    </button>
                  </>
                )}
                <button
                  onClick={() => setShowFileConflictModal(false)}
                  className="px-4 py-1.5 rounded-lg border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-100"
                >
                  Close & Review
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. STEP 2: DATABASE CORRELATION CHECK MODAL (CUSTOMERS & LEAD_SHEDULED) */}
      {showDbConflictModal && dbConflicts.length > 0 && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 backdrop-blur-xs p-3 sm:p-4 text-xs">
          <div className="bg-white rounded-xl w-full max-w-5xl shadow-2xl flex flex-col max-h-[85vh] border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="px-5 py-3.5 border-b border-amber-100 flex items-center justify-between bg-white shrink-0">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={
                    selectedDbConflicts.size === dbConflicts.length &&
                    dbConflicts.length > 0
                  }
                  onChange={() => {
                    if (selectedDbConflicts.size === dbConflicts.length) {
                      setSelectedDbConflicts(new Set());
                    } else {
                      setSelectedDbConflicts(new Set(dbConflicts.map((_, i) => i)));
                    }
                  }}
                  className="w-4 h-4 rounded border-gray-300 text-amber-600 cursor-pointer"
                />
                <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
                  <i className="fi flex fi-rr-database text-sm"></i>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">
                    Database Correlation Check (CRM & Workflow)
                  </h3>
                  <p className="text-[11px] text-amber-600 font-semibold">
                    Stage 2: <span className="font-bold">{dbConflicts.length}</span> numbers already exist in database (out of{" "}
                    <span className="text-gray-800 font-bold">{fullyProcessedLeads.length}</span> leads)
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowDbConflictModal(false)}
                className="w-7 h-7 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 flex items-center justify-center transition-colors"
              >
                <i className="fi flex fi-rr-cross text-[11px]"></i>
              </button>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50/50">
              {dbConflicts.slice(0, 15).map((conflict, idx) => (
                <div key={idx} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-none">
                  {/* Top Bar */}
                  <div className="px-4 py-2 bg-amber-50/40 flex items-center justify-between border-b border-amber-100/60">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedDbConflicts.has(idx)}
                        onChange={() => {
                          const next = new Set(selectedDbConflicts);
                          if (next.has(idx)) next.delete(idx);
                          else next.add(idx);
                          setSelectedDbConflicts(next);
                        }}
                        className="w-3.5 h-3.5 rounded border-gray-300 text-amber-600 cursor-pointer"
                      />
                      <span className="font-bold text-gray-800 uppercase text-[10px]">
                        Match #{idx + 1}
                      </span>
                      <span className="text-gray-500 font-medium text-[11px]">
                        Phone: <strong className="text-black">{conflict.fileRecord.display_phone}</strong>
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedDbConflicts(new Set([idx]));
                          handleDbMergeSelected();
                        }}
                        className="px-2.5 py-1 rounded bg-[#4b33e8]/10 text-[#4b33e8] hover:bg-[#4b33e8]/20 font-bold text-[10px] transition-colors"
                      >
                        Merge Choice
                      </button>
                      <button
                        onClick={() => {
                          setSelectedDbConflicts(new Set([idx]));
                          handleDbSkipSelected();
                        }}
                        className="px-2.5 py-1 rounded bg-rose-50 text-rose-600 hover:bg-rose-100 font-bold text-[10px] transition-colors"
                      >
                        Reject / Skip New
                      </button>
                    </div>
                  </div>

                  {/* Side-by-Side Comparison */}
                  <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-100 p-3.5 gap-3">
                    {/* Left: Incoming */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-black text-[#4b33e8] uppercase tracking-wider">
                          Incoming File Record
                        </span>
                        <span className="text-[10px] text-gray-400 font-mono">Row #{conflict.fileRecord.row_index}</span>
                      </div>
                      <p className="font-bold text-gray-900 text-xs">{conflict.fileRecord.customer_name}</p>
                      <div className="flex flex-wrap gap-1 pt-1">
                        {Object.entries(
                          conflict.fileRecord.customer_details?.history?.["details-1"] || {}
                        ).map(([k, v]) => (
                          <span
                            key={k}
                            className="bg-indigo-50 border border-indigo-100 px-1.5 py-0.5 rounded text-[10px] text-[#4b33e8] font-medium"
                          >
                            {k.replace("_checked", "")}: {String(v)}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Right: Existing DB */}
                    <div className="space-y-1.5 md:pl-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-black text-amber-600 uppercase tracking-wider">
                          Existing in Database
                        </span>
                        {conflict.conflictType === "both" ? (
                          <span className="px-2 py-0.5 bg-rose-50 text-rose-600 rounded-full text-[9px] font-bold border border-rose-200">
                            EXISTS IN CRM & STAGED
                          </span>
                        ) : conflict.conflictType === "customer" ? (
                          <span className="px-2 py-0.5 bg-amber-50 text-amber-700 rounded-full text-[9px] font-bold border border-amber-200">
                            EXISTS IN CRM (CUSTOMERS)
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full text-[9px] font-bold border border-blue-200">
                            ALREADY IN WORKFLOW POOL
                          </span>
                        )}
                      </div>
                      <p className="font-bold text-gray-900 text-xs">
                        {conflict.customerMatch?.customer_name ||
                          conflict.scheduledMatch?.customer_name ||
                          "Existing Contact"}
                      </p>
                      <p className="text-[11px] text-gray-500">
                        {conflict.customerMatch
                          ? `Live CRM Customer (${conflict.customerMatch.status || "active"})`
                          : `Scheduled Lead in Workflow (${conflict.scheduledMatch?.upload_status || "staged"})`}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="px-5 py-3 border-t border-gray-100 flex items-center justify-between bg-white shrink-0">
              <span className="text-xs text-gray-500 font-medium">
                Matches: <span className="font-bold text-gray-800">{dbConflicts.length}</span>
              </span>

              <div className="flex items-center gap-2">
                {selectedDbConflicts.size > 0 && (
                  <>
                    <button
                      onClick={handleDbSkipSelected}
                      className="px-3.5 py-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 text-xs font-bold transition-colors"
                    >
                      Skip / Reject Selected ({selectedDbConflicts.size})
                    </button>
                    <button
                      onClick={handleDbMergeSelected}
                      className="px-3.5 py-1.5 rounded-lg bg-[#4b33e8] hover:bg-[#3d28d0] text-white text-xs font-bold transition-colors"
                    >
                      Merge Selected ({selectedDbConflicts.size})
                    </button>
                  </>
                )}
                <button
                  onClick={() => {
                    // Quick default: reject all remaining matches so only completely fresh leads are staged
                    if (
                      confirm(
                        `Skip all remaining ${dbConflicts.length} duplicate numbers and proceed with only fresh leads?`
                      )
                    ) {
                      setSelectedDbConflicts(new Set(dbConflicts.map((_, i) => i)));
                      setTimeout(handleDbSkipSelected, 50);
                    }
                  }}
                  className="px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition-colors"
                >
                  Skip All Duplicates & Proceed
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
