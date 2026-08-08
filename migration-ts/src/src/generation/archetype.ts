// Archetyp-Augmentierung der Wortbank-Listen.
import { ARCHETYPES } from "./archetypes.data";
import type { ArchetypeFull } from "./archetypes.data";

export function arch(id: string): ArchetypeFull {
  return ARCHETYPES[id] || ARCHETYPES.neutral!;
}

export function archetypeAugmentList(baseList: string[], archA: string, archB: string, key: string): string[] {
  const A = arch(archA), B = arch(archB);
  const extra = ([] as string[]).concat(A.add?.[key] || []).concat(B.add?.[key] || []);
  const base = Array.isArray(baseList) ? baseList : [];
  if (extra.length) return base.concat(extra, extra); // x2 Übergewichtung
  return base;
}
