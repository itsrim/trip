import { groupBy } from '../../data/sheets';
import type { Row } from '../../data/types';
import { Links, Photos, RichText } from '../RichText';
import { Tabs } from '../Tabs';

// Colonnes : Rubrique | Nom | Description | Lien | Image
export function Destination({ rows }: { rows: Row[] }) {
  return (
    <Tabs
      groups={groupBy(rows, 'rubrique')}
      render={(items) => (
        <div className="cards">
          {items.map((r, i) => (
            <article key={i} className="card">
              <Photos value={r.image} />
              {r.nom && <h3>{r.nom}</h3>}
              <p><RichText text={r.description} /></p>
              <Links value={r.lien} />
            </article>
          ))}
        </div>
      )}
    />
  );
}
