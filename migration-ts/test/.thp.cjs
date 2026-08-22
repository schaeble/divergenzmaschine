"use strict";

// src/features/themenpool.ts
var LABEL = 'SERVICE wikibase:label { bd:serviceParam wikibase:language "de,en". }';
var THEMEN = [
  {
    id: "filmfiguren",
    label: "Filmfiguren",
    hinweis: "Figuren aus Spielfilmen mit dem Film, in dem sie vorkommen.",
    sparql: `SELECT ?item ?werLabel ?wasLabel ?wannRoh ?woLabel WHERE {
  ?item wdt:P31 wd:Q15773317 .
  OPTIONAL { ?item wdt:P1441 ?was . }
  OPTIONAL { ?item wdt:P106 ?beruf . }
  OPTIONAL { ?was wdt:P577 ?wannRoh . }
  OPTIONAL { ?was wdt:P495 ?wo . }
  BIND(?item AS ?wer)
  ${LABEL}
} LIMIT 120`,
    wasSatz: (was) => `taucht in \u201E${was}\u201C auf`
  },
  {
    id: "regie",
    label: "Regie und Film",
    hinweis: "Regisseurinnen und Regisseure mit einem ihrer Filme.",
    sparql: `SELECT ?item ?werLabel ?wasLabel ?wannRoh ?woLabel WHERE {
  ?was wdt:P31 wd:Q11424 ; wdt:P57 ?item ; wdt:P577 ?wannRoh .
  OPTIONAL { ?was wdt:P495 ?wo . }
  BIND(?item AS ?wer)
  ${LABEL}
} LIMIT 120`,
    wasSatz: (was) => `dreht \u201E${was}\u201C`
  },
  {
    id: "politik",
    label: "Politik",
    hinweis: "Politikerinnen und Politiker mit Amt, Geburtsort und Jahr.",
    sparql: `SELECT ?item ?werLabel ?wasLabel ?wannRoh ?woLabel WHERE {
  ?item wdt:P106 wd:Q82955 ; wdt:P569 ?wannRoh ; wdt:P19 ?wo .
  OPTIONAL { ?item wdt:P39 ?was . }
  BIND(?item AS ?wer)
  ${LABEL}
} LIMIT 120`,
    wasSatz: (was) => `ist ${was}`
  },
  {
    id: "erfindung",
    label: "Erfindungen",
    hinweis: "Erfinderinnen und Erfinder mit dem, was sie ersonnen haben.",
    sparql: `SELECT ?item ?werLabel ?wasLabel ?wannRoh ?woLabel WHERE {
  ?was wdt:P61 ?item ; wdt:P571 ?wannRoh .
  OPTIONAL { ?item wdt:P19 ?wo . }
  BIND(?item AS ?wer)
  ${LABEL}
} LIMIT 120`,
    wasSatz: (was) => `ersinnt ${was}`
  },
  {
    id: "musik",
    label: "Komponistinnen und Komponisten",
    hinweis: "Werke der Musik mit ihren Urhebern und dem Jahr.",
    sparql: `SELECT ?item ?werLabel ?wasLabel ?wannRoh ?woLabel WHERE {
  ?was wdt:P86 ?item ; wdt:P571 ?wannRoh .
  OPTIONAL { ?item wdt:P19 ?wo . }
  BIND(?item AS ?wer)
  ${LABEL}
} LIMIT 120`,
    wasSatz: (was) => `komponiert \u201E${was}\u201C`
  },
  {
    id: "entdeckung",
    label: "Entdeckungen",
    hinweis: "Wer hat was entdeckt \u2014 und wann.",
    sparql: `SELECT ?item ?werLabel ?wasLabel ?wannRoh ?woLabel WHERE {
  ?was wdt:P61 ?item .
  OPTIONAL { ?was wdt:P575 ?wannRoh . }
  OPTIONAL { ?item wdt:P19 ?wo . }
  BIND(?item AS ?wer)
  ${LABEL}
} LIMIT 120`,
    wasSatz: (was) => `entdeckt ${was}`
  },
  {
    id: "literatur",
    label: "Literatur",
    hinweis: "Romane und Erz\xE4hlungen mit Verfasserin oder Verfasser.",
    sparql: `SELECT ?item ?werLabel ?wasLabel ?wannRoh ?woLabel WHERE {
  ?was wdt:P31 wd:Q7725634 ; wdt:P50 ?item ; wdt:P577 ?wannRoh .
  OPTIONAL { ?item wdt:P19 ?wo . }
  BIND(?item AS ?wer)
  ${LABEL}
} LIMIT 120`,
    wasSatz: (was) => `schreibt \u201E${was}\u201C`
  },
  {
    id: "bauwerk",
    label: "Bauwerke",
    hinweis: "Bauwerke mit Architektin oder Architekt, Ort und Jahr.",
    sparql: `SELECT ?item ?werLabel ?wasLabel ?wannRoh ?woLabel WHERE {
  ?was wdt:P84 ?item ; wdt:P571 ?wannRoh ; wdt:P131 ?wo .
  BIND(?item AS ?wer)
  ${LABEL}
} LIMIT 120`,
    wasSatz: (was) => `entwirft ${was}`
  }
];
var THEMA_IDS = THEMEN.map((t) => t.id);
function themaVon(id) {
  return THEMEN.find((t) => t.id === id) || null;
}
function jahrVon(roh) {
  const m = (roh || "").match(/^(-?\d{1,4})-/);
  if (!m) return "";
  const j = parseInt(m[1], 10);
  if (!Number.isFinite(j) || j === 0) return "";
  return j < 0 ? `${Math.abs(j)} v. Chr.` : String(j);
}
var IST_QID = /^Q\d+$/;
function zerlegeZeile(z, thema) {
  const feld = (n) => {
    const v = (z[n]?.value || "").trim();
    return IST_QID.test(v) ? "" : v;
  };
  const wer = feld("werLabel");
  const was = feld("wasLabel");
  if (!wer && !was) return null;
  const wo = feld("woLabel");
  const wann = jahrVon(z["wannRoh"]?.value || "");
  const qid = ((z["item"]?.value || "").match(/Q\d+$/) || [""])[0];
  return {
    thema: thema.id,
    themaLabel: thema.label,
    titel: wer || was,
    qid,
    ctx: {
      // Der Ort bekommt seine Präposition erst im Studio (normWhere) — hier
      // steht der nackte Name, wie ihn Wikidata führt.
      where: wo,
      when: wann,
      who: wer,
      // Ohne Wer ist das Werk die Handlung; mit Wer ist es das, woran er hängt.
      // Mit Person wird aus der Sache eine Handlung, ohne Person bleibt sie die
      // Sache selbst — dann trägt sie den Satz als Nominalphrase.
      what: wer && was ? thema.wasSatz(was) : was
    },
    gespeichert: Date.now()
  };
}
function zerlegeAntwort(roh, thema) {
  const o = roh;
  const zeilen = o?.results?.bindings;
  if (!Array.isArray(zeilen)) return [];
  const raus = [];
  const gesehen = /* @__PURE__ */ new Set();
  for (const z of zeilen) {
    const f = zerlegeZeile(z, thema);
    if (!f) continue;
    const k = `${f.ctx.who}|${f.ctx.what}`.toLowerCase();
    if (gesehen.has(k)) continue;
    gesehen.add(k);
    raus.push(f);
  }
  return raus;
}
var WIKIDATA_URL = "https://query.wikidata.org/sparql";
async function holeThema(thema, hole = fetch) {
  const url = `${WIKIDATA_URL}?format=json&query=${encodeURIComponent(thema.sparql)}`;
  const res = await hole(url, { mode: "cors", credentials: "omit" });
  if (!res.ok) throw new Error(`Wikidata antwortete mit ${res.status}`);
  return zerlegeAntwort(await res.json(), thema);
}
var THEMA_KEY = "divergenz_themenpool_v1";
var THEMA_DECKEL = 400;
function fundSchluessel(f) {
  return `${f.thema}|${f.ctx.who}|${f.ctx.what}`.toLowerCase();
}
function mischeThemen(alt, neu, deckel = THEMA_DECKEL) {
  const bekannt = new Set(alt.map(fundSchluessel));
  const raus = alt.slice();
  for (const f of neu) {
    if (!f.ctx.what && !f.ctx.who) continue;
    const k = fundSchluessel(f);
    if (bekannt.has(k)) continue;
    bekannt.add(k);
    raus.push(f);
  }
  return deckel > 0 && raus.length > deckel ? raus.slice(raus.length - deckel) : raus;
}
function ladeThemen() {
  try {
    const r = JSON.parse(localStorage.getItem(THEMA_KEY) || "[]");
    if (!Array.isArray(r)) return [];
    return r.filter((f) => f && f.ctx && typeof f.ctx.what === "string");
  } catch {
    return [];
  }
}
function ziehThema(thema = "", vorrat = ladeThemen(), rnd = Math.random) {
  const topf = thema ? vorrat.filter((f) => f.thema === thema) : vorrat;
  if (!topf.length) return null;
  return topf[Math.min(topf.length - 1, Math.floor(rnd() * topf.length))];
}
function themenStand(vorrat = ladeThemen()) {
  return { funde: vorrat.length, themen: new Set(vorrat.map((f) => f.thema)).size };
}

// src/features/kontext.ts
var QUELLEN = ["welt", "wiki", "abschrift", "thema"];
var QUELLE_LABEL = {
  welt: "Welt",
  wiki: "Wiki",
  abschrift: "Abschrift",
  thema: "Thema"
};
function offeneQuellen(wikiFunde, bildFunde, themaFunde = 0) {
  const raus = ["welt"];
  if (wikiFunde > 0) raus.push("wiki");
  if (bildFunde > 0) raus.push("abschrift");
  if (themaFunde > 0) raus.push("thema");
  return raus;
}

// test/themenpool.ts
{
  const g = globalThis;
  if (typeof g.localStorage === "undefined") {
    const m = {};
    g.localStorage = {
      getItem: (k) => k in m ? m[k] : null,
      setItem: (k, v) => {
        m[k] = String(v);
      },
      removeItem: (k) => {
        delete m[k];
      },
      clear: () => {
        for (const k of Object.keys(m)) delete m[k];
      },
      key: () => null,
      length: 0
    };
  }
}
var fails = [];
var geprueft = 0;
var bestanden = 0;
var ist = (name, wert, soll) => {
  geprueft++;
  if (wert === soll) bestanden++;
  else fails.push(`${name}: \u201E${String(wert)}\u201C \u2014 erwartet \u201E${String(soll)}\u201C`);
};
var wahr = (name, b) => ist(name, b, true);
wahr(`es gibt Themen (${THEMEN.length})`, THEMEN.length >= 6);
for (const t of THEMEN) {
  for (const feld of ["?item", "?werLabel", "?wasLabel", "?wannRoh", "?woLabel"]) {
    wahr(`${t.id}: die Abfrage nennt ${feld}`, t.sparql.includes(feld));
  }
  wahr(`${t.id}: mit Beschriftungsdienst`, t.sparql.includes("wikibase:label"));
  wahr(`${t.id}: mit Deckel`, /LIMIT \d+/.test(t.sparql));
  wahr(`${t.id}: hat eine Erkl\xE4rung`, t.hinweis.length > 20);
  const satz = t.wasSatz("Die Dreigroschenoper");
  wahr(`${t.id}: der Handlungssatz tr\xE4gt ein Verb (${satz})`, /^[a-zäöü]+t\b|^ist\b/.test(satz));
}
ist("die Kennungen sind eindeutig", new Set(THEMA_IDS).size, THEMEN.length);
wahr("ein unbekanntes Thema gibt es nicht", themaVon("gibtesnicht") === null);
ist("aus einem Zeitstempel wird ein Jahr", jahrVon("1928-08-31T00:00:00Z"), "1928");
ist("ein negatives Jahr wird vorchristlich", jahrVon("-0375-01-01T00:00:00Z"), "375 v. Chr.");
ist("Jahr null gibt es nicht", jahrVon("0000-01-01T00:00:00Z"), "");
ist("und Unlesbares ergibt nichts", jahrVon("kaputt"), "");
ist("leer bleibt leer", jahrVon(""), "");
var ANTWORT = { results: { bindings: [
  {
    item: { value: "http://www.wikidata.org/entity/Q4914" },
    werLabel: { value: "Bertolt Brecht" },
    wasLabel: { value: "Die Dreigroschenoper" },
    wannRoh: { value: "1928-08-31T00:00:00Z" },
    woLabel: { value: "Augsburg" }
  },
  {
    item: { value: "http://www.wikidata.org/entity/Q42" },
    werLabel: { value: "Douglas Adams" },
    wasLabel: { value: "Per Anhalter" },
    wannRoh: { value: "1979-10-12T00:00:00Z" },
    woLabel: { value: "Cambridge" }
  },
  // Dieselbe Person mit demselben Werk: Wikidata liefert das doppelt, sobald
  // eine der optionalen Angaben mehrere Werte hat.
  {
    item: { value: "http://www.wikidata.org/entity/Q42" },
    werLabel: { value: "Douglas Adams" },
    wasLabel: { value: "Per Anhalter" },
    wannRoh: { value: "1979-10-12T00:00:00Z" },
    woLabel: { value: "London" }
  },
  // Ohne Beschriftung gibt Wikidata die nackte Q-Nummer zurück. Die gehört
  // nicht in einen Text.
  {
    item: { value: "http://www.wikidata.org/entity/Q999" },
    werLabel: { value: "Q999" },
    wasLabel: { value: "Q888" },
    wannRoh: { value: "2001-01-01T00:00:00Z" },
    woLabel: { value: "Q7" }
  },
  // Nur ein Werk, keine Person — brauchbar, aber ohne Handlungsverb.
  {
    item: { value: "http://www.wikidata.org/entity/Q7" },
    wasLabel: { value: "Die Blechtrommel" },
    wannRoh: { value: "1959-01-01T00:00:00Z" }
  }
] } };
var lit = themaVon("literatur");
var funde = zerlegeAntwort(ANTWORT, lit);
ist("f\xFCnf Zeilen ergeben drei Funde", funde.length, 3);
ist("die Dublette f\xE4llt weg", funde.filter((f) => f.ctx.who === "Douglas Adams").length, 1);
wahr("keine nackte Q-Nummer im Text", !funde.some((f) => /^Q\d+$/.test(f.ctx.who) || /Q\d+/.test(f.ctx.what)));
ist("aus Person und Werk wird eine Handlung", funde[0].ctx.what, "schreibt \u201EDie Dreigroschenoper\u201C");
ist("und der Ort steht ohne Pr\xE4position da", funde[0].ctx.where, "Augsburg");
ist("der Beleg wandert mit", funde[0].qid, "Q4914");
ist("ohne Person bleibt das Werk die Sache", funde[2].ctx.what, "Die Blechtrommel");
ist("und tr\xE4gt dann den Titel", funde[2].titel, "Die Blechtrommel");
ist(
  "eine leere Zeile ergibt keinen Fund",
  zerlegeAntwort({ results: { bindings: [{ item: { value: "Q1" } }] } }, lit).length,
  0
);
ist("und eine kaputte Antwort auch nicht", zerlegeAntwort({ fehler: "?" }, lit).length, 0);
ist("null ebenso", zerlegeAntwort(null, lit).length, 0);
{
  let gesehen = "";
  const attrappe = async (url) => {
    gesehen = url;
    return { ok: true, json: async () => ANTWORT };
  };
  void holeThema(lit, attrappe).then((f) => {
    ist("holeThema liefert die Funde", f.length, 3);
    wahr("die URL geht an Wikidata", gesehen.startsWith(WIKIDATA_URL));
    wahr("mit JSON als Format", gesehen.includes("format=json"));
    wahr("und die Abfrage ist kodiert", gesehen.includes("query=SELECT%20") || gesehen.includes("query=SELECT+"));
  });
  const kaputt = async () => ({ ok: false, status: 429 });
  void holeThema(lit, kaputt).then(() => {
    ist("ein Fehlschlag wirft", "kein Fehler", "Fehler");
  }).catch((e) => {
    wahr("ein Fehlschlag wirft und nennt den Grund", String(e).includes("429"));
  });
}
{
  const f = (thema, wer, was) => ({
    thema,
    themaLabel: thema,
    titel: wer,
    qid: "Q1",
    ctx: { where: "", when: "", who: wer, what: was },
    gespeichert: 0
  });
  const a = mischeThemen([], [f("literatur", "Brecht", "schreibt"), f("politik", "Adams", "ist")]);
  ist("neue Funde kommen dazu", a.length, 2);
  const b = mischeThemen(a, [f("literatur", "Brecht", "schreibt")]);
  ist("bekannte nicht noch einmal", b.length, 2);
  const viele = mischeThemen([], Array.from({ length: 12 }, (_, i) => f("literatur", "P" + i, "schreibt " + i)), 5);
  ist("der Deckel greift", viele.length, 5);
  ist("und das \xC4lteste f\xE4llt vorn heraus", viele[0].ctx.who, "P7");
  ist(
    "ein Fund ohne Wer und Was kommt nicht hinein",
    mischeThemen([], [f("literatur", "", "")]).length,
    0
  );
  wahr(`der Deckel ist gesetzt (${THEMA_DECKEL})`, THEMA_DECKEL >= 100);
  const topf = [f("literatur", "Brecht", "schreibt"), f("politik", "Adams", "ist"), f("politik", "Vogt", "ist")];
  ist("mit Thema wird nur daraus gezogen", ziehThema("politik", topf, () => 0).thema, "politik");
  ist("und 1.0 f\xE4llt nicht heraus", ziehThema("politik", topf, () => 1).thema, "politik");
  wahr("ohne Thema aus allem", !!ziehThema("", topf, () => 0));
  ist("aus dem Leeren kommt nichts", ziehThema("", [], () => 0), null);
  ist("und aus einem unbekannten Thema auch nicht", ziehThema("gibtesnicht", topf, () => 0), null);
  const st = themenStand(topf);
  ist("der Stand z\xE4hlt die Funde", st.funde, 3);
  ist("und die Themen", st.themen, 2);
}
ist("ohne Vorr\xE4te bleibt nur die Welt", offeneQuellen(0, 0, 0).join(","), "welt");
ist("mit Themenpool kommt Thema dazu", offeneQuellen(0, 0, 5).join(","), "welt,thema");
ist("mit allen vieren", offeneQuellen(1, 1, 1).join(","), "welt,wiki,abschrift,thema");
wahr("jede Quelle hat eine Beschriftung", QUELLEN.every((q) => !!QUELLE_LABEL[q]));
ist("es sind vier", QUELLEN.length, 4);
var proc = globalThis;
setTimeout(() => {
  console.log(`Pr\xFCfstand Themenpool \u2014 ${geprueft} Pr\xFCfungen, ${bestanden} bestanden`);
  if (fails.length) {
    console.error(`
\u274C Themenpool: ${fails.length} Fehler:`);
    fails.forEach((f) => console.error("  - " + f));
    proc.process?.exit(1);
  } else {
    console.log(`
\u2705 Themenpool: alle ${geprueft} Pr\xFCfungen bestanden.`);
  }
}, 30);
