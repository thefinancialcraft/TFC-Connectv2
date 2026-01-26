/**
 * Utility to communicate with Flutter InAppWebView bridge
 */
import { supabase } from "./supabase";
import { globalBridgeLogger } from "./bridgeLogger";

// Global receiver for Flutter messages to ensure they are logged and dispatched via events
if (typeof window !== 'undefined') {
  const win = window as any;
  if (!win.__bridge_initialized) {
    win.fromFlutter = (data: any) => {
      // 1. Log the incoming message
      const type = data?.type || 'unknown';
      const value = data?.value;
      globalBridgeLogger.addLog('in', type, value);

      // 2. Dispatch as a CustomEvent so multiple components can listen without overwriting
      window.dispatchEvent(new CustomEvent('tfc-bridge-message', { detail: data }));
      
      console.log("🔔 [Bridge] Received & Dispatched:", data);
    };
    win.__bridge_initialized = true;
  }
}

export const notifyFlutter = (type: string, value: any) => {
  if (typeof window !== 'undefined') {
    const win = window as any;
    
    // Keyed Deduplication: Store last message per type to prevent overwriting during rapid syncs
    if (!win.__bridge_history) win.__bridge_history = {};
    win.__bridge_history[type] = { value, time: Date.now() };

    // Log the outgoing message
    globalBridgeLogger.addLog('out', type, value);

    if (win.flutter_inappwebview?.callHandler) {
      console.log(`🚀 [Bridge] Sending ${type}:`, value);
      win.flutter_inappwebview.callHandler('fromWebApp', { type, value });
      return true;
    }
  }
  return false;
};

export const notifyLoginToFlutter = () => {
  console.log("🚀 [Bridge] Triggering Login Event");
  return notifyFlutter('login', true);
};

export const notifyLogoutToFlutter = () => {
  console.log("🚀 [Bridge] Triggering Logout Event");
  return notifyFlutter('logout', true);
};

export const syncUserInfoToFlutter = (user: any) => {
  if (!user) return false;
  
  // Only proceed if bridge is actually active in the window
  const isBridgeActive = typeof window !== 'undefined' && !!(window as any).flutter_inappwebview?.callHandler;
  if (!isBridgeActive) return false;

  // Normalize user data for bridge
  const userInfoPayload = {
    user_name: user.displayName || user.user_name || null,
    employee_id: user.employeeId || user.employee_id || null,
    email: user.email,
    role: user.role,
    designation: user.designation || user.role,
    department: user.department || null,
    createdAt: user.createdAt || user.created_at,
    lastSignInAt: user.lastSignInAt || user.last_sign_in_at,
    profilePicUrl: user.profilePicUrl || user.profile_pic_url
  };
  
  console.log("🚀 [Bridge] Syncing User Profile");
  return notifyFlutter('sync_user_info', userInfoPayload);
};


export const requestDeviceInfoFromFlutter = () => {
  console.log("🚀 [Bridge] Requesting Device Info");
  return notifyFlutter('request', 'device_info');
};

/**
 * Update the call status in sync_meta for the primary connected device
 */
export const updateSyncMetaCallStatus = async (employeeId: string, type: string, value: string) => {
  if (!employeeId) return;

  // 0. Master Move: If we are on mobile (bridge active), DO NOT update type/value columns.
  // These columns are reserved for remote commands from Desktop to Mobile.
  // Mobile device should only be updated from here via calling_status or native sync.
  if (typeof window !== 'undefined' && (window as any).flutter_inappwebview) {
    console.log("📱 [Bridge] Mobile context. Skipping command sync (type/value) to DB.");
    return;
  }
  
  try {
    // 1. Fetch current device status to check if it's online
    const { data: device, error: fetchError } = await supabase
      .from('sync_meta')
      .select('last_seen, status')
      .eq('employee_id', employeeId)
      .eq('is_primary', true)
      .maybeSingle();

    if (fetchError || !device) {
      console.warn("⚠️ [Bridge] Cannot sync status: Primary device not found");
      return;
    }

    // 2. Check if device is actually online (15 second timeout like Header)
    if (device.last_seen) {
      const lastSeen = new Date(device.last_seen).getTime();
      const diffSeconds = (Date.now() - lastSeen) / 1000;
      
      if (diffSeconds >= 15) {
        console.warn(`⚠️ [Bridge] Device is OFFLINE (${Math.round(diffSeconds)}s ago). Skipping ${type} update.`);
        return;
      }
    } else {
      console.warn("⚠️ [Bridge] Device has never sent a heartbeat. Skipping update.");
      return;
    }

    console.log(`📡 [Bridge] Device is online. Syncing ${type} to DB...`);
    
    // 3. Perform the update
    const { error } = await supabase
      .from('sync_meta')
      .update({ 
        type: type,
        value: value,
        updated_at: new Date().toISOString()
      })
      .eq('employee_id', employeeId)
      .eq('is_primary', true)
      .eq('status', 'connected');

    if (error) {
      console.error("❌ [Bridge] SyncMeta update error:", error);
    }
  } catch (err) {
    console.error("❌ [Bridge] SyncMeta connection error:", err);
  }
};

/**
 * Update specifically the calling_status column in sync_meta
 */
export const updateSyncMetaCallingStatus = async (employeeId: string, callingStatus: string | null) => {
  if (!employeeId) return;
  
  try {
    console.log(`📡 [Bridge] Syncing calling_status: ${callingStatus} to DB...`);
    const { error } = await supabase
      .from('sync_meta')
      .update({ 
        calling_status: callingStatus,
        updated_at: new Date().toISOString()
      })
      .eq('employee_id', employeeId)
      .eq('is_primary', true);

    if (error) {
      console.error("❌ [Bridge] SyncMeta calling_status update error:", error);
    }
  } catch (err) {
    console.error("❌ [Bridge] SyncMeta calling_status connection error:", err);
  }
};

/**
 * Send a heartbeat update to the sync_meta table
 */
export const sendHeartbeat = async (employeeId: string) => {
  if (!employeeId) return;

  // Retrieve android_id from localStorage (set by Header.tsx)
  const androidId = typeof localStorage !== 'undefined' ? localStorage.getItem('android_id') : null;

  if (!androidId) {
      console.log("⚠️ [Heartbeat] No android_id found, skipping precise heartbeat.");
      return;
  }

  const entryId = `${employeeId}_${androidId}`;
  
  try {
    const { error } = await supabase
      .from('sync_meta')
      .update({ 
        last_seen: new Date().toISOString()
      })
      .eq('entry_id', entryId)
      .eq('is_primary', true)
      .eq('status', 'connected');

    if (error) console.error("❌ [Heartbeat] Update failed:", error);
  } catch (err) {
    console.error("❌ [Heartbeat] Error:", err);
  }
};


