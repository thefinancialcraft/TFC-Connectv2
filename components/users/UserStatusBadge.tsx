import React, { useState, useEffect } from "react";
import { AllUser } from "./types";
import { formatTimeLeft } from "./utils";

export function SuspendedBadgeWithTooltip({ user }: { user: AllUser }) {
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

export function HoldBadgeWithTooltip({
  user,
  allUsers,
}: {
  user: AllUser;
  allUsers: AllUser[];
}) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [timeLeft, setTimeLeft] = useState<string>(() =>
    formatTimeLeft(user.hold_end_date)
  );

  useEffect(() => {
    if (!user.hold_end_date) {
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft(formatTimeLeft(user.hold_end_date));
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
