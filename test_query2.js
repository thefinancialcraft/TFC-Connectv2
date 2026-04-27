const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://qcglmkmhqvmkugaqvqih.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFjZ2xta21ocXZta3VnYXF2cWloIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY0OTA5MTUsImV4cCI6MjA4MjA2NjkxNX0.XRbQNB4sbRgSppMH76ED7OruPYHJgI-xOMLQM7ZT6Lc';
const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  try {
    const q = supabase
      .from('rejected_leads')
      .select('*, agent:user_profiles!agent_id(user_name, employee_id, organization_id), campaign:campaigns!campaign_id(name)');

    // Simulate dashboardLevel === 2 (Admin) filtering by organization_id without !inner
    const qWithFilter = q.eq('agent.organization_id', 'some-org-id');

    const { data, error } = await qWithFilter.range(0, 999);
    
    if (error) {
      console.error("Error with filter:", error);
    } else {
      console.log("Success with filter.");
    }
  } catch (err) {
    console.error("Caught exception:", err);
  }
}

test();
