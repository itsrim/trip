import { groupBy } from '../../data/sheets';
import type { Row } from '../../data/types';
import { Links, RichText } from '../RichText';
import { Tabs } from '../Tabs';

// Colonnes : Rubrique | Nom | Description | Lien
export function Transport({ rows }: { rows: Row[] }) {
  return (
    <Tabs
      groups={groupBy(rows, 'rubrique')}
      render={(items) => (
        <div className="cards">
          {items.map((r, i) => (
            <article key={i} className="card">
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
