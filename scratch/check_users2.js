const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://qcglmkmhqvmkugaqvqih.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFjZ2xta21ocXZta3VnYXF2cWloIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NjQ5MDkxNSwiZXhwIjoyMDgyMDY2OTE1fQ.aaQXquGml4Cw0mlRufdgmw4hRbCQH_PnUXKO6nK7_OM';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function run() {
    const orgId = '5fda76df-9265-46e0-a602-0c5301c8084c';
    
    // WITHOUT NEQ
    const { data: users1 } = await supabase.from('user_profiles').select('user_name, approval_status').eq('organization_id', orgId);
    console.log('Without neq count:', users1.length);
    console.log('Sample approval statuses:', users1.slice(0, 5).map(u => u.approval_status));
    
    // WITH NEQ
    const { data: users2 } = await supabase.from('user_profiles').select('user_name').eq('organization_id', orgId).neq('approval_status', 'rejected');
    console.log('With neq count:', users2 ? users2.length : 0);
}
run();
