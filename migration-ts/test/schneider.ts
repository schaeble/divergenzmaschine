// Prüfstand Schneider: Wolf Schneiders zählbare Regeln an Bericht und Meldung.
//
// Zwei Teile. Zuerst die GEGENPROBE: Ein Text im Amtsdeutsch, in dem jeder
// Fehler absichtlich steckt. Schlägt ein Muster dort nicht an, ist es keine
// Prüfung — und die Nullen im zweiten Teil wären wertlos. Bei der ersten
// Fassung fehlten dem Streckverb-Muster „zur Kenntnis genommen" und dem
// Klammermuster jede Klammer nach langem Vorfeld; erst die Gegenprobe zeigte es.
//
// Dann die MATRIX: dieselben schwierigen Eingaben wie im Bericht-Prüfstand.
// Die Prosa ist bewusst NICHT dabei — ihre Fragmente und Sinnsprüche sind dort
// Stilmittel, und Schneiders Regeln würden sie glattbügeln.
{
  const g = globalThis as unknown as { localStorage?: unknown; window?: unknown };
  const m: Record<string, string> = {};
  g.localStorage = { getItem: (k: string) => (k in m ? m[k]! : null), setItem: (k: string, v: string) => { m[k] = String(v); },
    removeItem: (k: string) => { delete m[k]; }, clear: () => {}, key: () => null, length: 0 };
  g.window = { localStorage: g.localStorage };
}
import { buildBericht, darfReihen, reihe } from "../src/generation/bericht";
import { buildMeldung } from "../src/generation/meldung";
import { BUILTIN_PRESETS } from "../src/presets.data";
import { RESSORT_IDS } from "../src/features/ressorts";
import { misseSchneider, schneiderSaetze, teilsaetze, verbklammer, woerter, VERBOTE, type SchneiderBefund } from "../src/features/schneider";
import type { GenInput, Bank } from "../src/types";
import { scoreBericht, scoreText } from "../src/generation/scoring";
import { sinnsprueche, vorratsanteil } from "../src/generation/bericht";

const fails: string[] = [];
let geprueft = 0;
const pruefe = (ok: boolean, msg: string): void => { geprueft++; if (!ok) fails.push(msg); };
const pz = (x: number): string => (100 * x).toFixed(1) + " %";

// ── 1 · Gegenprobe ──────────────────────────────────────────────────────────
const SCHLECHT = [
  "Der Bürgermeister hat die von den Anwohnern seit Jahren immer wieder vorgebrachten Beschwerden über den Lärm gestern endlich zur Kenntnis genommen.",
  "Im Rahmen der Umsetzung der Maßnahmen der Verwaltung wurde die Problematik eigentlich durchaus eingehend geprüft.",
  "Weil die Finanzierung ungeklärt ist, wird die Entscheidung vertagt.",
  "Die Durchführung der Sanierung der Straße des Viertels wurde in Erwägung gezogen.",
].join(" ");
{
  const S = schneiderSaetze(SCHLECHT);
  pruefe(S.length === 4, `Gegenprobe: 4 Sätze erwartet, ${S.length} gezählt`);
  pruefe(verbklammer(S[0]!) > 6, `Gegenprobe: Verbklammer in Satz 1 nicht erkannt (${verbklammer(S[0]!)})`);
  for (const [name, re] of VERBOTE) pruefe(S.some((s) => re.test(s)), `Gegenprobe: Muster „${name}" schlägt nicht an`);
  const lang = "Die Anwohner der seit Jahren vom Durchgangsverkehr belasteten nördlichen Uferstraße haben am Montag protestiert.";
  pruefe(teilsaetze(lang).some((t) => woerter(t).length > 12), "Gegenprobe: Teilsatz über zwölf Wörtern nicht erkannt");
  // Und umgekehrt: Kein Fehlalarm an einem sauberen Satz.
  const sauber = "Der Bürgermeister hat die Beschwerden gelesen, und am Montag entscheidet der Rat.";
  pruefe(verbklammer(sauber) <= 6 && !VERBOTE.some(([, re]) => re.test(sauber)), "Gegenprobe: Fehlalarm am sauberen Satz");
  // Infokasten und Titel dürfen keine Sätze werden (Fund der ersten Messung).
  pruefe(schneiderSaetze("Im Frühjahr 2001: Dr. Ing. Richard Doll will schließen.\n\nFaktenkasten\n· Betroffen: 40").length === 1,
    "Gegenprobe: Titelabkürzung oder Infokasten zerteilt den Satz");
}

// Die Fuge des Berichts (4.371.0) — jede Sperre mit einem Fall, der sie treffen muss.
pruefe(reihe("Kraus ist seit 1988 dabei.", "Betroffen sind 40 Beschäftigte.") === "Kraus ist seit 1988 dabei; betroffen sind 40 Beschäftigte.",
  `Fuge: Partizip nicht kleingeschrieben — ${reihe("Kraus ist seit 1988 dabei.", "Betroffen sind 40 Beschäftigte.")}`);
pruefe(/; Kraus ist/.test(reihe("Es geht um 4 Millionen Euro.", "Kraus ist seit 1988 dabei.")), "Fuge: Name kleingeschrieben");
pruefe(/, und am Donnerstag/.test(reihe("Es geht um 4 Millionen Euro.", "Am Donnerstag folgte der Schritt.")), "Fuge: Zeitangabe bekommt kein „und\"");
pruefe(!darfReihen("Angefangen hatte es im Mai: die erste Meldung.", "Es geht um 4 Millionen Euro."), "Sperre Doppelpunkt greift nicht");
pruefe(!darfReihen("Betroffen ist die Hälfte.", "Betroffen sind außerdem die Schulen."), "Sperre gleiches Anfangswort greift nicht");
pruefe(!darfReihen("Es geht um 4 Millionen Euro; betroffen sind 40.", "Kraus ist seit 1988 dabei."), "Sperre Kette greift nicht");
pruefe(!darfReihen("Auf dem Spiel stehen die Ausbildungsplätze der Werft und die Altersversorgung der gesamten Belegschaft am Standort.", "Es geht um Geld."),
  "Sperre Teilsatz über zwölf Wörtern greift nicht");
pruefe(darfReihen("Es geht um 4 Millionen Euro.", "Kraus ist seit 1988 dabei."), "Fuge: ein zulässiges Paar wird abgelehnt");

// ── 2 · Matrix ──────────────────────────────────────────────────────────────
const WER = ["Dr. Ing. Richard Doll", "Reinhard Kraus", "die Ostmoor-Werft", "Ritter Ltd", "FC Liverpool", "das Stadttheater", "das Tief Ottilie", "Prof. Schwarz"];
const WAS = ["will den Konzern DAS GmbH schließen", "produziert keine Lanzen mehr", "probt den Aufstand auf der Bühne", "stellt den Betrieb ein", "warnt vor schweren Gewittern"];
const WANN = ["Frühjahr 2001", "am Donnerstag", ""];
const WO = ["in Dürrhausen", "in London", ""];
const TOENE = ["neutral", "uplifting"];
const basis = { varLevel: "wild", structure: "rekombination", mode: "auto", perspective: "third", rhythm: "auto",
  markovMode: "off", disruptor: "off", archetypeA: "neutral", archetypeB: "neutral", instability: 2 } as unknown as GenInput;
const presets = Object.keys(BUILTIN_PRESETS);
const bericht: string[] = [], meldung: string[] = [], wasFehlt: string[] = [];
let i = 0;
for (const who of WER) for (const what of WAS) for (const when of WANN) for (const where of WO) for (const tone of TOENE) {
  i++;
  const e = { ...basis, who, what, when, where, tone } as GenInput;
  const mt = buildMeldung({ ...e, form: "meldung", lenTarget: 60 } as GenInput).text;
  const bt = buildBericht(BUILTIN_PRESETS[presets[i % presets.length]!] as Bank, { ...e, lenTarget: 220 } as GenInput,
    RESSORT_IDS[i % RESSORT_IDS.length]!).text;
  meldung.push(mt); bericht.push(bt);
  // Das Was muss vollständig dastehen (4.372.0). „stellt den Betrieb ein"
  // erschien als „stellt den Betrieb" — über 480 Läufe mit genau dieser
  // Eingabe, und kein Muster suchte nach dem, was FEHLT.
  if (!bt.includes(what)) wasFehlt.push(`Bericht: „${what}“ → ${bt.split("\n")[2]}`);
  if (!mt.includes(what)) wasFehlt.push(`Meldung: „${what}“ → ${mt.slice(0, 90)}`);
}
pruefe(wasFehlt.length === 0, `Was unvollständig in ${wasFehlt.length} Texten, z. B. ${wasFehlt[0]}`);

const zeige = (name: string, b: SchneiderBefund): void => {
  console.log(`${name}: ${b.saetze} Sätze, Median ${b.median} Wörter`);
  console.log(`  Bänder ≤5 | 6–12 | 13–20 | 21–30 | >30: ${b.baender.map(pz).join(" | ")}`);
  console.log(`  Teilsatz >12 Wörter: ${pz(b.teilsatzLang)} · Verbklammer >6: ${pz(b.klammerWeit)}`);
  console.log(`  Verbote: ${Object.entries(b.verbote).map(([k, v]) => `${k} ${pz(v)}`).join(", ")}`);
};
const B = misseSchneider(bericht), M = misseSchneider(meldung);
zeige("Bericht", B);
zeige("Meldung", M);

// Wachen: Was heute stimmt, soll so bleiben — eigene Presets und Korpus-
// Bausteine können Amtsdeutsch einschleppen. Die Schwellen liegen über dem
// gemessenen Stand, nicht bei null: Das Passivmuster trifft im Bericht auch
// Vorratssätze wie „Das Gebet wird erhört" (0,9 %).
for (const [name, b] of [["Bericht", B], ["Meldung", M]] as [string, SchneiderBefund][]) {
  pruefe(b.baender[4] === 0, `${name}: Sätze über 30 Wörtern (${pz(b.baender[4])})`);
  pruefe(b.klammerWeit <= 0.01, `${name}: Verbklammer über sechs Wörtern in ${pz(b.klammerWeit)}`);
  pruefe(b.teilsatzLang <= 0.02, `${name}: Teilsatz über zwölf Wörtern in ${pz(b.teilsatzLang)}`);
  for (const k of ["Streckverb", "Blähwort", "Füllwort"]) pruefe(b.verbote[k]! <= 0.005, `${name}: ${k} in ${pz(b.verbote[k]!)}`);
  pruefe(b.verbote["Passiv"]! <= 0.03, `${name}: Passiv in ${pz(b.verbote["Passiv"]!)}`);
}
// Abwechslung (4.371.0): Der Bericht bestand aus lauter Sätzen zwischen fünf
// und zwölf Wörtern. Vorher (4.370.0): ≤5 13,7 % | 6–12 79,7 % | 13–20 6,6 % |
// darüber 0. Schneider verlangt Wechsel, nicht Kürze. Verbunden werden nur
// Faktensätze des Gerüsts; die Vorratssätze aus dem Preset bleiben einzeln,
// und sie stellen den Großteil — daher die bescheidene Marke.
pruefe(B.baender[2] + B.baender[3] >= 0.09, `Bericht: zu wenig mäßig lange Sätze (13–30 Wörter: ${pz(B.baender[2] + B.baender[3])})`);
pruefe(B.baender[0] >= 0.05, `Bericht: kein kurzer Satz mehr (≤5 Wörter: ${pz(B.baender[0])}) — Wechsel heißt beides`);

// ── 3 · Bestenauslese für den Bericht (4.372.0) ─────────────────────────────
// Gegenproben mit festen Texten: gleiche Länge, gleicher Bau — einer trägt
// Fakten, der andere Sinnsprüche. Die Wertung muss den ersten vorziehen, und
// der Tempuswechsel der Vorgeschichte darf nichts kosten.
{
  const kopf = "Dürrhausen · Wirtschaft\n\nKraus stellt den Betrieb ein\n\nAm Donnerstag: Kraus stellt den Betrieb ein. Bekannt wurde, dass 80 Zulieferer betroffen sind.\n\n";
  const fakten = kopf + "Vor zwei Jahren gab es die erste Anfrage; gemessen wurden 900 Meter Kaimauer. Am Donnerstag folgte der Schritt, über den Kraus nun informiert. Betroffen ist damit die Hälfte der Zulieferer. Auf dem Spiel stehen die Lieferkette und die Ausbildungsplätze der Werft am Hafen.";
  const sprueche = kopf + "Der Glaube verlangt einen Sprung ohne Boden. Die Stille wird laut und dann wieder still. Die Zeit läuft rückwärts durch die Halle. Die Wahrheit steht im Hafen und wartet auf ein Schiff.";
  pruefe(sinnsprueche(sprueche) >= 4 && sinnsprueche(fakten) === 0, `Sinnspruch-Zählung: ${sinnsprueche(sprueche)} / ${sinnsprueche(fakten)}`);
  pruefe(sinnsprueche("„Die Stille wird laut“, sagte Möller.") === 0, "Sinnspruch im Zitat darf nicht zählen");
  pruefe(vorratsanteil(fakten) < vorratsanteil(sprueche), "Vorratsanteil unterscheidet Fakten nicht von Sprüchen");
  const f = scoreBericht(fakten, 60).score, sp = scoreBericht(sprueche, 60).score;
  pruefe(f > sp + 20, `Bericht-Wertung zieht Fakten nicht klar vor (${f.toFixed(1)} gegen ${sp.toFixed(1)})`);
  // Der Faktenkasten gehört nicht zum Text, den die Wertung liest.
  pruefe(Math.abs(scoreBericht(fakten + "\n\nFaktenkasten\n· Betroffen: 80 Zulieferer\n· 2019: erste Anfrage", 60).score - f) < 3,
    "Faktenkasten verschiebt die Bericht-Wertung");
  // Gegenprobe zur alten Wertung: Sie sah den Unterschied kaum.
  const altAbstand = scoreText(fakten, 60).score - scoreText(sprueche, 60).score;
  console.log(`Bestenauslese: Fakten vor Sprüchen — neu ${(f - sp).toFixed(1)} Punkte, alt ${altAbstand.toFixed(1)}`);
}

console.log(`Prüfstand Schneider — ${geprueft} Prüfungen`);
const proc = globalThis as unknown as { process?: { exit: (c: number) => void } };
if (fails.length) {
  console.error(`\n❌ Schneider: ${fails.length} Fehler:`);
  fails.forEach((f) => console.error("  - " + f));
  proc.process?.exit(1);
} else {
  console.log(`\n✅ Schneider: alle ${geprueft} Prüfungen bestanden.`);
}
