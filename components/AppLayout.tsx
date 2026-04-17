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

interface AppLayoutProps {
  children: ReactNode;
  hideSidebar?: boolean;
  hideHeader?: boolean;
}

export default function AppLayout({ children, hideSidebar = false, hideHeader = false }: AppLayoutProps) {
  const router = useRouter();
  const { user, loading: authLoading, error, mounted, statusMessage, sessionExpired } = useUser();

  const handleLogoutClick = useCallback(async () => {
    await handleLogout(router);
  }, [router]);

  // 🛰️ Sentinel: Track Page Visits
  // NOTE: This must stay ABOVE any early returns to satisfy React Hook Rules
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

  // Session Expired UI logic
  // NOTE: Conditional rendering happens AFTER all hooks are declared
  if (sessionExpired) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center bg-[#f6f5ff] p-4 text-center">
        <div className="max-w-md w-full bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-white animate-in zoom-in duration-300">
          <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-[#263238] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>Session Expired</h2>
          <p className="text-[#787E9D] mb-8">For your security, your session has timed out. Please refresh to re-authenticate and continue your work.</p>
          
          <button
            onClick={() => {
                sessionStorage.clear();
                localStorage.clear();
                window.location.href = '/portal/login';
            }}
            className="w-full bg-[#4b33e8] hover:bg-[#3b27c2] text-white font-bold py-4 px-6 rounded-2xl flex items-center justify-center gap-3 transition-all transform active:scale-95 shadow-lg shadow-purple-200"
          >
            Refresh & Login
          </button>
        </div>
      </div>
    );
  }

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
          employeeId={user?.employeeId}
        />
      )}

      {/* Global Utility Sidebar */}
      <UtilitySidebar />
    </div>
  );
}
