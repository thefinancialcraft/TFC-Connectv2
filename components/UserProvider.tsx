import { ReactNode, useMemo } from "react";
import { UserContext } from "../context/UserContext";
import { useAuthGuard } from "../hooks/useAuthGuard";

interface UserProviderProps {
  children: ReactNode;
}

export function UserProvider({ children }: UserProviderProps) {
  const { user, loading, error, mounted, refetchUser } = useAuthGuard();

  // Auto-sync user data to Flutter when user logs in
  useMemo(() => {
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

      const messagePayload = {
        type: 'sync_user_info',
        value: userInfoPayload
      };

      // Check if running inside Flutter WebView
      const win = window as any;
      if (win.flutter_inappwebview?.callHandler) {
        console.log("🚀 [Auto-Sync] Syncing User Info to Flutter:", messagePayload);
        win.flutter_inappwebview.callHandler('bridge', messagePayload)
          .then((result: any) => console.log("✅ [Auto-Sync] Success:", result))
          .catch((err: any) => console.error("❌ [Auto-Sync] Failed:", err));
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
