import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../lib/supabase";
import { checkAuthAndFetchProfile, handleLogout } from "../lib/authService";
import AppLogo from "../components/AppLogo";

interface UserProfile {
  id: string;
  user_name: string;
  email: string;
  contact_no?: string;
  role: 'user' | 'admin' | 'super_admin';
  approval_status: 'pending' | 'approved' | 'rejected' | 'hold' | 'suspend';
  status: 'active' | 'hold' | 'suspend';
  employee_id?: string;
  profile_complete?: boolean;
  super_admin?: boolean;
  status_reason?: string;
  hold_duration_days?: number;
  hold_end_time?: string;
  hold_start_date?: string;
  hold_end_date?: string;
  created_at: string;
  updated_at: string;
}

const Hold = () => {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [timeRemaining, setTimeRemaining] = useState<string>("");
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const fetchUserProfile = async () => {
    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();

      if (sessionError || !session) {
        router.push("/login");
        return;
      }

      // Fetch profile from user_profiles table
      const { data, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', session.user.id)
        .single();

      if (profileError) {
        setError("Failed to fetch profile data.");
        setLoading(false);
        return;
      }

      if (data) {
        const userProfile = data as UserProfile;
        setProfile(userProfile);

        // Check profile_complete first - if false, redirect to profile completion
        if (userProfile.profile_complete === false) {
          router.push("/profile-completion");
          return;
        }

        // Redirect based on approval status and account status
        // Priority order: rejected → pending → suspend/hold (direct or via status) → approved+active
        if (userProfile.approval_status === 'rejected') {
          router.push("/rejected");
          return;
        } else if (userProfile.approval_status === 'pending') {
          router.push("/pending");
          return;
        } else if (userProfile.approval_status === 'suspend' || userProfile.status === 'suspend') {
          router.push("/suspended");
          return;
        } else if (userProfile.approval_status === 'hold' || userProfile.status === 'hold') {
          // Stay on hold page
          return;
        } else if (userProfile.approval_status === 'approved' && userProfile.status === 'active') {
          router.push("/dashboard");
          return;
        }
      }
    } catch (error: any) {
      console.error("Error fetching profile:", error);
      setError("An error occurred while fetching profile data.");
    } finally {
      setLoading(false);
    }
  };

  // Calculate time remaining and auto-update status when expired
  useEffect(() => {
    const holdEndDate = profile?.hold_end_date || profile?.hold_end_time;
    if (!holdEndDate || isUpdatingStatus) {
      if (!holdEndDate) {
        setTimeRemaining("");
      }
      return;
    }

    const updateTimer = async () => {
      const now = new Date().getTime();
      const endTime = new Date(holdEndDate).getTime();
      const difference = endTime - now;

      if (difference <= 0) {
        setTimeRemaining("Hold period expired");
        
        // Auto-update status to approved and active if hold period expired
        if ((profile.approval_status === 'hold' || profile.status === 'hold') && !isUpdatingStatus) {
          setIsUpdatingStatus(true);
          console.log('Hold period expired, auto-updating to approved and active');
          console.log('Current profile status:', profile.approval_status, profile.status);
          
          const updateStatus = async () => {
            try {
              const { data: { session } } = await supabase.auth.getSession();
              if (!session) {
                console.error('No session found');
                setIsUpdatingStatus(false);
                return;
              }

              console.log('Updating user profile for user_id:', session.user.id);
              
              const { error: updateError, data: updateData } = await supabase
                .from('user_profiles')
                .update({
                  approval_status: 'approved',
                  status: 'active',
                  status_reason: 'Hold expired - account automatically approved and activated',
                  hold_end_date: null,
                  hold_start_date: null,
                  updated_at: new Date().toISOString(),
                })
                .eq('user_id', session.user.id)
                .select();

              if (updateError) {
                console.error('Error auto-updating status:', updateError);
                console.error('Update error details:', JSON.stringify(updateError, null, 2));
                setIsUpdatingStatus(false);
                return;
              }

              console.log('Status update successful:', updateData);
              
              // Refresh profile to get updated status
              const { data: updatedData, error: fetchError } = await supabase
                .from('user_profiles')
                .select('*')
                .eq('user_id', session.user.id)
                .single();
              
              if (fetchError) {
                console.error('Error fetching updated profile:', fetchError);
                setIsUpdatingStatus(false);
                return;
              }

              if (updatedData) {
                const updatedProfile = updatedData as UserProfile;
                console.log('Updated profile:', updatedProfile);
                setProfile(updatedProfile);
                
                // Redirect to dashboard since user is now approved and active
                setTimeout(() => {
                  if (updatedProfile.status === 'active' && updatedProfile.approval_status === 'approved') {
                    console.log('Redirecting to dashboard...');
                    router.push("/dashboard");
                  }
                }, 1000);
              }
              setIsUpdatingStatus(false);
            } catch (error) {
              console.error('Exception auto-updating status:', error);
              setIsUpdatingStatus(false);
            }
          };

          updateStatus();
        }
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      if (days > 0) {
        setTimeRemaining(`${days}d ${hours}h ${minutes}m ${seconds}s`);
      } else if (hours > 0) {
        setTimeRemaining(`${hours}h ${minutes}m ${seconds}s`);
      } else if (minutes > 0) {
        setTimeRemaining(`${minutes}m ${seconds}s`);
      } else {
        setTimeRemaining(`${seconds}s`);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [profile?.hold_end_date, profile?.hold_end_time, profile?.status, profile?.role, isUpdatingStatus, router]);

  useEffect(() => {
    fetchUserProfile();
  }, [router]);

  const handleBackToLogin = async () => {
    try {
      await handleLogout(router);
    } catch (error) {
      console.error("Error signing out:", error);
      router.push("/login");
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return "bg-red-50 text-red-700 border-red-100";
      case 'user':
        return "bg-blue-50 text-blue-700 border-blue-100";
      default:
        return "bg-gray-50 text-gray-700 border-gray-100";
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Admin';
      case 'user':
        return 'User';
      case 'super_admin':
        return 'Super Admin';
      default:
        return role;
    }
  };

  // Show loading spinner
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#e7e3ff" }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600" style={{ fontFamily: "'Roboto', sans-serif" }}>Loading your account status...</p>
        </div>
      </div>
    );
  }

  // If no profile, show error
  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#e7e3ff" }}>
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full bg-red-100">
            <i className="fi flex fi-rr-exclamation-triangle text-3xl text-red-500"></i>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>Profile Not Found</h2>
          <p className="text-gray-600 mb-4" style={{ fontFamily: "'Roboto', sans-serif" }}>Please complete your profile first.</p>
          <button
            onClick={() => router.push("/login")}
            className="px-6 py-2 rounded-md text-white transition"
            style={{ backgroundColor: "#4b33e8", fontFamily: "'Poppins', sans-serif" }}
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-8" style={{ backgroundColor: "#e7e3ff" }}>
      <div className="w-full max-w-2xl p-6 sm:p-8 bg-white rounded-xl shadow-lg border border-gray-100 mx-4">
        {/* Header with Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="mb-6">
            <AppLogo size="default" />
          </div>
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-orange-50 mb-4">
            <i className="fi flex fi-rr-pause-circle text-4xl" style={{ color: "#F97316" }}></i>
          </div>
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Account on Hold
          </h2>
          <p className="text-gray-600 text-center max-w-md" style={{ fontFamily: "'Roboto', sans-serif" }}>
            Your account is temporarily on hold. Please contact support for more information.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg mb-6 border border-red-100" style={{ fontFamily: "'Roboto', sans-serif" }}>
            {error}
          </div>
        )}

        {/* Status Card */}
        <div className="p-6 rounded-lg border bg-orange-50 text-orange-700 border-orange-100 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <i className="fi flex fi-rr-pause-circle text-2xl" style={{ color: "#F97316" }}></i>
            <span className="font-semibold text-lg" style={{ fontFamily: "'Poppins', sans-serif" }}>Account Hold Status</span>
          </div>
          <div className="space-y-2 text-sm" style={{ fontFamily: "'Roboto', sans-serif" }}>
            <p>• Your account has been temporarily placed on hold</p>
            <p>• You cannot access the dashboard at this time</p>
            <p>• Please contact support for assistance</p>
            <p>• Your account will be activated once the hold is lifted</p>
            
            {((profile.hold_end_date || profile.hold_end_time) && timeRemaining) && (
              <div className="mt-4 pt-4 border-t border-orange-200">
                <div className="flex items-center gap-2 mb-2">
                  <i className="fi flex fi-rr-clock text-orange-600 text-lg"></i>
                  <p className="font-semibold text-orange-800" style={{ fontFamily: "'Poppins', sans-serif" }}>Time Remaining:</p>
                </div>
                <div className="bg-white rounded-lg p-4 border-2 border-orange-300">
                  <p className="text-2xl sm:text-3xl font-bold text-orange-600 text-center" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    {timeRemaining}
                  </p>
                </div>
                {(profile.hold_end_date || profile.hold_end_time) && (
                  <p className="text-xs mt-3 text-center opacity-75" style={{ fontFamily: "'Roboto', sans-serif" }}>
                    Hold will be lifted on: {(() => {
                      const date = new Date(profile.hold_end_date || profile.hold_end_time!);
                      const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
                      const hours = date.getHours().toString().padStart(2, '0');
                      const minutes = date.getMinutes().toString().padStart(2, '0');
                      return `${monthNames[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()} at ${hours}:${minutes}`;
                    })()}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Profile Details Card */}
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
            <i className="fi flex fi-rr-user text-xl" style={{ color: "#4b33e8" }}></i>
            Profile Details
          </h3>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <i className="fi flex fi-rr-user text-base" style={{ color: "#787E9D" }}></i>
              <span className="text-sm font-medium" style={{ fontFamily: "'Roboto', sans-serif", color: "#263238" }}>Name:</span>
              <span className="text-sm" style={{ fontFamily: "'Roboto', sans-serif", color: "#787E9D" }}>{profile.user_name || "Not set"}</span>
            </div>

            <div className="flex items-center gap-3">
              <i className="fi flex fi-rr-envelope text-base" style={{ color: "#787E9D" }}></i>
              <span className="text-sm font-medium" style={{ fontFamily: "'Roboto', sans-serif", color: "#263238" }}>Email:</span>
              <span className="text-sm" style={{ fontFamily: "'Roboto', sans-serif", color: "#787E9D" }}>{profile.email}</span>
            </div>

            {profile.contact_no && (
              <div className="flex items-center gap-3">
                <i className="fi flex fi-rr-mobile text-base" style={{ color: "#787E9D" }}></i>
                <span className="text-sm font-medium" style={{ fontFamily: "'Roboto', sans-serif", color: "#263238" }}>Contact:</span>
                <span className="text-sm" style={{ fontFamily: "'Roboto', sans-serif", color: "#787E9D" }}>{profile.contact_no}</span>
              </div>
            )}

            {profile.employee_id && (
              <div className="flex items-center gap-3">
                <i className="fi flex fi-rr-badge text-base" style={{ color: "#787E9D" }}></i>
                <span className="text-sm font-medium" style={{ fontFamily: "'Roboto', sans-serif", color: "#263238" }}>Employee ID:</span>
                <span className="text-sm" style={{ fontFamily: "'Roboto', sans-serif", color: "#787E9D" }}>{profile.employee_id}</span>
              </div>
            )}

            <div className="flex items-center gap-3">
              <i className="fi flex fi-rr-briefcase text-base" style={{ color: "#787E9D" }}></i>
              <span className="text-sm font-medium" style={{ fontFamily: "'Roboto', sans-serif", color: "#263238" }}>Role:</span>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getRoleColor(profile.role)}`}>
                {getRoleLabel(profile.role)}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <i className="fi flex fi-rr-calendar text-base" style={{ color: "#787E9D" }}></i>
              <span className="text-sm font-medium" style={{ fontFamily: "'Roboto', sans-serif", color: "#263238" }}>Account Created:</span>
              <span className="text-sm" style={{ fontFamily: "'Roboto', sans-serif", color: "#787E9D" }}>
                {(() => {
                  const date = new Date(profile.created_at);
                  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
                  return `${monthNames[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
                })()}
              </span>
            </div>

            {profile.status_reason && (
              <div className="mt-4 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <i className="fi flex fi-rr-info text-base text-orange-600 mt-0.5" style={{ color: "#F97316" }}></i>
                  <div>
                    <span className="text-sm font-semibold text-orange-800" style={{ fontFamily: "'Poppins', sans-serif" }}>Status Reason:</span>
                    <p className="text-sm text-orange-700 mt-1" style={{ fontFamily: "'Roboto', sans-serif" }}>{profile.status_reason}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="text-center space-y-4">
          <button
            onClick={handleBackToLogin}
            className="px-8 py-3 rounded-lg text-white transition hover:opacity-90"
            style={{ backgroundColor: "#4b33e8", fontFamily: "'Poppins', sans-serif" }}
          >
            Back to Login
          </button>

          <p className="text-gray-500 text-sm" style={{ fontFamily: "'Roboto', sans-serif" }}>
            Please contact support if you have any questions about your account status.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Hold;

