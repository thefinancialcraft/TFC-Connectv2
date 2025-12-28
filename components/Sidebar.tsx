import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import AppLogo from "./AppLogo";
import { supabase } from "../lib/supabase";
import { getStoredUserData } from "../lib/localStorageUtils";

interface SidebarProps {
  user?: {
    displayName?: string | null;
    email?: string;
    employeeId?: string | null;
    lastSignInAt?: string | null;
    profilePicUrl?: string | null;
  };
  activeNav?: string;
  onNavChange?: (nav: string) => void;
  userRole?: string | null;
  isSuperAdmin?: boolean;
}

export default function Sidebar({ user, activeNav = "dashboard", onNavChange, userRole, isSuperAdmin }: SidebarProps) {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [currentUserRole, setCurrentUserRole] = useState<string | null>(userRole || null);
  const [currentIsSuperAdmin, setCurrentIsSuperAdmin] = useState<boolean | undefined>(isSuperAdmin);
  
  // Initialize with cached data, then update with props if different (ghost update)
  const [cachedUser, setCachedUser] = useState<SidebarProps['user']>(() => {
    if (typeof window === 'undefined') return undefined; // SSR safety
    const cached = getStoredUserData();
    if (cached) {
      return {
        displayName: cached.user_name || cached.displayName || null,
        email: cached.email || '',
        employeeId: cached.employee_id || null,
        lastSignInAt: null, // Will be updated from props
        profilePicUrl: cached.profile_pic_url || null,
      };
    }
    return undefined;
  });

  // Set mounted to true after component mounts (client-side only)
  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch user role from database if not provided
  useEffect(() => {
    if (mounted && !currentUserRole) {
      const fetchUserRole = async () => {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session) {
            const { data: userProfile } = await supabase
              .from('user_profiles')
              .select('role, super_admin')
              .eq('user_id', session.user.id)
              .single();

            if (userProfile) {
              setCurrentUserRole(userProfile.role);
              setCurrentIsSuperAdmin(userProfile.super_admin || false);
            }
          }
        } catch (err) {
          console.error('Error fetching user role in Sidebar:', err);
        }
      };
      fetchUserRole();
    } else if (userRole) {
      setCurrentUserRole(userRole);
    }
    if (isSuperAdmin !== undefined) {
      setCurrentIsSuperAdmin(isSuperAdmin);
    }
  }, [mounted, userRole, isSuperAdmin, currentUserRole]);

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
          prev.lastSignInAt !== user.lastSignInAt ||
          prev.profilePicUrl !== user.profilePicUrl;
        
        // Only update if data has actually changed
        if (hasChanged) {
          return user;
        }
        
        // Return previous data to prevent unnecessary re-render
        return prev;
      });
    }
  }, [user?.displayName, user?.employeeId, user?.email, user?.lastSignInAt, user?.profilePicUrl]);

  // Use cached user for display (prevents "User / Not assigned" flicker)
  // Only use cached user after mount to prevent hydration mismatch
  const displayUser = mounted ? (cachedUser || user) : user;

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Logout error:", error);
      } else {
        // Clear any cached data
        if (displayUser?.email) {
          localStorage.removeItem("isAuthenticated");
          localStorage.removeItem("userEmail");
          localStorage.removeItem("rememberMe");
          localStorage.removeItem("rememberedEmail");
          localStorage.removeItem("rememberedPassword");
        }
        router.push("/login");
      }
    } catch (err) {
      console.error("Logout error:", err);
      router.push("/login");
    } finally {
      setIsLoggingOut(false);
    }
  };

  const getInitials = () => {
    if (!mounted) return "U"; // Return default during SSR to prevent hydration mismatch
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

  const formatLastLogin = (dateString?: string | null) => {
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
  };

  // Check if user is admin or super_admin
  // Only check after mount to prevent hydration mismatch
  const isAdmin = mounted && (currentUserRole === 'admin' || currentUserRole === 'super_admin' || currentIsSuperAdmin === true);

  const allNavItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: "fi-rr-home",
      adminOnly: false,
    },
    {
      name: "Users",
      path: "/users",
      icon: "fi-rr-users",
      adminOnly: true, // Only show for admin/super_admin
    },
    {
      name: "Customer",
      path: "/customer",
      icon: "fi-rr-users",
      adminOnly: false,
    },
    {
      name: "Campaign",
      path: "/campaign",
      icon: "fi-rr-bullhorn",
      adminOnly: false,
    },
    {
      name: "Activity",
      path: "/activity",
      icon: "fi-rr-time-past",
      adminOnly: false,
    },
    {
      name: "Organization",
      path: "/organization",
      icon: "fi-rr-building",
      adminOnly: false,
    },
  ];

  // Filter nav items based on admin status
  // During SSR (before mount), show all items to prevent hydration mismatch
  // After mount, filter based on actual role
  const navItems = mounted 
    ? allNavItems.filter(item => !item.adminOnly || isAdmin)
    : allNavItems; // Show all items during SSR to prevent hydration mismatch

  const handleNavClick = (path: string) => {
    if (onNavChange) {
      onNavChange(path);
    }
  };

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
          const isActive = router.pathname === item.path || activeNav === item.path;

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
                backgroundColor: isActive
                  ? "#4b33e8"
                  : "transparent",
                background: isActive
                  ? "#4b33e8"
                  : undefined,
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
                {formatLastLogin(displayUser?.lastSignInAt)}
              </span>
            </div>
          </div>

          <div className="flex gap-2">
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
}

