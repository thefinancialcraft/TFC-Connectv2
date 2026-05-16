
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://qcglmkmhqvmkugaqvqih.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFjZ2xta21ocXZta3VnYXF2cWloIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NjQ5MDkxNSwiZXhwIjoyMDgyMDY2OTE1fQ.aaQXquGml4Cw0mlRufdgmw4hRbCQH_PnUXKO6nK7_OM';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkTable() {
    console.log('Checking utility_data table...');
    const { data, error } = await supabase.from('utility_data').select('*').limit(1);
    if (error) {
        console.error('Error selecting from utility_data:', error);
    } else {
        console.log('Successfully selected from utility_data. Count:', data.length);
    }

    console.log('\nChecking rejected_leads schema (columns)...');
    const { data: rejected, error: rejectedError } = await supabase.from('rejected_leads').select('*').limit(1);
    if (rejectedError) {
        console.error('Error selecting from rejected_leads:', rejectedError);
    } else {
        console.log('Rejected leads sample columns:', Object.keys(rejected[0] || {}));
    }

    console.log('\nChecking closed_deals schema (columns)...');
    const { data: closed, error: closedError } = await supabase.from('closed_deals').select('*').limit(1);
    if (closedError) {
        console.error('Error selecting from closed_deals:', closedError);
    } else {
        console.log('Closed deals sample columns:', Object.keys(closed[0] || {}));
    }
}

checkTable();
