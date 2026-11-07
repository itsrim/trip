import { useState, type ReactNode } from 'react';

interface Props<T> {
  groups: { name: string; rows: T[] }[];
  render: (rows: T[]) => ReactNode;
}

/** Un onglet par valeur de la colonne « Rubrique » : ajoutez une rubrique dans le Sheet, un onglet apparaît. */
export function Tabs<T>({ groups, render }: Props<T>) {
  const [active, setActive] = useState(0);
  if (!groups.length) return <Empty />;
  const current = groups[Math.min(active, groups.length - 1)];
  return (
    <>
      <div className="tabs" role="tablist">
        {groups.map((g, i) => (
          <button
            key={g.name}
            role="tab"
            aria-selected={i === active}
            className="tab"
            onClick={() => setActive(i)}
          >
            {g.name}
          </button>
        ))}
      </div>
      <div role="tabpanel">{render(current.rows)}</div>
    </>
  );
}

export function Empty() {
  return <p className="empty">Rien pour l'instant. Ajoutez des lignes dans le Google Sheet.</p>;
}
