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

function formatIST(dateStr) {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  } catch (e) {
    return dateStr;
  }
}

async function exportCallbacks() {
  console.log('Fetching user profiles and auth users...');
  const { data: allProfiles } = await supabase.from('user_profiles').select('*');
  const profileMap = {};
  allProfiles?.forEach(p => {
    if (p.user_id) profileMap[p.user_id] = p;
    if (p.id) profileMap[p.id] = p;
  });

  let allAuthUsers = [];
  let page = 1;
  let hasMore = true;
  while (hasMore) {
    const { data: uData, error } = await supabase.auth.admin.listUsers({ page, perPage: 100 });
    if (error || !uData?.users?.length) {
      hasMore = false;
    } else {
      allAuthUsers.push(...uData.users);
      if (uData.users.length < 100) hasMore = false;
      else page++;
    }
  }
  const authMap = {};
  allAuthUsers.forEach(u => {
    authMap[u.id] = {
      email: u.email,
      name: u.user_metadata?.display_name || u.user_metadata?.user_name || u.user_metadata?.name || u.email
    };
  });

  const { data: leads, error } = await supabase
    .from('inactive_leads')
    .select('*')
    .eq('source_id', 'SRC-LP-1TEALE')
    .eq('disposition', 'Call Back')
    .order('updated_at', { ascending: false });

  if (error) {
    console.error('Query error:', error);
    return;
  }

  console.log(`Found ${leads.length} Call Back leads in inactive_leads for SRC-LP-1TEALE`);

  const excelRows = leads.map(l => {
    const updaterId = l.last_updated_by;
    const prof = updaterId ? profileMap[updaterId] : null;
    const auth = updaterId ? authMap[updaterId] : null;

    const updaterName = prof?.user_name || prof?.name || auth?.name || updaterId || 'N/A';
    const updaterEmail = auth?.email || prof?.email || 'N/A';
    const updaterEmpId = prof?.employee_id || 'N/A';

    const deleterId = l.deleted_by;
    const delProf = deleterId ? profileMap[deleterId] : null;
    const delAuth = deleterId ? authMap[deleterId] : null;
    const deleterName = delProf?.user_name || delAuth?.name || deleterId || 'N/A';

    return {
      'customer_name': l.customer_name || '',
      'phone_no_encrypted': l.phone_no || '',
      'phone_no_decrypted': decryptPhone(l.phone_no),
      'disposition': l.disposition || '',
      'sub_disposition': l.sub_disposition || '',
      'last_updated_by': updaterName,
      'updater_email': updaterEmail,
      'updater_employee_id': updaterEmpId,
      'next_callback_time': formatIST(l.next_called_at),
      'disposition_updated_at': formatIST(l.updated_at),
      'live_notes': l.live_notes || l.notes || '',
      'deleted_by': deleterName,
      'deleted_at': formatIST(l.deleted_at),
      'source_id': l.source_id,
      'lead_id': l.lead_id || ''
    };
  });

  const worksheet = XLSX.utils.json_to_sheet(excelRows, {
    header: [
      'customer_name',
      'phone_no_encrypted',
      'phone_no_decrypted',
      'disposition',
      'sub_disposition',
      'last_updated_by',
      'updater_email',
      'updater_employee_id',
      'next_callback_time',
      'disposition_updated_at',
      'live_notes',
      'deleted_by',
      'deleted_at',
      'source_id',
      'lead_id'
    ]
  });

  worksheet['!cols'] = [
    { wch: 25 }, // customer_name
    { wch: 30 }, // phone_no_encrypted
    { wch: 15 }, // phone_no_decrypted
    { wch: 14 }, // disposition
    { wch: 16 }, // sub_disposition
    { wch: 20 }, // last_updated_by
    { wch: 28 }, // updater_email
    { wch: 15 }, // updater_employee_id
    { wch: 22 }, // next_callback_time
    { wch: 22 }, // disposition_updated_at
    { wch: 30 }, // live_notes
    { wch: 15 }, // deleted_by
    { wch: 22 }, // deleted_at
    { wch: 16 }, // source_id
    { wch: 22 }  // lead_id
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Call Back Leads');

  const outPath = path.resolve(__dirname, '../SRC-LP-1TEALE_inactive_callbacks.xlsx');
  XLSX.writeFile(workbook, outPath);
  console.log('Successfully written Excel file to:', outPath);

  // Print agent summary
  const agentSummary = {};
  excelRows.forEach(r => {
    const a = r.last_updated_by;
    agentSummary[a] = (agentSummary[a] || 0) + 1;
  });
  console.log('Agent breakdown for Call Backs:', agentSummary);
}

exportCallbacks().catch(console.error);

