const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

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
const SECRET_KEY = env.NEXT_PUBLIC_PHONE_ENCRYPTION_KEY || 'RYNXLY_SECURE_PHONE_VAULT';
const targetSourceId = 'SRC-PZGOC61W';

console.log('Connecting to Supabase:', env.NEXT_PUBLIC_SUPABASE_URL);

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
        const cleanKey = k.replace(/_checked$/, '').replace(/_unchecked$/, '');
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
      console.error(`Error fetching ${table} range ${from}-${to}:`, error.message);
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
  console.log(`Fetching all records for ${targetSourceId}...`);

  const custs = await fetchAllRecords('customers');
  const rejs = await fetchAllRecords('rejected_leads');

  console.log(`Retrieved: customers=${custs.length}, rejected_leads=${rejs.length}`);

  const allRecords = [
    ...custs.map(r => ({ ...r, record_table: 'customers' })),
    ...rejs.map(r => ({ ...r, record_table: 'rejected_leads' }))
  ];

  if (allRecords.length === 0) {
    console.error('No records found for source_id:', targetSourceId);
    return;
  }

  const processed = allRecords.map(row => {
    const decPhone = decryptPhone(row.phone_no);
    const details = extractDetails(row.customer_details);

    const lastName = details['Last_Name'] || details['LAST NAME'] || details['Last Name'] || '';
    const hasValidLastName = lastName && lastName !== '.';
    const fullName = hasValidLastName ? `${row.customer_name} ${lastName}`.trim() : (row.customer_name || '');

    const policyNo = details['POLICY NUMBER'] || details['Policy No.'] || details['Policy No'] || details['Policy Number'] || '';
    const premium = details['Premium'] || details['PREMIUM'] || '';
    const plan = details['PRODUCT PITCH'] || details['Plan'] || details['PLAN'] || '';
    const sum = details['Sum'] || details['SUM'] || details['Sum Insured'] || '';
    const email = details['Email'] || details['EMAIL'] || '';
    const dob = details['DOB'] || '';
    const type = details['Type'] || '';
    const insuredCount = details['Insured_Numbers'] || details['INSURED COUNT'] || '';
    const company = details['COMPANY'] || details['Company'] || '';
    const source = details['SOURCE'] || details['source'] || '';

    return {
      customer_name: fullName,
      phone_no: decPhone,
      'Policy No.': policyNo,
      'Premium': premium,
      'Plan': plan,
      'Sum': sum,
      expiry_date: formatDate(row.expiry_date),
      'DOB': dob,
      'Email': email,
      'Type': type,
      'Insured_Numbers': insuredCount,
      'Company': company,
      'Source': source,
      'Status': row.record_table === 'customers' ? (row.status || 'live') : 'rejected',
      attempt_count: row.attempt_count ?? 0,
      lead_id: row.lead_id || '',
      campaign_id: row.campaign_id || '',
      customer_details: details
    };
  });

  // 1. JSON output (matching query_result_*.json schema)
  const jsonOutput = processed.map(r => ({
    customer_name: r.customer_name,
    phone_no: r.phone_no,
    customer_details: r.customer_details,
    expiry_date: r.expiry_date,
    attempt_count: r.attempt_count
  }));

  const jsonPath = path.resolve(__dirname, `../query_result_${targetSourceId}.json`);
  fs.writeFileSync(jsonPath, JSON.stringify(jsonOutput, null, 2), 'utf8');
  console.log(`Saved JSON: ${jsonPath} (${jsonOutput.length} records)`);

  // 2. Excel Output with requested primary columns + extra useful metadata
  const excelRows = processed.map(r => ({
    'customer_name': r.customer_name,
    'phone_no': String(r.phone_no),
    'Policy No.': r['Policy No.'],
    'Premium': r['Premium'],
    'Plan': r['Plan'],
    'Sum': r['Sum'],
    'expiry_date': r.expiry_date,
    'DOB': r['DOB'],
    'Email': r['Email'],
    'Type': r['Type'],
    'Insured_Numbers': r['Insured_Numbers'],
    'Company': r['Company'],
    'Status': r['Status'],
    'attempt_count': r.attempt_count
  }));

  const worksheet = XLSX.utils.json_to_sheet(excelRows, {
    header: [
      'customer_name',
      'phone_no',
      'Policy No.',
      'Premium',
      'Plan',
      'Sum',
      'expiry_date',
      'DOB',
      'Email',
      'Type',
      'Insured_Numbers',
      'Company',
      'Status',
      'attempt_count'
    ]
  });

  worksheet['!cols'] = [
    { wch: 25 }, // customer_name
    { wch: 15 }, // phone_no
    { wch: 20 }, // Policy No.
    { wch: 15 }, // Premium
    { wch: 15 }, // Plan
    { wch: 12 }, // Sum
    { wch: 15 }, // expiry_date
    { wch: 14 }, // DOB
    { wch: 28 }, // Email
    { wch: 18 }, // Type
    { wch: 16 }, // Insured_Numbers
    { wch: 15 }, // Company
    { wch: 12 }, // Status
    { wch: 14 }  // attempt_count
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'SRC-PZGOC61W');

  const xlsxPath = path.resolve(__dirname, `../query_result_${targetSourceId}.xlsx`);
  XLSX.writeFile(workbook, xlsxPath);
  console.log(`Saved Excel: ${xlsxPath}`);
}

run().catch(console.error);
