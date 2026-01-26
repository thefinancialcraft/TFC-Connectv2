import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import AppLogo from "../components/AppLogo";
import LoginFormUserId from "../components/loginFormUserId";
import LoginFormEmailId from "../components/loginFormEmailId";
import SocialLoginButtons from "../components/SocialLoginButtons";
import HeroSection from "../components/HeroSection";
import ErrorNotification from "../components/ErrorNotification";
import LoggedOutUserCard from "../components/LoggedOutUserCard";
import { getStoredAccounts } from "../lib/sessionManager";

export default function Login() {
  const router = useRouter();
  const [formType, setFormType] = useState<"userId" | "email">("userId");
  const [showForgotForm, setShowForgotForm] = useState(false);
  const [showForgotPasswordForm, setShowForgotPasswordForm] = useState(false);
  const [error, setError] = useState("");
  const [showLoginForm, setShowLoginForm] = useState(false);

  useEffect(() => {
    // Check if any account cards exist in the new multi-account system
    const accounts = getStoredAccounts();
    if (!accounts || accounts.length === 0) {
      setShowLoginForm(true);
    } else {
      setShowLoginForm(false);
    }
  }, []);


  const toggleForm = () => {
    setFormType(formType === "userId" ? "email" : "userId");
  };

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
          <div className="text-center mb-6 md:mb-4">
            <AppLogo />
            {/* <p className="mt-4" style={{ color: '#263238' }}>
             Welcome Back!
            </p> */}
          </div>

          {/* Show User Card or Login Form */}
          {!showLoginForm ? (
            <LoggedOutUserCard 
              onShowLoginForm={() => setShowLoginForm(true)} 
              onLoginAnotherAccount={() => setShowLoginForm(true)}
              formType={formType}
              onToggleForm={() => {
                // Toggle form type and show login form
                toggleForm();
                setShowLoginForm(true);
              }}
            />
          ) : (
            <>
          {/* Login Form */}
          {formType === "userId" ? (
            <LoginFormUserId 
              showForgotForm={showForgotForm} 
              showForgotPasswordForm={showForgotPasswordForm}
              onForgotFormToggle={setShowForgotForm}
              onForgotPasswordFormToggle={setShowForgotPasswordForm}
              onError={setError}
            />
          ) : (
            <LoginFormEmailId 
              showForgotPasswordForm={showForgotPasswordForm}
              onForgotPasswordFormToggle={setShowForgotPasswordForm}
              onError={setError}
            />
              )}
            </>
          )}


          {/* Divider - Only show when login form is displayed, not when user card is shown */}
          {showLoginForm && (
          <div className="my-6 md:my-3 flex items-center">
            <div className="flex-1 border-t" style={{ borderColor: '#DCDEE3' }}></div>
            <span className="px-4 text-sm" style={{ color: 'rgb(38, 50, 56)' }}>
              {showForgotForm || showForgotPasswordForm ? 'more options' : 'or'}
            </span>
            <div className="flex-1 border-t" style={{ borderColor: '#DCDEE3' }}></div>
          </div>
          )}


          {/* Social Login Buttons or Back to Login */}
          {!showLoginForm ? null : showForgotForm || showForgotPasswordForm ? (
            <button
              type="button"
              onClick={() => {
                setShowForgotForm(false);
                setShowForgotPasswordForm(false);
              }}
              className="w-full rounded-full px-4 py-3 md:py-[7px] text-center font-semibold transition-all hover:shadow-lg border-2"
              style={{ 
                borderColor: '#DCDEE3',
                backgroundColor: '#FFFFFF',
                color: 'rgb(38, 50, 56)',
                fontFamily: "'Poppins', sans-serif"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#4b33e8';
                e.currentTarget.style.backgroundColor = '#DCDEE3';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#DCDEE3';
                e.currentTarget.style.backgroundColor = '#FFFFFF';
              }}
            >
              Back to Login
            </button>
          ) : (
            <>
              <SocialLoginButtons formType={formType} onToggleForm={toggleForm} />
              <div className="mt-6 md:mt-4 text-center">
                <p className="text-sm md:text-[12px]" style={{ color: 'rgb(38, 50, 56)' }}>
                  Don't have an account?{" "}
                  <button
                    type="button"
                    onClick={() => router.push("/signup")}
                    className="font-semibold hover:underline"
                    style={{ color: '#4b33e8', cursor: 'pointer' }}
                  >
                    Sign Up
                  </button>
                </p>
              </div>
            </>
          )}
         
          </div>
        </div>
      </div>
    </div>
  );
}
