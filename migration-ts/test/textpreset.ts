// Prüfstand Preset aus Text: features/textpreset.ts.
//
// Gewünscht: Aus einem Text von 300–400 Wörtern soll ein Preset entstehen.
// Hier steht, dass die Sortierung die Kategorien trifft, dass nichts verloren
// geht, was ein Atom sein kann, und dass das Ergebnis den Zusammenbau nicht
// abwürgt (keine leere Kategorie).
import { JSDOM } from "jsdom";
const dom = new JSDOM("<!doctype html><html><body></body></html>", { url: "https://x.test/" });
(globalThis as unknown as Record<string, unknown>).localStorage = dom.window.localStorage;
import { readFileSync } from "fs";
import { presetAusText, kategorieFuer, teilstuecke } from "../src/features/textpreset";
import { buildStory } from "../src/generation/buildStory";
import type { GenInput } from "../src/types";

const fails: string[] = [];
let geprueft = 0, bestanden = 0;
const ist = (name: string, wert: unknown, soll: unknown): void => {
  geprueft++;
  if (wert === soll) bestanden++;
  else fails.push(`${name}: „${String(wert)}“ — erwartet „${String(soll)}“`);
};
const wahr = (name: string, b: boolean): void => ist(name, b, true);

// ── 1 · Die Sortierung trifft die Kategorien ────────────────────────────────
ist("kurze Nominalphrase → Requisit", kategorieFuer("Ein Weihrauchfass an einer Kette", false), "props");
ist("lange Nominalphrase → Bild", kategorieFuer("Eine Taube, die durch Mauern fliegt", false), "motifs");
ist("Widerstand → Hindernis", kategorieFuer("Das Gebet wird erhört, aber anders", false), "obstacles");
ist("Wende → Wende", kategorieFuer("Plötzlich kippt die Stimmung im Dorf", false), "turns");
ist("Spielstand → Einsatz", kategorieFuer("Es geht um den Glauben selbst", false), "stakes");
ist("kurzer Hauptsatz → Haken", kategorieFuer("Der Glaube verlangt einen Sprung", false), "hooks");
ist("Schluss-Satz → Schluss", kategorieFuer("Am Ende bleibt nur ein Wappen im Staub", true), "endings");

// ── 2 · Teilstücke ──────────────────────────────────────────────────────────
const t = teilstuecke("Ein Satz. Zu kurz. Ein zweiter Satz; und sein Teil — noch ein Teil dahinter.");
wahr("an Semikolon und Strich geteilt", t.includes("und sein Teil") && t.includes("noch ein Teil dahinter"));
wahr("Zweiwörter fallen weg", !t.includes("Zu kurz"));

// ── 3 · Das ganze Preset ────────────────────────────────────────────────────
const text = readFileSync("test/regression.data.ts", "utf8").length > 0
  ? `Es begann leise, so wie das Schlimmste meistens beginnt. Der Glaube verlangt einen Sprung. Eine Prozession zieht durch nasse Felder. Ein Stück Brot vom Altar. Der Beichtstuhl bleibt heute leer. Das Licht wechselt die Quelle. Eine Taube, die durch Mauern fliegt. Das Brot reicht, und niemand kann es erklären. Der Ausweg ist verstellt, seit Wochen. Die Prozession fällt aus, zum ersten Mal seit hundert Jahren. Ein Weihrauchfass an einer Kette. Eine Bibel mit Zetteln zwischen den Seiten. Das Wasser trägt nicht. Das Gebet wird erhört, aber anders. Plötzlich kippt die Stimmung im Dorf. Es geht um den Glauben selbst. Dann beginnt die Glocke von allein zu läuten. Am Ende bleibt nur ein Wappen im Staub des Hofes.` : "";
const p = presetAusText(text);
wahr("keine Kategorie bleibt leer", Object.values(p.bank).every((v) => (v as string[]).length >= 1));
wahr("nichts Verwertbares geht verloren", Object.values(p.bank).reduce((n, v) => n + (v as string[]).length, 0) === p.stuecke);
ist("Duplikate fallen weg", presetAusText("Ein Satz mit Haken steht hier. Ein Satz mit Haken steht hier.").stuecke, 1);

// ── 4 · Das Preset würgt den Zusammenbau nicht ab ───────────────────────────
const inp: GenInput = { where: "im Dorf", when: "am Abend", who: "Der Küster", what: "hört die Glocke",
  tone: "mystery", varLevel: "wild", form: "prose", structure: "linear", mode: "myth", perspective: "third",
  rhythm: "auto", markovMode: "off", disruptor: "auto", archetypeA: "neutral", archetypeB: "psychopath",
  instability: 2, polish: false, polishStyle: "surreal_precise" };
let ok = 0;
for (let i = 0; i < 5; i++) { const txt = buildStory(p.bank, inp); if (txt.split(/\s+/).length > 40) ok++; }
ist("fünf Texte aus dem Text-Preset, alle tragen", ok, 5);

// ── 5 · Der Knopf in der Wortbank ───────────────────────────────────────────
const q = readFileSync("src/ui/wordbankView.ts", "utf8");
wahr("es gibt den Knopf", /button\("Preset aus Text"\)/.test(q));
wahr("er steht neben dem Assistenten", /wizardBtn, textBtn, archiveBtn/.test(q));
wahr("gespeichert wird als Nutzer-Preset", /user\[name\] = p\.bank;\s*\n\s*saveUserPresets\(user\)/.test(q));
wahr("und danach ausgewählt", /rebuildPresets\("user:" \+ name\)/.test(q));

console.log(`Prüfstand Preset aus Text — ${geprueft} Prüfungen, ${bestanden} bestanden`);
const proc = globalThis as unknown as { process?: { exit: (c: number) => void } };
if (fails.length) {
  console.error(`\n❌ Preset aus Text: ${fails.length} Fehler:`);
  fails.forEach((f) => console.error("  - " + f));
  proc.process?.exit(1);
} else {
  console.log(`\n✅ Preset aus Text: alle ${geprueft} Prüfungen bestanden.`);
}
