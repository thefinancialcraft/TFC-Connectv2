const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://qcglmkmhqvmkugaqvqih.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFjZ2xta21ocXZta3VnYXF2cWloIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY0OTA5MTUsImV4cCI6MjA4MjA2NjkxNX0.XRbQNB4sbRgSppMH76ED7OruPYHJgI-xOMLQM7ZT6Lc';
const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  try {
    const startOfDay = new Date(`2026-04-27T00:00:00+05:30`).toISOString();
    const endOfDay = new Date(`2026-04-27T23:59:59+05:30`).toISOString();

    const buildQueryFn = () => {
      let q = supabase
        .from("call_logs")
        .select(`
          *,
          customer_name,
          agent:user_profiles!agent_id!inner(user_name, employee_id, organization_id),
          campaign:campaigns!campaign_id(name)
        `)
        .gte("created_at", startOfDay)
        .lte("created_at", endOfDay)
        .order("created_at", { ascending: false });
      return q;
    };

    const q = buildQueryFn();
    const { data, error } = await q.range(0, 999);
    
    if (error) {
      console.error("Error:", error);
    } else {
      console.log("Success. Rows:", data.length);
    }
  } catch (err) {
    console.error("Caught exception:", err);
  }
}

test();
