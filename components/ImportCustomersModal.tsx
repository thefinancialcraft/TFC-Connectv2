
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

  useEffect(() => {
    setShowImportModal(show);
    if (show) {
      setSelectedOrgId(preselectedOrgId);
      setSelectedCampaignId(preselectedCampaignId);
      fetchOrganizations();
      fetchCampaigns(preselectedOrgId); // Fetch campaigns for the preselected org
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
    setImportFile(null);
    setImportError("");
    setImportSuccess("");
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

    const uploadCustomersToSupabase = async () => {
    if (!importFile) {
      setImportError("Please select a file to upload");
      return;
    }
    
    // Validate Org and Campaign Selection
    if (!selectedOrgId) {
        setImportError("Please select an Organization before importing.");
        return;
    }

    setImporting(true);
    setImportError("");
    setImportSuccess("");

    let finalNewCustomers: any[] = [];
    let foundConflicts: any[] = [];

    try {
      const text = await importFile.text();
      const lines = text.split("\n").filter((line) => line.trim());
      if (lines.length < 2) {
        setImportError("CSV file must contain at least a header row and one data row");
        setImporting(false);
        return;
      }
      
      console.log("Importing with Org:", selectedOrgId, "Campaign:", selectedCampaignId); // Debug log

      const headers = parseCSVLine(lines[0]);
      const customers = [];
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
          
          // Use custom expiry date if selected, otherwise get from CSV
          const expiryDate = (fieldMapping["expiry_date"] === '__CUSTOM_DATE__')
             ? customExpiryDate
             : getFieldValue(row, "expiry_date", fieldMapping, mergedFields);

          if (!customerName) {
            errors.push(`Row ${i + 1}: Customer name is required`);
            continue;
          }

          const customerDetails: Record<string, string> = {};

          customFields.forEach((cf) => {
             // For custom fields, we construct the value manually including merged fields
             let value = row[cf.mappedTo] || "";
             const merged = mergedFields[cf.id] || [];
             if (merged.length > 0) {
                 const mergedValues = merged
                     .filter((col) => col && row[col])
                     .map((col) => row[col])
                     .join(" ");
                 if (mergedValues) value = value ? `${value} ${mergedValues}` : mergedValues;
             }
             
             if (value) {
                const suffix = selectedFields[`custom_${cf.id}`] !== false ? "_checked" : "_unchecked";
                customerDetails[`${cf.name || cf.mappedTo}${suffix}`] = value.trim();
             }
          });

          let parsedExpiryDate: string | null = null;
          if (expiryDate) {
            try {
              const cleanDate = expiryDate.replace(/₹/g, "").trim();
              
              // Helper to parse DD/MM/YYYY or DD/MM/YY
              const parseDMY = (str: string) => {
                const match = str.match(/^(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{2,4})$/);
                if (match) {
                  let d = match[1].padStart(2, '0');
                  let m = match[2].padStart(2, '0');
                  let y = match[3];
                  if (y.length === 2) y = "20" + y;
                  return `${y}-${m}-${d}`;
                }
                return null;
              };

              // Helper to parse YYYY-MM-DD
              const parseYMD = (str: string) => {
                const match = str.match(/^(\d{4})[\/\-\.](\d{1,2})[\/\-\.](\d{1,2})$/);
                if (match) {
                  let y = match[1];
                  let m = match[2].padStart(2, '0');
                  let d = match[3].padStart(2, '0');
                  return `${y}-${m}-${d}`;
                }
                return null;
              };
              
              const format1 = parseDMY(cleanDate);
              const format2 = parseYMD(cleanDate);
              
              if (format1) {
                parsedExpiryDate = format1;
              } else if (format2) {
                parsedExpiryDate = format2;
              } else {
                // Fallback for word-based months like "23 Jan 2024"
                const months = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
                const parts = cleanDate.split(/[\s\-/]+/);
                let d = "", m = "", y = "";
                parts.forEach(p => {
                  const mIdx = months.findIndex(name => p.toLowerCase().startsWith(name));
                  if (mIdx !== -1) m = String(mIdx + 1).padStart(2, "0");
                  else if (/^\d{4}$/.test(p)) y = p;
                  else if (/^\d{1,2}$/.test(p)) d = p.padStart(2, "0");
                });
                
                if (d && m) {
                  if (!y) y = new Date().getFullYear().toString();
                  parsedExpiryDate = `${y}-${m}-${d}`;
                } else {
                  // Final fallback to native Date
                  const date = new Date(cleanDate);
                  if (!isNaN(date.getTime())) {
                    parsedExpiryDate = date.toISOString().split("T")[0];
                  }
                }
              }
            } catch (e) {
              console.error("Date parsing error:", e);
            }
          }

          customers.push({
            lead_id: generateLeadId(),
            customer_name: customerName,
            phone_no: encryptPhone(phoneNo) || null,
            phone_search_hash: computePhoneHash(phoneNo) || null,
            expiry_date: parsedExpiryDate,
            campaign_id: selectedCampaignId || null,
            organization_id: selectedOrgId || null,
            customer_details: Object.keys(customerDetails).length > 0 ? JSON.stringify({
                active_details: "details-1",
                history: {
                    "details-1": customerDetails
                }
            }) : null,
            status: "active",
          });
        } catch (err) {
          errors.push(`Row ${i + 1}: ${err}`);
        }
      }

      const batchSize = 100;
      let success = 0;

      // 1. Check for duplicates using phone_search_hash
      const allHashes = customers.map(c => c.phone_search_hash).filter(Boolean);
      const { data: existingRecords } = await supabase
        .from("customers")
        .select("id, phone_search_hash, customer_name, customer_details")
        .in("phone_search_hash", allHashes);

      const existingMap = new Map();
      existingRecords?.forEach(r => existingMap.set(r.phone_search_hash, r));

      finalNewCustomers = [];
      foundConflicts = [];

      customers.forEach(cust => {
        const existing = existingMap.get(cust.phone_search_hash);
        if (existing) {
          foundConflicts.push({ new: cust, existing });
        } else {
          finalNewCustomers.push(cust);
        }
      });

      // 2. Insert unique customers
      for (let i = 0; i < finalNewCustomers.length; i += batchSize) {
        const { error } = await supabase.from("customers").insert(finalNewCustomers.slice(i, i + batchSize));
        if (!error) success += finalNewCustomers.slice(i, i + batchSize).length;
      }

      // 3. Handle duplicates
      if (foundConflicts.length > 0) {
        setDuplicates(foundConflicts);
        setShowConflictModal(true);
        if (success > 0) {
          setImportSuccess(`Imported ${success} unique customers! ${foundConflicts.length} duplicates found.`);
        } else {
          setImportError(`Found ${foundConflicts.length} duplicates. No new unique customers to import.`);
        }
        setImporting(false);
        // We stay in the modal state to resolve conflicts
        return;
      }

      if (success > 0) {
        setImportSuccess(`Successfully imported ${success} customers!`);
        if (onSuccess) onSuccess();
        setTimeout(handleClose, 2000);
      } else {
        setImportError("No customers were imported.");
      }

    } catch (err) {
      setImportError(`Error: ${err}`);
    } finally {
      // Only stop importing if we aren't showing conflicts
      if (foundConflicts.length === 0) {
        setImporting(false);
      }
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
                <button 
                  onClick={uploadCustomersToSupabase} 
                  disabled={importing}
                  className="px-6 py-2 bg-[#4b33e8] text-white rounded-lg text-sm font-bold flex items-center gap-2"
                >
                  {importing ? <><div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div> Processing...</> : "Start Import"}
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
