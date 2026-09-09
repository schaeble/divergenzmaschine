// Variabilität je Preset (4.356.0).
//
// Gewünscht: die Messung „wie verschieden fallen die Texte eines Presets
// aus?" als Zahl neben jedem Preset, nachprüfbar statt aus dem Gefühl.
//
// Das Maß: acht Texte mit gleichen Einstellungen (Rekombination, 150 Wörter,
// Ton neutral, ohne Markov und Störung); je Paar der Anteil der WORTBANK-
// Sätze, die nicht in beiden stehen — gemittelt, in Prozent. Es zählt nur,
// was aus dem Preset kam; Vorlagen, Kontext und Ton lässt das Maß weg, denn
// die machen jeden Text verschieden, auch bei einem Preset aus zwölf Sätzen.
// Ein erstes Maß über ALLE Sätze hatte genau das gezeigt: alle Presets 82–91,
// ein Zwölf-Satz-Preset 84 — die Variabilität des Baus, nicht des Materials.
// Mit dem Wortbank-Maß: kafka 86, baudelaire 82, myth 73, das Zwölf-Satz-
// Preset 9. So unterscheidet die Zahl, was der Nutzer wissen will: Trägt das
// Material Abwechslung, oder kreist es?
//
import type { Bank, GenInput } from "../types";
import { buildStory } from "../generation/buildStory";
import { getTraceFor } from "../atoms/trace";

export const VARIABILITAET_EINGEBAUT: Record<string, number> = {
  // Gemessen mit zehn Läufen je Preset, Wortbank-Maß (4.356.0). Alle
  // eingebauten liegen zwischen 76 und 85 — untereinander im Rauschen; das
  // Maß unterscheidet eigene und kleine Presets (ein Zwölf-Satz-Preset: 9).
  rimbaud: 80, baudelaire: 84, kafka: 82, expressionismus: 83, surrealismus1920: 83, transzendenz: 85, melville: 80, formalismus: 83,
  christentum: 81, koran: 82, buddhismus: 85, biologie: 83, geologie: 83, astrologie: 84, gaia: 84, freud: 83, jugendsprache: 81,
  modernarchitecture: 82, philosophie: 80, klimakrise: 82, ritterromane: 85, liebesromane: 81, bergwelt: 83, clown: 82, faust: 83,
  lebenreicher: 83, tanz: 78, griechischetragoedie: 82, glueck: 83, gruendungsmythos: 82, staatsphilosophie: 81, traumbilder: 83,
  mystery: 84, bureau: 84, tech: 84, myth: 84, body: 83, absurd: 82, post: 85, haute_couture: 82, eichendorff: 82, dickens: 85,
  urknall: 83, erotik: 83, hunger: 84, romantik: 80, hugo: 79, hafen: 82, alltag: 76, goethe: 80, sinnlich: 82,
};

const KEY = "dm_variabilitaet_v1";
interface Eintrag { wert: number; hash: string; laeufe: number }

export function bankHash(bank: Bank): string {
  const b = bank as unknown as Record<string, unknown>;
  let h = 0; let n = 0;
  for (const k of ["motifs", "hooks", "props", "turns", "obstacles", "stakes", "endings"]) {
    const l = b[k];
    if (!Array.isArray(l)) continue;
    for (const t of l as string[]) { n++; for (let i = 0; i < t.length; i++) h = (h * 31 + t.charCodeAt(i)) >>> 0; }
  }
  return `${n}:${h.toString(36)}`;
}

function lade(): Record<string, Eintrag> {
  try { const v = JSON.parse(localStorage.getItem(KEY) || "{}"); return v && typeof v === "object" ? v as Record<string, Eintrag> : {}; } catch { return {}; }
}
function speichere(m: Record<string, Eintrag>): void { try { localStorage.setItem(KEY, JSON.stringify(m)); } catch { /* voll */ } }

/** Misst die Variabilität des Materials: Verschiedenheit der Wortbank-Sätze
 *  zweier Läufe in Prozent. */
export function messeVariabilitaet(bank: Bank, laeufe = 8): number {
  const inp: GenInput = { where: "im Hafen", when: "am Abend", who: "Der Bote", what: "hört die Glocke", tone: "neutral", varLevel: "wild", form: "prose", structure: "rekombination", mode: "myth", perspective: "third", rhythm: "auto", markovMode: "off", disruptor: "off", archetypeA: "neutral", archetypeB: "neutral", instability: 0, polish: false, polishStyle: "surreal_precise", lenTarget: 150 } as never;
  const L = Array.from({ length: Math.max(2, laeufe) }, () => {
    const t = buildStory(bank, inp);
    return getTraceFor(t).filter((x) => x.quelle === "wortbank").map((x) => x.text.toLowerCase().replace(/[^a-zäöüß ]/g, "").trim()).filter(Boolean);
  });
  let ov = 0, paare = 0;
  for (let i = 0; i < L.length; i++) for (let j = i + 1; j < L.length; j++) {
    const A = new Set(L[i]), B = new Set(L[j]); let g = 0; for (const x of A) if (B.has(x)) g++;
    ov += g / Math.max(1, Math.min(A.size, B.size)); paare++;
  }
  return Math.round((1 - ov / Math.max(1, paare)) * 100);
}

/** Bekannter Wert: gemessen und gemerkt (passender Hash), sonst die Tabelle
 *  der eingebauten, sonst null. `id` ist die Preset-Kennung ohne Präfix. */
export function variabilitaetFuer(id: string, bank: Bank): number | null {
  const m = lade();
  const e = m[id];
  if (e && e.hash === bankHash(bank)) return e.wert;
  const kern = id.replace(/^builtin:/, "");
  if (VARIABILITAET_EINGEBAUT[kern] !== undefined && (id.startsWith("builtin:") || !id.includes(":"))) return VARIABILITAET_EINGEBAUT[kern]!;
  return null;
}

/** Misst und merkt. */
export function messeUndMerke(id: string, bank: Bank, laeufe = 8): number {
  const wert = messeVariabilitaet(bank, laeufe);
  const m = lade();
  m[id] = { wert, hash: bankHash(bank), laeufe };
  speichere(m);
  return wert;
}

export function variabilitaetWort(w: number): string {
  return w >= 78 ? "hoch — wie die eingebauten" : w >= 65 ? "mittel" : w >= 45 ? "eher gleichförmig — das Material kreist" : "gleichförmig — kleines oder einseitiges Material";
}
