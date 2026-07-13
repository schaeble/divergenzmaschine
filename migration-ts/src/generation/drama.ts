// Drama (Konsequenz-Schicht) — 1:1 aus dem Original portiert.

import { normalizeNewlines } from "./verselib";
import { isActionSentence, isConcreteLossSentence, isDecisionSentence, isDisturbanceSentence, isToneLine } from "./sentclass";

interface Conflict { whoA: string; whoB: string; WILL: string; BLOCKADE: string; VERLUST: string; }
interface DramaOpts {
  cutRatio: number; minActionRatio: number; maxRepeatToken: number;
  requireDecision: boolean; requireConcreteLoss: boolean; requireEscalation: boolean; allowCinematicMarkers: boolean;
}
const DRAMA_DEFAULTS: DramaOpts = {
  cutRatio: 0.35, minActionRatio: 0.5, maxRepeatToken: 2,
  requireDecision: true, requireConcreteLoss: true, requireEscalation: true, allowCinematicMarkers: true,
};

function hashString(s: string): number { let h = 0; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0; return h; }

const DRAMA_WILLS = ["will das Gehäuse verlassen", "will die Reihenfolge korrigieren", "will den Namen behalten", "will den Transistor zum Schweigen bringen", "will beweisen, dass die Erinnerung falsch ist"];
const DRAMA_BLOCK = ["der Transistor speichert jede Bewegung", "das Gehäuse lässt niemanden hinaus", "die Zeit springt rückwärts", "das System glättet jede Abweichung", "eine Regel verbietet die Wahrheit"];
const DRAMA_LOSS = ["es löscht sich selbst", "es verliert die Gegenwart", "es verbrennt den Speicher", "es verliert den einzigen Zeugen", "es zerstört das Foto"];

export function buildDramaConflict(whoA: string, whoB: string, seed?: string): Conflict {
  const p = (arr: string[], i: number): string => arr[Math.abs(i) % arr.length]!;
  const h = hashString(seed || (whoA || "A") + "|" + (whoB || "B"));
  return {
    whoA: whoA || "A", whoB: whoB || "B",
    WILL: `${whoA || "A"} ${p(DRAMA_WILLS, h)}`,
    BLOCKADE: `Aber ${p(DRAMA_BLOCK, h + 7)}.`,
    VERLUST: `Wenn ${whoA || "A"} es versucht, ${p(DRAMA_LOSS, h + 13)}.`,
  };
}

const toSentences = (text: string): string[] => normalizeNewlines(text).replace(/\s+/g, " ").split(/(?<=[.!?])\s+/).map((s) => s.trim()).filter(Boolean);
const toLines = (text: string): string[] => normalizeNewlines(text).split("\n").map((l) => l.trim()).filter(Boolean);
const looksLineBased = (text: string): boolean => { const lines = text.split("\n").filter(Boolean); return lines.length >= 6 && lines.length > text.split(".").length; };
const isPureMeta = (u: string): boolean => /^(\d{1,2}:\d{2}|shot\s*\d+|\(.*s\s*pro\s*shot.*\)|handheld|micro-?shake)\b/i.test(u);
const stripCinematicMarkers = (text: string): string => text.split("\n").filter((l) => !isPureMeta(l.trim())).join("\n");
function enforceCinematicConsequence(text: string): string {
  const lines = normalizeNewlines(text).split("\n"); const out: string[] = [];
  for (let i = 0; i < lines.length; i++) {
    const cur = lines[i]!.trim(); if (!cur) continue;
    if (isPureMeta(cur)) { const next = (lines[i + 1] || "").trim(); if (next && isActionSentence(next)) out.push(cur); }
    else out.push(cur);
  }
  return out.join("\n");
}
function ensureConflictPresence(units: string[], c: Conflict): string[] {
  const joined = units.join(" ").toLowerCase();
  const needWill = !joined.includes("will") && !joined.includes("möchte");
  const needBlock = !joined.includes("aber");
  const needLoss = !joined.includes("wenn") || (!joined.includes("verlier") && !joined.includes("löscht") && !joined.includes("stirbt") && !joined.includes("brennt"));
  const inject: string[] = [];
  if (needWill) inject.push(c.WILL + ".");
  if (needBlock) inject.push(c.BLOCKADE);
  if (needLoss) inject.push(c.VERLUST);
  if (inject.length) return [...units.slice(0, 2), ...inject, ...units.slice(2)];
  return units;
}
const buildDisturbanceLine = (c: Conflict): string => `Plötzlich kippt das System: ${c.whoA || "A"} sieht, dass jede Korrektur etwas löscht.`;
const buildDecisionLine = (_c: Conflict): string => `Also entscheide ich: Ich lasse die Reihenfolge falsch – und bezahle dafür.`;
function enforceEscalation(units: string[], c: Conflict): string[] {
  let out = [...units];
  if (!units.some(isDisturbanceSentence)) out.splice(Math.min(4, out.length), 0, buildDisturbanceLine(c));
  if (!units.some(isDecisionSentence)) out.push(buildDecisionLine(c));
  return out;
}
function enforceConcreteLoss(units: string[], c: Conflict): string[] {
  if (units.some(isConcreteLossSentence)) return units;
  const out = [...units]; out.splice(Math.max(2, Math.floor(out.length * 0.66)), 0, c.VERLUST); return out;
}
function reduceAbstraction(units: string[]): string[] {
  const abstract = ["der einsatz ist", "alles ist korrekt", "paradoxon", "omen", "erinnerung", "wahrheit", "inkonsistenz", "oberfläche"];
  return units.map((u) => u.trim()).filter((u) => {
    const low = u.toLowerCase();
    if (!abstract.some((p) => low.includes(p))) return true;
    return isActionSentence(u) || isConcreteLossSentence(u) || isDecisionSentence(u);
  });
}
function enforceActionRatio(units: string[], opts: DramaOpts): string[] {
  const ratio = units.length ? units.filter(isActionSentence).length / units.length : 0;
  if (ratio >= opts.minActionRatio) return units;
  const out: string[] = [];
  for (const u of units) {
    if (isActionSentence(u) || isDisturbanceSentence(u) || isConcreteLossSentence(u)) { out.push(u); continue; }
    if (!out.some(isToneLine)) out.push(u);
  }
  return out.length ? out : units;
}
function scoreUnit(u: string, c: Conflict): number {
  const low = u.toLowerCase(); let s = 0;
  if (isActionSentence(u)) s += 3;
  if (isConcreteLossSentence(u)) s += 3;
  if (isDecisionSentence(u)) s += 4;
  if (isDisturbanceSentence(u)) s += 2;
  if (low.includes("aber")) s += 1;
  if (low.includes("wenn")) s += 1;
  if (c.whoA && low.includes(c.whoA.toLowerCase())) s += 1;
  if (c.whoB && low.includes(c.whoB.toLowerCase())) s += 1;
  if (/(paradoxon|omen|inkonsistenz|oberfläche|bedeutung)/i.test(u) && !isActionSentence(u)) s -= 2;
  if (u.length > 180) s -= 1;
  return s;
}
function cutWeakest(units: string[], cutRatio: number, c: Conflict): string[] {
  if (units.length <= 4) return units;
  const scored = units.map((u, idx) => ({ u, idx, s: scoreUnit(u, c) })).sort((a, b) => b.s - a.s);
  const keepN = Math.max(4, Math.round(units.length * (1 - cutRatio)));
  return scored.slice(0, keepN).sort((a, b) => a.idx - b.idx).map((x) => x.u);
}
const hasDecision = (units: string[]): boolean => units.some(isDecisionSentence);
const forceDecision = (units: string[], c: Conflict): string[] => [...units, buildDecisionLine(c)];
function dedupeSoft(units: string[], maxRepeat = 2): string[] {
  const seen = new Set<string>();
  let out = units.filter((u) => { const k = u.trim(); if (seen.has(k)) return false; seen.add(k); return true; });
  const counts = new Map<string, number>();
  out = out.filter((u) => {
    const keyTokens = (u.toLowerCase().match(/[a-zäöüß]+/g) || []).filter((t) => t.length >= 6);
    for (const t of keyTokens) counts.set(t, (counts.get(t) || 0) + 1);
    const over = keyTokens.filter((t) => (counts.get(t) || 0) > maxRepeat).length;
    return over <= Math.max(1, Math.floor(keyTokens.length * 0.5));
  });
  return out;
}
const joinSentences = (arr: string[]): string => arr.join(" ").replace(/\s+([,.!?;:])/g, "$1");

export function applyDramaModule(rawText: string, conflict: Conflict, userOpts: Partial<DramaOpts> = {}): string {
  const opts: DramaOpts = { ...DRAMA_DEFAULTS, ...userOpts };
  let text = normalizeNewlines(rawText).trim();
  text = opts.allowCinematicMarkers ? enforceCinematicConsequence(text) : stripCinematicMarkers(text);
  const lineBased = looksLineBased(text);
  let units = (lineBased ? toLines(text) : toSentences(text)).map((u) => u.trim()).filter((u) => u.length > 0).filter((u) => !isPureMeta(u));
  units = ensureConflictPresence(units, conflict);
  if (opts.requireEscalation) units = enforceEscalation(units, conflict);
  if (opts.requireConcreteLoss) units = enforceConcreteLoss(units, conflict);
  units = reduceAbstraction(units);
  units = enforceActionRatio(units, opts);
  units = cutWeakest(units, opts.cutRatio, conflict);
  if (opts.requireDecision && !hasDecision(units)) units = forceDecision(units, conflict);
  units = dedupeSoft(units, opts.maxRepeatToken);
  const out = lineBased ? units.join("\n") : joinSentences(units);
  return normalizeNewlines(out).replace(/\n{3,}/g, "\n\n").trim();
}
