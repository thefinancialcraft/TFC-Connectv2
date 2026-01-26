import { supabase } from "./supabase";

export interface StoredUser {
  token_id: string;
  user_id: string;
  email: string;
  user_name: string;
  role: string;
  profile_pic_url: string | null;
  employee_id: string;
  access_token: string;
  refresh_token: string;
  expiry_date: string;
  last_login_at: string;
  device_info?: any;
}

const STORAGE_KEY = "tfc_stored_accounts";

/**
 * Generate a unique token ID for the browser/app
 */
export const generateTokenId = (): string => {
  const random = Math.random().toString(36).substring(2, 12);
  return `token_${random}`;
};

/**
 * Get all stored accounts from LocalStorage
 */
export const getStoredAccounts = (): StoredUser[] => {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

/**
 * Save user account to the array in LocalStorage
 */
export const saveAccount = (user: StoredUser) => {
  if (typeof window === "undefined") return;
  const accounts = getStoredAccounts();
  const index = accounts.findIndex((a) => a.token_id === user.token_id);

  if (index >= 0) {
    accounts[index] = user;
  } else {
    accounts.push(user);
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(accounts));
};

/**
 * Remove a specific account from LocalStorage
 */
export const removeAccount = (tokenId: string) => {
  if (typeof window === "undefined") return;
  const accounts = getStoredAccounts().filter((a) => a.token_id !== tokenId);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(accounts));
};

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
 * Force-hydrates the Supabase session from stored accounts if it's missing.
 * This prevents race conditions where Supabase hasn't yet initialized but we have tokens.
 */
export const ensureValidSession = async () => {
  const { data } = await supabase.auth.getSession();
  if (data.session) return data.session;

  // No session in Supabase? Try to restore from our Multi-Account store
  const accounts = getStoredAccounts();
  if (accounts.length > 0) {
    // Take the most recent account or first one
    const account = accounts[0]; 
    const { data: restoreData, error } = await supabase.auth.setSession({
      access_token: account.access_token,
      refresh_token: account.refresh_token,
    });

    if (!error && restoreData.session) {
      console.log("🛠️ [SessionManager] Hydrated Supabase session from LocalStorage backup");
      return restoreData.session;
    }
  }

  return null;
};
