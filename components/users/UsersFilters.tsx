import React from "react";
import { AllUser, UserFilters } from "./types";
import { exportToCSV } from "./utils"; // updated import

interface UsersFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filters: UserFilters;
  setFilters: React.Dispatch<React.SetStateAction<UserFilters>>;
  showFilterDropdown: boolean;
  setShowFilterDropdown: (show: boolean) => void;
  organizations: { id: string; company_name: string }[];
  allUsers: AllUser[];
  filteredUsersCount: number;
  totalUsersCount: number;
  selectedUsers: string[];
  viewType: "grid" | "list";
  setViewType: (type: "grid" | "list") => void;
  userTypeToggle: string;
  onAddUserClick: () => void;
  onBulkDelete: () => void;
}

export function UsersFilters({
  searchQuery,
  setSearchQuery,
  filters,
  setFilters,
  showFilterDropdown,
  setShowFilterDropdown,
  organizations,
  allUsers,
  filteredUsersCount,
  totalUsersCount,
  selectedUsers,
  viewType,
  setViewType,
  userTypeToggle,
  onAddUserClick,
  onBulkDelete,
}: UsersFiltersProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto flex-1">
          <div className="relative flex-1 sm:max-w-md">
            <i
              className="fi flex fi-rr-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              style={{ fontSize: "1.2rem" }}
            ></i>
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4b33e8] focus:border-transparent transition-all shadow-sm"
              style={{ fontFamily: "'Roboto', sans-serif" }}
            />
          </div>

          <div className="relative">
            <button
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              className={`px-4 py-2.5 rounded-xl border flex items-center gap-2 transition-all shadow-sm whitespace-nowrap ${
                showFilterDropdown
                  ? "border-[#4b33e8] bg-[#4b33e8] text-white"
                  : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              <i className="fi flex fi-rr-filter"></i>
              <span className="font-medium">Filters</span>
              {(filters.approval_status ||
                filters.role ||
                filters.department ||
                filters.designation ||
                filters.work_type ||
                filters.user_type ||
                filters.organization_id ||
                filters.status) && (
                <span
                  className={`flex items-center justify-center w-5 h-5 rounded-full text-xs font-bold ${
                    showFilterDropdown
                      ? "bg-white text-[#4b33e8]"
                      : "bg-[#4b33e8] text-white"
                  }`}
                >
                  !
                </span>
              )}
            </button>

            {/* Filter Dropdown */}
            {showFilterDropdown && (
              <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-100 p-4 z-20 animate-fade-in-down">
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase">
                      Status
                    </label>
                    <select
                      value={filters.status}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          status: e.target.value as any,
                        })
                      }
                      className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4b33e8]"
                    >
                      <option value="">All Statuses</option>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      {/* <option value="pending">Pending</option> - Pending is approval status usually, but sometimes confused */}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase">
                      Approval
                    </label>
                    <select
                      value={filters.approval_status}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          approval_status: e.target.value as any,
                        })
                      }
                      className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4b33e8]"
                    >
                      <option value="">All Approvals</option>
                      <option value="approved">Approved</option>
                      <option value="pending">Pending</option>
                      <option value="hold">On Hold</option>
                      <option value="suspend">Suspended</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>

                  {userTypeToggle !== "posp_agent" && (
                    <>
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase">
                          Department
                        </label>
                        <select
                          value={filters.department}
                          onChange={(e) =>
                            setFilters({
                              ...filters,
                              department: e.target.value as any,
                            })
                          }
                          className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4b33e8]"
                        >
                          <option value="">All Departments</option>
                          <option value="sales">Sales</option>
                          <option value="renewal">Renewal</option>
                          <option value="backend">Backend</option>
                          <option value="management">Management</option>
                          <option value="service">Service</option>
                          <option value="hr">HR</option>
                          <option value="it">IT</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase">
                          Designation
                        </label>
                        <select
                          value={filters.designation}
                          onChange={(e) =>
                            setFilters({
                              ...filters,
                              designation: e.target.value as any,
                            })
                          }
                          className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4b33e8]"
                        >
                          <option value="">All Designations</option>
                          <option value="agent">Agent</option>
                          <option value="manager">Manager</option>
                          <option value="team_leader">Team Leader</option>
                          <option value="ceo">CEO</option>
                          <option value="developer">Developer</option>
                          <option value="faculty_staff">Faculty Staff</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase">
                          Work Type
                        </label>
                        <select
                          value={filters.work_type}
                          onChange={(e) =>
                            setFilters({
                              ...filters,
                              work_type: e.target.value as any,
                            })
                          }
                          className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4b33e8]"
                        >
                          <option value="">All Types</option>
                          <option value="on_site">On Site</option>
                          <option value="remote">Remote</option>
                        </select>
                      </div>
                    </>
                  )}

                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase">
                      Organization
                    </label>
                    <select
                      value={filters.organization_id}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          organization_id: e.target.value,
                        })
                      }
                      className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4b33e8]"
                    >
                      <option value="">All Organizations</option>
                      {organizations.map((org) => (
                        <option key={org.id} value={org.id}>
                          {org.company_name}
                        </option>
                      ))}
                    </select>
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
                        organization_id: "",
                        is_client: "",
                        is_caller: "",
                      });
                      setShowFilterDropdown(false);
                    }}
                    className="w-full py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors"
                  >
                    Clear All Filters
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={() => exportToCSV(selectedUsers, allUsers)}
            className="flex-1 sm:flex-none px-4 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm font-medium flex items-center justify-center gap-2 whitespace-nowrap"
            title="Export to CSV"
          >
            <i className="fi flex fi-rr-download"></i>
            <span className="hidden sm:inline">Export</span>
          </button>
          <button
            onClick={onAddUserClick}
            className="flex-1 sm:flex-none px-4 py-2.5 bg-[#4b33e8] hover:bg-[#3d28c7] text-white rounded-xl shadow-lg shadow-indigo-200 transition-all transform hover:-translate-y-0.5 font-medium flex items-center justify-center gap-2 whitespace-nowrap"
          >
            <i className="fi flex fi-rr-user-add"></i>
            <span>Add User</span>
          </button>
        </div>
      </div>

      {/* Bulk Actions / Count Row */}
      <div className="flex items-center justify-between bg-white/50 backdrop-blur-sm px-4 py-2 rounded-lg border border-gray-100">
        <div className="flex items-center gap-4">
          {selectedUsers.length > 0 ? (
            <div className="flex items-center gap-3 animate-fade-in">
              <span className="text-sm font-medium text-[#4b33e8] bg-indigo-50 px-3 py-1 rounded-full">
                {selectedUsers.length} selected
              </span>
              <button
                onClick={onBulkDelete}
                className="text-red-600 hover:text-red-700 text-sm font-medium flex items-center gap-1.5 px-2 py-1 hover:bg-red-50 rounded-lg transition-colors"
              >
                <i className="fi flex fi-rr-trash"></i>
                <span className="hidden sm:inline">Delete Selected</span>
              </button>
            </div>
          ) : (
            <p className="text-sm text-gray-500 font-medium">
              Showing {filteredUsersCount} of {totalUsersCount} users
            </p>
          )}
        </div>

        {/* View Toggle */}
        <div className="flex items-center bg-white rounded-lg border border-gray-200 p-1 shadow-sm">
          <button
            onClick={() => setViewType("grid")}
            className={`p-1.5 rounded-md transition-all ${
              viewType === "grid"
                ? "bg-gray-100 text-[#4b33e8]"
                : "text-gray-400 hover:text-gray-600"
            }`}
            title="Grid View"
          >
            <i className="fi flex fi-rr-grid"></i>
          </button>
          <button
            onClick={() => setViewType("list")}
            className={`p-1.5 rounded-md transition-all ${
              viewType === "list"
                ? "bg-gray-100 text-[#4b33e8]"
                : "text-gray-400 hover:text-gray-600"
            }`}
            title="List View"
          >
            <i className="fi flex fi-rr-list"></i>
          </button>
        </div>
      </div>
    </div>
  );
}
