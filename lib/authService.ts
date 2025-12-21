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
  profilePicUrl?: string | null;
}

export interface AuthResult {
  user: UserProfile | null;
  error: string | null;
  shouldRedirect: boolean;
}

/**
 * Check authentication and fetch user profile
 * This function handles session validation and profile fetching
 */
export async function checkAuthAndFetchProfile(): Promise<AuthResult> {
  try {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError || !session) {
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

    if (cachedUser) {
      // Set minimal user data immediately to avoid spinner
      userData = {
        uid: cachedUser.id,
        displayName: null,
        email: cachedUser.email || '',
        phone: null,
        providers: [],
        providerType: null,
        createdAt: cachedUser.created_at,
        lastSignInAt: cachedUser.last_sign_in_at || null,
        employeeId: null,
        role: null,
        approvalStatus: null,
        accountStatus: null,
        updatedAt: null,
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
        userData = data.user;
        
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
          };
          addUserToStore(profileData);
        }
      } else if (authUser) {
        // If no user data but no error, create minimal user object
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
        };
      }
    } catch (fetchError: any) {
      console.error("Profile fetch error:", fetchError);
      // Return cached user data if available, otherwise return error
      if (userData) {
        return {
          user: userData,
          error: null,
          shouldRedirect: false,
        };
      }
      throw fetchError;
    }

    return {
      user: userData,
      error: null,
      shouldRedirect: false,
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
  created_at?: string;
  updated_at?: string;
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

    // Store user data in array
    if (data) {
      addUserToStore(data as UserProfileData);
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
 * Handle logout
 */
export async function handleLogout(router: NextRouter): Promise<void> {
  // Clear user data from localStorage (but keep it for logged out user card)
  // We don't clear it here so user card can be shown after logout
  try {
    // Get current session before signing out
    const { data: { session } } = await supabase.auth.getSession();
    
    // Update session in database to set is_active = false
    if (session?.access_token) {
      try {
        // Call API to deactivate session
        await fetch("/api/auth/deactivate-session", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
        });
      } catch (sessionUpdateError) {
        console.error("Error deactivating session:", sessionUpdateError);
        // Continue with logout even if session update fails
      }
    }

    // For "quick login" feature (Facebook-style), we use soft logout:
    // - Mark session as inactive in database (for tracking)
    // - Clear client-side session
    // - But DON'T invalidate tokens server-side (keep them valid for quick re-login)
    // This allows stored tokens to be used to restore session later
    
    // Note: We intentionally DON'T call supabase.auth.signOut() here
    // because it would invalidate the refresh token server-side, preventing quick login
    // Instead, we just clear the local session and mark it inactive in our tracking table
    
    // Clear Supabase client's local session storage manually
    try {
      if (typeof window !== 'undefined') {
        // Supabase stores session in localStorage with keys like:
        // `sb-${projectRef}-auth-token` where projectRef is part of the URL
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
        const urlMatch = supabaseUrl.match(/https:\/\/([^.]+)\.supabase\.co/);
        if (urlMatch) {
          const projectRef = urlMatch[1];
          const sessionKey = `sb-${projectRef}-auth-token`;
          localStorage.removeItem(sessionKey);
        }
        // Also try to remove any supabase auth-related keys
        const keys = Object.keys(localStorage);
        keys.forEach(key => {
          if (key.includes('supabase') && (key.includes('auth') || key.includes('token'))) {
            localStorage.removeItem(key);
          }
        });
      }
    } catch (clearError) {
      console.error("Error clearing local session:", clearError);
      // Continue with logout even if clearing fails
    }
    
    // Clear any other cached data
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("userEmail");
      localStorage.removeItem("rememberMe");
      localStorage.removeItem("rememberedEmail");
      localStorage.removeItem("rememberedPassword");
      
      // Clear users store
      clearUsersStore();
    
    // Note: We keep user data (including tokens) in localStorage for logged out user card
    // This allows quick re-login using stored tokens
    // It will be cleared only when user clicks "Remove account" or logs in with different account
      
      router.push("/login");
  } catch (err) {
    console.error("Logout error:", err);
    router.push("/login");
  }
}

