const st: Record<string, string> = {};
(globalThis as unknown as { localStorage: unknown }).localStorage = {
  getItem: (k: string) => st[k] ?? null, setItem: (k: string, v: string) => { st[k] = String(v); }, removeItem: (k: string) => { delete st[k]; },
};
(globalThis as unknown as { window: unknown }).window = { localStorage: (globalThis as unknown as { localStorage: unknown }).localStorage };
// Prüfstand für die Gattung „Fabel" (4.377.0).
//
// Die Zusage der Fabel: Die Lehre folgt aus der Handlung. `pruefeFabel()` liest
// das Schema aus dem Text, nicht aus dem Blatt — die Gegenproben setzen eine
// fremde Lehre unter eine Handlung und erwarten Rot.
import { buildFabel, pruefeFabel, fabelTitel, fabelTitelAusText, erkenneTiere, erkenneLehre, SCHEMATA, TIERE } from "../src/generation/fabel";
import { grammarFlags } from "../src/generation/grammar";
import { buildStory } from "../src/generation/buildStory";
import { BUILTIN_PRESETS } from "../src/presets.data";
import type { GenInput } from "../src/types";

const fehler: string[] = [];
const soll = (ok: boolean, was: string): void => { if (!ok) fehler.push(was); };

// ── 1 · Erkennung ───────────────────────────────────────────────────────────
soll(erkenneTiere("der Löwe und die Maus").map((t) => t.nomen).join() === "Löwe,Maus", "Tiere: Löwe und Maus");
soll(erkenneTiere("Rabe, Fuchs").map((t) => t.nomen).join() === "Rabe,Fuchs", "Tiere: Reihenfolge der Eingabe");
soll(erkenneTiere("Elefant").length === 0, "Tiere: unbekanntes Tier");
soll(erkenneLehre("Wie du mir, so ich dir.")?.id === "teller", "Lehre: Wie du mir");
soll(erkenneLehre("Hochmut kommt vor dem Fall")?.id === "wettlauf", "Lehre: Hochmut");
soll(erkenneLehre("Alle tragen Hüte") === null, "Lehre: unbekannt");
// Jedes Schema hat für beide Rollen mindestens ein Tier.
for (const s of SCHEMATA) {
  soll(TIERE.some((t) => t.eigen.includes(s.rolleA)) && TIERE.some((t) => t.eigen.includes(s.rolleB)), `Schema ${s.id}: Rolle ohne Tier`);
}
// Schwache Nomen tragen -(e)n.
const loewe = TIERE.find((t) => t.nomen === "Löwe")!;
soll(loewe.akk === "den Löwen" && loewe.dat === "dem Löwen", `Löwe schwach: ${loewe.akk}/${loewe.dat}`);

// ── 2 · Matrix ──────────────────────────────────────────────────────────────
const WO = ["", "am Rand eines Waldes", "in der Wüste", "Velmar"];
const WER = ["", "Fuchs, Rabe", "Rabe, Fuchs", "der Löwe und die Maus", "Hase", "Igel, Hase", "Elefant", "Fuchs, Lamm", "Storch", "eine Ameise und eine Grille"];
const WAS = ["", "Wie du mir, so ich dir.", "Wer Schmeicheleien glaubt, bezahlt dafür.", "Hochmut kommt vor dem Fall", "Alle tragen Hüte", "Verachte niemanden, weil er klein ist!"];
const TOENE = ["uplifting", "dark", "ironisch", "nuechtern"];
const IDS = Object.keys(BUILTIN_PRESETS);
const funde = new Map<string, number>();
const beispiel = new Map<string, string>();
const jeSchema: Record<string, number> = {};
let laeufe = 0;
for (let wdh = 0; wdh < 5; wdh++) for (const where of WO) for (const who of WER) for (const what of WAS) for (const tone of TOENE) {
  const bank = BUILTIN_PRESETS[IDS[laeufe % IDS.length]!]!;
  const r = buildFabel({ where, when: "", who, what, tone, form: "prose", lenTarget: laeufe % 2 ? 300 : 110 } as GenInput, bank);
  laeufe++;
  jeSchema[r.fb.schema.id] = (jeSchema[r.fb.schema.id] || 0) + 1;
  const befunde = pruefeFabel(r.text, r.fb, bank);
  const g = grammarFlags(r.text.replace(/(?<!\p{L})(der|die|das|den|dem) \1(?!\p{L})/giu, "$1"));
  const echte = g.issues.filter((x) => !/^Verb-Kollision/.test(x));
  if (echte.length) befunde.push("Grammatik-Melder: " + echte.join("; "));
  if (fabelTitelAusText(r.text) !== fabelTitel(r.fb)) befunde.push("Titel aus dem Text weicht ab");
  // Vorrang: Eine erkannte Lehre steht wörtlich da; eine unerkannte nicht.
  const lehre = erkenneLehre(what);
  if (lehre && !r.text.includes(what.replace(/[.!?]$/, "").slice(1))) befunde.push("Erkannte Lehre fehlt im Text");
  if (what && !lehre && r.text.includes(what.slice(1))) befunde.push("Unerkannte Lehre steht trotzdem im Text");
  // Vorrang: Passen die eingetragenen Tiere, spielen genau sie.
  if (r.fb.tiereAusEingabe) for (const t of erkenneTiere(who).slice(0, 2)) if (![r.fb.a, r.fb.b].includes(t)) befunde.push("Eingetragenes Tier fehlt");
  for (const b of befunde) {
    const art = b.replace(/„[^"“]*["“]/g, "„…“").replace(/: .*$/, "");
    funde.set(art, (funde.get(art) || 0) + 1);
    if (!beispiel.has(art)) beispiel.set(art, `${b} ← ${JSON.stringify({ where, who, what, tone })}`);
  }
}
soll(Object.keys(jeSchema).length === SCHEMATA.length, `Nicht alle Schemata erreicht: ${Object.keys(jeSchema).join(",")}`);
// Weiche
const basis = { where: "", when: "", who: "Fuchs, Rabe", what: "", tone: "uplifting", varLevel: "mid", structure: "rekombination", mode: "auto", perspective: "auto", rhythm: "auto", markovMode: "off", disruptor: "off", archetypeA: "neutral", archetypeB: "neutral", instability: 0, lenTarget: 150 } as unknown as GenInput;
soll(/^Ein Fuchs und ein Rabe lebten/.test(buildStory(BUILTIN_PRESETS["gaia"]!, { ...basis, form: "prose", welt: "fabel" })), "Weiche: Gattung Fabel baut keine Fabel");

// ── 3 · Gegenproben ─────────────────────────────────────────────────────────
const gegen: string[] = [];
let gegenFehler = 0;
let r0 = buildFabel({ where: "", when: "", who: "der Löwe und die Maus", what: "", tone: "uplifting", form: "prose", lenTarget: 300 } as GenInput, BUILTIN_PRESETS["gaia"]!);
const t0 = r0.text, fb0 = r0.fb, bank0 = BUILTIN_PRESETS["gaia"]!;
const probe = (name: string, text: string, muster: RegExp, bank: typeof bank0 | undefined = bank0): void => {
  const ok = pruefeFabel(text, fb0, bank).some((x) => muster.test(x));
  gegen.push(`    ${ok ? "✓" : "✗"} ${name}`);
  if (!ok) gegenFehler++;
};
const sauber = pruefeFabel(t0, fb0, bank0);
gegen.push(`    ${sauber.length ? "✗" : "✓"} Ausgangstext ohne Befund${sauber.length ? ": " + sauber.join("; ") : ""}`);
if (sauber.length) gegenFehler++;
const fremd = SCHEMATA.find((s) => s.id === "kaese")!.lehre[0]!;
probe("Lehre aus fremder Fabel", t0.replace(fb0.lehre, fremd), /Lehre aus der Fabel „Käse"/);
probe("Lehre fehlt", t0.split("\n\n").slice(0, 3).join("\n\n"), /Lehre steht nicht|Nicht vier/);
probe("Wende entfernt (Handlung unbestimmt)", t0.replace(/Wenige Tage später[^.]+\./, "Dann geschah nichts."), /keinem Schema/);
probe("Schwaches Nomen falsch gebeugt", t0.replace("den Löwen", "den Löwe").replace(/\n\n/, " Alle fürchteten den Löwe.\n\n"), /Falscher Fall/);
probe("Tier nicht eingeführt", t0.replace(/^Ein Löwe/, "Ein Tier"), /Löwe nicht eingeführt/);
probe("Motiv aus fremdem Preset", t0, /nicht aus dem Preset/, BUILTIN_PRESETS["kafka"]!);
probe("Motiv entfernt", t0.replace(/Nicht weit davon: [^.]+\. /, ""), /Preset ohne Wirkung/);
probe("Platzhalter", t0.replace("Der Löwe", "{Ac}"), /Platzhalter/);
probe("Doppeltes Wort", t0.replace(" und ", " und und "), /Doppeltes Wort/);
// Rollen: ein Tier in einer Rolle, deren Eigenschaft es nicht hat.
{
  const lamm = TIERE.find((t) => t.nomen === "Lamm")!;
  const ok = pruefeFabel(t0, { ...fb0, b: lamm }, bank0).some((x) => /Eigenschaft/.test(x));
  gegen.push(`    ${ok ? "✓" : "✗"} Tier ohne die Eigenschaft seiner Rolle`);
  if (!ok) gegenFehler++;
}

// ── Ergebnis ────────────────────────────────────────────────────────────────
console.log(`Prüfstand Fabel: ${laeufe} Läufe (5 × 4 Wo × 10 Wer × 6 Was × 4 Töne, 51 Presets reihum)`);
console.log(`  Schemata: ${Object.entries(jeSchema).map(([k, v]) => `${k} ${v}`).join(", ")}`);
if (funde.size) {
  console.log("  Befunde:");
  for (const [art, n] of [...funde.entries()].sort((a, b) => b[1] - a[1])) {
    console.log(`    ${String(n).padStart(5)}×  ${art}`);
    console.log(`           ${beispiel.get(art)}`);
  }
} else console.log("  keine Fehlerklasse ausgelöst");
console.log("  Gegenproben:");
gegen.forEach((z) => console.log(z));
fehler.forEach((f) => console.log(`  - ${f}`));
const proc = globalThis as unknown as { process?: { exit: (c: number) => void } };
const summe = [...funde.values()].reduce((a, b) => a + b, 0);
if (summe || gegenFehler || fehler.length) {
  console.error(`\n❌ Fabel: ${summe} Befund(e) in ${laeufe} Läufen, ${gegenFehler} Gegenprobe(n) ohne Wirkung, ${fehler.length} Einzelprüfung(en) rot.`);
  proc.process?.exit(1);
} else {
  console.log(`\n✅ Fabel: ${laeufe} Läufe ohne Befund, alle Gegenproben schlagen an.`);
}
