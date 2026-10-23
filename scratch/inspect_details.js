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

async function checkDetails() {
  const { data: cData } = await supabase
    .from('customers')
    .select('customer_name, phone_no, expiry_date, customer_details')
    .eq('source_id', 'SRC-5SEZB1XZ')
    .limit(5);

  console.log('Customers sample details:');
  cData.forEach((row, i) => {
    console.log(`-- Row ${i+1}:`);
    console.log('customer_name:', row.customer_name);
    console.log('expiry_date:', row.expiry_date);
    console.log('customer_details:', row.customer_details);
  });

  const { data: rData } = await supabase
    .from('rejected_leads')
    .select('customer_name, phone_no, expiry_date, customer_details')
    .eq('source_id', 'SRC-5SEZB1XZ')
    .limit(5);

  console.log('Rejected sample details:');
  rData.forEach((row, i) => {
    console.log(`-- Row ${i+1}:`);
    console.log('customer_name:', row.customer_name);
    console.log('expiry_date:', row.expiry_date);
    console.log('customer_details:', row.customer_details);
  });
}

checkDetails();
