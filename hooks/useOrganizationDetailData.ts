import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { supabase } from "../lib/supabase";
import { Organization } from "./useOrganizationData";

export interface OrgUser {
  id: string;
  user_name: string | null;
  email: string;
  role: string | null;
  status: string | null;
  profile_pic_url: string | null;
  employee_id: string | null;
  expire_at: string | null;
  is_client?: boolean;
}

export function useOrganizationDetailData(organizationId: string | string[] | undefined) {
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [orgUsers, setOrgUsers] = useState<OrgUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchData = useCallback(async (isBackground = false) => {
    if (!organizationId || Array.isArray(organizationId)) return;

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    try {
      if (!isBackground) setLoading(true);
      setError("");

      // 1. Fetch Organization Details
      const { data: orgData, error: orgError } = await supabase
        .from("organizations")
        .select("*")
        .eq("id", organizationId)
        .single();

      if (orgError) throw orgError;
      setOrganization(orgData);

      // 2. Fetch Users associated with this organization
      const { data: userData, error: userError } = await supabase
        .from("user_profiles")
        .select("id, user_name, email, role, status, profile_pic_url, employee_id, expire_at, is_client")
        .eq("organization_id", organizationId)
        .order("user_name", { ascending: true });

      if (userError) throw userError;
      setOrgUsers(userData || []);

    } catch (err: any) {
      if (err.name !== 'AbortError') {
        console.error("Error fetching organization detail data:", err);
        setError("Failed to load organization details");
      }
    } finally {
      if (!isBackground) setLoading(false);
    }
  }, [organizationId]);

  useEffect(() => {
    fetchData();
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchData]);

  const refreshData = useCallback((isBackground = false) => {
    return fetchData(isBackground);
  }, [fetchData]);

  const stats = useMemo(() => {
    const totalMembers = orgUsers.length;
    const activeLicenses = orgUsers.filter(u => u.status === "active").length;
    
    // Expiring soon: within 30 days
    const now = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(now.getDate() + 30);
    
    const expiringSoon = orgUsers.filter(u => {
      if (!u.expire_at) return false;
      const expiryDate = new Date(u.expire_at);
      return expiryDate > now && expiryDate <= thirtyDaysFromNow;
    }).length;

    return { totalMembers, activeLicenses, expiringSoon };
  }, [orgUsers]);

  const filteredUsers = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return orgUsers;
    return orgUsers.filter(u =>
      (u.user_name?.toLowerCase() || "").includes(query) ||
      (u.email?.toLowerCase() || "").includes(query) ||
      (u.employee_id?.toLowerCase() || "").includes(query)
    );
  }, [orgUsers, searchQuery]);

  return {
    loading,
    organization,
    setOrganization,
    orgUsers,
    setOrgUsers,
    stats,
    filteredUsers,
    searchQuery,
    setSearchQuery,
    refreshData
  };
}
