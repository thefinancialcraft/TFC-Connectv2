import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { checkAuthAndFetchProfile, handleLogout, UserProfile } from "../lib/authService";

export default function Users() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false); // Start with false to avoid spinner on page change
  const [error, setError] = useState("");
  const [activeNav, setActiveNav] = useState("users");

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
            <div className="space-y-4 sm:space-y-6">
              {/* Page Header */}
              <div className="bg-white rounded-xl p-4 sm:p-5 md:p-6 shadow-sm">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold" style={{ color: "#263238", fontFamily: "'Poppins', sans-serif" }}>
                  Users
                </h1>
                <p className="text-xs sm:text-sm mt-2" style={{ color: "#787E9D", fontFamily: "'Roboto', sans-serif" }}>
                  Manage and view all users in the system
                </p>
              </div>

              {/* Users Content */}
              <div className="bg-white rounded-xl p-4 sm:p-5 md:p-6 shadow-sm">
                <p className="text-xs sm:text-sm" style={{ color: "#787E9D", fontFamily: "'Roboto', sans-serif" }}>
                  Users management content will be displayed here.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

