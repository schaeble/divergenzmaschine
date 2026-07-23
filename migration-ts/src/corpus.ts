// Persistenter Markov-Korpus + inkrementelles Markov-Modell.
//
// KERN-FIX gegenüber dem Live-Code: Das Modell wird EINMAL aus dem Korpus
// aufgebaut und danach INKREMENTELL mit jedem neuen Text erweitert
// (model.addText), statt bei jeder Generierung die ganze Kette neu aus dem
// kompletten Korpus zu bauen. Das war die eigentliche Ursache der Hänger bei
// großem Korpus.
import { STORAGE_CORPUS, CORPUS_MAX } from "./constants";
import { clean } from "./text-utils";
import { feedLivePools, LIVE_W } from "./features/livepools";

export function loadPersistentCorpus(): string {
  try { return localStorage.getItem(STORAGE_CORPUS) || ""; } catch { return ""; }
}

export function savePersistentCorpus(text: string): void {
  try { localStorage.setItem(STORAGE_CORPUS, text); } catch { /* Speicher voll o. Ä. */ }
}

/** Entfernt typische Selbstfütterungs-Rückstände vor dem Lernen. */
export function corpusSanitize(text: string): string {
  let s = (text ?? "").toString();
  s = s.replace(/\([^()]*\)/g, " ");                                   // Meta-Klammern
  s = s.replace(/\b\d{1,2}:\d{2}\b\s*—\s*/g, "");                      // Zeitstempel-Shards
  s = s.replace(/\b(Schluss|Notiz|Rand|Gestern|Jetzt|Später|Drei Tage später)\s*—\s*/g, "");
  s = s.replace(/\bSZENE:\s*/g, "");                                   // Dialog-Kopf
  s = s.replace(/—\s*(?=[.—])/g, "");                                  // verwaiste Gedankenstriche
  s = s.replace(/\.{2,}/g, ".");                                       // Doppel-Punkte
  s = s.replace(/\s+/g, " ").trim();
  return s;
}

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
  return true;
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
    while (out.length < maxWords) {
      const choices = this.map.get(key);
      if (!choices || !choices.length) break;
      const next = choices[Math.floor(Math.random() * choices.length)]!;
      out.push(next);
      key = out.slice(out.length - this.order).join(" ");
      if (/[.!?…]$/.test(next) && out.length >= this.order + 2) break;
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
