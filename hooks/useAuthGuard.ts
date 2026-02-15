import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import {
  checkAuthAndFetchProfile,
  UserProfile,
} from "../lib/authService";
import { supabase } from "../lib/supabase";
import { getStoredUserData, storeUserData } from "../lib/localStorageUtils";
import { getStoredAccounts } from "../lib/sessionManager";
import { useSessionHeartbeat } from "./useSessionHeartbeat";

export interface UseAuthGuardReturn {
  user: UserProfile | null;
  loading: boolean;
  error: string;
  mounted: boolean;
  refetchUser: () => Promise<void>;
}

export function useAuthGuard(): UseAuthGuardReturn {
  const router = useRouter();
  
  const [user, setUser] = useState<UserProfile | null>(() => {
    // Initial load from localStorage for ghost loading
    const cachedData = getStoredUserData();
    if (cachedData) {
      return {
        uid: cachedData.user_id || "",
        displayName: cachedData.user_name || cachedData.displayName || null,
        email: cachedData.email || "",
        phone: null,
        providers: [],
        providerType: null,
        createdAt: "",
        lastSignInAt: null,
        employeeId: cachedData.employee_id || null,
        role: cachedData.role || null,
        approvalStatus: cachedData.approval_status || null,
        accountStatus: cachedData.status || null,
        updatedAt: cachedData.updated_at || null,
        profilePicUrl: cachedData.profile_pic_url || null,
        statusReason: cachedData.status_reason || null,
        holdStartDate: cachedData.hold_start_date || null,
        holdEndDate: cachedData.hold_end_date || null,
        allTimeActive: cachedData.all_time_active ?? true,
        isCaller: cachedData.is_caller ?? false,
        isClient: cachedData.is_client ?? true,
        designation: cachedData.designation || null,
        department: cachedData.department || null,
        googleCalendarConnected: cachedData.google_calendar_connected ?? false,
        googleCalendarSkipped: cachedData.google_calendar_skipped ?? false,
      };
    }
    return null;
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);

  const [lastFetchTime, setLastFetchTime] = useState(0);
  const loadingRef = useRef(false);

  // Initialize session heartbeat
  useSessionHeartbeat(user);

  const fetchAuth = async (force = false) => {
    // Throttle frequency of background checks (e.g., max once per 60 seconds unless forced)
    const now = Date.now();
    if (!force && now - lastFetchTime < 60000 && user) {
        return;
    }

    if (loadingRef.current) return;
    loadingRef.current = true;
    setLoading(true);
    setLastFetchTime(now);
    
    try {
      const isOnline = typeof window !== 'undefined' ? window.navigator.onLine : true;
      
      // 1. Initial Auth Check (Supabase & Multi-Account Card Logic)
      const isLoginPage = router.pathname === "/login" || router.pathname === "/auth/login" || router.pathname === "/portal/login";
      const isPublicLandingPage = router.pathname === "/home" || router.pathname === "/signup" || router.pathname === "/signup-success" || router.pathname === "/contact" || router.pathname === "/features" || router.pathname === "/pricing" || router.pathname === "/faq";
      const isRootPath = router.pathname === "/";
      
      if (isLoginPage || isPublicLandingPage || isRootPath) {
        // --- ADDITION: If just logged out, don't auto-redirect ---
        const isLogoutUrl = typeof window !== 'undefined' && (
          router.query.logout === "true" || 
          window.location.search.includes("logout=true") ||
          sessionStorage.getItem('tfc_just_logged_out') === 'true'
        );

        if (isLogoutUrl) {
            console.log("🛑 [AuthGuard] Fresh logout detected, staying on Login page.");
            if (typeof window !== 'undefined') {
              sessionStorage.removeItem('tfc_just_logged_out');
            }
            setLoading(false);
            loadingRef.current = false;
            return;
        }

        const { data: { session: currentSupabaseSession } } = await supabase.auth.getSession();
        const accounts = getStoredAccounts();

        if (currentSupabaseSession && accounts.length > 0) {
            const sessionActive = accounts.some(a => a.user_id === currentSupabaseSession.user.id);
            if (sessionActive && router.pathname !== "/home") {
                router.push("/dashboard");
                return;
            }
        }

        // 1b. Check database for active multi-account tokens (Only if Online)
        if (accounts.length > 0 && isOnline) {
          try {
            const tokens = accounts.map(a => a.token_id);
            const response = await fetch('/api/auth/batch-status', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ tokens }),
              signal: AbortSignal.timeout(5000) // Timeout after 5s
            });
            const data = await response.json();
            
            if (data.active_tokens && data.active_tokens.length > 0) {
              const activeTokenId = data.active_tokens[0]; 
              const activeAccount = accounts.find(a => a.token_id === activeTokenId);
              
              if (activeAccount) {
                await supabase.auth.setSession({
                  access_token: activeAccount.access_token,
                  refresh_token: activeAccount.refresh_token
                });
                
                await fetch("/api/auth/activate-session", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ token_id: activeAccount.token_id }),
                  keepalive: true
                }).catch(() => {});

                if (router.pathname !== "/home") {
                   router.push("/dashboard");
                   return;
                }
              }
            }
          } catch (e) {
            console.warn("[AuthGuard] Batch status check failed (Network):", e);
          }
        }
      }

      // 2. Fetch/Refresh Profile
      const result = await checkAuthAndFetchProfile();

      if (result.shouldRedirect && isOnline) {
        setUser(null);
        setLoading(false);
        loadingRef.current = false;
        if (!isLoginPage && !isPublicLandingPage && !isRootPath) {
          router.push("/login");
        }
        return;
      }

      if (result.user) {
        // If we are authenticated but on login/root, move to dashboard
        if ((isLoginPage || isRootPath) && !isPublicLandingPage) {
          router.push("/dashboard");
          return;
        }

        // --- Heartbeat check (Only if online and every few mins) ---
        if (isOnline && result.user.uid) {
           const storedData = getStoredUserData();
           if (storedData?.token_id) {
              try {
                const validateRes = await fetch('/api/auth/heartbeat', {
                   method: 'POST',
                   headers: { 'Content-Type': 'application/json' },
                   body: JSON.stringify({ token_id: storedData.token_id }),
                   signal: AbortSignal.timeout(4000)
                });
                const validateData = await validateRes.json();
                
                if (validateRes.status === 404 || validateData.force_logout) {
                   console.warn("🚫 [AuthGuard] Active session revoked in DB. Forcing logout.");
                   const { handleLogout } = await import("../lib/authService");
                   await handleLogout(router, storedData.token_id);
                   return;
                }
              } catch (valErr) {
                console.warn("[AuthGuard] Heartbeat failed (Likely network):", valErr);
              }
           }
        }

        setUser(result.user);
        updateLocalStorage(result.user);
      }
    } catch (err: any) {
      console.error("Auth check failed:", err);
      setError(err.message || "Authentication error");
    } finally {
      setLoading(false);
      loadingRef.current = false;
    }
  };

  const updateLocalStorage = (userData: UserProfile) => {
    if (userData.uid) {
       const cachedData = getStoredUserData();
       storeUserData({
          ...cachedData,
          user_id: userData.uid,
          email: userData.email,
          user_name: userData.displayName || cachedData?.user_name || "",
          employee_id: userData.employeeId || cachedData?.employee_id || "",
          role: userData.role || cachedData?.role || "user",
          profile_pic_url: userData.profilePicUrl || null,
          approval_status: userData.approvalStatus || null,
          status: userData.accountStatus || null,
          is_client: userData.isClient,
          is_caller: userData.isCaller,
          designation: userData.designation,
          department: userData.department,
          google_calendar_connected: userData.googleCalendarConnected,
          google_calendar_skipped: userData.googleCalendarSkipped,
       });
    }
  };

  useEffect(() => {
    setMounted(true);
    fetchAuth();
    
    const handleFocus = () => fetchAuth();
    window.addEventListener("focus", handleFocus);
    
    // --- ADDITION: Listen for manual logout events to clear state immediately ---
    const handleLogoutEvent = () => {
       console.log("🧹 [AuthGuard] Resetting user state due to logout event");
       setUser(null);
    };
    window.addEventListener('tfc-logout-event', handleLogoutEvent);

    return () => {
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener('tfc-logout-event', handleLogoutEvent);
    };

  }, [router.pathname]);

  return { user, loading, error, mounted, refetchUser: fetchAuth };
}

