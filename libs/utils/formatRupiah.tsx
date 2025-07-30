export function formatRupiah(amount: number | string): string {
    try {
        const numeric = typeof amount === 'number'
            ? amount
            : parseInt(amount.toString().replace(/[^0-9]/g, ''), 10);

        if (isNaN(numeric)) return 'Rp 0';

        return 'Rp ' + numeric.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    }
    catch (e) {
        return "Rp 0"
    }
}



export const unformatRupiah = (formatted: number | string): number => {
    const cleaned: string = formatted.toString().replace(/[^0-9]/g, '');
    return parseInt(cleaned, 10) || 0;
};
