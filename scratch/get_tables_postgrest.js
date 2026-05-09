
const projectRef = 'qcglmkmhqvmkugaqvqih';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFjZ2xta21ocXZta3VnYXF2cWloIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NjQ5MDkxNSwiZXhwIjoyMDgyMDY2OTE1fQ.aaQXquGml4Cw0mlRufdgmw4hRbCQH_PnUXKO6nK7_OM';

async function getTables() {
  const url = `https://${projectRef}.supabase.co/rest/v1/`;
  try {
    const response = await fetch(url, {
      headers: {
        'apikey': serviceRoleKey,
        'Authorization': `Bearer ${serviceRoleKey}`
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      const tables = Object.keys(data.definitions || {});
      console.log(`Total Tables Found: ${tables.length}`);
      console.log('Tables:', tables.join(', '));
    } else {
      console.error(`Error: ${response.status} ${response.statusText}`);
      console.log(await response.text());
    }
  } catch (e) {
    console.error(e);
  }
}

getTables();
