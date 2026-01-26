import { useState, useEffect } from "react";

import { useRouter } from "next/router";
import { supabase } from "../lib/supabase";
import ForgotPasswordForm from "./ForgotPasswordForm";
import ForgotEmailForm from "./ForgotEmailForm";
import { showError } from "../lib/dialogUtils";
import { getBrowserLocation } from "../lib/deviceUtils";
import { storeUserData } from "../lib/localStorageUtils";

interface LoginFormEmailIdProps {
  showForgotPasswordForm?: boolean;
  onForgotPasswordFormToggle?: (show: boolean) => void;
  onError?: (error: string) => void;
}

export default function LoginFormEmailId({ 
  showForgotPasswordForm = false,
  onForgotPasswordFormToggle,
  onError
}: LoginFormEmailIdProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotEmailForm, setShowForgotEmailForm] = useState(false);
  const [flutterDeviceInfo, setFlutterDeviceInfo] = useState<any>(null);

  // Listen for device info if in Flutter environment
  useEffect(() => {
    // 1. Request device info immediately
    const initBridge = async () => {
       const { requestDeviceInfoFromFlutter } = await import("../lib/flutterBridge");
       requestDeviceInfoFromFlutter();
    };
    initBridge();

    // 2. Listen for response
    const handleFlutterMessage = (event: any) => {
      const data = event.detail;
      if (data?.type === 'device_info') {
        console.log("📱 [Login] Received Device Info from Flutter:", data.value);
        setFlutterDeviceInfo(data.value);
      }
    };

    window.addEventListener('tfc-bridge-message' as any, handleFlutterMessage);
    return () => window.removeEventListener('tfc-bridge-message' as any, handleFlutterMessage);
  }, []);



  const handleForgotPasswordFormToggle = (show: boolean) => {
    onForgotPasswordFormToggle?.(show);
  };

  const handleForgotEmailFormToggle = (show: boolean) => {
    setShowForgotEmailForm(show);
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

      // --- FIX: Only reuse token_id if the SAME email is logging in again ---
      const { getStoredAccounts } = await import("../lib/sessionManager");
      const accounts = getStoredAccounts();
      const existingAccount = accounts.find(a => a.email.toLowerCase() === email.toLowerCase());
      const existingTokenId = existingAccount ? existingAccount.token_id : undefined;

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          email, 
          password,
          location: location || undefined,
          token_id: existingTokenId,
          device_info: flutterDeviceInfo || undefined,
        }),


      });

      const data = await response.json();

      if (!response.ok) {
        const errorMessage = data.error || "Invalid email or password";
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
                // Check approval status and account status first
                // If rejected, suspended, or on hold, we might not want to save the user for quick login
                
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
                  token_id: data.session.token_id,
                };

                
                // Only store if the account is not rejected
                if (profileData.user.approvalStatus !== 'rejected') {
                  console.log('Storing user data with tokens');
                  storeUserData(userDataToStore);
                } else {
                  console.log('User rejected, not storing in localStorage');
                }

                // Success! Notify Flutter bridge immediately
                const { notifyLoginToFlutter, syncUserInfoToFlutter, requestDeviceInfoFromFlutter } = await import("../lib/flutterBridge");
                notifyLoginToFlutter();
                syncUserInfoToFlutter(profileData.user);
                requestDeviceInfoFromFlutter();

                // Check profile_complete first
                if (profileData.user.profile_complete === false) {
                  router.push("/profile-completion");
                  return;
                }

                // Redirect based on approval status and account status
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
              console.error('Profile fetch failed with status:', profileResponse.status);
              // Do not store any data if profile fetch fails
            }
          }
        } catch (profileError) {
          console.error('Error fetching profile for localStorage:', profileError);
          // Do not store any data if an error occurs
        }


        // Fallback redirect if everything above somehow bypassed redirects
        router.push("/dashboard");
      }
    } catch (error: any) {
      const errorMessage = error.message || "An error occurred during login";
      showError(errorMessage, "Login Error");
      setError(errorMessage);
      onError?.(errorMessage);
      setIsLoading(false);
    }
  };

  if (showForgotPasswordForm) {
    return <ForgotPasswordForm onBack={() => handleForgotPasswordFormToggle(false)} onError={onError} />;
  }

  if (showForgotEmailForm) {
    return <ForgotEmailForm onBack={() => handleForgotEmailFormToggle(false)} onError={onError} />;
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
        Login With Email
      </h2>

      {/* Email Field */}
      <div className="mb-0">
        <label 
          htmlFor="email" 
          className="block text-sm font-medium mb-1"
          style={{ color: 'rgb(38, 50, 56)' }}
        >
          Email
        </label>
        <div className="relative">
          <i 
            className="fi flex fi-rr-envelope absolute left-4 top-1/2 transform -translate-y-1/2 text-lg md:text-base"
            style={{ 
              color: '#787E9D',
              pointerEvents: 'none'
            }}
          ></i>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            placeholder="Enter your Email"
            required
          />
        </div>
        <div className="flex justify-end mt-1 mb-0">
          <a 
            href="#" 
            className="text-sm "
            style={{
              fontSize: '12px',
              color: '#4b33e8' }}
            onClick={(e) => {
              e.preventDefault();
              handleForgotEmailFormToggle(true);
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'rgb(255, 91, 91)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#4b33e8';
            }}
          >
            Forgot Email?
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
            type={showPassword ? "text" : "password"}
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
              paddingRight: '45px'
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
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-lg md:text-base focus:outline-none"
            style={{ 
              color: '#787E9D',
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              padding: '0'
            }}
          >
            <i className={`fi flex ${showPassword ? 'fi-rr-eye' : 'fi-rr-eye-crossed'}`}></i>
          </button>
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
        {isLoading ? "Logging in..." : "Login with Email"}
      </button>
    </form>
  );
}

