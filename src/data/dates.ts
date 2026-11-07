/**
 * La colonne « Jour » de l'agenda accepte :
 *  - une vraie date : 12/07/2025 ou 2025-07-12  → affichée « samedi 12 juillet »
 *  - n'importe quel texte : « Sam. 12 juillet », « Jour 1 »… → affiché tel quel
 */
export function parseDay(text: string): Date | null {
  let m = text.match(/^(\d{1,2})[/.-](\d{1,2})[/.-](\d{4})$/);
  if (m) return new Date(+m[3], +m[2] - 1, +m[1]);
  m = text.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (m) return new Date(+m[1], +m[2] - 1, +m[3]);
  return null;
}

export function formatDay(text: string): string {
  const d = parseDay(text);
  if (!d) return text;
  const s = d.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function isToday(text: string): boolean {
  const d = parseDay(text);
  if (!d) return false;
  const now = new Date();
  return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() && d.getDate() === now.getDate();
}
