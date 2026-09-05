"use strict";

// test/bildsammler.ts
var import_fs = require("fs");

// src/features/lehrer.ts
function schaetzeTokens(text) {
  const s = text || "";
  if (!s) return 0;
  return Math.ceil(s.length / 3);
}
var MODELLE = [
  { id: "claude-haiku-4-5", name: "Haiku 4.5 \u2014 am g\xFCnstigsten", ein: 1, aus: 5 },
  { id: "claude-sonnet-5", name: "Sonnet 5 \u2014 Mittelweg", ein: 2, aus: 10 },
  { id: "claude-opus-5", name: "Opus 5 \u2014 am teuersten", ein: 5, aus: 25 }
];

// src/features/bildsammler.ts
function bildTokens(b, h) {
  if (!(b > 0) || !(h > 0)) return 0;
  return Math.round(b * h / 750);
}
var VERRAETER = [
  /\b(?:das|dieses|auf dem|im)\s+(?:bild|foto|photo|motiv)\b/i,
  /\b(?:bild|foto|photo|aufnahme|abbildung|szene)(?:es|s|er|n)?\s+zeigt\b/i,
  /\bzu sehen ist\b/i,
  /\bman (?:sieht|erkennt|blickt)\b/i,
  /\b(?:im|in den|aus dem)\s+(?:vorder|hinter|mittel)grund\b/i,
  /\bder betrachter\b/i,
  /\b(?:abgebildet|fotografiert|aufgenommen|dargestellt)\b/i,
  /\b(?:links|rechts|oben|unten|mittig)\s+(?:im|am)\s+(?:bild|rand)\b/i,
  /\bbild(?:aus|auf)schnitt\b/i,
  /\bim bildzentrum\b/i,
  /\bkamera\b/i,
  /\bperspektive\s+(?:des|der)\b/i
];
function verraetBild(satz) {
  return VERRAETER.some((r) => r.test(satz || ""));
}
function taugtSatz(s, min = 20, max = 260) {
  const t = (s || "").trim();
  if (t.length < min || t.length > max) return false;
  if (verraetBild(t)) return false;
  if (!/\s[a-zäöüß]{2,}/.test(t)) return false;
  return (t.match(/\S+/g) || []).length >= 4;
}
var ARTIKEL = new RegExp(
  "\\b(?:der|die|das|den|dem|des|ein|eine|einen|einem|einer|eines|am|im|zum|zur|vom|beim|ins|ans|aufs|f\xFCrs|durchs|ums|dies|diese[rmns]?|jene[rmns]?|jede[rmns]?|manche[rmns]?|solche[rmns]?|alle[rmns]?|beide[rn]?|welche[rmns]?|keine?[rmns]?|mein|dein|sein|ihr|unser|euer|meine[rmns]?|deine[rmns]?|seine[rmns]?|ihre[rmns]?|unsere[rmns]?|eure[rmns]?)\\b",
  "i"
);
function wirktVerkuerzt(satz) {
  const t = (satz || "").trim();
  const woerter = t.match(/\S+/g) || [];
  if (woerter.length < 5) return false;
  if (ARTIKEL.test(t)) return false;
  const grosse = woerter.slice(1).filter((w) => /^[A-ZÄÖÜ]/.test(w)).length;
  return grosse >= 2;
}
function beute(saetze) {
  const behalten = [], verworfen = [];
  const gesehen = /* @__PURE__ */ new Set();
  for (const roh of saetze || []) {
    const s = String(roh || "").trim().replace(/\s+/g, " ");
    if (!s) continue;
    const schluessel = s.toLowerCase();
    if (gesehen.has(schluessel)) {
      verworfen.push(s);
      continue;
    }
    gesehen.add(schluessel);
    if (!taugtSatz(s)) {
      verworfen.push(s);
      continue;
    }
    behalten.push({
      satz: s,
      zweifel: wirktVerkuerzt(s) ? "wirkt verk\xFCrzt \u2014 ohne Artikel zerf\xE4llt der Satz beim Neuzusammensetzen" : ""
    });
  }
  return { behalten, verworfen };
}
var SAETZE_VORGABE = 12;
function bauePrompt(anzahl = SAETZE_VORGABE, hinweis = "") {
  const n = Math.max(3, Math.min(40, Math.round(anzahl) || SAETZE_VORGABE));
  const h = (hinweis || "").trim();
  return `Du lieferst Rohmaterial f\xFCr einen deutschsprachigen Textgenerator. Du bekommst ein Bild. Schreibe daraus S\xE4tze, die als Sprachmaterial taugen.

H\xC4RTESTE REGEL: Jeder Satz muss ohne das Bild stehen k\xF6nnen. Es darf kein Wort darauf hinweisen, dass es ein Bild gibt. Verboten sind daher: \u201Edas Bild zeigt\u201C, \u201Ezu sehen ist\u201C, \u201Eman sieht\u201C, \u201Eim Vordergrund\u201C, \u201Eim Hintergrund\u201C, \u201Eder Betrachter\u201C, \u201Eabgebildet\u201C, \u201Eaufgenommen\u201C, \u201EKamera\u201C, \u201Elinks im Bild\u201C und alles Vergleichbare. Ein Satz, der solche Wendungen enth\xE4lt, wird verworfen und war umsonst.

Schreibe n\xFCchtern und benennend, NICHT literarisch. Keine Deutung, keine Stimmung, keine Metaphern, keine Adjektivketten. Dinge, Stoffe, Licht, Abnutzung, Gesten, Wetter, Tageszeit, Kleidung, Ger\xE4usche, die dazugeh\xF6ren \u2014 benannt, nicht ausgeschm\xFCckt. Die Fremdheit stellt die Maschine selbst her; Material, das schon sch\xF6n ist, nimmt ihr die Arbeit ab.

N\xDCCHTERN HEISST NICHT VERK\xDCRZT. Schreibe vollst\xE4ndige S\xE4tze mit Artikeln, Pr\xE4positionen und gebeugten Verben. Kein Telegrammstil, keine Stichworte, keine Bildunterschriften.
  FALSCH: \u201EMann sitzt auf Bank und h\xE4lt Hut.\u201C
  RICHTIG: \u201EDer Mann sitzt auf der Bank und h\xE4lt den Hut in der Hand.\u201C
Der Grund: Die S\xE4tze werden von einer Maschine zerlegt und neu zusammengesetzt. Artikel, Pr\xE4positionen und Endungen sind die Scharniere, an denen sie umsteigt. Ein Satz ohne sie zerf\xE4llt beim ersten Schnitt in Bruchst\xFCcke, die sich nicht mehr f\xFCgen lassen \u2014 er ist als Material wertlos, so richtig er auch gemeint war.

Liefere ${n} kurze S\xE4tze, jeder 5 bis 25 W\xF6rter, jeder f\xFCr sich stehend, keine Aufz\xE4hlungen.

Dazu vier Angaben f\xFCr den Kontext, jede h\xF6chstens sechs W\xF6rter, jede ohne Bildbezug:
- who: wer vorkommt (Person, Rolle, Tier \u2014 ohne Namen zu erfinden)
- where: der Ort
- when: die Zeit (Tageszeit, Jahreszeit, Epoche \u2014 nur wenn erkennbar)
- what: was geschieht
Ist etwas nicht erkennbar, gib eine leere Zeichenkette. Rate nicht.
` + (h ? `
Zus\xE4tzliche Vorgabe des Nutzers (vorrangig): ${h}
` : "") + '\nAntworte mit reinem JSON, beginnend mit { und endend mit }: {"saetze": ["\u2026"], "ctx": {"who": "\u2026", "where": "\u2026", "when": "\u2026", "what": "\u2026"}}. Keine Erkl\xE4rung, kein Markdown.';
}
function leseErnte(roh) {
  const leer = { saetze: [], ctx: { who: "", where: "", when: "", what: "" } };
  if (!roh || typeof roh !== "object") return leer;
  const o = roh;
  const saetze = Array.isArray(o.saetze) ? o.saetze.filter((s) => typeof s === "string") : [];
  const c = o.ctx && typeof o.ctx === "object" ? o.ctx : {};
  const feld = (k) => {
    const v = typeof c[k] === "string" ? c[k].trim().replace(/\s+/g, " ") : "";
    if (!v || verraetBild(v)) return "";
    return v.slice(0, 80);
  };
  return { saetze, ctx: { who: feld("who"), where: feld("where"), when: feld("when"), what: feld("what") } };
}
function maxToken(anzahl = SAETZE_VORGABE) {
  const n = Math.max(3, Math.min(40, Math.round(anzahl) || SAETZE_VORGABE));
  return Math.min(4096, n * 45 + 300);
}
function schaetzeLauf(b, h, anzahl, m) {
  const ein = bildTokens(b, h) + schaetzeTokens(bauePrompt(anzahl));
  const aus = maxToken(anzahl);
  return { ein, aus, usd: (ein * m.ein + aus * m.aus) / 1e6 };
}
function zerlegeDatenUrl(url) {
  const m = /^data:([^;,]+);base64,(.+)$/s.exec(url || "");
  if (!m) return null;
  const media = m[1].toLowerCase();
  if (!/^image\/(jpeg|png|gif|webp)$/.test(media)) return null;
  return { media, daten: m[2] };
}
var BILDVORRAT_KEY = "divergenz_bildvorrat_v1";
var BILDVORRAT_DECKEL = 400;
function bildSchluessel(f) {
  const c = f.ctx;
  const n = (v) => (v || "").toLowerCase().replace(/\s+/g, " ").trim();
  return [n(c.who), n(c.where), n(c.when), n(c.what)].join("|");
}
function taugtFund(f) {
  const c = f?.ctx;
  return !!c && !!(c.who || c.where || c.when || c.what);
}
function mischeBildvorrat(alt, neu, deckel = BILDVORRAT_DECKEL) {
  const bekannt = new Set(alt.filter(taugtFund).map(bildSchluessel));
  const raus = alt.slice();
  for (const f of neu) {
    if (!taugtFund(f)) continue;
    const k = bildSchluessel(f);
    if (bekannt.has(k)) continue;
    bekannt.add(k);
    raus.push(f);
  }
  return deckel > 0 && raus.length > deckel ? raus.slice(raus.length - deckel) : raus;
}
function ladeBildvorrat() {
  try {
    const r = JSON.parse(localStorage.getItem(BILDVORRAT_KEY) || "[]");
    if (!Array.isArray(r)) return [];
    return r.filter((f) => f && f.ctx && typeof f.ctx.what === "string");
  } catch {
    return [];
  }
}
function ziehBildvorrat(vorrat = ladeBildvorrat(), rnd = Math.random) {
  const gut2 = vorrat.filter(taugtFund);
  if (!gut2.length) return null;
  const i = Math.min(gut2.length - 1, Math.max(0, Math.floor(rnd() * gut2.length)));
  return gut2[i];
}
function baueAbschriftPrompt(hinweis = "") {
  const h = (hinweis || "").trim();
  return "Du fertigst eine ABSCHRIFT an. Gib den Text wieder, der auf dem Bild steht \u2014 genau so, wie er dasteht.\n\nVerboten:\n- Etwas erg\xE4nzen, weiterschreiben oder erkl\xE4ren.\n- Rechtschreibung modernisieren. Alte Formen (\u201Ethun\u201C, \u201Egiebt\u201C, \u201Eda\xDF\u201C) bleiben stehen.\n- Grammatik oder Zeichensetzung verbessern. Fehler in der Vorlage sind Teil der Vorlage.\n- Zeilen zusammenziehen, die im Original getrennt stehen, wenn es Verse oder eine Liste sind.\n- Kopfzeilen, Seitenzahlen, Marginalien oder Bildunterschriften stillschweigend weglassen.\n\nErlaubt und erw\xFCnscht:\n- Silbentrennung am Zeilenende aufl\xF6sen: \u201EWerk-\\nzeug\u201C wird zu \u201EWerkzeug\u201C, in einer Zeile.\n- Abs\xE4tze als Abs\xE4tze wiedergeben, Flie\xDFtext als Flie\xDFtext.\n- Ist eine Stelle nicht lesbar, setze [unleserlich] statt zu raten.\n- Steht mehreres nebeneinander (Spalten), schreibe Spalte f\xFCr Spalte, getrennt durch eine Leerzeile.\n\n" + (h ? `Zus\xE4tzliche Vorgabe des Nutzers (vorrangig): ${h}

` : "") + "Gib NUR die Abschrift zur\xFCck. Keine Einleitung, kein Kommentar, keine Anf\xFChrungszeichen um das Ganze, kein Markdown. Steht auf dem Bild kein lesbarer Text, antworte mit genau: KEIN TEXT";
}
function leseAbschrift(roh) {
  let t = (roh || "").trim();
  if (!t || /^KEIN TEXT$/i.test(t)) return { text: "", leer: true };
  t = t.replace(/^```[a-z]*\s*\n?/i, "").replace(/\n?```\s*$/, "").trim();
  t = t.replace(/^(?:hier ist |dies ist )?die abschrift(?: des textes)?:?\s*\n+/i, "").trim();
  return { text: t, leer: !t };
}
function maxTokenAbschrift() {
  return 4096;
}

// test/bildsammler.ts
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
var wahr = (name, b) => ist(name, b, true);
ist("ein Megapixel kostet rund 1334 Token", bildTokens(1e3, 1e3), 1333);
ist("ein verkleinertes Querformat rund 1440", bildTokens(1200, 900), 1440);
wahr(
  "das Doppelte an Fl\xE4che kostet doppelt",
  Math.abs(bildTokens(1200, 1800) - 2 * bildTokens(1200, 900)) <= 1
);
ist("ein Bild ohne Ma\xDFe kostet nichts", bildTokens(0, 900), 0);
ist("und negative Ma\xDFe auch nicht", bildTokens(-100, -100), 0);
var gift = [
  "Das Bild zeigt einen \xE4lteren Mann auf einer Parkbank.",
  "Auf dem Foto sitzt eine Frau am Fenster und liest.",
  "Zu sehen ist eine Landstra\xDFe zwischen zwei Feldern.",
  "Man sieht den Regen auf dem Blechdach stehen.",
  "Im Vordergrund liegt ein umgest\xFCrzter Stuhl aus Holz.",
  "Der Betrachter blickt \xFCber die Schulter des Mannes hinweg.",
  "Die Aufnahme zeigt eine Halle mit hohen Fenstern und Staub.",
  "Links im Bild steht ein Fahrrad ohne Vorderrad an der Wand.",
  "Im Hintergrund verschwimmen die Umrisse einer Stadt im Dunst.",
  "Die Szene wurde bei schwachem Licht aufgenommen.",
  "Der Mann wird von der Seite fotografiert.",
  "Die Kamera steht tief \xFCber dem nassen Pflaster."
];
for (const s of gift) wahr(`Bildbezug erkannt: \u201E${s.slice(0, 42)}\u2026\u201C`, verraetBild(s));
var gut = [
  "Ein \xE4lterer Mann sitzt auf einer Parkbank und l\xFCftet den Hut.",
  "Der Regen steht auf dem Blechdach und l\xE4uft nicht ab.",
  "Ein Fahrrad ohne Vorderrad lehnt an der Wand neben der T\xFCr.",
  "Die Landstra\xDFe l\xE4uft zwischen zwei Feldern nach Norden.",
  "Der Staub in der Halle h\xE4ngt zwischen den hohen Fenstern.",
  "Das Pflaster ist nass und gibt das Licht der Laternen zur\xFCck.",
  "Die Frau am Fenster h\xE4lt das Buch weit von sich weg.",
  "Ein umgest\xFCrzter Stuhl aus Holz liegt auf der Seite."
];
for (const s of gut) ist(`kein Bildbezug: \u201E${s.slice(0, 42)}\u2026\u201C`, verraetBild(s), false);
for (const s of [
  "Der Bildhauer hat die Werkstatt am Kanal aufgegeben.",
  "Die Ausbildung dauerte vier Jahre und endete im Winter.",
  "Seine Einbildung hielt l\xE4nger als das Fieber.",
  "Der Fotograf wohnte \xFCber der W\xE4scherei und ging selten aus."
]) ist(`kein Fehlalarm: \u201E${s.slice(0, 40)}\u2026\u201C`, verraetBild(s), false);
ist("ein zu kurzer Satz taugt nicht", taugtSatz("Regen f\xE4llt."), false);
ist("eine Aufz\xE4hlung ohne Verb auch nicht", taugtSatz("Stuhl, Tisch, Lampe, Fenster, T\xFCr"), false);
ist("ein sehr langer Satz nicht", taugtSatz("wort ".repeat(80)), false);
wahr("ein normaler Satz schon", taugtSatz("Ein Fahrrad ohne Vorderrad lehnt an der Wand neben der T\xFCr."));
ist("und ein Satz mit Bildbezug nie", taugtSatz("Das Bild zeigt ein Fahrrad an einer Wand ohne Rad."), false);
var e1 = beute([...gut.slice(0, 4), ...gift.slice(0, 3)]);
ist("die brauchbaren S\xE4tze bleiben", e1.behalten.length, 4);
ist("die Bildbeschreibungen fliegen raus", e1.verworfen.length, 3);
wahr("und die guten S\xE4tze tragen keinen Zweifel", e1.behalten.every((f) => !f.zweifel));
var e2 = beute([gut[0], gut[0], gut[0].toUpperCase()]);
ist("Doppelte werden nur einmal behalten", e2.behalten.length, 1);
ist("auch bei anderer Schreibung", e2.verworfen.length, 2);
ist("Leerzeilen z\xE4hlen gar nicht", beute(["", "   ", "\n"]).behalten.length, 0);
ist("und erzeugen auch keinen Ausschuss", beute(["", "   "]).verworfen.length, 0);
ist("eine leere Ernte st\xFCrzt nicht ab", beute([]).behalten.length, 0);
var p = bauePrompt(SAETZE_VORGABE);
wahr("die harte Regel steht drin", /ohne das Bild stehen können/.test(p));
wahr("die verbotenen Wendungen werden aufgez\xE4hlt", /das Bild zeigt/.test(p) && /im Vordergrund/.test(p));
wahr("n\xFCchtern statt literarisch wird verlangt", /NICHT literarisch/.test(p));
wahr("die vier W werden angefordert", /who/.test(p) && /where/.test(p) && /when/.test(p) && /what/.test(p));
wahr("Raten wird ausdr\xFCcklich verboten", /Rate nicht/.test(p));
wahr("die Satzzahl steht drin", /12 kurze Sätze/.test(p));
wahr("eine andere Satzzahl kommt an", /5 kurze Sätze/.test(bauePrompt(5)));
wahr("eine unsinnige Satzzahl wird gefangen", /\b3 kurze Sätze/.test(bauePrompt(-9)));
wahr("und eine zu gro\xDFe auch", /\b40 kurze Sätze/.test(bauePrompt(9999)));
wahr("ein Nutzerhinweis kommt hinein", bauePrompt(12, "nur Gegenst\xE4nde").includes("nur Gegenst\xE4nde"));
wahr("ohne Hinweis steht keine leere Vorgabe da", !/Vorgabe des Nutzers \(vorrangig\): *\n/.test(p));
var r1 = leseErnte({ saetze: ["a", "b"], ctx: { who: "ein Mann", where: "Parkbank", when: "", what: "wartet" } });
ist("die S\xE4tze kommen an", r1.saetze.length, 2);
ist("Wer kommt an", r1.ctx.who, "ein Mann");
ist("ein leeres Feld bleibt leer", r1.ctx.when, "");
ist(
  "ein 4W-Feld mit Bildbezug wird verworfen",
  leseErnte({ ctx: { what: "das Bild zeigt eine Ankunft" } }).ctx.what,
  ""
);
wahr(
  "ein zu langes Feld wird gek\xFCrzt",
  leseErnte({ ctx: { where: "x".repeat(300) } }).ctx.where.length <= 80
);
for (const m\u00FCll of [null, void 0, 42, "text", [], { saetze: "kein array" }, { ctx: 7 }]) {
  ist(`Unsinn ergibt leere Ernte: ${JSON.stringify(m\u00FCll) ?? "undefined"}`, leseErnte(m\u00FCll).saetze.length, 0);
}
ist("und die 4W sind dann leer", leseErnte(null).ctx.who, "");
ist("Zahlen in den S\xE4tzen fallen weg", leseErnte({ saetze: ["gut", 5, null] }).saetze.length, 1);
wahr("der Deckel w\xE4chst mit der Satzzahl", maxToken(24) > maxToken(6));
wahr("und bleibt unter dem Modell-Limit", maxToken(9999) <= 4096);
var haiku = MODELLE[0];
var s1 = schaetzeLauf(1200, 900, 12, haiku);
wahr("das Bild steckt in der Eingabesch\xE4tzung", s1.ein > bildTokens(1200, 900));
wahr("ein Lauf kostet weniger als einen Cent bei Haiku", s1.usd < 0.01);
wahr("ein gr\xF6\xDFeres Bild kostet mehr", schaetzeLauf(2400, 1800, 12, haiku).usd > s1.usd);
var einUsd = s1.ein * haiku.ein / 1e6;
var ausUsd = s1.aus * haiku.aus / 1e6;
wahr("die Antwort ist teurer als das Bild", ausUsd > einUsd);
var d1 = zerlegeDatenUrl("data:image/jpeg;base64,AAAA");
ist("der Medientyp wird abgetrennt", d1?.media, "image/jpeg");
ist("und die Nutzdaten bleiben \xFCbrig", d1?.daten, "AAAA");
ist("Gro\xDFschreibung im Typ st\xF6rt nicht", zerlegeDatenUrl("data:IMAGE/PNG;base64,AA")?.media, "image/png");
ist("ein fremdes Format wird abgelehnt", zerlegeDatenUrl("data:image/bmp;base64,AA"), null);
ist("etwas, das kein Bild ist, ebenso", zerlegeDatenUrl("data:text/plain;base64,AA"), null);
ist("und eine gew\xF6hnliche Adresse auch", zerlegeDatenUrl("https://x.test/a.jpg"), null);
ist("leere Eingabe st\xFCrzt nicht ab", zerlegeDatenUrl(""), null);
wahr("es gibt mehr als eine Verr\xE4ter-Regel", VERRAETER.length > 5);
var view = (0, import_fs.readFileSync)("src/ui/bildsammlerView.ts", "utf8");
var css = (0, import_fs.readFileSync)("src/ui/theme.css", "utf8");
ist("der Fund benutzt nicht mehr den Zeilen-Flexkasten", /class: "idea"/.test(view), false);
wahr("sondern einen eigenen Kasten", /class: "bsam-fund"/.test(view));
wahr(".idea ist tats\xE4chlich ein Zeilen-Flexkasten", /\.idea\{display:flex/.test(css));
wahr("der neue Kasten ist es nicht", /\.bsam-fund\{(?![^}]*display:flex)[^}]*\}/.test(css));
wahr("der Ausschuss hat einen sichtbaren Aufklapper", /\.bsam-weg>summary\{/.test(css));
wahr("und die S\xE4tze stehen einzeln untereinander", /\.bsam-satz\{display:flex;align-items:flex-start/.test(css));
var fund = (w, n = "a.jpg", t = 1) => ({ name: n, ctx: { who: "", where: "", when: "", what: w }, gespeichert: t });
wahr("die Schl\xFCssel sind verschieden", BILDVORRAT_KEY !== "divergenz_sammler_vorrat_v1");
wahr("der Bildvorrat wandert in die Projektdatei", BILDVORRAT_KEY.startsWith("divergenz_"));
ist("ein Fund ohne jedes Feld taugt nicht", taugtFund(fund("")), false);
wahr("mit einem Feld schon", taugtFund(fund("eine Ankunft")));
wahr(
  "auch wenn nur Wo gef\xFCllt ist",
  taugtFund({ name: "x", ctx: { who: "", where: "Hafen", when: "", what: "" }, gespeichert: 1 })
);
var v1 = mischeBildvorrat([], [fund("Ankunft"), fund("Abfahrt")]);
ist("zwei Funde kommen an", v1.length, 2);
var v2 = mischeBildvorrat(v1, [fund("Ankunft", "ganz-anderer-name.jpg")]);
ist("dasselbe Was gilt als bekannt, trotz anderem Dateinamen", v2.length, 2);
var v3 = mischeBildvorrat(v1, [fund("  ANKUNFT  ")]);
ist("Schreibung und Leerraum machen keinen Unterschied", v3.length, 2);
ist("ein wirklich neuer Fund kommt dazu", mischeBildvorrat(v1, [fund("R\xFCckkehr")]).length, 3);
ist("leere Funde werden gar nicht aufgenommen", mischeBildvorrat([], [fund("")]).length, 0);
var viele = Array.from({ length: 12 }, (_, i) => fund("was" + i));
var v4 = mischeBildvorrat([], viele, 5);
ist("der Deckel greift", v4.length, 5);
ist("und das \xC4lteste f\xE4llt heraus", v4[0].ctx.what, "was7");
ist("ohne Deckel bleibt alles", mischeBildvorrat([], viele, 0).length, 12);
ist("aus dem leeren Vorrat kommt nichts", ziehBildvorrat([], () => 0), null);
ist("der erste Fund l\xE4sst sich ziehen", ziehBildvorrat(v1, () => 0)?.ctx.what, "Ankunft");
ist("und der letzte auch", ziehBildvorrat(v1, () => 0.999)?.ctx.what, "Abfahrt");
ist(
  "ein Vorrat nur aus leeren Funden gibt nichts her",
  ziehBildvorrat([fund("")], () => 0),
  null
);
var ap = baueAbschriftPrompt();
wahr("Erg\xE4nzen ist verboten", /Etwas ergänzen, weiterschreiben/.test(ap));
wahr("Modernisieren ist verboten", /Rechtschreibung modernisieren/.test(ap));
wahr("Verbessern ist verboten", /Grammatik oder Zeichensetzung verbessern/.test(ap));
wahr("Unleserliches wird gekennzeichnet statt geraten", /\[unleserlich\] statt zu raten/.test(ap));
wahr("Silbentrennung wird aufgel\xF6st", /Silbentrennung am Zeilenende/.test(ap));
wahr("es gibt eine Antwort f\xFCr \u201Ekein Text\u201C", /KEIN TEXT/.test(ap));
wahr("ein Nutzerhinweis kommt hinein", baueAbschriftPrompt("nur die linke Spalte").includes("nur die linke Spalte"));
wahr("die Abschrift kennt keinen Beutefilter", !/Glätte|verworfen und war umsonst/.test(ap));
ist("eine leere Antwort ist leer", leseAbschrift("").leer, true);
ist("die Kein-Text-Antwort ebenso", leseAbschrift("KEIN TEXT").leer, true);
ist("auch klein geschrieben", leseAbschrift("kein text").leer, true);
ist("ein Codeblock wird abgestreift", leseAbschrift("```\nEs war ein Tag.\n```").text, "Es war ein Tag.");
ist("auch einer mit Sprachangabe", leseAbschrift("```text\nEs war ein Tag.\n```").text, "Es war ein Tag.");
ist("ein Vorspann f\xE4llt weg", leseAbschrift("Hier ist die Abschrift:\n\nEs war ein Tag.").text, "Es war ein Tag.");
ist(
  "ein echter Satz \xFCber eine Abschrift bleibt stehen",
  leseAbschrift("Die Abschrift des Protokolls lag auf dem Tisch.").text,
  "Die Abschrift des Protokolls lag auf dem Tisch."
);
ist(
  "und ein gew\xF6hnlicher Text sowieso",
  leseAbschrift("Es war ein Tag im Herbst.").text,
  "Es war ein Tag im Herbst."
);
wahr("der Deckel l\xE4sst eine volle Buchseite zu", maxTokenAbschrift() >= 2048);
ist("der gemeldete Satz wird erkannt", wirktVerkuerzt("Mann sitzt auf Bank und h\xE4lt Hut"), true);
ist("auch mit Punkt", wirktVerkuerzt("Mann sitzt auf Bank und h\xE4lt Hut."), true);
for (const s of [
  "Frau steht vor Fenster und h\xE4lt Buch",
  "Fahrrad lehnt an Wand neben T\xFCr",
  "Staub liegt auf Boden und Fensterbrettern"
]) wahr(`Telegrammstil erkannt: \u201E${s}\u201C`, wirktVerkuerzt(s));
for (const s of gut) ist(`vollst\xE4ndiger Satz bleibt frei: \u201E${s.slice(0, 40)}\u2026\u201C`, wirktVerkuerzt(s), false);
ist(
  "ein Satz mit verschmolzenem Artikel gilt als vollst\xE4ndig",
  wirktVerkuerzt("Nebel steht im Hof und zieht langsam ab"),
  false
);
ist("ein kurzer Satz wird nicht beurteilt", wirktVerkuerzt("Regen f\xE4llt seit gestern"), false);
ist(
  "ein einzelnes Substantiv ohne Artikel reicht nicht",
  wirktVerkuerzt("Regen f\xE4llt seit gestern ohne jede Pause"),
  false
);
ist("auch ohne jedes Begleitwort", wirktVerkuerzt("Regen f\xE4llt seit gestern ohne Pause"), false);
wahr(
  "und die Regel zeichnet einen solchen Satz eben mit an \u2014 bekannt und tragbar",
  wirktVerkuerzt("Drau\xDFen f\xE4llt seit gestern Abend leise und ohne Pause Schnee")
);
var e9 = beute(["Mann sitzt auf Bank und h\xE4lt Hut.", gut[0]]);
ist("der verk\xFCrzte Satz wird nicht verworfen", e9.verworfen.length, 0);
ist("er bleibt in der Liste", e9.behalten.length, 2);
var zw = e9.behalten.find((f) => f.satz.startsWith("Mann sitzt"));
wahr("aber mit einem Grund versehen", !!zw && zw.zweifel.length > 0);
wahr("und der Grund nennt den Artikel", !!zw && /Artikel/.test(zw.zweifel));
wahr(
  "der vollst\xE4ndige Satz bleibt ohne Zweifel",
  !e9.behalten.find((f) => f.satz === gut[0]).zweifel
);
wahr("der Prompt schlie\xDFt Telegrammstil aus", /Kein Telegrammstil/.test(p));
wahr("er nennt das Gegenbeispiel", /Mann sitzt auf Bank/.test(p));
wahr("und die richtige Fassung dazu", /Der Mann sitzt auf der Bank/.test(p));
wahr("er begr\xFCndet es mit dem Zerlegen", /Scharniere/.test(p));
wahr("und stellt klar, dass n\xFCchtern nicht verk\xFCrzt hei\xDFt", /NÜCHTERN HEISST NICHT VERKÜRZT/.test(p));
console.log(`Pr\xFCfstand Bildsammler \u2014 ${geprueft} Pr\xFCfungen (ohne API-Aufruf):`);
zeilen.forEach((z) => console.log(z));
var proc = globalThis;
if (fails.length) {
  console.error(`
\u274C ${fails.length} Fehler im Bildsammler:`);
  fails.forEach((f) => console.error("  - " + f));
  proc.process?.exit(1);
} else {
  console.log(`
\u2705 Bildsammler: alle ${geprueft} Pr\xFCfungen bestanden.`);
}
