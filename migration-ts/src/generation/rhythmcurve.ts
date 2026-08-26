// Rhythmus-Transplantation: eine Ziel-Kurve (Satzlängen-Partitur) steuert die
// Generierung. Statt Text -> Kurve zu messen, wird Kurve -> Text erzeugt: pro
// Kurven-Slot gewinnt der Kandidat-Satz, dessen Wortlänge dem Ziel am nächsten
// kommt. Der Satzpool stammt aus der aktiven Wortbank (buildStory), das Vokabular
// bleibt also vom Rhythmus unabhängig — Form und Inhalt werden getrennte Achsen.
import type { Bank, GenInput } from "../types";
import type { MarkovModel } from "../corpus";
import { buildStory } from "./buildStory";
import { randomContext } from "./context";

const splitSents = (t: string): string[] =>
  (t || "").replace(/\s+/g, " ").trim().split(/(?<=[.!?…])\s+/).filter((s) => s.trim().length > 0);
const wlen = (s: string): number => (s.toLowerCase().match(/[a-zäöüßA-ZÄÖÜ]+/g) || []).length;
// Verschmelzen zweier Sätze zu einem Slot. Gemeldet, aus einer Kadenz-Kurve:
// fünf von sechs Sätzen in Folge nach dem Muster „A — B", weil hier immer der
// Gedankenstrich stand. Jetzt wechseln Strich und Semikolon ab, und ein Satz,
// der schon einen Strich trägt, bekommt keinen zweiten — „A — B — C" war die
// Dreifach-Verschmelzung. Nach dem Semikolon bleibt die Großschreibung
// erhalten (Nomen, Namen); der Rhythmus misst Wörter, nicht Zeichen.
let mergeZaehler = 0;
const mergeSents = (a: string, b: string): string => {
  const kopf = a.replace(/[.!?…]+$/, "").trim();
  const strich = !kopf.includes("—") && !b.includes("—") && (mergeZaehler++ % 2 === 0);
  return kopf + (strich ? " — " : "; ") + b.trim();
};

/** Liest die Satzlängen-Kurve (Wörter pro Satz) aus einem Vorbild-Text. */
export function curveFromText(text: string): number[] {
  return splitSents(text).map(wlen).filter((n) => n > 0);
}

/** Eingebaute Kurven (Wortzahl pro Satz-Slot). */
export const CURVE_PRESETS: { id: string; label: string; curve: number[] }[] = [
  { id: "stakkato",   label: "Stakkato",        curve: [3, 4, 3, 5, 3, 4, 2, 5, 3, 4] },
  { id: "boegen",     label: "Lange Bögen",     curve: [22, 26, 19, 28, 23, 21] },
  { id: "wechsel",    label: "Wechselatem",     curve: [4, 20, 3, 24, 5, 18, 4, 22, 3, 19] },
  { id: "kleist",     label: "Kleist-lang",     curve: [30, 27, 33, 25, 29] },
  { id: "kadenz",     label: "Bibel-Kadenz",    curve: [12, 10, 13, 11, 14, 10, 12, 11] },
  { id: "crescendo",  label: "Crescendo",       curve: [3, 5, 8, 12, 16, 21, 27] },
];

export interface CurveResult { text: string; targets: number[]; actual: number[]; poolSize: number; }

/**
 * Erzeugt einen Text, dessen Satzlängen der Ziel-Kurve folgen.
 * @param targets Ziel-Wortzahlen pro Satz-Slot.
 */
export function generateToCurve(
  bank: Bank, base: GenInput, model: MarkovModel | undefined, targets: number[], poolFactor = 5,
): CurveResult {
  const clean = targets.map((n) => Math.max(1, Math.round(n))).filter((n) => n > 0);
  const n = clean.length;
  if (!n) return { text: "", targets: [], actual: [], poolSize: 0 };

  // Satzpool aus vielen Generierungen aufbauen (Kontext je Lauf neu würfeln = mehr Vielfalt).
  const pool: { s: string; len: number }[] = [];
  const seen = new Set<string>();
  const need = Math.max(n * poolFactor, 48);
  let guard = 0;
  while (pool.length < need && guard < need * 4) {
    guard++;
    const ctx = randomContext();
    const story = buildStory(bank, { ...base, ...ctx, form: "prose" }, model);
    for (const s of splitSents(story)) {
      const key = s.toLowerCase();
      if (seen.has(key)) continue;
      const L = wlen(s);
      if (L < 1) continue;
      seen.add(key);
      pool.push({ s, len: L });
    }
  }

  // Slot-Füllung. Zwei Kniffe gegen verfehlte Lang-Ziele:
  //  (a) Längste Ziele zuerst — sie greifen sich die langen Sätze, solange der
  //      Pool noch voll ist; die kurzen kommen mit dem Rest problemlos aus.
  //  (b) Greedy-Mehrfach-Verschmelzung (bis 3 Sätze) für lange Ziele: solange
  //      Hinzunehmen die Abweichung verkleinert und das Ziel nicht überschritten
  //      ist, wird ein weiterer Satz per Gedankenstrich angehängt.
  const used = new Array<boolean>(pool.length).fill(false);
  const chosen = new Array<string>(n);
  const actual = new Array<number>(n);

  const pickFit = (target: number): number[] => {
    const maxParts = target >= 40 ? 3 : target >= 12 ? 2 : 1;
    const parts: number[] = [];
    let sum = 0;
    for (let p = 0; p < maxParts; p++) {
      let bi = -1, bd = Infinity;
      for (let i = 0; i < pool.length; i++) {
        if (used[i] || parts.includes(i)) continue;
        const d = Math.abs(sum + pool[i]!.len - target);
        if (d < bd) { bd = d; bi = i; }
      }
      if (bi < 0) break;
      if (parts.length > 0 && Math.abs(sum - target) <= bd) break;  // Anhängen bringt nichts mehr
      parts.push(bi); sum += pool[bi]!.len;
      if (sum >= target) break;                                     // Ziel erreicht/überschritten
    }
    return parts;
  };

  const order = clean.map((_, i) => i).sort((a, b) => clean[b]! - clean[a]!);  // längste zuerst
  for (const ti of order) {
    const parts = pickFit(clean[ti]!);
    if (!parts.length) {
      const extra = splitSents(buildStory(bank, { ...base, ...randomContext(), form: "prose" }, model))[0] || "…";
      chosen[ti] = extra; actual[ti] = wlen(extra);
      continue;
    }
    for (const i of parts) used[i] = true;
    const merged = parts.map((i) => pool[i]!.s).reduce((acc, sen) => (acc ? mergeSents(acc, sen) : sen), "");
    chosen[ti] = merged; actual[ti] = wlen(merged);
  }

  return { text: chosen.join(" "), targets: clean, actual, poolSize: pool.length };
}
