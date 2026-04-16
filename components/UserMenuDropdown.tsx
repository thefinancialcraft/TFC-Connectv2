import React, { useRef } from 'react';
import { useUser } from './AppLayout';
import { DashboardLevel, getUserDashboardLevel } from "@/lib/dashboardUtils";

interface User {
  id: string;
  approval_status: string | null;
  work_type: string | null;
  user_type: string | null;
  role: string | null;
  department: string | null;
  designation: string | null;
  status: string | null;
  is_client: boolean | null;
  is_caller: boolean | null;
}

interface UserMenuDropdownProps {
  user: User;
  isOpen: boolean;
  onToggle: (e?: React.MouseEvent) => void;
  viewType: 'grid' | 'list';
  menuPosition?: { top: number; right: number } | null;
  onApprovalStatusChange: (userId: string, status: 'approved' | 'pending' | 'hold' | 'suspend' | 'rejected') => void;
  onWorkTypeChange: (userId: string, workType: 'remote' | 'on_site') => void;
  onUserTypeChange: (userId: string, userType: 'employee' | 'posp_agent') => void;
  onRoleChange: (userId: string, role: 'user' | 'admin' | 'super_admin') => void;
  onDepartmentChange: (userId: string, department: 'sales' | 'renewal' | 'backend' | 'management' | 'service') => void;
  onDesignationChange: (userId: string, designation: 'agent' | 'manager' | 'faculty_staff' | 'team_leader' | 'ceo' | 'developer') => void;
  onIsClientChange: (userId: string, isClient: boolean) => void;
  onIsCallerChange: (userId: string, isCaller: boolean) => void;
  onStatusChange: (userId: string, status: 'active' | 'inactive') => void;
  onDelete: (userId: string) => void;
  // Dropdown states
  openApprovalDropdown: string | null;
  openWorkTypeDropdown: string | null;
  openUserTypeDropdown: string | null;
  openRoleDropdown: string | null;
  openDepartmentDropdown: string | null;
  openDesignationDropdown: string | null;
  openIsClientDropdown: string | null;
  openIsCallerDropdown: string | null;
  // Dropdown setters
  setOpenApprovalDropdown: (id: string | null) => void;
  setOpenWorkTypeDropdown: (id: string | null) => void;
  setOpenUserTypeDropdown: (id: string | null) => void;
  setOpenRoleDropdown: (id: string | null) => void;
  setOpenDepartmentDropdown: (id: string | null) => void;
  setOpenDesignationDropdown: (id: string | null) => void;
  setOpenIsClientDropdown: (id: string | null) => void;
  setOpenIsCallerDropdown: (id: string | null) => void;
  menuRef?: (el: HTMLDivElement | null) => void;
  onClose?: () => void;
  onMenuClose?: () => void;
}

// Helper functions
const getApprovalStatusLabel = (status: string | null) => {
  switch (status) {
    case 'approved': return 'Approved User';
    case 'pending': return 'Pending';
    case 'hold': return 'Hold';
    case 'suspend': return 'Suspended';
    case 'rejected': return 'Rejected';
    default: return 'Pending';
  }
};

const getWorkTypeLabel = (workType: string | null) => {
  switch (workType) {
    case 'on_site': return 'On Site';
    case 'remote': return 'Remote';
    default: return 'On Site';
  }
};

const getUserTypeLabel = (userType: string | null) => {
  switch (userType) {
    case 'employee': return 'Employee';
    case 'posp_agent': return 'Posp Agent';
    default: return 'Employee';
  }
};

const getRoleLabel = (role: string | null) => {
  switch (role) {
    case 'user': return 'User';
    case 'admin': return 'Admin';
    case 'super_admin': return 'Super Admin';
    default: return 'User';
  }
};

const getDepartmentLabel = (department: string | null) => {
  switch (department) {
    case 'sales': return 'Sales';
    case 'renewal': return 'Renewal';
    case 'backend': return 'Backend';
    case 'management': return 'Management';
    case 'service': return 'Service';
    default: return 'Sales';
  }
};

const getDesignationLabel = (designation: string | null) => {
  switch (designation) {
    case 'agent': return 'Agent';
    case 'manager': return 'Manager';
    case 'faculty_staff': return 'Faculty Staff';
    case 'team_leader': return 'Team Leader';
    case 'ceo': return 'CEO';
    case 'developer': return 'Developer';
    default: return 'Agent';
  }
};

export default function UserMenuDropdown({
  user,
  isOpen,
  onToggle,
  viewType,
  menuPosition,
  onApprovalStatusChange,
  onWorkTypeChange,
  onUserTypeChange,
  onRoleChange,
  onDepartmentChange,
  onDesignationChange,
  onIsClientChange,
  onIsCallerChange,
  onStatusChange,
  onDelete,
  openApprovalDropdown,
  openWorkTypeDropdown,
  openUserTypeDropdown,
  openRoleDropdown,
  openDepartmentDropdown,
  openDesignationDropdown,
  openIsClientDropdown,
  openIsCallerDropdown,
  setOpenApprovalDropdown,
  setOpenWorkTypeDropdown,
  setOpenUserTypeDropdown,
  setOpenRoleDropdown,
  setOpenDepartmentDropdown,
  setOpenDesignationDropdown,
  setOpenIsClientDropdown,
  setOpenIsCallerDropdown,
  menuRef,
  onClose,
  onMenuClose
}: UserMenuDropdownProps) {
  const { user: currentUser } = useUser();
  const currentLevel = getUserDashboardLevel(currentUser);
  
  const canManageIsClient = currentLevel === DashboardLevel.LEVEL_1_ADMIN;
  const availableDesignations = currentLevel === DashboardLevel.LEVEL_1_ADMIN 
    ? ['agent', 'manager', 'faculty_staff', 'team_leader', 'ceo', 'developer']
    : ['agent', 'team_leader', 'ceo'];
  
  const handleClose = () => {
    setOpenApprovalDropdown(null);
    setOpenWorkTypeDropdown(null);
    setOpenUserTypeDropdown(null);
    setOpenRoleDropdown(null);
    setOpenDepartmentDropdown(null);
    setOpenDesignationDropdown(null);
    setOpenIsClientDropdown(null);
    setOpenIsCallerDropdown(null);
    onClose?.();
  };

  const handleActionClick = (callback: () => void | Promise<void>) => {
    return async (e?: React.MouseEvent) => {
      if (e) e.stopPropagation();
      await callback();
      handleClose();
      onMenuClose?.();
    };
  };

  const menuContent = (
    <div className="p-1 overflow-visible">
      <div className="px-2 py-1.5 text-sm font-semibold text-gray-900">User Actions</div>
      <div className="-mx-1 my-1 h-px bg-gray-200"></div>
      
      {/* Approval Status Dropdown */}
      <div className="relative">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setOpenApprovalDropdown(openApprovalDropdown === user.id ? null : user.id);
            setOpenWorkTypeDropdown(null);
            setOpenUserTypeDropdown(null);
            setOpenRoleDropdown(null);
            setOpenDepartmentDropdown(null);
            setOpenDesignationDropdown(null);
          }}
          className="w-full flex items-center justify-between px-2 py-1.5 text-sm text-gray-600 font-medium hover:bg-gray-50 rounded"
        >
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <line x1="19" x2="19" y1="8" y2="14"></line>
              <line x1="22" x2="16" y1="11" y2="11"></line>
            </svg>
            <span>{getApprovalStatusLabel(user.approval_status)}</span>
          </div>
          {openApprovalDropdown === user.id ? (
            <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          ) : (
            <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          )}
        </button>
        {openApprovalDropdown === user.id && (
          <div className="absolute left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-[10000] max-h-48 overflow-auto">
            {(() => {
              // Determine which statuses to show based on current status
              let statusesToShow: string[] = [];
              
              if (user.approval_status === 'pending') {
                // If pending, show: pending, approved, rejected
                statusesToShow = ['pending', 'approved', 'rejected'];
              } else if (user.approval_status === 'approved') {
                // If approved, show: approved, hold, suspend
                statusesToShow = ['approved', 'hold', 'suspend'];
              } else {
                // Otherwise (hold, suspend, rejected, etc.), show: approved, hold, suspend
                statusesToShow = ['approved', 'hold', 'suspend'];
              }
              
              return statusesToShow;
            })().map((status) => (
              <div
                key={status}
                onClick={(e) => {
                  e.stopPropagation();
                  onApprovalStatusChange(user.id, status as any);
                  onMenuClose?.();
                }}
                className={`px-2 py-1.5 text-sm cursor-pointer hover:bg-gray-100 flex items-center justify-between ${
                  user.approval_status === status ? 'bg-purple-50' : ''
                }`}
              >
                <div className="flex items-center gap-2">
                  {status === 'approved' ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                  ) : status === 'pending' ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600">
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                  ) : status === 'hold' ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="10" y1="12" x2="10" y2="8"></line>
                      <line x1="14" y1="12" x2="14" y2="8"></line>
                    </svg>
                  ) : status === 'suspend' ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line>
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="15" y1="9" x2="9" y2="15"></line>
                      <line x1="9" y1="9" x2="15" y2="15"></line>
                    </svg>
                  )}
                  <span className="font-semibold text-gray-700">{getApprovalStatusLabel(status)}</span>
                </div>
                {user.approval_status === status && (
                  <svg className="h-4 w-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Work Type Dropdown */}
      <div className="relative">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setOpenWorkTypeDropdown(openWorkTypeDropdown === user.id ? null : user.id);
            setOpenApprovalDropdown(null);
            setOpenUserTypeDropdown(null);
            setOpenRoleDropdown(null);
            setOpenDepartmentDropdown(null);
            setOpenDesignationDropdown(null);
          }}
          className="w-full flex items-center justify-between px-2 py-1.5 text-sm text-gray-600 font-medium hover:bg-gray-50 rounded"
        >
          <div className="flex items-center gap-2">
            {user.work_type === 'on_site' ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
              </svg>
            )}
            <span>{getWorkTypeLabel(user.work_type)}</span>
          </div>
          {openWorkTypeDropdown === user.id ? (
            <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          ) : (
            <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          )}
        </button>
        {openWorkTypeDropdown === user.id && (
          <div className="absolute left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-[10000]">
            {['on_site', 'remote'].map((workType) => (
              <div
                key={workType}
                onClick={(e) => {
                  e.stopPropagation();
                  onWorkTypeChange(user.id, workType as any);
                  if (viewType === 'list') {
                    onMenuClose?.();
                  }
                }}
                className={`px-2 py-1.5 text-sm cursor-pointer hover:bg-gray-100 flex items-center justify-between ${
                  user.work_type === workType ? 'bg-purple-50' : ''
                }`}
              >
                <div className="flex items-center gap-2">
                  {workType === 'on_site' ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600">
                      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                      <polyline points="9 22 9 12 15 12 15 22"></polyline>
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600">
                      <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                    </svg>
                  )}
                  <span className="font-semibold text-gray-700">{getWorkTypeLabel(workType)}</span>
                </div>
                {user.work_type === workType && (
                  <svg className="h-4 w-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* User Type Dropdown */}
      <div className="relative">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setOpenUserTypeDropdown(openUserTypeDropdown === user.id ? null : user.id);
            setOpenApprovalDropdown(null);
            setOpenWorkTypeDropdown(null);
            setOpenRoleDropdown(null);
            setOpenDepartmentDropdown(null);
            setOpenDesignationDropdown(null);
          }}
          className="w-full flex items-center justify-between px-2 py-1.5 text-sm text-gray-600 font-medium hover:bg-gray-50 rounded"
        >
          <div className="flex items-center gap-2">
            {user.user_type === 'employee' ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                <line x1="12" y1="22.08" x2="12" y2="12"></line>
              </svg>
            )}
            <span>{getUserTypeLabel(user.user_type)}</span>
          </div>
          {openUserTypeDropdown === user.id ? (
            <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          ) : (
            <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          )}
        </button>
        {openUserTypeDropdown === user.id && (
          <div className="absolute left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-[10000]">
            {['employee', 'posp_agent'].map((userType) => (
              <div
                key={userType}
                onClick={(e) => {
                  e.stopPropagation();
                  onUserTypeChange(user.id, userType as any);
                  if (viewType === 'list') {
                    onMenuClose?.();
                  }
                }}
                className={`px-2 py-1.5 text-sm cursor-pointer hover:bg-gray-100 flex items-center justify-between ${
                  user.user_type === userType ? 'bg-purple-50' : ''
                }`}
              >
                <div className="flex items-center gap-2">
                  {userType === 'employee' ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600">
                      <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                    </svg>
                  )}
                  <span className="font-semibold text-gray-700">{getUserTypeLabel(userType)}</span>
                </div>
                {user.user_type === userType && (
                  <svg className="h-4 w-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Role Dropdown */}
      <div className="relative">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setOpenRoleDropdown(openRoleDropdown === user.id ? null : user.id);
            setOpenApprovalDropdown(null);
            setOpenWorkTypeDropdown(null);
            setOpenUserTypeDropdown(null);
            setOpenDepartmentDropdown(null);
          }}
          className="w-full flex items-center justify-between px-2 py-1.5 text-sm text-gray-600 font-medium hover:bg-gray-50 rounded"
        >
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
            <span>{getRoleLabel(user.role)}</span>
          </div>
          {openRoleDropdown === user.id ? (
            <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          ) : (
            <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          )}
        </button>
        {openRoleDropdown === user.id && (
          <div className="absolute left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-[10000]">
            {['user', 'admin', 'super_admin'].map((role) => (
              <div
                key={role}
                onClick={(e) => {
                  e.stopPropagation();
                  onRoleChange(user.id, role as any);
                  if (viewType === 'list') {
                    onMenuClose?.();
                  }
                }}
                className={`px-2 py-1.5 text-sm cursor-pointer hover:bg-gray-100 flex items-center justify-between ${
                  user.role === role ? 'bg-purple-50' : ''
                }`}
              >
                <div className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                  <span className="font-semibold text-gray-700">{getRoleLabel(role)}</span>
                </div>
                {user.role === role && (
                  <svg className="h-4 w-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Department Dropdown */}
      <div className="relative">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setOpenDepartmentDropdown(openDepartmentDropdown === user.id ? null : user.id);
            setOpenApprovalDropdown(null);
            setOpenWorkTypeDropdown(null);
            setOpenUserTypeDropdown(null);
            setOpenRoleDropdown(null);
            setOpenDesignationDropdown(null);
          }}
          className="w-full flex items-center justify-between px-2 py-1.5 text-sm text-gray-600 font-medium hover:bg-gray-50 rounded"
        >
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="3" y1="9" x2="21" y2="9"></line>
              <line x1="9" y1="21" x2="9" y2="9"></line>
            </svg>
            <span>{getDepartmentLabel(user.department)}</span>
          </div>
          {openDepartmentDropdown === user.id ? (
            <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          ) : (
            <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          )}
        </button>
        {openDepartmentDropdown === user.id && (
          <div className="absolute left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-[10000]">
            {['sales', 'renewal', 'backend', 'management', 'service'].map((department) => (
              <div
                key={department}
                onClick={(e) => {
                  e.stopPropagation();
                  onDepartmentChange(user.id, department as any);
                  if (viewType === 'list') {
                    onMenuClose?.();
                  }
                }}
                className={`px-2 py-1.5 text-sm cursor-pointer hover:bg-gray-100 flex items-center justify-between ${
                  user.department === department ? 'bg-purple-50' : ''
                }`}
              >
                <div className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="3" y1="9" x2="21" y2="9"></line>
                    <line x1="9" y1="21" x2="9" y2="9"></line>
                  </svg>
                  <span className="font-semibold text-gray-700">{getDepartmentLabel(department)}</span>
                </div>
                {user.department === department && (
                  <svg className="h-4 w-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Designation Dropdown */}
      <div className="relative">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setOpenDesignationDropdown(openDesignationDropdown === user.id ? null : user.id);
            setOpenApprovalDropdown(null);
            setOpenWorkTypeDropdown(null);
            setOpenUserTypeDropdown(null);
            setOpenRoleDropdown(null);
            setOpenDepartmentDropdown(null);
            setOpenIsClientDropdown(null);
            setOpenIsCallerDropdown(null);
          }}
          className="w-full flex items-center justify-between px-2 py-1.5 text-sm text-gray-600 font-medium hover:bg-gray-50 rounded"
        >
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
            <span>{getDesignationLabel(user.designation)}</span>
          </div>
          {openDesignationDropdown === user.id ? (
            <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          ) : (
            <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          )}
        </button>
        {openDesignationDropdown === user.id && (
          <div className="absolute left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-[10000]">
            {availableDesignations.map((designation) => (
              <div
                key={designation}
                onClick={(e) => {
                  e.stopPropagation();
                  onDesignationChange(user.id, designation as any);
                  if (viewType === 'list') {
                    onMenuClose?.();
                  }
                }}
                className={`px-2 py-1.5 text-sm cursor-pointer hover:bg-gray-100 flex items-center justify-between ${user.designation === designation ? 'bg-purple-50' : ''
                  }`}
              >
                <div className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                  <span className="font-semibold text-gray-700">{getDesignationLabel(designation)}</span>
                </div>
                {user.designation === designation && (
                  <svg className="h-4 w-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Is Client Dropdown (Level 1 Only) */}
      {canManageIsClient && (
        <div className="relative">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setOpenIsClientDropdown(openIsClientDropdown === user.id ? null : user.id);
              setOpenApprovalDropdown(null);
              setOpenWorkTypeDropdown(null);
              setOpenUserTypeDropdown(null);
              setOpenRoleDropdown(null);
              setOpenDepartmentDropdown(null);
              setOpenDesignationDropdown(null);
              setOpenIsCallerDropdown(null);
            }}
            className="w-full flex items-center justify-between px-2 py-1.5 text-sm text-gray-600 font-medium hover:bg-gray-50 rounded"
          >
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
              <span>Is Client: {user.is_client ? 'Yes' : 'No'}</span>
            </div>
            {openIsClientDropdown === user.id ? (
              <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
            ) : (
              <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            )}
          </button>
          {openIsClientDropdown === user.id && (
            <div className="absolute left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-[10000]">
              {[true, false].map((isClient) => (
                <div
                  key={isClient ? 'yes' : 'no'}
                  onClick={(e) => {
                    e.stopPropagation();
                    onIsClientChange(user.id, isClient);
                    if (viewType === 'list') {
                      onMenuClose?.();
                    }
                  }}
                  className={`px-2 py-1.5 text-sm cursor-pointer hover:bg-gray-100 flex items-center justify-between ${user.is_client === isClient ? 'bg-purple-50' : ''
                    }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-700">{isClient ? 'Yes' : 'No'}</span>
                  </div>
                  {user.is_client === isClient && (
                    <svg className="h-4 w-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Is Caller Dropdown */}
      <div className="relative">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setOpenIsCallerDropdown(openIsCallerDropdown === user.id ? null : user.id);
            setOpenApprovalDropdown(null);
            setOpenWorkTypeDropdown(null);
            setOpenUserTypeDropdown(null);
            setOpenRoleDropdown(null);
            setOpenDepartmentDropdown(null);
            setOpenDesignationDropdown(null);
            setOpenIsClientDropdown(null);
          }}
          className="w-full flex items-center justify-between px-2 py-1.5 text-sm text-gray-600 font-medium hover:bg-gray-50 rounded"
        >
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
            <span>Is Caller: {user.is_caller ? 'Yes' : 'No'}</span>
          </div>
          {openIsCallerDropdown === user.id ? (
            <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          ) : (
            <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          )}
        </button>
        {openIsCallerDropdown === user.id && (
          <div className="absolute left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-[10000]">
            {[true, false].map((isCaller) => (
              <div
                key={isCaller ? 'yes' : 'no'}
                onClick={(e) => {
                  e.stopPropagation();
                  onIsCallerChange(user.id, isCaller);
                  if (viewType === 'list') {
                    onMenuClose?.();
                  }
                }}
                className={`px-2 py-1.5 text-sm cursor-pointer hover:bg-gray-100 flex items-center justify-between ${user.is_caller === isCaller ? 'bg-purple-50' : ''
                  }`}
              >
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-700">{isCaller ? 'Yes' : 'No'}</span>
                </div>
                {user.is_caller === isCaller && (
                  <svg className="h-4 w-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="-mx-1 my-1 h-px bg-gray-200"></div>
      
      {/* Status Options */}
      <div 
        onClick={async (e) => {
          e.stopPropagation();
          await onStatusChange(user.id, 'active');
          handleClose();
          onMenuClose?.();
        }}
        className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm text-gray-600 font-medium outline-none transition-colors hover:bg-gray-100"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-4 w-4 text-emerald-600">
          <path d="M12 2v10"></path>
          <path d="M18.4 6.6a9 9 0 1 1-12.77.04"></path>
        </svg>
        Set Active
      </div>
      
      <div 
        onClick={async (e) => {
          e.stopPropagation();
          await onStatusChange(user.id, 'inactive');
          handleClose();
          onMenuClose?.();
        }}
        className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm text-gray-600 font-medium outline-none transition-colors hover:bg-gray-100"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-4 w-4 text-amber-600">
          <path d="M18.36 6.64A9 9 0 0 1 20.77 15"></path>
          <path d="M6.16 6.16a9 9 0 1 0 12.68 12.68"></path>
          <path d="M12 2v4"></path>
          <path d="m2 2 20 20"></path>
        </svg>
        Set Inactive
      </div>
      
      <div className="-mx-1 my-1 h-px bg-gray-200"></div>
      
      <div 
        onClick={async (e) => {
          e.stopPropagation();
          if (confirm('Are you sure you want to delete this user?')) {
            await onDelete(user.id);
            handleClose();
            onMenuClose?.();
          }
        }}
        className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm text-rose-700 font-medium outline-none transition-colors hover:bg-gray-100"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-4 w-4">
          <path d="M3 6h18"></path>
          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
          <line x1="10" x2="10" y1="11" y2="17"></line>
          <line x1="14" x2="14" y1="11" y2="17"></line>
        </svg>
        Delete User
      </div>
    </div>
  );

  if (viewType === 'grid') {
    return (
      <div className="relative" ref={menuRef}>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onToggle();
          }}
          className="text-gray-400 hover:text-gray-600"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
            <circle cx="12" cy="5" r="1.5"></circle>
            <circle cx="12" cy="12" r="1.5"></circle>
            <circle cx="12" cy="19" r="1.5"></circle>
          </svg>
        </button>
        
        {isOpen && (
          <>
            {/* Mobile backdrop */}
            <div 
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[9998] md:hidden"
              onClick={(e) => {
                e.stopPropagation();
                onMenuClose?.();
              }}
            ></div>
            
            {/* Menu - centered on mobile, normal position on desktop */}
            <div 
              className="fixed md:absolute left-1/2 md:left-auto top-1/2 md:top-full right-auto md:right-0 -translate-x-1/2 md:translate-x-0 -translate-y-1/2 md:translate-y-0 mt-0 md:mt-2 z-[9999] w-[90vw] max-w-[320px] md:w-auto md:min-w-[224px] md:max-w-none rounded-md border border-gray-200 bg-white shadow-md animate-in fade-in-0 zoom-in-95"
              style={{ fontFamily: "'Roboto', sans-serif" }}
              onClick={(e) => e.stopPropagation()}
            >
              {menuContent}
            </div>
          </>
        )}
      </div>
    );
  } else {
    // Table view with fixed positioning
    return (
      <div className="relative" ref={menuRef}>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onToggle(e);
          }}
          className="text-gray-400 hover:text-gray-600 p-1"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
            <circle cx="12" cy="5" r="1.5"></circle>
            <circle cx="12" cy="12" r="1.5"></circle>
            <circle cx="12" cy="19" r="1.5"></circle>
          </svg>
        </button>
        
        {isOpen && menuPosition && (
          <>
            {/* Mobile backdrop */}
            <div 
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[9998] md:hidden"
              onClick={(e) => {
                e.stopPropagation();
                onMenuClose?.();
              }}
            ></div>
            
            {/* Menu - centered on mobile, normal position on desktop */}
            <div 
              className="fixed left-1/2 md:left-auto top-1/2 md:top-auto right-auto md:right-auto -translate-x-1/2 md:translate-x-0 -translate-y-1/2 md:translate-y-0 z-[9999] w-[90vw] max-w-[320px] md:w-auto md:min-w-[224px] md:max-w-none rounded-md border border-gray-200 bg-white shadow-md animate-in fade-in-0 zoom-in-95"
              style={{ 
                fontFamily: "'Roboto', sans-serif",
                top: window.innerWidth >= 768 ? `${menuPosition.top}px` : '50%',
                right: window.innerWidth >= 768 ? `${menuPosition.right}px` : 'auto'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {menuContent}
            </div>
          </>
        )}
      </div>
    );
  }
}
