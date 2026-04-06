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
