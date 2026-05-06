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
      win.flutter_inappwebview.callHandler('fromWebApp', { type, payload: value });
      return true;
    }
  }
  return false;
};

export const notifyLoginToFlutter = (user?: any) => {
  console.log("🚀 [Bridge] Triggering Login Event with Metadata");
  
  const payload = {
    login: true,
    user_name: user?.displayName || user?.user_name || null,
    employee_id: user?.employeeId || user?.employee_id || null,
    organization_id: user?.organization_id || null,
    email: user?.email || null,
    role: user?.role || null,
    designation: user?.designation || user?.role || null,
    department: user?.department || null,
    createdAt: user?.createdAt || user?.created_at || null,
    lastSignInAt: user?.lastSignInAt || user?.last_sign_in_at || null,
    profilePicUrl: user?.profilePicUrl || user?.profile_pic_url || null,
    is_client: user?.isClient || user?.is_client || false
  };

  return notifyFlutter('login', payload);
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
    organization_id: user.organization_id || null,
    email: user.email,
    role: user.role,
    designation: user.designation || user.role,
    department: user.department || null,
    createdAt: user.createdAt || user.created_at,
    lastSignInAt: user.lastSignInAt || user.last_sign_in_at,
    profilePicUrl: user.profilePicUrl || user.profile_pic_url,
    is_client: user.isClient || user.is_client || false
  };
  
  console.log("🚀 [Bridge] Syncing User Profile");
  return notifyFlutter('sync_user_info', userInfoPayload);
};


export const requestDeviceInfoFromFlutter = () => {
  console.log("🚀 [Bridge] Requesting Device Info");
  return notifyFlutter('request', 'device_info');
};

/**
 * Notify Flutter that CRM is activated
 */
export const notifyActivationToFlutter = () => {
  console.log("🚀 [Bridge] Notifying CRM Activation");
  return notifyFlutter('crm_activation', { status: true, message: "Rynnxly Crm Activated" });
};

/**
 * Update the call status in sync_meta for the primary connected device
 */
console.log("🛠️ [Bridge] Flutter Bridge Library Loaded v2.1 (with enhanced logging)");

export const updateSyncMetaCallStatus = async (employeeId: string, type: string, value: string) => {
  if (!employeeId) {
    console.error("❌ [Bridge] updateSyncMetaCallStatus failed: employeeId is missing");
    return;
  }

  console.log("%c📡 [Bridge] Starting sync update", "color: blue; font-weight: bold", { employeeId, type, value });

  // 0. Master Move: If we are on mobile (bridge active), DO NOT update type/value columns.
  if (typeof window !== 'undefined' && (window as any).flutter_inappwebview) {
    console.log("📱 [Bridge] Mobile context detected. Skipping command sync (type/value) to DB.");
    return;
  }
  
  try {
    // 1. Fetch current device status
    const { data: device, error: fetchError } = await supabase
      .from('sync_meta')
      .select('last_seen, status, entry_id, is_primary')
      .eq('employee_id', employeeId)
      .eq('is_primary', true)
      .maybeSingle();

    if (fetchError) {
      console.error("❌ [Bridge] Database fetch error:", fetchError);
      return;
    }

    if (!device) {
      console.warn(`⚠️ [Bridge] No primary device found for employee ${employeeId}. Check if any device is set as primary.`);
      return;
    }

    console.log(`📋 [Bridge] Device Found: ${device.entry_id} | Status: ${device.status} | Last Seen: ${device.last_seen}`);

    // 2. Check if device is actually online (Relaxed to 45 seconds for better stability)
    if (device.last_seen) {
      const lastSeen = new Date(device.last_seen).getTime();
      const now = Date.now();
      const diffSeconds = (now - lastSeen) / 1000;
      
      console.log(`⏱️ [Bridge] Heartbeat Check: ${Math.round(diffSeconds)}s ago`);

      if (diffSeconds >= 45) { // Relaxed from 15s to 45s
        console.warn(`⚠️ [Bridge] Device is OFFLINE (${Math.round(diffSeconds)}s gap). Skipping ${type} to avoid ghost commands.`);
        return;
      }
    } else {
      console.warn(`⚠️ [Bridge] Device ${device.entry_id} has never sent a heartbeat. Skipping update.`);
      return;
    }

    console.log(`🚀 [Bridge] Device is active. Sending update to DB...`);
    
    // 3. Perform the update
    const { data, error, count } = await supabase
      .from('sync_meta')
      .update({ 
        type: type,
        value: value,
        updated_at: new Date().toISOString()
      }, { count: 'exact' }) 
      .eq('employee_id', employeeId)
      .eq('is_primary', true)
      .select();

    if (error) {
      console.error("❌ [Bridge] SyncMeta update error:", error);
    } else {
      console.log(`✅ [Bridge] SyncMeta update successful! Rows affected: ${count || (data?.length || 0)}`);
    }
  } catch (err) {
    console.error("❌ [Bridge] SyncMeta fatal connection error:", err);
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


