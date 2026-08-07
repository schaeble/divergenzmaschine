# Divergenzmaschine — TypeScript-Migration (Phase 1)

Getyptes, modulares Gerüst der Divergenzmaschine. Die laufende App
(`schaeble/divergenzmaschine`, `index.html`) bleibt hiervon **unberührt** —
dies ist ein separater Zweitordner zum Ausprobieren.

## Was Phase 1 enthält
- Vite-Build, der zu **einer** Offline-`index.html` bündelt (`vite-plugin-singlefile`).
- Strikte TypeScript-Konfiguration.
- `src/types.ts` — zentrale Datenformen (Bank, Preset, GenInput, StoryKit, …).
- `src/constants.ts` — Speicher-Schlüssel + `DEFAULT_BANK` (1:1 portiert).
- `src/text-utils.ts` — reine Helfer (clean, pick, pickSane, chance, …).
- `src/storage.ts` — getypte localStorage-Grenze (loadBank/saveBank/…).
- `src/main.ts` — Nachweis, dass Build + Typen + Daten zusammenspielen.

## Nutzen
```bash
npm install
npm run typecheck   # nur Typprüfung
npm run dev         # lokaler Dev-Server
npm run build       # -> dist/index.html (eine Offline-Datei)
```

## Noch NICHT enthalten (spätere Phasen)
Generierung, Dialog-Engine, Korpus/Markov, Presets, UI-Verdrahtung,
Zusatz-Features. Siehe `divergenzmaschine-modulbauplan.md`.

## Veröffentlichen — eine Falle

Der Workflow `Build & Deploy Pages` läuft bei einem Push auf
`typescript-migration`, sofern etwas unter `migration-ts/**` oder an der
Workflow-Datei geändert wurde. Er kennt zwar `workflow_dispatch`, doch der Knopf
„Run workflow" erscheint **nicht**: GitHub zeigt ihn nur, wenn die Workflow-Datei
auch auf dem Standardzweig liegt — und `main` enthält ausschließlich das
Veröffentlichte, nicht die Quellen.

Folge: Geht ein Push-Ereignis verloren — etwa während einer Actions-Störung, wenn
GitHub Webhooks verzögert —, entsteht zu diesem Commit **kein** Lauf, und es gibt
keine Möglichkeit, ihn nachträglich von Hand zu starten. Am 6. August 2026 ist
das den Fassungen 4.151.0 bis 4.154.0 passiert. Der einzige Ausweg ist ein
weiterer Push, der die `paths`-Filter trifft.

Dauerhaft beheben ließe sich das, indem die Workflow-Datei zusätzlich auf `main`
abgelegt wird; dann steht der Knopf zur Verfügung.
