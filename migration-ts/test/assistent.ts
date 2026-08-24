// Prüfstand Preset-Assistent.
//
// Er wird am Quelltext geprüft, nicht am Ablauf: Der Assistent ist ein Dialog
// mit Schrittfolge, und ihn nachzustellen hieße, den halben Browser
// nachzubauen. Was hier zählt, sind die ANGABEN, die er macht — und die stehen
// als Daten im Quelltext.
//
// Anlass: Der Assistent führte durch SIEBEN Listen, die Wortbank hat ACHT. Die
// Motivverwandlungen fehlten; der Editor hatte sie seit 4.292.0, der KI-Auftrag
// seit 4.290.0. Und er nannte GAR KEINE Mengen, während der KI-Auftrag seit
// 4.290.0 am Bestand nachgezählte Zahlen verlangt. Wer von Hand baute, landete
// regelmäßig bei einem Drittel und wusste nicht, warum lange Texte nicht trugen.
import { readFileSync } from "fs";
import { KATEGORIE_VORGABE } from "../src/features/ki";
import { TONE_OPTS } from "../src/generation/optionen";
import { BANK_KEYS } from "../src/constants";

const fails: string[] = [];
const zeilen: string[] = [];
let geprueft = 0;
const ist = (name: string, wert: unknown, soll: unknown): void => {
  geprueft++;
  if (wert === soll) zeilen.push(`  ✓ ${name}`);
  else { zeilen.push(`  ✗ ${name}`); fails.push(`${name}: „${String(wert)}“ — erwartet „${String(soll)}“`); }
};
const wahr = (name: string, b: boolean): void => ist(name, b, true);

const q = readFileSync("src/ui/presetWizard.ts", "utf8");

// ── 1 · Alle acht Listen ────────────────────────────────────────────────────
// Sieben Textkategorien plus die Verwandlungen. Letztere sind KEINE Kategorie —
// ihre Einträge stehen nie im Text —, deshalb tauchen sie in BANK_KEYS nicht
// auf und wurden hier übersehen.
for (const k of BANK_KEYS) {
  wahr(`der Assistent führt durch „${k}"`, new RegExp(`\\["${k}"`).test(q));
}
wahr("und durch die Motivverwandlungen", /"verwandlungen" as BankKey/.test(q) && /Motivverwandlungen/.test(q));
// Gegenprobe: Beim Speichern müssen sie auch ankommen. Der Zusammenbau lief
// über BANK_KEYS — dort stehen sie nicht drin, also fielen sie still heraus.
wahr("und sie werden beim Speichern übernommen", /bank\.verwandlungen = verw\.slice\(\)/.test(q));
// NICHT mit Standard auffüllen: Ein Motivpaar zeigt auf Motive, und geerbte
// Paare zeigen auf fremde. Leer ist ehrlicher als geerbt.
ist("aber nicht mit Standardpaaren aufgefüllt",
  /bank\.verwandlungen = \(DEFAULT_BANK/.test(q), false);

// ── 2 · Die Mengen kommen aus der EINEN Quelle ──────────────────────────────
// Sie hier abzuschreiben hieße, zwei Listen zu führen, die dasselbe meinen —
// daran ist der Autopilot in 4.245.0 gescheitert.
wahr("die Vorgabe wird eingebunden statt abgeschrieben",
  /import \{ KATEGORIE_VORGABE \} from "\.\.\/features\/ki"/.test(q));
wahr("und für die Anweisungen benutzt", /const menge = \(k: string\): string/.test(q));
wahr("die Anzahl steht darin", /v\.anzahl/.test(q));
wahr("die Spanne auch", /v\.min.*v\.max/.test(q));
wahr("und die Wortlänge", /v\.woerter/.test(q));
// Gegenprobe: Keine der Zahlen darf als Zeichenkette im Quelltext stehen —
// dann wäre sie eine Kopie und liefe irgendwann auseinander.
for (const v of KATEGORIE_VORGABE) {
  ist(`„${v.key}": die Anzahl ${v.anzahl} steht nicht abgeschrieben da`,
    new RegExp(`Richtwert: ${v.anzahl}`).test(q), false);
}

// ── 3 · Die Töne ebenfalls aus der einen Quelle ─────────────────────────────
// Die Kopie war zufällig noch identisch. Genau so war es beim Autopiloten auch,
// bis sie es nicht mehr war.
wahr("die Tonliste wird eingebunden", /TONE_OPTS as TON_LISTE.*generation\/optionen/.test(q));
wahr("und nur um einen Leereintrag ergaenzt", /\[\["", "\(kein\)"\], \.\.\.TON_LISTE\]/.test(q));
ist("keine abgeschriebene Tonliste mehr",
  /\["melancholisch", "Melancholisch"\], \["dark"/.test(q), false);
wahr("die Quelle enthält wirklich Töne", TONE_OPTS.length >= 10);

// ── 4 · Die Anweisungen nennen, was gemessen wurde ──────────────────────────
// Vorher stand bei den Motiven „3–8 Wörter, ohne Punkt am Ende" — das ist die
// alte Regel. Gemessen entscheidet die FORM: Nominalphrase mit Artikel und
// eigenem Kopf. Bruchstücke ohne Kopf ließen den Zusammenbau in 33 von 60
// Läufen mitten im Text abbrechen.
wahr("Motive verlangen einen eigenen Kopf", /Nominalphrase mit Artikel und eigenem Kopf/.test(q));
wahr("und die Folge wird genannt", /33 von 60/.test(q));
ist("die alte Wortzahl-Regel ist weg", /3–8 Wörter/.test(q), false);
wahr("Requisiten stehen im Akkusativ", /unbestimmtem Artikel im Akkusativ/.test(q));
wahr("Einsaetze beginnen mit der festen Wendung", /Der Einsatz ist/.test(q));
wahr("die Verwandlungen erklären die Pfeilform", /Telegramm|Pfeil|→/.test(q));

// ── 5 · Der Richtwert am Ende ───────────────────────────────────────────────
// Kein Zwang, aber eine Auskunft: Wer ein kleines Preset baut, soll wissen,
// dass es lange Texte nicht trägt.
wahr("die Wortzahl wird mitgezählt", /woerter = BANK_KEYS\.reduce/.test(q));
wahr("und gegen den Richtwert gehalten", /850 Wörter/.test(q));
wahr("die Meldung warnt, ohne zu sperren", /Speichern geht trotzdem/.test(q));
const soll = KATEGORIE_VORGABE.filter((x) => x.key !== "verwandlungen").reduce((n, x) => n + x.anzahl, 0);
wahr(`der Richtwert summiert sich auf ${soll} Einträge`, soll >= 120 && soll <= 130);

// ── Ergebnis ────────────────────────────────────────────────────────────────
console.log(`Prüfstand Preset-Assistent — ${geprueft} Prüfungen:`);
zeilen.forEach((z) => console.log(z));
const proc = globalThis as unknown as { process?: { exit: (c: number) => void } };
if (fails.length) {
  console.error(`\n❌ ${fails.length} Fehler im Preset-Assistenten:`);
  fails.forEach((f) => console.error("  - " + f));
  proc.process?.exit(1);
} else {
  console.log(`\n✅ Preset-Assistent: alle ${geprueft} Prüfungen bestanden.`);
}
