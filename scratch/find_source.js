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

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const targetSourceId = 'SRC-5SEZB1XZ';

async function checkTables() {
  const tables = ['customers', 'inactive_leads', 'rejected_leads', 'dead_leads', 'leadpilot_staging', 'system_logs'];
  console.log(`Checking for source_id: ${targetSourceId}...`);

  for (const table of tables) {
    try {
      const { count, error } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true })
        .eq('source_id', targetSourceId);

      if (error) {
        console.log(`Table ${table}: Error - ${error.message}`);
      } else {
        console.log(`Table ${table}: Count = ${count}`);
      }
    } catch (err) {
      console.log(`Table ${table}: Exception - ${err.message}`);
    }
  }

  // Also check system_logs details or metadata
  const { data: logs, error: logErr } = await supabase
    .from('system_logs')
    .select('*')
    .eq('source_id', targetSourceId)
    .limit(5);

  if (logs && logs.length > 0) {
    console.log('System logs found:', logs);
  } else if (logErr) {
    console.log('System logs error:', logErr.message);
  } else {
    console.log('No system_logs matching source_id directly. Checking if mentioned anywhere in system_logs...');
  }
}

checkTables();
