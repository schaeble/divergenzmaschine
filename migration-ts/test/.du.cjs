// src/text-utils.ts
function clean(s) {
  return (s ?? "").toString().trim().replace(/\s+/g, " ");
}
function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}
function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
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
  "seidenfaden": "m",
  "antrag": "m",
  "backup": "n",
  "bank": "f",
  "bescheid": "m",
  "beweis": "m",
  "bote": "m",
  "cache": "m",
  "echo": "n",
  "fluch": "m",
  "frist": "f",
  "karteikarte": "f",
  "kehle": "f",
  "kiste": "f",
  "k\xE4lte": "f",
  "leitung": "f",
  "linie": "f",
  "log": "n",
  "maske": "f",
  "nymphe": "f",
  "omen": "n",
  "orakel": "n",
  "paradoxon": "n",
  "schnitt": "m",
  "schnittstelle": "f",
  "schrein": "m",
  "segen": "m",
  "signal": "n",
  "update": "n",
  "w\xE4rme": "f",
  "zettel": "m",
  "zittern": "n",
  "f\xE4hrmann": "m",
  "hintert\xFCr": "f",
  "instanz": "f",
  "sachbearbeiter": "m"
};

// src/generation/declension.ts
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

// src/generation/beats.ts
function cap(s) {
  s = (s ?? "").toString();
  return s ? s[0].toUpperCase() + s.slice(1) : s;
}

// src/generation/shape.ts
var KEIN_VERB_AUF_T = /* @__PURE__ */ new Set([
  "alt",
  "kalt",
  "laut",
  "bunt",
  "hart",
  "zart",
  "satt",
  "glatt",
  "weit",
  "breit",
  "rot",
  "tot",
  "gut",
  "sp\xE4t",
  "echt",
  "leicht",
  "dicht",
  "recht",
  "schlecht",
  "nackt",
  "fest",
  "letzt",
  "jetzt",
  "sanft",
  "ernst",
  "wert",
  "leer",
  "seit",
  "statt",
  "samt",
  "nicht",
  "mit",
  "seid",
  "zuletzt",
  "zuerst",
  "oft",
  "fast",
  "erst",
  "sonst",
  "meist",
  "direkt"
]);
var SUBJ_FUGE = /^(und|oder|aber|denn|doch|sondern|dann|da|weil|dass|als|wenn|während|obwohl|bevor|nachdem|sobald|solange|ob|wie|so|auch|nur|jetzt|dort|hier|heute|gestern|morgen|plötzlich|dabei|dadurch|deshalb|trotzdem|später|zuerst|zuletzt|außerdem|schließlich)$/i;
var DEF_ART = { m: "der", f: "die", n: "das" };
function objektName(o) {
  const t = clean(o);
  if (!t) return "das Ding";
  if (/^(der|die|das|den|dem|des|ein|eine|einen|einem|einer|eines)\s/i.test(t)) return t;
  const kern = t.split(" ")[0].replace(/[^A-Za-zÄÖÜäöüß]/g, "");
  return `${DEF_ART[guessGender(kern) || "n"]} ${t}`;
}
var DING_VORRAT = [
  "T\xFCr",
  "Uhr",
  "Karteikarte",
  "Lampe",
  "Schl\xFCssel",
  "Fenster",
  "Bank",
  "Treppe",
  "Spiegel",
  "Kiste",
  "Zettel",
  "Mauer",
  "Stuhl",
  "Leitung",
  "Schwelle"
];
var OBJEKT_EINSTIEG = [
  // NICHT „… und zaehle mit.": Der Bruchstueck-Filter braucht dort ein finites
  // Verb, und hatFinitesVerb() erkennt die erste Person nicht. Ein Rahmensatz,
  // der von einem unzuverlaessigen Erkenner abhaengt, ist ein Rahmensatz auf Zeit.
  "Ich bin %O. Ich liege hier und z\xE4hle die Tage.",
  "Ich bin %O. Man hat mich hier vergessen.",
  "Ich bin %O. Niemand fragt mich, und ich sehe alles.",
  "Ich bin %O. Ich habe keine Augen und trotzdem einen Blick.",
  "Ich bin %O. Ich bleibe, wo man mich hingestellt hat.",
  "Ich bin %O. Man geht an mir vorbei, seit Jahren."
];
var OBJEKT_ZWISCHENRUF = [
  "Ich sehe zu.",
  "Ich liege dabei.",
  "Ich z\xE4hle mit.",
  "Ich r\xFChre mich nicht.",
  "Ich habe Zeit.",
  "Ich merke es mir."
];
function applyPerspective(paras, perspective, who, objName) {
  const P = clean(who) || "Jemand";
  const O = objektName(clean(objName) || pick(DING_VORRAT));
  const swap = (s, person, pronoun) => {
    if (!P) return s;
    try {
      const re = new RegExp("([A-Za-z\xC4\xD6\xDC\xE4\xF6\xFC\xDF]+\\s+)?\\b" + escapeRegExp(P) + "\\b(\\s+[A-Za-z\xC4\xD6\xDC\xE4\xF6\xFC\xDF]+)?", "gi");
      return s.replace(re, (_m, before, after, ...rest) => {
        const idx = rest[rest.length - 2];
        const voll = rest[rest.length - 1];
        const posP = voll.toLowerCase().indexOf(P.toLowerCase(), idx);
        if (posP > 0 && /[-–\wÄÖÜäöüß]/.test(voll.charAt(posP - 1))) return _m;
        const davor = voll.slice(0, posP).replace(/\s+$/, "");
        const gross = davor === "" || /[.!?…:;—–„"»(]$/.test(davor);
        const pron = gross ? pronoun.charAt(0).toUpperCase() + pronoun.slice(1) : pronoun;
        const bw = before ? before.trim() : "";
        const aw = after ? after.trim() : "";
        const bw3 = ICH_DU_ZU_ER[bw.toLowerCase()] || bw;
        const aw3 = ICH_DU_ZU_ER[aw.toLowerCase()] || aw;
        const beuge = (v) => {
          if (VERB_CONJ[v.toLowerCase()]) return conjugateVerbToken(v, person);
          if (!/[a-zäöüß]{3,}t$/.test(v)) return v;
          const stamm = v.slice(0, -1);
          const hatE = /e$/.test(stamm);
          if (person === "du") return stamm + "st";
          if (person === "ich") return hatE ? stamm : stamm + "e";
          if (person === "wir") return hatE ? stamm + "n" : stamm + "en";
          return v;
        };
        const kennt = (v) => !!VERB_CONJ[v.toLowerCase()] || /^[a-zäöüß]{3,}t$/.test(v) && !KEIN_VERB_AUF_T.has(v.toLowerCase());
        const letztesWort = (davor.match(/[A-Za-zÄÖÜäöüß-]+$/) || [""])[0];
        const subjektstelle = gross || /[,;]$/.test(davor) || SUBJ_FUGE.test(letztesWort) || !!bw && kennt(bw3);
        if (!subjektstelle) return _m;
        if (bw && kennt(bw3)) return beuge(bw3) + " " + pron + (after || "");
        if (aw && kennt(aw3)) return (before || "") + pron + " " + beuge(aw3);
        return (before || "") + pron + (after || "");
      });
    } catch {
      return s.replace(new RegExp("\\b" + escapeRegExp(P) + "\\b", "gi"), pronoun);
    }
  };
  const toFirst = (s) => swap(s, "ich", "ich");
  const toSecond = (s) => swap(s, "du", "du");
  const toWe = (s) => swap(s, "wir", "wir");
  const toObject = (s) => `${pick(OBJEKT_ZWISCHENRUF)} ${s}`;
  if (perspective === "third") return paras;
  if (perspective === "first") return paras.map(toFirst);
  if (perspective === "second") return paras.map(toSecond);
  if (perspective === "we") return paras.map(toWe);
  if (perspective === "object") {
    const einstieg = pick(OBJEKT_EINSTIEG).replace("%O", O);
    return paras.map((p, i) => i === 0 ? `${einstieg} ${p}` : p);
  }
  const cycle = ["first", "second", "third", "object"];
  return paras.map((p, i) => {
    const k = cycle[i % cycle.length];
    if (k === "first") return toFirst(p);
    if (k === "second") return toSecond(p);
    if (k === "object") return toObject(p);
    return p;
  });
}

// ../../du.ts
var st = {};
globalThis.localStorage = { getItem: (k) => st[k] ?? null, setItem: (k, v) => {
  st[k] = String(v);
}, removeItem: (k) => {
  delete st[k];
} };
globalThis.window = { localStorage: globalThis.localStorage };
var name = "Giovanni Salustio Peruzzi";
var absatz = `In der Toskana wird der italienische Festungsbaumeister und Milit\xE4r ${name} geboren, der insbesondere durch Bauten im Dienst deutscher F\xFCrsten wie der Markgrafen von Brandenburg bekannt wurde.`;
for (const p of ["second", "first", "we"]) {
  console.log("\u2500\u2500 " + p + " \u2500\u2500");
  console.log("   " + applyPerspective([absatz], p, name, "Stempel")[0]);
}
console.log("\n\u2500\u2500 kurzer Fall \u2500\u2500");
console.log("   " + applyPerspective(["Die Archivarin h\xE4lt einen Stempel fest."], "second", "die Archivarin", "Akte")[0]);
console.log("   " + applyPerspective(["Der Sohn eines F\xE4lschers erbt ein Amt."], "second", "der Sohn eines F\xE4lschers", "Akte")[0]);
