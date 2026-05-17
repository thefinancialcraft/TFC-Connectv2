const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://qcglmkmhqvmkugaqvqih.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFjZ2xta21ocXZta3VnYXF2cWloIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NjQ5MDkxNSwiZXhwIjoyMDgyMDY2OTE1fQ.aaQXquGml4Cw0mlRufdgmw4hRbCQH_PnUXKO6nK7_OM';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function run() {
    const { data: orgs } = await supabase.from('organizations').select('*').ilike('company_name', '%financial craft%');
    console.log('Orgs:', orgs);
    if (orgs && orgs.length > 0) {
        const orgId = orgs[0].id;
        const { data: users } = await supabase.from('user_profiles').select('user_name, role, designation, organization_id, is_client').eq('organization_id', orgId);
        console.log('Users in org:', users);
        
        const { data: allUsers } = await supabase.from('user_profiles').select('user_name, role, designation, organization_id, is_client');
        console.log('Total users overall:', allUsers.length);
    }
}
run();
