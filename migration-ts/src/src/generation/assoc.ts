// Assoziationsketten: Rückprojektion aus einem Studio-Text.
// Ein Saatwort aus dem Text läuft durch jede Form — und jede Form assoziiert
// nach ihrer eigenen Logik und ihrem eigenen Wortschatz.
import { COHERENCE_STOPWORDS } from "./nlp";
import { REIM_GROUPS } from "./reim.data";
import { HAIKU_KIGO, HAIKU_NATURE7, HAIKU_CLOSERS } from "./haiku.data";
import { STRANG_IMAGES } from "./strang.data";
import { VIDEO_CAM_EXTENDED, VIDEO_LIGHT, VIDEO_TEX } from "./video.data";

export interface Chain {
  form: string; label: string; links: string[];
  /** Index, ab dem die Kette den Text verlässt (Klangsprung statt echtem Reim). */
  jumpAt?: number;
}

export const ASSOC_FORMS: [string, string][] = [
  ["prose", "Prosa"], ["poem", "Prosagedicht"], ["strang", "Gedicht-Strang"],
  ["reim", "Reim"], ["haiku", "Haiku"], ["script", "Szene/Dialog"], ["video", "Multi-Shot"],
];

// Häufige Verben und Adverbien, die als Kettenglied nichts tragen.
const FILLER = new Set([
  "kommt", "kommen", "kam", "geht", "gehen", "ging", "steht", "stehen", "stand", "liegt", "liegen",
  "sieht", "sehen", "sah", "immer", "wieder", "schon", "noch", "jetzt", "dann", "auch", "sehr",
  "mehr", "nichts", "etwas", "alles", "niemand", "jemand", "einmal", "vielleicht", "wieder",
  "hatte", "hatten", "wurde", "wurden", "sagte", "sagen", "macht", "machen", "gibt", "geben",
]);

const pick = <T,>(a: T[]): T => a[Math.floor(Math.random() * a.length)]!;
const words = (s: string): string[] => (s.match(/[A-Za-zÄÖÜäöüß-]{3,}/g) || []);

/** Inhaltswörter des Studio-Textes, Substantive bevorzugt. */
export function extractSeeds(text: string, max = 40): string[] {
  const out: string[] = [];
  for (const w of words(text || "")) {
    if (COHERENCE_STOPWORDS.has(w.toLowerCase())) continue;
    if (w.length < 4) continue;
    out.push(w);
  }
  // Großgeschriebene zuerst — im Deutschen meist Substantive.
  const uniq = [...new Set(out)];
  uniq.sort((a, b) => Number(/^[A-ZÄÖÜ]/.test(b)) - Number(/^[A-ZÄÖÜ]/.test(a)));
  return uniq.slice(0, max);
}

/** Sätze des Textes, für den Nachbarschafts-Spaziergang. */
function sentences(text: string): string[][] {
  return (text || "").split(/[.!?;:\n]+/).map((s) => words(s)).filter((a) => a.length > 2);
}

/** Prosa: bleibt im Text. Von Wort zu Wort über gemeinsame Sätze. */
function proseChain(seed: string, text: string, n: number): string[] {
  const sents = sentences(text);
  const links = [seed];
  let cur = seed;
  const seen = new Set([seed.toLowerCase()]);
  for (let i = 1; i < n; i++) {
    const hosts = sents.filter((s) => s.some((w) => w.toLowerCase() === cur.toLowerCase()));
    const ok = (w: string): boolean =>
      w.length >= 4 && !COHERENCE_STOPWORDS.has(w.toLowerCase()) && !FILLER.has(w.toLowerCase()) && !seen.has(w.toLowerCase());
    let pool = (hosts.length ? hosts.flat() : []).filter(ok);
    if (!pool.length) pool = sents.flat().filter(ok);   // Text als Ganzes als Rückfall
    if (!pool.length) break;
    const nouns = pool.filter((w) => /^[A-ZÄÖÜ]/.test(w));
    cur = pick(nouns.length ? nouns : pool); seen.add(cur.toLowerCase()); links.push(cur);
  }
  return links;
}

/** Reim: Assoziation über den Klang. */
function reimChain(seed: string, n: number): { links: string[]; jumpAt?: number } {
  const low = seed.toLowerCase();
  // Echter Reim: die Endung des Saatworts trifft eine Gruppe.
  let group = REIM_GROUPS.find((g) => low.endsWith(g.key));
  let jump = false;
  if (!group) {
    // Kein echter Reim möglich — es gibt nur wenige Gruppen. Also nach Vokal
    // der betonten (meist ersten) Silbe springen: Assonanz statt Behauptung.
    const v = (low.match(/[aeiouäöü]/) || ["e"])[0]!;
    const near = REIM_GROUPS.filter((g) => g.key.includes(v));
    group = near.length ? pick(near) : pick(REIM_GROUPS);
    jump = true;
  }
  const links = [seed];
  const rest = group.words.filter((w) => w.toLowerCase() !== low);
  for (let i = 1; i < n && rest.length; i++) {
    const idx = Math.floor(Math.random() * rest.length);
    links.push(rest.splice(idx, 1)[0]!);
  }
  return jump ? { links, jumpAt: 1 } : { links };
}

/** Sprünge durch eine feste Bildliste. */
function poolChain(seed: string, pools: string[][], n: number): string[] {
  const links = [seed];
  const flat = pools.flat();
  const used = new Set<string>();
  for (let i = 1; i < n && used.size < flat.length; i++) {
    let c = pick(flat), guard = 0;
    while (used.has(c) && guard++ < 30) c = pick(flat);
    used.add(c); links.push(c);
  }
  return links;
}

/** Szene: kurze Äußerungen aus dem Text selbst. */
function scriptChain(seed: string, text: string, n: number): string[] {
  const parts = (text || "").split(/[.!?\n]+/).map((s) => s.trim()).filter((s) => s.length > 8);
  const links = [seed];
  const used = new Set<string>();
  for (let i = 1; i < n && parts.length; i++) {
    let c = pick(parts), guard = 0;
    while (used.has(c) && guard++ < 30) c = pick(parts);
    used.add(c);
    const w = words(c).filter((x) => x.length > 3);
    links.push(w.length ? w.slice(0, 4).join(" ") : c.slice(0, 40));
  }
  return links;
}

export function chainFor(form: string, seed: string, text: string, n: number): string[] {
  switch (form) {
    case "reim": return reimChain(seed, n).links;
    case "haiku": return poolChain(seed, [HAIKU_KIGO, HAIKU_NATURE7, HAIKU_CLOSERS], n);
    case "strang": return poolChain(seed, [STRANG_IMAGES], n);
    case "video": return poolChain(seed, [VIDEO_CAM_EXTENDED, VIDEO_LIGHT, VIDEO_TEX], n);
    case "script": return scriptChain(seed, text, n);
    case "poem": {
      // Prosagedicht: abwechselnd Textwort und Bild.
      const a = proseChain(seed, text, n);
      return a.map((w, i) => (i > 0 && i % 2 === 0 ? pick(STRANG_IMAGES) : w));
    }
    default: return proseChain(seed, text, n);
  }
}

export function buildAllChains(seed: string, text: string, n: number): Chain[] {
  return ASSOC_FORMS.map(([form, label]) => {
    if (form === "reim") { const r = reimChain(seed, n); return { form, label, links: r.links, ...(r.jumpAt ? { jumpAt: r.jumpAt } : {}) }; }
    return { form, label, links: chainFor(form, seed, text, n) };
  });
}
