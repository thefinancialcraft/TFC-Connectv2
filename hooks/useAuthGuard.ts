import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import {
  checkAuthAndFetchProfile,
  UserProfile,
} from "../lib/authService";
import { supabase } from "../lib/supabase";

export interface UseAuthGuardReturn {
  user: UserProfile | null;
  loading: boolean;
  error: string;
  mounted: boolean;
  statusMessage: string;
  refetchUser: (force?: boolean) => Promise<void>;
  sessionExpired: boolean;
}

export function useAuthGuard(): UseAuthGuardReturn {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);
  const [statusMessage, setStatusMessage] = useState("Checking session...");
  const [sessionExpired, setSessionExpired] = useState(false);
  const loadingRef = useRef(false);

  const fetchAuth = async (force = false) => {
    // Production Pattern: If we already have a user and aren't forcing a refresh, skip the loading screen and call.
    if (!force && user && !loadingRef.current) {
        console.log("🚀 [Auth] User already in memory. Skipping redundant fetch.");
        return;
    }

    if (loadingRef.current) return;
    loadingRef.current = true;
    
    if (!user) setLoading(true);
    
    try {
      const isLoginPage = router.pathname === "/login" || router.pathname === "/auth/login" || router.pathname === "/portal/login";
      const isPublicLandingPage = router.pathname === "/home" || router.pathname === "/signup" || router.pathname === "/signup-success" || router.pathname === "/contact" || router.pathname === "/features" || router.pathname === "/pricing" || router.pathname === "/faq";
      const isRootPath = router.pathname === "/";
      
      setStatusMessage("Verifying active session...");
      const { data: { session: authSession }, error: authError } = await supabase.auth.getSession();
      const authUser = authSession?.user;

      if (authUser) {
        setSessionExpired(false);
        // --- ⚡ SESSION PROFILE CACHE (Ghostly Fetch Prevention) ---
        // Keeps the profile in memory for the duration of the tab so we don't hit the DB/API every reload.
        const sessionProfileStr = typeof window !== 'undefined' ? sessionStorage.getItem('active_user_profile') : null;
        if (sessionProfileStr && !force) {
            try {
                const cachedProfile = JSON.parse(sessionProfileStr);
                
                // CRITICAL: Even if cached, we must occasionally verify status from DB to catch suspensions
                // For now, let's allow the UI to show up but trigger a background check if status is important
                setUser(cachedProfile);
                console.log("⚡ [Auth] Restored User Profile from Session Tab Memory.");
                
                // If it's a critical page, we force a background verification
                if (router.pathname.includes('/portal')) {
                    console.log("🔍 [Auth] Background Status Verification Triggered...");
                    checkAuthAndFetchProfile().then(result => {
                        if (result.user) {
                            const dbStatus = result.user.status || result.user.accountStatus;
                            const dbApproval = result.user.approvalStatus;

                            // If status changed to something restricted, update user state to trigger redirection
                            if (dbStatus === 'suspend' || dbStatus === 'hold' || dbStatus === 'inactive' || 
                                dbApproval === 'pending' || dbApproval === 'rejected' || dbApproval === 'hold' || dbApproval === 'suspend') {
                                
                                console.log(`🚨 [Auth] Restricted status detected (${dbStatus}/${dbApproval}). Redirecting...`);
                                setUser(result.user); // This will trigger the router useEffect
                                sessionStorage.setItem('active_user_profile', JSON.stringify(result.user));
                            } else {
                                // Status is active, just update memory if there's any difference
                                setUser(result.user);
                                sessionStorage.setItem('active_user_profile', JSON.stringify(result.user));
                            }
                        }
                    });
                }

                if ((isLoginPage || isRootPath) && !isPublicLandingPage) {
                    const lastPath = typeof window !== 'undefined' ? localStorage.getItem('last_visited_path') : null;
                    router.push(lastPath || "/dashboard");
                }
                setLoading(false);
                loadingRef.current = false;
                return;
            } catch (e) {
                console.warn("Failed to parse session profile cache", e);
            }
        }

        // Fetch/Refresh Profile from DB (Only happens on very first login or when tab is perfectly closed)
        setStatusMessage("Fetching user profile...");
        const result = await checkAuthAndFetchProfile();
        
        if (result.user) {
          if (!user) setStatusMessage("Finalizing setup...");
          
          setUser(result.user);
          // Store securely in Tab Memory
          if (typeof window !== 'undefined') {
              sessionStorage.setItem('active_user_profile', JSON.stringify(result.user));
              
              // Also update localStorage for quick-start/ghost-loading
              try {
                  const { storeUserData, getStoredUserData } = require("../lib/localStorageUtils");
                  const currentData = getStoredUserData();
                  if (currentData) {
                      storeUserData({
                          ...currentData,
                          user_name: result.user.displayName || currentData.user_name,
                          displayName: result.user.displayName || currentData.displayName,
                          profile_pic_url: result.user.profilePicUrl || currentData.profile_pic_url,
                          employee_id: result.user.employeeId || currentData.employee_id,
                          email: result.user.email || currentData.email,
                          status: result.user.status || currentData.status,
                          role: result.user.role || currentData.role,
                          organization_id: result.user.organization_id || currentData.organization_id,
                          designation: result.user.designation || currentData.designation,
                      });
                  }
              } catch (e) { console.warn("Failed to sync to localStorage", e); }
          }
          
          // Logged in: if on login/root, move to dashboard or last path
          if ((isLoginPage || isRootPath) && !isPublicLandingPage) {
            if (!user) setStatusMessage("Restoring your screen...");
            const lastPath = typeof window !== 'undefined' ? localStorage.getItem('last_visited_path') : null;
            router.push(lastPath || "/dashboard");
          }
        } else if (result.shouldRedirect) {
           setUser(null);
           if (!isLoginPage && !isPublicLandingPage && !isRootPath) {
             setStatusMessage("Auth failed. Redirecting...");
             router.push("/login");
           }
        }
      } else {
        // Not logged in
        setUser(null);
        if (!isLoginPage && !isPublicLandingPage && !isRootPath) {
            // If we had a user before, but now we don't, it might be an expiration
          if (user || typeof window !== 'undefined' && sessionStorage.getItem('active_user_profile')) {
              setSessionExpired(true);
          } else {
              setStatusMessage("Access denied. Please login...");
              router.push("/login");
          }
        }
      }
    } catch (err: any) {
      console.error("Auth check failed:", err);
      // Clear cache on fatal auth errors
      if (typeof window !== "undefined") {
          localStorage.removeItem("cached_user_profile");
      }
      setError(err.message || "Authentication error");
    } finally {
      setLoading(false);
      loadingRef.current = false;
    }
  };

  // 1. Initial Auth Setup & Global Listener
  useEffect(() => {
    setMounted(true);
    fetchAuth(); // Initial Check
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log(`🔐 [Auth Event] ${event}`);
      
      if (event === 'SIGNED_IN') {
        setSessionExpired(false);
        fetchAuth(true); // Sync data only on explicit login
      } else if (event === 'SIGNED_OUT' || event === 'USER_UPDATED' && !session) {
        // Immediate check for session expiry UI
        const isManualLogout = typeof window !== 'undefined' && localStorage.getItem('manual_logout_intended') === 'true';
        const hasSessionCache = typeof window !== 'undefined' && !!sessionStorage.getItem('active_user_profile');
        
        if (isManualLogout) {
            console.log("👋 [Auth Guard] Manual logout detected. Redirecting...");
            localStorage.removeItem('manual_logout_intended');
            setSessionExpired(false);
            setUser(null);
            router.push("/login");
            return;
        }

        if (user || hasSessionCache) {
            console.log("🚫 [Auth Guard] Detected expiry event. Showing UI.");
            if (typeof window !== "undefined") {
                localStorage.removeItem("cached_user_profile");
                sessionStorage.removeItem("active_user_profile");
            }
            setSessionExpired(true);
            setUser(null);
        } else {
            setUser(null);
            router.push("/login");
        }
      }
    });

    // ⚡ PROACTIVE LISTENERS
    // 1. Cross-tab logout detection
    const handleStorageChange = (e: StorageEvent) => {
        if (e.key && e.key.includes('auth-token') && !e.newValue && (user || sessionStorage.getItem('active_user_profile'))) {
            setSessionExpired(true);
            setUser(null);
        }
    };

    // 2. Immediate check on tab focus
    const handleVisibilityChange = () => {
        if (document.visibilityState === 'visible' && (user || sessionStorage.getItem('active_user_profile'))) {
            fetchAuth(); 
        }
    };

    // ⚡ LOCAL-LEVEL HEARTBEAT (Instant LocalStorage Monitor)
    // Every 2 seconds, we check if the Supabase token still exists. 
    // This catches manual deletions or system-level expiries immediately without server round-trips.
    const localHeartbeat = setInterval(() => {
        if (typeof window === 'undefined') return;
        
        const hasToken = Object.keys(localStorage).some(key => key.includes('auth-token'));
        const hasProfile = !!sessionStorage.getItem('active_user_profile');
        const isManualLogout = localStorage.getItem('manual_logout_intended') === 'true';
        
        if (!hasToken && (user || hasProfile) && !sessionExpired && !isManualLogout) {
            console.log("🚨 [Auth Guard] Local token missing. Locking system.");
            setSessionExpired(true);
            setUser(null);
            
            // Clean up
            sessionStorage.removeItem('active_user_profile');
            localStorage.removeItem('cached_user_profile');
        }
    }, 2000);

    return () => {
      subscription.unsubscribe();
      window.removeEventListener('storage', handleStorageChange);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      clearInterval(localHeartbeat);
    };
  }, [user, router.pathname, sessionExpired]);

  // 1.5 Real-time Profile Synchronization
  useEffect(() => {
    if (!user?.uid || !mounted) return;

    console.log("📡 [Auth Guard] Subscribing to profile updates for:", user.uid);
    const channel = supabase
      .channel(`profile-${user.uid}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'user_profiles',
          filter: `user_id=eq.${user.uid}`,
        },
        (payload) => {
          console.log("✨ [Auth Guard] Profile update detected!", payload);
          // Force a silent refresh of the user profile from DB to ensure state consistency
          fetchAuth(true);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.uid, mounted]);

  // 2. Production Pattern: Pure Route Protection on every navigation
  // This runs when the URL changes but does NOT trigger a heavy fetchAuth unless necessary.
  useEffect(() => {
    if (!mounted || loading || sessionExpired) return;

    const isLoginPage = router.pathname === "/login" || router.pathname === "/portal/login";
    const isPublicLandingPage = ["/home", "/signup", "/signup-success", "/contact", "/features", "/pricing", "/faq"].includes(router.pathname);
    const isRootPath = router.pathname === "/";

    if (!user) {
        // Not logged in and trying to access protected page
        if (!isLoginPage && !isPublicLandingPage && !isRootPath) {
            router.push("/login");
        }
    } else {
        // Logged in: Check status for specific redirects
        // If user is on a protected page, enforce status-based routing
        if (!isPublicLandingPage) {
            const status = user.status || user.accountStatus;
            const approvalStatus = user.approvalStatus;
            const isRestrictedPage = ['/portal/suspended', '/portal/hold', '/portal/pending', '/portal/rejected'].includes(router.pathname);

            if (status === 'suspend' || approvalStatus === 'suspend') {
                if (router.pathname !== '/portal/suspended') {
                    router.push("/portal/suspended");
                }
            } else if (status === 'hold' || approvalStatus === 'hold') {
                if (router.pathname !== '/portal/hold') {
                    router.push("/portal/hold");
                }
            } else if (approvalStatus === 'pending') {
                if (router.pathname !== '/portal/pending') {
                    router.push("/portal/pending");
                }
            } else if (approvalStatus === 'rejected') {
                if (router.pathname !== '/portal/rejected') {
                    router.push("/portal/rejected");
                }
            } else if (status === 'active' || approvalStatus === 'approved') {
                // User is fully active/approved
                // If they are on a restricted page, send them back to dashboard
                if (isRestrictedPage || isLoginPage || isRootPath) {
                    const lastPath = localStorage.getItem('last_visited_path');
                    router.push(lastPath && !isRestrictedPage ? lastPath : "/dashboard");
                } else if (!isPublicLandingPage) {
                    // Save the valid current path
                    if (typeof window !== 'undefined') {
                        localStorage.setItem('last_visited_path', router.asPath);
                    }
                }
            }
        }
    }
  }, [router.pathname, router.asPath, user?.uid, mounted, loading, sessionExpired]);

  return { user, loading, error, mounted, statusMessage, refetchUser: fetchAuth, sessionExpired };
}
