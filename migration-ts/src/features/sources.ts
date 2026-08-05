// Herkunftsanalyse eines fertigen Textes: Welcher Anteil stammt aus welcher
// Quelle? Nutzt dasselbe Phrasen-Matching wie die Einspeisungs-Färbung im
// Studio, wertet es aber aus statt es nur einzufärben.
import { loadBank } from "../storage";
import { liveTexts } from "./livepools";
import { TONE_DATA } from "../generation/tone.data";
import { getMarkovTrace } from "../generation/markovTrace";

export type QuellenId = "wortbank" | "ton" | "kontext" | "pools" | "markov" | "vorlage";
export interface Segment { s: number; e: number; quelle: QuellenId; }
export interface Herkunft {
  segmente: Segment[];
  anteile: Record<QuellenId, number>;   // 0..1, Anteil der Zeichen
  zeichen: number;
}
export const QUELLEN_LABEL: Record<QuellenId, string> = {
  wortbank: "Wortbank", ton: "Ton", kontext: "4W-Kontext", pools: "Lebendige Pools",
  markov: "Markov", vorlage: "Vorlagen/Schablonen",
};

interface Treffer { s: number; e: number; quelle: QuellenId; prio: number }
function sammle(phrasen: string[], quelle: QuellenId, prio: number, low: string, acc: Treffer[]): void {
  for (const roh of phrasen) {
    const p = (roh || "").trim(); if (p.length < 5) continue;
    const pl = p.toLowerCase();
    let von = 0, i = low.indexOf(pl, von);
    while (i !== -1) { acc.push({ s: i, e: i + pl.length, quelle, prio }); von = i + pl.length; if (acc.length > 4000) return; i = low.indexOf(pl, von); }
  }
}

/** Zerlegt den Text in Herkunftssegmente. `ctx` sind die 4W-Angaben. */
export function analysiereHerkunft(text: string, tone: string, ctx: { where?: string; when?: string; who?: string; what?: string }): Herkunft {
  const low = (text || "").toLowerCase();
  const acc: Treffer[] = [];
  if (tone && tone !== "neutral") { const td = TONE_DATA[tone]; if (td) sammle([...td.opener, ...td.flavor], "ton", 3, low, acc); }
  const w4: string[] = [];
  [ctx.who, ctx.where, ctx.when, ctx.what].forEach((v) => (v || "").split(",").forEach((t) => { const x = t.trim(); if (x.length >= 4) w4.push(x); }));
  sammle(w4, "kontext", 2, low, acc);
  try { const b = loadBank() as unknown as Record<string, string[]>; const alle: string[] = [];
    for (const k of Object.keys(b)) if (Array.isArray(b[k])) alle.push(...b[k]!); sammle(alle, "wortbank", 1, low, acc); } catch { /* egal */ }
  try { sammle(liveTexts(), "pools", 1, low, acc); } catch { /* egal */ }
  try { sammle(getMarkovTrace(), "markov", 2, low, acc); } catch { /* egal */ }

  acc.sort((a, b) => a.s - b.s || (b.e - b.s) - (a.e - a.s) || b.prio - a.prio);
  const segmente: Segment[] = [];
  let ende = -1;
  for (const t of acc) { if (t.s < ende) continue; segmente.push({ s: t.s, e: t.e, quelle: t.quelle }); ende = t.e; }

  const zeichen = (text || "").length || 1;
  const anteile = { wortbank: 0, ton: 0, kontext: 0, pools: 0, markov: 0, vorlage: 0 } as Record<QuellenId, number>;
  let belegt = 0;
  for (const s of segmente) { anteile[s.quelle] += (s.e - s.s); belegt += (s.e - s.s); }
  anteile.vorlage = Math.max(0, zeichen - belegt);           // unmarkiert = feste Schablonen
  for (const k of Object.keys(anteile) as QuellenId[]) anteile[k] = anteile[k] / zeichen;
  return { segmente, anteile, zeichen };
}

// ── Einstellungs-Schnappschuss (vom Studio bei jeder Generierung gesetzt) ──
const KEY = "dm_last_input_v1";
export interface Schnappschuss {
  preset: string; ton: string; form: string; struktur: string; perspektive: string;
  rhythmus: string; markov: string; varianz: string; spannung: string;
  where: string; when: string; who: string; what: string;
  laenge: number; bestenauslese: boolean; zeit: string;
}
export function saveSchnappschuss(s: Schnappschuss): void { try { localStorage.setItem(KEY, JSON.stringify(s)); } catch { /* voll */ } }
export function loadSchnappschuss(): Schnappschuss | null {
  try { const r = localStorage.getItem(KEY); return r ? (JSON.parse(r) as Schnappschuss) : null; } catch { return null; }
}
