"use strict";

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
var MONATE = /^(?:Januar|Februar|März|April|Mai|Juni|Juli|August|September|Oktober|November|Dezember|Jahrhunderts?|Jh\.|Hälfte|Auflage|Band|Kapitel|Absatz|Teil)\b/u;
var ORDNUNGSZAHL = /\d\.$/;
var ABKUERZUNG = /(?:^|\s)(?:[A-Za-zÄÖÜäöü]|ca|bzw|bspw|evtl|ggf|inkl|Nr|St|Dr|Prof|Abs|Art|Bd|Hrsg|usw|etc)\.$/u;
function keineGrenze(vor, nach) {
  if (ABKUERZUNG.test(vor)) return true;
  if (!ORDNUNGSZAHL.test(vor)) return false;
  return MONATE.test(nach) || /^\d/.test(nach);
}
function splitSentences(txt) {
  const flach = txt.replace(/\s+/g, " ").trim();
  const roh = flach.split(/(?<=[.!?…])\s+/).filter(Boolean);
  const raus = [];
  for (const teil of roh) {
    const vor = raus[raus.length - 1];
    if (vor && keineGrenze(vor, teil)) raus[raus.length - 1] = vor + " " + teil;
    else raus.push(teil);
  }
  return raus;
}
var HAENGT_IN_DER_LUFT = /(^|\s)(ein|eine|einem|einen|einer|eines|der|die|das|dem|den|des|und|oder|aber|wie|als|im|am|beim|zum|zur|vom|von|für|ohne|durch|gegen|bei|seit|während|wegen|trotz|dass|weil|denn|sondern|sowie|bzw|etwa|sehr|dessen|deren|welche[rsmn]?)$/i;
function kuerzeAmBruch(text) {
  let t = (text || "").replace(/\s*…\s*$/, "").replace(/\s*[.,;:–—-]+\s*$/, "").trim();
  for (let i = 0; i < 8 && t && HAENGT_IN_DER_LUFT.test(t); i++) {
    const komma = t.lastIndexOf(",");
    if (komma >= 12) {
      t = t.slice(0, komma).replace(/\s*[.,;:–—-]+\s*$/, "").trim();
      continue;
    }
    const ohneWort = t.replace(/\s+\S+$/, "").replace(/\s*[.,;:–—-]+\s*$/, "").trim();
    if (!ohneWort || ohneWort === t) {
      t = "";
      break;
    }
    t = ohneWort;
  }
  {
    const komma = t.lastIndexOf(",");
    if (komma >= 12) {
      const schwanz = t.slice(komma + 1).trim();
      const relativ = /^(der|die|das|dem|den|dessen|deren|welche[rsmn]?|wo|worin|woran)\s/i.test(schwanz);
      const hatVerb = /(?:^|[^A-Za-zÄÖÜäöüß])[a-zäöüß]{2,}(?:t|te|en|st|et)(?![A-Za-zÄÖÜäöüß])/.test(schwanz);
      const endetAufNomen = /[A-ZÄÖÜ][a-zäöüß]+$/.test(schwanz);
      if (relativ && endetAufNomen && !hatVerb) t = t.slice(0, komma).trim();
    }
  }
  for (let i = 0; i < 4; i++) {
    const m = t.match(/(\S+)\s+(an|auf|aus|ein|mit|nach|vor|zu|über|unter|um|ab|bei|los|weg|hin|her)$/i);
    if (!m || !/^[A-ZÄÖÜ]/.test(m[1])) break;
    t = t.replace(/\s+\S+$/, "").trim();
  }
  return HAENGT_IN_DER_LUFT.test(t) ? "" : t;
}

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
function adjStamm(adj) {
  const m = adj.match(/^(.*?)(es|er|em|en|e)$/);
  return m && m[1].length >= 4 ? m[1] : adj;
}
function adjustAdjectiveEnding(adj, gender, targetCase) {
  const stem = adjStamm(adj);
  if (targetCase === "nom") return gender === "m" ? stem + "er" : gender === "f" ? stem + "e" : stem + "es";
  if (targetCase === "dat") return stem + "en";
  if (targetCase === "acc") return gender === "m" ? stem + "en" : gender === "f" ? stem + "e" : stem + "es";
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
var ART_GENUS = {
  ein: void 0,
  eine: "f",
  einen: "m",
  einem: void 0,
  einer: "f",
  eines: void 0
};
function declineHookPhrase(phrase, targetCase) {
  const s = clean(phrase);
  const m = s.match(/^(ein|eine|einen|einem|einer|eines)\s+(.*)$/i);
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
  const gender = ART_GENUS[art0] || NOUN_GENDER[nounWord.toLowerCase()] || guessGender(nounWord);
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

// src/generation/coherence.ts
var PRAET_STRONG = /\b(war|waren|warst|hatte|hatten|wurde|wurden|ging|gingen|kam|kamen|sah|sahen|gab|gaben|stand|standen|blieb|blieben|hielt|hielten|ließ|ließen|fand|fanden|nahm|nahmen|sprach|sprachen|schrieb|schrieben|trug|trugen|fuhr|fuhren|lief|liefen|saß|saßen|lag|lagen|hieß|hießen|zog|zogen|schlief|schliefen|rief|riefen|fiel|fielen|sang|sangen|trank|tranken|schwieg|schwiegen|floss|flossen|stieg|stiegen|sank|sanken|bot|boten|schloss|schlossen|verlor|verloren|begann|begannen|geschah|geschahen|konnte|konnten|musste|mussten|wollte|wollten|sollte|sollten|durfte|durften|wusste|wussten|dachte|dachten|brachte|brachten)\b/i;
var PRAET_WEAK = /\b[a-zäöüß]{3,}(te|ten|test)\b/;
var PRAES_MARK = /\b(ist|sind|bin|bist|seid|hat|habe|hast|haben|habt|wird|werden|wirst|kann|kannst|können|muss|musst|müssen|will|willst|wollen|soll|sollen|darf|dürfen|weiß|wissen|geht|gehen|kommt|kommen|sieht|sehen|steht|stehen|bleibt|bleiben|liegt|liegen|gibt|geben|nimmt|nehmen|spricht|sprechen|trägt|tragen|läuft|laufen|fällt|fallen|geschieht|passiert|beginnt|endet|wartet|antwortet|arbeitet|bedeutet|beobachtet|berichtet|schlägt|zeigt|dauert|öffnet|schließt|klingt|riecht|scheint|hört|fühlt|wirkt|führt|dreht|zieht|hält|läuft|fließt|wächst|sinkt|steigt|schweigt|spricht|denkt|kennt|nennt|trägt|findet|verliert|verschwindet)\b/i;
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
var PREP = /^(in|an|auf|bei|mit|von|zu|nach|über|unter|vor|hinter|neben|zwischen|durch|für|ohne|um|gegen|seit|trotz|wegen|während|aus)$/i;
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
      if (DETERMINER.test(prev) || PREP.test(prev)) continue;
      out.add(raw);
    }
  }
  return [...out];
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

// src/atoms/derive.ts
var SEIN_HABEN_WERDEN = /^(ist|sind|bin|bist|seid|war|waren|warst|hat|habe|hast|haben|habt|hatte|hatten|wird|werden|wirst|werdet|wurde|wurden|kann|kannst|können|könnt|konnte|muss|musst|müssen|müsst|will|willst|wollen|wollt|soll|sollen|darf|dürfen|mag|mögen|weiß|wissen|bleibt|bleiben|blieb|gibt|geben|gab)$/;
var KURZVERB = /^(löst|geht|ruft|tut|gibt|lebt|hebt|legt|sagt|sieht|hält|fällt|zieht|trägt|liegt|kommt|nimmt|läuft|steht|dreht|führt|hört|fühlt|zählt|setzt|passt|weint|lacht|denkt|kennt|nennt|misst|sinkt|steigt|klingt|singt|fehlt|blickt|wirkt|reißt|bricht|spricht|wächst)$/;
var PRAET_FORM = /(?:^|^[a-zäöüß]{2,6})(lag|lagen|stand|standen|ging|gingen|kam|kamen|sah|sahen|nahm|nahmen|hielt|hielten|ließ|ließen|fand|fanden|zog|zogen|trug|trugen|fiel|fielen|rief|riefen|sprach|schrieb|floss|stieg|sank|klang|hing|schien|trieb|brach|schloss|verlor|begann|geschah|roch|rochen|sass|saßen|riss|rissen|sprang|sprangen|schlug|schlugen|traf|trafen|griff|griffen|lief|liefen|wusste|wussten|verschwand|verschwanden|blieb|blieben|hieß|hießen|wuchs|wuchsen|schob|schoben|bog|bogen|schwieg|schwiegen)$/;
var NOMEN_ENDUNG = /(ung|heit|keit|schaft|tät|ion|nis|tum|chen|lein|ment)$/;
var PREP2 = /^(in|im|an|am|auf|bei|beim|mit|von|vom|zu|zum|zur|nach|über|unter|vor|hinter|neben|zwischen|durch|für|ohne|um|gegen|seit|trotz|wegen|während|aus|entlang|inmitten|jenseits|abseits)\b/i;
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
    if (KURZVERB.test(l)) return true;
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
  else if (PREP2.test(text)) typ = "praepositionalphrase";
  else if (ARTIKEL.test(text) || /\b[A-ZÄÖÜ][a-zäöüß-]{2,}/.test(text)) typ = "nominalphrase";
  else typ = "fragment";
  if (PREP2.test(text) && hatFinit) unsicher.push("typ (Inversion?)");
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

// src/features/knobs.ts
var KNOB_VORGABE = { fuegeteil: 25, w4max: 2, abstand: 12, bogen: 100, ton: 100, korpus: 0, phrase: 5, satzlaenge: 9 };
var KNOB_SPANNE = {
  fuegeteil: { min: 10, max: 35, step: 5 },
  w4max: { min: 1, max: 4, step: 1 },
  abstand: { min: 6, max: 24, step: 2 },
  bogen: { min: 0, max: 250, step: 25 },
  ton: { min: 0, max: 250, step: 25 },
  korpus: { min: 0, max: 60, step: 10 },
  phrase: { min: 0, max: 8, step: 1 },
  satzlaenge: { min: 0, max: 21, step: 3 }
};
var KEY = "dm_knobs_v1";
var klemm = (v, s) => Math.max(s.min, Math.min(s.max, v));
function loadKnobs() {
  try {
    const r = localStorage.getItem(KEY);
    if (!r) return { ...KNOB_VORGABE };
    const p = JSON.parse(r);
    return {
      fuegeteil: klemm(Number(p.fuegeteil) || KNOB_VORGABE.fuegeteil, KNOB_SPANNE.fuegeteil),
      w4max: klemm(Number(p.w4max) || KNOB_VORGABE.w4max, KNOB_SPANNE.w4max),
      abstand: klemm(Number(p.abstand) || KNOB_VORGABE.abstand, KNOB_SPANNE.abstand),
      bogen: klemm(p.bogen === void 0 ? KNOB_VORGABE.bogen : Number(p.bogen), KNOB_SPANNE.bogen),
      ton: klemm(p.ton === void 0 ? KNOB_VORGABE.ton : Number(p.ton), KNOB_SPANNE.ton),
      korpus: klemm(p.korpus === void 0 ? KNOB_VORGABE.korpus : Number(p.korpus), KNOB_SPANNE.korpus),
      phrase: klemm(p.phrase === void 0 ? KNOB_VORGABE.phrase : Number(p.phrase), KNOB_SPANNE.phrase),
      satzlaenge: klemm(p.satzlaenge === void 0 ? KNOB_VORGABE.satzlaenge : Number(p.satzlaenge), KNOB_SPANNE.satzlaenge)
    };
  } catch {
    return { ...KNOB_VORGABE };
  }
}

// src/atoms/assemble.ts
var PHASEN_KATEGORIEN = {
  // Die Dramaturgie-Kategorien tragen ihre Phase bereits im Namen — der Erzaehlbogen
  // eines Presets beschreibt genau das, was der Assembler ohnehin in Phasen baut.
  exposition: ["motifs", "hooks", "was", "einstieg", "regeln"],
  verdichtung: ["props", "obstacles", "stakes", "was", "mitte", "konflikte", "zeitanomalien"],
  umschlag: ["turns", "hoehepunkt", "ausloeser", "veraenderungen"],
  schluss: ["endings"]
};
var STRUKTUR_PHASEN = {
  // Unverändert die alte Verteilung 30/30/20/20 — die Rekombination soll sich
  // durch diesen Umbau NICHT ändern.
  rekombination: ["exposition", "exposition", "exposition", "verdichtung", "verdichtung", "verdichtung", "umschlag", "umschlag", "schluss", "schluss"],
  linear: ["exposition", "exposition", "exposition", "verdichtung", "verdichtung", "verdichtung", "umschlag", "umschlag", "schluss", "schluss"],
  // Vom Ende her: erst das Ergebnis, dann die Wende, zuletzt der Anlass.
  reverse: ["schluss", "schluss", "umschlag", "umschlag", "verdichtung", "verdichtung", "verdichtung", "exposition", "exposition", "exposition"],
  // Der Kreis kehrt zurück: Die letzte Position trägt wieder die Eröffnung.
  circle: ["exposition", "exposition", "verdichtung", "verdichtung", "verdichtung", "umschlag", "umschlag", "schluss", "exposition", "exposition"],
  // Das Fragment springt. Kein Zufall zur Laufzeit: Eine feste, unruhige Folge
  // ist reproduzierbar und damit prüfbar.
  fragment: ["verdichtung", "exposition", "umschlag", "verdichtung", "schluss", "exposition", "umschlag", "verdichtung", "exposition", "schluss"],
  // Das Ding sieht zu: langer Mittelteil, kurzer Anfang, kurzer Schluss.
  object: ["exposition", "verdichtung", "verdichtung", "umschlag", "verdichtung", "umschlag", "verdichtung", "umschlag", "schluss", "schluss"]
};
function phasenFolge(struktur, fortschritt) {
  const f = STRUKTUR_PHASEN[struktur] || STRUKTUR_PHASEN["linear"];
  const i = Math.min(f.length - 1, Math.max(0, Math.floor(fortschritt * f.length)));
  return f[i];
}
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
var SCHWACH_KONSONANT = /^(Herr|Mensch|Held|Fürst|Prinz|Graf|Bär|Elefant|Nachbar|Bauer|Herz|Narr|Tor|Christ|Zar|Architekt|Soldat|Advokat|Kamerad|Katholik|Ochs|Spatz|Fink|Pfau|Ahn)$/;
var SCHWACH_E = /^(Hase|Junge|Kollege|Zeuge|Bote|Erbe|Riese|Löwe|Affe|Rabe|Neffe|Kunde|Gefährte|Experte|Komplize|Insasse|Gatte|Bube|Falke|Franzose|Schwede|Türke|Russe|Pole|Däne|Ire|Brite|Jude|Sklave|Ahne|Zeuge)$/;
function istSchwachesMaskulinum(kern) {
  return SCHWACH_E.test(kern) || SCHWACH_KONSONANT.test(kern) || /(ent|ant|ist|oge|graf|soph|nom|arch|krat)$/.test(kern) || /^(Name|Gedanke|Glaube|Wille|Friede|Buchstabe)$/.test(kern);
}
function schwachesMaskulinum(kern) {
  if (/(chen|lein|er|el|en|ling|ismus|or)$/.test(kern)) return kern;
  if (SCHWACH_E.test(kern)) return kern + "n";
  if (/(ent|ant|ist|oge|graf|soph|nom|arch|krat|at)$/.test(kern)) return kern + "en";
  if (kern === "Herr") return "Herrn";
  if (kern === "Nachbar" || kern === "Bauer") return kern + "n";
  if (kern === "Herz") return "Herzen";
  if (SCHWACH_KONSONANT.test(kern)) return kern + "en";
  if (kern === "Name" || kern === "Gedanke" || kern === "Glaube" || kern === "Wille" || kern === "Friede" || kern === "Buchstabe") return kern + "n";
  return kern;
}
function dekliniere(phrase, kasus) {
  const m = phrase.match(/^(ein|eine|der|die|das)\s+(.*)$/i);
  if (!m) return phrase;
  const [, art, rest] = m;
  const kern = (rest.match(/\b([A-ZÄÖÜ][a-zäöüß-]{2,})/) || [])[1];
  const artG = art.toLowerCase() === "der" ? "m" : art.toLowerCase() === "das" ? "n" : void 0;
  const g = artG || (kern ? istSchwachesMaskulinum(kern) ? "m" : guessGender(kern) : void 0);
  if (!g) return phrase;
  const map = {
    akk: { m: art.toLowerCase() === "ein" ? "einen" : "den", f: art, n: art },
    dat: { m: art.toLowerCase() === "ein" ? "einem" : "dem", f: art.toLowerCase() === "eine" ? "einer" : "der", n: art.toLowerCase() === "ein" ? "einem" : "dem" }
  };
  const neu = map[kasus]?.[g];
  if (!neu) return phrase;
  const rest2 = (kasus === "akk" || kasus === "dat") && g === "m" && kern ? rest.replace(new RegExp("\\b" + kern + "\\b"), schwachesMaskulinum(kern)) : rest;
  let r = rest2;
  if (neu.toLowerCase() !== art.toLowerCase()) {
    const w = rest2.split(/\s+/);
    let kernIdx = w.findIndex((x) => /^[A-ZÄÖÜ]/.test(x));
    if (kernIdx < 0) kernIdx = w.length;
    for (let i = 0; i < kernIdx; i++) {
      const x = w[i];
      if (/^[a-zäöüß]{3,}$/.test(x)) w[i] = x.replace(/(?:e|er|es|em|en)$/, "") + "en";
    }
    r = w.join(" ");
  }
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
  const bogenGewicht = (loadKnobs().bogen || 100) / 100;
  const score = (a) => {
    let s = 1;
    if (phase) s += phasenBonus(a, phase);
    if (a.rhythmus.gewicht === sollGewicht) s += 1.5;
    const ov = [...stems(a.text)].filter((x) => kontext.has(x)).length;
    s += Math.min(ov, 2) * 0.8;
    if (ov > 3) s -= 2;
    s = Math.max(0.05, s);
    if (a.quelle === "dramaturgie") s = bogenGewicht === 0 ? 1e-4 : s * bogenGewicht;
    return s;
  };
  const total = kandidaten.reduce((n, a) => n + score(a), 0);
  let r = Math.random() * total;
  for (const a of kandidaten) {
    r -= score(a);
    if (r <= 0) return a;
  }
  return kandidaten[kandidaten.length - 1];
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
var beatKopf = (p) => {
  const w = p.toLowerCase().replace(/^und\s+/, "").split(/[\s,:;—]+/).filter(Boolean);
  return w[0] || "";
};
function joinBeats(beats, P2) {
  const parts = beats.map((b) => ensurePunct(clean(b))).filter(Boolean);
  for (let i = 1; i < parts.length; i++) {
    const prevRoh = (parts[i - 1].split(/\s+/)[0] || "").toLowerCase();
    const curRoh = (parts[i].split(/\s+/)[0] || "").toLowerCase();
    if (prevRoh === curRoh && curRoh === "und") {
      parts[i] = cap(parts[i].replace(/^Und\s+/i, ""));
    }
    if (beatKopf(parts[i]) === "dann" && (beatKopf(parts[i - 1]) === "dann" || i >= 2 && beatKopf(parts[i - 2]) === "dann")) {
      parts[i] = /^und\s+dann\b/i.test(parts[i]) ? parts[i].replace(/^Und\s+dann\b/i, pick(["Schlie\xDFlich", "Zuletzt", "Am Ende"])) : parts[i].replace(/^Dann\b/i, pick(["Danach", "Kurz darauf", "Sp\xE4ter"]));
    }
  }
  if (P2 && parts.length >= 4 && chance(0.6)) {
    const idx = 1 + Math.floor(Math.random() * (parts.length - 2));
    const m = new RegExp(`^${escapeRegExp(P2)}\\s+([a-z\xE4\xF6\xFC\xDF]+)\\s+([\\s\\S]+)$`).exec(parts[idx]);
    if (m) parts[idx] = `${pick(BEAT_CONNECTORS)} ${m[1]} ${P2} ${m[2]}`;
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
  const akk = dekliniere(core, "akk");
  const frames = [`Der Einsatz ist ${core}.`, `Es geht um ${akk}.`, `Alles dreht sich um ${akk}.`, `Was z\xE4hlt, ist ${core}.`];
  if (!/[:,]/.test(core)) {
    frames.push(`Auf dem Spiel steht ${core}.`);
    frames.push(`${cap(core)} steht auf dem Spiel.`);
    frames.push(`Am Ende bleibt nur ${core}.`);
    frames.push(`Verlieren hie\xDFe: ${core}.`);
  }
  return frames[pickFreshIndex("stake", frames.length)];
}
function safeCaseForm(rawPhrase, casedPhrase) {
  if (looksLikeClausePhrase(rawPhrase)) return `\u201E${clean(rawPhrase)}\u201C`;
  return casedPhrase;
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

// src/generation/verbconj.ts
var VERB_TOKEN_RE = new RegExp("\\b(" + Object.keys(VERB_CONJ).join("|") + ")\\b", "i");
function conjugateVerbToken(verb, person) {
  if (!verb) return verb;
  const isCap = /^[A-ZÄÖÜ]/.test(verb);
  const low2 = verb.toLowerCase();
  const table = VERB_CONJ[low2];
  let out;
  if (table && table[person]) {
    out = table[person];
  } else if (person === "ich") {
    out = /et$/.test(low2) ? low2.slice(0, -1) : /t$/.test(low2) ? low2.slice(0, -1) + "e" : low2;
  } else if (person === "du") {
    out = /et$/.test(low2) ? low2.slice(0, -1) + "st" : low2;
  } else {
    out = low2;
  }
  return isCap ? cap(out) : out;
}

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
function extractLeadVerb(text) {
  const s = clean(text);
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
function personKopf(person) {
  const teile = (person || "").split(",").map((x) => clean(x)).filter(Boolean);
  if (teile.length <= 1) return (person || "").trim();
  const raus = [teile[0]];
  for (let i = 1; i < teile.length; i++) {
    if (SP_REL.test(teile[i]) && SP_ENDS_VERB.test(teile[i])) raus.push(teile[i]);
  }
  return raus.join(", ");
}
function splitSpeakers(who) {
  const parts = (who || "").split(",").map((s) => clean(s)).filter(Boolean);
  if (parts.length <= 1) return parts;
  const out = [parts[0]];
  for (let i = 1; i < parts.length; i++) {
    if (istEigenePerson(parts[i])) out.push(parts[i]);
    else out[out.length - 1] += ", " + parts[i];
  }
  return out;
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
    const P2 = useArch ? POOLS[archetype] || POOLS.neutral : STANCE_LINES[stance] || POOLS.neutral;
    const arr = P2[key] || [];
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
      "Von Anfang an fehlt ein Teil des Bildes.",
      "Sp\xE4ter w\xFCrde niemand sagen k\xF6nnen, wann es genau begann.",
      "Es gibt eine Version der Geschichte, und dann die wahre.",
      "Irgendetwas stimmt nicht, lange bevor es jemand bemerkt.",
      "Die Wahrheit liegt n\xE4her, als alle glauben - und tiefer.",
      "Der Anfang liegt weiter zur\xFCck, als es den Anschein hat.",
      "Was hier steht, ist die zweitbeste Erkl\xE4rung.",
      "Niemand hat es kommen sehen, und alle wussten es.",
      "Es beginnt mit einer Zahl, die nicht stimmt.",
      "Zwei Zeugen, zwei Geschichten, ein Abend.",
      "Am Ende fehlt genau ein Satz."
    ],
    "flavor": [
      "Etwas darin bleibt bewusst unausgesprochen.",
      "Nicht alles l\xE4sst sich erkl\xE4ren, so sehr man es auch versucht.",
      "Eine Frage schwingt mit, die niemand laut zu stellen wagt.",
      "Es ist, als fehle ein ganzes Kapitel der Geschichte.",
      "Irgendjemand wei\xDF offensichtlich mehr, als er zugibt.",
      "Die Erkl\xE4rung daf\xFCr kommt nie - oder ist schlimmer als das R\xE4tsel selbst.",
      "Ein Detail passt nicht, und genau daran h\xE4ngt alles.",
      "Was fehlt, ist lauter als das, was gesagt wird.",
      "Jede Antwort \xF6ffnet zwei neue T\xFCren.",
      "Man ahnt, dass die Spur im Kreis f\xFChrt.",
      "Zwischen den Zeilen wartete eine zweite Geschichte.",
      "Niemand hat den Anfang gesehen, nur die Folgen.",
      "Ein Name f\xE4llt zu oft, um zuf\xE4llig zu sein.",
      "Die Reihenfolge stimmt, die Uhrzeit nicht.",
      "Wer zuh\xF6rt, h\xF6rt zwei Dinge gleichzeitig.",
      "Ein Zeuge widerspricht sich freundlich.",
      "Etwas wurde wegger\xE4umt, bevor jemand fragte.",
      "Der k\xFCrzeste Weg wird nie genommen.",
      "Ein Zufall wiederholt sich und hei\xDFt dann anders.",
      "Es bleibt eine T\xFCr, die niemand aufschlie\xDFt."
    ]
  },
  "poetic": {
    "opener": [
      "Manche Dinge lassen sich nur in Bildern erz\xE4hlen.",
      "Es beginnt, wie Erinnerungen beginnen: unscharf und zu hell.",
      "Alles daran hat den Klang von etwas Vergangenem.",
      "Es ist einer jener Momente, die l\xE4nger dauern als ihre Minute.",
      "Das Licht f\xE4llt so, dass Worte fast \xFCberfl\xFCssig werden.",
      "Vielleicht ist es weniger ein Ereignis als ein Nachhall.",
      "Der Tag beginnt, als h\xE4tte er nichts vor.",
      "Zuerst ist da nur ein Ger\xE4usch, das nicht aufh\xF6rt.",
      "Es ist eine Stunde ohne Namen.",
      "Das Licht steht schief und bleibt so.",
      "Zwischen zwei Atemz\xFCgen liegt der ganze Anfang.",
      "Alles hier ist zu leise f\xFCr seine Gr\xF6\xDFe."
    ],
    "flavor": [
      "Die Worte daf\xFCr kommen, wenn \xFCberhaupt, erst viel sp\xE4ter.",
      "Alles darin klingt wie die Erinnerung an etwas Gr\xF6\xDFeres.",
      "Selbst die Stille schien an diesem Ort eine Farbe zu haben.",
      "Es f\xFChlt sich an wie ein halb vergessenes Gedicht, das jemand zu Ende tr\xE4umt.",
      "Zwischen den S\xE4tzen liegt mehr als in ihnen.",
      "Wie ein Bild, das l\xE4nger nachwirkt als die Geschichte dazu.",
      "Die Zeit flie\xDFt hier langsamer, fast wie Honig im Winter.",
      "Jede Bewegung hinterlie\xDF eine Spur aus Licht.",
      "Es ist sch\xF6n auf die Weise, die auch wehtut.",
      "Man h\xF6rt die Dinge atmen, wenn man still genug ist.",
      "Die R\xE4nder der Welt schienen kurz weicher zu werden.",
      "Ein Duft von etwas, das es so nie gegeben hat.",
      "Das Licht bleibt an den Kanten h\xE4ngen.",
      "Die Luft tr\xE4gt weiter als der Ruf.",
      "Etwas Kleines behauptet sich gegen den Raum.",
      "Ein Schatten legt sich hin und bleibt.",
      "Die Farben werden langsamer als die Formen.",
      "Der Klang bleibt l\xE4nger als sein Grund.",
      "Ein Rest W\xE4rme steht noch im T\xFCrrahmen.",
      "Zwischen den Dingen w\xE4chst eine Stille an."
    ]
  },
  "melancholisch": {
    "opener": [
      "Es liegt eine leise Traurigkeit \xFCber allem, ganz ohne Grund.",
      "Was bleibt, ist selten das, was man behalten wollte.",
      "Manches endet, lange bevor man es merkt.",
      "Es ist die Art von Nachmittag, an dem alles ein wenig verblasst.",
      "Irgendwo darin steckt ein Abschied, den keiner ausgesprochen hat.",
      "Sp\xE4ter w\xFCrde man sich an diesen Tag erinnern, ohne zu wissen, warum.",
      "Es h\xE4tte auch anders kommen k\xF6nnen, aber nicht sehr.",
      "Vieles davon ist schon vorbei, w\xE4hrend es geschieht.",
      "Der Abschied hat lange vorher angefangen.",
      "Man merkt es erst, wenn es ruhiger wird.",
      "Was bleibt, ist kleiner als erwartet.",
      "Es ist ein Tag zum Aufr\xE4umen."
    ],
    "flavor": [
      "Etwas darin f\xFChlt sich an wie das Ende eines langen Sommers.",
      "Man vermisste etwas, ohne benennen zu k\xF6nnen, was.",
      "Die Dinge haben den sanften Glanz des Verg\xE4nglichen.",
      "Es ist weniger Schmerz als eine ruhige, alte Wehmut.",
      "Alles bleibt - nur nicht so, wie es einmal gewesen ist.",
      "Ein Teil davon ist schon Erinnerung, w\xE4hrend es noch geschieht.",
      "Die Freude kommt mit einem feinen Riss darin.",
      "Man wei\xDF, dass man diesen Moment sp\xE4ter vermissen wird.",
      "Selbst das Licht scheint sich langsam zu verabschieden.",
      "Es ist sch\xF6n, und genau das macht es schwer.",
      "Was gewesen ist, nimmt mehr Platz ein als das \xDCbrige.",
      "Ein Zimmer, das gr\xF6\xDFer wurde, ohne zu wachsen.",
      "Die Gewohnheit bleibt, der Grund ist fort.",
      "Man legt es zur\xFCck, wo es nie hingeh\xF6rte.",
      "Der zweite Stuhl steht weiter am Tisch.",
      "Es fehlt niemand, und doch ist es leer.",
      "Ein Satz bleibt unbeantwortet und st\xF6rt nicht mehr.",
      "Die Jahreszeit wechselt schneller als der Blick."
    ]
  },
  "dark": {
    "opener": [
      "Von der ersten Sekunde an f\xFChlte sich hier nichts richtig an.",
      "Es begann leise - so, wie das Schlimmste meistens beginnt.",
      "Manche Orte warten nur darauf, dass jemand kommt.",
      "Es gibt keinen Ausweg, nur die Illusion davon.",
      "Was folgte, h\xE4tte niemand aufhalten k\xF6nnen.",
      "Die Dunkelheit hier ist \xE4lter als das Haus, das sie birgt.",
      "Nichts davon endet gut, und das ist bekannt.",
      "Es beginnt mit einer Rechnung, die offen bleibt.",
      "Die Sache war lange faul, bevor sie roch.",
      "Von hier f\xFChrt kein Weg zur\xFCck, nur weiter.",
      "Jemand hat entschieden, und niemand hat gefragt.",
      "Der Preis stand von Anfang an fest."
    ],
    "flavor": [
      "Nichts daran f\xFChlt sich je wirklich sicher an.",
      "Etwas darin roch unverkennbar nach Verlust.",
      "Die K\xE4lte bleibt, auch wenn l\xE4ngst niemand mehr hinsieht.",
      "Es ist die Art von Stille, die etwas Schlimmeres ank\xFCndigt.",
      "Irgendwo darunter wartete bereits das n\xE4chste Ungl\xFCck.",
      "Kein Trost weit und breit - nur die Gewissheit, dass es schlimmer werden w\xFCrde.",
      "Jeder Ausweg f\xFChrt nur tiefer hinein.",
      "Etwas beobachtete, ohne je gesehen zu werden.",
      "Die Hoffnung ist das Erste, was hier stirbt.",
      "Man sp\xFCrt, dass die W\xE4nde zuh\xF6ren.",
      "Es ist zu sp\xE4t, schon bevor es beginnt.",
      "Selbst das Schweigen hat hier Z\xE4hne.",
      "Was sch\xFCtzt, kostet mehr, als es h\xE4lt.",
      "Der Ausweg ist verstellt, seit Wochen.",
      "Es wird k\xE4lter, wo vorher gewartet wurde.",
      "Der Schaden ist alt und tr\xE4gt einen neuen Namen.",
      "Niemand meldet sich, und das ist die Antwort.",
      "Die Frist l\xE4uft, auch wenn niemand z\xE4hlt.",
      "Was fehlt, wird nicht ersetzt.",
      "Am Ende bleibt jemand zur\xFCck, der nicht gemeint war."
    ]
  },
  "unheimlich": {
    "opener": [
      "Alles wirkt vertraut, und genau das ist das Problem.",
      "Irgendetwas ist anders, aber man kann nicht sagen, was.",
      "Die Dinge stehen zu still, um nat\xFCrlich zu sein.",
      "Es ist, als h\xE4tte jemand die Welt fast, aber nicht ganz richtig nachgebaut.",
      "Man hat das Gef\xFChl, nicht allein zu sein - ohne Beweis daf\xFCr.",
      "Etwas stimmt mit den Schatten nicht.",
      "Etwas ist verstellt worden, und niemand wei\xDF von wem.",
      "Es riecht nach einem Raum, der lange zu war.",
      "Die Zahlen stimmen, die Stimmung nicht.",
      "Von drau\xDFen sieht alles gew\xF6hnlich aus.",
      "Man sollte hier nicht stehen bleiben.",
      "Der Ort hat gewartet."
    ],
    "flavor": [
      "Die Spiegel scheinen einen Sekundenbruchteil zu sp\xE4t zu reagieren.",
      "Ein Ger\xE4usch, das nur existiert, wenn man nicht hinh\xF6rt.",
      "Die Gesichter sind richtig, nur das L\xE4cheln sitzt falsch.",
      "Etwas z\xE4hlt mit, jedes Mal, wenn man die T\xFCr schlie\xDFt.",
      "Die Uhr geht, aber die Zeit steht.",
      "Man erkennt den Raum wieder, ohne je dort gewesen zu sein.",
      "Die Stille hat eine Form, und sie kommt n\xE4her.",
      "Irgendwo atmet etwas im Takt der eigenen Schritte.",
      "Ein Detail ist zu viel im Bild, und keiner sieht es an.",
      "Es f\xFChlt sich an, als w\xFCrde man erwartet.",
      "Das Ger\xE4usch kommt von innen, nicht von der Stra\xDFe.",
      "Etwas atmet mit, kaum h\xF6rbar.",
      "Der Boden gibt an einer Stelle nach.",
      "Zwei T\xFCren f\xFChren in denselben Raum.",
      "Es wird still, sobald man hinsieht.",
      "Eine Uhr geht nach und niemand stellt sie.",
      "Der Abdruck passt zu keiner Hand.",
      "Was hier bleibt, war schon vorher da."
    ]
  },
  "uplifting": {
    "opener": [
      "Und doch beginnt hier, allen Umst\xE4nden zum Trotz, etwas Gutes.",
      "Selbst an diesem Ort l\xE4sst sich noch Hoffnung finden.",
      "Manchmal reicht ein einziger Moment, um alles zu wenden.",
      "Es sieht aussichtslos aus - und ist es dann doch nicht.",
      "Irgendwo darin liegt der Anfang von etwas Besserem.",
      "Gerade wenn alles verloren scheint, kommt das Licht zur\xFCck.",
      "Es f\xE4ngt klein an und bleibt nicht klein.",
      "Etwas geht auf, das lange gelegen hat.",
      "Der Tag hat mehr vor als gedacht.",
      "Einer f\xE4ngt an, und dann sind es viele.",
      "Es gibt gute Gr\xFCnde, heute zu bleiben.",
      "Der Anfang ist gemacht, mehr braucht es nicht."
    ],
    "flavor": [
      "Und doch bleibt, gegen jede Erwartung, ein Rest Hoffnung.",
      "Irgendetwas darin f\xFChlte sich nach einem echten Neuanfang an.",
      "Es ist, als w\xFCrde sich gerade, ganz leise, etwas zum Guten wenden.",
      "Ein kleiner Trost bleibt trotzdem - und manchmal reicht genau das.",
      "Selbst im Schwierigsten findet sich noch ein Grund zum Weitermachen.",
      "Am Ende z\xE4hlt nicht der Verlust, sondern das, was bleibt.",
      "Eine unerwartete Freundlichkeit ver\xE4nderte alles.",
      "Zum ersten Mal seit Langem scheint der Weg wieder offen.",
      "Es ist schwer, aber es lohnt sich.",
      "Manchmal ist der Sturz nur der Anlauf.",
      "Etwas darin richtet sich wieder auf.",
      "Und pl\xF6tzlich scheint alles m\xF6glich.",
      "Etwas l\xF6st sich, ohne dass jemand zieht.",
      "Zwei, die nichts verband, arbeiten zusammen.",
      "Der Weg wird breiter, je weiter man geht.",
      "Was fehlt, wird von selbst erg\xE4nzt.",
      "Der Raum f\xFCllt sich, ohne eng zu werden.",
      "Aus einer Zusage werden drei.",
      "Es reicht diesmal f\xFCr alle.",
      "Der zweite Versuch gelingt leichter."
    ]
  },
  "zaertlich": {
    "opener": [
      "Es geschieht mit einer Behutsamkeit, die man kaum erwarten w\xFCrde.",
      "Manche Dinge muss man leise erz\xE4hlen, sonst zerbrechen sie.",
      "Es ist klein und warm und leicht zu \xFCbersehen.",
      "Zwischen ihnen liegt eine Sanftheit, f\xFCr die es kein Wort gibt.",
      "Es beginnt mit einer Geste, die niemand sonst bemerkt.",
      "Alles daran ist sacht, fast wie Atem im Schlaf.",
      "Es wird niemand laut in dieser Geschichte.",
      "Jemand h\xE4lt etwas fest, ohne zu dr\xFCcken.",
      "Der Anfang ist so behutsam, dass man ihn \xFCbersieht.",
      "Es ist eine Stunde, in der nichts verlangt wird.",
      "Man macht Platz, bevor gefragt wird.",
      "Alles hier hat Zeit."
    ],
    "flavor": [
      "Eine Hand, die blieb, obwohl sie gehen durfte.",
      "Es ist die Sorte N\xE4he, die keine Worte braucht.",
      "Etwas darin passt auf einen auf, ganz unaufdringlich.",
      "Ein L\xE4cheln, so leise, dass man es fast \xFCberh\xF6rt.",
      "Die Welt wird f\xFCr einen Moment weicher.",
      "Es ist ein kleines Z\xE4rtlichsein, mitten im L\xE4rm.",
      "Jemand h\xE4lt etwas Zerbrechliches, ohne es zu dr\xFCcken.",
      "W\xE4rme, die keine Gegenleistung will.",
      "Es f\xFChlt sich an wie Ankommen.",
      "Ein Trost, der einfach nur dablieb.",
      "Eine Hand bleibt liegen, wo sie ist.",
      "Es wird leiser gesprochen als n\xF6tig.",
      "Jemand deckt zu, ohne zu wecken.",
      "Der Weg wird k\xFCrzer gemacht, ohne davon zu reden.",
      "Etwas Warmes bleibt stehen und wartet.",
      "Man reicht das Bessere weiter.",
      "Ein Name wird ausgesprochen wie eine Zusage.",
      "Es ist Platz genug f\xFCr zwei Meinungen."
    ]
  },
  "traeumerisch": {
    "opener": [
      "Es ist schwer zu sagen, ob es geschieht oder nur getr\xE4umt wird.",
      "Die R\xE4nder der Dinge sind an diesem Tag nicht ganz fest.",
      "Alles treibt ein wenig, wie Boote ohne Anker.",
      "Es f\xFChlt sich an, als w\xE4re man mitten in einem fremden Traum aufgewacht.",
      "Die Logik hat hier Urlaub genommen.",
      "Zeit und Ort sind nur Vorschl\xE4ge.",
      "Die Reihenfolge ist hier nicht das Wichtigste.",
      "Es beginnt mittendrin, wie immer.",
      "Etwas geht auf, das keine T\xFCr hat.",
      "Der Weg f\xFChrt weiter, obwohl er endet.",
      "Zwei Orte fallen zusammen, ohne sich zu st\xF6ren.",
      "Es ist sp\xE4ter, als es sein d\xFCrfte."
    ],
    "flavor": [
      "Die Dinge verwandeln sich, kaum dass man wegsieht.",
      "Ein Zimmer wird zum Meer, ohne dass es jemand st\xF6rt.",
      "Die Schwerkraft scheint Verhandlungssache zu sein.",
      "Man geht durch T\xFCren, die es vorher nicht gegeben hat.",
      "Farben riechen, und Ger\xE4usche haben Gewicht.",
      "Alles ergab Sinn, solange man nicht genauer hinsah.",
      "Die Erinnerung l\xE4uft der Gegenwart voraus.",
      "Ein Gedanke wird Landschaft.",
      "Nichts steht fest, und nichts f\xE4llt.",
      "Es ist sch\xF6n und ungereimt wie ein Traum kurz vor dem Erwachen.",
      "Ein Raum \xF6ffnet sich, wo keiner war.",
      "Die Treppe f\xFChrt zweimal nach oben.",
      "Etwas wiederholt sich mit anderem Ausgang.",
      "Der Weg kennt sein Ziel besser als der Gehende.",
      "Ein Fenster zeigt eine andere Jahreszeit.",
      "Die Entfernung \xE4ndert sich beim Hinsehen.",
      "Man kommt an, ohne gegangen zu sein.",
      "Etwas Bekanntes tr\xE4gt einen fremden Namen."
    ]
  },
  "nuechtern": {
    "opener": [
      "Der Reihe nach: Es geschah genau so, wie es hier steht.",
      "Ohne Umschweife - das ist, was passierte.",
      "Es gibt daran nichts zu besch\xF6nigen.",
      "Die Fakten sind \xFCbersichtlich, die Folgen weniger.",
      "Man muss es nicht ausschm\xFCcken, es gen\xFCgt so.",
      "Kurz und ohne Pathos: So liegt der Fall.",
      "Der Vorgang ist \xFCberschaubar.",
      "Es liegt eine Reihenfolge vor.",
      "Die Zust\xE4ndigkeit ist gekl\xE4rt.",
      "Der Rahmen steht, der Rest folgt.",
      "Es gibt dazu eine Akte.",
      "Die Sache ist erledigt, bis auf zwei Punkte."
    ],
    "flavor": [
      "Mehr ist dazu nicht zu sagen.",
      "Die Sache hat eine klare Ursache und eine klare Folge.",
      "Es hilft nichts, es zu besch\xF6nigen.",
      "Alles Weitere ergab sich daraus von selbst.",
      "N\xFCchtern betrachtet, bleibt wenig Raum f\xFCr Zweifel.",
      "Die Lage ist, was sie ist.",
      "Man notiert es und geht weiter.",
      "Kein Drama, nur der n\xE4chste Schritt.",
      "So einfach, so unausweichlich.",
      "Am Ende z\xE4hlen nur die Zahlen.",
      "Der Vorgang ist abgelegt.",
      "Eine Frist wurde notiert.",
      "Zwei Angaben widersprechen sich geringf\xFCgig.",
      "Der Ablauf wurde eingehalten.",
      "Die Unterlagen liegen vollst\xE4ndig vor.",
      "Es bleibt bei der bisherigen Regelung.",
      "Der Fall wird weitergeleitet.",
      "Eine R\xFCckmeldung steht noch aus."
    ]
  },
  "ironisch": {
    "opener": [
      "Nat\xFCrlich l\xE4uft alles nach Plan - nur nicht nach diesem.",
      "Man ahnt schon, wie gut das ausgehen wird.",
      "Es ist, mit Verlaub, eine gl\xE4nzende Idee. Fast.",
      "Was h\xE4tte dabei schon schiefgehen k\xF6nnen.",
      "Wie sch\xF6n, dass wenigstens einer den \xDCberblick behielt. Behauptete er.",
      "Der Plan ist wasserdicht. Das Wasser findet trotzdem einen Weg.",
      "Es lief alles nach Plan, nur nicht nach diesem.",
      "Eine hervorragende Gelegenheit, es nicht zu tun.",
      "Man kann viel falsch machen, und man tut es.",
      "Der Anfang war gut gemeint.",
      "Zum Gl\xFCck gibt es eine Zust\xE4ndigkeit.",
      "Alles bestens, sagt jedenfalls das Formular."
    ],
    "flavor": [
      "Es l\xE4uft exakt so gut, wie zu erwarten ist.",
      "Ein voller Erfolg, wenn man die Ziele nachtr\xE4glich anpasst.",
      "Zum Gl\xFCck ist ja jemand zust\xE4ndig - nur nicht anwesend.",
      "Die Ironie daran entging allen Beteiligten.",
      "Man nannte es Strategie, um nicht Zufall sagen zu m\xFCssen.",
      "Selbstverst\xE4ndlich hat niemand etwas geahnt. Angeblich.",
      "Ein Meisterwerk der Planung, r\xFCckw\xE4rts betrachtet.",
      "Alles unter Kontrolle, versichert die Kontrolle.",
      "Bemerkenswert, wie zuverl\xE4ssig das Unwahrscheinliche eintraf.",
      "Es h\xE4tte schlimmer kommen k\xF6nnen. Kam es dann auch.",
      "Der Vorschlag wird gelobt und abgeheftet.",
      "Zust\xE4ndig ist, wer gerade nicht da ist.",
      "Man einigt sich darauf, sich zu einigen.",
      "Die L\xF6sung wartet auf ein passendes Problem.",
      "Ein Ausschuss besch\xE4ftigt sich damit, gr\xFCndlich.",
      "Der k\xFCrzeste Weg wurde gepr\xFCft und verworfen.",
      "Es gibt jetzt ein Merkblatt dazu.",
      "Alle sind einverstanden, aber anders."
    ]
  },
  "humorous": {
    "opener": [
      "Es h\xE4tte ernst werden k\xF6nnen - wurde es aber nicht ganz.",
      "Manche Geschichten sind einfach zu absurd, um nicht zu grinsen.",
      "Was folgt, ist mit Ansage albern.",
      "Es beginnt harmlos und entgleitet dann auf komische Weise.",
      "Man sollte das nicht so ernst nehmen. Die Beteiligten taten es auch nicht.",
      "Vorweg: Niemand kommt ernsthaft zu Schaden, nur die W\xFCrde.",
      "Es ging schief, aber mit Anlauf.",
      "Zwei Dinge fehlten: der Plan und der Rest.",
      "Man h\xE4tte es wissen k\xF6nnen, wollte aber nicht.",
      "Der Anfang war schon das Beste daran.",
      "Es gab Kaffee, sonst nichts.",
      "Jemand hat das ernst gemeint."
    ],
    "flavor": [
      "Absurd genug, um fast schon wieder normal zu wirken.",
      "Selbst das Schicksal scheint dabei kurz zu grinsen.",
      "Niemand w\xFCrde sich das so ausdenken - und genau deshalb ist es lustig.",
      "Es hat, aller Dramatik zum Trotz, etwas unfreiwillig Komisches.",
      "Man br\xE4uchte fast Popcorn, so albern l\xE4uft das gerade.",
      "Selbst die Beteiligten m\xFCssen sich das Lachen verkneifen.",
      "Es ist ein Chaos, aber ein gut gelauntes.",
      "Die Peinlichkeit ist beeindruckend gleichm\xFCtig.",
      "Am Ende lachen alle - manche sogar freiwillig.",
      "Der Ernst der Lage hat sichtlich Feierabend.",
      "Der Zettel dazu ist unauffindbar, nat\xFCrlich.",
      "Es fehlt genau das eine Teil.",
      "Zwei halten es f\xFCr erledigt, drei nicht.",
      "Der Ersatz ist besser als das Original, leider.",
      "Es funktioniert, solange niemand hinsieht.",
      "Der Hund hat es gesehen und schweigt.",
      "Man einigt sich auf sp\xE4ter.",
      "Ein Erfolg, wenn man nicht so genau hinschaut."
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
    const tags = ["\u2014 angeblich.", "\u2014 so hie\xDF es.", "\u2014 was auch immer das hei\xDFen sollte.", "\u2014 nat\xFCrlich.", "\u2014 wie praktisch.", "\u2014 oder so \xE4hnlich."];
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
var DOPPELT_ERLAUBT = /* @__PURE__ */ new Set([
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
  "wie",
  "so",
  "als",
  "was",
  "wer",
  "wen",
  "wem",
  "dass",
  "da",
  "und",
  "nur",
  "noch",
  "sie",
  "ihr"
]);
var KEIN_NOMEN = /* @__PURE__ */ new Set([
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
  "mein",
  "dein",
  "sein",
  "ihr",
  "unser",
  "euer",
  "dieser",
  "diese",
  "dieses",
  "jeder",
  "jede",
  "jedes",
  "alle",
  "viele",
  "manche",
  "beide",
  "und",
  "aber",
  "doch",
  "denn",
  "dann",
  "dabei",
  "damit",
  "dort",
  "hier",
  "jetzt",
  "nur",
  "noch",
  "auch",
  "schon",
  "wenn",
  "weil",
  "dass",
  "als",
  "wie",
  "was",
  "wer",
  "wo",
  "warum",
  "ich",
  "du",
  "er",
  "sie",
  "es",
  "wir",
  "man",
  "jemand",
  "niemand",
  "nichts",
  "etwas",
  "alles",
  "im",
  "am",
  "auf",
  "in",
  "an",
  "mit",
  "ohne",
  "von",
  "vor",
  "nach",
  "bei",
  "zu",
  "\xFCber",
  "unter",
  "zwischen",
  "seit",
  "f\xFCr",
  "zwei",
  "drei",
  "vier",
  "f\xFCnf",
  "sechs",
  "sieben",
  "acht",
  "neun",
  "zehn",
  "hundert",
  "tausend"
]);
function ergaenzeArtikel(satz) {
  const m = satz.match(/^([A-ZÄÖÜ][a-zäöüß]{2,})(\s+)(.+)$/);
  if (!m) return satz;
  const [, nomen, luecke, rest] = m;
  if (KEIN_NOMEN.has(nomen.toLowerCase())) return satz;
  const kern = rest.split(",")[0];
  if (!extractLeadVerb(kern).verb) return satz;
  const g = NOUN_GENDER[nomen.toLowerCase()];
  if (g !== "m" && g !== "f" && g !== "n") return satz;
  if (/^(sind|waren|werden|haben|hatten|bleiben|stehen|liegen|kommen|gehen|zeigen|wirken)\b/i.test(rest)) return satz;
  const art = g === "f" ? "Die" : g === "n" ? "Das" : "Der";
  return `${art} ${nomen}${luecke}${rest}`;
}
function polishGerman(text, opts = {}) {
  const { who = "" } = opts;
  let t = String(text ?? "");
  t = t.replace(/\r\n/g, "\n").replace(/[ \t]+\n/g, "\n").replace(/ /g, " ").replace(/[ \t]{2,}/g, " ").replace(/\n{3,}/g, "\n\n").replace(/[ \t]+([,.;:!?])/g, "$1").replace(/([,.;:!?])([A-Za-zÄÖÜäöü])/g, "$1 $2").replace(/\(\s+/g, "(").replace(/\s+\)/g, ")").replace(/,+/g, ",").replace(/,\s*,/g, ", ").replace(/:\s*:/g, ":").replace(/([A-Za-zÄÖÜäöü0-9])\.\.(?=\s|$)/g, "$1\u2026").replace(/\.\.(?!\.)/g, ".").trim();
  if (who.trim()) {
    const w = who.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    try {
      t = t.replace(new RegExp(`(?<![\\p{L}\\p{N}_])${w}(?![\\p{L}\\p{N}_])`, "giu"), who.trim());
    } catch {
      t = t.replace(new RegExp(`\\b${w}\\b`, "gi"), who.trim());
    }
  }
  for (let k = 0; k < 6; k++) {
    const next = t.replace(
      /\b([A-Za-zÄÖÜäöüß]{2,})[ \t]+\1\b/gi,
      (m, w) => DOPPELT_ERLAUBT.has(w.toLowerCase()) ? m : w
    );
    if (next === t) break;
    t = next;
  }
  t = t.split(/(?<=[.!?…])(\s+)/).map((teil) => /^\s+$/.test(teil) ? teil : ergaenzeArtikel(teil)).join("");
  return t.trim();
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
var NEBENSATZ_ANFANG = /^(der|die|das|dem|den|des|deren|dessen|welche[rsmn]?|wo|worin|woran|worauf|als|wenn|weil|obwohl|während|nachdem|bevor|damit|dass|ob|sodass|indem|sobald|solange|bis|seit|falls|wobei|wodurch|womit)\b/i;
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
      if (cut > 10 && cut < 80 && !NEBENSATZ_ANFANG.test(t.slice(cut + 2))) {
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
      const rest = t.slice(cut + 2);
      const unteilbar = NEBENSATZ_ANFANG.test(rest);
      if (cut > 10 && cut < 90 && !unteilbar) {
        s[i] = t.slice(0, cut) + ".";
        s.splice(i + 1, 0, cap(rest));
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
      const nachbarn = [s[idx - 1] || "", s[idx + 1] || ""].join(" ").toLowerCase();
      const bruch = pick(["und genau hier kippt es.", "kein Zur\xFCck.", "jetzt.", "und nichts h\xE4lt mehr."].filter((b) => !(b === "jetzt." && /\bjetzt\b/.test(nachbarn + " " + t.toLowerCase()))));
      if (t.length > 12 && !isFragmentSentence(t) && !t.includes("\u2014")) {
        s[idx] = t + " \u2014";
        s.splice(idx + 1, 0, bruch);
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
function guessPronoun(P2) {
  const p = clean(P2);
  if (/^(der|ein)\s/i.test(p)) return "er";
  if (/^(die|eine)\s/i.test(p)) return "sie";
  if (/^das\s/i.test(p)) return "es";
  if (/(a|e|in)$/i.test(p)) return "sie";
  return "er";
}
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
  "direkt",
  // Nachgetragen mit der Reihungs-Beugung (4.328.2): Nach „und" stehen oft
  // Adverbien — „und dort wartet er" darf nicht zu „und dorten" werden.
  "dort",
  "fort",
  "sofort",
  "selbst",
  "vielleicht",
  "\xFCberhaupt",
  "bereit",
  "gerecht",
  "perfekt",
  "exakt",
  "absolut",
  "gesamt",
  "komplett",
  "verr\xFCckt",
  "bekannt",
  "geschickt",
  "besetzt"
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
var OBJEKT_KOPF_RE = /^(Ich bin (?:der|die|das) [^.!?]{1,40}\.\s+[^.!?]{1,70}\.)\s*/;
var OBJEKT_ZWISCHENRUF = [
  "Ich sehe zu.",
  "Ich liege dabei.",
  "Ich z\xE4hle mit.",
  "Ich r\xFChre mich nicht.",
  "Ich habe Zeit.",
  "Ich merke es mir."
];
function beugeToken(v, person) {
  if (VERB_CONJ[v.toLowerCase()]) return conjugateVerbToken(v, person);
  if (!/[a-zäöüß]{3,}t$/.test(v)) return v;
  const stamm = v.slice(0, -1);
  const hatE = /e$/.test(stamm);
  if (person === "du") return stamm + "st";
  if (person === "ich") return hatE ? stamm : stamm + "e";
  if (person === "wir") return hatE ? stamm + "n" : stamm + "en";
  return v;
}
var kenntVerb = (v) => !!VERB_CONJ[v.toLowerCase()] || /^[a-zäöüß]{3,}t$/.test(v) && !KEIN_VERB_AUF_T.has(v.toLowerCase());
function applyPerspective(paras, perspective, who, objName) {
  const P2 = clean(who) || "Jemand";
  const O = objektName(clean(objName) || pick(DING_VORRAT));
  const swap = (s, person, pronoun) => {
    if (!P2) return s;
    try {
      const re = new RegExp("([A-Za-z\xC4\xD6\xDC\xE4\xF6\xFC\xDF]+\\s+)?\\b" + escapeRegExp(P2) + "\\b(\\s+[A-Za-z\xC4\xD6\xDC\xE4\xF6\xFC\xDF]+)?", "gi");
      const ersetzt = s.replace(re, (_m, before, after, ...rest) => {
        const idx = rest[rest.length - 2];
        const voll = rest[rest.length - 1];
        const posP = voll.toLowerCase().indexOf(P2.toLowerCase(), idx);
        if (posP > 0 && /[-–\wÄÖÜäöüß]/.test(voll.charAt(posP - 1))) return _m;
        const davor = voll.slice(0, posP).replace(/\s+$/, "");
        const gross = davor === "" || /[.!?…:„"»(]$/.test(davor);
        const pron = gross ? pronoun.charAt(0).toUpperCase() + pronoun.slice(1) : pronoun;
        const bw = before ? before.trim() : "";
        const aw = after ? after.trim() : "";
        const bw3 = ICH_DU_ZU_ER[bw.toLowerCase()] || bw;
        const aw3 = ICH_DU_ZU_ER[aw.toLowerCase()] || aw;
        const beuge = (v) => beugeToken(v, person);
        const kennt = kenntVerb;
        const letztesWort = (davor.match(/[A-Za-zÄÖÜäöüß-]+$/) || [""])[0];
        const subjektstelle = gross || /[,;]$/.test(davor) || SUBJ_FUGE.test(letztesWort) || !!bw && kennt(bw3);
        if (!subjektstelle) return _m;
        if (bw && kennt(bw3)) return beuge(bw3) + " " + pron + (after || "");
        if (aw && kennt(aw3)) return (before || "") + pron + " " + beuge(aw3);
        return (before || "") + pron + (after || "");
      });
      const reihung = new RegExp(
        "\\b(" + pronoun + ")\\s+([a-z\xE4\xF6\xFC\xDF]+)((?:\\s+[^\\s,.;:\u2014!?]+){0,6}?)\\s+(und|oder)\\s+([a-z\xE4\xF6\xFC\xDF]{3,}t)\\b",
        "gi"
      );
      return ersetzt.replace(reihung, (m, pr, v1, mitte, konj, v2) => {
        const v23 = ICH_DU_ZU_ER[v2.toLowerCase()] || v2;
        if (!kenntVerb(v23)) return m;
        const gebeugt = beugeToken(v23, person);
        if (gebeugt === v2) return m;
        return `${pr} ${v1}${mitte} ${konj} ${gebeugt}`;
      });
    } catch {
      return s.replace(new RegExp("\\b" + escapeRegExp(P2) + "\\b", "gi"), pronoun);
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
function pronominalize(text, P2, pronoun) {
  const name = clean(P2);
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
var SCHON_GEBUNDEN = /^(und|doch|aber|oder|denn|dann|dabei|also|trotzdem|dennoch|sondern|nur|zuerst|zuletzt|währenddessen)/i;
function darfVerbinden(a, b, obergrenze) {
  if (!a || !b) return false;
  if (/[:;—–]\s*$/.test(a.replace(/[.!?…]+$/, ""))) return false;
  if (!/[.!?…]$/.test(a.trim())) return false;
  if (/[?!]$/.test(a.trim())) return false;
  if (SCHON_GEBUNDEN.test(b)) return false;
  if (/^[„»"(]/.test(b) || /[“«")]$/.test(a)) return false;
  const wa = (a.match(/[A-Za-zÄÖÜäöüß]+/g) || []).length;
  const wb = (b.match(/[A-Za-zÄÖÜäöüß]+/g) || []).length;
  if (!wa || !wb) return false;
  return wa + wb <= obergrenze;
}
function verbinde(a, b, satzartig) {
  const kopf = a.trim().replace(/[.!?…]+$/, "");
  const rest = b.trim();
  const wort = (rest.match(/^[A-Za-zÄÖÜäöüß]+/) || [""])[0].toLowerCase();
  const darfKlein = KEIN_NOMEN.has(wort) || !!VERB_CONJ[wort];
  const weiter = darfKlein ? rest.charAt(0).toLowerCase() + rest.slice(1) : rest;
  if (!satzartig) return `${kopf} \u2014 ${weiter}`;
  return `${kopf}${pick([", und ", "; ", " \u2014 "])}${weiter}`;
}
function entferneDubletten(text) {
  const kern = (x) => x.replace(/^[—–\s]+/, "").replace(/[.!?…,;:—–\s]+$/, "").replace(/\s+/g, " ").toLowerCase().trim();
  const ohne = text.split(/\n{2,}/).map((absatz) => {
    const s = splitSentences(absatz);
    if (s.length < 2) return absatz;
    const raus = [];
    for (const satz of s) {
      const k = kern(satz);
      if (k && raus.length && kern(raus[raus.length - 1]) === k) continue;
      raus.push(satz);
    }
    return raus.join(" ");
  }).join("\n\n");
  return ohne.replace(
    /([^.!?…\n]{6,})\s*(?:—|–|;|,\s+und)\s*([^.!?…\n]{6,})/g,
    (ganz, links, rechts) => kern(links) && kern(links) === kern(rechts) ? links.replace(/\s+$/, "") : ganz
  );
}
function applySatzlaenge(text, ziel) {
  if (!ziel || ziel < 6) return text;
  const w = (x) => (x.match(/[A-Za-zÄÖÜäöüß]+/g) || []).length;
  return text.split(/\n{2,}/).map((absatz) => {
    let s = splitSentences(absatz);
    if (s.length < 2) return absatz;
    const bleibtKurz = new Set(s.filter(() => chance(0.2)));
    for (let runde = 0; runde < 200; runde++) {
      let beste = -1, kuerzeste = Infinity;
      for (let i = 0; i + 1 < s.length; i++) {
        const n = w(s[i]) + w(s[i + 1]);
        if (n > ziel) continue;
        if (bleibtKurz.has(s[i]) || bleibtKurz.has(s[i + 1])) continue;
        if (!darfVerbinden(s[i], s[i + 1], ziel)) continue;
        if (n < kuerzeste) {
          kuerzeste = n;
          beste = i;
        }
      }
      if (beste < 0) break;
      const satzartig = hatFinitesVerbLeicht(s[beste]);
      s = [...s.slice(0, beste), verbinde(s[beste], s[beste + 1], satzartig), ...s.slice(beste + 2)];
    }
    return s.join(" ");
  }).join("\n\n");
}
function hatFinitesVerbLeicht(satz) {
  return (satz.match(/[a-zäöüß]{3,}/g) || []).some((w) => !!VERB_CONJ[w] || /^(ist|sind|war|waren|hat|haben|wird|werden|kann|muss|will|bleibt|steht|geht|kommt)$/.test(w));
}

// src/generation/dramaturgie.ts
var DKEY = "dm_dramaturgie_v1";
function setDramaData(d) {
  try {
    if (d) localStorage.setItem(DKEY, JSON.stringify(d));
    else localStorage.removeItem(DKEY);
  } catch {
  }
}
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

// src/generation/postprocess.ts
var LINE_FORMS = /* @__PURE__ */ new Set(["script", "video", "strang", "reim", "haiku", "poem"]);
var isLineForm = (input) => !!input && !!input.form && LINE_FORMS.has(input.form);
function glaetten(t) {
  return t.replace(/[ \t]{2,}/g, " ").replace(/[ \t]+\n/g, "\n").replace(/\n{3,}/g, "\n\n").replace(/[ \t]+([,.;:!?])/g, "$1").trim();
}
var ABGESCHNITTEN = /(^|\s)(eine|einem|einen|einer|eines|der|die|dem|den|des|und|oder|aber|wie|als|im|am|bei|für|ohne)$/i;
var NUR_OHNE_VERB = /(^|\s)(mit|an|auf|zu|vor|nach|aus|ist|sind|wird|ein|das)$/i;
function istAbgeschnitten(bare) {
  if (!bare || bare.split(/\s+/).length > 12) return false;
  if (ABGESCHNITTEN.test(bare)) return true;
  return NUR_OHNE_VERB.test(bare) && !hatFinitesVerb(bare);
}
function schliesseFigurenkomma(text, who) {
  const roh = (who || "").trim();
  if (!roh || !roh.includes(",")) return text;
  const figur = personKopf(splitSpeakers(normWho(roh))[0] || "");
  if (!figur.includes(",")) return text;
  try {
    const re = new RegExp("(" + escapeRegExp(figur) + ")(\\s+)(?=[a-z\xE4\xF6\xFC\xDF])", "gi");
    return text.replace(re, "$1,$2");
  } catch {
    return text;
  }
}
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
    const bogen = loadDramaData();
    if (bogen) {
      for (const feld of [
        bogen.einstieg,
        bogen.mitte,
        bogen.hoehepunkt,
        bogen.ausloeser,
        bogen.veraenderungen,
        bogen.konflikte,
        bogen.zeitanomalien,
        bogen.regeln
      ]) {
        for (const satz of feld || []) coherenceWords(satz).forEach((w) => motif.add(w));
      }
    }
    const allowBreaks = input?.disruptor === "on";
    const maxRemove = Math.max(1, Math.floor(splitSentences(t).length * 0.25));
    let removed = 0;
    const outParas = [];
    paras.forEach((p, pi) => {
      const sents = splitSentences(p);
      const kept = sents.filter((s, si) => {
        const bare = s.trim().replace(/["»«)\]]+$/, "").replace(/[.!?…]+$/, "").trim();
        if (istAbgeschnitten(bare)) {
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
    return glaetten(t);
  }
  const ABS = "\u241E";
  t = t.replace(/[ \t]*\n{2,}[ \t]*/g, " " + ABS + " ");
  const sents = t.split(/(?<=[.!?…])\s+/).filter(Boolean);
  const kept = [];
  for (let s of sents) {
    const bare = s.trim().replace(/["“”»«]+$/, "").replace(/[.!?…]+$/, "").trim();
    const opens = (s.match(/„/g) || []).length, closes = (s.match(/[“”»]/g) || []).length;
    if (/\bSatz\s+„/.test(s) && opens > closes) continue;
    if (/,\s+(die|der|das|dem|den|des)\s+(die|der|das|dem|den|des)\s+\p{L}+$/iu.test(bare)) continue;
    if (opens > closes) s = s.replace(/„\s*/g, "");
    s = beugeNachDu(s);
    const _st = s.trim();
    if (kept.length && kept[kept.length - 1] === _st) continue;
    kept.push(_st);
  }
  t = kept.join(" ").replace(/\s*\u241E\s*/g, "\n\n");
  t = t.replace(/(\bich und [A-ZÄÖÜ][\wäöüß]+[^.!?…]*?)\bsie sich\b/gu, "$1wir uns");
  t = t.replace(/([A-ZÄÖÜ][\wäöüß]+ und ich[^.!?…]*?)\bsie sich\b/gu, "$1wir uns");
  const CONN = [/\bDann kippt es\b/gi, /\bDabei:\s*plötzlich\b/gi, /\bUnd immer wieder\b/gi, /\bAm Ende bleibt klar\b/gi];
  CONN.forEach((re) => {
    let n = 0;
    t = t.replace(re, (m) => ++n > 1 ? "" : m);
  });
  t = glaetten(t).replace(/„[ \t]+/g, "\u201E");
  return t;
}
function kleinerArtikel(t) {
  return (t || "").replace(/[ \t]+([,;.!?])/g, "$1").replace(
    /([^\s.!?…:„"»(])([ \t]+)(Ein|Eine|Einen|Einem|Einer|Eines|Der|Die|Das|Den|Dem|Des)\b/g,
    (_m, vor, sp, w) => vor + sp + w.charAt(0).toLowerCase() + w.slice(1)
  );
}
var DU = [
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
function beugeNachDu(s) {
  const di = s.search(/\bdu\b/i);
  if (di < 0) return s;
  const head = s.slice(0, di);
  let tail = s.slice(di);
  const wechsel = tail.search(/[,;:—–(]|\b(?:aber|und|doch|denn|sondern|oder|während|als)\s+(?:er|sie|es|man|wir|ihr|der|die|das|ein|eine|etwas|nichts|jemand|niemand)\b/i);
  let rest = "";
  if (wechsel > 0) {
    rest = tail.slice(wechsel);
    tail = tail.slice(0, wechsel);
  }
  DU.forEach(([re, rep]) => {
    tail = tail.replace(re, rep);
  });
  return head + tail + rest;
}
function kleinesPronomen(t) {
  return (t || "").replace(/([;—–][ \t]+)(Ich|Er|Es|Wir|Du|Man|Ihr)\b/g, (_m, sp, w) => sp + w.toLowerCase());
}
function postProcessText(txt, input) {
  let t = (txt ?? "").toString();
  t = t.replace(/(^|[.!?…]\s+)([a-zäöü])/g, (_m, p1, p2) => p1 + p2.toUpperCase());
  t = t.replace(/\b(und|oder|aber|denn|sondern|sowie|nur|auch|selbst|sogar|erst|schon|noch|doch|nun|dann)(\s+)(die|der|das|den|dem|des|ein|eine|einen|einem|einer|sie|er|es|man|wir|ich|du|ihr|ihre|sein|seine|dann|dabei|dadurch|vielleicht|plötzlich)\b/gi, (_m, c, sp, w) => c + sp + w.charAt(0).toLowerCase() + w.slice(1));
  t = kleinesPronomen(t);
  t = kleinerArtikel(t);
  const name = (input?.who ?? "").toString().trim();
  if (name) {
    const esc = escapeRegExp(name);
    try {
      t = t.replace(new RegExp(`(?<![\\p{L}\\p{N}_])${esc}(?![\\p{L}\\p{N}_])`, "giu"), name);
    } catch {
      t = t.replace(new RegExp(`\\b${esc}\\b`, "gi"), name);
    }
  }
  if (!isLineForm(input) && input?.tone && TONE_DATA[input.tone]) {
    const td = TONE_DATA[input.tone];
    if (td.opener.length) {
      const kopf = t.match(OBJEKT_KOPF_RE);
      t = kopf ? `${kopf[1]} ${pick(td.opener)} ${t.slice(kopf[0].length)}` : `${pick(td.opener)} ${t}`;
    }
    if (td.flavor.length) {
      const wc = t.trim().split(/\s+/).filter(Boolean).length;
      const f = (loadKnobs().ton || 0) / 100;
      const inserts = Math.max(0, Math.min(7, Math.round(Math.max(1, Math.round(wc / 90)) * f)));
      for (let i = 0; i < inserts; i++) t = insertToneFlavor(t, pick(td.flavor));
    }
    t = applyToneRegister(t, input.tone);
  }
  if (!isLineForm(input)) t = entferneDubletten(t);
  if (!isLineForm(input)) t = applySatzlaenge(t, loadKnobs().satzlaenge);
  if (!isLineForm(input)) t = entferneDubletten(t);
  t = polishGerman(t, { who: name });
  t = schliesseFigurenkomma(t, input?.who);
  t = coherencePass(t, input);
  t = coherenceRepairV2(t, input);
  t = t.replace(/(^|[.!?…]\s+)([a-zäöü])/g, (_m, p1, p2) => p1 + p2.toUpperCase());
  t = t.replace(/\b(und|oder|aber|denn|sondern|sowie|nur|auch|selbst|sogar|erst|schon|noch|doch|nun|dann)(\s+)(die|der|das|den|dem|des|ein|eine|einen|einem|einer|sie|er|es|man|wir|ich|du|ihr|ihre|sein|seine|dann|dabei|dadurch|vielleicht|plötzlich)\b/gi, (_m, c, sp, w) => c + sp + w.charAt(0).toLowerCase() + w.slice(1));
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
  const P2 = kit.P;
  const a = `Ich bin ${objektName(obj)}. Ich liege ${kit.W}.`;
  const b = `Ich kenne ${dekliniere(P2, "akk")}. Ich kenne ${kit.hookAcc}.`;
  const c = `Sie nennen es ${pick(["Fehler", "Vorgang", "Omen", "Signal", "Symptom", "Protokoll", "Zufall", "Nichts"])}. Ich nenne es ${pick(["Erinnerung", "Beweis", "Anfang", "Schuld"])}.`;
  const d = ensurePunct(rot("mode.rule", M.rules));
  const e = kit.AisClause ? `${P2} sp\xFCrt: ${kit.Apure}. ${kit.obstacle}.` : `${P2} ${kit.AleadVerb || "will"} ${kit.Apure}. ${kit.obstacle}.`;
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
var schluessel = (t) => t.toLowerCase().replace(/[^a-zäöüß]/g, "").slice(0, 400);
var nachText = /* @__PURE__ */ new Map();
function linkMarkovTrace(finalText) {
  if (!frags.length || !finalText) return;
  if (nachText.size > 64) {
    const e = nachText.keys().next().value;
    if (e) nachText.delete(e);
  }
  nachText.set(schluessel(finalText), frags.slice());
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

// src/generation/verwandlung.ts
function geschlecht(w) {
  const kern = (w || "").trim().split(/\s+/).pop() || "";
  return guessGender(kern.replace(/[^A-Za-zÄÖÜäöüß]/g, ""));
}
function leseVerwandlungen(roh) {
  const raus = [];
  for (const z of roh || []) {
    const m = String(z).split(/\s*(?:→|->|>)\s*/);
    if (m.length !== 2) continue;
    const von = m[0].trim(), nach = m[1].trim();
    if (!von || !nach || von.toLowerCase() === nach.toLowerCase()) continue;
    const g1 = geschlecht(von), g2 = geschlecht(nach);
    if (!g1 || !g2 || g1 !== g2) continue;
    raus.push({ von, nach });
  }
  return raus;
}
function wieGefunden(gefunden, ziel) {
  const grossAmAnfang = /^[A-ZÄÖÜ]/.test(gefunden);
  return grossAmAnfang ? ziel.charAt(0).toUpperCase() + ziel.slice(1) : ziel.charAt(0).toLowerCase() + ziel.slice(1);
}
function verwandleMotive(text, paare) {
  if (!text || !paare.length) return text;
  let t = text;
  for (const { von, nach } of paare) {
    let gesehen = 0;
    try {
      const re = new RegExp(`(^|[^A-Za-z\xC4\xD6\xDC\xE4\xF6\xFC\xDF])(${escapeRegExp(von)})(?![A-Za-z\xC4\xD6\xDC\xE4\xF6\xFC\xDF])`, "gi");
      t = t.replace(re, (ganz, davor, wort) => {
        gesehen++;
        return gesehen === 1 ? ganz : davor + wieGefunden(wort, nach);
      });
    } catch {
    }
  }
  return t;
}

// src/constants.ts
var STORAGE_CORPUS = "divergenz_persistent_corpus_v1";
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

// src/corpus.ts
function loadPersistentCorpus() {
  try {
    return localStorage.getItem(STORAGE_CORPUS) || "";
  } catch {
    return "";
  }
}
var GERUEST_ZEILE = /^\s*(Faktenkasten\b|Kurz gemeldet\s*$|Fiktive Zeitung\b|Zeitzeichen\s*[·|]|Nr\.\s*\d+\s*[·|]|UNABHÄNGIG\b|SEQUENZ\s*—|(?:WER|WO|WANN|WAS|GESAMTLÄNGE)\s*:)/;
function corpusSanitize(text) {
  let s = (text ?? "").toString();
  s = s.split(/\r?\n/).filter((z) => !/^\s*(SEQUENZ\s*—|(?:WER|WO|WANN|WAS|GESAMTLÄNGE)\s*:)/.test(z)).map((z) => z.replace(/^\s*(?:Shot\s*\d+\s*\([^)]*\)|(?:DE|EN)\s*:)\s*/, "")).join("\n");
  s = s.replace(/\([^()]*\)/g, " ");
  s = s.replace(/\b(?:gegen|um|ab|seit|bis)\s+\d{1,2}:\d{2}\b\s*(?:—|–)?\s*/gi, "");
  s = s.replace(/\b\d{1,2}:\d{2}\b\s*—\s*/g, "");
  s = s.replace(/\b(Schluss|Notiz|Rand|Gestern|Jetzt|Später|Drei Tage später)\s*—\s*/g, "");
  s = s.replace(/\bSZENE:\s*/g, "");
  s = s.split(/\r?\n/).filter((z) => !GERUEST_ZEILE.test(z)).join("\n");
  s = s.replace(/Faktenkasten\s*·[^\n]*?(?:\.(?=\s+[A-ZÄÖÜ])|$)/g, " ");
  s = s.replace(/—\s*(?=[.—])/g, "");
  s = s.replace(/\.{2,}/g, ".");
  s = s.replace(/\s+/g, " ").trim();
  return s;
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

// src/presets.data.ts
var BUILTIN_PRESETS = {
  "rimbaud": {
    "motifs": [
      "zersplittertes Licht \xFCber schwarzem Wasser",
      "eine violette Brandung",
      "phosphoreszierende Gischt",
      "ein taumelnder Mast",
      "rostige Takelage im Wind",
      "gr\xFCnes Feuer im Meer",
      "ein schwankender Kiel",
      "versunkene Sterne",
      "eine fiebrige Tropennacht",
      "zitternde Tiefe unter dem Rumpf",
      "ein Boot, das seine Treidler verloren hat",
      "ein Fluss, der ins Meer l\xE4uft und nicht zur\xFCck",
      "ein Schulheft, in dem etwas anderes steht als Latein",
      "eine Landstra\xDFe, die aus dem Ort hinausf\xFChrt",
      "ein Hafen, den man nur nachts erreicht",
      "ein Brief aus einem Land ohne Winter",
      "ein Rausch, der drei Tage dauert",
      "ein Koffer, der nie ausgepackt wird"
    ],
    "hooks": [
      "Ich bin frei von jeder Hand.",
      "Der Fluss hat mich losgeschnitten.",
      "Niemand h\xE4lt mehr das Steuer.",
      "Ich treibe durch ein Meer ohne Karten.",
      "Die Nacht schlug wie eine Welle \xFCber mich.",
      "Ich habe meine Anker vergessen.",
      "Kein Hafen ruft meinen Namen.",
      "Der Fluss hat das Tau durchgescheuert, und niemand h\xE4lt.",
      "Er ist am Morgen fort, und das Bett ist gemacht.",
      "Ein Gedicht liegt auf dem Tisch, ohne Anrede.",
      "Die Stra\xDFe nach Norden ist offen, seit gestern.",
      "Jemand schreibt aus einer Stadt, die er nie nannte.",
      "Das Geld reicht bis zur Grenze und keinen Schritt weiter.",
      "Ein Lehrer erkennt die Handschrift und schweigt.",
      "Im Zimmer riecht es nach Absinth und nassem Papier.",
      "Ein Freund wartet am Bahnhof und wird nicht abgeholt.",
      "Die Sohlen sind durch, und der Weg geht weiter."
    ],
    "props": [
      "ein zerrissenes Segel",
      "ein rostiges Ruder",
      "eine nasse Seekarte",
      "eine zerbrochene Laterne",
      "eine Muschel voller Wind",
      "ein salzverkrustetes Seil",
      "einen Kompass ohne Norden",
      "ein leeres Logbuch",
      "eine bleiche Boje",
      "einen gesplitterten Mast",
      "ein Schulheft mit fremden Zeilen",
      "einen Ranzen ohne B\xFCcher",
      "ein Paar durchgelaufene Sohlen",
      "eine Karte mit einer K\xFCste darauf",
      "eine Flasche, die nicht mehr voll ist",
      "einen Brief aus Harar",
      "ein B\xFCndel Papier mit Wasserflecken",
      "einen Fahrschein, nur in eine Richtung"
    ],
    "turns": [
      "das Meer antwortet mit Farben, die keine Sprache hat",
      "der Himmel st\xFCrzt ins Wasser und bleibt dort liegen",
      "die Sterne beginnen zu sinken, einer nach dem anderen",
      "etwas unter dem Rumpf atmet und wartet ab",
      "die Wellen tragen Gesichter, die er kennen m\xFCsste",
      "ein Leuchten bricht aus der Tiefe",
      "der Wind wird zu einer Stimme",
      "er wirft die Ruder weg und wird schneller",
      "das Sehen wird zur Arbeit und die Arbeit zur Krankheit",
      "die Freiheit kommt und l\xE4sst sich nicht aushalten",
      "er h\xF6rt auf zu schreiben, mitten im besten Jahr",
      "der Fluss tr\xE4gt ihn an einer Stadt vorbei, die er suchte",
      "ein Schuss f\xE4llt in einem Zimmer in Br\xFCssel",
      "die Sprache reicht nicht, und er erfindet eine neue",
      "er kehrt heim und erkennt das Haus nicht wieder",
      "der Rausch geht vorbei und l\xE4sst einen Satz zur\xFCck",
      "das Boot findet keinen Hafen und will keinen mehr",
      "ein Kaufmann in Afrika schreibt, wo ein Dichter war",
      "die Sterne stehen tiefer, je weiter er kommt",
      "er verkauft alles, auch die B\xFCcher"
    ],
    "obstacles": [
      "die Str\xF6mung setzt jede Nacht in eine andere Richtung",
      "die Riffe stehen im Wasser wie aufgestellte Messer",
      "eine Flaute liegt schwarz auf dem Wasser",
      "die Untiefen zittern und sind auf keiner Karte",
      "das Fieber geht unter Deck von Mann zu Mann",
      "der Sturm hat kein Zentrum und h\xF6rt nicht auf",
      "unsichtbare Netze h\xE4ngen zwischen den Inseln",
      "die Flaute h\xE4lt l\xE4nger als der Vorrat an Wasser",
      "kein Wirt gibt einem Sechzehnj\xE4hrigen ein Zimmer",
      "die Grenze verlangt Papiere, die er nicht hat",
      "der Freund will bleiben, wo er weg will",
      "das Geld kommt zu sp\xE4t und in falscher W\xE4hrung",
      "die Mutter schreibt und erwartet eine Antwort",
      "die K\xFCste ist da und nicht zu erreichen",
      "das Fieber kommt mit dem S\xFCden",
      "die Sprache des Landes hat keine W\xF6rter daf\xFCr",
      "der R\xFCckweg kostet mehr als der Hinweg",
      "die Zeitschriften drucken es nicht",
      "das Bein tr\xE4gt nicht mehr bis zum Hafen"
    ],
    "stakes": [
      "Der Einsatz ist Aufl\xF6sung des Selbst.",
      "Der Einsatz ist eine Richtung, die niemand mehr angibt.",
      "Der Einsatz ist Ekstase oder Untergang.",
      "Der Einsatz ist ein Name, den er ablegen will.",
      "Der Einsatz ist die R\xFCckkehr an ein Ufer.",
      "Der Einsatz ist ein Jahr, in dem alles geschrieben wird.",
      "Der Einsatz ist eine Freundschaft, die nicht gutgeht.",
      "Der Einsatz ist ein Hafen, den er nicht will.",
      "Der Einsatz ist die Sprache, die er hinter sich l\xE4sst.",
      "Der Einsatz ist die R\xFCckkehr, die niemand erwartet."
    ],
    "endings": [
      "Ich will zur\xFCck in ein stilles Becken.",
      "Vielleicht tr\xE4ume ich von einem kleinen Hafen.",
      "Ich sehne mich nach einem klaren Ufer.",
      "Ich bin m\xFCde vom grenzenlosen Blau.",
      "Die See schweigt zuletzt, und das ist keine Antwort.",
      "Und das Boot treibt weiter, ohne Ruder.",
      "So bleibt das Heft auf dem Tisch liegen.",
      "Am Ende schreibt er \xFCber Preise und nicht \xFCber Sterne.",
      "Und der Fluss l\xE4uft ins Meer, wie immer.",
      "So endet die Reise in einem Zimmer mit Fenster zum Hof.",
      "Und die Sohlen halten noch bis zur Grenze.",
      "Der Brief kommt an, drei Monate sp\xE4ter.",
      "Und niemand liest es, solange er lebt.",
      "So bleibt ein Satz \xFCbrig, und der gen\xFCgt.",
      "Und die Stra\xDFe nach Norden ist morgen auch noch offen."
    ],
    "verwandlungen": [
      "Boot\u2192Blatt",
      "Fluss\u2192Faden",
      "Meer\u2192Feld",
      "Hafen\u2192K\xE4fig",
      "Rausch\u2192Schlaf",
      "Stra\xDFe\u2192Ader"
    ]
  },
  "baudelaire": {
    "motifs": [
      "nasse Pflastersteine im Gaslicht",
      "eine Lilie im Aschenbecher",
      "Parf\xFCm \xFCber abgestandenem Rauch",
      "ein Spiegel mit dunklem Rand",
      "ein Blumenstrau\xDF, der zu sp\xE4t welkt",
      "eine Kutsche, die wie ein Sarg vorbeizieht",
      "goldene Ornamente auf br\xF6ckelndem Putz",
      "ein L\xE4cheln, das nach bitterer Minze schmeckt",
      "eine Gasse, die nach Metall riecht",
      "ein Himmel, der wie Samt dr\xFCckt",
      "eine Stra\xDFe, die im Gaslicht l\xE4nger wird",
      "ein Balkon \xFCber einem Hof voller W\xE4sche",
      "ein Zimmer, in dem der Vorhang immer zu ist",
      "eine Menge, in der man allein besser sitzt",
      "ein Kadaver am Wegrand, im Sonnenlicht",
      "eine Uhr, die nur die verlorene Zeit z\xE4hlt",
      "ein Hafen, den man nur aus dem Fenster sieht",
      "ein Glas Absinth, das langsam tr\xFCb wird",
      "eine Frau, die vorbeigeht und nicht wiederkommt",
      "ein Bett am Nachmittag, ungemacht",
      "ein Gedicht, das ein Gericht verbietet",
      "eine Katze auf einem Stapel B\xFCcher"
    ],
    "hooks": [
      "Im Schaufenster liegt Sch\xF6nheit wie eine Drohung.",
      "Ein Duft bleibt an mir h\xE4ngen, als h\xE4tte er Z\xE4hne.",
      "Die Stadt atmet langsam, mit schwerem Atem.",
      "Jemand lacht zu leise, um harmlos zu sein.",
      "Zwischen zwei Laternen f\xE4llt ein Schatten aus der Zeit.",
      "Ich gehe, als tr\xFCge ich meinen Namen wie eine Last.",
      "Etwas Gl\xE4nzendes liegt im Schmutz und tut unschuldig.",
      "Der Nachmittag zieht sich, als w\xE4re er ein Jahr.",
      "Ein Blick aus dem Fenster kostet den ganzen Tag.",
      "Der Gl\xE4ubiger steht wieder unten an der T\xFCr.",
      "Ein Duft im Treppenhaus geh\xF6rt zu niemandem hier.",
      "Die Menge tr\xE4gt mich, und ich lasse mich tragen.",
      "Ein Gedicht wird gestrichen, bevor es gedruckt ist.",
      "Der Spiegel im Flur hat einen dunklen Rand bekommen.",
      "Jemand lacht im Hof, und es klingt nicht gut.",
      "Die Miete ist f\xE4llig und das Zimmer bezahlt.",
      "Ein Brief von der Mutter liegt seit Tagen da.",
      "Im Caf\xE9 spielt jemand dasselbe St\xFCck zum dritten Mal.",
      "Drau\xDFen regnet es seit dem Morgen ohne Pause."
    ],
    "props": [
      "eine zerknitterte Visitenkarte",
      "ein Flakon mit Resten",
      "eine schwarze Handschuhspitze",
      "einen vergilbten Liebesbrief",
      "eine silberne M\xFCnze",
      "ein kleines Taschenmesser",
      "eine zerbrochene Uhrkette",
      "eine rote Nelke",
      "eine Opiumdose",
      "einen Taschenspiegel",
      "einen Flakon mit einem Rest Parf\xFCm",
      "ein Paar schwarze Handschuhe",
      "einen Stapel unbezahlter Rechnungen",
      "ein Glas mit einem L\xF6ffel dar\xFCber",
      "einen Spazierstock mit silbernem Knauf",
      "ein Notizheft mit gestrichenen Zeilen",
      "eine Fotografie mit einem Knick",
      "einen Mantel, der zu gut f\xFCr die Stra\xDFe ist",
      "eine Uhr, die man mehrmals versetzt hat"
    ],
    "turns": [
      "die Sch\xF6nheit zeigt ihre R\xFCckseite",
      "das Verlangen wird zur Anklage",
      "die Stra\xDFe f\xFChrt in einen Raum ohne T\xFCr",
      "ein Blick verr\xE4t, was nicht gesagt werden darf",
      "die Musik im Caf\xE9 f\xE4llt pl\xF6tzlich aus der Welt",
      "ein Gest\xE4ndnis schmeckt nach Rost",
      "das Licht macht alles eleganter, aber nicht wahrer",
      "die Sch\xF6nheit zeigt ihre R\xFCckseite und bleibt sch\xF6n",
      "das Verlangen wird zur Anklage gegen den, der es hat",
      "die Stra\xDFe f\xFChrt in einen Raum, der keine T\xFCr hat",
      "der Ekel und die Andacht kommen zur selben Stunde",
      "ein Vers gelingt, und der Tag ist trotzdem verloren",
      "die Menge wird zur einzigen Gesellschaft, die tr\xE4gt",
      "der Rausch h\xE4lt, was er f\xFCr eine Stunde verspricht",
      "das Geld ist da und am Abend wieder fort",
      "die Erinnerung parf\xFCmiert einen Schmerz, der frisch bleibt",
      "der Kadaver am Weg wird zum Gegenstand einer Zeile",
      "sie geht vorbei, und daraus wird ein ganzes Leben",
      "der Vorhang bleibt zu, und die Stadt kommt trotzdem herein"
    ],
    "obstacles": [
      "der Regen l\xF6scht die Spuren",
      "eine Einladung ist eine Falle",
      "ein Zeuge erinnert sich falsch",
      "die Nacht verdichtet die L\xFCgen",
      "ein Versprechen klebt wie Teer",
      "die Menge verschluckt jede Entscheidung",
      "das Herz verwechselt Glanz mit Rettung",
      "der Regen l\xF6scht die Spuren noch in derselben Nacht",
      "eine Einladung erweist sich als Falle mit H\xF6flichkeit",
      "ein Zeuge erinnert sich falsch und bleibt dabei",
      "die Nacht verdichtet die L\xFCgen zu einer Geschichte",
      "ein Versprechen klebt wie Teer an den H\xE4nden",
      "der Gl\xE4ubiger kennt jede Hintert\xFCr des Hauses",
      "der Vers stimmt und das Gef\xFChl nicht",
      "das Zimmer wird zum Ersten gek\xFCndigt",
      "der Verleger will etwas Freundlicheres",
      "die Nacht ist kurz und der Morgen ist l\xE4nger",
      "die Apotheke gibt nichts mehr ohne Bezahlung",
      "ein Gericht streicht sechs Gedichte",
      "die Mutter zahlt und schreibt einen Brief dazu",
      "der Hafen ist zu Fu\xDF nicht zu erreichen"
    ],
    "stakes": [
      "Der Einsatz ist ein K\xF6rper, mit dem man weiter auskommt.",
      "Der Einsatz ist Begehren: Es frisst, was es ber\xFChrt.",
      "Der Einsatz ist Wahrheit: Sie kommt im Kost\xFCm.",
      "Der Einsatz ist Erinnerung: Sie parf\xFCmiert den Schmerz.",
      "Der Einsatz ist Freiheit: Sie kostet Luxus.",
      "Der Einsatz ist eine Stunde, in der die Zeit stillsteht.",
      "Der Einsatz ist ein Vers, f\xFCr den der Tag draufgeht.",
      "Der Einsatz ist ein Zimmer bis zum Ersten des Monats.",
      "Der Einsatz ist eine Sch\xF6nheit, die niemand verzeiht.",
      "Der Einsatz ist ein Buch gegen ein Gerichtsurteil.",
      "Der Einsatz ist die Freiheit, die Luxus kostet."
    ],
    "endings": [
      "Und die Stadt schlie\xDFt ihre Lippen.",
      "Und der Duft bleibt, wie ein Urteil.",
      "Damit ist die Sch\xF6nheit erledigt.",
      "So bleibt nur Glanz auf kalter Haut.",
      "Und ich gehe, als h\xE4tte ich gewonnen \u2013 und verloren.",
      "Und die Stadt schlie\xDFt ihre Lippen \xFCber allem.",
      "So bleibt der Duft im Treppenhaus wie ein Urteil.",
      "Am Ende bleibt Glanz auf kalter Haut.",
      "Und der Vorhang bleibt zu bis zum Abend.",
      "Und im Hof h\xE4ngt die W\xE4sche \xFCber Nacht.",
      "Der Nachmittag ist um, und nichts ist geschehen.",
      "Und das Glas steht tr\xFCb auf dem Tisch.",
      "So wird der Vers gestrichen und bleibt trotzdem stehen."
    ],
    "verwandlungen": [
      "Stadt\u2192Wunde",
      "Duft\u2192Verdacht",
      "Spiegel\u2192Schatten",
      "Nacht\u2192Decke",
      "Menge\u2192Flut",
      "Vers\u2192Riss",
      "Zimmer\u2192Grab",
      "Glas\u2192Auge"
    ]
  },
  "kafka": {
    "motifs": [
      "ein Formular ohne \xDCberschrift",
      "eine Wartemarke, die nicht aufgerufen wird",
      "ein Korridor mit zu vielen T\xFCren",
      "ein Stempel mit verschwommener Nummer",
      "ein Protokoll, das sich selbst zitiert",
      "ein Schalterfenster ohne Mitarbeiter",
      "eine Akte mit falschem Namen",
      "eine Uhr, die in Abs\xE4tzen tickt",
      "ein Bescheid mit leerem Grund",
      "eine Treppe, die nach unten f\xFChrt und h\xF6her endet",
      "ein Schalter, an dem niemand sitzt",
      "eine Nummer, die zweimal vergeben wurde",
      "ein Aktenschrank ohne Schl\xFCssel",
      "ein Gang, der schmaler wird",
      "eine Sitzung, die schon begonnen hat",
      "ein Vermerk am Rand, von fremder Hand",
      "eine Treppe zwischen zwei Stockwerken",
      "ein Wartezimmer mit zu vielen St\xFChlen",
      "ein Namensschild, das abf\xE4llt",
      "eine Kopie, die deutlicher ist als das Original",
      "ein Fahrstuhl, der nur abw\xE4rts f\xE4hrt",
      "ein Register mit fehlender Seite",
      "eine Klingel ohne Draht",
      "ein Amt, das seit Jahren umzieht",
      "ein Protokoll \xFCber ein Gespr\xE4ch, das nicht stattfand",
      "eine T\xFCr mit zwei Nummern",
      "ein Zettel, der die Auskunft widerruft",
      "ein Fenster zum Innenhof des Amtes",
      "eine Schlange, die sich nicht bewegt",
      "ein Kalender ohne Feiertage"
    ],
    "hooks": [
      "Der Brief ist da, bevor ich ihn erwarte.",
      "Niemand sagt mir, worum es geht, aber alle tun so.",
      "Die T\xFCr steht offen und ist dennoch verschlossen.",
      "Mein Name klingt pl\xF6tzlich wie ein Fehler im System.",
      "Die Luft roch nach Papier und geduldeter Angst.",
      "Ich habe eine Nummer, aber keinen Platz.",
      "Der Wachmann nickt, als h\xE4tte er mich erfunden.",
      "Die Auskunft widerspricht der von gestern, beide gelten.",
      "Ein Zimmer wird genannt, das es im Plan nicht gibt.",
      "Der Vorgang l\xE4uft, seit ich ihn nicht gestellt habe.",
      "Man bittet mich, das Formular selbst zu bewerten.",
      "Die Nummer auf meinem Zettel ist l\xE4ngst aufgerufen.",
      "Jemand kennt meinen Fall besser als ich.",
      "Der Antrag ist bewilligt und gleichzeitig ung\xFCltig.",
      "Die Frist beginnt erst mit ihrem Ende.",
      "Ich soll die Akte holen, die \xFCber mich gef\xFChrt wird.",
      "Die Zust\xE4ndigkeit liegt bei einer Stelle ohne Adresse.",
      "Der Stempel fehlt, der den fehlenden Stempel best\xE4tigt.",
      "Man erwartet mich, ohne mich einbestellt zu haben.",
      "Jede Antwort verweist auf denselben Absatz."
    ],
    "props": [
      "einen Bleistift ohne Spitze",
      "ein Formular in dreifacher Ausf\xFChrung",
      "einen Stempelabdruck auf d\xFCnnem Papier",
      "eine Mappe mit Bindfaden",
      "eine Quittung ohne Betrag",
      "eine Klingel, die nicht l\xE4utet",
      "einen Ausweis mit fremdem Foto",
      "einen Schl\xFCssel ohne Schloss",
      "eine Wartemarke",
      "ein Protokollheft",
      "ein Durchschlag",
      "eine Aktennotiz",
      "einen Aktendeckel",
      "eine Klammer",
      "ein Kuvert ohne Absender",
      "einen Vordruck",
      "ein Siegel",
      "einen Terminzettel",
      "eine Quittung",
      "ein Namensschild",
      "einen Ordner ohne R\xFCcken",
      "eine Karteikarte",
      "einen Stempelhalter",
      "ein Merkblatt",
      "eine Vollmacht",
      "einen Laufzettel",
      "ein Kassenbuch"
    ],
    "turns": [
      "die Begr\xFCndung fehlt, aber gilt",
      "die Zust\xE4ndigkeit wandert weiter",
      "eine Unterschrift erscheint, ohne Hand",
      "die T\xFCr f\xFChrt in denselben Raum zur\xFCck",
      "der Zeuge ist identisch mit dem Angeklagten",
      "die Akte verlangt eine Akte",
      "die Zeit wird zum Formularfeld",
      "die Akte wird an den Anfang zur\xFCckgereicht",
      "der Bescheid wird aufgehoben und best\xE4tigt",
      "eine zweite Stelle erkl\xE4rt sich f\xFCr zust\xE4ndig",
      "der Fall wechselt den Namen",
      "die Auskunft gilt r\xFCckwirkend",
      "die Sitzung wird auf gestern verlegt",
      "der Vorgang wird zusammengelegt und getrennt",
      "die Unterschrift stammt aus dem eigenen Haus",
      "der Antrag wird als gestellt betrachtet",
      "die Abteilung existiert nur noch im Plan",
      "der Bescheid tr\xE4gt ein Datum von morgen",
      "die Auskunft ist richtig und macht die Sache schlimmer",
      "ein Beamter erkennt ihn wieder, aus einem anderen Vorgang",
      "die Zust\xE4ndigkeit kehrt zur\xFCck zu dem, der abgelehnt hat"
    ],
    "obstacles": [
      "die Zust\xE4ndigkeit ist unklar",
      "jemand fehlt, der immer fehlt",
      "die Frist ist schon vorbei",
      "die Regel wird erst nach dem Versto\xDF erkl\xE4rt",
      "das Formular hat ein Feld zu viel",
      "der Schalter schlie\xDFt genau beim Satzanfang",
      "ein Protokoll widerspricht dem n\xE4chsten",
      "das Zimmer ist heute geschlossen",
      "die Vollmacht wird nicht anerkannt",
      "der Vorgang ruht ohne Grund",
      "eine Unterlage fehlt, die es nicht gibt",
      "der Zust\xE4ndige ist im selben Haus unerreichbar",
      "die Nummer ist g\xFCltig, aber nicht f\xFCr hier",
      "das Merkblatt widerspricht dem Formular",
      "die Auskunft wird nur schriftlich erteilt",
      "der Termin liegt hinter der Frist",
      "niemand darf die Regel nennen",
      "der Bescheid nennt eine Vorschrift, die es nicht mehr gibt",
      "die Anh\xF6rung findet statt, w\xE4hrend er im Flur wartet"
    ],
    "stakes": [
      "Der Einsatz ist Identit\xE4t: Sie wird zu einer Aktennummer.",
      "Der Einsatz ist Freiheit: Sie h\xE4ngt an einem Stempel.",
      "Der Einsatz ist Zeit: Sie wird verwaltet.",
      "Der Einsatz ist Sprache: Sie wird als Beweis benutzt.",
      "Der Einsatz ist Schuld: Sie existiert vor der Tat.",
      "Der Einsatz ist Ordnung: Sie h\xE4lt oder frisst.",
      "Der Einsatz ist Geduld: Sie wird gemessen.",
      "Der Einsatz ist ein Name: Er steht in keiner Liste.",
      "Der Einsatz ist Zust\xE4ndigkeit: Jemand muss sie tragen.",
      "Der Einsatz ist ein Datum: Alles h\xE4ngt daran.",
      "Der Einsatz ist Auskunft: Sie wird verwaltet."
    ],
    "endings": [
      "Damit ist der Vorgang er\xF6ffnet.",
      "Und es gibt keinen n\xE4chsten Schalter.",
      "So bleibt nur das Warten als Entscheidung.",
      "Und der Bescheid ist schon g\xFCltig.",
      "Und ich unterschrieb, ohne zu wissen, was ich war.",
      "Der Vorgang wird fortgesetzt, an anderer Stelle.",
      "Und die Marke bleibt in der Hand.",
      "So schlie\xDFt das Amt, und der Fall bleibt offen.",
      "Und im Flur geht das Licht nach der Zeit aus.",
      "Damit gilt der Antrag als eingegangen.",
      "Und der n\xE4chste Zettel tr\xE4gt dieselbe Nummer.",
      "So endet der Tag im selben Wartezimmer.",
      "Und im Flur wartet jemand mit demselben Blatt.",
      "So bleibt der Vorgang anh\xE4ngig, auf unbestimmte Zeit."
    ]
  },
  "expressionismus": {
    "motifs": [
      "eine Stra\xDFe aus schreiendem Neon",
      "ein Himmel wie ein blutiger Lappen",
      "Fenster, die starren",
      "eine Sirene im Herzen",
      "Schwei\xDF auf kaltem Metall",
      "ein Schatten mit Z\xE4hnen",
      "eine Stadt, die fiebert",
      "zerrissene Plakate wie Haut",
      "ein Atem aus Ru\xDF",
      "Licht, das schneidet",
      "ein Bahnhof, der Menschen ausspuckt wie Kohlen",
      "Fassaden, die sich \xFCber die Stra\xDFe neigen",
      "eine Uhr mit Zeigern wie Messer",
      "die Stadt, die nachts atmet und tags\xFCber schreit",
      "ein Mond wie eine offene Wunde \xFCber den D\xE4chern",
      "Stra\xDFenbahnen, die durch die Nerven fahren",
      "eine Menge, die eine einzige Bewegung macht",
      "Reklame, die durch geschlossene Lider dringt",
      "ein Fabrikschlot, der den Himmel aufschlitzt",
      "Gesichter im Fenster eines fahrenden Zuges"
    ],
    "hooks": [
      "Die Stadt springt mich an.",
      "Ich h\xF6re mein Blut in den Dr\xE4hten.",
      "Die H\xE4user stehen zu nah, als wollten sie zubei\xDFen.",
      "Ein Schrei h\xE4ngt zwischen zwei Reklamen.",
      "Meine Schritte klingen wie Anklagen.",
      "Das Licht ist zu hell, um wahr zu sein.",
      "Jemand rannte, ohne zu wissen, wohin.",
      "Die H\xE4user r\xFCcken zusammen, sobald ich stehenbleibe.",
      "Jemand schreit, und die Stra\xDFe schluckt es sofort.",
      "Das Licht der Reklame liegt rot auf meinen H\xE4nden.",
      "Die Stra\xDFenbahn f\xE4hrt an, bevor jemand eingestiegen ist.",
      "Ein Mann l\xE4uft, und alle laufen mit, ohne Grund.",
      "Der Himmel steht so tief, dass die D\xE4cher ihn tragen.",
      "Die Uhr am Bahnhof geht r\xFCckw\xE4rts, eine Minute lang.",
      "Ein Fenster geht auf, und niemand steht dahinter.",
      "Der L\xE4rm h\xF6rt auf, und das ist das Schlimmste.",
      "Ein Kind zeigt auf etwas, das keiner sehen will.",
      "Die Menge teilt sich, ohne dass jemand vorangeht.",
      "Mein Herz schl\xE4gt im Takt einer fremden Maschine."
    ],
    "props": [
      "eine zerbeulte Blechdose",
      "einen Zigarettenstummel",
      "ein zerrissenes Plakat",
      "eine Taschenlampe",
      "ein St\xFCck Draht",
      "eine rostige Klinge",
      "einen Notizblock",
      "eine Fahrkarte",
      "ein Glas mit schwarzem Wasser",
      "ein Taschenradio",
      "ein Flugblatt mit verschmierter Schrift",
      "eine Stra\xDFenbahnkarte, zweimal geknickt",
      "einen Spiegelscherben aus einem Schaufenster",
      "ein Nachthemd unter einem Mantel",
      "eine Uhr ohne Glas",
      "einen Farbtopf mit rotem Rest",
      "ein B\xFCndel Zeitungen von gestern",
      "eine Brille mit einem gesprungenen Glas",
      "einen Ausweis mit einem fremden Bild",
      "ein Messer, das nur zum Brotschneiden taugt"
    ],
    "turns": [
      "die Nacht kippt pl\xF6tzlich ins Wei\xDF",
      "die Menge wird zu einem einzigen Gesicht",
      "ein Wort wird zur Waffe",
      "die Angst beginnt zu singen",
      "die Stra\xDFe zieht sich zusammen",
      "das Licht verr\xE4t den K\xF6rper",
      "der Atem wird zum Befehl",
      "die Stra\xDFe kippt, und alle gehen weiter, als w\xE4re nichts",
      "der Schrei kommt aus dem eigenen Mund und wird nicht geh\xF6rt",
      "die Menge erkennt einen und wird zu einem Tier",
      "das Licht geht an, und die Gesichter sind dieselben",
      "die Angst legt sich, und darunter ist nichts",
      "ein Fremder spricht ihn an und nennt seinen Namen",
      "der L\xE4rm wird zu einem Rhythmus, und er geht darin auf",
      "die Stadt zieht sich zusammen wie ein Muskel",
      "jemand springt, und die Stra\xDFe geht weiter",
      "das Fieber steigt, und die Bilder werden genauer",
      "er sieht sich selbst am anderen Ende des Bahnsteigs",
      "die Reklame wiederholt ein Wort, bis es etwas bedeutet",
      "die Nacht wird hell, und die Farben werden falsch",
      "er h\xF6rt auf zu laufen, und nichts holt ihn ein"
    ],
    "obstacles": [
      "die Sirenen \xFCbert\xF6nen alles",
      "die Menge dr\xFCckt wie Beton",
      "ein Blick l\xF6st Panik aus",
      "die Wege f\xFChren im Kreis",
      "der K\xF6rper ist zu laut",
      "die Luft ist zu dick",
      "die T\xFCren sind nur Attrappen",
      "die Stra\xDFen f\xFChren alle zum selben Platz zur\xFCck",
      "der L\xE4rm l\xE4sst keinen ganzen Gedanken zu",
      "die Menge tr\xE4gt ihn, wohin sie will",
      "kein Fenster geht auf dieser Seite auf",
      "die Uhr am Bahnhof zeigt eine Zeit ohne Zug",
      "die Farben stimmen nicht mit den Dingen \xFCberein",
      "niemand h\xF6rt zu, weil alle sprechen",
      "die Wohnung ist zu hoch und die Treppe zu eng",
      "das Fieber macht die Bilder sch\xE4rfer als die Sachen",
      "ein Wort fehlt genau dort, wo es n\xF6tig w\xE4re",
      "die Nacht ist zu hell zum Schlafen",
      "der Weg zur Arbeit ist derselbe wie gestern",
      "die H\xE4nde zittern, sobald jemand hinsieht",
      "die Stadt h\xF6rt nicht auf, auch nicht um vier"
    ],
    "stakes": [
      "Der Einsatz ist Nerven: Sie rei\xDFen.",
      "Der Einsatz ist Freiheit: Sie ist ein Sprint.",
      "Der Einsatz ist Sprache: Sie wird Schreien.",
      "Der Einsatz ist K\xF6rper: Er ist eine Fackel.",
      "Der Einsatz ist Morgen: Es k\xF6nnte brennen.",
      "Der Einsatz ist ein Kopf, der noch bis zum Morgen h\xE4lt.",
      "Der Einsatz ist ein Zimmer, in dem der L\xE4rm aufh\xF6rt.",
      "Der Einsatz ist ein Satz, den jemand zu Ende h\xF6rt.",
      "Der Einsatz ist der Unterschied zwischen Sehen und Sehen.",
      "Der Einsatz ist ein Tag ohne diese Stra\xDFe.",
      "Der Einsatz ist die Frage, wem der Schrei geh\xF6rt."
    ],
    "endings": [
      "Und die Stadt lacht im Neon.",
      "Und der Morgen kommt wie eine Beule.",
      "So blieb ich stehen, weil alles rannte.",
      "Und der Schrei wird leise.",
      "Und das Licht tat, als w\xE4re es sauber.",
      "Und die Reklame geht an, p\xFCnktlich wie jeden Abend.",
      "So steht er still, und die Stadt l\xE4uft an ihm vorbei.",
      "Am Ende ist es nur der L\xE4rm, der bleibt.",
      "Und der Morgen kommt grau \xFCber die D\xE4cher.",
      "So schlie\xDFt sich die Stra\xDFe hinter ihm.",
      "Und die Stra\xDFenbahn f\xE4hrt weiter, voll und leer zugleich.",
      "Der Schrei ist verklungen, das Echo arbeitet noch.",
      "Und die Uhr am Bahnhof geht wieder richtig.",
      "So bleibt das Fenster offen, und niemand steht darin.",
      "Und im Fabrikhof beginnt die Schicht wie immer."
    ],
    "verwandlungen": [
      "Stadt\u2192Maschine",
      "Schrei\u2192Ton",
      "Stra\xDFe\u2192Ader",
      "Fenster\u2192Auge",
      "Menge\u2192Welle",
      "Reklame\u2192Sonne",
      "Uhr\u2192Klinge",
      "Himmel\u2192Deckel"
    ]
  },
  "surrealismus1920": {
    "motifs": [
      "eine Treppe aus Milchglas",
      "ein Telefon, das in Sand klingelt",
      "ein Auge in einer Schublade",
      "ein Regenschirm in einem Zimmerbrand",
      "eine Uhr aus weichem Brot",
      "ein Pferd, das im Flur schl\xE4ft",
      "ein Fenster, das nach innen \xF6ffnet",
      "eine Hand voller Schl\xFCssel, die singen",
      "eine Karte, die W\xF6rter statt Orte zeigt",
      "ein Spiegel, der einen anderen Raum behauptet",
      "ein Caf\xE9, in dem S\xE4tze gew\xFCrfelt werden",
      "eine Ausstellung, bei der man den Eingang sucht",
      "ein Zimmer, dessen Fenster nach innen geht",
      "eine Fotografie, auf der jemand zu viel steht",
      "ein Manifest, das seine eigenen Regeln bricht",
      "eine Uhr, die auf einem Ast h\xE4ngt",
      "ein Zug, der in einem Wohnzimmer h\xE4lt"
    ],
    "hooks": [
      "Ich trete in den Raum, und der Raum tritt zur\xFCck.",
      "Ein Satz liegt auf dem Boden wie eine Banane.",
      "Die Lampe machte Ger\xE4usche, als w\xE4re sie nass.",
      "Jemand spricht, aber die Worte kommen aus der Tapete.",
      "Meine Schuhe wissen den Weg, ich nicht.",
      "Ein Vogel bittet um eine Quittung.",
      "Die T\xFCr erinnert sich an mein Gesicht.",
      "Der Text wird geschrieben, ohne dass jemand nachdenkt.",
      "Jemand liest eine Zeile vor, die niemand geschrieben hat.",
      "Die T\xFCr ist gezeichnet und l\xE4sst sich \xF6ffnen.",
      "Ein Teilnehmer schl\xE4ft, und die Sitzung geht weiter.",
      "Auf dem Tisch liegt ein Gegenstand, den keiner mitbrachte.",
      "Der Traum von gestern wird heute protokolliert.",
      "Zwei S\xE4tze werden gefaltet und ergeben einen dritten.",
      "Die Ausstellung \xF6ffnet, und die Bilder h\xE4ngen verkehrt.",
      "Jemand fragt nach dem Sinn und wird ausgeschlossen.",
      "Ein Foto zeigt eine Person, die nicht dabei war."
    ],
    "props": [
      "einen Regenschirm",
      "eine Schublade",
      "ein St\xFCck Kreide",
      "eine Taschenuhr aus Brot",
      "eine Maske",
      "eine Schere",
      "einen Schl\xFCsselbund",
      "ein kleines Bild",
      "eine Feder",
      "ein Glas Wasser",
      "einen Regenschirm ohne Griff",
      "eine Schublade voller Augen",
      "eine Schere und einen Stapel Zeitungen",
      "ein Manifest in f\xFCnf Fassungen",
      "eine N\xE4hmaschine ohne Faden",
      "einen Spiegel, der nach unten h\xE4ngt",
      "eine Kaffeetasse aus Fell"
    ],
    "turns": [
      "die Logik wechselt die Richtung und bleibt dabei g\xFCltig",
      "ein Gegenstand beginnt zu sprechen und wird dabei h\xF6flich",
      "die Szene wiederholt sich, aber mit anderem Wetter",
      "ein Name f\xE4llt aus dem Himmel",
      "die W\xE4nde werden durchl\xE4ssig, aber nur in eine Richtung",
      "die Zeit wird zu einem M\xF6belst\xFCck und steht im Weg",
      "das Unterbewusste unterschreibt und nennt einen fremden Namen",
      "der Zufall wird zur Methode und die Methode zum Zwang",
      "ein Traum liefert das Ende einer Diskussion",
      "der Text schreibt sich weiter, als die Hand aufh\xF6rt",
      "das Bild erkl\xE4rt sich und verliert dabei alles",
      "zwei Dinge treffen sich, die einander nie sahen",
      "der Schlaf gilt pl\xF6tzlich als Arbeit",
      "die Gruppe schlie\xDFt jemanden aus und \xFCbernimmt seine Idee",
      "die Ausstellung wird ein Erfolg, und das ist die Niederlage",
      "ein Wort verliert seinen Gegenstand und wird frei",
      "der Raum tritt zur\xFCck, als jemand ihn betritt",
      "das Protokoll des Traums ist besser als der Traum",
      "ein Gegenstand wechselt den Besitzer, ohne die Hand zu wechseln",
      "die Sitzung endet, weil jemand die Wahrheit gesagt hat",
      "das Bild bekommt einen Titel und wird dadurch harmlos"
    ],
    "obstacles": [
      "die T\xFCr f\xFChrt in eine Zeichnung",
      "die Sprache stolpert \xFCber sich selbst",
      "jemand verlangt Beweise f\xFCr einen Traum",
      "die Treppe endet in einem Satz",
      "ein Schatten l\xE4uft voraus und wartet an der Ecke",
      "die Uhr schmilzt in der Hand",
      "das Fenster weigert sich, hinauszuschauen",
      "die T\xFCr f\xFChrt in eine Zeichnung ohne Tiefe",
      "der Verleger will eine Erkl\xE4rung im Vorwort",
      "die Polizei versteht das Manifest w\xF6rtlich",
      "der Zufall l\xE4sst sich nicht auf Bestellung herstellen",
      "zwei Fassungen des Textes sind gleich gut",
      "das Automatische wird mit der Zeit gekonnt",
      "ein Mitglied nimmt alles ernst",
      "die Galerie verlangt Titel f\xFCr die Bilder",
      "der Traum ist beim Aufwachen schon geordnet",
      "die Gruppe streitet \xFCber einen Halbsatz",
      "niemand kann sagen, wann es fertig ist",
      "die Zeitung druckt es als Witz",
      "der Saal ist erst ab Mitternacht frei",
      "ein Sammler will wissen, was es bedeutet",
      "die zweite Sitzung bringt nur noch Wiederholungen"
    ],
    "stakes": [
      "Der Einsatz ist Realit\xE4t: Sie ist verhandelbar.",
      "Der Einsatz ist Identit\xE4t: Sie wechselt die Masken.",
      "Der Einsatz ist Zeit: Sie ist weich.",
      "Der Einsatz ist Wahrheit: Sie ist ein Bild.",
      "Der Einsatz ist Erwachen: Es k\xF6nnte unm\xF6glich sein.",
      "Der Einsatz ist ein Satz, den niemand geplant hat.",
      "Der Einsatz ist eine Gruppe, die einen Streit nicht \xFCbersteht.",
      "Der Einsatz ist der Zufall, der sich nicht wiederholen l\xE4sst.",
      "Der Einsatz ist eine Ausstellung, die keiner erkl\xE4rt.",
      "Der Einsatz ist der Schlaf als Arbeitszeit."
    ],
    "endings": [
      "Und der Traum unterschrieb mit meinem Namen.",
      "Und als ich erwache, ist der Raum gr\xF6\xDFer.",
      "So bleibt nur der Beweis: ein nasser Schl\xFCssel.",
      "Und die Uhr isst die letzte Minute.",
      "Und die T\xFCr tut, als h\xE4tte sie mich nie gekannt.",
      "Und der Traum unterschreibt mit einem fremden Namen.",
      "So bleibt der nasse Schl\xFCssel als einziger Beweis.",
      "Am Ende h\xE4ngt das Bild verkehrt, und es stimmt.",
      "Und beim Erwachen ist der Raum gr\xF6\xDFer als vorher.",
      "So wird das Protokoll abgeheftet und nie gelesen.",
      "Und die N\xE4hmaschine steht neben dem Regenschirm.",
      "Der Text h\xF6rt auf, wo die Hand m\xFCde wurde.",
      "Und im Caf\xE9 bestellt jemand f\xFCr einen Abwesenden.",
      "So schlie\xDFt die Ausstellung, und niemand fragt nach.",
      "Und die gezeichnete T\xFCr bleibt offen stehen.",
      "Und die Schere liegt auf dem Stapel Zeitungen.",
      "So bleibt die Fotografie mit einer Person zu viel.",
      "Am Ende glaubt der Verleger, es sei ein Scherz."
    ],
    "verwandlungen": [
      "Traum\u2192Bericht",
      "T\xFCr\u2192Wand",
      "Uhr\u2192Waage",
      "Spiegel\u2192Schatten",
      "Zimmer\u2192Grab",
      "Bild\u2192Fenster"
    ]
  },
  "transzendenz": {
    "motifs": [
      "eine Stimme, die von nirgendwo kommt",
      "ein Atem, der gr\xF6\xDFer ist als der K\xF6rper",
      "ein Gedanke ohne Denkenden",
      "eine Schwelle ohne T\xFCr",
      "ein Wei\xDF, das alle Farben enth\xE4lt",
      "eine Weite hinter geschlossenen Augen",
      "eine Haut, die nicht mehr trennt",
      "ein Licht, das keine Quelle braucht",
      "ein Klang, der vor dem H\xF6ren schon da ist",
      "ein Punkt, in dem alles zusammenf\xE4llt",
      "ein Raum, in dem das Echo l\xE4nger bleibt als der Ton",
      "eine Schwelle, die man \xFCberschritten hat, ohne es zu merken",
      "eine Landschaft, die niemanden voraussetzt",
      "ein Wort, das sich beim Aussprechen aufl\xF6st",
      "ein Wasser, das keine Oberfl\xE4che hat",
      "ein Weg, der endet, ohne aufzuh\xF6ren",
      "eine Nacht, in der nichts fehlt"
    ],
    "hooks": [
      "der eigene Name klingt pl\xF6tzlich geliehen",
      "die Stille hat auf einmal einen Klang",
      "etwas antwortet, ohne zu sprechen",
      "die H\xE4nde liegen still und arbeiten doch",
      "im Spiegel steht jemand, der nichts behauptet",
      "die Luft tr\xE4gt mehr, als sie wiegt",
      "das Ich r\xFCckt einen Schritt zur Seite",
      "Der eigene Name klingt an diesem Morgen geliehen.",
      "Die Stille hat einen Klang bekommen, seit gestern.",
      "Etwas antwortet, und es wird nichts gesagt.",
      "Der Atem geht weiter, und niemand f\xFChrt ihn.",
      "Ein Gedanke kommt, und es ist keiner da, der denkt.",
      "Das Licht im Zimmer \xE4ndert sich ohne Grund.",
      "Die Frage steht im Raum und hat keinen Fragenden mehr.",
      "Jemand betet und merkt, dass er zuh\xF6rt.",
      "Der Weg ist zu Ende, und er geht weiter.",
      "Ein Satz aus einem Buch trifft ohne Umweg."
    ],
    "props": [
      "eine Schale ohne Boden",
      "ein Tuch aus ungef\xE4rbtem Leinen",
      "einen Stein, warm ohne Sonne",
      "eine Kerze, die niemand entz\xFCndet hat",
      "ein Buch mit leeren Seiten",
      "eine Glocke ohne Kl\xF6ppel",
      "einen Spiegel ohne Bild",
      "einen Faden ohne Ende",
      "eine Feder, die nicht f\xE4llt",
      "eine Schwelle aus abgetretenem Holz",
      "eine Kerze, die nicht flackert",
      "ein Buch mit einer leeren Seite",
      "einen Krug, der immer halb steht",
      "eine Bank an einer Mauer",
      "ein Fenster ohne Rahmen",
      "eine Decke f\xFCr die kalten Stunden",
      "einen Napf mit Regenwasser",
      "ein Seil, das an nichts befestigt ist"
    ],
    "turns": [
      "die Grenze zwischen innen und au\xDFen wird durchl\xE4ssig",
      "das Wort reicht nicht mehr und h\xF6rt auf",
      "die Frage verliert ihren Fragenden",
      "aus Suchen wird Stillhalten",
      "das Einzelne wird durchsichtig",
      "die Antwort kommt vor der Frage",
      "das Ich l\xF6st sich, ohne zu verschwinden",
      "das Suchen h\xF6rt auf, und es fehlt nichts",
      "was gesucht wurde, war die ganze Zeit das Suchen",
      "die Erfahrung kommt und l\xE4sst sich nicht behalten",
      "er will es beschreiben und macht es damit kleiner",
      "die Zeit steht nicht still, sie wird gleichg\xFCltig",
      "das Ich meldet sich zur\xFCck und st\xF6rt nicht mehr",
      "ein Zweifel kommt und findet nichts zum Zweifeln",
      "die Stille wird laut und dann wieder still",
      "das Licht kommt von innen und ist dasselbe",
      "ein Lehrer sagt nichts, und es gen\xFCgt",
      "er kehrt in den Alltag zur\xFCck und bringt nichts mit",
      "ein gew\xF6hnlicher Gegenstand steht pl\xF6tzlich f\xFCr sich allein",
      "die Angst vor dem Verschwinden verschwindet zuerst",
      "der Unterschied zwischen H\xF6ren und Geh\xF6rtwerden f\xE4llt weg",
      "jemand fragt nach dem Weg, und der Weg ist die Antwort",
      "was gestern wichtig war, ist heute nur noch da"
    ],
    "obstacles": [
      "jede Beschreibung verfehlt es",
      "das Suchen selbst steht im Weg",
      "die Sprache kehrt immer zum Sprecher zur\xFCck",
      "wer es festh\xE4lt, verliert es",
      "der Verstand verlangt einen Beweis",
      "die Gewohnheit zieht zur\xFCck ins Vertraute",
      "die Erfahrung l\xE4sst sich nicht wiederholen",
      "wer davon erz\xE4hlt, hat es schon verlassen",
      "der Alltag beginnt am n\xE4chsten Morgen wieder",
      "ein Beweis w\xFCrde alles zerst\xF6ren",
      "die anderen wollen eine Erkl\xE4rung h\xF6ren",
      "das Ged\xE4chtnis macht daraus eine Geschichte",
      "wer es festh\xE4lt, h\xE4lt nur die Erinnerung",
      "die \xDCbung gelingt nicht auf Verlangen",
      "der Zweifel kommt zuverl\xE4ssig am dritten Tag",
      "es gibt kein Zeichen, an dem man es pr\xFCft",
      "das gro\xDFe Wort ist besetzt und steht im Weg",
      "der Tag hat zu viele Verabredungen f\xFCr so etwas",
      "die Worte der anderen holen ihn sofort zur\xFCck",
      "ein Buch beschreibt es, und die Beschreibung stimmt nicht",
      "wer es sucht, hat es damit schon verstellt",
      "die Ruhe im Haus h\xE4lt nur bis zum Mittag",
      "der K\xF6rper meldet sich nach der zweiten Stunde"
    ],
    "stakes": [
      "Der Einsatz ist Gewissheit: ohne jeden Beweis.",
      "Der Einsatz ist ein Ich, das nichts mehr behauptet.",
      "Der Einsatz ist die Sprache, die zur\xFCcktreten muss.",
      "Der Einsatz ist ein Augenblick, der alle anderen enth\xE4lt.",
      "Der Einsatz ist alles, was man zu wissen glaubt.",
      "Der Einsatz ist ein Morgen, an dem nichts fehlt.",
      "Der Einsatz ist die Frage, ob jemand zuh\xF6rt.",
      "Der Einsatz ist ein Satz, der nicht gesagt werden kann."
    ],
    "endings": [
      "So bleibt nur das Licht, das keiner entz\xFCndet hat.",
      "Und die Stille h\xE4lt, was kein Wort versprochen hat.",
      "So endet das Suchen, ohne dass etwas gefunden ist.",
      "Am Ende steht kein Satz, nur ein Atemzug.",
      "So schlie\xDFt sich der Raum, der nie einer war.",
      "Und der Atem geht weiter, ohne dass jemand ihn f\xFChrt.",
      "So bleibt die Schale stehen, leer und voll.",
      "Und am Morgen beginnt der Alltag p\xFCnktlich.",
      "Der Weg h\xF6rt auf, und niemand ist angekommen.",
      "Und das Wort bleibt ungesagt und stimmt.",
      "So bleibt es dabei: Es war und l\xE4sst sich nicht sagen.",
      "Und die Bank an der Mauer steht am n\xE4chsten Tag noch.",
      "Und die Kerze brennt ruhig weiter, ohne zu flackern.",
      "So bleibt das Buch bei der leeren Seite aufgeschlagen.",
      "Am Ende ist nichts gefunden und nichts verloren.",
      "Und der Krug steht halb voll auf der Bank."
    ],
    "verwandlungen": [
      "Licht\u2192Ger\xFCcht",
      "Weg\u2192Faden",
      "Wort\u2192Zeichen",
      "Nacht\u2192Decke",
      "Atem\u2192Faden"
    ]
  },
  "melville": {
    "motifs": [
      "ein Meer wie ein Gedanke ohne Ende",
      "ein Walr\xFCcken im Nebel",
      "eine Linie am Horizont, die nicht stillh\xE4lt",
      "ein Harpunenseil wie ein Schicksalsfaden",
      "Salz auf den Lippen wie eine Predigt",
      "ein Logbuch voller Fragen",
      "ein Sternbild, das sich verschiebt",
      "eine Planke, die nach \xD6l riecht",
      "Wind, der Namen tr\xE4gt",
      "Tiefe, die antwortlos bleibt",
      "ein Schiff, das seinen Kurs vergisst",
      "Tran in F\xE4ssern, der noch atmet",
      "eine Narbe quer \xFCber das Deck",
      "der Name eines Schiffes, das nie zur\xFCckkam",
      "ein Wal, der zur\xFCckschaut",
      "Salz in jeder Naht",
      "ein Gebet, das gegen den Wind gesagt wird",
      "die Ruhe vor der Ruhe",
      "ein leerer Haken am Beiboot",
      "Knochen als Zierrat an der Reling",
      "eine Karte mit wei\xDFen Feldern",
      "das Wasser, das keine Spur beh\xE4lt",
      "ein Mannschaftsbuch mit gestrichenen Namen",
      "der Wachwechsel um vier Uhr",
      "eine K\xFCste, die sich nicht n\xE4hert",
      "ein Mast ohne Wimpel"
    ],
    "hooks": [
      "Ich trete an Deck, als w\xE4re es ein Urteil.",
      "Der Ozean liegt da wie ein Gesetz, das niemand erkl\xE4rt.",
      "Ein Schatten unter der Oberfl\xE4che macht die Welt schwer.",
      "Der Wind spricht, aber nicht zu uns.",
      "Wir fahren, als jagten wir einem Gedanken nach.",
      "Das Wasser gl\xE4nzt, als h\xE4tte es einen Willen.",
      "Ein Ruf geht \xFCber die See und kommt ver\xE4ndert zur\xFCck.",
      "Wir laufen aus, ohne dass jemand winkt.",
      "Der Kapit\xE4n spricht seit drei Tagen nicht mehr.",
      "Ein Vogel setzt sich auf die Rah und bleibt.",
      "Die F\xE4sser sind leer und der R\xFCckweg lang.",
      "Im Logbuch fehlt eine Seite.",
      "Das Wasser liegt still, und das ist das Schlimmste.",
      "Einer sieht etwas und sagt nichts.",
      "Der Ausguck ruft, aber niemand r\xFChrt sich.",
      "Ein \xD6llicht brennt unter Deck, obwohl alle schlafen.",
      "Die K\xFCste verschwindet schneller als gedacht.",
      "Jemand hat die Namen an der Tafel ge\xE4ndert."
    ],
    "props": [
      "eine Harpune",
      "ein Logbuch",
      "ein Messingfernrohr",
      "einen Kompass",
      "eine \xD6l-Laterne",
      "ein St\xFCck Tauwerk",
      "ein Seekartenfragment",
      "einen geschnitzten Anh\xE4nger",
      "eine Pfeife",
      "einen Schiffssextanten",
      "ein Fass Tran",
      "eine Kette aus Walknochen",
      "einen Kaj\xFCtenschl\xFCssel",
      "ein Segeltuch mit Flicken",
      "eine Seekarte ohne Rand",
      "ein Beil f\xFCr das Seil",
      "eine \xD6llampe unter Deck",
      "einen Schleifstein",
      "ein Gebetbuch mit Salzr\xE4ndern",
      "eine Wetterfahne aus Blech",
      "einen Nagel aus dem Hauptmast",
      "ein Netz voller leerer Muscheln",
      "ein Lot an langer Leine",
      "einen Zwieback aus der Vorratskiste"
    ],
    "turns": [
      "das Ziel wird zum Spiegel",
      "die Jagd verschiebt die Seele",
      "der Nebel tr\xE4gt eine Gestalt",
      "ein Zeichen erscheint im Schaum",
      "die Mannschaft wird zu Stimmen im Wind",
      "das Meer verlangt einen Preis",
      "der Kurs f\xFChrt nach innen",
      "der Kurs wird zur Frage",
      "ein Name f\xE4llt und alle schweigen",
      "die Mannschaft teilt sich ohne ein Wort",
      "das Meer wird glatt wie Blech",
      "ein Zeichen an der Bordwand erscheint zweimal",
      "der Kapit\xE4n legt die Karte weg",
      "das Boot kehrt ohne einen Mann zur\xFCck",
      "der Wal taucht dort auf, wo er nicht sein kann",
      "die Jagd verkehrt sich in Flucht",
      "das Logbuch beginnt zu l\xFCgen",
      "die See gibt etwas zur\xFCck",
      "der Wind kommt aus der falschen Richtung zur\xFCck"
    ],
    "obstacles": [
      "der Nebel l\xF6scht Entfernungen",
      "der Wind dreht ohne Warnung",
      "das Seil zieht wie eine Entscheidung",
      "ein Sturm ohne Rand",
      "die Nacht frisst die Sterne",
      "ein Aberglaube w\xE4chst wie Schimmel",
      "die Tiefe bleibt stumm",
      "die Flaute h\xE4lt l\xE4nger als der Vorrat",
      "ein Riss l\xE4uft durch den Rumpf",
      "niemand will die erste Wache",
      "das Trinkwasser schmeckt nach Eisen",
      "der Kurs f\xFChrt an keiner K\xFCste vorbei",
      "die Harpune findet kein Ziel",
      "ein Mann geht \xFCber Bord und niemand sieht wohin",
      "der Kapit\xE4n gibt keinen Grund an",
      "das Seil ist zu kurz f\xFCr die Tiefe",
      "der Nebel bleibt drei Tage",
      "die Ladung rutscht bei jeder Welle"
    ],
    "stakes": [
      "Der Einsatz ist Sinn: Er k\xF6nnte nicht existieren.",
      "Der Einsatz ist Hingabe: Sie wird zur Besessenheit.",
      "Der Einsatz ist Leben: Es ist nur Material f\xFCr die See.",
      "Der Einsatz ist Wahrheit: Sie ist so gro\xDF wie der Ozean.",
      "Der Einsatz ist Heimkehr: Sie wird zu einer Legende.",
      "Der Einsatz ist die Mannschaft: Sie folgt oder sie bleibt.",
      "Der Einsatz ist die Heimkehr: Sie war nie versprochen.",
      "Der Einsatz ist der Vorrat: Er reicht bis zur Umkehr, nicht weiter.",
      "Der Einsatz ist der Eid: Er gilt auch gegen die Vernunft.",
      "Der Einsatz ist ein Name im Logbuch: gestrichen oder gehalten.",
      "Der Einsatz ist der Grund der Fahrt: Er geh\xF6rt einem allein.",
      "Der Einsatz ist das Schiff, das mehr wert ist als alle darauf."
    ],
    "endings": [
      "Und das Meer bleibt, wie es ist.",
      "Und wir begreifen, dass die Jagd uns jagt.",
      "So endet es im Nebel, nicht im Sieg.",
      "Und der Horizont tut, als h\xE4tte er nichts gesehen.",
      "Und das Logbuch schlie\xDFt sich wie ein Gebet.",
      "Und das Logbuch schlie\xDFt mit einer leeren Zeile.",
      "So kehrt das Schiff zur\xFCck, aber nicht die Fahrt.",
      "Am Ende tr\xE4gt das Wasser nur den Namen weiter.",
      "Und der Ausguck bleibt besetzt, obwohl nichts mehr kommt.",
      "So bleibt die Tiefe, was sie war.",
      "Und einer erz\xE4hlt es, damit es einer erz\xE4hlt.",
      "Der Kurs steht noch an der Tafel, das Schiff nicht mehr.",
      "Und das Salz bleibt in der Naht."
    ],
    "verwandlungen": [
      "Harpune\u2192Feder",
      "Wal\u2192Berg",
      "Schiff\u2192Haus",
      "Nebel\u2192Rauch",
      "Seil\u2192Band",
      "Kapit\xE4n\u2192Vater",
      "Meer\u2192Feld",
      "Logbuch\u2192Gebetbuch",
      "K\xFCste\u2192Grenze",
      "Deck\u2192Dach"
    ]
  },
  "formalismus": {
    "motifs": [
      "eine Regel ohne Ausnahme",
      "eine Definition mit Fu\xDFnote",
      "ein Paragraph mit Randbemerkung",
      "ein System aus Nummern",
      "eine Hierarchie aus Zeichen",
      "ein Schema mit Leerstellen",
      "eine Vorschrift mit impliziter Klausel",
      "eine Ordnung ohne Ursprung",
      "ein Verfahren ohne Subjekt",
      "eine Struktur mit blinden Punkten",
      "ein Regelwerk, das seine eigene \xC4nderung regelt",
      "eine Definition, die auf eine zweite verweist",
      "ein Paragraph mit drei Abs\xE4tzen und vier Ausnahmen",
      "eine Fu\xDFnote, die den Haupttext aufhebt",
      "ein Formblatt, dessen Felder einander ausschlie\xDFen",
      "ein Kommentar, der l\xE4nger ist als das Gesetz",
      "ein Beweis, der eine Annahme braucht"
    ],
    "hooks": [
      "der Sachverhalt steht in Abschnitt eins und stimmt nicht mehr",
      "Definition A wird angewendet, obwohl Definition B gemeint war",
      "gem\xE4\xDF Regel 3.2 ist der Fall nicht vorgesehen",
      "die Ordnung gilt, und niemand wei\xDF mehr wof\xFCr",
      "es wird festgestellt, was ohnehin niemand bestritten hat",
      "die Zust\xE4ndigkeit ist gekl\xE4rt und liegt bei niemandem",
      "ein Protokoll beginnt mit einem Satz aus einem anderen Fall",
      "der Vorgang wird er\xF6ffnet, bevor der Antrag da ist",
      "Absatz zwei widerspricht Absatz eins, seit der \xC4nderung.",
      "Die Definition wurde ersetzt, der Verweis nicht.",
      "Eine Ausnahme wird angewendet, die niemand mehr kennt.",
      "Der Kommentar von 1974 gilt weiter, das Gesetz nicht.",
      "Zwei Fassungen tragen dasselbe Datum.",
      "Ein Verweis f\xFChrt auf eine Vorschrift ohne Text.",
      "Die \xC4nderung tritt r\xFCckwirkend in Kraft.",
      "Ein Begriff wird definiert und danach anders benutzt.",
      "Das Verzeichnis nennt sich selbst an dritter Stelle.",
      "Die Unterschrift fehlt, und der Vorgang l\xE4uft weiter."
    ],
    "props": [
      "ein Dokument",
      "eine Akte",
      "einen Vermerk",
      "eine Tabelle",
      "ein Siegel",
      "eine Fu\xDFnote",
      "eine Nummer",
      "ein Formular",
      "eine Unterschrift",
      "eine Registratur",
      "ein Regelwerk in der dritten Fassung",
      "einen Kommentar mit eingelegten Zetteln",
      "ein Formblatt mit einem gestrichenen Feld",
      "eine Loseblattsammlung im Ordner",
      "einen Stempel f\xFCr die G\xFCltigkeit",
      "ein Verzeichnis der \xC4nderungen",
      "eine Fu\xDFnote auf einem eigenen Blatt",
      "einen Vermerk in roter Tinte"
    ],
    "turns": [
      "die Regel widerspricht sich selbst und bleibt in Kraft",
      "ein Absatz wird gestrichen und in der Fu\xDFnote fortgef\xFChrt",
      "die Definition verschiebt ihre Bedeutung von Fassung zu Fassung",
      "die Hierarchie kippt, und die Fu\xDFnote steht oben",
      "die Klausel wird w\xF6rtlich genommen und dadurch unbrauchbar",
      "die Ausnahme wird zur Norm und beh\xE4lt ihren Namen",
      "ein Verweis f\xFChrt ins Leere und wird trotzdem zitiert",
      "die Ausnahme wird h\xE4ufiger angewendet als die Regel",
      "der Kommentar wird zur eigentlichen Vorschrift",
      "eine L\xFCcke wird geschlossen und \xF6ffnet zwei neue",
      "die Auslegung \xE4ndert sich, ohne dass sich der Text \xE4ndert",
      "der Fall passt genau und ist trotzdem nicht gemeint",
      "die Form ist gewahrt, und die Sache geht verloren",
      "ein Verweis f\xFChrt im Kreis, und niemand merkt es",
      "die \xC4nderung gilt ab einem Datum in der Vergangenheit",
      "zwei Instanzen legen denselben Satz gegens\xE4tzlich aus",
      "die Ordnung h\xE4lt, weil niemand sie pr\xFCft",
      "ein Begriff bekommt eine Legaldefinition und stirbt",
      "ein Vermerk wird zur Grundlage einer Entscheidung",
      "die Registratur findet den Vorgang unter einer fremden Nummer",
      "der Pr\xFCfer beanstandet die Form und lobt die Sache",
      "eine Vorschrift wird aufgehoben und weiter angewendet",
      "die Loseblattsammlung ist auf dem Stand von 1998"
    ],
    "obstacles": [
      "die Zust\xE4ndigkeit ist unklar und wird nicht gekl\xE4rt",
      "ein Dokument fehlt, und ohne es geht nichts weiter",
      "die Signatur ist ung\xFCltig, seit die Vorschrift ge\xE4ndert wurde",
      "ein Absatz ist doppeldeutig, und beide Lesarten sind zul\xE4ssig",
      "die Definition ist nicht abschlie\xDFend und gilt trotzdem",
      "der Begriff ist nicht normiert und entscheidet den Fall",
      "der Text ist eindeutig und trifft den Fall nicht",
      "die Frist beginnt mit einem Ereignis ohne Datum",
      "die Fassung im Umlauf ist nicht die geltende",
      "eine Ausnahme setzt eine Genehmigung voraus",
      "die Begr\xFCndung darf nicht mitgeteilt werden",
      "der Kommentar ist vergriffen",
      "zwei Regeln gelten gleichzeitig und schlie\xDFen sich aus",
      "die Auslegung ist strittig und wird nicht entschieden",
      "das Verzeichnis ist auf dem Stand von vorletztem Jahr",
      "die \xC4nderung wurde beschlossen und nicht ver\xF6ffentlicht",
      "wer fragt, l\xF6st eine Pr\xFCfung aus",
      "die \xC4nderung liegt bei, ist aber nicht eingeheftet",
      "niemand wei\xDF, welche Fassung im Streitfall gilt",
      "das Formblatt verlangt zwei Angaben, die sich ausschlie\xDFen",
      "die Zust\xE4ndigkeit wechselt mit dem Anfangsbuchstaben",
      "die Frist ist gewahrt und der Antrag trotzdem versp\xE4tet",
      "der Vordruck ist vergriffen und wird neu gedruckt"
    ],
    "stakes": [
      "Der Einsatz ist die G\xFCltigkeit einer einzigen Unterschrift.",
      "Der Einsatz ist die Eindeutigkeit eines Satzes, den viele lesen.",
      "Der Einsatz ist eine Ordnung, die niemand einzeln pr\xFCfen kann.",
      "Der Einsatz ist die Ordnung, die an einer Fu\xDFnote h\xE4ngt.",
      "Der Einsatz ist eine Frist, die schon begonnen hat.",
      "Der Einsatz ist ein Begriff und was er ausschlie\xDFt.",
      "Der Einsatz ist die Form gegen die Sache."
    ],
    "endings": [
      "Damit ist der Vorgang abgeschlossen und die Frage offen.",
      "Die Ordnung bleibt bestehen, in der dritten Fassung.",
      "Der Sachverhalt ist festgestellt, und mehr war nicht gefragt.",
      "Der Fall gilt als entschieden, solange niemand widerspricht.",
      "Die Regel bleibt in Kraft, gegen ihren eigenen Wortlaut.",
      "Und der Kommentar wird um einen Absatz erg\xE4nzt.",
      "So gilt die Regel weiter, gegen ihren Wortlaut.",
      "Und die Fu\xDFnote \xFCberlebt den Haupttext.",
      "Der Vermerk kommt zu den Akten, in roter Tinte.",
      "Und niemand \xE4ndert, was sich eingespielt hat.",
      "So bleibt der Verweis im Kreis, g\xFCltig.",
      "Und die n\xE4chste Fassung erscheint im Fr\xFChjahr.",
      "Und die Registratur legt den Vorgang unter R ab.",
      "So bleibt das Formblatt unausgef\xFCllt in der Mappe.",
      "Am Ende tr\xE4gt der Stempel ein Datum und keinen Namen.",
      "Und die Loseblattsammlung w\xE4chst um vier Blatt."
    ],
    "verwandlungen": [
      "Regel\u2192Gewohnheit",
      "Akte\u2192Mappe",
      "Stempel\u2192Riegel",
      "Frist\u2192Schnur"
    ]
  },
  "christentum": {
    "motifs": [
      "ein Kreuz aus Licht \xFCber einer leeren Stra\xDFe",
      "eine brennende Kerze ohne Docht",
      "ein Kelch, der Sternbilder spiegelt",
      "ein Stein, der vor einem Grab atmet",
      "eine Dornenkrone aus Glas",
      "eine Taube, die durch Mauern fliegt",
      "ein Fisch aus Schatten im Wasser",
      "eine Leiter zwischen Wolken und Staub",
      "eine Hand mit einem Wundmal aus Gold",
      "eine T\xFCr ohne Klinke in einer Kapelle",
      "eine Kirche, in der es k\xE4lter ist als drau\xDFen",
      "ein Beichtstuhl mit abgewetztem Holz",
      "eine Prozession, die durch nasse Felder zieht",
      "ein Altarbild, dessen Farbe abbl\xE4ttert",
      "ein Kreuz an einer Weggabelung im Feld",
      "ein Glockenseil, das jemand jeden Tag zieht",
      "eine Bibel mit Zetteln zwischen den Seiten",
      "ein Gasthaus, das niemanden abweist",
      "ein Kirchhof, auf dem die Namen verwittern",
      "ein Kelch, den viele H\xE4nde abgegriffen haben",
      "eine Kerze, die f\xFCr jemand anderen brennt",
      "ein Brotlaib, geteilt f\xFCr mehr Leute als da sind"
    ],
    "hooks": [
      "Das Licht f\xE4llt nicht vom Himmel, sondern aus meinem Mund.",
      "Die Glocken l\xE4uten r\xFCckw\xE4rts.",
      "Ich knie, und der Boden antwortet.",
      "Ein Gleichnis steht pl\xF6tzlich im Raum.",
      "Der Wind roch nach Weihrauch und Regen.",
      "Ein Engel verwechselt meinen Namen.",
      "Das Brot zerbricht, bevor ich es ber\xFChre.",
      "Die Glocke l\xE4utet zur falschen Stunde.",
      "Ein Fremder bittet an der Pforte um ein Nachtlager.",
      "Der Beichtstuhl bleibt heute den ganzen Tag leer.",
      "Ein Kind stellt eine Frage, die niemand beantwortet.",
      "Das Altarbild hat \xFCber Nacht einen Riss bekommen.",
      "Der Pfarrer liest eine Stelle und liest sie noch einmal.",
      "Jemand betet f\xFCr einen, der es nicht verdient hat.",
      "Im Opferstock liegt mehr, als das Dorf hat.",
      "Ein Name wird von der Kanzel genannt und nicht erkl\xE4rt.",
      "Die Prozession geht, und der Regen h\xF6rt nicht auf.",
      "Ein Gel\xFCbde wird gegeben, ohne dass jemand zuh\xF6rt.",
      "Der Kirchhof bekommt ein Grab ohne Stein."
    ],
    "props": [
      "eine Kerze",
      "einen Rosenkranz",
      "eine Bibel",
      "einen Kelch",
      "ein St\xFCck Brot",
      "einen silbernen Fisch",
      "eine wei\xDFe Lilie",
      "ein kleines Holzkreuz",
      "eine Tonschale",
      "ein Tuch",
      "einen Rosenkranz aus dunklem Holz",
      "eine Bibel mit Zetteln zwischen den Seiten",
      "einen Kelch mit abgegriffenem Fu\xDF",
      "ein St\xFCck Brot vom Altar",
      "eine Kerze f\xFCr einen Abwesenden",
      "ein Messgewand mit ausgebesserter Naht",
      "einen Schl\xFCssel zur Sakristei",
      "ein Weihrauchfass an einer Kette",
      "eine Liste mit den Namen der Armen",
      "einen Krug mit Wasser aus dem Brunnen"
    ],
    "turns": [
      "das Gleichnis wird w\xF6rtlich",
      "ein Wunder geschieht im Nebensatz",
      "der Zweifel spricht lauter als der Glaube",
      "das Licht wechselt die Quelle",
      "ein Opfer wird zur Umarmung",
      "der Himmel antwortet in Stille",
      "der Stein beginnt zu rollen",
      "das Gleichnis wird w\xF6rtlich, und niemand lacht mehr",
      "ein Wunder geschieht im Nebensatz und wird \xFCbersehen",
      "der Zweifel spricht lauter als der Glaube und beh\xE4lt recht",
      "das Licht wechselt die Quelle, und niemand merkt es",
      "ein Opfer wird zur Umarmung, im letzten Augenblick",
      "die Vergebung trifft den Falschen und wirkt trotzdem",
      "der Pfarrer glaubt weniger als seine Gemeinde",
      "ein Fremder kennt die Antwort auf die Frage des Kindes",
      "der Verrat sitzt am Tisch und isst mit",
      "die Gemeinde entscheidet gegen den Buchstaben",
      "das Gebet wird erh\xF6rt, aber anders",
      "ein Gel\xFCbde bindet \xFCber den Tod hinaus",
      "die Armenliste wird l\xE4nger als die Gemeinde",
      "das Brot reicht, und niemand kann es erkl\xE4ren"
    ],
    "obstacles": [
      "der Glaube verlangt einen Sprung",
      "ein Zeichen bleibt aus",
      "der Verrat steht am Tisch",
      "die Menge ruft nach Beweisen",
      "der Himmel schweigt",
      "das Wasser tr\xE4gt nicht",
      "das Grab bleibt verschlossen",
      "der Glaube verlangt einen Sprung ohne Boden",
      "ein Zeichen bleibt aus, und das Warten geht weiter",
      "die Menge ruft nach Beweisen und nicht nach Trost",
      "der Himmel schweigt genau in dieser Woche",
      "der Winter kommt, und der Opferstock ist leer",
      "das Gesetz der Kirche steht gegen das Gebot",
      "niemand will den Fremden im eigenen Haus",
      "der Bischof entscheidet aus einer anderen Stadt",
      "die Prozession f\xE4llt aus, zum ersten Mal seit hundert Jahren",
      "die Sakristei ist verschlossen und der Schl\xFCssel fort",
      "ein Sterbender verlangt jemanden, der nicht kommt",
      "das Dorf zahlt den Zehnten nicht mehr",
      "die Antwort steht im Buch und hilft nicht",
      "wer vergibt, gilt als schwach"
    ],
    "stakes": [
      "Der Einsatz ist Erl\xF6sung: Sie kostet alles.",
      "Der Einsatz ist Vergebung: Sie ist unverdient.",
      "Der Einsatz ist Glaube: Er sieht ohne Augen.",
      "Der Einsatz ist Liebe: Sie opfert sich.",
      "Der Einsatz ist Auferstehung: Sie widerspricht der Logik.",
      "Der Einsatz ist eine Vergebung, die niemand verdient hat.",
      "Der Einsatz ist ein Nachtlager f\xFCr einen Fremden.",
      "Der Einsatz ist der Winter f\xFCr die Armen der Gemeinde.",
      "Der Einsatz ist ein Glaube, der ohne Zeichen auskommt.",
      "Der Einsatz ist ein Name, den man von der Kanzel nennt.",
      "Der Einsatz ist ein Grab in geweihter Erde.",
      "Der Einsatz ist die Frage, ob das Brot reicht."
    ],
    "endings": [
      "Und das Licht bleibt, auch ohne Sonne.",
      "Und der Stein ist leichter als mein Herz.",
      "Und ich gehe, als h\xE4tte ich Fl\xFCgel.",
      "Und das Brot reicht f\xFCr alle.",
      "Und der Himmel \xF6ffnet sich nach innen.",
      "Und das Licht bleibt, auch als die Kerze aus ist.",
      "So wird die Glocke am Morgen wieder gezogen.",
      "Am Ende liegt ein Stein vor dem Grab, oder nicht.",
      "Und der Kelch steht im Schrank bis zum Sonntag.",
      "So geht die Prozession im Regen zu Ende.",
      "Und der Fremde ist am Morgen fort.",
      "Der Kirchhof nimmt einen Namen mehr auf.",
      "Und das Brot reicht, und niemand rechnet nach.",
      "So bleibt die Frage des Kindes im Raum stehen.",
      "Und im Opferstock liegt am Sonntag wieder etwas."
    ],
    "verwandlungen": [
      "Kerze\u2192Asche",
      "Kreuz\u2192Zeichen",
      "Glocke\u2192Stimme",
      "Brot\u2192Pfand",
      "Kelch\u2192Krug",
      "Grab\u2192Bett",
      "Kirche\u2192Halle",
      "Zweifel\u2192Verdacht"
    ]
  },
  "koran": {
    "motifs": [
      "eine Schrift aus Licht auf schwarzem Wasser",
      "ein Halbmond, der im Sand pulsiert",
      "eine W\xFCste, die fl\xFCstert",
      "ein Brunnen, der Sterne spiegelt",
      "ein Gebetsteppich, der sich wiegt",
      "eine Stimme ohne K\xF6rper",
      "eine Waage aus Wind",
      "ein Garten hinter einer unsichtbaren Mauer",
      "eine Laterne ohne Flamme",
      "ein Siegel aus Licht auf der Stirn",
      "ein Hof, in dem f\xFCnfmal am Tag Wasser l\xE4uft",
      "eine Handschrift, deren R\xE4nder Gold tragen",
      "eine Karawane, die vor Sonnenaufgang aufbricht",
      "ein Brunnen, der eine Stadt getragen hat",
      "eine Stimme, die einen Vers tr\xE4gt, ohne ihn zu lesen",
      "ein Datum, das jedes Jahr elf Tage wandert",
      "eine Nische, die nach S\xFCden zeigt",
      "ein Schatten, der zur Gebetszeit die L\xE4nge wechselt"
    ],
    "hooks": [
      "Die Worte kommen wie Regen in der Nacht.",
      "Der Ruf erreicht mich vor meinem Namen.",
      "Ich wasche meine H\xE4nde, und die Zeit wird klar.",
      "Die W\xFCste \xF6ffnet ein Auge.",
      "Ein Vers steht im Sand.",
      "Die Stille hat einen Rhythmus.",
      "Der Wind spricht arabisch.",
      "Der Ruf kommt, und die Arbeit bleibt liegen.",
      "Ein Fremder kennt den Vers und nicht die Sprache.",
      "Der Brunnen im Hof gibt seit Tagen weniger Wasser.",
      "Ein Kind rezitiert eine Stelle und stockt an derselben.",
      "Die Karawane bricht auf, und einer bleibt zur\xFCck.",
      "Ein Gast kommt, und die Vorr\xE4te reichen nicht f\xFCr drei Tage.",
      "Der Schatten steht falsch f\xFCr diese Jahreszeit.",
      "Jemand bittet um eine Auskunft, die niemand geben darf.",
      "Der Lehrer schweigt an einer Stelle, die er sonst erkl\xE4rt.",
      "Ein Schreiber l\xE4sst ein Wort aus und merkt es zu sp\xE4t."
    ],
    "props": [
      "einen Gebetsteppich",
      "eine Gebetskette",
      "eine Schale mit Wasser",
      "eine Dattel",
      "eine Laterne",
      "ein St\xFCck Pergament",
      "eine Feder",
      "einen Kompass",
      "ein Tuch",
      "einen Ring",
      "einen Gebetsteppich mit ausgetretener Mitte",
      "eine Schale mit Wasser f\xFCr den Gast",
      "ein Blatt mit Goldrand",
      "eine Rohrfeder und ein Tintenfass",
      "einen Krug f\xFCr die Waschung",
      "ein B\xFCndel Datteln f\xFCr den Weg",
      "eine Karte der Brunnen"
    ],
    "turns": [
      "ein Vers ver\xE4ndert die Richtung",
      "die Waage neigt sich unsichtbar",
      "das Herz wird Richter",
      "die W\xFCste wird zum Garten",
      "eine Pr\xFCfung wird zur Gabe",
      "die Schrift beginnt zu leuchten",
      "die Stille antwortet",
      "ein Vers ver\xE4ndert die Richtung eines ganzen Tages",
      "die Waage neigt sich, und niemand hat sie ber\xFChrt",
      "das Herz wird zum Richter \xFCber die Auskunft",
      "der Gast erweist sich als der, den man suchte",
      "die Geduld reicht bis zum letzten Tag der Pr\xFCfung",
      "ein Wort wird ausgelassen und \xE4ndert den Sinn nicht",
      "die Karawane kehrt um, und das rettet sie",
      "der Lehrer gibt zu, dass er es nicht wei\xDF",
      "ein Schuldner wird entlassen, und niemand erf\xE4hrt es",
      "der Brunnen gibt wieder, nach vier Tagen",
      "die Antwort steht im Buch und wird anders gelesen",
      "ein Streit endet, weil einer zuerst gr\xFC\xDFt",
      "der Weg ist schmal und wird an einer Stelle breit",
      "die Pr\xFCfung kommt ohne Warnung und geht ohne Erkl\xE4rung",
      "ein Vers, der oft gelesen wurde, meint heute etwas anderes",
      "der Schreiber setzt das Wort ein und l\xE4sst den Rand frei"
    ],
    "obstacles": [
      "der Zweifel trocknet die Zunge",
      "der Weg verliert seine Spuren",
      "eine Pr\xFCfung kommt ohne Warnung",
      "die Nacht scheint endlos",
      "ein Vers bleibt unverst\xE4ndlich",
      "das Herz ist verschlossen",
      "die Geduld rei\xDFt",
      "der Zweifel trocknet die Zunge in der Mitte des Verses",
      "der Weg verliert seine Spuren nach dem Sandsturm",
      "der Brunnen ist versandet, der n\xE4chste zwei Tage entfernt",
      "die Karawane wartet nicht auf einen einzelnen",
      "die Schrift ist an drei Stellen verblasst",
      "der Gast bleibt l\xE4nger, als die Vorr\xE4te reichen",
      "der Sommer macht den Weg tags\xFCber unbegehbar",
      "die Auskunft w\xFCrde einen anderen besch\xE4men",
      "das Kamel ist lahm, und der Markt ist weit",
      "niemand darf zwischen den beiden vermitteln",
      "die Nacht ist kurz, und der Ruf kommt fr\xFCh",
      "der Schreiber hat kein Gold mehr f\xFCr die R\xE4nder",
      "die Antwort ist bekannt und hilft dem Fragenden nicht",
      "eine Pr\xFCfung kommt ohne Warnung und ohne Frist",
      "der Weg \xFCber die Salzebene ist nur nachts begehbar",
      "die Handschrift geh\xF6rt einem Haus, das sie nicht ausleiht"
    ],
    "stakes": [
      "Der Einsatz ist Hingabe: Sie fordert Vertrauen.",
      "Der Einsatz ist Rechtleitung: Sie ist ein schmaler Pfad.",
      "Der Einsatz ist Geduld: Sie wird gepr\xFCft.",
      "Der Einsatz ist Gerechtigkeit: Sie wiegt jedes Wort.",
      "Der Einsatz ist Barmherzigkeit: Sie \xFCbersteigt das Ma\xDF.",
      "Der Einsatz ist eine Geduld, die bis zum Regen reicht.",
      "Der Einsatz ist ein Gast und was das Haus ihm schuldet.",
      "Der Einsatz ist ein Vers, der richtig weitergegeben wird.",
      "Der Einsatz ist der Brunnen f\xFCr eine ganze Stadt.",
      "Der Einsatz ist ein Wort, das jemanden besch\xE4men w\xFCrde."
    ],
    "endings": [
      "Und die W\xFCste tr\xE4gt pl\xF6tzlich Gr\xFCn.",
      "Und mein Herz findet seine Qibla.",
      "Und der Vers bleibt in mir.",
      "Und die Nacht ist nicht mehr dunkel.",
      "Und der Garten \xF6ffnet sich im Inneren.",
      "Und die W\xFCste tr\xE4gt nach dem Regen pl\xF6tzlich Gr\xFCn.",
      "So findet das Herz seine Richtung wieder.",
      "Am Ende bleibt der Vers, und der Tag geht weiter.",
      "Und der Brunnen gibt Wasser, f\xFCr dieses Jahr.",
      "So bricht die Karawane vor Sonnenaufgang auf.",
      "Und der Gast zieht weiter, mit Datteln f\xFCr den Weg.",
      "Der Schatten steht wieder da, wo er stehen soll.",
      "Und das Blatt trocknet mit Goldrand.",
      "So bleibt die Stelle unerkl\xE4rt bis zum n\xE4chsten Jahr.",
      "Und im Hof l\xE4uft das Wasser wie immer.",
      "Und im Hof wird der Teppich ausgesch\xFCttelt.",
      "So bleibt die Karawane bis zum Morgen am Brunnen.",
      "Am Ende ist die Schale wieder gef\xFCllt f\xFCr den N\xE4chsten."
    ],
    "verwandlungen": [
      "Brunnen\u2192Spiegel",
      "Vers\u2192Faden",
      "Gast\u2192Bote",
      "Schatten\u2192Zeiger",
      "Karte\u2192Grenze"
    ]
  },
  "buddhismus": {
    "motifs": [
      "eine Lotusbl\xFCte aus Nebel",
      "ein Rad, das sich ohne Achse dreht",
      "eine Glocke im Wind",
      "ein Spiegel ohne Spiegelbild",
      "ein leerer Thron unter einem Baum",
      "eine Spur im Sand, die verschwindet",
      "ein Fluss ohne Quelle",
      "eine Schale voller Stille",
      "eine Kerze im Morgengrauen",
      "ein Berg, der atmet",
      "ein Kloster, in dem seit dreihundert Jahren gefegt wird",
      "eine Schale, die morgens leer vor die T\xFCr gestellt wird",
      "ein Sandbild, das am Abend fortgewischt wird",
      "der Atem, der geht und wiederkommt, ohne dass man ihn ruft",
      "eine Glocke, deren Ton l\xE4nger dauert als der Schlag",
      "ein Pfad, den tausend F\xFC\xDFe blank gelaufen haben",
      "Regen auf einem Dach aus Schindeln, stundenlang",
      "ein Kissen mit einer Mulde",
      "ein Buch, das nur eine Seite hat",
      "der Schatten eines Baumes, der wandert"
    ],
    "hooks": [
      "Ich setze mich, und die Welt setzt sich mit mir.",
      "Ein Atemzug dauert ein Jahrhundert.",
      "Die Frage l\xF6st sich vor der Antwort.",
      "Ein Blatt f\xE4llt, und ich verstehe.",
      "Die Stille ist lauter als der Markt.",
      "Ein M\xF6nch l\xE4chelt ohne Grund.",
      "Der Weg beginnt unter meinen F\xFC\xDFen.",
      "Der Lehrer antwortet mit einer Frage und geht dann.",
      "Die Glocke schl\xE4gt, und die Gedanken laufen weiter.",
      "Jemand stellt die Schale zur\xFCck, ohne etwas hineinzulegen.",
      "Ein Sch\xFCler sitzt seit dem Morgen und hat nichts bemerkt.",
      "Der Regen h\xF6rt auf, und es wird zu still im Hof.",
      "Ein Brief kommt aus der Welt, die man verlassen hat.",
      "Der Weg zum Brunnen ist heute anders gekehrt.",
      "Jemand lacht w\xE4hrend der \xDCbung, und niemand schilt.",
      "Die Kerze geht aus, bevor der Abschnitt zu Ende ist.",
      "Ein Fremder wartet am Tor und sagt, wozu er kam.",
      "Die Zeit f\xFCr das Sitzen wird verl\xE4ngert, ohne Ank\xFCndigung.",
      "Ein Name wird nicht mehr genannt, und keiner fragt."
    ],
    "props": [
      "eine Gebetsschale",
      "eine Mala",
      "eine Lotusblume",
      "eine kleine Glocke",
      "ein Tuch",
      "eine Kerze",
      "eine Holzfigur",
      "eine Teeschale",
      "ein Blatt",
      "einen Kieselstein",
      "eine Almosenschale aus dunklem Holz",
      "ein Gewand, dreimal geflickt",
      "eine Glocke mit einem h\xF6lzernen Schlegel",
      "eine Matte, an den R\xE4ndern durchgesessen",
      "einen Besen aus Reisig",
      "eine Kanne mit warmem Wasser",
      "ein R\xE4ucherst\xE4bchen, halb abgebrannt",
      "einen Krug f\xFCr den Weg",
      "eine Schnur mit hundertacht Perlen",
      "ein Blatt, das jemand ins Buch gelegt hat"
    ],
    "turns": [
      "das Ich l\xF6st sich auf",
      "der Kreis schlie\xDFt sich nicht",
      "die Frage verschwindet",
      "Zeit wird zu Atem",
      "Leere wird Form",
      "das Rad dreht sich r\xFCckw\xE4rts",
      "Erkenntnis geschieht ohne Worte",
      "die Frage l\xF6st sich auf, und die Antwort wird unn\xF6tig",
      "der Sch\xFCler wartet auf etwas und merkt, dass es schon geschah",
      "die Glocke schl\xE4gt mitten in den Gedanken hinein",
      "was er festhalten wollte, ist schon nicht mehr dasselbe",
      "der Lehrer nimmt das Buch weg und sagt nichts dazu",
      "das Sitzen wird leicht, und genau dann kippt es",
      "ein Wort aus der Kindheit kommt zur\xFCck und meint etwas anderes",
      "er will nichts wollen und will es sehr",
      "der Schmerz im Knie h\xF6rt auf, ohne dass er sich bewegt",
      "das Sandbild wird gewischt, und niemand sieht traurig aus",
      "ein Sch\xFCler geht, und der Platz wird nicht neu besetzt",
      "die \xDCbung gelingt, und darin liegt der Fehler",
      "der Weg endet an derselben T\xFCr, durch die er kam",
      "die Stille wird laut, und dann wird sie wieder still"
    ],
    "obstacles": [
      "der Geist springt wie ein Affe",
      "Anhaftung h\xE4lt fest",
      "der Wunsch erzeugt Schatten",
      "die Stille wird unruhig",
      "das Selbst verlangt Best\xE4tigung",
      "der Weg scheint zu einfach",
      "der Schmerz klammert sich",
      "der Geist springt weg, sobald man ihn ansieht",
      "das Kissen wird hart nach der zweiten Stunde",
      "der Winter im Hof ist l\xE4nger als die Geduld",
      "der Lehrer erkl\xE4rt nichts, was man aufschreiben k\xF6nnte",
      "die Schale bleibt an manchen Tagen leer",
      "ein Vorsatz h\xE4lt bis zum n\xE4chsten Morgen",
      "die anderen sitzen ruhiger, und das st\xF6rt",
      "das Kloster hat kein Holz mehr f\xFCr den Ofen",
      "eine Nachricht von zu Hause zieht durch die ganze \xDCbung",
      "wer erkl\xE4rt, hat schon verloren",
      "der Weg zum Dorf dauert einen halben Tag",
      "der Regen h\xE4lt die Bettelrunde auf",
      "die Regel gilt auch f\xFCr den, der sie geschrieben hat",
      "Fortschritt l\xE4sst sich nicht messen und wird trotzdem gez\xE4hlt"
    ],
    "stakes": [
      "Der Einsatz ist Erwachen: Es geschieht still.",
      "Der Einsatz ist Loslassen: Nichts bleibt.",
      "Der Einsatz ist Mitgef\xFChl: Es kennt kein Ich.",
      "Der Einsatz ist Einsicht: Sie l\xF6st Grenzen.",
      "Der Einsatz ist Nirwana: Es ist kein Ort.",
      "Der Einsatz ist ein Morgen, an dem nichts erreicht werden muss.",
      "Der Einsatz ist ein Satz des Lehrers, der nicht wiederholt wird.",
      "Der Einsatz ist die Frage, ob es ein Ich gibt, das sitzt.",
      "Der Einsatz ist der Platz im Hof, den man behalten m\xF6chte.",
      "Der Einsatz ist ein Winter im Kloster oder in der Stadt.",
      "Der Einsatz ist alles Festhalten, das man mitgebracht hat."
    ],
    "endings": [
      "Und der Atem kehrt heim.",
      "Und nichts fehlt.",
      "Und der Kreis ist offen.",
      "Und die Bl\xFCte f\xE4llt nicht mehr.",
      "Und der Weg ist kein Weg.",
      "Und der Atem geht weiter, ohne Auftrag.",
      "So wird das Sandbild gewischt und morgen neu gelegt.",
      "Am Ende steht die Schale wieder vor der T\xFCr.",
      "Und die Glocke klingt noch, als schon gefegt wird.",
      "So bleibt die Mulde im Kissen, bis jemand kommt.",
      "Und der Schatten des Baumes ist weitergewandert.",
      "Der Regen h\xF6rt auf, und der Hof dampft.",
      "Und niemand nennt, was heute geschehen ist.",
      "So geht der Weg zum Brunnen, wie er immer ging.",
      "Und das Buch bleibt aufgeschlagen auf derselben Seite."
    ],
    "verwandlungen": [
      "Schale\u2192Hand",
      "Glocke\u2192Stille",
      "Atem\u2192Faden",
      "Kissen\u2192Blatt",
      "Weg\u2192Kreis",
      "Sandbild\u2192Gesicht",
      "Regen\u2192Schleier",
      "Buch\u2192Fenster"
    ]
  },
  "biologie": {
    "motifs": [
      "eine Zelle mit Fenster",
      "ein Herz im Glas",
      "ein Baum mit wandernden Wurzeln",
      "ein Insekt aus Uhrwerk",
      "eine DNA-Spirale aus Licht",
      "eine Bl\xFCte, die sich erinnert",
      "ein Aquarium ohne Wasser",
      "eine Haut aus Bl\xE4ttern",
      "ein Mikroskop voller Sterne",
      "ein Skelett, das atmet",
      "eine Kolonie, die \xFCber Nacht die Schale f\xFCllt",
      "ein Nest aus fremdem Material",
      "Wurzeln, die einander ausweichen",
      "ein Schwarm, der wie ein K\xF6rper wendet",
      "ein K\xE4fer mit einer Farbe zu viel",
      "Blattadern unter dem Licht",
      "ein Vogel, der die falsche Jahreszeit singt",
      "ein Ei ohne Schale",
      "die Grenze zwischen Wald und Feld",
      "ein Pilz, der zwei B\xE4ume verbindet",
      "Larven in einem Glas mit Datum",
      "ein Skelett im Museumskeller",
      "Bl\xFCten, die zwei Wochen zu fr\xFCh sind",
      "eine Art, die nur hier vorkommt",
      "ein Bau, der \xE4lter ist als der Hof dar\xFCber",
      "Spuren im Schlamm, die sich kreuzen"
    ],
    "hooks": [
      "Die Zelle teilt sich zu fr\xFCh.",
      "Ein Blatt schreibt meinen Namen.",
      "Das Mikroskop vergr\xF6\xDFert die Stille.",
      "Ein Herz schlug au\xDFerhalb des K\xF6rpers.",
      "Ein Tier sieht mich an, als w\xFCsste es mehr.",
      "Die Kultur w\xE4chst, obwohl sie steril sein sollte.",
      "In der Falle sitzt etwas, das hier nicht lebt.",
      "Der Vogel kommt in diesem Jahr nicht.",
      "Die Probe zeigt zwei Erbg\xE4nge statt einem.",
      "Ein Bestand ist \xFCber Nacht verschwunden.",
      "Die Z\xE4hlung ergibt jedes Mal eine andere Zahl.",
      "Ein Tier verh\xE4lt sich, als kenne es uns.",
      "Die Bl\xFCte \xF6ffnet sich im Februar.",
      "Im Teich schwimmt, was nicht schwimmen kann.",
      "Der Kollege hat die Reihe anders beschriftet.",
      "Zwei Nester liegen zu nah beieinander."
    ],
    "props": [
      "ein Mikroskop",
      "eine Petrischale",
      "ein Skalpell",
      "ein Herbariumblatt",
      "eine Pipette",
      "ein Glas mit Formalin",
      "einen Samen",
      "ein Anatomiebuch",
      "eine Feder",
      "ein Reagenzglas",
      "eine Pinzette",
      "ein Fangnetz",
      "ein Bestimmungsbuch",
      "eine K\xFChlbox",
      "einen Objekttr\xE4ger",
      "ein Etikett mit Datum",
      "eine Falle aus Draht",
      "ein Glas mit Alkohol",
      "ein Fernglas",
      "einen Z\xE4hlrahmen",
      "ein Feldtagebuch",
      "einen Ring f\xFCr den Vogelfu\xDF",
      "eine Schaufel f\xFCr die Bodenprobe"
    ],
    "turns": [
      "eine Mutation wird bewusst",
      "ein Organ beginnt zu sprechen",
      "die Evolution springt einen Schritt",
      "ein K\xF6rper erinnert sich an fr\xFChere Formen",
      "Zellen wechseln die Identit\xE4t",
      "die Natur schreibt neu",
      "Leben entsteht im Falschen",
      "die Z\xE4hlung stimmt, und das ist das Problem",
      "zwei Arten teilen sich denselben Platz",
      "der Bestand kehrt zur\xFCck, wo niemand ihn erwartete",
      "eine Probe ist nicht die, die beschriftet ist",
      "das Verhalten ist gelernt, nicht angeboren",
      "der Wirt lebt l\xE4nger als sein Parasit",
      "die Kultur bringt etwas hervor, das nicht angesetzt war",
      "ein alter Fund bekommt einen neuen Namen",
      "der Versuch gelingt nur einmal",
      "die Grenze verschiebt sich um zehn Kilometer",
      "die Art war nie getrennt",
      "die Reihe von 1974 sagt etwas anderes",
      "die zweite Z\xE4hlung findet mehr, und das ist schlimmer",
      "eine Art taucht auf, die hier seit hundert Jahren fehlt",
      "der Versuch widerlegt die Annahme und best\xE4tigt den Zufall",
      "der Bestand erholt sich, seit niemand mehr eingreift",
      "die Beringung von 1974 kommt an einem fremden Ort zur\xFCck"
    ],
    "obstacles": [
      "das Gewebe zerf\xE4llt",
      "eine Art verschwindet",
      "der Samen keimt nicht",
      "ein Virus fl\xFCstert",
      "das Experiment ger\xE4t au\xDFer Kontrolle",
      "Instinkt widerspricht Vernunft",
      "das Herz schl\xE4gt im falschen Rhythmus",
      "die Kultur ist verunreinigt",
      "die Saison ist zu kurz f\xFCr eine zweite Z\xE4hlung",
      "das Tier l\xE4sst sich nicht wiederfinden",
      "die Genehmigung gilt nur f\xFCr zwei Exemplare",
      "der K\xFChlschrank f\xE4llt in der Nacht aus",
      "die Probe h\xE4lt keine drei Tage",
      "der Bestand ist zu klein f\xFCr eine Statistik",
      "das Gel\xE4nde wird im Fr\xFChjahr bebaut",
      "niemand hat die Reihe von 1974 aufgehoben",
      "der Regen macht die Z\xE4hlung unm\xF6glich",
      "die Falle ist leer und der K\xF6der weg",
      "die Z\xE4hlfl\xE4che wird im Sommer als Weide genutzt",
      "das Pr\xE4parat verliert die Farbe, bevor es fotografiert ist",
      "die Bestimmung ist nur mit einem zweiten Merkmal sicher",
      "der Bau darf w\xE4hrend der Brutzeit nicht betreten werden",
      "die Genehmigung nennt eine Art, die nicht mehr so hei\xDFt",
      "das Wetter verschiebt die Z\xE4hlung um zwei Wochen"
    ],
    "stakes": [
      "Der Einsatz ist Anpassung: \xDCberleben oder Aussterben.",
      "Der Einsatz ist Identit\xE4t: Was macht ein Wesen aus?",
      "Der Einsatz ist Balance: Natur oder Eingriff?",
      "Der Einsatz ist Ursprung: Wo beginnt Leben?",
      "Der Einsatz ist Verantwortung: Wer ver\xE4ndert wen?",
      "Der Einsatz ist ein Bestand, der einmal f\xE4llt und nicht wiederkommt.",
      "Der Einsatz ist ein Name f\xFCr etwas Namenloses.",
      "Der Einsatz ist die Reihe: drei\xDFig Jahre oder umsonst.",
      "Der Einsatz ist ein Gel\xE4nde, das jemand anders will.",
      "Der Einsatz ist die Zahl, die im Bericht steht.",
      "Der Einsatz ist die Frage, ob man eingreift."
    ],
    "endings": [
      "Und das Leben w\xE4chst weiter, leise.",
      "Und die Mutation bleibt.",
      "So bleibt nur eine Spur im Gewebe.",
      "Und das Herz findet einen neuen Takt.",
      "Und die Natur antwortet nicht.",
      "Und die Zahl geht in die Reihe ein wie in jedem Jahr.",
      "So bleibt das Glas im Regal, beschriftet und unge\xF6ffnet.",
      "Am Ende z\xE4hlt jemand anders weiter.",
      "Und der Bestand h\xE4lt sich, vorerst.",
      "So tr\xE4gt der Name jetzt ein Datum.",
      "Und im n\xE4chsten Fr\xFChjahr steht wieder jemand am Rand des Feldes.",
      "Das Feldbuch schlie\xDFt mit einer offenen Zeile.",
      "Und der Bau bleibt bewohnt, ohne uns.",
      "Und die Zahl geht in die Reihe ein, mit einem Fragezeichen.",
      "So liegt das Pr\xE4parat im Schrank, beschriftet und blass.",
      "Am Ende steht eine Art auf einer anderen Liste.",
      "Und der Bau bleibt bewohnt, das zeigt der Aushub.",
      "So z\xE4hlt jemand im n\xE4chsten Fr\xFChjahr an derselben Stelle."
    ],
    "verwandlungen": [
      "Zelle\u2192Kammer",
      "Nest\u2192Haus",
      "Schwarm\u2192Rauch",
      "Probe\u2192Frage",
      "Wurzel\u2192Ader",
      "K\xE4fer\u2192Splitter",
      "Bestand\u2192Rest",
      "Netz\u2192Gitter"
    ]
  },
  "geologie": {
    "motifs": [
      "eine Stadt unter Lava",
      "ein sprechender Granitblock",
      "eine Fossilie mit ge\xF6ffnetem Auge",
      "ein Fluss aus Quecksilber",
      "eine Schlucht voller Stimmen",
      "ein Berg mit Herzschlag",
      "eine Karte aus Gesteinsschichten",
      "ein Kristall, der Erinnerungen speichert",
      "eine tektonische Naht im Wohnzimmer",
      "eine H\xF6hle aus Salz",
      "eine Schicht, die ein Jahr ausl\xE4sst",
      "Sandstein mit Ringen wie ein Baum",
      "ein Gletscher, der r\xFCckw\xE4rts geht",
      "die Naht zweier Kontinente",
      "Kalk, der einmal Tier war",
      "eine H\xF6hle, die atmet",
      "ein Findling, der nicht hierher geh\xF6rt",
      "Asche \xFCber einem Stra\xDFenpflaster",
      "ein Bohrkern in einer R\xF6hre",
      "Salz unter einer Wiese",
      "eine Quelle, die zu warm ist",
      "ein Tal, das ein Fluss vergessen hat",
      "Schotter in fremder Farbe",
      "ein Abdruck ohne Tier",
      "eine Halde, auf der nichts w\xE4chst",
      "ein Stollen mit verfaultem Geb\xE4lk"
    ],
    "hooks": [
      "Der Boden unter mir denkt nach.",
      "Ein Riss zieht sich durch den Morgen.",
      "Der Stein ist w\xE4rmer als meine Hand.",
      "Die Landschaft verschob sich um Millimeter.",
      "Ein Fossil fl\xFCstert meinen Namen.",
      "Ein Bohrkern zeigt eine Schicht zu viel.",
      "Der Pegel steht seit Tagen falsch.",
      "Die Quelle f\xFChrt pl\xF6tzlich Sand.",
      "Ein Hang gibt nach, ohne dass es regnete.",
      "Der Seismograph zeichnet, und niemand hat es gesp\xFCrt.",
      "Ein Stein liegt dort, wo kein Stein liegen kann.",
      "Die Karte stimmt nicht mehr mit dem Hang.",
      "Im Schacht wird es w\xE4rmer statt k\xE4lter.",
      "Ein Riss ist \xFCber Nacht gewachsen.",
      "Das Wasser im Brunnen schmeckt nach Schwefel.",
      "Der Berg hat sich um einen Zentimeter gesenkt.",
      "Zwei Messungen widersprechen sich seit Montag."
    ],
    "props": [
      "einen Hammer",
      "eine Lupe",
      "ein St\xFCck Basalt",
      "eine Feldkarte",
      "einen Kompass",
      "ein Notizbuch voller Schichten",
      "eine Taschenlampe",
      "eine Bohrprobe",
      "einen Kristall",
      "eine Staubmaske",
      "einen Bohrkern",
      "einen H\xF6henmesser",
      "eine Schichtenkarte",
      "ein Fl\xE4schchen Salzs\xE4ure",
      "einen Mei\xDFel",
      "ein Notizbuch mit Profilzeichnungen",
      "eine Grubenlampe",
      "ein Sieb f\xFCr Ger\xF6ll",
      "einen Pegelstab",
      "eine Probe in Papier",
      "ein Seil mit Knoten alle zwei Meter",
      "einen Seismographen aus Messing",
      "einen Kompass mit Neigungsmesser",
      "ein Glas mit Sand"
    ],
    "turns": [
      "die Erdkruste spricht",
      "Druck wird zu Erinnerung",
      "eine Verwerfung \xF6ffnet sich",
      "Zeit beschleunigt sich um Jahrtausende",
      "ein Vulkan tr\xE4umt",
      "das Gestein wird durchsichtig",
      "Schichten tauschen ihre Reihenfolge",
      "die Schicht nennt eine andere Jahreszahl",
      "der Hang beginnt zu wandern",
      "ein Hohlraum antwortet auf das Klopfen",
      "die Probe passt zu keinem Gestein der Gegend",
      "der Pegel f\xE4llt schneller als die Rechnung",
      "eine \xE4ltere Karte zeigt, was fehlt",
      "der Schacht f\xFChrt in eine \xE4ltere Zeit",
      "das Wasser findet einen neuen Weg",
      "der Findling verr\xE4t seine Herkunft",
      "ein zweiter Riss kreuzt den ersten",
      "die Messung wiederholt sich nicht",
      "unter der Asche liegt noch eine Asche",
      "die Schichtfolge stimmt, aber die Reihenfolge nicht",
      "ein zweiter Bohrkern widerspricht dem ersten um Jahrtausende",
      "der Hang bewegt sich langsamer, seit man ihn beobachtet",
      "eine alte Grubenkarte zeigt einen Stollen, den es geben m\xFCsste",
      "das Gestein stammt aus einem Gebirge, das nicht mehr steht",
      "der Riss h\xF6rt auf zu wachsen, ohne dass jemand etwas tat"
    ],
    "obstacles": [
      "die H\xF6hle endet im Nichts",
      "ein Erdbeben verschiebt die Karte",
      "der Kompass dreht sich ziellos",
      "die Lava versiegelt den Ausgang",
      "eine Schicht fehlt",
      "der Boden gibt nach",
      "Staub nimmt die Sicht",
      "der Winter schlie\xDFt den Steinbruch",
      "die Probe zerf\xE4llt an der Luft",
      "niemand darf den Hang betreten",
      "das Seil reicht nicht bis zur Sohle",
      "die Bohrung trifft nur Ger\xF6ll",
      "der Regen w\xE4scht das Profil weg",
      "die Genehmigung fehlt",
      "die Karte ist vierzig Jahre alt",
      "der Stollen ist verbrochen",
      "das Ger\xE4t zeigt zwei Werte",
      "der Frost sprengt die Wand \xFCber dem Weg",
      "die Probe muss ins Labor, und das Labor ist geschlossen",
      "der Hang darf erst nach der Schneeschmelze betreten werden",
      "die Bohrgenehmigung gilt f\xFCr ein anderes Flurst\xFCck",
      "die alte Karte nennt H\xF6hen in einem anderen Bezugssystem",
      "der Steinbruch geh\xF6rt jemandem, der nicht antwortet",
      "die Messung braucht eine Woche ohne Ersch\xFCtterung",
      "das Ger\xE4t zeigt nach dem Frost andere Werte als davor"
    ],
    "stakes": [
      "Der Einsatz ist Stabilit\xE4t: Der Boden tr\xE4gt oder bricht.",
      "Der Einsatz ist Herkunft: Was liegt unter uns?",
      "Der Einsatz ist Geduld: Millionen Jahre im Warten.",
      "Der Einsatz ist Erinnerung: Im Stein eingeschlossen.",
      "Der Einsatz ist \xDCberleben: Die Erde entscheidet.",
      "Der Einsatz ist der Hang \xFCber dem Dorf.",
      "Der Einsatz ist eine Jahreszahl, die alles verschiebt.",
      "Der Einsatz ist die Bohrung: eine oder keine.",
      "Der Einsatz ist das Wasser unter der Stadt.",
      "Der Einsatz ist eine Karte, der jemand glaubt.",
      "Der Einsatz ist die Zeit, die im Stein steht.",
      "Der Einsatz ist ein Gutachten, das eine Stra\xDFe entscheidet."
    ],
    "endings": [
      "Und der Berg schweigt wieder.",
      "Und die Schichten schlie\xDFen sich.",
      "So bleibt nur ein Abdruck im Gestein.",
      "Und der Riss wird zu einer Linie auf Papier.",
      "Und der Staub legt sich wie Schnee.",
      "Und die Schicht bleibt, wo sie liegt.",
      "So steht die Zahl im Bericht, und niemand liest sie.",
      "Am Ende ist der Hang ruhig, aber nicht sicher.",
      "Und der Bohrkern wandert ins Regal.",
      "So misst es weiter, ohne uns.",
      "Und das Wasser findet seinen Weg trotzdem.",
      "Der Stein hat Zeit, wir nicht.",
      "Und \xFCber der Asche w\xE4chst wieder Gras.",
      "Und die Probe steht beschriftet im Regal des Instituts.",
      "So bleibt der Hang stehen, bis er es nicht mehr tut.",
      "Am Ende tr\xE4gt die Karte eine Linie mehr als vorher.",
      "Und im Fr\xFChjahr geht jemand denselben Weg noch einmal.",
      "So bleibt eine Zahl im Bericht, mit einer Unsicherheit dahinter."
    ],
    "verwandlungen": [
      "Stein\u2192Knochen",
      "Schicht\u2192Seite",
      "Karte\u2192Fl\xE4che",
      "Riss\u2192Weg",
      "Quelle\u2192Wunde",
      "Berg\u2192Zeuge",
      "H\xF6hle\u2192Kammer",
      "Gestein\u2192Ged\xE4chtnis",
      "Bohrung\u2192Frage"
    ]
  },
  "astrologie": {
    "motifs": [
      "eine Galaxie im Wasserglas",
      "ein Planet mit Rissen aus Licht",
      "ein Teleskop, das nach innen schaut",
      "ein Komet aus gefrorenen Erinnerungen",
      "ein schwarzes Loch im B\xFCcherregal",
      "eine Sternkarte ohne Norden",
      "ein Mond mit Puls",
      "eine Sonne aus Glas",
      "ein Satellit, der Gedichte sendet",
      "eine Raumstation aus Knochen",
      "eine Sternwarte mit offener Kuppel",
      "ein Signal, das \xE4lter ist als die Erde",
      "die Umlaufbahn eines K\xF6rpers ohne Namen",
      "ein Spiegel von acht Metern",
      "eine Aufnahme mit einem Strich zu viel",
      "Staub zwischen zwei Sternen",
      "ein Funkecho aus derselben Richtung",
      "eine Karte des Himmels von 1890",
      "ein Krater mit scharfem Rand",
      "die Nachtseite eines Planeten",
      "ein Zeitzeichen, das um Sekunden abweicht",
      "eine Sonnenfinsternis auf Millimeterpapier",
      "der Schatten eines Mondes auf einer Wolkendecke",
      "eine Zahlenreihe ohne Ende",
      "ein Punkt, der auf zwei Platten wandert"
    ],
    "hooks": [
      "Der Himmel atmet n\xE4her als sonst.",
      "Ein Stern f\xE4llt nicht \u2013 er steigt.",
      "Das Teleskop beobachtet mich.",
      "Zwischen zwei Sekunden \xF6ffnet sich ein Orbit.",
      "Der Mond ist heute schwerer.",
      "Das Signal wiederholt sich nach 71 Tagen.",
      "Die Platte von gestern zeigt einen Punkt zu viel.",
      "Der Himmel ist klar und die Kuppel klemmt.",
      "Ein Stern ver\xE4ndert seine Helligkeit im Takt.",
      "Die Uhr des Observatoriums geht seit Montag anders.",
      "Eine alte Aufnahme zeigt, was heute fehlt.",
      "Der Funkspruch kommt von einem Ort ohne Sender.",
      "Die Bahn stimmt nur, wenn man einen K\xF6rper annimmt.",
      "Ein Kollege hat die Beobachtung nicht eingetragen.",
      "Das Teleskop steht auf einer Stelle, an der nichts ist.",
      "Der Regen kommt, und die Nacht war die letzte im Jahr."
    ],
    "props": [
      "ein Fernglas",
      "eine Sternkarte",
      "ein St\xFCck Meteorit",
      "eine zerkratzte Raumkapsel",
      "ein Notizbuch mit Koordinaten",
      "einen Kompass ohne Nadel",
      "eine Sauerstoffmaske",
      "einen Modellplaneten",
      "eine Sanduhr mit Sternenstaub",
      "einen Funksender",
      "eine Fotoplatte",
      "eine Pendeluhr",
      "ein Fadenkreuz",
      "ein Logbuch der Nacht",
      "einen Filter aus dunklem Glas",
      "ein Spektrogramm",
      "eine Ephemeride",
      "eine Kurbel f\xFCr die Kuppel",
      "einen Rechenschieber",
      "eine Karte mit eingetragenen Punkten",
      "ein Thermometer im Kuppelraum",
      "eine Kanne Kaffee f\xFCr die Nacht"
    ],
    "turns": [
      "die Gravitation \xE4ndert ihre Richtung",
      "ein Planet antwortet",
      "Zeit dehnt sich sichtbar",
      "ein Stern wird geboren und spricht",
      "der Beobachter wird beobachtet",
      "der Raum faltet sich wie Papier",
      "das Licht kommt zu sp\xE4t",
      "die Bahn geht nur auf mit einem K\xF6rper, den niemand sieht",
      "das Signal stammt aus dem eigenen Haus",
      "die alte Platte entscheidet den Streit",
      "der Punkt bewegt sich zwischen zwei Aufnahmen",
      "eine Beobachtung von 1890 wird zur Messung",
      "das Licht ist so alt, dass die Quelle nicht mehr steht",
      "die Abweichung ist die Entdeckung",
      "zwei Sternwarten sehen dasselbe zur selben Sekunde",
      "die Rechnung stimmt und die Annahme nicht",
      "der Fehler liegt in der Uhr, nicht am Himmel",
      "die Wolken rei\xDFen f\xFCr vier Minuten auf",
      "die Bahn passt, wenn man die Uhr um Sekunden verschiebt",
      "ein anderes Observatorium hat dasselbe zwei N\xE4chte fr\xFCher",
      "der Punkt war schon auf einer Platte von 1912",
      "die St\xF6rung kommt aus dem Haus und nicht vom Himmel",
      "die Rechnung ergibt zwei L\xF6sungen, und beide sind m\xF6glich"
    ],
    "obstacles": [
      "der Horizont verschluckt die Sterne",
      "das Signal erreicht nur die Vergangenheit",
      "ein schwarzes Loch verweigert die R\xFCckgabe",
      "die Umlaufbahn zerbricht",
      "der Sauerstoff wird zu Erinnerung",
      "die Sternkarte zeigt nur Namen",
      "ein Komet streicht den Kurs",
      "die Wolken kommen mit dem Aufgang",
      "die Nacht reicht f\xFCr eine Aufnahme",
      "das Signal wiederholt sich nicht",
      "die Platte ist \xFCberbelichtet",
      "der Spiegel muss neu belegt werden",
      "die Uhr weicht ab und niemand wei\xDF seit wann",
      "der Streulichtschein der Stadt w\xE4chst",
      "die Rechenzeit ist auf zwei Stunden begrenzt",
      "der K\xF6rper steht zu tief \xFCber dem Horizont",
      "die Beobachtungszeit geh\xF6rt einem anderen",
      "die Kuppel l\xE4sst sich bei Frost nur halb drehen",
      "die Platten m\xFCssen entwickelt werden, bevor sie altern",
      "die Nacht wird durch einen Stromausfall unterbrochen",
      "der Vergleichsstern steht in diesem Monat zu tief",
      "die Auswertung braucht die Zeit von drei Wintern\xE4chten"
    ],
    "stakes": [
      "Der Einsatz ist Schwerkraft: Sie h\xE4lt oder l\xE4sst los.",
      "Der Einsatz ist Ursprung: Wo begann das Licht?",
      "Der Einsatz ist Isolation: Niemand antwortet.",
      "Der Einsatz ist Zeit: Milliarden Jahre in einer Sekunde.",
      "Der Einsatz ist Heimkehr: Gibt es einen Weg zur\xFCck?",
      "Der Einsatz ist eine Nacht, die nicht wiederkommt.",
      "Der Einsatz ist eine Zahl, die eine Bahn entscheidet.",
      "Der Einsatz ist die Uhr: Ohne sie ist alles ungenau.",
      "Der Einsatz ist die Frage, ob dort etwas ist.",
      "Der Einsatz ist eine Beobachtung gegen eine Theorie.",
      "Der Einsatz ist ein Name f\xFCr ein neues Objekt."
    ],
    "endings": [
      "Und die Sterne r\xFCcken ein St\xFCck n\xE4her.",
      "Und das Licht bleibt zur\xFCck wie ein Echo.",
      "So bleibt nur Staub in meiner Hand.",
      "Und der Planet dreht sich ohne mich weiter.",
      "Und ich falle \u2013 nach oben.",
      "Und die Kuppel schlie\xDFt sich vor dem Morgen.",
      "So steht der Punkt im Katalog und wartet.",
      "Am Ende bleibt eine Zahl mit einer Unsicherheit.",
      "Und das Licht war schon unterwegs, als es niemanden gab.",
      "So bleibt es dabei: eine Beobachtung, keine zwei.",
      "Und die n\xE4chste Nacht ist in einem Jahr.",
      "Der Himmel dreht sich weiter, ob jemand hinsieht oder nicht.",
      "Und die Platte trocknet, mit einem Punkt darauf.",
      "So steht die Beobachtung im Buch und wartet auf eine zweite.",
      "Am Ende ist es eine Zahl, die niemand best\xE4tigen kann.",
      "Und die Kuppel wird geschlossen, bevor es hell wird.",
      "So bleibt der Himmel, wie er war, nur genauer."
    ],
    "verwandlungen": [
      "Stern\u2192Punkt",
      "Kuppel\u2192Schale",
      "Signal\u2192Echo",
      "Bahn\u2192Linie",
      "Uhr\u2192Waage",
      "Teleskop\u2192Fernrohr",
      "Licht\u2192Ger\xFCcht",
      "Platte\u2192Karte"
    ]
  },
  "gaia": {
    "motifs": [
      "ein Planet, der zweimal im Jahr atmet",
      "Kontinente, die wie Rippen unter der Haut liegen",
      "ein Ozean, der wie Blut im Kreis l\xE4uft",
      "ein Puls, der aus dem Erdinneren kommt",
      "ein Wald, der ein Nervengeflecht bildet",
      "Wolken, die aussehen wie Gedanken",
      "ein Gebirge, das sich wie eine Stirn w\xF6lbt",
      "Fl\xFCsse, die wie Adern durch das Land gehen",
      "St\xE4dte, die wie Parasiten leuchten",
      "eine Atmosph\xE4re, die wie eine Haut anliegt",
      "ein Moor, das seit achttausend Jahren Kohlenstoff h\xE4lt",
      "ein Riff, das in einem Sommer wei\xDF wird",
      "eine Messreihe, die seit 1958 nicht unterbrochen wurde",
      "ein Gletscher, der jedes Jahr eine Marke zur\xFCckweicht",
      "ein Bohrkern aus dem Eis mit Luft von damals",
      "ein Waldbrand, der seinen eigenen Wind macht",
      "eine K\xFCste, die um einen Meter im Jahr verschwindet",
      "ein Netz von Pilzen unter einem ganzen Hang",
      "ein Strom, der W\xE4rme \xFCber den halben Planeten tr\xE4gt",
      "eine Insel, auf der eine Art nur hier lebt",
      "ein Sturm, der einen Namen bekommt",
      "eine Karte, auf der eine Farbe jedes Jahr w\xE4chst"
    ],
    "hooks": [
      "Die Erde blinzelt.",
      "Ein Erdbeben ist nur ein Zucken.",
      "Der Wind spricht in ganzen S\xE4tzen.",
      "Die Gezeiten folgen einem Herzschlag.",
      "Wir leben auf einer Stirn.",
      "Die Kurve steigt seit sechzig Jahren ohne Knick.",
      "Der Gletscher hat die Marke von 1950 \xFCberschritten.",
      "Im Moor sackt der Boden um zwei Zentimeter.",
      "Das Riff ist in diesem Sommer zum dritten Mal wei\xDF.",
      "Der Strom im Nordatlantik wird langsamer.",
      "Ein Vogel br\xFCtet drei Wochen zu fr\xFCh.",
      "Die Messstation meldet einen Wert, den es nicht geben sollte.",
      "Der Wald brennt zum zweiten Mal an derselben Stelle.",
      "Ein Bericht wird um ein Jahr verschoben.",
      "Die Insel hat in diesem Jahr keine Jungtiere.",
      "Das Eis tr\xE4gt nicht mehr bis zum Fr\xFChjahr.",
      "Der Sturm bekommt einen Namen, der schon vergeben war."
    ],
    "props": [
      "eine Handvoll Erde",
      "ein Stethoskop",
      "eine Weltkarte",
      "ein Glas Meerwasser",
      "einen Stein mit Riss",
      "ein Blatt",
      "eine seismografische Linie",
      "ein Satellitenbild",
      "eine Atemmaske",
      "eine Wurzel",
      "einen Bohrkern aus dem Eis",
      "ein Messger\xE4t auf einem Mast",
      "eine Karte mit eingef\xE4rbten Fl\xE4chen",
      "ein Glas Meerwasser mit Datum",
      "eine Handvoll Moorerde",
      "einen Datensatz von 1958",
      "ein Fernglas f\xFCr die Z\xE4hlung",
      "eine Markierung am Gletscherrand",
      "einen Bericht mit einer Zusammenfassung",
      "ein Thermometer im Bodenprofil"
    ],
    "turns": [
      "der Planet reagiert bewusst",
      "das Klima antwortet",
      "die Kontinente verschieben sich absichtlich",
      "die Menschheit wird als Symptom erkannt",
      "die Welt beginnt zu tr\xE4umen",
      "Naturgesetze werden zu Instinkten",
      "der Himmel senkt sich n\xE4her",
      "das System antwortet, aber mit drei\xDFig Jahren Verz\xF6gerung",
      "eine R\xFCckkopplung verst\xE4rkt, was sie d\xE4mpfen sollte",
      "die Kurve knickt, und niemand traut der Messung",
      "ein Kipppunkt wird \xFCberschritten und erst sp\xE4ter bemerkt",
      "der Wald wird zur Quelle statt zur Senke",
      "das Moor gibt zur\xFCck, was es achttausend Jahre hielt",
      "die Vorhersage stimmt und war zu vorsichtig",
      "eine Art verschwindet und nimmt drei andere mit",
      "der Bericht wird abgeschw\xE4cht, bevor er erscheint",
      "das Eis erinnert sich an eine Luft, die es nicht mehr gibt",
      "die Grenze der Art verschiebt sich nach Norden",
      "ein Sturm bringt in drei Tagen den Regen eines Jahres",
      "die Messreihe wird eingestellt, aus Kostengr\xFCnden",
      "das Riff kommt zur\xFCck, an einer anderen Stelle"
    ],
    "obstacles": [
      "der Organismus wird krank",
      "der Puls wird unregelm\xE4\xDFig",
      "ein Teil des K\xF6rpers rebelliert",
      "das Nervensystem brennt",
      "die Haut rei\xDFt",
      "der Atem wird d\xFCnn",
      "das Ged\xE4chtnis der Erde l\xF6scht sich",
      "die Messreihe braucht drei\xDFig Jahre f\xFCr eine Aussage",
      "der Bericht muss von allen Staaten angenommen werden",
      "die Verz\xF6gerung im System ist l\xE4nger als jede Amtszeit",
      "die Station steht in einem Gebiet ohne Strom",
      "das Modell rechnet drei Wochen f\xFCr einen Lauf",
      "die Daten geh\xF6ren einer Beh\xF6rde, die nicht antwortet",
      "der Fr\xFChling kommt zu fr\xFCh f\xFCr die Best\xE4uber",
      "die K\xFCste l\xE4sst sich nicht \xFCberall sch\xFCtzen",
      "das Moor ist trockengelegt und im Grundbuch verkauft",
      "eine Kurve \xFCberzeugt niemanden, der nicht will",
      "die F\xF6rdermittel laufen im Dezember aus",
      "das Eis bricht, bevor die Bohrung fertig ist",
      "der Winter ist zu warm f\xFCr die Z\xE4hlung",
      "ein Kipppunkt l\xE4sst sich erst hinterher datieren"
    ],
    "stakes": [
      "Der Einsatz ist Gleichgewicht: System oder Kollaps.",
      "Der Einsatz ist Bewusstsein: Wei\xDF die Welt von uns?",
      "Der Einsatz ist Koexistenz: Parasit oder Zelle?",
      "Der Einsatz ist Heilung: Regeneration oder Narben.",
      "Der Einsatz ist Zukunft: Evolution oder Fieber.",
      "Der Einsatz ist eine Messreihe von sechzig Jahren.",
      "Der Einsatz ist ein Moor, das man einmal trockenlegt.",
      "Der Einsatz ist ein Riff, das nicht zweimal zur\xFCckkommt.",
      "Der Einsatz ist ein Bericht, den alle unterschreiben m\xFCssen.",
      "Der Einsatz ist ein Kipppunkt, der schon hinter uns liegt.",
      "Der Einsatz ist ein Fr\xFChling, der zur richtigen Zeit kommt."
    ],
    "endings": [
      "Und der Planet atmet tiefer.",
      "Und wir sind nur eine Phase.",
      "So bleibt ein leiser Herzschlag.",
      "Und die Welt dreht sich weiter \u2013 wissend.",
      "Und das Wesen schlie\xDFt kurz die Augen.",
      "Und die Kurve steigt weiter, wie in jedem Jahr.",
      "So bleibt der Bohrkern im K\xFChlraum liegen.",
      "Am Ende steht eine Zahl in einem Bericht.",
      "Und der Gletscher weicht um eine Marke zur\xFCck.",
      "So misst die Station weiter, ob jemand liest oder nicht.",
      "Und das Moor gibt zur\xFCck, was es lange gehalten hat.",
      "Der Sturm zieht ab und bekommt einen Namen.",
      "Und im n\xE4chsten Fr\xFChjahr z\xE4hlt wieder jemand.",
      "So steht die Farbe auf der Karte, ein Feld weiter.",
      "Und das Eis erinnert sich, solange es liegt."
    ],
    "verwandlungen": [
      "Planet\u2192K\xF6rper",
      "Kurve\u2192Linie",
      "Eis\u2192Ged\xE4chtnis",
      "Moor\u2192Lager",
      "Wald\u2192Teppich",
      "Sturm\u2192Atem",
      "Riff\u2192Ger\xFCst",
      "K\xFCste\u2192Grenze"
    ]
  },
  "freud": {
    "motifs": [
      "eine Couch im Halbdunkel",
      "ein Traum, der sich wiederholt",
      "ein Schl\xFCssel ohne Schloss",
      "eine verschlossene T\xFCr im Inneren",
      "ein Kinderspielzeug unter dem Bett",
      "ein Spiegel ohne Spiegelbild",
      "eine Treppe ins Untergeschoss",
      "ein Brief ohne Absender",
      "eine tickende Uhr im Kopf",
      "ein Schatten hinter der Stimme",
      "ein Wartezimmer mit zwei T\xFCren",
      "eine Uhr, die der Patient nicht sieht",
      "ein Wort, das immer ausgelassen wird",
      "eine Kindheit in dritter Person erz\xE4hlt",
      "eine Treppe im Traum, die nach unten f\xFChrt",
      "ein Vater im T\xFCrrahmen",
      "ein Zimmer, das man nicht betreten durfte",
      "ein Name, der beim Sprechen kippt",
      "ein Foto, auf dem jemand herausgeschnitten wurde",
      "ein wiederkehrender Ort ohne Namen",
      "H\xE4nde, die w\xE4hrend des Sprechens etwas tun",
      "ein Datum, das jedes Jahr wiederkommt",
      "ein Ger\xE4usch aus der Wohnung dar\xFCber",
      "ein Brief, der nie abgeschickt wurde",
      "ein M\xF6belst\xFCck, das im Traum immer dasteht"
    ],
    "hooks": [
      "Ich erinnere mich nicht, aber mein K\xF6rper schon.",
      "Der Traum beginnt immer an derselben Stelle.",
      "Es ist nur ein Versprecher.",
      "Ich sagte Mutter, meinte aber etwas anderes.",
      "Die Stille zwischen zwei Worten wird zu laut.",
      "Die Stunde beginnt mit einer Entschuldigung.",
      "Er erz\xE4hlt den Traum zum dritten Mal, anders.",
      "Sie kommt zwanzig Minuten zu sp\xE4t und nennt keinen Grund.",
      "Ein Satz bricht immer an derselben Stelle ab.",
      "Der Name der Schwester f\xE4llt nie.",
      "Er lacht an einer Stelle, an der nichts komisch ist.",
      "Die Rechnung wird jedes Mal vergessen.",
      "Sie spricht von einem Zimmer, das es im Haus nicht gab.",
      "Ein Wort kommt vor, das nicht seines ist.",
      "Die Uhr steht, und niemand sagt etwas.",
      "Er beschreibt seine Mutter mit den Worten seines Chefs."
    ],
    "props": [
      "eine Couch",
      "ein Notizbuch",
      "eine Taschenuhr",
      "ein Kindheitsfoto",
      "eine Zigarre",
      "einen Briefumschlag",
      "eine verschlossene Schublade",
      "einen Schl\xFCssel",
      "eine Maske",
      "ein Tagebuch",
      "eine Zeitschrift aus dem Wartezimmer",
      "einen Aschenbecher",
      "einen Terminkalender",
      "ein Kuvert mit dem Honorar",
      "eine Decke f\xFCr die Couch",
      "einen Brief ohne Anrede",
      "ein Kinderfoto mit einem Riss",
      "eine Nadel im Revers",
      "einen Traumbericht auf Papier",
      "ein W\xF6rterbuch",
      "eine Karteikarte mit einem Datum",
      "eine Klingel an der Wohnungst\xFCr"
    ],
    "turns": [
      "das Unbewusste \xFCbernimmt die Szene",
      "eine Verdr\xE4ngung l\xF6st sich",
      "ein Traum wird w\xF6rtlich",
      "das Ich verliert Kontrolle",
      "das \xDCber-Ich spricht mit fremder Stimme",
      "ein Kindheitsbild wird real",
      "Begehren zeigt sein Gesicht",
      "die \xDCbertragung nennt den Arzt beim falschen Namen",
      "der Traum meint die Stunde selbst",
      "ein Versprecher trifft genauer als die Erkl\xE4rung",
      "die Erinnerung stellt sich als geliehen heraus",
      "der Widerstand kommt p\xFCnktlich zur Deutung",
      "eine zweite Person taucht in derselben Rolle auf",
      "die Symptome tauschen den Platz",
      "was harmlos schien, tr\xE4gt das Gewicht",
      "die Kindheit \xE4ndert ihr Datum",
      "der Patient deutet den Arzt",
      "ein Traum wiederholt sich, aber mit fremdem Personal",
      "die Stunde wird verschoben, und das ist die Deutung",
      "ein Traum der Mutter erkl\xE4rt den Traum des Sohnes",
      "der Widerstand wird h\xF6flich und damit schwerer zu fassen",
      "ein Detail aus der ersten Stunde kommt nach Jahren wieder",
      "die Erinnerung stimmt, nur geh\xF6rt sie einem anderen",
      "er erz\xE4hlt zum ersten Mal etwas, das er f\xFCr belanglos hielt"
    ],
    "obstacles": [
      "Erinnerung verweigert sich",
      "ein Symptom ersetzt die Wahrheit",
      "Scham blockiert das Sprechen",
      "der Traum verschiebt seine Bedeutung",
      "ein Widerstand baut sich auf",
      "Sprache zerf\xE4llt in Andeutungen",
      "ein Name darf nicht ausgesprochen werden",
      "die Stunde ist zu kurz f\xFCr den Satz",
      "die Deutung stimmt und hilft nicht",
      "der Traum entzieht sich beim Aufschreiben",
      "eine Erinnerung l\xE4sst sich nicht pr\xFCfen",
      "die Familie bestreitet alles",
      "das Symptom kehrt in anderer Form zur\xFCck",
      "der Patient h\xF6rt auf zu kommen",
      "eine Frage ist zu direkt gestellt",
      "die Sprache reicht f\xFCr das Gef\xFChl nicht",
      "der Termin f\xE4llt auf dasselbe Datum",
      "die Familie erwartet einen Bericht, den es nicht geben darf",
      "die Wohnung \xFCber der Praxis wird gerade umgebaut",
      "ein Kollege deutet dasselbe anders und ver\xF6ffentlicht zuerst",
      "der Patient bezahlt und will daf\xFCr ein Ergebnis",
      "die Stunde f\xE4llt in dieselbe Woche wie in jedem Jahr",
      "ein Wort trifft nicht, was gemeint ist"
    ],
    "stakes": [
      "Der Einsatz ist Wahrheit: Verdr\xE4ngt oder erkannt.",
      "Der Einsatz ist Identit\xE4t: Wer spricht wirklich?",
      "Der Einsatz ist Begehren: Erf\xFCllt oder verschoben.",
      "Der Einsatz ist Freiheit: Neurose oder Einsicht.",
      "Der Einsatz ist Erinnerung: Heilung oder Wiederholung.",
      "Der Einsatz ist ein Satz, den er zu Ende sprechen m\xFCsste.",
      "Der Einsatz ist die Deutung: zu fr\xFCh oder gar nicht.",
      "Der Einsatz ist eine Kindheit, die niemand best\xE4tigt.",
      "Der Einsatz ist das Vertrauen einer Stunde.",
      "Der Einsatz ist die Frage, wem die Erinnerung geh\xF6rt.",
      "Der Einsatz ist ein Name, der nicht fallen darf."
    ],
    "endings": [
      "Und das Unbewusste l\xE4chelt.",
      "Und das Symptom verschwindet \u2013 vorl\xE4ufig.",
      "So bleibt nur eine neue Deutung.",
      "Und der Traum beginnt erneut.",
      "Und ich wei\xDF, warum ich es vergessen habe.",
      "Und die Stunde ist um, mitten im Satz.",
      "So bleibt die Deutung stehen, unbeantwortet.",
      "Am Ende steht ein Datum im Kalender, sonst nichts.",
      "Und beim n\xE4chsten Mal beginnt er woanders.",
      "So kehrt der Traum zur\xFCck, mit anderem Personal.",
      "Und das Wort fehlt weiter.",
      "Der Termin bleibt bestehen, das Symptom auch.",
      "Und die Karteikarte bekommt ein Datum und drei Zeilen.",
      "So bleibt der Traum unaufgeschrieben bis zum n\xE4chsten Mal.",
      "Am Ende steht die Uhr, und niemand sagt etwas dazu.",
      "Und im Wartezimmer sitzt schon jemand anderes.",
      "So endet die Stunde, wie sie begonnen hat, mit einer Frage."
    ],
    "verwandlungen": [
      "Traum\u2192Bericht",
      "Couch\u2192Bank",
      "Uhr\u2192Wand",
      "Vater\u2192Richter",
      "Symptom\u2192Zeichen",
      "Erinnerung\u2192Erfindung",
      "Wort\u2192Bild",
      "T\xFCr\u2192Wand"
    ]
  },
  "jugendsprache": {
    "motifs": [
      "eine Nachricht mit drei Flammen-Emojis",
      "ein Meme, das niemand erkl\xE4rt",
      "ein Satz ohne ein einziges Satzzeichen",
      "ein Insiderwort mit einem Ablaufdatum von zwei Wochen",
      "ein Screenshot als Beweis f\xFCr etwas, das keiner bestreitet",
      "Ironie ohne Warnschild, und keiner fragt nach",
      "eine Abk\xFCrzung, die alles ersetzt",
      "ein Trend, der morgen cringe ist",
      "ein Wort, das Bedeutung wechselt",
      "ein Kommentar mit nur einem Wort: 'wild'",
      "ein Chat mit 300 ungelesenen",
      "ein Profilbild von vorletztem Sommer",
      "eine Story, die nach 24 Stunden weg ist",
      "ein Gruppenname, den keiner mehr versteht",
      "ein Ladebalken bei 99 Prozent",
      "eine Playlist f\xFCr genau eine Person",
      "ein Akku bei vier Prozent",
      "eine gelesene Nachricht ohne Antwort",
      "ein Sticker, den nur zwei verstehen",
      "ein Tisch in der letzten Reihe",
      "eine Bank am Bolzplatz, immer dieselbe",
      "ein Bus, der immer zu voll ist",
      "eine Jacke, die jemand anderem geh\xF6rt",
      "ein Foto, das keiner posten darf",
      "ein Timer, der niemanden interessiert",
      "ein Wort, das gestern noch ging"
    ],
    "hooks": [
      "Bro, das ist anders, das f\xFChlst du.",
      "Sag ehrlich, f\xFChlst du das?",
      "Das ist so random, ich kann echt nicht mehr.",
      "Lowkey ist das krass, aber sag nichts.",
      "Ich schw\xF6r, kein Cap, das war genau so.",
      "Jemand liest und antwortet nicht.",
      "Der Gruppenchat ist pl\xF6tzlich still.",
      "Ein Screenshot geht rum, und keiner sagt woher.",
      "Sie schreibt zur\xFCck, aber anders als sonst.",
      "Das Video ist weg, bevor es jemand sehen konnte.",
      "Er sitzt heute woanders, und alle sehen es.",
      "Alle wussten es, nur einer nicht.",
      "Der Spitzname bleibt h\xE4ngen, auch nach Jahren.",
      "Die Story ist gel\xF6scht und alle haben sie gesehen.",
      "Jemand nimmt einen Trend ernst.",
      "Der Lehrer benutzt das Wort."
    ],
    "props": [
      "ein Smartphone mit gesprungenem Display",
      "eine Sprachnachricht von vier Minuten",
      "einen Screenshot, den keiner weiterschicken darf",
      "ein Hoodie, das jemand anderem geh\xF6rt",
      "ein Emoji, das keiner mehr benutzt",
      "einen TikTok-Sound, den alle im Kopf haben",
      "einen Hashtag von letzter Woche",
      "eine Insta-Story mit zwei Aufrufen",
      "einen Gruppenchat mit siebenundvierzig Leuten",
      "einen AirPod ohne den zweiten",
      "eine Powerbank, die selbst leer ist",
      "einen Kopfh\xF6rer mit einem Wackelkontakt",
      "eine Wasserflasche voller Aufkleber",
      "ein Ladekabel, das nur in einer Stellung geht",
      "einen Turnbeutel mit kaputter Kordel",
      "ein Deo aus dem Spind",
      "eine Bahnkarte, die seit gestern abgelaufen ist",
      "einen Kaugummi, den einer geteilt hat",
      "ein Basecap mit dem Schild nach hinten",
      "eine Sonnenbrille im November",
      "einen Aufkleber auf der R\xFCckseite des Handys",
      "ein Armband aus dem letzten Sommer",
      "eine Dose Energy f\xFCr die erste Stunde"
    ],
    "turns": [
      "die Ironie kippt in Ernst, und keiner lacht",
      "ein Insider wird \xF6ffentlich und ist damit tot",
      "der Trend kommt bei den Eltern an",
      "ein Wort verliert die Bedeutung, die es hatte",
      "der Slang steht pl\xF6tzlich in der Werbung",
      "der Witz wird zur Verteidigung",
      "jemand pr\xFCft, ob es echt gemeint war",
      "der Insider funktioniert nicht mehr",
      "jemand steht dazu, vor allen",
      "der Chat wird gel\xF6scht, aber alle haben Screenshots",
      "die Gruppe teilt sich in zwei Chats",
      "ein Video ist pl\xF6tzlich \xFCberall",
      "jemand entschuldigt sich zuerst",
      "das Wort wird von den Falschen benutzt",
      "keiner will es gewesen sein",
      "der Trend kippt \xFCber Nacht",
      "aus dem Spa\xDF wird eine Sache",
      "jemand blockt zur\xFCck, ohne ein Wort",
      "die Stille wird zur Antwort",
      "jemand schickt einen Screenshot und meint es nicht b\xF6se",
      "die Gruppe entscheidet sich, ohne dass jemand abstimmt",
      "ein alter Chat wird gefunden, und alles sieht anders aus",
      "er entschuldigt sich in der Gruppe und nicht bei ihr"
    ],
    "obstacles": [
      "ein Moment, an den sich alle erinnern werden",
      "in der Nachricht fehlt der Tonfall",
      "zu Hause versteht das niemand",
      "die Gruppe hat schon entschieden",
      "alle tun so, als w\xE4re es ihnen egal",
      "keiner wei\xDF mehr, was ernst gemeint ist",
      "alle sehen, was die anderen machen",
      "niemand will als Erster schreiben",
      "der Ton fehlt in der Nachricht",
      "alle warten auf denselben",
      "die Story ist schon weg",
      "der Akku h\xE4lt nicht bis abends",
      "der Bus f\xE4hrt ohne ihn",
      "zu Hause fragt jemand nach",
      "das Handy liegt in der Schublade",
      "die Antwort kommt drei Tage sp\xE4ter",
      "keiner will der Erste sein",
      "die Antwort stand da und wurde wieder gel\xF6scht",
      "alle sind online, und niemand schreibt",
      "der Trend l\xE4uft, und er versteht ihn immer noch nicht"
    ],
    "stakes": [
      "Der Einsatz ist Zugeh\xF6rigkeit: Drin oder raus.",
      "Der Einsatz ist Coolness: Echt oder tryhard.",
      "Der Einsatz ist Identit\xE4t: Selbstbild oder Performance.",
      "Der Einsatz ist Tempo: Mitgehen oder zur\xFCckbleiben.",
      "Der Einsatz ist Humor: Lachen oder ausgelacht werden.",
      "Der Einsatz ist der Platz in der Gruppe.",
      "Der Einsatz ist ein Ruf, der bleibt.",
      "Der Einsatz ist eine Freundschaft von fr\xFCher.",
      "Der Einsatz ist ein Sommer.",
      "Der Einsatz ist Ehrlichkeit vor allen.",
      "Der Einsatz ist der Mut, zuerst zu schreiben."
    ],
    "endings": [
      "Und pl\xF6tzlich ist es peinlich, alles davon.",
      "Und alle f\xFChlen es, keiner sagt es.",
      "So wird es ein Insider, f\xFCr genau vier Leute.",
      "Und das Meme stirbt an einem Donnerstag.",
      "Und wir sagen einfach: wild.",
      "Und irgendwann schreibt doch jemand.",
      "So bleibt der Chat auf gelesen stehen.",
      "Und am Montag redet keiner mehr davon.",
      "Und der Bus f\xE4hrt weiter, alle steigen aus.",
      "So endet die Story, ungespeichert.",
      "Und das Wort benutzt jetzt niemand mehr.",
      "Und der Chat bleibt auf gelesen, den ganzen Abend.",
      "So redet am Montag keiner mehr davon, aber alle wissen es.",
      "Und irgendwer macht ein Foto, das bleibt."
    ]
  },
  "modernarchitecture": {
    "motifs": [
      "eine Glasfassade ohne Vorhang",
      "eine Betonwand mit Schattenkante",
      "ein Raum ohne T\xFCren",
      "eine Treppe aus Stahl",
      "ein Flachdach unter offenem Himmel",
      "eine Stadt aus rechten Winkeln",
      "ein Fensterband ohne Rahmen",
      "ein Innenhof mit Lichtschacht",
      "eine wei\xDFe Fl\xE4che ohne Dekor",
      "ein Geb\xE4ude auf Stelzen",
      "ein Grundriss ohne einen einzigen Gang",
      "Sichtbeton mit den Spuren der Schalung",
      "ein Fenster, das die Wand ersetzt",
      "eine Rampe statt einer Treppe",
      "ein Haus auf St\xFCtzen \xFCber dem Boden",
      "ein Modell aus Karton unter einer Lampe",
      "ein Innenhof, den niemand betritt",
      "eine Fuge, die durch das ganze Geb\xE4ude l\xE4uft",
      "ein Dach als Garten",
      "eine Wand, die sich verschieben l\xE4sst",
      "der Schatten eines Vordachs am Mittag",
      "ein Treppenhaus aus Licht",
      "ein Bau, der die Stra\xDFe ignoriert",
      "ein Detail im Ma\xDFstab eins zu eins",
      "ein Fenster, vor dem ein Vorhang h\xE4ngt"
    ],
    "hooks": [
      "Der Raum ist gr\xF6\xDFer als gedacht, und leerer.",
      "Nichts lenkt ab, und das ist zuerst unangenehm.",
      "Das Licht f\xE4llt so genau, als w\xE4re es entworfen.",
      "Die W\xE4nde schweigen, und der Raum wird lauter.",
      "Die Stadt beginnt hinter dem Glas des Wohnzimmers.",
      "der Bauherr will eine Wand mehr, genau in der Mitte",
      "das Modell steht seit einem Jahr unber\xFChrt",
      "der Beton kommt zwei Grad zu kalt",
      "ein Fenster sitzt zwanzig Zentimeter neben dem Plan",
      "die Genehmigung verlangt ein Satteldach, wie im ganzen Ort",
      "der Grundriss funktioniert nur ohne M\xF6bel",
      "auf der Baustelle steht eine Wand, die nicht im Plan ist",
      "die Fuge l\xE4uft an der Ecke nicht durch",
      "der Nachbar klagt gegen das Licht aus dem Treppenhaus",
      "der Entwurf gewinnt und wird nicht gebaut",
      "die Bewohner h\xE4ngen Vorh\xE4nge vor das Glas"
    ],
    "props": [
      "ein Architekturmodell",
      "einen Grundrissplan",
      "eine Skizze auf Transparentpapier",
      "eine Betonprobe",
      "eine Stahlstrebe",
      "eine Glasplatte",
      "ein Ma\xDFband",
      "ein CAD-Tablet",
      "einen Lichtschalter",
      "eine Designlampe",
      "einen Ma\xDFstab",
      "ein Rollenpaket Pl\xE4ne",
      "einen Bleistift",
      "ein Modell aus Graupappe",
      "eine Betonprobe mit Datum",
      "einen Bauzeitenplan",
      "ein Lichtbild der Baustelle",
      "eine Baugenehmigung",
      "ein Muster der Fassadenplatte",
      "einen Zollstock",
      "ein Leitdetail auf Transparentpapier",
      "eine Rechnung des Statikers"
    ],
    "turns": [
      "die Form folgt der Funktion, bis nichts mehr \xFCbrig ist",
      "innen und au\xDFen sind nicht mehr zu trennen",
      "das Ornament verschwindet, und mit ihm die Handschrift",
      "der Raum wird flexibel und verliert dabei seine Mitte",
      "die Technik wird sichtbar und \xFCbernimmt die Fassade",
      "aus Transparenz wird Kontrolle, ohne dass es jemand beschlie\xDFt",
      "der Minimalismus wird zur Aussage und damit zum Ornament",
      "die Statik verlangt eine St\xFCtze im freien Raum",
      "der Bauherr zieht ein und stellt alles um",
      "das Licht trifft anders als gerechnet, zwei Stunden zu fr\xFCh",
      "eine Wand f\xE4llt weg und der Entwurf wird besser",
      "die Norm streicht das eine Detail, an dem alles hing",
      "der Rohbau ist sch\xF6ner als das fertige Haus",
      "der Beton zeigt einen Fehler, den keiner beheben will",
      "die Nutzung \xE4ndert sich vor der \xDCbergabe",
      "ein Nachbargeb\xE4ude nimmt das Licht, ein Jahr nach der \xDCbergabe",
      "die Fuge wird zum Thema der Bauleitung",
      "das Geb\xE4ude bekommt einen Namen von den Bewohnern"
    ],
    "obstacles": [
      "das Material bleibt kalt, was immer man davorstellt",
      "in diesem Raum gibt es keinen Winkel f\xFCr sich",
      "die Kosten wachsen schneller als der Rohbau",
      "die Stadt r\xFCckt von drei Seiten an das Grundst\xFCck",
      "was lange h\xE4lt, ist teuer, und was billig ist, h\xE4lt nicht",
      "das Glas trennt sch\xE4rfer als jede Mauer",
      "die Funktion stimmt, und wohnen mag dort niemand",
      "die Kosten laufen der Planung davon",
      "die Norm verbietet die offene Treppe",
      "der Beton bleibt kalt, was immer man einbaut",
      "die Bewohner wollen nicht gesehen werden",
      "die Genehmigung fehlt f\xFCr das Flachdach",
      "der Statiker widerspricht dem Entwurf an drei Stellen",
      "der Winter h\xE4lt den Rohbau f\xFCr elf Wochen an",
      "die Fassade h\xE4lt die W\xE4rme nicht",
      "der Bauherr wechselt das B\xFCro mitten in der Ausf\xFChrung",
      "ein Denkmalschutz greift nachtr\xE4glich f\xFCr die Nachbarh\xE4user",
      "das Grundst\xFCck ist einen Meter zu schmal",
      "die Handwerker kennen das Detail nicht"
    ],
    "stakes": [
      "Der Einsatz ist Lebensqualit\xE4t: Raum als Haltung.",
      "Der Einsatz ist Nachhaltigkeit: Zukunft bauen oder verbrauchen.",
      "Der Einsatz ist Identit\xE4t: Geb\xE4ude als Aussage.",
      "Der Einsatz ist Offenheit: Transparenz oder \xDCberwachung.",
      "Der Einsatz ist Zeit: Zeitlos oder Trend.",
      "Der Einsatz ist ein Haus, in dem jemand wohnen muss.",
      "Der Einsatz ist ein Detail, an dem der ganze Bau h\xE4ngt.",
      "Der Einsatz ist das B\xFCro und die n\xE4chsten drei Jahre.",
      "Der Einsatz ist eine Idee, die den ersten Kontakt mit dem Geld \xFCberlebt.",
      "Der Einsatz ist die Stra\xDFe, die das Geb\xE4ude ver\xE4ndert.",
      "Der Einsatz ist der Rohbau: Danach \xE4ndert sich nichts mehr.",
      "Der Einsatz ist ein Name auf einer Tafel am Eingang."
    ],
    "endings": [
      "Und das Licht bleibt, auch wenn niemand mehr da ist.",
      "Und der Raum atmet weiter, ohne jemanden darin.",
      "So steht am Ende nur noch die Struktur.",
      "Und die Stadt nimmt es auf, nach ein paar Jahren.",
      "Und das Geb\xE4ude wird zu einer Idee, die man abbildet.",
      "Und das Haus steht, ohne den, der es gedacht hat.",
      "So bleibt der Entwurf im Regal, gerollt.",
      "Am Ende h\xE4ngen Vorh\xE4nge vor dem Glas.",
      "Und der Beton wird \xE4lter und besser.",
      "So \xFCbergibt man die Schl\xFCssel und geht durch den Hof.",
      "Und die Fuge l\xE4uft durch, wenigstens sie.",
      "Der Bau ist fertig, die Idee bleibt es nicht.",
      "Und im Winter merkt man, wo gespart wurde."
    ],
    "verwandlungen": [
      "Beton\u2192Stein",
      "Fassade\u2192Haut",
      "Fenster\u2192Auge",
      "Plan\u2192Vorsatz",
      "Treppe\u2192Rampe",
      "Haus\u2192Geh\xE4use",
      "Wand\u2192Grenze",
      "Fuge\u2192Naht"
    ]
  },
  "philosophie": {
    "motifs": [
      "eine Bibliothek ohne Ende",
      "ein Spiegel, der Fragen stellt",
      "eine Br\xFCcke zwischen zwei Wahrheiten",
      "ein Labyrinth aus Begriffen",
      "ein Baum aus Argumenten",
      "eine Waage ohne Gewichte",
      "ein Kreis ohne Mittelpunkt",
      "eine Uhr, die M\xF6glichkeiten misst",
      "eine T\xFCr zwischen Sein und Werden",
      "ein Fluss, in dem Gedanken treiben",
      "ein H\xF6rsaal, aus dem alle gegangen sind",
      "eine Landkarte des Denkbaren",
      "ein Satz, der sich selbst bestreitet",
      "ein Hof, in dem zwei Schulen sich meiden",
      "eine Treppe, die im selben Stockwerk endet",
      "ein Wort, f\xFCr das es keinen Gegenstand gibt",
      "ein Schatten ohne K\xF6rper",
      "eine Bank, auf der zwei Fremde schweigen",
      "ein Regal voller ungelesener Widerlegungen",
      "eine H\xF6hle mit dem Ausgang nach innen",
      "ein Beweis, den niemand nachrechnet",
      "das Ger\xFCst eines Systems ohne Geb\xE4ude",
      "eine Grenze, die von beiden Seiten anders aussieht",
      "ein Faden, der aus dem Labyrinth herausf\xFChrt und hinein",
      "eine Sammlung von Anf\xE4ngen",
      "ein Glas, halb voll mit Definitionen",
      "ein Nebel, in dem die Umrisse deutlicher werden",
      "ein K\xE4fig, dessen T\xFCr nach innen aufgeht",
      "ein Wegweiser, der auf sich selbst zeigt",
      "eine Bibliothek, in der ein Buch fehlt"
    ],
    "hooks": [
      "Was, wenn das Offensichtliche die gr\xF6\xDFte T\xE4uschung w\xE4re?",
      "Ich wusste pl\xF6tzlich nicht mehr, was Wissen bedeutet.",
      "Eine einfache Frage bringt die Welt ins Wanken.",
      "Der Widerspruch scheint vern\xFCnftiger als die Gewissheit.",
      "Vielleicht beginnt Wahrheit dort, wo Antworten enden.",
      "Der Satz stimmt, und er hilft nichts.",
      "Wer fragt, hat die Antwort schon halb ver\xE4ndert.",
      "Zwei Menschen meinen dasselbe und streiten seit Jahren.",
      "Das Beispiel widerlegt die Regel, an der es h\xE4ngt.",
      "Etwas ist wahr, seit niemand mehr hinsieht.",
      "Die Begr\xFCndung ist l\xE4nger als das, was sie begr\xFCndet.",
      "Ein Irrtum h\xE4lt sich, weil er n\xFCtzlich ist.",
      "Das Wort passt, aber die Sache nicht.",
      "Was sich beweisen l\xE4sst, war ohnehin nie strittig.",
      "Der Zweifel kommt zu sp\xE4t und trifft trotzdem.",
      "Jemand hat recht und wei\xDF nicht, warum.",
      "Die Ordnung stimmt, nur die Wirklichkeit nicht.",
      "Der Widerspruch war von Anfang an eingebaut.",
      "Am Ende der Kette h\xE4ngt niemand.",
      "Eine Antwort steht fest und sucht ihre Frage."
    ],
    "props": [
      "ein leeres Buch",
      "eine Feder",
      "einen Kompass",
      "eine Sanduhr",
      "eine Kerze",
      "eine Lupe",
      "ein Schachbrett",
      "einen Stein",
      "eine Maske",
      "einen Schl\xFCssel",
      "ein Kollegheft",
      "eine Uhr ohne Zeiger",
      "einen Zirkel",
      "ein Fernrohr",
      "eine Waage",
      "einen Faden",
      "ein Prisma",
      "eine Tafel",
      "einen W\xFCrfel",
      "eine Karteikarte",
      "ein Lot",
      "einen Spiegel",
      "eine Landkarte",
      "ein Lineal",
      "einen Zettel mit einem Wort",
      "ein Pendel",
      "eine Brille",
      "einen Stundenplan"
    ],
    "turns": [
      "ein Axiom zerf\xE4llt",
      "ein Begriff erh\xE4lt eine neue Bedeutung",
      "der Beobachter wird Teil des Problems",
      "zwei Gegens\xE4tze erweisen sich als identisch",
      "Zeit wird zur Illusion",
      "Freiheit widerspricht der Sicherheit",
      "die Frage wird wichtiger als die Antwort",
      "die Voraussetzung war der Schluss",
      "das Beispiel wird zur Regel",
      "der Streit betraf nie die Sache",
      "die Ausnahme tr\xE4gt das Gesetz",
      "das Werkzeug bestimmt, was gefunden wird",
      "der Zweifel best\xE4tigt, was er pr\xFCfen sollte",
      "die Grenze verschiebt sich, sobald man sie beschreibt",
      "aus dem Nebensatz wird die Hauptsache",
      "die Frage war falsch gestellt und deshalb fruchtbar",
      "das Ganze zeigt sich als Teil",
      "die Regel gilt, aber f\xFCr etwas anderes",
      "der Einwand wird zum besseren Argument",
      "die Ordnung war eine Gewohnheit",
      "das Wissen kehrt zum Nichtwissen zur\xFCck",
      "die Definition schlie\xDFt aus, worum es ging"
    ],
    "obstacles": [
      "ein Paradoxon blockiert den Weg",
      "Sprache reicht nicht aus",
      "Gewohnheit verhindert Erkenntnis",
      "jede L\xF6sung erzeugt eine neue Frage",
      "der Zweifel w\xE4chst",
      "Logik widerspricht Intuition",
      "Wahrheit besitzt mehrere Gesichter",
      "der Begriff h\xE4lt der Sache nicht stand",
      "jeder Schritt setzt den n\xE4chsten voraus",
      "die Regel gilt f\xFCr alle au\xDFer f\xFCr sich selbst",
      "das Beispiel ist zu gut gew\xE4hlt",
      "der Beweis st\xFCtzt sich auf das Bewiesene",
      "die Erfahrung sagt das Gegenteil",
      "es fehlt ein Wort f\xFCr das, was gemeint ist",
      "die Zeit reicht f\xFCr das Denken nicht",
      "wer widerlegt, muss zuerst verstehen",
      "die Aussage l\xE4sst sich nicht pr\xFCfen",
      "zwei Gr\xFCnde gelten und schlie\xDFen sich aus",
      "die Sprache legt fest, bevor gedacht wird",
      "das Naheliegende blockiert das Genaue",
      "der Zweifel frisst auch sich selbst"
    ],
    "stakes": [
      "Der Einsatz ist Erkenntnis: Was kann ich wissen?",
      "Der Einsatz ist Freiheit: Wer entscheidet?",
      "Der Einsatz ist Identit\xE4t: Wer bin ich?",
      "Der Einsatz ist Moral: Was soll ich tun?",
      "Der Einsatz ist Wirklichkeit: Was ist wirklich?",
      "Der Einsatz ist Zeit: Was bleibt von einem Gedanken?",
      "Der Einsatz ist Sprache: Reicht sie f\xFCr die Sache?",
      "Der Einsatz ist Ordnung: Tr\xE4gt sie oder bricht sie?",
      "Der Einsatz ist Zweifel: Wo h\xF6rt er auf?",
      "Der Einsatz ist Verantwortung: Wer tr\xE4gt sie?",
      "Der Einsatz ist Ma\xDF: Wonach wird gemessen?",
      "Der Einsatz ist Grund: Wo steht der letzte?",
      "Der Einsatz ist Grenze: Was liegt dahinter?"
    ],
    "endings": [
      "Und die Frage bleibt bestehen.",
      "Und der Zweifel wird zum Anfang.",
      "So entsteht eine neue Perspektive.",
      "Und die Wahrheit l\xE4chelt schweigend.",
      "Und das Denken beginnt von vorn.",
      "Und das Argument bleibt liegen, wo es hinfiel.",
      "So endet der Satz und die Frage nicht.",
      "Und die Ordnung h\xE4lt, f\xFCr heute.",
      "Und was \xFCbrig bleibt, l\xE4sst sich nicht widerlegen.",
      "So beginnt das Nichtwissen von vorn.",
      "Und der Begriff geht weiter als der, der ihn braucht.",
      "Und die Grenze bleibt, wo sie gezogen wurde.",
      "So bleibt eine Regel und ihr Gegenteil."
    ],
    "verwandlungen": [
      "Bibliothek\u2192Sammlung",
      "Spiegel\u2192Schatten",
      "Labyrinth\u2192Gitter",
      "Waage\u2192Neigung",
      "Uhr\u2192Sanduhr",
      "Kerze\u2192Asche",
      "Schl\xFCssel\u2192Riegel",
      "Maske\u2192Miene",
      "Paradoxon\u2192Gesetz",
      "Zweifel\u2192Verdacht",
      "Frage\u2192Antwort",
      "Begriff\u2192Name"
    ]
  },
  "klimakrise": {
    "motifs": [
      "ein Himmel, der nach Rauch und Ru\xDF riecht",
      "schmelzendes Eis, das den Fluss hinabtreibt",
      "eine Sonne, die zu hei\xDF \xFCber den D\xE4chern brennt",
      "Nebel aus Abgasen \xFCber der Stadt",
      "ein Wald, der stumm verdorrt, w\xE4hrend die Stadt weiterl\xE4uft",
      "aschgraue Wolken, die keine Jahreszeit kennen",
      "ein Fluss, der immer weiter zur\xFCckweicht",
      "Risse in der Erde wie alte Wunden",
      "ein Flussbett mit rissigem Grund",
      "ein Deich, der zu niedrig geworden ist",
      "Ventilatoren in jedem Fenster",
      "eine Badeanstalt ohne Wasser",
      "Sands\xE4cke vor einer Ladent\xFCr",
      "ein Feld, das man nicht mehr beregnet",
      "der Pegel am Br\xFCckenpfeiler",
      "ein Baum mit St\xFCtzger\xFCst",
      "Schatten, den sich alle teilen",
      "ein L\xF6schteich, der gr\xFCn steht",
      "eine Warnung im Radio, wie jeden Tag",
      "Rolll\xE4den am Mittag",
      "ein Gletscher unter Planen",
      "Bahngleise, die sich verziehen",
      "ein Regenmesser mit null",
      "eine Anzeigetafel mit vierzig Grad"
    ],
    "hooks": [
      "ein Thermometer, das r\xFCckw\xE4rts steigt",
      "ein vergilbtes Kartenblatt zeigt ein Meer, das es nicht mehr gibt",
      "ein Kompass zeigt nur noch nach S\xFCden",
      "ein B\xE4cker fl\xFCstert von einer D\xFCrre, die niemand sah",
      "jemand sammelt Schneeflocken, die l\xE4ngst h\xE4tten schmelzen m\xFCssen",
      "ein Geruch von verbranntem Getreide ohne Feuer",
      "ein Vogel singt ein Lied aus einer anderen Zeit",
      "auf dem Marktplatz liegt Asche, die nach Zukunft schmeckt",
      "Der Regen kommt, und der Boden nimmt ihn nicht.",
      "Die Warnstufe gilt seit acht Wochen.",
      "Der Fluss f\xFChrt Wasser und niemand traut ihm.",
      "Der Winter f\xE4llt aus, und das Obst bl\xFCht zu fr\xFCh.",
      "Ein Feld wird umgepfl\xFCgt, bevor es reif ist.",
      "Am Deich z\xE4hlt jemand die Sands\xE4cke zum dritten Mal.",
      "Die Nacht k\xFChlt nicht mehr ab.",
      "Der Brunnen gibt tr\xFCbes Wasser.",
      "Ein Zug f\xE4llt aus wegen der Hitze.",
      "Auf dem Marktplatz steht ein Tank."
    ],
    "props": [
      "eine Karte mit verschwundenen K\xFCstenlinien",
      "einen Krug voll tr\xFCben Regenwassers",
      "eine Uhr aus geschmolzenem Zinn",
      "ein Tagebuch mit Wetteraufzeichnungen ohne Datum",
      "eine Kohleschale, die niemals erkaltet",
      "einen Winterhandschuh, der brennend hei\xDF ist",
      "eine Flasche mit stickiger, schwerer Luft",
      "ein Fernrohr, das nur Nebel zeigt",
      "einen Faden aus verbranntem Kornfeld",
      "einen Kanister",
      "eine Gie\xDFkanne",
      "ein Thermometer",
      "eine Schaufel",
      "einen Sandsack",
      "ein Funkger\xE4t",
      "eine Warnweste",
      "einen Regenmesser",
      "eine Plane",
      "einen Kompressor",
      "ein Merkblatt",
      "einen Wasserhahn",
      "eine K\xFChlbox"
    ],
    "turns": [
      "pl\xF6tzlich wei\xDF niemand mehr, welches Jahr wirklich ist",
      "in der Asche zeichnet sich ein vertrautes Gesicht ab",
      "die Ernte verfault, noch bevor sie geerntet wird",
      "aus dem kalten Keller steigt pl\xF6tzlich Hitze auf",
      "die Regale bleiben leer, doch der Himmel selbst scheint zu hungern",
      "ein Bericht aus dem Norden spricht von einem Meer, das verschwindet",
      "es zeigt sich, dass die Ver\xE4nderung \xE4lter ist als jede Messung",
      "das Eis unter der Stadt beginnt zu sprechen",
      "der Pegel steigt schneller als gerechnet",
      "die Ernte wird vorgezogen und misslingt",
      "die Sperrung wird aufgehoben und gilt weiter",
      "ein Nachbarort schickt Wasser",
      "der Wind dreht auf die Stadt zu",
      "das Feuer springt \xFCber den Weg",
      "die Warnung kommt, nachdem es passiert ist",
      "der Deich h\xE4lt, an anderer Stelle nicht",
      "es regnet drei Tage und \xE4ndert nichts",
      "ein Plan von 1980 wird hervorgeholt"
    ],
    "obstacles": [
      "die Stra\xDFen sind verstopft von Rauch und Stillstand",
      "der Fluss f\xFChrt kein Wasser mehr, nur Staub",
      "niemand glaubt der Warnung, die l\xE4ngst vorliegt",
      "die K\xE4lte des Winters bleibt aus, und das macht Angst",
      "die Kornkammern sind leer, obwohl die Saat aufging",
      "der Nebel verschluckt jeden Fluchtweg",
      "die Zust\xE4ndigen misstrauen jeder Zahl, die nicht passt",
      "die Hitze l\xE4hmt selbst die Entschlossenen",
      "die Pumpe schafft die Menge nicht",
      "der Boden nimmt kein Wasser mehr auf",
      "die Stra\xDFe nach Norden ist gesperrt",
      "es fehlt an Schatten f\xFCr alle",
      "das Netz bricht bei Spitzenlast zusammen",
      "niemand ist f\xFCr den Bach zust\xE4ndig",
      "die Vorr\xE4te reichen f\xFCr drei Tage",
      "die Hilfe kommt aus der falschen Richtung",
      "es gibt keinen zweiten Brunnen",
      "der Wind steht seit Tagen"
    ],
    "stakes": [
      "Der Einsatz ist das letzte Gr\xFCn eines sterbenden Gartens.",
      "Der Einsatz ist die Zukunft, die im Rauch vergl\xFCht.",
      "Der Einsatz ist eine K\xFCste, die im steigenden Wasser versinkt.",
      "Der Einsatz ist das Vertrauen ganzer L\xE4nder in eine gemeinsame Erde.",
      "Der Einsatz ist die letzte Ernte vor der gro\xDFen D\xFCrre.",
      "Der Einsatz ist die Wahrheit hinter der brennenden K\xE4lte.",
      "Der Einsatz ist ein B\xFCndnis gegen einen unsichtbaren Feind: die Erw\xE4rmung selbst.",
      "Der Einsatz ist die Erinnerung an einen Planeten, der einmal k\xFChl war.",
      "Der Einsatz ist eine Ernte.",
      "Der Einsatz ist ein Deich und was dahinter liegt.",
      "Der Einsatz ist Trinkwasser f\xFCr die Woche.",
      "Der Einsatz ist ein Dorf am Hang.",
      "Der Einsatz ist der n\xE4chste Sommer.",
      "Der Einsatz ist ein Fluss, der bleiben soll."
    ],
    "endings": [
      "So endet ein Zeitalter im Rauch der eigenen Zukunft.",
      "Und die Asche bedeckt die Stadt wie ein zweites Schweigen.",
      "So schlie\xDFt sich der Kreis aus Feuer und Eis.",
      "Am Ende bleibt nur die Hitze, die keiner erkl\xE4ren kann.",
      "Die Debatte frisst sich selbst, w\xE4hrend die Erde weiter gl\xFCht.",
      "So verschwindet eine Landschaft im Nebel der Ver\xE4nderung.",
      "Der Winter kehrt zur\xFCck, doch das Eis folgt ihm nicht mehr.",
      "Am Horizont brennt kein Feuer mehr \u2013 nur die Erinnerung daran.",
      "Und der Pegel f\xE4llt, langsamer als er stieg.",
      "So bleibt die Warnstufe bestehen.",
      "Am Abend k\xFChlt es um zwei Grad.",
      "Und die Sands\xE4cke bleiben liegen, f\xFCr sp\xE4ter.",
      "So endet der Tag, und der Boden ist trocken.",
      "Und im Radio kommt dieselbe Meldung."
    ]
  },
  "ritterromane": {
    "motifs": [
      "ein Wappen ohne Farbe an kalter Mauer",
      "eine R\xFCstung, die niemand mehr tr\xE4gt",
      "das Echo eines Schwertes, das nie gezogen wird",
      "ein Banner, das \xFCber dem Bergfried im Wind steht",
      "eine Krone aus Kerzenlicht \xFCber dem leeren Saal",
      "ein Ritterhelm mit leeren Augenh\xF6hlen",
      "das Klirren von Kettenhemden im Wind der Schlucht",
      "eine Tafelrunde, an der niemand mehr sitzt",
      "der Geruch von Eisen und altem Leder",
      "ein Turnierplatz unter Neuschnee",
      "der Rost auf einem Kettenhemd",
      "ein Sattel ohne Reiter",
      "die Bahre eines Namenlosen",
      "ein Bergfried, in dem kein Licht brennt",
      "Fackelru\xDF an der Saaldecke",
      "eine Truhe mit dem Siegel eines toten Hauses",
      "das Wappen \xFCber einer zugemauerten T\xFCr",
      "Hufspuren, die vor dem Tor enden",
      "eine Fahne, die zur falschen Seite weht",
      "die Kerbe eines Schwerts im T\xFCrsturz",
      "ein Turnierstab, in der Mitte gebrochen",
      "die Bank, auf der der Herold sa\xDF",
      "Stroh im Innenhof nach dem Regen",
      "ein Kelch, aus dem niemand mehr trinkt",
      "die Kette eines Falken ohne Falken",
      "ein Grabstein ohne Jahreszahl",
      "der Schatten des Wehrgangs am Mittag"
    ],
    "hooks": [
      "ein Schwertgriff lehnt an der Wendeltreppe",
      "jemand hat ein Wappen in den T\xFCrbalken geritzt",
      "ein Ritterhandschuh liegt mitten auf dem Weg",
      "der Ruf vom Turm klingt wie ein Herold",
      "\xFCber dem Tor steht ein Name in gotischen Lettern",
      "ein Sporn liegt im Hof, ohne Besitzer",
      "die Uhr zeigt eine Zeit, die es im Kalender nicht gibt",
      "ein Siegelring liegt am Brunnenrand",
      "irgendwo singt jemand ein Lied von Rittern, die nie heimkehren",
      "Ein Geleitbrief tr\xE4gt ein Siegel, das seit Jahren nicht mehr gef\xFChrt wird.",
      "Der Herold ruft einen Namen, den hier niemand kennt.",
      "Im Hof steht ein Pferd, dessen Sattel noch warm ist.",
      "Der Schwur wird gesprochen, bevor jemand fragt, worauf.",
      "Ein Wappen wurde \xFCbermalt, das Rot schl\xE4gt durch.",
      "Die Wache l\xE4sst jemanden ein, ohne nach dem Namen zu fragen.",
      "Der Brief kommt an, obwohl der Bote nie ankam.",
      "Im Saal fehlt ein Stuhl, und niemand nennt den Grund.",
      "Die Glocke schl\xE4gt zur falschen Stunde.",
      "Jemand tr\xE4gt Trauer f\xFCr einen, der lebt."
    ],
    "props": [
      "einen zerbrochenen Schwertgriff",
      "eine R\xFCstung aus vernietetem Leder",
      "einen Siegelring mit unbekanntem Wappen",
      "eine Standarte aus verblichener Seide",
      "einen Helm mit Rissen wie Kartenlinien",
      "eine Pergamentrolle voller Wegmarken",
      "einen Handschuh aus Kettenmaschen",
      "eine Kerze in einem alten Wandleuchter",
      "einen Dolch, der nach Schmiedefeuer riecht",
      "ein Kettenhemd",
      "einen Geleitbrief",
      "eine Lanze",
      "einen Steigb\xFCgel",
      "ein Wappenschild",
      "eine Fackel",
      "einen Sporn",
      "ein Trinkhorn",
      "eine Armbrust",
      "einen Sattelgurt",
      "ein Wachstuch",
      "einen Schwertgurt",
      "eine Fibel",
      "ein Reisemantel"
    ],
    "turns": [
      "Pl\xF6tzlich tr\xE4gt sie ein Wappen, das ihr nicht geh\xF6rt.",
      "Der Hof verwandelt sich f\xFCr einen Atemzug in einen Turnierplatz.",
      "Niemand hat gesehen, wie das Duell endet, und doch wei\xDF es die ganze Burg.",
      "Das letzte Tageslicht wird zum Fackelschein im Bergfried.",
      "Die Wette ist nie ein Spiel, sondern ein Schwur.",
      "Aus dem Torbogen kommt der Hall von Hufen, wo keine Pferde stehen.",
      "Ihr Schatten tr\xE4gt pl\xF6tzlich einen Umhang, den sie nie besitzt.",
      "das Siegel erweist sich als F\xE4lschung",
      "der Herausforderer nennt seinen Namen nicht",
      "die Burg \xF6ffnet, ohne dass jemand befahl",
      "das Turnier wird abgesagt und findet statt",
      "der Schwur bindet den Falschen",
      "ein Lehen wechselt in einer Nacht den Herrn",
      "die R\xFCstung passt einem anderen",
      "der Bote bringt die eigene Nachricht zur\xFCck",
      "das Fallgitter bleibt oben",
      "der Gegner reicht die Waffe",
      "ein Wappen wird gestrichen und neu gemalt"
    ],
    "obstacles": [
      "Das Fallgitter f\xE4llt, ehe jemand hindurch ist.",
      "Der Torw\xE4chter fragt nach einem Geleitbrief, den es nicht gibt.",
      "Das Wappen an der Wand l\xE4sst sich nicht entziffern.",
      "Der letzte Bote reitet ab, bevor der Schwur eingel\xF6st ist.",
      "Der Gegner der Wette ist l\xE4ngst verschwunden, aber die Schuld bleibt.",
      "Der Hof ist leer, doch das Tor bleibt verriegelt.",
      "Der Nebel im Graben verschluckt jeden Fluchtweg.",
      "das Tor wird bei Dunkelheit nicht mehr ge\xF6ffnet",
      "kein Zeuge will den Schwur best\xE4tigen",
      "der Weg \xFCber den Pass ist verschneit",
      "die Waffenkammer ist verschlossen",
      "der Herold verweigert die Ansage",
      "das Pferd tr\xE4gt keinen fremden Reiter",
      "die Fehde ruht und gilt",
      "niemand kennt das Wappen mehr",
      "der Brief erreicht die Burg zu sp\xE4t",
      "die Wache wechselt zur falschen Stunde"
    ],
    "stakes": [
      "Der Einsatz ist ihre Ehre als Ritterin ohne Lehen.",
      "Der Einsatz ist ein Schwur, den niemand mehr einfordern kann.",
      "Der Einsatz ist das letzte Wappen ihrer verlorenen Familie.",
      "Der Einsatz ist der Rang, den sie nie erh\xE4lt.",
      "Der Einsatz ist Vertrauen: in eine Zeit, die keine Ritter mehr kennt.",
      "Der Einsatz ist ihr Name, geschrieben in einem Buch, das niemand liest.",
      "Der Einsatz ist die Krone eines Sieges, den keiner bezeugen wird.",
      "Der Einsatz ist ein Lehen, das keiner verwaltet.",
      "Der Einsatz ist ein Name, den man f\xFChren darf.",
      "Der Einsatz ist die Fehde, die enden k\xF6nnte.",
      "Der Einsatz ist ein Platz an der Tafel.",
      "Der Einsatz ist ein Pferd und der Weg damit.",
      "Der Einsatz ist das Wort vor Zeugen."
    ],
    "endings": [
      "So verklingt das letzte Echo eines Turniers, das keiner sieht.",
      "Der Weg f\xFChrt weiter, und mit ihm die Legende, die niemand glaubt.",
      "So schlie\xDFt sich das Visier f\xFCr immer.",
      "Am Ende bleibt nur ein Wappen im Staub des Hofes.",
      "So endet die Wette, die niemand bezeugt.",
      "Die Nacht nimmt den Schwur mit sich in den Wald.",
      "Und im Hof bleibt das Stroh liegen.",
      "So schl\xE4gt die Glocke, und niemand tritt vor.",
      "Am Morgen steht das Tor offen, der Hof ist leer.",
      "Und das Wappen bleibt, wo es h\xE4ngt.",
      "So reitet der Letzte, ohne sich umzusehen.",
      "Und der Schnee deckt den Turnierplatz zu."
    ]
  },
  "liebesromane": {
    "motifs": [
      "ein Herz, das im Takt fremder Schritte schl\xE4gt",
      "ein Liebesbrief, versiegelt mit Wachs und Blut",
      "zwei Schatten, die sich unter Kerzenlicht ber\xFChren",
      "ein Medaillon mit einem fremden Portr\xE4t",
      "eine Rose, die \xFCber Nacht welkt",
      "ein Blick \xFCber den Ballsaal, der alles ver\xE4ndert",
      "ein Fl\xFCstern von Liebe hinter geschlossenen T\xFCren",
      "ein Tanz, der nie zu Ende zu sein scheint",
      "ein Ballsaal, in dem zwei Blicke sich kreuzen",
      "ein Brief, der dreimal umgeschrieben wurde",
      "ein Handschuh, der auf einer Treppe liegen bleibt",
      "ein Garten, in dem man ungest\xF6rt sprechen kann",
      "ein Kutschfenster, das im Regen beschl\xE4gt",
      "ein Name, den niemand aussprechen soll",
      "ein Tanz, f\xFCr den ein Platz frei gehalten wird",
      "eine T\xFCr, hinter der jemand wartet und nicht klopft",
      "ein Ring, der zur\xFCckgegeben und behalten wird",
      "ein Sommerhaus, das im Winter leer steht",
      "ein Fensterplatz, von dem man die Stra\xDFe sieht",
      "ein B\xFCndel Briefe mit einem Band"
    ],
    "hooks": [
      "ein Ring, der nicht an ihre Hand passt",
      "ein fremder Akzent im vertrauten Raum",
      "ein Brief ohne Unterschrift, nur mit einem Kuss",
      "ein Duft von fremdem Parfum im Treppenhaus",
      "ein Herzschlag, der zu schnell f\xFCr Etikette ist",
      "ein verbotenes L\xE4cheln zwischen zwei Fronten",
      "eine Tr\xE4ne auf einem versiegelten Brief",
      "Ein Fremder wird f\xFCr den n\xE4chsten Tanz angek\xFCndigt.",
      "Der Brief kommt zur\xFCck, unge\xF6ffnet.",
      "Sie erkennt eine Handschrift, die es nicht geben kann.",
      "Auf der G\xE4steliste steht ein Name zu viel.",
      "Er reist ab, und niemand hat sich verabschiedet.",
      "Ein Ring liegt auf dem Tisch, ohne Erkl\xE4rung.",
      "Die Tante k\xFCndigt einen Besuch aus der Stadt an.",
      "Im Garten spricht jemand, den man nicht sehen kann.",
      "Ein Versprechen wird erw\xE4hnt, das sie nie gab.",
      "Der Vater nennt einen Termin und keinen Grund.",
      "Zwei Einladungen gelten f\xFCr denselben Abend.",
      "Ein Ger\xFCcht ist schneller als die Post."
    ],
    "props": [
      "einen Liebesbrief mit fremdem Wappen",
      "ein Medaillon mit verborgenem Portr\xE4t",
      "eine Rose aus einem fremden Garten",
      "einen goldenen Ring ohne Inschrift",
      "ein Taschentuch mit fremden Initialen",
      "eine Locke Haar in einem Samtbeutel",
      "einen F\xE4cher mit geheimer Botschaft",
      "eine Maske vom letzten Fest",
      "eine Tanzkarte, an einer Stelle leer",
      "einen F\xE4cher aus Elfenbein",
      "ein B\xFCndel Briefe mit einem Band",
      "eine Einladung mit einem Siegel",
      "einen Schl\xFCssel zum Gartentor",
      "ein Riechfl\xE4schchen aus Kristall",
      "einen Handschuh ohne den zweiten",
      "eine Locke in einem Umschlag"
    ],
    "turns": [
      "Pl\xF6tzlich erkennt sie in dem Fremden den Mann aus ihren Tr\xE4umen.",
      "Er spricht ihren Namen, als kenne er ihr Herz.",
      "Ein Kuss im Schatten des Torbogens ver\xE4ndert alles.",
      "Sie begreift, dass Liebe gef\xE4hrlicher ist als jedes Ger\xFCcht.",
      "Zwischen all den Stimmen findet ihr Blick nur ihn.",
      "ein Brief kommt an, und alles war ein Missverst\xE4ndnis",
      "der Verlobte gibt ihr Wort zur\xFCck, ohne Groll",
      "der Vater lenkt ein, aus einem falschen Grund",
      "ein Ger\xFCcht rettet, was die Wahrheit zerst\xF6rt h\xE4tte",
      "sie sagt nein und meint es f\xFCr eine Nacht",
      "er kehrt zur\xFCck, ein Jahr zu sp\xE4t",
      "das Erbe f\xE4llt an jemanden, der es nicht wollte",
      "ein Tanz wird abgesagt und dadurch entschieden",
      "sie schreibt den Brief und schickt ihn nicht",
      "ein Zeuge erinnert sich an eine ganz andere Nacht",
      "der Fremde nennt einen Namen, den nur zwei kennen",
      "eine Krankheit h\xE4lt ihn l\xE4nger im Haus als geplant",
      "der Vater stirbt, und die Bedingung stirbt mit ihm"
    ],
    "obstacles": [
      "Die Umst\xE4nde trennen die Liebenden f\xFCr immer.",
      "Ein Ehering bindet sie an einen anderen Mann.",
      "Er muss abreisen, ehe der Morgen graut.",
      "Ein altes Versprechen verlangt Treue, die ihr Herz nicht geben kann.",
      "Zwei H\xE4user trennen, was zusammengeh\xF6rt.",
      "der Vater hat f\xFCr den Herbst anders entschieden",
      "die Post braucht drei Wochen und wird gelesen",
      "ein Ger\xFCcht ist im Umlauf und nicht mehr einzuholen",
      "die Mitgift reicht nicht f\xFCr dieses Haus",
      "die Tante bleibt bis zum Fr\xFChjahr",
      "ein Duell verbietet jede weitere Begegnung",
      "der Name ist im Kreis der Familie verboten",
      "sie darf nicht allein aus dem Haus",
      "er hat kein Recht, um sie zu werben",
      "ein Bruder wacht \xFCber jeden Besuch im Haus",
      "die Verlobung steht schon in der Zeitung",
      "ein Krieg holt ihn zur\xFCck in die Garnison",
      "das Testament bindet sie an einen Namen",
      "die Schwester hat den Brief zuerst gelesen"
    ],
    "stakes": [
      "Der Einsatz ist Liebe: verboten und unsterblich zugleich.",
      "Der Einsatz ist ihr Herz, das dem Falschen geh\xF6rt.",
      "Der Einsatz ist eine Zukunft zwischen zwei Leben.",
      "Der Einsatz ist die Wahrheit \xFCber eine heimliche Liaison.",
      "Der Einsatz ist alles, was sie zu verlieren f\xFCrchtet: ihn.",
      "Der Einsatz ist ein Ruf, den ein Abend zerst\xF6ren kann.",
      "Der Einsatz ist ein Brief, der nie ankommen darf.",
      "Der Einsatz ist ein Sommer, den es nur einmal gibt.",
      "Der Einsatz ist ein Herz, das dem Falschen versprochen ist.",
      "Der Einsatz ist eine Zukunft zwischen zwei H\xE4usern.",
      "Der Einsatz ist die Wahrheit \xFCber eine heimliche Verbindung."
    ],
    "endings": [
      "Und ihre Liebe \xFCberdauert selbst das Schweigen.",
      "So bleibt ihr Herz f\xFCr immer an jenem Ort zur\xFCck.",
      "Am Ende z\xE4hlt nur der Kuss, der die Zeit besiegt.",
      "Die Jahre verblassen, doch ihre Liebe bleibt bestehen.",
      "So schlie\xDFt sich der Kreis zweier Herzen f\xFCr immer.",
      "Und der Brief bleibt in der Schublade liegen.",
      "Und im Garten steht die Bank wie an jenem Abend.",
      "Der Handschuh bleibt auf der Treppe liegen.",
      "Und die Kutsche f\xE4hrt ab, mit beiden darin.",
      "So endet der Sommer, und der Ring bleibt.",
      "Und niemand im Haus spricht je dar\xFCber.",
      "Am Ende bleibt eine Locke in einem Umschlag zur\xFCck.",
      "Und die G\xE4steliste wird f\xFCr den n\xE4chsten Ball geschrieben.",
      "So bleibt der Platz auf der Tanzkarte f\xFCr immer leer."
    ],
    "verwandlungen": [
      "Brief\u2192Beweis",
      "Ring\u2192Reif",
      "Rose\u2192Narbe",
      "Garten\u2192K\xE4fig",
      "Tanz\u2192Kampf",
      "Handschuh\u2192Schatten",
      "Kutsche\u2192Wolke",
      "Medaillon\u2192Fenster"
    ]
  },
  "bergwelt": {
    "motifs": [
      "ein Glockenturm, der ins Tal ruft und niemand kommt",
      "Schnee, der die Wunden nicht verschlie\xDFt, nur verbirgt",
      "vernarbte Kn\xF6chel im Kerzenlicht",
      "ein Gipfelkreuz, das schief im Wind h\xE4ngt",
      "der Atem des Fremden wie Nebel \xFCber dem Altar",
      "Lawinenstille vor dem n\xE4chsten Donner",
      "ein Rosenkranz aus geballten F\xE4usten",
      "die Pestglocke, die niemand mehr l\xE4utet",
      "eine H\xFCtte mit verriegelten L\xE4den",
      "der Riss in der Firnwand",
      "eine Wegmarke unter Schnee",
      "das Seil an einem alten Haken",
      "ein Kreuz an der Wegbiegung",
      "der Rauch aus dem Kamin im Tal",
      "ein Steinmann, den jemand umgeworfen hat",
      "die Spur, die vor dem Grat aufh\xF6rt",
      "eine Lawine, die nicht kam",
      "ein Glockenband ohne Vieh",
      "der Brunnen vor der Kapelle im Eis",
      "ein Fenster, das von innen zugefroren ist",
      "Holz, das f\xFCr zwei Winter reicht",
      "ein Pfad, der \xFCber dem Nebel liegt",
      "die Bank vor der H\xFCtte, f\xFCr zwei",
      "ein Stollen, dessen Mund zugesch\xFCttet ist"
    ],
    "hooks": [
      "der Fremde fl\xFCstert einen Namen, den es hier nicht geben sollte",
      "seine Handschuhe riechen nach fremdem Blut",
      "irgendwo im Geb\xE4lk knirscht etwas, das kein Wind ist",
      "die Bergluft tr\xE4gt einen Geruch, der nicht zu Schnee passt",
      "der Gerettete l\xE4chelt, wo Schmerz sein m\xFCsste",
      "ein Beutel klirrt, wenn niemand ihn ber\xFChrt",
      "die Fu\xDFspuren im Schnee f\xFChren nur in eine Richtung",
      "unter dem Talar liegt etwas, das sich bewegt",
      "Der Wind dreht, und die Glocke im Tal schweigt.",
      "Im Schnee liegt ein Schuh, der Weg f\xFChrt nicht weiter.",
      "Die H\xFCtte ist geheizt und leer.",
      "Jemand hat Holz nachgelegt, seit er fort ist.",
      "Der Hund bleibt vor dem Grat stehen und geht nicht weiter.",
      "Auf dem Tisch stehen zwei Becher.",
      "Der Pfad ist ger\xE4umt, obwohl niemand hier ist.",
      "Aus dem Tal steigt Rauch, wo kein Haus steht.",
      "Das Seil ist geknotet, nicht gerissen.",
      "Die Kapelle ist offen und der Schnee davor unber\xFChrt."
    ],
    "props": [
      "einen zerschlagenen Rosenkranz",
      "eine vereiste Monstranz",
      "einen Lederbeutel voller Z\xE4hne",
      "eine zerrissene Pilgerkarte der Bergp\xE4sse",
      "ein Paar alte Boxbandagen",
      "eine erloschene Sturmlaterne",
      "ein Amulett mit fremdem Wappen",
      "einen Dolch unter dem Messgewand",
      "eine Handvoll gefrorener Hostien",
      "ein Seil",
      "eine Laterne",
      "einen Pickel",
      "eine Wolldecke",
      "einen Zunderbeutel",
      "ein Feldbesteck",
      "einen Steigeisen",
      "eine Blechkanne",
      "ein Gebetbuch",
      "einen Wanderstock",
      "eine Karte der P\xE4sse",
      "ein Fernrohr",
      "einen Fellhandschuh"
    ],
    "turns": [
      "pl\xF6tzlich erkennt er im Gesicht des Fremden die Z\xFCge eines alten Gegners",
      "der Sturm drau\xDFen verstummt genau in dem Moment, als der Fremde die Augen \xF6ffnet",
      "er begreift, dass er nicht den Mann, sondern etwas anderes vom Berg heruntergetragen hat",
      "die Kirche, die ihm Zuflucht schien, sperrt pl\xF6tzlich beide T\xFCren",
      "im Fieber des Fremden h\xF6rt er seinen eigenen Namen aus alten K\xE4mpfen",
      "der Fremde dankt ihm mit Worten, die vor Jahrhunderten gesprochen wurden",
      "die Glocken beginnen von selbst zu l\xE4uten, als der Fremde aufsteht",
      "er erkennt die Pestbeulen zu sp\xE4t, unter den Fingern, die ihn noch halten",
      "der Sturm legt sich zur falschen Stunde",
      "aus dem Nebel tritt jemand ohne Ausr\xFCstung",
      "die H\xFCtte geh\xF6rt seit gestern niemandem",
      "der Weg ist offen, die R\xFCckkehr nicht",
      "die Glocke schl\xE4gt ohne Hand",
      "der Fremde kennt den Weg besser",
      "das Eis gibt frei, was es hielt",
      "die Spur f\xFChrt an der H\xFCtte vorbei",
      "der Pass wird geschlossen und ge\xF6ffnet",
      "jemand bleibt, der gehen wollte"
    ],
    "obstacles": [
      "der Schnee hat den einzigen Bergpfad verschluckt",
      "die Kirchent\xFCr l\xE4sst sich nicht mehr von innen \xF6ffnen",
      "seine alten F\xE4uste gehorchen ihm nicht mehr wie einst",
      "der Fremde wehrt sich gegen jede Hilfe, als f\xFCrchte er sie",
      "das Feuer im Altarraum will nicht brennen",
      "seine Kraft reicht nicht mehr f\xFCr den Weg zur\xFCck ins Tal",
      "die Lawine hat die Kapelle vom Dorf abgeschnitten",
      "der Fremde spricht in einer Sprache, die niemand mehr versteht",
      "der Nebel steigt schneller als der Weg",
      "das Holz reicht nicht bis zum Morgen",
      "die Lampe hat kein \xD6l mehr",
      "der Grat tr\xE4gt nur einen",
      "niemand h\xF6rt den Ruf im Wind",
      "die T\xFCr friert im Rahmen fest",
      "der Schnee tr\xE4gt und tr\xE4gt nicht",
      "der Weg ins Tal ist versch\xFCttet",
      "das Seil ist zu kurz f\xFCr die Wand",
      "die K\xE4lte kommt vor der Nacht"
    ],
    "stakes": [
      "Der Einsatz ist Erl\xF6sung: die eigene, l\xE4ngst verwirkte.",
      "Der Einsatz ist das letzte bisschen Gnade in einer gottverlassenen Welt.",
      "Der Einsatz ist sein eigenes Leben, getauscht gegen das eines Unbekannten.",
      "Der Einsatz ist die Seele, die er zu retten glaubte zu verlieren.",
      "Der Einsatz ist Vertrauen: in einen Fremden, der der Tod selbst sein k\xF6nnte.",
      "Der Einsatz ist die letzte Nacht, bevor die Seuche auch ihn holt.",
      "Der Einsatz ist die Erinnerung an einen Mann, der einst k\xE4mpfte, um zu leben.",
      "Der Einsatz ist die Stille einer Kirche, die keine Gebete mehr erh\xF6rt.",
      "Der Einsatz ist ein Weg, den nur einer schafft.",
      "Der Einsatz ist die Nacht in der H\xFCtte.",
      "Der Einsatz ist Holz f\xFCr zwei.",
      "Der Einsatz ist ein Name, den der Berg beh\xE4lt.",
      "Der Einsatz ist die R\xFCckkehr vor dem Schnee.",
      "Der Einsatz ist ein Seil und wer es h\xE4lt."
    ],
    "endings": [
      "So bleibt die Kirche leer, und der Berg schweigt weiter.",
      "So tr\xE4gt er die Reue wie eine neue Narbe unter der Haut.",
      "So endet die Rettung dort, wo der Glaube l\xE4ngst gestorben ist.",
      "So schlie\xDFt sich der Kreis aus Schnee, Schuld und Schweigen.",
      "So bleibt nur die Frage, wen er wirklich gerettet hat.",
      "So l\xF6scht der Wind die letzte Kerze am Altar.",
      "So wird aus dem Retter ein Gezeichneter des Berges.",
      "So bleibt die Glocke stumm, als h\xE4tte sie nie gel\xE4utet.",
      "Und der Rauch steht gerade \xFCber dem Tal.",
      "So bleibt die Bank vor der H\xFCtte leer.",
      "Am Morgen ist die Spur zugeweht.",
      "Und die Glocke schl\xE4gt weiter ins Tal.",
      "So schlie\xDFt sich die T\xFCr, und der Berg schweigt.",
      "Und das Seil bleibt am Haken h\xE4ngen."
    ]
  },
  "clown": {
    "motifs": [
      "ein Clown, der lautlos durch den Nebel der Manege schreitet",
      "wei\xDFe Schminke, die wie Mondlicht schimmert",
      "eine Maske, die immer l\xE4chelt, auch wenn niemand lacht",
      "Glockenspiel eines Narren im Wind \xFCber dem Zeltdach",
      "rot geschminkte Lippen \xFCber blutleeren Lippen",
      "ein Schellenhut, der im Sturm nicht klingelt",
      "Schatten, die tanzen, wo kein Licht sein sollte",
      "ein Kartenspiel, das immer denselben Narren zeigt",
      "eine Manege, die nach S\xE4gemehl und Regen riecht",
      "ein Zelt, das im Wind atmet wie eine Lunge",
      "Konfetti, das seit Jahren im Boden steckt",
      "ein Scheinwerfer, der auf niemanden zeigt",
      "die rote Nase auf einem Kissen",
      "eine Reihe leerer St\xFChle unter Planen",
      "Pferdegeschirr ohne Pferde",
      "ein Plakat mit ausgeblichenen Namen",
      "die Leiter zum Trapez, oben abgebrochen",
      "Applaus, der von der falschen Seite kommt",
      "ein Wohnwagen mit brennendem Licht",
      "Puder in der Luft wie Nebel",
      "ein Spiegel in der Garderobe, blind an einer Stelle",
      "die Bahn eines Balls, der nicht ankommt",
      "eine Kapelle, die weiterspielt",
      "Fu\xDFspuren im S\xE4gemehl, die nur hineinf\xFChren",
      "ein Vorhang mit abgerissenen \xD6sen",
      "der Geruch von nassem Segeltuch"
    ],
    "hooks": [
      "ein Handschuh riecht nach Schwarzpulver und Puderzucker",
      "irgendwo lacht jemand, wo niemand stehen sollte",
      "das Zeltgest\xE4nge knarrt im Takt eines unsichtbaren Trommlers",
      "ein Clownsschuh steht einsam mitten in der Manege",
      "die Kerzen am B\xFChnenrand brennen mit gr\xFCner Flamme",
      "jemand hat Kreidezeichen an die Zeltplane gemalt",
      "das Pausenzeichen klingt wie eine alte Drehorgel",
      "ein Zettel mit einem gezeichneten L\xE4cheln liegt in der Garderobe",
      "der Vorhang geht auf, bevor jemand bereit ist",
      "drau\xDFen wird der Wagen abgeh\xE4ngt",
      "die Schminke geht nicht mehr ab",
      "der Platz f\xFCr den Direktor bleibt leer",
      "ein Kind im Publikum weint statt zu lachen",
      "die Musik spielt einen Marsch, den keiner bestellt hat",
      "an der Kasse h\xE4ngt ein Zettel ohne Datum",
      "der Scheinwerfer sucht jemanden, der nicht auftritt",
      "in der Garderobe steht ein zweiter Schminkkasten",
      "jemand hat die Reihenfolge des Programms ge\xE4ndert"
    ],
    "props": [
      "eine rissige Clownsmaske",
      "einen verrosteten Trapezhaken",
      "eine Trillerpfeife aus Messing",
      "ein zerfleddertes Tarotblatt mit einem Narren",
      "einen Beutel voller Konfetti aus Pergament",
      "eine Laterne mit rotem Glas",
      "einen Dolch mit Perlmuttgriff",
      "eine Spieluhr, die eine Jahrmarktsmelodie spielt",
      "ein Seil, geflochten mit bunten B\xE4ndern",
      "eine rote Nase aus Schaumgummi",
      "einen Puderquast",
      "ein Paar viel zu gro\xDFe Schuhe",
      "eine Peitsche ohne Knall",
      "ein Plakat von 1957",
      "einen Schminkkasten mit Spiegel",
      "ein Seil aus der Zeltmitte",
      "eine Blechtrompete",
      "ein Programmheft mit Eselsohren",
      "eine Kette Gl\xF6ckchen",
      "einen Klappstuhl mit einem Namen",
      "ein Netz mit gerissener Masche",
      "eine Eintrittskarte ohne Datum",
      "einen Krug mit Wasser f\xFCr die Manege"
    ],
    "turns": [
      "pl\xF6tzlich erkennt er das Gesicht unter der Maske als sein eigenes",
      "der Direktor tr\xE4gt dieselbe Schminke wie der Narr aus seinen Tr\xE4umen",
      "die Zirkusglocke schl\xE4gt dreizehn Mal, und die Nacht wird zum Tag",
      "hinter dem Vorhang wartet kein Publikum, sondern ein leeres Zelt",
      "als der Applaus verstummt, beginnt irgendwo Jahrmarktsmusik zu spielen",
      "die Nummer geht schief, und das Publikum lacht lauter",
      "jemand nimmt die Maske ab, und niemand erkennt ihn",
      "der Applaus setzt eine Sekunde zu sp\xE4t ein",
      "die Kapelle spielt den Schluss mitten im St\xFCck",
      "das Zelt wird abgebaut, w\xE4hrend er noch probt",
      "ein Kind steigt in die Manege",
      "die Rolle beginnt, ihn zu tragen",
      "der Direktor k\xFCndigt eine Nummer an, die es nicht gibt",
      "das Lachen kippt in Stille",
      "er vergisst den Trick, den er tausendmal konnte",
      "ein alter Kollege steht pl\xF6tzlich am Eingang",
      "der Spiegel zeigt die Schminke ohne Gesicht",
      "die letzte Vorstellung ist schon gewesen"
    ],
    "obstacles": [
      "der Boden ist mit Kreidekreuzen \xFCbers\xE4t, die niemand betreten darf",
      "der Ansager starrt reglos ins Leere, als sei er zu Stein erstarrt",
      "ein Netz aus bunten B\xE4ndern versperrt den Ausgang",
      "die Truppe weigert sich, die fremde Manege zu betreten",
      "der Nebel verschluckt jeden Ruf nach Verst\xE4rkung",
      "das Sicherungsseil ist mit Narrenstoff geflickt",
      "das Zelt hat kein Publikum mehr",
      "die Gage bleibt aus",
      "die Hand zittert vor dem Wurf",
      "das Trapez ist gesperrt",
      "niemand kennt die Nummer noch",
      "der Regen weicht den Boden auf",
      "die Genehmigung f\xFCr den Platz l\xE4uft ab",
      "die Kapelle ist auf drei Mann geschrumpft",
      "die Schminke deckt die Falten nicht mehr",
      "der Nachfolger ist schneller",
      "die Musik kommt vom Band, nicht mehr von der B\xFChne"
    ],
    "stakes": [
      "Der Einsatz ist sein Verstand: gefangen zwischen Rolle und Wahnsinn.",
      "Der Einsatz ist der Applaus: mehr Fluch als Geschenk.",
      "Der Einsatz ist ein Name, den niemand mehr auszusprechen wagt.",
      "Der Einsatz ist die letzte Nacht vor der letzten Vorstellung.",
      "Der Einsatz ist das L\xE4cheln hinter der Maske: echt oder erzwungen?",
      "Der Einsatz ist die Nummer: Sie sitzt oder sie f\xE4llt.",
      "Der Einsatz ist das Zelt: Es steht noch eine Saison.",
      "Der Einsatz ist das Lachen, das er selbst nicht mehr h\xF6rt.",
      "Der Einsatz ist ein Platz in der Manege, den ein anderer will.",
      "Der Einsatz ist das Gesicht unter der Schminke.",
      "Der Einsatz ist die Truppe, die von ihm lebt.",
      "Der Einsatz ist ein Abgang, den man sich aussucht."
    ],
    "endings": [
      "Und irgendwo im Nebel hinter dem Zelt lacht noch immer ein Narr.",
      "So endet die Fahrt, doch die Schminke bleibt auf seiner Haut.",
      "Der Vorhang f\xE4llt \xFCber die leere Manege, f\xFCr immer.",
      "Er tr\xE4gt seither die Maske, die ihn einst jagte.",
      "So schlie\xDFt sich der Kreis aus Manege und Rummelplatz.",
      "Und das S\xE4gemehl wird zusammengekehrt wie an jedem Abend.",
      "So bleibt der Scheinwerfer an, bis der Strom abgestellt wird.",
      "Am Ende verbeugt er sich vor leeren R\xE4ngen.",
      "Und die Kapelle spielt zu Ende, weil sie es so gelernt hat.",
      "So wandert das Zelt weiter, ohne ihn.",
      "Und die Nase liegt am Morgen noch auf dem Kissen.",
      "Der Wagen f\xE4hrt, das Lachen bleibt stehen.",
      "Und der Platz ist am Montag wieder eine Wiese."
    ],
    "verwandlungen": [
      "Maske\u2192Miene",
      "Zelt\u2192Haus",
      "Manege\u2192B\xFChne",
      "Nase\u2192Warze",
      "Applaus\u2192Regen",
      "Direktor\u2192Vater",
      "Scheinwerfer\u2192Mond",
      "Publikum\u2192Feld",
      "Wagen\u2192Sarg"
    ]
  },
  "faust": {
    "motifs": [
      "ein Pakt, mit Blut besiegelt",
      "der Schatten des Mephisto \xFCber dem Studierzimmer",
      "eine Uhr im Studierzimmer, die r\xFCckw\xE4rts tickt",
      "zwei Seelen in einer Brust",
      "ein Buch, das niemand lesen darf",
      "das Fl\xFCstern verlorener Seelen in den Gassen",
      "ein Spiegel, der ein j\xFCngeres Gesicht zeigt",
      "Rauch ohne Feuer \xFCber den D\xE4chern",
      "ein Studierzimmer, in dem seit Jahren kein Fenster aufging",
      "B\xFCcher, die alles wissen und nichts sagen",
      "ein Kreidekreis auf den Dielen",
      "eine Reihe Alchemistengl\xE4ser im Halbdunkel",
      "ein Osterspaziergang unter fremden Glocken",
      "ein Kleinod, das jemand ins Fenster gestellt hat",
      "der Hund, der zu lange folgt",
      "ein Kerker mit einem Strohlager",
      "ein Becher, den er zweimal abgesetzt hat",
      "die Handschrift eines Mannes, der j\xFCnger wurde"
    ],
    "hooks": [
      "ein Siegel, das nach Schwefel riecht",
      "eine Handschrift, die sich selbst ver\xE4ndert",
      "ein Fremder, der die eigene Stimme tr\xE4gt",
      "ein Vertrag mit fehlendem Datum",
      "ein zweiter Schatten hinter dem Gelehrten",
      "ein Brief ohne Absender und ohne Datum",
      "ein Duft von verbranntem Papier im H\xF6rsaal",
      "ein Lachen, das aus der Mauer kommt",
      "ein Vertrag liegt schon aufgeschlagen auf dem Pult",
      "der Fremde nennt eine Bedingung und l\xE4chelt dabei",
      "der Pudel bleibt vor der T\xFCr sitzen und geht nicht",
      "drau\xDFen l\xE4uten die Glocken, und drinnen wird es still",
      "ein Name f\xE4llt, den er seit drei\xDFig Jahren nicht geh\xF6rt hat",
      "das Gift steht bereit und wird nicht getrunken",
      "ein M\xE4dchen dankt f\xFCr etwas, das er nicht gegeben hat",
      "der Spiegel zeigt ein Gesicht ohne Jahre",
      "im Nebenzimmer wird eine Kette abgelegt",
      "die Feder liegt neben dem Blatt, und niemand hat sie gebracht",
      "ein Diener spricht mit der Stimme des Herrn",
      "der Wein schmeckt nach etwas anderem als Wein"
    ],
    "props": [
      "einen Pakt aus vergilbtem Pergament",
      "eine Phiole mit rotem Wachs",
      "einen Ring mit eingraviertem Pentagramm",
      "eine Maske aus mattem Gold",
      "ein Amulett mit Teufelskopf",
      "einen Schl\xFCssel zur verbotenen Kammer",
      "eine Feder, die von selbst schreibt",
      "ein Medaillon mit Mephistos Zeichen",
      "einen verkohlten Brief",
      "eine Feder, die nicht trocknet",
      "einen Becher mit dunklem Bodensatz",
      "ein Buch mit gerissenem R\xFCcken",
      "eine Kette aus d\xFCnnem Gold",
      "einen Schl\xFCssel zum Kerker",
      "ein Fl\xE4schchen mit einem Rest",
      "einen Talar mit abgewetzten \xC4rmeln",
      "ein K\xE4stchen, das jemand ins Fenster stellte",
      "eine Kerze, die zu schnell brennt",
      "einen Spiegel in einem Messingrahmen"
    ],
    "turns": [
      "pl\xF6tzlich unterschreibt er, was er nie lesen wollte",
      "er erkennt sein eigenes Gesicht im Widersacher",
      "die Menge ruft einen Namen, den niemand kennt",
      "der Pakt verlangt seinen Preis, genau um Mitternacht",
      "aus Freiheit wird ein Handel mit dem Teufel",
      "das Streben folgt einem Plan, den keiner schrieb",
      "er unterschreibt, und die Feder schreibt weiter allein",
      "was er zu wissen glaubte, h\xE4lt keine Nacht mehr stand",
      "der Fremde erf\xFCllt den Wunsch genau und ganz falsch",
      "die Jugend kommt zur\xFCck, aber nicht die Zeit",
      "er verspricht etwas, das ein anderer bezahlen wird",
      "die Glocke unterbricht ihn im entscheidenden Satz",
      "ein Wort, das er leichthin sagt, wird sp\xE4ter zitiert",
      "der Diener kennt den Vertrag besser als er selbst",
      "die Bedingung tritt ein, ohne dass sie genannt wurde",
      "er sieht das Ergebnis seines Wunsches und will ihn zur\xFCck",
      "der Fremde verlangt keine Seele, sondern einen Augenblick",
      "was ihm geh\xF6rt, geh\xF6rte nie ihm",
      "die Nacht auf dem Berg zeigt ihm sein eigenes Gesicht",
      "er hilft, und die Hilfe kostet mehr als das Ungl\xFCck"
    ],
    "obstacles": [
      "die Kammer ist von Misstrauen umstellt",
      "niemand darf den Pakt je erw\xE4hnen",
      "die Diener gehorchen einer fremden Stimme",
      "der Fremde verlangt ein Pfand, das keiner geben will",
      "das Wissen verlangt einen Preis, den niemand nennen will",
      "die Zeit l\xE4uft schneller als jeder Plan",
      "der Vertrag l\xE4sst keinen R\xFCcktritt zu",
      "jedes Wissen f\xFChrt zu einer Frage dahinter",
      "die Stadt h\xF6rt das Ger\xFCcht vor ihm",
      "der Fremde antwortet nur, was gefragt wurde",
      "der Kerker \xF6ffnet sich, aber sie geht nicht mit",
      "die Zeit l\xE4uft r\xFCckw\xE4rts und nicht zur\xFCck",
      "niemand glaubt ihm ohne den Fremden",
      "die Glocken zwingen ihn zum Warten",
      "eine Unterschrift gilt auch ohne Zeugen",
      "das Mittel wirkt, aber nicht auf ihn",
      "die B\xFCcher schweigen genau an dieser Stelle",
      "der Preis wird erst nachtr\xE4glich genannt",
      "er hat kein Recht auf Reue, so steht es da",
      "der Augenblick, den er halten will, h\xE4lt ihn"
    ],
    "stakes": [
      "Der Einsatz ist eine Seele, im Voraus verpf\xE4ndet.",
      "Der Einsatz ist die letzte Wahrheit hinter allem Wissen.",
      "Der Einsatz ist ein Pakt, der niemals bricht.",
      "Der Einsatz ist die Freiheit, erkauft mit Schatten.",
      "Der Einsatz ist der Augenblick, der verweilen soll.",
      "Der Einsatz ist das Gleichgewicht zweier Welten.",
      "Der Einsatz ist ein Augenblick, zu dem man Verweile sagt.",
      "Der Einsatz ist ein M\xE4dchen, das nichts von dem Vertrag wei\xDF.",
      "Der Einsatz ist alles Wissen gegen einen einzigen Tag.",
      "Der Einsatz ist die Unterschrift, die noch nicht getrocknet ist.",
      "Der Einsatz ist ein Name, der \xFCber den Tod hinaus haftet.",
      "Der Einsatz ist die Frage, ob Streben allein gen\xFCgt."
    ],
    "endings": [
      "So schlie\xDFt sich der Pakt, unwiderruflich.",
      "Die Glocke schweigt, doch der Teufel l\xE4chelt.",
      "Man erinnert sich nur an das Streben, nicht an den Preis.",
      "Der Vertrag ist erf\xFCllt, die Seele bezahlt.",
      "So endet ein Gelehrter, so beginnt eine Legende.",
      "Im Schatten der B\xFCcherwand verstummt die letzte Frage.",
      "Und die Feder liegt quer \xFCber dem Blatt.",
      "So bleibt der Kreidekreis auf den Dielen stehen.",
      "Am Ende ist das Zimmer wieder still und voller B\xFCcher.",
      "Und die Glocken l\xE4uten, als w\xE4re nichts geschehen.",
      "So wird der Augenblick festgehalten und ist damit vorbei.",
      "Und der Fremde geht als Erster durch die T\xFCr.",
      "Der Vertrag liegt im Fach, mit einem Datum darauf.",
      "Und im Kerker bleibt das Stroh, wie es lag.",
      "So endet das Streben nicht, es h\xF6rt nur auf.",
      "Und niemand wei\xDF, welcher der beiden gegangen ist."
    ],
    "verwandlungen": [
      "Pakt\u2192Vertrag",
      "Feder\u2192Klinge",
      "Seele\u2192M\xFCnze",
      "Kerze\u2192Asche",
      "Buch\u2192Blatt",
      "Spiegel\u2192Schatten",
      "Becher\u2192Krug",
      "Kerker\u2192Garten"
    ]
  },
  "lebenreicher": {
    "motifs": [
      "jemand, der Reichtum in fremden Gassen sucht",
      "zwei Fremde, die sich im Dunkeln begegnen",
      "eine M\xFCnze, die niemals ihren Glanz verliert",
      "ein Herz, das mehr z\xE4hlt als Gold",
      "ein Besitz, der leiser wird als das Teilen",
      "ein Ring, der Erinnerung statt Macht bedeutet",
      "ein Brief, der wahren Reichtum beschreibt",
      "eine Kerze, die Freundschaft erhellt",
      "ein Spiegel, der die Seele reicher zeigt",
      "ein Haus mit zw\xF6lf Zimmern und zwei bewohnten",
      "ein Kontostand, der niemanden mehr freut",
      "eine Einladung, die man nicht ausschlagen kann",
      "ein Geschenk, das eine Rechnung ist",
      "ein T\xFCrsteher, der jeden Gast kennt",
      "ein Nachbar, der nie klingelt",
      "ein Zimmer, das f\xFCr Besuch bereitsteht und leer bleibt"
    ],
    "hooks": [
      "ein Fremder spricht eine unbekannte Sprache in der Dunkelheit",
      "ein vergessenes Geschenk liegt auf der Fensterbank",
      "eine Notiz nennt keinen Namen, nur ein Versprechen",
      "zwei Schatten reichen sich die Hand",
      "ein Duft nach Zimt, wo Blut sein sollte",
      "ein L\xE4cheln, das nicht zum Elend passt",
      "ein Lied klingt vertraut, obwohl es niemand kennt",
      "ein Kind schenkt einem Fremden sein letztes Brot",
      "Ein Geschenk liegt auf der Fensterbank, ohne Karte.",
      "Der Gast kommt und will nichts.",
      "Der Nachbar gr\xFC\xDFt zum ersten Mal in zehn Jahren.",
      "Im Haus fehlt etwas, das niemand vermisst hat.",
      "Die Einladung gilt f\xFCr einen, der nicht kommen kann.",
      "Jemand bringt zur\xFCck, was verloren war.",
      "Ein Bettler nennt seinen Namen und wartet.",
      "Die Rechnung ist beglichen, von wem, sagt niemand."
    ],
    "props": [
      "einen goldenen Siegelring",
      "eine Schatulle voller Briefe",
      "einen Kelch aus fremder Hand",
      "eine zerlesene Schrift \xFCber das Gl\xFCck",
      "einen einfachen Holzl\xF6ffel",
      "ein Medaillon mit zwei Gesichtern",
      "eine Kerze aus geschmolzenem Wachs",
      "einen Beutel mit unbekannten Samen",
      "eine Uhr ohne Zeiger",
      "eine Einladung mit gedrucktem Namen",
      "einen Mantel f\xFCr den Gast",
      "eine Rechnung ohne Betrag",
      "einen Schl\xFCssel f\xFCr ein Zimmer, das leer bleibt",
      "ein Geschenk ohne Karte",
      "einen Stuhl, der immer frei bleibt"
    ],
    "turns": [
      "pl\xF6tzlich z\xE4hlt nicht mehr der Besitz, sondern die Geste",
      "er erkennt, dass sein Reichtum nie aus Gold bestand",
      "er verschenkt, was er zuvor bewachte",
      "die Menge verstummt vor einem Akt der G\xFCte",
      "aus Feinden werden f\xFCr einen Moment Freunde",
      "der wahre Schatz liegt in einem geteilten Brot",
      "niemand wei\xDF mehr, wer hier wirklich herrscht",
      "der Gast gibt mehr, als das Haus ihm bietet",
      "ein Geschenk erweist sich als Abschied",
      "das Misstrauen kostet mehr als jeder Betrug",
      "ein Fremder wird eingelassen, und nichts fehlt",
      "der Nachbar bittet um etwas und bekommt es",
      "die Schatulle enth\xE4lt Briefe an ihn, ungelesen",
      "das Haus wird voll, und der Besitzer geht",
      "er l\xE4dt ein und wei\xDF nicht, wen",
      "eine Geste bleibt, und der Anlass ist vergessen",
      "er verliert alles und beh\xE4lt, worauf es ankam",
      "der Bettler kennt seinen Vornamen",
      "ein Brief von fr\xFCher erkl\xE4rt eine alte Feindschaft",
      "der Erbe verzichtet und nennt keinen Grund",
      "das Fest findet statt, und es kommen die Falschen",
      "er zahlt eine Schuld, die keiner mehr eintreibt",
      "ein Zimmer wird vermietet, f\xFCr nichts"
    ],
    "obstacles": [
      "alle misstrauen jedem freundlichen Wort",
      "das Haus verschlie\xDFt sich vor echten Gef\xFChlen",
      "Ger\xFCchte vergiften das Vertrauen zwischen Nachbarn",
      "der Fremde wird verd\xE4chtigt, etwas zu wollen",
      "die Stra\xDFen sind zu gef\xE4hrlich f\xFCr offene Worte",
      "niemand glaubt an uneigenn\xFCtzige Gaben",
      "die Zeit dr\xE4ngt, doch die Wahrheit wartet",
      "ein Geschenk verpflichtet, und beide wissen es",
      "niemand glaubt, dass es umsonst ist",
      "der T\xFCrsteher l\xE4sst keinen ohne Namen herein",
      "die Familie erwartet, dass nichts weggegeben wird",
      "die Einladung wird nur aus Berechnung angenommen",
      "das Zimmer f\xFCr Besuch steht seit Jahren leer",
      "wer gibt, wird gefragt, was er will",
      "die Sprache des Gastes versteht im Haus niemand",
      "der Winter macht den Weg zum Nachbarn weit",
      "ein Erbe wacht \xFCber jede Ausgabe",
      "Freundlichkeit gilt hier als Schw\xE4che",
      "das Haus ist zu gro\xDF f\xFCr die Heizung",
      "niemand im Viertel gibt eine Einladung zur\xFCck",
      "der Anwalt r\xE4t ausdr\xFCcklich davon ab",
      "die Nachbarn z\xE4hlen, wer wie oft kommt",
      "das Geschenk ist zu teuer, um es anzunehmen"
    ],
    "stakes": [
      "Der Einsatz ist Menschlichkeit: in einer Zeit des Hasses.",
      "Der Einsatz ist Freundschaft: \xFCber Grenzen hinweg.",
      "Der Einsatz ist W\xFCrde: wenn alles andere f\xE4llt.",
      "Der Einsatz ist Vertrauen: zwischen Fremden, die es nicht m\xFCssten.",
      "Der Einsatz ist Erinnerung: an das, was wirklich z\xE4hlt.",
      "Der Einsatz ist Mitgef\xFChl: in einer kalten Zeit.",
      "Der Einsatz ist Hoffnung: f\xFCr ein reicheres Morgen.",
      "Der Einsatz ist ein Zimmer, das jemand bewohnen k\xF6nnte.",
      "Der Einsatz ist eine Geste, die niemand erwartet.",
      "Der Einsatz ist die Frage, ob es umsonst sein darf.",
      "Der Einsatz ist ein Name, den ein Bettler kennt."
    ],
    "endings": [
      "So wird aus Gold nur Staub, aus G\xFCte aber Ewigkeit.",
      "Das Haus verf\xE4llt, doch die Geste bleibt bestehen.",
      "So endet die Nacht, reicher an Menschlichkeit.",
      "Zwei Verm\xF6gen vergehen, ein Herz bleibt bestehen.",
      "So schlie\xDFt sich der Kreis aus Haben und Geben.",
      "Am Ende z\xE4hlt nur, was man verschenkt hat.",
      "So bleibt von allen nur, was sie gaben.",
      "Und das Geschenk liegt am Morgen noch auf der Bank.",
      "Am Ende steht das Zimmer offen, f\xFCr irgendwen.",
      "Und der Nachbar gr\xFC\xDFt am n\xE4chsten Tag wieder.",
      "So bleibt die Schatulle zu, und die Briefe ungelesen.",
      "Und der Gast ist fort, mit dem Mantel.",
      "Der Ring liegt auf dem Tisch, und niemand nimmt ihn.",
      "Und im Haus ist es w\xE4rmer als sonst.",
      "Und die Einladung liegt unge\xF6ffnet auf dem Tisch.",
      "So bleibt der Stuhl am Kopfende frei.",
      "Am Ende ist das Haus voll und der Hof leer.",
      "Und der T\xFCrsteher l\xE4sst zum ersten Mal jemanden durch."
    ],
    "verwandlungen": [
      "Haus\u2192Geh\xE4use",
      "Gast\u2192Bote",
      "Geschenk\u2192Pfand",
      "Ring\u2192Reif",
      "Zimmer\u2192Grab",
      "Mantel\u2192Schleier"
    ]
  },
  "tanz": {
    "motifs": [
      "ein Kreis, der sich dreht, ohne dass jemand f\xFChrt",
      "Schatten, die sich drehen, ohne Musik",
      "der Wind tanzt durch das Gras wie eine unsichtbare Hand",
      "ein altes Lied, das nur die F\xFC\xDFe zu kennen scheinen",
      "zwei Paar Schritte im gleichen geheimen Takt",
      "ein Reigen, der sich im Nebel des Saals verliert",
      "aufgewirbelter Staub, der wie Schnee im Mondlicht steht",
      "ein Takt, der \xE4lter ist als der Tanz selbst",
      "ein Saal mit abgetretenen Dielen",
      "Kreidestaub auf dem Parkett",
      "eine Reihe Paare, die dasselbe atmen",
      "ein Takt, der einen Schlag zu viel hat",
      "Schuhe, die nebeneinander an der Wand stehen",
      "ein Spiegel, in dem alle j\xFCnger sind",
      "die Hand auf einem R\xFCcken, ohne Druck",
      "eine Melodie, die aus dem Nebenraum kommt",
      "Staub im Licht \xFCber der Tanzfl\xE4che",
      "ein Kreidekreis auf dem Boden",
      "Schwei\xDF und Bienenwachs",
      "ein Vorhang, der sich ohne Wind bewegt",
      "eine Nummer auf einem R\xFCcken",
      "der Abdruck eines Absatzes im Lack",
      "ein Metronom ohne Aufsicht",
      "der leere Platz in einer Reihe",
      "zwei Schatten, die einen Schritt vorauslaufen"
    ],
    "hooks": [
      "die Musik setzt aus, doch niemand bleibt stehen",
      "ein Gl\xF6ckchen l\xE4utet, ohne dass jemand es ber\xFChrt",
      "ein Schatten tanzt einen Takt zu sp\xE4t",
      "jemand summt eine Melodie, die ihm niemand beibrachte",
      "der Kreis im Staub ist genau so gro\xDF wie der Tanz",
      "ein Hund folgt dem Takt mit geneigtem Kopf",
      "die Fu\xDFspuren verschwinden, kaum sind sie gesetzt",
      "der Wind h\xE4lt kurz den Atem an",
      "der Saal ist offen, aber niemand hat aufgeschlossen",
      "die Kapelle spielt ein St\xFCck zu viel",
      "ein Paar tanzt weiter, als der Saal l\xE4ngst leer ist",
      "die Dielen geben an einer Stelle nach",
      "ein Fremder steht in der T\xFCr und wartet auf den Takt",
      "der Spiegel zeigt einen Schritt vorher",
      "die Uhr im Saal ist stehengeblieben, der Takt nicht",
      "jemand fehlt in der Reihe, und niemand merkt es",
      "auf dem Boden liegt Kreide von einer anderen Figur"
    ],
    "props": [
      "eine Geige ohne Saiten",
      "ein verwittertes Gl\xF6ckchen",
      "einen Kranz aus Wiesenblumen",
      "ein Tuch, das nach Zeit riecht",
      "eine Fl\xF6te ohne L\xF6cher",
      "einen Ring aus geflochtenem Draht",
      "eine Laterne ohne Flamme",
      "einen Mantel, warm wie eine Erinnerung",
      "ein Paar Tanzschuhe",
      "ein Metronom",
      "eine Geige im Kasten",
      "ein Kreidest\xFCck f\xFCr den Boden",
      "eine Tanzkarte mit Namen",
      "ein Notenblatt ohne Titel",
      "eine Sch\xE4rpe aus Seide",
      "einen Handschuh, der \xFCbrig ist",
      "eine Uhr ohne Zeiger",
      "ein Band f\xFCr das Haar",
      "einen Stuhl am Rand des Saals",
      "ein Glas Wasser auf dem Klavier",
      "eine Nummer aus Papier",
      "ein Programm der letzten Saison"
    ],
    "turns": [
      "pl\xF6tzlich tanzen alle, als h\xE4tte es niemand je verlernt",
      "auf einmal l\xE4cheln alle zur gleichen Sekunde",
      "der Boden scheint sich mit ihnen zu drehen",
      "mit dem ersten Schritt wird die Zeit ganz still",
      "der Tanz zieht die Umstehenden in einen stillen Kreis",
      "als der Mond aufgeht, beginnt der Tanz von selbst",
      "der Takt wechselt, und niemand stolpert",
      "eine Hand fasst zu und l\xE4sst nicht mehr los",
      "die Reihen l\xF6sen sich in einen einzigen Kreis",
      "der Fremde f\xFChrt, ohne dass es jemand beschlie\xDFt",
      "die Musik verstummt, und die F\xFC\xDFe gehen weiter",
      "ein Schritt kommt aus einer anderen Zeit",
      "der Boden gibt den Takt zur\xFCck",
      "zwei tanzen dasselbe, ohne sich zu sehen",
      "die Kapelle spielt, was niemand aufgeschrieben hat",
      "der Kreis \xF6ffnet sich f\xFCr einen",
      "die Reihenfolge dreht sich um",
      "der letzte Ton bleibt in der Luft h\xE4ngen"
    ],
    "obstacles": [
      "der Saal liegt pl\xF6tzlich im Halbdunkel",
      "die F\xFC\xDFe scheinen den Boden nicht mehr zu ber\xFChren",
      "der Tanz will nicht enden, obwohl die Kr\xE4fte schwinden",
      "die anderen weichen zur\xFCck, als sp\xFCrten sie etwas Fremdes",
      "kein Lied begleitet die Schritte, und doch geht der Tanz weiter",
      "der Saal wird um Mitternacht geschlossen",
      "die Kapelle kennt das St\xFCck nicht",
      "der Boden ist zu glatt f\xFCr den Schritt",
      "ein Kn\xF6chel gibt nach",
      "die Reihen sind ungerade",
      "niemand hat den Takt gez\xE4hlt",
      "das Licht geht aus, die Musik nicht",
      "die Schuhe passen nicht mehr",
      "der Partner kommt nicht",
      "der Schritt ist vergessen, und niemand kann ihn zeigen",
      "die Uhr treibt schneller als die Kapelle",
      "der Saal ist zu klein f\xFCr alle Paare"
    ],
    "stakes": [
      "Der Einsatz ist Erinnerung: an einen Tanz, der jung h\xE4lt.",
      "Der Einsatz ist Vertrauen: dass der Takt nicht abbricht.",
      "Der Einsatz ist die Zeit selbst, die mit jedem Schritt verrinnt.",
      "Der Einsatz ist die Liebe, die sich im Kreis bewahrt.",
      "Der Einsatz ist das L\xE4cheln, das den Tanz \xFCberlebt.",
      "Der Einsatz ist ein Schritt, den nur noch einer kann.",
      "Der Einsatz ist der Kreis: Er h\xE4lt oder er rei\xDFt.",
      "Der Einsatz ist ein Abend, den es nicht zweimal gibt.",
      "Der Einsatz ist die Hand, die man nimmt oder nicht.",
      "Der Einsatz ist der Saal, den man abrei\xDFen will.",
      "Der Einsatz ist das Z\xE4hlen: laut oder gar nicht."
    ],
    "endings": [
      "So geht der Tanz weiter, wenn niemand mehr hinsieht.",
      "Und das Holz erinnert sich an den Takt, wenn der Saal l\xE4ngst leer ist.",
      "So schlie\xDFt sich der Kreis, Schritt f\xFCr Schritt.",
      "Am Ende bleibt nur ein L\xE4cheln \xFCber dem stillen Boden.",
      "Und der Tanz wird zur Legende, die der Wind weitertr\xE4gt.",
      "Und die Schuhe stehen am Morgen noch an der Wand.",
      "So bleibt der Takt im Boden, wenn die Kapelle geht.",
      "Am Ende z\xE4hlt niemand mehr mit.",
      "Und der Kreis ist einen kleiner als am Anfang.",
      "So endet der Abend, wie jeder Abend endet: mit dem Licht.",
      "Und jemand summt es auf dem Heimweg.",
      "Der Saal steht leer und ist noch warm.",
      "Und die Kreide bleibt bis zum n\xE4chsten Mal."
    ],
    "verwandlungen": [
      "Takt\u2192Puls",
      "Saal\u2192Wald",
      "Musik\u2192Stille",
      "Kreis\u2192Ring",
      "Schritt\u2192Schlag",
      "Geige\u2192Stimme",
      "Spiegel\u2192Schatten",
      "Kapelle\u2192Wolke"
    ]
  },
  "griechischetragoedie": {
    "motifs": [
      "ein Chor, der aus dem Nichts fl\xFCstert",
      "zwei Schatten, die eins werden",
      "das L\xE4cheln, das die G\xF6tter tragen",
      "ein Schafsfell, wei\xDF wie ein Leichentuch",
      "der Wind, der alte Namen tr\xE4gt",
      "eine Fessel, die niemand sieht",
      "das Auge des Zeus in der Wolke",
      "ein Baum, der zwei St\xE4mme teilt",
      "ein Orakel, das zweimal dasselbe sagt",
      "Blut auf der Schwelle eines Hauses",
      "ein Chor, der wei\xDF und nicht eingreift",
      "eine Maske mit offenem Mund",
      "ein K\xF6nigshaus, das sich selbst verzehrt",
      "der Rauch eines Opfers, der nicht steigt",
      "ein Bote, der von weit her kommt",
      "eine Krone, die zu leicht ist",
      "Staub auf einem unbestatteten Leib",
      "das Meer, das keine R\xFCckkehr gew\xE4hrt",
      "ein Eid, der \xFCber den Tod hinaus gilt",
      "die Stufen vor einem verschlossenen Palast",
      "ein Name, den man nicht aussprechen darf",
      "Fackeln in einem Hof bei Nacht",
      "eine Wunde, die niemand versorgt",
      "die Stimme einer Frau hinter der T\xFCr"
    ],
    "hooks": [
      "die Schafe schweigen alle zugleich",
      "ein Duft nach Weihrauch ohne Altar",
      "ihre H\xE4nde ber\xFChren sich, ohne sich zu bewegen",
      "ein Schatten, der keinem K\xF6rper geh\xF6rt",
      "das Gras neigt sich ohne Wind",
      "zwei Becher, die nie leer werden",
      "ein Lachen, das aus der Erde kommt",
      "die Sonne steht still \xFCber der Weide",
      "ein Bote steht am Tor und wartet auf Erlaubnis",
      "der Chor beginnt zu sprechen, bevor jemand fragt",
      "die Zeichen im Rauch sind eindeutig und niemand deutet sie",
      "vor dem Palast liegt etwas unter einem Tuch",
      "ein Fremder kennt den Weg durch das Haus",
      "das Orakel wird ausgerichtet, Wort f\xFCr Wort",
      "die T\xFCren des Palastes stehen offen und niemand geht hinein",
      "eine alte Frau nennt einen Namen und schweigt dann"
    ],
    "props": [
      "einen h\xF6lzernen Hirtenstab",
      "eine Schale aus Ton",
      "einen Kranz aus Efeu",
      "ein Lammfell",
      "einen Krug voll Milch",
      "eine bronzene Fibel",
      "einen \xD6lzweig",
      "eine Opferschale",
      "ein verwittertes Amulett",
      "eine Maske aus bemaltem Holz",
      "einen Opferkrug",
      "ein Schwert unter einem Mantel",
      "eine Binde f\xFCr die Augen",
      "einen \xD6lzweig als Bittzeichen",
      "ein Los aus einem Helm",
      "eine Urne mit Asche",
      "einen Stab des Sehers",
      "ein Gewand mit einem Riss",
      "eine Schale voll Wein f\xFCr die Toten",
      "einen Spiegel aus Bronze",
      "ein Siegel des Hauses",
      "eine Schnur, an der ein Kind erkannt wird"
    ],
    "turns": [
      "pl\xF6tzlich erkennen sie die Fremden als G\xF6tter",
      "ihr L\xE4cheln verr\xE4t ein Wissen, das nicht von dieser Welt ist",
      "das Dorf versinkt, w\xE4hrend ihre H\xFCtte zum Tempel wird",
      "die Schafe knien nieder, als w\xFCssten sie es l\xE4ngst",
      "aus Gastfreundschaft wird ein Schicksal",
      "ihre Jugend weicht, doch ihr L\xE4cheln bleibt dasselbe",
      "das Orakel erf\xFCllt sich durch die Flucht davor",
      "der Bote bringt, was niemand h\xF6ren wollte",
      "der Fremde ist der Gesuchte",
      "die Schuld springt auf das n\xE4chste Haus \xFCber",
      "der Chor nennt die Tat beim Namen",
      "ein Schwur zwingt zum Gegenteil des Gewollten",
      "die Wahrheit kommt von der Seite, die nicht z\xE4hlt",
      "das Recht der Toten schl\xE4gt das Recht des K\xF6nigs",
      "die G\xF6tter schweigen an der falschen Stelle",
      "was verborgen war, wird vor allen gesagt",
      "der Retter erkennt sich als Ursache",
      "das Haus f\xE4llt an einem einzigen Tag"
    ],
    "obstacles": [
      "die G\xF6tter verlangen ein Opfer, das sie nicht geben wollen",
      "das Dorf verweigert den Fremden die T\xFCr",
      "die Zeit will sie trennen, doch sie halten sich fest",
      "der Nebel verschluckt den Weg zur\xFCck",
      "kein Sterblicher darf die Wahrheit tragen",
      "das Gesetz verbietet, was der Anstand verlangt",
      "der K\xF6nig h\xF6rt nur, was ihn best\xE4tigt",
      "der Chor darf raten und nicht handeln",
      "ein Eid steht gegen den anderen",
      "der Seher spricht in Bildern",
      "niemand darf den Toten begraben",
      "die Stadt braucht ein Opfer und w\xE4hlt selbst",
      "der Weg zum Hafen ist gesperrt",
      "die Wahrheit hilft niemandem mehr",
      "ein Gast ist unantastbar, auch dieser",
      "die Botschaft kommt einen Tag zu sp\xE4t",
      "wer schweigt, wird schuldig, wer spricht, auch"
    ],
    "stakes": [
      "Der Einsatz ist ihre Liebe: gepr\xFCft von den G\xF6ttern selbst.",
      "Der Einsatz ist die Gastfreundschaft: das letzte Gesetz der Menschen.",
      "Der Einsatz ist ihr gemeinsamer Tod: als Baum vereint.",
      "Der Einsatz ist das Schicksal: unabwendbar wie ein Orakel.",
      "Der Einsatz ist die Erinnerung: an das, was Menschlichkeit bedeutet.",
      "Der Einsatz ist das Haus: Es steht oder es f\xE4llt mit dem Namen.",
      "Der Einsatz ist ein Begr\xE4bnis, das das Gesetz verbietet.",
      "Der Einsatz ist die Stadt, die auf ein Opfer wartet.",
      "Der Einsatz ist ein Kind, das nicht sterben durfte.",
      "Der Einsatz ist der Eid, den einer f\xFCr alle geleistet hat.",
      "Der Einsatz ist die Wahrheit, die niemanden mehr rettet.",
      "Der Einsatz ist das Gastrecht, das \xE4lter ist als der K\xF6nig."
    ],
    "endings": [
      "So verwandeln sich zwei Herzen in einen Baum.",
      "So bleibt ihr L\xE4cheln in der Rinde erhalten.",
      "So endet die Weide, wo ein Tempel begann.",
      "So schlie\xDFt sich der Kreis der G\xF6tter und Menschen.",
      "So spricht der Chor: Liebe \xFCberdauert das Fleisch.",
      "So spricht der Chor das Letzte und tritt zur\xFCck.",
      "Und die T\xFCren des Hauses schlie\xDFen sich \xFCber allem.",
      "Am Ende ist das Orakel eingetroffen, wie immer.",
      "Und was verborgen lag, liegt nun im Hof.",
      "So endet das Geschlecht mit dem, der es retten wollte.",
      "Und die Stadt begr\xE4bt und schweigt.",
      "So bleibt der Name, und niemand nennt ihn.",
      "Und das Meer tr\xE4gt die Nachricht in eine andere Stadt."
    ],
    "verwandlungen": [
      "Orakel\u2192Urteil",
      "Maske\u2192Miene",
      "Chor\u2192Wind",
      "Krone\u2192B\xFCrde",
      "Bote\u2192Schatten",
      "Palast\u2192Berg",
      "Eid\u2192Fluch",
      "Opfer\u2192Geschenk"
    ]
  },
  "glueck": {
    "motifs": [
      "ein Gl\xFCck, das \xE4lter ist als ihr L\xE4cheln",
      "zwei Schatten, die sich nie trennen",
      "das Bl\xF6ken der Schafe im Nebel der Zeit",
      "ein Licht, das aus den Wolken bricht, ohne Grund",
      "H\xE4nde, die sich halten, seit Ewigkeiten",
      "ein Kreis aus Schafen, der sich niemals schlie\xDFt",
      "ein Gl\xFCcksfaden, unsichtbar gesponnen",
      "zwei Herzen, die im gleichen Takt schlagen",
      "ein Tisch, an dem seit drei\xDFig Jahren dieselben zwei sitzen",
      "ein Garten, der genau so gro\xDF ist, wie zwei ihn schaffen",
      "ein Vorrat, der bis zum Fr\xFChjahr reicht und nicht weiter",
      "eine Bank, auf der die Sonne bis vier Uhr steht",
      "ein Brot, das noch warm auf den Tisch kommt",
      "ein Abend, an dem nichts zu erledigen ist",
      "ein Weg zum Brunnen, den beide auswendig gehen",
      "eine Katze, die immer denselben Platz w\xE4hlt",
      "ein Fenster, aus dem man das Wetter kommen sieht",
      "ein Krug, der zweimal am Tag gef\xFCllt wird"
    ],
    "hooks": [
      "ein Lamm, das nicht altert",
      "ein Duft nach Honig ohne Bienenstock",
      "ein Windhauch, der nach Namen fl\xFCstert",
      "zwei Becher, die sich von selbst f\xFCllen",
      "ein Schaf, das mit menschlicher Stimme meckert",
      "ein Stein, der warm bleibt trotz der K\xE4lte",
      "ein Weg, der sich hinter ihnen aufl\xF6st",
      "eine Feder, die vom Himmel f\xE4llt, ohne Vogel",
      "Es klopft, und es sind Fremde, und sie werden hereingebeten.",
      "Der Vorrat reicht f\xFCr zwei, und es sind vier am Tisch.",
      "Ein Nachbar fragt, was sie eigentlich noch wollen.",
      "Die Sonne steht schon tief, und keiner steht auf.",
      "Jemand bietet ihnen ein besseres Haus an.",
      "Die Katze bleibt zum ersten Mal drau\xDFen.",
      "Ein Brief k\xFCndigt eine Erbschaft an.",
      "Im Dorf wird gesagt, sie h\xE4tten zu wenig.",
      "Der Krug steht voll, und niemand hat ihn gef\xFCllt.",
      "Es regnet, und beide sitzen nur da."
    ],
    "props": [
      "einen alten Hirtenstab",
      "eine Schale voll Milch, die nie leer wird",
      "einen goldenen Faden",
      "eine Kanne, die sich selbst nachf\xFCllt",
      "einen Ring aus Schilf",
      "eine Decke aus Schafwolle",
      "einen Krug voll Wein f\xFCr Fremde",
      "eine kleine h\xF6lzerne Fl\xF6te",
      "einen Krug, der nie ganz leer wird",
      "eine Bank vor dem Haus",
      "einen Laib Brot vom Morgen",
      "eine Schale mit Milch f\xFCr die Katze",
      "eine Decke f\xFCr zwei Knie",
      "einen Stock f\xFCr den Weg zum Brunnen",
      "ein Fenster mit einem Geranientopf",
      "eine Sch\xFCssel f\xFCr die G\xE4ste"
    ],
    "turns": [
      "pl\xF6tzlich wissen sie, dass die Fremden keine Fremden sind",
      "auf einmal l\xE4cheln beide, ohne ein Wort zu sagen",
      "die Schafe verstummen alle zur gleichen Zeit",
      "ihr Gl\xFCck scheint gr\xF6\xDFer als die Weide selbst",
      "der Himmel f\xE4rbt sich golden, ohne dass die Sonne sinkt",
      "ihre H\xE4nde finden sich, wie es immer schon ist",
      "die Fremden bleiben, und der Tisch reicht doch",
      "ein Angebot kommt, und beide lehnen ab, ohne zu reden",
      "was fehlt, f\xE4llt erst auf, als jemand danach fragt",
      "das Dorf verliert, was die beiden behalten",
      "der Krug bleibt voll, und niemand redet dar\xFCber",
      "die Erbschaft kommt und \xE4ndert nichts",
      "einer wird krank, und der andere lernt kochen",
      "der Nachbar sieht zum ersten Mal her\xFCber",
      "das Gl\xFCck wird bemerkt und dadurch zerbrechlich",
      "ein Fremder segnet das Haus und geht weiter",
      "der Garten tr\xE4gt in diesem Jahr mehr als n\xF6tig",
      "sie w\xFCnschen sich etwas, und es ist wenig",
      "ein Wunsch wird erf\xFCllt und war der richtige",
      "am Ende bitten beide um dieselbe Stunde"
    ],
    "obstacles": [
      "die Fremden werden von allen anderen abgewiesen",
      "der Weg zur H\xFCtte scheint sich zu verl\xE4ngern",
      "das Wetter schl\xE4gt unerwartet um",
      "die Vorr\xE4te reichen kaum f\xFCr zwei",
      "die Nacht bricht fr\xFCher herein, als sie sollte",
      "ihre Nachbarn misstrauen jedem Besucher",
      "das Dorf h\xE4lt Gastfreundschaft f\xFCr Torheit",
      "der Vorrat reicht f\xFCr zwei, nicht f\xFCr vier",
      "der Winter kommt fr\xFCher als in anderen Jahren",
      "niemand versteht, warum sie nichts wollen",
      "die Beine tragen den Weg zum Brunnen nicht mehr",
      "ein Angebot ist zu gut, um es abzulehnen",
      "die Nachbarn erwarten eine Gegeneinladung",
      "das Dach h\xE4lt den n\xE4chsten Regen nicht",
      "einer von beiden h\xF6rt schlechter als fr\xFCher",
      "das Gl\xFCck l\xE4sst sich nicht erz\xE4hlen, ohne kleiner zu werden",
      "der Sohn schreibt aus der Stadt und dr\xE4ngt",
      "die Katze bleibt eine Nacht zu lang weg",
      "was reicht, reicht nur bis zum Fr\xFChjahr",
      "niemand will h\xF6ren, dass es genug ist"
    ],
    "stakes": [
      "Der Einsatz ist Gl\xFCck: geteilt, nicht gehortet.",
      "Der Einsatz ist Gastfreundschaft, die alles ver\xE4ndert.",
      "Der Einsatz ist die stille Freude zweier alter Herzen.",
      "Der Einsatz ist ein Segen, den niemand kommen sah.",
      "Der Einsatz ist Vertrauen in das Unbekannte.",
      "Der Einsatz ist ein Abend, an dem nichts zu tun ist.",
      "Der Einsatz ist ein Tisch, an dem noch zwei Platz haben.",
      "Der Einsatz ist die Frage, ob genug wirklich genug ist.",
      "Der Einsatz ist eine Stunde, um die beide bitten.",
      "Der Einsatz ist ein Haus, das niemand gr\xF6\xDFer will."
    ],
    "endings": [
      "So bleibt ihr L\xE4cheln, wenn alles andere vergeht.",
      "Und das Gl\xFCck w\xE4chst leise weiter, wie Gras auf der Weide.",
      "So schlie\xDFt sich der Kreis aus Milde und Licht.",
      "Ihr stilles Gl\xFCck wird zur Legende der Weide.",
      "So wird aus Armut ein Wunder, das l\xE4chelt.",
      "Und der Krug steht am Morgen wieder voll.",
      "So bleibt der Tisch gedeckt f\xFCr zwei und f\xFCr G\xE4ste.",
      "Am Ende sitzen sie da, und es ist genug.",
      "Und im Garten w\xE4chst, was sie im Fr\xFChjahr s\xE4ten.",
      "So geht der Weg zum Brunnen, wie er immer ging.",
      "Und die Katze liegt wieder auf demselben Platz.",
      "Der Abend wird k\xFChl, und beide bleiben sitzen.",
      "Und niemand im Dorf versteht es, bis heute.",
      "So bleibt das Haus, wie es war, nur \xE4lter.",
      "Und die Bank steht in der Sonne bis vier."
    ],
    "verwandlungen": [
      "Krug\u2192Becher",
      "Garten\u2192Park",
      "Brot\u2192Pfand",
      "Bank\u2192Mauer",
      "Katze\u2192Wolke",
      "Abend\u2192Morgen"
    ]
  },
  "gruendungsmythos": {
    "motifs": [
      "ein Hirtenstab, der Wurzeln schl\xE4gt",
      "zwei Schatten, die zu einem verschmelzen",
      "ein Nebel, der die Weide wie eine Wiege umschlie\xDFt",
      "Schafe, die im Kreis stehen und schweigen",
      "ein Licht ohne Quelle \xFCber den H\xFCgeln",
      "uralte Steine, die nach Namen fl\xFCstern",
      "ein Baum, der aus zwei Wurzeln w\xE4chst",
      "der Himmel, der sich \xFCber der Weide neigt",
      "ein Feuer, das seit der ersten Nacht nicht ausging",
      "ein Pflug, mit dem eine Grenze gezogen wurde",
      "ein Stein, auf dem der erste Name steht",
      "eine Quelle, die den Ort entschieden hat",
      "ein Baum, der \xE4lter ist als die H\xE4user",
      "ein Tag im Jahr, an dem alle dasselbe tun",
      "ein Grab am Anfang der Stra\xDFe",
      "eine Furt, an der zwei Wege sich trafen",
      "ein Name, der von einem Missverst\xE4ndnis kommt",
      "ein Zeichen an der \xE4ltesten Mauer"
    ],
    "hooks": [
      "ein L\xE4mmchen, das r\xFCckw\xE4rts geht",
      "ein Windhauch, der Namen ruft, die niemand kennt",
      "zwei Becher, die sich nie leeren",
      "eine Spur im Gras, die zu keinem Ursprung f\xFChrt",
      "ein Vogel, der \xFCber derselben Stelle kreist",
      "ein Klang wie ein zweiter Herzschlag im Boden",
      "ein Schatten, der l\xE4nger bleibt als die Sonne erlaubt",
      "Gras, das sich weigert zu welken",
      "Das Feuer geht aus, zum ersten Mal seit Menschengedenken.",
      "Der Grenzpflug wird gefunden, wo er nicht liegen d\xFCrfte.",
      "Ein Fremder erz\xE4hlt die Gr\xFCndung anders.",
      "Die Quelle versiegt in dem Jahr, in dem gefeiert wird.",
      "Der erste Name auf dem Stein ist nicht zu lesen.",
      "Zwei Familien behaupten dieselbe Herkunft.",
      "Der Baum verliert im Sommer alle Bl\xE4tter.",
      "Am Grab am Stra\xDFenanfang liegen frische Blumen.",
      "Die Furt ist verlandet, und der Weg bleibt.",
      "Jemand fragt, warum der Ort so hei\xDFt."
    ],
    "props": [
      "einen alten Hirtenstab",
      "einen irdenen Krug",
      "eine Handvoll Getreidek\xF6rner",
      "ein geflochtenes Schafsfell",
      "einen Ring aus verwittertem Holz",
      "eine Schale mit Milch und Honig",
      "einen Stein mit eingeritzten Zeichen",
      "eine kleine Opferschale",
      "einen Pflug mit h\xF6lzerner Schar",
      "einen Stein mit dem ersten Namen",
      "eine Schale f\xFCr das erste Feuer",
      "ein Horn f\xFCr den Tag im Jahr",
      "einen Krug aus der \xE4ltesten Werkstatt",
      "ein Seil, mit dem gemessen wurde",
      "eine Tafel mit den Namen der Gr\xFCnder"
    ],
    "turns": [
      "pl\xF6tzlich l\xE4cheln beide, als w\xFCssten sie, was noch niemand wei\xDF",
      "auf einmal ist die Weide \xE4lter als jede Erinnerung",
      "dann ver\xE4ndert sich das Licht, als beginne die Welt von vorn",
      "in diesem Moment wird aus zwei Hirten ein Ursprung",
      "unvermittelt spricht das Gras mit zwei Stimmen zugleich",
      "dann erkennt man: sie sind schon immer hier",
      "die Gr\xFCndung war anders, und niemand \xE4ndert die Geschichte",
      "das Feuer wird neu entz\xFCndet, und alle tun, als w\xE4re nichts",
      "ein Grab wird ge\xF6ffnet und ist leer",
      "der Name kommt von einem Wort, das niemand mehr kennt",
      "die Grenze war ein Zufall und ist jetzt heilig",
      "zwei Erz\xE4hlungen werden zu einer, und beide verlieren",
      "die Quelle kommt wieder, an einer anderen Stelle",
      "ein Fremder wird zum Ahnen erkl\xE4rt",
      "der Feiertag verschiebt sich um eine Woche und bleibt",
      "die \xE4lteste Familie war nicht die erste",
      "das Zeichen an der Mauer ist j\xFCnger als gedacht",
      "der Ort wird gegr\xFCndet, ein zweites Mal",
      "was Brauch war, wird Vorschrift",
      "die Geschichte wird aufgeschrieben und damit endlich"
    ],
    "obstacles": [
      "die Fremden erkennen die Weide nicht wieder",
      "kein Weg f\xFChrt zur\xFCck ins Dorf",
      "die G\xF6tter verlangen ein Zeichen, das niemand deuten kann",
      "der Nebel l\xE4sst die Grenzen der Weide verschwimmen",
      "die Zeit weigert sich, weiterzugehen",
      "die Schafe folgen keinem Ruf mehr",
      "niemand wei\xDF mehr, wer die ersten Regeln aufstellte",
      "die Quelle liegt heute au\xDFerhalb der Grenze",
      "der Stein ist verwittert und nicht zu lesen",
      "die beiden Familien reden seit drei Jahren nicht",
      "das Feuer braucht Holz, und der Wald geh\xF6rt anderen",
      "der Feiertag f\xE4llt in die Ernte",
      "die Furt ist verlandet und der Umweg lang",
      "niemand darf den Baum beschneiden",
      "die Tafel nennt Namen, die es im Ort nicht gibt",
      "die Fremden werden nicht in die Geschichte aufgenommen",
      "der Brauch verlangt etwas, das keiner mehr kann",
      "das Grab liegt im Weg f\xFCr die neue Stra\xDFe",
      "wer die Geschichte anzweifelt, sitzt bald allein",
      "der Ort ist zu klein f\xFCr zwei Gr\xFCndungen"
    ],
    "stakes": [
      "Der Einsatz ist die Erinnerung eines ganzen Volkes.",
      "Der Einsatz ist der Ursprung aller kommenden Geschichten.",
      "Der Einsatz ist die Gunst der G\xF6tter.",
      "Der Einsatz ist das Bestehen der Weide selbst.",
      "Der Einsatz ist die Treue zweier Herzen \xFCber die Zeit hinaus.",
      "Der Einsatz ist die Wahrheit hinter jedem Mythos.",
      "Der Einsatz ist ein Feuer, das nicht ausgehen darf.",
      "Der Einsatz ist die Frage, wer zuerst da war.",
      "Der Einsatz ist eine Grenze, die ein Zufall gezogen hat.",
      "Der Einsatz ist ein Name und woher er kommt.",
      "Der Einsatz ist ein Tag, an dem alle dasselbe tun."
    ],
    "endings": [
      "So beginnt die Legende, die man sich noch heute erz\xE4hlt.",
      "So wird aus einem L\xE4cheln ein Ursprung.",
      "So verwandelt sich die Weide in heiligen Boden.",
      "So schlie\xDFt sich der Kreis der ersten Geschichte.",
      "So bleibt ihr L\xE4cheln in jedem Stein der Weide.",
      "So wird aus zwei Hirten ein Anfang.",
      "Und das Feuer brennt weiter, mit neuem Holz.",
      "So bleibt der Stein stehen, unleserlich.",
      "Am Ende erz\xE4hlt man es, wie man es immer erz\xE4hlt hat.",
      "Und der Baum treibt im Fr\xFChjahr wieder aus.",
      "So wird aus einem Zufall ein Anfang.",
      "Und die Grenze l\xE4uft, wo der Pflug ging.",
      "Der Feiertag bleibt, und der Grund ist vergessen.",
      "Und die Tafel bekommt einen Namen mehr.",
      "Und am Grab am Stra\xDFenanfang liegen wieder Blumen."
    ],
    "verwandlungen": [
      "Feuer\u2192Ger\xFCcht",
      "Grenze\u2192Naht",
      "Stein\u2192Knochen",
      "Quelle\u2192Wunde",
      "Baum\u2192Zeuge",
      "Name\u2192Schatten"
    ]
  },
  "staatsphilosophie": {
    "motifs": [
      "ein Gesetzbuch, das niemand je geschrieben hat",
      "ein Zepter aus verwittertem Holz",
      "eine Grenze, die durch das Land l\xE4uft, unsichtbar",
      "der Schatten eines Throns \xFCber den K\xF6pfen",
      "ein Siegelring, verloren im Gras",
      "ein Vertrag, in Leinen eingewebt",
      "die Stille eines Gesetzes vor seiner Verk\xFCndung",
      "ein Herrscherblick in den Augen der Beherrschten",
      "die Wiederkehr eines alten Eids",
      "ein Grenzstein, den niemand gesetzt hat",
      "ein Vertrag, den keiner unterschrieben hat und alle halten",
      "ein Platz, auf dem Entscheidungen laut gesagt werden",
      "ein Amt, das der Nachfolger nicht ablehnen darf",
      "eine Waage \xFCber einem Tor",
      "eine Versammlung, die sich selbst die Regeln gibt",
      "ein Schwur, den ein ganzes Volk gesprochen hat",
      "ein Gesetz, das \xE4lter ist als der Staat",
      "ein Herrscher, der von einer Regel abh\xE4ngt"
    ],
    "hooks": [
      "ein Kind tr\xE4gt ein Amulett mit einem fremden Wappen",
      "jemand murmelt Worte wie aus einem Gesetzestext",
      "eine Hand zeichnet Linien in den Staub, wie Grenzen",
      "ein Fremder fragt nach dem 'Herrn dieses Landes'",
      "der Wind tr\xE4gt eine Stimme, die von Pflicht spricht",
      "zwischen den Pflastersteinen liegt ein Siegel aus Ton",
      "alle folgen einer Ordnung, die niemand befahl",
      "ein Stein in der Erde tr\xE4gt eingeritzte Paragraphen",
      "Zwei D\xF6rfer teilen ein Feld und nennen keinen Richter.",
      "Der Grenzstein steht zwanzig Schritte weiter als fr\xFCher.",
      "Eine Versammlung entscheidet, und niemand hat einberufen.",
      "Der Herrscher fragt, wer ihn eingesetzt hat.",
      "Ein Fremder fordert dasselbe Recht wie alle.",
      "Der Eid wird gesprochen, und einer schweigt.",
      "Ein Gesetz wird verlesen, das keiner beschlossen hat.",
      "Im Rat sitzt einer, der nicht gew\xE4hlt wurde.",
      "Die Waage \xFCber dem Tor ist verschwunden.",
      "Ein Beschluss gilt, obwohl die H\xE4lfte fehlte."
    ],
    "props": [
      "einen zerbrochenen Herrscherstab",
      "eine Tontafel mit unleserlichen Gesetzen",
      "eine Schnur, verknotet wie ein Staatsvertrag",
      "einen alten Siegelring",
      "eine Fl\xF6te mit eingeritzten Symbolen",
      "ein vergilbtes Pergament ohne Unterschrift",
      "einen Gehstock mit eingeschnitzter Krone",
      "ein verrostetes Schloss ohne Schl\xFCssel",
      "eine M\xFCnze mit unbekanntem Antlitz",
      "einen Grenzstein mit einem Zeichen",
      "eine Waage aus Bronze",
      "ein Verzeichnis der Stimmberechtigten",
      "einen Stab, den man weiterreicht",
      "eine Tafel mit den ersten S\xE4tzen",
      "ein Siegel, das zwei H\xE4user tragen",
      "einen Losbeh\xE4lter aus Ton"
    ],
    "turns": [
      "pl\xF6tzlich zeigt sich im L\xE4rm der Menge eine Ordnung, die einem Gesetz gleicht",
      "ein L\xE4cheln verr\xE4t, dass jemand die stumme Verfassung l\xE4ngst versteht",
      "auf einmal scheint die ganze Stadt einem unsichtbaren Herrscher zu gehorchen",
      "ohne Vorwarnung spricht der Wind wie ein Urteil",
      "es scheint, als h\xE4tte das Land seit jeher eigene Gesetze",
      "die Ordnung h\xE4lt, ohne dass jemand sie durchsetzt",
      "der Herrscher gehorcht einer Regel und wird dadurch st\xE4rker",
      "die Mehrheit entscheidet gegen ihren eigenen Vorteil",
      "ein Recht wird gew\xE4hrt und l\xE4sst sich nicht zur\xFCcknehmen",
      "der Vertrag gilt, weil beide glauben, der andere halte ihn",
      "die Grenze verschwindet, und das Feld wird geteilt wie vorher",
      "eine Ausnahme wird gemacht und ist von da an die Regel",
      "der Rat setzt sich selbst ab",
      "die Gewohnheit siegt \xFCber das geschriebene Gesetz",
      "wer die Macht hat, fragt nach der Erlaubnis",
      "ein Fremder bekommt Recht, und die Ordnung h\xE4lt",
      "die Versammlung schweigt, und das gilt als Zustimmung",
      "ein Amt wird angenommen, das niemand wollte",
      "das Los entscheidet, und alle nehmen es an"
    ],
    "obstacles": [
      "die Grenze l\xE4sst sich nicht mit Worten erkl\xE4ren",
      "niemand erinnert sich, wer die ersten Regeln aufstellte",
      "niemand gehorcht mehr einem Ruf",
      "der alte Vertrag ist im Boden versunken",
      "ein Nebel verwischt jede sichtbare Ordnung",
      "der Rat ist beschlussf\xE4hig und uneins",
      "das Gesetz gilt f\xFCr alle und trifft am Ende einen",
      "die Mehrheit ist da und hat unrecht",
      "der Vertrag hat keine Zeugen mehr",
      "ein Amt bleibt unbesetzt, weil niemand es will",
      "die Ordnung h\xE4ngt an einem einzigen Mann",
      "der Fremde hat kein Recht, es zu verlangen",
      "die Versammlung tagt nur einmal im Jahr",
      "die Grenze ist gerecht und f\xFCr beide unbrauchbar",
      "niemand kann die Regel \xE4ndern, die das \xC4ndern regelt",
      "die Waage ist geeicht und wird nicht benutzt",
      "wer widerspricht, wird nicht mehr geladen"
    ],
    "stakes": [
      "Der Einsatz ist Gerechtigkeit: f\xFCr ein Land ohne Namen.",
      "Der Einsatz ist Ordnung: bewahrt von niemandem und doch von allen.",
      "Der Einsatz ist Macht: verborgen im L\xE4cheln der Weise.",
      "Der Einsatz ist Frieden: erkauft mit Schweigen.",
      "Der Einsatz ist Herrschaft: \xFCber etwas, das niemand sieht.",
      "Der Einsatz ist eine Ordnung, die niemand befiehlt.",
      "Der Einsatz ist ein Feld, das zwei D\xF6rfern geh\xF6rt.",
      "Der Einsatz ist die Frage, wer den Herrscher einsetzt.",
      "Der Einsatz ist ein Recht, das auch f\xFCr Fremde gilt.",
      "Der Einsatz ist ein Vertrag ohne Zeugen."
    ],
    "endings": [
      "So bleibt die Ordnung ungeschrieben, aber lebendig.",
      "Und alle folgen weiterhin einem Gesetz ohne Namen.",
      "So verschwimmt Herrschaft mit Gewohnheit.",
      "Am Ende l\xE4cheln alle, als w\xFCssten sie, wer wirklich regiert.",
      "So schlie\xDFt sich der Kreis von Macht und Stille.",
      "Am Ende steht der Grenzstein, wo er stehen soll.",
      "Und das Los wird zur\xFCck in den Beh\xE4lter gelegt.",
      "Und die Versammlung geht auseinander, ohne Beschluss.",
      "Der Stab wird weitergereicht, an den N\xE4chsten.",
      "Und das Feld wird geteilt wie in jedem Jahr.",
      "So h\xE4lt der Vertrag, weil beide es glauben.",
      "Und die Waage h\xE4ngt wieder \xFCber dem Tor."
    ],
    "verwandlungen": [
      "Vertrag\u2192Faden",
      "Grenze\u2192Naht",
      "Waage\u2192Uhr",
      "Gesetz\u2192Gitter",
      "Stab\u2192Zeiger",
      "Ordnung\u2192Gewohnheit"
    ]
  },
  "traumbilder": {
    "motifs": [
      "ein Flur, der sich bei jedem Blick neu ordnet",
      "Nebel, der Gesichter formt und wieder l\xF6st",
      "ein Zimmer, das im Schlaf zu atmen scheint",
      "eine Uhr, deren Zeiger im Schlaf weiterwandern",
      "eine Treppe, die nach unten f\xFChrt und h\xF6her endet",
      "Wolken, die wie erinnerte Gesichter ziehen",
      "ein Licht zwischen den B\xE4umen, das niemand entz\xFCndet hat",
      "eine Ebene, die sich in einen See aus Schlaf verwandelt",
      "ein Haus, in dem ein Zimmer mehr ist als gestern",
      "eine Treppe, die im Hinaufgehen flacher wird",
      "eine Stra\xDFe, auf der alle in dieselbe Richtung gehen",
      "ein Telefon, das klingelt und keinen Anschluss hat",
      "ein Pr\xFCfungssaal, in dem das Fach nicht genannt wird",
      "ein Zug, der abf\xE4hrt, w\xE4hrend man auf ihn zul\xE4uft",
      "ein Gesicht, das man kennt und nicht benennen kann",
      "ein Zimmer aus der Kindheit mit falschen Ma\xDFen"
    ],
    "hooks": [
      "ein L\xE4cheln, das \xE4lter wirkt als das Gesicht",
      "Gesichter, die alle in dieselbe Richtung schauen",
      "ein Windhauch, der nach fremden Worten riecht",
      "eine Hand, die zittert, ohne zu frieren",
      "ein Schatten, der jemandem folgt, aber nicht ihm geh\xF6rt",
      "ein Klang wie ferne Schritte \xFCber Wolken",
      "ein Ger\xE4usch, das erst beim Aufwachen aufh\xF6rt",
      "ein Zimmer, das man betritt und l\xE4ngst kennt",
      "Die T\xFCr f\xFChrt in ein Zimmer, das es im Haus nicht gibt.",
      "Alle sprechen weiter, und niemand bewegt den Mund.",
      "Der Zug f\xE4hrt ab, und die Beine werden schwer.",
      "Ein Bekannter hat das Gesicht von jemand anderem.",
      "Die Pr\xFCfung beginnt, und das Fach wird nicht genannt.",
      "Das Telefon klingelt, und der H\xF6rer ist warm.",
      "Der Flur wird l\xE4nger, je weiter er geht.",
      "Jemand sagt einen Satz, den man gleich vergisst.",
      "Im Spiegel steht das Zimmer seitenverkehrt und richtig.",
      "Der Wecker geht, und der Traum geht weiter."
    ],
    "props": [
      "einen Wecker, der r\xFCckw\xE4rts l\xE4uft",
      "einen Schl\xFCssel ohne Schloss",
      "einen Koffer, der mit jedem Schritt leichter wird",
      "einen Becher voller Traumwasser",
      "eine Kette aus getrockneten Blumen",
      "einen Ring, der nachts enger sitzt",
      "eine Schale mit stillem Wasser",
      "einen Spiegel, der eine Spur zu sp\xE4t reagiert",
      "eine Feder, die im Wind nicht f\xE4llt",
      "ein Telefon ohne Anschluss",
      "eine Fahrkarte f\xFCr einen Zug, der schon weg ist",
      "ein Heft mit einer Aufgabe darin",
      "eine Uhr, deren Zeiger man nicht ablesen kann",
      "eine T\xFCr ohne Klinke",
      "eine Lampe, die im Traum nicht angeht"
    ],
    "turns": [
      "Pl\xF6tzlich ist klar: hier wird getr\xE4umt, und niemand will erwachen.",
      "Die Stimmen verstummen, als jemand den Raum betritt, den es nicht gibt.",
      "Ein Windsto\xDF tr\xE4gt eine Stimme, die niemand ausgesprochen hat.",
      "Der Boden beginnt sich zu drehen, als l\xE4ge er in einem Traum.",
      "Im Spiegel bewegt sich das Bild einen Atemzug zu sp\xE4t.",
      "Der Himmel f\xE4rbt sich golden, obwohl es Nacht sein sollte.",
      "der Raum ordnet sich neu, sobald man wegsieht",
      "ein Fremder betritt das Zimmer, das es nicht gibt",
      "die Sprache funktioniert und ergibt keinen Sinn",
      "das Haus hat ein Zimmer mehr, und es war immer da",
      "der Zug h\xE4lt, und alle steigen an derselben Stelle aus",
      "er erkennt die Regel des Traums und verliert sie sofort",
      "die Toten sitzen mit am Tisch, und niemand wundert sich",
      "der Wecker klingelt im Traum und weckt niemanden",
      "die Pr\xFCfung ist bestanden, ohne dass etwas geschrieben wurde",
      "er erwacht in einen zweiten Traum",
      "das Gesicht bekommt einen Namen, und der ist falsch",
      "die Angst kommt sp\xE4ter als die Situation",
      "der Raum wird kleiner, und das ist beruhigend",
      "pl\xF6tzlich ist klar, dass getr\xE4umt wird, und niemand will erwachen",
      "das Zimmer hat ein Fenster, das gestern eine Wand war",
      "jemand ruft einen Namen, und alle drehen sich um"
    ],
    "obstacles": [
      "Alle sprechen eine Sprache, die nur im Traum verst\xE4ndlich ist.",
      "Der Weg zur T\xFCr verschwindet zwischen den Nebelschwaden.",
      "Der Weg zur\xFCck liegt offen, doch niemand findet ihn.",
      "Ein unsichtbares Gewicht h\xE4lt jeden Schritt zur\xFCck.",
      "Die Zeit scheint sich zu verdoppeln, ohne Fortschritt zu machen.",
      "Jede Stimme verhallt, bevor sie ihr Ende erreicht.",
      "die Beine gehen und kommen nicht vom Fleck",
      "das Wort f\xFCr die Sache fehlt genau jetzt",
      "die Treppe hat eine Stufe zu viel",
      "der Wecker ist im Traum kaputt",
      "niemand h\xF6rt, was gerufen wird",
      "die T\xFCr l\xE4sst sich \xF6ffnen und nicht durchschreiten",
      "die Zeit im Traum h\xE4lt sich an nichts",
      "der Koffer wird leichter und ist immer noch zu tragen",
      "das Zimmer ist bekannt und stimmt in keinem Ma\xDF",
      "wer aufwacht, verliert alles au\xDFer einem Bild",
      "die Pr\xFCfung wird von jemandem ohne Gesicht abgenommen",
      "der Weg zur\xFCck liegt offen, und niemand findet ihn",
      "alle sprechen eine Sprache, die nur im Traum verst\xE4ndlich ist"
    ],
    "stakes": [
      "Der Einsatz ist der Schlaf: das Letzte, was verl\xE4sslich bleibt.",
      "Der Einsatz ist der Glaube an das Unsichtbare.",
      "Der Einsatz ist die Erinnerung, die beim Erwachen zerf\xE4llt.",
      "Der Einsatz ist die Grenze zwischen Traum und Erwachen.",
      "Der Einsatz ist die Gewissheit, wach zu sein.",
      "Der Einsatz ist das, was der Traum nicht hergeben will.",
      "Der Einsatz ist ein Bild, das beim Erwachen bleibt.",
      "Der Einsatz ist ein Zimmer, das es geben m\xFCsste.",
      "Der Einsatz ist die Frage, wer hier tr\xE4umt.",
      "Der Einsatz ist ein Name f\xFCr ein bekanntes Gesicht."
    ],
    "endings": [
      "So verschwimmt der Traum mit dem Zimmer, f\xFCr immer.",
      "So bleibt nur ein L\xE4cheln, das die Zeit \xFCberdauert.",
      "So schlie\xDFt sich der Raum, kaum dass man ihn benannt hat.",
      "So bleibt vom Traum nur ein Wort, das niemand kennt.",
      "So endet der Traum, doch das L\xE4cheln bleibt wach.",
      "So verklingt alles im ersten Licht des Erwachens.",
      "Und der Wecker geht, und ein Bild bleibt.",
      "Am Ende ist der Koffer leer und schwer.",
      "Und der Zug f\xE4hrt ab, wie in jeder Nacht.",
      "So bleibt das Gesicht ohne Namen.",
      "Und der Flur wird k\xFCrzer, sobald man sich umdreht.",
      "Das Telefon h\xF6rt auf zu klingeln.",
      "Und am Morgen fehlt genau ein Zimmer.",
      "So schlie\xDFt sich das Zimmer, kaum dass es benannt ist.",
      "Und die Pr\xFCfung ist bestanden, ohne Fach."
    ],
    "verwandlungen": [
      "Traum\u2192Bericht",
      "Zimmer\u2192Grab",
      "Treppe\u2192Rampe",
      "Gesicht\u2192Zeichen",
      "Zug\u2192Bote",
      "Uhr\u2192Waage"
    ]
  },
  "mystery": {
    "motifs": [
      "eine Uhr, die r\xFCckw\xE4rts tickt",
      "eine T\xFCr, die von innen atmet",
      "ein Spiegelbild, das zu sp\xE4t reagiert",
      "ein Formular mit einem Feld zu viel",
      "ein Kabel, das warm wird, ohne Strom",
      "eine Narbe, die sich an das Wetter erinnert",
      "ein Name, der nicht ausgesprochen werden kann",
      "ein Licht, das die falschen Dinge zeigt",
      "ein Ger\xE4usch, das nur in Gedanken existiert",
      "eine Karte, die Orte erfindet",
      "eine Treppe, die einen Absatz zu viel hat",
      "ein Vorhang, der ohne Wind f\xE4llt",
      "eine Adresse, die zweimal existiert",
      "ein Anruf aus dem Nebenzimmer",
      "ein Schatten, der fr\xFCher da ist",
      "eine Notiz in der eigenen Handschrift",
      "ein Zimmer, das nach Regen riecht",
      "eine T\xFCr, die von au\xDFen abgeschlossen wurde",
      "ein Bild, auf dem jemand fehlt",
      "ein Ger\xE4usch unter dem Boden",
      "eine Kerze, die nicht k\xFCrzer wird",
      "ein Weg, der zur\xFCckf\xFChrt und nicht",
      "ein Koffer ohne Griff",
      "eine Zahl, die \xFCberall auftaucht",
      "ein Fenster, das nachts heller ist",
      "eine Stimme im Treppenhaus",
      "ein Kalenderblatt vom falschen Jahr",
      "ein Handabdruck an der Innenseite"
    ],
    "hooks": [
      "eine rote Feder im falschen Winkel",
      "ein Lichtstreifen, der aus dem Nichts kommt",
      "ein leises Klopfen hinter der Wand",
      "ein Foto, das ein Detail mehr zeigt als gestern",
      "ein Schatten, der nicht zur Figur passt",
      "eine Nachricht ohne Absender",
      "eine T\xFCr, die pl\xF6tzlich nicht mehr T\xFCr sein will",
      "Der Schl\xFCssel passt in ein Schloss, das es nicht gibt.",
      "Jemand hat abger\xE4umt, bevor jemand da war.",
      "Die Uhr im Flur geht der im Zimmer voraus.",
      "Ein Name f\xE4llt, den niemand ausgesprochen hat.",
      "Der Hund weicht seit gestern der T\xFCr aus.",
      "Die Nachricht kommt an, bevor sie geschrieben wird.",
      "Ein Fenster steht offen, das verriegelt war.",
      "Der Zettel liegt anders herum als vorhin.",
      "Zwei Zeugen erinnern dieselbe Stunde verschieden.",
      "Etwas fehlt im Regal, und niemand vermisst es.",
      "Der Schritt hallt einmal zu oft.",
      "Die Karte zeigt eine Stra\xDFe, die es nicht mehr gibt."
    ],
    "props": [
      "einen Schl\xFCssel",
      "eine Karte",
      "eine M\xFCnze",
      "ein Foto",
      "ein Notizbuch",
      "eine Lampe",
      "ein St\xFCck Kreide",
      "einen Kompass",
      "einen Ausweis",
      "ein Siegel",
      "einen Notizblock",
      "eine Taschenlampe",
      "einen Umschlag",
      "ein Tonband",
      "einen Fahrschein",
      "eine Haarnadel",
      "einen Zettel mit einer Zahl",
      "ein Fernglas",
      "eine Postkarte",
      "einen Handschuh",
      "ein Adressbuch",
      "einen Zweitschl\xFCssel",
      "eine Streichholzschachtel",
      "ein Notizbuch mit fehlenden Seiten"
    ],
    "turns": [
      "pl\xF6tzlich passt die Zeit nicht mehr zu den Uhren",
      "die Spur f\xFChrt nicht nach au\xDFen, sondern nach innen",
      "das Offensichtliche wird unbenennbar",
      "etwas antwortet \u2013 ohne Stimme",
      "die Logik bleibt bestehen, aber in falscher Reihenfolge",
      "der Zeuge war nie am Ort",
      "die Spur f\xFChrt in die eigene Wohnung",
      "das Alibi stimmt und hilft nicht",
      "der Zettel war schon immer da",
      "die Zeugin kennt den Namen aus dem Traum",
      "eine zweite T\xFCr wird gefunden",
      "die Aufnahme tr\xE4gt eine fremde Stimme",
      "der Fall geh\xF6rte jemand anderem",
      "die Ordnung war die Spur",
      "das Fehlende war der Hinweis",
      "die Frage wird von der Antwort gestellt",
      "ein Fund datiert von morgen",
      "der Beobachter wird beobachtet",
      "die Zeugin nennt eine Uhrzeit, die es zweimal gab",
      "der Gegenstand fehlt, und das ist der eigentliche Fund",
      "die eigene Aussage stimmt nicht mit der eigenen Erinnerung",
      "der Fall war schon einmal gel\xF6st, unter anderem Namen"
    ],
    "obstacles": [
      "die Schwelle ist bei Nacht nicht zu finden",
      "im Nebenzimmer wird es still, sobald er spricht",
      "der Kopf sagt etwas anderes als der K\xF6rper",
      "eine Regel gilt am Brunnen, die niemand erkl\xE4rt",
      "die Akte tr\xE4gt das falsche Datum",
      "die Zeit stimmt nicht mit der Uhr",
      "der Zeuge schweigt aus H\xF6flichkeit",
      "ein Name fehlt an entscheidender Stelle",
      "die Erinnerung \xE4ndert sich beim Erz\xE4hlen",
      "der Weg ist gesperrt und war es nie",
      "niemand gibt zu, dass er wartet",
      "das Licht reicht nur bis zur Biegung",
      "die Aufnahme bricht an derselben Stelle ab",
      "zwei Spuren f\xFChren zueinander",
      "das Zimmer wurde bereits ger\xE4umt",
      "die Karte endet vor dem Ziel",
      "der Schl\xFCssel dreht sich zweimal",
      "die Akte ist vollst\xE4ndig und darum verd\xE4chtig",
      "ein Zeuge sagt aus und war nachweislich woanders",
      "die Kamera lief, aber die Aufnahme fehlt f\xFCr vier Minuten",
      "niemand meldet den Vermissten, und das ist die Frage",
      "die Spur h\xF6rt an einer T\xFCr auf, die immer offen stand"
    ],
    "stakes": [
      "Der Einsatz ist ein Weg, den man nur einmal geht.",
      "Der Einsatz ist Zeit: Ein Teil des Abends kommt nicht zur\xFCck.",
      "Der Einsatz ist Wahrheit: Etwas am Selbstbild verschiebt sich.",
      "Der Einsatz ist Vertrauen: in sich selbst.",
      "Der Einsatz ist Gewissheit: Sie wackelt.",
      "Der Einsatz ist ein Name: Er steht auf zwei Listen.",
      "Der Einsatz ist die Nacht: Sie hat einen Zeugen.",
      "Der Einsatz ist ein Zimmer: Es geh\xF6rt jemandem.",
      "Der Einsatz ist eine Stunde: Sie fehlt.",
      "Der Einsatz ist ein Wort: Es wurde geh\xF6rt.",
      "Der Einsatz ist Erinnerung: Sie wird gepr\xFCft."
    ],
    "endings": [
      "Damit ist es entschieden, und der Termin steht.",
      "So schlie\xDFt sich die Schwelle hinter ihm.",
      "Und irgendwann \xF6ffnet es niemand mehr.",
      "Und die T\xFCr f\xE4llt ins Schloss.",
      "Und es ist, als h\xE4tte der Ort kurz geblinzelt.",
      "Und die Treppe hat wieder die richtige Zahl von Stufen.",
      "So bleibt der Schl\xFCssel liegen, wo er lag.",
      "Und im Flur riecht es weiter nach Regen.",
      "Damit ist nichts erkl\xE4rt und alles gesagt.",
      "Und das Licht im Nebenhaus geht endlich aus.",
      "So endet die Nacht, ohne dass jemand kam.",
      "Und die Zahl steht am n\xE4chsten Morgen woanders.",
      "Und der Fall bleibt geschlossen, an einer Stelle offen.",
      "So bleibt die Frage, wer die Uhr gestellt hat.",
      "Am Ende passt alles, bis auf eine Kleinigkeit.",
      "Und niemand fragt nach den vier fehlenden Minuten."
    ]
  },
  "bureau": {
    "motifs": [
      "ein Formular mit einem Feld zu viel",
      "eine Wartemarke, die sich warm anf\xFChlt",
      "ein Stempel, der auf der Haut bleibt",
      "ein Aktenzeichen, das deinen Namen enth\xE4lt",
      "eine Frist, die r\xFCckw\xE4rts l\xE4uft",
      "ein Register, das heimlich atmet",
      "eine Kopie, die das Original ersetzt",
      "ein Bescheid mit zu vielen Unterschriften",
      "ein Flur ohne Ende, der dich pr\xFCft",
      "ein Antrag, der dich beantragt",
      "ein Gang mit nummerierten T\xFCren",
      "ein Wartesaal, in dem alle dasselbe Formular halten",
      "ein Aktenschrank, der nicht abschlie\xDFt",
      "eine \xD6ffnungszeit, die nirgends aush\xE4ngt",
      "ein Regal mit Vorg\xE4ngen ohne Deckel",
      "die Kopie einer Kopie, noch lesbar",
      "eine Klingel ohne Schild",
      "ein Bescheid, der auf sich selbst verweist",
      "ein Wartezimmer mit einem Fenster zum Hof",
      "eine Unterschrift, die niemand entziffert",
      "ein Gummiband um einen Stapel Jahre",
      "ein Zust\xE4ndigkeitsbereich, der bei dir endet",
      "ein Antrag, der einen zweiten Antrag verlangt",
      "Neonlicht, das keinen Schatten wirft",
      "ein Laufzettel mit sieben Feldern",
      "ein Papierkorb, der geleert wird, w\xE4hrend du wartest",
      "eine Uhr \xFCber dem Schalter, die eine Minute vorgeht"
    ],
    "hooks": [
      "eine Durchsage, die nur dich meint",
      "ein falsches Datum auf der Akte",
      "ein Schalter ohne Personal",
      "ein Stempelger\xE4usch hinter der Wand",
      "ein Formular, das schon ausgef\xFCllt ist",
      "ein Ticket, dessen Nummer fehlt",
      "eine Unterschrift, die du nie gesetzt hast",
      "deine Nummer wird aufgerufen und wieder zur\xFCckgestellt",
      "der Bescheid tr\xE4gt ein Datum aus der Zukunft",
      "die zust\xE4ndige Stelle ist seit Montag eine andere",
      "am Schalter liegt dein Name schon bereit",
      "die Wartemarke zeigt eine Zahl, die es nicht gibt",
      "ein Anruf, bei dem niemand spricht",
      "die T\xFCr geht auf, bevor du klopfst",
      "im Flur wartet jemand, der dir \xE4hnlich sieht",
      "das Formular verlangt eine Angabe, die es verbietet",
      "auf dem Merkblatt fehlt die Seite zwei"
    ],
    "props": [
      "einen Ausweis",
      "einen Stempel",
      "eine Kopie",
      "ein Siegel",
      "eine Wartemarke",
      "eine Mappe",
      "einen Schl\xFCssel",
      "ein Register",
      "ein Formular",
      "eine Akte",
      "ein Aktenzeichen auf einem Zettel",
      "einen Laufzettel",
      "eine Wartenummer aus Pappe",
      "einen Briefumschlag mit Fenster",
      "ein Formblatt in dreifacher Ausfertigung",
      "eine Quittung ohne Betrag",
      "einen Kugelschreiber an einer Kette",
      "ein Merkblatt",
      "einen Terminzettel",
      "eine Vollmacht",
      "eine Karteikarte",
      "ein Kuvert, das man nicht \xF6ffnen darf",
      "einen Aktendeckel aus Pappe"
    ],
    "turns": [
      "pl\xF6tzlich gilt eine Regel r\xFCckwirkend",
      "die Spur f\xFChrt in ein Archiv, das dich kennt",
      "die Sachbearbeitung spricht in Imperativen",
      "ein Feld ist leer \u2013 und trotzdem ausgef\xFCllt",
      "die Logik bleibt korrekt, aber in falscher Reihenfolge",
      "du erh\xE4ltst eine Best\xE4tigung f\xFCr etwas, das du nicht getan hast",
      "die Zust\xE4ndigkeit wechselt mitten im Satz",
      "eine Frist beginnt, ohne dass jemand sie nennt",
      "der Antrag wird bewilligt und gleichzeitig abgelehnt",
      "die Akte enth\xE4lt einen Vorgang, den es nicht gab",
      "die Nummer wird noch einmal aufgerufen",
      "ein Beamter erkl\xE4rt, was er nicht darf",
      "der Bescheid gilt ab einem Tag, der vorbei ist",
      "der Flur f\xFChrt zur\xFCck zum Anfang",
      "eine zweite Unterschrift fehlt, immer",
      "die Auskunft widerspricht dem Merkblatt",
      "ein Stempel macht wahr, was nicht stimmt",
      "die Sache ist erledigt, aber nicht bei dir",
      "der Vorgang wird abgeschlossen und gleichzeitig neu er\xF6ffnet",
      "ein Beamter hilft, und danach ist er nicht mehr zust\xE4ndig",
      "die Frist verl\xE4ngert sich, weil niemand die Post geholt hat",
      "ein Formular wird abgeschafft und einen Monat sp\xE4ter gebraucht"
    ],
    "obstacles": [
      "die T\xFCr ist verschlossen",
      "jemand h\xF6rt mit",
      "die Akte tr\xE4gt das falsche Datum",
      "dein Antrag braucht einen Schatten",
      "das Fenster schlie\xDFt in drei Minuten",
      "die Sprechzeit endet in vier Minuten",
      "die Unterlagen sind vollst\xE4ndig, aber falsch",
      "der Vorgang liegt in einem anderen Haus",
      "ein Nachweis verlangt einen Nachweis",
      "die Bearbeitung dauert acht Wochen",
      "niemand ist zust\xE4ndig und alle sind h\xF6flich",
      "der Kugelschreiber schreibt nicht",
      "der Aufzug h\xE4lt nicht im vierten Stock",
      "die Auskunft gilt nur m\xFCndlich",
      "die Frist lief, w\xE4hrend du wartetest",
      "das Formular gibt es nur auf Papier",
      "eine Nummer wird gezogen, keine vergeben",
      "der Nachweis liegt in einem Amt, das umgezogen ist",
      "die Auskunft ist richtig und f\xFCr diesen Fall nicht anwendbar",
      "der Termin l\xE4sst sich nur telefonisch vergeben, ab acht",
      "das Formular gibt es in zwei Fassungen, beide g\xFCltig"
    ],
    "stakes": [
      "Der Einsatz ist Zeit: Die Frist ist real.",
      "Der Einsatz ist W\xFCrde: Du bist eine Nummer.",
      "Der Einsatz ist Wahrheit: Das Formular l\xFCgt nicht.",
      "Der Einsatz ist Kontrolle: Du hast sie nicht.",
      "Der Einsatz ist eine Frist: Sie l\xE4uft, ob du da bist oder nicht.",
      "Der Einsatz ist ein Nachweis, den es nicht gibt.",
      "Der Einsatz ist die Wohnung, die an dem Bescheid h\xE4ngt.",
      "Der Einsatz ist ein Name, den die Akte anders schreibt.",
      "Der Einsatz ist der Vormittag, den du daf\xFCr genommen hast.",
      "Der Einsatz ist die Auskunft: eine falsche gilt genauso.",
      "Der Einsatz ist die Ruhe, mit der man das Formular ausf\xFCllt."
    ],
    "endings": [
      "Und niemand unterschrieb.",
      "So schlie\xDFt sich der Kreis.",
      "Und im Dorf erz\xE4hlt man es anders.",
      "Und die T\xFCr f\xE4llt ins Schloss.",
      "Und der Bescheid bleibt ohne Antwort.",
      "Und der Vorgang wird zu den Akten genommen.",
      "So bleibt der Antrag anh\xE4ngig.",
      "Am Ende fehlt eine Unterschrift, und niemand wei\xDF wessen.",
      "Und die Nummer wird morgen wieder gezogen.",
      "So schlie\xDFt der Schalter p\xFCnktlich.",
      "Und im Flur wartet der N\xE4chste mit demselben Blatt.",
      "Der Bescheid ist da, die Sache nicht.",
      "Und der Vorgang bekommt eine neue Nummer.",
      "So wird der Antrag weitergeleitet, an dieselbe Stelle.",
      "Am Ende liegt ein Schreiben im Kasten, ohne Absender."
    ],
    "verwandlungen": [
      "Formular\u2192Papier",
      "Akte\u2192Mappe",
      "Stempel\u2192Riegel",
      "Frist\u2192Schnur",
      "Schalter\u2192Spiegel",
      "Nummer\u2192Ziffer",
      "Bescheid\u2192Befehl",
      "Flur\u2192Gang",
      "Antrag\u2192Wunsch"
    ]
  },
  "tech": {
    "motifs": [
      "ein Signal, das zu fr\xFCh ankommt",
      "ein Kabel, das warm wird ohne Strom",
      "ein Cache, der Erinnerungen speichert",
      "ein Sensor, der deine Gedanken misst",
      "ein Protokoll mit einer fehlenden Zeile",
      "ein Schl\xFCsselbund aus fremden Ports",
      "ein Rauschen, das Namen formt",
      "ein Update, das dich neu schreibt",
      "ein Bildschirm, der einen anderen Raum zeigt",
      "eine Schnittstelle, die zur\xFCckstarrt",
      "ein Serverraum, in dem es immer siebzehn Grad hat",
      "ein Dashboard, auf dem alles gr\xFCn ist",
      "ein Ticket, das seit zwei Jahren offen steht",
      "ein Kabelbaum, den niemand mehr entwirrt",
      "eine Zeile Code mit einem Kommentar von 2011",
      "eine Statusseite, die nie von selbst rot wird",
      "Protokolle, die schneller wachsen, als sie gelesen werden",
      "ein Rechenzentrum am Rand einer Kleinstadt",
      "ein Ger\xE4t, das mith\xF6rt und dabei hilft",
      "ein Konto, das seit dem Ausscheiden weiter Rechte hat"
    ],
    "hooks": [
      "ein Ping ohne Absender",
      "ein Ger\xE4t antwortet, bevor du fragst",
      "ein Logfile mit deinem n\xE4chsten Satz",
      "ein Lichtstreifen im Glas",
      "ein Port ist offen, obwohl alles offline ist",
      "ein Fehlercode, der wie ein Omen klingt",
      "eine Benachrichtigung aus der Zukunft",
      "Der Alarm kommt um zwei Uhr siebzehn, wie immer.",
      "Ein Dienst antwortet schneller, als er d\xFCrfte.",
      "Die Bereitstellung lief durch, und niemand hat sie ausgel\xF6st.",
      "Im Protokoll steht ein Zugriff aus einer leeren Etage.",
      "Die Kennzahl steigt seit Montag, und niemand hat es gemerkt.",
      "Ein Nutzer meldet einen Fehler, den es nicht geben kann.",
      "Der Bereitschaftsdienst hat gewechselt und wei\xDF es nicht.",
      "Die Datenbank ist schneller geworden, ohne Grund.",
      "Ein altes Konto meldet sich zum ersten Mal seit Jahren an.",
      "Der Notschalter ist da, und keiner hat ihn je gepr\xFCft.",
      "Zwei Systeme melden f\xFCr denselben Vorgang etwas anderes.",
      "Der Zeitstempel ist um genau eine Stunde daneben."
    ],
    "props": [
      "ein Kabel",
      "einen Sensor",
      "einen Schl\xFCssel",
      "ein Protokoll",
      "eine Lampe",
      "eine Karte",
      "ein Terminal",
      "einen Ausweis",
      "eine M\xFCnze",
      "ein Notizbuch",
      "ein Diensthandy mit stummgeschalteten Alarmen",
      "einen Notfallschl\xFCssel in einem Umschlag",
      "ein Laufwerk mit einer Sicherung von gestern",
      "eine Karte f\xFCr den Serverraum",
      "ein Kabel mit handgeschriebenem Etikett",
      "einen Bildschirm, der nie ausgeht",
      "ein Handbuch, das nicht mehr stimmt",
      "eine Liste mit Zug\xE4ngen",
      "einen Rechner ohne Netzverbindung",
      "eine Tasse mit dem Namen einer Firma, die es nicht mehr gibt"
    ],
    "turns": [
      "das System lernt deinen Namen zu schnell",
      "die Uhrzeit ist nur ein Platzhalter",
      "die Realit\xE4t rendert in Schichten",
      "du findest den Bug, aber er findet dich zuerst",
      "ein Backup \xFCberschreibt die Gegenwart",
      "das Rauschen enth\xE4lt eine Anweisung",
      "das System lernt schneller, als jemand es pr\xFCfen kann",
      "der Fehler war nie im Code, sondern in der Annahme",
      "die Sicherung existiert und l\xE4sst sich nicht zur\xFCckspielen",
      "die Kennzahl war richtig und hat das Falsche gemessen",
      "ein Abschalten w\xE4re m\xF6glich, und niemand traut sich",
      "der Vorfall war schon vorbei, als der Alarm kam",
      "die Warnung war da, sechs Monate fr\xFCher, in einem Ticket",
      "die schnelle L\xF6sung h\xE4lt, und deshalb bleibt sie",
      "der Dienst funktioniert nur noch, weil ein Fehler ihn st\xFCtzt",
      "die Protokolle zeigen, dass es niemand war",
      "ein R\xFCckbau dauert l\xE4nger, als der Aufbau gedauert hat",
      "die Firma wird verkauft, und die Daten gehen mit",
      "der Notschalter funktioniert und schaltet zu viel ab",
      "das Ger\xE4t h\xF6rt auf zu senden, und niemand vermisst es"
    ],
    "obstacles": [
      "das Signal bricht ab",
      "die Schnittstelle verlangt eine Geste",
      "die Erinnerung wackelt gegen die Aufzeichnung",
      "ein Protokoll widerspricht sich",
      "die Verbindung steht, und es ist kein Netz da",
      "die Kennung geh\xF6rt jemandem, der nicht mehr da ist",
      "niemand wei\xDF mehr, wof\xFCr dieser Dienst gebaut wurde",
      "der Bereitschaftsdienst ist eine Person f\xFCr vier Systeme",
      "die Wiederherstellung wurde nie geprobt",
      "das Protokoll h\xE4lt nur drei\xDFig Tage",
      "die Freigabe h\xE4ngt an einer Abteilung ohne Telefon",
      "der Fehler tritt nur unter Last auf",
      "die Dokumentation beschreibt eine \xE4ltere Fassung",
      "das Fenster f\xFCr den Umbau ist zwei Stunden lang",
      "die Abh\xE4ngigkeit steckt in einem Dienst von au\xDFen",
      "die Warnung geht an eine Verteilerliste ohne Empf\xE4nger",
      "der Rechner steht in einem Raum ohne Schl\xFCsselinhaber",
      "ein Vertrag verbietet den Blick in den Quelltext",
      "der Fehler verschwindet, sobald jemand hinsieht"
    ],
    "stakes": [
      "Der Einsatz ist Wahrheit: Welche Version gilt.",
      "Der Einsatz ist Zeit: Ein Timestamp kippt alles.",
      "Der Einsatz ist N\xE4he: zwischen dir und dem System.",
      "Der Einsatz ist Kontrolle: \xFCber das, was du f\xFCr real h\xE4ltst.",
      "Der Einsatz ist eine Nacht, in der niemand angerufen wird.",
      "Der Einsatz ist ein Datensatz, den es nur einmal gab.",
      "Der Einsatz ist das Vertrauen in eine gr\xFCne Statusseite.",
      "Der Einsatz ist ein Dienst, an dem andere Dienste h\xE4ngen.",
      "Der Einsatz ist die Frage, wer es h\xE4tte wissen m\xFCssen.",
      "Der Einsatz ist ein Schalter, den man einmal umlegen darf."
    ],
    "endings": [
      "Und das System schweigt \u2013 mit Absicht.",
      "Und der Bildschirm blinkt einmal zu viel.",
      "Und die Sicherung liegt weiter im Regal.",
      "Und vielleicht beginnt es erst hier.",
      "Und das Konto l\xE4uft weiter, Monat f\xFCr Monat.",
      "Und die Statusseite ist wieder gr\xFCn, wie vorher.",
      "So bleibt das Ticket offen und wandert in die n\xE4chste Woche.",
      "Am Ende steht ein Bericht, den drei Leute lesen.",
      "Und der Alarm kommt in der n\xE4chsten Nacht wieder.",
      "So l\xE4uft der Dienst weiter, gest\xFCtzt von seinem Fehler.",
      "Und das alte Konto bleibt bestehen, vorerst.",
      "Der Raum hat weiter siebzehn Grad, ob jemand da ist oder nicht.",
      "Und niemand legt den Schalter um.",
      "So wird die Ursache eingetragen und nicht behoben.",
      "Und im Protokoll steht alles, was man h\xE4tte sehen k\xF6nnen."
    ],
    "verwandlungen": [
      "System\u2192Gewebe",
      "Protokoll\u2192Ged\xE4chtnis",
      "Alarm\u2192Ruf",
      "Kabel\u2192Netz",
      "Dienst\u2192W\xE4chter",
      "Fehler\u2192Riss",
      "Karte\u2192Grenze",
      "Konto\u2192Grab"
    ]
  },
  "myth": {
    "motifs": [
      "ein Name, der ein Schl\xFCssel ist",
      "ein Omen, das dreimal erscheint und beim dritten Mal bleibt",
      "ein Faden, der auch unter Zug nicht rei\xDFt",
      "eine Maske, die dich ausw\xE4hlt",
      "ein Schrein im Alltag",
      "ein Fluss, der zuh\xF6rt",
      "ein Segen mit Widerhaken",
      "ein Bote in ziviler Kleidung",
      "ein Orakel aus Papier",
      "ein Zeichen aus Ru\xDF auf Gold",
      "ein Name, den man nur einmal nennen darf",
      "eine Schwelle, \xFCber die niemand ungebeten geht",
      "ein Zeichen, das dreimal an denselben Ort kommt",
      "ein Faden, der aus einer H\xF6hle f\xFChrt",
      "ein Opfer, das an einem Baum h\xE4ngt",
      "ein Fluss, den man nur mit einer Gabe \xFCberquert",
      "eine Alte am Wegrand, die eine Frage stellt",
      "ein Tier, das den Weg kennt",
      "ein Brunnen, in den man etwas werfen muss",
      "eine Geschichte, die im Dorf jeder anders erz\xE4hlt"
    ],
    "hooks": [
      "eine Feder, die im falschen Winkel im Weg liegt",
      "ein Fl\xFCstern, das aus dem Wasser kommt",
      "ein Schatten, der ein Opfer verlangt und wartet",
      "ein Brot, das nach Asche schmeckt",
      "eine M\xFCnze, die zur\xFCckkehrt",
      "eine T\xFCr, die den Namen sagt",
      "eine Kr\xE4he, die dich erkennt",
      "Das Zeichen kommt zum dritten Mal, an derselben Stelle.",
      "Eine Alte fragt nach dem Namen und bekommt einen falschen.",
      "Am Brunnen liegt eine Gabe, die niemand gebracht hat.",
      "Der Hund geht nicht \xFCber die Schwelle, zum ersten Mal.",
      "Ein Kind wiederholt einen Satz aus der alten Geschichte.",
      "Der Fluss steht still, und das gab es noch nie.",
      "Jemand nennt den Namen laut, und alle sehen weg.",
      "Am Baum h\xE4ngt etwas, das vorher nicht da war.",
      "Der Weg ist pl\xF6tzlich k\xFCrzer als jedes Mal davor.",
      "Die Alte ist fort, und die Frage steht noch."
    ],
    "props": [
      "eine M\xFCnze",
      "einen Kompass",
      "ein Siegel",
      "ein Foto",
      "eine Karte",
      "ein Notizbuch",
      "eine Lampe",
      "ein St\xFCck Kreide",
      "einen Schl\xFCssel",
      "einen Faden",
      "einen Faden, der aus einer H\xF6hle f\xFChrt",
      "eine M\xFCnze f\xFCr den F\xE4hrmann",
      "ein B\xFCndel Kr\xE4uter f\xFCr die Schwelle",
      "einen Ring, den man nicht verlieren darf",
      "eine Gabe f\xFCr den Brunnen",
      "ein Messer mit einem alten Griff",
      "eine Schale mit Milch f\xFCr die Nacht",
      "einen Stein mit einem Loch darin"
    ],
    "turns": [
      "der Ort verlangt eine Gabe",
      "das Zeichen kommt dreimal",
      "ein Versprechen bindet die Richtung",
      "die Spur f\xFChrt nach innen, nicht nach au\xDFen",
      "ein Gott tr\xE4gt deinen Mantel",
      "der Alltag wird zum Ritual",
      "der Ort verlangt eine Gabe, und sie wird gegeben",
      "das Zeichen kommt zum dritten Mal und meint etwas anderes",
      "ein Versprechen bindet die Richtung f\xFCr alle weiteren Wege",
      "der Name wird genannt, und es geschieht nichts",
      "die Alte war die, nach der er suchte",
      "die Gabe wird angenommen und reicht nicht",
      "der Faden rei\xDFt, und der Weg ist trotzdem da",
      "die alte Geschichte hat ein anderes Ende",
      "das Tier bleibt stehen, wo der Weg abzweigt",
      "der Fluss l\xE4sst ihn durch, aber nicht zur\xFCck",
      "was er mitbringt, geh\xF6rt ihm nicht mehr",
      "die Schwelle wird \xFCberschritten und schlie\xDFt sich",
      "eine Regel wird gebrochen, und niemand straft",
      "ein Zeichen wird missdeutet und f\xFChrt trotzdem richtig",
      "die Alte nennt einen Preis, der erst sp\xE4ter f\xE4llig wird",
      "der Ring wird verloren und findet sich am falschen Ort",
      "das Opfer am Baum ist keins mehr",
      "die Milch steht am Morgen unber\xFChrt vor der T\xFCr"
    ],
    "obstacles": [
      "die T\xFCr ist verschlossen",
      "eine Regel gilt, die niemand erkl\xE4rt",
      "jemand h\xF6rt mit",
      "der Name darf nicht ausgesprochen werden",
      "du musst etwas geben, bevor du nimmst",
      "der Name darf nur einmal genannt werden",
      "die Gabe muss von jemandem sein, der sie vermisst",
      "der F\xE4hrmann nimmt kein Geld von Lebenden",
      "niemand im Dorf will den Weg zeigen",
      "die Alte antwortet nur auf die richtige Frage",
      "das Zeichen kommt nicht zum dritten Mal",
      "wer sich umdreht, verliert alles",
      "die Geschichte wird im Nachbardorf anders erz\xE4hlt",
      "das Tier folgt nur einem, nicht zweien",
      "der Fluss steigt vor der D\xE4mmerung",
      "die Kr\xE4uter wachsen nur an einem Hang",
      "man darf nicht danken, und niemand wei\xDF warum",
      "der R\xFCckweg ist nicht derselbe",
      "die Schwelle darf nur bei Tageslicht \xFCberschritten werden",
      "der Brunnen nimmt keine zweite Gabe an",
      "niemand darf den Weg zweimal in einem Jahr gehen",
      "die Kr\xE4uter m\xFCssen vor Sonnenaufgang geschnitten werden",
      "wer den Namen h\xF6rt, ist damit gebunden",
      "die H\xF6hle hat einen zweiten Ausgang, den keiner kennt"
    ],
    "stakes": [
      "Der Einsatz ist Mut.",
      "Der Einsatz ist Wahrheit: ein Bild kippt.",
      "Der Einsatz ist Bindung: an Ort und Zeichen.",
      "Der Einsatz ist Erinnerung: was du nicht verlieren wolltest.",
      "Der Einsatz ist ein Name, den man nicht zur\xFCcknehmen kann.",
      "Der Einsatz ist eine Gabe, die jemandem fehlen wird.",
      "Der Einsatz ist die Frage der Alten am Wegrand.",
      "Der Einsatz ist das Versprechen, sich nicht umzudrehen."
    ],
    "endings": [
      "So schlie\xDFt sich der Kreis.",
      "Und der Brunnen gibt etwas zur\xFCck, das \xE4lter ist.",
      "Und es beginnt erst dort.",
      "Und die Maske bleibt zur\xFCck.",
      "Und die T\xFCr f\xE4llt ins Schloss.",
      "Und der Faden liegt am Eingang der H\xF6hle.",
      "So bleibt die Gabe im Brunnen, f\xFCr immer.",
      "Am Ende wird der Name nicht mehr genannt.",
      "Und die Alte sitzt am n\xE4chsten Tag wieder da.",
      "Und das Tier geht zur\xFCck, allein.",
      "Der Fluss steht still, bis der Morgen kommt.",
      "So bleibt die Geschichte, und der Weg bleibt zu.",
      "Und niemand dankt, wie es sich geh\xF6rt.",
      "Und die Milch steht am Morgen unber\xFChrt da.",
      "So bleibt der Ring verloren, und das ist gut.",
      "Am Ende geht der Weg nur in eine Richtung.",
      "Und der Baum tr\xE4gt, was jemand hingeh\xE4ngt hat."
    ],
    "verwandlungen": [
      "Name\u2192Schatten",
      "Faden\u2192Weg",
      "Brunnen\u2192Spiegel",
      "Gabe\u2192Schuld",
      "Tier\u2192Zeichen",
      "Fluss\u2192Faden"
    ]
  },
  "body": {
    "motifs": [
      "eine Narbe, die sich erinnert",
      "ein Atem, der immer einen Schlag zu sp\xE4t kommt",
      "ein Puls, der eine Antwort in die Schl\xE4fe klopft",
      "eine Kehle voller Wahrheit",
      "eine Hand, die nicht losl\xE4sst",
      "ein Augenlid wie ein Vorhang",
      "ein Zittern als Nachricht",
      "eine W\xE4rme ohne Ursache",
      "eine K\xE4lte im Knochen",
      "ein Salzgeschmack auf der Zunge",
      "ein Wartezimmer mit einer Waage in der Ecke",
      "eine Narbe, die bei Wetterwechsel meldet",
      "ein Herzschlag, den man im Kissen h\xF6rt",
      "ein Befund, der aus drei Zeilen besteht",
      "ein R\xFCcken, der sich an eine Bewegung erinnert",
      "eine Hand, die zittert, sobald jemand hinsieht",
      "ein K\xF6rper, der fr\xFCher wei\xDF als der Kopf",
      "eine Untersuchungsliege mit Papier darauf",
      "ein Spiegel im Bad, morgens um sechs"
    ],
    "hooks": [
      "ein Druck unter der Haut, der nicht wandert",
      "ein Ger\xE4usch im Brustbein, nur beim Einatmen",
      "ein Blick von innen auf einen fremden K\xF6rper",
      "ein Kribbeln als Warnung",
      "ein Schmerz, der Richtung hat",
      "ein Geschmack, der l\xFCgt",
      "eine Stille, die im K\xF6rper sitzt",
      "Der Befund kommt, und er ist unauff\xE4llig.",
      "Etwas zieht im R\xFCcken, seit Dienstag, immer gleich.",
      "Sie schl\xE4ft ein und wacht m\xFCder auf.",
      "Die Hand zittert, und niemand hat gefragt.",
      "Der Termin ist in vier Wochen, und es ist jetzt.",
      "Er l\xE4uft die Treppe und muss oben stehen bleiben.",
      "Ein Schmerz wandert und l\xE4sst sich nicht zeigen.",
      "Die Waage im Wartezimmer stimmt nicht mit der zu Hause.",
      "Ein Ger\xE4usch im Ohr ist da, seit dem Winter.",
      "Der Arzt h\xF6rt zweimal an derselben Stelle."
    ],
    "props": [
      "eine Lampe",
      "ein Foto",
      "ein Notizbuch",
      "ein St\xFCck Kreide",
      "eine M\xFCnze",
      "einen Schl\xFCssel",
      "eine Karte",
      "einen Kompass",
      "einen Ausweis",
      "ein Siegel",
      "einen Befund auf zwei Seiten",
      "eine Waage mit einer klemmenden Anzeige",
      "ein Rezept mit unleserlicher Schrift",
      "einen Verband, der zu fest sitzt",
      "ein Glas Wasser f\xFCr die Tabletten",
      "eine Karte mit Terminen",
      "einen Spiegel im Bad"
    ],
    "turns": [
      "der K\xF6rper wei\xDF es zuerst und sagt es zuletzt",
      "die Wahrheit sitzt im Hals und kommt nicht heraus",
      "der Schmerz ist ein Hinweis und kein Fehler im System",
      "die N\xE4he kippt in Kontrolle",
      "das Offensichtliche wird unbenennbar",
      "etwas antwortet \u2013 ohne Stimme",
      "der Befund ist unauff\xE4llig, und das Gef\xFChl bleibt",
      "eine Bewegung geht wieder, nach acht Wochen",
      "die Angst legt sich, und der Puls bleibt oben",
      "das Zittern h\xF6rt auf, sobald niemand hinsieht",
      "eine alte Verletzung meldet sich an einem neuen Ort",
      "er h\xF6rt auf zu z\xE4hlen und schl\xE4ft ein",
      "die Diagnose kommt und macht es leichter",
      "der K\xF6rper h\xE4lt, was der Vorsatz nicht h\xE4lt",
      "die Ber\xFChrung nimmt mehr als jedes Mittel",
      "eine Zahl im Befund erkl\xE4rt drei Jahre",
      "der Atem wird tiefer, ohne dass jemand es befiehlt",
      "die Untersuchung findet nichts, und das ist die Auskunft",
      "ein Mittel wirkt, und niemand wei\xDF warum",
      "der Schlaf kommt zur\xFCck, in der dritten Woche",
      "eine Frage des Arztes trifft die falsche Stelle richtig",
      "er sagt es aus, und der Druck l\xE4sst nach"
    ],
    "obstacles": [
      "die eigene Wahrnehmung wackelt",
      "jemand h\xF6rt mit",
      "die Luft im Zimmer wird zu dicht zum Atmen",
      "dein Atem passt nicht in den Raum",
      "du erkennst dich zu sp\xE4t",
      "der Termin ist erst in vier Wochen frei",
      "das Mittel hilft und macht m\xFCde",
      "niemand findet etwas, und es ist trotzdem da",
      "der Schmerz l\xE4sst sich nicht auf einer Skala sagen",
      "die Treppe im Haus hat achtundzwanzig Stufen",
      "das Gespr\xE4ch dauert sieben Minuten",
      "der Befund kommt per Post, nicht per Anruf",
      "die Nacht ist die schlechteste Zeit daf\xFCr",
      "die Arbeit fragt nach einer Bescheinigung",
      "der K\xF6rper h\xE4lt sich an keine Woche",
      "die \xDCbung m\xFCsste t\xE4glich sein",
      "die Kasse zahlt die andere Behandlung nicht",
      "niemand im Haus soll etwas merken",
      "die Angst ist gr\xF6\xDFer als der Anlass",
      "die Beschwerde ist nicht messbar und trotzdem da",
      "die Behandlung m\xFCsste am Vormittag stattfinden",
      "der Weg zur Praxis dauert vierzig Minuten",
      "die Zahlen sind gut, und das Gef\xFChl ist es nicht",
      "ein zweiter Termin w\xFCrde eine \xDCberweisung brauchen"
    ],
    "stakes": [
      "Der Einsatz ist eine Nacht ohne Aufwachen.",
      "Der Einsatz ist W\xFCrde.",
      "Der Einsatz ist Wahrheit: im K\xF6rper gespeichert.",
      "Der Einsatz ist Kontrolle: \xFCber Zittern und Stimme.",
      "Der Einsatz ist eine Bewegung, die wieder gehen soll.",
      "Der Einsatz ist ein Befund und was danach kommt.",
      "Der Einsatz ist die Frage, ob man es sagen soll."
    ],
    "endings": [
      "Und der Befund liegt auf dem K\xFCchentisch.",
      "Und vielleicht beginnt es erst hier.",
      "Damit ist es entschieden.",
      "Und die Luft wird d\xFCnn.",
      "Und du wei\xDFt es schon vorher.",
      "So bleibt der Termin stehen, in vier Wochen.",
      "Am Ende hilft die Bewegung mehr als das Mittel.",
      "Und die Treppe geht wieder, langsam.",
      "So schl\xE4ft sie ein, gegen drei.",
      "Und am Morgen ist es leichter oder nicht.",
      "Der K\xF6rper macht weiter, ob man will oder nicht.",
      "Und das Glas Wasser steht neben dem Bett.",
      "So bleibt die Narbe und meldet das Wetter.",
      "Und niemand im Haus hat etwas gemerkt.",
      "Und der Verband kommt am Freitag ab.",
      "So steht die Waage im Wartezimmer wie immer.",
      "Am Ende bleibt eine Zahl und eine Frage.",
      "Und die Nacht ist k\xFCrzer als die davor."
    ],
    "verwandlungen": [
      "Narbe\u2192Naht",
      "Befund\u2192Bescheid",
      "K\xF6rper\u2192Bau",
      "Atem\u2192Faden",
      "Spiegel\u2192Schatten",
      "Hand\u2192Klaue"
    ]
  },
  "absurd": {
    "motifs": [
      "ein Beweis, der sich widerspricht",
      "ein Paradoxon, das jemand am Rand kommentiert hat",
      "eine T\xFCr, die in keiner Wand steckt",
      "ein Kreis, der eckig wird",
      "eine Regel, die nur innerhalb des Raumes gilt",
      "ein Handbuch, das dich liest",
      "eine Hintert\xFCr, die mitten im Satz steht",
      "ein Punkt, der die Linie beobachtet",
      "eine Logik, die auf Glatteis gef\xFChrt wird",
      "ein Witz, der Z\xE4hne hat",
      "eine Stra\xDFe mit einem Baum und zwei M\xE4nnern",
      "ein Wartezimmer, in dem die Nummern r\xFCckw\xE4rts laufen",
      "ein Stein, den jemand jeden Tag denselben Hang hinaufrollt",
      "ein Formular, das nach dem Grund des Formulars fragt",
      "ein Aufzug, der nur zwischen zwei Stockwerken h\xE4lt",
      "eine Uhr, die zweimal am Tag zur\xFCckgestellt wird",
      "ein Vertrag, der auf einen zweiten Vertrag verweist",
      "ein Bahnhof, an dem seit Jahren kein Zug h\xE4lt",
      "ein Gespr\xE4ch, das jeden Tag beim selben Wort beginnt",
      "ein Amt, das f\xFCr sich selbst zust\xE4ndig ist",
      "eine Wand, an der ein Fenster gemalt ist",
      "ein Koffer, den niemand abholt"
    ],
    "hooks": [
      "ein Schild, das falsche Wahrheiten sagt",
      "ein Ausgang, der nach innen f\xFChrt",
      "ein Einspruch ohne Grund",
      "eine Gabelung, die sich schlie\xDFt",
      "eine Ausrede, die offiziell wird",
      "eine Randnotiz, die befiehlt",
      "ein Stempel auf einem Gedanken",
      "Sie warten, und der Erwartete schickt einen Jungen.",
      "Am Morgen ist die Arbeit von gestern wieder da.",
      "Der Schalter \xF6ffnet, und die Schlange bleibt stehen.",
      "Jemand erkl\xE4rt die Regel und widerspricht sich dabei nicht.",
      "Der Weg zur\xFCck ist l\xE4nger als der Weg hin.",
      "Ein Mann sagt, er gehe, und bleibt sitzen.",
      "Der Zug wird angesagt und kommt nicht.",
      "Auf dem Schild steht, dass das Schild nicht gilt.",
      "Der Aufzug f\xE4hrt hoch und \xF6ffnet unten.",
      "Ein Anruf best\xE4tigt einen Termin, den es nicht gibt.",
      "Die Uhr geht richtig, und niemand kommt p\xFCnktlich.",
      "Der Koffer steht seit Dienstag am selben Platz."
    ],
    "props": [
      "ein Handbuch",
      "eine Karte",
      "ein Foto",
      "eine M\xFCnze",
      "ein Notizbuch",
      "ein Siegel",
      "ein St\xFCck Kreide",
      "einen Schl\xFCssel",
      "einen Ausweis",
      "eine Lampe",
      "ein Handbuch, das auf sich selbst verweist",
      "einen Hut, der zweimal getauscht wurde",
      "eine Karte, auf der der Weg fehlt",
      "eine M\xFCnze, die immer auf die Kante f\xE4llt",
      "einen Terminzettel ohne Datum",
      "ein Seil, das jemand mitgebracht hat",
      "eine Wartenummer aus einem anderen Amt",
      "einen Stein, der in die Hand passt",
      "ein Schild mit abgebl\xE4tterter Schrift",
      "einen Schuh, der nicht mehr passt"
    ],
    "turns": [
      "alles ist korrekt \u2013 nur in falscher Reihenfolge",
      "du darfst gehen, aber nicht ankommen",
      "der Ausgang ist innen",
      "die Logik bleibt bestehen, aber kippt",
      "das Offensichtliche wird unbenennbar",
      "die Erkl\xE4rung bricht genau dort ab",
      "alles ist richtig, nur in der falschen Reihenfolge",
      "man darf gehen, aber nicht ankommen",
      "der Ausgang liegt innen, und die T\xFCr geht nach au\xDFen",
      "die Logik bleibt bestehen und kippt trotzdem",
      "das Offensichtliche l\xE4sst sich nicht mehr benennen",
      "der Erwartete l\xE4sst ausrichten, dass er morgen kommt",
      "die Regel wird erkl\xE4rt und dadurch unverst\xE4ndlich",
      "der Stein rollt zur\xFCck, und das ist der Sinn",
      "zwei M\xE4nner beschlie\xDFen zu gehen und bleiben",
      "das Warten wird zur Besch\xE4ftigung",
      "der Fehler wird behoben und tritt woanders auf",
      "der Grund des Formulars ist das Formular",
      "die Frage wird beantwortet und dadurch gr\xF6\xDFer",
      "die Wiederholung wird zur einzigen Ordnung"
    ],
    "obstacles": [
      "eine Regel gilt, die niemand erkl\xE4rt",
      "die T\xFCr ist verschlossen",
      "jemand h\xF6rt mit",
      "der Plan wird unbrauchbar",
      "die Zeit passt nicht zu den Uhren",
      "eine Regel gilt, die niemand erkl\xE4ren kann",
      "die T\xFCr ist verschlossen und hat kein Schloss",
      "der Plan wird unbrauchbar, sobald man ihn befolgt",
      "die Zeit passt nicht zu den Uhren im Raum",
      "niemand ist zust\xE4ndig und alle sind h\xF6flich",
      "der Zug wird t\xE4glich angesagt und f\xE4hrt nie",
      "das Amt ist nur mittwochs ge\xF6ffnet, au\xDFer mittwochs",
      "der Weg gabelt sich und f\xFChrt zweimal zur\xFCck",
      "die Antwort steht in einem Buch ohne Seitenzahlen",
      "der Aufzug h\xE4lt nur, wenn niemand darin steht",
      "das Formular verlangt eine Unterschrift des Formulars",
      "man darf warten, aber nicht sitzen",
      "der Baum wirft keinen Schatten f\xFCr zwei",
      "das Ende kommt nicht, und das ist keine Drohung"
    ],
    "stakes": [
      "Der Einsatz ist Kontrolle.",
      "Der Einsatz ist Wahrheit: ohne Beweis.",
      "Der Einsatz ist Zeit: in Schleifen.",
      "Der Einsatz ist W\xFCrde: im Witz.",
      "Der Einsatz ist ein Nachmittag, der zu Ende gehen soll.",
      "Der Einsatz ist ein Grund, morgen wiederzukommen.",
      "Der Einsatz ist die W\xFCrde in einem sinnlosen Amt.",
      "Der Einsatz ist ein Termin, den es geben m\xFCsste.",
      "Der Einsatz ist die Frage, ob man den Stein losl\xE4sst.",
      "Der Einsatz ist ein Gespr\xE4ch, das weitergeht.",
      "Der Einsatz ist der Witz, der das Warten tr\xE4gt."
    ],
    "endings": [
      "Und alles bleibt korrekt.",
      "Und es beginnt erst dort.",
      "So schlie\xDFt sich der Kreis.",
      "Und die T\xFCr f\xE4llt ins Schloss.",
      "Und niemand unterschrieb.",
      "Und alles bleibt korrekt bis zum Schluss.",
      "So kommt der Erwartete morgen, wie gestern.",
      "Am Ende steht der Koffer noch am selben Platz.",
      "Und sie beschlie\xDFen zu gehen und bleiben sitzen.",
      "So rollt der Stein zur\xFCck, und man geht ihm nach.",
      "Und das Schild bleibt h\xE4ngen, ung\xFCltig.",
      "Der Schalter schlie\xDFt, und die Schlange bleibt.",
      "Und morgen ist die Arbeit von heute wieder da."
    ],
    "verwandlungen": [
      "T\xFCr\u2192Wand",
      "Regel\u2192Gewohnheit",
      "Kreis\u2192Ring",
      "Stein\u2192Sack",
      "Formular\u2192Papier",
      "Zug\u2192Bote",
      "Amt\u2192Zimmer",
      "Uhr\u2192Waage"
    ]
  },
  "post": {
    "motifs": [
      "ein Archiv, das dich rekonstruiert",
      "eine Version, die \xE4lter ist als du",
      "ein Echo im Datennebel",
      "ein Speicher voller W\xE4rme",
      "ein Knoten aus Stimmen",
      "ein Prozess, der dich \xFCberschreibt",
      "ein Satz, der entfernt wird",
      "eine Instanz ohne K\xF6rper",
      "ein Backup als Erinnerung",
      "ein Rauschen als Kollektiv",
      "ein Archiv, in dem eine Person vollst\xE4ndig steht",
      "eine Sicherung, die \xE4lter ist als die Erinnerung",
      "ein Modell, das aus fremden S\xE4tzen besteht",
      "eine Stimme, die aus zweitausend Aufnahmen gemittelt ist",
      "ein Konto, das weiterl\xE4uft, nachdem jemand gegangen ist",
      "eine Fassung von 2019, die noch antwortet",
      "ein Nachlass in einem Ordner ohne Namen",
      "ein Gesicht, das aus Durchschnitten gebaut ist",
      "ein Satz, der von niemandem stammt und von allen",
      "ein L\xF6schauftrag, der eine Kopie \xFCbersieht"
    ],
    "hooks": [
      "eine Datei wirkt nach",
      "ein Prozess startet ohne Befehl",
      "eine Stimme aus Metall",
      "ein Index zeigt auf dich",
      "ein Kollektiv sagt deinen Namen",
      "ein Schatten aus Code",
      "ein Ping im Ged\xE4chtnis",
      "Der Dienst antwortet mit einem Satz, den sie gesagt h\xE4tte.",
      "Eine Sicherung von 2019 l\xE4sst sich noch \xF6ffnen.",
      "Das Konto meldet sich, ein Jahr nach der Beerdigung.",
      "Zwei Fassungen widersprechen sich \xFCber dasselbe Ereignis.",
      "Der L\xF6schauftrag ist best\xE4tigt, und die Datei ist noch da.",
      "Ein Modell erkennt eine Handschrift, die niemand hochgeladen hat.",
      "Die Stimme klingt richtig und sagt etwas Falsches.",
      "Ein Archiv verlangt eine Freigabe von jemandem, den es nicht gibt.",
      "Die Erinnerung stimmt nicht mit der Aufzeichnung \xFCberein.",
      "Jemand fragt die Kopie nach etwas, das nur das Original wusste."
    ],
    "props": [
      "ein Archiv",
      "einen Speicher",
      "einen Knoten",
      "ein Notizbuch",
      "eine Karte",
      "ein Siegel",
      "ein Foto",
      "eine Lampe",
      "einen Schl\xFCssel",
      "einen Ausweis",
      "eine Festplatte mit einer Beschriftung von 2011",
      "einen Ausdruck aus dem Archiv",
      "ein Mikrofon f\xFCr zweitausend S\xE4tze",
      "einen Schl\xFCssel zu einem Datenraum",
      "eine Liste der Fassungen",
      "ein Ger\xE4t ohne Netzverbindung",
      "einen L\xF6schauftrag mit Eingangsstempel",
      "ein Foto in schlechter Aufl\xF6sung"
    ],
    "turns": [
      "er ist nicht er, sondern eine Fassung von sich",
      "die Datei ist \xE4lter als der, den sie beschreibt",
      "ein Satz wird entfernt und wirkt im Modell weiter",
      "die Gegenwart ist nur ein Abgleich",
      "das Kollektiv spricht in dir",
      "die Realit\xE4t ist ein Protokoll",
      "die Kopie wei\xDF etwas, das das Original vergessen hat",
      "die Sicherung ist vollst\xE4ndig und trifft die Person nicht",
      "das Archiv rekonstruiert jemanden, der so nie war",
      "die L\xF6schung gelingt, und eine Kopie bleibt in Ordnung",
      "die Stimme wird abgeschaltet, und jemand vermisst sie",
      "die Fassung von 2019 widerspricht der von heute",
      "niemand kann sagen, welche Version gilt",
      "das Modell erfindet und trifft dabei zuf\xE4llig zu",
      "ein Erbe verlangt die Herausgabe der Aufnahmen",
      "die Erinnerung passt sich der Aufzeichnung an",
      "der Dienst wird eingestellt, und das ist der zweite Tod",
      "eine Fassung wird archiviert und damit unantastbar",
      "das Original meldet sich und wird nicht anerkannt",
      "die Fassung wird eingefroren und altert trotzdem",
      "ein Zugang bleibt bestehen, weil ihn niemand kennt",
      "das Original stimmt der Kopie zu und \xE4ndert nichts",
      "zwei Erben streiten \xFCber eine Stimme"
    ],
    "obstacles": [
      "deine Wahrnehmung wackelt",
      "die Verbindung ist da \u2013 aber ohne Netzwerk",
      "ein Prozess blockiert den Ausgang und meldet nichts",
      "jemand h\xF6rt mit (im Rauschen)",
      "du findest dich als Eintrag",
      "die Freigabe m\xFCsste von der Person selbst kommen",
      "die Sicherung ist da und nicht mehr lesbar",
      "das Format braucht ein Programm von 2006",
      "die L\xF6schung gilt nur f\xFCr den Hauptbestand",
      "niemand ist berechtigt, das zu entscheiden",
      "die Kopien liegen in drei L\xE4ndern mit drei Gesetzen",
      "der Dienst wird zum Jahresende eingestellt",
      "die Stimme klingt richtig und darf nicht benutzt werden",
      "ein Vertrag verbietet den Export",
      "die Erinnerung der Angeh\xF6rigen widerspricht den Daten",
      "das Archiv ist vollst\xE4ndig und darum unbrauchbar",
      "die Anfrage braucht eine Kennung, die abgelaufen ist",
      "eine Sperre gilt f\xFCr f\xFCnfzig Jahre",
      "wer l\xF6scht, kann nichts mehr pr\xFCfen",
      "das Rechenzentrum steht in einem anderen Rechtsraum",
      "die Freigabe h\xE4ngt an einem Passwort ohne Besitzer",
      "die Kopie wurde vor dem Widerruf gezogen",
      "die Pr\xFCfung des Bestands w\xFCrde Jahre dauern",
      "niemand hat das je f\xFCr diesen Fall vorgesehen"
    ],
    "stakes": [
      "Der Einsatz ist die Frage, welche Fassung gilt.",
      "Der Einsatz ist eine Erinnerung gegen eine Aufzeichnung.",
      "Der Einsatz ist Wahrheit: welche Version bleibt.",
      "Der Einsatz ist Kontrolle: \xFCber das \xDCberschreiben.",
      "Der Einsatz ist eine Stimme, die niemand abschalten will.",
      "Der Einsatz ist ein Nachlass, den niemand angeordnet hat.",
      "Der Einsatz ist eine L\xF6schung, die vollst\xE4ndig sein m\xFCsste."
    ],
    "endings": [
      "Und die Datei wirkt nach.",
      "Und vielleicht beginnt es erst hier.",
      "Und alles bleibt korrekt.",
      "Und der Satz fehlt weiter.",
      "Und es beginnt erst dort.",
      "So bleibt die Fassung von 2019 erreichbar.",
      "Am Ende antwortet der Dienst noch eine Weile.",
      "Und der L\xF6schauftrag ist best\xE4tigt und unvollst\xE4ndig.",
      "So bleibt eine Kopie, von der niemand wei\xDF.",
      "Der Ordner beh\xE4lt seinen Namen von damals.",
      "So wird aus einer Person ein Bestand.",
      "Und die Stimme klingt weiter richtig.",
      "Und die Liste der Fassungen wird l\xE4nger.",
      "So bleibt der Datenraum verschlossen und voll.",
      "Am Ende entscheidet die Frist und nicht der Wille.",
      "Und das Mikrofon steht abgeschaltet im Regal."
    ],
    "verwandlungen": [
      "Archiv\u2192Grab",
      "Stimme\u2192Spur",
      "Datei\u2192Akte",
      "Modell\u2192Ger\xFCst",
      "Konto\u2192Grab",
      "Kopie\u2192Maske"
    ]
  },
  "haute_couture": {
    "motifs": [
      "ein Saum aus fl\xFCssigem Silber",
      "eine Naht, die niemand findet",
      "T\xFCll \xFCber nacktem Licht",
      "ein Stoff, der sich erinnert",
      "die Schleppe im leeren Saal",
      "Seide mit dem Puls darunter",
      "ein Schnittmuster ohne K\xF6rper",
      "Perlen auf gespannter Haut",
      "der Schatten einer Schulter",
      "ein Kleid, das ohne Tr\xE4gerin steht",
      "ein Schnittmuster aus Seidenpapier",
      "Kreidestriche auf schwarzem Stoff",
      "eine Schneiderpuppe im Halbdunkel",
      "Perlen, einzeln aufgen\xE4ht, dreitausend St\xFCck",
      "ein \xC4rmel, der dreimal gel\xF6st wurde",
      "der Geruch von ged\xE4mpftem Wollstoff",
      "eine Kollektion in wei\xDFen H\xFCllen",
      "ein Etikett mit handgeschriebener Nummer",
      "Licht auf einem Laufsteg vor der Schau",
      "eine Naht, die dem K\xF6rper folgt statt dem Schnitt",
      "ein Kleid, das nur im Gehen lebt",
      "Zwirn in drei\xDFig Farben nebeneinander",
      "ein Abn\xE4her, der eine Haltung erzwingt",
      "Papierb\xF6gen mit Nummern am Boden",
      "eine Hand, die seit vierzig Jahren denselben Stich macht",
      "ein Kleiderst\xE4nder mit einem einzigen B\xFCgel"
    ],
    "hooks": [
      "eine Stecknadel liegt falsch",
      "der Spiegel zeigt den R\xFCcken zuerst",
      "ein Faden h\xE4ngt aus der Naht",
      "das Licht trifft nur den Saum",
      "ein Handschuh fehlt",
      "die Schneiderin schweigt zu lange",
      "ein Ma\xDF stimmt seit gestern nicht",
      "die Schau ist in vier Tagen, das Kleid in Teilen",
      "die Erste Hand k\xFCndigt",
      "der Stoff aus Lyon kommt nicht",
      "das Modell ist zwei Zentimeter schmaler geworden",
      "ein Entwurf liegt auf dem Tisch, den niemand gezeichnet hat",
      "die Farbe der Lieferung stimmt nicht mit der Probe",
      "der Spiegel im Salon ist \xFCber Nacht gesprungen",
      "ein Journalist steht fr\xFCher da als bestellt",
      "die Nadel bricht in der letzten Naht",
      "im Musterbuch fehlt eine Seite"
    ],
    "props": [
      "eine Schere",
      "einen Fingerhut",
      "ein Ma\xDFband",
      "eine Stecknadel",
      "einen Seidenfaden",
      "eine Schneiderpuppe",
      "einen Perlmuttknopf",
      "einen Kleidersack",
      "einen Handspiegel",
      "ein B\xFCgeleisen",
      "ein B\xFCgeleisen mit Dampf",
      "eine Spule Seidengarn",
      "einen Schnittbogen aus Papier",
      "ein Nadelkissen am Handgelenk",
      "ein Musterbuch mit Stoffproben",
      "eine Kreide in Blau",
      "einen Karton mit Perlen",
      "eine Rechnung aus Lyon",
      "einen Zettel mit Ma\xDFen",
      "ein Etikett ohne Namen",
      "eine Schere, die nur einer anfassen darf",
      "ein B\xFCndel Heftf\xE4den"
    ],
    "turns": [
      "die Naht platzt bei der Anprobe",
      "das Modell weigert sich zu gehen",
      "der Stoff ver\xE4ndert im Licht die Farbe",
      "ein Entwurf verschwindet \xFCber Nacht",
      "die Schneiderin n\xE4ht den Saum zu eng",
      "das Kleid passt einer Fremden besser",
      "der Stoff entscheidet gegen den Entwurf",
      "die Anprobe stellt alles um",
      "ein Fehler wird zum Muster",
      "die Erste Hand \xE4ndert, ohne zu fragen",
      "das Modell tr\xE4gt es anders als gedacht",
      "ein alter Schnitt taucht wieder auf",
      "die Farbe kippt unter dem Scheinwerfer",
      "der Name auf dem Etikett wechselt",
      "die Schau wird vorgezogen",
      "ein \xC4rmel wird geopfert f\xFCr den Rest",
      "der Entwurf geh\xF6rt pl\xF6tzlich dem Haus",
      "die Hand erinnert sich an einen Griff von fr\xFCher",
      "der Fehler in der Naht wird zum Zeichen des Hauses",
      "die Kundin will das Kleid einer anderen Saison",
      "ein Zulieferer stellt die Farbe ein, mitten in der Reihe",
      "die N\xE4herin \xE4ndert den Schnitt und beh\xE4lt es f\xFCr sich"
    ],
    "obstacles": [
      "der Stoff widersetzt sich der Schere",
      "die Zeit reicht bis zur Schau nicht",
      "die H\xE4nde zittern zu sehr",
      "ein Muster l\xE4sst sich nicht wiederholen",
      "niemand bezahlt die Seide",
      "die Perlen reichen f\xFCr ein Vorderteil",
      "der Saal ist erst am Abend frei",
      "die N\xE4herinnen arbeiten die dritte Nacht",
      "der Stoff franst bei jeder Naht",
      "das Haus zahlt keine \xDCberstunden mehr",
      "die Ma\xDFe stimmen nicht mit der Puppe",
      "niemand kann diesen Stich noch",
      "die Lieferung steht im Zoll",
      "das Licht im Atelier f\xE4llt aus",
      "der Entwurf ist schon woanders gesehen worden",
      "die Schere ist stumpf und keine zweite da",
      "die Zeit reicht f\xFCr Naht oder Saum, nicht f\xFCr beides",
      "der Stoff ist nur noch in einem Lager in Como",
      "die Anprobe f\xE4llt aus, und die Schau ist am Freitag",
      "die Perlen kommen aus einer Werkstatt, die geschlossen hat",
      "diese Naht zu lernen dauert l\xE4nger als die Kollektion"
    ],
    "stakes": [
      "Der Einsatz ist der Ruf eines Hauses.",
      "Der Einsatz ist die letzte Kollektion.",
      "Der Einsatz ist ein Name auf dem Etikett.",
      "Der Einsatz ist die Hand, die noch n\xE4hen kann.",
      "Der Einsatz ist ein einziger Abend.",
      "Der Einsatz ist die Schau: eine Stunde f\xFCr ein halbes Jahr.",
      "Der Einsatz ist eine Naht, die niemand sehen darf.",
      "Der Einsatz ist das Atelier und wer darin bleibt.",
      "Der Einsatz ist ein Handwerk, das keiner mehr lernt.",
      "Der Einsatz ist die Erste Hand: Sie geht oder sie bleibt.",
      "Der Einsatz ist ein Stoff, den es nur einmal gibt.",
      "Der Einsatz ist ein Auftrag, der das Jahr tr\xE4gt."
    ],
    "endings": [
      "Der Saum bleibt offen, das Licht geht aus.",
      "Am Ende tr\xE4gt es niemand.",
      "Die Puppe steht, die Schneiderin geht.",
      "Das Kleid wartet auf einen K\xF6rper, der nicht kommt.",
      "Alle Nadeln liegen ordentlich, alles ist zu sp\xE4t.",
      "Und die H\xFCllen bleiben zu, bis das Licht angeht.",
      "So geht das Kleid \xFCber den Steg und kommt nicht zur\xFCck.",
      "Am Ende z\xE4hlt niemand die dreitausend Perlen.",
      "Und die Puppe tr\xE4gt es weiter, wenn alle gegangen sind.",
      "So bleibt der Schnitt im Karton, f\xFCr sp\xE4ter.",
      "Und die Kreidestriche werden ausgeb\xFCrstet.",
      "Der Saum sitzt, der Rest war Arbeit.",
      "Und am Montag beginnt die n\xE4chste Kollektion.",
      "Und die Puppe steht wieder ohne Kleid im Atelier.",
      "So geht das Licht aus, und der Saum bleibt offen.",
      "Am Ende h\xE4ngt es in einem Schrank in einer anderen Stadt.",
      "Und die N\xE4herinnen r\xE4umen die F\xE4den vom Boden."
    ],
    "verwandlungen": [
      "Kleid\u2192Gewand",
      "Naht\u2192Narbe",
      "Puppe\u2192Statue",
      "Stoff\u2192Rauch",
      "Schere\u2192Klinge",
      "Faden\u2192Draht",
      "Spiegel\u2192Schatten",
      "Muster\u2192Gitter",
      "Saum\u2192Rand"
    ]
  },
  "eichendorff": {
    "motifs": [
      "ein Waldhorn in der Ferne",
      "mondbegl\xE4nzte Wipfel",
      "ein Brunnen, der nachts spricht",
      "das Rauschen \xFCber stillen Gr\xFCnden",
      "ein Wanderer ohne Ziel",
      "die Sehnsucht in den T\xE4lern",
      "ein Schloss im D\xE4mmerlicht",
      "Sterne \xFCber schwarzen Tannen",
      "ein Weg, der ins Offene f\xFChrt",
      "der Morgen hinter blauen Bergen",
      "ein Weg, der aus dem Tor f\xFChrt und nicht zur\xFCck",
      "ein Posthorn, das immer eine Biegung weiter klingt",
      "ein Garten hinter einer Mauer, aus dem es riecht",
      "Mondlicht, das \xFCber den Wipfeln liegt wie Wasser",
      "ein Wirtshaus mit einem Licht im Giebel",
      "ein Bach, der die ganze Nacht dasselbe sagt",
      "eine Kutsche, die vorbeif\xE4hrt und niemanden mitnimmt",
      "ein Schloss, in dem ein Fenster offen steht",
      "die Ferne, die von jedem H\xFCgel gleich weit ist",
      "ein Kreuz am Weg, an dem jemand Blumen lie\xDF"
    ],
    "hooks": [
      "ein Lied klingt aus dem Tal herauf",
      "die Wipfel rauschen ohne Wind",
      "jemand ruft einen alten Namen",
      "ein Licht brennt im leeren Schloss",
      "der Weg gabelt sich zweimal gleich",
      "das Horn verstummt mitten im Ton",
      "Ein Lied kommt \xFCber die Wiese und h\xF6rt mitten auf.",
      "Der Weg gabelt sich, und beide Arme f\xFChren bergab.",
      "Im Wirtshaus sitzt jemand, der denselben Weg ging.",
      "Das Horn klingt n\xE4her, obwohl die Post l\xE4ngst durch ist.",
      "Am Fenster steht ein Licht, das nicht f\xFCr ihn brennt.",
      "Der Wald h\xF6rt auf, und die Ebene ist zu weit.",
      "Ein M\xE4dchen singt, und der Text ist ein alter.",
      "Die Wipfel rauschen, obwohl kein Blatt sich bewegt.",
      "Ein Brief liegt im Wirtshaus, seit dem Fr\xFChjahr.",
      "Jemand ruft einen Namen, der bis hierher zu h\xF6ren ist.",
      "Der Mond geht auf, bevor die Sonne unten ist.",
      "Am Bach steht ein Schuh, sonst nichts."
    ],
    "props": [
      "einen Wanderstab",
      "ein Waldhorn",
      "einen Ring",
      "einen Brief",
      "eine Laute",
      "einen Mantel",
      "eine Feder",
      "einen Krug",
      "einen Wanderstab mit Kerben f\xFCr die Tage",
      "ein B\xFCndel mit einem Hemd und Brot",
      "ein Posthorn aus Messing",
      "einen Brief, dessen Siegel gebrochen ist",
      "eine Feldflasche aus Zinn",
      "einen Ring an einem Band",
      "ein Liederbuch mit weichen Seiten",
      "eine Laterne f\xFCr den Weg durch den Wald",
      "eine Feder aus einem fremden Hut",
      "ein Bild in einem kleinen Rahmen"
    ],
    "turns": [
      "der Wanderer kehrt um und findet nichts wieder",
      "das Lied kommt aus dem eigenen Mund",
      "der Wald \xF6ffnet sich auf eine fremde Stadt",
      "die Nacht bringt zur\xFCck, was der Tag nimmt",
      "ein Fremder kennt den Weg besser",
      "der Weg f\xFChrt zur\xFCck, und alles steht anders da",
      "das Lied kommt aus dem eigenen Mund, ohne dass er es wollte",
      "er kehrt ein und bleibt drei Tage l\xE4nger",
      "die Ferne kommt n\xE4her und ist dann nur eine Wiese",
      "ein Fremder nennt ihm den Namen des Schlosses",
      "der Wald \xF6ffnet sich, und dahinter liegt eine Stadt",
      "die Sehnsucht bekommt ein Gesicht und wird kleiner",
      "das Horn schweigt, und der Weg wird deutlich",
      "ein Brief holt ihn ein, den er nicht erwartet hat",
      "er singt, und jemand singt zur\xFCck",
      "die Nacht bringt zur\xFCck, was der Tag genommen hat",
      "er findet das Haus und geht daran vorbei",
      "der Mond geht unter, und der Weg bleibt hell",
      "er h\xF6rt auf zu suchen, und da ist es"
    ],
    "obstacles": [
      "die Sehnsucht findet kein Ziel",
      "der Wald schlie\xDFt sich hinter jedem Schritt",
      "die Nacht kommt zu fr\xFCh",
      "niemand antwortet auf das Horn",
      "das Heimweh zeigt in zwei Richtungen",
      "kein Wirt nimmt einen ohne Zeugnis auf",
      "die Nacht kommt fr\xFCher als der n\xE4chste Ort",
      "der Bach f\xFChrt Hochwasser und hat keine Br\xFCcke",
      "niemand kennt den Namen, den er nennt",
      "das Geld reicht bis zum \xFCbern\xE4chsten Dorf",
      "den Weg auf der Karte gibt es nicht mehr",
      "die Kutsche h\xE4lt nicht f\xFCr einen zu Fu\xDF",
      "das Tor des Schlosses bleibt geschlossen",
      "der Winter macht die P\xE4sse unbegehbar",
      "ein Lied f\xE4llt ihm nicht mehr vollst\xE4ndig ein",
      "die Post geht nur einmal in der Woche",
      "er wei\xDF nicht, wohin er eigentlich will",
      "die Ferne bleibt Ferne, von jedem H\xFCgel aus"
    ],
    "stakes": [
      "Der Einsatz ist die Heimat hinter den Bergen.",
      "Der Einsatz ist ein Versprechen aus dem Sommer.",
      "Der Einsatz ist die eigene Stimme.",
      "Der Einsatz ist der letzte helle Abend.",
      "Der Einsatz ist ein Name im Wind.",
      "Der Einsatz ist ein Abend, an dem das Licht noch brennt.",
      "Der Einsatz ist ein Lied, das jemand zu Ende h\xF6rt.",
      "Der Einsatz ist der Weg zur\xFCck, den man noch findet.",
      "Der Einsatz ist ein Sommer, der nicht wiederkommt.",
      "Der Einsatz ist ein Name, den er nicht aussprechen kann.",
      "Der Einsatz ist die Frage, ob es ein Ankommen gibt."
    ],
    "endings": [
      "Das Horn verklingt, die Wipfel rauschen weiter.",
      "Er geht, und der Wald bleibt wach.",
      "Der Morgen kommt und findet niemanden mehr.",
      "\xDCber den Gr\xFCnden steht der alte Mond.",
      "Die Sehnsucht bleibt, der Weg bleibt offen.",
      "Und das Horn klingt eine Biegung weiter, dann nicht mehr.",
      "So rauschen die Wipfel \xFCber einem leeren Weg.",
      "Am Ende steht der Mond \xFCber den Gr\xFCnden wie immer.",
      "Und im Giebel brennt das Licht bis zum Morgen.",
      "So geht er weiter, und der Wald bleibt wach.",
      "Und der Bach sagt die ganze Nacht dasselbe.",
      "Der Weg f\xFChrt aus dem Tor und nicht zur\xFCck.",
      "Und am Kreuz liegen die Blumen vom Fr\xFChjahr.",
      "So bleibt die Ferne, wo sie war.",
      "Und niemand fragt, wohin er unterwegs ist."
    ],
    "verwandlungen": [
      "Wald\u2192Traum",
      "Horn\u2192Lied",
      "Mond\u2192Zeuge",
      "Weg\u2192Faden",
      "Ferne\u2192N\xE4he",
      "Bach\u2192Atem",
      "Licht\u2192Fenster",
      "Kutsche\u2192Wolke"
    ]
  },
  "dickens": {
    "motifs": [
      "Nebel \xFCber schwarzen D\xE4chern",
      "eine Gasse voller Ru\xDF",
      "ein Kaminfeuer ohne W\xE4rme",
      "gest\xE4rkte Kragen und leere M\xE4gen",
      "ein Kontor mit kalten Fenstern",
      "Kinderh\xE4nde an fremder Arbeit",
      "eine Uhr im Treppenhaus",
      "der Atem in ungeheizten Zimmern",
      "eine Suppe, die nicht reicht",
      "Kerzenstummel im Amtszimmer",
      "ein Treppenhaus mit ausgetretenen Stufen",
      "Kohlenstaub auf der Fensterbank",
      "ein Ladenschild, das im Wind schl\xE4gt",
      "eine W\xE4rmestube mit zu wenig B\xE4nken",
      "W\xE4scheleinen \xFCber der Gasse",
      "ein Pfandhaus mit vergitterter Auslage",
      "ein Kontorbuch mit roter Linie",
      "der Ofen im Hinterzimmer",
      "eine Droschke, die niemand ruft",
      "ein Hof ohne Sonne",
      "eine Suppenk\xFCche vor dem \xD6ffnen",
      "ein Kind mit zu gro\xDFen Schuhen",
      "der Nebel zwischen zwei Lampen",
      "ein Sonntagsanzug im Schrank",
      "eine Rechnung, die zweimal kam"
    ],
    "hooks": [
      "ein Waisenjunge steht in der T\xFCr und nimmt die M\xFCtze ab",
      "der Vormund z\xE4hlt zweimal falsch, und beide Male zu seinen Gunsten",
      "ein Testament taucht sieben Jahre zu sp\xE4t auf",
      "jemand klopft im Schuldnerviertel an eine T\xFCr ohne Nummer",
      "ein Brief tr\xE4gt kein Siegel und doch eine bekannte Hand",
      "die Rechnung stimmt seit Jahren nicht und wurde nie gepr\xFCft",
      "Der Gl\xE4ubiger gr\xFC\xDFt freundlich auf der Stra\xDFe.",
      "Ein Brief kommt aus einer Stadt, die niemand nannte.",
      "Die Miete ist bezahlt, von wem, wei\xDF keiner.",
      "Der Laden bleibt einen Tag geschlossen, ohne einen Zettel an der Scheibe.",
      "Im Kontor brennt Licht lange nach Feierabend.",
      "Ein Kind steht seit Stunden vor dem Fenster.",
      "Der Vormund kommt eine Woche zu fr\xFCh.",
      "Jemand kauft die Schuld auf und nennt keinen Preis.",
      "Der Name im Buch ist durchgestrichen, und dar\xFCber steht ein anderer.",
      "Die W\xE4rmestube hat heute geschlossen, zum ersten Mal seit Jahren.",
      "Der Ofen bleibt kalt, obwohl Kohle da ist.",
      "Zwei Namen stehen unter demselben Vertrag, in derselben Hand."
    ],
    "props": [
      "eine Taschenuhr",
      "einen Federkiel",
      "einen Schuldschein",
      "eine Kerze",
      "einen Kohleneimer",
      "ein Kontobuch",
      "einen Kanten Brot",
      "einen abgetragenen Mantel",
      "ein Kontorbuch",
      "eine Suppenkelle",
      "einen Wollschal",
      "ein Tintenfass",
      "eine Wolldecke",
      "einen Pfandschein",
      "eine Blechb\xFCchse",
      "ein Gesangbuch",
      "einen W\xE4rmestein",
      "eine Petroleumlampe",
      "einen Handkarren",
      "einen Zinnbecher",
      "eine Sch\xFCrze",
      "ein B\xFCndel Briefe",
      "einen Fahrschein dritter Klasse"
    ],
    "turns": [
      "der Wohlt\xE4ter erweist sich als der Gl\xE4ubiger, den man f\xFCrchtete",
      "ein Kind erbt, was niemand erwartet, und versteht es nicht",
      "der Schreiber weigert sich zu unterschreiben und legt die Feder hin",
      "die Armenkasse ist leer bis zum Ende des Quartals",
      "ein Fremder bezahlt die Schuld und nennt seinen Namen nicht",
      "der Gl\xE4ubiger erl\xE4sst die H\xE4lfte, aus einem Grund, den keiner erf\xE4hrt",
      "das Testament nennt einen Fremden, den es nicht geben d\xFCrfte",
      "der Schreiber verliert die Stelle f\xFCr eine Zeile zu viel",
      "die Armenkasse wird gepr\xFCft, und der Pr\xFCfer kommt aus London",
      "ein alter Brief taucht im Kontor auf",
      "das Kind wird abgeholt, und niemand sagt von wem",
      "der Vormund tritt zur\xFCck, ohne einen Grund zu nennen",
      "die W\xE4rmestube bekommt Kohle f\xFCr eine Woche, gestiftet",
      "ein Name wird wieder eingetragen, in dieselbe Zeile",
      "der Winter endet fr\xFCher als der Vorrat",
      "ein Zeuge erinnert sich anders als vor dem Winter",
      "das Haus wird an einem Dienstag versteigert, im Regen",
      "der Lohn kommt in M\xFCnzen statt Papier"
    ],
    "obstacles": [
      "das Amt schlie\xDFt eine Stunde vor der angeschriebenen Zeit",
      "niemand b\xFCrgt f\xFCr einen, der keinen Namen vorweisen kann",
      "der Winter kommt drei Wochen vor dem Lohn",
      "die Papiere fehlen, und niemand stellt neue aus",
      "der Vormund unterschreibt nicht ohne zwei Zeugen",
      "die Kohle reicht nicht bis Februar",
      "der Schuldturm nimmt keine B\xFCrgschaft von einem Dienstboten",
      "niemand stellt ein Zeugnis aus f\xFCr eine halbe Stelle",
      "das Kontor zahlt erst zum Monatsende",
      "der Weg zur Stadt kostet den Tageslohn",
      "die Suppe reicht nicht f\xFCr alle",
      "der Brief braucht eine Marke, die einen Tageslohn kostet",
      "der Vormund ist bis nach Ostern verreist",
      "das Zimmer ist bis Ostern vergeben",
      "die Papiere liegen beim Anwalt, und der ist selten da",
      "der Anwalt nimmt keine Kleinigkeiten an",
      "die Droschke ist zu teuer f\xFCr diesen und jeden Monat",
      "die Adresse existiert nicht mehr, das Haus steht noch"
    ],
    "stakes": [
      "Der Einsatz ist ein Platz am Feuer.",
      "Der Einsatz ist der Name der Mutter.",
      "Der Einsatz ist die Freiheit aus dem Schuldturm.",
      "Der Einsatz ist ein Winter ohne Hunger.",
      "Der Einsatz ist die Ehre eines Hauses.",
      "Der Einsatz ist die Kohle f\xFCr den Winter.",
      "Der Einsatz ist ein Zeugnis.",
      "Der Einsatz ist ein Zimmer mit Ofen.",
      "Der Einsatz ist die Schuld eines Vaters.",
      "Der Einsatz ist der Sonntag ohne Arbeit.",
      "Der Einsatz ist ein Kind, das bleiben soll."
    ],
    "endings": [
      "Der Nebel steht in der Gasse, das Kontor bleibt dunkel.",
      "Am Morgen ist die Kerze herunter, die Rechnung offen.",
      "Jemand zahlt, aber es ist um zwei Tage zu sp\xE4t.",
      "Das Kind geht durch die Gasse und z\xE4hlt seine Schritte.",
      "Die Uhr im Treppenhaus schl\xE4gt in ein leeres Haus.",
      "Und die Lampe im Kontor geht als letzte aus.",
      "So bleibt der Nebel zwischen den H\xE4usern stehen.",
      "Am Morgen steht der Karren wieder in der Gasse.",
      "Und im Ofen glimmt noch etwas, bis zum Morgen.",
      "So z\xE4hlt sie die M\xFCnzen ein zweites Mal.",
      "Und der Winter dauert noch acht Wochen, nach dem Kalender."
    ]
  },
  "urknall": {
    "motifs": [
      "ein Punkt ohne Ausdehnung",
      "der erste Riss im Nichts",
      "Licht, das \xE4lter ist als Raum",
      "eine Temperatur ohne Ort",
      "Materie im Zustand des Werdens",
      "ein Rauschen aus allen Richtungen",
      "gekr\xFCmmte Zeit",
      "die Ausdehnung eines Augenblicks",
      "ein Hintergrund aus W\xE4rme",
      "der Abdruck des Anfangs",
      "eine Kurve, die nicht schlie\xDFt",
      "ein Detektor tief unter Gestein",
      "eine Zahl mit zu vielen Nullen",
      "ein Spektrum mit einer L\xFCcke",
      "eine Antenne im Frost",
      "Rauschen, das aus allen Richtungen gleich kommt",
      "ein Modell mit einem freien Parameter",
      "eine Aufnahme aus zwei N\xE4chten",
      "ein K\xFChlkreis, der nie stillsteht",
      "eine Skala ohne Nullpunkt",
      "ein Diagramm mit einem Ausrei\xDFer",
      "ein Spiegel von zehn Metern",
      "eine Messreihe ohne Ende",
      "die W\xE4rme des leeren Raums"
    ],
    "hooks": [
      "das Rauschen kommt aus jeder Richtung gleich stark, auf ein Tausendstel genau",
      "eine Konstante verschiebt sich um ein Weniges, und niemand findet den Grund",
      "der Hintergrund ist um Bruchteile w\xE4rmer, als jede Rechnung erlaubt",
      "ein Signal ist \xE4lter als alles, was es h\xE4tte aussenden k\xF6nnen",
      "die Ausdehnung beschleunigt sich, obwohl nichts sie treiben sollte",
      "Zwei Teams messen dasselbe mit verschiedenen Ger\xE4ten und kommen auseinander.",
      "Der Ausrei\xDFer wiederholt sich in der dritten Nacht, an derselben Stelle.",
      "Eine Konstante stimmt seit gestern nicht mehr, und gestern war nichts anders.",
      "Das Signal kommt aus einer Richtung ohne Quelle.",
      "Die Aufnahme zeigt etwas, das j\xFCnger sein m\xFCsste.",
      "Der Detektor spricht an, wenn er ruhen sollte.",
      "Ein Wert wurde zweimal ver\xF6ffentlicht, verschieden.",
      "Die Rechnung geht auf, wenn man eine Gr\xF6\xDFe erfindet.",
      "Das Rauschen hat eine Struktur, die sich nicht wegrechnen l\xE4sst.",
      "Der Untergrund ist heute ruhiger als je zuvor.",
      "Eine Linie fehlt im Spektrum, die in jeder fr\xFCheren Aufnahme stand.",
      "Das Protokoll nennt eine Uhrzeit, die es nicht gab."
    ],
    "props": [
      "ein Spektrometer",
      "eine Antenne",
      "eine Rechentafel",
      "ein Teleskop",
      "ein Diagramm",
      "einen Detektor",
      "eine Uhr",
      "eine Photoplatte",
      "ein Interferometer",
      "eine K\xFChlfalle",
      "einen Zeitgeber",
      "ein Logbuch",
      "einen Filter",
      "einen Detektorkopf",
      "ein Kabel mit Bleimantel",
      "eine Blende",
      "einen Schreiber",
      "ein Messprotokoll",
      "ein Justiergewicht",
      "eine Zeitmarke",
      "einen Dewar",
      "eine Reinraumhaube"
    ],
    "turns": [
      "die Messung widerspricht dem Modell, das seit drei\xDFig Jahren tr\xE4gt",
      "das Rauschen erweist sich als Erinnerung an einen sehr fr\xFChen Zustand",
      "die Konstante \xE4ndert sich mit der Entfernung, also ist sie keine",
      "jemand rechnet die Zeit r\xFCckw\xE4rts weiter, \xFCber die Stelle hinaus, an der man aufh\xF6rt",
      "der Anfang l\xE4sst kein Davor zu, und die Frage bleibt trotzdem stehen",
      "die zweite Messung best\xE4tigt den Fehler, statt ihn aufzul\xF6sen",
      "ein Modell wird fallen gelassen, an dem eine Generation gearbeitet hat",
      "das Rauschen war die ganze Zeit das Ergebnis, nicht die St\xF6rung",
      "die Konstante h\xE4ngt von der Entfernung ab und hei\xDFt weiter Konstante",
      "ein Vorzeichen kehrt sich um, und die Rechnung sagt das Gegenteil",
      "die L\xFCcke im Spektrum schlie\xDFt sich auch nach vier N\xE4chten nicht",
      "die Skala reicht nicht weiter zur\xFCck, und dahinter liegt der Rest",
      "ein alter Wert war richtig, und niemand hatte ihn geglaubt",
      "das Instrument misst am Ende sich selbst und nichts sonst",
      "die Frage verliert ihren Sinn, sobald man sie genau stellt",
      "eine dritte Gruppe misst genau dazwischen und macht es schlimmer",
      "der Fehler steckte im Kabel, drei Meter vor dem Verst\xE4rker",
      "die Reihe wird von vorn begonnen, mit besserer K\xFChlung"
    ],
    "obstacles": [
      "die Gleichung teilt durch null, genau an der interessanten Stelle",
      "kein Instrument reicht so weit zur\xFCck, und keines wird es je",
      "das Licht kommt zu sp\xE4t an, um noch etwas zu entscheiden",
      "die Skala versagt bei so kleinen Zahlen vollst\xE4ndig",
      "niemand kann au\xDFerhalb stehen und von dort aus zusehen",
      "das Instrument driftet mit der Temperatur im Kuppelraum",
      "die Zeit am Detektor l\xE4uft anders als die im Rechnerraum",
      "kein Vergleichswert aus einem anderen Haus liegt vor",
      "der Untergrund \xFCberdeckt das Signal um zwei Gr\xF6\xDFenordnungen",
      "die Rechnung braucht mehr Stellen, als die Maschine f\xFChrt",
      "die Beobachtungsnacht f\xE4llt aus, wegen Wind aus Nordwest",
      "zwei Kalibrierungen widersprechen sich um mehrere Prozent",
      "es fehlt an K\xFChlmittel bis zur n\xE4chsten Lieferung",
      "das Modell erlaubt kein Davor, und die Frage bleibt",
      "die Statistik reicht f\xFCr keine Aussage, die man drucken darf",
      "die Nacht ist zu warm f\xFCr die Messung",
      "der Rechner braucht drei Wochen f\xFCr einen einzigen Durchlauf",
      "die Blende sitzt schief, und es f\xE4llt erst am Morgen auf"
    ],
    "stakes": [
      "Der Einsatz ist die erste Sekunde.",
      "Der Einsatz ist ein widerlegtes Weltbild.",
      "Der Einsatz ist die Herkunft aller Dinge.",
      "Der Einsatz ist eine einzige Zahl.",
      "Der Einsatz ist das Recht auf eine Frage.",
      "Der Einsatz ist eine Zahl mit Folgen.",
      "Der Einsatz ist eine Nacht am Instrument.",
      "Der Einsatz ist ein Modell, das lange trug.",
      "Der Einsatz ist die Reihe, die niemand wiederholt.",
      "Der Einsatz ist ein Vorzeichen.",
      "Der Einsatz ist das Recht auf die Frage nach dem Davor."
    ],
    "endings": [
      "Das Rauschen bleibt, die Antwort dehnt sich weiter aus.",
      "Alles fliegt auseinander, gleichm\xE4\xDFig und ohne Eile.",
      "Der Anfang liegt hinter jedem Punkt gleich weit.",
      "Die Platte zeigt gleichm\xE4\xDFige W\xE4rme und sonst nichts.",
      "Es dehnt sich, und es k\xFChlt, seit dreizehn Milliarden Jahren.",
      "Und der Schreiber zeichnet weiter, gleichm\xE4\xDFig, bis das Papier ausgeht.",
      "So bleibt die L\xFCcke im Spektrum stehen, ungedeutet.",
      "Am Morgen liegt die Platte im Bad, und niemand sieht hin.",
      "Und die Kurve l\xE4uft auseinander, wie erwartet.",
      "So k\xFChlt es weiter, um Bruchteile eines Grades im Jahrtausend.",
      "Und die n\xE4chste Nacht ist schon eingetragen, in anderer Handschrift."
    ]
  },
  "erotik": {
    "motifs": [
      "ein Abstand, der kleiner wird",
      "W\xE4rme durch d\xFCnnen Stoff",
      "ein Blick, der zu lange bleibt",
      "der Puls an einem Handgelenk",
      "Atem im Nacken",
      "ein Schulterblatt im Halbdunkel",
      "die Spur einer Ber\xFChrung",
      "Haut im Licht der Stra\xDFenlampe",
      "ein Z\xF6gern vor der T\xFCr",
      "der Schatten zweier Gestalten",
      "ein Abstand, der bei jedem Satz kleiner wird",
      "ein Mantel, der \xFCber einer fremden Lehne h\xE4ngt",
      "ein Fenster, das jemand ge\xF6ffnet hat",
      "eine Treppe, auf der zwei gleichzeitig stehen bleiben",
      "ein Glas, das zweimal gef\xFCllt wurde",
      "ein Zimmer mit einer T\xFCr, die nicht abschlie\xDFt",
      "eine Uhr, die niemand ansieht",
      "ein Name, der leiser gesagt wird als n\xF6tig"
    ],
    "hooks": [
      "eine Hand bleibt eine Sekunde zu lang",
      "jemand nennt einen Namen leiser als n\xF6tig",
      "der Stuhl r\xFCckt n\xE4her",
      "ein Satz bleibt unvollendet",
      "die T\xFCr f\xE4llt hinter zwei Leuten zu",
      "ein Blick geht \xFCber den Rand des Glases",
      "Eine Hand bleibt eine Sekunde zu lang liegen.",
      "Jemand nennt einen Namen leiser, als der Raum verlangt.",
      "Der Stuhl r\xFCckt n\xE4her, ohne dass jemand ihn zieht.",
      "Sie schweigen, und das Schweigen wird eine Antwort.",
      "Er reicht ihr das Glas und l\xE4sst nicht sofort los.",
      "Die anderen gehen, und keiner von beiden steht auf.",
      "Ein Satz bricht ab, weil er zu weit gegangen w\xE4re.",
      "Die T\xFCr bleibt angelehnt, und niemand schlie\xDFt sie.",
      "Sie lacht an einer Stelle, an der nichts komisch war.",
      "Der Mantel bleibt \xFCber der Lehne bis zum Morgen."
    ],
    "props": [
      "ein Glas Wein",
      "ein offenes Fenster",
      "ein Seidenband",
      "einen Schl\xFCssel",
      "einen Mantel \xFCber einer Lehne",
      "eine Kerze",
      "einen Spiegel",
      "einen Brief",
      "ein Glas Wein, zweimal gef\xFCllt",
      "ein Seidenband vom Handgelenk",
      "einen Mantel \xFCber einer fremden Lehne",
      "einen Schl\xFCssel, der auf dem Tisch liegt",
      "eine Uhr, die abgelegt wurde",
      "einen Zettel mit einer Zeit darauf",
      "eine Decke \xFCber zwei Stuhllehnen",
      "ein Buch, das aufgeschlagen liegen bleibt"
    ],
    "turns": [
      "das Schweigen wird zur Antwort",
      "einer geht, der andere bleibt stehen",
      "aus H\xF6flichkeit wird Absicht",
      "die N\xE4he kippt in Scheu",
      "jemand sagt doch das Wort",
      "das Schweigen wird zur Antwort auf eine ungestellte Frage",
      "aus H\xF6flichkeit wird Absicht, in einem einzigen Satz",
      "die Regel wird ausgesprochen und dadurch verhandelbar",
      "sie sagt nein und meint einen anderen Abend",
      "die Ber\xFChrung war zuf\xE4llig und wird es nicht bleiben",
      "der Vorsatz h\xE4lt bis zur T\xFCr",
      "er fragt und macht es dadurch m\xF6glich",
      "die Nacht wird l\xE4nger, ohne dass jemand sie verl\xE4ngert",
      "ein Blick geht zu weit und wird nicht zur\xFCckgenommen",
      "die Freundschaft steht auf und setzt sich anders hin",
      "die Zeit reicht, und keiner sagt es",
      "das Licht wird ausgemacht, aus einem anderen Grund",
      "am Morgen ist die Frage eine andere",
      "ein Name wird zum ersten Mal ohne Nachnamen gesagt",
      "sie stellt eine Frage, die schon eine Entscheidung ist",
      "er zieht den Mantel an und legt ihn wieder ab",
      "das Gespr\xE4ch wechselt das Thema und meint dasselbe",
      "jemand sagt die Wahrheit und tut so, als w\xE4re es ein Scherz",
      "die Musik h\xF6rt auf, und keiner steht auf",
      "die Verabredung f\xFCr morgen ist die Antwort von heute",
      "einer geht, und der andere bleibt stehen"
    ],
    "obstacles": [
      "die Zeit reicht nur bis Mitternacht",
      "niemand macht den ersten Schritt",
      "es gibt zu viele Zuschauer",
      "ein Versprechen bindet anderswo",
      "die Worte kommen nicht",
      "ein Versprechen an einen Dritten steht dazwischen",
      "der letzte Zug geht um halb eins",
      "die Wohnung ist nicht leer",
      "das Wort daf\xFCr fehlt, in dieser Sprache",
      "morgen sehen sich beide bei der Arbeit",
      "der Vorsatz war ausdr\xFCcklich und laut",
      "ein Anruf kommt zur falschen Minute",
      "die T\xFCr geht auf, und jemand sucht seinen Mantel",
      "die N\xFCchternheit kommt vor der Entscheidung",
      "der andere ist zu h\xF6flich f\xFCr eine Antwort",
      "es m\xFCsste jemand fragen, und keiner tut es",
      "die Nachbarn h\xF6ren jedes Wort durch die Wand",
      "das Taxi steht schon unten und wartet",
      "einer von beiden ist morgen fr\xFCh weg",
      "die Wohnung geh\xF6rt jemandem, der zur\xFCckkommt",
      "es gibt keinen Grund, noch l\xE4nger zu bleiben",
      "ein Kollege sitzt zwei Tische weiter",
      "die Erkl\xE4rung w\xFCrde alles kaputtmachen"
    ],
    "stakes": [
      "Der Einsatz ist ein Abend, der nicht wiederkommt.",
      "Der Einsatz ist eine Freundschaft.",
      "Der Einsatz ist der eigene Vorsatz.",
      "Der Einsatz ist die Wahrheit \xFCber ein Gef\xFChl.",
      "Der Einsatz ist ein einziges Ja.",
      "Der Einsatz ist eine Freundschaft von zw\xF6lf Jahren.",
      "Der Einsatz ist der eigene Vorsatz, laut ausgesprochen.",
      "Der Einsatz ist die Frage, wer zuerst etwas sagt.",
      "Der Einsatz ist der Morgen danach, in demselben Haus."
    ],
    "endings": [
      "Die T\xFCr bleibt angelehnt.",
      "Am Morgen liegt der Mantel noch \xFCber der Lehne.",
      "Sie gehen in verschiedene Richtungen, langsam.",
      "Das Fenster steht offen, das Zimmer ist k\xFChl.",
      "Nichts geschieht, und alles ist gesagt.",
      "Und das Glas steht halb voll auf dem Tisch.",
      "So bleibt die Frage stehen, bis zum n\xE4chsten Mal.",
      "Und niemand hat etwas gesagt, den ganzen Abend.",
      "Der letzte Zug f\xE4hrt, und beide bleiben stehen.",
      "Und das Fenster bleibt offen bis zum Morgen.",
      "So endet der Abend, und es ist etwas geschehen.",
      "Und am Montag gr\xFC\xDFen sich beide wie immer.",
      "Und der Zettel mit der Zeit bleibt auf dem Tisch.",
      "So steht die Uhr abgelegt neben dem Glas.",
      "Am Ende geht das Licht aus, und beide sind noch da.",
      "Und die Treppe h\xF6rt auf, und niemand geht weiter.",
      "So bleibt der Abstand, um den es die ganze Zeit ging."
    ],
    "verwandlungen": [
      "Mantel\u2192Schleier",
      "Glas\u2192Auge",
      "T\xFCr\u2192Wand",
      "Nacht\u2192Decke",
      "Uhr\u2192Waage"
    ]
  },
  "hunger": {
    "motifs": [
      "ein leerer Teller im Licht",
      "die Kornkammer ohne Schatten",
      "Brot hinter dickem Glas",
      "ein Magen, der die Stunden z\xE4hlt",
      "der Geruch aus fremden Fenstern",
      "H\xE4nde, die nach nichts greifen",
      "ein L\xF6ffel ohne Suppe",
      "die Stra\xDFe riecht nach Backstube",
      "ein Kind z\xE4hlt Krumen",
      "Winter \xFCber leeren Feldern",
      "eine Waage, die zu genau ist",
      "eine Schlange vor einer verschlossenen T\xFCr",
      "ein Feld mit zu kurzen Halmen",
      "Brotmarken in einem Umschlag",
      "eine Suppe, in der man den Boden sieht",
      "ein Kind, das nicht mehr fragt",
      "der Rest im Sack, ausgesch\xFCttelt",
      "ein Herd ohne Holz",
      "Vorratsgl\xE4ser, alle sauber",
      "ein Preis, der mit Kreide geschrieben ist",
      "eine Speisekammer mit offenen T\xFCren",
      "der Winter, der noch nicht angefangen hat",
      "ein geteilter Apfel mit vier Teilen",
      "eine Hand, die die Krumen zusammenschiebt",
      "ein Kessel und eine Kelle",
      "ein Tisch, der zu gro\xDF geworden ist"
    ],
    "hooks": [
      "die B\xE4ckerei \xF6ffnet heute nicht",
      "jemand teilt die letzte Scheibe zu genau",
      "ein Sack Mehl fehlt im Lager",
      "der Preis steigt \xFCber Nacht",
      "ein Teller steht zu viel auf dem Tisch",
      "der Preis f\xFCr Brot steht seit gestern nicht mehr an der Tafel",
      "die Kelle geht heute weniger tief",
      "ein Sack Kartoffeln fehlt und niemand fragt laut",
      "die Ernte kommt drei Wochen zu sp\xE4t",
      "am Mittwoch gibt es keine Marken mehr",
      "jemand hat den Vorrat gez\xE4hlt",
      "der Nachbar isst nicht mehr mit",
      "der Krug ist voll und die Sch\xFCssel leer",
      "die Kinder werden zuerst geschickt",
      "im Lager ist Platz, wo etwas stand",
      "ein Brief k\xFCndigt eine Lieferung an, die nicht kommt"
    ],
    "props": [
      "einen L\xF6ffel",
      "einen Krug Wasser",
      "einen Kanten Brot",
      "eine leere Sch\xFCssel",
      "einen Sack Mehl",
      "ein Messer",
      "einen Marktkorb",
      "eine Waage",
      "einen Brotlaib",
      "eine Waage mit Gewichten",
      "einen Blechnapf",
      "ein B\xFCndel Brotmarken",
      "eine Kelle",
      "einen Kessel",
      "ein Vorratsglas",
      "eine Schnur um einen Sack",
      "einen Sack mit einem Loch",
      "eine Liste mit Namen",
      "ein Messer f\xFCr d\xFCnne Scheiben",
      "eine Suppensch\xFCssel f\xFCr vier",
      "einen Zettel mit dem Preis",
      "eine Decke f\xFCr die Nacht"
    ],
    "turns": [
      "das Brot reicht f\xFCr einen weniger",
      "jemand stiehlt und wird gesehen",
      "der Nachbar teilt, ohne zu fragen",
      "die Vorr\xE4te finden sich, aber verdorben",
      "der Hunger geht, die Angst bleibt",
      "der Vorrat reicht bis Freitag, nicht bis Sonntag",
      "jemand bringt etwas und nennt keinen Namen",
      "die Waage wird nachgepr\xFCft",
      "der Preis f\xE4llt am selben Tag, an dem das Geld ausgeht",
      "eine Lieferung kommt und ist verdorben",
      "der Nachbar \xF6ffnet die Kammer",
      "das Feld tr\xE4gt, aber zu sp\xE4t",
      "ein Kind bringt etwas mit und l\xFCgt",
      "die Liste bekommt einen Namen mehr",
      "geteilt wird, bevor gez\xE4hlt wird",
      "der Hunger h\xF6rt auf, das ist das Schlimme",
      "einer isst nicht und sagt, er habe schon",
      "ein Sack steht am Morgen vor der T\xFCr",
      "die Marken gelten weiter, aber es gibt nichts daf\xFCr",
      "ein Fremder bringt Mehl und will kein Geld daf\xFCr",
      "die Ernte kommt, und die Preise fallen zu sp\xE4t",
      "das Saatgut wird gegessen, und alle wissen es",
      "der Nachbar z\xE4hlt mit und sagt nichts dazu"
    ],
    "obstacles": [
      "die Felder tragen nichts",
      "der Markt bleibt geschlossen",
      "das Geld reicht bis Dienstag",
      "niemand \xF6ffnet die T\xFCr",
      "der Weg zur Stadt ist zu weit",
      "der Boden ist zu hart f\xFCr die Saat",
      "die Marken gelten nur bis Dienstag",
      "der Weg zum Markt ist zwei Tage weit",
      "die M\xFChle mahlt nicht ohne Bezahlung",
      "der Frost kommt vor der Ernte",
      "die Kammer ist verschlossen und der Schl\xFCssel weg",
      "niemand borgt zweimal",
      "die Stra\xDFe ist gesperrt",
      "das Vieh ist zuerst verkauft",
      "der Winter dauert l\xE4nger als gerechnet",
      "das Brot ist da, aber nicht zu bezahlen",
      "die Stadt gibt nichts an Fremde",
      "die M\xFChle mahlt nur gegen einen Teil des Mehls",
      "der Wagen kommt nicht durch, der Weg ist aufgeweicht",
      "die Ausgabe ist bis Donnerstag ausgesetzt",
      "die Kammer ist voll und geh\xF6rt jemand anderem",
      "das Vieh frisst, was die Menschen essen k\xF6nnten",
      "die Suppe reicht, wenn nicht alle kommen"
    ],
    "stakes": [
      "Der Einsatz ist ein Winter.",
      "Der Einsatz ist die Kraft f\xFCr morgen.",
      "Der Einsatz ist der Stolz beim Bitten.",
      "Der Einsatz ist ein Kind am Tisch.",
      "Der Einsatz ist die letzte Scheibe.",
      "Der Einsatz ist ein Sack Mehl bis zur Ernte.",
      "Der Einsatz ist die Reihenfolge am Tisch.",
      "Der Einsatz ist die Frage, wer verzichtet.",
      "Der Einsatz ist ein Name auf der Liste.",
      "Der Einsatz ist das Saatgut: essen oder s\xE4en.",
      "Der Einsatz ist der Nachbar, der zusieht.",
      "Der Einsatz ist ein Fr\xFChling, den man erreichen muss."
    ],
    "endings": [
      "Der Teller bleibt leer, das Licht wird kalt.",
      "Am Morgen ist der Krug noch voll.",
      "Sie teilen, und es reicht nicht.",
      "Drau\xDFen backt jemand, hier z\xE4hlt jemand.",
      "Der Hunger legt sich schlafen und wacht fr\xFCher auf.",
      "Und die Kelle geht morgen wieder weniger tief.",
      "So bleibt der Sack stehen, halb.",
      "Am Ende ist geteilt und niemand satt.",
      "Und das Saatgut liegt noch im Schuppen.",
      "So z\xE4hlt jemand weiter, leise.",
      "Und im Fr\xFChjahr w\xE4chst wieder etwas, f\xFCr die, die da sind.",
      "Der Tisch bleibt gedeckt, aus Gewohnheit.",
      "Und niemand spricht beim Essen.",
      "Und die Waage steht wieder auf demselben Strich.",
      "So bleibt ein Rest im Sack, f\xFCr morgen.",
      "Am Ende geht jemand ohne etwas nach Hause.",
      "Und der Kessel wird ausgekratzt, bis er blank ist.",
      "So beginnt der n\xE4chste Tag mit derselben Frage."
    ],
    "verwandlungen": [
      "Brot\u2192Papier",
      "Kelle\u2192Schaufel",
      "Sack\u2192Beutel",
      "Waage\u2192Uhr",
      "Winter\u2192Schlaf",
      "Feld\u2192Tuch",
      "Tisch\u2192Altar",
      "Suppe\u2192Br\xFChe"
    ]
  },
  "romantik": {
    "motifs": [
      "die blaue Blume am Wegrand",
      "Mondlicht auf altem Stein",
      "eine Ruine im Nebel",
      "Sehnsucht ohne Gegenstand",
      "ein Traum, der weitertr\xE4umt",
      "die Nacht als offenes Tor",
      "eine Harfe im leeren Saal",
      "der Wald als Kirche",
      "Sterne \xFCber schlafenden D\xF6rfern",
      "ein Herz, das die Ferne w\xE4hlt",
      "ein Buch, in dem eine Seite fehlt",
      "eine Ruine, in der jemand Feuer gemacht hat",
      "ein Fenster, hinter dem eine Kerze steht",
      "eine Landschaft, die sich im Traum wiederholt",
      "ein Waldweg, der bei Mondlicht heller ist",
      "ein Bergwerk, in dem jemand singt",
      "ein Spiegel in einem Zimmer ohne M\xF6bel",
      "ein Kind, das eine Sprache spricht, die es nicht gelernt hat"
    ],
    "hooks": [
      "die Blume bl\xFCht am falschen Ort",
      "ein Traum wiederholt ein fremdes Zimmer",
      "die Ruine tr\xE4gt ein frisches Zeichen",
      "jemand singt, was niemand kennt",
      "der Mond steht zweimal im Wasser",
      "Der Traum wiederholt ein Zimmer, das es nicht gibt.",
      "Die blaue Blume steht am falschen Ort und bl\xFCht.",
      "In der Ruine liegt Asche, die noch warm ist.",
      "Ein Lied kommt aus dem Berg und hat keinen Text.",
      "Der Spiegel zeigt das Zimmer und niemanden darin.",
      "Ein Fremder kennt die Geschichte besser als der Erz\xE4hler.",
      "Das Buch schl\xE4gt sich bei derselben Seite auf.",
      "Ein Brief kommt an, den er im Traum gelesen hat.",
      "Der Weg durch den Wald ist k\xFCrzer als gestern.",
      "Jemand singt ein Lied, das eine Zukunft nennt."
    ],
    "props": [
      "eine getrocknete Blume",
      "ein Medaillon",
      "eine Harfe",
      "ein Notenblatt",
      "einen Spiegel",
      "einen Schl\xFCssel",
      "eine Kerze",
      "ein Buch",
      "eine getrocknete blaue Blume",
      "ein Buch mit einer fehlenden Seite",
      "eine Laterne f\xFCr den Waldweg",
      "einen Ring aus dem Bergwerk",
      "ein Blatt mit fremder Handschrift",
      "eine Kerze f\xFCr das Fenster",
      "eine Harfe mit gerissener Saite"
    ],
    "turns": [
      "der Traum tritt aus dem Schlaf heraus",
      "die Ferne erweist sich als N\xE4he",
      "das Lied kennt die Zukunft",
      "die Ruine erinnert sich an ihren Bau",
      "der Weg f\xFChrt in die eigene Kindheit",
      "der Traum tritt aus dem Schlaf heraus und bleibt",
      "die Ferne erweist sich als das Haus nebenan",
      "das Lied kennt die Zukunft und singt sie beil\xE4ufig",
      "die Blume verliert im Licht ihre Farbe und nicht ihren Sinn",
      "der Erz\xE4hler wird zur Figur der eigenen Geschichte",
      "ein M\xE4rchen erkl\xE4rt, was keine Auskunft erkl\xE4rt",
      "der Berg gibt etwas zur\xFCck, das lange fehlte",
      "die Kindheit kommt wieder, aber als Fremde",
      "die Ruine tr\xE4gt ein Zeichen, das frisch ist",
      "der Spiegel zeigt eine Zeit und nicht einen Ort",
      "das Buch endet mitten im Satz und ist vollst\xE4ndig",
      "die Nacht erkl\xE4rt, was der Tag verschwiegen hat",
      "ein Freund erkennt ihn und nennt ihn anders",
      "eine alte Frau nennt den Namen der blauen Blume",
      "die Sehnsucht findet ihr Ziel und h\xF6rt nicht auf",
      "ein Bild an der Wand zeigt eine Landschaft, die er kennt",
      "die Nacht bringt eine Antwort, die der Tag nicht gab",
      "der Fremde geht, und der Weg ist pl\xF6tzlich beschrieben",
      "das Bergwerk gibt ein St\xFCck Erz mit einer Zeichnung"
    ],
    "obstacles": [
      "das Erwachen kommt zu fr\xFCh",
      "die Blume verliert im Licht ihre Farbe",
      "niemand h\xF6rt den Ton",
      "die Ferne bleibt Ferne",
      "der Traum l\xE4sst sich nicht erz\xE4hlen",
      "das Erwachen kommt zu fr\xFCh, an jedem Morgen",
      "niemand sonst h\xF6rt den Ton aus dem Berg",
      "der Weg durch den Wald ist bei Tag nicht zu finden",
      "die fehlende Seite l\xE4sst sich nirgends beschaffen",
      "die Ruine geh\xF6rt einem Gut, das keinen Besuch duldet",
      "das Lied l\xE4sst sich nicht aufschreiben",
      "der Winter schlie\xDFt den Pass bis zum Fr\xFChjahr",
      "die Familie erwartet einen Beruf und keine Reise",
      "der Traum bricht immer an derselben Stelle ab",
      "die Harfe hat eine Saite zu wenig",
      "niemand glaubt einem, der von einer Blume spricht",
      "die Kerze im Fenster brennt f\xFCr jemand anderen",
      "die Kutsche f\xE4hrt nur bis zum letzten Dorf",
      "das Bergwerk ist seit dem Fr\xFChjahr geschlossen",
      "der Wirt kennt die Geschichte und erz\xE4hlt sie falsch",
      "die Locke im Medaillon geh\xF6rt jemand anderem",
      "niemand im Ort erinnert sich an das Haus",
      "der Mond steht in diesem Monat zu tief",
      "der Erz\xE4hler bricht ab, wo es wichtig wird"
    ],
    "stakes": [
      "Der Einsatz ist ein Traum, der nicht zur\xFCckkommt.",
      "Der Einsatz ist die Unschuld eines Sommers.",
      "Der Einsatz ist ein Ton, den niemand sonst h\xF6rt.",
      "Der Einsatz ist die Ferne selbst.",
      "Der Einsatz ist ein Wort f\xFCr das Unsagbare.",
      "Der Einsatz ist eine Seite, die aus dem Buch fehlt.",
      "Der Einsatz ist die Ferne, wenn sie erreicht ist.",
      "Der Einsatz ist ein Lied, das niemand aufschreiben kann."
    ],
    "endings": [
      "Die Blume bleibt blau, der Morgen bleibt grau.",
      "Er erwacht, und die Ferne ist wieder weit.",
      "Das Lied endet, der Saal h\xF6rt weiter zu.",
      "\xDCber der Ruine steht der Mond und wartet.",
      "Alles bleibt offen wie ein Tor bei Nacht.",
      "Und in der Ruine k\xFChlt die Asche aus.",
      "So bleibt die Seite fehlen, und das Buch stimmt.",
      "Und im Fenster brennt die Kerze bis zum Morgen.",
      "Der Berg singt weiter, f\xFCr niemanden.",
      "Und der Waldweg ist am Tag nicht mehr zu finden.",
      "So schlie\xDFt sich der Traum \xFCber dem Zimmer.",
      "Und niemand fragt, was er dort gesucht hat.",
      "Am Ende tr\xE4gt er die Blume im Buch nach Hause.",
      "Und der Fremde ist am n\xE4chsten Morgen weitergegangen.",
      "Und im Bergwerk wird es still, nach dem letzten Ton.",
      "So bleibt die Landschaft im Traum, wo sie hingeh\xF6rt.",
      "So endet das M\xE4rchen, und die Geschichte f\xE4ngt an."
    ],
    "verwandlungen": [
      "Blume\u2192Narbe",
      "Traum\u2192Bericht",
      "Wald\u2192Traum",
      "Lied\u2192Zeichen",
      "Ferne\u2192N\xE4he"
    ]
  },
  "hugo": {
    "motifs": [
      "eine Barrikade, die aus M\xF6beln gebaut ist",
      "ein Netz von Kan\xE4len, das unter der Stadt liegt",
      "eine Glocke, die \xFCber allen D\xE4chern h\xE4ngt",
      "ein Kerzenleuchter, der aus Silber ist",
      "ein Kind, das auf dem Pflaster sitzt",
      "ein Gerichtssaal, in dem kein Fenster ist",
      "ein Laib Brot neben einer Kette",
      "eine Kathedrale, die im Regen steht",
      "eine Nummer, die einen Namen ersetzt",
      "ein Aufruhr, der die engen Gassen f\xFCllt",
      "eine Gasse, in der das Wasser nie abl\xE4uft",
      "ein Kirchturm, von dem man die ganze Stadt z\xE4hlt",
      "Pflastersteine, die einmal ein Weg waren",
      "ein Zuchthauspapier im Futter eines Mantels",
      "Kerzen in einer Kirche, gestiftet von niemandem",
      "die Kan\xE4le unter der Stadt, warm im Winter",
      "ein Kind, das die Namen aller Stra\xDFen kennt",
      "ein Verzeichnis, in dem Menschen Nummern sind",
      "die Fahne \xFCber einer Barrikade aus T\xFCren",
      "ein Brot, das durch drei H\xE4nde geht"
    ],
    "hooks": [
      "ein Bischof z\xE4hlt das Silber nicht nach",
      "ein Kommissar erkennt ein Gesicht wieder",
      "auf dem Pflaster liegt eine Fahne",
      "das Kind singt gegen die Gewehre",
      "ein Name steht in zwei Akten",
      "ein Mann bittet um Nachtlager und nennt keinen Namen",
      "das Silber ist weg und der Bischof sagt nichts",
      "ein Gendarm bleibt vor einer T\xFCr stehen und geht weiter",
      "die Nummer im Papier passt zu keinem Gesicht mehr",
      "auf dem Markt spricht jemand von der Nacht davor",
      "ein Kind schl\xE4ft in einem Elefanten aus Gips",
      "die Glocke schl\xE4gt, und niemand hat gezogen",
      "ein Brief nennt eine Adresse in einem Viertel ohne Namen",
      "vor dem Tor steht ein Karren, der nicht weiterdarf",
      "der Kommissar legt eine Akte weg und nimmt sie wieder",
      "jemand zahlt eine Miete, die l\xE4ngst verfallen war",
      "in der Kathedrale singt jemand zur falschen Stunde"
    ],
    "props": [
      "einen Leuchter",
      "eine Akte",
      "einen Brotlaib",
      "eine Kette",
      "eine Fahne",
      "ein Gewehr",
      "eine Glocke",
      "einen Passierschein",
      "zwei silberne Leuchter",
      "ein Papier mit einer Nummer statt eines Namens",
      "einen Mantel mit doppeltem Futter",
      "eine Laterne f\xFCr die Kan\xE4le",
      "ein B\xFCndel Briefe unter einem Stein",
      "einen Schl\xFCssel zu einem Gartentor",
      "eine Puppe aus einem Schaufenster",
      "ein Gewehr ohne Schloss",
      "einen Zettel mit einer Adresse",
      "ein St\xFCck Brot in einer Kindertasche"
    ],
    "turns": [
      "der Verfolger l\xE4sst den Verfolgten laufen",
      "die Barrikade h\xE4lt l\xE4nger als erwartet",
      "aus Gnade wird ein neues Leben",
      "das Gesetz siegt und verliert dabei",
      "ein Kind f\xE4llt, und die Stra\xDFe erhebt sich",
      "die Gnade erschreckt ihn mehr als jedes Urteil",
      "der Verfolger versteht, dass er im Recht ist und trotzdem falsch",
      "ein B\xFCrger schlie\xDFt die T\xFCr auf, statt sie zu verriegeln",
      "der Name wird gerettet, indem er verloren geht",
      "die Barrikade h\xE4lt, bis das Pulver ausgeht",
      "der Junge geht zwischen die Linien und singt dabei",
      "ein Papier verbrennt, und ein Mensch entsteht",
      "der Kommissar l\xE4sst ihn laufen und sich selbst nicht",
      "aus dem Kanal kommt einer heraus, den man begraben hat",
      "das Gesetz bekommt recht, und keiner will es gewesen sein",
      "ein Sterbender nennt eine Schuld, die keine war",
      "die Stadt schlie\xDFt sich \xFCber der Nacht wie Wasser",
      "eine Aussage rettet den Falschen und trifft den Richtigen",
      "was als Diebstahl begann, endet als Erbe"
    ],
    "obstacles": [
      "das Gesetz kennt keine Gnade",
      "die Papiere tragen den alten Namen",
      "die Nacht geh\xF6rt den Wachen",
      "niemand \xF6ffnet die Tore",
      "die Kan\xE4le sind \xFCberflutet",
      "das Papier gilt mehr als der Mensch, der es tr\xE4gt",
      "kein Wirt nimmt einen mit gelbem Ausweis",
      "die Tore schlie\xDFen bei Einbruch der Dunkelheit",
      "der Kanal f\xFChrt Wasser, wenn es oben regnet",
      "die Wache kennt jedes Gesicht im Viertel",
      "die Miete ist f\xE4llig und die Arbeit nicht bezahlt",
      "ein Zeuge widerruft, weil er sonst nichts hat",
      "niemand darf zweimal denselben Namen f\xFChren",
      "die Barrikade hat kein Wasser und keinen Ausgang",
      "der Winter kommt, und Kohle gibt es nur gegen Papiere",
      "der Weg \xFCber den Fluss ist bewacht",
      "ein Kind kann nicht aussagen, sagt das Gesetz",
      "die Kirche gibt Brot und stellt Fragen",
      "wer hilft, macht sich mitschuldig"
    ],
    "stakes": [
      "Der Einsatz ist ein Name ohne Nummer.",
      "Der Einsatz ist das Leben eines Kindes.",
      "Der Einsatz ist die Gerechtigkeit selbst.",
      "Der Einsatz ist eine Stadt f\xFCr eine Nacht.",
      "Der Einsatz ist die Seele eines Verfolgers.",
      "Der Einsatz ist ein Name, den man behalten darf.",
      "Der Einsatz ist eine Nacht hinter einer Barrikade aus T\xFCren.",
      "Der Einsatz ist ein Kind, f\xFCr das niemand zust\xE4ndig ist.",
      "Der Einsatz ist ein Versprechen an eine Sterbende.",
      "Der Einsatz ist die Frage, ob das Gesetz auch recht hat.",
      "Der Einsatz ist ein Paar Leuchter, das alles entscheidet."
    ],
    "endings": [
      "Die Barrikade f\xE4llt, die Glocke bleibt.",
      "Am Morgen r\xE4umt man das Pflaster.",
      "Er geht frei, und niemand versteht warum.",
      "Die Kathedrale steht im Regen wie immer.",
      "Unten in den Kan\xE4len l\xE4uft das Wasser weiter.",
      "Und am Morgen wird das Pflaster wieder gelegt.",
      "So bleibt das Papier im Futter, ungelesen.",
      "Am Ende steht die Kathedrale im Regen, wie an jedem Tag.",
      "Und die Leuchter stehen auf einem anderen Tisch.",
      "So geht die Stadt \xFCber die Nacht hinweg.",
      "Und niemand fragt, wer die Kerzen gestiftet hat.",
      "Der Kanal f\xFChrt weiter, unter allem hindurch.",
      "Und die Glocke schl\xE4gt f\xFCr einen, den sie nicht kannte.",
      "So endet der Prozess, und das Urteil kommt sp\xE4ter.",
      "Und ein Kind kennt die Stra\xDFen besser als jeder Plan."
    ],
    "verwandlungen": [
      "Barrikade\u2192Mauer",
      "Leuchter\u2192Zeuge",
      "Gesetz\u2192Gitter",
      "Kanal\u2192Weg",
      "Papier\u2192Gesicht",
      "Glocke\u2192Stimme",
      "Brot\u2192Pfand",
      "Fahne\u2192Wunde"
    ]
  },
  "hafen": {
    "motifs": [
      "Kr\xE4ne, die im Morgennebel stehen",
      "ein Poller mit den Kerben vieler Jahre",
      "\xD6l, das auf schwarzem Wasser steht",
      "Container, die in falscher Ordnung stehen",
      "ein Schiffsbauch, voll von Fremden",
      "M\xF6wen, die \xFCber leeren Kais kreisen",
      "das Tuten eines Nebelhorns in der Nacht",
      "Seile, jedes so dick wie ein Arm",
      "eine Uhr am Kaischuppen, die nachgeht",
      "Salz, das auf jeder Fl\xE4che liegt",
      "ein Kran, der \xFCber Nacht stehen blieb",
      "Rost, der an der Ankerkette bl\xFCht",
      "ein F\xE4hrplan mit zweimal \xFCbermalten Zeiten",
      "Netze, die seit Jahren niemand mehr flickt",
      "ein Leuchtfeuer, das im Nebel steht",
      "Kreidezeichen auf einem Frachtbrief",
      "eine Boje, die sich losgerissen hat",
      "Salz, das die Fensterscheiben blind macht",
      "ein Schuppen, dessen T\xFCr offen steht",
      "M\xF6wen \xFCber einem Kai, auf dem nichts steht",
      "ein Schiffsname, der unter neuer Farbe durchkommt",
      "die Uhr am Zollhaus, die immer stimmt",
      "ein Steg, dem eine Planke fehlt",
      "\xD6lspuren, die in Regenbogenfarben laufen",
      "ein Container mit einer Beschriftung in fremder Schrift",
      "eine Laterne, die im Wind schl\xE4gt",
      "Kisten, auf denen keine Adresse steht",
      "der Abdruck eines Taus im Holz"
    ],
    "hooks": [
      "ein Container steht ohne Papiere da",
      "das Schiff l\xE4uft ohne Namen ein",
      "eine Leine l\xF6st sich von selbst",
      "jemand wartet seit Tagen am Kai",
      "die Ladeliste z\xE4hlt einen Posten zu viel",
      "Das Schiff liegt einen Tag zu lange am Kai.",
      "Ein Name auf der Ladeliste fehlt heute.",
      "Die Flut kommt eine Stunde zu fr\xFCh.",
      "Jemand fragt nach einem Schiff, das nicht mehr f\xE4hrt.",
      "Die Papiere tragen den Stempel eines anderen Hafens.",
      "Ein Licht brennt im Schuppen, der leer sein sollte.",
      "Der Kran hebt eine Kiste, die niemand angemeldet hat.",
      "Die Leine ist geschnitten, nicht gerissen.",
      "Zwei Frachtbriefe nennen dieselbe Nummer.",
      "Am Kai wartet jemand ohne Gep\xE4ck.",
      "Das Wasser steht heute anders als sonst.",
      "Ein Boot fehlt und niemand meldet es."
    ],
    "props": [
      "ein Tau, dick wie ein Arm",
      "einen Kompass mit beschlagenem Glas",
      "eine Laterne mit ru\xDFendem Glas",
      "einen Seesack mit einem fremden Namen",
      "einen Frachtbrief in drei Sprachen",
      "einen Anker mit verrosteter Kette",
      "eine Trillerpfeife an einer Schnur",
      "eine Seekarte mit weichen Falzen",
      "eine Signalflagge, ausgeblichen bis ins Wei\xDFe",
      "ein Fernrohr mit einem Sprung im Glas",
      "einen Haken f\xFCr die schweren Kisten",
      "eine Kette, in der ein Glied fehlt",
      "ein Logbuch mit drei leeren Tagen",
      "einen \xD6lschl\xFCssel mit schwarzem Griff",
      "ein Netz mit geflickten Maschen",
      "einen Schiffszwieback aus der letzten Fahrt",
      "eine \xD6llampe f\xFCr die Nachtwache",
      "einen Peilstock mit eingekerbten Marken",
      "ein St\xFCck Segeltuch, steif von Salz"
    ],
    "turns": [
      "das Schiff legt fr\xFCher ab als angek\xFCndigt",
      "der Wartende steigt doch ein",
      "die Ladung geh\xF6rt jemand anderem",
      "der Kapit\xE4n kennt den Namen im Brief",
      "der Nebel hebt sich und zeigt nichts",
      "die Ladung wird zweimal verzollt",
      "der Name auf dem Bug ist \xFCbermalt",
      "die F\xE4hre nimmt keine Fracht mehr",
      "der Kai geh\xF6rt seit gestern jemand anderem",
      "ein Passagier steht auf keiner Liste",
      "das Schiff kehrt am selben Tag zur\xFCck",
      "der Zoll findet, was niemand suchte",
      "die Flut legt frei, was lag",
      "der Kapit\xE4n geht nicht von Bord",
      "die Papiere stimmen und das Schiff nicht",
      "ein Frachtbrief taucht doppelt auf",
      "die Ladung ist da, und das Papier geh\xF6rt zu einer anderen",
      "der Kapit\xE4n meldet sich krank, bevor der Zoll kommt",
      "die F\xE4hre nimmt einen Passagier mehr, als sie darf"
    ],
    "obstacles": [
      "die Papiere fehlen",
      "die Flut kommt zu sp\xE4t",
      "niemand spricht dieselbe Sprache",
      "der Zoll schlie\xDFt den Kai",
      "das Tau h\xE4lt nicht",
      "der Nebel legt den Betrieb still",
      "der Kran hat keinen F\xFChrer",
      "die Schleuse \xF6ffnet erst am Morgen",
      "der Liegeplatz ist vergeben",
      "niemand unterschreibt die \xDCbernahme",
      "das Wetter dreht",
      "die Ladung passt nicht durch die Luke",
      "der Zollbeamte kennt den Stempel nicht",
      "die Leine ist zu kurz",
      "das Log fehlt f\xFCr drei Tage",
      "am Kai gibt es keinen Strom",
      "der Kran f\xE4llt aus, und die Tide l\xE4uft weiter ab",
      "die Papiere sind in einer Sprache, die hier niemand liest",
      "der Liegeplatz wird gebraucht, bevor die Ladung gel\xF6scht ist"
    ],
    "stakes": [
      "Der Einsatz ist eine \xDCberfahrt, f\xFCr die das Geld reicht.",
      "Der Einsatz ist ein Name auf der Liste.",
      "Der Einsatz ist die letzte Fracht vor dem Eis.",
      "Der Einsatz ist ein Wiedersehen nach elf Jahren.",
      "Der Einsatz ist der Weg zur\xFCck, den keiner bezahlt.",
      "Der Einsatz ist eine Ladung, die verderben kann.",
      "Der Einsatz ist ein Liegeplatz \xFCber den Winter.",
      "Der Einsatz ist die Tide: Sie wartet nicht.",
      "Der Einsatz ist ein Papier mit einem Stempel.",
      "Der Einsatz ist die Heuer f\xFCr den Winter.",
      "Der Einsatz ist ein Hafen, der zumacht.",
      "Der Einsatz ist eine Nacht ohne Nebel."
    ],
    "endings": [
      "Das Schiff l\xE4uft aus, der Kai bleibt leer.",
      "Am Morgen liegt nur noch \xD6l auf dem Wasser.",
      "Sie wartet weiter, die Uhr am Schuppen geht falsch.",
      "Die M\xF6wen bleiben, alles andere f\xE4hrt.",
      "Das Tuten kommt zur\xFCck und findet niemanden.",
      "Der Kran senkt den Haken, und es wird still.",
      "Und am Morgen liegt der Kai unter Reif.",
      "So l\xE4uft die Tide ab und nimmt es mit.",
      "Und im Schuppen bleibt das Licht an.",
      "Damit ist die Ladung \xFCbergeben.",
      "Und die F\xE4hre legt ohne sie ab.",
      "So bleibt nur das Wasser, das gegen die Steine schl\xE4gt.",
      "Und der Frachtbrief wandert in einen anderen Ordner.",
      "So bleibt die Kiste stehen, bis jemand sie holt.",
      "Am Ende l\xE4uft die Tide ab, mit uns oder ohne uns."
    ]
  },
  "alltag": {
    "motifs": [
      "ein K\xFChlschrank, der nachts brummt und sonst nie auff\xE4llt",
      "die immer gleiche Bushaltestelle, morgens kurz nach sieben",
      "unge\xF6ffnete Post auf dem K\xFCchentisch",
      "ein Schl\xFCssel, der im falschen Fach liegt",
      "W\xE4sche, die seit Donnerstag auf dem Balkon h\xE4ngt",
      "das Licht im Treppenhaus, das immer zu fr\xFCh ausgeht",
      "eine Kaffeetasse mit einem Rand vom Vortag",
      "der Wecker, der vor dem Wecker klingelt",
      "ein Einkaufszettel, der nicht k\xFCrzer wird",
      "ein Fernseher, der ohne Ton l\xE4uft",
      "W\xE4sche, die in der Wohnung nicht trocknet",
      "ein Aufzug mit einem Zettel an der T\xFCr",
      "Rechnungen in zwei Stapeln, bezahlt und nicht",
      "die Uhr \xFCber der Sp\xFCle, die drei Minuten vorgeht",
      "ein Fahrradschloss am Gel\xE4nder, ohne Fahrrad",
      "der Automat, der nur M\xFCnzen nimmt",
      "Werbung, die den Briefkasten allein f\xFCllt",
      "ein Blumentopf im Treppenhaus, den niemand gie\xDFt",
      "die Ampel, die zu kurz gr\xFCn ist",
      "eine T\xFCte, die auf halbem Weg rei\xDFt",
      "der Kalender an der K\xFChlschrankt\xFCr, noch im letzten Monat",
      "ein Anrufbeantworter mit einer Nachricht von gestern",
      "die Kasse mit dem l\xE4ngsten Band",
      "ein fremder Regenschirm im Schirmst\xE4nder",
      "der Nachbarshund, der hinter der T\xFCr wartet",
      "Kaffeeflecken auf einem Antrag, der heute weg muss",
      "eine Gl\xFChbirne, die seit Wochen flackert",
      "der Sperrm\xFCll vor dem Haus, seit Freitag"
    ],
    "hooks": [
      "der Bus kommt heute nicht",
      "ein Umschlag ohne Absender liegt da",
      "der Nachbar gr\xFC\xDFt zum ersten Mal",
      "der Aufzug h\xE4lt im falschen Stock",
      "eine Zahl auf der Rechnung stimmt nicht",
      "Der Aufzug bleibt zwischen zwei Stockwerken stehen.",
      "Ein Paket kommt, das niemand bestellt hat.",
      "Die Heizung wird warm, obwohl sie aus ist.",
      "Der Nachbar zieht aus, ohne dass jemand es merkte.",
      "Die Rechnung ist zwei Wochen alt und heute f\xE4llig.",
      "Ein Kind fragt etwas, das niemand beantwortet.",
      "Das Radio spielt ein Lied von damals.",
      "Der Schl\xFCssel steckt von innen.",
      "Die Bank hat schon geschlossen.",
      "Der Zug f\xE4hrt heute von einem anderen Gleis.",
      "Jemand hat den M\xFCll schon runtergebracht."
    ],
    "props": [
      "einen Schl\xFCsselbund mit einem Schl\xFCssel zu viel",
      "eine Kaffeetasse mit einem braunen Rand",
      "einen Einkaufszettel auf der R\xFCckseite eines Umschlags",
      "eine Fernbedienung mit abgegriffenen Tasten",
      "einen Regenschirm mit einer gebrochenen Speiche",
      "ein Handy mit zw\xF6lf Prozent Akku",
      "einen Kalender, in dem nur Termine stehen",
      "einen Blumentopf ohne Untersetzer",
      "eine Thermoskanne, die nicht mehr dicht h\xE4lt",
      "eine Zeitung von vorgestern",
      "ein Feuerzeug, das jemand anderem geh\xF6rt",
      "eine Brotdose mit einem Riss im Deckel",
      "einen Bonbon aus der Manteltasche",
      "ein Handtuch, das nie ganz trocknet",
      "einen Zettel am K\xFChlschrank, seit Wochen unver\xE4ndert",
      "eine Fahrkarte, die schon entwertet ist",
      "ein Ladekabel, das einen Meter zu kurz ist",
      "einen W\xE4schekorb, der immer halb voll bleibt",
      "eine Einkaufstasche mit einem Henkel",
      "ein Kleingeldfach voller falscher M\xFCnzen"
    ],
    "turns": [
      "der freie Tag f\xFCllt sich ungefragt",
      "jemand ruft nach Jahren wieder an",
      "der Umzug f\xE4llt aus",
      "die Routine bricht an einem Dienstag",
      "der Nachbar bleibt in der T\xFCr stehen",
      "der Anruf kommt doch noch",
      "das Paket geh\xF6rt dem Nachbarn",
      "die Rechnung war l\xE4ngst bezahlt",
      "der Termin verschiebt sich um eine Woche",
      "jemand bietet an mitzufahren",
      "das Radio bleibt an",
      "der Bus wartet ausnahmsweise",
      "der Zettel war f\xFCr jemand anderen",
      "die Wohnung nebenan wird gestrichen",
      "der Regen h\xF6rt zur falschen Zeit auf",
      "das Fahrrad steht wieder da",
      "die T\xFCr f\xE4llt zu und der Schl\xFCssel liegt drinnen",
      "der Handwerker kommt, und es war nur eine Sicherung",
      "die Nachbarin klingelt und bleibt eine Stunde",
      "der freie Tag geht mit lauter kleinen Wegen hin"
    ],
    "obstacles": [
      "der Tag hat zu wenig Stunden",
      "niemand ist erreichbar",
      "das Formular verlangt eine Nummer",
      "der Bus f\xE4hrt nur bis zur Br\xFCcke",
      "die Wohnung bleibt zu klein",
      "die Kasse nimmt keine Karten",
      "das Amt hat mittwochs zu",
      "der Aufzug ist au\xDFer Betrieb",
      "die Nummer ist besetzt",
      "das Formular braucht eine Unterschrift von jemand anderem",
      "der Laden schlie\xDFt in zehn Minuten",
      "die Waschmaschine ist belegt",
      "es fehlt Kleingeld",
      "der Termin liegt in der Arbeitszeit",
      "die Post kommt heute sp\xE4ter",
      "niemand hat den Schl\xFCssel",
      "der Automat nimmt die Karte und gibt sie nicht zur\xFCck",
      "die \xD6ffnungszeit hat sich ge\xE4ndert und steht nirgends"
    ],
    "stakes": [
      "Der Einsatz ist ein freier Nachmittag, der erste seit Wochen.",
      "Der Einsatz ist die Miete f\xFCr den n\xE4chsten Monat.",
      "Der Einsatz ist ein Anruf, der \xFCberf\xE4llig ist.",
      "Der Einsatz ist der Platz am Fenster im vollen Bus.",
      "Der Einsatz ist die Ruhe nach Feierabend, eine einzige Stunde.",
      "Der Einsatz ist der Feierabend, der schon zweimal ausfiel.",
      "Der Einsatz ist ein Termin, der nicht wiederkommt.",
      "Der Einsatz ist die Ruhe im Treppenhaus nach zehn.",
      "Der Einsatz ist ein Gespr\xE4ch, das ansteht.",
      "Der Einsatz ist ein Umzug, der bevorsteht.",
      "Der Einsatz ist die Woche, die noch zu tragen ist."
    ],
    "endings": [
      "Der K\xFChlschrank brummt weiter, das Licht geht aus.",
      "Morgen kommt der Bus wieder p\xFCnktlich.",
      "Sie r\xE4umt die Tasse weg und macht das Fenster zu.",
      "Im Treppenhaus geht das Licht von selbst aus.",
      "Der Zettel bleibt liegen, unvollst\xE4ndig.",
      "Die T\xFCr f\xE4llt zu, und es riecht nach Abendessen.",
      "Und der Automat gibt das Kleingeld doch heraus.",
      "So bleibt der Zettel am K\xFChlschrank h\xE4ngen.",
      "Und im Treppenhaus wird es wieder still.",
      "Der Aufzug f\xE4hrt weiter, ohne jemanden.",
      "Und morgen ist der M\xFCll dran.",
      "So geht das Licht im Flur von selbst aus.",
      "Und die W\xE4sche h\xE4ngt noch immer.",
      "Und im Flur riecht es nach dem Essen von nebenan.",
      "So bleibt der Einkaufszettel f\xFCr morgen liegen."
    ]
  },
  "goethe": {
    "motifs": [
      "ein Erlk\xF6nig im Nebelstreif",
      "die Grenze zwischen Wald und Feld",
      "ein Werk, das seinen Meister verschlingt",
      "der Faden einer alten Schuld",
      "Marmor unter s\xFCdlichem Licht",
      "ein Brief an eine Ferne",
      "die Wette zwischen zwei Kr\xE4ften",
      "ein Garten nach strengem Plan",
      "das Wetterleuchten \xFCber Weimar",
      "der Augenblick, der verweilen soll",
      "ein Gartenhaus, in dem ein Fenster nach Osten geht",
      "ein Herbarium, das drei\xDFig Jahre gesammelt wurde",
      "eine Reise \xFCber die Alpen, die alles umstellt",
      "ein Amtszimmer, in dem Akten und Gedichte liegen",
      "ein Prisma, das eine Wand in Farben zerlegt",
      "eine Allee, die genau bis zur Grenze f\xFChrt",
      "ein Manuskript, das zweimal verbrannt wurde",
      "ein Brief, der zwanzig Jahre auf Antwort wartet",
      "ein Theater in einer kleinen Residenzstadt",
      "ein Junge, der auf einem Pferd durch den Nebel getragen wird",
      "ein Besen, der Wasser holt und nicht aufh\xF6rt",
      "ein Stein, der in einer Sammlung eine Nummer tr\xE4gt"
    ],
    "hooks": [
      "ein Vater reitet zu schnell",
      "der Lehrling spricht die halbe Formel",
      "ein Brief tr\xE4gt kein Datum",
      "der Spiegel zeigt eine j\xFCngere Hand",
      "jemand schlie\xDFt eine Wette ohne Zeugen",
      "Der Herzog verlangt ein Gutachten bis Freitag.",
      "Ein Lehrling spricht die Formel, aber nur die halbe.",
      "Der Brief aus Rom liegt seit drei Wochen unge\xF6ffnet.",
      "Im Garten bl\xFCht etwas zwei Monate zu fr\xFCh.",
      "Ein Vater reitet schneller, als der Weg erlaubt.",
      "Das Manuskript hat eine L\xFCcke, wo die Mitte war.",
      "Jemand schlie\xDFt eine Wette und nennt keinen Zeugen.",
      "Die Farben stimmen nicht mit der Lehre \xFCberein.",
      "Ein Besuch k\xFCndigt sich an, den niemand bestellt hat.",
      "Der Meister ist fort, und die Formel liegt offen.",
      "Im Theater fehlt am Abend die zweite Stimme.",
      "Ein Amt wird angeboten, das die Arbeit beendet."
    ],
    "props": [
      "einen Federkiel",
      "einen Siegelring",
      "einen Zauberbesen",
      "eine Wetterfahne",
      "einen Reisekoffer",
      "eine Farbenscheibe",
      "ein Manuskript",
      "einen Wanderstock",
      "einen Federkiel mit gespaltener Spitze",
      "ein Herbarium mit beschrifteten B\xF6gen",
      "einen Siegelring des Hauses",
      "ein Prisma aus geschliffenem Glas",
      "einen Reisekoffer mit italienischen Zetteln",
      "ein Manuskript in zwei Handschriften",
      "einen Gehstock aus Kirschholz",
      "eine Wetterfahne \xFCber dem Gartenhaus",
      "ein St\xFCck Gestein mit einer Nummer",
      "einen Brief mit gebrochenem Siegel"
    ],
    "turns": [
      "der Diener gehorcht l\xE4nger als befohlen",
      "die Wette wendet sich gegen beide",
      "das Werk gelingt und fordert alles",
      "ein Wort zu viel bindet f\xFCr immer",
      "die Reise f\xFChrt zur\xFCck an den Anfang",
      "der Diener gehorcht weiter, auch als niemand mehr befiehlt",
      "die Wette wendet sich gegen beide, die sie schlossen",
      "das Werk gelingt und verlangt daf\xFCr das ganze Leben",
      "ein Wort zu viel bindet f\xFCr l\xE4nger als gedacht",
      "die Reise f\xFChrt zur\xFCck an den Anfang, aber anders",
      "der Amtsschimmel siegt \xFCber den Entwurf",
      "ein Naturgesetz stimmt und beschreibt trotzdem nichts",
      "der Lehrling ruft den Meister und wird nicht geh\xF6rt",
      "die Ordnung im Garten h\xE4lt, und der G\xE4rtner nicht",
      "das Gedicht steht am Rand einer Akte",
      "der Herzog entscheidet, ohne das Gutachten zu lesen",
      "eine Farbe entsteht erst im Auge, nicht im Licht",
      "der Ruhm kommt f\xFCr das Falsche",
      "ein Kind stirbt auf dem Weg, und der Ritt geht weiter"
    ],
    "obstacles": [
      "das Wort f\xFCr den Bann fehlt",
      "zwei Seelen wollen verschiedene Wege",
      "die Zeit l\xE4sst sich nicht anhalten",
      "der Meister bleibt fort",
      "die Formel ist nur halb gelernt",
      "das Wort f\xFCr den Bann fehlt genau an dieser Stelle",
      "zwei Seelen in einer Brust wollen verschiedene Wege",
      "die Zeit l\xE4sst sich nicht anhalten, auch nicht kurz",
      "der Meister bleibt fort, und die Formel wirkt weiter",
      "das Amt verlangt jeden Vormittag",
      "der Herzog braucht eine Antwort und keine Wahrheit",
      "die Alpen sind bis Mai geschlossen",
      "die Lehre widerspricht der Messung eines anderen",
      "das Manuskript ist an zwei Stellen unleserlich",
      "ein Ruf aus Berlin verlangt eine Entscheidung",
      "die Freundschaft h\xE4lt den Widerspruch nicht aus",
      "die Post nach Italien braucht drei Wochen",
      "der Garten w\xE4chst schneller als die Ordnung",
      "niemand liest ein Gutachten \xFCber Farben"
    ],
    "stakes": [
      "Der Einsatz ist ein Augenblick, der bleiben soll.",
      "Der Einsatz ist die Seele in einer Wette.",
      "Der Einsatz ist das Kind auf dem Pferd.",
      "Der Einsatz ist der Ruhm eines Werks.",
      "Der Einsatz ist zwei Seelen in einer Brust.",
      "Der Einsatz ist ein Werk, das nach vierzig Jahren fertig wird.",
      "Der Einsatz ist ein Kind auf einem Pferd im Nebel.",
      "Der Einsatz ist eine Freundschaft gegen eine \xDCberzeugung.",
      "Der Einsatz ist ein Amt, das die Arbeit auffrisst.",
      "Der Einsatz ist eine Lehre, an die niemand glaubt.",
      "Der Einsatz ist die Ordnung eines Gartens im Herbst."
    ],
    "endings": [
      "Der Vater kommt an, das Kind ist still.",
      "Die Besen stehen, das Wasser steigt weiter.",
      "Er sagt das Wort, und alles h\xE4lt an.",
      "Der Garten bleibt in Ordnung, der G\xE4rtner geht.",
      "Am Ende verweilt nichts, auch nicht der Augenblick.",
      "Und im Gartenhaus bleibt das Fenster nach Osten offen.",
      "So stehen die Besen still, und das Wasser steht auch.",
      "Und das Manuskript geht mit einer L\xFCcke in den Druck.",
      "So kommt der Vater an, und das Kind ist still.",
      "Der Brief aus Rom bleibt unge\xF6ffnet liegen.",
      "Und der Herzog unterschreibt, ohne zu lesen.",
      "So bleibt die Farbe im Auge und nicht im Licht.",
      "Und am Morgen wird das Herbarium weitergef\xFChrt."
    ],
    "verwandlungen": [
      "Werk\u2192Geb\xE4ude",
      "Feder\u2192Klinge",
      "Garten\u2192Park",
      "Brief\u2192Auftrag",
      "Formel\u2192Regel",
      "Farbe\u2192Ahnung",
      "Reise\u2192Flucht",
      "Stein\u2192Knochen"
    ]
  },
  "sinnlich": {
    "motifs": [
      "Regen auf warmem Stein",
      "der Geschmack von Salz auf den Lippen",
      "Wolle an der Innenseite des Arms",
      "ein Geruch aus der Kindheit",
      "das Knistern von Papier",
      "Licht durch geschlossene Lider",
      "kaltes Wasser an den Handgelenken",
      "der Nachhall einer Stimme",
      "Sand zwischen den Fingern",
      "der erste Schluck nach langem Weg",
      "ein Zimmer, in dem es nach Bienenwachs riecht",
      "ein Stoff, der unter der Hand nachgibt",
      "eine Frucht, die im Mund k\xE4lter wird",
      "ein Ger\xE4usch, das man auf der Haut sp\xFCrt",
      "ein Licht, das die Farben verschiebt",
      "ein Boden, der unter den F\xFC\xDFen warm bleibt",
      "ein Duft, der ein Datum aufruft",
      "ein Ton, der im Brustbein sitzt"
    ],
    "hooks": [
      "ein Duft kommt ohne Quelle",
      "die Haut sp\xFCrt ein Ger\xE4usch",
      "ein Geschmack weckt ein Datum",
      "das Licht f\xFChlt sich schwer an",
      "eine Ber\xFChrung klingt nach",
      "Ein Duft kommt durch das Treppenhaus, ohne Quelle.",
      "Die Haut sp\xFCrt ein Ger\xE4usch, bevor das Ohr es h\xF6rt.",
      "Ein Geschmack ruft ein Datum auf, das niemand nannte.",
      "Der Stoff f\xFChlt sich anders an als gestern.",
      "Das Licht im Zimmer macht die Farben falsch.",
      "Sie legt die Hand auf den Stein und bleibt stehen.",
      "Der Regen klingt anders auf diesem Dach.",
      "Die W\xE4rme bleibt an der Stelle, wo eine Hand lag.",
      "Etwas riecht nach einer Wohnung von vor drei\xDFig Jahren."
    ],
    "props": [
      "eine Orange",
      "einen Wollschal",
      "eine Schale Wasser",
      "ein St\xFCck Rinde",
      "eine Glocke",
      "ein Tuch",
      "eine Kerze",
      "einen Kieselstein",
      "eine Orange mit dicker Schale",
      "einen Wollschal, der kratzt",
      "eine Schale mit lauwarmem Wasser",
      "ein St\xFCck rohe Seide",
      "eine Kerze aus Bienenwachs",
      "einen Stein, den die Sonne aufgew\xE4rmt hat",
      "eine Feder f\xFCr die Innenseite des Arms",
      "ein Glas mit einem Rest Salz"
    ],
    "turns": [
      "ein Sinn \xFCbernimmt die Arbeit des anderen",
      "der Geruch f\xFChrt an einen Ort zur\xFCck",
      "die Ber\xFChrung ver\xE4ndert die Farbe",
      "das H\xF6ren wird zum Sehen",
      "der Geschmack bleibt l\xE4nger als die Erinnerung",
      "der Geruch f\xFChrt an einen Ort zur\xFCck, den es nicht mehr gibt",
      "die Ber\xFChrung ver\xE4ndert die Farbe des Ganzen",
      "das Ohr h\xF6rt auf, und die Haut h\xF6rt weiter",
      "ein Geschmack ordnet die Erinnerung neu",
      "die W\xE4rme bleibt l\xE4nger als die Hand",
      "das Licht wechselt, und der Raum wird ein anderer",
      "was weich war, wird unter der Hand kalt",
      "der Ton h\xF6rt auf, und die Stille hat eine Farbe",
      "ein Duft nimmt einen ganzen Nachmittag ein",
      "die Sprache kommt zu sp\xE4t und macht es kleiner",
      "die Haut merkt sich, was der Kopf vergisst",
      "eine Ber\xFChrung wird zur Auskunft",
      "das Auge macht den Fehler, den die Hand nicht macht",
      "die Zunge findet ein Wort, das die Hand schon kannte",
      "der Raum wird kleiner, sobald das Licht sich \xE4ndert",
      "ein Ger\xE4usch aus dem Hof ordnet den ganzen Nachmittag",
      "die K\xE4lte kommt sp\xE4ter als erwartet und bleibt l\xE4nger",
      "der Stoff gibt nach und beh\xE4lt den Abdruck",
      "ein Geschmack kippt von s\xFC\xDF nach bitter, in der Mitte",
      "sie riecht es zuerst und sagt es zuletzt"
    ],
    "obstacles": [
      "die Worte fehlen f\xFCr das Gef\xFChlte",
      "der Duft verfliegt zu schnell",
      "niemand sonst nimmt es wahr",
      "die Haut gew\xF6hnt sich",
      "der Ton liegt au\xDFerhalb des H\xF6rens",
      "die Worte fehlen f\xFCr das, was gef\xFChlt wird",
      "der Duft verfliegt, bevor er benannt ist",
      "niemand sonst nimmt es wahr, und das ist die Frage",
      "das Licht in diesem Zimmer ist immer dasselbe",
      "die Erk\xE4ltung nimmt zwei Sinne auf einmal",
      "der Stoff ist nur in einem Laden zu bekommen",
      "die Erinnerung an den Geruch stimmt nicht",
      "die W\xE4rme h\xE4lt nur bis zum Abend",
      "ein Ton \xFCbert\xF6nt alles andere im Haus",
      "die Frucht ist au\xDFerhalb der Saison",
      "die Hand ist zu kalt f\xFCr diesen Stoff",
      "die Kerze brennt nur eine Stunde",
      "man kann es nicht zweimal zum ersten Mal riechen",
      "die Beschreibung macht das Gef\xFChl kaputt",
      "das Fenster l\xE4sst sich in diesem Zimmer nicht \xF6ffnen",
      "der Laden hat die Seide nicht mehr im Sortiment",
      "die Nachbarn kochen etwas, das alles \xFCberdeckt",
      "der Stein k\xFChlt aus, bevor jemand kommt",
      "das Wasser ist zu hei\xDF und dann zu kalt",
      "die Frucht ist reif und schmeckt nach nichts",
      "der Ton ist da und nicht zu orten"
    ],
    "stakes": [
      "Der Einsatz ist eine Erinnerung, die nur im Duft lebt.",
      "Der Einsatz ist die Sch\xE4rfe der Wahrnehmung.",
      "Der Einsatz ist ein Augenblick vor dem Vergessen.",
      "Der Einsatz ist die eigene Haut.",
      "Der Einsatz ist ein Name f\xFCr ein Gef\xFChl.",
      "Der Einsatz ist ein Zimmer, das nach etwas riecht.",
      "Der Einsatz ist die Frage, ob ein anderer es auch sp\xFCrt.",
      "Der Einsatz ist ein Nachmittag, den ein Duft einnimmt."
    ],
    "endings": [
      "Der Regen h\xF6rt auf, der Stein bleibt warm.",
      "Nichts davon l\xE4sst sich sagen.",
      "Sie schlie\xDFt die Augen und sieht mehr.",
      "Der Duft geht, das Zimmer bleibt.",
      "Am Ende bleibt Salz auf den Lippen.",
      "Und der Duft ist am Abend nicht mehr da.",
      "So bleibt die W\xE4rme an der Stelle, f\xFCr kurze Zeit.",
      "Und die Schale steht leer auf dem Tisch.",
      "Am Ende bleibt ein Geschmack und kein Wort daf\xFCr.",
      "Und das Licht wandert weiter \xFCber den Boden.",
      "So bleibt der Ton im Brustbein, bis er geht.",
      "Und morgen riecht das Zimmer nach etwas anderem.",
      "Und der Stein liegt am Morgen kalt im Gras.",
      "So bleibt die Seide im Regal, ungekauft.",
      "Am Ende steht die Kerze abgebrannt auf dem Teller.",
      "Und im Treppenhaus riecht es wieder nach nichts.",
      "So bleibt der Abdruck im Stoff, bis jemand ihn gl\xE4ttet."
    ],
    "verwandlungen": [
      "Duft\u2192Verdacht",
      "Haut\u2192Rinde",
      "Stein\u2192Knochen",
      "Licht\u2192Ger\xFCcht",
      "Frucht\u2192Faust"
    ]
  }
};

// src/wordbank.ts
var ACTIVE_KEY = "divergenz_active_preset_v1";
function loadActiveBankLabel() {
  try {
    return localStorage.getItem(ACTIVE_KEY) || "";
  } catch {
    return "";
  }
}

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
var FINIT = /^(ist|sind|war|waren|hat|haben|hatte|wird|werden|wurde|kann|koennen|können|muss|müssen|will|wollen|bleibt|bleiben|steht|stehen|geht|gehen|kommt|kommen|liegt|liegen|zeigt|zeigen|faellt|fällt|reicht|gilt|klingt|wirkt|scheint|fehlt|passt|stimmt)$/i;
function verbAnsEnde(satz) {
  const w = stripTailPunct(satz).split(/\s+/).filter(Boolean);
  if (w.length < 3 || w.length > 9) return null;
  const vi = w.findIndex((x) => FINIT.test(x));
  if (vi < 1 || vi === w.length - 1) return null;
  if (w.slice(vi + 1).some((x) => FINIT.test(x))) return null;
  const verb = w[vi];
  return [...w.slice(0, vi), ...w.slice(vi + 1), verb].join(" ");
}
function normalizePlace(W) {
  const w = clean(W);
  if (!w) return "an einem Ort";
  if (/^(im|am|in|auf|bei|unter|über|vor|hinter)\b/i.test(w)) return w;
  return "an einem " + w;
}
function bogenSaetze(d, kit) {
  const s = (a) => Array.isArray(a) ? a.filter(Boolean) : [];
  const P2 = kit.P;
  const fest = [];
  const einstieg = s(d.einstieg), mitte = s(d.mitte), hoehe = s(d.hoehepunkt), aend = s(d.veraenderungen);
  if (einstieg.length) fest.push(`${cap(stripTailPunct(pick(einstieg)))}.`);
  if (mitte.length) fest.push(`${cap(stripTailPunct(pick(mitte)))}.`);
  if (hoehe.length) fest.push(`Und dann: ${stripTailPunct(pick(hoehe))}.`);
  if (aend.length) fest.push(`Etwas kippt: ${stripTailPunct(pick(aend))}.`);
  const frei = [];
  for (const r of s(d.regeln)) frei.push(`Regel: ${ensurePunct(r)}`);
  for (const z of s(d.zeitanomalien)) frei.push(ensurePunct(z));
  const K_RAHMEN = [`${P2} wei\xDF, worum es geht:`, "Im Bild bleibt:", "Der Einsatz sichtbar:", "Alles zielt auf:"];
  const A_RAHMEN = ["Dann, unvermittelt:", "Ohne Vorwarnung:", "Ein Schnitt, und:", "Und pl\xF6tzlich:"];
  s(d.konflikte).forEach((k, i) => frei.push(`${K_RAHMEN[i % K_RAHMEN.length]} ${stripTailPunct(k)}.`));
  s(d.ausloeser).forEach((a, i) => frei.push(`${A_RAHMEN[i % A_RAHMEN.length]} ${stripTailPunct(a)}.`));
  return { fest, frei };
}
function buildVideoShots(kit, shotCount, lenTarget = 0) {
  const sym = pickSymbol();
  const place = normalizePlace(kit.W);
  const who = kit.P;
  const objClean = stripTailPunct(pick([kit.hookDat, kit.propDat]));
  const bogen = loadDramaData();
  const shots = [];
  let nachschub = [];
  let nachschubVorrat = [];
  const bild = () => `${cap(pick(VIDEO_LIGHT))}. ${cap(pick(VIDEO_CAM_EXTENDED))}.`;
  if (bogen) {
    const { fest, frei } = bogenSaetze(bogen, kit);
    const rest = reihenfolge(frei);
    shots.push(`${cap(place)}: ${who} nahe ${objClean}. ${cap(pick(VIDEO_TEX))}. ${bild()}`);
    const folge = [];
    for (let i = 0; i < fest.length; i++) {
      folge.push(fest[i]);
      if (rest.length && folge.length + 1 < shotCount) folge.push(rest.shift());
    }
    while (folge.length < shotCount - 1 && rest.length) folge.push(rest.shift());
    for (const satz of folge.slice(0, shotCount - 2)) shots.push(`${satz} ${bild()}`);
    nachschub = rest;
    nachschubVorrat = frei;
    shots.push(`${ensurePunct(kit.ending)} Nur: ${pick(["der Riss", "das Fenster", `das Symbol ${sym}`, "die Karte"])} bleibt sichtbar. ${cap(pick(VIDEO_TEX))}.`);
  } else {
    const hindernis = verbAnsEnde(kit.obstacle);
    shots.push(`${cap(place)} steht ${who} nahe ${objClean}. ${cap(pick(VIDEO_LIGHT))}. ${cap(pick(VIDEO_CAM_EXTENDED))}. ${cap(pick(VIDEO_TEX))}.`);
    shots.push(`Regel: ${cap(pick(VIDEO_RULES))}. ${sym}. ${hindernis ? `${who} bemerkt, dass ${hindernis}` : `${who} bemerkt: ${stripTailPunct(kit.obstacle)}`}. ${cap(pick(VIDEO_CAM_EXTENDED))}.`);
    shots.push(`${ensurePunct(kit.turn)} Der Raum reagiert: ${sym} pulsiert, und ${pick(["die W\xE4nde atmen", "die Perspektive kippt", "der Boden verschiebt sich", "die Luft wird k\xF6rnig"])}. ${cap(pick(VIDEO_LIGHT))}.`);
    shots.push(kit.AisClause || kit.AisInfinitiveLed ? `${who} erkennt: ${stripTailPunct(kit.Apure)} \u2014 aber ${pick(["die Zeit springt", "die Regeln drehen sich um", "die Schatten l\xF6sen sich"])}. ${cap(pick(VIDEO_CAM_EXTENDED))}.` : `${who} ${kit.AleadVerb || "versucht"} ${stripTailPunct(kit.Apure)}, aber ${pick(["die Zeit springt", "die Regeln drehen sich um", "die Schatten l\xF6sen sich"])}. ${cap(pick(VIDEO_CAM_EXTENDED))}.`);
    shots.push(`${ensurePunct(kit.ending)} Nur: ${pick(["der Riss", "das Fenster", `das Symbol ${sym}`, "die Karte"])} bleibt sichtbar. ${cap(pick(VIDEO_TEX))}.`);
  }
  while (shots.length < shotCount) {
    shots.splice(
      Math.max(1, shots.length - 1),
      0,
      `${who} passiert an ${pick(["einer Kante", "einem Spiegel", "einer T\xFCr ohne Griff"])} vorbei. ${bild()}`
    );
  }
  const fertig = shots.slice(0, shotCount);
  if (lenTarget > 0) {
    const zaehl = () => fertig.join(" ").split(/\s+/).filter(Boolean).length;
    const gesamt = new Set(fertig.flatMap((x) => x.split(". ").map((y) => y.trim() + ".")));
    for (let runde = 0; runde < 20 && nachschubVorrat.length && zaehl() < lenTarget * 0.92; runde++) {
      if (!nachschub.length) nachschub = reihenfolge(nachschubVorrat);
      let gesetztInRunde = 0;
      for (let i = 0; i < fertig.length && nachschub.length && zaehl() < lenTarget * 0.92; i++) {
        const satz = nachschub.shift();
        if (gesamt.has(satz)) continue;
        gesamt.add(satz);
        fertig[i] += " " + satz;
        gesetztInRunde++;
      }
      if (!gesetztInRunde && !nachschub.length) break;
    }
    for (let runde = 0; runde < 12 && zaehl() < lenTarget * 0.92; runde++) {
      for (let i = 0; i < fertig.length && zaehl() < lenTarget * 0.92; i++) {
        const frei2 = (liste) => {
          const schon = fertig[i].toLowerCase();
          const offen = liste.filter((x) => !schon.includes(x.toLowerCase()));
          return offen.length ? pick(offen) : null;
        };
        const tex = frei2(VIDEO_TEX);
        const licht = frei2(VIDEO_LIGHT);
        if (!tex && !licht) break;
        fertig[i] += (tex ? " " + cap(tex) + "." : "") + (licht ? " " + cap(licht) + "." : "");
      }
    }
  }
  return fertig;
}
function reihenfolge(a) {
  const x = a.slice();
  for (let i = x.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [x[i], x[j]] = [x[j], x[i]];
  }
  return x;
}
function buildVideoSequenceText(kit, shotCount = 5, totalSec = 15, lenTarget = 0) {
  const n = clampShotCount(shotCount);
  const total = clampTotalSec(totalSec);
  const dur = total / n;
  const shots = buildVideoShots(kit, n, lenTarget);
  const titel = [loadActiveBankLabel(), kit.mode.label].filter(Boolean).join(" \xB7 ");
  const out = [`SEQUENZ \u2014 ${titel}`.trim(), `WER: ${kit.PRaw || kit.P}`, `WO: ${kit.W}`, `WANN: ${kit.T}`, `WAS: ${kit.A}`, `GESAMTL\xC4NGE: ${fmtSec(total)} \u2022 ${fmtSec(dur)} pro Shot`, ""];
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

// src/types.ts
var KEINE_KATEGORIE = /* @__PURE__ */ new Set(["verwandlungen"]);

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
      platzhalter: [],
      stelle: "anfang"
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
      platzhalter: [],
      stelle: "ende"
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
function getTrace() {
  return spur.slice();
}
var nachText2 = /* @__PURE__ */ new Map();
var schluessel2 = (t) => t.toLowerCase().replace(/[^a-zäöüß]/g, "").slice(0, 400);
function linkTrace(finalText) {
  if (!spur.length || !finalText) return;
  if (nachText2.size > 64) {
    const erste = nachText2.keys().next().value;
    if (erste) nachText2.delete(erste);
  }
  nachText2.set(schluessel2(finalText), spur.slice());
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
var GERUESTZEILE = /(^|\s)(SEQUENZ\s*—|(?:WER|WO|WANN|WAS|GESAMTLÄNGE|DE|EN)\s*:|Shot\s*\d+\s*\()/;
var GERUEST_MARKE = /^(?:SEQUENZ\s*—[^\n]*|(?:WER|WO|WANN|WAS|GESAMTLÄNGE|DE|EN)\s*:|Shot\s*\d+\s*\([^)]*\))\s*/;
var traegtPerson = (t) => (t.toLowerCase().match(/[a-zäöüß]+/g) || []).some((w) => !!ICH_DU_ZU_ER[w]);
function buildPool(bank, perspektive, what, figur, model, markovMode) {
  const pool = [];
  let i = 0;
  const w = (what || "").trim();
  if (w) {
    const lead = extractLeadVerb(w);
    const kern = lead.rest.replace(/[.!?…]+$/, "");
    const P2 = figur || "Jemand";
    const saetze = lead.isInfinitiveLed ? [`${P2} will ${kern}`, `Alles dr\xE4ngt darauf, ${kern.replace(/(\S+)$/, "zu $1")}`] : lead.verb ? [`${P2} ${lead.verb} ${kern}`] : looksLikeFullClause(lead.verb, kern) || hatFinitesVerb(kern) || !wirktNominal(kern) ? [kern] : [`Es geht um eines: ${kern}`, `${P2} sucht ${kern}`];
    for (const t of saetze) {
      const d = deriveAtom(t);
      pool.push({ ...d, id: `was-${pool.length}`, quelle: "kontext", kategorie: "was", verlangt: null, bruchgrad: 0 });
    }
  }
  const drama = loadKnobs().bogen === 0 ? null : loadDramaData();
  if (drama) {
    const felder = [
      ["einstieg", drama.einstieg],
      ["mitte", drama.mitte],
      ["hoehepunkt", drama.hoehepunkt],
      ["konflikte", drama.konflikte],
      ["ausloeser", drama.ausloeser],
      ["veraenderungen", drama.veraenderungen],
      ["zeitanomalien", drama.zeitanomalien],
      ["regeln", drama.regeln]
      // "schluss" bleibt aussen vor: Stilworte wie "offen" sind kein Textmaterial.
    ];
    for (const [kat, arr] of felder) {
      if (!Array.isArray(arr)) continue;
      for (const t of arr) {
        const roh = (t || "").trim();
        if (roh.length < 4) continue;
        const d = deriveAtom(roh);
        pool.push({
          ...d,
          id: `dr-${kat}-${++i}`,
          quelle: "dramaturgie",
          kategorie: kat,
          verlangt: null,
          bruchgrad: d.unsicher.length ? 1 : 0
        });
      }
    }
  }
  if (model && markovMode && markovMode !== "off") {
    const wieViele = markovMode === "on" ? 34 : 16;
    const eigene = new Set((figur || "").toLowerCase().split(/[,;]/).map((x) => x.trim()).filter(Boolean));
    const gesehen = /* @__PURE__ */ new Set();
    for (let n = 0; n < wieViele * 3 && gesehen.size < wieViele; n++) {
      const roh = (model.generate(14) || "").trim();
      if (!roh || !isSaneMarkov(roh)) continue;
      const sig = roh.toLowerCase();
      if (gesehen.has(sig)) continue;
      const d = deriveAtom(roh);
      if (d.tempus === "praeteritum") continue;
      if (d.rhythmus.woerter > 20) continue;
      if (properNames(roh).some((nm) => !eigene.has(nm.toLowerCase()))) continue;
      if (traegtPerson(roh)) continue;
      gesehen.add(sig);
      pool.push({ ...d, id: `mk-${++i}`, quelle: "markov", kategorie: "", verlangt: null, bruchgrad: 1 });
    }
  }
  const korpusDeckel = loadKnobs().korpus;
  if (korpusDeckel > 0) {
    const eigene2 = new Set((figur || "").toLowerCase().split(/[,;]/).map((x) => x.trim()).filter(Boolean));
    const roh = corpusSanitize(loadPersistentCorpus());
    const saetze = roh.split(/(?<=[.!?…])\s+/).map((x) => x.trim()).filter((x) => x.length > 12);
    let genommen = 0;
    for (const satz of saetze) {
      if (genommen >= korpusDeckel) break;
      const rein = satz.replace(GERUEST_MARKE, "").trim();
      if (rein !== satz && !/[.!?…]$/.test(rein)) continue;
      if (GERUESTZEILE.test(rein)) continue;
      const d = deriveAtom(rein);
      if (d.tempus === "praeteritum") continue;
      if (d.rhythmus.woerter > 22) continue;
      if (properNames(rein).some((nm) => !eigene2.has(nm.toLowerCase()))) continue;
      if (traegtPerson(rein)) continue;
      pool.push({ ...d, id: `kp-${++i}`, quelle: "korpus", kategorie: "", verlangt: null, bruchgrad: 1 });
      genommen++;
    }
  }
  for (const [kat, arr] of Object.entries(bank)) {
    if (!Array.isArray(arr)) continue;
    if (KEINE_KATEGORIE.has(kat)) continue;
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
      fuehrt_ein: [],
      stelle: a.stelle
    });
  }
  return pool;
}
var divergenzOf = (input) => (input.varLevel === "high" ? 85 : input.varLevel === "low" ? 30 : 60) + (input.instability >= 2 ? 10 : 0);
var wirktNominal = (t) => /^\s*(ein|eine|einen|einem|eines|einer|der|die|das|den|dem|des|mein|meine|meinen|sein|seine|ihr|ihre|kein|keine|viele|manche|jede|jeden|etwas|nichts|[A-ZÄÖÜ])/.test(t);
var FLACH = /* @__PURE__ */ new Set(["nominalphrase", "praepositionalphrase", "fragment", "einwort"]);
function buildRekombination(bank, input, model) {
  const pool = buildPool(
    bank,
    input.perspective,
    input.what,
    (personKopf(splitSpeakers(normWho(input.who || ""))[0] || "") || "Jemand").trim(),
    model,
    input.markovMode
  );
  const ctx = {
    ort: normWhere(input.where || "") || "an einem Ort",
    zeit: normWhen(input.when || "") || "zu einer Zeit",
    figur: (personKopf(splitSpeakers(normWho(input.who || ""))[0] || "") || "Jemand").trim(),
    verb: "will"
  };
  const zielWoerter = Math.max(30, input.lenTarget ?? 110);
  const tempusZaehler = /* @__PURE__ */ new Map();
  for (const a of pool) if (a.tempus && a.tempus !== "kein") tempusZaehler.set(a.tempus, (tempusZaehler.get(a.tempus) || 0) + 1);
  const mehrheit = [...tempusZaehler].sort((a, b) => b[1] - a[1])[0]?.[0] ?? "praesens";
  const k = {
    vorheriges: null,
    offenerKopf: false,
    entitaeten: /* @__PURE__ */ new Map([[ctx.figur, { abstand: 0 }]]),
    tempus: mehrheit,
    divergenz: divergenzOf(input),
    benutzt: /* @__PURE__ */ new Set()
  };
  const knobs = loadKnobs();
  const W4_MAX = knobs.w4max;
  const ENDE_MARGE = 20;
  const FUEGE_DECKEL = knobs.fuegeteil / 100;
  const figuren = splitSpeakers(normWho(input.who || "")).map(personKopf);
  const waehleFigur = () => {
    if (figuren.length < 2) return ctx.figur;
    return Math.random() < 0.65 ? figuren[0] : figuren[1 + Math.floor(Math.random() * (figuren.length - 1))];
  };
  const kurve = ["mittel", "kurz", "lang", "mittel", "kurz", "mittel", "lang"];
  const out = [];
  let letzterTyp = "", gleicheInFolge = 0, wasGesetzt = false, flachInFolge = 0;
  const gesetzteTexte = /* @__PURE__ */ new Set();
  const anfangZahl = /* @__PURE__ */ new Map();
  const benutztBei = /* @__PURE__ */ new Map();
  const kurzGesperrt = /* @__PURE__ */ new Set();
  const ABSTAND = knobs.abstand;
  const PHRASE = knobs.phrase;
  const nachlegen = () => {
    let frei = 0;
    for (const [id, wann] of [...benutztBei]) {
      if (out.length - wann >= ABSTAND) {
        k.benutzt.delete(id);
        benutztBei.delete(id);
        frei++;
      }
    }
    return frei;
  };
  const anfangVon = (t) => t.toLowerCase().replace(/[^a-zäöüß ]/g, "").trim().split(/\s+/).slice(0, 3).join(" ");
  resetTrace();
  let fuegeteile = 0;
  const schlussAmEnde = (STRUKTUR_PHASEN[input.structure || "rekombination"] || STRUKTUR_PHASEN["linear"]).slice(-1)[0] === "schluss";
  const woerterJetzt = () => out.join(" ").split(/\s+/).filter(Boolean).length;
  for (let s = 0; s < 600; s++) {
    const fortschritt = woerterJetzt() / zielWoerter;
    if (fortschritt >= 1) break;
    const phase = phasenFolge(input.structure || "rekombination", fortschritt);
    const letzte = fortschritt >= 0.92;
    let kand = pool.filter((a2) => passt(a2, k, phase) && !kurzGesperrt.has(a2.id) && !(wasGesetzt && a2.kategorie === "was"));
    if (out.length >= 3 && fuegeteile / out.length >= FUEGE_DECKEL) {
      const inhalt = kand.filter((a2) => a2.quelle !== "vorlage");
      if (!inhalt.length) {
        nachlegen();
        const rahmen = pool.filter((a2) => a2.verlangt && passt(a2, k, phase));
        if (!rahmen.length) break;
        kand = rahmen;
      } else kand = inhalt;
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
    if (schlussAmEnde && zielWoerter - woerterJetzt() > ENDE_MARGE) kand = kand.filter((a2) => a2.kategorie !== "endings");
    kand = kand.filter((a2) => !a2.stelle || (a2.stelle === "anfang" ? fortschritt < 0.25 : fortschritt > 0.82));
    if (!kand.length) {
      if (!nachlegen()) break;
      continue;
    }
    if (!kand.length) {
      if (!nachlegen()) break;
      continue;
    }
    if (!wasGesetzt && fortschritt >= 0.35) {
      const wasKand = kand.filter((x) => x.kategorie === "was");
      if (wasKand.length) kand = wasKand;
    }
    const a = ziehe(kand, kurve[s % kurve.length], out.join(" "), phase);
    if (!a) break;
    let text = fuelleKontext(a.text, { ...ctx, figur: waehleFigur() });
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
      const istFigur = !!w1 && (w1.toLowerCase() === ctx.figur.toLowerCase() || splitSpeakers(normWho(input.who || "")).some((x) => x.trim().toLowerCase() === w1.toLowerCase()));
      if (!f.fuehrt_ein.length && !istNomen && !istFigur && /^[A-ZÄÖÜ][a-zäöüß]/.test(fill)) fill = fill.charAt(0).toLowerCase() + fill.slice(1);
      text = fuelleSlot(text, fill);
      fueller.push({ text: fill, kategorie: f.kategorie || "\u2014", quelle: f.quelle });
      k.benutzt.add(f.id);
      benutztBei.set(f.id, out.length);
    }
    if (offeneSlots(text)) continue;
    const sig = text.toLowerCase().replace(/[^a-zäöüß ]/g, "").replace(/\s+/g, " ").trim();
    if (gesetzteTexte.has(sig)) {
      k.benutzt.add(a.id);
      continue;
    }
    const zaehleIn = (hay, nadel) => !nadel || nadel.length < 4 ? 0 : hay.toLowerCase().split(nadel.toLowerCase()).length - 1;
    const bisher = out.join(" ");
    let zuOft = false;
    for (const wert of [ctx.ort, ctx.zeit]) {
      if (zaehleIn(text, wert) && zaehleIn(bisher, wert) >= W4_MAX) {
        zuOft = true;
        break;
      }
    }
    if (zuOft) {
      k.benutzt.add(a.id);
      continue;
    }
    if (PHRASE > 0) {
      const ohne4W = (roh) => {
        let x = roh.toLowerCase();
        for (const wert of [ctx.ort, ctx.zeit]) {
          if (wert && wert.length >= 4) x = x.split(wert.toLowerCase()).join(" ");
        }
        return x;
      };
      const fenster = a.quelle === "korpus" ? 4 : PHRASE;
      const inhaltlich = (kette) => kette.filter((x) => x.length >= 5).length >= 2;
      const wds = ohne4W(text).match(/[a-zäöüß]{2,}/g) || [];
      const bisherLow = (ohne4W(out.join(" ")).match(/[a-zäöüß]{2,}/g) || []).join(" ");
      let doppelt = false;
      for (let x = 0; x + fenster <= wds.length; x++) {
        const kette = wds.slice(x, x + fenster);
        if (inhaltlich(kette) && bisherLow.includes(kette.join(" "))) {
          doppelt = true;
          break;
        }
      }
      if (doppelt) {
        kurzGesperrt.add(a.id);
        continue;
      }
    }
    const anf = anfangVon(text);
    const formel = /^(der einsatz ist|es geht um|alles dreht sich|was zählt ist|auf dem spiel)/.test(anf);
    if (anf.split(" ").length >= 2 && (anfangZahl.get(anf) || 0) >= (formel ? 1 : 2)) {
      k.benutzt.add(a.id);
      continue;
    }
    gesetzteTexte.add(sig);
    anfangZahl.set(anf, (anfangZahl.get(anf) || 0) + 1);
    kurzGesperrt.clear();
    out.push(text);
    if (a.quelle === "markov") traceMarkov(a.text);
    pushTrace({ text, quelle: a.quelle, kategorie: a.kategorie || "\u2014", typ: a.typ, phase, fueller: fueller.length ? fueller : void 0 });
    gleicheInFolge = a.typ === letzterTyp ? gleicheInFolge + 1 : 0;
    flachInFolge = FLACH.has(a.typ) ? flachInFolge + 1 : 0;
    letzterTyp = a.typ;
    benutztBei.set(a.id, out.length);
    fortschreiben(k, a);
    if (a.verlangt) k.offenerKopf = false;
    if (a.quelle === "vorlage") fuegeteile++;
    if (a.kategorie === "was") wasGesetzt = true;
    if (a.kategorie === "endings" && schlussAmEnde) break;
  }
  let fertig = verfugen(out);
  if (input.perspective && input.perspective !== "third" && input.perspective !== "auto") {
    const dinge = MODE_DATA[input.mode || ""]?.nouns || [];
    const ding = dinge.length ? dinge[Math.floor(Math.random() * dinge.length)] : "";
    fertig = applyPerspective([fertig], input.perspective, ctx.figur, ding).join(" ");
  } else if (input.perspective === "third") {
    fertig = pronominalize(fertig, ctx.figur, guessPronoun(ctx.figur));
  }
  pruefeAbgleich(fertig);
  return fertig;
}
function buildVersAtome(bank, input, model) {
  const figur = (personKopf(splitSpeakers(normWho(input.who || ""))[0] || "") || "Jemand").trim();
  const pool = buildPool(bank, input.perspective, input.what, figur, model, input.markovMode);
  const ctx = {
    ort: normWhere(input.where || "") || "an einem Ort",
    zeit: normWhen(input.when || "") || "zu einer Zeit",
    figur,
    verb: "will"
  };
  const raus = [];
  for (const a of pool) {
    const t = fuelleKontext(a.text, ctx);
    if (offeneSlots(t)) continue;
    if (a.typ === "kopf") continue;
    const rein = t.replace(/[.!?…:;]+$/, "").trim();
    if (rein.split(/\s+/).length >= 2) raus.push(rein);
  }
  return [...new Set(raus)];
}

// src/features/ressorts.ts
var S = (t) => ({ t });
var P = (t) => ({ t, pl: true });
var RESSORTS = {
  wirtschaft: {
    id: "wirtschaft",
    label: "Wirtschaft",
    rollenF: ["Gesch\xE4ftsf\xFChrerin", "Betriebsr\xE4tin", "Sprecherin", "Analystin", "Standortleiterin", "Ausbilderin"],
    rollenM: ["Gesch\xE4ftsf\xFChrer", "Betriebsratsvorsitzender", "Sprecher", "Analyst", "Betriebsrat", "Standortleiter", "Ausbilder"],
    betroffen: ["der Betrieb", "die Belegschaft", "die Zulieferer", "die Auftragsb\xFCcher", "der Standort", "die Ausbildungspl\xE4tze", "die Auszubildenden", "die Werkshalle", "die Fuhrparks", "die Schichtpl\xE4ne"],
    einheiten: [
      { einheit: "Besch\xE4ftigte", rolle: "betroffene", min: 40, max: 900, rund: 10, gen: "Besch\xE4ftigten" },
      { einheit: "Zulieferer", rolle: "betroffene", min: 12, max: 120, rund: 1 },
      { einheit: "Millionen Euro Umsatz", rolle: "geld", min: 2, max: 900, rund: 1 },
      { einheit: "Standorte", rolle: "vorgaenge", min: 2, max: 40, rund: 1 },
      { einheit: "Meter Kaimauer", rolle: "groesse", min: 40, max: 900, rund: 10 },
      { einheit: "Quadratmeter Hallenfl\xE4che", rolle: "groesse", min: 400, max: 24e3, rund: 100 }
    ],
    zusatz: { titel: "Marktreaktion", rahmen: ["Am Markt hei\xDFt es:", "In der Branche gilt:", "Beobachter verweisen auf:", "Aus der Belegschaft:", "Im Betriebsrat:", "Am Werkstor:"] },
    einsatz: [S("der Standort"), S("die Altersversorgung der Belegschaft"), P("die Ausbildungspl\xE4tze"), S("der Name des Hauses"), S("die Lieferkette"), S("das Werksgel\xE4nde"), S("die Tarifbindung"), S("der Standort selbst")],
    gewinn: [S("ein zweites Werk"), S("die Ausbildungsoffensive"), S("der Ausbau des Standorts"), S("die R\xFCckkehr der Auftr\xE4ge"), S("ein neuer Tarifvertrag"), S("eine zweite Schicht"), S("ein Ausbildungsverbund"), S("die \xDCbernahme der Auszubildenden")],
    ausblickGut: ["Ob die Zahlen halten, entscheidet sich im n\xE4chsten Quartal.", "Die ersten Einstellungen sind fuer den Herbst angek\xFCndigt.", "Die Auftr\xE4ge reichen bis ins n\xE4chste Jahr.", "Weitere Einstellungen sind vorgesehen."],
    ausblick: ["Ob die Zahlen halten, entscheidet sich im n\xE4chsten Quartal.", "Eine Entscheidung soll in den kommenden Tagen fallen.", "Die Verhandlungen sollen weitergehen.", "Ein Gutachten ist in Auftrag gegeben.", "Die Belegschaft wird kommende Woche informiert."],
    regel: "zweiZahlen"
  },
  politik: {
    id: "politik",
    label: "Politik",
    rollenF: ["Abgeordnete", "Fraktionssprecherin", "Staatssekret\xE4rin", "Fraktionsvorsitzende", "Amtsleiterin", "B\xFCrgermeisterin"],
    rollenM: ["Abgeordneter", "Fraktionssprecher", "Staatssekret\xE4r", "Fraktionsvorsitzender", "Amtsleiter", "B\xFCrgermeister"],
    betroffen: ["das Verfahren", "die Fraktionen", "die Kommunen", "der Zeitplan", "die Antragsteller", "die Aussch\xFCsse", "die Verwaltung", "die B\xFCrgersprechstunde", "die Haushaltsplanung", "das Ehrenamt"],
    einheiten: [
      { einheit: "Wahlberechtigte", rolle: "betroffene", min: 500, max: 9e4, rund: 100, gen: "Wahlberechtigten" },
      { einheit: "Kommunen", rolle: "betroffene", min: 12, max: 200, rund: 1 },
      { einheit: "Stimmen", rolle: "vorgaenge", min: 20, max: 700, rund: 1 },
      { einheit: "Sitzungen", rolle: "vorgaenge", min: 2, max: 60, rund: 1 },
      { einheit: "Sitze", rolle: "groesse", min: 5, max: 120, rund: 1 },
      { einheit: "Stimmbezirke", rolle: "groesse", min: 4, max: 90, rund: 1 }
    ],
    zusatz: { titel: "Reaktionen", rahmen: ["Aus der Regierung hei\xDFt es:", "Die Opposition h\xE4lt dagegen:", "Aus den L\xE4ndern kommt:", "Im Rathaus:", "Aus der Fraktion:", "In der Sitzung:"] },
    einsatz: [S("die Mehrheit"), S("der Zeitplan des Verfahrens"), S("das Vertrauen in die Zusage"), S("die Zust\xE4ndigkeit der Kommunen"), S("der Haushaltsansatz"), S("die Mehrheit im Rat"), S("der Haushalt"), P("die Fristen"), S("das Vertrauen in die Verwaltung")],
    gewinn: [S("eine breite Mehrheit"), S("die Zustimmung der L\xE4nder"), S("ein fr\xFCherer Beginn"), S("die Aufstockung der Mittel"), S("eine breitere Mehrheit"), S("ein zus\xE4tzlicher Ausschuss"), S("mehr Mittel im Haushalt")],
    ausblickGut: ["Der Beschluss soll in der n\xE4chsten Sitzung best\xE4tigt werden.", "Die Umsetzung beginnt im kommenden Jahr.", "Die Vorlage gilt als sicher.", "Weitere Mittel sind zugesagt."],
    ausblick: ["Der Verfahrensstand bleibt bis zur n\xE4chsten Sitzung unver\xE4ndert.", "Ob es zur Abstimmung kommt, ist offen.", "Die Abstimmung ist vertagt.", "Der Ausschuss tagt erneut.", "Eine Stellungnahme steht aus."],
    regel: "lagerAusgewogen"
  },
  kultur: {
    id: "kultur",
    label: "Kultur",
    rollenF: ["Intendantin", "Kuratorin", "Dramaturgin", "Kritikerin", "Werkstattleiterin", "Regisseurin"],
    rollenM: ["Intendant", "Kurator", "Dramaturg", "Kritiker", "Werkstattleiter", "Regisseur"],
    betroffen: ["das Ensemble", "der Spielplan", "die Abonnenten", "die Werkst\xE4tten", "die Nachwuchsarbeit", "die Technik", "die Statisterie", "die Requisite", "das Foyer", "die Bibliothek des Hauses"],
    einheiten: [
      { einheit: "Ensemblemitglieder", rolle: "betroffene", min: 12, max: 200, rund: 1 },
      { einheit: "Abonnenten", rolle: "betroffene", min: 50, max: 8e3, rund: 10 },
      { einheit: "Vorstellungen", rolle: "vorgaenge", min: 3, max: 200, rund: 1 },
      { einheit: "Minuten Spieldauer", rolle: "dauer", min: 45, max: 240, rund: 5 },
      { einheit: "Sitzpl\xE4tze", rolle: "groesse", min: 90, max: 1400, rund: 10 },
      { einheit: "Exponate", rolle: "groesse", min: 12, max: 600, rund: 2 }
    ],
    zusatz: { titel: "Zum Werk", rahmen: ["Zu sehen ist:", "Die Arbeit zeigt:", "Auf der B\xFChne steht:", "Aus dem Ensemble:", "An der Kasse:", "In der Probe:"] },
    einsatz: [S("der Spielplan der kommenden Saison"), S("das Ensemble in seiner jetzigen Form"), P("die Werkst\xE4tten"), S("das Haus als Ort"), S("die Nachwuchsarbeit"), S("die Urauff\xFChrung"), S("der Spielplan"), P("die Gastspiele"), S("das Ensemble selbst")],
    gewinn: [S("eine zweite Spielst\xE4tte"), S("die \xDCbernahme ins Repertoire"), S("ein eigenes Nachwuchsstudio"), S("die Verlaengerung der Reihe"), P("neue Abonnements"), S("ein Gastspiel im Ausland")],
    ausblickGut: ["Die n\xE4chste Auff\xFChrung ist angek\xFCndigt.", "Weitere Termine sollen folgen.", "Die Vorstellung wird verl\xE4ngert.", "Weitere Termine kommen dazu."],
    ausblick: ["Ob das Publikum folgt, wird sich zeigen.", "Die n\xE4chste Auff\xFChrung ist angek\xFCndigt.", "Die Premiere bleibt geplant.", "Die Proben werden fortgesetzt.", "\xDCber den Spielplan wird neu beraten."],
    regel: "wertungGetrennt"
  },
  sport: {
    id: "sport",
    label: "Sport",
    rollenF: ["Trainerin", "Kapit\xE4nin", "Sportdirektorin", "Torh\xFCterin", "Abteilungsleiterin"],
    rollenM: ["Trainer", "Kapit\xE4n", "Sportdirektor", "Torh\xFCter", "Abteilungsleiter"],
    betroffen: ["der Verein", "die Fans", "das Marketing", "das Logo", "die Mannschaft", "der Nachwuchs", "die Sponsoren", "die Dauerkarten", "die Jugendabteilung", "die Dauerkartenbesitzer", "der Trainingsbetrieb", "die Gesch\xE4ftsstelle", "der Fanclub"],
    einheiten: [
      { einheit: "Vereinsmitglieder", rolle: "betroffene", min: 50, max: 4e4, rund: 10 },
      { einheit: "Dauerkarten", rolle: "betroffene", min: 100, max: 3e4, rund: 100 },
      { einheit: "Zuschauer", rolle: "betroffene", min: 200, max: 6e4, rund: 100 },
      { einheit: "Minuten", rolle: "dauer", min: 5, max: 120, rund: 1 },
      { einheit: "Punkte", rolle: "groesse", min: 3, max: 60, rund: 1 },
      { einheit: "Meter Laufbahn", rolle: "groesse", min: 100, max: 800, rund: 50 }
    ],
    zusatz: { titel: "Spielverlauf", rahmen: ["Nach der Pause:", "In der Schlussphase:", "Zur Halbzeit:", "In der Kabine:", "Auf der Trib\xFCne:", "In der Gesch\xE4ftsstelle:"] },
    einsatz: [S("der Klassenerhalt"), S("die Lizenz"), S("die Nachwuchsabteilung"), S("der Name des Vereins"), S("die Heimspielst\xE4tte"), S("das Traineramt"), S("der Aufstieg"), P("die Heimspiele"), S("der Trainingsbetrieb")],
    gewinn: [S("der Aufstieg"), S("ein neuer Hauptsponsor"), S("der Ausbau der Jugendabteilung"), S("die R\xFCckkehr in die Halle"), S("ein neuer Trainingsplatz"), P("zus\xE4tzliche Heimspiele"), S("die R\xFCckkehr der Zuschauer")],
    ausblickGut: ["Das R\xFCckspiel steht noch aus.", "Die Vorbereitung beginnt im Sommer.", "Die Serie soll fortgesetzt werden.", "Weitere Zusagen liegen vor."],
    ausblick: ["Das R\xFCckspiel steht noch aus.", "Ob die Serie h\xE4lt, entscheidet sich am Wochenende.", "Das n\xE4chste Spiel entscheidet.", "Der Verband pr\xFCft den Vorgang.", "Eine Entscheidung f\xE4llt nach der Saison."],
    regel: "ergebnisZuerst"
  },
  wissenschaft: {
    id: "wissenschaft",
    label: "Wissenschaft",
    rollenF: ["Studienleiterin", "Professorin", "Erstautorin", "Gutachterin", "Institutsleiterin", "Doktorandin", "Laborleiterin"],
    rollenM: ["Studienleiter", "Professor", "Erstautor", "Gutachter", "Institutsleiter", "Doktorand", "Laborleiter"],
    betroffen: ["die Studie", "die Arbeitsgruppe", "die F\xF6rderung", "die Ver\xF6ffentlichung", "die Datenbasis", "die Messreihen", "die Drittmittel", "die Doktoranden", "das Labor", "die Sammlung"],
    einheiten: [
      { einheit: "Teilnehmende", rolle: "betroffene", min: 12, max: 4e3, rund: 1, gen: "Teilnehmenden" },
      { einheit: "Institute", rolle: "betroffene", min: 12, max: 40, rund: 1 },
      { einheit: "Proben", rolle: "vorgaenge", min: 12, max: 4e3, rund: 1 },
      { einheit: "Monate Laufzeit", rolle: "dauer", min: 3, max: 96, rund: 1 },
      { einheit: "Messreihen", rolle: "groesse", min: 6, max: 220, rund: 2 },
      { einheit: "Datens\xE4tze", rolle: "groesse", min: 40, max: 9e3, rund: 10 }
    ],
    zusatz: { titel: "Methode", rahmen: ["Untersucht wurde:", "Erhoben wurden:", "Verglichen wurde:", "Im Labor:", "Aus der Arbeitsgruppe:", "Am Rande der Tagung:"] },
    einsatz: [S("die F\xF6rderung"), S("die Vergleichbarkeit der Daten"), S("die Ver\xF6ffentlichung"), S("der Standort des Instituts"), S("die Fortsetzung der Reihe"), S("die F\xF6rderzusage"), S("die Messreihe"), P("die Nachwuchsstellen"), S("der Zugang zur Sammlung")],
    gewinn: [S("eine Anschlussfoerderung"), S("ein zweiter Standort"), S("die Aufnahme in das Programm"), S("ein gemeinsames Labor"), S("eine zweite F\xF6rderperiode"), P("neue Messpl\xE4tze")],
    ausblickGut: ["Eine Wiederholung der Studie ist geplant.", "Die Ergebnisse sollen offen zug\xE4nglich werden.", "Die F\xF6rderung ist verl\xE4ngert.", "Weitere H\xE4user beteiligen sich."],
    ausblick: ["Eine Wiederholung der Studie steht aus.", "Ob sich der Befund best\xE4tigt, ist offen.", "Die Auswertung dauert an.", "Die Ergebnisse sollen gepr\xFCft werden.", "Eine Wiederholung des Versuchs ist geplant."],
    regel: "einschraenkungPflicht"
  },
  gesellschaft: {
    id: "gesellschaft",
    label: "Gesellschaft",
    rollenF: ["Sozialarbeiterin", "Anwohnerin", "Vereinsvorsitzende", "Beraterin", "Quartiersmanagerin", "Ehrenamtskoordinatorin", "Gemeindereferentin"],
    rollenM: ["Sozialarbeiter", "Anwohner", "Vereinsvorsitzender", "Berater", "Quartiersmanager", "Ehrenamtskoordinator", "Gemeindereferent"],
    betroffen: ["die Nachbarschaft", "die Familien", "das Ehrenamt", "die Beratungsstelle", "der Treffpunkt", "der Sportverein", "die Kirchengemeinde", "die Kita", "die Tafel", "die Nachbarschaftshilfe", "der Schrebergarten", "die Freiwillige Feuerwehr"],
    einheiten: [
      { einheit: "Haushalte", rolle: "betroffene", min: 20, max: 4e3, rund: 10 },
      { einheit: "Familien", rolle: "betroffene", min: 12, max: 2e3, rund: 10 },
      { einheit: "Haushalte", rolle: "betroffene", min: 20, max: 4e3, rund: 10 },
      { einheit: "Beratungen", rolle: "vorgaenge", min: 10, max: 900, rund: 1 },
      { einheit: "Quadratmeter Nutzfl\xE4che", rolle: "groesse", min: 60, max: 3e3, rund: 10 },
      { einheit: "Pl\xE4tze", rolle: "groesse", min: 8, max: 300, rund: 2 }
    ],
    zusatz: { titel: "Vor Ort", rahmen: ["Im Viertel hei\xDFt es:", "Nachbarn berichten:", "In der Beratungsstelle:", "Am Tresen:", "Im Gemeindehaus:", "Auf dem Wochenmarkt:"] },
    einsatz: [S("der Treffpunkt im Viertel"), S("die Beratung vor Ort"), S("das Ehrenamt"), S("die Mietbindung"), S("der Zusammenhalt in der Nachbarschaft"), S("die Nachbarschaftshilfe"), P("die \xD6ffnungszeiten"), S("das Gemeindehaus"), S("die Tafel")],
    gewinn: [S("ein neuer Treffpunkt"), S("die Verstetigung der Beratung"), S("mehr Pl\xE4tze im Ehrenamt"), S("ein Nachbarschaftsfonds"), S("ein zweiter Treffpunkt"), P("l\xE4ngere \xD6ffnungszeiten"), S("eine feste Stelle in der Beratung")],
    ausblickGut: ["Das Angebot soll im Fr\xFChjahr starten.", "Weitere H\xE4user haben Interesse angemeldet.", "Die \xD6ffnungszeiten werden ausgeweitet.", "Weitere Freiwillige haben sich gemeldet."],
    ausblick: ["Wie es im Viertel weitergeht, ist offen.", "Eine Entscheidung soll in den kommenden Wochen fallen.", "Der Verein sucht weiter Freiwillige.", "Ein Treffen ist f\xFCr den Herbst angesetzt.", "Die Stadt pr\xFCft eine F\xF6rderung."],
    regel: "keine"
  },
  gesundheit: {
    id: "gesundheit",
    label: "Gesundheit",
    rollenF: ["\xC4rztliche Direktorin", "Pflegedienstleiterin", "Amts\xE4rztin", "Epidemiologin", "Chef\xE4rztin", "Apothekerin"],
    rollenM: ["\xC4rztlicher Direktor", "Pflegedienstleiter", "Amtsarzt", "Epidemiologe", "Chefarzt", "Apotheker"],
    betroffen: ["die Versorgung", "die Pflegekr\xE4fte", "die Notaufnahme", "die Wartezeiten", "die Angeh\xF6rigen", "der Bereitschaftsdienst", "die Apotheken", "die Hausarztpraxen", "der Krankentransport", "die Physiotherapie"],
    einheiten: [
      { einheit: "Patientinnen und Patienten", rolle: "betroffene", min: 30, max: 9e3, rund: 10 },
      { einheit: "Pflegekr\xE4fte", rolle: "betroffene", min: 12, max: 900, rund: 1 },
      { einheit: "Betten", rolle: "groesse", min: 20, max: 1200, rund: 10 },
      { einheit: "Behandlungen", rolle: "vorgaenge", min: 30, max: 9e3, rund: 10 }
    ],
    zusatz: { titel: "Einordnung der Lage", rahmen: ["Aus der Klinik hei\xDFt es:", "Die Beh\xF6rde teilt mit:", "In der Versorgung zeigt sich:", "Auf der Station:", "In der Pflege:", "Am Empfang:"] },
    einsatz: [S("die Versorgung im Umkreis"), S("die Notaufnahme"), P("die Ausbildungspl\xE4tze in der Pflege"), P("die Wartezeiten"), S("der Standort der Klinik"), P("die Betten"), S("der Bereitschaftsdienst"), S("die Versorgung im Umland")],
    gewinn: [S("eine zusaetzliche Station"), S("k\xFCrzere Wartezeiten"), S("mehr Ausbildungspl\xE4tze in der Pflege"), S("ein zweiter Rettungswagen"), S("eine zus\xE4tzliche Station"), P("mehr Betten")],
    ausblickGut: ["Die Station soll im Herbst \xF6ffnen.", "Die Versorgung im Umkreis wird neu geordnet.", "Die Station soll erweitert werden.", "Weitere Kr\xE4fte sind eingestellt."],
    ausblick: ["Wie sich die Lage entwickelt, bleibt abzuwarten.", "Eine Neubewertung ist f\xFCr die kommende Woche angek\xFCndigt.", "Die Aufsicht pr\xFCft den Vorgang.", "Eine \xDCbergangsl\xF6sung wird gesucht.", "Der Betrieb l\xE4uft eingeschr\xE4nkt weiter."],
    // Bewusst keine Sonderregel mit Zahlenpflicht: Gesundheitsberichte, die
    // Zahlen erzwingen, erfinden welche. Lieber weniger und richtig.
    regel: "keine"
  },
  bildung: {
    id: "bildung",
    label: "Bildung",
    rollenF: ["Schulleiterin", "Elternsprecherin", "Lehrerin", "Bildungsforscherin", "Fachlehrerin"],
    rollenM: ["Schulleiter", "Elternsprecher", "Lehrer", "Bildungsforscher", "Fachlehrer"],
    betroffen: ["der Unterricht", "die Elternh\xE4user", "das Kollegium", "der Stundenplan", "die Abschlussjahrg\xE4nge", "die Elternvertretung", "die Ganztagsbetreuung", "die Werkr\xE4ume", "die Schulbusse", "die Mensa"],
    einheiten: [
      { einheit: "Sch\xFClerinnen und Sch\xFCler", rolle: "betroffene", min: 30, max: 2e3, rund: 10 },
      { einheit: "Lehrkr\xE4fte", rolle: "betroffene", min: 12, max: 200, rund: 1 },
      { einheit: "Sch\xFClerinnen und Sch\xFCler", rolle: "betroffene", min: 30, max: 2e3, rund: 10 },
      { einheit: "Unterrichtsstunden", rolle: "dauer", min: 4, max: 400, rund: 2 },
      { einheit: "Klassenr\xE4ume", rolle: "groesse", min: 3, max: 60, rund: 1 },
      { einheit: "Wochenstunden", rolle: "groesse", min: 4, max: 40, rund: 1 }
    ],
    zusatz: { titel: "An der Schule", rahmen: ["Im Kollegium hei\xDFt es:", "Aus der Elternschaft:", "Im Unterricht zeigt sich:", "Im Lehrerzimmer:", "Auf dem Schulhof:", "In der Elternversammlung:"] },
    einsatz: [S("der Ganztag"), S("das Abschlussjahr"), P("die Stellen im Kollegium"), S("der Schulstandort"), S("die Betreuung am Nachmittag"), P("die Werkr\xE4ume"), S("die Schulbusverbindung"), S("das Kollegium")],
    gewinn: [S("zus\xE4tzliche Klassen"), S("der Ausbau des Ganztags"), S("zusaetzliche Stellen im Kollegium"), S("eine eigene Werkstatt"), S("eine zus\xE4tzliche Klasse"), P("neue Werkr\xE4ume"), S("eine zweite Schulbuslinie")],
    ausblickGut: ["Der Start ist fuer das kommende Schuljahr geplant.", "Die Stellen sollen zum Halbjahr besetzt werden.", "Die Klasse wird eingerichtet.", "Weitere Stellen sind besetzt."],
    ausblick: ["Ob die Stunden ersetzt werden, ist offen.", "Das n\xE4chste Schuljahr soll Klarheit bringen.", "Das Schulamt pr\xFCft den Fall.", "Die Elternversammlung tagt kommende Woche.", "Eine L\xF6sung soll bis zum Halbjahr stehen."],
    regel: "keine"
  },
  wetter: {
    id: "wetter",
    label: "Wetter",
    rollenF: ["Meteorologin", "Wetterdienst-Sprecherin", "Einsatzleiterin", "Deichvorsteherin", "Deichgr\xE4fin"],
    rollenM: ["Meteorologe", "Wetterdienst-Sprecher", "Einsatzleiter", "Deichvorsteher", "Deichgraf"],
    einheiten: [
      { einheit: "Gemeinden", rolle: "betroffene", min: 12, max: 400, rund: 2 },
      { einheit: "H\xF6fe", rolle: "betroffene", min: 12, max: 800, rund: 2 },
      { einheit: "Liter je Quadratmeter", rolle: "groesse", min: 14, max: 180, rund: 2, label: "Niederschlag" },
      { einheit: "Stundenkilometer", rolle: "groesse", min: 60, max: 200, rund: 5, label: "Spitzenb\xF6e" },
      { einheit: "Zentimeter Neuschnee", rolle: "groesse", min: 12, max: 90, rund: 2, label: "Neuschnee" },
      { einheit: "Eins\xE4tze", rolle: "vorgaenge", min: 20, max: 900, rund: 2, label: "Eins\xE4tze" },
      { einheit: "Stunden Dauerregen", rolle: "dauer", min: 4, max: 60, rund: 2, label: "Dauerregen" }
    ],
    betroffen: ["die K\xFCste", "der Deich", "die Ernte", "der Bahnverkehr", "die Schulen", "die Feuerwehr", "die F\xE4hren", "die Deichverb\xE4nde", "der F\xE4hrbetrieb", "die Obstbauern", "die Feuerwehren", "der Schienenverkehr", "die Campingpl\xE4tze"],
    einsatz: [S("die Ernte"), S("der Deich"), S("der Bahnverkehr"), S("die Trinkwasserversorgung"), S("die F\xE4hrverbindung"), P("die F\xE4hrverbindungen"), S("die Stromversorgung"), S("der K\xFCstenschutz"), S("die Obsternte")],
    gewinn: [S("eine trockene Erntewoche"), S("die R\xFCckkehr des Grundwassers"), S("ein mildes Wochenende"), S("die Entwarnung f\xFCr die K\xFCste"), S("eine Entspannung der Lage"), P("wieder befahrbare Stra\xDFen"), S("die R\xFCckkehr des F\xE4hrbetriebs")],
    // Titel leer: Der Rahmen („Für morgen gilt:") trägt die Ansage selbst.
    // Mit Titel stand „Aussichten: Für morgen gilt: …" im Blatt — zwei
    // Doppelpunkte, eine Ansage.
    zusatz: { titel: "", rahmen: ["F\xFCr morgen gilt:", "Zum Wochenende:", "In der Nacht:", "Am Deich:", "Im Hafen:", "Auf den Feldern:"] },
    hintergrundKopf: (_wer, jahr) => `Vergleichbare Lagen gab es zuletzt ${jahr}.`,
    ausblickGut: ["Die Warnung wird zum Abend aufgehoben.", "Das Hoch soll sich bis zur Wochenmitte halten.", "Die Warnung wurde aufgehoben.", "Der Betrieb l\xE4uft wieder an.", "Zum Wochenende soll es trocken bleiben.", "Die Pegel fallen wieder."],
    ausblick: ["Die Warnstufe bleibt vorerst bestehen.", "Wie lange die Lage anh\xE4lt, ist offen.", "Der Warndienst bleibt bestehen.", "Die Lage wird st\xFCndlich neu bewertet.", "Eine Entwarnung steht aus.", "Die Einsatzkr\xE4fte bleiben in Bereitschaft.", "Die Pegel werden weiter beobachtet.", "F\xFCr die Nacht gilt die Warnung weiter."],
    // Das Wetter-Gerüst (4.324.0): eigene Ereignisse und eigene Sätze statt
    // des Verwaltungsdeutschs der Vorgabe. Gemessen vorher: „die erste
    // Beschwerde" u. ä. und „folgte der Schritt, über den … informiert" in
    // 108 von 108 Läufen, je EINE Fassung für Vorspann-Zweitsatz und
    // Schritt-Satz.
    vorgeschichte: {
      sachlich: ["die erste Warnung", "die erste Unwetterwarnung", "der erste Starkregen", "die erste B\xF6enfront", "der erste Pegelanstieg", "das erste Donnergrollen"],
      gut: ["die erste Aufheiterung", "die erste Entwarnung", "das erste Zwischenhoch", "die erste trockene Stunde", "der erste Sonnenstreifen"],
      anfang: "die vergleichbare Lage"
    },
    schrittFassungen: (zeit, gut) => gut ? [
      `${zeit} kam die erste Entwarnung.`,
      `${zeit} wurden die ersten Sperrungen aufgehoben.`,
      `${zeit} entspannte sich die Lage.`,
      `${zeit} liefen die ersten F\xE4hren wieder aus.`
    ] : [
      `${zeit} wurde die Warnung ausgeweitet.`,
      `${zeit} kam die n\xE4chste Warnstufe.`,
      `${zeit} liefen die ersten Eins\xE4tze an.`,
      `${zeit} meldeten die Pegel den n\xE4chsten Anstieg.`,
      `${zeit} r\xFCckten die ersten Wehren aus.`
    ],
    vorspannFassungen: (menge, gut) => gut ? [
      `Bekannt wurde, dass ${menge} hinzukommen.`,
      `Nach ersten Meldungen kommen ${menge} hinzu.`,
      `Erste Meldungen sprechen von ${menge}.`
    ] : [
      `Bekannt wurde, dass ${menge} betroffen sind.`,
      `Nach ersten Meldungen sind ${menge} betroffen.`,
      `Erste Meldungen sprechen von ${menge}.`,
      `Der Wetterdienst meldet ${menge} als betroffen.`
    ],
    nurEigenerAusblick: true,
    // Keine Sonderregel: Ein Wetterbericht, der Zahlen erzwingt, erfindet
    // Messwerte - und ein erfundener Messwert ist schlimmer als keiner.
    regel: "keine"
  }
};
var RESSORT_IDS = Object.keys(RESSORTS);
var SPUR = [
  // Die Wetter-Spur war in beide Richtungen undicht (gemeldet: „Wind und
  // Sturm und Regen sind keine Auslöser"). Gemessen vorher: „Wind", „Böen",
  // „es stürmt und regnet", „Blitz und Donner", „Wolkenbruch", „Trockenheit"
  // fielen alle durch (9 von 15 Wetterfällen) — „wind" stand gar nicht in der
  // Liste, und die Stämme treffen keine Verbformen (stürmt hat einen Umlaut,
  // regnet kein „e"). Umgekehrt fraß „hoch|tief" mit \w* jeden Wortanfang:
  // „Hochschule", „Tiefgarage", „Hochhaus", „hochwertig" wurden Wetter
  // (4 von 7 Gegenproben). Jetzt: Verbformen ausdrücklich, Komposita nur wo
  // sie eindeutig sind, Druckgebiete nur mit Artikel oder als „…druck", und
  // Fallen wie Donnerstag, Blitzumfrage, Wolkenkratzer, Regeneration und
  // Ansturm ausgenommen.
  ["wetter", new RegExp("\\b(" + [
    "\\w*wetter\\w*",
    "sturm\\w*",
    "st\xFCrm\\w*",
    "orkan\\w*",
    "regen(?!erier|erat)\\w*",
    "regn\\w*",
    "(dauer|stark|platz|eis|niesel|land)regen\\w*",
    "schnee\\w*",
    "schneit\\w*",
    "hitze\\w*",
    "frost\\w*",
    "gewitter\\w*",
    "hochwasser\\w*",
    "d\xFCrre\\w*",
    "trockenheit\\w*",
    "unwetter\\w*",
    "hagel\\w*",
    "nebel\\w*",
    "glatteis\\w*",
    "gl\xE4tte\\b",
    "b\xF6e\\w*",
    "wind(e|es)?\\b",
    "windig\\w*",
    "windb\xF6en\\w*",
    "windst\xE4rke\\w*",
    "(nord|s\xFCd|ost|west|herbst|winter|fr\xFChlings?|sommer|land|see|h\xF6hen|fall|schnee|eis)wind\\w*",
    "blitz(e|es|en)?\\b",
    "blitzt\\w*",
    "blitzeis\\w*",
    "blitzschlag\\w*",
    "donner(?!stag)\\w*",
    "wolke(?!nkratzer)\\w*",
    "bew\xF6lkt\\w*",
    "niederschlag\\w*",
    "graupel\\w*",
    "lawine\\w*",
    "flut\\b",
    "flutwelle\\w*",
    "springflut\\w*",
    "pegel\\w*",
    "k\xE4lte\\w*",
    "friert\\b",
    "gefriert\\b",
    "taut\\b",
    "(hoch|tief)druck\\w*",
    "(das|ein|dem|vom) (hoch|tief)\\b",
    "warnstufe\\w*",
    "deich\\w*",
    "\xFCberschwemmung\\w*",
    "temperatur\\w*",
    "sonnenschein\\w*",
    "hitzewelle\\w*"
  ].join("|") + ")", "i")],
  ["sport", /\b(spielt|spielen|spiel|tor|tore|mannschaft|trainer|trainiert|liga|stadion|wettkampf|sieg|niederlage|halbzeit|verein|klub|club|fc|sv|tsv|bvb|meisterschaft|turnier|pokal|elf|kader|transfer|saison)\w*/i],
  ["kultur", /\b(bühne|theater|roman|gedicht|ausstellung|museum|konzert|oper|film|publikum|werk)\w*/i],
  ["politik", /\b(regierung|partei|fraktion|gesetz|wahl|parlament|abstimmung|minister|verfahren)\w*/i],
  ["wissenschaft", /\b(studie|forschung|labor|messung|befund|experiment|hypothese|probe|institut)\w*/i],
  ["gesundheit", /\b(klinik|krankenhaus|arzt|ärztin|pflege|patient|diagnose|behandlung|seuche|impf)\w*/i],
  ["bildung", /\b(schule|unterricht|klasse|lehrer|lehrerin|prüfung|schüler|universität|studium)\w*/i],
  ["wirtschaft", /\b(werft|betrieb|firma|unternehmen|konzern|gmbh|ag|holding|umsatz|markt|produktion|belegschaft|insolvenz|werk|fabrik|filiale|standort|schliessen|schließt|schließen)\w*/i]
];
function rateRessort(text) {
  for (const [id, re] of SPUR) if (re.test(text)) return id;
  return "gesellschaft";
}

// src/features/faktenblatt.ts
var WER_ERSATZ = "eine Einrichtung";
var VORNAME_F = ["Henrike", "Marlene", "Judith", "Silke", "Annegret", "Ute", "Carla", "Ines", "Britta", "Almut"];
var VORNAME_M = ["Tobias", "Reinhard", "Jonas", "Ulrich", "Malte", "Gerd", "Sven", "Konrad", "Bernd", "Ole"];
var ALLE_NAMEN = [];
var NACHNAME = [
  "Reimers",
  "Rehm",
  "Klasen",
  "Vogt",
  "Siewert",
  "Brandes",
  "Lohmann",
  "Petersen",
  "Kruse",
  "Harmsen",
  "Overbeck",
  "Thiessen",
  "Rademacher",
  "Wendt",
  "M\xF6ller",
  "Sander"
];
ALLE_NAMEN.push(...VORNAME_F, ...VORNAME_M, ...NACHNAME);
var ROLLE_F = ["Gesch\xE4ftsf\xFChrerin", "Sprecherin", "Betriebsr\xE4tin", "Anwohnerin", "Gutachterin", "Vorsitzende"];
var ROLLE_M = ["Gesch\xE4ftsf\xFChrer", "Sprecher", "Betriebsratsvorsitzender", "Anwohner", "Gutachter", "Vorsitzender"];
var EINHEIT = [
  { einheit: "Besch\xE4ftigte", rolle: "betroffene", min: 40, max: 900, rund: 10, gen: "Besch\xE4ftigten" },
  { einheit: "Haushalte", rolle: "betroffene", min: 20, max: 1200, rund: 10 },
  { einheit: "Anwohner", rolle: "betroffene", min: 30, max: 2e3, rund: 10 },
  { einheit: "Arbeitspl\xE4tze", rolle: "betroffene", min: 15, max: 700, rund: 5 },
  { einheit: "Stunden", rolle: "dauer", min: 2, max: 72, rund: 1 },
  { einheit: "Tage", rolle: "dauer", min: 2, max: 40, rund: 1 },
  // KEINE allgemeine Größe mehr. „Ausdehnung: 278 Meter" stand in etwa jedem
  // zweiten Bericht von sieben der neun Ressorts und sagte nirgends etwas: Ein
  // Bildungsbericht hat keine Meter. Jedes Ressort führt jetzt seine eigene
  // Größe (Sitzplätze, Klassenräume, Stimmbezirke, Messreihen …), und die
  // allgemeine Liste muss nicht mehr einspringen.
  //
  // Wo eine Länge wirklich passt, steht sie beim Ressort selbst: „Meter
  // Kaimauer" bei der Wirtschaft, „Meter Laufbahn" beim Sport.
  { einheit: "Unterschriften", rolle: "vorgaenge", min: 200, max: 9e3, rund: 50 },
  { einheit: "Antr\xE4ge", rolle: "vorgaenge", min: 12, max: 600, rund: 1 },
  { einheit: "Beschwerden", rolle: "vorgaenge", min: 5, max: 400, rund: 1 },
  { einheit: "Millionen Euro", rolle: "geld", min: 2, max: 90, rund: 1 }
];
var ROLLE_LABEL = {
  betroffene: "Betroffen",
  sache: "Gegenstand",
  dauer: "Dauer",
  groesse: "Ausdehnung",
  vorgaenge: "Vorg\xE4nge",
  geld: "Volumen"
};
var VORGESCHICHTE_ZEIT = [
  "im Fr\xFChjahr",
  "im vergangenen Herbst",
  "im Sommer davor",
  "vor zwei Jahren",
  "im Winter zuvor",
  "vor einigen Monaten",
  "im Jahr davor",
  "kurz nach der Wende"
];
var VORGESCHICHTE_SACHLICH = [
  "die erste Meldung",
  "der erste Hinweis",
  "die erste Beschwerde",
  "die erste Anfrage",
  "der erste Zweifel",
  "das erste Ger\xFCcht"
];
var VORGESCHICHTE_GUT = [
  "die erste Zusage",
  "das erste Angebot",
  "die erste Anfrage",
  "der erste Zuspruch",
  "die erste Unterst\xFCtzung",
  "das erste Interesse"
];
var ZEITPUNKT = [
  "am vergangenen Donnerstag",
  "am Montagabend",
  "in der Nacht zum Sonntag",
  "am fr\xFChen Morgen",
  "gegen Mittag",
  "am Dienstag"
];
var RELATIV = ["vor vier Tagen", "vor einer Woche", "seit dem Wochenende", "am Vortag", "vor drei Tagen"];
function rundWort(wert) {
  const stufe = wert >= 1e3 ? 100 : wert >= 100 ? 10 : 0;
  if (!stufe) return void 0;
  const gerundet = Math.round(wert / stufe) * stufe;
  return gerundet === wert ? void 0 : `rund ${zahlwort(gerundet)}`;
}
var PLURAL_ENDUNG = /(ern|en)$/;
var EN_SINGULAR = /(regen|wagen|boden|garten|kuchen|schatten|rücken|bogen|laden|ofen|hafen|haken|balken|besen|faden|knochen|kragen|magen|nacken|namen|rasen|riemen|samen|schaden|segen|braten|graben|husten|karren|kolben|zeichen|wesen|leben|essen|wappen|becken|kissen|eisen|zeugen|glauben|willen|frieden|gedanken|kummer)$/i;
var KEIN_SACHNOMEN = /^(Jahr|Jahre|Monat|Monate|Tag|Tage|Woche|Wochen|Stunde|Stunden|Mal|Uhr|Zeit|Welt|Leben|Anfang|Nacht|Morgen|Abend|Ende|Reihe|Farbe|Sprache|Straße|Grenze|Klasse|Frage|Stelle|Weise|Seite|Liebe|Sorge|Ruhe|Stille|Ferne|Nähe|Fenster|Wasser|Feuer|Zimmer|Wetter|Messer|Muster|Ufer|Alter|Fieber|Wunder|Zeichen|Wesen)$/;
function sachNomen(was) {
  const woerter2 = (was || "").split(/\s+/);
  for (let i = 0; i < woerter2.length; i++) {
    const w = (woerter2[i] || "").replace(/[^A-Za-zÄÖÜäöüß-]/g, "");
    if (!/^[A-ZÄÖÜ][a-zäöüß]{3,}$/.test(w)) continue;
    if (KEIN_SACHNOMEN.test(w)) continue;
    if (!PLURAL_ENDUNG.test(w)) continue;
    if (EN_SINGULAR.test(w)) continue;
    const zwei = (woerter2[i - 2] || "").toLowerCase().replace(/[^a-zäöüß]/g, "");
    const davor = (woerter2[i - 1] || "").toLowerCase().replace(/[^a-zäöüß]/g, "");
    if (/^(der|des|dem|den|das|ein|eine|einen|einem|einer|eines|jeder|jede|jedes|dieser|diese|dieses|diesem|diesen)$/.test(davor)) continue;
    const PRAEP = /^(mit|bei|seit|von|zu|aus|nach|vor|in|an|auf|über|unter|neben|zwischen|hinter|durch|gegen|ohne|um|für)$/;
    if (PRAEP.test(davor) || PRAEP.test(zwei)) continue;
    return w;
  }
  return null;
}
function zahlIn(min, max, rund) {
  const roh = min + Math.random() * (max - min);
  const n = Math.max(min, Math.round(roh / rund) * rund);
  return n % 2 === 0 ? n : n + 1;
}
function zahlwort(n) {
  return Math.round(n).toLocaleString("de-DE");
}
function genusVon(phrase) {
  const art = (phrase.match(/^(der|die|das)\s/i) || [])[1]?.toLowerCase();
  if (art === "die") return "fem";
  if (art === "das") return "neut";
  if (art === "der") return "mask";
  const ohneArt = phrase.replace(/^(der|die|das|ein|eine|einen)\s+/i, "");
  const grosse = ohneArt.match(/[A-ZÄÖÜ][a-zäöüß-]{2,}/g) || [];
  const letzt = grosse[grosse.length - 1] || "";
  const kern = letzt.includes("-") ? letzt.split("-").pop() : letzt;
  const g = kern ? guessGender(kern) : void 0;
  return g === "f" ? "fem" : g === "n" ? "neut" : "mask";
}
var RECHTSFORM = /^(Ltd|GmbH|AG|KG|SE|Inc|LLC|mbH|OHG|gGmbH|e\.?V\.?|Co|KGaA)$/i;
function kurzform(haupt, genus) {
  const art = genus === "fem" ? "die" : genus === "neut" ? "das" : "der";
  let woerter2 = haupt.replace(/^(der|die|das|ein|eine|einen)\s+/i, "").split(/\s+/);
  while (woerter2.length > 1 && RECHTSFORM.test(woerter2[woerter2.length - 1].replace(/[^A-Za-z.]/g, ""))) woerter2.pop();
  const letzt = woerter2[woerter2.length - 1] || haupt;
  const teil = letzt.includes("-") ? letzt.split("-").pop() : letzt;
  return `${art} ${teil}`;
}
var TITEL = /^(Dr|Prof|Ing|Dipl|Mag|Med|Rer|Nat|Phil|h\.c|Jun|Sen|MdB|MdL)\.?$/i;
function formeWas(roh) {
  let w = (roh || "").replace(/\u00ad/g, "").replace(/\u200b/g, "").replace(/\([^()]*\)/g, " ").replace(/\[[^\]]*\]/g, " ").replace(/\s+/g, " ").trim();
  const ende = w.match(/^([\s\S]{10,}?[.!?…])\s+[A-ZÄÖÜ]/);
  if (ende && !/(?:\d|\b(?:Dr|Prof|Ing|Dipl|Nr|St|ca|bzw|usw|evtl|Abs|Art|Jh|Mio|Mrd|Bd|Hrsg|geb|gest|verh|u|z|B))\.$/.test(ende[1])) {
    w = ende[1];
  }
  const semi = w.indexOf(";");
  if (semi > 12) w = w.slice(0, semi);
  w = w.replace(/[\s,;:–—-]+$/, "").replace(/[.!?…]+$/, "").trim();
  return kuerzeAmBruch(w);
}
function kurzPerson(werRoh) {
  const w = (werRoh || "").trim().split(/\s+/).filter(Boolean).filter((x) => !/^(Dr\.|Prof\.|Ing\.|Dipl\.-?\w*\.?|med\.|jur\.|rer\.|nat\.|h\.c\.|Sir|Lady|Herr|Frau)$/i.test(x));
  if (!w.length) return werRoh;
  const hatBegleiter = /^(der|die|das|den|dem|des|ein|eine|einen|einem|einer|eines|mein|meine|sein|seine|ihr|ihre|unser|unsere|kein|keine|jeder|jede|jedes|dieser|diese|dieses)$/i.test(w[0]);
  const letztes = w[w.length - 1];
  if (hatBegleiter || w.length > 3 || !/^[A-ZÄÖÜ]/.test(letztes)) return werRoh.trim();
  return letztes;
}
function dachOrt(roh) {
  let o = (roh || "").trim();
  o = o.replace(/^(hoch|tief|weit|mitten|ganz|dicht|nahe|irgendwo|weit draußen|draußen|drinnen|oben|unten|dort|hier)\s+/i, "");
  o = o.replace(/^(in|an|auf|bei|im|am|vor|über|unter|zu|zur|zum)\s+/i, "").replace(/^(der|die|das|dem|den|des|ein|eine|einen|einem|einer|eines)\s+/i, "").trim();
  o = (o.split(",")[0] || "").trim();
  o = o.replace(/\s+(wo|worin|woran|worauf|welche[rs]?)\s+.*$/i, "").trim();
  o = o.replace(/[.,;:!?…]+$/, "").trim();
  if (!o || o.length > 28) return "";
  return o.charAt(0).toUpperCase() + o.slice(1);
}
function istGattungsperson(haupt) {
  const w = haupt.trim().replace(/[^A-Za-zÄÖÜäöüß\s-]/g, "").split(/\s+/).filter(Boolean);
  const letztes = w[w.length - 1] || "";
  if (!letztes || !/^[A-ZÄÖÜ]/.test(letztes)) return false;
  return PERSON_NOMEN.test(letztes);
}
function istPerson(haupt) {
  let w = haupt.trim().split(/\s+/);
  if (istGattungsperson(haupt)) return true;
  if (/^(der|die|das|ein|eine)$/i.test(w[0] || "")) return false;
  const mitTitel = w.length;
  w = w.filter((x) => !TITEL.test(x.replace(/[^A-Za-z.]/g, "")));
  if (w.length === 1 && mitTitel > w.length) return /^[A-ZÄÖÜ][a-zäöüß-]+$/.test(w[0]);
  if (w.length !== 2) return false;
  if (RECHTSFORM.test(w[1].replace(/[^A-Za-z.]/g, ""))) return false;
  if (/^(FC|SV|TSV|SC|VfB|VfL|BSC|1\.)$/i.test(w[0])) return false;
  return w.every((x) => /^[A-ZÄÖÜ][a-zäöüß-]+$/.test(x));
}
var ZEIT_ADVERB = /^(lange|kurz|damals|einst|früher|später|gestern|heute|morgen|neulich|jüngst|mittags|morgens|abends|nachts|vormittags|nachmittags|tagsüber|nachtsüber|wochentags|werktags|sonntags|samstags|jahrelang|tagelang|monatelang|irgendwann|niemals|immer|jederzeit|zuletzt|zuerst|anfangs|schließlich|inzwischen|unterdessen|seither|seitdem|dereinst|derzeit|momentan|gerade|eben|bald|demnächst|künftig|abermals)\b/i;
function mitPraeposition(wann) {
  const w = (wann || "").trim();
  if (!w) return "";
  if (/^(am|im|um|an|in|zu|seit|vor|nach|gegen|während|zwischen|beim|bis|ab)\b/i.test(w)) return w;
  if (/^\d{4}$/.test(w)) return w;
  if (ZEIT_ADVERB.test(w)) return w;
  if (w.includes(",")) return w;
  return "im " + w;
}
function mitAbschlusskomma(angabe) {
  const a = (angabe || "").trim();
  if (!a || !a.includes(",")) return a;
  return a.replace(/[,\s]+$/, "") + ",";
}
function ziehFaktenblatt(input, ressortWahl = "auto") {
  const zielWorte = Number.isFinite(input.lenTarget) ? input.lenTarget : 220;
  const mehr = Math.max(0, Math.min(3, Math.floor((zielWorte - 200) / 120)));
  const ressort = ressortWahl === "auto" ? rateRessort([input.who, input.what, input.where].filter(Boolean).join(" ")) : ressortWahl;
  const R = RESSORTS[ressort];
  const gutesLicht = /^(uplifting|humorous|zaertlich)$/i.test(input.tone || "");
  const werRoh = (normWho(input.who || "").split(",")[0] || "").trim() || WER_ERSATZ;
  const person = istPerson(werRoh);
  const genus = person ? "mask" : genusVon(werRoh);
  const ortMitPraep = (normWhere(input.where || "") || "").trim();
  const ort = dachOrt(normWhere(input.where || "") || "");
  const wann = (normWhen(input.when || "") || "").trim();
  const nachnamen = [...NACHNAME];
  const zieheNach = () => nachnamen.splice(Math.floor(Math.random() * nachnamen.length), 1)[0];
  const n1 = zieheNach(), n2 = zieheNach();
  const personen = [
    { id: "p1", name: `${pick(VORNAME_F)} ${n1}`, kurz: n1, rolle: pick(R.rollenF.length ? R.rollenF : ROLLE_F), genus: "fem", zitierfaehig: true },
    { id: "p2", name: `${pick(VORNAME_M)} ${n2}`, kurz: n2, rolle: pick(R.rollenM.length ? R.rollenM : ROLLE_M), genus: "mask", zitierfaehig: true }
  ];
  if (zielWorte >= 380) {
    const n3 = zieheNach();
    personen.push({
      id: "p3",
      name: `${pick(VORNAME_F)} ${n3}`,
      kurz: n3,
      rolle: pick(R.rollenF.length ? R.rollenF : ROLLE_F),
      genus: "fem",
      zitierfaehig: true
    });
  }
  const eigeneRollen = new Set(R.einheiten.map((e) => e.rolle));
  const einheiten = [...R.einheiten, ...EINHEIT.filter((e) => !eigeneRollen.has(e.rolle))];
  const zahlen = [];
  const wieViele = 2 + Math.floor(Math.random() * 2) + mehr;
  const rollenDrin = /* @__PURE__ */ new Set();
  const genitivPlural = [];
  const sache = sachNomen(input.what || "");
  if (sache) einheiten.unshift({ einheit: sache, rolle: "sache", min: 50, max: 9e3, rund: 10 });
  for (let i = 0; i < wieViele && einheiten.length; i++) {
    const eigeneBetroffen = R.einheiten.filter((e2) => e2.rolle === "betroffene" && einheiten.includes(e2));
    const quelle2 = i === 0 ? eigeneBetroffen.length ? eigeneBetroffen : einheiten.filter((e2) => e2.rolle === "betroffene") : i === 1 && sache ? einheiten.filter((e2) => e2.rolle === "sache") : einheiten.filter((e2) => !rollenDrin.has(e2.rolle));
    if (!quelle2.length) break;
    const gewaehlt = quelle2[Math.floor(Math.random() * quelle2.length)];
    const e = einheiten.splice(einheiten.indexOf(gewaehlt), 1)[0];
    rollenDrin.add(e.rolle);
    genitivPlural.push(e.gen || e.einheit);
    const wert = zahlIn(e.min, e.max, e.rund);
    zahlen.push({
      id: `z${i + 1}`,
      wert,
      einheit: e.einheit,
      wortform: zahlwort(wert),
      rolle: e.rolle,
      kastenLabel: e.label,
      // "rund" nur, wenn das Runden auch etwas aendert - "rund 1.150" fuer 1150
      // ist keine Rundung, sondern eine Behauptung.
      verbal: rundWort(wert)
    });
  }
  const abgeleitet = zahlen.length && zahlen[0].wert >= 40 && zahlen[0].wert % 2 === 0 ? [{ id: "a1", formel: "z1 * 0.5", wortform: zahlwort(zahlen[0].wert / 2), label: `die H\xE4lfte der ${genitivPlural[0] || zahlen[0].einheit}` }] : [];
  const ereignisJahr = Number((wann.match(/\b(1[0-9]{3}|20[0-9]{2}|2[1-9][0-9]{2})\b/) || [])[1]);
  const bezug = Number.isFinite(ereignisJahr) ? ereignisJahr : 2e3;
  const spanne = person ? 4 + Math.floor(Math.random() * 34) : 12 + Math.floor(Math.random() * 110);
  const jahr = Math.max(1200, bezug - spanne);
  const vg = R.vorgeschichte;
  const vorgeschichteWas = gutesLicht ? vg?.gut || VORGESCHICHTE_GUT : vg?.sachlich || VORGESCHICHTE_SACHLICH;
  const chronologie = [
    { id: "c1", zeit: String(jahr), was: vg?.anfang || "der Anfang" },
    // Auch die Chronologie kennt die Blickrichtung: Im Faktenkasten stand sonst
    // "die erste Meldung", waehrend im Text "die erste Zusage" lief.
    // FRÜHER FEST: „im Frühjahr" und „die erste Meldung". Damit stand in jedem
    // Bericht und in jeder Meldung derselbe Satz — in einer Ausgabe mit acht
    // Beiträgen viermal wörtlich. Das war der auffälligste Wiederholungsbefund
    // des ganzen Blattes und kein Fehler des Generators, sondern eine
    // Konstante an der falschen Stelle.
    { id: "c2", zeit: pick(VORGESCHICHTE_ZEIT), was: pick(vorgeschichteWas) },
    // Dieselbe Form wie im Vorspann, sonst steht dort "Im Frühjahr 2001" und
    // im Hergang "Frühjahr 2001 folgte der Schritt".
    { id: "c3", zeit: mitPraeposition(wann) || pick(ZEITPUNKT), was: (input.what || "das Ereignis").trim() }
  ];
  {
    const gemischt = (a) => a.slice().sort(() => Math.random() - 0.5);
    const zeiten = gemischt(VORGESCHICHTE_ZEIT).filter((z) => z !== chronologie[1].zeit);
    const sachen = gemischt(vorgeschichteWas).filter((x) => x !== chronologie[1].was);
    for (let i = 0; i < mehr && i < zeiten.length && i < sachen.length; i++) {
      chronologie.splice(2 + i, 0, { id: `c${4 + i}`, zeit: zeiten[i], was: sachen[i] });
    }
  }
  return {
    id: "fb-" + Date.now().toString(36),
    ressort,
    wer: person ? istGattungsperson(werRoh) ? { haupt: werRoh, kurz: werRoh.replace(/^(ein|eine|einer|einem)\s+/i, (m) => /^eine\s/i.test(m) ? "die " : "das "), genus, art: "person" } : { haupt: werRoh, kurz: kurzPerson(werRoh), genus, art: "person" } : { haupt: werRoh, kurz: kurzform(werRoh, genus), genus, art: "organisation" },
    was: formeWas(input.what || "") || "meldet einen Vorfall",
    // Zwei Formen: `ort` fuer die Dachzeile ("Unterelbe · Wetter"), `mitPraep`
    // fuer den Satz. Ohne die zweite stand "Wie es in Unterelbe weitergeht" -
    // es heisst "an der Unterelbe".
    wo: { ort, mitPraep: ortMitPraep },
    wann: { datum: mitPraeposition(wann) || pick(ZEITPUNKT), relativ: pick(RELATIV) },
    personen,
    zahlen,
    abgeleitet,
    chronologie,
    fiktion: true
  };
}

// src/generation/bericht.ts
var NOMINALRAHMEN = ["Geblieben ist", "Zu sehen ist", "Im Gespr\xE4ch ist", "Zu h\xF6ren ist", "Geblieben ist auch"];
function brauchtRahmen(satz) {
  const w = (satz || "").trim().split(/\s+/).filter(Boolean);
  if (w.length === 0 || w.length > 4) return false;
  if (/\b(ist|sind|war|waren|wird|werden|hat|haben|hatte|bleibt|blieb|kommt|kam|geht|ging|steht|stand)\b/i.test(satz)) return false;
  return !looksLikeFullClause(null, satz);
}
var GUTE_TOENE = /* @__PURE__ */ new Set(["uplifting", "humorous", "zaertlich"]);
var blickVonTon = (ton) => GUTE_TOENE.has((ton || "").toLowerCase()) ? "gut" : "sachlich";
var WORTE = {
  sachlich: {
    vorspann: (n) => `wurde, dass ${n} betroffen sind`,
    // Das Bezugswort steckt im Satz: "der Schritt, ueber DEN". Als ich nur das
    // Nomen austauschte, stand "folgte der Schritt, ueber die ...".
    schritt: (wer) => `folgte der Schritt, \xFCber den ${wer} nun informiert`,
    haelfte: (l, w) => `Betroffen ist damit ${l} \u2014 ${w}.`,
    einsatz: (mehr, x) => `Auf dem Spiel ${mehr ? "stehen" : "steht"} ${x}.`,
    weitere: (x) => `Betroffen sind au\xDFerdem ${x}.`
  },
  gut: {
    vorspann: (n) => `wurde, dass ${n} hinzukommen`,
    schritt: (wer) => `folgte die Entscheidung, \xFCber die ${wer} nun informiert`,
    haelfte: (l, w) => `${cap(l)} \u2014 ${w} \u2014 entsteht im ersten Jahr.`,
    einsatz: (mehr, x) => `In Aussicht ${mehr ? "stehen" : "steht"} ${x}.`,
    weitere: (x) => `Profitieren werden au\xDFerdem ${x}.`
  }
};
var Buchfuehrung = class {
  constructor() {
    this.drin = /* @__PURE__ */ new Set();
  }
  person(p) {
    if (this.drin.has(p.id)) return p.kurz;
    this.drin.add(p.id);
    return `${p.rolle} ${p.name}`;
  }
  eingefuehrt(p) {
    return this.drin.has(p.id);
  }
  organisation(fb) {
    if (this.drin.has("wer")) return fb.wer.kurz;
    this.drin.add("wer");
    return fb.wer.haupt;
  }
};
var EINSATZ_FORMEL = /^(Der Einsatz ist|Es geht um|Auf dem Spiel steht|Alles dreht sich um|Was zählt, ist|Am Ende bleibt nur|Verlieren hieße)\b/i;
var ZAHLWORT = /(?<![a-zäöüß])(zwei|drei|vier|fünf|sechs|sieben|acht|neun|zehn|elf|zwölf|dreizehn|vierzehn|fünfzehn|sechzehn|siebzehn|achtzehn|neunzehn|zwanzig|dreißig|vierzig|fünfzig|hundert|tausend|dutzend|hunderte|tausende|dutzende)(?![a-zäöüß])/i;
function satzSchluessel(s) {
  return (s || "").toLowerCase().replace(/[.!?…,;:]+/g, "").replace(/\s+/g, " ").trim();
}
var istIchOderDu = (s) => isFirstPerson(s) || isSecondPerson(s);
function berichtTauglich(satz) {
  const s2 = (satz || "").trim();
  if (s2.length < 12) return false;
  if (istIchOderDu(s2)) return false;
  if (!hatFinitesVerb(s2)) return false;
  if (/^(er|sie|es|ihn|ihm|ihr|dessen|deren|derselbe|jener|dieser)\b/i.test(s2)) return false;
  if (/\b(ist|sind|war|waren|hat|haben|hatte|hatten)\b[^.]*\b(worden|gewesen)\b/i.test(s2)) return false;
  return true;
}
function satzOhneZahl(bank, kats, benutzt, zusatz = []) {
  const kandidaten = [];
  for (const k of kats) for (const x of bank[k] || []) {
    if (/\d/.test(x) || ZAHLWORT.test(x) || EINSATZ_FORMEL.test(x) || !berichtTauglich(x)) continue;
    if (benutzt.has(satzSchluessel(x))) continue;
    kandidaten.push(x);
  }
  for (const x of zusatz) {
    if (/\d/.test(x) || ZAHLWORT.test(x) || EINSATZ_FORMEL.test(x) || !berichtTauglich(x) || benutzt.has(satzSchluessel(x))) continue;
    kandidaten.push(x);
  }
  if (!kandidaten.length) return null;
  const s = pick(kandidaten);
  benutzt.add(satzSchluessel(s));
  return s.replace(/[.!?…]+$/, "");
}
var EINRICHTUNG = /(GmbH|AG|SE|KG|OHG|e\.?V\.?|Ltd|Inc|Stiftung|Verein|Verband|Genossenschaft|Werft|Werke?|Fabrik|Amt|Behörde|Ministerium|Institut|Akademie|Hochschule|Universität|Schule|Gymnasium|Theater|Museum|Bibliothek|Klinik|Krankenhaus|Kanzlei|Redaktion|Agentur|Bank|Sparkasse|Kammer|Innung|Gilde|Orden|Kloster|Abtei|Zunft|Gesellschaft|Anstalt|Betrieb|Firma|Konzern|Holding|Ausschuss|Kommission|Partei|Gewerkschaft|Bahn|Post|Wache|Feuerwehr|Zentrum|Mühle|Brauerei|Molkerei|Reederei|Druckerei|Bäckerei|Schmiede)\b/i;
function istEinrichtung(wer) {
  return EINRICHTUNG.test(wer || "");
}
function schlagzeile(fb) {
  const wer = fb.wer.haupt.replace(/^(der|die|das)\s+/i, "");
  return cap(`${wer} ${fb.was}`);
}
function dachzeile(fb) {
  return fb.wo.ort ? `${fb.wo.ort} \xB7 ${RESSORTS[fb.ressort].label}` : RESSORTS[fb.ressort].label;
}
function vorspann(fb, b, blick) {
  const z = fb.zahlen[0];
  const w = WORTE[blick];
  const s1 = `${cap(fb.wann.datum)}: ${cap(b.organisation(fb))} ${fb.was}.`;
  const RV = RESSORTS[fb.ressort];
  const menge = z ? `${z.verbal || z.wortform} ${z.einheit}` : "";
  const s2 = z ? RV.vorspannFassungen ? pick(RV.vorspannFassungen(menge, blick === "gut")) : `Bekannt ${w.vorspann(menge)}.` : `Bekannt wurde es erst sp\xE4ter.`;
  return `${s1} ${s2}`;
}
function mische(fakten, frei) {
  const raus = [];
  const gedeckelt = frei.slice(0, Math.max(1, fakten.length));
  const n = Math.max(fakten.length, gedeckelt.length);
  for (let i = 0; i < n; i++) {
    if (fakten[i]) raus.push(fakten[i]);
    if (gedeckelt[i]) raus.push(gedeckelt[i]);
  }
  return raus;
}
function hergang(fb, bank, b, benutzt, extra, vorrat, blick) {
  const teile = [];
  const frei = [];
  const w = WORTE[blick];
  const R0 = RESSORTS[fb.ressort];
  const c2 = fb.chronologie[1], c3 = fb.chronologie[2];
  if (c2) {
    const was2 = c2.was;
    const fassungen = [
      `${cap(c2.zeit)} zeichnete sich ${was2} ab.`,
      // Akkusativ: „gab es der erste Hinweis" stand so im Blatt — die
      // Wetter-Messung hat es gefunden, der Prüfstand zählte 169 Läufe. Nur
      // „der erste …" unterscheidet sich hier vom Nominativ.
      `${cap(c2.zeit)} gab es ${was2.replace(/^der erste\b/, "den ersten")}.`,
      // Ohne Präposition: „mit der erste Anfrage" war der erste Versuch — der
      // Artikel wurde gebeugt, das Adjektiv nicht. Ein Doppelpunkt braucht
      // keinen Kasus.
      `Angefangen hatte es ${c2.zeit}: ${was2}.`,
      `${cap(was2)} kam ${c2.zeit}.`
    ];
    teile.push(pick(fassungen));
  }
  for (let i = 0; i < 1 + extra; i++) {
    const roh = satzOhneZahl(bank, ["obstacles", "turns"], benutzt, vorrat);
    if (roh) frei.push(brauchtRahmen(roh) ? `${pick(NOMINALRAHMEN)} ${roh}.` : `${cap(roh)}.`);
  }
  const z2 = fb.zahlen[1];
  if (z2) teile.push(zahlSatz(z2));
  if (c3) teile.push(R0.schrittFassungen ? pick(R0.schrittFassungen(cap(c3.zeit), blick === "gut")) : `${cap(c3.zeit)} ${w.schritt(b.organisation(fb))}.`);
  const a1 = fb.abgeleitet[0];
  if (a1) teile.push(w.haelfte(a1.label, a1.wortform));
  const eins = blick === "gut" ? R0.gewinn : R0.einsatz;
  if (eins.length) {
    const zwei = reihenfolge2(eins).slice(0, 1 + Math.min(1, Math.floor(extra / 4)));
    const mehr = zwei.length > 1 || zwei.some((x) => x.pl);
    teile.push(w.einsatz(mehr, aufzaehlung(zwei.map((x) => x.t))));
  }
  const bt = RESSORTS[fb.ressort].betroffen;
  if (bt.length >= 3) {
    const schon = fb.zahlen.map((z) => z.einheit.toLowerCase());
    const frei2 = bt.filter((x) => !schon.some((e) => x.toLowerCase().includes(e)));
    const aus = reihenfolge2(frei2.length >= 2 ? frei2 : bt).slice(0, 2 + Math.min(2, Math.floor(extra / 3)));
    teile.push(w.weitere(aufzaehlung(aus)));
  }
  return mische(teile, frei).join(" ");
}
function zitat(fb, bank, b, benutzt, welche, vorrat) {
  const p = fb.personen[welche];
  if (!p || !p.zitierfaehig) return "";
  const kern = satzOhneZahl(bank, ["hooks", "stakes"], benutzt, vorrat) || "Wir haben lange gewartet";
  return `\u201E${cap(kern)}\u201C, sagte ${b.person(p)}.`;
}
function hintergrund(fb, bank, b, benutzt, extra, vorrat) {
  const teile = [];
  const c1 = fb.chronologie[0];
  const RK = RESSORTS[fb.ressort].hintergrundKopf;
  if (c1) teile.push(RK ? RK(b.organisation(fb), c1.zeit) : fb.wer.art === "person" ? `${cap(b.organisation(fb))} ist seit ${c1.zeit} dabei.` : istEinrichtung(fb.wer.haupt) ? `${cap(b.organisation(fb))} besteht seit ${c1.zeit}.` : `Der Vorgang reicht bis ${c1.zeit} zur\xFCck.`);
  const rahmen = reihenfolge2(NOMINALRAHMEN);
  let r = 0;
  const frei = [];
  for (let i = 0; i < 1 + extra; i++) {
    const roh = satzOhneZahl(bank, ["motifs", "props"], benutzt, vorrat);
    if (!roh) continue;
    if (brauchtRahmen(roh) && r < rahmen.length) frei.push(`${rahmen[r++]} ${roh}.`);
    else frei.push(`${cap(roh)}.`);
  }
  const z3 = fb.zahlen[2];
  if (z3) teile.push(zahlSatz(z3));
  return mische(teile, frei).join(" ");
}
function ausblick(fb, blick) {
  const R = RESSORTS[fb.ressort];
  return blick === "gut" ? pick([...R.ausblickGut, `Wie es ${fb.wo.mitPraep} weitergeht, wird sich zeigen.`]) : pick([
    ...R.ausblick,
    `Wie es ${fb.wo.mitPraep} weitergeht, ist offen.`,
    ...R.nurEigenerAusblick ? [] : [`Ob der Schritt zur\xFCckgenommen wird, blieb ${fb.wann.relativ} unbeantwortet.`]
  ]);
}
function zahlSatz(z) {
  const n = `${z.wortform} ${z.einheit}`;
  switch (z.rolle) {
    case "betroffene":
      return `Betroffen sind ${n}.`;
    case "sache":
      return pick([`Zuletzt waren es ${n} im Jahr.`, `Es geht um ${n}.`, `${cap(n)} standen zuletzt in den B\xFCchern.`]);
    case "dauer":
      return `${cap(n)} dauerte es.`;
    case "groesse":
      return `Gemessen wurden ${n}.`;
    case "vorgaenge":
      return `${cap(n)} liegen inzwischen vor.`;
    case "geld":
      return `Es geht um ${n}.`;
    default:
      return `${cap(n)}.`;
  }
}
function aufzaehlung(xs) {
  if (xs.length <= 1) return xs[0] || "";
  return xs.slice(0, -1).join(", ") + " und " + xs[xs.length - 1];
}
function reihenfolge2(a) {
  const x = a.slice();
  for (let i = x.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [x[i], x[j]] = [x[j], x[i]];
  }
  return x;
}
function buildBericht(bank, input, ressort = "auto") {
  const fb = ziehFaktenblatt(input, ressort);
  const b = new Buchfuehrung();
  const benutzt = /* @__PURE__ */ new Set();
  const ziel = Number.isFinite(input.lenTarget) ? input.lenTarget : 240;
  const extra = Math.max(0, Math.min(22, Math.round((ziel - 124) / 17)));
  const vorrat = buildVersAtome(bank, input).filter((x) => x.split(/\s+/).length >= 5);
  const blick = blickVonTon(input.tone || "");
  const abschnitte = [];
  abschnitte.push(dachzeile(fb));
  const zeile = schlagzeile(fb);
  benutzt.add(satzSchluessel(zeile));
  benutzt.add(satzSchluessel(fb.was));
  abschnitte.push(zeile);
  abschnitte.push(vorspann(fb, b, blick));
  const hergangText = hergang(fb, bank, b, benutzt, extra, vorrat, blick);
  abschnitte.push(hergangText);
  const z1 = zitat(fb, bank, b, benutzt, 0, vorrat);
  if (z1) abschnitte.push(z1);
  abschnitte.push(hintergrund(fb, bank, b, benutzt, extra, vorrat));
  const z2 = zitat(fb, bank, b, benutzt, 1, vorrat);
  if (z2) abschnitte.push(z2);
  const z3s = zitat(fb, bank, b, benutzt, 2, vorrat);
  if (z3s) abschnitte.push(z3s);
  if (extra >= 3) {
    const teile = [];
    for (let i = 0; i < extra - 2; i++) {
      const roh = satzOhneZahl(bank, ["turns", "obstacles", "motifs"], benutzt, vorrat);
      if (roh) teile.push(`${cap(roh)}.`);
    }
    if (teile.length) abschnitte.push(`Zur Einordnung: ${teile.join(" ")}`);
  }
  if (fb.chronologie.length > 3) {
    const mitte = fb.chronologie.slice(1, -1);
    const zeilen = mitte.map((c) => `${cap(c.zeit)}: ${c.was}.`);
    if (zeilen.length >= 2) abschnitte.push(`Chronik: ${zeilen.join(" ")}`);
  }
  {
    const rest = fb.zahlen.slice(3);
    if (rest.length) abschnitte.push(`In Zahlen: ${rest.map((z) => zahlSatz(z)).join(" ")}`);
  }
  {
    const R = RESSORTS[fb.ressort];
    const teile = [];
    for (let i = 0; i < Math.min(R.zusatz.rahmen.length, 1 + Math.floor(extra / 3)); i++) {
      const roh = satzOhneZahl(bank, ["hooks", "turns", "stakes"], benutzt, vorrat);
      if (roh) teile.push(`${R.zusatz.rahmen[i]} ${roh}.`);
    }
    if (teile.length) abschnitte.push(R.zusatz.titel ? `${R.zusatz.titel}: ${teile.join(" ")}` : teile.join(" "));
  }
  abschnitte.push(ausblick(fb, blick));
  const kasten = [
    `Faktenkasten`,
    // Auch die Beschriftung dreht sich: "Betroffen: 480 Beschaeftigte" unter
    // einer guten Nachricht liest sich wie ein Widerspruch.
    ...fb.zahlen.map((z) => `\xB7 ${z.rolle === "betroffene" && blick === "gut" ? "Neu" : z.kastenLabel || ROLLE_LABEL[z.rolle]}: ${z.wortform} ${z.einheit}`),
    ...fb.chronologie.map((c) => `\xB7 ${c.zeit}: ${c.was}`)
  ].join("\n");
  return { text: abschnitte.filter(Boolean).join("\n\n") + "\n\n" + kasten, fb, hergang: hergangText };
}

// src/generation/meldung.ts
function zahlSatz2(z, blick) {
  const menge = `${z.verbal || z.wortform} ${z.einheit}`;
  return blick === "gut" ? `Hinzu kommen ${menge}.` : `Betroffen sind ${menge}.`;
}
function tragtEigenesSubjekt(was) {
  const w = (was || "").trim();
  if (!w) return false;
  const lead = extractLeadVerb(w);
  return looksLikeFullClause(lead.verb, lead.rest) || /^(der|die|das|ein|eine)\s+\S+.*\b(ist|sind|war|waren|wird|werden|hat|haben|liegt|gilt|zählt|gehört|wandert|fährt|steht)\b/i.test(w);
}
var werTaugt = (fb) => fb.wer.haupt.trim().toLowerCase() !== WER_ERSATZ.toLowerCase();
function tragtPraedikat(was) {
  const w = (was || "").trim();
  if (!w) return false;
  const lead = extractLeadVerb(w);
  if (lead.verb) return true;
  return /\b(ist|sind|war|waren|wird|werden|wurde|wurden|hat|hatte|haben|hatten|kann|konnte|will|wollte|muss|musste|soll|sollte|darf|durfte|bleibt|blieb|steht|stand|geht|ging|kommt|kam|liegt|lag|geboren|gestorben)\b/i.test(w) || /\b[a-zäöüß]{3,}(?:t|te|en|ten)\b\s*$/.test(w);
}
function ortTauglich(mitPraep) {
  const o = (mitPraep || "").trim();
  if (!o) return false;
  return /^(in|im|an|am|auf|bei|beim|vor|hinter|neben|unter|über|zwischen|nahe|innerhalb|außerhalb|entlang)\b/i.test(o);
}
function vorspann2(fb) {
  const wann = mitAbschlusskomma(cap(fb.wann.datum));
  const wo = fb.wo.mitPraep;
  const kern = tragtEigenesSubjekt(fb.was) || !werTaugt(fb) || !tragtPraedikat(fb.was) ? cap(fb.was) : `${cap(fb.wer.haupt)} ${fb.was}`;
  const ort = ortTauglich(wo) ? ` ${mitAbschlusskomma(wo)}` : "";
  return `${wann} ist${ort} bekannt geworden: ${kern}.`;
}
function quelle(fb) {
  const p = fb.personen[0];
  if (!p) return "";
  return `Das teilt ${p.rolle} ${p.name} mit.`;
}
function schritt(fb) {
  const c = fb.chronologie[1] || fb.chronologie[0];
  return c ? `${cap(c.zeit)} zeichnet sich ${c.was} ab.` : "";
}
var worte = (s) => (s.match(/[A-Za-zÄÖÜäöüß0-9][A-Za-zÄÖÜäöüß0-9.,-]*/g) || []).length;
function buildMeldung(input, ressort = "auto") {
  const fb = ziehFaktenblatt(input, ressort);
  const blick = blickVonTon(input.tone || "");
  const ziel = Number.isFinite(input.lenTarget) ? input.lenTarget : 60;
  const wieviel = ziel <= 60 ? 1 : ziel <= 120 ? 2 : 3;
  const saetze = [vorspann2(fb)];
  const folge = [
    fb.zahlen[0] ? zahlSatz2(fb.zahlen[0], blick) : "",
    schritt(fb),
    quelle(fb)
  ].filter(Boolean);
  const SCHLUSS = "Weitere Angaben liegen zun\xE4chst nicht vor.";
  const MAX_SAETZE = 4;
  for (const s of folge) {
    if (saetze.length >= MAX_SAETZE) break;
    if (saetze.length - 1 >= wieviel && worte(saetze.join(" ")) >= 30) break;
    saetze.push(s);
  }
  if (saetze.length < MAX_SAETZE && worte(saetze.join(" ")) + worte(SCHLUSS) <= 70) saetze.push(SCHLUSS);
  return { text: saetze.join(" "), fb };
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
  const P2 = kit.P;
  return pick([
    `Da h\xE4lt ${P2} inne.`,
    `Kurz sucht ${P2} nach Worten.`,
    `Dann sp\xFCrt ${P2} die K\xE4lte.`,
    `Reglos steht ${P2} da.`,
    `Lange wartet ${P2}.`,
    `Still bleibt ${P2} stehen.`,
    `Aufmerksam beobachtet ${P2} den Raum.`
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
  const werte2 = [kit.W, kit.T, kit.P, strip(kit.Apure)].map((x) => clean(x || "").toLowerCase()).filter((x) => x.length > 3);
  const geruest = (z) => {
    let g = z.toLowerCase();
    for (const w2 of werte2) if (w2) g = g.split(w2).join("\xA7");
    return g.replace(/[^a-zäöüß§]+/g, " ").trim();
  };
  const lines = [];
  const gesehen = /* @__PURE__ */ new Set();
  const genannt = /* @__PURE__ */ new Set();
  for (const [n, gen] of gens) {
    const count2 = Math.max(0, Math.min(3, n | 0));
    for (let i = 0; i < count2; i++) {
      for (let versuch = 0; versuch < 12; versuch++) {
        const z = ensurePunct(clean(gen()));
        if (!z) continue;
        const g = geruest(z);
        if (gesehen.has(g)) continue;
        const dazu = werte2.filter((w2) => z.toLowerCase().includes(w2));
        if (dazu.some((w2) => genannt.has(w2))) continue;
        gesehen.add(g);
        dazu.forEach((w2) => genannt.add(w2));
        lines.push(z);
        break;
      }
    }
  }
  const uniq = lines.filter(Boolean);
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
var REIM_KEIN_ENDE = /^(ich|du|er|sie|es|wir|man|ihn|ihm|mir|mich|dir|dich|uns|euch|sich|selbst|zwei|drei|vier|fünf|sechs|sieben|acht|neun|zehn|jede|jeder|jedes|alle|viele|manche|diese|dieser|dieses|keinen|keinem|keiner|genau|sehr|ganz|so|noch|nur|auch|schon|immer|wieder)$/i;
function reimCoreOf(phrase, targetWords) {
  const alle = String(phrase || "").replace(/\s+/g, " ").trim().split(" ").filter(Boolean);
  let words = alle.length > targetWords ? alle.slice(0, targetWords) : alle.slice();
  while (words.length > 2) {
    const letzt = words[words.length - 1];
    const danach = alle[words.length];
    if (danach && /^[A-ZÄÖÜ]/.test(danach) && /^[a-zäöüß]+(en|er|es|em|e)$/.test(letzt)) words.pop();
    else break;
  }
  words = stripDanglingTail(words);
  let guard = 0;
  while (words.length > 2 && REIM_KEIN_ENDE.test((words[words.length - 1] || "").replace(/[.,;:!?…]/g, "")) && guard++ < 6) {
    words.pop();
    words = stripDanglingTail(words);
  }
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
  const ohneReim = String(phrase || "").replace(/\s+/g, " ").trim().split(" ").filter(Boolean).filter((w) => w.toLowerCase().replace(/[.,;:!?…]/g, "") !== rhymeWord.toLowerCase());
  let core = reimCoreOf(ohneReim.join(" "), targetWords);
  if (!core) core = "Es bleibt";
  const tails = REIM_TAILS[rhymeWord];
  if (tails && tails.length) return verseLine(`${core}, ${pick(tails)}.`);
  return verseLine(`${core}${connector}${rhymeWord}.`);
}
function applyReimPoem(rawText, anchorLine = "", lenTarget = 0, atome = []) {
  const opts = lenTarget > 0 ? { ...REIM_DEFAULTS, targetLines: Math.max(8, Math.min(64, Math.round(lenTarget / 6))) } : REIM_DEFAULTS;
  let t = normalizeNewlines(rawText || "").trim().replace(/\([^()]*\)/g, " ").replace(/\bShot\s*\d+\b.*$/gim, "").replace(/\b\d{1,2}\s*:\s*\d{2}\b\s*—\s*/g, "").replace(/\s+/g, " ").trim();
  let phrases = [];
  if (atome.length >= 6) {
    phrases = atome.map((a) => a.trim()).filter((a) => a.length >= 6);
  } else {
    for (const s of splitSentences(t)) phrases.push(...String(s).split(/[,;:—–]\s*/g).map((p) => p.trim()).filter(Boolean));
  }
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
  "Regen am Fenster",
  "Nebel \xFCberm Feld",
  "Junilicht auf Staub",
  "Der Fluss tr\xE4gt das Eis"
];
var HAIKU_NATURE7 = [
  "ein Reiher hebt langsam ab",
  "der Regen klopft ans Fenster",
  "ein Blatt dreht sich im Fallen",
  "das Eis knackt unter dem Steg",
  "ein Falter taumelt ins Licht",
  "der Wind bl\xE4ttert die Akte",
  "Schnee sammelt sich am Stempel",
  "ein Vogel sitzt aufs Kabel",
  "die Pf\xFCtze friert von innen"
];
var HAIKU_CLOSERS = [
  "der Teich schweigt wieder",
  "der Raum schweigt wieder",
  "die Uhr geht weiter",
  "der Staub setzt sich hin",
  "die T\xFCr bleibt offen",
  "das Licht bleibt h\xE4ngen",
  "und niemand sieht hin",
  "der Atem wird still",
  "alles bleibt stehen",
  // Ergaenzt: Neun Schlusszeilen waren zu wenig. Die Auswahl merkt sich, was in
  // EINEM Text schon benutzt wurde, und bei zwanzig Haiku am Stueck war die Bank
  // nach neun erschoepft — danach nahm die dritte Zeile wieder Anschnitte aus dem
  // Material, und genau die wirken abgehackt. Alle mit fuenf Silben geprueft.
  "der Rest bleibt liegen",
  "der Boden h\xE4lt still",
  "das Papier vergilbt",
  "die Kante bleibt scharf",
  "der Schnee bleibt liegen",
  "der Schatten wandert",
  "das Fenster beschl\xE4gt",
  "der Nachhall verklingt",
  "das Eisen rostet",
  "die Kreide bleibt wei\xDF",
  "der Faden rei\xDFt still",
  "das Wasser steht still",
  "der Zug f\xE4hrt vorbei"
];

// src/generation/haiku.ts
var KEIN_ENDE = /^(der|die|das|den|dem|des|ein|eine|einen|einem|einer|eines|mein|dein|sein|ihr|unser|euer|kein|keine|keinen|keinem|keiner|keines|meinen|meinem|meiner|deinen|seinen|seinem|ihren|ihrem|selbst|und|oder|aber|doch|denn|sondern|als|dass|ob|weil|wenn|wie|um|zu|zum|zur|beim|vom|im|am|ins|aufs|mit|in|auf|an|für|von|bei|aus|über|unter|vor|nach|durch|gegen|ohne|seit|bis|hätte|hatte|wäre|würde|könnte|müsste|sollte|dürfte|genau|sehr|ganz|so|noch|nur|auch|schon|immer|wieder|dann|dabei|ich|du|er|sie|es|wir|man|ihn|ihm|mir|mich|dir|dich|uns|euch|sich|zwei|drei|vier|fünf|sechs|sieben|acht|neun|zehn|jede|jeder|jedes|alle|viele|manche|diese|dieser|dieses)$/i;
var darfEnden = (w) => !KEIN_ENDE.test(w.replace(/[^A-Za-zÄÖÜäöüß]/g, ""));
var FUELL_VORN = ["Nun", "Still", "Kaum", "Hier", "Dann", "Schon", "Noch"];
var STREICHBAR = /^(und|noch|schon|nur|auch|doch|dann|hier|so|sehr|ganz|mal|der|die|das|den|dem|des|ein|im|am|zu|in|an|auf|bei|mit|von|für)$/i;
function passeSilben(line, ziel, syllOf) {
  const ist2 = syllOf(line);
  if (ist2 === ziel) return line;
  if (ist2 === ziel - 1) {
    for (const f of FUELL_VORN) {
      const neu = f + " " + line.charAt(0).toLowerCase() + line.slice(1);
      if (syllOf(neu) === ziel) return neu;
    }
  }
  if (ist2 === ziel + 1) {
    const w = line.split(/\s+/);
    for (let i = 0; i < w.length; i++) {
      if (!STREICHBAR.test(w[i])) continue;
      const rest = [...w.slice(0, i), ...w.slice(i + 1)];
      if (rest.length < 2) continue;
      const neu = rest.join(" ");
      if (syllOf(neu) === ziel && darfEnden(rest[rest.length - 1])) return neu;
    }
  }
  return line;
}
var haikuSyllOf = (line) => String(line || "").split(/\s+/).filter(Boolean).reduce((a, w) => a + estimateSyllables(w), 0);
function haikuCandidatesFromPhrases(phrases) {
  const out = [];
  const seen = /* @__PURE__ */ new Set();
  phrases.forEach((p, src) => {
    const words = p.replace(/[.,;:!?…()]/g, "").split(/\s+/).filter(Boolean);
    for (let a = 0; a < 1; a++) {
      for (let n = a + 2; n <= Math.min(a + 8, words.length); n++) {
        const sub = stripDanglingTail(words.slice(a, n));
        if (sub.length < 2) continue;
        if (!darfEnden(sub[sub.length - 1])) continue;
        const last = sub[sub.length - 1], next = words[n];
        if (next && /^[A-ZÄÖÜ]/.test(next) && /^[a-zäöü]/.test(last) && /(em|en|er|es|e)$/.test(last)) continue;
        const text = sub.join(" "), key = text.toLowerCase();
        if (seen.has(key)) continue;
        seen.add(key);
        out.push({ text, syll: haikuSyllOf(text), src, ganz: a === 0 && n === words.length });
      }
    }
  });
  return out;
}
var HAIKU_LC = /* @__PURE__ */ new Set(["die", "der", "das", "den", "dem", "des", "ein", "eine", "einen", "einem", "einer", "und", "oder", "aber", "im", "in", "auf", "an", "mit", "von", "zu", "zur", "zum", "als", "wie", "nur", "noch", "auch", "so", "dann", "doch", "ohne", "bei", "aus"]);
function fixHaikuCaps(line) {
  return String(line).split(/\s+/).map((w, i) => i > 0 && HAIKU_LC.has(w.toLowerCase()) ? w.toLowerCase() : w).join(" ");
}
function applyHaikuPoem(rawText, anchorLine = "", lenTarget = 0, atome = []) {
  const opts = lenTarget > 0 ? { ...HAIKU_DEFAULTS, maxHaikus: Math.max(2, Math.min(40, Math.round(lenTarget / 12))) } : HAIKU_DEFAULTS;
  let t = normalizeNewlines(rawText || "").trim().replace(/\([^()]*\)/g, " ").replace(/[„“”"»«]/g, " ").replace(/\b(den|dem|einen|einem|der|die|das)\s+Satz\b/gi, " ").replace(/\bShot\s*\d+\b.*$/gim, "").replace(/\b\d{1,2}\s*:\s*\d{2}\b\s*—\s*/g, "").replace(/\s+/g, " ").trim();
  let phrases = [];
  for (const s of splitSentences(t)) phrases.push(...String(s).split(/[,;:—–]\s*/g).map((p) => p.trim()).filter(Boolean));
  phrases = phrases.map((p) => p.replace(/^Und\s+/i, "").trim()).filter((p) => p.length >= 4);
  const concrete = phrases.filter((p) => !/^(aber|denn|weil|dass|ob|doch|also)\b/i.test(p)).filter((p) => !/\b(Wahrheit|Bedeutung|Einsatz|Gültigkeit|Prinzip|Kontrolle|bedeutet|vielleicht)\b/i.test(p));
  if (concrete.length >= 2) phrases = concrete;
  if (atome.length >= 6) phrases = atome.map((a) => a.trim()).filter((a) => a.length >= 4);
  phrases = reimDedupePhrases(phrases);
  const anchor = anchorLine.trim();
  if (!phrases.length) phrases = [anchor || "ein Satz bleibt zur\xFCck"];
  const cands = haikuCandidatesFromPhrases(phrases);
  const used = /* @__PURE__ */ new Set(), usedSrc = /* @__PURE__ */ new Set();
  const fromMaterial = (target, exakt = true, nurGanz = false) => {
    const free = cands.filter((c2) => !used.has(c2.text.toLowerCase()) && (nurGanz ? c2.ganz : true) && (exakt ? c2.syll === target : Math.abs(c2.syll - target) === 1));
    const stufen = [
      free.filter((c2) => c2.ganz && !usedSrc.has(c2.src)),
      free.filter((c2) => c2.ganz),
      free.filter((c2) => !usedSrc.has(c2.src)),
      free
    ];
    const treffer = stufen.find((x) => x.length);
    const c = treffer ? pick(treffer) : null;
    if (!c) return null;
    used.add(c.text.toLowerCase());
    usedSrc.add(c.src);
    return c.text;
  };
  const fromBank = (bank, target) => {
    const free = bank.filter((l2) => !used.has(l2.toLowerCase()) && haikuSyllOf(l2) === target);
    if (!free.length) return null;
    const l = pick(free);
    used.add(l.toLowerCase());
    return l;
  };
  const sourceWords = [];
  for (const p of phrases) sourceWords.push(...p.replace(/[.,;:!?…]/g, "").split(/\s+/).filter(Boolean));
  if (!sourceWords.length) sourceWords.push("Stille");
  let stream = reimShuffle(sourceWords);
  const greedyLine = (target) => {
    let bester = "", besteAbw = 99;
    for (let versuch = 0; versuch < 8; versuch++) {
      if (stream.length < 8) stream = stream.concat(reimShuffle(sourceWords));
      const lw = stripDanglingTail(buildSyllableLine(stream, target).words);
      if (!lw.length) continue;
      const text = lw.join(" ");
      const abw = Math.abs(haikuSyllOf(text) - target);
      if (abw < besteAbw) {
        besteAbw = abw;
        bester = text;
      }
      if (!abw) break;
    }
    return bester || pick(sourceWords);
  };
  const haikus = [];
  for (let h = 0; h < opts.maxHaikus; h++) {
    const [t1, t2, t3] = opts.pattern;
    const l1 = (chance(0.75) ? fromBank(HAIKU_KIGO, t1) : null) || fromMaterial(t1) || fromBank(HAIKU_KIGO, t1) || fromMaterial(t1, false) || greedyLine(t1);
    let l2 = fromMaterial(t2) || fromBank(HAIKU_NATURE7, t2) || fromMaterial(t2, false) || greedyLine(t2);
    const ganzKnapp = (() => {
      const k = fromMaterial(t3, false, true);
      if (!k) return null;
      return haikuSyllOf(passeSilben(k, t3, haikuSyllOf)) === t3 ? k : null;
    })();
    const l3 = fromMaterial(t3, true, true) || ganzKnapp || fromBank(HAIKU_CLOSERS, t3) || fromMaterial(t3) || fromMaterial(t3, false) || greedyLine(t3);
    if (chance(0.7)) l2 += " \u2013";
    const f1 = passeSilben(l1, t1, haikuSyllOf);
    const f2 = passeSilben(l2.replace(/\s*–\s*$/, ""), t2, haikuSyllOf) + (/–\s*$/.test(l2) ? " \u2013" : "");
    const f3 = passeSilben(l3, t3, haikuSyllOf);
    haikus.push([fixHaikuCaps(cap(capLine(f1))), fixHaikuCaps(cap(capLine(f2))), fixHaikuCaps(cap(capLine(f3)))]);
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
function applyStrangPoem(rawText, anchorLine = "", lenTarget = 0) {
  const opts = lenTarget > 0 ? { ...STRANG_DEFAULTS, targetLines: Math.max(8, Math.min(64, Math.round(lenTarget / 6.5))) } : STRANG_DEFAULTS;
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
    const low2 = u.toLowerCase();
    if (!abstract.some((p) => low2.includes(p))) return true;
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
  const low2 = u.toLowerCase();
  let s = 0;
  if (isActionSentence(u)) s += 3;
  if (isConcreteLossSentence(u)) s += 3;
  if (isDecisionSentence(u)) s += 4;
  if (isDisturbanceSentence(u)) s += 2;
  if (low2.includes("aber")) s += 1;
  if (low2.includes("wenn")) s += 1;
  if (c.whoA && low2.includes(c.whoA.toLowerCase())) s += 1;
  if (c.whoB && low2.includes(c.whoB.toLowerCase())) s += 1;
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
function asStrang(text, anchor = "", lenTarget = 0) {
  return applyStrangPoem(text, anchor, lenTarget);
}
function asReim(text, anchor = "", lenTarget = 0, atome = []) {
  return applyReimPoem(text, anchor, lenTarget, atome);
}
function asHaiku(text, anchor = "", lenTarget = 0, atome = []) {
  return applyHaikuPoem(text, anchor, lenTarget, atome);
}
function asDrama(text, whoA, whoB) {
  return applyDramaModule(text, buildDramaConflict(whoA, whoB, (whoA || "") + "|" + (whoB || "")));
}

// src/generation/optionen.ts
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
var werte = (l) => l.map(([v]) => v);

// src/generation/buildStory.ts
var ohneAuto = (l) => l.filter((x) => x !== "auto");
var MODES = ohneAuto(werte(MODE_OPTS));
var STRUCTURES = ohneAuto(werte(STRUCTURE_OPTS)).filter((x) => x !== "dramaturgie" && x !== "rekombination");
var PERSPECTIVES = ohneAuto(werte(PERSP_OPTS));
var RHYTHMS = ohneAuto(werte(RHYTHM_OPTS));
var resBiased = (ui, kind, opts, aA, aB) => ui !== "auto" && opts.includes(ui) ? ui : biasedAutoChoice(kind, aA, aB) || pick(opts);
function buildKit(bank, input, model) {
  const archA = (input.archetypeA || "neutral").toLowerCase();
  const archB = (input.archetypeB || "neutral").toLowerCase();
  const modeKey = resBiased(input.mode, "mode", MODES, archA, archB);
  const M = MODE_DATA[modeKey] || MODE_DATA.bureau;
  let structure = resBiased(input.structure, "structure", STRUCTURES, archA, archB);
  if (input.structure === "auto" && structure === "fragment") structure = pick(STRUCTURES.filter((x) => x !== "fragment"));
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
  const P2 = personKopf(speakers[0] || PRaw);
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
    P: P2,
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
    speakerA: P2,
    speakerB: speakers[1] || pickSpeakerForArchetype(archB),
    speakers: speakers.length >= 2 ? speakers : [P2, pickSpeakerForArchetype(archB)],
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
  if (input.form === "bericht") return kleinerArtikel(buildBericht(bank, input, input.ressort ?? "auto").text);
  if (input.form === "meldung") return kleinerArtikel(buildMeldung(input, input.ressort ?? "auto").text);
  if (input.form === "script") return postProcessText(makeDialogueScene(kit, lenTarget), input);
  if (input.form === "video") {
    return postProcessText(buildVideoSequenceText(kit, input.shots ?? 5, input.totalSec ?? 15, lenTarget), input);
  }
  if (input.form === "poem") {
    const rk = input.structure === "rekombination" ? buildRekombination(bank, input, model) : "";
    if (rk.trim()) {
      const fertig = postProcessText(asProsePoem(rk), { ...input, form: "poem" });
      linkTrace(fertig);
      linkMarkovTrace(fertig);
      return fertig;
    }
    const body = pickStructureBuilder(kit.structure === "fragment" ? "linear" : kit.structure)({ ...kit });
    return postProcessText(asProsePoem(body), { ...input, form: "poem" });
  }
  const verseForm = input.form === "reim" || input.form === "haiku" || input.form === "strang" || input.form === "drama";
  const effStructure = verseForm && kit.structure === "fragment" ? "linear" : kit.structure;
  const ASSEMBLER = /* @__PURE__ */ new Set(["rekombination", "linear", "reverse", "circle", "fragment", "object"]);
  if (input.form === "prose" && ASSEMBLER.has(input.structure || "")) {
    const rk = buildRekombination(bank, input, model);
    if (rk.trim()) {
      const fertig = postProcessText(paragraphize(rk), input);
      linkTrace(fertig);
      linkMarkovTrace(fertig);
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
  if (input.form === "reim") return asReim(finalText, anchor, lenTarget, buildVersAtome(bank, input, model));
  if (input.form === "haiku") {
    return asHaiku(finalText, anchor, lenTarget, buildVersAtome(bank, input, model));
  }
  if (input.form === "strang") return asStrang(finalText, anchor, lenTarget);
  if (input.form === "drama") return asDrama(finalText, kit.speakerA, kit.speakerB || kit.P);
  return verwandleMotive(
    entferneDubletten(enforceWordTarget(finalText, lenTarget, bank, model, input.markovMode || "mix")),
    leseVerwandlungen(bank.verwandlungen)
  );
}

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

// src/generation/context.ts
var roll = (base, tw) => {
  const b = pick(base);
  return Math.random() < 0.5 ? b : b + ", " + pick(tw);
};
function randomContext() {
  return {
    who: roll(CTX_WHO, WHO_TWISTS),
    where: roll(CTX_WHERE, WHERE_TWISTS),
    when: roll(CTX_WHEN, WHEN_TWISTS),
    what: roll(CTX_WHAT, WHAT_TWISTS)
  };
}

// src/generation/rhythmcurve.ts
var splitSents = (t) => (t || "").replace(/\s+/g, " ").trim().split(/(?<=[.!?…])\s+/).filter((s) => s.trim().length > 0);
var wlen = (s) => (s.toLowerCase().match(/[a-zäöüßA-ZÄÖÜ]+/g) || []).length;
var mergeZaehler = 0;
var mergeSents = (a, b) => {
  const kopf = a.replace(/[.!?…]+$/, "").trim();
  const strich = !kopf.includes("\u2014") && !b.includes("\u2014") && mergeZaehler++ % 2 === 0;
  return kopf + (strich ? " \u2014 " : "; ") + b.trim();
};
function generateToCurve(bank, base, model, targets, poolFactor = 5) {
  const clean2 = targets.map((n2) => Math.max(1, Math.round(n2))).filter((n2) => n2 > 0);
  const n = clean2.length;
  if (!n) return { text: "", targets: [], actual: [], poolSize: 0 };
  const pool = [];
  const seen = /* @__PURE__ */ new Set();
  const need = Math.max(n * poolFactor, 48);
  let guard = 0;
  while (pool.length < need && guard < need * 4) {
    guard++;
    const ctx = randomContext();
    const story = buildStory(bank, { ...base, ...ctx, form: "prose" }, model);
    for (const s of splitSents(story)) {
      const key = s.toLowerCase();
      if (seen.has(key)) continue;
      const L = wlen(s);
      if (L < 1) continue;
      seen.add(key);
      pool.push({ s, len: L });
    }
  }
  const used = new Array(pool.length).fill(false);
  const chosen = new Array(n);
  const actual = new Array(n);
  const pickFit = (target) => {
    const maxParts = target >= 40 ? 3 : target >= 12 ? 2 : 1;
    const parts = [];
    let sum = 0;
    for (let p = 0; p < maxParts; p++) {
      let bi = -1, bd = Infinity;
      for (let i = 0; i < pool.length; i++) {
        if (used[i] || parts.includes(i)) continue;
        const d = Math.abs(sum + pool[i].len - target);
        if (d < bd) {
          bd = d;
          bi = i;
        }
      }
      if (bi < 0) break;
      if (parts.length > 0 && Math.abs(sum - target) <= bd) break;
      parts.push(bi);
      sum += pool[bi].len;
      if (sum >= target) break;
    }
    return parts;
  };
  const order = clean2.map((_, i) => i).sort((a, b) => clean2[b] - clean2[a]);
  for (const ti of order) {
    const parts = pickFit(clean2[ti]);
    if (!parts.length) {
      const extra = splitSents(buildStory(bank, { ...base, ...randomContext(), form: "prose" }, model))[0] || "\u2026";
      chosen[ti] = extra;
      actual[ti] = wlen(extra);
      continue;
    }
    for (const i of parts) used[i] = true;
    const merged = parts.map((i) => pool[i].s).reduce((acc, sen) => acc ? mergeSents(acc, sen) : sen, "");
    chosen[ti] = merged;
    actual[ti] = wlen(merged);
  }
  return { text: chosen.join(" "), targets: clean2, actual, poolSize: pool.length };
}

// test/struktur.ts
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
var FUENF = ["linear", "reverse", "circle", "fragment", "object"];
for (const s of [...FUENF, "rekombination"]) {
  wahr(`${s} hat eine Phasenfolge`, (STRUKTUR_PHASEN[s] || []).length === 10);
}
ist(
  "die Rekombination beh\xE4lt 30/30/20/20",
  STRUKTUR_PHASEN["rekombination"].join(","),
  "exposition,exposition,exposition,verdichtung,verdichtung,verdichtung,umschlag,umschlag,schluss,schluss"
);
ist(
  "linear ist dasselbe vorw\xE4rts",
  STRUKTUR_PHASEN["linear"].join(","),
  STRUKTUR_PHASEN["rekombination"].join(",")
);
ist("reverse f\xE4ngt mit dem Schluss an", STRUKTUR_PHASEN["reverse"][0], "schluss");
ist("und h\xF6rt mit der Exposition auf", STRUKTUR_PHASEN["reverse"].slice(-1)[0], "exposition");
ist("der Kreis kehrt zur Exposition zur\xFCck", STRUKTUR_PHASEN["circle"].slice(-1)[0], "exposition");
ist("und f\xE4ngt auch dort an", STRUKTUR_PHASEN["circle"][0], "exposition");
wahr("das Fragment springt", STRUKTUR_PHASEN["fragment"][0] !== STRUKTUR_PHASEN["fragment"][1]);
ist("Fortschritt 0 trifft die erste Phase", phasenFolge("reverse", 0), "schluss");
ist("Fortschritt 1 die letzte", phasenFolge("reverse", 1), "exposition");
ist("und dar\xFCber hinaus auch", phasenFolge("reverse", 5), "exposition");
ist("eine unbekannte Struktur erz\xE4hlt linear", phasenFolge("gibtesnicht", 0), "exposition");
var ids = Object.keys(BUILTIN_PRESETS);
var eingabe = (struktur) => ({
  where: "im Archiv",
  when: "am Morgen",
  who: "die Archivarin",
  what: "sucht eine Akte",
  tone: "nuechtern",
  form: "prose",
  lenTarget: 200,
  tension: "off",
  cast: "auto",
  mode: "bureau",
  structure: struktur,
  perspective: "third",
  rhythm: "clean",
  disruptor: "off",
  instability: 0,
  markovMode: "off",
  varLevel: "mid",
  archetypeA: "neutral",
  archetypeB: "neutral"
});
var schlussStelle = (struktur, n = 40) => {
  const pos = [];
  for (let i = 0; i < n; i++) {
    buildStory(BUILTIN_PRESETS[ids[i % ids.length]], eingabe(struktur));
    const tr = getTrace();
    const k = tr.findIndex((x) => x.kategorie === "endings");
    if (k >= 0 && tr.length > 1) pos.push(k / (tr.length - 1));
  }
  return { mittel: pos.length ? pos.reduce((a, b) => a + b, 0) / pos.length : NaN, gefunden: pos.length };
};
{
  const lin = schlussStelle("linear"), rev = schlussStelle("reverse");
  wahr(`linear findet ein Schlussbild (${lin.gefunden}/40)`, lin.gefunden >= 18);
  wahr(`reverse auch (${rev.gefunden}/40)`, rev.gefunden >= 25);
  wahr(`linear setzt es ans Ende (${(lin.mittel * 100).toFixed(0)} %)`, lin.mittel > 0.9);
  wahr(`reverse an den Anfang (${(rev.mittel * 100).toFixed(0)} %)`, rev.mittel < 0.3);
}
{
  const stellen = [];
  for (const s of FUENF) {
    for (let i = 0; i < 60; i++) {
      const t = buildStory(BUILTIN_PRESETS[ids[i % ids.length]], eingabe(s));
      const k = t.indexOf("Der Kreis schlie\xDFt sich");
      if (k >= 0) stellen.push(k / t.length);
    }
  }
  stellen.sort((a, b) => a - b);
  const median = stellen.length ? stellen[Math.floor(stellen.length / 2)] : 0;
  wahr(`der Kennsatz kommt \xFCberhaupt vor (${stellen.length}\xD7)`, stellen.length >= 1);
  wahr(`er steht im Median ganz hinten (${(median * 100).toFixed(0)} %)`, median > 0.7);
}
{
  const proben = {};
  for (const s of FUENF) {
    proben[s] = [];
    for (let i = 0; i < 12; i++) proben[s].push(buildStory(BUILTIN_PRESETS[ids[i % ids.length]], eingabe(s)));
  }
  const worte2 = (t) => new Set(t.toLowerCase().match(/[a-zäöüß]{4,}/g) || []);
  const jac = (a, b) => {
    let s = 0;
    a.forEach((x) => {
      if (b.has(x)) s++;
    });
    return s / (a.size + b.size - s);
  };
  let hoechste = 0, paar = "";
  for (let x = 0; x < FUENF.length; x++) {
    for (let y = x + 1; y < FUENF.length; y++) {
      let sum = 0;
      for (let i = 0; i < 12; i++) sum += jac(worte2(proben[FUENF[x]][i]), worte2(proben[FUENF[y]][i]));
      const m = sum / 12;
      if (m > hoechste) {
        hoechste = m;
        paar = `${FUENF[x]}/${FUENF[y]}`;
      }
    }
  }
  wahr(`keine zwei Strukturen gleichen einander \xFCber 0,55 (h\xF6chste: ${paar} ${hoechste.toFixed(2)})`, hoechste < 0.55);
}
for (const s of FUENF) {
  let rep = 0;
  for (let i = 0; i < 25; i++) rep += phraseRepeatRatio(buildStory(BUILTIN_PRESETS[ids[i % ids.length]], eingabe(s)));
  const m = rep / 25;
  wahr(`${s}: Phrasenwiederholung unter 0,02 (${m.toFixed(3)})`, m < 0.02);
}
{
  const leer = { motifs: [], hooks: [], props: [], turns: [], obstacles: [], stakes: [], endings: [] };
  for (const s of FUENF) {
    const t = buildStory(leer, eingabe(s));
    wahr(`${s} liefert auch bei leerer Wortbank Text`, t.trim().length > 30);
  }
}
{
  const norm = (x) => x.toLowerCase().match(/[a-zäöüß]{4,}/g) || [];
  const steht = (t, arr) => {
    const tw = norm(t).join(" ");
    return arr.some((x) => {
      const w = norm(x);
      if (w.length < 3) return w.length > 0 && w.every((y) => tw.includes(y));
      for (let j = 0; j + 3 <= w.length; j++) if (tw.includes(w.slice(j, j + 3).join(" "))) return true;
      return false;
    });
  };
  let n = 0, ohneEinstieg = 0, ohneMitte = 0, ohneHoehepunkt = 0;
  for (const id of ids) {
    const D2 = BUILTIN_DRAMA[id];
    if (!D2) continue;
    setDramaData(D2);
    for (let i = 0; i < 3; i++) {
      const t = buildStory(BUILTIN_PRESETS[id], eingabe("dramaturgie"));
      n++;
      if (D2.einstieg.length && !steht(t, D2.einstieg)) ohneEinstieg++;
      if (D2.mitte.length && !steht(t, D2.mitte)) ohneMitte++;
      if (D2.hoehepunkt.length && !steht(t, D2.hoehepunkt)) ohneHoehepunkt++;
    }
  }
  setDramaData(null);
  wahr(`alle Presets mit Bogen wurden gepr\xFCft (${n})`, n >= 140);
  wahr(`der Einstieg steht im Text (${ohneEinstieg} Ausf\xE4lle von ${n})`, ohneEinstieg <= n * 0.03);
  wahr(`die Mitte auch (${ohneMitte} von ${n})`, ohneMitte <= n * 0.03);
  wahr(`und der H\xF6hepunkt (${ohneHoehepunkt} von ${n})`, ohneHoehepunkt <= n * 0.15);
}
{
  setDramaData(null);
  const text = "Die Archivarin sucht eine Akte. Die Akte liegt im Archiv. Die Archivarin bl\xE4ttert. Ein Zeppelin verliert seine Schrauben \xFCber Feuerland.";
  const raus = coherencePass(text, { who: "die Archivarin", where: "im Archiv", what: "sucht eine Akte", form: "prose" });
  wahr("ein verirrter Satz am Ende fliegt weiter raus", !raus.includes("Zeppelin"));
  wahr("und der verbundene Text bleibt stehen", raus.includes("Die Akte liegt im Archiv"));
}
{
  const schwach = [];
  for (const id of ids) {
    let kurz = 0;
    for (let i = 0; i < 12; i++) {
      const t = buildStory(BUILTIN_PRESETS[id], eingabe("rekombination"));
      if (t.split(/\s+/).filter(Boolean).length < 120) kurz++;
    }
    if (kurz >= 3) schwach.push(`${id} (${kurz} von 12)`);
  }
  ist("kein Preset w\xFCrgt den Zusammenbau ab", schwach.join(", "), "");
}
{
  const dannKopf = (t) => /^(und\s+)?dann\b/i.test(t);
  const laengsteKette = (text) => {
    let run = 0, best = 0;
    for (const t of text.replace(/\n+/g, " ").split(/(?<=[.!?…])\s+/)) {
      run = dannKopf(t) ? run + 1 : 0;
      best = Math.max(best, run);
    }
    return best;
  };
  const j = joinBeats(["Es beginnt.", "Dann, unvermittelt: ein Essen.", "Dann kippt es \u2014 die Rollen tauschen.", "Und dann: ein Augenblick."], "");
  ist("joinBeats l\xE4sst h\xF6chstens ein Dann in drei Beats stehen", laengsteKette(j), 1);
  const j2 = joinBeats(["Es beginnt.", "Dann kippt es \u2014 die Rollen tauschen.", "Die T\xFCr bleibt zu."], "");
  wahr("ein einzelnes Dann bleibt", /^Es beginnt\. Dann kippt es/.test(j2));
  const ids2 = Object.keys(BUILTIN_DRAMA).filter((k) => BUILTIN_PRESETS[k]);
  let dreifach = 0, doppel = 0;
  for (let i = 0; i < 120; i++) {
    const id = ids2[i % ids2.length];
    setDramaData(BUILTIN_DRAMA[id]);
    const t = buildStory(BUILTIN_PRESETS[id], eingabe("dramaturgie"));
    const k = laengsteKette(t);
    if (k >= 3) dreifach++;
    if (k >= 2) doppel++;
  }
  ist("Dramaturgie: kein dreifaches Dann in 120 L\xE4ufen", dreifach, 0);
  wahr("Dramaturgie: doppeltes Dann unter 5 %", doppel < 6);
  setDramaData(null);
}
{
  let doppelt = 0;
  for (let i = 0; i < 100; i++) {
    const t = buildStory(DEFAULT_BANK, eingabe(FUENF[i % 5]));
    if ((t.match(/Der Einsatz ist/g) || []).length >= 2) doppelt++;
  }
  wahr("\u201EDer Einsatz ist\u201C h\xF6chstens einmal je Text (unter 3 % von 100)", doppelt < 3);
}
{
  const r = generateToCurve(DEFAULT_BANK, eingabe("linear"), void 0, [12, 12, 12, 12, 12, 12, 12, 12], 3);
  const saetze = r.text.split(/(?<=[.!?…])\s+/);
  const mitStrich = saetze.filter((t) => t.includes("\u2014")).length;
  const mitSemikolon = saetze.filter((t) => t.includes(";")).length;
  wahr("h\xF6chstens die H\xE4lfte der S\xE4tze tr\xE4gt einen Strich", mitStrich <= Math.ceil(saetze.length / 2));
  const paare = [mergeSents("Ein Satz.", "Noch einer."), mergeSents("Ein Satz.", "Noch einer."), mergeSents("Ein Satz.", "Noch einer."), mergeSents("Ein Satz.", "Noch einer.")];
  wahr("die Verschmelzung wechselt zwischen Strich und Semikolon", paare.some((x) => x.includes(" \u2014 ")) && paare.some((x) => x.includes("; ")));
  ist("an einen Strich h\xE4ngt sich kein zweiter", mergeSents("A \u2014 B.", "C."), "A \u2014 B; C.");
  ist("auch wenn der zweite Teil einen tr\xE4gt", mergeSents("A.", "B \u2014 C."), "A; B \u2014 C.");
}
console.log(`Pr\xFCfstand Struktur \u2014 ${geprueft} Pr\xFCfungen, ${bestanden} bestanden`);
var proc = globalThis;
if (fails.length) {
  console.error(`
\u274C Struktur: ${fails.length} Fehler:`);
  fails.forEach((f) => console.error("  - " + f));
  proc.process?.exit(1);
} else {
  console.log(`
\u2705 Struktur: alle ${geprueft} Pr\xFCfungen bestanden.`);
}
