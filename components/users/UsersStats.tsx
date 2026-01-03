import React from "react";
import { AllUser, UserFilters, UserStats } from "./types";
import { getCurrentDate } from "./utils";

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
  const areaPath = `${pathD} L ${width - padding},${height - padding} L ${padding},${height - padding
    } Z`;

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

interface UsersStatsProps {
  loadingStats: boolean;
  userStats: UserStats; // Usage of animatedStats in original, passing as prop
  allUsers: AllUser[];
  monthlyActiveUsers: { month: string; count: number }[];
  monthlyTotalUsers: { month: string; count: number }[];
  setFilters: React.Dispatch<React.SetStateAction<UserFilters>>;
  onInviteClick: () => void;
  userTypeToggle: string;
}

export function UsersStats({
  loadingStats,
  userStats,
  allUsers,
  monthlyActiveUsers,
  monthlyTotalUsers,
  setFilters,
  onInviteClick,
  userTypeToggle,
}: UsersStatsProps) {
  // Use userStats as animatedStats for now as per refactor plan
  const animatedStats = userStats;

  return (
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
            organization_id: "",
            is_caller: "",
            is_client: "",
          });
        }}
        className="relative overflow-hidden rounded-2xl p-3 sm:p-4 transition-all duration-200 flex flex-col hover:shadow-lg hover:scale-105 cursor-pointer"
        style={{ backgroundColor: "white" }}
        title="Click to filter active users"
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at top right, rgba(16, 185, 129, 0.12), transparent 60%)",
          }}
        />
        <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-green-200/20 blur-2xl" />
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
                {renderLineGraph(monthlyActiveUsers, "#10B981", "active")}
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
                          background: `linear-gradient(135deg, ${
                            ["#10B981", "#3B82F6", "#8B5CF6"][index]
                          } 0%, ${
                            ["#059669", "#2563EB", "#7C3AED"][index]
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
            organization_id: "",
            is_caller: "",
            is_client: "",
          });
        }}
        className="relative overflow-hidden rounded-2xl p-3 sm:p-4 transition-all duration-200 flex flex-col hover:shadow-lg hover:scale-105 cursor-pointer"
        style={{ backgroundColor: "white" }}
        title="Click to show all users"
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundColor:
              "radial-gradient(circle at top right, rgba(75, 51, 232, 0.12), transparent 60%)",
          }}
        />
        <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-purple-200/20 blur-2xl" />
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
                {renderLineGraph(monthlyTotalUsers, "#3B82F6", "total")}
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
                          background: `linear-gradient(135deg, ${
                            ["#3B82F6", "#8B5CF6", "#EC4899"][index]
                          } 0%, ${
                            ["#2563EB", "#7C3AED", "#DB2777"][index]
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
                    organization_id: "",
                    is_caller: "",
                    is_client: "",
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
                <span className="font-semibold" style={{ color: "#EF4444" }}>
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
                organization_id: "",
                is_caller: "",
                is_client: "",
              });
            }}
            className="relative rounded-tl-xl rounded-tr-xl rounded-bl-xl pl-3 pr-1.5 py-1.5 sm:pl-4 sm:pr-2 sm:py-2 flex flex-col bg-white overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
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
              className="text-xs sm:text-sm font-semibold mb-auto"
              style={{
                color: "#263238",
                fontFamily: "'Poppins', sans-serif",
              }}
            >
              Approved
            </p>
            <p
              className="text-lg sm:text-xl font-bold"
              style={{
                color: "#10B981",
                fontFamily: "'Poppins', sans-serif",
              }}
            >
              {animatedStats.approved}
            </p>
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
                organization_id: "",
                is_caller: "",
                is_client: "",
              });
            }}
            className="relative rounded-tl-xl rounded-tr-xl rounded-br-xl pl-3 pr-1.5 py-1.5 sm:pl-4 sm:pr-2 sm:py-2 flex flex-col bg-white overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
            title="Click to filter pending users"
          >
            {/* Background Icon */}
            <div className="absolute -right-2 -bottom-2 opacity-5">
              <i
                className="fi flex fi-rr-time-fast text-4xl sm:text-5xl"
                style={{ color: "#F59E0B" }}
              ></i>
            </div>
            <p
              className="text-xs sm:text-sm font-semibold mb-auto"
              style={{
                color: "#263238",
                fontFamily: "'Poppins', sans-serif",
              }}
            >
              Pending
            </p>
            <p
              className="text-lg sm:text-xl font-bold"
              style={{
                color: "#F59E0B",
                fontFamily: "'Poppins', sans-serif",
              }}
            >
              {animatedStats.pending}
            </p>
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
                organization_id: "",
                is_caller: "",
                is_client: "",
              });
            }}
            className="relative rounded-bl-xl rounded-br-xl rounded-tl-xl pl-3 pr-1.5 py-1.5 sm:pl-4 sm:pr-2 sm:py-2 flex flex-col bg-white overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
            title="Click to filter hold users"
          >
            {/* Background Icon */}
            <div className="absolute -right-2 -bottom-2 opacity-5">
              <i
                className="fi flex fi-rr-pause text-4xl sm:text-5xl"
                style={{ color: "#F97316" }}
              ></i>
            </div>
            <p
              className="text-xs sm:text-sm font-semibold mb-auto"
              style={{
                color: "#263238",
                fontFamily: "'Poppins', sans-serif",
              }}
            >
              Hold
            </p>
            <p
              className="text-lg sm:text-xl font-bold"
              style={{
                color: "#F97316",
                fontFamily: "'Poppins', sans-serif",
              }}
            >
              {animatedStats.hold}
            </p>
          </div>

          {/* Suspended */}
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
                organization_id: "",
                is_caller: "",
                is_client: "",
              });
            }}
            className="relative rounded-bl-xl rounded-br-xl rounded-tr-xl pl-3 pr-1.5 py-1.5 sm:pl-4 sm:pr-2 sm:py-2 flex flex-col bg-white overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
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
              className="text-xs sm:text-sm font-semibold mb-auto"
              style={{
                color: "#263238",
                fontFamily: "'Poppins', sans-serif",
              }}
            >
              Suspended
            </p>
            <p
              className="text-lg sm:text-xl font-bold"
              style={{
                color: "#EF4444",
                fontFamily: "'Poppins', sans-serif",
              }}
            >
              {animatedStats.suspend}
            </p>
          </div>
        </div>
      )}

      {/* Fourth Tile - Invite POSP or Salary */}
      {userTypeToggle === "posp_agent" ? (
        <div
          className="relative overflow-hidden rounded-2xl p-3 sm:p-4 transition-all duration-200 flex flex-col hover:shadow-lg cursor-pointer bg-gradient-to-br from-[#FF8C37] to-[#F97316]"
          title="Invite a new POSP Agent"
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
                onClick={onInviteClick}
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
  );
}
