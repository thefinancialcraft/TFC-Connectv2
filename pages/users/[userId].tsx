import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { supabase } from "../../lib/supabase";
import { checkAuthAndFetchProfile, UserProfile } from "../../lib/authService";
import UserMenuDropdown from "../../components/UserMenuDropdown";
import BottomNav from "../../components/BottomNav";

// Dynamically import all components to prevent hydration errors
const Sidebar = dynamic(() => import("../../components/Sidebar"), { ssr: false });
const Header = dynamic(() => import("../../components/Header"), { ssr: false });
const SettingsFormFields = dynamic(() => import("../../components/SettingsFormFields"), { ssr: false });

interface UserDetail {
  // Extended user profile data
  id?: string;
  user_id?: string;
  user_name?: string | null;
  contact_no?: string | null;
  employee_id?: string | null;
  role?: string | null;
  uid?: string;
  displayName?: string | null;
  email?: string;
  phone?: string | null;
  providers?: string[];
  providerType?: string | null;
  createdAt?: string;
  lastSignInAt?: string | null;
  approvalStatus?: string | null;
  accountStatus?: string | null;
  updatedAt?: string | null;
  profilePicUrl?: string | null;
  status?: string | null;
  approval_status?: string | null;
  super_admin?: boolean | null;
  father_name?: string | null;
  gender?: string | null;
  pan_number?: string | null;
  aadhar_card_no?: string | null;
  date_of_birth?: string | null;
  date_of_joining?: string | null;
  in_hand_salary?: number | null;
  alternate_contact?: string | null;
  primary_address?: string | null;
  area_pincode?: string | null;
  bank_name?: string | null;
  account_holder_name?: string | null;
  account_number?: string | null;
  ifsc_code?: string | null;
  branch_pincode?: string | null;
  branch_state?: string | null;
  branch_city?: string | null;
  blood_group?: string | null;
  emergency_contact_no?: string | null;
  profile_pic_url?: string | null;
  pancard_url?: string | null;
  aadhar_front_url?: string | null;
  aadhar_back_url?: string | null;
  qualification_marksheet_url?: string | null;
  bank_passbook_url?: string | null;
  profile_complete?: boolean | null;
  created_at?: string | null;
  updated_at?: string | null;
  hold_start_date?: string | null;
  hold_end_date?: string | null;
  status_reason?: string | null;
  user_type?: string | null;
  work_type?: string | null;
  department?: string | null;
}

function UserProfilePage() {
  const router = useRouter();
  const { userId } = router.query;
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [userDetail, setUserDetail] = useState<UserDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeNav, setActiveNav] = useState("users");
  const [mounted, setMounted] = useState(false);
  const [activeCategory, setActiveCategory] = useState<"basic_info" | "personal_info" | "employment_info" | "address_info" | "kyc_info" | "bank_info" | "documents">("basic_info");
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editFormData, setEditFormData] = useState<any>({});

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!userId || typeof userId !== 'string') {
        setLoading(false);
        return;
      }

      try {
        // Check authentication
        const authResult = await checkAuthAndFetchProfile();
        
        if (authResult.shouldRedirect) {
          router.push("/login");
          return;
        }

        if (authResult.error) {
          setError(authResult.error);
          setTimeout(() => {
            router.push("/login");
          }, 2000);
          return;
        }

        if (authResult.user) {
          setCurrentUser(authResult.user);
        }

        // Fetch user profile details
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          setError("Not authenticated");
          setLoading(false);
          return;
        }

        // Fetch user profile by ID (using the id from user_profiles table)
        const { data: profileData, error: profileError } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', userId)
          .maybeSingle();

        if (profileError) {
          console.error('Error fetching user profile:', profileError);
          setError("Failed to load user profile");
          setLoading(false);
          return;
        }

        if (!profileData) {
          setError("User not found");
          setLoading(false);
          return;
        }

        // Map profile data to UserDetail
        const detail: UserDetail = {
          ...authResult.user,
          id: profileData.id,
          user_id: profileData.user_id,
          user_name: profileData.user_name,
          contact_no: profileData.contact_no,
          employee_id: profileData.employee_id,
          role: profileData.role,
          status: profileData.status,
          approval_status: profileData.approval_status,
          super_admin: profileData.super_admin,
          father_name: profileData.father_name,
          gender: profileData.gender,
          pan_number: profileData.pan_number,
          aadhar_card_no: profileData.aadhar_card_no,
          date_of_birth: profileData.date_of_birth,
          date_of_joining: profileData.date_of_joining,
          in_hand_salary: profileData.in_hand_salary,
          alternate_contact: profileData.alternate_contact,
          primary_address: profileData.primary_address,
          area_pincode: profileData.area_pincode,
          bank_name: profileData.bank_name,
          account_holder_name: profileData.account_holder_name,
          account_number: profileData.account_number,
          ifsc_code: profileData.ifsc_code,
          branch_pincode: profileData.branch_pincode,
          branch_state: profileData.branch_state,
          branch_city: profileData.branch_city,
          blood_group: profileData.blood_group,
          emergency_contact_no: profileData.emergency_contact_no,
          profile_pic_url: profileData.profile_pic_url,
          pancard_url: profileData.pancard_url,
          aadhar_front_url: profileData.aadhar_front_url,
          aadhar_back_url: profileData.aadhar_back_url,
          qualification_marksheet_url: profileData.qualification_marksheet_url,
          bank_passbook_url: profileData.bank_passbook_url,
          profile_complete: profileData.profile_complete,
          created_at: profileData.created_at,
          updated_at: profileData.updated_at,
          hold_start_date: profileData.hold_start_date,
          hold_end_date: profileData.hold_end_date,
          status_reason: profileData.status_reason,
          user_type: profileData.user_type,
          work_type: profileData.work_type,
          department: profileData.department,
          displayName: profileData.user_name || authResult.user?.displayName || null,
          email: profileData.email || authResult.user?.email || '',
          profilePicUrl: profileData.profile_pic_url || null,
        };

        setUserDetail(detail);
        // Initialize edit form data
        setEditFormData({
          email: profileData.email || "",
          user_name: profileData.user_name || "",
          contact_no: profileData.contact_no || "",
          employee_id: profileData.employee_id || "",
          role: profileData.role || "",
          father_name: profileData.father_name || "",
          gender: profileData.gender || "",
          date_of_birth: profileData.date_of_birth || "",
          blood_group: profileData.blood_group || "",
          alternate_contact: profileData.alternate_contact || "",
          emergency_contact_no: profileData.emergency_contact_no || "",
          date_of_joining: profileData.date_of_joining || "",
          in_hand_salary: profileData.in_hand_salary?.toString() || "",
          primary_address: profileData.primary_address || "",
          area_pincode: profileData.area_pincode || "",
          pan_number: profileData.pan_number || "",
          aadhar_card_no: profileData.aadhar_card_no || "",
          bank_name: profileData.bank_name || "",
          account_holder_name: profileData.account_holder_name || "",
          account_number: profileData.account_number || "",
          ifsc_code: profileData.ifsc_code || "",
          branch_city: profileData.branch_city || "",
          branch_state: profileData.branch_state || "",
          branch_pincode: profileData.branch_pincode || "",
          profile_pic_url: profileData.profile_pic_url || "",
          pancard_url: profileData.pancard_url || "",
          aadhar_front_url: profileData.aadhar_front_url || "",
          aadhar_back_url: profileData.aadhar_back_url || "",
          qualification_marksheet_url: profileData.qualification_marksheet_url || "",
          bank_passbook_url: profileData.bank_passbook_url || "",
        });
      } catch (err: any) {
        console.error('Error fetching user data:', err);
        setError(err.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    if (mounted && userId) {
      fetchData();
    }
  }, [userId, router, mounted]);

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'N/A';
    try {
      // Use fixed format to avoid hydration mismatches
      const date = new Date(dateString);
      const day = date.getDate();
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const month = monthNames[date.getMonth()];
      const year = date.getFullYear();
      return `${day} ${month} ${year}`;
    } catch (e) {
      return 'N/A';
    }
  };

  const getStatusBadge = (status: string | null) => {
    if (status === 'active') {
      return (
        <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-semibold">
          Active
        </span>
      );
    } else if (status === 'inactive') {
      return (
        <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-sm font-semibold">
          Inactive
        </span>
      );
    }
    return (
      <span className="px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-sm font-semibold">
        Pending
      </span>
    );
  };

  const getApprovalStatusBadge = (status: string | null) => {
    switch (status) {
      case 'approved':
        return <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-semibold">Approved</span>;
      case 'pending':
        return <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-sm font-semibold">Pending</span>;
      case 'hold':
        return <span className="px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-sm font-semibold">Hold</span>;
      case 'suspend':
        return <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 text-sm font-semibold">Suspended</span>;
      case 'rejected':
        return <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 text-sm font-semibold">Rejected</span>;
      default:
        return <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-sm font-semibold">Unknown</span>;
    }
  };

  const handleLogoutClick = async () => {
    const { handleLogout } = await import("../../lib/authService");
    await handleLogout(router);
  };

  const handleChangeAvatar = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (5MB for profile pictures)
    if (file.size > 5 * 1024 * 1024) {
      alert("File size must be less than 5MB");
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert("Please select an image file");
      return;
    }

    setUploadingAvatar(true);

    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session) {
        alert("Please log in to upload avatar");
        setUploadingAvatar(false);
        return;
      }

      // Create file path for profile picture
      const timestamp = Date.now();
      const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const filePath = `${session.user.id}/profile_pic/${timestamp}-${sanitizedFileName}`;

      // Upload file to Supabase Storage (use user-documents bucket or create profile-pics bucket)
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('user-documents')
        .upload(filePath, file, {
          contentType: file.type,
          upsert: true,
        });

      if (uploadError) {
        console.error("Upload error:", uploadError);
        alert(uploadError.message || "Failed to upload avatar");
        setUploadingAvatar(false);
        return;
      }

      // Get signed URL for the file (valid for 1 year)
      const { data: urlData, error: urlError } = await supabase.storage
        .from('user-documents')
        .createSignedUrl(filePath, 31536000); // 1 year expiry
      
      if (urlError || !urlData) {
        console.error("URL generation error:", urlError);
        alert("Avatar uploaded but failed to generate URL");
        setUploadingAvatar(false);
        return;
      }

      // Update profile_pic_url in user_profiles table
      const { error: updateError } = await supabase
        .from('user_profiles')
        .update({ profile_pic_url: urlData.signedUrl })
        .eq('id', userId);

      if (updateError) {
        console.error("Update error:", updateError);
        alert("Failed to update profile picture");
        setUploadingAvatar(false);
        return;
      }

      // Update local state
      setUserDetail(prev => prev ? { ...prev, profile_pic_url: urlData.signedUrl } : null);
      
      alert("Avatar updated successfully!");
      setUploadingAvatar(false);
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error: any) {
      console.error("Upload error:", error);
      alert(error.message || "Failed to upload avatar");
      setUploadingAvatar(false);
    }
  };

  const handleRemoveAvatar = async () => {
    if (!confirm("Are you sure you want to remove the avatar?")) {
      return;
    }

    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session) {
        alert("Please log in to remove avatar");
        return;
      }

      // Remove profile_pic_url from user_profiles table
      const { error: updateError } = await supabase
        .from('user_profiles')
        .update({ profile_pic_url: null })
        .eq('id', userId);

      if (updateError) {
        console.error("Update error:", updateError);
        alert("Failed to remove avatar");
        return;
      }

      // Update local state
      setUserDetail(prev => prev ? { ...prev, profile_pic_url: null } : null);
      
      alert("Avatar removed successfully!");
    } catch (error: any) {
      console.error("Remove error:", error);
      alert(error.message || "Failed to remove avatar");
    }
  };

  // Don't render anything until mounted and on client side to prevent hydration errors
  if (typeof window === 'undefined' || !mounted) {
    return null;
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ backgroundColor: "#f6f5f7" }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-transparent mx-auto mb-4" style={{ borderColor: '#4b33e8' }}></div>
          <div className="text-lg" style={{ color: "#4b33e8" }}>Loading user profile...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ backgroundColor: "#f6f5f7" }}>
        <div className="text-center">
          <div className="text-lg mb-4 text-red-500">{error}</div>
          <button
            onClick={() => router.push("/users")}
            className="px-6 py-2 bg-[#4b33e8] text-white rounded-lg hover:opacity-90"
          >
            Back to Users
          </button>
        </div>
      </div>
    );
  }

  if (!userDetail) {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ backgroundColor: "#f6f5f7" }}>
        <div className="text-center">
          <div className="text-lg mb-4 text-gray-600">User not found</div>
          <button
            onClick={() => router.push("/users")}
            className="px-6 py-2 bg-[#4b33e8] text-white rounded-lg hover:opacity-90"
          >
            Back to Users
          </button>
        </div>
      </div>
    );
  }

  // Ensure we're on client side before rendering
  if (typeof window === 'undefined') {
    return null;
  }

  return (
    <div className="flex min-h-screen w-full overflow-x-hidden" style={{ backgroundColor: "#f6f5f7", maxWidth: "100vw" }}>
      {/* Left Sidebar */}
      <Sidebar
        user={{
          displayName: currentUser?.displayName || userDetail?.user_name || null,
          email: currentUser?.email || userDetail?.email || "",
          employeeId: currentUser?.employeeId || userDetail?.employee_id || null,
          lastSignInAt: currentUser?.lastSignInAt || null,
          profilePicUrl: userDetail?.profile_pic_url || currentUser?.profilePicUrl || null,
        }}
        activeNav={activeNav}
        onNavChange={setActiveNav}
        userRole={currentUser?.role || null}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:ml-56 w-full min-w-0 overflow-x-hidden">
        {/* Top Header */}
        <Header
          user={{
            displayName: currentUser?.displayName || userDetail?.user_name || null,
            email: currentUser?.email || userDetail?.email || "",
            employeeId: currentUser?.employeeId || userDetail?.employee_id || null,
            profilePicUrl: userDetail?.profile_pic_url || currentUser?.profilePicUrl || null,
          }}
          onLogout={handleLogoutClick}
        />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden min-w-0 max-w-full pt-[60px] lg:pt-[60px]" style={{ backgroundColor: "#f6f5f7" }}>
          <div className="container mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 pb-20 sm:pb-24 lg:pb-6 max-w-7xl">
            {/* Back Button */}
            <button
              onClick={() => router.push("/users")}
              className="mb-4 flex items-center gap-2 text-gray-600 hover:text-[#4b33e8] transition-colors text-sm"
              style={{ fontFamily: "'Roboto', sans-serif" }}
            >
              <i className="fi flex fi-rr-arrow-left"></i>
              <span>User Profile</span>
            </button>

            <div className="flex flex-col lg:flex-row gap-4">
              {/* Category Panel - Sidebar (Fixed) */}
              <div className="w-full lg:w-56 flex-shrink-0">
                <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-3 lg:sticky overflow-x-auto">
                  <h3 className="text-xs font-semibold mb-3 hidden lg:block" style={{ color: "#263238", fontFamily: "'Poppins', sans-serif" }}>
                    Categories
                  </h3>
                  <div className="flex flex-row lg:flex-col gap-2 lg:space-y-0 lg:gap-0 lg:[&>*]:mb-1.5 lg:[&>*:last-child]:mb-0">
                    {[
                      { id: "basic_info", label: "Basic Details", icon: "fi-rr-user" },
                      { id: "personal_info", label: "Personal Info", icon: "fi-rr-user-gear" },
                      { id: "employment_info", label: "Employment", icon: "fi-rr-briefcase" },
                      { id: "address_info", label: "Address", icon: "fi-rr-map-marker" },
                      { id: "kyc_info", label: "KYC", icon: "fi-rr-shield-check" },
                      { id: "bank_info", label: "Bank Details", icon: "fi-rr-credit-card" },
                      { id: "documents", label: "Documents", icon: "fi-rr-file" },
                    ].map((category) => (
                      <button
                        key={category.id}
                        type="button"
                        onClick={() => setActiveCategory(category.id as any)}
                        className={`w-10 h-10 lg:w-full flex items-center justify-center lg:justify-start gap-2 lg:px-3 lg:py-2 rounded-lg text-xs font-medium transition-all flex-shrink-0 ${
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
                        <i className={`fi flex ${category.icon} text-sm`}></i>
                        <span className="hidden lg:inline">{category.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Main Profile Card */}
              <div className="flex-1 bg-white rounded-xl shadow-lg border border-gray-100 p-4 sm:p-6 relative">
                {/* Header with Edit and Copy All Icons */}
                <div className="flex items-center justify-between mb-4">
                  <h1 className="text-xl md:text-2xl font-bold" style={{ color: "#263238", fontFamily: "'Poppins', sans-serif" }}>
                    User Profile
                  </h1>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={async () => {
                        // Copy all field values
                        const allFields = {
                          "Full Name": userDetail.user_name || '',
                          "Email": userDetail.email || '',
                          "Contact Number": userDetail.contact_no || '',
                          "Employee ID": userDetail.employee_id || '',
                          "Role": userDetail.role || '',
                          "Department": userDetail.department || '',
                          "User Type": userDetail.user_type || '',
                          "Work Type": userDetail.work_type || '',
                          "Father's Name": userDetail.father_name || '',
                          "Gender": userDetail.gender || '',
                          "Date of Birth": userDetail.date_of_birth || '',
                          "Blood Group": userDetail.blood_group || '',
                          "Alternate Contact": userDetail.alternate_contact || '',
                          "Emergency Contact": userDetail.emergency_contact_no || '',
                          "Date of Joining": userDetail.date_of_joining || '',
                          "In Hand Salary": userDetail.in_hand_salary?.toString() || '',
                          "Primary Address": userDetail.primary_address || '',
                          "Area Pincode": userDetail.area_pincode || '',
                          "PAN Number": userDetail.pan_number || '',
                          "Aadhar Card Number": userDetail.aadhar_card_no || '',
                          "Bank Name": userDetail.bank_name || '',
                          "Account Holder Name": userDetail.account_holder_name || '',
                          "Account Number": userDetail.account_number || '',
                          "IFSC Code": userDetail.ifsc_code || '',
                          "Branch City": userDetail.branch_city || '',
                          "Branch State": userDetail.branch_state || '',
                          "Branch Pincode": userDetail.branch_pincode || '',
                        };

                        const textToCopy = Object.entries(allFields)
                          .filter(([_, value]) => value && value.toString().trim() !== '')
                          .map(([key, value]) => `${key}: ${value}`)
                          .join('\n');

                        if (!textToCopy) {
                          alert("No data to copy");
                          return;
                        }

                        try {
                          await navigator.clipboard.writeText(textToCopy);
                          alert("All field values copied to clipboard!");
                        } catch (err) {
                          // Fallback
                          const textArea = document.createElement('textarea');
                          textArea.value = textToCopy;
                          textArea.style.position = 'fixed';
                          textArea.style.opacity = '0';
                          document.body.appendChild(textArea);
                          textArea.select();
                          document.execCommand('copy');
                          document.body.removeChild(textArea);
                          alert("All field values copied to clipboard!");
                        }
                      }}
                      className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                      title="Copy all field values"
                    >
                      <i className="fi flex fi-rr-copy text-sm"></i>
                    </button>
                    <button
                      onClick={() => {
                        setIsEditMode(true);
                        // Initialize edit form data with current user data
                        setEditFormData({
                          email: userDetail.email || "",
                          user_name: userDetail.user_name || "",
                          contact_no: userDetail.contact_no || "",
                          employee_id: userDetail.employee_id || "",
                          role: userDetail.role || "",
                          father_name: userDetail.father_name || "",
                          gender: userDetail.gender || "",
                          date_of_birth: userDetail.date_of_birth || "",
                          blood_group: userDetail.blood_group || "",
                          alternate_contact: userDetail.alternate_contact || "",
                          emergency_contact_no: userDetail.emergency_contact_no || "",
                          date_of_joining: userDetail.date_of_joining || "",
                          in_hand_salary: userDetail.in_hand_salary?.toString() || "",
                          primary_address: userDetail.primary_address || "",
                          area_pincode: userDetail.area_pincode || "",
                          pan_number: userDetail.pan_number || "",
                          aadhar_card_no: userDetail.aadhar_card_no || "",
                          bank_name: userDetail.bank_name || "",
                          account_holder_name: userDetail.account_holder_name || "",
                          account_number: userDetail.account_number || "",
                          ifsc_code: userDetail.ifsc_code || "",
                          branch_city: userDetail.branch_city || "",
                          branch_state: userDetail.branch_state || "",
                          branch_pincode: userDetail.branch_pincode || "",
                          profile_pic_url: userDetail.profile_pic_url || "",
                          pancard_url: userDetail.pancard_url || "",
                          aadhar_front_url: userDetail.aadhar_front_url || "",
                          aadhar_back_url: userDetail.aadhar_back_url || "",
                          qualification_marksheet_url: userDetail.qualification_marksheet_url || "",
                          bank_passbook_url: userDetail.bank_passbook_url || "",
                        });
                      }}
                      className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#4b33e8] text-white hover:opacity-90 transition-colors"
                      title="Edit profile"
                    >
                      <i className="fi flex fi-rr-edit text-sm"></i>
                    </button>
                  </div>
                </div>

                {/* Avatar Section */}
                <div className="flex items-start gap-4 mb-4">
                  <div className="flex-shrink-0 relative">
                    {uploadingAvatar ? (
                      <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center border-2 border-gray-200">
                        <div className="animate-spin rounded-full h-6 w-6 border-2 border-t-transparent border-[#4b33e8]"></div>
                      </div>
                    ) : userDetail.profile_pic_url ? (
                      <img
                        src={userDetail.profile_pic_url}
                        alt={userDetail.user_name || 'User'}
                        className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold text-2xl border-2 border-gray-200">
                        {userDetail.user_name ? userDetail.user_name.charAt(0).toUpperCase() : 'U'}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2 items-start pt-1">
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/*"
                      onChange={handleAvatarFileSelect}
                      className="hidden"
                    />
                    <button
                      onClick={handleChangeAvatar}
                      disabled={uploadingAvatar}
                      className="w-8 h-8 flex items-center justify-center rounded-lg text-white transition-colors hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{ backgroundColor: "#4b33e8" }}
                      title="Change avatar"
                    >
                      <i className="fi flex fi-rr-camera text-sm"></i>
                    </button>
                    <button
                      onClick={handleRemoveAvatar}
                      disabled={uploadingAvatar || !userDetail.profile_pic_url}
                      className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 text-[#4b33e8] transition-colors hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Remove avatar"
                    >
                      <i className="fi flex fi-rr-trash text-sm"></i>
                    </button>
                  </div>
                </div>

                {/* Category Content */}
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold mb-2" style={{ color: "#263238", fontFamily: "'Poppins', sans-serif" }}>
                    {activeCategory === "basic_info" && "Basic Details"}
                    {activeCategory === "personal_info" && "Personal Information"}
                    {activeCategory === "employment_info" && "Employment Information"}
                    {activeCategory === "address_info" && "Address Information"}
                    {activeCategory === "kyc_info" && "KYC Information"}
                    {activeCategory === "bank_info" && "Bank Details"}
                    {activeCategory === "documents" && "Documents"}
                  </h3>

                  {/* Form Fields - Compact */}
                  <div className="[&>div]:space-y-1.5 [&_label]:text-xs [&_input]:h-8 [&_input]:text-xs [&_input]:px-2.5 [&_input]:py-1.5 [&_select]:h-8 [&_select]:text-xs [&_select]:px-2.5 [&_select]:py-1.5 [&_textarea]:text-xs [&_textarea]:px-2.5 [&_textarea]:py-1.5">
                    <SettingsFormFields
                      formData={isEditMode ? editFormData : {
                        email: userDetail.email || "",
                        user_name: userDetail.user_name || "",
                        contact_no: userDetail.contact_no || "",
                        employee_id: userDetail.employee_id || "",
                        role: userDetail.role || "",
                        father_name: userDetail.father_name || "",
                        gender: userDetail.gender || "",
                        date_of_birth: userDetail.date_of_birth || "",
                        blood_group: userDetail.blood_group || "",
                        alternate_contact: userDetail.alternate_contact || "",
                        emergency_contact_no: userDetail.emergency_contact_no || "",
                        date_of_joining: userDetail.date_of_joining || "",
                        in_hand_salary: userDetail.in_hand_salary?.toString() || "",
                        primary_address: userDetail.primary_address || "",
                        area_pincode: userDetail.area_pincode || "",
                        pan_number: userDetail.pan_number || "",
                        aadhar_card_no: userDetail.aadhar_card_no || "",
                        bank_name: userDetail.bank_name || "",
                        account_holder_name: userDetail.account_holder_name || "",
                        account_number: userDetail.account_number || "",
                        ifsc_code: userDetail.ifsc_code || "",
                        branch_city: userDetail.branch_city || "",
                        branch_state: userDetail.branch_state || "",
                        branch_pincode: userDetail.branch_pincode || "",
                        profile_pic_url: userDetail.profile_pic_url || "",
                        pancard_url: userDetail.pancard_url || "",
                        aadhar_front_url: userDetail.aadhar_front_url || "",
                        aadhar_back_url: userDetail.aadhar_back_url || "",
                        qualification_marksheet_url: userDetail.qualification_marksheet_url || "",
                        bank_passbook_url: userDetail.bank_passbook_url || "",
                      }}
                      handleInputChange={isEditMode ? (e) => {
                        const { id, value } = e.target;
                        setEditFormData((prev: any) => ({ ...prev, [id]: value }));
                      } : () => {}}
                      category={activeCategory}
                      readOnly={!isEditMode}
                    />
                  </div>
                </div>

                {/* Action Buttons - Only show in edit mode */}
                {isEditMode && (
                  <div className="flex justify-end gap-2 pt-4 mt-4 border-t border-gray-200">
                    <button
                      onClick={() => {
                        setIsEditMode(false);
                        // Reset form data to original values
                        setEditFormData({
                          email: userDetail.email || "",
                          user_name: userDetail.user_name || "",
                          contact_no: userDetail.contact_no || "",
                          employee_id: userDetail.employee_id || "",
                          role: userDetail.role || "",
                          father_name: userDetail.father_name || "",
                          gender: userDetail.gender || "",
                          date_of_birth: userDetail.date_of_birth || "",
                          blood_group: userDetail.blood_group || "",
                          alternate_contact: userDetail.alternate_contact || "",
                          emergency_contact_no: userDetail.emergency_contact_no || "",
                          date_of_joining: userDetail.date_of_joining || "",
                          in_hand_salary: userDetail.in_hand_salary?.toString() || "",
                          primary_address: userDetail.primary_address || "",
                          area_pincode: userDetail.area_pincode || "",
                          pan_number: userDetail.pan_number || "",
                          aadhar_card_no: userDetail.aadhar_card_no || "",
                          bank_name: userDetail.bank_name || "",
                          account_holder_name: userDetail.account_holder_name || "",
                          account_number: userDetail.account_number || "",
                          ifsc_code: userDetail.ifsc_code || "",
                          branch_city: userDetail.branch_city || "",
                          branch_state: userDetail.branch_state || "",
                          branch_pincode: userDetail.branch_pincode || "",
                          profile_pic_url: userDetail.profile_pic_url || "",
                          pancard_url: userDetail.pancard_url || "",
                          aadhar_front_url: userDetail.aadhar_front_url || "",
                          aadhar_back_url: userDetail.aadhar_back_url || "",
                          qualification_marksheet_url: userDetail.qualification_marksheet_url || "",
                          bank_passbook_url: userDetail.bank_passbook_url || "",
                        });
                      }}
                      className="px-4 py-2 rounded-lg bg-gray-100 text-[#4b33e8] font-medium text-sm transition-colors hover:bg-gray-200"
                      style={{ fontFamily: "'Poppins', sans-serif" }}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={async () => {
                        try {
                          const { data: { session } } = await supabase.auth.getSession();
                          if (!session) {
                            alert("Please log in to save changes");
                            return;
                          }

                          // Use admin endpoint to update the target user's profile (not current user)
                          const response = await fetch("/api/auth/update-user-profile", {
                            method: "PUT",
                            headers: {
                              "Content-Type": "application/json",
                              Authorization: `Bearer ${session.access_token}`,
                            },
                            body: JSON.stringify({
                              targetUserId: userId, // This is the id from user_profiles table
                              ...editFormData,
                            }),
                          });

                          const data = await response.json();

                          if (!response.ok) {
                            alert(data.error || "Failed to save changes");
                            return;
                          }

                          alert("Profile updated successfully!");
                          setIsEditMode(false);
                          
                          // Refresh user data using id (primary key), not user_id
                          const { data: updatedProfile } = await supabase
                            .from('user_profiles')
                            .select('*')
                            .eq('id', userId)
                            .maybeSingle();

                          if (updatedProfile) {
                            setUserDetail((prev: any) => prev ? {
                              ...prev,
                              ...updatedProfile,
                              displayName: updatedProfile.user_name || prev.displayName,
                              email: updatedProfile.email || prev.email,
                              profile_pic_url: updatedProfile.profile_pic_url,
                              profilePicUrl: updatedProfile.profile_pic_url,
                            } : null);
                          }
                        } catch (error: any) {
                          console.error('Error saving profile:', error);
                          alert(error.message || "An error occurred while saving");
                        }
                      }}
                      className="px-4 py-2 rounded-lg text-white font-medium text-sm transition-colors hover:opacity-90"
                      style={{ backgroundColor: "#4b33e8", fontFamily: "'Poppins', sans-serif" }}
                    >
                      Save
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Bottom Navigation - Mobile Only */}
      <BottomNav activeNav="profile" />
    </div>
  );
}

// Disable SSR to prevent hydration errors
const DynamicUserProfilePage = dynamic(() => Promise.resolve(UserProfilePage), { 
  ssr: false,
  loading: () => (
    <div className="flex min-h-screen items-center justify-center" style={{ backgroundColor: "#f6f5f7" }}>
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-transparent mx-auto mb-4" style={{ borderColor: '#4b33e8' }}></div>
        <div className="text-lg" style={{ color: "#4b33e8" }}>Loading...</div>
      </div>
    </div>
  )
});

export default DynamicUserProfilePage;
