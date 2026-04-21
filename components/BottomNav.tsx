import { useRouter } from "next/router";
import { useEffect, useState, useMemo, memo } from "react";
import { DashboardLevel, getUserDashboardLevel } from "@/lib/dashboardUtils";
// Removed unnecessary supabase import as we rely on props

interface BottomNavProps {
  activeNav?: string;
  userRole?: string | null;
  isSuperAdmin?: boolean;
  isClient?: boolean;
  designation?: string | null;
  employeeId?: string | null;
}

const BottomNav = memo(function BottomNav({
  activeNav,
  userRole,
  isSuperAdmin,
  isClient,
  designation,
  employeeId,
}: BottomNavProps) {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [scrollTimer, setScrollTimer] = useState<NodeJS.Timeout | null>(null);
  const [hideTimer, setHideTimer] = useState<NodeJS.Timeout | null>(null);
  const [mounted, setMounted] = useState(false);
  
  // Directly use props - AppLayout guarantees them
  // We don't need local state for role since it's passed down
  
  useEffect(() => {
    setMounted(true);
  }, []);

  // Check if user is admin or super_admin
  const isAdmin =
    mounted &&
    (userRole === "admin" ||
     userRole === "super_admin" ||
     isSuperAdmin === true);

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
    {
      id: "call-sessions",
      label: "Call Sessions",
      icon: "fi-rr-headset",
      path: "/call-sessions",
      adminOnly: true,
    },
  ];

  // Filter nav items based on admin status and client designation
  const navItems = useMemo(() => {
    const level = getUserDashboardLevel({
        role: userRole,
        designation: designation,
        isClient: isClient
    });

    return allNavItems.filter((item) => {
      // 0. Call Sessions visibility (Admin, CEO, TL)
      if (item.id === 'call-sessions') {
        if (employeeId === 'NXUS-001') return true;
        if (level === DashboardLevel.LEVEL_4_AGENT_SALES || level === DashboardLevel.UNKNOWN) return false;
        return true;
      }

      const currentDesignation = designation?.toLowerCase() || '';

      const isUserPageVisible = mounted && (
        isClient === false || 
        (isClient === true && ['ceo', 'developer'].includes(currentDesignation))
      );

      const isTeamPageVisible = mounted && (
        isClient === false || 
        (isClient === true && ['manager', 'team_leader', 'ceo', 'developer'].includes(currentDesignation))
      );

      const isAdminState = mounted && isAdmin;

      // Filter logic
      if (item.adminOnly && !isAdminState && employeeId !== 'NXUS-001') return false;
      if (item.id === 'users' && !isUserPageVisible) return false;
      if (item.id === 'team' && !isTeamPageVisible) return false;
      
      return true;
    });
  }, [mounted, isAdmin, isClient, designation, employeeId, allNavItems]);

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
          <div className="flex items-center justify-between">
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
                    activeNav === item.id || router.pathname === item.path || router.pathname === '/portal' + item.path
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
});

export default BottomNav;
