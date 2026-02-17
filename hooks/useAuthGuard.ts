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
  refetchUser: () => Promise<void>;
}

export function useAuthGuard(): UseAuthGuardReturn {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);
  const loadingRef = useRef(false);

  const fetchAuth = async (force = false) => {
    if (loadingRef.current) return;
    loadingRef.current = true;
    setLoading(true);
    
    try {
      const isLoginPage = router.pathname === "/login" || router.pathname === "/auth/login" || router.pathname === "/portal/login";
      const isPublicLandingPage = router.pathname === "/home" || router.pathname === "/signup" || router.pathname === "/signup-success" || router.pathname === "/contact" || router.pathname === "/features" || router.pathname === "/pricing" || router.pathname === "/faq";
      const isRootPath = router.pathname === "/";
      
      const { data: { user: authUser } } = await supabase.auth.getUser();

      if (authUser) {
        // Logged in: if on login/root, move to dashboard
        if ((isLoginPage || isRootPath) && !isPublicLandingPage) {
          router.push("/dashboard");
          return;
        }

        // Fetch/Refresh Profile
        const result = await checkAuthAndFetchProfile();
        if (result.user) {
          setUser(result.user);
        } else if (result.shouldRedirect) {
           setUser(null);
           if (!isLoginPage && !isPublicLandingPage && !isRootPath) {
             router.push("/login");
           }
        }
      } else {
        // Not logged in
        setUser(null);
        if (!isLoginPage && !isPublicLandingPage && !isRootPath) {
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

  useEffect(() => {
    setMounted(true);
    fetchAuth();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        fetchAuth(true);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        router.push("/login");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router.pathname]);

  return { user, loading, error, mounted, refetchUser: fetchAuth };
}
