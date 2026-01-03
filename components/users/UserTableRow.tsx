import React from "react";
import { useRouter } from "next/router";
import { AllUser, UserActionHandlers, UserMenuState } from "./types";
import { formatDate } from "./utils";
import UserMenuDropdown from "../UserMenuDropdown";
import {
  HoldBadgeWithTooltip,
  SuspendedBadgeWithTooltip,
} from "./UserStatusBadge";
import ExpiryBadge from "../ExpiryBadge";

interface UserTableRowProps {
  user: AllUser;
  selectedUsers: string[];
  allUsers: AllUser[];
  onCheckboxChange: (userId: string, checked: boolean) => void;
  handlers: UserActionHandlers;
  menuState: UserMenuState;
  menuRefs: React.MutableRefObject<{ [key: string]: HTMLDivElement | null }>;
}

export function UserTableRow({
  user,
  selectedUsers,
  allUsers,
  onCheckboxChange,
  handlers,
  menuState,
  menuRefs,
}: UserTableRowProps) {
  const router = useRouter();

  return (
    <tr
      className="hover:bg-gray-50 transition-colors cursor-pointer"
      onClick={() => router.push(`/users/${user.id}`)}
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
            onCheckboxChange(user.id, e.target.checked);
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
              {user.user_name ? user.user_name.charAt(0).toUpperCase() : "U"}
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
          className="text-xs md:text-sm font-medium text-[#4b33e8]"
          style={{
            fontFamily: "'Roboto', sans-serif",
          }}
        >
          {user.organizations?.company_name || "-"}
        </span>
      </td>
      <td className="px-2 md:px-6 py-3 md:py-5 whitespace-nowrap">
        <span
          className="text-xs md:text-sm text-gray-600 flex items-center"
          style={{
            fontFamily: "'Roboto', sans-serif",
          }}
        >
          {user.role || "Employee"}
          {user.is_client && (
            <span className="ml-2 px-1.5 py-0.5 rounded bg-blue-100 text-[#4b33e8] text-[9px] font-bold">
              CLIENT
            </span>
          )}
          {user.is_caller && (
            <span className="ml-2 px-1.5 py-0.5 rounded bg-indigo-100 text-[#4b33e8] text-[9px] font-bold uppercase">
              Caller
            </span>
          )}
          <span className="ml-2">
            <ExpiryBadge expireDate={user.expire_at} />
          </span>
        </span>
      </td>
      <td className="px-2 md:px-6 py-3 md:py-5 whitespace-nowrap">
        <div className="flex items-center gap-1 md:gap-2 flex-wrap">
          <div
            className={`px-1.5 md:px-2.5 py-0.5 md:py-1 rounded-full inline-flex items-center gap-1 md:gap-1.5 ${
              user.status === "active"
                ? "bg-green-100"
                : user.status === "inactive"
                ? "bg-gray-100"
                : "bg-orange-100"
            }`}
          >
            <div
              className={`w-1 h-1 md:w-1.5 md:h-1.5 rounded-full ${
                user.status === "active"
                  ? "bg-green-500"
                  : user.status === "inactive"
                  ? "bg-gray-400"
                  : "bg-orange-400"
              }`}
            ></div>
            <span
              className={`text-[10px] md:text-xs font-semibold ${
                user.status === "active"
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
            <div onClick={(e) => e.stopPropagation()}>
              <HoldBadgeWithTooltip user={user} allUsers={allUsers} />
            </div>
          )}
          {/* Suspended Badge with Hover Tooltip */}
          {user.approval_status === "suspend" && (
            <div onClick={(e) => e.stopPropagation()}>
              <SuspendedBadgeWithTooltip user={user} />
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
          {formatDate(user.date_of_joining || user.created_at)}
        </span>
      </td>
      <td
        className="px-2 md:px-6 py-3 md:py-5 whitespace-nowrap text-right"
        onClick={(e) => e.stopPropagation()}
      >
        <UserMenuDropdown
          user={user}
          isOpen={menuState.openMenuId === user.id && true}
          onToggle={(e?: React.MouseEvent) => {
            if (e) {
              e.stopPropagation();
              if (menuState.openMenuId === user.id) {
                menuState.setOpenMenuId(null);
                menuState.setMenuPosition(null);
              } else {
                const button = e.currentTarget as HTMLElement;
                const rect = button.getBoundingClientRect();
                const menuHeight = 400; // Approximate menu height (increased for dropdowns)
                const spaceBelow = window.innerHeight - rect.bottom;
                const spaceAbove = rect.top;

                // Position menu above if not enough space below, but enough space above
                const shouldPositionAbove =
                  spaceBelow < menuHeight && spaceAbove > menuHeight;

                menuState.setMenuPosition({
                  top: shouldPositionAbove
                    ? rect.top - menuHeight - 8
                    : rect.bottom + 8,
                  right: window.innerWidth - rect.right,
                });
                menuState.setOpenMenuId(user.id);
              }
            } else {
              menuState.setOpenMenuId(user.id);
            }
          }}
          viewType="list"
          menuPosition={menuState.menuPosition}
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
          menuRef={(el: HTMLDivElement | null) => {
            menuRefs.current[user.id] = el;
          }}
          onMenuClose={() => {
            menuState.setOpenMenuId(null);
            menuState.setMenuPosition(null);
          }}
        />
      </td>
    </tr>
  );
}
