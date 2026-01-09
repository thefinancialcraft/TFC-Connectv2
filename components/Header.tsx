import { useState, useEffect, memo, useMemo, useCallback } from "react";
import { useRouter } from "next/router";
import AppLogo from "./AppLogo";
import { getStoredUserData } from "../lib/localStorageUtils";
import { supabase } from "../lib/supabase";
import { notifyFlutter } from "../lib/flutterBridge";

interface HeaderProps {
  user?: {
    displayName?: string | null;
    email?: string;
    employeeId?: string | null;
    profilePicUrl?: string | null;
  };
  onLogout?: () => void;
}

function HeaderComponent({ user, onLogout }: HeaderProps) {
  const router = useRouter();
  const [serverStatus, setServerStatus] = useState<'online' | 'offline' | 'checking'>('online');
  const [showFullStatus, setShowFullStatus] = useState<boolean>(true);
  const [mounted, setMounted] = useState(false);
  const [deviceStatus, setDeviceStatus] = useState<{ on_call: boolean; device_model: string; android_id: string } | null>(null);
  const [isBridgeActive, setIsBridgeActive] = useState(false);
  
  // Initialize with cached data, then update with props if different (ghost update)
  const [cachedUser, setCachedUser] = useState<HeaderProps['user']>(() => {
    if (typeof window === 'undefined') return undefined; // SSR safety
    const cached = getStoredUserData();
    if (cached) {
      return {
        displayName: cached.user_name || cached.displayName || null,
        email: cached.email || '',
        employeeId: cached.employee_id || null,
        profilePicUrl: cached.profile_pic_url || null,
      };
    }
    return undefined;
  });

  // Set mounted and check for Flutter Bridge
  useEffect(() => {
    setMounted(true);
    // Initial check for bridge
    if (typeof window !== 'undefined' && (window as any).flutter_inappwebview) {
      setIsBridgeActive(true);
    }
  }, []);

  // Use cached user for display (prevents "User / Not assigned" flicker)
  // Memoize displayUser to prevent recalculation on every render
  const displayUser = useMemo(() => {
    return mounted ? (cachedUser || user) : user;
  }, [mounted, cachedUser, user]);

  const initials = useMemo(() => {
    if (!mounted) return "U"; // Return default during SSR to prevent hydration mismatch
    if (displayUser?.displayName) {
      return displayUser.displayName.trim().charAt(0).toUpperCase();
    }
    if (displayUser?.email) {
      return displayUser.email.slice(0, 2).toUpperCase();
    }
    return "U";
  }, [mounted, displayUser]);

  // Only use profilePicUrl after mount to prevent hydration mismatch
  const profilePicUrl = useMemo(() => {
    return mounted ? displayUser?.profilePicUrl : null;
  }, [mounted, displayUser]);

  // Fetch and Subscribe to Device Status
  useEffect(() => {
    if (!mounted || !displayUser?.employeeId) return;

    const fetchPrimaryStatus = async () => {
      const { data: primaryDevice, error } = await supabase
        .from('sync_meta')
        .select('id, entry_id, on_call, device_model, android_id, status, is_primary')
        .eq('employee_id', displayUser.employeeId)
        .eq('is_primary', true)
        .maybeSingle();

      if (error) {
        console.error("Error fetching primary device:", error);
        return;
      }

      if (primaryDevice) {
        setDeviceStatus({
          on_call: primaryDevice.on_call || false,
          device_model: primaryDevice.device_model || 'Unknown Device',
          android_id: primaryDevice.android_id || 'N/A'
        });
      } else {
        setDeviceStatus(null);
      }
    };

    // Initial fetch
    fetchPrimaryStatus();

    // Subscribe to ANY changes for this employee's devices
    const channel = supabase
      .channel(`user_devices_${displayUser.employeeId}`)
      .on(
        'postgres_changes',
        {
          event: '*', 
          schema: 'public',
          table: 'sync_meta',
          filter: `employee_id=eq.${displayUser.employeeId}`
        },
        (payload: any) => {
          console.log("⚡ [Header] Realtime update received:", payload.eventType);
          
          // FORWARD COMMANDS TO FLUTTER:
          // If this session is running inside a Flutter app (Bridge Active)
          // and the database record was updated with a command (type/value),
          // we forward it to the native side.
          const newData = payload.new;
          if (isBridgeActive && newData?.type && newData?.value) {
             console.log(`🚀 [Header] Forwarding remote command to Flutter: ${newData.type} -> ${newData.value}`);
             notifyFlutter(newData.type, newData.value);
          }

          fetchPrimaryStatus();
        }
      )
      .subscribe((status) => {
        console.log(`📡 [Header] Subscription status for ${displayUser.employeeId}:`, status);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [mounted, displayUser?.employeeId]);

  // Ghost update: Only update if props actually changed
  useEffect(() => {
    if (user) {
      setCachedUser(prev => {
        // If no previous cached data, use props
        if (!prev) {
          return user;
        }
        
        // Compare data - only update if changed
        const hasChanged = 
          prev.displayName !== user.displayName ||
          prev.employeeId !== user.employeeId ||
          prev.email !== user.email ||
          prev.profilePicUrl !== user.profilePicUrl;
        
        // Only update if data has actually changed
        if (hasChanged) {
          return user;
        }
        
        // Return previous data to prevent unnecessary re-render
        return prev;
      });
    }
  }, [user?.displayName, user?.employeeId, user?.email, user?.profilePicUrl]);


  // Stable logout handler
  const handleLogout = useCallback(() => {
    if (onLogout) {
      onLogout();
    }
  }, [onLogout]);

  // Mobile header design
  return (
    <>
      {/* Mobile Header */}
      <header
        className="lg:hidden border-b fixed top-0 left-0 right-0 z-50 backdrop-blur-sm"
        style={{ borderColor: "#E0E0E0", backgroundColor: "rgba(255, 255, 255, 0.8)" }}
      >
        <div className="px-4 py-3 flex items-center justify-between">
          {/* Left: User Avatar */}
          <button
            onClick={() => router.push("/settings")}
            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-base shrink-0 transition-colors cursor-pointer overflow-hidden"
            style={{
              background: profilePicUrl ? "transparent" : "#4b33e8",
            }}
            aria-label="Open Settings"
          >
            {profilePicUrl ? (
              <img
                src={profilePicUrl}
                alt={mounted ? (displayUser?.displayName || 'User') : 'User'}
                className="w-full h-full object-cover"
              />
            ) : (
              initials
            )}
          </button>

          {/* Center: Username */}
          <div className="flex-1 flex flex-col items-center justify-center">
            <h1
              className="text-base font-bold leading-tight"
              style={{ color: "#263238", fontFamily: "'Poppins', sans-serif" }}
            >
              {mounted ? (displayUser?.displayName || displayUser?.email?.split("@")[0] || "User") : "User"}
            </h1>
            <p
              className="text-xs leading-tight"
              style={{ color: "#787E9D", fontFamily: "'Roboto', sans-serif" }}
            >
             {mounted ? (displayUser?.email?.split("@")[0] || "User") : "User"}
            </p>
          </div>

          {/* Right: Server Status & Logout */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleLogout}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              style={{ color: "#EF4444" }}
              aria-label="Logout"
            >
              <i className="fi flex fi-rr-exit text-lg"></i>
            </button>
          </div>
        </div>
      </header>

      {/* Desktop Header */}
      <header
        className="hidden lg:block border-b fixed top-0 z-50 w-full backdrop-blur-sm"
        style={{ borderColor: "#E0E0E0", left: "224px", backgroundColor: "rgba(255, 255, 255, 0.8)" }}
      >
        <div className="w-full px-6 py-2.5 flex items-center justify-between">
          {/* Left: User Profile */}
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold text-xs shrink-0 overflow-hidden"
              style={{
                background: profilePicUrl ? "transparent" : "#4b33e8",
              }}
            >
              {profilePicUrl ? (
                <img
                  src={profilePicUrl}
                  alt={mounted ? (displayUser?.displayName || 'User') : 'User'}
                  className="w-full h-full object-cover"
                />
              ) : (
                initials
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p
                className="text-sm font-semibold truncate"
                style={{ color: "#263238", fontFamily: "'Poppins', sans-serif" }}
              >
                {mounted ? (displayUser?.displayName || displayUser?.email?.split("@")[0] || "User") : "User"}
              </p>
              <p
                className="text-xs truncate"
                style={{ color: "#787E9D", fontFamily: "'Roboto', sans-serif" }}
              >
                Employee ID: {mounted ? (displayUser?.employeeId || "Not assigned") : "Not assigned"}
              </p>
            </div>
          </div>

          {/* Right: Device Status & Server Status */}
          <div className="flex items-center gap-6">
            {/* Real-time Device Status */}
            {deviceStatus && (
              <div className="flex items-center gap-3 px-3 py-1.5 bg-gray-50/50 rounded-2xl border border-gray-100/50">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                  deviceStatus.on_call ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'
                }`}>
                  <i className={`fi flex ${deviceStatus.on_call ? 'fi-rr-phone-call animate-pulse' : 'fi-rr-smartphone'} text-sm`} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">
                    {deviceStatus.device_model}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className={`w-1 h-1 rounded-full ${deviceStatus.on_call ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                    <span className="text-[11px] font-bold text-gray-700 leading-none">
                      {deviceStatus.on_call ? 'In Call' : 'Idle'}
                    </span>
                  </div>
                </div>
                <div className="h-6 w-px bg-gray-200 mx-1" />
                <span className="text-[9px] font-mono text-gray-400 max-w-[80px] truncate">
                  {deviceStatus.android_id}
                </span>
              </div>
            )}

            {/* Server Status */}
            <div
              className={`flex items-center justify-center rounded-full text-sm font-medium transition-all duration-700 ease-in-out overflow-hidden ${
                showFullStatus ? 'gap-2 px-3 py-1.5 w-auto' : 'gap-0 p-2 w-9 h-9'
              } ${
                serverStatus === 'online'
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : serverStatus === 'offline'
                  ? 'bg-red-50 text-red-700 border border-red-200'
                  : 'bg-amber-50 text-amber-700 border border-amber-200'
              }`}
              title={serverStatus === 'online' ? 'Server Online' : serverStatus === 'offline' ? 'Server Offline' : 'Checking...'}
            >
              {serverStatus === 'online' ? (
                <>
                  <i className="fi flex fi-rr-signal text-base flex-shrink-0"></i>
                  <span
                    className={`whitespace-nowrap transition-all duration-700 ease-in-out ${
                      showFullStatus
                        ? 'max-w-[100px] opacity-100'
                        : 'max-w-0 opacity-0'
                    }`}
                    style={{ overflow: 'hidden', fontFamily: "'Roboto', sans-serif" }}
                  >
                    Online
                  </span>
                </>
              ) : serverStatus === 'offline' ? (
                <>
                  <i className="fi flex fi-rr-signal-slash text-base flex-shrink-0"></i>
                  <span
                    className={`whitespace-nowrap transition-all duration-700 ease-in-out ${
                      showFullStatus
                        ? 'max-w-[100px] opacity-100'
                        : 'max-w-0 opacity-0'
                    }`}
                    style={{ overflow: 'hidden', fontFamily: "'Roboto', sans-serif" }}
                  >
                    Offline
                  </span>
                </>
              ) : (
                <>
                  <i className="fi flex fi-rr-signal text-base animate-pulse flex-shrink-0"></i>
                  <span
                    className={`whitespace-nowrap transition-all duration-700 ease-in-out ${
                      showFullStatus
                        ? 'max-w-[100px] opacity-100'
                        : 'max-w-0 opacity-0'
                    }`}
                    style={{ overflow: 'hidden', fontFamily: "'Roboto', sans-serif" }}
                  >
                    Checking...
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
}

const Header = memo(HeaderComponent);
export default Header;
