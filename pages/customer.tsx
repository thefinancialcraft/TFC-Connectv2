import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import AppLayout, { useUser } from "../components/AppLayout";
import { supabase } from "../lib/supabase";
import ImportCustomersModal from "../components/ImportCustomersModal";

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
  organization_id?: string | null;
  organization_name?: string | null;
}


export default function Customer() {
  const router = useRouter();
  const { user, mounted } = useUser();
  
  const [activeNav] = useState("customer");
  const [allCustomers, setAllCustomers] = useState<Customer[]>([]);
  const [loadingCustomers, setLoadingCustomers] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [freshCustomersCount, setFreshCustomersCount] = useState(0);
  const [pageSize, setPageSize] = useState<number | "all">(100);
  const [viewType, setViewType] = useState<"grid" | "list">("list");
  const [showImportModal, setShowImportModal] = useState(false);
  const [showCustomerDetailsModal, setShowCustomerDetailsModal] =
    useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const [selectedCustomers, setSelectedCustomers] = useState<Set<string>>(
    new Set()
  );
  const [isDeleting, setIsDeleting] = useState(false);




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

        // Fetch organization names separately
        const organizationIds = [
          ...new Set(
            (data || [])
              .map((c: any) => c.organization_id)
              .filter((id: string | null) => id)
          ),
        ];

        let organizationMap: Record<string, string> = {};

        if (organizationIds.length > 0) {
          const { data: orgData } = await supabase
            .from("organizations")
            .select("id, company_name")
            .in("id", organizationIds);

          if (orgData) {
            orgData.forEach((org) => {
              organizationMap[org.id] = org.company_name;
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
          organization_name: customer.organization_id
            ? organizationMap[customer.organization_id] || null
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


  useEffect(() => {
    if (user || mounted) {
      fetchCustomers(1);
    }

    // Refresh data when page comes into focus
    const handleFocus = () => {
      fetchCustomers(currentPage);
    };

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [user, mounted]);

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





  return (
    <AppLayout>
      <Head>
        <title>Customers | TFC Connect</title>
      </Head>

        {/* Main Content */}

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
                                <th className="px-4 py-4 text-[10px] font-medium text-gray-400 uppercase tracking-widest text-center">
                                  Status
                                </th>
                                 <th className="px-4 py-4 text-[10px] font-medium text-gray-400 uppercase tracking-widest">
                                  Campaign
                                </th>
                                <th className="px-4 py-4 text-[10px] font-medium text-gray-400 uppercase tracking-widest">
                                  Organization
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
                                    <div className="flex items-center gap-2">
                                      <i className="fi flex fi-rr-building text-[#4b33e8] text-xs"></i>
                                      <span
                                        className="text-[12px] font-medium text-gray-700"
                                        style={{
                                          fontFamily: "'Roboto', sans-serif",
                                        }}
                                      >
                                        {customer.organization_name || "N/A"}
                                      </span>
                                    </div>
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
                          <div className="space-y-3 text-xs mt-4">
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
                              <i className="fi flex fi-rr-bullhorn text-[10px]"></i>
                              <span
                                className="truncate"
                                style={{ fontFamily: "'Roboto', sans-serif" }}
                              >
                                {customer.campaign_name || "N/A"}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                              <i className="fi flex fi-rr-building text-[10px]"></i>
                              <span
                                className="truncate"
                                style={{ fontFamily: "'Roboto', sans-serif" }}
                              >
                                {customer.organization_name || "N/A"}
                              </span>
                            </div>
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

                            <div className="flex items-center justify-between pt-2 border-t border-gray-50 mt-2">
                              <div
                                className={`px-2 py-0.5 rounded-full inline-flex items-center gap-1 ${
                                  customer.status === "active"
                                    ? "bg-green-100"
                                    : customer.status === "inactive"
                                    ? "bg-gray-100"
                                    : "bg-orange-100"
                                }`}
                              >
                                <div
                                  className={`w-1 h-1 rounded-full ${
                                    customer.status === "active"
                                      ? "bg-green-500"
                                      : customer.status === "inactive"
                                      ? "bg-gray-400"
                                      : "bg-orange-400"
                                  }`}
                                ></div>
                                <span
                                  className={`text-[10px] font-semibold ${
                                    customer.status === "active"
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

                              {customer.expiry_date && (
                                <div className="flex items-center gap-2 text-gray-400">
                                  <i className="fi flex fi-rr-calendar text-[10px]"></i>
                                  <span
                                    style={{ fontFamily: "'Roboto', sans-serif" }}
                                  >
                                    {formatDate(customer.expiry_date)}
                                  </span>
                                </div>
                              )}
                            </div>

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
                                      className="flex items-center gap-2 text-gray-500 pt-1"
                                    >
                                      <i className="fi flex fi-rr-check text-[10px] text-green-500"></i>
                                      <span
                                        className="truncate"
                                        style={{
                                          fontFamily: "'Roboto', sans-serif",
                                        }}
                                        title={`${field.fieldName}: ${field.value}`}
                                      >
                                        <span className="font-medium text-gray-700">
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


      {/* Reusable Import Customers Modal */}
      <ImportCustomersModal
        show={showImportModal}
        onClose={() => setShowImportModal(false)}
        onSuccess={() => fetchCustomers(1)}
      />

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

    </AppLayout>
  );
}
