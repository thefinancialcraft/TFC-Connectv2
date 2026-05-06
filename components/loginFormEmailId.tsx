import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { supabase } from "../lib/supabase";
import ForgotPasswordForm from "./ForgotPasswordForm";
import ForgotEmailForm from "./ForgotEmailForm";
import { logSystemEvent } from "../lib/monitoring";

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
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotEmailForm, setShowForgotEmailForm] = useState(false);

  // Load remembered creds
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const savedEmail = localStorage.getItem('remembered_email');
    const savedPass = localStorage.getItem('_upsa_data');
    const rememberPref = localStorage.getItem('remember_me_pref') === 'true';
    
    if (rememberPref) {
        setRememberMe(true);
        if (savedEmail) setEmail(savedEmail);
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
    localStorage.setItem('remember_me_pref', checked ? 'true' : 'false');
    if (!checked) {
        localStorage.removeItem('remembered_email');
        localStorage.removeItem('_upsa_data');
    }
  };

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

    if (rememberMe) {
        localStorage.setItem('remembered_email', email.trim());
        localStorage.setItem('_upsa_data', window.btoa(password)); // Obfuscate password
    } else {
        localStorage.removeItem('remembered_email');
        localStorage.removeItem('_upsa_data');
    }

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (signInError) {
        throw new Error(signInError.message);
      }

      if (data.session) {
        console.log("✅ Email Login successful");
        
        logSystemEvent({
            event_type: 'AUTH',
            description: `User Login: ${email.trim()} successful`,
            metadata: { method: 'email', email: email.trim() },
            payload_size: 0,
            user_name: email.trim(),
        });

        // Fetch profile for redirection
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('profile_complete, approval_status, status')
          .eq('user_id', data.user.id)
          .maybeSingle();

        if (profile?.profile_complete === false) {
          router.push("/profile-completion");
          return;
        }

        const pathMap: Record<string, string> = {
          rejected: "/rejected",
          pending: "/pending",
          suspend: "/suspended",
          hold: "/hold"
        };
        
        const redirectPath = pathMap[profile?.approval_status || ''] || pathMap[profile?.status || ''] || "/dashboard";
        
        // 🔔 BRIDGE NOTIFICATION: Notify Flutter that CRM is now activated
        const { notifyActivationToFlutter } = await import("../lib/flutterBridge");
        notifyActivationToFlutter();

        router.push(redirectPath);
      }
    } catch (error: any) {
      const errorMessage = error.message || "An error occurred during login";
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
        className="mb-6 md:mb-2 text-xl md:text-lg"
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
            name="email"
            autoComplete="email"
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
