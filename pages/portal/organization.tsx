import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import { useRouter } from "next/router";
import { useUser } from "@/components/AppLayout";
import { supabase } from "@/lib/supabase";
import ExpiryBadge from "@/components/ExpiryBadge";
import { useOrganizationData, Organization } from "@/hooks/useOrganizationData";

const formatDate = (dateString: string | null) => {
  if (!dateString) return "—";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "—";
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  } catch (e) {
    return "—";
  }
};

export default function OrganizationPage() {
  const router = useRouter();
  const { user, mounted, loading: authLoading } = useUser();
  const {
    loading,
    searchQuery,
    setSearchQuery,
    stats,
    filteredOrgs,
    fetchOrganizations
  } = useOrganizationData(user, mounted);

  const isAddOrgVisible = useMemo(() => {
    if (!mounted || !user) return false;
    // Only internal staff can create organizations
    return user.isClient === false;
  }, [mounted, user]);

  // Page level protection logic (Strict: Wait for auth to finalize)
  useEffect(() => {
    if (mounted && !authLoading && user) {
      const isOrgVisible = user.isClient === false || 
                          (user.isClient === true && user.designation?.toLowerCase() === 'ceo');
      
      if (!isOrgVisible) {
        console.warn("Unauthorized access to organization page, redirecting...");
        router.replace('/dashboard');
      }
    }
  }, [mounted, user, authLoading, router]);

  const [availableUsers, setAvailableUsers] = useState<any[]>([]);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [assigningLoading, setAssigningLoading] = useState(false);
  const [userSearchQuery, setUserSearchQuery] = useState("");
  const [showOnlyUnassigned, setShowOnlyUnassigned] = useState(false);

  const userAbortRef = useRef<AbortController | null>(null);

  const fetchUsers = useCallback(async () => {
    if (userAbortRef.current) userAbortRef.current.abort();
    userAbortRef.current = new AbortController();

    try {
      const { data, error } = await supabase
        .from("user_profiles")
        .select("id, user_name, employee_id, profile_pic_url, organization_id")
        .order("user_name")
        .abortSignal(userAbortRef.current.signal);

      if (error) throw error;
      setAvailableUsers(data || []);
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        console.error("Error fetching users:", err);
      }
    }
  }, []);

  useEffect(() => {
    if (user?.uid) {
      fetchUsers();
    }
    return () => {
        if (userAbortRef.current) userAbortRef.current.abort();
    };
  }, [user?.uid, fetchUsers]);

  // Reset modal state when closing
  useEffect(() => {
    if (!showAssignModal) {
      setSelectedUserIds([]);
      setUserSearchQuery("");
      setShowOnlyUnassigned(false);
    }
  }, [showAssignModal]);

  const handleDeleteOrganization = useCallback(async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from("organizations")
        .delete()
        .eq("id", id);

      if (error) throw error;
      fetchOrganizations();
    } catch (err) {
      console.error("Error deleting organization:", err);
      alert("Failed to delete organization. Please try again.");
    }
  }, [fetchOrganizations]);

  const handleAssignUsers = useCallback(async () => {
    if (!selectedOrg || selectedUserIds.length === 0) return;

    try {
      setAssigningLoading(true);
      
      // Perform task in smaller batches or ensure atomic nature
      const { error } = await supabase
        .from("user_profiles")
        .update({ organization_id: selectedOrg.id })
        .in("id", selectedUserIds);

      if (error) throw error;

      alert(`Successfully assigned ${selectedUserIds.length} members to ${selectedOrg.company_name}`);
      setShowAssignModal(false);
      fetchOrganizations();
      fetchUsers();
    } catch (err) {
      console.error("Error assigning users:", err);
      alert("Failed to assign users. Some assignments might not have completed.");
    } finally {
      setAssigningLoading(false);
    }
  }, [selectedOrg, selectedUserIds, fetchOrganizations, fetchUsers]);

  // Memoized user filter for the modal to avoid expensive computations on every keystroke
  const filteredUsers = useMemo(() => {
    const query = userSearchQuery.toLowerCase().trim();
    return availableUsers.filter(u => {
      const matchesSearch = !query || 
        u.user_name?.toLowerCase().includes(query) ||
        u.employee_id?.toLowerCase().includes(query);
      const matchesUnassigned = showOnlyUnassigned ? !u.organization_id : true;
      return matchesSearch && matchesUnassigned;
    });
  }, [availableUsers, userSearchQuery, showOnlyUnassigned]);


  return (
    <>
          <div className="container mx-auto px-3 sm:px-4 md:px-6 py-6 sm:py-8 pb-20 sm:pb-24 lg:pb-8 max-w-7xl">
            {/* Breadcrumbs */}
            <div className="flex items-center gap-2 text-xs text-gray-400 mb-8 px-1">
              <span className="cursor-pointer hover:text-[#4b33e8] transition-colors" onClick={() => router.push("/dashboard")}>
                Dashboard
              </span>
              <i className="fi flex fi-rr-angle-small-right text-[10px]"></i>
              <span className="text-gray-600 font-bold">Organizations</span>
            </div>

            {/* Top Banner */}
            <div className="relative overflow-hidden rounded-2xl bg-white p-6 md:p-8 shadow-sm border border-gray-100 mb-8 group">
              <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-700" />
              <div className="absolute top-0 right-0 p-8 opacity-[0.03] transform group-hover:scale-110 transition-transform duration-700">
                <i className="fi flex fi-rr-building text-9xl"></i>
              </div>

              <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                <div className="max-w-3xl">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-[#4b33e8] shadow-sm">
                      <i className="fi flex fi-rr-building text-xl"></i>
                    </div>
                    <div>
                      <h1 className="text-xl md:text-xl font-bold text-gray-800" style={{ color: "#263238", fontFamily: "'Poppins', sans-serif" }}>
                        Organization Management
                      </h1>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest bg-green-100 text-green-700 border border-green-200">
                          System Active
                        </span>
                        <div className="w-1 h-1 rounded-full bg-gray-300 mx-1"></div>
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">
                          Total Orgs: <span className="text-gray-600">{stats.total}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-500 text-sm leading-relaxed mb-6 font-medium">
                    Manage and monitor all business organizations registered on the platform. Review company profiles, ownership details, and verification status.
                  </p>
                </div>

                {isAddOrgVisible && (
                  <div className="flex flex-wrap gap-4 items-center self-start lg:self-center">
                    <button
                      onClick={() => router.push("/organization/create")}
                      className="flex items-center gap-4 px-7 py-4 rounded-2xl border border-white/10 shadow-xl shadow-indigo-200/50 transition-all hover:scale-[1.03] active:scale-95 group/btn relative overflow-hidden h-18"
                      style={{ background: "linear-gradient(135deg, #4b33e8 0%, #8b5cf6 100%)" }}
                    >
                      <div className="absolute inset-0 bg-white/10 opacity-0 group-hover/btn:opacity-100 transition-opacity"></div>
                      <div className="relative z-10 w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white group-hover/btn:bg-white/30 transition-colors shadow-sm ring-1 ring-white/30">
                        <i className="fi flex fi-rr-plus text-sm"></i>
                      </div>
                      <div className="relative z-10 flex flex-col items-start translate-y-[1px]">
                        <span className="text-base font-black text-white leading-none">Add One</span>
                        <span className="text-[10px] font-bold text-white/70 uppercase tracking-widest leading-none mt-1.5">Organization</span>
                      </div>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-8">
              {/* Total Organizations */}
              <div className="relative overflow-hidden rounded-2xl p-4 sm:p-5 transition-all duration-200 flex flex-col hover:shadow-lg hover:scale-105 h-32 sm:h-38 bg-white border border-gray-100">
                <div className="absolute inset-0" style={{ background: "radial-gradient(circle at right top, rgba(59, 130, 246, 0.12), transparent 60%)" }}></div>
                <div className="absolute -right-2 -bottom-2">
                  <i className="fi flex fi-rr-building text-5xl" style={{ color: "#3b82f6", opacity: 0.15 }}></i>
                </div>
                <div className="relative flex flex-col h-full z-10">
                  <div className="flex items-start justify-between mb-auto">
                    <p className="text-xs sm:text-sm font-medium" style={{ color: "#787E9D", fontFamily: "'Roboto', sans-serif" }}>Total Orgs</p>
                  </div>
                  <div className="mt-auto">
                    <p className="text-xl sm:text-4xl font-semibold" style={{ color: "#263238", fontFamily: "'Poppins', sans-serif" }}>{stats.total}</p>
                    <p className="text-[10px] sm:text-[11px] mt-1 font-bold text-[#787E9D]">Registered entities</p>
                  </div>
                </div>
              </div>

              {/* Active */}
              <div className="relative overflow-hidden rounded-2xl p-4 sm:p-5 transition-all duration-200 flex flex-col hover:shadow-lg hover:scale-105 h-32 sm:h-38 bg-white border border-gray-100">
                <div className="absolute inset-0" style={{ background: "radial-gradient(circle at right top, rgba(16, 185, 129, 0.12), transparent 60%)" }}></div>
                <div className="absolute -right-2 -bottom-2">
                  <i className="fi flex fi-rr-check-circle text-5xl" style={{ color: "#10b981", opacity: 0.15 }}></i>
                </div>
                <div className="relative flex flex-col h-full z-10">
                  <div className="flex items-start justify-between mb-auto">
                    <p className="text-xs sm:text-sm font-medium" style={{ color: "#787E9D", fontFamily: "'Roboto', sans-serif" }}>Active</p>
                  </div>
                  <div className="mt-auto">
                    <p className="text-xl sm:text-4xl font-semibold" style={{ color: "#263238", fontFamily: "'Poppins', sans-serif" }}>{stats.active}</p>
                    <p className="text-[10px] sm:text-[11px] mt-1 font-bold text-[#787E9D]">Currently operational</p>
                  </div>
                </div>
              </div>

              {/* Recent Joined */}
              <div className="relative overflow-hidden rounded-2xl p-4 sm:p-5 transition-all duration-200 flex flex-col hover:shadow-lg hover:scale-105 h-32 sm:h-38 bg-white border border-gray-100">
                <div className="absolute inset-0" style={{ background: "radial-gradient(circle at right top, rgba(139, 92, 246, 0.12), transparent 60%)" }}></div>
                <div className="absolute -right-2 -bottom-2">
                  <i className="fi flex fi-rr-time-past text-5xl" style={{ color: "#8b5cf6", opacity: 0.15 }}></i>
                </div>
                <div className="relative flex flex-col h-full z-10">
                  <div className="flex items-start justify-between mb-auto">
                    <p className="text-xs sm:text-sm font-medium" style={{ color: "#787E9D", fontFamily: "'Roboto', sans-serif" }}>Recent</p>
                  </div>
                  <div className="mt-auto">
                    <p className="text-xl sm:text-4xl font-semibold" style={{ color: "#263238", fontFamily: "'Poppins', sans-serif" }}>{stats.recent}</p>
                    <p className="text-[10px] sm:text-[11px] mt-1 font-bold text-[#787E9D]">Joined last 30 days</p>
                  </div>
                </div>
              </div>

              {/* Expired / Inactive */}
              <div className="relative overflow-hidden rounded-2xl p-4 sm:p-5 transition-all duration-200 flex flex-col hover:shadow-lg hover:scale-105 h-32 sm:h-38 bg-white border border-gray-100">
                <div className="absolute inset-0" style={{ background: "radial-gradient(circle at right top, rgba(239, 68, 68, 0.12), transparent 60%)" }}></div>
                <div className="absolute -right-2 -bottom-2">
                  <i className="fi flex fi-rr-cross-circle text-5xl" style={{ color: "#ef4444", opacity: 0.15 }}></i>
                </div>
                <div className="relative flex flex-col h-full z-10">
                  <div className="flex items-start justify-between mb-auto">
                    <p className="text-xs sm:text-sm font-medium" style={{ color: "#787E9D", fontFamily: "'Roboto', sans-serif" }}>Expired</p>
                  </div>
                  <div className="mt-auto">
                    <p className="text-xl sm:text-4xl font-semibold" style={{ color: "#263238", fontFamily: "'Poppins', sans-serif" }}>{stats.inactive}</p>
                    <p className="text-[10px] sm:text-[11px] mt-1 font-bold text-[#787E9D]">Subscription ended</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Organizations Grid */}
            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between px-1">
                <h2 className="text-lg font-bold text-gray-800" style={{ fontFamily: "'Poppins', sans-serif" }}>All Organizations</h2>
                <div className="relative group">
                  <input
                    type="text"
                    placeholder="Search organizations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-64 h-10 pl-10 text-gray-700 pr-4 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#4b33e8]/20 focus:border-[#4b33e8] transition-all"
                  />
                  <i className="fi flex fi-rr-search absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#4b33e8] transition-colors"></i>
                </div>
              </div>

              {loading ? (
                <div className="flex items-center justify-center p-20">
                  <div className="animate-spin rounded-full h-8 w-8 border-2 border-t-transparent border-[#4b33e8]"></div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Cards remain but with improved premium styling */}
                  {filteredOrgs.map((org) => (
                    <div
                      key={org.id}
                      onClick={() => router.push(`/organization/${org.id}`)}
                      className="group relative overflow-hidden rounded-2xl p-6 transition-all duration-300 flex flex-col bg-white border border-gray-100 hover:shadow-xl hover:-translate-y-1 cursor-pointer"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-[#4b33e8]/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      
                      <div className="relative z-10">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-[#4b33e8] transform group-hover:scale-110 transition-transform">
                              <i className="fi flex fi-rr-building text-xl"></i>
                            </div>
                            <div className="flex flex-col gap-1">
                               <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest ${
                                org.is_active ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-red-50 text-red-600 border border-red-100'
                              }`}>
                                {org.is_active ? 'Active' : 'Expired'}
                              </span>
                              <ExpiryBadge expireDate={org.expiry_date} />
                            </div>
                          </div>
                          <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                            org.company_type ? 'bg-blue-50 text-blue-600 border border-blue-100' : 'bg-gray-50 text-gray-500 border border-gray-100'
                          }`}>
                            {org.company_type || 'Unspecified'}
                          </span>
                        </div>

                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-lg font-bold text-gray-800 truncate group-hover:text-[#4b33e8] transition-colors" style={{ fontFamily: "'Poppins', sans-serif" }}>
                            {org.company_name}
                          </h3>
                          {/* Instruction 6: Hide administrative actions (Assign, Delete) on organization cards for client users */}
                          {isAddOrgVisible && (
                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedOrg(org);
                                  setShowAssignModal(true);
                                }}
                                className="w-8 h-8 rounded-lg bg-indigo-50 text-[#4b33e8] flex items-center justify-center hover:bg-[#4b33e8] hover:text-white transition-all shadow-sm"
                                title="Assign Members"
                              >
                                <i className="fi flex fi-rr-user-add text-xs"></i>
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteOrganization(org.id, org.company_name);
                                }}
                                className="w-8 h-8 rounded-lg bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-sm"
                                title="Delete Organization"
                              >
                                <i className="fi flex fi-rr-trash text-xs"></i>
                              </button>
                            </div>
                          )}
                        </div>
                        <p className="text-gray-500 text-xs leading-relaxed mb-6 line-clamp-2 min-h-[32px]">
                          {org.description || 'Provide a sustainable growth strategy for the organization.'}
                        </p>

                        <div className="grid grid-cols-2 gap-y-3 gap-x-4 pt-4 border-t border-gray-50">
                          <div className="flex flex-col gap-1">
                             <span className="text-gray-400 text-[10px] font-black uppercase tracking-tight">System ID</span>
                             <span className="text-indigo-600 text-[11px] font-black tracking-widest">
                               {org.company_code || '—'}
                             </span>
                          </div>
                          <div className="flex flex-col gap-1">
                            <span className="text-gray-400 text-[10px] font-black uppercase tracking-tight">Renewal</span>
                            <span className="text-gray-700 text-[11px] font-bold">
                              {formatDate(org.renewal_date)}
                            </span>
                          </div>
                          <div className="flex flex-col gap-1">
                            <span className="text-gray-400 text-[10px] font-black uppercase tracking-tight">Expiry</span>
                            <span className="text-gray-700 text-[11px] font-bold">
                              {formatDate(org.expiry_date)}
                            </span>
                          </div>
                          <div className="flex flex-col gap-1">
                            <span className="text-gray-400 text-[10px] font-black uppercase tracking-tight">Owner</span>
                            <span className="text-gray-700 text-[11px] font-bold truncate">{org.owner_name || '—'}</span>
                          </div>
                          <div className="flex flex-col gap-1">
                            <span className="text-gray-400 text-[10px] font-black uppercase tracking-tight">Joined</span>
                            <span className="text-gray-700 text-[11px] font-bold">
                              {formatDate(org.company_joined)}
                            </span>
                          </div>
                          <div className="flex flex-col gap-1">
                            <span className="text-gray-400 text-[10px] font-black uppercase tracking-tight">Members</span>
                            <div className="flex items-center gap-1.5">
                              {org.member_avatars && org.member_avatars.length > 0 ? (
                                <div className="flex -space-x-2 mr-1">
                                  {org.member_avatars.map((avatar, idx) => (
                                    <div key={idx} className="w-5 h-5 rounded-full border-2 border-white overflow-hidden bg-gray-100 flex-shrink-0">
                                      {avatar ? (
                                        <img src={avatar} alt="" className="w-full h-full object-cover" />
                                      ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-indigo-50 text-[8px] text-[#4b33e8] font-bold">
                                          {idx + 1}
                                        </div>
                                      )}
                                    </div>
                                  ))}
                                  {(org.member_count || 0) > 3 && (
                                    <div className="w-5 h-5 rounded-full border-2 border-white bg-indigo-50 flex items-center justify-center text-[7px] text-[#4b33e8] font-black flex-shrink-0">
                                      +{(org.member_count || 0) - 3}
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <span className="text-[#4b33e8] text-[11px] font-black">
                                  {org.member_count || 0} People
                                </span>
                              )}
                              {org.member_avatars && org.member_avatars.length > 0 && (
                                <span className="text-gray-700 text-[11px] font-bold">
                                  {org.member_count} 
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {filteredOrgs.length === 0 && (
                    <div className="col-span-full py-20 bg-white rounded-3xl border border-dashed border-gray-200 flex flex-col items-center justify-center text-center">
                      <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-300 mb-4">
                        <i className="fi fi-rr-search text-2xl"></i>
                      </div>
                      <h4 className="text-gray-800 font-bold mb-1">No organizations found</h4>
                      <p className="text-gray-400 text-sm">Try adjusting your search terms</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
      {/* Assign Members Modal */}
      {showAssignModal && selectedOrg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowAssignModal(false)}
          ></div>
          <div className="relative bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            {/* Header */}
            <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-white text-left">
              <div>
                <h2 className="text-xl font-bold text-gray-800" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  Assign Members
                </h2>
                <p className="text-xs text-gray-500 mt-1">Assign users to <span className="text-[#4b33e8] font-bold">{selectedOrg.company_name}</span></p>
              </div>
              <button 
                onClick={() => setShowAssignModal(false)}
                className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-all"
              >
                <i className="fi fi-rr-cross text-xs"></i>
              </button>
            </div>

            {/* Content */}
            <div className="p-8">
              {/* Search & Filter */}
              <div className="mb-6 flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                   <input
                    type="text"
                    placeholder="Refine users..."
                    value={userSearchQuery}
                    onChange={(e) => setUserSearchQuery(e.target.value)}
                    className="w-full h-11 pl-11 pr-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#4b33e8]/20 focus:border-[#4b33e8] transition-all"
                  />
                  <i className="fi fi-rr-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                </div>
                <button 
                  onClick={() => setShowOnlyUnassigned(!showOnlyUnassigned)}
                  className={`h-11 px-6 rounded-2xl border text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                    showOnlyUnassigned 
                      ? 'bg-indigo-50 border-[#4b33e8]/20 text-[#4b33e8]' 
                      : 'bg-white border-gray-100 text-gray-400 hover:border-gray-200'
                  }`}
                >
                  <i className={`fi flex ${showOnlyUnassigned ? 'fi-rr-user-slash' : 'fi-rr-users'} text-sm`}></i>
                  <span>{showOnlyUnassigned ? 'Showing Unassigned' : 'All Users'}</span>
                </button>
              </div>

              {/* Users List */}
              <div className="max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                <div className="grid grid-cols-1 gap-3">
                  {filteredUsers
                    .map((targetUser: any) => {
                      const isSelected = selectedUserIds.includes(targetUser.id);
                      const isAlreadyInOrg = targetUser.organization_id === selectedOrg.id;
                      // Optimized lookup using hook data
                      const otherOrg = targetUser.organization_id ? filteredOrgs.find((o: Organization) => o.id === targetUser.organization_id) : null;
                      
                      return (
                        <div 
                          key={targetUser.id}
                          onClick={() => {
                            if (isAlreadyInOrg) return;
                            setSelectedUserIds(prev => 
                              isSelected ? prev.filter(id => id !== targetUser.id) : [...prev, targetUser.id]
                            );
                          }}
                          className={`flex items-center gap-4 p-4 rounded-2xl border transition-all cursor-pointer ${
                            isSelected 
                              ? 'border-[#4b33e8] bg-indigo-50/50' 
                              : isAlreadyInOrg 
                                ? 'border-gray-100 bg-gray-50/50 opacity-60 cursor-not-allowed' 
                                : 'border-gray-100 hover:border-gray-200 bg-white'
                          }`}
                        >
                          <div className="w-10 h-10 rounded-full bg-gray-100 flex-shrink-0 overflow-hidden border border-gray-200">
                            {targetUser.profile_pic_url ? (
                              <img src={targetUser.profile_pic_url} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs font-bold bg-indigo-50 text-[#4b33e8]">
                                {targetUser.user_name?.charAt(0)}
                              </div>
                            )}
                          </div>
                          <div className="flex-1 text-left">
                            <h4 className="text-sm font-bold text-gray-800">{targetUser.user_name}</h4>
                            <div className="flex items-center gap-2">
                              <p className="text-[10px] text-gray-400 font-medium">{targetUser.employee_id || 'No ID'}</p>
                              <div className="w-1 h-1 rounded-full bg-gray-200" />
                              <span className={`text-[10px] font-bold ${!targetUser.organization_id ? 'text-amber-500' : 'text-gray-400'}`}>
                                {!targetUser.organization_id ? 'Unassigned' : otherOrg?.company_name || 'In Organization'}
                              </span>
                            </div>
                          </div>
                          {isAlreadyInOrg ? (
                            <span className="text-[10px] font-black text-green-600 bg-green-50 px-2.5 py-1.5 rounded-xl border border-green-100">Member</span>
                          ) : (
                            <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                              isSelected ? 'bg-[#4b33e8] border-[#4b33e8] text-white' : 'border-gray-200'
                            }`}>
                              {isSelected && <i className="fi fi-rr-check text-[10px]"></i>}
                            </div>
                          )}
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-8 py-6 bg-gray-50/80 backdrop-blur-sm flex items-center justify-between gap-4">
              <p className="text-xs text-gray-500 font-medium">
                <span className="text-[#4b33e8] font-bold">{selectedUserIds.length}</span> users selected
              </p>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setShowAssignModal(false)}
                  className="px-6 h-11 rounded-2xl text-sm font-bold text-gray-600 hover:bg-gray-100 transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleAssignUsers}
                  disabled={selectedUserIds.length === 0 || assigningLoading}
                  className="px-8 h-11 rounded-2xl text-sm font-bold text-white bg-[#4b33e8] hover:shadow-lg hover:shadow-indigo-500/30 disabled:opacity-50 disabled:shadow-none transition-all flex items-center gap-2"
                >
                  {assigningLoading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <span>Assign Members</span>
                      <i className="fi fi-rr-arrow-right text-[10px]"></i>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f8f9fa;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #cbd5e1;
        }
      `}</style>
    </>
  );
}
