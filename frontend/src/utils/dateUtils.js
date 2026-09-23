/**
 * Universal Date Utility for Royal Bikes
 * Automatically provides real-time, universal current dates formatted as DD-MM-YYYY and YYYY-MM-DD.
 */

export const getTodayDateStr = (date = new Date()) => {
  const d = date instanceof Date ? date : new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
};

export const getFutureDateStr = (daysAhead = 10) => {
  const d = new Date();
  d.setDate(d.getDate() + daysAhead);
  return getTodayDateStr(d);
};

export const getTodayISOStr = (date = new Date()) => {
  const d = date instanceof Date ? date : new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${year}-${month}-${day}`;
};

export const getCurrentYear = () => {
  return new Date().getFullYear();
};

export const convertDateToDisplay = (dateStr) => {
  if (!dateStr) return getTodayDateStr();
  if (dateStr.includes('-')) {
    const parts = dateStr.split('-');
    if (parts[0].length === 4) {
      // YYYY-MM-DD to DD-MM-YYYY
      return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
  }
  return dateStr;
};

export const convertDateToISO = (dateStr) => {
  if (!dateStr) return getTodayISOStr();
  if (dateStr.includes('-')) {
    const parts = dateStr.split('-');
    if (parts[0].length === 2 && parts[2].length === 4) {
      // DD-MM-YYYY to YYYY-MM-DD
      return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
  }
  return dateStr;
};

const dateUtils = {
  getTodayDateStr,
  getFutureDateStr,
  getTodayISOStr,
  getCurrentYear,
  convertDateToDisplay,
  convertDateToISO
};

export default dateUtils;
