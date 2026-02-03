
export enum DashboardLevel {
  LEVEL_1_ADMIN = 'LEVEL_1', // Global Admin
  LEVEL_2_CLIENT_CEO = 'LEVEL_2', // Client CEO
  LEVEL_3_TL_SALES = 'LEVEL_3', // Team Leader
  LEVEL_4_AGENT_SALES = 'LEVEL_4', // Agent
  UNKNOWN = 'UNKNOWN'
}

export const getUserDashboardLevel = (user: any): DashboardLevel => {
  if (!user) return DashboardLevel.UNKNOWN;

  // --- Level 1: Super Admin / Management (TFC Internal) ---
  if (user.isClient === false) {
    return DashboardLevel.LEVEL_1_ADMIN;
  }

  const role = user.role;
  const designation = user.designation?.toLowerCase() || '';

  // --- Level 2: Client CEO / Org Owner ---
  if (
    user.isClient === true &&
    (role === 'super_admin' || designation === 'ceo' || designation === 'owner')
  ) {
    return DashboardLevel.LEVEL_2_CLIENT_CEO;
  }

  // --- Level 3: Team Leader ---
  // Role is 'admin' and designation is 'team_leader'
  if (
    user.isClient === true &&
    role === 'admin' && 
    (designation === 'team_leader' || designation === 'teamleader' || designation.includes('tl'))
  ) {
    return DashboardLevel.LEVEL_3_TL_SALES;
  }

  // --- Level 4: Sales Agent ---
  // Default for normal users (role = 'user' or any other non-admin/non-owner)
  return DashboardLevel.LEVEL_4_AGENT_SALES;
};
