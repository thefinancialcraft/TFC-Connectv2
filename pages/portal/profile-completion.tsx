import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { useUser } from "@/components/AppLayout";
import { supabase } from "@/lib/supabase";
import { showSuccess, showError } from "@/lib/dialogUtils";
import SettingsFormFields from "@/components/SettingsFormFields";
import AppLogo from "@/components/AppLogo";

function ProfileCompletion() {
  const router = useRouter();
  const { user, mounted: authMounted } = useUser();
  const [mounted, setMounted] = useState(false);
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

  useEffect(() => {
    const fetchProfile = async () => {
      if (!authMounted || !user) return;

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
            // Fetch all fields directly from user_profiles
            const { data: fullProfile } = await supabase
              .from('user_profiles')
              .select('*')
              .eq('user_id', user.uid)
              .maybeSingle();
            
            // Format dates for input fields (YYYY-MM-DD format) - client-only, fixed format
            const formatDateForInput = (dateString: string | null | undefined): string => {
              if (!dateString || typeof window === 'undefined') return "";
              try {
                // Use UTC to avoid timezone issues
                const date = new Date(dateString);
                if (isNaN(date.getTime())) return "";
                // Use toISOString for consistent YYYY-MM-DD format (UTC)
                return date.toISOString().split('T')[0];
              } catch {
                return "";
              }
            };

            setFormData({
              // basic_info
              email: String(profileData.user.email || fullProfile?.email || ""),
              user_name: String(fullProfile?.user_name || profileData.user.displayName || ""),
              contact_no: String(fullProfile?.contact_no || profileData.user.phone || ""),
              employee_id: String(fullProfile?.employee_id || profileData.user.employeeId || ""),
              role: String(fullProfile?.role || profileData.user.role || ""),
              // personal_info
              father_name: String(fullProfile?.father_name || ""),
              gender: String(fullProfile?.gender || ""),
              date_of_birth: formatDateForInput(fullProfile?.date_of_birth),
              blood_group: String(fullProfile?.blood_group || ""),
              alternate_contact: String(fullProfile?.alternate_contact || ""),
              emergency_contact_no: String(fullProfile?.emergency_contact_no || ""),
              // employment_info
              date_of_joining: formatDateForInput(fullProfile?.date_of_joining),
              in_hand_salary: String(fullProfile?.in_hand_salary || ""),
              // address_info
              primary_address: String(fullProfile?.primary_address || ""),
              area_pincode: String(fullProfile?.area_pincode || ""),
              // kyc_info
              pan_number: String(fullProfile?.pan_number || ""),
              aadhar_card_no: String(fullProfile?.aadhar_card_no || ""),
              // bank_info
              bank_name: String(fullProfile?.bank_name || ""),
              account_holder_name: String(fullProfile?.account_holder_name || ""),
              account_number: String(fullProfile?.account_number || ""),
              ifsc_code: String(fullProfile?.ifsc_code || ""),
              branch_city: String(fullProfile?.branch_city || ""),
              branch_state: String(fullProfile?.branch_state || ""),
              branch_pincode: String(fullProfile?.branch_pincode || ""),
              // documents
              profile_pic_url: String(fullProfile?.profile_pic_url || ""),
              pancard_url: String(fullProfile?.pancard_url || ""),
              aadhar_front_url: String(fullProfile?.aadhar_front_url || ""),
              aadhar_back_url: String(fullProfile?.aadhar_back_url || ""),
              qualification_marksheet_url: String(fullProfile?.qualification_marksheet_url || ""),
              bank_passbook_url: String(fullProfile?.bank_passbook_url || ""),
            });

            // Check if profile is already complete, redirect if so
            if (fullProfile?.profile_complete) {
              router.push("/pending");
              return;
            }
          }
        } catch (err) {
          console.error('Error fetching profile:', err);
          // Fallback to basic data - ensure all values are strings
          setFormData(prev => ({
            ...prev,
            email: String(user.email || ""),
            user_name: String(user.displayName || ""),
            contact_no: String(user.phone || ""),
            employee_id: String(user.employeeId || ""),
            role: String(user.role || ""),
          }));
        }
      }
    };

    fetchProfile();
  }, [authMounted, user, router]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleFileUpload = async (fieldName: string, fileUrl: string) => {
    // Update form data immediately
    setFormData((prev) => ({ ...prev, [fieldName]: fileUrl }));
    
    // Immediately save to database
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        showError("You must be logged in to save changes", "Authentication Error");
        return;
      }

      // Update only the specific field in database
      const response = await fetch("/api/auth/update-profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          [fieldName]: fileUrl,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Failed to save file URL:', data.error);
        showError(data.error || "Failed to save file URL", "Error");
        // Revert form data on error
        setFormData((prev) => ({ ...prev, [fieldName]: "" }));
      } else {
        showSuccess(`${fieldName.replace('_', ' ')} uploaded and saved successfully!`, "Success");
      }
    } catch (error: any) {
      console.error('Error saving file URL:', error);
      showError(error.message || "An error occurred while saving", "Error");
      // Revert form data on error
      setFormData((prev) => ({ ...prev, [fieldName]: "" }));
    }
  };

  const handleSaveAndComplete = async () => {
    // Validate required fields
    if (!formData.user_name || !formData.contact_no) {
      showError("Please fill in required fields: Full Name and Contact Number", "Validation Error");
      return;
    }

    setIsSaving(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        showError("You must be logged in to save changes", "Authentication Error");
        setIsSaving(false);
        return;
      }

      // Update profile with profile_complete flag
      const response = await fetch("/api/auth/update-profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          ...formData,
          profile_complete: true,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        showError(data.error || "Failed to save changes", "Error");
        setIsSaving(false);
        return;
      }

      showSuccess("Profile completed successfully! Your application is now pending approval.", "Success");
      
      // Redirect to pending page after a short delay
      setTimeout(() => {
        router.push("/pending");
      }, 1500);
    } catch (error: any) {
      showError(error.message || "An error occurred while saving", "Error");
      setIsSaving(false);
    }
  };

  // Calculate profile completion percentage - only after mount to avoid hydration issues
  const calculateProfileCompletion = () => {
    if (!mounted) return 0; // Return 0 during SSR/initial render
    
    const fieldsToCheck = [
      { key: 'user_name', required: true },
      { key: 'contact_no', required: true },
      { key: 'father_name', required: false },
      { key: 'gender', required: false },
      { key: 'date_of_birth', required: false },
      { key: 'blood_group', required: false },
      { key: 'alternate_contact', required: false },
      { key: 'emergency_contact_no', required: false },
      { key: 'date_of_joining', required: false },
      { key: 'in_hand_salary', required: false },
      { key: 'primary_address', required: false },
      { key: 'area_pincode', required: false },
      { key: 'pan_number', required: false },
      { key: 'aadhar_card_no', required: false },
      { key: 'bank_name', required: false },
      { key: 'account_holder_name', required: false },
      { key: 'account_number', required: false },
      { key: 'ifsc_code', required: false },
      { key: 'branch_city', required: false },
      { key: 'branch_state', required: false },
      { key: 'branch_pincode', required: false },
    ];

    let filledCount = 0;
    const totalFields = fieldsToCheck.length;

    fieldsToCheck.forEach(field => {
      const value = (formData as any)[field.key];
      if (value && String(value).trim() !== '') {
        filledCount++;
      }
    });

    // Use Math.round for deterministic calculation
    return Math.round((filledCount / totalFields) * 100);
  };

  if (!mounted || !authMounted || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#e7e3ff" }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600" style={{ fontFamily: "'Roboto', sans-serif" }}>Loading profile...</p>
        </div>
      </div>
    );
  }

  // Calculate profile completion only after mount (client-side only)
  const profileCompletion = calculateProfileCompletion();

  const categories = [
    { id: "basic_info", label: "Basic Details", icon: "fi-rr-user" },
    { id: "personal_info", label: "Personal Info", icon: "fi-rr-id-card" },
    { id: "employment_info", label: "Employment", icon: "fi-rr-briefcase" },
    { id: "address_info", label: "Address", icon: "fi-rr-map-marker" },
    { id: "kyc_info", label: "KYC", icon: "fi-rr-shield-check" },
    { id: "bank_info", label: "Bank Details", icon: "fi-rr-credit-card" },
    { id: "documents", label: "Documents", icon: "fi-rr-file" },
  ];

  return (
    <>
      <div className="min-h-screen py-8" style={{ backgroundColor: "#e7e3ff" }}>
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mb-6">
            <AppLogo size="default" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2" style={{ color: "#263238", fontFamily: "'Poppins', sans-serif" }}>
            Complete Your Profile
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto" style={{ fontFamily: "'Roboto', sans-serif" }}>
            Please fill in your profile information to proceed. Required fields are marked with <span className="text-red-500">*</span>.
          </p>
        </div>

        {/* Progress Card */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold" style={{ color: "#263238", fontFamily: "'Poppins', sans-serif" }}>
                Profile Completion
              </h2>
              <span 
                className="text-xl font-bold"
                style={{ 
                  color: profileCompletion === 100 ? "#10B981" : profileCompletion >= 50 ? "#F59E0B" : "#EF4444",
                  fontFamily: "'Poppins', sans-serif"
                }}
              >
                {profileCompletion}%
              </span>
            </div>
            <div className="w-full h-3 rounded-full overflow-hidden bg-gray-200">
              <div
                className="h-full transition-all duration-300"
                style={{
                  width: `${profileCompletion}%`,
                  backgroundColor: profileCompletion === 100 ? "#10B981" : profileCompletion >= 50 ? "#F59E0B" : "#EF4444",
                }}
            />
          </div>
        </div>

        {/* Main Form Card */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 mb-6">
          {/* Category Navigation */}
          <div className="flex flex-wrap gap-2 mb-6 pb-4 border-b" style={{ borderColor: "#E0E0E0" }}>
            {categories.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => setActiveCategory(category.id as any)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeCategory === category.id
                    ? "text-white"
                    : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                }`}
                style={{
                  backgroundColor: activeCategory === category.id ? "#4b33e8" : undefined,
                  fontFamily: "'Poppins', sans-serif",
                }}
              >
                <i className={`fi flex ${category.icon}`}></i>
                <span>{category.label}</span>
              </button>
            ))}
          </div>

          {/* Category Content */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold mb-4" style={{ color: "#263238", fontFamily: "'Poppins', sans-serif" }}>
              {categories.find(c => c.id === activeCategory)?.label}
            </h3>

            {/* Form Fields */}
            <SettingsFormFields
              formData={formData}
              handleInputChange={handleInputChange}
              category={activeCategory}
              onFileUpload={handleFileUpload}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <div className="flex flex-col sm:flex-row gap-4 justify-end">
            <button
              type="button"
              onClick={() => router.push("/login")}
              className="px-6 py-3 rounded-lg text-gray-700 font-medium transition hover:bg-gray-50"
              style={{ 
                fontFamily: "'Poppins', sans-serif",
                border: "1px solid #E0E0E0"
              }}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveAndComplete}
              disabled={isSaving}
              className="px-8 py-3 rounded-lg text-white font-medium transition hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: "#4b33e8",
                fontFamily: "'Poppins', sans-serif",
              }}
            >
              {isSaving ? "Saving..." : "Save & Complete Profile"}
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-4 text-center" style={{ fontFamily: "'Roboto', sans-serif" }}>
            After completing your profile, your application will be submitted for approval.
          </p>
        </div>
      </div>
      </div>
    </>
  );
}

// Disable SSR to prevent hydration errors
export default dynamic(() => Promise.resolve(ProfileCompletion), {
  ssr: false,
});

