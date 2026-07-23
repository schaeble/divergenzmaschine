// Test & Ranking: Generalprobe (Probe), Offline-Ranking und KI-Ranking.
// Aus dem Original portiert; Generierung läuft über buildStory().
import type { Bank, GenInput } from "../types";
import { buildStory } from "./buildStory";
import { isFragmentSentence } from "./beats";
import { MarkovModel } from "../corpus";
import { appendToPersistentCorpus } from "../corpus";
import { loadSettings } from "../storage";
import { buildNoveltyContext, noveltyOf, cooldownHit, type NoveltyContext } from "./novelty";

export interface TextMetrics {
  len: number; wordCount: number; repetitionRatio: number; lenFit: number;
  ttr: number; stdLen: number; rhythmScore: number; tooShort: boolean;
  triBad: boolean; biBad: boolean;
  flow: { startMonotony: number; colonExcess: number; fragPairs: number };
}
export interface RankItem extends TextMetrics { txt: string; score: number; baseScore?: number; novelty?: number; aiScore?: number; grund?: string; }
export interface Ranking { all: RankItem[]; top: RankItem[]; total: number; topK: number; }

function splitSentences(raw: string): string[] {
  return raw.replace(/\s+/g, " ").trim().split(/(?<=[.!?…])\s+/).filter((s) => s.trim().length > 0);
}
function ngrams(words: string[], n: number): string[] {
  const out: string[] = []; for (let i = 0; i <= words.length - n; i++) out.push(words.slice(i, i + n).join(" ")); return out;
}
function countRepeats(arr: string[]): number {
  const m = new Map<string, number>(); for (const x of arr) m.set(x, (m.get(x) || 0) + 1);
  let r = 0; for (const c of m.values()) if (c > 1) r += c - 1; return r;
}
export function repetitionRatio(txt: string): number {
  const tokens = (txt || "").toLowerCase().match(/[a-zäöüßA-ZÄÖÜ]+/g) || [];
  if (tokens.length < 3) return 0;
  const tri = ngrams(tokens, 3);
  const counts = new Map<string, number>(); tri.forEach((t) => counts.set(t, (counts.get(t) || 0) + 1));
  const repeated = [...counts.values()].filter((c) => c > 1).length;
  return tri.length ? repeated / tri.length : 0;
}
export function flowMetrics(txt: string): { startMonotony: number; colonExcess: number; fragPairs: number } {
  const raw = (txt || "").toString();
  const s = splitSentences(raw);
  if (!s.length) return { startMonotony: 0, colonExcess: 0, fragPairs: 0 };
  let same = 0, fragPairs = 0;
  for (let i = 1; i < s.length; i++) {
    const a = (s[i - 1]!.split(/\s+/)[0] || "").toLowerCase();
    const b = (s[i]!.split(/\s+/)[0] || "").toLowerCase();
    if (a && a === b) same++;
    if (isFragmentSentence(s[i - 1]!) && isFragmentSentence(s[i]!)) fragPairs++;
  }
  const colons = (raw.match(/:/g) || []).length;
  return { startMonotony: same / Math.max(1, s.length - 1), colonExcess: Math.min(1, Math.max(0, colons - 2) / 3), fragPairs: Math.min(1, fragPairs / 2) };
}
export function analyzeText(txt: string, lenTarget: number): TextMetrics {
  const raw = txt || "";
  const t = raw.toLowerCase().replace(/\s+/g, " ").trim();
  const words = t.split(" ").filter(Boolean);
  const repBi = countRepeats(ngrams(words, 2)), repTri = countRepeats(ngrams(words, 3));
  const wordCount = words.length;
  const target = lenTarget > 0 ? lenTarget : 110;
  const lenFit = Math.max(0, 1 - Math.abs(wordCount - target) / target);
  const ttr = words.length ? new Set(words).size / words.length : 0;
  const sentLens = splitSentences(raw).map((s) => (s.toLowerCase().match(/[a-zäöüßA-ZÄÖÜ]+/g) || []).length);
  const meanLen = sentLens.length ? sentLens.reduce((x, y) => x + y, 0) / sentLens.length : 0;
  const stdLen = sentLens.length > 1 ? Math.sqrt(sentLens.map((x) => (x - meanLen) ** 2).reduce((x, y) => x + y, 0) / sentLens.length) : 0;
  const rhythmScore = Math.max(0, 1 - Math.abs(stdLen - 4) / 6);
  return { len: raw.length, wordCount, repetitionRatio: repetitionRatio(raw), lenFit, ttr, stdLen, rhythmScore,
    tooShort: raw.trim().length < 120, triBad: repTri > 10, biBad: repBi > 25, flow: flowMetrics(raw) };
}
export function scoreText(txt: string, lenTarget: number): { score: number; a: TextMetrics } {
  const a = analyzeText(txt, lenTarget);
  const score = a.lenFit * 30 + a.ttr * 25 + a.rhythmScore * 20 - a.repetitionRatio * 50 - (a.tooShort ? 20 : 0)
    - a.flow.startMonotony * 15 - a.flow.colonExcess * 8 - a.flow.fragPairs * 7;
  return { score, a };
}

function genN(bank: Bank, input: GenInput, model: MarkovModel | undefined, N: number): string[] {
  N = Math.max(1, Math.min(500, N | 0));
  const out: string[] = [];
  for (let i = 0; i < N; i++) { for (let b = 0; b < 2; b++) Math.random(); out.push(buildStory(bank, input, model)); }
  return out;
}

export interface ProbeReport { total: number; unique: number; duplicates: number; flaggedCount: number; }
export function runProbe(bank: Bank, input: GenInput, model: MarkovModel | undefined, N = 50): ProbeReport {
  const lt = input.lenTarget ?? 110;
  const texts = genN(bank, input, model, N);
  const seen = new Set<string>(); let duplicates = 0, flaggedCount = 0;
  for (const txt of texts) {
    if (seen.has(txt)) duplicates++; seen.add(txt);
    const a = analyzeText(txt, lt);
    if (a.tooShort || a.triBad || a.biBad) flaggedCount++;
  }
  return { total: texts.length, unique: seen.size, duplicates, flaggedCount };
}

function feedTopToCorpus(top: RankItem[]): void {
  try {
    const s = loadSettings();
    if (!(s.enabled && s.learnStories)) return;
    top.slice(0, 3).forEach((r) => { if (r?.txt) appendToPersistentCorpus(r.txt.replace(/\n+/g, " ").trim()); });
  } catch { /* ignore */ }
}
export function runRanking(bank: Bank, input: GenInput, model: MarkovModel | undefined, N = 50, topK = 10, noveltyWeight = 0): Ranking {
  const lt = input.lenTarget ?? 110;
  const nw = Math.max(0, Math.min(1, noveltyWeight));
  const ctx: NoveltyContext | null = nw > 0 ? buildNoveltyContext() : null;
  const results: RankItem[] = genN(bank, input, model, N).map((txt) => {
    const { score, a } = scoreText(txt, lt);
    return { txt, score, baseScore: score, ...a };
  });
  if (ctx) {
    for (const r of results) {
      r.novelty = noveltyOf(r.txt, ctx);
      // Neuheit belohnen (bis +40), Cooldown-Motive abwerten (bis -30) — sanft skaliert.
      r.score = (r.baseScore ?? r.score) + nw * (r.novelty * 40) - nw * (cooldownHit(r.txt, ctx) * 30);
    }
  }
  results.sort((a, b) => b.score - a.score);
  const top = results.slice(0, Math.max(1, Math.min(N, topK)));
  feedTopToCorpus(top);
  return { all: results, top, total: results.length, topK };
}

// KI-Ranking: N Varianten offline erzeugen, von Claude literarisch bewerten.
import { callClaude, loadAiKey } from "../features/ki";
export async function runAiRanking(bank: Bank, input: GenInput, model: MarkovModel | undefined, N = 50, topK = 10): Promise<Ranking> {
  if (!loadAiKey()) throw new Error("Bitte zuerst im KI-Tab einen API-Schlüssel hinterlegen.");
  N = Math.max(3, Math.min(100, N | 0));
  const seen = new Set<string>(); const texts: string[] = []; let guard = 0;
  while (texts.length < N && guard++ < N * 4) { const t = buildStory(bank, input, model); if (!t || seen.has(t)) continue; seen.add(t); texts.push(t); }
  const numbered = texts.map((t, i) => `### Text ${i + 1}\n${t}`).join("\n\n");
  const prompt = `Du bist ein strenger Literaturkritiker. Unten stehen ${texts.length} kurze deutsche Prosatexte aus einem generativen Schreibwerkzeug.

Bewerte jeden Text mit einem Score von 0 bis 100 nach diesen gleichgewichteten Kriterien:
- Originalität der Bilder und Wendungen
- innere Kohärenz (kein zusammenhangloses Fragment-Rauschen)
- sprachliche Qualität (Rhythmus, Präzision, keine Stolperer)
- Sog: macht der Text neugierig auf mehr?

Nutze die volle Skala und sei streng: 80+ nur für wirklich starke Texte.

Antworte AUSSCHLIESSLICH mit einem JSON-Array, ein Objekt pro Text:
[{"i":1,"score":72,"grund":"knappe Begründung, maximal 10 Wörter"}]

${numbered}`;
  const raw = await callClaude(prompt, 8192, "[");
  let jsonStr = String(raw || "").trim().replace(/^```[a-z]*\s*/i, "").replace(/```\s*$/, "");
  const m = jsonStr.match(/\[[\s\S]*\]/); if (m) jsonStr = m[0];
  let scores: unknown; try { scores = JSON.parse(jsonStr); } catch { throw new Error("KI-Antwort war nicht lesbar."); }
  const byIdx: Record<number, { score?: number; grund?: string }> = {};
  (Array.isArray(scores) ? scores : []).forEach((s: { i?: number; score?: number; grund?: string }) => { if (s && typeof s.i === "number") byIdx[s.i - 1] = s; });
  const lt = input.lenTarget ?? 110;
  const results: RankItem[] = texts.map((txt, i) => {
    const s = byIdx[i] || {}; const aiScore = typeof s.score === "number" ? Math.max(0, Math.min(100, s.score)) : 0;
    const a = analyzeText(txt, lt);
    return { txt, score: aiScore / 100, aiScore, grund: String(s.grund || ""), ...a };
  });
  results.sort((a, b) => b.score - a.score);
  const top = results.slice(0, Math.max(1, Math.min(N, topK)));
  feedTopToCorpus(top);
  return { all: results, top, total: texts.length, topK };
}
