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

async function checkNames() {
  const { data: custs } = await supabase
    .from('customers')
    .select('customer_name, customer_details, expiry_date')
    .eq('source_id', 'SRC-5SEZB1XZ')
    .limit(10);

  custs.forEach((c, idx) => {
    const d = extractDetails(c.customer_details);
    console.log(`${idx + 1}: Name: "${c.customer_name}", Last Name: "${d['LAST NAME'] || ''}", Full: "${(c.customer_name + ' ' + (d['LAST NAME'] || '')).trim()}", Expiry: "${c.expiry_date}"`);
  });
}

checkNames();
