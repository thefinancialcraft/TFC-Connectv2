
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://qcglmkmhqvmkugaqvqih.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFjZ2xta21ocXZta3VnYXF2cWloIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NjQ5MDkxNSwiZXhwIjoyMDgyMDY2OTE1fQ.aaQXquGml4Cw0mlRufdgmw4hRbCQH_PnUXKO6nK7_OM';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkCallHistory() {
    console.log('Checking call_history columns...');
    const { data, error } = await supabase.from('call_history').select('*').limit(1);
    if (error) {
        console.error('Error selecting from call_history:', error);
    } else {
        console.log('Call history sample columns:', Object.keys(data[0] || {}));
    }
}

checkCallHistory();
