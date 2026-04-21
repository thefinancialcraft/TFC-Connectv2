
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
  const isClient = user.isClient === true;

  // --- Level 1: TFC Superadmin (CEO) ---
  if (!isClient && (role === 'superadmin' || role === 'super_admin') && designation === 'ceo') {
    return DashboardLevel.LEVEL_1_ADMIN;
  }

  // --- Level 2: Client Superadmin (CEO) ---
  if (isClient && (role === 'superadmin' || role === 'super_admin') && designation === 'ceo') {
    return DashboardLevel.LEVEL_2_CLIENT_CEO;
  }

  // --- Level 3: Client Admin (Team Leader) ---
  if (isClient && (role === 'admin' || role === 'super_admin') && (designation === 'team_leader' || designation === 'teamleader')) {
    return DashboardLevel.LEVEL_3_TL_SALES;
  }

  // --- Level 4: Sales Agent ---
  return DashboardLevel.LEVEL_4_AGENT_SALES;
};
