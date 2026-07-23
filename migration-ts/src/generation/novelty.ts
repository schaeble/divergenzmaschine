// Novelty Search (5.1) + Motiv-Cooldown (5.6).
// Novelty: Abstand einer Variante zum Archiv (Schatzkammer) belohnen, damit das
//   Ranking nicht nur auf Qualität, sondern auch auf Neuheit optimiert.
// Cooldown: kürzlich stark benutzte Motive (aus den lebendigen Pools, die n/d je
//   Eintrag führen) temporär abwerten — gegen Konvergenz auf Lieblingsbilder.
import { loadTreasury } from "../features/treasury";
import { loadLive } from "../features/livepools";

const tokens = (s: string): string[] => (s || "").toLowerCase().match(/[a-zäöüßA-ZÄÖÜ]+/g) || [];
function trigrams(s: string): string[] {
  const w = tokens(s); const out: string[] = [];
  for (let i = 0; i + 2 < w.length + 1 && i + 3 <= w.length; i++) out.push(w[i]! + " " + w[i + 1]! + " " + w[i + 2]!);
  return out;
}

export interface NoveltyContext { archive: Set<string>; archiveSize: number; hot: string[]; }

/** Archiv aus der Schatzkammer (kuratiertes Gedächtnis) + Cooldown-Phrasen. */
export function buildNoveltyContext(cooldownDays = 4, minN = 3, hotCap = 40): NoveltyContext {
  const archive = new Set<string>();
  let archiveSize = 0;
  try {
    for (const t of loadTreasury()) { archiveSize++; for (const g of trigrams(t.t)) archive.add(g); }
  } catch { /* leer */ }

  // Cooldown: häufig verstärkte (n>=minN), kürzlich benutzte Pool-Phrasen.
  let hot: string[] = [];
  try {
    const now = Date.now();
    const win = cooldownDays * 24 * 3600 * 1000;
    hot = loadLive()
      .filter((e) => e.n >= minN && now - e.d <= win)
      .sort((a, b) => (b.n - a.n) || (b.d - a.d))
      .slice(0, hotCap)
      .map((e) => e.t.toLowerCase());
  } catch { /* leer */ }

  return { archive, archiveSize, hot };
}

/** 0 = alle Trigramme schon im Archiv, 1 = alles neu. */
export function noveltyOf(txt: string, ctx: NoveltyContext): number {
  if (!ctx.archive.size) return 1;
  const tg = trigrams(txt);
  if (!tg.length) return 1;
  let seen = 0;
  for (const g of tg) if (ctx.archive.has(g)) seen++;
  return 1 - seen / tg.length;
}

/** Anteil der Cooldown-Phrasen, die im Text vorkommen (0..1, gedeckelt). */
export function cooldownHit(txt: string, ctx: NoveltyContext): number {
  if (!ctx.hot.length) return 0;
  const low = (txt || "").toLowerCase();
  let hits = 0;
  for (const p of ctx.hot) if (p.length >= 4 && low.includes(p)) hits++;
  return Math.min(1, hits / 6);
}
