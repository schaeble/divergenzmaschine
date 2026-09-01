// Prüfstand Satz-Wächter: generation/satzwaechter.ts + Einbau in isSaneMarkov.
//
// Empfehlung Punkt 1: Verschmolzene Ketten-Reste passieren die statistische
// Prüfung, weil sie aus echten Wörtern in echter Häufigkeit bestehen. Hier
// steht, dass die gemeldeten Bruchstücke fallen, dass KEIN einziger Satz des
// eingebauten Materials fällt (6930 Gegenproben), und dass der Wächter im
// Markov-Pfad wirklich hängt.
import { JSDOM } from "jsdom";
const dom = new JSDOM("<!doctype html><html><body></body></html>", { url: "https://x.test/" });
(globalThis as unknown as Record<string, unknown>).localStorage = dom.window.localStorage;
import { readFileSync } from "fs";
import { satzPlausibel, stueckPlausibel } from "../src/generation/satzwaechter";
import { isSaneMarkov } from "../src/corpus";
import { BUILTIN_PRESETS } from "../src/presets.data";
import { ERZAEHLUNGEN_VORLAGEN } from "../src/features/erzaehlungen.data";
import type { Bank } from "../src/types";

const fails: string[] = [];
let geprueft = 0, bestanden = 0;
const ist = (name: string, wert: unknown, soll: unknown): void => {
  geprueft++;
  if (wert === soll) bestanden++;
  else fails.push(`${name}: „${String(wert)}“ — erwartet „${String(soll)}“`);
};
const wahr = (name: string, b: boolean, zusatz = ""): void => ist(name + (zusatz ? ` (${zusatz})` : ""), b, true);

// ── 1 · Die gemeldeten Bruchstücke fallen ───────────────────────────────────
wahr("gebrochene Klausel fällt", !satzPlausibel("Ein Spiegelbild zeigt den Ritter als das, was nach dem Sinn und wird ausgeschlossen."));
wahr("verblose Adverb-Kette fällt", !satzPlausibel("Irgendwo wie Wärme ohne Ursache fest."));
wahr("hängendes Ende fällt (Artikel)", !satzPlausibel("Die Karte zeigt einen Weg als das, was nach dem"));
wahr("hängendes Ende fällt (und)", !satzPlausibel("Eine bleiche Boje über dem Wasser und"));

// ── 2 · Was die Maschine liebt, bleibt ──────────────────────────────────────
for (const [name, satz] of [
  ["kurze Bildzeile", "Nebelfetzen im Gras."],
  ["Nominalphrase mit Relativsatz", "Eine Feder, die auf stillem Wasser treibt."],
  ["Bild ohne Artikel", "Salz auf den Lippen wie eine Predigt"],
  ["trennbares Verb am Ende", "Kein Fenster geht auf dieser Seite auf."],
  ["Infinitiv-zu am Ende", "Das Licht ist zu hell, um wahr zu sein."],
  ["Hilfsverb", "Ich bin frei von jeder Hand."],
  ["starke Vergangenheit", "Und der Traum unterschrieb mit meinem Namen."],
  ["Inversion", "Zu einer Zeit, die niemand zählt, geht das Licht früher."],
  ["Frage", "Wo ist Gott?"],
  ["Formel-Satz", "Dann, unvermittelt: Die Glocke schlägt."],
] as [string, string][]) wahr(`bleibt: ${name}`, satzPlausibel(satz), satz);

// ── 2b · Regel 4: subjektlose Inversion mit Vergleich (zweites Blatt) ───────
wahr("subjektlose Inversion fällt", !satzPlausibel("Im Sommer ohne Nacht folgte der Schritt, über den Wipfeln liegt wie Wasser."));
for (const [name, satz] of [
  ["Subjekt nach dem Vergleich", "Im Hof liegt wie immer Schnee."],
  ["kein Vergleich, was-Subjekt", "Im Teich schwimmt, was nicht schwimmen kann."],
  ["Partizip-Apposition", "ein Pakt, mit Blut besiegelt"],
  ["Relativsatz mit als", "ein Haus, in dem ein Zimmer mehr ist als gestern"],
  ["zu-Infinitiv", "Jemand rannte, ohne zu wissen, wohin."],
  ["PP-Fragment", "Am Vorabend einer Abreise in einer Wüste mit Türen."],
] as [string, string][]) wahr(`bleibt: ${name}`, satzPlausibel(satz), satz);

// ── 3 · Gegenprobe über ALLES eingebaute Material ───────────────────────────
{
  let n = 0; const durch: string[] = [];
  for (const b of Object.values(BUILTIN_PRESETS)) for (const liste of Object.values(b as Bank)) for (const s of (liste as string[])) { n++; if (!satzPlausibel(s)) durch.push(s); }
  for (const e of ERZAEHLUNGEN_VORLAGEN) for (const s of e.text.split(/(?<=[.!?…])\s+/)) { n++; if (!satzPlausibel(s)) durch.push(s); }
  wahr(`kein einziger der ${n} eingebauten Sätze fällt`, durch.length === 0, durch.slice(0, 3).join(" | "));
}

// ── 4 · Der Wächter hängt im Markov-Pfad ────────────────────────────────────
wahr("stueckPlausibel prüft jeden Satz", !stueckPlausibel("Der Morgen liegt grau. Irgendwo wie Wärme ohne Ursache fest."));
wahr("isSaneMarkov ruft den Wächter", !isSaneMarkov("Der Regen fällt auf die Stadt und niemand öffnet die Fenster, was nach dem Sinn und wird ausgeschlossen."));
wahr("isSaneMarkov lässt Gesundes durch", isSaneMarkov("Der Regen fällt auf die Stadt und niemand öffnet die Fenster am Abend."));
{
  const q = readFileSync("src/corpus.ts", "utf8");
  wahr("der Einbau steht im Quelltext", /if \(!stueckPlausibel\(s\)\) return false;/.test(q));
}

console.log(`Prüfstand Satz-Wächter — ${geprueft} Prüfungen, ${bestanden} bestanden`);
const proc = globalThis as unknown as { process?: { exit: (c: number) => void } };
if (fails.length) {
  console.error(`\n❌ Satz-Wächter: ${fails.length} Fehler:`);
  fails.forEach((f) => console.error("  - " + f));
  proc.process?.exit(1);
} else {
  console.log(`\n✅ Satz-Wächter: alle ${geprueft} Prüfungen bestanden.`);
}
