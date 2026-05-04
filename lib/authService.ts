import { supabase } from "./supabase";
import { NextRouter } from "next/router";
import { logSystemEvent } from "./monitoring";

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
  status: string | null;
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
    status: "assigned" | "active" | "disposition_pending" | "closed";
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
 * Check authentication and fetch user profile using standard Supabase Auth
 */
export async function checkAuthAndFetchProfile(): Promise<AuthResult> {
  try {
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();
    
    const authUser = session?.user;

    if (sessionError || !authUser) {
      return {
        user: null,
        error: "No session found",
        shouldRedirect: true,
      };
    }

    // Fetch profile from database
    const { data: profileData, error: profileError } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("user_id", authUser.id)
      .maybeSingle();

    if (profileError) {
      console.error("Error fetching user profile:", profileError);
    }

    const userData: UserProfile = {
      uid: authUser.id,
      displayName: profileData?.user_name || null,
      email: authUser.email || "",
      phone: profileData?.contact_no || null,
      providers: [],
      providerType: null,
      createdAt: authUser.created_at,
      lastSignInAt: authUser.last_sign_in_at || null,
      employeeId: profileData?.employee_id || null,
      role: profileData?.role || null,
      approvalStatus: profileData?.approval_status || null,
      accountStatus: profileData?.status || null,
      status: profileData?.status || null,
      updatedAt: profileData?.updated_at || null,
      profilePicUrl:
        profileData?.profile_pic_url || profileData?.profile_image || null,
      googleCalendarConnected: profileData?.google_calendar_connected || false,
      googleCalendarSkipped: profileData?.google_calendar_skipped || false,
      isClient: profileData ? (profileData.is_client ?? false) : undefined,
      isCaller: profileData?.is_caller || false,
      designation: profileData?.designation || null,
      department: profileData?.department || null,
      activeCampaignId: profileData?.active_campaign_id || null,
      activeCustomerId: profileData?.active_customer_id || null,
      profile_complete: profileData?.profile_complete || false,
      statusReason: profileData?.status_reason || null,
      holdStartDate: profileData?.hold_start_date || null,
      holdEndDate: profileData?.hold_end_date || null,
      organization_id: profileData?.organization_id || null,
    };

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
 * Handle complete logout using Supabase sign out
 */
export async function handleLogout(router: NextRouter): Promise<void> {
  try {
    console.log("🚀 [Auth] Starting complete logout...");

    // 1. Notify Flutter bridge of logout if available
    if (typeof window !== "undefined") {
      const win = window as any;
      if (win.flutter_inappwebview?.callHandler) {
        win.flutter_inappwebview.callHandler("fromWebApp", {
          type: "logout",
          payload: true,
        });
      }

      // IMPORTANT: Flag this as an INTENTIONAL logout so the UI doesn't show "Expired"
      localStorage.setItem('manual_logout_intended', 'true');
      
      // Clear specific caches instead of nuking everything immediately
      localStorage.removeItem('cached_user_profile');
      sessionStorage.removeItem('active_user_profile');
    }

    // 2. Clear Supabase session on server and client
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
        logSystemEvent({
            event_type: 'AUTH',
            description: `User Logout: ${user.email}`,
            user_id: user.id,
            metadata: { email: user.email }
        });
    }

    await supabase.auth.signOut();

    console.log("👋 [Auth] Logout complete, redirecting to login...");
    router.replace("/login");
  } catch (err) {
    console.error("❌ [Auth] Logout failure:", err);
    router.replace("/login");
  }
}
