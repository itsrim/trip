import type { Row } from '../../data/types';
import { RichText } from '../RichText';
import { Empty } from '../Tabs';

// Colonnes : Nom | Rôle | Téléphone | Email | Note
const telHref = (t: string) => `tel:${t.replace(/[^\d+]/g, '')}`;

export function Contacts({ rows }: { rows: Row[] }) {
  if (!rows.length) return <Empty />;
  return (
    <ul className="contacts">
      {rows.map((r, i) => (
        <li key={i} className="contact">
          <div className="contact-id">
            <strong>{r.nom}</strong>
            {r.role && <span>{r.role}</span>}
          </div>
          {r.note && <p><RichText text={r.note} /></p>}
          <div className="links">
            {r.telephone && <a className="link-chip" href={telHref(r.telephone)}>Appeler {r.telephone}</a>}
            {r.email && <a className="link-chip" href={`mailto:${r.email}`}>Écrire</a>}
          </div>
        </li>
      ))}
    </ul>
  );
}
