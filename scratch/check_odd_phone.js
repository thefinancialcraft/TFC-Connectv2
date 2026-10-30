const fs = require('fs');
const path = require('path');

const data = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../query_result_SRC-TAHYZ986.json'), 'utf8'));

const nonStandard = data.filter(d => !/^\d{10}$/.test(d.phone_no));
console.log('Non 10-digit records:', JSON.stringify(nonStandard, null, 2));
