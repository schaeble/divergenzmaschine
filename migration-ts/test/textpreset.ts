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
import { presetAusText, preset2AusText, kategorieFuer, teilstuecke, zuordnung, VORLAGE_EVOLUTION } from "../src/features/textpreset";
import { setDramaData, hasDramaData } from "../src/generation/dramaturgie";
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

// ── 4b · Preset 2.0: Bogen und Kontext-Material aus demselben Text ──────────
// Gewünscht: Der eingegebene Text soll den Preset-2.0-Anforderungen
// entsprechen.
{
  const p2 = preset2AusText(text);
  wahr("der Bogen ist gefüllt: Einstieg, Mitte, Höhepunkt, Schluss",
    p2.drama.einstieg.length >= 1 && p2.drama.mitte.length >= 1 && p2.drama.hoehepunkt.length >= 1 && p2.drama.schluss.length >= 1);
  wahr("Auslöser kommen aus den Requisiten", p2.drama.ausloeser.length >= 1 && p2.drama.ausloeser.every((a) => p2.bank.props.includes(a)));
  ist("Konflikte nur als sichere Nominalphrase (aus „es geht um X“)", p2.drama.konflikte.join("|"), "den Glauben selbst");
  ist("Zeitanomalien und Regeln bleiben leer — dafür gibt der Text nichts Sicheres her", p2.drama.zeitanomalien.length + p2.drama.regeln.length, 0);
  wahr("die Pools tragen die Nominalphrasen", p2.pools.includes("Ein Weihrauchfass an einer Kette"));
  // Und der Bogen trägt: Die Dramaturgie-Struktur baut daraus einen Text.
  setDramaData(p2.drama);
  wahr("die Dramaturgie nimmt den Bogen an", hasDramaData());
  const dTxt = buildStory(p2.bank, { ...inp, structure: "dramaturgie" as never });
  wahr("und baut daraus einen tragenden Text", dTxt.split(/\s+/).length > 40);
  setDramaData(null);
}

// ── 5 · Der Knopf in der Wortbank ───────────────────────────────────────────
const q = readFileSync("src/ui/wordbankView.ts", "utf8");
wahr("es gibt den Knopf", /button\("Preset aus Text"\)/.test(q));
wahr("er steht neben dem Assistenten", /wizardBtn, textBtn, archiveBtn/.test(q));
wahr("gespeichert wird als Nutzer-Preset", /user\[name\] = p\.bank;\s*\n\s*saveUserPresets\(user\)/.test(q));
wahr("und als Preset 2.0 mit Bogen und Pools", /saveUserPreset2\(name, a2\);\s*\n\s*setActive2\(a2\); setDramaData\(p\.drama\)/.test(q));
wahr("und danach ausgewählt", /rebuildPresets\("user:" \+ name\)/.test(q));
// Und der Einfügeknopf für das Textfenster — das Handy hat kein Strg+V.
wahr("es gibt den Einfügeknopf im Textfenster", /icon\("paste"\), " Einfügen"/.test(q));
wahr("er liest die Zwischenablage und ersetzt den Inhalt", /eingabe\.value = t;\s*\n\s*eingabe\.dispatchEvent\(new Event\("input"\)\)/.test(q));
wahr("versagt das Lesen, bekommt das Feld den Fokus", /\.catch\(\(\) => \{ eingabe\.focus\(\); \}\)/.test(q));

// ── 6 · Zufälliges Preset beim Aufruf der Wortbank ──────────────────────────
// Gewünscht: Beim Aufruf soll ein zufällig gewähltes Preset erscheinen —
// bisher stand immer das alphabetisch erste (Absurdität).
wahr("die Anfangswahl würfelt", /const zufallsPreset = \(\): void => \{\s*\n\s*if \(preset\.options\.length > 1\) preset\.selectedIndex = 1 \+ Math\.floor\(Math\.random/.test(q));
wahr("Auto-Mix bleibt außen vor (Index ab 1)", /selectedIndex = 1 \+ Math\.floor/.test(q));
// Nachgemeldet: Auswahl und Bearbeitungslisten müssen synchron sein — die
// Zufallswahl läuft als ECHTE Wahl über den change-Handler.
wahr("die Zufallswahl wird als echte Wahl ausgelöst", /zufallsPreset\(\);\s*\n\s*preset\.dispatchEvent\(new Event\("change"\)\)/.test(q));
wahr("auch der Rückfall nach einem Umbau", /else \{ zufallsPreset\(\); preset\.dispatchEvent\(new Event\("change"\)\); \}/.test(q));
wahr("die alte feste Wahl ist weg", !/preset\.selectedIndex = 1;\s*\/\/ nicht Auto-Mix/.test(q));

// ── 7 · Basis-Vorlage Evolution mit Markierung ──────────────────────────────
// Gewünscht: ein Beispieltext (Thema Evolution) als Basis-Vorlage im Fenster,
// mit Markierung der Elemente, die für das Preset zählen.
{
  const pv = presetAusText(VORLAGE_EVOLUTION);
  wahr("die Vorlage trifft jede Kategorie mit mindestens zwei Einträgen ohne Borgen",
    Object.values(pv.bank).every((v) => (v as string[]).length >= 2));
  const z = zuordnung(VORLAGE_EVOLUTION);
  ist("die Markierung deckt jedes Teilstück", z.length, pv.stuecke);
  wahr("und nennt die Kategorie je Stück", z.every((x) => typeof x.kategorie === "string" && x.stueck.length > 0));
  wahr("das Fenster hat den Vorlage-Knopf", /"Vorlage: Evolution"/.test(q) && /eingabe\.value = VORLAGE_EVOLUTION/.test(q));
  wahr("und die Zuordnungsanzeige", /"Zuordnung zeigen"/.test(q) && /zuordnung\(eingabe\.value\)/.test(q));
  wahr("die Vorlage schlägt einen Namen vor", /nameIn\.value = "Evolution"/.test(q));
}

console.log(`Prüfstand Preset aus Text — ${geprueft} Prüfungen, ${bestanden} bestanden`);
const proc = globalThis as unknown as { process?: { exit: (c: number) => void } };
if (fails.length) {
  console.error(`\n❌ Preset aus Text: ${fails.length} Fehler:`);
  fails.forEach((f) => console.error("  - " + f));
  proc.process?.exit(1);
} else {
  console.log(`\n✅ Preset aus Text: alle ${geprueft} Prüfungen bestanden.`);
}
