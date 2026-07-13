// Gemeinsame Helfer der Vers-Formen (Reim/Haiku/Strang).
import { REIM_DANGLING_RX } from "./reim.data";

export const normalizeNewlines = (s: string): string => String(s || "").replace(/\r\n/g, "\n").replace(/\r/g, "\n");
export const capLine = (s: string): string => String(s).replace(/\s+([,.;:!?])/g, "$1").replace(/^[-–—]\s*/g, "").trim();

export function insertStanzas(lines: string[], everyN: number): string[] {
  if (!everyN || everyN < 2) return lines;
  const out: string[] = [];
  for (let i = 0; i < lines.length; i++) { out.push(lines[i]!); if ((i + 1) % everyN === 0 && i !== lines.length - 1) out.push(""); }
  return out;
}
export function stripDanglingTail(words: string[]): string[] {
  const w = words.slice(); let guard = 0;
  while (w.length > 1 && REIM_DANGLING_RX.test((w[w.length - 1] || "").replace(/[.,;:!?…]/g, "")) && guard++ < 10) w.pop();
  return w;
}
export function reimShuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j]!, a[i]!]; }
  return a;
}
export function reimDedupePhrases(phrases: string[]): string[] {
  const seen = new Set<string>(); const out: string[] = [];
  for (const p of phrases) {
    const prefix = p.toLowerCase().replace(/[.,;:!?…]/g, "").split(/\s+/).filter(Boolean).slice(0, 3).join(" ");
    if (prefix && seen.has(prefix)) continue;
    if (prefix) seen.add(prefix);
    out.push(p);
  }
  return out;
}
export function estimateSyllables(word: string): number {
  const w = String(word || "").toLowerCase().replace(/[^a-zäöüß]/g, "");
  if (!w) return 0;
  const clusters = w.match(/[aeiouyäöü]+/g) || [];
  let n = clusters.length;
  for (const c of clusters) n += (c.match(/e[oa]/g) || []).length;
  return Math.max(1, n);
}
export function buildSyllableLine(stream: string[], targetSyll: number): { words: string[]; syll: number } {
  const words: string[] = []; let syll = 0;
  while (stream.length) {
    const w = stream[0]!; const s = estimateSyllables(w);
    if (syll > 0 && syll + s > targetSyll + 1) break;
    words.push(stream.shift()!); syll += s;
    if (syll >= targetSyll) break;
  }
  return { words, syll };
}
export function breakIntoLines(phrase: string, maxWords: number, maxChars: number): string[] {
  const words = String(phrase).replace(/\s+/g, " ").trim().split(" ").filter(Boolean);
  if (!words.length) return [];
  if (words.length <= maxWords && phrase.length <= maxChars) return [capLine(phrase)];
  const out: string[] = []; let buf: string[] = [];
  for (const w of words) {
    const next = [...buf, w].join(" ");
    if (buf.length >= maxWords || next.length > maxChars) {
      if (buf.length) {
        const carry: string[] = [];
        while (buf.length > 1 && REIM_DANGLING_RX.test((buf[buf.length - 1] || "").replace(/[.,;:!?…]/g, ""))) carry.unshift(buf.pop()!);
        out.push(capLine(buf.join(" "))); buf = carry.concat([w]);
      } else buf = [w];
    } else buf.push(w);
  }
  if (buf.length) out.push(capLine(buf.join(" ")));
  return out;
}
