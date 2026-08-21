// Prüfstand Studio: die Knopfzeile über den vier W, die Klappfelder und die
// Ton-Vorräte.
//
// Der Studio-Reiter selbst lässt sich hier nicht aufbauen — er hängt an
// Dutzenden Browser-Zutaten. Geprüft wird deshalb, was ohne Browser prüfbar
// ist: die Ton-Daten als Daten, und die Verdrahtung am Quelltext. Das ist
// weniger als ein Rundgang, aber mehr als nichts — und es hält die Zusagen
// fest, die beim nächsten Umbau leicht verlorengehen.
import { readFileSync } from "fs";
import { JSDOM } from "jsdom";
const dom = new JSDOM("<!doctype html><html><body></body></html>", { url: "https://x.test/" });
(globalThis as unknown as Record<string, unknown>).localStorage = dom.window.localStorage;
import { TONE_DATA } from "../src/generation/tone.data";
import { uebernehmeKontext, geaendert, W4_FELDER } from "../src/features/kontext";
import { worldFillContext, WELT_SAAT } from "../src/features/world";

const fails: string[] = [];
let geprueft = 0, bestanden = 0;
const ist = (name: string, wert: unknown, soll: unknown): void => {
  geprueft++;
  if (wert === soll) bestanden++; else fails.push(`${name}: „${String(wert)}“ — erwartet „${String(soll)}“`);
};
const wahr = (name: string, b: boolean, zusatz = ""): void => ist(name + (zusatz ? ` (${zusatz})` : ""), b, true);

const studio = readFileSync("src/ui/studio.ts", "utf8");
const css = readFileSync("src/ui/theme.css", "utf8");

// ── 1 · „Alles würfeln" ─────────────────────────────────────────────────────
wahr("es gibt den Knopf", /" Alles würfeln"/.test(studio));
wahr("er steht in der Knopfzeile neben dem Kontextwürfel",
  /btnrow" \}, ctxDice, alleBtn/.test(studio));
// Der Kontext kommt aus der WELT — das ist der Unterschied zum vorhandenen
// Würfel, der aus einem festen Vorrat zieht.
wahr("er zieht die vier W aus der Welt", /alleBtn\.addEventListener[\s\S]{0,900}worldFillContext\(\)/.test(studio));
// Und er würfelt die Regler gleich mit.
wahr("und würfelt die Stilregler mit", /alleBtn\.addEventListener[\s\S]{0,1400}ROLL_SELECTS\.forEach\(rollSel\)/.test(studio));
wahr("die Übernahme läuft über die geprüfte Regel", /uebernehmeKontext\(felder, worldFillContext\(\)/.test(studio));
wahr("und die Schlösser gehen als Frage hinein", /\(id\) => locked\.has\(id\)/.test(studio));

// ── 1b · Die Regel selbst, nicht ihr Abbild im Quelltext ────────────────────
// Gefragt war: „Werden die Schlösser beim Alles Würfeln berücksichtigt?" Die
// Antwort stand nur im Klickzusammenhang eines 1600-Zeilen-Moduls. Jetzt ist
// sie eine Funktion, und hier steht die Antwort als Prüfung.
const felder = {
  where: { id: "f-where", wert: "im Hafen" }, when: { id: "f-when", wert: "gestern" },
  who: { id: "f-who", wert: "Tom" }, what: { id: "f-what", wert: "wartet" },
};
const welt = { where: "am Deich", when: "im Winter", who: "Ines", what: "sucht das Boot" };
{
  const offen = uebernehmeKontext(felder, welt, () => false);
  ist("ohne Schloss wird alles übernommen", W4_FELDER.map((f) => offen[f]).join("|"), "am Deich|im Winter|Ines|sucht das Boot");
  ist("und alle vier gelten als geändert", geaendert(felder, offen).length, 4);
}
{
  const zu = uebernehmeKontext(felder, welt, (id) => id === "f-who");
  ist("ein gesperrtes Wer bleibt stehen", zu.who, "Tom");
  ist("die anderen wechseln trotzdem", zu.where, "am Deich");
  ist("und die Änderung wird richtig gezählt", geaendert(felder, zu).length, 3);
}
{
  const alles = uebernehmeKontext(felder, welt, () => true);
  ist("alle gesperrt: nichts ändert sich", geaendert(felder, alles).length, 0);
}
{
  const luecke = uebernehmeKontext(felder, { where: "am Deich", who: "" }, () => false);
  ist("ein leerer Vorschlag überschreibt nicht", luecke.who, "Tom");
  ist("und ein fehlendes Feld auch nicht", luecke.when, "gestern");
}

// ── 1c · Die Welt muss etwas zu würfeln haben ───────────────────────────────
// Gemeldet: „Wer aus den 4W wird nicht gewürfelt." Gemessen: Eine frische Welt
// hatte genau EINE Figur und EINEN Ort — da gab es nichts zu würfeln.
{
  const wer = new Set<string>(), wo = new Set<string>();
  for (let i = 0; i < 30; i++) { const c = worldFillContext(); wer.add(c.who); wo.add(c.where); }
  wahr("eine frische Welt liefert verschiedene Figuren", wer.size >= 4, `${wer.size} in 30 Zügen`);
  wahr("und verschiedene Orte", wo.size >= 3, `${wo.size} in 30 Zügen`);
  wahr("die Saat ist mehr als eine", WELT_SAAT >= 4, String(WELT_SAAT));
}

// ── 2 · Schließkreuz in den Klappfeldern ────────────────────────────────────
wahr("es gibt einen Schließer", /const schliesser = /.test(studio));
for (const [name, variable] of [["Test & Ranking", "rankDetails"], ["Werkzeugkasten", "fine"], ["Einstellungen", "settings"]]) {
  wahr(`${name} bekommt eins`, new RegExp(`${variable}\\.append\\(schliesser\\(${variable}\\)`).test(studio));
}
wahr("das ✕ klappt zu, statt umzuschalten", /\(d as HTMLDetailsElement\)\.open = false/.test(studio));
wahr("es unterbricht das Klicken der Kopfzeile", /schliesser[\s\S]{0,300}stopPropagation\(\)/.test(studio));
// Zugeklappt wäre es ein Knopf ohne Wirkung.
wahr("und ist nur im offenen Feld sichtbar", /\.fine:not\(\[open\]\) \.fine-x\{display:none\}/.test(css));

// ── 3 · Ton-Vorräte ─────────────────────────────────────────────────────────
// „Neutral" ist absichtlich leer: kein Ton heißt keine Färbung.
const toene = Object.entries(TONE_DATA).filter(([n]) => n !== "neutral");
wahr("elf Töne mit Vorrat", toene.length >= 11, String(toene.length));
let klein = 0, dublette = 0;
for (const [name, d] of toene) {
  if (d.opener.length < 10) { klein++; fails.push(`${name}.opener nur ${d.opener.length}`); }
  if (d.flavor.length < 16) { klein++; fails.push(`${name}.flavor nur ${d.flavor.length}`); }
  if (new Set(d.opener).size !== d.opener.length) { dublette++; fails.push(`${name}.opener: Dublette`); }
  if (new Set(d.flavor).size !== d.flavor.length) { dublette++; fails.push(`${name}.flavor: Dublette`); }
}
geprueft += 2;
if (!klein) bestanden++; if (!dublette) bestanden++;
// Ein Ton, dessen Einschübe sich mit einem anderen decken, ist kein eigener Ton.
let ueberschneidung = 0;
for (let i = 0; i < toene.length; i++) {
  for (let j = i + 1; j < toene.length; j++) {
    const a = new Set(toene[i]![1].flavor), b = toene[j]![1].flavor;
    if (b.some((x) => a.has(x))) ueberschneidung++;
  }
}
ist("kein Einschub steht in zwei Tönen", ueberschneidung, 0);

console.log(`Prüfstand Studio — ${geprueft} Prüfungen, ${bestanden} bestanden`);
const proc = globalThis as unknown as { process?: { exit: (c: number) => void } };
if (fails.length) {
  console.error(`\n❌ Studio: ${fails.length} Fehler:`);
  fails.forEach((f) => console.error("  - " + f));
  proc.process?.exit(1);
} else {
  console.log(`\n✅ Studio: alle ${geprueft} Prüfungen bestanden.`);
}
