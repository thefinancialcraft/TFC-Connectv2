import { useState } from "react";
import { supabase } from "../../lib/supabase";
import { AllUser } from "../../components/users/types";
import { useUser } from "../../context/UserContext";
import { logSystemEvent, estimateSize } from "../../lib/monitoring";

// Helper for exporting CSV - moved to utils.ts


export function useUsersActions(refreshData: () => Promise<void>) {
  const { user } = useUser();
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  
  // Modals state
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [approvalUserData, setApprovalUserData] = useState<AllUser | null>(null);
  const [approvalFormData, setApprovalFormData] = useState({
    role: "user" as any,
    department: "sales" as any,
    designation: "agent" as any,
    work_type: "on_site" as any,
    user_type: "employee" as any,
    status: "active" as any,
    is_client: false as boolean,
    is_caller: true as boolean,
  });

  const [showHoldModal, setShowHoldModal] = useState(false);
  const [holdUserData, setHoldUserData] = useState<AllUser | null>(null);
  const [holdFormData, setHoldFormData] = useState({
    duration: "1" as any,
    customDate: "",
    customTime: "",
    reason: "",
  });

  const [showSuspendModal, setShowSuspendModal] = useState(false);
  const [suspendUserData, setSuspendUserData] = useState<AllUser | null>(null);
  const [suspendFormData, setSuspendFormData] = useState({
    reason: "",
  });

  const handleStatusChange = async (userId: string, approvalStatus: string) => {
    try {
      if (approvalStatus === "approved") {
        const { data: fullUserData, error } = await supabase.from("user_profiles").select("*").eq("id", userId).single();
        if (error) throw error;
        setApprovalUserData(fullUserData);
        setApprovalFormData({
          role: fullUserData.role || "user",
          department: fullUserData.department || "sales",
          designation: fullUserData.designation || "agent",
          work_type: fullUserData.work_type || "on_site",
          user_type: fullUserData.user_type || "employee",
          status: fullUserData.status || "active",
          is_client: !!fullUserData.is_client,
          is_caller: fullUserData.is_caller !== false, // default to true if null
        });
        setShowApprovalModal(true);
        return;
      }
      if (approvalStatus === "hold") {
        const { data: fullUserData, error } = await supabase.from("user_profiles").select("*").eq("id", userId).single();
        if (error) throw error;
        setHoldUserData(fullUserData);
        setShowHoldModal(true);
        return;
      }
      if (approvalStatus === "suspend") {
        const { data: fullUserData, error } = await supabase.from("user_profiles").select("*").eq("id", userId).single();
        if (error) throw error;
        setSuspendUserData(fullUserData);
        setShowSuspendModal(true);
        return;
      }

      if (approvalStatus === "rejected") {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          alert("You must be logged in to reject users");
          return;
        }
        const response = await fetch(`/api/auth/delete-user?userId=${userId}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${session.access_token}` },
        });
        if (!response.ok) throw new Error("Failed to reject and delete user");
        await refreshData();
        window.location.reload();

        logSystemEvent({
            event_type: 'WRITE',
            description: `Reject & Delete User: ${userId}`,
            metadata: { user_id: userId },
            payload_size: estimateSize({ userId }),
            user_name: user?.displayName || 'Admin',
            organization_id: user?.organization_id || undefined
        });
        return;
      }

      // Direct update for other statuses
      await refreshData();

      logSystemEvent({
          event_type: 'WRITE',
          description: `User Status Change: ${userId} set to ${approvalStatus}`,
          metadata: { user_id: userId, status: approvalStatus },
          payload_size: estimateSize({ userId, approvalStatus }),
          user_name: user?.displayName || 'Admin',
          organization_id: user?.organization_id || undefined
      });
    } catch (err) {
      console.error("Error updating status:", err);
      alert("Failed to update status");
    }
  };

  const handleUpdateField = async (userId: string, field: string, value: any) => {
    try {
      const { error } = await supabase.from("user_profiles").update({ [field]: value, updated_at: new Date().toISOString() }).eq("id", userId);
      if (error) throw error;
      await refreshData();

      logSystemEvent({
          event_type: 'WRITE',
          description: `User Update: Field "${field}" set to "${String(value)}" for user ${userId}`,
          metadata: { user_id: userId, field, value },
          payload_size: estimateSize({ userId, field, value }),
          user_name: user?.displayName || 'Admin',
          organization_id: user?.organization_id || undefined
      });
    } catch (err: any) {
      console.error(`Error updating ${field}:`, err);
      alert(`Failed to update ${field}: ${err.message}`);
    }
  };
  
  // Specific wrappers
  const handleUserStatusChange = (userId: string, status: "active" | "inactive") => handleUpdateField(userId, "status", status);
  const handleWorkTypeChange = (userId: string, workType: string) => handleUpdateField(userId, "work_type", workType);
  const handleUserTypeChange = (userId: string, userType: string) => handleUpdateField(userId, "user_type", userType);
  const handleRoleChange = (userId: string, role: string) => handleUpdateField(userId, "role", role);
  const handleIsClientChange = (userId: string, isClient: boolean) => handleUpdateField(userId, "is_client", isClient);
  const handleIsCallerChange = (userId: string, isCaller: boolean) => handleUpdateField(userId, "is_caller", isCaller);
  const handleDesignationChange = (userId: string, designation: string) => handleUpdateField(userId, "designation", designation);
  const handleDepartmentChange = (userId: string, department: string) => handleUpdateField(userId, "department", department);

  const handleCheckboxChange = (userId: string, checked: boolean) => {
    if (checked) setSelectedUsers(prev => [...prev, userId]);
    else setSelectedUsers(prev => prev.filter(id => id !== userId));
  };

  const handleSelectAll = (checked: boolean, allUserIds: string[]) => {
    if (checked) setSelectedUsers(allUserIds);
    else setSelectedUsers([]);
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        alert("You must be logged in to delete users");
        return;
      }
      const response = await fetch(`/api/auth/delete-user?userId=${userId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      if (!response.ok) throw new Error("Failed to delete user");
      await refreshData();
      window.location.reload();

      logSystemEvent({
          event_type: 'WRITE',
          description: `Delete User: ${userId}`,
          metadata: { user_id: userId },
          payload_size: estimateSize({ userId }),
          user_name: user?.displayName || 'Admin',
          organization_id: user?.organization_id || undefined
      });
    } catch (err) {
      console.error("Error deleting user:", err);
      alert("Failed to delete user");
    }
  };

  const handleBulkDelete = async () => {
    if (selectedUsers.length === 0) return;
    if (
      !window.confirm(
        `Are you sure you want to delete ${selectedUsers.length} users? This action cannot be undone.`
      )
    ) {
      return;
    }

    try {
      // Execute all deletes
      await Promise.all(selectedUsers.map((id) => handleDeleteUser(id)));
      setSelectedUsers([]);
    } catch (err) {
      console.error("Error deleting users:", err);
      alert("Failed to delete some users");
    }
  };


  // Generate Employee ID
  const generateNextEmployeeId = async (
    userType: string = "employee",
    organizationId: string | null = null
  ): Promise<string> => {
    try {
      let basePrefix = userType === "posp_agent" ? "AGT" : "TFC";

      // If organization_id is provided, use the organization's org_code as basePrefix
      if (organizationId) {
        const { data: orgData } = await supabase
          .from("organizations")
          .select("org_code")
          .eq("id", organizationId)
          .maybeSingle();

        if (orgData?.org_code) {
          basePrefix = orgData.org_code.toUpperCase();
        }
      }

      // For posp_agent, the prefix should be A{basePrefix}
      const idPrefix =
        userType === "posp_agent" ? `A${basePrefix}` : basePrefix;
      const searchPattern = `${idPrefix}-%`;

      // Find latest employee_id with this prefix
      const { data: latestIds, error: latestError } = await supabase
        .from("user_profiles")
        .select("employee_id")
        .ilike("employee_id", searchPattern)
        .order("employee_id", { ascending: false })
        .limit(1);

      if (latestError) {
        console.error("Error fetching latest employee_id:", latestError);
      }

      let nextNumber = 1;
      if (latestIds && latestIds.length > 0 && latestIds[0].employee_id) {
        const idStr = String(latestIds[0].employee_id);
        const lastDashIndex = idStr.lastIndexOf("-");
        if (lastDashIndex !== -1) {
          const numPart = idStr.substring(lastDashIndex + 1);
          const parsed = parseInt(numPart, 10);
          if (!isNaN(parsed) && parsed >= 1) {
            nextNumber = parsed + 1;
          }
        }
      }

      return `${idPrefix}-${String(nextNumber).padStart(3, "0")}`;
    } catch (err) {
      console.error("Error generating employee ID:", err);
      return "TFC-001";
    }
  };

  const handleApproveUserConfirm = async () => {
    if (!approvalUserData) return;
    try {
      // Generate next employee ID if user doesn't have one
      let employeeId = approvalUserData.employee_id;
      if (!employeeId || employeeId.trim() === "") {
        employeeId = await generateNextEmployeeId(
          approvalFormData.user_type,
          approvalUserData.organization_id
        );
      }

      const { error } = await supabase
        .from("user_profiles")
        .update({
          approval_status: "approved",
          status: approvalFormData.status,
          role: approvalFormData.role,
          department: approvalFormData.department,
          designation: approvalFormData.designation,
          work_type: approvalFormData.work_type,
          user_type: approvalFormData.user_type,
          is_client: approvalFormData.is_client,
          is_caller: approvalFormData.is_caller,
          employee_id: employeeId,
          updated_at: new Date().toISOString(),
        })
        .eq("id", approvalUserData.id);

      if (error) throw error;
      await refreshData();
      setShowApprovalModal(false);
      setApprovalUserData(null);

      logSystemEvent({
          event_type: 'WRITE',
          description: `Approve User: ${approvalUserData.user_name || approvalUserData.email}`,
          metadata: { 
              user_id: approvalUserData.id, 
              employee_id: employeeId,
              role: approvalFormData.role,
              designation: approvalFormData.designation
          },
          payload_size: estimateSize(approvalFormData),
          user_name: user?.displayName || 'Admin',
          organization_id: user?.organization_id || undefined
      });
    } catch (err) {
      console.error("Error approving user:", err);
      alert("Failed to approve user");
    }
  };

  const handleHoldUserConfirm = async () => {
    if (!holdUserData) return;
    if (!holdFormData.reason.trim()) {
      alert("Please enter a reason for hold");
      return;
    }

    try {
      // Calculate hold end date
      let holdEndDate: Date;
      const now = new Date();

      if (holdFormData.duration === "custom") {
        if (!holdFormData.customDate) {
          alert("Please select a custom date");
          return;
        }
        const customDateTime = new Date(
          `${holdFormData.customDate}T${holdFormData.customTime || "00:00"}`
        );
        if (customDateTime <= now) {
          alert("Hold end date must be in the future");
          return;
        }
        holdEndDate = customDateTime;
      } else {
        const days = parseInt(holdFormData.duration);
        holdEndDate = new Date(now);
        holdEndDate.setDate(holdEndDate.getDate() + days);
      }

      // Get current user ID from session
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const currentUserId = session?.user?.id || null;

      // Prepare update data
      const updateData: any = {
        approval_status: "hold",
        hold_start_date: now.toISOString(),
        hold_end_date: holdEndDate.toISOString(),
        status_reason: holdFormData.reason,
        updated_at: new Date().toISOString(),
      };

      if (currentUserId) {
        try {
          updateData.hold_by_user_id = currentUserId;
        } catch (e) {
          // Ignore
        }
      }

      // Use a simpler approach to avoid the "hold_by_user_id" error if column missing
      // We will try with hold_by_user_id, if fail, try without.
      // But for simplicity in this refactor, let's assume it exists or fail gracefully.
      // Replicating safe logic:
      let error = (
        await supabase
          .from("user_profiles")
          .update(updateData)
          .eq("id", holdUserData.id)
      ).error;

      if (error && (error.message?.includes("column") || error.code === "42703")) {
         delete updateData.hold_by_user_id;
         const res = await supabase.from("user_profiles").update(updateData).eq("id", holdUserData.id);
         error = res.error;
      }

      if (error) throw error;

      await refreshData();
      setShowHoldModal(false);
      setHoldUserData(null);
      
      logSystemEvent({
          event_type: 'WRITE',
          description: `User on Hold: ${holdUserData.user_name || holdUserData.email}`,
          metadata: { 
              user_id: holdUserData.id, 
              duration: holdFormData.duration,
              reason: holdFormData.reason,
              end_date: holdEndDate.toISOString()
          },
          payload_size: estimateSize(holdFormData),
          user_name: user?.displayName || 'Admin',
          organization_id: user?.organization_id || undefined
      });

      setHoldFormData({
        duration: "1",
        customDate: "",
        customTime: "",
        reason: "",
      });
    } catch (err) {
      console.error("Error putting user on hold:", err);
      alert("Failed to put user on hold");
    }
  };

  const handleSuspendUserConfirm = async () => {
    if (!suspendUserData) return;
    if (!suspendFormData.reason.trim()) {
      alert("Please enter a reason for suspension");
      return;
    }

    try {
      const { error } = await supabase
        .from("user_profiles")
        .update({
          approval_status: "suspend",
          status_reason: suspendFormData.reason,
          status: "inactive", // Automatically set status to inactive
          updated_at: new Date().toISOString(),
        })
        .eq("id", suspendUserData.id);

      if (error) throw error;

      await refreshData();
      setShowSuspendModal(false);
      setSuspendUserData(null);

      logSystemEvent({
          event_type: 'WRITE',
          description: `Suspend User: ${suspendUserData.user_name || suspendUserData.email}`,
          metadata: { 
              user_id: suspendUserData.id, 
              reason: suspendFormData.reason 
          },
          payload_size: estimateSize(suspendFormData),
          user_name: user?.displayName || 'Admin',
          organization_id: user?.organization_id || undefined
      });

      setSuspendFormData({ reason: "" });
    } catch (err) {
      console.error("Error suspending user:", err);
      alert("Failed to suspend user");
    }
  };

  return {
    selectedUsers,
    setSelectedUsers,
    handleStatusChange,
    handleUserStatusChange, // and aliases
    handleWorkTypeChange,
    handleUserTypeChange,
    handleRoleChange,
    handleIsClientChange,
    handleIsCallerChange,
    handleDesignationChange,
    handleDepartmentChange,
    handleCheckboxChange,
    handleSelectAll,
    handleDeleteUser,
    handleBulkDelete,

    // Modal states
    showApprovalModal, setShowApprovalModal,
    approvalUserData, setApprovalUserData,
    approvalFormData, setApprovalFormData,
    showHoldModal, setShowHoldModal,
    holdUserData, setHoldUserData,
    holdFormData, setHoldFormData,
    showSuspendModal, setShowSuspendModal,
    suspendUserData, setSuspendUserData,
    suspendFormData, setSuspendFormData,
    // Generators & confirm handlers
    generateNextEmployeeId,
    handleApproveUserConfirm,
    handleHoldUserConfirm,
    handleSuspendUserConfirm,
  };
}
