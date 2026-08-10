export function formatYear(date?: string): string {
  if (!date) return "";
  return String(new Date(date).getUTCFullYear());
}

export function formatLifespan(birthDate: string, deathDate?: string): string {
  const birth = formatYear(birthDate);
  return deathDate ? `${birth} — ${formatYear(deathDate)}` : `${birth} — presente`;
}

export function formatLongDate(date?: string): string {
  if (!date) return "Data desconhecida";
  return new Date(`${date}T00:00:00`).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}