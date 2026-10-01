import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { supabase } from "@/lib/supabase";
import { useUser } from "@/components/AppLayout";
import UserMenuDropdown from "@/components/UserMenuDropdown";
import AccountIssueModal from "@/components/modals/AccountIssueModal";

// Dynamically import component to prevent hydration errors
const SettingsFormFields = dynamic(() => import("@/components/SettingsFormFields"), { ssr: false });

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
  // Client Lifecycle
  is_client?: boolean | null;
  joined_at?: string | null;
  renewal_at?: string | null;
  expire_at?: string | null;
  is_caller?: boolean | null;
  designation?: string | null;
}

type CallingProviderName = "sim" | "smartflo";

export interface SmartfloDetail {
  id: string;
  smartflo_agent_id: string;
  agent_name: string | null;
  caller_id: string | null;
  extension: string | null;
  intercom: string | null;
  user_id: string | null;
  is_mapped: boolean;
}

interface AgentCallingProviderState {
  organization: {
    sim: { enable: boolean };
    smartflo: { enable: boolean };
  };
  user: {
    sim: { enable: boolean; in_use: boolean };
    smartflo: {
      enable: boolean;
      in_use: boolean;
      agent_id?: string | null;
      is_mapped?: boolean;
    };
  };
  smartflo_details?: SmartfloDetail[];
}

function UserProfilePage() {
    const router = useRouter();
    const { userId } = router.query;
    const { user: currentUser, mounted: userMounted, loading: authLoading } = useUser();

    const isCeo = currentUser?.designation?.toLowerCase() === 'ceo';
    // Internal team requires ALL 3 conditions to match simultaneously:
    // 1. is_client === false (Non-Client)
    // 2. organization_id === null / empty (No client organization assigned)
    // 3. super_admin === true (or role === 'super admin')
    const isInternalTeam = Boolean(
      currentUser?.isClient === false &&
      (!currentUser?.organization_id || currentUser?.organization_id === null) &&
      (currentUser?.super_admin === true || currentUser?.role?.toLowerCase() === 'super admin')
    );

    const isInternalOrCeo = Boolean(isCeo || isInternalTeam);

    const [userDetail, setUserDetail] = useState<UserDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [mounted, setMounted] = useState(false);
    const [activeCategory, setActiveCategory] = useState<"basic_info" | "personal_info" | "employment_info" | "client_lifecycle" | "address_info" | "kyc_info" | "bank_info" | "documents" | "security">("basic_info");
    const [uploadingAvatar, setUploadingAvatar] = useState(false);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editFormData, setEditFormData] = useState<any>({});
    
    // Security Tab States
    const [securityStatus, setSecurityStatus] = useState<"active" | "inactive">("active");
    const [securityIsCaller, setSecurityIsCaller] = useState<boolean>(false);
    const [securityRole, setSecurityRole] = useState<"user" | "admin" | "super admin">("user");
    const [securityDesignation, setSecurityDesignation] = useState<string>("agent");
    const [securityUserName, setSecurityUserName] = useState<string>("");
    const [securityEmail, setSecurityEmail] = useState<string>("");
    const [securityPassword, setSecurityPassword] = useState<string>("");
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [savingSecurity, setSavingSecurity] = useState<boolean>(false);
    const [deletingUser, setDeletingUser] = useState<boolean>(false);
    const [agentProviderState, setAgentProviderState] = useState<AgentCallingProviderState | null>(null);
    const [loadingAgentProviders, setLoadingAgentProviders] = useState(false);
    const [savingAgentProvider, setSavingAgentProvider] = useState(false);
    const [agentProviderError, setAgentProviderError] = useState("");
    const [showSmartfloDidModal, setShowSmartfloDidModal] = useState<boolean>(false);
    const [selectedSmartfloAgentId, setSelectedSmartfloAgentId] = useState<string>("");
    const [assigningSmartfloDid, setAssigningSmartfloDid] = useState<boolean>(false);
    const [assignSmartfloError, setAssignSmartfloError] = useState<string>("");
    const [assignSmartfloSuccess, setAssignSmartfloSuccess] = useState<string>("");
    const [isCustomDropdownOpen, setIsCustomDropdownOpen] = useState<boolean>(false);
    const [dropdownSearchTerm, setDropdownSearchTerm] = useState<string>("");
    const customDropdownRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
      if (!isCustomDropdownOpen) return;
      const handleClickOutside = (e: MouseEvent) => {
        if (customDropdownRef.current && !customDropdownRef.current.contains(e.target as Node)) {
          setIsCustomDropdownOpen(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isCustomDropdownOpen]);

    const [accountModal, setAccountModal] = useState<{
      isOpen: boolean;
      type: 'session_expired' | 'account_expired' | 'account_issue';
      title?: string;
      message?: string;
      rootCause?: string;
    }>({
      isOpen: false,
      type: 'account_issue',
    });

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            if (!userId || typeof userId !== 'string' || !userMounted || !currentUser) {
                if (userMounted && !currentUser && !authLoading) {
                    router.push("/login");
                }
                setLoading(false);
                return;
            }

            try {
                // Fetch user profile details
                const { data: { session } } = await supabase.auth.getSession();
                if (!session) {
                    setError("Not authenticated");
                    setLoading(false);
                    return;
                }

        // Fetch user profile by ID
        // Try both PK 'id' and Auth UUID 'user_id' for maximum robustness
        console.log("Searching user profile for ID:", userId);
        const { data: profileByRowId, error: rowError } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', userId)
          .maybeSingle();

        let profileData = profileByRowId;
        
        if (!profileData && !rowError) {
           console.log("Not found by Row ID, searching by User UUID...");
           const { data: profileByUserId, error: userError } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('user_id', userId)
            .maybeSingle();
           profileData = profileByUserId;
        }

        if (rowError || !profileData) {
          const actualError = rowError || (profileData ? null : "User not found in database");
          if (actualError) {
            console.error('Error fetching user profile:', actualError);
            setError(typeof actualError === 'string' ? actualError : "Failed to load user profile");
            setLoading(false);
            return;
          }
        }

        if (!profileData) {
          setError("User not found");
          setLoading(false);
          return;
        }

        // Map profile data to UserDetail
        const detail: UserDetail = {
          ...currentUser,
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
          displayName: profileData.user_name || currentUser?.displayName || null,
          email: profileData.email || currentUser?.email || '',
          profilePicUrl: profileData.profile_pic_url || null,
          is_client: profileData.is_client,
          is_caller: profileData.is_caller,
          designation: profileData.designation,
          joined_at: profileData.joined_at,
          renewal_at: profileData.renewal_at,
          expire_at: profileData.expire_at,
        };

        setUserDetail(detail);

        // Populate Security Form States
        setSecurityStatus(profileData.status === "inactive" ? "inactive" : "active");
        setSecurityIsCaller(profileData.is_caller === true);
        setSecurityRole(profileData.super_admin ? "super admin" : (profileData.role === "admin" ? "admin" : (profileData.role === "super admin" ? "super admin" : "user")));
        setSecurityDesignation(profileData.designation || "agent");
        setSecurityUserName(profileData.user_name || "");
        setSecurityEmail(profileData.email || "");
        setSecurityPassword("");

        if (isInternalOrCeo && profileData.user_id) {
          setLoadingAgentProviders(true);
          try {
            const providerResponse = await fetch(
              `/api/calling/provider/agent?targetUserId=${encodeURIComponent(profileData.user_id)}`,
              { headers: { Authorization: `Bearer ${session.access_token}` } }
            );
            const providerResult = await providerResponse.json();
            if (!providerResponse.ok) {
              throw new Error(providerResult.message || "Unable to load calling provider settings");
            }
            setAgentProviderState(providerResult.data);
            setAgentProviderError("");
          } catch (providerError) {
            setAgentProviderError(providerError instanceof Error ? providerError.message : "Unable to load calling provider settings");
          } finally {
            setLoadingAgentProviders(false);
          }
        }

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
          // Client Lifecycle: Default is_client to true unless explicitly false
          is_client: profileData.is_client !== false ? "true" : "false",
          joined_at: profileData.joined_at ? profileData.joined_at.split('T')[0] : "",
          renewal_at: profileData.renewal_at ? profileData.renewal_at.split('T')[0] : "",
          expire_at: profileData.expire_at ? profileData.expire_at.split('T')[0] : "",
        });
            } finally {
                setLoading(false);
            }
        };

        if (mounted && userId && !authLoading) {
            fetchData();
        }
    }, [userId, router, router.isReady, mounted, userMounted, currentUser, isInternalOrCeo, authLoading]);

  useEffect(() => {
    const handleCallingProviderUpdated = (event: Event) => {
      const detail = (event as CustomEvent<{
        userId?: string;
        state?: AgentCallingProviderState;
      }>).detail;

      if (!detail?.state || detail.userId !== userDetail?.user_id) return;
      setAgentProviderState(detail.state);
      setAgentProviderError("");
    };

    window.addEventListener("calling-provider-updated", handleCallingProviderUpdated);
    return () => window.removeEventListener("calling-provider-updated", handleCallingProviderUpdated);
  }, [userDetail?.user_id]);

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
    const { handleLogout } = await import("@/lib/authService");
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

  // Security Save Handler
  const handleSaveSecurity = async () => {
    try {
      setSavingSecurity(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        alert("Please log in to update security settings");
        return;
      }

      if (securityPassword && securityPassword.trim().length < 6) {
        alert("Password must be at least 6 characters long");
        return;
      }

      const payload = {
        targetUserId: userId, // user_profiles.id
        status: securityStatus,
        is_caller: securityIsCaller,
        role: securityRole,
        designation: securityDesignation,
        user_name: securityUserName,
        email: securityEmail,
        ...(securityPassword && securityPassword.trim() ? { password: securityPassword.trim() } : {}),
      };

      const response = await fetch("/api/auth/admin-update-security", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok || data.error) {
        alert(data.error || "Failed to update security settings");
        return;
      }

      alert("Security settings updated successfully!");
      setSecurityPassword(""); // Clear password field after save

      // Refresh user profile
      const { data: updatedProfile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (updatedProfile) {
        setUserDetail((prev: any) => prev ? {
          ...prev,
          ...updatedProfile,
          status: updatedProfile.status,
          is_caller: updatedProfile.is_caller,
          role: updatedProfile.role,
          super_admin: updatedProfile.super_admin,
          designation: updatedProfile.designation,
          user_name: updatedProfile.user_name,
          displayName: updatedProfile.user_name,
          email: updatedProfile.email,
        } : null);
      }
    } catch (err: any) {
      console.error("Error updating security settings:", err);
      alert(err.message || "An error occurred while updating security settings");
    } finally {
      setSavingSecurity(false);
    }
  };

  const handleAgentProviderChange = async (
    provider: CallingProviderName,
    field: "enable" | "in_use",
    value: boolean
  ) => {
    if (!userDetail?.user_id || savingAgentProvider) return;

    try {
      setSavingAgentProvider(true);
      setAgentProviderError("");
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Please sign in again to update provider settings");

      const response = await fetch("/api/calling/provider/agent", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          targetUserId: userDetail.user_id,
          provider,
          [field]: value,
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Unable to update provider settings");

      setAgentProviderState(result.data);
    } catch (providerError) {
      setAgentProviderError(providerError instanceof Error ? providerError.message : "Unable to update provider settings");
    } finally {
      setSavingAgentProvider(false);
    }
  };

  const handleAssignSmartfloDid = async (agentIdToAssign: string) => {
    if (!userDetail?.user_id || assigningSmartfloDid) return;
    if (!agentIdToAssign) {
      setAssignSmartfloError("Please select a Smartflo DID / agent from the dropdown.");
      return;
    }

    try {
      setAssigningSmartfloDid(true);
      setAssignSmartfloError("");
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Please sign in again to assign Smartflo DID");

      const response = await fetch("/api/calling/provider/agent", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          targetUserId: userDetail.user_id,
          action: "assign_smartflo_did",
          smartfloAgentId: agentIdToAssign,
        }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Failed to assign Smartflo DID");

      setAgentProviderState(result.data);
      setShowSmartfloDidModal(false);
      setAssignSmartfloSuccess("Smartflo DID assigned and enabled successfully!");
      setTimeout(() => setAssignSmartfloSuccess(""), 4000);
    } catch (err: any) {
      setAssignSmartfloError(err.message || "Unable to assign Smartflo DID");
    } finally {
      setAssigningSmartfloDid(false);
    }
  };

  // User Deletion Handler
  const handleDeleteUserAccount = async () => {
    const confirmDelete = window.confirm(
      `Are you sure you want to permanently delete user "${userDetail?.user_name || userDetail?.email || 'this user'}"?\n\nThis will remove their profile, delete login credentials from auth, and clear team & call assignments. This action CANNOT be undone!`
    );
    if (!confirmDelete) return;

    try {
      setDeletingUser(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        alert("Please log in to delete this user");
        return;
      }

      const response = await fetch(`/api/auth/delete-user?userId=${userId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      const data = await response.json();
      if (!response.ok || data.error) {
        alert(data.error || "Failed to delete user");
        return;
      }

      alert("User deleted successfully!");
      router.push("/users");
    } catch (err: any) {
      console.error("Error deleting user:", err);
      alert(err.message || "An error occurred while deleting user");
    } finally {
      setDeletingUser(false);
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
                                { id: "client_lifecycle", label: "Lifecycle", icon: "fi-rr-calendar-check" },
                                { id: "address_info", label: "Address", icon: "fi-rr-map-marker" },
                                { id: "kyc_info", label: "KYC", icon: "fi-rr-shield-check" },
                                { id: "bank_info", label: "Bank Details", icon: "fi-rr-credit-card" },
                                { id: "documents", label: "Documents", icon: "fi-rr-file" },
                                ...(isInternalOrCeo ? [{ id: "security", label: "Security", icon: "fi-rr-lock" }] : []),
                            ].map((category) => (
                                <button
                                    key={category.id}
                                    type="button"
                                    onClick={() => setActiveCategory(category.id as any)}
                                    className={`w-10 h-10 lg:w-full flex items-center justify-center lg:justify-start gap-2 lg:px-3 lg:py-2 rounded-lg text-xs font-medium transition-all flex-shrink-0 ${activeCategory === category.id
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
                            {activeCategory !== "security" && (
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
                                          // Client Lifecycle
                                          is_client: userDetail.is_client !== undefined ? String(userDetail.is_client) : "false",
                                          joined_at: userDetail.joined_at ? userDetail.joined_at.split('T')[0] : "",
                                          renewal_at: userDetail.renewal_at ? userDetail.renewal_at.split('T')[0] : "",
                                          expire_at: userDetail.expire_at ? userDetail.expire_at.split('T')[0] : "",
                                      });
                                  }}
                                  className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#4b33e8] text-white hover:opacity-90 transition-colors"
                                  title="Edit profile"
                              >
                                  <i className="fi flex fi-rr-edit text-sm"></i>
                              </button>
                            )}
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
                            {activeCategory === "client_lifecycle" && "Lifecycle & Status"}
                            {activeCategory === "address_info" && "Address Information"}
                            {activeCategory === "kyc_info" && "KYC Information"}
                            {activeCategory === "bank_info" && "Bank Details"}
                            {activeCategory === "documents" && "Documents"}
                            {activeCategory === "security" && "Security & Access Controls"}
                        </h3>

                        {activeCategory === "security" ? (
                          <div className="space-y-5 pt-2">
                            {/* Row 1: Account Status & Calling Privileges */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {/* Active / Inactive Status */}
                              <div className="bg-gray-50/80 p-4 rounded-xl border border-gray-200">
                                <label className="text-xs font-bold text-gray-700 block mb-1">
                                  Account Status (Active / Inactive)
                                </label>
                                <p className="text-[11px] text-gray-500 mb-3">
                                  Setting inactive instantly terminates access and blocks future login attempts.
                                </p>
                                <div className="grid grid-cols-2 gap-2">
                                  <button
                                    type="button"
                                    onClick={() => setSecurityStatus("active")}
                                    className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 border transition-all ${
                                      securityStatus === "active"
                                        ? "bg-emerald-50 border-emerald-500 text-emerald-700 shadow-sm"
                                        : "bg-white border-gray-200 text-gray-600 hover:bg-gray-100"
                                    }`}
                                  >
                                    <span className={`w-2 h-2 rounded-full ${securityStatus === "active" ? "bg-emerald-500" : "bg-gray-300"}`}></span>
                                    Active
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setSecurityStatus("inactive")}
                                    className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 border transition-all ${
                                      securityStatus === "inactive"
                                        ? "bg-red-50 border-red-500 text-red-700 shadow-sm"
                                        : "bg-white border-gray-200 text-gray-600 hover:bg-gray-100"
                                    }`}
                                  >
                                    <span className={`w-2 h-2 rounded-full ${securityStatus === "inactive" ? "bg-red-500" : "bg-gray-300"}`}></span>
                                    Inactive
                                  </button>
                                </div>
                              </div>

                              {/* Is Caller Toggle */}
                              <div className="bg-gray-50/80 p-4 rounded-xl border border-gray-200">
                                <label className="text-xs font-bold text-gray-700 block mb-1">
                                  Calling Privileges (Is Caller)
                                </label>
                                <p className="text-[11px] text-gray-500 mb-3">
                                  Controls whether this user can make calls, receive lead assignments, and use the dialer.
                                </p>
                                <div className="grid grid-cols-2 gap-2">
                                  <button
                                    type="button"
                                    onClick={() => setSecurityIsCaller(true)}
                                    className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 border transition-all ${
                                      securityIsCaller
                                        ? "bg-blue-50 border-blue-500 text-blue-700 shadow-sm"
                                        : "bg-white border-gray-200 text-gray-600 hover:bg-gray-100"
                                    }`}
                                  >
                                    <i className="fi flex fi-rr-phone-call text-xs"></i>
                                    Yes (Caller)
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setSecurityIsCaller(false)}
                                    className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 border transition-all ${
                                      !securityIsCaller
                                        ? "bg-gray-200 border-gray-400 text-gray-800 shadow-sm"
                                        : "bg-white border-gray-200 text-gray-600 hover:bg-gray-100"
                                    }`}
                                  >
                                    <i className="fi flex fi-rr-cross-circle text-xs"></i>
                                    No (Non-Caller)
                                  </button>
                                </div>
                              </div>
                            </div>

                            {/* Calling Provider Configuration */}
                            <div className="rounded-xl border border-gray-200 bg-white p-4">
                              <div className="mb-4 border-b border-gray-100 pb-3">
                                <h4 className="flex items-center gap-2 text-xs font-bold text-gray-800">
                                  <i className="fi fi-rr-headset text-[#4b33e8]" aria-hidden="true" />
                                  Calling Providers
                                </h4>
                                <p className="mt-1 text-[11px] text-gray-500">
                                  Set this agent’s provider access and selection. Smartflo call initiation is not enabled by this setting.
                                </p>
                              </div>

                              {agentProviderError && (
                                <p className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700" role="alert">
                                  {agentProviderError}
                                </p>
                              )}

                              {assignSmartfloSuccess && (
                                <p className="mb-3 rounded-lg bg-emerald-50 px-3 py-2 text-xs text-emerald-700 flex items-center gap-1.5" role="alert">
                                  <i className="fi fi-rr-check text-xs" />
                                  <span>{assignSmartfloSuccess}</span>
                                </p>
                              )}

                              {loadingAgentProviders || !agentProviderState ? (
                                <div className="flex items-center gap-2 py-3 text-xs text-gray-500" aria-live="polite">
                                  {loadingAgentProviders ? (
                                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#4b33e8] border-t-transparent" aria-hidden="true" />
                                  ) : null}
                                  {loadingAgentProviders ? "Loading provider settings..." : "Provider settings unavailable"}
                                </div>
                              ) : (
                                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                                  {(["sim", "smartflo"] as const).map((provider) => {
                                    const providerConfig = agentProviderState.user[provider];
                                    const organizationEnabled = agentProviderState.organization[provider].enable;
                                    const providerLabel = provider === "sim" ? "SIM" : "Smartflo";

                                    return (
                                      <div key={provider} className="rounded-lg border border-gray-200 bg-gray-50/70 p-3">
                                        <div className="mb-3 flex items-center justify-between gap-2">
                                          <h5 className="text-xs font-bold text-gray-800">{providerLabel}</h5>
                                          <span className={`text-[10px] font-semibold ${organizationEnabled ? "text-emerald-700" : "text-gray-500"}`}>
                                            {organizationEnabled ? "Organization enabled" : "Organization disabled"}
                                          </span>
                                        </div>

                                        <div className="space-y-3">
                                          <div className="flex items-center justify-between gap-3">
                                            <span className="text-xs text-gray-700">Enabled for agent</span>
                                            <button
                                              type="button"
                                              role="switch"
                                              aria-checked={providerConfig.enable}
                                              aria-label={`${providerConfig.enable ? "Disable" : "Enable"} ${providerLabel} for this agent`}
                                              disabled={savingAgentProvider || assigningSmartfloDid}
                                              onClick={() => {
                                                if (provider === "smartflo") {
                                                  if (!providerConfig.enable || !(providerConfig as any).is_mapped) {
                                                    setAssignSmartfloError("");
                                                    setSelectedSmartfloAgentId((providerConfig as any).agent_id || "");
                                                    setShowSmartfloDidModal(true);
                                                  } else {
                                                    void handleAgentProviderChange(provider, "enable", false);
                                                  }
                                                } else {
                                                  void handleAgentProviderChange(provider, "enable", !providerConfig.enable);
                                                }
                                              }}
                                              className={`flex h-6 w-11 shrink-0 items-center rounded-full border p-0.5 transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
                                                providerConfig.enable ? "justify-end border-emerald-600 bg-emerald-600" : "justify-start border-gray-300 bg-gray-200"
                                              }`}
                                            >
                                              <span className="h-4 w-4 rounded-full bg-white shadow-sm" />
                                            </button>
                                          </div>

                                          {provider === "smartflo" && (
                                            <div className="flex items-center justify-between rounded-lg border border-purple-100 bg-purple-50/60 px-2.5 py-1.5 text-[11px]">
                                              <span className="text-gray-600 truncate">
                                                DID: <strong className="font-mono text-purple-900">{(providerConfig as any).agent_id || "Not assigned"}</strong>
                                              </span>
                                              <button
                                                type="button"
                                                onClick={() => {
                                                  setAssignSmartfloError("");
                                                  setSelectedSmartfloAgentId((providerConfig as any).agent_id || "");
                                                  setShowSmartfloDidModal(true);
                                                }}
                                                className="text-[#4b33e8] hover:text-[#3d27cf] font-semibold text-[10px] underline ml-2"
                                              >
                                                {(providerConfig as any).agent_id ? "Change" : "Assign"}
                                              </button>
                                            </div>
                                          )}

                                          <div className="flex items-center justify-between gap-3 border-t border-gray-200 pt-3">
                                            <span className="text-xs text-gray-700">In use</span>
                                            <button
                                              type="button"
                                              role="switch"
                                              aria-checked={providerConfig.in_use}
                                              aria-label={`${providerConfig.in_use ? "Stop using" : "Use"} ${providerLabel} for calls`}
                                              disabled={savingAgentProvider || (!providerConfig.in_use && (!organizationEnabled || !providerConfig.enable))}
                                              onClick={() => void handleAgentProviderChange(provider, "in_use", !providerConfig.in_use)}
                                              className={`flex h-6 w-11 shrink-0 items-center rounded-full border p-0.5 transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
                                                providerConfig.in_use ? "justify-end border-[#4b33e8] bg-[#4b33e8]" : "justify-start border-gray-300 bg-gray-200"
                                              }`}
                                            >
                                              <span className="h-4 w-4 rounded-full bg-white shadow-sm" />
                                            </button>
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                            </div>

                            {/* Row 2: Role & Designation */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {/* System Role */}
                              <div className="bg-gray-50/80 p-4 rounded-xl border border-gray-200">
                                <label className="text-xs font-bold text-gray-700 block mb-1">
                                  System Role (User / Admin / Super Admin)
                                </label>
                                <p className="text-[11px] text-gray-500 mb-3">
                                  Determines overall permissions and administration dashboard access.
                                </p>
                                <div className="grid grid-cols-3 gap-2">
                                  {(["user", "admin", "super admin"] as const).map((r) => (
                                    <button
                                      key={r}
                                      type="button"
                                      onClick={() => setSecurityRole(r)}
                                      className={`py-2 px-2 rounded-lg text-xs font-semibold capitalize border transition-all ${
                                        securityRole === r
                                          ? "bg-[#4b33e8] border-[#4b33e8] text-white shadow-sm"
                                          : "bg-white border-gray-200 text-gray-700 hover:bg-gray-100"
                                      }`}
                                    >
                                      {r}
                                    </button>
                                  ))}
                                </div>
                              </div>

                              {/* Designation Hierarchy */}
                              <div className="bg-gray-50/80 p-4 rounded-xl border border-gray-200">
                                <label className="text-xs font-bold text-gray-700 block mb-1">
                                  Designation (Agent / TL / CEO)
                                </label>
                                <p className="text-[11px] text-gray-500 mb-3">
                                  Select common designation or specify custom title below.
                                </p>
                                <div className="grid grid-cols-3 gap-2 mb-2">
                                  {["agent", "tl", "ceo"].map((d) => (
                                    <button
                                      key={d}
                                      type="button"
                                      onClick={() => setSecurityDesignation(d)}
                                      className={`py-2 px-2 rounded-lg text-xs font-semibold uppercase border transition-all ${
                                        securityDesignation?.toLowerCase() === d
                                          ? "bg-[#4b33e8] border-[#4b33e8] text-white shadow-sm"
                                          : "bg-white border-gray-200 text-gray-700 hover:bg-gray-100"
                                      }`}
                                    >
                                      {d === "tl" ? "Team Leader (TL)" : d}
                                    </button>
                                  ))}
                                </div>
                                <input
                                  type="text"
                                  value={securityDesignation}
                                  onChange={(e) => setSecurityDesignation(e.target.value)}
                                  placeholder="Or type custom designation"
                                  className="w-full h-8 px-2.5 py-1 text-xs text-black font-medium bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#4b33e8] placeholder:text-gray-400"
                                  style={{ color: "#000000" }}
                                />
                              </div>
                            </div>

                            {/* Row 3: Credentials & Profile Synchronization */}
                            <div className="bg-gray-50/80 p-4 rounded-xl border border-gray-200 space-y-4">
                              <div className="border-b border-gray-200 pb-2">
                                <h5 className="text-xs font-bold text-gray-800" style={{ fontFamily: "'Poppins', sans-serif" }}>
                                  Credentials & Auth Synchronization
                                </h5>
                                <p className="text-[11px] text-gray-500">
                                  Changes immediately synchronize with Supabase <code className="text-[#4b33e8] bg-purple-50 px-1 py-0.5 rounded">auth.users</code> and <code className="text-[#4b33e8] bg-purple-50 px-1 py-0.5 rounded">user_profiles</code>.
                                </p>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                  <label className="text-xs font-medium text-gray-700 block mb-1">
                                    Full Name (Updates Auth & Profile)
                                  </label>
                                  <input
                                    type="text"
                                    value={securityUserName}
                                    onChange={(e) => setSecurityUserName(e.target.value)}
                                    className="w-full h-8 px-2.5 py-1 text-xs text-black font-medium bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#4b33e8] placeholder:text-gray-400"
                                    style={{ color: "#000000" }}
                                    placeholder="Enter full name"
                                  />
                                </div>

                                <div>
                                  <label className="text-xs font-medium text-gray-700 block mb-1">
                                    Email Address (Updates Auth & Profile)
                                  </label>
                                  <input
                                    type="email"
                                    value={securityEmail}
                                    onChange={(e) => setSecurityEmail(e.target.value)}
                                    className="w-full h-8 px-2.5 py-1 text-xs text-black font-medium bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#4b33e8] placeholder:text-gray-400"
                                    style={{ color: "#000000" }}
                                    placeholder="Enter user email"
                                  />
                                </div>
                              </div>

                              <div>
                                <label className="text-xs font-medium text-gray-700 block mb-1">
                                  Set New Password (Directly updates Auth Table)
                                </label>
                                <div className="relative max-w-md">
                                  <input
                                    type={showPassword ? "text" : "password"}
                                    value={securityPassword}
                                    onChange={(e) => setSecurityPassword(e.target.value)}
                                    className="w-full h-8 pl-2.5 pr-8 py-1 text-xs text-black font-medium bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#4b33e8] placeholder:text-gray-400"
                                    style={{ color: "#000000" }}
                                    placeholder="Enter new password (min. 6 chars)"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs"
                                  >
                                    <i className={`fi flex ${showPassword ? "fi-rr-eye-crossed" : "fi-rr-eye"}`}></i>
                                  </button>
                                </div>
                                <p className="text-[10px] text-gray-400 mt-1">
                                  Leave blank if you do not want to change the user's password.
                                </p>
                              </div>

                              <div className="pt-2 flex justify-end">
                                <button
                                  type="button"
                                  onClick={handleSaveSecurity}
                                  disabled={savingSecurity}
                                  className="px-5 py-2 rounded-lg bg-[#4b33e8] text-white text-xs font-semibold hover:opacity-90 transition-all flex items-center gap-2 disabled:opacity-50"
                                  style={{ fontFamily: "'Poppins', sans-serif" }}
                                >
                                  {savingSecurity ? (
                                    <>
                                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                      <span>Saving Security Updates...</span>
                                    </>
                                  ) : (
                                    <>
                                      <i className="fi flex fi-rr-check"></i>
                                      <span>Save Security Settings</span>
                                    </>
                                  )}
                                </button>
                              </div>
                            </div>

                            {/* Row 4: Danger Zone (Delete User) */}
                            <div className="bg-red-50/70 p-4 rounded-xl border border-red-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                              <div>
                                <h5 className="text-xs font-bold text-red-700 flex items-center gap-1.5" style={{ fontFamily: "'Poppins', sans-serif" }}>
                                  <i className="fi flex fi-rr-trash text-sm"></i>
                                  Danger Zone: Delete User Account
                                </h5>
                                <p className="text-[11px] text-red-600 mt-0.5">
                                  Permanently deletes this user, removing auth login credentials, team assignments, and profile data.
                                </p>
                              </div>
                              <button
                                type="button"
                                onClick={handleDeleteUserAccount}
                                disabled={deletingUser}
                                className="px-4 py-2 rounded-lg bg-red-600 text-white text-xs font-semibold hover:bg-red-700 transition-all flex items-center gap-1.5 flex-shrink-0 disabled:opacity-50"
                                style={{ fontFamily: "'Poppins', sans-serif" }}
                              >
                                {deletingUser ? (
                                  <>
                                    <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    <span>Deleting User...</span>
                                  </>
                                ) : (
                                  <>
                                    <i className="fi flex fi-rr-trash"></i>
                                    <span>Delete User</span>
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                        ) : (
                          /* Form Fields - Compact */
                          <div className="[&>div]:space-y-1.5 [&_label]:text-xs [&_input]:h-8 [&_input]:text-xs [&_input]:text-black [&_input]:px-2.5 [&_input]:py-1.5 [&_select]:h-8 [&_select]:text-xs [&_select]:text-black [&_select]:px-2.5 [&_select]:py-1.5 [&_textarea]:text-xs [&_textarea]:text-black [&_textarea]:px-2.5 [&_textarea]:py-1.5">
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
                                      // Client Lifecycle
                                      is_client: userDetail.is_client !== undefined ? String(userDetail.is_client) : "false",
                                      joined_at: userDetail.joined_at ? userDetail.joined_at.split('T')[0] : "",
                                      renewal_at: userDetail.renewal_at ? userDetail.renewal_at.split('T')[0] : "",
                                      expire_at: userDetail.expire_at ? userDetail.expire_at.split('T')[0] : "",
                                  }}
                                  readOnly={!isEditMode}
                                  handleInputChange={(e: any) => {
                                      const { id, value } = e.target;
                                      setEditFormData((prev: any) => ({ ...prev, [id]: value }));
                                  }}
                                  category={activeCategory}
                              />
                          </div>
                        )}

                        {/* Edit Mode Actions */}
                        {isEditMode && activeCategory !== "security" && (
                            <div className="flex justify-end gap-3 mt-4 pt-4 border-t">
                                <button
                                    onClick={() => {
                                        setIsEditMode(false);
                                        // Reset edit form data to current userDetail values
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
                                            // Client Lifecycle
                                            is_client: userDetail.is_client !== undefined ? String(userDetail.is_client) : "false",
                                            joined_at: userDetail.joined_at ? userDetail.joined_at.split('T')[0] : "",
                                            renewal_at: userDetail.renewal_at ? userDetail.renewal_at.split('T')[0] : "",
                                            expire_at: userDetail.expire_at ? userDetail.expire_at.split('T')[0] : "",
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

                                            if (!response.ok || data.error) {
                                                setAccountModal({
                                                  isOpen: true,
                                                  type: 'account_issue',
                                                  title: 'Account Has Some Issue',
                                                  message: data.error || 'Failed to save changes. Please contact Admin.',
                                                  rootCause: data.rootCause || data.error || 'Failed to update user profile.',
                                                });
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

            <AccountIssueModal
              isOpen={accountModal.isOpen}
              type={accountModal.type}
              title={accountModal.title}
              message={accountModal.message}
              rootCause={accountModal.rootCause}
              onClose={() => setAccountModal(prev => ({ ...prev, isOpen: false }))}
              onRelogin={() => router.push('/login')}
              onContactAdmin={() => setAccountModal(prev => ({ ...prev, isOpen: false }))}
            />

            {/* Compact Minimal Smartflo DID Assignment Modal (Without Shadow) */}
            {showSmartfloDidModal && (() => {
              const selectedAgent = agentProviderState?.smartflo_details?.find(
                (a) => a.smartflo_agent_id === selectedSmartfloAgentId
              );

              const filteredAgents = (agentProviderState?.smartflo_details || []).filter((agent) => {
                if (!dropdownSearchTerm.trim()) return true;
                const term = dropdownSearchTerm.toLowerCase();
                return (
                  (agent.agent_name && agent.agent_name.toLowerCase().includes(term)) ||
                  (agent.caller_id && agent.caller_id.toLowerCase().includes(term)) ||
                  (agent.smartflo_agent_id && agent.smartflo_agent_id.toLowerCase().includes(term)) ||
                  (agent.extension && agent.extension.toLowerCase().includes(term)) ||
                  (agent.intercom && agent.intercom.toLowerCase().includes(term))
                );
              });

              return (
                <div
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby="smartflo-did-modal-title"
                  className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4"
                  onClick={() => {
                    if (!assigningSmartfloDid) {
                      setShowSmartfloDidModal(false);
                      setIsCustomDropdownOpen(false);
                    }
                  }}
                >
                  <div
                    className="w-full max-w-sm rounded-xl border border-gray-200 bg-white p-5"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between pb-3 border-b border-gray-100">
                      <div className="min-w-0 pr-3">
                        <h3 id="smartflo-did-modal-title" className="text-sm font-semibold text-gray-900 leading-snug">
                          Smartflo DID Mapping
                        </h3>
                        <p className="mt-0.5 text-[11px] text-gray-400">
                          Assign an active DID number to enable Smartflo calling
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setShowSmartfloDidModal(false);
                          setIsCustomDropdownOpen(false);
                        }}
                        disabled={assigningSmartfloDid}
                        className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors disabled:opacity-50"
                        aria-label="Close modal"
                      >
                        <i className="fi fi-rr-cross text-xs" />
                      </button>
                    </div>

                    {/* Error Banner */}
                    {assignSmartfloError && (
                      <div className="mt-3 rounded-lg border border-red-200 bg-red-50 px-2.5 py-1.5 text-[11px] text-red-700 flex items-center gap-1.5">
                        <i className="fi fi-rr-exclamation text-xs shrink-0" />
                        <span>{assignSmartfloError}</span>
                      </div>
                    )}

                    {/* Custom Dropdown */}
                    <div className="mt-4 relative" ref={customDropdownRef}>
                      <label className="block text-[11px] font-medium text-gray-600 mb-1.5">
                        Select Smartflo DID
                      </label>

                      {/* Custom Trigger */}
                      <button
                        type="button"
                        onClick={() => setIsCustomDropdownOpen((prev) => !prev)}
                        disabled={assigningSmartfloDid}
                        className={`flex w-full items-center justify-between rounded-lg border bg-white px-3 py-2 text-left text-xs transition-colors ${
                          isCustomDropdownOpen ? "border-[#4b33e8]" : "border-gray-200 hover:border-gray-300"
                        } disabled:bg-gray-50 disabled:cursor-not-allowed`}
                      >
                        {selectedAgent ? (
                          <div className="min-w-0 flex-1 truncate">
                            <span className="font-medium text-gray-900">{selectedAgent.agent_name || "Agent"}</span>
                            <span className="mx-1 text-gray-300">·</span>
                            <span className="font-mono text-gray-600 text-[11px]">{selectedAgent.caller_id || selectedAgent.smartflo_agent_id}</span>
                            {(selectedAgent.extension || selectedAgent.intercom) && (
                              <span className="ml-1 text-[10px] text-gray-400">({selectedAgent.extension || selectedAgent.intercom})</span>
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-400">Select DID / Agent...</span>
                        )}
                        <i className={`fi fi-rr-angle-small-${isCustomDropdownOpen ? "up" : "down"} ml-2 text-sm text-gray-400 shrink-0`} />
                      </button>

                      {/* Custom Dropdown List (No Shadow) */}
                      {isCustomDropdownOpen && (
                        <div className="absolute left-0 right-0 top-full z-50 mt-1 max-h-52 overflow-y-auto rounded-lg border border-gray-200 bg-white py-1">
                          {agentProviderState?.smartflo_details && agentProviderState.smartflo_details.length > 3 && (
                            <div className="border-b border-gray-100 p-1.5">
                              <input
                                type="text"
                                placeholder="Search by name or number..."
                                value={dropdownSearchTerm}
                                onChange={(e) => setDropdownSearchTerm(e.target.value)}
                                onClick={(e) => e.stopPropagation()}
                                className="w-full rounded border border-gray-200 px-2 py-1 text-[11px] text-gray-800 placeholder-gray-400 focus:border-[#4b33e8] focus:outline-none"
                                autoFocus
                              />
                            </div>
                          )}

                          <div className="divide-y divide-gray-50">
                            {filteredAgents.length === 0 ? (
                              <div className="px-3 py-2 text-center text-xs text-gray-400">
                                No matching DID records
                              </div>
                            ) : (
                              filteredAgents.map((agent) => {
                                const isSelected = agent.smartflo_agent_id === selectedSmartfloAgentId;
                                const isCurrent = agent.user_id === userDetail?.user_id;

                                return (
                                  <div
                                    key={agent.id}
                                    onClick={() => {
                                      setSelectedSmartfloAgentId(agent.smartflo_agent_id);
                                      setIsCustomDropdownOpen(false);
                                      setAssignSmartfloError("");
                                    }}
                                    className={`flex cursor-pointer items-center justify-between px-3 py-2 text-xs transition-colors hover:bg-gray-50 ${
                                      isSelected ? "bg-purple-50/70" : ""
                                    }`}
                                  >
                                    <div className="min-w-0 flex-1 pr-2">
                                      <div className="flex items-center gap-1.5">
                                        <span className={`truncate font-medium ${isSelected ? "text-[#4b33e8]" : "text-gray-800"}`}>
                                          {agent.agent_name || "Agent"}
                                        </span>
                                        <span className="font-mono text-[10px] text-gray-500">
                                          {agent.caller_id || agent.smartflo_agent_id}
                                        </span>
                                      </div>
                                      <div className="mt-0.5 text-[10px] text-gray-400">
                                        Ext: {agent.extension || agent.intercom || "—"}
                                      </div>
                                    </div>
                                    <div className="shrink-0">
                                      {isCurrent ? (
                                        <span className="rounded bg-purple-100 px-1.5 py-0.5 text-[9px] font-semibold text-[#4b33e8]">Current</span>
                                      ) : agent.is_mapped ? (
                                        <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[9px] text-gray-500">Assigned</span>
                                      ) : (
                                        <span className="rounded bg-emerald-50 px-1.5 py-0.5 text-[9px] font-semibold text-emerald-600">Available</span>
                                      )}
                                    </div>
                                  </div>
                                );
                              })
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Selected DID Minimal Details */}
                    {selectedAgent && (
                      <div className="mt-3 rounded-lg border border-gray-100 bg-gray-50/80 p-2.5 text-[11px] space-y-1">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Agent:</span>
                          <span className="font-medium text-gray-800">{selectedAgent.agent_name || "—"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">DID Number:</span>
                          <span className="font-mono font-semibold text-[#4b33e8]">{selectedAgent.caller_id || selectedAgent.smartflo_agent_id}</span>
                        </div>
                        {(selectedAgent.extension || selectedAgent.intercom) && (
                          <div className="flex justify-between">
                            <span className="text-gray-400">Extension:</span>
                            <span className="font-mono text-gray-600">{selectedAgent.extension || selectedAgent.intercom}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="mt-4 flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                      <button
                        type="button"
                        onClick={() => {
                          setShowSmartfloDidModal(false);
                          setIsCustomDropdownOpen(false);
                        }}
                        disabled={assigningSmartfloDid}
                        className="rounded-lg border border-gray-200 bg-white px-3.5 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => void handleAssignSmartfloDid(selectedSmartfloAgentId)}
                        disabled={!selectedSmartfloAgentId || assigningSmartfloDid}
                        className="flex items-center gap-1.5 rounded-lg bg-[#4b33e8] px-4 py-1.5 text-xs font-medium text-white hover:bg-[#3d27cf] transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {assigningSmartfloDid ? (
                          <>
                            <span className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
                            <span>Assigning...</span>
                          </>
                        ) : (
                          <span>Assign</span>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })()}
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
