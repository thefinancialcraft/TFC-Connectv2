import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { supabase } from "../lib/supabase";
import ForgotUserIdForm from "./ForgotUserIdForm";
import ForgotPasswordForm from "./ForgotPasswordForm";
import { showError } from "../lib/dialogUtils";
import { getBrowserLocation } from "../lib/deviceUtils";
import { storeUserData } from "../lib/localStorageUtils";
import { saveAccount, getStoredAccounts } from "../lib/sessionManager";

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
  const [showPassword, setShowPassword] = useState(false);
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

      // --- FIX: Only reuse token_id if the SAME user is logging in again ---
      const accounts = getStoredAccounts();
      const existingAccount = accounts.find(a => 
         a.employee_id === userId.trim() || 
         a.email === userId.trim() || 
         a.user_id === userId.trim()
      );
      
      const existingTokenId = existingAccount ? existingAccount.token_id : undefined;


      const response = await fetch("/api/auth/login-userid", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          userId: userId.trim(), 
          password: password,
          location: location || undefined,
          token_id: existingTokenId,
          device_info: flutterDeviceInfo || undefined
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
        const { access_token, refresh_token, token_id, expires_at } = data.session;
        const userData = data.user;

        // 1. Set session in Supabase client
        const { error: sessionError } = await supabase.auth.setSession({
          access_token: access_token,
          refresh_token: refresh_token,
        });

        if (sessionError) {
          throw new Error("Failed to create session");
        }

        // 2. Save to Multi-Account Storage (Our New Token System)
        saveAccount({
          token_id: token_id,
          user_id: userData.id,
          email: userData.email,
          user_name: userData.displayName || '',
          role: userData.role || 'user',
          profile_pic_url: userData.profile_pic_url || null,
          employee_id: userData.employee_id || '',
          access_token: access_token,
          refresh_token: refresh_token,
          expiry_date: expires_at,
          last_login_at: new Date().toISOString(),
          device_info: flutterDeviceInfo
        });

        // 3. Compatibility: Save to old localStorage keys if other components still use them
        storeUserData({
          user_id: userData.id,
          email: userData.email,
          user_name: userData.displayName,
          employee_id: userData.employee_id,
          role: userData.role,
          profile_pic_url: userData.profile_pic_url,
          session_token: access_token,
          refresh_token: refresh_token,
          token_id: token_id,
        });


        // 4. Flutter Bridge Notifications
        const { notifyLoginToFlutter, syncUserInfoToFlutter } = await import("../lib/flutterBridge");
        notifyLoginToFlutter();
        syncUserInfoToFlutter(userData);

        // 5. Redirect Logic
        if (userData.profile_complete === false) {
          router.push("/profile-completion");
          return;
        }

        const pathMap: Record<string, string> = {
          rejected: "/rejected",
          pending: "/pending",
          suspend: "/suspended",
          hold: "/hold"
        };
        
        const redirectPath = pathMap[userData.approval_status] || pathMap[userData.status] || "/dashboard";
        router.push(redirectPath);
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
            {isLoading ? "Logging in..." : "Login with User ID"}
          </button>
    </form>
  );
}


