/**
 * Utility functions for managing user data in localStorage
 */

export interface StoredUserData {
  user_id: string;
  email: string;
  user_name: string;
  employee_id: string;
  role: string;
  super_admin?: boolean;
  profile_pic_url: string | null;
  displayName?: string;
  session_token?: string; // Store session token for quick login
  refresh_token?: string; // Store refresh token
  token_id?: string;      // Store the TFC Token ID

  approval_status?: string | null;
  status?: string | null;
  updated_at?: string | null;
  status_reason?: string | null;
  hold_start_date?: string | null;
  hold_end_date?: string | null;
  all_time_active?: boolean;
  is_caller?: boolean;
  is_client?: boolean;
  designation?: string | null;
}

const STORAGE_KEY = 'tfc_user_data';
const STORAGE_KEY_ARRAY = 'tfc_user_data_array'; // For multiple users

/**
 * Store user data in localStorage (single user - for backward compatibility)
 * Ensures session tokens are always stored with card details
 */
export function storeUserData(userData: StoredUserData): void {
  if (typeof window === 'undefined') return;
  
  try {
    // Ensure session tokens are included
    const dataToStore: StoredUserData = {
      ...userData,
      // Explicitly ensure session tokens are present (even if undefined, they'll be stored)
      session_token: userData.session_token || undefined,
      refresh_token: userData.refresh_token || undefined,
      all_time_active: userData.all_time_active ?? true,
    };
    
    console.log('storeUserData called with:', {
      hasSessionToken: !!dataToStore.session_token,
      hasRefreshToken: !!dataToStore.refresh_token,
      userId: dataToStore.user_id,
      email: dataToStore.email
    });
    
    const dataString = JSON.stringify(dataToStore);
    localStorage.setItem(STORAGE_KEY, dataString);
    console.log('User data stored successfully with session tokens');
    
    // Also store in array format for multiple users support
    const allUsers = getAllStoredUsers();
    const existingIndex = allUsers.findIndex(
      (u) => u.user_id === dataToStore.user_id
    );

    // Safety check: If we didn't find by user_id, but we would have found by employee_id, log a warning
    if (existingIndex === -1 && dataToStore.employee_id) {
       const collisionIndex = allUsers.findIndex(u => u.employee_id === dataToStore.employee_id);
       if (collisionIndex >= 0) {
         console.warn('Potential user data collision detected: employee_id matches but user_id differs. Preventing overwrite.', {
           existing: allUsers[collisionIndex],
           new: dataToStore
         });
         // Do NOT overwrite. Potentially we should append? 
         // For now, we will treat it as a new user to avoid corrupting the existing one.
       }
    }
    
    if (existingIndex >= 0) {
      // Update existing user with new session tokens
      allUsers[existingIndex] = {
        ...allUsers[existingIndex],
        ...dataToStore,
        // Preserve session tokens if they exist
        session_token: dataToStore.session_token || allUsers[existingIndex].session_token,
        refresh_token: dataToStore.refresh_token || allUsers[existingIndex].refresh_token,
      };
      console.log('Updated existing user in array with session tokens');
    } else {
      // Add new user with session tokens
      allUsers.push(dataToStore);
      console.log('Added new user to array with session tokens');
    }
    
    localStorage.setItem(STORAGE_KEY_ARRAY, JSON.stringify(allUsers));

    // --- CRITICAL SYNC: Update 'sessionManager' accounts too ---
    // This ensures that token_id is consistent across both storage locations
    if (typeof window !== 'undefined') {
        import("./sessionManager").then(({ getStoredAccounts, saveAccount }) => {
            const accounts = getStoredAccounts();
            const matchingAccount = accounts.find(a => a.user_id === dataToStore.user_id);
            if (matchingAccount) {
                saveAccount({
                    ...matchingAccount,
                    access_token: dataToStore.session_token || matchingAccount.access_token || "",
                    refresh_token: dataToStore.refresh_token || matchingAccount.refresh_token || "",
                    token_id: dataToStore.token_id || matchingAccount.token_id,
                    user_name: dataToStore.user_name || matchingAccount.user_name,
                    profile_pic_url: dataToStore.profile_pic_url || matchingAccount.profile_pic_url,
                    role: dataToStore.role || matchingAccount.role
                });

                console.log("🔄 [LocalStorage] Synced login data to sessionManager");
            }
        });
    }

    // Verify it was stored correctly
    const stored = localStorage.getItem(STORAGE_KEY);

    if (stored) {
      const parsed = JSON.parse(stored) as StoredUserData;
      console.log('Verified stored data:', {
        hasSessionToken: !!parsed.session_token,
        hasRefreshToken: !!parsed.refresh_token,
        sessionTokenLength: parsed.session_token?.length || 0,
        refreshTokenLength: parsed.refresh_token?.length || 0
      });
    }
  } catch (error) {
    console.error('Error storing user data:', error);
  }
}

/**
 * Get stored user data from localStorage (single user - for backward compatibility)
 */
export function getStoredUserData(): StoredUserData | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      return JSON.parse(data) as StoredUserData;
    }
  } catch (error) {
    console.error('Error reading user data:', error);
  }
  
  return null;
}

/**
 * Get all stored users from localStorage (array format)
 */
export function getAllStoredUsers(): StoredUserData[] {
  if (typeof window === 'undefined') return [];
  
  try {
    // First try to get from array storage
    const arrayData = localStorage.getItem(STORAGE_KEY_ARRAY);
    if (arrayData) {
      const parsed = JSON.parse(arrayData) as StoredUserData[];
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
    
    // Fallback to single user storage (for backward compatibility)
    const singleUser = getStoredUserData();
    if (singleUser) {
      return [singleUser];
    }
  } catch (error) {
    console.error('Error reading users array:', error);
  }
  
  return [];
}

/**
 * Remove a specific user from stored users
 */
export function removeStoredUser(userId: string): void {
  if (typeof window === 'undefined') return;
  
  try {
    const allUsers = getAllStoredUsers();
    const filtered = allUsers.filter((u) => u.user_id !== userId);
    
    if (filtered.length === 0) {
      // If no users left, clear everything
      clearStoredUserData();
    } else {
      // Update array storage
      localStorage.setItem(STORAGE_KEY_ARRAY, JSON.stringify(filtered));
      
      // Update single user storage to first remaining user (for backward compatibility)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered[0]));
    }
  } catch (error) {
    console.error('Error removing user:', error);
  }
}

/**
 * Clear stored user data from localStorage
 */
export function clearStoredUserData(): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(STORAGE_KEY_ARRAY);
  } catch (error) {
    console.error('Error clearing user data:', error);
  }
}

