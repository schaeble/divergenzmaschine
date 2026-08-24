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
  platzBudget, verteileLaengen, kuerzeBericht, neuerFaktor, LAENGEN_GRENZEN,
  presetZahl, mischName,
  WOERTER_JE_SEITE, KALIB_KEY,
  ktxSchluessel, merkeGedaechtnis, GEDAECHTNIS_TIEFE, KTX_KEY,
  wasAusSchluessel, letzteWas, WAS_TIEFE,
} from "../src/features/autopilot";
import type { FormKind } from "../src/types";
import { werte, FORM_OPTS } from "../src/generation/optionen";
import {
  TONE_OPTS, STRUCTURE_OPTS, MODE_OPTS, PERSP_OPTS, RHYTHM_OPTS,
  VARIANZ_OPTS, DISRUPTOR_OPTS, ARCH_OPTS, gueltig,
} from "../src/generation/optionen";

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
// Das Haiku kam im ganzen Autopiloten nicht vor — obwohl es die einzige Form
// mit VORHERSAGBARER Hoehe ist: drei Zeilen, siebzehn Silben. Genau das
// braucht ein Kasten.
const kastenFormen = new Set(Array.from({ length: 300 }, () => baueBesetzung(5, false, false)[1]!.form));
wahr("der Kasten kann ein Haiku sein", kastenFormen.has("haiku" as FormKind));
wahr("und eine Meldung", kastenFormen.has("meldung" as FormKind));
// Auch im Rest muss es vorkommen, sonst haengt alles am Kasten.
const alleFormen = new Set(Array.from({ length: 200 }, () => baueBesetzung(9, false, false)).flat().map((a) => a.form));
wahr("das Haiku kommt auch im Rest vor", alleFormen.has("haiku" as FormKind));
// Und die Laengenverteilung darf es nicht sprengen.
const mitHaiku = verteileLaengen([{ form: "haiku", woerter: 16 }, { form: "bericht", woerter: 400 }], 2000);
wahr("das Haiku bleibt ein Haiku", mitHaiku[0]!.woerter <= LAENGEN_GRENZEN.haiku![1]);
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
// Ohne gefüllte Vorräte bleiben Welt, Ideengenerator und Omnikognition — alle
// drei brauchen weder Netz noch Guthaben. Der Ideengenerator liefert einen
// Zusammenhang (Figur, Ort, Zeit, Vorgang aus derselben Prämisse) statt vier
// Felder nebeneinander; die Omnikognition liefert dazu eine andere Art zu
// sehen — samt eigener Wortbank aus Sinneskanälen.
ist("ohne Vorräte bleiben drei Quellen",
  new Set(baueBesetzung(6, false, false).map((a) => a.quelle)).size, 3);
wahr("und zwar Welt, Ideen und Wahrnehmung",
  baueBesetzung(6, false, false).every((a) => ["wuerfel", "idee", "wahrnehmung"].includes(a.quelle)));
wahr("die Wahrnehmung ist auch ohne Vorrat dabei",
  baueBesetzung(6, false, false).some((a) => a.quelle === "wahrnehmung"));
wahr("der Ideengenerator ist auch ohne Vorrat dabei",
  baueBesetzung(6, false, false).some((a) => a.quelle === "idee"));
// Gegenprobe: Mit Vorrat MUSS auch daraus gezogen werden — sonst prüfte die
// Regel oben nur, dass die Quelle nie wechselt.
const mitVorrat = baueBesetzung(7, true, true, fest([0.99, 0.5, 0.1]));
wahr("mit Vorräten kommen andere Quellen vor",
  mitVorrat.some((a) => a.quelle !== "wuerfel"));
// Und zwar REIHUM, nicht gezogen. Beim Ziehen kam es regelmäßig vor, dass alle
// Beiträge einer Ausgabe aus derselben Quelle stammten — und wenn der
// Bildvorrat gerade aus dreißig Tempelfotos besteht, handelt die ganze Zeitung
// von Tempeln.
ist("bei fünf Quellen kommt jede vor", new Set(mitVorrat.map((a) => a.quelle)).size, 5);
ist("und sie wechseln der Reihe nach",
  mitVorrat.slice(0, 5).map((a) => a.quelle).join(","), "wuerfel,vorrat,bild,idee,wahrnehmung");
ist("auch die zweite Runde", mitVorrat.slice(5, 7).map((a) => a.quelle).join(","), "wuerfel,vorrat");
// Mit nur einem Vorrat wechseln eben drei ab.
const dreiQ = baueBesetzung(6, true, false);
ist("mit einem Vorrat wechseln vier Quellen ab",
  dreiQ.slice(0, 6).map((a) => a.quelle).join(","), "wuerfel,vorrat,idee,wahrnehmung,wuerfel,vorrat");
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

// ── 4b · Jeder gewürfelte Wert muss es wirklich geben ───────────────────────
// Der teuerste Fehler dieses Bausteins: Der Autopilot würfelte aus EIGENEN
// Listen, die nie mit den Reglern abgeglichen waren. Von fünf Reglern
// enthielten vier überwiegend erfundene Werte — „ringkomposition", „duester",
// „wechsel", „mild", „er", „sie". Ein unbekannter Wert erzeugt keine Meldung,
// er tut nur nichts: Die Maschine variierte zum Schein und fuhr siebzehn
// Ausgaben lang fast dieselbe Einstellung.
//
// Tausend Läufe, damit auch selten gezogene Werte drankommen. Ein einziger
// Lauf träfe nur einen Wert je Regler und ginge fröhlich durch.
const gesehen: Record<string, Set<string>> = {
  tone: new Set(), structure: new Set(), mode: new Set(),
  perspective: new Set(), rhythm: new Set(), varLevel: new Set(),
  disruptor: new Set(), archetypeA: new Set(), archetypeB: new Set(),
};
let ungueltig = 0;
const listen: Record<string, [string, string][]> = {
  tone: TONE_OPTS, structure: STRUCTURE_OPTS, mode: MODE_OPTS,
  perspective: PERSP_OPTS, rhythm: RHYTHM_OPTS, varLevel: VARIANZ_OPTS,
  disruptor: DISRUPTOR_OPTS, archetypeA: ARCH_OPTS, archetypeB: ARCH_OPTS,
};
for (let i = 0; i < 1000; i++) {
  const a = baueBesetzung(5, false, false)[0]!;
  const e = baueEingabe(a, ctx) as unknown as Record<string, string>;
  for (const k of Object.keys(listen)) {
    gesehen[k]!.add(e[k]!);
    if (!gueltig(listen[k]!, e[k]!)) ungueltig++;
  }
}
ist("kein einziger erfundener Reglerwert in 1000 Läufen", ungueltig, 0);
// Gegenprobe zur Prüfung selbst: Ein erfundener Wert MUSS auffallen — sonst
// bestünde sie auch bei einer Liste voller Unsinn.
ist("die Prüfung erkennt einen erfundenen Wert", gueltig(TONE_OPTS, "duester"), false);
ist("und lässt einen echten durch", gueltig(TONE_OPTS, "melancholisch"), true);

// Und es muss auch wirklich gestreut werden, nicht nur gültig sein.
wahr("der Ton streut über mehrere Werte", gesehen.tone!.size >= 8);
wahr("die Struktur ebenso", gesehen.structure!.size >= 6);
wahr("die Perspektive auch", gesehen.perspective!.size >= 5);
wahr("der Rhythmus auch", gesehen.rhythm!.size >= 5);
wahr("die Archetypen auch", gesehen.archetypeA!.size >= 4);
// Das Verfahren, das diese Maschine ausmacht, muss vorkommen — es fehlte
// vollstaendig, weil „rekombination" in keiner der eigenen Listen stand.
wahr("Rekombination kommt vor", gesehen.structure!.has("rekombination"));
wahr("und zwar oft genug, um sichtbar zu sein",
  Array.from({ length: 200 }, () => (baueEingabe(baueBesetzung(5, false, false)[0]!, ctx) as unknown as Record<string, string>).structure)
    .filter((x) => x === "rekombination").length >= 10);

// ── 4c · Die Formen einer Ausgabe ───────────────────────────────────────────
// Gemeldet: „Die Aufmacher ausnahmslos Berichte. Warum keine Prosa bei 17
// Läufen?" Der Aufmacher stand fest auf „bericht".
const aufmacherFormen = new Set(Array.from({ length: 300 }, () => baueBesetzung(5, false, false)[0]!.form));
wahr("der Aufmacher kann ein Bericht sein", aufmacherFormen.has("bericht" as FormKind));
wahr("der Aufmacher kann Prosa sein", aufmacherFormen.has("prose" as FormKind));
// Vorher lief der Rest in einem FESTEN Zyklus — jede Ausgabe hatte dieselbe
// Gestalt. Zwei Ausgaben duerfen sich jetzt unterscheiden.
const gestalt = new Set(Array.from({ length: 200 }, () =>
  baueBesetzung(7, false, false).map((a) => a.form).join(",")));
wahr("zwei Ausgaben haben nicht dieselbe Gestalt", gestalt.size > 20);
// Gegenprobe: Trotz Ziehen muss die Mischung stimmen — fuenf Berichte
// hintereinander waeren keine Seite.
const formenVerteilung = Array.from({ length: 200 }, () => baueBesetzung(7, false, false))
  .flat().map((a) => a.form);
for (const f of ["bericht", "prose", "meldung", "poem"]) {
  wahr(`„${f}" kommt in der Mischung vor`, formenVerteilung.includes(f as FormKind));
}

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

// ── 6b · Die Wortbank ist der eigentliche Hebel ─────────────────────────────
// Gemeldet: „Die Varianz der Texte ist immer noch gering." Die Regler waren
// seit 4.245.0 in Ordnung, aber die Ansicht rief EINMAL `loadBank()` und gab
// dieselbe Bank an alle Beiträge einer Ausgabe.
//
// Ton, Rhythmus und Struktur FORMEN nur; die Bank bestimmt, WOVON ein Text
// handelt — sie liefert Substantive, Verben und Bilder. Acht Texte aus
// derselben Bank handeln von denselben Dingen, egal wie die Regler stehen.
// Deshalb ist das der grössere Hebel als alle Regler zusammen.
// Bis 4.310 stand hier „genau EIN Preset je Beitrag". Das war der Fortschritt
// gegenueber „eine Bank fuer alle" — und die naechste Enge: Abwechslung
// zwischen den Artikeln, aber nie eine Kollision im selben Satz.
wahr("die Ansicht zieht ein bis drei Presets je Beitrag", /const zahl = presetZahl\(\);/.test(ansicht));
wahr("und mischt sie zu einer Bank", /buildMergedBank\(gezogen\.map/.test(ansicht));
wahr("bei einem Preset wird nicht gemischt", /gezogen\.length === 1 \? gezogen\[0\]!\.bank/.test(ansicht));
// Und zwar OHNE Zurücklegen. Mit Zurücklegen kam bei acht Beiträgen im Mittel
// nur auf 85 % der Plätze eine noch nicht benutzte Bank — bei einundfünfzig
// vorhandenen ist das eine Wiederholung ohne Grund.
wahr("und zwar ohne Zurücklegen", /presetBeutel\.pop\(\)/.test(ansicht));
ist("und nicht mehr eine Bank für alle",
  /const bank = loadBank\(\);/.test(ansicht), false);
wahr("die eigene Bank bleibt als Rückfall", /grundBank/.test(ansicht));
// Gegenprobe: Ohne die Preset-Liste waere die Regel oben wirkungslos.
wahr("die Preset-Liste wird ueberhaupt geholt", /getAllPresets\(\)/.test(ansicht));

// Ideen und Welt. Die Welt bewegt sich nur, wenn jemand sie anstoesst — sonst
// zieht der Weltwuerfel jede Ausgabe aus demselben eingefrorenen Zustand.
wahr("der Ideengenerator wird benutzt", /generateIdeaBatch/.test(ansicht));
wahr("die Welt wird einen Tag weitergedreht", /worldTick\(\)/.test(ansicht));
wahr("und das Erzeugte faellt in die Welt zurueck", /worldLogGeneration\(ctx\)/.test(ansicht));

// Die Anzeige, was benutzt wurde. Ohne sie ist der Autopilot eine Kiste, in
// die man oben drueckt: Wer die Ausgaben einfoermig findet, kann nicht sehen,
// woran es liegt.
wahr("es gibt ein Herkunftsprotokoll", /Was dieser Durchlauf benutzt hat/.test(ansicht));
// Die drei Lücken, die den Autopiloten einförmig gemacht haben — geprüft am
// Quelltext der Ansicht, weil die Erzeugungsschleife dort steht:
//
// 1. Gezählt wurde die GEWÜNSCHTE Quelle. War der Vorrat leer, stand im
//    Protokoll trotzdem „Sammler-Vorrat", obwohl die Welt geliefert hatte.
wahr("gezählt wird die tatsächliche Quelle", /quellenZaehler\.set\(erg\.quelle/.test(ansicht));
wahr("und nicht mehr die gewünschte", !/quellenZaehler\.set\(a\.quelle/.test(ansicht));
// 2. Der Ideengenerator lief OHNE Konfiguration — also in seiner zahmsten
//    Einstellung. Eigene Profile und der Divergenz-Regler kamen nie an.
wahr("der Ideengenerator bekommt ein Profil", /generateIdeaBatch\(1, ip \?/.test(ansicht));
wahr("und läuft nicht mehr nackt", !/generateIdeaBatch\(1\)/.test(ansicht));
// 3. Die Omnikognition war überhaupt nicht angeschlossen — dabei liefert sie
//    als einzige Quelle eine eigene WORTBANK aus Sinneskanälen.
wahr("die Wahrnehmung ist eine Quelle", /quelle: "wahrnehmung"/.test(ansicht));
wahr("sie setzt ihre eigene Wortbank", /bank = ps\.bank/.test(ansicht));
wahr("und ihre eigene Perspektive", /perspective: ps\.perspective/.test(ansicht));
// Die Form gehört zum Platz, nicht zur Wahrnehmung — sie darf NICHT
// überschrieben werden.
wahr("die Form bleibt beim Platz", !/form: ps\.form/.test(ansicht));

// Die Varianzanzeige: Sie ist die Antwort auf „immer wieder ähnliche
// Beiträge" und muss deshalb im Protokoll stehen — mit Balken, Zahl UND
// Belegstellen. Eine Farbe ohne Begründung wäre ein Urteil.
wahr("die Varianz wird gemessen", /varianzBericht\(/.test(ansicht));
wahr("und farbig angezeigt", /va-fuell va-/.test(ansicht));
wahr("die ähnlichsten Paare werden benannt", /Ähnlichste Paare/.test(ansicht));
wahr("und die Vielfalt der Einstellungen dazu", /zeile\("Vielfalt"/.test(ansicht));

for (const feld of ["4W-Herkunft", "4W je Beitrag", "Wortbänke", "Formen", "Korpus", "Welt", "Nicht benutzt"]) {
  wahr(`das Protokoll nennt „${feld}"`, ansicht.includes(`zeile("${feld}"`));
}

// ── 6c · Der Platz bestimmt die Laenge ──────────────────────────────────────
// Gemeldet: Leerstellen auf der Zeitungsseite. Die Vermutung war, der
// Textlaengenregler werde nicht genutzt. Er WIRD gesetzt — aber `bericht` und
// `meldung` kehren in buildStory zurueck, BEVOR enforceWordTarget laeuft.
// Ausgerechnet die beiden Formen, die der Autopilot am haeufigsten setzt,
// richteten sich nach keiner Vorgabe. Und die Wortzahlen selbst waren geraten:
// Niemand hatte ausgerechnet, wie viel Text eine Seite fasst.
wahr("eine Seite fasst mehr als 500 Woerter", WOERTER_JE_SEITE > 500);
wahr("zwei Seiten tragen mehr als eine", platzBudget(2, 8) > platzBudget(1, 8));
wahr("mehr Beitraege kosten Platz fuer Ueberschriften", platzBudget(1, 12) < platzBudget(1, 3));
wahr("der Korrekturfaktor wirkt", platzBudget(1, 8, 1.4) > platzBudget(1, 8, 1));
wahr("und ist nach oben und unten geklammert",
  platzBudget(1, 8, 99) === platzBudget(1, 8, 2.5) && platzBudget(1, 8, 0.01) === platzBudget(1, 8, 0.4));
wahr("das Budget wird nie null", platzBudget(1, 99, 0.4) > 0);

// Die Verteilung. Ein Haiku mit 300 Woertern ist keins mehr, ein Bericht mit 40
// hat keinen Vorspann — ohne Formgrenzen zerstoerte die Verteilung die Formen,
// um das Budget zu treffen.
const auf = [
  { form: "bericht", woerter: 300 }, { form: "haiku", woerter: 18 },
  { form: "prose", woerter: 150 }, { form: "meldung", woerter: 60 },
];
const v = verteileLaengen(auf, 900);
ist("es bleiben gleich viele Beitraege", v.length, 4);
for (const x of v) {
  const [min, max] = LAENGEN_GRENZEN[x.form]!;
  wahr(`„${x.form}" bleibt in seinen Grenzen (${x.woerter})`, x.woerter >= min && x.woerter <= max);
}
// Das Verhaeltnis bleibt: Der Aufmacher bleibt Aufmacher, der Kasten Kasten.
wahr("der Bericht bleibt der laengste", v[0]!.woerter > v[2]!.woerter);
wahr("das Haiku bleibt das kuerzeste", v[1]!.woerter < v[3]!.woerter);
// Ein grosses Budget darf die Formen nicht sprengen.
const gross = verteileLaengen(auf, 5000);
wahr("auch bei riesigem Budget bleibt das Haiku ein Haiku",
  gross[1]!.woerter <= LAENGEN_GRENZEN.haiku![1]);
// Und ein winziges darf den Bericht nicht ausloeschen.
const klein = verteileLaengen(auf, 100);
wahr("auch bei winzigem Budget behaelt der Bericht sein Mindestmass",
  klein[0]!.woerter >= LAENGEN_GRENZEN.bericht![0]);
ist("eine leere Liste ergibt nichts", verteileLaengen([], 900).length, 0);

// Die Selbstkorrektur. Gedaempft: Ein voller Ausgleich schwingt — eine zu
// volle Seite fuehrte zum Untermass und umgekehrt.
wahr("eine zu leere Seite erhoeht den Faktor", neuerFaktor(1, 60) > 1);
wahr("eine zu volle senkt ihn", neuerFaktor(1, 140) < 1);
wahr("bei Punktlandung bleibt er nahezu gleich", Math.abs(neuerFaktor(1, 96) - 1) < 0.01);
// Gegenprobe zur Daempfung: Der Ausschlag muss KLEINER sein als der Fehler,
// sonst schwingt es.
const roh60 = 1 * (96 / 60);
wahr("die Korrektur ist gedaempft", neuerFaktor(1, 60) < roh60);
wahr("der Faktor bleibt geklammert", neuerFaktor(1, 1) <= 2.5 && neuerFaktor(1, 200) >= 0.4);
wahr("die Kalibrierung wandert in die Projektdatei", KALIB_KEY.startsWith("divergenz_"));

// Bericht auf Laenge: ABSATZWEISE, nicht satzweise. Satzweise naehme ihm Fakten
// aus dem Zusammenhang — genau deshalb ist er in buildStory ausgenommen.
const bericht = [
  "ORT · RESSORT", "Eine Klinik wechselt den Namen",
  "Am Tag der Sonnenfinsternis wurde bekannt, dass rund 180 Gemeinden betroffen sind.",
  "Absatz vier mit einigen Woertern darin, die zusammen etwas Platz brauchen.",
  "Absatz fuenf mit einigen Woertern darin, die zusammen etwas Platz brauchen.",
  "Absatz sechs mit einigen Woertern darin, die zusammen etwas Platz brauchen.",
  "Faktenkasten\n· Betroffen: 180 Gemeinden",
].join("\n\n");
const gekuerzterBericht = kuerzeBericht(bericht, 40);
wahr("die Dachzeile bleibt", gekuerzterBericht.startsWith("ORT · RESSORT"));
wahr("die Schlagzeile bleibt", gekuerzterBericht.includes("Eine Klinik wechselt den Namen"));
wahr("der Vorspann bleibt", gekuerzterBericht.includes("Am Tag der Sonnenfinsternis"));
// Der Faktenkasten steht am ENDE und darf trotzdem nicht wegfallen — er ist
// kein Rumpfabsatz, sondern Teil der Form.
wahr("der Faktenkasten bleibt", gekuerzterBericht.includes("Faktenkasten"));
wahr("hintere Absaetze fallen weg", !gekuerzterBericht.includes("Absatz sechs"));
wahr("es wird wirklich kuerzer", gekuerzterBericht.length < bericht.length);
// Gegenprobe: Ein grosszuegiges Ziel darf NICHTS wegnehmen.
ist("bei genug Platz bleibt alles stehen", kuerzeBericht(bericht, 9999), bericht);
ist("ein zu kurzer Text wird nicht angefasst", kuerzeBericht("A\n\nB", 5), "A\n\nB");

// ── 6d · Mehrere Presets in eine Bank ───────────────────────────────────────
// Der Autopilot zog je Beitrag GENAU EIN Preset. Das gibt Abwechslung zwischen
// den Artikeln, aber nie die Kollision INNERHALB eines Textes. Anlass ist ein
// von Hand mit drei gemischten Presets erzeugter Text (Bergwelt + Formalismus
// + Griechische Tragoedie), der beste bisher — Saetze, in denen zwei Register
// aufeinandertreffen, entstehen nur aus einer gemischten Bank.
{
  const zahlen = Array.from({ length: 2000 }, () => presetZahl());
  wahr("es gibt einstimmige Beitraege", zahlen.includes(1));
  wahr("es gibt zweistimmige", zahlen.includes(2));
  wahr("es gibt dreistimmige", zahlen.includes(3));
  ist("und nie mehr als drei", zahlen.filter((x) => x > 3).length, 0);
  ist("und nie weniger als eins", zahlen.filter((x) => x < 1).length, 0);
  // Ein Drittel bleibt einstimmig: Wer alles mischt, hat wieder nur eine Sorte
  // Text. Die Gegenprobe zur Mischung ist also, dass sie NICHT immer greift.
  const einzeln = zahlen.filter((x) => x === 1).length / zahlen.length;
  wahr(`rund ein Drittel bleibt einstimmig (${Math.round(einzeln * 100)} %)`, einzeln > 0.25 && einzeln < 0.45);
  const gemischt = zahlen.filter((x) => x > 1).length / zahlen.length;
  wahr(`und die Mehrheit ist gemischt (${Math.round(gemischt * 100)} %)`, gemischt > 0.5);
  // Ohne Zufall pruefbar: Die Schwellen muessen in der richtigen Reihenfolge
  // liegen, sonst kaeme bei kleinem Wurf die groesste Mischung heraus.
  ist("ein kleiner Wurf ergibt eine Stimme", presetZahl(() => 0.1), 1);
  ist("ein mittlerer zwei", presetZahl(() => 0.5), 2);
  ist("ein grosser drei", presetZahl(() => 0.9), 3);
}
// Der Name nennt alle beteiligten Baenke — sonst steht im Protokoll eine Bank,
// aus der der Text gar nicht allein stammt.
ist("eine Bank steht allein da", mischName(["Bergwelt"]), "Bergwelt");
ist("drei werden genannt", mischName(["Bergwelt", "Formalismus", "Tragödie"]), "Bergwelt + Formalismus + Tragödie");
ist("ohne Bank ein Ersatz", mischName([]), "eigene Bank");

// ── 7b · Der leere Warnkasten ───────────────────────────────────────────────
// Gemeldet mit Bildschirmfoto: ein roter Balken ohne Text ueber den Knoepfen.
// Der Hinweis auf die Beitragsgrenze wird erst bei Bedarf gefuellt — der Rahmen
// stand aber schon da, weil .sam-warn Rand, Fuellung und Hintergrund hat. Ein
// Warnkasten ohne Text ist keine Warnung, sondern sieht nach Defekt aus.
const css = readFileSync("src/ui/theme.css", "utf8");
wahr("leere Warnkaesten werden ausgeblendet", /\.sam-warn:empty\{display:none\}/.test(css));
// Gegenprobe: Die Regel muss VOR der Grundregel wirkungslos sein, also danach
// stehen — sonst ueberschreibt die Grundregel sie wieder.
wahr("und die Regel steht hinter der Grundregel",
  css.indexOf(".sam-warn:empty") > css.indexOf(".sam-warn{"));
// Und der Kasten wird in der Ansicht wirklich leer gelassen, wenn nichts zu
// melden ist — sonst braeuchte es die CSS-Regel gar nicht.
wahr("die Ansicht laesst ihn im Regelfall leer", /grenze\.textContent = gewuenscht > max/.test(ansicht));

// ── 8 · Der Titel ───────────────────────────────────────────────────────────
ist("Wer und Was zusammen", titelAus({ who: "Ein Ermittler", what: "wartet" }), "Ein Ermittler wartet");
ist("ohne Kontext ein Ersatz", titelAus({ who: "", what: "" }), "Ohne Titel");
wahr("lange Titel werden gekürzt", titelAus({ who: "w".repeat(90), what: "x" }).length <= 61);
wahr("und enden mit Auslassung", titelAus({ who: "wort ".repeat(30), what: "x" }).endsWith("…"));

// ── Ergebnis ────────────────────────────────────────────────────────────────
console.log(`Prüfstand Autopilot — ${geprueft} Prüfungen (ohne API-Aufruf):`);
zeilen.forEach((z) => console.log(z));
const proc = globalThis as unknown as { process?: { exit: (c: number) => void } };

// ── 9 · Die Streuung ist rechnerisch ausgereizt ─────────────────────────────
// Gewünscht: „Hier kommt es mir nur auf die Varianz an. Diese soll maximal
// sein."
//
// Gemessen wurde vorher, nicht danach. 25 Läufe zu je acht Beiträgen, durch
// den Varianzbericht:
//
//   Varianzwert 93,4 % · Formen 49,5 % · Wortbänke 83,5 % · Quellen 37,5 %
//
// Zwei Ursachen, beide dieselbe Bauart: eine handgeführte Liste.
//
//   Formen   Der „Beutel" hatte neun Plätze, aber nur FÜNF Formen. Reim,
//            Gedicht-Strang, Szene/Dialog und Multi-Shot konnte der Autopilot
//            gar nicht erzeugen. Und gezogen wurde MIT Zurücklegen — ein
//            Beutel, der keiner war.
//   Quellen  Der Themenpool war nie angeschlossen: fünf Quellen hier gegen
//            sechs im Studio.
//
// Die Obergrenze ist der Anteil verschiedener Werte, also min(Auswahl, n)/n.
// Genau daran wird gemessen — nicht an einer Wunschzahl.
{
  const anteil = (l: string[]): number => new Set(l).size / l.length;
  const mittel = (l: number[]): number => l.reduce((a, b) => a + b, 0) / l.length;
  const lauf = (n: number, v: boolean, b: boolean, t: boolean): { f: number; q: number } => {
    const fs: number[] = [], qs: number[] = [];
    for (let i = 0; i < 200; i++) {
      const a = baueBesetzung(n, v, b, Math.random, 30, t);
      fs.push(anteil(a.map((x) => x.form)));
      qs.push(anteil(a.map((x) => String(x.quelle))));
    }
    return { f: mittel(fs), q: mittel(qs) };
  };

  // Acht Beiträge, acht seitentaugliche Formen: jede höchstens einmal.
  const acht = lauf(8, true, true, true);
  ist(`acht Beiträge tragen acht Formen (${Math.round(acht.f * 100)} %)`, acht.f, 1);
  // Sechs Quellen auf acht Plätzen — mehr als sechs verschiedene gibt es nicht.
  ist(`und sechs Quellen auf acht Plätzen (${Math.round(acht.q * 100)} %)`, Math.round(acht.q * 8), 6);
  // Sechs Plätze, sechs Quellen: keine einzige Wiederholung.
  const sechs = lauf(6, true, true, true);
  ist(`sechs Beiträge, sechs Quellen (${Math.round(sechs.q * 100)} %)`, sechs.q, 1);

  // Jede Form der Maschine muss vorkommen können — bis auf die eine, die
  // ausdrücklich nicht auf die Seite gehört.
  const gesehen = new Set<string>();
  for (let i = 0; i < 400; i++) baueBesetzung(9, true, true, Math.random, 30, true).forEach((a) => gesehen.add(a.form));
  ist("alle seitentauglichen Formen kommen vor", [...SEITEN_FORMEN].filter((f) => !gesehen.has(f)).join(","), "");
  ist("und keine, die nicht auf die Seite gehört", [...gesehen].filter((f) => !(SEITEN_FORMEN as string[]).includes(f)).join(","), "");
  // Die Liste selbst darf nicht wieder veralten: Sie wird aus FORM_OPTS
  // abgeleitet, nicht gepflegt. Fällt eine Form aus beiden heraus, fällt das
  // hier auf.
  ist("die Seitenformen sind alle Formen bis auf video",
    (werte(FORM_OPTS) as string[]).filter((f) => !(SEITEN_FORMEN as string[]).includes(f)).join(","), "video");

  // Der Themenpool ist eine Quelle — aber nur mit Funden.
  const mitThema = new Set(baueBesetzung(9, true, true, Math.random, 30, true).map((a) => String(a.quelle)));
  const ohneThema = new Set(baueBesetzung(9, true, true, Math.random, 30, false).map((a) => String(a.quelle)));
  wahr("mit Funden kommt der Themenpool vor", mitThema.has("thema"));
  wahr("ohne Funde bleibt er draußen", !ohneThema.has("thema"));
}

if (fails.length) {
  console.error(`\n❌ ${fails.length} Fehler im Autopiloten:`);
  fails.forEach((f) => console.error("  - " + f));
  proc.process?.exit(1);
} else {
  console.log(`\n✅ Autopilot: alle ${geprueft} Prüfungen bestanden.`);
}
