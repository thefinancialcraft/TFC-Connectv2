import { useState, useEffect, useMemo, useCallback, memo } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import AppLogo from "./AppLogo";
import { supabase } from "../lib/supabase";
import { getStoredUserData } from "../lib/localStorageUtils";
import { NAV_ITEMS } from "../config/navigation";

interface SidebarProps {
  user?: {
    displayName?: string | null;
    email?: string;
    employeeId?: string | null;
    lastSignInAt?: string | null;
    profilePicUrl?: string | null;
    isClient?: boolean;
    designation?: string | null;
    allowed_tabs?: string[];
  };
  activeNav?: string;
  onNavChange?: (nav: string) => void;
  userRole?: string | null;
  isSuperAdmin?: boolean;
  onLogout?: (tokenId?: string) => void;
}

const Sidebar = memo(function Sidebar({ 
  user, 
  activeNav = "dashboard", 
  onNavChange, 
  userRole, 
  isSuperAdmin,
  onLogout
}: SidebarProps) {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  // Initialize with cached user data for ghost loading immediately
  const [cachedUser] = useState<SidebarProps['user']>(() => {
    if (typeof window === 'undefined') return undefined;
    const cached = getStoredUserData();
    if (cached) {
      return {
        displayName: cached.user_name || cached.displayName || null,
        email: cached.email || '',
        employeeId: cached.employee_id || null,
        lastSignInAt: null, 
        profilePicUrl: cached.profile_pic_url || null,
        isClient: cached.is_client,
        designation: cached.designation,
        allowed_tabs: cached.allowed_tabs,
      };
    }
    return undefined;
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  // Memoize display user to prevent unnecessary recalculations
  const displayUser = useMemo(() => {
    return mounted ? (user || cachedUser) : user;
  }, [mounted, user, cachedUser]);

  // Memoize admin status
  const isAdmin = useMemo(() => {
    return userRole === 'admin' || userRole === 'super_admin' || isSuperAdmin === true;
  }, [userRole, isSuperAdmin]);

  // Stable logout handler
  const handleLogout = useCallback(async () => {
    if (isLoggingOut || !onLogout) return;
    setIsLoggingOut(true);
    try {
      // 1. Get current active token from metadata
      const { getStoredUserData } = await import("../lib/localStorageUtils");
      const activeData = getStoredUserData();
      const accounts = (await import("../lib/sessionManager")).getStoredAccounts();
      
      let currentTokenId = activeData?.token_id;

      // 2. Fallback: Search in accounts
      if (!currentTokenId) {
        currentTokenId = displayUser?.employeeId 
          ? accounts.find(a => a.employee_id === displayUser.employeeId)?.token_id 
          : accounts[0]?.token_id;
      }

      onLogout(currentTokenId);

    } catch (err) {
      console.error("Logout exception:", err);
      setIsLoggingOut(false);
    }
  }, [isLoggingOut, onLogout, displayUser?.employeeId]);

  // Memoize derived UI values
  const initials = useMemo(() => {
    if (!mounted) return "U";
    if (displayUser?.displayName) {
      return displayUser.displayName.trim().charAt(0).toUpperCase();
    }
    if (displayUser?.email) {
      return displayUser.email.slice(0, 2).toUpperCase();
    }
    return "U";
  }, [mounted, displayUser]);

  const profilePicUrl = useMemo(() => {
    return mounted ? displayUser?.profilePicUrl : null;
  }, [mounted, displayUser]);
  
  const formattedLastLogin = useMemo(() => {
    const dateString = displayUser?.lastSignInAt;
    if (!dateString) return "Just now";
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  }, [displayUser?.lastSignInAt]);

  // Memoize filtered navigation items
  const navItems = useMemo(() => {
    // Hydration Fix: Ensure strictly empty result on first render to match server HTML (skeletons)
    // We only enable the actual links after the component has mounted on the client.
    if (!mounted) return [];

    // We prioritize the live user object if it exists (from props/auth sync)
    // but fall back to the cachedUser (local storage) immediately to prevent flicker
    const currentUser = user || cachedUser;
    if (!currentUser) return [];

    const isInternalStaff = currentUser.isClient === false;
    const designation = currentUser.designation?.toLowerCase() || '';
    const isAdminState = isAdmin || isInternalStaff;

    const filtered = NAV_ITEMS.filter(item => {
      // 1. Admin/Super Admin check
      if (item.adminOnly && !isAdminState) return false;

      // 2. Local Storage Cache: If we have cached tabs, use them for immediate rendering
      if (currentUser.allowed_tabs && currentUser.allowed_tabs.includes(item.path)) {
        return true;
      }

      // 3. Fallback/Fallback Logic (in case cache is empty or new permissions assigned)
      if (isInternalStaff) return true;
      
      const isClientAdmin = ['ceo', 'developer'].includes(designation);
      if (isClientAdmin) return true;

      const path = item.path;
      const isAgent = designation === 'agent';
      if (isAgent) {
        return ['/dashboard', '/campaign', '/activity', '/followup', '/customer'].includes(path);
      }

      const isManager = ['manager', 'team_leader'].includes(designation);
      if (isManager) {
        return ['/dashboard', '/campaign', '/activity', '/followup', '/team', '/customer'].includes(path);
      }

      return false;
    });

    return filtered;
  }, [isAdmin, user, cachedUser]);

  // Effect to sync calculated nav items back to cache
  useEffect(() => {
    if (mounted && navItems.length > 0) {
      const { getStoredUserData, storeUserData } = require("../lib/localStorageUtils");
      const currentData = getStoredUserData();
      if (currentData) {
        const newPaths = navItems.map(item => item.path);
        // Only update if changed to avoid loops
        if (JSON.stringify(currentData.allowed_tabs) !== JSON.stringify(newPaths)) {
          storeUserData({
            ...currentData,
            allowed_tabs: newPaths
          });
        }
      }
    }
  }, [navItems, mounted]);

  const handleNavClick = useCallback((path: string) => {
    onNavChange?.(path);
  }, [onNavChange]);

  return (
    <aside
      className="hidden lg:flex flex-col w-56 bg-white border-r fixed left-0 top-0 h-screen z-40"
      style={{ borderColor: "#E0E0E0" }}
    >
      {/* Logo Section */}
      <div className="p-3 border-b flex justify-center" style={{ borderColor: "#E0E0E0" }}>
        <AppLogo />
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto" suppressHydrationWarning>
        {navItems.length > 0 ? (
          navItems.map((item) => {
            const isOnPath = router.pathname.startsWith(item.path);
            const isExactDashboard = item.path === '/dashboard' && router.pathname === '/dashboard';
            const isActive = item.path === '/dashboard' ? isExactDashboard : (isOnPath || activeNav === item.path);

            return (
              <Link
                key={item.path}
                href={item.path}
                onClick={() => handleNavClick(item.path)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all duration-300 relative ${
                  isActive
                    ? "text-white shadow-md"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
                style={{
                  backgroundColor: isActive ? "#4b33e8" : "transparent",
                }}
              >
                <i className={`fi ${item.icon} flex text-sm`}></i>
                <span
                  className="font-medium px-1.5 text-sm"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  {item.name}
                </span>
              </Link>
            );
          })
        ) : (
          // Skeleton Links - Only shown if cache is completely empty
          [1, 2, 3, 4, 5].map(i => (
            <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-lg animate-pulse">
                <div className="w-5 h-5 rounded bg-gray-100"></div>
                <div className="h-3 w-24 bg-gray-100 rounded"></div>
            </div>
          ))
        )}
      </nav>

      {/* User Profile Card at Bottom */}
      <div className="p-3 border-t space-y-2" style={{ borderColor: "#E0E0E0", backgroundColor: "#FAFAFA" }}>
        <div
          className="bg-white border rounded-lg p-3 shadow-sm hover:shadow-md transition-all duration-300"
          style={{ borderColor: "#E0E0E0" }}
        >
          <div className="flex items-start gap-2.5 mb-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm shrink-0 shadow-md overflow-hidden"
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
                className="text-sm font-semibold truncate mb-0.5"
                style={{ color: "#263238", fontFamily: "'Poppins', sans-serif" }}
              >
                {mounted ? (displayUser?.displayName || displayUser?.email?.split("@")[0] || "User") : "User"}
              </p>
              <p
                className="text-xs truncate"
                style={{ color: "#787E9D", fontFamily: "'Roboto', sans-serif" }}
              >
                {mounted ? (displayUser?.email || "user@example.com") : "user@example.com"}
              </p>
            </div>
          </div>

          <div className="space-y-1.5 mb-3 pt-2 border-t" style={{ borderColor: "#E0E0E0" }}>
            <div className="flex items-center justify-between text-xs">
              <span style={{ color: "#787E9D", fontFamily: "'Roboto', sans-serif" }}>
                Employee ID:
              </span>
              <span
                className="font-medium"
                style={{ color: "#263238", fontFamily: "'Roboto', sans-serif" }}
              >
                {mounted ? (displayUser?.employeeId || "Not assigned") : "Not assigned"}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span style={{ color: "#787E9D", fontFamily: "'Roboto', sans-serif" }}>
                Last Login:
              </span>
              <span
                className="font-medium"
                style={{ color: "#263238", fontFamily: "'Roboto', sans-serif" }}
              >
                {formattedLastLogin}
              </span>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => router.push('/settings')}
              className="w-8 h-8 text-xs border rounded-lg transition-all duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                borderColor: "#DCDEE3",
                backgroundColor: "#FFFFFF",
                color: "#263238",
                fontFamily: "'Poppins', sans-serif",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#4b33e8";
                e.currentTarget.style.backgroundColor = "#EEF2FF";
                e.currentTarget.style.color = "#4b33e8";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#DCDEE3";
                e.currentTarget.style.backgroundColor = "#FFFFFF";
                e.currentTarget.style.color = "#263238";
              }}
              title="Settings"
            >
              <i className="fi flex fi-rr-settings text-sm"></i>
            </button>
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="flex-1 h-8 text-xs border rounded-lg transition-all duration-300 flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                borderColor: "#DCDEE3",
                backgroundColor: "#FFFFFF",
                color: "#263238",
                fontFamily: "'Poppins', sans-serif",
              }}
              onMouseEnter={(e) => {
                if (!isLoggingOut) {
                  e.currentTarget.style.borderColor = "#EF4444";
                  e.currentTarget.style.backgroundColor = "#FEE2E2";
                  e.currentTarget.style.color = "#EF4444";
                }
              }}
              onMouseLeave={(e) => {
                if (!isLoggingOut) {
                  e.currentTarget.style.borderColor = "#DCDEE3";
                  e.currentTarget.style.backgroundColor = "#FFFFFF";
                  e.currentTarget.style.color = "#263238";
                }
              }}
            >
              {isLoggingOut ? (
                <div className="w-4 h-4 border-2 border-t-transparent border-current rounded-full animate-spin"></div>
              ) : (
                <>
                  <i className="fi flex px-1 fi-rr-exit text-sm"></i>
                  <span>Logout</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
});

export default Sidebar;
