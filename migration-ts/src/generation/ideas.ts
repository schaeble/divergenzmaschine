// Ideenmaschine: kurze Prämissen aus Kontext-Pools + Archetyp + Preset.
// Optional gesteuert durch ein Ideen-Profil (IdeaConfig), das Pools, Archetyp,
// Template-Auswahl und Divergenz (Twist/Mashup) bestimmt.
import { pick, clean, ensurePunct } from "../text-utils";
import { cap } from "./beats";
import { arch } from "./archetype";
import { getAllPresets } from "../wordbank";
import { CTX_WHO, CTX_WHERE, CTX_WHEN, CTX_WHAT, WHO_TWISTS, WHERE_TWISTS, WHEN_TWISTS, WHAT_TWISTS } from "./ideas.data";
import type { IdeaConfig } from "../features/ideaprofile";
import { liveTexts } from "../features/livepools";

export interface Idea { text: string; archetype: string; presetLabel: string; seedWho: string; seedWhere: string; seedWhen: string; seedWhat: string; }

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

const fresh = (base: string[], tw: string[], tag: string, prob: number, dbl: boolean): string => {
  const b = pickFresh(base, tag);
  if (Math.random() >= prob) return b;
  let out = b + ", " + pickFresh(tw, tag + "T");
  if (dbl && Math.random() < prob) out += ", " + pickFresh(tw, tag + "T");
  return out;
};

function ideaPoolFor(a: ReturnType<typeof arch>, presetBank: Record<string, string[]>, cat: string): string[] {
  const fromArch = (a && a.add && a.add[cat]) || [];
  const fromPreset = presetBank[cat] || [];
  const combined = [...fromArch, ...fromPreset];
  return combined.length ? combined : ["etwas Unbenanntes"];
}

interface Seed { W: string; O: string; N: string; A: string; M: string; H: string; T: string; B: string; S: string; }
const TEMPLATES: { tags: string[]; f: (s: Seed) => string }[] = [
  { tags: ["raetsel", "konzept", "offen"], f: (s) => `Was, wenn ${s.W} ${s.O} ${s.A} — und dabei auf ${s.M} stößt?` },
  { tags: ["atmo", "figur"], f: (s) => `${cap(s.W)} ${s.A}. Doch ${s.O} wartet ${s.H}.` },
  { tags: ["handlung", "enthuellung"], f: (s) => `Die Prämisse: ${s.W} ${s.A}, ${s.N}. ${cap(s.T)}.` },
  { tags: ["figur", "umkehr"], f: (s) => `${cap(s.W)} glaubt, alles im Griff zu haben — bis ${s.M} auftaucht.` },
  { tags: ["atmo", "intim"], f: (s) => `${cap(s.O)}, ${s.N}: ${s.W} ${s.A}. ${cap(s.B)}.` },
  { tags: ["figur", "eskalation"], f: (s) => `${cap(s.W)} ${s.A}. ${s.S}` },
  { tags: ["konzept", "raetsel"], f: (s) => `Kern der Idee: ${s.W} stößt ${s.O} auf ${s.H} — und ${s.T}.` },
  { tags: ["handlung", "zeit"], f: (s) => `${cap(s.N)}: ${s.W} ${s.A} — und ${s.T}.` },
  { tags: ["atmo", "enthuellung"], f: (s) => `Alles beginnt damit, dass ${s.W} ${s.O} etwas findet: ${s.M}.` },
  { tags: ["eskalation", "episch"], f: (s) => `Niemand rechnet damit, doch ${s.W} ${s.A} — ${s.O}. ${s.S}` },
  { tags: ["kampf", "system"], f: (s) => `${cap(s.W)} stellt sich ${s.B} entgegen — ${s.O}, ${s.N}.` },
  { tags: ["inner", "figur", "intim"], f: (s) => `Niemand weiß, dass ${s.W} ${s.A}. Am Ende bleibt nur ${s.M}.` },
  { tags: ["natur", "atmo"], f: (s) => `${cap(s.O)} kippt: ${s.W} ${s.A}, während ${s.H} näher rückt.` },
  { tags: ["paradox", "konzept"], f: (s) => `Je mehr ${s.W} ${s.A}, desto näher rückt ${s.M}.` },
  { tags: ["ironie", "figur"], f: (s) => `${cap(s.W)} sucht ${s.M} — und findet ausgerechnet ${s.H}.` },
  { tags: ["kosmisch", "konzept"], f: (s) => `Eine einzige Frage bleibt: was, wenn ${s.M} nie existierte und ${s.W} es ${s.N} beweisen muss?` },
  { tags: ["umkehr", "enthuellung"], f: (s) => `Was wie ${s.H} beginnt, entpuppt sich als ${s.M}: ${s.W} ${s.A}.` },
  { tags: ["offen", "form"], f: (s) => `${cap(s.W)}, ${s.O}, ${s.N}. Und dann: ${s.T}.` },
  { tags: ["zeit", "eskalation"], f: (s) => `${cap(s.N)} bleibt ${s.W}, um ${s.A} — bevor ${s.B}.` },
  { tags: ["form", "atmo", "intim"], f: (s) => `Nur ein Bild: ${s.W} ${s.O}, ${s.M}, und ${s.S}` },
];

function chooseTemplate(cfg?: IdeaConfig): (s: Seed) => string {
  if (!cfg || !cfg.tags.length) return pick(TEMPLATES).f;
  const want = new Set(cfg.tags);
  const scored = TEMPLATES.map((t) => ({ t, sc: t.tags.reduce((n, tg) => n + (want.has(tg) ? 1 : 0), 0) }));
  const max = Math.max(...scored.map((x) => x.sc));
  const cand = max > 0 ? scored.filter((x) => x.sc === max).map((x) => x.t) : TEMPLATES;
  return pick(cand).f;
}

function mergedBank(count: number): { bank: Record<string, string[]>; label: string } {
  const presetPool = Object.values(getAllPresets());
  if (!presetPool.length) return { bank: {}, label: "–" };
  const n = Math.max(1, Math.min(count, presetPool.length));
  const chosen: typeof presetPool = [];
  const used = new Set<number>();
  let guard = 0;
  while (chosen.length < n && guard++ < n * 6) {
    const i = Math.floor(Math.random() * presetPool.length);
    if (used.has(i)) continue;
    used.add(i); chosen.push(presetPool[i]!);
  }
  const bank: Record<string, string[]> = {};
  for (const pr of chosen) {
    const b = (pr.bank || {}) as Record<string, string[]>;
    for (const [k, v] of Object.entries(b)) bank[k] = [...(bank[k] || []), ...v];
  }
  return { bank, label: chosen.map((c) => c.label).join(" × ") };
}

/** Motiv-Slot: mit Wahrscheinlichkeit liveShare aus dem eigenen Material.
 *  Nur dieser Slot ist grammatisch nachsichtig genug für rohe Substantivphrasen. */
function pickMotif(a: ReturnType<typeof arch>, pb: Record<string, string[]>, cfg?: IdeaConfig): string {
  const share = cfg ? cfg.liveShare : 0;
  if (share > 0 && Math.random() < share) {
    const live = liveTexts();
    if (live.length >= 5) return pickFresh(live, "live");
  }
  return pickFresh(ideaPoolFor(a, pb, "motifs"), "motifs");
}

export function buildIdeaPremise(cfg?: IdeaConfig): Idea {
  const archId = cfg ? cfg.archetypeId : pick(["neutral", "skorpion", "psychopath", "entdecker"]);
  const a = arch(archId);
  const { bank: pb, label: presetLabel } = mergedBank(cfg ? cfg.mashupCount : 1);

  const prob = cfg ? cfg.twistProb : 0.5;
  const dbl = cfg ? cfg.doubleTwist : false;
  const whoP = cfg && cfg.whoPool.length ? cfg.whoPool : CTX_WHO;
  const whereP = cfg && cfg.wherePool.length ? cfg.wherePool : CTX_WHERE;
  const whenP = cfg && cfg.whenPool.length ? cfg.whenPool : CTX_WHEN;
  const whatP = cfg && cfg.whatPool.length ? cfg.whatPool : CTX_WHAT;

  const s: Seed = {
    W: fresh(whoP, WHO_TWISTS, "who", prob, dbl),
    O: fresh(whereP, WHERE_TWISTS, "where", prob, dbl),
    N: fresh(whenP, WHEN_TWISTS, "when", prob, dbl),
    A: fresh(whatP, WHAT_TWISTS, "what", prob, dbl),
    M: pickMotif(a, pb, cfg),
    H: pickFresh(ideaPoolFor(a, pb, "hooks"), "hooks"),
    T: pickFresh(ideaPoolFor(a, pb, "turns"), "turns"),
    B: pickFresh(ideaPoolFor(a, pb, "obstacles"), "obstacles"),
    S: pickFresh(ideaPoolFor(a, pb, "stakes"), "stakes"),
  };

  let text = chooseTemplate(cfg)(s);
  text = clean(text).replace(/\s+([,.!?;:])/g, "$1");
  text = ensurePunct(text);
  return { text, archetype: a.label || archId, presetLabel, seedWho: s.W, seedWhere: s.O, seedWhen: s.N, seedWhat: s.A };
}

export function generateIdeaBatch(n: number, cfg?: IdeaConfig): Idea[] {
  const out: Idea[] = [];
  const seen = new Set<string>();
  let guard = 0;
  while (out.length < n && guard++ < n * 8) {
    const idea = buildIdeaPremise(cfg);
    if (seen.has(idea.text)) continue;
    seen.add(idea.text);
    out.push(idea);
  }
  return out;
}
