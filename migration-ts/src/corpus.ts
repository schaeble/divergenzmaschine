// Persistenter Markov-Korpus + inkrementelles Markov-Modell.
//
// KERN-FIX gegenüber dem Live-Code: Das Modell wird EINMAL aus dem Korpus
// aufgebaut und danach INKREMENTELL mit jedem neuen Text erweitert
// (model.addText), statt bei jeder Generierung die ganze Kette neu aus dem
// kompletten Korpus zu bauen. Das war die eigentliche Ursache der Hänger bei
// großem Korpus.
import { STORAGE_CORPUS, CORPUS_MAX } from "./constants";
import { clean } from "./text-utils";
import { safeSet } from "./features/storage-status";
import { CLAUSE_VERBS } from "./generation/beats";
import { stueckPlausibel } from "./generation/satzwaechter";
import { feedLivePools, LIVE_W } from "./features/livepools";

export function loadPersistentCorpus(): string {
  try { return localStorage.getItem(STORAGE_CORPUS) || ""; } catch { return ""; }
}

export function savePersistentCorpus(text: string): void {
  safeSet(STORAGE_CORPUS, text, "Korpus");
}

/** Ganze Zeilen, die kein Satz sind, sondern Gerüst: Kopfzeilen des Berichts,
 *  der Meldung und der Zeitungsseite selbst. Die Marke steht am Zeilenanfang —
 *  „Faktenkasten" mitten in einem Satz ist ein Wort wie jedes andere. */
export const GERUEST_ZEILE = /^\s*(Faktenkasten\b|Kurz gemeldet\s*$|Fiktive Zeitung\b|Zeitzeichen\s*[·|]|Nr\.\s*\d+\s*[·|]|UNABHÄNGIG\b|SEQUENZ\s*—|(?:WER|WO|WANN|WAS|GESAMTLÄNGE)\s*:)/;

/** Entfernt typische Selbstfütterungs-Rückstände vor dem Lernen. */
export function corpusSanitize(text: string): string {
  let s = (text ?? "").toString();
  // ZUERST zeilenweise: das Geruest der eigenen Multi-Shot-Ausgabe. Wer seine
  // Texte in den Korpus legt, legt es mit hinein — in Ausgabe Nr. 41 stand
  // „WAS: will die Spur bewusst auf" mitten in einem Prosaabsatz. Kopfzeilen
  // fliegen ganz raus, bei Shot- und Sprachzeilen nur die Marke: Dahinter steht
  // ein richtiger Satz, den zu verlieren schade waere.
  // Muss vor dem Entfernen der Klammern stehen, sonst ist „(3s)" schon weg.
  s = s.split(/\r?\n/)
    .filter((z) => !/^\s*(SEQUENZ\s*—|(?:WER|WO|WANN|WAS|GESAMTLÄNGE)\s*:)/.test(z))
    .map((z) => z.replace(/^\s*(?:Shot\s*\d+\s*\([^)]*\)|(?:DE|EN)\s*:)\s*/, ""))
    .join("\n");
  s = s.replace(/\([^()]*\)/g, " ");                                   // Meta-Klammern
  // Zeitstempel-Shards. Die Präposition muss MIT weg: „Gegen 00:39 — und der
  // Blick blieb." wurde sonst zu „Gegen und der Blick blieb."
  s = s.replace(/\b(?:gegen|um|ab|seit|bis)\s+\d{1,2}:\d{2}\b\s*(?:—|–)?\s*/gi, "");
  s = s.replace(/\b\d{1,2}:\d{2}\b\s*—\s*/g, "");
  s = s.replace(/\b(Schluss|Notiz|Rand|Gestern|Jetzt|Später|Drei Tage später)\s*—\s*/g, "");
  s = s.replace(/\bSZENE:\s*/g, "");                                   // Dialog-Kopf
  // Das Gerüst des BERICHTS und der Zeitungsseite. Der Autopilot legt seine
  // Ausgaben in die Schatzkammer, die Schatzkammer füttert den Korpus — das
  // Gerüst wächst also mit jeder Ausgabe ins Material hinein. In Nr. 44 stand
  // „Faktenkasten · Betroffen: 3.840 Haushalte · Dauer: 50 Stunden" mitten in
  // einem Prosaabsatz.
  s = s.split(/\r?\n/).filter((z) => !GERUEST_ZEILE.test(z)).join("\n");
  // Und dasselbe SATZWEISE. In Ausgabe Nr. 46 stand der Faktenkasten mitten in
  // einem Absatz („Ein Geruch aus der Kindheit. Faktenkasten · Neu: 3.660
  // Haushalte · …") — dort greift eine Zeilenregel nicht. Die Marke ist
  // eindeutig genug, um bis zum nächsten Satzende zu löschen.
  // Bis zu einem Punkt, dem ein Leerzeichen und ein Großbuchstabe folgen — der
  // Punkt in „3.660" ist keiner.
  s = s.replace(/Faktenkasten\s*·[^\n]*?(?:\.(?=\s+[A-ZÄÖÜ])|$)/g, " ");
  s = s.replace(/—\s*(?=[.—])/g, "");                                  // verwaiste Gedankenstriche
  s = s.replace(/\.{2,}/g, ".");                                       // Doppel-Punkte
  s = s.replace(/\s+/g, " ").trim();
  return s;
}

export interface HygieneStats { sentencesBefore: number; sentencesAfter: number; removed: number; duplicates: number; charsBefore: number; charsAfter: number; }

/** Korpus-Hygiene (6.6): satzweise segmentieren, Müllsätze und Duplikate entfernen.
 *  Der Markov-Generator lernt sonst Fehler und Fragmente mit. */
export function corpusHygiene(text: string): { text: string; stats: HygieneStats } {
  const src = corpusSanitize(text || "");
  const sentences = src.split(/(?<=[.!?…])\s+/).map((x) => x.trim()).filter(Boolean);
  const charsBefore = (text || "").length;
  const seen = new Set<string>();
  const kept: string[] = [];
  let duplicates = 0;

  for (const raw of sentences) {
    const letters = (raw.match(/[a-zäöüßA-ZÄÖÜ]/g) || []).length;
    const words = raw.match(/[a-zäöüßA-ZÄÖÜ]{2,}/g) || [];
    // Müll: zu kurz, zu wenig Buchstaben, kein vokalhaltiges Wort.
    if (words.length < 4) continue;
    if (letters / raw.length < 0.45) continue;
    if (!words.some((w) => /[aeiouäöüy]/i.test(w))) continue;
    // Telegramm-/Kopfzeilen: fast alles großgeschrieben und kurz.
    const upper = words.filter((w) => /^[A-ZÄÖÜ]/.test(w)).length;
    if (words.length < 8 && upper / words.length > 0.7) continue;
    // Duplikate (normalisiert) verwerfen — überfüttern die Kette.
    const norm = raw.toLowerCase().replace(/\s+/g, " ");
    if (seen.has(norm)) { duplicates++; continue; }
    seen.add(norm);
    kept.push(/[.!?…]$/.test(raw) ? raw : raw + ".");
  }

  let out = kept.join(" ");
  if (out.length > CORPUS_MAX) {
    out = out.slice(out.length - CORPUS_MAX);
    const cut = out.indexOf(" "); if (cut > 0) out = out.slice(cut + 1);
  }
  return { text: out, stats: {
    sentencesBefore: sentences.length, sentencesAfter: kept.length,
    removed: sentences.length - kept.length, duplicates,
    charsBefore, charsAfter: out.length,
  } };
}

// ── Selbstreinigung (4.344.0) ────────────────────────────────────────────────
// Gewünscht: Doppelte Sätze und Bruchstücke sollen automatisch gehen — wie der
// Schalter „Korpus säubern", nur ohne Klick. Ist die Selbstreinigung an
// (Vorgabe: an), läuft nach jedem Hinzufügen dieselbe Hygiene über den ganzen
// Korpus. Alle Zugänge sind erfasst, weil alle durch appendToPersistentCorpus
// gehen: Korpus-Reiter, Selbstfütterung, Sammler, Abschrift, Bildsammler,
// Bildwelt. Das Ergebnis der letzten Reinigung bleibt abrufbar (letzteReinigung).
const SELBSTREINIGUNG_KEY = "dm_korpus_selbstreinigung_v1";
export function selbstreinigungAn(): boolean {
  try { const v = localStorage.getItem(SELBSTREINIGUNG_KEY); return v === null ? true : v === "1"; } catch { return true; }
}
export function setzeSelbstreinigung(an: boolean): void {
  try { localStorage.setItem(SELBSTREINIGUNG_KEY, an ? "1" : "0"); } catch { /* voll */ }
}
let letzte: (HygieneStats & { zeit: string }) | null = null;
export function letzteReinigung(): (HygieneStats & { zeit: string }) | null { return letzte; }

export function appendToPersistentCorpus(textToAdd: string): void {
  const add = corpusSanitize(clean(textToAdd));
  if (!add) return;
  try { feedLivePools(add, LIVE_W.korpus); } catch { /* egal */ }
  let corpus = loadPersistentCorpus();
  const sep = corpus.trim().length ? "\n\n" : "";
  corpus = corpus + sep + add;
  if (corpus.length > CORPUS_MAX) {
    corpus = corpus.slice(corpus.length - CORPUS_MAX);
    const cut = corpus.indexOf("\n\n");
    if (cut > 0 && cut < 5000) corpus = corpus.slice(cut + 2);
  }
  if (selbstreinigungAn()) {
    const h = corpusHygiene(corpus);
    if (h.stats.removed > 0 || h.stats.duplicates > 0) corpus = h.text;
    letzte = { ...h.stats, zeit: new Date().toLocaleTimeString("de-DE") };
  }
  savePersistentCorpus(corpus);
}

/** Prüft, ob ein Markov-Ergebnis brauchbar ist (aus dem Live-Code portiert). */
export function isSaneMarkov(s: string): boolean {
  if (!s || s.length < 20) return false;
  const words = s.split(/\s+/);
  if (words.length < 5) return false;

  const freq: Record<string, number> = {};
  for (const w of words) freq[w] = (freq[w] || 0) + 1;
  const maxFreq = Math.max(...Object.values(freq));
  if (maxFreq / words.length > 0.5) return false;

  const functionWords = new Set([
    "der", "die", "das", "den", "dem", "des", "ein", "eine", "einen", "einem",
    "einer", "eines", "in", "auf", "an", "bei", "mit", "nach", "von", "aus",
    "vor", "hinter", "über", "unter", "neben", "zwischen",
  ]);
  let fn = 0;
  for (const w of words) if (functionWords.has(w.toLowerCase())) fn++;
  if (fn / words.length > 0.6) return false;

  const sentences = s.split(/[.!?]+/).filter(Boolean);
  for (const sentence of sentences) {
    const n = sentence.trim().split(/\s+/).length;
    if (n > 30 || n < 2) return false;
  }

  const phrases: string[] = [];
  for (let i = 0; i < words.length - 2; i++) phrases.push(words.slice(i, i + 3).join(" "));
  const pc: Record<string, number> = {};
  for (const p of phrases) pc[p] = (pc[p] || 0) + 1;
  for (const c of Object.values(pc)) if (c >= 3) return false;

  if (/\b(Schluss|Notiz|Rand)\s*—|\bSZENE:|dass\s*—|,\s*dass\s*$/i.test(s)) return false;
  if (/[—–]\s*$/.test(s.trim())) return false;

  // Naht-Bruch: Kopula/Hilfsverb + zweites finites Vollverb in kurzem Abstand ohne
  // Konjunktion/Komma (z. B. "… war er schon wartet") -> verwerfen. Bewusst nur von
  // Kopula/Hilfsverb ausgelöst, damit "sah ihn kommen" (Wahrnehmung+Infinitiv) bleibt.
  const AUX_MK = new Set(["bin","bist","ist","sind","seid","war","warst","waren","wart","hatte","hattest","hatten","hat","habe","hast","habt","haben","wurde","wurdest","wurden","wird","werde","werden","wäre","wärst","wären"]);
  const CONN_MK = new Set(["und","oder","aber","denn","sondern","doch","weil","dass","wenn","als","während","obwohl","damit","sodass","bevor","nachdem","ob","wie","wo","der","die","das","dem","den"]);
  for (let i = 0; i < words.length; i++) {
    const wi = words[i]!.toLowerCase().replace(/[^a-zäöüß]/g, "");
    if (!AUX_MK.has(wi)) continue;
    for (let j = i + 1; j <= Math.min(words.length - 1, i + 3); j++) {
      const wj = words[j]!.toLowerCase().replace(/[^a-zäöüß]/g, "");
      if (CONN_MK.has(wj) || /[,;:]/.test(words[j]!)) break;              // Nebensatz/Aufzählung ok
      const finite = /(t|te|ten|st)$/.test(wj) && CLAUSE_VERBS.has(wj) && !/^ge/.test(wj) && !AUX_MK.has(wj);
      if (finite) return false;
    }
  }

  // Loop-Erkennung: dasselbe Inhaltswort in sehr kurzem Abstand deutet auf eine
  // Markov-Schleife hin (z. B. "… bricht genau dort bricht …") -> verwerfen.
  const lw = words.map((w) => w.toLowerCase().replace(/[^a-zäöüß]/g, ""));
  for (let i = 0; i < lw.length; i++) {
    if (lw[i]!.length < 5) continue;
    for (let j = i + 1; j <= Math.min(lw.length - 1, i + 3); j++) {
      if (lw[j] === lw[i]) return false;
    }
  }
  // Satz-Wächter (Empfehlung Punkt 1): Die statistischen Prüfungen oben lassen
  // verschmolzene Ketten-Reste durch, weil sie aus echten Wörtern in echter
  // Häufigkeit bestehen. Die Grammatik-Gestalt prüft satzwaechter.ts — mit der
  // Morphologie, konservativ, jede Regel mit ihrem gemeldeten Fall.
  if (!stueckPlausibel(s)) return false;

  return true;
}

// Funktions-/Bindewörter, die am Ende eines Markov-Stücks "abgeschnitten" wirken.
const MK_TAIL_STOP = new Set([
  "und", "oder", "aber", "denn", "sondern", "doch", "wie", "als", "ob", "dass",
  "weil", "während", "der", "die", "das", "den", "dem", "des", "ein", "eine",
  "einen", "einem", "einer", "zu", "in", "auf", "an", "mit", "von", "aus", "vor",
  "für", "bei", "nach", "über", "unter", "noch", "nur", "auch", "so", "dann", "genau",
  "im", "am", "beim", "zum", "zur", "ins", "vom", "ans", "aufs", "fürs", "durchs", "übers", "ums",
]);

/** Glättet Markov-Rohausgabe: unmittelbare Wort-Dubletten zusammenfassen, hängende
 *  Bindewörter kappen, sauberer Satzabschluss + Großschreibung. Nicht-destruktiv –
 *  Schleifen werden von isSaneMarkov verworfen, hier wird nur aufgeräumt. */
export function smoothMarkov(s: string): string {
  let words = (s || "").trim().split(/\s+/).filter(Boolean);
  if (!words.length) return "";
  const norm = (w: string): string => w.toLowerCase().replace(/[^a-zäöüß]/g, "");
  // 1) unmittelbare Dubletten ("der der" -> "der", "bricht bricht" -> "bricht")
  const dedup: string[] = [];
  for (const w of words) {
    const prev = dedup[dedup.length - 1];
    if (prev && norm(prev) && norm(prev) === norm(w)) continue;
    dedup.push(w);
  }
  words = dedup;
  // 2) hängende Funktions-/Bindewörter am Ende entfernen
  while (words.length > 3 && MK_TAIL_STOP.has(norm(words[words.length - 1]!))) words.pop();
  let t = words.join(" ").replace(/\s+([,.;:!?…])/g, "$1").trim();
  // 3) sauberer Abschluss + Großschreibung
  t = t.replace(/[\s,;:—–-]+$/, "");
  if (t && !/[.!?…]$/.test(t)) t += ".";
  t = t.replace(/^([a-zäöüß])/, (c) => c.toUpperCase());
  return t;
}

/**
 * Inkrementelles Wort-Markov-Modell (Ordnung konfigurierbar, Standard 2).
 * addText() erweitert das bestehende Modell in O(Textlänge) — kein Neuaufbau.
 */
export class MarkovModel {
  private readonly order: number;
  private readonly map = new Map<string, string[]>();
  private readonly starts: string[] = [];

  constructor(order = 2) { this.order = Math.max(1, order); }

  get size(): number { return this.map.size; }

  /** Fügt einen Text inkrementell hinzu. */
  addText(text: string): void {
    const clean1 = corpusSanitize(text);
    for (const sentence of clean1.split(/(?<=[.!?…])\s+/)) {
      const tokens = sentence.split(/\s+/).filter(Boolean);
      if (tokens.length <= this.order) continue;
      this.starts.push(tokens.slice(0, this.order).join(" "));
      for (let i = 0; i + this.order < tokens.length; i++) {
        const key = tokens.slice(i, i + this.order).join(" ");
        const next = tokens[i + this.order]!;
        const arr = this.map.get(key);
        if (arr) arr.push(next); else this.map.set(key, [next]);
      }
    }
  }

  /** Mittlere Überraschung (bits) eines Textes unter dem eigenen Modell, 0..1 normiert.
   *  Hoch = der Text folgt unwahrscheinlichen Übergängen (informationsreich),
   *  niedrig = er reproduziert den Korpus (klischeehaft). Nur bekannte Keys zählen. */
  surprise(text: string): number {
    const clean1 = corpusSanitize(text);
    let bits = 0, n = 0;
    for (const sentence of clean1.split(/(?<=[.!?…])\s+/)) {
      const toks = sentence.split(/\s+/).filter(Boolean);
      for (let i = 0; i + this.order < toks.length; i++) {
        const key = toks.slice(i, i + this.order).join(" ");
        const choices = this.map.get(key);
        if (!choices || !choices.length) continue;         // unbekannt: keine Information
        const next = toks[i + this.order]!;
        let c = 0; for (const x of choices) if (x === next) c++;
        const p = c > 0 ? c / choices.length : 1 / (choices.length + 1); // ungesehene Fortsetzung
        bits += -Math.log2(p); n++;
      }
    }
    if (n < 2) return -1;                                   // zu wenig Signal
    return Math.max(0, Math.min(1, (bits / n) / 8));        // ~8 bit als Obergrenze
  }

  /** Erzeugt einen Text (bis maxWords Wörter). */
  generate(maxWords = 40): string {
    if (!this.starts.length) return "";
    let key = this.starts[Math.floor(Math.random() * this.starts.length)]!;
    const out = key.split(" ");
    // Weiche Grenze: bis zur Hälfte über maxWords darf die Kette laufen, um
    // ihr Satzende noch zu erreichen — sonst würde fast jede Kette mit 14
    // Wörtern Vorgabe mitten im Satz enden und verworfen.
    const hart = Math.ceil(maxWords * 1.5);
    while (out.length < hart) {
      const choices = this.map.get(key);
      if (!choices || !choices.length) break;
      const next = choices[Math.floor(Math.random() * choices.length)]!;
      out.push(next);
      key = out.slice(out.length - this.order).join(" ");
      if (/[.!?…]$/.test(next) && out.length >= this.order + 2) break;
    }
    // Nur ganze Sätze. Endet die Kette an einer Sackgasse des Korpus oder an
    // der Wortgrenze, steht sie mitten im Satz — „Eine Feder, die auf stillem
    // Wasser", „eine Schlagzeile, die es nicht" —, und der Glätter hängte
    // einen Punkt an. Jetzt wird bis zum letzten Satzende zurückgeschnitten;
    // gibt es keines, ist die Kette nichts wert und kommt leer zurück.
    if (!/[.!?…]$/.test(out[out.length - 1] || "")) {
      let i = out.length - 1;
      while (i >= 0 && !/[.!?…]$/.test(out[i]!)) i--;
      if (i < this.order + 1) return "";
      out.length = i + 1;
    }
    return out.join(" ");
  }
}

/** Baut ein Modell EINMAL aus dem gespeicherten Korpus auf. */
export function buildModelFromCorpus(order = 2): MarkovModel {
  const model = new MarkovModel(order);
  const corpus = loadPersistentCorpus();
  if (corpus) model.addText(corpus);
  return model;
}
