export const formatTimeLeft = (endDate: string | null): string => {
  if (!endDate) return "N/A";
  // Format time left for hold countdown
  try {
    const now = new Date().getTime();
    const end = new Date(endDate).getTime();
    const difference = end - now;

    if (difference <= 0) {
      return "Expired";
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    if (days > 0) {
      return `${days}d ${hours}h ${minutes}m`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m ${seconds}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    } else {
      return `< 1m`;
    }
  } catch (e) {
    return "Invalid Date";
  }
};

// Get current date for display
export const getCurrentDate = (mounted: boolean = true): string => {
  if (!mounted) return ""; // Return empty string during SSR
  const date = new Date();
  const day = date.getDate().toString().padStart(2, "0");
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const month = monthNames[date.getMonth()];
  return `${day} ${month}`;
};

// Format date safely for SSR (only format on client)
export const formatDate = (
  dateString: string | null,
  mounted: boolean = true
): string => {
  if (!mounted || !dateString) return "N/A";
  try {
    const date = new Date(dateString);
    const day = date.getDate();
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  } catch (e) {
    return "N/A";
  }
};

// Format date with year first (for pending users)
export const formatDateWithYear = (
  dateString: string | null,
  mounted: boolean = true
): string => {
  if (!mounted || !dateString) return "N/A";
  try {
    const date = new Date(dateString);
    const day = date.getDate();
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    return `${year} ${month} ${day}`;
  } catch (e) {
    return "N/A";
  }
};

export const getWorkTypeLabel = (type: string | null) => {
  switch (type) {
    case "on_site":
      return "On Site";
    case "remote":
      return "Remote";
    default:
      return "N/A";
  }
};

interface UserCSVData {
  [key: string]: any;
}

// Helper for exporting CSV
export const exportToCSV = (selectedUsers: string[], allUsers: any[]) => {
  if (selectedUsers.length === 0) {
    alert("Please select at least one user to export");
    return;
  }

  const selectedUsersData = allUsers.filter((user) =>
    selectedUsers.includes(user.id)
  );

  const columns = [
    "id",
    "user_id",
    "email",
    "user_name",
    "contact_no",
    "employee_id",
    "role",
    "status",
    "approval_status",
    "super_admin",
    "father_name",
    "gender",
    "pan_number",
    "aadhar_card_no",
    "date_of_birth",
    "date_of_joining",
    "in_hand_salary",
    "alternate_contact",
    "primary_address",
    "area_pincode",
    "bank_name",
    "account_holder_name",
    "account_number",
    "ifsc_code",
    "branch_pincode",
    "branch_state",
    "branch_city",
    "blood_group",
    "emergency_contact_no",
    "profile_pic_url",
    "pancard_url",
    "aadhar_front_url",
    "aadhar_back_url",
    "qualification_marksheet_url",
    "bank_passbook_url",
    "profile_complete",
    "created_at",
    "updated_at",
    "hold_start_date",
    "hold_end_date",
    "status_reason",
    "hold_by_user_id",
    "user_type",
    "work_type",
    "department",
    "designation",
  ];

  const csvHeader = columns.join(",");
  const csvRows = selectedUsersData.map((user) => {
    return columns
      .map((column) => {
        const value = (user as UserCSVData)[column];
        if (value === null || value === undefined) return "";
        if (
          typeof value === "string" &&
          (value.includes(",") || value.includes('"') || value.includes("\n"))
        ) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      })
      .join(",");
  });

  const csvContent = [csvHeader, ...csvRows].join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute(
    "download",
    `users_export_${new Date().toISOString().split("T")[0]}.csv`
  );
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};



