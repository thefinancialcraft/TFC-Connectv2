
export interface NavItemType {
  name: string;
  path: string;
  icon: string;
  adminOnly: boolean;
}

export const NAV_ITEMS: NavItemType[] = [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: "fi-rr-home",
    adminOnly: false,
  },
  {
    name: "Users",
    path: "/users",
    icon: "fi-rr-users",
    adminOnly: false, // Only show for admin/super_admin
  },
  {
    name: "Customer",
    path: "/customer",
    icon: "fi-rr-users",
    adminOnly: false,
  },
  {
    name: "Campaign",
    path: "/campaign",
    icon: "fi-rr-bullhorn",
    adminOnly: false,
  },
  {
    name: "Activity",
    path: "/activity",
    icon: "fi-rr-time-past",
    adminOnly: false,
  },
  {
    name: "Follow Up",
    path: "/followup",
    icon: "fi-rr-calendar-clock",
    adminOnly: false,
  },
  {
    name: "Organization",
    path: "/organization",
    icon: "fi-rr-building",
    adminOnly: false,
  },
  {
    name: "Team",
    path: "/team",
    icon: "fi-rr-users-alt",
    adminOnly: false,
  },
];
