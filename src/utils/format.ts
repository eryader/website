const TR_MONTHS = [
  'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
  'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık',
];

/** 01 Nisan 2025 */
export function formatDate(d: Date): string {
  return `${String(d.getUTCDate()).padStart(2, '0')} ${TR_MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

/** Kart özetlerini sınırlar; kelimenin ortasında kesmez. */
export function excerpt(text: string | undefined, max = 165): string {
  if (!text) return '';
  const clean = text.replace(/\s+/g, ' ').trim();
  if (clean.length <= max) return clean;
  return clean.slice(0, clean.lastIndexOf(' ', max)) + '…';
}
