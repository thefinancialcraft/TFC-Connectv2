const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://qcglmkmhqvmkugaqvqih.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFjZ2xta21ocXZta3VnYXF2cWloIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NjQ5MDkxNSwiZXhwIjoyMDgyMDY2OTE1fQ.aaQXquGml4Cw0mlRufdgmw4hRbCQH_PnUXKO6nK7_OM';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkData() {
  console.log('--- Checking today (May 16, 2026 IST) ---');
  // Range is May 15 18:30 UTC to May 16 18:29 UTC
  const start = '2026-05-15T18:30:00.000Z';
  const end = '2026-05-16T18:29:59.000Z';

  const { data, error, count } = await supabase
    .from('call_history')
    .select('*', { count: 'exact' })
    .gte('timestamp', start)
    .lte('timestamp', end);

  if (error) {
    console.error('Error:', error);
  } else {
    console.log('Count:', count);
    if (data && data.length > 0) {
      console.log('First Record call_type:', data[0].call_type);
      console.log('Available call_types:', [...new Set(data.map(d => d.call_type))]);
    } else {
      console.log('No data found in this range.');
      
      // Try searching without range to see what's there
      const { data: latest } = await supabase
        .from('call_history')
        .select('timestamp, call_type')
        .order('timestamp', { ascending: false })
        .limit(5);
      console.log('Latest 5 records in DB:', latest);
    }
  }
}

checkData();
