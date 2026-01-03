import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { supabase } from "../lib/supabase";

export interface Organization {
  id: string;
  company_name: string;
  company_type: string | null;
  company_joined: string | null;
  owner_name: string | null;
  owner_phone_no: string | null;
  gst_no: string | null;
  address: string | null;
  email: string | null;
  description: string | null;
  is_active: boolean;
  renewal_date: string | null;
  expiry_date: string | null;
  org_code: string | null;
  company_code: string | null;
}

export interface OrgUser {
  id: string;
  user_name: string | null;
  email: string | null;
  role: string | null;
  status: string | null;
  profile_pic_url: string | null;
  expire_at: string | null;
  is_client: boolean;
  employee_id: string | null;
}

export function useOrganizationDetailData(orgId: string | string[] | undefined) {
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [orgUsers, setOrgUsers] = useState<OrgUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchData = useCallback(async (isBackground = false) => {
    if (!orgId || Array.isArray(orgId)) return;

    if (abortControllerRef.current) {
        abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    try {
      if (!isBackground) setLoading(true);
      setError(null);

      // 1. Fetch Organization Details
      const { data: orgData, error: orgError } = await supabase
        .from("organizations")
        .select("*")
        .eq("id", orgId)
        .abortSignal(abortControllerRef.current.signal)
        .single();

      if (orgError) throw orgError;
      setOrganization(orgData as Organization);

      // 2. Fetch Users in this Organization
      const { data: userData, error: userError } = await supabase
        .from("user_profiles")
        .select("id, user_name, email, role, status, profile_pic_url, expire_at, is_client, employee_id")
        .eq("organization_id", orgId)
        .abortSignal(abortControllerRef.current.signal)
        .order("created_at", { ascending: false });
        
      if (userError) throw userError;
      setOrgUsers(userData as OrgUser[] || []);

    } catch (err: any) {
      if (err.name !== 'AbortError') {
        console.error("Error fetching organization detail:", err);
        setError("Failed to load organization data");
      }
    } finally {
      if (!isBackground) setLoading(false);
    }
  }, [orgId]);

  useEffect(() => {
    fetchData();
    return () => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
    };
  }, [fetchData]);

  const stats = useMemo(() => {
    const now = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(now.getDate() + 30);

    let activeLicenses = 0;
    let inactive = 0;
    let expiringSoon = 0;

    orgUsers.forEach(u => {
        if (u.status === 'active') activeLicenses++;
        else inactive++;

        if (u.expire_at) {
            const expDate = new Date(u.expire_at);
            if (expDate > now && expDate <= thirtyDaysFromNow) {
                expiringSoon++;
            }
        }
    });

    return {
        totalMembers: orgUsers.length,
        activeLicenses,
        expiringSoon,
        inactive
    };
  }, [orgUsers]);

  const filteredUsers = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return orgUsers;
    return orgUsers.filter(u => 
        u.user_name?.toLowerCase().includes(query) || 
        u.email?.toLowerCase().includes(query) ||
        u.employee_id?.toLowerCase().includes(query)
    );
  }, [orgUsers, searchQuery]);

  return {
    organization,
    setOrganization,
    orgUsers,
    setOrgUsers,
    loading,
    error,
    stats,
    filteredUsers,
    searchQuery,
    setSearchQuery,
    refreshData: fetchData
  };
}
