export function getTodayStart() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

export function getFinancialYearStart(year) {
  // If no year provided, calculate from current date
  const today = new Date();
  const fiscalYear = year || (today.getMonth() >= 3 ? today.getFullYear() : today.getFullYear() - 1);
  return new Date(fiscalYear, 3, 1, 0, 0, 0, 0); // April 1
}

export function getFinancialYearEnd(year) {
  const today = new Date();
  const fiscalYear = year || (today.getMonth() >= 3 ? today.getFullYear() : today.getFullYear() - 1);
  return new Date(fiscalYear + 1, 2, 31, 23, 59, 59, 999); // March 31
}

export function getCurrentFinancialYear() {
  const today = new Date();
  const fiscalYear = today.getMonth() >= 3 ? today.getFullYear() : today.getFullYear() - 1;
  return fiscalYear;
}

export function getFinancialYearLabel(startYear) {
  return `FY ${startYear}-${String(startYear + 1).slice(2)}`;
}

export function formatDate(timestamp) {
  if (!timestamp) return '—';
  const date = timestamp?.toDate ? timestamp.toDate() : new Date(timestamp);
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function formatTimestamp(timestamp) {
  if (!timestamp) return '—';
  const date = timestamp?.toDate ? timestamp.toDate() : new Date(timestamp);
  return date.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function getMonthName(monthIndex) {
  const months = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'];
  return months[monthIndex];
}

// Returns fiscal month index 0-11 (Apr=0, Mar=11)
export function getFiscalMonthIndex(date) {
  const d = date?.toDate ? date.toDate() : new Date(date);
  const m = d.getMonth();
  return m >= 3 ? m - 3 : m + 9;
}
