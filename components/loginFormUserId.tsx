import { useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../lib/supabase";
import ForgotUserIdForm from "./ForgotUserIdForm";
import ForgotPasswordForm from "./ForgotPasswordForm";
import { showError } from "../lib/dialogUtils";
import { getBrowserLocation } from "../lib/deviceUtils";
import { storeUserData } from "../lib/localStorageUtils";

interface LoginFormUserIdProps {
  showForgotForm?: boolean;
  showForgotPasswordForm?: boolean;
  onForgotFormToggle?: (show: boolean) => void;
  onForgotPasswordFormToggle?: (show: boolean) => void;
  onError?: (error: string) => void;
}

export default function LoginFormUserId({ 
  showForgotForm = false, 
  showForgotPasswordForm = false,
  onForgotFormToggle,
  onForgotPasswordFormToggle,
  onError
}: LoginFormUserIdProps) {
  const router = useRouter();
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const handleForgotFormToggle = (show: boolean) => {
    onForgotFormToggle?.(show);
  };

  const handleForgotPasswordFormToggle = (show: boolean) => {
    onForgotPasswordFormToggle?.(show);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    
    try {
      // Get location from browser (with permission)
      let location: string | null = null;
      try {
        location = await getBrowserLocation();
      } catch (locError) {
        console.log('Location permission denied or error:', locError);
      }

      const response = await fetch("/api/auth/login-userid", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          userId, 
          password,
          location: location || undefined, // Send location if available
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMessage = data.error || "Invalid User ID or password";
        setError(errorMessage);
        onError?.(errorMessage);
        setIsLoading(false);
        return;
      }

      if (data.success && data.session) {
        // Store session tokens immediately before setting session
        const accessToken = data.session.access_token;
        const refreshToken = data.session.refresh_token;

        // Set session in Supabase client
        const { error: sessionError } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });

        if (sessionError) {
          const errorMessage = "Failed to create session";
          showError(errorMessage, "Session Error");
          setError(errorMessage);
          onError?.(errorMessage);
          setIsLoading(false);
          return;
        }

        // Fetch user profile data and store in localStorage
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            // Fetch full profile from API
            const profileResponse = await fetch("/api/auth/user-profile", {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            });
            
            if (profileResponse.ok) {
              const profileData = await profileResponse.json();
              if (profileData.success && profileData.user) {
                // Store user data in localStorage with session tokens
                const userDataToStore = {
                  user_id: user.id,
                  email: user.email || '',
                  user_name: profileData.user.displayName || profileData.user.user_name || '',
                  employee_id: profileData.user.employeeId || '',
                  role: profileData.user.role || 'user',
                  profile_pic_url: profileData.user.profile_pic_url || null,
                  displayName: profileData.user.displayName || profileData.user.user_name || '',
                  session_token: accessToken,
                  refresh_token: refreshToken,
                };
                console.log('Storing user data with tokens:', { 
                  hasAccessToken: !!userDataToStore.session_token,
                  hasRefreshToken: !!userDataToStore.refresh_token 
                });
                storeUserData(userDataToStore);

                // Check profile_complete first
                if (profileData.user.profile_complete === false) {
                  router.push("/profile-completion");
                  return;
                }

                // Redirect based on approval status and account status
                // Priority order: rejected → pending → suspend/hold (direct or via status) → approved+active
                if (profileData.user.approvalStatus === 'rejected') {
                  router.push("/rejected");
                  return;
                } else if (profileData.user.approvalStatus === 'pending') {
                  router.push("/pending");
                  return;
                } else if (profileData.user.approvalStatus === 'suspend' || profileData.user.accountStatus === 'suspend') {
                  router.push("/suspended");
                  return;
                } else if (profileData.user.approvalStatus === 'hold' || profileData.user.accountStatus === 'hold') {
                  router.push("/hold");
                  return;
                } else if (profileData.user.approvalStatus === 'approved' && profileData.user.accountStatus === 'active') {
                  router.push("/dashboard");
                  return;
                }
              }
            } else {
              // Even if profile fetch fails, store basic data with tokens
              const userDataToStore = {
                user_id: user.id,
                email: user.email || '',
                user_name: user.email?.split('@')[0] || '',
                employee_id: '',
                role: 'user',
                profile_pic_url: null,
                displayName: user.email?.split('@')[0] || '',
                session_token: accessToken,
                refresh_token: refreshToken,
              };
              console.log('Storing basic user data with tokens');
              storeUserData(userDataToStore);
            }
          }
        } catch (profileError) {
          console.error('Error fetching profile for localStorage:', profileError);
          // Even on error, try to store basic data with tokens
          try {
            const { data: { user } } = await supabase.auth.getUser();
            if (user && accessToken && refreshToken) {
              const userDataToStore = {
                user_id: user.id,
                email: user.email || '',
                user_name: user.email?.split('@')[0] || '',
                employee_id: '',
                role: 'user',
                profile_pic_url: null,
                displayName: user.email?.split('@')[0] || '',
                session_token: accessToken,
                refresh_token: refreshToken,
              };
              console.log('Storing fallback user data with tokens');
              storeUserData(userDataToStore);
            }
          } catch (fallbackError) {
            console.error('Error in fallback storage:', fallbackError);
          }
        }

        // Check approval status before redirecting
        try {
          const { data: { user: currentUser } } = await supabase.auth.getUser();
          if (currentUser) {
            const profileResponse = await fetch("/api/auth/user-profile", {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            });
            
            if (profileResponse.ok) {
              const profileData = await profileResponse.json();
              if (profileData.success && profileData.user) {
                // Check profile_complete first
                if (profileData.user.profile_complete === false) {
                  router.push("/profile-completion");
                  return;
                }
                // Redirect based on approval status and account status
                // Priority order: rejected → pending → suspend/hold (direct or via status) → approved+active
                if (profileData.user.approvalStatus === 'rejected') {
                  router.push("/rejected");
                  return;
                } else if (profileData.user.approvalStatus === 'pending') {
                  router.push("/pending");
                  return;
                } else if (profileData.user.approvalStatus === 'suspend' || profileData.user.accountStatus === 'suspend') {
                  router.push("/suspended");
                  return;
                } else if (profileData.user.approvalStatus === 'hold' || profileData.user.accountStatus === 'hold') {
                  router.push("/hold");
                  return;
                } else if (profileData.user.approvalStatus === 'approved' && profileData.user.accountStatus === 'active') {
                  router.push("/dashboard");
                  return;
                }
              }
            }
          }
        } catch (checkError) {
          console.error('Error checking approval status:', checkError);
        }

        // Redirect to dashboard or home page
        router.push("/dashboard"); // Update this to your desired redirect path
      }
    } catch (error: any) {
      const errorMessage = error.message || "An error occurred during login";
      showError(errorMessage, "Login Error");
      setError(errorMessage);
      onError?.(errorMessage);
      setIsLoading(false);
    }
  };

  if (showForgotForm) {
    return <ForgotUserIdForm onBack={() => handleForgotFormToggle(false)} onError={onError} />;
  }

  if (showForgotPasswordForm) {
    return <ForgotPasswordForm onBack={() => handleForgotPasswordFormToggle(false)} onError={onError} />;
  }

  return (
    <form onSubmit={handleSubmit} className="mt-0" style={{ position: 'relative' }}>
        <h2 
          className="mb-6 md:mb-0 text-xl md:text-lg"
          style={{ 
            fontWeight: '700',
            fontFamily: 'poppins',
            color: '#263238',
            textAlign: 'center',
          }}>
          Login With User ID
        </h2>

      {/* User ID Field */}
      <div className="mb-0">
        <label 
          htmlFor="userId" 
          className="block text-sm font-medium mb-1"
          style={{ color: 'rgb(38, 50, 56)' }}
        >
          User ID
        </label>
        <div className="relative">
          <i 
            className="fi flex fi-rr-user absolute left-4 top-1/2 transform -translate-y-1/2 text-lg md:text-base"
            style={{ 
              color: '#787E9D',
              pointerEvents: 'none'
            }}
          ></i>
          <input
            type="text"
            id="userId"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            className="w-full rounded-full border-2 py-3 md:py-[11px] md:text-[13px] transition-all focus:outline-none"
            style={{ 
              borderColor: '#DCDEE3',
              backgroundColor: '#FFFFFF',
              color: 'rgb(38, 50, 56)',
              fontFamily: "'Roboto', sans-serif",
              paddingLeft: '45px',
              paddingRight: '16px'
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = '#4b33e8';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = '#DCDEE3';
            }}
            placeholder="Enter your User ID"
            required
          />
        </div>
        <div className="flex justify-end mt-1">
          <a 
            href="#" 
            className="text-sm "
            style={{
              fontSize: '12px',
              color: '#4b33e8' }}
            onClick={(e) => {
              e.preventDefault();
              handleForgotFormToggle(true);
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'rgb(255, 91, 91)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#4b33e8';
            }}
          >
            Forgot User ID?
          </a>
        </div>
      </div>

      {/* Password Field */}
      <div className="mb-2">
        <label 
          htmlFor="password" 
          className="block text-sm font-medium mb-1"
          style={{ color: 'rgb(38, 50, 56)' }}
        >
          Password
        </label>
        <div className="relative">
          <i 
            className="fi flex fi-rr-lock absolute left-4 top-1/2 transform -translate-y-1/2 text-lg md:text-base"
            style={{ 
              color: '#787E9D',
              pointerEvents: 'none'
            }}
          ></i>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-full border-2 py-3 md:py-[11px] md:text-[13px] transition-all focus:outline-none"
            style={{ 
              borderColor: '#DCDEE3',
              backgroundColor: '#FFFFFF',
              color: 'rgb(38, 50, 56)',
              fontFamily: "'Roboto', sans-serif",
              paddingLeft: '45px',
              paddingRight: '16px'
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = '#4b33e8';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = '#DCDEE3';
            }}
            placeholder="Enter your Password"
            required
          />
        </div>
        <div className="flex justify-end mt-1">
        <a 
            href="#" 
            className="text-sm "
            style={{
              fontSize: '12px',
              color: '#4b33e8' }}
            onClick={(e) => {
              e.preventDefault();
              handleForgotPasswordFormToggle(true);
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'rgb(255, 91, 91)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#4b33e8';
            }}
          >
            Forgot Password?
          </a>
        </div>
      </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-full mt-1 px-4 py-3 md:py-[11px] md:text-[13px] font-semibold text-white transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ 
              background: 'linear-gradient(to right, #4b33e8)',
              fontFamily: "'Poppins', sans-serif"
            }}
            onMouseEnter={(e) => {
              if (!isLoading) {
                e.currentTarget.style.background = 'linear-gradient(to right,#4b33e8)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isLoading) {
                e.currentTarget.style.background = 'linear-gradient(to right, #4b33e8)';
              }
            }}
          >
            {isLoading ? "Logging in..." : "Login with User ID"}
          </button>
    </form>
  );
}

