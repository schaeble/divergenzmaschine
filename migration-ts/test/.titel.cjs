"use strict";

// test/titel.ts
var import_fs = require("fs");

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
var INFINITIVE_VERBS = /* @__PURE__ */ new Set(["entdecken", "finden", "verstehen", "erreichen", "verlassen", "retten", "zerst\xF6ren", "beweisen", "\xFCberleben", "fliehen", "gewinnen", "verlieren", "\xF6ffnen", "schlie\xDFen", "verschwinden", "sterben", "bleiben", "ankommen", "entkommen", "aufwachen", "vergessen", "lernen", "ver\xE4ndern", "kontrollieren", "sch\xFCtzen", "befreien", "heilen", "erschaffen", "reparieren", "beenden", "anfangen", "beginnen", "erinnern", "wissen", "glauben", "tr\xE4umen", "hoffen", "k\xE4mpfen", "siegen", "sprechen", "schweigen", "warten", "folgen", "fragen", "antworten", "erkl\xE4ren", "gehen", "kommen"]);

// src/generation/nouns.data.ts
var NOUN_GENDER = {
  "abdruck": "m",
  "abend": "m",
  "abgrund": "m",
  "absatz": "m",
  "abschalten": "n",
  "abstand": "m",
  "acker": "m",
  "ader": "f",
  "adressbuch": "n",
  "adresse": "f",
  "ahnung": "f",
  "airpod": "m",
  "akku": "m",
  "akte": "f",
  "aktendeckel": "m",
  "aktennotiz": "f",
  "allee": "f",
  "alptraum": "m",
  "altar": "m",
  "alte": "f",
  "alter": "n",
  "amt": "n",
  "amulett": "n",
  "angebot": "n",
  "angst": "f",
  "anker": "m",
  "antenne": "f",
  "antrag": "m",
  "antwort": "f",
  "apfel": "m",
  "applaus": "m",
  "archiv": "n",
  "arm": "m",
  "armband": "n",
  "armbrust": "f",
  "art": "f",
  "arzt": "m",
  "asche": "f",
  "ast": "m",
  "atelier": "n",
  "atem": "m",
  "atmosph\xE4re": "f",
  "aufkleber": "m",
  "aufnahme": "f",
  "auftrag": "m",
  "auge": "n",
  "augenblick": "m",
  "augenlid": "n",
  "ausdehnung": "f",
  "ausgang": "m",
  "ausnahme": "f",
  "ausrede": "f",
  "ausweis": "m",
  "axiom": "n",
  "baby": "n",
  "bach": "m",
  "backup": "n",
  "badeanstalt": "f",
  "bahn": "f",
  "bahnkarte": "f",
  "balkon": "m",
  "ball": "m",
  "ballade": "f",
  "band": "n",
  "bank": "f",
  "banner": "n",
  "basecap": "n",
  "bau": "m",
  "bauch": "m",
  "bauer": "m",
  "baum": "m",
  "becher": "m",
  "befehl": "m",
  "begriff": "m",
  "beil": "n",
  "bein": "n",
  "benachrichtigung": "f",
  "berg": "m",
  "bergfried": "m",
  "bericht": "m",
  "bescheid": "m",
  "beschluss": "m",
  "besen": "m",
  "besitz": "m",
  "bestand": "m",
  "besuch": "m",
  "betonprobe": "f",
  "bett": "n",
  "beutel": "m",
  "beweis": "m",
  "bibel": "f",
  "bibliothek": "f",
  "biene": "f",
  "bild": "n",
  "bildschirm": "m",
  "binde": "f",
  "birne": "f",
  "blatt": "n",
  "blechb\xFCchse": "f",
  "blechdose": "f",
  "blechkanne": "f",
  "blechtrompete": "f",
  "blei": "n",
  "bleistift": "m",
  "blende": "f",
  "blick": "m",
  "blitz": "m",
  "blume": "f",
  "blumenstrau\xDF": "m",
  "bluse": "f",
  "bl\xFCte": "f",
  "boden": "m",
  "bohne": "f",
  "bohrkern": "m",
  "bohrprobe": "f",
  "boje": "f",
  "bonbon": "n",
  "boot": "n",
  "bote": "m",
  "botschaft": "f",
  "braten": "m",
  "braue": "f",
  "brett": "n",
  "brief": "m",
  "briefumschlag": "m",
  "brille": "f",
  "brot": "n",
  "brotdose": "f",
  "brotlaib": "m",
  "bruch": "m",
  "bruder": "m",
  "brunnen": "m",
  "brust": "f",
  "br\xFCcke": "f",
  "br\xFChe": "f",
  "buch": "n",
  "buchstabe": "m",
  "bucht": "f",
  "bug": "m",
  "burg": "f",
  "bus": "m",
  "busch": "m",
  "butter": "f",
  "b\xE4r": "m",
  "b\xFChne": "f",
  "b\xFCndel": "n",
  "b\xFCrde": "f",
  "cache": "m",
  "cadtablet": "n",
  "caf": "n",
  "caf\xE9": "n",
  "chat": "m",
  "clown": "m",
  "computer": "m",
  "container": "m",
  "couch": "f",
  "dach": "n",
  "dachboden": "m",
  "dame": "f",
  "damm": "m",
  "dashboard": "n",
  "datei": "f",
  "dattel": "f",
  "datum": "n",
  "daumen": "m",
  "deck": "n",
  "decke": "f",
  "deckel": "m",
  "denkmalschutz": "m",
  "deo": "n",
  "detail": "n",
  "detektor": "m",
  "detektorkopf": "m",
  "dewar": "m",
  "diagramm": "n",
  "dichter": "m",
  "dieb": "m",
  "dienst": "m",
  "direktor": "m",
  "dnaspirale": "f",
  "dokument": "n",
  "dolch": "m",
  "donner": "m",
  "dorf": "n",
  "dorn": "m",
  "dose": "f",
  "draht": "m",
  "droschke": "f",
  "druck": "m",
  "duell": "n",
  "duft": "m",
  "durchsage": "f",
  "durchschlag": "m",
  "d\xE4mmerung": "f",
  "ebbe": "f",
  "ebene": "f",
  "echo": "n",
  "ecke": "f",
  "ehre": "f",
  "ei": "n",
  "eid": "m",
  "einspruch": "m",
  "eis": "n",
  "eisen": "n",
  "elch": "m",
  "elend": "n",
  "ellbogen": "m",
  "emoji": "n",
  "engel": "m",
  "enkel": "m",
  "ente": "f",
  "entwurf": "m",
  "ephemeride": "f",
  "erbe": "n",
  "erbse": "f",
  "erdbeben": "n",
  "erde": "f",
  "erinnerung": "f",
  "etikett": "n",
  "eule": "f",
  "ewigkeit": "f",
  "fabel": "f",
  "fabrik": "f",
  "fackel": "f",
  "faden": "m",
  "fahne": "f",
  "fahrschein": "m",
  "fahrt": "f",
  "falle": "f",
  "falte": "f",
  "farbe": "f",
  "farbenscheibe": "f",
  "fass": "n",
  "faust": "f",
  "feder": "f",
  "federkiel": "m",
  "fee": "f",
  "fehlercode": "m",
  "feile": "f",
  "feind": "m",
  "feld": "n",
  "feldbesteck": "n",
  "felder": "n",
  "fell": "n",
  "fellhandschuh": "m",
  "fels": "m",
  "felsen": "m",
  "fenster": "n",
  "fensterplatz": "m",
  "ferkel": "n",
  "ferne": "f",
  "fernglas": "n",
  "fernrohr": "n",
  "ferse": "f",
  "fessel": "f",
  "festung": "f",
  "feuer": "n",
  "feuerzeug": "n",
  "fibel": "f",
  "fieber": "n",
  "filter": "m",
  "finger": "m",
  "fingerhut": "m",
  "fisch": "m",
  "fischer": "m",
  "flakon": "m",
  "flasche": "f",
  "flaute": "f",
  "fleisch": "n",
  "fliege": "f",
  "flo\xDF": "n",
  "fluch": "m",
  "flucht": "f",
  "flur": "m",
  "fluss": "m",
  "flut": "f",
  "fl\xE4che": "f",
  "fl\xF6te": "f",
  "fl\xFCstern": "n",
  "formel": "f",
  "formular": "n",
  "fossil": "n",
  "fossilie": "f",
  "foto": "n",
  "fotografie": "f",
  "frachtbrief": "m",
  "frage": "f",
  "frau": "f",
  "freude": "f",
  "freund": "m",
  "frist": "f",
  "frost": "m",
  "frucht": "f",
  "fr\xFChling": "m",
  "fuchs": "m",
  "fuge": "f",
  "fund": "m",
  "fundament": "n",
  "funke": "m",
  "funkger\xE4t": "n",
  "furcht": "f",
  "furt": "f",
  "fu\xDF": "m",
  "f\xE4hrmann": "m",
  "f\xE4hrplan": "m",
  "f\xE4sser": "n",
  "f\xFCrst": "m",
  "gabe": "f",
  "gabel": "f",
  "gabelung": "f",
  "galaxie": "f",
  "gang": "m",
  "gans": "f",
  "garn": "n",
  "garten": "m",
  "gasse": "f",
  "gast": "m",
  "gebet": "n",
  "gebetbuch": "n",
  "gebete": "n",
  "gebetsschale": "f",
  "gebirge": "n",
  "geb\xE4lk": "n",
  "geb\xE4ude": "n",
  "gedanke": "m",
  "gedanken": "m",
  "gedicht": "n",
  "gedichte": "n",
  "geduld": "f",
  "gefahr": "f",
  "gef\xFChl": "n",
  "gef\xFChlen": "n",
  "gegend": "f",
  "gegensatz": "m",
  "gegenstand": "m",
  "gegens\xE4tze": "m",
  "gegenteil": "n",
  "gegenwart": "f",
  "gegners": "m",
  "geheimnis": "n",
  "gehirn": "n",
  "geh\xE4use": "n",
  "geige": "f",
  "geist": "m",
  "geleitbrief": "m",
  "gel\xE4nde": "n",
  "gel\xFCbde": "n",
  "gemach": "n",
  "gem\xE4lde": "n",
  "gem\xFCse": "n",
  "gep\xE4ck": "n",
  "gericht": "n",
  "geruch": "m",
  "ger\xE4t": "n",
  "ger\xE4usch": "n",
  "ger\xE4usche": "n",
  "ger\xF6ll": "n",
  "ger\xFCcht": "n",
  "ger\xFCchte": "n",
  "ger\xFCst": "n",
  "gesangbuch": "n",
  "geschenk": "n",
  "geschichte": "f",
  "geschichten": "f",
  "geschmack": "m",
  "gesetz": "n",
  "gesetze": "n",
  "gesetzen": "n",
  "gesetzes": "n",
  "gesetzestext": "m",
  "gesicht": "n",
  "gesichter": "n",
  "gespr\xE4ch": "n",
  "gestalt": "f",
  "gestalten": "f",
  "geste": "f",
  "gestein": "n",
  "gesteinsschichten": "f",
  "getreide": "n",
  "getreidek\xF6rner": "n",
  "gewand": "n",
  "gewebe": "n",
  "gewehr": "n",
  "gewehre": "n",
  "geweih": "n",
  "gewicht": "n",
  "gewichte": "n",
  "gewissen": "n",
  "gew\xF6lbe": "n",
  "gezeiten": "f",
  "gier": "f",
  "gie\xDFkanne": "f",
  "gift": "n",
  "gipfel": "m",
  "gitter": "n",
  "glas": "n",
  "glasplatte": "f",
  "glaube": "m",
  "gleichung": "f",
  "gletscher": "m",
  "glocke": "f",
  "gl\xFCck": "n",
  "gold": "n",
  "gott": "m",
  "grab": "n",
  "graben": "m",
  "granitblock": "m",
  "grenze": "f",
  "grotte": "f",
  "grund": "m",
  "grundrissplan": "m",
  "gruppe": "f",
  "gruppenchat": "m",
  "gurke": "f",
  "g\xF6tter": "m",
  "g\xF6ttin": "f",
  "g\xFCrtel": "m",
  "haar": "n",
  "haarnadel": "f",
  "hafen": "m",
  "hagel": "m",
  "hahn": "m",
  "hain": "m",
  "haken": "m",
  "halde": "f",
  "hall": "m",
  "halle": "f",
  "hals": "m",
  "halter": "m",
  "hammer": "m",
  "hand": "f",
  "handbuch": "n",
  "handkarren": "m",
  "handschuh": "m",
  "handschuhspitze": "f",
  "handvoll": "f",
  "handy": "n",
  "hang": "m",
  "harfe": "f",
  "harpune": "f",
  "hase": "m",
  "hass": "m",
  "haus": "n",
  "haut": "f",
  "hecke": "f",
  "heft": "n",
  "held": "m",
  "helm": "m",
  "hemd": "n",
  "henne": "f",
  "herbst": "m",
  "herd": "m",
  "herr": "m",
  "herrscherstab": "m",
  "herz": "n",
  "herzschlag": "m",
  "heuer": "f",
  "hexe": "f",
  "hierarchie": "f",
  "himmel": "m",
  "hintergrund": "m",
  "hintert\xFCr": "f",
  "hirn": "n",
  "hirsch": "m",
  "hirtenstab": "m",
  "hof": "m",
  "hoffnung": "f",
  "holz": "n",
  "honig": "m",
  "hoodie": "m",
  "horn": "n",
  "hose": "f",
  "huhn": "n",
  "hund": "m",
  "hut": "m",
  "h\xE4user": "n",
  "h\xF6henmesser": "m",
  "h\xF6hle": "f",
  "h\xFCfte": "f",
  "h\xFCgel": "m",
  "h\xFCtte": "f",
  "igel": "m",
  "index": "m",
  "insekt": "n",
  "insel": "f",
  "instanz": "f",
  "instastory": "f",
  "instrument": "n",
  "interferometer": "n",
  "jacke": "f",
  "jazz": "m",
  "junge": "m",
  "justiergewicht": "n",
  "j\xE4ger": "m",
  "kabel": "n",
  "kaffee": "m",
  "kai": "m",
  "kaiser": "m",
  "kalb": "n",
  "kalender": "m",
  "kamin": "m",
  "kaminfeuer": "n",
  "kammer": "f",
  "kampf": "m",
  "kanal": "m",
  "kaninchen": "n",
  "kanister": "m",
  "kanne": "f",
  "kanten": "m",
  "kapelle": "f",
  "kapit\xE4n": "m",
  "karawane": "f",
  "karotte": "f",
  "karte": "f",
  "karteikarte": "f",
  "kartoffel": "f",
  "kassenbuch": "n",
  "kathedrale": "f",
  "katze": "f",
  "kaugummi": "m",
  "kehle": "f",
  "kelch": "m",
  "kelle": "f",
  "keller": "m",
  "kerze": "f",
  "kessel": "m",
  "kette": "f",
  "kettenhemd": "n",
  "kiefer": "m",
  "kiel": "m",
  "kies": "m",
  "kilometer": "m",
  "kind": "n",
  "kinder": "n",
  "kinderspielzeug": "n",
  "kinn": "n",
  "kirche": "f",
  "kirsche": "f",
  "kissen": "n",
  "kiste": "f",
  "klammer": "f",
  "klang": "m",
  "klaue": "f",
  "klavier": "n",
  "kleid": "n",
  "kleidersack": "m",
  "kleingeldfach": "n",
  "kleinod": "n",
  "klinge": "f",
  "klingel": "f",
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
  "kohleneimer": "m",
  "kohleschale": "f",
  "kollege": "m",
  "kollegheft": "n",
  "kollektiv": "n",
  "kolonie": "f",
  "komet": "m",
  "kommentar": "m",
  "kommissar": "m",
  "kompass": "m",
  "kompressor": "m",
  "konstante": "f",
  "konto": "n",
  "kontobuch": "n",
  "kontor": "n",
  "kontorbuch": "n",
  "kontostand": "m",
  "kopf": "m",
  "kopfh\xF6rer": "m",
  "kopie": "f",
  "korb": "m",
  "korken": "m",
  "korn": "n",
  "kraft": "f",
  "kran": "m",
  "krater": "m",
  "kreide": "f",
  "kreis": "m",
  "kreuz": "n",
  "kreuzung": "f",
  "kribbeln": "n",
  "krieg": "m",
  "krieger": "m",
  "kristall": "m",
  "krone": "f",
  "krug": "m",
  "kr\xE4he": "f",
  "kuchen": "m",
  "kuh": "f",
  "kupfer": "n",
  "kuppel": "f",
  "kurbel": "f",
  "kurve": "f",
  "kuss": "m",
  "kutsche": "f",
  "kuvert": "n",
  "k\xE4fer": "m",
  "k\xE4lte": "f",
  "k\xE4se": "m",
  "k\xF6nig": "m",
  "k\xF6nigin": "f",
  "k\xF6rper": "m",
  "k\xFCche": "f",
  "k\xFChlbox": "f",
  "k\xFChlfalle": "f",
  "k\xFCken": "n",
  "k\xFCste": "f",
  "labyrinth": "n",
  "ladebalken": "m",
  "ladekabel": "n",
  "ladeliste": "f",
  "lager": "n",
  "lagune": "f",
  "laib": "m",
  "lamm": "n",
  "lampe": "f",
  "land": "n",
  "lanze": "f",
  "laterne": "f",
  "laub": "n",
  "laufzettel": "m",
  "laute": "f",
  "lawine": "f",
  "leder": "n",
  "lederbeutel": "m",
  "legende": "f",
  "lehen": "n",
  "lehrer": "m",
  "leid": "n",
  "leine": "f",
  "leitdetail": "n",
  "leitung": "f",
  "leuchten": "n",
  "leuchtturm": "m",
  "licht": "n",
  "lichtstreifen": "m",
  "lider": "n",
  "liebe": "f",
  "lied": "n",
  "lilie": "f",
  "lineal": "n",
  "linie": "f",
  "lippe": "f",
  "liste": "f",
  "loch": "n",
  "locke": "f",
  "log": "n",
  "logbuch": "n",
  "logfile": "n",
  "los": "n",
  "lot": "n",
  "luft": "f",
  "lupe": "f",
  "lust": "f",
  "l\xE4cheln": "n",
  "l\xE4nder": "n",
  "l\xE4rm": "m",
  "l\xF6cher": "n",
  "l\xF6ffel": "m",
  "l\xF6we": "m",
  "l\xFCcke": "f",
  "l\xFCge": "f",
  "macht": "f",
  "magen": "m",
  "mala": "f",
  "maler": "m",
  "manege": "f",
  "manifest": "n",
  "mann": "m",
  "mantel": "m",
  "manuskript": "n",
  "mappe": "f",
  "marmelade": "f",
  "masche": "f",
  "maschine": "f",
  "maske": "f",
  "mast": "m",
  "matte": "f",
  "mauer": "f",
  "maus": "f",
  "ma\xDF": "n",
  "ma\xDFband": "n",
  "ma\xDFstab": "m",
  "medaillon": "n",
  "meer": "n",
  "mehl": "n",
  "mei\xDFel": "m",
  "melodie": "f",
  "meme": "n",
  "menge": "f",
  "merkblatt": "n",
  "messer": "n",
  "messprotokoll": "n",
  "messreihe": "f",
  "messung": "f",
  "metall": "n",
  "meter": "m",
  "metronom": "n",
  "miene": "f",
  "mikrofon": "n",
  "mikroskop": "n",
  "milch": "f",
  "millimeter": "m",
  "minute": "f",
  "mitleid": "n",
  "mittag": "m",
  "mittel": "n",
  "mitternacht": "f",
  "modell": "n",
  "modellplaneten": "m",
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
  "nachbarort": "m",
  "nachlass": "m",
  "nachmittag": "m",
  "nachricht": "f",
  "nacht": "f",
  "nachtigall": "f",
  "nacken": "m",
  "nadel": "f",
  "nadelkissen": "n",
  "nagel": "m",
  "naht": "f",
  "name": "m",
  "napf": "m",
  "narbe": "f",
  "nase": "f",
  "nebel": "m",
  "neffe": "m",
  "neid": "m",
  "neigung": "f",
  "neigungsmesser": "m",
  "nelke": "f",
  "nest": "n",
  "nester": "n",
  "netz": "n",
  "nische": "f",
  "nonne": "f",
  "note": "f",
  "notenblatt": "n",
  "notiz": "f",
  "notizblock": "m",
  "notizbuch": "n",
  "nummer": "f",
  "nuss": "f",
  "nymphe": "f",
  "n\xE4he": "f",
  "obst": "n",
  "ofen": "m",
  "ohr": "n",
  "oma": "f",
  "omen": "n",
  "onkel": "m",
  "opfer": "n",
  "opferschale": "f",
  "opiumdose": "f",
  "orakel": "n",
  "orange": "f",
  "organ": "n",
  "orgel": "f",
  "ort": "m",
  "ozean": "m",
  "paar": "n",
  "paket": "n",
  "pakt": "m",
  "papier": "n",
  "paradoxon": "n",
  "paragraph": "m",
  "parameter": "m",
  "park": "m",
  "passagier": "m",
  "passierschein": "m",
  "pegelstab": "m",
  "peilstock": "m",
  "peitsche": "f",
  "pendel": "n",
  "pergamentrolle": "f",
  "perle": "f",
  "perlmuttknopf": "m",
  "person": "f",
  "petrischale": "f",
  "petroleumlampe": "f",
  "pfad": "m",
  "pfand": "n",
  "pfandschein": "m",
  "pfeffer": "m",
  "pfeife": "f",
  "pferd": "n",
  "pfirsich": "m",
  "pflaster": "n",
  "pflaume": "f",
  "pflug": "m",
  "pf\xFCtze": "f",
  "phiole": "f",
  "photoplatte": "f",
  "pickel": "m",
  "pilz": "m",
  "ping": "m",
  "pinzette": "f",
  "pipette": "f",
  "plakat": "n",
  "plan": "m",
  "plane": "f",
  "planet": "m",
  "planke": "f",
  "platte": "f",
  "platz": "m",
  "platzhalter": "m",
  "poller": "m",
  "port": "m",
  "portal": "n",
  "postkarte": "f",
  "powerbank": "f",
  "priester": "m",
  "prisma": "n",
  "probe": "f",
  "programm": "n",
  "protokoll": "n",
  "prozess": "m",
  "puls": "m",
  "pulver": "n",
  "punkt": "m",
  "puppe": "f",
  "qualle": "f",
  "quelle": "f",
  "quittung": "f",
  "rad": "n",
  "rampe": "f",
  "rand": "m",
  "randnotiz": "f",
  "ranke": "f",
  "ranzen": "m",
  "ratte": "f",
  "rauch": "m",
  "raumkapsel": "f",
  "rausch": "m",
  "rauschen": "n",
  "rechentafel": "f",
  "recht": "n",
  "regal": "n",
  "regel": "f",
  "regen": "m",
  "regenmesser": "m",
  "register": "n",
  "reh": "n",
  "reich": "n",
  "reif": "m",
  "reigen": "m",
  "reihe": "f",
  "reinraumhaube": "f",
  "reise": "f",
  "reisemantel": "m",
  "rei\xDFverschluss": "m",
  "reklame": "f",
  "rest": "m",
  "rettung": "f",
  "rezept": "n",
  "richter": "m",
  "riegel": "m",
  "riff": "n",
  "rinde": "f",
  "ring": "m",
  "rippe": "f",
  "riss": "m",
  "ritter": "m",
  "ritterhelm": "m",
  "rohr": "n",
  "roman": "m",
  "rose": "f",
  "ruder": "n",
  "ruf": "m",
  "ruine": "f",
  "rumpf": "m",
  "r\xE4tsel": "n",
  "r\xFCcken": "m",
  "saal": "m",
  "sachbearbeiter": "m",
  "sack": "m",
  "saft": "m",
  "sage": "f",
  "sahne": "f",
  "saite": "f",
  "salat": "m",
  "salz": "n",
  "samen": "m",
  "sammlung": "f",
  "sand": "m",
  "sandsack": "m",
  "sanduhr": "f",
  "sarg": "m",
  "satellit": "m",
  "sattel": "m",
  "sattelgurt": "m",
  "satz": "m",
  "saum": "m",
  "savanne": "f",
  "schacht": "m",
  "schaf": "n",
  "schale": "f",
  "schalter": "m",
  "scham": "f",
  "schatten": "m",
  "schatulle": "f",
  "schaufel": "f",
  "schere": "f",
  "schicht": "f",
  "schicksal": "n",
  "schiff": "n",
  "schiffssextanten": "m",
  "schiffszwieback": "m",
  "schild": "n",
  "schirm": "m",
  "schlaf": "m",
  "schlag": "m",
  "schlamm": "m",
  "schlange": "f",
  "schleife": "f",
  "schloss": "n",
  "schlucht": "f",
  "schl\xFCssel": "m",
  "schl\xFCsselbund": "m",
  "schmerz": "m",
  "schmied": "m",
  "schmiede": "f",
  "schminkkasten": "m",
  "schnecke": "f",
  "schnee": "m",
  "schneiderpuppe": "f",
  "schnitt": "m",
  "schnittbogen": "m",
  "schnittstelle": "f",
  "schnur": "f",
  "schokolade": "f",
  "schrank": "m",
  "schrei": "m",
  "schreiber": "m",
  "schrein": "m",
  "schrift": "f",
  "schritt": "m",
  "schuh": "m",
  "schuld": "f",
  "schuldschein": "m",
  "schule": "f",
  "schulter": "f",
  "schuppen": "m",
  "schuss": "m",
  "schwamm": "m",
  "schwein": "n",
  "schwelle": "f",
  "schwert": "n",
  "schwertgriff": "m",
  "schwertgurt": "m",
  "schwester": "f",
  "schw\xE4che": "f",
  "sch\xE4del": "m",
  "sch\xE4rpe": "f",
  "sch\xFCrze": "f",
  "sch\xFCssel": "f",
  "screenshot": "m",
  "see": "m",
  "seekarte": "f",
  "seele": "f",
  "seesack": "m",
  "segel": "n",
  "segeltuch": "n",
  "segen": "m",
  "sehne": "f",
  "sehnsucht": "f",
  "seidenfaden": "m",
  "seil": "n",
  "seismograph": "m",
  "seismographen": "m",
  "seite": "f",
  "sekunde": "f",
  "senf": "m",
  "sensor": "m",
  "sessel": "m",
  "sieb": "n",
  "siegel": "n",
  "siegelring": "m",
  "signal": "n",
  "signalflagge": "f",
  "silbe": "f",
  "silber": "n",
  "sinn": "m",
  "sirene": "f",
  "skala": "f",
  "skalpell": "n",
  "skelett": "n",
  "skizze": "f",
  "smartphone": "n",
  "socke": "f",
  "sofa": "n",
  "sohn": "m",
  "soldat": "m",
  "sommer": "m",
  "sonne": "f",
  "sonnenbrille": "f",
  "so\xDFe": "f",
  "spalt": "m",
  "speicher": "m",
  "spektrogramm": "n",
  "spektrometer": "n",
  "sperre": "f",
  "spiegel": "m",
  "spiegelscherben": "m",
  "spiel": "n",
  "spinne": "f",
  "sporn": "m",
  "sprache": "f",
  "sprung": "m",
  "spule": "f",
  "spur": "f",
  "stab": "m",
  "stadt": "f",
  "stahlstrebe": "f",
  "stamm": "m",
  "standarte": "f",
  "stapel": "m",
  "statue": "f",
  "staub": "m",
  "stecknadel": "f",
  "steg": "m",
  "steig": "m",
  "steigb\xFCgel": "m",
  "steigeisen": "n",
  "stein": "m",
  "stelle": "f",
  "stempel": "m",
  "stempelger\xE4usch": "n",
  "stempelhalter": "m",
  "steppe": "f",
  "stern": "m",
  "sternbilder": "n",
  "sternwarte": "f",
  "stethoskop": "n",
  "stiefel": "m",
  "stier": "m",
  "stille": "f",
  "stimme": "f",
  "stirn": "f",
  "stock": "m",
  "stoff": "m",
  "stollen": "m",
  "stolz": "m",
  "story": "f",
  "strand": "m",
  "strauch": "m",
  "stra\xDFe": "f",
  "streichholzschachtel": "f",
  "streit": "m",
  "strich": "m",
  "strom": "m",
  "strophe": "f",
  "str\xF6mung": "f",
  "stube": "f",
  "stufe": "f",
  "stuhl": "m",
  "stunde": "f",
  "stundenplan": "m",
  "sturm": "m",
  "sturmlaterne": "f",
  "st\xE4rke": "f",
  "st\xFCck": "n",
  "sumpf": "m",
  "suppe": "f",
  "suppenkelle": "f",
  "symbol": "n",
  "symptom": "n",
  "system": "n",
  "s\xE4ge": "f",
  "s\xE4ule": "f",
  "tabelle": "f",
  "tafel": "f",
  "tafelrunde": "f",
  "tag": "m",
  "takt": "m",
  "tal": "n",
  "talar": "m",
  "tante": "f",
  "tanz": "m",
  "tasche": "f",
  "taschenradio": "n",
  "tasse": "f",
  "tau": "n",
  "taube": "f",
  "tee": "m",
  "teer": "m",
  "teeschale": "f",
  "teich": "m",
  "teil": "m",
  "telefon": "n",
  "teleskop": "n",
  "teller": "m",
  "teppich": "m",
  "termin": "m",
  "terminal": "n",
  "terminzettel": "m",
  "teufel": "m",
  "thermometer": "n",
  "thermoskanne": "f",
  "thron": "m",
  "ticket": "n",
  "tier": "n",
  "tiger": "m",
  "tiktoksound": "m",
  "tintenfass": "n",
  "tisch": "m",
  "tochter": "f",
  "tod": "m",
  "tomate": "f",
  "ton": "m",
  "tonband": "n",
  "tonschale": "f",
  "tontafel": "f",
  "topf": "m",
  "tor": "n",
  "torte": "f",
  "trapezhaken": "m",
  "traube": "f",
  "trauer": "f",
  "traum": "m",
  "trend": "m",
  "treppe": "f",
  "treue": "f",
  "trillerpfeife": "f",
  "trinkhorn": "n",
  "trommel": "f",
  "truhe": "f",
  "tr\xE4ne": "f",
  "tuch": "n",
  "tulpe": "f",
  "tunnel": "m",
  "turm": "m",
  "turnbeutel": "m",
  "turnier": "n",
  "turnierplatz": "m",
  "turnierstab": "m",
  "t\xFCr": "f",
  "t\xFCte": "f",
  "ufer": "n",
  "uhr": "f",
  "umriss": "m",
  "umschlag": "m",
  "ungl\xFCck": "n",
  "untergrund": "m",
  "unterschrift": "f",
  "untersuchungsliege": "f",
  "update": "n",
  "urne": "f",
  "urteil": "n",
  "vater": "m",
  "verdacht": "m",
  "verfahren": "n",
  "vergangenheit": "f",
  "vermerk": "m",
  "vers": "m",
  "verstand": "m",
  "vertrag": "m",
  "vertrauen": "n",
  "video": "n",
  "virus": "n",
  "visier": "n",
  "vogel": "m",
  "vollmacht": "f",
  "vordruck": "m",
  "vorhang": "m",
  "vormund": "m",
  "vorrat": "m",
  "vorratsgl\xE4ser": "n",
  "vulkan": "m",
  "wachs": "n",
  "wachstuch": "n",
  "wagen": "m",
  "wahrheit": "f",
  "waisenjunge": "m",
  "wal": "m",
  "wald": "m",
  "waldhorn": "n",
  "wand": "f",
  "wanderstab": "m",
  "wanderstock": "m",
  "wanderung": "f",
  "wange": "f",
  "wappen": "n",
  "wappenschild": "n",
  "warnung": "f",
  "warnweste": "f",
  "wartemarke": "f",
  "warze": "f",
  "wasser": "n",
  "wasserflasche": "f",
  "wasserhahn": "m",
  "weg": "m",
  "wegmarke": "f",
  "weide": "f",
  "wein": "m",
  "weite": "f",
  "wei\xDF": "n",
  "welle": "f",
  "werk": "n",
  "werkstatt": "f",
  "werkzeug": "n",
  "wert": "m",
  "wespe": "f",
  "wetter": "n",
  "wetterfahne": "f",
  "widerstand": "m",
  "wiese": "f",
  "wille": "m",
  "wimper": "f",
  "wind": "m",
  "windhauch": "m",
  "windsto\xDF": "m",
  "winter": "m",
  "witz": "m",
  "woche": "f",
  "wolf": "m",
  "wolke": "f",
  "wollschal": "m",
  "wort": "n",
  "wrack": "n",
  "wunde": "f",
  "wunder": "n",
  "wunsch": "m",
  "wurm": "m",
  "wurzel": "f",
  "wut": "f",
  "w\xE4chter": "m",
  "w\xE4lder": "m",
  "w\xE4rme": "f",
  "w\xE4rmestein": "m",
  "w\xE4schekorb": "m",
  "w\xF6rter": "n",
  "w\xFCrfel": "m",
  "w\xFCste": "f",
  "zahl": "f",
  "zahn": "m",
  "zange": "f",
  "zauberbesen": "m",
  "zaun": "m",
  "zeh": "m",
  "zeichen": "n",
  "zeile": "f",
  "zeit": "f",
  "zeitgeber": "m",
  "zeitmarke": "f",
  "zelle": "f",
  "zelt": "n",
  "zentimeter": "m",
  "zepter": "n",
  "zettel": "m",
  "zeuge": "m",
  "ziffer": "f",
  "zigarettenstummel": "m",
  "zigarre": "f",
  "zimmer": "n",
  "zirkel": "m",
  "zitrone": "f",
  "zittern": "n",
  "zorn": "m",
  "zucker": "m",
  "zug": "m",
  "zukunft": "f",
  "zunderbeutel": "m",
  "zunge": "f",
  "zweifel": "m",
  "zweig": "m",
  "zweitschl\xFCssel": "m",
  "zwieback": "m",
  "zwiebel": "f",
  "z\xE4hlrahmen": "m",
  "z\xF6gern": "n",
  "\xE4rmel": "m",
  "\xE4rztin": "f",
  "\xF6l": "n",
  "\xF6llampe": "f",
  "\xF6llaterne": "f",
  "\xF6lschl\xFCssel": "m"
};

// src/generation/declension.ts
function guessGender(noun) {
  const w = (noun || "").toLowerCase().replace(/[^a-zäöüß]/g, "");
  const known = NOUN_GENDER[w];
  if (known === "m" || known === "f" || known === "n") return known;
  let best = "";
  for (const k2 in NOUN_GENDER) {
    if (k2.length >= 3 && w.length >= k2.length + 2 && w.endsWith(k2) && k2.length > best.length) best = k2;
  }
  if (best) return NOUN_GENDER[best];
  if (/(ung|heit|keit|schaft|tät|ion|ik|enz|anz|ei|ade|age|üre|itis|ur)$/.test(w)) return "f";
  if (/(chen|lein|ment|tum|um|nis|ma)$/.test(w)) return "n";
  if (/(ling|ismus|ant|ent|ist|eur|or|ich|ig|ast)$/.test(w)) return "m";
  if (/er$/.test(w)) return "m";
  return void 0;
}

// src/generation/verbconj.ts
var VERB_TOKEN_RE = new RegExp("\\b(" + Object.keys(VERB_CONJ).join("|") + ")\\b", "i");

// src/generation/wordcls.ts
var PERSON_NOMEN = /(jugendliche|jugendlicher|erwachsene|erwachsener|alte|alter|kranke|kranker|gefangene|gefangener|angestellte|angestellter|beamte|beamter|verwandte|verwandter|bekannte|bekannter|vorsitzende|vorsitzender|abgeordnete|abgeordneter|obdachlose|obdachloser|pensionär|pensionärin|rentner|rentnerin|zeuge|zeugin|täter|täterin|opfer|passant|passantin|kellner|kellnerin|pfarrer|pfarrerin|richter|richterin|händler|händlerin|bauer|bäuerin|förster|försterin|schneider|schneiderin|weber|weberin|uhrmacher|uhrmacherin|archivar|archivarin|übersetzer|übersetzerin|magd|knecht|ritter|ritterin|nonne|mönch|clown|boxer|boxerin|grabräuber|grabräuberin|mädchen|junge|kind|frau|mann|männer|dame|herr|schüler|schülerin|lehrer|lehrerin|wächter|wächterin|arzt|ärztin|bäcker|bäckerin|gärtner|gärtnerin|fischer|fischerin|bote|botin|wanderer|wanderin|reisende|reisender|nachbar|nachbarin|greis|greisin|witwe|witwer|zwilling|bruder|schwester|sohn|tochter|vater|mutter|onkel|tante|neffe|nichte|freund|freundin|gast|fremde|fremder|meister|meisterin|gesell|lehrling|soldat|soldatin|matrose|matrosin|pilot|pilotin|köchin|koch|wirt|wirtin|müller|müllerin|schmied|schmiedin|hirte|hirtin|jäger|jägerin|sammler|sammlerin)$/i;
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
var NICHT_VERB_T = /* @__PURE__ */ new Set([
  "nicht",
  "jetzt",
  "erst",
  "fast",
  "sonst",
  "meist",
  "zuerst",
  "zuletzt",
  "selbst",
  "sogar",
  "seit",
  "samt",
  "statt",
  "mit",
  "zeit",
  "trotz",
  "laut",
  "gerecht",
  "sanft",
  "dicht",
  "leicht",
  "schlecht",
  "recht",
  "direkt",
  "echt",
  "exakt",
  "strikt",
  "perfekt",
  "konkret",
  "komplett",
  "kaputt",
  "sacht",
  "glatt",
  "platt",
  "nackt",
  "satt",
  "breit",
  "bereit",
  "weit",
  "sp\xE4t",
  "hart",
  "zart",
  "kalt",
  "alt",
  "bunt",
  "rot",
  "gut",
  "oft",
  "still",
  "halt",
  "gesamt",
  "insgesamt",
  "bekannt",
  "verwandt",
  "ber\xFChmt",
  "sofort",
  "vielleicht",
  "\xFCberhaupt",
  "zumindest",
  "h\xF6chst",
  "\xE4u\xDFerst",
  "mindest",
  "bestimmt",
  "unbedingt",
  "ernst",
  "einst",
  "l\xE4ngst",
  "j\xFCngst",
  "umsonst",
  "weltweit",
  "korrekt",
  "intakt",
  "kompakt",
  "prompt",
  "getrennt",
  // vierbuchstabige Adjektive und Adverbien auf -t
  "bunt",
  "echt",
  "fest",
  "hart",
  "kalt",
  "laut",
  "matt",
  "nett",
  "satt",
  "weit",
  "zart",
  "fett",
  "halt",
  "wert",
  "dort",
  "fort",
  "stet",
  "sart"
]);
function wirktFinit(w) {
  if (w.length < 4 || NICHT_VERB_T.has(w)) return false;
  if (/^ge[a-zäöüß]+t$/.test(w)) return false;
  return /^[a-zäöüß]+[^aeiouäöü]t$/.test(w) || /^[a-zäöüß]+et$/.test(w);
}
function looksLikeInfinitive(w) {
  if (INFINITIVE_VERBS.has(w)) return true;
  if (w.length < 5 || NOT_INFINITIVE.has(w) || NOUN_GENDER[w]) return false;
  return /(?:[a-zäöüß]{3,})(?:en|ern|eln)$/.test(w);
}
function extractLeadVerb(text2) {
  const s = clean(text2);
  if (!s) return { verb: null, rest: s };
  const m0 = s.match(/^([A-Za-zÄÖÜäöüß]+)(,?)\s+(.+)$/);
  if (!m0) return { verb: null, rest: s };
  const m = [m0[0], m0[1], (m0[2] ? ", " : "") + m0[3]];
  const raw = m[1];
  const w = raw.toLowerCase();
  if (VERB_CONJ[w]) return { verb: raw, rest: m[2] };
  if (/^[a-zäöüß]/.test(raw) && looksLikeInfinitive(w)) {
    return { verb: null, rest: `${m[2]} ${w}`, isInfinitiveLed: true };
  }
  if (/^[a-zäöüß]+iert$/.test(w)) return { verb: raw, rest: m[2] };
  const dritte = ICH_DU_ZU_ER[w];
  if (dritte && /^[a-zäöüß]/.test(raw)) return { verb: dritte, rest: m[2] };
  if (/^[a-zäöüß]/.test(raw) && (EXTRA_FINITE_RE.test(w) || wirktFinit(w))) {
    return { verb: raw, rest: m[2] };
  }
  return { verb: null, rest: s };
}
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
var EXTRA_FINITE_RE = /\b(geschieht|geschehen|geschah|passiert|passieren|passierte|tickt|ticken|atmet|atmen|wächst|wachsen|wuchs|brennt|brennen|brannte|fällt|fallen|fiel|zerfällt|zerfallen|verschwindet|verschwinden|verschwand|erscheint|erscheinen|erschien|endet|enden|endete|beginnt|beginnen|begann|stirbt|sterben|starb|blüht|blühen|klopft|klopfen|flackert|flackern|zerbricht|zerbrechen|zerbrach|dreht|drehen|schweigt|schweigen|schwieg|singt|singen|sang|wandert|wandern|glüht|glühen|tanzt|tanzen|brüllt|brüllen|reagiert|reagieren|zeigt|zeigen|spricht|sprechen|sprach|antwortet|antworten|erinnert|erinnern|verändert|verändern|zittert|zittern|leuchtet|leuchten|schmilzt|schmelzen|regnet|schneit|blitzt|donnert|bebt|läuft|laufen|lief|rinnt|tropft|fließt|fließen|floss|steigt|steigen|stieg|sinkt|sinken|sank|kreist|kreisen|pulsiert|vibriert|summt|brummt|knistert|raschelt|flüstert|flüstern|schreit|schreien|schrie|weint|weinen|lacht|lachen|verglüht|verblasst|zerrinnt|wartet|warten)\b/i;
function looksLikeFullClause(leadVerb, rest) {
  if (leadVerb) return false;
  return VERB_TOKEN_RE.test(rest || "") || EXTRA_FINITE_RE.test(rest || "");
}
var SP_REL = /^(der|die|das|den|dem|des|deren|dessen|welche[rsmn]?|wo|worin|woran|womit|wovon)\b/i;
var SP_CONJ = /^(als|während|weil|wenn|da|obwohl|nachdem|bevor|sodass|damit|dass|ob|indem|sobald|solange)\b/i;
var SP_PREP = /^(mit|ohne|aus|von|vom|in|im|auf|an|am|für|bei|zu|zum|zur|über|unter|vor|nach|durch|gegen|seit|um|entlang|trotz|wegen|innerhalb|außerhalb|samt|nebst|zwischen|entgegen|gemäß|laut|binnen|jenseits|diesseits)\b/i;
var SP_ENDS_VERB = /(?:\b(hat|hatte|ist|war|sind|waren|wird|wurde|wurden|kann|konnte|will|wollte|muss|musste|bleibt|blieb|kommt|kam|geht|ging)|(?:^|[^A-Za-zÄÖÜäöüß])[a-zäöüß]{2,}(?:t|te|en|st|et))\.?$/;
var SP_DET = /^(der|die|das|den|dem|des|ein|eine|einen|einem|einer|eines|mein|meine|dein|deine|sein|seine|ihr|ihre|unser|unsere|euer|eure|kein|keine|jeder|jede|jedes|dieser|diese|dieses|jener|jene|jenes|beide|alle|zwei|drei|vier)\b/i;
function istEigenePerson(teil) {
  const p = clean(teil);
  if (!p) return false;
  if (SP_REL.test(p) && SP_ENDS_VERB.test(p)) return false;
  if (SP_CONJ.test(p) || SP_PREP.test(p)) return false;
  if (SP_DET.test(p)) return true;
  if (/^[A-ZÄÖÜ]/.test(p)) return true;
  return !/\s/.test(p);
}

// src/generation/ctxnorm.ts
var PREPS = /^(in|im|an|am|auf|bei|beim|unter|über|vor|hinter|neben|zwischen|durch|entlang|inmitten|nahe|außerhalb|innerhalb|jenseits|diesseits|um|ums|zu|zur|zum|während|seit|nach|gegen|ab|aus|von|vom|unterwegs|irgendwo|nirgendwo|überall|dort|draußen|drinnen|hier|daheim|zuhause|unten|oben)\b/i;
var cap2 = (s) => s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
var low = (s) => s ? s.charAt(0).toLowerCase() + s.slice(1) : s;
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
var AN_ENDUNG = /(ufer|meer|see|strand|küste|fluss|bach)$/i;
function normWhere(s) {
  const t = (s || "").trim();
  if (!t || PREPS.test(t)) return t;
  const komma = t.indexOf(",");
  if (komma > 0) {
    const kopf = normWhere(t.slice(0, komma));
    return kopf + t.slice(komma);
  }
  const np = parseNP(t);
  if (!np) return t;
  const g = genderOf(np.art, np.noun);
  if (!g) return t;
  const adj = np.adj ? adjDat(np.adj) + " " : "";
  const kind = AUF_NOUNS.test(np.noun) ? "auf" : AN_NOUNS.test(np.noun) || AN_ENDUNG.test(np.noun) ? "an" : "in";
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
  const fixed = parts.map((p, i) => {
    const m = p.match(/^([a-zäöüß][a-zäöüß-]*)\s+([A-ZÄÖÜ][A-Za-zÄÖÜäöüß-]*)$/);
    if (m && !/^(der|die|das|ein|eine|einen|einem|einer|eines|mein|meine|dein|deine|sein|seine|ihr|ihre|unser|unsere|euer|eure|kein|keine|jeder|jede|jedes|dieser|diese|dieses)$/i.test(m[1])) {
      const g = guessGender(m[2]) || (/in$/.test(m[2].toLowerCase()) ? "f" : void 0);
      if (g === "f") return `eine ${m[1]} ${m[2]}`;
      if (g === "m" || g === "n") return `ein ${m[1]} ${m[2]}`;
    }
    if (i === 0 && /^[A-ZÄÖÜa-zäöüß][a-zäöüß-]+$/.test(p) && PERSON_NOMEN.test(p) && !/^(männer|leute)$/i.test(p)) {
      const wort = cap2(p);
      const klein = p.toLowerCase();
      if (/er$/.test(klein) && PERSON_NOMEN.test(klein.slice(0, -1))) return `ein ${wort}`;
      if (/e$/.test(klein) && PERSON_NOMEN.test(klein + "r")) return `eine ${wort}`;
      const g = guessGender(wort);
      if (g === "f") return `eine ${wort}`;
      if (g === "m" || g === "n") return `ein ${wort}`;
    }
    return i === 0 || istEigenePerson(p) ? cap2(p) : low(p);
  });
  return fixed.join(", ");
}

// src/generation/titel.ts
var MAX = 60;
var cap3 = (s) => s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
var ohnePunkt = (s) => s.replace(/[.!?…]+$/, "").trim();
var BILDZEILE = /^(Ein|Eine|Der|Die|Das|Zwei|Drei|Kein|Keine|Jede|Jeder|Jedes|Mein|Meine)\s+[A-ZÄÖÜ][a-zäöüß-]+(?:\s+[A-Za-zÄÖÜäöüß-]+){0,5}(?:,\s+(?:der|die|das|den|dem|deren|dessen|wo|worin)\s+[^,.;:!?]{3,60})?$/;
var STOP = /* @__PURE__ */ new Set([
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
  "und",
  "oder",
  "aber",
  "in",
  "im",
  "an",
  "am",
  "auf",
  "mit",
  "von",
  "vom",
  "zu",
  "zur",
  "zum",
  "nicht",
  "nur",
  "noch",
  "wie",
  "als",
  "was",
  "wer",
  "wo",
  "wann",
  "sich",
  "ist",
  "sind",
  "war",
  "hat",
  "wird",
  "kein",
  "keine",
  "jemand",
  "niemand",
  "es"
]);
var inhaltswoerter = (s) => new Set((s.toLowerCase().match(/[a-zäöüß-]{3,}/g) || []).filter((w) => !STOP.has(w)));
function kuerzeTitel(s, max = MAX) {
  const t = ohnePunkt(clean(s));
  if (t.length <= max) return t;
  const stumpf = t.slice(0, max - 3);
  const fuge = Math.max(stumpf.lastIndexOf(", "), stumpf.lastIndexOf(" \u2014 "), stumpf.lastIndexOf(": "), stumpf.lastIndexOf("; "));
  const rumpf = fuge > 20 ? stumpf.slice(0, fuge) : stumpf.replace(/\s+\S*$/, "");
  return rumpf.replace(/[,;:—–\s]+$/, "") + " \u2026";
}
var FINIT = /^(ist|sind|war|waren|hat|hatte|wird|wurde|kann|muss|will|soll|darf|mag|bleibt|kommt|geht|steht|liegt|fehlt|zählt|trägt|gibt|weiß)$/;
var hatPraedikat = (kopf) => kopf.split(/\s+/).slice(1).some((w) => FINIT.test(w) || !!VERB_CONJ[w] || wirktFinit(w));
function bildzeilen(text2) {
  return (text2 || "").replace(/\s+/g, " ").split(/(?<=[.!?…])\s+/).map((s) => ohnePunkt(s.trim())).filter((s) => BILDZEILE.test(s) && s.length <= MAX && (s.match(/\S+/g) || []).length >= 3 && !hatPraedikat(s.split(",")[0]));
}
function titelAusKontext(ctx, max = MAX) {
  const who = normWho(clean(ctx.who || "")).split(",")[0].trim();
  const what = clean(ctx.what || "");
  if (who && what) {
    const lv = extractLeadVerb(what);
    if (lv.verb) return kuerzeTitel(`${cap3(who)} ${lv.verb}${lv.rest.startsWith(",") ? "" : " "}${lv.rest}`, max);
    if (lv.isInfinitiveLed) return kuerzeTitel(`${cap3(who)} will ${lv.rest}`, max);
    const letztes = (what.match(/[a-zäöüß-]+$/) || [""])[0];
    if (/^[a-zäöüß]/.test(letztes) && looksLikeInfinitive(letztes) && !/,/.test(what)) return kuerzeTitel(`${cap3(who)} will ${what}`, max);
    if (looksLikeFullClause(null, what.split(",")[0])) return kuerzeTitel(cap3(what), max);
    return kuerzeTitel(`${cap3(who)} und ${what}`, max);
  }
  if (who) return kuerzeTitel(cap3(who), max);
  if (what) {
    const lv = extractLeadVerb(what);
    if (!lv.verb && !lv.isInfinitiveLed) return kuerzeTitel(cap3(what), max);
  }
  const when = normWhen(clean(ctx.when || ""));
  const where = normWhere(clean(ctx.where || ""));
  if (when && where) return kuerzeTitel(`${cap3(when)}, ${where}`, max);
  return kuerzeTitel(cap3(where || when || ""), max);
}
var KEIN_NOMEN = /* @__PURE__ */ new Set([
  "ein",
  "eine",
  "einen",
  "einem",
  "einer",
  "der",
  "die",
  "das",
  "den",
  "dem",
  "des",
  "und",
  "im",
  "am",
  "in",
  "an",
  "auf",
  "wo",
  "was",
  "wer",
  "wie",
  "es",
  "ich",
  "du",
  "er",
  "sie",
  "wir",
  "man",
  "kein",
  "keine",
  "noch",
  "nur",
  "dann",
  "dort",
  "hier",
  "jetzt",
  "nichts",
  "alles",
  "etwas",
  "jemand",
  "niemand"
]);
function einWort(text2, ctx) {
  const t = (text2 || "").replace(/\s+/g, " ").trim();
  const bezug = inhaltswoerter(`${ctx.who || ""} ${ctx.what || ""} ${ctx.where || ""}`);
  const nomen = [];
  const anfaenge = [];
  const re = /(^|[.!?…\n]\s*|\s)([A-ZÄÖÜ][a-zäöüß-]{2,})/g;
  let m;
  const roh = (text2 || "").trim();
  while (m = re.exec(roh)) {
    const w = m[2].replace(/-$/, "");
    if (KEIN_NOMEN.has(w.toLowerCase())) continue;
    (m[1] === " " ? nomen : anfaenge).push(w);
  }
  const alle = [...nomen, ...anfaenge];
  const passend = alle.find((w) => bezug.has(w.toLowerCase()) || [...bezug].some((b) => b.length >= 5 && w.toLowerCase().includes(b)));
  if (passend) return passend;
  if (nomen.length) return nomen[nomen.length - 1];
  if (anfaenge.length) return anfaenge[anfaenge.length - 1];
  const ausCtx = (`${ctx.who || ""} ${ctx.what || ""} ${ctx.where || ""}`.match(/\b[A-ZÄÖÜ][a-zäöüß-]{2,}/g) || []).find((w) => !KEIN_NOMEN.has(w.toLowerCase()));
  return ausCtx || (t ? "Haiku" : "");
}
function nuechternerTitel(ctx) {
  const roh = titelAusKontext(ctx, 200);
  if (!roh) return "";
  const t = roh.replace(/^(Der|Die|Das|Ein|Eine)\s+(?=[A-ZÄÖÜ])/, "");
  if (t.length <= MAX) return t;
  const stumpf = t.slice(0, MAX);
  const fuge = Math.max(stumpf.lastIndexOf(", "), stumpf.lastIndexOf(" \u2014 "), stumpf.lastIndexOf(" und "), stumpf.lastIndexOf(": "));
  return fuge > 20 ? stumpf.slice(0, fuge).replace(/[,;:—–\s]+$/, "") : t;
}
function titelFuer(text2, ctx, form = "prose") {
  if (form === "meldung") return "";
  if (form === "haiku") return einWort(text2, ctx);
  if (form === "bericht") return nuechternerTitel(ctx) || "Bericht";
  const zeilen = bildzeilen(text2);
  if (zeilen.length) {
    const bezug = inhaltswoerter(`${ctx.who || ""} ${ctx.what || ""}`);
    const passend = zeilen.find((z2) => [...inhaltswoerter(z2)].some((w) => bezug.has(w)));
    return passend || zeilen[0];
  }
  return titelAusKontext(ctx) || "Ohne Titel";
}

// test/titel.ts
var fails = [];
var geprueft = 0;
var bestanden = 0;
var ist = (name, wert, soll) => {
  geprueft++;
  if (wert === soll) bestanden++;
  else fails.push(`${name}: \u201E${String(wert)}\u201C \u2014 erwartet \u201E${String(soll)}\u201C`);
};
var wahr = (name, b) => ist(name, b, true);
var text = "Die T\xFCr ist verschlossen. Ein Siegel. Ein Licht, das die falschen Dinge zeigt. Der Bote bringt, was niemand h\xF6ren will. Eine Narbe im Morgenlicht.";
var z = bildzeilen(text);
ist("ein Satz mit Pr\xE4dikat ist keine Bildzeile", z.includes("Die T\xFCr ist verschlossen"), false);
ist("zwei W\xF6rter sagen nichts", z.includes("Ein Siegel"), false);
ist("Nominalphrase mit Relativsatz ist eine", z.includes("Ein Licht, das die falschen Dinge zeigt"), true);
ist("Nominalphrase mit Ortsangabe ist eine", z.includes("Eine Narbe im Morgenlicht"), true);
ist("ein Hauptsatz mit Verb ist keine", z.includes("Der Bote bringt, was niemand h\xF6ren will"), false);
ist(
  "die Zeile mit Bezug zum Was gewinnt",
  titelFuer(text, { who: "Der Bote", what: "eine Narbe z\xE4hlt" }),
  "Eine Narbe im Morgenlicht"
);
ist(
  "ohne Bezug die erste",
  titelFuer(text, { who: "Der Bote", what: "schweigt" }),
  "Ein Licht, das die falschen Dinge zeigt"
);
ist("die Meldung bekommt keinen Titel", titelFuer(text, {}, "meldung"), "");
ist("verb-gef\xFChrtes Was: Satz", titelAusKontext({ who: "Der Bote", what: "bringt, was niemand h\xF6ren will" }), "Der Bote bringt, was niemand h\xF6ren will");
ist("Was als Nominalphrase: \u201Eund\u201C", titelAusKontext({ who: "Ein Wachmann", what: "eine Logik, die nur im Tanz erlaubt ist" }), "Ein Wachmann und eine Logik, die nur im Tanz erlaubt ist");
ist("Was als ganzer Satz: das Was allein", titelAusKontext({ who: "Die Uhrmacherin", what: "ein Wunder geschieht" }), "Ein Wunder geschieht");
ist("Vorhaben mit Infinitiv: \u201Ewill\u201C", titelAusKontext({ who: "Wachmann", what: "einen Schl\xFCssel verlieren" }), "Ein Wachmann will einen Schl\xFCssel verlieren");
ist("nur Wer", titelAusKontext({ who: "die Uhrmacherin" }), "Die Uhrmacherin");
ist("nur Wann und Wo", titelAusKontext({ when: "1953", where: "Hafen" }), "Im Jahr 1953, im Hafen");
ist("nichts \u2192 leer, der R\xFCckfall kommt von titelFuer", titelAusKontext({}), "");
ist("R\xFCckfall ohne alles", titelFuer("", {}), "Ohne Titel");
var lang = "Ein Museum, das seine Exponate verliert, z\xE4hlt eine Person zu viel und sagt es niemandem.";
var k = kuerzeTitel(lang);
wahr("h\xF6chstens sechzig Zeichen", k.length <= 60);
wahr("endet auf Auslassung", /…$/.test(k));
ist("gek\xFCrzt an der Fuge, nicht im Satzglied", k, "Ein Museum, das seine Exponate verliert \u2026");
ist("ein kurzer Titel bleibt ganz, ohne Punkt", kuerzeTitel("Eine Narbe im Morgenlicht."), "Eine Narbe im Morgenlicht");
{
  const haiku = "Kalter Bach im Hafen \u2014\nein Wachmann z\xE4hlt die M\xF6wen,\nder Schl\xFCssel schweigt.";
  ist("Haiku: ein Wort, mit Bezug zum Wer", einWort(haiku, { who: "Der Wachmann", what: "verliert einen Schl\xFCssel" }), "Wachmann");
  ist("Haiku: ohne Bezug das letzte Nomen (die Aufl\xF6sung)", einWort("Kalter Bach im Hafen \u2014\nein Wachmann z\xE4hlt die M\xF6wen,\ndas Licht schweigt.", {}), "Licht");
  wahr("Haiku: wirklich EIN Wort", !/\s/.test(titelFuer(haiku, { who: "Der Wachmann" }, "haiku")));
  ist("Haiku: ohne Text ein Nomen aus dem Kontext, kein Artikel", einWort("", { who: "Die Uhrmacherin" }), "Uhrmacherin");
  ist("Bericht: n\xFCchtern, ohne Artikel, Wer + Was", nuechternerTitel({ who: "Der Bote", what: "bringt, was niemand h\xF6ren will" }), "Bote bringt, was niemand h\xF6ren will");
  ist("Bericht: keine Bildzeile aus dem Text", titelFuer(text, { who: "Der Bote", what: "bringt, was niemand h\xF6ren will" }, "bericht"), "Bote bringt, was niemand h\xF6ren will");
  const langB = nuechternerTitel({ who: "Ein Museum, das seine Exponate verliert", what: "z\xE4hlt eine Person zu viel und sagt es niemandem und dem Rat" });
  wahr("Bericht: zu lang \u2192 an der Fuge, ohne Auslassungszeichen", !/…/.test(langB) && langB.length <= 60);
  ist("Bericht: ohne Kontext der Formname", titelFuer(text, {}, "bericht"), "Bericht");
  ist("Reim: frei wie Prosa \u2014 die Bildzeile", titelFuer(text, { who: "Der Bote" }, "reim"), "Ein Licht, das die falschen Dinge zeigt");
}
var q = (0, import_fs.readFileSync)("src/ui/studio.ts", "utf8");
wahr("es gibt den Schalter", /id: "f-titel-an"/.test(q));
wahr("der Schalter wird gespeichert", /localStorage\.setItem\(TITEL_KEY/.test(q));
wahr("der Titel steht \xFCber dem Text", /titelLbl\), titelEl, outWrap/.test(q));
wahr("aus hei\xDFt kein Titel", /titelChk\.checked\s*\?\s*titelFuer/.test(q));
wahr("und er wandert in den Leser", /titel: aktuellerTitel\(\)/.test(q));
wahr("der Leser zeigt ihn", /ctx\.titel\) body\.prepend/.test((0, import_fs.readFileSync)("src/ui/reader.ts", "utf8")));
console.log(`Pr\xFCfstand Titel \u2014 ${geprueft} Pr\xFCfungen, ${bestanden} bestanden`);
var proc = globalThis;
if (fails.length) {
  console.error(`
\u274C Titel: ${fails.length} Fehler:`);
  fails.forEach((f) => console.error("  - " + f));
  proc.process?.exit(1);
} else {
  console.log(`
\u2705 Titel: alle ${geprueft} Pr\xFCfungen bestanden.`);
}
