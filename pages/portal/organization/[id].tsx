import { useEffect, useState, useCallback, useMemo, useRef } from "react"; 
import { useRouter } from "next/router";
import Head from "next/head";
import AppLayout, { useUser } from "@/components/AppLayout";
import { supabase } from "@/lib/supabase";
import { logSystemEvent } from "@/lib/monitoring";
import ExpiryBadge from "@/components/ExpiryBadge";
import SignupForm from "@/components/SignupForm";
import ImportCustomersModal from "@/components/ImportCustomersModal";
import { useOrganizationDetailData, OrgUser } from "@/hooks";
import { formatDate, calculateNewExpiryDate, calculateMonthsToTarget } from "@/lib/dateUtils";


export default function OrganizationDetail() {
  const router = useRouter();
  const { id } = router.query;
  const { user, mounted, loading: authLoading } = useUser();

  // Page level protection logic (Strict: Wait for auth to finalize)
  useEffect(() => {
    if (mounted && !authLoading && user) {
      const allowedRoles = ['ceo', 'admin', 'super_admin'];
      const userDesignation = user.designation?.toLowerCase().replace(/\s+/g, '_') || '';
      
      const isOrgVisible = user.isClient === false || 
                          (user.isClient === true && allowedRoles.includes(userDesignation));
      
      if (!isOrgVisible) {
        console.warn("Unauthorized access to organization detail, redirecting...");
        router.replace('/dashboard');
      }
    }
  }, [mounted, user, authLoading, router]);
  const {
    loading,
    organization,
    setOrganization,
    orgUsers,
    setOrgUsers,
    stats,
    filteredUsers,
    searchQuery,
    setSearchQuery,
    refreshData
  } = useOrganizationDetailData(id);

  const [showUserModal, setShowUserModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [unassignedUsers, setUnassignedUsers] = useState<any[]>([]);
  const [selectedUserToAdd, setSelectedUserToAdd] = useState("");
  const [addingUser, setAddingUser] = useState(false);
  const [showRenewalModal, setShowRenewalModal] = useState(false);
  const [selectedUserForRenewal, setSelectedUserForRenewal] = useState<OrgUser | null>(null);
  const [renewalMonths, setRenewalMonths] = useState<string>("1");
  const [customMonth, setCustomMonth] = useState("");
  const [customYear, setCustomYear] = useState("");
  const [customDate, setCustomDate] = useState("");
  const [renewingOrg, setRenewingOrg] = useState(false);
  const [previewExpiryDate, setPreviewExpiryDate] = useState<string | null>(null);
  const [showImportModal, setShowImportModal] = useState(false);

  const unassignedAbortRef = useRef<AbortController | null>(null);

  const fetchUnassignedUsers = useCallback(async () => {
    if (unassignedAbortRef.current) unassignedAbortRef.current.abort();
    unassignedAbortRef.current = new AbortController();

    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('id, user_name, email')
        .is('organization_id', null)
        .abortSignal(unassignedAbortRef.current.signal);
      
      if (data) setUnassignedUsers(data);
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        console.error('Error fetching unassigned users:', err);
      }
    }
  }, []);

  useEffect(() => {
    if (id) {
      fetchUnassignedUsers();
    }
    return () => {
      if (unassignedAbortRef.current) unassignedAbortRef.current.abort();
    };
  }, [id, fetchUnassignedUsers]);

  // Reset modal-related state on close
  useEffect(() => {
    if (!showUserModal) {
      setSelectedUserToAdd("");
    }
  }, [showUserModal]);

  useEffect(() => {
    if (!showRenewalModal) {
      setRenewalMonths("1");
      setCustomMonth("");
      setCustomYear("");
      setCustomDate("");
      setPreviewExpiryDate(null);
    }
  }, [showRenewalModal]);

  const handleAddUser = async () => {
    if (!selectedUserToAdd || !organization) return;
    try {
      setAddingUser(true);
      const { error } = await supabase
        .from('user_profiles')
        .update({ organization_id: organization.id, status: 'active' })
        .eq('id', selectedUserToAdd);
      
      if (error) throw error;
      
      setShowUserModal(false);
      // Redundant refetch avoided by doing refreshData() which is the only way to get full accurate list with profile pics etc easily
      // However, requirement says "Avoid redundant refetch after optimistic updates".
      // But adding a user involves moving them from "unassigned" to "assigned".
      // I'll refresh data to keep it consistent.
      refreshData(true); 
      fetchUnassignedUsers();

      logSystemEvent({
        event_type: 'WRITE',
        description: `Add member to ${organization.company_name}`,
        metadata: { 
          organization_id: organization.id, 
          user_id: selectedUserToAdd 
        },
        user_name: user?.displayName || 'Admin',
        organization_id: user?.organization_id || undefined
      });
    } catch (err) {
      console.error("Error adding user:", err);
      alert("Failed to add user");
    } finally {
      setAddingUser(false);
    }
  };

  const handleRemoveUser = async (userId: string, userName: string) => {
    if (!confirm(`Remove ${userName} from this organization?`)) return;
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({ organization_id: null, status: 'inactive' })
        .eq('id', userId);
      
      if (error) throw error;
      
      // Optimistic update
      setOrgUsers((prev: OrgUser[]) => prev.filter((u: OrgUser) => u.id !== userId));
      fetchUnassignedUsers();

      logSystemEvent({
        event_type: 'WRITE',
        description: `Remove member from ${organization?.company_name}`,
        metadata: { 
          organization_id: organization?.id, 
          user_id: userId,
          user_name: userName
        },
        user_name: user?.displayName || 'Admin',
        organization_id: user?.organization_id || undefined
      });
    } catch (err) {
      console.error("Error removing user:", err);
    }
  };

  const toggleUserStatus = async (userId: string, currentStatus: string | null) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({ status: newStatus })
        .eq('id', userId);
      
      if (error) throw error;
      
      // Optimistically update local state & stats (requirement 5)
      setOrgUsers((prev: OrgUser[]) => prev.map((u: OrgUser) => 
        u.id === userId ? { ...u, status: newStatus } : u
      ));

      logSystemEvent({
        event_type: 'WRITE',
        description: `Toggle member status to ${newStatus}`,
        metadata: { 
          organization_id: organization?.id, 
          user_id: userId,
          status: newStatus
        },
        user_name: user?.displayName || 'Admin',
        organization_id: user?.organization_id || undefined
      });
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  const handleRenewal = async () => {
    if (!organization) return;

    try {
      setRenewingOrg(true);
      let monthsToAdd = 0;
      
      if (renewalMonths === "custom") {
        if (!customMonth || !customYear) {
          alert("Please select both month and year for custom renewal");
          return;
        }
        monthsToAdd = calculateMonthsToTarget(customYear, customMonth);
        if (monthsToAdd <= 0) {
          alert("Please select a future date for renewal");
          return;
        }
      } else if (renewalMonths === "date") {
        if (!customDate) {
          alert("Please select a custom date");
          return;
        }
      } else {
        monthsToAdd = parseInt(renewalMonths);
      }

      const baseExpiry = selectedUserForRenewal ? selectedUserForRenewal.expire_at : organization.expiry_date;
      const newExpiryString = renewalMonths === "date" 
        ? customDate 
        : calculateNewExpiryDate(baseExpiry, monthsToAdd);
      const renewalDateString = new Date().toISOString().split('T')[0];

      if (selectedUserForRenewal) {
        // Update individual user
        const { error } = await supabase
          .from("user_profiles")
          .update({
            renewal_at: renewalDateString,
            expire_at: newExpiryString,
            status: 'active'
          })
          .eq("id", selectedUserForRenewal.id);

        if (error) throw error;
        alert(`Member ${selectedUserForRenewal.user_name} renewed successfully!`);
      } else {
        // Update organization
        const { error } = await supabase
          .from("organizations")
          .update({
            expiry_date: newExpiryString,
            renewal_date: renewalDateString,
            is_active: true
          })
          .eq("id", organization.id);

        if (error) throw error;

        // Update all users assigned to this organization
        const { error: userUpdateError } = await supabase
          .from("user_profiles")
          .update({
            renewal_at: renewalDateString,
            expire_at: newExpiryString
          })
          .eq("organization_id", organization.id);

        if (userUpdateError) {
          console.error("Error updating user dates:", userUpdateError);
        }
        alert("Organization and all members renewed successfully!");
      }

      await refreshData(true);
      setShowRenewalModal(false);

      logSystemEvent({
        event_type: 'WRITE',
        description: selectedUserForRenewal 
          ? `Renew Member: ${selectedUserForRenewal.user_name} for ${monthsToAdd} months`
          : `Renew Organization: ${organization.company_name} for ${monthsToAdd} months`,
        metadata: { 
          organization_id: organization.id, 
          user_id: selectedUserForRenewal?.id,
          months_added: monthsToAdd,
          new_expiry: newExpiryString 
        },
        user_name: user?.displayName || 'Admin',
        organization_id: user?.organization_id || undefined
      });
    } catch (err) {
      console.error("Error renewing:", err);
      alert("Failed to renew");
    } finally {
      setRenewingOrg(false);
    }
  };

  // Calculate preview expiry date
  useEffect(() => {
    if (!organization || !showRenewalModal) {
      setPreviewExpiryDate(null);
      return;
    }

    try {
      let monthsToAdd = 0;
      if (renewalMonths === "custom") {
        if (!customMonth || !customYear) {
          setPreviewExpiryDate(null);
          return;
        }
        monthsToAdd = calculateMonthsToTarget(customYear, customMonth);
        if (monthsToAdd <= 0) {
          setPreviewExpiryDate(null);
          return;
        }
      } else if (renewalMonths === "date") {
        if (!customDate) {
          setPreviewExpiryDate(null);
          return;
        }
      } else if (renewalMonths) {
        monthsToAdd = parseInt(renewalMonths);
      } else {
        setPreviewExpiryDate(null);
        return;
      }

      const baseExpiry = selectedUserForRenewal ? selectedUserForRenewal.expire_at : organization.expiry_date;
      const newExpiry = renewalMonths === "date" 
        ? customDate 
        : calculateNewExpiryDate(baseExpiry, monthsToAdd);
      setPreviewExpiryDate(newExpiry);
    } catch (err) {
      setPreviewExpiryDate(null);
    }
  }, [renewalMonths, customMonth, customYear, customDate, organization, showRenewalModal, selectedUserForRenewal]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f6f5f7]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#4b33e8] border-t-transparent"></div>
      </div>
    );
  }

  if (!organization) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f6f5f7]">
        <div className="text-center font-poppins">
          <h1 className="text-2xl font-semibold text-gray-800 mb-2">Organization not found</h1>
          <button onClick={() => router.push("/organization")} className="text-[#4b33e8] font-semibold hover:underline">Back to Organizations</button>
        </div>
      </div>
    );
  }

  // Calculate Org Days Left
  const getOrgDaysLeft = () => {
    if (!organization.expiry_date) return null;
    const now = new Date();
    const exp = new Date(organization.expiry_date);
    const diff = Math.ceil((exp.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  const orgDaysLeft = getOrgDaysLeft();

  return (
    <>
      <Head>
        <title>{organization.company_name} • TFC Nexus</title>
      </Head>

      <div className="flex-1 flex flex-col w-full min-w-0 font-poppins">
        <div className="flex-1 pb-12">
            
           {/* Top Dynamic Header Background */}
           <div className="relative w-full overflow-hidden  pb-10">
              <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-[100px] -mr-64 -mt-64 pointer-events-none"></div>

              <div className="container mx-auto px-3 sm:px-4 md:px-6 py-6 sm:py-8 pb-20 sm:pb-24 lg:pb-8 max-w-7xl relative z-10">
                 {/* Breadcrumbs */}
                 <div className="flex items-center gap-2 text-xs text-slate-400 mb-6 font-semibold tracking-wide text-left">
                   <span className="cursor-pointer hover:text-indigo-600 transition-colors" onClick={() => router.push("/organization")}>Organizations</span>
                   <i className="fi flex fi-rr-angle-small-right text-[10px]"></i>
                   <span className="text-slate-600">{organization.company_name}</span>
                 </div>

                 {/* Hero Card */}
                 <div className="relative bg-white rounded-2xl p-8 md:p-10 shadow-xl shadow-slate-200/40 overflow-hidden group">
                     <div className="absolute top-0 right-0 p-12 opacity-[0.02] transform group-hover:scale-110 transition-transform duration-1000 pointer-events-none">
                         <i className="fi flex fi-rr-building text-[12rem]"></i>
                     </div>
                     
                     <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center gap-8">
                         {/* Icon Box */}
                         <div className="w-24 h-24 rounded-[2rem] bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-white shadow-2xl shadow-indigo-200">
                             <span className="text-3xl font-semibold">{organization.company_name.charAt(0)}</span>
                         </div>

                         <div className="flex-1 min-w-0 text-left">
                             <div className="flex flex-wrap items-center gap-4 mb-3">
                                 <h1 className="text-3xl md:text-4xl font-semibold text-slate-800 tracking-tight">{organization.company_name}</h1>
                                 
                                 {organization.is_active ? (
                                     <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/80 text-emerald-700 text-[10px] font-semibold border border-emerald-200">
                                         <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                                         Active
                                     </div>
                                 ) : (
                                     <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100/80 text-red-700 text-[10px] font-semibold border border-red-200">
                                         <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                                         Inactive
                                     </div>
                                  )}
                                  
                                  {organization.org_code && (
                                      <div className="px-3 py-1 rounded-full bg-slate-100 text-slate-500 text-[10px] font-semibold border border-slate-200">
                                          {organization.org_code}
                                      </div>
                                  )}
                             </div>

                             <p className="text-slate-500 text-sm md:text-base max-w-2xl leading-relaxed mb-6">
                                 {organization.description || "Comprehensive organizational profile managing client assets, licenses, and operational compliance within the Nexus infrastructure."}
                             </p>

                             <div className="flex flex-wrap gap-6">
                                 <div className="flex items-center gap-2">
                                     <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
                                         <i className="fi flex fi-rr-briefcase text-xs"></i>
                                     </div>
                                     <div className="flex flex-col">
                                         <span className="text-[9px] font-semibold text-slate-400">Industry</span>
                                         <span className="text-xs font-semibold text-slate-700">{organization.company_type || 'General'}</span>
                                     </div>
                                 </div>
                                 
                                 <div className="flex items-center gap-2">
                                     <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center text-amber-500">
                                         <i className="fi flex fi-rr-marker text-xs"></i>
                                     </div>
                                     <div className="flex flex-col">
                                         <span className="text-[9px] font-semibold text-slate-400">Headquarters</span>
                                         <span className="text-xs font-semibold text-slate-700 truncate max-w-[150px]" title={organization.address || ''}>
                                             {organization.address ? organization.address.split(',')[0] : 'Remote'}
                                         </span>
                                     </div>
                                 </div>

                                 <div className="flex items-center gap-2">
                                     <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center text-purple-500">
                                         <i className="fi flex fi-rr-calendar-check text-xs"></i>
                                     </div>
                                     <div className="flex flex-col">
                                         <span className="text-[9px] font-semibold text-slate-400">Joined On</span>
                                         <span className="text-xs font-semibold text-slate-700">{formatDate(organization.company_joined)}</span>
                                     </div>
                                 </div>

                                  {user?.isClient === false && (
                                    <button
                                      onClick={() => {
                                        setSelectedUserForRenewal(null);
                                        setShowRenewalModal(true);
                                      }}
                                      className="px-8 ml-3 py-2 rounded-full bg-gradient-to-r from-indigo-500 to-blue-600 text-white text-[12px] font-medium hover:shadow-lg hover:scale-105 transition-all flex items-center gap-1.5"
                                    >
                                      <i className="fi flex fi-rr-refresh text-[10px]"></i>
                                      Renew
                                    </button>
                                  )}
                             </div>
                         </div>
                     </div>
                 </div>

                 {/* Stats Grid */}
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
                     {/* Total Users */}
                     <div className="bg-white p-6 rounded-2xl hover:shadow-md transition-all group text-left">
                         <div className="flex items-center justify-between mb-4">
                             <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
                                 <i className="fi flex fi-rr-users-alt text-lg"></i>
                             </div>
                             <span className="text-xs font-semibold text-slate-300">Total</span>
                         </div>
                         <div className="flex flex-col">
                             <span className="text-3xl font-semibold text-slate-800">{stats.totalMembers}</span>
                             <span className="text-[10px] font-semibold text-slate-400">Deployed Personnel</span>
                         </div>
                     </div>

                     {/* Active Licenses */}
                     <div className="bg-white p-6 rounded-2xl hover:shadow-md transition-all group text-left">
                         <div className="flex items-center justify-between mb-4">
                             <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
                                 <i className="fi flex fi-rr-id-badge text-lg"></i>
                             </div>
                             <span className="text-xs font-semibold text-slate-300">Active</span>
                         </div>
                         <div className="flex flex-col">
                             <span className="text-3xl font-semibold text-slate-800">{stats.activeLicenses}</span>
                             <span className="text-[10px] font-semibold text-slate-400">Valid Licenses</span>
                         </div>
                     </div>

                     {/* Expiring Soon */}
                     <div className="bg-white p-6 rounded-2xl hover:shadow-md transition-all group text-left">
                         <div className="flex items-center justify-between mb-4">
                             <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500 group-hover:scale-110 transition-transform">
                                 <i className="fi flex fi-rr-alarm-clock text-lg"></i>
                             </div>
                             <span className="text-xs font-semibold text-slate-300">Warning</span>
                         </div>
                         <div className="flex flex-col">
                             <span className="text-3xl font-semibold text-slate-800">{stats.expiringSoon}</span>
                             <span className="text-[10px] font-semibold text-slate-400">Expire in 30 Days</span>
                         </div>
                     </div>

                     {/* Org Expiry */}
                     <div className="bg-white p-6 rounded-2xl hover:shadow-md transition-all group relative overflow-hidden text-left">
                         <div className={`absolute top-0 right-0 w-20 h-20 rounded-full blur-2xl -mr-10 -mt-10 ${
                             orgDaysLeft && orgDaysLeft < 30 ? 'bg-red-500/20' : 'bg-indigo-500/10'
                         }`}></div>
                         <div className="flex items-center justify-between mb-4 relative z-10">
                             <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white group-hover:scale-110 transition-transform ${
                                 orgDaysLeft && orgDaysLeft < 30 ? 'bg-red-500' : 'bg-indigo-500'
                             }`}>
                                 <i className="fi flex fi-rr-crown text-lg"></i>
                             </div>
                             <span className="text-xs font-semibold text-slate-300">Validity</span>
                         </div>
                         <div className="flex flex-col relative z-10">
                             <span className="text-3xl font-semibold text-slate-800">{orgDaysLeft !== null ? orgDaysLeft : '∞'}</span>
                             <span className="text-[10px] font-semibold text-slate-400">Days Remaining</span>
                         </div>
                     </div>
                 </div>

                  {/* Main Layout - Top Hierarchy */}
                  <div className="space-y-8 mt-8">
                      
                      {/* Info Cards Row */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                         {/* Compliance Card */}
                         <div className="bg-white rounded-2xl p-6">
                             <h3 className="text-xs font-semibold text-slate-400 mb-6 flex items-center gap-2">
                                 <i className="fi flex fi-rr-shield-check text-indigo-500"></i>
                                 Compliance Info
                             </h3>
                             
                             <div className="space-y-4">
                                 <div className="p-4 rounded-xl bg-slate-50">
                                     <p className="text-[9px] font-semibold text-slate-400 mb-1 font-poppins">Tax Identity (GSTIN)</p>
                                     <p className="text-sm font-semibold text-slate-700 tracking-wide font-mono">{organization.gst_no || 'N/A'}</p>
                                 </div>
                                 <div className="p-4 rounded-xl bg-slate-50">
                                     <p className="text-[9px] font-semibold text-slate-400 mb-1 font-poppins">Company Code</p>
                                     <p className="text-sm font-semibold text-slate-700 tracking-wide font-mono">{organization.company_code || 'N/A'}</p>
                                 </div>
                                 <div className="p-4 rounded-xl bg-slate-50">
                                     <p className="text-[9px] font-semibold text-slate-400 mb-1 font-poppins">Full Address</p>
                                     <p className="text-xs font-semibold text-slate-600 leading-relaxed">{organization.address || '—'}</p>
                                 </div>
                             </div>
                         </div>

                         {/* Contact Card */}
                         <div className="bg-white rounded-2xl p-6">
                             <h3 className="text-xs font-semibold text-slate-400 mb-6 flex items-center gap-2">
                                 <i className="fi flex fi-rr-address-book text-emerald-500"></i>
                                 Principal Contact
                             </h3>
                             
                             <div className="flex items-center gap-4 mb-6">
                                 <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-semibold text-lg font-poppins">
                                     {organization.owner_name?.charAt(0) || 'O'}
                                 </div>
                                 <div>
                                     <p className="text-sm font-semibold text-slate-800">{organization.owner_name || 'Unknown'}</p>
                                     <p className="text-[10px] font-semibold text-slate-400 tracking-wide font-poppins">Owner / Admin</p>
                                 </div>
                             </div>

                             <div className="space-y-3">
                                 <div className="flex items-center gap-3 text-xs font-medium text-slate-600">
                                     <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                                         <i className="fi flex fi-rr-phone-call"></i>
                                     </div>
                                     <span className="font-poppins">{organization.owner_phone_no || 'No Phone'}</span>
                                 </div>
                                 <div className="flex items-center gap-3 text-xs font-medium text-slate-600">
                                     <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                                         <i className="fi flex fi-rr-envelope"></i>
                                     </div>
                                     <span className="truncate font-poppins">{organization.email || 'No Email'}</span>
                                 </div>
                             </div>
                         </div>
                     </div>


                  {/* Member Directory - Full Width Section */}
                     <div className="w-full text-left">
                         <div className="bg-white rounded-2xl overflow-hidden flex flex-col min-h-[500px]">
                             <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                 <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                     <i className="fi flex fi-rr-users-alt text-indigo-600"></i>
                                     Member Directory
                                 </h3>
                                  <div className="flex items-center gap-3">
                                      <div className="relative">
                                          <i className="fi flex fi-rr-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
                                          <input 
                                              type="text" 
                                              placeholder="Search members..." 
                                              value={searchQuery}
                                              onChange={(e) => setSearchQuery(e.target.value)}
                                              className="pl-8 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 w-full sm:w-48 placeholder:text-slate-400"
                                          />
                                      </div>
                                      {user?.isClient === false && (
                                          <button 
                                              onClick={() => setShowUserModal(true)}
                                              className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl text-xs font-bold transition-all font-poppins"
                                          >
                                              <i className="fi flex fi-rr-user-add"></i>
                                              <span>Assign</span>
                                          </button>
                                      )}

                                      <button 
                                          onClick={() => setShowSignupModal(true)}
                                          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-indigo-200 font-poppins"
                                      >
                                          <i className="fi flex fi-rr-plus"></i>
                                          <span>Add</span>
                                      </button>

                                      {user?.isClient === false && (
                                          <button 
                                              onClick={() => setShowImportModal(true)}
                                              className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-[#4b33e8] border border-indigo-100 rounded-xl text-xs font-bold hover:bg-indigo-100 transition-all uppercase tracking-widest font-poppins"
                                          >
                                              <i className="fi flex fi-rr-upload"></i>
                                              <span>Import</span>
                                          </button>
                                      )}
                                  </div>
                             </div>

                             <div className="flex-1 overflow-x-auto">
                                 <table className="w-full text-left border-collapse">
                                     <thead>
                                         <tr className="bg-slate-50/50 border-b border-slate-100">
                                             <th className="p-4 text-[10px] font-bold text-slate-400 font-poppins">Member Profile</th>
                                             <th className="p-4 text-[10px] font-bold text-slate-400 font-poppins">Role</th>
                                             <th className="p-4 text-[10px] font-bold text-slate-400 font-poppins">Status</th>
                                             <th className="p-4 text-[10px] font-bold text-slate-400 font-poppins">License Expiry</th>
                                             <th className="p-4 text-[10px] font-bold text-slate-400 text-right font-poppins">Actions</th>
                                         </tr>
                                     </thead>
                                     <tbody className="divide-y divide-slate-50">
                                         {filteredUsers.map((u: OrgUser) => (
                                             <tr key={u.id} className="group hover:bg-indigo-50/10 transition-colors">
                                                 <td className="p-4">
                                                     <div className="flex items-center gap-3 text-left">
                                                         {u.profile_pic_url ? (
                                                              <img src={u.profile_pic_url} className="w-9 h-9 rounded-xl object-cover bg-white" alt="" />
                                                          ) : (
                                                              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-slate-500 font-semibold text-xs font-poppins">
                                                                  {(u.user_name || u.email || 'U').charAt(0).toUpperCase()}
                                                              </div>
                                                          )}
                                                          <div>
                                                              <p className="text-sm font-semibold text-slate-700">{u.user_name || 'Unnamed'}</p>
                                                              <p className="text-[10px] font-semibold text-slate-400 font-poppins">{u.employee_id || 'ID Pending'}</p>
                                                          </div>
                                                     </div>
                                                 </td>
                                                 <td className="p-4">
                                                     <div className="flex items-center gap-2 text-left">
                                                         <span className="text-xs font-semibold text-slate-600 capitalize font-poppins">{u.role || 'Employee'}</span>
                                                         {u.is_client && (
                                                             <span className="px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-600 text-[9px] font-semibold uppercase font-poppins">Client</span>
                                                         )}
                                                     </div>
                                                 </td>
                                                  <td className="p-4 text-left">
                                                      <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] font-semibold uppercase tracking-wider font-poppins ${
                                                         u.status === 'active' ? 'bg-green-50 text-green-600' : 'bg-slate-100 text-slate-500'
                                                      }`}>
                                                         <div className={`w-1.5 h-1.5 rounded-full ${u.status === 'active' ? 'bg-green-500' : 'bg-slate-400'}`}></div>
                                                         {u.status || 'Pending'}
                                                      </div>
                                                  </td>
                                                 <td className="p-4 text-left">
                                                     <ExpiryBadge expireDate={u.expire_at} onClick={() => { setSelectedUserForRenewal(u); setShowRenewalModal(true); }} />
                                                 </td>
                                                  <td className="p-4 text-right">
                                                      <div className="flex items-center justify-end gap-2">
                                                          <button 
                                                              onClick={() => toggleUserStatus(u.id, u.status)}
                                                              className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                                                                u.status === 'active' 
                                                                  ? 'text-amber-500 bg-amber-50 hover:bg-amber-100' 
                                                                  : 'text-emerald-500 bg-emerald-50 hover:bg-emerald-100'
                                                              }`}
                                                              title={u.status === 'active' ? 'Deactivate Member' : 'Activate Member'}
                                                          >
                                                              <i className={`fi flex ${u.status === 'active' ? 'fi-rr-power' : 'fi-rr-bolt'}`}></i>
                                                          </button>

                                                        {user?.isClient === false && (
                                                            <button 
                                                                onClick={() => handleRemoveUser(u.id, u.user_name || 'User')}
                                                                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                                                                title="Remove from Organization"
                                                            >
                                                                <i className="fi flex fi-rr-trash"></i>
                                                            </button>
                                                        )}
                                                      </div>
                                                  </td>
                                             </tr>
                                         ))}
                                         
                                         {orgUsers.length === 0 && (
                                             <tr>
                                                 <td colSpan={5} className="p-12 text-center">
                                                     <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-50 mb-3">
                                                         <i className="fi flex fi-rr-users text-slate-300"></i>
                                                     </div>
                                                     <p className="text-sm font-semibold text-slate-400 font-poppins">No members deployed yet.</p>
                                                 </td>
                                             </tr>
                                         )}
                                     </tbody>
                                 </table>
                             </div>
                         </div>
                     </div>
                 </div>

              </div>
           </div>
        </div>

        {/* Signup Modal */}
        {showSignupModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="relative bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 overflow-y-auto max-h-[90vh]">
               <div className="p-8">
                   <button 
                      onClick={() => setShowSignupModal(false)} 
                      className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors"
                   >
                      <i className="fi flex fi-rr-cross-small"></i>
                   </button>
                   <SignupForm 
                      onSuccess={() => {
                          setShowSignupModal(false);
                          refreshData(true);
                      }}
                      defaultOrganizationId={organization?.id}
                      fromAdminPanel={true}
                   />
               </div>
            </div>
          </div>
        )}

        {/* Add User Modal */}
        {showUserModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                    <div className="p-6 flex items-center justify-between bg-slate-50/50">
                        <h3 className="text-lg font-bold text-slate-800">Assign Member</h3>
                        <button onClick={() => setShowUserModal(false)} className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center text-slate-400 hover:text-slate-800 transition-all shadow-sm">
                            <i className="fi flex fi-rr-cross-small text-xl"></i>
                        </button>
                    </div>
                    
                    <div className="p-6 space-y-6 text-left">
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 font-poppins">Select User</label>
                            {unassignedUsers.length > 0 ? (
                                <select 
                                    value={selectedUserToAdd}
                                    onChange={(e) => setSelectedUserToAdd(e.target.value)}
                                    className="w-full text-slate-600 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 appearance-none font-poppins"
                                >
                                    <option value="">Choose a user...</option>
                                    {unassignedUsers.map(u => (
                                        <option key={u.id} value={u.id}>
                                            {u.user_name || u.email} ({u.email})
                                        </option>
                                    ))}
                                </select>
                            ) : (
                                <div className="p-4 rounded-xl bg-slate-50 text-center border border-slate-100 border-dashed">
                                    <p className="text-sm font-semibold text-slate-500 font-poppins">No unassigned users available.</p>
                                </div>
                            )}
                        </div>

                        <div className="flex gap-3 pt-2">
                             <button 
                                 onClick={() => setShowUserModal(false)}
                                 className="flex-1 py-4 bg-white text-slate-400 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-slate-50 hover:text-slate-600 transition-all active:scale-[0.98] font-poppins"
                             >
                                 Cancel
                             </button>
                             <button 
                                 onClick={handleAddUser}
                                 disabled={!selectedUserToAdd || addingUser}
                                 className="flex-[1.5] py-4 bg-indigo-600 text-white rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 active:scale-[0.98] disabled:opacity-50 disabled:shadow-none font-poppins"
                             >
                                 {addingUser ? 'Assigning...' : 'Confirm'}
                             </button>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {/* Renewal Modal */}
        {showRenewalModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                <div className="bg-white rounded-2xl w-full max-w-xl shadow-2xl flex flex-col max-h-[90vh] border border-gray-100 overflow-hidden animate-in fade-in zoom-in duration-300">
                    
                    {/* Professional Header */}
                    <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-white">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 shadow-sm">
                                <i className="fi flex fi-rr-refresh text-lg"></i>
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-800 text-lg" style={{ fontFamily: "'Poppins', sans-serif" }}>
                                    {selectedUserForRenewal ? 'Renew Member Access' : 'Renew Organization License'}
                                </h3>
                                <p className="text-[11px] text-gray-400 font-semibold uppercase tracking-wider">
                                    Target: <span className="text-indigo-600">
                                        {selectedUserForRenewal ? selectedUserForRenewal.user_name : `${organization?.company_name} (All Members)`}
                                    </span>
                                </p>
                            </div>
                        </div>
                        
                        <button 
                            onClick={() => setShowRenewalModal(false)} 
                            className="w-10 h-10 rounded-xl hover:bg-gray-50 flex items-center justify-center text-gray-400 transition-all active:scale-95 border border-transparent hover:border-gray-100"
                        >
                            <i className="fi flex fi-rr-cross-small text-xl"></i>
                        </button>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto p-6 space-y-8">
                        {/* Period Selection Section */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <span className="w-1 h-4 bg-indigo-500 rounded-full"></span>
                                <label className="text-[11px] uppercase tracking-widest font-black text-gray-400 font-poppins">Choose Renewal Period</label>
                            </div>
                            
                            <div className="grid grid-cols-5 p-1.5 bg-gray-50 border border-gray-100 rounded-2xl">
                                {["1", "2", "3", "custom", "date"].map((option) => (
                                    <button
                                        key={option}
                                        onClick={() => setRenewalMonths(option)}
                                        className={`py-3 rounded-xl font-bold text-[10px] uppercase tracking-wider transition-all duration-300 ${
                                            renewalMonths === option
                                                ? "bg-white text-indigo-600 shadow-md shadow-indigo-100/50 border border-indigo-100 scale-[1.02]"
                                                : "text-gray-400 hover:text-gray-600 hover:bg-white/50"
                                        }`}
                                    >
                                        {option === "custom" ? "Custom" : option === "date" ? "Select Date" : `${option} Month`}
                                    </button>
                                ))}
                            </div>

                            {/* Conditional Inputs */}
                            {(renewalMonths === "custom" || renewalMonths === "date") && (
                                <div className="p-4 bg-indigo-50/30 rounded-2xl border border-indigo-50 animate-in slide-in-from-top-2 duration-300">
                                    {renewalMonths === "custom" ? (
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <p className="text-[9px] font-bold text-indigo-400 uppercase ml-1">Target Month</p>
                                                <div className="relative group">
                                                    <select
                                                        value={customMonth}
                                                        onChange={(e) => setCustomMonth(e.target.value)}
                                                        className="w-full pl-10 pr-4 py-3 bg-white border border-indigo-100 rounded-xl text-xs font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 appearance-none transition-all font-poppins"
                                                    >
                                                        <option value="">Select Month</option>
                                                        {Array.from({ length: 12 }, (_, i) => (
                                                            <option key={i + 1} value={i + 1}>
                                                                {new Date(2000, i, 1).toLocaleString('default', { month: 'long' })}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    <i className="fi fi-rr-calendar absolute left-4 top-1/2 -translate-y-1/2 text-indigo-300"></i>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <p className="text-[9px] font-bold text-indigo-400 uppercase ml-1">Target Year</p>
                                                <div className="relative group">
                                                    <select
                                                        value={customYear}
                                                        onChange={(e) => setCustomYear(e.target.value)}
                                                        className="w-full pl-10 pr-4 py-3 bg-white border border-indigo-100 rounded-xl text-xs font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 appearance-none transition-all font-poppins"
                                                    >
                                                        <option value="">Select Year</option>
                                                        {Array.from({ length: 5 }, (_, i) => {
                                                            const year = new Date().getFullYear() + i;
                                                            return <option key={year} value={year}>{year}</option>;
                                                        })}
                                                    </select>
                                                    <i className="fi fi-rr-calendar-lines absolute left-4 top-1/2 -translate-y-1/2 text-indigo-300"></i>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-2">
                                            <p className="text-[9px] font-bold text-indigo-400 uppercase ml-1">Pick Expiry Date</p>
                                            <div className="relative group">
                                                <input 
                                                    type="date"
                                                    value={customDate}
                                                    onChange={(e) => setCustomDate(e.target.value)}
                                                    className="w-full pl-10 pr-4 py-3 bg-white border border-indigo-100 rounded-xl text-xs font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all font-poppins"
                                                />
                                                <i className="fi fi-rr-calendar-clock absolute left-4 top-1/2 -translate-y-1/2 text-indigo-300"></i>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Summary Section - Comparison Style */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <span className="w-1 h-4 bg-emerald-500 rounded-full"></span>
                                <label className="text-[11px] uppercase tracking-widest font-black text-gray-400 font-poppins">Validity Overview</label>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                {/* Current Status */}
                                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 group hover:border-gray-200 transition-colors">
                                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter mb-2">Current Expiry</p>
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-gray-400 border border-gray-100">
                                            <i className="fi fi-rr-calendar-minus text-sm"></i>
                                        </div>
                                        <span className="text-sm font-bold text-gray-600 font-poppins">
                                            {formatDate(selectedUserForRenewal ? selectedUserForRenewal.expire_at : organization?.expiry_date)}
                                        </span>
                                    </div>
                                </div>

                                {/* New Status */}
                                <div className={`p-4 rounded-2xl border transition-all duration-500 ${previewExpiryDate ? 'bg-indigo-50 border-indigo-100' : 'bg-gray-50 border-gray-100'}`}>
                                    <p className={`text-[9px] font-bold uppercase tracking-tighter mb-2 ${previewExpiryDate ? 'text-indigo-400' : 'text-gray-400'}`}>New Expiry</p>
                                    <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center border transition-all ${previewExpiryDate ? 'bg-white text-indigo-600 border-indigo-200 shadow-sm animate-pulse-subtle' : 'bg-white text-gray-300 border-gray-100'}`}>
                                            <i className="fi fi-rr-calendar-check text-sm"></i>
                                        </div>
                                        <span className={`text-sm font-black font-poppins transition-all duration-300 ${previewExpiryDate ? "text-indigo-700 scale-105" : "text-gray-300"}`}>
                                            {previewExpiryDate ? formatDate(previewExpiryDate) : "—"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            
                            {previewExpiryDate && (
                                <div className="px-4 py-3 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center gap-3 animate-in fade-in zoom-in duration-500">
                                    <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-white">
                                        <i className="fi fi-rr-check text-[10px]"></i>
                                    </div>
                                    <p className="text-[10px] font-bold text-emerald-700">
                                        Target date verified. Account status will be set to <span className="uppercase">Active</span> upon confirmation.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-3 bg-gray-50/30">
                        <button
                            onClick={() => setShowRenewalModal(false)}
                            className="px-6 py-2.5 bg-white text-gray-500 border border-gray-200 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-gray-100 hover:text-gray-700 transition-all active:scale-[0.98] font-poppins"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleRenewal}
                            disabled={renewingOrg || !previewExpiryDate}
                            className="px-10 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 active:scale-[0.98] disabled:opacity-50 disabled:shadow-none font-poppins flex items-center justify-center gap-2"
                        >
                            {renewingOrg ? (
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    <i className="fi fi-rr-check-circle flex text-sm"></i>
                                    <span>Confirm Renewal</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        )}

        {/* Import Customers Modal */}
        <ImportCustomersModal 
            show={showImportModal}
            onClose={() => setShowImportModal(false)}
            onSuccess={() => {
                refreshData(true);
            }}
            preselectedOrgId={organization?.id || ""}
            preselectedCampaignId=""
        />
      </div>
    </>
  );
}
