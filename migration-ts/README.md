# Divergenzmaschine — Quellen

TypeScript und Vite. Der Build bündelt alles zu **einer** Offline-`index.html`
(`vite-plugin-singlefile`); dazu kommen der Service Worker und das Manifest für
die Installation als App.

## Arbeiten

```bash
npm ci
npm run dev          # lokaler Server
npm run typecheck    # nur Typprüfung
npm run build        # → dist/index.html
```

Die Version steht in `package.json` und `src/version.ts`; `npm run build` zieht
über `scripts/sync-version.mjs` den Cache-Namen des Service Workers nach. Wer die
Version nicht hochzählt, liefert Nutzern die alte Seite aus dem Zwischenspeicher.

## Prüfen

```bash
node scripts/pruefen.mjs           # alle Prüfstände (Stand 4.391.0: 68)
node scripts/pruefen.mjs 1/3       # ein Drittel, für parallele Läufe
node scripts/pruefen.mjs video     # ein einzelner
```

Jeder Prüfstand ist eine Datei `test/<name>.ts`, wird mit esbuild gebündelt und
läuft in Node (das Studio in jsdom). Die Regeln, nach denen sie geschrieben sind:

- **Messen vor und nach** einer Änderung, mit Zahlen im Kommentar.
- **Jede Prüfung hat eine Gegenprobe** — ein Fall, in dem sie anschlagen muss.
- **Erst den Melder prüfen, dann ihm trauen.** Wortgrenzen über Buchstaben
  (`(?<!\p{L})…(?!\p{L})`), weil `\b` bei „ß“ und Umlauten danebenliegt.
- **Was beim Lesen gefunden wird, wird ein Muster im Prüfstand.**

Etliche Prüfstände lesen den Quelltext von `src/ui/studio.ts` mit regulären
Ausdrücken. Wer dort Code verschiebt, muss sie mitziehen.

## Wo was liegt

| Ordner | Inhalt |
|---|---|
| `src/generation/` | Die Pipeline: `buildStory.ts` verteilt auf die Formen (`video.ts`, `dialogue.ts`, `strang.ts`, `bericht.ts` …) und Gattungen (`utopie.ts`, `maerchen.ts`, `fabel.ts`, `mythos.ts`). `optionen.ts` hält die Wertelisten der Regler — die einzige Quelle. `grammar.ts`, `coherence.ts`, `postprocess.ts` prüfen und glätten. |
| `src/features/` | Alles um die Pipeline herum: Weltblatt und Preset-Material der Gattungen, Schaltplan, einfacher Kopf, Zeitung, Korpus, Sammler. |
| `src/ui/` | Die Reiter. `studio.ts` ist der größte Baustein (siehe unten). |
| `src/presets.data.ts`, `src/modes.data.ts` | Die eingebauten Wortbänke und Modi. |
| `test/` | Die Prüfstände. |
| `scripts/` | `pruefen.mjs`, `sync-version.mjs`, `studio-abhaengigkeiten.cjs`. |
| `dist/` | Der gebaute Stand — wird mit eingecheckt. |

### `studio.ts`

Rund 3600 Zeilen, davon 3500 in einer einzigen Funktion `mountStudio`. Das ist
kein Versehen, das sich mit ein paar Schnitten beheben ließe: Die Funktion hat
627 Anweisungen, die sich gegenseitig über gemeinsame Variablen erreichen; nur
291 Zeilen hängen von nichts ab. `node scripts/studio-abhaengigkeiten.cjs 1211 1357`
zeigt für einen Zeilenbereich, was er von außen braucht und was er nach außen
liefert. Die meisten Abschnitte brauchen zwanzig bis fünfzig fremde Variablen.
Wer aufteilen will, fängt bei den Abschnitten mit kleiner Schnittstelle an
(Spannungskurve, Einspeisungen, Test & Ranking) — siehe `doku/UEBERGABE.md`.

## Veröffentlichen

Der Workflow `Build & Deploy Pages` läuft bei einem Push auf
`typescript-migration`, sofern etwas unter `migration-ts/**` oder an der
Workflow-Datei geändert wurde. Er baut, legt den Stand auf `main` ab und
veröffentlicht nach https://schaeble.github.io/divergenzmaschine/ts/.

Drei Fallen:

- **Kein Knopf zum Nachstarten.** `workflow_dispatch` ist eingetragen, aber
  GitHub zeigt „Run workflow“ nur, wenn die Workflow-Datei auch auf dem
  Standardzweig liegt — und `main` enthält nur das Veröffentlichte. Geht ein
  Push-Ereignis verloren (so am 6. August 2026 bei 4.151.0 bis 4.154.0) oder
  schlägt nur der letzte Schritt fehl (so am 14. November 2026 bei 4.387.0),
  hilft allein ein weiterer Push, der etwas unter `migration-ts/` ändert. Ein
  leerer Commit löst nichts aus.
- **Der Lauf ist der Beleg, nicht die Seite.** Ob veröffentlicht wurde, zeigt
  `https://api.github.com/repos/schaeble/divergenzmaschine/actions/runs?per_page=1`.
- **Der Zwischenspeicher.** Nach einer neuen Fassung im Browser einmal
  Strg+Umschalt+R.
