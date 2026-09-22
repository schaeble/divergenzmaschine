// Prüfstand Textexport (4.368.0).
//
// Was hier schiefgehen kann, sieht man der Datei erst an, wenn man sie öffnet:
// ein Gedicht, dessen Zeilen Markdown zu einem Absatz verklebt; eine Zeile
// „1902. Zeit", die zur nummerierten Liste wird; ein Kopf, der Form und Regler
// verliert. Jede Prüfung hat deshalb eine Gegenprobe — der ungeschützte Weg
// muss den Fehler zeigen, sonst prüft die Prüfung nichts.
import {
  textDatei, mdText, mdZeileSchuetzen, schatzkammerDatei, dateiname, einstellungsZeile,
} from "../src/features/textexport";
import type { Treasure } from "../src/features/treasury";

const fails: string[] = [];
let geprueft = 0, bestanden = 0;
const ist = (name: string, wert: unknown, soll: unknown): void => {
  geprueft++;
  if (wert === soll) bestanden++; else fails.push(`${name}: „${String(wert)}“ — erwartet „${String(soll)}“`);
};
const wahr = (name: string, b: boolean, zusatz = ""): void => ist(name + (zusatz ? ` (${zusatz})` : ""), b, true);

/** Grobe Nachbildung dessen, was ein Markdown-Leser als Blockanfang nimmt.
 *  Absichtlich streng: lieber eine Warnung zu viel. */
const liestAlsAuszeichnung = (zeile: string): boolean =>
  /^\s*(#{1,6}\s|>|[-+*]\s|\d+[.)](\s|$)|={3,}|-{3,}|\|)/.test(zeile);

const GEDICHT = "Der Hafen schweigt\nim Nebel zählt ein Wächter\ndie Fenster nach\n\nZweiter Absatz\nmit zwei Zeilen";

// ── 1 · Zeilenbrüche bleiben ────────────────────────────────────────────────
{
  const md = mdText(GEDICHT);
  const zeilen = md.split("\n");
  // Jede Zeile innerhalb eines Absatzes endet mit zwei Leerzeichen = harter Umbruch.
  const innen = zeilen.filter((z, i) => z !== "" && zeilen[i + 1] !== undefined && zeilen[i + 1] !== "");
  wahr("jede Gedichtzeile trägt einen harten Umbruch", innen.length === 3 && innen.every((z) => z.endsWith("  ")), String(innen.length));
  ist("Absätze bleiben getrennt", md.split("\n\n").length, 2);
  // Gegenprobe: roh übernommen hätte keine Zeile den Umbruch.
  wahr("Gegenprobe: der Rohtext hat keine harten Umbrüche", !GEDICHT.split("\n").some((z) => z.endsWith("  ")));
}

// ── 2 · Zeilenanfänge, die Markdown umdeuten würde ──────────────────────────
{
  const heikel = ["1902. Zeit verging", "# kein Titel", "- kein Punkt", "> kein Zitat", "* kein Stern", "+ kein Plus", "=====", "| keine Tabelle", "3) drei"];
  for (const z of heikel) {
    wahr(`Gegenprobe: „${z}“ wird roh umgedeutet`, liestAlsAuszeichnung(z));
    wahr(`„${z}“ ist geschützt`, !liestAlsAuszeichnung(mdZeileSchuetzen(z)), mdZeileSchuetzen(z));
  }
  // Mitten im Satz darf nichts entwertet werden, was harmlos ist.
  ist("Gedankenstrich im Satz bleibt", mdZeileSchuetzen("Er ging – und kam nicht."), "Er ging – und kam nicht.");
  ist("Zahl ohne Punkt bleibt", mdZeileSchuetzen("1902 war ein Jahr"), "1902 war ein Jahr");
  ist("Hervorhebung wird entwertet", mdZeileSchuetzen("ein *Stern* und _Strich_"), "ein \\*Stern\\* und \\_Strich\\_");
  ist("Rückstrich wird verdoppelt", mdZeileSchuetzen("a\\b"), "a\\\\b");
}

// ── 3 · Der Kopf ────────────────────────────────────────────────────────────
const KOPF = {
  titel: "Die Fenster am Hafen", form: "Prosa", who: "ein Wächter", where: "Hafen", when: "", what: "zählen",
  datum: "2026-09-22 14:03", version: "4.368.0",
  einstellungen: { preset: "nebel", tone: "Melancholisch", structure: "", lenTarget: "180", markovMode: "aus" },
};
{
  const txt = textDatei("Ein Text.", KOPF, "txt");
  wahr("TXT: Titel steht oben", txt.startsWith("Die Fenster am Hafen\n===="));
  wahr("TXT: Form, Datum, Version im Kopf", /Form: Prosa · Datum: 2026-09-22 14:03 · Divergenzmaschine 4\.368\.0/.test(txt));
  wahr("TXT: 4W ohne leeres Wann", /Wer: ein Wächter · Wo: Hafen · Was: zählen/.test(txt) && !/Wann:/.test(txt));
  wahr("TXT: Regler lesbar benannt", /Preset: nebel · Ton: Melancholisch · Länge: 180/.test(txt));
  wahr("TXT: leere und unbenannte Regler bleiben draußen", !/Struktur:/.test(txt) && !/markov/i.test(txt));
  wahr("TXT: Text am Ende, mit Zeilenende", txt.endsWith("\n\nEin Text.\n"));
  ist("ohne Kopf nur der Text", textDatei("  Nur das.  ", {}, "txt"), "Nur das.\n");

  const md = textDatei(GEDICHT, KOPF, "md");
  wahr("MD: Titel als Überschrift", md.startsWith("# Die Fenster am Hafen\n\n"));
  wahr("MD: Kopfzeilen kursiv", /^\*Form: Prosa · .*\*  $/m.test(md));
  wahr("MD: Gedicht behält Umbrüche", md.includes("Der Hafen schweigt  \nim Nebel"));
  ist("leere Einstellungen geben keine Zeile", einstellungsZeile({}), "");
  ist("fehlende Einstellungen geben keine Zeile", einstellungsZeile(undefined), "");
}

// ── 4 · Schatzkammer ────────────────────────────────────────────────────────
{
  const list: Treasure[] = [
    { t: "Erster Text.", d: "2026-09-01 10:00", who: "A", form: "prose", set: { tone: "Heiter" } },
    { t: "Zweiter\nText.", d: "2026-09-02 11:00", form: "haiku", secret: true },
    { t: "Alter Eintrag ohne alles.", d: "2025-01-01 09:00" },
  ];
  const name = (x: Treasure): string => ({ prose: "Prosa", haiku: "Haiku" } as Record<string, string>)[x.form || ""] || "—";
  const txt = schatzkammerDatei(list, "txt", name, "4.368.0");
  wahr("Sammlung: Kopf mit Anzahl", txt.startsWith("Schatzkammer — 3 Texte · Divergenzmaschine 4.368.0"));
  wahr("Sammlung: Form mitgenommen", /# 1\nForm: Prosa · Datum: 2026-09-01 10:00/.test(txt));
  wahr("Sammlung: Regler mitgenommen", /Ton: Heiter/.test(txt));
  wahr("Sammlung: Tresor gekennzeichnet", /# 2\nForm: Haiku · Datum: 2026-09-02 11:00 · Tresor/.test(txt));
  wahr("Sammlung: alter Eintrag ohne Regler geht durch", txt.includes("Alter Eintrag ohne alles."));
  ist("Sammlung: alle drei Texte", (txt.match(/^# \d+$/gm) || []).length, 3);
  const md = schatzkammerDatei(list, "md", name, "4.368.0");
  ist("Sammlung MD: drei Abschnitte", (md.match(/^## \d+$/gm) || []).length, 3);
  wahr("Sammlung MD: Haiku-Zeilen getrennt", md.includes("Zweiter  \nText."));
  ist("leere Sammlung bleibt lesbar", schatzkammerDatei([], "txt", name).trim(), "Schatzkammer — 0 Texte");
}

// ── 5 · Dateinamen ──────────────────────────────────────────────────────────
{
  const tag = new Date("2026-09-22T12:00:00Z");
  ist("Umlaute umgeschrieben", dateiname("divergenz", "Über die Brücke — Größe!", "txt", tag), "divergenz_ueber-die-bruecke-groesse_2026-09-22.txt");
  ist("ohne Titel nur Stamm und Tag", dateiname("schatzkammer", "", "md", tag), "schatzkammer_2026-09-22.md");
  const lang = dateiname("divergenz", "a ".repeat(60), "txt", tag);
  wahr("lange Titel gekürzt, ohne Strich am Ende", lang.length < 70 && !/-_/.test(lang), lang);
  wahr("nur sichere Zeichen", /^[a-z0-9_.-]+$/.test(dateiname("d", "Straße «Zitat» / Pfad\\x:y", "txt", tag)));
}

console.log(`Prüfstand Textexport — ${geprueft} Prüfungen, ${bestanden} bestanden`);
const proc = globalThis as unknown as { process?: { exit: (c: number) => void } };
if (fails.length) {
  console.error(`\n❌ Textexport: ${fails.length} Fehler:`);
  fails.forEach((f) => console.error("  - " + f));
  proc.process?.exit(1);
} else {
  console.log(`\n✅ Textexport: alle ${geprueft} Prüfungen bestanden.`);
}
