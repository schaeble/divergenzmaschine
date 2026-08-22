// Prüfstand Ressort: Wächst der Bericht mit dem Platz, und passen seine Größen
// zum Ressort?
//
// Zwei Befunde des Benutzers, beide vorher gemessen:
//
// 1. „Bei Berichten fällt das Wetter kurz." Gemessen galt das für ALLE
//    Ressorts, und schlimmer: Der Bericht wurde bei großen Zielen KÜRZER —
//    Ziel 220 ergab 237 Wörter, Ziel 600 nur 186. Ursache: `mische()` deckelt
//    die freien Sätze auf die Zahl der FAKTENsätze, und die Fakten waren fest.
//    Der Deckel bleibt (er hält das Verhältnis Fakt zu Bild); die Fakten
//    wachsen jetzt mit.
//
// 2. „Immer wieder Meter-Angaben." „Ausdehnung: 278 Meter" stand in etwa jedem
//    zweiten Bericht von sieben der neun Ressorts und sagte nirgends etwas.
//    Jedes Ressort führt jetzt seine eigene Größe.
{
  const g = globalThis as unknown as { localStorage?: Storage };
  if (typeof g.localStorage === "undefined") {
    const m: Record<string, string> = {};
    g.localStorage = { getItem: (k: string) => (k in m ? m[k]! : null), setItem: (k: string, v: string) => { m[k] = String(v); },
      removeItem: (k: string) => { delete m[k]; }, clear: () => { for (const k of Object.keys(m)) delete m[k]; },
      key: () => null, length: 0 } as unknown as Storage;
  }
}
import { buildBericht } from "../src/generation/bericht";
import { ziehFaktenblatt } from "../src/features/faktenblatt";
import { RESSORTS, RESSORT_IDS } from "../src/features/ressorts";
import { BUILTIN_PRESETS } from "../src/presets.data";
import type { Bank, GenInput } from "../src/types";

const fails: string[] = [];
let geprueft = 0, bestanden = 0;
const ist = (name: string, wert: unknown, soll: unknown): void => {
  geprueft++;
  if (wert === soll) bestanden++; else fails.push(`${name}: „${String(wert)}“ — erwartet „${String(soll)}“`);
};
const wahr = (name: string, b: boolean): void => ist(name, b, true);

const ids = Object.keys(BUILTIN_PRESETS);
// buildBericht liefert ein Ergebnis-Objekt, keinen String.
const text = (e: unknown): string => (typeof e === "string" ? e : (e as { text: string }).text);
const W = (s: string): number => s.split(/\s+/).filter(Boolean).length;
const eingabe = (ziel: number): GenInput => ({
  where: "an der Unterelbe", when: "im Herbst 1923", who: "die Ostmoor-Werft",
  what: "meldet einen Vorfall", tone: "nuechtern", form: "bericht", lenTarget: ziel,
  mode: "auto", structure: "linear", perspective: "third", rhythm: "auto", disruptor: "off",
  instability: 0, markovMode: "off", varLevel: "wild", archetypeA: "neutral", archetypeB: "neutral",
} as unknown as GenInput);

// ── 1 · Jedes Ressort hat seine eigene Größe ───────────────────────────────
for (const r of RESSORT_IDS) {
  const groessen = RESSORTS[r].einheiten.filter((e) => e.rolle === "groesse");
  wahr(`${r} führt eine eigene Größe (${groessen.map((g) => g.einheit).join(", ") || "—"})`, groessen.length >= 1);
}
// Und die allgemeine Liste springt nicht mehr mit einer nackten Länge ein.
{
  let nackteMeter = 0, n = 0;
  for (const r of RESSORT_IDS) {
    for (let i = 0; i < 12; i++) {
      const fb = ziehFaktenblatt(eingabe(220), r);
      n++;
      // „Meter Kaimauer" und „Meter Laufbahn" sind gewollt — die nackte Einheit
      // „Meter" ist es nicht.
      if (fb.zahlen.some((z) => z.einheit === "Meter" || z.einheit === "Quadratmeter")) nackteMeter++;
    }
  }
  ist(`kein Bericht bekommt eine nackte Längenangabe (${n} Faktenblätter)`, nackteMeter, 0);
}

// ── 2 · Das Faktenblatt wächst mit dem Ziel ────────────────────────────────
{
  const messe = (ziel: number): { zahlen: number; chrono: number; personen: number } => {
    let z = 0, c = 0, p = 0;
    for (let i = 0; i < 40; i++) {
      const fb = ziehFaktenblatt(eingabe(ziel), "wirtschaft");
      z += fb.zahlen.length; c += fb.chronologie.length; p += fb.personen.length;
    }
    return { zahlen: z / 40, chrono: c / 40, personen: p / 40 };
  };
  const klein = messe(200), gross = messe(600);
  wahr(`mehr Zahlen bei großem Ziel (${klein.zahlen.toFixed(1)} → ${gross.zahlen.toFixed(1)})`, gross.zahlen > klein.zahlen + 1);
  wahr(`längere Chronologie (${klein.chrono.toFixed(1)} → ${gross.chrono.toFixed(1)})`, gross.chrono > klein.chrono + 1);
  wahr(`eine dritte Stimme (${klein.personen.toFixed(1)} → ${gross.personen.toFixed(1)})`, gross.personen > klein.personen);
  ist("bei kleinem Ziel bleibt es bei zwei Stimmen", Math.round(klein.personen), 2);
}

// ── 3 · Und der Bericht wird davon länger, nicht kürzer ────────────────────
// Das ist der eigentliche Befund: Vorher FIEL die Kurve — 237 Wörter bei Ziel
// 220, 186 bei Ziel 600. Mehr Platz ergab weniger Text.
{
  // Ein großer Vorrat, damit die Wortbank nicht selbst zur Grenze wird: Bei
  // einem einzelnen Preset (51 Einträge) endet der Bericht bei rund 43 % der
  // Vorgabe, bei zehn vereinten Presets erst bei 74 %.
  const gross = { motifs: [], hooks: [], props: [], turns: [], obstacles: [], stakes: [], endings: [] } as unknown as Record<string, string[]>;
  for (const id of ids.slice(0, 10)) {
    const b = BUILTIN_PRESETS[id] as unknown as Record<string, string[]>;
    for (const k of Object.keys(gross)) gross[k]!.push(...(b[k] || []));
  }
  const laenge = (ziel: number): number => {
    let w = 0;
    for (let i = 0; i < 20; i++) w += W(text(buildBericht(gross as unknown as Bank, eingabe(ziel), "wirtschaft")));
    return w / 20;
  };
  const l220 = laenge(220), l320 = laenge(320), l450 = laenge(450), l600 = laenge(600);
  wahr(`Ziel 320 ergibt mehr als Ziel 220 (${Math.round(l220)} → ${Math.round(l320)})`, l320 > l220);
  wahr(`Ziel 450 mehr als 320 (${Math.round(l320)} → ${Math.round(l450)})`, l450 > l320);
  wahr(`Ziel 600 mehr als 450 (${Math.round(l450)} → ${Math.round(l600)})`, l600 > l450);
  wahr(`und Ziel 450 trifft die Vorgabe brauchbar (${Math.round(100 * l450 / 450)} %)`, l450 / 450 > 0.8);
}

// ── 4 · Die neuen Abschnitte tauchen auch auf ──────────────────────────────
{
  let mitChronik = 0, mitZahlen = 0, mitDrittem = 0;
  for (let i = 0; i < 30; i++) {
    const t = text(buildBericht(BUILTIN_PRESETS[ids[i % ids.length]!] as Bank, eingabe(600), "wirtschaft"));
    if (/(^|\n)Chronik: /.test(t)) mitChronik++;
    if (/(^|\n)In Zahlen: /.test(t)) mitZahlen++;
    if ((t.match(/“, sagte /g) || []).length >= 3) mitDrittem++;
  }
  wahr(`der Bericht bekommt eine Chronik (${mitChronik}/30)`, mitChronik >= 25);
  wahr(`einen Zahlenabschnitt (${mitZahlen}/30)`, mitZahlen >= 20);
  wahr(`und eine dritte Stimme (${mitDrittem}/30)`, mitDrittem >= 25);
  // Bei kleinem Ziel NICHT — ein kurzer Bericht mit Chronik wäre aufgebläht.
  let kleinChronik = 0;
  for (let i = 0; i < 30; i++) {
    const t = text(buildBericht(BUILTIN_PRESETS[ids[i % ids.length]!] as Bank, eingabe(160), "wirtschaft"));
    if (/(^|\n)Chronik: /.test(t)) kleinChronik++;
  }
  ist("bei kleinem Ziel bleibt sie weg", kleinChronik, 0);
}

console.log(`Prüfstand Ressort — ${geprueft} Prüfungen, ${bestanden} bestanden`);
const proc = globalThis as unknown as { process?: { exit: (c: number) => void } };
if (fails.length) {
  console.error(`\n❌ Ressort: ${fails.length} Fehler:`);
  fails.forEach((f) => console.error("  - " + f));
  proc.process?.exit(1);
} else {
  console.log(`\n✅ Ressort: alle ${geprueft} Prüfungen bestanden.`);
}
