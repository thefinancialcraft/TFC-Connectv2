import React, { useEffect, useMemo } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import AppLayout, { useUser } from "../components/AppLayout"; // Global Layout
import { useUsersFilters } from "../hooks/users/useUsersFilters";
import { useUsersList } from "../hooks/users/useUsersList";
import { useUsersStats } from "../hooks/users/useUsersStats";
import { useUsersActions } from "../hooks/users/useUsersActions";
import { useUsersMenu } from "../hooks/users/useUsersMenu";
import { UsersHeader } from "../components/users/UsersHeader";
import { UsersStats } from "../components/users/UsersStats";
import { PendingUsers } from "../components/users/PendingUsers";
import { UsersFilters } from "../components/users/UsersFilters";
import { UsersList } from "../components/users/UsersList";
import { UsersCategoryStats } from "../components/users/UsersCategoryStats";
import { AddUserModal } from "../components/users/modals/AddUserModal";
import { InviteModal } from "../components/users/modals/InviteModal";
import { ApprovalModal } from "../components/users/modals/ApprovalModal";
import { HoldModal } from "../components/users/modals/HoldModal";
import { SuspendModal } from "../components/users/modals/SuspendModal";
import { ImportModal } from "../components/users/modals/ImportModal";

const Users = () => {
  // 1. Global User Context (provides user object for data fetching triggers)
  const { user, mounted } = useUser();
  const router = useRouter();

  // Page level protection logic
  useEffect(() => {
    if (mounted && user) {
      // Visibility logic (Strict: Hidden by default)
      const allowedClientDesignations = ["ceo", "developer"];
      const userDesignation = user.designation?.toLowerCase() || "";

      const isUserPageVisible =
        user.isClient === false ||
        (user.isClient === true &&
          allowedClientDesignations.includes(userDesignation));

      if (!isUserPageVisible) {
        console.warn("Unauthorized access to users page, redirecting...");
        router.replace("/dashboard");
      }
    }
  }, [mounted, user, router]);

  // 1.5 Auth state for data filtering
  const isAuthorisedUser = useMemo(() => {
    if (!user) return false;
    // Internal staff (isClient === false) are authorised to see all data
    // Client users (isClient === true) only see their own organization data
    return user.isClient === false;
  }, [user]);

  // 2. Filters Hook
  const {
    searchQuery,
    setSearchQuery,
    showFilterDropdown,
    setShowFilterDropdown,
    viewType,
    setViewType,
    userTypeToggle,
    setUserTypeToggle,
    filters,
    setFilters,
    organizations,
    fetchOrgs,
  } = useUsersFilters(user?.organization_id, isAuthorisedUser);

  // 3. User List Hook (fetches users based on userTypeToggle)
  const {
    allUsers,
    loadingAllUsers,
    pendingUsers,
    loadingPendingUsers,
    fetchAllUsers,
    fetchPendingUsers,
    checkAndApproveExpiredHolds,
  } = useUsersList(userTypeToggle, user?.organization_id, isAuthorisedUser);

  // 4. Stats Hook (fetches stats based on userTypeToggle)
  const {
    userStats,
    loadingStats,
    monthlyActiveUsers,
    monthlyTotalUsers,
    designationStats,
    workTypeStats,
    departmentStats,
    fetchUserStats,
    fetchMonthlyUserData,
    fetchCategoryStats,
  } = useUsersStats(userTypeToggle, user?.organization_id, isAuthorisedUser);

  // 5. Actions Hook
  // Pass a single refresh function that executes all fetches in parallel
  const refreshData = async () => {
    await Promise.all([
      fetchAllUsers(),
      fetchUserStats(),
      fetchPendingUsers(),
      fetchCategoryStats(),
      fetchMonthlyUserData(),
    ]);
  };

  const {
    selectedUsers,
    setSelectedUsers,
    handleStatusChange,
    handleUserStatusChange,
    handleWorkTypeChange,
    handleUserTypeChange,
    handleRoleChange,
    handleIsClientChange,
    handleIsCallerChange,
    handleDesignationChange,
    handleDepartmentChange,
    handleCheckboxChange,
    handleSelectAll,
    handleDeleteUser,
    handleBulkDelete,
    // Modals
    showApprovalModal,
    setShowApprovalModal,
    approvalUserData,
    setApprovalUserData,
    approvalFormData,
    setApprovalFormData,
    showHoldModal,
    setShowHoldModal,
    holdUserData,
    setHoldUserData,
    holdFormData,
    setHoldFormData,
    showSuspendModal,
    setShowSuspendModal,
    suspendUserData,
    setSuspendUserData,
    suspendFormData,
    setSuspendFormData,
    handleApproveUserConfirm,
    handleHoldUserConfirm,
    handleSuspendUserConfirm,
  } = useUsersActions(refreshData);

  // 6. Menu Hook
  const { menuState, menuRefs } = useUsersMenu();

  // Local state for other modals
  const [showAddUserModal, setShowAddUserModal] = React.useState(false);
  const [showInviteModal, setShowInviteModal] = React.useState(false);
  const [showImportModal, setShowImportModal] = React.useState(false);

  // Initial Data Fetch
  useEffect(() => {
    if (mounted && user) {
      // Only fetch if we are authorised (internal) OR if we have the organization_id (client)
      // This prevents fetching all users before the organization_id is loaded
      if (isAuthorisedUser || user.organization_id) {
        refreshData();
        fetchOrgs();
        checkAndApproveExpiredHolds();
      }
    }
  }, [mounted, user, userTypeToggle, isAuthorisedUser]); // Re-fetch when user or toggle changes

  // Filter Users Logic
  const filteredUsers = React.useMemo(() => {
    let filtered = allUsers;

    // Generic Search Filter
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((user) => {
        const userName = (user.user_name || "").toLowerCase();
        const employeeId = (user.employee_id || "").toLowerCase();
        const email = (user.email || "").toLowerCase();
        const contactNo = (user.contact_no || "").toLowerCase();
        const department = (user.department || "").toLowerCase();
        const designation = (user.designation || "").toLowerCase();
        const role = (user.role || "").toLowerCase();
        const orgName = (user.organizations?.company_name || "").toLowerCase();
        const isClient = user.is_client ? "client" : "personnel employee agent";
        const isCaller = user.is_caller ? "caller" : "";

        return (
          userName.includes(query) ||
          employeeId.includes(query) ||
          email.includes(query) ||
          contactNo.includes(query) ||
          department.includes(query) ||
          designation.includes(query) ||
          role.includes(query) ||
          orgName.includes(query) ||
          isClient.includes(query) ||
          isCaller.includes(query)
        );
      });
    }

    // Apply filters
    if (filters.approval_status) {
      filtered = filtered.filter(
        (user) => user.approval_status === filters.approval_status,
      );
    }
    if (filters.role) {
      filtered = filtered.filter((user) => user.role === filters.role);
    }
    if (filters.department) {
      filtered = filtered.filter(
        (user) => user.department === filters.department,
      );
    }
    if (filters.designation) {
      filtered = filtered.filter(
        (user) => user.designation === filters.designation,
      );
    }
    if (filters.work_type) {
      filtered = filtered.filter(
        (user) => user.work_type === filters.work_type,
      );
    }
    // user_type filtering is handled by hook mostly, but if 'all' is toggled and dropdown is used
    if (filters.user_type) {
      filtered = filtered.filter(
        (user) => user.user_type === filters.user_type,
      );
    }

    if (filters.status) {
      filtered = filtered.filter((user) => user.status === filters.status);
    }
    if (filters.organization_id) {
      filtered = filtered.filter(
        (user) => user.organization_id === filters.organization_id,
      );
    }

    // Explicit string comparison for boolean/string mixed types from filters
    if (filters.is_client !== "") {
      filtered = filtered.filter(
        (user) => String(user.is_client) === filters.is_client,
      );
    }
    if (filters.is_caller !== "") {
      filtered = filtered.filter(
        (user) => String(user.is_caller) === filters.is_caller,
      );
    }

    // Sort by user name alphabetically (create copy to avoid mutating original state)
    return [...filtered].sort((a, b) => {
      const nameA = (a.user_name || "").toLowerCase();
      const nameB = (b.user_name || "").toLowerCase();
      return nameA.localeCompare(nameB);
    });
  }, [allUsers, searchQuery, filters]);

  return (
    <AppLayout>
      <Head>
        <title>Users | TFC Nexus</title>
      </Head>

      <div className="container mx-auto px-3 sm:px-4 md:px-6 py-6 sm:py-8 pb-20 sm:pb-24 lg:pb-8 max-w-7xl">
        <div className="space-y-6 sm:space-y-8">
          {/* Header & Type Toggle */}
          <UsersHeader
            userTypeToggle={userTypeToggle}
            setUserTypeToggle={setUserTypeToggle}
          />

          {/* Stats Tiles */}
          <UsersStats
            loadingStats={loadingStats}
            userStats={userStats}
            allUsers={allUsers}
            monthlyActiveUsers={monthlyActiveUsers}
            monthlyTotalUsers={monthlyTotalUsers}
            setFilters={setFilters}
            onInviteClick={() => setShowInviteModal(true)}
            userTypeToggle={userTypeToggle}
          />

          {/* Pending Users Section */}
          <PendingUsers
            loadingPendingUsers={loadingPendingUsers}
            pendingUsers={pendingUsers}
            mounted={mounted}
            onStatusChange={async (userId, status) => {
              if (status === "approved") {
                const user = pendingUsers.find((u) => u.id === userId);
                if (user) {
                  setApprovalUserData(user as any); // pendingUser is structurally similar
                  setApprovalFormData({
                    role: "user",
                    department: "sales",
                    designation: "agent",
                    work_type: "on_site",
                    user_type:
                      user.user_type === "posp_agent"
                        ? "posp_agent"
                        : "employee",
                    status: "active",
                  });
                  setShowApprovalModal(true);
                }
              } else if (status === "rejected") {
                if (confirm("Are you sure you want to reject this user?")) {
                  await handleStatusChange(userId, "rejected");
                }
              }
            }}
          />

          {/* Filters & List Section */}
          <div className="flex flex-col xl:flex-row gap-6">
            <div className="flex-1 min-w-0 space-y-6">
              {/* Filters Bar */}
              <UsersFilters
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                showFilterDropdown={showFilterDropdown}
                setShowFilterDropdown={setShowFilterDropdown}
                filters={filters}
                setFilters={setFilters}
                viewType={viewType}
                setViewType={setViewType}
                selectedUsers={selectedUsers}
                allUsers={allUsers}
                filteredUsersCount={filteredUsers.length}
                totalUsersCount={allUsers.length}
                organizations={organizations}
                onAddUserClick={() => setShowAddUserModal(true)}
                onBulkDelete={() => {
                  handleBulkDelete();
                }}
                userTypeToggle={userTypeToggle}
              />

              {/* Users List (Grid/Table) */}
              <UsersList
                loading={loadingAllUsers}
                filteredUsers={filteredUsers}
                viewType={viewType}
                selectedUsers={selectedUsers}
                allUsers={allUsers}
                menuState={menuState}
                menuRefs={menuRefs}
                onSelectAll={handleSelectAll}
                onCheckboxChange={handleCheckboxChange}
                handlers={{
                  handleStatusChange,
                  handleUserStatusChange,
                  handleWorkTypeChange,
                  handleUserTypeChange,
                  handleRoleChange,
                  handleIsClientChange,
                  handleIsCallerChange,
                  handleDesignationChange,
                  handleDepartmentChange,
                  handleDeleteUser,
                }}
              />
            </div>

            {/* Right Sidebar Stats */}
            <UsersCategoryStats
              designationStats={designationStats}
              workTypeStats={workTypeStats}
              departmentStats={departmentStats}
              userTypeToggle={userTypeToggle}
              filters={filters}
              setFilters={setFilters}
            />
          </div>
        </div>
      </div>

      {/* Modals */}
      <AddUserModal
        show={showAddUserModal}
        onClose={() => setShowAddUserModal(false)}
        onSuccess={() => {
          refreshData();
        }}
        isAuthorised={isAuthorisedUser}
        organizationId={user?.organization_id}
      />

      <InviteModal
        show={showInviteModal}
        onClose={() => setShowInviteModal(false)}
      />

      <ImportModal
        show={showImportModal}
        onClose={() => setShowImportModal(false)}
        onSuccess={() => {
          refreshData();
        }}
        organizations={organizations}
      />

      <ApprovalModal
        show={showApprovalModal}
        onClose={() => {
          setShowApprovalModal(false);
          setApprovalUserData(null);
        }}
        onConfirm={handleApproveUserConfirm}
        userData={approvalUserData}
        formData={approvalFormData}
        setFormData={setApprovalFormData}
      />

      <HoldModal
        show={showHoldModal}
        onClose={() => {
          setShowHoldModal(false);
          setHoldUserData(null);
        }}
        onConfirm={handleHoldUserConfirm}
        userData={holdUserData}
        formData={holdFormData}
        setFormData={setHoldFormData}
      />

      <SuspendModal
        show={showSuspendModal}
        onClose={() => {
          setShowSuspendModal(false);
          setSuspendUserData(null);
        }}
        onConfirm={handleSuspendUserConfirm}
        userData={suspendUserData}
        formData={suspendFormData}
        setFormData={setSuspendFormData}
      />
    </AppLayout>
  );
};

export default Users;
