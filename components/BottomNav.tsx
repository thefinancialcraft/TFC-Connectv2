import { useRouter } from "next/router";
import React, { memo, useState, useEffect, useRef, useMemo } from "react";
import { DashboardLevel, getUserDashboardLevel } from "@/lib/dashboardUtils";
import { supabase } from "@/lib/supabase";

// {!hideSidebar && (
//   <BottomNav
//     activeNav={activeNav}
//     userId={user?.id}
//     organizationId={user?.organization_id}
//     userRole={user?.role}
//     isSuperAdmin={user?.is_superadmin}
//     isClient={user?.is_client}
//     designation={user?.designation}
//     employeeId={user?.employee_id}
//   />
// )}

interface BottomNavProps {
  activeNav?: string;
  userId?: string | null;
  organizationId?: string | null;
  userRole?: string | null;
  isSuperAdmin?: boolean;
  isClient?: boolean;
  designation?: string | null;
  employeeId?: string | null;
}

const BottomNav = memo(function BottomNav({
  activeNav,
  userId,
  organizationId,
  userRole,
  isSuperAdmin,
  isClient,
  designation,
  employeeId,
}: BottomNavProps) {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [scrollTimer, setScrollTimer] = useState<NodeJS.Timeout | null>(null);
  const [hideTimer, setHideTimer] = useState<NodeJS.Timeout | null>(null);
  const [mounted, setMounted] = useState(false);
  const [latestSession, setLatestSession] = useState<{ campaign_id: string; customer_id: string } | null>(null);
  const [showCampaignModal, setShowCampaignModal] = useState(false);
  const [assignedCampaigns, setAssignedCampaigns] = useState<any[]>([]);
  const [isStartingSession, setIsStartingSession] = useState(false);
  
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);
  const [isLongPressActive, setIsLongPressActive] = useState(false);
  const [isPressing, setIsPressing] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    if (userId) {
      fetchLatestSession();
    }
  }, [userId]);

  // Close modal on route change and RE-FETCH latest session data
  useEffect(() => {
    setShowCampaignModal(false);
    if (userId) {
      fetchLatestSession();
    }
  }, [router.asPath, userId]);

  const fetchLatestSession = async () => {
    try {
      const { data, error } = await supabase
        .from('call_sessions')
        .select('campaign_id, customer_id')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (data && !error) {
        setLatestSession(data);
      }
    } catch (err) {
      console.error("Error fetching latest session:", err);
    }
  };

  // Check if user is admin or super_admin
  const isAdmin =
    mounted &&
    (userRole === "admin" ||
     userRole === "super_admin" ||
     isSuperAdmin === true);

  const allNavItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: "fi-rr-home",
      path: "/dashboard",
      adminOnly: false,
    },
    {
      id: "users",
      label: "Users",
      icon: "fi-rr-users",
      path: "/users",
      adminOnly: true,
    },
    {
      id: "customer",
      label: "Customer",
      icon: "fi-rr-user-add",
      path: "/customer",
      adminOnly: false,
    },
    {
      id: "campaign",
      label: "Campaign",
      icon: "fi-rr-bullhorn",
      path: "/campaign",
      adminOnly: false,
    },
    {
      id: "activity",
      label: "Activity",
      icon: "fi-rr-time-past",
      path: "/activity",
      adminOnly: false,
    },
    {
      id: "followup",
      label: "Follow Up",
      icon: "fi-rr-calendar-clock",
      path: "/followup",
      adminOnly: false,
    },
    {
      id: "call-sessions",
      label: "Call Sessions",
      icon: "fi-rr-headset",
      path: "/call-sessions",
      adminOnly: true,
    },
  ];

  // Filter nav items based on admin status and client designation
  const navItems = useMemo(() => {
    const level = getUserDashboardLevel({
        role: userRole,
        designation: designation,
        isClient: isClient
    });

    return allNavItems.filter((item) => {
      // 0. Call Sessions visibility (Admin, CEO, TL)
      if (item.id === 'call-sessions') {
        if (employeeId === 'NXUS-001') return true;
        if (level === DashboardLevel.LEVEL_4_AGENT_SALES || level === DashboardLevel.UNKNOWN) return false;
        return true;
      }

      const currentDesignation = designation?.toLowerCase() || '';

      const isUserPageVisible = mounted && (
        isClient === false || 
        (isClient === true && ['ceo', 'developer'].includes(currentDesignation))
      );

      const isTeamPageVisible = mounted && (
        isClient === false || 
        (isClient === true && ['manager', 'team_leader', 'ceo', 'developer'].includes(currentDesignation))
      );

      const isAdminState = mounted && isAdmin;

      // Filter logic
      if (item.adminOnly && !isAdminState && employeeId !== 'NXUS-001') return false;
      if (item.id === 'users' && !isUserPageVisible) return false;
      if (item.id === 'team' && !isTeamPageVisible) return false;
      
      return true;
    });
  }, [mounted, isAdmin, isClient, designation, employeeId, allNavItems]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        // Scrolling down
        setIsVisible(false);
      } else {
        // Scrolling up
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);

      // Clear existing timers
      if (scrollTimer) {
        clearTimeout(scrollTimer);
      }
      if (hideTimer) {
        clearTimeout(hideTimer);
      }

      // Set timer to detect scroll stop (3 seconds)
      const newScrollTimer = setTimeout(() => {
        // Show navbar after 3 seconds of no scrolling
        setIsVisible(true);

        // Hide navbar after 6 more seconds
        const newHideTimer = setTimeout(() => {
          setIsVisible(false);
        }, 6000);

        setHideTimer(newHideTimer);
      }, 3000);

      setScrollTimer(newScrollTimer);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimer) clearTimeout(scrollTimer);
      if (hideTimer) clearTimeout(hideTimer);
    };
  }, [lastScrollY, scrollTimer, hideTimer]);

  const handleNavClick = (path: string) => {
    router.push(path);
  };

  const handleLongPressStart = () => {
    setIsLongPressActive(false);
    setIsPressing(true);
    longPressTimer.current = setTimeout(async () => {
      setIsLongPressActive(true);
      await fetchAssignedCampaigns();
      setShowCampaignModal(true);
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(50);
      }
      setIsPressing(false);
    }, 600); // 600ms hold time
  };

  const handleLongPressEnd = () => {
    setIsPressing(false);
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
    }
  };

  const handleCallRedirect = async () => {
    if (!userId || isStartingSession) return;
    setIsStartingSession(true);
    
    try {
      // 1. Dhoondhiye sabse recent session (chahe closed ho ya active)
      const { data: latestEntry, error: fetchErr } = await supabase
        .from('call_sessions')
        .select('campaign_id, customer_id, status')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (!fetchErr && latestEntry) {
        // Agar session abhi bhi active/pending hai, toh wahan bhejिये
        if (latestEntry.status !== 'closed') {
          router.push(`/portal/campaign/${latestEntry.campaign_id}/${latestEntry.customer_id}`);
          setIsStartingSession(false);
          return;
        }

        // Agar session closed tha, toh usi campaign ke liye naya lead pull kijiye
        const { data: nextLeadId, error: rpcErr } = await supabase.rpc('assign_next_lead', {
          p_user_id: userId,
          p_campaign_id: latestEntry.campaign_id
        });

        if (nextLeadId && !rpcErr) {
          router.push(`/portal/campaign/${latestEntry.campaign_id}/${nextLeadId}`);
          setIsStartingSession(false);
          return;
        }
      }

      // 2. Agar koi purana session nahi mila (New User), tab campaigns check kijiye
      const campaigns = await fetchAssignedCampaigns();
      
      if (campaigns && campaigns.length === 1) {
        // Direct start if only one
        const { data: leadId, error: directErr } = await supabase.rpc('assign_next_lead', {
          p_user_id: userId,
          p_campaign_id: campaigns[0].id
        });

        if (leadId && !directErr) {
          router.push(`/portal/campaign/${campaigns[0].id}/${leadId}`);
        } else {
          alert("No leads available in your assigned campaign.");
        }
      } else if (campaigns && campaigns.length > 1) {
        setShowCampaignModal(true);
      } else {
        alert("No active campaigns assigned to you.");
      }
    } catch (err) {
      console.error("Error in Call Button workflow:", err);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsStartingSession(false);
    }
  };

  const fetchAssignedCampaigns = async () => {
    if (!organizationId) return [];
    try {
      const { data, error } = await supabase
        .from('campaigns')
        .select('id, name, users')
        .eq('organization_id', organizationId)
        .eq('status', 'active');
      
      if (data && !error) {
        const filtered = data.filter(c => {
            if (!c.users || !Array.isArray(c.users)) return false;
            return c.users.some((u: any) => u.user_id === userId);
        });
        setAssignedCampaigns(filtered);
        return filtered;
      }
      return [];
    } catch (err) {
      console.error("Error fetching assigned campaigns:", err);
      return [];
    }
  };

  const startNewSession = async (campaignId: string) => {
    if (!userId || isStartingSession) return;
    setIsStartingSession(true);
    
    try {
      const { data: leadId, error } = await supabase.rpc('assign_next_lead', {
        p_user_id: userId,
        p_campaign_id: campaignId
      });

      if (leadId && !error) {
        router.push(`/portal/campaign/${campaignId}/${leadId}`);
        setShowCampaignModal(false);
      } else {
        alert("No leads available in this campaign.");
      }
    } catch (error) {
      console.error("Error starting session:", error);
      alert("Failed to start session. Please try again.");
    } finally {
      setIsStartingSession(false);
    }
  };

  const isCallingPage = router.pathname.includes('/campaign/') && 
                       (router.pathname.includes('[id]') || router.pathname.includes('profile'));

  return (
    <div className="lg:hidden">
      {/* Floating Call Button - Independent Fixed Positioning */}
      {!isCallingPage && (
        <button
          onClick={() => {
            if (!isLongPressActive) handleCallRedirect();
          }}
          onMouseDown={handleLongPressStart}
          onMouseUp={handleLongPressEnd}
          onMouseLeave={handleLongPressEnd}
          onTouchStart={handleLongPressStart}
          onTouchEnd={handleLongPressEnd}
          disabled={isStartingSession}
          className={`fixed right-4 z-[60] w-14 h-14 bg-[#4b33e8] text-white rounded-full shadow-2xl flex items-center justify-center transition-all duration-500 ease-in-out active:scale-90 group overflow-hidden border-[1.5px] border-indigo-300/50 ${
            isVisible ? "bottom-28 scale-100 opacity-100 translate-x-0" : "bottom-28 scale-50 opacity-0 translate-x-20"
          } ${isStartingSession ? 'cursor-not-allowed' : 'cursor-pointer'} ${
            isPressing ? "scale-110 ring-[6px] ring-indigo-400/20 shadow-indigo-500/40 rotate-12" : ""
          }`}
        >
          {/* Animated Background Pulse */}
          <span className={`absolute inset-0 bg-white/20 transition-transform duration-[600ms] ease-linear rounded-full ${
            isPressing ? "scale-100" : "scale-0"
          }`}></span>
          
          <span className="absolute inset-0 bg-white/20 scale-0 group-hover:scale-150 transition-transform duration-500 rounded-full"></span>
          
          {isStartingSession ? (
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <i className="fi fi-rr-phone-call text-2xl flex relative z-10"></i>
          )}
        </button>
      )}

      {/* Centered Navigation Bar */}
      <div
        className={`fixed left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ease-out transform-gpu ${
          isVisible ? "bottom-8 translate-y-0" : "bottom-8 translate-y-40"
        }`}
        style={{ width: "94%", maxWidth: "420px", backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
      >
        <div
          className="backdrop-blur-xl bg-white/40 shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-2xl border border-white/60 overflow-hidden"
        >
          <div className="px-4 py-2.5">
            <div className="flex items-center justify-between">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.path)}
                  className={`flex items-center justify-center p-3 rounded-xl transition-all ${
                    activeNav === item.id || router.pathname === item.path
                      ? "scale-110"
                      : "hover:bg-gray-100"
                  }`}
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  <i
                    className={`fi flex ${item.icon} text-xl transition-colors ${
                      activeNav === item.id || router.pathname === item.path || router.pathname === '/portal' + item.path
                        ? "text-[#4b33e8]"
                        : "text-gray-600"
                    }`}
                  ></i>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Campaign Selection Modal */}
      {showCampaignModal && !isCallingPage && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => setShowCampaignModal(false)}
          ></div>
          
          <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-10 duration-300">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-[18px] font-black text-slate-800 leading-tight">Start Calling</h3>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">Select Active Campaign</p>
                </div>
                <button 
                  onClick={() => setShowCampaignModal(false)}
                  className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-rose-50 hover:text-rose-500 transition-all"
                >
                  <i className="fi fi-rr-cross-small text-xl flex"></i>
                </button>
              </div>

              {assignedCampaigns.length === 0 ? (
                <div className="py-8 text-center">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="fi fi-rr-bullhorn text-slate-300 text-2xl flex"></i>
                  </div>
                  <p className="text-[13px] font-bold text-slate-500">No campaigns assigned to you</p>
                  <button 
                    onClick={() => setShowCampaignModal(false)}
                    className="mt-4 px-6 py-2 bg-slate-100 text-slate-600 rounded-full text-[11px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all"
                  >
                    Close
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-3 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
                  {assignedCampaigns.map((camp) => (
                    <button
                      key={camp.id}
                      disabled={isStartingSession}
                      onClick={() => startNewSession(camp.id)}
                      className="group w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-indigo-50 border border-slate-100 hover:border-indigo-200 rounded-2xl transition-all text-left disabled:opacity-50"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform">
                          <i className="fi fi-rr-bullhorn text-lg flex"></i>
                        </div>
                        <div>
                          <p className="text-[14px] font-black text-slate-800 leading-none">{camp.name}</p>
                          <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mt-1.5">Action: Pull Lead</p>
                        </div>
                      </div>
                      <i className="fi fi-rr-angle-small-right text-slate-300 group-hover:translate-x-1 group-hover:text-indigo-400 transition-all flex text-lg"></i>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {isStartingSession && (
              <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex flex-col items-center justify-center gap-4 z-10 animate-in fade-in duration-200">
                <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-[12px] font-black text-indigo-600 uppercase tracking-widest animate-pulse">Initializing Session...</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
});

export default BottomNav;
