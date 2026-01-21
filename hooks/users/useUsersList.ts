import { useState } from "react";
import { supabase } from "../../lib/supabase";
import { AllUser, PendingUser } from "../../components/users/types";

export function useUsersList(
  userTypeToggle: "all" | "employee" | "posp_agent",
  organizationId: string | null = null,
  isAuthorised: boolean = false
) {
  const [allUsers, setAllUsers] = useState<AllUser[]>([]);
  const [loadingAllUsers, setLoadingAllUsers] = useState(true);
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);
  const [loadingPendingUsers, setLoadingPendingUsers] = useState(true);

  const fetchAllUsers = async () => {
    try {
      setLoadingAllUsers(true);
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        setLoadingAllUsers(false);
        return;
      }

      // Build query based on userTypeToggle
      let query = supabase
        .from("user_profiles")
        .select("*, organizations(id, company_name, org_code)")
        .order("date_of_joining", { ascending: false });

      if (userTypeToggle === "employee") {
        query = query.eq("user_type", "employee");
      } else if (userTypeToggle === "posp_agent") {
        query = query.eq("user_type", "posp_agent");
      }

      // Filter by organization if the user is not a global authoriser
      if (!isAuthorised) {
        if (organizationId) {
          query = query.eq("organization_id", organizationId);
        } else {
          // If restricted but no organizationId provided, don't fetch anything to prevent leak
          setAllUsers([]);
          setLoadingAllUsers(false);
          return;
        }
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching all users:", error);
        setAllUsers([]);
      } else {
        const mappedData = (data || []).map((user: any) => ({
          ...user,
          user_name: user.user_name || user.name || null,
          profile_pic_url: user.profile_pic_url || user.profile_image || null,
        }));
        setAllUsers(mappedData);
      }
    } catch (err) {
      console.error("Error fetching all users:", err);
    } finally {
      setLoadingAllUsers(false);
    }
  };

  const fetchPendingUsers = async () => {
    try {
      setLoadingPendingUsers(true);
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        setLoadingPendingUsers(false);
        return;
      }

      // Build query based on userTypeToggle
      let query = supabase
        .from("user_profiles")
        .select("*")
        .eq("approval_status", "pending")
        .order("created_at", { ascending: false });

      if (userTypeToggle === "employee") {
        query = query.eq("user_type", "employee");
      } else if (userTypeToggle === "posp_agent") {
        query = query.eq("user_type", "posp_agent");
      }

      // Filter by organization if the user is not a global authoriser
      if (!isAuthorised) {
        if (organizationId) {
          query = query.eq("organization_id", organizationId);
        } else {
          // If restricted but no organizationId provided, don't fetch anything to prevent leak
          setPendingUsers([]);
          setLoadingPendingUsers(false);
          return;
        }
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching pending users:", error);
        setPendingUsers([]);
      } else {
        setPendingUsers(data || []);
      }
    } catch (err) {
      console.error("Error fetching pending users:", err);
    } finally {
      setLoadingPendingUsers(false);
    }
  };

  const checkAndApproveExpiredHolds = async () => {
    try {
      const now = new Date().toISOString();
      const { data: expiredHolds, error: fetchError } = await supabase
        .from("user_profiles")
        .select("id, role, approval_status, user_type")
        .eq("approval_status", "hold")
        .lt("hold_end_date", now);

      if (fetchError) throw fetchError;

      if (expiredHolds && expiredHolds.length > 0) {
        console.log(`Found ${expiredHolds.length} expired holds. Auto-approving...`);

        // Group updates - direct supabase update
        const updates = expiredHolds.map(async (user) => {
          // If status was 'hold', revert to 'approved'
          // Also set status to 'active' if it was 'inactive'
          return supabase
            .from("user_profiles")
            .update({
              approval_status: "approved",
              status: "active",
              hold_start_date: null,
              hold_end_date: null,
              status_reason: "Hold expired - Auto approved",
              hold_by_user_id: null,
            })
            .eq("id", user.id);
        });

        await Promise.all(updates);
        console.log("Auto-approved expired holds");
        
        // Refresh data
        fetchAllUsers();
      }
    } catch (error) {
      console.error("Error checking expired holds:", error);
    }
  };

  return {
    allUsers,
    loadingAllUsers,
    pendingUsers,
    loadingPendingUsers,
    fetchAllUsers,
    fetchPendingUsers,
    checkAndApproveExpiredHolds,
    setAllUsers // Exposed for optimistic updates if needed
  };
}
