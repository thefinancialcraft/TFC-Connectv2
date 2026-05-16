
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://qcglmkmhqvmkugaqvqih.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFjZ2xta21ocXZta3VnYXF2cWloIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NjQ5MDkxNSwiZXhwIjoyMDgyMDY2OTE1fQ.aaQXquGml4Cw0mlRufdgmw4hRbCQH_PnUXKO6nK7_OM';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function addIndexes() {
    console.log('Adding performance indexes...');
    
    // We can't run DDL via the standard Supabase client easily without RPC.
    // Let's check if there's an 'exec_sql' RPC (common in some setups).
    
    const sqlCommands = [
        'CREATE INDEX IF NOT EXISTS idx_call_history_timestamp ON call_history(timestamp);',
        'CREATE INDEX IF NOT EXISTS idx_call_history_employee_id ON call_history(employee_id);',
        'CREATE INDEX IF NOT EXISTS idx_call_history_org_id ON call_history(organization_id);',
        'CREATE INDEX IF NOT EXISTS idx_customers_created_at ON customers(created_at);',
        'CREATE INDEX IF NOT EXISTS idx_customers_assigned_to ON customers(assigned_to);',
        'CREATE INDEX IF NOT EXISTS idx_customers_org_id ON customers(organization_id);'
    ];

    for (const sql of sqlCommands) {
        console.log(`Running: ${sql}`);
        // This might fail if the RPC doesn't exist
        const { data, error } = await supabase.rpc('exec_sql', { sql_string: sql });
        if (error) {
            console.error(`Error running SQL: ${error.message}`);
        } else {
            console.log(`Success: ${sql}`);
        }
    }
}

addIndexes();
