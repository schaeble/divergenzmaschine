// src/text-utils.ts
function clean(s) {
  return (s ?? "").toString().trim().replace(/\s+/g, " ");
}

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
var SP_REL = /^(der|die|das|den|dem|des|deren|dessen|welche[rsmn]?|wo|worin|woran|womit|wovon)\b/i;
var SP_CONJ = /^(als|während|weil|wenn|da|obwohl|nachdem|bevor|sodass|damit|dass|ob|indem|sobald|solange)\b/i;
var SP_PREP = /^(mit|ohne|aus|von|vom|in|im|auf|an|am|für|bei|zu|zum|zur|über|unter|vor|nach|durch|gegen|seit|um|entlang|trotz|wegen|innerhalb|außerhalb|samt|nebst)\b/i;
var SP_ENDS_VERB = /(?:\b(hat|hatte|ist|war|sind|waren|wird|wurde|wurden|kann|konnte|will|wollte|muss|musste|bleibt|blieb|kommt|kam|geht|ging)|\w{2,}(?:t|te|en|st|et))\.?$/i;
function splitSpeakers(who) {
  const parts = (who || "").split(",").map((s) => clean(s)).filter(Boolean);
  if (parts.length <= 1) return parts;
  const isContinuation = (p) => {
    if (SP_CONJ.test(p) || SP_PREP.test(p)) return true;
    if (SP_REL.test(p) && SP_ENDS_VERB.test(p)) return true;
    return false;
  };
  const out = [parts[0]];
  for (let i = 1; i < parts.length; i++) {
    if (isContinuation(parts[i])) out[out.length - 1] += ", " + parts[i];
    else out.push(parts[i]);
  }
  return out;
}

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
var CTX_WHO = WHO_TAGGED.map((e) => e.t);
var CTX_WHERE = WHERE_TAGGED.map((e) => e.t);
var CTX_WHEN = WHEN_TAGGED.map((e) => e.t);
var CTX_WHAT = WHAT_TAGGED.map((e) => e.t);
var WHO_TWISTS = [
  "mit einem geliehenen Namen",
  "ohne Erinnerung an den gestrigen Tag",
  "auf der Flucht vor einem Versprechen",
  "mit zitternden H\xE4nden",
  "kurz vor dem Aufbruch",
  "voller ungestellter Fragen",
  "mit einem fremden Koffer",
  "zwischen zwei Loyalit\xE4ten",
  "mit einer alten Schuld im Gep\xE4ck",
  "ohne Papiere",
  "mit einem zweiten Gesicht",
  "mit einem halb vergessenen Auftrag",
  "im falschen Jahrzehnt geboren",
  "mit geliehener Stimme",
  "mit einer Narbe, die niemand erkl\xE4rt",
  "ohne R\xFCckfahrkarte",
  "mit einem Brief, der nie abgeschickt wurde",
  "unter fremder Aufsicht",
  "mit einem Namen, den zwei Menschen tragen",
  "im letzten Anzug des Vaters"
];
var WHERE_TWISTS = [
  "wo die Uhren falsch gehen",
  "wo niemand nach Namen fragt",
  "wo nachts Licht brennt, obwohl niemand wohnt",
  "wo alle T\xFCren offen stehen",
  "wo der Fluss r\xFCckw\xE4rts zu flie\xDFen scheint",
  "wo man Fremde sofort erkennt",
  "wo ein Zimmer seit Jahren verschlossen ist",
  "wo die Karten nicht stimmen",
  "wo jeder zweite Brief verloren geht",
  "wo das Echo eine Sekunde zu sp\xE4t kommt",
  "wo der Winter nie ganz endet",
  "wo die W\xE4nde d\xFCnner sind, als man denkt",
  "wo die Stra\xDFen keine Namen tragen",
  "wo man den Hafen h\xF6rt, aber nicht sieht",
  "wo jedes Fenster nach Osten zeigt",
  "wo die V\xF6gel nicht landen",
  "wo eine Uhr seit Jahren dieselbe Zeit zeigt",
  "wo der Boden bei Regen nachgibt"
];
var WHEN_TWISTS = [
  "kurz nach der Sperrstunde",
  "in der Nacht der Inventur",
  "am Tag der letzten F\xE4hre",
  "w\xE4hrend eines Stromausfalls",
  "zwischen zwei Glockenschl\xE4gen",
  "am Vorabend einer Abreise",
  "in der Woche der Nebel",
  "als die Zeitungen schwiegen",
  "w\xE4hrend des Jahrmarkts",
  "in der Stunde zwischen Hund und Wolf",
  "kurz bevor die Br\xFCcke gesperrt wird",
  "am Morgen nach dem Fest",
  "in der Nacht der langen Regen",
  "w\xE4hrend die Glocken repariert werden",
  "kurz vor der Zeitumstellung",
  "als die Stra\xDFen leer blieben",
  "in der Woche vor dem Umzug",
  "am Tag, an dem die Post ausblieb"
];
var WHAT_TWISTS = [
  "ohne zu wissen, warum",
  "obwohl alle abraten",
  "zum dritten und letzten Mal",
  "gegen ein altes Versprechen",
  "f\xFCr jemanden, der nie danach gefragt hat",
  "mit den falschen Werkzeugen",
  "unter falschem Namen",
  "bevor es ein anderer tut",
  "aus einem Grund, der erst am Ende z\xE4hlt",
  "heimlich, zwischen zwei Pflichten",
  "und zahlt daf\xFCr einen stillen Preis",
  "als w\xE4re nichts geschehen",
  "mit geliehenem Mut",
  "einen Tag zu sp\xE4t",
  "und nimmt daf\xFCr die Schuld auf sich",
  "ohne Zeugen",
  "w\xE4hrend alle anderen feiern",
  "und kann es hinterher nicht erkl\xE4ren"
];

// ../../tw.ts
var basis = "die Archivarin";
var durch = [];
for (const t of WHO_TWISTS) {
  const s = splitSpeakers(`${basis}, ${t}`);
  if (s.length > 1) durch.push(t);
}
console.log(`WHO_TWISTS: ${WHO_TWISTS.length} \xB7 als zweite Figur missverstanden: ${durch.length}`);
durch.forEach((t) => console.log("   ", t));
console.log("\nCTX_WHO Eintr\xE4ge:", CTX_WHO.length, "| Beispiele:", CTX_WHO.slice(0, 4).join(" \xB7 "));
console.log("WHERE/WHEN/WHAT_TWISTS:", WHERE_TWISTS.length, WHEN_TWISTS.length, WHAT_TWISTS.length);
