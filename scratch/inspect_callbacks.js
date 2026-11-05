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

async function inspectCallBacks() {
  const { data, error } = await supabase
    .from('inactive_leads')
    .select('*')
    .eq('source_id', 'SRC-LP-1TEALE')
    .eq('disposition', 'Call Back')
    .order('updated_at', { ascending: false });

  if (error) {
    console.error('Error:', error);
    return;
  }

  console.log('Count of Call Back records:', data?.length);
  if (data && data.length > 0) {
    console.log('Sample record:');
    console.log({
      customer_name: data[0].customer_name,
      phone_no: data[0].phone_no,
      disposition: data[0].disposition,
      sub_disposition: data[0].sub_disposition,
      last_updated_by: data[0].last_updated_by,
      assigned_to: data[0].assigned_to,
      deleted_by: data[0].deleted_by,
      deleted_at: data[0].deleted_at,
      updated_at: data[0].updated_at,
      next_called_at: data[0].next_called_at,
      notes: data[0].notes,
      live_notes: data[0].live_notes
    });

    const updatedBySet = new Set(data.map(r => r.last_updated_by));
    const assignedToSet = new Set(data.map(r => r.assigned_to));
    const deletedBySet = new Set(data.map(r => r.deleted_by));

    console.log('last_updated_by values:', Array.from(updatedBySet));
    console.log('assigned_to values:', Array.from(assignedToSet));
    console.log('deleted_by values:', Array.from(deletedBySet));

    // Resolve user IDs from auth.users or user_profiles
    const allUserIds = Array.from(new Set([...updatedBySet, ...assignedToSet, ...deletedBySet])).filter(Boolean);
    const { data: profiles, error: pErr } = await supabase
      .from('user_profiles')
      .select('id, user_name, employee_id, role, designation')
      .in('id', allUserIds);

    console.log('Resolved user profiles:', profiles, pErr ? pErr.message : '');

    // Also check auth.users via admin API
    const { data: authUsers } = await supabase.auth.admin.listUsers();
    const authMap = {};
    authUsers?.users?.forEach(u => {
      authMap[u.id] = { email: u.email, name: u.user_metadata?.display_name || u.user_metadata?.user_name || u.email };
    });
    console.log('Auth users matched:', allUserIds.map(id => ({ id, ...authMap[id] })));
  }
}

inspectCallBacks().catch(console.error);

