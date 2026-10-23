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

function extractDetails(raw) {
  if (!raw) return {};
  try {
    const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
    if (parsed.history && parsed.active_details && parsed.history[parsed.active_details]) {
      const activeObj = parsed.history[parsed.active_details];
      const cleaned = {};
      for (const [k, v] of Object.entries(activeObj)) {
        const cleanKey = k.replace(/_checked$/, '');
        cleaned[cleanKey] = v;
      }
      return cleaned;
    }
    return parsed;
  } catch (e) {
    return { raw };
  }
}

async function analyzeAll() {
  const { data: custs } = await supabase
    .from('customers')
    .select('customer_name, phone_no, expiry_date, customer_details, disposition, sub_disposition, attempt_count')
    .eq('source_id', 'SRC-5SEZB1XZ');

  const { data: rejs } = await supabase
    .from('rejected_leads')
    .select('customer_name, phone_no, expiry_date, customer_details, disposition, sub_disposition, attempt_count')
    .eq('source_id', 'SRC-5SEZB1XZ');

  const all = [...(custs || []), ...(rejs || [])];
  console.log(`Total records: ${all.length}`);

  const allKeys = new Set();
  all.forEach(row => {
    const details = extractDetails(row.customer_details);
    Object.keys(details).forEach(k => allKeys.add(k));
  });

  console.log('All unique detail keys:', Array.from(allKeys));
}

analyzeAll();
