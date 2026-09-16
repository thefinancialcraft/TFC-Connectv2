import { useState, useEffect, memo, useMemo, useCallback, useRef } from "react";
import { useRouter } from "next/router";
import { Bell, BellRing, Check, Trash2, X, Info, AlertTriangle, Wifi, WifiOff } from "lucide-react";
import AppLogo from "./AppLogo";
import { getStoredUserData } from "../lib/localStorageUtils";
import { supabase } from "../lib/supabase";
import { notifyFlutter, sendHeartbeat, requestDeviceInfoFromFlutter } from "../lib/flutterBridge";
import { showWarning } from "../lib/dialogUtils";
import { computePhoneHash, formatMaskedPhone, decryptPhone } from "../lib/phoneUtils";

interface HeaderProps {
  user?: {
    displayName?: string | null;
    email?: string;
    employeeId?: string | null;
    profilePicUrl?: string | null;
    uid?: string;
    lastSignInAt?: string | null;
  };
  onLogout?: (tokenId?: string) => void;
  hideSidebar?: boolean;
  isStatic?: boolean;
  hideBorder?: boolean;
}

// Ultra-smooth, letter-by-letter staggered bottom-to-top bounce animation
const AnimatedSearchPlaceholder = memo(({ 
  field, 
  isVisible 
}: { 
  field: "name" | "phone"; 
  isVisible: boolean;
}) => {
  const namePhrases = useMemo(() => [
    "Please enter customer name...",
    "Deepak Kumar",
    "Rahul Sharma",
    "Amit Patel",
    "Priya Verma",
  ], []);

  const phonePhrases = useMemo(() => [
    "Please enter customer phone no...",
    "8882558932",
    "9876543210",
    "9810123456",
    "9711234567",
  ], []);

  const phrases = field === 'name' ? namePhrases : phonePhrases;
  const [index, setIndex] = useState(0);
  const [isExiting, setIsExiting] = useState(false);

  // Reset instantly when user switches search field
  useEffect(() => {
    setIndex(0);
    setIsExiting(false);
  }, [field]);

  useEffect(() => {
    if (!isVisible) return;

    const currentLength = phrases[index % phrases.length].length;
    // Calculate exit duration based on character count
    const exitDuration = Math.min(currentLength * 14 + 220, 650);

    const interval = setInterval(() => {
      // 1. Letters wave up and exit
      setIsExiting(true);

      // 2. After all letters exit, switch to next phrase and wave in from bottom
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % phrases.length);
        setIsExiting(false);
      }, exitDuration);
    }, 3800);

    return () => clearInterval(interval);
  }, [isVisible, index, phrases]);

  if (!isVisible) return null;

  const currentPhrase = phrases[index % phrases.length];

  return (
    <div className="absolute left-8.5 top-0 bottom-0 right-16 flex items-center pointer-events-none overflow-hidden select-none z-10">
      <style>{`
        @keyframes letterBounceIn {
          0% {
            opacity: 0;
            transform: translateY(18px);
          }
          48% {
            opacity: 1;
            transform: translateY(-3px);
          }
          72% {
            transform: translateY(1.2px);
          }
          88% {
            transform: translateY(-0.4px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes letterExitUp {
          0% {
            opacity: 1;
            transform: translateY(0);
          }
          100% {
            opacity: 0;
            transform: translateY(-16px);
          }
        }
      `}</style>
      <span
        key={`${field}-${index}-${isExiting ? 'exit' : 'enter'}`}
        className="text-xs font-medium text-gray-400 truncate block w-full whitespace-nowrap"
      >
        {currentPhrase.split("").map((char, charIdx) => (
          <span
            key={charIdx}
            className="inline-block"
            style={{
              animation: isExiting
                ? `letterExitUp 200ms cubic-bezier(0.4, 0, 0.2, 1) ${charIdx * 14}ms forwards`
                : `letterBounceIn 680ms cubic-bezier(0.33, 1, 0.68, 1) ${charIdx * 30}ms both`,
              willChange: "transform, opacity",
            }}
          >
            {char === " " ? "\u00A0" : char}
          </span>
        ))}
      </span>
    </div>
  );
});

function HeaderComponent({ user, onLogout, hideSidebar = false, isStatic = false, hideBorder = false }: HeaderProps) {
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

  // Search Bar States
  const [headerSearchQuery, setHeaderSearchQuery] = useState("");
  const [headerSearchField, setHeaderSearchField] = useState<"name" | "phone">("name");
  const [showHeaderSearchDropdown, setShowHeaderSearchDropdown] = useState(false);
  const [searchDropdownOpen, setSearchDropdownOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [deniedLeadId, setDeniedLeadId] = useState<string | null>(null);
  const searchContainerRef = useRef<HTMLDivElement | null>(null);
  const autoSearchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const deniedTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
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
        uid: (cached as any).id || (cached as any).uid || null // Grab UID/ID
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
    // Priority: 1. Props (user), 2. Cached (cachedUser)
    
    // DEBUG LOG
    // if (user?.profilePicUrl) console.log('Header: Using Prop Pic', user.profilePicUrl);
    // else if (cachedUser?.profilePicUrl) console.log('Header: Using Cached Pic', cachedUser.profilePicUrl);
    // else console.log('Header: No Pic Found', { user: user, cached: cachedUser });

    if (user?.profilePicUrl) return user.profilePicUrl;
    return mounted ? cachedUser?.profilePicUrl : null;
  }, [mounted, user?.profilePicUrl, cachedUser?.profilePicUrl]);

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

    // --- REFACTORED: NO REALTIME SUBSCRIPTION (Saves 100% Messaging Quota) ---
    // Instead, we use a 5s polling loop for absolute responsiveness (REST API - Free Quota)
    const interval = setInterval(fetchPrimaryStatus, 5000);

    return () => {
      clearInterval(interval);
    };
  }, [mounted, displayUser?.employeeId, isBridgeActive, localEntryId]);

  // SENDER: Heartbeat Loop (Only if bridge is active)
  useEffect(() => {
    const empId = displayUser?.employeeId;
    if (!isBridgeActive || !empId) return;

    // Send initial heartbeat
    sendHeartbeat(empId);

    // Set up interval for every 30 seconds (Increased from 10s to save 66% messaging quota)
    const interval = setInterval(() => {
      sendHeartbeat(empId);
    }, 30000);

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
    
    // Mark offline if no heartbeat for 20 seconds (Stable for 5s polling)
    return diffSeconds < 20 ? 'online' : 'offline';
  }, [deviceStatus?.last_seen, tick]);

  // Ghost update: Only update if props actually changed
  useEffect(() => {
    if (user) {
      setCachedUser(prev => {
        // ... (existing code)
        if (!prev) return user;
        const hasChanged = 
            prev.displayName !== user.displayName || 
            prev.employeeId !== user.employeeId || 
            prev.email !== user.email || 
            prev.profilePicUrl !== user.profilePicUrl ||
            prev.uid !== user.uid;
        if (hasChanged) return user;
        return prev;
      });
    }
  }, [user?.displayName, user?.employeeId, user?.email, user?.profilePicUrl, user?.uid]);

  // Real-time Notification Listener
  useEffect(() => {
    let currentUid = displayUser?.uid;
    
    // Fallback: If UID is still missing, try to get it from active auth session
    const syncNotificationChannel = async () => {
        if (!mounted) return;
        
        let activeUid = currentUid;
        if (!activeUid) {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user?.id) {
                activeUid = session.user.id;
                console.log("🔑 [Header] Recovered UID from session:", activeUid);
            }
        }

        if (!activeUid) return;

        // 1. Initial Fetch
        const fetchNotifications = async () => {
            const { data, error } = await supabase
                .from('notifications')
                .select('*')
                .eq('user_id', activeUid)
                .order('created_at', { ascending: false })
                .limit(20);
            
            if (!error && data) {
                setNotifications(data);
                setUnreadCount(data.filter(n => !n.is_seen).length);
            }
        };
        fetchNotifications();

        const channelName = `agent_notifications_${activeUid}`;
        console.log(`📡 [Header] Monitoring notifications: ${channelName}`);

        // 2. Real-time Subscription (Full Sync: Insert, Update, Delete)
        const channel = supabase
          .channel(channelName)
          .on('postgres_changes', { 
             event: '*', 
             schema: 'public', 
             table: 'notifications', 
             filter: `user_id=eq.${activeUid}` 
          }, (payload: any) => {
              console.log(`🔔 [Header] Realtime Database ${payload.eventType}:`, payload);
              
              if (payload.eventType === 'INSERT') {
                  setNotifications(prev => [payload.new, ...prev].slice(0, 20));
                  setUnreadCount(c => c + 1);
                  if (payload.new.type === 'lead_access') {
                      showWarning(payload.new.message, "Lead Access Alert");
                  }
              } 
              else if (payload.eventType === 'UPDATE') {
                  setNotifications(prev => prev.map(n => n.id === payload.new.id ? payload.new : n));
                  if (payload.old && !payload.old.is_seen && payload.new.is_seen) {
                      setUnreadCount(c => Math.max(0, c - 1));
                  } else if (payload.old && payload.old.is_seen && !payload.new.is_seen) {
                      setUnreadCount(c => c + 1);
                  }
              }
              else if (payload.eventType === 'DELETE') {
                  setNotifications(prev => {
                      const deletedItem = prev.find(n => n.id === payload.old.id);
                      if (deletedItem && !deletedItem.is_seen) setUnreadCount(c => Math.max(0, c - 1));
                      return prev.filter(n => n.id !== payload.old.id);
                  });
              }
          })
          .subscribe();

        return channel;
    };

    const channelPromise = syncNotificationChannel();

    return () => {
      channelPromise.then((channel: any) => {
          if (channel) supabase.removeChannel(channel);
      });
    };
  }, [mounted, displayUser?.uid]);

  const markAsSeen = async (id?: string | number) => {
    try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        const idStr = id ? String(id) : null;
        
        // Optimistic UI update
        if (idStr && idStr.startsWith('temp_')) {
            setNotifications(prev => prev.map(n => String(n.id) === idStr ? { ...n, is_seen: true } : n));
            setUnreadCount(c => Math.max(0, c - 1));
            return;
        }

        const response = await fetch('/api/notifications/mark-as-seen', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.access_token}`
            },
            body: JSON.stringify({ id: id, markAll: !id })
        });

        const result = await response.json();
        if (result.success) {
            if (id) {
                setNotifications(prev => prev.map(n => String(n.id) === idStr ? { ...n, is_seen: true } : n));
                setUnreadCount(c => Math.max(0, c - 1));
            } else {
                setNotifications(prev => prev.map(n => ({ ...n, is_seen: true })));
                setUnreadCount(0);
            }
            console.log("✅ [Header] Mark as seen success via API");
        }
    } catch (err) {
        console.error("❌ [Header] Failed to mark as seen:", err);
    }
  };

  const deleteNotification = async (id: string | number) => {
      const idStr = String(id);
      console.log(`🗑️ [Header] Deleting notification ${idStr} via API`);
      
      // 1. UI update (Optimistic)
      setNotifications(prev => {
          const item = prev.find(n => String(n.id) === idStr);
          if (item && !item.is_seen) setUnreadCount(c => Math.max(0, c - 1));
          return prev.filter(n => String(n.id) !== idStr);
      });

      // 2. DB update (API Call)
      if (!idStr.startsWith('temp_')) {
          try {
              const { data: { session } } = await supabase.auth.getSession();
              if (!session) return;

              const response = await fetch('/api/notifications/delete', {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json',
                      'Authorization': `Bearer ${session.access_token}`
                  },
                  body: JSON.stringify({ id: id })
              });

              const result = await response.json();
              if (result.success) {
                  console.log(`✅ [Header] DB Delete Success. Rows affected: ${result.deletedCount}`);
              } else {
                  console.error("❌ [Header] API Delete Error:", result.error);
              }
          } catch (err) {
              console.error("❌ [Header] Fatal Delete Exception:", err);
          }
      }
  };


  // Stable logout handler
  const handleLogout = useCallback(async () => {
    if (isLoggingOut || !onLogout) return;
    setIsLoggingOut(true);
    try {
      onLogout();
    } catch (err) {
      console.error("Logout exception:", err);
      setIsLoggingOut(false);
    }
  }, [isLoggingOut, onLogout]);

  // Click outside and Escape key handler for search dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setSearchDropdownOpen(false);
        setShowHeaderSearchDropdown(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSearchDropdownOpen(false);
        setShowHeaderSearchDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Customer search handler (triggered automatically as user types or on Enter)
  const handleHeaderSearch = useCallback(async (overrideQuery?: string, overrideField?: 'name' | 'phone') => {
    const activeField = overrideField || headerSearchField;
    const query = (typeof overrideQuery === 'string' ? overrideQuery : headerSearchQuery).trim();
    if (!query) {
      setSearchResults([]);
      setSearchDropdownOpen(false);
      return;
    }

    setIsSearching(true);
    setSearchDropdownOpen(true);
    setShowHeaderSearchDropdown(false);

    try {
      const userData = typeof window !== 'undefined' ? getStoredUserData() : null;
      const isClient = Boolean(userData?.is_client || (userData as any)?.isClient);
      const orgId = userData?.organization_id;

      const { data: { session } } = await supabase.auth.getSession();
      const authUid = session?.user?.id;
      
      // Resolve candidate UUIDs for current user (both auth user_id and profile id)
      const myUids = new Set<string>();
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      
      if (authUid && uuidRegex.test(authUid)) myUids.add(authUid);
      if (displayUser?.uid && uuidRegex.test(displayUser.uid)) myUids.add(displayUser.uid);
      if (userData?.user_id && uuidRegex.test(userData.user_id)) myUids.add(userData.user_id);
      if ((userData as any)?.id && uuidRegex.test((userData as any).id)) myUids.add((userData as any).id);

      const myEmpId = displayUser?.employeeId || userData?.employee_id;

      // Ensure we look up user_profiles to collect both user_id and id if available
      try {
        let profileFilter = '';
        if (myUids.size > 0) {
          profileFilter = `user_id.in.("${Array.from(myUids).join('","')}"),id.in.("${Array.from(myUids).join('","')}")`;
        }
        if (myEmpId) {
          profileFilter = profileFilter ? `${profileFilter},employee_id.eq.${myEmpId}` : `employee_id.eq.${myEmpId}`;
        }
        if (profileFilter) {
          const { data: myProfiles } = await supabase
            .from('user_profiles')
            .select('user_id, id, employee_id')
            .or(profileFilter)
            .limit(2);
          if (myProfiles && myProfiles.length > 0) {
            myProfiles.forEach(p => {
              if (p.user_id && uuidRegex.test(p.user_id)) myUids.add(p.user_id);
              if (p.id && uuidRegex.test(p.id)) myUids.add(p.id);
            });
          }
        }
      } catch (pErr) {
        console.warn('Profile fetch for search error:', pErr);
      }

      const validMyUidList = Array.from(myUids);
      const validMyUid = validMyUidList[0] || null;

      // Helper function to apply search filters (name / phone and org)
      const applyFilters = (qb: any, tableType: 'customers' | 'rejected' | 'closed') => {
        if (isClient && orgId) {
          qb = qb.eq('organization_id', orgId);
        }

        if (activeField === 'name') {
          qb = qb.ilike('customer_name', `%${query}%`);
        } else {
          const cleanPhone = query.replace(/\D/g, '');
          if (cleanPhone.length > 0) {
            const phoneHash = computePhoneHash(cleanPhone);
            if (phoneHash) {
              if (cleanPhone.length >= 7) {
                // Exact hash match or exact/suffix phone match (exact 10 digits or exact local)
                qb = qb.or(`phone_search_hash.eq.${phoneHash},phone_no.eq.${cleanPhone},phone_no.ilike.%${cleanPhone}`);
              } else {
                qb = qb.or(`phone_search_hash.eq.${phoneHash},phone_no.ilike.%${cleanPhone}%`);
              }
            } else {
              qb = qb.ilike('phone_no', `%${cleanPhone}%`);
            }
          } else {
            qb = qb.ilike('phone_no', `%${query}%`);
          }
        }
        return qb;
      };

      const seenIds = new Set<string>();
      const myLeads: any[] = [];
      const unassignedLeads: any[] = [];
      const otherAssignedLeads: any[] = [];

      // =========================================================================
      // STEP 1: Search customer in CURRENT USER'S ASSIGNED LEADS
      // (customers table, rejected_leads table, closed_deals table)
      // =========================================================================
      if (validMyUidList.length > 0) {
        try {
          // 1.1 customers assigned to me
          let myCustQuery = supabase
            .from('customers')
            .select('id, customer_name, phone_no, status, campaign_id, created_at, assigned_to');
          
          if (validMyUidList.length === 1) {
            myCustQuery = myCustQuery.eq('assigned_to', validMyUidList[0]);
          } else {
            myCustQuery = myCustQuery.in('assigned_to', validMyUidList);
          }
          myCustQuery = applyFilters(myCustQuery, 'customers');
          const { data: myCustData } = await myCustQuery.order('created_at', { ascending: false }).limit(20);

          if (myCustData && myCustData.length > 0) {
            myCustData.forEach((item: any) => {
              if (!seenIds.has(item.id)) {
                seenIds.add(item.id);
                myLeads.push({
                  ...item,
                  sourceType: 'live',
                  displayStatus: item.status || 'Active',
                  agentId: item.assigned_to,
                  isAssignedToMe: true
                });
              }
            });
          }

          // 1.2 rejected_leads assigned to me
          let myRejQuery = supabase
            .from('rejected_leads')
            .select('id, customer_name, phone_no, disposition, campaign_id, created_at, agent_id');

          if (validMyUidList.length === 1) {
            myRejQuery = myRejQuery.eq('agent_id', validMyUidList[0]);
          } else {
            myRejQuery = myRejQuery.in('agent_id', validMyUidList);
          }
          myRejQuery = applyFilters(myRejQuery, 'rejected');
          const { data: myRejData } = await myRejQuery.order('created_at', { ascending: false }).limit(10);

          if (myRejData && myRejData.length > 0) {
            myRejData.forEach((item: any) => {
              if (!seenIds.has(item.id)) {
                seenIds.add(item.id);
                myLeads.push({
                  ...item,
                  sourceType: 'rejected',
                  displayStatus: item.disposition || 'Rejected',
                  agentId: item.agent_id,
                  isAssignedToMe: true
                });
              }
            });
          }

          // 1.3 closed_deals assigned to me
          let myClosedQuery = supabase
            .from('closed_deals')
            .select('id, customer_id, customer_name, phone_no, final_disposition, campaign_id, created_at, agent_id');

          if (validMyUidList.length === 1) {
            myClosedQuery = myClosedQuery.eq('agent_id', validMyUidList[0]);
          } else {
            myClosedQuery = myClosedQuery.in('agent_id', validMyUidList);
          }
          myClosedQuery = applyFilters(myClosedQuery, 'closed');
          const { data: myClosedData } = await myClosedQuery.order('created_at', { ascending: false }).limit(10);

          if (myClosedData && myClosedData.length > 0) {
            myClosedData.forEach((item: any) => {
              const leadId = item.id || item.customer_id;
              if (!seenIds.has(leadId)) {
                seenIds.add(leadId);
                myLeads.push({
                  ...item,
                  id: leadId,
                  sourceType: 'closed',
                  displayStatus: item.final_disposition || 'Closed',
                  agentId: item.agent_id,
                  isAssignedToMe: true
                });
              }
            });
          }

          // 1.4 Also check call_logs (recent follow-ups handled by me)
          const logConditions = validMyUidList.map(uid => `agent_id.eq.${uid},assigned_to.eq.${uid}`).join(',');
          let myLogQuery = supabase
            .from('call_logs')
            .select('customer_id, customer_name, campaign_id, disposition, created_at, agent_id, assigned_to')
            .or(logConditions);
          
          if (headerSearchField === 'name') {
            myLogQuery = myLogQuery.ilike('customer_name', `%${query}%`);
          }
          if (isClient && orgId) {
            myLogQuery = myLogQuery.eq('organization_id', orgId);
          }

          const { data: logData } = await myLogQuery.order('created_at', { ascending: false }).limit(10);
          if (logData && logData.length > 0) {
            const missingCustIds = logData
              .map((l: any) => l.customer_id)
              .filter((cid: string) => cid && !seenIds.has(cid));

            if (missingCustIds.length > 0) {
              const { data: logCusts } = await supabase
                .from('customers')
                .select('id, customer_name, phone_no, status, campaign_id, created_at, assigned_to')
                .in('id', missingCustIds);

              if (logCusts) {
                logCusts.forEach((cd: any) => {
                  if (!seenIds.has(cd.id)) {
                    seenIds.add(cd.id);
                    myLeads.push({
                      ...cd,
                      sourceType: 'live',
                      displayStatus: cd.status || 'Follow Up',
                      agentId: cd.assigned_to || validMyUid,
                      isAssignedToMe: true
                    });
                  }
                });
              }
            }
          }
        } catch (myErr) {
          console.warn('Error in STEP 1 (User assigned search):', myErr);
        }
      }

      // =========================================================================
      // STEP 2: Search in UNASSIGNED LEADS
      // (customers with assigned_to IS NULL, rejected/closed without agent_id)
      // =========================================================================
      try {
        // 2.1 Unassigned customers
        let unassignedCustQuery = supabase
          .from('customers')
          .select('id, customer_name, phone_no, status, campaign_id, created_at, assigned_to')
          .is('assigned_to', null);
        unassignedCustQuery = applyFilters(unassignedCustQuery, 'customers');
        const { data: unassignedCustData } = await unassignedCustQuery.order('created_at', { ascending: false }).limit(25);

        if (unassignedCustData && unassignedCustData.length > 0) {
          unassignedCustData.forEach((item: any) => {
            if (!seenIds.has(item.id)) {
              seenIds.add(item.id);
              unassignedLeads.push({
                ...item,
                sourceType: 'live',
                displayStatus: item.status || 'Active',
                agentId: null,
                isAssignedToMe: false
              });
            }
          });
        }

        // 2.2 Unassigned rejected leads
        if (myLeads.length + unassignedLeads.length < 10) {
          let unassignedRejQuery = supabase
            .from('rejected_leads')
            .select('id, customer_name, phone_no, disposition, campaign_id, created_at, agent_id')
            .is('agent_id', null);
          unassignedRejQuery = applyFilters(unassignedRejQuery, 'rejected');
          const { data: unassignedRejData } = await unassignedRejQuery.order('created_at', { ascending: false }).limit(10);

          if (unassignedRejData && unassignedRejData.length > 0) {
            unassignedRejData.forEach((item: any) => {
              if (!seenIds.has(item.id)) {
                seenIds.add(item.id);
                unassignedLeads.push({
                  ...item,
                  sourceType: 'rejected',
                  displayStatus: item.disposition || 'Rejected',
                  agentId: null,
                  isAssignedToMe: false
                });
              }
            });
          }
        }
      } catch (unassignedErr) {
        console.warn('Error in STEP 2 (Unassigned leads search):', unassignedErr);
      }

      // =========================================================================
      // STEP 3: Search in OTHER USERS' ASSIGNED LEADS
      // (customers, rejected_leads, closed_deals where assigned_to != current user)
      // =========================================================================
      if (myLeads.length + unassignedLeads.length < 10) {
        try {
          // 3.1 Other users' customers
          let otherCustQuery = supabase
            .from('customers')
            .select('id, customer_name, phone_no, status, campaign_id, created_at, assigned_to')
            .not('assigned_to', 'is', null);

          if (validMyUidList.length === 1) {
            otherCustQuery = otherCustQuery.neq('assigned_to', validMyUidList[0]);
          } else if (validMyUidList.length > 1) {
            otherCustQuery = otherCustQuery.not('assigned_to', 'in', `("${validMyUidList.join('","')}")`);
          }
          otherCustQuery = applyFilters(otherCustQuery, 'customers');
          const { data: otherCustData } = await otherCustQuery.order('created_at', { ascending: false }).limit(20);

          if (otherCustData && otherCustData.length > 0) {
            otherCustData.forEach((item: any) => {
              if (!seenIds.has(item.id)) {
                seenIds.add(item.id);
                otherAssignedLeads.push({
                  ...item,
                  sourceType: 'live',
                  displayStatus: item.status || 'Active',
                  agentId: item.assigned_to,
                  isAssignedToMe: false
                });
              }
            });
          }

          // 3.2 Other users' rejected leads
          if (myLeads.length + unassignedLeads.length + otherAssignedLeads.length < 10) {
            let otherRejQuery = supabase
              .from('rejected_leads')
              .select('id, customer_name, phone_no, disposition, campaign_id, created_at, agent_id')
              .not('agent_id', 'is', null);

            if (validMyUidList.length === 1) {
              otherRejQuery = otherRejQuery.neq('agent_id', validMyUidList[0]);
            } else if (validMyUidList.length > 1) {
              otherRejQuery = otherRejQuery.not('agent_id', 'in', `("${validMyUidList.join('","')}")`);
            }
            otherRejQuery = applyFilters(otherRejQuery, 'rejected');
            const { data: otherRejData } = await otherRejQuery.order('created_at', { ascending: false }).limit(10);

            if (otherRejData && otherRejData.length > 0) {
              otherRejData.forEach((item: any) => {
                if (!seenIds.has(item.id)) {
                  seenIds.add(item.id);
                  otherAssignedLeads.push({
                    ...item,
                    sourceType: 'rejected',
                    displayStatus: item.disposition || 'Rejected',
                    agentId: item.agent_id,
                    isAssignedToMe: false
                  });
                }
              });
            }
          }

          // 3.3 Other users' closed deals
          if (myLeads.length + unassignedLeads.length + otherAssignedLeads.length < 10) {
            let otherClosedQuery = supabase
              .from('closed_deals')
              .select('id, customer_id, customer_name, phone_no, final_disposition, campaign_id, created_at, agent_id')
              .not('agent_id', 'is', null);

            if (validMyUidList.length === 1) {
              otherClosedQuery = otherClosedQuery.neq('agent_id', validMyUidList[0]);
            } else if (validMyUidList.length > 1) {
              otherClosedQuery = otherClosedQuery.not('agent_id', 'in', `("${validMyUidList.join('","')}")`);
            }
            otherClosedQuery = applyFilters(otherClosedQuery, 'closed');
            const { data: otherClosedData } = await otherClosedQuery.order('created_at', { ascending: false }).limit(10);

            if (otherClosedData && otherClosedData.length > 0) {
              otherClosedData.forEach((item: any) => {
                const leadId = item.id || item.customer_id;
                if (!seenIds.has(leadId)) {
                  seenIds.add(leadId);
                  otherAssignedLeads.push({
                    ...item,
                    id: leadId,
                    sourceType: 'closed',
                    displayStatus: item.final_disposition || 'Closed',
                    agentId: item.agent_id,
                    isAssignedToMe: false
                  });
                }
              });
            }
          }
        } catch (otherErr) {
          console.warn('Error in STEP 3 (Other users assigned leads search):', otherErr);
        }
      }

      // Combine in strict order:
      // 1. Current user assigned
      // 2. Unassigned leads
      // 3. Other users assigned leads
      let results = [...myLeads, ...unassignedLeads, ...otherAssignedLeads];

      // Fetch agent names for any leads that have an agentId (using server API to bypass RLS)
      const allAgentIds = [...new Set(results.map(r => r.agentId).filter(Boolean))];
      let agentMap: Record<string, { user_name: string | null; employee_id: string | null }> = {};
      if (allAgentIds.length > 0) {
        try {
          // 1. First call server-side bypass API to get agent profiles regardless of RLS restrictions
          const res = await fetch('/api/auth/search-agents', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ agentIds: allAgentIds }),
          });
          if (res.ok) {
            const resData = await res.json();
            if (resData.success && resData.agents) {
              agentMap = resData.agents;
            }
          }
        } catch (apiErr) {
          console.warn('search-agents API error:', apiErr);
        }

        // 2. Fallback to client query if any IDs still missing from agentMap
        const remainingAgentIds = allAgentIds.filter(id => !agentMap[id]);
        if (remainingAgentIds.length > 0) {
          try {
            const { data: profiles } = await supabase
              .from('user_profiles')
              .select('user_id, id, user_name, employee_id')
              .or(`user_id.in.("${remainingAgentIds.join('","')}"),id.in.("${remainingAgentIds.join('","')}")`);

            if (profiles && profiles.length > 0) {
              profiles.forEach(p => {
                const info = { user_name: p.user_name, employee_id: p.employee_id };
                if (p.user_id) agentMap[p.user_id] = info;
                if (p.id) agentMap[p.id] = info;
                if (p.employee_id) agentMap[p.employee_id] = info;
              });
            }
          } catch (profileErr) {
            console.warn('Failed to load agent profiles for search:', profileErr);
          }
        }
      }

      const currentUid = validMyUid || displayUser?.uid || userData?.user_id || (userData as any)?.id;

      results = results.map(r => {
        const profile = r.agentId ? agentMap[r.agentId] : null;
        const agentName = profile?.user_name || null;
        const agentEmpId = profile?.employee_id || null;
        
        const isAssignedToMe = Boolean(
          r.isAssignedToMe ||
          (r.agentId && validMyUidList.includes(r.agentId)) ||
          (currentUid && r.agentId === currentUid) ||
          (myEmpId && agentEmpId === myEmpId) ||
          (myEmpId && r.agentId === myEmpId)
        );

        return {
          ...r,
          assignedName: agentName,
          assignedEmpId: agentEmpId,
          isAssignedToMe
        };
      });

      // If searching by phone, enforce exact match filtering on decrypted phone numbers
      if (activeField === 'phone') {
        const cleanPhone = query.replace(/\D/g, '');
        if (cleanPhone.length >= 7) {
          results = results.filter(r => {
            const dec = decryptPhone(r.phone_no, r.organization_id || orgId);
            const cleanDec = dec ? dec.replace(/\D/g, '') : '';
            return cleanDec === cleanPhone || cleanDec.endsWith(cleanPhone) || cleanPhone.endsWith(cleanDec);
          });
        }
      }

      // Maintain strict priority:
      // Group 1: Assigned to Me (top)
      // Group 2: Unassigned (middle)
      // Group 3: Assigned to Others (bottom)
      results.sort((a, b) => {
        const getPriority = (item: any) => {
          if (item.isAssignedToMe) return 1;
          if (!item.agentId) return 2;
          return 3;
        };
        const pA = getPriority(a);
        const pB = getPriority(b);
        if (pA !== pB) return pA - pB;

        // In phone search, exact 10-digit match comes first
        if (activeField === 'phone') {
          const cleanPhone = query.replace(/\D/g, '');
          const decA = decryptPhone(a.phone_no, a.organization_id || orgId).replace(/\D/g, '');
          const decB = decryptPhone(b.phone_no, b.organization_id || orgId).replace(/\D/g, '');
          const exactA = decA === cleanPhone;
          const exactB = decB === cleanPhone;
          if (exactA && !exactB) return -1;
          if (!exactA && exactB) return 1;
        }

        return 0;
      });

      setSearchResults(results.slice(0, 10));
    } catch (err) {
      console.error('Header customer search exception:', err);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, [headerSearchQuery, headerSearchField, displayUser]);



  // Mobile header design
  return (
    <>
      {/* Mobile Header */}
      <header
        className={`lg:hidden ${hideBorder ? '' : 'border-b'} ${isStatic ? 'relative' : 'fixed top-0 left-0 right-0'} z-50 backdrop-blur-sm`}
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
            {mounted && profilePicUrl ? (
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
        className={`hidden lg:block ${hideBorder ? '' : 'border-b'} ${isStatic ? 'relative' : 'fixed top-0'} z-50 backdrop-blur-sm h-[60px]`}
        style={{ 
          borderColor: "#E0E0E0", 
          left: isStatic ? "0" : (hideSidebar ? "0" : "208px"), 
          width: isStatic ? "100%" : (hideSidebar ? "100%" : "calc(100% - 208px)"),
          backgroundColor: "rgba(255, 255, 255, 0.8)" 
        }}
      >
        <div className="w-full h-full px-5 flex items-center justify-between">
          {/* Left: Search Bar with Dropdown (Customer Table style - Simple, Flat, No Shadow, Compact) */}
          <div ref={searchContainerRef} className="relative w-64 sm:w-72 md:w-80 text-gray-800">
            <i className="fi flex fi-rr-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xs pointer-events-none z-20"></i>
            <AnimatedSearchPlaceholder field={headerSearchField} isVisible={!headerSearchQuery} />
            <input
              type="text"
              placeholder=""
              value={headerSearchQuery}
              onChange={(e) => {
                const rawVal = e.target.value;
                if (autoSearchTimeoutRef.current) {
                  clearTimeout(autoSearchTimeoutRef.current);
                }

                if (!rawVal.trim()) {
                  setHeaderSearchQuery('');
                  setSearchResults([]);
                  setSearchDropdownOpen(false);
                  return;
                }

                // Automatic protocol detection: Check the first non-whitespace character
                const firstChar = rawVal.trim().charAt(0);
                const isDigitStart = /[0-9]/.test(firstChar);

                if (isDigitStart) {
                  // PHONE PROTOCOL
                  if (headerSearchField !== 'phone') {
                    setHeaderSearchField('phone');
                  }
                  const cleanedPhone = rawVal.replace(/\D/g, '').slice(0, 10);
                  setHeaderSearchQuery(cleanedPhone);

                  if (cleanedPhone.length === 10) {
                    // Exact 10 digits reached -> trigger immediate search automatically!
                    handleHeaderSearch(cleanedPhone, 'phone');
                  } else {
                    setSearchResults([]);
                    setSearchDropdownOpen(false);
                  }
                } else {
                  // NAME PROTOCOL
                  if (headerSearchField !== 'name') {
                    setHeaderSearchField('name');
                  }
                  const cleanedName = rawVal.replace(/[0-9]/g, '');
                  setHeaderSearchQuery(cleanedName);

                  if (cleanedName.trim().length >= 2) {
                    autoSearchTimeoutRef.current = setTimeout(() => {
                      handleHeaderSearch(cleanedName, 'name');
                    }, 350);
                  } else {
                    setSearchResults([]);
                    setSearchDropdownOpen(false);
                  }
                }
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  if (autoSearchTimeoutRef.current) {
                    clearTimeout(autoSearchTimeoutRef.current);
                  }
                  handleHeaderSearch();
                  return;
                }

                // If input is empty, allow both digits and alphabets so user can start typing either
                if (!headerSearchQuery) {
                  return;
                }

                if (headerSearchField === 'name') {
                  // In name mode, block digits
                  if (/^[0-9]$/.test(e.key)) {
                    e.preventDefault();
                  }
                } else if (headerSearchField === 'phone') {
                  // In phone mode, block alphabets
                  if (/^[a-zA-Z]$/.test(e.key)) {
                    e.preventDefault();
                  }
                }
              }}
              onPaste={(e) => {
                e.preventDefault();
                if (autoSearchTimeoutRef.current) {
                  clearTimeout(autoSearchTimeoutRef.current);
                }
                const pasteText = e.clipboardData.getData('text').trim();
                if (!pasteText) return;

                const firstChar = pasteText.charAt(0);
                const isDigitStart = /[0-9]/.test(firstChar);

                if (isDigitStart) {
                  setHeaderSearchField('phone');
                  const cleanedPhone = pasteText.replace(/\D/g, '').slice(0, 10);
                  setHeaderSearchQuery(cleanedPhone);
                  if (cleanedPhone.length === 10) {
                    handleHeaderSearch(cleanedPhone, 'phone');
                  }
                } else {
                  setHeaderSearchField('name');
                  const cleanedName = pasteText.replace(/[0-9]/g, '');
                  setHeaderSearchQuery(cleanedName);
                  if (cleanedName.trim().length >= 2) {
                    autoSearchTimeoutRef.current = setTimeout(() => {
                      handleHeaderSearch(cleanedName, 'name');
                    }, 300);
                  }
                }
              }}
              className="w-full h-9 pl-8.5 pr-14 text-xs bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-[#4b33e8] transition-colors placeholder:text-gray-400 placeholder:font-medium font-medium text-gray-800"
            />
            
            <div className="absolute right-1.5 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
              {headerSearchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    if (autoSearchTimeoutRef.current) {
                      clearTimeout(autoSearchTimeoutRef.current);
                    }
                    setHeaderSearchQuery('');
                    setSearchResults([]);
                    setSearchDropdownOpen(false);
                  }}
                  className="w-4 h-4 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                  title="Clear"
                >
                  <i className="fi flex fi-rr-cross-small text-[10px]"></i>
                </button>
              )}
              <button 
                type="button"
                onClick={() => setShowHeaderSearchDropdown(!showHeaderSearchDropdown)}
                className="h-6.5 w-6.5 flex items-center justify-center rounded bg-gray-50 hover:bg-gray-100 text-gray-500 hover:text-[#4b33e8] transition-colors border border-gray-200 text-[11px]"
                title="Change search field"
              >
                <i className={`fi flex ${headerSearchField === 'name' ? 'fi-rr-user' : 'fi-rr-phone-call'} text-[11px]`}></i>
              </button>
            </div>

            {/* Field selector dropdown (NAME / PHONE) */}
            {showHeaderSearchDropdown && (
              <div className="absolute right-0 top-full mt-1.5 w-32 bg-white border border-gray-200 rounded-lg z-[100] overflow-hidden">
                <button
                  type="button"
                  onClick={() => {
                    if (autoSearchTimeoutRef.current) {
                      clearTimeout(autoSearchTimeoutRef.current);
                    }
                    setHeaderSearchField("name");
                    setShowHeaderSearchDropdown(false);
                    setSearchDropdownOpen(false);
                    setSearchResults([]);
                    setHeaderSearchQuery(prev => prev.replace(/[0-9]/g, ''));
                  }}
                  className={`w-full px-3 py-2 text-left text-xs font-bold transition-colors flex items-center gap-2 ${headerSearchField === 'name' ? 'bg-indigo-50 text-[#4b33e8]' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  <i className="fi flex fi-rr-user text-xs"></i>
                  NAME
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (autoSearchTimeoutRef.current) {
                      clearTimeout(autoSearchTimeoutRef.current);
                    }
                    setHeaderSearchField("phone");
                    setShowHeaderSearchDropdown(false);
                    setSearchDropdownOpen(false);
                    setSearchResults([]);
                    setHeaderSearchQuery(prev => prev.replace(/[a-zA-Z]/g, ''));
                  }}
                  className={`w-full px-3 py-2 text-left text-xs font-bold transition-colors flex items-center gap-2 ${headerSearchField === 'phone' ? 'bg-indigo-50 text-[#4b33e8]' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  <i className="fi flex fi-rr-phone-call text-xs"></i>
                  PHONE
                </button>
              </div>
            )}

            {/* Custom Dropdown on Enter */}
            {searchDropdownOpen && (
              <div 
                className="absolute left-0 top-full mt-2 w-full sm:w-[410px] bg-white rounded-xl border border-[#4b33e8]/35 z-[100] overflow-hidden"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                {/* Dropdown Header */}
                <div className="px-4 py-3 bg-gradient-to-r from-purple-50/60 via-slate-50 to-indigo-50/40 border-b border-[#4b33e8]/15 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xs font-semibold text-slate-800 tracking-wide">Customer Results</span>
                    {isSearching ? (
                      <span className="text-[11px] text-slate-400 font-medium">Searching...</span>
                    ) : (
                      <span className="text-[11px] text-slate-500 font-medium">
                        ({searchResults.length} found)
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => setSearchDropdownOpen(false)}
                    className="w-6 h-6 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-200/70 transition-colors flex items-center justify-center"
                    title="Close search"
                  >
                    <i className="fi flex fi-rr-cross-small text-xs"></i>
                  </button>
                </div>

                {/* Dropdown Content */}
                <div className="max-h-80 overflow-y-auto bg-white divide-y divide-slate-100">
                  {isSearching ? (
                    <div className="py-7 flex flex-col items-center justify-center gap-2.5 text-slate-400">
                      <div className="w-5 h-5 border-2 border-[#4b33e8] border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-xs font-medium text-slate-500">Searching customers...</span>
                    </div>
                  ) : searchResults.length > 0 ? (
                    <div className="divide-y divide-slate-100/90">
                      {searchResults.map((cust) => {
                        const maskedPhone = formatMaskedPhone(cust.phone_no);
                        const initial = (cust.customer_name || 'C').charAt(0).toUpperCase();

                        const isAssignedToOther = Boolean(!cust.isAssignedToMe && cust.agentId);
                        const isDenied = deniedLeadId === cust.id;

                        return (
                          <div
                            key={cust.id}
                            onClick={() => {
                              // If assigned to another agent, do not open!
                              if (isAssignedToOther) {
                                if (deniedTimeoutRef.current) {
                                  clearTimeout(deniedTimeoutRef.current);
                                }
                                setDeniedLeadId(cust.id);
                                showWarning(
                                  `Access Denied: This lead is already assigned to ${cust.assignedName || 'another agent'} (${cust.assignedEmpId || 'Agent'}). You cannot open it.`
                                );
                                deniedTimeoutRef.current = setTimeout(() => {
                                  setDeniedLeadId(null);
                                }, 800);
                                return;
                              }

                              setSearchDropdownOpen(false);
                              const targetCampaign = cust.campaign_id;
                              const targetCustId = cust.id;
                              
                              if (targetCampaign && targetCustId) {
                                // Save manual inspection snapshot to allow smooth inspection lock without auto-redirects
                                try {
                                  const currentUid = displayUser?.uid || getStoredUserData()?.user_id;
                                  if (currentUid) {
                                    const mockSession = {
                                      id: 'manual-' + Date.now(),
                                      user_id: currentUid,
                                      campaign_id: targetCampaign,
                                      customer_id: targetCustId,
                                      status: 'active',
                                      created_at: new Date().toISOString(),
                                      updated_at: new Date().toISOString()
                                    };
                                    localStorage.setItem('manual_inspection_snapshot', JSON.stringify(mockSession));
                                  }
                                } catch (lockErr) {
                                  console.warn('Could not store manual lock snapshot:', lockErr);
                                }

                                router.push(`/portal/campaign/${targetCampaign}/${targetCustId}?isManual=true`);
                              } else {
                                router.push(`/portal/customer`);
                              }
                            }}
                            className={`p-2.5 transition-all flex items-center justify-between gap-2.5 group rounded-md border ${
                              isDenied
                                ? 'border-red-500 bg-red-50/80 shadow-sm animate-shake-row'
                                : isAssignedToOther
                                ? 'border-transparent hover:bg-slate-50/80 cursor-not-allowed opacity-90'
                                : 'border-transparent hover:bg-indigo-50/40 cursor-pointer'
                            }`}
                            title={isAssignedToOther ? `Assigned to ${cust.assignedName || 'another agent'} (Cannot open)` : undefined}
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs shrink-0 ${
                                isDenied 
                                  ? 'bg-red-100 text-red-600 font-bold' 
                                  : isAssignedToOther 
                                  ? 'bg-slate-100 text-slate-500 font-semibold' 
                                  : 'bg-indigo-100 text-[#4b33e8] font-bold'
                              }`}>
                                {initial}
                              </div>
                              <div className="min-w-0">
                                <div className="flex items-center gap-1.5">
                                  <p className={`text-xs font-semibold truncate ${
                                    isDenied ? 'text-red-700' : 'text-slate-800 group-hover:text-[#4b33e8]'
                                  } transition-colors`}>
                                    {cust.customer_name || "Unnamed Customer"}
                                  </p>
                                  {isAssignedToOther && (
                                    <i className="fi flex fi-rr-lock text-[10px] text-amber-600 shrink-0" title="Locked: Assigned to another agent" />
                                  )}
                                </div>
                                <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                                  <span className="text-[11px] text-slate-500 font-mono font-medium">
                                    {maskedPhone}
                                  </span>

                                  {/* Lead Status Tag */}
                                  {cust.displayStatus && (
                                    <span className={`px-1.5 py-0.2 text-[9px] rounded uppercase font-semibold ${
                                      cust.sourceType === 'rejected'
                                        ? 'bg-rose-50 text-rose-600 border border-rose-200'
                                        : cust.sourceType === 'closed'
                                        ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                                        : 'bg-slate-100 text-slate-600 border border-slate-200/70'
                                    }`}>
                                      {cust.displayStatus}
                                    </span>
                                  )}

                                  {/* Assigned Agent / Assigned to You / Unassigned Badge */}
                                  {cust.isAssignedToMe ? (
                                    <span 
                                      className="inline-flex items-center gap-1 px-1.5 py-0.2 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded text-[9px] font-bold"
                                      title="This lead is assigned to you"
                                    >
                                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                      <span>Assigned to You</span>
                                    </span>
                                  ) : (cust.assignedName || cust.assignedEmpId || cust.agentId) ? (
                                    <span 
                                      className="inline-flex items-center gap-1 px-1.5 py-0.2 bg-indigo-50 text-[#4b33e8] border border-indigo-200/70 rounded text-[9px] font-semibold truncate max-w-[140px]"
                                      title={`Assigned to: ${cust.assignedName || cust.assignedEmpId || 'Another Agent'} ${cust.assignedEmpId && cust.assignedName ? `(${cust.assignedEmpId})` : ''}`}
                                    >
                                      <i className="fi flex fi-rr-user text-[8px]" />
                                      <span className="truncate">{cust.assignedName || cust.assignedEmpId || 'Assigned'}</span>
                                    </span>
                                  ) : (
                                    <span 
                                      className="inline-flex items-center gap-1 px-1.5 py-0.2 bg-amber-50 text-amber-700 border border-amber-200 rounded text-[9px] font-semibold"
                                      title="Lead is not assigned to any agent"
                                    >
                                      <i className="fi flex fi-rr-cross-circle text-[8px]" />
                                      <span>Unassigned</span>
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                            {isAssignedToOther ? (
                              <i className="fi flex fi-rr-ban text-xs text-rose-400 group-hover:text-rose-600 transition-colors shrink-0" title="Cannot open"></i>
                            ) : (
                              <i className="fi flex fi-rr-arrow-right text-xs text-slate-300 group-hover:text-[#4b33e8] transition-colors shrink-0"></i>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="py-7 px-4 text-center">
                      <div className="w-9 h-9 mx-auto mb-2 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                        <i className="fi flex fi-rr-search text-sm"></i>
                      </div>
                      <p className="text-xs font-semibold text-slate-700">No customers found</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        No matches for "{headerSearchQuery}".
                      </p>
                    </div>
                  )}
                </div>

                {/* Dropdown Footer */}
                <div className="px-4 py-2.5 bg-purple-50/40 border-t border-[#4b33e8]/20 flex items-center justify-between text-[11px]">
                  <span className="text-slate-500 font-medium flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 bg-white border border-purple-200 rounded text-[10px] text-purple-700">ESC</kbd> to close
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setSearchDropdownOpen(false);
                      router.push('/portal/customer');
                    }}
                    className="text-[#4b33e8] hover:text-[#3824c9] font-semibold hover:underline flex items-center gap-1 transition-colors"
                  >
                    <span>View all in Table</span>
                    <i className="fi flex fi-rr-angle-small-right text-xs"></i>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right: Device Status & Actions */}
          <div className="flex items-center gap-2 shrink-0 ml-auto">
            {/* Real-time Device Status */}
            {deviceStatus && (
              <div 
                className="device-chip-wrapper flex items-center gap-2 px-2.5 py-1 bg-gray-50/50 rounded-lg border border-gray-200/50 hover:bg-gray-100/90 cursor-default"
                title={`${deviceStatus.device_model} • ${
                  deviceOnlineStatus === 'online' 
                    ? (deviceStatus.on_call ? 'In Call' : 'Online') 
                    : 'Offline'
                }`}
              >
                <div className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 ${
                  deviceOnlineStatus === 'offline' 
                    ? 'bg-gray-100 text-gray-400' 
                    : (deviceStatus.on_call ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600')
                }`}>
                  <i className={`fi flex ${
                    deviceOnlineStatus === 'online' && deviceStatus.on_call 
                      ? 'fi-rr-phone-call animate-pulse' 
                      : 'fi-rr-smartphone'
                  } text-xs`} />
                </div>
                
                {/* Expandable text container on hover */}
                <div className="device-name-container overflow-hidden whitespace-nowrap">
                  <span className="text-[11px] font-bold text-gray-700 leading-none">
                    {deviceStatus.device_model || 'Device'}
                  </span>
                </div>
              </div>
            )}

            {/* Notification Bell (Desktop) */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="w-8.5 h-8.5 p-2 rounded-lg bg-gray-50/50 border border-gray-200/50 hover:bg-gray-100 transition-all active:scale-95 text-gray-600 group relative flex items-center justify-center"
              >
                {unreadCount > 0 ? (
                  <>
                    <BellRing className="w-4 h-4 text-indigo-600 animate-[bell_2s_infinite]" />
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center border border-white shadow-sm">
                      {unreadCount > 20 ? '20+' : unreadCount}
                    </span>
                  </>
                ) : (
                  <Bell className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                )}
              </button>
            </div>

            {/* Settings Button (Desktop) */}
            <button
              onClick={() => router.push('/settings')}
              className="w-8.5 h-8.5 rounded-lg bg-gray-50/50 border border-gray-200/50 hover:bg-gray-100 hover:text-[#4b33e8] hover:border-indigo-200 transition-all active:scale-95 text-gray-600 flex items-center justify-center group"
              title="Settings"
              aria-label="Settings"
            >
              <i className="fi flex fi-rr-settings text-sm leading-none group-hover:rotate-45 transition-transform duration-300"></i>
            </button>

            {/* Logout Button (Desktop) */}
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="w-8.5 h-8.5 rounded-lg bg-red-50/50 border border-red-200/50 hover:bg-red-100 hover:border-red-300 transition-all active:scale-95 text-[#EF4444] disabled:opacity-50 flex items-center justify-center"
              title="Sign Out"
              aria-label="Sign Out"
            >
              {isLoggingOut ? (
                <div className="w-4 h-4 border-2 border-t-transparent border-current rounded-full animate-spin"></div>
              ) : (
                <i className="fi flex fi-rr-exit text-sm leading-none"></i>
              )}
            </button>
          </div>
        </div>
      </header>
      <style jsx global>{`
        @keyframes bell {
          0%, 100% { transform: rotate(0); }
          10%, 30%, 50%, 70%, 90% { transform: rotate(-10deg); }
          20%, 40%, 60%, 80% { transform: rotate(10deg); }
        }
        @keyframes shakeRow {
          0%, 100% { transform: translateX(0); }
          15% { transform: translateX(-8px); }
          30% { transform: translateX(8px); }
          45% { transform: translateX(-6px); }
          60% { transform: translateX(6px); }
          75% { transform: translateX(-3px); }
          90% { transform: translateX(3px); }
        }
        .animate-shake-row {
          animation: shakeRow 0.6s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
          border-color: #ef4444 !important;
          background-color: #fef2f2 !important;
          box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.25) !important;
        }
        .device-name-container {
          max-width: 52px;
          text-overflow: ellipsis;
          transition: max-width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .device-chip-wrapper:hover .device-name-container {
          max-width: 140px;
          transition: max-width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
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
                        {notif.metadata?.employee_id && (
                          <div className="mt-2 inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-gray-100 text-gray-600 border border-gray-200">
                             ID: {notif.metadata.employee_id}
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                        {!notif.is_seen && (
                          <button 
                            onClick={(e) => {
                                e.stopPropagation();
                                markAsSeen(notif.id);
                            }}
                            className="p-1.5 bg-white shadow-sm border border-gray-100 rounded-lg text-indigo-600 hover:bg-slate-50"
                          >
                            <Check className="w-3 h-3" />
                          </button>
                        )}
                        <button 
                          onClick={(e) => {
                              e.stopPropagation();
                              deleteNotification(notif.id);
                          }}
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
