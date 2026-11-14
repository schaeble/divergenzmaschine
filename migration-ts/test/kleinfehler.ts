// Prüfstand „Vier kleine Fehler" (4.390.0) — Punkt 4 der Analyse von 4.386.
//
//   Prosa:   Perspektive Er/Sie gewählt, trotzdem Ich-Sätze   70 von 200
//   Bericht: Kopfzeile gebeugt („Schlaflosen Stadt · …")      17 von 200
//   Strang:  Schlusszeile doppelt                             13 von 200
//   Melder:  „die die" im Relativsatz als Wortverdopplung gewertet
//
// Jedes Muster mit Gegenprobe.
import { JSDOM } from "jsdom";
const dom = new JSDOM("<!doctype html><html><body></body></html>", { url: "https://x.test/" });
(globalThis as unknown as Record<string, unknown>).localStorage = dom.window.localStorage;
import { BUILTIN_PRESETS } from "../src/presets.data";
import { buildStory, bankOhneIch } from "../src/generation/buildStory";
import { randomContext } from "../src/generation/context";
import { grammarFlags } from "../src/generation/grammar";
import { dachOrt } from "../src/features/faktenblatt";
import { applyStrangPoem } from "../src/generation/strang";
import type { GenInput, Bank } from "../src/types";

const fails: string[] = [];
let geprueft = 0;
const wahr = (name: string, ok: boolean, info = ""): void => { geprueft++; if (!ok) fails.push(`${name}${info ? " (" + info + ")" : ""}`); };
const ist = <T,>(name: string, a: T, b: T): void => wahr(name, a === b, `„${String(a)}“ — erwartet „${String(b)}“`);
const P = Object.keys(BUILTIN_PRESETS);
const bau = (o: Partial<GenInput>, i: number): string => buildStory(BUILTIN_PRESETS[P[i % P.length]!]! as Bank, { ...randomContext(), tone: "neutral", varLevel: "mid", form: "prose", structure: "auto", mode: "auto", perspective: "third", rhythm: "auto", markovMode: "off", disruptor: "off", archetypeA: "neutral", archetypeB: "neutral", instability: 0, lenTarget: 250, ...o } as GenInput);
const ohneZitat = (t: string): string => t.replace(/„[^“]*“|»[^«]*«/g, "");
const ICH = /(?<![\p{L}])(ich|mir|mich|mein|meine|meinen|meinem|meiner|meines)(?![\p{L}])/iu;

// ── 1 · Perspektive Er/Sie ─────────────────────────────────────────────────
{
  let mit = 0; let bsp = "";
  for (let i = 0; i < 150; i++) { const t = ohneZitat(bau({}, i)); const m = t.match(ICH); if (m) { mit++; bsp = t.slice(Math.max(0, m.index! - 40), m.index! + 40).replace(/\n/g, " "); } }
  ist(`Er/Sie gewählt: kein Ich-Satz in 150 Texten${bsp ? " — „…" + bsp + "…“" : ""}`, mit, 0);
  // Gegenprobe: Mit Perspektive „Ich" stehen Ich-Sätze da — der Melder sieht sie.
  let ichTexte = 0; for (let i = 0; i < 30; i++) if (ICH.test(ohneZitat(bau({ perspective: "first" }, i)))) ichTexte++;
  wahr(`Gegenprobe: Perspektive Ich ergibt Ich-Sätze (${ichTexte}/30)`, ichTexte >= 20);
  // Die Bank: Ich-Einträge fallen, wörtliche Rede bleibt, kleine Pools bleiben ganz.
  const b = bankOhneIch({ motifs: ["ein Haus", "ich und mein Schatten", "ein Fluss", "ein Tor", "„Ich komme“, sagt er"], turns: ["ich gehe", "ich bleibe", "er geht"] } as unknown as Bank) as unknown as { motifs: string[]; turns: string[] };
  ist("Ich-Eintrag fällt, Zitat bleibt", b.motifs.join(" | "), "ein Haus | ein Fluss | ein Tor | „Ich komme“, sagt er");
  ist("Gegenprobe: ein Pool, der fast leer würde, bleibt ganz", b.turns.length, 3);
}

// ── 2 · Kopfzeile des Berichts ─────────────────────────────────────────────
ist("weiblich: Adjektiv bekommt -e", dachOrt("in einer schlaflosen Stadt"), "Schlaflose Stadt");
ist("nach „der“ ebenso", dachOrt("an der versinkenden Küste"), "Versinkende Küste");
ist("Geschlecht offen: Adjektiv fällt", dachOrt("in einem verlassenen Bahnhof"), "Bahnhof");
ist("… auch sächlich", dachOrt("in einem versiegelten Zimmer, wo niemand fragt"), "Zimmer");
ist("Gegenprobe: ohne Adjektiv unverändert", dachOrt("in einer Zollstation im Nebel"), "Zollstation im Nebel");
ist("Gegenprobe: ein Name bleibt", dachOrt("in Paris"), "Paris");
{
  let gebeugt = 0; let bsp = "";
  for (let i = 0; i < 200; i++) { const k = bau({ form: "bericht", lenTarget: 200 }, i).split("\n")[0]!; if (/^[A-ZÄÖÜ][a-zäöüß]+(en|em) [A-ZÄÖÜ]/.test(k)) { gebeugt++; bsp = k; } }
  ist(`keine gebeugte Kopfzeile in 200 Berichten${bsp ? " — " + bsp : ""}`, gebeugt, 0);
}

// ── 3 · Strang: keine Zeile doppelt ────────────────────────────────────────
{
  let dub = 0;
  for (let i = 0; i < 200; i++) { const l = bau({ form: "strang", perspective: "auto", lenTarget: i % 2 ? 300 : 150 }, i).split("\n").filter(Boolean).map((x) => x.toLowerCase().replace(/[^a-zäöüß]/g, "")); if (new Set(l).size < l.length) dub++; }
  ist("keine doppelte Zeile in 200 Strängen", dub, 0);
  // Der gemeldete Fall: Anker im Text und angehängt, nur ein Komma verschieden.
  const t = applyStrangPoem("Der Wind dreht über der Weide. Ein Tor steht offen. Niemand geht hindurch. So endet die Weide wo ein Tempel begann.", "So endet die Weide, wo ein Tempel begann", 60);
  ist("der Anker steht einmal", (t.toLowerCase().replace(/[^a-zäöüß\n]/g, "").match(/soendetdieweidewoeintempelbegann/g) || []).length, 1);
}

// ── 4 · Wortverdopplung: der Melder ────────────────────────────────────────
{
  const n = (t: string): number => grammarFlags(t).issues.filter((x) => /^Wortverdopplung/.test(x)).length;
  ist("Relativsatz „, die die“ ist kein Fehler", n("Eine Hand, die die Tür hält, zittert nicht."), 0);
  ist("„, der der“ auch nicht", n("Er traut einem Fremden, der der Tod selbst sein könnte."), 0);
  ist("über den Zeilenwechsel ist es keine", n("6s pro Shot\n\nShot 1 beginnt."), 0);
  ist("Gegenprobe: „der der“ ohne Komma bleibt ein Fehler", n("Er sieht der der Frau nach."), 1);
  ist("Gegenprobe: „und und“ bleibt ein Fehler", n("Er kam und und ging."), 1);
  ist("Gegenprobe: mit Umlaut", n("Die Tür Tür steht offen."), 1);
}

console.log(`Prüfstand Vier kleine Fehler — ${geprueft} Prüfungen`);
const proc = globalThis as unknown as { process?: { exit: (c: number) => void } };
if (fails.length) { console.error(`\n❌ Vier kleine Fehler: ${fails.length} Fehler:`); fails.forEach((f) => console.error("  - " + f)); proc.process?.exit(1); }
else console.log(`\n✅ Vier kleine Fehler: alle ${geprueft} Prüfungen bestanden.`);
