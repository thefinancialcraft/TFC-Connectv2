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
  };
  activeNav?: string;
  onNavChange?: (nav: string) => void;
  userRole?: string | null;
  isSuperAdmin?: boolean;
}

const Sidebar = memo(function Sidebar({ 
  user, 
  activeNav = "dashboard", 
  onNavChange, 
  userRole, 
  isSuperAdmin 
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
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Logout error:", error);
      }
      
      // Clear critical local storage items on logout
      if (typeof window !== 'undefined') {
        localStorage.removeItem("isAuthenticated");
        localStorage.removeItem("userEmail");
        localStorage.removeItem("rememberMe");
        localStorage.removeItem("rememberedEmail");
        localStorage.removeItem("rememberedPassword");
      }
      // Use replace to prevent back navigation after logout
      await router.replace("/login");
    } catch (err) {
      console.error("Logout exception:", err);
      await router.replace("/login");
    } finally {
      if (mounted) setIsLoggingOut(false);
    }
  }, [isLoggingOut, router, mounted]);

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
    // Visibility logic for User and Org Pages (Strict Visibility)
    const currentUser = (mounted && user) ? user : cachedUser;
    
    // Only allow visibility if we are mounted AND meet the criteria
    // If not mounted, remains false to prevent flicker
    const allowedDesignations = ['manager', 'team_leader', 'ceo', 'developer'];
    const currentDesignation = currentUser?.designation?.toLowerCase() || '';

    const isUserPageVisible = mounted && (
      currentUser?.isClient === false || 
      (currentUser?.isClient === true && ['ceo', 'developer'].includes(currentDesignation))
    );

    const isOrgVisible = mounted && (
      currentUser?.isClient === false || 
      (currentUser?.isClient === true && ['ceo', 'developer'].includes(currentDesignation))
    );

    const isTeamPageVisible = mounted && (
      currentUser?.isClient === false || 
      (currentUser?.isClient === true && ['manager', 'team_leader', 'ceo', 'developer'].includes(currentDesignation))
    );

    const isAdminState = mounted && isAdmin;

    return NAV_ITEMS.filter(item => {
      // Admin check
      if (item.adminOnly && !isAdminState) return false;
      
      // User page visibility check (Hidden by default until confirmed)
      if (item.path === '/users' && !isUserPageVisible) return false;

      // Org page visibility check (Hidden by default until confirmed)
      if (item.path === '/organization' && !isOrgVisible) return false;

      // Team page visibility check (Hidden by default until confirmed)
      if (item.path === '/team' && !isTeamPageVisible) return false;
      
      return true;
    });
  }, [mounted, isAdmin, user, cachedUser]);

  const handleNavClick = useCallback((path: string) => {
    onNavChange?.(path);
  }, [onNavChange]);

  return (
    <aside
      className="hidden lg:flex flex-col w-56 bg-white border-r fixed left-0 top-0 h-screen z-40"
      style={{ borderColor: "#E0E0E0" }}
    >
      {/* Logo Section */}
      <div className="p-4 border-b" style={{ borderColor: "#E0E0E0" }}>
        <AppLogo size="small" />
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          // Robust active check handling nested routes (e.g. /users matches /users/new)
          // But strict match for dashboard to avoid matching everything if dashboard path is '/'
          const isOnPath = router.pathname.startsWith(item.path);
          const isExactDashboard = item.path === '/dashboard' && router.pathname === '/dashboard';
          const isActive = item.path === '/dashboard' ? isExactDashboard : (isOnPath || activeNav === item.path);

          return (
            <Link
              key={item.path}
              href={item.path}
              onClick={() => handleNavClick(item.path)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300 relative ${
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
        })}
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
