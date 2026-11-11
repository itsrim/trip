import { useEffect, useId, useRef, useState, type FormEvent } from 'react';
import { parseSheetId, sheetEditUrl } from '../data/sheetUrl';

interface Props {
  sheetId: string;
  custom: boolean;
  onChange: (id: string) => void;
}

/** Icône en haut à droite : coller l'adresse d'un Google Sheet. */
export function SheetLink({ sheetId, custom, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState('');
  const [invalid, setInvalid] = useState(false);
  const panelId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    setDraft(sheetId ? sheetEditUrl(sheetId) : '');
    setInvalid(false);
    inputRef.current?.focus();
    inputRef.current?.select();
  }, [open, sheetId]);

  useEffect(() => {
    if (!open) return;
    const onClick = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('click', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('click', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const text = draft.trim();
    if (!text) {
      onChange('');
      setOpen(false);
      return;
    }
    const id = parseSheetId(text);
    if (!id) {
      setInvalid(true);
      return;
    }
    onChange(id);
    setOpen(false);
  };

  return (
    <div className="sheet-link" ref={rootRef}>
      <button
        type="button"
        className={`sheet-btn${custom ? ' is-custom' : ''}`}
        aria-label="Changer le Google Sheet"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
          <rect x="4" y="3" width="16" height="18" rx="2" fill="none" stroke="currentColor" strokeWidth="1.8" />
          <path d="M4 9h16M4 15h16M10 3v18" fill="none" stroke="currentColor" strokeWidth="1.8" />
        </svg>
      </button>
      {open && (
        <form className="sheet-panel" id={panelId} role="dialog" aria-label="Google Sheet" onSubmit={submit}>
          <label htmlFor={`${panelId}-url`}>Adresse du Google Sheet</label>
          <input
            ref={inputRef}
            id={`${panelId}-url`}
            type="text"
            inputMode="url"
            autoComplete="off"
            spellCheck={false}
            placeholder="https://docs.google.com/spreadsheets/d/…"
            value={draft}
            aria-invalid={invalid}
            onChange={(event) => {
              setDraft(event.target.value);
              setInvalid(false);
            }}
          />
          <p className="sheet-hint">
            Collez l'adresse complète ou seulement l'identifiant. Le classeur doit être partagé.
          </p>
          <a
            className="sheet-download"
            href={`${import.meta.env.BASE_URL}modele-google-sheet-trip.xlsx`}
            download="modele-google-sheet-trip.xlsx"
          >
            Télécharger le modèle Excel
          </a>
          {invalid && <p className="sheet-error">Cette adresse ne contient pas d'identifiant de Google Sheet.</p>}
          <div className="sheet-actions">
            <button type="submit" className="sheet-save">Utiliser</button>
            {custom && (
              <button type="button" className="sheet-clear" onClick={() => { onChange(''); setOpen(false); }}>
                Revenir au classeur d'origine
              </button>
            )}
          </div>
        </form>
      )}
    </div>
  );
}
