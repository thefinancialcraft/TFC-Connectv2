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

const SECRET_KEY = env.NEXT_PUBLIC_PHONE_ENCRYPTION_KEY || 'TfcV2_Secure_9Xk2Lp5Nm8Qj4Rs7Vw1Zy3Bd6G';

function decryptPhone(phone) {
  if (!phone) return "";
  if (phone.startsWith("__enc__")) {
    try {
      const base64Data = phone.substring(7);
      const encrypted = Buffer.from(base64Data, 'base64').toString('binary');
      const decrypted = encrypted.split('').map((char, i) => 
        String.fromCharCode(char.charCodeAt(0) ^ SECRET_KEY.charCodeAt(i % SECRET_KEY.length))
      ).join('');
      return decrypted;
    } catch (e) {
      return phone;
    }
  }
  return phone;
}

async function fetchAll() {
  const { data: custs, error: cErr } = await supabase
    .from('customers')
    .select('*')
    .eq('source_id', 'SRC-5SEZB1XZ');

  const { data: rejs, error: rErr } = await supabase
    .from('rejected_leads')
    .select('*')
    .eq('source_id', 'SRC-5SEZB1XZ');

  console.log(`Customers: ${custs ? custs.length : 0}, error: ${cErr?.message}`);
  console.log(`Rejected: ${rejs ? rejs.length : 0}, error: ${rErr?.message}`);

  const all = [...(custs || []), ...(rejs || [])];
  console.log(`Total: ${all.length}`);

  // Check phone decryption rate
  let decryptedCount = 0;
  all.forEach(row => {
    const dec = decryptPhone(row.phone_no);
    if (/^\d{10}$/.test(dec)) {
      decryptedCount++;
    }
  });
  console.log(`Successfully decrypted 10-digit phones: ${decryptedCount} / ${all.length}`);
}

fetchAll();
