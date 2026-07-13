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
