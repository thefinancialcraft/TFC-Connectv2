import { useState } from "react";
import { supabase } from "../../lib/supabase";
import { UserStats } from "../../components/users/types";

export function useUsersStats(userTypeToggle: "all" | "employee" | "posp_agent") {
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
  const [loadingStats, setLoadingStats] = useState(true);
  const [monthlyActiveUsers, setMonthlyActiveUsers] = useState<{ month: string; count: number }[]>([]);
  const [monthlyTotalUsers, setMonthlyTotalUsers] = useState<{ month: string; count: number }[]>([]);
  
  const [designationStats, setDesignationStats] = useState<Record<string, number>>({});
  const [workTypeStats, setWorkTypeStats] = useState<Record<string, number>>({});
  const [departmentStats, setDepartmentStats] = useState<Record<string, number>>({});

  const fetchUserStats = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      // Build query based on userTypeToggle
      let query = supabase.from("user_profiles").select("status, approval_status, in_hand_salary, user_type");

      if (userTypeToggle === "employee") {
        query = query.eq("user_type", "employee");
      } else if (userTypeToggle === "posp_agent") {
        query = query.eq("user_type", "posp_agent");
      }

      const { data: allUsersData, error: fetchError } = await query;

      if (fetchError) throw fetchError;

      const stats: UserStats = {
        activeUsers: 0,
        totalUsers: 0,
        inactiveUsers: 0,
        approved: 0,
        pending: 0,
        hold: 0,
        suspend: 0,
        totalSalary: 0,
        averageSalary: 0,
      };

      if (allUsersData) {
        stats.totalUsers = allUsersData.length;
        
        // Sum salary and filtering
        let salarySum = 0;
        let salaryCount = 0;

        allUsersData.forEach((user) => {
          if (user.status === "active") stats.activeUsers++;
          if (user.status === "inactive") stats.inactiveUsers++;
          if (user.approval_status === "approved") stats.approved++;
          if (user.approval_status === "pending") stats.pending++;
          if (user.approval_status === "hold") stats.hold++;
          if (user.approval_status === "suspend") stats.suspend++;
          
          if (user.in_hand_salary) {
            salarySum += Number(user.in_hand_salary);
            salaryCount++;
          }
        });

        stats.totalSalary = salarySum;
        stats.averageSalary = salaryCount > 0 ? Math.round(salarySum / salaryCount) : 0;
      }

      setUserStats(stats);
      setAnimatedStats(stats); // Simplify animation for now, just set directly
      setLoadingStats(false);
    } catch (error) {
      console.error("Error fetching user stats:", error);
      setLoadingStats(false);
    }
  };

  const fetchMonthlyUserData = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      let query = supabase.from("user_profiles").select("status, created_at, user_type");
      if (userTypeToggle === "employee") {
        query = query.eq("user_type", "employee");
      } else if (userTypeToggle === "posp_agent") {
        query = query.eq("user_type", "posp_agent");
      }

      const { data: allUsersData, error: fetchError } = await query;
      if (fetchError) throw fetchError;

      if (allUsersData) {
        // Group by month - simplified logic from original
        const monthCounts = new Map<string, { active: number; total: number }>();
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        
        // Initialize current year months
        const currentYear = new Date().getFullYear();
        months.forEach(m => monthCounts.set(`${m} ${currentYear}`, { active: 0, total: 0 }));

        allUsersData.forEach(user => {
          if (user.created_at) {
            const date = new Date(user.created_at);
            const monthYear = `${months[date.getMonth()]} ${date.getFullYear()}`;
            if (monthCounts.has(monthYear)) {
               const current = monthCounts.get(monthYear)!;
               current.total++;
               if (user.status === 'active') current.active++;
               monthCounts.set(monthYear, current);
            }
          }
        });

        const activeData = Array.from(monthCounts.entries()).map(([month, counts]) => ({ month, count: counts.active }));
        const totalData = Array.from(monthCounts.entries()).map(([month, counts]) => ({ month, count: counts.total }));
        
        setMonthlyActiveUsers(activeData);
        setMonthlyTotalUsers(totalData);
      }
    } catch (error) {
      console.error("Error fetching monthly data:", error);
    }
  };

  const fetchCategoryStats = async () => {
    try {
      let query = supabase.from("user_profiles").select("designation, work_type, department, user_type");
      if (userTypeToggle === "employee") {
        query = query.eq("user_type", "employee");
      } else if (userTypeToggle === "posp_agent") {
        query = query.eq("user_type", "posp_agent");
      }

      const { data, error } = await query;
      if (error) throw error;

      if (data) {
        const desStats: Record<string, number> = {};
        const wtStats: Record<string, number> = {};
        const deptStats: Record<string, number> = {};

        data.forEach(user => {
           if (user.designation) desStats[user.designation] = (desStats[user.designation] || 0) + 1;
           if (user.work_type) wtStats[user.work_type] = (wtStats[user.work_type] || 0) + 1;
           if (user.department) deptStats[user.department] = (deptStats[user.department] || 0) + 1;
        });

        setDesignationStats(desStats);
        setWorkTypeStats(wtStats);
        setDepartmentStats(deptStats);
      }
    } catch (error) {
       console.error("Error fetching category stats:", error);
    }
  };

  return {
    userStats,
    animatedStats,
    loadingStats,
    monthlyActiveUsers,
    monthlyTotalUsers,
    designationStats,
    workTypeStats,
    departmentStats,
    fetchUserStats,
    fetchMonthlyUserData,
    fetchCategoryStats
  };
}
