/**
 * Format ISO datetime (có thể có 6-9 chữ số phần lẻ giây)
 * sang chuỗi dễ đọc: "19/11/2026 21:42:19"
 */
export function formatDateTime(iso: string | null | undefined): string {
  if (!iso) return '—';

  // Cắt phần lẻ giây về tối đa 3 chữ số để JS parse được
  // 2026-11-19T21:42:19.652727200 → 2026-11-19T21:42:19.652
  const normalized = iso.replace(/\.(\d{3})\d+/, '.$1');

  const d = new Date(normalized);
  if (isNaN(d.getTime())) return iso; // fallback: trả nguyên chuỗi

  const pad = (n: number) => n.toString().padStart(2, '0');

  const day = pad(d.getDate());
  const month = pad(d.getMonth() + 1);
  const year = d.getFullYear();
  const hours = pad(d.getHours());
  const minutes = pad(d.getMinutes());
  const seconds = pad(d.getSeconds());

  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
}

/**
 * Format tương đối: "2 phút trước", "3 giờ trước", "Hôm qua 21:42"...
 */
export function formatRelativeTime(iso: string | null | undefined): string {
  if (!iso) return '—';

  const normalized = iso.replace(/\.(\d{3})\d+/, '.$1');
  const d = new Date(normalized);
  if (isNaN(d.getTime())) return iso;

  const diffMs = Date.now() - d.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) return 'Vừa xong';
  if (diffMin < 60) return `${diffMin} phút trước`;
  if (diffHour < 24) return `${diffHour} giờ trước`;
  if (diffDay === 1) return 'Hôm qua';
  if (diffDay < 7) return `${diffDay} ngày trước`;

  // Cũ hơn 7 ngày → hiển thị ngày cụ thể
  return formatDateTime(iso);
}