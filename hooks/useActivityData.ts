import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { supabase } from "../lib/supabase";

export interface ActivityStats {
  totalDials: number;
  totalTalkTime: number;
  contactable: number;
  uncontactable: number;
  lastCallTime: string;
  idleFrom: string;
}

export function useActivityData() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activities, setActivities] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [stats, setStats] = useState<ActivityStats>({
    totalDials: 0,
    totalTalkTime: 0,
    contactable: 0,
    uncontactable: 0,
    lastCallTime: "N/A",
    idleFrom: "N/A"
  });

  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchActivities = useCallback(async (isBackground = false) => {
    // Abort previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    try {
      if (!isBackground) setLoading(true);
      setError("");

      const startOfDay = `${selectedDate}T00:00:00.000Z`;
      const endOfDay = `${selectedDate}T23:59:59.999Z`;

      const { data, error: fetchError } = await supabase
        .from("call_logs")
        .select(`
          *,
          agent:user_profiles!agent_id(user_name, employee_id),
          customer:customers(customer_name),
          campaign:campaigns!campaign_id(name)
        `)
        .gte("created_at", startOfDay)
        .lte("created_at", endOfDay)
        .order("created_at", { ascending: false });

      if (fetchError) {
        if (fetchError.name === 'AbortError') return;
        throw fetchError;
      }

      setActivities(data || []);

      // Calculate Stats
      if (data) {
        const totalTalkTimeSec = data.reduce((acc, curr) => acc + (curr.duration || 0), 0);
        const contactableCount = data.filter(cl => cl.is_connected === 'contactable').length;
        const lastCall = data.length > 0 ? new Date(data[0].created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "N/A";
        
        setStats({
          totalDials: data.length,
          totalTalkTime: totalTalkTimeSec,
          contactable: contactableCount,
          uncontactable: data.length - contactableCount,
          lastCallTime: lastCall,
          idleFrom: data.length > 0 ? lastCall : "N/A"
        });
      }

    } catch (err: any) {
      if (err.name !== 'AbortError') {
        console.error("Error fetching activities:", err);
        setError("Failed to load activities");
      }
    } finally {
      if (!isBackground) setLoading(false);
    }
  }, [selectedDate]);

  useEffect(() => {
    fetchActivities();
    
    // Focus-based refetch
    const handleFocus = () => {
      fetchActivities(true); // Fetch in background on focus
    };
    window.addEventListener("focus", handleFocus);

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      window.removeEventListener("focus", handleFocus);
    };
  }, [fetchActivities]);

  const filteredActivities = useMemo(() => {
    const query = searchQuery.toLowerCase();
    if (!query) return activities;
    
    return activities.filter(a => 
      a.agent?.user_name?.toLowerCase().includes(query) ||
      a.customer?.customer_name?.toLowerCase().includes(query) ||
      a.agent?.employee_id?.toLowerCase().includes(query) ||
      a.campaign?.name?.toLowerCase().includes(query) ||
      (a.notes && a.notes.toLowerCase().includes(query))
    );
  }, [activities, searchQuery]);

  // Utility formatters memoized or optimized
  const formatSeconds = useCallback((seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  const formatTime = useCallback((dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  }, []);

  const formatDisplayDate = useCallback((dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'short', year: 'numeric' };
    return date.toLocaleDateString('en-GB', options);
  }, []);

  return {
    loading,
    error,
    activities,
    filteredActivities,
    stats,
    selectedDate,
    setSelectedDate,
    searchQuery,
    setSearchQuery,
    fetchActivities,
    formatSeconds,
    formatTime,
    formatDisplayDate
  };
}
