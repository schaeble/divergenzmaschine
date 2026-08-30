// Die Erzählerbank — zehn Kurzgeschichten als Dramaturgie-Vorrat.
//
// Gewünscht: Zusätzlich zur Wortbank sollen bis zu zehn frei erstellte
// Kurzgeschichten mit unterschiedlichen Dramaturgien als Vorlage gespeichert
// werden; im Studio dienen sie als Dramaturgie-Set. Entscheidung: Der Bogen
// ist FEST GEWÄHLT und wird nur auf Wunsch gewürfelt.
//
// Arbeitsteilung: Die Wortbank variiert das WAS (Material), die Erzählerbank
// das WIE (Erzählform). Aus jeder Geschichte leitet derselbe Kern, der auch
// „Preset aus Text" trägt (preset2AusText), einen dramaturgischen Bogen ab —
// Einstieg, Mitte, Höhepunkt, Schluss, Auslöser, Veränderungen, Konflikte.
// Die Analyse erkennt Positionen und Signale, keine Feinformen wie
// Retardation oder Spiegelung; zehn Geschichten werden zu zehn verschiedenen
// Satzvorräten je Phase.
//
// Vorrangregel im Studio (Regler „Bogen"):
//   „aus Preset"   — wie bisher: der Bogen des aktiven Presets (2.0) gilt.
//   „1 … 10"       — der Bogen dieser Geschichte gilt, fest.
//   „würfeln"      — je Erzeugung wird eine nicht-leere Geschichte gezogen.
// Der Griff dazu ist eine Weiche in dramaturgie.ts (setBogenOverride):
// Das Studio setzt sie VOR jeder Erzeugung (stabil für den ganzen Text)
// und räumt sie bei „aus Preset" wieder ab. Die gespeicherten Preset-Bögen
// bleiben unangetastet.
//
// Speicher: dm_erzaehlerbank_v1 (zehn Plätze à Titel + Text, ~25 kB bei
// vollen Plätzen) und dm_erzaehler_quelle_v1 (die Wahl). Beide Schlüssel
// beginnen mit „dm_" und wandern damit automatisch in die Projektdatei.
import type { DramaData } from "../generation/dramaturgie";
import { preset2AusText } from "./textpreset";

export interface Erzaehlung { titel: string; text: string; }
export const ERZAEHLER_PLAETZE = 10;
const BANK_KEY = "dm_erzaehlerbank_v1";
const QUELLE_KEY = "dm_erzaehler_quelle_v1";

/** Immer genau zehn Plätze — leere als { titel: "", text: "" }. */
export function ladeErzaehlerbank(): Erzaehlung[] {
  let roh: unknown = [];
  try { roh = JSON.parse(localStorage.getItem(BANK_KEY) || "[]"); } catch { roh = []; }
  const list = Array.isArray(roh) ? roh : [];
  return Array.from({ length: ERZAEHLER_PLAETZE }, (_, i) => {
    const e = list[i] as Partial<Erzaehlung> | undefined;
    return { titel: String(e?.titel || "").slice(0, 60), text: String(e?.text || "") };
  });
}

export function speichereErzaehlerbank(list: Erzaehlung[]): void {
  try { localStorage.setItem(BANK_KEY, JSON.stringify(list.slice(0, ERZAEHLER_PLAETZE))); } catch { /* voll */ }
}

/** Die Wahl: "preset" | "wuerfeln" | "0" … "9" (fester Platz). */
export type ErzaehlerQuelle = string;
export function ladeQuelle(): ErzaehlerQuelle {
  const q = localStorage.getItem(QUELLE_KEY) || "preset";
  return q === "preset" || q === "wuerfeln" || /^[0-9]$/.test(q) ? q : "preset";
}
export function setzeQuelle(q: ErzaehlerQuelle): void {
  try { localStorage.setItem(QUELLE_KEY, q); } catch { /* voll */ }
}

/** Ein Platz ist brauchbar, wenn sein Text genug Teilstücke hergibt. */
export function platzBrauchbar(e: Erzaehlung): boolean {
  return (e.text || "").split(/\s+/).filter(Boolean).length >= 40;
}

/** Der Bogen eines Platzes — oder null, wenn er leer/zu dünn ist. */
export function erzaehlerBogen(index: number): DramaData | null {
  const e = ladeErzaehlerbank()[index];
  if (!e || !platzBrauchbar(e)) return null;
  return preset2AusText(e.text).drama;
}

/** Der Bogen für DIESE Erzeugung, nach der gespeicherten Wahl.
 *  "preset" → null (der Preset-Bogen gilt); fester Platz → sein Bogen;
 *  "wuerfeln" → ein zufälliger brauchbarer Platz. Fällt alles aus (leere
 *  Plätze), ebenfalls null — die Maschine erzählt dann wie bisher. */
export function bogenFuerErzeugung(): DramaData | null {
  const q = ladeQuelle();
  if (q === "preset") return null;
  if (/^[0-9]$/.test(q)) return erzaehlerBogen(parseInt(q, 10));
  const brauchbar = ladeErzaehlerbank().map((e, i) => ({ e, i })).filter((x) => platzBrauchbar(x.e));
  if (!brauchbar.length) return null;
  return erzaehlerBogen(brauchbar[Math.floor(Math.random() * brauchbar.length)]!.i);
}
