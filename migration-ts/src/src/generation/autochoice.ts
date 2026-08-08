// Archetyp-gewichtete Auto-Wahl (mode/structure/perspective/rhythm).
import { arch } from "./archetype";

function mergeWeights(a?: Record<string, number>, b?: Record<string, number>): Record<string, number> {
  const out: Record<string, number> = {};
  for (const [k, w] of Object.entries(a || {})) out[k] = (out[k] || 0) + w;
  for (const [k, w] of Object.entries(b || {})) out[k] = (out[k] || 0) + w;
  return out;
}

function weightedPick(map: Record<string, number>): string | null {
  const entries = Object.entries(map || {}).filter(([, w]) => Number.isFinite(w) && w > 0);
  if (!entries.length) return null;
  let sum = 0;
  for (const [, w] of entries) sum += w;
  let r = Math.random() * sum;
  for (const [k, w] of entries) { r -= w; if (r <= 0) return k; }
  return entries[entries.length - 1]![0];
}

export function biasedAutoChoice(kind: string, archA: string, archB: string): string | null {
  return weightedPick(mergeWeights(arch(archA).weights?.[kind], arch(archB).weights?.[kind]));
}
