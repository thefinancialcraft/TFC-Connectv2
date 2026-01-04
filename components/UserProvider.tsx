import { ReactNode, useMemo, useEffect, useRef } from "react";
import { UserContext } from "../context/UserContext";
import { useAuthGuard } from "../hooks/useAuthGuard";

interface UserProviderProps {
  children: ReactNode;
}

export function UserProvider({ children }: UserProviderProps) {
  const { user, loading, error, mounted, refetchUser } = useAuthGuard();
  const prevUserRef = useRef<any>(null);

  // Bridge Sync Logic (Login/Sync/Logout)
  useEffect(() => {
    if (!mounted || typeof window === 'undefined') return;

    let syncInterval: NodeJS.Timeout;

    const executeSync = () => {
      const win = window as any;
      if (!win.flutter_inappwebview?.callHandler) {
        console.log("⏳ [Bridge] Waiting for Flutter bridge...");
        return false; // Bridge not ready
      }

      if (user) {
        const userInfoPayload = {
          user_name: user.displayName || null,
          employee_id: user.employeeId || null,
          email: user.email,
          role: user.role,
          designation: user.role,
          department: (user as any).department || null,
          createdAt: user.createdAt,
          lastSignInAt: user.lastSignInAt,
          profilePicUrl: user.profilePicUrl
        };

        // 1. Send Login Signal (if transition)
        if (!prevUserRef.current) {
          console.log("🚀 [Bridge] Sending Login Event");
          win.flutter_inappwebview.callHandler('fromWebApp', { type: 'login', value: true });
        }

        // 2. Sync Profile
        console.log("🚀 [Bridge] Syncing User Profile");
        win.flutter_inappwebview.callHandler('fromWebApp', { 
          type: 'sync_user_info', 
          value: userInfoPayload 
        });

        prevUserRef.current = user;
        return true;
      } else if (!user && prevUserRef.current) {
        // Logout transition
        console.log("🚀 [Bridge] Sending Logout Event");
        win.flutter_inappwebview.callHandler('fromWebApp', { type: 'logout', value: true });
        prevUserRef.current = null;
        return true;
      }
      return true; // Nothing to do
    };

    // Initial attempt after a small delay to let window properties settle
    const timer = setTimeout(() => {
      const success = executeSync();
      
      // If bridge wasn't ready, start a pinger that retries every 2 seconds
      if (!success) {
        syncInterval = setInterval(() => {
          if (executeSync()) {
            console.log("✅ [Bridge] Successfully connected and synced after retry");
            clearInterval(syncInterval);
          }
        }, 2000);
      }
    }, 1000);

    return () => {
      clearTimeout(timer);
      if (syncInterval) clearInterval(syncInterval);
    };
  }, [user, mounted]);

  const contextValue = useMemo(() => ({
    user,
    loading,
    error: error || null,
    mounted,
    refetchUser
  }), [user, loading, error, mounted, refetchUser]);

  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  );
}
