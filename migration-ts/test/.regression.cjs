"use strict";

// test/regression.data.ts
var REGRESSIONSFAELLE = [
  {
    id: "zuckerkringel-splice",
    titel: "Zuckerkringel-Splice",
    // Ein Rahmen mit Akkusativ-Leerstelle hat einen ganzen Hauptsatz geschluckt.
    text: "Ich kenne auf der T\xFCrklinke klebt ein Zuckerkringel. Die Frist ist r\xFCckwirkend. Baucis will das Formular l\xFCgt. Der Ausgang ist innen.",
    pathologie: "Rahmen mit \u27E8AKK\u27E9-Slot nimmt einen Hauptsatz statt einer Nominalphrase auf. Muss durch die Slot-Typpr\xFCfung strukturell unm\xF6glich sein.",
    erwartung: { slotBruch: true }
  },
  {
    id: "schafsweiden-schleife",
    titel: "Schafsweiden-Schleife",
    // Ging als Sieger aus 50 Kandidaten hervor, obwohl Phrasen mehrfach wiederkehren.
    text: "Auf der Schafsweide bemerkt Baucis eine rote Feder im falschen Winkel. Auf der Schafsweide steht Baucis vor einer roten Feder. Der Einsatz ist Kontrolle. Auf der Schafsweide bemerkt Baucis den Riss. Der Einsatz ist Kontrolle. Eine rote Feder im falschen Winkel bleibt liegen.",
    pathologie: "Wiederkehrende Drei- und Viergramme (\u201Eauf der Schafsweide bemerkt Baucis\u201C, \u201Eder Einsatz ist Kontrolle\u201C). Muss von der Phrasenwiederholung abgewertet werden.",
    erwartung: { phraseRepeatMin: 0.1 }
  },
  {
    id: "tempus-sprung",
    titel: "Zeitebenen-Sprung",
    text: "Der Hafen lag still im Nebel. Ein Mann ging \xFCber den Steg. Die Kornkammern sind leer. Man erkannte nichts. Die Uhr tickt weiter.",
    pathologie: "Pr\xE4teritum und Pr\xE4sens wechseln mitten im Text.",
    erwartung: { tenseBreakMin: 0.15 }
  },
  {
    id: "figuren-streuung",
    titel: "Figuren-Streuung",
    text: "Baucis wartet am Fenster. Zar Peter unterschreibt den Erlass. Ludwig z\xF6gert im Saal. Der B\xE4cker aus Konstanz klopft. Philemon schweigt.",
    pathologie: "F\xFCnf Figurenkerne in einem Absatz \u2014 die Aufmerksamkeit zerf\xE4llt.",
    erwartung: { castSpreadMin: 0.2 }
  },
  {
    id: "perspektiv-bruch",
    titel: "Perspektivbruch",
    text: "Tom wartet am Kai. Er nimmt die Glocke. Aber du darfst nicht frei sprechen. Der Kran steht still. Ich sehe nichts.",
    pathologie: "Du- und Ich-Formen in einer Er-Erz\xE4hlung.",
    erwartung: { perspBreakMin: 0.2 }
  },
  {
    id: "zweitslot-kollision",
    titel: "Zweitslot-Kollision",
    text: "Du hattest Die Luft roch nach Papier und geduldeter Angst schon in der Hand, denn ein taumelnder Mast.",
    erwartung: { zweitslot: true }
  }
];

// src/text-utils.ts
function clean(s) {
  return (s ?? "").toString().trim().replace(/\s+/g, " ");
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

// src/atoms/assemble.ts
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

// test/regression.ts
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
var zeilen = [];
for (const f of REGRESSIONSFAELLE) {
  const e = f.erwartung;
  const werte = [];
  if (e.phraseRepeatMin !== void 0) {
    const v = phraseRepeatRatio(f.text);
    werte.push(`Phrasen ${v.toFixed(3)} (\u2265 ${e.phraseRepeatMin})`);
    if (v < e.phraseRepeatMin) fails.push(`${f.id}: Phrasenwiederholung nur ${v.toFixed(3)}, erwartet \u2265 ${e.phraseRepeatMin}`);
  }
  if (e.tenseBreakMin !== void 0) {
    const v = tenseBreakRatio(f.text);
    werte.push(`Tempus ${v.toFixed(3)} (\u2265 ${e.tenseBreakMin})`);
    if (v < e.tenseBreakMin) fails.push(`${f.id}: Tempusbruch nur ${v.toFixed(3)}, erwartet \u2265 ${e.tenseBreakMin}`);
  }
  if (e.castSpreadMin !== void 0) {
    const v = castSpread(f.text, ["Baucis"]);
    werte.push(`Figuren ${v.toFixed(3)} (\u2265 ${e.castSpreadMin})`);
    if (v < e.castSpreadMin) fails.push(`${f.id}: Figurenstreuung nur ${v.toFixed(3)}, erwartet \u2265 ${e.castSpreadMin}`);
  }
  if (e.perspBreakMin !== void 0) {
    const v = perspectiveBreakRatio(f.text, "third");
    werte.push(`Perspektive ${v.toFixed(3)} (\u2265 ${e.perspBreakMin})`);
    if (v < e.perspBreakMin) fails.push(`${f.id}: Perspektivbruch nur ${v.toFixed(3)}, erwartet \u2265 ${e.perspBreakMin}`);
  }
  if (e.slotBruch) {
    const mk = (text, over = {}) => ({ ...deriveAtom(text), id: "t-" + Math.random(), quelle: "test", bruchgrad: 0, verlangt: null, ...over });
    const rahmen = mk("Ich kenne \u27E8AKK\u27E9", { typ: "rahmen", verlangt: { rolle: "objekt", kasus: "akk", art: "nominalphrase" } });
    const k = { vorheriges: rahmen, offenerKopf: false, entitaeten: /* @__PURE__ */ new Map(), tempus: null, divergenz: 100, benutzt: /* @__PURE__ */ new Set() };
    const boeser = mk("auf der T\xFCrklinke klebt ein Zuckerkringel");
    const guter = mk("den Satz, der nur noch nach S\xFCden zeigt");
    const abgewiesen = !passt(boeser, k);
    const zugelassen = passt(guter, k);
    werte.push(`Splice abgewiesen: ${abgewiesen ? "ja" : "NEIN"} \xB7 g\xFCltige F\xFCllung zugelassen: ${zugelassen ? "ja" : "nein"}`);
    if (!abgewiesen) fails.push(`${f.id}: Hauptsatz wird in einen Nominalphrasen-Slot gelassen \u2014 der Splice ist wieder m\xF6glich`);
    if (!zugelassen) fails.push(`${f.id}: g\xFCltige Akkusativ-Nominalphrase wird abgewiesen \u2014 Pr\xFCfung zu streng`);
  }
  if (e.zweitslot) {
    const mk = (text, over = {}) => ({ ...deriveAtom(text), id: "z-" + Math.random(), quelle: "test", bruchgrad: 0, verlangt: null, ...over });
    const vorlage = "Du hattest \u27E8AKK\u27E9 schon in der Hand, denn \u27E8SATZ\u27E9.";
    const rest = vorlage.replace("\u27E8AKK\u27E9", "die Mappe");
    const s1 = naechsterSlot(vorlage), s2 = naechsterSlot(rest);
    const rahmen = mk(vorlage, { typ: "rahmen", verlangt: s1 });
    const k = { vorheriges: rahmen, offenerKopf: false, entitaeten: /* @__PURE__ */ new Map(), tempus: null, divergenz: 100, benutzt: /* @__PURE__ */ new Set() };
    const satz = mk("die Luft roch nach Papier und geduldeter Angst");
    const phrase = mk("ein taumelnder Mast");
    const a1 = !passt(satz, k, void 0, s1);
    const a2 = !passt(phrase, k, void 0, s2);
    const verb = wirktSatzwertig("die Luft roch nach Papier");
    werte.push(`Satz in \u27E8AKK\u27E9 abgewiesen: ${a1 ? "ja" : "NEIN"} \xB7 Fragment in \u27E8SATZ\u27E9 abgewiesen: ${a2 ? "ja" : "NEIN"} \xB7 \u201Eroch\u201C erkannt: ${verb ? "ja" : "NEIN"}`);
    if (!a1) fails.push(`${f.id}: satzwertiges Atom wird in einen Akkusativ-Slot gelassen`);
    if (!a2) fails.push(`${f.id}: Nominalphrase wird in einen \u27E8SATZ\u27E9-Slot gelassen`);
    if (!verb) fails.push(`${f.id}: starkes Pr\xE4teritum \u201Eroch\u201C wird nicht als finites Verb erkannt`);
  }
  zeilen.push(`  ${f.titel.padEnd(22)} ${werte.join(" \xB7 ")}`);
}
console.log("Regressionsf\xE4lle:");
zeilen.forEach((z) => console.log(z));
var proc = globalThis;
if (fails.length) {
  console.error(`
\u274C ${fails.length} Regression(en) \u2014 Kalibrierung zu lasch:`);
  fails.forEach((f) => console.error("  - " + f));
  proc.process?.exit(1);
} else {
  console.log(`
\u2705 Alle ${REGRESSIONSFAELLE.length} Regressionsf\xE4lle werden erkannt.`);
}
