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

async function exportAll() {
  const targetSourceId = 'SRC-5SEZB1XZ';
  console.log(`Fetching data for ${targetSourceId}...`);

  // 1. Fetch from customers table
  const { data: custs, error: cErr } = await supabase
    .from('customers')
    .select('*')
    .eq('source_id', targetSourceId)
    .order('created_at', { ascending: true });

  if (cErr) {
    console.error('Error fetching customers:', cErr);
    return;
  }

  // 2. Fetch from rejected_leads table
  const { data: rejs, error: rErr } = await supabase
    .from('rejected_leads')
    .select('*')
    .eq('source_id', targetSourceId)
    .order('created_at', { ascending: true });

  if (rErr) {
    console.error('Error fetching rejected_leads:', rErr);
    return;
  }

  console.log(`Fetched ${custs.length} active/pending customers and ${rejs.length} rejected leads.`);

  const allRecords = [
    ...custs.map(r => ({ ...r, record_table: 'customers' })),
    ...rejs.map(r => ({ ...r, record_table: 'rejected_leads' }))
  ];

  // Process rows
  const processedRows = allRecords.map(row => {
    const decPhone = decryptPhone(row.phone_no);
    const details = extractDetails(row.customer_details);
    const formattedExpiry = formatDate(row.expiry_date);
    
    // Construct full customer name if last name exists
    const lastName = details['LAST NAME'] || '';
    const fullName = lastName ? `${row.customer_name} ${lastName}`.trim() : (row.customer_name || '');

    return {
      raw_customer_name: row.customer_name || '',
      last_name: lastName,
      full_name: fullName,
      phone_no: decPhone,
      expiry_date: formattedExpiry,
      raw_expiry_date: row.expiry_date || '',
      email: details['EMAIL'] || '',
      dob: details['DOB'] || '',
      type: details['Type'] || '',
      tenure: details['Tenure'] || '',
      premium: details['Premium'] || '',
      insured_count: details['INSURED COUNT'] || '',
      company: details['Company'] || '',
      product_pitch: details['Product pitch'] || '',
      source_detail: details['source'] || '',
      details_obj: details,
      details_json: JSON.stringify(details),
      table_status: row.record_table === 'customers' ? (row.status || 'active') : 'rejected',
      disposition: row.disposition || '',
      sub_disposition: row.sub_disposition || '',
      attempt_count: row.attempt_count ?? 0,
      lead_id: row.lead_id || '',
      created_at: row.created_at || ''
    };
  });

  // 1. Generate JSON matching query_result_SRC-*.json format
  const jsonOutput = processedRows.map(r => ({
    customer_name: r.full_name,
    phone_no: r.phone_no,
    customer_details: r.details_obj,
    expiry_date: r.expiry_date,
    attempt_count: r.attempt_count
  }));
  const jsonPath = path.resolve(__dirname, `../query_result_${targetSourceId}.json`);
  fs.writeFileSync(jsonPath, JSON.stringify(jsonOutput, null, 2), 'utf8');
  console.log(`Saved JSON: ${jsonPath} (${jsonOutput.length} records)`);

  // 2. Generate 4-column CSV exactly matching user prompt:
  // customer name, phone no, expiry, customer details
  const fourColHeader = ['customer name', 'phone no', 'expiry', 'customer details'];
  const fourColRows = processedRows.map(r => [
    escapeCsv(r.full_name),
    escapeCsv(r.phone_no),
    escapeCsv(r.expiry_date),
    escapeCsv(r.details_json)
  ]);
  const fourColCsvContent = [fourColHeader.join(','), ...fourColRows.map(row => row.join(','))].join('\n');
  const fourColCsvPath = path.resolve(__dirname, `../${targetSourceId}_customer_data.csv`);
  fs.writeFileSync(fourColCsvPath, fourColCsvContent, 'utf8');
  console.log(`Saved 4-col CSV: ${fourColCsvPath}`);

  // 3. Generate comprehensive detailed CSV with individual columns for easy Excel viewing
  const detailedHeaders = [
    'Customer Name',
    'Phone No',
    'Expiry Date',
    'Email',
    'DOB',
    'Plan Type',
    'Tenure',
    'Premium',
    'Insured Count',
    'Company',
    'Product Pitch',
    'Source Detail',
    'Status',
    'Disposition',
    'Sub Disposition',
    'Attempts',
    'Lead ID',
    'Customer Details (JSON)'
  ];

  const detailedRows = processedRows.map(r => [
    escapeCsv(r.full_name),
    escapeCsv(r.phone_no),
    escapeCsv(r.expiry_date),
    escapeCsv(r.email),
    escapeCsv(r.dob),
    escapeCsv(r.type),
    escapeCsv(r.tenure),
    escapeCsv(r.premium),
    escapeCsv(r.insured_count),
    escapeCsv(r.company),
    escapeCsv(r.product_pitch),
    escapeCsv(r.source_detail),
    escapeCsv(r.table_status),
    escapeCsv(r.disposition),
    escapeCsv(r.sub_disposition),
    escapeCsv(r.attempt_count),
    escapeCsv(r.lead_id),
    escapeCsv(r.details_json)
  ]);
  const detailedCsvContent = [detailedHeaders.join(','), ...detailedRows.map(row => row.join(','))].join('\n');
  const detailedCsvPath = path.resolve(__dirname, `../${targetSourceId}_detailed_decrypted.csv`);
  fs.writeFileSync(detailedCsvPath, detailedCsvContent, 'utf8');
  console.log(`Saved detailed CSV: ${detailedCsvPath}`);
}

exportAll();
