import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/lib/supabase";
import { showError } from "@/lib/dialogUtils";

export default function AuthCallback() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get tokens from hash (Supabase sends tokens in hash for client-side)
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        // Also check query params (some flows use query params)
        const queryParams = new URLSearchParams(window.location.search);
        
        const accessToken = hashParams.get('access_token') || queryParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token') || queryParams.get('refresh_token');
        const errorParam = hashParams.get('error') || queryParams.get('error');
        const errorDescription = hashParams.get('error_description') || queryParams.get('error_description');

        // Check for errors in URL
        if (errorParam) {
          const errorMsg = errorDescription || errorParam;
          showError(errorMsg, 'Authentication Error');
          setError(errorMsg);
          setLoading(false);
          setTimeout(() => {
            router.push('/login');
          }, 3000);
          return;
        }

        // If we have tokens, exchange them for a session
        if (accessToken && refreshToken) {
          const { error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (sessionError) {
            showError(sessionError.message, 'Session Error');
            setError(sessionError.message);
            setLoading(false);
            setTimeout(() => {
              router.push('/login');
            }, 3000);
            return;
          }

          // Call API to verify callback
          try {
            const response = await fetch(`/api/auth/callback?access_token=${accessToken}&refresh_token=${refreshToken}`, {
              method: 'GET',
            });

            const data = await response.json();

            if (data.success && data.redirect) {
              router.push(data.redirect);
              return;
            } else if (data.error) {
              showError(data.error, 'Authentication Error');
              setError(data.error);
              setLoading(false);
              setTimeout(() => {
                router.push(data.redirect || '/login');
              }, 3000);
              return;
            }
          } catch (apiError) {
            console.error('API callback error:', apiError);
            // Fallback to client-side verification
          }

          // Fallback: Verify email confirmation client-side
          const { data: { user } } = await supabase.auth.getUser();
          if (!user?.email_confirmed_at) {
            setError('Email verification failed. Please check your email and try again.');
            setLoading(false);
            setTimeout(() => {
              router.push('/login');
            }, 3000);
            return;
          }

          // Success - redirect to dashboard
          router.push('/dashboard');
        } else {
          // No tokens found - might be a different callback type
          // Try to get session from current state
          const { data: { session }, error: sessionError } = await supabase.auth.getSession();
          
          if (session && !sessionError) {
            // Check if email is confirmed
            if (!session.user?.email_confirmed_at) {
              setError('Please verify your email address before accessing the dashboard.');
              setLoading(false);
              setTimeout(() => {
                router.push('/login');
              }, 3000);
              return;
            }
            // User is already authenticated and email confirmed, redirect to dashboard
            router.push('/dashboard');
          } else {
            // No session found, redirect to login
            setError('No authentication tokens found');
            setLoading(false);
            setTimeout(() => {
              router.push('/login');
            }, 3000);
          }
        }
      } catch (err: any) {
        const errorMsg = err.message || 'An error occurred';
        showError(errorMsg, 'Error');
        setError(errorMsg);
        setLoading(false);
        setTimeout(() => {
          router.push('/login');
        }, 3000);
      }
    };

    handleAuthCallback();
  }, [router]);

  return (
    <div 
      className="flex min-h-screen items-center justify-center"
      style={{ backgroundColor: '#e7e3ff' }}
    >
      <div className="flex flex-col items-center gap-4">
        {loading ? (
          <>
            {/* Spinner */}
            <div 
              className="animate-spin rounded-full border-4 border-t-transparent"
              style={{
                width: '48px',
                height: '48px',
                borderColor: '#4b33e8',
                borderTopColor: 'transparent',
              }}
            ></div>
            <p 
              className="text-lg font-semibold"
              style={{ color: '#4b33e8', fontFamily: "'Poppins', sans-serif" }}
            >
              Verifying your email...
            </p>
          </>
        ) : error ? (
          <>
            <p 
              className="text-lg font-semibold text-red-500"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              {error}
            </p>
            <p 
              className="text-sm"
              style={{ color: '#263238', fontFamily: "'Roboto', sans-serif" }}
            >
              Redirecting to login...
            </p>
          </>
        ) : null}
      </div>
    </div>
  );
}

