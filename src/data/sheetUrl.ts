const ID = /^[a-zA-Z0-9-_]{15,}$/;

/**
 * Accepte l'adresse complète d'un Google Sheet, ou seulement son identifiant.
 * Ex. https://docs.google.com/spreadsheets/d/XXXX/edit?usp=sharing
 */
export function parseSheetId(input: string): string | null {
  const raw = input.trim().replace(/^['"]|['"]$/g, '');
  if (!raw) return null;

  const inPath = raw.match(/\/spreadsheets\/(?:u\/\d+\/)?d\/([a-zA-Z0-9-_]+)/);
  if (inPath && ID.test(inPath[1])) return inPath[1];

  try {
    const url = new URL(raw);
    const query = url.searchParams.get('id') ?? url.searchParams.get('key');
    if (query && ID.test(query)) return query;
  } catch {
    /* ce n'est pas une adresse */
  }

  return ID.test(raw) ? raw : null;
}

export function sheetEditUrl(id: string): string {
  return `https://docs.google.com/spreadsheets/d/${id}/edit`;
}
