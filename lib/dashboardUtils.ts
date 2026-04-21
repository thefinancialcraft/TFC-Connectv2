
export enum DashboardLevel {
  LEVEL_1_ADMIN = 'LEVEL_1', // Global Admin
  LEVEL_2_CLIENT_CEO = 'LEVEL_2', // Client CEO
  LEVEL_3_TL_SALES = 'LEVEL_3', // Team Leader
  LEVEL_4_AGENT_SALES = 'LEVEL_4', // Agent
  UNKNOWN = 'UNKNOWN'
}

export const getUserDashboardLevel = (user: any): DashboardLevel => {
  if (!user) return DashboardLevel.UNKNOWN;

  const role = (user.role || '').toLowerCase();
  const designation = (user.designation || '').toLowerCase();

  // --- Level 1: Super Admin / Management (TFC Internal) ---
  if (
    user.isClient === false && 
    (role === 'superadmin' || role === 'super_admin') && 
    (designation === 'ceo' || designation === 'developer')
  ) {
    return DashboardLevel.LEVEL_1_ADMIN;
  }
  // --- Level 2: Client CEO / Org Owner / Developer ---
  if (
    user.isClient === true &&
    (role === 'super_admin' || role === 'superadmin' || designation === 'ceo' || designation === 'developer' || designation === 'owner')
  ) {
    return DashboardLevel.LEVEL_2_CLIENT_CEO;
  }

  // If we don't have enough data to determine level, return UNKNOWN
  if (!role) return DashboardLevel.UNKNOWN;

  // --- Level 3: Team Leader ---
  // Designation is 'team_leader' (role may be 'admin' or 'user')
  if (
    user.isClient === true &&
    (designation === 'team_leader' || designation === 'teamleader' || designation.includes('tl') || designation === 'manager')
  ) {
    return DashboardLevel.LEVEL_3_TL_SALES;
  }

  // --- Level 4: Sales Agent ---
  // Default for normal users (role = 'user' or any other non-admin/non-owner)
  return DashboardLevel.LEVEL_4_AGENT_SALES;
};
