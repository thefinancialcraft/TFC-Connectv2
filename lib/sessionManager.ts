import { supabase } from "./supabase";

/**
 * Detect environment and get device info
 */
export const getEnvDeviceInfo = async (flutterDeviceInfo: any = null) => {
  // If we have flutter info, use it
  if (flutterDeviceInfo) {
    return {
      device_name: `${flutterDeviceInfo.brand} ${flutterDeviceInfo.model}`,
      browser: "Nexus App",
      user_agent: flutterDeviceInfo.androidId || "Nexus-Android",
      device_type: "mobile",
    };
  }

  // Otherwise detect from browser
  const ua = typeof window !== 'undefined' ? navigator.userAgent : '';
  let browser = "Unknown Browser";
  if (ua.includes("Chrome")) browser = "Chrome";
  else if (ua.includes("Firefox")) browser = "Firefox";
  else if (ua.includes("Safari")) browser = "Safari";
  else if (ua.includes("Edge")) browser = "Edge";

  let os = "Unknown OS";
  if (ua.includes("Windows")) os = "Windows";
  else if (ua.includes("Mac")) os = "MacOS";
  else if (ua.includes("Linux")) os = "Linux";
  else if (ua.includes("Android")) os = "Android";
  else if (ua.includes("iPhone")) os = "iOS";

  return {
    device_name: os,
    browser: browser,
    user_agent: ua,
    device_type: ua.includes("Mobi") ? "mobile" : "desktop",
  };
};

/**
 * Get the current session from Supabase
 */
export const ensureValidSession = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    return session;
};

// Obsolete functions kept as empty to prevent bridge breakage if called
export const getStoredAccounts = () => [];
export const saveAccount = (user: any) => {};
export const removeAccount = (tokenId: string) => {};
export const generateTokenId = () => `token_${Math.random().toString(36).substring(2, 12)}`;
