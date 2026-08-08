// Satzrhythmus-Oszilloskop: Metriken + SVG-Wellenform.
export interface WavePoint { idx: number; pct: number; len: number; text: string; }
export interface OszMetrics {
  sentenceCount: number; wordCount: number; avgLen: number; stdLen: number;
  ttr: number; repetitionRatio: number; punctDensity: number; wave: WavePoint[];
}

const wmSplit = (txt: string): string[] =>
  (txt || "").replace(/\s+/g, " ").trim().split(/(?<=[.!?…])\s+/).filter((s) => s.trim().length > 0);
const wmWords = (s: string): string[] => s.toLowerCase().match(/[a-zäöüßA-ZÄÖÜ]+/g) || [];
const mean = (a: number[]): number => (a.length ? a.reduce((x, y) => x + y, 0) / a.length : 0);
const std = (a: number[]): number => { if (a.length < 2) return 0; const m = mean(a); return Math.sqrt(mean(a.map((x) => (x - m) ** 2))); };
const ngrams = (t: string[], n: number): string[] => { const o: string[] = []; for (let i = 0; i <= t.length - n; i++) o.push(t.slice(i, i + n).join(" ")); return o; };

function wave(txt: string): WavePoint[] {
  const s = wmSplit(txt);
  return s.map((x, i) => ({ idx: i, pct: s.length > 1 ? (i / (s.length - 1)) * 100 : 0, len: wmWords(x).length, text: x }));
}
function valueAt(w: WavePoint[], pct: number): number | null {
  if (!w.length) return null;
  let best = w[0]!, bd = Infinity;
  for (const p of w) { const dd = Math.abs(p.pct - pct); if (dd < bd) { bd = dd; best = p; } }
  return best.len;
}

export function analyze(txt: string): OszMetrics {
  const s = wmSplit(txt), wv = wave(txt), lengths = wv.map((w) => w.len), tokens = wmWords(txt);
  const ttr = tokens.length ? new Set(tokens).size / tokens.length : 0;
  const tri = ngrams(tokens, 3);
  const tc = new Map<string, number>();
  tri.forEach((t) => tc.set(t, (tc.get(t) || 0) + 1));
  const repeated = [...tc.values()].filter((c) => c > 1).length;
  const punct = (txt.match(/[.,;:!?…—–]/g) || []).length;
  return {
    sentenceCount: s.length, wordCount: tokens.length, avgLen: mean(lengths), stdLen: std(lengths),
    ttr, repetitionRatio: tri.length ? repeated / tri.length : 0,
    punctDensity: txt.length ? punct / txt.length : 0, wave: wv,
  };
}

export function buildSVG(waveA: WavePoint[]): string {
  const W = 600, H = 220, padL = 30, padR = 10, padT = 10, padB = 22, steps = 60;
  const pts: [number, number | null][] = [];
  let maxLen = 4;
  for (let i = 0; i <= steps; i++) { const pct = (i / steps) * 100; const a = valueAt(waveA, pct); if (a != null) maxLen = Math.max(maxLen, a); pts.push([pct, a]); }
  maxLen = Math.max(4, Math.ceil(maxLen / 4) * 4);
  const xAt = (pct: number): number => padL + (pct / 100) * (W - padL - padR);
  const yAt = (v: number): number => H - padB - (v / maxLen) * (H - padT - padB);
  let d = "", started = false;
  for (const [pct, v] of pts) { if (v == null) { started = false; continue; } d += (started ? "L" : "M") + xAt(pct).toFixed(1) + "," + yAt(v).toFixed(1) + " "; started = true; }
  let grid = "";
  for (let g = 0; g <= 100; g += 25) grid += `<line x1="${xAt(g)}" y1="${padT}" x2="${xAt(g)}" y2="${H - padB}" stroke="#2a2f38"/><text x="${xAt(g)}" y="${H - 6}" font-size="9" fill="#888" text-anchor="middle">${g}%</text>`;
  for (let i = 0; i <= 4; i++) { const v = (maxLen / 4) * i, y = yAt(v); grid += `<line x1="${padL}" y1="${y}" x2="${W - padR}" y2="${y}" stroke="#20242b"/><text x="${padL - 5}" y="${(y + 3).toFixed(1)}" font-size="9" fill="#888" text-anchor="end">${Math.round(v)}</text>`; }
  return `<svg viewBox="0 0 ${W} ${H}" width="100%" style="background:#0a0c10;border-radius:8px">${grid}<path d="${d.trim()}" fill="none" stroke="#5ad" stroke-width="2"/></svg>`;
}


/** Zwei Kurven nach Slot-Index: Soll (gestrichelt, gedämpft) vs Ist (Akzent). */
export function buildSVG2(target: number[], actual: number[]): string {
  const W = 600, H = 220, padL = 30, padR = 10, padT = 10, padB = 26;
  const n = Math.max(target.length, actual.length);
  if (n < 1) return buildSVG([]);
  let maxLen = 4;
  for (const v of [...target, ...actual]) maxLen = Math.max(maxLen, v);
  maxLen = Math.max(4, Math.ceil(maxLen / 4) * 4);
  const xAt = (i: number): number => padL + (n > 1 ? (i / (n - 1)) * (W - padL - padR) : 0);
  const yAt = (v: number): number => H - padB - (v / maxLen) * (H - padT - padB);
  const pathOf = (arr: number[]): string => {
    let d = "";
    arr.forEach((v, i) => { d += (i ? "L" : "M") + xAt(i).toFixed(1) + "," + yAt(v).toFixed(1) + " "; });
    return d.trim();
  };
  let grid = "";
  for (let i = 0; i <= 4; i++) { const v = (maxLen / 4) * i, y = yAt(v); grid += `<line x1="${padL}" y1="${y}" x2="${W - padR}" y2="${y}" stroke="#20242b"/><text x="${padL - 5}" y="${(y + 3).toFixed(1)}" font-size="9" fill="#888" text-anchor="end">${Math.round(v)}</text>`; }
  const legend = `<g font-size="10"><rect x="${W - 168}" y="${padT}" width="158" height="16" fill="#0a0c10"/><line x1="${W - 162}" y1="${padT + 8}" x2="${W - 146}" y2="${padT + 8}" stroke="#8b94a7" stroke-width="2" stroke-dasharray="5 4"/><text x="${W - 142}" y="${padT + 11}" fill="#8b94a7">Soll</text><line x1="${W - 96}" y1="${padT + 8}" x2="${W - 80}" y2="${padT + 8}" stroke="#5ad" stroke-width="2"/><text x="${W - 76}" y="${padT + 11}" fill="#5ad">Ist</text></g>`;
  return `<svg viewBox="0 0 ${W} ${H}" width="100%" style="background:#0a0c10;border-radius:8px">${grid}<path d="${pathOf(target)}" fill="none" stroke="#8b94a7" stroke-width="2" stroke-dasharray="5 4"/><path d="${pathOf(actual)}" fill="none" stroke="#5ad" stroke-width="2"/>${legend}</svg>`;
}
