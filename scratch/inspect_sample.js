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

async function inspectRows() {
  const { data: custRows } = await supabase
    .from('customers')
    .select('*')
    .eq('source_id', 'SRC-5SEZB1XZ')
    .limit(2);

  console.log('Customer sample:');
  console.log(JSON.stringify(custRows, null, 2));

  const { data: rejRows } = await supabase
    .from('rejected_leads')
    .select('*')
    .eq('source_id', 'SRC-5SEZB1XZ')
    .limit(2);

  console.log('Rejected sample:');
  console.log(JSON.stringify(rejRows, null, 2));
}

inspectRows();
