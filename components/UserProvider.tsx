import { ReactNode, useMemo, useEffect, useRef } from "react";
import { UserContext } from "../context/UserContext";
import { useAuthGuard } from "../hooks/useAuthGuard";

interface UserProviderProps {
  children: ReactNode;
}

export function UserProvider({ children }: UserProviderProps) {
  const { user, loading, error, mounted, refetchUser } = useAuthGuard();
  const prevUserRef = useRef<any>(null);

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

      const win = window as any;
      if (win.flutter_inappwebview?.callHandler) {
        // 1. Send sync_user_info
        const syncPayload = {
          type: 'sync_user_info',
          value: userInfoPayload
        };
        console.log("🚀 [Auto-Sync] Syncing User Info:", syncPayload);
        win.flutter_inappwebview.callHandler('fromWebApp', syncPayload);

        // 2. Send login: true if this is a fresh login or first detection
        if (!prevUserRef.current) {
          const loginPayload = { type: 'login', value: true };
          console.log("🚀 [Auto-Sync] Sending Login Event:", loginPayload);
          win.flutter_inappwebview.callHandler('fromWebApp', loginPayload);
        }
      }
      prevUserRef.current = user;
    } else if (!user && prevUserRef.current) {
      // User logged out
      prevUserRef.current = null;
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
