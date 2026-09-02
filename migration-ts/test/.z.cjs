"use strict";

// test/einfach.ts
var import_fs = require("fs");
var import_jsdom = require("jsdom");

// src/features/einfach.ts
var KOPF_FORMEN = [
  ["bericht", "Zeitungsbericht"],
  ["prose", "Prosa"],
  ["reim", "Reim"],
  ["haiku", "Haiku"]
];
var LAENGE_STUFEN = [70, 140, 260];
var LAENGE_NAMEN = ["kurz", "mittel", "lang"];
var REIBUNG_STUFEN = [1, 2, 3];
var REIBUNG_NAMEN = ["einstimmig", "gemischt", "weit auseinander"];
var PROBEN = [
  {
    teile: [["Der Wachmann notiert die Uhrzeit und schlie\xDFt das Tor.", 1]],
    register: [["Formalismus", 1]],
    fuss: "ein Register \xB7 geschlossen, sicher, vorhersehbar"
  },
  {
    teile: [
      ["Der Wachmann notiert die Uhrzeit.", 1],
      [" Die Frist beginnt mit einem Ereignis ohne Datum.", 2]
    ],
    register: [["Formalismus", 1], ["Hafen", 2]],
    fuss: "zwei Register \xB7 sie stehen nebeneinander"
  },
  {
    teile: [
      ["Die Unterlagen liegen vollst\xE4ndig vor", 1],
      [" \u2014 nur der Einsatz ist ein Kind, das nicht sterben durfte.", 2]
    ],
    register: [["Formalismus", 1], ["Griechische Trag\xF6die", 2], ["Bergwelt", 2]],
    fuss: "drei Register \xB7 sie treffen im selben Satz aufeinander"
  }
];
var SAAT_BEISPIELE = [
  "Ein Wachmann am Hafen, 1953.",
  "Eine Klinik, die den Namen wechselt.",
  "Zwei Becher auf einem Tisch in Edinburgh.",
  "Ein Zimmer, das im Plan nicht vorkommt.",
  "Der Bote bringt, was niemand h\xF6ren will."
];
var ORTS_WORT = /\b(?:am|an|auf|bei|im|in|vor|hinter|unter|über|neben|zwischen)\s+(?:der|dem|den|die|das|einem|einer|einen|eine|ein)?\s*(?:[a-zäöüß]+(?:e|en|er|em|es)\s+){0,2}[A-ZÄÖÜ][\wÄÖÜäöüß-]*(?:\s+[A-ZÄÖÜ][\wÄÖÜäöüß-]*)?(?:\s+(?:am|an|auf|bei|im|in|vor|hinter|unter|über|neben|zwischen|nach|ohne|mit)\s+(?:der|dem|den|die|das|einem|einer|einen|eine|ein)?\s*(?:[a-zäöüß]+(?:e|en|er|em|es)\s+){0,2}[A-ZÄÖÜ][\wÄÖÜäöüß-]*)*/u;
var JAHR = /\b(?:im Jahr\s+)?(1[0-9]{3}|20[0-9]{2})\b/u;
var VERBEN = "ist|sind|war|waren|wird|werden|hat|haben|kommt|kommen|geht|gehen|bringt|wechselt|verschwindet|beginnt|endet|steht|liegt|tr\xE4gt|nimmt|sucht|findet|verliert|\xF6ffnet|schlie\xDFt|entdeckt|verfolgt|st\xF6\xDFt|rekonstruiert|erbt|entziffert|verh\xF6rt|beantragt|erfindet|sammelt|z\xE4hlt|bewacht|notiert|verweigert|behauptet|vergisst|wartet|baut|schreibt|liest|ruft|fragt|schweigt|flieht|versteckt|vertauscht|\xFCbersetzt|repariert|kartiert|archiviert|h\xE4lt|zieht|bleibt|f\xE4llt|l\xE4uft|treibt|legt|setzt|stellt|zeigt|h\xF6rt|sieht|kennt|glaubt|meldet|warnt|bekommt|erh\xE4lt|muss|will|soll|l\xE4sst|macht|gibt|sagt|trifft|bemerkt|erkennt|erwacht|verspricht|weckt|verhandelt|l\xF6st|f\xFCllt|verklagt|bricht|kehrt|r\xE4umt|verpasst|beantwortet|k\xFCndigt|verschiebt|wacht|gr\xE4bt|gewinnt|verwaltet|beruft|optimiert|reformiert|privatisiert|digitalisiert|gr\xFCndet|tauscht|verkauft|folgt|spricht";
var VERB_ANFANG = new RegExp("^(?:" + VERBEN + ")\\b", "u");
var VERB_IRGENDWO = new RegExp("\\b(?:" + VERBEN + ")\\b", "u");
function findeHauptverb(rest) {
  const re = new RegExp("\\s(?:" + VERBEN + ")\\b", "gu");
  let m;
  while (m = re.exec(rest)) {
    const davor = rest.slice(0, m.index);
    const komma = davor.lastIndexOf(",");
    if (komma >= 0) {
      const abschnitt = davor.slice(komma + 1);
      if (/^\s*(der|die|das|den|dem|dessen|deren|was|wer|wo)\b/i.test(abschnitt) && !VERB_IRGENDWO.test(abschnitt)) continue;
    }
    return { index: m.index };
  }
  return null;
}
function zerlegeSaat(satz) {
  const roh = (satz || "").replace(/\s+/g, " ").trim().replace(/[.]$/, "");
  if (!roh) return { who: "", where: "", when: "", what: "" };
  let rest = roh;
  const j = JAHR.exec(rest);
  const when = j ? `im Jahr ${j[1]}` : "";
  if (j) rest = (rest.slice(0, j.index) + rest.slice(j.index + j[0].length)).replace(/\s*,\s*$/, "").trim();
  const o = ORTS_WORT.exec(rest);
  const where = o ? o[0].replace(/\s+/g, " ").trim() : "";
  if (o) rest = (rest.slice(0, o.index) + rest.slice(o.index + o[0].length)).replace(/\s{2,}/g, " ").trim();
  rest = rest.replace(/\s{2,}/g, " ").replace(/[,;]\s*$/, "").replace(/,\s*(?=[a-zäöüß])/, ", ").trim();
  const v = findeHauptverb(rest);
  let who = (v ? rest.slice(0, v.index) : rest).replace(/,\s*$/, "").trim();
  let what = v ? rest.slice(v.index).trim() : "";
  const inversion = /^(wo|was|wer|wie|warum|wann|wohin|woher|weshalb|wieso|wem|wen|dann|heute|gestern|morgen|vielleicht|manchmal|plötzlich|nachts|abends|morgens|dort|hier|jetzt|später|nie|immer|bald|endlich|irgendwo|irgendwann|so)$/i;
  if (v && (inversion.test(who) || /\?$/.test(roh))) {
    what = rest.trim();
    who = "";
  }
  return { who, where, when, what };
}
function kopfKontext(saat, wurf, alt) {
  const w = (k) => (saat[k] || wurf[k] || alt[k] || "").trim();
  return { who: w("who"), where: w("where"), when: w("when"), what: (saat.what || alt.what || "").trim() };
}
function stellung(w) {
  const i = (n, max) => Math.max(0, Math.min(max, Math.round(n) || 0));
  return {
    form: KOPF_FORMEN[i(w.form, KOPF_FORMEN.length - 1)][0],
    lenTarget: LAENGE_STUFEN[i(w.laenge, LAENGE_STUFEN.length - 1)],
    presets: REIBUNG_STUFEN[i(w.reibung, REIBUNG_STUFEN.length - 1)],
    ctx: zerlegeSaat(w.saat)
  };
}
function poolSaetze(phrasen) {
  const raus = [];
  for (const p of phrasen) {
    const t = (p || "").replace(/\s+/g, " ").trim().replace(/[.!?…]+$/, "");
    if (t.length < 18 || t.length > 70 || !/\s/.test(t)) continue;
    raus.push(t.charAt(0).toUpperCase() + t.slice(1) + ".");
  }
  return [...new Set(raus)];
}
function weltSatz(welt) {
  if (!welt || !welt.who) return null;
  const wer = welt.who.trim().charAt(0).toUpperCase() + welt.who.trim().slice(1);
  const ort = welt.where && ORTS_WORT.test(welt.where) ? ` ${welt.where.trim()}` : "";
  const tat = welt.what && VERB_ANFANG.test(welt.what.trim()) ? ` ${welt.what.trim()}` : "";
  const passt = (s) => {
    const z = zerlegeSaat(s);
    if (ort && s.includes(ort) && z.where !== welt.where.trim()) return false;
    if (tat && s.includes(tat) && z.what !== welt.what.trim().replace(/[.]$/, "")) return false;
    return true;
  };
  const kandidaten = [`${wer}${ort}${tat}.`, `${wer}${tat}.`, `${wer}${ort}.`, `${wer}.`];
  return kandidaten.find(passt) || `${wer}.`;
}
function saatVorrat(phrasen, welt) {
  const raus = [...SAAT_BEISPIELE, ...poolSaetze(phrasen)];
  const s = weltSatz(welt);
  if (s && !raus.includes(s)) raus.push(s);
  return [...new Set(raus)];
}
function ziehSaat(phrasen, weltZieher, meiden = [], rnd = Math.random) {
  const frisch = (a2) => a2.filter((x) => !meiden.includes(x));
  const pool = frisch(poolSaetze(phrasen));
  const welt = [];
  for (let i = 0; i < 5 && welt.length < 3; i++) {
    const s = weltSatz(weltZieher());
    if (s && !meiden.includes(s) && !welt.includes(s)) welt.push(s);
  }
  const beispiele = frisch([...SAAT_BEISPIELE]);
  const wahl = rnd();
  const aus = (a2) => a2[Math.min(a2.length - 1, Math.floor(rnd() * a2.length))];
  if (welt.length && wahl < 0.5) return aus(welt);
  if (pool.length && wahl < 0.9) return aus(pool);
  if (beispiele.length && wahl >= 0.9) return aus(beispiele);
  if (welt.length) return aus(welt);
  if (pool.length) return aus(pool);
  if (beispiele.length) return aus(beispiele);
  return SAAT_BEISPIELE[0];
}
var KOPF_KEY = "divergenz_einfach_v1";
var VORGABE = { form: 1, laenge: 1, reibung: 1, saat: SAAT_BEISPIELE[0], einfach: true };
function probeAus(phrasen, stufe, versatz = 0) {
  const gut = phrasen.map((p) => p.replace(/\s+/g, " ").trim().replace(/[.!?…]+$/, "")).filter((p) => p.length >= 18 && p.length <= 90 && /\s/.test(p));
  if (gut.length < 2) return null;
  const s = Math.max(0, Math.min(2, Math.round(stufe)));
  const v = (Math.round(versatz) % gut.length + gut.length) % gut.length;
  const a2 = gut[v];
  const b2 = gut[(v + 1 + s) % gut.length];
  const satz = (t) => t.charAt(0).toUpperCase() + t.slice(1) + ".";
  if (s === 0) {
    return {
      teile: [[satz(a2), 1]],
      register: [["dein Material", 1]],
      fuss: "ein Register \xB7 geschlossen, sicher, vorhersehbar"
    };
  }
  if (s === 1) {
    return {
      teile: [[satz(a2), 1], [" " + satz(b2), 2]],
      register: [["dein Material", 1], ["zweite Bank", 2]],
      fuss: "zwei Register \xB7 sie stehen nebeneinander"
    };
  }
  return {
    teile: [[a2.charAt(0).toUpperCase() + a2.slice(1), 1], [" \u2014 " + b2 + ".", 2]],
    register: [["dein Material", 1], ["zweite Bank", 2], ["dritte Bank", 2]],
    fuss: "drei Register \xB7 sie treffen im selben Satz aufeinander"
  };
}

// src/generation/optionen.ts
var FORM_OPTS = [
  ["prose", "Prosa"],
  ["poem", "Prosagedicht"],
  ["strang", "Gedicht-Strang"],
  ["reim", "Reim"],
  ["haiku", "Haiku"],
  ["script", "Szene/Dialog"],
  ["video", "Multi-Shot (Video)"],
  ["bericht", "Bericht (Zeitung)"],
  ["meldung", "Meldung (kurz)"]
];

// test/einfach.ts
var dom = new import_jsdom.JSDOM("<!doctype html><html><body></body></html>", { url: "https://x.test/" });
globalThis.localStorage = dom.window.localStorage;
var fails = [];
var zeilen = [];
var geprueft = 0;
var ist = (name, wert, soll) => {
  geprueft++;
  if (wert === soll) zeilen.push(`  \u2713 ${name}`);
  else {
    zeilen.push(`  \u2717 ${name}`);
    fails.push(`${name}: \u201E${String(wert)}\u201C \u2014 erwartet \u201E${String(soll)}\u201C`);
  }
};
var wahr = (name, b2) => ist(name, b2, true);
var a = zerlegeSaat("Ein Wachmann am Hafen, 1953.");
ist("die Figur wird erkannt", a.who, "Ein Wachmann");
ist("der Ort auch", a.where, "am Hafen");
ist("und die Zeit", a.when, "im Jahr 1953");
var b = zerlegeSaat("Der Bote bringt, was niemand h\xF6ren will.");
ist("ohne Ort und Zeit bleibt die Figur", b.who, "Der Bote");
ist("und der Vorgang steht im Was", b.what, "bringt, was niemand h\xF6ren will");
for (const s of SAAT_BEISPIELE) {
  const v = zerlegeSaat(s);
  const alle = [v.who, v.where, v.when, v.what].join("|");
  wahr(`kein doppeltes Leerzeichen bei \u201E${s.slice(0, 28)}\u2026\u201C`, !/ {2}/.test(alle));
  wahr("und kein h\xE4ngendes Komma", !/[,;]\s*$/.test(v.who));
}
ist("ohne Verb kein erfundenes Was", zerlegeSaat("Nur ein Wort").what, "");
ist("ein leerer Satz ergibt leere Felder", zerlegeSaat("").who, "");
ist("und st\xFCrzt nicht ab", typeof zerlegeSaat("").what, "string");
var st = stellung({ form: 0, laenge: 2, reibung: 2, saat: "Ein Wachmann am Hafen, 1953." });
ist("die Form kommt aus der Wahl", st.form, KOPF_FORMEN[0][0]);
ist("die L\xE4nge aus der Stufe", st.lenTarget, LAENGE_STUFEN[2]);
ist("die Reibung ergibt drei Presets", st.presets, REIBUNG_STUFEN[2]);
ist("und der Kontext ist zerlegt", st.ctx.where, "am Hafen");
ist(
  "ein zu gro\xDFer Index wird geklammert",
  stellung({ form: 99, laenge: 99, reibung: 99, saat: "" }).form,
  KOPF_FORMEN[KOPF_FORMEN.length - 1][0]
);
ist("ein negativer auch", stellung({ form: -5, laenge: -5, reibung: -5, saat: "" }).lenTarget, LAENGE_STUFEN[0]);
for (const [f] of KOPF_FORMEN) {
  wahr(`die Form \u201E${f}\u201C steht in den Reglerlisten`, FORM_OPTS.some(([v]) => v === f));
}
ist("es gibt drei L\xE4ngenstufen", LAENGE_STUFEN.length, LAENGE_NAMEN.length);
ist("und drei Reibungsstufen", REIBUNG_STUFEN.length, REIBUNG_NAMEN.length);
ist("zu jeder Reibungsstufe gibt es eine Probe", PROBEN.length, REIBUNG_STUFEN.length);
wahr("die erste Probe hat ein Register", PROBEN[0].register.length === 1);
wahr("die letzte hat mehr", PROBEN[2].register.length > PROBEN[0].register.length);
wahr("und zwei Farben im Satz", PROBEN[2].teile.some(([, r]) => r === 2));
ist("die erste Probe hat nur eine Farbe", PROBEN[0].teile.every(([, r]) => r === 1), true);
wahr("die Wahl wandert in die Projektdatei", KOPF_KEY.startsWith("divergenz_"));
var q = (0, import_fs.readFileSync)("src/ui/studio.ts", "utf8");
var block = q.slice(q.indexOf("const kopfLos"), q.indexOf("const reihe = (marke"));
wahr("der Kopf setzt die echte Form", /form\.value = st\.form/.test(block));
wahr("und l\xF6st aus", /form\.dispatchEvent\(new Event\("change"\)\)/.test(block));
wahr("er setzt den echten L\xE4ngenschieber", /lenSlider\.value = String\(st\.lenTarget\)/.test(block));
wahr("und l\xF6st auch dort aus", /lenSlider\.dispatchEvent/.test(block));
wahr("er schreibt in die vier W", /feld\.dispatchEvent\(new Event\("input"\)\)/.test(block));
var reibBlock = q.slice(q.indexOf('reibungIn.addEventListener("input"'), q.indexOf("// Studio -> Kopf"));
wahr("der Regler schreibt sofort in die echte Auswahl", /applySelection\(ids\)/.test(reibBlock));
wahr("ohne Auswahl zieht er gespreizt", /waehleGespreizt\(vorrat, ziel\)/.test(reibBlock));
wahr("beim Runterdrehen bleibt Angekreuztes stehen", /ids\.slice\(0, ziel\)/.test(reibBlock));
wahr("beim Hochdrehen wird nach Mischabstand erg\xE4nzt", /ergaenzeGespreizt\(ids, ziel, vorrat\)/.test(reibBlock));
var blaetterBlock = q.slice(q.indexOf('probeBox.addEventListener("click"'), q.indexOf("const kopfLos"));
wahr("weiterbl\xE4ttern stellt das n\xE4chste Register ein", /applySelection\(ergaenzeGespreizt\(/.test(blaetterBlock));
wahr("und h\xE4lt am Preset-Schloss an", /locked\.has\(preset\.id\)/.test(blaetterBlock));
wahr("und der Erzeugen-Knopf w\xFCrfelt nicht mehr um", !/waehleGespreizt\(vorrat, st\.presets\)/.test(block));
for (const feld of ["form", "lenSlider"]) {
  wahr(`ein Schloss auf \u201E${feld}\u201C h\xE4lt`, new RegExp(`locked\\.has\\(${feld}\\.id\\)`).test(block));
}
wahr("ein Schloss auf \u201Epreset\u201C h\xE4lt (am Reibungsregler)", /locked\.has\(preset\.id\)/.test(reibBlock));
wahr("auch auf den vier W", /locked\.has\(feld\.id\)/.test(block));
ist(
  "der Kopf f\xFChrt keine eigenen Reglerwerte",
  /divergenz_einfach_v1[\s\S]{0,400}tone|rhythm|structure/.test((0, import_fs.readFileSync)("src/features/einfach.ts", "utf8").slice(0, 200)),
  false
);
{
  const z1 = zerlegeSaat("Eine Uhrmacherin in einer schlaflosen Stadt");
  ist("ein Ort mit kleingeschriebenem Adjektiv wird erkannt", z1.where, "in einer schlaflosen Stadt");
  ist("\u2026 und die Figur bleibt sauber", z1.who, "Eine Uhrmacherin");
  const z2 = zerlegeSaat("Ein Wachmann in einer kleinen Stadt h\xE4lt den Verband");
  ist("das gemeldete Blatt-Beispiel zerf\xE4llt jetzt richtig", z2.where, "in einer kleinen Stadt");
  ist("\u2026 mit dem Vorgang im Was", z2.what, "h\xE4lt den Verband");
  const z3 = zerlegeSaat("Eine Archivarin entdeckt ein zweites Testament");
  ist("die Welt-Verben trennen Figur und Vorgang", z3.what, "entdeckt ein zweites Testament");
  const z4 = zerlegeSaat("Ein Kind, das nur nachts spricht entdeckt ein Signal aus dem Nichts");
  ist("ein Relativsatz-Verb trennt nicht", z4.who, "Ein Kind, das nur nachts spricht");
  ist("\u2026 erst das Hauptverb danach", z4.what, "entdeckt ein Signal aus dem Nichts");
  const z5 = zerlegeSaat("Eine Klinik, die den Namen wechselt");
  ist("ein reiner Relativsatz bleibt ganz in der Figur", z5.who, "Eine Klinik, die den Namen wechselt");
  ist("\u2026 und erfindet kein Was", z5.what, "");
  const mitRelativ = saatVorrat([], { who: "ein Kind, das nur nachts spricht", where: "in einem Museum nach Schlie\xDFung", when: "", what: "entdeckt ein zweites Testament" });
  const rs = mitRelativ.find((v) => v.includes("Kind"));
  wahr("die Relativsatz-Figur bekommt ihren Satz", !!rs);
  const rz = zerlegeSaat(rs || "");
  ist("\u2026 und er zerf\xE4llt richtig: der Ort", rz.where, "in einem Museum nach Schlie\xDFung");
  ist("\u2026 der Vorgang", rz.what, "entdeckt ein zweites Testament");
  const vorrat = saatVorrat(
    ["ein Rad, das sich ohne Achse dreht", "zu kurz", "x".repeat(90)],
    { who: "eine Kartographin ohne Karten", where: "in einem verlassenen Bahnhof", when: "kurz vor Mitternacht", what: "entdeckt ein zweites Testament" }
  );
  wahr("die festen Beispiele bleiben der Boden", SAAT_BEISPIELE.every((b2) => vorrat.includes(b2)));
  wahr("Pool-Phrasen kommen gro\xDFgeschrieben und mit Punkt", vorrat.includes("Ein Rad, das sich ohne Achse dreht."));
  wahr("zu kurze Schnipsel bleiben drau\xDFen", !vorrat.some((v) => v.includes("zu kurz")));
  wahr("\xFCberlange auch", !vorrat.some((v) => /xxxxx/.test(v)));
  const weltSatz2 = vorrat.find((v) => v.includes("Kartographin"));
  wahr("die Welt liefert einen Satz", !!weltSatz2);
  const rueck = zerlegeSaat(weltSatz2 || "");
  ist("\u2026 den die eigene Zerlegung wieder auseinanderbekommt: der Ort", rueck.where, "in einem verlassenen Bahnhof");
  ist("\u2026 und der Vorgang", rueck.what, "entdeckt ein zweites Testament");
  const ohne = saatVorrat([], { who: "ein Bote", where: "am Hafen", when: "", what: "zerbr\xF6selt jede Gewissheit" });
  wahr("unzerlegbare Vorg\xE4nge bleiben drau\xDFen", !ohne.some((v) => v.includes("zerbr\xF6selt")));
}
{
  const POOL = ["ein Rad, das sich ohne Achse dreht", "eine Karte ohne Norden liegt aus"];
  const WELT = { who: "eine Uhrmacherin", where: "am Hafen", when: "", what: "entdeckt ein zweites Testament" };
  const rndFolge = (...w) => {
    let i = 0;
    return () => w[i++ % w.length];
  };
  const zug1 = ziehSaat(POOL, () => WELT, [], rndFolge(0.1, 0));
  wahr("unter 0,5 kommt die Welt", zug1.includes("Uhrmacherin"));
  const zug2 = ziehSaat(POOL, () => WELT, [], rndFolge(0.7, 0));
  wahr("zwischen 0,5 und 0,9 der Pool", zug2.includes("Rad") || zug2.includes("Karte"));
  const zug3 = ziehSaat(POOL, () => WELT, [], rndFolge(0.95, 0));
  wahr("dar\xFCber die Beispiele", SAAT_BEISPIELE.includes(zug3));
  const zug4 = ziehSaat([], () => WELT, [], rndFolge(0.7, 0));
  wahr("ohne Pool f\xE4llt der Zug an die Welt", zug4.includes("Uhrmacherin"));
  const gemieden = ziehSaat(POOL, () => WELT, [zug2], rndFolge(0.7, 0, 0.7, 0));
  wahr("das Gemiedene kommt nicht wieder", gemieden !== zug2);
  let beispiele = 0;
  for (let i = 0; i < 400; i++) if (SAAT_BEISPIELE.includes(ziehSaat(POOL, () => WELT))) beispiele++;
  wahr(`die Beispiele bleiben unter 20 % (${Math.round(beispiele / 4)} %)`, beispiele / 400 < 0.2);
}
var PH = [
  "Die Unterlagen liegen vollst\xE4ndig vor",
  "der Einsatz ist ein Kind das nicht sterben durfte",
  "die Frist beginnt mit einem Ereignis ohne Datum"
];
var p0 = probeAus(PH, 0);
var p2 = probeAus(PH, 2);
wahr("aus eigenem Material entsteht eine Probe", !!p0);
ist("bei Stufe null ein Register", p0.register.length, 1);
wahr("und eine Farbe", p0.teile.every(([, r]) => r === 1));
wahr("bei Stufe zwei mehrere Register", p2.register.length > 1);
wahr("und zwei Farben im selben Satz", p2.teile.some(([, r]) => r === 2));
wahr("die Phrasen stehen wirklich drin", p2.teile.map(([t]) => t).join("").includes("Unterlagen"));
for (const s2 of [0, 1, 2]) {
  const t = probeAus([
    "ein Ritterhandschuh im Regen",
    "eine Ersch\xFCtterung ohne Namen",
    "die Frist beginnt ohne Datum"
  ], s2).teile.map(([x]) => x).join("");
  wahr(`Stufe ${s2} beginnt gross`, /^[A-ZÄÖÜ]/.test(t));
  ist(`Stufe ${s2} hat keinen kleinen Satzanfang`, /[.!?] [a-zäöü]/.test(t), false);
}
ist("eine Phrase reicht nicht", probeAus(["Nur eine Phrase hier drin"], 2), null);
ist("gar keine auch nicht", probeAus([], 1), null);
ist("zu kurze Schnipsel z\xE4hlen nicht", probeAus(["kurz", "auch"], 1), null);
var P4 = [...PH, "ein Zimmer das im Plan nicht vorkommt"];
var s0 = probeAus(P4, 1, 0).teile.map(([t]) => t).join("");
var s1 = probeAus(P4, 1, 1).teile.map(([t]) => t).join("");
wahr("ein Druck zeigt anderes Material", s0 !== s1);
ist("und am Ende laeuft es um", probeAus(P4, 1, P4.length).teile.map(([t]) => t).join(""), s0);
ist("ein negativer Versatz stuerzt nicht ab", typeof probeAus(P4, 1, -3), "object");
wahr("die Probe ist anklickbar", /button\.ek-probe\{/.test((0, import_fs.readFileSync)("src/ui/theme.css", "utf8")));
wahr("und der Klick blaettert weiter", /probeVersatz\+\+;/.test(q));
wahr("sie nennt die WIRKLICH aktiven Presets", /const aktivName = aktivePresetIds\(\)/.test(q));
ist(
  "dieselbe Stufe ergibt dieselbe Probe",
  JSON.stringify(probeAus(PH, 1)),
  JSON.stringify(probeAus(PH, 1))
);
var iForm = q.indexOf("form.value = st.form");
wahr("die Form wird gesetzt", iForm > 0);
wahr("Erzeugen w\xFCrfelt die \xFCbrigen Regler", /for \(const s of ROLL_SELECTS\)/.test(block));
wahr("\u2026 aber nicht Form, Preset oder Ressort", /s === form \|\| s === preset \|\| s === ressort/.test(block));
wahr("\u2026 und das Ressort geht auf Auto", /ressort\.value = "auto"/.test(block));
wahr("die Studio-Auswahl zieht den Regler nach", /kopfPresetSync\?\.\(\);/.test(q));
wahr("auch ohne change-Ereignis (Mehrfachauswahl)", /kopfPresetSync = \(\): void =>/.test(q));
wahr("die Formen heissen jetzt anders", KOPF_FORMEN.some(([f]) => f === "reim"));
ist("und Gedicht ist nicht mehr dabei", KOPF_FORMEN.some(([f]) => f === "poem"), false);
wahr("das Haiku ist dabei", KOPF_FORMEN.some(([f]) => f === "haiku"));
ist("und die Szene nicht mehr", KOPF_FORMEN.some(([f]) => f === "script"), false);
wahr("das Saatfeld hat einen Loeschknopf", /class: "ek-weg"/.test(q));
wahr("und er leert wirklich", /saatIn\.value = ""; kopfWahl\.saat = ""/.test(q));
var kq = q.slice(q.indexOf("const zeigeSchloesser"), q.indexOf("const kopfLos"));
wahr("gesperrte Formchips sind wirklich gesperrt", /\.disabled = fSperr/.test(kq));
wahr("und der Klick greift gar nicht erst", /if \(locked\.has\(form\.id\)\) return;/.test(q));
wahr("der Laengenschieber ebenso", /laengeIn\.disabled = true/.test(kq));
wahr("der Reibungsschieber ebenso", /reibungIn\.disabled = true/.test(kq));
wahr("es gibt einen Hinweis", /gesperrtHinweis\.textContent = \(fest\.length/.test(kq));
wahr(
  "die Chips folgen dem echten Regler",
  /const iJetzt = KOPF_FORMEN\.findIndex\(\(\[f\]\) => f === form\.value\)/.test(kq)
);
wahr("und ein Chipklick zieht ihn mit", /form\.value = KOPF_FORMEN\[i\]!\[0\]/.test(q));
wahr("eine fremde Form bekommt einen eigenen Satz", /diese Form bietet der Kopf nicht an/.test(kq));
wahr("er nennt die betroffenen Regler", /fest\.join\(", "\)/.test(kq));
wahr("und sagt, wo das Schloss steht", /alle Regler zeigen/.test(kq));
wahr("der Kopf haengt an der Schloss-Anzeige", /lockPainters\[c\.id\] \|\|= \[\]/.test(q));
wahr("und wird beim Aufbau einmal gezeichnet", /\n  zeigeSchloesser\(\);/.test(q));
wahr("ohne Schloss bleibt alles frei", /laengeIn\.disabled = false/.test(kq));
wahr("auch die Reibung", /reibungIn\.disabled = false/.test(kq));
wahr("er sitzt im Studio", /wrap\.prepend\(kopf\)/.test(q));
ist("der einfache Modus ist die Vorgabe", VORGABE.einfach, true);
wahr("und er blendet den Reglerkasten aus", /studio-einfach/.test(q));
wahr("die Umschaltung ist ein Knopf, kein Aufklapper", /umschalter\.addEventListener\("click"/.test(q));
ist("kein details/summary mehr", /class: "ek-kopf", open/.test(q), false);
wahr(
  "das Stilblatt blendet alles au\xDFer dem Kopf aus",
  /\.studio-einfach > \*:not\(\.ek-kopf\)\{display:none\}/.test((0, import_fs.readFileSync)("src/ui/theme.css", "utf8"))
);
wahr("der Knopf \xF6ffnet den Leser", /openReader\(out\.textContent/.test(q));
wahr("aber nur im einfachen Modus", /if \(kopfWahl\.einfach\) \{[\s\S]{0,120}openReader/.test(q));
wahr("und gibt die vier W mit", /who: who\.value, where: where\.value/.test(q));
wahr("die Probe zieht lebendiges Material heran", /probeAus\(liveTexts\(\)/.test(q));
wahr("und f\xE4llt sonst auf das Muster zur\xFCck", /\?\? PROBEN\[/.test(q));
ist(
  "und ist kein eigener Reiter",
  /\["Einfach", mount/.test((0, import_fs.readFileSync)("src/ui/app.ts", "utf8")),
  false
);
{
  const f = zerlegeSaat("Wo ist Gott?");
  ist("eine Frage ist ganz der Vorgang", f.what, "Wo ist Gott?");
  ist("und die Figur bleibt leer", f.who, "");
  const d = zerlegeSaat("Dann kommt der Bote.");
  ist("ein Adverb vor dem Verb ist keine Figur", d.who, "");
  ist("der ganze Satz ist der Vorgang", d.what, "Dann kommt der Bote");
  const b2 = zerlegeSaat("Der Bote bringt, was niemand h\xF6ren will.");
  ist("Figur bleibt Figur", b2.who, "Der Bote");
  const k = kopfKontext(f, { who: "Eine Uhrmacherin", where: "im Hafen", when: "im Jahr 1911" }, { who: "Alt", where: "", when: "", what: "" });
  ist("die Figur kommt aus dem Wurf", k.who, "Eine Uhrmacherin");
  ist("der Vorgang bleibt die Frage", k.what, "Wo ist Gott?");
}
wahr("es gibt den Einf\xFCgeknopf", /class: "ek-einfuegen"/.test(q));
wahr("er steht neben dem Leeren in der Wovon-Reihe", /saatIn, saatWeg, saatEin, saatWuerfel/.test(q));
wahr("er liest die Zwischenablage", /navigator\.clipboard\?\.readText\?\.\(\)/.test(q));
wahr("und setzt den Fokus, wenn das Lesen versagt", /\.catch\(\(\) => \{ saatIn\.focus\(\); \}\)/.test(q));
wahr("der Inhalt landet in der Wahl und im Feld", /saatIn\.value = t; kopfWahl\.saat = t; sichereKopfWahl\(kopfWahl\)/.test(q));
{
  const alt = { who: "Alte Figur", where: "im alten Ort", when: "gestern", what: "schl\xE4ft" };
  const wurf = { who: "Eine Uhrmacherin", where: "in einer Werkstatt", when: "im Jahr 1911", what: "erbt eine Uhr" };
  const k1 = kopfKontext(zerlegeSaat("Der Bote bringt, was niemand h\xF6ren will."), wurf, alt);
  ist("das Was kommt aus der Saat", k1.what, "bringt, was niemand h\xF6ren will");
  ist("die Figur aus der Saat bleibt", k1.who, "Der Bote");
  ist("der Ort wird gew\xFCrfelt", k1.where, "in einer Werkstatt");
  ist("die Zeit wird gew\xFCrfelt", k1.when, "im Jahr 1911");
  ist("der Wurf \xFCberschreibt das Was nicht", k1.what === wurf.what, false);
  const k2 = kopfKontext(zerlegeSaat("Ein Wachmann am Hafen, 1953."), wurf, alt);
  ist("ein genannter Ort bleibt", k2.where, "am Hafen");
  ist("eine genannte Zeit bleibt", k2.when, "im Jahr 1953");
  ist("eine genannte Figur bleibt", k2.who, "Ein Wachmann");
  ist("ohne Verb bleibt das alte Was", k2.what, "schl\xE4ft");
  const k3 = kopfKontext(zerlegeSaat("Der Bote bringt, was niemand h\xF6ren will."), {}, alt);
  ist("leerer Wurf \u2192 alter Ort", k3.where, "im alten Ort");
  ist("leerer Wurf \u2192 alte Zeit", k3.when, "gestern");
}
wahr('\u201EText erzeugen" w\xFCrfelt die drei W aus der Welt', /const wurf = [\s\S]{0,120}worldFillContext\(\)[\s\S]{0,200}kopfKontext\(st\.ctx, wurf/.test(q));
console.log(`Pr\xFCfstand einfacher Kopf \u2014 ${geprueft} Pr\xFCfungen:`);
zeilen.forEach((z) => console.log(z));
var proc = globalThis;
if (fails.length) {
  console.error(`
\u274C ${fails.length} Fehler im einfachen Kopf:`);
  fails.forEach((f) => console.error("  - " + f));
  proc.process?.exit(1);
} else {
  console.log(`
\u2705 Einfacher Kopf: alle ${geprueft} Pr\xFCfungen bestanden.`);
}
