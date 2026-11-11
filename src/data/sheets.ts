import Papa from 'papaparse';
import { SHEET_ID, TABS } from '../config';
import type { Row, TripData } from './types';

/** « Activité » → « activite », « Téléphone » → « telephone » */
export const normalize = (s: string) =>
  s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim().toLowerCase();

const parseCsv = (csv: string): Row[] => {
  const { data } = Papa.parse<Record<string, string>>(csv, {
    header: true,
    skipEmptyLines: 'greedy',
    transformHeader: normalize,
    transform: (v) => (v ?? '').trim(),
  });
  // On ignore les lignes entièrement vides
  return data.filter((row) => Object.values(row).some((v) => v));
};

const sheetUrl = (id: string, tab: string) =>
  `https://docs.google.com/spreadsheets/d/${id}/gviz/tq?tqx=out:csv&headers=1&sheet=${encodeURIComponent(tab)}`;

const localUrl = (tab: string) => `${import.meta.env.BASE_URL}data/${tab.toLowerCase()}.csv`;

/**
 * Lit un onglet. `mustHave` = une colonne qui doit exister : si Google renvoie
 * un autre onglet (cas d'un nom d'onglet mal orthographié), on le détecte.
 */
async function readTab(sheetId: string, tab: string, mustHave: string): Promise<{ rows: Row[]; from: 'sheet' | 'local' }> {
  if (sheetId) {
    try {
      const res = await fetch(sheetUrl(sheetId, tab));
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const rows = parseCsv(await res.text());
      const headers = rows.length ? Object.keys(rows[0]) : [];
      if (rows.length && !headers.includes(mustHave)) {
        throw new Error(`colonne « ${mustHave} » introuvable — vérifiez le nom de l'onglet « ${tab} »`);
      }
      return { rows, from: 'sheet' };
    } catch (err) {
      console.warn(`[trip] Onglet « ${tab} » : lecture Google Sheet impossible, fichier local utilisé.`, err);
    }
  }
  try {
    const res = await fetch(localUrl(tab));
    if (!res.ok) return { rows: [], from: 'local' };
    return { rows: parseCsv(await res.text()), from: 'local' };
  } catch {
    return { rows: [], from: 'local' };
  }
}

export async function loadTrip(sheetId = SHEET_ID): Promise<TripData> {
  const [config, destination, transport, agenda, infos, contacts] = await Promise.all([
    readTab(sheetId, TABS.config, 'cle'),
    readTab(sheetId, TABS.destination, 'rubrique'),
    readTab(sheetId, TABS.transport, 'rubrique'),
    readTab(sheetId, TABS.agenda, 'jour'),
    readTab(sheetId, TABS.infos, 'titre'),
    readTab(sheetId, TABS.contacts, 'nom'),
  ]);

  const all = [config, destination, transport, agenda, infos, contacts];
  const fromSheet = all.filter((t) => t.from === 'sheet').length;

  return {
    config: Object.fromEntries(config.rows.map((r) => [normalize(r.cle ?? ''), r.valeur ?? ''])),
    destination: destination.rows,
    transport: transport.rows,
    agenda: agenda.rows,
    infos: infos.rows,
    contacts: contacts.rows,
    source: fromSheet === all.length ? 'sheet' : fromSheet === 0 ? 'local' : 'mixte',
  };
}

/** Regroupe des lignes par la valeur d'une colonne, en gardant l'ordre du tableau. */
export function groupBy(rows: Row[], key: string): { name: string; rows: Row[] }[] {
  const groups: { name: string; rows: Row[] }[] = [];
  let current: { name: string; rows: Row[] } | undefined;
  for (const row of rows) {
    // Une cellule vide = même groupe que la ligne précédente (pratique pour l'agenda)
    const name = row[key] || current?.name || 'Autre';
    current = groups.find((g) => g.name === name);
    if (!current) {
      current = { name, rows: [] };
      groups.push(current);
    }
    current.rows.push(row);
  }
  return groups;
}
