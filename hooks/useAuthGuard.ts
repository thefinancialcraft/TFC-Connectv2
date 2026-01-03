import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  checkAuthAndFetchProfile,
  UserProfile,
} from "../lib/authService";
import { supabase } from "../lib/supabase";
import { getStoredUserData, storeUserData } from "../lib/localStorageUtils";

export interface UseAuthGuardReturn {
  user: UserProfile | null;
  loading: boolean;
  error: string;
  mounted: boolean;
  refetchUser: () => Promise<void>;
}

/**
 * Central authentication guard hook
 * Handles all auth logic, redirects, and profile management
 * 
 * Usage:
 * const { user, loading, error, mounted } = useAuthGuard();
 */
export function useAuthGuard(): UseAuthGuardReturn {
  const router = useRouter();
  
  // Initialize with cached data for ghost loading (prevents flicker)
  const [user, setUser] = useState<UserProfile | null>(() => {
    const cachedData = getStoredUserData();
    if (cachedData) {
      return {
        uid: cachedData.user_id || "",
        displayName: cachedData.user_name || cachedData.displayName || null,
        email: cachedData.email || "",
        phone: null,
        providers: [],
        providerType: null,
        createdAt: "",
        lastSignInAt: null,
        employeeId: cachedData.employee_id || null,
        role: cachedData.role || null,
        approvalStatus: cachedData.approval_status || null,
        accountStatus: cachedData.status || null,
        updatedAt: cachedData.updated_at || null,
        profilePicUrl: cachedData.profile_pic_url || null,
        statusReason: cachedData.status_reason || null,
        holdStartDate: cachedData.hold_start_date || null,
        holdEndDate: cachedData.hold_end_date || null,
      };
    }
    return null;
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);

  const fetchAuth = async () => {
    const result = await checkAuthAndFetchProfile();

    // Handle redirect scenarios
    if (result.shouldRedirect) {
      router.push("/login");
      return;
    }

    if (result.error) {
      setError(result.error);
      setTimeout(() => {
        router.push("/login");
      }, 2000);
      return;
    }

    if (result.user) {
      // Fetch latest profile data from API
      const {
        data: { session },
      } = await supabase.auth.getSession();
      let latestUserData = result.user;

      if (session) {
        try {
          const profileResponse = await fetch("/api/auth/user-profile", {
            headers: {
              Authorization: `Bearer ${session.access_token}`,
            },
          });
          const profileData = await profileResponse.json();

          if (profileData.success && profileData.user) {
            latestUserData = {
              ...profileData.user,
              profilePicUrl: profileData.user.profile_pic_url || null,
            };

            // Check profile completion
            if (profileData.user.profile_complete === false) {
              router.push("/profile-completion");
              return;
            }
          }
        } catch (err) {
          console.error("Error fetching latest profile:", err);
        }
      }

      // Smart state update - only update if data changed
      setUser((prevUser) => {
        if (!prevUser) {
          updateLocalStorage(latestUserData);
          return latestUserData;
        }

        const hasChanged =
          prevUser.displayName !== latestUserData.displayName ||
          prevUser.employeeId !== latestUserData.employeeId ||
          prevUser.email !== latestUserData.email ||
          prevUser.approvalStatus !== latestUserData.approvalStatus ||
          prevUser.accountStatus !== latestUserData.accountStatus ||
          prevUser.role !== latestUserData.role ||
          prevUser.phone !== latestUserData.phone ||
          prevUser.profilePicUrl !== latestUserData.profilePicUrl ||
          prevUser.statusReason !== latestUserData.statusReason ||
          prevUser.holdStartDate !== latestUserData.holdStartDate ||
          prevUser.holdEndDate !== latestUserData.holdEndDate;

        if (hasChanged) {
          updateLocalStorage(latestUserData);
          return latestUserData;
        }

        return prevUser;
      });

      // Handle approval status redirects
      // Priority: rejected → pending → suspend → hold → approved
      if (latestUserData.approvalStatus === "rejected") {
        router.push("/rejected");
        return;
      } else if (latestUserData.approvalStatus === "pending") {
        router.push("/pending");
        return;
      } else if (
        latestUserData.approvalStatus === "suspend" ||
        latestUserData.accountStatus === "suspend"
      ) {
        router.push("/suspended");
        return;
      } else if (
        latestUserData.approvalStatus === "hold" ||
        latestUserData.accountStatus === "hold"
      ) {
        router.push("/hold");
        return;
      }
    }
  };

  const updateLocalStorage = (userData: UserProfile) => {
    if (userData.uid) {
      const cachedData = getStoredUserData();
      const userDataToStore = {
        user_id: userData.uid,
        email: userData.email || "",
        user_name: userData.displayName || cachedData?.user_name || "",
        employee_id: userData.employeeId || cachedData?.employee_id || "",
        role: userData.role || cachedData?.role || "user",
        profile_pic_url: userData.profilePicUrl || null,
        displayName: userData.displayName || undefined,
        session_token: cachedData?.session_token,
        refresh_token: cachedData?.refresh_token,
        status_reason: userData.statusReason || null,
        hold_start_date: userData.holdStartDate || null,
        hold_end_date: userData.holdEndDate || null,
        approval_status: userData.approvalStatus || null,
        status: userData.accountStatus || null,
        updated_at: userData.updatedAt || null,
      };
      storeUserData(userDataToStore);
    }
  };

  useEffect(() => {
    setMounted(true);
    fetchAuth();

    // Refresh user data when page comes into focus
    const handleFocus = () => {
      fetchAuth();
    };

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [router]);

  return {
    user,
    loading,
    error,
    mounted,
    refetchUser: fetchAuth,
  };
}
