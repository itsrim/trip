import { useId, useState, type ReactNode } from 'react';

interface Props {
  title: string;
  image: string;
  count?: number;
  children: ReactNode;
}

/** Bandeau photo cliquable qui déplie son contenu. */
export function Tile({ title, image, count, children }: Props) {
  const [open, setOpen] = useState(false);
  const id = useId();
  return (
    <section className={`tile${open ? ' is-open' : ''}`}>
      <button
        className="tile-head"
        style={{ backgroundImage: `url("${image}")` }}
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((o) => !o)}
      >
        <span className="tile-title">{title}</span>
        {count !== undefined && <span className="tile-count">{count}</span>}
        <span className="chevron" aria-hidden="true" />
      </button>
      {open && (
        <div className="tile-body" id={id}>
          {children}
        </div>
      )}
    </section>
  );
}
