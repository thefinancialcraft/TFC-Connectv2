/**
 * Formats a date string into DD/MM/YYYY format safely.
 */
export const formatDate = (dateString: string | null): string => {
  if (!dateString) return "—";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "—";
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  } catch (e) {
    return "—";
  }
};

/**
 * Calculates a new expiry date based on the current expiry and months to add.
 * The logic follows the TFC Connect formula: 
 * 1. Find the target month
 * 2. Get the last day of that month
 * 3. Add one day (making it the first day of the subsequent month)
 */
export const calculateNewExpiryDate = (currentExpiryStr: string | null, monthsToAdd: number): string => {
  const currentExpiry = currentExpiryStr ? new Date(currentExpiryStr) : new Date();
  
  // Calculate target year and month
  const currentMonth = currentExpiry.getMonth();
  const currentYear = currentExpiry.getFullYear();
  const targetMonth = currentMonth + monthsToAdd;
  
  // Create date for the first day of target month
  const targetDate = new Date(currentYear, targetMonth, 1);
  
  // Get the last day of that month by going to next month's day 0
  const lastDay = new Date(targetDate.getFullYear(), targetDate.getMonth() + 1, 0);
  
  // Add one extra day (TFC logic: next month's 1st)
  lastDay.setDate(lastDay.getDate() + 1);
  
  return lastDay.toISOString().split('T')[0];
};

/**
 * Calculates number of months between current date and a target (year, month).
 */
export const calculateMonthsToTarget = (customYear: string, customMonth: string): number => {
  const currentDate = new Date();
  const targetDate = new Date(parseInt(customYear), parseInt(customMonth) - 1, 1);
  return (targetDate.getFullYear() - currentDate.getFullYear()) * 12 + (targetDate.getMonth() - currentDate.getMonth());
};
