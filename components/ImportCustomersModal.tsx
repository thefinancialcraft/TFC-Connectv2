
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
    sum_insured: false,
    premium: false,
    company: false,
    expiry_date: true,
  });

  const [organizations, setOrganizations] = useState<any[]>([]);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [selectedOrgId, setSelectedOrgId] = useState(preselectedOrgId);
  const [selectedCampaignId, setSelectedCampaignId] = useState(preselectedCampaignId);
  const [customExpiryDate, setCustomExpiryDate] = useState("");

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
          const predefinedFields = [
            { key: "sum_insured", label: "Sum Insured" },
            { key: "premium", label: "Premium" },
            { key: "company", label: "Company" },
          ];

          predefinedFields.forEach((field) => {
            const value = getFieldValue(row, field.key, fieldMapping, mergedFields);
            if (value) {
              const suffix = selectedFields[field.key] ? "_checked" : "_unchecked";
              customerDetails[`${field.label}${suffix}`] = value;
            }
          });

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
            customer_details: Object.keys(customerDetails).length > 0 ? JSON.stringify(customerDetails) : null,
            status: "active",
          });
        } catch (err) {
          errors.push(`Row ${i + 1}: ${err}`);
        }
      }

      const batchSize = 100;
      let success = 0;
      for (let i = 0; i < customers.length; i += batchSize) {
        const { error } = await supabase.from("customers").insert(customers.slice(i, i + batchSize));
        if (!error) success += customers.slice(i, i + batchSize).length;
      }

      if (success > 0) {
        setImportSuccess(`Successfully imported ${success} customers!`);
        if (onSuccess) onSuccess();
        setTimeout(handleClose, 2000);
      } else setImportError("Failed to import customers.");

    } catch (err) {
      setImportError(`Error: ${err}`);
    } finally {
      setImporting(false);
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
      const fields = ["name", "phone", "sum_insured", "premium", "company", "expiry_date"];
      fields.forEach(f => {
        const match = cols.find(c => c.toLowerCase().includes(f.toLowerCase()));
        if (match) initialMapping[f] = match;
      });
      setFieldMapping(initialMapping);
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

  const usedColumns = getUsedColumns(); // Calculate for render

  if (!showImportModal && !showMappingModal) return null;

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
                {["name", "phone", "expiry_date", "sum_insured", "premium", "company"].map(field => (
                  <div key={field} className="space-y-1">
                    <div className="flex items-center justify-between">
                       <label className="text-xs font-bold text-gray-500 uppercase">{field.replace("_", " ")}</label>
                       {['sum_insured', 'premium', 'company', 'expiry_date'].includes(field) && (
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
                   <label className="text-xs font-bold text-gray-500 uppercase">Custom Fields</label>
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
    </>
  );
}
