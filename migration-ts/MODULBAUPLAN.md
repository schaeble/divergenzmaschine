# Divergenzmaschine — Modul-Bauplan (TypeScript-Migration)

Referenz für den schrittweisen Umbau der heutigen Einzeldatei `index.html`
(~11.000 Zeilen) in ein getyptes, modulares Projekt. Ziel bleibt eine offline
lauffähige Single-File-Web-App; der Build bündelt am Ende wieder zu einer Datei
für GitHub Pages.

---

## 1. Prinzipien

- **Kein Bruch:** In jeder Phase bleibt die App lauffähig und deploybar.
- **Datenformen zuerst:** Der größte Nutzen entsteht, sobald die zentralen
  „Formen" (Wortbank, Preset, Kit …) einmal sauber typisiert sind.
- **Reine Logik von der UI trennen:** Generierung/Textverarbeitung darf nichts
  über das DOM wissen; die UI-Schicht ruft die Logik nur auf.
- **Ränder absichern:** Alles, was aus `localStorage` kommt oder zwischen
  Modulen fließt, wird an der Grenze geprüft und getypt.

---

## 2. Zuerst zu definierende Datenformen (`types.ts`)

Diese Typen bilden das Rückgrat. Sie existieren im Code heute nur implizit als
Objekt-Konventionen.

```ts
// Die sieben Wortbank-Kategorien
type BankKey =
  "motifs" | "hooks" | "props" | "turns" | "obstacles" | "stakes" | "endings";
type Bank = Record<BankKey, string[]>;

// Preset (eingebaut oder eigenes)
interface Preset {
  id: string;                 // z. B. "builtin:rimbaud" | "user:MeinName"
  label: string;              // mit Icon, z. B. "🚤 Rimbaud"
  kind: "builtin" | "user";
  bank: Bank;
}

// Stil-Datenquelle je Realitätsmodus (bureau, tech, body, myth, absurd, post)
interface ModeData {
  nouns: string[];
  verbs: string[];
  images: string[];
  rules: string[];
}

// Ton-Einfärbung
interface ToneData { opener: string[]; flavor: string[]; }

// Archetyp (Sprecherrollen etc.)
interface Archetype { speakers: string[]; /* … */ }

// Eingabe eines Generierungslaufs (aus dem Studio-UI)
interface GenInput {
  where: string; when: string; who: string; what: string;
  tone: string; varLevel: string; form: FormKind;
  structure: string; mode: string; perspective: string;
  rhythm: string; markovMode: string; disruptor: string;
  archetypeA: string; archetypeB: string; instability: 0 | 1 | 2;
  polish: boolean; polishStyle: string;
}
type FormKind =
  "prose" | "drama" | "poem" | "strang" | "reim" | "haiku" | "script" | "video";

// „Kit": die aus Bank + Input abgeleiteten Bausteine für einen Lauf
interface StoryKit {
  W: string; T: string; P: string;
  motif: string; hook: string; hookAcc: string; hookDat: string;
  prop: string; propAcc: string; propDat: string;
  turn: string; obstacle: string; stake: string; ending: string;
  speakerA: string; speakerB: string;
  mode: ModeData; archetypeA: string; archetypeB: string; instability: 0|1|2;
}

// Persistente Einstellungen
interface Settings { enabled: boolean; learnStories: boolean; useSaved: boolean; }
```

**Reihenfolge der Einführung:** `Bank` → `Preset` → `Settings` → `GenInput`
→ `StoryKit` → `ModeData`/`ToneData`/`Archetype`. Danach ist der Rest
schrittweise typisierbar.

---

## 3. Modul-Aufteilung (aus dem heutigen Code)

### Basis
- **`types.ts`** — alle Interfaces/Typen (siehe oben).
- **`constants.ts`** — Speicher-Schlüssel (`divergenz_*`), `DEFAULT_BANK`,
  `BUILTIN_PRESETS`, `MODE_DATA`, `TONE_DATA`, `ARCHETYPES`, `INTRO_TEXT`,
  Grenzwerte (`CORPUS_MAX`, Repcheck-Konstanten).
- **`text-utils.ts`** — reine Helfer ohne Zustand: `clean`, `pick`, `pickSane`,
  `chance`, `ensurePunct`, `capFirst`, `tokenize`, `splitSentences`,
  `escapeRegExp`, `looksLikeClausePhrase`.

### Daten & Persistenz
- **`storage.ts`** — `localStorage`-Wrapper: `loadBank/saveBank`,
  `loadUserPresets/saveUserPresets`, `loadSettings/saveSettings`,
  `loadPersistentCorpus/savePersistentCorpus`. Einzige Stelle, die den Browser-
  Speicher berührt; hier werden eingehende Daten validiert.
- **`wordbank.ts`** — `getAllPresets`, `normalizeBankShape`, `presetLabel`,
  `saveCurrentBankAsUserPreset`, `applyPresetById`, `buildAutoMixBank`,
  `mutateBank` (die verstärkte Mutations-Engine).
- **`corpus.ts`** — Markov: Kette bauen/ziehen, `isSaneMarkov`,
  `appendToPersistentCorpus`, `corpusSanitize`. **Hier gehört der Fix hin,
  die Kette inkrementell statt komplett neu zu bauen** (die Ursache der Hänger).

### Generierung (reine Logik, kein DOM)
- **`generation/buildStory.ts`** — Kit-Aufbau aus Bank + Input, Strukturwahl
  (linear/reverse/kreis/fragment/objekt).
- **`generation/dialogue.ts`** — `makeDialogueScene` (Beats an festen Positionen,
  Pool-Dedup, Instabilitäts-Guard, Regieanweisungen).
- **`generation/poemForms.ts`** — `applyReimPoem`, `applyHaikuPoem`,
  `asProsePoem`, Strang.
- **`generation/postprocess.ts`** — `postProcessText`, `coherencePass`,
  `coherenceRepairV2` (Zeichen-/Grammatik-/Namens-Reparatur), Ton-Einschübe,
  Namens-Ersetzung, Großschreibung.
- **`generation/scoring.ts`** — Bewertung/Ranking: `_gp_scoreText`,
  Generalprobe, Wiederholungs-Prüfung (Repcheck), Bestenauslese.

### Zusatz-Werkzeuge (je eigenes Feature)
- **`features/ideas.ts`** — Ideenmaschine (Prämissen, Frische-Mechanik, Pools).
- **`features/world.ts`** — Weltensimulator (Figuren, Orte, Zeitleiste).
- **`features/chapter.ts`** — Kapitel-/Romanmodus.
- **`features/ai.ts`** — Anthropic-API: KI-Wortbank, „An KI übergeben",
  KI-Ranking, KI-Setup (Schlüssel/Modell).
- **`features/oscilloscope.ts`** — Satzrhythmus-Analyse (Kanal A/B).
- **`features/reader.ts`** — Vollbild-Lesemodus (inkl. 🔊-Vorlesen-Anbindung).
- **`features/speech.ts`** — Sprachausgabe (SpeechSynthesis).

### UI-Schicht (die einzige, die das DOM kennt)
- **`ui/studio.ts`** — Kontextzeile, Ton/Form, Preset-Auswahl im Studio,
  Regler, Aktionsbuttons.
- **`ui/wordbank.ts`** — Wortbank-Tab: Preset-Select, Listen-Editor,
  Mutation/Reset, JSON-Import/Export.
- **`ui/tabs.ts`** — Tab-Umschaltung, Popover-Menüs, Hilfe/Modals.
- **`ui/render.ts`** — `animate`/Story-Ausgabe, Meta-Zeile, Toast, Pillen.
- **`main.ts`** — Bootstrap: Module verdrahten, Start-Preset, Event-Listener.

---

## 4. Vorgeschlagene Ordnerstruktur

```
divergenzmaschine/
├─ index.html            (nur noch Grundgerüst + <div id="app">)
├─ package.json
├─ tsconfig.json
├─ vite.config.ts        (Single-File-Bundle für GitHub Pages)
├─ public/               (Icons, manifest.webmanifest, sw.js)
└─ src/
   ├─ types.ts
   ├─ constants.ts
   ├─ text-utils.ts
   ├─ storage.ts
   ├─ wordbank.ts
   ├─ corpus.ts
   ├─ generation/  (buildStory, dialogue, poemForms, postprocess, scoring)
   ├─ features/    (ideas, world, chapter, ai, oscilloscope, reader, speech)
   ├─ ui/          (studio, wordbank, tabs, render)
   └─ main.ts
```

---

## 5. Migrations-Reihenfolge (risikoarm)

1. Vite-Projekt aufsetzen; bestehende `index.html` als Ausgabe durchreichen
   (App unverändert, nur jetzt „gebaut").
2. `<script>` in `src/legacy.js` auslagern, aus HTML laden.
3. `.js` → `.ts`, TypeScript **locker** (`allowJs`, nicht strikt).
4. `types.ts` + `constants.ts` herausziehen und `Bank`/`Preset` typisieren.
5. `text-utils.ts` und `storage.ts` abspalten (klar abgegrenzt, wenig Risiko).
6. `corpus.ts` und `wordbank.ts` — hier auch die **Algorithmus-Fixes**
   (inkrementelle Markov-Kette, Korpus-Deckelung).
7. `generation/*` modularisieren; UI zuletzt (`ui/*`, `main.ts`).
8. Schrittweise auf `strict` hochziehen; Parität per Alt-gegen-Neu-Vergleich prüfen.

---

## 6. Was der Umbau NICHT ändert

- Die App bleibt offline, ohne Server, als eine ausgelieferte Datei.
- Das Nutzererlebnis (Tabs, Buttons, Generierung) bleibt identisch.
- Der Deploy-Kern bleibt GitHub Pages — nur wird künftig die **gebaute**
  Datei gepusht statt der handgeschriebenen `index.html`.

---

## 7. Größter Sofort-Nutzen (falls nur ein Teil umgesetzt wird)

Selbst wenn man nur bis Schritt 4–6 geht, gewinnt man am meisten:
- **`types.ts`** fängt genau die stillen Fehler, die wir zuletzt laufend
  geflickt haben (z. B. Dialogtext, der als Wortbank-Inhalt durchrutscht).
- **`corpus.ts`** löst die eigentliche Performance-Ursache (Hänger bei großem
  Korpus) — unabhängig von der Sprache.
