import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

interface BottomNavProps {
  activeNav?: string;
  userRole?: string | null;
  isSuperAdmin?: boolean;
}

export default function BottomNav({
  activeNav,
  userRole,
  isSuperAdmin,
}: BottomNavProps) {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [scrollTimer, setScrollTimer] = useState<NodeJS.Timeout | null>(null);
  const [hideTimer, setHideTimer] = useState<NodeJS.Timeout | null>(null);
  const [mounted, setMounted] = useState(false);
  const [currentUserRole, setCurrentUserRole] = useState<string | null>(
    userRole || null
  );
  const [currentIsSuperAdmin, setCurrentIsSuperAdmin] = useState<
    boolean | undefined
  >(isSuperAdmin);

  // Fetch user role from database if not provided
  useEffect(() => {
    setMounted(true);
    if (!currentUserRole) {
      const fetchUserRole = async () => {
        try {
          const {
            data: { session },
          } = await supabase.auth.getSession();
          if (session) {
            const { data: userProfile } = await supabase
              .from("user_profiles")
              .select("role, super_admin")
              .eq("user_id", session.user.id)
              .single();

            if (userProfile) {
              setCurrentUserRole(userProfile.role);
              setCurrentIsSuperAdmin(userProfile.super_admin || false);
            }
          }
        } catch (err) {
          console.error("Error fetching user role in BottomNav:", err);
        }
      };
      fetchUserRole();
    } else if (userRole) {
      setCurrentUserRole(userRole);
    }
    if (isSuperAdmin !== undefined) {
      setCurrentIsSuperAdmin(isSuperAdmin);
    }
  }, [userRole, isSuperAdmin, currentUserRole]);

  // Check if user is admin or super_admin
  const isAdmin =
    mounted &&
    (currentUserRole === "admin" ||
      currentUserRole === "super_admin" ||
      currentIsSuperAdmin === true);

  const allNavItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: "fi-rr-home",
      path: "/dashboard",
      adminOnly: false,
    },
    {
      id: "users",
      label: "Users",
      icon: "fi-rr-users",
      path: "/users",
      adminOnly: true,
    },
    {
      id: "customer",
      label: "Customer",
      icon: "fi-rr-user-add",
      path: "/customer",
      adminOnly: false,
    },
    {
      id: "campaign",
      label: "Campaign",
      icon: "fi-rr-bullhorn",
      path: "/campaign",
      adminOnly: false,
    },
    {
      id: "activity",
      label: "Activity",
      icon: "fi-rr-time-past",
      path: "/activity",
      adminOnly: false,
    },
    {
      id: "followup",
      label: "Follow Up",
      icon: "fi-rr-calendar-clock",
      path: "/followup",
      adminOnly: false,
    },
  ];

  // Filter nav items based on admin status
  const navItems = mounted
    ? allNavItems.filter((item) => !item.adminOnly || isAdmin)
    : allNavItems;

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        // Scrolling down
        setIsVisible(false);
      } else {
        // Scrolling up
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);

      // Clear existing timers
      if (scrollTimer) {
        clearTimeout(scrollTimer);
      }
      if (hideTimer) {
        clearTimeout(hideTimer);
      }

      // Set timer to detect scroll stop (3 seconds)
      const newScrollTimer = setTimeout(() => {
        // Show navbar after 3 seconds of no scrolling
        setIsVisible(true);

        // Hide navbar after 6 more seconds
        const newHideTimer = setTimeout(() => {
          setIsVisible(false);
        }, 6000);

        setHideTimer(newHideTimer);
      }, 3000);

      setScrollTimer(newScrollTimer);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimer) clearTimeout(scrollTimer);
      if (hideTimer) clearTimeout(hideTimer);
    };
  }, [lastScrollY, scrollTimer, hideTimer]);

  const handleNavClick = (path: string) => {
    router.push(path);
  };

  return (
    <div
      className={`lg:hidden fixed left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ease-in-out ${
        isVisible ? "bottom-8" : "-bottom-24"
      }`}
      style={{ width: "90%", maxWidth: "400px" }}
    >
      {/* Blur background with rounded edges */}
      <div
        className="backdrop-blur-sm bg-white/80 shadow-2xl rounded-2xl"
        style={{ border: "1.5px solid white" }}
      >
        <div className="px-4 py-2.5">
          <div className="flex items-center justify-around gap-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.path)}
                className={`flex items-center justify-center p-3 rounded-xl transition-all ${
                  activeNav === item.id || router.pathname === item.path
                    ? "scale-110"
                    : "hover:bg-gray-100"
                }`}
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                <i
                  className={`fi flex ${item.icon} text-xl transition-colors ${
                    activeNav === item.id || router.pathname === item.path
                      ? "text-[#4b33e8]"
                      : "text-gray-600"
                  }`}
                ></i>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
