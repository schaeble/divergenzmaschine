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

console.log(`Prüfstand Erzählerbank — ${geprueft} Prüfungen, ${bestanden} bestanden`);
const proc = globalThis as unknown as { process?: { exit: (c: number) => void } };
if (fails.length) {
  console.error(`\n❌ Erzählerbank: ${fails.length} Fehler:`);
  fails.forEach((f) => console.error("  - " + f));
  proc.process?.exit(1);
} else {
  console.log(`\n✅ Erzählerbank: alle ${geprueft} Prüfungen bestanden.`);
}
