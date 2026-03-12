import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { logSystemEvent } from '../lib/monitoring';

interface SocialLoginButtonsProps {
  formType: "userId" | "email";
  onToggleForm: () => void;
}

export default function SocialLoginButtons({ formType, onToggleForm }: SocialLoginButtonsProps) {
  const [isColumnLayout, setIsColumnLayout] = useState(false);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkWidth = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth;
        setIsColumnLayout(width < 300);
      }
    };

    // Check on mount
    checkWidth();

    // Check on resize
    window.addEventListener('resize', checkWidth);
    return () => window.removeEventListener('resize', checkWidth);
  }, []);

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      const isMobile = typeof window !== 'undefined' && !!(window as any).flutter_inappwebview;
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
          skipBrowserRedirect: isMobile,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        }
      });

      if (error) throw error;

      logSystemEvent({
        event_type: 'AUTH',
        description: `Initiate Google Login`,
        metadata: { provider: 'google' },
        user_name: 'Anonymous'
      });
      
      if (isMobile && data?.url) {
        const { notifyFlutter } = await import("../lib/flutterBridge");
        notifyFlutter('open_external_url', data.url);
      }
    } catch (error) {
      console.error("Error logging in with Google:", error);
      alert("Failed to initiate Google Login");
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSignIn = () => {
    // Toggle between User ID and Email forms
    onToggleForm();
  };

  return (
    <div 
      ref={containerRef}
      className={`flex gap-3 ${isColumnLayout ? 'flex-col' : 'flex-row'}`}
    >
      {/* Google Sign In Button */}
      <button
        onClick={handleGoogleSignIn}
        disabled={loading}
        className="group relative flex-1 rounded-full border-2 px-6 py-3 md:py-[7px] text-center font-semibold transition-all hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
        style={{ 
          borderColor: '#DCDEE3',
          backgroundColor: '#FFFFFF',
          color: 'rgb(38, 50, 56)',
        }}
        onMouseEnter={(e) => {
          if (!loading) {
            e.currentTarget.style.borderColor = '#4b33e8';
            e.currentTarget.style.backgroundColor = '#DCDEE3';
          }
        }}
        onMouseLeave={(e) => {
          if (!loading) {
            e.currentTarget.style.borderColor = '#DCDEE3';
            e.currentTarget.style.backgroundColor = '#FFFFFF';
          }
        }}
      >
        <div className="flex items-center justify-center gap-2">
          {loading ? (
             <div className="w-5 h-5 border-2 border-gray-600 border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <>
              <svg
                className="h-5 w-5 md:h-4 md:w-4"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              <span>Google</span>
            </>
          )}
        </div>
      </button>

      {/* Email/User ID Toggle Button */}
      <button
        onClick={handleEmailSignIn}
        className="group relative flex-1 rounded-full border-2 px-6 py-3 md:py-[7px] text-center font-semibold transition-all hover:shadow-lg"
        style={{ 
          borderColor: '#DCDEE3',
          backgroundColor: '#FFFFFF',
          color: 'rgb(38, 50, 56)'
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
        <div className="flex items-center justify-center gap-2">
          {formType === "userId" ? (
            <>
              <svg
                className="h-5 w-5 md:h-4 md:w-4"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" fill="currentColor"/>
              </svg>
              <span>Email</span>
            </>
          ) : (
            <>
              <svg
                className="h-5 w-5 md:h-4 md:w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              <span>User ID</span>
            </>
          )}
        </div>
      </button>
    </div>
  );
}

