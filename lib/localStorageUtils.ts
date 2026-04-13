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
  department?: string | null;
  organization_id?: string;
  allowed_tabs?: string[];
  google_calendar_connected?: boolean;
  google_calendar_skipped?: boolean;
}

const STORAGE_KEY = 'tfc_user_data';
const STORAGE_KEY_ARRAY = 'tfc_user_data_array'; // For multiple users

/**
 * Store user data in localStorage (single user)
 */
export function storeUserData(userData: StoredUserData): void {
  if (typeof window === 'undefined') return;
  
  try {
    const dataToStore: StoredUserData = {
      ...userData,
      all_time_active: userData.all_time_active ?? true,
    };
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToStore));
    console.log('User data stored successfully');
    
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

