"use strict";

// test/hilfe.ts
var import_fs = require("fs");
var hilfe = (0, import_fs.readFileSync)("src/ui/helpView.ts", "utf8");
var app = (0, import_fs.readFileSync)("src/ui/app.ts", "utf8");
var fails = [];
var geprueft = 0;
var bestanden = 0;
var ist = (name, wert, soll) => {
  geprueft++;
  if (wert === soll) bestanden++;
  else fails.push(`${name}: \u201E${String(wert)}\u201C \u2014 erwartet \u201E${String(soll)}\u201C`);
};
var wahr = (name, b) => ist(name, b, true);
var reiterBlock = app.slice(app.indexOf("const TABS"), app.indexOf("export function mountApp"));
var reiter = Array.from(reiterBlock.matchAll(/\["([^"]+)",/g)).map((m) => m[1]);
wahr(`die Reiterliste wurde gefunden (${reiter.length})`, reiter.length >= 14);
var fehlend = reiter.filter((r) => !hilfe.includes(`["${r}"`));
ist("jeder Reiter wird in der Hilfe erw\xE4hnt", fehlend.join(", "), "");
var abschnitte = new Set(Array.from(hilfe.matchAll(/section\("([a-z0-9]+)"/g)).map((m) => m[1]));
abschnitte.add("arch");
var ziele = Array.from(hilfe.matchAll(/lnk\("[^"]*",\s*"([a-z0-9]+)"\)/g)).map((m) => m[1]);
wahr(`es gibt Querverweise (${ziele.length})`, ziele.length >= 20);
var tot = [...new Set(ziele)].filter((z) => !abschnitte.has(z));
ist("jeder Querverweis trifft einen Abschnitt", tot.join(", "), "");
var MUSS = [
  ["Alles w\xFCrfeln", "Alles w\xFCrfeln"],
  ["die gew\xFCrfelte Quelle", "Bildvorrat"],
  ["die Wiki-Taste", '"Wiki"'],
  ["die Abschrift-Taste", '"Abschrift"'],
  ["das Schloss an den 4W", "Schloss neben einem Feld"],
  ["das Schloss an den Reglern", "Schloss an jedem Regler"],
  ["die Stellschrauben", "Stellschrauben der Rekombination"],
  ["die Sofortwirkung im Werkzeugkasten", "Jede \xC4nderung erzeugt sofort neu"],
  ["das Schlie\xDFkreuz", "\u2715 oben rechts"],
  ["die Objektperspektive", "Ich bin die Akte"],
  ["die Struktur-Ansicht", "Struktur (Ansicht unter dem Text)"],
  ["der Autopilot", '"Autopilot"'],
  ["die Varianzanzeige", "Gr\xFCn (hohe Vielfalt)"],
  ["die Form Bericht", '"Bericht"'],
  ["die Form Meldung", "Meldung (kurz)"],
  ["die Musterseite", "Musterseite"],
  ["das Bild auf der Zeitungsseite", "Bild einf\xFCgen"],
  ["der Wirkungsmesser", "Wirkungsmesser"],
  ["die Blindprobe", "Blindprobe"],
  ["den Themenpool", "Themenpool"],
  ["die Taste Thema", '["Thema", P(']
];
for (const [was, marke] of MUSS) wahr(`die Hilfe erkl\xE4rt ${was}`, hilfe.includes(marke));
var kaputt = Array.from(hilfe.matchAll(/„[^"„“\n]{0,160}"/g)).map((m) => m[0].slice(0, 40));
ist("kein gerades Anf\xFChrungszeichen schlie\xDFt ein deutsches", kaputt.join(" | "), "");
var versionen = hilfe.match(/\b4\.\d{3}(?:\.\d+)?/g) || [];
ist("keine Versionsnummer im Hilfetext", versionen.join(", "), "");
var teile = hilfe.split(/\n {4}\["/).slice(1);
var lang = teile.map((t) => [t.slice(0, t.indexOf('"')), t.length]).filter(([, n]) => n > 1600);
ist(
  "kein Eintrag ist l\xE4nger als eine Bildschirmseite",
  lang.map(([n, l]) => `${n} (${l})`).join(", "),
  ""
);
wahr(`es wurden ${teile.length} Eintr\xE4ge gemessen`, teile.length >= 60);
for (const w of ["Nutzung", "Selbsttest", "Schaltplan", "F\xFCller", "Abschrift", "Motivverwandlungen", "Bildwelt", "Autopilot"]) {
  wahr(`die Hilfe kennt \u201E${w}"`, hilfe.includes(w));
}
{
  const svg = hilfe.slice(hilfe.indexOf("const ARCH_SVG"), hilfe.indexOf("`;", hilfe.indexOf("const ARCH_SVG")));
  ist("der abgeloeste Baustein kommt nicht mehr vor", />Montage</.test(svg), false);
  for (const r of [
    "STUDIO",
    "Ideen",
    "Sammler",
    "Welt",
    "Wortbank",
    "Erz\xE4hlerbank",
    "Korpus",
    "Schatzkammer",
    "Bildwelt",
    "Autopilot",
    "Werkstatt",
    "KI-Lehrer"
  ]) {
    wahr(`die Grafik kennt \u201E${r}"`, svg.includes(r));
  }
  for (const b of ["Zeitungsseite", "Lebendige Pools", "Bestenauslese", "Textindex", "Diagnose"]) {
    wahr(`die Grafik kennt \u201E${b}"`, svg.includes(b));
  }
  const vb = /viewBox="0 0 \d+ (\d+)"/.exec(svg);
  const rah = /<rect x="1" y="1" width="\d+" height="(\d+)"/.exec(svg);
  wahr("Rahmen und Blatt sind auffindbar", !!vb && !!rah);
  wahr(
    `der Rahmen passt ins Blatt (${rah?.[1]} in ${vb?.[1]})`,
    Number(rah[1]) <= Number(vb[1]) && Number(rah[1]) > Number(vb[1]) - 40
  );
  wahr("es gibt einen Erzeuger", (0, import_fs.existsSync)("scripts/arch.mjs"));
  wahr(
    "und die Grafik stammt daraus",
    (0, import_fs.readFileSync)("src/ui/arch.svg.txt", "utf8").trim() === svg.slice(svg.indexOf("<svg")).trim()
  );
}
console.log(`Pr\xFCfstand Hilfe \u2014 ${geprueft} Pr\xFCfungen, ${bestanden} bestanden`);
var proc = globalThis;
if (fails.length) {
  console.error(`
\u274C Hilfe: ${fails.length} Fehler:`);
  fails.forEach((f) => console.error("  - " + f));
  proc.process?.exit(1);
} else {
  console.log(`
\u2705 Hilfe: alle ${geprueft} Pr\xFCfungen bestanden.`);
}
