const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const envFile = fs.readFileSync(path.resolve(__dirname, '../.env.local'), 'utf8');
const env = {};
envFile.split('\n').forEach(line => {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
  if (match) {
    let value = match[2] || '';
    value = value.trim().replace(/^['"](.*)['"]$/, '$1');
    env[match[1]] = value;
  }
});

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

const targetSourceId = 'SRC-TAHYZ986';

async function checkTarget() {
  console.log(`Checking database for source: ${targetSourceId}...`);

  const { data: logs, error: lErr } = await supabase
    .from('system_logs')
    .select('*')
    .eq('source_id', targetSourceId);
  console.log('System logs:', logs, lErr?.message);

  const { count: cCount, error: cErr } = await supabase
    .from('customers')
    .select('*', { count: 'exact', head: true })
    .eq('source_id', targetSourceId);
  console.log(`Customers count: ${cCount}`, cErr?.message);

  const { count: rCount, error: rErr } = await supabase
    .from('rejected_leads')
    .select('*', { count: 'exact', head: true })
    .eq('source_id', targetSourceId);
  console.log(`Rejected count: ${rCount}`, rErr?.message);

  const { count: iCount, error: iErr } = await supabase
    .from('inactive_leads')
    .select('*', { count: 'exact', head: true })
    .eq('source_id', targetSourceId);
  console.log(`Inactive count: ${iCount}`, iErr?.message);

  // Check sample row to see customer_details keys
  const { data: sampleCust } = await supabase
    .from('customers')
    .select('customer_name, phone_no, expiry_date, customer_details')
    .eq('source_id', targetSourceId)
    .limit(2);
  console.log('Sample customer:', JSON.stringify(sampleCust, null, 2));

  const { data: sampleRej } = await supabase
    .from('rejected_leads')
    .select('customer_name, phone_no, expiry_date, customer_details')
    .eq('source_id', targetSourceId)
    .limit(2);
  console.log('Sample rejected:', JSON.stringify(sampleRej, null, 2));
}

checkTarget();
