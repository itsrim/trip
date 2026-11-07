/**
 * ─────────────────────────────────────────────────────────────
 *  SEUL RÉGLAGE À FAIRE : l'identifiant de votre Google Sheet
 * ─────────────────────────────────────────────────────────────
 * Dans l'adresse  https://docs.google.com/spreadsheets/d/XXXXXXXX/edit
 * copiez la partie XXXXXXXX ci-dessous.
 *
 * Le Sheet doit être partagé en « Tous les utilisateurs disposant du lien : Lecteur ».
 * Laissez vide ('') pour utiliser uniquement les fichiers CSV de public/data/.
 */
export const SHEET_ID = '';

/** Noms exacts des onglets du Google Sheet (et des fichiers public/data/<nom>.csv). */
export const TABS = {
  config: 'Config',
  destination: 'Destination',
  transport: 'Transport',
  agenda: 'Agenda',
  infos: 'Infos',
  contacts: 'Contacts',
} as const;
