import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import AppLogo from "../../components/AppLogo";
import LoginFormUserId from "../../components/loginFormUserId";
import LoginFormEmailId from "../../components/loginFormEmailId";
import SocialLoginButtons from "../../components/SocialLoginButtons";
import HeroSection from "../../components/HeroSection";
import ErrorNotification from "../../components/ErrorNotification";
import { supabase } from "../../lib/supabase";
import { logSystemEvent } from "../../lib/monitoring";
import { notifyActivationToFlutter } from "../../lib/flutterBridge";

export default function Login() {
  const router = useRouter();
  const [formType, setFormType] = useState<"userId" | "email">("userId");
  const [showForgotForm, setShowForgotForm] = useState(false);
  const [showForgotPasswordForm, setShowForgotPasswordForm] = useState(false);
  const [error, setError] = useState("");
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    let isMounted = true;

    // 🛡️ SAFETY FALLBACK: If checking takes too long (e.g. 12s), force show login form.
    const safetyTimer = setTimeout(() => {
      if (isMounted) {
        console.warn("⚠️ [Login] Session check timed out. Showing login form.");
        setCheckingSession(false);
      }
    }, 12000);

    const checkUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session && isMounted) {
          console.log("🔄 [Login] Active session found, retrieving profile...");
          
          // ⏳ DATABASE TIMEOUT: If profile fetch takes too long (e.g. 8s), fallback
          const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error("Database Timeout")), 8000)
          );

          const profilePromise = supabase
            .from('user_profiles')
            .select('profile_complete, approval_status, status')
            .eq('user_id', session.user.id)
            .maybeSingle();

          try {
            const result: any = await Promise.race([profilePromise, timeoutPromise]);
            const profile = result?.data || result; // Handle both RPC and Select response formats

            if (profile && isMounted) {
              if (profile.profile_complete === false) {
                console.log("🚀 [Login] Profile incomplete, notifying activation and redirecting...");
                notifyActivationToFlutter();
                router.push("/profile-completion");
                return;
              }

              const pathMap: Record<string, string> = {
                rejected: "/rejected",
                pending: "/pending",
                suspend: "/suspended",
                hold: "/hold"
              };
              
              const redirectPath = pathMap[profile.approval_status || ''] || pathMap[profile.status || ''] || "/dashboard";
              console.log("🚀 [Login] Existing session, notifying activation and redirecting to:", redirectPath);
              
              // 🔔 BRIDGE NOTIFICATION: Notify Flutter that CRM is now activated
              notifyActivationToFlutter();

              logSystemEvent({
                  event_type: 'AUTH',
                  description: `Session Recovered: Redirecting to ${redirectPath}`,
                  user_id: session.user.id,
                  metadata: { redirect_path: redirectPath }
              });

              router.push(redirectPath);
            } else if (isMounted) {
              // Session exists but no profile found - likely a stale or broken session
              console.error("❌ [Login] Session exists but profile missing. Signing out.");
              await supabase.auth.signOut();
              setCheckingSession(false);
            }
          } catch (fetchErr) {
            console.error("❌ [Login] Profile fetch error or timeout:", fetchErr);
            if (isMounted) setCheckingSession(false);
          }
        } else if (isMounted) {
          setCheckingSession(false);
        }
      } catch (err) {
        console.error("Error checking session:", err);
        if (isMounted) setCheckingSession(false);
      }
    };

    checkUser();
    return () => {
      isMounted = false;
      clearTimeout(safetyTimer);
    };
  }, [router]);

  const toggleForm = () => {
    setFormType(formType === "userId" ? "email" : "userId");
  };

  if (checkingSession) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center bg-[#f6f5ff]">
        <div className="flex flex-col items-center gap-6 animate-in fade-in zoom-in duration-500">
          <div className="scale-125 mb-4">
            <AppLogo />
          </div>
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 border-4 border-[#4b33e8] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-[#263238] font-bold text-lg animate-pulse" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Retrieving logged details...
            </p>
            <p className="text-[#787E9D] text-sm font-medium">Please wait while we sync your session</p>
          </div>
        </div>
      </div>
    );
  }


  return (
    <div 
      className="flex min-h-screen items-center justify-center bg-transparent md:bg-[#e7e3ff]"
      style={{ position: 'relative' }}
    >
      {/* Error Notification - Top of Screen */}
      {error && (
        <div 
          style={{ 
            position: 'fixed', 
            top: '10px', 
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 9999,
          }}
        >
          <ErrorNotification
            message={error}
            onClose={() => setError("")}
          />
        </div>
      )}
      <div className="w-full md:flex md:items-stretch md:justify-center md:gap-6 md:max-w-6xl md:px-6">
        {/* Reservation Container - Desktop Only */}
        <div 
          className="hidden md:flex md:rounded-2xl md:p-[39px] md:shadow-2xl md:backdrop-blur-sm md:min-h-[512px] md:flex-col"
          style={{ 
            backgroundColor: '#f6f5ff',
            border: '1.5px solid #ffffff',
            width: '100%',
            minWidth: '360px'
          }}
        >
          <HeroSection />
        </div>

        {/* Login Container */}
        <div className="w-full md:h-auto md:max-w-[380px] md:mx-auto">
          <div 
            className="w-full min-h-screen md:h-full md:rounded-2xl p-6 sm:p-8 md:p-[39px] md:shadow-2xl md:backdrop-blur-sm md:min-h-[512px] flex flex-col md:mt-0 gap-4 md:gap-[5px] justify-start md:justify-center overflow-y-auto hide-scrollbar py-12 md:py-[39px]"
            style={{ 
              backgroundColor: '#FFFFFF',
              border: '1.5px solid #ffffff'
            }}
          >
          {/* Logo/Title Section */}
          <div className="flex justify-center mb-6 md:mb-4">
            <AppLogo />
          </div>

            {formType === "userId" ? (
              <LoginFormUserId 
                onError={setError} 
                showForgotForm={showForgotForm}
                showForgotPasswordForm={showForgotPasswordForm}
                onForgotFormToggle={(show: boolean) => setShowForgotForm(show)}
                onForgotPasswordFormToggle={(show: boolean) => setShowForgotPasswordForm(show)}
              />
            ) : (
              <LoginFormEmailId 
                onError={setError} 
                showForgotPasswordForm={showForgotPasswordForm}
                onForgotPasswordFormToggle={(show: boolean) => setShowForgotPasswordForm(show)}
              />
            )}

            {/* Social Login Buttons handles the toggle and Google login */}
            <div className="mt-4">
              <SocialLoginButtons formType={formType} onToggleForm={toggleForm} />
            </div>




          </div>
        </div>
      </div>
    </div>
  );
}
