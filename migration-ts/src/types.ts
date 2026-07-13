// Zentrale Datenformen der Divergenzmaschine.
// Heute existieren sie im Code nur implizit als Objekt-Konventionen.

/** Die sieben Wortbank-Kategorien. */
export type BankKey =
  | "motifs" | "hooks" | "props" | "turns" | "obstacles" | "stakes" | "endings";

/** Eine Wortbank: je Kategorie eine Liste von Einträgen. */
export type Bank = Record<BankKey, string[]>;

/** Textform einer Generierung. */
export type FormKind =
  | "prose" | "drama" | "poem" | "strang" | "reim" | "haiku" | "script" | "video";

/** Instabilitäts-Stufe (Aus / Subtil / Aggressiv). */
export type Instability = 0 | 1 | 2;

/** Ein Preset (eingebaut oder vom Nutzer gespeichert). */
export interface Preset {
  id: string;                 // z. B. "builtin:rimbaud" | "user:MeinName"
  label: string;              // mit Icon, z. B. "🚤 Rimbaud"
  kind: "builtin" | "user";
  bank: Bank;
}

/** Stil-Datenquelle je Realitätsmodus (bureau, tech, body, myth, absurd, post). */
export interface ModeData {
  label?: string;
  nouns: string[];
  verbs: string[];
  images: string[];
  rules: string[];
}

/** Ton-Einfärbung (Einleitung + verteilte Einschübe). */
export interface ToneData {
  opener: string[];
  flavor: string[];
}

/** Archetyp (u. a. Sprecherrollen für Dialoge). */
export interface Archetype {
  speakers: string[];
}

/** Eingabe eines Generierungslaufs, aus dem Studio-UI gelesen. */
export interface GenInput {
  where: string; when: string; who: string; what: string;
  tone: string; varLevel: string; form: FormKind;
  structure: string; mode: string; perspective: string;
  rhythm: string; markovMode: string; disruptor: string;
  archetypeA: string; archetypeB: string; instability: Instability;
  polish: boolean; polishStyle: string;
  shots?: number; totalSec?: number; // nur Form "video"
}

/** "Kit": die aus Bank + Input abgeleiteten Bausteine für einen Lauf. */
export interface StoryKit {
  W: string; T: string; P: string;
  motif: string; hook: string; hookAcc: string; hookDat: string;
  prop: string; propAcc: string; propDat: string;
  turn: string; obstacle: string; stake: string; ending: string;
  speakerA: string; speakerB: string;
  mode: ModeData; archetypeA: string; archetypeB: string; instability: Instability;
  // Struktur-relevante Felder (aus dem "Was passiert" abgeleitet)
  Apure: string; AleadVerb: string; AisClause: boolean; AisInfinitiveLed: boolean;
  // aufgelöste Auto-Wahlen + Rohfelder
  PRaw: string; A: string; structure: string; perspective: string; rhythm: string;
}

/** Persistente Einstellungen (Gedächtnis / Selbstfütterung / gespeicherter Korpus). */
export interface Settings {
  enabled: boolean;
  learnStories: boolean;
  useSaved: boolean;
}
