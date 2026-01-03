import React from "react";
import { UserFilters } from "./types";

interface UsersCategoryStatsProps {
  userTypeToggle: string;
  designationStats: Record<string, number>;
  workTypeStats: Record<string, number>;
  departmentStats: Record<string, number>;
  filters: UserFilters;
  setFilters: React.Dispatch<React.SetStateAction<UserFilters>>;
}

export function UsersCategoryStats({
  userTypeToggle,
  designationStats,
  workTypeStats,
  departmentStats,
  filters,
  setFilters,
}: UsersCategoryStatsProps) {
  if (userTypeToggle === "posp_agent") return null;

  return (
    <div className="hidden lg:block w-full xl:w-[220px] shrink-0 space-y-4">
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
                      prev.designation === designation ? "" : designation,
                  }));
                }}
                className={`flex items-center justify-between p-2 rounded-lg transition-colors cursor-pointer ${
                  isActive
                    ? "bg-[#4b33e8] text-white"
                    : "bg-gray-50 hover:bg-gray-100"
                }`}
              >
                <span
                  className={`text-xs font-medium capitalize ${
                    isActive ? "text-white" : "text-gray-700"
                  }`}
                  style={{ fontFamily: "'Roboto', sans-serif" }}
                >
                  {designation.replace("_", " ")}
                </span>
                <span
                  className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                    count > 0
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
                    work_type: prev.work_type === workType ? "" : workType,
                  }));
                }}
                className={`flex items-center justify-between p-2 rounded-lg transition-colors cursor-pointer ${
                  isActive
                    ? "bg-[#4b33e8] text-white"
                    : "bg-gray-50 hover:bg-gray-100"
                }`}
              >
                <span
                  className={`text-xs font-medium capitalize ${
                    isActive ? "text-white" : "text-gray-700"
                  }`}
                  style={{ fontFamily: "'Roboto', sans-serif" }}
                >
                  {workType.replace("_", " ")}
                </span>
                <span
                  className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                    count > 0
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
                      prev.department === department ? "" : department,
                  }));
                }}
                className={`flex items-center justify-between p-2 rounded-lg transition-colors cursor-pointer ${
                  isActive
                    ? "bg-[#4b33e8] text-white"
                    : "bg-gray-50 hover:bg-gray-100"
                }`}
              >
                <span
                  className={`text-xs font-medium capitalize ${
                    isActive ? "text-white" : "text-gray-700"
                  }`}
                  style={{ fontFamily: "'Roboto', sans-serif" }}
                >
                  {department.replace("_", " ")}
                </span>
                <span
                  className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                    count > 0
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
  );
}
