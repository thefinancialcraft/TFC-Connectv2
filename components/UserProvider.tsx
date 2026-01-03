import { ReactNode, useMemo } from "react";
import { UserContext } from "../context/UserContext";
import { useAuthGuard } from "../hooks/useAuthGuard";

interface UserProviderProps {
  children: ReactNode;
}

export function UserProvider({ children }: UserProviderProps) {
  const { user, loading, error, mounted, refetchUser } = useAuthGuard();

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
