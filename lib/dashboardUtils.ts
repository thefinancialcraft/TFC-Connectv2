
export enum DashboardLevel {
  LEVEL_1_ADMIN = 'LEVEL_1', // Global Admin
  LEVEL_2_CLIENT_CEO = 'LEVEL_2', // Client CEO
  LEVEL_3_TL_SALES = 'LEVEL_3', // Team Leader
  LEVEL_4_AGENT_SALES = 'LEVEL_4', // Agent
  UNKNOWN = 'UNKNOWN'
}

export const getUserDashboardLevel = (user: any): DashboardLevel => {
  if (!user) return DashboardLevel.UNKNOWN;

  const role = (user.role || '').toLowerCase().trim().replace(/\s+/g, '_');
  const designation = (user.designation || '').toLowerCase().trim().replace(/\s+/g, '_');
  const isClient = user.isClient === true;

  // --- Level 1: TFC Superadmin (CEO) ---
  if (!isClient && (role === 'superadmin' || role === 'super_admin') && (designation === 'ceo' || designation === 'super_admin' || designation === 'developer')) {
    return DashboardLevel.LEVEL_1_ADMIN;
  }

  // --- Level 2: Client Superadmin / General Admin (Full Org Access) ---
  // If they are admin/super_admin but NOT a team leader, they should see all org users
  if (isClient && (role === 'superadmin' || role === 'super_admin' || role === 'admin')) {
    if (designation === 'team_leader' || designation === 'teamleader') {
      // --- Level 3: Client Admin (Team Leader) ---
      return DashboardLevel.LEVEL_3_TL_SALES;
    }
    return DashboardLevel.LEVEL_2_CLIENT_CEO;
  }

  // --- Level 4: Sales Agent ---
  return DashboardLevel.LEVEL_4_AGENT_SALES;
};
