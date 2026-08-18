// Prüfstand Bildsammler. Kein API-Aufruf, kein Bild, kein Browser.
//
// Der Schwerpunkt liegt auf dem Beutefilter, und zwar aus einem Grund: Ein
// Filter, der nie etwas verwirft, sieht genauso aus wie einer, der funktioniert.
// Deshalb steht zu jeder Prüfung, was durchgehen MUSS, auch eine, was hängen
// bleiben muss.
import { readFileSync } from "fs";
import {
  bildTokens, verraetBild, taugtSatz, beute, bauePrompt, leseErnte,
  maxToken, schaetzeLauf, zerlegeDatenUrl, VERRAETER, SAETZE_VORGABE,
  BILDVORRAT_KEY, taugtFund, mischeBildvorrat, ziehBildvorrat,
  baueAbschriftPrompt, leseAbschrift, maxTokenAbschrift, type BildFund,
} from "../src/features/bildsammler";
import { MODELLE } from "../src/features/lehrer";

const fails: string[] = [];
const zeilen: string[] = [];
let geprueft = 0;
const ist = (name: string, wert: unknown, soll: unknown): void => {
  geprueft++;
  if (wert === soll) zeilen.push(`  ✓ ${name}`);
  else { zeilen.push(`  ✗ ${name}`); fails.push(`${name}: „${String(wert)}“ — erwartet „${String(soll)}“`); }
};
const wahr = (name: string, b: boolean): void => ist(name, b, true);

// ── 1 · Bildtoken ───────────────────────────────────────────────────────────
// Fläche durch 750. Die Fläche entscheidet, nicht die Dateigröße.
ist("ein Megapixel kostet rund 1334 Token", bildTokens(1000, 1000), 1333);
ist("ein verkleinertes Querformat rund 1440", bildTokens(1200, 900), 1440);
wahr("das Doppelte an Fläche kostet doppelt",
  Math.abs(bildTokens(1200, 1800) - 2 * bildTokens(1200, 900)) <= 1);
ist("ein Bild ohne Maße kostet nichts", bildTokens(0, 900), 0);
ist("und negative Maße auch nicht", bildTokens(-100, -100), 0);

// ── 2 · Der Beutefilter ─────────────────────────────────────────────────────
// Was hängen bleiben MUSS. Genau diese Sätze schreibt ein Modell, das man um
// eine Bildbeschreibung bittet — und als Korpusfutter sind sie Gift: Jeder
// Eintrag begänne gleich, und die Maschine würfelte fortan „Das Bild zeigt“.
const gift = [
  "Das Bild zeigt einen älteren Mann auf einer Parkbank.",
  "Auf dem Foto sitzt eine Frau am Fenster und liest.",
  "Zu sehen ist eine Landstraße zwischen zwei Feldern.",
  "Man sieht den Regen auf dem Blechdach stehen.",
  "Im Vordergrund liegt ein umgestürzter Stuhl aus Holz.",
  "Der Betrachter blickt über die Schulter des Mannes hinweg.",
  "Die Aufnahme zeigt eine Halle mit hohen Fenstern und Staub.",
  "Links im Bild steht ein Fahrrad ohne Vorderrad an der Wand.",
  "Im Hintergrund verschwimmen die Umrisse einer Stadt im Dunst.",
  "Die Szene wurde bei schwachem Licht aufgenommen.",
  "Der Mann wird von der Seite fotografiert.",
  "Die Kamera steht tief über dem nassen Pflaster.",
];
for (const s of gift) wahr(`Bildbezug erkannt: „${s.slice(0, 42)}…“`, verraetBild(s));

// Was durchgehen MUSS. Ohne diese Gegenprobe könnte der Filter einfach alles
// verwerfen und sähe trotzdem tadellos aus.
const gut = [
  "Ein älterer Mann sitzt auf einer Parkbank und lüftet den Hut.",
  "Der Regen steht auf dem Blechdach und läuft nicht ab.",
  "Ein Fahrrad ohne Vorderrad lehnt an der Wand neben der Tür.",
  "Die Landstraße läuft zwischen zwei Feldern nach Norden.",
  "Der Staub in der Halle hängt zwischen den hohen Fenstern.",
  "Das Pflaster ist nass und gibt das Licht der Laternen zurück.",
  "Die Frau am Fenster hält das Buch weit von sich weg.",
  "Ein umgestürzter Stuhl aus Holz liegt auf der Seite.",
];
for (const s of gut) ist(`kein Bildbezug: „${s.slice(0, 42)}…“`, verraetBild(s), false);

// Wortgrenzen: Diese Wörter enthalten „Bild“ oder „Ansicht“, meinen aber etwas
// anderes. Ein zu grober Filter fräße sie mit.
for (const s of [
  "Der Bildhauer hat die Werkstatt am Kanal aufgegeben.",
  "Die Ausbildung dauerte vier Jahre und endete im Winter.",
  "Seine Einbildung hielt länger als das Fieber.",
  "Der Fotograf wohnte über der Wäscherei und ging selten aus.",
]) ist(`kein Fehlalarm: „${s.slice(0, 40)}…“`, verraetBild(s), false);

// ── 3 · Satztauglichkeit ────────────────────────────────────────────────────
ist("ein zu kurzer Satz taugt nicht", taugtSatz("Regen fällt."), false);
ist("eine Aufzählung ohne Verb auch nicht", taugtSatz("Stuhl, Tisch, Lampe, Fenster, Tür"), false);
ist("ein sehr langer Satz nicht", taugtSatz("wort ".repeat(80)), false);
wahr("ein normaler Satz schon", taugtSatz("Ein Fahrrad ohne Vorderrad lehnt an der Wand neben der Tür."));
ist("und ein Satz mit Bildbezug nie", taugtSatz("Das Bild zeigt ein Fahrrad an einer Wand ohne Rad."), false);

// ── 4 · Die Ernte als Ganzes ────────────────────────────────────────────────
const e1 = beute([...gut.slice(0, 4), ...gift.slice(0, 3)]);
ist("die brauchbaren Sätze bleiben", e1.behalten.length, 4);
ist("die Bildbeschreibungen fliegen raus", e1.verworfen.length, 3);
// Doppelte sind im Korpus besonders schädlich: Die Markov-Kette gewichtet sie
// doppelt und läuft dann bevorzugt durch diese Stelle.
const e2 = beute([gut[0]!, gut[0]!, gut[0]!.toUpperCase()]);
ist("Doppelte werden nur einmal behalten", e2.behalten.length, 1);
ist("auch bei anderer Schreibung", e2.verworfen.length, 2);
ist("Leerzeilen zählen gar nicht", beute(["", "   ", "\n"]).behalten.length, 0);
ist("und erzeugen auch keinen Ausschuss", beute(["", "   "]).verworfen.length, 0);
ist("eine leere Ernte stürzt nicht ab", beute([]).behalten.length, 0);

// ── 5 · Der Prompt ──────────────────────────────────────────────────────────
const p = bauePrompt(SAETZE_VORGABE);
wahr("die harte Regel steht drin", /ohne das Bild stehen können/.test(p));
wahr("die verbotenen Wendungen werden aufgezählt", /das Bild zeigt/.test(p) && /im Vordergrund/.test(p));
wahr("nüchtern statt literarisch wird verlangt", /NICHT literarisch/.test(p));
wahr("die vier W werden angefordert", /who/.test(p) && /where/.test(p) && /when/.test(p) && /what/.test(p));
wahr("Raten wird ausdrücklich verboten", /Rate nicht/.test(p));
wahr("die Satzzahl steht drin", /12 kurze Sätze/.test(p));
wahr("eine andere Satzzahl kommt an", /5 kurze Sätze/.test(bauePrompt(5)));
wahr("eine unsinnige Satzzahl wird gefangen", /\b3 kurze Sätze/.test(bauePrompt(-9)));
wahr("und eine zu große auch", /\b40 kurze Sätze/.test(bauePrompt(9999)));
wahr("ein Nutzerhinweis kommt hinein", bauePrompt(12, "nur Gegenstände").includes("nur Gegenstände"));
wahr("ohne Hinweis steht keine leere Vorgabe da", !/Vorgabe des Nutzers \(vorrangig\): *\n/.test(p));

// ── 6 · Antwort auswerten ───────────────────────────────────────────────────
const r1 = leseErnte({ saetze: ["a", "b"], ctx: { who: "ein Mann", where: "Parkbank", when: "", what: "wartet" } });
ist("die Sätze kommen an", r1.saetze.length, 2);
ist("Wer kommt an", r1.ctx.who, "ein Mann");
ist("ein leeres Feld bleibt leer", r1.ctx.when, "");
// Auch die 4W dürfen nicht aufs Bild zeigen — sie landen im Studio als Vorgabe
// und wanderten von dort in JEDEN erzeugten Text.
ist("ein 4W-Feld mit Bildbezug wird verworfen",
  leseErnte({ ctx: { what: "das Bild zeigt eine Ankunft" } }).ctx.what, "");
wahr("ein zu langes Feld wird gekürzt",
  leseErnte({ ctx: { where: "x".repeat(300) } }).ctx.where.length <= 80);
// Unsinn darf keinen Absturz erzeugen, sondern eine leere Ernte.
for (const müll of [null, undefined, 42, "text", [], { saetze: "kein array" }, { ctx: 7 }]) {
  ist(`Unsinn ergibt leere Ernte: ${JSON.stringify(müll) ?? "undefined"}`, leseErnte(müll).saetze.length, 0);
}
ist("und die 4W sind dann leer", leseErnte(null).ctx.who, "");
ist("Zahlen in den Sätzen fallen weg", leseErnte({ saetze: ["gut", 5, null] }).saetze.length, 1);

// ── 7 · Deckel und Kosten ───────────────────────────────────────────────────
wahr("der Deckel wächst mit der Satzzahl", maxToken(24) > maxToken(6));
wahr("und bleibt unter dem Modell-Limit", maxToken(9999) <= 4096);
const haiku = MODELLE[0]!;
const s1 = schaetzeLauf(1200, 900, 12, haiku);
wahr("das Bild steckt in der Eingabeschätzung", s1.ein > bildTokens(1200, 900));
wahr("ein Lauf kostet weniger als einen Cent bei Haiku", s1.usd < 0.01);
wahr("ein größeres Bild kostet mehr", schaetzeLauf(2400, 1800, 12, haiku).usd > s1.usd);
// Der Befund, der die ganze Sparerei lenkt: Bei Haiku kostet die ANTWORT mehr
// als das Bild. Nicht das Bild kleiner rechnen — weniger Sätze anfordern.
const einUsd = s1.ein * haiku.ein / 1e6, ausUsd = s1.aus * haiku.aus / 1e6;
wahr("die Antwort ist teurer als das Bild", ausUsd > einUsd);

// ── 8 · Data-URL zerlegen ───────────────────────────────────────────────────
const d1 = zerlegeDatenUrl("data:image/jpeg;base64,AAAA");
ist("der Medientyp wird abgetrennt", d1?.media, "image/jpeg");
ist("und die Nutzdaten bleiben übrig", d1?.daten, "AAAA");
ist("Großschreibung im Typ stört nicht", zerlegeDatenUrl("data:IMAGE/PNG;base64,AA")?.media, "image/png");
ist("ein fremdes Format wird abgelehnt", zerlegeDatenUrl("data:image/bmp;base64,AA"), null);
ist("etwas, das kein Bild ist, ebenso", zerlegeDatenUrl("data:text/plain;base64,AA"), null);
ist("und eine gewöhnliche Adresse auch", zerlegeDatenUrl("https://x.test/a.jpg"), null);
ist("leere Eingabe stürzt nicht ab", zerlegeDatenUrl(""), null);

wahr("es gibt mehr als eine Verräter-Regel", VERRAETER.length > 5);

// ── 9 · Die Anzeige stellt untereinander ────────────────────────────────────
// Gemeldet: Der Ausschuss war auf dem Handy am rechten Rand und nicht zu
// finden. Ursache war .idea — ein ZEILEN-Flexkasten für „Text links, Knopf
// rechts". Vier Blöcke darin stellte er nebeneinander. Am Rechner fällt das
// kaum auf, am Handy schiebt es den letzten Block aus dem Blick.
const view = readFileSync("src/ui/bildsammlerView.ts", "utf8");
const css = readFileSync("src/ui/theme.css", "utf8");
ist("der Fund benutzt nicht mehr den Zeilen-Flexkasten", /class: "idea"/.test(view), false);
wahr("sondern einen eigenen Kasten", /class: "bsam-fund"/.test(view));
// Gegenprobe zur Regel selbst: .idea IST ein Zeilen-Flexkasten — sonst prüfte
// die Zeile oben nur, dass irgendein Klassenname nicht vorkommt.
wahr(".idea ist tatsächlich ein Zeilen-Flexkasten", /\.idea\{display:flex/.test(css));
wahr("der neue Kasten ist es nicht", /\.bsam-fund\{(?![^}]*display:flex)[^}]*\}/.test(css));
wahr("der Ausschuss hat einen sichtbaren Aufklapper", /\.bsam-weg>summary\{/.test(css));
wahr("und die Sätze stehen einzeln untereinander", /\.bsam-satz\{display:flex;align-items:flex-start/.test(css));

// ── 9 · Der Bildvorrat ──────────────────────────────────────────────────────
// Eigene Ablage, NICHT der Sammler-Vorrat: „Wiki“ zieht aus dem Feed,
// „Abschrift“ aus Bildern. Getrennt, weil das Material verschieden ist.
const fund = (w: string, n = "a.jpg", t = 1): BildFund =>
  ({ name: n, ctx: { who: "", where: "", when: "", what: w }, gespeichert: t });

wahr("die Schlüssel sind verschieden", BILDVORRAT_KEY !== "divergenz_sammler_vorrat_v1");
wahr("der Bildvorrat wandert in die Projektdatei", BILDVORRAT_KEY.startsWith("divergenz_"));

ist("ein Fund ohne jedes Feld taugt nicht", taugtFund(fund("")), false);
wahr("mit einem Feld schon", taugtFund(fund("eine Ankunft")));
wahr("auch wenn nur Wo gefüllt ist",
  taugtFund({ name: "x", ctx: { who: "", where: "Hafen", when: "", what: "" }, gespeichert: 1 }));

const v1 = mischeBildvorrat([], [fund("Ankunft"), fund("Abfahrt")]);
ist("zwei Funde kommen an", v1.length, 2);
// Der Dateiname taugt nicht als Kennung: Handykameras vergeben nach einem
// Zurücksetzen dieselben Namen erneut. Die vier Felder entscheiden.
const v2 = mischeBildvorrat(v1, [fund("Ankunft", "ganz-anderer-name.jpg")]);
ist("dasselbe Was gilt als bekannt, trotz anderem Dateinamen", v2.length, 2);
const v3 = mischeBildvorrat(v1, [fund("  ANKUNFT  ")]);
ist("Schreibung und Leerraum machen keinen Unterschied", v3.length, 2);
// Gegenprobe: Ein wirklich neuer Fund MUSS dazukommen — sonst prüfte die Regel
// oben nur, dass nie etwas hinzugefügt wird.
ist("ein wirklich neuer Fund kommt dazu", mischeBildvorrat(v1, [fund("Rückkehr")]).length, 3);
ist("leere Funde werden gar nicht aufgenommen", mischeBildvorrat([], [fund("")]).length, 0);

// Der Deckel: Ältestes fällt vorne heraus, damit der localStorage nicht
// zuläuft und ANDERE Daten am Sichern hindert.
const viele = Array.from({ length: 12 }, (_, i) => fund("was" + i));
const v4 = mischeBildvorrat([], viele, 5);
ist("der Deckel greift", v4.length, 5);
ist("und das Älteste fällt heraus", v4[0]!.ctx.what, "was7");
ist("ohne Deckel bleibt alles", mischeBildvorrat([], viele, 0).length, 12);

// Ziehen ohne Zufall, damit der Prüfstand nicht würfelt.
ist("aus dem leeren Vorrat kommt nichts", ziehBildvorrat([], () => 0), null);
ist("der erste Fund lässt sich ziehen", ziehBildvorrat(v1, () => 0)?.ctx.what, "Ankunft");
ist("und der letzte auch", ziehBildvorrat(v1, () => 0.999)?.ctx.what, "Abfahrt");
ist("ein Vorrat nur aus leeren Funden gibt nichts her",
  ziehBildvorrat([fund("")], () => 0), null);

// ── 10 · Abschrift ──────────────────────────────────────────────────────────
// Das Gegenteil des Bildsammlers: Hier wird NICHT gefiltert und NICHT
// formuliert. Der ganze Wert des Prompts steckt in dem, was er verbietet.
const ap = baueAbschriftPrompt();
wahr("Ergänzen ist verboten", /Etwas ergänzen, weiterschreiben/.test(ap));
wahr("Modernisieren ist verboten", /Rechtschreibung modernisieren/.test(ap));
wahr("Verbessern ist verboten", /Grammatik oder Zeichensetzung verbessern/.test(ap));
wahr("Unleserliches wird gekennzeichnet statt geraten", /\[unleserlich\] statt zu raten/.test(ap));
wahr("Silbentrennung wird aufgelöst", /Silbentrennung am Zeilenende/.test(ap));
wahr("es gibt eine Antwort für „kein Text“", /KEIN TEXT/.test(ap));
wahr("ein Nutzerhinweis kommt hinein", baueAbschriftPrompt("nur die linke Spalte").includes("nur die linke Spalte"));
// Gegenprobe zur Abgrenzung: Der Beutefilter des Bildsammlers darf hier NICHT
// gelten. Eine Abschrift, in der „Das Bild zeigt“ steht, ist eine richtige
// Abschrift eines Textes, in dem das steht.
wahr("die Abschrift kennt keinen Beutefilter", !/Glätte|verworfen und war umsonst/.test(ap));

ist("eine leere Antwort ist leer", leseAbschrift("").leer, true);
ist("die Kein-Text-Antwort ebenso", leseAbschrift("KEIN TEXT").leer, true);
ist("auch klein geschrieben", leseAbschrift("kein text").leer, true);
ist("ein Codeblock wird abgestreift", leseAbschrift("```\nEs war ein Tag.\n```").text, "Es war ein Tag.");
ist("auch einer mit Sprachangabe", leseAbschrift("```text\nEs war ein Tag.\n```").text, "Es war ein Tag.");
ist("ein Vorspann fällt weg", leseAbschrift("Hier ist die Abschrift:\n\nEs war ein Tag.").text, "Es war ein Tag.");
// Gegenprobe: Ein Text, der zufällig ähnlich anfängt, darf NICHT beschnitten
// werden — sonst verlöre eine echte Abschrift ihren ersten Satz.
ist("ein echter Satz über eine Abschrift bleibt stehen",
  leseAbschrift("Die Abschrift des Protokolls lag auf dem Tisch.").text,
  "Die Abschrift des Protokolls lag auf dem Tisch.");
ist("und ein gewöhnlicher Text sowieso",
  leseAbschrift("Es war ein Tag im Herbst.").text, "Es war ein Tag im Herbst.");
wahr("der Deckel lässt eine volle Buchseite zu", maxTokenAbschrift() >= 2048);

// ── Ergebnis ────────────────────────────────────────────────────────────────
console.log(`Prüfstand Bildsammler — ${geprueft} Prüfungen (ohne API-Aufruf):`);
zeilen.forEach((z) => console.log(z));
const proc = globalThis as unknown as { process?: { exit: (c: number) => void } };
if (fails.length) {
  console.error(`\n❌ ${fails.length} Fehler im Bildsammler:`);
  fails.forEach((f) => console.error("  - " + f));
  proc.process?.exit(1);
} else {
  console.log(`\n✅ Bildsammler: alle ${geprueft} Prüfungen bestanden.`);
}
