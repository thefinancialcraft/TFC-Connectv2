import { useState } from "react";
import { useRouter } from "next/router";
import AppLogo from "../../components/AppLogo";
import LoginFormUserId from "../../components/loginFormUserId";
import LoginFormEmailId from "../../components/loginFormEmailId";
import SocialLoginButtons from "../../components/SocialLoginButtons";
import HeroSection from "../../components/HeroSection";
import ErrorNotification from "../../components/ErrorNotification";

export default function Login() {
  const router = useRouter();
  const [formType, setFormType] = useState<"userId" | "email">("userId");
  const [showForgotForm, setShowForgotForm] = useState(false);
  const [showForgotPasswordForm, setShowForgotPasswordForm] = useState(false);
  const [error, setError] = useState("");

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
          <div className="flex justify-center mb-6 md:mb-4">
            <AppLogo />
          </div>

            {formType === "userId" ? (
              <LoginFormUserId 
                onError={setError} 
                onForgotFormToggle={(show: boolean) => setShowForgotForm(show)}
                onForgotPasswordFormToggle={(show: boolean) => setShowForgotPasswordForm(show)}
              />
            ) : (
              <LoginFormEmailId 
                onError={setError} 
                onForgotPasswordFormToggle={(show: boolean) => setShowForgotPasswordForm(show)}
              />
            )}

            {/* Social Login Buttons handles the toggle and Google login */}
            <div className="mt-4">
              <SocialLoginButtons formType={formType} onToggleForm={toggleForm} />
            </div>

            <div className="text-center mt-4">
              <button
                type="button"
                onClick={() => setShowForgotPasswordForm(true)}
                className="text-xs font-semibold hover:underline"
                style={{ color: '#4b33e8' }}
              >
                Forgot Password?
              </button>
            </div>


          </div>
        </div>
      </div>
    </div>
  );
}
