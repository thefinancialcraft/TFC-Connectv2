import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { UserFilters } from "../../components/users/types";
import { useRouter } from "next/router";

export function useUsersFilters() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [viewType, setViewType] = useState<"grid" | "list">("grid");
  const [userTypeToggle, setUserTypeToggle] = useState<"all" | "employee" | "posp_agent">("all");
  const [organizations, setOrganizations] = useState<{ id: string; company_name: string }[]>([]);
  
  const [filters, setFilters] = useState<UserFilters>({
    approval_status: "",
    role: "",
    department: "",
    designation: "" as any,
    work_type: "",
    user_type: "",
    status: "",
    organization_id: "",
    is_client: "",
    is_caller: "",
  });

  // Handle organization filter from URL
  useEffect(() => {
    if (router.isReady && router.query.organization) {
      setFilters(prev => ({ ...prev, organization_id: router.query.organization as string }));
    }
  }, [router.isReady, router.query.organization]);

  const fetchOrgs = async () => {
    const { data } = await supabase.from("organizations").select("id, company_name").order("company_name");
    if (data) setOrganizations(data);
  };

  useEffect(() => {
    fetchOrgs();
  }, []);

  return {
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
    fetchOrgs
  };
}
