// Prüfstand Bildwelt. Kein API-Aufruf, kein Bild, kein Browser.
//
// Schwerpunkt: die Doppelt-Sperre und die Wortsäuberung. Beide sind Stellen,
// an denen ein Fehler still bleibt — ein doppelt gelesenes Bild kostet Geld und
// verzerrt die Bank, ein durchgerutschtes „Aufnahme“ taucht Wochen später
// mitten in einem Text auf, ohne dass die Quelle noch erkennbar wäre.
import { JSDOM } from "jsdom";
const dom = new JSDOM("<!doctype html><html><body></body></html>", { url: "https://x.test/" });
(globalThis as unknown as Record<string, unknown>).localStorage = dom.window.localStorage;

import {
  modi, istModus, MODI_VORGABE, leseSchluessel, offeneLesungen,
  leseEtiketten, etikettenStand, baueBank, filtere,
  ladeBildwelt, sichereBildwelt, mischeBildwelt, BILDWELT_KEY,
  baueBankPrompt, leseBaenke, verraetBildWort, maxTokenBaenke,
  type Bildernte,
} from "../src/features/bildwelt";

const fails: string[] = [];
const zeilen: string[] = [];
let geprueft = 0;
const ist = (name: string, wert: unknown, soll: unknown): void => {
  geprueft++;
  if (wert === soll) zeilen.push(`  ✓ ${name}`);
  else { zeilen.push(`  ✗ ${name}`); fails.push(`${name}: „${String(wert)}“ — erwartet „${String(soll)}“`); }
};
const wahr = (name: string, b: boolean): void => ist(name, b, true);

const ernte = (abdruck: string, modus: string, etiketten: string[] = [], nomen = ["Bank"]): Bildernte =>
  ({ abdruck, name: "IMG.jpg", modus, etiketten, nomen, verben: ["sitzen"], bilder: ["Rost an der Kante"], gelesen: 1 });

// ── 1 · Die Modi ────────────────────────────────────────────────────────────
// Keine eigene Liste: Zwei Listen, die dasselbe meinen, laufen auseinander.
ist("es gibt sechs Modi", modi().length, 6);
wahr("jeder hat einen Namen", modi().every((m) => !!m.label && m.label !== m.id));
wahr("bureau ist dabei", istModus("bureau"));
ist("ein erfundener Modus nicht", istModus("traumhaft"), false);
wahr("die Vorgabe besteht aus echten Modi", MODI_VORGABE.every(istModus));
ist("und aus zweien, nicht aus sechs", MODI_VORGABE.length, 2);

// ── 2 · Die Doppelt-Sperre ──────────────────────────────────────────────────
// Der Schlüssel ist Abdruck UND Modus. Eine Sperre nur über den Abdruck
// verhinderte genau die Mehrfachlesung, die den Reiz ausmacht.
wahr("derselbe Abdruck in anderem Modus ist ein anderer Schlüssel",
  leseSchluessel("aa", "bureau") !== leseSchluessel("aa", "body"));
ist("Groß- und Kleinschreibung des Abdrucks egal",
  leseSchluessel("AA", "bureau"), leseSchluessel("aa", "bureau"));

const vorhanden = [ernte("aa", "bureau")];
const o1 = offeneLesungen(["aa"], ["bureau"], vorhanden);
ist("was schon gelesen ist, fällt weg", o1.length, 0);
const o2 = offeneLesungen(["aa"], ["bureau", "body"], vorhanden);
ist("derselbe Abdruck in neuem Modus bleibt offen", o2.length, 1);
ist("und zwar im richtigen Modus", o2[0]?.modus, "body");
// Gegenprobe: Ein neues Bild MUSS durchkommen — sonst prüfte die Regel nur,
// dass nie etwas gelesen wird.
ist("ein unbekanntes Bild bleibt offen", offeneLesungen(["bb"], ["bureau"], vorhanden).length, 1);
ist("zwei Bilder in zwei Modi ergeben vier Lesungen",
  offeneLesungen(["bb", "cc"], ["bureau", "body"], []).length, 4);
// Doppelte innerhalb DESSELBEN Stapels: Wer eine Datei zweimal auswählt, soll
// sie nicht zweimal bezahlen.
ist("derselbe Abdruck zweimal im Stapel zählt einmal",
  offeneLesungen(["bb", "bb"], ["bureau"], []).length, 1);
ist("ein leerer Stapel ergibt nichts", offeneLesungen([], ["bureau"], []).length, 0);
ist("ohne Modus ebenfalls nichts", offeneLesungen(["bb"], [], []).length, 0);

// ── 3 · Etiketten ───────────────────────────────────────────────────────────
// Ein Etikett ist eine Zeichenkette und sonst nichts. „Gedanken1“ ist so
// gültig wie „Kreta 2011“ — die Maschine deutet nichts davon.
ist("ein einfaches Etikett", leseEtiketten("Gedanken1").join("|"), "Gedanken1");
ist("mehrere durch Komma", leseEtiketten("Kreta 2011, Gedanken1").join("|"), "Kreta 2011|Gedanken1");
ist("Leerraum wird geglättet", leseEtiketten("  Kreta   2011  ").join("|"), "Kreta 2011");
ist("Doppelte fallen weg", leseEtiketten("a, A, a").length, 1);
ist("Leeres fällt weg", leseEtiketten(" , , ").length, 0);
ist("nichts ergibt nichts", leseEtiketten("").length, 0);
wahr("es gibt eine Obergrenze", leseEtiketten(Array.from({ length: 30 }, (_, i) => "t" + i).join(",")).length <= 8);

const st = etikettenStand([ernte("a", "bureau", ["Kreta"]), ernte("b", "bureau", ["Kreta", "Gedanken1"])]);
ist("das häufigste Etikett steht vorn", st[0]?.name, "Kreta");
ist("mit der richtigen Anzahl", st[0]?.n, 2);
ist("und das seltenere dahinter", st[1]?.n, 1);

// ── 4 · Bank und Filter ─────────────────────────────────────────────────────
// Doppeltes fällt weg, und zwar nicht aus Ordnungsliebe: Ein Wort, das
// zwanzigmal im Vorrat steht, wird zwanzigmal so oft gezogen — dann läuft jeder
// Text durch dieselbe Stelle.
const b1 = baueBank([ernte("a", "bureau", [], ["Bank", "Hut"]), ernte("b", "bureau", [], ["bank", "Uhr"])]);
ist("die Bank fasst zusammen", b1.nomen.length, 3);
wahr("und behält die erste Schreibung", b1.nomen.includes("Bank") && !b1.nomen.includes("bank"));
ist("eine leere Ernte ergibt eine leere Bank", baueBank([]).nomen.length, 0);

const alle = [ernte("a", "bureau", ["Kreta"]), ernte("b", "body", ["Kreta"]), ernte("c", "body", ["Küche"])];
ist("ohne Filter kommt alles", filtere(alle).length, 3);
ist("nach Modus", filtere(alle, { modi: ["body"] }).length, 2);
ist("nach Etikett", filtere(alle, { etiketten: ["kreta"] }).length, 2);
ist("beides zusammen", filtere(alle, { modi: ["body"], etiketten: ["Kreta"] }).length, 1);
// Leere Filter heißen „alles", nicht „nichts" — sonst stünde man beim ersten
// Öffnen vor einer leeren Ansicht und hielte die Ablage für kaputt.
ist("leere Filterlisten heißen alles", filtere(alle, { modi: [], etiketten: [] }).length, 3);

// ── 5 · Ablage ──────────────────────────────────────────────────────────────
wahr("die Bildwelt wandert in die Projektdatei", BILDWELT_KEY.startsWith("divergenz_"));
localStorage.removeItem(BILDWELT_KEY);
ist("ohne Eintrag ist sie leer", ladeBildwelt().length, 0);
sichereBildwelt([ernte("a", "bureau")]);
ist("Gesichertes kommt zurück", ladeBildwelt().length, 1);
localStorage.setItem(BILDWELT_KEY, "{kein json");
ist("kaputter Inhalt ergibt eine leere Ablage", ladeBildwelt().length, 0);
localStorage.setItem(BILDWELT_KEY, JSON.stringify([{ abdruck: "a", modus: "bureau", nomen: "kein array" }]));
ist("Unsinn in den Feldern ergibt Listen, keine Abstürze", ladeBildwelt()[0]?.nomen.length, 0);

// Eine Lesung, die es schon gibt, ERSETZT die alte: Ein zweiter Lauf über
// dasselbe Bild im selben Modus ist eine Korrektur, keine Verdopplung.
const m1 = mischeBildwelt([ernte("a", "bureau", [], ["Alt"])], [ernte("a", "bureau", [], ["Neu"])]);
ist("dieselbe Lesung ersetzt", m1.length, 1);
ist("und zwar mit dem neuen Inhalt", m1[0]?.nomen[0], "Neu");
ist("ein anderer Modus kommt dazu", mischeBildwelt([ernte("a", "bureau")], [ernte("a", "body")]).length, 2);
ist("eine Ernte ohne jedes Wort wird nicht abgelegt",
  mischeBildwelt([], [{ ...ernte("a", "bureau"), nomen: [], verben: [], bilder: [] }]).length, 0);
ist("ein erfundener Modus ebenfalls nicht", mischeBildwelt([], [ernte("a", "traumhaft")]).length, 0);
const viele = Array.from({ length: 10 }, (_, i) => ernte("x" + i, "bureau"));
ist("der Deckel greift", mischeBildwelt([], viele, 4).length, 4);
ist("und das Älteste fällt heraus", mischeBildwelt([], viele, 4)[0]?.abdruck, "x6");

// ── 6 · Der Prompt ──────────────────────────────────────────────────────────
const p = baueBankPrompt(["bureau", "body"]);
wahr("beide Modi stehen drin", /"bureau"/.test(p) && /"body"/.test(p));
wahr("ein nicht gewählter Modus nicht", !/"myth"/.test(p));
wahr("der Bildbezug ist verboten", /Kein Wort und keine Fügung darf verraten/.test(p));
wahr("Wörter statt Sätze werden verlangt", /Liefere WÖRTER, keine Sätze/.test(p));
wahr("Stimmungswörter sind ausgeschlossen", /melancholisch/.test(p));
wahr("Fügungen sollen kurz sein", /Keine ganzen Sätze/.test(p));
wahr("Erfinden ist verboten", /lieber\s+wenige Wörter als erfundene/.test(p));
wahr("ein Nutzerhinweis kommt hinein", baueBankPrompt(["bureau"], "nur Gegenstände").includes("nur Gegenstände"));
wahr("ein erfundener Modus wird gar nicht erst gefragt", !/traumhaft/.test(baueBankPrompt(["bureau", "traumhaft"])));

// ── 7 · Antwort auswerten ───────────────────────────────────────────────────
const gute = { bureau: { nomen: ["Bank", "Nummer"], verben: ["warten"], bilder: ["Rost an der Kante"] } };
const r1 = leseBaenke(gute, ["bureau"]);
ist("die Bank kommt an", r1.bureau?.nomen.length, 2);
ist("ein nicht gewählter Modus wird ignoriert", Object.keys(leseBaenke(gute, ["body"])).length, 0);

// Wörter, die die Herkunft verraten. Auf Wortebene strenger als beim Satz: Ein
// einzelnes „Aufnahme" im Vorrat taucht später mitten in einem Text auf.
for (const w of ["Bild", "Foto", "Aufnahme", "Kamera", "Vordergrund", "Betrachter", "Motiv", "Szene", "Selfie"]) {
  wahr(`Herkunftswort erkannt: ${w}`, verraetBildWort(w));
}
// Gegenprobe: Gewöhnliche Wörter dürfen NICHT hängenbleiben — sonst käme
// nichts mehr durch und die Sperre sähe trotzdem tadellos aus.
for (const w of ["Bank", "Bildhauer", "Ausbildung", "Hut", "Wolldecke", "Fensterbrett", "Einbildung"]) {
  ist(`kein Fehlalarm: ${w}`, verraetBildWort(w), false);
}
const r2 = leseBaenke({ bureau: { nomen: ["Bank", "Vordergrund", "Hut"], verben: [], bilder: [] } }, ["bureau"]);
ist("Herkunftswörter fliegen aus der Bank", r2.bureau?.nomen.length, 2);
wahr("und zwar das richtige", !r2.bureau?.nomen.includes("Vordergrund"));

// Ganze Sätze sind keine Fügungen, sondern fertige Ware.
const r3 = leseBaenke({ bureau: { nomen: [], verben: [], bilder: ["Rost an der Kante", "Der Rost sitzt seit Jahren an der Kante der Bank"] } }, ["bureau"]);
ist("eine Fügung bleibt, ein Satz nicht", r3.bureau?.bilder.length, 1);
ist("Aufzählungszeichen werden abgestreift",
  leseBaenke({ bureau: { nomen: ["- Bank"], verben: [], bilder: [] } }, ["bureau"]).bureau?.nomen[0], "Bank");
ist("Doppelte fallen weg",
  leseBaenke({ bureau: { nomen: ["Bank", "bank"], verben: [], bilder: [] } }, ["bureau"]).bureau?.nomen.length, 1);
for (const müll of [null, undefined, 42, "text", [], { bureau: "kein objekt" }]) {
  ist(`Unsinn ergibt nichts: ${JSON.stringify(müll) ?? "undefined"}`, Object.keys(leseBaenke(müll, ["bureau"])).length, 0);
}

wahr("der Deckel wächst mit der Modizahl", maxTokenBaenke(3) > maxTokenBaenke(1));
wahr("und bleibt unter dem Modell-Limit", maxTokenBaenke(99) <= 4096);
wahr("null Modi ergeben trotzdem eine gültige Zahl", maxTokenBaenke(0) > 0);

// ── Ergebnis ────────────────────────────────────────────────────────────────
console.log(`Prüfstand Bildwelt — ${geprueft} Prüfungen (ohne API-Aufruf):`);
zeilen.forEach((z) => console.log(z));
const proc = globalThis as unknown as { process?: { exit: (c: number) => void } };
if (fails.length) {
  console.error(`\n❌ ${fails.length} Fehler in der Bildwelt:`);
  fails.forEach((f) => console.error("  - " + f));
  proc.process?.exit(1);
} else {
  console.log(`\n✅ Bildwelt: alle ${geprueft} Prüfungen bestanden.`);
}
