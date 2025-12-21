import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import UserMenuDropdown from "../components/UserMenuDropdown";
import { checkAuthAndFetchProfile, handleLogout, UserProfile } from "../lib/authService";
import { getStoredUserData, storeUserData } from "../lib/localStorageUtils";
import { supabase } from "../lib/supabase";

interface UserStats {
  activeUsers: number;
  totalUsers: number;
  inactiveUsers: number;
  approved: number;
  pending: number;
  hold: number;
  suspend: number;
  totalSalary: number;
  averageSalary: number;
}

interface PendingUser {
  id: string;
  user_id: string;
  user_name: string | null;
  email: string | null;
  profile_pic_url: string | null;
  date_of_joining: string | null;
  employee_id: string | null;
  created_at: string | null;
}

interface AllUser {
  id: string;
  user_id: string;
  email: string | null;
  user_name: string | null;
  contact_no: string | null;
  employee_id: string | null;
  role: string | null;
  status: string | null;
  approval_status: string | null;
  super_admin: boolean | null;
  father_name: string | null;
  gender: string | null;
  pan_number: string | null;
  aadhar_card_no: string | null;
  date_of_birth: string | null;
  date_of_joining: string | null;
  in_hand_salary: number | null;
  alternate_contact: string | null;
  primary_address: string | null;
  area_pincode: string | null;
  bank_name: string | null;
  account_holder_name: string | null;
  account_number: string | null;
  ifsc_code: string | null;
  branch_pincode: string | null;
  branch_state: string | null;
  branch_city: string | null;
  blood_group: string | null;
  emergency_contact_no: string | null;
  profile_pic_url: string | null;
  pancard_url: string | null;
  aadhar_front_url: string | null;
  aadhar_back_url: string | null;
  qualification_marksheet_url: string | null;
  bank_passbook_url: string | null;
  profile_complete: boolean | null;
  created_at: string | null;
  updated_at: string | null;
  hold_start_date: string | null;
  hold_end_date: string | null;
  status_reason: string | null;
  user_type: string | null;
  work_type: string | null;
  department: string | null;
}

export default function Users() {
  const router = useRouter();
  // Initialize with null to avoid SSR hydration mismatch, then load from localStorage on client
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeNav, setActiveNav] = useState("users");
  const [userStats, setUserStats] = useState<UserStats>({
    activeUsers: 0,
    totalUsers: 0,
    inactiveUsers: 0,
    approved: 0,
    pending: 0,
    hold: 0,
    suspend: 0,
    totalSalary: 0,
    averageSalary: 0,
  });
  const [loadingStats, setLoadingStats] = useState(true);
  const [animatedStats, setAnimatedStats] = useState<UserStats>({
    activeUsers: 0,
    totalUsers: 0,
    inactiveUsers: 0,
    approved: 0,
    pending: 0,
    hold: 0,
    suspend: 0,
    totalSalary: 0,
    averageSalary: 0,
  });
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);
  const [loadingPendingUsers, setLoadingPendingUsers] = useState(true);
  const [viewType, setViewType] = useState<"grid" | "list">("grid");
  const [allUsers, setAllUsers] = useState<AllUser[]>([]);
  const [loadingAllUsers, setLoadingAllUsers] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [menuPosition, setMenuPosition] = useState<{ top: number; right: number } | null>(null);
  const menuRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const buttonRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});
  const [openApprovalDropdown, setOpenApprovalDropdown] = useState<string | null>(null);
  const [openWorkTypeDropdown, setOpenWorkTypeDropdown] = useState<string | null>(null);
  const [openUserTypeDropdown, setOpenUserTypeDropdown] = useState<string | null>(null);
  const [openRoleDropdown, setOpenRoleDropdown] = useState<string | null>(null);
  const [openDepartmentDropdown, setOpenDepartmentDropdown] = useState<string | null>(null);

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
          }
        } catch (err) {
          console.error('Error fetching latest profile:', err);
        }
      }

      setUser(prevUser => {
        if (!prevUser) {
          // Update localStorage with the new user data (including profile_pic_url)
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
          // Update localStorage with the new user data (including profile_pic_url)
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
    }
  };

  const fetchUserStats = async () => {
    try {
      setLoadingStats(true);
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        setLoadingStats(false);
        return;
      }

      // Fetch all users from user_profiles table
      const { data: allUsers, error: fetchError } = await supabase
        .from('user_profiles')
        .select('status, approval_status, in_hand_salary');

      if (fetchError) {
        console.error('Error fetching user stats:', fetchError);
        setLoadingStats(false);
        return;
      }

      if (allUsers) {
        const salaries = allUsers
          .map(u => parseFloat(u.in_hand_salary || '0'))
          .filter(s => !isNaN(s) && s > 0);
        const totalSalary = salaries.reduce((sum, s) => sum + s, 0);
        const averageSalary = salaries.length > 0 ? totalSalary / salaries.length : 0;

        const stats: UserStats = {
          activeUsers: allUsers.filter(u => u.status === 'active').length,
          totalUsers: allUsers.length,
          inactiveUsers: allUsers.filter(u => u.status !== 'active').length,
          approved: allUsers.filter(u => u.approval_status === 'approved').length,
          pending: allUsers.filter(u => u.approval_status === 'pending').length,
          hold: allUsers.filter(u => u.approval_status === 'hold').length,
          suspend: allUsers.filter(u => u.approval_status === 'suspend').length,
          totalSalary: totalSalary,
          averageSalary: averageSalary,
        };

        setUserStats(stats);
        
        // Animate numbers
        animateNumbers(stats);
      }
    } catch (err) {
      console.error('Error fetching user stats:', err);
    } finally {
      setLoadingStats(false);
    }
  };

  const animateNumbers = (targetStats: UserStats) => {
    const duration = 1000; // 1 second
    const steps = 60;
    const stepDuration = duration / steps;
    
    Object.keys(targetStats).forEach((key) => {
      const targetValue = targetStats[key as keyof UserStats];
      let currentValue = animatedStats[key as keyof UserStats];
      const increment = targetValue / steps;
      
      const interval = setInterval(() => {
        currentValue += increment;
        if (currentValue >= targetValue) {
          currentValue = targetValue;
          clearInterval(interval);
        }
        
        setAnimatedStats(prev => ({
          ...prev,
          [key]: key === 'totalSalary' || key === 'averageSalary' ? currentValue : Math.floor(currentValue)
        }));
      }, stepDuration);
    });
  };

  const generateNextEmployeeId = async (): Promise<string> => {
    try {
      // Fetch all employee_ids that match TFC-XXX pattern
      const { data, error } = await supabase
        .from('user_profiles')
        .select('employee_id')
        .not('employee_id', 'is', null)
        .like('employee_id', 'TFC-%');

      if (error) {
        console.error('Error fetching employee IDs:', error);
        // If error, start from TFC-001
        return 'TFC-001';
      }

      if (!data || data.length === 0) {
        // No existing employee IDs, start from TFC-001
        return 'TFC-001';
      }

      // Extract numeric parts and find the maximum
      const numbers = data
        .map(item => {
          const empId = item.employee_id;
          if (!empId || !empId.startsWith('TFC-')) return 0;
          const numPart = empId.replace('TFC-', '');
          const num = parseInt(numPart, 10);
          return isNaN(num) ? 0 : num;
        })
        .filter(num => num > 0);

      if (numbers.length === 0) {
        return 'TFC-001';
      }

      const maxNumber = Math.max(...numbers);
      const nextNumber = maxNumber + 1;
      
      // Format with zero padding (e.g., 1 -> 001, 12 -> 012, 123 -> 123)
      const paddedNumber = nextNumber.toString().padStart(3, '0');
      return `TFC-${paddedNumber}`;
    } catch (err) {
      console.error('Error generating employee ID:', err);
      // On error, start from TFC-001
      return 'TFC-001';
    }
  };

  const fetchPendingUsers = async () => {
    try {
      setLoadingPendingUsers(true);
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        setLoadingPendingUsers(false);
        return;
      }

      const { data, error } = await supabase
        .from('user_profiles')
        .select('id, user_id, user_name, email, profile_pic_url, date_of_joining, employee_id, created_at')
        .eq('approval_status', 'pending')
        .order('date_of_joining', { ascending: false });

      if (error) {
        console.error('Error fetching pending users:', error);
      } else {
        setPendingUsers(data || []);
      }
    } catch (err) {
      console.error('Error fetching pending users:', err);
    } finally {
      setLoadingPendingUsers(false);
    }
  };

  const fetchAllUsers = async () => {
    try {
      setLoadingAllUsers(true);
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        setLoadingAllUsers(false);
        return;
      }

      // First, check current user's profile to see their role
      const { data: currentUserData } = await supabase
        .from('user_profiles')
        .select('role, super_admin, user_id, email')
        .eq('user_id', session.user.id)
        .single();
      
      console.log('Current user profile:', currentUserData);
      console.log('Current user role:', currentUserData?.role);
      console.log('Current user super_admin:', currentUserData?.super_admin);

      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .order('date_of_joining', { ascending: false });

      if (error) {
        console.error('Error fetching all users:', error);
        console.error('Error details:', JSON.stringify(error, null, 2));
        console.error('Error code:', error.code);
        console.error('Error message:', error.message);
        setAllUsers([]);
      } else {
        console.log('Fetched all users from user page:', data);
        console.log('Total users fetched:', data?.length || 0);
        console.log('User IDs fetched:', data?.map((u: any) => ({ id: u.id, user_id: u.user_id, email: u.email })));
        // Map the data to match our interface
        const mappedData = (data || []).map((user: any) => ({
          ...user,
          user_name: user.user_name || user.name || null,
          profile_pic_url: user.profile_pic_url || user.profile_image || null,
        }));
        setAllUsers(mappedData);
      }
    } catch (err) {
      console.error('Error fetching all users:', err);
    } finally {
      setLoadingAllUsers(false);
    }
  };

  // Initialize client-side and load from localStorage
  useEffect(() => {
    setIsClient(true);
    setMounted(true);
    // Load cached data from localStorage on client-side only
    const cachedData = getStoredUserData();
    if (cachedData) {
      setUser({
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
      });
    }
  }, []);

  useEffect(() => {
    if (!isClient) return; // Wait for client-side hydration
    
    fetchAuth();
    fetchUserStats();
    fetchPendingUsers();
    fetchAllUsers();
    
    const handleFocus = () => {
      fetchAuth();
      fetchUserStats();
      fetchPendingUsers();
      fetchAllUsers();
    };
    
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [router, isClient]);

  // Close menu and dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      
      // Check if any menu or dropdown is open
      if (openMenuId || openApprovalDropdown || openWorkTypeDropdown || openUserTypeDropdown) {
        if (openMenuId) {
          const menuElement = menuRefs.current[openMenuId];
          const buttonElement = buttonRefs.current[openMenuId];
          
          // Check if click is inside main menu container or button
          const isInsideMenu = menuElement && menuElement.contains(target);
          const isInsideButton = buttonElement && buttonElement.contains(target);
          
          // If click is outside both menu and button, close everything
          if (!isInsideMenu && !isInsideButton) {
            setOpenMenuId(null);
            setMenuPosition(null);
            setOpenApprovalDropdown(null);
            setOpenWorkTypeDropdown(null);
            setOpenUserTypeDropdown(null);
          }
        } else {
          // If main menu is closed but nested dropdowns might still be open, close them
          setOpenApprovalDropdown(null);
          setOpenWorkTypeDropdown(null);
          setOpenUserTypeDropdown(null);
          setOpenRoleDropdown(null);
          setOpenDepartmentDropdown(null);
        }
      }
    };

    // Add event listener
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openMenuId, openApprovalDropdown, openWorkTypeDropdown, openUserTypeDropdown, openRoleDropdown, openDepartmentDropdown]);

  // Close menu when viewType changes
  useEffect(() => {
    setOpenMenuId(null);
    setMenuPosition(null);
  }, [viewType]);

  // Disable body scroll when menu is open
  useEffect(() => {
    if (openMenuId) {
      // Disable scroll
      document.body.style.overflow = 'hidden';
    } else {
      // Enable scroll
      document.body.style.overflow = '';
    }

    return () => {
      // Cleanup: re-enable scroll when component unmounts or menu closes
      document.body.style.overflow = '';
    };
  }, [openMenuId]);

  // Update menu position on scroll/resize when menu is open
  useEffect(() => {
    if (!openMenuId || !menuPosition || viewType !== "list") return;

    const updatePosition = () => {
      const buttonId = openMenuId;
      const button = buttonRefs.current[buttonId];
      if (button) {
        const rect = button.getBoundingClientRect();
        const menuHeight = 400; // Approximate menu height (increased for dropdowns)
        const spaceBelow = window.innerHeight - rect.bottom;
        const spaceAbove = rect.top;
        
        // Position menu above if not enough space below, but enough space above
        const shouldPositionAbove = spaceBelow < menuHeight && spaceAbove > menuHeight;
        
        setMenuPosition({
          top: shouldPositionAbove ? rect.top - menuHeight - 8 : rect.bottom + 8,
          right: window.innerWidth - rect.right
        });
      }
    };

    window.addEventListener('scroll', updatePosition, true);
    window.addEventListener('resize', updatePosition);

    return () => {
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
    };
  }, [openMenuId, menuPosition, viewType]);

  const handleStatusChange = async (userId: string, approvalStatus: 'approved' | 'pending' | 'hold' | 'suspend' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({ approval_status: approvalStatus })
        .eq('id', userId);

      if (error) throw error;

      // Refresh data
      await fetchAllUsers();
      await fetchPendingUsers();
      await fetchUserStats();
      setOpenApprovalDropdown(null);
    } catch (error) {
      console.error('Error updating approval status:', error);
      alert('Failed to update approval status');
    }
  };

  const getApprovalStatusLabel = (status: string | null) => {
    switch (status) {
      case 'approved': return 'Approved User';
      case 'pending': return 'Pending';
      case 'hold': return 'Hold';
      case 'suspend': return 'Suspended';
      case 'rejected': return 'Rejected';
      default: return 'Pending';
    }
  };

  const getWorkTypeLabel = (workType: string | null) => {
    switch (workType) {
      case 'on_site': return 'On Site';
      case 'remote': return 'Remote';
      default: return 'On Site';
    }
  };

  const getUserTypeLabel = (userType: string | null) => {
    switch (userType) {
      case 'employee': return 'Employee';
      case 'posp_agent': return 'Posp Agent';
      default: return 'Employee';
    }
  };

  const getRoleLabel = (role: string | null) => {
    switch (role) {
      case 'user': return 'User';
      case 'manager': return 'Manager';
      case 'facility_staff': return 'Facility Staff';
      case 'admin': return 'Admin';
      case 'super_admin': return 'Super Admin';
      default: return 'User';
    }
  };

  const getDepartmentLabel = (department: string | null) => {
    switch (department) {
      case 'sales': return 'Sales';
      case 'renewal': return 'Renewal';
      case 'backend': return 'Backend';
      case 'management': return 'Management';
      case 'service': return 'Service';
      default: return 'Sales';
    }
  };

  const handleUserStatusChange = async (userId: string, status: 'active' | 'inactive') => {
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({ status: status })
        .eq('id', userId);

      if (error) throw error;

      // Refresh data
      await fetchAllUsers();
      await fetchUserStats();
    } catch (error) {
      console.error('Error updating user status:', error);
      alert('Failed to update user status');
    }
  };

  const handleWorkTypeChange = async (userId: string, workType: 'remote' | 'on_site') => {
    try {
      console.log('Updating work_type:', { userId, workType });
      const { data, error } = await supabase
        .from('user_profiles')
        .update({ 
          work_type: workType,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select();

      if (error) {
        console.error('Supabase error updating work type:', error);
        throw error;
      }

      console.log('Successfully updated work_type:', data);

      // Refresh data
      await fetchAllUsers();
      setOpenWorkTypeDropdown(null);
    } catch (error: any) {
      console.error('Error updating work type:', error);
      alert(`Failed to update work type: ${error?.message || error}`);
    }
  };

  const handleUserTypeChange = async (userId: string, userType: 'employee' | 'posp_agent') => {
    try {
      console.log('Updating user_type:', { userId, userType });
      const { data, error } = await supabase
        .from('user_profiles')
        .update({ 
          user_type: userType,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select();

      if (error) {
        console.error('Supabase error updating user type:', error);
        throw error;
      }

      console.log('Successfully updated user_type:', data);

      // Refresh data
      await fetchAllUsers();
      setOpenUserTypeDropdown(null);
    } catch (error: any) {
      console.error('Error updating user type:', error);
      alert(`Failed to update user type: ${error?.message || error}`);
    }
  };

  const handleRoleChange = async (userId: string, role: 'user' | 'manager' | 'facility_staff' | 'admin' | 'super_admin') => {
    try {
      console.log('Updating role:', { userId, role });
      const { data, error } = await supabase
        .from('user_profiles')
        .update({ 
          role: role,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select();

      if (error) {
        console.error('Supabase error updating role:', error);
        throw error;
      }

      console.log('Successfully updated role:', data);

      // Refresh data
      await fetchAllUsers();
      setOpenRoleDropdown(null);
    } catch (error: any) {
      console.error('Error updating role:', error);
      alert(`Failed to update role: ${error?.message || error}`);
    }
  };

  const handleDepartmentChange = async (userId: string, department: 'sales' | 'renewal' | 'backend' | 'management' | 'service') => {
    try {
      console.log('Updating department:', { userId, department });
      const { data, error } = await supabase
        .from('user_profiles')
        .update({ 
          department: department,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select();

      if (error) {
        console.error('Supabase error updating department:', error);
        throw error;
      }

      console.log('Successfully updated department:', data);

      // Refresh data
      await fetchAllUsers();
      setOpenDepartmentDropdown(null);
    } catch (error: any) {
      console.error('Error updating department:', error);
      alert(`Failed to update department: ${error?.message || error}`);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('user_profiles')
        .delete()
        .eq('id', userId);

      if (error) throw error;

      // Refresh data
      await fetchAllUsers();
      await fetchUserStats();
      await fetchPendingUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Failed to delete user');
    }
  };

  const handleLogoutClick = async () => {
    await handleLogout(router);
  };

  // Get current date for display
  const getCurrentDate = () => {
    if (!mounted) return ''; // Return empty string during SSR
    const date = new Date();
    const day = date.getDate().toString().padStart(2, '0');
    const month = date.toLocaleString('en-US', { month: 'short' });
    return `${day} ${month}`;
  };

  // Format date safely for SSR (only format on client)
  const formatDate = (dateString: string | null) => {
    if (!mounted || !dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
    } catch (e) {
      return 'N/A';
    }
  };

  // Format date with year first (for pending users)
  const formatDateWithYear = (dateString: string | null) => {
    if (!mounted || !dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    } catch (e) {
      return 'N/A';
    }
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
        <main className="flex-1 overflow-y-auto overflow-x-hidden min-w-0 max-w-full pt-[60px] lg:pt-[60px]" style={{ backgroundColor: "#f6f5f7" }}>
          <div className="container mx-auto px-3 sm:px-4 md:px-6 py-6 sm:py-8 pb-20 sm:pb-24 lg:pb-8 max-w-7xl">
            <div className="space-y-6 sm:space-y-8">
              {/* Page Header */}
              <div className="mb-6">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2" style={{ color: "#263238", fontFamily: "'Poppins', sans-serif" }}>
                  Users
                </h1>
                <p className="text-sm sm:text-base" style={{ color: "#787E9D", fontFamily: "'Roboto', sans-serif" }}>
                  View and manage all users in the system
                </p>
              </div>

              {/* Modern Card Design Tiles */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
                {/* First Tile - Active Users */}
                <div className="rounded-2xl p-3 sm:p-4 border-[1.8px] border-dashed border-gray-400 transition-shadow duration-200 flex flex-col" style={{ backgroundColor: "#f6f5f7" }}>
                  <div className="flex items-start justify-between mb-1">
                    <div className="flex-1">
                      <h2 className="text-sm sm:text-base font-bold mb-0.5" style={{ color: "#263238", fontFamily: "'Poppins', sans-serif" }}>
                        Active Users
                      </h2>
                      <div className="flex items-center gap-1.5 mb-1">
                        <div className="flex items-center justify-center w-6 h-6 rounded-lg bg-white">
                          <i className="fi flex fi-rr-calendar text-xs" style={{ color: "#787E9D" }}></i>
                        </div>
                        <span className="text-[10px] sm:text-xs" style={{ color: "#787E9D", fontFamily: "'Roboto', sans-serif" }}>
                          {getCurrentDate()} update
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-center w-9 h-9 rounded-lg">
                      <i className="fi flex fi-rr-users text-base" style={{ color: "#10B981" }}></i>
                    </div>
                  </div>
                  
                  {loadingStats ? (
                    <div className="animate-pulse">
                      <div className="h-8 bg-gray-200 rounded-lg w-16 mb-2"></div>
                      <div className="flex gap-1.5">
                        <div className="h-7 w-7 bg-gray-200 rounded-full"></div>
                        <div className="h-7 w-7 bg-gray-200 rounded-full"></div>
                        <div className="h-7 w-7 bg-gray-200 rounded-full"></div>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-auto">
                      <p className="text-lg sm:text-xl font-bold mb-1" style={{ color: "#263238", fontFamily: "'Poppins', sans-serif" }}>
                        {animatedStats.activeUsers}
                      </p>
                      <div className="flex items-center gap-1.5">
                        <div className="flex -space-x-1.5">
                          {allUsers.filter(u => u.status === 'active').slice(0, 3).map((user, index) => (
                            user.profile_pic_url ? (
                              <img
                                key={user.id}
                                src={user.profile_pic_url}
                                alt={user.user_name || 'User'}
                                className="w-7 h-7 rounded-full border-2 border-white object-cover"
                              />
                            ) : (
                              <div
                                key={user.id}
                                className="w-7 h-7 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-semibold text-white"
                                style={{
                                  background: `linear-gradient(135deg, ${['#10B981', '#3B82F6', '#8B5CF6'][index]} 0%, ${['#059669', '#2563EB', '#7C3AED'][index]} 100%)`
                                }}
                              >
                                {user.user_name ? user.user_name.charAt(0).toUpperCase() : 'U'}
                              </div>
                            )
                          ))}
                        </div>
                        {animatedStats.activeUsers > 3 && (
                          <div className="w-7 h-7 rounded-full border-2 border-white bg-white flex items-center justify-center text-[10px] font-semibold" style={{ color: "#263238", fontFamily: "'Roboto', sans-serif" }}>
                            +{animatedStats.activeUsers - 3}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Second Tile - Total Users */}
                <div className="rounded-2xl p-3 sm:p-4 border-[1.8px] border-dashed border-gray-400 transition-shadow duration-200 flex flex-col" style={{ backgroundColor: "#f6f5f7" }}>
                  <div className="flex items-start justify-between mb-1">
                    <div className="flex-1">
                      <h2 className="text-sm sm:text-base font-bold mb-0.5" style={{ color: "#263238", fontFamily: "'Poppins', sans-serif" }}>
                        Total Users
                      </h2>
                      <div className="flex items-center gap-1.5 mb-1">
                        <div className="flex items-center justify-center w-6 h-6 rounded-lg bg-white">
                          <i className="fi flex fi-rr-calendar text-xs" style={{ color: "#787E9D" }}></i>
                        </div>
                        <span className="text-[10px] sm:text-xs" style={{ color: "#787E9D", fontFamily: "'Roboto', sans-serif" }}>
                          {getCurrentDate()} update
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-center w-9 h-9 rounded-lg">
                      <i className="fi flex fi-rr-chart-line-up text-base" style={{ color: "#3B82F6" }}></i>
                    </div>
                  </div>
                  
                  {loadingStats ? (
                    <div className="animate-pulse">
                      <div className="h-8 bg-gray-200 rounded-lg w-16 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-24"></div>
                    </div>
                  ) : (
                    <div className="mt-auto">
                      <p className="text-lg sm:text-xl font-bold mb-1" style={{ color: "#263238", fontFamily: "'Poppins', sans-serif" }}>
                        {animatedStats.totalUsers}
                      </p>
                      <div className="flex items-center gap-1.5 justify-between">
                        <div className="flex items-center gap-1.5">
                          <div className="flex -space-x-1.5">
                            {allUsers.slice(0, 3).map((user, index) => (
                              user.profile_pic_url ? (
                                <img
                                  key={user.id}
                                  src={user.profile_pic_url}
                                  alt={user.user_name || 'User'}
                                  className="w-7 h-7 rounded-full border-2 border-white object-cover"
                                />
                              ) : (
                                <div
                                  key={user.id}
                                  className="w-7 h-7 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-semibold text-white"
                                  style={{
                                    background: `linear-gradient(135deg, ${['#3B82F6', '#8B5CF6', '#EC4899'][index]} 0%, ${['#2563EB', '#7C3AED', '#DB2777'][index]} 100%)`
                                  }}
                                >
                                  {user.user_name ? user.user_name.charAt(0).toUpperCase() : 'U'}
                                </div>
                              )
                            ))}
                          </div>
                          {animatedStats.totalUsers > 3 && (
                            <div className="w-7 h-7 rounded-full border-2 border-white bg-white flex items-center justify-center text-[10px] font-semibold" style={{ color: "#263238", fontFamily: "'Roboto', sans-serif" }}>
                              +{animatedStats.totalUsers - 3}
                            </div>
                          )}
                        </div>
                        <p className="text-[10px] sm:text-xs" style={{ color: "#787E9D", fontFamily: "'Roboto', sans-serif" }}>
                          Inactive: <span className="font-semibold" style={{ color: "#EF4444" }}>{animatedStats.inactiveUsers}</span>
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Third Tile - Approval Status (Sub-tiles only) */}
                {loadingStats ? (
                  <div className="grid grid-cols-2 gap-2 sm:gap-3 md:col-span-2 lg:col-span-1">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-20 bg-gray-200 rounded-xl"></div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2 sm:gap-2.5 md:col-span-2 lg:col-span-1">
                    {/* Approved */}
                    <div className="rounded-tl-xl rounded-tr-xl rounded-bl-xl pl-3 pr-1.5 py-1.5 sm:pl-4 sm:pr-2 sm:py-2 border-[1.8px] border-gray-300 flex flex-col bg-white">
                        <p className="text-[9px] sm:text-[10px] font-semibold mb-0.5 uppercase tracking-wide" style={{ color: "#787E9D", fontFamily: "'Roboto', sans-serif" }}>
                          Approved
                        </p>
                        <div className="mt-auto flex flex-col">
                          <div className="flex -space-x-1.5 mb-0.5">
                          {allUsers.filter(u => u.approval_status === 'approved').slice(0, 2).map((user, index) => (
                            user.profile_pic_url ? (
                              <img
                                key={user.id}
                                src={user.profile_pic_url}
                                alt={user.user_name || 'User'}
                                className="w-5 h-5 rounded-full border-2 border-white object-cover"
                              />
                            ) : (
                              <div
                                key={user.id}
                                className="w-5 h-5 rounded-full border-2 border-white flex items-center justify-center text-[9px] font-semibold text-white bg-green-500"
                              >
                                {user.user_name ? user.user_name.charAt(0).toUpperCase() : 'U'}
                              </div>
                            )
                          ))}
                          {animatedStats.approved > 2 && (
                            <div className="w-5 h-5 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-[9px] font-semibold" style={{ color: "#263238" }}>
                              +{animatedStats.approved - 2}
                            </div>
                          )}
                          </div>
                          <p className="text-base sm:text-lg font-bold" style={{ color: "#10B981", fontFamily: "'Poppins', sans-serif" }}>
                            {animatedStats.approved}
                          </p>
                        </div>
                      </div>

                      {/* Pending */}
                      <div className="rounded-xl pl-3 pr-1.5 py-1.5 sm:pl-4 sm:pr-2 sm:py-2 border-[1.8px] border-gray-300 flex flex-col bg-white">
                        <p className="text-[9px] sm:text-[10px] font-semibold mb-0.5 uppercase tracking-wide" style={{ color: "#787E9D", fontFamily: "'Roboto', sans-serif" }}>
                          Pending
                        </p>
                        <div className="mt-auto flex flex-col">
                          <div className="flex -space-x-1.5 mb-0.5">
                          {allUsers.filter(u => u.approval_status === 'pending').slice(0, 2).map((user, index) => (
                            user.profile_pic_url ? (
                              <img
                                key={user.id}
                                src={user.profile_pic_url}
                                alt={user.user_name || 'User'}
                                className="w-5 h-5 rounded-full border-2 border-white object-cover"
                              />
                            ) : (
                              <div
                                key={user.id}
                                className="w-5 h-5 rounded-full border-2 border-white flex items-center justify-center text-[9px] font-semibold text-white bg-amber-500"
                              >
                                {user.user_name ? user.user_name.charAt(0).toUpperCase() : 'U'}
                              </div>
                            )
                          ))}
                          {animatedStats.pending > 2 && (
                            <div className="w-5 h-5 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-[9px] font-semibold" style={{ color: "#263238" }}>
                              +{animatedStats.pending - 2}
                            </div>
                          )}
                          </div>
                          <p className="text-base sm:text-lg font-bold" style={{ color: "#F59E0B", fontFamily: "'Poppins', sans-serif" }}>
                            {animatedStats.pending}
                          </p>
                        </div>
                      </div>

                      {/* Hold */}
                      <div className="rounded-xl pl-3 pr-1.5 py-1.5 sm:pl-4 sm:pr-2 sm:py-2 border-[1.8px] border-gray-300 flex flex-col bg-white">
                        <p className="text-[9px] sm:text-[10px] font-semibold mb-0.5 uppercase tracking-wide" style={{ color: "#787E9D", fontFamily: "'Roboto', sans-serif" }}>
                          Hold
                        </p>
                        <div className="mt-auto flex flex-col">
                          <div className="flex -space-x-1.5 mb-0.5">
                          {allUsers.filter(u => u.approval_status === 'hold').slice(0, 2).map((user, index) => (
                            user.profile_pic_url ? (
                              <img
                                key={user.id}
                                src={user.profile_pic_url}
                                alt={user.user_name || 'User'}
                                className="w-5 h-5 rounded-full border-2 border-white object-cover"
                              />
                            ) : (
                              <div
                                key={user.id}
                                className="w-5 h-5 rounded-full border-2 border-white flex items-center justify-center text-[9px] font-semibold text-white bg-orange-500"
                              >
                                {user.user_name ? user.user_name.charAt(0).toUpperCase() : 'U'}
                              </div>
                            )
                          ))}
                          {animatedStats.hold > 2 && (
                            <div className="w-5 h-5 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-[9px] font-semibold" style={{ color: "#263238" }}>
                              +{animatedStats.hold - 2}
                            </div>
                          )}
                          </div>
                          <p className="text-base sm:text-lg font-bold" style={{ color: "#F97316", fontFamily: "'Poppins', sans-serif" }}>
                            {animatedStats.hold}
                          </p>
                        </div>
                      </div>

                      {/* Suspend */}
                      <div className="rounded-tr-xl rounded-br-xl rounded-bl-xl pl-3 pr-1.5 py-1.5 sm:pl-4 sm:pr-2 sm:py-2 border-[1.8px] border-gray-300 flex flex-col bg-white">
                        <p className="text-[9px] sm:text-[10px] font-semibold mb-0.5 uppercase tracking-wide" style={{ color: "#787E9D", fontFamily: "'Roboto', sans-serif" }}>
                          Suspend
                        </p>
                        <div className="mt-auto flex flex-col">
                          <div className="flex -space-x-1.5 mb-0.5">
                          {allUsers.filter(u => u.approval_status === 'suspend').slice(0, 2).map((user, index) => (
                            user.profile_pic_url ? (
                              <img
                                key={user.id}
                                src={user.profile_pic_url}
                                alt={user.user_name || 'User'}
                                className="w-5 h-5 rounded-full border-2 border-white object-cover"
                              />
                            ) : (
                              <div
                                key={user.id}
                                className="w-5 h-5 rounded-full border-2 border-white flex items-center justify-center text-[9px] font-semibold text-white bg-red-500"
                              >
                                {user.user_name ? user.user_name.charAt(0).toUpperCase() : 'U'}
                              </div>
                            )
                          ))}
                          {animatedStats.suspend > 2 && (
                            <div className="w-5 h-5 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-[9px] font-semibold" style={{ color: "#263238" }}>
                              +{animatedStats.suspend - 2}
                            </div>
                          )}
                          </div>
                          <p className="text-base sm:text-lg font-bold" style={{ color: "#EF4444", fontFamily: "'Poppins', sans-serif" }}>
                            {animatedStats.suspend}
                          </p>
                        </div>
                      </div>
                  </div>
                )}

                {/* Fourth Tile - Salary */}
                <div className="relative overflow-hidden rounded-2xl p-3 sm:p-4 transition-all duration-200 backdrop-blur flex flex-col text-white" style={{ backgroundColor: "#4b33e8" }}>
                  <div className="absolute inset-0" style={{ background: "radial-gradient(circle at top left, rgba(255,255,255,0.28), transparent 55%)" }} />
                  <div className="absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
                  <div className="relative flex flex-col flex-1">
                    <div className="flex items-start justify-between mb-1">
                      <div className="flex-1">
                        <h2 className="text-sm sm:text-base font-bold mb-0.5 text-white" style={{ fontFamily: "'Poppins', sans-serif" }}>
                          Salary
                        </h2>
                        <div className="flex items-center gap-1.5 mb-1">
                          <div className="flex items-center justify-center w-6 h-6 rounded-lg bg-white/20">
                            <i className="fi flex fi-rr-calendar text-xs text-white"></i>
                          </div>
                          <span className="text-[10px] sm:text-xs text-white/80" style={{ fontFamily: "'Roboto', sans-serif" }}>
                            {getCurrentDate()} overview
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-center w-9 h-9 rounded-lg border border-white/30 bg-white/10 backdrop-blur-lg text-white/90">
                        <span className="text-base font-bold">₹</span>
                      </div>
                    </div>
                    
                    {loadingStats ? (
                      <div className="animate-pulse">
                        <div className="h-10 bg-white/20 rounded-lg w-28 mb-2"></div>
                      </div>
                    ) : (
                      <div className="mt-auto">
                        <div>
                          <p className="text-[9px] sm:text-[10px] font-semibold mb-0.5 uppercase tracking-wide text-white/80" style={{ fontFamily: "'Roboto', sans-serif" }}>
                            Total Salary
                          </p>
                          <p className="text-lg sm:text-xl font-bold text-white" style={{ fontFamily: "'Poppins', sans-serif" }}>
                            ₹{animatedStats.totalSalary.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                          </p>
                        </div>
                        <p className="text-[10px] sm:text-xs mt-1 text-white/80" style={{ fontFamily: "'Roboto', sans-serif" }}>
                          Monthly payroll summary
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Approval Pending Section - Only show when there are pending users or while loading */}
              {(loadingPendingUsers || pendingUsers.length > 0) && (
                <div className="mt-8">
                  <h2 className="text-base sm:text-lg font-semibold mb-4" style={{ color: "#263238", fontFamily: "'Poppins', sans-serif" }}>
                    Approval Pending
                  </h2>

                  {loadingPendingUsers ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="animate-pulse rounded-xl bg-white p-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                            <div className="flex-1">
                              <div className="h-3.5 bg-gray-200 rounded w-24 mb-1.5"></div>
                              <div className="h-3 bg-gray-200 rounded w-20"></div>
                            </div>
                            <div className="h-7 bg-gray-200 rounded-full w-16"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {pendingUsers.map((pendingUser) => (
                        <div
                          key={pendingUser.id}
                          className="rounded-xl bg-white p-3 flex items-center gap-3 hover:shadow-sm transition-shadow"
                        >
                          {/* Profile Image */}
                          <div className="flex-shrink-0">
                            {pendingUser.profile_pic_url ? (
                              <img
                                src={pendingUser.profile_pic_url}
                                alt={pendingUser.user_name || 'User'}
                                className="w-10 h-10 rounded-full object-cover"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold text-sm">
                                {pendingUser.user_name ? pendingUser.user_name.charAt(0).toUpperCase() : 'U'}
                              </div>
                            )}
                          </div>

                          {/* Name and Date */}
                          <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-semibold text-gray-900 truncate" style={{ fontFamily: "'Poppins', sans-serif" }}>
                              {pendingUser.user_name || 'N/A'}
                            </h3>
                            <p className="text-xs text-gray-600 mt-0.5" style={{ fontFamily: "'Roboto', sans-serif" }}>
                              {formatDateWithYear(pendingUser.date_of_joining || pendingUser.created_at)}
                            </p>
                          </div>

                          {/* Buttons */}
                          <div className="flex items-center gap-2">
                            <button
                              onClick={async () => {
                                try {
                                  // Generate next employee ID if user doesn't have one
                                  let employeeId = pendingUser.employee_id;
                                  if (!employeeId || employeeId.trim() === '') {
                                    employeeId = await generateNextEmployeeId();
                                  }

                                  const { error } = await supabase
                                    .from('user_profiles')
                                    .update({ 
                                      approval_status: 'approved',
                                      status: 'active',
                                      employee_id: employeeId,
                                      updated_at: new Date().toISOString()
                                    })
                                    .eq('id', pendingUser.id);

                                  if (error) {
                                    console.error('Error approving user:', error);
                                    alert('Failed to approve user');
                                  } else {
                                    // Refresh pending users list
                                    fetchPendingUsers();
                                    fetchUserStats(); // Refresh stats
                                    fetchAllUsers(); // Refresh all users list
                                  }
                                } catch (err) {
                                  console.error('Error approving user:', err);
                                  alert('Failed to approve user');
                                }
                              }}
                              className="px-3 py-1 bg-green-100 hover:bg-green-200 text-green-700 font-semibold rounded-full transition-colors text-xs whitespace-nowrap"
                              style={{ fontFamily: "'Poppins', sans-serif" }}
                            >
                              Approved
                            </button>
                            <button
                              onClick={async () => {
                                try {
                                  const { error } = await supabase
                                    .from('user_profiles')
                                    .update({ approval_status: 'rejected' })
                                    .eq('id', pendingUser.id);

                                  if (error) {
                                    console.error('Error rejecting user:', error);
                                    alert('Failed to reject user');
                                  } else {
                                    // Refresh pending users list
                                    fetchPendingUsers();
                                    fetchUserStats(); // Refresh stats
                                  }
                                } catch (err) {
                                  console.error('Error rejecting user:', err);
                                  alert('Failed to reject user');
                                }
                              }}
                              className="w-[22px] h-[22px] flex items-center justify-center bg-red-100 hover:bg-red-200 text-red-600 rounded-full transition-colors"
                            >
                              <i className="fi flex fi-rr-cross font-extrabold text-[8px]"></i>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* All Users Section */}
              <div className="mt-8 bg-white rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base sm:text-lg font-semibold" style={{ color: "#263238", fontFamily: "'Poppins', sans-serif" }}>
                    All users
                  </h2>
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search users..."
                        className="pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none w-64 placeholder:text-gray-400"
                        style={{ fontFamily: "'Roboto', sans-serif" }}
                      />
                      <i className="fi flex fi-rr-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm"></i>
                      <i className="fi flex fi-rr-filter absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm cursor-pointer"></i>
                    </div>
                    <div className="flex items-center gap-1 rounded-lg border border-gray-300 bg-white p-1 h-[42px]">
                      <button
                        onClick={() => setViewType("grid")}
                        className={`inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-8 w-8 ${
                          viewType === "grid"
                            ? "bg-[#4b33e8] text-white hover:opacity-90"
                            : "hover:bg-gray-100 text-gray-600"
                        }`}
                        title="Grid view"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                          <rect width="7" height="7" x="3" y="3" rx="1"></rect>
                          <rect width="7" height="7" x="14" y="3" rx="1"></rect>
                          <rect width="7" height="7" x="14" y="14" rx="1"></rect>
                          <rect width="7" height="7" x="3" y="14" rx="1"></rect>
                        </svg>
                      </button>
                      <button
                        onClick={() => setViewType("list")}
                        className={`inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-8 w-8 ${
                          viewType === "list"
                            ? "bg-[#4b33e8] text-white hover:opacity-90"
                            : "hover:bg-gray-100 text-gray-600"
                        }`}
                        title="List view"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                          <path d="M3 12h.01"></path>
                          <path d="M3 18h.01"></path>
                          <path d="M3 6h.01"></path>
                          <path d="M8 12h13"></path>
                          <path d="M8 18h13"></path>
                          <path d="M8 6h13"></path>
                        </svg>
                      </button>
                    </div>
                    <button
                      className="h-[42px] w-[42px] flex items-center justify-center border border-gray-300 rounded-xl bg-white hover:bg-gray-50 transition-colors"
                      title="Import"
                    >
                      <i className="fi flex fi-rr-upload text-gray-600 text-sm"></i>
                    </button>
                    <button
                      className="h-[42px] w-[42px] flex items-center justify-center border border-gray-300 rounded-xl bg-white hover:bg-gray-50 transition-colors"
                      title="Export"
                    >
                      <i className="fi flex fi-rr-download text-gray-600 text-sm"></i>
                    </button>
                    <button
                      className="px-6 h-[42px] text-white font-semibold rounded-xl transition-colors text-sm flex items-center justify-center gap-2 hover:opacity-90"
                      style={{ fontFamily: "'Poppins', sans-serif", backgroundColor: "#4b33e8" }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                        <path d="M5 12h14"></path>
                        <path d="M12 5v14"></path>
                      </svg>
                      <span>Add User</span>
                    </button>
                  </div>
                </div>
                <div className="border-t border-gray-200"></div>

                {/* All Users Cards */}
                {!mounted ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <div key={i} className="animate-pulse bg-white rounded-2xl p-6 border border-gray-200">
                        <div className="flex justify-between items-start mb-4">
                          <div className="h-6 w-16 bg-gray-200 rounded"></div>
                          <div className="h-4 w-4 bg-gray-200 rounded"></div>
                        </div>
                        <div className="flex flex-col items-center mb-4">
                          <div className="w-20 h-20 bg-gray-200 rounded-full mb-3"></div>
                          <div className="h-5 w-32 bg-gray-200 rounded mb-2"></div>
                          <div className="h-4 w-20 bg-gray-200 rounded"></div>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                          <div className="h-4 bg-gray-200 rounded w-24"></div>
                          <div className="h-4 bg-gray-200 rounded w-32"></div>
                          <div className="h-4 bg-gray-200 rounded w-40"></div>
                          <div className="h-4 bg-gray-200 rounded w-32"></div>
                        </div>
                        <div className="mt-4 flex justify-between items-center">
                          <div className="h-4 bg-gray-200 rounded w-32"></div>
                          <div className="h-4 bg-gray-200 rounded w-20"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : loadingAllUsers ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <div key={i} className="animate-pulse bg-white rounded-2xl p-6 border border-gray-200">
                        <div className="flex justify-between items-start mb-4">
                          <div className="h-6 w-16 bg-gray-200 rounded"></div>
                          <div className="h-4 w-4 bg-gray-200 rounded"></div>
                        </div>
                        <div className="flex flex-col items-center mb-4">
                          <div className="w-20 h-20 bg-gray-200 rounded-full mb-3"></div>
                          <div className="h-5 w-32 bg-gray-200 rounded mb-2"></div>
                          <div className="h-4 w-20 bg-gray-200 rounded"></div>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                          <div className="h-4 bg-gray-200 rounded w-24"></div>
                          <div className="h-4 bg-gray-200 rounded w-32"></div>
                          <div className="h-4 bg-gray-200 rounded w-40"></div>
                          <div className="h-4 bg-gray-200 rounded w-32"></div>
                        </div>
                        <div className="mt-4 flex justify-between items-center">
                          <div className="h-4 bg-gray-200 rounded w-32"></div>
                          <div className="h-4 bg-gray-200 rounded w-20"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : allUsers.length > 0 ? (
                  viewType === "grid" ? (
                    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {allUsers.map((user) => (
                      <div key={user.id} className="bg-white rounded-2xl p-4 border border-gray-200 hover:shadow-lg transition-shadow relative">
                        {/* Status Badge and Menu */}
                        <div className="flex justify-between items-start mb-3">
                          <div className={`px-2 py-0.5 rounded-lg flex items-center gap-1.5 ${
                            user.status === 'active' 
                              ? 'bg-green-100' 
                              : user.status === 'inactive'
                              ? 'bg-gray-100'
                              : 'bg-gray-100'
                          }`}>
                            <div className={`w-1.5 h-1.5 rounded-full ${
                              user.status === 'active' 
                                ? 'bg-green-500' 
                                : user.status === 'inactive'
                                ? 'bg-gray-400'
                                : 'bg-gray-400'
                            }`}></div>
                            <span className={`text-[10px] font-semibold ${
                              user.status === 'active' 
                                ? 'text-green-700' 
                                : 'text-gray-600'
                            }`}>
                              {user.status === 'active' ? 'Active' : user.status === 'inactive' ? 'Inactive' : 'Pending'}
                            </span>
                          </div>
                          <UserMenuDropdown
                            user={user}
                            isOpen={openMenuId === user.id && viewType === "grid"}
                            onToggle={() => setOpenMenuId(openMenuId === user.id ? null : user.id)}
                            viewType={viewType}
                            onApprovalStatusChange={handleStatusChange}
                            onWorkTypeChange={handleWorkTypeChange}
                            onUserTypeChange={handleUserTypeChange}
                            onRoleChange={handleRoleChange}
                            onDepartmentChange={handleDepartmentChange}
                            onStatusChange={handleUserStatusChange}
                            onDelete={handleDeleteUser}
                            openApprovalDropdown={openApprovalDropdown}
                            openWorkTypeDropdown={openWorkTypeDropdown}
                            openUserTypeDropdown={openUserTypeDropdown}
                            openRoleDropdown={openRoleDropdown}
                            openDepartmentDropdown={openDepartmentDropdown}
                            setOpenApprovalDropdown={setOpenApprovalDropdown}
                            setOpenWorkTypeDropdown={setOpenWorkTypeDropdown}
                            setOpenUserTypeDropdown={setOpenUserTypeDropdown}
                            setOpenRoleDropdown={setOpenRoleDropdown}
                            setOpenDepartmentDropdown={setOpenDepartmentDropdown}
                            menuRef={(el) => { menuRefs.current[user.id] = el; }}
                            onMenuClose={() => setOpenMenuId(null)}
                          />
                        </div>

                        {/* Profile Picture, Name, and Title */}
                        <div className="flex flex-col items-center mb-3">
                          {user.profile_pic_url ? (
                            <img
                              src={user.profile_pic_url}
                              alt={user.user_name || 'User'}
                              className="w-16 h-16 rounded-full object-cover mb-2"
                            />
                          ) : (
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold text-xl mb-2">
                              {user.user_name ? user.user_name.charAt(0).toUpperCase() : 'U'}
                            </div>
                          )}
                          <h3 className="text-base font-semibold text-gray-900 mb-0.5" style={{ fontFamily: "'Poppins', sans-serif" }}>
                            {user.user_name || 'N/A'}
                          </h3>
                          <p className="text-xs text-gray-600" style={{ fontFamily: "'Roboto', sans-serif" }}>
                            {user.role || 'Employee'}
                          </p>
                        </div>

                        {/* Information Box */}
                        <div className="bg-gray-50 rounded-lg p-3 space-y-1.5 mb-3">
                          <div className="text-xs text-gray-700" style={{ fontFamily: "'Roboto', sans-serif" }}>
                            <span className="font-semibold">{user.employee_id || 'N/A'}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-gray-700" style={{ fontFamily: "'Roboto', sans-serif" }}>
                            <i className="fi flex fi-rr-briefcase text-[10px] text-gray-500"></i>
                            <span>{user.role || 'Employee'}</span>
                            <span className="mx-0.5">-</span>
                            {user.work_type === 'on_site' ? (
                              <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
                                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                                <polyline points="9 22 9 12 15 12 15 22"></polyline>
                              </svg>
                            ) : (
                              <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
                                <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                              </svg>
                            )}
                            <span>{getWorkTypeLabel(user.work_type)}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-xs">
                            <i className="fi flex fi-rr-envelope text-[10px] text-gray-500"></i>
                            <a href={`mailto:${user.email}`} className="text-blue-600 hover:underline truncate" style={{ fontFamily: "'Roboto', sans-serif" }}>
                              {user.email || 'N/A'}
                            </a>
                          </div>
                          <div className="flex items-center gap-1.5 text-xs">
                            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
                              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                            </svg>
                            <a href={`tel:${user.contact_no}`} className="text-blue-600 hover:underline" style={{ fontFamily: "'Roboto', sans-serif" }}>
                              {user.contact_no || 'N/A'}
                            </a>
                          </div>
                        </div>

                        {/* Join Date and View Details */}
                        <div className="flex justify-between items-center pt-3 border-t" style={{ borderColor: "#4b33e8" }}>
                          <p className="text-xs text-gray-600" style={{ fontFamily: "'Roboto', sans-serif" }}>
                            Joined at {formatDate(user.date_of_joining || user.created_at)}
                          </p>
                          <a href="#" className="text-blue-600 hover:underline text-xs font-medium flex items-center gap-1" style={{ fontFamily: "'Roboto', sans-serif" }}>
                            View details
                            <i className="fi flex fi-rr-arrow-right text-[10px]"></i>
                          </a>
                        </div>
                      </div>
                    ))}
                    </div>
                  ) : (
                    <div className="mt-6 bg-white rounded-xl border border-gray-200 overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                              <input type="checkbox" className="rounded border-gray-300" />
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Emp ID</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Role</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Joined Date</th>
                            <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">Action</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {allUsers.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <input type="checkbox" className="rounded border-gray-300" />
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center gap-3">
                                  {user.profile_pic_url ? (
                                    <img
                                      src={user.profile_pic_url}
                                      alt={user.user_name || 'User'}
                                      className="w-10 h-10 rounded-full object-cover"
                                    />
                                  ) : (
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold text-sm">
                                      {user.user_name ? user.user_name.charAt(0).toUpperCase() : 'U'}
                                    </div>
                                  )}
                                  <span className="text-sm font-medium text-gray-900" style={{ fontFamily: "'Poppins', sans-serif" }}>
                                    {user.user_name || 'N/A'}
                                  </span>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="text-sm text-gray-600" style={{ fontFamily: "'Roboto', sans-serif" }}>
                                  {user.employee_id || 'N/A'}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="text-sm text-gray-600" style={{ fontFamily: "'Roboto', sans-serif" }}>
                                  {user.role || 'Employee'}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className={`px-2.5 py-1 rounded-full inline-flex items-center gap-1.5 ${
                                  user.status === 'active' 
                                    ? 'bg-green-100' 
                                    : user.status === 'inactive'
                                    ? 'bg-gray-100'
                                    : 'bg-orange-100'
                                }`}>
                                  <div className={`w-1.5 h-1.5 rounded-full ${
                                    user.status === 'active' 
                                      ? 'bg-green-500' 
                                      : user.status === 'inactive'
                                      ? 'bg-gray-400'
                                      : 'bg-orange-400'
                                  }`}></div>
                                  <span className={`text-xs font-semibold ${
                                    user.status === 'active' 
                                      ? 'text-green-700' 
                                      : user.status === 'inactive'
                                      ? 'text-gray-600'
                                      : 'text-orange-700'
                                  }`}>
                                    {user.status === 'active' ? 'Active' : user.status === 'inactive' ? 'Inactive' : 'Pending'}
                                  </span>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="text-sm text-gray-600" style={{ fontFamily: "'Roboto', sans-serif" }}>
                                  {user.email || 'N/A'}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="text-sm text-gray-600" style={{ fontFamily: "'Roboto', sans-serif" }}>
                                  {formatDate(user.date_of_joining || user.created_at)}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right">
                                <UserMenuDropdown
                                  user={user}
                                  isOpen={openMenuId === user.id && viewType === "list"}
                                  onToggle={(e?: React.MouseEvent) => {
                                    if (e) {
                                      e.stopPropagation();
                                      if (openMenuId === user.id) {
                                        setOpenMenuId(null);
                                        setMenuPosition(null);
                                      } else {
                                        const button = e.currentTarget as HTMLElement;
                                        const rect = button.getBoundingClientRect();
                                        const menuHeight = 400; // Approximate menu height (increased for dropdowns)
                                        const spaceBelow = window.innerHeight - rect.bottom;
                                        const spaceAbove = rect.top;
                                        
                                        // Position menu above if not enough space below, but enough space above
                                        const shouldPositionAbove = spaceBelow < menuHeight && spaceAbove > menuHeight;
                                        
                                        setMenuPosition({
                                          top: shouldPositionAbove ? rect.top - menuHeight - 8 : rect.bottom + 8,
                                          right: window.innerWidth - rect.right
                                        });
                                        setOpenMenuId(user.id);
                                      }
                                    } else {
                                      setOpenMenuId(openMenuId === user.id ? null : user.id);
                                    }
                                  }}
                                  viewType={viewType}
                                  menuPosition={menuPosition}
                                  onApprovalStatusChange={handleStatusChange}
                                  onWorkTypeChange={handleWorkTypeChange}
                                  onUserTypeChange={handleUserTypeChange}
                                  onRoleChange={handleRoleChange}
                                  onDepartmentChange={handleDepartmentChange}
                                  onStatusChange={handleUserStatusChange}
                                  onDelete={handleDeleteUser}
                                  openApprovalDropdown={openApprovalDropdown}
                                  openWorkTypeDropdown={openWorkTypeDropdown}
                                  openUserTypeDropdown={openUserTypeDropdown}
                                  openRoleDropdown={openRoleDropdown}
                                  openDepartmentDropdown={openDepartmentDropdown}
                                  setOpenApprovalDropdown={setOpenApprovalDropdown}
                                  setOpenWorkTypeDropdown={setOpenWorkTypeDropdown}
                                  setOpenUserTypeDropdown={setOpenUserTypeDropdown}
                                  setOpenRoleDropdown={setOpenRoleDropdown}
                                  setOpenDepartmentDropdown={setOpenDepartmentDropdown}
                                  menuRef={(el) => { menuRefs.current[user.id] = el; }}
                                  onMenuClose={() => {
                                    setOpenMenuId(null);
                                    setMenuPosition(null);
                                  }}
                                />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      </div>
                    </div>
                  )
                ) : (
                  <div className="text-center py-8 text-gray-500">No users found</div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
