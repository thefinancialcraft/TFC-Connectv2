import React from "react";
import { AllUser, UserActionHandlers, UserMenuState } from "./types";
import { UserCard } from "./UserCard";
import { UserTableRow } from "./UserTableRow";
import { UsersGridSkeleton } from "./UsersSkeleton";

interface UsersListProps {
  loading: boolean;
  viewType: "grid" | "list";
  filteredUsers: AllUser[];
  selectedUsers: string[];
  allUsers: AllUser[];
  handlers: UserActionHandlers;
  menuState: UserMenuState;
  menuRefs: React.MutableRefObject<{ [key: string]: HTMLDivElement | null }>;
  onCheckboxChange: (userId: string, checked: boolean) => void;
  onSelectAll: (checked: boolean, allUserIds: string[]) => void;
}

export function UsersList({
  loading,
  viewType,
  filteredUsers,
  selectedUsers,
  allUsers,
  handlers,
  menuState,
  menuRefs,
  onCheckboxChange,
  onSelectAll,
}: UsersListProps) {
  if (loading) {
    if (viewType === "grid") {
      return <UsersGridSkeleton />;
    } else {
      return (
        <div className="p-12 text-center text-gray-500 font-medium">
          Loading users...
        </div>
      );
    }
  }

  if (filteredUsers.length === 0) {
    return (
      <div className="mt-6 text-center py-12">
        <p
          className="text-gray-500"
          style={{ fontFamily: "'Roboto', sans-serif" }}
        >
          No users found matching your search or filters.
        </p>
      </div>
    );
  }

  if (viewType === "grid") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredUsers.map((user) => (
          <UserCard
            key={user.id}
            user={user}
            selectedUsers={selectedUsers}
            allUsers={allUsers}
            onCheckboxChange={onCheckboxChange}
            handlers={handlers}
            menuState={menuState}
            menuRefs={menuRefs}
          />
        ))}
      </div>
    );
  }

  // List View
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-2 md:px-6 py-3 md:py-4 text-left w-10">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 w-4 h-4 md:w-4 md:h-4 cursor-pointer"
                  checked={
                    filteredUsers.length > 0 &&
                    filteredUsers.every((u) => selectedUsers.includes(u.id))
                  }
                  onChange={(e) =>
                    onSelectAll(
                      e.target.checked,
                      filteredUsers.map((u) => u.id)
                    )
                  }
                />
              </th>
              <th
                className="px-2 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-semibold text-gray-600 tracking-wider"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                User
              </th>
              <th
                className="px-2 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-semibold text-gray-600 tracking-wider"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                ID
              </th>
              <th
                className="px-2 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-semibold text-gray-600 tracking-wider"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                Company
              </th>
              <th
                className="px-2 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-semibold text-gray-600 tracking-wider"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                Role
              </th>
              <th
                className="px-2 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-semibold text-gray-600 tracking-wider"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                Status
              </th>
              <th
                className="px-2 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-semibold text-gray-600 tracking-wider"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                Email
              </th>
              <th
                className="px-2 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-semibold text-gray-600 tracking-wider"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                Joined
              </th>
              <th className="px-2 md:px-6 py-3 md:py-4 relative text-right">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredUsers.map((user) => (
              <UserTableRow
                key={user.id}
                user={user}
                selectedUsers={selectedUsers}
                allUsers={allUsers}
                onCheckboxChange={onCheckboxChange}
                handlers={handlers}
                menuState={menuState}
                menuRefs={menuRefs}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
