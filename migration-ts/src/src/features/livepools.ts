// Lebendige Pools: sammelt kurze Begriffe und Wendungen aus dem, was du
// tatsächlich schreibst (Schatzkammer, Korpus, Generierungen) und mischt sie
// zurück in die Ideenmaschine. Global gespeichert, gedeckelt, rein lokal.
import { safeSet } from "./storage-status";

const LP_KEY = "divergenz_live_pools_v1";
const LP_CAP = 300;

export interface LiveItem { t: string; n: number; d: number; }

/** Gewichte je Quelle: Kuratiertes zählt mehr als roher Output. */
export const LIVE_W = { schatz: 3, korpus: 2, gen: 1 } as const;

// Substantive, die als Motiv nichts taugen.
const STOP_NOUN = new Set([
  "Ich", "Er", "Sie", "Es", "Wir", "Ihr", "Du", "Man", "Herr", "Frau", "Herrn",
  "Jahr", "Jahre", "Jahren", "Mal", "Weise", "Art", "Teil", "Ende", "Anfang", "Seite", "Stelle",
]);

// Unbestimmte Artikel -> Nominativform (Genus stammt aus dem Quelltext).
const ART_NOM: Record<string, string> = {
  ein: "ein", einen: "ein", einem: "ein", eines: "ein", eine: "eine", einer: "eine",
};
// Präpositionen, nach denen ein artikelloses Substantiv ein echtes Abstraktum ist.
const PREP = new Set([
  "auf", "aus", "vor", "in", "mit", "ohne", "gegen", "durch", "von", "zu", "bei", "nach",
  "über", "unter", "um", "wie", "als", "zwischen",
]);

const clip = (s: string): string => s.replace(/^[^A-Za-zÄÖÜäöüß]+|[^A-Za-zÄÖÜäöüß]+$/g, "");
const isNoun = (w: string): boolean =>
  /^[A-ZÄÖÜ][A-Za-zÄÖÜäöüß-]{3,}$/.test(w) && !STOP_NOUN.has(w) && w.length <= 24;

/**
 * Zieht Motiv-taugliche Nominalphrasen aus einem Text. Zwei Muster:
 *  1. unbestimmter Artikel (+ Adjektiv) + Substantiv  ->  "ein Koffer"
 *     Der Artikel wird in den Nominativ gebracht, das Adjektiv fällt weg
 *     (seine Endung stammt aus dem Quellkasus und würde sonst kollidieren).
 *  2. Präposition + artikelloses Substantiv  ->  "Schweigen" (echtes Abstraktum)
 */
export function extractPhrases(text: string): string[] {
  const src = (text || "").replace(/\s+/g, " ").trim();
  if (!src) return [];
  const out = new Set<string>();
  for (const sentence of src.split(/[.!?…]+\s+/)) {
    const toks = sentence.split(" ").map(clip).filter(Boolean);
    for (let i = 0; i < toks.length; i++) {
      const w = toks[i]!;
      if (!isNoun(w)) continue;
      const p1 = i >= 1 ? toks[i - 1]!.toLowerCase() : "";
      const p2 = i >= 2 ? toks[i - 2]!.toLowerCase() : "";
      const art = ART_NOM[p1] || (/^[a-zäöüß-]{4,}$/.test(p1) ? ART_NOM[p2] : undefined);
      if (art) { out.add(art + " " + w); continue; }
      if (PREP.has(p1)) out.add(w);
    }
  }
  return [...out];
}

export function loadLive(): LiveItem[] {
  try {
    const v = JSON.parse(localStorage.getItem(LP_KEY) || "[]");
    return Array.isArray(v) ? (v as LiveItem[]).filter((x) => x && typeof x.t === "string") : [];
  } catch { return []; }
}
function saveLive(list: LiveItem[]): void {
  safeSet(LP_KEY, JSON.stringify(list), "Lebendige Pools");
}

/** Füttert die Pools. weight über LIVE_W je nach Quelle. */
export function feedLivePools(text: string, weight: number): void {
  const phrases = extractPhrases(text);
  if (!phrases.length) return;
  const list = loadLive();
  const idx = new Map(list.map((e, i) => [e.t, i]));
  const now = Date.now();
  for (const p of phrases) {
    const at = idx.get(p);
    if (at === undefined) { list.push({ t: p, n: weight, d: now }); idx.set(p, list.length - 1); }
    else { list[at]!.n += weight; list[at]!.d = now; }
  }
  if (list.length > LP_CAP) {
    // Schwächste zuerst raus: Häufigkeit vor Aktualität.
    list.sort((a, b) => (b.n - a.n) || (b.d - a.d));
    list.length = LP_CAP;
  }
  saveLive(list);
}

/** Texte, nach Stärke sortiert — die Ideenmaschine zieht daraus. */
export function liveTexts(): string[] {
  return loadLive().sort((a, b) => (b.n - a.n) || (b.d - a.d)).map((e) => e.t);
}
export function liveCount(): number { return loadLive().length; }
export function clearLivePools(): void { try { localStorage.removeItem(LP_KEY); } catch { /* egal */ } }

// Projektdatei
export function exportLivePools(): LiveItem[] { return loadLive(); }
export function importLivePools(v: unknown): void {
  if (Array.isArray(v)) saveLive((v as LiveItem[]).filter((x) => x && typeof x.t === "string").slice(0, LP_CAP));
}
