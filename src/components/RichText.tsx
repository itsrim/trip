import { Fragment } from 'react';

const URL_RE = /(https?:\/\/[^\s]+)/g;
const IMG_RE = /\.(jpe?g|png|gif|webp|avif)(\?.*)?$/i;

export const hostOf = (url: string) => {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
};

/** Texte libre : les retours à la ligne sont gardés, les liens deviennent cliquables, les images s'affichent. */
export function RichText({ text }: { text?: string }) {
  if (!text) return null;
  const clean = text.replace(/\\n/g, '\n');
  return (
    <>
      {clean.split(URL_RE).map((part, i) => {
        if (/^https?:\/\//.test(part)) {
          return IMG_RE.test(part) ? (
            <Photo key={i} src={part} />
          ) : (
            <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="inline-link">
              {hostOf(part)}
            </a>
          );
        }
        return (
          <Fragment key={i}>
            {part.split('\n').map((line, j, arr) => (
              <Fragment key={j}>
                {line}
                {j < arr.length - 1 && <br />}
              </Fragment>
            ))}
          </Fragment>
        );
      })}
    </>
  );
}

export function Photo({ src, alt = '' }: { src?: string; alt?: string }) {
  if (!src) return null;
  return <img className="photo" src={src} alt={alt} loading="lazy" />;
}

/** Une ou plusieurs adresses (séparées par des espaces) → boutons « Ouvrir ». */
export function Links({ value }: { value?: string }) {
  const urls = value?.match(URL_RE) ?? [];
  if (!urls.length) return null;
  return (
    <div className="links">
      {urls.map((u) => (
        <a key={u} href={u} target="_blank" rel="noopener noreferrer" className="link-chip">
          {hostOf(u)}
        </a>
      ))}
    </div>
  );
}

/** Colonne « Image » : une ou plusieurs adresses d'images. */
export function Photos({ value }: { value?: string }) {
  const urls = value?.match(URL_RE) ?? [];
  return (
    <>
      {urls.map((u) => (
        <Photo key={u} src={u} />
      ))}
    </>
  );
}
