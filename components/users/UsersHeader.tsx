import React from "react";
import { UserFilters } from "./types";

interface UsersHeaderProps {
  userTypeToggle: "all" | "employee" | "posp_agent";
  setUserTypeToggle: (type: "all" | "employee" | "posp_agent") => void;
}

export function UsersHeader({
  userTypeToggle,
  setUserTypeToggle,
}: UsersHeaderProps) {
  return (
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
          className={`inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-8 px-3 ${
            userTypeToggle === "all"
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
          className={`inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-8 px-3 ${
            userTypeToggle === "employee"
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
          className={`inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-8 px-3 ${
            userTypeToggle === "posp_agent"
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
  );
}
