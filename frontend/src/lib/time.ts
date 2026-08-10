export function formatRelativeTime(dateValue: string) {
  const date = new Date(dateValue);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();

  if (Number.isNaN(date.getTime())) return "";
  if (diffMs < 60_000) return "agora";

  const minutes = Math.floor(diffMs / 60_000);
  if (minutes < 60) return `há ${minutes}min`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `há ${hours}h`;

  const days = Math.floor(hours / 24);
  if (days < 7) return `há ${days}d`;

  const weeks = Math.floor(days / 7);
  if (weeks < 5) return `há ${weeks}sem.`;

  const months = Math.floor(days / 30);
  if (months < 12) return `há ${months}m`;

  const years = Math.floor(days / 365);
  return `há ${years}a`;
}
