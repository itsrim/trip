import { useState } from 'react';
import { formatDay, isToday } from '../../data/dates';
import { groupBy } from '../../data/sheets';
import type { Row } from '../../data/types';
import { Links, Photos, RichText } from '../RichText';
import { Empty } from '../Tabs';

// Colonnes : Jour | Heure | Activité | Lien | Image
function Day({ name, rows }: { name: string; rows: Row[] }) {
  const today = isToday(name);
  const [open, setOpen] = useState(today);
  return (
    <div className={`day${open ? ' is-open' : ''}`}>
      <button className="day-head" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
        <span>{formatDay(name)}</span>
        {today && <span className="badge">Aujourd'hui</span>}
        <span className="day-n">{rows.length}</span>
      </button>
      {open && (
        <ol className="timeline">
          {rows.map((r, i) => (
            <li key={i}>
              <time>{r.heure}</time>
              <div>
                <RichText text={r.activite} />
                <Photos value={r.image} />
                <Links value={r.lien} />
              </div>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

export function Agenda({ rows }: { rows: Row[] }) {
  const days = groupBy(rows, 'jour');
  if (!days.length) return <Empty />;
  return (
    <div className="days">
      {days.map((d) => (
        <Day key={d.name} name={d.name} rows={d.rows} />
      ))}
    </div>
  );
}
