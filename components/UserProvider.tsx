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
    // Only proceed when mounted and we have a valid window/bridge
    if (!mounted || typeof window === 'undefined') return;

    if (user) {
      const userInfoPayload = {
        user_name: user.displayName || user.displayName || null,
        employee_id: user.employeeId || null,
        email: user.email,
        role: user.role,
        designation: user.role || user.role, // Use explicit designation if it exists
        department: (user as any).department || null,
        createdAt: user.createdAt,
        lastSignInAt: user.lastSignInAt,
        profilePicUrl: user.profilePicUrl
      };

      const win = window as any;
      if (win.flutter_inappwebview?.callHandler) {
        // 1. Sync full user info
        const syncPayload = {
          type: 'sync_user_info',
          value: userInfoPayload
        };
        console.log("🚀 [Bridge] Auto-syncing User Profile:", syncPayload);
        win.flutter_inappwebview.callHandler('fromWebApp', syncPayload);

        // 2. Identify and send Login Event (login: true)
        // This triggers when user goes from null/undefined to a valid user object
        if (!prevUserRef.current) {
          const loginPayload = { type: 'login', value: true };
          console.log("🚀 [Bridge] Login Detected (Email/ID/Card) - Sending Login Event:", loginPayload);
          win.flutter_inappwebview.callHandler('fromWebApp', loginPayload);
        }
      }
      prevUserRef.current = user;
    } else if (!user && prevUserRef.current) {
      // Transition from user to null (Logout)
      console.log("🚀 [Bridge] Logout Detected - Sending Logout Event");
      const win = window as any;
      if (win.flutter_inappwebview?.callHandler) {
        win.flutter_inappwebview.callHandler('fromWebApp', { type: 'logout', value: true });
      }
      prevUserRef.current = null;
    }
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
