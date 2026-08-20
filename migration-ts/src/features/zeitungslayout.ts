// Gespeicherte Layouts für den Zeitungssetzer: Kopf, Spaltenzahl, Seitenzahl,
// die Auswahl der Beiträge samt Rolle und Überschrift — und die Bilder.
//
// Die eine Entscheidung, die hier alles trägt: Ein Beitrag wird über einen
// SCHLÜSSEL aus seinem Text gemerkt, nicht über seine Position in der Liste.
// Die Schatzkammer wächst und schrumpft; ein gespeicherter Index zeigte nach
// dem nächsten „Merken" auf einen anderen Text, und das Layout hätte
// wortwörtlich fremde Beiträge gesetzt.
import { safeSet } from "./storage-status";
import type { Bildrahmen } from "./zeitungsbilder";
import type { Zeitungskopf, Rolle } from "../ui/zeitungView";

export interface LayoutTeil { schluessel: string; rolle: Rolle; titel: string }
export interface Layout {
  name: string;
  /** Zeitpunkt des Sicherns, für die Anzeige. */
  d: string;
  kopf: Zeitungskopf;
  spalten: number;
  seiten: number;
  teile: LayoutTeil[];
  bilder: Bildrahmen[];
  /** Musterseite, in die dieses Layout gehört. Leer = fließender Satz. Steht
   *  sie, entscheidet die REIHENFOLGE der Teile, welcher Text in welchen Platz
   *  kommt — deshalb muss sie beim Laden erhalten bleiben. */
  schema?: string;
}

export const LAYOUT_KEY = "divergenz_zeitung_layouts_v1";
export const LAYOUT_ANZAHL = 12;

/** Der Schlüssel eines Beitrags: Anfang des Textes, auf das Wesentliche
 *  eingedampft, plus Form. Leerzeichen und Groß-/Kleinschreibung fallen weg —
 *  ein Text, der beim Sichern anders umbrochen war, soll trotzdem passen. */
export function textSchluessel(t: { t?: string; form?: string }): string {
  const roh = (t.t || "").replace(/\s+/g, " ").trim().toLowerCase().slice(0, 120);
  return `${t.form || "?"}|${roh}`;
}

/** Ordnet gespeicherte Teile den heutigen Quellen zu. Jede Quelle wird
 *  höchstens einmal vergeben: Zwei gleichlautende Texte in der Schatzkammer
 *  bekämen sonst beide denselben Platz und einer bliebe leer. */
export function ordneZu(
  teile: LayoutTeil[],
  quellen: { t?: string; form?: string }[],
): { zuordnung: Map<number, { rolle: Rolle; titel: string }>; gefunden: number; fehlend: number } {
  const nachSchluessel = new Map<string, number[]>();
  quellen.forEach((q, i) => {
    const k = textSchluessel(q);
    if (!nachSchluessel.has(k)) nachSchluessel.set(k, []);
    nachSchluessel.get(k)!.push(i);
  });
  const zuordnung = new Map<number, { rolle: Rolle; titel: string }>();
  let fehlend = 0;
  for (const teil of teile) {
    const frei = nachSchluessel.get(teil.schluessel);
    const i = frei && frei.length ? frei.shift() : undefined;
    if (i === undefined) { fehlend++; continue; }
    zuordnung.set(i, { rolle: teil.rolle, titel: teil.titel });
  }
  return { zuordnung, gefunden: zuordnung.size, fehlend };
}

export function ladeLayouts(): Layout[] {
  try {
    const r = JSON.parse(localStorage.getItem(LAYOUT_KEY) || "[]") as unknown;
    if (!Array.isArray(r)) return [];
    return (r as Layout[]).filter((l) => l && typeof l.name === "string" && Array.isArray(l.teile));
  } catch { return []; }
}
export function sichereLayouts(alle: Layout[]): boolean {
  return safeSet(LAYOUT_KEY, JSON.stringify(alle.slice(-LAYOUT_ANZAHL)), "Zeitungs-Layouts");
}

/** Legt ein Layout ab. Gleicher Name ersetzt — sonst sammeln sich „Seite 1",
 *  „Seite 1", „Seite 1" an, und keines ist mehr auffindbar. */
export function legeLayout(alle: Layout[], neu: Layout, deckel = LAYOUT_ANZAHL): Layout[] {
  const ohne = alle.filter((l) => l.name !== neu.name);
  const raus = [...ohne, neu];
  return raus.length > deckel ? raus.slice(raus.length - deckel) : raus;
}

export function entferneLayout(alle: Layout[], name: string): Layout[] {
  return alle.filter((l) => l.name !== name);
}
