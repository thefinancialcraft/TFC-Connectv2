import { ReactNode, useState, useCallback, useEffect } from "react";
import { useRouter } from "next/router";
import Sidebar from "./Sidebar";
import Header from "./Header";
import BottomNav from "./BottomNav";
import { useUser } from "../context/UserContext";
export { useUser };
import { handleLogout } from "../lib/authService";
import { logSystemEvent } from "@/lib/monitoring";
import UtilitySidebar from "./UtilitySidebar";
import AppLogo from "./AppLogo";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { supabase } from "@/lib/supabase";
import { useCallSessionRedirect } from "@/hooks/useCallSessionRedirect";

interface AppLayoutProps {
  children: ReactNode;
  hideSidebar?: boolean;
  hideHeader?: boolean;
}

export default function AppLayout({ children, hideSidebar = false, hideHeader = false }: AppLayoutProps) {
  const router = useRouter();
  const { user, loading: authLoading, error, mounted, statusMessage } = useUser();

  // 🛡️ Global Session Guard
  useCallSessionRedirect(user?.uid);

  const handleLogoutClick = useCallback(async () => {
    await handleLogout(router);
  }, [router]);

  // 🛰️ Sentinel: Track Page Visits
  useEffect(() => {
    if (mounted && user && !router.pathname.includes('/login')) {
      logSystemEvent({
        event_type: 'READ',
        description: `Page Visit: ${router.pathname}`,
        path: router.pathname,
        user_name: user.displayName || 'User',
        organization_id: user.organization_id || undefined
      });
    }
  }, [router.pathname, user?.uid, mounted]);


  const isAuthPage = ['/portal/login', '/portal/signup', '/portal/signup-success'].includes(router.pathname);

  // Loading state: Wait for mount, auth finish, and user availability
  if (!mounted || authLoading || (!user && !isAuthPage)) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center bg-[#f6f5ff]">
        <div className="flex flex-col items-center gap-6 animate-in fade-in zoom-in duration-500">
          <div className="scale-125 mb-4">
            <AppLogo />
          </div>
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 border-4 border-[#4b33e8] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-[#263238] font-bold text-lg animate-pulse" style={{ fontFamily: "'Poppins', sans-serif" }}>
              {statusMessage || "Retrieving logged details..."}
            </p>
            <p className="text-[#787E9D] text-sm font-medium">Please wait while we sync your session</p>
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
          user={user as any}
          userRole={userRole}
          onLogout={handleLogoutClick}
        />

      )}

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col ${!hideSidebar ? 'lg:ml-52' : ''} w-full min-w-0 overflow-x-hidden`}>
        {/* Top Header */}
        {!hideHeader && (
          <Header
            user={user as any}
            onLogout={handleLogoutClick}
            hideSidebar={hideSidebar}
          />
        )}

        {/* Main Page Content */}
        <main
          className={`flex-1 overflow-y-auto overflow-x-hidden min-w-0 max-w-full ${!hideHeader ? 'pt-[60px] lg:pt-[70px]' : ''}`}
          style={{ backgroundColor: "#f6f5f7" }}
        >
          {children}
        </main>
      </div>

      {/* Bottom Navigation - Mobile Only */}
      {!hideSidebar && (
        <BottomNav 
          activeNav={router.pathname.replace('/portal', '').replace('/', '') || 'dashboard'} 
          userRole={userRole} 
          isClient={user?.isClient}
          designation={user?.designation}
        />
      )}

      {/* Global Utility Sidebar */}
      <UtilitySidebar />
    </div>
  );
}
