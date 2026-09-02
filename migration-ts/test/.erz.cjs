"use strict";
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
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
function namensErsetzer(name) {
  const mitArtikel = /^(ein|eine|einen|einem|einer|der|die|das|den|dem|des)\s/i.test(name);
  return (m) => mitArtikel && /^[a-zäöü]/.test(m) ? name.charAt(0).toLowerCase() + name.slice(1) : name;
}
var MONATE, ORDNUNGSZAHL, ABKUERZUNG, HAENGT_IN_DER_LUFT;
var init_text_utils = __esm({
  "src/text-utils.ts"() {
    "use strict";
    MONATE = /^(?:Januar|Februar|März|April|Mai|Juni|Juli|August|September|Oktober|November|Dezember|Jahrhunderts?|Jh\.|Hälfte|Auflage|Band|Kapitel|Absatz|Teil)\b/u;
    ORDNUNGSZAHL = /\d\.$/;
    ABKUERZUNG = /(?:^|\s)(?:[A-Za-zÄÖÜäöü]|ca|bzw|bspw|evtl|ggf|inkl|Nr|St|Dr|Prof|Abs|Art|Bd|Hrsg|usw|etc)\.$/u;
    HAENGT_IN_DER_LUFT = /(^|\s)(ein|eine|einem|einen|einer|eines|der|die|das|dem|den|des|und|oder|aber|wie|als|im|am|beim|zum|zur|vom|von|für|ohne|durch|gegen|bei|seit|während|wegen|trotz|dass|weil|denn|sondern|sowie|bzw|etwa|sehr|dessen|deren|welche[rsmn]?)$/i;
  }
});

// src/generation/verben.ts
function starkMitPraefix(form) {
  if (STARK[form]) return ["", STARK[form]];
  for (const p of PRAEFIXE) {
    if (form.startsWith(p) && form.length > p.length + 2) {
      const rest = form.slice(p.length);
      if (STARK[rest]) return [p, STARK[rest]];
    }
  }
  return null;
}
function istVerbform(wort) {
  const w = wort.toLowerCase();
  if (starkMitPraefix(w)) return true;
  if (KEIN_VERB.has(w)) return false;
  if (!/^[a-zäöüß]{3,}t$/.test(w)) return false;
  if (/^ge[a-zäöüß]{2,}t$/.test(w)) return GE_VERBEN.test(w);
  return true;
}
function beugeVerb(form3, person) {
  const gross = /^[A-ZÄÖÜ]/.test(form3);
  const w = form3.toLowerCase();
  const fertig = (s) => gross ? s.charAt(0).toUpperCase() + s.slice(1) : s;
  if (person === "er" || person === "sie") return istVerbform(w) ? form3 : null;
  const st2 = starkMitPraefix(w);
  if (st2) {
    const [p, [ich, du, wir, ihr]] = st2;
    const f = person === "ich" ? ich : person === "du" ? du : person === "wir" ? wir : ihr || wir.replace(/e?n$/, "t");
    return fertig(p + f);
  }
  if (!istVerbform(w)) return null;
  let stamm = w.slice(0, -1);
  const bindevokal = /[td]et$/.test(w) || /(chn|ffn|gn|tm|dm|ckn|kn)et$/.test(w);
  if (bindevokal) stamm = w.slice(0, -2);
  if (person === "ihr") return fertig(w);
  if (person === "wir") {
    if (/e[lr]$/.test(stamm)) return fertig(stamm + "n");
    return fertig(stamm + "en");
  }
  if (person === "du") {
    if (bindevokal) return fertig(stamm + "est");
    if (SIBILANT.test(stamm)) return fertig(w);
    return fertig(stamm + "st");
  }
  if (/el$/.test(stamm)) return fertig(stamm.slice(0, -2) + "le");
  return fertig(stamm + "e");
}
var STARK, PRAEFIXE, KEIN_VERB, SIBILANT, GE_VERBEN;
var init_verben = __esm({
  "src/generation/verben.ts"() {
    "use strict";
    STARK = {
      // sein · haben · werden · wissen · tun · Modalverben
      ist: ["bin", "bist", "sind", "seid"],
      hat: ["habe", "hast", "haben", "habt"],
      wird: ["werde", "wirst", "werden", "werdet"],
      wei\u00DF: ["wei\xDF", "wei\xDFt", "wissen", "wisst"],
      tut: ["tue", "tust", "tun", "tut"],
      kann: ["kann", "kannst", "k\xF6nnen", "k\xF6nnt"],
      muss: ["muss", "musst", "m\xFCssen", "m\xFCsst"],
      will: ["will", "willst", "wollen", "wollt"],
      soll: ["soll", "sollst", "sollen", "sollt"],
      darf: ["darf", "darfst", "d\xFCrfen", "d\xFCrft"],
      mag: ["mag", "magst", "m\xF6gen", "m\xF6gt"],
      // a → ä
      h\u00E4lt: ["halte", "h\xE4ltst", "halten", "haltet"],
      f\u00E4llt: ["falle", "f\xE4llst", "fallen", "fallt"],
      tr\u00E4gt: ["trage", "tr\xE4gst", "tragen", "tragt"],
      l\u00E4uft: ["laufe", "l\xE4ufst", "laufen", "lauft"],
      schl\u00E4ft: ["schlafe", "schl\xE4fst", "schlafen", "schlaft"],
      f\u00E4ngt: ["fange", "f\xE4ngst", "fangen", "fangt"],
      l\u00E4sst: ["lasse", "l\xE4sst", "lassen", "lasst"],
      w\u00E4chst: ["wachse", "w\xE4chst", "wachsen", "wachst"],
      gr\u00E4bt: ["grabe", "gr\xE4bst", "graben", "grabt"],
      schl\u00E4gt: ["schlage", "schl\xE4gst", "schlagen", "schlagt"],
      r\u00E4t: ["rate", "r\xE4tst", "raten", "ratet"],
      bl\u00E4st: ["blase", "bl\xE4st", "blasen", "blast"],
      st\u00F6\u00DFt: ["sto\xDFe", "st\xF6\xDFt", "sto\xDFen", "sto\xDFt"],
      f\u00E4hrt: ["fahre", "f\xE4hrst", "fahren", "fahrt"],
      w\u00E4scht: ["wasche", "w\xE4schst", "waschen", "wascht"],
      l\u00E4dt: ["lade", "l\xE4dst", "laden", "ladet"],
      s\u00E4uft: ["saufe", "s\xE4ufst", "saufen", "sauft"],
      // e → i / ie
      gibt: ["gebe", "gibst", "geben", "gebt"],
      nimmt: ["nehme", "nimmst", "nehmen", "nehmt"],
      spricht: ["spreche", "sprichst", "sprechen", "sprecht"],
      bricht: ["breche", "brichst", "brechen", "brecht"],
      sieht: ["sehe", "siehst", "sehen", "seht"],
      liest: ["lese", "liest", "lesen", "lest"],
      isst: ["esse", "isst", "essen", "esst"],
      frisst: ["fresse", "frisst", "fressen", "fresst"],
      misst: ["messe", "misst", "messen", "messt"],
      vergisst: ["vergesse", "vergisst", "vergessen", "vergesst"],
      hilft: ["helfe", "hilfst", "helfen", "helft"],
      stirbt: ["sterbe", "stirbst", "sterben", "sterbt"],
      wirft: ["werfe", "wirfst", "werfen", "werft"],
      trifft: ["treffe", "triffst", "treffen", "trefft"],
      gilt: ["gelte", "giltst", "gelten", "geltet"],
      tritt: ["trete", "trittst", "treten", "tretet"],
      birgt: ["berge", "birgst", "bergen", "bergt"],
      quillt: ["quelle", "quillst", "quellen", "quellt"],
      schilt: ["schelte", "schiltst", "schelten", "scheltet"],
      ficht: ["fechte", "fichtst", "fechten", "fechtet"],
      flicht: ["flechte", "flichtst", "flechten", "flechtet"],
      verdirbt: ["verderbe", "verdirbst", "verderben", "verderbt"],
      wirbt: ["werbe", "wirbst", "werben", "werbt"],
      erschrickt: ["erschrecke", "erschrickst", "erschrecken", "erschreckt"],
      sticht: ["steche", "stichst", "stechen", "stecht"],
      schmilzt: ["schmelze", "schmilzt", "schmelzen", "schmelzt"],
      befiehlt: ["befehle", "befiehlst", "befehlen", "befehlt"],
      stiehlt: ["stehle", "stiehlst", "stehlen", "stehlt"],
      empfiehlt: ["empfehle", "empfiehlst", "empfehlen", "empfehlt"],
      geschieht: ["geschehe", "geschiehst", "geschehen", "gescheht"],
      gebiert: ["geb\xE4re", "gebierst", "geb\xE4ren", "geb\xE4rt"],
      schwillt: ["schwelle", "schwillst", "schwellen", "schwellt"]
    };
    PRAEFIXE = [
      "zusammen",
      "zur\xFCck",
      "wieder",
      "gegen",
      "hinter",
      "durch",
      "unter",
      "\xFCber",
      "voran",
      "vorbei",
      "heraus",
      "herein",
      "hinaus",
      "hinein",
      "herum",
      "hinauf",
      "hinab",
      "herab",
      "empor",
      "fort",
      "los",
      "weg",
      "fest",
      "her",
      "hin",
      "ver",
      "ent",
      "emp",
      "miss",
      "zer",
      "be",
      "er",
      "ge",
      "an",
      "ab",
      "auf",
      "aus",
      "ein",
      "mit",
      "nach",
      "vor",
      "zu",
      "um",
      "bei",
      "da",
      "wider"
    ];
    KEIN_VERB = /* @__PURE__ */ new Set([
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
      "welt",
      "zeit",
      "nacht",
      "stadt",
      "acht",
      "licht",
      "wort",
      "ort",
      "blut",
      "brot",
      "mut",
      "hut",
      "gebet",
      "geist",
      "gott",
      "kraft",
      "luft",
      "haut",
      "haft",
      "gift",
      "schrift",
      "frucht",
      "flucht",
      "sicht",
      "pflicht",
      "angst",
      "kunst",
      "dienst",
      "frost",
      "post",
      "ost",
      "west",
      "rest",
      "test",
      "text",
      "w\xFCst",
      "getrennt",
      "gemischt",
      "gebrannt",
      "verschwunden",
      "gewohnt",
      "gelaunt",
      "ber\xFChmt",
      "geliebt",
      "gelebt",
      "gedacht",
      "gemacht",
      "gebracht",
      "gesagt",
      "gesucht",
      "gehabt",
      "gewusst",
      "gekannt",
      "genannt",
      "benannt",
      "gewollt",
      "verboten",
      "ge\xF6ffnet",
      "ungeahnt",
      "gestern",
      "heut",
      "abrupt",
      "ad\xE4quat",
      "privat",
      "intakt",
      "korrekt",
      "konkret",
      "moderat",
      "elegant",
      "brillant",
      "tolerant",
      "relevant",
      "markant",
      "rasant",
      "galant",
      "latent",
      "dezent",
      "prominent",
      "kompetent",
      "konsequent",
      "permanent",
      "evident",
      "eloquent",
      "intelligent",
      "gespannt",
      "entspannt",
      "gewandt",
      "verwandt",
      "bewusst",
      "unbewusst",
      "robust",
      "abstrakt",
      "kompakt",
      "exakt",
      "defekt",
      "perfekt",
      "insgesamt",
      "total"
    ]);
    SIBILANT = /(s|ß|z|x|tz|ss)$/;
    GE_VERBEN = /^ge(ht|nügt|hört|horcht|lingt|winnt|langt|schieht|steht|rät|nießt|wöhnt|fährdet|währt|stattet|staltet|denkt|bietet|braucht|hörcht|nest|reicht|dulde?t|fällt|deiht|lobt|leitet|langt|winnt|behrt|bärt|fried[e]?t|fällt|lüstet|mahnt|rinnt|hört)$/;
  }
});

// src/generation/nouns.data.ts
var NOUN_GENDER;
var init_nouns_data = __esm({
  "src/generation/nouns.data.ts"() {
    "use strict";
    NOUN_GENDER = {
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
  }
});

// src/generation/nouns2.data.ts
var NOUN_GENDER_2;
var init_nouns2_data = __esm({
  "src/generation/nouns2.data.ts"() {
    "use strict";
    NOUN_GENDER_2 = {
      // ── Häufigste ──
      ende: "n",
      jahr: "n",
      mal: "n",
      anfang: "m",
      leben: "n",
      auskunft: "f",
      welt: "f",
      fr\u00FChjahr: "n",
      fall: "m",
      arbeit: "f",
      sache: "f",
      zufall: "m",
      form: "f",
      ziel: "n",
      kontrolle: "f",
      reihenfolge: "f",
      wissen: "n",
      post: "f",
      ernte: "f",
      geld: "n",
      mund: "m",
      schweigen: "n",
      wette: "f",
      schminke: "f",
      kurs: "m",
      original: "n",
      text: "m",
      gras: "n",
      warten: "n",
      ruhe: "f",
      mitte: "f",
      seide: "f",
      familie: "f",
      tiefe: "f",
      norden: "m",
      s\u00FCden: "m",
      osten: "m",
      westen: "m",
      blut: "n",
      horizont: "m",
      ursache: "f",
      absicht: "f",
      wirt: "m",
      jagd: "f",
      herkunft: "f",
      essen: "n",
      r\u00FCckkehr: "f",
      rahmen: "m",
      w\u00FCrde: "f",
      w\u00E4sche: "f",
      miete: "f",
      verlangen: "n",
      marke: "f",
      griff: "m",
      wache: "f",
      vernunft: "f",
      markt: "m",
      pegel: "m",
      halbdunkel: "n",
      rolle: "f",
      grad: "m",
      streben: "n",
      fach: "n",
      weise: "f",
      wipfel: "m",
      kohle: "f",
      lehne: "f",
      tide: "f",
      ru\u00DF: "m",
      idee: "f",
      gemeinde: "f",
      jahrhundert: "n",
      ernst: "m",
      betrag: "m",
      unterschied: "m",
      material: "n",
      annahme: "f",
      merkmal: "n",
      radio: "n",
      hitze: "f",
      herold: "m",
      grat: "m",
      kasse: "f",
      zoll: "m",
      heimweh: "n",
      laden: "m",
      f\u00E4hre: "f",
      herzog: "m",
      inhalt: "m",
      titel: "m",
      problem: "n",
      sicht: "f",
      beh\u00F6rde: "f",
      winkel: "m",
      hilfe: "f",
      pass: "m",
      viertel: "n",
      jahrzehnt: "n",
      anrede: "f",
      rost: "m",
      ekel: "m",
      tat: "f",
      methode: "f",
      zwang: "m",
      heimkehr: "f",
      umkehr: "f",
      norm: "f",
      leere: "f",
      umlauf: "m",
      flamme: "f",
      einsicht: "f",
      messing: "n",
      personal: "n",
      widerspruch: "m",
      schluss: "m",
      stroh: "n",
      rang: "m",
      vieh: "n",
      garderobe: "f",
      g\u00FCte: "f",
      anlass: "m",
      anwalt: "m",
      rat: "m",
      code: "m",
      bad: "n",
      handgelenk: "n",
      scheibe: "f",
      zustand: "m",
      eile: "f",
      saatgut: "n",
      fracht: "f",
      automat: "m",
      lehre: "f",
      ding: "n",
      verzicht: "m",
      zweck: "m",
      waffe: "f",
      blech: "n",
      trost: "m",
      versuch: "m",
      ironie: "f",
      d\u00FCrre: "f",
      fest: "n",
      aufsicht: "f",
      kapitel: "n",
      aussicht: "f",
      absinth: "m",
      parf\u00FCm: "n",
      schmutz: "m",
      knick: "m",
      andacht: "f",
      spitze: "f",
      szene: "f",
      erfolg: "m",
      ausguck: "m",
      bord: "m",
      sieg: "m",
      klausel: "f",
      haupttext: "m",
      sachverhalt: "m",
      tinte: "f",
      stand: "m",
      wortlaut: "m",
      klinke: "f",
      kanzel: "f",
      verrat: "m",
      mulde: "f",
      februar: "m",
      parasit: "m",
      pr\u00E4parat: "n",
      wesen: "n",
      lava: "f",
      schwefel: "m",
      lauf: "m",
      spa\u00DF: "m",
      m\u00F6bel: "n",
      b\u00FCro: "n",
      hauptsache: "f",
      saat: "f",
      fehde: "f",
      portr\u00E4t: "n",
      reue: "f",
      konfetti: "n",
      trapez: "n",
      narr: "m",
      truppe: "f",
      pudel: "m",
      jugend: "f",
      abschied: "m",
      bronze: "f",
      tempel: "m",
      geschlecht: "n",
      stra\u00DFenanfang: "m",
      brauch: "m",
      wiederkehr: "f",
      h\u00E4lfte: "f",
      pappe: "f",
      kante: "f",
      eintrag: "m",
      format: "n",
      giebel: "m",
      heimat: "f",
      armenkasse: "f",
      materie: "f",
      mensch: "m",
      glied: "n",
      betrieb: "m",
      m\u00FCll: "m",
      kleingeld: "n",
      ruhm: "m",
      ritt: "m",
      sch\u00E4rfe: "f",
      ankunft: "f",
      symmetrie: "f",
      adressat: "m",
      kreislauf: "m",
      aufstieg: "m",
      f\u00FClle: "f",
      bitte: "f",
      brand: "m",
      waise: "f",
      gesang: "m",
      subjekt: "n",
      objekt: "n",
      moral: "f",
      schilf: "n",
      diagnose: "f",
      gr\u00F6\u00DFe: "f",
      wahl: "f",
      sturz: "m",
      gischt: "f",
      ekstase: "f",
      becken: "n",
      putz: "m",
      minze: "f",
      samt: "m",
      pause: "f",
      knauf: "m",
      apotheke: "f",
      kost\u00FCm: "n",
      versto\u00DF: "m",
      satzanfang: "m",
      sprint: "m",
      beule: "f",
      banane: "f",
      tapete: "f",
      galerie: "f",
      kl\u00F6ppel: "m",
      predigt: "f",
      zierrat: "m",
      wachwechsel: "m",
      wimpel: "m",
      rah: "f",
      streitfall: "m",
      docht: "m",
      wundmal: "n",
      pforte: "f",
      gebot: "n",
      fl\u00FCgel: "m",
      l\u00E4nge: "f",
      kamel: "n",
      achse: "f",
      schlegel: "m",
      affe: "m",
      nirwana: "n",
      alkohol: "m",
      instinkt: "m",
      balance: "f",
      aushub: "m",
      kalk: "m",
      r\u00F6hre: "f",
      basalt: "m",
      salzs\u00E4ure: "f",
      erdkruste: "f",
      schichtfolge: "f",
      sohle: "f",
      profil: "n",
      schneeschmelze: "f",
      orbit: "m",
      funkspruch: "m",
      meteorit: "m",
      stromausfall: "m",
      theorie: "f",
      nervengeflecht: "n",
      bodenprofil: "n",
      senke: "f",
      gebiet: "n",
      phase: "f",
      honorar: "n",
      kordel: "f",
      spind: "m",
      tonfall: "m",
      tempo: "n",
      schattenkante: "f",
      stahl: "m",
      graupappe: "f",
      st\u00FCtze: "f",
      perspektive: "f",
      tank: "m",
      stillstand: "m",
      pumpe: "f",
      debatte: "f",
      bahre: "f",
      fackelru\u00DF: "m",
      kerbe: "f",
      t\u00FCrsturz: "m",
      groll: "m",
      seuche: "f",
      lunge: "f",
      pferdegeschirr: "n",
      zeltgest\u00E4nge: "n",
      marsch: "m",
      schaumgummi: "m",
      knall: "m",
      zeltmitte: "f",
      trick: "m",
      wurf: "m",
      pult: "n",
      pentagramm: "n",
      handel: "m",
      r\u00FCcktritt: "m",
      zimt: "m",
      akt: "m",
      schatz: "m",
      betrug: "m",
      kopfende: "n",
      parkett: "n",
      lack: "m",
      leib: "m",
      efeu: "m",
      anstand: "m",
      schafwolle: "f",
      milde: "f",
      wiege: "f",
      schar: "f",
      gunst: "f",
      volk: "n",
      staat: "m",
      antlitz: "n",
      fleck: "m",
      alibi: "n",
      kamera: "f",
      vorfall: "m",
      quelltext: "m",
      ritual: "n",
      schl\u00E4fe: "f",
      wetterwechsel: "m",
      anzeige: "f",
      jahresende: "n",
      weile: "f",
      t\u00FCll: "m",
      schleppe: "f",
      b\u00FCgel: "m",
      dampf: "m",
      kragen: "m",
      kerzenstummel: "m",
      klasse: "f",
      monatsende: "n",
      tausendstel: "n",
      durchlauf: "m",
      jahrtausend: "n",
      scheu: "f",
      taxi: "n",
      mittwoch: "m",
      erz: "n",
      diebstahl: "m",
      nachtwache: "f",
      schleuse: "f",
      \u00FCbernahme: "f",
      luke: "f",
      sp\u00FCle: "f",
      ampel: "f",
      sperrm\u00FCll: "m",
      speiche: "f",
      henkel: "m",
      routine: "f",
      mai: "m",
      wolle: "f",
      schluck: "m",
      biologie: "f",
      geologie: "f",
      astrologie: "f",
      philosophie: "f",
      krise: "f",
      trag\u00F6die: "f",
      urknall: "m",
      stift: "m",
      mine: "f",
      abwehr: "f",
      mole: "f",
      zerfall: "m",
      masse: "f",
      handbreit: "f",
      verfall: "m",
      tischkante: "f",
      beute: "f",
      rache: "f",
      font\u00E4ne: "f",
      zuversicht: "f",
      unruhe: "f",
      energie: "f",
      enge: "f",
      april: "m",
      rekord: "m",
      normalzustand: "m",
      h\u00F6he: "f",
      abstieg: "m",
      requisit: "n",
      schwindel: "m",
      orakelspruch: "m",
      erlass: "m",
      aufstand: "m",
      gehorsam: "m",
      blackbox: "f",
      silhouette: "f",
      mode: "f",
      not: "f",
      urform: "f",
      ruhestand: "m",
      schaden: "m",
      anlauf: "m",
      dienstjahr: "n",
      witwe: "f",
      ensemble: "n",
      kommune: "f",
      sekte: "f",
      rettungstrupp: "m",
      exil: "n",
      zentrale: "f",
      zensurbeh\u00F6rde: "f",
      doktortitel: "m",
      naturschutzgebiet: "n",
      boulevard: "m",
      hotel: "n",
      kino: "n",
      verkehr: "m",
      kellerclub: "m",
      kabine: "f",
      auto: "n",
      kaserne: "f",
      internat: "n",
      wahlkabine: "f",
      anstalt: "f",
      mittagspause: "f",
      choleraepidemie: "f",
      monarchie: "f",
      hungersnot: "f",
      null: "f",
      route: "f",
      kampagne: "f",
      karriere: "f",
      neuanfang: "m",
      sorte: "f",
      verhandlungssache: "f",
      folge: "f",
      ablauf: "m",
      strategie: "f",
      apparat: "m",
      psychopath: "m",
      variable: "f",
      empathie: "f",
      amsel: "f",
      schneefall: "m",
      abendrot: "n",
      wechsel: "m",
      // ── Nachschlag: Alltag, Körper, Haus, Natur, Amt ──
      auge: "n",
      name: "m",
      glaube: "m",
      wille: "m",
      gedanke: "m",
      friede: "m",
      funke: "m",
      k\u00E4se: "m",
      junge: "m",
      kunde: "m",
      l\u00F6we: "m",
      hase: "m",
      bote: "m",
      zeuge: "m",
      riese: "m",
      rabe: "m",
      falke: "m",
      ochse: "m",
      bursche: "m",
      knabe: "m",
      neffe: "m",
      erbe: "m",
      buchstabe: "m",
      same: "m",
      schatten: "m",
      wagen: "m",
      boden: "m",
      garten: "m",
      ofen: "m",
      regen: "m",
      faden: "m",
      haken: "m",
      hafen: "m",
      morgen: "m",
      tropfen: "m",
      kissen: "n",
      zeichen: "n",
      kuchen: "m",
      knochen: "m",
      r\u00FCcken: "m",
      segen: "m",
      bogen: "m",
      balken: "m",
      riegel: "m",
      ballen: "m",
      fels: "m",
      haus: "n",
      glas: "n",
      bus: "m",
      fluss: "m",
      kuss: "m",
      guss: "m",
      gru\u00DF: "m",
      fu\u00DF: "m",
      hass: "m",
      kompass: "m",
      atlas: "m",
      kreis: "m",
      preis: "m",
      eis: "n",
      reis: "m",
      gleis: "n",
      flei\u00DF: "m",
      geheimnis: "n",
      ergebnis: "n",
      zeugnis: "n",
      bed\u00FCrfnis: "n",
      verh\u00E4ltnis: "n",
      ereignis: "n",
      erlebnis: "n",
      b\u00FCndnis: "n",
      hindernis: "n",
      gef\u00E4ngnis: "n",
      wildnis: "f",
      finsternis: "f",
      fenster: "n",
      zimmer: "n",
      wasser: "n",
      messer: "n",
      feuer: "n",
      kupfer: "n",
      silber: "n",
      pulver: "n",
      wetter: "n",
      alter: "n",
      ufer: "n",
      lager: "n",
      opfer: "n",
      muster: "n",
      kloster: "n",
      register: "n",
      theater: "n",
      fieber: "n",
      leder: "n",
      futter: "n",
      gitter: "n",
      ruder: "n",
      wunder: "n",
      orchester: "n",
      zepter: "n",
      semester: "n",
      polster: "n",
      pflaster: "n",
      laster: "n",
      meter: "m",
      liter: "m",
      zentrum: "n",
      datum: "n",
      museum: "n",
      t\u00FCr: "f",
      hand: "f",
      stern: "m",
      schritt: "m",
      brief: "m",
      weg: "m",
      stimme: "f",
      spur: "f",
      lippe: "f",
      frage: "f",
      perle: "f",
      glocke: "f",
      uhr: "f",
      herz: "n",
      dach: "n",
      stra\u00DFe: "f",
      regel: "f",
      vorrat: "m",
      schicht: "f",
      schaf: "n",
      nummer: "f",
      schuh: "m",
      grenze: "f",
      gutachten: "n",
      satz: "m",
      wort: "n",
      seele: "f",
      teil: "m",
      blume: "f",
      richtung: "f",
      monat: "m",
      zahn: "m",
      ort: "m",
      wand: "f",
      vorhang: "m",
      umstand: "m",
      sandsack: "m",
      kraft: "f",
      bein: "n",
      kanal: "m",
      sinn: "m",
      netz: "n",
      pflasterstein: "m",
      handschuh: "m",
      protokoll: "n",
      system: "n",
      kreidestrich: "m",
      bruchteil: "m",
      tor: "n",
      kran: "m",
      beweis: "m",
      nacht: "f",
      stadt: "f",
      grund: "m",
      zug: "m",
      riff: "n",
      plakat: "n",
      baum: "m",
      erbgang: "m",
      exemplar: "n",
      symptom: "n",
      plan: "m",
      umriss: "m",
      riss: "m",
      bahngleis: "n",
      regal: "n",
      blick: "m",
      bergpass: "m",
      faust: "f",
      stuhl: "m",
      freund: "m",
      stamm: "m",
      tanzschuh: "m",
      dienst: "m",
      ma\u00DF: "n",
      arm: "m",
      kinderhand: "f",
      tisch: "m",
      seil: "n",
      frachtbrief: "m",
      termin: "m",
      formular: "n",
      messwert: "m",
      gegenstand: "m",
      vogel: "m",
      exponat: "n",
      fahrgast: "m",
      meer: "n",
      anruf: "m",
      vorschlag: "m",
      punkt: "m",
      boot: "n",
      paar: "n",
      gast: "m",
      stein: "m",
      stunde: "f",
      minute: "f",
      tag: "m",
      woche: "f",
      seite: "f",
      farbe: "f",
      papier: "n",
      nachbar: "m",
      wolke: "f",
      zeug: "n",
      kind: "n",
      mann: "m",
      frau: "f",
      vater: "m",
      mutter: "f",
      bruder: "m",
      schwester: "f",
      sohn: "m",
      tochter: "f",
      herr: "m",
      dame: "f",
      lehrer: "m",
      arzt: "m",
      pfarrer: "m",
      priester: "m",
      k\u00F6nig: "m",
      k\u00F6nigin: "f",
      kaiser: "m",
      soldat: "m",
      bauer: "m",
      fischer: "m",
      b\u00E4cker: "m",
      schneider: "m",
      schmied: "m",
      m\u00FCller: "m",
      j\u00E4ger: "m",
      hirte: "m",
      knecht: "m",
      magd: "f",
      w\u00E4chter: "m",
      richter: "m",
      h\u00E4ndler: "m",
      fremde: "m",
      kurier: "m",
      agent: "m",
      spion: "m",
      dieb: "m",
      r\u00E4uber: "m",
      m\u00F6rder: "m",
      opferlamm: "n",
      engel: "m",
      teufel: "m",
      geist: "m",
      gott: "m",
      g\u00F6ttin: "f",
      heiliger: "m",
      m\u00F6nch: "m",
      nonne: "f",
      abt: "m",
      bischof: "m",
      papst: "m",
      ritter: "m",
      knappe: "m",
      graf: "m",
      gr\u00E4fin: "f",
      f\u00FCrst: "m",
      prinz: "m",
      prinzessin: "f",
      zauberer: "m",
      hexe: "f",
      drache: "m",
      zwerg: "m",
      elf: "m",
      troll: "m",
      wolf: "m",
      b\u00E4r: "m",
      fuchs: "m",
      hirsch: "m",
      reh: "n",
      pferd: "n",
      hund: "m",
      katze: "f",
      maus: "f",
      ratte: "f",
      schlange: "f",
      fisch: "m",
      m\u00F6we: "f",
      taube: "f",
      kr\u00E4he: "f",
      eule: "f",
      biene: "f",
      fliege: "f",
      spinne: "f",
      k\u00E4fer: "m",
      schmetterling: "m",
      wurm: "m",
      ameise: "f",
      frosch: "m",
      kr\u00F6te: "f",
      eidechse: "f",
      schwan: "m",
      ente: "f",
      gans: "f",
      huhn: "n",
      hahn: "m",
      kuh: "f",
      stier: "m",
      ziege: "f",
      esel: "m",
      schwein: "n",
      lamm: "n",
      // Schwache Maskulina auf -e, die die -e→f-Regel sonst fälschlich fängt
      kollege: "m",
      experte: "m",
      matrose: "m",
      pate: "m",
      sklave: "m",
      laie: "m",
      insasse: "m",
      gatte: "m",
      bulle: "m",
      schurke: "m",
      geselle: "m",
      gef\u00E4hrte: "m",
      genosse: "m",
      komplize: "m",
      jude: "m",
      zar: "m",
      franzose: "m",
      chinese: "m",
      russe: "m",
      grieche: "m",
      t\u00FCrke: "m",
      ire: "m",
      schwede: "m",
      d\u00E4ne: "m",
      psychologe: "m",
      biologe: "m",
      geologe: "m",
      soziologe: "m",
      arch\u00E4ologe: "m",
      philosoph: "m",
      // Neutra auf -e
      interesse: "n",
      geb\u00E4ude: "n",
      gem\u00E4lde: "n",
      gebirge: "n",
      getreide: "n",
      gefolge: "n",
      gel\u00E4nde: "n",
      gewebe: "n",
      gew\u00F6lbe: "n",
      getriebe: "n",
      gef\u00FCge: "n",
      gelage: "n",
      gerede: "n",
      gehege: "n",
      gewerbe: "n"
    };
  }
});

// src/generation/declension.ts
function istSubstantivierterInfinitiv(w) {
  if (!/^[a-zäöüß]{4,}en$/.test(w)) return false;
  const stamm = w.slice(0, -2);
  return istVerbform(stamm + "t") || istVerbform(stamm + "et");
}
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
  const known = NOUN_GENDER2[w];
  if (known === "m" || known === "f" || known === "n") return known;
  let best = "";
  for (const k in NOUN_GENDER2) {
    if (k.length >= 3 && w.length >= k.length + 2 && w.endsWith(k) && k.length > best.length) best = k;
  }
  if (best) return NOUN_GENDER2[best];
  if (/(ung|heit|keit|schaft|tät|ion|ik|enz|anz|ei|ade|age|üre|itis|ur)$/.test(w)) return "f";
  if (/(chen|lein|ment|tum|um|nis|ma)$/.test(w)) return "n";
  if (/(ling|ismus|ant|ent|ist|eur|or|ich|ig|ast)$/.test(w)) return "m";
  if (istSubstantivierterInfinitiv(w)) return "n";
  if (/^ge[a-zäöüß]{3,}e$/.test(w)) return "n";
  if (/e$/.test(w) && w.length >= 4 && !E_AUSNAHME.test(w)) return "f";
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
  const gender = ART_GENUS[art0] || NOUN_GENDER2[nounWord.toLowerCase()] || guessGender(nounWord);
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
var NOUN_GENDER2, E_AUSNAHME, ART_GENUS;
var init_declension = __esm({
  "src/generation/declension.ts"() {
    "use strict";
    init_text_utils();
    init_verben();
    init_nouns_data();
    init_nouns2_data();
    NOUN_GENDER2 = { ...NOUN_GENDER_2, ...NOUN_GENDER };
    E_AUSNAHME = /^(ge[a-zäöüß]+e|.*(auge|ende|käse|junge|erbe|interesse))$/;
    ART_GENUS = {
      ein: void 0,
      eine: "f",
      einen: "m",
      einem: void 0,
      einer: "f",
      eines: void 0
    };
  }
});

// src/constants.ts
var STORAGE_CORPUS, DEFAULT_BANK;
var init_constants = __esm({
  "src/constants.ts"() {
    "use strict";
    STORAGE_CORPUS = "divergenz_persistent_corpus_v1";
    DEFAULT_BANK = {
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
  }
});

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
var init_verwandlung = __esm({
  "src/generation/verwandlung.ts"() {
    "use strict";
    init_text_utils();
    init_declension();
  }
});

// src/features/storage-status.ts
var init_storage_status = __esm({
  "src/features/storage-status.ts"() {
    "use strict";
  }
});

// src/storage.ts
var init_storage = __esm({
  "src/storage.ts"() {
    "use strict";
    init_storage_status();
    init_verwandlung();
    init_constants();
    init_text_utils();
  }
});

// test/erzaehler.ts
var import_jsdom = require("jsdom");
var import_fs = require("fs");

// src/generation/dramaturgie.ts
init_text_utils();

// src/generation/beats.ts
init_text_utils();

// src/generation/cooldown.ts
init_text_utils();
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

// src/atoms/assemble.ts
init_declension();

// src/generation/wordcls.ts
init_text_utils();

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

// src/generation/wordcls.ts
init_nouns_data();

// src/generation/verbconj.ts
init_verben();
var VERB_TOKEN_RE = new RegExp("\\b(" + Object.keys(VERB_CONJ).join("|") + ")\\b", "i");
function conjugateVerbToken(verb, person) {
  if (!verb) return verb;
  const isCap = /^[A-ZÄÖÜ]/.test(verb);
  const low2 = verb.toLowerCase();
  const table = VERB_CONJ[low2];
  let out;
  if (table && table[person]) {
    out = table[person];
  } else {
    const p = person === "ich" || person === "du" || person === "wir" || person === "ihr" ? person : "er";
    out = beugeVerb(low2, p) ?? low2;
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

// src/generation/coherence.ts
init_text_utils();
init_nouns_data();
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
init_declension();
init_verben();
var SEIN_HABEN_WERDEN = /^(ist|sind|bin|bist|seid|war|waren|warst|hat|habe|hast|haben|habt|hatte|hatten|wird|werden|wirst|werdet|wurde|wurden|kann|kannst|können|könnt|konnte|muss|musst|müssen|müsst|will|willst|wollen|wollt|soll|sollen|darf|dürfen|mag|mögen|weiß|wissen|bleibt|bleiben|blieb|gibt|geben|gab)$/;
var KURZVERB = /^(löst|geht|ruft|tut|gibt|lebt|hebt|legt|sagt|sieht|hält|fällt|zieht|trägt|liegt|kommt|nimmt|läuft|steht|dreht|führt|hört|fühlt|zählt|setzt|passt|weint|lacht|denkt|kennt|nennt|misst|sinkt|steigt|klingt|singt|fehlt|blickt|wirkt|reißt|bricht|spricht|wächst)$/;
var PRAET_FORM = /(?:^|^[a-zäöüß]{2,6})(lag|lagen|stand|standen|ging|gingen|kam|kamen|sah|sahen|nahm|nahmen|hielt|hielten|ließ|ließen|fand|fanden|zog|zogen|trug|trugen|fiel|fielen|rief|riefen|sprach|schrieb|floss|stieg|sank|klang|hing|schien|trieb|brach|schloss|verlor|begann|geschah|roch|rochen|sass|saßen|riss|rissen|sprang|sprangen|schlug|schlugen|traf|trafen|griff|griffen|lief|liefen|wusste|wussten|verschwand|verschwanden|blieb|blieben|hieß|hießen|wuchs|wuchsen|schob|schoben|bog|bogen|schwieg|schwiegen)$/;
var EN_KEIN_VERB = /* @__PURE__ */ new Set([
  "gegen",
  "neben",
  "wegen",
  "zwischen",
  "entgegen",
  "oben",
  "unten",
  "eben",
  "dr\xFCben",
  "drau\xDFen",
  "drinnen",
  "morgen",
  "selten",
  "ansonsten",
  "meisten",
  "wenigsten",
  "offen",
  "eigen",
  "golden",
  "seiden",
  "wollen",
  "einen",
  "keinen",
  "meinen",
  "seinen",
  "ihren",
  "deinen",
  "unseren",
  "euren",
  "deren",
  "dessen",
  "allen",
  "vielen",
  "manchen",
  "welchen",
  "jeden",
  "diesen",
  "jenen",
  "denen",
  "ihnen",
  "sieben",
  "tausenden",
  "hunderten",
  "anderen",
  "einigen",
  "wenigen",
  "beiden",
  "solchen",
  "eigenen",
  "ersten",
  "zweiten",
  "dritten",
  "letzten",
  "n\xE4chsten",
  "besten",
  "ganzen",
  "halben",
  "fernen",
  "nahen",
  "hohen",
  "tiefen",
  "langen",
  "kurzen",
  "alten",
  "neuen",
  "jungen",
  "kleinen",
  "gro\xDFen",
  "roten",
  "gr\xFCnen",
  "blauen",
  "schwarzen",
  "wei\xDFen",
  "kalten",
  "warmen",
  "leeren",
  "vollen",
  "toten",
  "fremden",
  "stillen",
  "dunklen",
  "hellen",
  "innen",
  "au\xDFen",
  "hinten",
  "vorn",
  "mitten",
  "unterdessen",
  "indessen",
  "\xFCbrigen",
  "wegen",
  "trotzdem",
  "zusammen",
  "gegen\xFCber",
  "dr\xFCben"
]);
var DET_ODER_PREP = /* @__PURE__ */ new Set([
  "der",
  "die",
  "das",
  "des",
  "dem",
  "den",
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
  "meinem",
  "meiner",
  "dein",
  "deine",
  "deinen",
  "sein",
  "seine",
  "seinen",
  "seinem",
  "seiner",
  "ihr",
  "ihre",
  "ihren",
  "ihrem",
  "ihrer",
  "unser",
  "unsere",
  "unseren",
  "im",
  "am",
  "vom",
  "zum",
  "zur",
  "beim",
  "ins",
  "ans",
  "mit",
  "von",
  "zu",
  "aus",
  "bei",
  "nach",
  "seit",
  "auf",
  "an",
  "in",
  "\xFCber",
  "unter",
  "vor",
  "hinter",
  "neben",
  "zwischen",
  "durch",
  "f\xFCr",
  "ohne",
  "um",
  "gegen",
  "wegen",
  "trotz",
  "w\xE4hrend",
  "dieser",
  "diese",
  "diesen",
  "diesem",
  "dieses",
  "jeder",
  "jede",
  "jeden",
  "jedem",
  "jedes",
  "welcher",
  "welche",
  "welchen",
  "welchem",
  "manche",
  "manchen",
  "solche",
  "solchen",
  "viele",
  "vielen",
  "wenige",
  "wenigen",
  "einige",
  "einigen",
  "beide",
  "beiden",
  "zwei",
  "drei",
  "vier",
  "f\xFCnf",
  "sechs",
  "sieben",
  "acht",
  "neun",
  "zehn",
  "ganz",
  "sehr",
  "zu",
  "so",
  "wie",
  "als",
  "etwas",
  "nichts"
]);
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
  for (let i = 0; i < ws.length; i++) {
    const w = ws[i];
    if (/^[A-ZÄÖÜ]/.test(w)) continue;
    const l = w.toLowerCase();
    const prev = (ws[i - 1] || "").toLowerCase(), next = ws[i + 1] || "";
    const attributiv = DET_ODER_PREP.has(prev) || /^[A-ZÄÖÜ]/.test(next);
    if ((prev === "ich" || next.toLowerCase() === "ich") && /^[a-zäöüß]{3,}e$/.test(l) && !DET_ODER_PREP.has(l)) return true;
    if (VERB_CONJ[l]) return true;
    if (SEIN_HABEN_WERDEN.test(l)) return true;
    if (PRAET_FORM.test(l)) return true;
    if (KURZVERB.test(l)) return true;
    if (/t$/.test(l) && !attributiv && istVerbform(l)) return true;
    if (/en$/.test(l) && l.length >= 5 && !EN_KEIN_VERB.has(l) && !attributiv && (VERB_CONJ[l.slice(0, -2) + "t"] || VERB_CONJ[l.slice(0, -2) + "et"] || istVerbform(l.slice(0, -2) + "t"))) return true;
    if (/^(?!ge)[a-zäöüß]{4,}(?:t|te|en|ten)$/.test(l) && !NOMEN_ENDUNG.test(l) && !KEIN_VERB.has(l) && !EN_KEIN_VERB.has(l)) return true;
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
function saveKnobs(k) {
  try {
    localStorage.setItem(KEY, JSON.stringify(k));
  } catch {
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
var SCHLAG_PHASE = {
  einstieg: "exposition",
  hook: "exposition",
  regel: "exposition",
  mitte: "verdichtung",
  mitte2: "verdichtung",
  konflikt: "verdichtung",
  zeit: "verdichtung",
  einsatz: "verdichtung",
  ausloeser: "umschlag",
  wende: "umschlag",
  hoehepunkt: "umschlag",
  schluss: "schluss"
};
function phasenAusSchlagfolge(folge) {
  const roh = (folge || []).map((n) => SCHLAG_PHASE[n]).filter((p) => !!p);
  if (!roh.length) return STRUKTUR_PHASEN["linear"];
  return Array.from({ length: 10 }, (_, i) => roh[Math.round(i * (roh.length - 1) / 9)]);
}
function setBogenPhasen(folge) {
  STRUKTUR_PHASEN["bogen"] = phasenAusSchlagfolge(folge);
}
var bogenModus = false;
function setBogenModus(an) {
  bogenModus = an;
}
function gelenkBonus(a, phase, bogenGewicht) {
  if (!bogenModus || a.quelle !== "dramaturgie" || !phase) return 0;
  const faktor = phase === "umschlag" || phase === "schluss" ? 2.5 : phase === "exposition" ? 1.2 : 0.4;
  return faktor * bogenGewicht;
}
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
    s += gelenkBonus(a, phase, bogenGewicht);
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

// src/generation/dramaturgie.ts
var DKEY = "dm_dramaturgie_v1";
function setDramaData(d) {
  try {
    if (d) localStorage.setItem(DKEY, JSON.stringify(d));
    else localStorage.removeItem(DKEY);
  } catch {
  }
}
var bogenOverride = null;
function setBogenOverride(d) {
  bogenOverride = d;
}
function loadDramaData() {
  if (bogenOverride) return bogenOverride;
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
var SCHLAG_STANDARD = ["einstieg", "hook", "regel", "mitte", "mitte2", "konflikt", "ausloeser", "wende", "zeit", "hoehepunkt", "einsatz", "schluss"];
var SCHLAG_NAMEN = /* @__PURE__ */ new Set([...SCHLAG_STANDARD]);
function buildDramaturgie(kit) {
  const d = loadDramaData();
  const M = kit.mode;
  const norm = (x) => clean(x).toLowerCase().replace(/[.!?…]+$/, "");
  const benutzt = /* @__PURE__ */ new Set();
  const zieh = (liste) => {
    const frisch = liste.filter((x) => !benutzt.has(norm(x)));
    if (!frisch.length) return "";
    const wahl = pick(frisch);
    benutzt.add(norm(wahl));
    return wahl;
  };
  const ZEITKOPF = /^(davor|danach|dann|plötzlich|auf einmal|am ende|am anfang|zurück bleibt|und dann|zuerst|zuletzt|schließlich)\b/i;
  const ziehOhneZeitkopf = (liste) => {
    const ohne = liste.filter((x) => !ZEITKOPF.test(x) && !benutzt.has(norm(x)));
    if (ohne.length) {
      const wahl = pick(ohne);
      benutzt.add(norm(wahl));
      return { satz: wahl, nackt: false };
    }
    return { satz: zieh(liste), nackt: true };
  };
  const schlag = (name, erster) => {
    switch (name) {
      case "einstieg": {
        if (!(d && some(d.einstieg))) return erster ? `${cap(kit.T)} ${kit.W} bemerkt ${kit.P} ${kit.hookAcc}.` : "";
        if (!erster) {
          const z2 = zieh(d.einstieg);
          return z2 ? `${cap(z2)}.` : "";
        }
        const z = zieh(d.einstieg) || pick(d.einstieg);
        if (/^(nachdem|als|während|bevor|sobald|seit|seitdem|kaum|wenn|ehe)\b/i.test(clean(kit.T)))
          return `${cap(kit.T)} ${kit.W} \u2014 ${z.charAt(0).toLowerCase()}${z.slice(1).replace(/[.!?…]+$/, "")}.`;
        return `${cap(kit.T)} ${kit.W}. ${cap(z)}.`;
      }
      case "hook":
        return cap(ensurePunct(kit.hook));
      case "regel": {
        const z = d && some(d.regeln) && chance(0.7) ? zieh(d.regeln) : "";
        return z ? cap(ensurePunct(z)) : ensurePunct(pick(M.rules));
      }
      case "mitte": {
        const z = d && some(d.mitte) ? zieh(d.mitte) : "";
        return z ? `${cap(z)}.` : "";
      }
      case "mitte2": {
        const z = d && some(d.mitte) && d.mitte.length > 1 && chance(0.6) ? zieh(d.mitte) : "";
        return z ? `${cap(z)}.` : "";
      }
      case "konflikt": {
        const konf = d && some(d.konflikte) ? zieh(d.konflikte) : "";
        return konf ? `Es geht um ${konf}.` : `${kit.P} ${kit.AleadVerb || (kit.AisInfinitiveLed ? "will" : "sucht")} ${kit.Apure}, aber ${kit.obstacle}.`;
      }
      case "ausloeser": {
        if (!(d && some(d.ausloeser))) return "";
        const { satz: satz2, nackt: nackt2 } = ziehOhneZeitkopf(d.ausloeser);
        if (!satz2) return "";
        return nackt2 ? cap(ensurePunct(satz2)) : `Dann, unvermittelt: ${cap(satz2)}.`;
      }
      case "wende": {
        const kern = (d && some(d.veraenderungen) ? zieh(d.veraenderungen) : "") || (benutzt.has(norm(kit.turn)) ? "" : kit.turn);
        if (!kern) return "";
        benutzt.add(norm(kern));
        return frameTurn(kern);
      }
      case "zeit": {
        const z = d && some(d.zeitanomalien) && chance(0.4) ? zieh(d.zeitanomalien) : "";
        return z ? cap(ensurePunct(z)) : "";
      }
      case "hoehepunkt":
        if (!(d && some(d.hoehepunkt))) return "";
        if (erster) {
          const z = zieh(d.hoehepunkt);
          return z ? `${cap(z)}.` : "";
        }
        const { satz, nackt } = ziehOhneZeitkopf(d.hoehepunkt);
        if (!satz) return "";
        return nackt ? cap(ensurePunct(satz)) : `Und dann: ${cap(satz)}.`;
      case "einsatz":
        return reframeStake(kit.stake);
      case "schluss":
        return ensurePunct(kit.ending);
      default:
        return "";
    }
  };
  const folge = d?.folge && d.folge.length && d.folge.every((n) => SCHLAG_NAMEN.has(n)) ? d.folge : SCHLAG_STANDARD;
  const beats = [];
  for (const name of folge) {
    const b = schlag(name, beats.length === 0);
    if (b) beats.push(b);
  }
  return joinBeats(beats, kit.P);
}

// src/features/textpreset.ts
init_text_utils();
var KATEGORIEN = ["motifs", "hooks", "props", "turns", "obstacles", "stakes", "endings"];
var WIDERSTAND = /\b(aber|doch|kein|keine|keinen|nicht|niemand|nichts|nie|niemals|fehlt|fehlen|scheitert|verweigert|bleibt aus|reicht nicht|zu spät|vergebens|umsonst)\b/i;
var WENDE = /^(dann|plötzlich|auf einmal|mit einem mal|seitdem|von da an)\b|\b(kippt|kippen|beginnt|beginnen|bricht|brechen|verwandelt|wendet|ändert|dreht sich|wird zu|wechselt)\b/i;
var SPIEL = /\b(es geht um|auf dem spiel|einsatz|entscheidet|entscheiden|zählt|zählen|gehört|gilt|bedeutet|kostet|verliert|gewinnt)\b/i;
function teilstuecke(text) {
  return (text || "").replace(/\s+/g, " ").split(/(?<=[.!?…])\s+/).flatMap((s) => s.split(/\s*[;—–]\s*/)).map((s) => clean(s).replace(/^[„"«»]+|[.!?…„"«»]+$/g, "").trim()).filter((s) => {
    const w = s.split(/\s+/).filter(Boolean).length;
    return w >= 3 && w <= 22;
  });
}
function kategorieFuer(stueck, istSchluss) {
  const typ = deriveAtom(stueck).typ;
  const wc = stueck.split(/\s+/).filter(Boolean).length;
  if (typ === "nominalphrase") return wc <= 5 ? "props" : "motifs";
  if (typ !== "hauptsatz") return "motifs";
  if (istSchluss) return "endings";
  if (WIDERSTAND.test(stueck)) return "obstacles";
  if (WENDE.test(stueck)) return "turns";
  if (SPIEL.test(stueck)) return "stakes";
  return wc <= 14 ? "hooks" : "motifs";
}
function presetAusText(text) {
  const stuecke = teilstuecke(text);
  const bank2 = { motifs: [], hooks: [], props: [], turns: [], obstacles: [], stakes: [], endings: [] };
  const schlussGrenze = Math.max(0, stuecke.length - 2);
  const gesehen = /* @__PURE__ */ new Set();
  stuecke.forEach((s, i) => {
    const key = s.toLowerCase();
    if (gesehen.has(key)) return;
    gesehen.add(key);
    bank2[kategorieFuer(s, i >= schlussGrenze && deriveAtom(s).typ === "hauptsatz")].push(s);
  });
  for (const k of KATEGORIEN) {
    if (bank2[k].length) continue;
    const vollste = KATEGORIEN.filter((x) => bank2[x].length > 1).sort((a, b) => bank2[b].length - bank2[a].length)[0];
    if (vollste) bank2[k].push(bank2[vollste].pop());
  }
  const woerter3 = (text || "").split(/\s+/).filter(Boolean).length;
  return { bank: bank2, woerter: woerter3, stuecke: gesehen.size };
}
function preset2AusText(text) {
  const p = presetAusText(text);
  const b = p.bank;
  const konflikte = [...b.stakes, ...b.hooks].map((s) => (s.match(/\bes geht um\s+(.{3,60})$/i) || [])[1]).filter((x) => !!x);
  const drama = {
    einstieg: b.hooks.slice(0, 3),
    mitte: b.motifs.slice(0, 4),
    hoehepunkt: b.turns.slice(0, 2),
    schluss: b.endings.slice(0, 3),
    ausloeser: b.props.slice(0, 5),
    veraenderungen: b.turns.slice(0, 4),
    konflikte: konflikte.slice(0, 5),
    zeitanomalien: [],
    regeln: []
  };
  const pools = [.../* @__PURE__ */ new Set([...b.props, ...b.motifs])];
  return { ...p, drama, pools };
}
var VORLAGE_EVOLUTION = `Das Leben probiert alles einmal aus. Ein Kiefer aus fr\xFCheren Zeiten. Die Flosse erinnert sich an den Weg zum Ufer. Ein Auge, das in vier Linien zugleich erfunden wird. Der lange Hals entscheidet \xFCber den Hunger. Eine Feder, die zuerst w\xE4rmt und dann tr\xE4gt. Das Wasser entl\xE4sst seine Kinder an Land. Ein Panzer mit Jahresringen. Die Zuf\xE4lle sammeln sich, bis sie wie ein Plan aussehen. Aber kein Bauplan liegt dem Ganzen bei. Die Kiemen schlie\xDFen sich, und die Lunge \xFCbernimmt. Ein Fossil im Kalk. Kein Merkmal wei\xDF, wof\xFCr es sp\xE4ter gut sein wird. Die Insel formt ihre eigenen Schn\xE4bel. Es geht um den n\xE4chsten Morgen, nicht um den fernen Plan. Pl\xF6tzlich kippt das Klima, und die Gr\xF6\xDFten verschwinden zuerst. Dann beginnt das Kleine, die leeren R\xE4ume zu besetzen. Ein angespitzter Zahn als Werkzeug. Die Landschaft schreibt an den K\xF6rpern mit. Der Wald weicht der Savanne, und der Gang richtet sich auf. Eine Hand mit einem Daumen, der den Fingern begegnet. Das Erbgut vergisst nichts und verr\xE4t nichts. Aber die L\xFCcke zwischen den Funden bleibt. Die H\xE4utung dauert eine Nacht und ein Erdzeitalter. Ein Bernstein mit M\xFCcke. Es geht um das Weiterreichen selbst. Die Arten wandern, wenn der Boden es verlangt. Ein Geweih, das zu schwer f\xFCr seinen Tr\xE4ger wird. Die Anpassung kennt keine Richtung, nur den n\xE4chsten Schritt. Pl\xF6tzlich steht ein Tier am Feuer und gibt ihm einen Namen. Dann wendet sich die Auslese nach innen. Die Schrift \xFCbernimmt, was die Knochen begonnen haben. Am Ende sitzt das Ergebnis am Mikroskop und sucht seinen Anfang. Zur\xFCck bleibt ein Abdruck im Schlamm, \xE4lter als jede Frage.`;

// src/features/erzaehlerbank.ts
var SCHLAGFOLGEN = {
  standard: { name: "Steigender Bogen", folge: SCHLAG_STANDARD },
  kreis: { name: "Kreisschluss", folge: ["einstieg", "hook", "regel", "mitte", "konflikt", "ausloeser", "wende", "hoehepunkt", "einsatz", "schluss", "einstieg"] },
  rueckwaerts: { name: "R\xFCckw\xE4rts", folge: ["schluss", "hoehepunkt", "wende", "ausloeser", "konflikt", "mitte", "regel", "hook", "einstieg"] },
  retardation: { name: "Sp\xE4te Wende", folge: ["einstieg", "hook", "regel", "mitte", "konflikt", "mitte2", "regel", "ausloeser", "wende", "hoehepunkt", "einsatz", "schluss"] },
  doppelt: { name: "Doppelte Wende", folge: ["einstieg", "hook", "mitte", "ausloeser", "wende", "konflikt", "ausloeser", "wende", "hoehepunkt", "einsatz", "schluss"] },
  still: { name: "Stiller Bogen", folge: ["einstieg", "hook", "regel", "mitte", "konflikt", "mitte2", "zeit", "einsatz", "schluss"] },
  eskalation: { name: "Eskalation", folge: ["einstieg", "hook", "mitte", "mitte", "mitte", "konflikt", "ausloeser", "wende", "hoehepunkt", "einsatz", "schluss"] },
  katastrophe: { name: "Katastrophe zuerst", folge: ["hoehepunkt", "einstieg", "hook", "mitte", "konflikt", "ausloeser", "wende", "einsatz", "schluss"] },
  straenge: { name: "Zwei Str\xE4nge", folge: ["einstieg", "mitte", "einstieg", "mitte", "konflikt", "ausloeser", "wende", "hoehepunkt", "einsatz", "schluss"] },
  offen: { name: "Offenes Ende", folge: ["einstieg", "hook", "regel", "mitte", "konflikt", "ausloeser", "wende", "hoehepunkt", "einsatz"] }
};
var ERZAEHLER_PLAETZE = 10;
var BANK_KEY = "dm_erzaehlerbank_v1";
var QUELLE_KEY = "dm_erzaehler_quelle_v1";
function ladeErzaehlerbank() {
  let roh = [];
  try {
    roh = JSON.parse(localStorage.getItem(BANK_KEY) || "[]");
  } catch {
    roh = [];
  }
  const list = Array.isArray(roh) ? roh : [];
  return Array.from({ length: ERZAEHLER_PLAETZE }, (_, i) => {
    const e = list[i];
    const f = String(e?.folge || "");
    return { titel: String(e?.titel || "").slice(0, 60), text: String(e?.text || ""), folge: SCHLAGFOLGEN[f] ? f : void 0 };
  });
}
function speichereErzaehlerbank(list) {
  try {
    localStorage.setItem(BANK_KEY, JSON.stringify(list.slice(0, ERZAEHLER_PLAETZE)));
  } catch {
  }
}
function ladeQuelle() {
  const q = localStorage.getItem(QUELLE_KEY) || "preset";
  return q === "preset" || q === "wuerfeln" || /^[0-9]$/.test(q) ? q : "preset";
}
function setzeQuelle(q) {
  try {
    localStorage.setItem(QUELLE_KEY, q);
  } catch {
  }
}
function platzBrauchbar(e) {
  return (e.text || "").split(/\s+/).filter(Boolean).length >= 40;
}
function erzaehlerBogen(index) {
  const e = ladeErzaehlerbank()[index];
  if (!e || !platzBrauchbar(e)) return null;
  const drama = preset2AusText(e.text).drama;
  if (e.folge && SCHLAGFOLGEN[e.folge]) drama.folge = SCHLAGFOLGEN[e.folge].folge;
  return drama;
}
var letzterPlatz = -1;
function letzterGezogenerPlatz() {
  return letzterPlatz;
}
function bogenFuerErzeugung() {
  const q = ladeQuelle();
  letzterPlatz = -1;
  if (q === "preset") return null;
  if (/^[0-9]$/.test(q)) {
    const i2 = parseInt(q, 10);
    const d = erzaehlerBogen(i2);
    if (d) letzterPlatz = i2;
    return d;
  }
  const brauchbar = ladeErzaehlerbank().map((e, i2) => ({ e, i: i2 })).filter((x) => platzBrauchbar(x.e));
  if (!brauchbar.length) return null;
  const i = brauchbar[Math.floor(Math.random() * brauchbar.length)].i;
  letzterPlatz = i;
  return erzaehlerBogen(i);
}
function bogenBeschriftung() {
  const q = ladeQuelle();
  if (letzterPlatz >= 0) {
    const e = ladeErzaehlerbank()[letzterPlatz];
    if (e) return { bogen: `${q === "wuerfeln" ? "gew\xFCrfelt: " : ""}Platz ${letzterPlatz + 1} \xB7 ${e.titel || "Ohne Titel"}`, bauform: SCHLAGFOLGEN[e.folge || "standard"]?.name || e.folge || "" };
  }
  if (q === "preset") return { bogen: "aus Preset", bauform: "Steigender Bogen" };
  return { bogen: q === "wuerfeln" ? "w\xFCrfeln \u2014 kein brauchbarer Platz" : "gew\xE4hlter Platz ist leer", bauform: "" };
}
var BAUFORM_ANWEISUNG = {
  standard: "ein klassisch steigender Bogen: ruhiger Anfang, wachsende St\xF6rung, Krise kurz vor Schluss, knappe Aufl\xF6sung",
  kreis: "ein Kreisschluss: das Ende kehrt erkennbar zum Bild des Anfangs zur\xFCck, leicht verschoben",
  rueckwaerts: "r\xFCckw\xE4rts erz\xE4hlt: beginne mit dem Ende, arbeite dich in Etappen (mehrmals \u201EDavor\u201C) zum Anfang vor, der Anfang erkl\xE4rt alles",
  retardation: "mit sp\xE4ter Wende: lange scheinbare Entwarnung, die St\xF6rung kehrt leise zur\xFCck, die Wende kommt sp\xE4t und schnell",
  doppelt: "mit doppelter Wende: eine erste Wende kippt die Lage, eine zweite kippt sie erneut in eine unerwartete Richtung",
  still: "ein stiller Bogen: \xE4u\xDFerlich geschieht fast nichts, die Ver\xE4nderung ist innerlich; keine Ausrufe, keine Katastrophe",
  eskalation: "eine Eskalation in drei Stufen: dreimal dasselbe Muster, jedes Mal gr\xF6\xDFer, dann die Folge",
  katastrophe: "Katastrophe zuerst: das schlimme Ereignis steht im ersten Satz, danach die Aufarbeitung und ein leiser Fund",
  straenge: "zwei Str\xE4nge: zwei Figuren getrennt erz\xE4hlt, abwechselnd, die sich am Ende an einem Ort treffen",
  offen: "offenes Ende: die Spannung baut sich auf, die Aufl\xF6sung wird verweigert; der letzte Satz l\xE4sst es in der Schwebe"
};
function bauePromptErzaehlung(folgeId, thema) {
  const bau = BAUFORM_ANWEISUNG[folgeId] || BAUFORM_ANWEISUNG["standard"];
  const t = (thema || "").trim();
  return [
    "Schreibe eine sehr kurze deutsche Erz\xE4hlung, 120 bis 170 W\xF6rter, Pr\xE4sens, konkrete Bilder, keine Anf\xFChrungszeichen, keine Aufz\xE4hlungen.",
    `Bauform: ${bau}.`,
    t ? `Thema oder Ausgangspunkt: ${t}.` : "Thema frei w\xE4hlen \u2014 alltagsnah, mit einem leisen Riss.",
    "Kurze Haupts\xE4tze bevorzugen; ein bis zwei reine Bilds\xE4tze ohne Verb sind erw\xFCnscht (sie werden als Bilder und Requisiten gelesen); mindestens ein Satz mit \u201EEs geht um ...\u201C.",
    'Antworte NUR mit JSON, ohne Erkl\xE4rung: {"titel": "...", "text": "..."} \u2014 der Titel h\xF6chstens vier W\xF6rter.'
  ].join("\n");
}
var ARCHIV_KEY = "dm_erzaehler_archiv_v1";
var ARCHIV_JE_BAUFORM = 20;
function ladeArchiv() {
  try {
    const r = JSON.parse(localStorage.getItem(ARCHIV_KEY) || "{}");
    if (!r || typeof r !== "object" || Array.isArray(r)) return {};
    const out = {};
    for (const [k, v] of Object.entries(r))
      if (Array.isArray(v)) out[k] = v.filter((e) => !!e && typeof e === "object" && typeof e.text === "string").map((e) => ({ titel: String(e.titel || "").slice(0, 60), text: String(e.text), folge: k, geburt: typeof e.geburt === "string" ? e.geburt : void 0 }));
    return out;
  } catch {
    return {};
  }
}
function speichereArchiv(a) {
  try {
    localStorage.setItem(ARCHIV_KEY, JSON.stringify(a));
  } catch {
  }
}
var archivNorm = (e) => `${e.titel}\u241E${e.text}`.toLowerCase().replace(/\s+/g, " ").trim();
var titelNorm = (t) => (t || "").toLowerCase().replace(/\s+/g, " ").trim();
function archiviere(e) {
  if (!platzBrauchbar(e)) return;
  const folge = e.folge || "standard";
  const a = ladeArchiv();
  const liste = a[folge] || [];
  const tKey = titelNorm(e.titel);
  const gleich = (x) => tKey ? titelNorm(x.titel) === tKey : archivNorm(x) === archivNorm(e);
  const vorhanden = liste.find(gleich);
  let geburt = e.geburt || vorhanden?.geburt;
  if (!geburt) for (const [, l] of Object.entries(a)) {
    const alt = l.find(gleich);
    if (alt) {
      geburt = alt.geburt || alt.folge;
      break;
    }
  }
  geburt = geburt || folge;
  a[folge] = [{ titel: e.titel || "Ohne Titel", text: e.text, folge, geburt }, ...liste.filter((x) => !gleich(x))].slice(0, ARCHIV_JE_BAUFORM);
  speichereArchiv(a);
}
function archivFuer(folge) {
  return ladeArchiv()[folge] || [];
}
function loescheAusArchiv(folge, index) {
  const a = ladeArchiv();
  const liste = a[folge] || [];
  if (index < 0 || index >= liste.length) return;
  a[folge] = liste.filter((_, i) => i !== index);
  speichereArchiv(a);
}

// test/erzaehler.ts
init_constants();

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

// src/generation/buildStory.ts
init_text_utils();

// src/generation/ctxnorm.ts
init_declension();
init_nouns_data();
init_nouns2_data();
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
var LAND_GATTUNG = /* @__PURE__ */ new Set([
  "ausland",
  "inland",
  "umland",
  "hinterland",
  "festland",
  "neuland",
  "brachland",
  "flachland",
  "hochland",
  "weideland",
  "ackerland",
  "vaterland",
  "heimatland",
  "niemandsland",
  "grenzland",
  "marschland",
  "\xF6dland",
  "bauland",
  "bergland",
  "tiefland",
  "binnenland",
  "vorland",
  "kernland",
  "mutterland",
  "traumland",
  "schlaraffenland"
]);
var ORTSNAME_ENDUNG = /(grad|burg|furt|ingen|hausen|heim|kirchen|brück|wick|ford|ton|ville|polis|stan|land|ien)$/;
var AN_ENDUNG = /(ufer|meer|see|strand|küste|fluss|bach)$/i;
function normWhere(s) {
  const t = (s || "").trim();
  if (!t || PREPS.test(t)) return t;
  const komma = t.indexOf(",");
  if (komma > 0) {
    const kopf = normWhere(t.slice(0, komma));
    return kopf + t.slice(komma);
  }
  const zusatz = t.match(/^(.+?)\s+((?:in|im|an|am|auf|bei|vor|hinter|neben|unter|über|zwischen|nahe|gegenüber|ohne|mit|voller|aus)\s+.+)$/);
  if (zusatz && !/\s/.test(zusatz[1].replace(/^(der|die|das|ein|eine)\s+/i, ""))) {
    const kopf = normWhere(zusatz[1]);
    if (kopf !== zusatz[1]) return `${kopf} ${zusatz[2]}`;
  }
  const np = parseNP(t);
  if (!np) return t;
  const nurWort = !np.art && !np.adj && /^[A-ZÄÖÜ][a-zäöüß-]+$/.test(t);
  const inTabelle = !!(NOUN_GENDER[t.toLowerCase()] || NOUN_GENDER_2[t.toLowerCase()]);
  if (nurWort && !inTabelle && ORTSNAME_ENDUNG.test(t) && !LAND_GATTUNG.has(t.toLowerCase())) return `in ${t}`;
  const g = genderOf(np.art, np.noun);
  if (!g) return !np.art && !np.adj && /^[A-ZÄÖÜ][a-zäöüß-]+$/.test(t) ? `in ${t}` : t;
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
init_text_utils();
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

// src/generation/postprocess.ts
init_text_utils();
init_verben();
init_text_utils();

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
    let gesetzt = 0, vorherGesetzt = false;
    return text.split(/\n\n+/).map((para) => {
      const sents = para.split(/(?<=[.!?…])\s+/);
      return sents.map((sen) => {
        const wc = sen.split(/\s+/).filter(Boolean).length;
        if (gesetzt < 3 && !vorherGesetzt && wc >= 5 && wc <= 18 && /[.]$/.test(sen) && !/[()"„:—–]/.test(sen) && Math.random() < 0.3) {
          const tag = tags[ti % tags.length];
          ti++;
          gesetzt++;
          vorherGesetzt = true;
          return sen.replace(/\.$/, " " + tag);
        }
        vorherGesetzt = false;
        return sen;
      }).join(" ");
    }).join("\n\n");
  }
  return text;
}

// src/generation/polish.ts
init_nouns_data();
init_text_utils();
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
    const wieder = namensErsetzer(who.trim());
    try {
      t = t.replace(new RegExp(`(?<![\\p{L}\\p{N}_])${w}(?![\\p{L}\\p{N}_])`, "giu"), wieder);
    } catch {
      t = t.replace(new RegExp(`\\b${w}\\b`, "gi"), wieder);
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
init_text_utils();
init_verben();
init_declension();
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
      const FORMEL = /^(dann\b|und dann\b|danach\b|später\b|plötzlich\b|auf einmal\b|es braucht nur\b|erst ein riss\b|kaum ausgesprochen\b|etwas gibt nach\b|ohne vorwarnung\b|dann, unvermittelt)/i;
      const start = Math.floor(s.length * 0.65);
      for (let k2 = 0; k2 < s.length; k2++) {
        const kand = s[(start + k2) % s.length];
        if (!FORMEL.test(kand.trim())) return t + "\n\n" + kand;
      }
      return t;
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
var NEBENSATZ_ANFANG = /^(der|die|das|dem|den|des|deren|dessen|welche[rsmn]?|wo|worin|woran|worauf|als|wenn|weil|obwohl|während|nachdem|bevor|damit|dass|ob|sodass|indem|sobald|solange|bis|seit|falls|wobei|wodurch|womit|was|wer|wen|wem|wie|ohne|um|statt|anstatt)\b/i;
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
  const p = person === "ich" || person === "du" || person === "wir" || person === "ihr" ? person : "er";
  return beugeVerb(v, p) ?? v;
}
var kenntVerb = (v) => !!VERB_CONJ[v.toLowerCase()] || istVerbform(v);
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

// src/generation/postprocess.ts
var LINE_FORMS = /* @__PURE__ */ new Set(["script", "video", "strang", "reim", "haiku", "poem"]);
var isLineForm = (input) => !!input && !!input.form && LINE_FORMS.has(input.form);
function glaetten(t) {
  return t.replace(/[ \t]{2,}/g, " ").replace(/[ \t]+\n/g, "\n").replace(/\n{3,}/g, "\n\n").replace(/[ \t]+([,.;:!?])/g, "$1").trim();
}
var ABGESCHNITTEN = /(^|\s)(eine|einem|einen|einer|eines|der|die|dem|den|des|und|oder|aber|wie|als|im|am|bei|für|ohne)$/i;
var NUR_OHNE_VERB = /(^|\s)(mit|an|auf|zu|vor|nach|aus|ist|sind|wird|ein|das)$/i;
var NEBENSATZ_ENDE = /,\s+(der|die|das|dem|den|deren|dessen)\s+([a-zäöüß][^,;:]*)$/;
var FUNKTION = /* @__PURE__ */ new Set([
  "es",
  "er",
  "sie",
  "ich",
  "du",
  "wir",
  "ihr",
  "man",
  "sich",
  "mich",
  "dich",
  "uns",
  "euch",
  "ihn",
  "ihm",
  "mir",
  "dir",
  "der",
  "die",
  "das",
  "dem",
  "den",
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
  "mein",
  "meine",
  "meinen",
  "meinem",
  "sein",
  "seine",
  "seinen",
  "seinem",
  "ihre",
  "ihren",
  "ihrem",
  "dein",
  "deine",
  "deinen",
  "deinem",
  "unser",
  "unsere",
  "in",
  "im",
  "an",
  "am",
  "auf",
  "aus",
  "bei",
  "mit",
  "nach",
  "von",
  "vom",
  "zu",
  "zum",
  "zur",
  "vor",
  "\xFCber",
  "unter",
  "hinter",
  "neben",
  "zwischen",
  "durch",
  "f\xFCr",
  "ohne",
  "um",
  "gegen",
  "seit",
  "bis",
  "und",
  "oder",
  "aber",
  "noch",
  "schon",
  "mehr",
  "auch",
  "nur",
  "so",
  "da",
  "hier",
  "dort",
  "wo",
  "wie",
  "als",
  "wenn",
  "dann",
  "immer",
  "nie",
  "wieder",
  "heute",
  "gestern",
  "morgen",
  "zu",
  "sehr",
  "ganz",
  "etwas",
  "nichts",
  "alles",
  "viel",
  "wenig",
  "zwei",
  "drei",
  "vier",
  "f\xFCnf",
  "einmal",
  "zweimal",
  "l\xE4ngst",
  "gerade",
  "eben",
  "erst",
  "kaum",
  "fast",
  "genau",
  "pl\xF6tzlich",
  "jemand",
  "niemand",
  "jeder",
  "jede",
  "jedes",
  "alle",
  "beide",
  "zusammen",
  "allein",
  "anders",
  "weiter",
  "zur\xFCck",
  "hinauf",
  "hinab",
  "hinaus",
  "hinein",
  "heraus",
  "herein",
  "oben",
  "unten",
  "innen",
  "au\xDFen",
  "links",
  "rechts",
  "vorn",
  "hinten",
  "drinnen",
  "drau\xDFen",
  "fort",
  "weg",
  "los"
]);
var verbMoeglich = (w) => /^[a-zäöüß]{2,}$/.test(w) && !FUNKTION.has(w) && !KEIN_VERB.has(w) && !/(em|er|es)$/.test(w);
function istAbgeschnitten(bare) {
  if (!bare || bare.split(/\s+/).length > 12) return false;
  if (ABGESCHNITTEN.test(bare)) return true;
  const ns = bare.match(NEBENSATZ_ENDE);
  if (ns) {
    const woerter3 = ns[2].split(/\s+/);
    if (woerter3.length <= 6 && !woerter3.some(verbMoeglich)) return true;
  }
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
    const wieder = namensErsetzer(n);
    try {
      t = t.replace(new RegExp("\\b(" + esc + ")(s|')?\\b", "giu"), (_m, kern, suf) => wieder(kern) + (suf || ""));
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
var NEBENSATZ = /(,\s+(?:wo|wohin|woher|wenn|als|weil|dass|obwohl|während|nachdem|bevor|sobald|solange|der|die|das|dem|den|deren|dessen)\s[^,.;:!?—–]{3,60}?[a-zäöüß])\s+(bemerk(?:t|e|st|en)|sieht|sehe|siehst|sehen|find(?:et|e|est|en)|entdeck(?:t|e|st|en)|erkenn(?:t|e|st|en)|trifft|treffe|triffst|treffen|hört|höre|hörst|hören|wartet|warte|wartest|warten|steht|stehe|stehst|stehen|beginnt|beginne|beginnst|beginnen|verliert|verliere|verlierst|verlieren)\s+(ich|du|wir|er|sie|es|man|[A-ZÄÖÜ][a-zäöüß]+)\b/g;
function kommaVorInversion(t) {
  return (t || "").replace(NEBENSATZ, "$1, $2 $3");
}
function istPluralFigur(who) {
  const w = (who || "").trim();
  if (!w) return false;
  if (/^(zwei|drei|vier|fünf|sechs|sieben|acht|neun|zehn|beide|alle|viele|einige|mehrere|manche|zwölf|hundert)\b/i.test(w)) return true;
  if (/\b(und|&)\b/.test(w) && !/,/.test(w)) return true;
  const m = w.match(/^die\s+([A-ZÄÖÜ][a-zäöüß-]+)$/i);
  if (m) {
    const n = m[1].toLowerCase();
    if (/(innen|leute|kinder|eltern|geschwister|männer|frauen)$/.test(n)) return true;
    return /en$/.test(n) && !/(chen|lein)$/.test(n);
  }
  return false;
}
function pluralKongruenz(t, who) {
  const name = (who || "").trim();
  if (!name || !istPluralFigur(name)) return t;
  const esc = escapeRegExp(name);
  const beuge = (v) => {
    const p = beugeVerb(v, "wir");
    return p && p !== v ? p : v;
  };
  let out = t.replace(new RegExp(`(\\b${esc})\\s+([a-z\xE4\xF6\xFC\xDF]+t)\\b`, "giu"), (m, n, v) => istVerbform(v) ? `${n} ${beuge(v)}` : m);
  out = out.replace(new RegExp(`\\b([a-z\xE4\xF6\xFC\xDF]+t)\\s+(${esc})\\b`, "giu"), (m, v, n) => istVerbform(v) ? `${beuge(v)} ${n}` : m);
  return out;
}
function kleinesPronomen(t) {
  return (t || "").replace(/([;—–][ \t]+)(Ich|Er|Es|Wir|Du|Man|Ihr|Angeblich|Natürlich|Vielleicht|Jedenfalls|Immerhin|Trotzdem|Allerdings|Jetzt|Dann|Hier|Dort|Aber|Und|Doch|Oder|Nur|Noch|Schon)\b/g, (_m, sp, w) => sp + w.toLowerCase()).replace(
    /(,[ \t]+)(Wo|Wenn|Als|Weil|Dass|Obwohl|Während|Nachdem|Bevor|Sobald|Solange|Damit|Ob|Der|Die|Das|Dem|Den|Deren|Dessen)\b(?=\s)/g,
    (_m, sp, w) => sp + w.charAt(0).toLowerCase() + w.slice(1)
  );
}
function fragezeichen(t) {
  return (t || "").replace(
    /(^|[.!?…:]\s+|\n)(Wo|Was|Wer|Wie|Warum|Wann|Wohin|Woher|Weshalb|Wieso|Wem|Wen)\s+(ist|sind|war|waren|hat|haben|wird|werden|kommt|bleibt|will|kann|soll|darf|muss|geht|steht|bist|bin|seid|weiß|wissen)\b([^.!?…\n]{0,50})\./g,
    (m, vor, fw, v, rest) => rest.split(/\s+/).filter(Boolean).length <= 6 && !rest.includes(",") ? `${vor}${fw} ${v}${rest}?` : m
  );
}
function postProcessText(txt, input) {
  let t = (txt ?? "").toString();
  t = t.replace(/(^|[.!?…]\s+)([a-zäöü])/g, (_m, p1, p2) => p1 + p2.toUpperCase());
  t = t.replace(/\b(und|oder|aber|denn|sondern|sowie|nur|auch|selbst|sogar|erst|schon|noch|doch|nun|dann)(\s+)(die|der|das|den|dem|des|ein|eine|einen|einem|einer|sie|er|es|man|wir|ich|du|ihr|ihre|sein|seine|dann|dabei|dadurch|vielleicht|plötzlich)\b/gi, (_m, c, sp, w) => c + sp + w.charAt(0).toLowerCase() + w.slice(1));
  t = kleinesPronomen(t);
  t = kommaVorInversion(t);
  t = fragezeichen(t);
  t = kleinerArtikel(t);
  const name = (input?.who ?? "").toString().trim();
  if (name) {
    const esc = escapeRegExp(name);
    const wieder = namensErsetzer(name);
    try {
      t = t.replace(new RegExp(`(?<![\\p{L}\\p{N}_])${esc}(?![\\p{L}\\p{N}_])`, "giu"), wieder);
    } catch {
      t = t.replace(new RegExp(`\\b${esc}\\b`, "gi"), wieder);
    }
  }
  t = pluralKongruenz(t, name);
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
init_text_utils();
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

// src/generation/buildStory.ts
init_declension();
init_verwandlung();

// src/corpus.ts
init_constants();
init_text_utils();
init_storage_status();

// src/generation/satzwaechter.ts
init_verben();
var FUNKTION2 = /* @__PURE__ */ new Set([
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
  "und",
  "oder",
  "aber",
  "doch",
  "denn",
  "sondern",
  "als",
  "wie",
  "dass",
  "ob",
  "weil",
  "wenn",
  "ohne",
  "mit",
  "von",
  "aus",
  "an",
  "auf",
  "in",
  "im",
  "am",
  "f\xFCr",
  "zu",
  "zum",
  "zur",
  "bei",
  "beim",
  "nach",
  "vor",
  "\xFCber",
  "unter",
  "neben",
  "zwischen",
  "hinter",
  "durch",
  "gegen",
  "um",
  "seit",
  "es",
  "sich",
  "man",
  "sie",
  "er",
  "wir",
  "ich",
  "du",
  "ihr",
  "was",
  "wer",
  "wo",
  "so",
  "nur",
  "auch",
  "noch",
  "schon",
  "sehr",
  "nicht",
  "kein",
  "keine",
  "jeder",
  "jede",
  "jedes",
  "alle"
]);
var HAENGENDES_ENDE = /* @__PURE__ */ new Set([
  "der",
  "den",
  "dem",
  "des",
  "und",
  "oder",
  "aber",
  "sondern",
  "als",
  "dass",
  "weil",
  "wenn",
  "f\xFCr",
  "zwischen",
  "seit"
  // NICHT in der Liste: alles, was im Deutschen legitim am Satzende steht —
  // trennbare Verbpartikel („geht auf", „holt ihn ein", „gibt nach"),
  // Infinitiv-zu („um wahr zu sein"), Vergleiche („schwer wie Blei"),
  // Pronomen und Zahlwörter („der Grat trägt nur einen", „statt einem",
  // „will es sehr"). Die Gegenprobe über 6930 eingebaute Sätze hat die
  // Liste auf diesen Kern gestutzt.
]);
var ADJEKTIV = /* @__PURE__ */ new Set([
  "fest",
  "echt",
  "leicht",
  "schlecht",
  "recht",
  "dicht",
  "glatt",
  "satt",
  "bunt",
  "kalt",
  "alt",
  "laut",
  "tot",
  "rot",
  "gut",
  "weit",
  "hart",
  "zart",
  "nett",
  "matt",
  "sp\xE4t",
  "bereit",
  "breit",
  "nackt",
  "exakt",
  "direkt",
  "perfekt",
  "korrekt",
  "konkret",
  "komplett",
  "ernst",
  "feist",
  "meist",
  "erst",
  "zun\xE4chst",
  "h\xF6chst",
  "\xE4u\xDFerst",
  "einst",
  "sonst",
  "fast",
  "blo\xDF"
]);
var HILFSVERB = /* @__PURE__ */ new Set([
  "bin",
  "bist",
  "sind",
  "seid",
  "war",
  "warst",
  "waren",
  "wart",
  "sei",
  "w\xE4re",
  "w\xE4ren",
  "hab",
  "habe",
  "hast",
  "haben",
  "habt",
  "hatte",
  "hatten",
  "h\xE4tte",
  "h\xE4tten",
  "werde",
  "wirst",
  "wird",
  "werden",
  "werdet",
  "wurde",
  "wurden",
  "w\xFCrde",
  "w\xFCrden",
  "kann",
  "kannst",
  "k\xF6nnen",
  "k\xF6nnt",
  "konnte",
  "konnten",
  "k\xF6nnte",
  "k\xF6nnten",
  "muss",
  "musst",
  "m\xFCssen",
  "m\xFCsst",
  "musste",
  "mussten",
  "m\xFCsste",
  "darf",
  "darfst",
  "d\xFCrfen",
  "d\xFCrft",
  "durfte",
  "durften",
  "d\xFCrfte",
  "soll",
  "sollst",
  "sollen",
  "sollt",
  "sollte",
  "sollten",
  "mag",
  "magst",
  "m\xF6gen",
  "m\xF6gt",
  "mochte",
  "m\xF6chte",
  "m\xF6chten",
  "will",
  "willst",
  "wollen",
  "wollt",
  "wollte",
  "wollten",
  "l\xE4sst",
  "lie\xDF",
  "lie\xDFen",
  "gibt",
  "gab",
  "gaben",
  "tut",
  "tat",
  "schw\xF6r",
  "schw\xF6re"
]);
var verbKandidat = (roh, istErstes = false) => {
  if (!istErstes && /^[A-ZÄÖÜ]/.test(roh)) return false;
  const w = roh.toLowerCase().replace(/[^a-zäöüß]/g, "");
  if (!w || FUNKTION2.has(w) || KEIN_VERB.has(w) || ADJEKTIV.has(w)) return false;
  if (HILFSVERB.has(w) || istVerbform(w)) return true;
  return /(t|st|e|en|eln|ern|elt|ert)$/.test(w) && !/(heit|keit|ung|schaft|tät|ment|iert)$/.test(w) && !/(em|er|es)$/.test(w) && w.length >= 3;
};
var woerter2 = (s) => s.split(/\s+/).map((w) => w.replace(/[„“"»«().!?…;:]+/g, "")).filter(Boolean);
var NP_KOPF = /^(der|die|das|ein|eine|einen|kein|keine|zwei|drei|viele|manche|jede[rs]?|irgendein|lauter)\b/i;
function satzPlausibel(satz) {
  const bare = satz.trim().replace(/[.!?…]+$/, "").trim();
  if (!bare) return false;
  const ws = woerter2(bare);
  if (!ws.length) return false;
  const letztes = ws[ws.length - 1].toLowerCase();
  if (HAENGENDES_ENDE.has(letztes)) return false;
  const hatVerb = ws.some((w, i) => verbKandidat(w, i === 0));
  if (!hatVerb) {
    if (ws.length > 12) return false;
    const kern = bare.replace(/^(und|aber|doch|dann|denn|oder|nur|auch)\s+/i, "");
    const kopf = kern.split(/\s+/)[0] || "";
    const ADVERB_KOPF = /^(irgendwo|irgendwann|irgendwie|dort|hier|heute|morgen|gestern|vielleicht|manchmal|so|bald|überall|nirgends|nirgendwo|draußen|drinnen|oben|unten|jetzt|damals|dennoch|trotzdem|deshalb|darum|davor|danach|zuerst|zuletzt|womöglich|angeblich|vermutlich|wahrscheinlich)$/i;
    const nomenKopf = /^[A-ZÄÖÜ]/.test(kopf) && !ADVERB_KOPF.test(kopf) && !FUNKTION2.has(kopf.toLowerCase());
    const prepKopf = /^(in|im|ins|über|überm|unter|unterm|auf|aufs|an|am|ans|bei|beim|hinter|vor|vorm|neben|zwischen|aus|von|vom|nach|zu|zum|zur|mit|durch|gegen|um|seit|während|trotz|wegen)$/i.test(kopf);
    if (ws.length > 5 && !NP_KOPF.test(kern) && !nomenKopf && !prepKopf) return false;
  }
  for (const teil of bare.split(/,\s*/).slice(1)) {
    const tw = woerter2(teil);
    if (!tw.length || !/^(was|wer|der|die|das|dem|den|wo|wie)$/i.test(tw[0])) continue;
    const undIdx = tw.findIndex((w, i) => i > 0 && /^(und|oder)$/i.test(w));
    if (undIdx > 1 && verbKandidat(tw[undIdx + 1] || "", false) && !tw.slice(1, undIdx).some((w) => verbKandidat(w, false))) return false;
  }
  const PREP_KOPF = /^(in|im|ins|über|überm|unter|unterm|auf|aufs|an|am|ans|bei|beim|hinter|vor|vorm|neben|zwischen|aus|von|vom|nach|zum|zur|mit|durch|gegen|seit|trotz|wegen)$/i;
  for (const teil of bare.split(/,\s*/)) {
    const tw = woerter2(teil);
    if (tw.length < 4 || !PREP_KOPF.test(tw[0])) continue;
    if (/^(dem|denen|deren|dessen|welche[rmn]?)$/i.test(tw[1] || "")) continue;
    if (tw.slice(1).some((w) => /^zu$/i.test(w))) continue;
    const vi = tw.findIndex((w, i) => i > 1 && verbKandidat(w, false));
    if (vi < 2) continue;
    if (tw.slice(1, vi).some((w) => /^(es|er|sie|wir|ich|du|man|jemand|niemand|etwas|nichts|alles)$/i.test(w))) continue;
    const rest = tw.slice(vi + 1);
    if (/^(wie|als)$/i.test(rest[0] || "") && rest.length <= 2) return false;
  }
  return true;
}
function stueckPlausibel(text) {
  const saetze = (text || "").split(/(?<=[.!?…])\s+/).map((s) => s.trim()).filter(Boolean);
  if (!saetze.length) return false;
  return saetze.every(satzPlausibel);
}

// src/features/livepools.ts
init_storage_status();

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
  if (!stueckPlausibel(s)) return false;
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

// src/generation/video.ts
init_text_utils();

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

// src/wordbank.ts
init_storage_status();
init_constants();
init_text_utils();
init_storage();
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
init_text_utils();
var count = (s) => (s || "").trim().split(/\s+/).filter(Boolean).length;
function enforceWordTarget(text, target, bank2, model, markovMode = "mix") {
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
    const cands = [...bank2.motifs || [], ...bank2.turns || [], ...bank2.hooks || []];
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

// src/atoms/rekombination.ts
init_nouns_data();

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
function buildPool(bank2, perspektive, what, figur, model, markovMode) {
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
      ["regeln", drama.regeln],
      // "schluss": Bei Preset-2.0-Boegen stehen dort Stilworte ("offen"), bei
      // Erzaehlerbank-Boegen ganze Schlusssaetze. Nur was ein Satz sein kann
      // (ab fuenf Woertern) kommt in den Pool — Stilworte bleiben draussen.
      ["schluss", (drama.schluss || []).filter((t) => (t || "").trim().split(/\s+/).length >= 5)]
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
  for (const [kat, arr] of Object.entries(bank2)) {
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
function buildRekombination(bank2, input, model) {
  const pool = buildPool(
    bank2,
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
  const mitBogen = input.structure === "bogen";
  setBogenModus(mitBogen);
  if (mitBogen) setBogenPhasen(loadDramaData()?.folge);
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
      const beginntMitEingefuehrter = f.fuehrt_ein.some((n) => !!w1 && n.toLowerCase().startsWith(w1.toLowerCase()));
      if (!beginntMitEingefuehrter && !istNomen && !istFigur && /^[A-ZÄÖÜ][a-zäöüß]/.test(fill)) fill = fill.charAt(0).toLowerCase() + fill.slice(1);
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
function buildVersAtome(bank2, input, model) {
  const figur = (personKopf(splitSpeakers(normWho(input.who || ""))[0] || "") || "Jemand").trim();
  const pool = buildPool(bank2, input.perspective, input.what, figur, model, input.markovMode);
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
init_text_utils();

// src/features/faktenblatt.ts
init_text_utils();
init_declension();

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
  const woerter3 = (was || "").split(/\s+/);
  for (let i = 0; i < woerter3.length; i++) {
    const w = (woerter3[i] || "").replace(/[^A-Za-zÄÖÜäöüß-]/g, "");
    if (!/^[A-ZÄÖÜ][a-zäöüß]{3,}$/.test(w)) continue;
    if (KEIN_SACHNOMEN.test(w)) continue;
    if (!PLURAL_ENDUNG.test(w)) continue;
    if (EN_SINGULAR.test(w)) continue;
    const zwei = (woerter3[i - 2] || "").toLowerCase().replace(/[^a-zäöüß]/g, "");
    const davor = (woerter3[i - 1] || "").toLowerCase().replace(/[^a-zäöüß]/g, "");
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
  let woerter3 = haupt.replace(/^(der|die|das|ein|eine|einen)\s+/i, "").split(/\s+/);
  while (woerter3.length > 1 && RECHTSFORM.test(woerter3[woerter3.length - 1].replace(/[^A-Za-z.]/g, ""))) woerter3.pop();
  const letzt = woerter3[woerter3.length - 1] || haupt;
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
function satzOhneZahl(bank2, kats, benutzt, zusatz = []) {
  const kandidaten = [];
  for (const k of kats) for (const x of bank2[k] || []) {
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
function hergang(fb, bank2, b, benutzt, extra, vorrat, blick) {
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
    const roh = satzOhneZahl(bank2, ["obstacles", "turns"], benutzt, vorrat);
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
function zitat(fb, bank2, b, benutzt, welche, vorrat) {
  const p = fb.personen[welche];
  if (!p || !p.zitierfaehig) return "";
  const kern = satzOhneZahl(bank2, ["hooks", "stakes"], benutzt, vorrat) || "Wir haben lange gewartet";
  return `\u201E${cap(kern)}\u201C, sagte ${b.person(p)}.`;
}
function hintergrund(fb, bank2, b, benutzt, extra, vorrat) {
  const teile = [];
  const c1 = fb.chronologie[0];
  const RK = RESSORTS[fb.ressort].hintergrundKopf;
  if (c1) teile.push(RK ? RK(b.organisation(fb), c1.zeit) : fb.wer.art === "person" ? `${cap(b.organisation(fb))} ist seit ${c1.zeit} dabei.` : istEinrichtung(fb.wer.haupt) ? `${cap(b.organisation(fb))} besteht seit ${c1.zeit}.` : `Der Vorgang reicht bis ${c1.zeit} zur\xFCck.`);
  const rahmen = reihenfolge2(NOMINALRAHMEN);
  let r = 0;
  const frei = [];
  for (let i = 0; i < 1 + extra; i++) {
    const roh = satzOhneZahl(bank2, ["motifs", "props"], benutzt, vorrat);
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
function buildBericht(bank2, input, ressort = "auto") {
  const fb = ziehFaktenblatt(input, ressort);
  const b = new Buchfuehrung();
  const benutzt = /* @__PURE__ */ new Set();
  const ziel = Number.isFinite(input.lenTarget) ? input.lenTarget : 240;
  const extra = Math.max(0, Math.min(22, Math.round((ziel - 124) / 17)));
  const vorrat = buildVersAtome(bank2, input).filter((x) => x.split(/\s+/).length >= 5);
  const blick = blickVonTon(input.tone || "");
  const abschnitte = [];
  abschnitte.push(dachzeile(fb));
  const zeile = schlagzeile(fb);
  benutzt.add(satzSchluessel(zeile));
  benutzt.add(satzSchluessel(fb.was));
  abschnitte.push(zeile);
  abschnitte.push(vorspann(fb, b, blick));
  const hergangText = hergang(fb, bank2, b, benutzt, extra, vorrat, blick);
  abschnitte.push(hergangText);
  const z1 = zitat(fb, bank2, b, benutzt, 0, vorrat);
  if (z1) abschnitte.push(z1);
  abschnitte.push(hintergrund(fb, bank2, b, benutzt, extra, vorrat));
  const z2 = zitat(fb, bank2, b, benutzt, 1, vorrat);
  if (z2) abschnitte.push(z2);
  const z3s = zitat(fb, bank2, b, benutzt, 2, vorrat);
  if (z3s) abschnitte.push(z3s);
  if (extra >= 3) {
    const teile = [];
    for (let i = 0; i < extra - 2; i++) {
      const roh = satzOhneZahl(bank2, ["turns", "obstacles", "motifs"], benutzt, vorrat);
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
      const roh = satzOhneZahl(bank2, ["hooks", "turns", "stakes"], benutzt, vorrat);
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
init_text_utils();
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
  const werte2 = [kit.W, kit.T, kit.P, strip(kit.Apure), strip(kit.turn), strip(kit.stake), strip(kit.obstacle), strip(kit.hook), strip(clean(kit.ending).replace(/[.!?…]+$/, ""))].map((x) => clean(x || "").toLowerCase()).filter((x) => x.length > 3);
  const geruest = (z) => {
    let g = z.toLowerCase();
    for (const w2 of werte2) if (w2) g = g.split(w2).join("\xA7");
    return g.replace(/[^a-zäöüß§]+/g, " ").trim();
  };
  const lines = [];
  const gesehen = /* @__PURE__ */ new Set();
  const genannt = /* @__PURE__ */ new Set();
  {
    const tl = text.toLowerCase();
    for (const w2 of werte2) if (tl.includes(w2)) genannt.add(w2);
  }
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

// src/generation/reim.ts
init_text_utils();

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

// src/generation/haiku.ts
init_text_utils();

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
  const fromBank = (bank2, target) => {
    const free = bank2.filter((l2) => !used.has(l2.toLowerCase()) && haikuSyllOf(l2) === target);
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

// src/generation/strang.ts
init_text_utils();

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
  ["rekombination", "Rekombination"],
  // Geregelter Mittelweg (4.337.0): die Schlagfolge des gewählten Bogens als
  // Phasenfolge, rekombinatorisch gefüllt; Bogen-Material an den Gelenken
  // bevorzugt, dosiert über die Stellschraube „Erzählbogen".
  ["bogen", "Rekombination mit Bogen"]
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
var STRUCTURES = ohneAuto(werte(STRUCTURE_OPTS)).filter((x) => x !== "dramaturgie" && x !== "rekombination" && x !== "bogen");
var PERSPECTIVES = ohneAuto(werte(PERSP_OPTS));
var RHYTHMS = ohneAuto(werte(RHYTHM_OPTS));
var resBiased = (ui, kind, opts, aA, aB) => ui !== "auto" && opts.includes(ui) ? ui : biasedAutoChoice(kind, aA, aB) || pick(opts);
function buildKit(bank2, input, model) {
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
  const motif = maybeMarkov(pickSane(aug(bank2.motifs, "motifs")), 0.28);
  const hook = maybeMarkov(pickSane(aug(bank2.hooks, "hooks")), 0.28);
  const prop = ensureArticle(pickSane(aug(bank2.props, "props"), 1)).replace(/^(Ein|Eine|Einen|Einem|Einer|Eines|Der|Die|Das|Den|Dem|Des)\b/, (m) => m.toLowerCase());
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
    turn: maybeMarkov(pickSane(aug(bank2.turns, "turns")), 0.28),
    obstacle: pickSane(aug(bank2.obstacles, "obstacles")),
    stake: pickSane(aug(bank2.stakes, "stakes")),
    ending: pickSane(aug(bank2.endings, "endings")),
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
function buildStory(bank2, input, model) {
  resetMarkovTrace();
  const kit = buildKit(bank2, input, model);
  const lenTarget = Number.isFinite(input.lenTarget) ? input.lenTarget : 110;
  if (input.form === "bericht") return kleinerArtikel(buildBericht(bank2, input, input.ressort ?? "auto").text);
  if (input.form === "meldung") return kleinerArtikel(buildMeldung(input, input.ressort ?? "auto").text);
  if (input.form === "script") return postProcessText(makeDialogueScene(kit, lenTarget), input);
  if (input.form === "video") {
    return postProcessText(buildVideoSequenceText(kit, input.shots ?? 5, input.totalSec ?? 15, lenTarget), input);
  }
  if (input.form === "poem") {
    const rk = input.structure === "rekombination" ? buildRekombination(bank2, input, model) : "";
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
  const ASSEMBLER = /* @__PURE__ */ new Set(["rekombination", "linear", "reverse", "circle", "fragment", "object", "bogen"]);
  if (input.form === "prose" && ASSEMBLER.has(input.structure || "")) {
    const rk = buildRekombination(bank2, input, model);
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
  if (input.form === "prose") text = applyTension(text, input.tension, { motifs: bank2.motifs, hooks: bank2.hooks });
  text = paragraphize(text);
  const paras = text.split(/\n\n+/).map(clean).filter(Boolean);
  text = effStructure === "object" ? paras.join("\n\n") : applyPerspective(paras, kit.perspective, kit.P, pick(kit.mode.nouns)).join("\n\n");
  if (kit.perspective === "third") text = pronominalize(text, kit.P, guessPronoun(kit.P));
  const finalText = postProcessText(text, input);
  const anchor = kit.ending || kit.Apure;
  if (input.form === "reim") return asReim(finalText, anchor, lenTarget, buildVersAtome(bank2, input, model));
  if (input.form === "haiku") {
    return asHaiku(finalText, anchor, lenTarget, buildVersAtome(bank2, input, model));
  }
  if (input.form === "strang") return asStrang(finalText, anchor, lenTarget);
  if (input.form === "drama") return asDrama(finalText, kit.speakerA, kit.speakerB || kit.P);
  return kommaVorInversion(kleinesPronomen(kleinerArtikel(verwandleMotive(
    entferneDubletten(enforceWordTarget(finalText, lenTarget, bank2, model, input.markovMode || "mix")),
    leseVerwandlungen(bank2.verwandlungen)
  ))));
}

// src/features/erzaehlungen.data.ts
var ERZAEHLUNGEN_VORLAGEN = [
  {
    titel: "Steigender Bogen",
    folge: "standard",
    text: "Der F\xE4hrmann z\xE4hlt am Morgen die Ruder. Ein Riemen fehlt. Das Wasser steht still wie ein Gedanke. Die erste Fuhre geht gut, die zweite auch. Ein Passagier l\xE4sst eine M\xFCnze fallen, die niemand aufhebt. Der Wind dreht gegen Mittag. Die Str\xF6mung zieht st\xE4rker als sonst. Es geht um die letzte \xDCberfahrt des Tages. Der F\xE4hrmann sp\xFCrt das Seil in den H\xE4nden arbeiten. Aber das andere Ufer r\xFCckt nicht n\xE4her. Die Glocke am Steg schl\xE4gt von allein. Dann rei\xDFt die Halterung, und die F\xE4hre dreht sich aus der Linie. Pl\xF6tzlich kippt der Nachmittag ins Dunkle. Die Passagiere schweigen in einer Reihe. Der F\xE4hrmann bindet das Seil um den eigenen Arm. Die F\xE4hre erreicht das Ufer schr\xE4g und zu sp\xE4t. Am Ende fehlt eine M\xFCnze, und niemand fehlt. Zur\xFCck bleibt ein Riemen, der am n\xE4chsten Morgen wieder da ist."
  },
  {
    titel: "Kreisschluss",
    folge: "kreis",
    text: "Eine Frau kehrt in das Haus ihrer Kindheit zur\xFCck und findet die T\xFCr offen. Ein Flur voller M\xE4ntel, die niemandem geh\xF6ren. Der Geruch von Bohnerwachs und Winter. Sie stellt den Koffer an die Stelle, an der er immer stand. Die Uhr in der K\xFCche geht sieben Minuten vor, wie damals. Ein Fenster, das sich nur von innen \xF6ffnen l\xE4sst. Es geht um das, was bleibt, wenn man geht. Die Nachbarin gr\xFC\xDFt mit dem Namen der Mutter. Aber die Treppe knarrt an einer neuen Stelle. Dann findet sie im Schrank ihren eigenen Kindermantel, frisch geb\xFCrstet. Die Zimmer werden kleiner, je l\xE4nger sie bleibt. Pl\xF6tzlich versteht sie, dass das Haus sie erwartet hat. Sie \xF6ffnet alle Fenster von innen. Am Ende stellt sie den Koffer wieder in den Flur und l\xE4sst die T\xFCr offen. Zur\xFCck bleibt ein Haus, das auf die N\xE4chste wartet."
  },
  {
    titel: "R\xFCckw\xE4rts erz\xE4hlt",
    folge: "rueckwaerts",
    text: "Am Ende liegt der Brief unge\xF6ffnet im Fluss. Davor steht ein Mann eine Stunde auf der Br\xFCcke. Ein Umschlag mit einem fremden Poststempel. Die H\xE4nde sind ruhiger, als sie sein d\xFCrften. Davor kauft er am Kiosk eine Zeitung, die er nicht liest. Der Kiosk verkauft an diesem Tag nur an ihn. Es geht um eine Nachricht, die alles ordnen w\xFCrde. Davor wartet er drei Tage neben dem Briefkasten. Aber der Briefkasten bleibt drei Tage leer. Dann kommt der Brief am vierten Tag, zu fr\xFCh am Morgen. Ein Absender ohne Namen, eine Schrift wie seine eigene. Pl\xF6tzlich wei\xDF er, was darin steht, ohne zu \xF6ffnen. Davor, ganz am Anfang, schreibt jemand in einer anderen Stadt eine einzige Zeile. Die Zeile lautet: Komm nicht. Zur\xFCck bleibt ein Fluss, der Briefe kennt."
  },
  {
    titel: "Retardation \u2014 die falsche Entwarnung",
    folge: "retardation",
    text: "Im Bergwerk riecht es seit Tagen nach kaltem Rauch. Eine Lampe, die zweimal flackert. Der Steiger klopft die W\xE4nde ab und nickt. Die Messung zeigt nichts, die zweite auch nichts. Ein Kanarienvogel singt lauter als sonst. Die Schicht arbeitet weiter, beruhigt und schneller. Es geht um den tiefsten Stollen der Grube. Aber der Geruch kehrt hinter der Entwarnung zur\xFCck. Ein Hut voller Staub vom Firstholz. Die dritte Messung f\xE4llt aus, weil das Ger\xE4t schweigt. Dann knackt das Holz in einer Sprache, die alle kennen. Der Steiger hebt die Hand, und die Lampen gehen aus. Pl\xF6tzlich l\xE4uft die Schicht in vollkommener Ordnung r\xFCckw\xE4rts. Der Berg l\xE4sst sie gehen, einen nach dem anderen. Am Ende z\xE4hlt der Steiger am Tageslicht die Helme. Die Zahl stimmt, und niemand spricht sie aus. Zur\xFCck bleibt ein Vogel, der im Dunkeln weitersingt."
  },
  {
    titel: "Doppelte Wende",
    folge: "doppelt",
    text: "Die Schachspielerin erkennt die Falle im siebten Zug. Ein Springer am Rand, scheinbar vergessen. Sie lehnt das Opfer ab und steht besser. Der Saal atmet mit den Uhren. Es geht um die Partie ihres Lebens. Der Gegner l\xE4chelt, als h\xE4tte er das erwartet. Dann opfert er die Dame, und das Brett kippt. Pl\xF6tzlich ist ihr Vorteil eine Grube. Aber in der Grube liegt ein zweiter Weg, den keiner sah. Ein Bauer, der seit dem ersten Zug wartet. Sie gibt den Turm und dann den zweiten Turm. Der Saal versteht nichts und wird still. Dann wendet sich die Partie zum zweiten Mal. Der Bauer geht seinen letzten Schritt und wird alles. Am Ende reicht der Gegner die Hand \xFCber ein leeres Brett. Zur\xFCck bleibt ein Springer am Rand, unber\xFChrt bis zuletzt."
  },
  {
    titel: "Stiller Bogen \u2014 nichts passiert, alles \xE4ndert sich",
    folge: "still",
    text: "Der Leuchtturmw\xE4rter hat seit Wochen kein Schiff gesehen. Eine Kanne Tee f\xFCr einen Menschen. Das Licht dreht sich, ob jemand f\xE4hrt oder nicht. Er streicht das Gel\xE4nder, das niemand anfasst. Eine Liste der St\xFCrme, sauber gef\xFChrt. Das Meer bleibt h\xF6flich und fern. Es geht um das Warten selbst. Aber die Vorr\xE4te rechnen mit einem zweiten Menschen. Der Funk sagt jeden Abend dasselbe Rauschen. Dann bleibt eines Nachts das Rauschen aus. Nichts geschieht, und nichts geschieht sehr laut. Der W\xE4rter deckt den Tisch f\xFCr zwei und lacht nicht. Pl\xF6tzlich versteht er das Licht als Frage. Er beantwortet sie, indem er bleibt. Am Ende f\xE4hrt kein Schiff vorbei, und es gen\xFCgt. Zur\xFCck bleibt eine zweite Tasse, gew\xE4rmt und leer."
  },
  {
    titel: "Eskalation in drei Stufen",
    folge: "eskalation",
    text: "Am ersten Tag fehlt dem Dorf ein Brunnen. Die Leute holen Wasser vom Bach und lachen dar\xFCber. Ein Eimer mit neuem Seil. Am zweiten Tag fehlt dem Dorf der Bach. Das Bett liegt trocken wie ein Sonntag. Die Leute graben und finden feuchten Sand. Es geht um das Wasser und um mehr als das Wasser. Ein Maulwurf flieht in die falsche Richtung. Aber der Regen zieht am Dorf vorbei, dreimal hintereinander. Am dritten Tag fehlt dem Dorf der Himmel. Ein Grau ohne Wolken, ein Licht ohne Quelle. Dann \xF6ffnet die \xE4lteste Frau den versiegelten Keller. Pl\xF6tzlich steht dort Wasser bis zur dritten Stufe. Das Dorf trinkt und fragt erst danach. Am Ende kehrt der Bach zur\xFCck, als w\xE4re er beleidigt gewesen. Zur\xFCck bleibt ein Keller, den keiner mehr versiegelt."
  },
  {
    titel: "Katastrophe zuerst",
    folge: "katastrophe",
    text: "Das Feuer ist am Morgen schon vorbei. Ein Dachstuhl wie ein schwarzes Geweih. Die Bewohner stehen im Garten und halten Tassen. Niemand fehlt, das ist das Erste. Es geht um das, was nach dem Ende beginnt. Der Kater kehrt ru\xDFig zur\xFCck und wird gefeiert. Aber die Papiere sind Asche, alle Namen darin. Ein Nachbar bringt Brot, ein anderer eine Leiter. Die Versicherung schickt einen Mann mit sauberen Schuhen. Dann findet das Kind im Schutt die eiserne Kassette. Pl\xF6tzlich ist der Schl\xFCssel wichtiger als das Haus. Die Kassette \xF6ffnet sich mit dem zweit\xE4ltesten Schl\xFCssel. Darin liegt kein Geld, sondern eine Liste der Nachbarn von 1911. Die Familie liest die Namen laut in den Garten. Am Ende bauen dieselben Namen das Dach neu. Zur\xFCck bleibt ein Geruch, der nach zwei Wintern geht."
  },
  {
    titel: "Zwei Str\xE4nge, ein Treffpunkt",
    folge: "straenge",
    text: "Die Botin nimmt den Weg \xFCber den Pass, weil die Br\xFCcke gesperrt ist. Ein Paket, das nicht klappern darf. Im Tal packt der Uhrmacher seine Werkstatt in vier Kisten. Eine Wand voller stehender Uhren. Die Botin teilt ihr Brot mit einem Hund, der den Weg kennt. Der Uhrmacher verschenkt die Uhren, die niemand abholte. Es geht um eine Lieferung und einen Abschied. Aber der Pass schlie\xDFt hinter der Botin im Schnee. Der Hund geht voraus, als h\xE4tte er den Auftrag. Dann stehen beide zur selben Stunde am selben Tor. Das Paket enth\xE4lt eine einzige Unruh, klein wie ein Same. Pl\xF6tzlich schl\xE4gt die Wand der stehenden Uhren an. Der Uhrmacher packt die Kisten wieder aus. Am Ende bleibt die Werkstatt, und die Botin bleibt den Winter. Zur\xFCck bleibt ein Hund, der zwei Herren dient."
  },
  {
    titel: "Offenes Ende \u2014 die Schwebe",
    folge: "offen",
    text: "Auf dem Bahnsteig steht ein Koffer ohne Besitzer. Die Ansage nennt einen Zug, den der Plan nicht kennt. Eine Frau setzt sich neben den Koffer, als geh\xF6re sie dazu. Der Abend riecht nach Eisen und Regen. Es geht um eine Entscheidung, die noch niemand getroffen hat. Ein Schaffner geht vorbei und gr\xFC\xDFt den Koffer. Aber der angek\xFCndigte Zug f\xE4hrt auf keinem Gleis ein. Die Uhr \xFCber dem Bahnsteig verliert eine Minute. Dann \xF6ffnet die Frau den Koffer einen Fingerbreit. Ein Licht f\xE4llt heraus, das zu keiner Lampe geh\xF6rt. Pl\xF6tzlich stehen mehr Menschen auf dem Bahnsteig, als gekommen sind. Alle sehen auf das Gleis, keiner auf den Koffer. Die Ansage wiederholt sich, freundlicher als zuvor. Am Ende f\xE4hrt etwas ein, das man nicht beschreiben kann. Ob die Frau einsteigt, wei\xDF der Bahnsteig allein."
  }
];

// test/erzaehler.ts
var dom = new import_jsdom.JSDOM("<!doctype html><html><body></body></html>", { url: "https://x.test/" });
globalThis.localStorage = dom.window.localStorage;
var inp = {
  where: "im Hafen",
  when: "am Abend",
  who: "Der Bote",
  what: "h\xF6rt die Glocke",
  tone: "mystery",
  varLevel: "wild",
  form: "prose",
  structure: "dramaturgie",
  mode: "myth",
  perspective: "third",
  rhythm: "auto",
  markovMode: "off",
  disruptor: "auto",
  archetypeA: "neutral",
  archetypeB: "psychopath",
  instability: 2,
  polish: false,
  polishStyle: "surreal_precise"
};
var fails = [];
var geprueft = 0;
var bestanden = 0;
var ist = (name, wert, soll) => {
  geprueft++;
  if (wert === soll) bestanden++;
  else fails.push(`${name}: \u201E${String(wert)}\u201C \u2014 erwartet \u201E${String(soll)}\u201C`);
};
var wahr = (name, b) => ist(name, b, true);
ist("immer zehn Pl\xE4tze", ladeErzaehlerbank().length, ERZAEHLER_PLAETZE);
localStorage.setItem("dm_erzaehlerbank_v1", "kaputt{");
ist("kaputter Speicher \u2192 zehn leere Pl\xE4tze", ladeErzaehlerbank().filter((e) => !e.text).length, ERZAEHLER_PLAETZE);
var bank = ladeErzaehlerbank();
bank[2] = { titel: "Evolution", text: VORLAGE_EVOLUTION };
speichereErzaehlerbank(bank);
ist("gespeichert und gelesen", ladeErzaehlerbank()[2].titel, "Evolution");
wahr("brauchbar ab vierzig W\xF6rtern", platzBrauchbar(bank[2]) && !platzBrauchbar({ titel: "x", text: "zu kurz" }));
var b2 = erzaehlerBogen(2);
wahr("ein voller Platz liefert einen Bogen", !!b2 && b2.einstieg.length >= 1 && b2.schluss.length >= 1);
ist("ein leerer Platz liefert null", erzaehlerBogen(5), null);
setzeQuelle("2");
ist("die Wahl wird gehalten", ladeQuelle(), "2");
wahr("fest gew\xE4hlt \u2192 der Bogen dieses Platzes", JSON.stringify(bogenFuerErzeugung()) === JSON.stringify(b2));
setzeQuelle("preset");
ist("aus Preset \u2192 null (der Preset-Bogen gilt)", bogenFuerErzeugung(), null);
setzeQuelle("wuerfeln");
wahr("w\xFCrfeln \u2192 ein brauchbarer Bogen", !!bogenFuerErzeugung());
setzeQuelle("5");
ist("fest auf leerem Platz \u2192 null, die Maschine erz\xE4hlt wie bisher", bogenFuerErzeugung(), null);
setzeQuelle("unsinn");
ist("Unsinn f\xE4llt auf preset zur\xFCck", ladeQuelle(), "preset");
setDramaData({ einstieg: ["Preset-Einstieg."], mitte: [], hoehepunkt: [], schluss: [], ausloeser: [], veraenderungen: [], konflikte: [], zeitanomalien: [], regeln: [] });
ist("ohne Override: der gespeicherte Bogen", loadDramaData().einstieg[0], "Preset-Einstieg.");
setBogenOverride(b2);
wahr("mit Override: der Erz\xE4hler-Bogen", loadDramaData().einstieg[0] !== "Preset-Einstieg.");
wahr("hasDramaData sieht ihn ebenfalls", hasDramaData());
setBogenOverride(null);
ist("abger\xE4umt: wieder der gespeicherte", loadDramaData().einstieg[0], "Preset-Einstieg.");
setDramaData(null);
var st = (0, import_fs.readFileSync)("src/ui/studio.ts", "utf8");
wahr("das Studio hat den Bogen-Regler neben der Struktur", /lockField\("Struktur", structure\),[\s\S]{0,400}?el\("span", \{\}, "Bogen"\)\), bogenSel\)/.test(st));
wahr("der Bogen ist nicht w\xFCrfelbar", !/ROLL_SELECTS = \[[^\]]*bogenSel/.test(st));
wahr("die Wahl wird beim Wechsel gesichert", /bogenSel\.addEventListener\("change", \(\) => setzeQuelle\(bogenSel\.value\)\)/.test(st));
wahr("vor jeder Erzeugung wird die Weiche gestellt", /setBogenOverride\(bogenFuerErzeugung\(\)\);\s*\n\s*const model = /.test(st));
var ap = (0, import_fs.readFileSync)("src/ui/app.ts", "utf8");
wahr("der Reiter steht neben der Wortbank", /\["Wortbank", mountWordbank\],\s*\n\s*\["Erzählerbank", mountErzaehlerbank\],/.test(ap));
var ev = (0, import_fs.readFileSync)("src/ui/erzaehlerbankView.ts", "utf8");
wahr(
  "jeder Platz hat Titel, Text, Bogen-Vorschau, Einf\xFCgen, Speichern, Leeren",
  /Bogen zeigen/.test(ev) && /Einfügen/.test(ev) && /Platz leeren/.test(ev) && /preset2AusText\(textIn\.value\)\.drama/.test(ev)
);
{
  ist("es sind zehn", ERZAEHLUNGEN_VORLAGEN.length, 10);
  wahr("alle brauchbar (\xFCber der 40-W\xF6rter-Schwelle)", ERZAEHLUNGEN_VORLAGEN.every((e) => platzBrauchbar(e)));
  ist("die Titel sind verschieden", new Set(ERZAEHLUNGEN_VORLAGEN.map((e) => e.titel)).size, 10);
  wahr("jede tr\xE4gt Einstieg, H\xF6hepunkt und Schluss", ERZAEHLUNGEN_VORLAGEN.every((e) => {
    const d = preset2AusText(e.text).drama;
    return d.einstieg.length >= 1 && d.hoehepunkt.length >= 1 && d.schluss.length >= 1;
  }));
  wahr("und die Texte sind verschieden lang gebaut (kein Klon)", new Set(ERZAEHLUNGEN_VORLAGEN.map((e) => e.text.length)).size === 10);
  const q2 = (0, import_fs.readFileSync)("src/ui/erzaehlerbankView.ts", "utf8");
  wahr("der Reiter hat den Vorlagen-Knopf", /"Vorlagen einsetzen \(leere Plätze\)"/.test(q2));
  wahr("er f\xFCllt nur leere Pl\xE4tze", /if \(alle\[i\]!\.text\.trim\(\)\) continue;/.test(q2));
  wahr("belegte Pl\xE4tze melden sich statt zu \xFCberschreiben", /"Kein Platz frei"/.test(q2));
}
{
  wahr(
    "jede Bauform nennt nur g\xFCltige Schl\xE4ge",
    Object.values(SCHLAGFOLGEN).every((f) => f.folge.every((n) => SCHLAG_NAMEN.has(n)))
  );
  ist("die Standardfolge ist der steigende Bogen", SCHLAGFOLGEN["standard"].folge.join(","), SCHLAG_STANDARD.join(","));
  ist("Katastrophe zuerst beginnt mit dem H\xF6hepunkt", SCHLAGFOLGEN["katastrophe"].folge[0], "hoehepunkt");
  ist("R\xFCckw\xE4rts beginnt mit dem Schluss", SCHLAGFOLGEN["rueckwaerts"].folge[0], "schluss");
  ist("der Kreis endet am Einstieg", SCHLAGFOLGEN["kreis"].folge.at(-1), "einstieg");
  wahr(
    "der stille Bogen verzichtet auf Wende und H\xF6hepunkt",
    !SCHLAGFOLGEN["still"].folge.includes("wende") && !SCHLAGFOLGEN["still"].folge.includes("hoehepunkt")
  );
  wahr("das offene Ende l\xE4sst den Schluss aus", !SCHLAGFOLGEN["offen"].folge.includes("schluss"));
  wahr("jede Vorlage tr\xE4gt ihre Bauform", ERZAEHLUNGEN_VORLAGEN.every((e) => !!e.folge && !!SCHLAGFOLGEN[e.folge]));
  ist("und alle zehn Bauformen kommen vor", new Set(ERZAEHLUNGEN_VORLAGEN.map((e) => e.folge)).size, 10);
  const alle = ladeErzaehlerbank();
  alle[0] = { ...ERZAEHLUNGEN_VORLAGEN[7] };
  speichereErzaehlerbank(alle);
  const bogen = erzaehlerBogen(0);
  wahr("der Bogen tr\xE4gt die Folge der Bauform", (bogen.folge || []).join(",") === SCHLAGFOLGEN["katastrophe"].folge.join(","));
  setDramaData(bogen);
  let vorn = 0;
  for (let i = 0; i < 12; i++) {
    const t = buildStory(DEFAULT_BANK, inp);
    const kopf = t.split(/(?<=[.!?…])\s+/).slice(0, 3).join(" ");
    if (!/Und dann:/.test(kopf) && bogen.hoehepunkt.some((h) => kopf.includes(h.slice(0, 18)))) vorn++;
  }
  wahr("der H\xF6hepunkt steht am Anfang (12 L\xE4ufe, mehrmals getroffen)", vorn >= 6, String(vorn));
  setDramaData(null);
}
{
  const d1 = {
    einstieg: ["Ein Absender ohne Namen, eine Schrift wie seine eigene"],
    mitte: ["Ein Absender ohne Namen, eine Schrift wie seine eigene", "Die zweite Zeile"],
    hoehepunkt: ["Der Gipfel"],
    schluss: [],
    ausloeser: [],
    veraenderungen: ["Alles dreht"],
    konflikte: [],
    zeitanomalien: [],
    regeln: [],
    folge: ["einstieg", "mitte", "mitte", "wende", "hoehepunkt"]
  };
  setDramaData(d1);
  let doppelt = 0;
  for (let i = 0; i < 20; i++) {
    const t = buildStory(DEFAULT_BANK, inp);
    if ((t.match(/eine Schrift wie seine eigene/g) || []).length > 1) doppelt++;
  }
  ist("kein Bogen-Satz zweimal im selben Text (20 L\xE4ufe)", doppelt, 0);
  const d2 = {
    einstieg: ["Der Anfang steht"],
    mitte: [],
    hoehepunkt: ["Pl\xF6tzlich wei\xDF er alles"],
    schluss: [],
    ausloeser: ["Davor wartet er drei Tage neben dem Briefkasten"],
    veraenderungen: [],
    konflikte: [],
    zeitanomalien: [],
    regeln: [],
    folge: ["einstieg", "ausloeser", "hoehepunkt"]
  };
  setDramaData(d2);
  let zeitkopf = 0;
  for (let i = 0; i < 20; i++) {
    const t = buildStory(DEFAULT_BANK, inp);
    if (/(Dann, unvermittelt: Davor|Und dann: Plötzlich)/.test(t)) zeitkopf++;
  }
  ist("keine Zeit-Formel vor einem Zeitwort (20 L\xE4ufe)", zeitkopf, 0);
  setDramaData(null);
}
{
  const d3 = {
    einstieg: ["Der Anfang steht"],
    mitte: [],
    hoehepunkt: [],
    schluss: [],
    ausloeser: ["die Karten der Wahrsagerin zeigen zweimal denselben Tod"],
    veraenderungen: [],
    konflikte: [],
    zeitanomalien: [],
    regeln: [],
    folge: ["einstieg", "ausloeser", "wende"]
  };
  setDramaData(d3);
  const bankMitTurn = { ...DEFAULT_BANK, turns: ["die Karten der Wahrsagerin zeigen zweimal denselben Tod"] };
  let mehrfach = 0;
  for (let i = 0; i < 25; i++) {
    const t = buildStory(bankMitTurn, { ...inp, tension: "high" });
    if ((t.match(/Karten der Wahrsagerin/g) || []).length > 1) mehrfach++;
  }
  ist("Bogen-Ausl\xF6ser und Bank-Wende mit gleichem Wortlaut: h\xF6chstens einmal (25 L\xE4ufe)", mehrfach, 0);
  const d4 = { ...d3, ausloeser: [], folge: ["einstieg"] };
  setDramaData(d4);
  const t2 = buildStory(DEFAULT_BANK, { ...inp, when: "Nachdem die letzte Grenze fiel, als die Zeitungen schwiegen", where: "hoch in der Luft", polish: false });
  wahr("kein nacktes \u201E\u2026 schwiegen hoch in der Luft.\u201C", !/schwiegen hoch in der Luft\./i.test(t2));
  wahr("der Einstiegssatz schlie\xDFt das Fragment mit Strich", /schwiegen hoch in der Luft — der Anfang steht/i.test(t2));
  setDramaData(null);
}
{
  wahr("jede Bauform hat ihre Anweisung", Object.keys(SCHLAGFOLGEN).every((k) => !!BAUFORM_ANWEISUNG[k]));
  const pr = bauePromptErzaehlung("rueckwaerts", "Ein Brief im Fluss");
  wahr("der Prompt nennt die Bauform", /rückwärts erzählt: beginne mit dem Ende/.test(pr));
  wahr("und das Thema", /Ein Brief im Fluss/.test(pr));
  wahr("und verlangt JSON mit Titel und Text", /NUR mit JSON/.test(pr) && /"titel"/.test(pr) && /"text"/.test(pr));
  wahr("und die Wortspanne", /120 bis 170 Wörter/.test(pr));
  ist("unbekannte Bauform f\xE4llt auf die Standard-Anweisung", bauePromptErzaehlung("gibtsnicht").includes(BAUFORM_ANWEISUNG["standard"]), true);
  const qv = (0, import_fs.readFileSync)("src/ui/erzaehlerbankView.ts", "utf8");
  wahr("jeder Platz hat den KI-Knopf", /"KI: neu erzählen"/.test(qv));
  wahr("er erz\xE4hlt in der Bauform des Platzes, Thema aus dem Titel", /kiErzaehlung\(folgeSel\.value, titelIn\.value\.trim\(\) \|\| undefined\)/.test(qv));
  wahr("Erfolg ersetzt den Platz und speichert", /alle\[i\] = \{ \.\.\.neu, folge: folgeSel\.value, geburt: folgeSel\.value \};\s*\n\s*speichereErzaehlerbank\(alle\)/.test(qv));
  wahr("Fehler stehen im Knopf, nichts scheitert stumm", /"KI-Fehler — noch einmal\?"/.test(qv));
}
{
  localStorage.removeItem("dm_erzaehler_archiv_v1");
  archiviere({ titel: "Die Herde am Abhang", text: "Ein Text, der lang genug ist, um brauchbar zu sein. ".repeat(5), folge: "standard" });
  archiviere({ titel: "Der F\xE4hrmann", text: "Noch ein Text, der lang genug ist, um brauchbar zu sein. ".repeat(5), folge: "standard" });
  archiviere({ titel: "Das Haus", text: "Ein Kreis-Text, der lang genug ist, um brauchbar zu sein. ".repeat(5), folge: "kreis" });
  ist("zwei Geschichten unterm Steigenden Bogen", archivFuer("standard").length, 2);
  ist("neueste zuerst", archivFuer("standard")[0].titel, "Der F\xE4hrmann");
  ist("die Bauformen sind getrennt", archivFuer("kreis").length, 1);
  archiviere({ titel: "Die Herde am Abhang", text: "Ein Text, der lang genug ist, um brauchbar zu sein. ".repeat(5), folge: "standard" });
  ist("gleicher Titel und Text: kein Doppel", archivFuer("standard").length, 2);
  ist("aber wieder vorn", archivFuer("standard")[0].titel, "Die Herde am Abhang");
  archiviere({ titel: "Die Herde am Abhang", text: "Ein ganz anderer Text, der lang genug ist, um brauchbar zu sein. ".repeat(5), folge: "standard" });
  ist("gleicher Titel mit neuem Text: keine neue Version", archivFuer("standard").length, 2);
  wahr("aber der Text ist der neue", archivFuer("standard")[0].text.startsWith("Ein ganz anderer Text"));
  archiviere({ titel: "Die Herde am Abhang, zweiter Versuch", text: "Ein ganz anderer Text, der lang genug ist, um brauchbar zu sein. ".repeat(5), folge: "standard" });
  ist("neuer Titel: neue Version", archivFuer("standard").length, 3);
  archiviere({ titel: "", text: "Namenlos eins, lang genug, um brauchbar zu sein, wirklich. ".repeat(5), folge: "standard" });
  archiviere({ titel: "", text: "Namenlos zwei, lang genug, um brauchbar zu sein, wirklich. ".repeat(5), folge: "standard" });
  ist("zwei namenlose Texte bleiben zwei Eintr\xE4ge", archivFuer("standard").length, 5);
  loescheAusArchiv("standard", 0);
  ist("l\xF6schen trifft den gew\xE4hlten Eintrag", archivFuer("standard").length, 4);
  for (let k = 0; k < ARCHIV_JE_BAUFORM + 5; k++) archiviere({ titel: "T" + k, text: "Deckel-Text, der lang genug ist, um brauchbar zu sein. ".repeat(5), folge: "still" });
  ist("h\xF6chstens zwanzig je Bauform", archivFuer("still").length, ARCHIV_JE_BAUFORM);
  localStorage.removeItem("dm_erzaehler_archiv_v1");
  const qa = (0, import_fs.readFileSync)("src/ui/erzaehlerbankView.ts", "utf8");
  wahr("die Auswahl geh\xF6rt zur Bauform des Platzes", /archivFuer\(folgeSel\.value\)/.test(qa) && /folgeSel\.addEventListener\("change", fuelleArchiv\)/.test(qa));
  wahr("w\xE4hlen l\xE4dt und speichert den Platz", /titelIn\.value = e\.titel; textIn\.value = e\.text;/.test(qa));
  wahr("Speichern und KI archivieren", (qa.match(/archiviere\(alle\[i\]!\);/g) || []).length === 2);
}
{
  localStorage.removeItem("dm_erzaehler_archiv_v1");
  const txt = "Eine Geschichte, die lang genug ist, um brauchbar zu sein. ".repeat(5);
  archiviere({ titel: "Die Herde", text: txt, folge: "standard" });
  ist("beim ersten Archivieren wird die Geburt festgeschrieben", archivFuer("standard")[0].geburt, "standard");
  archiviere({ titel: "Die Herde", text: txt, folge: "kreis" });
  ist("unter fremder Bauform bleibt die Geburt erhalten", archivFuer("kreis")[0].geburt, "standard");
  archiviere({ titel: "Die Herde", text: txt + "Ganz neu erz\xE4hlt. ", folge: "kreis" });
  ist("gleicher Titel, neuer Text: Fortschritt, die Geburt bleibt", archivFuer("kreis")[0].geburt, "standard");
  ist("und es bleibt EIN Eintrag unter Kreis", archivFuer("kreis").length, 1);
  archiviere({ titel: "Die Herde, neu", text: txt + "Ganz neu erz\xE4hlt. ", folge: "kreis" });
  ist("neuer Titel = neue Geschichte, geboren hier", archivFuer("kreis")[0].geburt, "kreis");
  localStorage.removeItem("dm_erzaehler_archiv_v1");
  const qg = (0, import_fs.readFileSync)("src/ui/erzaehlerbankView.ts", "utf8");
  wahr("die Auswahl kennzeichnet Geliehenes mit \u21C4 und Namen", /e\.geburt && e\.geburt !== folgeSel\.value/.test(qg) && /` · ⇄ \$\{name\}`/.test(qg));
  wahr("W\xE4hlen tr\xE4gt die Geburt in den Platz", /geburt: e\.geburt \|\| e\.folge/.test(qg));
  wahr("die KI setzt die Geburt auf ihre Bauform", /geburt: folgeSel\.value \}/.test(qg));
}
{
  const qz = (0, import_fs.readFileSync)("src/ui/erzaehlerbankView.ts", "utf8");
  wahr("es gibt den Knopf neben den Vorlagen", /"Alles zurücksetzen"/.test(qz) && /vorlagenBtn, leerenBtn/.test(qz));
  wahr("er fragt nach, bevor er leert", /if \(!confirm\("Alle zehn Plätze leeren\?/.test(qz));
  wahr("er leert alle Pl\xE4tze und stellt die zehn Bauformen wieder her", /folge: ERZAEHLUNGEN_VORLAGEN\[i\]\?\.folge \|\| "standard"/.test(qz));
  wahr("die Vorlagen tragen zehn verschiedene Bauformen", new Set(ERZAEHLUNGEN_VORLAGEN.map((e) => e.folge)).size === 10);
  wahr("das Archiv bleibt unangetastet (kein Archiv-Zugriff im Handler)", !/leerenBtn[\s\S]{0,600}speichereArchiv|leerenBtn[\s\S]{0,600}dm_erzaehler_archiv/.test(qz));
}
{
  const ql = (0, import_fs.readFileSync)("src/ui/erzaehlerbankView.ts", "utf8");
  wahr("der L\xF6schknopf ist beschriftet", /"Text löschen"/.test(ql));
  wahr("er l\xF6scht unmittelbar ohne Nachfrage", !/archivWeg\.addEventListener\("click", \(\) => \{[\s\S]{0,400}?confirm/.test(ql));
}
{
  const qt = (0, import_fs.readFileSync)("src/ui/erzaehlerbankView.ts", "utf8");
  wahr("der Knopf hei\xDFt \u201EText l\xF6schen\u201C, kein \xD7 mehr", /"Text löschen"/.test(qt) && !qt.includes('}, "\xD7")'));
  wahr("er steht neben \u201EPlatz leeren\u201C", /speichern, leeren, archivWeg\)/.test(qt));
  wahr("er l\xF6scht unmittelbar, ohne Nachfrage", /archivWeg\.addEventListener\("click"/.test(qt) && !/archivWeg\.addEventListener\("click", \(\) => \{\s*\n\s*if \(!confirm/.test(qt));
  wahr("ohne Auswahl ist er ausgegraut", /archivWeg\.disabled = !liste\.length \|\| archivSel\.value === ""/.test(qt));
}
{
  const V = ERZAEHLUNGEN_VORLAGEN;
  wahr("die Struktur steht zur Wahl", STRUCTURE_OPTS.some(([v]) => v === "bogen"));
  ist("Katastrophe zuerst beginnt im Umschlag", phasenAusSchlagfolge(SCHLAGFOLGEN["katastrophe"].folge)[0], "umschlag");
  ist("R\xFCckw\xE4rts beginnt im Schluss", phasenAusSchlagfolge(SCHLAGFOLGEN["rueckwaerts"].folge)[0], "schluss");
  ist("Standard beginnt in der Exposition und endet im Schluss", phasenAusSchlagfolge(SCHLAGFOLGEN["standard"].folge).join(",").replace(/^exposition.*schluss$/, "ok"), "ok");
  ist("ohne Folge: die lineare Folge, zehn Schritte", phasenAusSchlagfolge(null).length, 10);
  const e = V[0];
  const d = preset2AusText(e.text).drama;
  d.folge = SCHLAGFOLGEN["standard"].folge;
  setDramaData(d);
  const bogenWoerter = new Set(e.text.toLowerCase().match(/[a-zäöüß]{6,}/g) || []);
  const anteil = (t) => {
    const w = t.toLowerCase().match(/[a-zäöüß]{6,}/g) || [];
    return w.filter((x) => bogenWoerter.has(x)).length / Math.max(1, w.length);
  };
  const mess = (bogen) => {
    saveKnobs({ ...loadKnobs(), bogen });
    let sum = 0;
    for (let i = 0; i < 12; i++) sum += anteil(buildStory(DEFAULT_BANK, { ...inp, structure: "bogen", lenTarget: 160, polish: false }));
    return sum / 12;
  };
  const a0 = mess(0), a100 = mess(100), a250 = mess(250);
  wahr("0 % \u2192 100 % \u2192 250 %: der Bogen-Anteil steigt", a0 < a100 && a100 < a250, `${(a0 * 100).toFixed(0)} < ${(a100 * 100).toFixed(0)} < ${(a250 * 100).toFixed(0)}`);
  wahr("bei 0 % ist der Bogen praktisch stumm (unter 25 %)", a0 < 0.25, (a0 * 100).toFixed(0) + "%");
  wahr("bei 250 % tr\xE4gt er (\xFCber 35 %)", a250 > 0.35, (a250 * 100).toFixed(0) + "%");
  saveKnobs({ ...loadKnobs(), bogen: 100 });
  setDramaData(null);
  const qs = (0, import_fs.readFileSync)("src/ui/studio.ts", "utf8");
  wahr("der Studio-Hinweis kennt die neue Struktur", /structure\.value === "bogen" \? "Rekombination mit Bogen"/.test(qs));
  const qb = (0, import_fs.readFileSync)("src/generation/buildStory.ts", "utf8");
  wahr("Auto w\xFCrfelt sie nicht (sie braucht einen Bogen)", /x !== "bogen"\)/.test(qb));
}
{
  const qp = (0, import_fs.readFileSync)("src/ui/studio.ts", "utf8");
  wahr("der Bauplan schaltet sich auch bei \u201Ebogen\u201C ein", /const on = planChk\.checked && \(structure\.value === "rekombination" \|\| mitBogen\)/.test(qp));
  wahr("Kopfzeile nennt Bogen, Stellschraube und Bogen-Anteil", /Bausteinen aus dem Bogen/.test(qp) && /Erzählbogen \$\{loadKnobs\(\)\.bogen\} %/.test(qp));
  wahr("und die Phasenfolge aus der Schlagfolge", /"Phasenfolge: " \+ folge\.map/.test(qp));
  wahr("Bogen-Bausteine sind gekennzeichnet", /einstieg: "Bogen · Einstieg"/.test(qp) && /hoehepunkt: "Bogen · Höhepunkt"/.test(qp));
  const qh = (0, import_fs.readFileSync)("src/ui/helpView.ts", "utf8");
  wahr("die Hilfe sagt es", /Bauplan \(Rekombination und Rekombination mit Bogen\)/.test(qh));
}
{
  const fuenf = Array.from({ length: 10 }, (_, i) => i === 4 ? { titel: "Der Leuchtturm", text: "Ein Text, der lang genug ist, um brauchbar zu sein. ".repeat(6), folge: "still" } : { titel: "", text: "", folge: "standard" });
  speichereErzaehlerbank(fuenf);
  setzeQuelle("4");
  bogenFuerErzeugung();
  ist("fester Platz: die Blase nennt Platz und Titel", bogenBeschriftung().bogen, "Platz 5 \xB7 Der Leuchtturm");
  ist("und die Bauform", bogenBeschriftung().bauform, "Stiller Bogen");
  setzeQuelle("wuerfeln");
  bogenFuerErzeugung();
  ist("beim W\xFCrfeln: der konkret gezogene Platz", letzterGezogenerPlatz(), 4);
  wahr("und die Blase sagt \u201Egew\xFCrfelt\u201C", /^gewürfelt: Platz 5 · Der Leuchtturm$/.test(bogenBeschriftung().bogen), bogenBeschriftung().bogen);
  setzeQuelle("preset");
  bogenFuerErzeugung();
  ist("aus Preset: die Blase sagt es", bogenBeschriftung().bogen, "aus Preset");
  const qv = (0, import_fs.readFileSync)("src/ui/structureView.ts", "utf8");
  wahr("die Struktur-Ansicht zeichnet Bogen, Bauform, Phasenfolge", /\["Bogen", snap\.bogen\]/.test(qv) && /\["Bauform", snap\.bauform\]/.test(qv) && /\["Phasenfolge", snap\.phasenfolge\]/.test(qv));
  const qs2 = (0, import_fs.readFileSync)("src/ui/studio.ts", "utf8");
  wahr("der Schnappschuss tr\xE4gt sie beim Erzeugen ein", /const b = bogenBeschriftung\(\);/.test(qs2) && /out\.phasenfolge = phasenAusSchlagfolge/.test(qs2));
  speichereErzaehlerbank(Array.from({ length: 10 }, () => ({ titel: "", text: "", folge: "standard" })));
}
console.log(`Pr\xFCfstand Erz\xE4hlerbank \u2014 ${geprueft} Pr\xFCfungen, ${bestanden} bestanden`);
var proc = globalThis;
if (fails.length) {
  console.error(`
\u274C Erz\xE4hlerbank: ${fails.length} Fehler:`);
  fails.forEach((f) => console.error("  - " + f));
  proc.process?.exit(1);
} else {
  console.log(`
\u2705 Erz\xE4hlerbank: alle ${geprueft} Pr\xFCfungen bestanden.`);
}
