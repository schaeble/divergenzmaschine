// Geschmack (4.370.0): das zweite Vorzeichen.
//
// Bisher lernte die Maschine nur in eine Richtung. Jeder erzeugte Text fütterte
// die lebendigen Pools mit Gewicht 1 — auch der, den man nach zwei Sekunden
// weggeworfen hat. Gelernt wurde also der eigene Ausstoß, nicht das Urteil.
// „Merken" war das einzige Ja, ein Nein gab es nicht.
//
// Hier steht beides: Urteile kommen ausdrücklich herein (Merken = +1,
// Verwerfen = −1) und schlagen sich an zwei Stellen nieder — auf den Wendungen
// des Textes und auf der REGLERSTELLUNG, unter der er entstand.
//
// Zwei Entscheidungen, die das Verhalten prägen:
//
//  1. Gezählt wird getrennt (plus und minus), nicht saldiert. Ein Motiv, das
//     dreimal gefiel und dreimal störte, ist nicht dasselbe wie eines, das
//     niemand je gesehen hat — das erste ist strittig, das zweite unbekannt.
//     Die Saldierung würde beides auf 0 legen.
//
//  2. Bewertet wird mit Glättung: (plus − minus) / (plus + minus + 2). Ohne
//     den Summanden schlüge das erste Urteil sofort auf ±1 aus, und die
//     Maschine kippte nach einem einzigen Klick. Mit ihm braucht eine feste
//     Neigung mehrere übereinstimmende Urteile.
//
// Was hier NICHT passiert: Die Regler werden nicht von selbst verstellt. Die
// Neigung wird angezeigt und auf Wunsch übernommen. Eine Maschine, die im
// Hintergrund an den eigenen Reglern dreht, ist nicht mehr nachvollziehbar —
// und der Nutzer sucht den Fehler dann in seinen Einstellungen.

import { extractPhrases } from "./livepools";
import { safeSet } from "./storage-status";

const KEY = "divergenz_geschmack_v1";
const PHRASEN_CAP = 400;
const REGLER_CAP = 200;

/** Nur Regler, die den STIL bestimmen. Länge, Serie und Fadenwerte sagen über
 *  Geschmack nichts — sie würden die Liste mit Zahlen zumüllen. */
export const GESCHMACK_REGLER = [
  "preset", "tone", "structure", "mode", "perspective", "rhythm",
  "tension", "instability", "ressort", "varLevel", "markovMode", "disruptor",
] as const;

/** Deutsche Namen fuer die Anzeige. */
export const REGLER_NAME: Record<string, string> = {
  preset: "Preset", tone: "Ton", structure: "Struktur", mode: "Modus", perspective: "Perspektive",
  rhythm: "Rhythmus", tension: "Spannung", instability: "Instabilität", ressort: "Ressort",
  varLevel: "Varianz", markovMode: "Markov", disruptor: "Störer",
};

export interface Urteilszahl { t: string; plus: number; minus: number; d: number }
export interface GeschmackStand {
  phrasen: Urteilszahl[];
  regler: Urteilszahl[];
  gefallen: number;
  verworfen: number;
}

const leer = (): GeschmackStand => ({ phrasen: [], regler: [], gefallen: 0, verworfen: 0 });

export function ladeGeschmack(): GeschmackStand {
  try {
    const v = JSON.parse(localStorage.getItem(KEY) || "null") as GeschmackStand | null;
    if (!v || typeof v !== "object") return leer();
    return {
      phrasen: Array.isArray(v.phrasen) ? v.phrasen.filter((x) => x && typeof x.t === "string") : [],
      regler: Array.isArray(v.regler) ? v.regler.filter((x) => x && typeof x.t === "string") : [],
      gefallen: Number(v.gefallen) || 0,
      verworfen: Number(v.verworfen) || 0,
    };
  } catch { return leer(); }
}
function sichere(s: GeschmackStand): void { safeSet(KEY, JSON.stringify(s), "Geschmack"); }
export function loescheGeschmack(): void { try { localStorage.removeItem(KEY); } catch { /* egal */ } }

/** Geglättete Bewertung, −1..1. Die 2 im Nenner ist die Bremse gegen Einzelurteile. */
export function wertung(e: { plus: number; minus: number }): number {
  return (e.plus - e.minus) / (e.plus + e.minus + 2);
}
/** Wie belastbar ist die Zahl? Unter 2 Urteilen ist sie ein Zufall. */
export function urteile(e: { plus: number; minus: number }): number { return e.plus + e.minus; }

function buche(list: Urteilszahl[], t: string, urteil: 1 | -1, cap: number): void {
  const i = list.findIndex((e) => e.t === t);
  const now = Date.now();
  if (i < 0) list.push({ t, plus: urteil > 0 ? 1 : 0, minus: urteil < 0 ? 1 : 0, d: now });
  else { const e = list[i]!; if (urteil > 0) e.plus++; else e.minus++; e.d = now; }
  if (list.length > cap) {
    // Zuerst geht, was am wenigsten sagt: wenige Urteile, lange her.
    list.sort((a, b) => (urteile(b) - urteile(a)) || (b.d - a.d));
    list.length = cap;
  }
}

/** Schlüssel einer Reglerstellung: „tone=melancholisch". */
export function reglerSchluessel(k: string, v: string): string { return `${k}=${v}`; }

/** Ein Urteil eintragen. Text und Reglerstellung wandern getrennt in die Zählung. */
export function trageUrteilEin(text: string, einstellungen: Record<string, string>, urteil: 1 | -1): GeschmackStand {
  const s = ladeGeschmack();
  for (const p of extractPhrases(text || "")) buche(s.phrasen, p.toLowerCase(), urteil, PHRASEN_CAP);
  for (const k of GESCHMACK_REGLER) {
    const v = (einstellungen?.[k] || "").trim();
    if (!v || v === "—") continue;
    buche(s.regler, reglerSchluessel(k, v), urteil, REGLER_CAP);
  }
  if (urteil > 0) s.gefallen++; else s.verworfen++;
  sichere(s);
  return s;
}

/** Wie gut passt ein Text zum bisherigen Urteil? −1..1, 0 wenn nichts bekannt ist.
 *  Gezählt werden nur Wendungen mit mindestens zwei Urteilen; gedeckelt, damit
 *  ein einzelnes Lieblingswort nicht die ganze Auslese bestimmt. */
export function geschmackWert(text: string, stand?: GeschmackStand): number {
  const s = stand ?? ladeGeschmack();
  if (!s.phrasen.length) return 0;
  const low = (text || "").toLowerCase();
  if (!low.trim()) return 0;
  let summe = 0, treffer = 0;
  for (const e of s.phrasen) {
    if (urteile(e) < 2) continue;
    if (e.t.length < 4 || !low.includes(e.t)) continue;
    summe += wertung(e);
    treffer++;
  }
  if (!treffer) return 0;
  // Mittelwert der getroffenen Wendungen, aber gedämpft, solange wenige treffen.
  return (summe / treffer) * Math.min(1, treffer / 3);
}

export interface Neigung { regler: string; wert: string; punkte: number; urteile: number }

/** Die belegte Neigung je Regler: pro Regler die beste Stellung, sofern sie
 *  mindestens `minUrteile` Urteile hat und überhaupt positiv ist. */
export function neigung(stand?: GeschmackStand, minUrteile = 2): Neigung[] {
  const s = stand ?? ladeGeschmack();
  const best = new Map<string, Neigung>();
  for (const e of s.regler) {
    const at = e.t.indexOf("=");
    if (at <= 0) continue;
    const regler = e.t.slice(0, at), wert = e.t.slice(at + 1);
    if (urteile(e) < minUrteile) continue;
    const punkte = wertung(e);
    if (punkte <= 0) continue;
    const alt = best.get(regler);
    if (!alt || punkte > alt.punkte || (punkte === alt.punkte && urteile(e) > alt.urteile)) {
      best.set(regler, { regler, wert, punkte, urteile: urteile(e) });
    }
  }
  return [...best.values()].sort((a, b) => (b.punkte - a.punkte) || (b.urteile - a.urteile));
}

/** Stellungen, die durchgefallen sind — für die Anzeige, nicht zum Verstellen. */
export function abneigung(stand?: GeschmackStand, minUrteile = 2): Neigung[] {
  const s = stand ?? ladeGeschmack();
  return s.regler
    .filter((e) => urteile(e) >= minUrteile && wertung(e) < 0 && e.t.includes("="))
    .map((e) => ({ regler: e.t.slice(0, e.t.indexOf("=")), wert: e.t.slice(e.t.indexOf("=") + 1), punkte: wertung(e), urteile: urteile(e) }))
    .sort((a, b) => a.punkte - b.punkte);
}
