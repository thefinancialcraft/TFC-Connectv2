import { ReactNode, useMemo } from "react";
import { UserContext } from "../context/UserContext";
import { useAuthGuard } from "../hooks/useAuthGuard";
import { sendToFlutter } from "../lib/bridgeUtils";

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

      // Use the robust utility for auto-sync
      sendToFlutter('sync_user_info', userInfoPayload, (log) => {
        console.log(`🚀 [Auto-Sync] ${log}`);
      });
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
