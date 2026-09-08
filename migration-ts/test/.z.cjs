"use strict";

// src/features/varianz.ts
var STOPP = /* @__PURE__ */ new Set([
  "aber",
  "auch",
  "dann",
  "dass",
  "denn",
  "doch",
  "durch",
  "eine",
  "einem",
  "einen",
  "einer",
  "eines",
  "gegen",
  "haben",
  "hatte",
  "immer",
  "jeder",
  "kann",
  "mehr",
  "nach",
  "nicht",
  "noch",
  "oder",
  "schon",
  "sein",
  "seine",
  "sich",
  "sind",
  "\xFCber",
  "unter",
  "wenn",
  "werden",
  "wieder",
  "wird",
  "wurde",
  "zwischen",
  "diese",
  "dieser",
  "dieses",
  "damit",
  "dabei",
  "davon",
  "etwas",
  "ohne",
  "sondern",
  "zwar"
]);
function inhaltsWoerter(text) {
  const raus = /* @__PURE__ */ new Set();
  for (const w of (text || "").toLowerCase().match(/[a-zäöüß]{4,}/g) || []) {
    if (!STOPP.has(w)) raus.add(w);
  }
  return raus;
}
function dreiergruppen(text) {
  const w = (text || "").toLowerCase().match(/[a-zäöüß]+/g) || [];
  const raus = /* @__PURE__ */ new Set();
  for (let i = 0; i + 2 < w.length; i++) raus.add(`${w[i]} ${w[i + 1]} ${w[i + 2]}`);
  return raus;
}
function jaccard(a, b) {
  if (!a.size || !b.size) return 0;
  let schnitt = 0;
  const klein = a.size <= b.size ? a : b, gross = a.size <= b.size ? b : a;
  for (const x of klein) if (gross.has(x)) schnitt++;
  return schnitt / (a.size + b.size - schnitt);
}
function aehnlichkeit(a, b) {
  const w = jaccard(inhaltsWoerter(a), inhaltsWoerter(b));
  const g = jaccard(dreiergruppen(a), dreiergruppen(b));
  return Math.max(0, Math.min(1, (w + 2 * g) / 3));
}
function varianzBand(wert) {
  if (!Number.isFinite(wert) || wert < 0.55) return "gering";
  if (wert < 0.75) return "mittel";
  return "hoch";
}
var anteilVerschieden = (werte) => {
  const gefuellt = werte.filter((x) => !!x);
  if (gefuellt.length < 2) return 1;
  return new Set(gefuellt).size / gefuellt.length;
};
function laengenVielfalt(texte) {
  const n = texte.map((t) => (t.match(/\S+/g) || []).length).filter((x) => x > 0);
  if (n.length < 2) return 1;
  const m = n.reduce((a, b) => a + b, 0) / n.length;
  if (m <= 0) return 0;
  const sd = Math.sqrt(n.reduce((a, b) => a + (b - m) * (b - m), 0) / n.length);
  return Math.max(0, Math.min(1, sd / m / 0.5));
}
function varianzBericht(stuecke) {
  const n = stuecke.length;
  const leer = {
    wert: 1,
    band: "hoch",
    naechste: [],
    paare: [],
    vielfalt: { formen: 1, baenke: 1, quellen: 1, laengen: 1 }
  };
  if (n < 2) return leer;
  const naechste = new Array(n).fill(0);
  const paare = [];
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const w = aehnlichkeit(stuecke[i].text, stuecke[j].text);
      paare.push({ a: i, b: j, wert: w });
      if (w > naechste[i]) naechste[i] = w;
      if (w > naechste[j]) naechste[j] = w;
    }
  }
  const mittelNaechste = naechste.reduce((a, b) => a + b, 0) / n;
  const wert = Math.max(0, Math.min(1, 1 - mittelNaechste));
  paare.sort((a, b) => b.wert - a.wert);
  return {
    wert,
    band: varianzBand(wert),
    naechste,
    paare: paare.slice(0, 3),
    vielfalt: {
      formen: anteilVerschieden(stuecke.map((s) => s.form)),
      baenke: anteilVerschieden(stuecke.map((s) => s.bank)),
      quellen: anteilVerschieden(stuecke.map((s) => s.quelle)),
      laengen: laengenVielfalt(stuecke.map((s) => s.text))
    }
  };
}

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

// test/varianz.ts
var fails = [];
var geprueft = 0;
var bestanden = 0;
var ist = (name, wert, soll) => {
  geprueft++;
  if (wert === soll) bestanden++;
  else fails.push(`${name}: \u201E${String(wert)}\u201C \u2014 erwartet \u201E${String(soll)}\u201C`);
};
var wahr = (name, b, zusatz = "") => ist(name + (zusatz ? ` (${zusatz})` : ""), b, true);
var A = "Der W\xE4chter z\xE4hlt die Fenster im Hafen. Ein Kompass zeigt, was niemand fragt. Die Reise f\xFChrt zur\xFCck an den Anfang.";
var B = "Der W\xE4chter z\xE4hlt die Fenster im Hafen. Ein Kompass zeigt, was niemand fragt. Die Reise f\xFChrt zur\xFCck an den Anfang.";
var C = "Im Winter schmilzt der Schnee auf dem Dach der Scheune. Ein Pferd wartet am Zaun und die Uhr im Stall bleibt stehen.";
var D = "Die Rechnung liegt auf dem Tisch der Verwaltung. Ein Formular verlangt eine Unterschrift, die niemand leisten will.";
var E = "Der W\xE4chter z\xE4hlt die Fenster am Hafen und ein Kompass schweigt. Sp\xE4ter f\xFChrt die Reise zur\xFCck zum Anfang der Wette.";
wahr("Inhaltsw\xF6rter lassen F\xFCllw\xF6rter weg", !inhaltsWoerter("und aber nicht wenn").has("aber"));
wahr("und behalten die Nomen", inhaltsWoerter("Der W\xE4chter z\xE4hlt Fenster").has("w\xE4chter"));
ist("Dreiergruppen z\xE4hlen richtig", dreiergruppen("eins zwei drei vier").size, 2);
ist("zu kurzer Text gibt keine Gruppe", dreiergruppen("eins zwei").size, 0);
ist("gleicher Text ist ganz \xE4hnlich", Math.round(aehnlichkeit(A, B) * 100), 100);
wahr("verschiedene Texte sind kaum \xE4hnlich", aehnlichkeit(A, C) < 0.1, aehnlichkeit(A, C).toFixed(3));
wahr("umformuliert bleibt erkennbar \xE4hnlich", aehnlichkeit(A, E) > 0.15, aehnlichkeit(A, E).toFixed(3));
wahr("und weniger als w\xF6rtlich gleich", aehnlichkeit(A, E) < aehnlichkeit(A, B));
ist("leerer Text ist mit nichts \xE4hnlich", aehnlichkeit("", A), 0);
{
  const b = varianzBericht([
    { titel: "1", text: A },
    { titel: "2", text: C },
    { titel: "3", text: D }
  ]);
  wahr("drei verschiedene Beitr\xE4ge ergeben hohe Varianz", b.band === "hoch", b.wert.toFixed(3));
  wahr("und die \xE4hnlichsten Paare sind trotzdem benannt", b.paare.length > 0);
}
{
  const b = varianzBericht([
    { titel: "1", text: A },
    { titel: "2", text: B },
    { titel: "3", text: C },
    { titel: "4", text: D }
  ]);
  wahr("eine Dublette dr\xFCckt die Varianz", b.wert < 0.75, b.wert.toFixed(3));
  ist("und wird als \xE4hnlichstes Paar benannt", `${b.paare[0].a},${b.paare[0].b}`, "0,1");
  wahr("die beiden anderen bleiben unbelastet", b.naechste[2] < 0.1 && b.naechste[3] < 0.1);
}
{
  const b = varianzBericht([{ titel: "1", text: A }, { titel: "2", text: B }]);
  ist("zwei gleiche Beitr\xE4ge sind rot", b.band, "gering");
}
ist("ein einzelner Beitrag hat nichts zu vergleichen", varianzBericht([{ titel: "1", text: A }]).band, "hoch");
ist("keine Beitr\xE4ge auch nicht", varianzBericht([]).band, "hoch");
ist("0,9 ist hoch", varianzBand(0.9), "hoch");
ist("0,75 ist hoch", varianzBand(0.75), "hoch");
ist("0,6 ist mittel", varianzBand(0.6), "mittel");
ist("0,5 ist gering", varianzBand(0.5), "gering");
ist("Unsinn gilt als gering", varianzBand(NaN), "gering");
{
  const b = varianzBericht([
    { titel: "1", text: A, form: "prose", bank: "x", quelle: "welt" },
    { titel: "2", text: C, form: "prose", bank: "x", quelle: "welt" },
    { titel: "3", text: D, form: "prose", bank: "x", quelle: "welt" }
  ]);
  wahr(
    "gleiche Form, gleiche Bank, gleiche Quelle: Vielfalt niedrig",
    b.vielfalt.formen < 0.4 && b.vielfalt.baenke < 0.4 && b.vielfalt.quellen < 0.4
  );
}
{
  const b = varianzBericht([
    { titel: "1", text: A, form: "prose", bank: "x", quelle: "welt" },
    { titel: "2", text: C, form: "meldung", bank: "y", quelle: "idee" },
    { titel: "3", text: D, form: "haiku", bank: "z", quelle: "wahrnehmung" }
  ]);
  ist("lauter verschiedene ergeben volle Vielfalt", b.vielfalt.formen, 1);
}
{
  const kurz = "Ein Satz.";
  const lang = A + " " + C + " " + D;
  wahr(
    "verschiedene L\xE4ngen z\xE4hlen als Vielfalt",
    varianzBericht([{ titel: "1", text: kurz }, { titel: "2", text: lang }]).vielfalt.laengen > 0.5
  );
  wahr(
    "gleiche L\xE4ngen nicht",
    varianzBericht([{ titel: "1", text: C }, { titel: "2", text: D }]).vielfalt.laengen < 0.5
  );
}
{
  const satz = "Der Wecker geht und der Traum geht weiter.";
  const text = Array.from({ length: 24 }, () => satz).join(" ");
  let maxAnzahl = 0, doppelt = 0, nachbarn = 0;
  for (let i = 0; i < 60; i++) {
    const t = applyToneRegister(text, "ironisch");
    const tags = t.match(/— (angeblich|so hieß es|was auch immer das heißen sollte|natürlich|wie praktisch|oder so ähnlich)\./g) || [];
    maxAnzahl = Math.max(maxAnzahl, tags.length);
    if (new Set(tags).size < tags.length) doppelt++;
    if (/— [^.]+\. Der Wecker geht und der Traum geht weiter — /.test(t)) nachbarn++;
  }
  wahr("h\xF6chstens drei Nachs\xE4tze je Text (60 L\xE4ufe, 24 S\xE4tze)", maxAnzahl <= 3 && maxAnzahl >= 1);
  ist("kein Nachsatz zweimal", doppelt, 0);
  ist("nie zwei S\xE4tze hintereinander", nachbarn, 0);
}
console.log(`Pr\xFCfstand Varianz \u2014 ${geprueft} Pr\xFCfungen, ${bestanden} bestanden`);
var proc = globalThis;
if (fails.length) {
  console.error(`
\u274C Varianz: ${fails.length} Fehler:`);
  fails.forEach((f) => console.error("  - " + f));
  proc.process?.exit(1);
} else {
  console.log(`
\u2705 Varianz: alle ${geprueft} Pr\xFCfungen bestanden.`);
}
