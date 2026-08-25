// Prüfstand: der einfache Kopf über dem Studio.
//
// Vier Entscheidungen statt siebenunddreißig Reglern. Welche vier, ist nicht
// geraten: Der Wirkungsmesser sagt, dass die FORM mit rund 50 ausschlägt,
// während Struktur (1,47), Modus (2,15) und Ton (2,08) auf oder unter dem
// Rauschniveau der Blindprobe (~1,9) liegen. Ein einfacher Kopf, der Ton und
// Struktur anböte, böte Knöpfe an, die nichts tun.
//
// Die wichtigste Prüfung hier ist die vorletzte: dass der Kopf in die ECHTEN
// Regler schreibt. Ein Kopf mit eigenen Werten wäre die zweite Liste, gegen die
// der Wächter gebaut wurde — und der Schaltplan zeigte etwas anderes als das
// Studio, der Fehler, der zuletzt drei Anläufe gekostet hat.
import { readFileSync } from "fs";
import { JSDOM } from "jsdom";
const dom = new JSDOM("<!doctype html><html><body></body></html>", { url: "https://x.test/" });
(globalThis as unknown as Record<string, unknown>).localStorage = dom.window.localStorage;

import {
  zerlegeSaat, stellung, KOPF_FORMEN, LAENGE_STUFEN, REIBUNG_STUFEN,
  LAENGE_NAMEN, REIBUNG_NAMEN, PROBEN, SAAT_BEISPIELE, KOPF_KEY,
} from "../src/features/einfach";
import { FORM_OPTS } from "../src/generation/optionen";

const fails: string[] = [];
const zeilen: string[] = [];
let geprueft = 0;
const ist = (name: string, wert: unknown, soll: unknown): void => {
  geprueft++;
  if (wert === soll) zeilen.push(`  ✓ ${name}`);
  else { zeilen.push(`  ✗ ${name}`); fails.push(`${name}: „${String(wert)}“ — erwartet „${String(soll)}“`); }
};
const wahr = (name: string, b: boolean): void => ist(name, b, true);

// ── 1 · Ein Satz wird zu vier W ─────────────────────────────────────────────
// Der Kopf fragt nach EINEM Satz, nicht nach vier Feldern. „Ein Wachmann am
// Hafen, 1953" schreibt man in drei Sekunden, vier Felder füllt man in zwanzig.
const a = zerlegeSaat("Ein Wachmann am Hafen, 1953.");
ist("die Figur wird erkannt", a.who, "Ein Wachmann");
ist("der Ort auch", a.where, "am Hafen");
ist("und die Zeit", a.when, "im Jahr 1953");
const b = zerlegeSaat("Der Bote bringt, was niemand hören will.");
ist("ohne Ort und Zeit bleibt die Figur", b.who, "Der Bote");
ist("und der Vorgang steht im Was", b.what, "bringt, was niemand hören will");
// Beim Herausschneiden entstehen sonst doppelte Leerzeichen und hängende
// Kommas — sie stünden so in den Feldern und von dort im Text.
for (const s of SAAT_BEISPIELE) {
  const v = zerlegeSaat(s);
  const alle = [v.who, v.where, v.when, v.what].join("|");
  wahr(`kein doppeltes Leerzeichen bei „${s.slice(0, 28)}…“`, !/ {2}/.test(alle));
  wahr("und kein hängendes Komma", !/[,;]\s*$/.test(v.who));
}
// Ohne erkennbares Verb bleibt das Was LEER. Eines zu erfinden wäre schlechter
// als keines — der Generator füllt es dann selbst.
ist("ohne Verb kein erfundenes Was", zerlegeSaat("Nur ein Wort").what, "");
ist("ein leerer Satz ergibt leere Felder", zerlegeSaat("").who, "");
ist("und stürzt nicht ab", typeof zerlegeSaat("").what, "string");

// ── 2 · Die Stellung ────────────────────────────────────────────────────────
const st = stellung({ form: 0, laenge: 2, reibung: 2, saat: "Ein Wachmann am Hafen, 1953." });
ist("die Form kommt aus der Wahl", st.form, KOPF_FORMEN[0]![0]);
ist("die Länge aus der Stufe", st.lenTarget, LAENGE_STUFEN[2]);
ist("die Reibung ergibt drei Presets", st.presets, REIBUNG_STUFEN[2]);
ist("und der Kontext ist zerlegt", st.ctx.where, "am Hafen");
// Unsinn darf nicht durchschlagen: Ein Index außerhalb der Liste wäre sonst
// „undefined" in einem Reglerfeld.
ist("ein zu großer Index wird geklammert",
  stellung({ form: 99, laenge: 99, reibung: 99, saat: "" }).form, KOPF_FORMEN[KOPF_FORMEN.length - 1]![0]);
ist("ein negativer auch", stellung({ form: -5, laenge: -5, reibung: -5, saat: "" }).lenTarget, LAENGE_STUFEN[0]);

// Jede angebotene Form muss es wirklich geben — sonst hat der Kopf einen Knopf,
// der ins Leere zeigt.
for (const [f] of KOPF_FORMEN) {
  wahr(`die Form „${f}“ steht in den Reglerlisten`, FORM_OPTS.some(([v]) => v === f));
}
ist("es gibt drei Längenstufen", LAENGE_STUFEN.length, LAENGE_NAMEN.length);
ist("und drei Reibungsstufen", REIBUNG_STUFEN.length, REIBUNG_NAMEN.length);
ist("zu jeder Reibungsstufe gibt es eine Probe", PROBEN.length, REIBUNG_STUFEN.length);
// Die Probe muss die Reibung ZEIGEN: mehr Stufe, mehr Register im selben Satz.
wahr("die erste Probe hat ein Register", PROBEN[0]!.register.length === 1);
wahr("die letzte hat mehr", PROBEN[2]!.register.length > PROBEN[0]!.register.length);
wahr("und zwei Farben im Satz", PROBEN[2]!.teile.some(([, r]) => r === 2));
ist("die erste Probe hat nur eine Farbe", PROBEN[0]!.teile.every(([, r]) => r === 1), true);

wahr("die Wahl wandert in die Projektdatei", KOPF_KEY.startsWith("divergenz_"));

// ── 3 · Der Kopf schreibt in die ECHTEN Regler ──────────────────────────────
// Die Kernregel. Eine bloße Zuweisung ginge nur den halben Weg: An den
// change-Ereignissen hängen die Wortbank, der Anlagenstand für den Schaltplan
// und die Merkzettel für den Reiterwechsel. Genau das haben wir zuletzt dreimal
// hintereinander gelernt.
const q = readFileSync("src/ui/studio.ts", "utf8");
const block = q.slice(q.indexOf("const kopfLos"), q.indexOf("const reihe = (marke"));
wahr("der Kopf setzt die echte Form", /form\.value = st\.form/.test(block));
wahr("und löst aus", /form\.dispatchEvent\(new Event\("change"\)\)/.test(block));
wahr("er setzt den echten Längenschieber", /lenSlider\.value = String\(st\.lenTarget\)/.test(block));
wahr("und löst auch dort aus", /lenSlider\.dispatchEvent/.test(block));
wahr("er schreibt in die vier W", /feld\.dispatchEvent\(new Event\("input"\)\)/.test(block));
wahr("und mischt die Presets gespreizt", /waehleGespreizt\(vorrat, st\.presets\)/.test(block));
wahr("bei mehreren über die vorhandene Auswahl", /applySelection\(ids\)/.test(block));
// SCHLÖSSER halten auch hier: Wer einen Regler festgehalten hat, will ihn nicht
// von einem Kopf überschrieben bekommen.
for (const feld of ["form", "lenSlider", "preset"]) {
  wahr(`ein Schloss auf „${feld}“ hält`, new RegExp(`locked\\.has\\(${feld}\\.id\\)`).test(block));
}
wahr("auch auf den vier W", /locked\.has\(feld\.id\)/.test(block));
// Und keine zweite Ablage für Reglerwerte: Der Kopf merkt sich nur die vier
// Entscheidungen, nicht deren Auswirkung.
ist("der Kopf führt keine eigenen Reglerwerte",
  /divergenz_einfach_v1[\s\S]{0,400}tone|rhythm|structure/.test(readFileSync("src/features/einfach.ts", "utf8").slice(0, 200)), false);

// ── 4 · Der Kopf ist ein Umschalter, kein Reiter ────────────────────────────
// Vierzehn Reiter sind genug, und der Nutzungszähler sammelt gerade die Daten
// dazu, welche davon Ballast sind.
wahr("er sitzt im Studio", /wrap\.prepend\(kopf\)/.test(q));
ist("und ist kein eigener Reiter",
  /\["Einfach", mount/.test(readFileSync("src/ui/app.ts", "utf8")), false);

// ── Ergebnis ────────────────────────────────────────────────────────────────
console.log(`Prüfstand einfacher Kopf — ${geprueft} Prüfungen:`);
zeilen.forEach((z) => console.log(z));
const proc = globalThis as unknown as { process?: { exit: (c: number) => void } };
if (fails.length) {
  console.error(`\n❌ ${fails.length} Fehler im einfachen Kopf:`);
  fails.forEach((f) => console.error("  - " + f));
  proc.process?.exit(1);
} else {
  console.log(`\n✅ Einfacher Kopf: alle ${geprueft} Prüfungen bestanden.`);
}
