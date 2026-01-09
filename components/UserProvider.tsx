import { ReactNode, useMemo, useEffect, useRef } from "react";
import { UserContext } from "../context/UserContext";
import { useAuthGuard } from "../hooks/useAuthGuard";

interface UserProviderProps {
  children: ReactNode;
}

export function UserProvider({ children }: UserProviderProps) {
  const { user, loading, error, mounted, refetchUser } = useAuthGuard();
  const prevUserRef = useRef<any>(null);

  // Bridge Sync Logic (Reliability Pinger for refresh/cold-start)
  useEffect(() => {
    if (!mounted || typeof window === 'undefined') return;

    let syncInterval: NodeJS.Timeout;

    const executeSync = async () => {
      const { notifyLoginToFlutter, syncUserInfoToFlutter, requestDeviceInfoFromFlutter } = await import("../lib/flutterBridge");
      
      const success = (user) ? syncUserInfoToFlutter(user) : true;
      
      if (success) {
        // Request device info if bridge is active
        requestDeviceInfoFromFlutter();
        // If it worked, we also send a login event if we just "detected" a session on load
        if (user && !prevUserRef.current) {
          notifyLoginToFlutter();
        }
        
        if (user) prevUserRef.current = user;
        else prevUserRef.current = null;
        
        return true;
      }
      return false;
    };

    // Initial attempt after a small delay
    const timer = setTimeout(async () => {
      const success = await executeSync();
      
      if (!success && user) {
        // Bridge might be slow, retry every 2s
        syncInterval = setInterval(async () => {
          if (await executeSync()) {
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

  // Global Bridge Message Listener for Device Info
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const originalFromFlutter = (window as any).fromFlutter;

    (window as any).fromFlutter = (data: any) => {
      // Call previous handler to maintain existing logs/logic
      if (typeof originalFromFlutter === 'function') {
        originalFromFlutter(data);
      }

      if (data?.type === 'device_info' && data?.value) {
        console.log('📱 [Bridge] Received Device Info, saving to localStorage:', data.value);
        localStorage.setItem('flutter_device_info', JSON.stringify(data.value));
      }
    };

    return () => {
      (window as any).fromFlutter = originalFromFlutter;
    };
  }, []);

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
