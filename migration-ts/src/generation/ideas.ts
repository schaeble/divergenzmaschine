// Ideenmaschine: kurze Prämissen aus Kontext-Pools + Archetyp + Preset.
// Hinweis: die "lebendigen Pools" (dynMerged aus Generierungen/Welt/Schatzkammer)
// sind hier auf die Basislisten vereinfacht.
import { pick, clean, ensurePunct } from "../text-utils";
import { cap } from "./beats";
import { arch } from "./archetype";
import { getAllPresets } from "../wordbank";
import { CTX_WHO, CTX_WHERE, CTX_WHEN, CTX_WHAT, WHO_TWISTS, WHERE_TWISTS, WHEN_TWISTS, WHAT_TWISTS } from "./ideas.data";

export interface Idea { text: string; archetype: string; presetLabel: string; }

const recent: Record<string, string[]> = {};
function pickFresh(pool: string[], tag: string): string {
  if (!pool || !pool.length) return "etwas Unbenanntes";
  const memo = recent[tag] || (recent[tag] = []);
  const cap = Math.max(0, Math.min(pool.length - 1, 40));
  let cand = pool.filter((x) => memo.indexOf(x) === -1);
  if (!cand.length) { recent[tag] = []; cand = pool.slice(); }
  const chosen = cand[Math.floor(Math.random() * cand.length)]!;
  memo.push(chosen);
  while (memo.length > cap) memo.shift();
  return chosen;
}

const fresh = (base: string[], tw: string[], tag: string): string => {
  const b = pickFresh(base, tag);
  return Math.random() < 0.5 ? b : b + ", " + pickFresh(tw, tag + "T");
};

function ideaPoolFor(a: ReturnType<typeof arch>, presetBank: Record<string, string[]>, cat: string): string[] {
  const fromArch = (a && a.add && a.add[cat]) || [];
  const fromPreset = presetBank[cat] || [];
  const combined = [...fromArch, ...fromPreset];
  return combined.length ? combined : ["etwas Unbenanntes"];
}

export function buildIdeaPremise(): Idea {
  const archId = pick(["neutral", "skorpion", "psychopath", "entdecker"]);
  const a = arch(archId);
  const presetPool = Object.values(getAllPresets());
  const preset = presetPool.length ? pick(presetPool) : null;
  const pb = (preset ? preset.bank : {}) as Record<string, string[]>;

  const W = fresh(CTX_WHO, WHO_TWISTS, "who");
  const O = fresh(CTX_WHERE, WHERE_TWISTS, "where");
  const N = fresh(CTX_WHEN, WHEN_TWISTS, "when");
  const A = fresh(CTX_WHAT, WHAT_TWISTS, "what");
  const M = pickFresh(ideaPoolFor(a, pb, "motifs"), "motifs");
  const H = pickFresh(ideaPoolFor(a, pb, "hooks"), "hooks");
  const T = pickFresh(ideaPoolFor(a, pb, "turns"), "turns");
  const B = pickFresh(ideaPoolFor(a, pb, "obstacles"), "obstacles");
  const S = pickFresh(ideaPoolFor(a, pb, "stakes"), "stakes");

  const templates: (() => string)[] = [
    () => `Was, wenn ${W} ${O} ${A} — und dabei auf ${M} stößt?`,
    () => `${cap(W)} ${A}. Doch ${O} wartet ${H}.`,
    () => `Die Prämisse: ${W} ${A}, ${N}. ${cap(T)}.`,
    () => `${cap(W)} glaubt, alles im Griff zu haben — bis ${M} auftaucht.`,
    () => `${cap(O)}, ${N}: ${W} ${A}. ${cap(B)}.`,
    () => `${cap(W)} ${A}. ${S}`,
    () => `Kern der Idee: ${W} stößt ${O} auf ${H} — und ${T}.`,
    () => `${cap(N)}: ${W} ${A} — und ${T}.`,
    () => `Alles beginnt damit, dass ${W} ${O} etwas findet: ${M}.`,
    () => `Niemand rechnet damit, doch ${W} ${A} — ${O}. ${S}`,
  ];
  let text = pick(templates)();
  text = clean(text).replace(/\s+([,.!?;:])/g, "$1");
  text = ensurePunct(text);
  return { text, archetype: a.label || archId, presetLabel: preset ? preset.label : "–" };
}

export function generateIdeaBatch(n: number): Idea[] {
  const out: Idea[] = [];
  const seen = new Set<string>();
  let guard = 0;
  while (out.length < n && guard++ < n * 8) {
    const idea = buildIdeaPremise();
    if (seen.has(idea.text)) continue;
    seen.add(idea.text);
    out.push(idea);
  }
  return out;
}
