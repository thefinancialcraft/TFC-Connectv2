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

const rawData = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'phone_lookup_raw.json'), 'utf8'));

const rawNumbers = [
  "9746316289", "9426877500", "9426877500", "9415016263", "9741712578",
  "9980069356", "9892516010", "7045134235", "9833205247", "9718050047",
  "9019110973", "9898570864", "9449721505", "9937502332", "8707618884",
  "9945783307", "9580166637", "9772607773", "7502684200", "9934710042",
  "9934710042", "9952909289", "9952909289", "8929179032", "9874176452",
  "9015100899", "7909160006", "7909160006", "9449721505", "9650204508",
  "8294476569", "9775515029", "9775515029", "9725073836", "7083707488",
  "9109949484", "9444531105", "9993090774", "9838885545", "9500483850",
  "7048990242", "8089140754", "9894962045", "7007703602", "9810368521",
  "9944521670", "8500669977", "8500669977", "7259016062", "7259016062",
  "7259016062", "9355679471", "9967920363", "9599646163", "7531966341",
  "6394705108", "9731038210", "8478047366", "9754143214", "9350912470",
  "9501332211", "7356755211", "9910235666", "9663926534", "9930181677"
];

function getClean10(phone) {
  const dec = decryptPhone(phone);
  return String(dec).replace(/\D/g, '').slice(-10);
}

function getSourceFromDetails(detailsRaw) {
  if (!detailsRaw) return null;
  const cd = typeof detailsRaw === 'string' ? JSON.parse(detailsRaw) : detailsRaw;
  const searchObj = (obj) => {
    if (!obj || typeof obj !== 'object') return null;
    for (const [k, v] of Object.entries(obj)) {
      const cleanK = k.replace(/_checked$/i, '').trim().toLowerCase();
      if (cleanK.includes('source') || cleanK.includes('spource')) {
        return { key: k.replace(/_checked$/i, ''), val: v };
      }
    }
    return null;
  };

  if (cd.history && typeof cd.history === 'object') {
    if (cd.active_details && cd.history[cd.active_details]) {
      const res = searchObj(cd.history[cd.active_details]);
      if (res) return res;
    }
    for (const hKey of Object.keys(cd.history)) {
      const res = searchObj(cd.history[hKey]);
      if (res) return res;
    }
  }
  return searchObj(cd);
}

const byPhone = {};
// Priority order: closed_deals -> rejected_leads -> customers -> inactive_leads
for (const table of ['closed_deals', 'rejected_leads', 'customers', 'inactive_leads']) {
  for (const row of (rawData[table] || [])) {
    const p10 = getClean10(row.phone_no);
    if (!byPhone[p10]) byPhone[p10] = [];
    const srcInfo = getSourceFromDetails(row.customer_details);
    byPhone[p10].push({
      table,
      customer_name: row.customer_name,
      source_id: row.source_id,
      custom_source: srcInfo ? srcInfo.val : null,
      custom_key: srcInfo ? srcInfo.key : null
    });
  }
}

rawNumbers.forEach((num, idx) => {
  const matches = byPhone[num] || [];
  if (matches.length === 0) {
    console.log(`${idx + 1} | ${num} | Not Found | - | - | -`);
  } else {
    // Primary match according to priority: closed_deals -> rejected_leads -> customers -> inactive_leads
    // If multiple in closed_deals with different custom_source, show all
    const dealDoneMatches = matches.filter(m => m.table === 'closed_deals');
    const rejectedMatches = matches.filter(m => m.table === 'rejected_leads');
    const otherMatches = matches.filter(m => m.table !== 'closed_deals' && m.table !== 'rejected_leads');

    let chosen = dealDoneMatches.length > 0 ? dealDoneMatches : (rejectedMatches.length > 0 ? rejectedMatches : otherMatches);
    const tablesStr = Array.from(new Set(matches.map(m => m.table))).join(', ');
    const primaryTable = chosen[0].table;
    const names = Array.from(new Set(chosen.map(m => m.customer_name))).join(' / ');
    const sources = Array.from(new Set(chosen.map(m => m.custom_source).filter(Boolean))).join(' / ') || '*(No source field in custom fields)*';
    const srcIds = Array.from(new Set(chosen.map(m => m.source_id).filter(Boolean))).join(' / ');
    console.log(`${idx + 1} | ${num} | ${primaryTable} (${tablesStr}) | ${names} | ${sources} | ${srcIds}`);
  }
});

