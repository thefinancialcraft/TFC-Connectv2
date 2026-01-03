import { ReactNode, useMemo, useEffect } from "react";
import { UserContext } from "../context/UserContext";
import { useAuthGuard } from "../hooks/useAuthGuard";

interface UserProviderProps {
  children: ReactNode;
}

export function UserProvider({ children }: UserProviderProps) {
  const { user, loading, error, mounted, refetchUser } = useAuthGuard();

  // 1. Initialize Global Flutter Receiver
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const win = window as any;
    
    // Define the receiver function once at the app level
    win.fromFlutter = (data: any) => {
      console.log("🔔 [Flutter Bridge] Raw data received:", data);
      
      let parsed = data;
      // Handle cases where Flutter sends a JSON string
      if (typeof data === 'string' && (data.startsWith('{') || data.startsWith('['))) {
        try {
          parsed = JSON.parse(data);
        } catch (e) {
          console.warn("⚠️ Failed to parse Flutter message as JSON:", e);
        }
      }

      // Format for logging
      const logEntry = {
        id: Math.random().toString(36).substr(2, 9),
        direction: 'in' as const,
        type: parsed?.type || (typeof parsed === 'object' ? 'object_received' : 'raw_received'),
        payload: parsed?.value !== undefined ? parsed.value : parsed,
        timestamp: new Date().toISOString()
      };

      // Persist logs globally so FlutterBridgeTab can see them even if not open when received
      try {
        const existingLogs = JSON.parse(localStorage.getItem('flutter_bridge_logs') || '[]');
        const updatedLogs = [logEntry, ...existingLogs].slice(0, 100); // Keep last 100
        localStorage.setItem('flutter_bridge_logs', JSON.stringify(updatedLogs));
      } catch (e) {
        console.error("Failed to persist bridge log:", e);
      }

      // Dispatch event for any active listeners (like the Debugger UI)
      window.dispatchEvent(new CustomEvent('from-flutter', { detail: logEntry }));
    };

    console.log("✅ [Flutter Bridge] Receiver initialized at window.fromFlutter");
  }, []);

  // 2. Auto-sync user data to Flutter when user logs in
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
        win.flutter_inappwebview.callHandler('fromWebApp', messagePayload)
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
