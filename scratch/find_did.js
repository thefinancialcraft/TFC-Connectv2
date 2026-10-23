const { createCipheriv, createDecipheriv, createHash } = require('crypto');

const secret = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFjZ2xta21ocXZta3VnYXF2cWloIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NjQ5MDkxNSwiZXhwIjoyMDgyMDY2OTE1fQ.aaQXquGml4Cw0mlRufdgmw4hRbCQH_PnUXKO6nK7_OM';
const encryptedToken = 'v1:XK3++PSXdMWt92TO:vacGPx1eYBDat84aLYZojA==:Ib5Vf7Aj7aMyMxDSJ0QJBaRWfTRPYR0lZUTqkHMrd7jS+i9+CcJChor8DVjrQ09IzthEUtkkEv2fJHJUqbugVoVr01hkLhrT1w/yEslo5bgygAS68srNeSEK729oV5RvRN6HtyWEbFdmchWYLM4P6PBqzxvzhwig0RM7MbO+B1bvdogYGjv4gXn2DvruLBmmF0KQhoCrhPcYqv5w7/cpMsislbdT8x/FLVmLY4h7CUZoJ4WSv/3zuDLdWQXBlovPJcro/PwGfbNvZ8CTyPsk1H4HJoCFis4mtIMA6fqYFY/0snhv70ij/2H7HwzNYIlgipop3S87StkxQ9AJjnZNZDx4/GdFWkhpN4+wZWPTRWqrYLviwTpk2+3qqrkRtEvWoo27s5XJebsz1t/C8OYxRVhZOuQEBvfl75ZN';

function decryptSmartfloToken(encryptedToken) {
  const [version, encodedIv, encodedAuthTag, encodedCiphertext] = encryptedToken.split(':');
  const key = createHash('sha256').update(secret).digest();
  const decipher = createDecipheriv('aes-256-gcm', key, Buffer.from(encodedIv, 'base64'));
  decipher.setAuthTag(Buffer.from(encodedAuthTag, 'base64'));
  return Buffer.concat([
    decipher.update(Buffer.from(encodedCiphertext, 'base64')),
    decipher.final(),
  ]).toString('utf8');
}

async function main() {
  const token = decryptSmartfloToken(encryptedToken);

  const res = await fetch('https://api-smartflo.tatateleservices.com/v1/call/records?limit=50', {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
  });
  const data = await res.json();
  const dids = new Set();
  const details = [];
  for (const r of data.results || []) {
    if (r.did_number) dids.add(r.did_number);
    details.push({
      date: r.date,
      time: r.time,
      direction: r.direction,
      service: r.service,
      did_number: r.did_number,
      agent_name: r.agent_name,
      agent_number: r.agent_number,
      client_number: r.client_number,
      status: r.status,
    });
  }
  console.log('Unique DIDs found in recent calls:', Array.from(dids));
  console.log('Recent 5 calls details:', JSON.stringify(details.slice(0, 5), null, 2));
}

main();
