import type { Row } from '../../data/types';
import { Links, RichText } from '../RichText';
import { Empty } from '../Tabs';

// Colonnes : Titre | Description | Lien
export function Infos({ rows }: { rows: Row[] }) {
  if (!rows.length) return <Empty />;
  return (
    <dl className="pairs">
      {rows.map((r, i) => (
        <div key={i}>
          <dt>{r.titre}</dt>
          <dd>
            <RichText text={r.description} />
            <Links value={r.lien} />
          </dd>
        </div>
      ))}
    </dl>
  );
}
