const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://qcglmkmhqvmkugaqvqih.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFjZ2xta21ocXZta3VnYXF2cWloIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY0OTA5MTUsImV4cCI6MjA4MjA2NjkxNX0.XRbQNB4sbRgSppMH76ED7OruPYHJgI-xOMLQM7ZT6Lc';
const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  try {
    const { data, error } = await supabase
      .from("customers")
      .select(`*`)
      .order("created_at", { ascending: false })
      .limit(2);

    if (error) {
      console.error("Error:", error);
    } else {
      console.log("Total matched logs:", data.length);
      console.log(JSON.stringify(data, null, 2));
    }
  } catch (err) {
    console.error("Caught exception:", err);
  }
}

test();
