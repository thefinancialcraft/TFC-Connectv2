
const PAT = 'sbp_51dd6294ac3bfd9e5fcf9846b31fbe3455244474';
const projectRef = 'qcglmkmhqvmkugaqvqih';

async function explore() {
  const endpoints = [
    `https://api.supabase.com/v1/projects/${projectRef}`,
    `https://api.supabase.com/v1/projects/${projectRef}/api-keys`,
    `https://api.supabase.com/v1/projects/${projectRef}/config/database`,
  ];

  for (const url of endpoints) {
    console.log(`\nTesting ${url}...`);
    try {
      const response = await fetch(url, {
        headers: { 'Authorization': `Bearer ${PAT}` }
      });
      console.log(`Status: ${response.status}`);
      if (response.ok) {
        const data = await response.json();
        console.log(JSON.stringify(data, null, 2));
      } else {
        console.log(await response.text());
      }
    } catch (e) {
      console.error(e);
    }
  }
}

explore();
