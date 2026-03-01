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
  refetchUser: () => Promise<void>;
}

export function useAuthGuard(): UseAuthGuardReturn {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);
  const [statusMessage, setStatusMessage] = useState("Checking session...");
  const loadingRef = useRef(false);

  const fetchAuth = async (force = false) => {
    // Production Pattern: If we already have a user and aren't forcing a refresh, skip the loading screen and call.
    if (!force && user && !loadingRef.current) {
        console.log("🚀 [Auth] User already in memory. Skipping redundant fetch.");
        return;
    }

    if (loadingRef.current) return;
    loadingRef.current = true;
    
    // Only show loading screen if we don't have a user yet (Initial Load/Refresh)
    if (!user) setLoading(true);
    
    try {
      const isLoginPage = router.pathname === "/login" || router.pathname === "/auth/login" || router.pathname === "/portal/login";
      const isPublicLandingPage = router.pathname === "/home" || router.pathname === "/signup" || router.pathname === "/signup-success" || router.pathname === "/contact" || router.pathname === "/features" || router.pathname === "/pricing" || router.pathname === "/faq";
      const isRootPath = router.pathname === "/";
      
      setStatusMessage("Verifying active session...");
      const { data: { user: authUser } } = await supabase.auth.getUser();

      if (authUser) {
        // Fetch/Refresh Profile
        setStatusMessage("Fetching user profile...");
        const result = await checkAuthAndFetchProfile();
        
        if (result.user) {
          setStatusMessage("Finalizing setup...");
          setUser(result.user);
          
          // Logged in: if on login/root, move to dashboard
          if ((isLoginPage || isRootPath) && !isPublicLandingPage) {
            setStatusMessage("Redirecting to dashboard...");
            router.push("/dashboard");
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
          setStatusMessage("Access denied. Please login...");
          router.push("/login");
        }
      }
    } catch (err: any) {
      console.error("Auth check failed:", err);
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
      if (event === 'SIGNED_IN' || event === 'USER_UPDATED') {
        fetchAuth(true); // Sync data on login or updates
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        router.push("/login");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // 2. Production Pattern: Pure Route Protection on every navigation
  // This runs when the URL changes but does NOT trigger a heavy fetchAuth unless necessary.
  useEffect(() => {
    if (!mounted || loading) return;

    const isLoginPage = router.pathname === "/login" || router.pathname === "/portal/login";
    const isPublicLandingPage = ["/home", "/signup", "/signup-success", "/contact", "/features", "/pricing", "/faq"].includes(router.pathname);
    const isRootPath = router.pathname === "/";

    if (!user) {
        // Not logged in and trying to access protected page
        if (!isLoginPage && !isPublicLandingPage && !isRootPath) {
            router.push("/login");
        }
    } else {
        // Logged in and trying to access login/root
        if (isLoginPage || isRootPath) {
            router.push("/dashboard");
        }
    }
  }, [router.pathname, user?.uid, mounted, loading]);

  return { user, loading, error, mounted, statusMessage, refetchUser: fetchAuth };
}
