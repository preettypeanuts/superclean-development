export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const day = String(date.getUTCDate()).padStart(2, '0');
  const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // getUTCMonth() is zero-based
  const year = date.getUTCFullYear();

  return `${day}/${month}/${year}`;
}

export function formatDateCalendar(date: Date): string {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0"); // bulan dari 0-11
  const day = `${date.getDate()}`.padStart(2, "0");

  return `${day}-${month}-${year}`;
}

export const formatDateAPI = (date: Date) => {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0"); // bulan dari 0-11
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export function formatDateInput(dateString: string): string {
  const date = new Date(dateString);
  const day = String(date.getUTCDate()).padStart(2, '0');
  const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // getUTCMonth() is zero-based
  const year = date.getUTCFullYear();

  return `${year}-${month}-${day}`;
}

export function daysRemaining(dateString: string): string {
  const targetDate = new Date(dateString);
  const today = new Date();

  // Normalisasi waktu untuk menghindari perbedaan waktu dalam hari yang sama
  today.setHours(0, 0, 0, 0);
  targetDate.setHours(0, 0, 0, 0);

  const diffTime = targetDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays > 0) {
    return `${diffDays} hari tersisa`;
  } else if (diffDays < 0) {
    return `${Math.abs(diffDays)} hari telah lewat`;
  } else {
    return 'Hari ini';
  }
}
