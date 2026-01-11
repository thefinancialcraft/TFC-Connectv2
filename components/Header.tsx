import { useState, useEffect, memo, useMemo, useCallback, useRef } from "react";
import { useRouter } from "next/router";
import AppLogo from "./AppLogo";
import { getStoredUserData } from "../lib/localStorageUtils";
import { supabase } from "../lib/supabase";
import { notifyFlutter, sendHeartbeat, requestDeviceInfoFromFlutter } from "../lib/flutterBridge";

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
  const [deviceStatus, setDeviceStatus] = useState<{ on_call: boolean; device_model: string; android_id: string; last_seen?: string | null } | null>(null);
  const [isBridgeActive, setIsBridgeActive] = useState(false);
  const [localEntryId, setLocalEntryId] = useState<string | null>(null);
  const [tick, setTick] = useState(0);
  const lastProcessedRef = useRef<{ type: string; value: any; time: number } | null>(null);
  const isOnCallRef = useRef(false);
  
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

  // Set mounted and check for Flutter Bridge
  useEffect(() => {
    setMounted(true);
    
    if (typeof window !== 'undefined' && (window as any).flutter_inappwebview) {
      setIsBridgeActive(true);
      
      // Request initial device info
      requestDeviceInfoFromFlutter();

      // Listen for incoming bridge messages from Flutter
      const handleMessage = (e: any) => {
        const payload = e.detail;
        if (payload?.type === 'device_info' && payload?.value?.androidId) {
          const androidId = payload.value.androidId;
          const employeeId = displayUser?.employeeId;
          
          if (employeeId) {
             const entryId = `${employeeId}_${androidId}`;
             console.log(`🆔 [Header] Identity established: ${entryId}`);
             setLocalEntryId(entryId);
             localStorage.setItem('android_id', androidId);
             localStorage.setItem('entry_id', entryId);
          }
        }
      };
      
      window.addEventListener('tfc-bridge-message' as any, handleMessage);

      // Set up periodic identity refresh every 30 minutes
      const refreshInterval = setInterval(() => {
        console.log("🔄 [Header] Periodic device info refresh");
        requestDeviceInfoFromFlutter();
      }, 30 * 60 * 1000);

      return () => {
        window.removeEventListener('tfc-bridge-message' as any, handleMessage);
        clearInterval(refreshInterval);
      };
    } else {
       // Fallback for non-bridge (desktop) - read from storage if exists
       const savedEntryId = localStorage.getItem('entry_id');
       if (savedEntryId) setLocalEntryId(savedEntryId);
    }
  }, [displayUser?.employeeId]);

  // Fetch and Subscribe to Device Status
  useEffect(() => {
    if (!mounted || !displayUser?.employeeId) return;

    const fetchPrimaryStatus = async () => {
      // Fetch specifically by localEntryId if we have it, else fallback to primary discover
      const query = supabase.from('sync_meta').select('id, entry_id, on_call, device_model, android_id, status, is_primary, last_seen');
      
      let finalResult;
      if (localEntryId) {
        finalResult = await query.eq('entry_id', localEntryId).maybeSingle();
      } else {
        finalResult = await query.eq('employee_id', displayUser.employeeId).eq('is_primary', true).maybeSingle();
      }
      
      const { data: device, error } = finalResult;

      if (error) {
        console.error("Error fetching primary device:", error);
        return;
      }

      if (device) {
        setDeviceStatus({
          on_call: device.on_call || false,
          device_model: device.device_model || 'Unknown Device',
          android_id: device.android_id || 'N/A',
          last_seen: device.last_seen
        });
        isOnCallRef.current = device.on_call || false;
      } else {
        setDeviceStatus(null);
        isOnCallRef.current = false;
      }
    };

    // Initial fetch
    fetchPrimaryStatus();

    // Subscribe specifically to THIS device's entry_id
    // If we don't have entryId yet, we subscribe to all for safety until identity is confirmed
    const filter = localEntryId 
                   ? `entry_id=eq.${localEntryId}` 
                   : `employee_id=eq.${displayUser.employeeId}`;

    const channel = supabase
      .channel(`device_sync_${localEntryId || displayUser.employeeId}`)
      .on(
        'postgres_changes',
        {
          event: '*', 
          schema: 'public',
          table: 'sync_meta',
          filter: filter
        },
        (payload: any) => {
          const newData = payload.new;
          if (!newData) return;

          // 1. EXPLICIT IDENTITY CHECK
          // We only process if the message is explicitly for THIS device's entry_id
          const currentEntryId = localEntryId || localStorage.getItem('entry_id');
          if (newData.entry_id && newData.entry_id === currentEntryId) {
             console.log("⚡ [Header] Valid command for this device received:", newData.entry_id);
             
             // 2. FORWARD COMMANDS TO FLUTTER
             if (isBridgeActive && newData.type && newData.value) {
                // 3. MASTER MOVE: Reject call_to if already on a call
                if (newData.type === 'call_to' && isOnCallRef.current) {
                   console.log("🛡️ [Header] MASTER MOVE: Call rejected! Device is already busy.");
                   fetchPrimaryStatus();
                   return;
                }

                // Deduplication A: Check if this was just sent locally (prevent local loop)
                const bridgeHistory = (window as any).__bridge_history || {};
                const lastLocalMsg = bridgeHistory[newData.type];
                const isLocalDuplicate = lastLocalMsg && 
                                        String(lastLocalMsg.value) === String(newData.value) && 
                                        (Date.now() - lastLocalMsg.time < 5000); 

                // Deduplication B: Check if this REMOTE command was already processed (prevent double-fire)
                const isRemoteDuplicate = lastProcessedRef.current &&
                                         lastProcessedRef.current.type === newData.type &&
                                         String(lastProcessedRef.current.value) === String(newData.value) &&
                                         (Date.now() - lastProcessedRef.current.time < 2000); // 2 second window

                if (!isLocalDuplicate && !isRemoteDuplicate) {
                   console.log(`🚀 [Header] Pushing REMOTE command to Native Bridge: ${newData.type}`);
                   
                   // Update ref BEFORE notifying to block immediate re-fires
                   lastProcessedRef.current = { type: newData.type, value: newData.value, time: Date.now() };
                   notifyFlutter(newData.type, newData.value);
                } else if (isRemoteDuplicate) {
                   console.log(`🛡️ [Header] Suppressed duplicate remote firing for: ${newData.type}`);
                } else {
                   console.log(`⌛ [Header] Local trigger detected. Skipping loop for: ${newData.type}`);
                }
             }
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
  }, [mounted, displayUser?.employeeId, isBridgeActive, localEntryId]);

  // SENDER: Heartbeat Loop (Only if bridge is active)
  useEffect(() => {
    const empId = displayUser?.employeeId;
    if (!isBridgeActive || !empId) return;

    // Send initial heartbeat
    sendHeartbeat(empId);

    // Set up interval for every 10 seconds (for 15s timeout)
    const interval = setInterval(() => {
      sendHeartbeat(empId);
    }, 10000);

    return () => clearInterval(interval);
  }, [isBridgeActive, displayUser?.employeeId]);

  // Ticker: Force re-render periodically to update "ago" time and offline status
  useEffect(() => {
    const interval = setInterval(() => {
      setTick(t => t + 1);
    }, 5000); // Check every 5 seconds
    return () => clearInterval(interval);
  }, []);

  // Logic: Check if device is actually online based on last_seen
  const deviceOnlineStatus = useMemo(() => {
    if (!deviceStatus?.last_seen) return 'offline';
    
    const lastSeen = new Date(deviceStatus.last_seen).getTime();
    const now = Date.now();
    const diffSeconds = (now - lastSeen) / 1000;
    
    // Mark offline if no heartbeat for 15 seconds
    return diffSeconds < 15 ? 'online' : 'offline';
  }, [deviceStatus?.last_seen, tick]);

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
                  deviceOnlineStatus === 'offline' 
                    ? 'bg-gray-100 text-gray-400' 
                    : (deviceStatus.on_call ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600')
                }`}>
                  <i className={`fi flex ${
                    deviceOnlineStatus === 'online' && deviceStatus.on_call 
                      ? 'fi-rr-phone-call animate-pulse' 
                      : 'fi-rr-smartphone'
                  } text-sm`} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">
                    {deviceStatus.device_model}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className={`w-1 h-1 rounded-full ${
                      deviceOnlineStatus === 'online' 
                        ? (deviceStatus.on_call ? 'bg-amber-500' : 'bg-emerald-500') 
                        : 'bg-gray-400'
                    }`} />
                    <span className="text-[11px] font-bold text-gray-700 leading-none">
                      {deviceOnlineStatus === 'online' 
                        ? (deviceStatus.on_call ? 'In Call' : 'Online') 
                        : 'Offline'}
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
