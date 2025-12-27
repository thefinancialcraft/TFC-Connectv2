import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import BottomNav from "../components/BottomNav";
import {
  checkAuthAndFetchProfile,
  handleLogout,
  UserProfile,
} from "../lib/authService";
import { getStoredUserData, storeUserData } from "../lib/localStorageUtils";
import { supabase } from "../lib/supabase";

interface Customer {
  id: string;
  lead_id: string | null;
  customer_name: string | null;
  phone_no: string | null;
  expiry_date: string | null;
  customer_details: string | null;
  utilities: string | null;
  campaign_id: string | null;
  assigned_to: string | null;
  status: string | null;
  created_at: string | null;
  updated_at: string | null;
  assigned_user_name?: string | null;
  assigned_employee_id?: string | null;
  campaign_name?: string | null;
  managed_by?: string | null;
  managed_by_name?: string | null;
  managed_by_id?: string | null;
}

export default function Customer() {
  const router = useRouter();
  // Initialize with cached data from localStorage to show previous data immediately (ghost update)
  const [user, setUser] = useState<UserProfile | null>(() => {
    const cachedData = getStoredUserData();
    if (cachedData) {
      return {
        uid: cachedData.user_id || "",
        displayName: cachedData.user_name || cachedData.displayName || null,
        email: cachedData.email || "",
        phone: null, // Will be updated from API
        providers: [],
        providerType: null,
        createdAt: "",
        lastSignInAt: null,
        employeeId: cachedData.employee_id || null,
        role: cachedData.role || null,
        approvalStatus: null, // Will be updated from API
        accountStatus: null, // Will be updated from API
        updatedAt: null, // Will be updated from API
        profilePicUrl: cachedData.profile_pic_url || null,
      };
    }
    return null;
  });
  const [loading, setLoading] = useState(false); // Start with false to avoid spinner on page change
  const [error, setError] = useState("");
  const [activeNav, setActiveNav] = useState("customer");
  const [allCustomers, setAllCustomers] = useState<Customer[]>([]);
  const [loadingCustomers, setLoadingCustomers] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [freshCustomersCount, setFreshCustomersCount] = useState(0);
  const [pageSize, setPageSize] = useState<number | "all">(100);
  const [viewType, setViewType] = useState<"grid" | "list">("list");
  const [showImportModal, setShowImportModal] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [importError, setImportError] = useState("");
  const [importSuccess, setImportSuccess] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showMappingModal, setShowMappingModal] = useState(false);
  const [csvColumns, setCsvColumns] = useState<string[]>([]);
  const [fieldMapping, setFieldMapping] = useState<Record<string, string>>({});
  const [mergedFields, setMergedFields] = useState<Record<string, string[]>>(
    {}
  );
  const [customFields, setCustomFields] = useState<
    Array<{ id: string; name: string; mappedTo: string }>
  >([]);
  const [selectedFields, setSelectedFields] = useState<Record<string, boolean>>(
    {
      name: true,
      phone: true,
      sum_insured: false,
      premium: false,
      company: false,
      expiry_date: true,
    }
  );
  const [showCustomerDetailsModal, setShowCustomerDetailsModal] =
    useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const [selectedCustomers, setSelectedCustomers] = useState<Set<string>>(
    new Set()
  );
  const [isDeleting, setIsDeleting] = useState(false);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [selectedCampaignId, setSelectedCampaignId] = useState<string>("");

  const fetchAuth = async () => {
    const result = await checkAuthAndFetchProfile();

    if (result.shouldRedirect) {
      router.push("/login");
      return;
    }

    if (result.error) {
      setError(result.error);
      setTimeout(() => {
        router.push("/login");
      }, 2000);
      return;
    }

    if (result.user) {
      // Fetch latest profile data from API to ensure we have the most up-to-date information
      const {
        data: { session },
      } = await supabase.auth.getSession();
      let latestUserData = result.user;

      if (session) {
        try {
          const profileResponse = await fetch("/api/auth/user-profile", {
            headers: {
              Authorization: `Bearer ${session.access_token}`,
            },
          });
          const profileData = await profileResponse.json();

          if (profileData.success && profileData.user) {
            // Use the latest data from API
            latestUserData = {
              ...profileData.user,
              profilePicUrl: profileData.user.profile_pic_url || null,
            };
          }
        } catch (err) {
          console.error("Error fetching latest profile:", err);
          // Continue with result.user if API call fails
        }
      }

      // Ghost update: Compare existing data with fetched data - only update if there's a change
      setUser((prevUser) => {
        // If no previous user, set the new user
        if (!prevUser) {
          // Update localStorage with the new user data (including profile_pic_url)
          if (latestUserData.uid) {
            const cachedData = getStoredUserData();
            const userDataToStore = {
              user_id: latestUserData.uid,
              email: latestUserData.email || "",
              user_name:
                latestUserData.displayName || cachedData?.user_name || "",
              employee_id:
                latestUserData.employeeId || cachedData?.employee_id || "",
              role: latestUserData.role || cachedData?.role || "user",
              profile_pic_url: latestUserData.profilePicUrl || null,
              displayName: latestUserData.displayName || undefined,
              session_token: cachedData?.session_token,
              refresh_token: cachedData?.refresh_token,
            };
            storeUserData(userDataToStore);
          }
          return latestUserData;
        }

        // Check if user data has actually changed (compare critical fields for UI update)
        const hasChanged =
          prevUser.displayName !== latestUserData.displayName ||
          prevUser.employeeId !== latestUserData.employeeId ||
          prevUser.email !== latestUserData.email ||
          prevUser.approvalStatus !== latestUserData.approvalStatus ||
          prevUser.accountStatus !== latestUserData.accountStatus ||
          prevUser.role !== latestUserData.role ||
          prevUser.phone !== latestUserData.phone ||
          prevUser.profilePicUrl !== latestUserData.profilePicUrl;

        // Only update if data has actually changed (prevents unnecessary re-renders and UI flickering)
        // This ensures smooth ghost update - UI stays stable if data is same, updates only when changed
        if (hasChanged) {
          // Update localStorage with the new user data (including profile_pic_url)
          if (latestUserData.uid) {
            const cachedData = getStoredUserData();
            const userDataToStore = {
              user_id: latestUserData.uid,
              email: latestUserData.email || "",
              user_name:
                latestUserData.displayName || cachedData?.user_name || "",
              employee_id:
                latestUserData.employeeId || cachedData?.employee_id || "",
              role: latestUserData.role || cachedData?.role || "user",
              profile_pic_url: latestUserData.profilePicUrl || null,
              displayName: latestUserData.displayName || undefined,
              session_token: cachedData?.session_token,
              refresh_token: cachedData?.refresh_token,
            };
            storeUserData(userDataToStore);
          }
          return latestUserData;
        }

        // Return previous user object to prevent unnecessary re-render and UI update
        // This keeps showing cached/existing data if fetched data is same (ghost update)
        return prevUser;
      });
    }
  };

  // Format date safely for SSR (only format on client)
  const formatDate = (dateString: string | null) => {
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
    } catch (error) {
      return "N/A";
    }
  };

  const fetchCustomers = async (page: number = currentPage) => {
    try {
      setLoadingCustomers(true);

      // Get total count
      const { count, error: countError } = await supabase
        .from("customers")
        .select("*", { count: "exact", head: true });

      if (countError) {
        console.error("Error fetching customer count:", countError);
      } else {
        setTotalCustomers(count || 0);
      }

      // Get fresh customers count (unassigned leads)
      const { count: freshCount, error: freshCountError } = await supabase
        .from("customers")
        .select("*", { count: "exact", head: true })
        .is("assigned_to", null);

      if (freshCountError) {
        console.error("Error fetching fresh customers count:", freshCountError);
      } else {
        setFreshCustomersCount(freshCount || 0);
      }

      // Fetch data based on page size
      let query = supabase
        .from("customers")
        .select("*")
        .order("created_at", { ascending: false });

      if (searchQuery) {
        query = query.or(`customer_name.ilike.%${searchQuery}%,phone_no.ilike.%${searchQuery}%,lead_id.ilike.%${searchQuery}%,campaign_id.ilike.%${searchQuery}%`);
      }

      let data: any[] | null = null;
      let error: any = null;

      if (pageSize === "all") {
        // Fetch all data in batches of 1000 to bypass API limits
        let allData: any[] = [];
        let hasMore = true;
        let pageIndex = 0;
        const batchSize = 1000;

        while (hasMore) {
            let batchQuery = supabase
                .from("customers")
                .select("*")
                .order("created_at", { ascending: false });

            if (searchQuery) {
                batchQuery = batchQuery.or(`customer_name.ilike.%${searchQuery}%,phone_no.ilike.%${searchQuery}%,lead_id.ilike.%${searchQuery}%,campaign_id.ilike.%${searchQuery}%`);
            }

            const { data: batch, error: batchError } = await batchQuery
                .range(pageIndex * batchSize, (pageIndex + 1) * batchSize - 1);

            if (batchError) {
                error = batchError;
                break;
            }

            if (batch && batch.length > 0) {
                allData = [...allData, ...batch];
                if (batch.length < batchSize) {
                    hasMore = false;
                }
                pageIndex++;
            } else {
                hasMore = false;
            }
        }
        data = allData;
      } else {
        // Calculate offset for pagination
        const offset = (page - 1) * pageSize;
        const { data: pagedData, error: pagedError } = await query.range(offset, offset + pageSize - 1);
        data = pagedData;
        error = pagedError;
      }

      if (error) {
        console.error("Error fetching customers:", error);
        setAllCustomers([]);
      } else {
        // Fetch assigned user names separately
        const allUserIds = [
          ...new Set(
            (data || [])
              .flatMap((c: any) => [c.assigned_to, c.managed_by])
              .filter((id: string | null) => id)
          ),
        ];

        let userMap: Record<
          string,
          { user_name: string | null; employee_id: string | null }
        > = {};

        if (allUserIds.length > 0) {
          const { data: userData } = await supabase
            .from("user_profiles")
            .select("user_id, id, user_name, employee_id")
            .or(`user_id.in.("${allUserIds.join('","')}"),id.in.("${allUserIds.join('","')}")`);

          if (userData) {
            userData.forEach((user) => {
                const info = {
                    user_name: user.user_name,
                    employee_id: user.employee_id,
                };
                userMap[user.user_id] = info;
                userMap[user.id] = info;
            });
          }
        }

        // Fetch campaign names separately (manual join)
        const campaignIds = [
          ...new Set(
            (data || [])
              .map((c: any) => c.campaign_id)
              .filter((id: string | null) => id)
          ),
        ];

        let campaignMap: Record<string, string> = {};

        if (campaignIds.length > 0) {
          const { data: campaignData } = await supabase
            .from("campaigns")
            .select("id, name")
            .in("id", campaignIds);

          if (campaignData) {
            campaignData.forEach((camp) => {
              campaignMap[camp.id] = camp.name;
            });
          }
        }

        // Map the data to include assigned user name and campaign name
        const mappedData = (data || []).map((customer: any) => ({
          ...customer,
          assigned_user_name: customer.assigned_to
            ? userMap[customer.assigned_to]?.user_name || null
            : null,
          assigned_employee_id: customer.assigned_to
            ? userMap[customer.assigned_to]?.employee_id || null
            : null,
          managed_by_name: customer.managed_by
            ? userMap[customer.managed_by]?.user_name || "Unknown"
            : "Self",
          managed_by_id: customer.managed_by
            ? userMap[customer.managed_by]?.employee_id || customer.managed_by.slice(0, 8).toUpperCase()
            : null,
          campaign_name: customer.campaign_id
            ? campaignMap[customer.campaign_id] || null
            : null,
        }));
        setAllCustomers(mappedData);
      }
    } catch (err) {
      console.error("Error fetching customers:", err);
      setAllCustomers([]);
    } finally {
      setLoadingCustomers(false);
    }
  };

  const fetchCampaigns = async () => {
    try {
      const { data, error } = await supabase
        .from("campaigns")
        .select("id, name")
        .eq("status", "active")
        .order("name");

      if (error) throw error;
      setCampaigns(data || []);
    } catch (err) {
      console.error("Error fetching campaigns:", err);
    }
  };

  useEffect(() => {
    setMounted(true);
    fetchAuth();
    fetchCustomers(1);
    fetchCampaigns();

    // Refresh user data when page comes into focus (in case it was updated)
    const handleFocus = () => {
      fetchAuth();
      fetchCustomers(currentPage);
    };

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [router]);

  // Fetch customers when page size changes
  useEffect(() => {
    if (mounted) {
      setCurrentPage(1); // Reset to page 1 when page size changes
      fetchCustomers(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageSize]);

  // Fetch customers when search query changes
  useEffect(() => {
    if (mounted) {
      setCurrentPage(1);
      fetchCustomers(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  // Fetch customers when page changes (only if not showing all)
  useEffect(() => {
    if (mounted && pageSize !== "all") {
      fetchCustomers(currentPage);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  // Use allCustomers directly since it is now filtered by the API
  const filteredCustomers = allCustomers;

  // Calculate pagination
  const effectivePageSize = pageSize === "all" ? totalCustomers : pageSize;
  const totalPages =
    pageSize === "all" ? 1 : Math.ceil(totalCustomers / pageSize);
  const startIndex = pageSize === "all" ? 1 : (currentPage - 1) * pageSize + 1;
  const endIndex =
    pageSize === "all"
      ? totalCustomers
      : Math.min(currentPage * pageSize, totalCustomers);

  const handleLogoutClick = async () => {
    await handleLogout(router);
  };

  // Generate lead_id automatically
  const generateLeadId = () => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `LEAD-${timestamp}-${random}`;
  };

  // Parse CSV line handling quoted values
  const parseCSVLine = (line: string): string[] => {
    const result: string[] = [];
    let current = "";
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === "," && !inQuotes) {
        result.push(current.trim());
        current = "";
      } else {
        current += char;
      }
    }
    result.push(current.trim());
    return result;
  };

  // Get field value from CSV row, handling merged fields
  const getFieldValue = (
    row: Record<string, string>,
    fieldKey: string,
    fieldMapping: Record<string, string>,
    mergedFields: Record<string, string[]>
  ): string => {
    const mainColumn = fieldMapping[fieldKey];
    if (!mainColumn) return "";

    let value = row[mainColumn] || "";

    // Merge with additional columns if any
    const merged = mergedFields[fieldKey] || [];
    if (merged.length > 0) {
      const mergedValues = merged
        .filter((col) => col && row[col])
        .map((col) => row[col])
        .join(" ");
      if (mergedValues) {
        value = value ? `${value} ${mergedValues}` : mergedValues;
      }
    }

    return value.trim();
  };

  // Upload customers to Supabase
  const uploadCustomersToSupabase = async () => {
    if (!importFile) {
      setImportError("Please select a file to upload");
      return;
    }

    setImporting(true);
    setImportError("");
    setImportSuccess("");

    try {
      // Parse CSV file
      const text = await importFile.text();
      const lines = text.split("\n").filter((line) => line.trim());

      if (lines.length < 2) {
        setImportError(
          "CSV file must contain at least a header row and one data row"
        );
        setImporting(false);
        return;
      }

      // Parse headers
      const headers = parseCSVLine(lines[0]);
      const headerMap: Record<string, number> = {};
      headers.forEach((header, index) => {
        headerMap[header.trim()] = index;
      });

      // Parse data rows
      const customers = [];
      const errors: string[] = [];

      for (let i = 1; i < lines.length; i++) {
        try {
          const values = parseCSVLine(lines[i]);
          if (values.length === 0 || values.every((v) => !v.trim())) continue;

          // Create row object
          const row: Record<string, string> = {};
          headers.forEach((header, index) => {
            row[header.trim()] = values[index]?.trim() || "";
          });

          // Get mapped values
          const customerName = getFieldValue(
            row,
            "name",
            fieldMapping,
            mergedFields
          );
          const phoneNo = getFieldValue(
            row,
            "phone",
            fieldMapping,
            mergedFields
          );
          const expiryDate = getFieldValue(
            row,
            "expiry_date",
            fieldMapping,
            mergedFields
          );

          // Validate required fields
          if (!customerName) {
            errors.push(`Row ${i + 1}: Customer name is required`);
            continue;
          }

          // Build customer_details JSON object with all other fields
          const customerDetails: Record<string, string> = {};

          // Add predefined fields (except name, phone, expiry_date) with _checked/_unchecked suffix
          const predefinedFields = [
            { key: "sum_insured", label: "Sum Insured" },
            { key: "premium", label: "Premium" },
            { key: "company", label: "Company" },
          ];

          predefinedFields.forEach((field) => {
            const value = getFieldValue(
              row,
              field.key,
              fieldMapping,
              mergedFields
            );
            if (value) {
              const isChecked = selectedFields[field.key] || false;
              const suffix = isChecked ? "_checked" : "_unchecked";
              customerDetails[`${field.label}${suffix}`] = value;
            }
          });

          // Add custom fields with _checked/_unchecked suffix
          customFields.forEach((customField) => {
            if (customField.mappedTo) {
              const value = row[customField.mappedTo] || "";
              if (value) {
                const isChecked =
                  selectedFields[`custom_${customField.id}`] || false;
                const suffix = isChecked ? "_checked" : "_unchecked";
                const fieldName = customField.name || customField.mappedTo;
                customerDetails[`${fieldName}${suffix}`] = value;
              }
            }
          });

          // Generate lead_id
          const leadId = generateLeadId();

          // Parse expiry date (handle different formats)
          let parsedExpiryDate: string | null = null;
          if (expiryDate) {
            try {
              // Clean the date string
              let dateStr = expiryDate.replace(/₹/g, "").trim();

              // Check if year is present (4 digits at the end or in YYYY format)
              const yearRegex = /\b(19|20)\d{2}\b/;
              const hasYear = yearRegex.test(dateStr);

              // If no year found, add -1 year from current (2024)
              if (!hasYear) {
                const currentYear = 2025;
                const defaultYear = currentYear - 1; // 2024

                // Try to parse common date formats and add year
                // Handle formats like: "11-Oct", "11 Oct", "11/10", "Oct-11", etc.
                const dateParts = dateStr.split(/[\s\-/]+/);

                // Try to identify month and day
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

                let day = "";
                let month = "";

                // Find month name
                for (const part of dateParts) {
                  const monthIndex = monthNames.findIndex(
                    (m) =>
                      m.toLowerCase() === part.toLowerCase().substring(0, 3)
                  );
                  if (monthIndex !== -1) {
                    month = String(monthIndex + 1).padStart(2, "0");
                    break;
                  }
                }

                // Find day (numeric)
                for (const part of dateParts) {
                  if (/^\d{1,2}$/.test(part) && part !== month) {
                    day = part.padStart(2, "0");
                    break;
                  }
                }

                // If we found day and month, construct date with default year
                if (day && month) {
                  dateStr = `${defaultYear}-${month}-${day}`;
                } else {
                  // Try to parse as-is and add year
                  const testDate = new Date(dateStr);
                  if (!isNaN(testDate.getTime())) {
                    // Date parsed but might have wrong year, reconstruct with default year
                    const monthNum = testDate.getMonth() + 1;
                    const dayNum = testDate.getDate();
                    dateStr = `${defaultYear}-${String(monthNum).padStart(
                      2,
                      "0"
                    )}-${String(dayNum).padStart(2, "0")}`;
                  }
                }
              }

              // Parse the final date string
              const date = new Date(dateStr);
              if (!isNaN(date.getTime())) {
                parsedExpiryDate = date.toISOString().split("T")[0];
              }
            } catch (e) {
              console.warn(`Could not parse expiry date: ${expiryDate}`, e);
            }
          }

          customers.push({
            lead_id: leadId,
            customer_name: customerName,
            phone_no: phoneNo || null,
            expiry_date: parsedExpiryDate,
            campaign_id: selectedCampaignId || null,
            customer_details:
              Object.keys(customerDetails).length > 0
                ? JSON.stringify(customerDetails)
                : null,
            status: "active",
          });
        } catch (err) {
          errors.push(`Row ${i + 1}: Error processing row - ${err}`);
        }
      }

      if (errors.length > 0 && customers.length === 0) {
        setImportError(`Failed to process file: ${errors.join("; ")}`);
        setImporting(false);
        return;
      }

      if (customers.length === 0) {
        setImportError("No valid customer data found in the file");
        setImporting(false);
        return;
      }

      // Upload to Supabase in batches
      const batchSize = 100;
      let successCount = 0;
      let failCount = 0;

      for (let i = 0; i < customers.length; i += batchSize) {
        const batch = customers.slice(i, i + batchSize);
        const { error: insertError } = await supabase
          .from("customers")
          .insert(batch);

        if (insertError) {
          console.error("Error inserting batch:", insertError);
          failCount += batch.length;
        } else {
          successCount += batch.length;
        }
      }

      if (failCount > 0) {
        setImportError(
          `Imported ${successCount} customers. ${failCount} failed. ${errors.length > 0 ? "Errors: " + errors.slice(0, 3).join("; ") : ""
          }`
        );
      } else {
        setImportSuccess(
          `Successfully imported ${successCount} customer${successCount !== 1 ? "s" : ""
          }!`
        );
      }

      // Refresh customer list
      await fetchCustomers(1);
      setCurrentPage(1);

      // Close modals after delay
      setTimeout(() => {
        setShowMappingModal(false);
        setShowImportModal(false);
        setImportFile(null);
        setFieldMapping({});
        setCustomFields([]);
        setMergedFields({});
        setSelectedFields({
          name: true,
          phone: true,
          sum_insured: false,
          premium: false,
          company: false,
          expiry_date: true,
        });
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }, 2000);
    } catch (err) {
      console.error("Import error:", err);
      setImportError(`Failed to import customers: ${err}`);
    } finally {
      setImporting(false);
    }
  };

  if (loading) {
    return (
      <div
        className="flex min-h-screen items-center justify-center"
        style={{ backgroundColor: "#f6f5f7" }}
      >
        <div className="text-center">
          <div
            className="animate-spin rounded-full h-12 w-12 border-4 border-t-transparent mx-auto mb-4"
            style={{ borderColor: "#4b33e8" }}
          ></div>
          <div className="text-lg" style={{ color: "#4b33e8" }}>
            Loading...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="flex min-h-screen items-center justify-center"
        style={{ backgroundColor: "#f6f5f7" }}
      >
        <div className="text-center">
          <div className="text-lg mb-4 text-red-500">{error}</div>
          <div className="text-sm" style={{ color: "#4b33e8" }}>
            Redirecting to login...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex min-h-screen w-full overflow-x-hidden"
      style={{ backgroundColor: "#f6f5f7", maxWidth: "100vw" }}
    >
      {/* Left Sidebar */}
      <Sidebar
        user={{
          displayName: user?.displayName || null,
          email: user?.email || "",
          employeeId: user?.employeeId || null,
          lastSignInAt: user?.lastSignInAt || null,
          profilePicUrl: user?.profilePicUrl || null,
        }}
        activeNav={activeNav}
        onNavChange={setActiveNav}
        userRole={user?.role || null}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:ml-56 w-full min-w-0 overflow-x-hidden">
        {/* Top Header */}
        <Header
          user={{
            displayName: user?.displayName || null,
            email: user?.email || "",
            employeeId: user?.employeeId || null,
            profilePicUrl: user?.profilePicUrl || null,
          }}
          onLogout={handleLogoutClick}
        />

        {/* Main Content */}
        <main
          className="flex-1 overflow-y-auto overflow-x-hidden min-w-0 max-w-full pt-[60px] lg:pt-[60px]"
          style={{ backgroundColor: "#f6f5f7" }}
        >
          <div className="container mx-auto px-3 sm:px-4 md:px-6 py-6 sm:py-8 pb-20 sm:pb-24 lg:pb-8 max-w-7xl">
            <div className="space-y-6 sm:space-y-8">
              {/* Page Header */}
              <div className="mb-6 flex items-start justify-between">
                <div>
                  <h1
                    className="text-xl sm:text-2xl md:text-3xl font-bold mb-2"
                    style={{
                      color: "#263238",
                      fontFamily: "'Poppins', sans-serif",
                    }}
                  >
                    Customers
                  </h1>
                  <p
                    className="text-sm sm:text-base"
                    style={{
                      color: "#787E9D",
                      fontFamily: "'Roboto', sans-serif",
                    }}
                  >
                    View and manage all customers in the system
                  </p>
                </div>
              </div>

              {/* 4 Tiles Grid - 3 Main Tiles + 1 Container with 2 Sub-tiles (hidden border) */}
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
                {/* Tile 1: Total Customer */}
                <div
                  className="relative overflow-hidden rounded-2xl p-4 sm:p-5 transition-shadow duration-200 flex flex-col hover:shadow-md"
                  style={{ backgroundColor: "white" }}
                >
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "radial-gradient(circle at top right, rgba(75, 51, 232, 0.08), transparent 60%)",
                    }}
                  />
                  <div className="absolute -bottom-16 -right-16 h-48 w-48 rounded-full bg-purple-100/30 blur-2xl" />
                  {/* Decorative Graphics */}
                  <div className="absolute top-0 left-0 w-32 h-32 rounded-full bg-purple-200/20 blur-xl" />
                  <div className="absolute top-8 right-8 w-16 h-16 rounded-full bg-purple-300/15 blur-lg" />
                  {/* Background Icon */}
                  <div className="absolute -right-2 -bottom-2 opacity-5">
                    <i
                      className="fi flex fi-rr-users text-5xl sm:text-6xl"
                      style={{ color: "#4b33e8" }}
                    ></i>
                  </div>
                  {/* Pattern Overlay */}
                  <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                      backgroundImage:
                        "radial-gradient(circle, #4b33e8 1px, transparent 1px)",
                      backgroundSize: "20px 20px",
                    }}
                  />
                  <div className="relative flex flex-col h-full z-10">
                    <div className="flex items-start justify-between mb-auto">
                      <p
                        className="text-xs sm:text-sm font-medium"
                        style={{
                          color: "#787E9D",
                          fontFamily: "'Roboto', sans-serif",
                        }}
                      >
                        Total Customer
                      </p>
                      <div
                        className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl"
                        style={{
                          backgroundColor: "transparent",
                        }}
                      >
                        <i
                          className="fi flex fi-rr-users text-lg sm:text-xl"
                          style={{ color: "#4b33e8" }}
                        ></i>
                      </div>
                    </div>
                    <div className="mt-auto">
                      <p
                        className="text-3xl sm:text-4xl font-semibold"
                        style={{
                          color: "#263238",
                          fontFamily: "'Poppins', sans-serif",
                        }}
                      >
                        {totalCustomers}
                      </p>
                      <p
                        className="text-xs sm:text-sm mt-1"
                        style={{
                          color: "#787E9D",
                          fontFamily: "'Roboto', sans-serif",
                        }}
                      >
                        Total customers
                      </p>
                    </div>
                  </div>
                </div>

                {/* Tile 2: Fresh Customers */}
                <div
                  className="relative overflow-hidden rounded-2xl p-4 sm:p-5 transition-shadow duration-200 flex flex-col hover:shadow-md"
                  style={{ backgroundColor: "white" }}
                >
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "radial-gradient(circle at top right, rgba(16, 185, 129, 0.08), transparent 60%)",
                    }}
                  />
                  <div className="absolute -bottom-16 -right-16 h-48 w-48 rounded-full bg-green-100/30 blur-2xl" />
                  {/* Decorative Graphics */}
                  <div className="absolute top-0 left-0 w-32 h-32 rounded-full bg-green-200/20 blur-xl" />
                  <div className="absolute top-8 right-8 w-16 h-16 rounded-full bg-green-300/15 blur-lg" />
                  {/* Background Icon */}
                  <div className="absolute -right-2 -bottom-2 opacity-5">
                    <i
                      className="fi flex fi-rr-user-add text-5xl sm:text-6xl"
                      style={{ color: "#10b981" }}
                    ></i>
                  </div>
                  {/* Pattern Overlay */}
                  <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                      backgroundImage:
                        "radial-gradient(circle, #10b981 1px, transparent 1px)",
                      backgroundSize: "20px 20px",
                    }}
                  />
                  <div className="relative flex flex-col h-full z-10">
                    <div className="flex items-start justify-between mb-auto">
                      <p
                        className="text-xs sm:text-sm font-medium"
                        style={{
                          color: "#787E9D",
                          fontFamily: "'Roboto', sans-serif",
                        }}
                      >
                        Fresh Customers
                      </p>
                      <div
                        className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl"
                        style={{
                          backgroundColor: "transparent",
                        }}
                      >
                        <i
                          className="fi flex fi-rr-user-add text-lg sm:text-xl"
                          style={{ color: "#10b981" }}
                        ></i>
                      </div>
                    </div>
                    <div className="mt-auto">
                      <p
                        className="text-3xl sm:text-4xl font-semibold"
                        style={{
                          color: "#263238",
                          fontFamily: "'Poppins', sans-serif",
                        }}
                      >
                        {freshCustomersCount}
                      </p>
                      <p
                        className="text-xs sm:text-sm mt-1"
                        style={{
                          color: "#787E9D",
                          fontFamily: "'Roboto', sans-serif",
                        }}
                      >
                        Unassigned leads
                      </p>
                    </div>
                  </div>
                </div>

                {/* Tile 3: Follow ups */}
                <div
                  className="relative overflow-hidden rounded-2xl p-4 sm:p-5 transition-all duration-200 backdrop-blur flex flex-col text-white hover:shadow-md"
                  style={{ backgroundColor: "#4b33e8" }}
                >
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "radial-gradient(circle at top left, rgba(255,255,255,0.28), transparent 55%)",
                    }}
                  />
                  <div className="absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
                  {/* Decorative Graphics */}
                  <div className="absolute top-4 left-4 w-24 h-24 rounded-full bg-white/5 blur-xl" />
                  <div className="absolute top-12 right-12 w-20 h-20 rounded-full bg-white/8 blur-lg" />
                  {/* Background Icon */}
                  <div className="absolute -right-2 -bottom-2 opacity-10">
                    <i className="fi flex fi-rr-calendar-check text-5xl sm:text-6xl text-white"></i>
                  </div>
                  {/* Pattern Overlay */}
                  <div
                    className="absolute inset-0 opacity-[0.05]"
                    style={{
                      backgroundImage:
                        "radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)",
                      backgroundSize: "25px 25px",
                    }}
                  />
                  <div className="relative flex flex-col h-full z-10">
                    <div className="flex items-start justify-between mb-auto">
                      <p
                        className="text-xs sm:text-sm font-medium"
                        style={{
                          color: "#ffffff",
                          fontFamily: "'Roboto', sans-serif",
                        }}
                      >
                        Follow ups
                      </p>
                      <div
                        className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl border border-white/30 bg-white/10 backdrop-blur-lg"
                        style={{
                          color: "#ffffff",
                        }}
                      >
                        <i
                          className="fi flex fi-rr-calendar-check text-lg sm:text-xl"
                          style={{ color: "#ffffff" }}
                        ></i>
                      </div>
                    </div>
                    <div className="mt-auto">
                      <p
                        className="text-3xl sm:text-4xl font-semibold"
                        style={{
                          color: "#ffffff",
                          fontFamily: "'Poppins', sans-serif",
                        }}
                      >
                        0
                      </p>
                      <p
                        className="text-xs sm:text-sm mt-1"
                        style={{
                          color: "rgba(255, 255, 255, 0.8)",
                          fontFamily: "'Roboto', sans-serif",
                        }}
                      >
                        Pending follow ups
                      </p>
                    </div>
                  </div>
                </div>

                {/* Tile 4: Container with 2 Sub-tiles (hidden outer border) */}
                <div
                  className="relative p-0 flex flex-col overflow-hidden"
                  style={{ backgroundColor: "transparent", border: "none" }}
                >
                  <div className="flex flex-col gap-3 h-full">
                    {/* Sub-tile 1: Upcoming follow ups */}
                    <div
                      className="relative overflow-hidden flex-1 rounded-xl p-3 transition-shadow duration-200 hover:shadow-md"
                      style={{
                        background: "linear-gradient(135deg, #3b82f6, #2563eb)",
                      }}
                    >
                      <div
                        className="absolute inset-0"
                        style={{
                          background:
                            "radial-gradient(circle at top left, rgba(255,255,255,0.15), transparent 50%)",
                        }}
                      />
                      <div className="absolute -bottom-12 -right-12 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
                      {/* Decorative Graphics */}
                      <div className="absolute top-2 left-2 w-16 h-16 rounded-full bg-white/8 blur-lg" />
                      <div className="absolute top-4 right-4 w-12 h-12 rounded-full bg-white/6 blur-md" />
                      {/* Background Icon */}
                      <div className="absolute -right-1 -bottom-1 opacity-10">
                        <i className="fi flex fi-rr-clock text-3xl text-white"></i>
                      </div>
                      {/* Pattern Overlay */}
                      <div
                        className="absolute inset-0 opacity-[0.08]"
                        style={{
                          backgroundImage:
                            "radial-gradient(circle, rgba(255,255,255,0.4) 1px, transparent 1px)",
                          backgroundSize: "15px 15px",
                        }}
                      />
                      <div className="relative flex items-start justify-between z-10">
                        <div className="flex-1">
                          <p
                            className="text-xs font-medium mb-1"
                            style={{
                              color: "#ffffff",
                              fontFamily: "'Roboto', sans-serif",
                            }}
                          >
                            Upcoming follow ups
                          </p>
                          <p
                            className="text-xl font-bold"
                            style={{
                              color: "#ffffff",
                              fontFamily: "'Poppins', sans-serif",
                            }}
                          >
                            0
                          </p>
                        </div>
                        <div
                          className="flex h-8 w-8 items-center justify-center rounded-lg"
                          style={{
                            backgroundColor: "transparent",
                          }}
                        >
                          <i
                            className="fi flex fi-rr-clock text-sm"
                            style={{ color: "#ffffff" }}
                          ></i>
                        </div>
                      </div>
                    </div>

                    {/* Sub-tile 2: Overdue follow ups */}
                    <div
                      className="relative overflow-hidden flex-1 rounded-xl p-3 transition-shadow duration-200 hover:shadow-md"
                      style={{
                        background: "linear-gradient(135deg, #ef4444, #dc2626)",
                      }}
                    >
                      <div
                        className="absolute inset-0"
                        style={{
                          background:
                            "radial-gradient(circle at top left, rgba(255,255,255,0.15), transparent 50%)",
                        }}
                      />
                      <div className="absolute -bottom-12 -right-12 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
                      {/* Decorative Graphics */}
                      <div className="absolute top-2 left-2 w-16 h-16 rounded-full bg-white/8 blur-lg" />
                      <div className="absolute top-4 right-4 w-12 h-12 rounded-full bg-white/6 blur-md" />
                      {/* Background Icon */}
                      <div className="absolute -right-1 -bottom-1 opacity-10">
                        <i className="fi flex fi-rr-clock text-3xl text-white"></i>
                      </div>
                      {/* Pattern Overlay */}
                      <div
                        className="absolute inset-0 opacity-[0.08]"
                        style={{
                          backgroundImage:
                            "radial-gradient(circle, rgba(255,255,255,0.4) 1px, transparent 1px)",
                          backgroundSize: "15px 15px",
                        }}
                      />
                      <div className="relative flex items-start justify-between z-10">
                        <div className="flex-1">
                          <p
                            className="text-xs font-medium mb-1"
                            style={{
                              color: "#ffffff",
                              fontFamily: "'Roboto', sans-serif",
                            }}
                          >
                            Overdue follow ups
                          </p>
                          <p
                            className="text-xl font-bold"
                            style={{
                              color: "#ffffff",
                              fontFamily: "'Poppins', sans-serif",
                            }}
                          >
                            0
                          </p>
                        </div>
                        <div
                          className="flex h-10 w-10 items-center justify-center rounded-lg"
                          style={{
                            backgroundColor: "transparent",
                          }}
                        >
                          <i
                            className="fi flex fi-rr-clock text-sm"
                            style={{ color: "#ffffff" }}
                          ></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* All Customers Table Section */}
              <div className="mt-8">
                <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
                  {/* Mobile: Table Header */}
                  <div className="mb-4 sm:hidden">
                    <h2
                      className="text-lg font-bold mb-1"
                      style={{
                        color: "#263238",
                        fontFamily: "'Poppins', sans-serif",
                      }}
                    >
                      All Customers
                      {selectedCustomers.size > 0 && (
                        <span className="ml-2 bg-[#4b33e8] text-white px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider animate-in fade-in slide-in-from-left-4 duration-300 align-middle">
                          {selectedCustomers.size} SELECTED
                        </span>
                      )}
                    </h2>
                    <p
                      className="text-xs"
                      style={{
                        color: "#787E9D",
                        fontFamily: "'Roboto', sans-serif",
                      }}
                    >
                      Manage and view all your customers
                    </p>
                  </div>

                  {/* Mobile: Search Bar (Full Width) */}
                  <div className="mb-4 sm:hidden">
                    <div className="relative w-full">
                      <i className="fi flex fi-rr-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm"></i>
                      <input
                        type="text"
                        placeholder="Search customers..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 text-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        style={{ fontFamily: "'Roboto', sans-serif" }}
                      />
                    </div>
                  </div>

                  {/* Mobile: Action Buttons (Below Search) */}
                  <div className="mb-4 sm:hidden flex flex-wrap items-center gap-2">
                    {/* Delete Button - Show when customers are selected */}
                    {selectedCustomers.size > 0 && (
                      <button
                        onClick={async () => {
                          if (
                            confirm(
                              `Are you sure you want to delete ${selectedCustomers.size} customer(s)?`
                            )
                          ) {
                            setIsDeleting(true);
                            try {
                              const customerIds = Array.from(selectedCustomers);

                              // Delete in batches of 50 to avoid URL length and query limits
                              const batchSize = 50;
                              let successCount = 0;
                              let failCount = 0;
                              const errors: string[] = [];

                              for (
                                let i = 0;
                                i < customerIds.length;
                                i += batchSize
                              ) {
                                const batch = customerIds.slice(
                                  i,
                                  i + batchSize
                                );
                                const { error } = await supabase
                                  .from("customers")
                                  .delete()
                                  .in("id", batch);

                                if (error) {
                                  console.error(
                                    `Error deleting batch ${Math.floor(i / batchSize) + 1
                                    }:`,
                                    error
                                  );
                                  failCount += batch.length;
                                  errors.push(
                                    `Batch ${Math.floor(i / batchSize) + 1}: ${error.message
                                    }`
                                  );
                                } else {
                                  successCount += batch.length;
                                }
                              }

                              if (failCount > 0) {
                                alert(
                                  `Deleted ${successCount} customer(s). ${failCount} failed. ${errors
                                    .slice(0, 2)
                                    .join("; ")}`
                                );
                              } else {
                                // All successful
                                setSelectedCustomers(new Set());
                                await fetchCustomers(currentPage);
                              }
                            } catch (err) {
                              console.error("Error deleting customers:", err);
                              alert(
                                "Failed to delete customers. Please try again."
                              );
                            } finally {
                              setIsDeleting(false);
                            }
                          }
                        }}
                        disabled={isDeleting}
                        className="h-10 px-3 border border-red-300 rounded-lg bg-red-50 hover:bg-red-100 transition-colors flex items-center justify-center text-red-600"
                        style={{ fontFamily: "'Roboto', sans-serif" }}
                      >
                        {isDeleting ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-red-600 border-t-transparent"></div>
                        ) : (
                          <i className="fi flex fi-rr-trash text-sm"></i>
                        )}
                      </button>
                    )}
                    {/* Filter Button */}
                    <button
                      className="h-10 px-3 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors flex items-center justify-center"
                      style={{ fontFamily: "'Roboto', sans-serif" }}
                    >
                      <i className="fi flex fi-rr-filter text-sm text-gray-600"></i>
                    </button>
                    {/* Import Button */}
                    <button
                      onClick={() => setShowImportModal(true)}
                      className="h-10 px-3 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors flex items-center justify-center"
                      style={{ fontFamily: "'Roboto', sans-serif" }}
                    >
                      <i className="fi flex fi-rr-upload text-sm text-gray-600"></i>
                    </button>
                    {/* Export Button */}
                    <button
                      className="h-10 px-3 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors flex items-center justify-center"
                      style={{ fontFamily: "'Roboto', sans-serif" }}
                    >
                      <i className="fi flex fi-rr-download text-sm text-gray-600"></i>
                    </button>
                    {/* View Toggle */}
                    <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1 h-10">
                      <button
                        onClick={() => setViewType("list")}
                        className={`px-3 h-full rounded text-xs font-medium transition-colors flex items-center justify-center ${viewType === "list"
                          ? "bg-white text-purple-600 shadow-sm"
                          : "text-gray-600 hover:text-gray-900"
                          }`}
                        style={{ fontFamily: "'Roboto', sans-serif" }}
                      >
                        <i className="fi flex fi-rr-list"></i>
                      </button>
                      <button
                        onClick={() => setViewType("grid")}
                        className={`px-3 h-full rounded text-xs font-medium transition-colors flex items-center justify-center ${viewType === "grid"
                          ? "bg-white text-purple-600 shadow-sm"
                          : "text-gray-600 hover:text-gray-900"
                          }`}
                        style={{ fontFamily: "'Roboto', sans-serif" }}
                      >
                        <i className="fi flex fi-rr-grid"></i>
                      </button>
                    </div>
                    {/* Add Customer Button */}
                    <button
                      className="h-10 w-10 rounded-lg transition-colors flex items-center justify-center hover:opacity-90"
                      style={{
                        fontFamily: "'Roboto', sans-serif",
                        backgroundColor: "#4b33e8",
                      }}
                    >
                      <i className="fi flex fi-rr-user-add text-sm text-white"></i>
                    </button>
                  </div>

                  {/* Desktop: Title and Search/Actions in Same Row */}
                  <div className="hidden sm:flex sm:items-center sm:justify-between mb-6">
                    <div>
                      <h2
                        className="text-xl font-bold mb-1"
                        style={{
                          color: "#263238",
                          fontFamily: "'Poppins', sans-serif",
                        }}
                      >
                        All Customers
                        {selectedCustomers.size > 0 && (
                          <span className="ml-2 bg-[#4b33e8] text-white px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider animate-in fade-in slide-in-from-left-4 duration-300 align-middle">
                            {selectedCustomers.size} SELECTED
                          </span>
                        )}
                      </h2>
                      <p
                        className="text-sm"
                        style={{
                          color: "#787E9D",
                          fontFamily: "'Roboto', sans-serif",
                        }}
                      >
                        Manage and view all your customers
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      {/* Delete Button - Show when customers are selected */}
                      {selectedCustomers.size > 0 && (
                        <button
                          onClick={async () => {
                            if (
                              confirm(
                                `Are you sure you want to delete ${selectedCustomers.size} customer(s)?`
                              )
                            ) {
                              setIsDeleting(true);
                              try {
                                const customerIds =
                                  Array.from(selectedCustomers);

                                // Delete in batches of 50 to avoid URL length and query limits
                                const batchSize = 50;
                                let successCount = 0;
                                let failCount = 0;
                                const errors: string[] = [];

                                for (
                                  let i = 0;
                                  i < customerIds.length;
                                  i += batchSize
                                ) {
                                  const batch = customerIds.slice(
                                    i,
                                    i + batchSize
                                  );
                                  const { error } = await supabase
                                    .from("customers")
                                    .delete()
                                    .in("id", batch);

                                  if (error) {
                                    console.error(
                                      `Error deleting batch ${Math.floor(i / batchSize) + 1
                                      }:`,
                                      error
                                    );
                                    failCount += batch.length;
                                    errors.push(
                                      `Batch ${Math.floor(i / batchSize) + 1
                                      }: ${error.message}`
                                    );
                                  } else {
                                    successCount += batch.length;
                                  }
                                }

                                if (failCount > 0) {
                                  alert(
                                    `Deleted ${successCount} customer(s). ${failCount} failed. ${errors
                                      .slice(0, 2)
                                      .join("; ")}`
                                  );
                                } else {
                                  // All successful
                                  setSelectedCustomers(new Set());
                                  await fetchCustomers(currentPage);
                                }
                              } catch (err) {
                                console.error("Error deleting customers:", err);
                                alert(
                                  "Failed to delete customers. Please try again."
                                );
                              } finally {
                                setIsDeleting(false);
                              }
                            }
                          }}
                          disabled={isDeleting}
                          className="h-10 px-3 border border-red-300 rounded-lg bg-red-50 hover:bg-red-100 transition-colors flex items-center justify-center text-red-600"
                          style={{ fontFamily: "'Roboto', sans-serif" }}
                        >
                          {isDeleting ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-red-600 border-t-transparent"></div>
                          ) : (
                            <i className="fi flex fi-rr-trash text-sm"></i>
                          )}
                        </button>
                      )}
                      {/* Search Input */}
                      <div className="relative w-64">
                        <i className="fi flex fi-rr-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm"></i>
                        <input
                          type="text"
                          placeholder="Search customers..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 text-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          style={{ fontFamily: "'Roboto', sans-serif" }}
                        />
                      </div>
                      {/* Filter Button */}
                      <button
                        className="h-10 px-3 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors flex items-center justify-center"
                        style={{ fontFamily: "'Roboto', sans-serif" }}
                      >
                        <i className="fi flex fi-rr-filter text-sm text-gray-600"></i>
                      </button>
                      {/* Import Button */}
                      <button
                        onClick={() => setShowImportModal(true)}
                        className="h-10 px-3 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors flex items-center justify-center"
                        style={{ fontFamily: "'Roboto', sans-serif" }}
                      >
                        <i className="fi flex fi-rr-upload text-sm text-gray-600"></i>
                      </button>
                      {/* Export Button */}
                      <button
                        className="h-10 px-3 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors flex items-center justify-center"
                        style={{ fontFamily: "'Roboto', sans-serif" }}
                      >
                        <i className="fi flex fi-rr-download text-sm text-gray-600"></i>
                      </button>
                      {/* View Toggle */}
                      <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1 h-10">
                        <button
                          onClick={() => setViewType("list")}
                          className={`px-3 h-full rounded text-xs font-medium transition-colors flex items-center justify-center ${viewType === "list"
                            ? "bg-white text-purple-600 shadow-sm"
                            : "text-gray-600 hover:text-gray-900"
                            }`}
                          style={{ fontFamily: "'Roboto', sans-serif" }}
                        >
                          <i className="fi flex fi-rr-list"></i>
                        </button>
                        <button
                          onClick={() => setViewType("grid")}
                          className={`px-3 h-full rounded text-xs font-medium transition-colors flex items-center justify-center ${viewType === "grid"
                            ? "bg-white text-purple-600 shadow-sm"
                            : "text-gray-600 hover:text-gray-900"
                            }`}
                          style={{ fontFamily: "'Roboto', sans-serif" }}
                        >
                          <i className="fi flex fi-rr-grid"></i>
                        </button>
                      </div>
                      {/* Add Customer Button */}
                      <button
                        className="h-10 w-10 rounded-lg transition-colors flex items-center justify-center hover:opacity-90"
                        style={{
                          fontFamily: "'Roboto', sans-serif",
                          backgroundColor: "#4b33e8",
                        }}
                      >
                        <i className="fi flex fi-rr-user-add text-sm text-white"></i>
                      </button>
                    </div>
                  </div>

                  {/* Table Content */}
                  {loadingCustomers ? (
                    <div className="text-center py-12">
                      <div
                        className="animate-spin rounded-full h-8 w-8 border-4 border-t-transparent mx-auto mb-4"
                        style={{ borderColor: "#4b33e8" }}
                      ></div>
                      <p
                        className="text-gray-500 text-sm"
                        style={{ fontFamily: "'Roboto', sans-serif" }}
                      >
                        Loading customers...
                      </p>
                    </div>
                  ) : filteredCustomers.length === 0 ? (
                    <div className="text-center py-12">
                      <p
                        className="text-gray-500"
                        style={{ fontFamily: "'Roboto', sans-serif" }}
                      >
                        {searchQuery
                          ? "No customers found matching your search."
                          : "No customers found."}
                      </p>
                    </div>
                  ) : viewType === "list" ? (
                    <div className="overflow-x-auto">
                      <div className="overflow-x-auto -mx-2">
                          <table className="w-full text-left">
                            <thead>
                              <tr className="border-b border-gray-50">
                                <th className="px-4 py-4 w-10">
                                  <div className="flex items-center justify-center">
                                    <input
                                      type="checkbox"
                                      checked={
                                        allCustomers.length > 0 &&
                                        selectedCustomers.size ===
                                        allCustomers.length
                                      }
                                      onChange={(e) => {
                                        if (e.target.checked) {
                                          const allIds = new Set(
                                            allCustomers.map((c) => c.id)
                                          );
                                          setSelectedCustomers(allIds);
                                        } else {
                                          setSelectedCustomers(new Set());
                                        }
                                      }}
                                      className="w-4 h-4 rounded border-gray-300 text-[#4b33e8] focus:ring-[#4b33e8] cursor-pointer"
                                    />
                                  </div>
                                </th>
                                <th className="px-4 py-4 text-[10px] font-medium text-gray-400 uppercase tracking-widest">
                                  Customer Name
                                </th>
                                <th className="px-4 py-4 text-[10px] font-medium text-gray-400 uppercase tracking-widest">
                                  Contact Info
                                </th>
                                <th className="px-4 py-4 text-[10px] font-medium text-gray-400 uppercase tracking-widest text-center">
                                  Status
                                </th>
                                <th className="px-4 py-4 text-[10px] font-medium text-gray-400 uppercase tracking-widest">
                                  Campaign
                                </th>
                                <th className="px-4 py-4 text-[10px] font-medium text-gray-400 uppercase tracking-widest">
                                  Assigned To
                                </th>
                                <th className="px-4 py-4 text-[10px] font-medium text-gray-400 uppercase tracking-widest">
                                  Managed By
                                </th>
                                <th className="px-4 py-4 text-[10px] font-medium text-gray-400 uppercase tracking-widest">
                                  Expiry Date
                                </th>
                                <th className="px-4 py-4 text-[10px] font-medium text-gray-400 uppercase tracking-widest">
                                  Created Date
                                </th>
                                <th className="px-4 py-4 text-[10px] font-medium text-gray-400 uppercase tracking-widest text-right">
                                  Action
                                </th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                              {filteredCustomers.map((customer) => (
                                <tr
                                  key={customer.id}
                                  className="group hover:bg-indigo-50/30 transition-all cursor-pointer border-b border-gray-50/50 last:border-0"
                                >
                                  <td className="px-4 py-4">
                                    <div className="flex items-center justify-center">
                                      <input
                                        type="checkbox"
                                        checked={selectedCustomers.has(customer.id)}
                                        onChange={(e) => {
                                          const newSelected = new Set(
                                            selectedCustomers
                                          );
                                          if (e.target.checked) {
                                            newSelected.add(customer.id);
                                          } else {
                                            newSelected.delete(customer.id);
                                          }
                                          setSelectedCustomers(newSelected);
                                        }}
                                        className="w-4 h-4 rounded border-gray-300 text-[#4b33e8] focus:ring-[#4b33e8] cursor-pointer"
                                      />
                                    </div>
                                  </td>
                                  <td className="px-4 py-4">
                                    <div className="flex items-center gap-3">
                                      <div className="w-10 h-10 flex-shrink-0 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shadow-lg shadow-indigo-100 uppercase">
                                        {customer.customer_name
                                          ? customer.customer_name
                                            .charAt(0)
                                            .toUpperCase()
                                          : "C"}
                                      </div>
                                      <span
                                        className="text-xs font-medium text-gray-800"
                                        style={{
                                          fontFamily: "'Poppins', sans-serif",
                                          color: "#263238",
                                        }}
                                      >
                                        {customer.customer_name || "N/A"}
                                      </span>
                                    </div>
                                  </td>
                                  <td className="px-4 py-4">
                                    <div className="flex flex-col">
                                      <span className="text-xs font-medium text-gray-700 leading-none mb-1">
                                        {customer.phone_no || "No Contact"}
                                      </span>
                                      <span className="text-[9px] text-gray-400 font-medium uppercase tracking-tighter">
                                        Verified Lead
                                      </span>
                                    </div>
                                  </td>
                                  <td className="px-4 py-4 text-center">
                                    <div className="flex justify-center">
                                      <div
                                        className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest flex items-center gap-1.5 ${customer.status === "active"
                                            ? "bg-green-50 text-green-600 border border-green-100"
                                            : customer.status === "inactive"
                                              ? "bg-gray-50 text-gray-600 border border-gray-100"
                                              : "bg-orange-50 text-orange-600 border border-orange-100"
                                          }`}
                                      >
                                        {customer.status === "active"
                                          ? "Active"
                                          : customer.status === "inactive"
                                            ? "Inactive"
                                            : "Pending"}
                                      </div>
                                    </div>
                                  </td>
                                  <td className="px-4 py-4">
                                    <span className="px-2 py-1 rounded-md bg-indigo-50 text-indigo-700 text-[10px] font-bold uppercase tracking-wide">
                                      {customer.campaign_name || "No Campaign"}
                                    </span>
                                  </td>
                                  <td className="px-4 py-4">
                                    <span className="text-xs font-medium text-gray-600">
                                      {customer.assigned_user_name ||
                                        customer.assigned_employee_id ||
                                        "Unassigned"}
                                    </span>
                                  </td>
                                  <td className="px-4 py-4">
                                    <div className="flex flex-col">
                                      <span className="text-xs font-semibold text-gray-800">
                                        {customer.managed_by_name || "Self"}
                                      </span>
                                      {customer.managed_by_id && (
                                        <span className="text-[10px] text-gray-400 font-medium">
                                          ID: {customer.managed_by_id}
                                        </span>
                                      )}
                                    </div>
                                  </td>
                                  <td className="px-4 py-4">
                                    <div className="flex flex-col">
                                      <span className="text-xs font-medium text-gray-700 leading-none mb-1">
                                        {customer.expiry_date
                                          ? formatDate(customer.expiry_date)
                                          : "---"}
                                      </span>
                                      <span className="text-[9px] text-gray-400 font-medium uppercase tracking-tighter">
                                        Expires
                                      </span>
                                    </div>
                                  </td>
                                  <td className="px-4 py-4">
                                    <div className="flex flex-col">
                                      <span className="text-xs font-medium text-gray-700 leading-none mb-1">
                                        {formatDate(customer.created_at)}
                                      </span>
                                      <span className="text-[9px] text-gray-400 font-medium uppercase tracking-tighter">
                                        Created
                                      </span>
                                    </div>
                                  </td>
                                  <td className="px-4 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                      <button
                                        onClick={() => {
                                          setSelectedCustomer(customer);
                                          setShowCustomerDetailsModal(true);
                                        }}
                                        className="text-purple-600 hover:text-purple-700 transition-colors p-1.5 hover:bg-purple-50 rounded"
                                        title="View Details"
                                      >
                                        <i className="fi flex fi-rr-info text-sm"></i>
                                      </button>
                                      <button
                                        className="text-red-600 hover:text-red-700 transition-colors p-1.5 hover:bg-red-50 rounded"
                                        title="Delete"
                                        onClick={async () => {
                                          if (
                                            confirm(
                                              "Are you sure you want to delete this customer?"
                                            )
                                          ) {
                                            try {
                                              const { error } = await supabase
                                                .from("customers")
                                                .delete()
                                                .eq("id", customer.id);

                                              if (error) {
                                                console.error(
                                                  "Error deleting customer:",
                                                  error
                                                );
                                                alert(
                                                  "Failed to delete customer"
                                                );
                                              } else {
                                                await fetchCustomers(
                                                  currentPage
                                                );
                                              }
                                            } catch (err) {
                                              console.error(
                                                "Error deleting customer:",
                                                err
                                              );
                                              alert(
                                                "Failed to delete customer"
                                              );
                                            }
                                          }
                                        }}
                                      >
                                        <i className="fi flex fi-rr-trash text-sm"></i>
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {filteredCustomers.map((customer) => (
                        <div
                          key={customer.id}
                          className="relative bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                        >
                          {/* Action Buttons - Top Right Corner */}
                          <div className="absolute top-2 right-2 flex items-center gap-1 z-10">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedCustomer(customer);
                                setShowCustomerDetailsModal(true);
                              }}
                              className="text-purple-600 hover:text-purple-700 transition-colors p-1.5 hover:bg-purple-50 rounded"
                              title="View Details"
                              style={{
                                fontFamily: "'Roboto', sans-serif",
                              }}
                            >
                              <i className="fi flex fi-rr-info text-sm"></i>
                            </button>
                            <button
                              onClick={async (e) => {
                                e.stopPropagation();
                                if (
                                  confirm(
                                    "Are you sure you want to delete this customer?"
                                  )
                                ) {
                                  try {
                                    const { error } = await supabase
                                      .from("customers")
                                      .delete()
                                      .eq("id", customer.id);

                                    if (error) {
                                      console.error(
                                        "Error deleting customer:",
                                        error
                                      );
                                      alert("Failed to delete customer");
                                    } else {
                                      await fetchCustomers(currentPage);
                                    }
                                  } catch (err) {
                                    console.error(
                                      "Error deleting customer:",
                                      err
                                    );
                                    alert("Failed to delete customer");
                                  }
                                }
                              }}
                              className="text-red-600 hover:text-red-700 transition-colors p-1.5 hover:bg-red-50 rounded"
                              title="Delete"
                              style={{
                                fontFamily: "'Roboto', sans-serif",
                              }}
                            >
                              <i className="fi flex fi-rr-trash text-sm"></i>
                            </button>
                          </div>
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
                              {customer.customer_name
                                ? customer.customer_name.charAt(0).toUpperCase()
                                : "C"}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3
                                className="text-sm font-semibold text-gray-900 truncate"
                                style={{ fontFamily: "'Poppins', sans-serif" }}
                              >
                                {customer.customer_name || "N/A"}
                              </h3>
                              <p
                                className="text-xs text-gray-600 truncate"
                                style={{ fontFamily: "'Roboto', sans-serif" }}
                              >
                                {customer.phone_no || "N/A"}
                              </p>
                            </div>
                          </div>
                          <div className="space-y-2 text-xs">
                            {customer.lead_id && (
                              <div className="flex items-center gap-2 text-gray-600">
                                <i className="fi flex fi-rr-id-card text-[10px]"></i>
                                <span
                                  className="truncate"
                                  style={{ fontFamily: "'Roboto', sans-serif" }}
                                >
                                  {customer.lead_id}
                                </span>
                              </div>
                            )}
                            <div className="flex items-center gap-2 text-gray-600">
                              <i className="fi flex fi-rr-headset text-[10px]"></i>
                              <span
                                className="truncate"
                                style={{ fontFamily: "'Roboto', sans-serif" }}
                              >
                                {customer.assigned_user_name || "Unassigned"}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                              <i className="fi flex fi-rr-user text-[10px]"></i>
                              <span
                                className="truncate"
                                style={{ fontFamily: "'Roboto', sans-serif" }}
                              >
                                {customer.managed_by_name || "Self"}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <div
                                className={`px-2 py-0.5 rounded-full inline-flex items-center gap-1 ${customer.status === "active"
                                  ? "bg-green-100"
                                  : customer.status === "inactive"
                                    ? "bg-gray-100"
                                    : "bg-orange-100"
                                  }`}
                              >
                                <div
                                  className={`w-1 h-1 rounded-full ${customer.status === "active"
                                    ? "bg-green-500"
                                    : customer.status === "inactive"
                                      ? "bg-gray-400"
                                      : "bg-orange-400"
                                    }`}
                                ></div>
                                <span
                                  className={`text-[10px] font-semibold ${customer.status === "active"
                                    ? "text-green-700"
                                    : customer.status === "inactive"
                                      ? "text-gray-600"
                                      : "text-orange-700"
                                    }`}
                                >
                                  {customer.status === "active"
                                    ? "Active"
                                    : customer.status === "inactive"
                                      ? "Inactive"
                                      : "Pending"}
                                </span>
                              </div>
                            </div>
                            {customer.expiry_date && (
                              <div className="flex items-center gap-2 text-gray-600 pt-1">
                                <i className="fi flex fi-rr-calendar text-[10px]"></i>
                                <span
                                  style={{ fontFamily: "'Roboto', sans-serif" }}
                                >
                                  {formatDate(customer.expiry_date)}
                                </span>
                              </div>
                            )}
                            {/* Display checked fields from customer_details */}
                            {customer.customer_details &&
                              (() => {
                                try {
                                  const details = JSON.parse(
                                    customer.customer_details
                                  );
                                  const checkedFields = Object.entries(details)
                                    .filter(([key]) => key.endsWith("_checked"))
                                    .map(([key, value]) => ({
                                      fieldName: key.replace("_checked", ""),
                                      value: String(value),
                                    }));

                                  if (checkedFields.length === 0) return null;

                                  return checkedFields.map((field) => (
                                    <div
                                      key={field.fieldName}
                                      className="flex items-center gap-2 text-gray-600 pt-1"
                                    >
                                      <i className="fi flex fi-rr-check text-[10px] text-green-600"></i>
                                      <span
                                        className="truncate"
                                        style={{
                                          fontFamily: "'Roboto', sans-serif",
                                        }}
                                        title={`${field.fieldName}: ${field.value}`}
                                      >
                                        <span className="font-medium">
                                          {field.fieldName}:
                                        </span>{" "}
                                        {field.value}
                                      </span>
                                    </div>
                                  ));
                                } catch (e) {
                                  return null;
                                }
                              })()}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Pagination Controls */}
                  {!loadingCustomers && totalCustomers > 0 && (
                    <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-3 bg-white border-t border-gray-200 rounded-b-lg">
                      <div className="flex items-center gap-3">
                        <div
                          className="text-sm text-gray-600"
                          style={{ fontFamily: "'Roboto', sans-serif" }}
                        >
                          Showing {startIndex} to {endIndex} of {totalCustomers}{" "}
                          customers
                        </div>
                        {/* Page Size Selector */}
                        <div className="flex items-center gap-2">
                          <label
                            className="text-xs text-gray-600"
                            style={{ fontFamily: "'Roboto', sans-serif" }}
                          >
                            Per page:
                          </label>
                          <select
                            value={pageSize}
                            onChange={(e) => {
                              const newPageSize =
                                e.target.value === "all"
                                  ? "all"
                                  : parseInt(e.target.value);
                              setPageSize(newPageSize);
                            }}
                            className="px-2 py-1.5 text-sm border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            style={{ fontFamily: "'Roboto', sans-serif" }}
                          >
                            <option value="50">50</option>
                            <option value="100">100</option>
                            <option value="200">200</option>
                            <option value="all">All</option>
                          </select>
                        </div>
                      </div>
                      {pageSize !== "all" && (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              if (currentPage > 1) {
                                setCurrentPage(currentPage - 1);
                              }
                            }}
                            disabled={currentPage === 1 || loadingCustomers}
                            className={`px-2 py-1.5 w-8 h-8 rounded-lg text-sm font-medium transition-colors ${currentPage === 1 || loadingCustomers
                              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                              }`}
                            style={{ fontFamily: "'Roboto', sans-serif" }}
                          >
                            <i className="fi flex fi-rr-angle-left"></i>
                          </button>
                          <div className="flex items-center gap-1">
                            {Array.from(
                              { length: Math.min(5, totalPages) },
                              (_, i) => {
                                let pageNum: number;
                                if (totalPages <= 5) {
                                  pageNum = i + 1;
                                } else if (currentPage <= 3) {
                                  pageNum = i + 1;
                                } else if (currentPage >= totalPages - 2) {
                                  pageNum = totalPages - 4 + i;
                                } else {
                                  pageNum = currentPage - 2 + i;
                                }
                                return (
                                  <button
                                    key={pageNum}
                                    onClick={() => setCurrentPage(pageNum)}
                                    disabled={loadingCustomers}
                                    className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${currentPage === pageNum
                                      ? "bg-[#4b33e8] text-white"
                                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                      }`}
                                    style={{
                                      fontFamily: "'Roboto', sans-serif",
                                    }}
                                  >
                                    {pageNum}
                                  </button>
                                );
                              }
                            )}
                          </div>
                          <button
                            onClick={() => {
                              if (currentPage < totalPages) {
                                setCurrentPage(currentPage + 1);
                              }
                            }}
                            disabled={
                              currentPage >= totalPages || loadingCustomers
                            }
                            className={`px-3 w-8 h-8 py-1.5 rounded-lg text-sm font-medium transition-colors ${currentPage >= totalPages || loadingCustomers
                              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                              }`}
                            style={{ fontFamily: "'Roboto', sans-serif" }}
                          >
                            <i className="fi flex fi-rr-angle-right "></i>
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 backdrop-blur-lg flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2
                className="text-xl font-bold"
                style={{
                  color: "#263238",
                  fontFamily: "'Poppins', sans-serif",
                }}
              >
                Import Customers
              </h2>
              <button
                onClick={() => {
                  setShowImportModal(false);
                  setImportFile(null);
                  setImportError("");
                  setImportSuccess("");
                  if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                  }
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <i className="fi flex fi-rr-cross text-xl"></i>
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {/* Instructions */}
              <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                <p
                  className="text-sm text-gray-700"
                  style={{ fontFamily: "'Roboto', sans-serif" }}
                >
                  <strong>Instructions:</strong> Upload a CSV or Excel file with
                  customer data. The file should contain the following columns:
                </p>
                <ul
                  className="mt-2 text-sm text-gray-600 list-disc list-inside"
                  style={{ fontFamily: "'Roboto', sans-serif" }}
                >
                  <li>
                    proposer, phone, plan_name, renewal_date, total_sum_insured,
                    total_premium, proposed_addon_cost, ages
                  </li>
                </ul>
              </div>

              {/* Download Sample */}
              <div className="mb-6">
                <button
                  onClick={() => {
                    const csvContent = `proposer,phone,plan_name,renewal_date,total_sum_insured,total_premium,proposed_addon_cost,ages
Boya Tribhuvan Teja,9885562055,Care Supreme,11-Oct-2025,₹17,50,000,7562,645,32
Gurparshad Singh,9501242244,Care Supreme,12-Oct-2025,₹15,00,000,46627,2151,"47, 44, 18, 14"
Boya Varalakshmi Dev,9885562055,Care Supreme,13-Oct-2025,₹17,50,000,105604,2796,65`;
                    const blob = new Blob([csvContent], {
                      type: "text/csv;charset=utf-8;",
                    });
                    const link = document.createElement("a");
                    const url = URL.createObjectURL(blob);
                    link.setAttribute("href", url);
                    link.setAttribute(
                      "download",
                      "sample_customers_import.csv"
                    );
                    link.style.visibility = "hidden";
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                  className="w-full px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                  style={{ fontFamily: "'Roboto', sans-serif" }}
                >
                  <i className="fi flex fi-rr-download"></i>
                  <span>Download Sample CSV</span>
                </button>
              </div>

              {/* File Upload */}
              <div className="mb-6">
                <label
                  className="block text-sm font-medium mb-2"
                  style={{
                    color: "#263238",
                    fontFamily: "'Poppins', sans-serif",
                  }}
                >
                  Upload CSV or Excel File{" "}
                  <span style={{ color: "#EF4444" }}>*</span>
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#4b33e8] transition-colors">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv,.xlsx,.xls"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const validExtensions = [".csv", ".xlsx", ".xls"];
                        const fileExtension = file.name
                          .substring(file.name.lastIndexOf("."))
                          .toLowerCase();
                        if (!validExtensions.includes(fileExtension)) {
                          setImportError(
                            "Please upload a valid CSV or Excel file"
                          );
                          setImportFile(null);
                          return;
                        }
                        setImportFile(file);
                        setImportError("");
                        setImportSuccess("");

                        // Parse CSV to get columns
                        try {
                          const text = await file.text();
                          const lines = text.split("\n");
                          if (lines.length > 0) {
                            const columns = lines[0]
                              .split(",")
                              .map((col) => col.trim().replace(/"/g, ""));
                            setCsvColumns(columns);

                            // 1. Define fields to map
                            const predefinedFields = [
                              { key: "name", label: "Name", aliases: ["customer name", "customer_name", "proposer", "proposer name"] },
                              { key: "phone", label: "Phone", aliases: ["phone_no", "phone number", "mobile", "mobile number", "contact"] },
                              { key: "sum_insured", label: "Sum Insured", aliases: ["total_sum_insured", "insured amount", "si"] },
                              { key: "premium", label: "Premium", aliases: ["total_premium", "amount", "cost"] },
                              { key: "company", label: "Company", aliases: ["provider", "insurance company", "carrier"] },
                              { key: "expiry_date", label: "Expiry Date", aliases: ["renewal_date", "renewal date", "date of expiry", "valid till"] },
                            ];

                            // 2. Initial Mapping Logic (Autofill)
                            const initialMapping: Record<string, string> = {};
                            const usedColumns = new Set<string>();

                            predefinedFields.forEach(field => {
                              // Try exact label match first
                              let matchedCol = columns.find(col =>
                                !usedColumns.has(col) &&
                                (col.toLowerCase() === field.label.toLowerCase() ||
                                  col.toLowerCase() === field.key.toLowerCase() ||
                                  field.aliases.includes(col.toLowerCase()))
                              );

                              // If no exact match, try fuzzy match (slugified)
                              if (!matchedCol) {
                                matchedCol = columns.find(col => {
                                  if (usedColumns.has(col)) return false;
                                  const cleanCol = col.toLowerCase().replace(/[\s\-_]/g, '');
                                  const cleanLabel = field.label.toLowerCase().replace(/[\s\-_]/g, '');
                                  const cleanKey = field.key.toLowerCase().replace(/[\s\-_]/g, '');
                                  return cleanCol === cleanLabel || cleanCol === cleanKey ||
                                    field.aliases.some(a => cleanCol === a.replace(/[\s\-_]/g, ''));
                                });
                              }

                              if (matchedCol) {
                                initialMapping[field.key] = matchedCol;
                                usedColumns.add(matchedCol);
                              }
                            });

                            setFieldMapping(initialMapping);
                            setCustomFields([]);
                            // Show mapping modal
                            setShowMappingModal(true);
                          }
                        } catch (err) {
                          console.error("Error parsing file:", err);
                          setImportError(
                            "Error reading file. Please try again."
                          );
                        }
                      }
                    }}
                    className="hidden"
                    id="customer-upload"
                  />
                  <label
                    htmlFor="customer-upload"
                    className="cursor-pointer flex flex-col items-center gap-2"
                  >
                    <i className="fi flex fi-rr-upload text-3xl text-gray-400"></i>
                    <div>
                      <span
                        className="text-sm font-medium text-[#4b33e8]"
                        style={{ fontFamily: "'Poppins', sans-serif" }}
                      >
                        Click to upload
                      </span>
                      <span
                        className="text-sm text-gray-500"
                        style={{ fontFamily: "'Roboto', sans-serif" }}
                      >
                        {" "}
                        or drag and drop
                      </span>
                    </div>
                    <p
                      className="text-xs text-gray-400"
                      style={{ fontFamily: "'Roboto', sans-serif" }}
                    >
                      CSV or Excel file only
                    </p>
                  </label>
                  {importFile && (
                    <div className="mt-3 p-2 bg-gray-50 rounded-lg flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <i className="fi flex fi-rr-file text-gray-600"></i>
                        <span
                          className="text-sm text-gray-700"
                          style={{ fontFamily: "'Roboto', sans-serif" }}
                        >
                          {importFile.name}
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          setImportFile(null);
                          if (fileInputRef.current) {
                            fileInputRef.current.value = "";
                          }
                        }}
                        className="text-red-500 hover:text-red-700"
                      >
                        <i className="fi flex fi-rr-cross text-sm"></i>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Error Message */}
              {importError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p
                    className="text-sm text-red-600"
                    style={{ fontFamily: "'Roboto', sans-serif" }}
                  >
                    {importError}
                  </p>
                </div>
              )}

              {/* Success Message */}
              {importSuccess && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p
                    className="text-sm text-green-600"
                    style={{ fontFamily: "'Roboto', sans-serif" }}
                  >
                    {importSuccess}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => {
                    setShowImportModal(false);
                    setImportFile(null);
                    setImportError("");
                    setImportSuccess("");
                    if (fileInputRef.current) {
                      fileInputRef.current.value = "";
                    }
                  }}
                  className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors"
                  style={{ fontFamily: "'Roboto', sans-serif" }}
                  disabled={importing}
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (!importFile) {
                      setImportError("Please select a file to upload");
                      return;
                    }
                    // File is already uploaded and mapping modal should be open
                    // This button is just for closing the import modal if needed
                    setShowImportModal(false);
                  }}
                  className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors"
                  style={{ fontFamily: "'Roboto', sans-serif" }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Field Mapping Modal */}
      {showMappingModal && (
        <div className="fixed inset-0 backdrop-blur-lg flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2
                className="text-xl font-bold"
                style={{
                  color: "#263238",
                  fontFamily: "'Poppins', sans-serif",
                }}
              >
                Map CSV Columns
              </h2>
              <button
                onClick={() => {
                  setShowMappingModal(false);
                  setFieldMapping({});
                  setCustomFields([]);
                  setSelectedFields({
                    name: true,
                    phone: true,
                    sum_insured: false,
                    premium: false,
                    company: false,
                    expiry_date: true,
                  });
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <i className="fi flex fi-rr-cross text-xl"></i>
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <p
                className="text-sm text-gray-600 mb-6"
                style={{ fontFamily: "'Roboto', sans-serif" }}
              >
                Map the CSV columns to the corresponding fields below and select a campaign:
              </p>

              {/* Campaign Selection */}
              <div className="mb-8 p-4 bg-indigo-50/50 rounded-xl border border-indigo-100/50">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center text-[#4b33e8]">
                    <i className="fi flex fi-rr-bullhorn text-lg"></i>
                  </div>
                  <div className="flex-1">
                    <label
                      className="text-xs font-bold text-indigo-600 uppercase tracking-widest block mb-1"
                      style={{ fontFamily: "'Poppins', sans-serif" }}
                    >
                      Select Campaign <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={selectedCampaignId}
                      onChange={(e) => setSelectedCampaignId(e.target.value)}
                      className="w-full bg-white border border-indigo-100 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-200 transition-all font-medium"
                      style={{ fontFamily: "'Roboto', sans-serif" }}
                    >
                      <option value="">Choose a campaign...</option>
                      {campaigns.map((camp) => (
                        <option key={camp.id} value={camp.id}>
                          {camp.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Predefined Fields */}
              <div className="space-y-6 mb-6">
                {/* Group 1: Basic Information */}
                <div>
                  <h3
                    className="text-sm font-semibold text-gray-700 mb-3"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  >
                    Basic Information
                  </h3>
                  <div className="space-y-4">
                    {[
                      { key: "name", label: "Name" },
                      { key: "phone", label: "Phone" },
                    ].map((field) => (
                      <div key={field.key}>
                        <div className="flex items-center gap-4">
                          <input
                            type="checkbox"
                            checked={selectedFields[field.key] || false}
                            onChange={(e) => {
                              setSelectedFields({
                                ...selectedFields,
                                [field.key]: e.target.checked,
                              });
                            }}
                            className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                          />
                          <label
                            className="w-32 text-sm font-medium text-gray-700"
                            style={{ fontFamily: "'Roboto', sans-serif" }}
                          >
                            {field.label}
                          </label>
                          <select
                            value={fieldMapping[field.key] || ""}
                            onChange={(e) => {
                              setFieldMapping({
                                ...fieldMapping,
                                [field.key]: e.target.value,
                              });
                            }}
                            className="flex-1 px-3 py-2 text-gray-700  border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                            style={{ fontFamily: "'Roboto', sans-serif" }}
                          >
                            <option value="">Select CSV column...</option>
                            {csvColumns
                              .filter((col) => {
                                // Show current selected column, hide others that are selected
                                const currentSelected = fieldMapping[field.key];
                                if (col === currentSelected) return true;
                                // Hide if selected in other fields
                                return !Object.entries(fieldMapping).some(
                                  ([key, value]) =>
                                    key !== field.key && value === col
                                );
                              })
                              .sort((a, b) => {
                                const currentSelected = fieldMapping[field.key];
                                // Currently selected column first
                                if (a === currentSelected) return -1;
                                if (b === currentSelected) return 1;
                                // Then sort alphabetically
                                return a.localeCompare(b);
                              })
                              .map((col) => (
                                <option key={col} value={col}>
                                  {col}
                                </option>
                              ))}
                          </select>
                          <button
                            onClick={() => {
                              const currentMerged =
                                mergedFields[field.key] || [];
                              if (currentMerged.length === 0) {
                                setMergedFields({
                                  ...mergedFields,
                                  [field.key]: [""],
                                });
                              }
                            }}
                            className="px-2 py-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                            title="Merge with another column"
                          >
                            <i className="fi flex fi-rr-plus text-sm"></i>
                          </button>
                        </div>
                        {mergedFields[field.key] &&
                          mergedFields[field.key].length > 0 && (
                            <div className="ml-36 space-y-2">
                              {mergedFields[field.key].map(
                                (mergedCol, mergeIndex) => (
                                  <div
                                    key={mergeIndex}
                                    className="flex items-center gap-2"
                                  >
                                    <span className="text-xs text-gray-500">
                                      +
                                    </span>
                                    <select
                                      value={mergedCol}
                                      onChange={(e) => {
                                        const updated = [
                                          ...mergedFields[field.key],
                                        ];
                                        updated[mergeIndex] = e.target.value;
                                        setMergedFields({
                                          ...mergedFields,
                                          [field.key]: updated,
                                        });
                                      }}
                                      className="flex-1 px-3 py-2 text-gray-700 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                                      style={{
                                        fontFamily: "'Roboto', sans-serif",
                                      }}
                                    >
                                      <option value="">
                                        Select column to merge...
                                      </option>
                                      {csvColumns
                                        .filter((col) => {
                                          if (col === fieldMapping[field.key])
                                            return false;
                                          const selectedInPredefined =
                                            Object.entries(fieldMapping).some(
                                              ([key, value]) =>
                                                key !== field.key &&
                                                value === col
                                            );
                                          const selectedInCustom =
                                            customFields.some(
                                              (cf) => cf.mappedTo === col
                                            );
                                          const selectedInOtherMerged =
                                            Object.entries(mergedFields).some(
                                              ([key, values]) =>
                                                key !== field.key &&
                                                values.includes(col)
                                            );
                                          const selectedInSameMerged =
                                            mergedFields[field.key]?.some(
                                              (val, idx) =>
                                                idx !== mergeIndex &&
                                                val === col
                                            );
                                          return (
                                            !selectedInPredefined &&
                                            !selectedInCustom &&
                                            !selectedInOtherMerged &&
                                            !selectedInSameMerged
                                          );
                                        })
                                        .sort((a, b) => a.localeCompare(b))
                                        .map((col) => (
                                          <option key={col} value={col}>
                                            {col}
                                          </option>
                                        ))}
                                    </select>
                                    <button
                                      onClick={() => {
                                        const updated = mergedFields[
                                          field.key
                                        ].filter(
                                          (_, idx) => idx !== mergeIndex
                                        );
                                        if (updated.length === 0) {
                                          const newMerged = { ...mergedFields };
                                          delete newMerged[field.key];
                                          setMergedFields(newMerged);
                                        } else {
                                          setMergedFields({
                                            ...mergedFields,
                                            [field.key]: updated,
                                          });
                                        }
                                      }}
                                      className="text-red-500 hover:text-red-700"
                                    >
                                      <i className="fi flex fi-rr-cross text-sm"></i>
                                    </button>
                                  </div>
                                )
                              )}
                              {mergedFields[field.key] &&
                                mergedFields[field.key].length > 0 && (
                                  <button
                                    onClick={() => {
                                      setMergedFields({
                                        ...mergedFields,
                                        [field.key]: [
                                          ...mergedFields[field.key],
                                          "",
                                        ],
                                      });
                                    }}
                                    className="text-xs text-purple-600 hover:text-purple-700 flex items-center gap-1"
                                  >
                                    <i className="fi flex fi-rr-plus text-xs"></i>
                                    <span>Add another column</span>
                                  </button>
                                )}
                            </div>
                          )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Group 2: Policy Details */}
                <div>
                  <h3
                    className="text-sm font-semibold text-gray-700 mb-3"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  >
                    Policy Details
                  </h3>
                  <div className="space-y-4">
                    {[
                      { key: "sum_insured", label: "Sum Insured" },
                      { key: "premium", label: "Premium" },
                      { key: "company", label: "Company" },
                      { key: "expiry_date", label: "Expiry Date" },
                    ].map((field) => (
                      <div key={field.key}>
                        <div className="flex items-center gap-4">
                          <input
                            type="checkbox"
                            checked={selectedFields[field.key] || false}
                            onChange={(e) => {
                              setSelectedFields({
                                ...selectedFields,
                                [field.key]: e.target.checked,
                              });
                            }}
                            className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                          />
                          <label
                            className="w-32 text-sm font-medium text-gray-700"
                            style={{ fontFamily: "'Roboto', sans-serif" }}
                          >
                            {field.label}
                          </label>
                          <select
                            value={fieldMapping[field.key] || ""}
                            onChange={(e) => {
                              setFieldMapping({
                                ...fieldMapping,
                                [field.key]: e.target.value,
                              });
                            }}
                            className="flex-1 px-3 py-2 text-gray-700  border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                            style={{ fontFamily: "'Roboto', sans-serif" }}
                          >
                            <option value="">Select CSV column...</option>
                            {csvColumns
                              .filter((col) => {
                                const currentSelected = fieldMapping[field.key];
                                if (col === currentSelected) return true;
                                return !Object.entries(fieldMapping).some(
                                  ([key, value]) =>
                                    key !== field.key && value === col
                                );
                              })
                              .sort((a, b) => {
                                const currentSelected = fieldMapping[field.key];
                                if (a === currentSelected) return -1;
                                if (b === currentSelected) return 1;
                                return a.localeCompare(b);
                              })
                              .map((col) => (
                                <option key={col} value={col}>
                                  {col}
                                </option>
                              ))}
                          </select>
                          <button
                            onClick={() => {
                              const currentMerged =
                                mergedFields[field.key] || [];
                              if (currentMerged.length === 0) {
                                setMergedFields({
                                  ...mergedFields,
                                  [field.key]: [""],
                                });
                              }
                            }}
                            className="px-2 py-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                            title="Merge with another column"
                          >
                            <i className="fi flex fi-rr-plus text-sm"></i>
                          </button>
                        </div>
                        {mergedFields[field.key] &&
                          mergedFields[field.key].length > 0 && (
                            <div className="ml-36 space-y-2 mt-2">
                              {mergedFields[field.key].map(
                                (mergedCol, mergeIndex) => (
                                  <div
                                    key={mergeIndex}
                                    className="flex items-center gap-2"
                                  >
                                    <span className="text-xs text-gray-500">
                                      +
                                    </span>
                                    <select
                                      value={mergedCol}
                                      onChange={(e) => {
                                        const updated = [
                                          ...mergedFields[field.key],
                                        ];
                                        updated[mergeIndex] = e.target.value;
                                        setMergedFields({
                                          ...mergedFields,
                                          [field.key]: updated,
                                        });
                                      }}
                                      className="flex-1 px-3 py-2 text-gray-700 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                                      style={{
                                        fontFamily: "'Roboto', sans-serif",
                                      }}
                                    >
                                      <option value="">
                                        Select column to merge...
                                      </option>
                                      {csvColumns
                                        .filter((col) => {
                                          if (col === fieldMapping[field.key])
                                            return false;
                                          const selectedInPredefined =
                                            Object.entries(fieldMapping).some(
                                              ([key, value]) =>
                                                key !== field.key &&
                                                value === col
                                            );
                                          const selectedInCustom =
                                            customFields.some(
                                              (cf) => cf.mappedTo === col
                                            );
                                          const selectedInOtherMerged =
                                            Object.entries(mergedFields).some(
                                              ([key, values]) =>
                                                key !== field.key &&
                                                values.includes(col)
                                            );
                                          const selectedInSameMerged =
                                            mergedFields[field.key]?.some(
                                              (val, idx) =>
                                                idx !== mergeIndex &&
                                                val === col
                                            );
                                          return (
                                            !selectedInPredefined &&
                                            !selectedInCustom &&
                                            !selectedInOtherMerged &&
                                            !selectedInSameMerged
                                          );
                                        })
                                        .sort((a, b) => a.localeCompare(b))
                                        .map((col) => (
                                          <option key={col} value={col}>
                                            {col}
                                          </option>
                                        ))}
                                    </select>
                                    <button
                                      onClick={() => {
                                        const updated = mergedFields[
                                          field.key
                                        ].filter(
                                          (_, idx) => idx !== mergeIndex
                                        );
                                        if (updated.length === 0) {
                                          const newMerged = { ...mergedFields };
                                          delete newMerged[field.key];
                                          setMergedFields(newMerged);
                                        } else {
                                          setMergedFields({
                                            ...mergedFields,
                                            [field.key]: updated,
                                          });
                                        }
                                      }}
                                      className="text-red-500 hover:text-red-700"
                                    >
                                      <i className="fi flex fi-rr-cross text-sm"></i>
                                    </button>
                                  </div>
                                )
                              )}
                              {mergedFields[field.key] &&
                                mergedFields[field.key].length > 0 && (
                                  <button
                                    onClick={() => {
                                      setMergedFields({
                                        ...mergedFields,
                                        [field.key]: [
                                          ...mergedFields[field.key],
                                          "",
                                        ],
                                      });
                                    }}
                                    className="text-xs text-purple-600 hover:text-purple-700 flex items-center gap-1"
                                  >
                                    <i className="fi flex fi-rr-plus text-xs"></i>
                                    <span>Add another column</span>
                                  </button>
                                )}
                            </div>
                          )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Custom Fields */}
              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h3
                    className="text-sm font-semibold text-gray-700"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  >
                    Custom Fields
                  </h3>
                  <button
                    onClick={() => {
                      const newField = {
                        id: Date.now().toString(),
                        name: "",
                        mappedTo: "",
                      };
                      setCustomFields([...customFields, newField]);
                    }}
                    className="px-3 py-1.5 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                    style={{ fontFamily: "'Roboto', sans-serif" }}
                  >
                    <i className="fi flex fi-rr-plus text-xs"></i>
                    <span>Add Custom Field</span>
                  </button>
                </div>

                {customFields.map((customField, index) => (
                  <div key={customField.id} className="flex items-center gap-4">
                    <input
                      type="checkbox"
                      checked={
                        selectedFields[`custom_${customField.id}`] || false
                      }
                      onChange={(e) => {
                        setSelectedFields({
                          ...selectedFields,
                          [`custom_${customField.id}`]: e.target.checked,
                        });
                      }}
                      className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                    />
                    <input
                      type="text"
                      placeholder="Field name"
                      value={customField.name}
                      onChange={(e) => {
                        const updated = [...customFields];
                        updated[index].name = e.target.value;
                        setCustomFields(updated);
                      }}
                      className="w-32 px-3 py-2 border text-gray-700 border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                      style={{ fontFamily: "'Roboto', sans-serif" }}
                    />
                    <select
                      value={customField.mappedTo}
                      onChange={(e) => {
                        const updated = [...customFields];
                        const newMappedTo = e.target.value;
                        updated[index].mappedTo = newMappedTo;
                        // Auto-set field name to column name if name is empty or matches previous mappedTo
                        if (
                          !updated[index].name ||
                          updated[index].name === customField.mappedTo
                        ) {
                          updated[index].name = newMappedTo || "";
                        }
                        setCustomFields(updated);
                      }}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none text-gray-700  focus:ring-2 focus:ring-purple-500"
                      style={{ fontFamily: "'Roboto', sans-serif" }}
                    >
                      <option value="">Select CSV column...</option>
                      {csvColumns
                        .filter((col) => {
                          // Show current selected column, hide others that are selected
                          const currentSelected = customField.mappedTo;
                          if (col === currentSelected) return true;
                          // Hide if selected in predefined fields or other custom fields
                          const selectedInPredefined =
                            Object.values(fieldMapping).includes(col);
                          const selectedInOtherCustom = customFields.some(
                            (cf) =>
                              cf.id !== customField.id && cf.mappedTo === col
                          );
                          return (
                            !selectedInPredefined && !selectedInOtherCustom
                          );
                        })
                        .sort((a, b) => {
                          const currentSelected = customField.mappedTo;
                          // Currently selected column first
                          if (a === currentSelected) return -1;
                          if (b === currentSelected) return 1;
                          // Then sort alphabetically
                          return a.localeCompare(b);
                        })
                        .map((col) => (
                          <option key={col} value={col}>
                            {col}
                          </option>
                        ))}
                    </select>
                    <button
                      onClick={() => {
                        const updatedFields = customFields.filter(
                          (f) => f.id !== customField.id
                        );
                        setCustomFields(updatedFields);
                        // Remove checkbox state for deleted custom field
                        const updatedSelected = { ...selectedFields };
                        delete updatedSelected[`custom_${customField.id}`];
                        setSelectedFields(updatedSelected);
                      }}
                      className="text-red-500 hover:text-red-700"
                    >
                      <i className="fi flex fi-rr-cross text-sm"></i>
                    </button>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => {
                    setShowMappingModal(false);
                    setFieldMapping({});
                    setCustomFields([]);
                    setSelectedFields({
                      name: true,
                      phone: true,
                      sum_insured: false,
                      premium: false,
                      company: false,
                      expiry_date: false,
                    });
                  }}
                  className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors"
                  style={{ fontFamily: "'Roboto', sans-serif" }}
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    // Validate required fields
                    const requiredFields = ["name", "phone"];
                    const missingFields = requiredFields.filter(
                      (field) => !fieldMapping[field]
                    );
                    if (missingFields.length > 0) {
                      setImportError(
                        `Please map required fields: ${missingFields.join(
                          ", "
                        )}`
                      );
                      return;
                    }

                    if (!selectedCampaignId) {
                      setImportError("Please select a campaign for this import.");
                      return;
                    }

                    setShowMappingModal(false);
                    setImportError("");
                    // Start upload process
                    await uploadCustomersToSupabase();
                  }}
                  className="px-6 py-2 bg-[#4b33e8] hover:bg-[#3d28b8] text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                  style={{ fontFamily: "'Roboto', sans-serif" }}
                  disabled={importing}
                >
                  {importing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <>
                      <i className="fi flex fi-rr-check"></i>
                      <span>Confirm Mapping</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Customer Details Modal */}
      {showCustomerDetailsModal && selectedCustomer && (
        <div className="fixed inset-0 backdrop-blur-lg flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
              <h2
                className="text-xl font-bold"
                style={{
                  color: "#263238",
                  fontFamily: "'Poppins', sans-serif",
                }}
              >
                Customer Details
              </h2>
              <button
                onClick={() => {
                  setShowCustomerDetailsModal(false);
                  setSelectedCustomer(null);
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <i className="fi flex fi-rr-cross text-xl"></i>
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {/* Basic Information */}
              <div className="mb-6">
                <h3
                  className="text-lg font-semibold mb-4"
                  style={{
                    color: "#263238",
                    fontFamily: "'Poppins', sans-serif",
                  }}
                >
                  Basic Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      className="text-xs font-medium text-gray-500 block mb-1"
                      style={{ fontFamily: "'Roboto', sans-serif" }}
                    >
                      Customer Name
                    </label>
                    <p
                      className="text-sm text-gray-900"
                      style={{ fontFamily: "'Roboto', sans-serif" }}
                    >
                      {selectedCustomer.customer_name || "N/A"}
                    </p>
                  </div>
                  <div>
                    <label
                      className="text-xs font-medium text-gray-500 block mb-1"
                      style={{ fontFamily: "'Roboto', sans-serif" }}
                    >
                      Phone Number
                    </label>
                    <p
                      className="text-sm text-gray-900"
                      style={{ fontFamily: "'Roboto', sans-serif" }}
                    >
                      {selectedCustomer.phone_no || "N/A"}
                    </p>
                  </div>
                  <div>
                    <label
                      className="text-xs font-medium text-gray-500 block mb-1"
                      style={{ fontFamily: "'Roboto', sans-serif" }}
                    >
                      Lead ID
                    </label>
                    <p
                      className="text-sm text-gray-900"
                      style={{ fontFamily: "'Roboto', sans-serif" }}
                    >
                      {selectedCustomer.lead_id || "N/A"}
                    </p>
                  </div>
                  <div>
                    <label
                      className="text-xs font-medium text-gray-500 block mb-1"
                      style={{ fontFamily: "'Roboto', sans-serif" }}
                    >
                      Expiry Date
                    </label>
                    <p
                      className="text-sm text-gray-900"
                      style={{ fontFamily: "'Roboto', sans-serif" }}
                    >
                      {selectedCustomer.expiry_date
                        ? formatDate(selectedCustomer.expiry_date)
                        : "N/A"}
                    </p>
                  </div>
                  <div>
                    <label
                      className="text-xs font-medium text-gray-500 block mb-1"
                      style={{ fontFamily: "'Roboto', sans-serif" }}
                    >
                      Assigned To
                    </label>
                    <p
                      className="text-sm text-gray-900"
                      style={{ fontFamily: "'Roboto', sans-serif" }}
                    >
                      {selectedCustomer.assigned_user_name ||
                        selectedCustomer.assigned_employee_id ||
                        "N/A"}
                    </p>
                  </div>
                  <div>
                    <label
                      className="text-xs font-medium text-gray-500 block mb-1"
                      style={{ fontFamily: "'Roboto', sans-serif" }}
                    >
                      Managed By
                    </label>
                    <div className="flex flex-col">
                      <p
                        className="text-sm font-semibold text-gray-900"
                        style={{ fontFamily: "'Roboto', sans-serif" }}
                      >
                        {selectedCustomer.managed_by_name || "Self"}
                      </p>
                      {selectedCustomer.managed_by_id && (
                        <p
                          className="text-[10px] text-gray-400"
                          style={{ fontFamily: "'Roboto', sans-serif" }}
                        >
                          ID: {selectedCustomer.managed_by_id}
                        </p>
                      )}
                    </div>
                  </div>
                  <div>
                    <label
                      className="text-xs font-medium text-gray-500 block mb-1"
                      style={{ fontFamily: "'Roboto', sans-serif" }}
                    >
                      Status
                    </label>
                    <div className="inline-flex items-center gap-2">
                      <div
                        className={`px-2.5 py-1 rounded-full inline-flex items-center gap-1.5 ${selectedCustomer.status === "active"
                          ? "bg-green-100"
                          : selectedCustomer.status === "inactive"
                            ? "bg-gray-100"
                            : "bg-orange-100"
                          }`}
                      >
                        <div
                          className={`w-1.5 h-1.5 rounded-full ${selectedCustomer.status === "active"
                            ? "bg-green-500"
                            : selectedCustomer.status === "inactive"
                              ? "bg-gray-400"
                              : "bg-orange-400"
                            }`}
                        ></div>
                        <span
                          className={`text-xs font-semibold ${selectedCustomer.status === "active"
                            ? "text-green-700"
                            : selectedCustomer.status === "inactive"
                              ? "text-gray-600"
                              : "text-orange-700"
                            }`}
                        >
                          {selectedCustomer.status === "active"
                            ? "Active"
                            : selectedCustomer.status === "inactive"
                              ? "Inactive"
                              : "Pending"}
                        </span>
                      </div>
                    </div>
                  </div>
                  {selectedCustomer.campaign_id && (
                    <div>
                      <label
                        className="text-xs font-medium text-gray-500 block mb-1"
                        style={{ fontFamily: "'Roboto', sans-serif" }}
                      >
                        Campaign ID
                      </label>
                      <p
                        className="text-sm text-gray-900"
                        style={{ fontFamily: "'Roboto', sans-serif" }}
                      >
                        {selectedCustomer.campaign_id}
                      </p>
                    </div>
                  )}
                  {selectedCustomer.utilities && (
                    <div>
                      <label
                        className="text-xs font-medium text-gray-500 block mb-1"
                        style={{ fontFamily: "'Roboto', sans-serif" }}
                      >
                        Utilities
                      </label>
                      <p
                        className="text-sm text-gray-900"
                        style={{ fontFamily: "'Roboto', sans-serif" }}
                      >
                        {selectedCustomer.utilities}
                      </p>
                    </div>
                  )}
                  {/* Checked fields from customer_details */}
                  {selectedCustomer.customer_details &&
                    (() => {
                      try {
                        const details = JSON.parse(
                          selectedCustomer.customer_details
                        );
                        const checkedFields = Object.entries(details)
                          .filter(([key]) => key.endsWith("_checked"))
                          .map(([key, value]) => ({
                            fieldName: key.replace("_checked", ""),
                            value: String(value),
                          }));

                        return checkedFields.map((field) => (
                          <div key={field.fieldName}>
                            <label
                              className="text-xs font-medium text-gray-500 block mb-1"
                              style={{ fontFamily: "'Roboto', sans-serif" }}
                            >
                              {field.fieldName}
                            </label>
                            <p
                              className="text-sm text-gray-900"
                              style={{ fontFamily: "'Roboto', sans-serif" }}
                            >
                              {field.value}
                            </p>
                          </div>
                        ));
                      } catch (e) {
                        return null;
                      }
                    })()}
                </div>
              </div>

              {/* Policy Details (Unchecked fields from JSON) */}
              {selectedCustomer.customer_details &&
                (() => {
                  try {
                    const details = JSON.parse(
                      selectedCustomer.customer_details
                    );
                    const uncheckedFields = Object.entries(details).filter(
                      ([key]) => key.endsWith("_unchecked")
                    );

                    if (uncheckedFields.length === 0) return null;

                    return (
                      <div className="mb-6">
                        <h3
                          className="text-lg font-semibold mb-4"
                          style={{
                            color: "#263238",
                            fontFamily: "'Poppins', sans-serif",
                          }}
                        >
                          Policy Details
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {uncheckedFields.map(([key, value]) => {
                            const displayKey = key.replace("_unchecked", "");
                            return (
                              <div key={key}>
                                <label
                                  className="text-xs font-medium text-gray-500 block mb-1"
                                  style={{ fontFamily: "'Roboto', sans-serif" }}
                                >
                                  {displayKey}
                                </label>
                                <p
                                  className="text-sm text-gray-900"
                                  style={{ fontFamily: "'Roboto', sans-serif" }}
                                >
                                  {String(value)}
                                </p>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  } catch (e) {
                    return null;
                  }
                })()}

              {/* Additional Information */}
              <div className="mb-6">
                <h3
                  className="text-lg font-semibold mb-4"
                  style={{
                    color: "#263238",
                    fontFamily: "'Poppins', sans-serif",
                  }}
                >
                  Additional Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      className="text-xs font-medium text-gray-500 block mb-1"
                      style={{ fontFamily: "'Roboto', sans-serif" }}
                    >
                      Created Date
                    </label>
                    <p
                      className="text-sm text-gray-900"
                      style={{ fontFamily: "'Roboto', sans-serif" }}
                    >
                      {formatDate(selectedCustomer.created_at)}
                    </p>
                  </div>
                  <div>
                    <label
                      className="text-xs font-medium text-gray-500 block mb-1"
                      style={{ fontFamily: "'Roboto', sans-serif" }}
                    >
                      Last Updated
                    </label>
                    <p
                      className="text-sm text-gray-900"
                      style={{ fontFamily: "'Roboto', sans-serif" }}
                    >
                      {formatDate(selectedCustomer.updated_at)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Close Button */}
              <div className="flex justify-end pt-4 border-t border-gray-200">
                <button
                  onClick={() => {
                    setShowCustomerDetailsModal(false);
                    setSelectedCustomer(null);
                  }}
                  className="px-6 py-2 bg-[#4b33e8] hover:bg-[#3d28b8] text-white rounded-lg text-sm font-medium transition-colors"
                  style={{ fontFamily: "'Roboto', sans-serif" }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Navigation for Mobile */}
      <BottomNav activeNav="customer" userRole={user?.role || null} />
    </div>
  );
}
