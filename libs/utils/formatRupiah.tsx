export function formatRupiah(
  amount: number | string,
  isPrefix: boolean = true
): string {
  try {
    const numeric =
      typeof amount === 'number' ? amount : parseFloat(amount.toString()); // Changed from parseInt with replace

    if (isNaN(numeric)) return 'Rp 0';

    if (isPrefix) {
      return (
        'Rp ' +
        Math.round(numeric)
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, '.')
      );
    }

    return (
        Math.round(numeric)
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, '.')
      );
  } catch (e) {
    return 'Rp 0';
  }
}

export const unformatRupiah = (formatted: number | string): number => {
  if (typeof formatted === 'number') return formatted;

  // Remove "Rp" and thousand separators (dots), but keep decimal point
  const cleaned: string = formatted
    .toString()
    .replace(/Rp\s?/g, '') // Remove "Rp" prefix
    .replace(/\./g, '') // Remove thousand separators (dots)
    .replace(/,/g, '.'); // Replace decimal comma with dot if exists

  return parseFloat(cleaned) || 0;
};

export const removeTrailingZeros = (value: number | string): number => {
  return parseFloat(value.toString()) || 0;
};
