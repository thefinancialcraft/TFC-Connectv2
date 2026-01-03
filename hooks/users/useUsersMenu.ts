import { useState, useRef } from "react";
import { UserMenuState } from "../../components/users/types";

export function useUsersMenu(): { menuState: UserMenuState; menuRefs: React.MutableRefObject<{ [key: string]: HTMLDivElement | null }> } {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [openApprovalDropdown, setOpenApprovalDropdown] = useState<string | null>(null);
  const [openWorkTypeDropdown, setOpenWorkTypeDropdown] = useState<string | null>(null);
  const [openUserTypeDropdown, setOpenUserTypeDropdown] = useState<string | null>(null);
  const [openRoleDropdown, setOpenRoleDropdown] = useState<string | null>(null);
  const [openDepartmentDropdown, setOpenDepartmentDropdown] = useState<string | null>(null);
  const [openDesignationDropdown, setOpenDesignationDropdown] = useState<string | null>(null);
  const [openIsClientDropdown, setOpenIsClientDropdown] = useState<string | null>(null);
  const [openIsCallerDropdown, setOpenIsCallerDropdown] = useState<string | null>(null);
  const [menuPosition, setMenuPosition] = useState<{ top: number; right: number } | null>(null);

  const menuRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const menuState: UserMenuState = {
    openMenuId,
    setOpenMenuId,
    openApprovalDropdown,
    setOpenApprovalDropdown,
    openWorkTypeDropdown,
    setOpenWorkTypeDropdown,
    openUserTypeDropdown,
    setOpenUserTypeDropdown,
    openRoleDropdown,
    setOpenRoleDropdown,
    openDepartmentDropdown,
    setOpenDepartmentDropdown,
    openDesignationDropdown,
    setOpenDesignationDropdown,
    openIsClientDropdown,
    setOpenIsClientDropdown,
    openIsCallerDropdown,
    setOpenIsCallerDropdown,
    menuPosition,
    setMenuPosition,
  };

  return { menuState, menuRefs };
}
