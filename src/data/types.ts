/** Une ligne d'un onglet : clés = en-têtes de colonnes normalisés (minuscules, sans accents). */
export type Row = Record<string, string>;

export interface TripData {
  config: Record<string, string>;
  destination: Row[];
  transport: Row[];
  agenda: Row[];
  infos: Row[];
  contacts: Row[];
  /** D'où viennent les données : 'sheet', 'local' ou 'mixte'. */
  source: 'sheet' | 'local' | 'mixte';
}
