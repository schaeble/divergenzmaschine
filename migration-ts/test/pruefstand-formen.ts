const st: Record<string, string> = {};
(globalThis as any).localStorage = { getItem: (k: string) => st[k] ?? null, setItem: (k: string, v: string) => { st[k] = String(v); }, removeItem: (k: string) => { delete st[k]; } };
(globalThis as any).window = { localStorage: (globalThis as any).localStorage };
// Prüfstand für alle übrigen Formen (D.1 der Merkliste, zweiter Teil).
//
// Dasselbe Verfahren wie beim Bericht: eine Matrix absichtlich schwieriger
// Eingaben, und jeder Fehler, der in dieser Sitzung je im Text stand, als
// Muster. Repariert war jeder einzelne — geschützt war keiner.

import { buildStory } from "../src/generation/buildStory";
import { BUILTIN_PRESETS } from "../src/presets.data";
import { BUILTIN_DRAMA } from "../src/presets.drama.data";
import { setDramaData } from "../src/generation/dramaturgie";
import { estimateSyllables } from "../src/generation/verselib";
import type { GenInput, Bank } from "../src/types";

const WER = ["Tim", "Tim, Ada", "die Wächterin", "Dr. Ing. Richard Doll"];
const WAS = [
  "bekommt einen Ausweis für ein anderes Leben",  // Verb-erst, ausserhalb der Verbtabelle
  "sehe 9 Monde am Himmel",                       // erste Person + Zahl
  "sieht eine Wurzel, die den Beton sprengt",     // Nebensatz
  "will den Betrieb schließen",                   // Modalverb
  "",                                             // leer
];
const WANN = ["im Jahr 2100", "zwischen zwei Glockenschlägen", ""];
const WO = ["in einem Rechenzentrum", "in London", ""];
const FORMEN = ["prose", "poem", "strang", "reim", "haiku", "script", "video"];

/** Muster, die nie im Text stehen dürfen. Jedes stammt aus einem echten Fund. */
const VERBOTEN: [string, RegExp][] = [
  ["Verb-erstes Fragment", /(Denn genau das geschieht|Und wieder): [a-zäöüß]+t\b/],
  ["Modalverb vor finitem Verb", /\b(will|wollte|kann|muss|soll) (bekommt|sieht|sehe|geht|kommt|nimmt|hält|trägt)\b/],
  ["sucht vor finitem Verb", /\b(sucht|suchst|suche) (sehe|sieht|warte|wartet|gehe|geht)\b/],
  // "das Ich löst sich" ist korrekt - Ich als Nomen. Nur ohne Begleiter ist es
  // das Pronomen und gehoert klein.
  ["Ich mitten im Satz", /(?<!\b(?:das|dem|des|ein|einem|eines|mein|meinem|dein|sein|seinem|ihr|ihrem|unser|jedes|kein) )\b[a-zäöüß,] (Ich|Du|Wir)\b/],
  ["zusammengesetztes Pronomen", /\b(Über|Unter|Neben)-(du|ich|wir)\b/],
  ["doppelte Endung", /\b\w+t(st|te)st\b/],
  ["Nomen nach Fuge kleingeschrieben", /[—;] (wäsche|tür|haus|licht|akte|formular|stempel)\b/],
  ["Kasus nach Dativpräposition", /\b(mit|nach|bei|seit|von|zu|aus|nahe|gegenüber) einen [A-ZÄÖÜ]/],
  // Verletzt ist die Verbletztstellung erst, wenn NACH dem finiten Verb noch
  // etwas kommt. "ohne dass etwas gefunden ist" ist korrekt - das Verb steht am
  // Ende. Mein erstes Muster meldete genau solche Saetze.
  ["dass-Satz ohne Verbletztstellung", /\bdass\b[^.,;]*\b(ist|sind|war|waren|hat|haben|wird|werden|kann|muss|will)\s+\S+/],
  // Kein Muster fuer die Wortdopplung ueber Zeilen: "... pro Shot\n\nShot 1 (3s)"
  // ist richtig, und der Fehler von damals war das Gegenteil - ein FEHLENDES
  // Wort. Dafuer gibt es die Strukturpruefung "Kopfzeile klebt am ersten Shot".
  ["Bildangabe doppelt im Shot", /(Floating dust|Neon flicker|Cold blue light|Fine fog)\.[^\n]*\1\./],
  ["Platzhalter im Text", /⟨|⟩|\bundefined\b|\bNaN\b/],
];

const syll = (l: string): number =>
  l.replace(/[–—-]$/, "").split(/\s+/).filter(Boolean).reduce((a, w) => a + estimateSyllables(w), 0);

/** Zeilenanfang oder -ende mitten in einer Fügung (Vers). */
const ENDE = /\b(der|die|das|den|dem|des|ein|eine|einen|einem|einer|und|oder|aber|mit|in|im|auf|an|am|für|von|vom|zu|zum|zur|bei|aus|über|unter|vor|nach|durch|wie|als|dass|weil|wenn|ohne|um|beim|hätte|hatte|wäre|würde|genau|so|noch|nur|auch|schon|ich|du|er|sie|es|wir)$/i;
const ANFANG = /^(als|dass|ob|weil|wenn|bevor|nachdem|sobald|obwohl|damit|indem|was|wer|wen|wem|worum|worin|woran|womit|wovon|wohin|woher|warum|und|oder|aber|doch|denn|sondern|um|zu|zum|zur|beim|vom|ins|aufs|sich)\b/i;

function strukturell(form: string, text: string, ziel: number): string[] {
  const out: string[] = [];
  const zeilen = text.split("\n");
  const woerter = (text.match(/[A-Za-zÄÖÜäöüß]+/g) || []).length;
  if (!text.trim()) return ["leerer Text"];
  if (woerter < ziel * 0.55) out.push("Länge unter 55 % der Marke");

  if (form === "prose" && !text.includes("\n\n")) out.push("Prosa ohne Absatz");
  if ((form === "poem" || form === "reim" || form === "strang" || form === "haiku") && zeilen.length < 3)
    out.push("Versform ohne Zeilen");
  if (form === "video") {
    if (!/\nShot 1 /.test(text)) out.push("Sequenz ohne Shots");
    if (!/GESAMTLÄNGE:.*\n\n/.test(text)) out.push("Kopfzeile klebt am ersten Shot");
  }
  if (form === "haiku") {
    for (const blk of text.split(/\n{2,}/)) {
      const ls = blk.split("\n").map((x) => x.trim()).filter(Boolean);
      if (ls.length !== 3) { out.push("Haiku ohne drei Zeilen"); break; }
      if (syll(ls[0]!) !== 5 || syll(ls[1]!) !== 7 || syll(ls[2]!) !== 5) { out.push("Haiku verfehlt 5-7-5"); break; }
    }
  }
  if (form === "haiku" || form === "reim" || form === "strang") {
    let ang = 0, ges = 0;
    for (const z of zeilen) {
      const t = z.replace(/[.,;:!?…–—]+$/, "").trim();
      if (!t) continue;
      ges++;
      if (ENDE.test(t) || ANFANG.test(t)) ang++;
    }
    if (ges && ang / ges > 0.12) out.push(`Anschnitte über 12 % (${Math.round(100 * ang / ges)} %)`);
  }
  return out;
}

const presets = Object.keys(BUILTIN_PRESETS);
const basis = { tone: "duester", varLevel: "wild", structure: "rekombination", mode: "auto",
  perspective: "third", rhythm: "auto", markovMode: "off", disruptor: "off", archetypeA: "neutral",
  archetypeB: "neutral", instability: 2, shots: 5, totalSec: 15 } as unknown as GenInput;

// Prosa, Reim, Haiku und Multi-Shot sind die Formen im Gebrauch. Prosagedicht,
// Gedicht-Strang und Szene sind Beiwerk (so vom Benutzer eingeordnet) - ihre
// Befunde werden gezaehlt, aber getrennt ausgewiesen. Ein Pruefstand, der
// staendig dieselben bekannten Maengel meldet, verliert seine Warnwirkung.
const IM_GEBRAUCH = new Set(["prose", "reim", "haiku", "video"]);
const zaehl = new Map<string, number>(); const bsp = new Map<string, string>();
const zaehlBeiwerk = new Map<string, number>();
let n = 0, sauber = 0, i = 0, nGebrauch = 0, sauberGebrauch = 0;
for (const form of FORMEN) for (const wer of WER) for (const was of WAS) for (const wann of WANN)
  for (const wo of WO) for (const ziel of [160, 320]) {
    const id = presets[i++ % presets.length]!;
    setDramaData(BUILTIN_DRAMA[id] || null);
    const text = buildStory(BUILTIN_PRESETS[id] as Bank,
      { ...basis, form, who: wer, what: was, when: wann, where: wo, lenTarget: ziel } as GenInput);
    n++;
    const gebraucht = IM_GEBRAUCH.has(form);
    if (gebraucht) nGebrauch++;
    const funde: string[] = [];
    for (const [name, re] of VERBOTEN) if (re.test(text)) funde.push(name);
    funde.push(...strukturell(form, text, ziel).map((x) => `${form}: ${x}`));
    if (!funde.length) { sauber++; if (gebraucht) sauberGebrauch++; continue; }
    const ziel2 = gebraucht ? zaehl : zaehlBeiwerk;
    for (const f of funde) {
      ziel2.set(f, (ziel2.get(f) || 0) + 1);
      if (!bsp.has(f)) bsp.set(f, `${form} · ${wer} · ${was || "—"} · ${id}`);
    }
  }

console.log(`Prüfstand Formen: ${n} Läufe über ${FORMEN.length} Formen`);
console.log(`  im Gebrauch (Prosa, Reim, Haiku, Multi-Shot): ${sauberGebrauch}/${nGebrauch} ohne Befund (${Math.round(100 * sauberGebrauch / nGebrauch)} %)`);
if (zaehl.size) {
  [...zaehl].sort((a, b) => b[1] - a[1]).forEach(([f, c]) =>
    console.log(`    ${String(c).padStart(4)}×  ${f}\n           bei: ${bsp.get(f)}`));
} else console.log("    keine Fehlerklasse ausgelöst");
console.log(`  Beiwerk (Prosagedicht, Strang, Szene): ${n - nGebrauch - (sauber - sauberGebrauch)} von ${n - nGebrauch} mit Befund`);
[...zaehlBeiwerk].sort((a, b) => b[1] - a[1]).slice(0, 5).forEach(([f, c]) =>
  console.log(`    ${String(c).padStart(4)}×  ${f}`));
