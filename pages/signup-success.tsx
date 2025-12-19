import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import AppLogo from "../components/AppLogo";

export default function SignupSuccess() {
  const router = useRouter();
  const [userDetails, setUserDetails] = useState<{
    name?: string;
    email?: string;
  } | null>(null);

  useEffect(() => {
    // Wait for router to be ready before accessing query params
    if (!router.isReady) return;

    // Get user details from query params or localStorage
    const { name, email } = router.query;
    
    if (name && email) {
      setUserDetails({
        name: typeof name === 'string' ? name : name[0],
        email: typeof email === 'string' ? email : email[0],
      });
    } else {
      // Try to get from localStorage if available
      const storedName = localStorage.getItem('signup_name');
      const storedEmail = localStorage.getItem('signup_email');
      
      if (storedName && storedEmail) {
        setUserDetails({
          name: storedName,
          email: storedEmail,
        });
        // Clear stored data
        localStorage.removeItem('signup_name');
        localStorage.removeItem('signup_email');
      }
    }
  }, [router.isReady, router.query]);

  const handleBackToLogin = () => {
    router.push("/login");
  };

  return (
    <div 
      className="flex min-h-screen items-center justify-center bg-transparent md:bg-[#e7e3ff]"
      style={{ position: 'relative' }}
    >
      <div className="w-full md:flex md:items-center md:justify-center md:gap-6 md:max-w-6xl md:px-6">
        {/* Success Container */}
        <div className="w-full h-screen md:h-auto md:max-w-[500px] md:mx-auto">
          <div 
            className="w-full h-full md:rounded-2xl p-6 sm:p-8 md:p-[39px] md:shadow-2xl md:backdrop-blur-sm md:min-h-[400px] md:min-w-0 flex flex-col gap-6 md:gap-4 justify-center"
            style={{ 
              backgroundColor: '#FFFFFF',
              border: '1.5px solid #ffffff'
            }}
          >
            {/* Logo */}
            <div className="text-center mb-4">
              <AppLogo />
            </div>

            {/* Welcome Message */}
            <div className="text-center">
              <h1 
                className="text-2xl md:text-xl mb-2"
                style={{ 
                  fontWeight: '700',
                  fontFamily: 'poppins',
                  color: '#263238',
                }}
              >
                Welcome to TFC Connect!
              </h1>
              
              <div className="mt-4 mb-6">
                {userDetails ? (
                  <>
                    <p 
                      className="text-base md:text-sm mb-2"
                      style={{ 
                        color: 'rgb(38, 50, 56)',
                        fontFamily: "'Roboto', sans-serif",
                      }}
                    >
                      <strong>Name:</strong> {userDetails.name}
                    </p>
                    <p 
                      className="text-base md:text-sm"
                      style={{ 
                        color: 'rgb(38, 50, 56)',
                        fontFamily: "'Roboto', sans-serif",
                      }}
                    >
                      <strong>Email:</strong> {userDetails.email}
                    </p>
                  </>
                ) : (
                  <p 
                    className="text-base md:text-sm"
                    style={{ 
                      color: 'rgb(38, 50, 56)',
                      fontFamily: "'Roboto', sans-serif",
                    }}
                  >
                    Your account has been created successfully!
                  </p>
                )}
              </div>

              <p 
                className="text-sm md:text-xs mb-6"
                style={{ 
                  color: 'rgb(38, 50, 56)',
                  fontFamily: "'Roboto', sans-serif",
                  lineHeight: '1.6',
                }}
              >
                Please check your email for confirmation.
              </p>
            </div>

            {/* Back to Login Button */}
            <button
              type="button"
              onClick={handleBackToLogin}
              className="w-full rounded-full px-4 py-3 md:py-[11px] md:text-[13px] font-semibold text-white transition-all hover:shadow-lg"
              style={{ 
                background: 'linear-gradient(to right, #4b33e8)',
                fontFamily: "'Poppins', sans-serif",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = '0.9';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = '1';
              }}
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

