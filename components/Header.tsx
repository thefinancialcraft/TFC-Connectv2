import { useState, useEffect, memo, useMemo, useCallback, useRef } from "react";
import { useRouter } from "next/router";
import { Bell, BellRing, Check, Trash2, X, Info, AlertTriangle, Wifi, WifiOff } from "lucide-react";
import AppLogo from "./AppLogo";
import { getStoredUserData } from "../lib/localStorageUtils";
import { supabase } from "../lib/supabase";
import { notifyFlutter, sendHeartbeat, requestDeviceInfoFromFlutter } from "../lib/flutterBridge";
import { showWarning } from "../lib/dialogUtils";

interface HeaderProps {
  user?: {
    displayName?: string | null;
    email?: string;
    employeeId?: string | null;
    profilePicUrl?: string | null;
    uid?: string;
  };
  onLogout?: (tokenId?: string) => void;
  hideSidebar?: boolean;
}

function HeaderComponent({ user, onLogout, hideSidebar = false }: HeaderProps) {
  const router = useRouter();
  const [serverStatus, setServerStatus] = useState<'online' | 'offline' | 'checking'>('online');
  const [showFullStatus, setShowFullStatus] = useState<boolean>(true);
  const [mounted, setMounted] = useState(false);
  const [deviceStatus, setDeviceStatus] = useState<{ on_call: boolean; device_model: string; android_id: string; last_seen?: string | null } | null>(null);
  const [isBridgeActive, setIsBridgeActive] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [localEntryId, setLocalEntryId] = useState<string | null>(null);
  const [tick, setTick] = useState(0);
  const lastProcessedRef = useRef<{ type: string; value: any; time: number } | null>(null);
  const lastSentCommandRef = useRef<{ type: string; value: any } | null>(null);
  const isOnCallRef = useRef(false);
  
  // Notification States
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  
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
    return mounted ? (user || cachedUser) : user;
  }, [mounted, user, cachedUser]);

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

             // Update Session Metadata in DB
             const updateSessionMeta = async () => {
                try {
                  const { data: { session } } = await supabase.auth.getSession();
                  const tokenId = getStoredUserData()?.token_id;
                  
                  if (session && tokenId) {
                    await fetch('/api/auth/update-session-meta', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${session.access_token}`
                      },
                      body: JSON.stringify({
                        device_info: payload.value,
                        token_id: tokenId
                      })
                    });
                    console.log("✅ [Header] Session metadata updated in DB");
                  }
                } catch (err) {
                  console.error("❌ [Header] Failed to sync session meta:", err);
                }
             };
             updateSessionMeta();
          }

        }

        // --- Persistent Lock Release ---
        // Clear the last sent command lock when a disconnect message is received from Flutter
        const isDisconnectMsg = payload?.type === 'call_disconected' || 
                                payload?.type === 'call_disconnect' || 
                                payload?.type === 'call_disconnected';
        
        if (isDisconnectMsg) {
          console.log("🛡️ [Header] Disconnect received from bridge. Clearing command lock.");
          lastSentCommandRef.current = null;
          lastProcessedRef.current = null; // Also clear short-term deduplication
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

                // Deduplication C: MASTER PERSISTENT CHECKPOINT
                // Don't send the same command again until we get a disconnect signal from the bridge
                const isStickyDuplicate = lastSentCommandRef.current &&
                                         lastSentCommandRef.current.type === newData.type &&
                                         String(lastSentCommandRef.current.value) === String(newData.value);

                if (!isLocalDuplicate && !isRemoteDuplicate && !isStickyDuplicate) {
                   console.log(`🚀 [Header] Pushing REMOTE command to Native Bridge: ${newData.type}`);
                   
                   // Update refs BEFORE notifying
                   lastProcessedRef.current = { type: newData.type, value: newData.value, time: Date.now() };
                   lastSentCommandRef.current = { type: newData.type, value: newData.value };
                   
                   notifyFlutter(newData.type, newData.value);
                } else if (isStickyDuplicate) {
                   console.log(`🛡️ [Header] Persistent lock: Command ${newData.type} already sent once. Waiting for disconnect.`);
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
        // ... (existing code)
        if (!prev) return user;
        const hasChanged = prev.displayName !== user.displayName || prev.employeeId !== user.employeeId || prev.email !== user.email || prev.profilePicUrl !== user.profilePicUrl;
        if (hasChanged) return user;
        return prev;
      });
    }
  }, [user?.displayName, user?.employeeId, user?.email, user?.profilePicUrl]);

  // Real-time Notification Listener
  useEffect(() => {
    const currentUid = displayUser?.uid;
    if (!mounted || !currentUid) return;

    // 1. Initial Fetch
    const fetchNotifications = async () => {
        const { data, error } = await supabase
            .from('notifications')
            .select('*')
            .eq('user_id', currentUid)
            .order('created_at', { ascending: false })
            .limit(20);
        
        if (!error && data) {
            setNotifications(data);
            setUnreadCount(data.filter(n => !n.is_seen).length);
        }
    };
    fetchNotifications();

    const channelName = `agent_notifications_${currentUid}`;
    console.log(`📡 [Header] Monitoring notifications: ${channelName}`);

    // 2. Real-time Subscription
    const channel = supabase
      .channel(channelName)
      // Listen for database inserts
      .on('postgres_changes', { 
         event: 'INSERT', 
         schema: 'public', 
         table: 'notifications', 
         filter: `user_id=eq.${currentUid}` 
      }, (payload) => {
          console.log('🔔 [Header] New persistent notification:', payload.new);
          setNotifications(prev => [payload.new, ...prev].slice(0, 20));
          setUnreadCount(c => c + 1);
          
          // Show immediate alert for critical types
          if (payload.new.type === 'lead_access') {
             showWarning(payload.new.message, "Lead Access Alert");
          }
      })
      // Keep broadcast for legacy support/sync if needed
      .on('broadcast', { event: 'manual_lead_access' }, (payload) => {
        // Fallback or double-check (usually DB insert covers this)
        console.log('🔔 [Header] Broadcast legacy event:', payload);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [mounted, displayUser?.uid]);

  const markAsSeen = async (id?: string) => {
    if (!displayUser?.uid) return;
    
    try {
        if (id) {
            // Mark specific
            await supabase.from('notifications').update({ is_seen: true }).eq('id', id);
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_seen: true } : n));
            setUnreadCount(c => Math.max(0, c - 1));
        } else {
            // Mark all
            await supabase.from('notifications').update({ is_seen: true }).eq('user_id', displayUser.uid).eq('is_seen', false);
            setNotifications(prev => prev.map(n => ({ ...n, is_seen: true })));
            setUnreadCount(0);
        }
    } catch (err) {
        console.error("Failed to update notification status:", err);
    }
  };

  const deleteNotification = async (id: string) => {
      try {
          await supabase.from('notifications').delete().eq('id', id);
          setNotifications(prev => {
              const item = prev.find(n => n.id === id);
              if (item && !item.is_seen) setUnreadCount(c => Math.max(0, c - 1));
              return prev.filter(n => n.id !== id);
          });
      } catch (err) {
          console.error("Failed to delete notification:", err);
      }
  };


  // Stable logout handler
  const handleLogout = useCallback(async () => {
    if (isLoggingOut || !onLogout) return;
    setIsLoggingOut(true);
    try {
      // 1. Get current active token from metadata
      const { getStoredUserData } = await import("../lib/localStorageUtils");
      const activeData = getStoredUserData();
      const accounts = (await import("../lib/sessionManager")).getStoredAccounts();
      
      let currentTokenId = activeData?.token_id;

      // 2. Fallback: Search in accounts
      if (!currentTokenId) {
        currentTokenId = displayUser?.employeeId 
          ? accounts.find(a => a.employee_id === displayUser.employeeId)?.token_id 
          : accounts[0]?.token_id;
      }

      onLogout(currentTokenId);

    } catch (err) {
      console.error("Logout exception:", err);
      setIsLoggingOut(false);
    }
  }, [isLoggingOut, onLogout, displayUser?.employeeId]);



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
            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 rounded-xl bg-gray-50/80 hover:bg-gray-100 transition-all active:scale-95 text-gray-600 relative overflow-visible"
              >
                {unreadCount > 0 ? (
                  <>
                    <BellRing className="w-5 h-5 text-indigo-600 animate-[bell_2s_infinite]" />
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                      {unreadCount}
                    </span>
                  </>
                ) : (
                  <Bell className="w-5 h-5" />
                )}
              </button>
            </div>

            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="p-2 rounded-xl bg-red-50/50 hover:bg-red-100 transition-all text-[#EF4444] disabled:opacity-50"
              aria-label="Logout"
            >
              {isLoggingOut ? (
                <div className="w-5 h-5 border-2 border-t-transparent border-current rounded-full animate-spin"></div>
              ) : (
                <i className="fi flex fi-rr-exit text-lg"></i>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Desktop Header */}
      <header
        className="hidden lg:block border-b fixed top-0 z-50 backdrop-blur-sm"
        style={{ 
          borderColor: "#E0E0E0", 
          left: hideSidebar ? "0" : "224px", 
          width: hideSidebar ? "100%" : "calc(100% - 224px)",
          backgroundColor: "rgba(255, 255, 255, 0.8)" 
        }}
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
          <div className="flex items-center gap-3 lg:gap-6 shrink-0 ml-auto">
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
                
               
              </div>
            )}

            {/* Server Status */}
            <div
              className={`flex items-center justify-center rounded-full text-sm font-medium transition-all duration-700 ease-in-out overflow-hidden cursor-pointer ${
                showFullStatus ? 'gap-2 px-3 py-1.5 w-auto' : 'gap-0 p-2 w-9 h-9'
              } ${
                serverStatus === 'online'
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : serverStatus === 'offline'
                  ? 'bg-red-50 text-red-700 border border-red-200'
                  : 'bg-amber-50 text-amber-700 border border-amber-200'
              }`}
              onClick={() => setShowFullStatus(!showFullStatus)}
              title={serverStatus === 'online' ? 'Server Online' : serverStatus === 'offline' ? 'Server Offline' : 'Checking...'}
            >
              {serverStatus === 'online' ? (
                <>
                  <Wifi className="w-4 h-4 flex-shrink-0" />
                  <span
                    className={`whitespace-nowrap transition-all duration-700 ease-in-out ${
                      showFullStatus ? 'max-w-[100px] opacity-100' : 'max-w-0 opacity-0'
                    }`}
                    style={{ overflow: 'hidden', fontFamily: "'Roboto', sans-serif" }}
                  >
                    Online
                  </span>
                </>
              ) : serverStatus === 'offline' ? (
                <>
                  <WifiOff className="w-4 h-4 flex-shrink-0" />
                  <span
                    className={`whitespace-nowrap transition-all duration-700 ease-in-out ${
                      showFullStatus ? 'max-w-[100px] opacity-100' : 'max-w-0 opacity-0'
                    }`}
                    style={{ overflow: 'hidden', fontFamily: "'Roboto', sans-serif" }}
                  >
                    Offline
                  </span>
                </>
              ) : (
                <>
                  <Wifi className="w-4 h-4 animate-pulse flex-shrink-0" />
                  <span
                    className={`whitespace-nowrap transition-all duration-700 ease-in-out ${
                      showFullStatus ? 'max-w-[100px] opacity-100' : 'max-w-0 opacity-0'
                    }`}
                    style={{ overflow: 'hidden', fontFamily: "'Roboto', sans-serif" }}
                  >
                    Checking...
                  </span>
                </>
              )}
            </div>

            {/* Notification Bell (Desktop) */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2.5 rounded-xl bg-gray-50/80 hover:bg-gray-100 transition-all active:scale-95 text-gray-600 group relative"
              >
                {unreadCount > 0 ? (
                  <>
                    <BellRing className="w-5 h-5 text-indigo-600 animate-[bell_2s_infinite]" />
                    <span className="absolute top-1 right-1 w-4.5 h-4.5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white shadow-sm transition-transform active:scale-110">
                      {unreadCount > 20 ? '20+' : unreadCount}
                    </span>
                  </>
                ) : (
                  <Bell className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>
      <style jsx global>{`
        @keyframes bell {
          0%, 100% { transform: rotate(0); }
          10%, 30%, 50%, 70%, 90% { transform: rotate(-10deg); }
          20%, 40%, 60%, 80% { transform: rotate(10deg); }
        }
      `}</style>

      {/* Persistent Notification Dropdown/Panel */}
      {showNotifications && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40 bg-black/5" 
            onClick={() => setShowNotifications(false)}
          />

          <div 
            className="fixed top-20 right-4 lg:right-6 w-[calc(100vw-32px)] sm:w-80 md:w-96 z-50 bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col max-h-[85vh] transition-all animate-in fade-in slide-in-from-top-4 duration-300"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            {/* Header */}
            <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-gray-900 leading-none">Notifications</h3>
                <p className="text-[11px] text-gray-500 mt-1">You have {unreadCount} unread messages</p>
              </div>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button 
                    onClick={() => markAsSeen()}
                    className="p-2 rounded-lg hover:bg-white hover:shadow-sm text-indigo-600 transition-all active:scale-95"
                    title="Mark all as read"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                )}
                <button 
                  onClick={() => setShowNotifications(false)}
                  className="p-2 rounded-lg hover:bg-white hover:shadow-sm text-gray-400 hover:text-gray-600 transition-all active:scale-95"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto bg-white">
              {notifications.length > 0 ? (
                <div className="divide-y divide-gray-50">
                  {notifications.map((notif) => (
                    <div 
                      key={notif.id}
                      className={`px-6 py-4 flex gap-4 transition-colors relative group ${notif.is_seen ? 'opacity-80' : 'bg-indigo-50/30'}`}
                    >
                      {/* Icon based on type */}
                      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                        notif.type === 'lead_access' ? 'bg-amber-100 text-amber-600' : 'bg-indigo-100 text-indigo-600'
                      }`}>
                        {notif.type === 'lead_access' ? <AlertTriangle className="w-5 h-5" /> : <Info className="w-5 h-5" />}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="text-[10px] font-black uppercase tracking-wider text-gray-400">
                             {notif.type.replace('_', ' ')}
                          </span>
                          <span className="text-[10px] text-gray-400">
                             {new Date(notif.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className={`text-sm leading-relaxed ${notif.is_seen ? 'text-gray-500' : 'text-gray-800 font-medium'}`}>
                          {notif.message}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                        {!notif.is_seen && (
                          <button 
                            onClick={() => markAsSeen(notif.id)}
                            className="p-1.5 bg-white shadow-sm border border-gray-100 rounded-lg text-indigo-600 hover:bg-slate-50"
                          >
                            <Check className="w-3 h-3" />
                          </button>
                        )}
                        <button 
                          onClick={() => deleteNotification(notif.id)}
                          className="p-1.5 bg-white shadow-sm border border-gray-100 rounded-lg text-red-500 hover:bg-slate-50"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="px-6 py-12 flex flex-col items-center justify-center text-center">
                   <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                      <Bell className="w-8 h-8 text-gray-300" />
                   </div>
                   <h4 className="text-sm font-bold text-gray-900 mb-1 caps">No Notifications Yet</h4>
                   <p className="text-xs text-gray-500">We'll notify you when something important happens.</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 bg-gray-50/50 border-t border-gray-100">
               <button 
                className="w-full py-2.5 bg-white border border-gray-200 rounded-2xl text-xs font-bold text-gray-600 hover:bg-gray-50 transition-all active:scale-[0.98]"
                onClick={() => setShowNotifications(false)}
               >
                 Close Panel
               </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}

const Header = memo(HeaderComponent);
export default Header;
