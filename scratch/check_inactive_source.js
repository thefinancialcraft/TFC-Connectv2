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
const target = 'SRC-LP-1TEALE';

async function check() {
  // 1. Check inactive_leads
  const { data: inactives, error: err1, count: c1 } = await supabase
    .from('inactive_leads')
    .select('*', { count: 'exact' })
    .eq('source_id', target);

  console.log(`inactive_leads count for ${target}:`, c1, err1 ? err1.message : 'OK');
  if (inactives && inactives.length > 0) {
    console.log('Columns:', Object.keys(inactives[0]));
    const dispositions = {};
    inactives.forEach(r => {
      const d = r.disposition || 'NULL';
      dispositions[d] = (dispositions[d] || 0) + 1;
    });
    console.log('Dispositions breakdown in inactive_leads:', dispositions);
  }

  // 2. Also check customers table just in case
  const { count: c2 } = await supabase
    .from('customers')
    .select('*', { count: 'exact', head: true })
    .eq('source_id', target);
  console.log(`customers count for ${target}:`, c2);

  // 3. Also check rejected_leads
  const { count: c3 } = await supabase
    .from('rejected_leads')
    .select('*', { count: 'exact', head: true })
    .eq('source_id', target);
  console.log(`rejected_leads count for ${target}:`, c3);

  // 4. Also check lead_sheduled
  const { count: c4 } = await supabase
    .from('lead_sheduled')
    .select('*', { count: 'exact', head: true })
    .eq('source_id', target);
  console.log(`lead_sheduled count for ${target}:`, c4);
}

check().catch(console.error);

