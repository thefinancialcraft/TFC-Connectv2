import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import AppLogo from "./AppLogo";
import { supabase } from "../lib/supabase";

interface SidebarProps {
  user?: {
    displayName?: string | null;
    email?: string;
    employeeId?: string | null;
    lastSignInAt?: string | null;
  };
  activeNav?: string;
  onNavChange?: (nav: string) => void;
}

export default function Sidebar({ user, activeNav = "dashboard", onNavChange }: SidebarProps) {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Logout error:", error);
      } else {
        // Clear any cached data
        if (user?.email) {
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
    if (user?.displayName) {
      return user.displayName.trim().charAt(0).toUpperCase();
    }
    if (user?.email) {
      return user.email.slice(0, 2).toUpperCase();
    }
    return "U";
  };

  const initials = getInitials();

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

  const navItems = [
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
      adminOnly: false,
    },
    {
      name: "Attendance",
      path: "/attendance",
      icon: "fi-rr-calendar-check",
      adminOnly: false,
    },
  ];

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
              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm shrink-0 shadow-md"
              style={{
                background: "#4b33e8",
              }}
            >
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p
                className="text-sm font-semibold truncate mb-0.5"
                style={{ color: "#263238", fontFamily: "'Poppins', sans-serif" }}
              >
                {user?.displayName || user?.email?.split("@")[0] || "User"}
              </p>
              <p
                className="text-xs truncate"
                style={{ color: "#787E9D", fontFamily: "'Roboto', sans-serif" }}
              >
                {user?.email || "user@example.com"}
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
                {user?.employeeId || "Not assigned"}
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
                {formatLastLogin(user?.lastSignInAt)}
              </span>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => router.push("/settings")}
              className="w-8 h-8 p-0 text-xs border rounded-lg transition-all duration-300 flex items-center justify-center"
              style={{
                borderColor: "#DCDEE3",
                backgroundColor: "#FFFFFF",
                color: "#263238",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#4b33e8";
                e.currentTarget.style.backgroundColor = "#f6f5ff";
                e.currentTarget.style.color = "#4b33e8";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#DCDEE3";
                e.currentTarget.style.backgroundColor = "#FFFFFF";
                e.currentTarget.style.color = "#263238";
              }}
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
}

