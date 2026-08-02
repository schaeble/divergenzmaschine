// Kohärenz-Metriken für die Bewertung: Tempus-Einheitlichkeit, Phrasen-
// Wiederholung (n-Gramme) und Figuren-Disziplin. Alle rein offline und
// heuristisch — sie ersetzen kein Sprachverständnis, fangen aber die
// typischen Symptome zusammengesetzter Texte.
import { splitSentences } from "../text-utils";
import { NOUN_GENDER } from "./nouns.data";

// ── 1) Tempus ────────────────────────────────────────────────────────
// Präteritum-Marker: starke Formen + schwache -te/-ten-Endungen.
const PRAET_STRONG = /\b(war|waren|warst|hatte|hatten|wurde|wurden|ging|gingen|kam|kamen|sah|sahen|gab|gaben|stand|standen|blieb|blieben|hielt|hielten|ließ|ließen|fand|fanden|nahm|nahmen|sprach|sprachen|schrieb|schrieben|trug|trugen|fuhr|fuhren|lief|liefen|saß|saßen|lag|lagen|hieß|hießen|zog|zogen|schlief|schliefen|rief|riefen|fiel|fielen|sang|sangen|trank|tranken|schwieg|schwiegen|floss|flossen|stieg|stiegen|sank|sanken|bot|boten|schloss|schlossen|verlor|verloren|begann|begannen|geschah|geschahen|konnte|konnten|musste|mussten|wollte|wollten|sollte|sollten|durfte|durften|wusste|wussten|dachte|dachten|brachte|brachten)\b/i;
const PRAET_WEAK = /\b[a-zäöüß]{3,}(te|ten|test|tet)\b/i;
const PRAES_MARK = /\b(ist|sind|bin|bist|seid|hat|habe|hast|haben|habt|wird|werden|wirst|kann|kannst|können|muss|musst|müssen|will|willst|wollen|soll|sollen|darf|dürfen|weiß|wissen|geht|gehen|kommt|kommen|sieht|sehen|steht|stehen|bleibt|bleiben|liegt|liegen|gibt|geben|nimmt|nehmen|spricht|sprechen|trägt|tragen|läuft|laufen|fällt|fallen|geschieht|passiert|beginnt|endet)\b/i;

/** Steht dieser einzelne Eintrag/Satz im Präteritum? (für Wortbank-Prüfung) */
export function isPastTense(s: string): boolean {
  const t = s || "";
  return (PRAET_STRONG.test(t) || PRAET_WEAK.test(t)) && !PRAES_MARK.test(t);
}

/** Anteil der Sätze, die von der vorherrschenden Zeitform abweichen (0 = einheitlich). */
export function tenseBreakRatio(text: string): number {
  const sents = splitSentences(text).filter((s) => s.trim().length > 3);
  if (sents.length < 3) return 0;
  let past = 0, pres = 0;
  const tags: ("past" | "pres" | null)[] = sents.map((s) => {
    const isPast = PRAET_STRONG.test(s) || PRAET_WEAK.test(s);
    const isPres = PRAES_MARK.test(s);
    if (isPast && !isPres) { past++; return "past"; }
    if (isPres && !isPast) { pres++; return "pres"; }
    return null;                      // uneindeutig — zählt nicht als Bruch
  });
  const decided = past + pres;
  if (decided < 3) return 0;
  const major = past >= pres ? "past" : "pres";
  const off = tags.filter((t) => t && t !== major).length;
  return off / decided;
}

// ── 2) Phrasen-Wiederholung ──────────────────────────────────────────
const tokens = (t: string): string[] => (t.toLowerCase().match(/[a-zäöüß]{2,}/g) || []);
function ngrams(t: string, n: number): string[] {
  const w = tokens(t); const out: string[] = [];
  for (let i = 0; i + n <= w.length; i++) out.push(w.slice(i, i + n).join(" "));
  return out;
}
/** Anteil mehrfach vorkommender 3–4-Gramme im Text (0 = keine Versatzstücke). */
export function phraseRepeatRatio(text: string): number {
  let dup = 0, total = 0;
  for (const n of [3, 4]) {
    const g = ngrams(text, n);
    if (g.length < 4) continue;
    const seen = new Set<string>();
    for (const x of g) { total++; if (seen.has(x)) dup++; else seen.add(x); }
  }
  return total ? dup / total : 0;
}
/** Überlappung der 4-Gramme mit einem Vergleichsbestand (z. B. Schatzkammer). */
export function phraseOverlap(text: string, corpusNgrams: Set<string>): number {
  if (!corpusNgrams.size) return 0;
  const g = ngrams(text, 4);
  if (!g.length) return 0;
  let hit = 0;
  for (const x of g) if (corpusNgrams.has(x)) hit++;
  return hit / g.length;
}
/** Baut den 4-Gramm-Bestand aus vorhandenen Texten (für phraseOverlap). */
export function buildNgramSet(texts: string[], cap = 20000): Set<string> {
  const set = new Set<string>();
  for (const t of texts) { for (const x of ngrams(t, 4)) { set.add(x); if (set.size >= cap) return set; } }
  return set;
}

// ── 3) Figuren-Disziplin ─────────────────────────────────────────────
const NAME_STOP = new Set(["der","die","das","den","dem","des","ein","eine","einen","einem","einer","und","oder","aber","denn","doch","dann","als","wie","was","wer","wo","wann","warum","ich","du","er","sie","es","wir","ihr","man","hier","dort","jetzt","noch","nur","auch","schon","immer","nie","sehr","so","zu","im","am","auf","in","an","mit","von","für","bei","nach","vor","über","unter","durch","um","ohne","seit","damals","später","zuerst","zuletzt","stille","nein","ja","fast","vielleicht","genau","warte","gut","dabei","dazu","dann"]);
// Im Deutschen sind ALLE Nomen großgeschrieben — Eigennamen erkennt man daher
// daran, dass sie artikellos stehen und nicht im Gattungsnamen-Lexikon vorkommen.
const DETERMINER = /^(der|die|das|den|dem|des|ein|eine|einen|einem|einer|eines|mein|meine|meinen|meinem|meiner|dein|deine|sein|seine|seinen|seinem|ihr|ihre|ihren|ihrem|unser|unsere|euer|eure|kein|keine|keinen|keinem|jeder|jede|jedes|dieser|diese|dieses|diesem|diesen|jener|jene|manche|viele|alle|beide|im|am|zum|zur|ins|ans|vom|beim|aufs|durchs|übers|unters)$/i;
const PREP = /^(in|an|auf|bei|mit|von|zu|nach|über|unter|vor|hinter|neben|zwischen|durch|für|ohne|um|gegen|seit|trotz|wegen|während|aus)$/i;
/** Eigennamen-Kandidaten: großgeschrieben, nicht am Satzanfang, artikellos, kein Gattungsname. */
export function properNames(text: string): string[] {
  const out = new Set<string>();
  for (const sent of splitSentences(text)) {
    const w = sent.trim().split(/\s+/);
    for (let i = 1; i < w.length; i++) {          // i=1: Satzanfang überspringen
      const raw = w[i]!.replace(/[^A-Za-zÄÖÜäöüß-]/g, "");
      if (raw.length < 3 || !/^[A-ZÄÖÜ]/.test(raw)) continue;
      const lowRaw = raw.toLowerCase();
      if (NAME_STOP.has(lowRaw)) continue;
      if (NOUN_GENDER[lowRaw]) continue;          // bekannter Gattungsname → keine Figur
      const prev = (w[i - 1] || "").replace(/[^A-Za-zÄÖÜäöüß]/g, "");
      if (DETERMINER.test(prev) || PREP.test(prev)) continue; // „am Fenster“, „der Bäcker“
      out.add(raw);
    }
  }
  return [...out];
}
/** Streuung der Figuren: 0 = fokussiert, 1 = viele verschiedene Namen auf wenig Text. */
export function castSpread(text: string, expected: string[] = []): number {
  const known = new Set(expected.map((x) => x.toLowerCase()));
  const names = properNames(text).filter((n) => !known.has(n.toLowerCase()));
  const sents = Math.max(1, splitSentences(text).length);
  return Math.min(1, names.length / Math.max(4, sents * 0.5));
}
