// Prüfstand Atomisierung: atoms/atomisieren.ts, Stellschraube „Atomgröße".
//
// Gemeldet: Manche Presets geben sehr lange Passagen wieder — zu wenig
// atomisiert. Hier steht, dass lange Bausteine an tragfähigen Stellen zerlegt
// werden, dass Kurzes unangetastet bleibt, dass der Regler im Text wirkt, und
// dass er bei 0 wirklich aus ist.
import { JSDOM } from "jsdom";
const dom = new JSDOM("<!doctype html><html><body></body></html>", { url: "https://x.test/" });
(globalThis as unknown as Record<string, unknown>).localStorage = dom.window.localStorage;
import { readFileSync } from "fs";
import { atomisiere, ueberlaenge } from "../src/atoms/atomisieren";
import { DEFAULT_BANK } from "../src/constants";
import { buildStory } from "../src/generation/buildStory";
import { saveKnobs, loadKnobs, KNOB_VORGABE } from "../src/features/knobs";
import { BUILTIN_PRESETS } from "../src/presets.data";
import type { Bank, GenInput } from "../src/types";

const fails: string[] = [];
let geprueft = 0, bestanden = 0;
const ist = (name: string, wert: unknown, soll: unknown): void => {
  geprueft++;
  if (wert === soll) bestanden++;
  else fails.push(`${name}: „${String(wert)}“ — erwartet „${String(soll)}“`);
};
const wahr = (name: string, b: boolean, zusatz = ""): void => ist(name + (zusatz ? ` (${zusatz})` : ""), b, true);

// ── 1 · Die Zerlegung ───────────────────────────────────────────────────────
ist("kurz bleibt ganz", atomisiere("Der Hund kennt jedes Schaf mit Namen, die niemand ausgesprochen hat", 14).length, 1);
ist("zwei Hauptsätze an „, und“", JSON.stringify(atomisiere("Die Fähre erreicht das Ufer schräg und zu spät, und niemand fehlt an diesem Abend am Steg", 14)),
  JSON.stringify(["Die Fähre erreicht das Ufer schräg und zu spät", "niemand fehlt an diesem Abend am Steg"]));
ist("Gedankenstrich teilt", atomisiere("Das Wasser steht still wie ein Gedanke — die erste Fuhre geht gut, die zweite auch", 14).length, 2);
ist("nachgestellter Nebensatz fällt", atomisiere("Ein Kind löst sich plötzlich von der Hand seiner Mutter und läuft auf die Straße, ohne dass jemand es hält", 14)[0],
  "Ein Kind löst sich plötzlich von der Hand seiner Mutter und läuft auf die Straße");
ist("ohne Fuge bleibt ganz", atomisiere("Ein Sturm bringt in drei Tagen den Regen eines ganzen Jahres über das Tal und die Höfe darüber", 14).length, 1);
ist("und kostet Überlänge", ueberlaenge("Ein Sturm bringt in drei Tagen den Regen eines ganzen Jahres über das Tal und die Höfe darüber", 14), 4);
ist("0 = aus", atomisiere("Die Fähre erreicht das Ufer schräg und zu spät, und niemand fehlt an diesem Abend am Steg", 0).length, 1);
ist("Nominalphrase mit Relativsatz bleibt (Hausstil)", atomisiere("Eine Feder, die zuerst wärmt und dann trägt", 14)[0], "Eine Feder, die zuerst wärmt und dann trägt");

// ── 2 · Die eingebauten Presets sind unberührt ──────────────────────────────
{
  let n = 0, geteilt = 0;
  for (const b of Object.values(BUILTIN_PRESETS)) for (const l of Object.values(b as Bank)) for (const t of (l as string[])) { n++; if (atomisiere(t, 14).length !== 1 || atomisiere(t, 14)[0] !== t.trim()) geteilt++; }
  ist(`kein eingebauter Baustein (${n}) wird zerlegt`, geteilt, 0);
}

// ── 3 · Der Regler wirkt im Text ────────────────────────────────────────────
{
  const lang = [
    "Ein Kind löst sich plötzlich von der Hand seiner Mutter und läuft auf die Straße, ohne dass jemand es hält",
    "Die Fähre erreicht das Ufer schräg und zu spät, und niemand fehlt an diesem Abend am Steg",
    "Der Hund kennt jedes Schaf mit Namen, die niemand ausgesprochen hat, und zählt sie jeden Abend nach",
    "Ein Sturm bringt in drei Tagen den Regen eines ganzen Jahres über das Tal und die Höfe darüber",
    "Die Zufälle sammeln sich über Wochen an, bis sie aussehen wie ein Plan, den jemand gemacht hat",
    "Das Wasser steht still wie ein Gedanke, und die erste Fuhre geht gut, die zweite auch, die dritte nicht",
  ];
  const bank = { ...DEFAULT_BANK, motifs: [...lang, ...lang], hooks: [...lang], turns: [...lang] };
  const inp: GenInput = { where: "im Hafen", when: "am Abend", who: "Der Bote", what: "hört die Glocke",
    tone: "mystery", varLevel: "wild", form: "prose", structure: "rekombination", mode: "myth", perspective: "third",
    rhythm: "clean", markovMode: "off", disruptor: "off", archetypeA: "neutral", archetypeB: "psychopath",
    instability: 0, polish: false, polishStyle: "surreal_precise", lenTarget: 160 } as never;
  const mess = (ag: number): number => {
    saveKnobs({ ...loadKnobs(), atomgroesse: ag, satzlaenge: 0 });
    let s = 0, l = 0;
    for (let i = 0; i < 12; i++) for (const x of buildStory(bank, inp).split(/(?<=[.!?…])\s+/)) { s++; if (x.split(/\s+/).length > 14) l++; }
    return l / Math.max(1, s);
  };
  const aus = mess(0), an = mess(14);
  wahr("bei 14 deutlich weniger lange Sätze als bei 0", an < aus / 2, `${(aus * 100).toFixed(0)} % → ${(an * 100).toFixed(0)} %`);
  saveKnobs({ ...KNOB_VORGABE });
}

// ── 4 · Verdrahtung ─────────────────────────────────────────────────────────
ist("Vorgabe 14", KNOB_VORGABE.atomgroesse, 14);
{
  const q = readFileSync("src/ui/studio.ts", "utf8");
  wahr("Stellschraube in der Werkstatt", /knobRow\("atomgroesse", "Atomgröße"/.test(q));
  wahr("und in der Struktur-Ansicht", /"Atomgröße": knobSel\.atomgroesse/.test(q));
  const r = readFileSync("src/atoms/rekombination.ts", "utf8");
  wahr("Wortbank und Bogen werden atomisiert", /for \(const roh of arr\) for \(const t of atomisiere\(roh, atomMax\)\)/.test(r) && /for \(const roh of atomisiere\(roh0, atomMax\)\)/.test(r));
}

console.log(`Prüfstand Atomisierung — ${geprueft} Prüfungen, ${bestanden} bestanden`);
const proc = globalThis as unknown as { process?: { exit: (c: number) => void } };
if (fails.length) {
  console.error(`\n❌ Atomisierung: ${fails.length} Fehler:`);
  fails.forEach((f) => console.error("  - " + f));
  proc.process?.exit(1);
} else {
  console.log(`\n✅ Atomisierung: alle ${geprueft} Prüfungen bestanden.`);
}
