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

async function findUsers() {
  const { data: profiles } = await supabase.from('user_profiles').select('*').limit(3);
  if (profiles && profiles.length > 0) {
    console.log('user_profiles columns:', Object.keys(profiles[0]));
    console.log('sample profile:', profiles[0]);
  }

  // Also check all profiles
  const { data: allProfiles } = await supabase.from('user_profiles').select('*');
  console.log('Total user_profiles in DB:', allProfiles?.length);
  const profileMap = {};
  allProfiles?.forEach(p => {
    // Check possible ID columns
    const id = p.id || p.user_id || p.auth_user_id;
    profileMap[id] = p;
  });

  // Also get auth users (with pagination if > 50)
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
  console.log('Total auth users in DB:', allAuthUsers.length);
  const authMap = {};
  allAuthUsers.forEach(u => {
    authMap[u.id] = {
      email: u.email,
      name: u.user_metadata?.display_name || u.user_metadata?.user_name || u.user_metadata?.name || u.email,
      phone: u.user_metadata?.phone || u.phone
    };
  });

  // Now query the 30 inactive_leads
  const { data: leads } = await supabase
    .from('inactive_leads')
    .select('*')
    .eq('source_id', 'SRC-LP-1TEALE')
    .eq('disposition', 'Call Back')
    .order('updated_at', { ascending: false });

  console.log('30 leads matched. Resolving last_updated_by:');
  const resolved = leads.map(l => {
    const updaterId = l.last_updated_by;
    const prof = updaterId ? (profileMap[updaterId] || allProfiles?.find(p => p.id === updaterId || p.user_id === updaterId)) : null;
    const auth = updaterId ? authMap[updaterId] : null;

    const updaterName = prof?.user_name || prof?.name || auth?.name || auth?.email || updaterId || 'Unknown';
    const updaterEmail = auth?.email || prof?.email || '';

    const deleterId = l.deleted_by;
    const delAuth = deleterId ? authMap[deleterId] : null;
    const delProf = deleterId ? (profileMap[deleterId] || allProfiles?.find(p => p.id === deleterId || p.user_id === deleterId)) : null;
    const deleterName = delProf?.user_name || delAuth?.name || delAuth?.email || deleterId || '';

    return {
      customer_name: l.customer_name,
      phone_no: l.phone_no,
      disposition: l.disposition,
      sub_disposition: l.sub_disposition,
      last_updated_by_id: updaterId,
      last_updated_by_name: updaterName,
      last_updated_by_email: updaterEmail,
      next_called_at: l.next_called_at,
      updated_at: l.updated_at,
      deleted_by_name: deleterName,
      live_notes: l.live_notes || l.notes || ''
    };
  });

  console.table(resolved.slice(0, 10));
}

findUsers().catch(console.error);

