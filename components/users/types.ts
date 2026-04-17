export interface UserStats {
  activeUsers: number;
  totalUsers: number;
  inactiveUsers: number;
  approved: number;
  pending: number;
  hold: number;
  suspend: number;
  totalSalary: number;
  averageSalary: number;
}

export interface PendingUser {
  id: string;
  user_id: string;
  user_name: string | null;
  email: string | null;
  profile_pic_url: string | null;
  date_of_joining: string | null;
  employee_id: string | null;
  created_at: string | null;
  user_type: string | null;
  is_client: boolean | null;
  is_caller: boolean | null;
}

export interface AllUser {
  id: string;
  user_id: string;
  email: string | null;
  user_name: string | null;
  contact_no: string | null;
  employee_id: string | null;
  role: string | null;
  status: string | null;
  approval_status: string | null;
  super_admin: boolean | null;
  father_name: string | null;
  gender: string | null;
  pan_number: string | null;
  aadhar_card_no: string | null;
  date_of_birth: string | null;
  date_of_joining: string | null;
  in_hand_salary: number | null;
  alternate_contact: string | null;
  primary_address: string | null;
  area_pincode: string | null;
  bank_name: string | null;
  account_holder_name: string | null;
  account_number: string | null;
  ifsc_code: string | null;
  branch_pincode: string | null;
  branch_state: string | null;
  branch_city: string | null;
  blood_group: string | null;
  emergency_contact_no: string | null;
  profile_pic_url: string | null;
  pancard_url: string | null;
  aadhar_front_url: string | null;
  aadhar_back_url: string | null;
  qualification_marksheet_url: string | null;
  bank_passbook_url: string | null;
  profile_complete: boolean | null;
  created_at: string | null;
  updated_at: string | null;
  hold_start_date: string | null;
  hold_end_date: string | null;
  status_reason: string | null;
  hold_by_user_id: string | null;
  user_type: string | null;
  work_type: string | null;
  department: string | null;
  designation: string | null;
  organization_id: string | null;
  organizations?: { id: string; company_name: string; org_code: string } | null;
  is_client: boolean | null;
  is_caller: boolean | null;
  joined_at: string | null;
  renewal_at: string | null;
  expire_at: string | null;
}

export interface UserActionHandlers {
  handleStatusChange: (userId: string, status: string) => void;
  handleWorkTypeChange: (userId: string, workType: string) => void;
  handleUserTypeChange: (userId: string, userType: string) => void;
  handleRoleChange: (userId: string, role: string) => void;
  handleDepartmentChange: (userId: string, department: string) => void;
  handleDesignationChange: (userId: string, designation: string) => void;
  handleIsClientChange: (userId: string, isClient: boolean) => void;
  handleIsCallerChange: (userId: string, isCaller: boolean) => void;
  handleUserStatusChange: (userId: string, status: "active" | "inactive") => void;
  handleDeleteUser: (userId: string) => void;
}

export interface UserMenuState {
  openMenuId: string | null;
  setOpenMenuId: (id: string | null) => void;
  openApprovalDropdown: string | null;
  setOpenApprovalDropdown: (id: string | null) => void;
  openWorkTypeDropdown: string | null;
  setOpenWorkTypeDropdown: (id: string | null) => void;
  openUserTypeDropdown: string | null;
  setOpenUserTypeDropdown: (id: string | null) => void;
  openRoleDropdown: string | null;
  setOpenRoleDropdown: (id: string | null) => void;
  openDepartmentDropdown: string | null;
  setOpenDepartmentDropdown: (id: string | null) => void;
  openDesignationDropdown: string | null;
  setOpenDesignationDropdown: (id: string | null) => void;
  openIsClientDropdown: string | null;
  setOpenIsClientDropdown: (id: string | null) => void;
  openIsCallerDropdown: string | null;
  setOpenIsCallerDropdown: (id: string | null) => void;
  menuPosition: { top: number; right: number } | null;
  setMenuPosition: (pos: { top: number; right: number } | null) => void;
}



export interface UserFilters {
  approval_status: "" | "approved" | "pending" | "hold" | "suspend" | "rejected";
  role: "" | "user" | "admin" | "super_admin";
  department: "" | "sales" | "renewal" | "backend" | "management" | "service";
  designation: "" | "agent" | "manager" | "faculty_staff" | "team_leader" | "ceo" | "developer";
  work_type: "" | "remote" | "on_site";
  user_type: "" | "employee" | "posp_agent";
  status: "" | "active" | "inactive";
  organization_id?: string;
  is_client?: boolean | "";
  is_caller?: boolean | "";
}
