// Reim (Paarreim AABB) — 1:1 aus dem Original portiert, mit kuratierten
// Reimgruppen und Schlussformeln (echte Reime, nicht nur Zeilenumbrüche).
import { pick, splitSentences } from "../text-utils";
import { normalizeNewlines, capLine, insertStanzas, stripDanglingTail, reimShuffle, reimDedupePhrases } from "./verselib";
import type { RhymeGroup } from "./reim.data";
import { REIM_GROUPS, REIM_TAILS, REIM_RHYTHM_TARGETS, REIM_CONNECTORS, REIM_DEFAULTS } from "./reim.data";


function reimCoreOf(phrase: string, targetWords: number): string {
  let words = String(phrase || "").replace(/\s+/g, " ").trim().split(" ").filter(Boolean);
  if (words.length > targetWords) words = words.slice(0, targetWords);
  words = stripDanglingTail(words);
  return words.join(" ").replace(/[.,;:!?…]+$/, "").trim();
}
function reimGroupOfWord(word: string): RhymeGroup | null {
  const w = (word || "").toLowerCase().replace(/[.,;:!?…]/g, "");
  if (w.length < 4) return null;
  for (const g of REIM_GROUPS) {
    if (w.length > g.key.length && w.endsWith(g.key)) return g;
    if (g.words.some((x) => x.toLowerCase() === w)) return g;
  }
  return null;
}
function pickRhymeWord(group: RhymeGroup, exclude?: string): string {
  const ex = (exclude || "").toLowerCase().replace(/[.,;:!?…]/g, "");
  const options = group.words.filter((w) => { const lw = w.toLowerCase(); return !ex || (lw !== ex && !lw.endsWith(ex) && !ex.endsWith(lw)); });
  return options.length ? pick(options) : pick(group.words);
}
function lineWithRhyme(phrase: string, rhymeWord: string, targetWords: number, connector: string): string {
  let words = String(phrase || "").replace(/\s+/g, " ").trim().split(" ").filter(Boolean);
  words = words.filter((w) => w.toLowerCase().replace(/[.,;:!?…]/g, "") !== rhymeWord.toLowerCase());
  if (words.length > targetWords) words = words.slice(0, targetWords);
  words = stripDanglingTail(words);
  let core = words.join(" ").replace(/[.,;:!?…]+$/, "").trim();
  if (!core) core = "Es bleibt";
  const tails = REIM_TAILS[rhymeWord];
  if (tails && tails.length) return capLine(`${core}, ${pick(tails)}.`);
  return capLine(`${core}${connector}${rhymeWord}.`);
}

export function applyReimPoem(rawText: string, anchorLine = ""): string {
  const opts = REIM_DEFAULTS;
  let t = normalizeNewlines(rawText || "").trim().replace(/\([^()]*\)/g, " ")
    .replace(/\bShot\s*\d+\b.*$/gim, "").replace(/\b\d{1,2}\s*:\s*\d{2}\b\s*—\s*/g, "").replace(/\s+/g, " ").trim();
  let phrases: string[] = [];
  for (const s of splitSentences(t)) phrases.push(...String(s).split(/[,;:—–]\s*/g).map((p) => p.trim()).filter(Boolean));
  phrases = phrases.map((p) => p.replace(/^Und\s+/i, "").trim()).filter((p) => p.length >= 6);
  phrases = reimDedupePhrases(phrases);
  const anchor = anchorLine.trim();
  if (!phrases.length) phrases = [anchor || "Ein Satz bleibt zurück"];
  const originalCount = phrases.length; let guard = 0;
  while (phrases.length < opts.targetLines && guard++ < 50) phrases.push(phrases[phrases.length % originalCount] || anchor || phrases[0]!);

  let groupPool = reimShuffle(REIM_GROUPS);
  const nextGroup = (): RhymeGroup => { if (!groupPool.length) groupPool = reimShuffle(REIM_GROUPS); return groupPool.shift()!; };

  const lines: string[] = [];
  let pi = 0, coupletIdx = 0;
  while (lines.length < opts.targetLines && pi < phrases.length) {
    const targetWords = REIM_RHYTHM_TARGETS[coupletIdx % REIM_RHYTHM_TARGETS.length]!;
    const connector = REIM_CONNECTORS[coupletIdx % REIM_CONNECTORS.length]!;
    const coreA = reimCoreOf(phrases[pi] || anchor, targetWords);
    const lastA = coreA.split(" ").pop() || "";
    const natural = reimGroupOfWord(lastA);
    let group: RhymeGroup, wA: string;
    if (natural && coreA.split(" ").length >= 2) { group = natural; wA = lastA; lines.push(capLine(`${coreA}.`)); }
    else { group = nextGroup(); wA = pickRhymeWord(group); lines.push(lineWithRhyme(phrases[pi] || anchor, wA, targetWords, connector)); }
    pi++;
    const wB = pickRhymeWord(group, wA);
    lines.push(lineWithRhyme(phrases[pi] || anchor, wB, targetWords, connector));
    pi++; coupletIdx++;
  }
  return normalizeNewlines(insertStanzas(lines.slice(0, opts.targetLines), opts.stanzaEvery).join("\n")).replace(/\n{3,}/g, "\n\n").trim();
}
