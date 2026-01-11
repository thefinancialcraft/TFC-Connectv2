/**
 * Utility to communicate with Flutter InAppWebView bridge
 */
import { supabase } from "./supabase";

export const notifyFlutter = (type: string, value: any) => {
  if (typeof window !== 'undefined') {
    const win = window as any;
    
    // Keyed Deduplication: Store last message per type to prevent overwriting during rapid syncs
    if (!win.__bridge_history) win.__bridge_history = {};
    win.__bridge_history[type] = { value, time: Date.now() };

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
export const updateSyncMetaCallStatus = async (employeeId: string, type: string, value: string, callingStatus?: string) => {
  if (!employeeId) return;
  
  try {
    // 1. Fetch current device status...
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

    // 2. Check if device is actually online...
    if (device.last_seen) {
      const lastSeen = new Date(device.last_seen).getTime();
      const diffSeconds = (Date.now() - lastSeen) / 1000;
      
      if (diffSeconds >= 15) {
        console.warn(`⚠️ [Bridge] Device is OFFLINE (${Math.round(diffSeconds)}s ago). Skipping ${type} update.`);
        return;
      }
    }

    console.log(`📡 [Bridge] Device is online. Syncing ${type} (${callingStatus || 'N/A'}) to DB...`);
    
    // 3. Perform the update
    const updatePayload: any = { 
      type: type,
      value: value,
      updated_at: new Date().toISOString()
    };
    
    if (callingStatus) {
      updatePayload.calling_status = callingStatus;
    }

    const { error } = await supabase
      .from('sync_meta')
      .update(updatePayload)
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
 * Send a heartbeat update to the sync_meta table
 */
export const sendHeartbeat = async (employeeId: string) => {
  if (!employeeId) return;
  
  try {
    const { error } = await supabase
      .from('sync_meta')
      .update({ 
        last_seen: new Date().toISOString()
      })
      .eq('employee_id', employeeId)
      .eq('is_primary', true)
      .eq('status', 'connected');

    if (error) console.error("❌ [Heartbeat] Update failed:", error);
  } catch (err) {
    console.error("❌ [Heartbeat] Error:", err);
  }
};
