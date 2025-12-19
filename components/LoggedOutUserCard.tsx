import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { getStoredUserData, getAllStoredUsers, clearStoredUserData, removeStoredUser, storeUserData, StoredUserData } from "../lib/localStorageUtils";
import { supabase } from "../lib/supabase";
import { showError, showSuccess } from "../lib/dialogUtils";
import SocialLoginButtons from "./SocialLoginButtons";

interface LoggedOutUserCardProps {
  onShowLoginForm: () => void;
  onLoginAnotherAccount?: () => void;
  formType?: "userId" | "email";
  onToggleForm?: () => void;
}

export default function LoggedOutUserCard({ onShowLoginForm, onLoginAnotherAccount, formType = "userId", onToggleForm }: LoggedOutUserCardProps) {
  const router = useRouter();
  const [userData, setUserData] = useState<StoredUserData | null>(null);
  const [allUsers, setAllUsers] = useState<StoredUserData[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadUserData = async () => {
      // Get all stored users (supports multiple users)
      const usersArray = getAllStoredUsers();
      console.log('Loaded stored users:', usersArray);
      
      if (usersArray.length === 0) {
        // No users found, check if single user storage exists (backward compatibility)
        const singleUser = getStoredUserData();
        if (singleUser) {
          usersArray.push(singleUser);
        }
      }
      
      if (usersArray.length > 0) {
        setAllUsers(usersArray);
        setCurrentIndex(0);
        
        // Check if Supabase has a session (might be from previous login)
        const { data: { session } } = await supabase.auth.getSession();
        
        const currentUser = usersArray[0];
        
        // If we have stored data but no tokens, try to get from Supabase session
        if ((!currentUser.session_token || !currentUser.refresh_token) && session) {
          console.log('Found Supabase session but stored data missing tokens, updating localStorage');
          const updatedData = {
            ...currentUser,
            session_token: session.access_token,
            refresh_token: session.refresh_token,
          };
          storeUserData(updatedData);
          const updatedUsers = [...usersArray];
          updatedUsers[0] = updatedData;
          setAllUsers(updatedUsers);
          setUserData(updatedData);
        } else {
          setUserData(currentUser);
        }
      } else {
        // Check if Supabase has session but no stored data
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          console.log('Supabase session found but no stored user data');
        }
      }
    };
    
    loadUserData();
  }, []);

  // Update current user data when index changes
  useEffect(() => {
    if (allUsers.length > 0 && currentIndex >= 0 && currentIndex < allUsers.length) {
      setUserData(allUsers[currentIndex]);
    }
  }, [currentIndex, allUsers]);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : allUsers.length - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < allUsers.length - 1 ? prev + 1 : 0));
  };

  const handleRemoveAccount = () => {
    if (!userData) return;
    
    // Remove current user from stored users
    removeStoredUser(userData.user_id);
    
    // Update local state
    const updatedUsers = allUsers.filter((u) => u.user_id !== userData.user_id);
    setAllUsers(updatedUsers);
    
    if (updatedUsers.length > 0) {
      // Switch to first remaining user
      setCurrentIndex(0);
      setUserData(updatedUsers[0]);
    } else {
      // No users left, show login form
      setUserData(null);
      if (onLoginAnotherAccount) {
        onLoginAnotherAccount();
      } else {
        onShowLoginForm();
      }
    }
  };

  const handleLogin = async () => {
    setIsLoading(true);
    
    try {
      // First check if Supabase already has an active session
      const { data: { session: existingSession }, error: getSessionError } = await supabase.auth.getSession();
      
      if (existingSession && existingSession.user?.email_confirmed_at) {
        // Verify the existing session is actually valid by fetching the user
        const { data: { user: verifiedUser }, error: verifyError } = await supabase.auth.getUser();
        
        if (verifyError || !verifiedUser) {
          console.error('Existing session verification failed:', verifyError);
          // Session exists but is invalid, continue with token restoration
        } else {
          // Already have a valid and verified session, just redirect
          console.log('Found existing Supabase session, verified, redirecting');
          // Update stored data with current session tokens
          if (userData) {
            storeUserData({
              ...userData,
              session_token: existingSession.access_token,
              refresh_token: existingSession.refresh_token,
            });
          }
          showSuccess('Welcome back!', 'Login Success');
          setIsLoading(false);
          router.push('/dashboard');
          return;
        }
      }

      // No existing session, try to restore using stored tokens
      if (!userData?.session_token || !userData?.refresh_token) {
        // No stored session tokens, show login form
        console.log('No session tokens found, showing login form');
        setIsLoading(false);
        onShowLoginForm();
        return;
      }

      // Try to restore session using stored tokens
      console.log('Attempting to restore session with stored tokens...');
      console.log('Token details:', {
        hasAccessToken: !!userData.session_token,
        accessTokenLength: userData.session_token?.length,
        hasRefreshToken: !!userData.refresh_token,
        refreshTokenLength: userData.refresh_token?.length,
      });
      
      // First verify session exists in database
      try {
        console.log('Verifying session in database...');
        const verifyResponse = await fetch('/api/auth/verify-session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            session_token: userData.session_token,
            user_id: userData.user_id,
          }),
        });

        const verifyData = await verifyResponse.json();
        
        if (!verifyData.success || !verifyData.isActive) {
          console.log('Session not found or inactive in database for current user:', userData.user_id);
          setIsLoading(false);
          
          // Only remove the current user's card from localStorage
          removeStoredUser(userData.user_id);
          
          // Update local state - remove only this user
          const updatedUsers = allUsers.filter((u) => u.user_id !== userData.user_id);
          
          if (updatedUsers.length > 0) {
            // Switch to first remaining user (don't try to login with it, just show the card)
            setAllUsers(updatedUsers);
            setCurrentIndex(0);
            setUserData(updatedUsers[0]);
            showError(`Session expired for ${userData.user_name || userData.email}. Please use another account.`, 'Session Expired');
          } else {
            // No users left, show login form
            setAllUsers([]);
            setUserData(null);
            showError('Your session has expired. Please login again.', 'Session Expired');
            onShowLoginForm();
          }
          return;
        }
        console.log('Session verified in database');
      } catch (verifyError) {
        console.error('Error verifying session:', verifyError);
        // Continue with session restoration even if verification fails (for backward compatibility)
        // But this should ideally fail
      }
      
      let session = null;
      let sessionError = null;
      
      // Try refreshSession first - refresh tokens last longer than access tokens
      // Access tokens expire quickly (usually 1 hour), so we should refresh first
      if (userData.refresh_token) {
        try {
          console.log('Trying refreshSession first (refresh tokens last longer)...');
          const refreshResponse = await supabase.auth.refreshSession({
            refresh_token: userData.refresh_token,
          });
          
          if (refreshResponse.data?.session) {
            // Verify the refreshed session is actually valid by fetching the user
            const { data: { user: verifiedUser }, error: verifyError } = await supabase.auth.getUser();
            
            if (verifyError || !verifiedUser) {
              console.error('Refreshed session verification failed:', verifyError);
              sessionError = verifyError || new Error('User verification failed');
            } else {
              session = refreshResponse.data.session;
              console.log('Session refreshed and verified successfully with refreshSession');
              // Update stored tokens with new ones - ensure all card details are preserved
              const updatedUserData = {
                ...userData,
                session_token: session.access_token,
                refresh_token: session.refresh_token,
              };
              storeUserData(updatedUserData);
              // Update local state
              setUserData(updatedUserData);
              // Update in allUsers array
              const updatedUsers = [...allUsers];
              const currentUserIndex = updatedUsers.findIndex(u => u.user_id === userData.user_id);
              if (currentUserIndex >= 0) {
                updatedUsers[currentUserIndex] = updatedUserData;
                setAllUsers(updatedUsers);
              }
            }
          } else if (refreshResponse.error) {
            sessionError = refreshResponse.error;
            console.error('RefreshSession error:', refreshResponse.error);
          }
        } catch (refreshError: any) {
          console.error('RefreshSession exception:', refreshError);
          if (!sessionError) {
            sessionError = refreshError;
          }
        }
      }
      
      // If refreshSession didn't work, try setSession as fallback
      if (!session && !sessionError) {
        try {
          console.log('Trying setSession as fallback...');
          const setSessionResponse = await supabase.auth.setSession({
            access_token: userData.session_token,
            refresh_token: userData.refresh_token,
          });
          
          if (setSessionResponse.data?.session) {
            // Verify the session is actually valid by fetching the user
            const { data: { user: verifiedUser }, error: verifyError } = await supabase.auth.getUser();
            
            if (verifyError || !verifiedUser) {
              console.error('Session verification failed:', verifyError);
              sessionError = verifyError || new Error('User verification failed');
            } else {
              session = setSessionResponse.data.session;
              console.log('Session restored and verified successfully with setSession');
              // Update stored tokens with any new ones (in case they were refreshed)
              // Ensure all card details are preserved along with session tokens
              const updatedUserData = {
                ...userData,
                session_token: session.access_token,
                refresh_token: session.refresh_token,
              };
              storeUserData(updatedUserData);
              // Update local state
              setUserData(updatedUserData);
              // Update in allUsers array
              const updatedUsers = [...allUsers];
              const currentUserIndex = updatedUsers.findIndex(u => u.user_id === userData.user_id);
              if (currentUserIndex >= 0) {
                updatedUsers[currentUserIndex] = updatedUserData;
                setAllUsers(updatedUsers);
              }
            }
          } else if (setSessionResponse.error) {
            sessionError = setSessionResponse.error;
            console.error('SetSession error:', setSessionResponse.error);
          }
        } catch (setSessionError: any) {
          console.error('SetSession exception:', setSessionError);
          sessionError = setSessionError;
        }
      }

      if (sessionError || !session) {
        console.error('Failed to restore session for user:', userData.user_id, sessionError);
        // Token expired or invalid for current user only
        console.log('Session expired or invalid for current user only');
        
        setIsLoading(false);
        
        // Only remove the current user's card from localStorage
        removeStoredUser(userData.user_id);
        
        // Update local state - remove only this specific user
        const updatedUsers = allUsers.filter((u) => u.user_id !== userData.user_id);
        setAllUsers(updatedUsers);
        
        if (updatedUsers.length > 0) {
          // Switch to first remaining user (don't auto-login, just show the card)
          setCurrentIndex(0);
          setUserData(updatedUsers[0]);
          
          // Show appropriate error message for the failed user only
          const errorMsg = sessionError?.message?.includes('expired') || 
                          sessionError?.status === 401
            ? `Session expired for ${userData.user_name || userData.email}. Please use another account.`
            : `Failed to restore session for ${userData.user_name || userData.email}. Please use another account.`;
          
          showError(errorMsg, 'Session Error');
        } else {
          // No users left, show login form
          setUserData(null);
          const errorMsg = sessionError?.message?.includes('expired') || 
                          sessionError?.status === 401
            ? 'Your session has expired. Please login again.'
            : 'Failed to restore session. Please login again.';
          showError(errorMsg, 'Session Error');
          onShowLoginForm();
        }
        return;
      }

      if (!session) {
        console.log('No session returned, showing login form');
        setIsLoading(false);
        showError('Failed to restore session. Please login again.', 'Login Error');
        clearStoredUserData();
        setUserData(null);
        onShowLoginForm();
        return;
      }

      // Verify email confirmation
      if (!session.user?.email_confirmed_at) {
        showError('Please verify your email address before accessing the dashboard.', 'Email Not Verified');
        setIsLoading(false);
        return;
      }

      // Session restored successfully, redirect to dashboard
      console.log('Session restored successfully, redirecting to dashboard');
      showSuccess('Welcome back!', 'Login Success');
      setIsLoading(false);
      router.push('/dashboard');
    } catch (error: any) {
      console.error('Login error:', error);
      showError(error.message || 'Failed to restore session. Please login again.', 'Login Error');
      setIsLoading(false);
      // Clear invalid session data
      clearStoredUserData();
      setUserData(null);
      onShowLoginForm();
    }
  };

  const getInitials = (name: string) => {
    if (!name) return "U";
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.trim().charAt(0).toUpperCase();
  };

  if (!userData || allUsers.length === 0) {
    return null;
  }

  const showNavigation = allUsers.length > 1;

  return (
    <div className="w-full flex flex-col items-center relative">
      {/* Navigation Buttons - Only show if multiple users */}
      {showNavigation && (
        <>
          {/* Previous Button (Left) */}
          <button
            type="button"
            onClick={handlePrevious}
            className="absolute left-0 z-10 p-1.5 rounded-full bg-white shadow-md hover:bg-gray-50 transition-colors border"
            style={{ 
              borderColor: '#DCDEE3',
              top: '35%',
              transform: 'translateX(-50%)',
            }}
            title="Previous account"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-4 w-4" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
              strokeWidth={2.5}
              style={{ color: '#4b33e8' }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Next Button (Right) */}
          <button
            type="button"
            onClick={handleNext}
            className="absolute right-0 z-10 p-1.5 rounded-full bg-white shadow-md hover:bg-gray-50 transition-colors border"
            style={{ 
              borderColor: '#DCDEE3',
              top: '35%',
              transform: 'translateX(50%)',
            }}
            title="Next account"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-4 w-4" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
              strokeWidth={2.5}
              style={{ color: '#4b33e8' }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Card Indicator (Dots) */}
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
            {allUsers.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentIndex ? 'w-6' : ''
                }`}
                style={{
                  backgroundColor: index === currentIndex ? '#4b33e8' : '#DCDEE3',
                }}
                title={`Switch to account ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
      {/* Profile Picture */}
      <div className="relative mb-4">
        {userData.profile_pic_url ? (
          <img
            src={userData.profile_pic_url}
            alt={userData.user_name || 'User'}
            className="w-24 h-24 rounded-full object-cover"
          />
        ) : (
          <div 
            className="w-24 h-24 rounded-full flex items-center justify-center text-white text-2xl font-bold"
            style={{ 
              backgroundColor: '#4b33e8',
              fontFamily: "'Poppins', sans-serif"
            }}
          >
            {getInitials(userData.user_name || userData.displayName || '')}
          </div>
        )}
        
        {/* Remove Button (Trash Icon) - Top Right */}
        <button
          type="button"
          onClick={handleRemoveAccount}
          className="absolute -top-1 -right-1 p-1.5 rounded-full bg-white shadow-md hover:bg-gray-50 transition-colors"
          title="Remove account"
          style={{ color: '#4b33e8' }}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-4 w-4" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>

      {/* User Name */}
      <h3 
        className="text-2xl font-bold mb-2 text-center"
        style={{ 
          color: '#263238',
          fontFamily: "'Poppins', sans-serif"
        }}
      >
        {userData.user_name || userData.displayName || 'User'}
      </h3>

      {/* ID and Role */}
      <p 
        className="text-sm mb-4 text-center"
        style={{ 
          color: '#263238',
          fontFamily: "'Roboto', sans-serif"
        }}
      >
        {userData.employee_id ? `${userData.employee_id} • ` : ''}
        {userData.role ? userData.role.charAt(0).toUpperCase() + userData.role.slice(1) : 'user'}
      </p>

      {/* Login Button (Purple with loading state) */}
      <button
        type="button"
        onClick={handleLogin}
        disabled={isLoading}
        className="w-full rounded-full px-6 py-3 md:py-[7px] text-center font-semibold text-white transition-all hover:opacity-90 shadow-md flex items-center justify-center gap-2 disabled:opacity-75"
        style={{ 
          backgroundColor: '#4b33e8',
          fontFamily: "'Poppins', sans-serif"
        }}
      >
        {isLoading ? (
          <>
            <div 
              className="animate-spin rounded-full border-2 border-white border-t-transparent"
              style={{
                width: '20px',
                height: '20px'
              }}
            ></div>
          </>
        ) : (
          'Log In'
        )}
      </button>

      {/* Divider */}
      <div className="my-6 md:my-4 flex items-center w-full">
        <div className="flex-1 border-t" style={{ borderColor: '#DCDEE3' }}></div>
        <span className="px-4 text-sm" style={{ color: '#787E9D', fontFamily: "'Roboto', sans-serif" }}>
          or
        </span>
        <div className="flex-1 border-t" style={{ borderColor: '#DCDEE3' }}></div>
      </div>

      {/* Social Login Buttons */}
      <div className="w-full">
        <SocialLoginButtons 
          formType={formType} 
          onToggleForm={() => {
            // When Email/User ID toggle button is clicked
            // First toggle the form type (if handler provided)
            if (onToggleForm) {
              onToggleForm();
            }
            // Then show the login form (hide user card)
            onShowLoginForm();
          }}
        />
      </div>
    </div>
  );
}

