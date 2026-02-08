import { supabase } from "./supabase";
import { NextRouter } from "next/router";
import { clearStoredUserData } from "./localStorageUtils";

// Store for user data
let usersStore: UserProfileData[] = [];

/**
 * Get all stored users
 */
export function getStoredUsers(): UserProfileData[] {
  return usersStore;
}

/**
 * Add user to store
 */
export function addUserToStore(userData: UserProfileData): void {
  // Check if user already exists in store
  const existingIndex = usersStore.findIndex(
    (user) => user.user_id === userData.user_id || user.employee_id === userData.employee_id
  );

  if (existingIndex >= 0) {
    // Update existing user
    usersStore[existingIndex] = { ...usersStore[existingIndex], ...userData };
    console.log('=== User Updated in Store ===');
    console.log('Updated User:', usersStore[existingIndex]);
    console.log('Total Users in Store:', usersStore.length);
    console.log('All Users:', usersStore);
    console.log('================================');
  } else {
    // Add new user
    usersStore.push(userData);
    console.log('=== User Added to Store ===');
    console.log('New User:', userData);
    console.log('Total Users in Store:', usersStore.length);
    console.log('All Users:', usersStore);
    console.log('============================');
  }
}

/**
 * Clear users store
 */
export function clearUsersStore(): void {
  usersStore = [];
  console.log('=== Users Store Cleared ===');
  console.log('Total Users:', usersStore.length);
  console.log('===========================');
}

export interface UserProfile {
  uid: string;
  displayName: string | null;
  email: string;
  phone: string | null;
  providers: string[];
  providerType: string | null;
  createdAt: string;
  lastSignInAt: string | null;
  employeeId: string | null;
  role: string | null;
  approvalStatus: string | null;
  accountStatus: string | null;
  updatedAt: string | null;
  googleCalendarConnected: boolean;
  googleCalendarSkipped: boolean;
  profilePicUrl?: string | null;
  profile_complete?: boolean;
  statusReason?: string | null;
  holdStartDate?: string | null;
  holdEndDate?: string | null;
  activeCampaignId?: string | null;
  activeCustomerId?: string | null;
  activeSessionState?: string | null;
  activeSessionStart?: string | null;
  currentCallSession?: {
    campaign_id: string;
    customer_id: string;
    status: 'assigned' | 'active' | 'disposition_pending' | 'closed';
    call_start_at: string;
  } | null;
  allTimeActive?: boolean;
  isCaller?: boolean;
  isClient?: boolean;
  designation?: string | null;
  department?: string | null;
  organization_id?: string | null;
  user_level?: number | string | null;
}

export interface AuthResult {
  user: UserProfile | null;
  error: string | null;
  shouldRedirect: boolean;
  serverNow?: string;
}

/**
 * Check authentication and fetch user profile
 * This function handles session validation and profile fetching
 */
export async function checkAuthAndFetchProfile(): Promise<AuthResult> {
  try {
    const { data: { session: currentSession }, error: sessionError } = await supabase.auth.getSession();
    let session = currentSession;

    // "All time active" feature: If no active session, try to restore from localStorage tokens
    if (!session || sessionError) {
      console.log("🔍 [Auth] No active session found, checking for stored tokens...");
      const { getStoredUserData, storeUserData } = await import("./localStorageUtils");
      const storedData = getStoredUserData();
      
      if (storedData?.refresh_token) {
        try {
          console.log("🚀 [Auth] Attempting auto-restoration with refresh token...");
          const { data, error: refreshError } = await supabase.auth.refreshSession({
            refresh_token: storedData.refresh_token,
          });
          
          if (data.session && !refreshError) {
            console.log("✅ [Auth] Session restored automatically!");
            session = data.session;
            
            // Update stored data with new tokens using the secure manager
            const { saveAccount, getStoredAccounts } = await import("./sessionManager");
            const accounts = getStoredAccounts();
            const currentAccount = accounts.find(a => a.user_id === storedData.user_id);
            if (currentAccount) {
                saveAccount({
                  ...currentAccount,
                  access_token: session.access_token,
                  refresh_token: session.refresh_token,
                });

                // Also explicitly activate in DB
                await fetch("/api/auth/activate-session", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ token_id: currentAccount.token_id }),
                });
            }
          } else if (refreshError) {

            console.error("❌ [Auth] Auto-restoration failed:", refreshError.message);
            // If it's a 400/401 or specifically "Not Found", it's a dead token.
            const isDeadToken = refreshError.status === 400 || 
                               refreshError.status === 401 || 
                               refreshError.message?.toLowerCase().includes("not found") ||
                               refreshError.message?.toLowerCase().includes("invalid");
            
            if (isDeadToken) {
              console.warn("🗑️ [Auth] Refresh token is invalid/dead, clearing to stop restart loop");
              const { removeAccount, getStoredAccounts } = await import("./sessionManager");
              const accounts = getStoredAccounts();
              const currentAccount = accounts.find(a => a.user_id === storedData.user_id);
              if (currentAccount) {
                  removeAccount(currentAccount.token_id);
              }
            }
          }
        } catch (err) {
          console.error("❌ [Auth] Auto-restoration exception:", err);
        }
      }

    }

    if (!session) {
      return {
        user: null,
        error: "No session found",
        shouldRedirect: true,
      };
    }

    // Check if email is confirmed
    if (!session.user?.email_confirmed_at) {
      return {
        user: null,
        error: "Please verify your email address before accessing the dashboard. Check your inbox for the confirmation email.",
        shouldRedirect: true,
      };
    }

    // Check if user data is already available in session
    const cachedUser = session.user;
    let userData: UserProfile | null = null;
    let serverNow: string | undefined;

    if (cachedUser) {
      // Set minimal user data immediately to avoid spinner
      // Try to enrich with localStorage data to prevent flickering of "Not assigned" fields
      let storedLocal: any = null;
      try {
          const { getStoredUserData } = await import("./localStorageUtils");
          storedLocal = getStoredUserData();
      } catch (e) {
          console.warn("Could not read local storage for enrichment", e);
      }

      const isSameUser = storedLocal && storedLocal.user_id === cachedUser.id;
      const userMetadata = cachedUser.user_metadata || {};
      
      userData = {
        uid: cachedUser.id,
        displayName: (isSameUser && storedLocal.user_name) ? storedLocal.user_name : null,
        email: cachedUser.email || '',
        phone: null,
        providers: [],
        providerType: null,
        createdAt: cachedUser.created_at,
        lastSignInAt: cachedUser.last_sign_in_at || null,
        employeeId: (isSameUser && storedLocal.employee_id) ? storedLocal.employee_id : null,
        role: (isSameUser && storedLocal.role) ? storedLocal.role : null,
        approvalStatus: (isSameUser && storedLocal.approval_status) ? storedLocal.approval_status : null,
        accountStatus: (isSameUser && storedLocal.status) ? storedLocal.status : null,
        updatedAt: null,
        // Profile Pic
        profilePicUrl: (isSameUser && (storedLocal.profile_pic_url || storedLocal.profile_image)) ? (storedLocal.profile_pic_url || storedLocal.profile_image) : null,
        
        activeCampaignId: userMetadata.active_campaign_id || null,
        activeCustomerId: userMetadata.active_customer_id || null,
        activeSessionState: userMetadata.active_session_state || null,
        activeSessionStart: userMetadata.active_session_start || null,
        googleCalendarConnected: (isSameUser && typeof storedLocal.google_calendar_connected !== 'undefined') 
           ? storedLocal.google_calendar_connected 
           : (userMetadata.google_calendar_connected || cachedUser.identities?.some(id => id.provider === 'google') || false),
        googleCalendarSkipped: (isSameUser && typeof storedLocal.google_calendar_skipped !== 'undefined')
           ? storedLocal.google_calendar_skipped
           : (userMetadata.google_calendar_skipped || false),
          
        // Restore client/caller flags if available
        isClient: (isSameUser && typeof storedLocal.is_client !== 'undefined') ? storedLocal.is_client : false,
        isCaller: (isSameUser && typeof storedLocal.is_caller !== 'undefined') ? storedLocal.is_caller : false,
        designation: (isSameUser && storedLocal.designation) ? storedLocal.designation : null,
        department: (isSameUser && storedLocal.department) ? storedLocal.department : null,
      };
    }

    // Fetch profile in background without blocking UI
    try {
      const response = await fetch("/api/auth/user-profile", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${session.access_token}`,
        },
      });

      const data = await response.json();
      const authUser = session.user;
      serverNow = data.server_now;
      
      // Handle 406 error (PGRST116 - no rows found) gracefully
      if (!response.ok) {
        if (response.status === 406 || data.error?.includes('PGRST116')) {
          // Profile not found, but user is authenticated - allow access with minimal data
          if (authUser) {
            userData = {
              uid: authUser.id,
              displayName: null,
              email: authUser.email || '',
              phone: null,
              providers: [],
              providerType: null,
              createdAt: authUser.created_at,
              lastSignInAt: authUser.last_sign_in_at || null,
              employeeId: null,
              role: null,
              approvalStatus: null,
              accountStatus: null,
              updatedAt: null,
              googleCalendarConnected: false,
              googleCalendarSkipped: false,
            };
          }
          return {
            user: userData,
            error: null,
            shouldRedirect: false,
          };
        }
        throw new Error(data.error || "Failed to fetch user profile");
      }

      if (data.success && data.user) {
        userData = {
           ...data.user,
           // IMPORTANT: Persist auth-level timestamps from the active session
           // The database profile might not have these or might be stale
           lastSignInAt: authUser?.last_sign_in_at || data.user.lastSignInAt,
           createdAt: authUser?.created_at || data.user.createdAt,
           profilePicUrl: data.user.profilePicUrl || data.user.profile_pic_url || data.user.profile_image || null // Fix: fallback to profile_pic_url (API returns snake_case)
        };
        
        // Store user data in array (convert to UserProfileData format)
        if (userData) {
          const profileData: UserProfileData = {
            user_id: userData.uid,
            user_name: userData.displayName || undefined,
            email: userData.email,
            contact_no: userData.phone || undefined,
            employee_id: userData.employeeId || undefined,
            role: userData.role || undefined,
            approval_status: userData.approvalStatus || undefined,
            status: userData.accountStatus || undefined,
            updated_at: userData.updatedAt || undefined,
            profile_pic_url: userData.profilePicUrl || undefined,
            all_time_active: userData.allTimeActive,
            is_caller: userData.isCaller,
            designation: userData.designation || undefined,
            department: userData.department || undefined,
            google_calendar_connected: userData.googleCalendarConnected,
            google_calendar_skipped: userData.googleCalendarSkipped,
          };
          addUserToStore(profileData);
        }
      } else if (authUser) {
        // If no user data but no error, create minimal user object
        const userMetadata = authUser.user_metadata || {};
        userData = {
          uid: authUser.id,
          displayName: null,
          email: authUser.email || '',
          phone: null,
          providers: [],
          providerType: null,
          createdAt: authUser.created_at,
          lastSignInAt: authUser.last_sign_in_at || null,
          employeeId: null,
          role: null,
          approvalStatus: null,
          accountStatus: null,
          updatedAt: null,
          activeCampaignId: userMetadata.active_campaign_id || null,
          activeCustomerId: userMetadata.active_customer_id || null,
          activeSessionState: userMetadata.active_session_state || null,
          activeSessionStart: userMetadata.active_session_start || null,
          googleCalendarConnected: userMetadata.google_calendar_connected || authUser.identities?.some(id => id.provider === 'google') || false,
          googleCalendarSkipped: userMetadata.google_calendar_skipped || false,
        };
      }
    } catch (fetchError: any) {
      console.error("Profile fetch error:", fetchError);

      // If the token is invalid/expired (server returned 401), we MUST NOT use cached data.
      // We should return a redirect signal instead of throwing to prevent app crash.
      const isAuthError = fetchError.message && (
        fetchError.message.includes("Invalid or expired token") || 
        fetchError.message.includes("invalid claim") ||
        fetchError.message.includes("JWT")
      );

      if (isAuthError) {
        console.warn("🔐 [Auth] Session expired during offline/reconnect. Redirecting to login.");
        clearStoredUserData();
        return {
          user: null,
          error: "Your session has expired. Please log in again.",
          shouldRedirect: true,
        };
      }

      // Return cached user data if available for non-auth errors (like transient network issues)
      if (userData) {
        return {
          user: userData,
          error: null,
          shouldRedirect: false,
          serverNow: serverNow,
        };
      }
      
      // Fallback for unknown errors
      return {
        user: null,
        error: fetchError.message || "An authentication error occurred",
        shouldRedirect: true,
      };
    }


    return {
      user: userData,
      error: null,
      shouldRedirect: false,
      serverNow: serverNow,
    };
  } catch (error: any) {
    console.error("Auth check error:", error);
    return {
      user: null,
      error: error.message || "An error occurred",
      shouldRedirect: true,
    };
  }
}

/**
 * Fetch user profile data from user_profiles table
 * This function directly queries the user_profiles table
 */
export interface UserProfileData {
  user_id?: string;
  user_name?: string;
  email?: string;
  contact_no?: string;
  employee_id?: string;
  role?: string;
  super_admin?: boolean;
  approval_status?: string;
  status?: string;
  hold_end_time?: string;
  is_client?: boolean;
  joined_at?: string;
  renewal_at?: string;
  expire_at?: string;
  created_at?: string;
  updated_at?: string;
  google_calendar_connected?: boolean;
  google_calendar_skipped?: boolean;
  is_caller?: boolean;
  designation?: string;
  department?: string;
  token_id?: string; // TFC Session Token ID
  [key: string]: any; // Allow additional fields
}

export interface FetchUserProfileResult {
  success: boolean;
  data: UserProfileData | null;
  error: string | null;
}

export async function fetchUserProfileFromTable(userId?: string): Promise<FetchUserProfileResult> {
  try {
    // Get current session if userId is not provided
    let targetUserId = userId;
    
    if (!targetUserId) {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session) {
        return {
          success: false,
          data: null,
          error: "No session found. Please provide userId or ensure user is authenticated.",
        };
      }
      
      targetUserId = session.user.id;
    }

    // Fetch user profile from user_profiles table
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', targetUserId)
      .maybeSingle(); // Use maybeSingle() to handle no rows gracefully

    if (error) {
      // Handle PGRST116 (no rows found) as a valid case
      if (error.code === 'PGRST116') {
        return {
          success: true,
          data: null,
          error: null,
        };
      }
      
      console.error("Error fetching user profile:", error);
      return {
        success: false,
        data: null,
        error: error.message || "Failed to fetch user profile",
      };
    }

    // Store user data in array with token_id from local storage
    if (data) {
      // Retrieve token_id from local storage to include in the store
      const { getStoredUserData } = await import("./localStorageUtils");
      const storedLocal = getStoredUserData();
      
      const dataWithToken: UserProfileData = {
        ...data,
        token_id: storedLocal?.token_id
      };
      
      addUserToStore(dataWithToken);
      
      // Force Activate Session on DB side to ensure is_active=true on every profile fetch (refresh/login)
      if (storedLocal?.token_id) {
         fetch("/api/auth/activate-session", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token_id: storedLocal.token_id }),
            keepalive: true
         }).catch(console.error);
      }
    }

    return {
      success: true,
      data: data as UserProfileData | null,
      error: null,
    };

  } catch (error: any) {
    console.error("Fetch user profile error:", error);
    return {
      success: false,
      data: null,
      error: error.message || "An error occurred while fetching user profile",
    };
  }
}

/**
 * Handle logout (Soft Logout)
 * This marks the session as inactive in DB but preserves tokens in LocalStorage
 * so that "Card Login" works without "Refresh Token Not Found" errors.
 */
export async function handleLogout(router: NextRouter, tokenId?: string): Promise<void> {
  try {
    console.log("🚀 [Auth] Starting soft-logout for token:", tokenId);

    // 1. Notify Flutter bridge of logout
    if (typeof window !== 'undefined') {
      const win = window as any;
      if (win.flutter_inappwebview?.callHandler) {
        win.flutter_inappwebview.callHandler('fromWebApp', { type: 'logout', value: true });
      }
    }

    // 2. Clear server-side session status (Mark is_active = false)
    // 2. Clear server-side session status (Mark is_active = false)
    try {
      const { getStoredUserData } = await import("./localStorageUtils");
      const activeUser = getStoredUserData();
      const { getStoredAccounts } = await import("./sessionManager");
      const accounts = getStoredAccounts();
      
      // PRIORITY 1: Use provided tokenId (if from specific revoke action)
      // PRIORITY 2: Use token_id from currently active UserProfileData in local storage (standard logout)
      let finalTokenId = tokenId || activeUser?.token_id;

      if (finalTokenId) {
         console.log(`🔍 [Auth] Found token_id from ${tokenId ? 'arguments' : 'UserProfileData local storage'}: ${finalTokenId}`);
      }

      if (!finalTokenId) {
        // Fallback: Check if we can find it by current user_id in accounts
        if (activeUser?.user_id) {
            finalTokenId = accounts.find(a => a.user_id === activeUser.user_id)?.token_id;
            if (finalTokenId) console.log(`🔍 [Auth] Found token_id from account list fallback: ${finalTokenId}`);
        }
        
        // Final fallback: Use the first available account if we can't match user
        if (!finalTokenId) {
             finalTokenId = accounts[0]?.token_id;
             if (finalTokenId) console.log(`🔍 [Auth] Found token_id from first available account: ${finalTokenId}`);
        }
      }


      if (finalTokenId) {
        console.log(`📡 [Auth] Requesting deactivation for token: ${finalTokenId}`);
        
        const url = "/api/auth/deactivate-session";
        const body = JSON.stringify({ token_id: finalTokenId });
        let sent = false;

        // METHOD 1: navigator.sendBeacon (Gold standard for unloads/redirects)
        try {
          if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
            // Send as Blob to ensure correct Content-Type for JSON
            const blob = new Blob([body], { type: 'application/json' });
            sent = navigator.sendBeacon(url, blob);
            if (sent) console.log("✅ [Auth] Deactivation signal queued via Beacon.");
          }
        } catch (err) {
           console.warn("⚠️ [Auth] Beacon failed:", err);
        }

        // METHOD 2: Fallback to Fetch with keepalive if Beacon failed or not supported
        if (!sent) {
          console.log("⚠️ [Auth] Beacon skipped/failed. Using Fetch fallback.");
          // We don't await this either to prevent blocking, but keepalive ensures it survives
          fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: body,
            keepalive: true
          }).catch(e => console.error("Fetch keepalive failed:", e));
        }

        // SAFETY: Give the network stack a tiny moment to process the queue before killing the execution context
        await new Promise(resolve => setTimeout(resolve, 200));

      } else {
        console.warn("⚠️ [Auth] Could not identify token_id to deactivate. Skipping DB update.");
      }
    } catch (e) {
      console.error("❌ [Auth] Deactivation API reached timeout or failed:", e);
    }





    /**
     * CRITICAL: We do NOT call supabase.auth.signOut() here.
     * Calling signOut() invalidates the refresh token on Supabase servers.
     * Instead, we manually wipe the client-side session to trigger a "Logged Out" UI state.
     */

    // 3. Manual wipe of Supabase Client side session keys
    if (typeof window !== 'undefined') {
      // CLEAR ACTIVE USER DATA (This stops auto-restoration in checkAuthAndFetchProfile)
      clearStoredUserData();

      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        // Clear Supabase internal session keys
        if (key.includes('auth-token') || (key.includes('supabase') && !key.includes('stored_accounts'))) {
          localStorage.removeItem(key);
        }
      });
      
      // Clear specific auth flags
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("userEmail");
    }

    // 4. Clear internal memory store
    clearUsersStore();
    
    // Dispatch a global event so hooks can reset state immediately
    if (typeof window !== 'undefined') {
       window.dispatchEvent(new CustomEvent('tfc-logout-event'));
    }

    
    // 5. Set a temporary flag in session storage to prevent immediate auto-redirect loop
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('tfc_just_logged_out', 'true');
    }
    
    console.log("👋 [Auth] Soft-logout complete, redirecting to login...");
    router.replace("/login");



  } catch (err) {
    console.error("❌ [Auth] Critical Logout failure:", err);
    router.push("/login");
  }
}




