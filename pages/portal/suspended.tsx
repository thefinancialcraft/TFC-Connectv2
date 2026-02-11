import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import AppLayout, { useUser } from "@/components/AppLayout";
import { supabase } from "@/lib/supabase";
import { handleLogout } from "@/lib/authService";
import AppLogo from "@/components/AppLogo";


const Suspended = () => {
  const router = useRouter();
  const { user, mounted } = useUser();
  const [error, setError] = useState("");


  const handleBackToLogin = async () => {
    try {
      await handleLogout(router);
    } catch (error) {
      console.error("Error signing out:", error);
      router.push("/login");
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return "bg-red-50 text-red-700 border-red-100";
      case 'user':
        return "bg-blue-50 text-blue-700 border-blue-100";
      default:
        return "bg-gray-50 text-gray-700 border-gray-100";
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Admin';
      case 'user':
        return 'User';
      case 'super_admin':
        return 'Super Admin';
      default:
        return role;
    }
  };

  // Show loading spinner
  if (!mounted || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#e7e3ff" }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600" style={{ fontFamily: "'Roboto', sans-serif" }}>Loading your account status...</p>
        </div>
      </div>
    );
  }


  return (
    <AppLayout hideSidebar hideHeader>
      <div className="min-h-screen flex items-center justify-center py-8" style={{ backgroundColor: "#e7e3ff" }}>
      <div className="w-full max-w-2xl p-6 sm:p-8 bg-white rounded-xl shadow-lg border border-gray-100 mx-4">
        {/* Header with Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="mb-6">
            <AppLogo size="default" />
          </div>
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-50 mb-4">
            <i className="fi flex fi-rr-ban text-4xl" style={{ color: "#EF4444" }}></i>
          </div>
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Account Suspended
          </h2>
          <p className="text-gray-600 text-center max-w-md" style={{ fontFamily: "'Roboto', sans-serif" }}>
            Your account has been suspended. Please contact support for more information.
          </p>
        </div>


        {/* Status Card */}
        <div className="p-6 rounded-lg border bg-red-50 text-red-700 border-red-100 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <i className="fi flex fi-rr-ban text-2xl" style={{ color: "#EF4444" }}></i>
            <span className="font-semibold text-lg" style={{ fontFamily: "'Poppins', sans-serif" }}>Suspension Notice</span>
          </div>
          <div className="space-y-2 text-sm" style={{ fontFamily: "'Roboto', sans-serif" }}>
            <p>• Your account has been suspended indefinitely</p>
            <p>• You cannot access the dashboard or any features</p>
            <p>• Please contact support immediately for assistance</p>
            <p>• Your account will remain suspended until further notice</p>
          </div>
        </div>

        {/* Profile Details Card */}
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
            <i className="fi flex fi-rr-user text-xl" style={{ color: "#4b33e8" }}></i>
            Profile Details
          </h3>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <i className="fi flex fi-rr-user text-base" style={{ color: "#787E9D" }}></i>
              <span className="text-sm font-medium" style={{ fontFamily: "'Roboto', sans-serif", color: "#263238" }}>Name:</span>
              <span className="text-sm" style={{ fontFamily: "'Roboto', sans-serif", color: "#787E9D" }}>{user.displayName || "Not set"}</span>
            </div>

            <div className="flex items-center gap-3">
              <i className="fi flex fi-rr-envelope text-base" style={{ color: "#787E9D" }}></i>
              <span className="text-sm font-medium" style={{ fontFamily: "'Roboto', sans-serif", color: "#263238" }}>Email:</span>
              <span className="text-sm" style={{ fontFamily: "'Roboto', sans-serif", color: "#787E9D" }}>{user.email}</span>
            </div>

            {user.phone && (
              <div className="flex items-center gap-3">
                <i className="fi flex fi-rr-mobile text-base" style={{ color: "#787E9D" }}></i>
                <span className="text-sm font-medium" style={{ fontFamily: "'Roboto', sans-serif", color: "#263238" }}>Contact:</span>
                <span className="text-sm" style={{ fontFamily: "'Roboto', sans-serif", color: "#787E9D" }}>{user.phone}</span>
              </div>
            )}

            {user.employeeId && (
              <div className="flex items-center gap-3">
                <i className="fi flex fi-rr-badge text-base" style={{ color: "#787E9D" }}></i>
                <span className="text-sm font-medium" style={{ fontFamily: "'Roboto', sans-serif", color: "#263238" }}>Employee ID:</span>
                <span className="text-sm" style={{ fontFamily: "'Roboto', sans-serif", color: "#787E9D" }}>{user.employeeId}</span>
              </div>
            )}

            <div className="flex items-center gap-3">
              <i className="fi flex fi-rr-briefcase text-base" style={{ color: "#787E9D" }}></i>
              <span className="text-sm font-medium" style={{ fontFamily: "'Roboto', sans-serif", color: "#263238" }}>Role:</span>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role || 'user')}`}>
                {getRoleLabel(user.role || 'user')}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <i className="fi flex fi-rr-calendar text-base" style={{ color: "#787E9D" }}></i>
              <span className="text-sm font-medium" style={{ fontFamily: "'Roboto', sans-serif", color: "#263238" }}>Account Created:</span>
              <span className="text-sm" style={{ fontFamily: "'Roboto', sans-serif", color: "#787E9D" }}>
                {user.createdAt ? (() => {
                  const date = new Date(user.createdAt);
                  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
                  return `${monthNames[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
                })() : '—'}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="text-center space-y-4">
          <button
            onClick={handleBackToLogin}
            className="px-8 py-3 rounded-lg text-white transition hover:opacity-90"
            style={{ backgroundColor: "#EF4444", fontFamily: "'Poppins', sans-serif" }}
          >
            Back to Login
          </button>

          <p className="text-gray-500 text-sm" style={{ fontFamily: "'Roboto', sans-serif" }}>
            Please contact support immediately to resolve this issue.
          </p>
        </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Suspended;

