import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { supabase } from "../lib/supabase";
import ForgotUserIdForm from "./ForgotUserIdForm";
import ForgotPasswordForm from "./ForgotPasswordForm";
import { showError } from "../lib/dialogUtils";
import { logSystemEvent } from "../lib/monitoring";

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
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Load remembered creds
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const savedId = localStorage.getItem('remembered_user_id');
    const savedPass = localStorage.getItem('_upid_data');
    const rememberPref = localStorage.getItem('remember_me_userId_pref') === 'true';
    
    if (rememberPref) {
        setRememberMe(true);
        if (savedId) setUserId(savedId);
        if (savedPass) {
            try {
                setPassword(window.atob(savedPass)); // Decode for auto-fill
            } catch (e) {
                console.warn("Failed to decode saved credentials");
            }
        }
    }
  }, []);

  const handleRememberMeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setRememberMe(checked);
    localStorage.setItem('remember_me_userId_pref', checked ? 'true' : 'false');
    if (!checked) {
        localStorage.removeItem('remembered_user_id');
        localStorage.removeItem('_upid_data');
    }
  };

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

    if (rememberMe) {
        localStorage.setItem('remembered_user_id', userId.trim());
        localStorage.setItem('_upid_data', window.btoa(password)); // Obfuscate password
    } else {
        localStorage.removeItem('remembered_user_id');
        localStorage.removeItem('_upid_data');
    }
    
    try {
      const inputId = userId.trim();
      console.log("🔍 [Login] Starting login for ID:", inputId);
      
      // Fetch email using secure API (bypasses RLS)
      const emailRes = await fetch('/api/auth/get-email-by-id', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ employeeId: inputId })
      });

      const emailData = await emailRes.json();
      
      if (!emailRes.ok || !emailData.email) {
        console.error("❌ [Login] Email lookup failed:", emailData.error || "Not found");
        throw new Error(emailData.error || "Invalid Employee ID. Please check and try again.");
      }
      
      const email = emailData.email;
      console.log("📧 [Login] Found email via API:", email);

      // Simple Supabase Sign In
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        console.error("❌ [Login] Supabase sign-in error:", signInError.message);
        throw new Error(signInError.message);
      }

      if (data.session) {
        console.log("✅ [Login] Supabase Auth successful for user:", data.user.id);
        
        logSystemEvent({
            event_type: 'AUTH',
            description: `User Login: ${inputId} successful`,
            metadata: { method: 'userId', employee_id: inputId },
            payload_size: 0,
            user_name: inputId,
        });

        // Fetch profile for redirection
        const { data: profileData, error: fetchError } = await supabase
          .from('user_profiles')
          .select('profile_complete, approval_status, status')
          .ilike('employee_id', inputId)
          .maybeSingle();

        if (fetchError) {
          console.error("⚠️ [Login] Profile re-fetch error:", fetchError);
        }

        console.log("📋 [Login] Profile status:", {
          complete: profileData?.profile_complete,
          approval: profileData?.approval_status,
          status: profileData?.status
        });

        if (profileData?.profile_complete === false) {
          console.log("➡️ [Login] Redirecting to profile completion");
          router.push("/profile-completion");
          return;
        }

        const pathMap: Record<string, string> = {
          rejected: "/rejected",
          pending: "/pending",
          suspend: "/suspended",
          hold: "/hold"
        };
        
        const redirectPath = pathMap[profileData?.approval_status || ''] || pathMap[profileData?.status || ''] || "/dashboard";
        console.log("🚀 [Login] Final redirect to:", redirectPath);
        
        // 🔔 BRIDGE NOTIFICATION: Notify Flutter that CRM is now activated
        const { notifyActivationToFlutter } = await import("../lib/flutterBridge");
        notifyActivationToFlutter();

        router.push(redirectPath);
      }
    } catch (error: any) {
      const errorMessage = error.message || "An error occurred during login";
      console.error("🔴 [Login] Fatal error:", errorMessage);
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
          className="mb-6 md:mb-2 text-xl md:text-lg"
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
            name="username"
            autoComplete="username"
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
            placeholder="Enter User ID"
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
            name="password"
            autoComplete="current-password"
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
          <button
            type="button"
            onClick={() => handleForgotPasswordFormToggle(true)}
            className="text-[12px] font-semibold hover:underline"
            style={{ color: '#4b33e8' }}
          >
            Forgot Password?
          </button>
        </div>
      </div>

      {/* Remember Me Checkbox */}
      <div className="flex items-center gap-2 mb-4 px-1">
        <input
          type="checkbox"
          id="rememberMe"
          checked={rememberMe}
          onChange={handleRememberMeChange}
          className="w-4 h-4 rounded border-gray-300 text-[#4b33e8] focus:ring-[#4b33e8]"
          style={{ cursor: 'pointer' }}
        />
        <label 
          htmlFor="rememberMe" 
          className="text-sm cursor-pointer select-none"
          style={{ color: '#787E9D', fontWeight: '500' }}
        >
          Remember Me
        </label>
      </div>

      {/* Login Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full rounded-full mt-4 px-4 py-3 md:py-[11px] md:text-[13px] font-semibold text-white transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        style={{ 
          background: '#4b33e8',
          fontFamily: "'Poppins', sans-serif"
        }}
      >
        {isLoading ? "Logging in..." : "Login"}
      </button>
    </form>
  );
}
