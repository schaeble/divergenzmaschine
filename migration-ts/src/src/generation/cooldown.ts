// Session-Cooldown: reduziert den "Fingerabdruck" wiederkehrender Satz-Skelette
// und verhindert verbatim-Wiederholungen von Markov-Fragmenten in kurzer Folge.
// Zustand lebt modulweit = über die ganze Session (bis Reload).
import { pick } from "../text-utils";

const recent: Record<string, string[]> = {};
const KEEP = 5; // so viele letzte Auswahlen je Schlüssel werden gemieden

/** Wie pick(), meidet aber die zuletzt für denselben Schlüssel gewählten Optionen. */
export function pickFresh<T extends string>(key: string, opts: T[]): T {
  if (!opts.length) return opts[0] as T;
  const seen = recent[key] || (recent[key] = []);
  const fresh = opts.filter((o) => !seen.includes(o));
  const choice = (fresh.length ? pick(fresh) : pick(opts));
  seen.push(choice);
  while (seen.length > Math.min(KEEP, opts.length - 1)) seen.shift();
  return choice;
}

/** Index-Variante: rotiert Template-FORMEN (unabhängig vom eingefüllten Inhalt). */
export function pickFreshIndex(key: string, n: number): number {
  if (n <= 1) return 0;
  const idxs = Array.from({ length: n }, (_, i) => String(i));
  return Number(pickFresh(key, idxs));
}

// --- Markov-Fragment-Dedupe über die Session ---
const recentMarkov: string[] = [];
const MK_KEEP = 24;
const mkNorm = (s: string): string => s.toLowerCase().replace(/[^a-zäöüß ]/g, "").replace(/\s+/g, " ").trim();

export function markovSeenRecently(s: string): boolean {
  const n = mkNorm(s);
  return n.length > 0 && recentMarkov.includes(n);
}
export function noteMarkov(s: string): void {
  const n = mkNorm(s);
  if (!n) return;
  recentMarkov.push(n);
  while (recentMarkov.length > MK_KEEP) recentMarkov.shift();
}
