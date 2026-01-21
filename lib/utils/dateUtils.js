/**
 * Dapatkan tahun sekarang
 */
export function getCurrentYear() {
  return new Date().getFullYear();
}

export function getCopyrightYearRange(startYear = 2024) {
  const currentYear = getCurrentYear();
  
  if (currentYear === startYear) {
    return `${currentYear}`;
  }
  
  return `${startYear}-${currentYear}`;
}

/**
 * Format tanggal Indonesia
 */
export function formatDateID(date = new Date()) {
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(date);
}