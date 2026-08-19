// Prüfstand Autopilot. Reine Rechnung — und eine Prüfung am Quelltext selbst.
//
// Die letzte ist die wichtigste: Der Autopilot soll nichts kosten. Ein Verbot,
// das nur in einem Kommentar steht, ist beim nächsten Ausbau vergessen. Hier
// wird nachgesehen, ob die Ansicht wirklich keinen bezahlten Baustein einbindet.
import { readFileSync } from "fs";
import {
  baueBesetzung, baueEingabe, titelAus, naechsteAusgabe, layoutName, verteileRollen,
  SEITEN_FORMEN, BEITRAEGE_MIN, BEITRAEGE_MAX, BEITRAEGE_VORGABE,
  maxBeitraege, BEITRAEGE_JE_SEITE,
  ktxSchluessel, merkeGedaechtnis, GEDAECHTNIS_TIEFE, KTX_KEY,
  wasAusSchluessel, letzteWas, WAS_TIEFE,
} from "../src/features/autopilot";
import type { FormKind } from "../src/types";

const fails: string[] = [];
const zeilen: string[] = [];
let geprueft = 0;
const ist = (name: string, wert: unknown, soll: unknown): void => {
  geprueft++;
  if (wert === soll) zeilen.push(`  ✓ ${name}`);
  else { zeilen.push(`  ✗ ${name}`); fails.push(`${name}: „${String(wert)}“ — erwartet „${String(soll)}“`); }
};
const wahr = (name: string, b: boolean): void => ist(name, b, true);

/** Ein Zufall, der keiner ist — sonst ließe sich eine Planung nicht prüfen. */
const fest = (werte: number[]): (() => number) => {
  let i = 0;
  return () => werte[i++ % werte.length]!;
};

// ── 1 · Die Ausgabennummer ──────────────────────────────────────────────────
ist("die schlichte Nummer", naechsteAusgabe("Nr. 1"), "Nr. 2");
ist("zweistellig", naechsteAusgabe("Nr. 41"), "Nr. 42");
ist("mit anderem Wort davor", naechsteAusgabe("Ausgabe 12"), "Ausgabe 13");
ist("der Übertrag stimmt", naechsteAusgabe("Nr. 9"), "Nr. 10");
// Führende Nullen bleiben: Wer „Nr. 007“ schreibt, meint das so.
ist("führende Nullen bleiben", naechsteAusgabe("Nr. 007"), "Nr. 008");
ist("auch beim Übertrag", naechsteAusgabe("Nr. 099"), "Nr. 100");
// Es wird die LETZTE Zahlengruppe erhöht, nicht die erste — sonst würde aus
// „III/2026, Nr. 4“ das Jahr hochgezählt.
ist("die letzte Zahl zählt", naechsteAusgabe("2026, Nr. 4"), "2026, Nr. 5");
ist("Text nach der Zahl bleibt stehen", naechsteAusgabe("Nr. 3 (Sonderteil)"), "Nr. 4 (Sonderteil)");
ist("ohne Zahl wird angehängt", naechsteAusgabe("Sonderausgabe"), "Sonderausgabe 2");
ist("leer ergibt die zweite", naechsteAusgabe(""), "Nr. 2");
ist("Leerraum zählt als leer", naechsteAusgabe("   "), "Nr. 2");

// ── 2 · Der Layoutname ──────────────────────────────────────────────────────
// Die Nummer MUSS hinein: Die Ablage ersetzt Layouts gleichen Namens. Ohne sie
// überschriebe jede Ausgabe die vorige, und es bliebe genau ein Layout.
ist("Name und Nummer", layoutName("Der Zeitstrom", "Nr. 7"), "Der Zeitstrom Nr. 7");
wahr("zwei Ausgaben ergeben zwei Namen",
  layoutName("X", "Nr. 1") !== layoutName("X", "Nr. 2"));
ist("Leerraum wird geglättet", layoutName("  Der   Zeitstrom ", "Nr. 1"), "Der Zeitstrom Nr. 1");
ist("ohne Namen bleibt ein Ersatz", layoutName("", "Nr. 1"), "Ausgabe Nr. 1");
ist("ohne Nummer nur der Name", layoutName("Zeitstrom", ""), "Zeitstrom");
wahr("sehr lange Namen werden gekürzt", layoutName("z".repeat(200), "Nr. 1").length <= 60);

// ── 3 · Die Besetzung ───────────────────────────────────────────────────────
const b5 = baueBesetzung(5, false, false, fest([0.1, 0.5, 0.9]));
ist("fünf Beiträge", b5.length, 5);
ist("der erste ist der Aufmacher", b5[0]?.was, "Aufmacher");
ist("und ein Bericht", b5[0]?.form, "bericht");
ist("der zweite ist der Kasten", b5[1]?.was, "Kasten");
wahr("der Aufmacher ist der längste geplante", b5.every((a, i) => i === 0 || a.woerter <= b5[0]!.woerter));
wahr("alle Formen taugen für eine Seite",
  b5.every((a) => (SEITEN_FORMEN as string[]).includes(a.form)));
// Die Längen müssen auseinanderlaufen: Vier gleich lange Beiträge ergeben eine
// Tapete, keine Seite.
wahr("die Längen laufen auseinander", new Set(b5.map((a) => a.woerter)).size >= 3);

ist("zu wenige werden angehoben", baueBesetzung(1, false, false).length, BEITRAEGE_MIN);
ist("Unsinn ergibt die Vorgabe", baueBesetzung(NaN, false, false).length, BEITRAEGE_VORGABE);

// Gemeldet: 16 Beitraege eingestellt, 7 erzeugt, zweite Seite fast leer. Die
// Obergrenze war eine feste Sieben aus einer Zeit, in der es nur eine Seite
// gab — und sie griff stillschweigend.
ist("eine Seite fasst ein Dutzend", maxBeitraege(1), BEITRAEGE_JE_SEITE);
ist("zwei Seiten das Doppelte", maxBeitraege(2), BEITRAEGE_JE_SEITE * 2);
wahr("die gemeldeten 16 sind bei zwei Seiten drin", maxBeitraege(2) >= 16);
ist("null Seiten gelten als eine", maxBeitraege(0), BEITRAEGE_JE_SEITE);
ist("Unsinn ebenso", maxBeitraege(NaN), BEITRAEGE_JE_SEITE);
wahr("nach oben ist trotzdem Schluss", maxBeitraege(99) <= BEITRAEGE_MAX);
// Gegenprobe: Die Grenze muss auch wirklich greifen, sonst rechnet man bei
// einem Vertipper minutenlang.
ist("die Grenze wird eingehalten", baueBesetzung(99, false, false, Math.random, maxBeitraege(1)).length, BEITRAEGE_JE_SEITE);
ist("und bei zwei Seiten die groessere", baueBesetzung(99, false, false, Math.random, maxBeitraege(2)).length, BEITRAEGE_JE_SEITE * 2);
ist("16 bei zwei Seiten kommen durch", baueBesetzung(16, false, false, Math.random, maxBeitraege(2)).length, 16);
// Und dieselbe Zahl bei EINER Seite wird gekappt — das ist der gemeldete Fall.
ist("16 bei einer Seite werden gekappt", baueBesetzung(16, false, false, Math.random, maxBeitraege(1)).length, BEITRAEGE_JE_SEITE);

// Die Kontextquellen: Ohne gefüllte Vorräte bleibt nur der Würfel — und der
// funktioniert immer, ohne Netz und ohne Guthaben.
wahr("ohne Vorräte wird nur gewürfelt",
  baueBesetzung(5, false, false).every((a) => a.quelle === "wuerfel"));
// Gegenprobe: Mit Vorrat MUSS auch daraus gezogen werden — sonst prüfte die
// Regel oben nur, dass die Quelle nie wechselt.
const mitVorrat = baueBesetzung(7, true, true, fest([0.99, 0.5, 0.1]));
wahr("mit Vorräten kommen andere Quellen vor",
  mitVorrat.some((a) => a.quelle !== "wuerfel"));
// Und zwar REIHUM, nicht gezogen. Beim Ziehen kam es regelmäßig vor, dass alle
// Beiträge einer Ausgabe aus derselben Quelle stammten — und wenn der
// Bildvorrat gerade aus dreißig Tempelfotos besteht, handelt die ganze Zeitung
// von Tempeln.
ist("bei drei Quellen kommt jede vor", new Set(mitVorrat.map((a) => a.quelle)).size, 3);
ist("und sie wechseln der Reihe nach",
  mitVorrat.slice(0, 3).map((a) => a.quelle).join(","), "wuerfel,vorrat,bild");
ist("auch die zweite Runde", mitVorrat.slice(3, 6).map((a) => a.quelle).join(","), "wuerfel,vorrat,bild");
// Bei nur zwei Quellen wechseln eben diese beiden ab.
const zweiQ = baueBesetzung(5, true, false);
ist("mit einem Vorrat wechseln zwei Quellen ab",
  zweiQ.slice(0, 4).map((a) => a.quelle).join(","), "wuerfel,vorrat,wuerfel,vorrat");
// Der Zufall darf die Verteilung NICHT mehr beeinflussen: Zwei Läufe mit
// verschiedenem Zufall müssen dieselbe Quellenfolge ergeben.
ist("die Quellenfolge hängt nicht mehr am Zufall",
  baueBesetzung(6, true, true, fest([0.1])).map((a) => a.quelle).join(","),
  baueBesetzung(6, true, true, fest([0.9])).map((a) => a.quelle).join(","));

// ── 4 · Die Eingabe ─────────────────────────────────────────────────────────
const ctx = { who: "Ein Ermittler", where: "Hafen", when: "im Herbst", what: "wartet" };
const e = baueEingabe(b5[0]!, ctx, fest([0.3]));
ist("der Kontext kommt an", e.who, "Ein Ermittler");
ist("die Form kommt aus dem Auftrag", e.form, b5[0]!.form);
ist("die Länge auch", e.lenTarget, b5[0]!.woerter);
// Markov bleibt an: Er ist der Teil, der die Texte an DIESE Maschine bindet
// statt an die eingebauten Schablonen.
ist("der Korpus wird benutzt", e.markovMode, "on");
wahr("alle Regler sind gesetzt",
  [e.tone, e.structure, e.mode, e.perspective, e.rhythm, e.disruptor].every((x) => !!x));

// ── 5 · Rollen nach der wirklichen Länge ────────────────────────────────────
// Der Generator trifft die Zielwortzahl nicht genau. Ein Aufmacher, der kürzer
// geriet als die Meldung daneben, sieht auf der Seite aus wie ein Fehler.
const lang = "wort ".repeat(200);
const mittel = "wort ".repeat(80);
const kurz = "wort ".repeat(10);
const r1 = verteileRollen([
  { text: kurz, form: "bericht" as FormKind },
  { text: lang, form: "bericht" as FormKind },
  { text: mittel, form: "bericht" as FormKind },
]);
ist("der längste wird Aufmacher", r1[1], "aufmacher");
ist("der kürzeste wird Kasten", r1[0], "kasten");
ist("der Rest bleibt Spalte", r1[2], "normal");

// Eine Kurzform ist der natürliche Kasten, auch wenn sie nicht die kürzeste ist.
const r2 = verteileRollen([
  { text: lang, form: "bericht" as FormKind },
  { text: mittel, form: "poem" as FormKind },
  { text: kurz, form: "bericht" as FormKind },
]);
ist("die Kurzform wird Kasten", r2[1], "kasten");
ist("und der Aufmacher bleibt der lange Fließtext", r2[0], "aufmacher");
// Ein Gedicht darf NICHT Aufmacher werden, auch wenn es das Längste ist.
const r3 = verteileRollen([
  { text: lang, form: "poem" as FormKind },
  { text: mittel, form: "bericht" as FormKind },
  { text: kurz, form: "bericht" as FormKind },
]);
ist("ein Gedicht wird nicht Aufmacher, auch wenn es das Längste ist", r3[1], "aufmacher");
// Gibt es NUR Kurzformen, muss trotzdem eine den Aufmacher machen — eine Seite
// ohne Aufmacher hat keinen Einstieg.
const r4 = verteileRollen([
  { text: mittel, form: "poem" as FormKind },
  { text: kurz, form: "haiku" as FormKind },
]);
wahr("bei lauter Kurzformen wird trotzdem einer Aufmacher", r4.includes("aufmacher"));
ist("bei zwei Beiträgen gibt es keinen Kasten", r4.filter((x) => x === "kasten").length, 0);
ist("eine leere Liste stürzt nicht ab", verteileRollen([]).length, 0);
ist("ein einzelner Beitrag ist der Aufmacher", verteileRollen([{ text: kurz, form: "bericht" as FormKind }])[0], "aufmacher");

// ── 6 · Kostenfrei — am Quelltext geprüft ───────────────────────────────────
// Der Autopilot soll nichts kosten. Ein Knopf, der ungefragt eine ganze Seite
// erzeugt, darf nicht nebenbei das Konto belasten: Die Zahl der Aufrufe wäre
// erst hinterher zu sehen, und dann ist es zu spät.
const ansicht = readFileSync("src/ui/autopilotView.ts", "utf8");
const plan = readFileSync("src/features/autopilot.ts", "utf8");
for (const verboten of ["features/ki", "callClaude", "features/lehrer", "features/bildwelt", "api.anthropic.com"]) {
  ist(`die Ansicht bindet „${verboten}“ nicht ein`, ansicht.includes(verboten), false);
  ist(`die Planung ebenso wenig`, plan.includes(verboten), false);
}
// Der Bildsammler ist ein Sonderfall: Sein VORRAT ist längst gelesen und
// kostet nichts mehr. Gezogen werden darf daraus, gelesen werden nicht.
wahr("aus dem Bildvorrat darf gezogen werden", ansicht.includes("ziehBildvorrat"));
ist("aber nicht gelesen", /callClaudeBild|baueBankPrompt/.test(ansicht), false);
// Gegenprobe: Die Prüfung muss anschlagen können — sonst bestünde sie auch bei
// einer Datei, die voller Aufrufe steckt.
wahr("die Prüfung schlägt bei einem Aufruf an", "await callClaudeBild(x)".includes("callClaude"));

// ── 7 · Gedächtnis über Ausgaben hinweg ─────────────────────────────────────
// Gemeldet: zwei Ausgaben hintereinander mit „Eine Bibliothek will die
// Verfolger abschütteln". Innerhalb einer Ausgabe wurde schon nicht wiederholt,
// über Ausgaben hinweg nicht — und dort fällt es stärker auf.
ist("der Schlüssel fasst Wer, Wo und Was",
  ktxSchluessel({ who: "Eine Bibliothek", where: "Hafen", what: "will die Verfolger abschütteln" }),
  "eine bibliothek|hafen|will die verfolger abschütteln");
// Wann bleibt draußen: Dieselbe Figur am selben Ort mit derselben Absicht ist
// eine Wiederholung, auch wenn es diesmal im Frühjahr spielt.
ist("das Wann zählt nicht mit",
  ktxSchluessel({ who: "A", where: "B", what: "C" }),
  ktxSchluessel({ who: "A", where: "B", what: "C" }));
ist("Schreibung und Leerraum ebenso wenig",
  ktxSchluessel({ who: "  Eine   Bibliothek ", where: "HAFEN", what: "C" }),
  ktxSchluessel({ who: "eine bibliothek", where: "hafen", what: "c" }));
wahr("ein anderes Was ergibt einen anderen Schlüssel",
  ktxSchluessel({ who: "A", where: "B", what: "C" }) !== ktxSchluessel({ who: "A", where: "B", what: "D" }));

ist("neue Kontexte kommen dazu", merkeGedaechtnis([], ["a", "b"]).join(","), "a,b");
// Bekanntes rutscht ans Ende, statt liegenzubleiben — sonst verfiele ein oft
// benutzter Kontext irgendwann aus dem Gedächtnis und käme sofort wieder.
ist("Bekanntes rutscht ans Ende", merkeGedaechtnis(["a", "b", "c"], ["a"]).join(","), "b,c,a");
ist("Doppelte im Zulauf zählen einmal", merkeGedaechtnis([], ["a", "a", "b"]).join(","), "a,b");
ist("Leeres kommt nicht hinein", merkeGedaechtnis([], [""]).length, 0);
// Der Deckel: Das Älteste fällt vorn heraus.
const voll = Array.from({ length: 8 }, (_, i) => "k" + i);
ist("der Deckel greift", merkeGedaechtnis(voll, ["neu"], 5).length, 5);
ist("und das Älteste fällt heraus", merkeGedaechtnis(voll, ["neu"], 5)[0], "k4");
wahr("die Tiefe reicht über mehrere Ausgaben", GEDAECHTNIS_TIEFE >= 20);
wahr("das Gedächtnis wandert in die Projektdatei", KTX_KEY.startsWith("divergenz_"));

// Der ganze Schlüssel reicht NICHT. Gemeldet nach der ersten Reparatur: „Eine
// Bibliothek will die Verfolger abschütteln", dann „Eine Klinik will die
// Verfolger abschütteln". Verschiedene Kontexte — und trotzdem dieselbe Zeile,
// weil die Schlagzeile aus „Wer + Was" gebaut wird.
ist("das Was lässt sich aus dem Schlüssel lesen",
  wasAusSchluessel("eine klinik|hochgebirge|will die verfolger abschütteln"),
  "will die verfolger abschütteln");
ist("ein unvollständiger Schlüssel ergibt nichts", wasAusSchluessel("nur|zwei"), "");
ist("und ein leerer auch nicht", wasAusSchluessel(""), "");

const g = ["a|b|erstes was", "c|d|zweites was", "e|f|erstes was"];
wahr("die benutzten Was werden gesammelt", letzteWas(g).has("erstes was"));
wahr("alle davon", letzteWas(g).has("zweites was"));
ist("Doppelte zählen einmal", letzteWas(g).size, 2);
// Flacher als das Kontext-Gedächtnis: Es gibt nur eine Handvoll
// Was-Formulierungen. Würden zu viele gesperrt, bliebe nichts übrig.
wahr("die Was-Tiefe ist flacher als das Gedächtnis", WAS_TIEFE < GEDAECHTNIS_TIEFE);
ist("nur die jüngsten zählen", letzteWas(["x|y|altes was", ...g], 3).has("altes was"), false);
ist("aber die jüngsten schon", letzteWas(["x|y|altes was", ...g], 3).has("zweites was"), true);
ist("ein leeres Gedächtnis meidet nichts", letzteWas([]).size, 0);

// ── 8 · Der Titel ───────────────────────────────────────────────────────────
ist("Wer und Was zusammen", titelAus({ who: "Ein Ermittler", what: "wartet" }), "Ein Ermittler wartet");
ist("ohne Kontext ein Ersatz", titelAus({ who: "", what: "" }), "Ohne Titel");
wahr("lange Titel werden gekürzt", titelAus({ who: "w".repeat(90), what: "x" }).length <= 61);
wahr("und enden mit Auslassung", titelAus({ who: "wort ".repeat(30), what: "x" }).endsWith("…"));

// ── Ergebnis ────────────────────────────────────────────────────────────────
console.log(`Prüfstand Autopilot — ${geprueft} Prüfungen (ohne API-Aufruf):`);
zeilen.forEach((z) => console.log(z));
const proc = globalThis as unknown as { process?: { exit: (c: number) => void } };
if (fails.length) {
  console.error(`\n❌ ${fails.length} Fehler im Autopiloten:`);
  fails.forEach((f) => console.error("  - " + f));
  proc.process?.exit(1);
} else {
  console.log(`\n✅ Autopilot: alle ${geprueft} Prüfungen bestanden.`);
}
