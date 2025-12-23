import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { checkAuthAndFetchProfile, handleLogout, UserProfile } from "../lib/authService";
import { supabase } from "../lib/supabase";
import { showSuccess, showError } from "../lib/dialogUtils";
import SettingsFormFields from "../components/SettingsFormFields";

export default function Settings() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeNav, setActiveNav] = useState("settings");
  const [activeTab, setActiveTab] = useState<"profile" | "security">("profile");
  const [activeCategory, setActiveCategory] = useState<"basic_info" | "personal_info" | "employment_info" | "address_info" | "kyc_info" | "bank_info" | "documents">("basic_info");
  
  // Form state - organized by categories
  const [formData, setFormData] = useState({
    // basic_info
    email: "",
    user_name: "",
    contact_no: "",
    employee_id: "",
    role: "",
    // personal_info
    father_name: "",
    gender: "",
    date_of_birth: "",
    blood_group: "",
    alternate_contact: "",
    emergency_contact_no: "",
    // employment_info
    date_of_joining: "",
    in_hand_salary: "",
    // address_info
    primary_address: "",
    area_pincode: "",
    // kyc_info
    pan_number: "",
    aadhar_card_no: "",
    // bank_info
    bank_name: "",
    account_holder_name: "",
    account_number: "",
    ifsc_code: "",
    branch_city: "",
    branch_state: "",
    branch_pincode: "",
    // documents (URLs - handled separately)
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
  const [activeSessions, setActiveSessions] = useState<Array<{
    id: string;
    device_name: string | null;
    device_type: string | null;
    browser: string | null;
    location: string | null;
    last_accessed_at: string;
    created_at: string;
    ip_address: string | null;
  }>>([]);
  const [isLoadingSessions, setIsLoadingSessions] = useState(false);

  useEffect(() => {
    const fetchAuth = async () => {
      const result = await checkAuthAndFetchProfile();
      
      if (result.shouldRedirect) {
        router.push("/login");
        return;
      }

      if (result.error) {
        setError(result.error);
        setTimeout(() => {
          router.push("/login");
        }, 2000);
        return;
      }

      if (result.user) {
        // Fetch full profile data from API
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          try {
            const profileResponse = await fetch("/api/auth/user-profile", {
              headers: {
                Authorization: `Bearer ${session.access_token}`,
              },
            });
            const profileData = await profileResponse.json();
            
            if (profileData.success && profileData.user) {
              // Update user state with profile pic URL
              setUser({
                ...profileData.user,
                profilePicUrl: profileData.user.profile_pic_url || null,
              });
              // Fetch all fields directly from user_profiles
              const { data: fullProfile } = await supabase
                .from('user_profiles')
                .select('*')
                .eq('user_id', result.user.uid)
                .maybeSingle();
              
              setFormData({
                // basic_info
                email: profileData.user.email || fullProfile?.email || "",
                user_name: fullProfile?.user_name || profileData.user.displayName || "",
                contact_no: fullProfile?.contact_no || profileData.user.phone || "",
                employee_id: fullProfile?.employee_id || profileData.user.employeeId || "",
                role: fullProfile?.role || profileData.user.role || "",
                // personal_info
                father_name: fullProfile?.father_name || "",
                gender: fullProfile?.gender || "",
                date_of_birth: fullProfile?.date_of_birth || "",
                blood_group: fullProfile?.blood_group || "",
                alternate_contact: fullProfile?.alternate_contact || "",
                emergency_contact_no: fullProfile?.emergency_contact_no || "",
                // employment_info
                date_of_joining: fullProfile?.date_of_joining || "",
                in_hand_salary: fullProfile?.in_hand_salary?.toString() || "",
                // address_info
                primary_address: fullProfile?.primary_address || "",
                area_pincode: fullProfile?.area_pincode || "",
                // kyc_info
                pan_number: fullProfile?.pan_number || "",
                aadhar_card_no: fullProfile?.aadhar_card_no || "",
                // bank_info
                bank_name: fullProfile?.bank_name || "",
                account_holder_name: fullProfile?.account_holder_name || "",
                account_number: fullProfile?.account_number || "",
                ifsc_code: fullProfile?.ifsc_code || "",
                branch_city: fullProfile?.branch_city || "",
                branch_state: fullProfile?.branch_state || "",
                branch_pincode: fullProfile?.branch_pincode || "",
                // documents
                profile_pic_url: fullProfile?.profile_pic_url || "",
                pancard_url: fullProfile?.pancard_url || "",
                aadhar_front_url: fullProfile?.aadhar_front_url || "",
                aadhar_back_url: fullProfile?.aadhar_back_url || "",
                qualification_marksheet_url: fullProfile?.qualification_marksheet_url || "",
                bank_passbook_url: fullProfile?.bank_passbook_url || "",
              });
            }
          } catch (err) {
            console.error('Error fetching profile:', err);
            // Fallback to basic data
        setFormData({
          email: result.user.email || "",
              user_name: result.user.displayName || "",
              contact_no: result.user.phone || "",
              employee_id: result.user.employeeId || "",
              role: result.user.role || "",
              father_name: "",
              gender: "",
              date_of_birth: "",
              blood_group: "",
              alternate_contact: "",
              emergency_contact_no: "",
              date_of_joining: "",
              in_hand_salary: "",
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
          }
        }
      }
    };

    fetchAuth();
  }, [router]);

  // Fetch active sessions when security tab is active
  useEffect(() => {
    if (activeTab === "security" && user) {
      fetchActiveSessions();
    }
  }, [activeTab, user]);

  const handleLogoutClick = async () => {
    await handleLogout(router);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleFileUpload = async (fieldName: string, fileUrl: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        showError("You must be logged in to upload files", "Authentication Error");
        return;
      }

      // Immediately update the document URL in the database
      const updatePayload: any = {
        [fieldName]: fileUrl,
      };

      const response = await fetch("/api/auth/update-profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(updatePayload),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Failed to update document URL:", data.error);
        showError(data.error || "Failed to save document URL", "Error");
      } else {
        // Success - document URL is now saved in database
        console.log(`Document URL saved successfully for ${fieldName}`);
      }
    } catch (error: any) {
      console.error("Error saving document URL:", error);
      showError(error.message || "An error occurred while saving document", "Error");
    }
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        showError("You must be logged in to save changes", "Authentication Error");
        setIsSaving(false);
        return;
      }

      const response = await fetch("/api/auth/update-profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        showError(data.error || "Failed to save changes", "Error");
        setIsSaving(false);
        return;
      }

      showSuccess("Profile updated successfully!", "Success");
      
      // Refresh user data
      const result = await checkAuthAndFetchProfile();
      if (result.user) {
        setUser(result.user);
      }
    } catch (error: any) {
      showError(error.message || "An error occurred while saving", "Error");
    } finally {
      setIsSaving(false);
    }
  };

  const getInitials = () => {
    if (user?.displayName) {
      return user.displayName.trim().charAt(0).toUpperCase();
    }
    if (user?.email) {
      return user.email.slice(0, 2).toUpperCase();
    }
    return "U";
  };

  const handlePasswordUpdate = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      showError("Please fill in all password fields", "Validation Error");
      return;
    }

    if (newPassword !== confirmPassword) {
      showError("New password and confirm password do not match", "Validation Error");
      return;
    }

    if (newPassword.length < 6) {
      showError("Password must be at least 6 characters long", "Validation Error");
      return;
    }

    setIsUpdatingPassword(true);
    try {
      // Verify current password by attempting to sign in
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser?.email) {
        showError("Unable to verify current password", "Authentication Error");
        setIsUpdatingPassword(false);
        return;
      }

      // Try to sign in with current password to verify it
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: authUser.email,
        password: currentPassword,
      });

      if (signInError) {
        showError("Current password is incorrect", "Authentication Error");
        setIsUpdatingPassword(false);
        return;
      }

      // Update password
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) {
        showError(updateError.message || "Failed to update password", "Error");
        setIsUpdatingPassword(false);
        return;
      }

      showSuccess("Password updated successfully!", "Success");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      showError(error.message || "An error occurred while updating password", "Error");
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const fetchActiveSessions = async () => {
    setIsLoadingSessions(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setIsLoadingSessions(false);
        return;
      }

      const response = await fetch("/api/auth/active-sessions", {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      const data = await response.json();

      if (response.ok && data.success && data.sessions) {
        setActiveSessions(data.sessions);
      } else {
        console.error("Failed to fetch sessions:", data.error);
      }
    } catch (error: any) {
      console.error("Error fetching sessions:", error);
    } finally {
      setIsLoadingSessions(false);
    }
  };

  const handleRevokeSession = async (sessionId: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        showError("You must be logged in to revoke sessions", "Authentication Error");
        return;
      }

      const response = await fetch("/api/auth/revoke-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ session_id: sessionId }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        showSuccess("Session revoked successfully", "Success");
        // Refresh sessions list
        fetchActiveSessions();
      } else {
        showError(data.error || "Failed to revoke session", "Error");
      }
    } catch (error: any) {
      showError(error.message || "An error occurred while revoking session", "Error");
    }
  };

  // Format time ago
  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) {
      return "Active now";
    } else if (diffMins < 60) {
      return `${diffMins} ${diffMins === 1 ? "minute" : "minutes"} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} ${diffHours === 1 ? "hour" : "hours"} ago`;
    } else if (diffDays < 7) {
      return `${diffDays} ${diffDays === 1 ? "day" : "days"} ago`;
    } else {
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      const year = date.getFullYear();
      return `${month}/${day}/${year}`;
    }
  };

  // Calculate profile completion percentage
  const calculateProfileCompletion = () => {
    // Fields that count toward completion (excluding disabled fields like email, employee_id, role)
    const fieldsToCheck = [
      // basic_info (excluding email, employee_id, role as they're disabled)
      { key: 'user_name', required: true },
      { key: 'contact_no', required: true },
      // personal_info
      { key: 'father_name', required: false },
      { key: 'gender', required: false },
      { key: 'date_of_birth', required: false },
      { key: 'blood_group', required: false },
      { key: 'alternate_contact', required: false },
      { key: 'emergency_contact_no', required: false },
      // employment_info
      { key: 'date_of_joining', required: false },
      { key: 'in_hand_salary', required: false },
      // address_info
      { key: 'primary_address', required: false },
      { key: 'area_pincode', required: false },
      // kyc_info
      { key: 'pan_number', required: false },
      { key: 'aadhar_card_no', required: false },
      // bank_info
      { key: 'bank_name', required: false },
      { key: 'account_holder_name', required: false },
      { key: 'account_number', required: false },
      { key: 'ifsc_code', required: false },
      { key: 'branch_city', required: false },
      { key: 'branch_state', required: false },
      { key: 'branch_pincode', required: false },
    ];

    let filledCount = 0;
    let totalFields = fieldsToCheck.length;

    fieldsToCheck.forEach(field => {
      const value = (formData as any)[field.key];
      if (value && value.toString().trim() !== '') {
        filledCount++;
      }
    });

    const percentage = Math.round((filledCount / totalFields) * 100);
    return percentage;
  };

  const profileCompletion = calculateProfileCompletion();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ backgroundColor: "#f6f5f7" }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-transparent mx-auto mb-4" style={{ borderColor: '#4b33e8' }}></div>
          <div className="text-lg" style={{ color: "#4b33e8" }}>Loading...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ backgroundColor: "#f6f5f7" }}>
        <div className="text-center">
          <div className="text-lg mb-4 text-red-500">{error}</div>
          <div className="text-sm" style={{ color: "#4b33e8" }}>Redirecting to login...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full overflow-x-hidden" style={{ backgroundColor: "#f6f5f7", maxWidth: "100vw" }}>
      {/* Left Sidebar */}
      <Sidebar
        user={{
          displayName: user?.displayName || null,
          email: user?.email || "",
          employeeId: user?.employeeId || null,
          lastSignInAt: user?.lastSignInAt || null,
          profilePicUrl: user?.profilePicUrl || null,
        }}
        activeNav={activeNav}
        onNavChange={setActiveNav}
        userRole={user?.role || null}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:ml-56 w-full min-w-0 overflow-x-hidden">
        {/* Top Header */}
        <Header
          user={{
            displayName: user?.displayName || null,
            email: user?.email || "",
            employeeId: user?.employeeId || null,
            profilePicUrl: user?.profilePicUrl || null,
          }}
          onLogout={handleLogoutClick}
        />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden min-w-0 max-w-full pt-[60px] lg:pt-[60px]" style={{ backgroundColor: "#f6f5f7" }}>
          <div className="container mx-auto px-3 sm:px-4 md:px-6 py-4 space-y-4 sm:space-y-6 pb-20 sm:pb-24 lg:pb-8 max-w-7xl">
            {/* Page Header */}
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-1" style={{ color: "#263238", fontFamily: "'Poppins', sans-serif" }}>
                Settings
              </h1>
              <p className="text-xs sm:text-sm" style={{ color: "#787E9D", fontFamily: "'Roboto', sans-serif" }}>
                Manage your account and application preferences
              </p>
            </div>

            {/* Tabs */}
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-4">
              <div className="inline-flex h-10 items-center justify-center rounded-md p-1 bg-white border" style={{ borderColor: "#E0E0E0" }}>
                <button
                  type="button"
                  onClick={() => setActiveTab("profile")}
                  className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all ${
                    activeTab === "profile"
                      ? "bg-white text-gray-900"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  Profile
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("security")}
                  className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all ${
                    activeTab === "security"
                      ? "bg-white text-gray-900"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  Security
                </button>
                </div>

                {/* Profile Completion Percentage */}
                <div className="relative flex flex-col gap-2 px-3 py-1 rounded-md bg-white border" style={{ borderColor: "#E0E0E0" }}>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium" style={{ color: "#787E9D", fontFamily: "'Roboto', sans-serif" }}>
                      Profile Complete:
                    </span>
                    <span 
                      className="text-sm font-bold"
                      style={{ 
                        color: profileCompletion === 100 ? "#10B981" : profileCompletion >= 50 ? "#F59E0B" : "#EF4444",
                        fontFamily: "'Poppins', sans-serif"
                      }}
                    >
                      {profileCompletion}%
                    </span>
                  </div>
                  {/* Progress Bar as Bottom Border */}
                  <div className="w-full h-0.5 rounded-full overflow-hidden bg-gray-200" style={{ backgroundColor: "#E0E0E0" }}>
                    <div
                      className="h-full transition-all duration-300"
                      style={{
                        width: `${profileCompletion}%`,
                        backgroundColor: profileCompletion === 100 ? "#10B981" : profileCompletion >= 50 ? "#F59E0B" : "#EF4444",
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Profile Tab Content */}
              {activeTab === "profile" && (
                <div className="mt-2 space-y-4">
                  {/* Category Navigation */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {[
                      { id: "basic_info", label: "Basic Details" },
                      { id: "personal_info", label: "Personal Info" },
                      { id: "employment_info", label: "Employment" },
                      { id: "address_info", label: "Address" },
                      { id: "kyc_info", label: "KYC" },
                      { id: "bank_info", label: "Bank Details" },
                      { id: "documents", label: "Documents" },
                    ].map((category) => (
                          <button
                        key={category.id}
                            type="button"
                        onClick={() => setActiveCategory(category.id as any)}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                          activeCategory === category.id
                            ? "text-white"
                            : "bg-white text-gray-700 hover:bg-gray-50"
                        }`}
                            style={{
                          backgroundColor: activeCategory === category.id ? "#4b33e8" : undefined,
                              borderColor: "#E0E0E0",
                              fontFamily: "'Poppins', sans-serif",
                            }}
                          >
                        {category.label}
                          </button>
                    ))}
                      </div>

                  {/* Category Content */}
                  <div className="rounded-lg border bg-white p-4 sm:p-6" style={{ borderColor: "#E0E0E0" }}>
                    <div className="space-y-4">
                      <h3 className="text-base sm:text-lg font-semibold mb-4" style={{ color: "#263238", fontFamily: "'Poppins', sans-serif" }}>
                        {activeCategory === "basic_info" && "Basic Details"}
                        {activeCategory === "personal_info" && "Personal Information"}
                        {activeCategory === "employment_info" && "Employment Information"}
                        {activeCategory === "address_info" && "Address Information"}
                        {activeCategory === "kyc_info" && "KYC Information"}
                        {activeCategory === "bank_info" && "Bank Details"}
                        {activeCategory === "documents" && "Documents"}
                      </h3>

                      {/* Form Fields */}
                      <SettingsFormFields
                        formData={formData}
                        handleInputChange={handleInputChange}
                        category={activeCategory}
                        onFileUpload={handleFileUpload}
                      />

                      {/* Save Button */}
                      <div className="mt-6 pt-4 border-t" style={{ borderColor: "#E0E0E0" }}>
                      <button
                        type="button"
                        onClick={handleSaveChanges}
                          disabled={isSaving}
                          className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium h-10 px-4 py-2 text-white transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{
                          backgroundColor: "#4b33e8",
                          fontFamily: "'Poppins', sans-serif",
                        }}
                      >
                          {isSaving ? "Saving..." : "Save Changes"}
                      </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Security Tab Content */}
              {activeTab === "security" && (
                <div className="mt-2 space-y-4">
                  <div className="rounded-lg border bg-white p-4 sm:p-6" style={{ borderColor: "#E0E0E0" }}>
                    <h3 className="text-base sm:text-lg font-semibold mb-4" style={{ color: "#263238", fontFamily: "'Poppins', sans-serif" }}>
                      Security Settings
                    </h3>
                    
                    <div className="space-y-4">
                      {/* Change Password Section */}
                      <div className="space-y-3">
                        <h4 className="font-semibold text-sm" style={{ color: "#263238", fontFamily: "'Poppins', sans-serif" }}>
                          Change Password
                        </h4>
                        <div className="space-y-3">
                          <div className="space-y-2">
                            <label 
                              htmlFor="currentPassword" 
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              style={{ color: "#263238", fontFamily: "'Roboto', sans-serif" }}
                            >
                              Current Password
                            </label>
                            <input
                              type="password"
                              id="currentPassword"
                              value={currentPassword}
                              onChange={(e) => setCurrentPassword(e.target.value)}
                              className="flex h-10 w-full rounded-md border bg-white px-3 py-2 text-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4b33e8] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                              style={{ 
                                borderColor: "#E0E0E0",
                                color: "#263238",
                                fontFamily: "'Roboto', sans-serif"
                              }}
                            />
                          </div>
                          <div className="space-y-2">
                            <label 
                              htmlFor="newPassword" 
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              style={{ color: "#263238", fontFamily: "'Roboto', sans-serif" }}
                            >
                              New Password
                            </label>
                            <input
                              type="password"
                              id="newPassword"
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                              className="flex h-10 w-full rounded-md border bg-white px-3 py-2 text-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4b33e8] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                              style={{ 
                                borderColor: "#E0E0E0",
                                color: "#263238",
                                fontFamily: "'Roboto', sans-serif"
                              }}
                            />
                          </div>
                          <div className="space-y-2">
                            <label 
                              htmlFor="confirmPassword" 
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              style={{ color: "#263238", fontFamily: "'Roboto', sans-serif" }}
                            >
                              Confirm New Password
                            </label>
                            <input
                              type="password"
                              id="confirmPassword"
                              value={confirmPassword}
                              onChange={(e) => setConfirmPassword(e.target.value)}
                              className="flex h-10 w-full rounded-md border bg-white px-3 py-2 text-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4b33e8] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                              style={{ 
                                borderColor: "#E0E0E0",
                                color: "#263238",
                                fontFamily: "'Roboto', sans-serif"
                              }}
                            />
                          </div>
                          <button
                            type="button"
                            onClick={handlePasswordUpdate}
                            disabled={isUpdatingPassword}
                            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium h-10 px-4 py-2 text-white transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                            style={{
                              backgroundColor: "#4b33e8",
                              fontFamily: "'Poppins', sans-serif",
                            }}
                          >
                            {isUpdatingPassword ? "Updating..." : "Update Password"}
                          </button>
                        </div>
                      </div>

                      {/* Two-Factor Authentication Section */}
                      <div className="pt-4 border-t" style={{ borderColor: "#E0E0E0" }}>
                        <h4 className="font-semibold mb-3 text-sm" style={{ color: "#263238", fontFamily: "'Poppins', sans-serif" }}>
                          Two-Factor Authentication
                        </h4>
                        <div className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: "#F5F5F5" }}>
                          <div className="flex-1">
                            <p className="font-medium text-sm" style={{ color: "#263238", fontFamily: "'Poppins', sans-serif" }}>
                              Enable 2FA
                            </p>
                            <p className="text-xs" style={{ color: "#787E9D", fontFamily: "'Roboto', sans-serif" }}>
                              Add an extra layer of security to your account
                            </p>
                          </div>
                          <button
                            type="button"
                            role="switch"
                            aria-checked={twoFactorEnabled}
                            onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                              twoFactorEnabled ? "bg-[#4b33e8]" : "bg-gray-300"
                            }`}
                            style={{ borderColor: "transparent" }}
                          >
                            <span
                              className={`pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform ${
                                twoFactorEnabled ? "translate-x-5" : "translate-x-0"
                              }`}
                            />
                          </button>
                        </div>
                      </div>

                      {/* Active Sessions Section */}
                      <div className="pt-4 border-t" style={{ borderColor: "#E0E0E0" }}>
                        <h4 className="font-semibold mb-3 text-sm" style={{ color: "#263238", fontFamily: "'Poppins', sans-serif" }}>
                          Active Sessions
                        </h4>
                        <div className="space-y-2">
                          {activeSessions.map((session) => (
                            <div
                              key={session.id}
                              className="flex items-center justify-between p-3 rounded-lg"
                              style={{ backgroundColor: "#F5F5F5" }}
                            >
                              <div>
                                <p className="font-medium text-sm" style={{ color: "#263238", fontFamily: "'Poppins', sans-serif" }}>
                                  {session.device_name || "Unknown Device"}
                                  {session.device_type && (
                                    <span className="ml-2 text-xs px-2 py-0.5 rounded" style={{ 
                                      backgroundColor: session.device_type === 'mobile' ? '#E3F2FD' : session.device_type === 'tablet' ? '#F3E5F5' : '#E8F5E9',
                                      color: session.device_type === 'mobile' ? '#1976D2' : session.device_type === 'tablet' ? '#7B1FA2' : '#388E3C',
                                      fontFamily: "'Roboto', sans-serif",
                                      textTransform: 'capitalize'
                                    }}>
                                      {session.device_type}
                                    </span>
                                  )}
                                </p>
                                <p className="text-xs" style={{ color: "#787E9D", fontFamily: "'Roboto', sans-serif" }}>
                                  {session.location || "Unknown Location"} • {formatTimeAgo(session.last_accessed_at)}
                                  {session.ip_address && ` • ${session.ip_address}`}
                                </p>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleRevokeSession(session.id)}
                                className="inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium border bg-white rounded-md px-3 h-8 text-xs transition-all hover:opacity-90"
                                style={{
                                  borderColor: "#E0E0E0",
                                  color: "#EF4444",
                                  fontFamily: "'Roboto', sans-serif",
                                }}
                              >
                                Revoke
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

