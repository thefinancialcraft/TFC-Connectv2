import { useState, useEffect, useMemo, useCallback, memo } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import AppLogo from "./AppLogo";
import { supabase } from "../lib/supabase";
import { getStoredUserData } from "../lib/localStorageUtils";
import { NAV_ITEMS } from "../config/navigation";
import { DashboardLevel, getUserDashboardLevel } from "@/lib/dashboardUtils";

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
  isSuperAdmin
}: SidebarProps) {
  const router = useRouter();
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
        lastSignInAt: (cached as any).last_sign_in_at || (cached as any).lastSignInAt || null, 
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
    // Priority: 1. Props (user), 2. Cached (cachedUser)
    if (user?.profilePicUrl) return user.profilePicUrl;
    return mounted ? cachedUser?.profilePicUrl : null;
  }, [mounted, user?.profilePicUrl, cachedUser?.profilePicUrl]);

  const formattedLastLogin = useMemo(() => {
    const dateString = displayUser?.lastSignInAt;
    if (!dateString) return "Just now";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Just now";
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
      const level = getUserDashboardLevel({
        role: userRole,
        designation: designation,
        isClient: currentUser.isClient,
        employeeId: currentUser.employeeId
      });

      // Special Visibility for Call Sessions (Now for Levels 1, 2, and 3)
      if (item.path === '/call-sessions') {
        const canAccess = level === DashboardLevel.LEVEL_1_ADMIN || 
                          level === DashboardLevel.LEVEL_2_CLIENT_CEO || 
                          level === DashboardLevel.LEVEL_3_TL_SALES;
        return canAccess;
      }

      // Special Visibility for System Logs (Only visible to Client CEO, Developer, or Super Admin)
      if (item.path === '/system-logs') {
        const isClientCEO = currentUser.isClient === true && designation === 'ceo';
        const isDeveloper = designation === 'developer';
        const isInternalAdmin = currentUser.isClient === false && (userRole === 'admin' || userRole === 'super_admin' || isSuperAdmin === true);
        return isClientCEO || isDeveloper || isInternalAdmin;
      }

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
      // Default to agent if designation is missing or specifically 'agent'
      const isAgent = designation === 'agent' || !designation;
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
  }, [isAdmin, user, cachedUser, mounted]);

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
      className="hidden lg:flex flex-col w-52 bg-white border-r fixed left-0 top-0 h-screen z-40"
      style={{ borderColor: "#E0E0E0" }}
    >
      <div className="h-[65px] flex items-center justify-center">
        <AppLogo />
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 px-4 pt-6 pb-3 space-y-0.5 overflow-y-auto" suppressHydrationWarning>
        {navItems.length > 0 ? (
          navItems.map((item) => {
            const isOnPath = router.pathname.startsWith(item.path) || router.pathname.startsWith('/portal' + item.path);
            const isExactDashboard = (item.path === '/dashboard') && (router.pathname === '/dashboard' || router.pathname === '/portal/dashboard');
            const isActive = item.path === '/dashboard' ? isExactDashboard : (isOnPath || activeNav === item.path);

            return (
              <Link
                key={item.path}
                href={item.path}
                onClick={() => handleNavClick(item.path)}
                className={`flex items-center gap-2.5 px-2 py-1.5 rounded-lg transition-all duration-300 ease-in-out relative group ${
                  isActive
                    ? "text-[#4b33e8] bg-[#4b33e8]/[0.08]"
                    : "text-gray-500 hover:text-gray-900 hover:bg-gray-50/70"
                }`}
              >
                <i className={`fi ${item.icon} flex transition-all duration-300 ease-in-out ${isActive ? "text-[14px] text-[#4b33e8]" : "text-[12px] text-gray-500 group-hover:text-gray-900"}`}></i>
                <span
                  className={`px-1 transition-all duration-300 ease-in-out ${isActive ? "text-[14px] font-semibold" : "text-[13px] font-medium"}`}
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
          className="bg-white border rounded-lg p-3"
          style={{ borderColor: "#E0E0E0" }}
        >
          <div className="flex items-center gap-2.5">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm shrink-0 overflow-hidden"
              style={{
                background: profilePicUrl ? "transparent" : "#4b33e8",
              }}
            >
              {mounted && profilePicUrl ? (
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

          <div className="mt-2.5 pt-2 border-t flex items-center justify-between text-xs" style={{ borderColor: "#E0E0E0" }}>
            <span style={{ color: "#787E9D", fontFamily: "'Roboto', sans-serif" }}>
              Last Login:
            </span>
            <span
              className="font-medium text-xs"
              style={{ color: "#263238", fontFamily: "'Roboto', sans-serif" }}
              title={displayUser?.lastSignInAt ? new Date(displayUser.lastSignInAt).toLocaleString() : undefined}
            >
              {formattedLastLogin}
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
});

export default Sidebar;
