const test = require('node:test');
const assert = require('node:assert/strict');

const { calculateSmartfloExpiryDate, formatSmartfloTimestamp, normalizeExpiryDays, SMARTFLO_EXPIRY_DAYS } = require('../lib/smartfloUi.js');

test('formats Smartflo datetimes as dd/mm/yyyy, hh:mm:ss', () => {
  assert.equal(formatSmartfloTimestamp('2026-09-29T01:15:18.000Z'), '29/09/2026, 01:15:18');
});

test('normalizes expiry windows from supported days', () => {
  assert.deepEqual(SMARTFLO_EXPIRY_DAYS, [15, 30, 90]);
  assert.equal(normalizeExpiryDays(15), 15);
  assert.equal(normalizeExpiryDays(10), 15);
  assert.equal(normalizeExpiryDays('30'), 30);
});

test('calculates expiry at midnight with a 72-hour offset', () => {
  assert.equal(calculateSmartfloExpiryDate('2026-09-30', 15), '2026-10-13T00:00:00.000Z');
});
