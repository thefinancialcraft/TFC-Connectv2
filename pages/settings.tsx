import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/router";
import AppLayout, { useUser } from "../components/AppLayout";
import { supabase } from "../lib/supabase";
import { showSuccess, showError } from "../lib/dialogUtils";
import SettingsFormFields from "../components/SettingsFormFields";
import { getStoredUserData } from "../lib/localStorageUtils";

import FlutterBridgeTab from "../components/settings/FlutterBridgeTab";
import DevicesTab from "../components/settings/DevicesTab";
import ConsoleLogsTab from "../components/settings/ConsoleLogsTab";

interface SettingsFormData {
  email: string;
  user_name: string;
  contact_no: string;
  employee_id: string;
  role: string;
  father_name: string;
  gender: string;
  date_of_birth: string;
  blood_group: string;
  alternate_contact: string;
  emergency_contact_no: string;
  date_of_joining: string;
  in_hand_salary: string;
  is_client: string;
  joined_at: string;
  renewal_at: string;
  expire_at: string;
  primary_address: string;
  area_pincode: string;
  pan_number: string;
  aadhar_card_no: string;
  bank_name: string;
  account_holder_name: string;
  account_number: string;
  ifsc_code: string;
  branch_city: string;
  branch_state: string;
  branch_pincode: string;
  profile_pic_url: string;
  pancard_url: string;
  aadhar_front_url: string;
  aadhar_back_url: string;
  qualification_marksheet_url: string;
  bank_passbook_url: string;
}

export default function Settings() {
  const router = useRouter();
  const { user, mounted } = useUser();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeNav] = useState("settings");
  const [activeTab, setActiveTab] = useState<"profile" | "security" | "flutter_bridge" | "devices" | "console_logs" | "integrations">("profile");
  const [activeCategory, setActiveCategory] = useState<"basic_info" | "personal_info" | "employment_info" | "client_lifecycle" | "address_info" | "kyc_info" | "bank_info" | "documents">("basic_info");
  
  // Form state
  const [formData, setFormData] = useState<SettingsFormData>({
    email: "",
    user_name: "",
    contact_no: "",
    employee_id: "",
    role: "",
    father_name: "",
    gender: "",
    date_of_birth: "",
    blood_group: "",
    alternate_contact: "",
    emergency_contact_no: "",
    date_of_joining: "",
    in_hand_salary: "",
    is_client: "false",
    joined_at: "",
    renewal_at: "",
    expire_at: "",
    primary_address: "",
    area_pincode: "",
    pan_number: "",
    aadhar_card_no: "",
    bank_name: "",
    account_holder_name: "",
    account_number: "",
    ifsc_code: "",
    branch_city: "",
    branch_state: "",
    branch_pincode: "",
    profile_pic_url: "",
    pancard_url: "",
    aadhar_front_url: "",
    aadhar_back_url: "",
    qualification_marksheet_url: "",
    bank_passbook_url: "",
  });
  const [isSaving, setIsSaving] = useState(false);
  
  // Security tab states
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [activeSessions, setActiveSessions] = useState<any[]>([]);
  const [isLoadingSessions, setIsLoadingSessions] = useState(false);

  const currentUserId = useMemo(() => {
    if (typeof window === 'undefined') return null;
    return getStoredUserData()?.user_id;
  }, []);

  const currentTokenId = useMemo(() => {
    if (typeof window === 'undefined') return null;
    return getStoredUserData()?.token_id;
  }, []);
  const [showIdentityErrorPopup, setShowIdentityErrorPopup] = useState(false);




  // Check for OAuth errors in URL
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Check both query params and hash for errors
    const params = new URLSearchParams(window.location.search);
    const hashParams = new URLSearchParams(window.location.hash.replace('#', '?'));
    
    const error = params.get('error') || hashParams.get('error');
    const errorCode = params.get('error_code') || hashParams.get('error_code');
    const errorDescription = params.get('error_description') || hashParams.get('error_description');

    if (error) {
      if (errorCode === 'identity_already_exists') {
        setShowIdentityErrorPopup(true);
      } else {
        showError(errorDescription?.replace(/\+/g, ' ') || "An error occurred during connection.", "Connection Failed");
      }
      
      // Clean URL
      const newUrl = window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
    }
  }, []);

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!user) return;
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        try {
          const profileResponse = await fetch("/api/auth/user-profile", {
            headers: { Authorization: `Bearer ${session.access_token}` },
          });
          const profileData = await profileResponse.json();
          if (profileData.success && profileData.user) {
            const { data: fullProfile } = await supabase
              .from('user_profiles')
              .select('*')
              .eq('user_id', user.uid)
              .maybeSingle();
            
            // Capture provider token if available (persist for calendar usage)
            if (session.provider_token) {
              localStorage.setItem("google_provider_token", session.provider_token);
              console.log("✅ [Settings] Google Token persisted via AuthGuard.");
            }
            
            setFormData((prev) => ({
              ...prev,
              email: profileData.user.email || fullProfile?.email || "",
              user_name: fullProfile?.user_name || profileData.user.displayName || "",
              contact_no: fullProfile?.contact_no || profileData.user.phone || "",
              employee_id: fullProfile?.employee_id || profileData.user.employeeId || "",
              role: fullProfile?.role || profileData.user.role || "",
              father_name: fullProfile?.father_name || "",
              gender: fullProfile?.gender || "",
              date_of_birth: fullProfile?.date_of_birth || "",
              blood_group: fullProfile?.blood_group || "",
              alternate_contact: fullProfile?.alternate_contact || "",
              emergency_contact_no: fullProfile?.emergency_contact_no || "",
              date_of_joining: fullProfile?.date_of_joining || "",
              in_hand_salary: fullProfile?.in_hand_salary?.toString() || "",
              is_client: String(fullProfile?.is_client || "false"),
              joined_at: fullProfile?.joined_at?.split('T')[0] || "",
              renewal_at: fullProfile?.renewal_at?.split('T')[0] || "",
              expire_at: fullProfile?.expire_at?.split('T')[0] || "",
              primary_address: fullProfile?.primary_address || "",
              area_pincode: fullProfile?.area_pincode || "",
              pan_number: fullProfile?.pan_number || "",
              aadhar_card_no: fullProfile?.aadhar_card_no || "",
              bank_name: fullProfile?.bank_name || "",
              account_holder_name: fullProfile?.account_holder_name || "",
              account_number: fullProfile?.account_number || "",
              ifsc_code: fullProfile?.ifsc_code || "",
              branch_city: fullProfile?.branch_city || "",
              branch_state: fullProfile?.branch_state || "",
              branch_pincode: fullProfile?.branch_pincode || "",
              profile_pic_url: fullProfile?.profile_pic_url || "",
              pancard_url: fullProfile?.pancard_url || "",
              aadhar_front_url: fullProfile?.aadhar_front_url || "",
              aadhar_back_url: fullProfile?.aadhar_back_url || "",
              qualification_marksheet_url: fullProfile?.qualification_marksheet_url || "",
              bank_passbook_url: fullProfile?.bank_passbook_url || "",
            }));
          }
        } catch (err) { console.error(err); }
      }
    };
    if (mounted && user) fetchProfileData();
  }, [mounted, user]);

  useEffect(() => {
    if (activeTab === "security" && user) fetchActiveSessions();
  }, [activeTab, user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleFileUpload = async (fieldName: string, fileUrl: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      await fetch("/api/auth/update-profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ [fieldName]: fileUrl }),
      });
      setFormData(prev => ({ ...prev, [fieldName]: fileUrl }));
    } catch (error) { console.error(error); }
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        showError("Authentication required", "Error");
        return;
      }
      const res = await fetch("/api/auth/update-profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(formData),
      });
      if (res.ok) showSuccess("Profile saved", "Success");
      else showError("Failed to save", "Error");
    } catch (error) { showError("An error occurred", "Error"); }
    finally { setIsSaving(false); }
  };

  const fetchActiveSessions = async () => {
    setIsLoadingSessions(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      const res = await fetch("/api/auth/active-sessions", {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      const data = await res.json();
      if (data.success) {
        console.log("📱 [Settings] Fetched Active Sessions:", data.sessions);
        setActiveSessions(data.sessions);
      }

    } catch (error) { console.error(error); }
    finally { setIsLoadingSessions(false); }
  };

  const handleUpdateAuthField = async (field: keyof SettingsFormData) => {
    if (!window.confirm(`Are you sure you want to update your ${field.replace('_', ' ')}?`)) return;

    try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
             showError("Authentication required", "Error");
             return;
        }

        const res = await fetch("/api/auth/update-account-info", {
             method: "PUT",
             headers: {
               "Content-Type": "application/json",
               Authorization: `Bearer ${session.access_token}`,
             },
             body: JSON.stringify({ field, value: formData[field] }),
        });
        
        const data = await res.json();
        
        if (data.success) {
            showSuccess(`${field.replace('_', ' ')} updated successfully`, "Success");
        } else {
            showError(data.error || "Update failed", "Error");
        }

    } catch (e: any) {
        console.error(e);
        showError(e.message || "Failed to update", "Error");
    }
  };

  const handleRevokeSession = async (sessionId: string) => {
    if (!window.confirm("Are you sure you want to revoke this session?")) return;
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      
      const res = await fetch("/api/auth/revoke-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ session_id: sessionId }),
      });
      
      const data = await res.json();
      
      if (data.success) {
        // 1. Remove from Multi-Account Storage (local storage)
        const { removeAccount } = await import("../lib/sessionManager");
        if (data.revoked_token_id) {
          removeAccount(data.revoked_token_id);
          console.log(`🗑️ [Settings] Removed session ${data.revoked_token_id} from local storage`);
          
          // 2. Refresh UI
          if (data.revoked_token_id === currentTokenId) {
             router.push('/login');
             return;
          }
        }
        
        fetchActiveSessions();
        showSuccess("Session revoked successfully", "Success");
      } else {
        showError(data.error || "Failed to revoke session", "Error");
      }
    } catch (error) { 
      console.error(error); 
      showError("An error occurred", "Error");
    }
  };


  const calculateProfileCompletion = () => {
    const fields: Array<keyof SettingsFormData> = [
      "user_name", "contact_no", "father_name", "gender", "date_of_birth", 
      "blood_group", "primary_address", "pan_number", "aadhar_card_no", 
      "bank_name", "account_number", "ifsc_code"
    ];
    let filled = 0;
    fields.forEach(f => { if (formData[f]?.toString().trim()) filled++; });
    return Math.round((filled / fields.length) * 100);
  };

  const profileCompletion = calculateProfileCompletion();

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return "Active now";
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <AppLayout>
      <div className="container mx-auto px-3 sm:px-4 md:px-6 py-4 space-y-6 pb-24 max-w-7xl">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-xl sm:text-3xl font-bold text-[#263238] font-poppins">Settings</h1>
            <p className="text-sm text-[#787E9D]">Manage your account and preferences</p>
          </div>
          
         
        </div>

        {/* Tabs navigation */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="inline-flex h-12 items-center rounded-xl p-1 bg-white border overflow-x-auto no-scrollbar" style={{ borderColor: "#E0E0E0" }}>
            {[
              { id: "profile", label: "Profile", icon: "fi-rr-user" },
              { id: "security", label: "Security", icon: "fi-rr-lock" },
              { id: "devices", label: "Devices", icon: "fi-rr-devices" },
              { id: "integrations", label: "Integrations", icon: "fi-rr-apps" },
              { id: "flutter_bridge", label: "Bridge", icon: "fi-rr-smartphone" },
              { id: "console_logs", label: "Logs", icon: "fi-rr-journal" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${
                  activeTab === tab.id ? "bg-[#4b33e8] text-white shadow-md" : "text-gray-500 hover:bg-gray-50"
                }`}
              >
                <i className={`fi ${tab.icon} flex text-xs`}></i>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Completion Score */}
          <div className="bg-white border rounded-2xl p-3 flex items-center gap-4 min-w-[200px]" style={{ borderColor: "#E0E0E0" }}>
            <div className="flex-1">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[10px] font-bold text-gray-400 uppercase">Profile Strength</span>
                <span className="text-xs font-bold text-[#4b33e8]">{profileCompletion}%</span>
              </div>
              <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#4b33e8] transition-all duration-1000" 
                  style={{ width: `${profileCompletion}%` }}
                />
              </div>
            </div>
            <div className="w-8 h-8 rounded-lg bg-[#4b33e8] flex items-center justify-center text-white">
              <i className="fi fi-rr-badge-check text-sm" />
            </div>
          </div>
        </div>

        {/* Tab Content Area */}
        <div className="min-h-[500px]">
          {activeTab === "profile" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              {/* Category Chips */}
              <div className="flex overflow-x-auto gap-2 pb-2 no-scrollbar">
                {[
                  { id: "basic_info", label: "Basic", icon: "fi-rr-user" },
                  { id: "personal_info", label: "Personal", icon: "fi-rr-info" },
                  { id: "employment_info", label: "Employment", icon: "fi-rr-briefcase" },
                  { id: "client_lifecycle", label: "Lifecycle", icon: "fi-rr-refresh" },
                  { id: "address_info", label: "Address", icon: "fi-rr-map-marker" },
                  { id: "kyc_info", label: "KYC", icon: "fi-rr-shield-check" },
                  { id: "bank_info", label: "Bank", icon: "fi-rr-credit-card" },
                  { id: "documents", label: "Files", icon: "fi-rr-file" },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id as any)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all flex-shrink-0 ${
                      activeCategory === cat.id ? "bg-[#4b33e8] text-white" : "bg-white border border-gray-100 text-gray-500 hover:border-[#4b33e8]"
                    }`}
                  >
                    <i className={`fi ${cat.icon} flex`} />
                    <span className={activeCategory === cat.id ? "inline" : "hidden sm:inline"}>{cat.label}</span>
                  </button>
                ))}
              </div>

              {/* Form Card */}
              <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm p-6 sm:p-8" style={{ borderColor: "#E0E0E0" }}>
                <h3 className="text-lg font-bold mb-6 text-[#263238] flex items-center gap-2">
                  <i className="fi fi-rr-edit text-[#4b33e8] text-sm" />
                  {activeCategory.replace("_", " ").toUpperCase()}
                </h3>
                
                <SettingsFormFields
                  formData={formData}
                  handleInputChange={handleInputChange}
                  category={activeCategory}
                  onFileUpload={handleFileUpload}
                />

                <div className="mt-8 pt-6 border-t flex justify-end" style={{ borderColor: "#F1F1F1" }}>
                  <button
                    onClick={handleSaveChanges}
                    disabled={isSaving}
                    className="w-full sm:w-auto px-10 py-3 bg-[#4b33e8] text-white rounded-xl text-sm font-bold shadow-lg shadow-[#4b33e8]/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                  >
                    {isSaving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm p-6 sm:p-8" style={{ borderColor: "#E0E0E0" }}>
                <h3 className="text-lg font-bold mb-8 text-[#263238]">Security Center</h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                  {/* Password Section */}
                  {/* Password & Basic Auth Info Section */}
                  <div className="space-y-8">
                    {/* Password Section */}
                    <div className="space-y-4">
                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Update Password</h4>
                      <div className="space-y-3">
                        {["Current", "New", "Confirm"].map(p => (
                          <div key={p} className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-600">{p} Password</label>
                            <input 
                              type="password" 
                              className="w-full h-11 px-4 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-[#4b33e8]/20 outline-none text-sm"
                              placeholder={`Enter ${p.toLowerCase()} password`}
                            />
                          </div>
                        ))}
                        <button className="w-full py-3 bg-gray-900 text-white rounded-xl text-xs font-bold hover:bg-black transition-all shadow-lg shadow-gray-200">
                          Change Password
                        </button>
                      </div>
                    </div>

                    <div className="h-px bg-gray-100" />

                    {/* Display Name Update */}
                    <div className="space-y-4">
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Display Name</h4>
                        <div className="flex gap-3">
                            <div className="relative flex-1">
                                <i className="fi fi-rr-user absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
                                <input 
                                    type="text" 
                                    value={formData.user_name}
                                    onChange={(e) => setFormData({...formData, user_name: e.target.value})}
                                    className="w-full h-11 pl-10 pr-4 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-[#4b33e8]/20 outline-none text-sm font-bold text-slate-700"
                                    placeholder="Display Name"
                                />
                            </div>
                            <button 
                                onClick={() => handleUpdateAuthField('user_name')}
                                className="px-6 bg-[#4b33e8]/10 text-[#4b33e8] hover:bg-[#4b33e8] hover:text-white rounded-xl text-xs font-bold transition-all border border-[#4b33e8]/20"
                            >
                                Update
                            </button>
                        </div>
                    </div>

                    {/* Email Update */}
                    <div className="space-y-4">
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Email Address</h4>
                        <div className="flex gap-3">
                            <div className="relative flex-1">
                                <i className="fi fi-rr-envelope absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
                                <input 
                                    type="email" 
                                    value={formData.email}
                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                    className="w-full h-11 pl-10 pr-4 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-[#4b33e8]/20 outline-none text-sm font-bold text-slate-700"
                                    placeholder="Email Address"
                                />
                            </div>
                            <button 
                                onClick={() => handleUpdateAuthField('email')}
                                className="px-6 bg-[#4b33e8]/10 text-[#4b33e8] hover:bg-[#4b33e8] hover:text-white rounded-xl text-xs font-bold transition-all border border-[#4b33e8]/20"
                            >
                                Update
                            </button>
                        </div>
                    </div>

                    {/* Phone Update */}
                    <div className="space-y-4">
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Phone Number</h4>
                        <div className="flex gap-3">
                            <div className="relative flex-1">
                                <i className="fi fi-rr-smartphone absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
                                <input 
                                    type="text" 
                                    value={formData.contact_no}
                                    onChange={(e) => setFormData({...formData, contact_no: e.target.value})}
                                    className="w-full h-11 pl-10 pr-4 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-[#4b33e8]/20 outline-none text-sm font-bold text-slate-700"
                                    placeholder="Phone Number"
                                />
                            </div>
                            <button 
                                onClick={() => handleUpdateAuthField('contact_no')}
                                className="px-6 bg-[#4b33e8]/10 text-[#4b33e8] hover:bg-[#4b33e8] hover:text-white rounded-xl text-xs font-bold transition-all border border-[#4b33e8]/20"
                            >
                                Update
                            </button>
                        </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Active Sessions</h4>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={fetchActiveSessions}
                          disabled={isLoadingSessions}
                          className="p-1.5 bg-gray-50 text-gray-400 hover:text-[#4b33e8] hover:bg-[#4b33e8]/5 rounded-lg transition-all border border-gray-100 disabled:opacity-50"
                          title="Refresh Sessions"
                        >
                          <i className={`fi fi-rr-refresh flex text-[10px] ${isLoadingSessions ? 'animate-spin' : ''}`} />
                        </button>
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-[10px] font-bold rounded-full border border-gray-200">
                          {activeSessions.length} {activeSessions.length === 1 ? 'Session' : 'Sessions'}
                        </span>
                      </div>
                    </div>


                    <div className="space-y-3">
                      {isLoadingSessions ? (
                        <div className="flex flex-col items-center justify-center py-10 gap-3">
                          <div className="w-6 h-6 border-2 border-[#4b33e8]/30 border-t-[#4b33e8] rounded-full animate-spin"></div>
                          <p className="text-[10px] font-bold text-gray-400">Loading sessions...</p>
                        </div>
                      ) : activeSessions.length > 0 ? activeSessions.map(s => {
                        const isCurrentSession = s.token_id === currentTokenId;
                        const sessionId = s.id || s.token_id;
                        console.log(`Debug Session ${sessionId}: type=${s.device_type}`);

                        return (
                          <div 
                            key={sessionId} 
                            className={`p-4 rounded-2xl flex items-center justify-between border transition-all ${
                              isCurrentSession 
                                ? 'bg-[#4b33e8]/5 border-[#4b33e8] ring-1 ring-[#4b33e8]/20' 
                                : 'bg-gray-50 border-gray-100'
                            }`}
                          >



                            <div className="flex items-center gap-3">
                              <div className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-colors ${
                                s.is_active 
                                  ? 'bg-green-50 text-green-600 border-green-200' 
                                  : (isCurrentSession ? 'bg-[#4b33e8]/5 text-[#4b33e8] border-[#4b33e8]/20' : 'bg-white text-gray-400 border-gray-100')
                              }`}>
                                <i className={`fi flex text-xl ${
                                  s.device_type?.toLowerCase() === 'mobile' 
                                    ? 'fi-rr-smartphone' 
                                    : 'fi-rr-laptop'
                                }`}></i>
                              </div>

                              <div>
                                <div className="flex items-center gap-2">
                                  <p className="text-xs font-bold text-[#263238]">{s.device_name || "Device"}</p>
                                  {isCurrentSession && (
                                    <span className="px-1.5 py-0.5 bg-[#4b33e8] text-white text-[8px] font-bold rounded-md uppercase tracking-wider">Current</span>
                                  )}
                                  
                                  {/* Online Status Dot */}
                                  {(() => {
                                      const lastSeen = new Date(s.last_accessed_at).getTime();
                                      const diffSeconds = (Date.now() - lastSeen) / 1000;
                                      
                                      let dotColor = "bg-gray-300"; // Offline (> 3 min)
                                      let statusText = "Offline";

                                      if (diffSeconds < 60) { 
                                          dotColor = "bg-green-500"; // Online (< 1 min)
                                          statusText = "Online";
                                      } else if (diffSeconds < 180) {
                                          dotColor = "bg-yellow-400"; // Recently (< 3 min)
                                          statusText = "Recently Online";
                                      }

                                      return (
                                        <div className="group relative flex items-center">
                                            <div className={`w-2 h-2 rounded-full ${dotColor} relative`}></div>
                                            <div className="absolute left-4 opacity-0 group-hover:opacity-100 transition-opacity bg-black text-white text-[9px] px-2 py-1 rounded pointer-events-none whitespace-nowrap z-10">
                                                {statusText}
                                            </div>
                                        </div>
                                      );

                                  })()}
                                </div>
                                <p className="text-[10px] text-gray-400">{s.location || "Unknown"} • {formatTimeAgo(s.last_accessed_at)}</p>
                              </div>
                            </div>


                            {!isCurrentSession && (
                              <button 
                                onClick={() => handleRevokeSession(sessionId)} 
                                className="px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-500 hover:text-white rounded-lg text-[10px] font-bold transition-all border border-red-100"
                              >
                                Revoke
                              </button>
                            )}


                          </div>
                        );
                      }) : (
                        <div className="text-center py-10 text-gray-400 text-xs">No active sessions found</div>
                      )}

                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "flutter_bridge" && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              <FlutterBridgeTab />
            </div>
          )}

          {activeTab === "devices" && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              <DevicesTab employeeId={user?.employeeId} />
            </div>
          )}

          {activeTab === "integrations" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm p-6 sm:p-8" style={{ borderColor: "#E0E0E0" }}>
                <h3 className="text-lg font-bold mb-8 text-[#263238] flex items-center gap-2">
                  <i className="fi fi-rr-apps text-[#4b33e8] text-sm" />
                  Connected Apps
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Google Calendar Redesigned Card */}
                  <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-6 group transition-all hover:shadow-xl hover:shadow-indigo-500/5">
                    <div className="space-y-4">
                      {/* Connection Header Card */}
                      <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border border-gray-100 shadow-sm transform group-hover:-rotate-6 transition-transform">
                            <i className="fi fi-brands-google text-lg flex text-indigo-600"></i>
                          </div>
                          <div>
                            <p className="text-sm font-bold text-gray-900">Google Calendar</p>
                            <p className="text-[10px] text-gray-500 font-medium">
                              {user?.googleCalendarConnected 
                                ? `Connected as ${user.email || 'team@rynxly.in'}` 
                                : 'Sync reminders & schedules'}
                            </p>
                          </div>
                        </div>
                        
                        {/* Dynamic Toggle Switch */}
                        <div 
                          onClick={async () => {
                            if (user?.googleCalendarConnected) {
                              if (!confirm("Are you sure you want to disconnect Google Calendar?")) return;
                              
                              try {
                                setLoading(true); // Optional: show loading state if you have one available here
                                
                                // 1. Check if unlinking is possible/needed
                                const { data: { user: currentUser }, error: userError } = await supabase.auth.getUser();
                                if (userError) throw userError;

                                let googleIdentity = currentUser?.identities?.find(id => id.provider === 'google');
                                
                                if (googleIdentity) {
                                  // Check if this is the only identity (prevent lockout)
                                  if ((currentUser?.identities?.length || 0) <= 1) {
                                    throw new Error("You cannot disconnect Google as it is your only login method. Please set a password first in Security settings.");
                                  }

                                  // Attempt Unlink
                                  const { error: unlinkError } = await supabase.auth.unlinkIdentity(googleIdentity);
                                  if (unlinkError) throw unlinkError;
                                  console.log("✅ [Settings] Google Identity unlinked.");
                                  
                                  // CRITICAL: Refresh session to remove the identity from the JWT/Session state
                                  await supabase.auth.refreshSession();
                                } else {
                                  console.warn("⚠️ [Settings] No Google identity found to unlink. Proceeding to DB update.");
                                }

                                // 2. Update DB Profile
                                await supabase.from('user_profiles').update({ 
                                  google_calendar_connected: false,
                                  google_calendar_skipped: false 
                                }).eq('user_id', user.uid);
                                
                                // 3. Clear Local State
                                localStorage.removeItem("google_provider_token");
                                
                                showSuccess("Google Calendar disconnected successfully.");
                                setTimeout(() => window.location.reload(), 1000);
                              } catch (err: any) { 
                                console.error("Disconnect failed:", err);
                                if (err.message?.includes("password") || err.message?.includes("only identity")) {
                                    showError("You must set a password or link another account before disconnecting Google.", "Cannot Disconnect");
                                } else {
                                    showError(err.message || "Failed to disconnect.", "Disconnection Error"); 
                                }
                              } finally {
                                setLoading(false);
                              }
                            } else {
                              // Connect Logic
                              const { data: { session: currentSession } } = await supabase.auth.getSession();
                              if (currentSession) {
                                sessionStorage.setItem('oauth_restore_user_id', currentSession.user.id);
                                sessionStorage.setItem('oauth_restore_access_token', currentSession.access_token);
                                sessionStorage.setItem('oauth_restore_refresh_token', currentSession.refresh_token);
                              }
                              const isMobile = typeof window !== 'undefined' && !!(window as any).flutter_inappwebview;
                              
                              // Use linkIdentity to attach Google to CURRENT user instead of logging in as new user
                              const { data, error } = await supabase.auth.linkIdentity({
                                provider: 'google',
                                options: {
                                  queryParams: { 
                                    access_type: 'offline', 
                                    prompt: 'consent' 
                                  },
                                  scopes: 'https://www.googleapis.com/auth/calendar.events',
                                  redirectTo: `${window.location.origin}/settings`,
                                  skipBrowserRedirect: isMobile
                                }
                              });
                              if (error) { 
                                if (error.message.includes("Manual linking is disabled")) {
                                  showError("Please go to Supabase > Authentication > Providers > Google and enable 'Manual Linking' (or in Settings > Security).", "Configuration Required");
                                } else {
                                  showError(error.message, "Connection Error"); 
                                }
                                return; 
                              }
                              if (isMobile && data?.url) {
                                const { notifyFlutter } = await import("../lib/flutterBridge");
                                notifyFlutter('open_external_url', data.url);
                              }
                            }
                          }}
                          className={`w-10 h-6 rounded-full relative cursor-pointer transition-all duration-300 ${user?.googleCalendarConnected ? 'bg-green-500' : 'bg-gray-200'}`}
                        >
                          <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all duration-300 ${user?.googleCalendarConnected ? 'right-1' : 'left-1'}`}></div>
                        </div>
                      </div>

                      {/* Feature Lists */}
                      <div className="space-y-3 pl-2">
                        <div className="flex items-center gap-3">
                          <div className={`w-5 h-5 rounded flex items-center justify-center text-white text-[10px] transition-all ${user?.googleCalendarConnected ? 'bg-[#4b33e8]' : 'bg-gray-200'}`}>
                            <i className="fi fi-rr-check flex"></i>
                          </div>
                          <span className={`text-sm font-medium ${user?.googleCalendarConnected ? 'text-gray-600' : 'text-gray-400'}`}>Sync Call Schedules</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className={`w-5 h-5 rounded flex items-center justify-center text-white text-[10px] transition-all ${user?.googleCalendarConnected ? 'bg-[#4b33e8]' : 'bg-gray-200'}`}>
                            <i className="fi fi-rr-check flex"></i>
                          </div>
                          <span className={`text-sm font-medium ${user?.googleCalendarConnected ? 'text-gray-600' : 'text-gray-400'}`}>Sync Reminders</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "console_logs" && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              <ConsoleLogsTab />
            </div>
          )}
        </div>
      </div>
      {/* Identity Error Modal */}
      {showIdentityErrorPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fi fi-rr-cross-circle text-3xl text-red-500 flex"></i>
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-2">Account Already Linked</h3>
              
              <p className="text-sm text-gray-600 mb-6 leading-relaxed">
                This Google account is already connected to another TFC user. 
                <br/><br/>
                Please use a different Google account or log in with the existing account associated with this email.
              </p>

              <button 
                onClick={() => setShowIdentityErrorPopup(false)}
                className="w-full py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition-all active:scale-95"
              >
                Okay, I understand
              </button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
