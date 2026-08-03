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

// ── Inhaltliche Strophengliederung ───────────────────────────────────
// Statt nach festem Zähler zu schneiden: Strophengrenze dort setzen, wo der
// inhaltliche Zusammenhang am schwächsten ist (Themenzäsur). Gemessen über die
// Wortstamm-Überlappung benachbarter Zeilen — dieselbe Nähe-Logik wie beim
// Kontext-Ranking der Passagen-Alternativen.
const STANZA_STOP = new Set(["und","oder","aber","denn","doch","dann","noch","auch","schon","immer","nie","sehr","wie","als","mit","von","für","auf","aus","ist","sind","war","sich","nicht","ein","eine","einen","einem","einer","der","die","das","den","dem","des","hier","dort","jetzt","alles","nichts","etwas","mehr","wieder","durch","über","unter","ohne","beim","zum","zur"]);
function stanzaStems(line: string): Set<string> {
  const out = new Set<string>();
  for (const w of (line.toLowerCase().match(/[a-zäöüß]{4,}/g) || [])) { if (!STANZA_STOP.has(w)) out.add(w.slice(0, 5)); }
  return out;
}
function stanzaOverlap(a: Set<string>, b: Set<string>): number {
  if (!a.size || !b.size) return 0;
  let inter = 0; for (const x of a) if (b.has(x)) inter++;
  return inter / (a.size + b.size - inter);
}

/** Setzt Strophengrenzen an inhaltlichen Zäsuren. `unit` hält zusammengehörige
 *  Zeilen beieinander (bei Reimpaaren 2), `target` ist die angestrebte Strophenlänge. */
export function insertStanzasByTheme(lines: string[], target: number, unit = 1): string[] {
  if (!target || target < 2 || lines.length <= target) return insertStanzas(lines, target);
  const stems = lines.map(stanzaStems);
  // Kandidaten: nur Grenzen, die die Einheit (Reimpaar) nicht zerschneiden
  const minLen = Math.max(unit, target - unit), maxLen = target + unit;
  const breaks = new Set<number>();
  let start = 0;
  // Solange der Rest länger als eine Maximal-Strophe ist, die nächste Zäsur suchen.
  while (lines.length - start > maxLen) {
    let bestAt = -1, bestScore = Infinity;
    for (let i = start + minLen; i <= start + maxLen && i < lines.length; i++) {
      if (unit > 1 && (i - start) % unit !== 0) continue;                 // Reimpaar nicht trennen
      if (lines.length - i < minLen) continue;                            // kein Rumpf am Ende
      // Wie stark hängt die nächste Zeile am BISHERIGEN Block? (mehr Signal als
      // ein bloßer Zeilenvergleich) — schwächste Bindung = beste Zäsur.
      const block = new Set<string>();
      for (let k = start; k < i; k++) for (const x of stems[k]!) block.add(x);
      const ahead = new Set<string>(stems[i]!);
      if (i + 1 < lines.length) for (const x of stems[i + 1]!) ahead.add(x);
      const sc = stanzaOverlap(block, ahead) + Math.abs((i - start) - target) * 0.02;
      if (sc < bestScore) { bestScore = sc; bestAt = i; }
    }
    if (bestAt < 0) break;
    breaks.add(bestAt); start = bestAt;
  }
  const out: string[] = [];
  for (let i = 0; i < lines.length; i++) { if (breaks.has(i) && out.length) out.push(""); out.push(lines[i]!); }
  return out;
}
