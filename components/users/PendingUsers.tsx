import React from "react";
import { PendingUser } from "./types";
import { formatDateWithYear } from "./utils";

interface PendingUsersProps {
  pendingUsers: PendingUser[];
  loadingPendingUsers: boolean;
  onStatusChange: (userId: string, status: string) => Promise<void>;
  mounted: boolean;
}

export function PendingUsers({
  pendingUsers,
  loadingPendingUsers,
  onStatusChange,
  mounted,
}: PendingUsersProps) {
  if (!loadingPendingUsers && pendingUsers.length === 0) {
    return null;
  }

  return (
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
            <div key={i} className="animate-pulse rounded-xl bg-white p-3">
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
                      ? pendingUser.user_name.charAt(0).toUpperCase()
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
                    pendingUser.date_of_joining || pendingUser.created_at,
                    mounted
                  )}
                </p>
              </div>

              {/* Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onStatusChange(pendingUser.id, "approved")}
                  className="px-3 py-1 bg-green-100 hover:bg-green-200 text-green-700 font-semibold rounded-full transition-colors text-xs whitespace-nowrap"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  Approved
                </button>
                <button
                  onClick={() => onStatusChange(pendingUser.id, "rejected")}
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
  );
}
