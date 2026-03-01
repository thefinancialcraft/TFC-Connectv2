import { ReactNode, useMemo, useEffect, useRef } from "react";
import { UserContext } from "../context/UserContext";
import { useAuthGuard } from "../hooks/useAuthGuard";

interface UserProviderProps {
  children: ReactNode;
}

export function UserProvider({ children }: UserProviderProps) {
  const { user, loading, error, mounted, statusMessage, refetchUser } = useAuthGuard();
  const prevUserRef = useRef<any>(null);

  // Bridge Sync Logic (Reliability Pinger for refresh/cold-start)
  useEffect(() => {
    if (!mounted || typeof window === 'undefined') return;

    let syncInterval: NodeJS.Timeout;

    const executeSync = async () => {
      console.log("🔄 [UserProvider] Attempting Flutter Bridge sync...");
      // --- ADDITION: Only sync if online ---
      if (typeof window !== 'undefined' && !window.navigator.onLine) {
        console.warn("🌐 [UserProvider] Device is offline. Skipping sync.");
        return false; 
      }
      
      const { notifyLoginToFlutter, syncUserInfoToFlutter, requestDeviceInfoFromFlutter } = await import("../lib/flutterBridge");
      
      const success = (user) ? syncUserInfoToFlutter(user) : true;
      
      if (success) {
        // Request device info if bridge is active
        requestDeviceInfoFromFlutter();
        if (user && !prevUserRef.current) {
          const path = window.location.pathname;
          // Only send the 'login' event to Flutter if we are on base routes. 
          // If we send it deep in the app (like /campaign), Flutter might mistakenly redirect Webview to the Dashboard!
          if (path === '/login' || path === '/dashboard' || path === '/') {
              notifyLoginToFlutter();
          }
        }
        
        if (user) prevUserRef.current = user;
        else prevUserRef.current = null;
        
        return true;
      }
      return false;
    };

    // Initial attempt after a small delay
    const timer = setTimeout(async () => {
      // Check if bridge exists before starting sync interval
      const isBridgeContext = typeof window !== 'undefined' && !!(window as any).flutter_inappwebview?.callHandler;
      
      if (!isBridgeContext) {
        console.log("💻 [Bridge] Standard Browser detected. Skipping background sync.");
        return;
      }

      const success = await executeSync();
      
      if (!success && user) {
        // Bridge context exists but sync failed (maybe timing), retry every 2s
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
  }, [user?.uid, mounted]);

  // Global Bridge Message Listener for Device Info
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleMessage = (e: any) => {
      const data = e.detail;
      if (data?.type === 'device_info' && data?.value) {
        console.log('📱 [Bridge] Received Device Info, saving to localStorage:', data.value);
        localStorage.setItem('flutter_device_info', JSON.stringify(data.value));
      }
    };

    window.addEventListener('tfc-bridge-message' as any, handleMessage);
    return () => {
      window.removeEventListener('tfc-bridge-message' as any, handleMessage);
    };
  }, []);

  const contextValue = useMemo(() => ({
    user,
    loading,
    error: error || null,
    mounted,
    statusMessage,
    refetchUser
  }), [user, loading, error, mounted, statusMessage, refetchUser]);

  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  );
}
