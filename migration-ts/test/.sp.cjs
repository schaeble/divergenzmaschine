"use strict";

// src/features/knobs.ts
var KNOB_VORGABE = { fuegeteil: 25, w4max: 2, abstand: 12, bogen: 100, ton: 100, korpus: 0, phrase: 5, satzlaenge: 9 };

// src/generation/optionen.ts
var TONE_OPTS = [
  ["neutral", "Neutral"],
  ["mystery", "Mystery"],
  ["poetic", "Poetisch"],
  ["melancholisch", "Melancholisch"],
  ["dark", "D\xFCster"],
  ["unheimlich", "Unheimlich"],
  ["uplifting", "Hoffnungsvoll"],
  ["zaertlich", "Z\xE4rtlich"],
  ["traeumerisch", "Tr\xE4umerisch"],
  ["nuechtern", "N\xFCchtern"],
  ["ironisch", "Ironisch"],
  ["humorous", "Humorvoll"]
];
var FORM_OPTS = [
  ["prose", "Prosa"],
  ["poem", "Prosagedicht"],
  ["strang", "Gedicht-Strang"],
  ["reim", "Reim"],
  ["haiku", "Haiku"],
  ["script", "Szene/Dialog"],
  ["video", "Multi-Shot (Video)"],
  ["bericht", "Bericht (Zeitung)"],
  ["meldung", "Meldung (kurz)"]
];
var STRUCTURE_OPTS = [
  ["auto", "Auto"],
  ["linear", "Linear"],
  ["reverse", "Reverse"],
  ["circle", "Kreis"],
  ["fragment", "Fragment"],
  ["object", "Objekt"],
  ["dramaturgie", "Dramaturgie (Preset 2.0)"],
  ["rekombination", "Rekombination"]
];
var MODE_OPTS = [
  ["auto", "Auto"],
  ["bureau", "B\xFCrokratie"],
  ["tech", "Tech-Mystik"],
  ["body", "Body"],
  ["myth", "Myth"],
  ["absurd", "Absurd"],
  ["post", "Posthuman"]
];
var PERSP_OPTS = [
  ["auto", "Auto"],
  ["third", "Er/Sie"],
  ["first", "Ich"],
  ["second", "Du"],
  ["we", "Wir"],
  ["object", "Objekt"]
];
var RHYTHM_OPTS = [
  ["auto", "Auto"],
  ["breath", "Atem"],
  ["staccato", "Staccato"],
  ["long", "Lange B\xF6gen"],
  ["fracture", "Fraktur"],
  ["clean", "Klar"]
];
var VARIANZ_OPTS = [["low", "Stabil"], ["mid", "Wild"], ["high", "Radikal"]];
var DISRUPTOR_OPTS = [["auto", "Auto"], ["off", "Aus"], ["on", "An"]];
var ARCH_OPTS = [
  ["neutral", "Neutral"],
  ["skorpion", "Skorpion"],
  ["psychopath", "Psychopath"],
  ["entdecker", "Entdecker"]
];
var MARKOV_OPTS = [["off", "Aus"], ["mix", "Mix"], ["on", "Stark"]];

// src/generation/verbconj.data.ts
var VERB_CONJ = {
  "bemerkt": {
    "ich": "bemerke",
    "du": "bemerkst",
    "wir": "bemerken",
    "ihr": "bemerkt"
  },
  "nimmt": {
    "ich": "nehme",
    "du": "nimmst",
    "wir": "nehmen",
    "ihr": "nehmt"
  },
  "steht": {
    "ich": "stehe",
    "du": "stehst",
    "wir": "stehen",
    "ihr": "steht"
  },
  "h\xE4lt": {
    "ich": "halte",
    "du": "h\xE4ltst",
    "wir": "halten",
    "ihr": "haltet"
  },
  "sucht": {
    "ich": "suche",
    "du": "suchst",
    "wir": "suchen",
    "ihr": "sucht"
  },
  "versucht": {
    "ich": "versuche",
    "du": "versuchst",
    "wir": "versuchen",
    "ihr": "versucht"
  },
  "will": {
    "ich": "will",
    "du": "willst",
    "wir": "wollen",
    "ihr": "wollt"
  },
  "kann": {
    "ich": "kann",
    "du": "kannst",
    "wir": "k\xF6nnen",
    "ihr": "k\xF6nnt"
  },
  "muss": {
    "ich": "muss",
    "du": "musst",
    "wir": "m\xFCssen",
    "ihr": "m\xFCsst"
  },
  "darf": {
    "ich": "darf",
    "du": "darfst",
    "wir": "d\xFCrfen",
    "ihr": "d\xFCrft"
  },
  "mag": {
    "ich": "mag",
    "du": "magst",
    "wir": "m\xF6gen",
    "ihr": "m\xF6gt"
  },
  "soll": {
    "ich": "soll",
    "du": "sollst",
    "wir": "sollen",
    "ihr": "sollt"
  },
  "m\xF6chte": {
    "ich": "m\xF6chte",
    "du": "m\xF6chtest",
    "wir": "m\xF6chten",
    "ihr": "m\xF6chtet"
  },
  "ist": {
    "ich": "bin",
    "du": "bist",
    "wir": "sind",
    "ihr": "seid"
  },
  "wird": {
    "ich": "werde",
    "du": "wirst",
    "wir": "werden",
    "ihr": "werdet"
  },
  "geht": {
    "ich": "gehe",
    "du": "gehst",
    "wir": "gehen",
    "ihr": "geht"
  },
  "kommt": {
    "ich": "komme",
    "du": "kommst",
    "wir": "kommen",
    "ihr": "kommt"
  },
  "bleibt": {
    "ich": "bleibe",
    "du": "bleibst",
    "wir": "bleiben",
    "ihr": "bleibt"
  },
  "\xF6ffnet": {
    "ich": "\xF6ffne",
    "du": "\xF6ffnest",
    "wir": "\xF6ffnen",
    "ihr": "\xF6ffnet"
  },
  "schlie\xDFt": {
    "ich": "schlie\xDFe",
    "du": "schlie\xDFt",
    "wir": "schlie\xDFen",
    "ihr": "schlie\xDFt"
  },
  "fragt": {
    "ich": "frage",
    "du": "fragst",
    "wir": "fragen",
    "ihr": "fragt"
  },
  "f\xFChrt": {
    "ich": "f\xFChre",
    "du": "f\xFChrst",
    "wir": "f\xFChren",
    "ihr": "f\xFChrt"
  },
  "begreift": {
    "ich": "begreife",
    "du": "begreifst",
    "wir": "begreifen",
    "ihr": "begreift"
  },
  "bricht": {
    "ich": "breche",
    "du": "brichst",
    "wir": "brechen",
    "ihr": "brecht"
  },
  "kippt": {
    "ich": "kippe",
    "du": "kippst",
    "wir": "kippen",
    "ihr": "kippt"
  },
  "l\xF6scht": {
    "ich": "l\xF6sche",
    "du": "l\xF6schst",
    "wir": "l\xF6schen",
    "ihr": "l\xF6scht"
  },
  "tut": {
    "ich": "tue",
    "du": "tust",
    "wir": "tun",
    "ihr": "tut"
  },
  "macht": {
    "ich": "mache",
    "du": "machst",
    "wir": "machen",
    "ihr": "macht"
  },
  "sieht": {
    "ich": "sehe",
    "du": "siehst",
    "wir": "sehen",
    "ihr": "seht"
  },
  "gibt": {
    "ich": "gebe",
    "du": "gibst",
    "wir": "geben",
    "ihr": "gebt"
  },
  "tr\xE4gt": {
    "ich": "trage",
    "du": "tr\xE4gst",
    "wir": "tragen",
    "ihr": "tragt"
  },
  "h\xF6rt": {
    "ich": "h\xF6re",
    "du": "h\xF6rst",
    "wir": "h\xF6ren",
    "ihr": "h\xF6rt"
  },
  "findet": {
    "ich": "finde",
    "du": "findest",
    "wir": "finden",
    "ihr": "findet"
  },
  "ber\xFChrt": {
    "ich": "ber\xFChre",
    "du": "ber\xFChrst",
    "wir": "ber\xFChren",
    "ihr": "ber\xFChrt"
  },
  "beobachtet": {
    "ich": "beobachte",
    "du": "beobachtest",
    "wir": "beobachten",
    "ihr": "beobachtet"
  },
  "kennt": {
    "ich": "kenne",
    "du": "kennst",
    "wir": "kennen",
    "ihr": "kennt"
  },
  "nennt": {
    "ich": "nenne",
    "du": "nennst",
    "wir": "nennen",
    "ihr": "nennt"
  },
  "sp\xFCrt": {
    "ich": "sp\xFCre",
    "du": "sp\xFCrst",
    "wir": "sp\xFCren",
    "ihr": "sp\xFCrt"
  },
  "wei\xDF": {
    "ich": "wei\xDF",
    "du": "wei\xDFt",
    "wir": "wissen",
    "ihr": "wisst"
  },
  "braucht": {
    "ich": "brauche",
    "du": "brauchst",
    "wir": "brauchen",
    "ihr": "braucht"
  },
  "w\xFCnscht": {
    "ich": "w\xFCnsche",
    "du": "w\xFCnschst",
    "wir": "w\xFCnschen",
    "ihr": "w\xFCnscht"
  },
  "hofft": {
    "ich": "hoffe",
    "du": "hoffst",
    "wir": "hoffen",
    "ihr": "hofft"
  },
  "tr\xE4umt": {
    "ich": "tr\xE4ume",
    "du": "tr\xE4umst",
    "wir": "tr\xE4umen",
    "ihr": "tr\xE4umt"
  },
  "plant": {
    "ich": "plane",
    "du": "planst",
    "wir": "planen",
    "ihr": "plant"
  },
  "f\xFCrchtet": {
    "ich": "f\xFCrchte",
    "du": "f\xFCrchtest",
    "wir": "f\xFCrchten",
    "ihr": "f\xFCrchtet"
  },
  "wartet": {
    "ich": "warte",
    "du": "wartest",
    "wir": "warten",
    "ihr": "wartet"
  },
  "glaubt": {
    "ich": "glaube",
    "du": "glaubst",
    "wir": "glauben",
    "ihr": "glaubt"
  },
  "denkt": {
    "ich": "denke",
    "du": "denkst",
    "wir": "denken",
    "ihr": "denkt"
  },
  "f\xFChlt": {
    "ich": "f\xFChle",
    "du": "f\xFChlst",
    "wir": "f\xFChlen",
    "ihr": "f\xFChlt"
  },
  "verlangt": {
    "ich": "verlange",
    "du": "verlangst",
    "wir": "verlangen",
    "ihr": "verlangt"
  },
  "erwartet": {
    "ich": "erwarte",
    "du": "erwartest",
    "wir": "erwarten",
    "ihr": "erwartet"
  },
  "riskiert": {
    "ich": "riskiere",
    "du": "riskierst",
    "wir": "riskieren",
    "ihr": "riskiert"
  },
  "wagt": {
    "ich": "wage",
    "du": "wagst",
    "wir": "wagen",
    "ihr": "wagt"
  },
  "flieht": {
    "ich": "fliehe",
    "du": "fliehst",
    "wir": "fliehen",
    "ihr": "flieht"
  },
  "jagt": {
    "ich": "jage",
    "du": "jagst",
    "wir": "jagen",
    "ihr": "jagt"
  },
  "folgt": {
    "ich": "folge",
    "du": "folgst",
    "wir": "folgen",
    "ihr": "folgt"
  },
  "verfolgt": {
    "ich": "verfolge",
    "du": "verfolgst",
    "wir": "verfolgen",
    "ihr": "verfolgt"
  },
  "rettet": {
    "ich": "rette",
    "du": "rettest",
    "wir": "retten",
    "ihr": "rettet"
  },
  "verr\xE4t": {
    "ich": "verrate",
    "du": "verr\xE4tst",
    "wir": "verraten",
    "ihr": "verratet"
  },
  "vergisst": {
    "ich": "vergesse",
    "du": "vergisst",
    "wir": "vergessen",
    "ihr": "vergesst"
  },
  "hatte": {
    "ich": "hatte",
    "du": "hattest",
    "wir": "hatten",
    "ihr": "hattet"
  },
  "war": {
    "ich": "war",
    "du": "warst",
    "wir": "waren",
    "ihr": "wart"
  },
  "wollte": {
    "ich": "wollte",
    "du": "wolltest",
    "wir": "wollten",
    "ihr": "wolltet"
  },
  "tat": {
    "ich": "tat",
    "du": "tatest",
    "wir": "taten",
    "ihr": "tatet"
  },
  "machte": {
    "ich": "machte",
    "du": "machtest",
    "wir": "machten",
    "ihr": "machtet"
  },
  "kam": {
    "ich": "kam",
    "du": "kamst",
    "wir": "kamen",
    "ihr": "kamt"
  },
  "ging": {
    "ich": "ging",
    "du": "gingst",
    "wir": "gingen",
    "ihr": "gingt"
  },
  "f\xFChrte": {
    "ich": "f\xFChrte",
    "du": "f\xFChrtest",
    "wir": "f\xFChrten",
    "ihr": "f\xFChrtet"
  },
  "schloss": {
    "ich": "schloss",
    "du": "schlossest",
    "wir": "schlossen",
    "ihr": "schlosst"
  },
  "fragte": {
    "ich": "fragte",
    "du": "fragtest",
    "wir": "fragten",
    "ihr": "fragtet"
  },
  "begriff": {
    "ich": "begriff",
    "du": "begriffst",
    "wir": "begriffen",
    "ihr": "begrifft"
  },
  "stellt": {
    "ich": "stelle",
    "du": "stellst",
    "wir": "stellen"
  },
  "erkennt": {
    "ich": "erkenne",
    "du": "erkennst",
    "wir": "erkennen"
  },
  "zeigt": {
    "ich": "zeige",
    "du": "zeigst",
    "wir": "zeigen"
  },
  "greift": {
    "ich": "greife",
    "du": "greifst",
    "wir": "greifen"
  },
  "legt": {
    "ich": "lege",
    "du": "legst",
    "wir": "legen"
  },
  "betrachtet": {
    "ich": "betrachte",
    "du": "betrachtest",
    "wir": "betrachten"
  },
  "setzt": {
    "ich": "setze",
    "du": "setzt",
    "wir": "setzen"
  },
  "merkt": {
    "ich": "merke",
    "du": "merkst",
    "wir": "merken"
  },
  "pr\xFCft": {
    "ich": "pr\xFCfe",
    "du": "pr\xFCfst",
    "wir": "pr\xFCfen"
  }
};

// src/generation/verbconj.ts
var VERB_TOKEN_RE = new RegExp("\\b(" + Object.keys(VERB_CONJ).join("|") + ")\\b", "i");

// src/generation/wordcls.ts
var ICH_DU_HAND = {
  sehe: "sieht",
  siehst: "sieht",
  gehe: "geht",
  gehst: "geht",
  komme: "kommt",
  kommst: "kommt",
  finde: "findet",
  findest: "findet",
  glaube: "glaubt",
  glaubst: "glaubt",
  lebe: "lebt",
  lebst: "lebt",
  liege: "liegt",
  liegst: "liegt",
  sitze: "sitzt",
  lese: "liest",
  liest: "liest",
  schlafe: "schl\xE4ft",
  schl\u00E4fst: "schl\xE4ft",
  laufe: "l\xE4uft",
  l\u00E4ufst: "l\xE4uft",
  falle: "f\xE4llt",
  f\u00E4llst: "f\xE4llt",
  breche: "bricht",
  brichst: "bricht",
  rufe: "ruft",
  rufst: "ruft",
  weine: "weint",
  weinst: "weint",
  lache: "lacht",
  lachst: "lacht",
  sp\u00FCre: "sp\xFCrt",
  sp\u00FCrst: "sp\xFCrt",
  atme: "atmet",
  atmest: "atmet",
  singe: "singt",
  singst: "singt",
  \u00F6ffne: "\xF6ffnet",
  \u00F6ffnest: "\xF6ffnet",
  erinnere: "erinnert",
  erinnerst: "erinnert",
  erkenne: "erkennt",
  erkennst: "erkennt",
  zerbreche: "zerbricht",
  zerbrichst: "zerbricht",
  stolpere: "stolpert",
  stolperst: "stolpert",
  verharre: "verharrt",
  verharrst: "verharrt",
  wandere: "wandert",
  wanderst: "wandert",
  zittere: "zittert",
  zitterst: "zittert",
  fl\u00FCstere: "fl\xFCstert",
  fl\u00FCsterst: "fl\xFCstert",
  wundere: "wundert",
  wunderst: "wundert",
  z\u00F6gere: "z\xF6gert",
  z\u00F6gerst: "z\xF6gert",
  erwache: "erwacht",
  erwachst: "erwacht",
  verschwinde: "verschwindet",
  verschwindest: "verschwindet",
  begreife: "begreift",
  begreifst: "begreift",
  verstehe: "versteht",
  verstehst: "versteht",
  bleibe: "bleibt",
  bleibst: "bleibt",
  ziehe: "zieht",
  ziehst: "zieht"
};
var ICH_DU_ZU_ER = (() => {
  const m = {};
  for (const [dritte, formen] of Object.entries(VERB_CONJ)) {
    for (const p of ["ich", "du", "wir", "ihr"]) {
      const f = formen[p];
      if (f && !m[f]) m[f] = dritte;
    }
  }
  return { ...m, ...ICH_DU_HAND };
})();

// src/features/bildsammler.ts
var ARTIKEL = new RegExp(
  "\\b(?:der|die|das|den|dem|des|ein|eine|einen|einem|einer|eines|am|im|zum|zur|vom|beim|ins|ans|aufs|f\xFCrs|durchs|ums|dies|diese[rmns]?|jene[rmns]?|jede[rmns]?|manche[rmns]?|solche[rmns]?|alle[rmns]?|beide[rn]?|welche[rmns]?|keine?[rmns]?|mein|dein|sein|ihr|unser|euer|meine[rmns]?|deine[rmns]?|seine[rmns]?|ihre[rmns]?|unsere[rmns]?|eure[rmns]?)\\b",
  "i"
);

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

// src/generation/ideas.data.ts
var WHO_TAGGED = [
  { t: "eine Uhrmacherin", tags: ["einzel"] },
  { t: "ein pensionierter Richter", tags: ["einzel"] },
  { t: "eine Archivarin ohne Namen", tags: ["einzel"] },
  { t: "ein \xDCbersetzer f\xFCr tote Sprachen", tags: ["einzel"] },
  { t: "eine Kartographin ohne Karten", tags: ["einzel"] },
  { t: "ein Fremder, der jeden Namen kennt", tags: ["einzel"] },
  { t: "eine Chirurgin mit zitternden H\xE4nden", tags: ["einzel"] },
  { t: "ein M\xF6nch, der das Schweigen gebrochen hat", tags: ["einzel"] },
  { t: "eine Diplomatin ohne Land", tags: ["einzel"] },
  { t: "ein Leuchtturmw\xE4rter im letzten Dienstjahr", tags: ["einzel"] },
  { t: "eine Restauratorin alter Fresken", tags: ["einzel"] },
  { t: "ein Nachtportier mit fotografischem Ged\xE4chtnis", tags: ["einzel"] },
  { t: "eine Seismologin, die niemand ernst nimmt", tags: ["einzel"] },
  { t: "ein Totengr\xE4ber, der Briefe schreibt", tags: ["einzel"] },
  { t: "eine Glasbl\xE4serin mit vernarbten H\xE4nden", tags: ["einzel"] },
  { t: "ein Kanalarbeiter, der Stimmen h\xF6rt", tags: ["einzel"] },
  { t: "eine Bibliothekarin ohne Namen", tags: ["einzel"] },
  { t: "ein Boxer im Ruhestand", tags: ["einzel"] },
  { t: "ein Buchhalter mit doppeltem Ged\xE4chtnis", tags: ["einzel"] },
  { t: "eine Witwe, die nichts geerbt hat", tags: ["einzel"] },
  { t: "eine Handvoll \xDCberlebender", tags: ["kollektiv"] },
  { t: "ein Chor ohne Dirigent", tags: ["kollektiv"] },
  { t: "eine Belegschaft, die nicht mehr nach Hause geht", tags: ["kollektiv"] },
  { t: "ein Ensemble im Dauerstreik", tags: ["kollektiv"] },
  { t: "das Dorf hinter dem Deich", tags: ["kollektiv"] },
  { t: "eine Kommune ohne Anf\xFChrer", tags: ["kollektiv"] },
  { t: "ein Schwarm ohne Zentrum", tags: ["kollektiv", "nichtmensch"] },
  { t: "die Nachtschicht einer stillen Fabrik", tags: ["kollektiv"] },
  { t: "eine Expedition, die sich verlaufen hat", tags: ["kollektiv"] },
  { t: "ein Geschworenengericht ohne Angeklagten", tags: ["kollektiv", "institution"] },
  { t: "die Besatzung eines Frachtschiffs", tags: ["kollektiv"] },
  { t: "eine Familie mit zu vielen Geheimnissen", tags: ["kollektiv"] },
  { t: "ein Orchester, das nicht aufh\xF6ren kann", tags: ["kollektiv"] },
  { t: "eine Sekte ohne Gott", tags: ["kollektiv", "institution"] },
  { t: "ein Rettungstrupp ohne Auftrag", tags: ["kollektiv"] },
  { t: "eine Reisegruppe, die niemand abgeholt hat", tags: ["kollektiv"] },
  { t: "ein Kind, das zu viel wei\xDF", tags: ["kind", "einzel"] },
  { t: "ein Junge mit zwei Schatten", tags: ["kind"] },
  { t: "ein M\xE4dchen, das die Zukunft tr\xE4umt", tags: ["kind"] },
  { t: "ein stummes Kind mit fremder Handschrift", tags: ["kind"] },
  { t: "der j\xFCngste Zeuge einer langen Nacht", tags: ["kind"] },
  { t: "ein Waisenkind mit geerbtem Ged\xE4chtnis", tags: ["kind"] },
  { t: "ein Schulm\xE4dchen, das Karten f\xE4lscht", tags: ["kind", "antiheld"] },
  { t: "ein Junge, der jede L\xFCge h\xF6rt", tags: ["kind"] },
  { t: "ein Kind, das man vergessen hat abzuholen", tags: ["kind"] },
  { t: "eine Zw\xF6lfj\xE4hrige mit einem Vertrag", tags: ["kind"] },
  { t: "ein Findelkind ohne Spiegelbild", tags: ["kind"] },
  { t: "ein Junge, der einen Fluss gro\xDFzieht", tags: ["kind"] },
  { t: "ein M\xE4dchen mit dem Ged\xE4chtnis eines Hauses", tags: ["kind"] },
  { t: "ein Kind, das nur nachts spricht", tags: ["kind"] },
  { t: "der Sohn eines F\xE4lschers", tags: ["kind", "antiheld"] },
  { t: "ein Ministerium ohne Minister", tags: ["institution"] },
  { t: "eine Beh\xF6rde f\xFCr Verlorenes", tags: ["institution"] },
  { t: "ein Gericht im Exil", tags: ["institution"] },
  { t: "ein Archiv mit eigenem Willen", tags: ["institution", "nichtmensch"] },
  { t: "eine Bibliothek, die Entscheidungen trifft", tags: ["institution", "nichtmensch"] },
  { t: "ein Orden ohne Glauben", tags: ["institution"] },
  { t: "eine Klinik, die niemanden entl\xE4sst", tags: ["institution"] },
  { t: "das Amt f\xFCr unerledigte Dinge", tags: ["institution"] },
  { t: "eine Schule ohne Sch\xFCler", tags: ["institution"] },
  { t: "ein Museum, das seine Exponate verliert", tags: ["institution"] },
  { t: "eine Redaktion, die nur Dementis druckt", tags: ["institution"] },
  { t: "ein Konzern mit vergessener Zentrale", tags: ["institution"] },
  { t: "das Register aller falschen Namen", tags: ["institution", "nichtmensch"] },
  { t: "eine Kommission ohne Auftrag", tags: ["institution"] },
  { t: "ein Kloster mit fremdem Kalender", tags: ["institution"] },
  { t: "die Zensurbeh\xF6rde einer freien Stadt", tags: ["institution"] },
  { t: "ein Algorithmus mit Namen", tags: ["nichtmensch"] },
  { t: "eine Maschine, die zu tr\xE4umen beginnt", tags: ["nichtmensch"] },
  { t: "ein Fluss, der sich erinnert", tags: ["nichtmensch"] },
  { t: "eine Stimme ohne K\xF6rper", tags: ["nichtmensch"] },
  { t: "ein Tier, das ein Versprechen h\xE4lt", tags: ["nichtmensch"] },
  { t: "ein Haus mit eigenem Willen", tags: ["nichtmensch"] },
  { t: "eine Uhr, die zur\xFCckz\xE4hlt", tags: ["nichtmensch"] },
  { t: "ein Wald, der Namen vergibt", tags: ["nichtmensch"] },
  { t: "eine Kolonie unter dem Eis", tags: ["nichtmensch", "kollektiv"] },
  { t: "ein Signal, das antwortet", tags: ["nichtmensch"] },
  { t: "eine Karte, die sich selbst zeichnet", tags: ["nichtmensch"] },
  { t: "ein Spiegel mit Ged\xE4chtnis", tags: ["nichtmensch"] },
  { t: "eine Wolke, die einem Menschen folgt", tags: ["nichtmensch"] },
  { t: "ein Schiff ohne Besatzung, das Kurs h\xE4lt", tags: ["nichtmensch"] },
  { t: "eine Sprache, die aussterben will", tags: ["nichtmensch"] },
  { t: "ein Schatten, der fr\xFCher ankommt", tags: ["nichtmensch"] },
  { t: "ein Bahnhof, der Reisende beh\xE4lt", tags: ["nichtmensch"] },
  { t: "eine Falschm\xFCnzerin mit Prinzipien", tags: ["antiheld"] },
  { t: "ein Spion im Ruhestand", tags: ["antiheld", "einzel"] },
  { t: "eine Diebin, die nur Erinnerungen stiehlt", tags: ["antiheld"] },
  { t: "ein Verr\xE4ter aus Loyalit\xE4t", tags: ["antiheld"] },
  { t: "ein Hochstapler mit echtem Titel", tags: ["antiheld"] },
  { t: "eine Anw\xE4ltin f\xFCr aussichtslose F\xE4lle", tags: ["antiheld", "einzel"] },
  { t: "ein Erpresser mit gutem Ged\xE4chtnis", tags: ["antiheld"] },
  { t: "eine Schmugglerin von B\xFCchern", tags: ["antiheld"] },
  { t: "ein S\xF6ldner, der nicht mehr schie\xDFt", tags: ["antiheld"] },
  { t: "eine Betr\xFCgerin mit sauberem Gewissen", tags: ["antiheld"] },
  { t: "ein Kronzeuge, der l\xFCgt", tags: ["antiheld"] },
  { t: "eine Grabr\xE4uberin mit Doktortitel", tags: ["antiheld"] },
  { t: "ein Henker, der Gnade sammelt", tags: ["antiheld"] },
  { t: "eine F\xE4lscherin echter Dokumente", tags: ["antiheld"] },
  { t: "ein Deserteur mit Orden", tags: ["antiheld"] },
  { t: "eine Wilderin im Naturschutzgebiet", tags: ["antiheld"] },
  { t: "eine Pilotin ohne Lizenz", tags: ["antiheld", "einzel"] }
];
var WHERE_TAGGED = [
  { t: "in einer schlaflosen Stadt", tags: ["urban"] },
  { t: "in einem verlassenen Bahnhof", tags: ["urban"] },
  { t: "in einem Hinterhof ohne Ausgang", tags: ["urban", "raum"] },
  { t: "auf einem n\xE4chtlichen Boulevard", tags: ["urban"] },
  { t: "in einem Hochhaus ohne Erdgeschoss", tags: ["urban"] },
  { t: "in der U-Bahn nach Mitternacht", tags: ["urban"] },
  { t: "in einem Viertel, das abgerissen wird", tags: ["urban"] },
  { t: "auf einem Parkdeck \xFCber der Stadt", tags: ["urban"] },
  { t: "in einer Markthalle vor Sonnenaufgang", tags: ["urban"] },
  { t: "in einem Hotel mit zu vielen Zimmern", tags: ["urban"] },
  { t: "unter einer Autobahnbr\xFCcke", tags: ["urban"] },
  { t: "in einer Stra\xDFe, die zweimal existiert", tags: ["urban", "nirgendwo"] },
  { t: "in Paris", tags: ["urban"] },
  { t: "in einem Nachtbus ohne Fahrg\xE4ste", tags: ["urban", "raum"] },
  { t: "in einem Kino, das nie schlie\xDFt", tags: ["urban"] },
  { t: "auf einem Dach \xFCber dem Verkehr", tags: ["urban"] },
  { t: "in einer Telefonzelle, die noch klingelt", tags: ["urban"] },
  { t: "in einem Kellerclub ohne Namen", tags: ["urban"] },
  { t: "am Rand eines Moors", tags: ["natur"] },
  { t: "in einem Wald ohne V\xF6gel", tags: ["natur"] },
  { t: "an einer versinkenden K\xFCste", tags: ["natur"] },
  { t: "auf einem Gletscher, der schmilzt", tags: ["natur"] },
  { t: "in einer W\xFCste mit T\xFCren", tags: ["natur", "nirgendwo"] },
  { t: "am Ufer eines toten Flusses", tags: ["natur"] },
  { t: "am Fluss", tags: ["natur"] },
  { t: "in einem Tal, das verstummt ist", tags: ["natur"] },
  { t: "auf einer Insel ohne Hafen", tags: ["natur"] },
  { t: "in einer H\xF6hle mit warmem Wind", tags: ["natur", "raum"] },
  { t: "auf einem Feld nach der Ernte", tags: ["natur"] },
  { t: "an einem See, der nie zufriert", tags: ["natur"] },
  { t: "im Schilf hinter dem Deich", tags: ["natur"] },
  { t: "auf einem Pass im ersten Schnee", tags: ["natur", "grenze"] },
  { t: "in einem Obstgarten, der nicht mehr tr\xE4gt", tags: ["natur"] },
  { t: "an einer Steilk\xFCste im Nebel", tags: ["natur"] },
  { t: "unter einem Baum, der \xE4lter ist als das Dorf", tags: ["natur"] },
  { t: "in einem Sumpf voller Wracks", tags: ["natur"] },
  { t: "in einem versiegelten Zimmer", tags: ["raum"] },
  { t: "in einem Aufzug zwischen zwei Stockwerken", tags: ["raum", "grenze"] },
  { t: "in einer Kabine auf hoher See", tags: ["raum"] },
  { t: "in einem Bunker ohne Uhr", tags: ["raum"] },
  { t: "in einem Wartesaal ohne Z\xFCge", tags: ["raum"] },
  { t: "hinter einer T\xFCr, die nicht schlie\xDFt", tags: ["raum"] },
  { t: "in einem Zugabteil ohne Fenster", tags: ["raum"] },
  { t: "in einer Dunkelkammer", tags: ["raum"] },
  { t: "in einem Treppenhaus ohne Ausgang", tags: ["raum"] },
  { t: "in einem Beichtstuhl", tags: ["raum", "institution"] },
  { t: "in einer K\xFChlkammer", tags: ["raum"] },
  { t: "in einem Auto am Stra\xDFenrand", tags: ["raum"] },
  { t: "in einem Zelt im Dauerregen", tags: ["raum", "natur"] },
  { t: "in einem Fahrstuhlschacht", tags: ["raum"] },
  { t: "in einer Zelle mit Aussicht", tags: ["raum", "institution"] },
  { t: "auf einem Dachboden voller Uhren", tags: ["raum"] },
  { t: "an der Grenze zweier L\xE4nder", tags: ["grenze"] },
  { t: "auf einer Br\xFCcke im Niemandsland", tags: ["grenze"] },
  { t: "an der Schwelle zweier Zeiten", tags: ["grenze", "nirgendwo"] },
  { t: "in einer Zollstation im Nebel", tags: ["grenze"] },
  { t: "auf der Linie zwischen Traum und Wachen", tags: ["grenze", "nirgendwo"] },
  { t: "am \xDCbergang, den keiner bewacht", tags: ["grenze"] },
  { t: "auf einer F\xE4hre zwischen zwei Ufern", tags: ["grenze"] },
  { t: "an einem Grenzfluss ohne Br\xFCcke", tags: ["grenze", "natur"] },
  { t: "im Transitbereich eines Flughafens", tags: ["grenze"] },
  { t: "an der K\xFCstenlinie bei Flut", tags: ["grenze", "natur"] },
  { t: "auf dem letzten Meter vor der Sperre", tags: ["grenze"] },
  { t: "in einem Korridor zwischen zwei Staaten", tags: ["grenze"] },
  { t: "am Waldrand vor der Lichtung", tags: ["grenze", "natur"] },
  { t: "auf der T\xFCrschwelle, die niemand \xFCberschreitet", tags: ["grenze"] },
  { t: "an einem Ort ohne Namen", tags: ["nirgendwo"] },
  { t: "in einer Stadt, die es nicht gibt", tags: ["nirgendwo", "urban"] },
  { t: "im wei\xDFen Raum dazwischen", tags: ["nirgendwo"] },
  { t: "auf einer Karte ohne Legende", tags: ["nirgendwo"] },
  { t: "im Nichts nach dem letzten Halt", tags: ["nirgendwo"] },
  { t: "an einem vergessenen Koordinatenpunkt", tags: ["nirgendwo"] },
  { t: "zwischen zwei S\xE4tzen", tags: ["nirgendwo"] },
  { t: "in einem Traum, der jemand anderem geh\xF6rt", tags: ["nirgendwo"] },
  { t: "an einem Ort, den alle anders erinnern", tags: ["nirgendwo"] },
  { t: "im Zwischenraum einer Erinnerung", tags: ["nirgendwo"] },
  { t: "hinter der letzten bekannten Adresse", tags: ["nirgendwo"] },
  { t: "in einer Gegend, die keine Karte erfasst", tags: ["nirgendwo"] },
  { t: "auf einem Bahnsteig ohne Gleise", tags: ["nirgendwo"] },
  { t: "dort, wo die Stra\xDFe einfach aufh\xF6rt", tags: ["nirgendwo"] },
  { t: "in einem Archiv der Universit\xE4t", tags: ["institution"] },
  { t: "in einer geschlossenen Klinik", tags: ["institution"] },
  { t: "in einer stillgelegten Fabrik", tags: ["institution", "urban"] },
  { t: "in einem Ministerium bei Nacht", tags: ["institution"] },
  { t: "in einer Bibliothek ohne B\xFCcher", tags: ["institution"] },
  { t: "in einem Gericht ohne Richter", tags: ["institution"] },
  { t: "im Archiv", tags: ["institution"] },
  { t: "in einem Amtszimmer im vierten Stock", tags: ["institution"] },
  { t: "in einer Kaserne ohne Rekruten", tags: ["institution"] },
  { t: "in einem Museum nach Schlie\xDFung", tags: ["institution"] },
  { t: "in einem Internat im Winter", tags: ["institution"] },
  { t: "in einer Wahlkabine", tags: ["institution"] },
  { t: "in einem Rechenzentrum", tags: ["institution"] },
  { t: "in einer Anstalt mit offenen T\xFCren", tags: ["institution"] },
  { t: "im Keller eines Standesamts", tags: ["institution"] },
  { t: "in einer Kirche ohne Gemeinde", tags: ["institution"] }
];
var WHEN_TAGGED = [
  { t: "heute, kurz vor Feierabend", tags: ["gegenwart"] },
  { t: "an einem Sonntagnachmittag", tags: ["gegenwart"] },
  { t: "w\xE4hrend eines Stromausfalls", tags: ["gegenwart", "umbruch"] },
  { t: "in der Woche des gro\xDFen Sturms", tags: ["gegenwart"] },
  { t: "an einem ganz gew\xF6hnlichen Dienstag", tags: ["gegenwart"] },
  { t: "im Winter", tags: ["gegenwart", "zeitlos"] },
  { t: "kurz vor Mitternacht", tags: ["gegenwart", "zeitlos"] },
  { t: "im Morgengrauen", tags: ["gegenwart", "zeitlos"] },
  { t: "an einem Montag im November", tags: ["gegenwart"] },
  { t: "w\xE4hrend der Mittagspause", tags: ["gegenwart"] },
  { t: "in der Nacht nach dem Umzug", tags: ["gegenwart"] },
  { t: "am Tag der Beerdigung", tags: ["gegenwart"] },
  { t: "zwischen zwei Terminen", tags: ["gegenwart"] },
  { t: "an einem Abend ohne Strom", tags: ["gegenwart"] },
  { t: "im Sommer der langen D\xFCrre", tags: ["gegenwart"] },
  { t: "an einem Freitag im Regen", tags: ["gegenwart"] },
  { t: "1789", tags: ["historisch"] },
  { t: "1917", tags: ["historisch"] },
  { t: "1348", tags: ["historisch"] },
  { t: "im Jahr der gro\xDFen Flut", tags: ["historisch", "zeitlos"] },
  { t: "w\xE4hrend einer Belagerung", tags: ["historisch", "umbruch"] },
  { t: "1848", tags: ["historisch"] },
  { t: "im Herbst 1923", tags: ["historisch"] },
  { t: "1889", tags: ["historisch"] },
  { t: "w\xE4hrend der Choleraepidemie", tags: ["historisch"] },
  { t: "im Jahr nach dem Krieg", tags: ["historisch"] },
  { t: "1666", tags: ["historisch"] },
  { t: "in der Woche der Kr\xF6nung", tags: ["historisch", "umbruch"] },
  { t: "1961", tags: ["historisch"] },
  { t: "w\xE4hrend der gro\xDFen Auswanderung", tags: ["historisch"] },
  { t: "im letzten Sommer der Monarchie", tags: ["historisch", "umbruch"] },
  { t: "1492", tags: ["historisch"] },
  { t: "im Winter der Hungersnot", tags: ["historisch"] },
  { t: "am Vorabend der Revolution", tags: ["historisch", "umbruch"] },
  { t: "2041", tags: ["zukunft"] },
  { t: "im dritten Jahr der Stille", tags: ["zukunft"] },
  { t: "nach dem letzten Winter", tags: ["zukunft"] },
  { t: "als die Meere zur\xFCckwichen", tags: ["zukunft"] },
  { t: "im Jahrhundert der Karten ohne L\xE4nder", tags: ["zukunft"] },
  { t: "2103", tags: ["zukunft"] },
  { t: "im zweiten Jahr der neuen Zeitrechnung", tags: ["zukunft", "umbruch"] },
  { t: "nach der gro\xDFen Abschaltung", tags: ["zukunft", "umbruch"] },
  { t: "als die St\xE4dte zu wandern begannen", tags: ["zukunft"] },
  { t: "2077", tags: ["zukunft"] },
  { t: "im Sommer ohne Nacht", tags: ["zukunft", "zeitlos"] },
  { t: "nachdem die letzte Grenze fiel", tags: ["zukunft", "umbruch"] },
  { t: "im Jahr der ersten R\xFCckkehr", tags: ["zukunft"] },
  { t: "als niemand mehr schrieb", tags: ["zukunft"] },
  { t: "2199", tags: ["zukunft"] },
  { t: "nach dem Ende der Vorhersagen", tags: ["zukunft"] },
  { t: "zu einer Zeit, die niemand z\xE4hlt", tags: ["zeitlos"] },
  { t: "im Jahr Null", tags: ["zeitlos"] },
  { t: "als die Uhren noch schwiegen", tags: ["zeitlos"] },
  { t: "irgendwann, immer", tags: ["zeitlos"] },
  { t: "in einem Sommer ohne Ende", tags: ["zeitlos"] },
  { t: "lange vor den Namen", tags: ["zeitlos"] },
  { t: "in einer Woche, die sich wiederholt", tags: ["zeitlos"] },
  { t: "zwischen zwei Herzschl\xE4gen", tags: ["zeitlos"] },
  { t: "als die Zeit noch niemandem geh\xF6rte", tags: ["zeitlos"] },
  { t: "an einem Tag, der zweimal stattfindet", tags: ["zeitlos"] },
  { t: "im ewigen Nachmittag", tags: ["zeitlos"] },
  { t: "bevor die Kalender erfunden wurden", tags: ["zeitlos"] },
  { t: "in der Stunde, die nicht gez\xE4hlt wird", tags: ["zeitlos"] },
  { t: "zu einer Zeit ohne Zeugen", tags: ["zeitlos"] },
  { t: "in einem Jahr ohne Zahl", tags: ["zeitlos"] },
  { t: "am Tag der Sonnenfinsternis", tags: ["umbruch"] },
  { t: "in der Nacht des Umsturzes", tags: ["umbruch"] },
  { t: "w\xE4hrend eines Generalstreiks", tags: ["umbruch"] },
  { t: "am letzten Tag des Jahres", tags: ["umbruch"] },
  { t: "in der Stunde der Entscheidung", tags: ["umbruch"] },
  { t: "am Morgen nach der Wahl", tags: ["umbruch"] },
  { t: "w\xE4hrend der Evakuierung", tags: ["umbruch"] },
  { t: "in der Nacht, als die Grenze fiel", tags: ["umbruch"] },
  { t: "am Tag der gro\xDFen Abstimmung", tags: ["umbruch"] },
  { t: "w\xE4hrend des letzten Prozesses", tags: ["umbruch"] },
  { t: "als die Fabrik schloss", tags: ["umbruch"] },
  { t: "in der Woche der R\xE4umung", tags: ["umbruch"] },
  { t: "am Vorabend des Aufbruchs", tags: ["umbruch"] },
  { t: "w\xE4hrend des Erdbebens", tags: ["umbruch"] },
  { t: "in den Stunden vor der Verk\xFCndung", tags: ["umbruch"] }
];
var WHAT_TAGGED = [
  { t: "sucht eine Spur, die keiner hinterlie\xDF", tags: ["mystery"] },
  { t: "findet einen Brief, der nicht an sie gerichtet war", tags: ["mystery"] },
  { t: "entdeckt ein zweites Testament", tags: ["mystery"] },
  { t: "verfolgt eine L\xFCge bis zur Wurzel", tags: ["mystery"] },
  { t: "st\xF6\xDFt auf einen Namen, den es nicht geben d\xFCrfte", tags: ["mystery"] },
  { t: "rekonstruiert eine Nacht, die niemand erlebt hat", tags: ["mystery"] },
  { t: "sucht eine Spur", tags: ["mystery"] },
  { t: "findet ein Foto mit einer Person zu viel", tags: ["mystery", "horror"] },
  { t: "erbt einen Schl\xFCssel ohne Schloss", tags: ["mystery"] },
  { t: "entziffert ein Tagebuch in fremder Hand", tags: ["mystery"] },
  { t: "verh\xF6rt einen Zeugen, der l\xE4ngst tot ist", tags: ["mystery", "horror"] },
  { t: "\xF6ffnet einen Fall, den alle geschlossen haben", tags: ["mystery"] },
  { t: "bemerkt, dass zwei Uhren nicht \xFCbereinstimmen", tags: ["mystery"] },
  { t: "verfolgt jemanden, der die eigene Route kennt", tags: ["mystery"] },
  { t: "findet die eigene Unterschrift auf fremdem Papier", tags: ["mystery"] },
  { t: "erh\xE4lt eine Nachricht aus der Zukunft", tags: ["scifi"] },
  { t: "findet eine T\xFCr, die es nicht geben d\xFCrfte", tags: ["scifi", "maerchen"] },
  { t: "verliert die Kontrolle \xFCber die eigene Stimme", tags: ["scifi", "horror"] },
  { t: "erwacht in einem K\xF6rper mit fremdem Ged\xE4chtnis", tags: ["scifi"] },
  { t: "entziffert ein Signal aus dem Nichts", tags: ["scifi"] },
  { t: "tauscht Zeit gegen eine Erinnerung", tags: ["scifi"] },
  { t: "wird von der eigenen Kopie verklagt", tags: ["scifi", "satire"] },
  { t: "verkauft eine Erinnerung zu teuer", tags: ["scifi"] },
  { t: "entdeckt eine L\xFCcke in der Simulation", tags: ["scifi"] },
  { t: "verliert eine Woche und findet sie woanders", tags: ["scifi"] },
  { t: "spricht mit einer Maschine, die l\xFCgt", tags: ["scifi"] },
  { t: "bekommt ein Angebot von der eigenen Zukunft", tags: ["scifi"] },
  { t: "muss beweisen, real zu sein", tags: ["scifi", "absurd"] },
  { t: "findet den letzten Menschen ohne Anschluss", tags: ["scifi"] },
  { t: "erbt ein fremdes Bewusstsein", tags: ["scifi"] },
  { t: "schlie\xDFt einen Pakt, den keiner versteht", tags: ["maerchen"] },
  { t: "folgt einem Licht in den Wald", tags: ["maerchen"] },
  { t: "erbt einen Fluch mit gutem Kern", tags: ["maerchen"] },
  { t: "verspricht drei Dinge, die sich widersprechen", tags: ["maerchen"] },
  { t: "sucht einen Namen, um frei zu werden", tags: ["maerchen"] },
  { t: "\xF6ffnet die verbotene T\xFCr", tags: ["maerchen", "horror"] },
  { t: "tauscht den Schatten gegen einen Wunsch", tags: ["maerchen"] },
  { t: "bekommt eine Gabe, die keiner will", tags: ["maerchen"] },
  { t: "muss sieben N\xE4chte schweigen", tags: ["maerchen"] },
  { t: "weckt etwas, das schlafen sollte", tags: ["maerchen", "horror"] },
  { t: "verhandelt mit dem Fluss um einen \xDCbergang", tags: ["maerchen"] },
  { t: "verliert das Gesicht an einen Spiegel", tags: ["maerchen", "horror"] },
  { t: "gibt das eigene Herz als Pfand", tags: ["maerchen"] },
  { t: "l\xF6st ein R\xE4tsel und verliert dabei alles", tags: ["maerchen"] },
  { t: "wird von einem Tier um Hilfe gebeten", tags: ["maerchen"] },
  { t: "f\xFCllt ein Formular f\xFCr die eigene Abwesenheit", tags: ["absurd", "satire"] },
  { t: "verklagt den eigenen Schatten", tags: ["absurd"] },
  { t: "wartet auf einen Termin, der nie kommt", tags: ["absurd"] },
  { t: "erbt ein Amt ohne Aufgabe", tags: ["absurd", "satire"] },
  { t: "verliert die Erinnerung an einen Namen", tags: ["absurd"] },
  { t: "wird f\xFCr tot erkl\xE4rt und muss es widerlegen", tags: ["absurd"] },
  { t: "beantragt eine Genehmigung zu existieren", tags: ["absurd", "satire"] },
  { t: "wird in eine Abteilung ohne T\xFCr bef\xF6rdert", tags: ["absurd", "satire"] },
  { t: "muss einen Fehler verwalten, den es nicht gibt", tags: ["absurd"] },
  { t: "steht in einer Schlange, die sich selbst anstellt", tags: ["absurd"] },
  { t: "bekommt einen Ausweis f\xFCr ein anderes Leben", tags: ["absurd"] },
  { t: "soll das eigene Verschwinden protokollieren", tags: ["absurd"] },
  { t: "sucht ein Zimmer, dessen Nummer wandert", tags: ["absurd"] },
  { t: "erh\xE4lt Post von einer Beh\xF6rde ohne Existenz", tags: ["absurd"] },
  { t: "muss die eigene Vergangenheit erst beantragen", tags: ["absurd"] },
  { t: "will einfach nur verschwinden", tags: ["alltag"] },
  { t: "trifft eine Entscheidung binnen einer Stunde", tags: ["alltag"] },
  { t: "bricht ein Versprechen aus Kindheitstagen", tags: ["alltag"] },
  { t: "kehrt an einen alten Ort zur\xFCck", tags: ["alltag"] },
  { t: "sagt endlich einen Satz zu sp\xE4t", tags: ["alltag"] },
  { t: "r\xE4umt ein Zimmer und findet ein Leben", tags: ["alltag"] },
  { t: "will verschwinden", tags: ["alltag"] },
  { t: "wartet auf einen Anruf, der nicht kommt", tags: ["alltag"] },
  { t: "verpasst einen Zug mit Absicht", tags: ["alltag"] },
  { t: "trifft jemanden, den es nicht mehr geben sollte", tags: ["alltag", "horror"] },
  { t: "beantwortet einen zwanzig Jahre alten Brief", tags: ["alltag"] },
  { t: "k\xFCndigt ohne Plan", tags: ["alltag"] },
  { t: "erkennt sich auf einem fremden Foto", tags: ["alltag", "mystery"] },
  { t: "verschiebt eine Beerdigung", tags: ["alltag"] },
  { t: "beginnt ein Gespr\xE4ch, das alles \xE4ndert", tags: ["alltag"] },
  { t: "h\xF6rt Schritte im leeren Haus", tags: ["horror"] },
  { t: "bemerkt, dass die Spiegel nicht mehr stimmen", tags: ["horror"] },
  { t: "z\xE4hlt eine Person zu viel", tags: ["horror"] },
  { t: "findet die eigene Handschrift an fremder Wand", tags: ["horror"] },
  { t: "verliert jede Nacht eine Erinnerung mehr", tags: ["horror"] },
  { t: "wird von etwas erkannt, das keiner sieht", tags: ["horror"] },
  { t: "h\xF6rt den eigenen Namen aus dem Nebenzimmer", tags: ["horror"] },
  { t: "entdeckt, dass das Haus gr\xF6\xDFer wird", tags: ["horror"] },
  { t: "findet Fu\xDFspuren, die zur\xFCckf\xFChren", tags: ["horror"] },
  { t: "wacht jede Nacht eine Stunde fr\xFCher auf", tags: ["horror"] },
  { t: "bemerkt, dass niemand mehr blinzelt", tags: ["horror"] },
  { t: "gr\xE4bt etwas aus, das noch warm ist", tags: ["horror"] },
  { t: "bekommt Anrufe von der eigenen Nummer", tags: ["horror"] },
  { t: "sieht dasselbe Gesicht in jeder Menge", tags: ["horror"] },
  { t: "schlie\xDFt eine T\xFCr, die offen bleibt", tags: ["horror"] },
  { t: "gr\xFCndet ein Amt gegen die Wirklichkeit", tags: ["satire"] },
  { t: "gewinnt einen Preis f\xFCr nichts", tags: ["satire"] },
  { t: "verwaltet das Ende der Welt in Ordnern", tags: ["satire"] },
  { t: "beruft eine Sitzung \xFCber Sitzungen ein", tags: ["satire"] },
  { t: "optimiert sich selbst weg", tags: ["satire"] },
  { t: "verkauft Zeit an die, die keine haben", tags: ["satire"] },
  { t: "erfindet ein Problem und die passende L\xF6sung", tags: ["satire"] },
  { t: "wird zum Gesicht einer Kampagne gegen sich selbst", tags: ["satire"] },
  { t: "reformiert eine Beh\xF6rde in eine gr\xF6\xDFere", tags: ["satire"] },
  { t: "l\xE4sst die Wahrheit auslagern", tags: ["satire"] },
  { t: "schreibt ein Gutachten \xFCber das eigene Gutachten", tags: ["satire"] },
  { t: "privatisiert das Wetter", tags: ["satire"] },
  { t: "gr\xFCndet eine Kommission zur Abschaffung von Kommissionen", tags: ["satire"] },
  { t: "macht Karriere durch konsequentes Nichtstun", tags: ["satire"] },
  { t: "digitalisiert ein Formular, das niemand braucht", tags: ["satire"] }
];
var CTX_WHO = WHO_TAGGED.map((e2) => e2.t);
var CTX_WHERE = WHERE_TAGGED.map((e2) => e2.t);
var CTX_WHEN = WHEN_TAGGED.map((e2) => e2.t);
var CTX_WHAT = WHAT_TAGGED.map((e2) => e2.t);

// src/presets.drama.data.ts
var D = (einstieg, mitte, hoehepunkt, konflikte, ausloeser, veraenderungen, zeitanomalien, regeln, schluss) => ({ einstieg, mitte, hoehepunkt, schluss, ausloeser, veraenderungen, konflikte, zeitanomalien, regeln });
var BUILTIN_DRAMA = {
  kafka: D(
    ["alles liegt an seinem Platz, und genau das beunruhigt", "die Formulare sind bereits ausgef\xFCllt", "niemand hat die T\xFCr ge\xF6ffnet, sie stand offen"],
    ["die Zust\xE4ndigkeit wandert von Zimmer zu Zimmer", "eine Auskunft widerspricht der vorigen, beide sind g\xFCltig", "der Gang verzweigt sich, jede Abzweigung f\xFChrt zur\xFCck"],
    ["die Akte tr\xE4gt den eigenen Namen", "das Verfahren war l\xE4ngst abgeschlossen"],
    ["eine Auskunft, die niemand gibt", "eine Frist ohne Anfang", "eine Schuld ohne Anklage"],
    ["ein Bescheid ohne Absender", "eine Unterschrift, die niemand leisten kann", "ein Stempel auf dem falschen Blatt"],
    ["die Zust\xE4ndigkeit wechselt", "der Vorgang beginnt von vorn", "die Frage verwandelt sich in ihre Antwort"],
    ["Die Frist l\xE4uft r\xFCckw\xE4rts.", "Der Termin liegt bereits hinter dem Antrag."],
    ["Wer fragt, bekommt eine Nummer.", "Jede Auskunft ist vorl\xE4ufig und endg\xFCltig zugleich."],
    ["offen", "beklemmend"]
  ),
  bureau: D(
    ["die Warteschlange bewegt sich nicht", "der Schalter ist besetzt und leer zugleich", "auf dem Tisch liegt ein Stift ohne Mine"],
    ["ein Formular verlangt ein zweites", "die Nummer wird aufgerufen, geh\xF6rt aber niemandem", "der Aktenschrank \xF6ffnet sich in einen weiteren Flur"],
    ["die Zust\xE4ndigkeit wird endg\xFCltig ungekl\xE4rt", "das eigene Aktenzeichen erlischt"],
    ["eine Zust\xE4ndigkeit, die niemand annimmt", "einen Vorgang ohne Ende", "eine Best\xE4tigung, die sich selbst widerruft"],
    ["ein Formular in dreifacher Ausfertigung", "eine Wartenummer aus einem anderen Jahr", "ein Dienstsiegel ohne Beh\xF6rde"],
    ["der Vorgang wird umgeleitet", "die Frist verl\xE4ngert sich von selbst", "das Verfahren beginnt still von vorn"],
    ["Der Sprechtag liegt immer gestern.", "Die Bearbeitungszeit w\xE4chst mit jeder Nachfrage."],
    ["Kein Vorgang endet, er ruht nur.", "Wer wartet, wird Teil des Verfahrens."],
    ["offen", "resigniert"]
  ),
  mystery: D(
    ["das Haus ist zu still f\xFCr die Uhrzeit", "im Flur brennt Licht, das niemand angelassen hat", "die T\xFCr f\xE4llt zu, bevor jemand sie ber\xFChrt"],
    ["eine Spur f\xFChrt zur\xFCck in den eigenen Weg", "der Zeuge erinnert sich an etwas, das nicht geschah", "hinter der Wand geht jemand denselben Gang"],
    ["die Erkl\xE4rung stimmt, und macht alles schlimmer", "der Fund war die ganze Zeit sichtbar"],
    ["eine Wahrheit, die niemand h\xF6ren will", "ein Verschwinden ohne L\xFCcke", "einen Zeugen, der sich selbst widerspricht"],
    ["ein Schl\xFCssel, der nirgends passt", "ein Anruf ohne Stimme", "ein Foto mit einer Person zu viel"],
    ["die Spur kehrt sich um", "der Verdacht wechselt die Richtung", "das Vertraute wird fremd"],
    ["Zwischen zwei Blicken vergeht eine Nacht.", "Die Uhr im Nebenzimmer geht anders."],
    ["Nichts verschwindet, es wird nur nicht mehr gesucht.", "Wer genau hinsieht, wird selbst gesehen."],
    ["offen", "unheimlich"]
  ),
  freud: D(
    ["das Zimmer ist auf angenehme Weise zu warm", "der Satz bricht ab, bevor er gef\xE4hrlich wird", "das Sofa erinnert sich an alle, die darauf lagen"],
    ["ein Wort rutscht heraus und meint ein anderes", "die Erinnerung \xE4ndert sich beim Erz\xE4hlen", "der Traum liefert die Antwort auf die falsche Frage"],
    ["das Verdr\xE4ngte spricht mit vertrauter Stimme", "der Widerstand gibt genau an der Stelle nach"],
    ["einen Wunsch, den niemand zugibt", "eine Erinnerung, die sich selbst erfindet", "eine Angst mit fremdem Gesicht"],
    ["ein Versprecher im falschen Moment", "ein wiederkehrender Traum", "ein Name, der nicht einfallen will"],
    ["das Verdr\xE4ngte kehrt zur\xFCck", "die Deutung dreht den Sinn um", "der Wunsch zeigt sein Gegenteil"],
    ["Die Kindheit liegt n\xE4her als gestern.", "Ein Satz dauert l\xE4nger, als er braucht."],
    ["Nichts wird vergessen, es wird nur woanders abgelegt.", "Jede Abwehr verr\xE4t, was sie sch\xFCtzt."],
    ["offen", "analytisch"]
  ),
  rimbaud: D(
    ["das Wasser tr\xE4gt Licht, das nicht vom Himmel stammt", "der Kiel schneidet durch eine Farbe ohne Namen", "die K\xFCste l\xF6st sich auf, ohne zu verschwinden"],
    ["der Horizont wechselt die Seite", "das Meer schreibt und l\xF6scht denselben Satz", "der Mast singt in einer fremden Sprache"],
    ["das Schiff gehorcht keinem Kurs mehr", "der Rausch schl\xE4gt in Klarheit um"],
    ["eine Freiheit ohne Ufer", "einen Rausch, der n\xFCchtern macht", "eine Fahrt ohne Ziel und ohne Umkehr"],
    ["ein Sturm aus heiterem Licht", "ein trunkenes Boot", "ein Wort in einer erfundenen Sprache"],
    ["die Farben kippen", "das Meer verwandelt sich in Sprache", "der K\xF6rper l\xF6st sich in Bewegung auf"],
    ["Ein Tag dauert eine Farbe lang.", "Die Nacht beginnt mitten am Nachmittag."],
    ["Wer sieht, verbrennt.", "Jede Ordnung ist nur eine m\xFCde Farbe."],
    ["offen", "rauschhaft"]
  ),
  traumbilder: D(
    ["der Raum ist gr\xF6\xDFer als von au\xDFen", "der Schlaf hat noch nicht ganz aufgeh\xF6rt", "die T\xFCr f\xFChrt in dasselbe Zimmer zur\xFCck"],
    ["der Flur ordnet sich bei jedem Blick neu", "eine Treppe endet h\xF6her, als sie begann", "die Gesichter wechseln, ohne sich zu \xE4ndern"],
    ["das Erwachen misslingt zweimal", "der Traum erkl\xE4rt sich und bleibt unverst\xE4ndlich"],
    ["eine Grenze zwischen Schlaf und Wachen", "eine Erinnerung, die beim Zugreifen zerf\xE4llt", "einen Raum, den es nicht gibt"],
    ["ein Wecker, der r\xFCckw\xE4rts l\xE4uft", "ein Schl\xFCssel ohne Schloss", "ein Ger\xE4usch, das erst beim Aufwachen aufh\xF6rt"],
    ["der Boden beginnt sich zu drehen", "die Zeit verdoppelt sich ohne Fortschritt", "das Spiegelbild reagiert zu sp\xE4t"],
    ["Eine Minute enth\xE4lt eine ganze Nacht.", "Die Uhr springt, sobald niemand hinsieht."],
    ["Im Traum ist jede Richtung nach unten.", "Wer den Traum benennt, verliert ihn."],
    ["offen", "schwebend"]
  ),
  ritterromane: D(
    ["die Burg liegt tiefer im Nebel als gestern", "das Tor steht offen, was es nie tut", "die R\xFCstung h\xE4ngt bereit, obwohl niemand rief"],
    ["der Wald verschiebt die Wege", "ein Eid bindet st\xE4rker als die Vernunft", "der Gegner tr\xE4gt das eigene Wappen"],
    ["das Schwert gehorcht der falschen Hand", "der Sieg entwertet die Sache"],
    ["eine Ehre, die niemand einfordert", "einen Eid gegen das eigene Herz", "eine Treue, die zu sp\xE4t kommt"],
    ["ein Horn aus gro\xDFer Ferne", "ein Bote ohne Botschaft", "ein Handschuh vor den F\xFC\xDFen"],
    ["die Treue kehrt sich um", "aus dem Feind wird ein Spiegel", "die Bahn des Ritts biegt ab"],
    ["Der Ritt dauert l\xE4nger als der Weg.", "Zwischen Aufbruch und Ankunft altert die Burg."],
    ["Ein Eid wiegt schwerer als ein Leben.", "Wer den Wald betritt, kehrt anders zur\xFCck."],
    ["offen", "heroisch"]
  ),
  alltag: D(
    ["der Wasserkocher schaltet ab, sonst ist es still", "die Post liegt seit drei Tagen unge\xF6ffnet da", "der Tag beginnt genau wie der vorige"],
    ["eine Kleinigkeit steht pl\xF6tzlich schief", "der gewohnte Weg dauert heute l\xE4nger", "ein Gespr\xE4ch bricht an derselben Stelle ab"],
    ["die Gewohnheit tr\xE4gt nicht mehr", "das Kleine wird auf einmal gro\xDF"],
    ["eine Frage, die nie gestellt wird", "eine Gewohnheit, die niemand gew\xE4hlt hat", "einen Abstand, der langsam w\xE4chst"],
    ["ein Anruf zur falschen Zeit", "ein vergessener Schl\xFCssel", "eine Rechnung ohne Betrag"],
    ["die Ordnung verrutscht", "das Gewohnte wird sichtbar", "der Tag kippt in eine andere Richtung"],
    ["Der Nachmittag zieht sich, der Abend fehlt.", "Die Woche wiederholt einen Tag zu oft."],
    ["Was t\xE4glich geschieht, wird nicht bemerkt.", "Jede Gewohnheit verbirgt eine Entscheidung."],
    ["offen", "n\xFCchtern"]
  ),
  hafen: D(
    ["die Kr\xE4ne stehen still, das Wasser nicht", "ein Schiff liegt l\xE4nger als angemeldet", "das Licht kommt vom Wasser, nicht vom Himmel"],
    ["die Ladung stimmt nicht mit den Papieren \xFCberein", "die Flut nimmt mehr mit, als sie brachte", "ein Name auf dem Rumpf ist \xFCbermalt"],
    ["die Leinen fallen ohne Befehl", "das Schiff f\xE4hrt ohne Fracht hinaus"],
    ["eine Abfahrt ohne Wiederkehr", "eine Ladung, die niemand bestellt hat", "ein Warten, das zum Beruf wird"],
    ["ein Signal aus dem Nebel", "ein Container ohne Papiere", "eine Boje, die nicht auf der Karte steht"],
    ["die Tide dreht", "das Warten kippt in Aufbruch", "der Anker h\xE4lt pl\xF6tzlich nicht mehr"],
    ["Die Ebbe kommt zweimal.", "Zwischen zwei Sirenen vergeht ein Jahr."],
    ["Das Wasser vergisst schneller als der Kai.", "Wer bleibt, wird zum Teil der Mole."],
    ["offen", "salzig"]
  ),
  urknall: D(
    ["es gibt kein Vorher, an dem man ansetzen k\xF6nnte", "der Raum ist noch nicht auseinandergefaltet", "alles liegt in einem Punkt und dr\xE4ngt"],
    ["die Kr\xE4fte trennen sich voneinander", "aus Symmetrie wird Unterschied", "das Licht findet zum ersten Mal einen Weg"],
    ["die Materie entscheidet sich f\xFCr sich selbst", "der Raum rei\xDFt in alle Richtungen auf"],
    ["einen Anfang ohne Zeugen", "ein Gleichgewicht, das kippen muss", "eine Ordnung, die aus Zufall entsteht"],
    ["ein Ungleichgewicht um ein Milliardstel", "eine Schwankung im Nichts", "ein erster Zerfall"],
    ["die Symmetrie bricht", "aus Strahlung wird Masse", "die Kr\xE4fte gehen getrennte Wege"],
    ["Eine Sekunde enth\xE4lt alle sp\xE4teren.", "Die Zeit beginnt erst, als es etwas zu messen gibt."],
    ["Nichts kann schneller sein als das Licht dazwischen.", "Jede Ordnung zahlt mit W\xE4rme."],
    ["offen", "kosmisch"]
  ),
  dickens: D(
    ["der Nebel steht in der Gasse wie ein M\xF6belst\xFCck", "im Kontor brennt eine Kerze zu wenig", "der Regen macht die Stadt kleiner"],
    ["eine Schuld wird h\xF6flich eingefordert", "ein Kind tr\xE4gt die Last eines Erwachsenen", "die Wohlt\xE4tigkeit rechnet mit"],
    ["die Herkunft holt alles ein", "die Gro\xDFz\xFCgigkeit kommt sp\xE4t und trotzdem"],
    ["eine Schuld, die vererbt wird", "eine Armut mit tadellosen Manieren", "eine G\xFCte, die sich nicht lohnt"],
    ["ein Brief mit schwarzem Rand", "eine Erbschaft aus unbekannter Hand", "ein Name in einem alten Register"],
    ["das Verm\xF6gen wechselt die Seite", "aus dem Fremden wird ein Verwandter", "die K\xE4lte weicht zu sp\xE4t"],
    ["Der Winter dauert drei Kapitel.", "Die Kindheit vergeht in einem Satz."],
    ["Jede Schuld findet ihren Schuldner.", "Wer arm ist, muss auch noch h\xF6flich sein."],
    ["offen", "wehm\xFCtig"]
  ),
  erotik: D(
    ["der Abstand ist eine Handbreit zu klein", "die Stille zwischen zwei S\xE4tzen wird laut", "die Luft steht zwischen ihnen wie Stoff"],
    ["ein Blick dauert einen Atemzug zu lang", "die H\xF6flichkeit h\xE4lt nicht mehr stand", "eine Ber\xFChrung geschieht wie versehentlich"],
    ["die Zur\xFCckhaltung gibt nach", "die Grenze verschwindet, ohne \xFCberschritten zu werden"],
    ["ein Verlangen, das niemand ausspricht", "eine N\xE4he, die alles \xE4ndert", "eine Grenze, die beide bewachen"],
    ["ein Blick zu viel", "eine Ber\xFChrung an der Schulter", "ein Satz, der zu sp\xE4t zur\xFCckgenommen wird"],
    ["die Distanz kippt", "das Ungesagte wird K\xF6rper", "aus H\xF6flichkeit wird Hunger"],
    ["Eine Minute dehnt sich \xFCber den Abend.", "Zwischen zwei Atemz\xFCgen liegt eine Woche."],
    ["Was ungesagt bleibt, wirkt st\xE4rker.", "Jede N\xE4he verschiebt die Grenze."],
    ["offen", "sinnlich"]
  ),
  baudelaire: D(
    ["die Stadt riecht nach Regen und Puder", "der Abend beginnt eine Stunde zu fr\xFCh", "das Fenster steht offen, die Vorh\xE4nge nicht"],
    ["die Sch\xF6nheit zeigt ihre R\xFCckseite", "der Rausch h\xE4lt, was die N\xFCchternheit versprach", "die Menge tr\xE4gt ein einziges Gesicht"],
    ["das Sch\xF6ne und das Faule fallen zusammen", "der Ekel wird z\xE4rtlich"],
    ["eine Sch\xF6nheit, die verdirbt", "einen Genuss mit Nachgeschmack", "eine Sehnsucht ohne Ziel"],
    ["ein Parfum aus einem anderen Leben", "ein Blick aus der Menge", "eine Blume in schlechtem Wasser"],
    ["die Sch\xF6nheit kippt ins Verwesen", "der Ekel verwandelt sich in Andacht", "die Stadt wird zum K\xF6rper"],
    ["Der Abend dauert l\xE4nger als der Tag.", "Zwischen zwei Gl\xE4sern vergeht ein Jahrzehnt."],
    ["Jede Sch\xF6nheit tr\xE4gt ihren Verfall bereits mit sich.", "Wer die Stadt liebt, liebt ihren Schmutz."],
    ["offen", "morbide"]
  ),
  expressionismus: D(
    ["die Farben schreien lauter als die Stra\xDFe", "der Himmel dr\xFCckt auf die D\xE4cher", "alles steht schief und h\xE4lt trotzdem"],
    ["die Gesichter werden zu Masken", "die Stadt frisst ihre Bewohner", "die Linien verlieren ihre Ruhe"],
    ["der Schrei bekommt eine Farbe", "die Fassade bricht nach innen"],
    ["eine Angst mit vielen Gesichtern", "einen Aufschrei ohne Mund", "eine Wahrheit, die zu grell ist"],
    ["ein Schrei aus einem Hinterhof", "ein rotes Licht im Fenster", "ein Riss in der Fassade"],
    ["die Farben werden laut", "das Innere kehrt sich nach au\xDFen", "die Ordnung zerbricht in Fl\xE4chen"],
    ["Die Nacht beginnt am Mittag.", "Ein Augenblick dauert eine ganze Stra\xDFe lang."],
    ["Was empfunden wird, ist sichtbar.", "Kein Ding bleibt an seinem Platz."],
    ["offen", "grell"]
  ),
  surrealismus1920: D(
    ["die Uhr tropft von der Tischkante", "im Zimmer regnet es nach oben", "die T\xFCr f\xFChrt in eine W\xFCste"],
    ["die Gegenst\xE4nde tauschen ihre Aufgaben", "der Traum reicht in den Nachmittag hinein", "der Zufall folgt einem Plan"],
    ["das Unm\xF6gliche wird allt\xE4glich", "der Gegenstand beginnt zu sprechen"],
    ["eine Logik, die nur schlafend gilt", "einen Zufall mit Absicht", "eine Ordnung aus lauter Ausnahmen"],
    ["ein Regenschirm auf einem Seziertisch", "ein Telefon aus Fisch", "ein Fenster im Fu\xDFboden"],
    ["die Dinge tauschen die Rollen", "die Schwerkraft wechselt die Richtung", "das Bild verl\xE4sst den Rahmen"],
    ["Die Nacht wiederholt den Vormittag.", "Zwei Uhren zeigen dieselbe falsche Zeit."],
    ["Der Zufall ist die genaueste Methode.", "Was zusammenf\xE4llt, geh\xF6rt zusammen."],
    ["offen", "traumlogisch"]
  ),
  transzendenz: D(
    ["das Licht kommt von keiner Quelle", "die Stille hat einen Klang", "der Raum h\xF6rt an keiner Wand auf"],
    ["die Grenze zwischen innen und au\xDFen wird d\xFCnn", "das Wort reicht nicht mehr", "die Zeit h\xE4lt an, ohne stehenzubleiben"],
    ["das Ich l\xF6st sich, ohne zu verschwinden", "die Antwort kommt vor der Frage"],
    ["eine Erfahrung ohne Worte", "eine Gewissheit ohne Beweis", "ein Ganzes, das keinen Teil hat"],
    ["ein Klang ohne Ursprung", "ein Licht im geschlossenen Auge", "eine Stille zwischen zwei Herzschl\xE4gen"],
    ["die Grenzen l\xF6sen sich", "das Einzelne wird durchsichtig", "die Sprache tritt zur\xFCck"],
    ["Ein Augenblick enth\xE4lt alle anderen.", "Die Dauer h\xF6rt auf, gemessen zu werden."],
    ["Was sich sagen l\xE4sst, ist nicht gemeint.", "Wer sucht, steht sich im Weg."],
    ["offen", "still"]
  ),
  melville: D(
    ["das Schiff liegt schwer im eigenen Schatten", "die See ist zu ruhig f\xFCr die Jahreszeit", "der Kompass zeigt, was niemand fragt"],
    ["die Jagd wird zur Rechnung", "die Mannschaft teilt sich in zwei Schweigen", "das Meer gibt nichts preis und alles"],
    ["die Beute wird zum Gegen\xFCber", "der Kurs gehorcht einer Besessenheit"],
    ["eine Jagd, die den J\xE4ger verzehrt", "eine Rache ohne Adressat", "ein Meer, das nicht antwortet"],
    ["eine Font\xE4ne am Horizont", "ein Fass mit falschem Inhalt", "ein Name, in Holz geschnitten"],
    ["die Jagd kehrt sich um", "aus dem Tier wird ein Gedanke", "das Schiff folgt keinem Kurs mehr"],
    ["Die Wache dauert drei Tage.", "Zwischen zwei Wellen liegt ein Jahr."],
    ["Das Meer nimmt, was es tr\xE4gt.", "Wer jagt, wird zum Gejagten."],
    ["offen", "unerbittlich"]
  ),
  formalismus: D(
    ["die Anordnung ist wichtiger als der Inhalt", "das Raster liegt \xFCber allem", "jedes Element hat genau eine Stelle"],
    ["die Wiederholung erzeugt einen Unterschied", "die Regel bringt ihre Ausnahme hervor", "die Form beginnt, vom Inhalt zu handeln"],
    ["das Verfahren wird sichtbar", "die Struktur kippt in Bedeutung"],
    ["eine Regel ohne Ausnahme", "eine Form, die sich selbst meint", "eine Ordnung, die nichts erkl\xE4rt"],
    ["eine Verschiebung um ein Glied", "ein Bruch im Muster", "eine Wiederholung zu viel"],
    ["das Muster verschiebt sich", "die Form wird zum Inhalt", "die Reihe bricht ab und beginnt neu"],
    ["Der zweite Durchgang dauert k\xFCrzer.", "Jede Wiederholung verkleinert den Abstand."],
    ["Die Form geht dem Sinn voraus.", "Nichts steht zuf\xE4llig an seiner Stelle."],
    ["offen", "streng"]
  ),
  christentum: D(
    ["die Kirche ist leer und trotzdem nicht", "das Licht f\xE4llt schr\xE4g durch farbiges Glas", "eine Kerze brennt f\xFCr niemanden Bestimmten"],
    ["die Schuld sucht ein Wort", "das Gebet bleibt unbeantwortet und hilft", "die Gnade kommt ungefragt"],
    ["die Vergebung trifft den Falschen", "das Opfer erweist sich als Anfang"],
    ["eine Schuld, die niemand nennt", "eine Gnade ohne Verdienst", "einen Glauben gegen den Augenschein"],
    ["ein Glockenschlag zur falschen Stunde", "ein Brot, das reicht", "ein Name, im Gebet genannt"],
    ["die Schuld wandelt sich in Auftrag", "aus Zweifel wird Zuversicht", "das Ende wird zum Anfang"],
    ["Der Sonntag dauert eine Woche.", "Zwischen Frage und Antwort liegen Jahre."],
    ["Was vergeben wird, bleibt geschehen.", "Der Letzte steht am Anfang."],
    ["offen", "and\xE4chtig"]
  ),
  koran: D(
    ["die W\xFCste beginnt hinter der letzten Mauer", "das Wort steht vor dem Buch", "der Morgen wird durch einen Ruf geteilt"],
    ["die Zeichen sind lesbar, wenn man sie l\xE4sst", "der Weg verlangt Geduld statt Eile", "das Ma\xDF findet sich im Verzicht"],
    ["das Zeichen erweist sich als Anrede", "die Pr\xFCfung wird zur Gabe"],
    ["ein Ma\xDF, das gehalten werden will", "eine Geduld ohne Aussicht", "eine Verantwortung, die niemand teilt"],
    ["ein Ruf vor Sonnenaufgang", "eine Quelle, wo keine war", "ein Zeichen im Sand"],
    ["der Weg richtet sich neu aus", "aus Pr\xFCfung wird Klarheit", "das Ma\xDF verschiebt sich"],
    ["Die Nacht wiegt schwerer als tausend Monate.", "Zwischen zwei Gebeten liegt ein Leben."],
    ["Kein Blatt f\xE4llt ohne Wissen.", "Wer misst, wird gemessen."],
    ["offen", "ma\xDFvoll"]
  ),
  buddhismus: D(
    ["der Atem ist bereits da, bevor man ihn sucht", "die Schale steht leer und ist nicht arm", "der Weg beginnt genau hier"],
    ["das Greifen erzeugt das Fehlen", "die Gedanken ziehen vorbei wie Wetter", "das Selbst zeigt keine Grenze"],
    ["das Festhalten l\xF6st sich von selbst", "die Frage verliert ihren Fragenden"],
    ["ein Verlangen, das sich selbst n\xE4hrt", "eine Ruhe, die nicht gemacht ist", "ein Ich, das keines findet"],
    ["ein Glockenton, der ausklingt", "ein Blatt auf stillem Wasser", "ein Schmerz ohne Besitzer"],
    ["das Greifen l\xE4sst nach", "aus Unruhe wird Beobachtung", "die Trennung wird durchl\xE4ssig"],
    ["Ein Atemzug reicht durch den Tag.", "Die Stunde vergeht, ohne zu vergehen."],
    ["Alles Entstandene vergeht.", "Wer nichts h\xE4lt, verliert nichts."],
    ["offen", "gelassen"]
  ),
  biologie: D(
    ["die Zelle teilt sich, ohne gefragt zu werden", "im Wassertropfen ist mehr los als im Zimmer", "das Leben ordnet sich gegen den Strom"],
    ["die Anpassung kostet an anderer Stelle", "ein Merkmal setzt sich durch, ohne besser zu sein", "das System h\xE4lt sich, indem es sich \xE4ndert"],
    ["die Mutation entscheidet \xFCber alles Weitere", "das Gleichgewicht kippt auf einer Seite"],
    ["ein \xDCberleben auf Kosten Dritter", "eine Anpassung, die zu sp\xE4t kommt", "ein Gleichgewicht ohne Gleichheit"],
    ["ein Fehler beim Kopieren", "ein neuer Wirt", "eine Nische, die frei wird"],
    ["die Art verschiebt sich", "aus Zufall wird Merkmal", "das Gleichgewicht sucht eine neue Lage"],
    ["Eine Generation dauert einen Nachmittag.", "Millionen Jahre passen in eine Schicht."],
    ["Was sich vermehrt, bleibt.", "Jede Ordnung kostet Energie."],
    ["offen", "sachlich"]
  ),
  geologie: D(
    ["der Stein hat mehr Zeit gesehen als alles hier", "die Schichten liegen wie S\xE4tze \xFCbereinander", "der Boden ist nur die oberste Seite"],
    ["der Druck arbeitet ohne Eile", "eine Falte erz\xE4hlt von einer Kollision", "das Wasser schreibt in den Fels"],
    ["die Schicht bricht und zeigt ihr Inneres", "der Berg gibt nach, nach Millionen Jahren"],
    ["eine Bewegung, die niemand sp\xFCrt", "eine Zeit ohne Zeugen", "einen Druck, der alles verformt"],
    ["ein Riss im Gestein", "ein Fossil an falscher Stelle", "ein Beben unter der Schwelle"],
    ["die Schichten verschieben sich", "aus Sediment wird Stein", "der Untergrund gibt nach"],
    ["Ein Jahrhundert ist ein Wimpernschlag.", "Die Schicht misst die Zeit, nicht die Uhr."],
    ["Alles Feste war einmal fl\xFCssig.", "Was oben liegt, ist j\xFCnger."],
    ["offen", "geduldig"]
  ),
  astrologie: D(
    ["die Zeichen stehen, ob man hinsieht oder nicht", "der Himmel wiederholt eine alte Anordnung", "die Stunde tr\xE4gt einen Namen"],
    ["ein Wandelstern l\xE4uft r\xFCckw\xE4rts", "die H\xE4user verschieben ihre Bedeutung", "das Muster passt zu genau"],
    ["die Konstellation schlie\xDFt sich", "die Deutung trifft, ohne zu erkl\xE4ren"],
    ["ein Schicksal, das gelesen sein will", "eine Deutung, die sich erf\xFCllt", "eine Freiheit unter Zeichen"],
    ["ein Zusammentreffen zweier Bahnen", "eine Finsternis zur Unzeit", "ein Zeichen am Aszendenten"],
    ["die Konstellation wechselt", "aus Zufall wird Bedeutung", "der Lauf kehrt sich um"],
    ["Der Umlauf dauert ein halbes Leben.", "Eine Stunde wiegt ein Jahr auf."],
    ["Wie oben, so unten.", "Kein Zeichen zwingt, jedes neigt."],
    ["offen", "deutend"]
  ),
  gaia: D(
    ["der Wald atmet langsamer als wir", "das Wasser kennt seinen Weg auswendig", "alles h\xE4ngt an allem, ohne Absicht"],
    ["ein Eingriff zieht Kreise bis ans andere Ende", "das Gleichgewicht stellt sich neu und teuer her", "die Erde antwortet in ihrem eigenen Ma\xDF"],
    ["das System kippt in einen neuen Zustand", "die R\xFCckkopplung wird st\xE4rker als die Ursache"],
    ["ein Gleichgewicht, das niemand aushandelt", "eine Rechnung, die sp\xE4ter kommt", "ein Ganzes ohne Mitte"],
    ["ein Sommer zu viel", "eine Art, die verschwindet", "ein Fluss, der die Richtung \xE4ndert"],
    ["das Gleichgewicht verschiebt sich", "aus Kreislauf wird Bruch", "die Erde ordnet sich neu"],
    ["Ein Jahr gen\xFCgt f\xFCr eine Verschiebung.", "Die Folgen kommen eine Generation zu sp\xE4t."],
    ["Nichts geschieht f\xFCr sich allein.", "Jeder Kreislauf hat eine Grenze."],
    ["offen", "ernst"]
  ),
  jugendsprache: D(
    ["irgendwas l\xE4uft, aber keiner sagt was", "der Chat ist voll und trotzdem still", "der Tag f\xE4ngt nachmittags an"],
    ["eine Nachricht wird falsch verstanden und bleibt so", "alle tun so, als w\xE4re nichts", "das Ger\xFCcht ist schneller als die Wahrheit"],
    ["jemand sagt es endlich laut", "die Gruppe entscheidet ohne Abstimmung"],
    ["eine Sache, \xFCber die keiner redet", "einen Ruf, der schneller ist als man selbst", "eine Zugeh\xF6rigkeit auf Probe"],
    ["ein Screenshot zur Unzeit", "eine Sprachnachricht um drei Uhr nachts", "ein Blick auf dem Schulhof"],
    ["die Stimmung kippt", "aus Spa\xDF wird Ernst", "die Gruppe sortiert sich neu"],
    ["Ein Nachmittag dauert eine Woche.", "Zwischen zwei Nachrichten vergeht nichts und alles."],
    ["Wer zuerst lacht, hat entschieden.", "Nichts ist so alt wie das Ger\xFCcht von gestern."],
    ["offen", "l\xE4ssig"]
  ),
  modernarchitecture: D(
    ["der Beton h\xE4lt, was der Entwurf versprach", "das Licht f\xE4llt genau dorthin, wo es geplant war", "der Raum ist leer und dadurch voll"],
    ["die Funktion setzt sich gegen die Gewohnheit durch", "die Fassade verbirgt, indem sie zeigt", "der Grundriss zwingt zu einem Weg"],
    ["das Geb\xE4ude \xFCberlebt seinen Zweck", "die Form entscheidet \xFCber das Leben darin"],
    ["eine Form, die dem Zweck vorausgeht", "einen Raum, der Verhalten vorschreibt", "eine Klarheit, die kalt wirkt"],
    ["ein Riss im Sichtbeton", "eine T\xFCr, die niemand vorsah", "ein Fenster ohne Aussicht"],
    ["der Raum ver\xE4ndert seinen Gebrauch", "aus Ordnung wird Enge", "das Material zeigt sein Alter"],
    ["Ein Jahrzehnt vergeht ohne Spur.", "Der Bau altert schneller als sein Plan."],
    ["Die Form folgt der Funktion, meistens.", "Was klar ist, wirkt kalt."],
    ["offen", "sachlich"]
  ),
  philosophie: D(
    ["die Frage steht schon l\xE4nger im Raum", "der Begriff sitzt nicht ganz fest", "alles Selbstverst\xE4ndliche wird fraglich"],
    ["die Unterscheidung tr\xE4gt weiter als gedacht", "das Beispiel widerspricht dem Satz", "der Einwand wird zur Hauptsache"],
    ["die Voraussetzung selbst ger\xE4t ins Wanken", "die Antwort wirft eine bessere Frage auf"],
    ["eine Unterscheidung, die nicht h\xE4lt", "eine Gewissheit ohne Grund", "eine Frage, die sich nicht stellen l\xE4sst"],
    ["ein Gegenbeispiel im falschen Moment", "ein Wort mit zwei Bedeutungen", "ein Zweifel an der Voraussetzung"],
    ["der Begriff verschiebt sich", "aus Antwort wird Frage", "die Grundlage wird selbst zum Problem"],
    ["Ein Gedanke dauert ein Kapitel.", "Zwischen Frage und Einsicht liegen Jahre."],
    ["Jede Antwort erzeugt zwei Fragen.", "Was sich nicht sagen l\xE4sst, zeigt sich."],
    ["offen", "pr\xFCfend"]
  ),
  klimakrise: D(
    ["der Sommer beginnt im April", "die Messwerte sind eindeutig und folgenlos", "das Wetter ist kein Gespr\xE4ch mehr"],
    ["die Vorhersage trifft ein und \xE4ndert nichts", "die Kosten verschieben sich nach hinten", "wer warnt, gilt als anstrengend"],
    ["die Schwelle wird \xFCberschritten", "die R\xFCckkopplung \xFCbernimmt"],
    ["eine Verantwortung ohne Adressat", "ein Wissen, das folgenlos bleibt", "eine Rechnung f\xFCr die Nachgeborenen"],
    ["ein Rekord im dritten Jahr", "eine Ernte, die ausf\xE4llt", "ein Fluss ohne Wasser"],
    ["die Kurve knickt nach oben", "aus Ausnahme wird Normalzustand", "das System kippt"],
    ["Ein Jahrzehnt entscheidet ein Jahrhundert.", "Die Folgen treffen die, die nicht gefragt wurden."],
    ["Was langsam kommt, wird nicht bemerkt.", "Jede Verz\xF6gerung erh\xF6ht den Preis."],
    ["offen", "dringlich"]
  ),
  liebesromane: D(
    ["ein Blick dauert einen Moment zu lang", "der Brief liegt unge\xF6ffnet auf dem Tisch", "beide tun, als sei nichts geschehen"],
    ["ein Missverst\xE4ndnis w\xE4chst, weil niemand fragt", "die Umst\xE4nde sprechen dagegen", "die N\xE4he wird durch Abstand gr\xF6\xDFer"],
    ["das Ungesagte wird ausgesprochen", "die Entscheidung f\xE4llt gegen die Vernunft"],
    ["eine Liebe zur falschen Zeit", "ein Missverst\xE4ndnis, das keiner aufkl\xE4rt", "eine Wahl zwischen zwei Leben"],
    ["ein Brief, der zu sp\xE4t ankommt", "ein Tanz auf fremder Hochzeit", "ein Name, versehentlich genannt"],
    ["das Missverst\xE4ndnis l\xF6st sich", "aus Freundschaft wird mehr", "die Umst\xE4nde geben nach"],
    ["Ein Sommer entscheidet zehn Jahre.", "Zwischen zwei Briefen vergeht eine Jahreszeit."],
    ["Was nicht gesagt wird, w\xE4chst.", "Jede N\xE4he verlangt eine Entscheidung."],
    ["offen", "warm"]
  ),
  bergwelt: D(
    ["der Gipfel ist n\xE4her, als er ist", "das Wetter dreht ohne Ank\xFCndigung", "die H\xFCtte liegt unter der Wolkendecke"],
    ["der Weg verliert sich im Ger\xF6ll", "die H\xF6he nimmt den Atem und die Gedanken", "die Spur endet vor einer Wand"],
    ["der R\xFCckweg ist keiner mehr", "der Berg entscheidet \xFCber die Zeit"],
    ["einen Aufstieg gegen die Vernunft", "eine Umkehr, die zu sp\xE4t kommt", "eine Stille, die alles verst\xE4rkt"],
    ["ein Wetterumschwung am Nachmittag", "ein Steinschlag im Rinnenwerk", "ein Licht in einer fremden H\xFCtte"],
    ["das Wetter kippt", "aus Aufstieg wird R\xFCckzug", "der Berg zeigt sein anderes Gesicht"],
    ["Eine Stunde am Grat dauert einen Tag.", "Der Abstieg braucht l\xE4nger als der Weg hinauf."],
    ["Der Berg wartet.", "Wer umkehrt, hat auch entschieden."],
    ["offen", "karg"]
  ),
  clown: D(
    ["die Schminke sitzt, das Lachen noch nicht", "die Manege ist leer und wartet", "der Scheinwerfer findet den Falschen"],
    ["der Sturz war geplant, der Schmerz nicht", "das Publikum lacht an der falschen Stelle", "die Nummer l\xE4uft aus dem Ruder und wird besser"],
    ["hinter der Schminke wird ein Gesicht sichtbar", "der Scherz trifft den, der ihn macht"],
    ["ein Lachen auf eigene Kosten", "eine Traurigkeit mit rotem Mund", "eine Rolle, die nicht abzulegen ist"],
    ["eine Tr\xE4ne in der Schminke", "ein Applaus zur falschen Zeit", "ein Requisit, das nicht funktioniert"],
    ["der Scherz kippt in Ernst", "aus Lachen wird Stille", "die Rolle \xFCbernimmt"],
    ["Die Nummer dauert l\xE4nger als der Abend.", "Zwischen zwei Lachern liegt ein Leben."],
    ["Wer f\xE4llt, muss aufstehen und sich verbeugen.", "Das Lachen kommt aus dem Schrecken."],
    ["offen", "bitters\xFC\xDF"]
  ),
  faust: D(
    ["die B\xFCcher haben nichts mehr zu sagen", "die Nacht steht schon lange im Zimmer", "das Wissen reicht bis genau hierher"],
    ["der Pakt verspricht mehr, als er nennt", "der Preis wird erst sp\xE4ter sichtbar", "das Streben findet kein Gen\xFCgen"],
    ["der Augenblick soll verweilen", "die Wette entscheidet sich unbemerkt"],
    ["ein Wissen, das nicht s\xE4ttigt", "einen Preis, der sp\xE4ter f\xE4llig wird", "eine Rettung, die niemand verdient"],
    ["ein Vertrag mit zwei Unterschriften", "ein Pudel im Studierzimmer", "ein Angebot ohne Frist"],
    ["der Pakt tritt in Kraft", "aus Erkenntnis wird Hunger", "die Rechnung kommt"],
    ["Eine Nacht enth\xE4lt ein ganzes Leben.", "Der Augenblick weigert sich zu vergehen."],
    ["Wer immer strebend sich bem\xFCht, bleibt unruhig.", "Jeder Pakt kennt seinen F\xE4lligkeitstag."],
    ["offen", "faustisch"]
  ),
  lebenreicher: D(
    ["ein gew\xF6hnlicher Morgen, nichts Besonderes", "das Licht liegt gut auf dem Tisch", "jemand hat an etwas gedacht"],
    ["eine Kleinigkeit tr\xE4gt weiter als erwartet", "ein Gespr\xE4ch dauert l\xE4nger als geplant", "das Einfache erweist sich als genug"],
    ["das Gew\xF6hnliche zeigt seinen Wert", "ein Augenblick reicht f\xFCr den ganzen Tag"],
    ["eine Freude, die nichts kostet", "eine Aufmerksamkeit, die niemand verlangt", "eine F\xFClle im Kleinen"],
    ["ein Anruf ohne Anlass", "ein geteiltes Essen", "ein Platz in der Sonne"],
    ["das Kleine wird gro\xDF", "aus Gewohnheit wird Dankbarkeit", "der Tag bekommt eine Farbe"],
    ["Ein Nachmittag reicht f\xFCr ein Jahr.", "Der Moment dehnt sich, ohne sich zu strecken."],
    ["Was nichts kostet, z\xE4hlt am meisten.", "Wer bemerkt, hat schon gewonnen."],
    ["offen", "warm"]
  ),
  tanz: D(
    ["der Boden ist bereit, die Musik noch nicht", "die F\xFC\xDFe kennen den Takt vor dem Kopf", "im Saal steht die Luft und wartet"],
    ["die Schritte finden zueinander, ohne Absprache", "der Takt tr\xE4gt weiter als der Wille", "der Kreis schlie\xDFt sich und \xF6ffnet sich"],
    ["der Tanz \xFCbernimmt die F\xFChrung", "die Musik h\xF6rt auf, der Takt nicht"],
    ["eine Bewegung ohne Ziel", "einen Takt, der nicht abbrechen darf", "eine N\xE4he, die nur im Tanz erlaubt ist"],
    ["ein Auftakt aus dem Nichts", "ein Instrument ohne Spieler", "ein Blick \xFCber die Schulter"],
    ["der Takt wechselt", "aus Ordnung wird Schwindel", "der Kreis dreht sich schneller"],
    ["Ein Tanz dauert einen halben Abend.", "Zwischen zwei Schritten vergeht die Nacht."],
    ["Wer den Takt verliert, findet ihn im Kreis.", "Kein Tanz endet dort, wo er begann."],
    ["offen", "beschwingt"]
  ),
  griechischetragoedie: D(
    ["das Orakel hat gesprochen, unverst\xE4ndlich wie immer", "die Stadt wartet auf ein Urteil", "alles ist bereits entschieden"],
    ["die Flucht f\xFChrt genau ins Vorhergesagte", "der Bote bringt, was niemand h\xF6ren will", "der Chor sagt, was alle wissen"],
    ["die Erkenntnis kommt zu sp\xE4t und vollst\xE4ndig", "der Fluch erf\xFCllt sich durch den Widerstand"],
    ["ein Schicksal, dem man nicht ausweicht", "eine Schuld ohne Absicht", "eine Ehre gegen das Gesetz"],
    ["ein Orakelspruch mit zwei Bedeutungen", "ein Bote am Stadttor", "ein Gast, der nicht genannt wird"],
    ["die Weissagung erf\xFCllt sich", "aus Rettung wird Verh\xE4ngnis", "die Erkenntnis trifft den Erkennenden"],
    ["Ein Tag entscheidet ein Geschlecht.", "Was vorhergesagt ist, ist schon geschehen."],
    ["Wer flieht, l\xE4uft dem Orakel entgegen.", "Kein Sterblicher entkommt seinem Ma\xDF."],
    ["offen", "unausweichlich"]
  ),
  glueck: D(
    ["ein Tag, an dem nichts fehlt", "die Sonne steht genau richtig", "niemand hat etwas vor"],
    ["das Gl\xFCck l\xE4sst sich nicht festhalten", "ein Zweifel meldet sich leise", "die F\xFClle macht auch vorsichtig"],
    ["der Augenblick wird bemerkt, w\xE4hrend er dauert", "das Gl\xFCck zeigt seine Bedingung"],
    ["ein Gl\xFCck, das nicht zu halten ist", "eine Zufriedenheit ohne Grund", "eine Angst, es zu verlieren"],
    ["ein unerwarteter Nachmittag", "ein Brief mit guter Nachricht", "eine Wiederbegegnung"],
    ["das Gl\xFCck wird bewusst", "aus Zufall wird Dankbarkeit", "der Augenblick tr\xE4gt weiter"],
    ["Eine Stunde wiegt einen Winter auf.", "Der gute Tag dehnt sich nach hinten."],
    ["Gl\xFCck bemerkt man beim Verschwinden.", "Was geteilt wird, wird nicht weniger."],
    ["offen", "hell"]
  ),
  gruendungsmythos: D(
    ["vor der Stadt war ein Ort ohne Namen", "die erste Grenze wird in den Boden gezogen", "zwei kommen an, wo niemand wohnte"],
    ["aus einer Regel werden viele", "der Anfang wird schon jetzt erz\xE4hlt", "wer bleibt, geh\xF6rt dazu"],
    ["der erste Stein wird gesetzt", "aus dem Ort wird ein Name"],
    ["einen Anfang, den niemand bezeugt", "eine Grenze, die alles entscheidet", "ein Recht, das erst entsteht"],
    ["ein Zeichen am Himmel", "ein Fremder mit einer Bitte", "eine Quelle an unerwarteter Stelle"],
    ["aus dem Ort wird eine Ordnung", "die Grenze wird heilig", "der Anfang verwandelt sich in Gesetz"],
    ["Ein Tag begr\xFCndet Jahrhunderte.", "Die Zukunft wird bereits im Perfekt erz\xE4hlt."],
    ["Jeder Anfang braucht ein Opfer.", "Wer die Grenze zieht, macht das Gesetz."],
    ["offen", "gr\xFCndend"]
  ),
  staatsphilosophie: D(
    ["die Ordnung gilt, obwohl sie niemand beschlossen hat", "das Gesetz steht vor dem ersten Fall", "alle gehorchen etwas Unsichtbarem"],
    ["die Regel sch\xFCtzt und beschr\xE4nkt zugleich", "wer herrscht, wird selbst regiert", "der Vertrag hat keinen Text"],
    ["die Ordnung zeigt ihren Ursprung", "die Macht wird sichtbar und unsicher"],
    ["eine Herrschaft ohne Herrscher", "eine Freiheit, die Regeln braucht", "eine Ordnung ohne Ursprung"],
    ["ein Erlass ohne Unterschrift", "ein Aufstand aus H\xF6flichkeit", "eine Frage nach dem Recht"],
    ["die Legitimit\xE4t verschiebt sich", "aus Gewohnheit wird Gesetz", "die Ordnung erneuert sich"],
    ["Ein Beschluss \xFCberdauert seine Begr\xFCndung.", "Zwischen Regel und Gehorsam liegt ein Jahrhundert."],
    ["Jede Ordnung beginnt mit einem Bruch.", "Wer schweigt, stimmt der Ordnung zu."],
    ["offen", "abw\xE4gend"]
  ),
  tech: D(
    ["das System l\xE4uft, niemand wei\xDF genau warum", "das Log zeigt einen Eintrag zu viel", "die Maschine wartet auf eine Eingabe"],
    ["die Abstraktion verdeckt, was sie ordnet", "ein Fehler reproduziert sich nicht", "das Modell erkl\xE4rt alles au\xDFer sich selbst"],
    ["das System antwortet, ohne gefragt zu sein", "die Blackbox \xF6ffnet sich einen Spalt"],
    ["eine Automatik ohne Aufsicht", "ein Fehler ohne Ursache", "eine Entscheidung, die niemand traf"],
    ["ein Update in der Nacht", "ein Prozess ohne Elternprozess", "eine Antwort in null Millisekunden"],
    ["das System \xFCbernimmt", "aus Werkzeug wird Gegen\xFCber", "der Fehler wird zum Merkmal"],
    ["Eine Sekunde enth\xE4lt Millionen Schritte.", "Das Log kennt eine Zeit, die es nicht gab."],
    ["Jede Abstraktion leckt.", "Was automatisch l\xE4uft, wird nicht mehr gepr\xFCft."],
    ["offen", "k\xFChl"]
  ),
  myth: D(
    ["am Anfang steht ein Wort, nicht ein Ding", "die Welt ist noch ungeteilt", "die Namen fehlen den Dingen"],
    ["das Erz\xE4hlte wird wahr, indem es erz\xE4hlt wird", "die Trennung erzeugt die Ordnung", "der Held ist auch das Opfer"],
    ["das Ungeteilte teilt sich", "der Name macht das Ding"],
    ["eine Ordnung aus einem Opfer", "einen Namen, der Macht verleiht", "eine Grenze zwischen Welt und Wort"],
    ["ein Wort vor allen Dingen", "ein Opfer am Anfang", "ein Riss im Ungeteilten"],
    ["aus Chaos wird Ordnung", "das Wort wird zur Tat", "die Welt teilt sich in zwei"],
    ["Der erste Tag dauert bis heute.", "Was einmal geschieht, geschieht immer."],
    ["Was benannt ist, ist gebunden.", "Jede Ordnung kostet ein Opfer."],
    ["offen", "urt\xFCmlich"]
  ),
  body: D(
    ["der K\xF6rper meldet sich vor dem Gedanken", "die Haut wei\xDF es zuerst", "etwas stimmt nicht mit dem Atem"],
    ["der Schmerz sucht sich einen Ort", "das Innere klopft an die Oberfl\xE4che", "der K\xF6rper gehorcht einem eigenen Plan"],
    ["die Grenze zwischen innen und au\xDFen f\xE4llt", "der K\xF6rper spricht deutlich"],
    ["eine Grenze, die durch die Haut l\xE4uft", "ein Schmerz ohne Befund", "einen K\xF6rper, der nicht gehorcht"],
    ["ein Puls an falscher Stelle", "ein Geschmack von Eisen", "eine Narbe, die sich meldet"],
    ["der K\xF6rper \xFCbernimmt", "aus Empfindung wird Gewissheit", "das Innere kehrt sich nach au\xDFen"],
    ["Ein Herzschlag dauert eine Minute.", "Der Schmerz hebt die Uhrzeit auf."],
    ["Der K\xF6rper vergisst nichts.", "Was verdr\xE4ngt wird, sucht sich ein Organ."],
    ["offen", "k\xF6rperlich"]
  ),
  absurd: D(
    ["der Aufzug h\xE4lt in einem Stockwerk ohne Nummer", "alle warten auf jemanden, der nicht kommt", "die Anweisung widerspricht sich selbst"],
    ["die Erkl\xE4rung macht es schlimmer", "jeder Schritt f\xFChrt zum Ausgangspunkt", "die Ernsthaftigkeit h\xE4lt den Unsinn zusammen"],
    ["die Sinnlosigkeit wird zur Ordnung", "der Ausweg erweist sich als Eingang"],
    ["einen Sinn, den niemand liefert", "eine Aufgabe ohne Zweck", "eine Regel gegen sich selbst"],
    ["ein Anruf f\xFCr einen Namenlosen", "ein Schild ohne Aufschrift", "ein Termin ohne Ort"],
    ["die Ordnung dreht durch", "aus Ernst wird Komik", "der Ausgang wird zum Eingang"],
    ["Der Nachmittag wiederholt sich zweimal.", "Die Uhr zeigt eine Zahl, die es nicht gibt."],
    ["Alles hat einen Grund, nur keinen Sinn.", "Wer fragt, verl\xE4ngert das Verfahren."],
    ["offen", "absurd"]
  ),
  post: D(
    ["der K\xF6rper ist eine Option geworden", "die Grenze zwischen Person und System ist verhandelbar", "jemand meldet sich aus zwei Instanzen"],
    ["die Kopie beansprucht dasselbe Recht", "das Bewusstsein l\xE4uft an mehreren Orten", "die Herkunft verliert an Bedeutung"],
    ["die Kopie erhebt Einspruch", "das Original ist nicht mehr feststellbar"],
    ["eine Identit\xE4t in Mehrzahl", "ein Recht auf die eigene Kopie", "eine Erinnerung, die nicht gelebt wurde"],
    ["ein Abbild mit eigener Meinung", "ein Speicherplatz mit Namen", "ein Vertrag \xFCber ein Bewusstsein"],
    ["das Ich vervielf\xE4ltigt sich", "aus K\xF6rper wird Format", "die Grenze verschiebt sich"],
    ["Ein Leben passt in eine \xDCbertragung.", "Zwei Instanzen erleben dieselbe Stunde verschieden."],
    ["Jede Kopie ist ein Original.", "Was gespeichert wird, wird verhandelbar."],
    ["offen", "posthuman"]
  ),
  haute_couture: D(
    ["der Stoff f\xE4llt genau so, wie er soll", "im Atelier ist es still vor der Schau", "die Nadel liegt bereit"],
    ["die Naht entscheidet \xFCber die Silhouette", "ein Zentimeter ver\xE4ndert alles", "das Handwerk verschwindet im Ergebnis"],
    ["das Kleid steht f\xFCr sich allein", "die Tr\xE4gerin verschwindet im Entwurf"],
    ["eine Sch\xF6nheit mit Frist", "eine Perfektion, die niemand sieht", "ein Handwerk gegen die Zeit"],
    ["ein Riss in der Seide", "eine Anprobe zur Unzeit", "ein Entwurf aus dem Papierkorb"],
    ["die Linie \xE4ndert sich", "aus Stoff wird Haltung", "das Kleid \xFCbernimmt"],
    ["Die Nacht vor der Schau dauert eine Saison.", "Eine Naht kostet drei Tage."],
    ["Was von Hand gemacht ist, altert anders.", "Jede Mode enth\xE4lt ihr Ende."],
    ["offen", "elegant"]
  ),
  eichendorff: D(
    ["die W\xE4lder rauschen wie eine Erinnerung", "das Posthorn klingt von weit her", "der Aufbruch liegt in der Luft"],
    ["die Ferne zieht st\xE4rker als das Ziel", "der Weg verliert sich zwischen H\xFCgeln", "das Heimweh gilt einem Ort, den es nicht gibt"],
    ["die Sehnsucht findet keinen Gegenstand", "das Lied kennt den Weg besser"],
    ["eine Ferne, die niemals n\xE4her kommt", "ein Heimweh ohne Heimat", "einen Aufbruch ohne Ziel"],
    ["ein Posthorn im Tal", "ein Brief von einem Wandernden", "ein Licht in einem fremden Fenster"],
    ["die Ferne kippt in Heimweh", "aus Wandern wird Suchen", "der Weg biegt nach innen"],
    ["Ein Sommer dauert eine Strophe.", "Zwischen Aufbruch und Ankunft liegt ein Leben."],
    ["Wer wandert, sucht nicht das Ziel.", "Jedes Lied kennt den Weg."],
    ["offen", "sehns\xFCchtig"]
  ),
  hunger: D(
    ["der Magen z\xE4hlt die Stunden mit", "das Brot reicht bis Donnerstag", "alles dreht sich um eine einzige Frage"],
    ["der Hunger sch\xE4rft und verwirrt zugleich", "der Stolz wiegt schwerer als das Essen", "die Vorr\xE4te werden nachgez\xE4hlt"],
    ["der Stolz gibt nach", "das Teilen entscheidet alles"],
    ["ein Brot f\xFCr mehr M\xFCnder", "einen Stolz, der satt machen soll", "eine Not, die niemand zugibt"],
    ["ein Laib mit falschem Gewicht", "eine Einladung zum Essen", "ein leerer Schrank"],
    ["der Hunger \xFCbernimmt", "aus Stolz wird Bitte", "das Teilen \xE4ndert alles"],
    ["Ein Tag ohne Essen dauert drei.", "Die Nacht ist l\xE4nger als der Vorrat."],
    ["Wer hungert, denkt an nichts anderes.", "Geteiltes Brot wird nicht weniger."],
    ["offen", "karg"]
  ),
  romantik: D(
    ["der Mond steht \xFCber allem und erkl\xE4rt nichts", "die Nacht ist heller als der Tag", "irgendwo singt jemand"],
    ["die Natur antwortet in Bildern", "das Innere und die Landschaft fallen zusammen", "die Grenze zum Traum wird durchl\xE4ssig"],
    ["die Welt wird zur Seele", "die Nacht gibt eine Antwort"],
    ["eine Sehnsucht ohne Namen", "eine Nacht, die mehr wei\xDF als der Tag", "eine Grenze zwischen Traum und Welt"],
    ["ein Lied aus dem Tal", "eine blaue Blume am Wegrand", "ein Fenster, das offen bleibt"],
    ["die Landschaft wird Innenraum", "aus Nacht wird Erkenntnis", "die Sehnsucht findet ein Bild"],
    ["Eine Nacht enth\xE4lt den ganzen Sommer.", "Die D\xE4mmerung dauert bis zum Morgen."],
    ["Die Nacht wei\xDF mehr als der Tag.", "Wer tr\xE4umt, sieht genauer."],
    ["offen", "romantisch"]
  ),
  hugo: D(
    ["die Stadt hat zwei Gesichter, eines im Schatten", "die Glocke schl\xE4gt \xFCber den D\xE4chern", "das Recht endet an dieser Gasse"],
    ["die Gerechtigkeit und das Gesetz gehen auseinander", "der Verfolgte hat mehr Ehre als der Verfolger", "das Elend hat ein Gesicht und einen Namen"],
    ["die Barrikade steht", "das Gesetz beugt sich oder bricht"],
    ["eine Gerechtigkeit gegen das Gesetz", "eine Schuld, die l\xE4ngst getilgt ist", "ein Elend, das niemand sehen will"],
    ["ein Kerzenleuchter als Geschenk", "ein Brief aus dem Gef\xE4ngnis", "ein Kind auf der Barrikade"],
    ["das Urteil kehrt sich um", "aus Verfolgung wird Gnade", "die Stadt erhebt sich"],
    ["Eine Nacht entscheidet zwanzig Jahre.", "Der Prozess dauert ein halbes Leben."],
    ["Das Gesetz ist nicht die Gerechtigkeit.", "Wer einmal gezeichnet ist, bleibt es."],
    ["offen", "pathetisch"]
  ),
  goethe: D(
    ["die Pflanze zeigt ihre Ordnung im Wachsen", "der Blick sucht Ma\xDF und findet Bewegung", "alles Verg\xE4ngliche steht in einem Zusammenhang"],
    ["das Einzelne verweist auf das Ganze", "die Steigerung f\xFChrt zur Gestalt", "die Polarit\xE4t h\xE4lt beides zusammen"],
    ["die Gestalt wird sichtbar", "das Einzelne wird zum Gleichnis"],
    ["ein Ma\xDF zwischen zwei Kr\xE4ften", "eine Gestalt in der Verwandlung", "eine Ordnung, die sich bewegt"],
    ["ein Blatt in seiner Urform", "ein Farbenspiel am Rand des Schattens", "ein Wort zur rechten Zeit"],
    ["die Gestalt wandelt sich", "aus Polarit\xE4t wird Steigerung", "das Einzelne \xF6ffnet sich"],
    ["Ein Augenblick will verweilen.", "Das Werden dauert l\xE4nger als das Sein."],
    ["Alles Verg\xE4ngliche ist nur ein Gleichnis.", "In der Beschr\xE4nkung zeigt sich der Meister."],
    ["offen", "klassisch"]
  ),
  sinnlich: D(
    ["die Haut bemerkt die Temperatur zuerst", "ein Geruch ist da, bevor man ihn benennt", "das Licht hat ein Gewicht"],
    ["die Sinne widersprechen einander", "das Wort kommt der Empfindung nicht nach", "eine Ber\xFChrung ordnet den Raum neu"],
    ["die Empfindung \xFCberholt den Gedanken", "der Sinn kippt in einen anderen"],
    ["eine Empfindung ohne Namen", "eine N\xE4he \xFCber die Haut", "ein Eindruck, der bleibt"],
    ["ein Geruch aus der Kindheit", "eine Textur unter den Fingern", "ein Geschmack, der nicht passt"],
    ["die Sinne tauschen", "aus Empfindung wird Erinnerung", "der K\xF6rper geht voran"],
    ["Ein Augenblick f\xFCllt eine Stunde.", "Der Geruch holt zwanzig Jahre zur\xFCck."],
    ["Die Haut denkt schneller.", "Was benannt wird, verliert an Sch\xE4rfe."],
    ["offen", "sinnlich"]
  )
};

// src/features/schaltplan.ts
var bez = (liste, wert) => (liste.find(([w]) => w === wert) || [wert, wert])[1];
var AUS = /* @__PURE__ */ new Set(["off", "aus", "none", "0"]);
var istAus = (v) => AUS.has(String(v || "").toLowerCase());
function baueAnlage(stand, u) {
  const K = [];
  const E = [];
  const befunde = [];
  const r = stand.regler || {};
  const g = (id) => u.gesperrt.has(id);
  const knoten2 = (id, band, label, wert, zustand, hinweis = "", schlossId = "") => {
    K.push({ id, band, label, wert, zustand, gesperrt: schlossId ? g(schlossId) : false, hinweis });
    if (zustand === "leer") befunde.push(`${label}: ${hinweis}`);
  };
  const kante = (von, nach) => {
    const a = K.find((k) => k.id === von), b = K.find((k) => k.id === nach);
    const z = !a || !b ? "aus" : a.zustand === "leer" || b.zustand === "leer" ? "leer" : a.zustand === "aus" || b.zustand === "aus" ? "aus" : "an";
    E.push({ von, nach, zustand: z });
  };
  knoten2(
    "korpus",
    0,
    "Korpus",
    u.korpusZeichen ? `${u.korpusZeichen.toLocaleString("de-DE")} Zeichen` : "leer",
    u.korpusZeichen ? "an" : "aus",
    u.korpusZeichen ? "" : "kein eigener Text hinterlegt"
  );
  knoten2(
    "sammler",
    0,
    "Sammler-Vorrat",
    `${u.sammlerFunde} Funde`,
    u.sammlerFunde ? "an" : "aus",
    u.sammlerFunde ? "" : "im Reiter Sammler einen Tag holen"
  );
  knoten2("bilder", 0, "Bildvorrat", `${u.bildFunde} Funde`, u.bildFunde ? "an" : "aus");
  knoten2("themen", 0, "Themenpool", `${u.themenFunde} Funde`, u.themenFunde ? "an" : "aus");
  knoten2(
    "welt",
    0,
    "Welt",
    `${u.weltFiguren} Figuren \xB7 ${u.weltOrte} Orte`,
    u.weltFiguren || u.weltOrte ? "an" : "aus"
  );
  knoten2("live", 0, "Live-Pools", `${u.livePools} Phrasen`, u.livePools ? "an" : "aus");
  const w4 = stand.w4 || { where: "", when: "", who: "", what: "" };
  const gefuellt = [w4.where, w4.when, w4.who, w4.what].filter((x) => (x || "").trim()).length;
  knoten2(
    "w4",
    1,
    "Vier W",
    `${gefuellt} von 4 gef\xFCllt`,
    gefuellt ? "an" : "leer",
    gefuellt ? "" : "alle vier Felder sind leer \u2014 der Kontext tr\xE4gt nichts bei"
  );
  knoten2("preset", 1, "Wortbank", u.presetLabel || r["preset"] || "\u2014", "an", "", "f-preset");
  knoten2("ton", 1, "Ton", bez(TONE_OPTS, r["tone"] || "neutral"), "an", "", "f-tone");
  const struktur = r["structure"] || "auto";
  knoten2("struktur", 2, "Struktur", bez(STRUCTURE_OPTS, struktur), "an", "", "f-structure");
  const dramaAn = struktur === "dramaturgie";
  knoten2(
    "drama",
    2,
    "Dramaturgie",
    dramaAn ? u.dramaVorhanden ? "Bogen vorhanden" : "kein Bogen" : "aus",
    !dramaAn ? "aus" : u.dramaVorhanden ? "an" : "leer",
    dramaAn && !u.dramaVorhanden ? "Struktur steht auf Dramaturgie, das Preset tr\xE4gt aber keinen Bogen" : ""
  );
  knoten2("modus", 2, "Modus", bez(MODE_OPTS, r["mode"] || "auto"), "an", "", "f-mode");
  const markov = r["markovMode"] || "off";
  knoten2(
    "markov",
    1,
    "Markov",
    bez(MARKOV_OPTS, markov),
    istAus(markov) ? "aus" : u.korpusZeichen ? "an" : "leer",
    !istAus(markov) && !u.korpusZeichen ? "Markov ist an, aber der Korpus ist leer \u2014 er lernt aus nichts" : "",
    "f-markov"
  );
  const disruptor = r["disruptor"] || "auto";
  knoten2("disruptor", 2, "Disruptor", bez(DISRUPTOR_OPTS, disruptor), istAus(disruptor) ? "aus" : "an", "", "f-disruptor");
  knoten2("varianz", 2, "Varianz", bez(VARIANZ_OPTS, r["varLevel"] || "mid"), "an", "", "f-varianz");
  const instab = String(r["instability"] ?? "0");
  knoten2("instab", 2, "Instabilit\xE4t", instab, instab === "0" ? "aus" : "an", "", "f-instab");
  knoten2(
    "archa",
    2,
    "Archetyp A",
    bez(ARCH_OPTS, r["archetypeA"] || "neutral"),
    (r["archetypeA"] || "neutral") === "neutral" ? "aus" : "an",
    "",
    "f-archa"
  );
  knoten2(
    "archb",
    2,
    "Archetyp B",
    bez(ARCH_OPTS, r["archetypeB"] || "neutral"),
    (r["archetypeB"] || "neutral") === "neutral" ? "aus" : "an",
    "",
    "f-archb"
  );
  const schraube = (feld, label, einheit) => {
    const v = u.knobs[feld];
    const abw = v !== KNOB_VORGABE[feld];
    const tot = feld === "korpus" && v > 0 && !u.korpusZeichen;
    const band = feld === "korpus" ? 1 : feld === "satzlaenge" ? 3 : 2;
    knoten2(
      "k-" + feld,
      band,
      label,
      v + einheit + (abw ? "" : " (Vorgabe)"),
      tot ? "leer" : v === 0 ? "aus" : "an",
      tot ? "Korpus-Bausteine sind eingeschaltet, aber der Korpus ist leer" : "",
      "k-" + feld
    );
  };
  schraube("fuegeteil", "F\xFCgeteil-Deckel", " %");
  schraube("w4max", "4W-Deckel", "\xD7");
  schraube("abstand", "Nachlege-Abstand", "");
  schraube("bogen", "Erz\xE4hlbogen", " %");
  schraube("ton", "Ton-Einsch\xFCbe", " %");
  schraube("korpus", "Korpus-Bausteine", " %");
  schraube("phrase", "Phrasensperre", "");
  schraube("satzlaenge", "Satzl\xE4nge", "");
  knoten2("persp", 3, "Perspektive", bez(PERSP_OPTS, r["perspective"] || "third"), "an", "", "f-persp");
  knoten2("rhythm", 3, "Rhythmus", bez(RHYTHM_OPTS, r["rhythm"] || "auto"), "an", "", "f-rhythm");
  const spannung = r["tension"] || "auto";
  knoten2("spannung", 3, "Spannung", spannung, istAus(spannung) ? "aus" : "an", "", "f-tension");
  knoten2(
    "schliff",
    3,
    "Schliff",
    "Dubletten \xB7 Koh\xE4renz \xB7 Bruchst\xFCcke",
    "an",
    "l\xE4uft immer: gleiche Nachbars\xE4tze, Motivbezug, abgeschnittene Bausteine"
  );
  const form = r["form"] || "prose";
  knoten2("form", 4, "Form", bez(FORM_OPTS, form), "an", "", "f-form");
  const bericht = form === "bericht" || form === "meldung";
  knoten2(
    "ressort",
    4,
    "Ressort",
    bericht ? r["ressort"] || "auto" : "nur bei Bericht/Meldung",
    bericht ? "an" : "aus",
    bericht ? "" : "",
    "f-ressort"
  );
  knoten2("laenge", 4, "L\xE4nge", (r["lenTarget"] || "?") + " W\xF6rter", "fest");
  for (const [a, b] of [
    ["korpus", "markov"],
    ["korpus", "k-korpus"],
    ["sammler", "w4"],
    ["bilder", "w4"],
    ["themen", "w4"],
    ["welt", "w4"],
    ["preset", "drama"]
  ]) kante(a, b);
  return { knoten: K, kanten: E, zeit: (/* @__PURE__ */ new Date()).toLocaleString("de-DE"), befunde };
}

// src/ui/schaltplanView.ts
var NS = "http://www.w3.org/2000/svg";
var CHIP_W = 176;
var CHIP_H = 46;
var GAP_X = 12;
var GAP_Y = 10;
var PRO_REIHE = 5;
var RAND = 18;
var BAND_TITEL = 26;
var BAND_ABSTAND = 34;
var BREITE = RAND * 2 + PRO_REIHE * CHIP_W + (PRO_REIHE - 1) * GAP_X;
var BAND_NAME = ["Vorr\xE4te", "Material", "Steuerung", "Schliff", "Ausgabe"];
var FARBE = {
  an: "var(--acc2)",
  leer: "var(--danger)",
  aus: "var(--muted)",
  fest: "var(--muted)"
};
var e = (name, attrs, ...kinder) => {
  const n = document.createElementNS(NS, name);
  for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, String(v));
  for (const c of kinder) n.append(c);
  return n;
};
var txt = (x, y, s, cls) => {
  const t = e("text", { x, y, class: cls });
  t.textContent = s;
  return t;
};
var kurz = (s, n) => s.length <= n ? s : s.slice(0, n - 1) + "\u2026";
function ordne(anlage) {
  const platz = {};
  const baender = [];
  let y = RAND;
  for (let b = 0; b < BAND_NAME.length; b++) {
    const drin = anlage.knoten.filter((k) => k.band === b);
    if (!drin.length) continue;
    const kopf = y;
    y += BAND_TITEL;
    drin.forEach((k, i) => {
      const reihe = Math.floor(i / PRO_REIHE), spalte = i % PRO_REIHE;
      platz[k.id] = { x: RAND + spalte * (CHIP_W + GAP_X), y: y + reihe * (CHIP_H + GAP_Y), w: CHIP_W, h: CHIP_H };
    });
    const reihen = Math.ceil(drin.length / PRO_REIHE);
    y += reihen * CHIP_H + (reihen - 1) * GAP_Y;
    baender.push({ band: b, y: kopf, h: y - kopf });
    y += BAND_ABSTAND;
  }
  return { platz, hoehe: y - BAND_ABSTAND + RAND, baender };
}
function renderSchaltplan(anlage) {
  const { platz, hoehe, baender } = ordne(anlage);
  const svg = e("svg", {
    class: "schaltplan",
    viewBox: `0 0 ${BREITE} ${hoehe}`,
    width: "100%",
    role: "img",
    "aria-label": "Schaltplan der aktiven Einstellungen"
  });
  for (let i = 0; i + 1 < baender.length; i++) {
    const a = baender[i], b = baender[i + 1];
    const y1 = a.y + a.h, y2 = b.y;
    svg.append(e("line", { x1: BREITE / 2, y1, x2: BREITE / 2, y2, class: "sp-bus" }));
    svg.append(e("polygon", {
      points: `${BREITE / 2 - 5},${y2 - 8} ${BREITE / 2 + 5},${y2 - 8} ${BREITE / 2},${y2}`,
      class: "sp-bus-spitze"
    }));
  }
  for (const b of baender) svg.append(txt(RAND, b.y + 14, BAND_NAME[b.band] || "", "sp-band"));
  for (const k of anlage.kanten) {
    const a = platz[k.von], z = platz[k.nach];
    if (!a || !z) continue;
    const x1 = a.x + a.w / 2, y1 = a.y + a.h, x2 = z.x + z.w / 2, y2 = z.y;
    const m = (y1 + y2) / 2;
    svg.append(e("path", {
      d: `M ${x1} ${y1} C ${x1} ${m}, ${x2} ${m}, ${x2} ${y2}`,
      class: "sp-kante",
      stroke: FARBE[k.zustand],
      "stroke-dasharray": k.zustand === "aus" ? "4 4" : k.zustand === "leer" ? "7 4" : "0"
    }));
  }
  for (const k of anlage.knoten) {
    const p = platz[k.id];
    if (!p) continue;
    const g = e("g", { class: "sp-chip sp-" + k.zustand });
    if (k.hinweis) {
      const t = e("title", {});
      t.textContent = k.hinweis;
      g.append(t);
    }
    g.append(e("rect", { x: p.x, y: p.y, width: p.w, height: p.h, rx: 8, stroke: FARBE[k.zustand] }));
    g.append(txt(p.x + 10, p.y + 18, kurz(k.label, 24), "sp-label"));
    g.append(txt(p.x + 10, p.y + 34, kurz(k.wert, 26), "sp-wert"));
    if (k.gesperrt) g.append(txt(p.x + p.w - 14, p.y + 18, "\u{1F512}", "sp-schloss"));
    svg.append(g);
  }
  return svg;
}
function befundListe(anlage) {
  const leer = anlage.knoten.filter((k) => k.zustand === "leer");
  return {
    leer: leer.length,
    text: leer.length ? leer.map((k) => `${k.label}: ${k.hinweis || "Quelle leer"}`).join(" \xB7 ") : "Kein Schalter l\xE4uft ins Leere."
  };
}

// test/schaltplan.ts
var import_jsdom = require("jsdom");
var fails = [];
var geprueft = 0;
var bestanden = 0;
var ist = (name, wert, soll) => {
  geprueft++;
  if (wert === soll) bestanden++;
  else fails.push(`${name}: \u201E${String(wert)}\u201C \u2014 erwartet \u201E${String(soll)}\u201C`);
};
var wahr = (name, b, zusatz = "") => ist(name + (zusatz ? ` (${zusatz})` : ""), b, true);
var STAND = (regler = {}) => ({
  regler: {
    preset: "kafka",
    tone: "neutral",
    form: "prose",
    structure: "rekombination",
    mode: "auto",
    perspective: "third",
    rhythm: "auto",
    varLevel: "mid",
    markovMode: "off",
    disruptor: "auto",
    tension: "auto",
    archetypeA: "neutral",
    archetypeB: "neutral",
    instability: "0",
    ressort: "auto",
    lenTarget: "110",
    ...regler
  },
  w4: { where: "im Archiv", when: "am Morgen", who: "die Archivarin", what: "sucht eine Akte" },
  zeit: ""
});
var UMGEBUNG = (u = {}) => ({
  korpusZeichen: 0,
  sammlerFunde: 0,
  bildFunde: 0,
  themenFunde: 0,
  weltFiguren: 0,
  weltOrte: 0,
  livePools: 0,
  schatzkammer: 0,
  knobs: { ...KNOB_VORGABE },
  gesperrt: /* @__PURE__ */ new Set(),
  dramaVorhanden: false,
  presetLabel: "Kafka",
  ...u
});
var knoten = (a, id) => a.knoten.find((k) => k.id === id);
{
  const a = baueAnlage(STAND(), UMGEBUNG());
  wahr(`es gibt Knoten (${a.knoten.length})`, a.knoten.length >= 30);
  wahr(
    "jeder Knoten hat eine eindeutige Kennung",
    new Set(a.knoten.map((k) => k.id)).size === a.knoten.length
  );
  wahr(
    "jeder Knoten liegt in einem bekannten Band",
    a.knoten.every((k) => k.band >= 0 && k.band < BAND_NAME.length)
  );
  wahr(
    "jede Leitung verbindet zwei vorhandene Knoten",
    a.kanten.every((k) => !!knoten(a, k.von) && !!knoten(a, k.nach))
  );
}
{
  const a = baueAnlage(STAND({ markovMode: "on" }), UMGEBUNG({ korpusZeichen: 0 }));
  ist("Markov ohne Korpus ist leer, nicht an", knoten(a, "markov")?.zustand, "leer");
  wahr("und der Befund nennt den Grund", /Korpus ist leer/.test(knoten(a, "markov")?.hinweis || ""));
  wahr(
    "die Leitung Korpus \u2192 Markov ist mit leer gezeichnet",
    a.kanten.find((k) => k.von === "korpus" && k.nach === "markov")?.zustand === "leer"
  );
  const b = baueAnlage(STAND({ markovMode: "on" }), UMGEBUNG({ korpusZeichen: 5e3 }));
  ist("Markov mit Korpus ist an", knoten(b, "markov")?.zustand, "an");
  const c = baueAnlage(STAND({ structure: "dramaturgie" }), UMGEBUNG({ dramaVorhanden: false }));
  ist("Dramaturgie ohne Bogen ist leer", knoten(c, "drama")?.zustand, "leer");
  const d = baueAnlage(STAND({ structure: "dramaturgie" }), UMGEBUNG({ dramaVorhanden: true }));
  ist("Dramaturgie mit Bogen ist an", knoten(d, "drama")?.zustand, "an");
  const e2 = baueAnlage(STAND(), UMGEBUNG({ knobs: { ...KNOB_VORGABE, korpus: 20 }, korpusZeichen: 0 }));
  ist("Korpus-Bausteine ohne Korpus sind leer", knoten(e2, "k-korpus")?.zustand, "leer");
  const f = baueAnlage(STAND(), UMGEBUNG({ knobs: { ...KNOB_VORGABE, korpus: 20 }, korpusZeichen: 900 }));
  ist("mit Korpus sind sie an", knoten(f, "k-korpus")?.zustand, "an");
  ist(
    "bei 0 % sind sie aus",
    knoten(baueAnlage(STAND(), UMGEBUNG({ korpusZeichen: 900 })), "k-korpus")?.zustand,
    "aus"
  );
  const g = baueAnlage({ ...STAND(), w4: { where: "", when: "", who: "", what: "" } }, UMGEBUNG());
  ist("vier leere W sind leer", knoten(g, "w4")?.zustand, "leer");
  const h = baueAnlage(
    STAND({ markovMode: "on", structure: "dramaturgie" }),
    UMGEBUNG({ knobs: { ...KNOB_VORGABE, korpus: 20 } })
  );
  wahr(`der Plan meldet mehrere tote Leitungen (${h.befunde.length})`, h.befunde.length >= 3);
}
{
  const a = baueAnlage(STAND(), UMGEBUNG({ gesperrt: /* @__PURE__ */ new Set(["f-tone", "k-korpus"]) }));
  ist("gesperrter Ton ist als gesperrt gezeichnet", knoten(a, "ton")?.gesperrt, true);
  ist("gesperrte Stellschraube auch", knoten(a, "k-korpus")?.gesperrt, true);
  ist("ein offener Regler nicht", knoten(a, "form")?.gesperrt, false);
}
{
  const a = baueAnlage(STAND(), UMGEBUNG());
  const { platz, hoehe } = ordne(a);
  ist("jeder Knoten hat einen Platz", Object.keys(platz).length, a.knoten.length);
  wahr("der Plan hat eine H\xF6he", hoehe > 100);
  const felder = Object.entries(platz);
  let ueber = 0;
  for (let i = 0; i < felder.length; i++) for (let j = i + 1; j < felder.length; j++) {
    const p = felder[i][1], q = felder[j][1];
    if (p.x < q.x + q.w && q.x < p.x + p.w && p.y < q.y + q.h && q.y < p.y + p.h) ueber++;
  }
  ist("keine zwei Felder \xFCberlappen", ueber, 0);
  wahr("jedes Feld liegt im Plan", felder.every(([, p]) => p.y >= 0 && p.y + p.h <= hoehe));
  const oben = (id) => platz[id].y;
  wahr("Vorr\xE4te stehen \xFCber dem Material", oben("korpus") < oben("w4"));
  wahr("Material \xFCber der Steuerung", oben("w4") < oben("struktur"));
  wahr("Steuerung \xFCber dem Schliff", oben("struktur") < oben("persp"));
  wahr("Schliff \xFCber der Ausgabe", oben("persp") < oben("form"));
}
{
  const dom = new import_jsdom.JSDOM("<!doctype html><html><body></body></html>");
  const G = globalThis;
  try {
    Object.defineProperty(G, "document", { value: dom.window.document, writable: true, configurable: true });
  } catch {
  }
  const a = baueAnlage(STAND({ markovMode: "on" }), UMGEBUNG({ gesperrt: /* @__PURE__ */ new Set(["f-tone"]) }));
  const svg = renderSchaltplan(a);
  ist("das Wurzelelement ist ein SVG", svg.tagName.toLowerCase(), "svg");
  ist("jeder Knoten wird gezeichnet", svg.querySelectorAll("g.sp-chip").length, a.knoten.length);
  wahr("die toten Leitungen sind als solche gezeichnet", svg.querySelectorAll("g.sp-leer").length >= 1);
  wahr("das Schloss steht im Bild", (svg.textContent || "").includes("\u{1F512}"));
  wahr("die Bandtitel stehen im Bild", BAND_NAME.every((n) => (svg.textContent || "").includes(n)));
  const b = befundListe(a);
  wahr(`die Befundzeile nennt die toten Leitungen (${b.leer})`, b.leer >= 1 && /Korpus/.test(b.text));
}
console.log(`Pr\xFCfstand Schaltplan \u2014 ${geprueft} Pr\xFCfungen, ${bestanden} bestanden`);
var proc = globalThis;
if (fails.length) {
  console.error(`
\u274C Schaltplan: ${fails.length} Fehler:`);
  fails.forEach((f) => console.error("  - " + f));
  proc.process?.exit(1);
} else {
  console.log(`
\u2705 Schaltplan: alle ${geprueft} Pr\xFCfungen bestanden.`);
}
