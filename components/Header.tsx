import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import AppLogo from "./AppLogo";
import { getStoredUserData } from "../lib/localStorageUtils";

interface HeaderProps {
  user?: {
    displayName?: string | null;
    email?: string;
    employeeId?: string | null;
    profilePicUrl?: string | null;
  };
  onLogout?: () => void;
}

export default function Header({ user, onLogout }: HeaderProps) {
  const router = useRouter();
  const [serverStatus, setServerStatus] = useState<'online' | 'offline' | 'checking'>('online');
  const [showFullStatus, setShowFullStatus] = useState<boolean>(true);
  const [mounted, setMounted] = useState(false);
  
  // Initialize with cached data, then update with props if different (ghost update)
  const [cachedUser, setCachedUser] = useState<HeaderProps['user']>(() => {
    if (typeof window === 'undefined') return undefined; // SSR safety
    const cached = getStoredUserData();
    if (cached) {
      return {
        displayName: cached.user_name || cached.displayName || null,
        email: cached.email || '',
        employeeId: cached.employee_id || null,
        profilePicUrl: cached.profile_pic_url || null,
      };
    }
    return undefined;
  });

  // Set mounted to true after component mounts (client-side only)
  useEffect(() => {
    setMounted(true);
  }, []);

  // Ghost update: Only update if props actually changed
  useEffect(() => {
    if (user) {
      setCachedUser(prev => {
        // If no previous cached data, use props
        if (!prev) {
          return user;
        }
        
        // Compare data - only update if changed
        const hasChanged = 
          prev.displayName !== user.displayName ||
          prev.employeeId !== user.employeeId ||
          prev.email !== user.email ||
          prev.profilePicUrl !== user.profilePicUrl;
        
        // Only update if data has actually changed
        if (hasChanged) {
          return user;
        }
        
        // Return previous data to prevent unnecessary re-render
        return prev;
      });
    }
  }, [user?.displayName, user?.employeeId, user?.email, user?.profilePicUrl]);

  // Use cached user for display (prevents "User / Not assigned" flicker)
  const displayUser = cachedUser || user;

  const getInitials = () => {
    if (displayUser?.displayName) {
      return displayUser.displayName.trim().charAt(0).toUpperCase();
    }
    if (displayUser?.email) {
      return displayUser.email.slice(0, 2).toUpperCase();
    }
    return "U";
  };

  const initials = getInitials();
  // Only use profilePicUrl after mount to prevent hydration mismatch
  const profilePicUrl = mounted ? displayUser?.profilePicUrl : null;

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
  };

  // Mobile header design
  return (
    <>
      {/* Mobile Header */}
      <header
        className="lg:hidden border-b fixed top-0 left-0 right-0 z-50 backdrop-blur-sm"
        style={{ borderColor: "#E0E0E0", backgroundColor: "rgba(255, 255, 255, 0.8)" }}
      >
        <div className="px-4 py-3 flex items-center justify-between">
          {/* Left: User Avatar */}
          <button
            onClick={() => router.push("/settings")}
            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-base shrink-0 transition-colors cursor-pointer overflow-hidden"
            style={{
              background: profilePicUrl ? "transparent" : "#4b33e8",
            }}
            aria-label="Open Settings"
          >
            {profilePicUrl ? (
              <img
                src={profilePicUrl}
                alt={displayUser?.displayName || 'User'}
                className="w-full h-full object-cover"
              />
            ) : (
              initials
            )}
          </button>

          {/* Center: Username */}
          <div className="flex-1 flex flex-col items-center justify-center">
            <h1
              className="text-base font-bold leading-tight"
              style={{ color: "#263238", fontFamily: "'Poppins', sans-serif" }}
            >
              {displayUser?.displayName || displayUser?.email?.split("@")[0] || "User"}
            </h1>
            <p
              className="text-xs leading-tight"
              style={{ color: "#787E9D", fontFamily: "'Roboto', sans-serif" }}
            >
              Signify - Growwik Media
            </p>
          </div>

          {/* Right: Server Status & Logout */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleLogout}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              style={{ color: "#EF4444" }}
              aria-label="Logout"
            >
              <i className="fi flex fi-rr-exit text-lg"></i>
            </button>
          </div>
        </div>
      </header>

      {/* Desktop Header */}
      <header
        className="hidden lg:block border-b fixed top-0 z-50 w-full backdrop-blur-sm"
        style={{ borderColor: "#E0E0E0", left: "224px", backgroundColor: "rgba(255, 255, 255, 0.8)" }}
      >
        <div className="w-full px-6 py-2.5 flex items-center justify-between">
          {/* Left: User Profile */}
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold text-xs shrink-0 overflow-hidden"
              style={{
                background: profilePicUrl ? "transparent" : "#4b33e8",
              }}
            >
              {profilePicUrl ? (
                <img
                  src={profilePicUrl}
                  alt={displayUser?.displayName || 'User'}
                  className="w-full h-full object-cover"
                />
              ) : (
                initials
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p
                className="text-sm font-semibold truncate"
                style={{ color: "#263238", fontFamily: "'Poppins', sans-serif" }}
              >
                {displayUser?.displayName || displayUser?.email?.split("@")[0] || "User"}
              </p>
              <p
                className="text-xs truncate"
                style={{ color: "#787E9D", fontFamily: "'Roboto', sans-serif" }}
              >
                Employee ID: {displayUser?.employeeId || "Not assigned"}
              </p>
            </div>
          </div>

          {/* Right: Server Status & Logo */}
          <div className="flex items-center gap-3">
            {/* Server Status */}
            <div
              className={`flex items-center justify-center rounded-full text-sm font-medium transition-all duration-700 ease-in-out overflow-hidden ${
                showFullStatus ? 'gap-2 px-3 py-1.5 w-auto' : 'gap-0 p-2 w-9 h-9'
              } ${
                serverStatus === 'online'
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : serverStatus === 'offline'
                  ? 'bg-red-50 text-red-700 border border-red-200'
                  : 'bg-amber-50 text-amber-700 border border-amber-200'
              }`}
              title={serverStatus === 'online' ? 'Server Online' : serverStatus === 'offline' ? 'Server Offline' : 'Checking...'}
            >
              {serverStatus === 'online' ? (
                <>
                  <i className="fi flex fi-rr-signal text-base flex-shrink-0"></i>
                  <span
                    className={`whitespace-nowrap transition-all duration-700 ease-in-out ${
                      showFullStatus
                        ? 'max-w-[100px] opacity-100'
                        : 'max-w-0 opacity-0'
                    }`}
                    style={{ overflow: 'hidden', fontFamily: "'Roboto', sans-serif" }}
                  >
                    Online
                  </span>
                </>
              ) : serverStatus === 'offline' ? (
                <>
                  <i className="fi flex fi-rr-signal-slash text-base flex-shrink-0"></i>
                  <span
                    className={`whitespace-nowrap transition-all duration-700 ease-in-out ${
                      showFullStatus
                        ? 'max-w-[100px] opacity-100'
                        : 'max-w-0 opacity-0'
                    }`}
                    style={{ overflow: 'hidden', fontFamily: "'Roboto', sans-serif" }}
                  >
                    Offline
                  </span>
                </>
              ) : (
                <>
                  <i className="fi flex fi-rr-signal text-base animate-pulse flex-shrink-0"></i>
                  <span
                    className={`whitespace-nowrap transition-all duration-700 ease-in-out ${
                      showFullStatus
                        ? 'max-w-[100px] opacity-100'
                        : 'max-w-0 opacity-0'
                    }`}
                    style={{ overflow: 'hidden', fontFamily: "'Roboto', sans-serif" }}
                  >
                    Checking...
                  </span>
                </>
              )}
            </div>

          </div>
        </div>
      </header>
    </>
  );
}

