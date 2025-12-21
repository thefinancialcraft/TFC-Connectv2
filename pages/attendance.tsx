import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { checkAuthAndFetchProfile, handleLogout, UserProfile } from "../lib/authService";
import { getStoredUserData, storeUserData } from "../lib/localStorageUtils";
import { supabase } from "../lib/supabase";

export default function Attendance() {
  const router = useRouter();
  // Initialize with cached data from localStorage to show previous data immediately (ghost update)
  const [user, setUser] = useState<UserProfile | null>(() => {
    const cachedData = getStoredUserData();
    if (cachedData) {
      return {
        uid: cachedData.user_id || '',
        displayName: cachedData.user_name || cachedData.displayName || null,
        email: cachedData.email || '',
        phone: null, // Will be updated from API
        providers: [],
        providerType: null,
        createdAt: '',
        lastSignInAt: null,
        employeeId: cachedData.employee_id || null,
        role: cachedData.role || null,
        approvalStatus: null, // Will be updated from API
        accountStatus: null, // Will be updated from API
        updatedAt: null, // Will be updated from API
        profilePicUrl: cachedData.profile_pic_url || null,
      };
    }
    return null;
  });
  const [loading, setLoading] = useState(false); // Start with false to avoid spinner on page change
  const [error, setError] = useState("");
  const [activeNav, setActiveNav] = useState("attendance");

  const fetchAuth = async () => {
    const result = await checkAuthAndFetchProfile();
    
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
      // Fetch latest profile data from API to ensure we have the most up-to-date information
      const { data: { session } } = await supabase.auth.getSession();
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
            // Use the latest data from API
            latestUserData = {
              ...profileData.user,
              profilePicUrl: profileData.user.profile_pic_url || null,
            };
          }
        } catch (err) {
          console.error('Error fetching latest profile:', err);
          // Continue with result.user if API call fails
        }
      }

      // Ghost update: Compare existing data with fetched data - only update if there's a change
      setUser(prevUser => {
        // If no previous user, set the new user
        if (!prevUser) {
          // Update localStorage with the new user data (including profile_pic_url)
          if (latestUserData.uid) {
            const cachedData = getStoredUserData();
            const userDataToStore = {
              user_id: latestUserData.uid,
              email: latestUserData.email || '',
              user_name: latestUserData.displayName || cachedData?.user_name || '',
              employee_id: latestUserData.employeeId || cachedData?.employee_id || '',
              role: latestUserData.role || cachedData?.role || 'user',
              profile_pic_url: latestUserData.profilePicUrl || null,
              displayName: latestUserData.displayName || undefined,
              session_token: cachedData?.session_token,
              refresh_token: cachedData?.refresh_token,
            };
            storeUserData(userDataToStore);
          }
          return latestUserData;
        }
        
        // Check if user data has actually changed (compare critical fields for UI update)
        const hasChanged = 
          prevUser.displayName !== latestUserData.displayName ||
          prevUser.employeeId !== latestUserData.employeeId ||
          prevUser.email !== latestUserData.email ||
          prevUser.approvalStatus !== latestUserData.approvalStatus ||
          prevUser.accountStatus !== latestUserData.accountStatus ||
          prevUser.role !== latestUserData.role ||
          prevUser.phone !== latestUserData.phone ||
          prevUser.profilePicUrl !== latestUserData.profilePicUrl;
        
        // Only update if data has actually changed (prevents unnecessary re-renders and UI flickering)
        // This ensures smooth ghost update - UI stays stable if data is same, updates only when changed
        if (hasChanged) {
          // Update localStorage with the new user data (including profile_pic_url)
          if (latestUserData.uid) {
            const cachedData = getStoredUserData();
            const userDataToStore = {
              user_id: latestUserData.uid,
              email: latestUserData.email || '',
              user_name: latestUserData.displayName || cachedData?.user_name || '',
              employee_id: latestUserData.employeeId || cachedData?.employee_id || '',
              role: latestUserData.role || cachedData?.role || 'user',
              profile_pic_url: latestUserData.profilePicUrl || null,
              displayName: latestUserData.displayName || undefined,
              session_token: cachedData?.session_token,
              refresh_token: cachedData?.refresh_token,
            };
            storeUserData(userDataToStore);
          }
          return latestUserData;
        }
        
        // Return previous user object to prevent unnecessary re-render and UI update
        // This keeps showing cached/existing data if fetched data is same (ghost update)
        return prevUser;
      });
    }
  };

  useEffect(() => {
    fetchAuth();
    
    // Refresh user data when page comes into focus (in case it was updated)
    const handleFocus = () => {
      fetchAuth();
    };
    
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [router]);

  const handleLogoutClick = async () => {
    await handleLogout(router);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ backgroundColor: "#f6f5f7" }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-transparent mx-auto mb-4" style={{ borderColor: '#4b33e8' }}></div>
          <div className="text-lg" style={{ color: "#4b33e8" }}>Loading...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ backgroundColor: "#f6f5f7" }}>
        <div className="text-center">
          <div className="text-lg mb-4 text-red-500">{error}</div>
          <div className="text-sm" style={{ color: "#4b33e8" }}>Redirecting to login...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full overflow-x-hidden" style={{ backgroundColor: "#f6f5f7", maxWidth: "100vw" }}>
      {/* Left Sidebar */}
      <Sidebar
        user={{
          displayName: user?.displayName || null,
          email: user?.email || "",
          employeeId: user?.employeeId || null,
          lastSignInAt: user?.lastSignInAt || null,
          profilePicUrl: user?.profilePicUrl || null,
        }}
        activeNav={activeNav}
        onNavChange={setActiveNav}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:ml-56 w-full min-w-0 overflow-x-hidden">
        {/* Top Header */}
        <Header
          user={{
            displayName: user?.displayName || null,
            email: user?.email || "",
            employeeId: user?.employeeId || null,
            profilePicUrl: user?.profilePicUrl || null,
          }}
          onLogout={handleLogoutClick}
        />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden min-w-0 max-w-full pt-[60px] lg:pt-[60px]" style={{ backgroundColor: "#f6f5f7" }}>
          <div className="container mx-auto px-3 sm:px-4 md:px-6 py-4 space-y-4 sm:space-y-6 pb-20 sm:pb-24 lg:pb-8 max-w-7xl">
            <div className="space-y-4 sm:space-y-6">
              {/* Page Header */}
              <div className="bg-white rounded-xl p-4 sm:p-5 md:p-6 shadow-sm">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold" style={{ color: "#263238", fontFamily: "'Poppins', sans-serif" }}>
                  Attendance
                </h1>
                <p className="text-xs sm:text-sm mt-2" style={{ color: "#787E9D", fontFamily: "'Roboto', sans-serif" }}>
                  Track and manage employee attendance records
                </p>
              </div>

              {/* Attendance Content */}
              <div className="bg-white rounded-xl p-4 sm:p-5 md:p-6 shadow-sm">
                <p className="text-xs sm:text-sm" style={{ color: "#787E9D", fontFamily: "'Roboto', sans-serif" }}>
                  Attendance tracking content will be displayed here.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

