import { useState, useEffect, useRef } from "react";
import { supabase } from "../lib/supabase";
import { encryptPhone, computePhoneHash } from "../lib/phoneUtils";
import { useUser } from "../context/UserContext";
import { logSystemEvent, estimateSize } from "../lib/monitoring";

interface AddCustomerModalProps {
  show: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  preselectedOrgId?: string;
  preselectedCampaignId?: string;
}

export default function AddCustomerModal({
  show,
  onClose,
  onSuccess,
  preselectedOrgId = "",
  preselectedCampaignId = "",
}: AddCustomerModalProps) {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    expiry_date: "",
    organization_id: preselectedOrgId,
    campaign_id: preselectedCampaignId,
  });

  const [customFields, setCustomFields] = useState<Array<{ id: string; name: string; value: string; showInApp: boolean }>>([]);
  const [organizations, setOrganizations] = useState<any[]>([]);
  const [campaigns, setCampaigns] = useState<any[]>([]);

  const [showCalendar, setShowCalendar] = useState(false);
  const calendarRef = useRef<HTMLDivElement>(null);
  const [expiryRaw, setExpiryRaw] = useState("");

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setShowCalendar(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (formData.expiry_date) {
        setExpiryRaw(formData.expiry_date.split('-').reverse().join('/'));
    } else if (!show) {
        setExpiryRaw("");
    }
  }, [formData.expiry_date, show]);

  useEffect(() => {
    if (show) {
      fetchOrganizations();
      
      // Handle client-side organization locking
      if (user?.isClient && user.organization_id) {
        setFormData(prev => ({ ...prev, organization_id: user.organization_id || "" }));
      } else {
        // Reset form if opening fresh for non-clients
        if (!preselectedOrgId) setFormData(prev => ({ ...prev, organization_id: "" }));
      }
      
      if (!preselectedCampaignId) setFormData(prev => ({ ...prev, campaign_id: "" }));
      
      if (formData.organization_id || (user?.isClient && user.organization_id)) {
        fetchCampaigns(formData.organization_id || user?.organization_id || "");
      }
    }
  }, [show, preselectedOrgId, preselectedCampaignId]);

  useEffect(() => {
    if (formData.organization_id) {
        fetchCampaigns(formData.organization_id);
    } else {
        setCampaigns([]);
    }
  }, [formData.organization_id]);

  const fetchOrganizations = async () => {
    const { data } = await supabase
      .from("organizations")
      .select("id, company_name, org_code")
      .eq("is_active", true)
      .order("company_name");
    if (data) setOrganizations(data);
  };

  const fetchCampaigns = async (orgId: string) => {
    const { data } = await supabase
      .from("campaigns")
      .select("id, name")
      .eq("organization_id", orgId)
      .eq("status", "active")
      .order("name");
    if (data) setCampaigns(data);
  };

  const handleClose = () => {
    setFormData({
      name: "",
      phone: "",
      expiry_date: "",
      organization_id: preselectedOrgId,
      campaign_id: preselectedCampaignId,
    });
    setCustomFields([]);
    setError("");
    setSuccess("");
    onClose();
  };

  const addCustomField = () => {
    setCustomFields([...customFields, { id: Date.now().toString(), name: "", value: "", showInApp: true }]);
  };

  const removeCustomField = (id: string) => {
    setCustomFields(customFields.filter(f => f.id !== id));
  };

  const updateCustomField = (id: string, key: "name" | "value" | "showInApp", val: any) => {
    setCustomFields(customFields.map(f => f.id === id ? { ...f, [key]: val } : f));
  };

  const generateLeadId = () => {
    return `LEAD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
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
      const phoneHash = computePhoneHash(formData.phone);
      const { data: existing } = await supabase
        .from("customers")
        .select("id")
        .eq("phone_search_hash", phoneHash)
        .single();

      if (existing) {
        setError("A customer with this phone number already exists.");
        setLoading(false);
        return;
      }

      // Construct customer details JSON
      const customerDetails: Record<string, string> = {};
      customFields.forEach(cf => {
        if (cf.name && cf.value) {
            const suffix = cf.showInApp ? "_checked" : "_unchecked";
            customerDetails[`${cf.name}${suffix}`] = cf.value.trim();
        }
      });

      const customerData = {
        lead_id: generateLeadId(),
        customer_name: formData.name,
        phone_no: encryptPhone(formData.phone),
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
        }) : null,
      };

      const { error: insertError } = await supabase.from("customers").insert(customerData);
      if (insertError) throw insertError;

      logSystemEvent({
          event_type: 'WRITE',
          description: `Add Customer: ${formData.name} created manually`,
          metadata: { customer_id: customerData.lead_id, customer_name: formData.name },
          payload_size: estimateSize(customerData),
          user_name: user?.displayName || 'Admin',
          organization_id: user?.organization_id || undefined
      });

      setSuccess("Customer added successfully!");
      if (onSuccess) onSuccess();
      setTimeout(handleClose, 1500);
    } catch (err: any) {
      setError(err.message || "Failed to add customer");
    } finally {
      setLoading(false);
    }
  };

  // Tiny Custom Calendar Picker Helper
  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();
  
  const [calMonth, setCalMonth] = useState(new Date().getMonth());
  const [calYear, setCalYear] = useState(new Date().getFullYear());

  if (!show) return null;

  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-[110] p-4 text-xs font-sans">
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col border border-gray-100">
        {/* Header */}
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <h2 className="font-bold text-gray-800">Add Single Customer</h2>
             <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded text-[10px] font-bold uppercase tracking-widest border border-indigo-100">Manual Entry</span>
          </div>
          <button onClick={handleClose} className="text-gray-400 hover:text-gray-600 p-1">
            <i className="fi fi-rr-cross-small text-xl leading-none"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5 custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-0.5">Customer Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Full Name"
                className="w-full h-9 px-3 bg-white border border-gray-200 rounded text-[11px] font-medium text-gray-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all font-sans"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-0.5">Phone Number *</label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="e.g. 9876543210"
                className="w-full h-9 px-3 bg-white border border-gray-200 rounded text-[11px] font-medium text-gray-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all font-sans"
              />
            </div>
            <div className="space-y-1.5 relative">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-0.5">Expiry Date (DD/MM/YYYY)</label>
              <div className="relative">
                  <input
                    type="text"
                    value={expiryRaw}
                    onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, "").substring(0, 8);
                        setExpiryRaw(val.replace(/^(\d{2})(\d{2})(\d{4})$/, "$1/$2/$3")
                                       .replace(/^(\d{2})(\d{2})$/, "$1/$2")
                                       .replace(/^(\d{2})$/, "$1"));
                        
                        // If fully typed, update internal state
                        if (val.length === 8) {
                            const d = val.substring(0, 2);
                            const m = val.substring(2, 4);
                            const y = val.substring(4, 8);
                            setFormData(prev => ({ ...prev, expiry_date: `${y}-${m}-${d}` }));
                        } else {
                            setFormData(prev => ({ ...prev, expiry_date: "" }));
                        }
                    }}
                    placeholder="DD/MM/YYYY"
                    className="w-full h-9 px-3 bg-white border border-gray-200 rounded text-[11px] font-medium text-gray-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all font-sans"
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowCalendar(!showCalendar)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-indigo-500 hover:text-indigo-600 p-1"
                  >
                    <i className="fi flex fi-rr-calendar"></i>
                  </button>
              </div>

              {/* Custom Calendar Popover */}
              {showCalendar && (
                <div ref={calendarRef} className="absolute top-full mt-2 left-0 z-50 bg-white rounded-lg shadow-2xl border border-gray-100 p-4 w-64 animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center justify-between mb-4">
                    <button type="button" onClick={() => { if(calMonth === 0) { setCalMonth(11); setCalYear(prev => prev-1); } else setCalMonth(prev => prev-1); }} className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400">
                        <i className="fi flex fi-rr-angle-left"></i>
                    </button>
                    <div className="text-[11px] font-bold text-gray-800">{months[calMonth]} {calYear}</div>
                    <button type="button" onClick={() => { if(calMonth === 11) { setCalMonth(0); setCalYear(prev => prev+1); } else setCalMonth(prev => prev+1); }} className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400">
                        <i className="fi flex fi-rr-angle-right"></i>
                    </button>
                  </div>
                  <div className="grid grid-cols-7 text-center mb-2">
                    {['S','M', 'T', 'W', 'T', 'F', 'S'].map(d => <div key={d} className="text-[9px] font-bold text-gray-300 uppercase">{d}</div>)}
                  </div>
                  <div className="grid grid-cols-7 gap-1">
                    {Array.from({ length: firstDayOfMonth(calYear, calMonth) }).map((_, i) => <div key={`empty-${i}`} />)}
                    {Array.from({ length: daysInMonth(calYear, calMonth) }).map((_, i) => {
                      const day = i + 1;
                      const isSelected = formData.expiry_date === `${calYear}-${String(calMonth+1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                      return (
                        <button
                          key={day}
                          type="button"
                          onClick={() => {
                            const d = String(day).padStart(2, '0');
                            const m = String(calMonth + 1).padStart(2, '0');
                            const y = String(calYear);
                            setFormData({ ...formData, expiry_date: `${y}-${m}-${d}` });
                            setExpiryRaw(`${d}/${m}/${y}`);
                            setShowCalendar(false);
                          }}
                          className={`w-7 h-7 rounded text-[10px] font-bold transition-all ${isSelected ? 'bg-indigo-600 text-white shadow-md' : 'hover:bg-indigo-50 text-gray-600'}`}
                        >
                          {day}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-0.5">Organization *</label>
              <select
                required
                value={formData.organization_id}
                disabled={user?.isClient}
                onChange={(e) => setFormData({ ...formData, organization_id: e.target.value, campaign_id: "" })}
                className={`w-full h-9 px-3 border border-gray-200 rounded text-[11px] font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all font-sans ${user?.isClient ? 'bg-gray-100 cursor-not-allowed text-gray-400' : 'bg-white text-gray-700'}`}
              >
                <option value="">Select Organization</option>
                {organizations.map(org => <option key={org.id} value={org.id}>{org.company_name}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-0.5">Campaign</label>
              <select
                value={formData.campaign_id}
                onChange={(e) => setFormData({ ...formData, campaign_id: e.target.value })}
                className="w-full h-9 px-3 bg-white border border-gray-200 rounded text-[11px] font-medium text-gray-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all font-sans"
              >
                <option value="">Select Campaign</option>
                {campaigns.map(camp => <option key={camp.id} value={camp.id}>{camp.name}</option>)}
              </select>
            </div>
          </div>

          {/* Custom Fields */}
          <div className="pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between mb-4">
               <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-0.5">Custom Data Fields</h3>
               <button 
                  type="button"
                  onClick={addCustomField}
                  className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded text-[10px] font-bold uppercase tracking-widest hover:bg-indigo-100 transition-colors flex items-center gap-1.5 border border-indigo-100"
               >
                  <i className="fi fi-rr-plus"></i> Add Field
               </button>
            </div>
            
            {customFields.length > 0 ? (
               <div className="space-y-3">
                  {customFields.map((cf) => (
                    <div key={cf.id} className="flex gap-3 items-center group animate-in slide-in-from-top-2 duration-200">
                       <div className="flex items-center" title="Show in Portal">
                          <input 
                              type="checkbox"
                              checked={cf.showInApp}
                              onChange={(e) => updateCustomField(cf.id, "showInApp", e.target.checked)}
                              className="w-3.5 h-3.5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 cursor-pointer"
                           />
                       </div>
                       <input
                           placeholder="Label (e.g. Plan)"
                           className="flex-1 h-8 px-3 bg-white border border-gray-200 rounded text-[11px] font-medium text-gray-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
                           value={cf.name}
                           onChange={(e) => updateCustomField(cf.id, "name", e.target.value)}
                       />
                       <input
                           placeholder="Value"
                           className="flex-[1.5] h-8 px-3 bg-white border border-gray-200 rounded text-[11px] font-medium text-gray-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
                           value={cf.value}
                           onChange={(e) => updateCustomField(cf.id, "value", e.target.value)}
                       />
                       <button 
                         type="button"
                         onClick={() => removeCustomField(cf.id)} 
                         className="p-1.5 text-gray-300 hover:text-rose-500 transition-colors"
                       >
                         <i className="fi flex fi-rr-trash text-sm"></i>
                       </button>
                    </div>
                  ))}
               </div>
            ) : (
               <div className="text-center py-5 bg-gray-50/50 rounded-lg border border-dashed border-gray-200">
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">No custom fields added yet.</p>
               </div>
            )}
          </div>

          {error && <div className="p-2.5 bg-rose-50 text-rose-600 rounded font-bold border border-rose-100 text-[11px] animate-in fade-in slide-in-from-bottom-2">{error}</div>}
          {success && <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded font-bold border border-emerald-100 text-[11px] animate-in fade-in slide-in-from-bottom-2">{success}</div>}
        </form>

        <div className="px-5 py-3 border-t border-gray-100 flex items-center justify-between bg-white rounded-b-lg">
          <button type="button" onClick={handleClose} className="px-4 py-1.5 border border-gray-200 text-gray-600 rounded hover:bg-gray-50 font-semibold transition-all">Cancel</button>
          <button 
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="px-6 py-1.5 bg-[#4b33e8] text-white rounded font-bold uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-sm shadow-indigo-100 disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? "Saving..." : "Create Customer"}
          </button>
        </div>
      </div>
    </div>
  );
}
