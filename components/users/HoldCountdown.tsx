import React, { useState, useEffect } from "react";
import { AllUser } from "./types";
import { formatTimeLeft } from "./utils";

interface HoldCountdownProps {
  holdEndDate: string;
  holdByUserId: string | null;
  holdReason: string | null;
  allUsers: AllUser[];
}

export default function HoldCountdown({
  holdEndDate,
  holdByUserId,
  holdReason,
  allUsers,
}: HoldCountdownProps) {
  // Use formatTimeLeft from utils, but the original component had it inline with slightly different behavior (Exception handling logs error). 
  // However, logic is identical. The inline version in HoldCountdown logged error, utility returns "Invalid date".
  // I will use utility for consistency.
  
  const [timeLeft, setTimeLeft] = useState<string>(() =>
    formatTimeLeft(holdEndDate)
  );

  useEffect(() => {
    const updateCountdown = () => {
      setTimeLeft(formatTimeLeft(holdEndDate));
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
