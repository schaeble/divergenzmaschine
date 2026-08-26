// Prüfstand Titel: Eine Überschrift über dem erzeugten Text, grammatisch
// sicher, aus dem Inhalt.
//
// Gewünscht: „Grammatikalisch richtigen Titel über den erzeugten Texten
// einfügen, gemäß Inhalt. Titel über Schalter im Studio ein- und
// ausschaltbar." Die Maschine erfindet keine Grammatik: Sie nimmt eine
// Bildzeile aus dem Text (Nominalphrase, höchstens ein Relativsatz) oder
// baut aus Wer und Was — nach der Art des Was.
import { readFileSync } from "fs";
import { titelFuer, titelAusKontext, bildzeilen, kuerzeTitel, einWort, nuechternerTitel, titelKandidaten } from "../src/generation/titel";

const fails: string[] = [];
let geprueft = 0, bestanden = 0;
const ist = (name: string, wert: unknown, soll: unknown): void => {
  geprueft++;
  if (wert === soll) bestanden++;
  else fails.push(`${name}: „${String(wert)}“ — erwartet „${String(soll)}“`);
};
const wahr = (name: string, b: boolean): void => ist(name, b, true);

// ── 1 · Bildzeilen aus dem Text ─────────────────────────────────────────────
const text = "Die Tür ist verschlossen. Ein Siegel. Ein Licht, das die falschen Dinge zeigt. Der Bote bringt, was niemand hören will. Eine Narbe im Morgenlicht.";
const z = bildzeilen(text);
ist("ein Satz mit Prädikat ist keine Bildzeile", z.includes("Die Tür ist verschlossen"), false);
ist("zwei Wörter sagen nichts", z.includes("Ein Siegel"), false);
ist("Nominalphrase mit Relativsatz ist eine", z.includes("Ein Licht, das die falschen Dinge zeigt"), true);
ist("Nominalphrase mit Ortsangabe ist eine", z.includes("Eine Narbe im Morgenlicht"), true);
ist("ein Hauptsatz mit Verb ist keine", z.includes("Der Bote bringt, was niemand hören will"), false);

// ── 2 · Gemäß Inhalt: die Bildzeile, die Wer/Was teilt ──────────────────────
ist("die Zeile mit Bezug zum Was gewinnt",
  titelFuer(text, { who: "Der Bote", what: "eine Narbe zählt" }), "Eine Narbe im Morgenlicht");
ist("ohne Bezug die erste",
  titelFuer(text, { who: "Der Bote", what: "schweigt" }), "Ein Licht, das die falschen Dinge zeigt");
ist("die Meldung bekommt keinen Titel", titelFuer(text, {}, "meldung"), "");

// ── 3 · Wer + Was, nach der Art des Was ─────────────────────────────────────
ist("verb-geführtes Was: Satz", titelAusKontext({ who: "Der Bote", what: "bringt, was niemand hören will" }), "Der Bote bringt, was niemand hören will");
ist("Was als Nominalphrase: „und“", titelAusKontext({ who: "Ein Wachmann", what: "eine Logik, die nur im Tanz erlaubt ist" }), "Ein Wachmann und eine Logik, die nur im Tanz erlaubt ist");
ist("Was als ganzer Satz: das Was allein", titelAusKontext({ who: "Die Uhrmacherin", what: "ein Wunder geschieht" }), "Ein Wunder geschieht");
ist("Vorhaben mit Infinitiv: „will“", titelAusKontext({ who: "Wachmann", what: "einen Schlüssel verlieren" }), "Ein Wachmann will einen Schlüssel verlieren");
ist("nur Wer", titelAusKontext({ who: "die Uhrmacherin" }), "Die Uhrmacherin");
ist("nur Wann und Wo", titelAusKontext({ when: "1953", where: "Hafen" }), "Im Jahr 1953, im Hafen");
ist("nichts → leer, der Rückfall kommt von titelFuer", titelAusKontext({}), "");
ist("Rückfall ohne alles", titelFuer("", {}), "Ohne Titel");

// ── 4 · Kürzen an der Fuge ──────────────────────────────────────────────────
const lang = "Ein Museum, das seine Exponate verliert, zählt eine Person zu viel und sagt es niemandem.";
const k = kuerzeTitel(lang);
wahr("höchstens sechzig Zeichen", k.length <= 60);
wahr("endet auf Auslassung", /…$/.test(k));
ist("gekürzt an der Fuge, nicht im Satzglied", k, "Ein Museum, das seine Exponate verliert …");
ist("ein kurzer Titel bleibt ganz, ohne Punkt", kuerzeTitel("Eine Narbe im Morgenlicht."), "Eine Narbe im Morgenlicht");

// ── 5 · Drei Formen, drei Regeln: Haiku ein Wort, Bericht nüchtern, Reim frei ─
{
  const haiku = "Kalter Bach im Hafen —\nein Wachmann zählt die Möwen,\nder Schlüssel schweigt.";
  ist("Haiku: ein Wort, mit Bezug zum Wer", einWort(haiku, { who: "Der Wachmann", what: "verliert einen Schlüssel" }), "Wachmann");
  ist("Haiku: ohne Bezug das letzte Nomen (die Auflösung)", einWort("Kalter Bach im Hafen —\nein Wachmann zählt die Möwen,\ndas Licht schweigt.", {}), "Licht");
  wahr("Haiku: wirklich EIN Wort", !/\s/.test(titelFuer(haiku, { who: "Der Wachmann" }, "haiku")));
  ist("Haiku: ohne Text ein Nomen aus dem Kontext, kein Artikel", einWort("", { who: "Die Uhrmacherin" }), "Uhrmacherin");
  ist("Bericht: nüchtern, ohne Artikel, Wer + Was", nuechternerTitel({ who: "Der Bote", what: "bringt, was niemand hören will" }), "Bote bringt, was niemand hören will");
  ist("Bericht: keine Bildzeile aus dem Text", titelFuer(text, { who: "Der Bote", what: "bringt, was niemand hören will" }, "bericht"), "Bote bringt, was niemand hören will");
  const langB = nuechternerTitel({ who: "Ein Museum, das seine Exponate verliert", what: "zählt eine Person zu viel und sagt es niemandem und dem Rat" });
  wahr("Bericht: zu lang → an der Fuge, ohne Auslassungszeichen", !/…/.test(langB) && langB.length <= 60);
  ist("Bericht: ohne Kontext der Formname", titelFuer(text, {}, "bericht"), "Bericht");
  ist("Reim: frei wie Prosa — die Bildzeile", titelFuer(text, { who: "Der Bote" }, "reim"), "Ein Licht, das die falschen Dinge zeigt");
}

// ── 6 · Keine Wiederholung bei gleicher Einstellung ─────────────────────────
// Gemeldet: Bei gleichem Preset wiederholte sich der Titel — Wer + Was sind
// fest, die erste Bildzeile war immer dieselbe. Jetzt zählt, was vergeben ist.
{
  const ctx = { who: "Der Bote", what: "bringt, was niemand hören will", where: "am Kanalufer", when: "im Jahr 2041" };
  const k = titelKandidaten(text, ctx);
  wahr("es gibt mehrere Kandidaten", k.length >= 3);
  const erster = titelFuer(text, ctx, "prose", []);
  const zweiter = titelFuer(text, ctx, "prose", [erster]);
  const dritter = titelFuer(text, ctx, "prose", [erster, zweiter]);
  wahr("drei Erzeugungen, drei Titel", new Set([erster, zweiter, dritter]).size === 3);
  ist("alle vergeben → der älteste kommt wieder", titelFuer(text, ctx, "prose", k.slice()), k[0]);
  // Haiku und Bericht wechseln ebenfalls.
  const haiku = "Kalter Bach im Hafen —\nein Wachmann zählt die Möwen,\nder Schlüssel schweigt.";
  const h1 = titelFuer(haiku, { who: "Der Wachmann" }, "haiku", []);
  const h2 = titelFuer(haiku, { who: "Der Wachmann" }, "haiku", [h1]);
  wahr("Haiku: das zweite Wort ist ein anderes, und eines", h1 !== h2 && !/\s/.test(h2));
  const b1 = titelFuer("", ctx, "bericht", []);
  const b2 = titelFuer("", ctx, "bericht", [b1]);
  wahr("Bericht: die zweite Fassung trägt Ort oder Zeit als Marke", b1 !== b2 && /^(Kanalufer|Im Jahr 2041): /.test(b2));
  wahr("das Studio reicht die vergebenen Titel weiter", /titelFuer\(txt, \{[^}]*\}, form\.value, ladeGesehen\(\)\)/.test(readFileSync("src/ui/studio.ts", "utf8")));
}

// ── 7 · Der Schalter im Studio ──────────────────────────────────────────────
const q = readFileSync("src/ui/studio.ts", "utf8");
wahr("es gibt den Schalter", /id: "f-titel-an"/.test(q));
wahr("der Schalter wird gespeichert", /localStorage\.setItem\(TITEL_KEY/.test(q));
wahr("der Titel steht über dem Text", /titelLbl\), titelEl, outWrap/.test(q));
wahr("aus heißt kein Titel", /if \(!titelChk\.checked\) return "";/.test(q));
wahr("und er wandert in den Leser", /titel: aktuellerTitel\(\)/.test(q));
wahr("der Leser zeigt ihn", /ctx\.titel\) body\.prepend/.test(readFileSync("src/ui/reader.ts", "utf8")));

console.log(`Prüfstand Titel — ${geprueft} Prüfungen, ${bestanden} bestanden`);
const proc = globalThis as unknown as { process?: { exit: (c: number) => void } };
if (fails.length) {
  console.error(`\n❌ Titel: ${fails.length} Fehler:`);
  fails.forEach((f) => console.error("  - " + f));
  proc.process?.exit(1);
} else {
  console.log(`\n✅ Titel: alle ${geprueft} Prüfungen bestanden.`);
}
