// Assembler-Prototyp: setzt Text aus geprüften Atomen zusammen statt aus
// Schablonen zu hoffen. Jede Position wird gefiltert (passt), dann gewichtet
// gezogen. Zweck dieser Fassung: sehen, ob die Texte taugen — noch nicht die UI.
import { darfFolgen, schliesstKopf, schwelle, type AtomTyp } from "./schema";
import type { DerivedAtom } from "./derive";
import { guessGender } from "../generation/declension";

export interface PoolAtom extends DerivedAtom {
  id: string;
  quelle: string;
  bruchgrad: number;
  verlangt: { rolle: string; kasus: string; art: string } | null;
  platzhalter?: string[];
  kategorie?: string;      // Bank-Kategorie: motifs | hooks | props | turns | obstacles | stakes | endings
}

// ── Positionslogik ───────────────────────────────────────────────────
// Ohne sie stehen die Sätze beliebig nebeneinander: grammatisch sauber, aber
// ohne Bogen. Jede Position bekommt eine Funktion; passende Atome werden
// bevorzugt, nicht erzwungen — sonst geht die Divergenz verloren.
export type Phase = "exposition" | "verdichtung" | "umschlag" | "schluss";

/** Welche Bank-Kategorien tragen welche Phase. */
const PHASEN_KATEGORIEN: Record<Phase, string[]> = {
  exposition:  ["motifs", "hooks"],
  verdichtung: ["props", "obstacles", "stakes"],
  umschlag:    ["turns"],
  schluss:     ["endings"],
};

/** Verteilt n Positionen auf den Erzählbogen (30 / 30 / 20 / 20). */
export function phasenplan(n: number): Phase[] {
  const plan: Phase[] = [];
  const grenzen: [Phase, number][] = [["exposition", 0.3], ["verdichtung", 0.6], ["umschlag", 0.8], ["schluss", 1]];
  for (let i = 0; i < n; i++) {
    const p = (i + 1) / n;
    plan.push((grenzen.find(([, g]) => p <= g) || grenzen[3]!)[0]);
  }
  return plan;
}

/** Bonus, wenn das Atom die Funktion der aktuellen Phase erfüllt. */
export function phasenBonus(a: PoolAtom, phase: Phase): number {
  if (a.quelle === "vorlage") return phase === "exposition" ? 1.2 : 0.4;   // Rahmen eröffnen gern
  if (!a.kategorie) return 0;
  if (PHASEN_KATEGORIEN[phase].includes(a.kategorie)) return 2.2;
  // Schluss-Atome dürfen nie zu früh, Motive nie ganz am Ende
  if (a.kategorie === "endings" && phase !== "schluss") return -3;
  if (a.kategorie === "motifs" && phase === "schluss") return -1.5;
  return 0;
}

export interface Kontext {
  vorheriges: PoolAtom | null;
  offenerKopf: boolean;
  entitaeten: Map<string, { abstand: number }>;
  tempus: string | null;
  divergenz: number;
  benutzt: Set<string>;
}

/** Prüft, ob ein Atom an der aktuellen Stelle stehen darf. */
export function passt(a: PoolAtom, k: Kontext, phase?: Phase): boolean {
  if (k.benutzt.has(a.id)) return false;
  // Schluss-Atome gehören ans Ende — sonst kippt der Bogen mittendrin
  if (phase && a.kategorie === "endings" && phase !== "schluss") return false;
  if (phase && phase === "schluss" && a.kategorie === "motifs") return false;
  // Ein Slot-Füller steht IM Rahmen, nicht danach — für ihn gilt die Slot-Regel,
  // nicht die Anschlussmatrix. (Regressionsfall „Zuckerkringel-Splice“: sonst wurde
  // die gültige Akkusativ-Nominalphrase mit abgewiesen.)
  const fuelltSlot = !!k.vorheriges?.verlangt;
  const vorTyp: AtomTyp | "start" = k.vorheriges ? k.vorheriges.typ : "start";
  if (!fuelltSlot && !darfFolgen(vorTyp, a.typ)) return false;
  // Offener Kopf muss bedient werden
  if (k.offenerKopf && !schliesstKopf(a.typ)) return false;
  // Slot des vorherigen Rahmens: Typ und Kasus müssen passen
  const v = k.vorheriges?.verlangt;
  if (v) {
    if (a.typ !== v.art) return false;
    if (v.art === "nominalphrase") {
      const bietet = a.bietet.kasus;
      if (!bietet) return false;
      if (bietet !== v.kasus && !(bietet === "nom_akk" && (v.kasus === "nom" || v.kasus === "akk"))) return false;
    }
  }
  // Pronomenbezug muss in Reichweite sein
  if (a.verlangt_bezug) {
    let da = false;
    for (const e of k.entitaeten.values()) if (e.abstand <= 2) { da = true; break; }
    if (!da) return false;
  }
  // Zeitebene
  if (k.tempus && a.tempus !== "kein" && a.tempus !== k.tempus) return false;
  // Divergenzschwelle — hier bleibt die Härte erhalten
  if (a.bruchgrad > schwelle(k.divergenz)) return false;
  return true;
}

/** Schreibt den Kontext nach dem Setzen eines Atoms fort. */
export function fortschreiben(k: Kontext, a: PoolAtom): void {
  k.vorheriges = a;
  k.benutzt.add(a.id);
  k.offenerKopf = a.oeffnet || (!!a.verlangt);
  if (a.tempus !== "kein" && !k.tempus) k.tempus = a.tempus;
  for (const e of k.entitaeten.values()) e.abstand++;
  for (const n of a.fuehrt_ein) k.entitaeten.set(n, { abstand: 0 });
}

/** Füllt Kontext-Platzhalter (⟨ORT⟩ …) aus den 4W-Angaben. */
export function fuelleKontext(text: string, ctx: { ort: string; zeit: string; figur: string; verb: string }): string {
  return text
    .replace(/⟨ORT⟩/g, ctx.ort).replace(/⟨ZEIT⟩/g, ctx.zeit)
    .replace(/⟨FIGUR⟩/g, ctx.figur).replace(/⟨VERB⟩/g, ctx.verb);
}

/** Bringt eine Nominalphrase in den verlangten Fall — sonst entsteht
 *  „Ich sehe ein Hintergrund“ statt „einen Hintergrund“. */
export function dekliniere(phrase: string, kasus: string): string {
  const m = phrase.match(/^(ein|eine|der|die|das)\s+(.*)$/i);
  if (!m) return phrase;
  const [, art, rest] = m as unknown as [string, string, string];
  const kern = (rest.match(/\b([A-ZÄÖÜ][a-zäöüß-]{2,})/) || [])[1];
  const g = kern ? guessGender(kern) : undefined;
  if (!g) return phrase;
  const map: Record<string, Record<string, string>> = {
    akk: { m: art.toLowerCase() === "ein" ? "einen" : "den", f: art, n: art },
    dat: { m: art.toLowerCase() === "ein" ? "einem" : "dem", f: art.toLowerCase() === "eine" ? "einer" : "der", n: art.toLowerCase() === "ein" ? "einem" : "dem" },
  };
  const neu = map[kasus]?.[g];
  if (!neu) return phrase;
  // Adjektiv nur mitziehen, wenn sich der Artikel geändert hat — sonst wird aus
  // „die eigene Haut“ (Akk. fem., korrekt) fälschlich „die eigenen Haut“.
  const r = neu.toLowerCase() !== art.toLowerCase()
    ? rest.replace(/^([a-zäöüß]+?)(?:e|er|es|em|en)?(\s+[A-ZÄÖÜ])/, (_m, stamm: string, tail: string) => stamm + "en" + tail)
    : rest;
  return neu + " " + r;
}

/** Setzt den ERSTEN offenen Slot — mit Kasusanpassung der Füllung. */
export function fuelleSlot(rahmen: string, fueller: string): string {
  const m = rahmen.match(/⟨(AKK|DAT|NOM|SATZ)⟩/);
  const kasus = m ? m[1]!.toLowerCase() : "";
  let f = fueller.replace(/[.!?…]+$/, "");
  if (kasus === "akk" || kasus === "dat") f = dekliniere(f, kasus);
  return rahmen.replace(/⟨(AKK|DAT|NOM|SATZ)⟩/, f);
}
/** Wie viele Slots sind im Text noch offen? */
export const offeneSlots = (t: string): number => (t.match(/⟨(AKK|DAT|NOM|SATZ)⟩/g) || []).length;

/** Verfuger: setzt Satzzeichen und Großschreibung an den Nahtstellen.
 *  Ohne ihn kleben die Atome aneinander („im Winter der Wartende steigt doch ein Klar wird:“). */
export function verfugen(teile: string[]): string {
  const out: string[] = [];
  for (let i = 0; i < teile.length; i++) {
    let t = teile[i]!.trim().replace(/\s+([.,;:!?])/g, "$1");
    if (!t) continue;
    // Satzanfang groß — außer der Vorgänger endet auf Doppelpunkt/Gedankenstrich
    // oder dieses Teil beginnt mit einem Konnektor, der den Satz fortsetzt.
    const vorOffen = i > 0 && /[:—]$/.test(out[out.length - 1] || "");
    t = vorOffen ? t.charAt(0).toLowerCase() + t.slice(1) : t.charAt(0).toUpperCase() + t.slice(1);
    // „Doch Die Möwen …“ → „Doch die Möwen …“
    t = t.replace(/^(Und|Doch|Aber|Oder|Denn|Dann|Dabei|Also)\s+([A-ZÄÖÜ])(?=[a-zäöüß])/,
      (_m, k: string, c: string) => k + " " + c.toLowerCase());
    const endet = /[.!?…:;—]$/.test(t);
    const naechsterFolgtDirekt = t.endsWith(":") || t.endsWith("—");
    if (!endet) t += ".";                                 // fehlendes Endzeichen ergänzen
    // Nach einem Kopf (Doppelpunkt) beginnt der Nachsatz klein, wenn er kein Satz ist
    if (naechsterFolgtDirekt && i + 1 < teile.length) {
      const n = teile[i + 1]!.trim();
      teile[i + 1] = n.charAt(0).toLowerCase() + n.slice(1);
    }
    out.push(t);
  }
  return out.join(" ").replace(/([.!?…])\s*\1+/g, "$1").replace(/:\s*\./g, ":").trim();
}

/** Zieht gewichtet: bevorzugt passende Länge und Bildfeld-Nähe zum bisherigen Text. */
export function ziehe(kandidaten: PoolAtom[], sollGewicht: string, bisher: string, phase?: Phase): PoolAtom | null {
  if (!kandidaten.length) return null;
  const stems = (t: string): Set<string> => new Set((t.toLowerCase().match(/[a-zäöüß]{5,}/g) || []).map((w) => w.slice(0, 5)));
  const kontext = stems(bisher);
  const score = (a: PoolAtom): number => {
    let s = 1;
    if (phase) s += phasenBonus(a, phase);         // Funktion der Position zuerst
    if (a.rhythmus.gewicht === sollGewicht) s += 1.5;
    const ov = [...stems(a.text)].filter((x) => kontext.has(x)).length;
    s += Math.min(ov, 2) * 0.8;                    // etwas Bindung, aber keine Wiederholung
    if (ov > 3) s -= 2;
    return Math.max(0.05, s);                      // nie negativ ziehen
  };
  const total = kandidaten.reduce((n, a) => n + score(a), 0);
  let r = Math.random() * total;
  for (const a of kandidaten) { r -= score(a); if (r <= 0) return a; }
  return kandidaten[kandidaten.length - 1]!;
}
