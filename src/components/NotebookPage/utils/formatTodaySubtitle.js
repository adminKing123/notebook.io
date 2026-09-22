export function formatTodaySubtitle() {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year = now.getFullYear();
  const dayName = now.toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase();

  return `${day}/${month}/${year} ${dayName}`;
}
