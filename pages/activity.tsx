import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { checkAuthAndFetchProfile, handleLogout, UserProfile } from "../lib/authService";
import { supabase } from "../lib/supabase";
import { getStoredUserData, storeUserData } from "../lib/localStorageUtils";
import BottomNav from "../components/BottomNav";

export default function Activity() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(() => {
    const cachedData = getStoredUserData();
    if (cachedData) {
      return {
        uid: cachedData.user_id || '',
        displayName: cachedData.user_name || cachedData.displayName || null,
        email: cachedData.email || '',
        phone: null,
        providers: [],
        providerType: null,
        createdAt: '',
        lastSignInAt: null,
        employeeId: cachedData.employee_id || null,
        role: cachedData.role || null,
        approvalStatus: null,
        accountStatus: null,
        updatedAt: null,
        profilePicUrl: cachedData.profile_pic_url || null,
      };
    }
    return null;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeNav, setActiveNav] = useState("activity");
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState("");

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
      const { data: { session } } = await supabase.auth.getSession();
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
            latestUserData = {
              ...profileData.user,
              profilePicUrl: profileData.user.profile_pic_url || null,
            };
            
            if (profileData.user.profile_complete === false) {
              router.push("/profile-completion");
              return;
            }
          }
        } catch (err) {
          console.error('Error fetching latest profile:', err);
        }
      }

      setUser(prevUser => {
        if (!prevUser) {
          if (latestUserData.uid) {
            const cachedData = getStoredUserData();
            const userDataToStore = {
              user_id: latestUserData.uid,
              email: latestUserData.email || '',
              user_name: latestUserData.displayName || cachedData?.user_name || '',
              employee_id: latestUserData.employeeId || cachedData?.employee_id || '',
              role: latestUserData.role || cachedData?.role || 'user',
              profile_pic_url: latestUserData.profilePicUrl || null,
              displayName: latestUserData.displayName || undefined,
              session_token: cachedData?.session_token,
              refresh_token: cachedData?.refresh_token,
            };
            storeUserData(userDataToStore);
          }
          return latestUserData;
        }
        
        const hasChanged = 
          prevUser.displayName !== latestUserData.displayName ||
          prevUser.employeeId !== latestUserData.employeeId ||
          prevUser.email !== latestUserData.email ||
          prevUser.approvalStatus !== latestUserData.approvalStatus ||
          prevUser.accountStatus !== latestUserData.accountStatus ||
          prevUser.role !== latestUserData.role ||
          prevUser.phone !== latestUserData.phone ||
          prevUser.profilePicUrl !== latestUserData.profilePicUrl;
        
        if (hasChanged) {
          if (latestUserData.uid) {
            const cachedData = getStoredUserData();
            const userDataToStore = {
              user_id: latestUserData.uid,
              email: latestUserData.email || '',
              user_name: latestUserData.displayName || cachedData?.user_name || '',
              employee_id: latestUserData.employeeId || cachedData?.employee_id || '',
              role: latestUserData.role || cachedData?.role || 'user',
              profile_pic_url: latestUserData.profilePicUrl || null,
              displayName: latestUserData.displayName || undefined,
              session_token: cachedData?.session_token,
              refresh_token: cachedData?.refresh_token,
            };
            storeUserData(userDataToStore);
          }
          return latestUserData;
        }
        
        return prevUser;
      });

      if (latestUserData.approvalStatus === 'rejected') {
        router.push("/rejected");
        return;
      } else if (latestUserData.approvalStatus === 'pending') {
        router.push("/pending");
        return;
      } else if (latestUserData.approvalStatus === 'suspend' || latestUserData.accountStatus === 'suspend') {
        router.push("/suspended");
        return;
      } else if (latestUserData.approvalStatus === 'hold' || latestUserData.accountStatus === 'hold') {
        router.push("/hold");
        return;
      }
    }
  };

  useEffect(() => {
    fetchAuth();
    
    const handleFocus = () => {
      fetchAuth();
    };
    
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [router]);

  const handleLogoutClick = async () => {
    await handleLogout(router);
  };

  const formatDisplayDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'short', year: 'numeric' };
    return date.toLocaleDateString('en-GB', options);
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days = [];
    for (let i = 0; i < startingDayOfWeek; i++) {
      const prevMonthDay = new Date(year, month, -startingDayOfWeek + i + 1);
      days.push({ date: prevMonthDay, isCurrentMonth: false });
    }
    
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({ date: new Date(year, month, i), isCurrentMonth: true });
    }
    
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push({ date: new Date(year, month + 1, i), isCurrentMonth: false });
    }
    
    return days;
  };

  const formatMonthYear = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const isSameDay = (date1: Date, date2: string) => {
    const d2 = new Date(date2);
    return date1.getDate() === d2.getDate() &&
           date1.getMonth() === d2.getMonth() &&
           date1.getFullYear() === d2.getFullYear();
  };

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const handleDateSelect = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    setSelectedDate(`${year}-${month}-${day}`);
    setShowDatePicker(false);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ backgroundColor: "#f6f5f7" }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-transparent mx-auto mb-4" style={{ borderColor: '#4b33e8' }}></div>
          <div className="text-lg" style={{ color: "#4b33e8" }}>Loading...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ backgroundColor: "#f6f5f7" }}>
        <div className="text-center">
          <div className="text-lg mb-4 text-red-500">{error}</div>
          <div className="text-sm" style={{ color: "#4b33e8" }}>Redirecting to login...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full overflow-x-hidden" style={{ backgroundColor: "#f6f5f7", maxWidth: "100vw" }}>
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

      <div className="flex-1 flex flex-col lg:ml-56 w-full min-w-0 overflow-x-hidden">
        <Header
          user={{
            displayName: user?.displayName || null,
            email: user?.email || "",
            employeeId: user?.employeeId || null,
            profilePicUrl: user?.profilePicUrl || null,
          }}
          onLogout={handleLogoutClick}
        />

        <main className="flex-1 overflow-y-auto overflow-x-hidden min-w-0 max-w-full pt-[60px] lg:pt-[60px]" style={{ backgroundColor: "#f6f5f7" }}>
          <div className="container mx-auto px-3 sm:px-4 md:px-6 py-6 sm:py-8 pb-20 sm:pb-24 lg:pb-8 max-w-7xl">
            <div className="space-y-6 sm:space-y-8">
              <div className="mb-6 flex items-start justify-between">
                <div>
                  <h1
                    className="text-xl sm:text-2xl md:text-3xl font-bold mb-2"
                    style={{
                      color: "#263238",
                      fontFamily: "'Poppins', sans-serif",
                    }}
                  >
                    Activity
                  </h1>
                  <p
                    className="text-sm sm:text-base"
                    style={{
                      color: "#787E9D",
                      fontFamily: "'Roboto', sans-serif",
                    }}
                  >
                    Track your calling activities and performance metrics
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
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
                  <div className="absolute top-0 left-0 w-32 h-32 rounded-full bg-purple-200/20 blur-xl" />
                  <div className="absolute top-8 right-8 w-16 h-16 rounded-full bg-purple-300/15 blur-lg" />
                  <div className="absolute -right-2 -bottom-2 opacity-5">
                    <i
                      className="fi flex fi-rr-phone-call text-5xl sm:text-6xl"
                      style={{ color: "#4b33e8" }}
                    ></i>
                  </div>
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
                        Total Dials
                      </p>
                      <div
                        className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl"
                        style={{
                          backgroundColor: "transparent",
                        }}
                      >
                        <i
                          className="fi flex fi-rr-phone-call text-lg sm:text-xl"
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
                        0
                      </p>
                      <p
                        className="text-xs sm:text-sm mt-1"
                        style={{
                          color: "#787E9D",
                          fontFamily: "'Roboto', sans-serif",
                        }}
                      >
                        Total calls made
                      </p>
                    </div>
                  </div>
                </div>

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
                  <div className="absolute top-0 left-0 w-32 h-32 rounded-full bg-green-200/20 blur-xl" />
                  <div className="absolute top-8 right-8 w-16 h-16 rounded-full bg-green-300/15 blur-lg" />
                  <div className="absolute -right-2 -bottom-2 opacity-5">
                    <i
                      className="fi flex fi-rr-clock text-5xl sm:text-6xl"
                      style={{ color: "#10b981" }}
                    ></i>
                  </div>
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
                        Total Talk Time
                      </p>
                      <div
                        className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl"
                        style={{
                          backgroundColor: "transparent",
                        }}
                      >
                        <i
                          className="fi flex fi-rr-clock text-lg sm:text-xl"
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
                        00:00
                      </p>
                      <p
                        className="text-xs sm:text-sm mt-1"
                        style={{
                          color: "#787E9D",
                          fontFamily: "'Roboto', sans-serif",
                        }}
                      >
                        HH:MM
                      </p>
                    </div>
                  </div>
                </div>

                <div
                  className="relative p-0 flex flex-col overflow-hidden"
                  style={{ backgroundColor: "transparent", border: "none" }}
                >
                  <div className="grid grid-cols-2 gap-3 h-full">
                    <div
                      className="relative overflow-hidden rounded-xl p-3 transition-shadow duration-200 hover:shadow-md"
                      style={{
                        background: "linear-gradient(135deg, #10b981, #059669)",
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
                      <div className="absolute top-2 left-2 w-16 h-16 rounded-full bg-white/8 blur-lg" />
                      <div className="absolute -right-1 -bottom-1 opacity-10">
                        <i className="fi flex fi-rr-check-circle text-3xl text-white"></i>
                      </div>
                      <div
                        className="absolute inset-0 opacity-[0.08]"
                        style={{
                          backgroundImage:
                            "radial-gradient(circle, rgba(255,255,255,0.4) 1px, transparent 1px)",
                          backgroundSize: "15px 15px",
                        }}
                      />
                      <div className="relative flex flex-col justify-between h-full z-10">
                        <div className="flex items-start justify-end mb-1">
                          <i
                            className="fi flex fi-rr-check-circle text-base sm:text-lg"
                            style={{ color: "#ffffff" }}
                          ></i>
                        </div>
                        <div>
                          <p
                            className="text-xl sm:text-2xl font-bold mb-1"
                            style={{
                              color: "#ffffff",
                              fontFamily: "'Poppins', sans-serif",
                            }}
                          >
                            0
                          </p>
                          <p
                            className="text-[10px] sm:text-xs font-medium"
                            style={{
                              color: "#ffffff",
                              fontFamily: "'Roboto', sans-serif",
                            }}
                          >
                            Contactable
                          </p>
                        </div>
                      </div>
                    </div>

                    <div
                      className="relative overflow-hidden rounded-xl p-3 transition-shadow duration-200 hover:shadow-md"
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
                      <div className="absolute top-2 left-2 w-16 h-16 rounded-full bg-white/8 blur-lg" />
                      <div className="absolute -right-1 -bottom-1 opacity-10">
                        <i className="fi flex fi-rr-cross-circle text-3xl text-white"></i>
                      </div>
                      <div
                        className="absolute inset-0 opacity-[0.08]"
                        style={{
                          backgroundImage:
                            "radial-gradient(circle, rgba(255,255,255,0.4) 1px, transparent 1px)",
                          backgroundSize: "15px 15px",
                        }}
                      />
                      <div className="relative flex flex-col justify-between h-full z-10">
                        <div className="flex items-start justify-end mb-1">
                          <i
                            className="fi flex fi-rr-cross-circle text-base sm:text-lg"
                            style={{ color: "#ffffff" }}
                          ></i>
                        </div>
                        <div>
                          <p
                            className="text-xl sm:text-2xl font-bold mb-1"
                            style={{
                              color: "#ffffff",
                              fontFamily: "'Poppins', sans-serif",
                            }}
                          >
                            0
                          </p>
                          <p
                            className="text-[10px] sm:text-xs font-medium"
                            style={{
                              color: "#ffffff",
                              fontFamily: "'Roboto', sans-serif",
                            }}
                          >
                            Uncontactable
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  className="relative p-0 flex flex-col overflow-hidden"
                  style={{ backgroundColor: "transparent", border: "none" }}
                >
                  <div className="grid grid-cols-2 gap-3 h-full">
                    <div
                      className="relative overflow-hidden rounded-xl p-3 transition-shadow duration-200 hover:shadow-md"
                      style={{
                        background: "linear-gradient(135deg, #f59e0b, #d97706)",
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
                      <div className="absolute top-2 left-2 w-16 h-16 rounded-full bg-white/8 blur-lg" />
                      <div className="absolute -right-1 -bottom-1 opacity-10">
                        <i className="fi flex fi-rr-time-forward text-3xl text-white"></i>
                      </div>
                      <div
                        className="absolute inset-0 opacity-[0.08]"
                        style={{
                          backgroundImage:
                            "radial-gradient(circle, rgba(255,255,255,0.4) 1px, transparent 1px)",
                          backgroundSize: "15px 15px",
                        }}
                      />
                      <div className="relative flex flex-col justify-between h-full z-10">
                        <div className="flex items-start justify-end mb-1">
                          <i
                            className="fi flex fi-rr-time-forward text-base sm:text-lg"
                            style={{ color: "#ffffff" }}
                          ></i>
                        </div>
                        <div>
                          <p
                            className="text-xs sm:text-sm font-bold mb-1"
                            style={{
                              color: "#ffffff",
                              fontFamily: "'Poppins', sans-serif",
                            }}
                          >
                            N/A
                          </p>
                          <p
                            className="text-[10px] sm:text-xs font-medium"
                            style={{
                              color: "#ffffff",
                              fontFamily: "'Roboto', sans-serif",
                            }}
                          >
                            Idle From
                          </p>
                        </div>
                      </div>
                    </div>

                    <div
                      className="relative overflow-hidden rounded-xl p-3 transition-shadow duration-200 hover:shadow-md"
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
                      <div className="absolute top-2 left-2 w-16 h-16 rounded-full bg-white/8 blur-lg" />
                      <div className="absolute -right-1 -bottom-1 opacity-10">
                        <i className="fi flex fi-rr-phone-pause text-3xl text-white"></i>
                      </div>
                      <div
                        className="absolute inset-0 opacity-[0.08]"
                        style={{
                          backgroundImage:
                            "radial-gradient(circle, rgba(255,255,255,0.4) 1px, transparent 1px)",
                          backgroundSize: "15px 15px",
                        }}
                      />
                      <div className="relative flex flex-col justify-between h-full z-10">
                        <div className="flex items-start justify-end mb-1">
                          <i
                            className="fi flex fi-rr-phone-pause text-base sm:text-lg"
                            style={{ color: "#ffffff" }}
                          ></i>
                        </div>
                        <div>
                          <p
                            className="text-xs sm:text-sm font-bold mb-1"
                            style={{
                              color: "#ffffff",
                              fontFamily: "'Poppins', sans-serif",
                            }}
                          >
                            N/A
                          </p>
                          <p
                            className="text-[10px] sm:text-xs font-medium"
                            style={{
                              color: "#ffffff",
                              fontFamily: "'Roboto', sans-serif",
                            }}
                          >
                            Last Call At
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
                  <div className="mb-4 sm:hidden">
                    <div className="flex items-center justify-between mb-2">
                      <h2
                        className="text-lg font-bold"
                        style={{
                          color: "#263238",
                          fontFamily: "'Poppins', sans-serif",
                        }}
                      >
                        Activity Details
                      </h2>
                      <div className="relative">
                        <button
                          onClick={() => setShowDatePicker(!showDatePicker)}
                          className="px-3 py-1.5 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-gray-700 hover:border-purple-400 transition-colors flex items-center gap-2"
                          style={{ fontFamily: "'Roboto', sans-serif" }}
                        >
                          <i className="fi flex fi-rr-calendar text-xs" style={{ color: "#4b33e8" }}></i>
                          <span>{formatDisplayDate(selectedDate)}</span>
                        </button>
                        {showDatePicker && (
                          <div className="absolute right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl p-4 z-50 w-72">
                            <div className="flex items-center justify-between mb-4">
                              <button
                                onClick={handlePrevMonth}
                                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                              >
                                <i className="fi flex fi-rr-angle-left text-sm" style={{ color: "#263238" }}></i>
                              </button>
                              <span className="text-sm font-semibold" style={{ color: "#263238", fontFamily: "'Poppins', sans-serif" }}>
                                {formatMonthYear(currentMonth)}
                              </span>
                              <button
                                onClick={handleNextMonth}
                                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                              >
                                <i className="fi flex fi-rr-angle-right text-sm" style={{ color: "#263238" }}></i>
                              </button>
                            </div>
                            <div className="grid grid-cols-7 gap-1 mb-2">
                              {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
                                <div key={day} className="text-center text-xs font-medium py-2" style={{ color: "#787E9D", fontFamily: "'Roboto', sans-serif" }}>
                                  {day}
                                </div>
                              ))}
                            </div>
                            <div className="grid grid-cols-7 gap-1">
                              {getDaysInMonth(currentMonth).map((day, index) => {
                                const isSelected = isSameDay(day.date, selectedDate);
                                return (
                                  <button
                                    key={index}
                                    onClick={() => handleDateSelect(day.date)}
                                    className={`text-xs py-2 rounded-lg transition-all ${
                                      isSelected
                                        ? 'text-white font-semibold'
                                        : day.isCurrentMonth
                                        ? 'text-gray-700 hover:bg-gray-100'
                                        : 'text-gray-400'
                                    }`}
                                    style={{
                                      backgroundColor: isSelected ? '#4b33e8' : 'transparent',
                                      fontFamily: "'Roboto', sans-serif"
                                    }}
                                  >
                                    {day.date.getDate()}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                      
                    </div>
                     <p
                      className="text-xs mb-3"
                      style={{
                        color: "#787E9D",
                        fontFamily: "'Roboto', sans-serif",
                      }}
                    >
                      Detailed view of all employee activities
                    </p>
                    <div className="mb-3 flex items-center gap-2">
                      <div className="relative flex-1">
                        <i className="fi flex  fi-rr-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xs"></i>
                        <input
                          type="text"
                          placeholder="Search activities..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full pl-9 h-9 pr-4 py-2 text-xs border border-gray-300 text-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          style={{ fontFamily: "'Roboto', sans-serif" }}
                        />
                      </div>
                      <button
                        className="h-9 px-3 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors flex items-center justify-center"
                        style={{ fontFamily: "'Roboto', sans-serif" }}
                      >
                        <i className="fi flex fi-rr-filter text-sm text-gray-600"></i>
                      </button>
                    </div>
                   
                  </div>

                  <div className="hidden sm:flex sm:items-center sm:justify-between mb-6">
                    <div>
                      <h2
                        className="text-xl font-bold mb-1"
                        style={{
                          color: "#263238",
                          fontFamily: "'Poppins', sans-serif",
                        }}
                      >
                        Activity Details
                      </h2>
                      <p
                        className="text-sm"
                        style={{
                          color: "#787E9D",
                          fontFamily: "'Roboto', sans-serif",
                        }}
                      >
                        Detailed view of all employee activities
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="relative w-64">
                        <i className="fi flex fi-rr-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm"></i>
                        <input
                          type="text"
                          placeholder="Search activities..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 text-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          style={{ fontFamily: "'Roboto', sans-serif" }}
                        />
                      </div>
                      <button
                        className="h-10 px-3 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors flex items-center justify-center"
                        style={{ fontFamily: "'Roboto', sans-serif" }}
                      >
                        <i className="fi flex fi-rr-filter text-sm text-gray-600"></i>
                      </button>
                      <div className="relative">
                        <button
                          onClick={() => setShowDatePicker(!showDatePicker)}
                          className="pl-5 pr-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-gray-700 hover:border-purple-400 transition-colors flex items-center gap-2 w-38"
                          style={{ fontFamily: "'Roboto', sans-serif" }}
                        >
                          <i className="fi flex fi-rr-calendar absolute top-1/2 transform -translate-y-1/2 text-sm" style={{ color: "#4b33e8" }}></i>
                          <span className="ml-6">{formatDisplayDate(selectedDate)}</span>
                        </button>
                        {showDatePicker && (
                          <div className="absolute right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl p-4 z-50 w-80">
                            <div className="flex items-center justify-between mb-4">
                              <button
                                onClick={handlePrevMonth}
                                className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                              >
                                <i className="fi flex fi-rr-angle-left text-base" style={{ color: "#263238" }}></i>
                              </button>
                              <span className="text-sm font-semibold" style={{ color: "#263238", fontFamily: "'Poppins', sans-serif" }}>
                                {formatMonthYear(currentMonth)}
                              </span>
                              <button
                                onClick={handleNextMonth}
                                className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                              >
                                <i className="fi flex fi-rr-angle-right text-base" style={{ color: "#263238" }}></i>
                              </button>
                            </div>
                            <div className="grid grid-cols-7 gap-1 mb-2">
                              {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
                                <div key={day} className="text-center text-xs font-medium py-2" style={{ color: "#787E9D", fontFamily: "'Roboto', sans-serif" }}>
                                  {day}
                                </div>
                              ))}
                            </div>
                            <div className="grid grid-cols-7 gap-1">
                              {getDaysInMonth(currentMonth).map((day, index) => {
                                const isSelected = isSameDay(day.date, selectedDate);
                                return (
                                  <button
                                    key={index}
                                    onClick={() => handleDateSelect(day.date)}
                                    className={`text-sm py-2.5 rounded-lg transition-all ${
                                      isSelected
                                        ? 'text-white font-semibold'
                                        : day.isCurrentMonth
                                        ? 'text-gray-700 hover:bg-gray-100'
                                        : 'text-gray-400'
                                    }`}
                                    style={{
                                      backgroundColor: isSelected ? '#4b33e8' : 'transparent',
                                      fontFamily: "'Roboto', sans-serif"
                                    }}
                                  >
                                    {day.date.getDate()}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="px-2 md:px-6 py-3 md:py-4 text-left text-[10px] md:text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[100px] md:min-w-[120px]">
                            Emp. ID
                          </th>
                          <th className="px-2 md:px-6 py-3 md:py-4 text-left text-[10px] md:text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[150px] md:min-w-[180px]">
                            Emp Name
                          </th>
                          <th className="px-2 md:px-6 py-3 md:py-4 text-left text-[10px] md:text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[150px] md:min-w-[180px]">
                            Customer
                          </th>
                          <th className="px-2 md:px-6 py-3 md:py-4 text-left text-[10px] md:text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[120px] md:min-w-[150px]">
                            Callback
                          </th>
                          <th className="px-2 md:px-6 py-3 md:py-4 text-left text-[10px] md:text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[120px] md:min-w-[150px]">
                            Campaign
                          </th>
                          <th className="px-2 md:px-6 py-3 md:py-4 text-left text-[10px] md:text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[120px] md:min-w-[150px]">
                            Last Call
                          </th>
                          <th className="px-2 md:px-6 py-3 md:py-4 text-left text-[10px] md:text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[100px] md:min-w-[120px]">
                            Talk Time
                          </th>
                          <th className="px-2 md:px-6 py-3 md:py-4 text-left text-[10px] md:text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[100px] md:min-w-[120px]">
                            Dialed
                          </th>
                          <th className="px-2 md:px-6 py-3 md:py-4 text-left text-[10px] md:text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[150px] md:min-w-[200px]">
                            Remark
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        <tr>
                          <td colSpan={9} className="px-6 py-12 text-center">
                            <div className="flex flex-col items-center justify-center">
                              <div className="flex h-16 w-16 items-center justify-center rounded-full mx-auto mb-4" style={{ background: "linear-gradient(to bottom right, rgba(75, 51, 232, 0.1), rgba(75, 51, 232, 0.05))" }}>
                                <i className="fi flex fi-rr-time-past text-3xl" style={{ color: "#4b33e8" }}></i>
                              </div>
                              <h3 className="text-lg font-semibold mb-2" style={{ color: "#263238", fontFamily: "'Poppins', sans-serif" }}>
                                No Activity Data
                              </h3>
                              <p className="text-sm" style={{ color: "#787E9D", fontFamily: "'Roboto', sans-serif" }}>
                                Activity records will appear here once employees start making calls.
                              </p>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <BottomNav activeNav="activity" userRole={user?.role || null} />
    </div>
  );
}
