// Prüfstand Hilfe: Beschreibt die Hilfe die Maschine, die es gibt?
//
// Eine Hilfe veraltet lautlos. Sie wird nicht ausgeführt, also merkt niemand,
// wenn ein Reiter dazukommt, eine Taste umbenannt wird oder ein Querverweis ins
// Leere zeigt. Deshalb hier drei Fragen, die eine Maschine beantworten kann:
// Kommt jeder Reiter vor? Zeigt jeder Verweis auf einen Abschnitt, den es gibt?
// Und stehen die zuletzt gebauten Sachen drin?
//
// Was hier NICHT geprüft wird: ob die Erklärung stimmt. Das kann nur lesen, wer
// die Maschine kennt.
import { existsSync, readFileSync } from "fs";

const hilfe = readFileSync("src/ui/helpView.ts", "utf8");
const app = readFileSync("src/ui/app.ts", "utf8");

const fails: string[] = [];
let geprueft = 0, bestanden = 0;
const ist = (name: string, wert: unknown, soll: unknown): void => {
  geprueft++;
  if (wert === soll) bestanden++; else fails.push(`${name}: „${String(wert)}“ — erwartet „${String(soll)}“`);
};
const wahr = (name: string, b: boolean): void => ist(name, b, true);

// ── 1 · Jeder Reiter kommt vor ─────────────────────────────────────────────
// Die Liste wird aus app.ts gelesen, nicht abgeschrieben: Eine Kopie veraltet
// genauso lautlos wie die Hilfe selbst.
const reiterBlock = app.slice(app.indexOf("const TABS"), app.indexOf("export function mountApp"));
const reiter = Array.from(reiterBlock.matchAll(/\["([^"]+)",/g)).map((m) => m[1]!);
wahr(`die Reiterliste wurde gefunden (${reiter.length})`, reiter.length >= 14);
// Streng: Der Reiter muss einen EIGENEN Eintrag haben (`["Name",`). Bloßes
// Vorkommen im Fließtext genügt nicht — „Autopilot" stand als Querverweis in
// einem anderen Absatz, und der Eintrag konnte trotzdem fehlen.
const fehlend = reiter.filter((r) => !hilfe.includes(`["${r}"`));
ist("jeder Reiter wird in der Hilfe erwähnt", fehlend.join(", "), "");

// ── 2 · Kein Querverweis ins Leere ─────────────────────────────────────────
const abschnitte = new Set(Array.from(hilfe.matchAll(/section\("([a-z0-9]+)"/g)).map((m) => m[1]!));
abschnitte.add("arch");                                    // von Hand gebaut, kein section()
const ziele = Array.from(hilfe.matchAll(/lnk\("[^"]*",\s*"([a-z0-9]+)"\)/g)).map((m) => m[1]!);
wahr(`es gibt Querverweise (${ziele.length})`, ziele.length >= 20);
const tot = [...new Set(ziele)].filter((z) => !abschnitte.has(z));
ist("jeder Querverweis trifft einen Abschnitt", tot.join(", "), "");

// ── 3 · Die zuletzt gebauten Sachen stehen drin ────────────────────────────
// Jede Zeile hier ist eine Änderung, die der Benutzer gemeldet oder bestellt
// hat. Wer eine davon wieder ausbaut, muss auch die Hilfe anfassen.
const MUSS: [string, string][] = [
  ["Alles würfeln", "Alles würfeln"],
  ["die gewürfelte Quelle", "Bildvorrat"],
  ["die Wiki-Taste", '"Wiki"'],
  ["die Abschrift-Taste", '"Abschrift"'],
  ["das Schloss an den 4W", "Schloss neben einem Feld"],
  ["das Schloss an den Reglern", "Schloss an jedem Regler"],
  ["die Stellschrauben", "Stellschrauben der Rekombination"],
  ["die Sofortwirkung im Werkzeugkasten", "Jede Änderung erzeugt sofort neu"],
  ["das Schließkreuz", "✕ oben rechts"],
  ["die Objektperspektive", "Ich bin die Akte"],
  ["die Struktur-Ansicht", "Struktur (Ansicht unter dem Text)"],
  ["der Autopilot", '"Layout"'],
  ["die Varianzanzeige", "Grün (hohe Vielfalt)"],
  ["die Form Bericht", '"Bericht"'],
  ["die Form Meldung", "Meldung (kurz)"],
  ["die Musterseite", "Musterseite"],
  ["das Bild auf der Zeitungsseite", "Bild einfügen"],
  ["der Wirkungsmesser", "Wirkungsmesser"],
  ["die Blindprobe", "Blindprobe"],
  ["den Themenpool", "Themenpool"],
  ["die Taste Thema", '["Thema", P('],
];
for (const [was, marke] of MUSS) wahr(`die Hilfe erklärt ${was}`, hilfe.includes(marke));

// ── 4 · Die Falle mit den Anführungszeichen ────────────────────────────────
// Ein gerades " als schließendes deutsches Anführungszeichen beendet in
// TypeScript die Zeichenkette. Das hat diese Datei schon mehrfach zerlegt.
const kaputt = Array.from(hilfe.matchAll(/„[^"„“\n]{0,160}"/g)).map((m) => m[0].slice(0, 40));
ist("kein gerades Anführungszeichen schließt ein deutsches", kaputt.join(" | "), "");

// ── Die Hilfe ist keine Versionsgeschichte ──────────────────────────────────
// Gemeldet nach einem Blick in den Reiter: ellenlange Einträge. Der längste
// hatte 7.974 Zeichen und 57 Sätze — ein Absatz über den Schaltplan, in dem
// stand, wie viele Zustände es „bis 4.296.0" gab und welche Messreihe zu
// welcher Grenze geführt hat.
//
// Das ist Material für die Commit-Nachricht, nicht für die Hilfe. Wer sie
// öffnet, will wissen, was ein Knopf TUT — nicht, seit wann er es tut und was
// vorher galt. Eine Versionsnummer im Hilfetext veraltet in dem Augenblick, in
// dem sie geschrieben wird.
const versionen = hilfe.match(/\b4\.\d{3}(?:\.\d+)?/g) || [];
ist("keine Versionsnummer im Hilfetext", versionen.join(", "), "");

// Die Länge, gemessen je Eintrag. Kein fester Grenzwert aus dem Gefühl: 1.600
// Zeichen sind rund 250 Wörter — eine Bildschirmseite. Was länger ist, liest
// niemand zu Ende, und was niemand zu Ende liest, kann auch falsch sein, ohne
// dass es auffällt.
const teile = hilfe.split(/\n {4}\["/).slice(1);
const lang = teile
  .map((t) => [t.slice(0, t.indexOf('"')), t.length] as [string, number])
  .filter(([, n]) => n > 1600);
ist("kein Eintrag ist länger als eine Bildschirmseite",
  lang.map(([n, l]) => `${n} (${l})`).join(", "), "");
// Gegenprobe: Die Messung muss überhaupt Einträge sehen — sonst bestünde sie
// auch bei einer leeren Datei.
wahr(`es wurden ${teile.length} Einträge gemessen`, teile.length >= 60);

// Deckung der jüngsten Bausteine. Sie fehlten: Der Nutzungszähler war gebaut,
// ausgeliefert und in der Hilfe nicht erwähnt.
for (const w of ["Nutzung", "Selbsttest", "Schaltplan", "Füller", "Abschrift", "Motivverwandlungen", "Bildwelt", "Layout"]) {
  wahr(`die Hilfe kennt „${w}"`, hilfe.includes(w));
}

// ── Die Architekturgrafik ist auf dem Stand ────────────────────────────────
// Sie zeigte einen Baustein, den es nicht mehr gibt, und kannte weder Sammler
// noch Autopilot, Zeitungsseite, KI-Lehrer, Themenpool oder Erzaehlerbank. Ein Bild, das den Aufbau erklärt und einen
// Baustein zeigt, den es nicht gibt, ist schlimmer als kein Bild.
//
// Geprüft wird gegen die REITERLISTE, nicht gegen eine abgeschriebene Liste:
// Kommt ein Reiter dazu, faellt es hier auf.
{
  const svg = hilfe.slice(hilfe.indexOf("const ARCH_SVG"), hilfe.indexOf("`;", hilfe.indexOf("const ARCH_SVG")));
  ist("der abgeloeste Baustein kommt nicht mehr vor", />Montage</.test(svg), false);
  // Jeder Reiter, der einen eigenen Kasten verdient, muss vorkommen. Nicht
  // alle: „Oszilloskop" und „Hilfe" sind Werkzeuge ueber der Maschine, keine
  // Station im Weg eines Textes.
  for (const r of ["STUDIO", "Ideen", "Sammler", "Welt", "Wortbank", "Erzählerbank",
    "Korpus", "Schatzkammer", "Bildwelt", "Layout", "Werkstatt", "KI-Lehrer"]) {
    wahr(`die Grafik kennt „${r}"`, svg.includes(r));
  }
  // Und die Dinge, die keinen Reiter haben, aber im Weg stehen.
  for (const b of ["Zeitungsseite", "Lebendige Pools", "Bestenauslese", "Textindex", "Diagnose"]) {
    wahr(`die Grafik kennt „${b}"`, svg.includes(b));
  }
  // Der Rahmen muss den Inhalt umschliessen. Beim ersten Wurf war er 878 hoch
  // und der Inhalt 926 — die Fussnote stand ausserhalb des Blattes.
  const vb = /viewBox="0 0 \d+ (\d+)"/.exec(svg);
  const rah = /<rect x="1" y="1" width="\d+" height="(\d+)"/.exec(svg);
  wahr("Rahmen und Blatt sind auffindbar", !!vb && !!rah);
  wahr(`der Rahmen passt ins Blatt (${rah?.[1]} in ${vb?.[1]})`,
    Number(rah![1]) <= Number(vb![1]) && Number(rah![1]) > Number(vb![1]) - 40);
  // Die Grafik wird ERZEUGT. Von Hand gepflegt veraltet sie wieder.
  wahr("es gibt einen Erzeuger", existsSync("scripts/arch.mjs"));
  wahr("und die Grafik stammt daraus",
    readFileSync("src/ui/arch.svg.txt", "utf8").trim() === svg.slice(svg.indexOf("<svg")).trim());
}

// ── Die Einleitung („Über die Divergenzmaschine") trägt den Satz der Maschine ──
{
  const ap = readFileSync("src/ui/app.ts", "utf8");
  wahr("die Einleitung sagt, dass Menschen aus Bruchstücken Sinn bauen", /Menschen aus Bruchstücken Sinn bauen/.test(ap));
  wahr("… und dass die Kohärenz vom Lesen kommt", /die Kohärenz kommt vom Lesen/.test(ap));
  wahr("… nennt die drei Vorräte", /Die Wortbank liefert das Was/.test(ap) && /Die Erzählerbank liefert das Wie/.test(ap) && /Der Korpus liefert die fremde Stimme/.test(ap));
  wahr("… und die Sichten (Editieren, Quelltext, Schaltplan, Spannungskurve)", /Quelltext zeigt den Bau/.test(ap) && /Schaltplan zeigt/.test(ap) && /Spannungskurve/.test(ap));
  wahr("keine Versionsnummer in der Einleitung", !/\b4\.\d{3}\b/.test(ap.slice(ap.indexOf("Über die Divergenzmaschine"), ap.indexOf("overlay.append(card)"))));
}

console.log(`Prüfstand Hilfe — ${geprueft} Prüfungen, ${bestanden} bestanden`);
const proc = globalThis as unknown as { process?: { exit: (c: number) => void } };
if (fails.length) {
  console.error(`\n❌ Hilfe: ${fails.length} Fehler:`);
  fails.forEach((f) => console.error("  - " + f));
  proc.process?.exit(1);
} else {
  console.log(`\n✅ Hilfe: alle ${geprueft} Prüfungen bestanden.`);
}
