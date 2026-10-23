import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import AppLogo from "../../components/AppLogo";
import LoginFormUserId from "../../components/loginFormUserId";
import LoginFormEmailId from "../../components/loginFormEmailId";
import SocialLoginButtons from "../../components/SocialLoginButtons";
import HeroSection from "../../components/HeroSection";
import ErrorNotification from "../../components/ErrorNotification";
import NoActiveAccountModal from "@/components/NoActiveAccountModal";
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
  const [showNoAccountModal, setShowNoAccountModal] = useState(false);
  const [unregisteredEmail, setUnregisteredEmail] = useState("");

  useEffect(() => {
    if (!router.isReady) return;

    // Check if redirected with unregistered flag
    if (router.query.unregistered === "true") {
      setShowNoAccountModal(true);
      if (router.query.email) {
        setUnregisteredEmail(router.query.email as string);
      }
      setCheckingSession(false);
      router.replace(router.pathname, undefined, { shallow: true });
      return;
    }

    // Check URL hash for OAuth redirect errors (Supabase passes errors in hash fragment)
    if (typeof window !== "undefined" && window.location.hash) {
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const errorParam = hashParams.get("error") || hashParams.get("error_code");
      const errorDesc = hashParams.get("error_description") || "";
      if (errorParam) {
        console.warn("OAuth hash error detected:", errorParam, errorDesc);
        window.history.replaceState(null, "", window.location.pathname);
        if (
          errorDesc.includes("NO_ACTIVE_ACCOUNT") ||
          errorDesc.includes("UNREGISTERED") ||
          errorDesc.includes("Database error") ||
          errorParam.includes("access_denied")
        ) {
          setShowNoAccountModal(true);
          setCheckingSession(false);
          return;
        } else {
          setError(decodeURIComponent(errorDesc.replace(/\+/g, " ") || errorParam));
        }
      }
    }

    if (router.query.error) {
      const errStr = decodeURIComponent(router.query.error as string);
      if (
        errStr.includes("NO_ACTIVE_ACCOUNT") ||
        errStr.includes("UNREGISTERED") ||
        errStr.includes("Database error")
      ) {
        setShowNoAccountModal(true);
        setCheckingSession(false);
      } else {
        setError(errStr);
      }
      // Remove query parameter from URL after showing error to keep URL clean
      router.replace(router.pathname, undefined, { shallow: true });
    }
  }, [router.isReady, router.query, router.pathname]);

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

          // Check by user_id OR by email (in case account was pre-registered or created via email)
          const profilePromise = supabase
            .from('user_profiles')
            .select('id, user_id, email, profile_complete, approval_status, status, expire_at')
            .or(`user_id.eq.${session.user.id},email.ilike.${session.user.email}`)
            .maybeSingle();

          try {
            const result: any = await Promise.race([profilePromise, timeoutPromise]);
            const profile = result?.data || result; // Handle both RPC and Select response formats

            if (profile && isMounted) {
              // If user logged in with OAuth and user_id was different, link user_id
              if (profile.user_id !== session.user.id) {
                console.log("🔗 Linking Google OAuth user_id with existing profile");
                await supabase
                  .from('user_profiles')
                  .update({ user_id: session.user.id })
                  .eq('id', profile.id);
              }

              if (profile.profile_complete === false) {
                console.log("🚀 [Login] Profile incomplete, notifying activation and redirecting...");
                notifyActivationToFlutter();
                router.push("/profile-completion");
                return;
              }

              // 🛡️ STATUS CHECK: Prevent login if account is inactive or expired
              const isInactive = profile.status === 'inactive';
              const isExpired = profile.expire_at && new Date(profile.expire_at) < new Date();

              if (isInactive || isExpired) {
                console.warn("🚫 [Login] Account inactive or expired. Signing out.");
                await supabase.auth.signOut();
                setCheckingSession(false);
                setError("Your account is expired or inactive. Please contact your admin.");
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
              // Session exists but no profile found in user_profiles -> UNREGISTERED USER
              console.warn("🚫 [Login] Unregistered user detected via session. Deleting auth user & showing notice modal.");
              const userEmail = session.user?.email || "";
              const userId = session.user?.id;

              // 1. Delete user from auth.users via backend admin API so no auth entry is retained
              try {
                await fetch('/api/auth/cleanup-unregistered-user', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session.access_token}`
                  },
                  body: JSON.stringify({ userId, email: userEmail })
                });
              } catch (cleanupErr) {
                console.error("Failed to delete unregistered auth user:", cleanupErr);
              }

              // 2. Sign out & clear all session cache
              await supabase.auth.signOut();
              if (typeof window !== 'undefined') {
                sessionStorage.removeItem('active_user_profile');
                localStorage.removeItem('cached_user_profile');
              }

              setUnregisteredEmail(userEmail);
              setShowNoAccountModal(true);
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

      {/* No Active Account Modal Popup */}
      <NoActiveAccountModal
        isOpen={showNoAccountModal}
        onClose={() => setShowNoAccountModal(false)}
        email={unregisteredEmail}
      />
    </div>
  );
}
