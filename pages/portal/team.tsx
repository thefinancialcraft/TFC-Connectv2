import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { useRouter } from "next/router";
import { useUser } from "@/components/AppLayout";
import { supabase } from "@/lib/supabase";
import { handleLogout } from "@/lib/authService";
import TeamManagementModal from "@/components/TeamManagementModal";
import { useSessionState } from "@/hooks/useSessionState";

export default function Team() {
  const router = useRouter();
  const { user, mounted, loading: authLoading } = useUser();
  
  // Page level protection logic (Strict: Redirect only after auth is finalized)
  useEffect(() => {
    if (mounted && !authLoading && user) {
      // Allowed designations for clients (Expanded for robustness)
      const allowedClientDesignations = ['manager', 'team_leader', 'teamleader', 'ceo', 'developer', 'admin', 'super_admin'];
      const userDesignation = user.designation?.toLowerCase().replace(/\s+/g, '_') || '';
      
      const isTeamPageVisible = user.isClient === false || 
                                 (user.isClient === true && allowedClientDesignations.includes(userDesignation));
      
      if (!isTeamPageVisible) {
        console.warn("Unauthorized access to team page, redirecting...");
        router.replace('/dashboard');
      }
    }
  }, [mounted, user, authLoading, router]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const isLevel2User = useMemo(() => {
    if (!mounted || !user) return false;
    const designation = user.designation?.toLowerCase() || '';
    return user.isClient === true && (designation === 'team_leader' || designation === 'teamleader');
  }, [mounted, user]);

  const isCreateTeamButtonVisible = useMemo(() => {
    if (!mounted || !user) return false;
    
    const isInternalStaff = user.isClient === false;
    const designation = user.designation?.toLowerCase() || '';
    const isClientAdmin = user.isClient === true && ['ceo', 'manager', 'developer'].includes(designation);
    
    return isInternalStaff || isClientAdmin;
  }, [mounted, user]);
  
  const [teams, setTeams] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useSessionState<string>("team_searchQuery", "");
  const [showModal, setShowModal] = useState(false);
  const [editingTeam, setEditingTeam] = useState<any>(null);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [organizations, setOrganizations] = useState<any[]>([]);

  const teamsAbortControllerRef = useRef<AbortController | null>(null);
  const depsAbortControllerRef = useRef<AbortController | null>(null);

  const fetchDependencies = useCallback(async () => {
    // Prevent duplicate fetching if data already exists
    if (allUsers.length > 0 && organizations.length > 0) return;

    if (depsAbortControllerRef.current) {
        depsAbortControllerRef.current.abort();
    }
    depsAbortControllerRef.current = new AbortController();

    try {
      const [usersRes, orgsRes] = await Promise.all([
        supabase.from('user_profiles')
          .select('user_id, user_name, email, profile_pic_url, organization_id')
          .abortSignal(depsAbortControllerRef.current.signal),
        supabase.from('organizations')
          .select('id, company_name')
          .abortSignal(depsAbortControllerRef.current.signal)
      ]);

      if (usersRes.data) {
        setAllUsers(usersRes.data.map((u: any) => ({ ...u, uid: u.user_id })));
      }
      if (orgsRes.data) {
        setOrganizations(orgsRes.data);
      }
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        console.error("Error fetching dependencies:", err);
      }
    }
  }, [allUsers.length, organizations.length]);

  const fetchTeams = useCallback(async (isBackground = false) => {
      if (teamsAbortControllerRef.current) {
          teamsAbortControllerRef.current.abort();
      }
      teamsAbortControllerRef.current = new AbortController();

      try {
          if (!isBackground) setLoading(true);
          
          // Use direct user object to avoid memo race conditions during hydration
          const designation = user?.designation?.toLowerCase() || '';
          const isActuallyLevel2 = user?.isClient === true && (designation === 'team_leader' || designation === 'teamleader');
          const isHighLevelAdmin = user?.isClient === true && ['ceo', 'manager', 'developer'].includes(designation);
          const isStaff = user?.isClient === false;

          let query = supabase
              .from('teams')
              .select(`
                *,
                leader:user_profiles!leader_id(user_name, profile_pic_url),
                organization:organizations(company_name)
              `)
              .order('name', { ascending: true });

          // --- SECURITY LAYER 1: Scope to Organization for all Clients ---
          if (user?.isClient === true && user?.organization_id) {
              query = query.eq('organization_id', user.organization_id);
          }

          // --- SECURITY LAYER 2: Level-based Filtering ---
          if (isActuallyLevel2 && user?.uid) {
              query = query.eq('leader_id', user.uid);
          } else if (!isHighLevelAdmin && !isStaff) {
              // If they are a standard client user (not CEO/Manager), and somehow reach here, 
              // strictly filter by their ID as a safety fallback
              query = query.eq('leader_id', user?.uid || '00000000-0000-0000-0000-000000000000');
          }
          
          const { data, error } = await query
              .abortSignal(teamsAbortControllerRef.current.signal);
          
          if (error) throw error;
          setTeams(data || []);
      } catch (err: any) {
          if (err.name !== 'AbortError') {
            console.error("Error fetching teams:", err);
          }
      } finally {
          if (!isBackground) setLoading(false);
      }
  }, [user?.uid, user?.isClient, user?.designation, user?.organization_id]);

  useEffect(() => {
    if (mounted && user) {
      fetchTeams();
      fetchDependencies();
    }

    return () => {
      if (teamsAbortControllerRef.current) teamsAbortControllerRef.current.abort();
      if (depsAbortControllerRef.current) depsAbortControllerRef.current.abort();
    };
  }, [mounted, user, fetchTeams, fetchDependencies, isLevel2User]);

  const handleDeleteTeam = async (teamId: string) => {
    if (!window.confirm("Are you sure you want to delete this team? This action cannot be undone.")) return;
    
    try {
      setLoading(true);
      const { error } = await supabase
        .from('teams')
        .delete()
        .eq('id', teamId);
        
      if (error) throw error;
      
      // Refresh the list
      fetchTeams();
    } catch (err: any) {
      console.error("Error deleting team:", err);
      alert("Failed to delete team: " + (err.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  };


  // Filter teams based on search and permissions
  const filteredTeams = useMemo(() => {
    // Stage 0: Hydration Gate (No data until mount + user verified)
    if (!mounted || !user) return [];
    
    // Stage 1: Permission Filter (Strict layer of security)
    const designation = user.designation?.toLowerCase() || '';
    const isActuallyLevel2 = user.isClient === true && (designation === 'team_leader' || designation === 'teamleader');
    const isHighLevelAdmin = user.isClient === true && ['ceo', 'manager', 'developer'].includes(designation);
    
    let accessibleTeams = teams;
    if (isActuallyLevel2) {
        // Double-check leader_id strictly on the frontend too
        accessibleTeams = teams.filter(t => t.leader_id === user.uid);
    } else if (!isHighLevelAdmin && user.isClient === true) {
        // Safety: If not an admin, filter strictly by user ID
        accessibleTeams = teams.filter(t => t.leader_id === user.uid);
    }

    // Stage 2: Search Filter
    const query = searchQuery.toLowerCase().trim();
    if (!query) return accessibleTeams;
    
    return accessibleTeams.filter(team => 
        team.name?.toLowerCase().includes(query) ||
        team.organization?.company_name?.toLowerCase().includes(query) ||
        team.leader?.user_name?.toLowerCase().includes(query)
    );
  }, [teams, searchQuery, mounted, user]);


  return (
    <>
          <div className="container mx-auto px-3 sm:px-4 md:px-6 py-6 sm:py-8 pb-20 sm:pb-24 lg:pb-8 max-w-7xl">
            
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-800" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  Teams
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  Manage your teams, leaders, and members.
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="relative w-full sm:w-64">
                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <i className="fi flex fi-rr-search text-gray-400"></i>
                   </div>
                   <input
                      type="text"
                      placeholder="Search teams..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 pr-4 text-gray-500 py-2 w-full border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#4b33e8] focus:border-transparent outline-none text-sm bg-white shadow-sm transition-all"
                   />
                </div>
                {isCreateTeamButtonVisible && (
                  <button 
                    onClick={() => { setEditingTeam(null); setShowModal(true); }}
                    className="flex items-center justify-center gap-2 px-6 py-2 rounded-xl bg-[#4b33e8] text-white text-sm font-bold shadow-lg shadow-indigo-100 hover:opacity-90 transition-all whitespace-nowrap"
                  >
                    <i className="fi fi-rr-plus flex"></i>
                    Create Team
                  </button>
                )}
              </div>
            </div>

            {/* Content */}
            {loading && teams.length === 0 ? (
                <div className="flex justify-center py-12">
                   <div className="animate-spin rounded-full h-8 w-8 border-2 border-t-transparent border-[#4b33e8]"></div>
                </div>
            ) : filteredTeams.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredTeams.map(team => (
                        <div key={team.id} className="bg-white rounded-2xl  overflow-hidden hover:shadow-md transition-all duration-300 border border-gray-100 flex flex-col">
                            <div className="p-5 flex-1">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="w-12 h-12 rounded-lg bg-blue-50 text-[#4b33e8] flex items-center justify-center text-xl">
                                        <i className="fi flex fi-rr-users-alt"></i>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {isCreateTeamButtonVisible && (
                                          <>
                                            <button 
                                              onClick={() => { setEditingTeam(team); setShowModal(true); }}
                                              className="w-8 h-8 rounded-lg bg-gray-50 text-gray-400 hover:text-[#4b33e8] hover:bg-indigo-50 flex items-center justify-center transition-all"
                                              title="Edit Team"
                                            >
                                              <i className="fi fi-rr-edit flex text-sm"></i>
                                            </button>
                                            <button 
                                              onClick={() => handleDeleteTeam(team.id)}
                                              className="w-8 h-8 rounded-lg bg-gray-50 text-gray-400 hover:text-red-500 hover:bg-red-50 flex items-center justify-center transition-all"
                                              title="Delete Team"
                                            >
                                              <i className="fi fi-rr-trash flex text-sm"></i>
                                            </button>
                                          </>
                                        )}
                                        <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${team.is_active ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                                            {team.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                    </div>
                                </div>

                                <h3 className="text-lg font-bold text-gray-800 mb-1" style={{ fontFamily: "'Poppins', sans-serif" }}>
                                    {team.name}
                                </h3>
                                <div className="text-xs text-gray-500 mb-4 flex items-center gap-1.5">
                                    <i className="fi flex fi-rr-building text-gray-400"></i>
                                    {team.organization?.company_name || 'No Organization'}
                                </div>
                                
                                <div className="space-y-3 pt-4 border-t border-gray-50">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs overflow-hidden border border-white shadow-sm shrink-0">
                                            {team.leader?.profile_pic_url ? (
                                                <img src={team.leader.profile_pic_url} alt="Leader" className="w-full h-full object-cover" />
                                            ) : (
                                                <i className="fi fi-rr-user text-gray-400"></i>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs text-gray-400 font-medium">Team Leader</p>
                                            <p className="text-sm font-semibold text-gray-700 truncate">{team.leader?.user_name || 'Unassigned'}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-500 flex items-center justify-center text-xs shrink-0">
                                            <i className="fi flex fi-rr-user"></i>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-400 font-medium">Members</p>
                                            <p className="text-sm font-semibold text-gray-700">{team.members?.length || 0} Members</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="bg-gray-50 px-5 py-3 border-t border-gray-100 flex justify-end">
                                <button 
                                    onClick={() => router.push(`/team/${team.id}`)}
                                    className="text-xs font-semibold text-[#4b33e8] hover:text-[#3a25b0] transition-colors flex items-center gap-1"
                                >
                                    View Details <i className="fi fi-rr-arrow-right text-[10px] mt-0.5"></i>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-200">
                    <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
                        <i className="fi flex fi-rr-users-alt text-gray-400"></i>
                    </div>
                    <h3 className="text-gray-900 font-medium">No teams found</h3>
                    <p className="text-gray-500 text-sm mt-1">Create a team in the database to get started.</p>
                </div>
            )}

          </div>

      <TeamManagementModal 
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSave={() => fetchTeams()}
        team={editingTeam}
        users={allUsers}
        organizations={organizations}
      />
    </>
  );
}
