"use strict";

// src/text-utils.ts
function clean(s) {
  return (s ?? "").toString().trim().replace(/\s+/g, " ");
}
function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}
function splitSentences(txt) {
  return txt.replace(/\s+/g, " ").trim().split(/(?<=[.!?…])\s+/).filter(Boolean);
}
var HAENGT_IN_DER_LUFT = /(^|\s)(ein|eine|einem|einen|einer|eines|der|die|das|dem|den|des|und|oder|aber|wie|als|im|am|beim|zum|zur|vom|von|für|ohne|durch|gegen|bei|seit|während|wegen|trotz|dass|weil|denn|sondern|sowie|bzw|etwa|sehr|dessen|deren|welche[rsmn]?)$/i;
function kuerzeAmBruch(text2) {
  let t = (text2 || "").replace(/\s*…\s*$/, "").replace(/\s*[.,;:–—-]+\s*$/, "").trim();
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
  "bahnkarte": "f",
  "ball": "m",
  "ballade": "f",
  "band": "n",
  "bank": "f",
  "basecap": "n",
  "bau": "m",
  "bauch": "m",
  "bauer": "m",
  "baum": "m",
  "becher": "m",
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
  "cache": "m",
  "cadtablet": "n",
  "chat": "m",
  "clown": "m",
  "computer": "m",
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
  "deo": "n",
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
  "fund": "m",
  "fundament": "n",
  "funke": "m",
  "funkger\xE4t": "n",
  "furcht": "f",
  "fu\xDF": "m",
  "f\xE4hrmann": "m",
  "f\xE4hrplan": "m",
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
  "keller": "m",
  "kerze": "f",
  "kette": "f",
  "kettenhemd": "n",
  "kiefer": "m",
  "kiel": "m",
  "kies": "m",
  "kind": "n",
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
  "leitung": "f",
  "leuchten": "n",
  "leuchtturm": "m",
  "licht": "n",
  "lichtstreifen": "m",
  "liebe": "f",
  "lied": "n",
  "lilie": "f",
  "lineal": "n",
  "linie": "f",
  "lippe": "f",
  "loch": "n",
  "locke": "f",
  "log": "n",
  "logbuch": "n",
  "logfile": "n",
  "lot": "n",
  "luft": "f",
  "lupe": "f",
  "lust": "f",
  "l\xE4cheln": "n",
  "l\xE4rm": "m",
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
  "metronom": "n",
  "miene": "f",
  "mikroskop": "n",
  "milch": "f",
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
  "nelke": "f",
  "nest": "n",
  "netz": "n",
  "nonne": "f",
  "note": "f",
  "notenblatt": "n",
  "notiz": "f",
  "notizblock": "m",
  "notizbuch": "n",
  "nuss": "f",
  "nymphe": "f",
  "obst": "n",
  "ofen": "m",
  "ohr": "n",
  "oma": "f",
  "omen": "n",
  "onkel": "m",
  "opferschale": "f",
  "opiumdose": "f",
  "orakel": "n",
  "orange": "f",
  "organ": "n",
  "orgel": "f",
  "paar": "n",
  "paket": "n",
  "pakt": "m",
  "papier": "n",
  "paradoxon": "n",
  "paragraph": "m",
  "passierschein": "m",
  "pegelstab": "m",
  "peilstock": "m",
  "peitsche": "f",
  "pendel": "n",
  "pergamentrolle": "f",
  "perle": "f",
  "perlmuttknopf": "m",
  "petrischale": "f",
  "petroleumlampe": "f",
  "pfad": "m",
  "pfandschein": "m",
  "pfeffer": "m",
  "pfeife": "f",
  "pferd": "n",
  "pfirsich": "m",
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
  "punkt": "m",
  "puppe": "f",
  "qualle": "f",
  "quelle": "f",
  "quittung": "f",
  "rad": "n",
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
  "spektrometer": "n",
  "spiegel": "m",
  "spiel": "n",
  "spinne": "f",
  "sporn": "m",
  "sprache": "f",
  "sprung": "m",
  "spule": "f",
  "spur": "f",
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
  "vogel": "m",
  "vollmacht": "f",
  "vordruck": "m",
  "vorhang": "m",
  "vormund": "m",
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
  "wurm": "m",
  "wurzel": "f",
  "wut": "f",
  "w\xE4rme": "f",
  "w\xE4rmestein": "m",
  "w\xE4schekorb": "m",
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
  "zettel": "m",
  "zeuge": "m",
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
var INFINITIVE_VERBS = /* @__PURE__ */ new Set(["entdecken", "finden", "verstehen", "erreichen", "verlassen", "retten", "zerst\xF6ren", "beweisen", "\xFCberleben", "fliehen", "gewinnen", "verlieren", "\xF6ffnen", "schlie\xDFen", "verschwinden", "sterben", "bleiben", "ankommen", "entkommen", "aufwachen", "vergessen", "lernen", "ver\xE4ndern", "kontrollieren", "sch\xFCtzen", "befreien", "heilen", "erschaffen", "reparieren", "beenden", "anfangen", "beginnen", "erinnern", "wissen", "glauben", "tr\xE4umen", "hoffen", "k\xE4mpfen", "siegen", "sprechen", "schweigen", "warten", "folgen", "fragen", "antworten", "erkl\xE4ren", "gehen", "kommen"]);

// src/generation/verbconj.ts
var VERB_TOKEN_RE = new RegExp("\\b(" + Object.keys(VERB_CONJ).join("|") + ")\\b", "i");

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
function extractLeadVerb(text2) {
  const s = clean(text2);
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
function properNames(text2) {
  const out = /* @__PURE__ */ new Set();
  for (const sent of splitSentences(text2)) {
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
  const text2 = (raw || "").trim();
  const unsicher = [];
  const wcount = woerter(text2);
  const end = (text2.match(/[.!?:;—]$/) || [""])[0];
  const lead = extractLeadVerb(text2);
  const haupt = text2.split(",")[0];
  const hatFinit = !!lead.verb || hatFinitesVerb(haupt);
  let typ;
  if (/:$/.test(text2)) typ = "kopf";
  else if (text2.includes("\u27E8")) typ = "rahmen";
  else if (wcount === 1) typ = "einwort";
  else if (KONNEKTOR.test(text2)) typ = "konnektor";
  else if (SUBJUNKTION.test(text2) && hatFinit) typ = "nebensatz";
  else if (REL.test(text2) && hatFinit && /,/.test(text2) === false && /\ben\b|\bt\b/.test("")) typ = "nebensatz";
  else if (hatFinit) typ = "hauptsatz";
  else if (PREP2.test(text2)) typ = "praepositionalphrase";
  else if (ARTIKEL.test(text2) || /\b[A-ZÄÖÜ][a-zäöüß-]{2,}/.test(text2)) typ = "nominalphrase";
  else typ = "fragment";
  if (PREP2.test(text2) && hatFinit) unsicher.push("typ (Inversion?)");
  if (typ === "fragment" && wcount >= 6) unsicher.push("typ (langes Fragment?)");
  let kasus = null;
  if (typ === "nominalphrase") {
    const a = (text2.match(/^(\S+)/) || [""])[0].toLowerCase();
    const kern = (text2.match(/\b([A-ZÄÖÜ][a-zäöüß-]{2,})/) || [])[1];
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
  const tempus = typ === "nominalphrase" || typ === "fragment" || typ === "praepositionalphrase" || typ === "einwort" ? "kein" : isPastTense(text2) ? "praeteritum" : "praesens";
  const bezug = PRON_START.test(text2) ? { pronomen: (text2.match(/^\S+/) || [""])[0].toLowerCase(), genus: /^(sie|ihr|ihnen)/i.test(text2) ? "fem" : "mask", numerus: "sg" } : null;
  if (bezug) unsicher.push("verlangt_bezug (Genus gesch\xE4tzt)");
  const s = silben(text2);
  return {
    text: text2,
    typ,
    bietet: { kasus, kadenz },
    subjekt: subjektOf(text2, typ),
    tempus,
    fuehrt_ein: properNames(text2),
    verlangt_bezug: bezug,
    oeffnet: typ === "kopf",
    rhythmus: { woerter: wcount, silben: s, tiefe: tiefe(text2), endzeichen: end, gewicht: wcount <= 4 ? "kurz" : wcount <= 9 ? "mittel" : "lang" },
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
function fuelleKontext(text2, ctx) {
  return text2.replace(/⟨ORT⟩/g, ctx.ort).replace(/⟨ZEIT⟩/g, ctx.zeit).replace(/⟨FIGUR⟩/g, ctx.figur).replace(/⟨VERB⟩/g, ctx.verb);
}
var offeneSlots = (t) => (t.match(/⟨(AKK|DAT|NOM|SATZ)⟩/g) || []).length;

// src/generation/beats.ts
function cap(s) {
  s = (s ?? "").toString();
  return s ? s[0].toUpperCase() + s.slice(1) : s;
}
var CLAUSE_VERBS = /* @__PURE__ */ new Set(["antworten", "antwortet", "atmen", "atmet", "bebt", "begann", "beginnen", "beginnt", "beobachten", "beobachtet", "ber\xFChren", "ber\xFChrt", "bin", "bist", "bleiben", "bleibt", "blieb", "blitzt", "brannte", "brennen", "brennt", "brummt", "br\xFCllen", "br\xFCllt", "dachte", "darf", "denken", "denkt", "donnert", "drehen", "dreht", "drehte", "durfte", "d\xFCrfen", "enden", "endet", "endete", "erinnern", "erinnert", "fahren", "fallen", "fand", "fiel", "fielen", "finden", "findet", "fliegen", "fliegt", "fliehen", "flieht", "flie\xDFen", "flie\xDFt", "flog", "floss", "fl\xFCstern", "fl\xFCstert", "folgen", "folgt", "folgte", "formen", "formt", "fragen", "fragt", "fragte", "fuhr", "f\xE4hrt", "f\xE4llt", "f\xFChlen", "f\xFChlt", "f\xFChren", "f\xFChrt", "f\xFChrte", "f\xFCrchten", "f\xFCrchtet", "gab", "gaben", "galt", "geben", "gehen", "geht", "gelten", "geschah", "geschehen", "geschieht", "gibt", "gilt", "ging", "gingen", "glauben", "glaubt", "haben", "habt", "halten", "hat", "hatte", "hatten", "hielt", "hielten", "hoffen", "hofft", "h\xE4lt", "h\xE4tte", "h\xF6ren", "h\xF6rt", "h\xF6rte", "ist", "jagen", "jagt", "kam", "kamen", "kann", "kannte", "kennen", "kennt", "kippen", "kippt", "knistert", "kommen", "kommt", "konnte", "konnten", "kreisen", "kreist", "k\xF6nnen", "lachen", "lacht", "lag", "lagen", "laufen", "leuchten", "leuchtet", "lief", "liefen", "liegen", "liegt", "l\xE4uft", "l\xF6schen", "l\xF6scht", "machen", "macht", "machte", "machten", "mag", "muss", "musste", "mussten", "m\xF6chte", "m\xF6chten", "m\xF6gen", "m\xFCssen", "nahm", "nahmen", "nehmen", "nimmt", "passieren", "passiert", "passierte", "planen", "plant", "pulsiert", "raschelt", "reagieren", "reagiert", "regnet", "retten", "rettet", "rief", "rinnt", "riskiert", "rufen", "ruft", "sah", "sahen", "sang", "sank", "sa\xDF", "schlafen", "schlief", "schlie\xDFen", "schlie\xDFt", "schloss", "schl\xE4ft", "schmelzen", "schmilzt", "schneit", "schreien", "schreit", "schrie", "schweigen", "schweigt", "schwieg", "sehen", "seid", "sieht", "sind", "singen", "singt", "sinken", "sinkt", "sitzen", "sitzt", "soll", "sollen", "sollte", "sprach", "sprachen", "sprang", "sprechen", "spricht", "springen", "springt", "stand", "standen", "stehen", "steht", "steigen", "steigt", "stieg", "suchen", "sucht", "suchte", "summt", "tanzen", "tanzt", "tat", "taten", "ticken", "tickt", "tragen", "tropft", "trug", "trugen", "tr\xE4gt", "tr\xE4umen", "tr\xE4umt", "tun", "tut", "unterschreiben", "unterschreibt", "verfolgen", "verfolgt", "vergessen", "vergisst", "verlangen", "verlangt", "verraten", "verr\xE4t", "ver\xE4ndern", "ver\xE4ndert", "vibriert", "wachsen", "wagen", "wagt", "wandern", "wandert", "war", "waren", "warten", "wartet", "wartete", "wechseln", "wechselt", "weigern", "weigert", "weinen", "weint", "wei\xDF", "werden", "werdet", "wiederholen", "wiederholt", "will", "wird", "wirst", "wissen", "wollen", "wollte", "wollten", "wurde", "wurden", "wusste", "w\xE4chst", "w\xE4re", "w\xE4ren", "w\xFCrde", "w\xFCrden", "zeigen", "zeigt", "zeigte", "zerbrechen", "zerbricht", "ziehen", "zieht", "zittern", "zittert", "zog", "zogen", "\xF6ffnen", "\xF6ffnet", "\xFCberschreiben", "\xFCberschreibt"]);

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
function rateRessort(text2) {
  for (const [id, re] of SPUR) if (re.test(text2)) return id;
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
    const quelle = i === 0 ? eigeneBetroffen.length ? eigeneBetroffen : einheiten.filter((e2) => e2.rolle === "betroffene") : i === 1 && sache ? einheiten.filter((e2) => e2.rolle === "sache") : einheiten.filter((e2) => !rollenDrin.has(e2.rolle));
    if (!quelle.length) break;
    const gewaehlt = quelle[Math.floor(Math.random() * quelle.length)];
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

// src/constants.ts
var STORAGE_CORPUS = "divergenz_persistent_corpus_v1";

// src/corpus.ts
function loadPersistentCorpus() {
  try {
    return localStorage.getItem(STORAGE_CORPUS) || "";
  } catch {
    return "";
  }
}
var GERUEST_ZEILE = /^\s*(Faktenkasten\b|Kurz gemeldet\s*$|Fiktive Zeitung\b|Zeitzeichen\s*[·|]|Nr\.\s*\d+\s*[·|]|UNABHÄNGIG\b|SEQUENZ\s*—|(?:WER|WO|WANN|WAS|GESAMTLÄNGE)\s*:)/;
function corpusSanitize(text2) {
  let s = (text2 ?? "").toString();
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
var wirktNominal = (t) => /^\s*(ein|eine|einen|einem|eines|einer|der|die|das|den|dem|des|mein|meine|meinen|sein|seine|ihr|ihre|kein|keine|viele|manche|jede|jeden|etwas|nichts|[A-ZÄÖÜ])/.test(t);
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
    const zwei = reihenfolge(eins).slice(0, 1 + Math.min(1, Math.floor(extra / 4)));
    const mehr = zwei.length > 1 || zwei.some((x) => x.pl);
    teile.push(w.einsatz(mehr, aufzaehlung(zwei.map((x) => x.t))));
  }
  const bt = RESSORTS[fb.ressort].betroffen;
  if (bt.length >= 3) {
    const schon = fb.zahlen.map((z) => z.einheit.toLowerCase());
    const frei2 = bt.filter((x) => !schon.some((e) => x.toLowerCase().includes(e)));
    const aus = reihenfolge(frei2.length >= 2 ? frei2 : bt).slice(0, 2 + Math.min(2, Math.floor(extra / 3)));
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
  const rahmen = reihenfolge(NOMINALRAHMEN);
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
function reihenfolge(a) {
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
      "eine Raumstation aus Knochen"
    ],
    "hooks": [
      "Der Himmel atmet n\xE4her als sonst.",
      "Ein Stern f\xE4llt nicht \u2013 er steigt.",
      "Das Teleskop beobachtet mich.",
      "Zwischen zwei Sekunden \xF6ffnet sich ein Orbit.",
      "Der Mond ist heute schwerer."
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
      "einen Funksender"
    ],
    "turns": [
      "die Gravitation \xE4ndert ihre Richtung",
      "ein Planet antwortet",
      "Zeit dehnt sich sichtbar",
      "ein Stern wird geboren und spricht",
      "der Beobachter wird beobachtet",
      "der Raum faltet sich wie Papier",
      "das Licht kommt zu sp\xE4t"
    ],
    "obstacles": [
      "der Horizont verschluckt die Sterne",
      "das Signal erreicht nur die Vergangenheit",
      "ein schwarzes Loch verweigert die R\xFCckgabe",
      "die Umlaufbahn zerbricht",
      "der Sauerstoff wird zu Erinnerung",
      "die Sternkarte zeigt nur Namen",
      "ein Komet streicht den Kurs"
    ],
    "stakes": [
      "Der Einsatz ist Schwerkraft: Sie h\xE4lt oder l\xE4sst los.",
      "Der Einsatz ist Ursprung: Wo begann das Licht?",
      "Der Einsatz ist Isolation: Niemand antwortet.",
      "Der Einsatz ist Zeit: Milliarden Jahre in einer Sekunde.",
      "Der Einsatz ist Heimkehr: Gibt es einen Weg zur\xFCck?"
    ],
    "endings": [
      "Und die Sterne r\xFCcken ein St\xFCck n\xE4her.",
      "Und das Licht bleibt zur\xFCck wie ein Echo.",
      "So bleibt nur Staub in meiner Hand.",
      "Und der Planet dreht sich ohne mich weiter.",
      "Und ich falle \u2013 nach oben."
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
      "ein Schatten hinter der Stimme"
    ],
    "hooks": [
      "Ich erinnere mich nicht, aber mein K\xF6rper schon.",
      "Der Traum beginnt immer an derselben Stelle.",
      "Es ist nur ein Versprecher.",
      "Ich sagte Mutter, meinte aber etwas anderes.",
      "Die Stille zwischen zwei Worten wird zu laut."
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
      "ein Tagebuch"
    ],
    "turns": [
      "das Unbewusste \xFCbernimmt die Szene",
      "eine Verdr\xE4ngung l\xF6st sich",
      "ein Traum wird w\xF6rtlich",
      "das Ich verliert Kontrolle",
      "das \xDCber-Ich spricht mit fremder Stimme",
      "ein Kindheitsbild wird real",
      "Begehren zeigt sein Gesicht"
    ],
    "obstacles": [
      "Erinnerung verweigert sich",
      "ein Symptom ersetzt die Wahrheit",
      "Scham blockiert das Sprechen",
      "der Traum verschiebt seine Bedeutung",
      "ein Widerstand baut sich auf",
      "Sprache zerf\xE4llt in Andeutungen",
      "ein Name darf nicht ausgesprochen werden"
    ],
    "stakes": [
      "Der Einsatz ist Wahrheit: Verdr\xE4ngt oder erkannt.",
      "Der Einsatz ist Identit\xE4t: Wer spricht wirklich?",
      "Der Einsatz ist Begehren: Erf\xFCllt oder verschoben.",
      "Der Einsatz ist Freiheit: Neurose oder Einsicht.",
      "Der Einsatz ist Erinnerung: Heilung oder Wiederholung."
    ],
    "endings": [
      "Und das Unbewusste l\xE4chelt.",
      "Und das Symptom verschwindet \u2013 vorl\xE4ufig.",
      "So bleibt nur eine neue Deutung.",
      "Und der Traum beginnt erneut.",
      "Und ich wei\xDF, warum ich es vergessen habe."
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
      "ein Geb\xE4ude auf Stelzen"
    ],
    "hooks": [
      "Der Raum ist gr\xF6\xDFer als gedacht.",
      "Nichts lenkt ab.",
      "Licht f\xE4llt wie ein Entwurf.",
      "Die W\xE4nde scheinen zu schweigen.",
      "Die Stadt beginnt im Wohnzimmer."
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
      "eine Designlampe"
    ],
    "turns": [
      "Form folgt Funktion radikal",
      "Innen und Au\xDFen verschmelzen",
      "Ornament verschwindet",
      "der Raum wird flexibel",
      "Technik wird sichtbar",
      "Transparenz erzeugt Kontrolle",
      "Minimalismus wird zum Statement"
    ],
    "obstacles": [
      "K\xE4lte des Materials",
      "Verlust von Intimit\xE4t",
      "Kostenexplosion",
      "Stadtverdichtung",
      "Nachhaltigkeitskonflikt",
      "Glas wird zur Grenze",
      "Funktion widerspricht Gef\xFChl"
    ],
    "stakes": [
      "Der Einsatz ist Lebensqualit\xE4t: Raum als Haltung.",
      "Der Einsatz ist Nachhaltigkeit: Zukunft bauen oder verbrauchen.",
      "Der Einsatz ist Identit\xE4t: Geb\xE4ude als Aussage.",
      "Der Einsatz ist Offenheit: Transparenz oder \xDCberwachung.",
      "Der Einsatz ist Zeit: Zeitlos oder Trend."
    ],
    "endings": [
      "Und das Licht bleibt.",
      "Und der Raum atmet.",
      "So steht nur noch Struktur.",
      "Und die Stadt nimmt es auf.",
      "Und das Geb\xE4ude wird Idee."
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
      "ein Baum, der zwei St\xE4mme teilt"
    ],
    "hooks": [
      "die Schafe schweigen alle zugleich",
      "ein Duft nach Weihrauch ohne Altar",
      "ihre H\xE4nde ber\xFChren sich, ohne sich zu bewegen",
      "ein Schatten, der keinem K\xF6rper geh\xF6rt",
      "das Gras neigt sich ohne Wind",
      "zwei Becher, die nie leer werden",
      "ein Lachen, das aus der Erde kommt",
      "die Sonne steht still \xFCber der Weide"
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
      "ein verwittertes Amulett"
    ],
    "turns": [
      "pl\xF6tzlich erkennen sie die Fremden als G\xF6tter",
      "ihr L\xE4cheln verr\xE4t ein Wissen, das nicht von dieser Welt ist",
      "das Dorf versinkt, w\xE4hrend ihre H\xFCtte zum Tempel wird",
      "die Schafe knien nieder, als w\xFCssten sie es l\xE4ngst",
      "aus Gastfreundschaft wird ein Schicksal",
      "ihre Jugend weicht, doch ihr L\xE4cheln bleibt dasselbe"
    ],
    "obstacles": [
      "die G\xF6tter verlangen ein Opfer, das sie nicht geben wollen",
      "das Dorf verweigert den Fremden die T\xFCr",
      "die Zeit will sie trennen, doch sie halten sich fest",
      "der Nebel verschluckt den Weg zur\xFCck",
      "kein Sterblicher darf die Wahrheit tragen"
    ],
    "stakes": [
      "Der Einsatz ist ihre Liebe: gepr\xFCft von den G\xF6ttern selbst.",
      "Der Einsatz ist die Gastfreundschaft: das letzte Gesetz der Menschen.",
      "Der Einsatz ist ihr gemeinsamer Tod: als Baum vereint.",
      "Der Einsatz ist das Schicksal: unabwendbar wie ein Orakel.",
      "Der Einsatz ist die Erinnerung: an das, was Menschlichkeit bedeutet."
    ],
    "endings": [
      "So verwandeln sich zwei Herzen in einen Baum.",
      "So bleibt ihr L\xE4cheln in der Rinde erhalten.",
      "So endet die Weide, wo ein Tempel begann.",
      "So schlie\xDFt sich der Kreis der G\xF6tter und Menschen.",
      "So spricht der Chor: Liebe \xFCberdauert das Fleisch."
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
      "ein Antrag, der dich beantragt"
    ],
    "hooks": [
      "eine Durchsage, die nur dich meint",
      "ein falsches Datum auf der Akte",
      "ein Schalter ohne Personal",
      "ein Stempelger\xE4usch hinter der Wand",
      "ein Formular, das schon ausgef\xFCllt ist",
      "ein Ticket, dessen Nummer fehlt",
      "eine Unterschrift, die du nie gesetzt hast"
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
      "eine Akte"
    ],
    "turns": [
      "pl\xF6tzlich gilt eine Regel r\xFCckwirkend",
      "die Spur f\xFChrt in ein Archiv, das dich kennt",
      "die Sachbearbeitung spricht in Imperativen",
      "ein Feld ist leer \u2013 und trotzdem ausgef\xFCllt",
      "die Logik bleibt korrekt, aber in falscher Reihenfolge",
      "du erh\xE4ltst eine Best\xE4tigung f\xFCr etwas, das du nicht getan hast"
    ],
    "obstacles": [
      "die T\xFCr ist verschlossen",
      "jemand h\xF6rt mit",
      "die Akte tr\xE4gt das falsche Datum",
      "dein Antrag braucht einen Schatten",
      "das Fenster schlie\xDFt in drei Minuten"
    ],
    "stakes": [
      "Der Einsatz ist Zeit: Die Frist ist real.",
      "Der Einsatz ist W\xFCrde: Du bist eine Nummer.",
      "Der Einsatz ist Wahrheit: Das Formular l\xFCgt nicht.",
      "Der Einsatz ist Kontrolle: Du hast sie nicht."
    ],
    "endings": [
      "Und niemand unterschrieb.",
      "So schlie\xDFt sich der Kreis.",
      "Und es beginnt erst dort.",
      "Und die T\xFCr f\xE4llt ins Schloss.",
      "Und der Bescheid bleibt ohne Antwort."
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
      "Winter \xFCber leeren Feldern"
    ],
    "hooks": [
      "die B\xE4ckerei \xF6ffnet heute nicht",
      "jemand teilt die letzte Scheibe zu genau",
      "ein Sack Mehl fehlt im Lager",
      "der Preis steigt \xFCber Nacht",
      "ein Teller steht zu viel auf dem Tisch"
    ],
    "props": [
      "einen L\xF6ffel",
      "einen Krug Wasser",
      "einen Kanten Brot",
      "eine leere Sch\xFCssel",
      "einen Sack Mehl",
      "ein Messer",
      "einen Marktkorb",
      "eine Waage"
    ],
    "turns": [
      "das Brot reicht f\xFCr einen weniger",
      "jemand stiehlt und wird gesehen",
      "der Nachbar teilt, ohne zu fragen",
      "die Vorr\xE4te finden sich, aber verdorben",
      "der Hunger geht, die Angst bleibt"
    ],
    "obstacles": [
      "die Felder tragen nichts",
      "der Markt bleibt geschlossen",
      "das Geld reicht bis Dienstag",
      "niemand \xF6ffnet die T\xFCr",
      "der Weg zur Stadt ist zu weit"
    ],
    "stakes": [
      "Der Einsatz ist ein Winter.",
      "Der Einsatz ist die Kraft f\xFCr morgen.",
      "Der Einsatz ist der Stolz beim Bitten.",
      "Der Einsatz ist ein Kind am Tisch.",
      "Der Einsatz ist die letzte Scheibe."
    ],
    "endings": [
      "Der Teller bleibt leer, das Licht wird kalt.",
      "Am Morgen ist der Krug noch voll.",
      "Sie teilen, und es reicht nicht.",
      "Drau\xDFen backt jemand, hier z\xE4hlt jemand.",
      "Der Hunger legt sich schlafen und wacht fr\xFCher auf."
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

// test/ressort.ts
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
var ids = Object.keys(BUILTIN_PRESETS);
var text = (e) => typeof e === "string" ? e : e.text;
var W = (s) => s.split(/\s+/).filter(Boolean).length;
var eingabe = (ziel) => ({
  where: "an der Unterelbe",
  when: "im Herbst 1923",
  who: "die Ostmoor-Werft",
  what: "meldet einen Vorfall",
  tone: "nuechtern",
  form: "bericht",
  lenTarget: ziel,
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
});
for (const r of RESSORT_IDS) {
  const groessen = RESSORTS[r].einheiten.filter((e) => e.rolle === "groesse");
  wahr(`${r} f\xFChrt eine eigene Gr\xF6\xDFe (${groessen.map((g) => g.einheit).join(", ") || "\u2014"})`, groessen.length >= 1);
}
{
  let nackteMeter = 0, n = 0;
  for (const r of RESSORT_IDS) {
    for (let i = 0; i < 12; i++) {
      const fb = ziehFaktenblatt(eingabe(220), r);
      n++;
      if (fb.zahlen.some((z) => z.einheit === "Meter" || z.einheit === "Quadratmeter")) nackteMeter++;
    }
  }
  ist(`kein Bericht bekommt eine nackte L\xE4ngenangabe (${n} Faktenbl\xE4tter)`, nackteMeter, 0);
}
{
  const messe = (ziel) => {
    let z = 0, c = 0, p = 0;
    for (let i = 0; i < 40; i++) {
      const fb = ziehFaktenblatt(eingabe(ziel), "wirtschaft");
      z += fb.zahlen.length;
      c += fb.chronologie.length;
      p += fb.personen.length;
    }
    return { zahlen: z / 40, chrono: c / 40, personen: p / 40 };
  };
  const klein = messe(200), gross = messe(600);
  wahr(`mehr Zahlen bei gro\xDFem Ziel (${klein.zahlen.toFixed(1)} \u2192 ${gross.zahlen.toFixed(1)})`, gross.zahlen > klein.zahlen + 1);
  wahr(`l\xE4ngere Chronologie (${klein.chrono.toFixed(1)} \u2192 ${gross.chrono.toFixed(1)})`, gross.chrono > klein.chrono + 1);
  wahr(`eine dritte Stimme (${klein.personen.toFixed(1)} \u2192 ${gross.personen.toFixed(1)})`, gross.personen > klein.personen);
  ist("bei kleinem Ziel bleibt es bei zwei Stimmen", Math.round(klein.personen), 2);
}
{
  const gross = { motifs: [], hooks: [], props: [], turns: [], obstacles: [], stakes: [], endings: [] };
  for (const id of ids.slice(0, 10)) {
    const b = BUILTIN_PRESETS[id];
    for (const k of Object.keys(gross)) gross[k].push(...b[k] || []);
  }
  const laenge = (ziel) => {
    let w = 0;
    for (let i = 0; i < 20; i++) w += W(text(buildBericht(gross, eingabe(ziel), "wirtschaft")));
    return w / 20;
  };
  const l220 = laenge(220), l320 = laenge(320), l450 = laenge(450), l600 = laenge(600);
  wahr(`Ziel 320 ergibt mehr als Ziel 220 (${Math.round(l220)} \u2192 ${Math.round(l320)})`, l320 > l220);
  wahr(`Ziel 450 mehr als 320 (${Math.round(l320)} \u2192 ${Math.round(l450)})`, l450 > l320);
  wahr(`Ziel 600 mehr als 450 (${Math.round(l450)} \u2192 ${Math.round(l600)})`, l600 > l450);
  wahr(`und Ziel 450 trifft die Vorgabe brauchbar (${Math.round(100 * l450 / 450)} %)`, l450 / 450 > 0.8);
}
{
  let mitChronik = 0, mitZahlen = 0, mitDrittem = 0;
  for (let i = 0; i < 30; i++) {
    const t = text(buildBericht(BUILTIN_PRESETS[ids[i % ids.length]], eingabe(600), "wirtschaft"));
    if (/(^|\n)Chronik: /.test(t)) mitChronik++;
    if (/(^|\n)In Zahlen: /.test(t)) mitZahlen++;
    if ((t.match(/“, sagte /g) || []).length >= 3) mitDrittem++;
  }
  wahr(`der Bericht bekommt eine Chronik (${mitChronik}/30)`, mitChronik >= 25);
  wahr(`einen Zahlenabschnitt (${mitZahlen}/30)`, mitZahlen >= 20);
  wahr(`und eine dritte Stimme (${mitDrittem}/30)`, mitDrittem >= 25);
  let kleinChronik = 0;
  for (let i = 0; i < 30; i++) {
    const t = text(buildBericht(BUILTIN_PRESETS[ids[i % ids.length]], eingabe(160), "wirtschaft"));
    if (/(^|\n)Chronik: /.test(t)) kleinChronik++;
  }
  ist("bei kleinem Ziel bleibt sie weg", kleinChronik, 0);
}
console.log(`Pr\xFCfstand Ressort \u2014 ${geprueft} Pr\xFCfungen, ${bestanden} bestanden`);
var proc = globalThis;
if (fails.length) {
  console.error(`
\u274C Ressort: ${fails.length} Fehler:`);
  fails.forEach((f) => console.error("  - " + f));
  proc.process?.exit(1);
} else {
  console.log(`
\u2705 Ressort: alle ${geprueft} Pr\xFCfungen bestanden.`);
}
