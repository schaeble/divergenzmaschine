"use strict";

// test/nutzung.ts
var import_fs = require("fs");
var import_jsdom = require("jsdom");

// src/features/nutzung.ts
var NUTZUNG_KEY = "divergenz_nutzung_v1";
function merke(stand2, id, jetzt = Date.now()) {
  const k = (id || "").trim();
  if (!k) return stand2;
  const alt = stand2[k];
  return {
    ...stand2,
    [k]: alt ? { n: alt.n + 1, zuletzt: jetzt, zuerst: alt.zuerst || jetzt } : { n: 1, zuletzt: jetzt, zuerst: jetzt }
  };
}
function alsListe(stand2, alle2, jetzt = Date.now()) {
  const tag = 864e5;
  const zeilen2 = alle2.map((id) => {
    const e = stand2[id];
    return e && e.n > 0 ? { id, n: e.n, tage: Math.floor((jetzt - e.zuletzt) / tag), nie: false } : { id, n: 0, tage: -1, nie: true };
  });
  return zeilen2.sort((a, b) => {
    if (a.nie !== b.nie) return a.nie ? -1 : 1;
    if (a.n !== b.n) return a.n - b.n;
    return a.id.localeCompare(b.id, "de");
  });
}
function seitWann(stand2) {
  const z = Object.values(stand2).map((e) => e.zuerst).filter((x) => x > 0);
  return z.length ? Math.min(...z) : 0;
}
function ladeNutzung() {
  try {
    const r = JSON.parse(localStorage.getItem(NUTZUNG_KEY) || "{}");
    if (!r || typeof r !== "object" || Array.isArray(r)) return {};
    const raus = {};
    for (const [k, v] of Object.entries(r)) {
      const e = v;
      const n = Number(e?.n);
      if (!Number.isFinite(n) || n <= 0) continue;
      raus[k] = { n, zuletzt: Number(e?.zuletzt) || 0, zuerst: Number(e?.zuerst) || 0 };
    }
    return raus;
  } catch {
    return {};
  }
}
function sichereNutzung(s) {
  try {
    localStorage.setItem(NUTZUNG_KEY, JSON.stringify(s));
  } catch {
  }
}

// test/nutzung.ts
var dom = new import_jsdom.JSDOM("<!doctype html><html><body></body></html>", { url: "https://x.test/" });
globalThis.localStorage = dom.window.localStorage;
var fails = [];
var zeilen = [];
var geprueft = 0;
var ist = (name, wert, soll) => {
  geprueft++;
  if (wert === soll) zeilen.push(`  \u2713 ${name}`);
  else {
    zeilen.push(`  \u2717 ${name}`);
    fails.push(`${name}: \u201E${String(wert)}\u201C \u2014 erwartet \u201E${String(soll)}\u201C`);
  }
};
var wahr = (name, b) => ist(name, b, true);
var TAG = 864e5;
var T0 = 17e11;
var s1 = merke({}, "Studio", T0);
ist("der erste Gebrauch z\xE4hlt eins", s1.Studio?.n, 1);
ist("und merkt sich den Zeitpunkt", s1.Studio?.zuletzt, T0);
ist("auch als ersten", s1.Studio?.zuerst, T0);
var s2 = merke(s1, "Studio", T0 + TAG);
ist("der zweite z\xE4hlt weiter", s2.Studio?.n, 2);
ist("der letzte Zeitpunkt r\xFCckt nach", s2.Studio?.zuletzt, T0 + TAG);
ist("der erste Zeitpunkt bleibt stehen", s2.Studio?.zuerst, T0);
ist("ein leerer Name wird nicht verbucht", Object.keys(merke({}, "", T0)).length, 0);
ist("Leerraum auch nicht", Object.keys(merke({}, "   ", T0)).length, 0);
ist("verschiedene Namen z\xE4hlen getrennt", Object.keys(merke(s2, "Korpus", T0)).length, 2);
var alle = ["Studio", "Korpus", "Bildwelt", "Autopilot"];
var stand = {
  Studio: { n: 40, zuletzt: T0, zuerst: T0 - 30 * TAG },
  Korpus: { n: 3, zuletzt: T0 - 5 * TAG, zuerst: T0 - 20 * TAG }
};
var l = alsListe(stand, alle, T0);
ist("die Liste zeigt ALLE Bausteine", l.length, 4);
wahr("auch die nie benutzten", l.some((z) => z.id === "Bildwelt" && z.nie));
wahr("Ungenutztes steht oben", l[0].nie && l[1].nie);
ist("dann das Seltenste", l[2]?.id, "Korpus");
ist("und zuletzt das H\xE4ufigste", l[3]?.id, "Studio");
ist("die Anzahl stimmt", l[3]?.n, 40);
ist("die Tage seit dem letzten Mal auch", l[2]?.tage, 5);
ist("heute benutzt ergibt null Tage", l[3]?.tage, 0);
ist("nie benutzt ergibt minus eins", l[0]?.tage, -1);
ist("ohne Bausteine ist die Liste leer", alsListe(stand, [], T0).length, 0);
ist(
  "ein unbekannter Z\xE4hler taucht nicht auf",
  alsListe({ Geist: { n: 9, zuletzt: T0, zuerst: T0 } }, alle, T0).filter((z) => z.id === "Geist").length,
  0
);
ist("seit dem fr\xFChesten Eintrag", seitWann(stand), T0 - 30 * TAG);
ist("ohne Eintr\xE4ge null", seitWann({}), 0);
wahr("die Z\xE4hlung wandert in die Projektdatei", NUTZUNG_KEY.startsWith("divergenz_"));
localStorage.removeItem(NUTZUNG_KEY);
ist("ohne Eintrag ist es leer", Object.keys(ladeNutzung()).length, 0);
sichereNutzung(stand);
ist("Gesichertes kommt zur\xFCck", ladeNutzung().Studio?.n, 40);
localStorage.setItem(NUTZUNG_KEY, "{kein json");
ist("kaputter Inhalt ergibt eine leere Z\xE4hlung", Object.keys(ladeNutzung()).length, 0);
localStorage.setItem(NUTZUNG_KEY, JSON.stringify([1, 2, 3]));
ist("eine Liste statt eines Objekts ebenso", Object.keys(ladeNutzung()).length, 0);
localStorage.setItem(NUTZUNG_KEY, JSON.stringify({ A: { n: "viele" }, B: { n: 2 }, C: { n: 0 } }));
ist("Unsinn in der Anzahl f\xE4llt weg", Object.keys(ladeNutzung()).join(","), "B");
ist("und fehlende Zeitpunkte werden null", ladeNutzung().B?.zuletzt, 0);
var app = (0, import_fs.readFileSync)("src/ui/app.ts", "utf8");
wahr("im Klick-Zuh\xF6rer wird gez\xE4hlt", /addEventListener\("click", \(\) => \{[\s\S]{0,400}?zaehle\(name\);/.test(app));
ist("beim Zeichnen nicht", /zeichneLeiste[\s\S]{0,200}?nachName\.get\(erster\)\?\.\(content\);[\s\S]{0,80}?zaehle\(/.test(app), false);
var diag = (0, import_fs.readFileSync)("src/ui/diagnoseView.ts", "utf8");
var studio = (0, import_fs.readFileSync)("src/ui/studio.ts", "utf8");
ist("die Diagnose zeigt sie nicht mehr", /renderTextstruktur/.test(diag), false);
wahr("das Studio schon", /renderTextstruktur/.test(studio));
wahr("die Nutzungstabelle steht stattdessen dort", /Nutzung — was wird tatsaechlich benutzt/.test(diag));
console.log(`Pr\xFCfstand Nutzung \u2014 ${geprueft} Pr\xFCfungen:`);
zeilen.forEach((z) => console.log(z));
var proc = globalThis;
if (fails.length) {
  console.error(`
\u274C ${fails.length} Fehler beim Nutzungsz\xE4hler:`);
  fails.forEach((f) => console.error("  - " + f));
  proc.process?.exit(1);
} else {
  console.log(`
\u2705 Nutzung: alle ${geprueft} Pr\xFCfungen bestanden.`);
}
