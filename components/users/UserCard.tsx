import React from "react";
import { useRouter } from "next/router";
import { AllUser, UserActionHandlers, UserMenuState } from "./types";
import { formatDate, getWorkTypeLabel } from "./utils";
import UserMenuDropdown from "../UserMenuDropdown"; 
import {
  HoldBadgeWithTooltip,
  SuspendedBadgeWithTooltip,
} from "./UserStatusBadge";
import ExpiryBadge from "../ExpiryBadge";


interface UserCardProps {
  user: AllUser;
  selectedUsers: string[];
  allUsers: AllUser[];
  onCheckboxChange: (userId: string, checked: boolean) => void;
  handlers: UserActionHandlers;
  menuState: UserMenuState;
  menuRefs: React.MutableRefObject<{ [key: string]: HTMLDivElement | null }>;
}

export function UserCard({
  user,
  selectedUsers,
  allUsers,
  onCheckboxChange,
  handlers,
  menuState,
  menuRefs,
}: UserCardProps) {
  const router = useRouter();

  return (
    <div
      className="bg-white rounded-xl md:rounded-2xl p-2 md:p-4 border border-gray-200 hover:shadow-lg transition-shadow relative cursor-pointer md:cursor-default"
      onClick={(e) => {
        // Only navigate on mobile when clicking the card (not on checkboxes or menu)
        if (
          window.innerWidth < 768 &&
          !(e.target as HTMLElement).closest("input, button")
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
              onCheckboxChange(user.id, e.target.checked);
            }}
            onClick={(e) => e.stopPropagation()}
          />
          <div
            className={`${
              user.status === "active" ? "px-0 md:px-2" : "px-1.5 md:px-2"
            } py-0.5 md:rounded-lg flex items-center gap-1 md:gap-1.5 ${
              user.status === "active"
                ? "md:bg-green-100"
                : user.status === "inactive"
                ? "bg-gray-100"
                : "bg-gray-100"
            }`}
          >
            <div
              className={`w-1.5 h-1.5 rounded-full ${
                user.status === "active"
                  ? "bg-green-500"
                  : user.status === "inactive"
                  ? "bg-gray-400"
                  : "bg-gray-400"
              }`}
            ></div>
            <span
              className={`text-[10px] font-semibold ${
                user.status === "active"
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
            <HoldBadgeWithTooltip user={user} allUsers={allUsers} />
          )}
          {/* Suspended Badge with Hover Tooltip */}
          {user.approval_status === "suspend" && (
            <SuspendedBadgeWithTooltip user={user} />
          )}
        </div>
        <UserMenuDropdown
          user={user}
          isOpen={menuState.openMenuId === user.id}
          onToggle={() =>
            menuState.setOpenMenuId(
              menuState.openMenuId === user.id ? null : user.id
            )
          }
          viewType="grid"
          onApprovalStatusChange={handlers.handleStatusChange}
          onWorkTypeChange={handlers.handleWorkTypeChange}
          onUserTypeChange={handlers.handleUserTypeChange}
          onRoleChange={handlers.handleRoleChange}
          onDepartmentChange={handlers.handleDepartmentChange}
          onDesignationChange={handlers.handleDesignationChange}
          onIsClientChange={handlers.handleIsClientChange}
          onIsCallerChange={handlers.handleIsCallerChange}
          onStatusChange={handlers.handleUserStatusChange}
          onDelete={handlers.handleDeleteUser}
          openApprovalDropdown={menuState.openApprovalDropdown}
          openWorkTypeDropdown={menuState.openWorkTypeDropdown}
          openUserTypeDropdown={menuState.openUserTypeDropdown}
          openRoleDropdown={menuState.openRoleDropdown}
          openDepartmentDropdown={menuState.openDepartmentDropdown}
          openDesignationDropdown={menuState.openDesignationDropdown}
          openIsClientDropdown={menuState.openIsClientDropdown}
          openIsCallerDropdown={menuState.openIsCallerDropdown}
          setOpenApprovalDropdown={menuState.setOpenApprovalDropdown}
          setOpenWorkTypeDropdown={menuState.setOpenWorkTypeDropdown}
          setOpenUserTypeDropdown={menuState.setOpenUserTypeDropdown}
          setOpenRoleDropdown={menuState.setOpenRoleDropdown}
          setOpenDepartmentDropdown={menuState.setOpenDepartmentDropdown}
          setOpenDesignationDropdown={menuState.setOpenDesignationDropdown}
          setOpenIsClientDropdown={menuState.setOpenIsClientDropdown}
          setOpenIsCallerDropdown={menuState.setOpenIsCallerDropdown}
          menuRef={(el) => {
            menuRefs.current[user.id] = el;
          }}
          onMenuClose={() => menuState.setOpenMenuId(null)}
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
            {user.user_name ? user.user_name.charAt(0).toUpperCase() : "U"}
          </div>
        )}
        <h3
          className="text-sm md:text-base font-semibold text-gray-900 mb-0.5 text-center truncate w-full px-1 flex items-center justify-center gap-1"
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
        {(user.is_client || user.expire_at || user.is_caller) && (
          <div className="mt-1 flex flex-wrap items-center justify-center gap-1.5">
            {user.is_client && (
              <span className="px-2 py-0.5 rounded-full bg-blue-100 text-[#4b33e8] text-[10px] font-bold">
                Client
              </span>
            )}
            <ExpiryBadge expireDate={user.expire_at} />
            {user.is_caller && (
              <span
                className="bg-indigo-100 px-2 py-1 rounded-full text-[#4b33e8] text-[10px] font-bold uppercase"
                title="Caller"
              >
                <i className="fi flex fi-rr-phone-call" />
              </span>
            )}
          </div>
        )}
      </div>

      {/* Employee ID . Role - Mobile (one row with dot separator) */}
      <div className="text-center mb-2 md:mb-0">
        <div
          className="text-[10px] font-medium flex items-center justify-center gap-1 md:hidden"
          style={{ fontFamily: "'Roboto', sans-serif" }}
        >
          <span className="text-gray-700">{user.employee_id || "N/A"}</span>
          <span className="text-gray-400">•</span>
          <span className="text-gray-700">{user.role || "Employee"}</span>
        </div>
      </div>

      {/* Information Box - Hidden on mobile */}
      <div className="hidden md:block bg-gray-50 rounded-lg p-3 space-y-1.5 mb-3">
        <div
          className="text-xs text-gray-700"
          style={{ fontFamily: "'Roboto', sans-serif" }}
        >
          <span className="font-semibold text-[#4b33e8]">
            {user.employee_id || "N/A"}
          </span>
          {user.organizations && (
            <div className="flex items-center gap-1 mt-0.5 text-[#263238] font-bold">
              <i className="fi flex fi-rr-building text-[10px] text-blue-500"></i>
              <span className="truncate" title={user.organizations.company_name}>
                {user.organizations.company_name}
              </span>
            </div>
          )}
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
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
            </svg>
          )}
          <span>{getWorkTypeLabel(user.work_type)}</span>
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
          <span>{formatDate(user.date_of_joining || user.created_at)}</span>
        </div>
        <button
          onClick={() => router.push(`/users/${user.id}`)}
          className="text-blue-600 hover:underline text-xs font-medium flex items-center gap-1"
          style={{ fontFamily: "'Roboto', sans-serif" }}
        >
          View details
          <i className="fi flex fi-rr-arrow-right text-[10px]"></i>
        </button>
      </div>
    </div>
  );
}
