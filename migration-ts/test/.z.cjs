"use strict";

// test/reiter.ts
var import_jsdom = require("jsdom");

// src/features/reiter.ts
var REITER_KEY = "divergenz_reiter_v1";
var kanonListe = [];
function setzeKanon(namen) {
  kanonListe = namen.slice();
}
function derKanon() {
  return kanonListe.slice();
}
var STAND_LEER = { ordnung: [], versteckt: [] };
var PFLICHT = ["Studio"];
function ordne(kanon, gespeichert) {
  const bekannt = new Set(kanon);
  const raus = [];
  const drin = /* @__PURE__ */ new Set();
  for (const n of gespeichert) {
    if (!bekannt.has(n) || drin.has(n)) continue;
    drin.add(n);
    raus.push(n);
  }
  for (let i = 0; i < kanon.length; i++) {
    const n = kanon[i];
    if (drin.has(n)) continue;
    let stelle = 0;
    for (let j = i - 1; j >= 0; j--) {
      const v = kanon[j];
      const k = raus.indexOf(v);
      if (k >= 0) {
        stelle = k + 1;
        break;
      }
    }
    raus.splice(stelle, 0, n);
    drin.add(n);
  }
  return raus;
}
function sichtbar(kanon, stand, pflicht = PFLICHT) {
  const ordnung = ordne(kanon, stand.ordnung || []);
  const weg = new Set((stand.versteckt || []).filter((n) => !pflicht.includes(n)));
  const raus = ordnung.filter((n) => !weg.has(n));
  if (raus.length) return raus;
  const rettung = ordnung.filter((n) => pflicht.includes(n));
  return rettung.length ? rettung : ordnung.slice(0, 1);
}
function verschiebe(ordnung, name, delta) {
  const i = ordnung.indexOf(name);
  if (i < 0) return ordnung.slice();
  const j = i + (delta < 0 ? -1 : 1);
  if (j < 0 || j >= ordnung.length) return ordnung.slice();
  const raus = ordnung.slice();
  raus[i] = raus[j];
  raus[j] = name;
  return raus;
}
function schalte(stand, name, an, pflicht = PFLICHT) {
  const versteckt = new Set(stand.versteckt || []);
  if (an || pflicht.includes(name)) versteckt.delete(name);
  else versteckt.add(name);
  return { ordnung: (stand.ordnung || []).slice(), versteckt: [...versteckt] };
}
function ladeStand() {
  try {
    const r = JSON.parse(localStorage.getItem(REITER_KEY) || "null");
    if (!r) return { ...STAND_LEER };
    return {
      ordnung: Array.isArray(r.ordnung) ? r.ordnung.filter((x) => typeof x === "string") : [],
      versteckt: Array.isArray(r.versteckt) ? r.versteckt.filter((x) => typeof x === "string") : []
    };
  } catch {
    return { ...STAND_LEER };
  }
}
function sichereStand(s) {
  try {
    localStorage.setItem(REITER_KEY, JSON.stringify(s));
    return true;
  } catch {
    return false;
  }
}

// test/reiter.ts
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
var KANON = ["Studio", "Ideen", "Korpus", "Bildwelt", "Drucken", "Hilfe"];
ist("ohne gespeicherte Ordnung gilt die eingebaute", ordne(KANON, []).join(","), KANON.join(","));
ist(
  "eine eigene Ordnung wird \xFCbernommen",
  ordne(KANON, ["Hilfe", "Studio", "Ideen", "Korpus", "Bildwelt", "Drucken"]).join(","),
  "Hilfe,Studio,Ideen,Korpus,Bildwelt,Drucken"
);
ist(
  "ein verschwundener Reiter f\xE4llt weg",
  ordne(KANON, ["Montage", "Studio"]).indexOf("Montage"),
  -1
);
ist(
  "Doppelte in der gespeicherten Ordnung z\xE4hlen einmal",
  ordne(KANON, ["Studio", "Studio", "Ideen"]).filter((n) => n === "Studio").length,
  1
);
ist("und es geht nichts verloren", ordne(KANON, ["Studio", "Studio"]).length, KANON.length);
var altOrdnung = ["Studio", "Ideen", "Korpus", "Hilfe"];
var mitNeu = ordne(["Studio", "Ideen", "Korpus", "Bildwelt", "Hilfe"], altOrdnung);
wahr("ein neuer Reiter erscheint \xFCberhaupt", mitNeu.includes("Bildwelt"));
ist("und zwar hinter seinem Vorg\xE4nger", mitNeu.indexOf("Bildwelt"), mitNeu.indexOf("Korpus") + 1);
ist("nicht am Ende", mitNeu[mitNeu.length - 1], "Hilfe");
ist(
  "ein neuer erster Reiter kommt nach vorn",
  ordne(["Neu", "Studio", "Ideen"], ["Studio", "Ideen"])[0],
  "Neu"
);
var eigen = ordne(["Studio", "Ideen", "Korpus", "Bildwelt"], ["Korpus", "Studio", "Ideen"]);
ist(
  "ein neuer Reiter setzt sich neben seinen Nachbarn",
  eigen.indexOf("Bildwelt"),
  eigen.indexOf("Korpus") + 1
);
ist("auch wenn er dabei in die eigene Anordnung ger\xE4t", eigen.join(","), "Korpus,Bildwelt,Studio,Ideen");
ist("verloren geht dabei nichts", eigen.length, 4);
ist("ohne Ausblendung erscheint alles", sichtbar(KANON, { ordnung: [], versteckt: [] }).length, KANON.length);
ist(
  "Ausgeblendetes verschwindet",
  sichtbar(KANON, { ordnung: [], versteckt: ["Ideen", "Hilfe"] }).length,
  KANON.length - 2
);
wahr(
  "und zwar das richtige",
  !sichtbar(KANON, { ordnung: [], versteckt: ["Ideen"] }).includes("Ideen")
);
wahr(
  "das Studio l\xE4sst sich nicht ausblenden",
  sichtbar(KANON, { ordnung: [], versteckt: ["Studio"] }).includes("Studio")
);
var alles = sichtbar(KANON, { ordnung: [], versteckt: [...KANON] });
wahr("und alles auszublenden ergibt keine leere Leiste", alles.length > 0);
wahr("\xFCbrig bleibt der Pflichtreiter", alles.includes("Studio"));
var ohnePflicht = sichtbar(["Ideen", "Korpus"], { ordnung: [], versteckt: ["Ideen", "Korpus"] });
ist("ohne Pflichtreiter bleibt trotzdem einer stehen", ohnePflicht.length, 1);
wahr(
  "ein gew\xF6hnlicher Reiter verschwindet wirklich",
  !sichtbar(KANON, { ordnung: [], versteckt: ["Korpus"] }).includes("Korpus")
);
ist(
  "Sichtbarkeit h\xE4lt die eigene Reihenfolge ein",
  sichtbar(KANON, { ordnung: ["Hilfe", "Studio"], versteckt: ["Ideen"] })[0],
  "Hilfe"
);
ist("nach vorn", verschiebe(["a", "b", "c"], "b", -1).join(","), "b,a,c");
ist("nach hinten", verschiebe(["a", "b", "c"], "b", 1).join(","), "a,c,b");
ist("ganz vorn passiert nichts mehr", verschiebe(["a", "b"], "a", -1).join(","), "a,b");
ist("ganz hinten auch nicht", verschiebe(["a", "b"], "b", 1).join(","), "a,b");
ist("ein unbekannter Name \xE4ndert nichts", verschiebe(["a", "b"], "x", 1).join(","), "a,b");
ist("die Liste bleibt gleich lang", verschiebe(["a", "b", "c"], "a", 1).length, 3);
ist("ausblenden merkt sich das", schalte({ ordnung: [], versteckt: [] }, "Korpus", false).versteckt.join(","), "Korpus");
ist("einblenden nimmt es zur\xFCck", schalte({ ordnung: [], versteckt: ["Korpus"] }, "Korpus", true).versteckt.length, 0);
ist(
  "zweimal ausblenden bleibt einmal",
  schalte(schalte({ ordnung: [], versteckt: [] }, "Korpus", false), "Korpus", false).versteckt.length,
  1
);
ist(
  "das Studio l\xE4sst sich auch hier nicht ausblenden",
  schalte({ ordnung: [], versteckt: [] }, "Studio", false).versteckt.length,
  0
);
ist(
  "die Ordnung bleibt beim Schalten unber\xFChrt",
  schalte({ ordnung: ["b", "a"], versteckt: [] }, "a", false).ordnung.join(","),
  "b,a"
);
wahr("die Einstellung wandert in die Projektdatei", REITER_KEY.startsWith("divergenz_"));
localStorage.removeItem(REITER_KEY);
ist("ohne Eintrag ist der Stand leer", ladeStand().ordnung.length, 0);
sichereStand({ ordnung: ["Hilfe", "Studio"], versteckt: ["Ideen"] });
ist("Gesichertes kommt zur\xFCck", ladeStand().ordnung.join(","), "Hilfe,Studio");
ist("mitsamt Ausblendung", ladeStand().versteckt.join(","), "Ideen");
localStorage.setItem(REITER_KEY, "{kein json");
ist("kaputter Inhalt ergibt einen leeren Stand", ladeStand().ordnung.length, 0);
localStorage.setItem(REITER_KEY, JSON.stringify({ ordnung: "kein array", versteckt: [7, "Ideen"] }));
ist("Unsinn in der Ordnung ergibt eine Liste", ladeStand().ordnung.length, 0);
ist("und Zahlen fallen aus der Ausblendung", ladeStand().versteckt.join(","), "Ideen");
ist("vor dem Eintragen ist der Kanon leer", derKanon().length, 0);
setzeKanon(KANON);
ist("nach dem Eintragen steht er", derKanon().join(","), KANON.join(","));
setzeKanon(["a"]);
ist("und l\xE4sst sich ersetzen", derKanon().join(","), "a");
var kopie = derKanon();
kopie.push("b");
ist("die Liste wird als Kopie herausgegeben, nicht als Griff", derKanon().length, 1);
wahr("das Studio ist Pflichtreiter", PFLICHT.includes("Studio"));
console.log(`Pr\xFCfstand Reiter \u2014 ${geprueft} Pr\xFCfungen:`);
zeilen.forEach((z) => console.log(z));
var proc = globalThis;
if (fails.length) {
  console.error(`
\u274C ${fails.length} Fehler bei den Reitern:`);
  fails.forEach((f) => console.error("  - " + f));
  proc.process?.exit(1);
} else {
  console.log(`
\u2705 Reiter: alle ${geprueft} Pr\xFCfungen bestanden.`);
}
