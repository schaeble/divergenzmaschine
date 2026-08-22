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
var THEMA_IDS = THEMEN.map((t2) => t2.id);
function themaVon(id) {
  return THEMEN.find((t2) => t2.id === id) || null;
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

// ../../tp.ts
var st = {};
globalThis.localStorage = { getItem: (k) => st[k] ?? null, setItem: (k, v) => {
  st[k] = String(v);
}, removeItem: (k) => {
  delete st[k];
} };
globalThis.window = { localStorage: globalThis.localStorage };
var antwort = { head: { vars: ["item", "werLabel", "wasLabel", "wannRoh", "woLabel"] }, results: { bindings: [
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
    wasLabel: { value: "Per Anhalter durch die Galaxis" },
    wannRoh: { value: "1979-10-12T00:00:00Z" },
    woLabel: { value: "Cambridge" }
  },
  // Dieselbe Person, dasselbe Werk — Wikidata liefert das bei mehreren Orten doppelt
  {
    item: { value: "http://www.wikidata.org/entity/Q42" },
    werLabel: { value: "Douglas Adams" },
    wasLabel: { value: "Per Anhalter durch die Galaxis" },
    wannRoh: { value: "1979-10-12T00:00:00Z" },
    woLabel: { value: "London" }
  },
  // Ohne Beschriftung: Wikidata gibt die nackte Q-Nummer zurück
  {
    item: { value: "http://www.wikidata.org/entity/Q999999" },
    werLabel: { value: "Q999999" },
    wasLabel: { value: "Q888888" },
    wannRoh: { value: "2001-01-01T00:00:00Z" },
    woLabel: { value: "Q7" }
  },
  // Nur ein Werk, keine Person
  {
    item: { value: "http://www.wikidata.org/entity/Q7" },
    wasLabel: { value: "Die Blechtrommel" },
    wannRoh: { value: "1959-01-01T00:00:00Z" }
  },
  // Antike: negatives Jahr
  {
    item: { value: "http://www.wikidata.org/entity/Q859" },
    werLabel: { value: "Platon" },
    wasLabel: { value: "Politeia" },
    wannRoh: { value: "-0375-01-01T00:00:00Z" },
    woLabel: { value: "Athen" }
  }
] } };
var t = themaVon("literatur");
var funde = zerlegeAntwort(antwort, t);
console.log("Funde:", funde.length, "von 6 Zeilen");
for (const f of funde) console.log("  ", JSON.stringify(f.ctx), "\xB7", f.qid, "\xB7", f.titel);
console.log("\njahrVon:", ["1928-08-31T00:00:00Z", "-0375-01-01T00:00:00Z", "", "0000-01-01T00:00:00Z", "kaputt"].map((x) => JSON.stringify(jahrVon(x))).join(" "));
var holeAttrappe = async (url) => {
  console.log("\nURL-L\xE4nge:", url.length, "\xB7 Anfang:", url.slice(0, 70));
  return { ok: true, json: async () => antwort };
};
holeThema(t, holeAttrappe).then((f) => console.log("\xFCber holeThema:", f.length, "Funde"));
