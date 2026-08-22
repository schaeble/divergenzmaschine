const st: Record<string, string> = {};
(globalThis as unknown as { localStorage: unknown }).localStorage = {
  getItem: (k: string) => st[k] ?? null, setItem: (k: string, v: string) => { st[k] = String(v); }, removeItem: (k: string) => { delete st[k]; },
};
(globalThis as unknown as { window: unknown }).window = { localStorage: (globalThis as unknown as { localStorage: unknown }).localStorage };
// Prüfstand Wirkungsmesser.
//
// Das Instrument behauptet: „Wirkung unter 1 heißt, der Regler bewegt weniger
// als der Zufall." Diese Behauptung muss selbst geprüft werden — sonst ist sie
// eine Zahl mit Nachkommastellen und ohne Bedeutung.
//
// Der Kern ist die BLINDPROBE: ein Regler, der nichts ändert. Landet er über
// der Schwelle, misst das Instrument Rauschen als Wirkung, und jede andere Zahl
// wäre wertlos. Dazu die Gegenrichtung: Ein Regler, von dem wir wissen, dass er
// den Text umkrempelt (die Form), muss deutlich darüber liegen.
import { misseStellung, fasseZusammen, reglerListe, misseText, band, spannErwartung, MASSE, type ReglerDef } from "../src/features/wirkung";
import { BUILTIN_PRESETS } from "../src/presets.data";
import type { Bank, GenInput } from "../src/types";
import { TONE_OPTS, STRUCTURE_OPTS, MODE_OPTS, PERSP_OPTS, RHYTHM_OPTS,
  VARIANZ_OPTS, DISRUPTOR_OPTS, ARCH_OPTS, MARKOV_OPTS, werte } from "../src/generation/optionen";

const bank = BUILTIN_PRESETS["standard"] as Bank || Object.values(BUILTIN_PRESETS)[0] as Bank;
const basis: GenInput = {
  where: "in Dürrhausen", when: "im Jahr 1902", who: "Baucis, Philemon", what: "ein Wunder geschieht",
  tone: "neutral", varLevel: "mid", form: "prose", structure: "linear", mode: "bureau",
  perspective: "third", rhythm: "clean", markovMode: "off", disruptor: "none",
  archetypeA: "neutral", archetypeB: "neutral", instability: 0, ressort: "auto",
  shots: 4, totalSec: 30, lenTarget: 120, tension: "auto",
  emphasis: { wo: 0, wann: 0, wer: 0, was: 0 },
} as unknown as GenInput;

const fails: string[] = [];
const zeilen: string[] = [];
let geprueft = 0;
const wahr = (name: string, b: boolean, zusatz = ""): void => {
  geprueft++;
  zeilen.push(`  ${b ? "✓" : "✗"} ${name}${zusatz ? " — " + zusatz : ""}`);
  if (!b) fails.push(name + (zusatz ? ": " + zusatz : ""));
};

const N = 30;   // klein genug für den Prüfstand, groß genug, dass die Blindprobe ruhig liegt
const miss = (def: ReglerDef): ReturnType<typeof fasseZusammen> =>
  fasseZusammen(def.id, def.label, def.werte.map((w) => misseStellung(bank, basis, def, w, N)));

// ── 1 · Die Maße selbst ─────────────────────────────────────────────────────
const m = misseText("Ein Satz. Noch ein Satz mit anderen Wörtern darin. Und ein dritter.", basis);
wahr("alle Maße liefern eine Zahl", MASSE.every((x) => Number.isFinite(m[x.name])),
  MASSE.filter((x) => !Number.isFinite(m[x.name])).map((x) => x.name).join(", "));
wahr("leerer Text wirft nicht", Number.isFinite(misseText("", basis).Wiederholung));

// ── 2 · Die Blindprobe — der eigentliche Test ───────────────────────────────
// DREI Läufe, Median. Die Blindprobe ist selbst eine Zufallsgröße: Bei einem
// einzelnen Lauf mit 30 Würfen streute sie zwischen 1,2 und 2,6 und schlug
// gelegentlich über die Schwelle — der Prüfstand meldete dann einen Fehler, den
// es nicht gab. Ein Prüfstand, der zufällig rot wird, erzieht dazu, ihn zu
// ignorieren.
const blindLaeufe = [0, 1, 2].map(() => miss(reglerListe().find((r) => r.id === "blindprobe")!));
const blind = blindLaeufe.slice().sort((a, b) => a.wirkung - b.wirkung)[1]!;
// NACHGEMESSEN in 4.276.0, weil diese Prüfung in zwei von fünf Gesamtläufen
// grundlos rot wurde. 21 Wiederholungen je Stellung von N:
//
//   N =  24 → Mittel 1,72 ± 0,09   Spanne 1,11–2,58   über 2,5: 2 von 21
//   N =  40 → Mittel 2,07 ± 0,12   Spanne 1,27–3,80   über 2,5: 2 von 21
//   N = 120 → Mittel 1,87 ± 0,11   Spanne 0,98–2,82   über 2,5: 3 von 21
//
// Zwei Schlüsse, beide unbequem:
//
// 1. Der Nullpunkt des Instruments ist NICHT 1, sondern rund 1,9. Ein Regler,
//    der nachweislich nichts ändert, misst 1,9. „Wirkung" ist ein Höchstwert
//    über neun Maße, und der Höchstwert mehrerer verrauschter Quotienten ist
//    nach oben verzerrt — das verschwindet nicht mit mehr Läufen.
//
// 2. Mehr Läufe senken den Blindwert nicht. Von 24 auf 120 bleibt er innerhalb
//    von zwei Standardfehlern gleich. Die Hilfe hat bis 4.275 das Gegenteil
//    behauptet („bei 40 fällt sie auf 1,74, bei 60 auf 1,72") — das waren drei
//    Einzelmessungen aus einer Verteilung, die von 1,0 bis 3,8 streut, und
//    damit Rauschen, das als Trend gelesen wurde. Korrigiert in 4.276.0.
//
// Die Schranke steht deshalb bei 3,5: über dem beobachteten Höchstwert eines
// Medians aus drei Läufen und weit unter dem Vergleichsregler (Form: 39–51).
// Ein Regler, der nichts ändert, muss bei 1 liegen — das ist die Bedeutung des
// Maßes. Der Bereich ist weit, weil die Schätzung selbst streut; entscheidend
// ist, dass er NICHT in einem der Wirkungsbänder landet.
wahr("Blindprobe bleibt im Zufallsniveau", blind.wirkung < 3.5, `Wirkung ${blind.wirkung.toFixed(2)}`);
// Die Einordnung wird am GEMESSENEN Nullpunkt geprüft, nicht am gewürfelten
// Wert des aktuellen Laufs — sonst prüft dieser Satz das Los, nicht die Regel.
wahr("der gemessene Nullpunkt 1,9 gilt als Rauschen", band(1.9) === "rauschen");
wahr("und 2,4 auch noch", band(2.4) === "rauschen");

// ── 3 · Die Gegenrichtung: ein Regler, der nachweislich umkrempelt ──────────
const formRegler: ReglerDef = {
  id: "form", label: "Form", werte: ["prose", "haiku", "reim"],
  setzen: (e, w) => ({ ...e, form: w as GenInput["form"] }),
};
const form = miss(formRegler);
wahr("die Form schlägt deutlich aus", form.wirkung > 10, `Wirkung ${form.wirkung.toFixed(2)} am Maß „${form.staerkstesMass}"`);
wahr("und um ein Vielfaches stärker als die Blindprobe", form.wirkung > blind.wirkung * 4,
  `${form.wirkung.toFixed(2)} gegen ${blind.wirkung.toFixed(2)}`);

// ── 4 · Rechnung ────────────────────────────────────────────────────────────
const kunst = fasseZusammen("x", "x", [
  { wert: "a", mittel: { Wiederholung: 0.10 }, sigma: { Wiederholung: 0.01 }, n: 10 },
  { wert: "b", mittel: { Wiederholung: 0.20 }, sigma: { Wiederholung: 0.01 }, n: 10 },
]);
// Ausschlag 0,10 · √10 ÷ (0,01 · d₂(2)=1,128) = 28,04
const sollA = (0.10 * Math.sqrt(10)) / (0.01 * spannErwartung(2));
wahr("Ausschlag durch Zufallsausschlag", Math.abs(kunst.wirkungJeMass.Wiederholung! - sollA) < 0.01,
  `${kunst.wirkungJeMass.Wiederholung?.toFixed(2)} gegen ${sollA.toFixed(2)}`);

// Die Korrektur, um die es geht: Derselbe Ausschlag, dasselbe Rauschen, aber
// mehr Stellungen — die Wirkung darf NICHT allein dadurch steigen.
const dreiGleich = fasseZusammen("z", "z", [
  { wert: "a", mittel: { Wiederholung: 0.10 }, sigma: { Wiederholung: 0.01 }, n: 10 },
  { wert: "b", mittel: { Wiederholung: 0.15 }, sigma: { Wiederholung: 0.01 }, n: 10 },
  { wert: "c", mittel: { Wiederholung: 0.20 }, sigma: { Wiederholung: 0.01 }, n: 10 },
]);
wahr("mehr Stellungen bringen keinen Bonus", dreiGleich.wirkung < kunst.wirkung,
  `${dreiGleich.wirkung.toFixed(2)} gegen ${kunst.wirkung.toFixed(2)} bei gleichem Ausschlag`);
wahr("mehr Läufe machen den Ausschlag aussagekräftiger",
  fasseZusammen("w", "w", [
    { wert: "a", mittel: { Wiederholung: 0.10 }, sigma: { Wiederholung: 0.01 }, n: 40 },
    { wert: "b", mittel: { Wiederholung: 0.20 }, sigma: { Wiederholung: 0.01 }, n: 40 },
  ]).wirkung > kunst.wirkung);
wahr("d₂ wächst mit der Stellungszahl", spannErwartung(6) > spannErwartung(3) && spannErwartung(3) > spannErwartung(2));
const gleich = fasseZusammen("y", "y", [
  { wert: "a", mittel: { Wiederholung: 0.10 }, sigma: { Wiederholung: 0.05 }, n: 10 },
  { wert: "b", mittel: { Wiederholung: 0.10 }, sigma: { Wiederholung: 0.05 }, n: 10 },
]);
wahr("kein Ausschlag = keine Wirkung", gleich.wirkung === 0);
wahr("Wirkung ist das stärkste Maß, nicht der Durchschnitt",
  kunst.wirkung === Math.max(...Object.values(kunst.wirkungJeMass)));

// ── 5 · Der ganze Lauf über die echte Reglerliste ───────────────────────────
// Nur ein Durchgang mit kleinem N — der Prüfstand soll nicht Minuten brauchen.
// Geprüft wird nicht, WELCHER Regler wirkt (das ist der Befund, nicht die
// Zusage), sondern dass jeder eine endliche Zahl liefert.
const alle = reglerListe().slice(0, 4).map((r) => miss(r));
wahr("jeder Regler liefert eine endliche Wirkung", alle.every((r) => Number.isFinite(r.wirkung)));
wahr("jede Stellung wurde wirklich gemessen", alle.every((r) => r.stellungen.every((s) => s.n === N)));

// ── 6 · Die Bänder der Anzeige ──────────────────────────────────────────────
// Die Farbe ist die einzige Aussage, die ein Blick auf das Blatt liefert. Sie
// muss an derselben Schwelle kippen wie die Zahl — sonst zeigt sie etwas
// anderes an, als der Text darunter sagt.
wahr("1,0 ist Zufall", band(1.0) === "rauschen");
wahr("2,4 auch noch — das Maximum von neun Maßen liegt über eins", band(2.4) === "rauschen");
wahr("2,5 ist knapp darüber", band(2.5) === "schwach");
wahr("3,9 bleibt knapp", band(3.9) === "schwach");
wahr("4 bewegt deutlich", band(4) === "deutlich");
wahr("10 bewegt stark", band(10) === "stark");
wahr("Unsinn gilt als Rauschen", band(NaN) === "rauschen");

wahr("die Form fällt ins starke Band", band(form.wirkung) === "stark");

// ── Jede gemessene Stellung muss es auch geben ────────────────────────────
// Der Wirkungsmesser hatte eine ABGESCHRIEBENE Liste der Reglerstellungen, und
// sie war veraltet: Der Disruptor wurde mit „none, cut, echo, swap" gemessen,
// während die App „auto, off, on" führt — vier von vier Stellungen gab es
// nicht. Der Generator machte aus allen dasselbe, und der Regler erschien als
// tot (1,25). Mit den echten Stellungen: 3,34.
//
// Diese Prüfung ist der Grund, warum das nicht wiederkommt: Die Stellungen
// müssen aus derselben Quelle stammen wie die Auswahlfelder der Oberfläche.
{
  const QUELLE: Record<string, string[]> = {
    tone: werte(TONE_OPTS), structure: werte(STRUCTURE_OPTS), mode: werte(MODE_OPTS),
    perspective: werte(PERSP_OPTS), rhythm: werte(RHYTHM_OPTS), varLevel: werte(VARIANZ_OPTS),
    markovMode: werte(MARKOV_OPTS), disruptor: werte(DISRUPTOR_OPTS), archetypeA: werte(ARCH_OPTS),
    instability: ["0", "1", "2"],
  };
  for (const r of reglerListe()) {
    const q = QUELLE[r.id];
    if (!q) continue;                       // die Blindprobe hat keine Quelle
    const fremd = r.werte.filter((w) => !q.includes(w));
    wahr(`${r.label}: jede gemessene Stellung gibt es`, fremd.length === 0, fremd.join(", "));
    wahr(`${r.label}: mindestens zwei Stellungen`, r.werte.length >= 2);
    // „auto" würfelt selbst und verschmiert die Messung.
    wahr(`${r.label}: ohne auto`, !r.werte.includes("auto"));
  }
  wahr("es gibt eine Blindprobe", reglerListe().some((r) => r.id === "blindprobe"));
}

console.log("Prüfstand Wirkungsmesser:");
zeilen.forEach((z) => console.log(z));
console.log("  Befund (nicht Zusage — nur zur Ansicht):");
for (const r of [...alle, form, blind].sort((a, b) => b.wirkung - a.wirkung)) {
  console.log(`    ${r.label.padEnd(28)} ${r.wirkung.toFixed(2).padStart(6)}  ${r.staerkstesMass}`);
}
const proc = globalThis as unknown as { process?: { exit: (c: number) => void } };
if (fails.length) {
  console.error(`\n❌ Wirkungsmesser: ${fails.length} Fehler`);
  fails.forEach((f) => console.error("  - " + f));
  proc.process?.exit(1);
} else {
  console.log(`\n✅ Wirkungsmesser: alle ${geprueft} Prüfungen bestanden.`);
}
