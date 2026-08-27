"use strict";

// src/generation/verben.ts
var STARK = {
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
var PRAEFIXE = [
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
var KEIN_VERB = /* @__PURE__ */ new Set([
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
  "besetzt",
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
  "rat",
  "tat",
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
  "macht",
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
  "verletzt",
  "entfernt",
  "versteckt",
  "verschwunden",
  "bestimmt",
  "gewohnt",
  "gelaunt",
  "verzweifelt",
  "beliebt",
  "ber\xFChmt",
  "geliebt",
  "gelebt",
  "gedacht",
  "gemacht",
  "gebracht",
  "gesagt",
  "verlangt",
  "gesucht",
  "gehabt",
  "gewusst",
  "gekannt",
  "genannt",
  "benannt",
  "bewegt",
  "gewollt",
  "erlaubt",
  "verboten",
  "ge\xF6ffnet",
  "beruhigt",
  "erleichtert",
  "verwirrt",
  "irritiert",
  "interessiert",
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
var SIBILANT = /(s|ß|z|x|tz|ss)$/;
var GE_VERBEN = /^ge(ht|nügt|hört|horcht|lingt|winnt|langt|schieht|steht|rät|nießt|wöhnt|fährdet|währt|stattet|staltet|denkt|bietet|braucht|hörcht|nest|reicht|dulde?t|fällt|deiht|lobt|leitet|langt|winnt|behrt|bärt|fried[e]?t|fällt|lüstet|mahnt|rinnt|hört)$/;
function starkMitPraefix(form) {
  if (STARK[form]) return ["", STARK[form]];
  for (const p2 of PRAEFIXE) {
    if (form.startsWith(p2) && form.length > p2.length + 2) {
      const rest = form.slice(p2.length);
      if (STARK[rest]) return [p2, STARK[rest]];
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
  const st = starkMitPraefix(w);
  if (st) {
    const [p2, [ich, du, wir, ihr]] = st;
    const f = person === "ich" ? ich : person === "du" ? du : person === "wir" ? wir : ihr || wir.replace(/e?n$/, "t");
    return fertig(p2 + f);
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
function paradigma(form3) {
  const ich = beugeVerb(form3, "ich");
  if (ich === null) return null;
  return { ich, du: beugeVerb(form3, "du"), er: form3, wir: beugeVerb(form3, "wir"), ihr: beugeVerb(form3, "ihr") };
}

// test/verben.ts
var fails = [];
var geprueft = 0;
var bestanden = 0;
var ist = (name, wert, soll) => {
  geprueft++;
  if (wert === soll) bestanden++;
  else fails.push(`${name}: \u201E${String(wert)}\u201C \u2014 erwartet \u201E${String(soll)}\u201C`);
};
var wahr = (name, b) => ist(name, b, true);
var p = (f) => {
  const x = paradigma(f);
  return x ? `${x.ich}/${x.du}/${x.er}/${x.wir}/${x.ihr}` : "null";
};
ist("bemerkt", p("bemerkt"), "bemerke/bemerkst/bemerkt/bemerken/bemerkt");
ist("geht (kurzer Stamm)", p("geht"), "gehe/gehst/geht/gehen/geht");
ist("kommt", p("kommt"), "komme/kommst/kommt/kommen/kommt");
ist("erbt (vier Buchstaben)", p("erbt"), "erbe/erbst/erbt/erben/erbt");
ist("wartet \u2192 wartest, nicht wartst", p("wartet"), "warte/wartest/wartet/warten/wartet");
ist("findet", p("findet"), "finde/findest/findet/finden/findet");
ist("\xF6ffnet \u2192 \xF6ffnest", p("\xF6ffnet"), "\xF6ffne/\xF6ffnest/\xF6ffnet/\xF6ffnen/\xF6ffnet");
ist("rechnet", p("rechnet"), "rechne/rechnest/rechnet/rechnen/rechnet");
ist("atmet", p("atmet"), "atme/atmest/atmet/atmen/atmet");
ist("antwortet", p("antwortet"), "antworte/antwortest/antwortet/antworten/antwortet");
ist("hei\xDFt \u2192 du hei\xDFt", p("hei\xDFt"), "hei\xDFe/hei\xDFt/hei\xDFt/hei\xDFen/hei\xDFt");
ist("sitzt", p("sitzt"), "sitze/sitzt/sitzt/sitzen/sitzt");
ist("reist", p("reist"), "reise/reist/reist/reisen/reist");
ist("fasst", p("fasst"), "fasse/fasst/fasst/fassen/fasst");
ist("handelt \u2192 ich handle, wir handeln", p("handelt"), "handle/handelst/handelt/handeln/handelt");
ist("sammelt", p("sammelt"), "sammle/sammelst/sammelt/sammeln/sammelt");
ist("\xE4ndert \u2192 ich \xE4ndere, wir \xE4ndern", p("\xE4ndert"), "\xE4ndere/\xE4nderst/\xE4ndert/\xE4ndern/\xE4ndert");
ist("erinnert", p("erinnert"), "erinnere/erinnerst/erinnert/erinnern/erinnert");
ist("tr\xE4gt \u2192 wir tragen", p("tr\xE4gt"), "trage/tr\xE4gst/tr\xE4gt/tragen/tragt");
ist("h\xE4lt", p("h\xE4lt"), "halte/h\xE4ltst/h\xE4lt/halten/haltet");
ist("l\xE4uft", p("l\xE4uft"), "laufe/l\xE4ufst/l\xE4uft/laufen/lauft");
ist("gibt", p("gibt"), "gebe/gibst/gibt/geben/gebt");
ist("nimmt", p("nimmt"), "nehme/nimmst/nimmt/nehmen/nehmt");
ist("sieht", p("sieht"), "sehe/siehst/sieht/sehen/seht");
ist("liest \u2192 du liest", p("liest"), "lese/liest/liest/lesen/lest");
ist("l\xE4sst", p("l\xE4sst"), "lasse/l\xE4sst/l\xE4sst/lassen/lasst");
ist("tritt", p("tritt"), "trete/trittst/tritt/treten/tretet");
ist("ist", p("ist"), "bin/bist/ist/sind/seid");
ist("hat", p("hat"), "habe/hast/hat/haben/habt");
ist("wird", p("wird"), "werde/wirst/wird/werden/werdet");
ist("wei\xDF", p("wei\xDF"), "wei\xDF/wei\xDFt/wei\xDF/wissen/wisst");
ist("kann", p("kann"), "kann/kannst/kann/k\xF6nnen/k\xF6nnt");
ist("will", p("will"), "will/willst/will/wollen/wollt");
ist("verspricht", p("verspricht"), "verspreche/versprichst/verspricht/versprechen/versprecht");
ist("zerbricht", p("zerbricht"), "zerbreche/zerbrichst/zerbricht/zerbrechen/zerbrecht");
ist("aufgibt", p("aufgibt"), "aufgebe/aufgibst/aufgibt/aufgeben/aufgebt");
ist("unterl\xE4sst", p("unterl\xE4sst"), "unterlasse/unterl\xE4sst/unterl\xE4sst/unterlassen/unterlasst");
ist("beh\xE4lt", p("beh\xE4lt"), "behalte/beh\xE4ltst/beh\xE4lt/behalten/behaltet");
ist("geschieht", p("geschieht"), "geschehe/geschiehst/geschieht/geschehen/gescheht");
ist("alt", beugeVerb("alt", "du"), null);
ist("dort", beugeVerb("dort", "wir"), null);
ist("jetzt", beugeVerb("jetzt", "ich"), null);
ist("Zeit", beugeVerb("Zeit", "du"), null);
ist("gesagt (Partizip)", beugeVerb("gesagt", "du"), null);
ist("gebracht (Partizip)", beugeVerb("gebracht", "wir"), null);
ist("geh\xF6rt ist aber ein Verb", p("geh\xF6rt"), "geh\xF6re/geh\xF6rst/geh\xF6rt/geh\xF6ren/geh\xF6rt");
ist("gelingt ebenso", p("gelingt"), "gelinge/gelingst/gelingt/gelingen/gelingt");
wahr("istVerbform: bemerkt", istVerbform("bemerkt"));
wahr("istVerbform: nicht \u201Aselbst\u2018", !istVerbform("selbst"));
wahr("istVerbform: nicht \u201ANacht\u2018", !istVerbform("Nacht"));
ist("Bringt \u2192 Bringst", beugeVerb("Bringt", "du"), "Bringst");
ist("Tr\xE4gt \u2192 Tragen", beugeVerb("Tr\xE4gt", "wir"), "Tragen");
console.log(`Pr\xFCfstand Verben \u2014 ${geprueft} Pr\xFCfungen, ${bestanden} bestanden`);
var proc = globalThis;
if (fails.length) {
  console.error(`
\u274C Verben: ${fails.length} Fehler:`);
  fails.forEach((f) => console.error("  - " + f));
  proc.process?.exit(1);
} else {
  console.log(`
\u2705 Verben: alle ${geprueft} Pr\xFCfungen bestanden.`);
}
