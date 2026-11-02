/**
 * Shared date range utilities for dashboard APIs
 * All calculations are standardized to Asia/Kolkata (IST)
 */

export function getISTDateRange(filter: string) {
  const now = new Date();
  
  // Get date string in YYYY-MM-DD for IST
  const istDateString = now.toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
  
  // Midnight IST in ISO format
  const todayStart = new Date(`${istDateString}T00:00:00+05:30`).toISOString();
  // End of day IST in ISO format
  const todayEnd = new Date(`${istDateString}T23:59:59+05:30`).toISOString();

  let start = todayStart;
  let end = todayEnd;

  switch (filter) {
    case "yesterday": {
      const yesterday = new Date(`${istDateString}T00:00:00+05:30`);
      yesterday.setDate(yesterday.getDate() - 1);
      const yStr = yesterday.toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
      start = new Date(`${yStr}T00:00:00+05:30`).toISOString();
      end = new Date(`${yStr}T23:59:59+05:30`).toISOString();
      break;
    }
    case "this_week": {
      const d = new Date(`${istDateString}T00:00:00+05:30`);
      const day = d.getDay();
      const diff = day === 0 ? -6 : 1 - day; // Monday
      d.setDate(d.getDate() + diff);
      const monStr = d.toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
      start = new Date(`${monStr}T00:00:00+05:30`).toISOString();
      break;
    }
    case "last_7_days": {
      const d = new Date(now);
      d.setDate(d.getDate() - 7);
      start = d.toISOString();
      break;
    }
    case "this_month": {
      const parts = istDateString.split("-");
      start = new Date(`${parts[0]}-${parts[1]}-01T00:00:00+05:30`).toISOString();
      break;
    }
    case "last_month": {
      const parts = istDateString.split("-");
      let year = parseInt(parts[0]);
      let month = parseInt(parts[1]) - 1;
      if (month === 0) {
        month = 12;
        year--;
      }
      const prevMonthStr = month.toString().padStart(2, '0');
      start = new Date(`${year}-${prevMonthStr}-01T00:00:00+05:30`).toISOString();
      
      const lastDay = new Date(year, month, 0).getDate();
      end = new Date(`${year}-${prevMonthStr}-${lastDay}T23:59:59+05:30`).toISOString();
      break;
    }
    case "this_year":
      const yStr = istDateString.split("-")[0];
      start = new Date(`${yStr}-01-01T00:00:00+05:30`).toISOString();
      break;
    case "multi_year":
      const yearInt = parseInt(istDateString.split("-")[0]);
      start = new Date(`${yearInt - 3}-01-01T00:00:00+05:30`).toISOString();
      break;
    case "all_time":
      start = "2020-01-01T00:00:00.000Z";
      break;
  }

  return { start, end };
}

/**
 * Basic date formatter for display
 */
export function formatDate(date: string | Date | null) {
  if (!date) return "N/A";
  const d = new Date(date);
  if (isNaN(d.getTime())) return "N/A";
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/**
 * Calculates new expiry date by adding months to an existing string or now
 */
export function calculateNewExpiryDate(currentExpiry: string | null, monthsToAdd: number) {
  const baseDate = currentExpiry ? new Date(currentExpiry) : new Date();
  if (isNaN(baseDate.getTime())) return new Date().toISOString().split('T')[0];
  
  const newDate = new Date(baseDate);
  newDate.setMonth(newDate.getMonth() + monthsToAdd);
  
  return newDate.toISOString().split('T')[0];
}

/**
 * Calculates months from now to a specific target month/year
 */
export function calculateMonthsToTarget(year: string | number, month: string | number) {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth(); // 0-11
  
  const targetYear = typeof year === 'string' ? parseInt(year) : year;
  const targetMonth = typeof month === 'string' ? parseInt(month) : month;
  
  if (isNaN(targetYear) || isNaN(targetMonth)) return 0;
  
  // Note: targetMonth expected as 1-12 from UI select, convert to 0-11
  return (targetYear - currentYear) * 12 + (targetMonth - 1 - currentMonth);
}

/**
 * Flexible & robust date parser for file uploads (CSV, XLSX, Google Sheets exports)
 * Supports:
 * - Date objects
 * - Excel serial dates (e.g. 46092 -> year 2026, avoids year +046092 bug)
 * - DD-MM-YYYY / DD/MM/YYYY / DD.MM.YYYY (Indian standard)
 * - YYYY-MM-DD / YYYY/MM/DD (ISO standard)
 * - MM-DD-YYYY fallback if day is > 12 in 2nd slot
 * - ISO timestamps
 * - Strict year boundaries (1970 - 2100) preventing PostgreSQL out-of-range displacement errors
 */
export function parseFlexibleDate(
  val: any,
  outputFormat: 'iso' | 'dateOnly' = 'iso'
): string | null {
  if (val === null || val === undefined || val === '') return null;

  // 1. If already a Date object
  if (val instanceof Date) {
    if (!isNaN(val.getTime())) {
      const y = val.getUTCFullYear();
      if (y >= 1970 && y <= 2100) {
        return outputFormat === 'dateOnly' ? val.toISOString().split('T')[0] : val.toISOString();
      }
    }
    return null;
  }

  const clean = String(val).replace(/₹/g, '').trim();
  if (!clean) return null;

  // 2. Check if it's an Excel serial number (approx range 20000 to 80000 -> 1954 to 2119)
  // When SheetJS reads Excel dates without cellDates:true, they appear as numbers (e.g. 46092)
  // If passed directly to new Date("46092"), V8 parses it as year +046092, crashing Postgres!
  if (!clean.includes('-') && !clean.includes('/') && !clean.includes('.') && !clean.includes(':')) {
    const num = Number(clean);
    if (!isNaN(num) && num >= 20000 && num <= 80000) {
      // Excel epoch: 25569 days between 1900-01-01 and 1970-01-01 (including Excel 1900 leap day bug)
      const d = new Date(Math.round((num - 25569) * 86400 * 1000));
      if (!isNaN(d.getTime())) {
        const y = d.getUTCFullYear();
        if (y >= 1970 && y <= 2100) {
          return outputFormat === 'dateOnly' ? d.toISOString().split('T')[0] : d.toISOString();
        }
      }
    }
  }

  // 3. YYYY-MM-DD or YYYY/MM/DD or YYYY.MM.DD
  const ymdMatch = clean.match(/^(\d{4})[\/\-\.](\d{1,2})[\/\-\.](\d{1,2})(?:[T\s](\d{1,2}):(\d{1,2})(?::(\d{1,2}))?)?/);
  if (ymdMatch) {
    const y = parseInt(ymdMatch[1], 10);
    const m = parseInt(ymdMatch[2], 10);
    const d = parseInt(ymdMatch[3], 10);
    const hh = ymdMatch[4] ? parseInt(ymdMatch[4], 10) : 0;
    const mm = ymdMatch[5] ? parseInt(ymdMatch[5], 10) : 0;
    const ss = ymdMatch[6] ? parseInt(ymdMatch[6], 10) : 0;
    if (m >= 1 && m <= 12 && d >= 1 && d <= 31) {
      const date = new Date(Date.UTC(y, m - 1, d, hh, mm, ss));
      if (!isNaN(date.getTime()) && y >= 1970 && y <= 2100) {
        return outputFormat === 'dateOnly' ? date.toISOString().split('T')[0] : date.toISOString();
      }
    }
  }

  // 4. DD-MM-YYYY or DD/MM/YYYY or DD.MM.YYYY
  const dmyMatch = clean.match(/^(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{2,4})(?:[T\s](\d{1,2}):(\d{1,2})(?::(\d{1,2}))?)?/);
  if (dmyMatch) {
    let p1 = parseInt(dmyMatch[1], 10);
    let p2 = parseInt(dmyMatch[2], 10);
    let y = parseInt(dmyMatch[3], 10);
    if (y < 100) y += y > 50 ? 1900 : 2000;
    const hh = dmyMatch[4] ? parseInt(dmyMatch[4], 10) : 0;
    const mm = dmyMatch[5] ? parseInt(dmyMatch[5], 10) : 0;
    const ss = dmyMatch[6] ? parseInt(dmyMatch[6], 10) : 0;

    let day = p1;
    let month = p2;
    // If p2 > 12 and p1 <= 12, it is MM-DD-YYYY format
    if (p1 <= 12 && p2 > 12) {
      month = p1;
      day = p2;
    }
    if (month >= 1 && month <= 12 && day >= 1 && day <= 31) {
      const date = new Date(Date.UTC(y, month - 1, day, hh, mm, ss));
      if (!isNaN(date.getTime()) && y >= 1970 && y <= 2100) {
        return outputFormat === 'dateOnly' ? date.toISOString().split('T')[0] : date.toISOString();
      }
    }
  }

  // 5. Fallback for ISO strings or other parseable dates with strict year bounds
  try {
    const fallback = new Date(clean);
    if (!isNaN(fallback.getTime())) {
      const y = fallback.getUTCFullYear();
      if (y >= 1970 && y <= 2100) {
        return outputFormat === 'dateOnly' ? fallback.toISOString().split('T')[0] : fallback.toISOString();
      }
    }
  } catch (e) {}

  return null;
}
