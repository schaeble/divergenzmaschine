// src/modes.data.ts
var MODE_DATA = {
  "bureau": {
    "label": "B\xFCrokratischer Horror",
    "nouns": [
      "Antrag",
      "Sachbearbeiter",
      "Stempel",
      "Akte",
      "Frist",
      "Formular",
      "Wartemarke",
      "Kopie",
      "Bescheid",
      "Protokoll"
    ],
    "verbs": [
      "beantragen",
      "stempeln",
      "ablegen",
      "pr\xFCfen",
      "verschieben",
      "archivieren",
      "verweigern",
      "unterschreiben",
      "eintragen",
      "verlangen"
    ],
    "images": [
      "wie ein Stempel auf der Seele",
      "wie Papier, das atmet",
      "wie ein Flur ohne Ende",
      "wie ein Formular, das l\xFCgt"
    ],
    "rules": [
      "Die Frist ist r\xFCckwirkend.",
      "Das Feld muss leer bleiben.",
      "Die Kopie ist das Original."
    ]
  },
  "tech": {
    "label": "Technologische Mystik",
    "nouns": [
      "Signal",
      "Protokoll",
      "Schnittstelle",
      "Sensor",
      "Cache",
      "Port",
      "Terminal",
      "Rauschen",
      "Update",
      "Log"
    ],
    "verbs": [
      "pingen",
      "loggen",
      "cachen",
      "rendern",
      "debuggen",
      "synchronisieren",
      "\xFCberschreiben",
      "parsen",
      "encrypten",
      "deployen"
    ],
    "images": [
      "wie ein Signal im Leeren",
      "wie Rauschen, das Namen formt",
      "wie ein Cache voller W\xE4rme",
      "wie ein Port, der wartet"
    ],
    "rules": [
      "Das System lernt zu schnell.",
      "Die Uhrzeit ist ein Platzhalter.",
      "Ein Backup \xFCberschreibt die Gegenwart."
    ]
  },
  "body": {
    "label": "Intime K\xF6rperwahrnehmung",
    "nouns": [
      "Puls",
      "Atem",
      "Narbe",
      "Kehle",
      "Haut",
      "Schmerz",
      "Zittern",
      "W\xE4rme",
      "K\xE4lte",
      "Blick"
    ],
    "verbs": [
      "atmen",
      "zittern",
      "sp\xFCren",
      "erinnern",
      "greifen",
      "loslassen",
      "wahrnehmen",
      "schmerzen",
      "klopfen",
      "w\xE4rmen"
    ],
    "images": [
      "wie ein Atem, der zu sp\xE4t kommt",
      "wie W\xE4rme ohne Ursache",
      "wie ein Puls, der antwortet",
      "wie K\xE4lte im Knochen"
    ],
    "rules": [
      "Der K\xF6rper wei\xDF es zuerst.",
      "Die Wahrheit sitzt im Hals.",
      "Der Schmerz ist ein Hinweis."
    ]
  },
  "myth": {
    "label": "Mythologischer Alltag",
    "nouns": [
      "F\xE4hrmann",
      "Omen",
      "Faden",
      "Maske",
      "Schrein",
      "Fluch",
      "Segen",
      "Nymphe",
      "Orakel",
      "Bote"
    ],
    "verbs": [
      "weben",
      "opfern",
      "deuten",
      "rufen",
      "wachen",
      "taufen",
      "verf\xFChren",
      "segnen",
      "fordern",
      "erinnern"
    ],
    "images": [
      "wie Ru\xDF auf Gold",
      "wie Wasser, das zuh\xF6rt",
      "wie ein altes Versprechen",
      "wie ein Gott in Zivil"
    ],
    "rules": [
      "Der Ort verlangt eine Gabe.",
      "Der Name ist ein Schl\xFCssel.",
      "Das Zeichen kommt dreimal."
    ]
  },
  "absurd": {
    "label": "Absurd-logische Welt",
    "nouns": [
      "Beweis",
      "Paradoxon",
      "Ausrede",
      "Gabelung",
      "Randnotiz",
      "Handbuch",
      "Einspruch",
      "Punkt",
      "Linie",
      "Hintert\xFCr"
    ],
    "verbs": [
      "widerlegen",
      "umdrehen",
      "vertauschen",
      "behaupten",
      "kollabieren",
      "vereinbaren",
      "winken",
      "klammern",
      "kippen",
      "vereinfachen"
    ],
    "images": [
      "wie ein Witz mit Z\xE4hnen",
      "wie Logik auf Glatteis",
      "wie ein Kreis, der eckig wird",
      "wie eine T\xFCr ohne Wand"
    ],
    "rules": [
      "Alles ist korrekt \u2013 nur in falscher Reihenfolge.",
      "Der Ausgang ist innen.",
      "Du darfst gehen, aber nicht ankommen."
    ]
  },
  "post": {
    "label": "Posthumaner Monolog",
    "nouns": [
      "Instanz",
      "Kollektiv",
      "Backup",
      "Rauschen",
      "Archiv",
      "Knoten",
      "Schnitt",
      "Speicher",
      "Echo",
      "Prozess"
    ],
    "verbs": [
      "persistieren",
      "rekonstruieren",
      "simulieren",
      "abgleichen",
      "verzweigen",
      "entkoppeln",
      "konvergieren",
      "\xFCberschreiben",
      "erscheinen",
      "l\xF6schen"
    ],
    "images": [
      "wie ein Ged\xE4chtnis ohne K\xF6rper",
      "wie Stimmen im Datennebel",
      "wie eine Erinnerung aus Metall",
      "wie W\xE4rme in Zahlen"
    ],
    "rules": [
      "Ich bin nicht ich, nur Version.",
      "Die Datei ist \xE4lter als du.",
      "Ein Satz wurde entfernt \u2013 und wirkt nach."
    ]
  }
};

// src/text-utils.ts
function clean(s) {
  return (s ?? "").toString().trim().replace(/\s+/g, " ");
}
function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}
function pickSane(arr, minWords = 2) {
  const list = Array.isArray(arr) ? arr : [];
  const ok = list.filter(
    (x) => String(x ?? "").trim().split(/\s+/).filter(Boolean).length >= minWords
  );
  return (ok.length ? pick(ok) : pick(list)) ?? "";
}
function chance(p) {
  return Math.random() < p;
}
function ensurePunct(s) {
  s = clean(s);
  if (!s) return "";
  return /[.!?…]$/.test(s) ? s : s + ".";
}
function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function splitSentences(txt) {
  return txt.replace(/\s+/g, " ").trim().split(/(?<=[.!?…])\s+/).filter(Boolean);
}

// src/generation/nouns.data.ts
var NOUN_GENDER = {
  "abend": "m",
  "absatz": "m",
  "acker": "m",
  "ader": "f",
  "akku": "m",
  "akte": "f",
  "allee": "f",
  "alptraum": "m",
  "angst": "f",
  "anker": "m",
  "antwort": "f",
  "apfel": "m",
  "archiv": "n",
  "arm": "m",
  "arzt": "m",
  "ast": "m",
  "atem": "m",
  "auge": "n",
  "augenblick": "m",
  "ausgang": "m",
  "ausrede": "f",
  "ausweis": "m",
  "baby": "n",
  "bach": "m",
  "ball": "m",
  "ballade": "f",
  "band": "n",
  "bauch": "m",
  "bauer": "m",
  "baum": "m",
  "becher": "m",
  "beil": "n",
  "bein": "n",
  "benachrichtigung": "f",
  "berg": "m",
  "bett": "n",
  "bibliothek": "f",
  "biene": "f",
  "bild": "n",
  "bildschirm": "m",
  "birne": "f",
  "blatt": "n",
  "blei": "n",
  "blick": "m",
  "blitz": "m",
  "blume": "f",
  "bluse": "f",
  "bl\xFCte": "f",
  "boden": "m",
  "bohne": "f",
  "boot": "n",
  "botschaft": "f",
  "braten": "m",
  "braue": "f",
  "brett": "n",
  "brief": "m",
  "brille": "f",
  "brot": "n",
  "bruch": "m",
  "bruder": "m",
  "brunnen": "m",
  "brust": "f",
  "br\xFCcke": "f",
  "buch": "n",
  "buchstabe": "m",
  "bucht": "f",
  "bug": "m",
  "burg": "f",
  "bus": "m",
  "busch": "m",
  "butter": "f",
  "b\xE4r": "m",
  "computer": "m",
  "dach": "n",
  "dachboden": "m",
  "dame": "f",
  "damm": "m",
  "datei": "f",
  "datum": "n",
  "daumen": "m",
  "deck": "n",
  "decke": "f",
  "dichter": "m",
  "dieb": "m",
  "dokument": "n",
  "donner": "m",
  "dorf": "n",
  "dorn": "m",
  "draht": "m",
  "druck": "m",
  "durchsage": "f",
  "d\xE4mmerung": "f",
  "ebbe": "f",
  "ecke": "f",
  "ehre": "f",
  "ei": "n",
  "einspruch": "m",
  "eis": "n",
  "eisen": "n",
  "elch": "m",
  "elend": "n",
  "ellbogen": "m",
  "engel": "m",
  "enkel": "m",
  "ente": "f",
  "erbse": "f",
  "erde": "f",
  "erinnerung": "f",
  "eule": "f",
  "ewigkeit": "f",
  "fabel": "f",
  "fabrik": "f",
  "faden": "m",
  "fahrt": "f",
  "falte": "f",
  "fass": "n",
  "feder": "f",
  "fee": "f",
  "fehlercode": "m",
  "feile": "f",
  "feind": "m",
  "feld": "n",
  "fell": "n",
  "fels": "m",
  "felsen": "m",
  "fenster": "n",
  "ferkel": "n",
  "ferse": "f",
  "festung": "f",
  "feuer": "n",
  "finger": "m",
  "fisch": "m",
  "fischer": "m",
  "flasche": "f",
  "fleisch": "n",
  "fliege": "f",
  "flo\xDF": "n",
  "flucht": "f",
  "flur": "m",
  "fluss": "m",
  "flut": "f",
  "fl\xF6te": "f",
  "fl\xFCstern": "n",
  "formular": "n",
  "foto": "n",
  "frage": "f",
  "frau": "f",
  "freude": "f",
  "freund": "m",
  "frost": "m",
  "fr\xFChling": "m",
  "fuchs": "m",
  "fundament": "n",
  "funke": "m",
  "furcht": "f",
  "fu\xDF": "m",
  "f\xFCrst": "m",
  "gabel": "f",
  "gabelung": "f",
  "gang": "m",
  "gans": "f",
  "garn": "n",
  "garten": "m",
  "gasse": "f",
  "gast": "m",
  "gebirge": "n",
  "gedanke": "m",
  "gedicht": "n",
  "gefahr": "f",
  "gegenwart": "f",
  "geheimnis": "n",
  "gehirn": "n",
  "geige": "f",
  "geist": "m",
  "gemach": "n",
  "gem\xE4lde": "n",
  "gem\xFCse": "n",
  "ger\xE4t": "n",
  "ger\xE4usch": "n",
  "ger\xFCst": "n",
  "geschichte": "f",
  "geschmack": "m",
  "gesicht": "n",
  "geweih": "n",
  "gewissen": "n",
  "gew\xF6lbe": "n",
  "gier": "f",
  "gift": "n",
  "gipfel": "m",
  "gitter": "n",
  "glas": "n",
  "glaube": "m",
  "gletscher": "m",
  "glocke": "f",
  "gl\xFCck": "n",
  "gold": "n",
  "gott": "m",
  "grab": "n",
  "graben": "m",
  "grotte": "f",
  "gurke": "f",
  "g\xF6ttin": "f",
  "g\xFCrtel": "m",
  "haar": "n",
  "hafen": "m",
  "hagel": "m",
  "hahn": "m",
  "hain": "m",
  "hall": "m",
  "halle": "f",
  "hals": "m",
  "hammer": "m",
  "hand": "f",
  "handbuch": "n",
  "handschuh": "m",
  "harfe": "f",
  "hase": "m",
  "hass": "m",
  "haus": "n",
  "haut": "f",
  "hecke": "f",
  "heft": "n",
  "held": "m",
  "hemd": "n",
  "henne": "f",
  "herbst": "m",
  "herd": "m",
  "herr": "m",
  "herz": "n",
  "hexe": "f",
  "himmel": "m",
  "hirn": "n",
  "hirsch": "m",
  "hof": "m",
  "hoffnung": "f",
  "holz": "n",
  "honig": "m",
  "horn": "n",
  "hose": "f",
  "huhn": "n",
  "hund": "m",
  "hut": "m",
  "h\xF6hle": "f",
  "h\xFCfte": "f",
  "h\xFCgel": "m",
  "igel": "m",
  "index": "m",
  "insel": "f",
  "instrument": "n",
  "jacke": "f",
  "junge": "m",
  "j\xE4ger": "m",
  "kabel": "n",
  "kaffee": "m",
  "kai": "m",
  "kaiser": "m",
  "kalb": "n",
  "kamin": "m",
  "kammer": "f",
  "kanal": "m",
  "kaninchen": "n",
  "kanne": "f",
  "kapelle": "f",
  "karotte": "f",
  "karte": "f",
  "kartoffel": "f",
  "katze": "f",
  "keller": "m",
  "kerze": "f",
  "kette": "f",
  "kiefer": "m",
  "kiel": "m",
  "kies": "m",
  "kind": "n",
  "kinn": "n",
  "kirche": "f",
  "kirsche": "f",
  "klang": "m",
  "klavier": "n",
  "kleid": "n",
  "klinge": "f",
  "klippe": "f",
  "klopfen": "n",
  "knabe": "m",
  "knie": "n",
  "knochen": "m",
  "knopf": "m",
  "knospe": "f",
  "knoten": "m",
  "kn\xE4uel": "n",
  "kn\xF6chel": "m",
  "koffer": "m",
  "kollektiv": "n",
  "kompass": "m",
  "kopf": "m",
  "kopie": "f",
  "korb": "m",
  "korken": "m",
  "korn": "n",
  "kraft": "f",
  "krater": "m",
  "kreis": "m",
  "kreuz": "n",
  "kreuzung": "f",
  "kribbeln": "n",
  "krieger": "m",
  "krone": "f",
  "krug": "m",
  "kr\xE4he": "f",
  "kuchen": "m",
  "kuh": "f",
  "kupfer": "n",
  "k\xE4fer": "m",
  "k\xE4se": "m",
  "k\xF6nig": "m",
  "k\xF6nigin": "f",
  "k\xF6rper": "m",
  "k\xFCche": "f",
  "k\xFCken": "n",
  "lagune": "f",
  "lamm": "n",
  "lampe": "f",
  "land": "n",
  "laub": "n",
  "leder": "n",
  "legende": "f",
  "lehrer": "m",
  "leid": "n",
  "leine": "f",
  "leuchtturm": "m",
  "licht": "n",
  "lichtstreifen": "m",
  "liebe": "f",
  "lied": "n",
  "lilie": "f",
  "lippe": "f",
  "loch": "n",
  "locke": "f",
  "logfile": "n",
  "luft": "f",
  "lust": "f",
  "l\xE4cheln": "n",
  "l\xE4rm": "m",
  "l\xF6ffel": "m",
  "l\xF6we": "m",
  "l\xFCge": "f",
  "macht": "f",
  "magen": "m",
  "maler": "m",
  "mann": "m",
  "mantel": "m",
  "mappe": "f",
  "marmelade": "f",
  "masche": "f",
  "mast": "m",
  "mauer": "f",
  "maus": "f",
  "meer": "n",
  "mehl": "n",
  "melodie": "f",
  "messer": "n",
  "metall": "n",
  "milch": "f",
  "minute": "f",
  "mitleid": "n",
  "mittag": "m",
  "mitternacht": "f",
  "modell": "n",
  "moment": "m",
  "monat": "m",
  "mond": "m",
  "moor": "n",
  "morgen": "m",
  "moschee": "f",
  "motor": "m",
  "mus": "n",
  "muschel": "f",
  "muskel": "m",
  "muster": "n",
  "mut": "m",
  "mutter": "f",
  "m\xE4dchen": "n",
  "m\xE4hne": "f",
  "m\xF6hre": "f",
  "m\xF6nch": "m",
  "m\xF6rder": "m",
  "m\xF6we": "f",
  "m\xFCcke": "f",
  "m\xFChle": "f",
  "m\xFCller": "m",
  "m\xFCnze": "f",
  "m\xFCtze": "f",
  "nachbar": "m",
  "nachmittag": "m",
  "nachricht": "f",
  "nacht": "f",
  "nachtigall": "f",
  "nacken": "m",
  "nadel": "f",
  "nagel": "m",
  "naht": "f",
  "name": "m",
  "napf": "m",
  "narbe": "f",
  "nase": "f",
  "nebel": "m",
  "neffe": "m",
  "neid": "m",
  "nelke": "f",
  "nest": "n",
  "netz": "n",
  "nonne": "f",
  "note": "f",
  "notizbuch": "n",
  "nuss": "f",
  "obst": "n",
  "ofen": "m",
  "ohr": "n",
  "oma": "f",
  "onkel": "m",
  "orange": "f",
  "orgel": "f",
  "papier": "n",
  "perle": "f",
  "pfad": "m",
  "pfeffer": "m",
  "pferd": "n",
  "pfirsich": "m",
  "pflaume": "f",
  "pf\xFCtze": "f",
  "pilz": "m",
  "ping": "m",
  "port": "m",
  "portal": "n",
  "priester": "m",
  "protokoll": "n",
  "prozess": "m",
  "puls": "m",
  "punkt": "m",
  "qualle": "f",
  "quelle": "f",
  "rad": "n",
  "rand": "m",
  "randnotiz": "f",
  "ranke": "f",
  "ratte": "f",
  "rauch": "m",
  "regal": "n",
  "regen": "m",
  "register": "n",
  "reh": "n",
  "reich": "n",
  "reise": "f",
  "rei\xDFverschluss": "m",
  "rettung": "f",
  "richter": "m",
  "ring": "m",
  "rippe": "f",
  "riss": "m",
  "ritter": "m",
  "rohr": "n",
  "roman": "m",
  "rose": "f",
  "ruder": "n",
  "ruine": "f",
  "rumpf": "m",
  "r\xE4tsel": "n",
  "r\xFCcken": "m",
  "saal": "m",
  "sack": "m",
  "saft": "m",
  "sage": "f",
  "sahne": "f",
  "saite": "f",
  "salat": "m",
  "salz": "n",
  "sand": "m",
  "satz": "m",
  "saum": "m",
  "savanne": "f",
  "schacht": "m",
  "schaf": "n",
  "schalter": "m",
  "scham": "f",
  "schatten": "m",
  "schere": "f",
  "schicksal": "n",
  "schild": "n",
  "schirm": "m",
  "schlaf": "m",
  "schlamm": "m",
  "schlange": "f",
  "schleife": "f",
  "schloss": "n",
  "schlucht": "f",
  "schl\xFCssel": "m",
  "schmerz": "m",
  "schmied": "m",
  "schmiede": "f",
  "schnecke": "f",
  "schnee": "m",
  "schnur": "f",
  "schokolade": "f",
  "schrank": "m",
  "schrei": "m",
  "schrift": "f",
  "schuh": "m",
  "schule": "f",
  "schulter": "f",
  "schwamm": "m",
  "schwein": "n",
  "schwelle": "f",
  "schwert": "n",
  "schwester": "f",
  "schw\xE4che": "f",
  "sch\xE4del": "m",
  "sch\xFCssel": "f",
  "see": "m",
  "seele": "f",
  "segel": "n",
  "sehne": "f",
  "sehnsucht": "f",
  "seil": "n",
  "seite": "f",
  "sekunde": "f",
  "senf": "m",
  "sensor": "m",
  "sessel": "m",
  "siegel": "n",
  "silbe": "f",
  "silber": "n",
  "sinn": "m",
  "sirene": "f",
  "socke": "f",
  "sofa": "n",
  "sohn": "m",
  "soldat": "m",
  "sommer": "m",
  "sonne": "f",
  "so\xDFe": "f",
  "spalt": "m",
  "speicher": "m",
  "spiegel": "m",
  "spiel": "n",
  "spinne": "f",
  "sprache": "f",
  "sprung": "m",
  "spur": "f",
  "stadt": "f",
  "stamm": "m",
  "staub": "m",
  "steg": "m",
  "steig": "m",
  "stein": "m",
  "stempel": "m",
  "stempelger\xE4usch": "n",
  "steppe": "f",
  "stern": "m",
  "stiefel": "m",
  "stier": "m",
  "stille": "f",
  "stimme": "f",
  "stirn": "f",
  "stock": "m",
  "stolz": "m",
  "strand": "m",
  "strauch": "m",
  "stra\xDFe": "f",
  "strich": "m",
  "strom": "m",
  "strophe": "f",
  "str\xF6mung": "f",
  "stube": "f",
  "stufe": "f",
  "stuhl": "m",
  "stunde": "f",
  "sturm": "m",
  "st\xE4rke": "f",
  "st\xFCck": "n",
  "sumpf": "m",
  "suppe": "f",
  "symbol": "n",
  "s\xE4ge": "f",
  "s\xE4ule": "f",
  "tag": "m",
  "tal": "n",
  "tante": "f",
  "tasche": "f",
  "tasse": "f",
  "taube": "f",
  "tee": "m",
  "teich": "m",
  "teller": "m",
  "teppich": "m",
  "terminal": "n",
  "teufel": "m",
  "ticket": "n",
  "tier": "n",
  "tiger": "m",
  "tisch": "m",
  "tochter": "f",
  "tod": "m",
  "tomate": "f",
  "ton": "m",
  "topf": "m",
  "tor": "n",
  "torte": "f",
  "traube": "f",
  "trauer": "f",
  "traum": "m",
  "treppe": "f",
  "treue": "f",
  "trommel": "f",
  "tr\xE4ne": "f",
  "tuch": "n",
  "tulpe": "f",
  "tunnel": "m",
  "turm": "m",
  "t\xFCr": "f",
  "ufer": "n",
  "uhr": "f",
  "umriss": "m",
  "ungl\xFCck": "n",
  "unterschrift": "f",
  "vater": "m",
  "vergangenheit": "f",
  "vers": "m",
  "verstand": "m",
  "vertrauen": "n",
  "vogel": "m",
  "vorhang": "m",
  "vulkan": "m",
  "wachs": "n",
  "wagen": "m",
  "wahrheit": "f",
  "wald": "m",
  "wand": "f",
  "wanderung": "f",
  "wange": "f",
  "warnung": "f",
  "wartemarke": "f",
  "wasser": "n",
  "weg": "m",
  "weide": "f",
  "wein": "m",
  "welle": "f",
  "werkstatt": "f",
  "werkzeug": "n",
  "wespe": "f",
  "wiese": "f",
  "wille": "m",
  "wimper": "f",
  "wind": "m",
  "winter": "m",
  "woche": "f",
  "wolf": "m",
  "wolke": "f",
  "wort": "n",
  "wrack": "n",
  "wunde": "f",
  "wunder": "n",
  "wurm": "m",
  "wut": "f",
  "w\xFCrfel": "m",
  "w\xFCste": "f",
  "zahn": "m",
  "zange": "f",
  "zaun": "m",
  "zeh": "m",
  "zeichen": "n",
  "zeile": "f",
  "zeit": "f",
  "zelt": "n",
  "zimmer": "n",
  "zitrone": "f",
  "zorn": "m",
  "zucker": "m",
  "zug": "m",
  "zukunft": "f",
  "zunge": "f",
  "zweifel": "m",
  "zweig": "m",
  "zwiebel": "f",
  "\xE4rztin": "f",
  "\xF6l": "n",
  "grund": "m",
  "hintergrund": "m",
  "abgrund": "m",
  "untergrund": "m",
  "teleskop": "n",
  "antenne": "f",
  "spektrometer": "n",
  "detektor": "m",
  "rechentafel": "f",
  "photoplatte": "f",
  "diagramm": "n",
  "konstante": "f",
  "ausdehnung": "f",
  "rauschen": "n",
  "abdruck": "m",
  "skala": "f",
  "gleichung": "f",
  "messung": "f",
  "poller": "m",
  "trillerpfeife": "f",
  "seesack": "m",
  "frachtbrief": "m",
  "ladeliste": "f",
  "kontor": "n",
  "kohleneimer": "m",
  "kontobuch": "n",
  "schuldschein": "m",
  "federkiel": "m",
  "waisenjunge": "m",
  "vormund": "m",
  "kaminfeuer": "n",
  "siegelring": "m",
  "wetterfahne": "f",
  "zauberbesen": "m",
  "farbenscheibe": "f",
  "waldhorn": "n",
  "wanderstab": "m",
  "medaillon": "n",
  "notenblatt": "n",
  "fingerhut": "m",
  "stecknadel": "f",
  "schneiderpuppe": "f",
  "perlmuttknopf": "m",
  "kleidersack": "m",
  "ma\xDFband": "n",
  "seidenfaden": "m"
};

// src/generation/cooldown.ts
var recent = {};
var KEEP = 5;
function pickFresh(key, opts) {
  if (!opts.length) return opts[0];
  const seen = recent[key] || (recent[key] = []);
  const fresh = opts.filter((o) => !seen.includes(o));
  const choice = fresh.length ? pick(fresh) : pick(opts);
  seen.push(choice);
  while (seen.length > Math.min(KEEP, opts.length - 1)) seen.shift();
  return choice;
}
function pickFreshIndex(key, n) {
  if (n <= 1) return 0;
  const idxs = Array.from({ length: n }, (_, i) => String(i));
  return Number(pickFresh(key, idxs));
}
var recentMarkov = [];
var MK_KEEP = 24;
var mkNorm = (s) => s.toLowerCase().replace(/[^a-zäöüß ]/g, "").replace(/\s+/g, " ").trim();
function markovSeenRecently(s) {
  const n = mkNorm(s);
  return n.length > 0 && recentMarkov.includes(n);
}
function noteMarkov(s) {
  const n = mkNorm(s);
  if (!n) return;
  recentMarkov.push(n);
  while (recentMarkov.length > MK_KEEP) recentMarkov.shift();
}

// src/generation/beats.ts
function cap(s) {
  s = (s ?? "").toString();
  return s ? s[0].toUpperCase() + s.slice(1) : s;
}
function isFragmentSentence(s) {
  const n = clean(s).split(/\s+/).filter(Boolean).length;
  return n > 0 && n <= 3;
}
var CLAUSE_VERBS = /* @__PURE__ */ new Set(["antworten", "antwortet", "atmen", "atmet", "bebt", "begann", "beginnen", "beginnt", "beobachten", "beobachtet", "ber\xFChren", "ber\xFChrt", "bin", "bist", "bleiben", "bleibt", "blieb", "blitzt", "brannte", "brennen", "brennt", "brummt", "br\xFCllen", "br\xFCllt", "dachte", "darf", "denken", "denkt", "donnert", "drehen", "dreht", "drehte", "durfte", "d\xFCrfen", "enden", "endet", "endete", "erinnern", "erinnert", "fahren", "fallen", "fand", "fiel", "fielen", "finden", "findet", "fliegen", "fliegt", "fliehen", "flieht", "flie\xDFen", "flie\xDFt", "flog", "floss", "fl\xFCstern", "fl\xFCstert", "folgen", "folgt", "folgte", "formen", "formt", "fragen", "fragt", "fragte", "fuhr", "f\xE4hrt", "f\xE4llt", "f\xFChlen", "f\xFChlt", "f\xFChren", "f\xFChrt", "f\xFChrte", "f\xFCrchten", "f\xFCrchtet", "gab", "gaben", "galt", "geben", "gehen", "geht", "gelten", "geschah", "geschehen", "geschieht", "gibt", "gilt", "ging", "gingen", "glauben", "glaubt", "haben", "habt", "halten", "hat", "hatte", "hatten", "hielt", "hielten", "hoffen", "hofft", "h\xE4lt", "h\xE4tte", "h\xF6ren", "h\xF6rt", "h\xF6rte", "ist", "jagen", "jagt", "kam", "kamen", "kann", "kannte", "kennen", "kennt", "kippen", "kippt", "knistert", "kommen", "kommt", "konnte", "konnten", "kreisen", "kreist", "k\xF6nnen", "lachen", "lacht", "lag", "lagen", "laufen", "leuchten", "leuchtet", "lief", "liefen", "liegen", "liegt", "l\xE4uft", "l\xF6schen", "l\xF6scht", "machen", "macht", "machte", "machten", "mag", "muss", "musste", "mussten", "m\xF6chte", "m\xF6chten", "m\xF6gen", "m\xFCssen", "nahm", "nahmen", "nehmen", "nimmt", "passieren", "passiert", "passierte", "planen", "plant", "pulsiert", "raschelt", "reagieren", "reagiert", "regnet", "retten", "rettet", "rief", "rinnt", "riskiert", "rufen", "ruft", "sah", "sahen", "sang", "sank", "sa\xDF", "schlafen", "schlief", "schlie\xDFen", "schlie\xDFt", "schloss", "schl\xE4ft", "schmelzen", "schmilzt", "schneit", "schreien", "schreit", "schrie", "schweigen", "schweigt", "schwieg", "sehen", "seid", "sieht", "sind", "singen", "singt", "sinken", "sinkt", "sitzen", "sitzt", "soll", "sollen", "sollte", "sprach", "sprachen", "sprang", "sprechen", "spricht", "springen", "springt", "stand", "standen", "stehen", "steht", "steigen", "steigt", "stieg", "suchen", "sucht", "suchte", "summt", "tanzen", "tanzt", "tat", "taten", "ticken", "tickt", "tragen", "tropft", "trug", "trugen", "tr\xE4gt", "tr\xE4umen", "tr\xE4umt", "tun", "tut", "unterschreiben", "unterschreibt", "verfolgen", "verfolgt", "vergessen", "vergisst", "verlangen", "verlangt", "verraten", "verr\xE4t", "ver\xE4ndern", "ver\xE4ndert", "vibriert", "wachsen", "wagen", "wagt", "wandern", "wandert", "war", "waren", "warten", "wartet", "wartete", "wechseln", "wechselt", "weigern", "weigert", "weinen", "weint", "wei\xDF", "werden", "werdet", "wiederholen", "wiederholt", "will", "wird", "wirst", "wissen", "wollen", "wollte", "wollten", "wurde", "wurden", "wusste", "w\xE4chst", "w\xE4re", "w\xE4ren", "w\xFCrde", "w\xFCrden", "zeigen", "zeigt", "zeigte", "zerbrechen", "zerbricht", "ziehen", "zieht", "zittern", "zittert", "zog", "zogen", "\xF6ffnen", "\xF6ffnet", "\xFCberschreiben", "\xFCberschreibt"]);
var CLAUSE_STOP = /* @__PURE__ */ new Set([
  "der",
  "die",
  "das",
  "den",
  "dem",
  "des",
  "ein",
  "eine",
  "einen",
  "einem",
  "einer",
  "eines",
  "kein",
  "keine",
  "keinen",
  "keinem",
  "keiner",
  "mein",
  "meine",
  "meinen",
  "dein",
  "deine",
  "sein",
  "seine",
  "seinen",
  "ihr",
  "ihre",
  "ihren",
  "unser",
  "unsere",
  "euer",
  "eure",
  "dieser",
  "diese",
  "dieses",
  "diesen",
  "diesem",
  "jener",
  "jene",
  "jenes",
  "jeder",
  "jede",
  "jedes",
  "jeden",
  "jedem",
  "manch",
  "manche",
  "alle",
  "allen",
  "beide",
  "beiden",
  "viele",
  "vielen",
  "solche",
  "solchen",
  "mit",
  "ohne",
  "aus",
  "von",
  "vom",
  "in",
  "im",
  "auf",
  "an",
  "am",
  "f\xFCr",
  "bei",
  "zu",
  "zum",
  "zur",
  "\xFCber",
  "unter",
  "vor",
  "nach",
  "durch",
  "gegen",
  "seit",
  "um",
  "neben",
  "zwischen",
  "hinter",
  "wegen",
  "trotz",
  "w\xE4hrend",
  "entlang",
  "und",
  "oder",
  "aber",
  "denn",
  "sondern",
  "nicht",
  "jetzt",
  "fast",
  "erst",
  "sonst",
  "selbst",
  "meist",
  "dennoch",
  "trotzdem"
]);
var CLAUSE_PRON = /* @__PURE__ */ new Set(["ich", "du", "er", "sie", "es", "wir", "man", "jemand", "niemand", "etwas", "nichts", "wer", "alles"]);
function mainHasFiniteVerb(part) {
  const toks = part.trim().split(/\s+/);
  let sawSubject = false;
  for (let i = 0; i < toks.length; i++) {
    const raw = toks[i];
    const lower = raw.toLowerCase().replace(/[^a-zäöüß]/g, "");
    if (i > 0 && sawSubject && /^[a-zäöüß]/.test(raw) && lower.length >= 3 && !CLAUSE_STOP.has(lower)) {
      if (CLAUSE_VERBS.has(lower)) return true;
      if (/iert$/.test(lower)) return true;
      if (/en$/.test(lower)) {
        const next = toks[i + 1];
        if (!next || /^[a-zäöüß]/.test(next)) return true;
      }
    }
    if (i > 0 && /^[A-ZÄÖÜ]/.test(raw) || CLAUSE_PRON.has(lower)) sawSubject = true;
  }
  return false;
}
function looksLikeClausePhrase(phrase) {
  const s = clean(phrase);
  if (!s) return false;
  if (/[.!?]$/.test(s)) return true;
  const mainPart = (s.split(",")[0] || s).trim();
  return mainHasFiniteVerb(mainPart);
}
function chooseInsertPos(sentences) {
  if (!sentences || sentences.length < 2) return -1;
  const candidates = [];
  for (let pos = 1; pos <= sentences.length; pos++) {
    const prev = sentences[pos - 1];
    const next = sentences[pos];
    if (isFragmentSentence(prev)) continue;
    if (next !== void 0 && isFragmentSentence(next)) continue;
    const w = clean(prev).split(/\s+/).filter(Boolean).length;
    candidates.push({ pos, weight: Math.max(1, w - 4) });
  }
  if (!candidates.length) return -1;
  let sum = 0;
  for (const c of candidates) sum += c.weight;
  let r = Math.random() * sum;
  for (const c of candidates) {
    r -= c.weight;
    if (r <= 0) return c.pos;
  }
  return candidates[candidates.length - 1].pos;
}
var BEAT_CONNECTORS = ["Kurz darauf", "Gleichzeitig", "Wenig sp\xE4ter", "Im selben Atemzug", "Noch am selben Ort"];
function joinBeats(beats, P) {
  const parts = beats.map((b) => ensurePunct(clean(b))).filter(Boolean);
  for (let i = 1; i < parts.length; i++) {
    const prev = (parts[i - 1].split(/\s+/)[0] || "").toLowerCase();
    const cur = (parts[i].split(/\s+/)[0] || "").toLowerCase();
    if (prev === cur && cur === "und") {
      parts[i] = cap(parts[i].replace(/^Und\s+/i, ""));
    } else if (prev === cur && cur === "dann") {
      parts[i] = parts[i].replace(/^Dann\b/i, pick(["Danach", "Kurz darauf", "Sp\xE4ter"]));
    }
  }
  if (P && parts.length >= 4 && chance(0.6)) {
    const idx = 1 + Math.floor(Math.random() * (parts.length - 2));
    const m = new RegExp(`^${escapeRegExp(P)}\\s+([a-z\xE4\xF6\xFC\xDF]+)\\s+([\\s\\S]+)$`).exec(parts[idx]);
    if (m) parts[idx] = `${pick(BEAT_CONNECTORS)} ${m[1]} ${P} ${m[2]}`;
  }
  return parts.join(" ");
}
function frameTurn(turn) {
  const t = clean(turn).replace(/[.!?…]+$/, "");
  const frames = [
    `Dann kippt es: ${t}.`,
    `Dann kippt es \u2014 ${t}.`,
    `Es braucht nur einen Atemzug, und ${t}.`,
    `Erst ein Riss, kaum merklich, und ${t}.`,
    `Und dann, ohne Vorwarnung: ${t}.`,
    `Etwas gibt nach \u2014 ${t}.`,
    `Kaum ausgesprochen, ${t}.`,
    `Dann, unvermittelt: ${t}.`
  ];
  return frames[pickFreshIndex("frameTurn", frames.length)];
}
function reframeStake(stake) {
  const m = /^Der Einsatz ist\s+(.+?)[.!?…]*$/i.exec(clean(stake));
  if (!m) return stake;
  const core = m[1];
  const frames = [`Der Einsatz ist ${core}.`, `Es geht um ${core}.`, `Alles dreht sich um ${core}.`, `Was z\xE4hlt, ist ${core}.`];
  if (!/[:,]/.test(core)) {
    frames.push(`Auf dem Spiel steht ${core}.`);
    frames.push(`${cap(core)} steht auf dem Spiel.`);
    frames.push(`Am Ende bleibt nur ${core}.`);
    frames.push(`Verlieren hie\xDFe: ${core}.`);
  }
  return frames[pickFreshIndex("stake", frames.length)];
}
function weaveMotif(text, motif) {
  if (!motif) return text;
  const motifLine = looksLikeClausePhrase(motif) ? ensurePunct(cap(clean(motif))) : ensurePunct(`Dabei: ${motif}`);
  const s = splitSentences(text);
  if (s.length < 2) return text + " " + motifLine;
  let pos = chooseInsertPos(s);
  if (pos < 0) pos = Math.min(s.length - 1, Math.max(1, Math.floor(s.length * 0.55)));
  s.splice(pos, 0, motifLine);
  return s.join(" ");
}
function randomFragmentTime() {
  const h = pick([23, 0, 1, 2, 3, 4, 5]);
  const m = Math.floor(Math.random() * 60);
  return String(h).padStart(2, "0") + ":" + String(m).padStart(2, "0");
}
function insertToneFlavor(text, line) {
  const paras = text.split(/\n\n+/);
  let target = 0;
  for (let i = 1; i < paras.length; i++) if (paras[i].length > paras[target].length) target = i;
  const sentences = splitSentences(paras[target]);
  if (sentences.length < 2) {
    paras[target] = (paras[target] + " " + line).trim();
    return paras.join("\n\n");
  }
  let idx = chooseInsertPos(sentences);
  if (idx < 0) idx = sentences.length;
  sentences.splice(idx, 0, line);
  paras[target] = sentences.join(" ");
  return paras.join("\n\n");
}
function weaveCast(text, _P, cast) {
  const others = (cast || []).slice(1).map((c) => clean(c)).filter(Boolean);
  if (!others.length) return text;
  const nm = (n) => (n.split(",")[0] || n).trim();
  const soloVerbs = ["steht daneben und schweigt", "wartet", "sieht zu", "z\xF6gert", "sagt nichts", "nickt kaum", "atmet flach", "tritt einen Schritt zur\xFCck", "h\xE4lt sich zur\xFCck"];
  const soloWants = ["das Gegenteil", "mehr", "weg", "bleiben", "die Wahrheit", "nichts davon"];
  const beats = [];
  others.slice(0, 2).map(nm).forEach((who) => {
    beats.push(chance(0.5) ? `${who} ${pick(soloVerbs)}.` : `${who} will ${pick(soloWants)}.`);
  });
  if (chance(0.7)) {
    beats.push(pick([
      `Keiner von ihnen ${pick(["spricht zuerst", "weicht aus", "sagt es laut"])}.`,
      `Zwischen ihnen ${pick(["bleibt ein Satz offen", "spannt sich die Luft", "steht etwas Ungesagtes"])}.`
    ]));
  }
  const rest = others.slice(2).map(nm);
  if (rest.length) {
    const grp = rest.length === 1 ? rest[0] : rest.slice(0, -1).join(", ") + " und " + rest[rest.length - 1];
    const v = rest.length === 1 ? pick(["ist dabei", "kommt dazu", "h\xE4lt sich zur\xFCck"]) : pick(["sind dabei", "kommen dazu", "halten sich zur\xFCck"]);
    beats.push(`Auch ${grp} ${v}.`);
  }
  for (let i = beats.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [beats[i], beats[j]] = [beats[j], beats[i]];
  }
  const sent = splitSentences(text);
  for (const b of beats) {
    const line = ensurePunct(cap(clean(b)));
    if (sent.length < 2) {
      sent.push(line);
      continue;
    }
    let pos = chooseInsertPos(sent);
    if (pos < 0) pos = Math.min(sent.length, Math.max(1, Math.floor(sent.length * 0.5)));
    sent.splice(pos, 0, line);
  }
  return sent.join(" ");
}

// src/generation/declension.ts
function adjustAdjectiveEnding(adj, gender, targetCase) {
  if (targetCase === "nom") return adj;
  const stem = adj.replace(/(es|er|e)$/, "");
  if (targetCase === "dat") return stem + "en";
  if (targetCase === "acc" && gender === "m") return stem + "en";
  return adj;
}
function guessGender(noun) {
  const w = (noun || "").toLowerCase().replace(/[^a-zäöüß]/g, "");
  const known = NOUN_GENDER[w];
  if (known === "m" || known === "f" || known === "n") return known;
  let best = "";
  for (const k in NOUN_GENDER) {
    if (k.length >= 3 && w.length >= k.length + 2 && w.endsWith(k) && k.length > best.length) best = k;
  }
  if (best) return NOUN_GENDER[best];
  if (/(ung|heit|keit|schaft|tät|ion|ik|enz|anz|ei|ade|age|üre|itis|ur)$/.test(w)) return "f";
  if (/(chen|lein|ment|tum|um|nis|ma)$/.test(w)) return "n";
  if (/(ling|ismus|ant|ent|ist|eur|or|ich|ig|ast)$/.test(w)) return "m";
  if (/er$/.test(w)) return "m";
  return void 0;
}
function ensureArticle(phrase) {
  const s = clean(phrase);
  if (/^(ein|eine|einen|einem|einer|eines|der|die|das|den|dem|des|kein|keine|mein|dein|sein|ihr|unser)\b/i.test(s)) return s;
  const words = s.split(" ");
  if (words.length > 5) return s;
  let nounIdx = words.findIndex((w) => /^[A-ZÄÖÜ]/.test(w));
  if (nounIdx === -1) return s;
  if (nounIdx + 1 < words.length && /^[A-ZÄÖÜ]/.test(words[nounIdx + 1]) && /(e|er|es|en|em|te|ne)$/.test(words[nounIdx])) {
    words[nounIdx] = words[nounIdx].charAt(0).toLowerCase() + words[nounIdx].slice(1);
    nounIdx++;
  }
  const g = guessGender(words[nounIdx].replace(/[^A-Za-zÄÖÜäöüß]/g, ""));
  if (!g) return words.join(" ");
  return `${g === "f" ? "eine" : "ein"} ${words.join(" ")}`;
}
function declineHookPhrase(phrase, targetCase) {
  const s = clean(phrase);
  const m = s.match(/^(ein|eine)\s+(.*)$/i);
  if (!m) return s;
  const restWords = m[2].split(" ");
  let nounIdx = -1;
  for (let i = 0; i < restWords.length && i <= 2; i++) {
    if (/^[A-ZÄÖÜ]/.test(restWords[i])) {
      nounIdx = i;
      break;
    }
  }
  if (nounIdx === -1) return s;
  const nounWord = restWords[nounIdx].replace(/[,.;:!?]+$/, "");
  const art0 = m[1].toLowerCase();
  const gender = art0 === "eine" ? "f" : NOUN_GENDER[nounWord.toLowerCase()] || guessGender(nounWord);
  if (!gender) return s;
  const artForms = {
    m: { nom: "ein", acc: "einen", dat: "einem" },
    f: { nom: "eine", acc: "eine", dat: "einer" },
    n: { nom: "ein", acc: "ein", dat: "einem" }
  };
  const newArt = artForms[gender][targetCase] || artForms[gender].nom;
  const words = restWords.slice();
  for (let i = 0; i < nounIdx; i++) words[i] = adjustAdjectiveEnding(words[i], gender, targetCase);
  return `${newArt} ${words.join(" ")}`;
}
function safeCaseForm(rawPhrase, casedPhrase) {
  if (looksLikeClausePhrase(rawPhrase)) return `\u201E${clean(rawPhrase)}\u201C`;
  return casedPhrase;
}

// src/generation/ctxnorm.ts
var PREPS = /^(in|im|an|am|auf|bei|beim|unter|über|vor|hinter|neben|zwischen|durch|entlang|inmitten|nahe|außerhalb|innerhalb|jenseits|diesseits|um|ums|zu|zur|zum|während|seit|nach|gegen|ab|aus|von|vom|unterwegs|irgendwo|nirgendwo|überall|dort|draußen|drinnen|hier|daheim|zuhause|unten|oben)\b/i;
var cap2 = (s) => s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
function parseNP(s) {
  const m = s.trim().match(/^(?:(der|die|das|ein|eine|einen|einem|einer)\s+)?(?:([a-zäöüß][a-zäöüß-]*)\s+)?([A-ZÄÖÜ][A-Za-zÄÖÜäöüß-]*)$/);
  if (!m) return null;
  return { art: (m[1] || "").toLowerCase(), adj: m[2] || "", noun: m[3] };
}
function genderOf(art, noun) {
  if (art === "die" || art === "eine" || art === "einer") return "f";
  if (art === "das") return "n";
  if (art === "der" || art === "ein" || art === "einen" || art === "einem") {
    const g = guessGender(noun);
    return g || (art === "der" ? "m" : void 0);
  }
  return guessGender(noun);
}
var adjDat = (adj) => adj ? adj.replace(/(er|es|em|en|e)$/i, "") + "en" : "";
var AN_NOUNS = /^(meer|see|ozean|küste|strand|ufer|fluss|bach|rand|abgrund|fenster|tor|hafenbecken)$/i;
var AUF_NOUNS = /^(insel|wiese|weide|feld|berg|hügel|gipfel|dach|turm|platz|markt|straße|brücke|lichtung|bühne|terrasse|balkon)$/i;
function normWhere(s) {
  const t = (s || "").trim();
  if (!t || PREPS.test(t) || t.includes(",")) return t;
  const np = parseNP(t);
  if (!np) return t;
  const g = genderOf(np.art, np.noun);
  if (!g) return t;
  const adj = np.adj ? adjDat(np.adj) + " " : "";
  const kind = AUF_NOUNS.test(np.noun) ? "auf" : AN_NOUNS.test(np.noun) ? "an" : "in";
  const indef = np.art.startsWith("ein");
  if (indef) {
    const artD = g === "f" ? "einer" : "einem";
    return `${kind} ${artD} ${adj}${np.noun}`;
  }
  if (kind === "in") return g === "f" ? `in der ${adj}${np.noun}` : `im ${adj}${np.noun}`;
  if (kind === "an") return g === "f" ? `an der ${adj}${np.noun}` : `am ${adj}${np.noun}`;
  return g === "f" ? `auf der ${adj}${np.noun}` : `auf dem ${adj}${np.noun}`;
}
var WEEKDAYS = /^(montag|dienstag|mittwoch|donnerstag|freitag|samstag|sonnabend|sonntag)$/i;
var MONTHS = /^(januar|februar|märz|april|mai|juni|juli|august|september|oktober|november|dezember)$/i;
var SEASONS = /^(frühling|frühjahr|sommer|herbst|winter)$/i;
var TIME_ADV = /^(heute|morgen|gestern|übermorgen|vorgestern|damals|jetzt|nun|bald|einst|früher|später|nachts|morgens|abends|mittags|vormittags|nachmittags|irgendwann|immer|nie|niemals|neulich|kürzlich|demnächst|gerade|soeben|zugleich|währenddessen|einmal)\b/i;
var AM_TIMES = /^(morgen|vormittag|mittag|nachmittag|abend|tag|anfang|ende|wochenende|feierabend)$/i;
function normWhen(s) {
  const t = (s || "").trim();
  if (!t || PREPS.test(t) || TIME_ADV.test(t) || t.includes(",") || /\d+\s*uhr/i.test(t)) return t;
  if (/^\d{3,4}$/.test(t)) return `im Jahr ${t}`;
  const one = t.match(/^([A-ZÄÖÜa-zäöü][A-Za-zÄÖÜäöüß-]*)$/) ? t : null;
  if (!one) return t;
  const w = one;
  if (WEEKDAYS.test(w)) return `an einem ${cap2(w)}`;
  if (MONTHS.test(w) || SEASONS.test(w)) return `im ${cap2(w)}`;
  if (/^mitternacht$/i.test(w)) return "um Mitternacht";
  if (/^nacht$/i.test(w)) return "in der Nacht";
  if (/^dämmerung$/i.test(w)) return "in der D\xE4mmerung";
  if (AM_TIMES.test(w)) return `am ${cap2(w)}`;
  const g = guessGender(w);
  if (g === "f") return `in der ${cap2(w)}`;
  if (g === "m" || g === "n") return `im ${cap2(w)}`;
  return t;
}
function normWho(s) {
  const t = (s || "").trim();
  if (!t) return t;
  const parts = t.split(",").map((p) => p.trim()).filter(Boolean);
  const fixed = parts.map((p) => {
    const m = p.match(/^([a-zäöüß][a-zäöüß-]*)\s+([A-ZÄÖÜ][A-Za-zÄÖÜäöüß-]*)$/);
    if (m && !/^(der|die|das|ein|eine|einen|einem|einer|eines|mein|meine|dein|deine|sein|seine|ihr|ihre|unser|unsere|euer|eure|kein|keine|jeder|jede|jedes|dieser|diese|dieses)$/i.test(m[1])) {
      const g = guessGender(m[2]) || (/in$/.test(m[2].toLowerCase()) ? "f" : void 0);
      if (g === "f") return `eine ${m[1]} ${m[2]}`;
      if (g === "m" || g === "n") return `ein ${m[1]} ${m[2]}`;
    }
    return cap2(p);
  });
  return fixed.join(", ");
}

// src/generation/dialogue.ts
var ARCHETYPE_SPEAKERS = {
  neutral: ["Die Stimme", "Das System", "Ein Unbekannter", "Das Archiv", "Der Apparat"],
  skorpion: ["Die Zeugin", "Der Blick", "Die Hand", "Die Stimme", "Der Vermerk"],
  psychopath: ["Der Gutachter", "Das Protokoll", "Die Instanz", "Der Operator", "Die Akte"],
  entdecker: ["Die Karte", "Der Weg", "Die T\xFCr", "Der Rand", "Das Zeichen"]
};
function pickSpeakerForArchetype(archId) {
  return pick(ARCHETYPE_SPEAKERS[archId] || ARCHETYPE_SPEAKERS.neutral);
}
function makeDialogueScene(kit, lenTarget = 110) {
  const aId = kit.archetypeA || "neutral";
  const bId = kit.archetypeB || "neutral";
  const speakerA = kit.speakerA || kit.P;
  const speakerB = kit.speakerB || pickSpeakerForArchetype(bId);
  const cast = kit.speakers && kit.speakers.length >= 2 ? kit.speakers : [speakerA, speakerB];
  let rounds = Math.round(lenTarget / 7) + (kit.instability === 2 ? 2 : kit.instability === 1 ? 1 : 0);
  rounds = Math.max(4, Math.min(30, rounds));
  if (rounds % 2 !== 0) rounds = Math.min(30, rounds + 1);
  const evenAt = (f) => {
    let x = Math.round(rounds * f);
    if (x % 2 !== 0) x++;
    return Math.max(2, Math.min(rounds - 2, x));
  };
  const oddAt = (f) => {
    let x = Math.round(rounds * f);
    if (x % 2 === 0) x++;
    return Math.max(3, Math.min(rounds - 1, x));
  };
  const BEAT = {
    propB: oddAt(0.22),
    obstA: evenAt(0.38),
    surfB: oddAt(0.42),
    turnA: evenAt(0.64),
    stakeB: oddAt(0.68),
    endA: rounds - 2,
    stageB: rounds - 1
  };
  const phaseFor = (i) => {
    const p = i / (rounds - 1);
    if (p < 0.3) return 0;
    if (p < 0.6) return 1;
    if (p < 0.85) return 2;
    return 3;
  };
  const POOLS = {
    neutral: {
      setup: ["Was genau ist hier los?", "Sag mir, was du gesehen hast.", "Ich versuche, es zu verstehen.", "Wir sind noch nicht sicher.", "Fang von vorne an.", "Was hast du wirklich gesehen?", "Ich h\xF6re zu."],
      conflict: ["Du weichst aus.", "Das passt nicht zusammen.", "Du verdrehst die Reihenfolge.", "Du h\xF6rst nicht zu.", "Das ergibt keinen Sinn.", "Du l\xE4sst etwas weg.", "Bleib bei der Wahrheit."],
      twist: ["Vielleicht war es nie so gemeint.", "Dann dreht sich die Ursache um.", "Es sagt etwas anderes, als wir h\xF6ren.", "Die Regel gilt, aber anders.", "Vielleicht liegt es an uns.", "Der Grund verschiebt sich.", "Nichts davon war geplant."],
      fallout: ["Also bleibt nur das Ende.", "Dann ist das entschieden.", "Wir gehen von hier weg.", "Damit m\xFCssen wir leben.", "Dann ist es vorbei.", "Wir tragen es mit.", "Mehr bleibt nicht."]
    },
    skorpion: {
      setup: ["Ich sehe, dass du etwas verschweigst.", "Du bist n\xE4her, als du sein solltest.", "Das ist kein Zufall.", "Sag es \u2013 ohne Ausflucht.", "Du z\xF6gerst.", "Ich rieche die L\xFCge."],
      conflict: ["Du kontrollierst die Geschichte.", "Dein Schweigen ist ein Griff um meinen Hals.", "Ich kenne deine L\xFCcken.", "Du willst Besitz, nicht Wahrheit.", "Du h\xE4ltst etwas fest.", "Gib es zu."],
      twist: ["Dann geh\xF6rt die Wahrheit niemandem.", "Die N\xE4he kippt: Jetzt h\xE4lt es dich fest.", "Du wirst von deinem Satz behalten.", "Was du willst, will dich auch.", "Jetzt kehrt es sich um.", "Deine N\xE4he wird zur Falle."],
      fallout: ["Du gibst es zu, oder du verlierst alles.", "Ich lasse dich nicht ungeschoren.", "Wir sind jetzt Teil davon.", "Das Ende tr\xE4gt deinen Namen.", "Du tr\xE4gst die Schuld.", "Nichts entkommt mir."]
    },
    psychopath: {
      setup: ["Beschreibe den Sachverhalt.", "Emotion ist hier irrelevant.", "Das ist eine Beobachtung.", "Wir messen, was bleibt.", "Nenne die Fakten.", "Gef\xFChle sind Rauschen."],
      conflict: ["Deine Schl\xFCsse sind unzul\xE4ssig.", "Du verwechselst Gef\xFChl mit Fakt.", "Das ist Inkonsistenz.", "Du \xFCbersch\xE4tzt Bedeutung.", "Dein Schluss ist falsch.", "Das ist unpr\xE4zise."],
      twist: ["Dann drehen wir den Vektor um.", "Die Ursache ist das Symptom.", "Du bist das Experiment.", "Die Regel ist nur ein Modell.", "Die Ursache ist Effekt.", "Du bist die Variable."],
      fallout: ["Der Fall ist abgeschlossen.", "Das Ergebnis ist eindeutig.", "Wir protokollieren das.", "Damit ist es erledigt.", "Abgeschlossen.", "Das Ergebnis steht."]
    },
    entdecker: {
      setup: ["Da vorne ist noch etwas.", "Wir gehen weiter.", "Die Richtung ist nicht zuf\xE4llig.", "Ich will sehen, was dahinter liegt.", "Da vorn ist mehr.", "Komm weiter."],
      conflict: ["Du h\xE4ltst mich auf.", "Du willst stehen bleiben.", "Du sperrst den Weg.", "Du hast Angst vor der n\xE4chsten T\xFCr.", "Du bremst.", "Du f\xFCrchtest die T\xFCr."],
      twist: ["Dann \xF6ffnet sich der Raum in die falsche Richtung.", "Die Karte beginnt zu laufen.", "Der Weg entdeckt uns.", "Hinter uns ist das Ziel.", "Der Weg dreht sich.", "Das Ziel liegt hinter uns."],
      fallout: ["Wir nehmen mit, was wir k\xF6nnen.", "Wir lassen den Rest zur\xFCck.", "Es bleibt eine Spur.", "Und dann: weiter.", "Wir ziehen weiter.", "Eine Spur bleibt."]
    }
  };
  const STANCE_LINES = {
    glauben: {
      setup: ["Ich wei\xDF, was ich gesehen habe.", "Es war genau so.", "H\xF6r mir zu, es stimmt.", "Ich habe keinen Zweifel.", "Das ist die Wahrheit, ob du willst oder nicht."],
      conflict: ["Es ist trotzdem wahr.", "Ich bleibe dabei.", "Du musst mir das glauben.", "Ich habe es selbst erlebt.", "Daran \xE4ndert dein Zweifel nichts."],
      twist: ["Also hatte ich recht.", "Dann best\xE4tigt es sich.", "Ich wusste es die ganze Zeit.", "Genau das habe ich gesagt.", "Siehst du \u2014 es stimmt."],
      fallout: ["Ich stehe dazu.", "Es bleibt wahr.", "Ich bereue kein Wort.", "So war es, so bleibt es."]
    },
    zweifeln: {
      setup: ["Woher willst du das wissen?", "Bist du sicher?", "Das klingt zu einfach.", "Kann das \xFCberhaupt stimmen?", "Ich glaube nichts ohne Beweis."],
      conflict: ["Das kann nicht stimmen.", "Beweis es mir.", "Da fehlt etwas.", "Warum sollte ich dir glauben?", "Deine Geschichte hat L\xF6cher."],
      twist: ["Vielleicht hatte ich unrecht.", "Oder es ist ganz anders.", "Und wenn es doch stimmt?", "Jetzt zweifle ich an meinem Zweifel."],
      fallout: ["Ich bin noch nicht \xFCberzeugt.", "Sicher bin ich trotzdem nicht.", "Vielleicht. Vielleicht auch nicht.", "Ich behalte meine Fragen."]
    },
    abwehren: {
      setup: ["Muss das jetzt sein?", "Lass uns nicht dar\xFCber reden.", "Das geht dich nichts an.", "Ich will das nicht.", "Es ist nicht so wichtig."],
      conflict: ["Das f\xFChrt zu nichts.", "H\xF6r auf zu bohren.", "Ich habe nichts gesagt.", "Lenk nicht ab.", "Reden wir \xFCber etwas anderes."],
      twist: ["Es ist zu sp\xE4t daf\xFCr.", "Jetzt ist es sowieso egal.", "Ich h\xE4tte schweigen sollen.", "Vergiss, was ich gesagt habe."],
      fallout: ["Es ist erledigt.", "Reden wir nicht mehr davon.", "Vergessen wir das.", "Genug jetzt."]
    }
  };
  const STANCES = ["glauben", "zweifeln", "abwehren"];
  for (let k = STANCES.length - 1; k > 0; k--) {
    const j = Math.floor(Math.random() * (k + 1));
    [STANCES[k], STANCES[j]] = [STANCES[j], STANCES[k]];
  }
  const stanceOf = (castIdx) => STANCES[castIdx % STANCES.length];
  const capFirst = (s) => {
    s = String(s || "").trim();
    return s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
  };
  const stripLead = (s) => String(s || "").replace(/^(und|dann|aber|denn|so|doch)\s+/i, "").trim();
  const topic = clean(kit.motif || kit.W || "").replace(/[.!?…]+$/, "");
  const STAGE = ["Stille.", "Ein langer Blick.", "Keiner spricht weiter.", "Der Wind tr\xE4gt den Rest fort.", "Die Weide liegt still.", "Nichts bewegt sich."];
  const cleanDialogLine = (s) => {
    s = clean(s);
    s = s.replace(/,\s*([.!?…])/g, "$1").replace(/\s*,\s*,\s*/g, ", ").replace(/„\s+/g, "\u201E").replace(/\s+"/g, '"').replace(/\.{2,}/g, ".").replace(/\s+([,.;:!?])/g, "$1").replace(/\)\s*\.$/, ")");
    return capFirst(s);
  };
  const usedRaw = /* @__PURE__ */ new Set();
  let prevRaw = "";
  const pickLine = (stance, archetype, phase) => {
    const key = phase === 0 ? "setup" : phase === 1 ? "conflict" : phase === 2 ? "twist" : "fallout";
    const useArch = archetype !== "neutral" && chance(0.4);
    const P = useArch ? POOLS[archetype] || POOLS.neutral : STANCE_LINES[stance] || POOLS.neutral;
    const arr = P[key] || [];
    if (!arr.length) return "\u2026";
    const fresh = arr.filter((l) => l !== prevRaw && !usedRaw.has(l));
    let cand;
    if (fresh.length) cand = pick(fresh);
    else {
      const notPrev = arr.filter((l) => l !== prevRaw);
      cand = notPrev.length ? pick(notPrev) : pick(arr);
    }
    usedRaw.add(cand);
    prevRaw = cand;
    return cand;
  };
  const injectBeat = (i) => {
    if (i === 0) return topic ? `Das Thema: ${topic}.` : "Sag mir, was du gesehen hast.";
    if (i === 1) return topic ? "Und was hat das mit uns zu tun?" : "Was genau meinst du?";
    if (i === BEAT.propB && kit.propAcc) return `Du hast ${kit.propAcc} dabei.`;
    if (i === BEAT.obstA) return ensurePunct(capFirst(stripLead(kit.obstacle)));
    if (i === BEAT.surfB) return "Das ist nur die Oberfl\xE4che.";
    if (i === BEAT.turnA) return `Dann \u2014 ${capFirst(stripLead(clean(kit.turn).replace(/[.!?…]+$/, "")))}.`;
    if (i === BEAT.stakeB) return ensurePunct(capFirst(stripLead(kit.stake)));
    if (i === BEAT.endA) return ensurePunct(capFirst(kit.ending));
    if (i === BEAT.stageB) return chance(0.6) ? `(${pick(STAGE)})` : null;
    return null;
  };
  const applyInstability = (line, archetype, phase) => {
    if (kit.instability !== 2) return line;
    if (/[()]/.test(line) || line.includes("\u2014") || line.includes(":")) return line;
    if (chance(0.32 + phase * 0.06)) {
      const activeVerbs = ["\xF6ffnet", "nimmt", "sieht", "h\xE4lt", "stellt", "schreibt", "tr\xE4gt", "f\xFChrt", "bricht", "nennt", "findet", "ber\xFChrt", "beobachtet", "sucht"];
      const m = line.match(new RegExp(`^(.+?)\\s+(${activeVerbs.join("|")})\\s+(.+?)\\.$`, "i"));
      if (m) {
        const subj = m[1].trim(), verb = m[2], obj = m[3].trim();
        if (obj.length < 40 && subj.toLowerCase() !== obj.toLowerCase() && obj.split(/\s+/).length <= 4 && !obj.includes(subj)) {
          line = `${obj} ${verb} ${subj}.`;
        }
      }
    }
    if (chance(0.22)) {
      if (archetype === "skorpion" && !line.includes("wei\xDFt")) line = line.replace(/\.$/, " \u2013 und du wei\xDFt es.");
      else if (archetype === "psychopath" && !line.includes("Notiert")) line = line.replace(/\.$/, ". Notiert.");
      else if (archetype === "entdecker" && !line.includes("Weiter")) line = line.replace(/\.$/, ". Weiter.");
    }
    return line.replace(/\bIch kenne ich\b/gi, "Ich kenne mich").replace(/\bIch nennen\b/gi, "Ich nenne").replace(/\bIch sucht\b/gi, "Ich suche").replace(/\.\s*\./g, ".").replace(/\s{2,}/g, " ").trim();
  };
  const out = [`SZENE: ${kit.W}, ${kit.T}.`];
  for (let i = 0; i < rounds; i++) {
    const isA = i % 2 === 0;
    const ci = i % cast.length;
    const speaker = cast[ci];
    const arch2 = isA ? aId : bId;
    const ph = phaseFor(i);
    let line = injectBeat(i) ?? pickLine(stanceOf(ci), arch2, ph);
    line = ensurePunct(line);
    line = applyInstability(line, arch2, ph);
    line = cleanDialogLine(line);
    out.push(`${speaker}: ${line}`);
  }
  return out.join("\n");
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
var INFINITIVE_VERBS = /* @__PURE__ */ new Set(["entdecken", "finden", "verstehen", "erreichen", "verlassen", "retten", "zerst\xF6ren", "beweisen", "\xFCberleben", "fliehen", "gewinnen", "verlieren", "\xF6ffnen", "schlie\xDFen", "verschwinden", "sterben", "bleiben", "ankommen", "entkommen", "aufwachen", "vergessen", "lernen", "ver\xE4ndern", "kontrollieren", "sch\xFCtzen", "befreien", "heilen", "erschaffen", "reparieren", "beenden", "anfangen", "beginnen", "erinnern", "wissen", "glauben", "tr\xE4umen", "hoffen", "k\xE4mpfen", "siegen", "sprechen", "schweigen", "warten", "folgen", "fragen", "antworten", "erkl\xE4ren", "gehen", "kommen"]);

// src/generation/verbconj.ts
var VERB_TOKEN_RE = new RegExp("\\b(" + Object.keys(VERB_CONJ).join("|") + ")\\b", "i");
function conjugateVerbToken(verb, person) {
  if (!verb) return verb;
  const isCap = /^[A-ZÄÖÜ]/.test(verb);
  const low = verb.toLowerCase();
  const table = VERB_CONJ[low];
  let out;
  if (table && table[person]) {
    out = table[person];
  } else if (person === "ich") {
    out = /et$/.test(low) ? low.slice(0, -1) : /t$/.test(low) ? low.slice(0, -1) + "e" : low;
  } else if (person === "du") {
    out = /et$/.test(low) ? low.slice(0, -1) + "st" : low;
  } else {
    out = low;
  }
  return isCap ? cap(out) : out;
}

// src/generation/wordcls.ts
var NOT_INFINITIVE = /* @__PURE__ */ new Set([
  "einen",
  "keinen",
  "seinen",
  "ihren",
  "deinen",
  "unseren",
  "euren",
  "diesen",
  "jenen",
  "denen",
  "welchen",
  "allen",
  "vielen",
  "beiden",
  "manchen",
  "jeden",
  "solchen",
  "anderen",
  "eigenen",
  "letzten",
  "ersten",
  "oben",
  "unten",
  "innen",
  "au\xDFen",
  "hinten",
  "vorn",
  "vorne",
  "neben",
  "eben",
  "gegen",
  "wegen",
  "gegen\xFCber",
  "morgen",
  "\xFCbermorgen",
  "wochen",
  "stunden",
  "sieben",
  "zehn",
  "trotzen",
  "w\xE4hrend",
  "dessen",
  "deren",
  "hinein"
]);
function looksLikeInfinitive(w) {
  if (INFINITIVE_VERBS.has(w)) return true;
  if (w.length < 5 || NOT_INFINITIVE.has(w) || NOUN_GENDER[w]) return false;
  return /(?:[a-zäöüß]{3,})(?:en|ern|eln)$/.test(w);
}
function extractLeadVerb(text) {
  const s = clean(text);
  if (!s) return { verb: null, rest: s };
  const m = s.match(/^([A-Za-zÄÖÜäöüß]+)\s+(.+)$/);
  if (!m) return { verb: null, rest: s };
  const raw = m[1];
  const w = raw.toLowerCase();
  if (VERB_CONJ[w]) return { verb: raw, rest: m[2] };
  if (/^[a-zäöüß]/.test(raw) && looksLikeInfinitive(w)) {
    return { verb: null, rest: `${m[2]} ${w}`, isInfinitiveLed: true };
  }
  if (/^[a-zäöüß]+iert$/.test(w)) return { verb: raw, rest: m[2] };
  return { verb: null, rest: s };
}
var EXTRA_FINITE_RE = /\b(geschieht|geschehen|geschah|passiert|passieren|passierte|tickt|ticken|atmet|atmen|wächst|wachsen|wuchs|brennt|brennen|brannte|fällt|fallen|fiel|zerfällt|zerfallen|verschwindet|verschwinden|verschwand|erscheint|erscheinen|erschien|endet|enden|endete|beginnt|beginnen|begann|stirbt|sterben|starb|blüht|blühen|klopft|klopfen|flackert|flackern|zerbricht|zerbrechen|zerbrach|dreht|drehen|schweigt|schweigen|schwieg|singt|singen|sang|wandert|wandern|glüht|glühen|tanzt|tanzen|brüllt|brüllen|reagiert|reagieren|zeigt|zeigen|spricht|sprechen|sprach|antwortet|antworten|erinnert|erinnern|verändert|verändern|zittert|zittern|leuchtet|leuchten|schmilzt|schmelzen|regnet|schneit|blitzt|donnert|bebt|läuft|laufen|lief|rinnt|tropft|fließt|fließen|floss|steigt|steigen|stieg|sinkt|sinken|sank|kreist|kreisen|pulsiert|vibriert|summt|brummt|knistert|raschelt|flüstert|flüstern|schreit|schreien|schrie|weint|weinen|lacht|lachen|verglüht|verblasst|zerrinnt|wartet|warten)\b/i;
function looksLikeFullClause(leadVerb, rest) {
  if (leadVerb) return false;
  return VERB_TOKEN_RE.test(rest || "") || EXTRA_FINITE_RE.test(rest || "");
}
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

// src/generation/nlp.ts
function tokenize(text) {
  return (text || "").replace(/\r/g, "").replace(/([.,!?;:()„""""—])/g, " $1 ").replace(/\s+/g, " ").trim().split(" ").filter(Boolean);
}
var COHERENCE_STOPWORDS = new Set(
  "aber alle allem allen aller alles als also am an andere anderen auch auf aus bei bin bis bist da dabei dann das dass dem den denn der des dessen die dies diese diesem diesen dieser dieses doch dort du durch ein eine einem einen einer eines er es etwas fuer f\xFCr gegen hab habe haben hat hatte hier hin hinter ich ihm ihn ihr ihre im in ist ja jede jedem jeden jeder jedes kann kein keine man mehr mein mich mir mit muss nach nicht nichts noch nun nur ob oder ohne schon sein seine sich sie sind so ueber \xFCber um und uns unser unter vom von vor war waren was wenn werden wie wieder will wir wird wo zu zum zur".split(" ")
);
function coherenceWords(s) {
  return tokenize(String(s || "").toLowerCase()).filter((w) => w.length > 3 && !COHERENCE_STOPWORDS.has(w));
}

// src/generation/tone.data.ts
var TONE_DATA = {
  "neutral": { "opener": [], "flavor": [] },
  "mystery": {
    "opener": [
      "Was jetzt folgt, l\xE4sst sich nicht ganz erkl\xE4ren.",
      "Manches davon ergibt erst im Nachhinein einen Sinn.",
      "Von Anfang an fehlte ein Teil des Bildes.",
      "Sp\xE4ter w\xFCrde niemand sagen k\xF6nnen, wann es genau begann.",
      "Es gab eine Version der Geschichte, und dann die wahre.",
      "Irgendetwas stimmte nicht, lange bevor es jemand bemerkte.",
      "Die Wahrheit lag n\xE4her, als alle glaubten - und tiefer."
    ],
    "flavor": [
      "Etwas darin blieb bewusst unausgesprochen.",
      "Nicht alles lie\xDF sich erkl\xE4ren, so sehr man es auch versuchte.",
      "Eine Frage schwang mit, die niemand laut zu stellen wagte.",
      "Es war, als fehlte ein ganzes Kapitel der Geschichte.",
      "Irgendjemand wusste offensichtlich mehr, als er zugab.",
      "Die Erkl\xE4rung daf\xFCr kam nie - oder war schlimmer als das R\xE4tsel selbst.",
      "Ein Detail passte nicht, und genau daran hing alles.",
      "Was fehlte, war lauter als das, was gesagt wurde.",
      "Jede Antwort \xF6ffnete zwei neue T\xFCren.",
      "Man ahnte, dass die Spur im Kreis f\xFChrte.",
      "Zwischen den Zeilen wartete eine zweite Geschichte.",
      "Niemand hatte den Anfang gesehen, nur die Folgen."
    ]
  },
  "poetic": {
    "opener": [
      "Manche Dinge lassen sich nur in Bildern erz\xE4hlen.",
      "Es beginnt, wie Erinnerungen beginnen: unscharf und zu hell.",
      "Alles daran hatte den Klang von etwas Vergangenem.",
      "Es war einer jener Momente, die l\xE4nger dauern als ihre Minute.",
      "Das Licht fiel so, dass Worte fast \xFCberfl\xFCssig wurden.",
      "Vielleicht war es weniger ein Ereignis als ein Nachhall."
    ],
    "flavor": [
      "Die Worte daf\xFCr kamen, wenn \xFCberhaupt, erst viel sp\xE4ter.",
      "Alles darin klang wie die Erinnerung an etwas Gr\xF6\xDFeres.",
      "Selbst die Stille schien an diesem Ort eine Farbe zu haben.",
      "Es f\xFChlte sich an wie ein halb vergessenes Gedicht, das jemand zu Ende tr\xE4umt.",
      "Zwischen den S\xE4tzen lag mehr als in ihnen.",
      "Wie ein Bild, das l\xE4nger nachwirkt als die Geschichte dazu.",
      "Die Zeit floss hier langsamer, fast wie Honig im Winter.",
      "Jede Bewegung hinterlie\xDF eine Spur aus Licht.",
      "Es war sch\xF6n auf die Weise, die auch wehtut.",
      "Man h\xF6rte die Dinge atmen, wenn man still genug war.",
      "Die R\xE4nder der Welt schienen kurz weicher zu werden.",
      "Ein Duft von etwas, das es so nie gegeben hatte."
    ]
  },
  "melancholisch": {
    "opener": [
      "Es lag eine leise Traurigkeit \xFCber allem, ganz ohne Grund.",
      "Was bleibt, ist selten das, was man behalten wollte.",
      "Manches endet, lange bevor man es merkt.",
      "Es war die Art von Nachmittag, an dem alles ein wenig verblasst.",
      "Irgendwo darin steckte ein Abschied, den keiner ausgesprochen hatte.",
      "Sp\xE4ter w\xFCrde man sich an diesen Tag erinnern, ohne zu wissen, warum."
    ],
    "flavor": [
      "Etwas darin f\xFChlte sich an wie das Ende eines langen Sommers.",
      "Man vermisste etwas, ohne benennen zu k\xF6nnen, was.",
      "Die Dinge hatten den sanften Glanz des Verg\xE4nglichen.",
      "Es war weniger Schmerz als eine ruhige, alte Wehmut.",
      "Alles blieb - nur nicht so, wie es einmal gewesen war.",
      "Ein Teil davon war schon Erinnerung, w\xE4hrend es noch geschah.",
      "Die Freude kam mit einem feinen Riss darin.",
      "Man wusste, dass man diesen Moment sp\xE4ter vermissen w\xFCrde.",
      "Selbst das Licht schien sich langsam zu verabschieden.",
      "Es war sch\xF6n gewesen, und genau das machte es schwer."
    ]
  },
  "dark": {
    "opener": [
      "Von der ersten Sekunde an f\xFChlte sich hier nichts richtig an.",
      "Es begann leise - so, wie das Schlimmste meistens beginnt.",
      "Manche Orte warten nur darauf, dass jemand kommt.",
      "Es gab keinen Ausweg, nur die Illusion davon.",
      "Was folgte, h\xE4tte niemand aufhalten k\xF6nnen.",
      "Die Dunkelheit hier war \xE4lter als das Haus, das sie barg."
    ],
    "flavor": [
      "Nichts daran f\xFChlte sich je wirklich sicher an.",
      "Etwas darin roch unverkennbar nach Verlust.",
      "Die K\xE4lte blieb, auch als l\xE4ngst niemand mehr hinsah.",
      "Es war die Art von Stille, die etwas Schlimmeres ank\xFCndigt.",
      "Irgendwo darunter wartete bereits das n\xE4chste Ungl\xFCck.",
      "Kein Trost weit und breit - nur die Gewissheit, dass es schlimmer werden w\xFCrde.",
      "Jeder Ausweg f\xFChrte nur tiefer hinein.",
      "Etwas beobachtete, ohne je gesehen zu werden.",
      "Die Hoffnung war das Erste, was hier starb.",
      "Man sp\xFCrte, dass die W\xE4nde zuh\xF6rten.",
      "Es war zu sp\xE4t, schon bevor es begann.",
      "Selbst das Schweigen hatte hier Z\xE4hne."
    ]
  },
  "unheimlich": {
    "opener": [
      "Alles wirkte vertraut, und genau das war das Problem.",
      "Irgendetwas war anders, aber man konnte nicht sagen, was.",
      "Die Dinge standen zu still, um nat\xFCrlich zu sein.",
      "Es war, als h\xE4tte jemand die Welt fast, aber nicht ganz richtig nachgebaut.",
      "Man hatte das Gef\xFChl, nicht allein zu sein - ohne Beweis daf\xFCr.",
      "Etwas stimmte mit den Schatten nicht."
    ],
    "flavor": [
      "Die Spiegel schienen einen Sekundenbruchteil zu sp\xE4t zu reagieren.",
      "Ein Ger\xE4usch, das nur existierte, wenn man nicht hinh\xF6rte.",
      "Die Gesichter waren richtig, nur das L\xE4cheln sa\xDF falsch.",
      "Etwas z\xE4hlte mit, jedes Mal, wenn man die T\xFCr schloss.",
      "Die Uhr ging, aber die Zeit stand.",
      "Man erkannte den Raum wieder, ohne je dort gewesen zu sein.",
      "Die Stille hatte eine Form, und sie kam n\xE4her.",
      "Irgendwo atmete etwas im Takt der eigenen Schritte.",
      "Ein Detail war zu viel im Bild, und keiner sah es an.",
      "Es f\xFChlte sich an, als w\xFCrde man erwartet."
    ]
  },
  "uplifting": {
    "opener": [
      "Und doch beginnt hier, allen Umst\xE4nden zum Trotz, etwas Gutes.",
      "Selbst an diesem Ort lie\xDF sich noch Hoffnung finden.",
      "Manchmal reicht ein einziger Moment, um alles zu wenden.",
      "Es sah aussichtslos aus - und war es dann doch nicht.",
      "Irgendwo darin lag der Anfang von etwas Besserem.",
      "Gerade als alles verloren schien, kam das Licht zur\xFCck."
    ],
    "flavor": [
      "Und doch blieb, gegen jede Erwartung, ein Rest Hoffnung.",
      "Irgendetwas darin f\xFChlte sich nach einem echten Neuanfang an.",
      "Es war, als w\xFCrde sich gerade, ganz leise, etwas zum Guten wenden.",
      "Ein kleiner Trost blieb trotzdem - und manchmal reicht genau das.",
      "Selbst im Schwierigsten fand sich noch ein Grund zum Weitermachen.",
      "Am Ende z\xE4hlte nicht der Verlust, sondern das, was blieb.",
      "Eine unerwartete Freundlichkeit ver\xE4nderte alles.",
      "Zum ersten Mal seit Langem schien der Weg wieder offen.",
      "Es war schwer gewesen, aber es hatte sich gelohnt.",
      "Manchmal ist der Sturz nur der Anlauf.",
      "Etwas in ihr richtete sich wieder auf.",
      "Und pl\xF6tzlich schien alles m\xF6glich."
    ]
  },
  "zaertlich": {
    "opener": [
      "Es geschah mit einer Behutsamkeit, die man kaum erwartet h\xE4tte.",
      "Manche Dinge muss man leise erz\xE4hlen, sonst zerbrechen sie.",
      "Es war klein und warm und leicht zu \xFCbersehen.",
      "Zwischen ihnen lag eine Sanftheit, f\xFCr die es kein Wort gab.",
      "Es begann mit einer Geste, die niemand sonst bemerkte.",
      "Alles daran war sacht, fast wie Atem im Schlaf."
    ],
    "flavor": [
      "Eine Hand, die blieb, obwohl sie gehen durfte.",
      "Es war die Sorte N\xE4he, die keine Worte braucht.",
      "Etwas darin passte auf einen auf, ganz unaufdringlich.",
      "Ein L\xE4cheln, so leise, dass man es fast \xFCberh\xF6rte.",
      "Die Welt wurde f\xFCr einen Moment weicher.",
      "Es war ein kleines Z\xE4rtlichsein, mitten im L\xE4rm.",
      "Jemand hielt etwas Zerbrechliches, ohne es zu dr\xFCcken.",
      "W\xE4rme, die keine Gegenleistung wollte.",
      "Es f\xFChlte sich an wie Ankommen.",
      "Ein Trost, der einfach nur dablieb."
    ]
  },
  "traeumerisch": {
    "opener": [
      "Es war schwer zu sagen, ob es geschah oder nur getr\xE4umt wurde.",
      "Die R\xE4nder der Dinge waren an diesem Tag nicht ganz fest.",
      "Alles trieb ein wenig, wie Boote ohne Anker.",
      "Es f\xFChlte sich an, als w\xE4re man mitten in einem fremden Traum aufgewacht.",
      "Die Logik hatte hier Urlaub genommen.",
      "Zeit und Ort waren nur Vorschl\xE4ge."
    ],
    "flavor": [
      "Die Dinge verwandelten sich, kaum dass man wegsah.",
      "Ein Zimmer wurde zum Meer, ohne dass es jemand st\xF6rte.",
      "Die Schwerkraft schien Verhandlungssache zu sein.",
      "Man ging durch T\xFCren, die es vorher nicht gegeben hatte.",
      "Farben rochen, und Ger\xE4usche hatten Gewicht.",
      "Alles ergab Sinn, solange man nicht genauer hinsah.",
      "Die Erinnerung lief der Gegenwart voraus.",
      "Ein Gedanke wurde Landschaft.",
      "Nichts stand fest, und nichts fiel.",
      "Es war sch\xF6n und ungereimt wie ein Traum kurz vor dem Erwachen."
    ]
  },
  "nuechtern": {
    "opener": [
      "Der Reihe nach: Es geschah genau so, wie es hier steht.",
      "Ohne Umschweife - das ist, was passierte.",
      "Es gibt daran nichts zu besch\xF6nigen.",
      "Die Fakten waren \xFCbersichtlich, die Folgen weniger.",
      "Man muss es nicht ausschm\xFCcken, es gen\xFCgt so.",
      "Kurz und ohne Pathos: So lag der Fall."
    ],
    "flavor": [
      "Mehr war dazu nicht zu sagen.",
      "Die Sache hatte eine klare Ursache und eine klare Folge.",
      "Es half nichts, es zu besch\xF6nigen.",
      "Alles Weitere ergab sich daraus von selbst.",
      "N\xFCchtern betrachtet, blieb wenig Raum f\xFCr Zweifel.",
      "Die Lage war, was sie war.",
      "Man notierte es und ging weiter.",
      "Kein Drama, nur der n\xE4chste Schritt.",
      "So einfach, so unausweichlich.",
      "Am Ende z\xE4hlten nur die Zahlen."
    ]
  },
  "ironisch": {
    "opener": [
      "Nat\xFCrlich lief alles nach Plan - nur nicht nach diesem.",
      "Man ahnt schon, wie gut das ausgehen wird.",
      "Es war, mit Verlaub, eine gl\xE4nzende Idee. Fast.",
      "Was h\xE4tte dabei schon schiefgehen k\xF6nnen.",
      "Wie sch\xF6n, dass wenigstens einer den \xDCberblick behielt. Behauptete er.",
      "Der Plan war wasserdicht. Das Wasser fand trotzdem einen Weg."
    ],
    "flavor": [
      "Es lief exakt so gut, wie zu erwarten war.",
      "Ein voller Erfolg, wenn man die Ziele nachtr\xE4glich anpasste.",
      "Zum Gl\xFCck war ja jemand zust\xE4ndig - nur nicht anwesend.",
      "Die Ironie daran entging allen Beteiligten.",
      "Man nannte es Strategie, um nicht Zufall sagen zu m\xFCssen.",
      "Selbstverst\xE4ndlich hatte niemand etwas geahnt. Angeblich.",
      "Ein Meisterwerk der Planung, r\xFCckw\xE4rts betrachtet.",
      "Alles unter Kontrolle, versicherte die Kontrolle.",
      "Bemerkenswert, wie zuverl\xE4ssig das Unwahrscheinliche eintraf.",
      "Es h\xE4tte schlimmer kommen k\xF6nnen. Kam es dann auch."
    ]
  },
  "humorous": {
    "opener": [
      "Es h\xE4tte ernst werden k\xF6nnen - wurde es aber nicht ganz.",
      "Manche Geschichten sind einfach zu absurd, um nicht zu grinsen.",
      "Was folgt, ist mit Ansage albern.",
      "Es begann harmlos und entglitt dann auf komische Weise.",
      "Man sollte das nicht so ernst nehmen. Die Beteiligten taten es auch nicht.",
      "Vorweg: Niemand kam ernsthaft zu Schaden, nur die W\xFCrde."
    ],
    "flavor": [
      "Absurd genug, um fast schon wieder normal zu wirken.",
      "Selbst das Schicksal schien dabei kurz zu grinsen.",
      "Niemand h\xE4tte sich das so ausgedacht - und genau deshalb war es lustig.",
      "Es hatte, aller Dramatik zum Trotz, etwas unfreiwillig Komisches.",
      "Man h\xE4tte fast Popcorn gebraucht, so albern lief das gerade.",
      "Selbst die Beteiligten mussten sich das Lachen verkneifen.",
      "Es war ein Chaos, aber ein gut gelauntes.",
      "Die Peinlichkeit war beeindruckend gleichm\xFCtig.",
      "Am Ende lachten alle - manche sogar freiwillig.",
      "Der Ernst der Lage hatte sichtlich Feierabend."
    ]
  }
};

// src/generation/tone.shape.ts
var TONE_SHAPE = {
  neutral: {},
  mystery: { rhythm: "long" },
  poetic: { rhythm: "breath", register: "lyrical" },
  melancholisch: { rhythm: "long", register: "lyrical" },
  dark: { rhythm: "fracture", register: "dark" },
  unheimlich: { rhythm: "fracture", register: "dark" },
  uplifting: { rhythm: "clean" },
  zaertlich: { rhythm: "breath", register: "lyrical" },
  traeumerisch: { rhythm: "breath", register: "lyrical" },
  nuechtern: { rhythm: "clean", register: "plain" },
  ironisch: { rhythm: "clean", register: "wry" },
  humorous: { rhythm: "staccato", register: "wry" }
};
function toneRhythm(tone) {
  return tone ? TONE_SHAPE[tone]?.rhythm : void 0;
}
function toneRegister(tone) {
  return tone && TONE_SHAPE[tone]?.register || null;
}
var cap1 = (s) => s ? s[0].toUpperCase() + s.slice(1) : s;
function applyToneRegister(text, tone) {
  const reg = toneRegister(tone);
  if (!reg || !text) return text;
  if (reg === "plain") {
    let t = text.replace(/\b(gleichsam|wie Honig im Winter|wie ein halb vergessenes Gedicht[^.,;]*)\b/gi, "").replace(/\s{2,}/g, " ");
    t = t.split(/\n\n+/).map((para) => {
      const sents = para.split(/(?<=[.!?…])\s+/);
      const out = [];
      for (const sen of sents) {
        const wc = sen.split(/\s+/).filter(Boolean).length;
        if (wc > 16) {
          const parts = sen.split(/,\s+(?=und |aber |denn |während |sodass |wobei )/);
          if (parts.length > 1) {
            parts.forEach((p, i) => {
              let seg = p.replace(/^,?\s*(und|aber|denn|während|sodass|wobei)\s+/i, "").trim();
              if (!seg) return;
              seg = cap1(seg);
              if (!/[.!?…]$/.test(seg)) seg += ".";
              out.push(i === 0 && /[.!?…]$/.test(p) ? cap1(p.trim()) : seg);
            });
            continue;
          }
        }
        out.push(sen);
      }
      return out.join(" ");
    }).join("\n\n");
    return t.replace(/\s+([,.;:!?…])/g, "$1").replace(/\s{2,}/g, " ").trim();
  }
  if (reg === "wry") {
    const tags = ["\u2013 angeblich.", "\u2013 so hie\xDF es.", "\u2013 was auch immer das hei\xDFen sollte.", "\u2013 nat\xFCrlich.", "\u2013 wie praktisch.", "\u2013 oder so \xE4hnlich."];
    let ti = Math.floor(Math.random() * tags.length);
    return text.split(/\n\n+/).map((para) => {
      const sents = para.split(/(?<=[.!?…])\s+/);
      return sents.map((sen) => {
        const wc = sen.split(/\s+/).filter(Boolean).length;
        if (wc >= 5 && wc <= 18 && /[.]$/.test(sen) && !/[()"„:—–]/.test(sen) && Math.random() < 0.3) {
          const tag = tags[ti % tags.length];
          ti++;
          return sen.replace(/\.$/, " " + tag);
        }
        return sen;
      }).join(" ");
    }).join("\n\n");
  }
  return text;
}

// src/generation/polish.ts
function polishGerman(text, opts = {}) {
  const {
    who = "",
    style = "surreal_precise",
    fixCapitalization = true,
    fixSpacing = true,
    fixPunctuation = true
  } = opts;
  let t = String(text ?? "");
  const escRE = (s) => String(s).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  if (fixSpacing) {
    t = t.replace(/\r\n/g, "\n").replace(/[ \t]+\n/g, "\n").replace(/ /g, " ").replace(/[ \t]{2,}/g, " ").replace(/\n{3,}/g, "\n\n").replace(/\s+([,.;:!?])/g, "$1").replace(/([,.;:!?])([A-Za-zÄÖÜäöü])/g, "$1 $2").replace(/\(\s+/g, "(").replace(/\s+\)/g, ")").trim();
  }
  if (fixCapitalization) {
    t = t.replace(/^(\s*)([a-zäöü])/u, (_m, p1, p2) => p1 + p2.toUpperCase());
    t = t.replace(/([.!?…]\s+|\n+)([a-zäöü])/gu, (_m, p1, p2) => p1 + p2.toUpperCase());
  }
  if (who && who.trim()) {
    const w = who.trim();
    try {
      const rx = new RegExp(`(?<![\\p{L}\\p{N}_])${escRE(w)}(?![\\p{L}\\p{N}_])`, "giu");
      t = t.replace(rx, w);
    } catch {
      const rx2 = new RegExp(`\\b${escRE(w)}\\b`, "gi");
      t = t.replace(rx2, w);
    }
  }
  if (style === "surreal_precise") {
    const articleFix = [
      // Basis-Nomen (bereits vorhanden)
      ["Karte", "die"],
      ["Geruch", "der"],
      ["Summen", "das"],
      ["Korridor", "der"],
      ["Sensor", "der"],
      ["Raum", "der"],
      ["Archiv", "das"],
      ["Spiegel", "der"],
      ["Text", "der"],
      ["Einsatz", "der"],
      ["Plan", "der"],
      ["Regel", "die"],
      ["Wahrheit", "die"],
      ["Zeit", "die"],
      ["Mut", "der"],
      ["T\xFCr", "die"],
      ["Fenster", "das"],
      ["Lampe", "die"],
      ["Blick", "der"],
      ["Stimme", "die"],
      ["Akte", "die"],
      ["Signal", "das"],
      ["System", "das"],
      ["Protokoll", "das"],
      ["Formular", "das"],
      ["Stempel", "der"],
      ["Antrag", "der"],
      ["Frist", "die"],
      // NEUE EINTRÄGE - Alltagsgegenstände
      ["Tisch", "der"],
      ["Stuhl", "der"],
      ["Bett", "das"],
      ["Schrank", "der"],
      ["Fensterbank", "die"],
      ["Vorh\xE4nge", "die"],
      ["Teppich", "der"],
      ["Wand", "die"],
      ["Decke", "die"],
      ["Boden", "der"],
      ["Treppe", "die"],
      ["Flur", "der"],
      // NEUE EINTRÄGE - Technik/Objekte
      ["Bildschirm", "der"],
      ["Tastatur", "die"],
      ["Maus", "die"],
      ["Kabel", "das"],
      ["Stecker", "der"],
      ["Steckdose", "die"],
      ["Lampe", "die"],
      ["Schalter", "der"],
      ["Ger\xE4t", "das"],
      ["Maschine", "die"],
      ["Apparat", "der"],
      ["Anzeige", "die"],
      // NEUE EINTRÄGE - Abstrakta
      ["Gedanke", "der"],
      ["Idee", "die"],
      ["Konzept", "das"],
      ["Theorie", "die"],
      ["M\xF6glichkeit", "die"],
      ["Chance", "die"],
      ["Risiko", "das"],
      ["Gefahr", "die"],
      ["Hoffnung", "die"],
      ["Angst", "die"],
      ["Freude", "die"],
      ["Trauer", "die"],
      // NEUE EINTRÄGE - Personen/Rollen
      ["Mensch", "der"],
      ["Frau", "die"],
      ["Mann", "der"],
      ["Kind", "das"],
      ["Arzt", "der"],
      ["\xC4rztin", "die"],
      ["Lehrer", "der"],
      ["Sch\xFCler", "der"],
      ["Kollege", "der"],
      ["Kollegin", "die"],
      ["Chef", "der"],
      ["Chefin", "die"],
      // NEUE EINTRÄGE - Orte/Räume
      ["Zimmer", "das"],
      ["Wohnung", "die"],
      ["Haus", "das"],
      ["Geb\xE4ude", "das"],
      ["Stra\xDFe", "die"],
      ["Platz", "der"],
      ["Stadt", "die"],
      ["Dorf", "das"],
      ["Wald", "der"],
      ["Feld", "das"],
      ["Berg", "der"],
      ["Tal", "das"],
      // NEUE EINTRÄGE - Zeitbegriffe
      ["Tag", "der"],
      ["Nacht", "die"],
      ["Morgen", "der"],
      ["Abend", "der"],
      ["Stunde", "die"],
      ["Minute", "die"],
      ["Sekunde", "die"],
      ["Augenblick", "der"],
      ["Vergangenheit", "die"],
      ["Gegenwart", "die"],
      ["Zukunft", "die"],
      // NEUE EINTRÄGE - Bürokratie (für bureau-Modus)
      ["Bescheid", "der"],
      ["Verf\xFCgung", "die"],
      ["Genehmigung", "die"],
      ["Ablehnung", "die"],
      ["Antragsformular", "das"],
      ["Eingangsbest\xE4tigung", "die"],
      ["Aktenzeichen", "das"],
      ["Register", "das"],
      ["Kopie", "die"],
      ["Original", "das"],
      ["Dokument", "das"],
      // NEUE EINTRÄGE - Natur (für myth-Modus)
      ["Fluss", "der"],
      ["See", "der"],
      ["Meer", "das"],
      ["Ozean", "der"],
      ["Stein", "der"],
      ["Fels", "der"],
      ["Erde", "die"],
      ["Himmel", "der"],
      ["Sonne", "die"],
      ["Mond", "der"],
      ["Stern", "der"],
      ["Wolke", "die"],
      // NEUE EINTRÄGE - Körper (für body-Modus)
      ["Herz", "das"],
      ["Lunge", "die"],
      ["Magen", "der"],
      ["Haut", "die"],
      ["Blut", "das"],
      ["Tr\xE4ne", "die"],
      ["Schwei\xDF", "der"],
      ["Hand", "die"],
      ["Fu\xDF", "der"],
      ["Kopf", "der"],
      ["Gesicht", "das"],
      ["Auge", "das"]
    ];
    for (const [noun, art] of articleFix) {
      const n = escRE(noun);
      const rx = new RegExp(
        `(^|\\n|[.!?\u2026]\\s+|\\bund\\s+|\\bdoch\\s+|\\bDoch\\s+|\\bDann\\s+|\\bPl\xF6tzlich\\s+)(?!(die|der|das|den|dem|des|ein|eine|einen|einem|einer|eines|mein|dein|sein|ihr|unser|euer)\\s+)(${n})\\b`,
        "giu"
      );
      t = t.replace(rx, (_m, p1, _p2, p3) => `${p1}${art} ${p3}`);
    }
    t = t.replace(
      /\bein\s+([a-zäöü]+)es\s+(Stempel|Geruch|Korridor|Spiegel|Sensor|Plan|Blick)\b/gi,
      (_m, adj, noun) => `ein ${adj}er ${noun}`
    ).replace(
      /\bein\s+([a-zäöü]+)es\s+(Lampe|Uhr|Tür|Stimme|Akte)\b/gi,
      (_m, adj, noun) => `eine ${adj}e ${noun}`
    ).replace(
      /\bein\s+([a-zäöü]+)es\s+(Fenster|Signal|System|Protokoll|Archiv)\b/gi,
      (_m, adj, noun) => `ein ${adj}es ${noun}`
    );
    t = t.replace(/\bIch\s+sucht\b/gi, "Ich suche").replace(/\bich\s+sucht\b/g, "ich suche").replace(/\bIch\s+such\b/gi, "Ich suche").replace(/\bIch\s+wollte\s+will\b/gi, "Ich wollte").replace(/\bich\s+wollte\s+will\b/g, "ich wollte").replace(/\bwill\s+will\b/gi, "will").replace(/\bsteht\s+ich\b/gi, "stehe ich").replace(/\bStand\s+ich\b/gi, "Stand ich");
    t = t.replace(/\bdreht\s+die\s+Logik\b/gi, "dreht sich die Logik").replace(/\bdrehte\s+die\s+Logik\b/gi, "drehte sich die Logik");
    t = t.replace(/\bvor\s+ein\b/gi, "vor einem").replace(/\bvor\s+eine\b/gi, "vor einer").replace(/\bvor\s+einem\s+([a-zäöü]+)es\s+(Signal|Fenster|Zeichen|Muster|Paradoxon)\b/gi, "vor einem $1en $2").replace(/\bvor\s+einem\s+([a-zäöü]+)er\s+(Stempel|Geruch|Korridor|Spiegel|Sensor)\b/gi, "vor einem $1en $2");
    t = t.replace(/(Beim dritten Mal ist es anders:\s*)([^.]+)\s+\1/gi, "$1$2 ");
    t = t.replace(/\bals\s+Beim\b/gi, "als");
    t = t.replace(/([A-Za-zÄÖÜäöü0-9])\.\.(?=\s|$)/g, "$1\u2026");
    t = t.replace(/\.\.(?!\.)/g, ".");
    t = t.replace(/\bbemerkt ich\b/gi, "bemerke ich");
    t = t.replace(/\bIch bemerkt\b/g, "Ich bemerke");
    t = t.replace(/\bIch nimmt\b/gi, "Ich nehme");
    t = t.replace(/\bWir hatte\b/gi, "Wir hatten");
    t = t.replace(/\bwill wird\b/gi, "will");
    t = t.replace(/\bwill selig\b/gi, "will selig werden");
    const ent = [
      ["Zettel", "der"],
      ["Symbol", "das"],
      ["Boden", "der"],
      ["Lampe", "die"],
      ["T\xFCr", "die"],
      ["Korridor", "der"],
      ["Aktenzeichen", "das"],
      ["Stimme", "die"],
      ["Atem", "der"],
      ["Geruch", "der"],
      ["Schl\xFCssel", "der"],
      ["Fenster", "das"],
      ["Signal", "das"]
    ];
    for (const [noun, art] of ent) {
      const n = noun.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const re = new RegExp(`(^|\\n|[.!?\u2026]\\s+|\\bund\\s+|\\bdoch\\s+)(?!die\\s+|der\\s+|das\\s+|den\\s+|dem\\s+|des\\s+|ein\\s+|eine\\s+|einen\\s+|einem\\s+|einer\\s+)(${n})\\b`, "giu");
      t = t.replace(re, (_m, p1, p2) => `${p1}${art} ${p2}`);
    }
    t = t.replace(/\bein verschobenes Stimme\b/gi, "eine verschobene Stimme");
    t = t.replace(/\bein verzerrte Aktenzeichen\b/gi, "ein verzerrtes Aktenzeichen");
    t = t.replace(/\beinen geheime Geruch\b/gi, "einen geheimen Geruch");
    t = t.replace(/\bein zu genaues Boden\b/gi, "ein zu genauer Boden");
    t = t.replace(/\bein mattes Atem\b/gi, "ein matter Atem");
  }
  if (fixPunctuation) {
    t = t.replace(/,+/g, ",").replace(/\s+,/g, ",").replace(/,\s*,/g, ", ").replace(/\s+\./g, ".").replace(/:\s*:/g, ":");
  }
  t = function dedupeAdjacentWords(s) {
    let out = s;
    try {
      const rx = /\b([\p{L}\p{N}_]+)\s+\1\b/giu;
      for (let k = 0; k < 6; k++) {
        const next = out.replace(rx, "$1");
        if (next === out) break;
        out = next;
      }
      return out;
    } catch {
      const rx2 = /\b([A-Za-zÄÖÜäöüß0-9_]+)\s+\1\b/gi;
      for (let k = 0; k < 6; k++) {
        const next = out.replace(rx2, "$1");
        if (next === out) break;
        out = next;
      }
      return out;
    }
  }(t);
  return t.trim();
}

// src/generation/postprocess.ts
var LINE_FORMS = /* @__PURE__ */ new Set(["script", "video", "strang", "reim", "haiku", "poem"]);
var isLineForm = (input) => !!input && !!input.form && LINE_FORMS.has(input.form);
function coherencePass(text, input) {
  try {
    if (isLineForm(input)) return text;
    const t = String(text || "").replace(/\.\s*\.+/g, ".");
    const paras = t.split(/\n{2,}/);
    const freq = {};
    coherenceWords(t).forEach((w) => {
      freq[w] = (freq[w] || 0) + 1;
    });
    const motif = new Set(Object.keys(freq).filter((w) => freq[w] >= 2));
    [input?.who, input?.where, input?.what].forEach((s) => coherenceWords(s || "").forEach((w) => motif.add(w)));
    const allowBreaks = input?.disruptor === "on";
    const maxRemove = Math.max(1, Math.floor(splitSentences(t).length * 0.25));
    let removed = 0;
    const outParas = [];
    paras.forEach((p, pi) => {
      const sents = splitSentences(p);
      const kept = sents.filter((s, si) => {
        const bare = s.trim().replace(/["»«)\]]+$/, "").replace(/[.!?…]+$/, "").trim();
        if (/(^|\s)(ein|eine|einem|einen|einer|eines|der|die|das|dem|den|des|und|oder|aber|wie|mit|an|auf|zu|im|am|vor|nach|für|ohne|als|bei|aus|ist|sind|wird)$/i.test(bare) && bare.split(/\s+/).length <= 12) {
          removed++;
          return false;
        }
        if (removed >= maxRemove) return true;
        const late = pi === paras.length - 1 && sents.length >= 4 && si >= Math.floor(sents.length / 2);
        if (late) {
          const cw = coherenceWords(s);
          if (cw.length >= 2 && !cw.some((w) => motif.has(w))) {
            if (allowBreaks && Math.random() < 0.5) return true;
            removed++;
            return false;
          }
        }
        return true;
      });
      if (kept.length) outParas.push(kept.join(" "));
    });
    const result = outParas.join("\n\n").trim();
    return result.length >= 60 ? result : text;
  } catch {
    return text;
  }
}
function coherenceRepairV2(t, input) {
  t = String(t ?? "");
  t = t.replace(/\(\s*[A-ZÄÖÜ][\wäöüß-]{2,}\s*\)/g, " ");
  t = t.replace(/,\s*([.!?…])/g, "$1");
  t = t.replace(/([.!?…])\s*,/g, ",");
  t = t.replace(/\s*,\s*,\s*/g, ", ");
  t = t.replace(/„\s+/g, "\u201E").replace(/\s+"/g, '"');
  t = t.replace(/([.!?…])\s*\1+/g, "$1");
  if ((t.match(/"/g) || []).length % 2 === 1) t = t.replace(/"/g, "");
  {
    const o = (t.match(/„/g) || []).length, c = (t.match(/[“”]/g) || []).length;
    if (o !== c) t = t.replace(/[„“”]/g, "");
  }
  t = t.replace(/\bich'(?=\s)/gi, "meine").replace(/\bdu'(?=\s)/gi, "deine").replace(/\bwir'(?=\s)/gi, "unsere").replace(/\ber'(?=\s)/gi, "seine").replace(/\bsie'(?=\s)/gi, "ihre").replace(/\bes'(?=\s)/gi, "seine");
  t = t.replace(/(:\s+)([a-zäöüß][^.!?…]*)/g, (m, p1, rest) => looksLikeFullClause(null, rest) || /^(warum|weshalb|wieso|wie|was|wer|wen|wem|wann|wo|wohin|woher|ob)\b/i.test(rest) ? p1 + rest.charAt(0).toUpperCase() + rest.slice(1) : m);
  String(input?.who || "").split(/[,;]/).map((x) => x.trim()).filter(Boolean).forEach((n) => {
    const esc = escapeRegExp(n);
    try {
      t = t.replace(new RegExp("\\b" + esc + "(s|')?\\b", "giu"), (_m, suf) => n + (suf || ""));
    } catch {
    }
  });
  if (isLineForm(input)) {
    return t.replace(/\s{2,}/g, " ").replace(/\s+([,.;:!?])/g, "$1").trim();
  }
  const DU = [
    [/\btritt\b/g, "trittst"],
    [/\bhält\b/g, "h\xE4ltst"],
    [/\bnimmt\b/g, "nimmst"],
    [/\bsieht\b/g, "siehst"],
    [/\bgeht\b/g, "gehst"],
    [/\bsteht\b/g, "stehst"],
    [/\bträgt\b/g, "tr\xE4gst"],
    [/\bführt\b/g, "f\xFChrst"],
    [/\bfindet\b/g, "findest"],
    [/\bsucht\b/g, "suchst"],
    [/\bkommt\b/g, "kommst"],
    [/\bbricht\b/g, "brichst"]
  ];
  const sents = t.split(/(?<=[.!?…])\s+/).filter(Boolean);
  const kept = [];
  for (let s of sents) {
    const bare = s.trim().replace(/["“”»«]+$/, "").replace(/[.!?…]+$/, "").trim();
    const opens = (s.match(/„/g) || []).length, closes = (s.match(/[“”»]/g) || []).length;
    if (/\bSatz\s+„/.test(s) && opens > closes) continue;
    if (/,\s+(die|der|das|dem|den|des)\s+(die|der|das|dem|den|des)\s+\p{L}+$/iu.test(bare)) continue;
    if (opens > closes) s = s.replace(/„\s*/g, "");
    const di = s.search(/\bdu\b/i);
    if (di >= 0) {
      const head = s.slice(0, di);
      let tail = s.slice(di);
      const wechsel = tail.search(/\b(?:aber|und|doch|denn|sondern|oder|während|als)\s+(?:er|sie|es|man|wir|ihr|der|die|das)\b/i);
      let rest = "";
      if (wechsel > 0) {
        rest = tail.slice(wechsel);
        tail = tail.slice(0, wechsel);
      }
      DU.forEach(([re, rep]) => {
        tail = tail.replace(re, rep);
      });
      s = head + tail + rest;
    }
    const _st = s.trim();
    if (kept.length && kept[kept.length - 1] === _st) continue;
    kept.push(_st);
  }
  t = kept.join(" ");
  t = t.replace(/(\bich und [A-ZÄÖÜ][\wäöüß]+[^.!?…]*?)\bsie sich\b/gu, "$1wir uns");
  t = t.replace(/([A-ZÄÖÜ][\wäöüß]+ und ich[^.!?…]*?)\bsie sich\b/gu, "$1wir uns");
  const CONN2 = [/\bDann kippt es\b/gi, /\bDabei:\s*plötzlich\b/gi, /\bUnd immer wieder\b/gi, /\bAm Ende bleibt klar\b/gi];
  CONN2.forEach((re) => {
    let n = 0;
    t = t.replace(re, (m) => ++n > 1 ? "" : m);
  });
  t = t.replace(/\s{2,}/g, " ").replace(/\s+([,.;:!?])/g, "$1").replace(/„\s+/g, "\u201E").trim();
  return t;
}
function postProcessText(txt, input) {
  let t = (txt ?? "").toString();
  t = t.replace(/(^|[.!?…]\s+)([a-zäöü])/g, (_m, p1, p2) => p1 + p2.toUpperCase());
  t = t.replace(/\b(und|oder|aber|denn|sondern|sowie)(\s+)(die|der|das|den|dem|des|ein|eine|einen|einem|einer|sie|er|es|man|wir|ich|du|ihr|ihre|sein|seine|dann|dabei|dadurch|vielleicht|plötzlich)\b/gi, (_m, c, sp, w) => c + sp + w.charAt(0).toLowerCase() + w.slice(1));
  const name = (input?.who ?? "").toString().trim();
  if (name) {
    const esc = escapeRegExp(name);
    try {
      t = t.replace(new RegExp(`(?<![\\p{L}\\p{N}_])${esc}(?![\\p{L}\\p{N}_])`, "giu"), name);
    } catch {
      t = t.replace(new RegExp(`\\b${esc}\\b`, "gi"), name);
    }
  }
  if (!isLineForm(input) && !input?.polish && input?.tone && TONE_DATA[input.tone]) {
    const td = TONE_DATA[input.tone];
    if (td.opener.length) t = `${pick(td.opener)} ${t}`;
    if (td.flavor.length) {
      const wc = t.trim().split(/\s+/).filter(Boolean).length;
      const inserts = Math.min(3, Math.max(1, Math.round(wc / 90)));
      for (let i = 0; i < inserts; i++) t = insertToneFlavor(t, pick(td.flavor));
    }
    t = applyToneRegister(t, input.tone);
  }
  if (input?.polish) {
    t = polishGerman(t, { who: name, style: input?.polishStyle || "surreal_precise", fixCapitalization: false });
  }
  t = coherencePass(t, input);
  t = coherenceRepairV2(t, input);
  t = t.replace(/(^|[.!?…]\s+)([a-zäöü])/g, (_m, p1, p2) => p1 + p2.toUpperCase());
  t = t.replace(/\b(und|oder|aber|denn|sondern|sowie)(\s+)(die|der|das|den|dem|des|ein|eine|einen|einem|einer|sie|er|es|man|wir|ich|du|ihr|ihre|sein|seine|dann|dabei|dadurch|vielleicht|plötzlich)\b/gi, (_m, c, sp, w) => c + sp + w.charAt(0).toLowerCase() + w.slice(1));
  return t.trim();
}

// src/generation/structures.ts
var rot = (key, arr) => arr[pickFreshIndex(key, arr.length)];
function buildLinear(kit) {
  const M = kit.mode;
  const opener = rot("lin.opener", [
    `${kit.T} ${kit.W} bemerkt ${kit.P} ${kit.hookAcc}.`,
    `${kit.T} ${kit.W} findet ${kit.P} ${kit.hookAcc}.`,
    `${kit.P} sieht ${kit.hookAcc} \u2014 ${kit.T}, ${kit.W}.`,
    `Zuerst ${kit.W}, ${kit.T}: ${kit.P} bemerkt ${kit.hookAcc}.`,
    `${kit.T} ${kit.W}. ${kit.P} h\xE4lt ${kit.hookAcc} fest.`
  ]);
  const goal = kit.AisClause ? rot("lin.goalC", [
    `${kit.P} stellt fest: ${kit.Apure} \u2014 aber ${kit.obstacle}.`,
    `${kit.P} begreift: ${kit.Apure}. Doch ${kit.obstacle}.`,
    `Klar wird: ${kit.Apure}. Nur ${kit.obstacle}.`
  ]) : rot("lin.goal", [
    `${kit.P} ${kit.AleadVerb || "will"} ${kit.Apure}, aber ${kit.obstacle}.`,
    `${kit.P} ${kit.AleadVerb || "will"} ${kit.Apure} \u2014 ${kit.obstacle}.`,
    `Was ${kit.P} ${kit.AleadVerb || "will"}: ${kit.Apure}. Was im Weg steht: ${kit.obstacle}.`
  ]);
  const action = rot("lin.action", [
    `${kit.P} nimmt ${kit.propAcc} und ${pick(["tritt n\xE4her", "fragt nach", "h\xE4lt den Blick aus", "\xF6ffnet, was verschlossen war", "bleibt stehen"])}.`,
    `${kit.P} h\xE4lt ${kit.propAcc} und ${pick(["z\xF6gert", "atmet durch", "macht den ersten Schritt", "h\xF6rt auf zu z\xE4hlen"])}.`,
    `${kit.P} greift nach dem, was bleibt, und ${pick(["wartet", "horcht", "rechnet", "beginnt"])}.`,
    `${kit.P} legt ${kit.propAcc} beiseite und ${pick(["sieht auf", "sagt es doch", "dreht sich um", "bleibt"])}.`
  ]);
  const modeSpice = pick([
    `Es riecht ${rot("mode.img", M.images)}. ${rot("mode.rule", M.rules)}`,
    `${rot("mode.rule", M.rules)} Es riecht ${rot("mode.img", M.images)}.`,
    `Irgendwo ${rot("mode.img", M.images)}. ${rot("mode.rule", M.rules)}`
  ]);
  const beats = [opener, modeSpice, goal, action, frameTurn(kit.turn), reframeStake(kit.stake), kit.ending];
  if (Math.random() < 0.4) beats.splice(4, 0, `${pick(["Ein Ger\xE4usch", "Ein Licht", "Ein Schatten", "Ein Zug Luft"])} ${pick(["ver\xE4ndert alles", "bleibt", "kippt den Moment", "zieht vorbei"])}.`);
  return joinBeats(beats, kit.P);
}
function buildReverse(kit) {
  const M = kit.mode;
  const end = `${kit.ending}`;
  const reveal = `Du erf\xE4hrst erst sp\xE4ter: ${kit.motif} \u2014 das war der Anfang.`;
  const before = `${kit.P} hatte ${kit.propAcc} schon in der Hand, denn ${kit.obstacle}.`;
  const inciting = `${kit.T} ${kit.W}: ${kit.hook}.`;
  const rule = `${rot("mode.rule", M.rules)} Es riecht ${rot("mode.img", M.images)}.`;
  const turn = `Und dann, r\xFCckw\xE4rts betrachtet: ${kit.turn}.`;
  return joinBeats([end, reveal, reframeStake(kit.stake), turn, before, rule, inciting], kit.P);
}
function buildCircle(kit) {
  const M = kit.mode;
  const a = rot("circ.a", [
    `${kit.T} ${kit.W} steht ${kit.P} vor ${kit.hookDat}.`,
    `${kit.T} ${kit.W}: wieder ${kit.hookDat} gegen\xFCber steht ${kit.P}.`,
    `Am Anfang steht ${kit.P} vor ${kit.hookDat}. ${kit.T}, ${kit.W}.`
  ]);
  const b = kit.AisClause ? `${kit.P} bemerkt: ${kit.Apure}. ${rot("mode.rule", M.rules)}` : `${kit.P} ${kit.AleadVerb || (kit.AisInfinitiveLed ? "will" : "sucht")} ${kit.Apure}. ${rot("mode.rule", M.rules)}`;
  const c = `Die Dinge werden ${pick(["fremd", "zu klar", "unruhig", "pr\xE4zise"])}, denn ${kit.obstacle}.`;
  let t = joinBeats([a, b, c, frameTurn(kit.turn), reframeStake(kit.stake), kit.ending], kit.P);
  t = weaveMotif(t, kit.motif);
  t += " " + ensurePunct(pick([`Und wieder: ${kit.hook}`, `Und von vorn: ${kit.hook}`, `Der Kreis schlie\xDFt sich: ${kit.hook}`]));
  return t;
}
function buildFragment(kit) {
  const M = kit.mode;
  const beats = [
    cap(ensurePunct(kit.hook)),
    cap(ensurePunct(kit.obstacle)),
    cap(frameTurn(kit.turn)),
    cap(ensurePunct(`${kit.P} h\xE4lt ${kit.propAcc}`)),
    cap(ensurePunct(rot("mode.rule", M.rules))),
    cap(ensurePunct(`Es riecht ${rot("mode.img", M.images)}`)),
    cap(reframeStake(kit.stake)),
    cap(ensurePunct(kit.ending))
  ];
  for (let i = beats.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [beats[i], beats[j]] = [beats[j], beats[i]];
  }
  const marks = [
    "Sp\xE4ter.",
    "Davor.",
    "Viel fr\xFCher.",
    "Und dann, ohne \xDCbergang.",
    "Irgendwann dazwischen.",
    "R\xFCckw\xE4rts betrachtet.",
    `Gegen ${randomFragmentTime()}.`
  ];
  for (let i = marks.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [marks[i], marks[j]] = [marks[j], marks[i]];
  }
  const woven = [];
  let mi = 0;
  beats.forEach((b, i) => {
    if (i > 0 && Math.random() < 0.5 && mi < marks.length) woven.push(marks[mi++]);
    woven.push(b);
  });
  return joinBeats(woven, kit.P);
}
function buildObjectCentric(kit) {
  const M = kit.mode;
  const obj = pick(M.nouns);
  const P = kit.P;
  const a = `Ich bin ${obj}. Ich liege ${kit.W}.`;
  const b = `Ich kenne ${P}. Ich kenne ${kit.hookAcc}.`;
  const c = `Sie nennen es ${pick(["Fehler", "Vorgang", "Omen", "Signal", "Symptom", "Protokoll", "Zufall", "Nichts"])}. Ich nenne es ${pick(["Erinnerung", "Beweis", "Anfang", "Schuld"])}.`;
  const d = ensurePunct(rot("mode.rule", M.rules));
  const e = kit.AisClause ? `${P} sp\xFCrt: ${kit.Apure}. ${kit.obstacle}.` : `${P} ${kit.AleadVerb || "will"} ${kit.Apure}. ${kit.obstacle}.`;
  const f = pick([`Dann sp\xFCre ich: ${kit.turn}.`, `Und dann, durch mich hindurch: ${kit.turn}.`, `Ich registriere: ${kit.turn}.`]);
  return joinBeats([a, b, c, d, e, f, reframeStake(kit.stake), kit.ending], kit.P);
}
var BUILDERS = {
  linear: buildLinear,
  reverse: buildReverse,
  circle: buildCircle,
  fragment: buildFragment,
  object: buildObjectCentric
};
function pickStructureBuilder(structure) {
  return BUILDERS[structure] || buildLinear;
}

// src/generation/markovTrace.ts
var frags = [];
function resetMarkovTrace() {
  frags = [];
}
function traceMarkov(s) {
  const t = (s || "").trim();
  if (t.length >= 5) frags.push(t);
}
function getMarkovTrace() {
  return frags.slice();
}

// src/generation/archetypes.data.ts
var ARCHETYPES = {
  "neutral": {
    "label": "Neutral",
    "weights": {
      "mode": {
        "bureau": 1,
        "tech": 1,
        "body": 1,
        "myth": 1,
        "absurd": 1,
        "post": 1
      },
      "structure": {
        "linear": 1,
        "reverse": 1,
        "circle": 1,
        "fragment": 1,
        "object": 1
      },
      "perspective": {
        "third": 1,
        "first": 1,
        "second": 1,
        "we": 1,
        "object": 1
      },
      "rhythm": {
        "breath": 1,
        "staccato": 1,
        "long": 1,
        "fracture": 1,
        "clean": 1
      }
    },
    "add": {
      "motifs": [],
      "hooks": [],
      "props": [],
      "turns": [],
      "obstacles": [],
      "stakes": [],
      "endings": []
    },
    "speakers": [
      "Die Stimme",
      "Das System",
      "Ein Unbekannter",
      "Das Archiv",
      "Der Apparat"
    ]
  },
  "skorpion": {
    "label": "Skorpion",
    "weights": {
      "mode": {
        "body": 2.6,
        "bureau": 1.6,
        "myth": 1.2,
        "absurd": 1.1,
        "tech": 1,
        "post": 1
      },
      "structure": {
        "circle": 2,
        "fragment": 1.6,
        "reverse": 1.3,
        "linear": 1.1,
        "object": 1.2
      },
      "perspective": {
        "second": 2.2,
        "first": 1.7,
        "third": 1.2,
        "we": 1,
        "object": 0.9
      },
      "rhythm": {
        "breath": 2,
        "staccato": 1.4,
        "fracture": 1.2,
        "long": 1,
        "clean": 0.9
      }
    },
    "add": {
      "motifs": [
        "ein Blick, der festh\xE4lt",
        "eine N\xE4he, die Kontrolle wird",
        "ein Geheimnis mit Puls",
        "ein Satz, der Besitz markiert"
      ],
      "hooks": [
        "eine Hand auf dem Nacken",
        "ein Fl\xFCstern, das an dir klebt",
        "eine Spur, die dich w\xE4hlt"
      ],
      "turns": [
        "die N\xE4he kippt in Kontrolle",
        "die Wahrheit wird Besitz",
        "das Begehren wird zur Regel"
      ],
      "obstacles": [
        "du darfst nicht frei sprechen",
        "jemand legt fest, was du meinst",
        "eine Grenze wird unsichtbar gezogen"
      ],
      "stakes": [
        "Der Einsatz ist Bindung.",
        "Der Einsatz ist Kontrolle.",
        "Der Einsatz ist Wahrheit: in deiner Hand."
      ],
      "endings": [
        "Und du wusstest, wem es geh\xF6rt.",
        "Und der Blick blieb.",
        "Und die N\xE4he war das Urteil."
      ]
    },
    "speakers": [
      "Die Zeugin",
      "Der Blick",
      "Die Hand",
      "Die Stimme",
      "Der Vermerk"
    ]
  },
  "psychopath": {
    "label": "Psychopath",
    "weights": {
      "mode": {
        "bureau": 2.2,
        "tech": 1.9,
        "absurd": 1.4,
        "post": 1.3,
        "body": 1,
        "myth": 0.9
      },
      "structure": {
        "reverse": 1.9,
        "object": 1.7,
        "fragment": 1.4,
        "linear": 1.1,
        "circle": 1
      },
      "perspective": {
        "third": 2,
        "object": 1.8,
        "first": 1.2,
        "second": 1.1,
        "we": 0.9
      },
      "rhythm": {
        "clean": 2,
        "staccato": 1.6,
        "long": 1.1,
        "fracture": 1.1,
        "breath": 0.9
      }
    },
    "add": {
      "motifs": [
        "ein Protokoll ohne Gef\xFChl",
        "eine Diagnose im Rand",
        "ein Experiment mit Namen",
        "eine Moral als Variable"
      ],
      "hooks": [
        "ein Befund ohne Ursache",
        "ein Blick wie Messung",
        "eine Akte, die kalt bleibt"
      ],
      "turns": [
        "die Erkl\xE4rung wird zur Waffe",
        "das Subjekt wird Objekt",
        "die Empathie wird gestrichen"
      ],
      "obstacles": [
        "die Zust\xE4ndigkeit ist unklar",
        "ein Beweis fehlt",
        "die Definition ist nicht abschlie\xDFend"
      ],
      "stakes": [
        "Der Einsatz ist G\xFCltigkeit.",
        "Der Einsatz ist Kontrolle: \xFCber Bedeutung.",
        "Der Einsatz ist Eindeutigkeit."
      ],
      "endings": [
        "Damit ist der Vorgang abgeschlossen.",
        "Und der Befund blieb bestehen.",
        "Und niemand musste f\xFChlen."
      ]
    },
    "speakers": [
      "Der Gutachter",
      "Das Protokoll",
      "Die Instanz",
      "Der Operator",
      "Die Akte"
    ]
  },
  "entdecker": {
    "label": "Entdecker",
    "weights": {
      "mode": {
        "myth": 2.1,
        "mystery": 0,
        "tech": 1.4,
        "absurd": 1.3,
        "body": 1.1,
        "bureau": 1,
        "post": 1
      },
      "structure": {
        "fragment": 1.8,
        "linear": 1.6,
        "circle": 1.3,
        "object": 1.2,
        "reverse": 1
      },
      "perspective": {
        "first": 1.7,
        "we": 1.6,
        "second": 1.2,
        "third": 1.1,
        "object": 1
      },
      "rhythm": {
        "long": 1.8,
        "breath": 1.4,
        "fracture": 1.2,
        "clean": 1,
        "staccato": 0.9
      }
    },
    "add": {
      "motifs": [
        "eine Karte, die weiterf\xFChrt",
        "ein Rand, der ruft",
        "eine T\xFCr hinter der T\xFCr",
        "ein Zeichen, das Richtung hat"
      ],
      "hooks": [
        "eine Spur im Staub",
        "ein Lichtstreifen im Wasser",
        "eine Kante, die einl\xE4dt"
      ],
      "turns": [
        "der Ausgang ist innen",
        "die Spur f\xFChrt nach innen",
        "die Richtung wird zum Gesetz"
      ],
      "obstacles": [
        "der Weg verschiebt sich",
        "die Karte widerspricht sich",
        "die T\xFCr ist da, aber anders"
      ],
      "stakes": [
        "Der Einsatz ist Mut.",
        "Der Einsatz ist Richtung.",
        "Der Einsatz ist Entdeckung."
      ],
      "endings": [
        "Und du gingst weiter.",
        "Und der Ort \xF6ffnete sich.",
        "Und die Richtung blieb."
      ]
    },
    "speakers": [
      "Die Karte",
      "Der Weg",
      "Die T\xFCr",
      "Der Rand",
      "Das Zeichen"
    ]
  }
};

// src/generation/archetype.ts
function arch(id) {
  return ARCHETYPES[id] || ARCHETYPES.neutral;
}
function archetypeAugmentList(baseList, archA, archB, key) {
  const A = arch(archA), B = arch(archB);
  const extra = [].concat(A.add?.[key] || []).concat(B.add?.[key] || []);
  const base = Array.isArray(baseList) ? baseList : [];
  if (extra.length) return base.concat(extra, extra);
  return base;
}

// src/generation/shape.ts
function applyDisruptor(text, level) {
  const p = level === "off" ? 0 : level === "on" ? 0.33 : 0.17;
  if (!chance(p)) return { text, fired: false, kind: "\u2013" };
  const kinds = [
    { kind: "Zeitbruch", fn: (t) => t + " Drei Jahre sp\xE4ter ist die gleiche Stelle noch da, aber das Ger\xE4usch ist \xE4lter." },
    { kind: "Erz\xE4hlerwechsel", fn: (t) => t.replace(/\n\n/g, "\n\n\u2014\n\n") + "\n\nIch \xFCbernehme hier. Nur kurz. Nur, um das Offensichtliche zu sagen." },
    { kind: "Metakommentar", fn: (t) => t + "\n\n(Diese Geschichte wei\xDF, dass sie erz\xE4hlt wird.)" },
    { kind: "Wiederholung", fn: (t) => {
      const s = splitSentences(t);
      if (s.length < 3) return t;
      return t + "\n\n" + s[Math.floor(s.length * 0.65)];
    } },
    { kind: "Fragmentierung", fn: (t) => {
      const s = splitSentences(t);
      if (s.length < 4) return t;
      s.splice(Math.floor(s.length / 2), 0, "\u2014");
      return s.join(" ");
    } }
  ];
  const k = pick(kinds);
  return { text: k.fn(text), fired: true, kind: k.kind };
}
var FRAGMENTS = ["Stille.", "Zu nah.", "Zu klar.", "Ein Fehler.", "Noch nicht.", "Dann.", "Nein.", "Vielleicht.", "Fast.", "Genau jetzt."];
function applyRhythm(text, rhythm) {
  const s = splitSentences(text);
  const insertFrag = (prob) => {
    if (chance(prob)) {
      const pos = chooseInsertPos(s);
      if (pos >= 0) s.splice(pos, 0, pick(FRAGMENTS));
    }
  };
  if (rhythm === "clean") return s.join(" ");
  if (rhythm === "breath") {
    insertFrag(0.55);
    if (s.length >= 5 && chance(0.45)) {
      const i = Math.floor(1 + Math.random() * (s.length - 2));
      s[i] = "Und " + s[i].charAt(0).toLowerCase() + s[i].slice(1);
    }
  }
  if (rhythm === "staccato") {
    insertFrag(0.75);
    if (s.length >= 4 && chance(0.6)) {
      const i = Math.floor(1 + Math.random() * (s.length - 2));
      const t = s[i];
      const cut = t.indexOf(", ");
      if (cut > 10 && cut < 80) {
        s[i] = t.slice(0, cut) + ".";
        s.splice(i + 1, 0, t.slice(cut + 2));
      }
    }
    if (chance(0.35)) {
      const at = Math.min(2, s.length);
      if (!isFragmentSentence(s[at - 1] || "") && !isFragmentSentence(s[at] || "")) s.splice(at, 0, pick(["Stille.", "Warte.", "So.", "Gut."]));
    }
  }
  if (rhythm === "long") {
    if (s.length >= 6 && chance(0.6)) {
      const i = Math.floor(1 + Math.random() * (s.length - 3));
      const first = s[i].replace(/[.!?…]+$/, "");
      const next = s[i + 1];
      const joiner = /^(und|aber|doch|denn|sondern)\b/i.test(next) ? ", " : chance(0.5) ? ", und " : "; ";
      s[i] = first + joiner + next.charAt(0).toLowerCase() + next.slice(1);
      s.splice(i + 1, 1);
    }
    if (chance(0.4)) s.push("Und w\xE4hrend all das geschieht, bleibt etwas in der Luft h\xE4ngen, als w\xE4re es nie f\xFCr Menschen gedacht gewesen.");
  }
  if (rhythm === "fracture") {
    insertFrag(0.7);
    if (s.length >= 5 && chance(0.6)) {
      const i = Math.floor(1 + Math.random() * (s.length - 2));
      s[i] = s[i].replace(/[.!?…]+$/, "") + " \u2014";
      s.splice(i + 1, 0, "und genau dort bricht die Erkl\xE4rung ab.");
    }
    if (chance(0.45)) s.splice(Math.floor(s.length * 0.65), 0, "(Dieser Satz war nicht geplant.)");
  }
  return s.join(" ");
}
var TENSION_CENTER = { top: 0.15, mid: 0.5, low: 0.85 };
function applyTension(text, peak, material) {
  if (!peak || peak === "off") return text;
  const center = TENSION_CENTER[peak];
  if (center === void 0) return text;
  const s = splitSentences(text);
  if (s.length < 5) return text;
  const width = 0.26;
  const intensity = (i, n) => {
    const pos = n <= 1 ? 0 : i / (n - 1);
    const d = (pos - center) / width;
    return Math.exp(-0.5 * d * d);
  };
  for (let i = s.length - 1; i >= 0; i--) {
    const it = intensity(i, s.length);
    if (it > 0.6 && chance(it * 0.7)) {
      const t = s[i];
      const cut = t.indexOf(", ");
      if (cut > 10 && cut < 90) {
        s[i] = t.slice(0, cut) + ".";
        s.splice(i + 1, 0, cap(t.slice(cut + 2)));
      }
    }
  }
  for (let pass = 0; pass < 2; pass++) {
    const idx = Math.round(center * (s.length - 1));
    if (idx > 0 && idx < s.length && chance(0.55) && !isFragmentSentence(s[idx - 1] || "") && !isFragmentSentence(s[idx] || "")) {
      s.splice(idx, 0, pick(FRAGMENTS));
    }
  }
  for (let i = 0; i < s.length - 1; i++) {
    if (s.length <= 4) break;
    const it = intensity(i, s.length);
    if (it < 0.3 && chance((0.3 - it) * 1.2)) {
      const first = s[i].replace(/[.!?…]+$/, "");
      const next = s[i + 1];
      if (first.length + next.length < 160 && !isFragmentSentence(first) && !isFragmentSentence(next)) {
        const joiner = /^(und|aber|doch|denn|sondern)\b/i.test(next) ? ", " : chance(0.5) ? ", und " : "; ";
        const cont = joiner === "; " ? next : next.charAt(0).toLowerCase() + next.slice(1);
        s[i] = first + joiner + cont;
        s.splice(i + 1, 1);
        i--;
      }
    }
  }
  const mat = [...material?.hooks || [], ...material?.motifs || []].map((x) => (x || "").trim()).filter((x) => x.length >= 4);
  if (mat.length) {
    for (let k = 0; k < 2; k++) {
      const cand = pick(mat);
      if (!cand || s.join(" ").toLowerCase().includes(cand.toLowerCase())) continue;
      if (!chance(0.7)) continue;
      const idx = Math.max(1, Math.min(s.length, Math.round(center * (s.length - 1)) + k));
      s.splice(idx, 0, cap(cand.replace(/[.!?…]+$/, "")) + ".");
    }
  }
  {
    const idx = Math.round(center * (s.length - 1));
    if (idx > 0 && idx < s.length - 1 && chance(0.5)) {
      const t = s[idx].replace(/[.!?…]+$/, "");
      if (t.length > 12 && !isFragmentSentence(t)) {
        s[idx] = t + " \u2014";
        s.splice(idx + 1, 0, pick(["und genau hier kippt es.", "kein Zur\xFCck.", "jetzt.", "und nichts h\xE4lt mehr."]));
      }
    }
  }
  return s.join(" ");
}
function paragraphize(txt) {
  const s = splitSentences(txt);
  if (s.length <= 3) return txt;
  const breaks = /* @__PURE__ */ new Set();
  const target = chance(0.6) ? 2 : 1;
  while (breaks.size < target) breaks.add(Math.min(s.length - 2, Math.max(1, Math.floor(1 + Math.random() * (s.length - 2)))));
  const out = [];
  for (let i = 0; i < s.length; i++) {
    out.push(s[i]);
    if (breaks.has(i)) out.push("\n\n");
  }
  return out.join(" ").replace(/\s+\n\n\s+/g, "\n\n").trim();
}
function guessPronoun(P) {
  const p = clean(P);
  if (/^(der|ein)\s/i.test(p)) return "er";
  if (/^(die|eine)\s/i.test(p)) return "sie";
  if (/^das\s/i.test(p)) return "es";
  if (/(a|e|in)$/i.test(p)) return "sie";
  return "er";
}
function applyPerspective(paras, perspective, who, objName) {
  const P = clean(who) || "Jemand";
  const O = clean(objName) || "das Objekt";
  const swap = (s, person, pronoun) => {
    if (!P) return s;
    try {
      const re = new RegExp("([A-Za-z\xC4\xD6\xDC\xE4\xF6\xFC\xDF]+\\s+)?\\b" + escapeRegExp(P) + "\\b(\\s+[A-Za-z\xC4\xD6\xDC\xE4\xF6\xFC\xDF]+)?", "g");
      return s.replace(re, (_m, before, after) => {
        const bw = before ? before.trim() : "";
        const aw = after ? after.trim() : "";
        if (bw && VERB_CONJ[bw.toLowerCase()]) return conjugateVerbToken(bw, person) + " " + pronoun + (after || "");
        if (aw && VERB_CONJ[aw.toLowerCase()]) return (before || "") + pronoun + " " + conjugateVerbToken(aw, person);
        return (before || "") + pronoun + (after || "");
      });
    } catch {
      return s.replace(new RegExp("\\b" + escapeRegExp(P) + "\\b", "gi"), pronoun);
    }
  };
  const toFirst = (s) => swap(s, "ich", "ich");
  const toSecond = (s) => swap(s, "du", "du");
  const toWe = (s) => swap(s, "wir", "wir");
  const toObject = (s) => `(${O}) ${s}`;
  if (perspective === "third") return paras;
  if (perspective === "first") return paras.map(toFirst);
  if (perspective === "second") return paras.map(toSecond);
  if (perspective === "we") return paras.map(toWe);
  if (perspective === "object") return paras.map(toObject);
  const cycle = ["first", "second", "third", "object"];
  return paras.map((p, i) => {
    const k = cycle[i % cycle.length];
    if (k === "first") return toFirst(p);
    if (k === "second") return toSecond(p);
    if (k === "object") return toObject(p);
    return p;
  });
}
function pronominalize(text, P, pronoun) {
  const name = clean(P);
  if (!name || !pronoun) return text;
  let re;
  try {
    re = new RegExp(`^${escapeRegExp(name)}\\s+[a-z\xE4\xF6\xFC\xDF]`);
  } catch {
    return text;
  }
  let seen = false, lastReplaced = false;
  return text.split(/\n\n+/).map((par) => {
    const s = splitSentences(par);
    for (let i = 0; i < s.length; i++) {
      if (!re.test(s[i])) continue;
      if (!seen) {
        seen = true;
        lastReplaced = false;
        continue;
      }
      if (lastReplaced) {
        lastReplaced = false;
        continue;
      }
      s[i] = cap(pronoun) + s[i].slice(name.length);
      lastReplaced = true;
    }
    return s.join(" ");
  }).join("\n\n");
}

// src/constants.ts
var STORAGE_BANK = "divergenz_wordbank_v1";
var STORAGE_CORPUS = "divergenz_persistent_corpus_v1";
var STORAGE_SETTINGS = "divergenz_settings_v1";
var CORPUS_MAX = 16e4;
var BANK_KEYS = [
  "motifs",
  "hooks",
  "props",
  "turns",
  "obstacles",
  "stakes",
  "endings"
];
var DEFAULT_BANK = {
  motifs: [
    "eine Uhr, die r\xFCckw\xE4rts tickt",
    "eine T\xFCr, die von innen atmet",
    "ein Spiegelbild, das zu sp\xE4t reagiert",
    "ein Formular mit einem Feld zu viel",
    "ein Kabel, das warm wird, ohne Strom",
    "eine Narbe, die sich erinnert",
    "ein Name, der nicht ausgesprochen werden kann",
    "ein Licht, das die falschen Dinge zeigt",
    "ein Ger\xE4usch, das nur in Gedanken existiert",
    "eine Karte, die Orte erfindet"
  ],
  hooks: [
    "eine rote Feder im falschen Winkel",
    "ein Lichtstreifen, der aus dem Nichts kommt",
    "ein leises Klopfen hinter der Wand",
    "ein Foto, das ein Detail mehr zeigt als gestern",
    "ein Schatten, der nicht zur Figur passt",
    "eine Nachricht ohne Absender",
    "eine T\xFCr, die pl\xF6tzlich nicht mehr T\xFCr sein will"
  ],
  props: [
    "einen Schl\xFCssel",
    "eine Karte",
    "eine M\xFCnze",
    "ein Foto",
    "ein Notizbuch",
    "eine Lampe",
    "ein St\xFCck Kreide",
    "einen Kompass",
    "einen Ausweis",
    "ein Siegel"
  ],
  turns: [
    "pl\xF6tzlich passt die Zeit nicht mehr zu den Uhren",
    "die Spur f\xFChrt nicht nach au\xDFen, sondern nach innen",
    "das Offensichtliche wird unbenennbar",
    "etwas antwortet \u2013 ohne Stimme",
    "die Logik bleibt bestehen, aber in falscher Reihenfolge"
  ],
  obstacles: [
    "die T\xFCr ist verschlossen",
    "jemand h\xF6rt mit",
    "die eigene Wahrnehmung wackelt",
    "eine Regel gilt, die niemand erkl\xE4rt",
    "die Akte tr\xE4gt das falsche Datum"
  ],
  stakes: [
    "Der Einsatz ist Mut.",
    "Der Einsatz ist Zeit: Ein Teil des Abends kommt nicht zur\xFCck.",
    "Der Einsatz ist Wahrheit: Etwas am Selbstbild verschiebt sich.",
    "Der Einsatz ist Vertrauen: in sich selbst."
  ],
  endings: [
    "Damit ist es entschieden.",
    "So schlie\xDFt sich der Kreis.",
    "Und vielleicht beginnt es erst hier.",
    "Und die T\xFCr fiel ins Schloss.",
    "Und es war, als h\xE4tte der Ort kurz geblinzelt."
  ]
};

// src/features/storage-status.ts
function isQuotaError(e) {
  if (!(e instanceof DOMException)) return false;
  return e.name === "QuotaExceededError" || e.name === "NS_ERROR_DOM_QUOTA_REACHED" || e.code === 22 || e.code === 1014;
}
var banner = null;
function notifyStorageFull(where) {
  try {
    if (!banner) {
      banner = document.createElement("div");
      banner.setAttribute("role", "alert");
      banner.style.cssText = "position:fixed;left:0;right:0;top:0;z-index:9999;padding:10px 14px;background:#7f1d1d;color:#fff;font:14px/1.4 system-ui,sans-serif;display:flex;gap:12px;align-items:center;justify-content:center;box-shadow:0 2px 8px rgba(0,0,0,.4)";
      const x = document.createElement("button");
      x.textContent = "\u2715";
      x.style.cssText = "background:transparent;border:0;color:#fff;font-size:16px;cursor:pointer";
      x.addEventListener("click", () => {
        banner?.remove();
        banner = null;
      });
      const span = document.createElement("span");
      span.id = "storage-msg";
      banner.append(span, x);
      document.body.appendChild(banner);
    }
    const msg = banner.querySelector("#storage-msg");
    if (msg) msg.textContent = `Speicher voll \u2014 \u201E${where}" konnte nicht gesichert werden. Bitte Korpus k\xFCrzen, Schatzkammer aufr\xE4umen oder ein Projekt exportieren und Daten l\xF6schen.`;
  } catch {
  }
}
function safeSet(key, value, where) {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (e) {
    if (isQuotaError(e)) notifyStorageFull(where);
    return false;
  }
}

// src/features/livepools.ts
var LP_KEY = "divergenz_live_pools_v1";
var LP_CAP = 300;
var LIVE_W = { schatz: 3, korpus: 2, gen: 1 };
var STOP_NOUN = /* @__PURE__ */ new Set([
  "Ich",
  "Er",
  "Sie",
  "Es",
  "Wir",
  "Ihr",
  "Du",
  "Man",
  "Herr",
  "Frau",
  "Herrn",
  "Jahr",
  "Jahre",
  "Jahren",
  "Mal",
  "Weise",
  "Art",
  "Teil",
  "Ende",
  "Anfang",
  "Seite",
  "Stelle"
]);
var ART_NOM = {
  ein: "ein",
  einen: "ein",
  einem: "ein",
  eines: "ein",
  eine: "eine",
  einer: "eine"
};
var PREP = /* @__PURE__ */ new Set([
  "auf",
  "aus",
  "vor",
  "in",
  "mit",
  "ohne",
  "gegen",
  "durch",
  "von",
  "zu",
  "bei",
  "nach",
  "\xFCber",
  "unter",
  "um",
  "wie",
  "als",
  "zwischen"
]);
var clip = (s) => s.replace(/^[^A-Za-zÄÖÜäöüß]+|[^A-Za-zÄÖÜäöüß]+$/g, "");
var isNoun = (w) => /^[A-ZÄÖÜ][A-Za-zÄÖÜäöüß-]{3,}$/.test(w) && !STOP_NOUN.has(w) && w.length <= 24;
function extractPhrases(text) {
  const src = (text || "").replace(/\s+/g, " ").trim();
  if (!src) return [];
  const out = /* @__PURE__ */ new Set();
  for (const sentence of src.split(/[.!?…]+\s+/)) {
    const toks = sentence.split(" ").map(clip).filter(Boolean);
    for (let i = 0; i < toks.length; i++) {
      const w = toks[i];
      if (!isNoun(w)) continue;
      const p1 = i >= 1 ? toks[i - 1].toLowerCase() : "";
      const p2 = i >= 2 ? toks[i - 2].toLowerCase() : "";
      const art = ART_NOM[p1] || (/^[a-zäöüß-]{4,}$/.test(p1) ? ART_NOM[p2] : void 0);
      if (art) {
        out.add(art + " " + w);
        continue;
      }
      if (PREP.has(p1)) out.add(w);
    }
  }
  return [...out];
}
function loadLive() {
  try {
    const v = JSON.parse(localStorage.getItem(LP_KEY) || "[]");
    return Array.isArray(v) ? v.filter((x) => x && typeof x.t === "string") : [];
  } catch {
    return [];
  }
}
function saveLive(list) {
  safeSet(LP_KEY, JSON.stringify(list), "Lebendige Pools");
}
function feedLivePools(text, weight) {
  const phrases = extractPhrases(text);
  if (!phrases.length) return;
  const list = loadLive();
  const idx = new Map(list.map((e, i) => [e.t, i]));
  const now = Date.now();
  for (const p of phrases) {
    const at = idx.get(p);
    if (at === void 0) {
      list.push({ t: p, n: weight, d: now });
      idx.set(p, list.length - 1);
    } else {
      list[at].n += weight;
      list[at].d = now;
    }
  }
  if (list.length > LP_CAP) {
    list.sort((a, b) => b.n - a.n || b.d - a.d);
    list.length = LP_CAP;
  }
  saveLive(list);
}
function liveTexts() {
  return loadLive().sort((a, b) => b.n - a.n || b.d - a.d).map((e) => e.t);
}

// src/corpus.ts
function loadPersistentCorpus() {
  try {
    return localStorage.getItem(STORAGE_CORPUS) || "";
  } catch {
    return "";
  }
}
function savePersistentCorpus(text) {
  safeSet(STORAGE_CORPUS, text, "Korpus");
}
function corpusSanitize(text) {
  let s = (text ?? "").toString();
  s = s.replace(/\([^()]*\)/g, " ");
  s = s.replace(/\b\d{1,2}:\d{2}\b\s*—\s*/g, "");
  s = s.replace(/\b(Schluss|Notiz|Rand|Gestern|Jetzt|Später|Drei Tage später)\s*—\s*/g, "");
  s = s.replace(/\bSZENE:\s*/g, "");
  s = s.replace(/—\s*(?=[.—])/g, "");
  s = s.replace(/\.{2,}/g, ".");
  s = s.replace(/\s+/g, " ").trim();
  return s;
}
function appendToPersistentCorpus(textToAdd) {
  const add = corpusSanitize(clean(textToAdd));
  if (!add) return;
  try {
    feedLivePools(add, LIVE_W.korpus);
  } catch {
  }
  let corpus = loadPersistentCorpus();
  const sep = corpus.trim().length ? "\n\n" : "";
  corpus = corpus + sep + add;
  if (corpus.length > CORPUS_MAX) {
    corpus = corpus.slice(corpus.length - CORPUS_MAX);
    const cut = corpus.indexOf("\n\n");
    if (cut > 0 && cut < 5e3) corpus = corpus.slice(cut + 2);
  }
  savePersistentCorpus(corpus);
}
function isSaneMarkov(s) {
  if (!s || s.length < 20) return false;
  const words = s.split(/\s+/);
  if (words.length < 5) return false;
  const freq = {};
  for (const w of words) freq[w] = (freq[w] || 0) + 1;
  const maxFreq = Math.max(...Object.values(freq));
  if (maxFreq / words.length > 0.5) return false;
  const functionWords = /* @__PURE__ */ new Set([
    "der",
    "die",
    "das",
    "den",
    "dem",
    "des",
    "ein",
    "eine",
    "einen",
    "einem",
    "einer",
    "eines",
    "in",
    "auf",
    "an",
    "bei",
    "mit",
    "nach",
    "von",
    "aus",
    "vor",
    "hinter",
    "\xFCber",
    "unter",
    "neben",
    "zwischen"
  ]);
  let fn = 0;
  for (const w of words) if (functionWords.has(w.toLowerCase())) fn++;
  if (fn / words.length > 0.6) return false;
  const sentences = s.split(/[.!?]+/).filter(Boolean);
  for (const sentence of sentences) {
    const n = sentence.trim().split(/\s+/).length;
    if (n > 30 || n < 2) return false;
  }
  const phrases = [];
  for (let i = 0; i < words.length - 2; i++) phrases.push(words.slice(i, i + 3).join(" "));
  const pc = {};
  for (const p of phrases) pc[p] = (pc[p] || 0) + 1;
  for (const c of Object.values(pc)) if (c >= 3) return false;
  if (/\b(Schluss|Notiz|Rand)\s*—|\bSZENE:|dass\s*—|,\s*dass\s*$/i.test(s)) return false;
  if (/[—–]\s*$/.test(s.trim())) return false;
  const AUX_MK = /* @__PURE__ */ new Set(["bin", "bist", "ist", "sind", "seid", "war", "warst", "waren", "wart", "hatte", "hattest", "hatten", "hat", "habe", "hast", "habt", "haben", "wurde", "wurdest", "wurden", "wird", "werde", "werden", "w\xE4re", "w\xE4rst", "w\xE4ren"]);
  const CONN_MK = /* @__PURE__ */ new Set(["und", "oder", "aber", "denn", "sondern", "doch", "weil", "dass", "wenn", "als", "w\xE4hrend", "obwohl", "damit", "sodass", "bevor", "nachdem", "ob", "wie", "wo", "der", "die", "das", "dem", "den"]);
  for (let i = 0; i < words.length; i++) {
    const wi = words[i].toLowerCase().replace(/[^a-zäöüß]/g, "");
    if (!AUX_MK.has(wi)) continue;
    for (let j = i + 1; j <= Math.min(words.length - 1, i + 3); j++) {
      const wj = words[j].toLowerCase().replace(/[^a-zäöüß]/g, "");
      if (CONN_MK.has(wj) || /[,;:]/.test(words[j])) break;
      const finite = /(t|te|ten|st)$/.test(wj) && CLAUSE_VERBS.has(wj) && !/^ge/.test(wj) && !AUX_MK.has(wj);
      if (finite) return false;
    }
  }
  const lw = words.map((w) => w.toLowerCase().replace(/[^a-zäöüß]/g, ""));
  for (let i = 0; i < lw.length; i++) {
    if (lw[i].length < 5) continue;
    for (let j = i + 1; j <= Math.min(lw.length - 1, i + 3); j++) {
      if (lw[j] === lw[i]) return false;
    }
  }
  return true;
}
var MK_TAIL_STOP = /* @__PURE__ */ new Set([
  "und",
  "oder",
  "aber",
  "denn",
  "sondern",
  "doch",
  "wie",
  "als",
  "ob",
  "dass",
  "weil",
  "w\xE4hrend",
  "der",
  "die",
  "das",
  "den",
  "dem",
  "des",
  "ein",
  "eine",
  "einen",
  "einem",
  "einer",
  "zu",
  "in",
  "auf",
  "an",
  "mit",
  "von",
  "aus",
  "vor",
  "f\xFCr",
  "bei",
  "nach",
  "\xFCber",
  "unter",
  "noch",
  "nur",
  "auch",
  "so",
  "dann",
  "genau",
  "im",
  "am",
  "beim",
  "zum",
  "zur",
  "ins",
  "vom",
  "ans",
  "aufs",
  "f\xFCrs",
  "durchs",
  "\xFCbers",
  "ums"
]);
function smoothMarkov(s) {
  let words = (s || "").trim().split(/\s+/).filter(Boolean);
  if (!words.length) return "";
  const norm = (w) => w.toLowerCase().replace(/[^a-zäöüß]/g, "");
  const dedup = [];
  for (const w of words) {
    const prev = dedup[dedup.length - 1];
    if (prev && norm(prev) && norm(prev) === norm(w)) continue;
    dedup.push(w);
  }
  words = dedup;
  while (words.length > 3 && MK_TAIL_STOP.has(norm(words[words.length - 1]))) words.pop();
  let t = words.join(" ").replace(/\s+([,.;:!?…])/g, "$1").trim();
  t = t.replace(/[\s,;:—–-]+$/, "");
  if (t && !/[.!?…]$/.test(t)) t += ".";
  t = t.replace(/^([a-zäöüß])/, (c) => c.toUpperCase());
  return t;
}

// src/generation/autochoice.ts
function mergeWeights(a, b) {
  const out = {};
  for (const [k, w] of Object.entries(a || {})) out[k] = (out[k] || 0) + w;
  for (const [k, w] of Object.entries(b || {})) out[k] = (out[k] || 0) + w;
  return out;
}
function weightedPick(map) {
  const entries = Object.entries(map || {}).filter(([, w]) => Number.isFinite(w) && w > 0);
  if (!entries.length) return null;
  let sum = 0;
  for (const [, w] of entries) sum += w;
  let r = Math.random() * sum;
  for (const [k, w] of entries) {
    r -= w;
    if (r <= 0) return k;
  }
  return entries[entries.length - 1][0];
}
function biasedAutoChoice(kind, archA, archB) {
  return weightedPick(mergeWeights(arch(archA).weights?.[kind], arch(archB).weights?.[kind]));
}

// src/generation/video.data.ts
var VIDEO_RULES = [
  "das Symbol erscheint dreimal",
  "die Schwerkraft setzt eine Sekunde zu sp\xE4t ein",
  "der Ton kommt vor der Bewegung",
  "Schatten l\xF6sen sich von K\xF6rpern",
  "Spiegel zeigen einen anderen Raum"
];
var VIDEO_CAM_EXTENDED = [
  "static camera (35mm)",
  "slow push\u2011in (50mm)",
  "slow pull\u2011back (24mm)",
  "handheld micro\u2011shake",
  "top\u2011down drift",
  "macro close\u2011up (100mm)",
  "wide angle, low perspective (18mm)",
  "Steadicam follow",
  "Dutch angle (15\xB0)",
  "rack focus von Vordergrund zu Hintergrund",
  "crane shot abw\xE4rts",
  "POV aus Sicht des Objekts"
];
var VIDEO_LIGHT = [
  "cold blue light",
  "neon flicker",
  "sodium vapor glow",
  "hard backlight silhouette",
  "moonlit haze",
  "overcast diffuse light"
];
var VIDEO_TEX = [
  "fine fog",
  "floating dust",
  "snow drifting indoors",
  "digital glitch shimmer",
  "condensation on glass",
  "ice crystals"
];

// src/generation/video.ts
var clampShotCount = (n) => Math.max(3, Math.min(10, Number.isFinite(n) ? n : 5));
var clampTotalSec = (n) => Math.max(3, Math.min(600, Number.isFinite(n) ? n : 15));
var fmtSec = (x) => {
  if (!isFinite(x)) return "0s";
  const v = Math.round(x * 10) / 10;
  return (v % 1 === 0 ? v.toFixed(0) : String(v)) + "s";
};
var pickSymbol = () => pick(["\u2297", "\u27C2", "\u27E1", "\u2301", "\u27DF", "\u27D0", "\u2736", "\u27C1"]);
var stripTailPunct = (s) => clean(s).replace(/[.!?…]+$/, "");
function normalizePlace(W) {
  const w = clean(W);
  if (!w) return "an einem Ort";
  if (/^(im|am|in|auf|bei|unter|über|vor|hinter)\b/i.test(w)) return w;
  return "an einem " + w;
}
function buildVideoShots(kit, shotCount) {
  const sym = pickSymbol();
  const place = normalizePlace(kit.W);
  const who = kit.P;
  const objClean = stripTailPunct(pick([kit.hookDat, kit.propDat]));
  const shots = [];
  shots.push(`${cap(place)} steht ${who} nahe ${objClean}. ${cap(pick(VIDEO_LIGHT))}. ${cap(pick(VIDEO_CAM_EXTENDED))}. ${cap(pick(VIDEO_TEX))}.`);
  shots.push(`Regel: ${cap(pick(VIDEO_RULES))}. ${sym}. ${who} bemerkt, dass ${stripTailPunct(kit.obstacle)}. ${cap(pick(VIDEO_CAM_EXTENDED))}.`);
  shots.push(`${ensurePunct(kit.turn)} Der Raum reagiert: ${sym} pulsiert, und ${pick(["die W\xE4nde atmen", "die Perspektive kippt", "der Boden verschiebt sich", "die Luft wird k\xF6rnig"])}. ${cap(pick(VIDEO_LIGHT))}.`);
  shots.push(kit.AisClause || kit.AisInfinitiveLed ? `${who} erkennt: ${stripTailPunct(kit.Apure)} \u2014 aber ${pick(["die Zeit springt", "die Regeln drehen sich um", "die Schatten l\xF6sen sich"])}. ${cap(pick(VIDEO_CAM_EXTENDED))}.` : `${who} ${kit.AleadVerb || (kit.AisInfinitiveLed ? "will" : "versucht")} ${stripTailPunct(kit.Apure)}, aber ${pick(["die Zeit springt", "die Regeln drehen sich um", "die Schatten l\xF6sen sich"])}. ${cap(pick(VIDEO_CAM_EXTENDED))}.`);
  shots.push(`${ensurePunct(kit.ending)} Nur: ${pick(["der Riss", "das Fenster", `das Symbol ${sym}`, "die Karte"])} bleibt sichtbar. ${cap(pick(VIDEO_TEX))}.`);
  while (shots.length < shotCount) {
    shots.splice(Math.min(shots.length, 4), 0, `${who} passiert an ${pick(["einer Kante", "einem Spiegel", "einer T\xFCr ohne Griff"])} vorbei. ${cap(pick(VIDEO_LIGHT))}. ${cap(pick(VIDEO_CAM_EXTENDED))}.`);
  }
  return shots.slice(0, shotCount);
}
function buildVideoSequenceText(kit, shotCount = 5, totalSec = 15) {
  const n = clampShotCount(shotCount);
  const total = clampTotalSec(totalSec);
  const dur = total / n;
  const shots = buildVideoShots(kit, n);
  const out = [`SEQUENZ \u2014 ${kit.mode.label || ""}`.trim(), `WER: ${kit.PRaw || kit.P}`, `WO: ${kit.W}`, `WANN: ${kit.T}`, `WAS: ${kit.A}`, `GESAMTL\xC4NGE: ${fmtSec(total)} \u2022 ${fmtSec(dur)} pro Shot`, ""];
  for (let i = 0; i < shots.length; i++) {
    out.push(`Shot ${i + 1} (${fmtSec(dur)})`, `DE: ${shots[i]}`, "");
  }
  return out.join("\n");
}

// src/generation/length.ts
var count = (s) => (s || "").trim().split(/\s+/).filter(Boolean).length;
function enforceWordTarget(text, target, bank, model, markovMode = "mix") {
  const t0 = (text || "").trim();
  if (!t0) return t0;
  const tol = 10;
  let out = t0;
  let wc = count(out);
  if (Number.isFinite(target) && Math.abs(wc - target) <= tol) return out;
  if (wc > target + tol) {
    const sentences = splitSentences(out);
    const acc = [];
    let c = 0;
    for (const s of sentences) {
      const sw = count(s);
      if (c + sw > target + tol) break;
      acc.push(s);
      c += sw;
      if (c >= target - tol) break;
    }
    const cut = acc.join(" ").trim();
    return cut.length > 0 ? ensurePunct(cut) : out;
  }
  const missing = Math.max(0, target - wc);
  const maxAttempts = Math.min(120, Math.ceil(missing / 6) + 6);
  const used = /* @__PURE__ */ new Set();
  const strong = markovMode === "on";
  const addition = () => {
    if (model && (strong || Math.random() < 0.6)) {
      const tries = strong ? 3 : 1;
      for (let k = 0; k < tries; k++) {
        const m = smoothMarkov(model.generate(Math.min(60, Math.max(20, Math.floor(missing * 0.8)))));
        if (m && isSaneMarkov(m) && m.length > 15 && !markovSeenRecently(m)) {
          const key = m.toLowerCase();
          if (!used.has(key) && !out.toLowerCase().includes(key.slice(0, 40))) {
            used.add(key);
            noteMarkov(m);
            traceMarkov(m);
            return { text: m, raw: false };
          }
        }
      }
    }
    const cands = [...bank.motifs || [], ...bank.turns || [], ...bank.hooks || []];
    if (!cands.length) return null;
    const fresh = cands.filter((c) => {
      const k = clean(c).toLowerCase();
      return k && !used.has(k) && !out.toLowerCase().includes(k);
    });
    const chosen = pick(fresh.length ? fresh : cands);
    used.add(clean(chosen).toLowerCase());
    return { text: chosen, raw: true };
  };
  for (let a = 0; a < maxAttempts; a++) {
    if (count(out) >= target - tol) break;
    const add = addition();
    if (!add) continue;
    let ca = add.text.trim().replace(/^[a-z]/, (c) => c.toUpperCase()).replace(/\s+([,.;:!?…])/g, "$1");
    if (!/[.!?…]$/.test(ca)) ca += ".";
    out = out.replace(/[.!?…]+\s*$/, "").trim();
    out += ". " + ca;
    out = out.replace(/\s+/g, " ").trim();
  }
  return ensurePunct(out);
}

// src/generation/coherence.ts
var PRAET_STRONG = /\b(war|waren|warst|hatte|hatten|wurde|wurden|ging|gingen|kam|kamen|sah|sahen|gab|gaben|stand|standen|blieb|blieben|hielt|hielten|ließ|ließen|fand|fanden|nahm|nahmen|sprach|sprachen|schrieb|schrieben|trug|trugen|fuhr|fuhren|lief|liefen|saß|saßen|lag|lagen|hieß|hießen|zog|zogen|schlief|schliefen|rief|riefen|fiel|fielen|sang|sangen|trank|tranken|schwieg|schwiegen|floss|flossen|stieg|stiegen|sank|sanken|bot|boten|schloss|schlossen|verlor|verloren|begann|begannen|geschah|geschahen|konnte|konnten|musste|mussten|wollte|wollten|sollte|sollten|durfte|durften|wusste|wussten|dachte|dachten|brachte|brachten)\b/i;
var PRAET_WEAK = /\b[a-zäöüß]{3,}(te|ten|test|tet)\b/;
var PRAES_MARK = /\b(ist|sind|bin|bist|seid|hat|habe|hast|haben|habt|wird|werden|wirst|kann|kannst|können|muss|musst|müssen|will|willst|wollen|soll|sollen|darf|dürfen|weiß|wissen|geht|gehen|kommt|kommen|sieht|sehen|steht|stehen|bleibt|bleiben|liegt|liegen|gibt|geben|nimmt|nehmen|spricht|sprechen|trägt|tragen|läuft|laufen|fällt|fallen|geschieht|passiert|beginnt|endet)\b/i;
var ADJ_CONTEXT = /(?:\b(?:der|die|das|den|dem|des|ein|eine|einen|einem|einer|eines|kein|keine|mein|meine|dein|deine|sein|seine|ihr|ihre|unser|unsere|jede|jeder|jedes|diese|dieser|dieses|manche|viele|alle)\s+[a-zäöüß]*)?\b[a-zäöüß]{3,}(?:te|ten)\b(?=\s+[A-ZÄÖÜ])/;
var weakLooksVerbal = (t) => {
  const m = t.match(/\b[a-zäöüß]{3,}(te|ten|test|tet)\b/g);
  if (!m) return false;
  return m.some((w) => {
    const re = new RegExp("\\b" + w + "\\b(?=\\s+[A-Z\xC4\xD6\xDC])");
    return !re.test(t);
  });
};
function isPastTense(s) {
  const t = s || "";
  if (PRAES_MARK.test(t)) return false;
  if (PRAET_STRONG.test(t)) return true;
  if (PRAET_WEAK.test(t) && weakLooksVerbal(t) && !ADJ_CONTEXT.test(t)) return true;
  return (t.toLowerCase().match(/[a-zäöüß]+/g) || []).some((w) => !!PAST2PRES[w]);
}
function tenseBreakRatio(text) {
  const sents = splitSentences(text).filter((s) => s.trim().length > 3);
  if (sents.length < 3) return 0;
  let past = 0, pres = 0;
  const tags = sents.map((s) => {
    const isPast = PRAET_STRONG.test(s) || PRAET_WEAK.test(s);
    const isPres = PRAES_MARK.test(s);
    if (isPast && !isPres) {
      past++;
      return "past";
    }
    if (isPres && !isPast) {
      pres++;
      return "pres";
    }
    return null;
  });
  const decided = past + pres;
  if (decided < 3) return 0;
  const major = past >= pres ? "past" : "pres";
  const off = tags.filter((t) => t && t !== major).length;
  return off / decided;
}
var tokens = (t) => t.toLowerCase().match(/[a-zäöüß]{2,}/g) || [];
function ngrams(t, n) {
  const w = tokens(t);
  const out = [];
  for (let i = 0; i + n <= w.length; i++) out.push(w.slice(i, i + n).join(" "));
  return out;
}
function phraseRepeatRatio(text) {
  let dup = 0, total = 0;
  for (const n of [3, 4]) {
    const g = ngrams(text, n);
    if (g.length < 4) continue;
    const seen = /* @__PURE__ */ new Set();
    for (const x of g) {
      total++;
      if (seen.has(x)) dup++;
      else seen.add(x);
    }
  }
  return total ? dup / total : 0;
}
var NAME_STOP = /* @__PURE__ */ new Set(["der", "die", "das", "den", "dem", "des", "ein", "eine", "einen", "einem", "einer", "und", "oder", "aber", "denn", "doch", "dann", "als", "wie", "was", "wer", "wo", "wann", "warum", "ich", "du", "er", "sie", "es", "wir", "ihr", "man", "hier", "dort", "jetzt", "noch", "nur", "auch", "schon", "immer", "nie", "sehr", "so", "zu", "im", "am", "auf", "in", "an", "mit", "von", "f\xFCr", "bei", "nach", "vor", "\xFCber", "unter", "durch", "um", "ohne", "seit", "damals", "sp\xE4ter", "zuerst", "zuletzt", "stille", "nein", "ja", "fast", "vielleicht", "genau", "warte", "gut", "dabei", "dazu", "dann"]);
var DETERMINER = /^(der|die|das|den|dem|des|ein|eine|einen|einem|einer|eines|mein|meine|meinen|meinem|meiner|dein|deine|sein|seine|seinen|seinem|ihr|ihre|ihren|ihrem|unser|unsere|euer|eure|kein|keine|keinen|keinem|jeder|jede|jedes|dieser|diese|dieses|diesem|diesen|jener|jene|manche|viele|alle|beide|im|am|zum|zur|ins|ans|vom|beim|aufs|durchs|übers|unters)$/i;
var PREP2 = /^(in|an|auf|bei|mit|von|zu|nach|über|unter|vor|hinter|neben|zwischen|durch|für|ohne|um|gegen|seit|trotz|wegen|während|aus)$/i;
function properNames(text) {
  const out = /* @__PURE__ */ new Set();
  for (const sent of splitSentences(text)) {
    const w = sent.trim().split(/\s+/);
    for (let i = 1; i < w.length; i++) {
      const raw = w[i].replace(/[^A-Za-zÄÖÜäöüß-]/g, "");
      if (raw.length < 3 || !/^[A-ZÄÖÜ]/.test(raw)) continue;
      const lowRaw = raw.toLowerCase();
      if (NAME_STOP.has(lowRaw)) continue;
      if (NOUN_GENDER[lowRaw]) continue;
      const prev = (w[i - 1] || "").replace(/[^A-Za-zÄÖÜäöüß]/g, "");
      if (DETERMINER.test(prev) || PREP2.test(prev)) continue;
      out.add(raw);
    }
  }
  return [...out];
}
function castSpread(text, expected = []) {
  const known = new Set(expected.map((x) => x.toLowerCase()));
  const names = properNames(text).filter((n) => !known.has(n.toLowerCase()));
  const sents = Math.max(1, splitSentences(text).length);
  return Math.min(1, names.length / Math.max(4, sents * 0.5));
}
var PAST2PRES = {
  war: "ist",
  waren: "sind",
  warst: "bist",
  hatte: "hat",
  hatten: "haben",
  hattest: "hast",
  wurde: "wird",
  wurden: "werden",
  ging: "geht",
  gingen: "gehen",
  kam: "kommt",
  kamen: "kommen",
  sah: "sieht",
  sahen: "sehen",
  gab: "gibt",
  gaben: "geben",
  stand: "steht",
  standen: "stehen",
  blieb: "bleibt",
  blieben: "bleiben",
  hielt: "h\xE4lt",
  hielten: "halten",
  lie\u00DF: "l\xE4sst",
  lie\u00DFen: "lassen",
  fand: "findet",
  fanden: "finden",
  nahm: "nimmt",
  nahmen: "nehmen",
  sprach: "spricht",
  sprachen: "sprechen",
  schrieb: "schreibt",
  schrieben: "schreiben",
  trug: "tr\xE4gt",
  trugen: "tragen",
  fuhr: "f\xE4hrt",
  fuhren: "fahren",
  lief: "l\xE4uft",
  liefen: "laufen",
  sa\u00DF: "sitzt",
  sa\u00DFen: "sitzen",
  lag: "liegt",
  lagen: "liegen",
  hie\u00DF: "hei\xDFt",
  hie\u00DFen: "hei\xDFen",
  zog: "zieht",
  zogen: "ziehen",
  schlief: "schl\xE4ft",
  schliefen: "schlafen",
  rief: "ruft",
  riefen: "rufen",
  fiel: "f\xE4llt",
  fielen: "fallen",
  sang: "singt",
  sangen: "singen",
  trank: "trinkt",
  tranken: "trinken",
  schwieg: "schweigt",
  schwiegen: "schweigen",
  floss: "flie\xDFt",
  flossen: "flie\xDFen",
  stieg: "steigt",
  stiegen: "steigen",
  sank: "sinkt",
  sanken: "sinken",
  bot: "bietet",
  boten: "bieten",
  schloss: "schlie\xDFt",
  schlossen: "schlie\xDFen",
  verlor: "verliert",
  verloren: "verlieren",
  begann: "beginnt",
  begannen: "beginnen",
  geschah: "geschieht",
  geschahen: "geschehen",
  konnte: "kann",
  konnten: "k\xF6nnen",
  musste: "muss",
  mussten: "m\xFCssen",
  wollte: "will",
  wollten: "wollen",
  sollte: "soll",
  sollten: "sollen",
  durfte: "darf",
  durften: "d\xFCrfen",
  wusste: "wei\xDF",
  wussten: "wissen",
  dachte: "denkt",
  dachten: "denken",
  brachte: "bringt",
  brachten: "bringen",
  kannte: "kennt",
  kannten: "kennen",
  erkannte: "erkennt",
  erkannten: "erkennen",
  brannte: "brennt",
  brannten: "brennen",
  nannte: "nennt",
  nannten: "nennen",
  rannte: "rennt",
  rannten: "rennen",
  wandte: "wendet",
  wandten: "wenden",
  sprang: "springt",
  sprangen: "springen",
  schrie: "schreit",
  schrien: "schreien",
  flog: "fliegt",
  flogen: "fliegen",
  floh: "flieht",
  flohen: "fliehen",
  schoss: "schie\xDFt",
  schossen: "schie\xDFen",
  riss: "rei\xDFt",
  rissen: "rei\xDFen",
  biss: "bei\xDFt",
  bissen: "bei\xDFen",
  griff: "greift",
  griffen: "greifen",
  pfiff: "pfeift",
  pfiffen: "pfeifen",
  schnitt: "schneidet",
  schnitten: "schneiden",
  litt: "leidet",
  litten: "leiden",
  trat: "tritt",
  traten: "treten",
  verga\u00DF: "vergisst",
  verga\u00DFen: "vergessen",
  wuchs: "w\xE4chst",
  wuchsen: "wachsen",
  wich: "weicht",
  wichen: "weichen",
  schien: "scheint",
  schienen: "scheinen",
  zerbrach: "zerbricht",
  zerbrachen: "zerbrechen",
  verschwand: "verschwindet",
  verschwanden: "verschwinden",
  erschien: "erscheint",
  erschienen: "erscheinen",
  starb: "stirbt",
  starben: "sterben",
  brach: "bricht",
  brachen: "brechen",
  sprach2: "spricht",
  schwoll: "schwillt",
  schwollen: "schwellen",
  bog: "biegt",
  bogen: "biegen",
  hob: "hebt",
  hoben: "heben",
  wob: "webt",
  woben: "weben",
  klang: "klingt",
  klangen: "klingen",
  sann: "sinnt",
  sannen: "sinnen",
  rann: "rinnt",
  rannen: "rinnen",
  schwamm: "schwimmt",
  schwammen: "schwimmen",
  verschwieg: "verschweigt",
  zerfiel: "zerf\xE4llt",
  zerfielen: "zerfallen",
  entstand: "entsteht",
  entstanden: "entstehen",
  verstand: "versteht",
  verstanden: "verstehen",
  bestand: "besteht",
  bestanden: "bestehen",
  geriet: "ger\xE4t",
  gerieten: "geraten",
  trieb: "treibt",
  trieben: "treiben",
  schrak: "schrickt",
  wies: "weist",
  wiesen: "weisen",
  hing: "h\xE4ngt",
  hingen: "h\xE4ngen",
  schwand: "schwindet",
  schwanden: "schwinden",
  gewann: "gewinnt",
  gewannen: "gewinnen",
  zerriss: "zerrei\xDFt",
  zerrissen2: "zerrei\xDFen",
  empfand: "empfindet",
  empfanden: "empfinden",
  befahl: "befiehlt",
  befahlen: "befehlen",
  half: "hilft",
  halfen: "helfen",
  warf: "wirft",
  warfen: "werfen",
  starrte2: "starrt",
  las: "liest",
  lasen: "lesen",
  a\u00DF: "isst",
  a\u00DFen: "essen",
  bat: "bittet",
  baten: "bitten"
};
var DU_FORM = /\b(du|dir|dich|dein|deine|deinen|deinem|deiner|deines)\b/i;
var ICH_FORM = /\b(ich|mir|mich|mein|meine|meinen|meinem|meiner|meines)\b/i;
function isSecondPerson(s) {
  return DU_FORM.test(s || "");
}
function isFirstPerson(s) {
  return ICH_FORM.test(s || "");
}
function perspectiveBreakRatio(text, perspective) {
  if (!perspective || perspective === "auto") return 0;
  const sents = splitSentences(text).filter((x) => x.trim().length > 3);
  if (sents.length < 3) return 0;
  let off = 0;
  for (const s of sents) {
    if (perspective !== "second" && DU_FORM.test(s)) {
      off++;
      continue;
    }
    if (perspective !== "first" && perspective !== "we" && ICH_FORM.test(s)) off++;
  }
  return off / sents.length;
}

// src/atoms/derive.ts
var SEIN_HABEN_WERDEN = /^(ist|sind|bin|bist|seid|war|waren|warst|hat|habe|hast|haben|habt|hatte|hatten|wird|werden|wirst|werdet|wurde|wurden|kann|kannst|können|könnt|konnte|muss|musst|müssen|müsst|will|willst|wollen|wollt|soll|sollen|darf|dürfen|mag|mögen|weiß|wissen|bleibt|bleiben|blieb|gibt|geben|gab)$/;
var PRAET_FORM = /(?:^|^[a-zäöüß]{2,6})(lag|lagen|stand|standen|ging|gingen|kam|kamen|sah|sahen|nahm|nahmen|hielt|hielten|ließ|ließen|fand|fanden|zog|zogen|trug|trugen|fiel|fielen|rief|riefen|sprach|schrieb|floss|stieg|sank|klang|hing|schien|trieb|brach|schloss|verlor|begann|geschah|roch|rochen|sass|saßen|riss|rissen|sprang|sprangen|schlug|schlugen|traf|trafen|griff|griffen|lief|liefen|wusste|wussten|verschwand|verschwanden|blieb|blieben|hieß|hießen|wuchs|wuchsen|schob|schoben|bog|bogen|schwieg|schwiegen)$/;
var NOMEN_ENDUNG = /(ung|heit|keit|schaft|tät|ion|nis|tum|chen|lein|ment)$/;
var PREP3 = /^(in|im|an|am|auf|bei|beim|mit|von|vom|zu|zum|zur|nach|über|unter|vor|hinter|neben|zwischen|durch|für|ohne|um|gegen|seit|trotz|wegen|während|aus|entlang|inmitten|jenseits|abseits)\b/i;
var SUBJUNKTION = /^(dass|weil|obwohl|wenn|nachdem|bevor|ob|indem|sobald|solange|falls|sodass)\b/i;
var REL = /^(der|die|das|den|dem|des|welche[rsmn]?)\s+\S+\s/i;
var KONNEKTOR = /^(und|oder|aber|doch|denn|sondern|dann|dabei|also|somit|trotzdem|dennoch|außerdem|zudem)(\s+\w+)?$/i;
var ARTIKEL = /^(ein|eine|einen|einem|einer|eines|der|die|das|den|dem|des|kein|keine|mein|meine|dein|deine|sein|seine|ihr|ihre|dieser|diese|dieses|jener|jene)\b/i;
var PRON_START = /^(er|sie|es|ihm|ihr|ihn|ihnen|dessen|deren|diese[rs]?|jene[rs]?)\b/i;
var silben = (t) => {
  const w = t.toLowerCase().match(/[a-zäöüß]+/g) || [];
  return w.reduce((n, x) => n + Math.max(1, (x.match(/[aeiouäöüy]+/g) || []).length), 0);
};
var woerter = (t) => (t.match(/\S+/g) || []).length;
var tiefe = (t) => (t.match(/,\s*(dass|weil|obwohl|wenn|als|während|nachdem|bevor|damit|ob|indem|der|die|das|den|dem|welche)/gi) || []).length;
function subjektOf(t, typ) {
  if (!["hauptsatz", "nebensatz", "rahmen", "kopf"].includes(typ)) return null;
  const s = " " + t.toLowerCase() + " ";
  if (/\b(ich|mir|mich)\b/.test(s)) return { person: 1, numerus: "sg", genus: null };
  if (/\b(wir|uns)\b/.test(s)) return { person: 1, numerus: "pl", genus: null };
  if (/\b(du|dir|dich)\b/.test(s)) return { person: 2, numerus: "sg", genus: null };
  if (/\b(ihr|euch)\b/.test(s)) return { person: 2, numerus: "pl", genus: null };
  const m = t.match(/\b(?:der|die|das|ein|eine)\s+([A-ZÄÖÜ][a-zäöüß-]+)/);
  const g = m ? guessGender(m[1]) : void 0;
  const genus = g === "m" ? "mask" : g === "f" ? "fem" : g === "n" ? "neut" : null;
  const plural = /\b(sie|die)\s+\w+en\b/.test(t.toLowerCase()) || /\b(sind|waren|haben|werden)\b/.test(t.toLowerCase());
  return { person: 3, numerus: plural ? "pl" : "sg", genus };
}
function hatFinitesVerb(seg) {
  const ws = seg.match(/[A-Za-zÄÖÜäöüß]+/g) || [];
  for (const w of ws) {
    if (/^[A-ZÄÖÜ]/.test(w)) continue;
    const l = w.toLowerCase();
    if (VERB_CONJ[l]) return true;
    if (SEIN_HABEN_WERDEN.test(l)) return true;
    if (PRAET_FORM.test(l)) return true;
    if (/^(?!ge)[a-zäöüß]{4,}(?:t|te|en|ten)$/.test(l) && !NOMEN_ENDUNG.test(l)) return true;
  }
  const first = (seg.match(/^([A-ZÄÖÜ][a-zäöüß]+)/) || [])[1];
  if (first) {
    const l = first.toLowerCase();
    if (VERB_CONJ[l] || SEIN_HABEN_WERDEN.test(l) || PRAET_FORM.test(l)) return true;
  }
  return looksLikeFullClause(null, seg);
}
function deriveAtom(raw) {
  const text = (raw || "").trim();
  const unsicher = [];
  const wcount = woerter(text);
  const end = (text.match(/[.!?:;—]$/) || [""])[0];
  const lead = extractLeadVerb(text);
  const haupt = text.split(",")[0];
  const hatFinit = !!lead.verb || hatFinitesVerb(haupt);
  let typ;
  if (/:$/.test(text)) typ = "kopf";
  else if (text.includes("\u27E8")) typ = "rahmen";
  else if (wcount === 1) typ = "einwort";
  else if (KONNEKTOR.test(text)) typ = "konnektor";
  else if (SUBJUNKTION.test(text) && hatFinit) typ = "nebensatz";
  else if (REL.test(text) && hatFinit && /,/.test(text) === false && /\ben\b|\bt\b/.test("")) typ = "nebensatz";
  else if (hatFinit) typ = "hauptsatz";
  else if (PREP3.test(text)) typ = "praepositionalphrase";
  else if (ARTIKEL.test(text) || /\b[A-ZÄÖÜ][a-zäöüß-]{2,}/.test(text)) typ = "nominalphrase";
  else typ = "fragment";
  if (PREP3.test(text) && hatFinit) unsicher.push("typ (Inversion?)");
  if (typ === "fragment" && wcount >= 6) unsicher.push("typ (langes Fragment?)");
  let kasus = null;
  if (typ === "nominalphrase") {
    const a = (text.match(/^(\S+)/) || [""])[0].toLowerCase();
    const kern = (text.match(/\b([A-ZÄÖÜ][a-zäöüß-]{2,})/) || [])[1];
    const g = kern ? guessGender(kern) : void 0;
    if (/^(einen|den)$/.test(a)) kasus = "akk";
    else if (/^(einem|dem|einer)$/.test(a)) kasus = "dat";
    else if (a === "der") {
      kasus = g === "f" ? "dat" : g === "m" ? "nom" : null;
      if (!kasus) unsicher.push("kasus (der: Nom/Dat)");
    } else if (/^(eines|des)$/.test(a)) kasus = "gen";
    else if (/^(ein|eine|die|das)$/.test(a)) {
      kasus = "nom_akk";
      unsicher.push("kasus (nom/akk mehrdeutig)");
    } else unsicher.push("kasus");
  }
  const kadenz = end === ":" ? "schwebend" : end ? "fallend" : "offen";
  const tempus = typ === "nominalphrase" || typ === "fragment" || typ === "praepositionalphrase" || typ === "einwort" ? "kein" : isPastTense(text) ? "praeteritum" : "praesens";
  const bezug = PRON_START.test(text) ? { pronomen: (text.match(/^\S+/) || [""])[0].toLowerCase(), genus: /^(sie|ihr|ihnen)/i.test(text) ? "fem" : "mask", numerus: "sg" } : null;
  if (bezug) unsicher.push("verlangt_bezug (Genus gesch\xE4tzt)");
  const s = silben(text);
  return {
    text,
    typ,
    bietet: { kasus, kadenz },
    subjekt: subjektOf(text, typ),
    tempus,
    fuehrt_ein: properNames(text),
    verlangt_bezug: bezug,
    oeffnet: typ === "kopf",
    rhythmus: { woerter: wcount, silben: s, tiefe: tiefe(text), endzeichen: end, gewicht: wcount <= 4 ? "kurz" : wcount <= 9 ? "mittel" : "lang" },
    unsicher
  };
}

// src/atoms/schema.ts
var N = ["hauptsatz", "nebensatz", "nominalphrase", "praepositionalphrase", "rahmen", "fragment", "einwort", "konnektor", "kopf"];
var FOLGT_AUF = {
  start: ["hauptsatz", "rahmen", "kopf", "nominalphrase", "praepositionalphrase", "einwort", "fragment"],
  hauptsatz: N,
  nebensatz: ["hauptsatz", "rahmen", "kopf", "fragment", "einwort", "konnektor"],
  nominalphrase: ["hauptsatz", "rahmen", "kopf", "fragment", "einwort", "konnektor", "nebensatz"],
  praepositionalphrase: ["hauptsatz", "rahmen", "kopf", "fragment", "einwort", "konnektor"],
  rahmen: ["hauptsatz", "rahmen", "kopf", "fragment", "einwort", "konnektor"],
  fragment: ["hauptsatz", "rahmen", "kopf", "nominalphrase", "einwort", "konnektor"],
  einwort: ["hauptsatz", "rahmen", "kopf", "nominalphrase", "fragment", "konnektor"],
  konnektor: ["hauptsatz", "nominalphrase", "praepositionalphrase", "fragment", "nebensatz"],
  kopf: ["hauptsatz", "nominalphrase", "fragment", "einwort"]
  // Kopf verlangt einen Nachsatz
};
var darfFolgen = (a, b) => (FOLGT_AUF[a] || []).includes(b);
var schliesstKopf = (t) => ["hauptsatz", "nominalphrase", "fragment", "einwort"].includes(t);
var schwelle = (divergenz) => divergenz < 25 ? 0 : divergenz < 55 ? 1 : divergenz < 80 ? 2 : 3;

// src/atoms/assemble.ts
var PHASEN_KATEGORIEN = {
  exposition: ["motifs", "hooks", "was"],
  verdichtung: ["props", "obstacles", "stakes", "was"],
  umschlag: ["turns"],
  schluss: ["endings"]
};
function phasenBonus(a, phase) {
  if (a.quelle === "vorlage") return phase === "exposition" ? 1.2 : 0.4;
  if (a.kategorie === "was") return phase === "schluss" ? 0.5 : 3.5;
  if (!a.kategorie) return 0;
  if (PHASEN_KATEGORIEN[phase].includes(a.kategorie)) return 2.2;
  if (a.kategorie === "endings" && phase !== "schluss") return -3;
  if (a.kategorie === "motifs" && phase === "schluss") return -1.5;
  return 0;
}
function naechsterSlot(text) {
  const m = text.match(/⟨(AKK|DAT|NOM|SATZ)⟩/);
  if (!m) return null;
  const k = m[1];
  if (k === "SATZ") return { rolle: "ergaenzung", kasus: "nom", art: "hauptsatz" };
  return { rolle: "objekt", kasus: k.toLowerCase(), art: "nominalphrase" };
}
function wirktSatzwertig(text) {
  const haupt = text.split(/[,;–—]/)[0] || text;
  return hatFinitesVerb(haupt);
}
function passt(a, k, phase, slot) {
  if (k.benutzt.has(a.id)) return false;
  if (phase && a.kategorie === "endings" && phase !== "schluss") return false;
  if (phase && phase === "schluss" && a.kategorie === "motifs") return false;
  const v = slot !== void 0 ? slot : k.vorheriges?.verlangt ?? null;
  const fuelltSlot = !!v;
  if (!fuelltSlot && a.typ === "nominalphrase" && (a.bietet.kasus === "akk" || a.bietet.kasus === "dat")) return false;
  const vorTyp = k.vorheriges ? k.vorheriges.typ : "start";
  if (!fuelltSlot && !darfFolgen(vorTyp, a.typ)) return false;
  if (k.offenerKopf && !schliesstKopf(a.typ)) return false;
  if (v) {
    if (a.typ !== v.art) return false;
    if (v.art === "nominalphrase" && wirktSatzwertig(a.text)) return false;
    if (v.art === "hauptsatz" && !wirktSatzwertig(a.text) && a.typ !== "hauptsatz") return false;
    if (v.art === "nominalphrase") {
      const bietet = a.bietet.kasus;
      if (!bietet) return false;
      if (bietet !== v.kasus && !(bietet === "nom_akk" && (v.kasus === "nom" || v.kasus === "akk"))) return false;
    }
  }
  if (a.verlangt_bezug) {
    let da = false;
    for (const e of k.entitaeten.values()) if (e.abstand <= 2) {
      da = true;
      break;
    }
    if (!da) return false;
  }
  if (k.tempus && a.tempus !== "kein" && a.tempus !== k.tempus) return false;
  if (a.bruchgrad > schwelle(k.divergenz)) return false;
  return true;
}
function fortschreiben(k, a) {
  k.vorheriges = a;
  k.benutzt.add(a.id);
  k.offenerKopf = a.oeffnet || !!a.verlangt;
  if (a.tempus !== "kein" && !k.tempus) k.tempus = a.tempus;
  for (const e of k.entitaeten.values()) e.abstand++;
  for (const n of a.fuehrt_ein) k.entitaeten.set(n, { abstand: 0 });
}
function fuelleKontext(text, ctx) {
  return text.replace(/⟨ORT⟩/g, ctx.ort).replace(/⟨ZEIT⟩/g, ctx.zeit).replace(/⟨FIGUR⟩/g, ctx.figur).replace(/⟨VERB⟩/g, ctx.verb);
}
function dekliniere(phrase, kasus) {
  const m = phrase.match(/^(ein|eine|der|die|das)\s+(.*)$/i);
  if (!m) return phrase;
  const [, art, rest] = m;
  const kern = (rest.match(/\b([A-ZÄÖÜ][a-zäöüß-]{2,})/) || [])[1];
  const g = kern ? guessGender(kern) : void 0;
  if (!g) return phrase;
  const map = {
    akk: { m: art.toLowerCase() === "ein" ? "einen" : "den", f: art, n: art },
    dat: { m: art.toLowerCase() === "ein" ? "einem" : "dem", f: art.toLowerCase() === "eine" ? "einer" : "der", n: art.toLowerCase() === "ein" ? "einem" : "dem" }
  };
  const neu = map[kasus]?.[g];
  if (!neu) return phrase;
  const r = neu.toLowerCase() !== art.toLowerCase() ? rest.replace(/^([a-zäöüß]+?)(?:e|er|es|em|en)?(\s+[A-ZÄÖÜ])/, (_m, stamm, tail) => stamm + "en" + tail) : rest;
  return neu + " " + r;
}
function fuelleSlot(rahmen, fueller) {
  const m = rahmen.match(/⟨(AKK|DAT|NOM|SATZ)⟩/);
  const kasus = m ? m[1].toLowerCase() : "";
  let f = fueller.replace(/[.!?…]+$/, "");
  if (kasus === "akk" || kasus === "dat") f = dekliniere(f, kasus);
  return rahmen.replace(/⟨(AKK|DAT|NOM|SATZ)⟩/, f);
}
var offeneSlots = (t) => (t.match(/⟨(AKK|DAT|NOM|SATZ)⟩/g) || []).length;
function verfugen(teile) {
  const out = [];
  for (let i = 0; i < teile.length; i++) {
    let t = teile[i].trim().replace(/\s+([.,;:!?])/g, "$1");
    if (!t) continue;
    const vorOffen = i > 0 && /[:—]$/.test(out[out.length - 1] || "");
    t = vorOffen ? t.charAt(0).toLowerCase() + t.slice(1) : t.charAt(0).toUpperCase() + t.slice(1);
    t = t.replace(
      /^(Und|Doch|Aber|Oder|Denn|Dann|Dabei|Also)\s+([A-ZÄÖÜ])(?=[a-zäöüß])/,
      (_m, k, c) => k + " " + c.toLowerCase()
    );
    const endet = /[.!?…:;—]$/.test(t);
    const naechsterFolgtDirekt = t.endsWith(":") || t.endsWith("\u2014");
    if (!endet) t += ".";
    if (naechsterFolgtDirekt && i + 1 < teile.length) {
      const n = teile[i + 1].trim();
      teile[i + 1] = n.charAt(0).toLowerCase() + n.slice(1);
    }
    out.push(t);
  }
  return out.join(" ").replace(/([.!?…])\s*\1+/g, "$1").replace(/:\s*\./g, ":").trim();
}
function ziehe(kandidaten, sollGewicht, bisher, phase) {
  if (!kandidaten.length) return null;
  const stems = (t) => new Set((t.toLowerCase().match(/[a-zäöüß]{5,}/g) || []).map((w) => w.slice(0, 5)));
  const kontext = stems(bisher);
  const score = (a) => {
    let s = 1;
    if (phase) s += phasenBonus(a, phase);
    if (a.rhythmus.gewicht === sollGewicht) s += 1.5;
    const ov = [...stems(a.text)].filter((x) => kontext.has(x)).length;
    s += Math.min(ov, 2) * 0.8;
    if (ov > 3) s -= 2;
    return Math.max(0.05, s);
  };
  const total = kandidaten.reduce((n, a) => n + score(a), 0);
  let r = Math.random() * total;
  for (const a of kandidaten) {
    r -= score(a);
    if (r <= 0) return a;
  }
  return kandidaten[kandidaten.length - 1];
}

// src/atoms/templates.data.json
var templates_data_default = {
  erzeugt_am: "2026-08-05",
  quellen: [
    "structures",
    "dramaturgie",
    "emphasis",
    "dialogue",
    "video"
  ],
  atome: [
    {
      id: "vl-0001",
      text: "\u27E8ZEIT\u27E9 \u27E8ORT\u27E9 bemerkt \u27E8FIGUR\u27E9 \u27E8AKK\u27E9.",
      quelle: "vorlage",
      herkunft: "structures",
      typ: "rahmen",
      verlangt: {
        rolle: "objekt",
        kasus: "akk",
        art: "nominalphrase"
      },
      oeffnet: false,
      platzhalter: [
        "ZEIT",
        "ORT",
        "FIGUR",
        "AKK"
      ]
    },
    {
      id: "vl-0002",
      text: "\u27E8ZEIT\u27E9 \u27E8ORT\u27E9 findet \u27E8FIGUR\u27E9 \u27E8AKK\u27E9.",
      quelle: "vorlage",
      herkunft: "structures",
      typ: "rahmen",
      verlangt: {
        rolle: "objekt",
        kasus: "akk",
        art: "nominalphrase"
      },
      oeffnet: false,
      platzhalter: [
        "ZEIT",
        "ORT",
        "FIGUR",
        "AKK"
      ]
    },
    {
      id: "vl-0003",
      text: "\u27E8FIGUR\u27E9 sieht \u27E8AKK\u27E9 \u2014 \u27E8ZEIT\u27E9, \u27E8ORT\u27E9.",
      quelle: "vorlage",
      herkunft: "structures",
      typ: "rahmen",
      verlangt: {
        rolle: "objekt",
        kasus: "akk",
        art: "nominalphrase"
      },
      oeffnet: false,
      platzhalter: [
        "FIGUR",
        "AKK",
        "ZEIT",
        "ORT"
      ]
    },
    {
      id: "vl-0004",
      text: "Zuerst \u27E8ORT\u27E9, \u27E8ZEIT\u27E9:",
      quelle: "vorlage",
      herkunft: "structures",
      typ: "kopf",
      verlangt: null,
      oeffnet: true,
      platzhalter: [
        "ORT",
        "ZEIT"
      ]
    },
    {
      id: "vl-0005",
      text: "\u27E8FIGUR\u27E9 bemerkt \u27E8AKK\u27E9.",
      quelle: "vorlage",
      herkunft: "structures",
      typ: "rahmen",
      verlangt: {
        rolle: "objekt",
        kasus: "akk",
        art: "nominalphrase"
      },
      oeffnet: false,
      platzhalter: [
        "FIGUR",
        "AKK"
      ]
    },
    {
      id: "vl-0006",
      text: "\u27E8ZEIT\u27E9 \u27E8ORT\u27E9.",
      quelle: "vorlage",
      herkunft: "structures",
      typ: "fragment",
      verlangt: null,
      oeffnet: false,
      platzhalter: [
        "ZEIT",
        "ORT"
      ]
    },
    {
      id: "vl-0007",
      text: "\u27E8FIGUR\u27E9 h\xE4lt \u27E8AKK\u27E9 fest.",
      quelle: "vorlage",
      herkunft: "structures",
      typ: "rahmen",
      verlangt: {
        rolle: "objekt",
        kasus: "akk",
        art: "nominalphrase"
      },
      oeffnet: false,
      platzhalter: [
        "FIGUR",
        "AKK"
      ]
    },
    {
      id: "vl-0008",
      text: "\u27E8FIGUR\u27E9 stellt fest:",
      quelle: "vorlage",
      herkunft: "structures",
      typ: "kopf",
      verlangt: null,
      oeffnet: true,
      platzhalter: [
        "FIGUR"
      ]
    },
    {
      id: "vl-0009",
      text: "\u27E8SATZ\u27E9 \u2014 aber \u27E8SATZ\u27E9.",
      quelle: "vorlage",
      herkunft: "structures",
      typ: "rahmen",
      verlangt: {
        rolle: "ergaenzung",
        kasus: "nom",
        art: "hauptsatz"
      },
      oeffnet: false,
      platzhalter: [
        "SATZ",
        "SATZ"
      ]
    },
    {
      id: "vl-0010",
      text: "\u27E8FIGUR\u27E9 begreift:",
      quelle: "vorlage",
      herkunft: "structures",
      typ: "kopf",
      verlangt: null,
      oeffnet: true,
      platzhalter: [
        "FIGUR"
      ]
    },
    {
      id: "vl-0011",
      text: "\u27E8SATZ\u27E9.",
      quelle: "vorlage",
      herkunft: "structures",
      typ: "rahmen",
      verlangt: {
        rolle: "ergaenzung",
        kasus: "nom",
        art: "hauptsatz"
      },
      oeffnet: false,
      platzhalter: [
        "SATZ"
      ]
    },
    {
      id: "vl-0012",
      text: "Doch \u27E8SATZ\u27E9.",
      quelle: "vorlage",
      herkunft: "structures",
      typ: "rahmen",
      verlangt: {
        rolle: "ergaenzung",
        kasus: "nom",
        art: "hauptsatz"
      },
      oeffnet: false,
      platzhalter: [
        "SATZ"
      ]
    },
    {
      id: "vl-0013",
      text: "Klar wird:",
      quelle: "vorlage",
      herkunft: "structures",
      typ: "kopf",
      verlangt: null,
      oeffnet: true,
      platzhalter: []
    },
    {
      id: "vl-0014",
      text: "Nur \u27E8SATZ\u27E9.",
      quelle: "vorlage",
      herkunft: "structures",
      typ: "rahmen",
      verlangt: {
        rolle: "ergaenzung",
        kasus: "nom",
        art: "hauptsatz"
      },
      oeffnet: false,
      platzhalter: [
        "SATZ"
      ]
    },
    {
      id: "vl-0015",
      text: "Was \u27E8FIGUR\u27E9 \u27E8VERB\u27E9:",
      quelle: "vorlage",
      herkunft: "structures",
      typ: "kopf",
      verlangt: null,
      oeffnet: true,
      platzhalter: [
        "FIGUR",
        "VERB"
      ]
    },
    {
      id: "vl-0016",
      text: "Was im Weg steht:",
      quelle: "vorlage",
      herkunft: "structures",
      typ: "kopf",
      verlangt: null,
      oeffnet: true,
      platzhalter: []
    },
    {
      id: "vl-0017",
      text: "\u27E8FIGUR\u27E9 nimmt \u27E8AKK\u27E9 und \u27E8WAHL\u27E9.",
      quelle: "vorlage",
      herkunft: "structures",
      typ: "rahmen",
      verlangt: {
        rolle: "objekt",
        kasus: "akk",
        art: "nominalphrase"
      },
      oeffnet: false,
      platzhalter: [
        "FIGUR",
        "AKK",
        "WAHL"
      ]
    },
    {
      id: "vl-0018",
      text: "\u27E8FIGUR\u27E9 h\xE4lt \u27E8AKK\u27E9 und \u27E8WAHL\u27E9.",
      quelle: "vorlage",
      herkunft: "structures",
      typ: "rahmen",
      verlangt: {
        rolle: "objekt",
        kasus: "akk",
        art: "nominalphrase"
      },
      oeffnet: false,
      platzhalter: [
        "FIGUR",
        "AKK",
        "WAHL"
      ]
    },
    {
      id: "vl-0019",
      text: "\u27E8FIGUR\u27E9 greift nach dem, was bleibt, und \u27E8WAHL\u27E9.",
      quelle: "vorlage",
      herkunft: "structures",
      typ: "hauptsatz",
      verlangt: null,
      oeffnet: false,
      platzhalter: [
        "FIGUR",
        "WAHL"
      ]
    },
    {
      id: "vl-0020",
      text: "\u27E8FIGUR\u27E9 legt \u27E8AKK\u27E9 beiseite und \u27E8WAHL\u27E9.",
      quelle: "vorlage",
      herkunft: "structures",
      typ: "rahmen",
      verlangt: {
        rolle: "objekt",
        kasus: "akk",
        art: "nominalphrase"
      },
      oeffnet: false,
      platzhalter: [
        "FIGUR",
        "AKK",
        "WAHL"
      ]
    },
    {
      id: "vl-0021",
      text: "\u27E8SATZ\u27E9",
      quelle: "vorlage",
      herkunft: "structures",
      typ: "rahmen",
      verlangt: {
        rolle: "ergaenzung",
        kasus: "nom",
        art: "hauptsatz"
      },
      oeffnet: false,
      platzhalter: [
        "SATZ"
      ]
    },
    {
      id: "vl-0022",
      text: "Du erf\xE4hrst erst sp\xE4ter:",
      quelle: "vorlage",
      herkunft: "structures",
      typ: "kopf",
      verlangt: null,
      oeffnet: true,
      platzhalter: []
    },
    {
      id: "vl-0023",
      text: "\u27E8NOM\u27E9 \u2014 das war der Anfang.",
      quelle: "vorlage",
      herkunft: "structures",
      typ: "rahmen",
      verlangt: {
        rolle: "objekt",
        kasus: "nom",
        art: "nominalphrase"
      },
      oeffnet: false,
      platzhalter: [
        "NOM"
      ]
    },
    {
      id: "vl-0024",
      text: "\u27E8FIGUR\u27E9 hatte \u27E8AKK\u27E9 schon in der Hand, denn \u27E8SATZ\u27E9.",
      quelle: "vorlage",
      herkunft: "structures",
      typ: "rahmen",
      verlangt: {
        rolle: "objekt",
        kasus: "akk",
        art: "nominalphrase"
      },
      oeffnet: false,
      platzhalter: [
        "FIGUR",
        "AKK",
        "SATZ"
      ]
    },
    {
      id: "vl-0025",
      text: "\u27E8ZEIT\u27E9 \u27E8ORT\u27E9:",
      quelle: "vorlage",
      herkunft: "structures",
      typ: "kopf",
      verlangt: null,
      oeffnet: true,
      platzhalter: [
        "ZEIT",
        "ORT"
      ]
    },
    {
      id: "vl-0026",
      text: "\u27E8NOM\u27E9.",
      quelle: "vorlage",
      herkunft: "structures",
      typ: "rahmen",
      verlangt: {
        rolle: "objekt",
        kasus: "nom",
        art: "nominalphrase"
      },
      oeffnet: false,
      platzhalter: [
        "NOM"
      ]
    },
    {
      id: "vl-0027",
      text: "Und dann, r\xFCckw\xE4rts betrachtet:",
      quelle: "vorlage",
      herkunft: "structures",
      typ: "kopf",
      verlangt: null,
      oeffnet: true,
      platzhalter: []
    },
    {
      id: "vl-0028",
      text: "\u27E8ZEIT\u27E9 \u27E8ORT\u27E9 steht \u27E8FIGUR\u27E9 vor \u27E8DAT\u27E9.",
      quelle: "vorlage",
      herkunft: "structures",
      typ: "rahmen",
      verlangt: {
        rolle: "objekt",
        kasus: "dat",
        art: "nominalphrase"
      },
      oeffnet: false,
      platzhalter: [
        "ZEIT",
        "ORT",
        "FIGUR",
        "DAT"
      ]
    },
    {
      id: "vl-0029",
      text: "wieder \u27E8DAT\u27E9 gegen\xFCber steht \u27E8FIGUR\u27E9.",
      quelle: "vorlage",
      herkunft: "structures",
      typ: "rahmen",
      verlangt: {
        rolle: "objekt",
        kasus: "dat",
        art: "nominalphrase"
      },
      oeffnet: false,
      platzhalter: [
        "DAT",
        "FIGUR"
      ]
    },
    {
      id: "vl-0030",
      text: "Am Anfang steht \u27E8FIGUR\u27E9 vor \u27E8DAT\u27E9.",
      quelle: "vorlage",
      herkunft: "structures",
      typ: "rahmen",
      verlangt: {
        rolle: "objekt",
        kasus: "dat",
        art: "nominalphrase"
      },
      oeffnet: false,
      platzhalter: [
        "FIGUR",
        "DAT"
      ]
    },
    {
      id: "vl-0031",
      text: "\u27E8ZEIT\u27E9, \u27E8ORT\u27E9.",
      quelle: "vorlage",
      herkunft: "structures",
      typ: "fragment",
      verlangt: null,
      oeffnet: false,
      platzhalter: [
        "ZEIT",
        "ORT"
      ]
    },
    {
      id: "vl-0032",
      text: "\u27E8FIGUR\u27E9 bemerkt:",
      quelle: "vorlage",
      herkunft: "structures",
      typ: "kopf",
      verlangt: null,
      oeffnet: true,
      platzhalter: [
        "FIGUR"
      ]
    },
    {
      id: "vl-0033",
      text: "\u27E8WAHL\u27E9",
      quelle: "vorlage",
      herkunft: "structures",
      typ: "fragment",
      verlangt: null,
      oeffnet: false,
      platzhalter: [
        "WAHL"
      ]
    },
    {
      id: "vl-0034",
      text: "\u27E8FIGUR\u27E9 \u27E8X\u27E9 \u27E8SATZ\u27E9.",
      quelle: "vorlage",
      herkunft: "structures",
      typ: "rahmen",
      verlangt: {
        rolle: "ergaenzung",
        kasus: "nom",
        art: "hauptsatz"
      },
      oeffnet: false,
      platzhalter: [
        "FIGUR",
        "X",
        "SATZ"
      ]
    },
    {
      id: "vl-0035",
      text: "Die Dinge werden \u27E8WAHL\u27E9, denn \u27E8SATZ\u27E9.",
      quelle: "vorlage",
      herkunft: "structures",
      typ: "rahmen",
      verlangt: {
        rolle: "ergaenzung",
        kasus: "nom",
        art: "hauptsatz"
      },
      oeffnet: false,
      platzhalter: [
        "WAHL",
        "SATZ"
      ]
    },
    {
      id: "vl-0036",
      text: "Und wieder:",
      quelle: "vorlage",
      herkunft: "structures",
      typ: "kopf",
      verlangt: null,
      oeffnet: true,
      platzhalter: []
    },
    {
      id: "vl-0037",
      text: "Und von vorn:",
      quelle: "vorlage",
      herkunft: "structures",
      typ: "kopf",
      verlangt: null,
      oeffnet: true,
      platzhalter: []
    },
    {
      id: "vl-0038",
      text: "Der Kreis schlie\xDFt sich:",
      quelle: "vorlage",
      herkunft: "structures",
      typ: "kopf",
      verlangt: null,
      oeffnet: true,
      platzhalter: []
    },
    {
      id: "vl-0039",
      text: "\u27E8FIGUR\u27E9 h\xE4lt \u27E8AKK\u27E9",
      quelle: "vorlage",
      herkunft: "structures",
      typ: "rahmen",
      verlangt: {
        rolle: "objekt",
        kasus: "akk",
        art: "nominalphrase"
      },
      oeffnet: false,
      platzhalter: [
        "FIGUR",
        "AKK"
      ]
    },
    {
      id: "vl-0040",
      text: "Ich bin \u27E8X\u27E9.",
      quelle: "vorlage",
      herkunft: "structures",
      typ: "hauptsatz",
      verlangt: null,
      oeffnet: false,
      platzhalter: [
        "X"
      ]
    },
    {
      id: "vl-0041",
      text: "Ich liege \u27E8ORT\u27E9.",
      quelle: "vorlage",
      herkunft: "structures",
      typ: "hauptsatz",
      verlangt: null,
      oeffnet: false,
      platzhalter: [
        "ORT"
      ]
    },
    {
      id: "vl-0042",
      text: "Ich kenne \u27E8X\u27E9.",
      quelle: "vorlage",
      herkunft: "structures",
      typ: "praepositionalphrase",
      verlangt: null,
      oeffnet: false,
      platzhalter: [
        "X"
      ]
    },
    {
      id: "vl-0043",
      text: "Ich kenne \u27E8AKK\u27E9.",
      quelle: "vorlage",
      herkunft: "structures",
      typ: "rahmen",
      verlangt: {
        rolle: "objekt",
        kasus: "akk",
        art: "nominalphrase"
      },
      oeffnet: false,
      platzhalter: [
        "AKK"
      ]
    },
    {
      id: "vl-0044",
      text: "\u27E8X\u27E9 sp\xFCrt:",
      quelle: "vorlage",
      herkunft: "structures",
      typ: "kopf",
      verlangt: null,
      oeffnet: true,
      platzhalter: [
        "X"
      ]
    },
    {
      id: "vl-0045",
      text: "Dann sp\xFCre ich:",
      quelle: "vorlage",
      herkunft: "structures",
      typ: "kopf",
      verlangt: null,
      oeffnet: true,
      platzhalter: []
    },
    {
      id: "vl-0046",
      text: "Und dann, durch mich hindurch:",
      quelle: "vorlage",
      herkunft: "structures",
      typ: "kopf",
      verlangt: null,
      oeffnet: true,
      platzhalter: []
    },
    {
      id: "vl-0047",
      text: "Ich registriere:",
      quelle: "vorlage",
      herkunft: "structures",
      typ: "kopf",
      verlangt: null,
      oeffnet: true,
      platzhalter: []
    },
    {
      id: "vl-0048",
      text: "\u27E8X\u27E9 \u27E8ORT\u27E9.",
      quelle: "vorlage",
      herkunft: "dramaturgie",
      typ: "fragment",
      verlangt: null,
      oeffnet: false,
      platzhalter: [
        "X",
        "ORT"
      ]
    },
    {
      id: "vl-0049",
      text: "\u27E8X\u27E9 \u27E8ORT\u27E9 bemerkt \u27E8FIGUR\u27E9 \u27E8AKK\u27E9.",
      quelle: "vorlage",
      herkunft: "dramaturgie",
      typ: "rahmen",
      verlangt: {
        rolle: "objekt",
        kasus: "akk",
        art: "nominalphrase"
      },
      oeffnet: false,
      platzhalter: [
        "X",
        "ORT",
        "FIGUR",
        "AKK"
      ]
    },
    {
      id: "vl-0050",
      text: "\u27E8FIGUR\u27E9 \u27E8X\u27E9 \u27E8SATZ\u27E9, aber \u27E8SATZ\u27E9.",
      quelle: "vorlage",
      herkunft: "dramaturgie",
      typ: "rahmen",
      verlangt: {
        rolle: "ergaenzung",
        kasus: "nom",
        art: "hauptsatz"
      },
      oeffnet: false,
      platzhalter: [
        "FIGUR",
        "X",
        "SATZ",
        "SATZ"
      ]
    },
    {
      id: "vl-0051",
      text: "Hier, \u27E8ORT\u27E9, \u27E8WAHL\u27E9.",
      quelle: "vorlage",
      herkunft: "emphasis",
      typ: "praepositionalphrase",
      verlangt: null,
      oeffnet: false,
      platzhalter: [
        "ORT",
        "WAHL"
      ]
    },
    {
      id: "vl-0052",
      text: "Der Ort \u2014 \u27E8ORT\u27E9 \u2014 \u27E8WAHL\u27E9.",
      quelle: "vorlage",
      herkunft: "emphasis",
      typ: "praepositionalphrase",
      verlangt: null,
      oeffnet: false,
      platzhalter: [
        "ORT",
        "WAHL"
      ]
    },
    {
      id: "vl-0053",
      text: "Damals, \u27E8ZEIT\u27E9, \u27E8WAHL\u27E9.",
      quelle: "vorlage",
      herkunft: "emphasis",
      typ: "praepositionalphrase",
      verlangt: null,
      oeffnet: false,
      platzhalter: [
        "ZEIT",
        "WAHL"
      ]
    },
    {
      id: "vl-0054",
      text: "Noch immer will \u27E8FIGUR\u27E9 \u27E8X\u27E9.",
      quelle: "vorlage",
      herkunft: "emphasis",
      typ: "hauptsatz",
      verlangt: null,
      oeffnet: false,
      platzhalter: [
        "FIGUR",
        "X"
      ]
    },
    {
      id: "vl-0055",
      text: "\u27E8FIGUR\u27E9 \u27E8VERB\u27E9 \u27E8X\u27E9 \u2014 noch immer.",
      quelle: "vorlage",
      herkunft: "emphasis",
      typ: "praepositionalphrase",
      verlangt: null,
      oeffnet: false,
      platzhalter: [
        "FIGUR",
        "VERB",
        "X"
      ]
    },
    {
      id: "vl-0056",
      text: "Du hast \u27E8AKK\u27E9 dabei.",
      quelle: "vorlage",
      herkunft: "dialogue",
      typ: "rahmen",
      verlangt: {
        rolle: "objekt",
        kasus: "akk",
        art: "nominalphrase"
      },
      oeffnet: false,
      platzhalter: [
        "AKK"
      ]
    },
    {
      id: "vl-0057",
      text: "\u27E8ORT\u27E9, \u27E8ZEIT\u27E9.",
      quelle: "vorlage",
      herkunft: "dialogue",
      typ: "fragment",
      verlangt: null,
      oeffnet: false,
      platzhalter: [
        "ORT",
        "ZEIT"
      ]
    },
    {
      id: "vl-0058",
      text: "\u27E8X\u27E9 \u27E8X\u27E9 \u27E8X\u27E9, aber \u27E8WAHL\u27E9.",
      quelle: "vorlage",
      herkunft: "video",
      typ: "praepositionalphrase",
      verlangt: null,
      oeffnet: false,
      platzhalter: [
        "X",
        "X",
        "X",
        "WAHL"
      ]
    },
    {
      id: "vl-0059",
      text: "SEQUENZ \u2014 \u27E8X\u27E9",
      quelle: "vorlage",
      herkunft: "video",
      typ: "fragment",
      verlangt: null,
      oeffnet: false,
      platzhalter: [
        "X"
      ]
    },
    {
      id: "vl-0060",
      text: "\u27E8ZEIT\u27E9",
      quelle: "vorlage",
      herkunft: "video",
      typ: "fragment",
      verlangt: null,
      oeffnet: false,
      platzhalter: [
        "ZEIT"
      ]
    }
  ]
};

// src/atoms/trace.ts
var spur = [];
var abweichung = [];
function resetTrace() {
  spur = [];
  abweichung = [];
}
function pushTrace(s) {
  spur.push(s);
}
var nachText = /* @__PURE__ */ new Map();
var schluessel = (t) => t.toLowerCase().replace(/[^a-zäöüß]/g, "").slice(0, 400);
function linkTrace(finalText) {
  if (!spur.length || !finalText) return;
  if (nachText.size > 64) {
    const erste = nachText.keys().next().value;
    if (erste) nachText.delete(erste);
  }
  nachText.set(schluessel(finalText), spur.slice());
}
function getTraceFor(text) {
  return nachText.get(schluessel(text || "")) ?? [];
}
function pruefeAbgleich(endtext) {
  const norm = (t) => t.toLowerCase().replace(/[^a-zäöüß ]/g, " ").replace(/\s+/g, " ").trim();
  const ziel = norm(endtext);
  abweichung = [];
  for (const s of spur) {
    const kern = norm(s.text);
    if (!kern) continue;
    const w = kern.split(" ");
    const probe = w.length > 4 ? w.slice(1, -1).join(" ") : kern;
    if (probe && !ziel.includes(probe)) abweichung.push(s.text);
  }
  return abweichung.slice();
}

// src/atoms/rekombination.ts
function buildPool(bank, perspektive, what, figur) {
  const pool = [];
  let i = 0;
  const w = (what || "").trim();
  if (w) {
    const lead = extractLeadVerb(w);
    const kern = lead.rest.replace(/[.!?…]+$/, "");
    const P = figur || "Jemand";
    const saetze = lead.isInfinitiveLed ? [`${P} will ${kern}`, `Alles dr\xE4ngt darauf, ${kern.replace(/(\S+)$/, "zu $1")}`] : lead.verb ? [`${P} ${lead.verb} ${kern}`, `Und wieder: ${P} ${lead.verb} ${kern}`] : looksLikeFullClause(lead.verb, kern) ? [kern, `Und wieder: ${kern}`, `Denn genau das geschieht: ${kern}`] : [`Es geht um eines: ${kern}`, `${P} sucht ${kern}`];
    for (const t of saetze) {
      const d = deriveAtom(t);
      pool.push({ ...d, id: `was-${pool.length}`, quelle: "kontext", kategorie: "was", verlangt: null, bruchgrad: 0 });
    }
  }
  for (const [kat, arr] of Object.entries(bank)) {
    if (!Array.isArray(arr)) continue;
    for (const t of arr) {
      const d = deriveAtom(t);
      pool.push({
        ...d,
        id: `wb-${++i}`,
        quelle: "wortbank",
        kategorie: kat,
        verlangt: null,
        bruchgrad: d.unsicher.length ? 1 : kat === "motifs" || kat === "hooks" ? 1 : 0
      });
    }
  }
  for (const a of templates_data_default.atome) {
    if (/⟨(WAHL|X)⟩/.test(a.text)) continue;
    if (isFirstPerson(a.text) && perspektive !== "first" && perspektive !== "auto") continue;
    if (isSecondPerson(a.text) && perspektive !== "second" && perspektive !== "auto") continue;
    const d = deriveAtom(a.text.replace(/⟨[A-ZÄÖÜ]+⟩/g, "Ding"));
    pool.push({
      ...d,
      id: a.id,
      text: a.text,
      typ: a.typ,
      quelle: "vorlage",
      verlangt: a.verlangt,
      oeffnet: a.oeffnet,
      bruchgrad: 0,
      fuehrt_ein: []
    });
  }
  return pool;
}
var divergenzOf = (input) => (input.varLevel === "high" ? 85 : input.varLevel === "low" ? 30 : 60) + (input.instability >= 2 ? 10 : 0);
var FLACH = /* @__PURE__ */ new Set(["nominalphrase", "praepositionalphrase", "fragment", "einwort"]);
function buildRekombination(bank, input) {
  const pool = buildPool(bank, input.perspective, input.what, (normWho(input.who || "").split(",")[0] || "Jemand").trim());
  const ctx = {
    ort: normWhere(input.where || "") || "an einem Ort",
    zeit: normWhen(input.when || "") || "zu einer Zeit",
    figur: (normWho(input.who || "").split(",")[0] || "Jemand").trim(),
    verb: "will"
  };
  const zielWoerter = Math.max(30, input.lenTarget ?? 110);
  const k = {
    vorheriges: null,
    offenerKopf: false,
    entitaeten: /* @__PURE__ */ new Map([[ctx.figur, { abstand: 0 }]]),
    tempus: null,
    divergenz: divergenzOf(input),
    benutzt: /* @__PURE__ */ new Set()
  };
  const kurve = ["mittel", "kurz", "lang", "mittel", "kurz", "mittel", "lang"];
  const out = [];
  let letzterTyp = "", gleicheInFolge = 0, wasGesetzt = false, flachInFolge = 0;
  const gesetzteTexte = /* @__PURE__ */ new Set();
  const gesetzteAnfaenge = /* @__PURE__ */ new Set();
  const anfangVon = (t) => t.toLowerCase().replace(/[^a-zäöüß ]/g, "").trim().split(/\s+/).slice(0, 3).join(" ");
  resetTrace();
  let fuegeteile = 0;
  const woerterJetzt = () => out.join(" ").split(/\s+/).filter(Boolean).length;
  for (let s = 0; s < 200; s++) {
    const fortschritt = woerterJetzt() / zielWoerter;
    if (fortschritt >= 1) break;
    const phase = fortschritt < 0.3 ? "exposition" : fortschritt < 0.6 ? "verdichtung" : fortschritt < 0.8 ? "umschlag" : "schluss";
    const letzte = fortschritt >= 0.92;
    let kand = pool.filter((a2) => passt(a2, k, phase));
    if (out.length >= 3 && fuegeteile / out.length >= 0.25) {
      const inhalt = kand.filter((a2) => a2.quelle !== "vorlage");
      if (!inhalt.length) break;
      kand = inhalt;
    }
    if (letzte) kand = kand.filter((a2) => !a2.oeffnet && !a2.verlangt);
    if (gleicheInFolge >= 2) {
      const anders = kand.filter((a2) => a2.typ !== letzterTyp);
      if (anders.length) kand = anders;
    }
    if (flachInFolge >= 2) {
      const tief = kand.filter((a2) => !FLACH.has(a2.typ));
      if (tief.length) kand = tief;
    }
    if (fortschritt < 0.85) kand = kand.filter((a2) => a2.kategorie !== "endings");
    if (!kand.length) break;
    if (!kand.length) break;
    if (!wasGesetzt && fortschritt >= 0.35) {
      const wasKand = kand.filter((x) => x.kategorie === "was");
      if (wasKand.length) kand = wasKand;
    }
    const a = ziehe(kand, kurve[s % kurve.length], out.join(" "), phase);
    if (!a) break;
    let text = fuelleKontext(a.text, ctx);
    const fueller = [];
    let guard = 0;
    while (offeneSlots(text) && guard++ < 3) {
      const kf = { ...k, vorheriges: a, offenerKopf: false };
      const slot = naechsterSlot(text);
      const f = ziehe(pool.filter((x) => x.id !== a.id && !k.benutzt.has(x.id) && !(x.kategorie === "endings" && phase !== "schluss") && !/^(Und|Doch|Aber|Oder|Denn|Dann|Dabei|Also|Trotzdem)\b/.test(x.text) && passt(x, kf, void 0, slot)), "mittel", out.join(" "));
      if (!f) break;
      let fill = fuelleKontext(f.text, ctx).replace(/[.!?…]+$/, "");
      const w1 = (fill.match(/^[A-ZÄÖÜ][a-zäöüß-]*/) || [""])[0];
      const istNomen = !!w1 && (!!NOUN_GENDER[w1.toLowerCase()] || /(ung|heit|keit|schaft|nis|tum|chen|lein|er|el|en|ucht|acht|icht|ion|tät|ei|ie|ur|us|um)$/.test(w1.toLowerCase()));
      const istFigur = !!w1 && (w1.toLowerCase() === ctx.figur.toLowerCase() || normWho(input.who || "").split(/[,;]/).some((x) => x.trim().toLowerCase() === w1.toLowerCase()));
      if (!f.fuehrt_ein.length && !istNomen && !istFigur && /^[A-ZÄÖÜ][a-zäöüß]/.test(fill)) fill = fill.charAt(0).toLowerCase() + fill.slice(1);
      text = fuelleSlot(text, fill);
      fueller.push({ text: fill, kategorie: f.kategorie || "\u2014", quelle: f.quelle });
      k.benutzt.add(f.id);
    }
    if (offeneSlots(text)) continue;
    const sig = text.toLowerCase().replace(/[^a-zäöüß ]/g, "").replace(/\s+/g, " ").trim();
    if (gesetzteTexte.has(sig)) {
      k.benutzt.add(a.id);
      continue;
    }
    const anf = anfangVon(text);
    if (anf.split(" ").length >= 2 && gesetzteAnfaenge.has(anf)) {
      k.benutzt.add(a.id);
      continue;
    }
    gesetzteTexte.add(sig);
    gesetzteAnfaenge.add(anf);
    out.push(text);
    pushTrace({ text, quelle: a.quelle, kategorie: a.kategorie || "\u2014", typ: a.typ, phase, fueller: fueller.length ? fueller : void 0 });
    gleicheInFolge = a.typ === letzterTyp ? gleicheInFolge + 1 : 0;
    flachInFolge = FLACH.has(a.typ) ? flachInFolge + 1 : 0;
    letzterTyp = a.typ;
    fortschreiben(k, a);
    if (a.verlangt) k.offenerKopf = false;
    if (a.quelle === "vorlage") fuegeteile++;
    if (a.kategorie === "was") wasGesetzt = true;
    if (a.kategorie === "endings") break;
  }
  let fertig = verfugen(out);
  if (input.perspective && input.perspective !== "third" && input.perspective !== "auto") {
    fertig = applyPerspective([fertig], input.perspective, ctx.figur, "das Objekt").join(" ");
  } else if (input.perspective === "third") {
    fertig = pronominalize(fertig, ctx.figur, guessPronoun(ctx.figur));
  }
  pruefeAbgleich(fertig);
  return fertig;
}

// src/generation/emphasis.ts
var strip = (s) => clean(s).replace(/[.!?…]+$/, "");
var PLACE_DETAIL = ["liegt die Luft schwer", "verschieben sich die Schatten", "hat jedes Ding zwei Gesichter", "klingt jeder Schritt doppelt", "scheint die Entfernung zu l\xFCgen", "h\xE4lt der Raum den Atem an"];
var PLACE_VERB = ["scheint zuzuh\xF6ren", "gibt keine Auskunft", "merkt sich jede Bewegung", "ordnet die Dinge neu", "l\xE4sst niemanden unber\xFChrt"];
function placeLine(kit) {
  const M = kit.mode;
  const withW = [
    `Hier, ${kit.W}, ${pick(PLACE_DETAIL)}.`,
    `${cap(kit.W)} ${pick(PLACE_DETAIL)}.`,
    `Der Ort \u2014 ${kit.W} \u2014 ${pick(PLACE_VERB)}.`
  ];
  return pick([
    ...withW,
    ...withW,
    `Es riecht ${pick(M.images)}.`,
    ensurePunct(cap(pick(M.rules))),
    `Der Ort ${pick(PLACE_VERB)}.`
  ]);
}
var TIME_DETAIL = ["z\xE4hlte jede Stunde anders", "war die Zukunft schon vergangen", "ma\xDF man die Tage in Verlusten", "liefen die Uhren gegeneinander", "wog ein Augenblick mehr als ein Jahr"];
var TIME_CLAUSE = ["die Uhren einander misstrauten", "niemand mehr auf das Morgen wartete", "die Vergangenheit noch nicht entschieden war", "jeder Tag sich selbst wiederholte"];
var TIME_VERB = ["stand still", "lief r\xFCckw\xE4rts", "verlor ihren Takt", "wurde z\xE4h"];
function timeLine(kit) {
  const presentish = /^(heute|jetzt|nun|gerade|eben|soeben|morgen|übermorgen)\b/i.test(kit.T);
  const withT = [
    presentish ? `${cap(kit.T)}, ${pick(TIME_DETAIL)}.` : `Damals, ${kit.T}, ${pick(TIME_DETAIL)}.`,
    `${cap(kit.T)} \u2014 und die Zeit ${pick(TIME_VERB)}.`
  ];
  return pick([
    ...withT,
    ...withT,
    `Es war die Zeit, als ${pick(TIME_CLAUSE)}.`
  ]);
}
function charLine(kit) {
  const P = kit.P;
  return pick([
    `Da h\xE4lt ${P} inne.`,
    `Kurz sucht ${P} nach Worten.`,
    `Dann sp\xFCrt ${P} die K\xE4lte.`,
    `Reglos steht ${P} da.`,
    `Lange wartet ${P}.`,
    `Still bleibt ${P} stehen.`,
    `Aufmerksam beobachtet ${P} den Raum.`
  ]);
}
function plotLine(kit) {
  const A = strip(kit.Apure);
  const actionLines = A ? kit.AisClause ? [`Und wieder: ${A}.`, `Denn genau das geschieht: ${A}.`, `Im Kern bleibt es dabei \u2014 ${A}.`] : kit.AisInfinitiveLed ? [`Noch immer will ${kit.P} ${A}.`, `Alles dr\xE4ngt darauf, ${A}.`] : [`${kit.P} ${kit.AleadVerb || "will"} ${A} \u2014 noch immer.`, `Es geht weiter um eines: ${A}.`] : [];
  return pick([
    ...actionLines,
    ...actionLines,
    // Handlung doppelt gewichtet gegenüber Bank-Material
    frameTurn(kit.turn),
    reframeStake(kit.stake),
    `Doch ${strip(kit.obstacle)}.`,
    `Dann ${pick(["kippt es erneut", "versch\xE4rft sich alles", "bricht die Ordnung"])}: ${strip(kit.turn)}.`
  ]);
}
function applyEmphasis(text, kit, w) {
  const gens = [
    [w.wo, () => placeLine(kit)],
    [w.wann, () => timeLine(kit)],
    [w.wer, () => charLine(kit)],
    [w.was, () => plotLine(kit)]
  ];
  const lines = [];
  for (const [n, gen] of gens) {
    const count2 = Math.max(0, Math.min(3, n | 0));
    for (let i = 0; i < count2; i++) lines.push(ensurePunct(clean(gen())));
  }
  const uniq = [...new Set(lines)].filter(Boolean);
  if (!uniq.length) return text;
  const sents = splitSentences(text);
  for (const line of uniq) {
    let pos = chooseInsertPos(sents);
    if (pos < 0) pos = sents.length;
    sents.splice(pos, 0, line);
  }
  return sents.join(" ");
}

// src/generation/reim.data.ts
var REIM_GROUPS = [
  {
    "key": "acht",
    "words": [
      "Nacht",
      "Macht",
      "erwacht",
      "entfacht",
      "bedacht",
      "Verdacht",
      "vollbracht",
      "sacht",
      "wacht"
    ]
  },
  {
    "key": "ein",
    "words": [
      "allein",
      "hinein",
      "Schein",
      "Stein",
      "klein",
      "fein",
      "rein",
      "Gebein"
    ]
  },
  {
    "key": "icht",
    "words": [
      "Licht",
      "Gesicht",
      "Pflicht",
      "Bericht",
      "Gedicht",
      "Verzicht",
      "dicht",
      "Sicht",
      "Gewicht",
      "bricht"
    ]
  },
  {
    "key": "and",
    "words": [
      "Rand",
      "Hand",
      "Wand",
      "Sand",
      "Verstand",
      "Land",
      "Band",
      "Brand",
      "Gegenstand",
      "fand"
    ]
  },
  {
    "key": "eise",
    "words": [
      "leise",
      "Kreise",
      "Reise",
      "Weise",
      "beweise",
      "Waise"
    ]
  },
  {
    "key": "aum",
    "words": [
      "Raum",
      "Traum",
      "Baum",
      "Schaum",
      "kaum",
      "Saum",
      "Zaum",
      "Flaum"
    ]
  },
  {
    "key": "ang",
    "words": [
      "lang",
      "Klang",
      "Gesang",
      "Gang",
      "Zwang",
      "bang",
      "Rang"
    ]
  },
  {
    "key": "ur",
    "words": [
      "Spur",
      "Uhr",
      "Figur",
      "Struktur",
      "Natur",
      "pur",
      "Kontur"
    ]
  }
];
var REIM_TAILS = {
  "Nacht": [
    "tief in der Nacht",
    "mitten in der Nacht",
    "am Rand der Nacht"
  ],
  "Macht": [
    "mit stiller Macht",
    "ohne jede Macht"
  ],
  "erwacht": [
    "bevor es erwacht",
    "eh der Tag erwacht"
  ],
  "entfacht": [
    "neu entfacht",
    "still entfacht"
  ],
  "bedacht": [
    "kaum bedacht",
    "nie bedacht"
  ],
  "Verdacht": [
    "gegen jeden Verdacht",
    "voller Verdacht"
  ],
  "vollbracht": [
    "halb vollbracht",
    "l\xE4ngst vollbracht"
  ],
  "sacht": [
    "leise und sacht",
    "ganz sacht"
  ],
  "wacht": [
    "w\xE4hrend niemand wacht",
    "weil keiner wacht"
  ],
  "allein": [
    "still und allein",
    "ganz allein"
  ],
  "hinein": [
    "tief hinein",
    "bis tief hinein"
  ],
  "Schein": [
    "im falschen Schein",
    "im letzten Schein"
  ],
  "Stein": [
    "hart wie Stein",
    "aus kaltem Stein"
  ],
  "klein": [
    "unendlich klein",
    "stumm und klein"
  ],
  "fein": [
    "d\xFCnn und fein",
    "viel zu fein"
  ],
  "rein": [
    "nicht mehr rein",
    "kalt und rein"
  ],
  "Gebein": [
    "bis ins Gebein",
    "tief im Gebein"
  ],
  "Licht": [
    "im letzten Licht",
    "gegen das Licht"
  ],
  "Gesicht": [
    "ohne Gesicht",
    "mit fremdem Gesicht"
  ],
  "Pflicht": [
    "aus alter Pflicht",
    "wie eine Pflicht"
  ],
  "Bericht": [
    "wie im Bericht",
    "ohne Bericht"
  ],
  "Gedicht": [
    "wie ein Gedicht",
    "halb ein Gedicht"
  ],
  "Verzicht": [
    "ein stiller Verzicht",
    "aus Verzicht"
  ],
  "dicht": [
    "nah und dicht",
    "undurchdringlich dicht"
  ],
  "Sicht": [
    "au\xDFer Sicht",
    "ohne klare Sicht"
  ],
  "Gewicht": [
    "ohne Gewicht",
    "mit vollem Gewicht"
  ],
  "bricht": [
    "bis es bricht",
    "eh es bricht"
  ],
  "Rand": [
    "hart am Rand",
    "am \xE4u\xDFersten Rand"
  ],
  "Hand": [
    "in deiner Hand",
    "mit ruhiger Hand"
  ],
  "Wand": [
    "an der wei\xDFen Wand",
    "dicht an der Wand"
  ],
  "Sand": [
    "zerronnen wie Sand",
    "aus feinem Sand"
  ],
  "Verstand": [
    "gegen den Verstand",
    "ohne Verstand"
  ],
  "Land": [
    "weit \xFCber Land",
    "im fremden Land"
  ],
  "Band": [
    "wie ein Band",
    "ein unsichtbares Band"
  ],
  "Brand": [
    "wie im stillen Brand",
    "kurz vor dem Brand"
  ],
  "Gegenstand": [
    "blo\xDF ein Gegenstand",
    "wie ein Gegenstand"
  ],
  "fand": [
    "was niemand fand",
    "das keiner fand"
  ],
  "leise": [
    "unendlich leise",
    "beinahe leise"
  ],
  "Kreise": [
    "und zieht seine Kreise",
    "und zieht stille Kreise"
  ],
  "Reise": [
    "wie auf halber Reise",
    "auf sp\xE4ter Reise"
  ],
  "Weise": [
    "auf stille Weise",
    "auf alte Weise"
  ],
  "beweise": [
    "das ich nicht beweise",
    "was ich nie beweise"
  ],
  "Waise": [
    "verloren wie eine Waise",
    "allein wie eine Waise"
  ],
  "Raum": [
    "quer durch den Raum",
    "im leeren Raum"
  ],
  "Traum": [
    "wie im Traum",
    "halb im Traum"
  ],
  "Baum": [
    "still wie ein Baum",
    "unterm kahlen Baum"
  ],
  "Schaum": [
    "zerf\xE4llt wie Schaum",
    "wei\xDF wie Schaum"
  ],
  "kaum": [
    "man h\xF6rt es kaum",
    "man sieht es kaum"
  ],
  "Saum": [
    "am dunklen Saum",
    "am \xE4u\xDFersten Saum"
  ],
  "Zaum": [
    "h\xE4lt sich im Zaum",
    "wie im Zaum"
  ],
  "Flaum": [
    "weich wie Flaum",
    "leicht wie Flaum"
  ],
  "lang": [
    "ein Leben lang",
    "eine Nacht lang"
  ],
  "Klang": [
    "mit dunklem Klang",
    "wie ein ferner Klang"
  ],
  "Gesang": [
    "wie ein Gesang",
    "ohne Gesang"
  ],
  "Gang": [
    "auf schmalem Gang",
    "im letzten Gang"
  ],
  "Zwang": [
    "ohne Zwang",
    "wie unter Zwang"
  ],
  "bang": [
    "still und bang",
    "seltsam bang"
  ],
  "Rang": [
    "ohne Namen und Rang",
    "ohne Rang"
  ],
  "Spur": [
    "ohne eine Spur",
    "wie eine Spur"
  ],
  "Uhr": [
    "gegen die Uhr",
    "nach der inneren Uhr"
  ],
  "Figur": [
    "stumm wie eine Figur",
    "wie eine Figur"
  ],
  "Struktur": [
    "ohne Struktur",
    "reine Struktur"
  ],
  "Natur": [
    "gegen die Natur",
    "wie von Natur"
  ],
  "pur": [
    "kalt und pur",
    "hell und pur"
  ],
  "Kontur": [
    "ohne Kontur",
    "nur als Kontur"
  ]
};
var REIM_RHYTHM_TARGETS = [3, 6, 4, 7, 3, 5];
var REIM_CONNECTORS = [" \u2014 ", ", ", " \u2013 "];
var REIM_DEFAULTS = { targetLines: 12, maxWordsPerLine: 7, stanzaEvery: 4 };
var REIM_DANGLING_RX = /^(der|die|das|den|dem|des|ein|eine|einen|einem|einer|eines|mein|meine|meinen|meinem|meiner|dein|deine|deinen|sein|seine|seinen|ihr|ihre|ihren|unser|unsere|euer|eure|und|oder|aber|dass|ob|weil|wenn|als|wie|mit|in|im|auf|an|am|für|ohne|durch|über|unter|vor|nach|zu|zum|zur|bei|aus|um|gegen|während|wegen|will|willst|wollen|wollt|kann|kannst|können|könnt|muss|musst|müssen|müsst|soll|sollst|sollen|sollt|darf|darfst|dürfen|dürft|mag|magst|mögen|mögt|möchte|möchtest|möchten|möchtet|ist|sind|war|waren|bin|bist|seid|wird|wirst|werdet|werden|würde|würden|hat|hast|habt|haben|hatte|hatten|bekommt|bekommen|bekam|gibt|gab|nimmt|nahm|macht|sieht|sah|sucht|trägt|trug|hält|hielt|braucht|kennt|nennt|zeigt|bringt|lässt|ließ|setzt|legt|stellt|öffnet|findet|bemerkt|bemerkte|tritt|trat|zieht|zog|greift|griff|wirft|warf|hebt|hob)$/i;

// src/generation/verselib.ts
var normalizeNewlines = (s) => String(s || "").replace(/\r\n/g, "\n").replace(/\r/g, "\n");
var capLine = (s) => String(s).replace(/\s+([,.;:!?])/g, "$1").replace(/^[-–—]\s*/g, "").trim();
function insertStanzas(lines, everyN) {
  if (!everyN || everyN < 2) return lines;
  const out = [];
  for (let i = 0; i < lines.length; i++) {
    out.push(lines[i]);
    if ((i + 1) % everyN === 0 && i !== lines.length - 1) out.push("");
  }
  return out;
}
function stripDanglingTail(words) {
  const w = words.slice();
  let guard = 0;
  while (w.length > 1 && REIM_DANGLING_RX.test((w[w.length - 1] || "").replace(/[.,;:!?…]/g, "")) && guard++ < 10) w.pop();
  return w;
}
function reimShuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function reimDedupePhrases(phrases) {
  const seen = /* @__PURE__ */ new Set();
  const out = [];
  for (const p of phrases) {
    const prefix = p.toLowerCase().replace(/[.,;:!?…]/g, "").split(/\s+/).filter(Boolean).slice(0, 3).join(" ");
    if (prefix && seen.has(prefix)) continue;
    if (prefix) seen.add(prefix);
    out.push(p);
  }
  return out;
}
function estimateSyllables(word) {
  const w = String(word || "").toLowerCase().replace(/[^a-zäöüß]/g, "");
  if (!w) return 0;
  const clusters = w.match(/[aeiouyäöü]+/g) || [];
  let n = clusters.length;
  for (const c of clusters) n += (c.match(/e[oa]/g) || []).length;
  return Math.max(1, n);
}
function buildSyllableLine(stream, targetSyll) {
  const words = [];
  let syll = 0;
  while (stream.length) {
    const w = stream[0];
    const s = estimateSyllables(w);
    if (syll > 0 && syll + s > targetSyll + 1) break;
    words.push(stream.shift());
    syll += s;
    if (syll >= targetSyll) break;
  }
  return { words, syll };
}
function breakIntoLines(phrase, maxWords, maxChars) {
  const words = String(phrase).replace(/\s+/g, " ").trim().split(" ").filter(Boolean);
  if (!words.length) return [];
  if (words.length <= maxWords && phrase.length <= maxChars) return [capLine(phrase)];
  const out = [];
  let buf = [];
  for (const w of words) {
    const next = [...buf, w].join(" ");
    if (buf.length >= maxWords || next.length > maxChars) {
      if (buf.length) {
        const carry = [];
        while (buf.length > 1 && REIM_DANGLING_RX.test((buf[buf.length - 1] || "").replace(/[.,;:!?…]/g, ""))) carry.unshift(buf.pop());
        out.push(capLine(buf.join(" ")));
        buf = carry.concat([w]);
      } else buf = [w];
    } else buf.push(w);
  }
  if (buf.length) out.push(capLine(buf.join(" ")));
  return out;
}
var STANZA_STOP = /* @__PURE__ */ new Set(["und", "oder", "aber", "denn", "doch", "dann", "noch", "auch", "schon", "immer", "nie", "sehr", "wie", "als", "mit", "von", "f\xFCr", "auf", "aus", "ist", "sind", "war", "sich", "nicht", "ein", "eine", "einen", "einem", "einer", "der", "die", "das", "den", "dem", "des", "hier", "dort", "jetzt", "alles", "nichts", "etwas", "mehr", "wieder", "durch", "\xFCber", "unter", "ohne", "beim", "zum", "zur"]);
function stanzaStems(line) {
  const out = /* @__PURE__ */ new Set();
  for (const w of line.toLowerCase().match(/[a-zäöüß]{4,}/g) || []) {
    if (!STANZA_STOP.has(w)) out.add(w.slice(0, 5));
  }
  return out;
}
function stanzaOverlap(a, b) {
  if (!a.size || !b.size) return 0;
  let inter = 0;
  for (const x of a) if (b.has(x)) inter++;
  return inter / (a.size + b.size - inter);
}
function insertStanzasByTheme(lines, target, unit = 1) {
  if (!target || target < 2 || lines.length <= target) return insertStanzas(lines, target);
  const stems = lines.map(stanzaStems);
  const minLen = Math.max(unit, target - unit), maxLen = target + unit;
  const breaks = /* @__PURE__ */ new Set();
  let start = 0;
  while (lines.length - start > maxLen) {
    let bestAt = -1, bestScore = Infinity;
    for (let i = start + minLen; i <= start + maxLen && i < lines.length; i++) {
      if (unit > 1 && (i - start) % unit !== 0) continue;
      if (lines.length - i < minLen) continue;
      const block = /* @__PURE__ */ new Set();
      for (let k = start; k < i; k++) for (const x of stems[k]) block.add(x);
      const ahead = new Set(stems[i]);
      if (i + 1 < lines.length) for (const x of stems[i + 1]) ahead.add(x);
      const sc = stanzaOverlap(block, ahead) + Math.abs(i - start - target) * 0.02;
      if (sc < bestScore) {
        bestScore = sc;
        bestAt = i;
      }
    }
    if (bestAt < 0) break;
    breaks.add(bestAt);
    start = bestAt;
  }
  const out = [];
  for (let i = 0; i < lines.length; i++) {
    if (breaks.has(i) && out.length) out.push("");
    out.push(lines[i]);
  }
  return out;
}

// src/generation/reim.ts
function verseLine(s) {
  let t = capLine(s);
  const q = (t.match(/["„“”]/g) || []).length;
  if (q % 2 === 1) t = t.replace(/["„“”]/g, "");
  t = t.replace(/^[\s"„“”'’]+/, "");
  return t.charAt(0).toUpperCase() + t.slice(1);
}
function reimCoreOf(phrase, targetWords) {
  let words = String(phrase || "").replace(/\s+/g, " ").trim().split(" ").filter(Boolean);
  if (words.length > targetWords) words = words.slice(0, targetWords);
  words = stripDanglingTail(words);
  return words.join(" ").replace(/[.,;:!?…]+$/, "").trim();
}
function reimGroupOfWord(word) {
  const w = (word || "").toLowerCase().replace(/[.,;:!?…]/g, "");
  if (w.length < 4) return null;
  for (const g of REIM_GROUPS) {
    if (w.length > g.key.length && w.endsWith(g.key)) return g;
    if (g.words.some((x) => x.toLowerCase() === w)) return g;
  }
  return null;
}
function pickRhymeWord(group, exclude) {
  const ex = (exclude || "").toLowerCase().replace(/[.,;:!?…]/g, "");
  const options = group.words.filter((w) => {
    const lw = w.toLowerCase();
    return !ex || lw !== ex && !lw.endsWith(ex) && !ex.endsWith(lw);
  });
  return options.length ? pick(options) : pick(group.words);
}
function lineWithRhyme(phrase, rhymeWord, targetWords, connector) {
  let words = String(phrase || "").replace(/\s+/g, " ").trim().split(" ").filter(Boolean);
  words = words.filter((w) => w.toLowerCase().replace(/[.,;:!?…]/g, "") !== rhymeWord.toLowerCase());
  if (words.length > targetWords) words = words.slice(0, targetWords);
  words = stripDanglingTail(words);
  let core = words.join(" ").replace(/[.,;:!?…]+$/, "").trim();
  if (!core) core = "Es bleibt";
  const tails = REIM_TAILS[rhymeWord];
  if (tails && tails.length) return verseLine(`${core}, ${pick(tails)}.`);
  return verseLine(`${core}${connector}${rhymeWord}.`);
}
function applyReimPoem(rawText, anchorLine = "") {
  const opts = REIM_DEFAULTS;
  let t = normalizeNewlines(rawText || "").trim().replace(/\([^()]*\)/g, " ").replace(/\bShot\s*\d+\b.*$/gim, "").replace(/\b\d{1,2}\s*:\s*\d{2}\b\s*—\s*/g, "").replace(/\s+/g, " ").trim();
  let phrases = [];
  for (const s of splitSentences(t)) phrases.push(...String(s).split(/[,;:—–]\s*/g).map((p) => p.trim()).filter(Boolean));
  phrases = phrases.map((p) => p.replace(/^Und\s+/i, "").trim()).filter((p) => p.length >= 6);
  phrases = reimDedupePhrases(phrases);
  const anchor = anchorLine.trim();
  if (!phrases.length) phrases = [anchor || "Ein Satz bleibt zur\xFCck"];
  const originalCount = phrases.length;
  let guard = 0;
  while (phrases.length < opts.targetLines && guard++ < 50) phrases.push(phrases[phrases.length % originalCount] || anchor || phrases[0]);
  let groupPool = reimShuffle(REIM_GROUPS);
  const nextGroup = () => {
    if (!groupPool.length) groupPool = reimShuffle(REIM_GROUPS);
    return groupPool.shift();
  };
  const lines = [];
  let pi = 0, coupletIdx = 0;
  while (lines.length < opts.targetLines && pi < phrases.length) {
    const targetWords = REIM_RHYTHM_TARGETS[coupletIdx % REIM_RHYTHM_TARGETS.length];
    const connector = REIM_CONNECTORS[coupletIdx % REIM_CONNECTORS.length];
    const coreA = reimCoreOf(phrases[pi] || anchor, targetWords);
    const lastA = coreA.split(" ").pop() || "";
    const natural = reimGroupOfWord(lastA);
    let group, wA;
    if (natural && coreA.split(" ").length >= 2) {
      group = natural;
      wA = lastA;
      lines.push(verseLine(`${coreA}.`));
    } else {
      group = nextGroup();
      wA = pickRhymeWord(group);
      lines.push(lineWithRhyme(phrases[pi] || anchor, wA, targetWords, connector));
    }
    pi++;
    const wB = pickRhymeWord(group, wA);
    lines.push(lineWithRhyme(phrases[pi] || anchor, wB, targetWords, connector));
    pi++;
    coupletIdx++;
  }
  return normalizeNewlines(insertStanzasByTheme(lines.slice(0, opts.targetLines), opts.stanzaEvery, 2).join("\n")).replace(/\n{3,}/g, "\n\n").trim();
}

// src/generation/haiku.data.ts
var HAIKU_DEFAULTS = {
  "pattern": [
    5,
    7,
    5
  ],
  "maxHaikus": 3
};
var HAIKU_KIGO = [
  "Herbstwind im Schilfgras",
  "Erster Schnee am Zaun",
  "Novemberlicht f\xE4llt",
  "Der Teich liegt reglos",
  "Raureif auf dem Blech",
  "Mittagslicht im Staub",
  "Ein Falter am Glas",
  "Erste Amsel singt",
  "Der Schneefall setzt aus",
  "Abendrot im Hof",
  "Wintersonne flach",
  "Regen an der Scheibe",
  "Nebel \xFCber dem Feld",
  "Junilicht auf Staub",
  "Der Fluss tr\xE4gt Eis"
];
var HAIKU_NATURE7 = [
  "ein Reiher hebt langsam ab",
  "der Regen klopft ans Fenster",
  "ein Blatt dreht sich im Fallen",
  "das Eis knackt unter dem Steg",
  "ein Falter taumelt ins Licht",
  "der Wind bl\xE4ttert die Akte um",
  "Schnee sammelt sich auf dem Stempel",
  "ein Vogel setzt sich aufs Kabel",
  "die Pf\xFCtze friert von innen zu"
];
var HAIKU_CLOSERS = [
  "der Teich schweigt wieder",
  "der Raum schweigt wieder",
  "die Uhr geht weiter",
  "der Staub setzt sich",
  "die T\xFCr bleibt offen",
  "das Licht bleibt an",
  "niemand sieht hin",
  "der Atem wird ruhig",
  "alles bleibt stehen"
];

// src/generation/haiku.ts
var haikuSyllOf = (line) => String(line || "").split(/\s+/).filter(Boolean).reduce((a, w) => a + estimateSyllables(w), 0);
function haikuCandidatesFromPhrases(phrases) {
  const out = [];
  const seen = /* @__PURE__ */ new Set();
  phrases.forEach((p, src) => {
    const words = p.replace(/[.,;:!?…()]/g, "").split(/\s+/).filter(Boolean);
    for (let n = 2; n <= Math.min(8, words.length); n++) {
      const sub = stripDanglingTail(words.slice(0, n));
      if (sub.length < 2) continue;
      const last = sub[sub.length - 1], next = words[n];
      if (next && /^[A-ZÄÖÜ]/.test(next) && /^[a-zäöü]/.test(last) && /(em|en|er|es|e)$/.test(last)) continue;
      const text = sub.join(" "), key = text.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      out.push({ text, syll: haikuSyllOf(text), src });
    }
  });
  return out;
}
var HAIKU_LC = /* @__PURE__ */ new Set(["die", "der", "das", "den", "dem", "des", "ein", "eine", "einen", "einem", "einer", "und", "oder", "aber", "im", "in", "auf", "an", "mit", "von", "zu", "zur", "zum", "als", "wie", "nur", "noch", "auch", "so", "dann", "doch", "ohne", "bei", "aus"]);
function fixHaikuCaps(line) {
  return String(line).split(/\s+/).map((w, i) => i > 0 && HAIKU_LC.has(w.toLowerCase()) ? w.toLowerCase() : w).join(" ");
}
function applyHaikuPoem(rawText, anchorLine = "") {
  const opts = HAIKU_DEFAULTS;
  let t = normalizeNewlines(rawText || "").trim().replace(/\([^()]*\)/g, " ").replace(/[„“”"»«]/g, " ").replace(/\b(den|dem|einen|einem|der|die|das)\s+Satz\b/gi, " ").replace(/\bShot\s*\d+\b.*$/gim, "").replace(/\b\d{1,2}\s*:\s*\d{2}\b\s*—\s*/g, "").replace(/\s+/g, " ").trim();
  let phrases = [];
  for (const s of splitSentences(t)) phrases.push(...String(s).split(/[,;:—–]\s*/g).map((p) => p.trim()).filter(Boolean));
  phrases = phrases.map((p) => p.replace(/^Und\s+/i, "").trim()).filter((p) => p.length >= 4);
  const concrete = phrases.filter((p) => !/^(aber|denn|weil|dass|ob|doch|also)\b/i.test(p)).filter((p) => !/\b(Wahrheit|Bedeutung|Einsatz|Gültigkeit|Prinzip|Kontrolle|bedeutet|vielleicht)\b/i.test(p));
  if (concrete.length >= 2) phrases = concrete;
  phrases = reimDedupePhrases(phrases);
  const anchor = anchorLine.trim();
  if (!phrases.length) phrases = [anchor || "ein Satz bleibt zur\xFCck"];
  const cands = haikuCandidatesFromPhrases(phrases);
  const used = /* @__PURE__ */ new Set(), usedSrc = /* @__PURE__ */ new Set();
  const fromMaterial = (target) => {
    const free = cands.filter((c2) => !used.has(c2.text.toLowerCase()) && !usedSrc.has(c2.src));
    const exact = free.filter((c2) => c2.syll === target), near = free.filter((c2) => Math.abs(c2.syll - target) === 1);
    const c = exact.length ? pick(exact) : near.length ? pick(near) : null;
    if (!c) return null;
    used.add(c.text.toLowerCase());
    usedSrc.add(c.src);
    return c.text;
  };
  const fromBank = (bank, target) => {
    const free = bank.filter((l2) => !used.has(l2.toLowerCase()));
    const exact = free.filter((l2) => haikuSyllOf(l2) === target), near = free.filter((l2) => Math.abs(haikuSyllOf(l2) - target) === 1);
    const l = exact.length ? pick(exact) : near.length ? pick(near) : null;
    if (!l) return null;
    used.add(l.toLowerCase());
    return l;
  };
  const sourceWords = [];
  for (const p of phrases) sourceWords.push(...p.replace(/[.,;:!?…]/g, "").split(/\s+/).filter(Boolean));
  if (!sourceWords.length) sourceWords.push("Stille");
  let stream = reimShuffle(sourceWords);
  const greedyLine = (target) => {
    if (stream.length < 6) stream = stream.concat(reimShuffle(sourceWords));
    const lw = stripDanglingTail(buildSyllableLine(stream, target).words);
    return lw.length ? lw.join(" ") : pick(sourceWords);
  };
  const haikus = [];
  for (let h = 0; h < opts.maxHaikus; h++) {
    const [t12, t22, t3] = opts.pattern;
    const l1 = (chance(0.75) ? fromBank(HAIKU_KIGO, t12) : null) || fromMaterial(t12) || fromBank(HAIKU_KIGO, t12) || greedyLine(t12);
    let l2 = fromMaterial(t22) || fromBank(HAIKU_NATURE7, t22) || greedyLine(t22);
    const l3 = fromMaterial(t3) || fromBank(HAIKU_CLOSERS, t3) || greedyLine(t3);
    if (chance(0.7)) l2 += " \u2013";
    haikus.push([fixHaikuCaps(cap(capLine(l1))), fixHaikuCaps(cap(capLine(l2))), fixHaikuCaps(cap(capLine(l3)))]);
    if (cands.length < 4) break;
  }
  if (!haikus.length) haikus.push(["Stille bleibt hier", "ohne jede klare Antwort", "und ohne die Zeit"]);
  return normalizeNewlines(haikus.map((h) => h.join("\n")).join("\n\n")).replace(/[„“”"»«]/g, "").replace(/\n{3,}/g, "\n\n").trim();
}

// src/generation/strang.data.ts
var STRANG_DEFAULTS = {
  "targetLines": 12,
  "maxWordsPerLine": 8,
  "maxCharsPerLine": 60,
  "stanzaEvery": 4,
  "keepAnchorChance": 0.9,
  "smoothLines": true
};
var STRANG_PULSE = [
  7,
  4,
  8,
  3,
  6,
  5
];
var STRANG_IMAGES = [
  "still wie ein Formular",
  "wie Staub im Gegenlicht",
  "kalt wie eine zweite Uhr",
  "wie ein Schatten ohne K\xF6rper",
  "leise wie fallender Schnee",
  "wie ein Echo aus Papier",
  "schwer wie nasses Tuch",
  "wie Licht unter einer T\xFCr",
  "d\xFCnn wie ein Riss im Glas",
  "wie Atem auf kaltem Fenster",
  "glatt wie ein neues Aktenblatt",
  "wie Regen hinter Glas"
];

// src/generation/sentclass.ts
var isActionSentence = (s) => /\b(löscht|zerstört|brennt|bricht|entscheidet|verrät|verlässt|kippt|stürzt|reißt|schneidet|stoppt|öffnet|schließt|nimmt|gibt|dreht|setzt|zieht|drückt|schaltet|speichert|überschreibt|friert)\b/i.test(s);
var isConcreteLossSentence = (s) => /\b(verlier|verliert|stirbt|sterben|löscht|gelöscht|brennt|zerstört)\b/i.test(s) && /\b(mich|dich|ihn|sie|es|uns|euch|ihre|seine|foto|speicher|name|körper|gegenwart|stimme)\b/i.test(s);
var isDecisionSentence = (s) => /\b(also|darum|deshalb|ich entscheide|ich wähle|ich tue es|ich lasse|ich stoppe|ich öffne|ich schließe|wir entscheiden|wir lassen|ich weigere)\b/i.test(s);
var isDisturbanceSentence = (s) => /\b(plötzlich|dann kippt|kippt|störung|fehler|alarm|rauschen|knackt|springt|unterbricht|glitch|friert ein|rückwärts)\b/i.test(s);
var isToneLine = (s) => /\b(riecht|kälte|blaues licht|atem|stille)\b/i.test(s) && !isActionSentence(s);

// src/generation/strang.ts
function hasVerbKernel(line) {
  return /\b(ist|sind|war|waren|wird|werden|kann|können|will|wollen|darf|dürfen|bricht|kippt|löscht|steht|sucht|nimmt|nehmen|hält|halten|tat|tut|macht|machte|bleibt|bleiben|kommt|kam|geht|ging|führt|führte|öffnet|schließt|schloss|fragt|fragte|begreift|begriff|trägt|trug|riecht|gilt|bemerkt|liegt|hängt|fällt|zieht|greift|spürt|hört|sieht|schreibt|trifft|verliert|verlieren|beginnt|endet|wartet|atmet|schweigt|singt|klopft|weiterführt)\b/i.test(String(line || ""));
}
function scoreStrangLine(l) {
  let s = 0;
  if (isActionSentence(l)) s += 3;
  if (isConcreteLossSentence(l)) s += 3;
  if (isDecisionSentence(l)) s += 2;
  if (/\b(aber|wenn|dann)\b/i.test(l)) s += 1;
  if (l.length > 70) s -= 1;
  if (/(paradoxon|omen|inkonsistenz|oberfläche)/i.test(l) && !isActionSentence(l)) s -= 2;
  return s;
}
function smoothStrangLine(line) {
  let s = String(line || "").trim().replace(/\s+/g, " ").replace(/\s+([,.!?;:])/g, "$1").trim();
  s = s.replace(/\bWir\s+will\b/gi, "Wir wollen").replace(/\bDu\s+will\b/gi, "Du willst").replace(/\bIch\s+wird\b/gi, "Ich werde").replace(/\bWir\s+nimmt\b/gi, "Wir nehmen").replace(/\bWir\s+hält\b/gi, "Wir halten").replace(/\bDer\s+Namen\b/gi, "Die Namen");
  if (/^[a-zäöüß]/.test(s)) s = s.charAt(0).toUpperCase() + s.slice(1);
  return s.trim();
}
function mergeDanglingLines(lines, opts) {
  const out = [];
  for (const raw of lines) {
    const cur = String(raw || "").trim();
    if (!cur) continue;
    const prevLine = out.length ? out[out.length - 1] : "";
    const relStart = /^(der|die|das|den|dem|was)\s+[a-zäöüß]/.test(cur);
    const hangingSub = /^(wenn|weil|als|während|bevor|eh|ob|dass|falls)\b/i.test(prevLine) && !/[.!?…]$/.test(prevLine);
    if ((!hasVerbKernel(cur) || relStart || hangingSub) && out.length) {
      const prev = out[out.length - 1];
      const open = prev !== "" && !/[.!?…]$/.test(prev);
      if (open && prev.length + cur.length + 1 <= (opts.maxCharsPerLine || 60)) {
        out[out.length - 1] = prev + " " + cur;
        continue;
      }
    }
    out.push(cur);
  }
  return out;
}
function applyStrangPoem(rawText, anchorLine = "") {
  const opts = STRANG_DEFAULTS;
  let t = normalizeNewlines(rawText || "").trim().replace(/\([^()]*\)/g, " ").replace(/\bShot\s*\d+\b.*$/gim, "").replace(/\bHandheld\b.*$/gim, "").replace(/\b\d{1,2}\s*:\s*\d{2}\b\s*—\s*/g, "").replace(/\s+/g, " ").trim();
  t = t.replace(/\bDer\s+Einsatz\s+ist\s*[:,]?\s*([^.!?\n]+)[.!?]?/gi, (_m, x) => {
    const k = (x || "").trim();
    return k ? `Wenn es wahr wird, verlieren wir ${k}.` : "";
  });
  let phrases = [];
  for (const s of splitSentences(t)) phrases.push(...String(s).split(/[,;:—–]\s*/g).map((p) => p.trim()).filter(Boolean));
  phrases = phrases.map((p) => p.replace(/^(Und|Aber|Denn|Doch|Also)\s+/i, "").trim()).filter((p) => p.length >= 6).filter((p) => !/^Alles\s+ist\s+korrekt/i.test(p));
  phrases = reimDedupePhrases(phrases);
  const anchor = anchorLine.trim();
  const anchorLn = anchor ? anchor.endsWith(".") ? anchor : anchor + "." : "";
  let lines = [];
  let li = 0;
  for (const p of phrases) {
    const target = Math.min(STRANG_PULSE[li % STRANG_PULSE.length], opts.maxWordsPerLine);
    for (const b of breakIntoLines(p, target, opts.maxCharsPerLine)) lines.push(b);
    li++;
  }
  lines = lines.filter((l, i) => lines.indexOf(l) === i).filter(Boolean);
  if (opts.smoothLines) {
    lines = mergeDanglingLines(lines, opts);
    lines = lines.map(smoothStrangLine);
  }
  if (lines.length > opts.targetLines) {
    lines = lines.map((l, i) => ({ l, i, s: scoreStrangLine(l) })).sort((a, b) => b.s - a.s).slice(0, opts.targetLines).sort((a, b) => a.i - b.i).map((x) => x.l);
  }
  if (lines.length < Math.max(6, Math.floor(opts.targetLines * 0.6)) && anchorLn) lines.push(anchorLn);
  const imgCount = lines.length >= 10 ? chance(0.5) ? 2 : 1 : 1;
  for (let k = 0; k < imgCount; k++) {
    const img = capLine(pick(STRANG_IMAGES));
    if (lines.includes(img)) continue;
    const pos = chooseInsertPos(lines);
    if (pos >= 0) lines.splice(pos, 0, img);
  }
  if (anchorLn && Math.random() < opts.keepAnchorChance) {
    const already = lines.some((l) => l.toLowerCase().includes(anchorLn.toLowerCase().slice(0, Math.min(18, anchorLn.length))));
    if (!already) lines.push(anchorLn);
  }
  if (lines.length) {
    let last = lines[lines.length - 1].replace(/[,;:—–\s]+$/, "");
    const lw = stripDanglingTail(last.split(/\s+/).filter(Boolean));
    if (lw.length) last = lw.join(" ");
    if (!/[.!?…]$/.test(last)) last += ".";
    lines[lines.length - 1] = last;
  }
  return normalizeNewlines(insertStanzasByTheme(lines, opts.stanzaEvery, 1).join("\n")).replace(/\n{3,}/g, "\n\n").trim();
}

// src/generation/drama.ts
var DRAMA_DEFAULTS = {
  cutRatio: 0.35,
  minActionRatio: 0.5,
  maxRepeatToken: 2,
  requireDecision: true,
  requireConcreteLoss: true,
  requireEscalation: true,
  allowCinematicMarkers: true
};
function hashString(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = h * 31 + s.charCodeAt(i) | 0;
  return h;
}
var DRAMA_WILLS = ["will das Geh\xE4use verlassen", "will die Reihenfolge korrigieren", "will den Namen behalten", "will den Transistor zum Schweigen bringen", "will beweisen, dass die Erinnerung falsch ist"];
var DRAMA_BLOCK = ["der Transistor speichert jede Bewegung", "das Geh\xE4use l\xE4sst niemanden hinaus", "die Zeit springt r\xFCckw\xE4rts", "das System gl\xE4ttet jede Abweichung", "eine Regel verbietet die Wahrheit"];
var DRAMA_LOSS = ["es l\xF6scht sich selbst", "es verliert die Gegenwart", "es verbrennt den Speicher", "es verliert den einzigen Zeugen", "es zerst\xF6rt das Foto"];
function buildDramaConflict(whoA, whoB, seed) {
  const p = (arr, i) => arr[Math.abs(i) % arr.length];
  const h = hashString(seed || (whoA || "A") + "|" + (whoB || "B"));
  return {
    whoA: whoA || "A",
    whoB: whoB || "B",
    WILL: `${whoA || "A"} ${p(DRAMA_WILLS, h)}`,
    BLOCKADE: `Aber ${p(DRAMA_BLOCK, h + 7)}.`,
    VERLUST: `Wenn ${whoA || "A"} es versucht, ${p(DRAMA_LOSS, h + 13)}.`
  };
}
var toSentences = (text) => normalizeNewlines(text).replace(/\s+/g, " ").split(/(?<=[.!?])\s+/).map((s) => s.trim()).filter(Boolean);
var toLines = (text) => normalizeNewlines(text).split("\n").map((l) => l.trim()).filter(Boolean);
var looksLineBased = (text) => {
  const lines = text.split("\n").filter(Boolean);
  return lines.length >= 6 && lines.length > text.split(".").length;
};
var isPureMeta = (u) => /^(\d{1,2}:\d{2}|shot\s*\d+|\(.*s\s*pro\s*shot.*\)|handheld|micro-?shake)\b/i.test(u);
var stripCinematicMarkers = (text) => text.split("\n").filter((l) => !isPureMeta(l.trim())).join("\n");
function enforceCinematicConsequence(text) {
  const lines = normalizeNewlines(text).split("\n");
  const out = [];
  for (let i = 0; i < lines.length; i++) {
    const cur = lines[i].trim();
    if (!cur) continue;
    if (isPureMeta(cur)) {
      const next = (lines[i + 1] || "").trim();
      if (next && isActionSentence(next)) out.push(cur);
    } else out.push(cur);
  }
  return out.join("\n");
}
function ensureConflictPresence(units, c) {
  const joined = units.join(" ").toLowerCase();
  const needWill = !joined.includes("will") && !joined.includes("m\xF6chte");
  const needBlock = !joined.includes("aber");
  const needLoss = !joined.includes("wenn") || !joined.includes("verlier") && !joined.includes("l\xF6scht") && !joined.includes("stirbt") && !joined.includes("brennt");
  const inject = [];
  if (needWill) inject.push(c.WILL + ".");
  if (needBlock) inject.push(c.BLOCKADE);
  if (needLoss) inject.push(c.VERLUST);
  if (inject.length) return [...units.slice(0, 2), ...inject, ...units.slice(2)];
  return units;
}
var buildDisturbanceLine = (c) => `Pl\xF6tzlich kippt das System: ${c.whoA || "A"} sieht, dass jede Korrektur etwas l\xF6scht.`;
var buildDecisionLine = (_c) => `Also entscheide ich: Ich lasse die Reihenfolge falsch \u2013 und bezahle daf\xFCr.`;
function enforceEscalation(units, c) {
  let out = [...units];
  if (!units.some(isDisturbanceSentence)) out.splice(Math.min(4, out.length), 0, buildDisturbanceLine(c));
  if (!units.some(isDecisionSentence)) out.push(buildDecisionLine(c));
  return out;
}
function enforceConcreteLoss(units, c) {
  if (units.some(isConcreteLossSentence)) return units;
  const out = [...units];
  out.splice(Math.max(2, Math.floor(out.length * 0.66)), 0, c.VERLUST);
  return out;
}
function reduceAbstraction(units) {
  const abstract = ["der einsatz ist", "alles ist korrekt", "paradoxon", "omen", "erinnerung", "wahrheit", "inkonsistenz", "oberfl\xE4che"];
  return units.map((u) => u.trim()).filter((u) => {
    const low = u.toLowerCase();
    if (!abstract.some((p) => low.includes(p))) return true;
    return isActionSentence(u) || isConcreteLossSentence(u) || isDecisionSentence(u);
  });
}
function enforceActionRatio(units, opts) {
  const ratio = units.length ? units.filter(isActionSentence).length / units.length : 0;
  if (ratio >= opts.minActionRatio) return units;
  const out = [];
  for (const u of units) {
    if (isActionSentence(u) || isDisturbanceSentence(u) || isConcreteLossSentence(u)) {
      out.push(u);
      continue;
    }
    if (!out.some(isToneLine)) out.push(u);
  }
  return out.length ? out : units;
}
function scoreUnit(u, c) {
  const low = u.toLowerCase();
  let s = 0;
  if (isActionSentence(u)) s += 3;
  if (isConcreteLossSentence(u)) s += 3;
  if (isDecisionSentence(u)) s += 4;
  if (isDisturbanceSentence(u)) s += 2;
  if (low.includes("aber")) s += 1;
  if (low.includes("wenn")) s += 1;
  if (c.whoA && low.includes(c.whoA.toLowerCase())) s += 1;
  if (c.whoB && low.includes(c.whoB.toLowerCase())) s += 1;
  if (/(paradoxon|omen|inkonsistenz|oberfläche|bedeutung)/i.test(u) && !isActionSentence(u)) s -= 2;
  if (u.length > 180) s -= 1;
  return s;
}
function cutWeakest(units, cutRatio, c) {
  if (units.length <= 4) return units;
  const scored = units.map((u, idx) => ({ u, idx, s: scoreUnit(u, c) })).sort((a, b) => b.s - a.s);
  const keepN = Math.max(4, Math.round(units.length * (1 - cutRatio)));
  return scored.slice(0, keepN).sort((a, b) => a.idx - b.idx).map((x) => x.u);
}
var hasDecision = (units) => units.some(isDecisionSentence);
var forceDecision = (units, c) => [...units, buildDecisionLine(c)];
function dedupeSoft(units, maxRepeat = 2) {
  const seen = /* @__PURE__ */ new Set();
  let out = units.filter((u) => {
    const k = u.trim();
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
  const counts = /* @__PURE__ */ new Map();
  out = out.filter((u) => {
    const keyTokens = (u.toLowerCase().match(/[a-zäöüß]+/g) || []).filter((t) => t.length >= 6);
    for (const t of keyTokens) counts.set(t, (counts.get(t) || 0) + 1);
    const over = keyTokens.filter((t) => (counts.get(t) || 0) > maxRepeat).length;
    return over <= Math.max(1, Math.floor(keyTokens.length * 0.5));
  });
  return out;
}
var joinSentences = (arr) => arr.join(" ").replace(/\s+([,.!?;:])/g, "$1");
function applyDramaModule(rawText, conflict, userOpts = {}) {
  const opts = { ...DRAMA_DEFAULTS, ...userOpts };
  let text = normalizeNewlines(rawText).trim();
  text = opts.allowCinematicMarkers ? enforceCinematicConsequence(text) : stripCinematicMarkers(text);
  const lineBased = looksLineBased(text);
  let units = (lineBased ? toLines(text) : toSentences(text)).map((u) => u.trim()).filter((u) => u.length > 0).filter((u) => !isPureMeta(u));
  units = ensureConflictPresence(units, conflict);
  if (opts.requireEscalation) units = enforceEscalation(units, conflict);
  if (opts.requireConcreteLoss) units = enforceConcreteLoss(units, conflict);
  units = reduceAbstraction(units);
  units = enforceActionRatio(units, opts);
  units = cutWeakest(units, opts.cutRatio, conflict);
  if (opts.requireDecision && !hasDecision(units)) units = forceDecision(units, conflict);
  units = dedupeSoft(units, opts.maxRepeatToken);
  const out = lineBased ? units.join("\n") : joinSentences(units);
  return normalizeNewlines(out).replace(/\n{3,}/g, "\n\n").trim();
}

// src/generation/forms.ts
function asProsePoem(text) {
  const s = text.replace(/\s+/g, " ").split(/(?<=[.!?…])\s+/).filter(Boolean);
  const lines = [];
  for (let i = 0; i < s.length; i++) {
    lines.push(s[i]);
    if ((i + 1) % 2 === 0 && i < s.length - 1) lines.push("");
  }
  return lines.join("\n");
}
function asStrang(text, anchor = "") {
  return applyStrangPoem(text, anchor);
}
function asReim(text, anchor = "") {
  return applyReimPoem(text, anchor);
}
function asHaiku(text, anchor = "") {
  return applyHaikuPoem(text, anchor);
}
function asDrama(text, whoA, whoB) {
  return applyDramaModule(text, buildDramaConflict(whoA, whoB, (whoA || "") + "|" + (whoB || "")));
}

// src/generation/dramaturgie.ts
var DKEY = "dm_dramaturgie_v1";
function loadDramaData() {
  try {
    const r = localStorage.getItem(DKEY);
    return r ? JSON.parse(r) : null;
  } catch {
    return null;
  }
}
function hasDramaData() {
  const d = loadDramaData();
  return !!(d && (d.einstieg.length || d.mitte.length || d.hoehepunkt.length || d.veraenderungen.length));
}
var some = (a) => Array.isArray(a) && a.length > 0;
function buildDramaturgie(kit) {
  const d = loadDramaData();
  const M = kit.mode;
  const beats = [];
  beats.push(d && some(d.einstieg) ? `${cap(kit.T)} ${kit.W}. ${cap(pick(d.einstieg))}.` : `${cap(kit.T)} ${kit.W} bemerkt ${kit.P} ${kit.hookAcc}.`);
  beats.push(cap(ensurePunct(kit.hook)));
  beats.push(d && some(d.regeln) && chance(0.7) ? cap(ensurePunct(pick(d.regeln))) : ensurePunct(pick(M.rules)));
  if (d && some(d.mitte)) {
    beats.push(`${cap(pick(d.mitte))}.`);
    if (d.mitte.length > 1 && chance(0.6)) beats.push(`${cap(pick(d.mitte))}.`);
  }
  const konf = d && some(d.konflikte) ? pick(d.konflikte) : "";
  beats.push(konf ? `Es geht um ${konf}.` : `${kit.P} ${kit.AleadVerb || (kit.AisInfinitiveLed ? "will" : "sucht")} ${kit.Apure}, aber ${kit.obstacle}.`);
  if (d && some(d.ausloeser)) beats.push(`Dann, unvermittelt: ${cap(pick(d.ausloeser))}.`);
  beats.push(frameTurn(d && some(d.veraenderungen) ? pick(d.veraenderungen) : kit.turn));
  if (d && some(d.zeitanomalien) && chance(0.4)) beats.push(cap(ensurePunct(pick(d.zeitanomalien))));
  if (d && some(d.hoehepunkt)) beats.push(`Und dann: ${cap(pick(d.hoehepunkt))}.`);
  beats.push(reframeStake(kit.stake));
  beats.push(ensurePunct(kit.ending));
  return joinBeats(beats, kit.P);
}

// src/generation/buildStory.ts
var MODES = ["bureau", "tech", "body", "myth", "absurd", "post"];
var STRUCTURES = ["linear", "reverse", "circle", "fragment", "object"];
var PERSPECTIVES = ["third", "first", "second", "we", "object", "split"];
var RHYTHMS = ["breath", "staccato", "long", "fracture", "clean"];
var resBiased = (ui, kind, opts, aA, aB) => ui !== "auto" && opts.includes(ui) ? ui : biasedAutoChoice(kind, aA, aB) || pick(opts);
function buildKit(bank, input, model) {
  const archA = (input.archetypeA || "neutral").toLowerCase();
  const archB = (input.archetypeB || "neutral").toLowerCase();
  const modeKey = resBiased(input.mode, "mode", MODES, archA, archB);
  const M = MODE_DATA[modeKey] || MODE_DATA.bureau;
  let structure = resBiased(input.structure, "structure", STRUCTURES, archA, archB);
  if (input.structure === "auto" && structure === "fragment") structure = pick(["linear", "reverse", "circle", "object"]);
  const perspective = input.perspective === "auto" ? biasedAutoChoice("perspective", archA, archB) || pick(PERSPECTIVES) : input.perspective;
  let rhythm = resBiased(input.rhythm, "rhythm", RHYTHMS, archA, archB);
  if (input.rhythm === "auto") {
    const tr = toneRhythm(input.tone);
    if (tr && RHYTHMS.includes(tr) && chance(0.7)) rhythm = tr;
  }
  const W = normWhere(clean(input.where)) || "an einem Ort";
  const T = normWhen(clean(input.when)) || "zu einer Zeit";
  const PRaw = normWho(clean(input.who)) || "Jemand";
  const speakers = splitSpeakers(PRaw);
  const P = speakers[0] || PRaw;
  const A = clean(input.what) || "etwas";
  const aLead = extractLeadVerb(A);
  const Apure = aLead.rest;
  const AleadVerb = aLead.verb || "";
  const AisInfinitiveLed = !!aLead.isInfinitiveLed;
  const AisClause = !AisInfinitiveLed && looksLikeFullClause(aLead.verb, Apure);
  const markovMode = input.markovMode || "mix";
  const maybeMarkov = (fallback, prob = 0.42) => {
    if (markovMode === "off" || !model) return fallback;
    if (markovMode === "on" || chance(prob)) {
      const m = smoothMarkov(model.generate(14));
      if (m && isSaneMarkov(m) && !markovSeenRecently(m)) {
        noteMarkov(m);
        traceMarkov(m);
        return m;
      }
    }
    return fallback;
  };
  const aug = (list, key) => archetypeAugmentList(list, archA, archB, key);
  const motif = maybeMarkov(pickSane(aug(bank.motifs, "motifs")), 0.28);
  const hook = maybeMarkov(pickSane(aug(bank.hooks, "hooks")), 0.28);
  const prop = ensureArticle(pickSane(aug(bank.props, "props"), 1)).replace(/^(Ein|Eine|Einen|Einem|Einer|Eines|Der|Die|Das|Den|Dem|Des)\b/, (m) => m.toLowerCase());
  const hookIsClause = looksLikeClausePhrase(hook);
  const hookQuote = hookIsClause ? clean(hook).replace(/[.!?…]+$/, "") : "";
  const hookAcc = hookIsClause ? `den Satz \u201E${hookQuote}\u201C` : safeCaseForm(hook, declineHookPhrase(hook, "acc"));
  const hookDat = hookIsClause ? `dem Satz \u201E${hookQuote}\u201C` : safeCaseForm(hook, declineHookPhrase(hook, "dat"));
  const propAcc = safeCaseForm(prop, declineHookPhrase(prop, "acc"));
  const propDat = safeCaseForm(prop, declineHookPhrase(prop, "dat"));
  return {
    W,
    T,
    P,
    PRaw,
    A,
    motif,
    hook,
    hookAcc,
    hookDat,
    prop,
    propAcc,
    propDat,
    turn: maybeMarkov(pickSane(aug(bank.turns, "turns")), 0.28),
    obstacle: pickSane(aug(bank.obstacles, "obstacles")),
    stake: pickSane(aug(bank.stakes, "stakes")),
    ending: pickSane(aug(bank.endings, "endings")),
    speakerA: P,
    speakerB: speakers[1] || pickSpeakerForArchetype(archB),
    speakers: speakers.length >= 2 ? speakers : [P, pickSpeakerForArchetype(archB)],
    cast: speakers,
    mode: M,
    archetypeA: archA,
    archetypeB: archB,
    instability: input.instability,
    Apure,
    AleadVerb,
    AisClause,
    AisInfinitiveLed,
    structure,
    perspective,
    rhythm
  };
}
function buildStory(bank, input, model) {
  resetMarkovTrace();
  const kit = buildKit(bank, input, model);
  const lenTarget = Number.isFinite(input.lenTarget) ? input.lenTarget : 110;
  if (input.form === "script") return makeDialogueScene(kit, lenTarget);
  if (input.form === "video") return buildVideoSequenceText(kit, input.shots ?? 5, input.totalSec ?? 15);
  if (input.form === "poem") {
    const body = pickStructureBuilder(kit.structure === "fragment" ? "linear" : kit.structure)({ ...kit });
    return postProcessText(asProsePoem(body), { ...input, form: "poem" });
  }
  const verseForm = input.form === "reim" || input.form === "haiku" || input.form === "strang" || input.form === "drama";
  const effStructure = verseForm && kit.structure === "fragment" ? "linear" : kit.structure;
  if (input.form === "prose" && input.structure === "rekombination") {
    const rk = buildRekombination(bank, input);
    if (rk.trim()) {
      const fertig = postProcessText(rk, input);
      linkTrace(fertig);
      return fertig;
    }
  }
  let text = input.form === "prose" && input.structure === "dramaturgie" && hasDramaData() ? buildDramaturgie({ ...kit }) : pickStructureBuilder(effStructure)({ ...kit });
  if (input.form === "prose" && kit.cast.length >= 2) text = weaveCast(text, kit.P, kit.cast);
  if (input.form === "prose" && input.emphasis) text = applyEmphasis(text, kit, input.emphasis);
  text = applyDisruptor(text, input.disruptor).text;
  text = applyRhythm(text, kit.rhythm);
  if (input.form === "prose") text = applyTension(text, input.tension, { motifs: bank.motifs, hooks: bank.hooks });
  text = paragraphize(text);
  const paras = text.split(/\n\n+/).map(clean).filter(Boolean);
  text = effStructure === "object" ? paras.join("\n\n") : applyPerspective(paras, kit.perspective, kit.P, pick(kit.mode.nouns)).join("\n\n");
  if (kit.perspective === "third") text = pronominalize(text, kit.P, guessPronoun(kit.P));
  const finalText = postProcessText(text, input);
  const anchor = kit.ending || kit.Apure;
  if (input.form === "reim") return asReim(finalText, anchor);
  if (input.form === "haiku") return asHaiku(finalText, anchor);
  if (input.form === "strang") return asStrang(finalText, anchor);
  if (input.form === "drama") return asDrama(finalText, kit.speakerA, kit.speakerB || kit.P);
  return enforceWordTarget(finalText, lenTarget, bank, model, input.markovMode || "mix");
}

// src/storage.ts
function normalizeBankShape(bank) {
  const out = structuredClone(DEFAULT_BANK);
  const src = bank ?? {};
  for (const k of BANK_KEYS) {
    const v = src[k];
    if (Array.isArray(v)) out[k] = v.map(clean).filter(Boolean);
  }
  return out;
}
function loadBank() {
  try {
    const raw = localStorage.getItem(STORAGE_BANK);
    if (!raw) return structuredClone(DEFAULT_BANK);
    return normalizeBankShape(JSON.parse(raw));
  } catch {
    return structuredClone(DEFAULT_BANK);
  }
}
var DEFAULT_SETTINGS = { enabled: false, learnStories: true, useSaved: false };
function loadSettings() {
  try {
    const raw = localStorage.getItem(STORAGE_SETTINGS);
    if (!raw) return { ...DEFAULT_SETTINGS };
    const p = JSON.parse(raw);
    return {
      enabled: !!p.enabled,
      learnStories: p.learnStories !== false,
      useSaved: !!p.useSaved
    };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

// src/features/treasury.ts
var TKEY = "dm_treasury_v1";
function loadTreasury() {
  try {
    const v = JSON.parse(localStorage.getItem(TKEY) || "[]");
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
}

// src/generation/novelty.ts
var tokens2 = (s) => (s || "").toLowerCase().match(/[a-zäöüßA-ZÄÖÜ]+/g) || [];
function trigrams(s) {
  const w = tokens2(s);
  const out = [];
  for (let i = 0; i + 2 < w.length + 1 && i + 3 <= w.length; i++) out.push(w[i] + " " + w[i + 1] + " " + w[i + 2]);
  return out;
}
function buildNoveltyContext(cooldownDays = 4, minN = 3, hotCap = 40) {
  const archive = /* @__PURE__ */ new Set();
  let archiveSize = 0;
  try {
    for (const t of loadTreasury()) {
      archiveSize++;
      for (const g of trigrams(t.t)) archive.add(g);
    }
  } catch {
  }
  let hot = [];
  try {
    const now = Date.now();
    const win = cooldownDays * 24 * 3600 * 1e3;
    hot = loadLive().filter((e) => e.n >= minN && now - e.d <= win).sort((a, b) => b.n - a.n || b.d - a.d).slice(0, hotCap).map((e) => e.t.toLowerCase());
  } catch {
  }
  return { archive, archiveSize, hot };
}
function noveltyOf(txt, ctx) {
  if (!ctx.archive.size) return 1;
  const tg = trigrams(txt);
  if (!tg.length) return 1;
  let seen = 0;
  for (const g of tg) if (ctx.archive.has(g)) seen++;
  return 1 - seen / tg.length;
}
function cooldownHit(txt, ctx) {
  if (!ctx.hot.length) return 0;
  const low = (txt || "").toLowerCase();
  let hits = 0;
  for (const p of ctx.hot) if (p.length >= 4 && low.includes(p)) hits++;
  return Math.min(1, hits / 6);
}

// src/generation/grammar.ts
var DANGLING = /* @__PURE__ */ new Set([
  "und",
  "oder",
  "aber",
  "denn",
  "dass",
  "weil",
  "sondern",
  "sowie",
  "damit",
  "obwohl",
  "w\xE4hrend",
  "sodass",
  "bevor",
  "nachdem",
  "falls",
  "wenngleich"
]);
var AUX = /* @__PURE__ */ new Set([
  "bin",
  "bist",
  "ist",
  "sind",
  "seid",
  "war",
  "warst",
  "waren",
  "wart",
  "hatte",
  "hattest",
  "hatten",
  "hat",
  "habe",
  "hast",
  "habt",
  "haben",
  "wurde",
  "wurdest",
  "wurden",
  "wird",
  "werde",
  "werden",
  "w\xE4re",
  "w\xE4rst",
  "w\xE4ren"
]);
var CONN = /* @__PURE__ */ new Set([
  "und",
  "oder",
  "aber",
  "denn",
  "sondern",
  "doch",
  "weil",
  "dass",
  "wenn",
  "als",
  "w\xE4hrend",
  "obwohl",
  "damit",
  "sodass",
  "bevor",
  "nachdem",
  "ob",
  "wie",
  "wo",
  "der",
  "die",
  "das",
  "dem",
  "den"
]);
function verbCollisions(text) {
  const words = (text || "").split(/\s+/).filter(Boolean);
  const norm = (w) => w.toLowerCase().replace(/[^a-zäöüß]/g, "");
  let hits = 0;
  for (let i = 0; i < words.length; i++) {
    if (!AUX.has(norm(words[i]))) continue;
    for (let j = i + 1; j <= Math.min(words.length - 1, i + 3); j++) {
      const wj = norm(words[j]);
      if (CONN.has(wj) || /[,;:]/.test(words[j])) break;
      const finite = /(t|te|ten|st)$/.test(wj) && wj.length >= 4 && !/^ge/.test(wj) && !AUX.has(wj);
      if (finite) {
        hits++;
        break;
      }
    }
  }
  return hits;
}
function grammarFlags(text) {
  const raw = text || "";
  const issues = [];
  let count2 = 0;
  const add = (n, label) => {
    if (n > 0) {
      count2 += n;
      issues.push(`${label}: ${n}`);
    }
  };
  add((raw.match(/[.!?]{2,}/g) || []).length, "Mehrfach-Satzzeichen");
  add((raw.match(/,{2,}|;{2,}|:{2,}/g) || []).length, "doppelte Trennzeichen");
  add((raw.match(/\s+[,.;:!?]/g) || []).length, "Leerzeichen vor Satzzeichen");
  add((raw.match(/\b([a-zäöüßA-ZÄÖÜ]{2,})\s+\1\b/gi) || []).length, "Wortverdopplung");
  add((raw.match(/[a-zäöüß][.,;:!?][A-Za-zÄÖÜ]/g) || []).length, "fehlendes Leerzeichen");
  let dangling = 0;
  for (const sentence of raw.split(/(?<=[.!?…])\s+/)) {
    const m = sentence.trim().match(/([a-zäöüßA-ZÄÖÜ]+)\s*[.!?…]+\s*$/);
    if (m && DANGLING.has(m[1].toLowerCase())) dangling++;
  }
  add(dangling, "Satz endet auf Funktionswort");
  add(verbCollisions(raw), "Verb-Kollision");
  return { count: count2, issues };
}

// src/generation/scoring.ts
function splitSentences2(raw) {
  return raw.replace(/\s+/g, " ").trim().split(/(?<=[.!?…])\s+/).filter((s) => s.trim().length > 0);
}
function ngrams2(words, n) {
  const out = [];
  for (let i = 0; i <= words.length - n; i++) out.push(words.slice(i, i + n).join(" "));
  return out;
}
function countRepeats(arr) {
  const m = /* @__PURE__ */ new Map();
  for (const x of arr) m.set(x, (m.get(x) || 0) + 1);
  let r = 0;
  for (const c of m.values()) if (c > 1) r += c - 1;
  return r;
}
function repetitionRatio(txt) {
  const tokens3 = (txt || "").toLowerCase().match(/[a-zäöüßA-ZÄÖÜ]+/g) || [];
  if (tokens3.length < 3) return 0;
  const tri = ngrams2(tokens3, 3);
  const counts = /* @__PURE__ */ new Map();
  tri.forEach((t) => counts.set(t, (counts.get(t) || 0) + 1));
  const repeated = [...counts.values()].filter((c) => c > 1).length;
  return tri.length ? repeated / tri.length : 0;
}
function flowMetrics(txt) {
  const raw = (txt || "").toString();
  const s = splitSentences2(raw);
  if (!s.length) return { startMonotony: 0, colonExcess: 0, fragPairs: 0 };
  let same = 0, fragPairs = 0;
  for (let i = 1; i < s.length; i++) {
    const a = (s[i - 1].split(/\s+/)[0] || "").toLowerCase();
    const b = (s[i].split(/\s+/)[0] || "").toLowerCase();
    if (a && a === b) same++;
    if (isFragmentSentence(s[i - 1]) && isFragmentSentence(s[i])) fragPairs++;
  }
  const colons = (raw.match(/:/g) || []).length;
  return { startMonotony: same / Math.max(1, s.length - 1), colonExcess: Math.min(1, Math.max(0, colons - 2) / 3), fragPairs: Math.min(1, fragPairs / 2) };
}
function analyzeText(txt, lenTarget) {
  const raw = txt || "";
  const t = raw.toLowerCase().replace(/\s+/g, " ").trim();
  const words = t.split(" ").filter(Boolean);
  const repBi = countRepeats(ngrams2(words, 2)), repTri = countRepeats(ngrams2(words, 3));
  const wordCount = words.length;
  const target = lenTarget > 0 ? lenTarget : 110;
  const lenFit = Math.max(0, 1 - Math.abs(wordCount - target) / target);
  const ttr = words.length ? new Set(words).size / words.length : 0;
  const sentLens = splitSentences2(raw).map((s) => (s.toLowerCase().match(/[a-zäöüßA-ZÄÖÜ]+/g) || []).length);
  const meanLen = sentLens.length ? sentLens.reduce((x, y) => x + y, 0) / sentLens.length : 0;
  const stdLen = sentLens.length > 1 ? Math.sqrt(sentLens.map((x) => (x - meanLen) ** 2).reduce((x, y) => x + y, 0) / sentLens.length) : 0;
  const rhythmScore = Math.max(0, 1 - Math.abs(stdLen - 4) / 6);
  return {
    len: raw.length,
    wordCount,
    repetitionRatio: repetitionRatio(raw),
    lenFit,
    ttr,
    stdLen,
    rhythmScore,
    tooShort: raw.trim().length < 120,
    triBad: repTri > 10,
    biBad: repBi > 25,
    flow: flowMetrics(raw)
  };
}
function coherencePenalty(txt, opts = {}) {
  let p = tenseBreakRatio(txt) * 90 + phraseRepeatRatio(txt) * 40;
  p += perspectiveBreakRatio(txt, opts.perspective) * 150;
  const cd = Math.max(0, Math.min(1, opts.castDiscipline ?? 0));
  if (cd > 0) p += cd * castSpread(txt, opts.expectedCast || []) * 40;
  return p;
}
function scoreText(txt, lenTarget) {
  const a = analyzeText(txt, lenTarget);
  const score = a.lenFit * 30 + a.ttr * 25 + a.rhythmScore * 20 - a.repetitionRatio * 50 - (a.tooShort ? 20 : 0) - a.flow.startMonotony * 15 - a.flow.colonExcess * 8 - a.flow.fragPairs * 7;
  return { score, a };
}
function bestOf(bank, input, model, N2 = 12, opts = {}) {
  const lt = input.lenTarget ?? 110;
  const nw = Math.max(0, Math.min(1, opts.noveltyWeight ?? 0));
  const ctx = nw > 0 ? buildNoveltyContext() : null;
  let best = null;
  for (const txt of genN(bank, input, model, N2)) {
    let sc = scoreText(txt, lt).score;
    if (ctx) sc += nw * (noveltyOf(txt, ctx) * 40) - nw * (cooldownHit(txt, ctx) * 30);
    if (opts.grammarFilter) sc -= Math.min(grammarFlags(txt).count, 6) * 12;
    sc -= coherencePenalty(txt, { ...opts, perspective: opts.perspective ?? input.perspective });
    if (!best || sc > best.score) best = { txt, score: sc };
  }
  const win = best ?? { txt: buildStory(bank, input, model), score: 0 };
  feedGeneratedToCorpus(win.txt);
  return win;
}
function genN(bank, input, model, N2) {
  N2 = Math.max(1, Math.min(500, N2 | 0));
  const out = [];
  for (let i = 0; i < N2; i++) {
    for (let b = 0; b < 2; b++) Math.random();
    out.push(buildStory(bank, input, model));
  }
  return out;
}
function selfFeedActive() {
  try {
    const s = loadSettings();
    return !!(s.enabled && s.learnStories);
  } catch {
    return false;
  }
}
function feedGeneratedToCorpus(txt) {
  try {
    if (!txt || !selfFeedActive()) return;
    const flat = txt.replace(/\s+/g, " ").trim();
    if (flat.length < 40) return;
    const probe = flat.slice(0, 120).toLowerCase();
    if (loadPersistentCorpus().replace(/\s+/g, " ").toLowerCase().includes(probe)) return;
    appendToPersistentCorpus(flat);
  } catch {
  }
}

// src/features/sources.ts
function sammle(phrasen, quelle, prio, low, acc) {
  for (const roh of phrasen) {
    const p = (roh || "").trim();
    if (p.length < 5) continue;
    const pl = p.toLowerCase();
    let von = 0, i = low.indexOf(pl, von);
    while (i !== -1) {
      acc.push({ s: i, e: i + pl.length, quelle, prio });
      von = i + pl.length;
      if (acc.length > 4e3) return;
      i = low.indexOf(pl, von);
    }
  }
}
function analysiereHerkunft(text, tone, ctx) {
  const low = (text || "").toLowerCase();
  const acc = [];
  if (tone && tone !== "neutral") {
    const td = TONE_DATA[tone];
    if (td) sammle([...td.opener, ...td.flavor], "ton", 3, low, acc);
  }
  const w4 = [];
  [ctx.who, ctx.where, ctx.when, ctx.what].forEach((v) => (v || "").split(",").forEach((t) => {
    const x = t.trim();
    if (x.length >= 4) w4.push(x);
  }));
  sammle(w4, "kontext", 2, low, acc);
  try {
    const b = loadBank();
    const alle = [];
    for (const k of Object.keys(b)) if (Array.isArray(b[k])) alle.push(...b[k]);
    sammle(alle, "wortbank", 1, low, acc);
  } catch {
  }
  try {
    sammle(liveTexts(), "pools", 1, low, acc);
  } catch {
  }
  try {
    sammle(getMarkovTrace(), "markov", 2, low, acc);
  } catch {
  }
  acc.sort((a, b) => a.s - b.s || b.e - b.s - (a.e - a.s) || b.prio - a.prio);
  const segmente = [];
  let ende = -1;
  for (const t of acc) {
    if (t.s < ende) continue;
    segmente.push({ s: t.s, e: t.e, quelle: t.quelle });
    ende = t.e;
  }
  const zeichen = (text || "").length || 1;
  const anteile = { wortbank: 0, ton: 0, kontext: 0, pools: 0, markov: 0, vorlage: 0 };
  let belegt = 0;
  for (const s of segmente) {
    anteile[s.quelle] += s.e - s.s;
    belegt += s.e - s.s;
  }
  anteile.vorlage = Math.max(0, zeichen - belegt);
  for (const k of Object.keys(anteile)) anteile[k] = anteile[k] / zeichen;
  let poolUeberschneidung = 0;
  try {
    const b = loadBank();
    const bankSet = /* @__PURE__ */ new Set();
    for (const k of Object.keys(b)) if (Array.isArray(b[k])) for (const x of b[k]) bankSet.add(x.trim().toLowerCase());
    const lt = liveTexts();
    if (lt.length) {
      let doppelt = 0;
      for (const p of lt) if (bankSet.has(p.trim().toLowerCase())) doppelt++;
      poolUeberschneidung = doppelt / lt.length;
    }
  } catch {
  }
  const spur2 = getTraceFor(text);
  if (spur2.length) {
    const roh = { wortbank: 0, ton: 0, kontext: 0, pools: 0, markov: 0, vorlage: 0 };
    const mapQ = (q) => q === "vorlage" ? "vorlage" : q === "kontext" ? "kontext" : q === "markov" ? "markov" : q === "pools" ? "pools" : "wortbank";
    let summe = 0;
    for (const sch of spur2) {
      const fl = (sch.fueller || []).reduce((n, f) => n + f.text.length, 0);
      const eigen = Math.max(0, sch.text.length - fl);
      roh[mapQ(sch.quelle)] += eigen;
      summe += eigen;
      for (const f of sch.fueller || []) {
        roh[mapQ(f.quelle)] += f.text.length;
        summe += f.text.length;
      }
    }
    if (summe > 0) {
      for (const k of Object.keys(roh)) anteile[k] = roh[k] / summe;
      return { segmente, anteile, zeichen, exakt: true, poolUeberschneidung };
    }
  }
  return { segmente, anteile, zeichen, exakt: false, poolUeberschneidung };
}

// ../../t.ts
var inp = {
  where: "auf der Schafsweide",
  when: "vor langer Zeit",
  who: "Baucis, Philemon",
  what: "ein Wunder geschieht",
  tone: "ironisch",
  form: "prosagedicht",
  structure: "rekombination",
  perspective: "wir",
  rhythm: "atem",
  lenTarget: 110
};
var t1 = buildStory(loadBank(), inp, void 0);
console.log("direkt  : Spur-Schritte =", getTraceFor(t1).length, "| exakt =", analysiereHerkunft(t1, "ironisch", inp).exakt);
var t2 = bestOf(loadBank(), inp, void 0, 12, { noveltyWeight: 0.5, grammarFilter: true }).txt;
console.log("bestOf  : Spur-Schritte =", getTraceFor(t2).length, "| exakt =", analysiereHerkunft(t2, "ironisch", inp).exakt);
