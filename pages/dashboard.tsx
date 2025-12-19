import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { checkAuthAndFetchProfile, handleLogout, UserProfile } from "../lib/authService";


export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false); // Start with false to avoid spinner on page change
  const [error, setError] = useState("");
  const [activeNav, setActiveNav] = useState("dashboard");

  useEffect(() => {
    const fetchAuth = async () => {
      const result = await checkAuthAndFetchProfile();
      
      if (result.shouldRedirect) {
        router.push("/login");
        return;
      }

      if (result.error) {
        setError(result.error);
        setTimeout(() => {
          router.push("/login");
        }, 2000);
        return;
      }

      if (result.user) {
        setUser(result.user);
      }
    };

    fetchAuth();
  }, [router]);

  const handleLogoutClick = async () => {
    await handleLogout(router);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  };

  const getLastLoginText = () => {
    if (!user?.lastSignInAt) return "Just now";
    const now = new Date();
    const lastLogin = new Date(user.lastSignInAt);
    const diffMs = now.getTime() - lastLogin.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ backgroundColor: "#fcfcfc" }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-transparent mx-auto mb-4" style={{ borderColor: '#4b33e8' }}></div>
          <div className="text-lg" style={{ color: "#4b33e8" }}>Loading...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ backgroundColor: "#fcfcfc" }}>
        <div className="text-center">
          <div className="text-lg mb-4 text-red-500">{error}</div>
          <div className="text-sm" style={{ color: "#4b33e8" }}>Redirecting to login...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full overflow-x-hidden" style={{ backgroundColor: "#fcfcfc", maxWidth: "100vw" }}>
      {/* Left Sidebar */}
      <Sidebar
        user={{
          displayName: user?.displayName || null,
          email: user?.email || "",
          employeeId: user?.employeeId || null,
          lastSignInAt: user?.lastSignInAt || null,
        }}
        activeNav={activeNav}
        onNavChange={setActiveNav}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:ml-56 w-full min-w-0 overflow-x-hidden">
        {/* Top Header */}
        <Header
          user={{
            displayName: user?.displayName || null,
            email: user?.email || "",
            employeeId: user?.employeeId || null,
          }}
          onLogout={handleLogoutClick}
        />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden min-w-0 max-w-full pt-[60px] lg:pt-[60px]" style={{ backgroundColor: "#fcfcfc" }}>
          <div className="container mx-auto px-3 sm:px-4 md:px-6 py-4 space-y-4 sm:space-y-6 pb-20 sm:pb-24 lg:pb-8 max-w-7xl">
            <div className="space-y-6">
              {/* Overview Section with Gradient Background */}
              <div className="relative overflow-hidden rounded-3xl text-white" style={{ background: "#4b33e8" }}>
                <div className="absolute inset-0" style={{ background: "radial-gradient(circle at top left, rgba(255,255,255,0.28), transparent 55%)" }} />
                <div className="absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
                
                <div className="relative p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">
                  <div className="flex flex-col gap-4 sm:gap-6 lg:flex-row lg:items-center lg:justify-between">
                    <div className="space-y-2 sm:space-y-3">
                      <p className="text-xs font-semibold uppercase tracking-wider text-white/70" style={{ fontFamily: "'Poppins', sans-serif" }}>
                        Overview
                      </p>
                      <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold leading-tight" style={{ fontFamily: "'Poppins', sans-serif" }}>
                        Welcome back, {user?.displayName || "User"}!
                      </h1>
                      <p className="text-xs sm:text-sm md:text-base text-white/80 max-w-2xl" style={{ fontFamily: "'Roboto', sans-serif" }}>
                        Monitor your account status, team access, and quick entry points across the Growik workspace.
                      </p>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2 sm:px-3 py-1 rounded-full text-xs font-semibold border border-white/30 bg-white/20 text-white/90">
                          Status: {user?.accountStatus?.toLowerCase() || "active"}
                        </span>
                        <span className="px-2 sm:px-3 py-1 rounded-full text-xs font-semibold border border-white/30 bg-white/15 text-white/90">
                          Approval: {user?.approvalStatus?.toLowerCase() || "approved"}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-3 rounded-2xl border border-white/30 bg-white/10 p-4 sm:p-5 backdrop-blur-lg text-xs sm:text-sm text-white/90 w-full lg:max-w-sm">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold" style={{ fontFamily: "'Poppins', sans-serif" }}>Employee ID</span>
                        <span style={{ fontFamily: "'Roboto', sans-serif" }}>{user?.employeeId || "Not assigned"}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-semibold" style={{ fontFamily: "'Poppins', sans-serif" }}>Role</span>
                        <span style={{ fontFamily: "'Roboto', sans-serif" }}>{user?.role || "super_admin"}</span>
                      </div>
                      {user?.updatedAt && (
                        <div className="flex items-center justify-between text-xs text-white/80">
                          <span className="flex items-center gap-2">
                            <i className="fi fi-rr-clock text-sm"></i>
                            <span>Last updated</span>
                          </span>
                          <span>{formatDate(user.updatedAt)}</span>
                        </div>
                      )}
                      <button
                        onClick={() => router.push("/users")}
                      className="mt-2 w-full px-4 py-2 rounded-lg text-sm font-semibold text-white bg-white hover:bg-white/90 transition-all flex items-center justify-center gap-2"
                      style={{ backgroundColor: "#4b33e8", fontFamily: "'Poppins', sans-serif" }}
                    >
                      Manage workspace
                      <i className="fi fi-rr-arrow-right"></i>
                    </button>
                    </div>
                  </div>

                  {/* Status Cards Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                    {/* ROLE Card */}
                    <div className="relative overflow-hidden rounded-xl bg-white/90 px-4 py-4 border border-white/20 backdrop-blur transition-transform duration-200 hover:-translate-y-1">
                      <div className="absolute inset-0 opacity-[0.08] pointer-events-none" style={{ background: "linear-gradient(to bottom right, rgba(147, 51, 234, 0.9), rgba(236, 72, 153, 0.6))" }} />
                      <div className="relative flex items-start justify-between gap-3">
                        <div className="space-y-2">
                          <p className="text-[11px] uppercase tracking-wide" style={{ color: "#787E9D", fontFamily: "'Roboto', sans-serif" }}>Role</p>
                          <p className="text-lg font-semibold" style={{ color: "#263238", fontFamily: "'Poppins', sans-serif" }}>
                            {user?.role || "super_admin"}
                          </p>
                          <p className="text-[11px]" style={{ color: "#787E9D", fontFamily: "'Roboto', sans-serif" }}>
                            {user?.role === "super_admin" ? "Full platform authority" : "Current access level"}
                          </p>
                        </div>
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl text-white" style={{ background: "linear-gradient(to bottom right, rgba(147, 51, 234, 0.9), rgba(236, 72, 153, 0.6))" }}>
                          <i className="fi fi-rr-shield-check text-xl"></i>
                        </div>
                      </div>
                    </div>

                    {/* APPROVAL Card */}
                    <div className="relative overflow-hidden rounded-xl bg-white/90 px-4 py-4 border border-white/20 backdrop-blur transition-transform duration-200 hover:-translate-y-1">
                      <div className="absolute inset-0 opacity-[0.08] pointer-events-none" style={{ background: "linear-gradient(to bottom right, rgba(99, 102, 241, 0.9), rgba(59, 130, 246, 0.6))" }} />
                      <div className="relative flex items-start justify-between gap-3">
                        <div className="space-y-2">
                          <p className="text-[11px] uppercase tracking-wide" style={{ color: "#787E9D", fontFamily: "'Roboto', sans-serif" }}>Approval</p>
                          <p className="text-lg font-semibold capitalize" style={{ color: "#263238", fontFamily: "'Poppins', sans-serif" }}>
                            {user?.approvalStatus || "approved"}
                          </p>
                          <p className="text-[11px]" style={{ color: "#787E9D", fontFamily: "'Roboto', sans-serif" }}>
                            {user?.approvalStatus === "approved" ? "Enjoy full workspace access" : "Awaiting admin review"}
                          </p>
                        </div>
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl text-white" style={{ background: "linear-gradient(to bottom right, rgba(99, 102, 241, 0.9), rgba(59, 130, 246, 0.6))" }}>
                          <i className="fi fi-rr-check text-xl"></i>
                        </div>
                      </div>
                    </div>

                    {/* ACCOUNT STATUS Card */}
                    <div className="relative overflow-hidden rounded-xl bg-white/90 px-4 py-4 border border-white/20 backdrop-blur transition-transform duration-200 hover:-translate-y-1">
                      <div className="absolute inset-0 opacity-[0.08] pointer-events-none" style={{ background: "linear-gradient(to bottom right, rgba(16, 185, 129, 0.9), rgba(132, 204, 22, 0.6))" }} />
                      <div className="relative flex items-start justify-between gap-3">
                        <div className="space-y-2">
                          <p className="text-[11px] uppercase tracking-wide" style={{ color: "#787E9D", fontFamily: "'Roboto', sans-serif" }}>Account Status</p>
                          <p className="text-lg font-semibold capitalize" style={{ color: "#263238", fontFamily: "'Poppins', sans-serif" }}>
                            {user?.accountStatus || "active"}
                          </p>
                          <p className="text-[11px]" style={{ color: "#787E9D", fontFamily: "'Roboto', sans-serif" }}>
                            {user?.accountStatus === "active" ? "All systems operational" : "Action required"}
                          </p>
                        </div>
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl text-white" style={{ background: "linear-gradient(to bottom right, rgba(16, 185, 129, 0.9), rgba(132, 204, 22, 0.6))" }}>
                          <i className="fi fi-rr-chart-line-up text-xl"></i>
                        </div>
                      </div>
                    </div>

                    {/* EMPLOYEE ID Card */}
                    <div className="relative overflow-hidden rounded-xl bg-white/90 px-4 py-4 border border-white/20 backdrop-blur transition-transform duration-200 hover:-translate-y-1">
                      <div className="absolute inset-0 opacity-[0.08] pointer-events-none" style={{ background: "linear-gradient(to bottom right, rgba(14, 165, 233, 0.9), rgba(6, 182, 212, 0.6))" }} />
                      <div className="relative flex items-start justify-between gap-3">
                        <div className="space-y-2">
                          <p className="text-[11px] uppercase tracking-wide" style={{ color: "#787E9D", fontFamily: "'Roboto', sans-serif" }}>Employee ID</p>
                          <p className="text-lg font-semibold" style={{ color: "#263238", fontFamily: "'Poppins', sans-serif" }}>
                            {user?.employeeId || "Not assigned"}
                          </p>
                          <p className="text-[11px]" style={{ color: "#787E9D", fontFamily: "'Roboto', sans-serif" }}>
                            {user?.employeeId === "Not assigned" ? "Generate after approval" : "Internal reference"}
                          </p>
                        </div>
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl text-white" style={{ background: "linear-gradient(to bottom right, rgba(14, 165, 233, 0.9), rgba(6, 182, 212, 0.6))" }}>
                          <i className="fi fi-rr-users text-xl"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Account Insights and Quick Actions */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                {/* Account Insights */}
                <div className="lg:col-span-2 rounded-xl border-none bg-white/95 backdrop-blur shadow-sm">
                  <div className="p-4 sm:p-5 md:p-6 space-y-4 sm:space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-lg font-semibold" style={{ color: "#263238", fontFamily: "'Poppins', sans-serif" }}>
                          Account Insights
                        </h2>
                        <p className="text-sm" style={{ color: "#787E9D", fontFamily: "'Roboto', sans-serif" }}>
                          Quick information about your current workspace access.
                        </p>
                      </div>
                      <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase" style={{ 
                        backgroundColor: user?.accountStatus === "active" ? "#10B981" : "#EF4444",
                        color: "#FFFFFF"
                      }}>
                        {user?.accountStatus?.toUpperCase() || "ACTIVE"}
                      </span>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="rounded-2xl border p-3 sm:p-4 space-y-2 sm:space-y-3" style={{ borderColor: "#E0E0E0", backgroundColor: "#FAFAFA" }}>
                        <h3 className="text-sm font-semibold" style={{ color: "#263238", fontFamily: "'Poppins', sans-serif" }}>
                          Profile Summary
                        </h3>
                        <div className="space-y-2 text-sm" style={{ color: "#787E9D", fontFamily: "'Roboto', sans-serif" }}>
                          <div className="flex items-center justify-between">
                            <span>Name</span>
                            <span className="font-medium" style={{ color: "#263238" }}>{user?.displayName || "N/A"}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Email</span>
                            <span className="font-medium" style={{ color: "#263238" }}>{user?.email || "-"}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Contact</span>
                            <span className="font-medium" style={{ color: "#263238" }}>Not provided</span>
                          </div>
                        </div>
                      </div>
                      <div className="rounded-2xl border p-3 sm:p-4 space-y-2 sm:space-y-3" style={{ borderColor: "#E0E0E0", backgroundColor: "#FAFAFA" }}>
                        <h3 className="text-sm font-semibold" style={{ color: "#263238", fontFamily: "'Poppins', sans-serif" }}>
                          Status Details
                        </h3>
                        <div className="space-y-2 text-sm" style={{ color: "#787E9D", fontFamily: "'Roboto', sans-serif" }}>
                          <div className="flex items-center justify-between">
                            <span>Account Status</span>
                            <span className="font-medium capitalize" style={{ color: "#263238" }}>{user?.accountStatus || "active"}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Approval</span>
                            <span className="font-medium capitalize" style={{ color: "#263238" }}>{user?.approvalStatus || "approved"}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="rounded-xl border-none bg-white/95 backdrop-blur shadow-sm">
                  <div className="p-4 sm:p-5 md:p-6 space-y-4 sm:space-y-5">
                    <h2 className="text-lg font-semibold" style={{ color: "#263238", fontFamily: "'Poppins', sans-serif" }}>
                      Quick Actions
                    </h2>
                    <div className="flex flex-col gap-3">
                      <button
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border transition-all text-left hover:bg-indigo-50/90"
                        style={{ 
                          borderColor: "#E0E0E0", 
                          backgroundColor: "#FAFAFA",
                          color: "#263238",
                          fontFamily: "'Poppins', sans-serif"
                        }}
                        onClick={() => router.push("/users")}
                      >
                        <i className="fi fi-rr-users text-lg" style={{ color: "#4b33e8" }}></i>
                        <span>Manage Users</span>
                      </button>
                      <button
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border transition-all text-left hover:bg-indigo-50/90"
                        style={{ 
                          borderColor: "#E0E0E0", 
                          backgroundColor: "#FAFAFA",
                          color: "#263238",
                          fontFamily: "'Poppins', sans-serif"
                        }}
                        onClick={() => router.push("/contract")}
                      >
                        <i className="fi fi-rr-document text-lg" style={{ color: "#4b33e8" }}></i>
                        <span>View Contracts</span>
                      </button>
                      <button
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border transition-all text-left hover:bg-indigo-50/90"
                        style={{ 
                          borderColor: "#E0E0E0", 
                          backgroundColor: "#FAFAFA",
                          color: "#263238",
                          fontFamily: "'Poppins', sans-serif"
                        }}
                        onClick={() => router.push("/influencer")}
                      >
                        <i className="fi fi-rr-star text-lg" style={{ color: "#4b33e8" }}></i>
                        <span>Influencer Hub</span>
                      </button>
                    </div>
                    <div className="rounded-2xl border p-4 space-y-3" style={{ borderColor: "#FEE2E2", backgroundColor: "#FEF2F2" }}>
                      <div className="flex items-center gap-2">
                        <i className="fi fi-rr-exit text-base" style={{ color: "#EF4444" }}></i>
                        <span className="text-sm font-semibold" style={{ color: "#EF4444", fontFamily: "'Poppins', sans-serif" }}>
                          Need to sign out?
                        </span>
                      </div>
                      <p className="text-sm" style={{ color: "#EF4444", fontFamily: "'Roboto', sans-serif" }}>
                        Securely log out of your workspace when leaving the desk.
                      </p>
                      <button
                        onClick={handleLogoutClick}
                        className="w-full px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all hover:opacity-90"
                        style={{ backgroundColor: "#EF4444", fontFamily: "'Poppins', sans-serif" }}
                      >
                        Sign out
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
