const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = 'https://qcglmkmhqvmkugaqvqih.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFjZ2xta21ocXZta3VnYXF2cWloIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY0OTA5MTUsImV4cCI6MjA4MjA2NjkxNX0.XRbQNB4sbRgSppMH76ED7OruPYHJgI-xOMLQM7ZT6Lc';
const supabase = createClient(supabaseUrl, supabaseKey);

async function testRpc() {
  const start = Date.now();
  const { data, error } = await supabase.rpc('get_campaign_stats');
  const dur = Date.now() - start;
  
  if (error) {
    console.error("Error:", error);
  } else {
    console.log(`✅ Success in ${dur}ms!`);
    console.log("Count:", data?.length);
    console.log("Sample:", data?.[0]);
  }
}
testRpc();
