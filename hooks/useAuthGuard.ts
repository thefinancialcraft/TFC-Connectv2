import { useEffect, useState } from "react";
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

  // Initialize session heartbeat
  useSessionHeartbeat(user);

  const fetchAuth = async () => {
    if (loading) return;
    setLoading(true);
    
    try {
      // 1. Initial Auth Check (Supabase & Multi-Account Card Logic)
      const isLoginPage = router.pathname === "/login" || router.pathname === "/auth/login";
      const isRootPath = router.pathname === "/";
      
      if (isLoginPage || isRootPath) {
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
            return;
        }


        // 1a. Check if Supabase client ALREADY has an active session from hydration


        const { data: { session: currentSupabaseSession } } = await supabase.auth.getSession();
        const accounts = getStoredAccounts();

        if (currentSupabaseSession && accounts.length > 0) {
            // Check if this Supabase session matches one of our stored accounts
            const sessionActive = accounts.some(a => a.user_id === currentSupabaseSession.user.id);
            if (sessionActive) {
                console.log("✅ [AuthGuard] Active session detected, auto-bypassing login/home");
                router.push("/dashboard");
                return;
            }
        }

        // 1b. Check database for active multi-account tokens
        if (accounts.length > 0) {
          try {
            const tokens = accounts.map(a => a.token_id);
            const response = await fetch('/api/auth/batch-status', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ tokens })
            });
            const data = await response.json();
            
            if (data.active_tokens && data.active_tokens.length > 0) {
              const activeTokenId = data.active_tokens[0]; 
              const activeAccount = accounts.find(a => a.token_id === activeTokenId);
              
              if (activeAccount) {
                console.log("🚀 [AuthGuard] Active token found in DB, restoring and bypassing login/home");
                await supabase.auth.setSession({
                  access_token: activeAccount.access_token,
                  refresh_token: activeAccount.refresh_token
                });
                
                // CRITICAL: Strictly await activation on the server before moving to dashboard
                console.log("📡 [AuthGuard] Confirming activation with server...");
                const activateRes = await fetch("/api/auth/activate-session", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ token_id: activeAccount.token_id }),
                });

                if (activateRes.ok) {
                    console.log("✅ [AuthGuard] Server confirmed active. Moving to Dashboard.");
                    router.push("/dashboard");
                    return;
                } else {
                    console.error("⚠️ [AuthGuard] Activation call failed, but proceeding anyway to avoid stuck UI.");
                    router.push("/dashboard");
                    return;
                }

              }
            }
          } catch (e) {
            console.error("Batch status check failed:", e);
          }
        }
      }

      const result = await checkAuthAndFetchProfile();

      if (result.shouldRedirect) {
        setUser(null);
        setLoading(false);
        if (!isLoginPage && !isRootPath) {
          router.push("/login");
        }
        return;
      }

      if (result.user) {
        // --- ADDITION: If we landed on Login/Home but result says we ARE authenticated, push to dashboard ---
        if (isLoginPage || isRootPath) {
          router.push("/dashboard");
          return;
        }

        // --- VALIDATION: Check if current token in storage is actually valid in DB ---
        // This catches cases where session was deleted (revoked) but client still has valid JWT
        const { getStoredUserData } = await import("../lib/localStorageUtils");
        const storedData = getStoredUserData();
        
        if (storedData?.token_id) {
           try {
             const validateRes = await fetch('/api/auth/heartbeat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token_id: storedData.token_id }) 
             });
             
             const validateData = await validateRes.json();
             
             // If validation fails (404/force_logout), kill the session immediately
             if (validateRes.status === 404 || validateData.force_logout) {
                console.warn("🚫 [AuthGuard] Active session revoked in DB. Forcing logout.");
                const { removeAccount } = await import("../lib/sessionManager");
                removeAccount(storedData.token_id);
                
                const { handleLogout } = await import("../lib/authService");
                await handleLogout(router, storedData.token_id);
                return;
             }
           } catch (valErr) {
             console.error("Session validation check failed:", valErr);
           }
        }


        const { data: { session } } = await supabase.auth.getSession();

        let latestUserData = result.user;

        if (session) {
           try {
            const profileResponse = await fetch("/api/auth/user-profile", {
              headers: { Authorization: `Bearer ${session.access_token}` },
            });
            const profileData = await profileResponse.json();

            if (profileData.success && profileData.user) {
              latestUserData = {
                ...profileData.user,
                profilePicUrl: profileData.user.profile_pic_url || null,
              };

              if (profileData.user.profile_complete === false && router.pathname !== "/profile-completion") {
                router.push("/profile-completion");
                setLoading(false);
                return;
              }
            }
          } catch (err) {
            console.error("Error fetching latest profile:", err);
          }
        }

        setUser((prevUser) => {
          if (!prevUser || JSON.stringify(prevUser) !== JSON.stringify(latestUserData)) {
             updateLocalStorage(latestUserData);
             return latestUserData;
          }
          return prevUser;
        });

        // Redirect based on status
        const statusPaths: Record<string, string> = {
          rejected: "/rejected",
          pending: "/pending",
          suspend: "/suspended",
          hold: "/hold"
        };
        const redirectPath = statusPaths[latestUserData.approvalStatus as string] || statusPaths[latestUserData.accountStatus as string];
        if (redirectPath && router.pathname !== redirectPath) {
          router.push(redirectPath);
        }
      }
    } catch (err: any) {
      console.error("Auth check failed:", err);
      setError(err.message || "Authentication error");
    } finally {
      setLoading(false);
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

