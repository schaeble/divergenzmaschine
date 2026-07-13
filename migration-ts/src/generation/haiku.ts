// Haiku (5-7-5) — 1:1 aus dem Original portiert.
import { pick, chance, splitSentences } from "../text-utils";
import { cap } from "./beats";
import { normalizeNewlines, capLine, stripDanglingTail, reimShuffle, reimDedupePhrases, estimateSyllables, buildSyllableLine } from "./verselib";
import { HAIKU_DEFAULTS, HAIKU_KIGO, HAIKU_NATURE7, HAIKU_CLOSERS } from "./haiku.data";

const haikuSyllOf = (line: string): number => String(line || "").split(/\s+/).filter(Boolean).reduce((a, w) => a + estimateSyllables(w), 0);

interface Cand { text: string; syll: number; src: number; }
function haikuCandidatesFromPhrases(phrases: string[]): Cand[] {
  const out: Cand[] = []; const seen = new Set<string>();
  phrases.forEach((p, src) => {
    const words = p.replace(/[.,;:!?…()]/g, "").split(/\s+/).filter(Boolean);
    for (let n = 2; n <= Math.min(8, words.length); n++) {
      const sub = stripDanglingTail(words.slice(0, n));
      if (sub.length < 2) continue;
      const last = sub[sub.length - 1]!, next = words[n];
      if (next && /^[A-ZÄÖÜ]/.test(next) && /^[a-zäöü]/.test(last) && /(em|en|er|es|e)$/.test(last)) continue;
      const text = sub.join(" "), key = text.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      out.push({ text, syll: haikuSyllOf(text), src });
    }
  });
  return out;
}

export function applyHaikuPoem(rawText: string, anchorLine = ""): string {
  const opts = HAIKU_DEFAULTS;
  let t = normalizeNewlines(rawText || "").trim().replace(/\([^()]*\)/g, " ")
    .replace(/\bShot\s*\d+\b.*$/gim, "").replace(/\b\d{1,2}\s*:\s*\d{2}\b\s*—\s*/g, "").replace(/\s+/g, " ").trim();
  let phrases: string[] = [];
  for (const s of splitSentences(t)) phrases.push(...String(s).split(/[,;:—–]\s*/g).map((p) => p.trim()).filter(Boolean));
  phrases = phrases.map((p) => p.replace(/^Und\s+/i, "").trim()).filter((p) => p.length >= 4);
  const concrete = phrases.filter((p) => !/^(aber|denn|weil|dass|ob|doch|also)\b/i.test(p))
    .filter((p) => !/\b(Wahrheit|Bedeutung|Einsatz|Gültigkeit|Prinzip|Kontrolle|bedeutet|vielleicht)\b/i.test(p));
  if (concrete.length >= 2) phrases = concrete;
  phrases = reimDedupePhrases(phrases);
  const anchor = anchorLine.trim();
  if (!phrases.length) phrases = [anchor || "ein Satz bleibt zurück"];

  const cands = haikuCandidatesFromPhrases(phrases);
  const used = new Set<string>(), usedSrc = new Set<number>();
  const fromMaterial = (target: number): string | null => {
    const free = cands.filter((c) => !used.has(c.text.toLowerCase()) && !usedSrc.has(c.src));
    const exact = free.filter((c) => c.syll === target), near = free.filter((c) => Math.abs(c.syll - target) === 1);
    const c = exact.length ? pick(exact) : near.length ? pick(near) : null;
    if (!c) return null; used.add(c.text.toLowerCase()); usedSrc.add(c.src); return c.text;
  };
  const fromBank = (bank: string[], target: number): string | null => {
    const free = bank.filter((l) => !used.has(l.toLowerCase()));
    const exact = free.filter((l) => haikuSyllOf(l) === target), near = free.filter((l) => Math.abs(haikuSyllOf(l) - target) === 1);
    const l = exact.length ? pick(exact) : near.length ? pick(near) : null;
    if (!l) return null; used.add(l.toLowerCase()); return l;
  };
  const sourceWords: string[] = [];
  for (const p of phrases) sourceWords.push(...p.replace(/[.,;:!?…]/g, "").split(/\s+/).filter(Boolean));
  if (!sourceWords.length) sourceWords.push("Stille");
  let stream = reimShuffle(sourceWords);
  const greedyLine = (target: number): string => {
    if (stream.length < 6) stream = stream.concat(reimShuffle(sourceWords));
    const lw = stripDanglingTail(buildSyllableLine(stream, target).words);
    return lw.length ? lw.join(" ") : pick(sourceWords);
  };

  const haikus: string[][] = [];
  for (let h = 0; h < opts.maxHaikus; h++) {
    const [t1, t2, t3] = opts.pattern as [number, number, number];
    const l1 = (chance(0.75) ? fromBank(HAIKU_KIGO, t1) : null) || fromMaterial(t1) || fromBank(HAIKU_KIGO, t1) || greedyLine(t1);
    let l2 = fromMaterial(t2) || fromBank(HAIKU_NATURE7, t2) || greedyLine(t2);
    const l3 = fromMaterial(t3) || fromBank(HAIKU_CLOSERS, t3) || greedyLine(t3);
    if (chance(0.7)) l2 += " –";
    haikus.push([cap(capLine(l1)), cap(capLine(l2)), cap(capLine(l3))]);
    if (cands.length < 4) break;
  }
  if (!haikus.length) haikus.push(["Stille bleibt hier", "ohne jede klare Antwort", "und ohne die Zeit"]);
  return normalizeNewlines(haikus.map((h) => h.join("\n")).join("\n\n")).replace(/\n{3,}/g, "\n\n").trim();
}
