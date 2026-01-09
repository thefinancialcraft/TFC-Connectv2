/**
 * Utility to communicate with Flutter InAppWebView bridge
 */

export const notifyFlutter = (type: string, value: any) => {
  if (typeof window !== 'undefined') {
    const win = window as any;
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
