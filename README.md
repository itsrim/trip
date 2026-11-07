# Trip

Carnet de voyage mobile (React + TypeScript + Vite, installable en PWA, fonctionne hors-ligne).
Le contenu vient d'un **Google Sheet avec un onglet par section** — aucune ligne de code à toucher pour changer de voyage.

## Le Google Sheet

| Onglet | Colonnes | À quoi ça sert |
|---|---|---|
| **Config** | Clé · Valeur | `titre`, `dates`, `sous_titre`, `image_fond`, `image_destination`, `image_transport`, `image_agenda`, `image_infos`, `image_contacts` |
| **Destination** | Rubrique · Nom · Description · Lien · Image | Chaque *Rubrique* (Villes, Hôtel, Météo…) devient un onglet dans l'app |
| **Transport** | Rubrique · Nom · Description · Lien | Idem : Aéroport, Train, Bus, Taxi… |
| **Agenda** | Jour · Heure · Activité · Lien · Image | `Jour` en `12/07/2025` → affiché « Samedi 12 juillet », et le jour en cours s'ouvre tout seul. Du texte libre marche aussi |
| **Infos** | Titre · Description · Lien | Urgences, monnaie, coutumes… |
| **Contacts** | Nom · Rôle · Téléphone · Email · Note | Boutons *Appeler* / *Écrire* |

Règles simples :
- une ligne = un élément, les cellules vides sont permises ;
- plusieurs liens ou images dans une cellule : séparez-les par un espace ;
- les colonnes en plus (ex. « Explication ») sont ignorées ;
- l'ordre des lignes = l'ordre d'affichage ;
- les majuscules et accents des en-têtes n'ont pas d'importance (`Activité` = `activite`).

### Mise en place (5 min)

1. Dans Google Drive : **Nouveau › Importer** le fichier `modele-google-sheet-trip.xlsx`, puis ouvrez-le avec Google Sheets (ou dans un Sheet vide : *Fichier › Importer › Remplacer la feuille de calcul*).
2. **Partager › Accès général › « Tous les utilisateurs disposant du lien » › Lecteur.**
3. Copiez l'identifiant dans l'adresse : `https://docs.google.com/spreadsheets/d/`**`CET_IDENTIFIANT`**`/edit`
4. Collez-le dans `src/config.ts` → `export const SHEET_ID = 'CET_IDENTIFIANT';`

> Astuce : gardez les cellules au format **Texte brut** (*Format › Nombre › Texte brut*, déjà réglé dans le modèle). Sinon Google peut convertir `09:00` ou `12/07/2025` et l'export peut vider des cellules dans une colonne « mixte ».

Si le Sheet est inaccessible (ou `SHEET_ID` vide), l'app lit les copies locales `public/data/<onglet>.csv` : même format, un fichier par onglet.

## Développer et publier

```bash
npm install
npm run dev        # http://localhost:5173/trip/
npm run deploy     # build + publication sur GitHub Pages (branche gh-pages)
```

Le site est servi sur `https://<utilisateur>.github.io/trip/`. Si le dépôt a un autre nom, changez `BASE` dans `vite.config.ts`, `homepage` dans `package.json` et les chemins `/trip/` de `index.html`.

## Structure

```
src/
  config.ts              ← SHEET_ID et noms des onglets
  data/sheets.ts         lecture des onglets (Google Sheet puis CSV local)
  data/dates.ts          format des jours de l'agenda
  components/Tile.tsx    bandeau photo dépliable
  components/Tabs.tsx    onglets générés depuis la colonne « Rubrique »
  components/sections/   Destination, Transport, Agenda, Infos, Contacts
public/
  data/*.csv             données de secours (un fichier par onglet)
  images/*.jpg           images par défaut des bandeaux
```
