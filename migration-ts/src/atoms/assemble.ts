// Assembler-Prototyp: setzt Text aus geprüften Atomen zusammen statt aus
// Schablonen zu hoffen. Jede Position wird gefiltert (passt), dann gewichtet
// gezogen. Zweck dieser Fassung: sehen, ob die Texte taugen — noch nicht die UI.
import { darfFolgen, schliesstKopf, schwelle, type AtomTyp } from "./schema";
import type { DerivedAtom } from "./derive";
import { guessGender } from "../generation/declension";
import { hatFinitesVerb } from "./derive";
import { loadKnobs } from "../features/knobs";
import { ueberlaenge } from "./atomisieren";

export interface PoolAtom extends DerivedAtom {
  id: string;
  quelle: string;
  bruchgrad: number;
  verlangt: { rolle: string; kasus: string; art: string } | null;
  platzhalter?: string[];
  /** Feste STELLE im Text — nicht Phase des Bogens.
   *
   *  Der Unterschied ist wesentlich: „Der Kreis schließt sich:" gehört ans Ende
   *  des TEXTES. Beim Rückwärtserzählen liegt dort die Exposition, nicht der
   *  Schluss des Bogens — als Phasenmarke stand der Satz plötzlich im ersten
   *  Absatz. */
  stelle?: "anfang" | "ende";
  kategorie?: string;      // Bank-Kategorie: motifs | hooks | props | turns | obstacles | stakes | endings
}

// ── Positionslogik ───────────────────────────────────────────────────
// Ohne sie stehen die Sätze beliebig nebeneinander: grammatisch sauber, aber
// ohne Bogen. Jede Position bekommt eine Funktion; passende Atome werden
// bevorzugt, nicht erzwungen — sonst geht die Divergenz verloren.
export type Phase = "exposition" | "verdichtung" | "umschlag" | "schluss";

/** Welche Bank-Kategorien tragen welche Phase. */
const PHASEN_KATEGORIEN: Record<Phase, string[]> = {
  // Die Dramaturgie-Kategorien tragen ihre Phase bereits im Namen — der Erzaehlbogen
  // eines Presets beschreibt genau das, was der Assembler ohnehin in Phasen baut.
  exposition:  ["motifs", "hooks", "was", "einstieg", "regeln"],
  verdichtung: ["props", "obstacles", "stakes", "was", "mitte", "konflikte", "zeitanomalien"],
  umschlag:    ["turns", "hoehepunkt", "ausloeser", "veraenderungen"],
  schluss:     ["endings"],
};

// ── Die Struktur IST die Phasenfolge ───────────────────────────────────────
// Bis 4.268 waren Linear, Reverse, Kreis, Fragment und Objekt fünf eigene
// Schablonenbauer mit festem Gerüst — und gemessen glichen sie einander zu
// 57 bis 63 Prozent, während die Rekombination bei 37 bis 41 Prozent zu allen
// lag. Die Wahl zwischen ihnen änderte also weniger als die Wahl des Bauwegs.
//
// Dem Sinn nach sind die fünf keine verschiedenen Maschinen, sondern
// verschiedene ANORDNUNGEN derselben Teile: Linear erzählt den Bogen vorwärts,
// Reverse rückwärts, der Kreis kehrt am Ende zum Anfang zurück, das Fragment
// springt. Genau das kann der Assembler — er baut ohnehin in Phasen.
//
// Zehn Schritte je Folge, damit sich die Anteile fein genug abbilden lassen.
export const STRUKTUR_PHASEN: Record<string, Phase[]> = {
  // Unverändert die alte Verteilung 30/30/20/20 — die Rekombination soll sich
  // durch diesen Umbau NICHT ändern.
  rekombination: ["exposition", "exposition", "exposition", "verdichtung", "verdichtung", "verdichtung", "umschlag", "umschlag", "schluss", "schluss"],
  linear:        ["exposition", "exposition", "exposition", "verdichtung", "verdichtung", "verdichtung", "umschlag", "umschlag", "schluss", "schluss"],
  // Vom Ende her: erst das Ergebnis, dann die Wende, zuletzt der Anlass.
  reverse:       ["schluss", "schluss", "umschlag", "umschlag", "verdichtung", "verdichtung", "verdichtung", "exposition", "exposition", "exposition"],
  // Der Kreis kehrt zurück: Die letzte Position trägt wieder die Eröffnung.
  circle:        ["exposition", "exposition", "verdichtung", "verdichtung", "verdichtung", "umschlag", "umschlag", "schluss", "exposition", "exposition"],
  // Das Fragment springt. Kein Zufall zur Laufzeit: Eine feste, unruhige Folge
  // ist reproduzierbar und damit prüfbar.
  fragment:      ["verdichtung", "exposition", "umschlag", "verdichtung", "schluss", "exposition", "umschlag", "verdichtung", "exposition", "schluss"],
  // Das Ding sieht zu: langer Mittelteil, kurzer Anfang, kurzer Schluss.
  object:        ["exposition", "verdichtung", "verdichtung", "umschlag", "verdichtung", "umschlag", "verdichtung", "umschlag", "schluss", "schluss"],
};

// ── Rekombination mit Bogen: die Schlagfolge wird zur Phasenfolge ───────────
// Geregelter Mittelweg (4.337.0): Die Struktur „bogen" hat keine feste
// Phasenfolge — sie wird vor jeder Erzeugung aus der Schlagfolge des gewählten
// Erzählerbank-Bogens abgeleitet (setBogenPhasen). Jeder Schlag fällt in eine
// der vier Phasen; die Folge wird auf zehn Schritte gespreizt. Ohne Bogen
// gilt die lineare Folge.
const SCHLAG_PHASE: Record<string, Phase> = {
  einstieg: "exposition", hook: "exposition", regel: "exposition",
  mitte: "verdichtung", mitte2: "verdichtung", konflikt: "verdichtung", zeit: "verdichtung", einsatz: "verdichtung",
  ausloeser: "umschlag", wende: "umschlag", hoehepunkt: "umschlag",
  schluss: "schluss",
};
export function phasenAusSchlagfolge(folge: string[] | undefined | null): Phase[] {
  const roh = (folge || []).map((n) => SCHLAG_PHASE[n]).filter((p): p is Phase => !!p);
  if (!roh.length) return STRUKTUR_PHASEN["linear"]!;
  // Erster Schritt = erster Schlag, letzter Schritt = letzter Schlag — sonst
  // fiele bei zwölf Schlägen der Schluss unter den Tisch.
  return Array.from({ length: 10 }, (_, i) => roh[Math.round((i * (roh.length - 1)) / 9)]!);
}
export function setBogenPhasen(folge: string[] | undefined | null): void {
  STRUKTUR_PHASEN["bogen"] = phasenAusSchlagfolge(folge);
}
// Gelenkphasen: Dort entscheidet sich die Bauform — Bogen-Material wird
// bevorzugt, umso stärker, je höher die Stellschraube steht. Mitten ziehen
// freier. Bei 0 % liegt der Bogen ohnehin nicht im Pool (reines „B"), bei
// 250 % ist es praktisch „A".
let bogenModus = false;
export function setBogenModus(an: boolean): void { bogenModus = an; }
export function gelenkBonus(a: PoolAtom, phase: Phase | undefined, bogenGewicht: number): number {
  if (!bogenModus || a.quelle !== "dramaturgie" || !phase) return 0;
  const faktor = phase === "umschlag" || phase === "schluss" ? 2.5 : phase === "exposition" ? 1.2 : 0.4;
  return faktor * bogenGewicht;
}

/** Welche Phase gilt bei diesem Fortschritt (0…1) in dieser Struktur? */
export function phasenFolge(struktur: string, fortschritt: number): Phase {
  const f = STRUKTUR_PHASEN[struktur] || STRUKTUR_PHASEN["linear"]!;
  const i = Math.min(f.length - 1, Math.max(0, Math.floor(fortschritt * f.length)));
  return f[i]!;
}

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
  if (a.kategorie === "was") return phase === "schluss" ? 0.5 : 3.5;        // die Handlung soll vorkommen
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
/**
 * Der naechste noch offene Platzhalter im Text. Vorlagen wie
 * "⟨FIGUR⟩ hatte ⟨AKK⟩ schon in der Hand, denn ⟨SATZ⟩." haben ZWEI Slots
 * verschiedener Art; das statische Feld `verlangt` beschreibt aber nur den ersten.
 * Ohne diese Funktion wurde der zweite Slot gegen die Regel des ersten geprueft -
 * daher "denn ein taumelnder Mast".
 */
export function naechsterSlot(text: string): { rolle: string; kasus: string; art: string } | null {
  const m = text.match(/⟨(AKK|DAT|NOM|SATZ)⟩/);
  if (!m) return null;
  const k = m[1]!;
  if (k === "SATZ") return { rolle: "ergaenzung", kasus: "nom", art: "hauptsatz" };
  return { rolle: "objekt", kasus: k.toLowerCase(), art: "nominalphrase" };
}

/**
 * Wirkt der Text wie ein vollstaendiger Satz? Zweitpruefung an der Slot-Grenze,
 * unabhaengig vom abgeleiteten Feld `typ`: derive.ts las "Die Luft roch nach Papier"
 * als Nominalphrase, weil "roch" in keiner Verbliste stand.
 */
export function wirktSatzwertig(text: string): boolean {
  // Nur den Hauptteil vor dem ersten Komma pruefen. "den Satz, der nach Sueden zeigt"
  // ist eine gueltige Nominalphrase - das finite Verb steckt im Relativsatz und macht
  // sie nicht satzwertig. (Der Regressionsfall Zuckerkringel hat genau das gemeldet.)
  const haupt = text.split(/[,;–—]/)[0] || text;
  return hatFinitesVerb(haupt);
}

export function passt(a: PoolAtom, k: Kontext, phase?: Phase, slot?: { rolle: string; kasus: string; art: string } | null): boolean {
  if (k.benutzt.has(a.id)) return false;
  // Schluss-Atome gehören ans Ende — sonst kippt der Bogen mittendrin
  if (phase && a.kategorie === "endings" && phase !== "schluss") return false;
  if (phase && phase === "schluss" && a.kategorie === "motifs") return false;
  // Ein Slot-Füller steht IM Rahmen, nicht danach — für ihn gilt die Slot-Regel,
  // nicht die Anschlussmatrix. (Regressionsfall „Zuckerkringel-Splice“: sonst wurde
  // die gültige Akkusativ-Nominalphrase mit abgewiesen.)
  const v = slot !== undefined ? slot : (k.vorheriges?.verlangt ?? null);
  const fuelltSlot = !!v;
  // Plan 0.3: „Einen Dolch, der nach Kerosin riecht.“ ist kein Satz — Akkusativ-
  // und Dativphrasen gehören in einen Rahmen, nicht frei in den Text.
  if (!fuelltSlot && a.typ === "nominalphrase" && (a.bietet.kasus === "akk" || a.bietet.kasus === "dat")) return false;
  const vorTyp: AtomTyp | "start" = k.vorheriges ? k.vorheriges.typ : "start";
  if (!fuelltSlot && !darfFolgen(vorTyp, a.typ)) return false;
  // Offener Kopf muss bedient werden
  if (k.offenerKopf && !schliesstKopf(a.typ)) return false;
  // Slot des vorherigen Rahmens: Typ und Kasus müssen passen
  if (v) {
    if (a.typ !== v.art) return false;
    // Zweite Instanz gegen Ableitungsfehler: ein Baustein mit finitem Verb ist ein
    // Satz, auch wenn er als Nominalphrase getaggt wurde - und umgekehrt.
    if (v.art === "nominalphrase" && wirktSatzwertig(a.text)) return false;
    if (v.art === "hauptsatz" && !wirktSatzwertig(a.text) && a.typ !== "hauptsatz") return false;
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
// Geschlossene Gruppe schwacher Maskulina auf Konsonant. Die auf -e werden ueber
// die Endung erkannt, brauchen also keine Liste.
const SCHWACH_KONSONANT = /^(Herr|Mensch|Held|Fürst|Prinz|Graf|Bär|Elefant|Nachbar|Bauer|Herz|Narr|Tor|Christ|Zar|Architekt|Soldat|Advokat|Kamerad|Katholik|Ochs|Spatz|Fink|Pfau|Ahn)$/;
// Schwache Maskulina auf -e. Eine Liste, weil Substantive auf -e sonst ueberwiegend
// feminin sind (Lampe, Tuer, Farbe) - guessGender liegt bei diesen belebten
// Maskulina daneben, und ohne Korrektur bliebe der Artikel falsch.
const SCHWACH_E = /^(Hase|Junge|Kollege|Zeuge|Bote|Erbe|Riese|Löwe|Affe|Rabe|Neffe|Kunde|Gefährte|Experte|Komplize|Insasse|Gatte|Bube|Falke|Franzose|Schwede|Türke|Russe|Pole|Däne|Ire|Brite|Jude|Sklave|Ahne|Zeuge)$/;
/** Ist das ein schwaches Maskulinum? Dann gilt es als maskulin, egal was die
 *  Genusheuristik sagt. */
export function istSchwachesMaskulinum(kern: string): boolean {
  return SCHWACH_E.test(kern) || SCHWACH_KONSONANT.test(kern)
    || /(ent|ant|ist|oge|graf|soph|nom|arch|krat)$/.test(kern)
    || /^(Name|Gedanke|Glaube|Wille|Friede|Buchstabe)$/.test(kern);
}

/** Akkusativ- und Dativform eines schwachen Maskulinums, sonst unveraendert. */
function schwachesMaskulinum(kern: string): string {
  if (/(chen|lein|er|el|en|ling|ismus|or)$/.test(kern)) return kern;   // starke Maskulina
  if (SCHWACH_E.test(kern)) return kern + "n";                          // Hase -> Hasen
  if (/(ent|ant|ist|oge|graf|soph|nom|arch|krat|at)$/.test(kern)) return kern + "en";
  if (kern === "Herr") return "Herrn";
  if (kern === "Nachbar" || kern === "Bauer") return kern + "n";
  if (kern === "Herz") return "Herzen";
  if (SCHWACH_KONSONANT.test(kern)) return kern + "en";
  if (kern === "Name" || kern === "Gedanke" || kern === "Glaube" || kern === "Wille" || kern === "Friede" || kern === "Buchstabe") return kern + "n";
  return kern;
}

export function dekliniere(phrase: string, kasus: string): string {
  const m = phrase.match(/^(ein|eine|der|die|das)\s+(.*)$/i);
  if (!m) return phrase;
  const [, art, rest] = m as unknown as [string, string, string];
  const kern = (rest.match(/\b([A-ZÄÖÜ][a-zäöüß-]{2,})/) || [])[1];
  // Schwache Maskulina gelten als maskulin, auch wenn die Genusheuristik anders
  // entscheidet - sonst bleibt "ein Zeuge" im Akkusativ unveraendert stehen.
  // Der bestimmte Artikel verraet das Genus sicherer als jede Endungsheuristik:
  // "der Ruf", "der Platz" blieben unveraendert, weil guessGender die Woerter nicht
  // kennt - dabei steht das Geschlecht schon vorne. Nur "ein" bleibt mehrdeutig
  // (maskulin oder neutrum), dort entscheidet weiter der Kern.
  const artG = art.toLowerCase() === "der" ? "m" : art.toLowerCase() === "das" ? "n" : undefined;
  const g = artG || (kern ? (istSchwachesMaskulinum(kern) ? "m" : guessGender(kern)) : undefined);
  if (!g) return phrase;
  const map: Record<string, Record<string, string>> = {
    akk: { m: art.toLowerCase() === "ein" ? "einen" : "den", f: art, n: art },
    dat: { m: art.toLowerCase() === "ein" ? "einem" : "dem", f: art.toLowerCase() === "eine" ? "einer" : "der", n: art.toLowerCase() === "ein" ? "einem" : "dem" },
  };
  const neu = map[kasus]?.[g];
  if (!neu) return phrase;
  // Adjektiv nur mitziehen, wenn sich der Artikel geändert hat — sonst wird aus
  // „die eigene Haut“ (Akk. fem., korrekt) fälschlich „die eigenen Haut“.
  // B.2: schwache Maskulina (n-Deklination). "einen Name" ist falsch, es heisst
  // "einen Namen". Betroffen sind belebte Maskulina auf -e (Hase, Junge, Zeuge) und
  // eine geschlossene Gruppe auf Konsonant (Herr, Mensch, Held, Fuerst, Nachbar,
  // dazu die Fremdwoerter auf -ent/-ant/-ist/-oge/-graf). Nur Akkusativ und Dativ.
  const rest2 = (kasus === "akk" || kasus === "dat") && g === "m" && kern
    ? rest.replace(new RegExp("\\b" + kern + "\\b"), schwachesMaskulinum(kern))
    : rest;
  // Alle Adjektive vor dem Kern mitziehen, nicht nur das letzte: "den letzte helle
  // Abend" blieb halb gebeugt, weil das Muster ein grossgeschriebenes Wort direkt
  // hinter dem Adjektiv verlangte.
  let r = rest2;
  if (neu.toLowerCase() !== art.toLowerCase()) {
    const w = rest2.split(/\s+/);
    let kernIdx = w.findIndex((x) => /^[A-ZÄÖÜ]/.test(x));
    if (kernIdx < 0) kernIdx = w.length;
    for (let i = 0; i < kernIdx; i++) {
      const x = w[i]!;
      if (/^[a-zäöüß]{3,}$/.test(x)) w[i] = x.replace(/(?:e|er|es|em|en)$/, "") + "en";
    }
    r = w.join(" ");
  }
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
  const bogenGewicht = (loadKnobs().bogen || 100) / 100;   // A.3: Zielvorgabe Erzählbogen
  const atomMax = loadKnobs().atomgroesse;                  // Atomgröße: Überlänge kostet
  const score = (a: PoolAtom): number => {
    let s = 1;
    // Was die Atomisierung nicht zerlegen konnte, bleibt ganz — wird aber
    // seltener gezogen: Abzug je überzähligem Wort (bei 20 statt 14 Wörtern
    // sind das 2,4 — mehr als jeder Phasenbonus).
    s -= 0.4 * ueberlaenge(a.text, atomMax);
    if (phase) s += phasenBonus(a, phase);         // Funktion der Position zuerst
    s += gelenkBonus(a, phase, bogenGewicht);      // Rekombination mit Bogen: Gelenke bevorzugen den Bogen
    if (a.rhythmus.gewicht === sollGewicht) s += 1.5;
    const ov = [...stems(a.text)].filter((x) => kontext.has(x)).length;
    s += Math.min(ov, 2) * 0.8;                    // etwas Bindung, aber keine Wiederholung
    if (ov > 3) s -= 2;
    s = Math.max(0.05, s);                         // nie negativ ziehen
    // A.3: Das Bogen-Gewicht wirkt auf den FERTIGEN Wert. Frueher stand es vor den
    // additiven Termen und wurde von ihnen ueberdeckt - bei 0 % kamen immer noch
    // 26 % Erzaehlbogen heraus.
    if (a.quelle === "dramaturgie") s = bogenGewicht === 0 ? 0.0001 : s * bogenGewicht;
    return s;
  };
  const total = kandidaten.reduce((n, a) => n + score(a), 0);
  let r = Math.random() * total;
  for (const a of kandidaten) { r -= score(a); if (r <= 0) return a; }
  return kandidaten[kandidaten.length - 1]!;
}
