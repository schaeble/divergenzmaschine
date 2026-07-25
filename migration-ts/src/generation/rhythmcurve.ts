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
const mergeSents = (a: string, b: string): string => a.replace(/[.!?…]+$/, "").trim() + " — " + b.trim();

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
  const need = Math.max(n * poolFactor, 24);
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

  // Slot-Füllung: pro Ziel den nächstgelegenen, noch unbenutzten Satz.
  const used = new Array<boolean>(pool.length).fill(false);
  const chosen: string[] = [];
  const actual: number[] = [];
  for (const tgt of clean) {
    // bester Einzelsatz
    let bi = -1, bd = Infinity;
    for (let i = 0; i < pool.length; i++) {
      if (used[i]) continue;
      const d = Math.abs(pool[i]!.len - tgt);
      if (d < bd) { bd = d; bi = i; }
    }
    // bestes Paar (nur wenn Einzel unzureichend und Ziel lang): zwei Sätze zu
    // einem langen Atemzug verschmelzen — trifft 25–35-Wort-Ziele, die einzeln
    // im Pool fehlen.
    let pi = -1, pj = -1, pd = Infinity;
    if (bd > 3 && tgt >= 12) {
      for (let i = 0; i < pool.length; i++) {
        if (used[i]) continue;
        for (let j = i + 1; j < pool.length; j++) {
          if (used[j]) continue;
          const d = Math.abs(pool[i]!.len + pool[j]!.len - tgt);
          if (d < pd) { pd = d; pi = i; pj = j; }
        }
      }
    }
    if (pi >= 0 && pd < bd) {
      used[pi] = true; used[pj] = true;
      const merged = mergeSents(pool[pi]!.s, pool[pj]!.s);
      chosen.push(merged); actual.push(wlen(merged));
      continue;
    }
    if (bi < 0) {
      const extra = splitSents(buildStory(bank, { ...base, ...randomContext(), form: "prose" }, model))[0];
      if (extra) { chosen.push(extra); actual.push(wlen(extra)); }
      continue;
    }
    used[bi] = true;
    chosen.push(pool[bi]!.s);
    actual.push(pool[bi]!.len);
  }

  return { text: chosen.join(" "), targets: clean, actual, poolSize: pool.length };
}
