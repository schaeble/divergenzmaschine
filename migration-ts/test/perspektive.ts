// Prüfstand Perspektive: Was die Einstellung „Perspektive" wirklich mit dem
// Text macht.
//
// Anlass: Ausgabe Nr. 40. Der Aufmacher begann mit „(das Objekt) Ein Augenblick
// dauert eine ganze Straße …". Die Perspektive „Objekt" setzte eine
// Regieanweisung vor jeden Absatz, statt eine Perspektive zu erzeugen — und der
// Zeitungssetzer nahm den ersten Satz als Überschrift, also stand das Etikett
// fett auf der Seite.
//
// Geprüft wird deshalb: Es steht kein Etikett im Text, das Ding hat einen Namen
// mit Artikel, und die anderen Perspektiven liefern weiterhin Text.
{
  const g = globalThis as unknown as { localStorage?: Storage };
  if (typeof g.localStorage === "undefined") {
    const m: Record<string, string> = {};
    g.localStorage = { getItem: (k: string) => (k in m ? m[k]! : null), setItem: (k: string, v: string) => { m[k] = String(v); },
      removeItem: (k: string) => { delete m[k]; }, clear: () => { for (const k of Object.keys(m)) delete m[k]; },
      key: () => null, length: 0 } as unknown as Storage;
  }
}
import { buildStory } from "../src/generation/buildStory";
import { applyPerspective, objektName, OBJEKT_EINSTIEG } from "../src/generation/shape";
import { BUILTIN_PRESETS } from "../src/presets.data";
import type { Bank, GenInput } from "../src/types";
import { MODE_DATA } from "../src/modes.data";
import { NOUN_GENDER } from "../src/generation/nouns.data";

const fails: string[] = [];
let geprueft = 0, bestanden = 0;
const ist = (name: string, wert: unknown, soll: unknown): void => {
  geprueft++;
  if (wert === soll) bestanden++; else fails.push(`${name}: „${String(wert)}“ — erwartet „${String(soll)}“`);
};
const wahr = (name: string, b: boolean): void => ist(name, b, true);

// ── 1 · Der Name des Dings ─────────────────────────────────────────────────
// „Ich bin Prozess." stand so im Text. Ein Ding ohne Artikel klingt wie ein
// Fehler, weil es einer ist.
ist("Antrag wird zu der Antrag", objektName("Antrag"), "der Antrag");
ist("Akte wird zu die Akte", objektName("Akte"), "die Akte");
ist("Fenster wird zu das Fenster", objektName("Fenster"), "das Fenster");
ist("ein vorhandener Artikel bleibt", objektName("die Wartemarke"), "die Wartemarke");
ist("und ohne Wort bleibt ein Ding übrig", objektName(""), "das Ding");
wahr("ein unbekanntes Wort bekommt trotzdem einen Artikel",
  /^(der|die|das) Zwirbelgerät$/.test(objektName("Zwirbelgerät")));

// Die Endungsregel raet — bei „Frist" riet sie maskulin, bei „Beweis" neutrum.
// Deshalb muss JEDES Wort, das diese Perspektive benutzen kann, ein
// eingetragenes Geschlecht haben. Diese Prüfung schlägt an, sobald jemand dem
// Realitätsmodus ein Nomen hinzufügt, ohne es einzutragen.
{
  const ohne: string[] = [];
  for (const k of Object.keys(MODE_DATA)) for (const n of MODE_DATA[k]!.nouns) {
    if (!NOUN_GENDER[n.toLowerCase()]) ohne.push(n);
  }
  ist("jedes Modus-Nomen hat ein eingetragenes Geschlecht", ohne.join(", "), "");
  ist("Frist ist feminin, nicht maskulin", objektName("Frist"), "die Frist");
  ist("Beweis ist maskulin, nicht neutrum", objektName("Beweis"), "der Beweis");
}

// ── 2 · Die reine Regel, ohne Textmaschine ─────────────────────────────────
{
  const raus = applyPerspective(["Die Archivarin sucht die Akte.", "Der Flur ist leer."], "object", "die Archivarin", "Stempel");
  wahr("das Ding stellt sich vor", /^Ich bin der Stempel\./.test(raus[0] || ""));
  wahr("und der erste Absatz steht dahinter", (raus[0] || "").includes("Die Archivarin sucht die Akte."));
  ist("der zweite Absatz bleibt unangetastet", raus[1], "Der Flur ist leer.");
  wahr("kein Etikett in Klammern", !raus.some((p) => /^\s*\(/.test(p)));
  // Der Körper bleibt in der dritten Person: Ein Ding, das von Menschen erzählt,
  // tut das so. Jede andere Fassung müsste jedes Verb umbeugen.
  wahr("die Figur bleibt in der dritten Person", (raus[0] || "").includes("Die Archivarin sucht"));
}
{
  const raus = applyPerspective(["A.", "B.", "C.", "D.", "E."], "split", "die Archivarin", "Stempel");
  wahr("auch im Wechsel steht kein Etikett", !raus.some((p) => /^\s*\(/.test(p)));
  wahr("aber das Ding meldet sich kurz",
    raus.some((p) => /^Ich (sehe zu|liege dabei|zähle mit|rühre mich nicht|habe Zeit|merke es mir)\./.test(p)));
}

// ── 3 · Am fertigen Text, über beide Bauwege ───────────────────────────────
// Der Rekombinationsweg hatte eine eigene Zeile mit demselben Fehler — dort
// stand das Wort „das Objekt" fest im Programm.
const ids = Object.keys(BUILTIN_PRESETS);
const basis = {
  where: "im Archiv", when: "am Morgen", who: "die Archivarin", what: "sucht eine Akte",
  tone: "nuechtern", form: "prose", lenTarget: 180, tension: "auto", cast: "auto",
  mode: "bureau", rhythm: "auto", disruptor: "off", instability: 0, markovMode: "off",
  varLevel: "wild", archetypeA: "neutral", archetypeB: "neutral",
} as unknown as GenInput;

let etikett = 0, wortObjekt = 0, ohneRahmen = 0, ohneArtikel = 0, nichtVorn = 0, ohneZweiten = 0;
// Aus der Quelle, nicht abgeschrieben: Eine Kopie der Liste veraltet stumm.
const RAHMEN_ZWEI = OBJEKT_EINSTIEG.map((r) => r.split(". ").slice(1).join(". "));
const LAEUFE = 60;
for (let i = 0; i < LAEUFE; i++) {
  const bank = BUILTIN_PRESETS[ids[i % ids.length]!] as Bank;
  const t = buildStory(bank, { ...basis, perspective: "object",
    structure: i % 2 ? "rekombination" : "linear" } as GenInput);
  if (/\((?:das Objekt|der |die |das )[^)]{0,40}\)/.test(t)) etikett++;
  if (/\bdas Objekt\b/.test(t)) wortObjekt++;
  // Der Rahmen darf durch die Satzlängen-Zusammenziehung gebunden werden
  // („… — ich bin die Akte"), verschwinden darf er nicht.
  if (!/[Ii]ch bin (der|die|das) /.test(t)) ohneRahmen++;
  if (/[Ii]ch bin (?!der |die |das )[A-ZÄÖÜ]/.test(t)) ohneArtikel++;
  // Der Zeitungssetzer baut die Überschrift aus dem Textanfang. Steht die
  // Ton-Einleitung davor, wird der Rahmen mitten im Satz abgeschnitten —
  // genau das war in Ausgabe Nr. 40 zu sehen.
  if (!/^Ich bin (der|die|das) /.test(t)) nichtVorn++;
  // Er darf gebunden werden („… — ich liege hier"), verschwinden darf er nicht.
  if (!RAHMEN_ZWEI.some((r) => t.includes(r) || t.includes(r.charAt(0).toLowerCase() + r.slice(1)))) ohneZweiten++;
}
ist("kein Etikett in Klammern in 60 Texten", etikett, 0);
// Ausgabe Nr. 41: Der zweite Rahmensatz fehlte in 3 bis 5 von 40 Texten, an
// seiner Stelle stand die Ton-Einleitung. Ursache war NICHT die Perspektive,
// sondern der Bruchstück-Filter in coherencePass: „Ich liege hier und zähle
// mit." endet auf „mit" und galt damit als abgeschnitten.
ist("und der zweite Rahmensatz überlebt", ohneZweiten, 0);
ist("und der Rahmen steht ganz vorn, vor der Ton-Einleitung", nichtVorn, 0);
ist("und das Wort „das Objekt“ steht nirgends mehr", wortObjekt, 0);
ist("jeder Text nennt sein Ding", ohneRahmen, 0);
ist("und immer mit Artikel", ohneArtikel, 0);

// Die übrigen Perspektiven liefern weiterhin Text — die Änderung sollte sie
// nicht anfassen.
for (const p of ["third", "first", "second", "we", "split"]) {
  const bank = BUILTIN_PRESETS[ids[0]!] as Bank;
  const t = buildStory(bank, { ...basis, perspective: p, structure: "rekombination" } as GenInput);
  wahr(`Perspektive ${p} liefert Text`, t.trim().length > 40);
  wahr(`Perspektive ${p} ohne Etikett`, !/^\s*\(/.test(t));
}

console.log(`Prüfstand Perspektive — ${geprueft} Prüfungen, ${bestanden} bestanden`);
const proc = globalThis as unknown as { process?: { exit: (c: number) => void } };
if (fails.length) {
  console.error(`\n❌ Perspektive: ${fails.length} Fehler:`);
  fails.forEach((f) => console.error("  - " + f));
  proc.process?.exit(1);
} else {
  console.log(`\n✅ Perspektive: alle ${geprueft} Prüfungen bestanden.`);
}
