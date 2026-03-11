
import { useState, useRef, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { encryptPhone, computePhoneHash } from "../lib/phoneUtils";

interface ImportCustomersModalProps {
  show: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  preselectedOrgId?: string;
  preselectedCampaignId?: string;
}

export default function ImportCustomersModal({
  show,
  onClose,
  onSuccess,
  preselectedOrgId = "",
  preselectedCampaignId = "",
}: ImportCustomersModalProps) {
  const [showImportModal, setShowImportModal] = useState(show);
  const [showMappingModal, setShowMappingModal] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [importError, setImportError] = useState("");
  const [importSuccess, setImportSuccess] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [csvColumns, setCsvColumns] = useState<string[]>([]);
  const [fieldMapping, setFieldMapping] = useState<Record<string, string>>({});
  const [mergedFields, setMergedFields] = useState<Record<string, string[]>>({});
  const [customFields, setCustomFields] = useState<
    Array<{ id: string; name: string; mappedTo: string; isEdited?: boolean }>
  >([]);
  const [selectedFields, setSelectedFields] = useState<Record<string, boolean>>({
    name: true,
    phone: true,
    expiry_date: true,
  });

  const [organizations, setOrganizations] = useState<any[]>([]);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [selectedOrgId, setSelectedOrgId] = useState(preselectedOrgId);
  const [selectedCampaignId, setSelectedCampaignId] = useState(preselectedCampaignId);
  const [customExpiryDate, setCustomExpiryDate] = useState("");
  const [duplicates, setDuplicates] = useState<any[]>([]);
  const [showConflictModal, setShowConflictModal] = useState(false);

  // New states for Step 1 - File Verification
  const [fileConflicts, setFileConflicts] = useState<any[]>([]);
  const [showFileConflictModal, setShowFileConflictModal] = useState(false);
  const [selectedFileConflicts, setSelectedFileConflicts] = useState<Set<number>>(new Set());
  const [fullyProcessedCustomers, setFullyProcessedCustomers] = useState<any[]>([]);
  const [isVerificationComplete, setIsVerificationComplete] = useState(false);
  const [initialRecordCount, setInitialRecordCount] = useState(0);

  // New states for Step 2 - Database Verification
  const [dbConflicts, setDbConflicts] = useState<any[]>([]);
  const [showDbConflictModal, setShowDbConflictModal] = useState(false);
  const [isScanningDb, setIsScanningDb] = useState(false);
  const [isDbScanComplete, setIsDbScanComplete] = useState(false);
  const [isFinalizing, setIsFinalizing] = useState(false);
  const [selectedDbConflicts, setSelectedDbConflicts] = useState<Set<number>>(new Set());

  useEffect(() => {
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
  }, [show, preselectedOrgId, preselectedCampaignId]);

  // Re-fetch campaigns when selected organization changes
  useEffect(() => {
    if (showImportModal) {
      fetchCampaigns(selectedOrgId);
      // If we change org, we should probably clear campaign unless it's the preselected one
      if (selectedOrgId !== preselectedOrgId) {
        setSelectedCampaignId("");
      } else {
        setSelectedCampaignId(preselectedCampaignId);
      }
    }
  }, [selectedOrgId]);

  const fetchCampaigns = async (orgId?: string) => {
    try {
      let query = supabase
        .from("campaigns")
        .select("id, name")
        .eq("status", "active")
        .order("name", { ascending: true });
      
      if (orgId) {
        query = query.eq("organization_id", orgId);
      }

      const { data, error } = await query;
      if (!error) setCampaigns(data || []);
    } catch (err) {
      console.error("Error fetching campaigns:", err);
    }
  };

  const fetchOrganizations = async () => {
    try {
      const { data, error } = await supabase
        .from("organizations")
        .select("id, company_name, org_code")
        .eq("is_active", true)
        .order("company_name", { ascending: true });
      if (!error) setOrganizations(data || []);
    } catch (err) {
      console.error("Error fetching organizations:", err);
    }
  };

  const handleClose = () => {
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

  const parseCSVLine = (line: string): string[] => {
    const result: string[] = [];
    let current = "";
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
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

  const getFieldValue = (
    row: Record<string, string>,
    fieldKey: string,
    fieldMapping: Record<string, string>,
    mergedFields: Record<string, string[]>
  ): string => {
    const mainColumn = fieldMapping[fieldKey];
    if (!mainColumn) return "";
    let value = row[mainColumn] || "";
    const merged = mergedFields[fieldKey] || [];
    if (merged.length > 0) {
      const mergedValues = merged
        .filter((col) => col && row[col])
        .map((col) => row[col])
        .join(" ");
      if (mergedValues) value = value ? `${value} ${mergedValues}` : mergedValues;
    }
    return value.trim();
  };

  const generateLeadId = () => {
    return `LEAD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  };

    const verifyFileData = async () => {
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
        const lines = text.split("\n").filter((line) => line.trim());
        if (lines.length < 2) {
          setImportError("CSV file must contain at least a header row and one data row");
          setImporting(false);
          return;
        }

        const headers = parseCSVLine(lines[0]);
        const customers: any[] = [];
        const errors: string[] = [];

        for (let i = 1; i < lines.length; i++) {
          try {
            const values = parseCSVLine(lines[i]);
            if (values.length === 0 || values.every((v) => !v.trim())) continue;
            const row: Record<string, string> = {};
            headers.forEach((header, index) => {
              row[header.trim()] = values[index]?.trim() || "";
            });

            const customerName = getFieldValue(row, "name", fieldMapping, mergedFields);
            const phoneNo = getFieldValue(row, "phone", fieldMapping, mergedFields);
            
            const expiryDate = (fieldMapping["expiry_date"] === '__CUSTOM_DATE__')
               ? customExpiryDate
               : getFieldValue(row, "expiry_date", fieldMapping, mergedFields);

            if (!customerName || !phoneNo) continue;

            const customerDetails: Record<string, string> = {};
            customFields.forEach((cf) => {
               let value = row[cf.mappedTo] || "";
               const merged = mergedFields[cf.id] || [];
               if (merged.length > 0) {
                   const mergedValues = merged.filter((col) => col && row[col]).map((col) => row[col]).join(" ");
                   if (mergedValues) value = value ? `${value} ${mergedValues}` : mergedValues;
               }
               if (value) {
                  const suffix = selectedFields[`custom_${cf.id}`] !== false ? "_checked" : "_unchecked";
                  customerDetails[`${cf.name || cf.mappedTo}${suffix}`] = value.trim();
               }
            });

            // Robust Date parsing
            let parsedExpiryDate: string | null = null;
            if (expiryDate) {
              try {
                const cleanDate = expiryDate.toString().replace(/₹/g, "").trim();
                const parseDMY = (str: string) => {
                  const match = str.match(/^(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{2,4})$/);
                  if (match) {
                    let d = match[1].padStart(2, '0'), m = match[2].padStart(2, '0'), y = match[3];
                    if (y.length === 2) y = "20" + y;
                    return `${y}-${m}-${d}`;
                  }
                  return null;
                };
                const parseYMD = (str: string) => {
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
              phone_no: encryptPhone(phoneNo),
              display_phone: phoneNo, // Save raw number for UI display in conflict modal
              phone_search_hash: computePhoneHash(phoneNo),
              expiry_date: parsedExpiryDate,
              campaign_id: selectedCampaignId || null,
              organization_id: selectedOrgId || null,
              customer_details: {
                active_details: "details-1",
                history: {
                    "details-1": customerDetails
                }
              },
              status: "active",
            });
          } catch (e) {}
        }

        // STEP 1: Internal File Verification
        const hashCount: Record<string, number[]> = {};
        customers.forEach((c, idx) => {
            if (!c.phone_search_hash) return;
            if (!hashCount[c.phone_search_hash]) hashCount[c.phone_search_hash] = [];
            hashCount[c.phone_search_hash].push(idx);
        });

        const internalConflicts: any[] = [];
        const uniqueIndices = new Set<number>();
        const processedHashes = new Set<string>();

        Object.entries(hashCount).forEach(([hash, indices]) => {
            if (indices.length > 1) {
                // Duplicate found in file
                internalConflicts.push({
                    hash,
                    indices,
                    records: indices.map(idx => customers[idx])
                });
            } else {
                uniqueIndices.add(indices[0]);
            }
        });

        if (internalConflicts.length > 0) {
            setFileConflicts(internalConflicts);
            setFullyProcessedCustomers(customers);
            setInitialRecordCount(customers.length);
            setShowFileConflictModal(true);
            setImportError(`File contains ${internalConflicts.length} duplicate groups out of ${customers.length} total records.`);
        } else {
            setFullyProcessedCustomers(customers);
            setInitialRecordCount(customers.length);
            setIsVerificationComplete(true);
            setImportSuccess(`Verification complete! All ${customers.length} records ready for Stage 2.`);
        }
      } catch (err) {
        setImportError(`Error verifying file: ${err}`);
      } finally {
        setImporting(false);
      }
    };

    const handleFileMerge = (conflictIndex: number) => {
        const conflict = fileConflicts[conflictIndex];
        const newList = [...fullyProcessedCustomers];
        
        // Merge this one
        const records = conflict.records;
        const primaryRecord = { ...records[0] };
        
        // Combine history from all records
        const newHistory: any = {};
        let detailCounter = 1;
        records.forEach((rec: any) => {
            if (rec.customer_details.history) {
                Object.values(rec.customer_details.history).forEach((hVal) => {
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

        const idsToRemove = new Set(records.map((r: any) => r.lead_id));
        const filteredList = newList.filter((rec: any) => !idsToRemove.has(rec.lead_id));
        filteredList.push(primaryRecord);

        setFullyProcessedCustomers(filteredList);
        const newConflicts = [...fileConflicts];
        newConflicts.splice(conflictIndex, 1);
        setFileConflicts(newConflicts);
        setSelectedFileConflicts(new Set()); // Reset selection

        if (newConflicts.length === 0) {
            setShowFileConflictModal(false);
            setIsVerificationComplete(true);
            setImportSuccess(`Deduplication complete! Total: ${initialRecordCount} records. Moving ${filteredList.length} records to Stage 2.`);
        }
    };

    const handleFileReject = (conflictIndex: number) => {
        const conflict = fileConflicts[conflictIndex];
        const newList = [...fullyProcessedCustomers];
        const idsToRemove = new Set(conflict.records.slice(1).map((r: any) => r.lead_id));
        const filteredList = newList.filter((rec: any) => !idsToRemove.has(rec.lead_id));

        setFullyProcessedCustomers(filteredList);
        const newConflicts = [...fileConflicts];
        newConflicts.splice(conflictIndex, 1);
        setFileConflicts(newConflicts);
        setSelectedFileConflicts(new Set()); // Reset selection

        if (newConflicts.length === 0) {
            setShowFileConflictModal(false);
            setIsVerificationComplete(true);
            setImportSuccess(`Deduplication complete! Total: ${initialRecordCount} records. Moving ${filteredList.length} records to Stage 2.`);
        }
    };

    const handleBulkFileMerge = () => {
        if (selectedFileConflicts.size === 0) return;
        let currentList = [...fullyProcessedCustomers];
        const conflictsToRemoveIndices = Array.from(selectedFileConflicts).sort((a, b) => b - a); // Sort descending to splice correctly
        
        conflictsToRemoveIndices.forEach(idx => {
            const conflict = fileConflicts[idx];
            const primaryRecord = { ...conflict.records[0] };
            
            const newHistory: any = {};
            let detailCounter = 1;
            conflict.records.forEach((rec: any) => {
                if (rec.customer_details.history) {
                    Object.values(rec.customer_details.history).forEach((hVal) => {
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
            
            const idsToRemove = new Set(conflict.records.map((r: any) => r.lead_id));
            currentList = currentList.filter((rec: any) => !idsToRemove.has(rec.lead_id));
            currentList.push(primaryRecord);
        });

        setFullyProcessedCustomers(currentList);
        const newConflicts = fileConflicts.filter((_, idx) => !selectedFileConflicts.has(idx));
        setFileConflicts(newConflicts);
        setSelectedFileConflicts(new Set());

        if (newConflicts.length === 0) {
            setShowFileConflictModal(false);
            setIsVerificationComplete(true);
            setImportSuccess(`Deduplication complete (Bulk Merge)! Total: ${initialRecordCount} records. Moving ${currentList.length} records to Stage 2.`);
        }
    };

    const handleBulkFileReject = () => {
        if (selectedFileConflicts.size === 0) return;
        let currentList = [...fullyProcessedCustomers];
        const conflictsToRemoveIndices = Array.from(selectedFileConflicts);
        
        conflictsToRemoveIndices.forEach(idx => {
            const conflict = fileConflicts[idx];
            const idsToRemove = new Set(conflict.records.slice(1).map((r: any) => r.lead_id));
            currentList = currentList.filter((rec: any) => !idsToRemove.has(rec.lead_id));
        });

        setFullyProcessedCustomers(currentList);
        const newConflicts = fileConflicts.filter((_, idx) => !selectedFileConflicts.has(idx));
        setFileConflicts(newConflicts);
        setSelectedFileConflicts(new Set());

        if (newConflicts.length === 0) {
            setShowFileConflictModal(false);
            setIsVerificationComplete(true);
            setImportSuccess(`Deduplication complete (Bulk Reject)! Total: ${initialRecordCount} records. Moving ${currentList.length} records to Stage 2.`);
        }
    };

    const toggleSelectAllConflicts = () => {
        if (selectedFileConflicts.size === fileConflicts.length) {
            setSelectedFileConflicts(new Set());
        } else {
            setSelectedFileConflicts(new Set(fileConflicts.map((_, i) => i)));
        }
    };

    const toggleConflictSelection = (idx: number) => {
        const next = new Set(selectedFileConflicts);
        if (next.has(idx)) next.delete(idx);
        else next.add(idx);
        setSelectedFileConflicts(next);
    };

    const uploadCustomersToSupabase = async () => {
        if (!fullyProcessedCustomers.length) return;
        
        setIsScanningDb(true);
        setImportError("");
        setImportSuccess("");

        try {
            const hashes = fullyProcessedCustomers.map(c => c.phone_search_hash);
            
            // Query DB for existing numbers in this campaign/org
            const { data: existingRecords, error } = await supabase
                .from("customers")
                .select("*")
                .in("phone_search_hash", hashes)
                .eq("campaign_id", selectedCampaignId)
                .eq("organization_id", selectedOrgId);

            if (error) throw error;

            if (existingRecords && existingRecords.length > 0) {
                // Determine conflicts
                const conflicts = existingRecords.map((dbRec: any) => {
                    const fileRec = fullyProcessedCustomers.find((f: any) => f.phone_search_hash === dbRec.phone_search_hash);
                    return {
                        fileRecord: fileRec,
                        dbRecord: dbRec
                    };
                });

                setDbConflicts(conflicts);
                setShowDbConflictModal(true);
                // Notification message
                setImportError(`Stage 2: Found ${conflicts.length} existing CRM records. ${fullyProcessedCustomers.length - conflicts.length} new records will be added directly.`);
            } else {
                setImportSuccess(`Stage 2 Complete! All ${fullyProcessedCustomers.length} records are new and ready for CRM.`);
                setIsDbScanComplete(true);
            }
        } catch (err) {
            setImportError(`Error checking database: ${err}`);
        } finally {
            setIsScanningDb(false);
        }
    };

    const handleFinalUpload = async () => {
        if (!fullyProcessedCustomers.length || isFinalizing) return;
        
        setIsFinalizing(true);
        setImportError("");
        setImportSuccess("");

        try {
            // Separate records into updates (with ID) and new inserts (without ID)
            const toUpdate: any[] = [];
            const toInsert: any[] = [];

            fullyProcessedCustomers.forEach(({ display_phone, ...rest }) => {
                const payload = {
                    ...rest,
                    customer_details: typeof rest.customer_details === 'object' 
                        ? JSON.stringify(rest.customer_details) 
                        : rest.customer_details
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
                promises.push(supabase.from("customers").upsert(toUpdate));
            }
            if (toInsert.length > 0) {
                promises.push(supabase.from("customers").insert(toInsert));
            }

            const results = await Promise.all(promises);
            const firstError = results.find(r => r.error)?.error;

            if (firstError) throw firstError;

            setImportSuccess(`Import Successful! ${toUpdate.length + toInsert.length} records processed (${toUpdate.length} updated, ${toInsert.length} newly added).`);
            
            // Short delay to show success then close
            setTimeout(() => {
                handleClose(); // Resets all states and calls onClose
                onSuccess?.();
            }, 1000);

        } catch (err: any) {
            console.error("Final Upload Error:", err);
            setImportError(`Error uploading records: ${err.message || err}`);
        } finally {
            setIsFinalizing(false);
        }
    };

    const toggleDbConflictSelection = (idx: number) => {
        const newSelected = new Set(selectedDbConflicts);
        if (newSelected.has(idx)) newSelected.delete(idx);
        else newSelected.add(idx);
        setSelectedDbConflicts(newSelected);
    };

    const toggleSelectAllDbConflicts = () => {
        if (selectedDbConflicts.size === dbConflicts.length) {
            setSelectedDbConflicts(new Set());
        } else {
            setSelectedDbConflicts(new Set(dbConflicts.map((_, i) => i)));
        }
    };

    const handleDbMergeSelected = () => {
        if (selectedDbConflicts.size === 0) return;

        let workingCustomers = [...fullyProcessedCustomers];
        const conflictsToHandle = Array.from(selectedDbConflicts).sort((a, b) => b - a);

        conflictsToHandle.forEach((idx) => {
            const conflict = dbConflicts[idx];
            // Merging Database details into the file record
            // Keep existing DB ID but merge file information or vice versa?
            // User usually wants to update the existing record.
            const dbRec = conflict.dbRecord;
            const fileRec = conflict.fileRecord;

            // Simple merge strategy: Update existing DB record with new CSV details (keeping history)
            const dbDetails = (typeof dbRec.customer_details === 'string') 
                ? JSON.parse(dbRec.customer_details) 
                : dbRec.customer_details || { active_details: "details-1", history: { "details-1": {} } };
            
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
                ...fileRec, // Take fields from file
                id: dbRec.id, // KEEP EXISTING DB ID to perform an update in final upload
                customer_details: dbDetails,
                updated_at: new Date().toISOString()
            };

            // Replace or Update in the fullyProcessedCustomers list
            const fIndex = workingCustomers.findIndex(c => c.phone_search_hash === fileRec.phone_search_hash);
            if (fIndex !== -1) {
                workingCustomers[fIndex] = mergedRecord;
            }
        });

        setFullyProcessedCustomers(workingCustomers);
        
        // Remove handled ones from dbConflicts
        const remainingConflicts = dbConflicts.filter((_, i) => !selectedDbConflicts.has(i));
        setDbConflicts(remainingConflicts);
        setSelectedDbConflicts(new Set());

        if (remainingConflicts.length === 0) {
            setShowDbConflictModal(false);
            setIsDbScanComplete(true);
            setImportSuccess(`Stage 2 Complete! ${workingCustomers.length} records finalized for CRM.`);
        }
    };

    const handleDbSkipSelected = () => {
       if (selectedDbConflicts.size === 0) return;

       const phoneHashesToSkip = Array.from(selectedDbConflicts).map(idx => dbConflicts[idx].fileRecord.phone_search_hash);
       
       // Remove these from fullyProcessedCustomers (Rejecting the new import for these phones)
       const workingCustomers = fullyProcessedCustomers.filter(c => !phoneHashesToSkip.includes(c.phone_search_hash));
       setFullyProcessedCustomers(workingCustomers);

       // Remove from dbConflicts
       const remainingConflicts = dbConflicts.filter((_, i) => !selectedDbConflicts.has(i));
       setDbConflicts(remainingConflicts);
       setSelectedDbConflicts(new Set());

        if (remainingConflicts.length === 0) {
            setShowDbConflictModal(false);
            setIsDbScanComplete(true);
            setImportSuccess(`Stage 2 Complete! ${workingCustomers.length} records finalized for CRM.`);
        }
    };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImportFile(file);
    const text = await file.text();
    const firstLine = text.split("\n")[0];
    if (firstLine) {
      const cols = parseCSVLine(firstLine);
      setCsvColumns(cols);
      const initialMapping: Record<string, string> = {};
      const coreFields = ["name", "phone", "expiry_date"];
      
      const mappedCols = new Set<string>();

      coreFields.forEach(f => {
        const match = cols.find(c => c.toLowerCase().includes(f.toLowerCase()));
        if (match) {
            initialMapping[f] = match;
            mappedCols.add(match);
        }
      });

      // Auto-generate custom fields for all other columns
      const autoCustomFields = cols
        .filter(col => !mappedCols.has(col) && col.trim() !== "")
        .map(col => ({
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

  /* Custom Fields Logic */
  const addCustomField = () => {
    setCustomFields([
      ...customFields,
      { id: Date.now().toString(), name: "", mappedTo: "", isEdited: false },
    ]);
  };

  const removeCustomField = (id: string) => {
    setCustomFields(customFields.filter((f) => f.id !== id));
  };

  /* Merged Fields Logic */
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

  const updateCustomField = (id: string, key: "name" | "mappedTo", value: string) => {
    setCustomFields(
      customFields.map((f) => {
        if (f.id !== id) return f;

        if (key === "name") {
            return { ...f, name: value, isEdited: true };
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
      })
    );
  };

  // Get set of all currently mapped columns
  const getUsedColumns = () => {
    const used = new Set<string>();
    // Add standard field mappings
    Object.values(fieldMapping).forEach(val => {
        if (val) used.add(val);
    });
    // Add merged fields
    Object.values(mergedFields).forEach(arr => {
        arr.forEach(val => {
            if (val) used.add(val);
        });
    });
    // Add custom mapped fields
    customFields.forEach(f => {
        if (f.mappedTo) used.add(f.mappedTo);
    });
    return used;
  };

  const handleMergeDuplicate = async (duplicate: any) => {
    try {
      const existingDetails = typeof duplicate.existing.customer_details === 'string'
        ? JSON.parse(duplicate.existing.customer_details)
        : duplicate.existing.customer_details || {};
        
      const newDetails = typeof duplicate.new.customer_details === 'string'
        ? JSON.parse(duplicate.new.customer_details)
        : duplicate.new.customer_details || {};
      
      // If newDetails is already structured, extract flat data
      const flatIncoming = (newDetails.history && newDetails.active_details) 
        ? newDetails.history[newDetails.active_details] 
        : newDetails;

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
      
      const { error } = await supabase
        .from("customers")
        .update({ customer_details: JSON.stringify(finalStructured) })
        .eq("id", duplicate.existing.id);
        
      if (error) throw error;
      
      // Remove from duplicates list
      setDuplicates(prev => {
        const remaining = prev.filter(d => d.existing.id !== duplicate.existing.id);
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

  const handleRejectDuplicate = (id: string) => {
    setDuplicates(prev => {
        const remaining = prev.filter(d => d.existing.id !== id);
        if (remaining.length === 0) {
            setImportSuccess("All duplicates handled.");
            if (onSuccess) onSuccess();
            setTimeout(handleClose, 1500);
        }
        return remaining;
    });
  };

  const handleMergeAll = async () => {
    if (!confirm(`Are you sure you want to merge all ${duplicates.length} duplicates? This will update existing records with new information.`)) return;
    
    setImporting(true);
    let mergedCount = 0;
    
    try {
        for (const duplicate of duplicates) {
            const existingDetails = typeof duplicate.existing.customer_details === 'string'
                ? JSON.parse(duplicate.existing.customer_details)
                : duplicate.existing.customer_details || {};
                
            const newDetails = typeof duplicate.new.customer_details === 'string'
                ? JSON.parse(duplicate.new.customer_details)
                : duplicate.new.customer_details || {};
            
            const flatIncoming = (newDetails.history && newDetails.active_details) 
              ? newDetails.history[newDetails.active_details] 
              : newDetails;

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
            
            await supabase
                .from("customers")
                .update({ customer_details: JSON.stringify(finalStructured) })
                .eq("id", duplicate.existing.id);
            
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
    } finally {
        setImporting(false);
    }
  };

  const usedColumns = getUsedColumns(); // Calculate for render

  const renderDetailsPreview = (details: any) => {
    if (!details) return null;
    let data = details;
    if (typeof details === 'string') {
      try {
        data = JSON.parse(details);
      } catch (e) {
        return <p className="text-[10px] text-gray-400 italic">{details}</p>;
      }
    }
    if (typeof data !== 'object' || data === null) return null;

    // Support structured JSON in preview
    let displayData = data;
    if (data.active_details && data.history) {
        displayData = data.history[data.active_details] || {};
    }

    return Object.entries(displayData).slice(0, 4).map(([k, v]) => (
      <div key={k} className="flex justify-between text-[11px] gap-2">
        <span className="text-gray-400 truncate">{k.split('_')[0]}:</span>
        <span className="font-semibold text-gray-600 truncate">{String(v)}</span>
      </div>
    ));
  };

  if (!showImportModal && !showMappingModal && !showConflictModal) return null;

  return (
    <>
      {/* Import Modal */}
      {showImportModal && !showMappingModal && (
        <div className="fixed inset-0 backdrop-blur-lg flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold" style={{ color: "#263238", fontFamily: "'Poppins', sans-serif" }}>Import Customers</h2>
              <button onClick={handleClose} className="text-gray-400 hover:text-gray-600">
                <i className="fi flex fi-rr-cross text-xl"></i>
              </button>
            </div>
            <div className="p-6">
              <div className="mb-6 p-4 bg-blue-50 rounded-lg text-sm text-gray-700">
                <strong>Instructions:</strong> Upload a CSV file with customer data.
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Select Organization</label>
                  </div>
                  <select 
                    value={selectedOrgId} 
                    onChange={(e) => setSelectedOrgId(e.target.value)}
                    disabled={!!preselectedOrgId}
                    className={`w-full px-4 py-2.5 text-gray-500 bg-gray-50 border border-gray-200 rounded-xl text-sm ${preselectedOrgId ? 'opacity-60 cursor-not-allowed' : ''}`}
                  >
                    <option value="">Select Organization</option>
                    {organizations.map(org => <option key={org.id} value={org.id}>{org.company_name} ({org.org_code})</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Select Campaign</label>
                  </div>
                  <select 
                    value={selectedCampaignId} 
                    onChange={(e) => setSelectedCampaignId(e.target.value)}
                    disabled={!!preselectedCampaignId}
                    className={`w-full px-4 py-2.5 text-gray-500 bg-gray-50 border border-gray-200 rounded-xl text-sm ${preselectedCampaignId ? 'opacity-60 cursor-not-allowed' : ''}`}
                  >
                    <option value="">Select Campaign</option>
                    {campaigns.map(camp => <option key={camp.id} value={camp.id}>{camp.name}</option>)}
                  </select>
                </div>
              </div>

              <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-10 text-center hover:border-[#4b33e8] transition-colors">
                <input ref={fileInputRef} type="file" accept=".csv" onChange={handleFileUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                <i className="fi flex fi-rr-upload text-3xl text-gray-400 mb-2 justify-center"></i>
                <p className="text-sm text-gray-500">Click or drag CSV file here</p>
                {importFile && <p className="mt-2 text-sm text-[#4b33e8] font-bold">{importFile.name}</p>}
              </div>

              {importError && <div className="mt-4 p-3 bg-red-50 text-red-600 rounded text-sm">{importError}</div>}
              {importSuccess && <div className="mt-4 p-3 bg-green-50 text-green-600 rounded text-sm">{importSuccess}</div>}
              
              <div className="flex justify-end gap-3 mt-6">
                <button onClick={handleClose} className="px-6 py-2 bg-gray-100 rounded-lg text-sm font-medium">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mapping Modal */}
      {showMappingModal && (
        <div className="fixed inset-0 backdrop-blur-lg flex items-center justify-center z-[70] p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl text-[#4b33e8] font-semibold">Map CSV Columns</h2>
              <button onClick={handleClose} className="text-gray-400 hover:text-gray-600">
                <i className="fi flex fi-rr-cross text-xl"></i>
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {["name", "phone", "expiry_date"].map(field => (
                  <div key={field} className="space-y-1">
                    <div className="flex items-center justify-between">
                       <label className="text-xs font-bold text-gray-500 uppercase">{field.replace("_", " ")}</label>
                       {field === 'expiry_date' && (
                          <div className="flex items-center gap-2">
                             <input 
                                type="checkbox" 
                                id={`check_${field}`}
                                checked={!!selectedFields[field]}
                                onChange={(e) => setSelectedFields({...selectedFields, [field]: e.target.checked})}
                                className="w-3 h-3 text-[#4b33e8] border-gray-300 rounded focus:ring-[#4b33e8]"
                             />
                             <label htmlFor={`check_${field}`} className="text-[10px] text-gray-400 cursor-pointer">Show in App</label>
                          </div>
                       )}
                    </div>
                    <div className="flex gap-2">
                        <div className="flex flex-col w-full gap-2">
                            <select
                              value={fieldMapping[field] || ""}
                              onChange={(e) => setFieldMapping({ ...fieldMapping, [field]: e.target.value })}
                              className="w-full text-gray-500 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm"
                            >
                              <option value="">Select column...</option>
                              {field === 'expiry_date' && (
                                <option value="__CUSTOM_DATE__" className="font-bold text-[#4b33e8]">✨ Set Custom Date</option>
                              )}
                              {csvColumns.filter(col => !usedColumns.has(col) || col === fieldMapping[field]).map(col => <option key={col} value={col}>{col}</option>)}
                            </select>
                            
                            {/* Custom Date Picker Input */}
                            {field === 'expiry_date' && fieldMapping[field] === '__CUSTOM_DATE__' && (
                                <input 
                                    type="date"
                                    value={customExpiryDate}
                                    onChange={(e) => setCustomExpiryDate(e.target.value)}
                                    className="w-full px-3 py-2 bg-[#f0f2ff] border border-[#4b33e8] rounded-lg text-sm text-[#4b33e8] font-bold focus:outline-none focus:ring-1 focus:ring-[#4b33e8] animate-in fade-in slide-in-from-top-1"
                                />
                            )}
                        </div>
                        <button 
                            onClick={() => addMergedField(field)}
                            className="p-2 w-9 h-9 bg-blue-50 text-[#4b33e8] rounded-lg hover:bg-blue-100 transition-colors"
                            title="Merge another column"
                        >
                            <i className="fi fi-rr-plus text-xs"></i>
                        </button>
                    </div>
                    {/* Merged Fields for Standard Fields */}
                    {mergedFields[field] && mergedFields[field].map((val, idx) => (
                        <div key={idx} className="flex gap-2 mt-1 pl-4 relative">
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-px bg-gray-300"></div>
                            <select
                                value={val}
                                onChange={(e) => updateMergedField(field, idx, e.target.value)}
                                className="w-full text-gray-500 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm"
                            >
                                <option value="">Select column to merge...</option>
                                {csvColumns.filter(col => !usedColumns.has(col) || col === val).map(col => <option key={col} value={col}>{col}</option>)}
                            </select>
                            <button 
                                onClick={() => removeMergedField(field, idx)}
                                className="p-2 w-9 h-9 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors"
                            >
                                <i className="fi fi-rr-trash text-xs"></i>
                            </button>
                        </div>
                    ))}
                  </div>
                ))}
              </div>

              {/* Custom Fields Section */}
              <div className="mb-6 border-t border-gray-100 pt-4">
                <div className="flex items-center justify-between mb-3">
                   <label className="text-xs font-bold text-gray-500 uppercase">Additional Columns (Auto-Detected)</label>
                   <button 
                     onClick={addCustomField} 
                     className="text-xs text-[#4b33e8] font-bold hover:underline flex items-center gap-1"
                   >
                     <i className="fi fi-rr-plus"></i> Add Field
                   </button>
                </div>
                
                {customFields.length > 0 ? (
                  <div className="space-y-3">
                    {customFields.map((cf) => (
                      <div key={cf.id} className="space-y-2">
                        <div className="flex gap-3 items-center">
                           <div className="flex items-center pt-2">
                              <input 
                                  type="checkbox"
                                  checked={selectedFields[`custom_${cf.id}`] !== false} // Default true
                                  onChange={(e) => setSelectedFields({...selectedFields, [`custom_${cf.id}`]: e.target.checked})}
                                  className="w-4 h-4 text-[#4b33e8] border-gray-300 rounded focus:ring-[#4b33e8]"
                                  title="Show in Customer Details"
                               />
                           </div>
                           <input
                              placeholder="Field Name (e.g. Plan Type)"
                              className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#4b33e8]"
                              value={cf.name}
                              onChange={(e) => updateCustomField(cf.id, "name", e.target.value)}
                           />
                           <i className="fi fi-rr-arrow-right text-gray-300"></i>
                           <div className="flex-1 flex gap-2">
                               <select
                                   className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-500 focus:outline-none focus:ring-1 focus:ring-[#4b33e8]"
                                   value={cf.mappedTo}
                                   onChange={(e) => updateCustomField(cf.id, "mappedTo", e.target.value)}
                               >
                                    <option value="">Select CSV column...</option>
                                    {csvColumns.filter(col => !usedColumns.has(col) || col === cf.mappedTo).map((col) => (
                                      <option key={col} value={col}>{col}</option>
                                    ))}
                               </select>
                               <button 
                                  onClick={() => addMergedField(cf.id)}
                                  className="p-2 w-9 h-9 bg-blue-50 text-[#4b33e8] rounded-lg hover:bg-blue-100 transition-colors flex-shrink-0"
                                  title="Merge another column"
                               >
                                  <i className="fi fi-rr-plus text-xs"></i>
                               </button>
                           </div>
                           <button 
                             onClick={() => removeCustomField(cf.id)} 
                             className="p-2 w-9 h-9 flex items-center justify-center rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors flex-shrink-0"
                           >
                             <i className="fi flex fi-rr-trash text-sm"></i>
                           </button>
                        </div>
                        {/* Merged Fields for Custom Fields */}
                        {mergedFields[cf.id] && mergedFields[cf.id].map((val, idx) => (
                            <div key={idx} className="flex gap-2 pl-[calc(2rem_+_1px)] relative">
                                <div className="absolute left-[1rem] top-1/2 -translate-y-1/2 w-4 h-px bg-gray-300"></div>
                                <div className="flex-1"></div> {/* Spacer to align with right side */}
                                <div className="flex-1 flex gap-2">
                                     <select
                                        value={val}
                                        onChange={(e) => updateMergedField(cf.id, idx, e.target.value)}
                                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-500 focus:outline-none focus:ring-1 focus:ring-[#4b33e8]"
                                     >
                                         <option value="">Select column to merge...</option>
                                         {csvColumns.filter(col => !usedColumns.has(col) || col === val).map(col => <option key={col} value={col}>{col}</option>)}
                                     </select>
                                     <button 
                                         onClick={() => removeMergedField(cf.id, idx)}
                                         className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors flex-shrink-0"
                                     >
                                         <i className="fi fi-rr-trash text-xs"></i>
                                     </button>
                                     <div className="w-8"></div> {/* Spacer for delete button alignment */}
                                </div>
                            </div>
                        ))}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-gray-400 italic text-center py-2 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                    No custom fields added
                  </div>
                )}
              </div>
              
              {importError && <div className="mb-4 p-3 bg-red-50 text-red-600 rounded text-sm">{importError}</div>}
              {importSuccess && <div className="mb-4 p-3 bg-green-50 text-green-600 rounded text-sm">{importSuccess}</div>}

              <div className="flex justify-end gap-3 border-t pt-4">
                <button onClick={() => setShowMappingModal(false)} className="px-6 py-2 bg-gray-100 rounded-lg text-sm">Back</button>
                {isVerificationComplete ? (
                    <button 
                        onClick={isDbScanComplete ? handleFinalUpload : uploadCustomersToSupabase}
                        disabled={isScanningDb || isFinalizing}
                        className={`px-6 py-2 rounded-lg text-sm font-bold flex items-center gap-2 ${isDbScanComplete ? 'bg-indigo-600 hover:bg-indigo-700 animate-pulse-subtle' : 'bg-green-600 hover:bg-green-700'} text-white transition-all`}
                    >
                        {isScanningDb ? (
                            <><div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div> Checking DB...</>
                        ) : isFinalizing ? (
                             <><div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div> Finalizing...</>
                        ) : isDbScanComplete ? (
                            <><i className="fi fi-rr-upload text-sm"></i> Upload Now</>
                        ) : (
                            <>Success: {fullyProcessedCustomers.length} Records Ready - Next Step</>
                        )}
                    </button>
                ) : (
                    <button 
                        onClick={verifyFileData} 
                        disabled={importing}
                        className="px-6 py-2 bg-[#4b33e8] text-white rounded-lg text-sm font-bold flex items-center gap-2"
                    >
                        {importing ? <><div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div> Verifying...</> : "Verify File Data"}
                    </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 1: FILE CONFLICT MODAL (MATCHING DUPLICATE SCAN DESIGN) */}
      {showFileConflictModal && fileConflicts.length > 0 && (
          <div className="fixed inset-0 z-[130] flex items-center justify-center bg-black/30 backdrop-blur-sm p-4 text-xs">
              <div className="bg-white rounded-lg w-full max-w-4xl shadow-2xl flex flex-col max-h-[80vh] border border-gray-100 overflow-hidden">
                  
                  {/* Clean Simple Header */}
                  <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-white">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-3 mr-2">
                           <input 
                              type="checkbox" 
                              checked={selectedFileConflicts.size === fileConflicts.length && fileConflicts.length > 0}
                              onChange={toggleSelectAllConflicts}
                              className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                           />
                        </div>
                        <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                           <i className="fi flex fi-rr-copy-alt text-sm"></i>
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-800" style={{ fontFamily: "'Poppins', sans-serif" }}>File Internal Duplicates</h3>
                          <p className="text-[10px] text-gray-400 font-medium">
                            <span className="text-indigo-600 font-bold">{fileConflicts.length}</span> repeating numbers found in this CSV <span className="text-gray-300 mx-1">|</span> Total Records: <span className="text-gray-600 font-bold">{fullyProcessedCustomers.length}</span>
                          </p>
                        </div>
                      </div>
                      
                      <button 
                        onClick={() => setShowFileConflictModal(false)} 
                        className="w-8 h-8 rounded-lg hover:bg-gray-50 flex items-center justify-center text-gray-400 transition-colors"
                      >
                        <i className="fi flex fi-rr-cross-small text-xl"></i>
                      </button>
                  </div>

                  {/* Table Content */}
                  <div className="flex-1 overflow-y-auto custom-scrollbar bg-white">
                      {fileConflicts.slice(0, 10).map((conflict, idx) => (
                          <div key={idx} className="bg-white">
                              {/* Group Bar */}
                              <div className="px-5 py-2 bg-gray-50/50 flex items-center justify-between border-y border-gray-50">
                                  <div className="flex items-center gap-3">
                                      <input 
                                          type="checkbox" 
                                          checked={selectedFileConflicts.has(idx)}
                                          onChange={() => toggleConflictSelection(idx)}
                                          className="w-3.5 h-3.5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                                      />
                                      <span className="font-bold text-gray-500 uppercase text-[10px] tracking-tight ml-1">Repeating Group #{idx + 1}</span>
                                  </div>
                                  <div className="flex gap-4 items-center">
                                     <span className="text-[10px] text-indigo-500 font-bold bg-indigo-50 px-2 py-0.5 rounded uppercase">{conflict.records.length} Records Found</span>
                                     <div className="h-4 w-px bg-gray-200"></div>
                                     <button 
                                        onClick={() => handleFileMerge(idx)}
                                        className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 transition-colors flex items-center gap-1"
                                     >
                                        <i className="fi flex fi-rr-check text-[9px]"></i> Merge All
                                     </button>
                                     <button 
                                        onClick={() => handleFileReject(idx)}
                                        className="text-[10px] font-bold text-rose-500 hover:text-rose-700 transition-colors flex items-center gap-1"
                                     >
                                        <i className="fi flex fi-rr-trash text-[9px]"></i> Reject
                                     </button>
                                  </div>
                              </div>
                              
                              <table className="w-full text-left table-fixed">
                                  <thead>
                                      <tr className="text-gray-400 uppercase text-[9px] font-bold border-b border-gray-100 bg-gray-50/20">
                                          <th className="px-5 py-3 w-[25%]">Name / Info</th>
                                          <th className="px-3 py-3 w-[45%]">Mapped Details</th>
                                          <th className="px-3 py-3 w-[15%]">Row Index</th>
                                          <th className="px-5 py-3 w-[15%] text-right">Status</th>
                                      </tr>
                                  </thead>
                                  <tbody className="divide-y divide-gray-50">
                                      {conflict.records.map((rec: any, ridx: number) => (
                                          <tr key={ridx} className="hover:bg-gray-50/5 transition-colors group">
                                              <td className="px-5 py-4 align-top">
                                                  <div className="font-bold text-gray-800 text-[11px] leading-tight truncate">{rec.customer_name}</div>
                                                  <div className="text-[10px] text-indigo-500 font-bold mt-1 tracking-tight">
                                                    {rec.display_phone || 'N/A'}
                                                  </div>
                                              </td>
                                              <td className="px-3 py-4 align-top text-wrap">
                                                  <div className="flex flex-wrap gap-1.5">
                                                      {Object.entries(
                                                          rec.customer_details.history?.[rec.customer_details.active_details] || {}
                                                      ).slice(0, 6).map(([k, v]) => (
                                                          <div key={k} className="flex flex-col bg-slate-50 p-1.5 rounded border border-gray-100 min-w-[90px] max-w-[150px]">
                                                              <span className="text-[7px] font-bold text-gray-400 uppercase tracking-tighter leading-none mb-1">
                                                                {k.replace('detail_', '').replace(/_/g, ' ')}
                                                              </span>
                                                              <span className="text-[10px] text-slate-700 font-semibold truncate">
                                                                {String(v) || '—'}
                                                              </span>
                                                          </div>
                                                      ))}
                                                  </div>
                                              </td>
                                              <td className="px-3 py-4 align-top">
                                                  <div className="flex items-center gap-1.5 text-gray-500">
                                                    <span className="font-mono text-[11px] font-bold">#{conflict.indices[ridx] + 1}</span>
                                                  </div>
                                                  <p className="text-[8px] text-gray-400 uppercase mt-1">Row Num</p>
                                              </td>
                                              <td className="px-5 py-4 align-top text-right">
                                                  {ridx === 0 ? (
                                                      <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full border border-emerald-100 uppercase tracking-tighter">PRIMARY</span>
                                                  ) : (
                                                      <span className="text-[9px] font-bold text-amber-500 bg-amber-50 px-2 py-1 rounded-full border border-amber-100 uppercase tracking-tighter">DUPLICATE</span>
                                                  )}
                                              </td>
                                          </tr>
                                      ))}
                                  </tbody>
                              </table>
                          </div>
                      ))}

                      {fileConflicts.length > 10 && (
                          <div className="p-8 text-center bg-gray-50/50 border-t border-gray-100">
                              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest leading-loose">
                                  And {fileConflicts.length - 10} more duplicate clusters...<br/>
                                  <span className="text-[10px] font-medium lowercase">Please handle these first to proceed.</span>
                              </p>
                          </div>
                      )}
                  </div>

                  {/* Footer with Bulk Actions */}
                  <div className="px-5 py-3 border-t border-gray-100 flex items-center justify-between bg-white rounded-b-lg">
                      <div className="flex items-center gap-4">
                        <span className="text-gray-400 font-medium">
                            Total groups: <span className="text-gray-700 font-bold">{fileConflicts.length}</span>
                        </span>
                        {selectedFileConflicts.size > 0 && (
                            <div className="flex items-center gap-2 animate-in slide-in-from-left-2 duration-200">
                                <div className="h-4 w-px bg-gray-200"></div>
                                <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg">
                                    {selectedFileConflicts.size} Selected
                                </span>
                                <button 
                                    onClick={handleBulkFileReject}
                                    className="px-4 py-1.5 bg-rose-50 text-rose-600 rounded-lg font-bold text-[11px] hover:bg-rose-100 transition-all border border-rose-100"
                                >
                                    Reject Selected
                                </button>
                                <button 
                                    onClick={handleBulkFileMerge}
                                    className="px-4 py-1.5 bg-indigo-600 text-white rounded-lg font-bold text-[11px] hover:bg-slate-900 transition-all shadow-lg shadow-indigo-100"
                                >
                                    Merge Selected
                                </button>
                            </div>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button 
                            onClick={() => setShowFileConflictModal(false)}
                            className="px-5 py-2 bg-gray-50 text-gray-600 rounded-lg font-bold text-[11px] hover:bg-gray-100 transition-all border border-gray-200"
                        >
                            Review CSV
                        </button>
                      </div>
                  </div>
              </div>
          </div>
      )}

      {/* STEP 2: DATABASE CONFLICT MODAL (REDESIGNED: SIMPLE & COMPACT) */}
      {showDbConflictModal && dbConflicts.length > 0 && (
          <div className="fixed inset-0 z-[140] flex items-center justify-center bg-black/30 backdrop-blur-sm p-4 text-xs">
              <div className="bg-white rounded-lg w-full max-w-5xl shadow-2xl flex flex-col max-h-[85vh] border border-gray-100 overflow-hidden">
                  
                  {/* Clean Simple Amber Header */}
                  <div className="px-5 py-4 border-b border-amber-50 flex items-center justify-between bg-white">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-3 mr-2">
                           <input 
                              type="checkbox" 
                              checked={selectedDbConflicts.size === dbConflicts.length && dbConflicts.length > 0}
                              onChange={toggleSelectAllDbConflicts}
                              className="w-4 h-4 rounded border-gray-300 text-amber-600 focus:ring-amber-500 cursor-pointer"
                           />
                        </div>
                        <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
                           <i className="fi flex fi-rr-database text-sm"></i>
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-800" style={{ fontFamily: "'Poppins', sans-serif" }}>Database Correlation Check</h3>
                           <p className="text-[10px] text-amber-500 font-bold uppercase tracking-tight">
                            Stage 2: <span className="text-amber-600 font-black">{dbConflicts.length}</span> records already exist in CRM (out of <span className="text-gray-600">{fullyProcessedCustomers.length}</span> total records)
                          </p>
                        </div>
                      </div>
                      
                      <button 
                        onClick={() => setShowDbConflictModal(false)} 
                        className="w-8 h-8 rounded-lg hover:bg-gray-50 flex items-center justify-center text-gray-400 transition-colors"
                      >
                        <i className="fi flex fi-rr-cross-small text-xl"></i>
                      </button>
                  </div>

                  {/* Table Content */}
                  <div className="flex-1 overflow-y-auto custom-scrollbar bg-white">
                      {dbConflicts.slice(0, 10).map((conflict, idx) => (
                          <div key={idx} className="bg-white">
                              {/* Group Bar */}
                              <div className="px-5 py-2 bg-amber-50/20 flex items-center justify-between border-y border-amber-50/50">
                                  <div className="flex items-center gap-3">
                                      <input 
                                          type="checkbox" 
                                          checked={selectedDbConflicts.has(idx)}
                                          onChange={() => toggleDbConflictSelection(idx)}
                                          className="w-3.5 h-3.5 rounded border-gray-300 text-amber-600 focus:ring-amber-500 cursor-pointer"
                                      />
                                      <span className="font-bold text-amber-700 uppercase text-[10px] tracking-tight ml-1 leading-none">Correlation Match #{idx + 1}</span>
                                  </div>
                                  <div className="flex gap-4 items-center">
                                     <span className="text-[10px] text-gray-400 font-medium">Phone: <span className="text-gray-700 font-bold">{conflict.fileRecord.display_phone}</span></span>
                                     <div className="h-4 w-px bg-amber-100"></div>
                                     <button 
                                        onClick={() => {
                                            setSelectedDbConflicts(new Set([idx]));
                                            handleDbMergeSelected();
                                        }}
                                        className="text-[10px] font-bold text-amber-600 hover:text-amber-800 transition-colors flex items-center gap-1"
                                     >
                                        <i className="fi flex fi-rr-check text-[9px]"></i> Merge Choice
                                     </button>
                                     <button 
                                        onClick={() => {
                                            setSelectedDbConflicts(new Set([idx]));
                                            handleDbSkipSelected();
                                        }}
                                        className="text-[10px] font-bold text-rose-500 hover:text-rose-700 transition-colors flex items-center gap-1"
                                     >
                                        <i className="fi flex fi-rr-cross text-[9px]"></i> Reject New
                                     </button>
                                  </div>
                              </div>
                              
                              {/* Comparison Row */}
                              <div className="grid grid-cols-2 divide-x divide-gray-100 border-b border-gray-50">
                                  {/* Left/Incoming */}
                                  <div className="p-4 bg-indigo-50/5">
                                      <div className="flex items-center justify-between mb-2">
                                          <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">Incoming Data</span>
                                      </div>
                                      <div className="flex items-start gap-3">
                                          <div className="flex-1">
                                              <p className="text-[11px] font-bold text-gray-800 leading-tight">{conflict.fileRecord.customer_name}</p>
                                              <div className="flex flex-wrap gap-1 mt-2">
                                                   {Object.entries(
                                                        conflict.fileRecord.customer_details.history?.[conflict.fileRecord.customer_details.active_details] || {}
                                                   ).slice(0, 4).map(([k, v]) => (
                                                       <div key={k} className="bg-white px-2 py-1 rounded border border-indigo-100 text-[10px]">
                                                           <span className="text-gray-400 font-bold text-[8px] mr-1">{k.replace('_checked', '').replace(/_/g, ' ')}:</span>
                                                           <span className="text-indigo-600 font-bold">{String(v)}</span>
                                                       </div>
                                                   ))}
                                              </div>
                                          </div>
                                      </div>
                                  </div>

                                  {/* Right/Database */}
                                  <div className="p-4 bg-amber-50/5">
                                      <div className="flex items-center justify-between mb-2">
                                          <span className="text-[9px] font-black text-amber-500 uppercase tracking-widest">Database Record</span>
                                          <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full text-[9px] font-bold border border-amber-200 uppercase tracking-tighter">EXISTS IN CRM</span>
                                      </div>
                                      <div className="flex items-start gap-3">
                                          <div className="flex-1">
                                              <p className={`text-[11px] font-bold leading-tight ${conflict.dbRecord.customer_name !== conflict.fileRecord.customer_name ? 'text-rose-500' : 'text-gray-800'}`}>
                                                  {conflict.dbRecord.customer_name}
                                                  {conflict.dbRecord.customer_name !== conflict.fileRecord.customer_name && (
                                                      <span className="block text-[8px] font-medium italic mt-0.5 uppercase">(Name Mismatch)</span>
                                                  )}
                                              </p>
                                              <div className="flex flex-wrap gap-1 mt-2">
                                                   {(() => {
                                                        const dbDetails = (typeof conflict.dbRecord.customer_details === 'string') 
                                                            ? JSON.parse(conflict.dbRecord.customer_details) 
                                                            : conflict.dbRecord.customer_details || {};
                                                        
                                                        const historyKey = dbDetails.active_details || Object.keys(dbDetails.history || {})[0] || 'details-1';
                                                        const currentDetails = dbDetails.history?.[historyKey] || {};

                                                        return Object.entries(currentDetails).slice(0, 4).map(([k, v]) => (
                                                            <div key={k} className="bg-white px-2 py-1 rounded border border-amber-100 text-[10px]">
                                                                <span className="text-gray-400 font-bold text-[8px] mr-1">{k.replace('_checked', '').replace(/_/g, ' ')}:</span>
                                                                <span className="text-amber-600 font-bold">{String(v)}</span>
                                                            </div>
                                                        ));
                                                   })()}
                                              </div>
                                          </div>
                                      </div>
                                  </div>
                              </div>
                          </div>
                      ))}

                      {dbConflicts.length > 10 && (
                          <div className="p-8 text-center bg-gray-50/50 border-t border-gray-100">
                              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest leading-loose">
                                  And {dbConflicts.length - 10} more Database matches found...<br/>
                                  <span className="text-[10px] font-medium lowercase italic">Conflict strategy must be chosen for all.</span>
                              </p>
                          </div>
                      )}
                  </div>

                  {/* Footer with Bulk Actions */}
                  <div className="px-5 py-3 border-t border-gray-100 flex items-center justify-between bg-white rounded-b-lg shadow-[0_-4px_10px_rgba(0,0,0,0.02)]">
                      <div className="flex items-center gap-4">
                        <span className="text-gray-400 font-medium">
                            Total overlaps: <span className="text-gray-700 font-bold">{dbConflicts.length}</span>
                        </span>
                        {selectedDbConflicts.size > 0 && (
                            <div className="flex items-center gap-2 animate-in slide-in-from-left-2 duration-200">
                                <div className="h-4 w-px bg-gray-200"></div>
                                <span className="text-[11px] font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded-lg">
                                    {selectedDbConflicts.size} Selected
                                </span>
                                <button 
                                    onClick={handleDbSkipSelected}
                                    className="px-4 py-1.5 bg-rose-50 text-rose-600 rounded-lg font-bold text-[11px] hover:bg-rose-100 transition-all border border-rose-100"
                                >
                                    Reject Selected
                                </button>
                                <button 
                                    onClick={handleDbMergeSelected}
                                    className="px-4 py-1.5 bg-amber-600 text-white rounded-lg font-bold text-[11px] hover:bg-amber-700 transition-all shadow-lg shadow-amber-100"
                                >
                                    Merge & Update CRM
                                </button>
                            </div>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button 
                            onClick={() => setShowDbConflictModal(false)}
                            className="px-5 py-2 bg-gray-50 text-gray-600 rounded-lg font-bold text-[11px] hover:bg-gray-100 transition-all border border-gray-200"
                        >
                            Back to Map
                        </button>
                      </div>
                  </div>
              </div>
          </div>
      )}

      {/* Conflict Resolution Modal */}
      {showConflictModal && duplicates.length > 0 && (
        <div className="fixed inset-0 backdrop-blur-lg flex items-center justify-center z-[80] p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col border border-gray-100">
            <div className="flex items-center justify-between p-6 border-b border-amber-100 bg-amber-50/50">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-600 shadow-inner">
                   <i className="fi flex fi-rr-triangle-warning text-xl"></i>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-amber-900" style={{ fontFamily: "'Poppins', sans-serif" }}>Duplicate Conflicts Detected</h2>
                  <p className="text-xs font-medium text-amber-600 uppercase tracking-widest">{duplicates.length} overlapping records found</p>
                </div>
              </div>
              <button onClick={() => setShowConflictModal(false)} className="w-10 h-10 rounded-xl hover:bg-white flex items-center justify-center text-gray-400 hover:text-gray-600 transition-all">
                <i className="fi flex fi-rr-cross text-lg"></i>
              </button>
            </div>
            
            <div className="p-8 overflow-y-auto flex-1 custom-scrollbar space-y-6 bg-slate-50/30">
              <div className="p-4 bg-white border border-amber-100 rounded-xl text-sm text-amber-800 flex items-start gap-3">
                 <i className="fi fi-rr-info mt-0.5"></i>
                 <p>The following customers are already in your database. You can choose to <strong>Merge</strong> the new information (update existing record) or <strong>Reject</strong> the new entry (keep existing data).</p>
              </div>

              {duplicates.slice(0, 10).map((dup, idx) => (
                <div key={idx} className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <div className="bg-slate-50 px-5 py-3 border-b border-gray-100 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                       <span className="text-xs font-bold text-slate-500 bg-slate-200 px-2 py-0.5 rounded-full">#{idx + 1}</span>
                       <span className="text-sm font-bold text-slate-700">Phone Conflict</span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 bg-white px-2 py-1 rounded border border-gray-100">HASH: {dup.existing.phone_search_hash?.substring(0, 8)}...</span>
                  </div>
                  <div className="grid grid-cols-2 gap-px bg-gray-100">
                    {/* Existing Record */}
                    <div className="bg-white p-6">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500 border border-slate-200">DB</div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Existing Record</span>
                      </div>
                      <p className="text-lg font-bold text-slate-900 mb-4">{dup.existing.customer_name || "Unnamed Customer"}</p>
                      <div className="space-y-2 p-3 bg-slate-50 rounded-xl border border-slate-100 min-h-[100px]">
                        {renderDetailsPreview(dup.existing.customer_details)}
                        {!dup.existing.customer_details && <p className="text-[11px] text-slate-400 italic">No details available</p>}
                      </div>
                    </div>
                    {/* New CSV Row */}
                    <div className="bg-white p-6">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-[10px] font-bold text-white shadow-lg shadow-indigo-100">CSV</div>
                        <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Incoming Row</span>
                      </div>
                      <p className="text-lg font-bold text-slate-900 mb-4">{dup.new.customer_name || "Unnamed Customer"}</p>
                      <div className="space-y-2 p-3 bg-indigo-50/50 rounded-xl border border-indigo-100/50 min-h-[100px]">
                        {renderDetailsPreview(dup.new.customer_details)}
                      </div>
                    </div>
                  </div>
                  <div className="p-4 bg-slate-50 border-t border-gray-100 flex justify-end gap-3">
                    <button 
                      onClick={() => handleRejectDuplicate(dup.existing.id)}
                      className="px-5 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-white hover:text-slate-700 transition-all border border-transparent hover:border-slate-200"
                    >
                      Reject Entry
                    </button>
                    <button 
                      onClick={() => handleMergeDuplicate(dup)}
                      className="px-6 py-2 rounded-xl text-xs font-bold bg-indigo-600 text-white hover:bg-slate-900 transition-all shadow-lg shadow-indigo-200 active:scale-95"
                    >
                      Merge & Update
                    </button>
                  </div>
                </div>
              ))}
              {duplicates.length > 10 && (
                 <div className="py-8 text-center bg-white rounded-2xl border border-dashed border-slate-200">
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">+{duplicates.length - 10} more conflicts remaining</p>
                    <p className="text-xs text-slate-300 mt-1">Please resolve the visible items to see more.</p>
                 </div>
              )}
            </div>
            
            <div className="p-6 border-t border-gray-200 bg-white flex justify-between items-center">
              <button 
                onClick={() => {
                   if (confirm("Are you sure you want to reject all remaining duplicates?")) {
                      setDuplicates([]);
                      setShowConflictModal(false);
                      setImportSuccess("Import complete. All duplicates were rejected.");
                      if (onSuccess) onSuccess();
                      setTimeout(handleClose, 2000);
                   }
                }}
                className="text-xs font-bold text-slate-400 hover:text-red-500 transition-colors uppercase tracking-widest px-4"
              >
                Reject All Remaining
              </button>
              <div className="flex items-center gap-4">
                <span className="text-xs font-bold text-slate-400">{duplicates.length} items left</span>
                
                <button 
                  onClick={handleMergeAll}
                  disabled={importing}
                  className="px-6 py-3 bg-indigo-600 text-white rounded-xl text-xs font-bold shadow-xl hover:bg-slate-900 transition-all active:scale-95 disabled:opacity-50"
                >
                  {importing ? "Merging..." : `Merge All (${duplicates.length})`}
                </button>

                <button 
                  onClick={() => setShowConflictModal(false)}
                  className="px-8 py-3 bg-slate-200 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-300 transition-all active:scale-95"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
