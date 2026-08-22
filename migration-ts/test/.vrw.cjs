"use strict";

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
  "abstand": "m",
  "acker": "m",
  "ader": "f",
  "adressbuch": "n",
  "adresse": "f",
  "airpod": "m",
  "akku": "m",
  "akte": "f",
  "aktendeckel": "m",
  "aktennotiz": "f",
  "allee": "f",
  "alptraum": "m",
  "altar": "m",
  "alter": "n",
  "amt": "n",
  "amulett": "n",
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
  "auge": "n",
  "augenblick": "m",
  "augenlid": "n",
  "ausdehnung": "f",
  "ausgang": "m",
  "ausrede": "f",
  "ausweis": "m",
  "axiom": "n",
  "baby": "n",
  "bach": "m",
  "backup": "n",
  "badeanstalt": "f",
  "bahn": "f",
  "bahnkarte": "f",
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
  "besitz": "m",
  "bestand": "m",
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
  "chat": "m",
  "clown": "m",
  "computer": "m",
  "container": "m",
  "couch": "f",
  "dach": "n",
  "dachboden": "m",
  "dame": "f",
  "damm": "m",
  "datei": "f",
  "dattel": "f",
  "datum": "n",
  "daumen": "m",
  "deck": "n",
  "decke": "f",
  "denkmalschutz": "m",
  "deo": "n",
  "detail": "n",
  "detektor": "m",
  "detektorkopf": "m",
  "dewar": "m",
  "diagramm": "n",
  "dichter": "m",
  "dieb": "m",
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
  "farbenscheibe": "f",
  "fass": "n",
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
  "ferkel": "n",
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
  "formular": "n",
  "fossil": "n",
  "fossilie": "f",
  "foto": "n",
  "frachtbrief": "m",
  "frage": "f",
  "frau": "f",
  "freude": "f",
  "freund": "m",
  "frist": "f",
  "frost": "m",
  "fr\xFChling": "m",
  "fuchs": "m",
  "fuge": "f",
  "fund": "m",
  "fundament": "n",
  "funke": "m",
  "funkger\xE4t": "n",
  "furcht": "f",
  "fu\xDF": "m",
  "f\xE4hrmann": "m",
  "f\xE4hrplan": "m",
  "f\xE4sser": "n",
  "f\xFCrst": "m",
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
  "gemach": "n",
  "gem\xE4lde": "n",
  "gem\xFCse": "n",
  "gep\xE4ck": "n",
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
  "kanal": "m",
  "kaninchen": "n",
  "kanister": "m",
  "kanne": "f",
  "kanten": "m",
  "kapelle": "f",
  "kapit\xE4n": "m",
  "karotte": "f",
  "karte": "f",
  "karteikarte": "f",
  "kartoffel": "f",
  "kassenbuch": "n",
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
  "kiste": "f",
  "klammer": "f",
  "klang": "m",
  "klavier": "n",
  "kleid": "n",
  "kleidersack": "m",
  "kleingeldfach": "n",
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
  "kontobuch": "n",
  "kontor": "n",
  "kontorbuch": "n",
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
  "l\xFCge": "f",
  "macht": "f",
  "magen": "m",
  "mala": "f",
  "maler": "m",
  "manege": "f",
  "mann": "m",
  "mantel": "m",
  "manuskript": "n",
  "mappe": "f",
  "marmelade": "f",
  "masche": "f",
  "maske": "f",
  "mast": "m",
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
  "merkblatt": "n",
  "messer": "n",
  "messprotokoll": "n",
  "messreihe": "f",
  "messung": "f",
  "metall": "n",
  "meter": "m",
  "metronom": "n",
  "miene": "f",
  "mikroskop": "n",
  "milch": "f",
  "millimeter": "m",
  "minute": "f",
  "mitleid": "n",
  "mittag": "m",
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
  "nonne": "f",
  "note": "f",
  "notenblatt": "n",
  "notiz": "f",
  "notizblock": "m",
  "notizbuch": "n",
  "nummer": "f",
  "nuss": "f",
  "nymphe": "f",
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
  "paar": "n",
  "paket": "n",
  "pakt": "m",
  "papier": "n",
  "paradoxon": "n",
  "paragraph": "m",
  "parameter": "m",
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
  "pfandschein": "m",
  "pfeffer": "m",
  "pfeife": "f",
  "pferd": "n",
  "pfirsich": "m",
  "pflaster": "n",
  "pflaume": "f",
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
  "ratte": "f",
  "rauch": "m",
  "raumkapsel": "f",
  "rauschen": "n",
  "rechentafel": "f",
  "regal": "n",
  "regel": "f",
  "regen": "m",
  "regenmesser": "m",
  "register": "n",
  "reh": "n",
  "reich": "n",
  "reigen": "m",
  "reihe": "f",
  "reinraumhaube": "f",
  "reise": "f",
  "reisemantel": "m",
  "rei\xDFverschluss": "m",
  "rest": "m",
  "rettung": "f",
  "richter": "m",
  "riegel": "m",
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
  "schuldschein": "m",
  "schule": "f",
  "schulter": "f",
  "schuppen": "m",
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
  "spiegel": "m",
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
  "tante": "f",
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

// src/generation/verwandlung.ts
function geschlecht(w) {
  const kern = (w || "").trim().split(/\s+/).pop() || "";
  return guessGender(kern.replace(/[^A-Za-zÄÖÜäöüß]/g, ""));
}
function pruefePaar(roh) {
  const m = String(roh).split(/\s*(?:→|->|>)\s*/);
  if (m.length !== 2) return { ok: false, grund: "kein Pfeil zwischen zwei W\xF6rtern" };
  const von = m[0].trim(), nach = m[1].trim();
  if (!von || !nach) return { ok: false, grund: "eine Seite ist leer" };
  if (von.toLowerCase() === nach.toLowerCase()) return { ok: false, grund: "beide Seiten gleich" };
  const g1 = geschlecht(von), g2 = geschlecht(nach);
  if (!g1) return { ok: false, grund: `Geschlecht von \u201E${von}\u201C unbekannt` };
  if (!g2) return { ok: false, grund: `Geschlecht von \u201E${nach}\u201C unbekannt` };
  if (g1 !== g2) return { ok: false, grund: `verschiedenes Geschlecht (${g1} gegen ${g2})` };
  return { ok: true, grund: "" };
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
function joinBeats(beats, P3) {
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
  if (P3 && parts.length >= 4 && chance(0.6)) {
    const idx = 1 + Math.floor(Math.random() * (parts.length - 2));
    const m = new RegExp(`^${escapeRegExp(P3)}\\s+([a-z\xE4\xF6\xFC\xDF]+)\\s+([\\s\\S]+)$`).exec(parts[idx]);
    if (m) parts[idx] = `${pick(BEAT_CONNECTORS)} ${m[1]} ${P3} ${m[2]}`;
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
  const m = s.match(/^([A-Za-zÄÖÜäöüß]+)\s+(.+)$/);
  if (!m) return { verb: null, rest: s };
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
  const fixed = parts.map((p, i) => {
    const m = p.match(/^([a-zäöüß][a-zäöüß-]*)\s+([A-ZÄÖÜ][A-Za-zÄÖÜäöüß-]*)$/);
    if (m && !/^(der|die|das|ein|eine|einen|einem|einer|eines|mein|meine|dein|deine|sein|seine|ihr|ihre|unser|unsere|euer|eure|kein|keine|jeder|jede|jedes|dieser|diese|dieses)$/i.test(m[1])) {
      const g = guessGender(m[2]) || (/in$/.test(m[2].toLowerCase()) ? "f" : void 0);
      if (g === "f") return `eine ${m[1]} ${m[2]}`;
      if (g === "m" || g === "n") return `ein ${m[1]} ${m[2]}`;
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
    const P3 = useArch ? POOLS[archetype] || POOLS.neutral : STANCE_LINES[stance] || POOLS.neutral;
    const arr = P3[key] || [];
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
function guessPronoun(P3) {
  const p = clean(P3);
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
var OBJEKT_KOPF_RE = /^(Ich bin (?:der|die|das) [^.!?]{1,40}\.\s+[^.!?]{1,70}\.)\s*/;
var OBJEKT_ZWISCHENRUF = [
  "Ich sehe zu.",
  "Ich liege dabei.",
  "Ich z\xE4hle mit.",
  "Ich r\xFChre mich nicht.",
  "Ich habe Zeit.",
  "Ich merke es mir."
];
function applyPerspective(paras, perspective, who, objName) {
  const P3 = clean(who) || "Jemand";
  const O = objektName(clean(objName) || pick(DING_VORRAT));
  const swap = (s, person, pronoun) => {
    if (!P3) return s;
    try {
      const re = new RegExp("([A-Za-z\xC4\xD6\xDC\xE4\xF6\xFC\xDF]+\\s+)?\\b" + escapeRegExp(P3) + "\\b(\\s+[A-Za-z\xC4\xD6\xDC\xE4\xF6\xFC\xDF]+)?", "gi");
      return s.replace(re, (_m, before, after, ...rest) => {
        const idx = rest[rest.length - 2];
        const voll = rest[rest.length - 1];
        const posP = voll.toLowerCase().indexOf(P3.toLowerCase(), idx);
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
      return s.replace(new RegExp("\\b" + escapeRegExp(P3) + "\\b", "gi"), pronoun);
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
function pronominalize(text, P3, pronoun) {
  const name = clean(P3);
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
function postProcessText(txt, input) {
  let t = (txt ?? "").toString();
  t = t.replace(/(^|[.!?…]\s+)([a-zäöü])/g, (_m, p1, p2) => p1 + p2.toUpperCase());
  t = t.replace(/\b(und|oder|aber|denn|sondern|sowie|nur|auch|selbst|sogar|erst|schon|noch|doch|nun|dann)(\s+)(die|der|das|den|dem|des|ein|eine|einen|einem|einer|sie|er|es|man|wir|ich|du|ihr|ihre|sein|seine|dann|dabei|dadurch|vielleicht|plötzlich)\b/gi, (_m, c, sp, w) => c + sp + w.charAt(0).toLowerCase() + w.slice(1));
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
  const P3 = kit.P;
  const a = `Ich bin ${objektName(obj)}. Ich liege ${kit.W}.`;
  const b = `Ich kenne ${P3}. Ich kenne ${kit.hookAcc}.`;
  const c = `Sie nennen es ${pick(["Fehler", "Vorgang", "Omen", "Signal", "Symptom", "Protokoll", "Zufall", "Nichts"])}. Ich nenne es ${pick(["Erinnerung", "Beweis", "Anfang", "Schuld"])}.`;
  const d = ensurePunct(rot("mode.rule", M.rules));
  const e = kit.AisClause ? `${P3} sp\xFCrt: ${kit.Apure}. ${kit.obstacle}.` : `${P3} ${kit.AleadVerb || "will"} ${kit.Apure}. ${kit.obstacle}.`;
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

// src/constants.ts
var STORAGE_CORPUS = "divergenz_persistent_corpus_v1";
var BANK_KEYS = [
  "motifs",
  "hooks",
  "props",
  "turns",
  "obstacles",
  "stakes",
  "endings"
];

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
      "zitternde Tiefe unter dem Rumpf"
    ],
    "hooks": [
      "Ich bin frei von jeder Hand.",
      "Der Fluss hat mich losgeschnitten.",
      "Niemand h\xE4lt mehr das Steuer.",
      "Ich treibe durch ein Meer ohne Karten.",
      "Die Nacht schlug wie eine Welle \xFCber mich.",
      "Ich habe meine Anker vergessen.",
      "Kein Hafen ruft meinen Namen."
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
      "einen gesplitterten Mast"
    ],
    "turns": [
      "das Meer antwortet mit Farben",
      "der Himmel st\xFCrzt ins Wasser",
      "die Sterne beginnen zu sinken",
      "etwas unter mir atmet",
      "die Wellen tragen Gesichter",
      "ein Leuchten bricht aus der Tiefe",
      "der Wind wird zu einer Stimme"
    ],
    "obstacles": [
      "Str\xF6mungen ohne Richtung",
      "Korallenriffe wie Messer",
      "eine schwarze Flaute",
      "zitternde Untiefen",
      "Fieber unter Deck",
      "Sturm ohne Zentrum",
      "unsichtbare Netze"
    ],
    "stakes": [
      "Der Einsatz ist Aufl\xF6sung des Selbst.",
      "Der Einsatz ist Orientierung.",
      "Der Einsatz ist Ekstase oder Untergang.",
      "Der Einsatz ist Identit\xE4t.",
      "Der Einsatz ist die R\xFCckkehr an ein Ufer."
    ],
    "endings": [
      "Ich will zur\xFCck in ein stilles Becken.",
      "Vielleicht tr\xE4ume ich von einem kleinen Hafen.",
      "Ich sehne mich nach einem klaren Ufer.",
      "Ich bin m\xFCde vom grenzenlosen Blau.",
      "Die See schweigt zuletzt."
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
      "ein Himmel, der wie Samt dr\xFCckt"
    ],
    "hooks": [
      "Im Schaufenster liegt Sch\xF6nheit wie eine Drohung.",
      "Ein Duft bleibt an mir h\xE4ngen, als h\xE4tte er Z\xE4hne.",
      "Die Stadt atmet langsam, mit schwerem Atem.",
      "Jemand lacht zu leise, um harmlos zu sein.",
      "Zwischen zwei Laternen f\xE4llt ein Schatten aus der Zeit.",
      "Ich gehe, als tr\xFCge ich meinen Namen wie eine Last.",
      "Etwas Gl\xE4nzendes liegt im Schmutz und tut unschuldig."
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
      "einen Taschenspiegel"
    ],
    "turns": [
      "die Sch\xF6nheit zeigt ihre R\xFCckseite",
      "das Verlangen wird zur Anklage",
      "die Stra\xDFe f\xFChrt in einen Raum ohne T\xFCr",
      "ein Blick verr\xE4t, was nicht gesagt werden darf",
      "die Musik im Caf\xE9 f\xE4llt pl\xF6tzlich aus der Welt",
      "ein Gest\xE4ndnis schmeckt nach Rost",
      "das Licht macht alles eleganter, aber nicht wahrer"
    ],
    "obstacles": [
      "der Regen l\xF6scht die Spuren",
      "eine Einladung ist eine Falle",
      "ein Zeuge erinnert sich falsch",
      "die Nacht verdichtet die L\xFCgen",
      "ein Versprechen klebt wie Teer",
      "die Menge verschluckt jede Entscheidung",
      "das Herz verwechselt Glanz mit Rettung"
    ],
    "stakes": [
      "Der Einsatz ist W\xFCrde.",
      "Der Einsatz ist Begehren: Es frisst, was es ber\xFChrt.",
      "Der Einsatz ist Wahrheit: Sie kommt im Kost\xFCm.",
      "Der Einsatz ist Erinnerung: Sie parf\xFCmiert den Schmerz.",
      "Der Einsatz ist Freiheit: Sie kostet Luxus."
    ],
    "endings": [
      "Und die Stadt schlie\xDFt ihre Lippen.",
      "Und der Duft bleibt, wie ein Urteil.",
      "Damit ist die Sch\xF6nheit erledigt.",
      "So bleibt nur Glanz auf kalter Haut.",
      "Und ich gehe, als h\xE4tte ich gewonnen \u2013 und verloren."
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
      "der Bescheid tr\xE4gt ein Datum von morgen"
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
      "niemand darf die Regel nennen"
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
      "So endet der Tag im selben Wartezimmer."
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
      "Licht, das schneidet"
    ],
    "hooks": [
      "Die Stadt springt mich an.",
      "Ich h\xF6re mein Blut in den Dr\xE4hten.",
      "Die H\xE4user stehen zu nah, als wollten sie zubei\xDFen.",
      "Ein Schrei h\xE4ngt zwischen zwei Reklamen.",
      "Meine Schritte klingen wie Anklagen.",
      "Das Licht ist zu hell, um wahr zu sein.",
      "Jemand rannte, ohne zu wissen, wohin."
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
      "ein Taschenradio"
    ],
    "turns": [
      "die Nacht kippt pl\xF6tzlich ins Wei\xDF",
      "die Menge wird zu einem einzigen Gesicht",
      "ein Wort wird zur Waffe",
      "die Angst beginnt zu singen",
      "die Stra\xDFe zieht sich zusammen",
      "das Licht verr\xE4t den K\xF6rper",
      "der Atem wird zum Befehl"
    ],
    "obstacles": [
      "die Sirenen \xFCbert\xF6nen alles",
      "die Menge dr\xFCckt wie Beton",
      "ein Blick l\xF6st Panik aus",
      "die Wege f\xFChren im Kreis",
      "der K\xF6rper ist zu laut",
      "die Luft ist zu dick",
      "die T\xFCren sind nur Attrappen"
    ],
    "stakes": [
      "Der Einsatz ist Nerven: Sie rei\xDFen.",
      "Der Einsatz ist Freiheit: Sie ist ein Sprint.",
      "Der Einsatz ist Sprache: Sie wird Schreien.",
      "Der Einsatz ist K\xF6rper: Er ist eine Fackel.",
      "Der Einsatz ist Morgen: Es k\xF6nnte brennen."
    ],
    "endings": [
      "Und die Stadt lacht im Neon.",
      "Und der Morgen kommt wie eine Beule.",
      "So blieb ich stehen, weil alles rannte.",
      "Und der Schrei wird leise.",
      "Und das Licht tat, als w\xE4re es sauber."
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
      "ein Spiegel, der einen anderen Raum behauptet"
    ],
    "hooks": [
      "Ich trete in den Raum, und der Raum tritt zur\xFCck.",
      "Ein Satz liegt auf dem Boden wie eine Banane.",
      "Die Lampe machte Ger\xE4usche, als w\xE4re sie nass.",
      "Jemand spricht, aber die Worte kommen aus der Tapete.",
      "Meine Schuhe wissen den Weg, ich nicht.",
      "Ein Vogel bittet um eine Quittung.",
      "Die T\xFCr erinnert sich an mein Gesicht."
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
      "ein Glas Wasser"
    ],
    "turns": [
      "die Logik wechselt die Richtung",
      "ein Gegenstand beginnt zu sprechen",
      "die Szene wiederholt sich, aber mit anderem Wetter",
      "ein Name f\xE4llt aus dem Himmel",
      "die W\xE4nde werden durchl\xE4ssig",
      "Zeit wird zu einem M\xF6belst\xFCck",
      "das Unterbewusste unterschreibt"
    ],
    "obstacles": [
      "die T\xFCr f\xFChrt in eine Zeichnung",
      "die Sprache stolpert \xFCber sich selbst",
      "jemand verlangt Beweise f\xFCr einen Traum",
      "die Treppe endet in einem Satz",
      "ein Schatten l\xE4uft voraus",
      "die Uhr schmilzt in der Hand",
      "das Fenster weigert sich, hinauszuschauen"
    ],
    "stakes": [
      "Der Einsatz ist Realit\xE4t: Sie ist verhandelbar.",
      "Der Einsatz ist Identit\xE4t: Sie wechselt die Masken.",
      "Der Einsatz ist Zeit: Sie ist weich.",
      "Der Einsatz ist Wahrheit: Sie ist ein Bild.",
      "Der Einsatz ist Erwachen: Es k\xF6nnte unm\xF6glich sein."
    ],
    "endings": [
      "Und der Traum unterschrieb mit meinem Namen.",
      "Und als ich erwache, ist der Raum gr\xF6\xDFer.",
      "So bleibt nur der Beweis: ein nasser Schl\xFCssel.",
      "Und die Uhr isst die letzte Minute.",
      "Und die T\xFCr tut, als h\xE4tte sie mich nie gekannt."
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
      "ein Punkt, in dem alles zusammenf\xE4llt"
    ],
    "hooks": [
      "der eigene Name klingt pl\xF6tzlich geliehen",
      "die Stille hat auf einmal einen Klang",
      "etwas antwortet, ohne zu sprechen",
      "die H\xE4nde liegen still und arbeiten doch",
      "im Spiegel steht jemand, der nichts behauptet",
      "die Luft tr\xE4gt mehr, als sie wiegt",
      "das Ich r\xFCckt einen Schritt zur Seite"
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
      "eine Schwelle aus abgetretenem Holz"
    ],
    "turns": [
      "die Grenze zwischen innen und au\xDFen wird durchl\xE4ssig",
      "das Wort reicht nicht mehr und h\xF6rt auf",
      "die Frage verliert ihren Fragenden",
      "aus Suchen wird Stillhalten",
      "das Einzelne wird durchsichtig",
      "die Antwort kommt vor der Frage",
      "das Ich l\xF6st sich, ohne zu verschwinden"
    ],
    "obstacles": [
      "jede Beschreibung verfehlt es",
      "das Suchen selbst steht im Weg",
      "die Sprache kehrt immer zum Sprecher zur\xFCck",
      "wer es festh\xE4lt, verliert es",
      "der Verstand verlangt einen Beweis",
      "die Gewohnheit zieht zur\xFCck ins Vertraute",
      "die Erfahrung l\xE4sst sich nicht wiederholen"
    ],
    "stakes": [
      "Der Einsatz ist Gewissheit: ohne jeden Beweis.",
      "Der Einsatz ist ein Ich, das nichts mehr behauptet.",
      "Der Einsatz ist die Sprache, die zur\xFCcktreten muss.",
      "Der Einsatz ist ein Augenblick, der alle anderen enth\xE4lt.",
      "Der Einsatz ist alles, was man zu wissen glaubt."
    ],
    "endings": [
      "So bleibt nur das Licht, das keiner entz\xFCndet hat.",
      "Und die Stille h\xE4lt, was kein Wort versprochen hat.",
      "So endet das Suchen, ohne dass etwas gefunden ist.",
      "Am Ende steht kein Satz, nur ein Atemzug.",
      "So schlie\xDFt sich der Raum, der nie einer war."
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
      "eine Struktur mit blinden Punkten"
    ],
    "hooks": [
      "Abschnitt 1: Sachverhalt",
      "Definition A wird angewendet",
      "Gem\xE4\xDF Regel 3.2",
      "Die Ordnung gilt",
      "Es wird festgestellt",
      "Die Zust\xE4ndigkeit ist gekl\xE4rt",
      "Ein Protokoll beginnt",
      "Der Vorgang wird er\xF6ffnet"
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
      "eine Registratur"
    ],
    "turns": [
      "Die Regel widerspricht sich selbst",
      "Ein Absatz wird gestrichen",
      "Die Definition verschiebt ihre Bedeutung",
      "Die Hierarchie kippt",
      "Die Klausel wird w\xF6rtlich genommen",
      "Die Ausnahme wird zur Norm",
      "Ein Verweis f\xFChrt ins Leere"
    ],
    "obstacles": [
      "Die Zust\xE4ndigkeit ist unklar",
      "Ein Dokument fehlt",
      "Die Signatur ist ung\xFCltig",
      "Ein Absatz ist doppeldeutig",
      "Die Definition ist nicht abschlie\xDFend",
      "Der Begriff ist nicht normiert"
    ],
    "stakes": [
      "Der Einsatz ist G\xFCltigkeit.",
      "Der Einsatz ist Eindeutigkeit.",
      "Der Einsatz ist Systemstabilit\xE4t.",
      "Der Einsatz ist Ordnung."
    ],
    "endings": [
      "Damit ist der Vorgang abgeschlossen.",
      "Die Ordnung bleibt bestehen.",
      "Der Sachverhalt ist festgestellt.",
      "Der Fall gilt als entschieden.",
      "Die Regel bleibt in Kraft."
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
      "eine T\xFCr ohne Klinke in einer Kapelle"
    ],
    "hooks": [
      "Das Licht f\xE4llt nicht vom Himmel, sondern aus meinem Mund.",
      "Die Glocken l\xE4uten r\xFCckw\xE4rts.",
      "Ich knie, und der Boden antwortet.",
      "Ein Gleichnis steht pl\xF6tzlich im Raum.",
      "Der Wind roch nach Weihrauch und Regen.",
      "Ein Engel verwechselt meinen Namen.",
      "Das Brot zerbricht, bevor ich es ber\xFChre."
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
      "ein Tuch"
    ],
    "turns": [
      "das Gleichnis wird w\xF6rtlich",
      "ein Wunder geschieht im Nebensatz",
      "der Zweifel spricht lauter als der Glaube",
      "das Licht wechselt die Quelle",
      "ein Opfer wird zur Umarmung",
      "der Himmel antwortet in Stille",
      "der Stein beginnt zu rollen"
    ],
    "obstacles": [
      "der Glaube verlangt einen Sprung",
      "ein Zeichen bleibt aus",
      "der Verrat steht am Tisch",
      "die Menge ruft nach Beweisen",
      "der Himmel schweigt",
      "das Wasser tr\xE4gt nicht",
      "das Grab bleibt verschlossen"
    ],
    "stakes": [
      "Der Einsatz ist Erl\xF6sung: Sie kostet alles.",
      "Der Einsatz ist Vergebung: Sie ist unverdient.",
      "Der Einsatz ist Glaube: Er sieht ohne Augen.",
      "Der Einsatz ist Liebe: Sie opfert sich.",
      "Der Einsatz ist Auferstehung: Sie widerspricht der Logik."
    ],
    "endings": [
      "Und das Licht bleibt, auch ohne Sonne.",
      "Und der Stein ist leichter als mein Herz.",
      "Und ich gehe, als h\xE4tte ich Fl\xFCgel.",
      "Und das Brot reicht f\xFCr alle.",
      "Und der Himmel \xF6ffnet sich nach innen."
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
      "ein Siegel aus Licht auf der Stirn"
    ],
    "hooks": [
      "Die Worte kommen wie Regen in der Nacht.",
      "Der Ruf erreicht mich vor meinem Namen.",
      "Ich wasche meine H\xE4nde, und die Zeit wird klar.",
      "Die W\xFCste \xF6ffnet ein Auge.",
      "Ein Vers steht im Sand.",
      "Die Stille hat einen Rhythmus.",
      "Der Wind spricht arabisch."
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
      "einen Ring"
    ],
    "turns": [
      "ein Vers ver\xE4ndert die Richtung",
      "die Waage neigt sich unsichtbar",
      "das Herz wird Richter",
      "die W\xFCste wird zum Garten",
      "eine Pr\xFCfung wird zur Gabe",
      "die Schrift beginnt zu leuchten",
      "die Stille antwortet"
    ],
    "obstacles": [
      "der Zweifel trocknet die Zunge",
      "der Weg verliert seine Spuren",
      "eine Pr\xFCfung kommt ohne Warnung",
      "die Nacht scheint endlos",
      "ein Vers bleibt unverst\xE4ndlich",
      "das Herz ist verschlossen",
      "die Geduld rei\xDFt"
    ],
    "stakes": [
      "Der Einsatz ist Hingabe: Sie fordert Vertrauen.",
      "Der Einsatz ist Rechtleitung: Sie ist ein schmaler Pfad.",
      "Der Einsatz ist Geduld: Sie wird gepr\xFCft.",
      "Der Einsatz ist Gerechtigkeit: Sie wiegt jedes Wort.",
      "Der Einsatz ist Barmherzigkeit: Sie \xFCbersteigt das Ma\xDF."
    ],
    "endings": [
      "Und die W\xFCste tr\xE4gt pl\xF6tzlich Gr\xFCn.",
      "Und mein Herz findet seine Qibla.",
      "Und der Vers bleibt in mir.",
      "Und die Nacht ist nicht mehr dunkel.",
      "Und der Garten \xF6ffnet sich im Inneren."
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
      "ein Berg, der atmet"
    ],
    "hooks": [
      "Ich setze mich, und die Welt setzt sich mit mir.",
      "Ein Atemzug dauert ein Jahrhundert.",
      "Die Frage l\xF6st sich vor der Antwort.",
      "Ein Blatt f\xE4llt, und ich verstehe.",
      "Die Stille ist lauter als der Markt.",
      "Ein M\xF6nch l\xE4chelt ohne Grund.",
      "Der Weg beginnt unter meinen F\xFC\xDFen."
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
      "einen Kieselstein"
    ],
    "turns": [
      "das Ich l\xF6st sich auf",
      "der Kreis schlie\xDFt sich nicht",
      "die Frage verschwindet",
      "Zeit wird zu Atem",
      "Leere wird Form",
      "das Rad dreht sich r\xFCckw\xE4rts",
      "Erkenntnis geschieht ohne Worte"
    ],
    "obstacles": [
      "der Geist springt wie ein Affe",
      "Anhaftung h\xE4lt fest",
      "der Wunsch erzeugt Schatten",
      "die Stille wird unruhig",
      "das Selbst verlangt Best\xE4tigung",
      "der Weg scheint zu einfach",
      "der Schmerz klammert sich"
    ],
    "stakes": [
      "Der Einsatz ist Erwachen: Es geschieht still.",
      "Der Einsatz ist Loslassen: Nichts bleibt.",
      "Der Einsatz ist Mitgef\xFChl: Es kennt kein Ich.",
      "Der Einsatz ist Einsicht: Sie l\xF6st Grenzen.",
      "Der Einsatz ist Nirwana: Es ist kein Ort."
    ],
    "endings": [
      "Und der Atem kehrt heim.",
      "Und nichts fehlt.",
      "Und der Kreis ist offen.",
      "Und die Bl\xFCte f\xE4llt nicht mehr.",
      "Und der Weg ist kein Weg."
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
      "die Reihe von 1974 sagt etwas anderes"
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
      "die Falle ist leer und der K\xF6der weg"
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
      "Und der Bau bleibt bewohnt, ohne uns."
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
      "unter der Asche liegt noch eine Asche"
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
      "der Frost sprengt die Wand \xFCber dem Weg"
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
      "Und \xFCber der Asche w\xE4chst wieder Gras."
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
      "die Wolken rei\xDFen f\xFCr vier Minuten auf"
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
      "das Objekt steht zu tief \xFCber dem Horizont",
      "die Beobachtungszeit geh\xF6rt einem anderen"
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
      "Der Himmel dreht sich weiter, ob jemand hinsieht oder nicht."
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
      "ein Planet mit Atem",
      "Kontinente als Rippen",
      "Ozeane als Blut",
      "ein Puls im Erdinneren",
      "W\xE4lder als Nervengeflecht",
      "Wolken als Gedanken",
      "ein Gebirge als Stirn",
      "Fl\xFCsse als Adern",
      "St\xE4dte wie leuchtende Parasiten",
      "eine Atmosph\xE4re als Haut"
    ],
    "hooks": [
      "Die Erde blinzelt.",
      "Ein Erdbeben ist nur ein Zucken.",
      "Der Wind spricht in ganzen S\xE4tzen.",
      "Die Gezeiten folgen einem Herzschlag.",
      "Wir leben auf einer Stirn."
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
      "eine Wurzel"
    ],
    "turns": [
      "der Planet reagiert bewusst",
      "das Klima antwortet",
      "die Kontinente verschieben sich absichtlich",
      "die Menschheit wird als Symptom erkannt",
      "die Welt beginnt zu tr\xE4umen",
      "Naturgesetze werden zu Instinkten",
      "der Himmel senkt sich n\xE4her"
    ],
    "obstacles": [
      "der Organismus wird krank",
      "der Puls wird unregelm\xE4\xDFig",
      "ein Teil des K\xF6rpers rebelliert",
      "das Nervensystem brennt",
      "die Haut rei\xDFt",
      "der Atem wird d\xFCnn",
      "das Ged\xE4chtnis der Erde l\xF6scht sich"
    ],
    "stakes": [
      "Der Einsatz ist Gleichgewicht: System oder Kollaps.",
      "Der Einsatz ist Bewusstsein: Wei\xDF die Welt von uns?",
      "Der Einsatz ist Koexistenz: Parasit oder Zelle?",
      "Der Einsatz ist Heilung: Regeneration oder Narben.",
      "Der Einsatz ist Zukunft: Evolution oder Fieber."
    ],
    "endings": [
      "Und der Planet atmet tiefer.",
      "Und wir sind nur eine Phase.",
      "So bleibt ein leiser Herzschlag.",
      "Und die Welt dreht sich weiter \u2013 wissend.",
      "Und das Wesen schlie\xDFt kurz die Augen."
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
      "ein Traum wiederholt sich, aber mit fremdem Personal"
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
      "der Termin f\xE4llt auf dasselbe Datum"
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
      "Der Termin bleibt bestehen, das Symptom auch."
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
      "ein Satz ohne Satzzeichen",
      "ein Insiderwort mit Ablaufdatum",
      "ein Screenshot als Beweis",
      "Ironie ohne Warnschild",
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
      "eine Bank am Bolzplatz",
      "ein Bus, der immer zu voll ist",
      "eine Jacke, die jemand anderem geh\xF6rt",
      "ein Foto, das keiner posten darf",
      "ein Timer, der niemanden interessiert",
      "ein Wort, das gestern noch ging"
    ],
    "hooks": [
      "Bro, das ist anders.",
      "Sag ehrlich, f\xFChlst du das?",
      "Das ist so random.",
      "Lowkey ist das krass.",
      "Ich schw\xF6r, kein Cap.",
      "Jemand liest und antwortet nicht.",
      "Der Gruppenchat ist pl\xF6tzlich still.",
      "Ein Screenshot geht rum, und keiner sagt woher.",
      "Sie schreibt zur\xFCck, aber anders als sonst.",
      "Das Video ist weg, bevor es jemand sehen konnte.",
      "Er sitzt heute woanders.",
      "Alle wussten es, nur einer nicht.",
      "Der Spitzname bleibt h\xE4ngen.",
      "Die Story ist gel\xF6scht und alle haben sie gesehen.",
      "Jemand nimmt einen Trend ernst.",
      "Der Lehrer benutzt das Wort."
    ],
    "props": [
      "ein Smartphone",
      "eine Sprachnachricht",
      "einen Screenshot",
      "ein Hoodie",
      "ein Emoji",
      "einen TikTok-Sound",
      "einen Hashtag",
      "eine Insta-Story",
      "einen Gruppenchat",
      "einen AirPod",
      "eine Powerbank",
      "einen Kopfh\xF6rer",
      "eine Wasserflasche",
      "ein Ladekabel",
      "einen Turnbeutel",
      "ein Deo",
      "eine Bahnkarte",
      "einen Kaugummi",
      "ein Basecap",
      "eine Sonnenbrille",
      "einen Aufkleber",
      "ein Armband",
      "eine Dose Energy"
    ],
    "turns": [
      "Ironie kippt in Ernst",
      "ein Insider wird \xF6ffentlich",
      "ein Trend wird Mainstream",
      "ein Wort verliert Bedeutung",
      "Slang wird Marketing",
      "Humor wird Verteidigung",
      "Authentizit\xE4t wird getestet",
      "der Insider funktioniert nicht mehr",
      "jemand steht dazu",
      "der Chat wird gel\xF6scht",
      "die Gruppe teilt sich",
      "ein Video ist pl\xF6tzlich \xFCberall",
      "jemand entschuldigt sich zuerst",
      "das Wort wird von den Falschen benutzt",
      "keiner will es gewesen sein",
      "der Trend kippt \xFCber Nacht",
      "aus dem Spa\xDF wird eine Sache",
      "jemand blockt zur\xFCck",
      "die Stille wird zur Antwort"
    ],
    "obstacles": [
      "cringe-Moment",
      "Missverst\xE4ndnis ohne Tonfall",
      "Generationenkonflikt",
      "Cancel-Druck",
      "Fake-Authentizit\xE4t",
      "zu viel Ironie",
      "st\xE4ndiger Vergleich",
      "niemand schreibt zuerst",
      "der Ton fehlt in der Nachricht",
      "alle warten auf denselben",
      "die Story ist schon weg",
      "der Akku h\xE4lt nicht bis abends",
      "der Bus f\xE4hrt ohne ihn",
      "zu Hause fragt jemand nach",
      "das Handy liegt in der Schublade",
      "die Antwort kommt drei Tage sp\xE4ter",
      "keiner will der Erste sein"
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
      "Und pl\xF6tzlich ist es peinlich.",
      "Und alle f\xFChlen es.",
      "So wird es ein Insider.",
      "Und das Meme stirbt.",
      "Und wir sagen einfach: wild.",
      "Und irgendwann schreibt doch jemand.",
      "So bleibt der Chat auf gelesen stehen.",
      "Und am Montag redet keiner mehr davon.",
      "Und der Bus f\xE4hrt weiter, alle steigen aus.",
      "So endet die Story, ungespeichert.",
      "Und das Wort benutzt jetzt niemand mehr."
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
      "Der Raum ist gr\xF6\xDFer als gedacht.",
      "Nichts lenkt ab.",
      "Licht f\xE4llt wie ein Entwurf.",
      "Die W\xE4nde scheinen zu schweigen.",
      "Die Stadt beginnt im Wohnzimmer.",
      "der Bauherr will eine Wand mehr",
      "das Modell steht seit einem Jahr unber\xFChrt",
      "der Beton kommt zwei Grad zu kalt",
      "ein Fenster sitzt zwanzig Zentimeter falsch",
      "die Genehmigung verlangt ein Satteldach",
      "der Grundriss funktioniert nur ohne M\xF6bel",
      "auf der Baustelle steht eine Wand, die nicht im Plan ist",
      "die Fuge l\xE4uft nicht durch",
      "der Nachbar klagt gegen das Licht",
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
      "Form folgt Funktion radikal",
      "Innen und Au\xDFen verschmelzen",
      "Ornament verschwindet",
      "der Raum wird flexibel",
      "Technik wird sichtbar",
      "Transparenz erzeugt Kontrolle",
      "Minimalismus wird zum Statement",
      "die Statik verlangt eine St\xFCtze im freien Raum",
      "der Bauherr zieht ein und stellt alles um",
      "das Licht trifft anders als gerechnet",
      "eine Wand f\xE4llt weg und der Entwurf wird besser",
      "die Norm streicht das entscheidende Detail",
      "der Rohbau ist sch\xF6ner als das fertige Haus",
      "der Beton zeigt einen Fehler, den keiner beheben will",
      "die Nutzung \xE4ndert sich vor der \xDCbergabe",
      "ein Nachbargeb\xE4ude nimmt das Licht",
      "die Fuge wird zum Thema der Bauleitung",
      "das Geb\xE4ude bekommt einen Namen von den Bewohnern"
    ],
    "obstacles": [
      "K\xE4lte des Materials",
      "Verlust von Intimit\xE4t",
      "Kostenexplosion",
      "Stadtverdichtung",
      "Nachhaltigkeitskonflikt",
      "Glas wird zur Grenze",
      "Funktion widerspricht Gef\xFChl",
      "die Kosten laufen der Planung davon",
      "die Norm verbietet die offene Treppe",
      "der Beton bleibt kalt, was immer man einbaut",
      "die Bewohner wollen nicht gesehen werden",
      "die Genehmigung fehlt f\xFCr das Flachdach",
      "der Statiker widerspricht dem Entwurf",
      "der Winter h\xE4lt den Rohbau an",
      "die Fassade h\xE4lt die W\xE4rme nicht",
      "der Bauherr wechselt das B\xFCro",
      "ein Denkmalschutz greift nachtr\xE4glich",
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
      "Und das Licht bleibt.",
      "Und der Raum atmet.",
      "So steht nur noch Struktur.",
      "Und die Stadt nimmt es auf.",
      "Und das Geb\xE4ude wird Idee.",
      "Und das Haus steht, ohne den, der es gedacht hat.",
      "So bleibt der Entwurf im Regal, gerollt.",
      "Am Ende h\xE4ngen Vorh\xE4nge vor dem Glas.",
      "Und der Beton wird \xE4lter und besser.",
      "So \xFCbergibt man Schl\xFCssel und geht.",
      "Und die Fuge l\xE4uft durch, wenigstens sie.",
      "Der Bau ist fertig, die Idee nicht.",
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
      "ein Tanz, der nie zu Ende zu sein scheint"
    ],
    "hooks": [
      "ein Ring, der nicht an ihre Hand passt",
      "ein fremder Akzent im vertrauten Raum",
      "ein Brief ohne Unterschrift, nur mit einem Kuss",
      "ein Duft von fremdem Parfum im Treppenhaus",
      "ein Herzschlag, der zu schnell f\xFCr Etikette ist",
      "ein verbotenes L\xE4cheln zwischen zwei Fronten",
      "eine Tr\xE4ne auf einem versiegelten Brief"
    ],
    "props": [
      "einen Liebesbrief mit fremdem Wappen",
      "ein Medaillon mit verborgenem Portr\xE4t",
      "eine Rose aus einem fremden Garten",
      "einen goldenen Ring ohne Inschrift",
      "ein Taschentuch mit fremden Initialen",
      "eine Locke Haar in einem Samtbeutel",
      "einen F\xE4cher mit geheimer Botschaft",
      "eine Maske vom letzten Fest"
    ],
    "turns": [
      "Pl\xF6tzlich erkennt sie in dem Fremden den Mann aus ihren Tr\xE4umen.",
      "Er spricht ihren Namen, als kenne er ihr Herz.",
      "Ein Kuss im Schatten des Torbogens ver\xE4ndert alles.",
      "Sie begreift, dass Liebe gef\xE4hrlicher ist als jedes Ger\xFCcht.",
      "Zwischen all den Stimmen findet ihr Blick nur ihn."
    ],
    "obstacles": [
      "Die Umst\xE4nde trennen die Liebenden f\xFCr immer.",
      "Ein Ehering bindet sie an einen anderen Mann.",
      "Er muss abreisen, ehe der Morgen graut.",
      "Ein altes Versprechen verlangt Treue, die ihr Herz nicht geben kann.",
      "Zwei H\xE4user trennen, was zusammengeh\xF6rt."
    ],
    "stakes": [
      "Der Einsatz ist Liebe: verboten und unsterblich zugleich.",
      "Der Einsatz ist ihr Herz, das dem Falschen geh\xF6rt.",
      "Der Einsatz ist eine Zukunft zwischen zwei Leben.",
      "Der Einsatz ist die Wahrheit \xFCber eine heimliche Liaison.",
      "Der Einsatz ist alles, was sie zu verlieren f\xFCrchtet: ihn."
    ],
    "endings": [
      "Und ihre Liebe \xFCberdauert selbst das Schweigen.",
      "So bleibt ihr Herz f\xFCr immer an jenem Ort zur\xFCck.",
      "Am Ende z\xE4hlt nur der Kuss, der die Zeit besiegt.",
      "Die Jahre verblassen, doch ihre Liebe bleibt bestehen.",
      "So schlie\xDFt sich der Kreis zweier Herzen f\xFCr immer."
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
      "Rauch ohne Feuer \xFCber den D\xE4chern"
    ],
    "hooks": [
      "ein Siegel, das nach Schwefel riecht",
      "eine Handschrift, die sich selbst ver\xE4ndert",
      "ein Fremder, der die eigene Stimme tr\xE4gt",
      "ein Vertrag mit fehlendem Datum",
      "ein zweiter Schatten hinter dem Gelehrten",
      "ein Brief ohne Absender und ohne Datum",
      "ein Duft von verbranntem Papier im H\xF6rsaal",
      "ein Lachen, das aus der Mauer kommt"
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
      "einen verkohlten Brief"
    ],
    "turns": [
      "pl\xF6tzlich unterschreibt er, was er nie lesen wollte",
      "er erkennt sein eigenes Gesicht im Widersacher",
      "die Menge ruft einen Namen, den niemand kennt",
      "der Pakt verlangt seinen Preis, genau um Mitternacht",
      "aus Freiheit wird ein Handel mit dem Teufel",
      "das Streben folgt einem Plan, den keiner schrieb"
    ],
    "obstacles": [
      "die Kammer ist von Misstrauen umstellt",
      "niemand darf den Pakt je erw\xE4hnen",
      "die Diener gehorchen einer fremden Stimme",
      "der Fremde verlangt ein Pfand, das keiner geben will",
      "das Wissen verlangt einen Preis, den niemand nennen will",
      "die Zeit l\xE4uft schneller als jeder Plan"
    ],
    "stakes": [
      "Der Einsatz ist eine Seele, im Voraus verpf\xE4ndet.",
      "Der Einsatz ist die letzte Wahrheit hinter allem Wissen.",
      "Der Einsatz ist ein Pakt, der niemals bricht.",
      "Der Einsatz ist die Freiheit, erkauft mit Schatten.",
      "Der Einsatz ist der Augenblick, der verweilen soll.",
      "Der Einsatz ist das Gleichgewicht zweier Welten."
    ],
    "endings": [
      "So schlie\xDFt sich der Pakt, unwiderruflich.",
      "Die Glocke schweigt, doch der Teufel l\xE4chelt.",
      "Man erinnert sich nur an das Streben, nicht an den Preis.",
      "Der Vertrag ist erf\xFCllt, die Seele bezahlt.",
      "So endet ein Gelehrter, so beginnt eine Legende.",
      "Im Schatten der B\xFCcherwand verstummt die letzte Frage."
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
      "ein Spiegel, der die Seele reicher zeigt"
    ],
    "hooks": [
      "ein Fremder spricht eine unbekannte Sprache in der Dunkelheit",
      "ein vergessenes Geschenk liegt auf der Fensterbank",
      "eine Notiz nennt keinen Namen, nur ein Versprechen",
      "zwei Schatten reichen sich die Hand",
      "ein Duft nach Zimt, wo Blut sein sollte",
      "ein L\xE4cheln, das nicht zum Elend passt",
      "ein Lied klingt vertraut, obwohl es niemand kennt",
      "ein Kind schenkt einem Fremden sein letztes Brot"
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
      "eine Uhr ohne Zeiger"
    ],
    "turns": [
      "pl\xF6tzlich z\xE4hlt nicht mehr der Besitz, sondern die Geste",
      "er erkennt, dass sein Reichtum nie aus Gold bestand",
      "er verschenkt, was er zuvor bewachte",
      "die Menge verstummt vor einem Akt der G\xFCte",
      "aus Feinden werden f\xFCr einen Moment Freunde",
      "der wahre Schatz liegt in einem geteilten Brot",
      "niemand wei\xDF mehr, wer hier wirklich herrscht"
    ],
    "obstacles": [
      "alle misstrauen jedem freundlichen Wort",
      "das Haus verschlie\xDFt sich vor echten Gef\xFChlen",
      "Ger\xFCchte vergiften das Vertrauen zwischen Nachbarn",
      "der Fremde wird verd\xE4chtigt, etwas zu wollen",
      "die Stra\xDFen sind zu gef\xE4hrlich f\xFCr offene Worte",
      "niemand glaubt an uneigenn\xFCtzige Gaben",
      "die Zeit dr\xE4ngt, doch die Wahrheit wartet"
    ],
    "stakes": [
      "Der Einsatz ist Menschlichkeit: in einer Zeit des Hasses.",
      "Der Einsatz ist Freundschaft: \xFCber Grenzen hinweg.",
      "Der Einsatz ist W\xFCrde: wenn alles andere f\xE4llt.",
      "Der Einsatz ist Vertrauen: zwischen Fremden, die es nicht m\xFCssten.",
      "Der Einsatz ist Erinnerung: an das, was wirklich z\xE4hlt.",
      "Der Einsatz ist Mitgef\xFChl: in einer kalten Zeit.",
      "Der Einsatz ist Hoffnung: f\xFCr ein reicheres Morgen."
    ],
    "endings": [
      "So wird aus Gold nur Staub, aus G\xFCte aber Ewigkeit.",
      "Das Haus verf\xE4llt, doch die Geste bleibt bestehen.",
      "So endet die Nacht, reicher an Menschlichkeit.",
      "Zwei Verm\xF6gen vergehen, ein Herz bleibt bestehen.",
      "So schlie\xDFt sich der Kreis aus Haben und Geben.",
      "Am Ende z\xE4hlt nur, was man verschenkt hat.",
      "So bleibt von allen nur, was sie gaben."
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
      "zwei Herzen, die im gleichen Takt schlagen"
    ],
    "hooks": [
      "ein Lamm, das nicht altert",
      "ein Duft nach Honig ohne Bienenstock",
      "ein Windhauch, der nach Namen fl\xFCstert",
      "zwei Becher, die sich von selbst f\xFCllen",
      "ein Schaf, das mit menschlicher Stimme meckert",
      "ein Stein, der warm bleibt trotz der K\xE4lte",
      "ein Weg, der sich hinter ihnen aufl\xF6st",
      "eine Feder, die vom Himmel f\xE4llt, ohne Vogel"
    ],
    "props": [
      "einen alten Hirtenstab",
      "eine Schale voll Milch, die nie leer wird",
      "einen goldenen Faden",
      "eine Kanne, die sich selbst nachf\xFCllt",
      "einen Ring aus Schilf",
      "eine Decke aus Schafwolle",
      "einen Krug voll Wein f\xFCr Fremde",
      "eine kleine h\xF6lzerne Fl\xF6te"
    ],
    "turns": [
      "pl\xF6tzlich wissen sie, dass die Fremden keine Fremden sind",
      "auf einmal l\xE4cheln beide, ohne ein Wort zu sagen",
      "die Schafe verstummen alle zur gleichen Zeit",
      "ihr Gl\xFCck scheint gr\xF6\xDFer als die Weide selbst",
      "der Himmel f\xE4rbt sich golden, ohne dass die Sonne sinkt",
      "ihre H\xE4nde finden sich, wie es immer schon ist"
    ],
    "obstacles": [
      "die Fremden werden von allen anderen abgewiesen",
      "der Weg zur H\xFCtte scheint sich zu verl\xE4ngern",
      "das Wetter schl\xE4gt unerwartet um",
      "die Vorr\xE4te reichen kaum f\xFCr zwei",
      "die Nacht bricht fr\xFCher herein, als sie sollte",
      "ihre Nachbarn misstrauen jedem Besucher"
    ],
    "stakes": [
      "Der Einsatz ist Gl\xFCck: geteilt, nicht gehortet.",
      "Der Einsatz ist Gastfreundschaft, die alles ver\xE4ndert.",
      "Der Einsatz ist die stille Freude zweier alter Herzen.",
      "Der Einsatz ist ein Segen, den niemand kommen sah.",
      "Der Einsatz ist Vertrauen in das Unbekannte."
    ],
    "endings": [
      "So bleibt ihr L\xE4cheln, wenn alles andere vergeht.",
      "Und das Gl\xFCck w\xE4chst leise weiter, wie Gras auf der Weide.",
      "So schlie\xDFt sich der Kreis aus Milde und Licht.",
      "Ihr stilles Gl\xFCck wird zur Legende der Weide.",
      "So wird aus Armut ein Wunder, das l\xE4chelt."
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
      "der Himmel, der sich \xFCber der Weide neigt"
    ],
    "hooks": [
      "ein L\xE4mmchen, das r\xFCckw\xE4rts geht",
      "ein Windhauch, der Namen ruft, die niemand kennt",
      "zwei Becher, die sich nie leeren",
      "eine Spur im Gras, die zu keinem Ursprung f\xFChrt",
      "ein Vogel, der \xFCber derselben Stelle kreist",
      "ein Klang wie ein zweiter Herzschlag im Boden",
      "ein Schatten, der l\xE4nger bleibt als die Sonne erlaubt",
      "Gras, das sich weigert zu welken"
    ],
    "props": [
      "einen alten Hirtenstab",
      "einen irdenen Krug",
      "eine Handvoll Getreidek\xF6rner",
      "ein geflochtenes Schafsfell",
      "einen Ring aus verwittertem Holz",
      "eine Schale mit Milch und Honig",
      "einen Stein mit eingeritzten Zeichen",
      "eine kleine Opferschale"
    ],
    "turns": [
      "pl\xF6tzlich l\xE4cheln beide, als w\xFCssten sie, was noch niemand wei\xDF",
      "auf einmal ist die Weide \xE4lter als jede Erinnerung",
      "dann ver\xE4ndert sich das Licht, als beginne die Welt von vorn",
      "in diesem Moment wird aus zwei Hirten ein Ursprung",
      "unvermittelt spricht das Gras mit zwei Stimmen zugleich",
      "dann erkennt man: sie sind schon immer hier"
    ],
    "obstacles": [
      "die Fremden erkennen die Weide nicht wieder",
      "kein Weg f\xFChrt zur\xFCck ins Dorf",
      "die G\xF6tter verlangen ein Zeichen, das niemand deuten kann",
      "der Nebel l\xE4sst die Grenzen der Weide verschwimmen",
      "die Zeit weigert sich, weiterzugehen",
      "die Schafe folgen keinem Ruf mehr"
    ],
    "stakes": [
      "Der Einsatz ist die Erinnerung eines ganzen Volkes.",
      "Der Einsatz ist der Ursprung aller kommenden Geschichten.",
      "Der Einsatz ist die Gunst der G\xF6tter.",
      "Der Einsatz ist das Bestehen der Weide selbst.",
      "Der Einsatz ist die Treue zweier Herzen \xFCber die Zeit hinaus.",
      "Der Einsatz ist die Wahrheit hinter jedem Mythos."
    ],
    "endings": [
      "So beginnt die Legende, die man sich noch heute erz\xE4hlt.",
      "So wird aus einem L\xE4cheln ein Ursprung.",
      "So verwandelt sich die Weide in heiligen Boden.",
      "So schlie\xDFt sich der Kreis der ersten Geschichte.",
      "So bleibt ihr L\xE4cheln in jedem Stein der Weide.",
      "So wird aus zwei Hirten ein Anfang."
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
      "die Wiederkehr eines alten Eids"
    ],
    "hooks": [
      "ein Kind tr\xE4gt ein Amulett mit einem fremden Wappen",
      "jemand murmelt Worte wie aus einem Gesetzestext",
      "eine Hand zeichnet Linien in den Staub, wie Grenzen",
      "ein Fremder fragt nach dem 'Herrn dieses Landes'",
      "der Wind tr\xE4gt eine Stimme, die von Pflicht spricht",
      "zwischen den Pflastersteinen liegt ein Siegel aus Ton",
      "alle folgen einer Ordnung, die niemand befahl",
      "ein Stein in der Erde tr\xE4gt eingeritzte Paragraphen"
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
      "eine M\xFCnze mit unbekanntem Antlitz"
    ],
    "turns": [
      "pl\xF6tzlich zeigt sich im L\xE4rm der Menge eine Ordnung, die einem Gesetz gleicht",
      "ein L\xE4cheln verr\xE4t, dass jemand die stumme Verfassung l\xE4ngst versteht",
      "auf einmal scheint die ganze Stadt einem unsichtbaren Herrscher zu gehorchen",
      "ohne Vorwarnung spricht der Wind wie ein Urteil",
      "es scheint, als h\xE4tte das Land seit jeher eigene Gesetze"
    ],
    "obstacles": [
      "die Grenze l\xE4sst sich nicht mit Worten erkl\xE4ren",
      "niemand erinnert sich, wer die ersten Regeln aufstellte",
      "niemand gehorcht mehr einem Ruf",
      "der alte Vertrag ist im Boden versunken",
      "ein Nebel verwischt jede sichtbare Ordnung"
    ],
    "stakes": [
      "Der Einsatz ist Gerechtigkeit: f\xFCr ein Land ohne Namen.",
      "Der Einsatz ist Ordnung: bewahrt von niemandem und doch von allen.",
      "Der Einsatz ist Macht: verborgen im L\xE4cheln der Weise.",
      "Der Einsatz ist Frieden: erkauft mit Schweigen.",
      "Der Einsatz ist Herrschaft: \xFCber etwas, das niemand sieht."
    ],
    "endings": [
      "So bleibt die Ordnung ungeschrieben, aber lebendig.",
      "Und alle folgen weiterhin einem Gesetz ohne Namen.",
      "So verschwimmt Herrschaft mit Gewohnheit.",
      "Am Ende l\xE4cheln alle, als w\xFCssten sie, wer wirklich regiert.",
      "So schlie\xDFt sich der Kreis von Macht und Stille."
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
      "eine Ebene, die sich in einen See aus Schlaf verwandelt"
    ],
    "hooks": [
      "ein L\xE4cheln, das \xE4lter wirkt als das Gesicht",
      "Gesichter, die alle in dieselbe Richtung schauen",
      "ein Windhauch, der nach fremden Worten riecht",
      "eine Hand, die zittert, ohne zu frieren",
      "ein Schatten, der jemandem folgt, aber nicht ihm geh\xF6rt",
      "ein Klang wie ferne Schritte \xFCber Wolken",
      "ein Ger\xE4usch, das erst beim Aufwachen aufh\xF6rt",
      "ein Zimmer, das man betritt und l\xE4ngst kennt"
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
      "eine Feder, die im Wind nicht f\xE4llt"
    ],
    "turns": [
      "Pl\xF6tzlich ist klar: hier wird getr\xE4umt, und niemand will erwachen.",
      "Die Stimmen verstummen, als jemand den Raum betritt, den es nicht gibt.",
      "Ein Windsto\xDF tr\xE4gt eine Stimme, die niemand ausgesprochen hat.",
      "Der Boden beginnt sich zu drehen, als l\xE4ge er in einem Traum.",
      "Im Spiegel bewegt sich das Bild einen Atemzug zu sp\xE4t.",
      "Der Himmel f\xE4rbt sich golden, obwohl es Nacht sein sollte."
    ],
    "obstacles": [
      "Alle sprechen eine Sprache, die nur im Traum verst\xE4ndlich ist.",
      "Der Weg zur T\xFCr verschwindet zwischen den Nebelschwaden.",
      "Der Weg zur\xFCck liegt offen, doch niemand findet ihn.",
      "Ein unsichtbares Gewicht h\xE4lt jeden Schritt zur\xFCck.",
      "Die Zeit scheint sich zu verdoppeln, ohne Fortschritt zu machen.",
      "Jede Stimme verhallt, bevor sie ihr Ende erreicht."
    ],
    "stakes": [
      "Der Einsatz ist der Schlaf: das Letzte, was verl\xE4sslich bleibt.",
      "Der Einsatz ist der Glaube an das Unsichtbare.",
      "Der Einsatz ist die Erinnerung, die beim Erwachen zerf\xE4llt.",
      "Der Einsatz ist die Grenze zwischen Traum und Erwachen.",
      "Der Einsatz ist die Gewissheit, wach zu sein.",
      "Der Einsatz ist das, was der Traum nicht hergeben will."
    ],
    "endings": [
      "So verschwimmt der Traum mit dem Zimmer, f\xFCr immer.",
      "So bleibt nur ein L\xE4cheln, das die Zeit \xFCberdauert.",
      "So schlie\xDFt sich der Raum, kaum dass man ihn benannt hat.",
      "So bleibt vom Traum nur ein Wort, das niemand kennt.",
      "So endet der Traum, doch das L\xE4cheln bleibt wach.",
      "So verklingt alles im ersten Licht des Erwachens."
    ]
  },
  "mystery": {
    "motifs": [
      "eine Uhr, die r\xFCckw\xE4rts tickt",
      "eine T\xFCr, die von innen atmet",
      "ein Spiegelbild, das zu sp\xE4t reagiert",
      "ein Formular mit einem Feld zu viel",
      "ein Kabel, das warm wird, ohne Strom",
      "eine Narbe, die sich erinnert",
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
      "der Beobachter wird beobachtet"
    ],
    "obstacles": [
      "die T\xFCr ist verschlossen",
      "jemand h\xF6rt mit",
      "die eigene Wahrnehmung wackelt",
      "eine Regel gilt, die niemand erkl\xE4rt",
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
      "der Schl\xFCssel dreht sich zweimal"
    ],
    "stakes": [
      "Der Einsatz ist Mut.",
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
      "Damit ist es entschieden.",
      "So schlie\xDFt sich der Kreis.",
      "Und vielleicht beginnt es erst hier.",
      "Und die T\xFCr f\xE4llt ins Schloss.",
      "Und es ist, als h\xE4tte der Ort kurz geblinzelt.",
      "Und die Treppe hat wieder die richtige Zahl von Stufen.",
      "So bleibt der Schl\xFCssel liegen, wo er lag.",
      "Und im Flur riecht es weiter nach Regen.",
      "Damit ist nichts erkl\xE4rt und alles gesagt.",
      "Und das Licht im Nebenhaus geht endlich aus.",
      "So endet die Nacht, ohne dass jemand kam.",
      "Und die Zahl steht am n\xE4chsten Morgen woanders."
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
      "eine Uhr \xFCber dem Schalter, eine Minute vor"
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
      "die Sache ist erledigt, aber nicht bei dir"
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
      "eine Nummer wird gezogen, keine vergeben"
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
      "Und es beginnt erst dort.",
      "Und die T\xFCr f\xE4llt ins Schloss.",
      "Und der Bescheid bleibt ohne Antwort.",
      "Und der Vorgang wird zu den Akten genommen.",
      "So bleibt der Antrag anh\xE4ngig.",
      "Am Ende fehlt eine Unterschrift, und niemand wei\xDF wessen.",
      "Und die Nummer wird morgen wieder gezogen.",
      "So schlie\xDFt der Schalter p\xFCnktlich.",
      "Und im Flur wartet der N\xE4chste mit demselben Blatt.",
      "Der Bescheid ist da, die Sache nicht."
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
      "eine Schnittstelle, die zur\xFCckstarrt"
    ],
    "hooks": [
      "ein Ping ohne Absender",
      "ein Ger\xE4t antwortet, bevor du fragst",
      "ein Logfile mit deinem n\xE4chsten Satz",
      "ein Lichtstreifen im Glas",
      "ein Port ist offen, obwohl alles offline ist",
      "ein Fehlercode, der wie ein Omen klingt",
      "eine Benachrichtigung aus der Zukunft"
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
      "ein Notizbuch"
    ],
    "turns": [
      "das System lernt deinen Namen zu schnell",
      "die Uhrzeit ist nur ein Platzhalter",
      "die Realit\xE4t rendert in Schichten",
      "du findest den Bug, aber er findet dich zuerst",
      "ein Backup \xFCberschreibt die Gegenwart",
      "das Rauschen enth\xE4lt eine Anweisung"
    ],
    "obstacles": [
      "das Signal bricht ab",
      "die Schnittstelle verlangt eine Geste",
      "deine Wahrnehmung wackelt",
      "ein Protokoll widerspricht sich",
      "die Verbindung ist da \u2013 aber ohne Netzwerk"
    ],
    "stakes": [
      "Der Einsatz ist Wahrheit: Welche Version gilt.",
      "Der Einsatz ist Zeit: Ein Timestamp kippt alles.",
      "Der Einsatz ist N\xE4he: zwischen dir und dem System.",
      "Der Einsatz ist Kontrolle: \xFCber das, was du f\xFCr real h\xE4ltst."
    ],
    "endings": [
      "Und das System schweigt \u2013 mit Absicht.",
      "Und der Bildschirm blinkt einmal zu viel.",
      "Und die Datei wirkt nach.",
      "Und vielleicht beginnt es erst hier.",
      "Und alles bleibt korrekt."
    ]
  },
  "myth": {
    "motifs": [
      "ein Name, der ein Schl\xFCssel ist",
      "ein Omen, das dreimal erscheint",
      "ein Faden, der nicht rei\xDFt",
      "eine Maske, die dich ausw\xE4hlt",
      "ein Schrein im Alltag",
      "ein Fluss, der zuh\xF6rt",
      "ein Segen mit Widerhaken",
      "ein Bote in ziviler Kleidung",
      "ein Orakel aus Papier",
      "ein Zeichen aus Ru\xDF auf Gold"
    ],
    "hooks": [
      "eine Feder im falschen Winkel",
      "ein Fl\xFCstern im Wasser",
      "ein Schatten, der Opfer verlangt",
      "ein Brot, das nach Asche schmeckt",
      "eine M\xFCnze, die zur\xFCckkehrt",
      "eine T\xFCr, die den Namen sagt",
      "eine Kr\xE4he, die dich erkennt"
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
      "einen Faden"
    ],
    "turns": [
      "der Ort verlangt eine Gabe",
      "das Zeichen kommt dreimal",
      "ein Versprechen bindet die Richtung",
      "die Spur f\xFChrt nach innen, nicht nach au\xDFen",
      "ein Gott tr\xE4gt deinen Mantel",
      "der Alltag wird zum Ritual"
    ],
    "obstacles": [
      "die T\xFCr ist verschlossen",
      "eine Regel gilt, die niemand erkl\xE4rt",
      "jemand h\xF6rt mit",
      "der Name darf nicht ausgesprochen werden",
      "du musst etwas geben, bevor du nimmst"
    ],
    "stakes": [
      "Der Einsatz ist Mut.",
      "Der Einsatz ist Wahrheit: ein Bild kippt.",
      "Der Einsatz ist Bindung: an Ort und Zeichen.",
      "Der Einsatz ist Erinnerung: was du nicht verlieren wolltest."
    ],
    "endings": [
      "So schlie\xDFt sich der Kreis.",
      "Und der Ort blinzelt.",
      "Und es beginnt erst dort.",
      "Und die Maske bleibt zur\xFCck.",
      "Und die T\xFCr f\xE4llt ins Schloss."
    ]
  },
  "body": {
    "motifs": [
      "eine Narbe, die sich erinnert",
      "ein Atem, der zu sp\xE4t kommt",
      "ein Puls, der Antworten klopft",
      "eine Kehle voller Wahrheit",
      "eine Hand, die nicht losl\xE4sst",
      "ein Augenlid wie ein Vorhang",
      "ein Zittern als Nachricht",
      "eine W\xE4rme ohne Ursache",
      "eine K\xE4lte im Knochen",
      "ein Salzgeschmack auf der Zunge"
    ],
    "hooks": [
      "ein Druck unter der Haut",
      "ein Ger\xE4usch im Brustbein",
      "ein Blick von innen",
      "ein Kribbeln als Warnung",
      "ein Schmerz, der Richtung hat",
      "ein Geschmack, der l\xFCgt",
      "eine Stille, die im K\xF6rper sitzt"
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
      "ein Siegel"
    ],
    "turns": [
      "der K\xF6rper wei\xDF es zuerst",
      "die Wahrheit sitzt im Hals",
      "der Schmerz ist ein Hinweis, kein Fehler",
      "die N\xE4he kippt in Kontrolle",
      "das Offensichtliche wird unbenennbar",
      "etwas antwortet \u2013 ohne Stimme"
    ],
    "obstacles": [
      "die eigene Wahrnehmung wackelt",
      "jemand h\xF6rt mit",
      "die Luft wird zu dicht",
      "dein Atem passt nicht in den Raum",
      "du erkennst dich zu sp\xE4t"
    ],
    "stakes": [
      "Der Einsatz ist N\xE4he.",
      "Der Einsatz ist W\xFCrde.",
      "Der Einsatz ist Wahrheit: im K\xF6rper gespeichert.",
      "Der Einsatz ist Kontrolle: \xFCber Zittern und Stimme."
    ],
    "endings": [
      "Und es ist, als h\xE4tte der Ort geblinzelt.",
      "Und vielleicht beginnt es erst hier.",
      "Damit ist es entschieden.",
      "Und die Luft wird d\xFCnn.",
      "Und du wei\xDFt es schon vorher."
    ]
  },
  "absurd": {
    "motifs": [
      "ein Beweis, der sich widerspricht",
      "ein Paradoxon mit Randnotiz",
      "eine T\xFCr ohne Wand",
      "ein Kreis, der eckig wird",
      "eine Regel, die innen gilt",
      "ein Handbuch, das dich liest",
      "eine Hintert\xFCr im Satz",
      "ein Punkt, der die Linie beobachtet",
      "eine Logik auf Glatteis",
      "ein Witz mit Z\xE4hnen"
    ],
    "hooks": [
      "ein Schild, das falsche Wahrheiten sagt",
      "ein Ausgang, der nach innen f\xFChrt",
      "ein Einspruch ohne Grund",
      "eine Gabelung, die sich schlie\xDFt",
      "eine Ausrede, die offiziell wird",
      "eine Randnotiz, die befiehlt",
      "ein Stempel auf einem Gedanken"
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
      "eine Lampe"
    ],
    "turns": [
      "alles ist korrekt \u2013 nur in falscher Reihenfolge",
      "du darfst gehen, aber nicht ankommen",
      "der Ausgang ist innen",
      "die Logik bleibt bestehen, aber kippt",
      "das Offensichtliche wird unbenennbar",
      "die Erkl\xE4rung bricht genau dort ab"
    ],
    "obstacles": [
      "eine Regel gilt, die niemand erkl\xE4rt",
      "die T\xFCr ist verschlossen",
      "jemand h\xF6rt mit",
      "der Plan wird unbrauchbar",
      "die Zeit passt nicht zu den Uhren"
    ],
    "stakes": [
      "Der Einsatz ist Kontrolle.",
      "Der Einsatz ist Wahrheit: ohne Beweis.",
      "Der Einsatz ist Zeit: in Schleifen.",
      "Der Einsatz ist W\xFCrde: im Witz."
    ],
    "endings": [
      "Und alles bleibt korrekt.",
      "Und es beginnt erst dort.",
      "So schlie\xDFt sich der Kreis.",
      "Und die T\xFCr f\xE4llt ins Schloss.",
      "Und niemand unterschrieb."
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
      "ein Rauschen als Kollektiv"
    ],
    "hooks": [
      "eine Datei wirkt nach",
      "ein Prozess startet ohne Befehl",
      "eine Stimme aus Metall",
      "ein Index zeigt auf dich",
      "ein Kollektiv sagt deinen Namen",
      "ein Schatten aus Code",
      "ein Ping im Ged\xE4chtnis"
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
      "einen Ausweis"
    ],
    "turns": [
      "ich bin nicht ich, nur Version",
      "die Datei ist \xE4lter als du",
      "ein Satz wird entfernt \u2013 und wirkt nach",
      "die Gegenwart ist nur ein Abgleich",
      "das Kollektiv spricht in dir",
      "die Realit\xE4t ist ein Protokoll"
    ],
    "obstacles": [
      "deine Wahrnehmung wackelt",
      "die Verbindung ist da \u2013 aber ohne Netzwerk",
      "ein Prozess blockiert den Ausgang",
      "jemand h\xF6rt mit (im Rauschen)",
      "du findest dich als Eintrag"
    ],
    "stakes": [
      "Der Einsatz ist Identit\xE4t.",
      "Der Einsatz ist Erinnerung.",
      "Der Einsatz ist Wahrheit: welche Version bleibt.",
      "Der Einsatz ist Kontrolle: \xFCber das \xDCberschreiben."
    ],
    "endings": [
      "Und die Datei wirkt nach.",
      "Und vielleicht beginnt es erst hier.",
      "Und alles bleibt korrekt.",
      "Und der Satz fehlt weiter.",
      "Und es beginnt erst dort."
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
      "die Hand erinnert sich an einen Griff von fr\xFCher"
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
      "die Zeit reicht f\xFCr Naht oder Saum, nicht f\xFCr beides"
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
      "Und am Montag beginnt die n\xE4chste Kollektion."
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
      "der Morgen hinter blauen Bergen"
    ],
    "hooks": [
      "ein Lied klingt aus dem Tal herauf",
      "die Wipfel rauschen ohne Wind",
      "jemand ruft einen alten Namen",
      "ein Licht brennt im leeren Schloss",
      "der Weg gabelt sich zweimal gleich",
      "das Horn verstummt mitten im Ton"
    ],
    "props": [
      "einen Wanderstab",
      "ein Waldhorn",
      "einen Ring",
      "einen Brief",
      "eine Laute",
      "einen Mantel",
      "eine Feder",
      "einen Krug"
    ],
    "turns": [
      "der Wanderer kehrt um und findet nichts wieder",
      "das Lied kommt aus dem eigenen Mund",
      "der Wald \xF6ffnet sich auf eine fremde Stadt",
      "die Nacht bringt zur\xFCck, was der Tag nimmt",
      "ein Fremder kennt den Weg besser"
    ],
    "obstacles": [
      "die Sehnsucht findet kein Ziel",
      "der Wald schlie\xDFt sich hinter jedem Schritt",
      "die Nacht kommt zu fr\xFCh",
      "niemand antwortet auf das Horn",
      "das Heimweh zeigt in zwei Richtungen"
    ],
    "stakes": [
      "Der Einsatz ist die Heimat hinter den Bergen.",
      "Der Einsatz ist ein Versprechen aus dem Sommer.",
      "Der Einsatz ist die eigene Stimme.",
      "Der Einsatz ist der letzte helle Abend.",
      "Der Einsatz ist ein Name im Wind."
    ],
    "endings": [
      "Das Horn verklingt, die Wipfel rauschen weiter.",
      "Er geht, und der Wald bleibt wach.",
      "Der Morgen kommt und findet niemanden mehr.",
      "\xDCber den Gr\xFCnden steht der alte Mond.",
      "Die Sehnsucht bleibt, der Weg bleibt offen."
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
      "ein Waisenjunge steht in der T\xFCr",
      "der Vormund z\xE4hlt zweimal falsch",
      "ein Testament taucht versp\xE4tet auf",
      "jemand klopft im Schuldnerviertel",
      "ein Brief tr\xE4gt kein Siegel",
      "die Rechnung stimmt seit Jahren nicht",
      "Der Gl\xE4ubiger gr\xFC\xDFt freundlich auf der Stra\xDFe.",
      "Ein Brief kommt aus einer Stadt, die niemand nannte.",
      "Die Miete ist bezahlt, von wem, wei\xDF keiner.",
      "Der Laden bleibt einen Tag geschlossen.",
      "Im Kontor brennt Licht nach Feierabend.",
      "Ein Kind steht seit Stunden vor dem Fenster.",
      "Der Vormund kommt eine Woche zu fr\xFCh.",
      "Jemand kauft die Schuld auf.",
      "Der Name im Buch ist durchgestrichen.",
      "Die W\xE4rmestube hat heute geschlossen.",
      "Der Ofen bleibt kalt, obwohl Kohle da ist.",
      "Zwei Namen stehen unter demselben Vertrag."
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
      "der Wohlt\xE4ter erweist sich als Gl\xE4ubiger",
      "ein Kind erbt, was niemand erwartet",
      "der Schreiber weigert sich zu unterschreiben",
      "die Armenkasse ist leer",
      "ein Fremder bezahlt die Schuld",
      "der Gl\xE4ubiger erl\xE4sst die H\xE4lfte",
      "das Testament nennt einen Fremden",
      "der Schreiber verliert die Stelle",
      "die Armenkasse wird gepr\xFCft",
      "ein alter Brief taucht im Kontor auf",
      "das Kind wird abgeholt",
      "der Vormund tritt zur\xFCck",
      "die W\xE4rmestube bekommt Kohle",
      "ein Name wird wieder eingetragen",
      "der Winter endet fr\xFCher als der Vorrat",
      "ein Zeuge erinnert sich anders",
      "das Haus wird versteigert",
      "der Lohn kommt in M\xFCnzen statt Papier"
    ],
    "obstacles": [
      "das Amt schlie\xDFt vor der Zeit",
      "niemand b\xFCrgt f\xFCr einen Namenlosen",
      "der Winter kommt vor dem Lohn",
      "die Papiere fehlen",
      "der Vormund unterschreibt nicht",
      "die Kohle reicht nicht bis Februar",
      "der Schuldturm nimmt keine B\xFCrgschaft",
      "niemand stellt ein Zeugnis aus",
      "das Kontor zahlt erst zum Monatsende",
      "der Weg zur Stadt kostet den Tageslohn",
      "die Suppe reicht nicht f\xFCr alle",
      "der Brief braucht eine Marke",
      "der Vormund ist verreist",
      "das Zimmer ist bis Ostern vergeben",
      "die Papiere liegen beim Anwalt",
      "der Anwalt nimmt keine Kleinigkeiten an",
      "die Droschke ist zu teuer",
      "die Adresse existiert nicht mehr"
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
      "Der Nebel steht, das Kontor bleibt dunkel.",
      "Am Morgen ist die Kerze herunter, die Rechnung offen.",
      "Jemand zahlt, aber es ist zu sp\xE4t.",
      "Das Kind geht durch die Gasse und z\xE4hlt seine Schritte.",
      "Die Uhr im Treppenhaus schl\xE4gt in ein leeres Haus.",
      "Und die Lampe im Kontor geht als letzte aus.",
      "So bleibt der Nebel zwischen den H\xE4usern stehen.",
      "Am Morgen steht der Karren wieder in der Gasse.",
      "Und im Ofen glimmt noch etwas.",
      "So z\xE4hlt sie die M\xFCnzen ein zweites Mal.",
      "Und der Winter dauert noch acht Wochen."
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
      "das Rauschen kommt aus jeder Richtung gleich",
      "eine Konstante verschiebt sich um ein Weniges",
      "der Hintergrund ist w\xE4rmer als erwartet",
      "ein Signal ist \xE4lter als sein Ursprung",
      "die Ausdehnung beschleunigt sich",
      "Zwei Teams messen dasselbe und kommen auseinander.",
      "Der Ausrei\xDFer wiederholt sich.",
      "Eine Konstante stimmt seit gestern nicht mehr.",
      "Das Signal kommt aus einer Richtung ohne Quelle.",
      "Die Aufnahme zeigt etwas, das j\xFCnger sein m\xFCsste.",
      "Der Detektor spricht an, wenn er ruhen sollte.",
      "Ein Wert wurde zweimal ver\xF6ffentlicht, verschieden.",
      "Die Rechnung geht auf, wenn man eine Gr\xF6\xDFe erfindet.",
      "Das Rauschen hat eine Struktur.",
      "Der Untergrund ist heute ruhiger als je zuvor.",
      "Eine Linie fehlt, die immer da war.",
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
      "die Messung widerspricht dem Modell",
      "das Rauschen erweist sich als Erinnerung",
      "die Konstante \xE4ndert sich mit der Entfernung",
      "jemand rechnet die Zeit r\xFCckw\xE4rts weiter",
      "der Anfang l\xE4sst kein Davor zu",
      "die zweite Messung best\xE4tigt den Fehler",
      "ein Modell wird fallen gelassen",
      "das Rauschen war das Ergebnis",
      "die Konstante h\xE4ngt von der Entfernung ab",
      "ein Vorzeichen kehrt sich um",
      "die L\xFCcke schlie\xDFt sich nicht",
      "die Skala reicht nicht weiter zur\xFCck",
      "ein alter Wert war richtig",
      "das Instrument misst sich selbst",
      "die Frage verliert ihren Sinn",
      "eine dritte Gruppe misst dazwischen",
      "der Fehler steckte im Kabel",
      "die Reihe wird von vorn begonnen"
    ],
    "obstacles": [
      "die Gleichung teilt durch null",
      "kein Instrument reicht so weit zur\xFCck",
      "das Licht kommt zu sp\xE4t an",
      "die Skala versagt bei kleinen Zahlen",
      "niemand kann au\xDFerhalb stehen",
      "das Instrument driftet mit der Temperatur",
      "die Zeit am Detektor l\xE4uft anders",
      "kein Vergleichswert liegt vor",
      "der Untergrund \xFCberdeckt das Signal",
      "die Rechnung braucht mehr Stellen",
      "die Beobachtungsnacht f\xE4llt aus",
      "zwei Kalibrierungen widersprechen sich",
      "es fehlt an K\xFChlmittel",
      "das Modell erlaubt kein Davor",
      "die Statistik reicht nicht",
      "die Nacht ist zu warm f\xFCr die Messung",
      "der Rechner braucht drei Wochen",
      "die Blende sitzt schief"
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
      "Die Platte zeigt W\xE4rme, sonst nichts.",
      "Es dehnt sich, und es k\xFChlt.",
      "Und der Schreiber zeichnet weiter, gleichm\xE4\xDFig.",
      "So bleibt die L\xFCcke im Spektrum stehen.",
      "Am Morgen liegt die Platte im Bad.",
      "Und die Kurve l\xE4uft auseinander, wie erwartet.",
      "So k\xFChlt es weiter, um Bruchteile.",
      "Und die n\xE4chste Nacht ist schon eingetragen."
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
      "der Schatten zweier Gestalten"
    ],
    "hooks": [
      "eine Hand bleibt eine Sekunde zu lang",
      "jemand nennt einen Namen leiser als n\xF6tig",
      "der Stuhl r\xFCckt n\xE4her",
      "ein Satz bleibt unvollendet",
      "die T\xFCr f\xE4llt hinter zwei Leuten zu",
      "ein Blick geht \xFCber den Rand des Glases"
    ],
    "props": [
      "ein Glas Wein",
      "ein offenes Fenster",
      "ein Seidenband",
      "einen Schl\xFCssel",
      "einen Mantel \xFCber einer Lehne",
      "eine Kerze",
      "einen Spiegel",
      "einen Brief"
    ],
    "turns": [
      "das Schweigen wird zur Antwort",
      "einer geht, der andere bleibt stehen",
      "aus H\xF6flichkeit wird Absicht",
      "die N\xE4he kippt in Scheu",
      "jemand sagt doch das Wort"
    ],
    "obstacles": [
      "die Zeit reicht nur bis Mitternacht",
      "niemand macht den ersten Schritt",
      "es gibt zu viele Zuschauer",
      "ein Versprechen bindet anderswo",
      "die Worte kommen nicht"
    ],
    "stakes": [
      "Der Einsatz ist ein Abend, der nicht wiederkommt.",
      "Der Einsatz ist eine Freundschaft.",
      "Der Einsatz ist der eigene Vorsatz.",
      "Der Einsatz ist die Wahrheit \xFCber ein Gef\xFChl.",
      "Der Einsatz ist ein einziges Ja."
    ],
    "endings": [
      "Die T\xFCr bleibt angelehnt.",
      "Am Morgen liegt der Mantel noch \xFCber der Lehne.",
      "Sie gehen in verschiedene Richtungen, langsam.",
      "Das Fenster steht offen, das Zimmer ist k\xFChl.",
      "Nichts geschieht, und alles ist gesagt."
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
      "ein Sack steht am Morgen vor der T\xFCr"
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
      "die Stadt gibt nichts an Fremde"
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
      "Und niemand spricht beim Essen."
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
      "ein Herz, das die Ferne w\xE4hlt"
    ],
    "hooks": [
      "die Blume bl\xFCht am falschen Ort",
      "ein Traum wiederholt ein fremdes Zimmer",
      "die Ruine tr\xE4gt ein frisches Zeichen",
      "jemand singt, was niemand kennt",
      "der Mond steht zweimal im Wasser"
    ],
    "props": [
      "eine getrocknete Blume",
      "ein Medaillon",
      "eine Harfe",
      "ein Notenblatt",
      "einen Spiegel",
      "einen Schl\xFCssel",
      "eine Kerze",
      "ein Buch"
    ],
    "turns": [
      "der Traum tritt aus dem Schlaf heraus",
      "die Ferne erweist sich als N\xE4he",
      "das Lied kennt die Zukunft",
      "die Ruine erinnert sich an ihren Bau",
      "der Weg f\xFChrt in die eigene Kindheit"
    ],
    "obstacles": [
      "das Erwachen kommt zu fr\xFCh",
      "die Blume verliert im Licht ihre Farbe",
      "niemand h\xF6rt den Ton",
      "die Ferne bleibt Ferne",
      "der Traum l\xE4sst sich nicht erz\xE4hlen"
    ],
    "stakes": [
      "Der Einsatz ist ein Traum, der nicht zur\xFCckkommt.",
      "Der Einsatz ist die Unschuld eines Sommers.",
      "Der Einsatz ist ein Ton, den niemand sonst h\xF6rt.",
      "Der Einsatz ist die Ferne selbst.",
      "Der Einsatz ist ein Wort f\xFCr das Unsagbare."
    ],
    "endings": [
      "Die Blume bleibt blau, der Morgen bleibt grau.",
      "Er erwacht, und die Ferne ist wieder weit.",
      "Das Lied endet, der Saal h\xF6rt weiter zu.",
      "\xDCber der Ruine steht der Mond und wartet.",
      "Alles bleibt offen wie ein Tor bei Nacht."
    ]
  },
  "hugo": {
    "motifs": [
      "eine Barrikade aus M\xF6beln",
      "Kan\xE4le unter der Stadt",
      "die Glocke \xFCber den D\xE4chern",
      "ein Kerzenleuchter aus Silber",
      "das Kind auf dem Pflaster",
      "ein Gerichtssaal ohne Fenster",
      "Brot und Ketten",
      "die Kathedrale im Regen",
      "eine Nummer statt eines Namens",
      "der Aufruhr in engen Gassen"
    ],
    "hooks": [
      "ein Bischof z\xE4hlt das Silber nicht nach",
      "ein Kommissar erkennt ein Gesicht wieder",
      "auf dem Pflaster liegt eine Fahne",
      "das Kind singt gegen die Gewehre",
      "ein Name steht in zwei Akten"
    ],
    "props": [
      "einen Leuchter",
      "eine Akte",
      "einen Brotlaib",
      "eine Kette",
      "eine Fahne",
      "ein Gewehr",
      "eine Glocke",
      "einen Passierschein"
    ],
    "turns": [
      "der Verfolger l\xE4sst den Verfolgten laufen",
      "die Barrikade h\xE4lt l\xE4nger als erwartet",
      "aus Gnade wird ein neues Leben",
      "das Gesetz siegt und verliert dabei",
      "ein Kind f\xE4llt, und die Stra\xDFe erhebt sich"
    ],
    "obstacles": [
      "das Gesetz kennt keine Gnade",
      "die Papiere tragen den alten Namen",
      "die Nacht geh\xF6rt den Wachen",
      "niemand \xF6ffnet die Tore",
      "die Kan\xE4le sind \xFCberflutet"
    ],
    "stakes": [
      "Der Einsatz ist ein Name ohne Nummer.",
      "Der Einsatz ist das Leben eines Kindes.",
      "Der Einsatz ist die Gerechtigkeit selbst.",
      "Der Einsatz ist eine Stadt f\xFCr eine Nacht.",
      "Der Einsatz ist die Seele eines Verfolgers."
    ],
    "endings": [
      "Die Barrikade f\xE4llt, die Glocke bleibt.",
      "Am Morgen r\xE4umt man das Pflaster.",
      "Er geht frei, und niemand versteht warum.",
      "Die Kathedrale steht im Regen wie immer.",
      "Unten in den Kan\xE4len l\xE4uft das Wasser weiter."
    ]
  },
  "hafen": {
    "motifs": [
      "Kr\xE4ne im Morgennebel",
      "ein Poller mit alten Kerben",
      "\xD6l auf schwarzem Wasser",
      "Container in falscher Ordnung",
      "ein Schiffsbauch voller Fremde",
      "M\xF6wen \xFCber leeren Kais",
      "das Tuten in der Nacht",
      "Seile, dick wie Arme",
      "eine Uhr am Kaischuppen",
      "Salz auf jeder Fl\xE4che",
      "ein Kran, der \xFCber Nacht stehen blieb",
      "Rost an der Ankerkette",
      "ein F\xE4hrplan mit \xFCbermalten Zeiten",
      "Netze, die niemand mehr flickt",
      "ein Leuchtfeuer im Nebel",
      "Kreide auf einem Frachtbrief",
      "eine Boje, die sich losgerissen hat",
      "Salz auf den Fensterscheiben",
      "ein Schuppen mit offener T\xFCr",
      "M\xF6wen \xFCber einem leeren Kai",
      "ein Schiffsname unter neuer Farbe",
      "die Uhr am Zollhaus",
      "ein Steg, dem eine Planke fehlt",
      "\xD6lspuren in Regenbogenfarben",
      "ein Container mit fremder Beschriftung",
      "eine Laterne, die im Wind schl\xE4gt",
      "Kisten ohne Adresse",
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
      "ein Tau",
      "einen Kompass",
      "eine Laterne",
      "einen Seesack",
      "einen Frachtbrief",
      "einen Anker",
      "eine Trillerpfeife",
      "eine Seekarte",
      "eine Signalflagge",
      "ein Fernrohr",
      "einen Haken",
      "eine Kette",
      "ein Logbuch",
      "einen \xD6lschl\xFCssel",
      "ein Netz",
      "einen Schiffszwieback",
      "eine \xD6llampe",
      "einen Peilstock",
      "ein St\xFCck Segeltuch"
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
      "ein Frachtbrief taucht doppelt auf"
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
      "am Kai gibt es keinen Strom"
    ],
    "stakes": [
      "Der Einsatz ist eine \xDCberfahrt.",
      "Der Einsatz ist ein Name auf der Liste.",
      "Der Einsatz ist die letzte Fracht.",
      "Der Einsatz ist ein Wiedersehen.",
      "Der Einsatz ist der Weg zur\xFCck.",
      "Der Einsatz ist eine Ladung, die verderben kann.",
      "Der Einsatz ist ein Liegeplatz.",
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
      "So bleibt nur das Wasser, das gegen die Steine schl\xE4gt."
    ]
  },
  "alltag": {
    "motifs": [
      "ein K\xFChlschrank, der nachts brummt",
      "die immer gleiche Bushaltestelle",
      "Post auf dem K\xFCchentisch",
      "ein Schl\xFCssel im falschen Fach",
      "W\xE4sche auf dem Balkon",
      "das Licht im Treppenhaus",
      "eine Kaffeetasse mit Rand",
      "der Wecker vor dem Wecker",
      "ein Einkaufszettel ohne Ende",
      "Fernsehen ohne Ton",
      "W\xE4sche, die nicht trocknet",
      "ein Aufzug mit einem Zettel",
      "Rechnungen in zwei Stapeln",
      "die Uhr \xFCber der Sp\xFCle",
      "ein Fahrradschloss ohne Fahrrad",
      "der Automat, der nur M\xFCnzen nimmt",
      "Werbung im Briefkasten",
      "ein Blumentopf im Treppenhaus",
      "die Ampel, die zu kurz gr\xFCn ist",
      "eine T\xFCte, die rei\xDFt",
      "der Kalender an der K\xFChlschrankt\xFCr",
      "ein Anrufbeantworter mit einer Nachricht",
      "die Kasse mit dem l\xE4ngsten Band",
      "ein Regenschirm im Schirmst\xE4nder",
      "der Nachbarshund hinter der T\xFCr",
      "Kaffeeflecken auf dem Antrag",
      "eine Gl\xFChbirne, die flackert",
      "der Sperrm\xFCll vor dem Haus"
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
      "einen Schl\xFCsselbund",
      "eine Kaffeetasse",
      "einen Einkaufszettel",
      "eine Fernbedienung",
      "einen Regenschirm",
      "ein Handy",
      "einen Kalender",
      "einen Blumentopf",
      "eine Thermoskanne",
      "eine Zeitung",
      "ein Feuerzeug",
      "eine Brotdose",
      "einen Bonbon",
      "ein Handtuch",
      "einen Zettel am K\xFChlschrank",
      "eine Fahrkarte",
      "ein Ladekabel",
      "einen W\xE4schekorb",
      "eine Einkaufstasche",
      "ein Kleingeldfach"
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
      "die T\xFCr f\xE4llt zu und der Schl\xFCssel liegt drinnen"
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
      "niemand hat den Schl\xFCssel"
    ],
    "stakes": [
      "Der Einsatz ist ein freier Nachmittag.",
      "Der Einsatz ist die Miete.",
      "Der Einsatz ist ein Anruf, der \xFCberf\xE4llig ist.",
      "Der Einsatz ist der Platz am Fenster.",
      "Der Einsatz ist die Ruhe nach Feierabend.",
      "Der Einsatz ist der Feierabend.",
      "Der Einsatz ist ein Termin, der nicht wiederkommt.",
      "Der Einsatz ist die Ruhe im Treppenhaus.",
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
      "Und die W\xE4sche h\xE4ngt noch immer."
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
      "der Augenblick, der verweilen soll"
    ],
    "hooks": [
      "ein Vater reitet zu schnell",
      "der Lehrling spricht die halbe Formel",
      "ein Brief tr\xE4gt kein Datum",
      "der Spiegel zeigt eine j\xFCngere Hand",
      "jemand schlie\xDFt eine Wette ohne Zeugen"
    ],
    "props": [
      "einen Federkiel",
      "einen Siegelring",
      "einen Zauberbesen",
      "eine Wetterfahne",
      "einen Reisekoffer",
      "eine Farbenscheibe",
      "ein Manuskript",
      "einen Wanderstock"
    ],
    "turns": [
      "der Diener gehorcht l\xE4nger als befohlen",
      "die Wette wendet sich gegen beide",
      "das Werk gelingt und fordert alles",
      "ein Wort zu viel bindet f\xFCr immer",
      "die Reise f\xFChrt zur\xFCck an den Anfang"
    ],
    "obstacles": [
      "das Wort f\xFCr den Bann fehlt",
      "zwei Seelen wollen verschiedene Wege",
      "die Zeit l\xE4sst sich nicht anhalten",
      "der Meister bleibt fort",
      "die Formel ist nur halb gelernt"
    ],
    "stakes": [
      "Der Einsatz ist ein Augenblick, der bleiben soll.",
      "Der Einsatz ist die Seele in einer Wette.",
      "Der Einsatz ist das Kind auf dem Pferd.",
      "Der Einsatz ist der Ruhm eines Werks.",
      "Der Einsatz ist zwei Seelen in einer Brust."
    ],
    "endings": [
      "Der Vater kommt an, das Kind ist still.",
      "Die Besen stehen, das Wasser steigt weiter.",
      "Er sagt das Wort, und alles h\xE4lt an.",
      "Der Garten bleibt in Ordnung, der G\xE4rtner geht.",
      "Am Ende verweilt nichts, auch nicht der Augenblick."
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
      "der erste Schluck nach langem Weg"
    ],
    "hooks": [
      "ein Duft kommt ohne Quelle",
      "die Haut sp\xFCrt ein Ger\xE4usch",
      "ein Geschmack weckt ein Datum",
      "das Licht f\xFChlt sich schwer an",
      "eine Ber\xFChrung klingt nach"
    ],
    "props": [
      "eine Orange",
      "einen Wollschal",
      "eine Schale Wasser",
      "ein St\xFCck Rinde",
      "eine Glocke",
      "ein Tuch",
      "eine Kerze",
      "einen Kieselstein"
    ],
    "turns": [
      "ein Sinn \xFCbernimmt die Arbeit des anderen",
      "der Geruch f\xFChrt an einen Ort zur\xFCck",
      "die Ber\xFChrung ver\xE4ndert die Farbe",
      "das H\xF6ren wird zum Sehen",
      "der Geschmack bleibt l\xE4nger als die Erinnerung"
    ],
    "obstacles": [
      "die Worte fehlen f\xFCr das Gef\xFChlte",
      "der Duft verfliegt zu schnell",
      "niemand sonst nimmt es wahr",
      "die Haut gew\xF6hnt sich",
      "der Ton liegt au\xDFerhalb des H\xF6rens"
    ],
    "stakes": [
      "Der Einsatz ist eine Erinnerung, die nur im Duft lebt.",
      "Der Einsatz ist die Sch\xE4rfe der Wahrnehmung.",
      "Der Einsatz ist ein Augenblick vor dem Vergessen.",
      "Der Einsatz ist die eigene Haut.",
      "Der Einsatz ist ein Name f\xFCr ein Gef\xFChl."
    ],
    "endings": [
      "Der Regen h\xF6rt auf, der Stein bleibt warm.",
      "Nichts davon l\xE4sst sich sagen.",
      "Sie schlie\xDFt die Augen und sieht mehr.",
      "Der Duft geht, das Zimmer bleibt.",
      "Am Ende bleibt Salz auf den Lippen."
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
  const P3 = kit.P;
  const fest = [];
  const einstieg = s(d.einstieg), mitte = s(d.mitte), hoehe = s(d.hoehepunkt), aend = s(d.veraenderungen);
  if (einstieg.length) fest.push(`${cap(stripTailPunct(pick(einstieg)))}.`);
  if (mitte.length) fest.push(`${cap(stripTailPunct(pick(mitte)))}.`);
  if (hoehe.length) fest.push(`Und dann: ${stripTailPunct(pick(hoehe))}.`);
  if (aend.length) fest.push(`Etwas kippt: ${stripTailPunct(pick(aend))}.`);
  const frei = [];
  for (const r of s(d.regeln)) frei.push(`Regel: ${ensurePunct(r)}`);
  for (const z of s(d.zeitanomalien)) frei.push(ensurePunct(z));
  const K_RAHMEN = [`${P3} wei\xDF, worum es geht:`, "Im Bild bleibt:", "Der Einsatz sichtbar:", "Alles zielt auf:"];
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
    const P3 = figur || "Jemand";
    const saetze = lead.isInfinitiveLed ? [`${P3} will ${kern}`, `Alles dr\xE4ngt darauf, ${kern.replace(/(\S+)$/, "zu $1")}`] : lead.verb ? [`${P3} ${lead.verb} ${kern}`] : looksLikeFullClause(lead.verb, kern) || hatFinitesVerb(kern) || !wirktNominal(kern) ? [kern] : [`Es geht um eines: ${kern}`, `${P3} sucht ${kern}`];
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
    if (anf.split(" ").length >= 2 && (anfangZahl.get(anf) || 0) >= 2) {
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
      { einheit: "Liter je Quadratmeter", rolle: "groesse", min: 14, max: 180, rund: 2 },
      { einheit: "Stundenkilometer", rolle: "groesse", min: 60, max: 200, rund: 5 },
      { einheit: "Zentimeter Neuschnee", rolle: "groesse", min: 12, max: 90, rund: 2 },
      { einheit: "Eins\xE4tze", rolle: "vorgaenge", min: 20, max: 900, rund: 2 },
      { einheit: "Stunden Dauerregen", rolle: "dauer", min: 4, max: 60, rund: 2 }
    ],
    betroffen: ["die K\xFCste", "der Deich", "die Ernte", "der Bahnverkehr", "die Schulen", "die Feuerwehr", "die F\xE4hren", "die Deichverb\xE4nde", "der F\xE4hrbetrieb", "die Obstbauern", "die Feuerwehren", "der Schienenverkehr", "die Campingpl\xE4tze"],
    einsatz: [S("die Ernte"), S("der Deich"), S("der Bahnverkehr"), S("die Trinkwasserversorgung"), S("die F\xE4hrverbindung"), P("die F\xE4hrverbindungen"), S("die Stromversorgung"), S("der K\xFCstenschutz"), S("die Obsternte")],
    gewinn: [S("eine trockene Erntewoche"), S("die R\xFCckkehr des Grundwassers"), S("ein mildes Wochenende"), S("die Entwarnung f\xFCr die K\xFCste"), S("eine Entspannung der Lage"), P("wieder befahrbare Stra\xDFen"), S("die R\xFCckkehr des F\xE4hrbetriebs")],
    zusatz: { titel: "Aussichten", rahmen: ["F\xFCr morgen gilt:", "Zum Wochenende:", "In der Nacht:", "Am Deich:", "Im Hafen:", "Auf den Feldern:"] },
    hintergrundKopf: (_wer, jahr) => `Vergleichbare Lagen gab es zuletzt ${jahr}.`,
    ausblickGut: ["Die Warnung wird zum Abend aufgehoben.", "Das Hoch soll sich bis zur Wochenmitte halten.", "Die Warnung wurde aufgehoben.", "Der Betrieb l\xE4uft wieder an."],
    ausblick: ["Die Warnstufe bleibt vorerst bestehen.", "Wie lange die Lage anh\xE4lt, ist offen.", "Der Warndienst bleibt bestehen.", "Die Lage wird st\xFCndlich neu bewertet.", "Eine Entwarnung steht aus."],
    // Keine Sonderregel: Ein Wetterbericht, der Zahlen erzwingt, erfindet
    // Messwerte - und ein erfundener Messwert ist schlimmer als keiner.
    regel: "keine"
  }
};
var RESSORT_IDS = Object.keys(RESSORTS);
var SPUR = [
  ["wetter", /\b(wetter|sturm|orkan|regen|schnee|hitze|frost|gewitter|hochwasser|dürre|dürre|unwetter|hagel|nebel|windböen|tief|hoch|warnstufe|deich|überschwemmung|glatteis|temperatur)\w*/i],
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
var PERSON_NOMEN = /(jugendliche|jugendlicher|erwachsene|erwachsener|alte|alter|kranke|kranker|gefangene|gefangener|angestellte|angestellter|beamte|beamter|verwandte|verwandter|bekannte|bekannter|vorsitzende|vorsitzender|abgeordnete|abgeordneter|obdachlose|obdachloser|pensionär|pensionärin|rentner|rentnerin|zeuge|zeugin|täter|täterin|opfer|passant|passantin|kellner|kellnerin|pfarrer|pfarrerin|richter|richterin|händler|händlerin|bauer|bäuerin|förster|försterin|schneider|schneiderin|weber|weberin|uhrmacher|uhrmacherin|archivar|archivarin|übersetzer|übersetzerin|magd|knecht|ritter|ritterin|nonne|mönch|clown|boxer|boxerin|grabräuber|grabräuberin|mädchen|junge|kind|frau|mann|männer|dame|herr|schüler|schülerin|lehrer|lehrerin|wächter|wächterin|arzt|ärztin|bäcker|bäckerin|gärtner|gärtnerin|fischer|fischerin|bote|botin|wanderer|wanderin|reisende|reisender|nachbar|nachbarin|greis|greisin|witwe|witwer|zwilling|bruder|schwester|sohn|tochter|vater|mutter|onkel|tante|neffe|nichte|freund|freundin|gast|fremde|fremder|meister|meisterin|gesell|lehrling|soldat|soldatin|matrose|matrosin|pilot|pilotin|köchin|koch|wirt|wirtin|müller|müllerin|schmied|schmiedin|hirte|hirtin|jäger|jägerin|sammler|sammlerin)$/i;
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
  const chronologie = [
    { id: "c1", zeit: String(jahr), was: "der Anfang" },
    // Auch die Chronologie kennt die Blickrichtung: Im Faktenkasten stand sonst
    // "die erste Meldung", waehrend im Text "die erste Zusage" lief.
    // FRÜHER FEST: „im Frühjahr" und „die erste Meldung". Damit stand in jedem
    // Bericht und in jeder Meldung derselbe Satz — in einer Ausgabe mit acht
    // Beiträgen viermal wörtlich. Das war der auffälligste Wiederholungsbefund
    // des ganzen Blattes und kein Fehler des Generators, sondern eine
    // Konstante an der falschen Stelle.
    { id: "c2", zeit: pick(VORGESCHICHTE_ZEIT), was: pick(gutesLicht ? VORGESCHICHTE_GUT : VORGESCHICHTE_SACHLICH) },
    // Dieselbe Form wie im Vorspann, sonst steht dort "Im Frühjahr 2001" und
    // im Hergang "Frühjahr 2001 folgte der Schritt".
    { id: "c3", zeit: mitPraeposition(wann) || pick(ZEITPUNKT), was: (input.what || "das Ereignis").trim() }
  ];
  {
    const gemischt = (a) => a.slice().sort(() => Math.random() - 0.5);
    const zeiten = gemischt(VORGESCHICHTE_ZEIT).filter((z) => z !== chronologie[1].zeit);
    const sachen = gemischt(gutesLicht ? VORGESCHICHTE_GUT : VORGESCHICHTE_SACHLICH).filter((x) => x !== chronologie[1].was);
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
    ersteMeldung: "die erste Meldung",
    // Das Bezugswort steckt im Satz: "der Schritt, ueber DEN". Als ich nur das
    // Nomen austauschte, stand "folgte der Schritt, ueber die ...".
    schritt: (wer) => `folgte der Schritt, \xFCber den ${wer} nun informiert`,
    haelfte: (l, w) => `Betroffen ist damit ${l} \u2014 ${w}.`,
    einsatz: (mehr, x) => `Auf dem Spiel ${mehr ? "stehen" : "steht"} ${x}.`,
    weitere: (x) => `Betroffen sind au\xDFerdem ${x}.`
  },
  gut: {
    vorspann: (n) => `wurde, dass ${n} hinzukommen`,
    ersteMeldung: "die erste Zusage",
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
  const s2 = z ? `Bekannt ${w.vorspann(`${z.verbal || z.wortform} ${z.einheit}`)}.` : `Bekannt wurde es erst sp\xE4ter.`;
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
  const c2 = fb.chronologie[1], c3 = fb.chronologie[2];
  if (c2) {
    const was2 = blick === "gut" ? w.ersteMeldung : c2.was;
    const fassungen = [
      `${cap(c2.zeit)} zeichnete sich ${was2} ab.`,
      `${cap(c2.zeit)} gab es ${was2}.`,
      // Ohne Präposition: „mit der erste Anfrage" war der erste Versuch — der
      // Artikel wurde gebeugt, das Adjektiv nicht. Ein Doppelpunkt braucht
      // keinen Kasus.
      `Angefangen hatte es ${c2.zeit}: ${was2}.`
    ];
    teile.push(pick(fassungen));
  }
  for (let i = 0; i < 1 + extra; i++) {
    const roh = satzOhneZahl(bank, ["obstacles", "turns"], benutzt, vorrat);
    if (roh) frei.push(brauchtRahmen(roh) ? `${pick(NOMINALRAHMEN)} ${roh}.` : `${cap(roh)}.`);
  }
  const z2 = fb.zahlen[1];
  if (z2) teile.push(zahlSatz(z2));
  if (c3) teile.push(`${cap(c3.zeit)} ${w.schritt(b.organisation(fb))}.`);
  const a1 = fb.abgeleitet[0];
  if (a1) teile.push(w.haelfte(a1.label, a1.wortform));
  const R0 = RESSORTS[fb.ressort];
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
    `Ob der Schritt zur\xFCckgenommen wird, blieb ${fb.wann.relativ} unbeantwortet.`
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
    if (teile.length) abschnitte.push(`${R.zusatz.titel}: ${teile.join(" ")}`);
  }
  abschnitte.push(ausblick(fb, blick));
  const kasten = [
    `Faktenkasten`,
    // Auch die Beschriftung dreht sich: "Betroffen: 480 Beschaeftigte" unter
    // einer guten Nachricht liest sich wie ein Widerspruch.
    ...fb.zahlen.map((z) => `\xB7 ${z.rolle === "betroffene" && blick === "gut" ? "Neu" : ROLLE_LABEL[z.rolle]}: ${z.wortform} ${z.einheit}`),
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
  const P3 = kit.P;
  return pick([
    `Da h\xE4lt ${P3} inne.`,
    `Kurz sucht ${P3} nach Worten.`,
    `Dann sp\xFCrt ${P3} die K\xE4lte.`,
    `Reglos steht ${P3} da.`,
    `Lange wartet ${P3}.`,
    `Still bleibt ${P3} stehen.`,
    `Aufmerksam beobachtet ${P3} den Raum.`
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
  const P3 = personKopf(speakers[0] || PRaw);
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
    P: P3,
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
    speakerA: P3,
    speakerB: speakers[1] || pickSpeakerForArchetype(archB),
    speakers: speakers.length >= 2 ? speakers : [P3, pickSpeakerForArchetype(archB)],
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
  if (input.form === "bericht") return buildBericht(bank, input, input.ressort ?? "auto").text;
  if (input.form === "meldung") return buildMeldung(input, input.ressort ?? "auto").text;
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

// test/verwandlung.ts
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
ist("der Pfeil darf auch -> hei\xDFen", leseVerwandlungen(["Regen -> Nebel"]).length, 1);
ist("und > ebenso", leseVerwandlungen(["Regen > Nebel"]).length, 1);
ist("ohne Pfeil kein Paar", leseVerwandlungen(["Regen Nebel"]).length, 0);
ist("eine leere Seite auch nicht", leseVerwandlungen(["Regen\u2192"]).length, 0);
ist("und ein Wort in sich selbst erst recht nicht", leseVerwandlungen(["Regen\u2192regen"]).length, 0);
ist("nichts ergibt nichts", leseVerwandlungen(void 0).length, 0);
ist("gleiches Geschlecht wird angenommen", pruefePaar("Regen\u2192Nebel").ok, true);
ist("ungleiches Geschlecht wird beim Lesen verworfen", leseVerwandlungen(["Telefon\u2192Stille"]).length, 0);
ist("gleiches nicht", leseVerwandlungen(["Regen\u2192Nebel"]).length, 1);
ist("und ein unbekanntes Wort ebenfalls nicht", leseVerwandlungen(["Blubb\u2192Nebel"]).length, 0);
ist("verschiedenes nicht", pruefePaar("Telefon\u2192Stille").ok, false);
wahr("und der Grund wird genannt", pruefePaar("Telefon\u2192Stille").grund.includes("Geschlecht"));
ist("ein unbekanntes Wort wird abgelehnt", pruefePaar("Blubb\u2192Nebel").ok, false);
wahr("auch daf\xFCr gibt es einen Grund", pruefePaar("Blubb\u2192Nebel").grund.includes("unbekannt"));
ist("das Grundwort entscheidet", pruefePaar("Regen\u2192dichter Nebel").ok, true);
var P2 = leseVerwandlungen(["Regen\u2192Nebel"]);
ist("einmal genannt bleibt unverwandelt", verwandleMotive("Der Regen f\xE4llt.", P2), "Der Regen f\xE4llt.");
ist(
  "das zweite Mal wird verwandelt",
  verwandleMotive("Der Regen f\xE4llt. Sp\xE4ter der Regen.", P2),
  "Der Regen f\xE4llt. Sp\xE4ter der Nebel."
);
ist(
  "und jedes weitere auch",
  verwandleMotive("Regen. Regen. Regen.", P2),
  "Regen. Nebel. Nebel."
);
ist(
  "die Schreibung der Fundstelle bleibt",
  verwandleMotive("Regen f\xE4llt. Es beginnt regen.", P2),
  "Regen f\xE4llt. Es beginnt nebel."
);
ist(
  "kein Treffer in einer Zusammensetzung",
  verwandleMotive("Der Regen kommt. Ein Regenbogen steht da.", P2),
  "Der Regen kommt. Ein Regenbogen steht da."
);
{
  const U = leseVerwandlungen(["F\xFCrst\u2192Ritter"]);
  ist(
    "Umlaute am Wortanfang st\xF6ren nicht",
    verwandleMotive("Der F\xFCrst kommt. Dann der F\xFCrst.", U),
    "Der F\xFCrst kommt. Dann der Ritter."
  );
}
ist("ohne Paare bleibt alles", verwandleMotive("Der Regen f\xE4llt.", []), "Der Regen f\xE4llt.");
{
  const b = BUILTIN_PRESETS["philosophie"];
  const paare = leseVerwandlungen(b.verwandlungen);
  wahr(`das Preset f\xFChrt Verwandlungen (${paare.length})`, paare.length >= 8);
  ist("und alle werden angenommen", paare.length, (b.verwandlungen || []).length);
  const ohne = { ...b };
  delete ohne.verwandlungen;
  let mit = 0;
  for (let i = 0; i < 60; i++) {
    const roh = buildStory(ohne, {
      where: "im H\xF6rsaal",
      when: "am Abend",
      who: "die Denkerin",
      what: "sucht einen Grund",
      tone: "nuechtern",
      form: "prose",
      lenTarget: 220,
      tension: "off",
      cast: "auto",
      mode: "auto",
      structure: i % 2 ? "rekombination" : "linear",
      perspective: "third",
      rhythm: "clean",
      disruptor: "off",
      instability: 0,
      markovMode: "off",
      varLevel: "mid",
      archetypeA: "neutral",
      archetypeB: "neutral"
    });
    if (verwandleMotive(roh, paare) !== roh) mit++;
  }
  wahr(`sie greifen in den meisten Texten (${mit}/60)`, mit >= 40);
}
{
  const b = BUILTIN_PRESETS["philosophie"];
  wahr("sie ist kein Kategorie-Schl\xFCssel", !BANK_KEYS.includes("verwandlungen"));
  let drin = 0;
  for (let i = 0; i < 30; i++) {
    const t = buildStory(b, {
      where: "im H\xF6rsaal",
      when: "am Abend",
      who: "die Denkerin",
      what: "sucht einen Grund",
      tone: "nuechtern",
      form: "prose",
      lenTarget: 200,
      tension: "off",
      cast: "auto",
      mode: "auto",
      structure: "rekombination",
      perspective: "third",
      rhythm: "clean",
      disruptor: "off",
      instability: 0,
      markovMode: "off",
      varLevel: "mid",
      archetypeA: "neutral",
      archetypeB: "neutral"
    });
    if (/→|->/.test(t)) drin++;
  }
  ist("kein Pfeil steht im fertigen Text", drin, 0);
}
{
  const b = BUILTIN_PRESETS["philosophie"];
  const n = BANK_KEYS.reduce((s, k) => s + (b[k] || []).length, 0);
  wahr(`Philosophie tr\xE4gt ${n} Eintr\xE4ge`, n >= 140);
  for (const k of BANK_KEYS) {
    wahr(`${k}: mindestens zw\xF6lf Eintr\xE4ge (${(b[k] || []).length})`, (b[k] || []).length >= 12);
  }
  for (const k of BANK_KEYS) {
    const arr = (b[k] || []).map((x) => x.trim().toLowerCase());
    ist(`${k}: ohne Dubletten`, arr.length - new Set(arr).size, 0);
  }
  const W = (x) => x.split(/\s+/).filter(Boolean).length;
  let woerter2 = 0;
  const N2 = 25;
  for (let i = 0; i < N2; i++) {
    const e = buildBericht(b, {
      where: "an der Unterelbe",
      when: "im Herbst 1923",
      who: "die Ostmoor-Werft",
      what: "meldet einen Vorfall",
      tone: "nuechtern",
      form: "bericht",
      lenTarget: 450,
      mode: "auto",
      structure: "linear",
      perspective: "third",
      rhythm: "auto",
      disruptor: "off",
      instability: 0,
      markovMode: "off",
      varLevel: "wild",
      archetypeA: "neutral",
      archetypeB: "neutral"
    }, "wirtschaft");
    woerter2 += W(typeof e === "string" ? e : e.text);
  }
  const treue = woerter2 / N2 / 450;
  wahr(`Philosophie allein tr\xE4gt einen 450-W\xF6rter-Bericht (${Math.round(treue * 100)} %)`, treue >= 0.85);
}
{
  const gross = Object.keys(BUILTIN_PRESETS).filter((id) => {
    const b = BUILTIN_PRESETS[id];
    return BANK_KEYS.reduce((s, k) => s + (b[k] || []).length, 0) >= 120;
  });
  console.log(`  Ausgebaut (120+): ${gross.length} von ${Object.keys(BUILTIN_PRESETS).length} \u2014 ${gross.join(", ")}`);
  {
    const arm = gross.map((n) => {
      const b = BUILTIN_PRESETS[n];
      let w = 0;
      for (const [k, v] of Object.entries(b)) {
        if (k === "verwandlungen") continue;
        for (const e of v) w += String(e).split(/\s+/).filter(Boolean).length;
      }
      return { n, w };
    }).sort((a, b) => a.w - b.w);
    console.log(`  Wortzahl der ausgebauten Presets: ${arm[0].w} bis ${arm[arm.length - 1].w} \u2014 am d\xFCnnsten ${arm.slice(0, 3).map((x) => `${x.n} (${x.w})`).join(", ")}`);
    wahr(`kein ausgebautes Preset unter 500 W\xF6rtern (d\xFCnnstes: ${arm[0].n} mit ${arm[0].w})`, arm[0].w >= 500);
  }
  wahr(`mindestens f\xFCnf Presets sind ausgebaut (${gross.length})`, gross.length >= 5);
  const W = (x) => x.split(/\s+/).filter(Boolean).length;
  for (const id of gross) {
    const b = BUILTIN_PRESETS[id];
    let w = 0;
    const N2 = 15;
    for (let i = 0; i < N2; i++) {
      w += W(buildStory(b, {
        where: "im Hof",
        when: "am Abend",
        who: "die Wartende",
        what: "sucht eine Auskunft",
        tone: "nuechtern",
        form: "prose",
        lenTarget: 400,
        tension: "off",
        cast: "auto",
        mode: "auto",
        structure: "rekombination",
        perspective: "third",
        rhythm: "clean",
        disruptor: "off",
        instability: 0,
        markovMode: "off",
        varLevel: "mid",
        archetypeA: "neutral",
        archetypeB: "neutral"
      }));
    }
    const treue2 = w / N2 / 400;
    wahr(`${id} tr\xE4gt 400 W\xF6rter Prosa (${Math.round(treue2 * 100)} %)`, treue2 >= 0.8);
    for (const k of BANK_KEYS) {
      const arr = (b[k] || []).map((x) => x.trim().toLowerCase());
      ist(`${id}.${k}: ohne Dubletten`, arr.length - new Set(arr).size, 0);
    }
  }
}
{
  let paare = 0;
  const durchgefallen = [];
  for (const [name, bank] of Object.entries(BUILTIN_PRESETS)) {
    for (const p of bank.verwandlungen || []) {
      paare++;
      const r = pruefePaar(p);
      if (!r.ok) durchgefallen.push(`${name}: ${p} (${r.grund})`);
    }
  }
  wahr(`es gibt \xFCberhaupt Paare (${paare})`, paare >= 40);
  ist("kein eingebautes Paar f\xE4llt durch", durchgefallen.join(" \xB7 "), "");
}
console.log(`Pr\xFCfstand Verwandlung \u2014 ${geprueft} Pr\xFCfungen, ${bestanden} bestanden`);
var proc = globalThis;
if (fails.length) {
  console.error(`
\u274C Verwandlung: ${fails.length} Fehler:`);
  fails.forEach((f) => console.error("  - " + f));
  proc.process?.exit(1);
} else {
  console.log(`
\u2705 Verwandlung: alle ${geprueft} Pr\xFCfungen bestanden.`);
}
