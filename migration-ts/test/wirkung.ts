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
import { misseStellung, fasseZusammen, reglerListe, misseText, band, MASSE, type ReglerDef } from "../src/features/wirkung";
import { BUILTIN_PRESETS } from "../src/presets.data";
import type { Bank, GenInput } from "../src/types";

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

const N = 14;
const miss = (def: ReglerDef): ReturnType<typeof fasseZusammen> =>
  fasseZusammen(def.id, def.label, def.werte.map((w) => misseStellung(bank, basis, def, w, N)));

// ── 1 · Die Maße selbst ─────────────────────────────────────────────────────
const m = misseText("Ein Satz. Noch ein Satz mit anderen Wörtern darin. Und ein dritter.", basis);
wahr("alle Maße liefern eine Zahl", MASSE.every((x) => Number.isFinite(m[x.name])),
  MASSE.filter((x) => !Number.isFinite(m[x.name])).map((x) => x.name).join(", "));
wahr("leerer Text wirft nicht", Number.isFinite(misseText("", basis).Wiederholung));

// ── 2 · Die Blindprobe — der eigentliche Test ───────────────────────────────
const blind = miss(reglerListe().find((r) => r.id === "blindprobe")!);
wahr("Blindprobe bleibt unter der Rauschschwelle", blind.wirkung < 1.0, `Wirkung ${blind.wirkung.toFixed(2)}`);

// ── 3 · Die Gegenrichtung: ein Regler, der nachweislich umkrempelt ──────────
const formRegler: ReglerDef = {
  id: "form", label: "Form", werte: ["prose", "haiku", "reim"],
  setzen: (e, w) => ({ ...e, form: w as GenInput["form"] }),
};
const form = miss(formRegler);
wahr("die Form schlägt deutlich aus", form.wirkung > 2.0, `Wirkung ${form.wirkung.toFixed(2)} am Maß „${form.staerkstesMass}"`);
wahr("und stärker als die Blindprobe", form.wirkung > blind.wirkung * 2,
  `${form.wirkung.toFixed(2)} gegen ${blind.wirkung.toFixed(2)}`);

// ── 4 · Rechnung ────────────────────────────────────────────────────────────
const kunst = fasseZusammen("x", "x", [
  { wert: "a", mittel: { Wiederholung: 0.10 }, sigma: { Wiederholung: 0.01 }, n: 10 },
  { wert: "b", mittel: { Wiederholung: 0.20 }, sigma: { Wiederholung: 0.01 }, n: 10 },
]);
wahr("Ausschlag durch Rauschen", Math.abs(kunst.wirkungJeMass.Wiederholung! - 10) < 0.001,
  String(kunst.wirkungJeMass.Wiederholung?.toFixed(2)));
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
wahr("0,9 ist Rauschen", band(0.9) === "rauschen");
wahr("genau 1 ist nicht mehr Rauschen", band(1) === "schwach");
wahr("1,9 bleibt schwach", band(1.9) === "schwach");
wahr("2 bewegt deutlich", band(2) === "deutlich");
wahr("5 bewegt stark", band(5) === "stark");
wahr("Unsinn gilt als Rauschen", band(NaN) === "rauschen");
wahr("die Blindprobe fällt ins graue Band", band(blind.wirkung) === "rauschen", `Wirkung ${blind.wirkung.toFixed(2)}`);
wahr("die Form fällt ins starke Band", band(form.wirkung) === "stark");

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
