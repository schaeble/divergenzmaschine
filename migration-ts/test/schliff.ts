// Prüfstand Schliff: zwei Filter, die mehr wegwarfen, als sie sollten.
//
// Beide Befunde stammen aus Ausgabe Nr. 41.
{
  const g = globalThis as unknown as { localStorage?: Storage };
  if (typeof g.localStorage === "undefined") {
    const m: Record<string, string> = {};
    g.localStorage = { getItem: (k: string) => (k in m ? m[k]! : null), setItem: (k: string, v: string) => { m[k] = String(v); },
      removeItem: (k: string) => { delete m[k]; }, clear: () => { for (const k of Object.keys(m)) delete m[k]; },
      key: () => null, length: 0 } as unknown as Storage;
  }
}
import { istAbgeschnitten } from "../src/generation/postprocess";
import { OBJEKT_EINSTIEG } from "../src/generation/shape";
import { corpusSanitize } from "../src/corpus";
import { GERUESTZEILE } from "../src/atoms/rekombination";
import { BUILTIN_PRESETS } from "../src/presets.data";

const fails: string[] = [];
let geprueft = 0, bestanden = 0;
const ist = (name: string, wert: unknown, soll: unknown): void => {
  geprueft++;
  if (wert === soll) bestanden++; else fails.push(`${name}: „${String(wert)}“ — erwartet „${String(soll)}“`);
};
const wahr = (name: string, b: boolean): void => ist(name, b, true);

// ── 1 · Der Bruchstück-Filter ──────────────────────────────────────────────
// Er fragte nur: „Endet der Satz auf einem Funktionswort?" Damit warf er
// gemessen 73 tadellose Preset-Sätze weg — 3 Prozent aller Bank-Sätze bis zwölf
// Wörter. Deutsche Sätze enden sehr wohl auf einem trennbaren Präfix.
const GUT = [
  "Die Stadt springt mich an.",
  "ein Blick löst Panik aus",
  "das Wort reicht nicht mehr und hört auf",
  "So endet das Suchen, ohne dass etwas gefunden ist.",
  "Wir fahren, als jagten wir einem Gedanken nach.",
  "Und das Meer bleibt, wie es ist.",
  "eine Wartemarke, die nicht aufgerufen wird",
  "Der Wartende steigt doch ein",
  "Sag ehrlich, fühlst du das?",
];
// Die sechs Rahmensätze der Objektperspektive dürfen von diesem Filter NICHT
// getroffen werden — sonst verschwinden sie still aus dem Text, und genau das
// ist in Ausgabe Nr. 41 geschehen.
for (const r of OBJEKT_EINSTIEG) {
  for (const satz of r.replace("%O", "die Akte").split(/(?<=\.)\s+/)) {
    wahr(`Rahmensatz überlebt: „${satz}“`, !istAbgeschnitten(satz.replace(/[.!?…]+$/, "")));
  }
}
for (const g of GUT) wahr(`gilt nicht als Bruchstück: „${g}“`, !istAbgeschnitten(g.replace(/[.!?…]+$/, "")));

// Echte Bruchstücke müssen weiter fallen — sonst ist der Filter nur weich.
const SCHLECHT = ["ein Blick auf der", "die Tür und", "der Schatten des", "ein Weg zu einem",
  "der Rand ohne", "eine Stimme aber", "das Zimmer im"];
for (const b of SCHLECHT) wahr(`bleibt Bruchstück: „${b}“`, istAbgeschnitten(b));

// Und die Bilanz über alle Presets: Der alte Filter traf 73 Sätze, der neue
// höchstens fünf. Diese Zahl hält die Verbesserung fest.
{
  const ALT = /(^|\s)(ein|eine|einem|einen|einer|eines|der|die|das|dem|den|des|und|oder|aber|wie|mit|an|auf|zu|im|am|vor|nach|für|ohne|als|bei|aus|ist|sind|wird)$/i;
  let alt = 0, neu = 0;
  for (const id of Object.keys(BUILTIN_PRESETS)) {
    const bank = BUILTIN_PRESETS[id] as unknown as Record<string, unknown>;
    for (const k of Object.keys(bank)) {
      const arr = bank[k];
      if (!Array.isArray(arr)) continue;
      for (const roh of arr as string[]) {
        const bare = String(roh).trim().replace(/[.!?…]+$/, "").trim();
        if (bare.split(/\s+/).length > 12) continue;
        if (ALT.test(bare)) alt++;
        if (istAbgeschnitten(bare)) neu++;
      }
    }
  }
  wahr(`der alte Filter traf viele Preset-Sätze (${alt})`, alt >= 60);
  wahr(`der neue trifft fast keine mehr (${neu})`, neu <= 5);
}

// ── 2 · Das Gerüst der eigenen Ausgabe im Korpus ───────────────────────────
// „WAS: will die Spur bewusst auf" stand mitten in einem Prosaabsatz. Wer eine
// Multi-Shot-Sequenz in den Korpus legt, legt ihre Kopfzeilen mit hinein.
const SEQ = [
  "SEQUENZ — Die Spur",
  "WER: die Herbergsmagd",
  "WO: in der Markthalle",
  "WANN: am Nachmittag",
  "WAS: will die Spur bewusst auf",
  "GESAMTLÄNGE: 15s • 3s pro Shot",
  "",
  "Shot 1 (3s) Die Tür steht offen und niemand geht hindurch.",
  "DE: Ein Licht fällt auf den Boden der Halle.",
].join("\n");

{
  const rein = corpusSanitize(SEQ);
  wahr("keine Kopfzeile überlebt die Korpus-Reinigung", !/(WER|WO|WANN|WAS|GESAMTLÄNGE|SEQUENZ|DE):?/.test(rein));
  wahr("aber die Sätze dahinter bleiben erhalten", rein.includes("Die Tür steht offen und niemand geht hindurch."));
  wahr("auch der aus der Sprachzeile", rein.includes("Ein Licht fällt auf den Boden der Halle."));
  ist("und nichts sonst bleibt übrig", rein.split(/(?<=[.!?…])\s+/).length, 2);
}
for (const z of SEQ.split("\n").filter(Boolean)) {
  wahr(`als Gerüstzeile erkannt: „${z.slice(0, 28)}…“`, GERUESTZEILE.test(z));
}
wahr("ein gewöhnlicher Satz gilt nicht als Gerüst", !GERUESTZEILE.test("Die Tür steht offen und niemand geht hindurch."));

console.log(`Prüfstand Schliff — ${geprueft} Prüfungen, ${bestanden} bestanden`);
const proc = globalThis as unknown as { process?: { exit: (c: number) => void } };
if (fails.length) {
  console.error(`\n❌ Schliff: ${fails.length} Fehler:`);
  fails.forEach((f) => console.error("  - " + f));
  proc.process?.exit(1);
} else {
  console.log(`\n✅ Schliff: alle ${geprueft} Prüfungen bestanden.`);
}
