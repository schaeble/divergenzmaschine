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
import { declineHookPhrase, guessGender } from "../src/generation/declension";
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

let objektBsp = "";
let etikett = 0, wortObjekt = 0, ohneRahmen = 0, ohneArtikel = 0, nichtVorn = 0, ohneZweiten = 0;
// Aus der Quelle, nicht abgeschrieben: Eine Kopie der Liste veraltet stumm.
// Ohne Schlusspunkt vergleichen: Die Satzlängen-Zusammenziehung darf den Satz
// an seinen Nachbarn binden („… und ich sehe alles, und der Weg führt weiter"),
// dabei verliert er sein Satzzeichen. Verschwinden darf er trotzdem nicht.
const RAHMEN_ZWEI = OBJEKT_EINSTIEG.map((r) => r.split(". ").slice(1).join(". ").replace(/[.!?…]+$/, ""));
const LAEUFE = 60;
for (let i = 0; i < LAEUFE; i++) {
  const bank = BUILTIN_PRESETS[ids[i % ids.length]!] as Bank;
  const t = buildStory(bank, { ...basis, perspective: "object",
    structure: i % 2 ? "rekombination" : "linear" } as GenInput);
  if (/\((?:das Objekt|der |die |das )[^)]{0,40}\)/.test(t)) etikett++;
  if (/\bdas Objekt\b/.test(t)) { wortObjekt++; if (!objektBsp) objektBsp = (t.split(/(?<=[.!?])\s+/).find((x) => /\bdas Objekt\b/.test(x)) || t.slice(0, 90)); }
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
// Die Meldung nennt den Satz. Ohne ihn stand hier nur „1 — erwartet 0", und die
// Suche nach der Stelle dauerte länger als die Reparatur. Beim ersten Anschlagen
// war es übrigens kein Programmfehler, sondern MATERIAL: „das Objekt steht zu
// tief über dem Horizont" im Preset „astrologie" — in der Astronomie ein
// normaler Satz, hier eine Kollision mit dem verbotenen Platzhalter. Der Eintrag
// heißt jetzt „der Körper …"; die Regel bleibt streng, denn sie kann beides
// nicht unterscheiden.
ist(`und das Wort „das Objekt“ steht nirgends mehr${objektBsp ? ` — z. B. „${objektBsp}“` : ""}`, wortObjekt, 0);
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


// ── 6 · Du/Ich/Wir: nur in Subjektstellung ─────────────────────────────────
// Gemeldet an einem gesammelten Wikipedia-Satz: „In der Toskana wird der
// italienische Festungsbaumeister und Militär du geboren." Der Figurenname
// steckt dort in einer Apposition — an dieser Stelle kann kein Pronomen stehen.
// Gemessen: 31 % der Du-Texte trugen so eine Stelle.
{
  const name = "Giovanni Salustio Peruzzi";
  const fremd = `In der Toskana wird der italienische Festungsbaumeister und Militär ${name} geboren.`;
  for (const p of ["second", "first", "we"]) {
    const raus = applyPerspective([fremd], p, name, "Stempel")[0] || "";
    wahr(`${p}: die Apposition bleibt unangetastet`, raus === fremd);
  }
  // Und die Gegenrichtung: In Subjektstellung wird sehr wohl umgestellt.
  ist("am Satzanfang wird umgestellt",
    applyPerspective(["Die Archivarin hält einen Stempel fest."], "second", "die Archivarin", "Akte")[0],
    "Du hältst einen Stempel fest.");
  ist("und bei Inversion auch",
    applyPerspective(["Am Morgen bemerkt die Archivarin den Stempel."], "second", "die Archivarin", "Akte")[0],
    "Am Morgen bemerkst du den Stempel.");
  ist("nach einer Konjunktion ebenso",
    applyPerspective(["Es regnet, und die Archivarin wartet."], "second", "die Archivarin", "Akte")[0],
    "Es regnet, und du wartest.");
  // Kurze Verben: „Du erbt ein Amt" — vier Buchstaben fielen durch die alte
  // Erkennung. Gemessen in 28 % der Du-Texte.
  ist("kurze Verben werden gebeugt",
    applyPerspective(["Der Sohn eines Fälschers erbt ein Amt."], "second", "der Sohn eines Fälschers", "Akte")[0],
    "Du erbst ein Amt.");
  ist("und in der ersten Person auch",
    applyPerspective(["Der Sohn eines Fälschers erbt ein Amt."], "first", "der Sohn eines Fälschers", "Akte")[0],
    "Ich erbe ein Amt.");
}

// ── 7 · Der Akkusativ braucht ein eingetragenes Geschlecht ────────────────
// Im Blatt: „Du hältst ein leerer Thron unter einem Baum fest." Die
// Endungsregel kannte weder „Thron" noch „Takt", und ohne Genus bildet
// declineHookPhrase keinen Akkusativ. 166 Nomen der Presets fehlten.
{
  ist("Thron wird zu einen Thron", declineHookPhrase("ein leerer Thron", "acc"), "einen leeren Thron");
  ist("auch mit Anhang", declineHookPhrase("ein leerer Thron unter einem Baum", "acc"), "einen leeren Thron unter einem Baum");
  ist("und Takt", declineHookPhrase("ein Takt, der älter ist als ihr Lächeln", "acc"), "einen Takt, der älter ist als ihr Lächeln");
  ist("weiblich bleibt weiblich", declineHookPhrase("eine rostige Klinge", "acc"), "eine rostige Klinge");
  // Die eigentliche Zusage: JEDES Nomen, das ein Preset mit unbestimmtem
  // Artikel führt, hat ein Geschlecht. Diese Prüfung schlägt an, sobald jemand
  // eines hinzufügt, ohne es einzutragen.
  const ohne = new Set<string>();
  for (const id of Object.keys(BUILTIN_PRESETS)) {
    const bank = BUILTIN_PRESETS[id] as unknown as Record<string, unknown>;
    for (const kat of Object.keys(bank)) {
      const arr = bank[kat];
      if (!Array.isArray(arr)) continue;
      for (const roh of arr as string[]) {
        const m = String(roh).match(/^(?:ein|eine|einen|einem|einer|eines)\s+(.*)$/i);
        if (!m) continue;
        const w = (m[1]!.split(" ").find((x) => /^[A-ZÄÖÜ]/.test(x)) || "").replace(/[^A-Za-zÄÖÜäöüß]/g, "");
        if (w && !guessGender(w)) ohne.add(w);
      }
    }
  }
  ist("jedes Preset-Nomen hat ein Geschlecht", [...ohne].sort().join(", "), "");
}

// ── Satzanfang nach Semikolon ───────────────────────────────────────────────
// Aus einem erzeugten Text: „Das System lernt zu schnell; Wir sind Mitglied
// des Kronrates" und „… Königreichs; Dann bricht die Ordnung". Das Semikolon
// stand in der Liste der Satzanfänge — nach ihm geht der Satz aber weiter, und
// das Pronomen bleibt klein.
{
  const f = (t: string, p = "we"): string => applyPerspective([t], p, "Der Wanderer", "Stab")[0]!;
  wahr("nach dem Semikolon bleibt das Pronomen klein",
    /; wir /.test(f("Das System lernt zu schnell; Der Wanderer nimmt einen Stab.")));
  wahr("auch in der Ich-Form",
    /; ich /.test(f("Das System lernt zu schnell; Der Wanderer nimmt einen Stab.", "first")));
  // Gegenproben: Am Satzanfang und nach einem Punkt MUSS gross geschrieben
  // werden — sonst prüfte die Regel oben nur, dass nie gross geschrieben wird.
  wahr("am Absatzanfang gross", /^Wir /.test(f("Der Wanderer nimmt einen Stab.")));
  wahr("nach einem Punkt gross", /\. Wir /.test(f("Es regnet. Der Wanderer nimmt einen Stab.")));
  // Der Doppelpunkt bleibt ein Satzanfang: Nach ihm kann im Deutschen ein
  // ganzer Satz folgen, und der wird gross geschrieben.
  wahr("nach dem Doppelpunkt weiter gross",
    /: Wir /.test(f("Es geht weiter: Der Wanderer nimmt einen Stab.")));
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
