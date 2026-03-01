import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { supabase } from "../lib/supabase";
import { useSessionState } from "./useSessionState";

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
  member_count?: number;
  member_avatars?: (string | null)[];
}

export function useOrganizationData(user: any, mounted: boolean) {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useSessionState<string>("org_searchQuery", "");
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchOrganizations = useCallback(async (isBackground = false) => {
    if (!mounted || !user?.uid) return;

    if (abortControllerRef.current) {
        abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    try {
      if (!isBackground) setLoading(true);
      setError("");

      // 1. Fetch Organizations
      let query = supabase
        .from("organizations")
        .select("*")
        .order("company_joined", { ascending: false });

      // --- SECURITY FILTERING ---
      const designation = user.designation?.toLowerCase() || '';
      const isCEO = user.isClient === true && designation === 'ceo';

      if (isCEO && user.organization_id) {
          query = query.eq('id', user.organization_id);
      } else if (user.isClient === true && !isCEO) {
          // Safety: If somehow a non-CEO client reaches here, show nothing
          query = query.eq('id', '00000000-0000-0000-0000-000000000000');
      }

      const { data: orgData, error: orgError } = await query
        .abortSignal(abortControllerRef.current.signal);

      if (orgError) throw orgError;

      // 2. Fetch member counts and avatars efficiently (bulk)
      const { data: memberData, error: memberError } = await supabase
        .from("user_profiles")
        .select("organization_id, profile_pic_url")
        .not("organization_id", "is", null)
        .abortSignal(abortControllerRef.current.signal);

      if (memberError) {
        console.error("Error fetching member data:", memberError);
      }

      const counts: Record<string, number> = {};
      const avatars: Record<string, (string | null)[]> = {};
      
      memberData?.forEach((m: { organization_id: string; profile_pic_url: string | null }) => {
        counts[m.organization_id] = (counts[m.organization_id] || 0) + 1;
        
        if (!avatars[m.organization_id]) avatars[m.organization_id] = [];
        if (avatars[m.organization_id].length < 3) {
          avatars[m.organization_id].push(m.profile_pic_url);
        }
      });

      const enrichedOrgs = (orgData || []).map(org => ({
        ...org,
        member_count: counts[org.id] || 0,
        member_avatars: avatars[org.id] || []
      }));

      setOrganizations(enrichedOrgs);

    } catch (err: any) {
      if (err.name !== 'AbortError') {
        console.error("Error fetching organizations:", err);
        setError("Failed to load organizations");
      }
    } finally {
      if (!isBackground) setLoading(false);
    }
  }, [mounted, user?.uid, user?.designation, user?.organization_id, user?.isClient]);

  useEffect(() => {
    fetchOrganizations();
    return () => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
    };
  }, [fetchOrganizations]);

  const stats = useMemo(() => {
    const total = organizations.length;
    let active = 0;
    let inactive = 0;
    let recent = 0;
    
    const monthAgo = new Date();
    monthAgo.setMonth(monthAgo.getMonth() - 1);

    organizations.forEach(org => {
      if (org.is_active) active++;
      else inactive++;

      if (org.company_joined) {
        const joined = new Date(org.company_joined);
        if (joined > monthAgo) recent++;
      }
    });

    return { total, active, inactive, recent };
  }, [organizations]);

  const filteredOrgs = useMemo(() => {
    // Stage 0: Hydration Gate
    if (!mounted || !user) return [];

    const query = searchQuery.toLowerCase().trim();
    if (!query) return organizations;
    return organizations.filter(org =>
      org.company_name.toLowerCase().includes(query) ||
      org.owner_name?.toLowerCase().includes(query) ||
      org.company_code?.toLowerCase().includes(query)
    );
  }, [organizations, searchQuery, mounted, user]);

  return {
    organizations,
    filteredOrgs,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    stats,
    fetchOrganizations
  };
}
