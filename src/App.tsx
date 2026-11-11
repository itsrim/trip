import { useEffect, useState } from 'react';
import { SHEET_ID } from './config';
import { loadTrip } from './data/sheets';
import type { TripData } from './data/types';
import { SheetLink } from './components/SheetLink';
import { Tile } from './components/Tile';
import { Destination } from './components/sections/Destination';
import { Transport } from './components/sections/Transport';
import { Agenda } from './components/sections/Agenda';
import { Infos } from './components/sections/Infos';
import { Contacts } from './components/sections/Contacts';

const img = (name: string) => `${import.meta.env.BASE_URL}images/${name}.jpg`;
const SHEET_KEY = 'trip.sheetId';

const storedSheetId = () => {
  try {
    return localStorage.getItem(SHEET_KEY) ?? '';
  } catch {
    return '';
  }
};

export default function App() {
  const [customId, setCustomId] = useState(storedSheetId);
  const [trip, setTrip] = useState<TripData | null>(null);
  const [error, setError] = useState(false);
  const sheetId = customId || SHEET_ID;

  const chooseSheet = (id: string) => {
    setCustomId(id);
    try {
      if (id) localStorage.setItem(SHEET_KEY, id);
      else localStorage.removeItem(SHEET_KEY);
    } catch {
      /* navigation privée : le choix reste valable pour cette visite */
    }
  };

  useEffect(() => {
    let alive = true;
    setTrip(null);
    setError(false);
    loadTrip(sheetId)
      .then((data) => {
        if (alive) setTrip(data);
      })
      .catch(() => {
        if (alive) setError(true);
      });
    return () => {
      alive = false;
    };
  }, [sheetId]);

  // Une image du Sheet (onglet Config) remplace l'image par défaut
  const c = trip?.config ?? {};
  const pick = (key: string, fallback: string) => c[key] || img(fallback);
  const days = new Set(trip?.agenda.map((r) => r.jour).filter(Boolean)).size;

  return (
    <div className="page" style={{ backgroundImage: `url("${pick('image_fond', 'fond')}")` }}>
      <SheetLink sheetId={sheetId} custom={Boolean(customId)} onChange={chooseSheet} />
      <main className="wrap">
        <header className="hero">
          <h1>{trip ? c.titre || 'Mon voyage' : 'Chargement…'}</h1>
          {c.dates && <p className="dates">{c.dates}</p>}
          {c.sous_titre && <p className="subtitle">{c.sous_titre}</p>}
        </header>

        {error && <p className="empty">Impossible de charger le voyage. Vérifiez votre connexion.</p>}

        {trip && (
          <div className="tiles">
            <Tile title="Destination" image={pick('image_destination', 'destination')}>
              <Destination rows={trip.destination} />
            </Tile>
            <Tile title="Transport" image={pick('image_transport', 'transport')}>
              <Transport rows={trip.transport} />
            </Tile>
            <Tile title="Agenda" image={pick('image_agenda', 'agenda')} count={days || undefined}>
              <Agenda rows={trip.agenda} />
            </Tile>
            <Tile title="Infos pratiques" image={pick('image_infos', 'infos')}>
              <Infos rows={trip.infos} />
            </Tile>
            <Tile title="Contacts" image={pick('image_contacts', 'contacts')} count={trip.contacts.length || undefined}>
              <Contacts rows={trip.contacts} />
            </Tile>
          </div>
        )}

        {trip && trip.source !== 'sheet' && (
          <p className="source">
            {trip.source === 'local'
              ? 'Données locales (public/data). Collez le lien du Google Sheet avec l’icône en haut à droite.'
              : 'Certains onglets du Google Sheet sont introuvables : données locales utilisées pour ceux-là.'}
          </p>
        )}
      </main>
    </div>
  );
}
