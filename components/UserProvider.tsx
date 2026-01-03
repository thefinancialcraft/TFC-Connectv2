import { ReactNode, useMemo, useEffect } from "react";
import { UserContext } from "../context/UserContext";
import { useAuthGuard } from "../hooks/useAuthGuard";

interface UserProviderProps {
  children: ReactNode;
}

export function UserProvider({ children }: UserProviderProps) {
  const { user, loading, error, mounted, refetchUser } = useAuthGuard();

  // Auto-sync user data to Flutter when user logs in
  useEffect(() => {
    if (typeof window !== 'undefined' && user) {
      const userInfoPayload = {
        user_name: user.displayName,
        employee_id: user.employeeId,
        email: user.email,
        role: user.role,
        designation: user.role, // Mapping role to designation
        department: null,
        createdAt: user.createdAt,
        lastSignInAt: user.lastSignInAt,
        profilePicUrl: user.profilePicUrl
      };

      const syncWithFlutter = () => {
        // Check if running inside Flutter WebView
        const win = window as any;
        if (win.flutter_inappwebview?.callHandler) {
          console.log("🚀 [Auto-Sync] Syncing User Info to Flutter:", userInfoPayload);
          win.flutter_inappwebview.callHandler('syncUserInfo', userInfoPayload)
            .then((result: any) => console.log("✅ [Auto-Sync] Success:", result))
            .catch((err: any) => console.error("❌ [Auto-Sync] Failed:", err));
          return true;
        }
        return false;
      };

      // Attempt sync immediately
      if (!syncWithFlutter()) {
        // If bridge not ready, retry after small delays
        const initialDelay = setTimeout(() => {
            if (!syncWithFlutter()) {
                setTimeout(syncWithFlutter, 1000); // Second retry after 1s
            }
        }, 500); // First retry after 500ms
        
        return () => clearTimeout(initialDelay);
      }
    }
  }, [user]);

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
