import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import UserMenuDropdown from "../components/UserMenuDropdown";
import SignupForm from "../components/SignupForm";
import SettingsFormFields from "../components/SettingsFormFields";
import {
  checkAuthAndFetchProfile,
  handleLogout,
  UserProfile,
} from "../lib/authService";
import { getStoredUserData, storeUserData } from "../lib/localStorageUtils";
import { supabase } from "../lib/supabase";
import BottomNav from "../components/BottomNav";

interface UserStats {
  activeUsers: number;
  totalUsers: number;
  inactiveUsers: number;
  approved: number;
  pending: number;
  hold: number;
  suspend: number;
  totalSalary: number;
  averageSalary: number;
}

interface PendingUser {
  id: string;
  user_id: string;
  user_name: string | null;
  email: string | null;
  profile_pic_url: string | null;
  date_of_joining: string | null;
  employee_id: string | null;
  created_at: string | null;
}

interface AllUser {
  id: string;
  user_id: string;
  email: string | null;
  user_name: string | null;
  contact_no: string | null;
  employee_id: string | null;
  role: string | null;
  status: string | null;
  approval_status: string | null;
  super_admin: boolean | null;
  father_name: string | null;
  gender: string | null;
  pan_number: string | null;
  aadhar_card_no: string | null;
  date_of_birth: string | null;
  date_of_joining: string | null;
  in_hand_salary: number | null;
  alternate_contact: string | null;
  primary_address: string | null;
  area_pincode: string | null;
  bank_name: string | null;
  account_holder_name: string | null;
  account_number: string | null;
  ifsc_code: string | null;
  branch_pincode: string | null;
  branch_state: string | null;
  branch_city: string | null;
  blood_group: string | null;
  emergency_contact_no: string | null;
  profile_pic_url: string | null;
  pancard_url: string | null;
  aadhar_front_url: string | null;
  aadhar_back_url: string | null;
  qualification_marksheet_url: string | null;
  bank_passbook_url: string | null;
  profile_complete: boolean | null;
  created_at: string | null;
  updated_at: string | null;
  hold_start_date: string | null;
  hold_end_date: string | null;
  status_reason: string | null;
  hold_by_user_id: string | null;
  user_type: string | null;
  work_type: string | null;
  department: string | null;
  designation: string | null;
}

// Hold Countdown Component
function HoldCountdown({
  holdEndDate,
  holdByUserId,
  holdReason,
  allUsers,
}: {
  holdEndDate: string;
  holdByUserId: string | null;
  holdReason: string | null;
  allUsers: AllUser[];
}) {
  const calculateTimeLeft = (endDate: string): string => {
    try {
      const now = new Date().getTime();
      const end = new Date(endDate).getTime();
      const difference = end - now;

      if (difference <= 0) {
        return "Expired";
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      if (days > 0) {
        return `${days}d ${hours}h ${minutes}m`;
      } else if (hours > 0) {
        return `${hours}h ${minutes}m ${seconds}s`;
      } else if (minutes > 0) {
        return `${minutes}m ${seconds}s`;
      } else {
        return `${seconds}s`;
      }
    } catch (error) {
      console.error("Error calculating countdown:", error);
      return "Invalid date";
    }
  };

  const [timeLeft, setTimeLeft] = useState<string>(() =>
    calculateTimeLeft(holdEndDate)
  );

  useEffect(() => {
    const updateCountdown = () => {
      setTimeLeft(calculateTimeLeft(holdEndDate));
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [holdEndDate]);

  // Find user who put on hold
  const holdByUser = holdByUserId
    ? allUsers.find((u) => u.user_id === holdByUserId || u.id === holdByUserId)
    : null;

  return (
    <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-3">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <i className="fi flex fi-rr-clock text-orange-600 text-sm"></i>
          <span className="text-xs font-semibold text-orange-700">
            Hold Countdown
          </span>
        </div>
        <span className="text-xs font-bold text-orange-700">{timeLeft}</span>
      </div>
      {holdByUser && (
        <div
          className="text-xs text-orange-600 mb-1"
          style={{ fontFamily: "'Roboto', sans-serif" }}
        >
          <span className="font-medium">Hold by:</span>{" "}
          {holdByUser.user_name || holdByUser.employee_id || holdByUserId}
        </div>
      )}
      {holdReason && (
        <div
          className="text-xs text-orange-600"
          style={{ fontFamily: "'Roboto', sans-serif" }}
        >
          <span className="font-medium">Reason:</span> {holdReason}
        </div>
      )}
    </div>
  );
}

// Suspended Badge with Hover Tooltip Component
function SuspendedBadgeWithTooltip({ user }: { user: AllUser }) {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <div className="px-2 py-0.5 rounded-lg bg-red-100 flex items-center gap-1.5 cursor-pointer">
        <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
        <span className="text-[10px] font-semibold text-red-700">
          Suspended
        </span>
      </div>

      {/* Floating Tooltip */}
      {showTooltip && user.status_reason && (
        <div
          className="absolute z-[10000] mt-2 left-0 bg-white rounded-lg shadow-xl border border-gray-200 p-3 min-w-[250px] max-w-[300px]"
          style={{
            boxShadow: "0 10px 25px rgba(0, 0, 0, 0.15)",
          }}
        >
          <div>
            <div className="flex items-center gap-2 mb-1">
              <i className="fi flex fi-rr-info text-red-600 text-xs"></i>
              <span className="text-xs font-semibold text-gray-700">
                Reason:
              </span>
            </div>
            <div
              className="text-xs text-gray-600"
              style={{ fontFamily: "'Roboto', sans-serif" }}
            >
              {user.status_reason}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Hold Badge with Hover Tooltip Component
function HoldBadgeWithTooltip({
  user,
  allUsers,
}: {
  user: AllUser;
  allUsers: AllUser[];
}) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [timeLeft, setTimeLeft] = useState<string>("");

  useEffect(() => {
    if (!user.hold_end_date) {
      setTimeLeft("No end date");
      return;
    }

    const calculateTimeLeft = () => {
      try {
        const holdEndDate = user.hold_end_date;
        if (!holdEndDate) {
          return "No end date";
        }
        const now = new Date().getTime();
        const end = new Date(holdEndDate).getTime();
        const difference = end - now;

        if (difference <= 0) {
          return "Expired";
        }

        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor(
          (difference % (1000 * 60 * 60)) / (1000 * 60)
        );
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        if (days > 0) {
          return `${days}d ${hours}h ${minutes}m`;
        } else if (hours > 0) {
          return `${hours}h ${minutes}m ${seconds}s`;
        } else if (minutes > 0) {
          return `${minutes}m ${seconds}s`;
        } else {
          return `${seconds}s`;
        }
      } catch (error) {
        return "Invalid date";
      }
    };

    setTimeLeft(calculateTimeLeft());
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(interval);
  }, [user.hold_end_date]);

  // Find user who put on hold
  const holdByUser = user.hold_by_user_id
    ? allUsers.find(
      (u) =>
        u.user_id === user.hold_by_user_id || u.id === user.hold_by_user_id
    )
    : null;

  return (
    <div
      className="relative"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <div className="px-2 py-0.5 rounded-lg bg-orange-100 flex items-center gap-1.5 cursor-pointer">
        <div className="w-1.5 h-1.5 rounded-full bg-orange-500"></div>
        <span className="text-[10px] font-semibold text-orange-700">Hold</span>
      </div>

      {/* Floating Tooltip */}
      {showTooltip && (
        <div
          className="absolute z-[10000] mt-2 left-0 bg-white rounded-lg shadow-xl border border-gray-200 p-3 min-w-[250px] max-w-[300px]"
          style={{
            boxShadow: "0 10px 25px rgba(0, 0, 0, 0.15)",
          }}
        >
          {/* Timer */}
          <div className="mb-2">
            <div className="flex items-center gap-2 mb-1">
              <i className="fi flex fi-rr-clock text-orange-600 text-xs"></i>
              <span className="text-xs font-semibold text-gray-700">
                Time Remaining
              </span>
            </div>
            <div
              className="text-sm font-bold text-orange-600"
              style={{ fontFamily: "'Roboto', sans-serif" }}
            >
              {timeLeft}
            </div>
          </div>

          {/* Hold By */}
          {holdByUser && (
            <div className="mb-2">
              <div className="text-xs font-semibold text-gray-700 mb-0.5">
                Hold by:
              </div>
              <div
                className="text-xs text-gray-600"
                style={{ fontFamily: "'Roboto', sans-serif" }}
              >
                {holdByUser.user_name ||
                  holdByUser.employee_id ||
                  user.hold_by_user_id}
              </div>
            </div>
          )}

          {/* Reason */}
          {user.status_reason && (
            <div>
              <div className="text-xs font-semibold text-gray-700 mb-0.5">
                Reason:
              </div>
              <div
                className="text-xs text-gray-600"
                style={{ fontFamily: "'Roboto', sans-serif" }}
              >
                {user.status_reason}
              </div>
            </div>
          )}

          {/* Arrow */}
          <div className="absolute -top-1 left-4 w-2 h-2 bg-white border-l border-t border-gray-200 transform rotate-45"></div>
        </div>
      )}
    </div>
  );
}

export default function Users() {
  const router = useRouter();
  // Initialize with cached data from localStorage to show previous data immediately (ghost update)
  const [user, setUser] = useState<UserProfile | null>(() => {
    const cachedData = getStoredUserData();
    if (cachedData) {
      return {
        uid: cachedData.user_id || "",
        displayName: cachedData.user_name || cachedData.displayName || null,
        email: cachedData.email || "",
        phone: null, // Will be updated from API
        providers: [],
        providerType: null,
        createdAt: "",
        lastSignInAt: null,
        employeeId: cachedData.employee_id || null,
        role: cachedData.role || null,
        approvalStatus: null, // Will be updated from API
        accountStatus: null, // Will be updated from API
        updatedAt: null, // Will be updated from API
        profilePicUrl: cachedData.profile_pic_url || null,
      };
    }
    return null;
  });
  const [isClient, setIsClient] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeNav, setActiveNav] = useState("users");
  const [userStats, setUserStats] = useState<UserStats>({
    activeUsers: 0,
    totalUsers: 0,
    inactiveUsers: 0,
    approved: 0,
    pending: 0,
    hold: 0,
    suspend: 0,
    totalSalary: 0,
    averageSalary: 0,
  });

  // State for designation, work type, and department statistics
  const [designationStats, setDesignationStats] = useState<
    Record<string, number>
  >({});
  const [workTypeStats, setWorkTypeStats] = useState<Record<string, number>>(
    {}
  );
  const [departmentStats, setDepartmentStats] = useState<
    Record<string, number>
  >({});
  const [loadingStats, setLoadingStats] = useState(true);
  const [animatedStats, setAnimatedStats] = useState<UserStats>({
    activeUsers: 0,
    totalUsers: 0,
    inactiveUsers: 0,
    approved: 0,
    pending: 0,
    hold: 0,
    suspend: 0,
    totalSalary: 0,
    averageSalary: 0,
  });
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);
  const [loadingPendingUsers, setLoadingPendingUsers] = useState(true);
  const [viewType, setViewType] = useState<"grid" | "list">("grid");
  const [allUsers, setAllUsers] = useState<AllUser[]>([]);
  const [loadingAllUsers, setLoadingAllUsers] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [menuPosition, setMenuPosition] = useState<{
    top: number;
    right: number;
  } | null>(null);
  const menuRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const buttonRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});
  const [openApprovalDropdown, setOpenApprovalDropdown] = useState<
    string | null
  >(null);
  const [openWorkTypeDropdown, setOpenWorkTypeDropdown] = useState<
    string | null
  >(null);
  const [openUserTypeDropdown, setOpenUserTypeDropdown] = useState<
    string | null
  >(null);
  const [openRoleDropdown, setOpenRoleDropdown] = useState<string | null>(null);
  const [openDepartmentDropdown, setOpenDepartmentDropdown] = useState<
    string | null
  >(null);
  const [openDesignationDropdown, setOpenDesignationDropdown] = useState<
    string | null
  >(null);
  const [monthlyActiveUsers, setMonthlyActiveUsers] = useState<
    { month: string; count: number }[]
  >([]);
  const [monthlyTotalUsers, setMonthlyTotalUsers] = useState<
    { month: string; count: number }[]
  >([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [signupError, setSignupError] = useState("");
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteName, setInviteName] = useState("");
  const [inviteLoading, setInviteLoading] = useState(false);
  const [inviteError, setInviteError] = useState("");
  const [inviteSuccess, setInviteSuccess] = useState(false);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [approvalUserData, setApprovalUserData] = useState<AllUser | null>(
    null
  );
  const [approvalFormData, setApprovalFormData] = useState({
    role: "user" as "user" | "admin" | "super_admin",
    department: "sales" as
      | "sales"
      | "renewal"
      | "backend"
      | "management"
      | "service",
    designation: "agent" as
      | "agent"
      | "manager"
      | "faculty_staff"
      | "team_leader"
      | "ceo"
      | "developer",
    work_type: "on_site" as "remote" | "on_site",
    user_type: "employee" as "employee" | "posp_agent",
    status: "active" as "active" | "inactive",
  });
  const [showHoldModal, setShowHoldModal] = useState(false);
  const [holdUserData, setHoldUserData] = useState<AllUser | null>(null);
  const [holdFormData, setHoldFormData] = useState({
    duration: "1" as "1" | "2" | "3" | "custom",
    customDate: "",
    customTime: "",
    reason: "",
  });
  const [showSuspendModal, setShowSuspendModal] = useState(false);
  const [suspendUserData, setSuspendUserData] = useState<AllUser | null>(null);
  const [suspendFormData, setSuspendFormData] = useState({
    reason: "",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [userTypeToggle, setUserTypeToggle] = useState<
    "all" | "employee" | "posp_agent"
  >("all");
  const [filters, setFilters] = useState({
    approval_status: "" as
      | ""
      | "approved"
      | "pending"
      | "hold"
      | "suspend"
      | "rejected",
    role: "" as "" | "user" | "admin" | "super_admin",
    department: "" as
      | ""
      | "sales"
      | "renewal"
      | "backend"
      | "management"
      | "service",
    designation: "" as
      | ""
      | "agent"
      | "manager"
      | "faculty_staff"
      | "team_leader"
      | "ceo"
      | "developer",
    work_type: "" as "" | "remote" | "on_site",
    user_type: "" as "" | "employee" | "posp_agent",
    status: "" as "" | "active" | "inactive",
  });
  const [showImportModal, setShowImportModal] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [importError, setImportError] = useState("");
  const [importSuccess, setImportSuccess] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      const {
        data: { session },
      } = await supabase.auth.getSession();
      let latestUserData = result.user;

      if (session) {
        try {
          const profileResponse = await fetch("/api/auth/user-profile", {
            headers: {
              Authorization: `Bearer ${session.access_token}`,
            },
          });
          const profileData = await profileResponse.json();

          if (profileData.success && profileData.user) {
            latestUserData = {
              ...profileData.user,
              profilePicUrl: profileData.user.profile_pic_url || null,
            };
          }
        } catch (err) {
          console.error("Error fetching latest profile:", err);
        }
      }

      // Ghost update: Compare existing data with fetched data - only update if there's a change
      setUser((prevUser) => {
        // If no previous user, set the new user
        if (!prevUser) {
          // Update localStorage with the new user data (including profile_pic_url)
          if (latestUserData.uid) {
            const cachedData = getStoredUserData();
            const userDataToStore = {
              user_id: latestUserData.uid,
              email: latestUserData.email || "",
              user_name:
                latestUserData.displayName || cachedData?.user_name || "",
              employee_id:
                latestUserData.employeeId || cachedData?.employee_id || "",
              role: latestUserData.role || cachedData?.role || "user",
              profile_pic_url: latestUserData.profilePicUrl || null,
              displayName: latestUserData.displayName || undefined,
              session_token: cachedData?.session_token,
              refresh_token: cachedData?.refresh_token,
            };
            storeUserData(userDataToStore);
          }
          return latestUserData;
        }

        // Check if user data has actually changed (compare critical fields for UI update)
        const hasChanged =
          prevUser.displayName !== latestUserData.displayName ||
          prevUser.employeeId !== latestUserData.employeeId ||
          prevUser.email !== latestUserData.email ||
          prevUser.approvalStatus !== latestUserData.approvalStatus ||
          prevUser.accountStatus !== latestUserData.accountStatus ||
          prevUser.role !== latestUserData.role ||
          prevUser.phone !== latestUserData.phone ||
          prevUser.profilePicUrl !== latestUserData.profilePicUrl;

        // Only update if data has actually changed (prevents unnecessary re-renders and UI flickering)
        // This ensures smooth ghost update - UI stays stable if data is same, updates only when changed
        if (hasChanged) {
          // Update localStorage with the new user data (including profile_pic_url)
          if (latestUserData.uid) {
            const cachedData = getStoredUserData();
            const userDataToStore = {
              user_id: latestUserData.uid,
              email: latestUserData.email || "",
              user_name:
                latestUserData.displayName || cachedData?.user_name || "",
              employee_id:
                latestUserData.employeeId || cachedData?.employee_id || "",
              role: latestUserData.role || cachedData?.role || "user",
              profile_pic_url: latestUserData.profilePicUrl || null,
              displayName: latestUserData.displayName || undefined,
              session_token: cachedData?.session_token,
              refresh_token: cachedData?.refresh_token,
            };
            storeUserData(userDataToStore);
          }
          return latestUserData;
        }

        // Return previous user object to prevent unnecessary re-render and UI update
        // This keeps showing cached/existing data if fetched data is same (ghost update)
        return prevUser;
      });

      // Check if user is admin or super_admin - fetch from database
      try {
        const {
          data: { session: checkSession },
        } = await supabase.auth.getSession();
        if (checkSession) {
          const { data: userProfile } = await supabase
            .from("user_profiles")
            .select("role, super_admin")
            .eq("user_id", checkSession.user.id)
            .single();

          const userRole = userProfile?.role || latestUserData.role;
          const isSuperAdmin = userProfile?.super_admin || false;

          if (
            userRole !== "admin" &&
            userRole !== "super_admin" &&
            !isSuperAdmin
          ) {
            console.log("Access denied: User is not admin or super_admin");
            setError(
              "Access denied. Only administrators can access this page."
            );
            setTimeout(() => {
              router.push("/dashboard");
            }, 2000);
            return;
          }
        }
      } catch (err) {
        console.error("Error checking user role:", err);
        // If we can't check role, deny access for safety
        setError("Access denied. Unable to verify permissions.");
        setTimeout(() => {
          router.push("/dashboard");
        }, 2000);
        return;
      }

      setUser((prevUser) => {
        if (!prevUser) {
          // Update localStorage with the new user data (including profile_pic_url)
          if (latestUserData.uid) {
            const cachedData = getStoredUserData();
            const userDataToStore = {
              user_id: latestUserData.uid,
              email: latestUserData.email || "",
              user_name:
                latestUserData.displayName || cachedData?.user_name || "",
              employee_id:
                latestUserData.employeeId || cachedData?.employee_id || "",
              role: latestUserData.role || cachedData?.role || "user",
              profile_pic_url: latestUserData.profilePicUrl || null,
              displayName: latestUserData.displayName || undefined,
              session_token: cachedData?.session_token,
              refresh_token: cachedData?.refresh_token,
            };
            storeUserData(userDataToStore);
          }
          return latestUserData;
        }

        const hasChanged =
          prevUser.displayName !== latestUserData.displayName ||
          prevUser.employeeId !== latestUserData.employeeId ||
          prevUser.email !== latestUserData.email ||
          prevUser.approvalStatus !== latestUserData.approvalStatus ||
          prevUser.accountStatus !== latestUserData.accountStatus ||
          prevUser.role !== latestUserData.role ||
          prevUser.phone !== latestUserData.phone ||
          prevUser.profilePicUrl !== latestUserData.profilePicUrl;

        if (hasChanged) {
          // Update localStorage with the new user data (including profile_pic_url)
          if (latestUserData.uid) {
            const cachedData = getStoredUserData();
            const userDataToStore = {
              user_id: latestUserData.uid,
              email: latestUserData.email || "",
              user_name:
                latestUserData.displayName || cachedData?.user_name || "",
              employee_id:
                latestUserData.employeeId || cachedData?.employee_id || "",
              role: latestUserData.role || cachedData?.role || "user",
              profile_pic_url: latestUserData.profilePicUrl || null,
              displayName: latestUserData.displayName || undefined,
              session_token: cachedData?.session_token,
              refresh_token: cachedData?.refresh_token,
            };
            storeUserData(userDataToStore);
          }
          return latestUserData;
        }

        return prevUser;
      });
    }
  };

  const fetchMonthlyUserData = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        return;
      }

      // Build query based on userTypeToggle
      let query = supabase
        .from("user_profiles")
        .select("status, created_at, user_type");

      if (userTypeToggle === "employee") {
        query = query.eq("user_type", "employee");
      } else if (userTypeToggle === "posp_agent") {
        query = query.eq("user_type", "posp_agent");
      }

      const { data: allUsersData, error: fetchError } = await query;

      if (fetchError) {
        console.error("Error fetching monthly user data:", fetchError);
        return;
      }

      if (allUsersData) {
        // Get last 6 months
        const months: { month: string; count: number }[] = [];
        const activeMonths: { month: string; count: number }[] = [];

        for (let i = 5; i >= 0; i--) {
          const date = new Date();
          date.setMonth(date.getMonth() - i);
          const monthNames = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
          ];
          const monthKey = `${monthNames[date.getMonth()]
            } ${date.getFullYear()}`;
          const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
          const monthEnd = new Date(
            date.getFullYear(),
            date.getMonth() + 1,
            0,
            23,
            59,
            59
          );

          // Count total users up to this month
          const totalCount = allUsersData.filter((u) => {
            if (!u.created_at) return false;
            const userDate = new Date(u.created_at);
            return userDate <= monthEnd;
          }).length;

          // Count active users up to this month
          const activeCount = allUsersData.filter((u) => {
            if (!u.created_at || u.status !== "active") return false;
            const userDate = new Date(u.created_at);
            return userDate <= monthEnd;
          }).length;

          months.push({ month: monthKey, count: totalCount });
          activeMonths.push({ month: monthKey, count: activeCount });
        }

        setMonthlyTotalUsers(months);
        setMonthlyActiveUsers(activeMonths);
      }
    } catch (err) {
      console.error("Error fetching monthly user data:", err);
    }
  };

  const fetchUserStats = async () => {
    try {
      setLoadingStats(true);
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        setLoadingStats(false);
        return;
      }

      // Build query based on userTypeToggle
      let query = supabase
        .from("user_profiles")
        .select("status, approval_status, in_hand_salary, user_type");

      if (userTypeToggle === "employee") {
        query = query.eq("user_type", "employee");
      } else if (userTypeToggle === "posp_agent") {
        query = query.eq("user_type", "posp_agent");
      }

      const { data: allUsers, error: fetchError } = await query;

      if (fetchError) {
        console.error("Error fetching user stats:", fetchError);
        setLoadingStats(false);
        return;
      }

      if (allUsers) {
        const salaries = allUsers
          .map((u) => parseFloat(u.in_hand_salary || "0"))
          .filter((s) => !isNaN(s) && s > 0);
        const totalSalary = salaries.reduce((sum, s) => sum + s, 0);
        const averageSalary =
          salaries.length > 0 ? totalSalary / salaries.length : 0;

        const stats: UserStats = {
          activeUsers: allUsers.filter((u) => u.status === "active").length,
          totalUsers: allUsers.length,
          inactiveUsers: allUsers.filter((u) => u.status !== "active").length,
          approved: allUsers.filter((u) => u.approval_status === "approved")
            .length,
          pending: allUsers.filter((u) => u.approval_status === "pending")
            .length,
          hold: allUsers.filter((u) => u.approval_status === "hold").length,
          suspend: allUsers.filter((u) => u.approval_status === "suspend")
            .length,
          totalSalary: totalSalary,
          averageSalary: averageSalary,
        };

        setUserStats(stats);

        // Update animated stats directly without animation
        setAnimatedStats(stats);
      }
    } catch (err) {
      console.error("Error fetching user stats:", err);
    } finally {
      setLoadingStats(false);
    }
  };

  // Fetch designation, work type, and department statistics
  const fetchCategoryStats = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        return;
      }

      // Build query based on userTypeToggle
      let query = supabase
        .from("user_profiles")
        .select("designation, work_type, department, user_type");

      if (userTypeToggle === "employee") {
        query = query.eq("user_type", "employee");
      } else if (userTypeToggle === "posp_agent") {
        query = query.eq("user_type", "posp_agent");
      }

      const { data: users, error: fetchError } = await query;

      if (fetchError) {
        console.error("Error fetching category stats:", fetchError);
        return;
      }

      if (users) {
        // Calculate designation stats
        const designationCounts: Record<string, number> = {};
        users.forEach((user) => {
          const designation = user.designation || "Not Assigned";
          designationCounts[designation] =
            (designationCounts[designation] || 0) + 1;
        });
        setDesignationStats(designationCounts);

        // Calculate work type stats
        const workTypeCounts: Record<string, number> = {};
        users.forEach((user) => {
          const workType = user.work_type || "Not Assigned";
          workTypeCounts[workType] = (workTypeCounts[workType] || 0) + 1;
        });
        setWorkTypeStats(workTypeCounts);

        // Calculate department stats
        const departmentCounts: Record<string, number> = {};
        users.forEach((user) => {
          const department = user.department || "Not Assigned";
          departmentCounts[department] =
            (departmentCounts[department] || 0) + 1;
        });
        setDepartmentStats(departmentCounts);
      }
    } catch (err) {
      console.error("Error fetching category stats:", err);
    }
  };

  const generateNextEmployeeId = async (): Promise<string> => {
    try {
      // Fetch all employee_ids that match TFC-XXX pattern
      const { data, error } = await supabase
        .from("user_profiles")
        .select("employee_id")
        .not("employee_id", "is", null)
        .like("employee_id", "TFC-%");

      if (error) {
        console.error("Error fetching employee IDs:", error);
        // If error, start from TFC-001
        return "TFC-001";
      }

      if (!data || data.length === 0) {
        // No existing employee IDs, start from TFC-001
        return "TFC-001";
      }

      // Extract numeric parts and find the maximum
      const numbers = data
        .map((item) => {
          const empId = item.employee_id;
          if (!empId || !empId.startsWith("TFC-")) return 0;
          const numPart = empId.replace("TFC-", "");
          const num = parseInt(numPart, 10);
          return isNaN(num) ? 0 : num;
        })
        .filter((num) => num > 0);

      if (numbers.length === 0) {
        return "TFC-001";
      }

      const maxNumber = Math.max(...numbers);
      const nextNumber = maxNumber + 1;

      // Format with zero padding (e.g., 1 -> 001, 12 -> 012, 123 -> 123)
      const paddedNumber = nextNumber.toString().padStart(3, "0");
      return `TFC-${paddedNumber}`;
    } catch (err) {
      console.error("Error generating employee ID:", err);
      // On error, start from TFC-001
      return "TFC-001";
    }
  };

  const fetchPendingUsers = async () => {
    try {
      setLoadingPendingUsers(true);
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        setLoadingPendingUsers(false);
        return;
      }

      // Build query based on userTypeToggle
      let query = supabase
        .from("user_profiles")
        .select(
          "id, user_id, user_name, email, profile_pic_url, date_of_joining, employee_id, created_at, user_type"
        )
        .eq("approval_status", "pending")
        .order("date_of_joining", { ascending: false });

      if (userTypeToggle === "employee") {
        query = query.eq("user_type", "employee");
      } else if (userTypeToggle === "posp_agent") {
        query = query.eq("user_type", "posp_agent");
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching pending users:", error);
      } else {
        setPendingUsers(data || []);
      }
    } catch (err) {
      console.error("Error fetching pending users:", err);
    } finally {
      setLoadingPendingUsers(false);
    }
  };

  // Check and auto-approve expired holds
  const checkAndApproveExpiredHolds = async () => {
    try {
      const now = new Date().toISOString();

      // Find all users with expired hold_end_date
      const { data: expiredHolds, error: fetchError } = await supabase
        .from("user_profiles")
        .select("id, hold_end_date, approval_status, status")
        .eq("approval_status", "hold")
        .not("hold_end_date", "is", null)
        .lt("hold_end_date", now);

      if (fetchError) {
        console.error("Error fetching expired holds:", fetchError);
        return;
      }

      if (expiredHolds && expiredHolds.length > 0) {
        console.log(
          `Found ${expiredHolds.length} expired hold(s), auto-approving...`
        );

        // Update all expired holds to approved and active
        const expiredIds = expiredHolds.map((u) => u.id);
        const { error: updateError } = await supabase
          .from("user_profiles")
          .update({
            approval_status: "approved",
            status: "active",
            status_reason:
              "Hold expired - account automatically approved and activated",
            hold_end_date: null,
            hold_start_date: null,
            updated_at: new Date().toISOString(),
          })
          .in("id", expiredIds);

        if (updateError) {
          console.error("Error auto-approving expired holds:", updateError);
        } else {
          console.log(
            `Successfully auto-approved ${expiredHolds.length} expired hold(s)`
          );
          // Refresh data after auto-approval
          await fetchAllUsers();
          await fetchUserStats();
        }
      }
    } catch (error) {
      console.error("Error checking expired holds:", error);
    }
  };

  const fetchAllUsers = async () => {
    try {
      setLoadingAllUsers(true);
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        setLoadingAllUsers(false);
        return;
      }

      // First, check current user's profile to see their role
      const { data: currentUserData } = await supabase
        .from("user_profiles")
        .select("role, super_admin, user_id, email")
        .eq("user_id", session.user.id)
        .single();

      console.log("Current user profile:", currentUserData);
      console.log("Current user role:", currentUserData?.role);
      console.log("Current user super_admin:", currentUserData?.super_admin);

      // Build query based on userTypeToggle
      let query = supabase
        .from("user_profiles")
        .select("*")
        .order("date_of_joining", { ascending: false });

      if (userTypeToggle === "employee") {
        query = query.eq("user_type", "employee");
      } else if (userTypeToggle === "posp_agent") {
        query = query.eq("user_type", "posp_agent");
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching all users:", error);
        console.error("Error details:", JSON.stringify(error, null, 2));
        console.error("Error code:", error.code);
        console.error("Error message:", error.message);
        setAllUsers([]);
      } else {
        console.log("Fetched all users from user page:", data);
        console.log("Total users fetched:", data?.length || 0);
        console.log(
          "User IDs fetched:",
          data?.map((u: any) => ({
            id: u.id,
            user_id: u.user_id,
            email: u.email,
          }))
        );
        // Map the data to match our interface
        const mappedData = (data || []).map((user: any) => ({
          ...user,
          user_name: user.user_name || user.name || null,
          profile_pic_url: user.profile_pic_url || user.profile_image || null,
        }));
        setAllUsers(mappedData);
      }
    } catch (err) {
      console.error("Error fetching all users:", err);
    } finally {
      setLoadingAllUsers(false);
    }
  };

  // Initialize client-side and load from localStorage
  useEffect(() => {
    setIsClient(true);
    setMounted(true);
    // Load cached data from localStorage on client-side only
    const cachedData = getStoredUserData();
    if (cachedData) {
      setUser({
        uid: cachedData.user_id || "",
        displayName: cachedData.user_name || cachedData.displayName || null,
        email: cachedData.email || "",
        phone: null,
        providers: [],
        providerType: null,
        createdAt: "",
        lastSignInAt: null,
        employeeId: cachedData.employee_id || null,
        role: cachedData.role || null,
        approvalStatus: null,
        accountStatus: null,
        updatedAt: null,
        profilePicUrl: cachedData.profile_pic_url || null,
      });
    }
  }, []);

  // Refetch data when userTypeToggle changes
  useEffect(() => {
    if (!isClient) return;

    // Refetch all data when toggle changes
    fetchAllUsers();
    fetchUserStats();
    fetchPendingUsers();
    fetchMonthlyUserData();
    fetchCategoryStats();
  }, [userTypeToggle, isClient]);

  useEffect(() => {
    if (!isClient) return; // Wait for client-side hydration

    fetchAuth();
    fetchUserStats();
    fetchPendingUsers();
    fetchAllUsers();
    fetchMonthlyUserData();
    fetchCategoryStats();
    checkAndApproveExpiredHolds();

    const handleFocus = () => {
      fetchAuth();
      fetchUserStats();
      fetchPendingUsers();
      fetchAllUsers();
      fetchMonthlyUserData();
      fetchCategoryStats();
      checkAndApproveExpiredHolds();
    };

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [router, isClient]);

  // Periodically check for expired holds (every 30 seconds)
  useEffect(() => {
    if (!isClient) return;

    const interval = setInterval(() => {
      checkAndApproveExpiredHolds();
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [isClient]);

  // Close menu and dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      // Check if any menu or dropdown is open
      if (
        openMenuId ||
        openApprovalDropdown ||
        openWorkTypeDropdown ||
        openUserTypeDropdown
      ) {
        if (openMenuId) {
          const menuElement = menuRefs.current[openMenuId];
          const buttonElement = buttonRefs.current[openMenuId];

          // Check if click is inside main menu container or button
          const isInsideMenu = menuElement && menuElement.contains(target);
          const isInsideButton =
            buttonElement && buttonElement.contains(target);

          // If click is outside both menu and button, close everything
          if (!isInsideMenu && !isInsideButton) {
            setOpenMenuId(null);
            setMenuPosition(null);
            setOpenApprovalDropdown(null);
            setOpenWorkTypeDropdown(null);
            setOpenUserTypeDropdown(null);
          }
        } else {
          // If main menu is closed but nested dropdowns might still be open, close them
          setOpenApprovalDropdown(null);
          setOpenWorkTypeDropdown(null);
          setOpenUserTypeDropdown(null);
          setOpenRoleDropdown(null);
          setOpenDepartmentDropdown(null);
        }
      }
    };

    // Add event listener
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [
    openMenuId,
    openApprovalDropdown,
    openWorkTypeDropdown,
    openUserTypeDropdown,
    openRoleDropdown,
    openDepartmentDropdown,
    openDesignationDropdown,
  ]);

  // Close menu when viewType changes
  useEffect(() => {
    setOpenMenuId(null);
    setMenuPosition(null);
  }, [viewType]);

  // Disable body scroll when menu is open
  useEffect(() => {
    if (openMenuId) {
      // Disable scroll
      document.body.style.overflow = "hidden";
    } else {
      // Enable scroll
      document.body.style.overflow = "";
    }

    return () => {
      // Cleanup: re-enable scroll when component unmounts or menu closes
      document.body.style.overflow = "";
    };
  }, [openMenuId]);

  // Update menu position on scroll/resize when menu is open
  useEffect(() => {
    if (!openMenuId || !menuPosition || viewType !== "list") return;

    const updatePosition = () => {
      const buttonId = openMenuId;
      const button = buttonRefs.current[buttonId];
      if (button) {
        const rect = button.getBoundingClientRect();
        const menuHeight = 400; // Approximate menu height (increased for dropdowns)
        const spaceBelow = window.innerHeight - rect.bottom;
        const spaceAbove = rect.top;

        // Position menu above if not enough space below, but enough space above
        const shouldPositionAbove =
          spaceBelow < menuHeight && spaceAbove > menuHeight;

        setMenuPosition({
          top: shouldPositionAbove
            ? rect.top - menuHeight - 8
            : rect.bottom + 8,
          right: window.innerWidth - rect.right,
        });
      }
    };

    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);

    return () => {
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [openMenuId, menuPosition, viewType]);

  const handleStatusChange = async (
    userId: string,
    approvalStatus: "approved" | "pending" | "hold" | "suspend" | "rejected"
  ) => {
    try {
      // If approving, show the approval modal
      if (approvalStatus === "approved") {
        try {
          const { data: fullUserData, error: fetchError } = await supabase
            .from("user_profiles")
            .select("*")
            .eq("id", userId)
            .single();

          if (fetchError) {
            console.error("Error fetching user data:", fetchError);
            alert("Failed to fetch user data");
            return;
          }

          setApprovalUserData(fullUserData as any);
          setApprovalFormData({
            role: (fullUserData.role as any) || "user",
            department: (fullUserData.department as any) || "sales",
            designation: (fullUserData.designation as any) || "agent",
            work_type: (fullUserData.work_type as any) || "on_site",
            user_type: (fullUserData.user_type as any) || "employee",
            status: (fullUserData.status as any) || "active",
          });
          setShowApprovalModal(true);
          setOpenApprovalDropdown(null);
          setOpenMenuId(null);
        } catch (err) {
          console.error("Error fetching user data:", err);
          alert("Failed to fetch user data");
        }
        return;
      }

      // If holding, show the hold modal
      if (approvalStatus === "hold") {
        try {
          const { data: fullUserData, error: fetchError } = await supabase
            .from("user_profiles")
            .select("*")
            .eq("id", userId)
            .single();

          if (fetchError) {
            console.error("Error fetching user data:", fetchError);
            alert("Failed to fetch user data");
            return;
          }

          setHoldUserData(fullUserData as any);
          setHoldFormData({
            duration: "1",
            customDate: "",
            customTime: "",
            reason: "",
          });
          setShowHoldModal(true);
          setOpenApprovalDropdown(null);
          setOpenMenuId(null);
        } catch (err) {
          console.error("Error fetching user data:", err);
          alert("Failed to fetch user data");
        }
        return;
      }

      // If suspending, show the suspend modal
      if (approvalStatus === "suspend") {
        try {
          const { data: fullUserData, error: fetchError } = await supabase
            .from("user_profiles")
            .select("*")
            .eq("id", userId)
            .single();

          if (fetchError) {
            console.error("Error fetching user data:", fetchError);
            alert("Failed to fetch user data");
            return;
          }

          setSuspendUserData(fullUserData as any);
          setSuspendFormData({
            reason: "",
          });
          setShowSuspendModal(true);
          setOpenApprovalDropdown(null);
          setOpenMenuId(null);
        } catch (err) {
          console.error("Error fetching user data:", err);
          alert("Failed to fetch user data");
        }
        return;
      }

      // For other status changes, update directly
      const { error } = await supabase
        .from("user_profiles")
        .update({ approval_status: approvalStatus })
        .eq("id", userId);

      if (error) throw error;

      // Refresh data
      await fetchAllUsers();
      await fetchPendingUsers();
      await fetchUserStats();
      setOpenApprovalDropdown(null);
    } catch (error) {
      console.error("Error updating approval status:", error);
      alert("Failed to update approval status");
    }
  };

  const getApprovalStatusLabel = (status: string | null) => {
    switch (status) {
      case "approved":
        return "Approved User";
      case "pending":
        return "Pending";
      case "hold":
        return "Hold";
      case "suspend":
        return "Suspended";
      case "rejected":
        return "Rejected";
      default:
        return "Pending";
    }
  };

  const getWorkTypeLabel = (workType: string | null) => {
    switch (workType) {
      case "on_site":
        return "On Site";
      case "remote":
        return "Remote";
      default:
        return "On Site";
    }
  };

  const getUserTypeLabel = (userType: string | null) => {
    switch (userType) {
      case "employee":
        return "Employee";
      case "posp_agent":
        return "Posp Agent";
      default:
        return "Employee";
    }
  };

  const getRoleLabel = (role: string | null) => {
    switch (role) {
      case "user":
        return "User";
      case "admin":
        return "Admin";
      case "super_admin":
        return "Super Admin";
      default:
        return "User";
    }
  };

  const getDepartmentLabel = (department: string | null) => {
    switch (department) {
      case "sales":
        return "Sales";
      case "renewal":
        return "Renewal";
      case "backend":
        return "Backend";
      case "management":
        return "Management";
      case "service":
        return "Service";
      default:
        return "Sales";
    }
  };

  const handleUserStatusChange = async (
    userId: string,
    status: "active" | "inactive"
  ) => {
    try {
      const { error } = await supabase
        .from("user_profiles")
        .update({ status: status })
        .eq("id", userId);

      if (error) throw error;

      // Refresh data
      await fetchAllUsers();
      await fetchUserStats();
    } catch (error) {
      console.error("Error updating user status:", error);
      alert("Failed to update user status");
    }
  };

  const handleWorkTypeChange = async (
    userId: string,
    workType: "remote" | "on_site"
  ) => {
    try {
      console.log("Updating work_type:", { userId, workType });
      const { data, error } = await supabase
        .from("user_profiles")
        .update({
          work_type: workType,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId)
        .select();

      if (error) {
        console.error("Supabase error updating work type:", error);
        throw error;
      }

      console.log("Successfully updated work_type:", data);

      // Refresh data
      await fetchAllUsers();
      setOpenWorkTypeDropdown(null);
    } catch (error: any) {
      console.error("Error updating work type:", error);
      alert(`Failed to update work type: ${error?.message || error}`);
    }
  };

  const handleUserTypeChange = async (
    userId: string,
    userType: "employee" | "posp_agent"
  ) => {
    try {
      console.log("Updating user_type:", { userId, userType });
      const { data, error } = await supabase
        .from("user_profiles")
        .update({
          user_type: userType,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId)
        .select();

      if (error) {
        console.error("Supabase error updating user type:", error);
        throw error;
      }

      console.log("Successfully updated user_type:", data);

      // Refresh data
      await fetchAllUsers();
      setOpenUserTypeDropdown(null);
    } catch (error: any) {
      console.error("Error updating user type:", error);
      alert(`Failed to update user type: ${error?.message || error}`);
    }
  };

  const handleRoleChange = async (
    userId: string,
    role: "user" | "admin" | "super_admin"
  ) => {
    try {
      console.log("Updating role:", { userId, role });
      const { data, error } = await supabase
        .from("user_profiles")
        .update({
          role: role,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId)
        .select();

      if (error) {
        console.error("Supabase error updating role:", error);
        throw error;
      }

      console.log("Successfully updated role:", data);

      // Refresh data
      await fetchAllUsers();
      setOpenRoleDropdown(null);
    } catch (error: any) {
      console.error("Error updating role:", error);
      alert(`Failed to update role: ${error?.message || error}`);
    }
  };

  const getDesignationLabel = (designation: string | null) => {
    switch (designation) {
      case "agent":
        return "Agent";
      case "manager":
        return "Manager";
      case "faculty_staff":
        return "Faculty Staff";
      case "team_leader":
        return "Team Leader";
      case "ceo":
        return "CEO";
      case "developer":
        return "Developer";
      default:
        return "Agent";
    }
  };

  const handleDesignationChange = async (
    userId: string,
    designation:
      | "agent"
      | "manager"
      | "faculty_staff"
      | "team_leader"
      | "ceo"
      | "developer"
  ) => {
    try {
      console.log("Updating designation:", { userId, designation });
      const { data, error } = await supabase
        .from("user_profiles")
        .update({
          designation: designation,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId)
        .select();

      if (error) {
        console.error("Supabase error updating designation:", error);
        throw error;
      }

      console.log("Successfully updated designation:", data);

      // Refresh data
      await fetchAllUsers();
      setOpenDesignationDropdown(null);
    } catch (error: any) {
      console.error("Error updating designation:", error);
      alert(`Failed to update designation: ${error?.message || error}`);
    }
  };

  const handleDepartmentChange = async (
    userId: string,
    department: "sales" | "renewal" | "backend" | "management" | "service"
  ) => {
    try {
      console.log("Updating department:", { userId, department });
      const { data, error } = await supabase
        .from("user_profiles")
        .update({
          department: department,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId)
        .select();

      if (error) {
        console.error("Supabase error updating department:", error);
        throw error;
      }

      console.log("Successfully updated department:", data);

      // Refresh data
      await fetchAllUsers();
      setOpenDepartmentDropdown(null);
    } catch (error: any) {
      console.error("Error updating department:", error);
      alert(`Failed to update department: ${error?.message || error}`);
    }
  };

  const handleCheckboxChange = (userId: string, checked: boolean) => {
    if (checked) {
      setSelectedUsers((prev) => [...prev, userId]);
    } else {
      setSelectedUsers((prev) => prev.filter((id) => id !== userId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedUsers(allUsers.map((user) => user.id));
    } else {
      setSelectedUsers([]);
    }
  };

  const exportToCSV = () => {
    if (selectedUsers.length === 0) {
      alert("Please select at least one user to export");
      return;
    }

    // Get selected users' full data
    const selectedUsersData = allUsers.filter((user) =>
      selectedUsers.includes(user.id)
    );

    // Get all columns from user_profiles table
    const columns = [
      "id",
      "user_id",
      "email",
      "user_name",
      "contact_no",
      "employee_id",
      "role",
      "status",
      "approval_status",
      "super_admin",
      "father_name",
      "gender",
      "pan_number",
      "aadhar_card_no",
      "date_of_birth",
      "date_of_joining",
      "in_hand_salary",
      "alternate_contact",
      "primary_address",
      "area_pincode",
      "bank_name",
      "account_holder_name",
      "account_number",
      "ifsc_code",
      "branch_pincode",
      "branch_state",
      "branch_city",
      "blood_group",
      "emergency_contact_no",
      "profile_pic_url",
      "pancard_url",
      "aadhar_front_url",
      "aadhar_back_url",
      "qualification_marksheet_url",
      "bank_passbook_url",
      "profile_complete",
      "created_at",
      "updated_at",
      "hold_start_date",
      "hold_end_date",
      "status_reason",
      "hold_by_user_id",
      "user_type",
      "work_type",
      "department",
      "designation",
    ];

    // Create CSV header
    const csvHeader = columns.join(",");

    // Create CSV rows
    const csvRows = selectedUsersData.map((user) => {
      return columns
        .map((column) => {
          const value = (user as any)[column];
          // Handle null/undefined values
          if (value === null || value === undefined) {
            return "";
          }
          // Handle values with commas or quotes
          if (
            typeof value === "string" &&
            (value.includes(",") || value.includes('"') || value.includes("\n"))
          ) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value;
        })
        .join(",");
    });

    // Combine header and rows
    const csvContent = [csvHeader, ...csvRows].join("\n");

    // Create blob and download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `users_export_${new Date().toISOString().split("T")[0]}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      // Get session token for API call
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        alert("You must be logged in to delete users");
        return;
      }

      // Call API to delete both profile and auth user
      const response = await fetch(`/api/auth/delete-user?userId=${userId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Failed to delete user");
        return;
      }

      // Refresh data
      await fetchAllUsers();
      await fetchUserStats();
      await fetchPendingUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Failed to delete user");
    }
  };

  const handleLogoutClick = async () => {
    await handleLogout(router);
  };

  // Filter users based on search and filters
  const getFilteredUsers = () => {
    let filtered = allUsers;

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        (user) =>
          user.user_name?.toLowerCase().includes(query) ||
          user.email?.toLowerCase().includes(query) ||
          user.employee_id?.toLowerCase().includes(query) ||
          user.contact_no?.includes(query) ||
          user.role?.toLowerCase().includes(query) ||
          user.department?.toLowerCase().includes(query) ||
          user.designation?.toLowerCase().includes(query)
      );
    }

    // Apply filters
    if (filters.approval_status) {
      filtered = filtered.filter(
        (user) => user.approval_status === filters.approval_status
      );
    }
    if (filters.role) {
      filtered = filtered.filter((user) => user.role === filters.role);
    }
    if (filters.department) {
      filtered = filtered.filter(
        (user) => user.department === filters.department
      );
    }
    if (filters.designation) {
      filtered = filtered.filter(
        (user) => user.designation === filters.designation
      );
    }
    if (filters.work_type) {
      filtered = filtered.filter(
        (user) => user.work_type === filters.work_type
      );
    }
    // Apply user type toggle filter (overrides filter dropdown user_type)
    if (userTypeToggle === "employee") {
      filtered = filtered.filter((user) => user.user_type === "employee");
    } else if (userTypeToggle === "posp_agent") {
      filtered = filtered.filter((user) => user.user_type === "posp_agent");
    } else if (filters.user_type) {
      // If toggle is 'all', use filter dropdown value
      filtered = filtered.filter(
        (user) => user.user_type === filters.user_type
      );
    }
    if (filters.status) {
      filtered = filtered.filter((user) => user.status === filters.status);
    }

    return filtered;
  };

  const filteredUsers = getFilteredUsers();

  // Get current date for display
  const getCurrentDate = () => {
    if (!mounted) return ""; // Return empty string during SSR
    const date = new Date();
    const day = date.getDate().toString().padStart(2, "0");
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const month = monthNames[date.getMonth()];
    return `${day} ${month}`;
  };

  // Format date safely for SSR (only format on client)
  const formatDate = (dateString: string | null) => {
    if (!mounted || !dateString) return "N/A";
    try {
      const date = new Date(dateString);
      const day = date.getDate();
      const monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      const month = monthNames[date.getMonth()];
      const year = date.getFullYear();
      return `${day} ${month} ${year}`;
    } catch (e) {
      return "N/A";
    }
  };

  // Format date with year first (for pending users)
  const formatDateWithYear = (dateString: string | null) => {
    if (!mounted || !dateString) return "N/A";
    try {
      const date = new Date(dateString);
      const day = date.getDate();
      const monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      const month = monthNames[date.getMonth()];
      const year = date.getFullYear();
      return `${year} ${month} ${day}`;
    } catch (e) {
      return "N/A";
    }
  };

  // Render line graph component
  const renderLineGraph = (
    data: { month: string; count: number }[],
    color: string,
    id: string
  ) => {
    if (!data || data.length === 0) return null;

    const width = 100;
    const height = 30;
    const padding = 4;
    const graphWidth = width - padding * 2;
    const graphHeight = height - padding * 2;

    const maxCount = Math.max(...data.map((d) => d.count), 1);
    const minCount = Math.min(...data.map((d) => d.count), 0);
    const range = maxCount - minCount || 1;

    const points = data.map((d, index) => {
      const x = padding + (index / (data.length - 1 || 1)) * graphWidth;
      const y =
        padding + graphHeight - ((d.count - minCount) / range) * graphHeight;
      return { x, y };
    });

    const pathD = `M ${points[0].x},${points[0].y} ${points
      .slice(1)
      .map((p) => `L ${p.x},${p.y}`)
      .join(" ")}`;
    const areaPath = `${pathD} L ${width - padding},${height - padding
      } L ${padding},${height - padding} Z`;

    return (
      <svg width={width} height={height}>
        <defs>
          <linearGradient
            id={`gradient-${id}`}
            x1="0%"
            y1="0%"
            x2="0%"
            y2="100%"
          >
            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <stop offset="100%" stopColor={color} stopOpacity="0.05" />
          </linearGradient>
        </defs>
        <path d={areaPath} fill={`url(#gradient-${id})`} />
        <path
          d={pathD}
          fill="none"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {points.map((point, index) => (
          <circle key={index} cx={point.x} cy={point.y} r="1.5" fill={color} />
        ))}
      </svg>
    );
  };

  if (loading) {
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

  return (
    <div
      className="flex min-h-screen w-full overflow-x-hidden"
      style={{ backgroundColor: "#f6f5f7", maxWidth: "100vw" }}
    >
      {/* Add User Modal */}
      {showAddUserModal && (
        <div
          className="fixed inset-0 backdrop-blur-md flex items-center justify-center p-4"
          style={{
            zIndex: 9999,
            backgroundColor: "rgba(0, 0, 0, 0.3)",
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowAddUserModal(false);
              setSignupError("");
            }
          }}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
              <h2
                className="text-xl font-semibold"
                style={{
                  color: "#263238",
                  fontFamily: "'Poppins', sans-serif",
                }}
              >
                Add New User
              </h2>
              <button
                onClick={() => {
                  setShowAddUserModal(false);
                  setSignupError("");
                }}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            <div className="px-6 py-4">
              {signupError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {signupError}
                </div>
              )}
              <SignupForm
                fromAdminPanel={true}
                onError={(error) => setSignupError(error)}
                onSuccess={() => {
                  setShowAddUserModal(false);
                  setSignupError("");
                  fetchAllUsers();
                  fetchUserStats();
                  fetchPendingUsers();
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Invite POSP Agent Modal */}
      {showInviteModal && (
        <div
          className="fixed inset-0 backdrop-blur-md flex items-center justify-center p-4"
          style={{
            zIndex: 9999,
            backgroundColor: "rgba(0, 0, 0, 0.3)",
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowInviteModal(false);
              setInviteEmail("");
              setInviteError("");
              setInviteSuccess(false);
            }
          }}
        >
          <div
            className="rounded-2xl shadow-2xl max-w-md w-full relative overflow-hidden min-h-[500px]"
            style={{
              background:
                "linear-gradient(135deg, #FF6B35 0%, #F7931E 50%, #FF8C42 100%)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative z-10 flex flex-col h-full">
              {/* Header */}
              <div className="px-6 py-4 flex items-center justify-between">
                <h2
                  className="text-xl font-semibold text-white"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  Invite POSP Agent
                </h2>
                <button
                  onClick={() => {
                    setShowInviteModal(false);
                    setInviteEmail("");
                    setInviteName("");
                    setInviteError("");
                    setInviteSuccess(false);
                  }}
                  className="text-white hover:text-gray-200 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>

              {/* Image at Top */}
              <div className="px-6 pb-4 flex items-center justify-center">
                <img
                  src="/Invite-cuate.png"
                  alt="Invite Illustration"
                  className="w-48 h-48 sm:w-56 sm:h-56 object-contain"
                />
              </div>

              {/* Content */}
              <div className="px-6 pb-6 flex flex-col flex-1">
                <div className="flex-1">
                  {inviteError && (
                    <div className="mb-4 p-3 bg-red-100/90 border border-red-300 rounded-lg text-red-800 text-sm backdrop-blur-sm">
                      {inviteError}
                    </div>
                  )}
                  {inviteSuccess && (
                    <div className="mb-4 p-3 bg-green-100/90 border border-green-300 rounded-lg text-green-800 text-sm backdrop-blur-sm">
                      Invitation email sent successfully!
                    </div>
                  )}
                  <div className="mb-4">
                    <label
                      className="block text-sm font-medium mb-2 text-white"
                      style={{ fontFamily: "'Poppins', sans-serif" }}
                    >
                      Name
                    </label>
                    <input
                      type="text"
                      value={inviteName}
                      onChange={(e) => setInviteName(e.target.value)}
                      placeholder="Enter name"
                      className="w-full px-4 py-2.5 bg-white/95 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 text-gray-700 backdrop-blur-sm"
                      style={{ fontFamily: "'Roboto', sans-serif" }}
                      disabled={inviteLoading}
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      className="block text-sm font-medium mb-2 text-white"
                      style={{ fontFamily: "'Poppins', sans-serif" }}
                    >
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      placeholder="Enter email address"
                      className="w-full px-4 py-2.5 bg-white/95 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 text-gray-700 backdrop-blur-sm"
                      style={{ fontFamily: "'Roboto', sans-serif" }}
                      disabled={inviteLoading}
                      onKeyPress={(e) => {
                        if (
                          e.key === "Enter" &&
                          !inviteLoading &&
                          inviteEmail &&
                          inviteName
                        ) {
                          // Trigger send on Enter
                          const button =
                            e.currentTarget.parentElement?.parentElement?.parentElement?.querySelector(
                              "button:last-child"
                            ) as HTMLButtonElement;
                          if (button) button.click();
                        }
                      }}
                    />
                  </div>
                </div>
                <div className="flex gap-3 mt-auto pt-4">
                  <button
                    onClick={() => {
                      setShowInviteModal(false);
                      setInviteEmail("");
                      setInviteName("");
                      setInviteError("");
                      setInviteSuccess(false);
                    }}
                    className="flex-1 px-4 py-2.5 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-white font-medium hover:bg-white/30 transition-colors"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                    disabled={inviteLoading}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={async () => {
                      if (!inviteName || inviteName.trim() === "") {
                        setInviteError("Please enter a name");
                        return;
                      }
                      if (!inviteEmail || !inviteEmail.includes("@")) {
                        setInviteError("Please enter a valid email address");
                        return;
                      }

                      setInviteLoading(true);
                      setInviteError("");
                      setInviteSuccess(false);

                      try {
                        const response = await fetch("/api/auth/send-invite", {
                          method: "POST",
                          headers: {
                            "Content-Type": "application/json",
                          },
                          body: JSON.stringify({
                            email: inviteEmail,
                            name: inviteName,
                          }),
                        });

                        const data = await response.json();

                        if (!response.ok) {
                          throw new Error(
                            data.error || "Failed to send invitation"
                          );
                        }

                        setInviteSuccess(true);
                        setInviteEmail("");
                        setInviteName("");
                        setTimeout(() => {
                          setShowInviteModal(false);
                          setInviteSuccess(false);
                        }, 2000);
                      } catch (err: any) {
                        setInviteError(
                          err.message || "Failed to send invitation email"
                        );
                      } finally {
                        setInviteLoading(false);
                      }
                    }}
                    className="flex-1 px-4 py-2.5 bg-white text-orange-600 rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                    disabled={inviteLoading}
                  >
                    {inviteLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-orange-600 border-t-transparent"></div>
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <i className="fi flex fi-rr-envelope text-sm"></i>
                        <span>Send Invite</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Approval Modal */}
      {showApprovalModal && approvalUserData && (
        <div
          className="fixed inset-0 backdrop-blur-md flex items-center justify-center p-4"
          style={{
            zIndex: 9999,
            backgroundColor: "rgba(0, 0, 0, 0.3)",
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowApprovalModal(false);
              setApprovalUserData(null);
            }
          }}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
              <h2
                className="text-xl font-semibold"
                style={{
                  color: "#263238",
                  fontFamily: "'Poppins', sans-serif",
                }}
              >
                Approve User - {approvalUserData.user_name || "N/A"}
              </h2>
              <button
                onClick={() => {
                  setShowApprovalModal(false);
                  setApprovalUserData(null);
                }}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            <div className="px-6 py-4">
              {/* Options Menu */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h3
                  className="text-sm font-semibold mb-4"
                  style={{
                    color: "#263238",
                    fontFamily: "'Poppins', sans-serif",
                  }}
                >
                  Set User Options
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {/* Role */}
                  <div>
                    <label
                      className="block text-xs font-medium mb-2"
                      style={{ color: "#263238" }}
                    >
                      Role
                    </label>
                    <select
                      value={approvalFormData.role}
                      onChange={(e) =>
                        setApprovalFormData((prev) => ({
                          ...prev,
                          role: e.target.value as any,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2  text-gray-500 focus:ring-[#4b33e8]"
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                      <option value="super_admin">Super Admin</option>
                    </select>
                  </div>

                  {/* Department */}
                  <div>
                    <label
                      className="block text-xs font-medium mb-2"
                      style={{ color: "#263238" }}
                    >
                      Department
                    </label>
                    <select
                      value={approvalFormData.department}
                      onChange={(e) =>
                        setApprovalFormData((prev) => ({
                          ...prev,
                          department: e.target.value as any,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2  text-gray-500 focus:ring-[#4b33e8]"
                    >
                      <option value="sales">Sales</option>
                      <option value="renewal">Renewal</option>
                      <option value="backend">Backend</option>
                      <option value="management">Management</option>
                      <option value="service">Service</option>
                    </select>
                  </div>

                  {/* Designation */}
                  <div>
                    <label
                      className="block text-xs font-medium mb-2"
                      style={{ color: "#263238" }}
                    >
                      Designation
                    </label>
                    <select
                      value={approvalFormData.designation}
                      onChange={(e) =>
                        setApprovalFormData((prev) => ({
                          ...prev,
                          designation: e.target.value as any,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2  text-gray-500 focus:ring-[#4b33e8]"
                    >
                      <option value="agent">Agent</option>
                      <option value="manager">Manager</option>
                      <option value="faculty_staff">Faculty Staff</option>
                      <option value="team_leader">Team Leader</option>
                      <option value="ceo">CEO</option>
                      <option value="developer">Developer</option>
                    </select>
                  </div>

                  {/* Work Type */}
                  <div>
                    <label
                      className="block text-xs font-medium mb-2"
                      style={{ color: "#263238" }}
                    >
                      Work Type
                    </label>
                    <select
                      value={approvalFormData.work_type}
                      onChange={(e) =>
                        setApprovalFormData((prev) => ({
                          ...prev,
                          work_type: e.target.value as any,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2  text-gray-500 focus:ring-[#4b33e8]"
                    >
                      <option value="on_site">On Site</option>
                      <option value="remote">Remote</option>
                    </select>
                  </div>

                  {/* User Type */}
                  <div>
                    <label
                      className="block text-xs font-medium mb-2"
                      style={{ color: "#263238" }}
                    >
                      User Type
                    </label>
                    <select
                      value={approvalFormData.user_type}
                      onChange={(e) =>
                        setApprovalFormData((prev) => ({
                          ...prev,
                          user_type: e.target.value as any,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2  text-gray-500 focus:ring-[#4b33e8]"
                    >
                      <option value="employee">Employee</option>
                      <option value="posp_agent">POSP Agent</option>
                    </select>
                  </div>

                  {/* Status */}
                  <div>
                    <label
                      className="block text-xs font-medium mb-2"
                      style={{ color: "#263238" }}
                    >
                      Status
                    </label>
                    <select
                      value={approvalFormData.status}
                      onChange={(e) =>
                        setApprovalFormData((prev) => ({
                          ...prev,
                          status: e.target.value as any,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2  text-gray-500 focus:ring-[#4b33e8]"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* User Application Form */}
              <div className="mb-6">
                <h3
                  className="text-sm font-semibold mb-4"
                  style={{
                    color: "#263238",
                    fontFamily: "'Poppins', sans-serif",
                  }}
                >
                  User Application Details
                </h3>
                <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-6 max-h-[400px] overflow-y-auto">
                  {/* Basic Info */}
                  <div>
                    <h4 className="text-xs font-semibold mb-3 text-gray-700">
                      Basic Details
                    </h4>
                    <SettingsFormFields
                      formData={{
                        email: approvalUserData.email || "",
                        user_name: approvalUserData.user_name || "",
                        contact_no: approvalUserData.contact_no || "",
                        employee_id: approvalUserData.employee_id || "",
                        role: approvalUserData.role || "",
                        profile_pic_url: approvalUserData.profile_pic_url || "",
                      }}
                      handleInputChange={() => { }}
                      category="basic_info"
                      readOnly={true}
                    />
                  </div>

                  {/* Personal Info */}
                  <div>
                    <h4 className="text-xs font-semibold mb-3 text-gray-700">
                      Personal Information
                    </h4>
                    <SettingsFormFields
                      formData={{
                        father_name: approvalUserData.father_name || "",
                        gender: approvalUserData.gender || "",
                        date_of_birth: approvalUserData.date_of_birth || "",
                        blood_group: approvalUserData.blood_group || "",
                        alternate_contact:
                          approvalUserData.alternate_contact || "",
                        emergency_contact_no:
                          approvalUserData.emergency_contact_no || "",
                      }}
                      handleInputChange={() => { }}
                      category="personal_info"
                      readOnly={true}
                    />
                  </div>

                  {/* Employment Info */}
                  <div>
                    <h4 className="text-xs font-semibold mb-3 text-gray-700">
                      Employment Information
                    </h4>
                    <SettingsFormFields
                      formData={{
                        date_of_joining: approvalUserData.date_of_joining || "",
                        in_hand_salary:
                          approvalUserData.in_hand_salary?.toString() || "",
                        work_type: approvalUserData.work_type || "",
                        user_type: approvalUserData.user_type || "",
                        department: approvalUserData.department || "",
                        designation: approvalUserData.designation || "",
                      }}
                      handleInputChange={() => { }}
                      category="employment_info"
                      readOnly={true}
                    />
                  </div>

                  {/* Address Info */}
                  <div>
                    <h4 className="text-xs font-semibold mb-3 text-gray-700">
                      Address Information
                    </h4>
                    <SettingsFormFields
                      formData={{
                        primary_address: approvalUserData.primary_address || "",
                        area_pincode: approvalUserData.area_pincode || "",
                      }}
                      handleInputChange={() => { }}
                      category="address_info"
                      readOnly={true}
                    />
                  </div>

                  {/* KYC Info */}
                  <div>
                    <h4 className="text-xs font-semibold mb-3 text-gray-700">
                      KYC Information
                    </h4>
                    <SettingsFormFields
                      formData={{
                        pan_number: approvalUserData.pan_number || "",
                        aadhar_card_no: approvalUserData.aadhar_card_no || "",
                      }}
                      handleInputChange={() => { }}
                      category="kyc_info"
                      readOnly={true}
                    />
                  </div>

                  {/* Bank Info */}
                  <div>
                    <h4 className="text-xs font-semibold mb-3 text-gray-700">
                      Bank Details
                    </h4>
                    <SettingsFormFields
                      formData={{
                        bank_name: approvalUserData.bank_name || "",
                        account_holder_name:
                          approvalUserData.account_holder_name || "",
                        account_number: approvalUserData.account_number || "",
                        ifsc_code: approvalUserData.ifsc_code || "",
                        branch_city: approvalUserData.branch_city || "",
                        branch_state: approvalUserData.branch_state || "",
                        branch_pincode: approvalUserData.branch_pincode || "",
                      }}
                      handleInputChange={() => { }}
                      category="bank_info"
                      readOnly={true}
                    />
                  </div>

                  {/* Documents */}
                  <div>
                    <h4 className="text-xs font-semibold mb-3 text-gray-700">
                      Documents
                    </h4>
                    <SettingsFormFields
                      formData={{
                        profile_pic_url: approvalUserData.profile_pic_url || "",
                        pancard_url: approvalUserData.pancard_url || "",
                        aadhar_front_url:
                          approvalUserData.aadhar_front_url || "",
                        aadhar_back_url: approvalUserData.aadhar_back_url || "",
                        qualification_marksheet_url:
                          approvalUserData.qualification_marksheet_url || "",
                        bank_passbook_url:
                          approvalUserData.bank_passbook_url || "",
                      }}
                      handleInputChange={() => { }}
                      category="documents"
                      readOnly={true}
                    />
                  </div>
                </div>
              </div>

              {/* Approve Button */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => {
                    setShowApprovalModal(false);
                    setApprovalUserData(null);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    try {
                      // Generate next employee ID if user doesn't have one
                      let employeeId = approvalUserData.employee_id;
                      if (!employeeId || employeeId.trim() === "") {
                        employeeId = await generateNextEmployeeId();
                      }

                      const { error } = await supabase
                        .from("user_profiles")
                        .update({
                          approval_status: "approved",
                          status: approvalFormData.status,
                          role: approvalFormData.role,
                          department: approvalFormData.department,
                          designation: approvalFormData.designation,
                          work_type: approvalFormData.work_type,
                          user_type: approvalFormData.user_type,
                          employee_id: employeeId,
                          updated_at: new Date().toISOString(),
                        })
                        .eq("id", approvalUserData.id);

                      if (error) {
                        console.error("Error approving user:", error);
                        alert("Failed to approve user");
                      } else {
                        // Close modal and refresh data
                        setShowApprovalModal(false);
                        setApprovalUserData(null);
                        fetchPendingUsers();
                        fetchUserStats();
                        fetchAllUsers();
                      }
                    } catch (err) {
                      console.error("Error approving user:", err);
                      alert("Failed to approve user");
                    }
                  }}
                  className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  Approve User
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hold Modal */}
      {showHoldModal && holdUserData && (
        <div
          className="fixed inset-0 backdrop-blur-md flex items-center justify-center p-4"
          style={{
            zIndex: 9999,
            backgroundColor: "rgba(0, 0, 0, 0.3)",
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowHoldModal(false);
              setHoldUserData(null);
            }
          }}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
              <h2
                className="text-xl font-semibold"
                style={{
                  color: "#263238",
                  fontFamily: "'Poppins', sans-serif",
                }}
              >
                Hold User - {holdUserData.user_name || "N/A"}
              </h2>
              <button
                onClick={() => {
                  setShowHoldModal(false);
                  setHoldUserData(null);
                }}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            <div className="px-6 py-4">
              {/* Hold Duration */}
              <div className="mb-6">
                <label
                  className="block text-sm font-medium mb-3"
                  style={{
                    color: "#263238",
                    fontFamily: "'Poppins', sans-serif",
                  }}
                >
                  Hold Duration
                </label>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <button
                    type="button"
                    onClick={() =>
                      setHoldFormData((prev) => ({ ...prev, duration: "1" }))
                    }
                    className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition-colors ${holdFormData.duration === "1"
                        ? "border-[#4b33e8] bg-[#4b33e8] text-white"
                        : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                      }`}
                  >
                    1 Day
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setHoldFormData((prev) => ({ ...prev, duration: "2" }))
                    }
                    className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition-colors ${holdFormData.duration === "2"
                        ? "border-[#4b33e8] bg-[#4b33e8] text-white"
                        : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                      }`}
                  >
                    2 Days
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setHoldFormData((prev) => ({ ...prev, duration: "3" }))
                    }
                    className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition-colors ${holdFormData.duration === "3"
                        ? "border-[#4b33e8] bg-[#4b33e8] text-white"
                        : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                      }`}
                  >
                    3 Days
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setHoldFormData((prev) => ({
                        ...prev,
                        duration: "custom",
                      }))
                    }
                    className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition-colors ${holdFormData.duration === "custom"
                        ? "border-[#4b33e8] bg-[#4b33e8] text-white"
                        : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                      }`}
                  >
                    Custom
                  </button>
                </div>

                {/* Custom Date & Time */}
                {holdFormData.duration === "custom" && (
                  <div className="grid grid-cols-2 gap-3 mt-3">
                    <div>
                      <label className="block text-xs font-medium mb-1 text-gray-600">
                        Date
                      </label>
                      <input
                        type="date"
                        value={holdFormData.customDate}
                        onChange={(e) =>
                          setHoldFormData((prev) => ({
                            ...prev,
                            customDate: e.target.value,
                          }))
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-[#4b33e8]"
                        min={new Date().toISOString().split("T")[0]}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1 text-gray-600">
                        Time
                      </label>
                      <input
                        type="time"
                        value={holdFormData.customTime}
                        onChange={(e) =>
                          setHoldFormData((prev) => ({
                            ...prev,
                            customTime: e.target.value,
                          }))
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-700  text-sm focus:outline-none focus:ring-2 focus:ring-[#4b33e8]"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Reason of Hold */}
              <div className="mb-6">
                <label
                  className="block text-sm font-medium mb-2"
                  style={{
                    color: "#263238",
                    fontFamily: "'Poppins', sans-serif",
                  }}
                >
                  Reason of Hold <span style={{ color: "#EF4444" }}>*</span>
                </label>
                <textarea
                  value={holdFormData.reason}
                  onChange={(e) =>
                    setHoldFormData((prev) => ({
                      ...prev,
                      reason: e.target.value,
                    }))
                  }
                  placeholder="Enter the reason for putting this user on hold..."
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700  focus:outline-none focus:ring-2 focus:ring-[#4b33e8] resize-none"
                  style={{ fontFamily: "'Roboto', sans-serif" }}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => {
                    setShowHoldModal(false);
                    setHoldUserData(null);
                    setHoldFormData({
                      duration: "1",
                      customDate: "",
                      customTime: "",
                      reason: "",
                    });
                  }}
                  className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    if (!holdFormData.reason.trim()) {
                      alert("Please enter a reason for hold");
                      return;
                    }

                    try {
                      // Calculate hold end date
                      let holdEndDate: Date;
                      const now = new Date();

                      if (holdFormData.duration === "custom") {
                        if (!holdFormData.customDate) {
                          alert("Please select a custom date");
                          return;
                        }
                        const customDateTime = new Date(
                          `${holdFormData.customDate}T${holdFormData.customTime || "00:00"
                          }`
                        );
                        if (customDateTime <= now) {
                          alert("Hold end date must be in the future");
                          return;
                        }
                        holdEndDate = customDateTime;
                      } else {
                        const days = parseInt(holdFormData.duration);
                        holdEndDate = new Date(now);
                        holdEndDate.setDate(holdEndDate.getDate() + days);
                      }

                      // Get current user ID from session
                      const {
                        data: { session },
                      } = await supabase.auth.getSession();
                      const currentUserId = session?.user?.id || null;

                      // Prepare update data - only include fields that exist in DB
                      const updateData: any = {
                        approval_status: "hold",
                        hold_start_date: now.toISOString(),
                        hold_end_date: holdEndDate.toISOString(),
                        status_reason: holdFormData.reason,
                        updated_at: new Date().toISOString(),
                      };

                      // Try to add hold_by_user_id, but don't fail if column doesn't exist
                      // This field might not exist in the database yet
                      if (currentUserId) {
                        try {
                          updateData.hold_by_user_id = currentUserId;
                        } catch (e) {
                          console.warn(
                            "hold_by_user_id field might not exist in database:",
                            e
                          );
                        }
                      }

                      const { error, data } = await supabase
                        .from("user_profiles")
                        .update(updateData)
                        .eq("id", holdUserData.id)
                        .select();

                      if (error) {
                        console.error("Error putting user on hold:", error);
                        console.error(
                          "Error details:",
                          JSON.stringify(error, null, 2)
                        );
                        console.error("Update data:", updateData);

                        // If error is about hold_by_user_id, retry without it
                        if (
                          error.message &&
                          (error.message.includes("hold_by_user_id") ||
                            error.message.includes("column") ||
                            error.code === "42703")
                        ) {
                          console.log(
                            "Retrying without hold_by_user_id field..."
                          );
                          const { error: retryError } = await supabase
                            .from("user_profiles")
                            .update({
                              approval_status: "hold",
                              hold_start_date: now.toISOString(),
                              hold_end_date: holdEndDate.toISOString(),
                              status_reason: holdFormData.reason,
                              updated_at: new Date().toISOString(),
                            })
                            .eq("id", holdUserData.id);

                          if (retryError) {
                            alert(
                              `Failed to put user on hold: ${retryError.message || "Unknown error"
                              }`
                            );
                            return;
                          }
                        } else {
                          alert(
                            `Failed to put user on hold: ${error.message || "Unknown error"
                            }`
                          );
                          return;
                        }
                      }

                      // Success - close modal and refresh data
                      setShowHoldModal(false);
                      setHoldUserData(null);
                      setHoldFormData({
                        duration: "1",
                        customDate: "",
                        customTime: "",
                        reason: "",
                      });
                      fetchAllUsers();
                      fetchPendingUsers();
                      fetchUserStats();
                    } catch (err) {
                      console.error("Error putting user on hold:", err);
                      alert("Failed to put user on hold");
                    }
                  }}
                  className="px-6 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  Put on Hold
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Import Modal */}
      {showImportModal && (
        <div
          className="fixed inset-0 backdrop-blur-md flex items-center justify-center p-4"
          style={{
            zIndex: 9999,
            backgroundColor: "rgba(0, 0, 0, 0.3)",
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowImportModal(false);
              setImportFile(null);
              setImportError("");
              setImportSuccess("");
              if (fileInputRef.current) {
                fileInputRef.current.value = "";
              }
            }
          }}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
              <h2
                className="text-xl font-semibold"
                style={{
                  color: "#263238",
                  fontFamily: "'Poppins', sans-serif",
                }}
              >
                Import Users (Bulk Creation)
              </h2>
              <button
                onClick={() => {
                  setShowImportModal(false);
                  setImportFile(null);
                  setImportError("");
                  setImportSuccess("");
                  if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                  }
                }}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            <div className="px-6 py-4">
              {importError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {importError}
                </div>
              )}
              {importSuccess && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
                  {importSuccess}
                </div>
              )}

              {/* CSV Format Info */}
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h3
                  className="text-sm font-semibold mb-2"
                  style={{
                    color: "#263238",
                    fontFamily: "'Poppins', sans-serif",
                  }}
                >
                  CSV Format Required:
                </h3>
                <ul
                  className="text-xs text-gray-700 space-y-1"
                  style={{ fontFamily: "'Roboto', sans-serif" }}
                >
                  <li>
                    • <strong>User Name</strong> - Full name of the user
                  </li>
                  <li>
                    • <strong>Employee ID</strong> - Unique employee ID (e.g.,
                    TFC-001)
                  </li>
                  <li>
                    • <strong>Email</strong> - Valid email address
                  </li>
                  <li>
                    • <strong>Contact No</strong> - 10-digit phone number
                  </li>
                  <li>
                    • <strong>User Type</strong> - "employee" or "posp_agent"
                  </li>
                  <li>
                    • <strong>Password</strong> - Minimum 6 characters
                  </li>
                </ul>
              </div>

              {/* Sample CSV Download */}
              <div className="mb-6">
                <button
                  onClick={() => {
                    const csvContent = `User Name,Employee ID,Email,Contact No,User Type,Password
John Doe,TFC-001,john.doe@example.com,1234567890,employee,password123
Jane Smith,TFC-002,jane.smith@example.com,0987654321,posp_agent,password123`;
                    const blob = new Blob([csvContent], {
                      type: "text/csv;charset=utf-8;",
                    });
                    const link = document.createElement("a");
                    const url = URL.createObjectURL(blob);
                    link.setAttribute("href", url);
                    link.setAttribute("download", "sample_users_import.csv");
                    link.style.visibility = "hidden";
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                  className="w-full px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <i className="fi flex fi-rr-download"></i>
                  <span>Download Sample CSV</span>
                </button>
              </div>

              {/* File Upload */}
              <div className="mb-6">
                <label
                  className="block text-sm font-medium mb-2"
                  style={{
                    color: "#263238",
                    fontFamily: "'Poppins', sans-serif",
                  }}
                >
                  Upload CSV File <span style={{ color: "#EF4444" }}>*</span>
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#4b33e8] transition-colors">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        if (
                          file.type !== "text/csv" &&
                          !file.name.endsWith(".csv")
                        ) {
                          setImportError("Please upload a valid CSV file");
                          setImportFile(null);
                          return;
                        }
                        setImportFile(file);
                        setImportError("");
                        setImportSuccess("");
                      }
                    }}
                    className="hidden"
                    id="csv-upload"
                  />
                  <label
                    htmlFor="csv-upload"
                    className="cursor-pointer flex flex-col items-center gap-2"
                  >
                    <i className="fi flex fi-rr-upload text-3xl text-gray-400"></i>
                    <div>
                      <span
                        className="text-sm font-medium text-[#4b33e8]"
                        style={{ fontFamily: "'Poppins', sans-serif" }}
                      >
                        Click to upload
                      </span>
                      <span
                        className="text-sm text-gray-500"
                        style={{ fontFamily: "'Roboto', sans-serif" }}
                      >
                        {" "}
                        or drag and drop
                      </span>
                    </div>
                    <p
                      className="text-xs text-gray-400"
                      style={{ fontFamily: "'Roboto', sans-serif" }}
                    >
                      CSV file only
                    </p>
                  </label>
                  {importFile && (
                    <div className="mt-3 p-2 bg-gray-50 rounded-lg flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <i className="fi flex fi-rr-file text-gray-600"></i>
                        <span
                          className="text-sm text-gray-700"
                          style={{ fontFamily: "'Roboto', sans-serif" }}
                        >
                          {importFile.name}
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          setImportFile(null);
                          if (fileInputRef.current) {
                            fileInputRef.current.value = "";
                          }
                        }}
                        className="text-red-500 hover:text-red-700"
                      >
                        <i className="fi flex fi-rr-cross text-sm"></i>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => {
                    setShowImportModal(false);
                    setImportFile(null);
                    setImportError("");
                    setImportSuccess("");
                    if (fileInputRef.current) {
                      fileInputRef.current.value = "";
                    }
                  }}
                  className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors"
                  disabled={importing}
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    if (!importFile) {
                      setImportError("Please select a CSV file");
                      return;
                    }

                    setImporting(true);
                    setImportError("");
                    setImportSuccess("");

                    try {
                      const text = await importFile.text();
                      const lines = text
                        .split("\n")
                        .filter((line) => line.trim());

                      if (lines.length < 2) {
                        setImportError(
                          "CSV file must contain at least a header row and one data row"
                        );
                        setImporting(false);
                        return;
                      }

                      // Parse CSV
                      const headers = lines[0].split(",").map((h) => h.trim());
                      const requiredHeaders = [
                        "User Name",
                        "Employee ID",
                        "Email",
                        "Contact No",
                        "User Type",
                        "Password",
                      ];

                      // Check if all required headers are present
                      const missingHeaders = requiredHeaders.filter(
                        (h) => !headers.includes(h)
                      );
                      if (missingHeaders.length > 0) {
                        setImportError(
                          `Missing required columns: ${missingHeaders.join(
                            ", "
                          )}`
                        );
                        setImporting(false);
                        return;
                      }

                      const users = [];
                      const errors = [];

                      for (let i = 1; i < lines.length; i++) {
                        const values = lines[i].split(",").map((v) => v.trim());
                        if (values.length !== headers.length) {
                          errors.push(`Row ${i + 1}: Column count mismatch`);
                          continue;
                        }

                        const user: any = {};
                        headers.forEach((header, index) => {
                          user[header] = values[index];
                        });

                        // Validate required fields
                        if (
                          !user["User Name"] ||
                          !user["Employee ID"] ||
                          !user["Email"] ||
                          !user["Contact No"] ||
                          !user["User Type"] ||
                          !user["Password"]
                        ) {
                          errors.push(`Row ${i + 1}: Missing required fields`);
                          continue;
                        }

                        // Validate email format
                        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                        if (!emailRegex.test(user["Email"])) {
                          errors.push(`Row ${i + 1}: Invalid email format`);
                          continue;
                        }

                        // Validate contact number
                        if (!/^\d{10}$/.test(user["Contact No"])) {
                          errors.push(
                            `Row ${i + 1}: Contact number must be 10 digits`
                          );
                          continue;
                        }

                        // Validate user type
                        if (
                          !["employee", "posp_agent"].includes(
                            user["User Type"].toLowerCase()
                          )
                        ) {
                          errors.push(
                            `Row ${i + 1
                            }: User Type must be "employee" or "posp_agent"`
                          );
                          continue;
                        }

                        // Validate password
                        if (user["Password"].length < 6) {
                          errors.push(
                            `Row ${i + 1
                            }: Password must be at least 6 characters`
                          );
                          continue;
                        }

                        users.push({
                          user_name: user["User Name"],
                          employee_id: user["Employee ID"],
                          email: user["Email"],
                          contact_no: user["Contact No"],
                          user_type: user["User Type"].toLowerCase(),
                          password: user["Password"],
                        });
                      }

                      if (errors.length > 0) {
                        setImportError(
                          `Validation errors:\n${errors.join("\n")}`
                        );
                        setImporting(false);
                        return;
                      }

                      if (users.length === 0) {
                        setImportError("No valid users found in CSV file");
                        setImporting(false);
                        return;
                      }

                      // Import users one by one
                      const {
                        data: { session },
                      } = await supabase.auth.getSession();
                      if (!session) {
                        setImportError("You must be logged in to import users");
                        setImporting(false);
                        return;
                      }

                      let successCount = 0;
                      const importErrors: string[] = [];

                      // Process each user individually
                      for (let i = 0; i < users.length; i++) {
                        const user = users[i];

                        try {
                          const response = await fetch(
                            "/api/auth/import-user",
                            {
                              method: "POST",
                              headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${session.access_token}`,
                              },
                              body: JSON.stringify({
                                user_name: user.user_name,
                                employee_id: user.employee_id,
                                email: user.email,
                                contact_no: user.contact_no,
                                user_type: user.user_type,
                                password: user.password,
                              }),
                            }
                          );

                          const data = await response.json();

                          if (!response.ok) {
                            importErrors.push(
                              `Row ${i + 1} (${user.email}): ${data.error || "Failed to import"
                              }`
                            );
                          } else {
                            successCount++;
                          }
                        } catch (err: any) {
                          importErrors.push(
                            `Row ${i + 1} (${user.email}): ${err.message || "Network error"
                            }`
                          );
                        }
                      }

                      if (successCount === 0) {
                        setImportError(
                          `Failed to import any users.\n${importErrors.join(
                            "\n"
                          )}`
                        );
                        setImporting(false);
                        return;
                      }

                      const successMessage = `Successfully imported ${successCount} user(s).`;
                      const errorMessage =
                        importErrors.length > 0
                          ? `\n\nErrors:\n${importErrors.join("\n")}`
                          : "";
                      setImportSuccess(successMessage + errorMessage);
                      setImportFile(null);
                      if (fileInputRef.current) {
                        fileInputRef.current.value = "";
                      }

                      // Refresh data
                      fetchAllUsers();
                      fetchUserStats();
                      fetchPendingUsers();

                      // Close modal after 3 seconds if no errors, or keep it open if there are errors
                      if (importErrors.length === 0) {
                        setTimeout(() => {
                          setShowImportModal(false);
                          setImportSuccess("");
                        }, 3000);
                      }
                    } catch (err: any) {
                      console.error("Import error:", err);
                      setImportError(err.message || "Failed to import users");
                    } finally {
                      setImporting(false);
                    }
                  }}
                  disabled={importing || !importFile}
                  className="px-6 py-2 bg-[#4b33e8] hover:bg-[#3d28c7] text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {importing ? "Importing..." : "Import Users"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Suspend Modal */}
      {showSuspendModal && suspendUserData && (
        <div
          className="fixed inset-0 z-[10000] flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.3)" }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowSuspendModal(false);
              setSuspendUserData(null);
              setSuspendFormData({ reason: "" });
            }
          }}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative backdrop-blur-md"
            style={{ maxHeight: "90vh", overflowY: "auto" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => {
                setShowSuspendModal(false);
                setSuspendUserData(null);
                setSuspendFormData({ reason: "" });
              }}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
            >
              <i className="fi flex fi-rr-cross text-gray-500"></i>
            </button>

            {/* Modal Header */}
            <div className="mb-6">
              <h2
                className="text-xl font-bold mb-2"
                style={{
                  color: "#263238",
                  fontFamily: "'Poppins', sans-serif",
                }}
              >
                Suspend User
              </h2>
              <p
                className="text-sm text-gray-600"
                style={{ fontFamily: "'Roboto', sans-serif" }}
              >
                Please provide a reason for suspending this user account.
              </p>
            </div>

            {/* User Info */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                {suspendUserData.profile_pic_url ? (
                  <img
                    src={suspendUserData.profile_pic_url}
                    alt={suspendUserData.user_name || "User"}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold">
                    {suspendUserData.user_name
                      ? suspendUserData.user_name.charAt(0).toUpperCase()
                      : "U"}
                  </div>
                )}
                <div>
                  <p
                    className="font-semibold"
                    style={{
                      color: "#263238",
                      fontFamily: "'Poppins', sans-serif",
                    }}
                  >
                    {suspendUserData.user_name || "N/A"}
                  </p>
                  <p
                    className="text-xs text-gray-600"
                    style={{ fontFamily: "'Roboto', sans-serif" }}
                  >
                    {suspendUserData.email || "N/A"}
                  </p>
                </div>
              </div>
            </div>

            {/* Reason of Suspend */}
            <div className="mb-6">
              <label
                className="block text-sm font-medium mb-2"
                style={{
                  color: "#263238",
                  fontFamily: "'Poppins', sans-serif",
                }}
              >
                Reason of Suspension <span style={{ color: "#EF4444" }}>*</span>
              </label>
              <textarea
                value={suspendFormData.reason}
                onChange={(e) =>
                  setSuspendFormData((prev) => ({
                    ...prev,
                    reason: e.target.value,
                  }))
                }
                placeholder="Enter the reason for suspending this user..."
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#4b33e8] resize-none"
                style={{ fontFamily: "'Roboto', sans-serif" }}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
              <button
                onClick={() => {
                  setShowSuspendModal(false);
                  setSuspendUserData(null);
                  setSuspendFormData({ reason: "" });
                }}
                className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  if (!suspendFormData.reason.trim()) {
                    alert("Please enter a reason for suspension");
                    return;
                  }

                  try {
                    const { error } = await supabase
                      .from("user_profiles")
                      .update({
                        approval_status: "suspend",
                        status_reason: suspendFormData.reason,
                        updated_at: new Date().toISOString(),
                      })
                      .eq("id", suspendUserData.id);

                    if (error) {
                      console.error("Error suspending user:", error);
                      alert(
                        `Failed to suspend user: ${error.message || "Unknown error"
                        }`
                      );
                      return;
                    }

                    // Success - close modal and refresh data
                    setShowSuspendModal(false);
                    setSuspendUserData(null);
                    setSuspendFormData({ reason: "" });
                    fetchAllUsers();
                    fetchPendingUsers();
                    fetchUserStats();
                  } catch (err) {
                    console.error("Error suspending user:", err);
                    alert("Failed to suspend user");
                  }
                }}
                className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
              >
                Suspend User
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Left Sidebar */}
      <Sidebar
        user={{
          displayName: user?.displayName || null,
          email: user?.email || "",
          employeeId: user?.employeeId || null,
          lastSignInAt: user?.lastSignInAt || null,
          profilePicUrl: user?.profilePicUrl || null,
        }}
        activeNav={activeNav}
        onNavChange={setActiveNav}
        userRole={user?.role || null}
        isSuperAdmin={undefined} // Will be fetched from database in Sidebar if needed
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:ml-56 w-full min-w-0 overflow-x-hidden">
        {/* Top Header */}
        <Header
          user={{
            displayName: user?.displayName || null,
            email: user?.email || "",
            employeeId: user?.employeeId || null,
            profilePicUrl: user?.profilePicUrl || null,
          }}
          onLogout={handleLogoutClick}
        />

        {/* Main Content */}
        <main
          className="flex-1 overflow-y-auto overflow-x-hidden min-w-0 max-w-full pt-[60px] lg:pt-[60px]"
          style={{ backgroundColor: "#f6f5f7" }}
        >
          <div className="container mx-auto px-3 sm:px-4 md:px-6 py-6 sm:py-8 pb-20 sm:pb-24 lg:pb-8 max-w-7xl">
            <div className="space-y-6 sm:space-y-8">
              {/* Page Header */}
              <div className="mb-6 flex items-start justify-between">
                <div>
                  <h1
                    className="text-xl sm:text-2xl md:text-3xl font-bold mb-2"
                    style={{
                      color: "#263238",
                      fontFamily: "'Poppins', sans-serif",
                    }}
                  >
                    Users
                  </h1>
                  <p
                    className="text-sm sm:text-base"
                    style={{
                      color: "#787E9D",
                      fontFamily: "'Roboto', sans-serif",
                    }}
                  >
                    View and manage all users in the system
                  </p>
                </div>
                {/* User Type Toggle */}
                <div className="flex items-center gap-1 rounded-lg border border-gray-300 bg-white p-1 h-[42px]">
                  <button
                    onClick={() => setUserTypeToggle("all")}
                    className={`inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-8 px-3 ${userTypeToggle === "all"
                        ? "bg-[#4b33e8] text-white hover:opacity-90"
                        : "hover:bg-gray-100 text-gray-600"
                      }`}
                    title="All Users"
                  >
                    {/* Icon for mobile */}
                    <i className="fi flex fi-rr-users text-xs sm:text-sm"></i>
                    {/* Text hidden on very small screens */}
                    <span className="hidden xs:inline text-[10px] sm:text-xs">
                      All
                    </span>
                  </button>
                  <button
                    onClick={() => setUserTypeToggle("employee")}
                    className={`inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-8 px-3 ${userTypeToggle === "employee"
                        ? "bg-[#4b33e8] text-white hover:opacity-90"
                        : "hover:bg-gray-100 text-gray-600"
                      }`}
                    title="Employees"
                  >
                    {/* Icon for mobile */}
                    <i className="fi flex fi-rr-briefcase text-xs sm:text-sm"></i>
                    {/* Text hidden on very small screens */}
                    <span className="hidden xs:inline text-[10px] sm:text-xs">
                      Employee
                    </span>
                  </button>
                  <button
                    onClick={() => setUserTypeToggle("posp_agent")}
                    className={`inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-8 px-3 ${userTypeToggle === "posp_agent"
                        ? "bg-[#4b33e8] text-white hover:opacity-90"
                        : "hover:bg-gray-100 text-gray-600"
                      }`}
                    title="POSP Agents"
                  >
                    {/* Icon for mobile */}
                    <i className="fi flex fi-rr-id-badge text-xs sm:text-sm"></i>
                    {/* Text hidden on very small screens */}
                    <span className="hidden xs:inline text-[10px] sm:text-xs">
                      POSP Agent
                    </span>
                  </button>
                </div>
              </div>

              {/* Modern Card Design Tiles */}
              <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
                {/* First Tile - Active Users */}
                <div
                  onClick={() => {
                    setFilters({
                      approval_status: "",
                      role: "",
                      department: "",
                      designation: "",
                      work_type: "",
                      user_type: "",
                      status: "active", // Filter by active status
                    });
                  }}
                  className="relative rounded-2xl p-3 sm:p-4 border-[1.8px] border-dashed border-gray-400 transition-shadow duration-200 flex flex-col overflow-hidden cursor-pointer hover:shadow-md"
                  style={{ backgroundColor: "#f6f5f7" }}
                  title="Click to filter active users"
                >
                  <div className="flex items-start justify-between mb-1">
                    <div className="flex-1">
                      <h2
                        className="text-sm sm:text-base font-bold mb-0.5"
                        style={{
                          color: "#263238",
                          fontFamily: "'Poppins', sans-serif",
                        }}
                      >
                        Active Users
                      </h2>
                      <div className="flex items-center gap-1.5 mb-1">
                        <div className="flex items-center justify-center w-6 h-6 rounded-lg bg-white">
                          <i
                            className="fi flex fi-rr-calendar text-xs"
                            style={{ color: "#787E9D" }}
                          ></i>
                        </div>
                        <span
                          className="text-[10px] sm:text-xs"
                          style={{
                            color: "#787E9D",
                            fontFamily: "'Roboto', sans-serif",
                          }}
                        >
                          {getCurrentDate()} update
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-center w-9 h-9 rounded-lg">
                      <i
                        className="fi flex fi-rr-users text-base"
                        style={{ color: "#10B981" }}
                      ></i>
                    </div>
                  </div>

                  {loadingStats ? (
                    <div className="animate-pulse">
                      <div className="h-8 bg-gray-200 rounded-lg w-16 mb-2"></div>
                      <div className="flex gap-1.5">
                        <div className="h-7 w-7 bg-gray-200 rounded-full"></div>
                        <div className="h-7 w-7 bg-gray-200 rounded-full"></div>
                        <div className="h-7 w-7 bg-gray-200 rounded-full"></div>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-auto relative z-10">
                      {/* Background Graph */}
                      {monthlyActiveUsers.length > 0 && (
                        <div className="absolute -right-2 -bottom-2 opacity-20">
                          {renderLineGraph(
                            monthlyActiveUsers,
                            "#10B981",
                            "active"
                          )}
                        </div>
                      )}
                      <p
                        className="text-lg sm:text-xl font-bold mb-1"
                        style={{
                          color: "#263238",
                          fontFamily: "'Poppins', sans-serif",
                        }}
                      >
                        {animatedStats.activeUsers}
                      </p>
                      <div className="flex items-center gap-1.5">
                        <div className="flex -space-x-1.5">
                          {allUsers
                            .filter((u) => u.status === "active")
                            .slice(0, 3)
                            .map((user, index) =>
                              user.profile_pic_url ? (
                                <img
                                  key={user.id}
                                  src={user.profile_pic_url}
                                  alt={user.user_name || "User"}
                                  className="w-7 h-7 rounded-full border-2 border-white object-cover"
                                />
                              ) : (
                                <div
                                  key={user.id}
                                  className="w-7 h-7 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-semibold text-white"
                                  style={{
                                    background: `linear-gradient(135deg, ${["#10B981", "#3B82F6", "#8B5CF6"][index]
                                      } 0%, ${["#059669", "#2563EB", "#7C3AED"][index]
                                      } 100%)`,
                                  }}
                                >
                                  {user.user_name
                                    ? user.user_name.charAt(0).toUpperCase()
                                    : "U"}
                                </div>
                              )
                            )}
                        </div>
                        {animatedStats.activeUsers > 3 && (
                          <div
                            className="flex w-7 h-7 rounded-full border-2 border-white bg-white items-center justify-center text-[10px] font-semibold"
                            style={{
                              color: "#263238",
                              fontFamily: "'Roboto', sans-serif",
                            }}
                          >
                            +{animatedStats.activeUsers - 3}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Second Tile - Total Users */}
                <div
                  onClick={() => {
                    setFilters({
                      approval_status: "",
                      role: "",
                      department: "",
                      designation: "",
                      work_type: "",
                      user_type: "",
                      status: "", // Clear all filters - show all users
                    });
                  }}
                  className="relative rounded-2xl p-3 sm:p-4 border-[1.8px] border-dashed border-gray-400 transition-shadow duration-200 flex flex-col overflow-hidden cursor-pointer hover:shadow-md"
                  style={{ backgroundColor: "#f6f5f7" }}
                  title="Click to show all users"
                >
                  <div className="flex items-start justify-between mb-1">
                    <div className="flex-1">
                      <h2
                        className="text-sm sm:text-base font-bold mb-0.5"
                        style={{
                          color: "#263238",
                          fontFamily: "'Poppins', sans-serif",
                        }}
                      >
                        Total Users
                      </h2>
                      <div className="flex items-center gap-1.5 mb-1">
                        <div className="flex items-center justify-center w-6 h-6 rounded-lg bg-white">
                          <i
                            className="fi flex fi-rr-calendar text-xs"
                            style={{ color: "#787E9D" }}
                          ></i>
                        </div>
                        <span
                          className="text-[10px] sm:text-xs"
                          style={{
                            color: "#787E9D",
                            fontFamily: "'Roboto', sans-serif",
                          }}
                        >
                          {getCurrentDate()} update
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-center w-9 h-9 rounded-lg">
                      <i
                        className="fi flex fi-rr-chart-line-up text-base"
                        style={{ color: "#3B82F6" }}
                      ></i>
                    </div>
                  </div>

                  {loadingStats ? (
                    <div className="animate-pulse">
                      <div className="h-8 bg-gray-200 rounded-lg w-16 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-24"></div>
                    </div>
                  ) : (
                    <div className="mt-auto relative z-10">
                      {/* Background Graph */}
                      {monthlyTotalUsers.length > 0 && (
                        <div className="absolute -right-2 -bottom-2 opacity-20">
                          {renderLineGraph(
                            monthlyTotalUsers,
                            "#3B82F6",
                            "total"
                          )}
                        </div>
                      )}
                      <p
                        className="text-lg sm:text-xl font-bold mb-1"
                        style={{
                          color: "#263238",
                          fontFamily: "'Poppins', sans-serif",
                        }}
                      >
                        {animatedStats.totalUsers}
                      </p>
                      <div className="flex items-center gap-1.5 justify-between">
                        <div className="flex items-center gap-1.5">
                          <div className="flex -space-x-1.5">
                            {allUsers.slice(0, 3).map((user, index) =>
                              user.profile_pic_url ? (
                                <img
                                  key={user.id}
                                  src={user.profile_pic_url}
                                  alt={user.user_name || "User"}
                                  className="w-7 h-7 rounded-full border-2 border-white object-cover"
                                />
                              ) : (
                                <div
                                  key={user.id}
                                  className="w-7 h-7 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-semibold text-white"
                                  style={{
                                    background: `linear-gradient(135deg, ${["#3B82F6", "#8B5CF6", "#EC4899"][index]
                                      } 0%, ${["#2563EB", "#7C3AED", "#DB2777"][index]
                                      } 100%)`,
                                  }}
                                >
                                  {user.user_name
                                    ? user.user_name.charAt(0).toUpperCase()
                                    : "U"}
                                </div>
                              )
                            )}
                          </div>
                          {animatedStats.totalUsers > 3 && (
                            <div
                              className="flex w-7 h-7 rounded-full border-2 border-white bg-white items-center justify-center text-[10px] font-semibold"
                              style={{
                                color: "#263238",
                                fontFamily: "'Roboto', sans-serif",
                              }}
                            >
                              +{animatedStats.totalUsers - 3}
                            </div>
                          )}
                        </div>
                        <p
                          onClick={(e) => {
                            e.stopPropagation();
                            setFilters({
                              approval_status: "",
                              role: "",
                              department: "",
                              designation: "",
                              work_type: "",
                              user_type: "",
                              status: "inactive", // Filter by inactive status
                            });
                          }}
                          className="text-[10px] sm:text-xs cursor-pointer hover:underline"
                          style={{
                            color: "#787E9D",
                            fontFamily: "'Roboto', sans-serif",
                          }}
                          title="Click to filter inactive users"
                        >
                          Inactive:{" "}
                          <span
                            className="font-semibold"
                            style={{ color: "#EF4444" }}
                          >
                            {animatedStats.inactiveUsers}
                          </span>
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Third Tile - Approval Status (Sub-tiles only) */}
                {loadingStats ? (
                  <div className="grid grid-cols-2 gap-2 sm:gap-3 md:col-span-2 lg:col-span-1">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-20 bg-gray-200 rounded-xl"></div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2 sm:gap-2.5 md:col-span-2 lg:col-span-1">
                    {/* Approved */}
                    <div
                      onClick={() => {
                        setFilters({
                          approval_status: "approved",
                          role: "",
                          department: "",
                          designation: "",
                          work_type: "",
                          user_type: "",
                          status: "",
                        });
                      }}
                      className="relative rounded-tl-xl rounded-tr-xl rounded-bl-xl pl-3 pr-1.5 py-1.5 sm:pl-4 sm:pr-2 sm:py-2 border-[1.8px] border-gray-300 flex flex-col bg-white overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                      title="Click to filter approved users"
                    >
                      {/* Background Icon */}
                      <div className="absolute -right-2 -bottom-2 opacity-5">
                        <i
                          className="fi flex fi-rr-check text-4xl sm:text-5xl"
                          style={{ color: "#10B981" }}
                        ></i>
                      </div>
                      <p
                        className="text-[9px] sm:text-[10px] font-semibold mb-0.5 uppercase tracking-wide relative z-10"
                        style={{
                          color: "#787E9D",
                          fontFamily: "'Roboto', sans-serif",
                        }}
                      >
                        Approved
                      </p>
                      <div className="mt-auto flex flex-col relative z-10">
                        <div className="hidden sm:flex -space-x-1.5 mb-0.5">
                          {allUsers
                            .filter((u) => u.approval_status === "approved")
                            .slice(0, 2)
                            .map((user, index) =>
                              user.profile_pic_url ? (
                                <img
                                  key={user.id}
                                  src={user.profile_pic_url}
                                  alt={user.user_name || "User"}
                                  className="w-5 h-5 rounded-full border-2 border-white object-cover"
                                />
                              ) : (
                                <div
                                  key={user.id}
                                  className="w-5 h-5 rounded-full border-2 border-white flex items-center justify-center text-[9px] font-semibold text-white bg-green-500"
                                >
                                  {user.user_name
                                    ? user.user_name.charAt(0).toUpperCase()
                                    : "U"}
                                </div>
                              )
                            )}
                          {animatedStats.approved > 2 && (
                            <div
                              className="hidden sm:flex w-5 h-5 rounded-full border-2 border-white bg-gray-200 items-center justify-center text-[9px] font-semibold"
                              style={{ color: "#263238" }}
                            >
                              +{animatedStats.approved - 2}
                            </div>
                          )}
                        </div>
                        <p
                          className="text-base sm:text-lg font-bold"
                          style={{
                            color: "#10B981",
                            fontFamily: "'Poppins', sans-serif",
                          }}
                        >
                          {animatedStats.approved}
                        </p>
                      </div>
                    </div>

                    {/* Pending */}
                    <div
                      onClick={() => {
                        setFilters({
                          approval_status: "pending",
                          role: "",
                          department: "",
                          designation: "",
                          work_type: "",
                          user_type: "",
                          status: "",
                        });
                      }}
                      className="relative rounded-xl pl-3 pr-1.5 py-1.5 sm:pl-4 sm:pr-2 sm:py-2 border-[1.8px] border-gray-300 flex flex-col bg-white overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                      title="Click to filter pending users"
                    >
                      {/* Background Icon */}
                      <div className="absolute -right-2 -bottom-2 opacity-5">
                        <i
                          className="fi flex fi-rr-clock text-4xl sm:text-5xl"
                          style={{ color: "#F59E0B" }}
                        ></i>
                      </div>
                      <p
                        className="text-[9px] sm:text-[10px] font-semibold mb-0.5 uppercase tracking-wide relative z-10"
                        style={{
                          color: "#787E9D",
                          fontFamily: "'Roboto', sans-serif",
                        }}
                      >
                        Pending
                      </p>
                      <div className="mt-auto flex flex-col relative z-10">
                        <div className="hidden sm:flex -space-x-1.5 mb-0.5">
                          {allUsers
                            .filter((u) => u.approval_status === "pending")
                            .slice(0, 2)
                            .map((user, index) =>
                              user.profile_pic_url ? (
                                <img
                                  key={user.id}
                                  src={user.profile_pic_url}
                                  alt={user.user_name || "User"}
                                  className="w-5 h-5 rounded-full border-2 border-white object-cover"
                                />
                              ) : (
                                <div
                                  key={user.id}
                                  className="w-5 h-5 rounded-full border-2 border-white flex items-center justify-center text-[9px] font-semibold text-white bg-amber-500"
                                >
                                  {user.user_name
                                    ? user.user_name.charAt(0).toUpperCase()
                                    : "U"}
                                </div>
                              )
                            )}
                          {animatedStats.pending > 2 && (
                            <div
                              className="hidden sm:flex w-5 h-5 rounded-full border-2 border-white bg-gray-200 items-center justify-center text-[9px] font-semibold"
                              style={{ color: "#263238" }}
                            >
                              +{animatedStats.pending - 2}
                            </div>
                          )}
                        </div>
                        <p
                          className="text-base sm:text-lg font-bold"
                          style={{
                            color: "#F59E0B",
                            fontFamily: "'Poppins', sans-serif",
                          }}
                        >
                          {animatedStats.pending}
                        </p>
                      </div>
                    </div>

                    {/* Hold */}
                    <div
                      onClick={() => {
                        setFilters({
                          approval_status: "hold",
                          role: "",
                          department: "",
                          designation: "",
                          work_type: "",
                          user_type: "",
                          status: "",
                        });
                      }}
                      className="relative rounded-xl pl-3 pr-1.5 py-1.5 sm:pl-4 sm:pr-2 sm:py-2 border-[1.8px] border-gray-300 flex flex-col bg-white overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                      title="Click to filter users on hold"
                    >
                      {/* Background Icon */}
                      <div className="absolute -right-2 -bottom-2 opacity-5">
                        <i
                          className="fi flex fi-rr-pause text-4xl sm:text-5xl"
                          style={{ color: "#F97316" }}
                        ></i>
                      </div>
                      <p
                        className="text-[9px] sm:text-[10px] font-semibold mb-0.5 uppercase tracking-wide relative z-10"
                        style={{
                          color: "#787E9D",
                          fontFamily: "'Roboto', sans-serif",
                        }}
                      >
                        Hold
                      </p>
                      <div className="mt-auto flex flex-col relative z-10">
                        <div className="hidden sm:flex -space-x-1.5 mb-0.5">
                          {allUsers
                            .filter((u) => u.approval_status === "hold")
                            .slice(0, 2)
                            .map((user, index) =>
                              user.profile_pic_url ? (
                                <img
                                  key={user.id}
                                  src={user.profile_pic_url}
                                  alt={user.user_name || "User"}
                                  className="w-5 h-5 rounded-full border-2 border-white object-cover"
                                />
                              ) : (
                                <div
                                  key={user.id}
                                  className="w-5 h-5 rounded-full border-2 border-white flex items-center justify-center text-[9px] font-semibold text-white bg-orange-500"
                                >
                                  {user.user_name
                                    ? user.user_name.charAt(0).toUpperCase()
                                    : "U"}
                                </div>
                              )
                            )}
                          {animatedStats.hold > 2 && (
                            <div
                              className="hidden sm:flex w-5 h-5 rounded-full border-2 border-white bg-gray-200 items-center justify-center text-[9px] font-semibold"
                              style={{ color: "#263238" }}
                            >
                              +{animatedStats.hold - 2}
                            </div>
                          )}
                        </div>
                        <p
                          className="text-base sm:text-lg font-bold"
                          style={{
                            color: "#F97316",
                            fontFamily: "'Poppins', sans-serif",
                          }}
                        >
                          {animatedStats.hold}
                        </p>
                      </div>
                    </div>

                    {/* Suspend */}
                    <div
                      onClick={() => {
                        setFilters({
                          approval_status: "suspend",
                          role: "",
                          department: "",
                          designation: "",
                          work_type: "",
                          user_type: "",
                          status: "",
                        });
                      }}
                      className="relative rounded-tr-xl rounded-br-xl rounded-bl-xl pl-3 pr-1.5 py-1.5 sm:pl-4 sm:pr-2 sm:py-2 border-[1.8px] border-gray-300 flex flex-col bg-white overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                      title="Click to filter suspended users"
                    >
                      {/* Background Icon */}
                      <div className="absolute -right-2 -bottom-2 opacity-5">
                        <i
                          className="fi flex fi-rr-ban text-4xl sm:text-5xl"
                          style={{ color: "#EF4444" }}
                        ></i>
                      </div>
                      <p
                        className="text-[9px] sm:text-[10px] font-semibold mb-0.5 uppercase tracking-wide relative z-10"
                        style={{
                          color: "#787E9D",
                          fontFamily: "'Roboto', sans-serif",
                        }}
                      >
                        Suspend
                      </p>
                      <div className="mt-auto flex flex-col relative z-10">
                        <div className="hidden sm:flex -space-x-1.5 mb-0.5">
                          {allUsers
                            .filter((u) => u.approval_status === "suspend")
                            .slice(0, 2)
                            .map((user, index) =>
                              user.profile_pic_url ? (
                                <img
                                  key={user.id}
                                  src={user.profile_pic_url}
                                  alt={user.user_name || "User"}
                                  className="w-5 h-5 rounded-full border-2 border-white object-cover"
                                />
                              ) : (
                                <div
                                  key={user.id}
                                  className="w-5 h-5 rounded-full border-2 border-white flex items-center justify-center text-[9px] font-semibold text-white bg-red-500"
                                >
                                  {user.user_name
                                    ? user.user_name.charAt(0).toUpperCase()
                                    : "U"}
                                </div>
                              )
                            )}
                          {animatedStats.suspend > 2 && (
                            <div
                              className="hidden sm:flex w-5 h-5 rounded-full border-2 border-white bg-gray-200 items-center justify-center text-[9px] font-semibold"
                              style={{ color: "#263238" }}
                            >
                              +{animatedStats.suspend - 2}
                            </div>
                          )}
                        </div>
                        <p
                          className="text-base sm:text-lg font-bold"
                          style={{
                            color: "#EF4444",
                            fontFamily: "'Poppins', sans-serif",
                          }}
                        >
                          {animatedStats.suspend}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Fourth Tile - Salary or Invite POSP Agent */}
                {userTypeToggle === "posp_agent" ? (
                  <div
                    className="relative overflow-hidden rounded-2xl p-3 sm:p-4 transition-all duration-200 flex flex-col text-white"
                    style={{
                      background:
                        "linear-gradient(135deg, #FF6B35 0%, #F7931E 50%, #FF8C42 100%)",
                    }}
                  >
                    {/* Mail-box Image - Background */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-20">
                      <img
                        src="/mail-box.png"
                        alt="Mail Box"
                        className="w-32 h-32 sm:w-40 sm:h-40 object-contain"
                      />
                    </div>

                    <div className="relative flex flex-col flex-1 z-10">
                      <div className="flex items-start justify-between mb-1">
                        <div className="flex-1">
                          <h2
                            className="text-sm sm:text-base font-bold mb-0.5 text-white"
                            style={{ fontFamily: "'Poppins', sans-serif" }}
                          >
                            Invite POSP Agent
                          </h2>
                          <div className="flex items-center gap-1.5 mb-1"></div>
                        </div>
                      </div>

                      <div className="mt-auto">
                        <div className="mb-3">
                          <p
                            className="text-[9px] sm:text-[10px] font-semibold mb-0.5 uppercase tracking-wide text-white/80"
                            style={{ fontFamily: "'Roboto', sans-serif" }}
                          >
                            Invite your POSP agent to join
                          </p>
                        </div>

                        {/* Invite Button */}
                        <button
                          onClick={() => {
                            setShowInviteModal(true);
                          }}
                          className="w-full bg-white text-orange-600 font-semibold py-2.5 px-4 rounded-lg hover:bg-gray-50 transition-colors text-sm flex items-center justify-center gap-2"
                          style={{ fontFamily: "'Poppins', sans-serif" }}
                        >
                          <i className="fi flex fi-rr-user-add text-base"></i>
                          <span>Invite</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div
                    className="relative overflow-hidden rounded-2xl p-3 sm:p-4 transition-all duration-200 backdrop-blur flex flex-col text-white"
                    style={{ backgroundColor: "#4b33e8" }}
                  >
                    <div
                      className="absolute inset-0"
                      style={{
                        background:
                          "radial-gradient(circle at top left, rgba(255,255,255,0.28), transparent 55%)",
                      }}
                    />
                    <div className="absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
                    {/* Background Icon */}
                    <div className="absolute -right-2 -bottom-2 opacity-10">
                      <i className="fi flex fi-rr-coins text-5xl sm:text-6xl text-white"></i>
                    </div>
                    <div className="relative flex flex-col flex-1">
                      <div className="flex items-start justify-between mb-1">
                        <div className="flex-1">
                          <h2
                            className="text-sm sm:text-base font-bold mb-0.5 text-white"
                            style={{ fontFamily: "'Poppins', sans-serif" }}
                          >
                            Salary
                          </h2>
                          <div className="flex items-center gap-1.5 mb-1">
                            <div className="flex items-center justify-center w-6 h-6 rounded-lg bg-white/20">
                              <i className="fi flex fi-rr-calendar text-xs text-white"></i>
                            </div>
                            <span
                              className="text-[10px] sm:text-xs text-white/80"
                              style={{ fontFamily: "'Roboto', sans-serif" }}
                            >
                              {getCurrentDate()} overview
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center justify-center w-9 h-9 rounded-lg border border-white/30 bg-white/10 backdrop-blur-lg text-white/90">
                          <span className="text-base font-bold">₹</span>
                        </div>
                      </div>

                      {loadingStats ? (
                        <div className="animate-pulse">
                          <div className="h-10 bg-white/20 rounded-lg w-28 mb-2"></div>
                        </div>
                      ) : (
                        <div className="mt-auto">
                          <div>
                            <p
                              className="text-[9px] sm:text-[10px] font-semibold mb-0.5 uppercase tracking-wide text-white/80"
                              style={{ fontFamily: "'Roboto', sans-serif" }}
                            >
                              Total Salary
                            </p>
                            <p
                              className="text-lg sm:text-xl font-bold text-white"
                              style={{ fontFamily: "'Poppins', sans-serif" }}
                            >
                              ₹
                              {animatedStats.totalSalary
                                .toString()
                                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                            </p>
                          </div>
                          <p
                            className="text-[10px] sm:text-xs mt-1 text-white/80"
                            style={{ fontFamily: "'Roboto', sans-serif" }}
                          >
                            Monthly payroll summary
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Approval Pending Section - Only show when there are pending users or while loading */}
              {(loadingPendingUsers || pendingUsers.length > 0) && (
                <div className="mt-8">
                  <h2
                    className="text-base sm:text-lg font-semibold mb-4"
                    style={{
                      color: "#263238",
                      fontFamily: "'Poppins', sans-serif",
                    }}
                  >
                    Approval Pending
                  </h2>

                  {loadingPendingUsers ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="animate-pulse rounded-xl bg-white p-3"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                            <div className="flex-1">
                              <div className="h-3.5 bg-gray-200 rounded w-24 mb-1.5"></div>
                              <div className="h-3 bg-gray-200 rounded w-20"></div>
                            </div>
                            <div className="h-7 bg-gray-200 rounded-full w-16"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {pendingUsers.map((pendingUser) => (
                        <div
                          key={pendingUser.id}
                          className="rounded-xl bg-white p-3 flex items-center gap-3 hover:shadow-sm transition-shadow"
                        >
                          {/* Profile Image */}
                          <div className="flex-shrink-0">
                            {pendingUser.profile_pic_url ? (
                              <img
                                src={pendingUser.profile_pic_url}
                                alt={pendingUser.user_name || "User"}
                                className="w-10 h-10 rounded-full object-cover"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold text-sm">
                                {pendingUser.user_name
                                  ? pendingUser.user_name
                                    .charAt(0)
                                    .toUpperCase()
                                  : "U"}
                              </div>
                            )}
                          </div>

                          {/* Name and Date */}
                          <div className="flex-1 min-w-0">
                            <h3
                              className="text-sm font-semibold text-gray-900 truncate"
                              style={{ fontFamily: "'Poppins', sans-serif" }}
                            >
                              {pendingUser.user_name || "N/A"}
                            </h3>
                            <p
                              className="text-xs text-gray-600 mt-0.5"
                              style={{ fontFamily: "'Roboto', sans-serif" }}
                            >
                              {formatDateWithYear(
                                pendingUser.date_of_joining ||
                                pendingUser.created_at
                              )}
                            </p>
                          </div>

                          {/* Buttons */}
                          <div className="flex items-center gap-2">
                            <button
                              onClick={async () => {
                                try {
                                  // Fetch full user data
                                  const {
                                    data: fullUserData,
                                    error: fetchError,
                                  } = await supabase
                                    .from("user_profiles")
                                    .select("*")
                                    .eq("id", pendingUser.id)
                                    .single();

                                  if (fetchError || !fullUserData) {
                                    alert("Failed to fetch user data");
                                    return;
                                  }

                                  // Set approval user data and form data
                                  setApprovalUserData(fullUserData as any);
                                  setApprovalFormData({
                                    role: (fullUserData.role as any) || "user",
                                    department:
                                      (fullUserData.department as any) ||
                                      "sales",
                                    designation:
                                      (fullUserData.designation as any) ||
                                      "agent",
                                    work_type:
                                      (fullUserData.work_type as any) ||
                                      "on_site",
                                    user_type:
                                      (fullUserData.user_type as any) ||
                                      "employee",
                                    status:
                                      (fullUserData.status as any) || "active",
                                  });
                                  setShowApprovalModal(true);
                                } catch (err) {
                                  console.error(
                                    "Error fetching user data:",
                                    err
                                  );
                                  alert("Failed to fetch user data");
                                }
                              }}
                              className="px-3 py-1 bg-green-100 hover:bg-green-200 text-green-700 font-semibold rounded-full transition-colors text-xs whitespace-nowrap"
                              style={{ fontFamily: "'Poppins', sans-serif" }}
                            >
                              Approved
                            </button>
                            <button
                              onClick={async () => {
                                try {
                                  const { error } = await supabase
                                    .from("user_profiles")
                                    .update({ approval_status: "rejected" })
                                    .eq("id", pendingUser.id);

                                  if (error) {
                                    console.error(
                                      "Error rejecting user:",
                                      error
                                    );
                                    alert("Failed to reject user");
                                  } else {
                                    // Refresh pending users list
                                    fetchPendingUsers();
                                    fetchUserStats(); // Refresh stats
                                  }
                                } catch (err) {
                                  console.error("Error rejecting user:", err);
                                  alert("Failed to reject user");
                                }
                              }}
                              className="w-[22px] h-[22px] flex items-center justify-center bg-red-100 hover:bg-red-200 text-red-600 rounded-full transition-colors"
                            >
                              <i className="fi flex fi-rr-cross font-extrabold text-[8px]"></i>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* All Users Section */}
              <div
                className={`mt-8 grid grid-cols-1 ${userTypeToggle === "posp_agent"
                    ? "lg:grid-cols-1"
                    : "lg:grid-cols-12"
                  } gap-6`}
              >
                {/* All Users Container - Reduced Width */}
                <div
                  className={`${userTypeToggle === "posp_agent"
                      ? "lg:col-span-1"
                      : "lg:col-span-9"
                    } bg-white rounded-xl p-6`}
                >
                  {/* Mobile: Stack title, search, actions | Desktop: Title left, search+actions right in same row */}
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 mb-4">
                    {/* Title */}
                    <h2
                      className="text-base sm:text-lg font-semibold"
                      style={{
                        color: "#263238",
                        fontFamily: "'Poppins', sans-serif",
                      }}
                    >
                      All users
                    </h2>

                    {/* Search + Actions container */}
                    <div className="flex flex-col lg:flex-row lg:items-center gap-3 w-full lg:w-auto">
                      {/* Search bar */}
                      <div className="w-full lg:w-auto">
                        <div className="relative w-full min-w-[180px] sm:min-w-[220px]">
                          <input
                            type="text"
                            placeholder="Search users..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-200 text-gray-700 rounded-xl text-sm focus:outline-none w-full sm:w-64 placeholder:text-gray-400"
                            style={{ fontFamily: "'Roboto', sans-serif" }}
                          />
                          {/* Search icon aligned vertically center */}
                          <i className="fi flex fi-rr-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs sm:text-sm"></i>
                        </div>
                      </div>

                      {/* Actions row */}
                      <div className="flex flex-wrap lg:flex-nowrap items-center gap-2 sm:gap-3 justify-start lg:justify-end w-full lg:w-auto">
                        {/* Filter button as separate control */}
                        <div className="relative">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowFilterDropdown(!showFilterDropdown);
                            }}
                            className="inline-flex items-center justify-center gap-2 px-3 h-[42px] w-[42px] sm:w-auto rounded-xl border border-gray-300 bg-white text-xs sm:text-sm text-gray-700 hover:bg-gray-50 transition-colors relative"
                            style={{ fontFamily: "'Poppins', sans-serif" }}
                          >
                            <i className="fi flex fi-rr-filter text-xs sm:text-sm"></i>
                            <span className="hidden xs:inline">Filters</span>
                          </button>
                          {(() => {
                            const activeFilterCount = Object.values(
                              filters
                            ).filter((f) => f !== "").length;
                            return activeFilterCount > 0 ? (
                              <span
                                onClick={(e) => {
                                  e.stopPropagation();
                                  // Clear all filters
                                  setFilters({
                                    approval_status: "",
                                    role: "",
                                    department: "",
                                    designation: "",
                                    work_type: "",
                                    user_type: "",
                                    status: "",
                                  });
                                }}
                                onMouseEnter={(e) => {
                                  const span = e.currentTarget;
                                  const originalText = span.textContent || "";
                                  span.style.backgroundColor = "#EF4444";
                                  span.innerHTML =
                                    '<i class="fi flex fi-rr-cross text-[8px]"></i>';
                                  span.setAttribute(
                                    "data-original",
                                    originalText
                                  );
                                }}
                                onMouseLeave={(e) => {
                                  const span = e.currentTarget;
                                  const originalText =
                                    span.getAttribute("data-original") ||
                                    activeFilterCount.toString();
                                  span.style.backgroundColor = "#4b33e8";
                                  span.textContent = originalText;
                                }}
                                className="absolute -top-1.5 -right-1.5 bg-[#4b33e8] text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 shadow-sm cursor-pointer transition-colors hover:bg-red-500 z-20"
                                title="Click to clear all filters"
                              >
                                {activeFilterCount > 99
                                  ? "99+"
                                  : activeFilterCount}
                              </span>
                            ) : null;
                          })()}

                          {/* Filter Dropdown */}
                          {showFilterDropdown && (
                            <>
                              <div
                                className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
                                onClick={() => setShowFilterDropdown(false)}
                              ></div>
                              <div
                                className="fixed md:absolute left-1/2 md:left-auto top-1/2 md:top-auto right-auto md:right-0 -translate-x-1/2 md:translate-x-0 -translate-y-1/2 md:translate-y-0 mt-0 md:mt-2 w-[90vw] max-w-[320px] md:w-80 md:max-w-none bg-white rounded-xl shadow-xl border border-gray-200 z-50 p-3"
                                style={{
                                  maxHeight: "400px",
                                  overflowY: "auto",
                                }}
                                onClick={(e) => e.stopPropagation()}
                              >
                                <div className="flex items-center justify-between mb-3">
                                  <div className="flex items-center gap-2">
                                    <h3
                                      className="text-sm font-semibold"
                                      style={{
                                        color: "#263238",
                                        fontFamily: "'Poppins', sans-serif",
                                      }}
                                    >
                                      Filters
                                    </h3>
                                    {(() => {
                                      const activeFilterCount = Object.values(
                                        filters
                                      ).filter((f) => f !== "").length;
                                      return activeFilterCount > 0 ? (
                                        <span
                                          onClick={() => {
                                            // Clear all filters
                                            setFilters({
                                              approval_status: "",
                                              role: "",
                                              department: "",
                                              designation: "",
                                              work_type: "",
                                              user_type: "",
                                              status: "",
                                            });
                                          }}
                                          onMouseEnter={(e) => {
                                            e.currentTarget.style.backgroundColor =
                                              "#EF4444";
                                            const originalText =
                                              e.currentTarget.textContent;
                                            e.currentTarget.innerHTML =
                                              '<i class="fi flex fi-rr-cross text-[8px]"></i>';
                                            e.currentTarget.setAttribute(
                                              "data-original",
                                              originalText || ""
                                            );
                                          }}
                                          onMouseLeave={(e) => {
                                            e.currentTarget.style.backgroundColor =
                                              "#4b33e8";
                                            const originalText =
                                              e.currentTarget.getAttribute(
                                                "data-original"
                                              ) || activeFilterCount.toString();
                                            e.currentTarget.textContent =
                                              originalText;
                                          }}
                                          className="bg-[#4b33e8] text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1.5 cursor-pointer transition-colors hover:bg-red-500"
                                          title="Click to clear all filters"
                                        >
                                          {activeFilterCount}
                                        </span>
                                      ) : null;
                                    })()}
                                  </div>
                                  <button
                                    onClick={() => {
                                      setFilters({
                                        approval_status: "",
                                        role: "",
                                        department: "",
                                        designation: "",
                                        work_type: "",
                                        user_type: "",
                                        status: "",
                                      });
                                    }}
                                    className="text-xs text-[#4b33e8] hover:underline"
                                  >
                                    Clear All
                                  </button>
                                </div>

                                <div className="space-y-3">
                                  {/* Approval Status Filter */}
                                  <div>
                                    <label
                                      className="block text-xs font-medium mb-1.5"
                                      style={{
                                        color: "#263238",
                                        fontFamily: "'Poppins', sans-serif",
                                      }}
                                    >
                                      Approval Status
                                    </label>
                                    <select
                                      value={filters.approval_status}
                                      onChange={(e) =>
                                        setFilters((prev) => ({
                                          ...prev,
                                          approval_status: e.target
                                            .value as any,
                                        }))
                                      }
                                      className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#4b33e8]"
                                    >
                                      <option value="">All</option>
                                      <option value="approved">Approved</option>
                                      <option value="pending">Pending</option>
                                      <option value="hold">Hold</option>
                                      <option value="suspend">Suspended</option>
                                      <option value="rejected">Rejected</option>
                                    </select>
                                  </div>

                                  {/* Role Filter */}
                                  <div>
                                    <label
                                      className="block text-xs font-medium mb-1.5"
                                      style={{
                                        color: "#263238",
                                        fontFamily: "'Poppins', sans-serif",
                                      }}
                                    >
                                      Role
                                    </label>
                                    <select
                                      value={filters.role}
                                      onChange={(e) =>
                                        setFilters((prev) => ({
                                          ...prev,
                                          role: e.target.value as any,
                                        }))
                                      }
                                      className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#4b33e8]"
                                    >
                                      <option value="">All</option>
                                      <option value="user">User</option>
                                      <option value="admin">Admin</option>
                                      <option value="super_admin">
                                        Super Admin
                                      </option>
                                    </select>
                                  </div>

                                  {/* Department Filter */}
                                  <div>
                                    <label
                                      className="block text-xs font-medium mb-1.5"
                                      style={{
                                        color: "#263238",
                                        fontFamily: "'Poppins', sans-serif",
                                      }}
                                    >
                                      Department
                                    </label>
                                    <select
                                      value={filters.department}
                                      onChange={(e) =>
                                        setFilters((prev) => ({
                                          ...prev,
                                          department: e.target.value as any,
                                        }))
                                      }
                                      className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#4b33e8]"
                                    >
                                      <option value="">All</option>
                                      <option value="sales">Sales</option>
                                      <option value="renewal">Renewal</option>
                                      <option value="backend">Backend</option>
                                      <option value="management">
                                        Management
                                      </option>
                                      <option value="service">Service</option>
                                    </select>
                                  </div>

                                  {/* Designation Filter */}
                                  <div>
                                    <label
                                      className="block text-xs font-medium mb-1.5"
                                      style={{
                                        color: "#263238",
                                        fontFamily: "'Poppins', sans-serif",
                                      }}
                                    >
                                      Designation
                                    </label>
                                    <select
                                      value={filters.designation}
                                      onChange={(e) =>
                                        setFilters((prev) => ({
                                          ...prev,
                                          designation: e.target.value as any,
                                        }))
                                      }
                                      className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#4b33e8]"
                                    >
                                      <option value="">All</option>
                                      <option value="agent">Agent</option>
                                      <option value="manager">Manager</option>
                                      <option value="faculty_staff">
                                        Faculty Staff
                                      </option>
                                      <option value="team_leader">
                                        Team Leader
                                      </option>
                                      <option value="ceo">CEO</option>
                                      <option value="developer">
                                        Developer
                                      </option>
                                    </select>
                                  </div>

                                  {/* Work Type Filter */}
                                  <div>
                                    <label
                                      className="block text-xs font-medium mb-1.5"
                                      style={{
                                        color: "#263238",
                                        fontFamily: "'Poppins', sans-serif",
                                      }}
                                    >
                                      Work Type
                                    </label>
                                    <select
                                      value={filters.work_type}
                                      onChange={(e) =>
                                        setFilters((prev) => ({
                                          ...prev,
                                          work_type: e.target.value as any,
                                        }))
                                      }
                                      className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#4b33e8]"
                                    >
                                      <option value="">All</option>
                                      <option value="on_site">On Site</option>
                                      <option value="remote">Remote</option>
                                    </select>
                                  </div>

                                  {/* User Type Filter */}
                                  <div>
                                    <label
                                      className="block text-xs font-medium mb-1.5"
                                      style={{
                                        color: "#263238",
                                        fontFamily: "'Poppins', sans-serif",
                                      }}
                                    >
                                      User Type
                                    </label>
                                    <select
                                      value={filters.user_type}
                                      onChange={(e) =>
                                        setFilters((prev) => ({
                                          ...prev,
                                          user_type: e.target.value as any,
                                        }))
                                      }
                                      className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#4b33e8]"
                                    >
                                      <option value="">All</option>
                                      <option value="employee">Employee</option>
                                      <option value="posp_agent">
                                        POSP Agent
                                      </option>
                                    </select>
                                  </div>

                                  {/* Status Filter */}
                                  <div>
                                    <label
                                      className="block text-xs font-medium mb-1.5"
                                      style={{
                                        color: "#263238",
                                        fontFamily: "'Poppins', sans-serif",
                                      }}
                                    >
                                      Status
                                    </label>
                                    <select
                                      value={filters.status}
                                      onChange={(e) =>
                                        setFilters((prev) => ({
                                          ...prev,
                                          status: e.target.value as any,
                                        }))
                                      }
                                      className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#4b33e8]"
                                    >
                                      <option value="">All</option>
                                      <option value="active">Active</option>
                                      <option value="inactive">Inactive</option>
                                    </select>
                                  </div>
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                        {/* Bulk Delete Button - Show when users are selected */}
                        {selectedUsers.length > 0 && (
                          <button
                            onClick={async () => {
                              if (
                                !confirm(
                                  `Are you sure you want to delete ${selectedUsers.length} user(s)? This action cannot be undone.`
                                )
                              ) {
                                return;
                              }

                              try {
                                const {
                                  data: { session },
                                } = await supabase.auth.getSession();
                                if (!session) {
                                  alert(
                                    "You must be logged in to delete users"
                                  );
                                  return;
                                }

                                const response = await fetch(
                                  "/api/auth/bulk-delete-users",
                                  {
                                    method: "DELETE",
                                    headers: {
                                      "Content-Type": "application/json",
                                      Authorization: `Bearer ${session.access_token}`,
                                    },
                                    body: JSON.stringify({
                                      userIds: selectedUsers,
                                    }),
                                  }
                                );

                                const data = await response.json();

                                if (!response.ok) {
                                  alert(data.error || "Failed to delete users");
                                  return;
                                }

                                alert(
                                  `Successfully deleted ${data.deletedCount || selectedUsers.length
                                  } user(s).${data.errors && data.errors.length > 0
                                    ? `\n\nErrors:\n${data.errors.join("\n")}`
                                    : ""
                                  }`
                                );

                                // Clear selection
                                setSelectedUsers([]);

                                // Refresh data
                                fetchAllUsers();
                                fetchUserStats();
                                fetchPendingUsers();
                              } catch (err: any) {
                                console.error("Bulk delete error:", err);
                                alert(
                                  "Failed to delete users: " +
                                  (err.message || "Unknown error")
                                );
                              }
                            }}
                            className="h-[42px] w-[42px] flex items-center justify-center border border-red-300 rounded-xl bg-red-50 hover:bg-red-100 transition-colors relative"
                            title={`Delete ${selectedUsers.length} selected user(s)`}
                          >
                            <i className="fi flex fi-rr-trash text-red-600 text-sm"></i>
                            {selectedUsers.length > 0 && (
                              <span
                                onClick={(e) => {
                                  e.stopPropagation();
                                  // Clear selection
                                  setSelectedUsers([]);
                                }}
                                onMouseEnter={(e) => {
                                  const span = e.currentTarget;
                                  const originalText = span.textContent || "";
                                  span.style.backgroundColor = "#EF4444";
                                  span.innerHTML =
                                    '<i class="fi flex fi-rr-cross text-[8px]"></i>';
                                  span.setAttribute(
                                    "data-original",
                                    originalText
                                  );
                                }}
                                onMouseLeave={(e) => {
                                  const span = e.currentTarget;
                                  const originalText =
                                    span.getAttribute("data-original") ||
                                    selectedUsers.length.toString();
                                  span.style.backgroundColor = "#DC2626";
                                  span.textContent = originalText;
                                }}
                                className="absolute -top-1.5 -right-1.5 bg-red-600 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 shadow-sm z-20 cursor-pointer transition-colors hover:bg-red-700"
                                title="Click to clear selection"
                              >
                                {selectedUsers.length > 99
                                  ? "99+"
                                  : selectedUsers.length}
                              </span>
                            )}
                          </button>
                        )}
                        <div className="flex items-center gap-1 rounded-lg border border-gray-300 bg-white p-1 h-[42px]">
                          <button
                            onClick={() => setViewType("grid")}
                            className={`inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-8 w-8 ${viewType === "grid"
                                ? "bg-[#4b33e8] text-white hover:opacity-90"
                                : "hover:bg-gray-100 text-gray-600"
                              }`}
                            title="Grid view"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="h-4 w-4"
                            >
                              <rect
                                width="7"
                                height="7"
                                x="3"
                                y="3"
                                rx="1"
                              ></rect>
                              <rect
                                width="7"
                                height="7"
                                x="14"
                                y="3"
                                rx="1"
                              ></rect>
                              <rect
                                width="7"
                                height="7"
                                x="14"
                                y="14"
                                rx="1"
                              ></rect>
                              <rect
                                width="7"
                                height="7"
                                x="3"
                                y="14"
                                rx="1"
                              ></rect>
                            </svg>
                          </button>
                          <button
                            onClick={() => setViewType("list")}
                            className={`inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-8 w-8 ${viewType === "list"
                                ? "bg-[#4b33e8] text-white hover:opacity-90"
                                : "hover:bg-gray-100 text-gray-600"
                              }`}
                            title="List view"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="h-4 w-4"
                            >
                              <path d="M3 12h.01"></path>
                              <path d="M3 18h.01"></path>
                              <path d="M3 6h.01"></path>
                              <path d="M8 12h13"></path>
                              <path d="M8 18h13"></path>
                              <path d="M8 6h13"></path>
                            </svg>
                          </button>
                        </div>
                        <button
                          onClick={() => setShowImportModal(true)}
                          className="h-[42px] w-[42px] flex items-center justify-center border border-gray-300 rounded-xl bg-white hover:bg-gray-50 transition-colors"
                          title="Import Users"
                        >
                          <i className="fi flex fi-rr-upload text-gray-600 text-sm"></i>
                        </button>
                        <button
                          onClick={exportToCSV}
                          className="h-[42px] w-[42px] flex items-center justify-center border border-gray-300 rounded-xl bg-white hover:bg-gray-50 transition-colors relative"
                          title={
                            selectedUsers.length > 0
                              ? `Export ${selectedUsers.length} selected user(s)`
                              : "Export"
                          }
                          disabled={selectedUsers.length === 0}
                        >
                          <i className="fi flex fi-rr-download text-gray-600 text-sm"></i>
                          {selectedUsers.length > 0 && (
                            <span
                              onClick={(e) => {
                                e.stopPropagation();
                                // Clear selection
                                setSelectedUsers([]);
                              }}
                              onMouseEnter={(e) => {
                                const span = e.currentTarget;
                                const originalText = span.textContent || "";
                                span.style.backgroundColor = "#EF4444";
                                span.innerHTML =
                                  '<i class="fi flex fi-rr-cross text-[8px]"></i>';
                                span.setAttribute(
                                  "data-original",
                                  originalText
                                );
                              }}
                              onMouseLeave={(e) => {
                                const span = e.currentTarget;
                                const originalText =
                                  span.getAttribute("data-original") ||
                                  selectedUsers.length.toString();
                                span.style.backgroundColor = "#4b33e8";
                                span.textContent = originalText;
                              }}
                              className="absolute -top-1.5 -right-1.5 bg-[#4b33e8] text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 shadow-sm cursor-pointer transition-colors hover:bg-red-500 z-20"
                              title="Click to clear selection"
                            >
                              {selectedUsers.length > 99
                                ? "99+"
                                : selectedUsers.length}
                            </span>
                          )}
                        </button>
                        <button
                          onClick={() => setShowAddUserModal(true)}
                          className="px-6 h-[42px] w-[42px] text-white font-semibold rounded-xl transition-colors text-sm flex items-center justify-center gap-2 hover:opacity-90"
                          style={{
                            fontFamily: "'Poppins', sans-serif",
                            backgroundColor: "#4b33e8",
                          }}
                        >
                          <i className="fi flex fi-rr-user-add text-base"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="border-t border-gray-200"></div>

                  {/* All Users Cards */}
                  {!mounted ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                      {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div
                          key={i}
                          className="animate-pulse bg-white rounded-2xl p-6 border border-gray-200"
                        >
                          <div className="flex justify-between items-start mb-4">
                            <div className="h-6 w-16 bg-gray-200 rounded"></div>
                            <div className="h-4 w-4 bg-gray-200 rounded"></div>
                          </div>
                          <div className="flex flex-col items-center mb-4">
                            <div className="w-20 h-20 bg-gray-200 rounded-full mb-3"></div>
                            <div className="h-5 w-32 bg-gray-200 rounded mb-2"></div>
                            <div className="h-4 w-20 bg-gray-200 rounded"></div>
                          </div>
                          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                            <div className="h-4 bg-gray-200 rounded w-24"></div>
                            <div className="h-4 bg-gray-200 rounded w-32"></div>
                            <div className="h-4 bg-gray-200 rounded w-40"></div>
                            <div className="h-4 bg-gray-200 rounded w-32"></div>
                          </div>
                          <div className="mt-4 flex justify-between items-center">
                            <div className="h-4 bg-gray-200 rounded w-32"></div>
                            <div className="h-4 bg-gray-200 rounded w-20"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : loadingAllUsers ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                      {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div
                          key={i}
                          className="animate-pulse bg-white rounded-2xl p-6 border border-gray-200"
                        >
                          <div className="flex justify-between items-start mb-4">
                            <div className="h-6 w-16 bg-gray-200 rounded"></div>
                            <div className="h-4 w-4 bg-gray-200 rounded"></div>
                          </div>
                          <div className="flex flex-col items-center mb-4">
                            <div className="w-20 h-20 bg-gray-200 rounded-full mb-3"></div>
                            <div className="h-5 w-32 bg-gray-200 rounded mb-2"></div>
                            <div className="h-4 w-20 bg-gray-200 rounded"></div>
                          </div>
                          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                            <div className="h-4 bg-gray-200 rounded w-24"></div>
                            <div className="h-4 bg-gray-200 rounded w-32"></div>
                            <div className="h-4 bg-gray-200 rounded w-40"></div>
                            <div className="h-4 bg-gray-200 rounded w-32"></div>
                          </div>
                          <div className="mt-4 flex justify-between items-center">
                            <div className="h-4 bg-gray-200 rounded w-32"></div>
                            <div className="h-4 bg-gray-200 rounded w-20"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : allUsers.length > 0 ? (
                    viewType === "grid" ? (
                      filteredUsers.length > 0 ? (
                        <div className="mt-6 grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                          {filteredUsers.map((user) => (
                            <div
                              key={user.id}
                              className="bg-white rounded-xl md:rounded-2xl p-2 md:p-4 border border-gray-200 hover:shadow-lg transition-shadow relative cursor-pointer md:cursor-default"
                              onClick={(e) => {
                                // Only navigate on mobile when clicking the card (not on checkboxes or menu)
                                if (
                                  window.innerWidth < 768 &&
                                  !(e.target as HTMLElement).closest(
                                    "input, button"
                                  )
                                ) {
                                  router.push(`/users/${user.id}`);
                                }
                              }}
                            >
                              {/* Status Badge and Menu */}
                              <div className="flex justify-between items-start mb-2 md:mb-3">
                                <div className="flex items-center gap-1 md:gap-2">
                                  <input
                                    type="checkbox"
                                    className="rounded border-gray-300 w-4 h-4 md:w-4 md:h-4 cursor-pointer"
                                    checked={selectedUsers.includes(user.id)}
                                    onChange={(e) => {
                                      e.stopPropagation();
                                      handleCheckboxChange(
                                        user.id,
                                        e.target.checked
                                      );
                                    }}
                                    onClick={(e) => e.stopPropagation()}
                                  />
                                  <div
                                    className={`${user.status === "active"
                                        ? "px-0 md:px-2"
                                        : "px-1.5 md:px-2"
                                      } py-0.5 md:rounded-lg flex items-center gap-1 md:gap-1.5 ${user.status === "active"
                                        ? "md:bg-green-100"
                                        : user.status === "inactive"
                                          ? "bg-gray-100"
                                          : "bg-gray-100"
                                      }`}
                                  >
                                    <div
                                      className={`w-1.5 h-1.5 rounded-full ${user.status === "active"
                                          ? "bg-green-500"
                                          : user.status === "inactive"
                                            ? "bg-gray-400"
                                            : "bg-gray-400"
                                        }`}
                                    ></div>
                                    <span
                                      className={`text-[10px] font-semibold ${user.status === "active"
                                          ? "text-green-700 hidden md:inline"
                                          : "text-gray-600"
                                        }`}
                                    >
                                      {user.status === "active"
                                        ? "Active"
                                        : user.status === "inactive"
                                          ? "Inactive"
                                          : "Pending"}
                                    </span>
                                  </div>
                                  {/* Hold Badge with Hover Tooltip */}
                                  {user.approval_status === "hold" && (
                                    <HoldBadgeWithTooltip
                                      user={user}
                                      allUsers={allUsers}
                                    />
                                  )}
                                  {/* Suspended Badge with Hover Tooltip */}
                                  {user.approval_status === "suspend" && (
                                    <SuspendedBadgeWithTooltip user={user} />
                                  )}
                                </div>
                                <UserMenuDropdown
                                  user={user}
                                  isOpen={
                                    openMenuId === user.id &&
                                    viewType === "grid"
                                  }
                                  onToggle={() =>
                                    setOpenMenuId(
                                      openMenuId === user.id ? null : user.id
                                    )
                                  }
                                  viewType={viewType}
                                  onApprovalStatusChange={handleStatusChange}
                                  onWorkTypeChange={handleWorkTypeChange}
                                  onUserTypeChange={handleUserTypeChange}
                                  onRoleChange={handleRoleChange}
                                  onDepartmentChange={handleDepartmentChange}
                                  onDesignationChange={handleDesignationChange}
                                  onStatusChange={handleUserStatusChange}
                                  onDelete={handleDeleteUser}
                                  openApprovalDropdown={openApprovalDropdown}
                                  openWorkTypeDropdown={openWorkTypeDropdown}
                                  openUserTypeDropdown={openUserTypeDropdown}
                                  openRoleDropdown={openRoleDropdown}
                                  openDepartmentDropdown={
                                    openDepartmentDropdown
                                  }
                                  openDesignationDropdown={
                                    openDesignationDropdown
                                  }
                                  setOpenApprovalDropdown={
                                    setOpenApprovalDropdown
                                  }
                                  setOpenWorkTypeDropdown={
                                    setOpenWorkTypeDropdown
                                  }
                                  setOpenUserTypeDropdown={
                                    setOpenUserTypeDropdown
                                  }
                                  setOpenRoleDropdown={setOpenRoleDropdown}
                                  setOpenDepartmentDropdown={
                                    setOpenDepartmentDropdown
                                  }
                                  setOpenDesignationDropdown={
                                    setOpenDesignationDropdown
                                  }
                                  menuRef={(el) => {
                                    menuRefs.current[user.id] = el;
                                  }}
                                  onMenuClose={() => setOpenMenuId(null)}
                                />
                              </div>

                              {/* Profile Picture, Name, and Title */}
                              <div className="flex flex-col items-center mb-2 md:mb-3">
                                {user.profile_pic_url ? (
                                  <img
                                    src={user.profile_pic_url}
                                    alt={user.user_name || "User"}
                                    className="w-14 h-14 md:w-16 md:h-16 rounded-full object-cover mb-1.5 md:mb-2"
                                  />
                                ) : (
                                  <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold text-base md:text-xl mb-1.5 md:mb-2">
                                    {user.user_name
                                      ? user.user_name.charAt(0).toUpperCase()
                                      : "U"}
                                  </div>
                                )}
                                <h3
                                  className="text-sm md:text-base font-semibold text-gray-900 mb-0.5 text-center truncate w-full px-1"
                                  style={{
                                    fontFamily: "'Poppins', sans-serif",
                                  }}
                                >
                                  {user.user_name || "N/A"}
                                </h3>
                                {/* Role - Desktop only (shown below name) */}
                                <p
                                  className="hidden md:block text-xs text-gray-600 text-center"
                                  style={{ fontFamily: "'Roboto', sans-serif" }}
                                >
                                  {user.role || "Employee"}
                                </p>
                              </div>

                              {/* Employee ID . Role - Mobile (one row with dot separator) */}
                              <div className="text-center mb-2 md:mb-0">
                                <div
                                  className="text-[10px] font-medium flex items-center justify-center gap-1 md:hidden"
                                  style={{ fontFamily: "'Roboto', sans-serif" }}
                                >
                                  <span className="text-gray-700">
                                    {user.employee_id || "N/A"}
                                  </span>
                                  <span className="text-gray-400">•</span>
                                  <span className="text-gray-700">
                                    {user.role || "Employee"}
                                  </span>
                                </div>
                              </div>

                              {/* Information Box - Hidden on mobile */}
                              <div className="hidden md:block bg-gray-50 rounded-lg p-3 space-y-1.5 mb-3">
                                <div
                                  className="text-xs text-gray-700"
                                  style={{ fontFamily: "'Roboto', sans-serif" }}
                                >
                                  <span className="font-semibold">
                                    {user.employee_id || "N/A"}
                                  </span>
                                </div>

                                <div
                                  className="flex items-center gap-1.5 text-xs text-gray-700"
                                  style={{ fontFamily: "'Roboto', sans-serif" }}
                                >
                                  <i className="fi flex fi-rr-briefcase text-[10px] text-gray-500"></i>
                                  <span>{user.department || "Employee"}</span>
                                  <span className="mx-0.5">-</span>
                                  {user.work_type === "on_site" ? (
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="10"
                                      height="10"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      className="text-gray-500"
                                    >
                                      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                                      <polyline points="9 22 9 12 15 12 15 22"></polyline>
                                    </svg>
                                  ) : (
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="10"
                                      height="10"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      className="text-gray-500"
                                    >
                                      <rect
                                        x="2"
                                        y="7"
                                        width="20"
                                        height="14"
                                        rx="2"
                                        ry="2"
                                      ></rect>
                                      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                                    </svg>
                                  )}
                                  <span>
                                    {getWorkTypeLabel(user.work_type)}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1.5 text-xs">
                                  <i className="fi flex fi-rr-envelope text-[10px] text-gray-500"></i>
                                  <a
                                    href={`mailto:${user.email}`}
                                    className="text-blue-600 hover:underline"
                                    style={{
                                      fontFamily: "'Roboto', sans-serif",
                                    }}
                                    title={user.email || "N/A"}
                                  >
                                    {user.email && user.email.length > 22
                                      ? `${user.email.substring(0, 22)}...`
                                      : user.email || "N/A"}
                                  </a>
                                </div>
                                <div className="flex items-center gap-1.5 text-xs">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="10"
                                    height="10"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="text-gray-500"
                                  >
                                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                                  </svg>
                                  <a
                                    href={`tel:${user.contact_no}`}
                                    className="text-blue-600 hover:underline"
                                    style={{
                                      fontFamily: "'Roboto', sans-serif",
                                    }}
                                  >
                                    {user.contact_no || "N/A"}
                                  </a>
                                </div>
                              </div>

                              {/* Join Date and View Details - Hidden on mobile */}
                              <div
                                className="hidden md:flex justify-between items-center pt-3 border-t"
                                style={{ borderColor: "#4b33e8" }}
                              >
                                <div
                                  className="flex items-center gap-1.5 text-xs text-gray-600"
                                  style={{ fontFamily: "'Roboto', sans-serif" }}
                                >
                                  <i className="fi flex fi-rr-calendar text-[10px] text-gray-500"></i>
                                  <span>
                                    {formatDate(
                                      user.date_of_joining || user.created_at
                                    )}
                                  </span>
                                </div>
                                <button
                                  onClick={() =>
                                    router.push(`/users/${user.id}`)
                                  }
                                  className="text-blue-600 hover:underline text-xs font-medium flex items-center gap-1"
                                  style={{ fontFamily: "'Roboto', sans-serif" }}
                                >
                                  View details
                                  <i className="fi flex fi-rr-arrow-right text-[10px]"></i>
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="mt-6 text-center py-12">
                          <p
                            className="text-gray-500"
                            style={{ fontFamily: "'Roboto', sans-serif" }}
                          >
                            No users found matching your search or filters.
                          </p>
                        </div>
                      )
                    ) : filteredUsers.length > 0 ? (
                      <div className="mt-6 bg-white rounded-xl border border-gray-200 overflow-hidden">
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                              <tr>
                                <th className="px-2 md:px-6 py-3 md:py-5 text-left text-[10px] md:text-xs font-semibold text-gray-700 uppercase tracking-wider w-10 md:w-auto">
                                  <input
                                    type="checkbox"
                                    className="rounded border-gray-300 w-4 h-4 md:w-4 md:h-4"
                                    checked={
                                      filteredUsers.length > 0 &&
                                      selectedUsers.length ===
                                      filteredUsers.length
                                    }
                                    onChange={(e) => {
                                      if (e.target.checked) {
                                        setSelectedUsers(
                                          filteredUsers.map((u) => u.id)
                                        );
                                      } else {
                                        setSelectedUsers([]);
                                      }
                                    }}
                                  />
                                </th>
                                <th className="px-2 md:px-6 py-3 md:py-4 text-left text-[10px] md:text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[150px] md:min-w-[180px]">
                                  Name
                                </th>
                                <th className="px-2 md:px-6 py-3 md:py-4 text-left text-[10px] md:text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[80px] md:min-w-[100px]">
                                  Emp ID
                                </th>
                                <th className="px-2 md:px-6 py-3 md:py-4 text-left text-[10px] md:text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[80px] md:min-w-[100px]">
                                  Role
                                </th>
                                <th className="px-2 md:px-6 py-3 md:py-4 text-left text-[10px] md:text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[100px] md:min-w-[120px]">
                                  Status
                                </th>
                                <th className="px-2 md:px-6 py-3 md:py-4 text-left text-[10px] md:text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[120px] md:min-w-[180px]">
                                  Email
                                </th>
                                <th className="px-2 md:px-6 py-3 md:py-4 text-left text-[10px] md:text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[90px] md:min-w-[120px]">
                                  Joined Date
                                </th>
                                <th className="px-2 md:px-6 py-3 md:py-4 text-right text-[10px] md:text-xs font-semibold text-gray-700 uppercase tracking-wider w-10 md:w-auto">
                                  Action
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {filteredUsers.map((user) => (
                                <tr
                                  key={user.id}
                                  className="hover:bg-gray-50 transition-colors cursor-pointer"
                                  onClick={() =>
                                    router.push(`/users/${user.id}`)
                                  }
                                >
                                  <td
                                    className="px-2 md:px-6 py-3 md:py-5 whitespace-nowrap"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <input
                                      type="checkbox"
                                      className="rounded border-gray-300 w-4 h-4 md:w-4 md:h-4"
                                      checked={selectedUsers.includes(user.id)}
                                      onChange={(e) => {
                                        e.stopPropagation();
                                        handleCheckboxChange(
                                          user.id,
                                          e.target.checked
                                        );
                                      }}
                                      onClick={(e) => e.stopPropagation()}
                                    />
                                  </td>
                                  <td className="px-2 md:px-6 py-3 md:py-5 whitespace-nowrap">
                                    <div className="flex items-center gap-1.5 md:gap-3">
                                      {user.profile_pic_url ? (
                                        <img
                                          src={user.profile_pic_url}
                                          alt={user.user_name || "User"}
                                          className="w-7 h-7 md:w-10 md:h-10 rounded-full object-cover"
                                        />
                                      ) : (
                                        <div className="w-7 h-7 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold text-xs md:text-sm">
                                          {user.user_name
                                            ? user.user_name
                                              .charAt(0)
                                              .toUpperCase()
                                            : "U"}
                                        </div>
                                      )}
                                      <span
                                        className="text-xs md:text-sm font-medium text-gray-900"
                                        style={{
                                          fontFamily: "'Poppins', sans-serif",
                                        }}
                                      >
                                        {user.user_name || "N/A"}
                                      </span>
                                    </div>
                                  </td>
                                  <td className="px-2 md:px-6 py-3 md:py-5 whitespace-nowrap">
                                    <span
                                      className="text-xs md:text-sm text-gray-600"
                                      style={{
                                        fontFamily: "'Roboto', sans-serif",
                                      }}
                                    >
                                      {user.employee_id || "N/A"}
                                    </span>
                                  </td>
                                  <td className="px-2 md:px-6 py-3 md:py-5 whitespace-nowrap">
                                    <span
                                      className="text-xs md:text-sm text-gray-600"
                                      style={{
                                        fontFamily: "'Roboto', sans-serif",
                                      }}
                                    >
                                      {user.role || "Employee"}
                                    </span>
                                  </td>
                                  <td className="px-2 md:px-6 py-3 md:py-5 whitespace-nowrap">
                                    <div className="flex items-center gap-1 md:gap-2 flex-wrap">
                                      <div
                                        className={`px-1.5 md:px-2.5 py-0.5 md:py-1 rounded-full inline-flex items-center gap-1 md:gap-1.5 ${user.status === "active"
                                            ? "bg-green-100"
                                            : user.status === "inactive"
                                              ? "bg-gray-100"
                                              : "bg-orange-100"
                                          }`}
                                      >
                                        <div
                                          className={`w-1 h-1 md:w-1.5 md:h-1.5 rounded-full ${user.status === "active"
                                              ? "bg-green-500"
                                              : user.status === "inactive"
                                                ? "bg-gray-400"
                                                : "bg-orange-400"
                                            }`}
                                        ></div>
                                        <span
                                          className={`text-[10px] md:text-xs font-semibold ${user.status === "active"
                                              ? "text-green-700"
                                              : user.status === "inactive"
                                                ? "text-gray-600"
                                                : "text-orange-700"
                                            }`}
                                        >
                                          {user.status === "active"
                                            ? "Active"
                                            : user.status === "inactive"
                                              ? "Inactive"
                                              : "Pending"}
                                        </span>
                                      </div>
                                      {/* Hold Badge with Hover Tooltip */}
                                      {user.approval_status === "hold" && (
                                        <div
                                          onClick={(e) => e.stopPropagation()}
                                        >
                                          <HoldBadgeWithTooltip
                                            user={user}
                                            allUsers={allUsers}
                                          />
                                        </div>
                                      )}
                                      {/* Suspended Badge with Hover Tooltip */}
                                      {user.approval_status === "suspend" && (
                                        <div
                                          onClick={(e) => e.stopPropagation()}
                                        >
                                          <SuspendedBadgeWithTooltip
                                            user={user}
                                          />
                                        </div>
                                      )}
                                    </div>
                                  </td>
                                  <td className="px-2 md:px-6 py-3 md:py-5 whitespace-nowrap">
                                    <span
                                      className="text-xs md:text-sm text-gray-600"
                                      style={{
                                        fontFamily: "'Roboto', sans-serif",
                                      }}
                                    >
                                      {user.email || "N/A"}
                                    </span>
                                  </td>
                                  <td className="px-2 md:px-6 py-3 md:py-5 whitespace-nowrap">
                                    <span
                                      className="text-xs md:text-sm text-gray-600"
                                      style={{
                                        fontFamily: "'Roboto', sans-serif",
                                      }}
                                    >
                                      {formatDate(
                                        user.date_of_joining || user.created_at
                                      )}
                                    </span>
                                  </td>
                                  <td
                                    className="px-2 md:px-6 py-3 md:py-5 whitespace-nowrap text-right"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <UserMenuDropdown
                                      user={user}
                                      isOpen={
                                        openMenuId === user.id &&
                                        viewType === "list"
                                      }
                                      onToggle={(e?: React.MouseEvent) => {
                                        if (e) {
                                          e.stopPropagation();
                                          if (openMenuId === user.id) {
                                            setOpenMenuId(null);
                                            setMenuPosition(null);
                                          } else {
                                            const button =
                                              e.currentTarget as HTMLElement;
                                            const rect =
                                              button.getBoundingClientRect();
                                            const menuHeight = 400; // Approximate menu height (increased for dropdowns)
                                            const spaceBelow =
                                              window.innerHeight - rect.bottom;
                                            const spaceAbove = rect.top;

                                            // Position menu above if not enough space below, but enough space above
                                            const shouldPositionAbove =
                                              spaceBelow < menuHeight &&
                                              spaceAbove > menuHeight;

                                            setMenuPosition({
                                              top: shouldPositionAbove
                                                ? rect.top - menuHeight - 8
                                                : rect.bottom + 8,
                                              right:
                                                window.innerWidth - rect.right,
                                            });
                                            setOpenMenuId(user.id);
                                          }
                                        } else {
                                          setOpenMenuId(
                                            openMenuId === user.id
                                              ? null
                                              : user.id
                                          );
                                        }
                                      }}
                                      viewType={viewType}
                                      menuPosition={menuPosition}
                                      onApprovalStatusChange={
                                        handleStatusChange
                                      }
                                      onWorkTypeChange={handleWorkTypeChange}
                                      onUserTypeChange={handleUserTypeChange}
                                      onRoleChange={handleRoleChange}
                                      onDepartmentChange={
                                        handleDepartmentChange
                                      }
                                      onDesignationChange={
                                        handleDesignationChange
                                      }
                                      onStatusChange={handleUserStatusChange}
                                      onDelete={handleDeleteUser}
                                      openApprovalDropdown={
                                        openApprovalDropdown
                                      }
                                      openWorkTypeDropdown={
                                        openWorkTypeDropdown
                                      }
                                      openUserTypeDropdown={
                                        openUserTypeDropdown
                                      }
                                      openRoleDropdown={openRoleDropdown}
                                      openDepartmentDropdown={
                                        openDepartmentDropdown
                                      }
                                      openDesignationDropdown={
                                        openDesignationDropdown
                                      }
                                      setOpenApprovalDropdown={
                                        setOpenApprovalDropdown
                                      }
                                      setOpenWorkTypeDropdown={
                                        setOpenWorkTypeDropdown
                                      }
                                      setOpenUserTypeDropdown={
                                        setOpenUserTypeDropdown
                                      }
                                      setOpenRoleDropdown={setOpenRoleDropdown}
                                      setOpenDepartmentDropdown={
                                        setOpenDepartmentDropdown
                                      }
                                      setOpenDesignationDropdown={
                                        setOpenDesignationDropdown
                                      }
                                      menuRef={(el) => {
                                        menuRefs.current[user.id] = el;
                                      }}
                                      onMenuClose={() => {
                                        setOpenMenuId(null);
                                        setMenuPosition(null);
                                      }}
                                    />
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ) : (
                      <div className="mt-6 text-center py-12">
                        <p
                          className="text-gray-500"
                          style={{ fontFamily: "'Roboto', sans-serif" }}
                        >
                          No users found matching your search or filters.
                        </p>
                      </div>
                    )
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      No users found
                    </div>
                  )}
                </div>

                {/* Right Side Tiles - Designation, Work Type, Department */}
                {userTypeToggle !== "posp_agent" && (
                  <div className="hidden lg:block lg:col-span-3 space-y-4">
                    {/* Designation Tile */}
                    <div className="bg-white rounded-2xl p-3 sm:p-4 border border-gray-200">
                      <div className="flex items-center justify-between mb-3">
                        <h3
                          className="text-sm font-semibold"
                          style={{
                            color: "#263238",
                            fontFamily: "'Poppins', sans-serif",
                          }}
                        >
                          Designations
                        </h3>
                        <i
                          className="fi flex fi-rr-badge text-base"
                          style={{ color: "#4b33e8" }}
                        ></i>
                      </div>
                      <div className="space-y-2">
                        {(
                          [
                            "agent",
                            "manager",
                            "faculty_staff",
                            "team_leader",
                            "ceo",
                            "developer",
                          ] as const
                        ).map((designation) => {
                          const count = designationStats[designation] || 0;
                          const isActive = filters.designation === designation;
                          return (
                            <div
                              key={designation}
                              onClick={() => {
                                setFilters((prev) => ({
                                  ...prev,
                                  designation:
                                    prev.designation === designation
                                      ? ""
                                      : designation,
                                }));
                              }}
                              className={`flex items-center justify-between p-2 rounded-lg transition-colors cursor-pointer ${isActive
                                  ? "bg-[#4b33e8] text-white"
                                  : "bg-gray-50 hover:bg-gray-100"
                                }`}
                            >
                              <span
                                className={`text-xs font-medium capitalize ${isActive ? "text-white" : "text-gray-700"
                                  }`}
                                style={{ fontFamily: "'Roboto', sans-serif" }}
                              >
                                {designation.replace("_", " ")}
                              </span>
                              <span
                                className={`text-xs font-bold px-2 py-0.5 rounded-full ${count > 0
                                    ? isActive
                                      ? "bg-white text-[#4b33e8]"
                                      : "bg-[#4b33e8] text-white"
                                    : "bg-gray-200 text-gray-500"
                                  }`}
                                style={{ fontFamily: "'Poppins', sans-serif" }}
                              >
                                {count}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Work Type Tile */}
                    <div className="bg-white rounded-2xl p-3 sm:p-4 border border-gray-200">
                      <div className="flex items-center justify-between mb-3">
                        <h3
                          className="text-sm font-semibold"
                          style={{
                            color: "#263238",
                            fontFamily: "'Poppins', sans-serif",
                          }}
                        >
                          Work Type
                        </h3>
                        <i
                          className="fi flex fi-rr-briefcase text-base"
                          style={{ color: "#4b33e8" }}
                        ></i>
                      </div>
                      <div className="space-y-2">
                        {(["on_site", "remote"] as const).map((workType) => {
                          const count = workTypeStats[workType] || 0;
                          const isActive = filters.work_type === workType;
                          return (
                            <div
                              key={workType}
                              onClick={() => {
                                setFilters((prev) => ({
                                  ...prev,
                                  work_type:
                                    prev.work_type === workType ? "" : workType,
                                }));
                              }}
                              className={`flex items-center justify-between p-2 rounded-lg transition-colors cursor-pointer ${isActive
                                  ? "bg-[#4b33e8] text-white"
                                  : "bg-gray-50 hover:bg-gray-100"
                                }`}
                            >
                              <span
                                className={`text-xs font-medium capitalize ${isActive ? "text-white" : "text-gray-700"
                                  }`}
                                style={{ fontFamily: "'Roboto', sans-serif" }}
                              >
                                {workType.replace("_", " ")}
                              </span>
                              <span
                                className={`text-xs font-bold px-2 py-0.5 rounded-full ${count > 0
                                    ? isActive
                                      ? "bg-white text-[#4b33e8]"
                                      : "bg-[#4b33e8] text-white"
                                    : "bg-gray-200 text-gray-500"
                                  }`}
                                style={{ fontFamily: "'Poppins', sans-serif" }}
                              >
                                {count}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Department Tile */}
                    <div className="bg-white rounded-2xl p-3 sm:p-4 border border-gray-200">
                      <div className="flex items-center justify-between mb-3">
                        <h3
                          className="text-sm font-semibold"
                          style={{
                            color: "#263238",
                            fontFamily: "'Poppins', sans-serif",
                          }}
                        >
                          Department
                        </h3>
                        <i
                          className="fi flex fi-rr-building text-base"
                          style={{ color: "#4b33e8" }}
                        ></i>
                      </div>
                      <div className="space-y-2">
                        {(
                          [
                            "sales",
                            "renewal",
                            "backend",
                            "management",
                            "service",
                          ] as const
                        ).map((department) => {
                          const count = departmentStats[department] || 0;
                          const isActive = filters.department === department;
                          return (
                            <div
                              key={department}
                              onClick={() => {
                                setFilters((prev) => ({
                                  ...prev,
                                  department:
                                    prev.department === department
                                      ? ""
                                      : department,
                                }));
                              }}
                              className={`flex items-center justify-between p-2 rounded-lg transition-colors cursor-pointer ${isActive
                                  ? "bg-[#4b33e8] text-white"
                                  : "bg-gray-50 hover:bg-gray-100"
                                }`}
                            >
                              <span
                                className={`text-xs font-medium capitalize ${isActive ? "text-white" : "text-gray-700"
                                  }`}
                                style={{ fontFamily: "'Roboto', sans-serif" }}
                              >
                                {department.replace("_", " ")}
                              </span>
                              <span
                                className={`text-xs font-bold px-2 py-0.5 rounded-full ${count > 0
                                    ? isActive
                                      ? "bg-white text-[#4b33e8]"
                                      : "bg-[#4b33e8] text-white"
                                    : "bg-gray-200 text-gray-500"
                                  }`}
                                style={{ fontFamily: "'Poppins', sans-serif" }}
                              >
                                {count}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Bottom Navigation - Mobile Only */}
      <BottomNav activeNav="users" userRole={user?.role || null} />
    </div>
  );
}
