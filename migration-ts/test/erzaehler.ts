// Prüfstand Erzählerbank: features/erzaehlerbank.ts, die Weiche in
// dramaturgie.ts und der Anschluss in Studio und Reiter.
//
// Gewünscht: Zehn Kurzgeschichten als Dramaturgie-Set, im Studio als Regler
// „Bogen" — fest gewählt, gewürfelt nur auf Wunsch, „aus Preset" wie bisher.
import { JSDOM } from "jsdom";
const dom = new JSDOM("<!doctype html><html><body></body></html>", { url: "https://x.test/" });
(globalThis as unknown as Record<string, unknown>).localStorage = dom.window.localStorage;
import { readFileSync } from "fs";
import { ladeErzaehlerbank, speichereErzaehlerbank, erzaehlerBogen, bogenFuerErzeugung, setzeQuelle, ladeQuelle, platzBrauchbar, ERZAEHLER_PLAETZE } from "../src/features/erzaehlerbank";
import { SCHLAGFOLGEN } from "../src/features/erzaehlerbank";
import { SCHLAG_NAMEN, SCHLAG_STANDARD } from "../src/generation/dramaturgie";
import { DEFAULT_BANK } from "../src/constants";
import { buildStory } from "../src/generation/buildStory";
import type { GenInput } from "../src/types";
const inp: GenInput = { where: "im Hafen", when: "am Abend", who: "Der Bote", what: "hört die Glocke",
  tone: "mystery", varLevel: "wild", form: "prose", structure: "dramaturgie", mode: "myth", perspective: "third",
  rhythm: "auto", markovMode: "off", disruptor: "auto", archetypeA: "neutral", archetypeB: "psychopath",
  instability: 2, polish: false, polishStyle: "surreal_precise" };
import { ERZAEHLUNGEN_VORLAGEN } from "../src/features/erzaehlungen.data";
import { preset2AusText } from "../src/features/textpreset";
import { setBogenOverride, loadDramaData, setDramaData, hasDramaData } from "../src/generation/dramaturgie";
import { VORLAGE_EVOLUTION } from "../src/features/textpreset";

const fails: string[] = [];
let geprueft = 0, bestanden = 0;
const ist = (name: string, wert: unknown, soll: unknown): void => {
  geprueft++;
  if (wert === soll) bestanden++;
  else fails.push(`${name}: „${String(wert)}“ — erwartet „${String(soll)}“`);
};
const wahr = (name: string, b: boolean): void => ist(name, b, true);

// ── 1 · Die Bank: zehn Plätze, stabil gegen Müll ────────────────────────────
ist("immer zehn Plätze", ladeErzaehlerbank().length, ERZAEHLER_PLAETZE);
localStorage.setItem("dm_erzaehlerbank_v1", "kaputt{");
ist("kaputter Speicher → zehn leere Plätze", ladeErzaehlerbank().filter((e) => !e.text).length, ERZAEHLER_PLAETZE);
const bank = ladeErzaehlerbank();
bank[2] = { titel: "Evolution", text: VORLAGE_EVOLUTION };
speichereErzaehlerbank(bank);
ist("gespeichert und gelesen", ladeErzaehlerbank()[2]!.titel, "Evolution");
wahr("brauchbar ab vierzig Wörtern", platzBrauchbar(bank[2]!) && !platzBrauchbar({ titel: "x", text: "zu kurz" }));

// ── 2 · Der Bogen je Platz ──────────────────────────────────────────────────
const b2 = erzaehlerBogen(2);
wahr("ein voller Platz liefert einen Bogen", !!b2 && b2.einstieg.length >= 1 && b2.schluss.length >= 1);
ist("ein leerer Platz liefert null", erzaehlerBogen(5), null);

// ── 3 · Die Wahl: fest, würfeln, aus Preset ─────────────────────────────────
setzeQuelle("2");
ist("die Wahl wird gehalten", ladeQuelle(), "2");
wahr("fest gewählt → der Bogen dieses Platzes", JSON.stringify(bogenFuerErzeugung()) === JSON.stringify(b2));
setzeQuelle("preset");
ist("aus Preset → null (der Preset-Bogen gilt)", bogenFuerErzeugung(), null);
setzeQuelle("wuerfeln");
wahr("würfeln → ein brauchbarer Bogen", !!bogenFuerErzeugung());
setzeQuelle("5");
ist("fest auf leerem Platz → null, die Maschine erzählt wie bisher", bogenFuerErzeugung(), null);
setzeQuelle("unsinn");
ist("Unsinn fällt auf preset zurück", ladeQuelle(), "preset");

// ── 4 · Die Weiche: Override gilt vor dem Preset-Bogen, ohne ihn anzutasten ─
setDramaData({ einstieg: ["Preset-Einstieg."], mitte: [], hoehepunkt: [], schluss: [], ausloeser: [], veraenderungen: [], konflikte: [], zeitanomalien: [], regeln: [] });
ist("ohne Override: der gespeicherte Bogen", loadDramaData()!.einstieg[0], "Preset-Einstieg.");
setBogenOverride(b2);
wahr("mit Override: der Erzähler-Bogen", loadDramaData()!.einstieg[0] !== "Preset-Einstieg.");
wahr("hasDramaData sieht ihn ebenfalls", hasDramaData());
setBogenOverride(null);
ist("abgeräumt: wieder der gespeicherte", loadDramaData()!.einstieg[0], "Preset-Einstieg.");
setDramaData(null);

// ── 5 · Der Anschluss ───────────────────────────────────────────────────────
const st = readFileSync("src/ui/studio.ts", "utf8");
// Der Bogen hat bewusst KEIN Schloss: Der Würfel fasst ihn nicht an (nicht in
// ROLL_SELECTS), die Wahl ist ohnehin fest — ein Schloss schützte nichts.
wahr("das Studio hat den Bogen-Regler neben der Struktur", /lockField\("Struktur", structure\),[\s\S]{0,400}?el\("span", \{\}, "Bogen"\)\), bogenSel\)/.test(st));
wahr("der Bogen ist nicht würfelbar", !/ROLL_SELECTS = \[[^\]]*bogenSel/.test(st));
wahr("die Wahl wird beim Wechsel gesichert", /bogenSel\.addEventListener\("change", \(\) => setzeQuelle\(bogenSel\.value\)\)/.test(st));
wahr("vor jeder Erzeugung wird die Weiche gestellt", /setBogenOverride\(bogenFuerErzeugung\(\)\);\s*\n\s*const model = /.test(st));
const ap = readFileSync("src/ui/app.ts", "utf8");
wahr("der Reiter steht neben der Wortbank", /\["Wortbank", mountWordbank\],\s*\n\s*\["Erzählerbank", mountErzaehlerbank\],/.test(ap));
const ev = readFileSync("src/ui/erzaehlerbankView.ts", "utf8");
wahr("jeder Platz hat Titel, Text, Bogen-Vorschau, Einfügen, Speichern, Leeren",
  /Bogen zeigen/.test(ev) && /Einfügen/.test(ev) && /Platz leeren/.test(ev) && /preset2AusText\(textIn\.value\)\.drama/.test(ev));

// ── Die zehn eingebauten Vorlagen ───────────────────────────────────────────
// Gewünscht: zehn Geschichten mit unterschiedlichen Bögen, einsetzbar in die
// leeren Plätze.
{
  ist("es sind zehn", ERZAEHLUNGEN_VORLAGEN.length, 10);
  wahr("alle brauchbar (über der 40-Wörter-Schwelle)", ERZAEHLUNGEN_VORLAGEN.every((e) => platzBrauchbar(e)));
  ist("die Titel sind verschieden", new Set(ERZAEHLUNGEN_VORLAGEN.map((e) => e.titel)).size, 10);
  wahr("jede trägt Einstieg, Höhepunkt und Schluss", ERZAEHLUNGEN_VORLAGEN.every((e) => {
    const d = preset2AusText(e.text).drama;
    return d.einstieg.length >= 1 && d.hoehepunkt.length >= 1 && d.schluss.length >= 1;
  }));
  wahr("und die Texte sind verschieden lang gebaut (kein Klon)", new Set(ERZAEHLUNGEN_VORLAGEN.map((e) => e.text.length)).size === 10);
  const q2 = readFileSync("src/ui/erzaehlerbankView.ts", "utf8");
  wahr("der Reiter hat den Vorlagen-Knopf", /"Vorlagen einsetzen \(leere Plätze\)"/.test(q2));
  wahr("er füllt nur leere Plätze", /if \(alle\[i\]!\.text\.trim\(\)\) continue;/.test(q2));
  wahr("belegte Plätze melden sich statt zu überschreiben", /"Kein Platz frei"/.test(q2));
}

// ── Schlagfolge: Die Bauform ordnet die Schläge wirklich um ─────────────────
// Gewünscht: Der Bogen soll auch die SCHLAGFOLGE variieren — „Katastrophe
// zuerst" beginnt mit dem Höhepunkt, „Kreisschluss" kehrt zum Einstieg
// zurück, „Rückwärts" beginnt mit dem Schluss.
{
  wahr("jede Bauform nennt nur gültige Schläge",
    Object.values(SCHLAGFOLGEN).every((f) => f.folge.every((n) => SCHLAG_NAMEN.has(n))));
  ist("die Standardfolge ist der steigende Bogen", SCHLAGFOLGEN["standard"]!.folge.join(","), SCHLAG_STANDARD.join(","));
  ist("Katastrophe zuerst beginnt mit dem Höhepunkt", SCHLAGFOLGEN["katastrophe"]!.folge[0], "hoehepunkt");
  ist("Rückwärts beginnt mit dem Schluss", SCHLAGFOLGEN["rueckwaerts"]!.folge[0], "schluss");
  ist("der Kreis endet am Einstieg", SCHLAGFOLGEN["kreis"]!.folge.at(-1), "einstieg");
  wahr("der stille Bogen verzichtet auf Wende und Höhepunkt",
    !SCHLAGFOLGEN["still"]!.folge.includes("wende") && !SCHLAGFOLGEN["still"]!.folge.includes("hoehepunkt"));
  wahr("das offene Ende lässt den Schluss aus", !SCHLAGFOLGEN["offen"]!.folge.includes("schluss"));
  wahr("jede Vorlage trägt ihre Bauform", ERZAEHLUNGEN_VORLAGEN.every((e) => !!e.folge && !!SCHLAGFOLGEN[e.folge!]));
  ist("und alle zehn Bauformen kommen vor", new Set(ERZAEHLUNGEN_VORLAGEN.map((e) => e.folge)).size, 10);
  // Wirkung am gebauten Text: „Katastrophe zuerst" stellt den Höhepunkt an
  // den Anfang — ohne „Und dann"-Formel; im Standard steht er hinten mit ihr.
  const alle = ladeErzaehlerbank();
  alle[0] = { ...ERZAEHLUNGEN_VORLAGEN[7]! };   // Katastrophe zuerst
  speichereErzaehlerbank(alle);
  const bogen = erzaehlerBogen(0)!;
  wahr("der Bogen trägt die Folge der Bauform", (bogen.folge || []).join(",") === SCHLAGFOLGEN["katastrophe"]!.folge.join(","));
  setDramaData(bogen);
  // Der Ton darf einen Einleitungssatz davorschieben — deshalb zählen die
  // ersten drei Sätze als „Anfang", und die „Und dann"-Formel darf dort
  // nicht stehen.
  let vorn = 0;
  for (let i = 0; i < 12; i++) {
    const t = buildStory(DEFAULT_BANK, inp);
    const kopf = t.split(/(?<=[.!?…])\s+/).slice(0, 3).join(" ");
    if (!/Und dann:/.test(kopf) && bogen.hoehepunkt.some((h) => kopf.includes(h.slice(0, 18)))) vorn++;
  }
  wahr("der Höhepunkt steht am Anfang (12 Läufe, mehrmals getroffen)", vorn >= 6, String(vorn));
  setDramaData(null);
}

// ── Gemeldet aus einem Blatt: Wiederholung, Zeitkopf, Nebensatz-Schnitt ─────
{
  // 1) Kein Bogen-Satz zweimal im selben Text.
  const d1: import("../src/generation/dramaturgie").DramaData = { einstieg: ["Ein Absender ohne Namen, eine Schrift wie seine eigene"], mitte: ["Ein Absender ohne Namen, eine Schrift wie seine eigene", "Die zweite Zeile"],
    hoehepunkt: ["Der Gipfel"], schluss: [], ausloeser: [], veraenderungen: ["Alles dreht"], konflikte: [], zeitanomalien: [], regeln: [], folge: ["einstieg", "mitte", "mitte", "wende", "hoehepunkt"] };
  setDramaData(d1);
  let doppelt = 0;
  for (let i = 0; i < 20; i++) { const t = buildStory(DEFAULT_BANK, inp);
    if ((t.match(/eine Schrift wie seine eigene/g) || []).length > 1) doppelt++; }
  ist("kein Bogen-Satz zweimal im selben Text (20 Läufe)", doppelt, 0);
  // 2) „Dann, unvermittelt:" nie vor einem Satz, der selbst mit einem Zeitwort beginnt.
  const d2: import("../src/generation/dramaturgie").DramaData = { einstieg: ["Der Anfang steht"], mitte: [], hoehepunkt: ["Plötzlich weiß er alles"], schluss: [],
    ausloeser: ["Davor wartet er drei Tage neben dem Briefkasten"], veraenderungen: [], konflikte: [], zeitanomalien: [], regeln: [], folge: ["einstieg", "ausloeser", "hoehepunkt"] };
  setDramaData(d2);
  let zeitkopf = 0;
  for (let i = 0; i < 20; i++) { const t = buildStory(DEFAULT_BANK, inp);
    if (/(Dann, unvermittelt: Davor|Und dann: Plötzlich)/.test(t)) zeitkopf++; }
  ist("keine Zeit-Formel vor einem Zeitwort (20 Läufe)", zeitkopf, 0);
  setDramaData(null);
}

// ── Gemeldet, zweites Blatt: Wiederholung über Systemgrenzen, Nebensatz-Wann ─
{
  const d3: import("../src/generation/dramaturgie").DramaData = { einstieg: ["Der Anfang steht"], mitte: [], hoehepunkt: [], schluss: [],
    ausloeser: ["die Karten der Wahrsagerin zeigen zweimal denselben Tod"], veraenderungen: [], konflikte: [], zeitanomalien: [], regeln: [],
    folge: ["einstieg", "ausloeser", "wende"] };
  setDramaData(d3);
  const bankMitTurn = { ...DEFAULT_BANK, turns: ["die Karten der Wahrsagerin zeigen zweimal denselben Tod"] };
  let mehrfach = 0;
  for (let i = 0; i < 25; i++) { const t = buildStory(bankMitTurn, { ...inp, tension: "high" as never });
    if ((t.match(/Karten der Wahrsagerin/g) || []).length > 1) mehrfach++; }
  ist("Bogen-Auslöser und Bank-Wende mit gleichem Wortlaut: höchstens einmal (25 Läufe)", mehrfach, 0);
  const d4: import("../src/generation/dramaturgie").DramaData = { ...d3, ausloeser: [], folge: ["einstieg"] };
  setDramaData(d4);
  const t2 = buildStory(DEFAULT_BANK, { ...inp, when: "Nachdem die letzte Grenze fiel, als die Zeitungen schwiegen", where: "hoch in der Luft", polish: false });
  wahr("kein nacktes „… schwiegen hoch in der Luft.“", !/schwiegen hoch in der Luft\./i.test(t2));
  wahr("der Einstiegssatz schließt das Fragment mit Strich", /schwiegen hoch in der Luft — der Anfang steht/i.test(t2));
  setDramaData(null);
}

console.log(`Prüfstand Erzählerbank — ${geprueft} Prüfungen, ${bestanden} bestanden`);
const proc = globalThis as unknown as { process?: { exit: (c: number) => void } };
if (fails.length) {
  console.error(`\n❌ Erzählerbank: ${fails.length} Fehler:`);
  fails.forEach((f) => console.error("  - " + f));
  proc.process?.exit(1);
} else {
  console.log(`\n✅ Erzählerbank: alle ${geprueft} Prüfungen bestanden.`);
}
