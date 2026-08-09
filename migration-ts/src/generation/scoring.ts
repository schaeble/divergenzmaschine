// Test & Ranking: Generalprobe (Probe), Offline-Ranking und KI-Ranking.
// Aus dem Original portiert; Generierung läuft über buildStory().
import type { Bank, GenInput } from "../types";
import { buildStory } from "./buildStory";
import { isFragmentSentence } from "./beats";
import { MarkovModel } from "../corpus";
import { appendToPersistentCorpus, loadPersistentCorpus } from "../corpus";
import { tenseBreakRatio, phraseRepeatRatio, castSpread, perspectiveBreakRatio } from "./coherence";
import { loadSettings } from "../storage";
import { buildNoveltyContext, noveltyOf, cooldownHit, frequentContentWords, type NoveltyContext } from "./novelty";
import { grammarFlags } from "./grammar";

export interface TextMetrics {
  len: number; wordCount: number; repetitionRatio: number; lenFit: number;
  ttr: number; stdLen: number; rhythmScore: number; tooShort: boolean;
  triBad: boolean; biBad: boolean;
  flow: { startMonotony: number; colonExcess: number; fragPairs: number };
}
export interface RankItem extends TextMetrics { txt: string; score: number; baseScore?: number; novelty?: number; surprise?: number; grammar?: number; constraintsOk?: boolean; aiScore?: number; grund?: string; }

import { loadUmwelt, umweltBeitrag, aufnahmequote, type Umwelt } from "../features/umwelt";

export interface RankOptions {
  noveltyWeight?: number;   // 0..1  Abstand zur Schatzkammer + Cooldown
  surpriseWeight?: number;  // 0..1  Gewicht des Überraschungs-Ziels
  surpriseTarget?: number;  // 0..1  Sweet Spot der Überraschung
  mustWords?: string[];     // Einbauwörter (sollen vorkommen)
  avoidFrequent?: boolean;  // häufigste Korpus-Inhaltswörter meiden
  grammarFilter?: boolean;  // auffällige Grammatik abwerten
  castDiscipline?: number;  // 0..1  Figuren-Disziplin: neue Eigennamen abwerten
  expectedCast?: string[];  // in "Wer?" genannte Figuren (zählen nicht als neu)
  perspective?: string;     // eingestellte Erzählperspektive (Brüche abwerten)
  umwelt?: Umwelt;          // Bauplan F: Zeichen der Umwelt, wirken als Nahrung oder Gift
}
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
/** Kohärenz-Abzug: Tempussprünge, wiederkehrende Versatzstücke, Figurenstreuung.
 *  Rein heuristisch — fängt die typischen Symptome zusammengesetzter Texte ab. */
export function coherencePenalty(txt: string, opts: RankOptions = {}): number {
  // Hinweis: Der Abgleich gegen die Schatzkammer läuft bereits über die Novelty-
  // Metrik (Trigramme) — hier geht es um WIEDERHOLUNG INNERHALB des Textes.
  let p = tenseBreakRatio(txt) * 90          // Zeitebenen-Sprünge
        + phraseRepeatRatio(txt) * 40;        // wiederkehrende 3-/4-Gramme im Text
  p += perspectiveBreakRatio(txt, opts.perspective) * 150;   // Perspektivbrüche (du/ich in Er-Erzählung)
  const cd = Math.max(0, Math.min(1, opts.castDiscipline ?? 0));
  if (cd > 0) p += cd * castSpread(txt, opts.expectedCast || []) * 40;
  return p;
}

export function scoreText(txt: string, lenTarget: number): { score: number; a: TextMetrics } {
  const a = analyzeText(txt, lenTarget);
  const score = a.lenFit * 30 + a.ttr * 25 + a.rhythmScore * 20 - a.repetitionRatio * 50 - (a.tooShort ? 20 : 0)
    - a.flow.startMonotony * 15 - a.flow.colonExcess * 8 - a.flow.fragPairs * 7;
  return { score, a };
}

/** Feld-freie Bestenauslese für den Generieren-Standardpfad: erzeugt N Kandidaten,
 *  bewertet sie (Score + optional Novelty gegen die Schatzkammer + Grammatikfilter)
 *  und liefert den besten Text — ohne Korpus-Selbstfütterung (die bleibt bei Merken/Ranking). */
export interface UmweltEffekt { wirkung: string; quote: number; quoteOhne: number; gewechselt: boolean; }
export function bestOf(bank: Bank, input: GenInput, model: MarkovModel | undefined, N = 12, opts: RankOptions = {}): { txt: string; score: number; umwelt?: UmweltEffekt } {
  const lt = input.lenTarget ?? 110;
  const nw = Math.max(0, Math.min(1, opts.noveltyWeight ?? 0));
  const ctx: NoveltyContext | null = nw > 0 ? buildNoveltyContext() : null;
  const umw = opts.umwelt ?? loadUmwelt();
  // Fuer die Anzeige mitfuehren: Wer haette OHNE Umwelt gewonnen? Nur so laesst
  // sich zeigen, ob die Umwelt die Auswahl wirklich gedreht hat - die blosse
  // Anwesenheit der Zeichen im Text sagt darueber nichts.
  let best: { txt: string; score: number } | null = null;
  let bestOhne: { txt: string; score: number } | null = null;
  for (const txt of genN(bank, input, model, N)) {
    let sc = scoreText(txt, lt).score;
    // Laengendefizit quadratisch bestrafen. Ohne das gewinnen kurze Fassungen: Sie
    // haben zwangslaeufig die bessere Wortvielfalt und weniger Wiederholung, und
    // diese Punkte ueberwogen die Laengentreue. In der Rekombination, wo die Ausbeute
    // stark streut, kam so aus zwoelf Kandidaten oft der mit 47 statt 225 Woertern.
    // Quadratisch, damit kleine Abweichungen folgenlos bleiben und erst grobe teuer werden.
    const woerter = txt.split(/\s+/).filter(Boolean).length;
    const fehl = Math.max(0, (lt - woerter) / Math.max(1, lt));
    sc -= fehl * fehl * 120;
    if (ctx) sc += nw * (noveltyOf(txt, ctx) * 40) - nw * (cooldownHit(txt, ctx) * 30);
    if (opts.grammarFilter) sc -= Math.min(grammarFlags(txt).count, 6) * 12;
    sc -= coherencePenalty(txt, { ...opts, perspective: opts.perspective ?? input.perspective });
    // Bauplan F: Die Umwelt richtet die Auswahl. Sie wirkt hier und nicht nur im
    // Auslese-Tab - der normale Weg ueber "Generieren" ist der, den man benutzt.
    const ohne = sc;
    sc += umweltBeitrag(txt, umw);
    if (!bestOhne || ohne > bestOhne.score) bestOhne = { txt, score: ohne };
    if (!best || sc > best.score) best = { txt, score: sc };
  }
  const win = best ?? { txt: buildStory(bank, input, model), score: 0 };
  const effekt: UmweltEffekt | undefined = umw.wirkung === "aus" || !umw.zeichen.trim() ? undefined : {
    wirkung: umw.wirkung,
    quote: aufnahmequote(win.txt, umw.zeichen),
    quoteOhne: bestOhne ? aufnahmequote(bestOhne.txt, umw.zeichen) : 0,
    gewechselt: !!bestOhne && bestOhne.txt !== win.txt,
  };
  // Der Sieger der Bestenauslese ist das kuratierteste, was die Maschine ohne
  // Zutun liefert - genau er gehoert in den Korpus, wenn Selbstfuetterung an ist.
  feedGeneratedToCorpus(win.txt);
  return effekt ? { ...win, umwelt: effekt } : win;
}

function genN(bank: Bank, input: GenInput, model: MarkovModel | undefined, N: number): string[] {
  N = Math.max(1, Math.min(500, N | 0));
  const out: string[] = [];
  for (let i = 0; i < N; i++) { for (let b = 0; b < 2; b++) Math.random(); out.push(buildStory(bank, input, model)); }
  return out;
}

export interface ProbeReport { total: number; unique: number; duplicates: number; flaggedCount: number; grammarCount: number; }
export function runProbe(bank: Bank, input: GenInput, model: MarkovModel | undefined, N = 50): ProbeReport {
  const lt = input.lenTarget ?? 110;
  const texts = genN(bank, input, model, N);
  const seen = new Set<string>(); let duplicates = 0, flaggedCount = 0, grammarCount = 0;
  for (const txt of texts) {
    if (seen.has(txt)) duplicates++; seen.add(txt);
    const a = analyzeText(txt, lt);
    if (a.tooShort || a.triBad || a.biBad) flaggedCount++;
    if (grammarFlags(txt).count > 0) grammarCount++;
  }
  return { total: texts.length, unique: seen.size, duplicates, flaggedCount, grammarCount };
}

/** Selbstfuetterung aktiv? Beide Flags muessen stehen. */
export function selfFeedActive(): boolean {
  try { const s = loadSettings(); return !!(s.enabled && s.learnStories); } catch { return false; }
}

/**
 * Schreibt einen erzeugten Text in den Markov-Korpus - nur bei eingeschalteter
 * Selbstfuetterung. Ohne diesen Weg fuellt sich der Korpus ausschliesslich ueber
 * "Merken" und Handeingabe, und der Markov-Generator bleibt ohne Nahrung.
 */
export function feedGeneratedToCorpus(txt: string): void {
  try {
    if (!txt || !selfFeedActive()) return;
    const flat = txt.replace(/\s+/g, " ").trim();
    if (flat.length < 40) return;
    // Schon drin? Sonst blaeht jede Wiederholung den Korpus auf und die Kette
    // lernt dieselbe Wendung mehrfach. Vergleich ueber den Textanfang genuegt.
    const probe = flat.slice(0, 120).toLowerCase();
    if (loadPersistentCorpus().replace(/\s+/g, " ").toLowerCase().includes(probe)) return;
    appendToPersistentCorpus(flat);
  } catch { /* ignore */ }
}

function feedTopToCorpus(top: RankItem[]): void {
  if (!selfFeedActive()) return;
  top.slice(0, 3).forEach((r) => { if (r?.txt) feedGeneratedToCorpus(r.txt); });
}
export function runRanking(bank: Bank, input: GenInput, model: MarkovModel | undefined, N = 50, topK = 10, opts: RankOptions = {}): Ranking {
  const lt = input.lenTarget ?? 110;
  const nw = Math.max(0, Math.min(1, opts.noveltyWeight ?? 0));
  const sw = Math.max(0, Math.min(1, opts.surpriseWeight ?? 0));
  const sTarget = Math.max(0, Math.min(1, opts.surpriseTarget ?? 0.5));
  const must = (opts.mustWords || []).map((w) => w.toLowerCase()).filter((w) => w.length > 1);
  const banned = opts.avoidFrequent ? frequentContentWords(40) : [];
  const ctx: NoveltyContext | null = nw > 0 ? buildNoveltyContext() : null;
  const umwR = opts.umwelt ?? loadUmwelt();

  const results: RankItem[] = genN(bank, input, model, N).map((txt) => {
    const { score, a } = scoreText(txt, lt);
    return { txt, score, baseScore: score, ...a };
  });

  for (const r of results) {
    let sc = r.baseScore ?? r.score;
    if (ctx) {
      r.novelty = noveltyOf(r.txt, ctx);
      sc += nw * (r.novelty * 40) - nw * (cooldownHit(r.txt, ctx) * 30);
    }
    if (sw > 0 && model) {
      const s = model.surprise(r.txt);
      if (s >= 0) { r.surprise = s; sc += sw * ((1 - Math.abs(s - sTarget)) * 30); }
    }
    if (must.length) {
      const low = r.txt.toLowerCase();
      const hit = must.filter((w) => low.includes(w)).length;
      r.constraintsOk = hit === must.length;
      sc -= (must.length - hit) * 25;             // fehlende Einbauwörter stark abwerten
    }
    if (banned.length) {
      const low = r.txt.toLowerCase();
      let b = 0; for (const w of banned) if (low.includes(w)) b++;
      sc -= Math.min(b, 6) * 4;
    }
    if (opts.grammarFilter) {
      const g = grammarFlags(r.txt).count;
      r.grammar = g;
      sc -= Math.min(g, 6) * 12;   // Grammatik-Auffälligkeiten stark abwerten
    }
    {
      sc -= coherencePenalty(r.txt, opts);   // Tempus, Phrasen-Wiederholung, Figuren-Disziplin
    }
    sc += umweltBeitrag(r.txt, umwR);        // Bauplan F
    r.score = sc;
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
