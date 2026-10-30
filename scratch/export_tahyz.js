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
const targetSourceId = 'SRC-TAHYZ986';

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

function formatDate(dateStr) {
  if (!dateStr) return "";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const day = String(d.getUTCDate()).padStart(2, '0');
    const month = String(d.getUTCMonth() + 1).padStart(2, '0');
    const year = d.getUTCFullYear();
    return `${day}/${month}/${year}`;
  } catch (e) {
    return dateStr;
  }
}

function escapeCsv(val) {
  if (val === null || val === undefined) return '""';
  const str = String(val);
  return `"${str.replace(/"/g, '""')}"`;
}

async function fetchAllRecords(table) {
  const records = [];
  const chunkSize = 1000;
  let from = 0;
  let hasMore = true;

  while (hasMore) {
    const to = from + chunkSize - 1;
    const { data, error } = await supabase
      .from(table)
      .select('*')
      .eq('source_id', targetSourceId)
      .order('created_at', { ascending: true })
      .range(from, to);

    if (error) {
      console.error(`Error fetching ${table} range ${from}-${to}:`, error);
      break;
    }

    if (data && data.length > 0) {
      records.push(...data);
      console.log(`Fetched ${records.length} records from ${table}...`);
      if (data.length < chunkSize) {
        hasMore = false;
      } else {
        from += chunkSize;
      }
    } else {
      hasMore = false;
    }
  }
  return records;
}

async function run() {
  console.log(`Starting export for ${targetSourceId}...`);

  const custs = await fetchAllRecords('customers');
  const rejs = await fetchAllRecords('rejected_leads');

  console.log(`Total retrieved: Customers = ${custs.length}, Rejected = ${rejs.length}`);
  const allRecords = [
    ...custs.map(r => ({ ...r, record_table: 'customers' })),
    ...rejs.map(r => ({ ...r, record_table: 'rejected_leads' }))
  ];

  if (allRecords.length === 0) {
    console.error('No records found!');
    return;
  }

  // Check unique detail keys
  const allDetailKeys = new Set();
  let decryptedValidCount = 0;

  const processed = allRecords.map(row => {
    const decPhone = decryptPhone(row.phone_no);
    if (/^\d{10}$/.test(decPhone)) {
      decryptedValidCount++;
    }
    const details = extractDetails(row.customer_details);
    Object.keys(details).forEach(k => allDetailKeys.add(k));

    const lastName = details['LAST NAME'] || details['Last Name'] || '';
    const fullName = lastName ? `${row.customer_name} ${lastName}`.trim() : (row.customer_name || '');

    return {
      raw_customer_name: row.customer_name || '',
      full_name: fullName,
      phone_no: decPhone,
      expiry_date: formatDate(row.expiry_date),
      raw_expiry_date: row.expiry_date || '',
      details_obj: details,
      details_json: JSON.stringify(details),
      policy_no: details['Policy No.'] || details['Policy No'] || details['Policy Number'] || details['POLICY NUMBER'] || '',
      premium: details['Premium'] || details['PREMIUM'] || '',
      plan: details['Plan'] || details['PLAN'] || '',
      sum: details['Sum'] || details['SUM'] || '',
      table_status: row.record_table === 'customers' ? (row.status || 'active') : 'rejected',
      disposition: row.disposition || '',
      sub_disposition: row.sub_disposition || '',
      attempt_count: row.attempt_count ?? 0,
      lead_id: row.lead_id || '',
      created_at: row.created_at || ''
    };
  });

  console.log(`Decrypted valid 10-digit phones: ${decryptedValidCount} / ${allRecords.length}`);
  console.log('Unique detail keys across records:', Array.from(allDetailKeys));

  // 1. JSON output matching query_result_SRC-*.json format
  const jsonOutput = processed.map(r => ({
    customer_name: r.full_name,
    phone_no: r.phone_no,
    customer_details: r.details_obj,
    expiry_date: r.expiry_date,
    attempt_count: r.attempt_count
  }));
  const jsonPath = path.resolve(__dirname, `../query_result_${targetSourceId}.json`);
  fs.writeFileSync(jsonPath, JSON.stringify(jsonOutput, null, 2), 'utf8');
  console.log(`Saved JSON: ${jsonPath} (${jsonOutput.length} records)`);

  // 2. 4-column CSV: customer name, phone no, expiry, customer details
  const fourColHeader = ['customer name', 'phone no', 'expiry', 'customer details'];
  const fourColRows = processed.map(r => [
    escapeCsv(r.full_name),
    escapeCsv(r.phone_no),
    escapeCsv(r.expiry_date),
    escapeCsv(r.details_json)
  ]);
  const fourColCsvContent = [fourColHeader.join(','), ...fourColRows.map(row => row.join(','))].join('\n');
  const fourColCsvPath = path.resolve(__dirname, `../${targetSourceId}_customer_data.csv`);
  fs.writeFileSync(fourColCsvPath, fourColCsvContent, 'utf8');
  console.log(`Saved 4-col CSV: ${fourColCsvPath}`);

  // 3. Detailed breakdown CSV (with Policy No, Premium, Plan, Sum + details)
  const detailHeaders = [
    'Customer Name',
    'Phone No',
    'Expiry Date',
    'Policy No',
    'Premium',
    'Plan',
    'Sum Insured',
    'Status',
    'Disposition',
    'Sub Disposition',
    'Attempts',
    'Lead ID',
    'Customer Details (JSON)'
  ];

  const detailedRows = processed.map(r => [
    escapeCsv(r.full_name),
    escapeCsv(r.phone_no),
    escapeCsv(r.expiry_date),
    escapeCsv(r.policy_no),
    escapeCsv(r.premium),
    escapeCsv(r.plan),
    escapeCsv(r.sum),
    escapeCsv(r.table_status),
    escapeCsv(r.disposition),
    escapeCsv(r.sub_disposition),
    escapeCsv(r.attempt_count),
    escapeCsv(r.lead_id),
    escapeCsv(r.details_json)
  ]);
  const detailedCsvContent = [detailHeaders.join(','), ...detailedRows.map(row => row.join(','))].join('\n');
  const detailedCsvPath = path.resolve(__dirname, `../${targetSourceId}_detailed_decrypted.csv`);
  fs.writeFileSync(detailedCsvPath, detailedCsvContent, 'utf8');
  console.log(`Saved detailed CSV: ${detailedCsvPath}`);
}

run();
