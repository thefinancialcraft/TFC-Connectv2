import { useState } from "react";
import { useRouter } from "next/router";
import AppLogo from "../components/AppLogo";
import SignupForm from "../components/SignupForm";
import HeroSection from "../components/HeroSection";
import ErrorNotification from "../components/ErrorNotification";

export default function Signup() {
  const router = useRouter();
  const [error, setError] = useState("");

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
      <div className="w-full md:flex md:items-center md:justify-center md:gap-6 md:max-w-6xl md:px-6">
        {/* Reservation Container - Desktop Only */}
        <div
          className="hidden md:flex md:rounded-2xl md:p-[39px] md:shadow-2xl md:backdrop-blur-sm md:h-[512px] md:flex-col"
          style={{
            backgroundColor: "#f6f5ff",
            border: "1.5px solid #ffffff",
            width: "100%",
            maxWidth: "620px",
          }}
        >
          <HeroSection />
        </div>

        {/* Signup Container */}
        <div className="w-full h-screen md:h-auto md:max-w-[380px] md:mx-auto">
          <div
            className="w-full h-full md:rounded-2xl p-6 sm:p-8 md:p-[39px] md:shadow-2xl md:backdrop-blur-sm md:h-[512px] md:min-h-0 flex flex-col md:mt-0 gap-[5px] justify-center md:justify-start md:overflow-y-auto hide-scrollbar"
            style={{
              backgroundColor: "#FFFFFF",
              border: "1.5px solid #ffffff",
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            {/* Logo/Title Section */}
            <div className="text-center mt-2 sm:mt-4 mb-4 sm:mb-6">
              <AppLogo />
              {/* <p className="mt-4" style={{ color: "#263238" }}>
                Create Your Account
              </p> */}
            </div>

            {/* Signup Form */}
            <SignupForm onError={setError} />

            {/* Divider */}
            <div className="my-3 flex items-center">
              <div
                className="flex-1 border-t"
                style={{ borderColor: "#DCDEE3" }}
              ></div>
              <span
                className="px-4 text-sm"
                style={{ color: "rgb(38, 50, 56)" }}
              >
                Already have an account?
              </span>
              <div
                className="flex-1 border-t"
                style={{ borderColor: "#DCDEE3" }}
              ></div>
            </div>

            {/* Login Link Button */}
            <button
              type="button"
              onClick={() => router.push("/login")}
              className="w-full rounded-full px-4 py-3 md:py-[7px] text-center font-semibold transition-all hover:shadow-lg border-2"
              style={{
                borderColor: "#DCDEE3",
                backgroundColor: "#FFFFFF",
                color: "rgb(38, 50, 56)",
                fontFamily: "'Poppins', sans-serif",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#4b33e8";
                e.currentTarget.style.backgroundColor = "#DCDEE3";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#DCDEE3";
                e.currentTarget.style.backgroundColor = "#FFFFFF";
              }}
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

