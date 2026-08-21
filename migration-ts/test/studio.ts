// Prüfstand Studio: die Knopfzeile über den vier W, die Klappfelder und die
// Ton-Vorräte.
//
// Der Studio-Reiter selbst lässt sich hier nicht aufbauen — er hängt an
// Dutzenden Browser-Zutaten. Geprüft wird deshalb, was ohne Browser prüfbar
// ist: die Ton-Daten als Daten, und die Verdrahtung am Quelltext. Das ist
// weniger als ein Rundgang, aber mehr als nichts — und es hält die Zusagen
// fest, die beim nächsten Umbau leicht verlorengehen.
import { readFileSync } from "fs";
import { TONE_DATA } from "../src/generation/tone.data";

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
wahr("er zieht die vier W aus der Welt", /alleBtn\.addEventListener[\s\S]{0,400}worldFillContext\(\)/.test(studio));
// Und er würfelt die Regler gleich mit.
wahr("und würfelt die Stilregler mit", /alleBtn\.addEventListener[\s\S]{0,700}ROLL_SELECTS\.forEach\(rollSel\)/.test(studio));
// Die Schlösser müssen gelten, sonst ist das Schloss wertlos.
for (const feld of ["where", "when", "who", "what"]) {
  wahr(`das Schloss auf ${feld} wird geachtet`,
    new RegExp(`w\\.${feld} && !locked\\.has\\(${feld}\\.id\\)`).test(studio));
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
