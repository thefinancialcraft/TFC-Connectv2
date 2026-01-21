import { ReactNode, useState, useCallback, useEffect } from "react";
import { useRouter } from "next/router";
import Sidebar from "./Sidebar";
import Header from "./Header";
import BottomNav from "./BottomNav";
import { useUser } from "../context/UserContext";
export { useUser };
import { handleLogout } from "../lib/authService";
import { getStoredUserData } from "../lib/localStorageUtils";

interface AppLayoutProps {
  children: ReactNode;
  hideSidebar?: boolean;
  hideHeader?: boolean;
}

export default function AppLayout({ children, hideSidebar = false, hideHeader = false }: AppLayoutProps) {
  const router = useRouter();
  const { user, loading: authLoading, error, mounted } = useUser();

  // Create stableUser state with lazy initializer from localStorage to prevent flicker
  const [stableUser, setStableUser] = useState<any>(() => {
    if (typeof window === "undefined") return null;
    const cached = getStoredUserData();
    if (cached) {
      return {
        displayName: cached.user_name || cached.displayName || null,
        email: cached.email || "",
        employeeId: cached.employee_id || null,
        lastSignInAt: null,
        profilePicUrl: cached.profile_pic_url || null,
        isClient: cached.is_client,
        designation: cached.designation,
      };
    }
    return null;
  });

  // Controlled ghost-update: Update stableUser ONLY if actual user fields change
  useEffect(() => {
    if (user) {
      setStableUser((prev: any) => {
        if (!prev) {
          return {
            displayName: user.displayName || null,
            email: user.email || "",
            employeeId: user.employeeId || null,
            lastSignInAt: user.lastSignInAt || null,
            profilePicUrl: user.profilePicUrl || null,
            isClient: user.isClient,
            designation: user.designation,
          };
        }

        const hasChanged =
          prev.displayName !== (user.displayName || null) ||
          prev.email !== (user.email || "") ||
          prev.employeeId !== (user.employeeId || null) ||
          prev.lastSignInAt !== (user.lastSignInAt || null) ||
          prev.profilePicUrl !== (user.profilePicUrl || null) ||
          prev.isClient !== user.isClient ||
          prev.designation !== user.designation;

        if (hasChanged) {
          return {
            displayName: user.displayName || null,
            email: user.email || "",
            employeeId: user.employeeId || null,
            lastSignInAt: user.lastSignInAt || null,
            profilePicUrl: user.profilePicUrl || null,
            isClient: user.isClient,
            designation: user.designation,
          };
        }
        return prev;
      });
    }
  }, [user]);

  const handleLogoutClick = useCallback(async () => {
    await handleLogout(router);
  }, [router]);

  // Loading state
  if (authLoading && !mounted) {
    return (
      <div
        className="flex min-h-screen items-center justify-center"
        style={{ backgroundColor: "#f6f5f7" }}
      >
        <div className="text-center">
          <div
            className="animate-spin rounded-full h-12 w-12 border-4 border-t-transparent mx-auto mb-4"
            style={{ borderColor: "#4b33e8" }}
          ></div>
          <div className="text-lg" style={{ color: "#4b33e8" }}>
            Loading...
          </div>
        </div>
      </div>
    );
  }

  // Error/Redirect state
  if (error) {
    return (
      <div
        className="flex min-h-screen items-center justify-center"
        style={{ backgroundColor: "#f6f5f7" }}
      >
        <div className="text-center">
          <div className="text-lg mb-4 text-red-500">{error}</div>
          <div className="text-sm" style={{ color: "#4b33e8" }}>
            Redirecting to login...
          </div>
        </div>
      </div>
    );
  }

  // Determine role props
  const userRole = user?.role || null;

  return (
    <div
      className="flex min-h-screen w-full overflow-x-hidden"
      style={{ backgroundColor: "#f6f5f7", maxWidth: "100vw" }}
    >
      <style>{`
        .recharts-wrapper:focus, .recharts-surface:focus { outline: none !important; }
        button:focus { outline: none !important; }
        .recharts-area-rectangle:focus, .recharts-bar-rectangle:focus, .recharts-pie-sector:focus { outline: none !important; }
      `}</style>
      
      {/* Left Sidebar */}
      {!hideSidebar && (
        <Sidebar
          user={stableUser}
          userRole={userRole}
        />
      )}

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col ${!hideSidebar ? 'lg:ml-56' : ''} w-full min-w-0 overflow-x-hidden`}>
        {/* Top Header */}
        {!hideHeader && (
          <Header
            user={stableUser}
            onLogout={handleLogoutClick}
          />
        )}

        {/* Main Page Content */}
        <main
          className={`flex-1 overflow-y-auto overflow-x-hidden min-w-0 max-w-full ${!hideHeader ? 'pt-[60px] lg:pt-[60px]' : ''}`}
          style={{ backgroundColor: "#f6f5f7" }}
        >
          {children}
        </main>
      </div>

      {/* Bottom Navigation - Mobile Only */}
      {!hideSidebar && (
        <BottomNav 
          activeNav={router.pathname.replace('/', '') || 'dashboard'} 
          userRole={userRole} 
          isClient={stableUser?.isClient}
          designation={stableUser?.designation}
        />
      )}
    </div>
  );
}
