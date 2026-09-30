const SMARTFLO_EXPIRY_DAYS = [15, 30, 90];

function normalizeExpiryDays(value) {
  const candidate = Number(value);
  if (Number.isFinite(candidate)) {
    const normalized = SMARTFLO_EXPIRY_DAYS.find((option) => option === candidate)
      || SMARTFLO_EXPIRY_DAYS.reduce((closest, option) => {
        const currentDiff = Math.abs(option - candidate);
        const closestDiff = Math.abs(closest - candidate);
        return currentDiff < closestDiff ? option : closest;
      }, SMARTFLO_EXPIRY_DAYS[0]);
    return normalized;
  }
  return SMARTFLO_EXPIRY_DAYS.includes(30) ? 30 : SMARTFLO_EXPIRY_DAYS[0];
}

function formatSmartfloTimestamp(value) {
  if (!value) {
    return 'Not configured';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  const day = String(date.getUTCDate()).padStart(2, '0');
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const year = date.getUTCFullYear();
  const hours = String(date.getUTCHours()).padStart(2, '0');
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');
  const seconds = String(date.getUTCSeconds()).padStart(2, '0');

  return `${day}/${month}/${year}, ${hours}:${minutes}:${seconds}`;
}

function calculateSmartfloExpiryDate(createdDate, expiryDays) {
  const createdAt = Date.parse(`${createdDate}T00:00:00.000Z`);
  return new Date(createdAt + (expiryDays + 1) * 86_400_000 - 72 * 60 * 60 * 1000).toISOString();
}

module.exports = {
  SMARTFLO_EXPIRY_DAYS,
  normalizeExpiryDays,
  formatSmartfloTimestamp,
  calculateSmartfloExpiryDate,
};