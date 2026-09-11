// Prüfstand Zeitlupe: features/zeitlupe.ts (Rekorder, Satzdiff) + Stufen im Bau + Ansicht.
//
// Gewünscht: den Bau eines Textes in Zeitlupe betrachten, Stop-and-go.
import { JSDOM } from "jsdom";
const dom = new JSDOM("<!doctype html><html><body></body></html>", { url: "https://x.test/" });
(globalThis as unknown as Record<string, unknown>).localStorage = dom.window.localStorage;
import { readFileSync } from "fs";
import { zeitlupeSchalten, zeitlupeLesen, zeitlupeAn, stufenDiff, STUFEN_ERKLAERUNG } from "../src/features/zeitlupe";
import { DEFAULT_BANK } from "../src/constants";
import { BUILTIN_PRESETS } from "../src/presets.data";
import { buildStory } from "../src/generation/buildStory";
import { setDramaData } from "../src/generation/dramaturgie";
import type { GenInput, Bank } from "../src/types";

const fails: string[] = [];
let geprueft = 0, bestanden = 0;
const ist = (name: string, wert: unknown, soll: unknown): void => { geprueft++; if (wert === soll) bestanden++; else fails.push(`${name}: „${String(wert)}“ — erwartet „${String(soll)}“`); };
const wahr = (name: string, b: boolean, zusatz = ""): void => ist(name + (zusatz ? ` (${zusatz})` : ""), b, true);

// ── 1 · Satzdiff ────────────────────────────────────────────────────────────
{
  const d = stufenDiff("Der Morgen liegt grau. Ein Riemen fehlt. Das Wasser steht still wie ein Gedanke.", "Der Morgen liegt grau. Das Wasser steht still wie ein Stein. Die Glocke schlägt.");
  ist("gleich erkannt", d.saetze[0]!.marke, "gleich");
  ist("geändert erkannt (ähnlicher Satz)", d.saetze[1]!.marke, "geaendert");
  ist("neu erkannt", d.saetze[2]!.marke, "neu");
  ist("gefallen genannt", d.gefallen.join("|"), "Ein Riemen fehlt.");
  const leer = stufenDiff("", "Ein Satz.");
  ist("erste Stufe: alles neu", leer.saetze[0]!.marke, "neu");
}

// ── 2 · Der Rekorder im Bau ─────────────────────────────────────────────────
const inp: GenInput = { where: "im Hafen", when: "am Abend", who: "Der Bote", what: "hört die Glocke", tone: "mystery", varLevel: "wild", form: "prose", structure: "linear", mode: "myth", perspective: "third", rhythm: "auto", markovMode: "off", disruptor: "auto", archetypeA: "neutral", archetypeB: "psychopath", instability: 0, polish: false, polishStyle: "surreal_precise", lenTarget: 160 } as never;
wahr("aus: kein Rekorder", !zeitlupeAn());
buildStory(DEFAULT_BANK, inp);
ist("aus: nichts aufgezeichnet", zeitlupeLesen().length, 0);
zeitlupeSchalten(true);
// Zusammenbau-Weg (linear): der Bau ist EINE Stufe, danach die Nachbearbeitung.
const tl = buildStory(BUILTIN_PRESETS["kafka"] as Bank, inp);
const sl = zeitlupeLesen();
wahr("Zusammenbau-Weg: Bau … Ende, mindestens fünf Stufen", sl.length >= 5 && sl[0]!.name === "Bau" && sl[sl.length - 1]!.name === "Ende", sl.map((x) => x.name).join(","));
ist("… der letzte Text ist der gelieferte", sl[sl.length - 1]!.text, tl);
// Klassischer Weg (Dramaturgie): alle Stufen.
setDramaData({ einstieg: ["Der Bote hört die Glocke"], mitte: ["Ein Netz aus Fäden", "Ein Fenster ohne Glas"], hoehepunkt: ["Die Glocke schweigt"], schluss: ["Zurück bleibt ein Ton"], ausloeser: ["ein Strick"], veraenderungen: ["die Zeit kippt"], konflikte: [], zeitanomalien: [], regeln: [] });
const t = buildStory(BUILTIN_PRESETS["kafka"] as Bank, { ...inp, structure: "dramaturgie" } as never);
setDramaData(null);
const st = zeitlupeLesen();
wahr("an: Stufen aufgezeichnet (mindestens zehn)", st.length >= 10, String(st.length));
ist("die erste Stufe ist der Bau", st[0]!.name, "Bau");
ist("die letzte Stufe ist das Ende", st[st.length - 1]!.name, "Ende");
ist("… und ihr Text ist der gelieferte", st[st.length - 1]!.text, t);
wahr("die Reihenfolge stimmt: Bau vor Ton vor Auffüllen vor Ende", st.findIndex((x) => x.name === "Bau") < st.findIndex((x) => x.name === "Ton") && st.findIndex((x) => x.name === "Ton") < st.findIndex((x) => x.name === "Auffüllen"));
wahr("jede Stufe trägt ihre Erläuterung", st.every((x) => x.kurz.length > 20));
wahr("das Auffüllen hat den Text verlängert", st[st.findIndex((x) => x.name === "Auffüllen")]!.text.length > st[st.findIndex((x) => x.name === "Auffüllen") - 1]!.text.length);
wahr("alle Stufennamen sind erklärt", st.every((x) => !!STUFEN_ERKLAERUNG[x.name]));
zeitlupeSchalten(false);

// ── 3 · Die Ansicht ─────────────────────────────────────────────────────────
{
  const q = readFileSync("src/ui/studio.ts", "utf8");
  // 4.353.0: Layer im Editorfenster statt Box unter dem Text, kein Abspielen.
  wahr("Schalter „Quelltext“ neben dem Bauplan (vormals Zeitlupe)", /ansicht\(planChk, "Bauplan"\), ansicht\(zeitChk, "Quelltext"\)/.test(q));
  wahr("der Schalter steuert den Rekorder", /zeitlupeSchalten\(on\)/.test(q));
  wahr("Stapel und Ebene liegen im Textfenster", /mkGenArrow\("left"\), spur, out, zeitEbene, zeitStapel, mkGenArrow\("right"\)/.test(q));
  wahr("nur im Editiermodus", /const sichtbar = on && feedsChk\.checked;/.test(q));
  wahr("jede Stufe ist ein klickbarer Layer", /class: "zl-layer"/.test(q) && /b\.addEventListener\("click", \(\) => \{ zeitStufe = letzte \? -1 : i; zeitSchritt = -1; renderZeit\(\); \}\)/.test(q));
  wahr("die Ebene liegt über dem Text, der Text bleibt", /out\.classList\.add\("zl-unter"\)/.test(q) && !/out\.textContent = akt/.test(q));
  wahr("die letzte Stufe nimmt die Ebene weg (Editieren bleibt möglich)", /if \(zeitStufe < 0\) \{ zeitEbene\.style\.display = "none"/.test(q));
  wahr("Marken: neu, geändert, gefallen", /zl-" \+ sz\.marke/.test(q) && /zl-weg/.test(q));
  wahr("kein Abspielen mehr", !/Abspielen/.test(q) && !/f-zl-tempo/.test(q));
  wahr("nach jeder Erzeugung: Ebene weg, Stapel neu", /if \(zeitChk\.checked\) \{ zeitStufe = -1; zeitSchritt = -1; renderZeit\(\); \}/.test(q));
}

// ── Gemeldet: „Vom Bau bis zum Ende? Stimmt das?" — die Aufzeichnung gehört zum Text
{
  zeitlupeSchalten(true);
  const a = buildStory(BUILTIN_PRESETS["kafka"] as Bank, inp);
  const b = buildStory(BUILTIN_PRESETS["kafka"] as Bank, inp);      // ein zweiter Kandidat, wie bei Bestenauslese
  const stA = zeitlupeLesen(a), stB = zeitlupeLesen(b);
  ist("die Aufzeichnung zu Text A endet mit A", stA[stA.length - 1]!.text, a);
  ist("die zu Text B endet mit B", stB[stB.length - 1]!.text, b);
  wahr("Bau und Ende gehören zum selben Lauf", stA[0]!.text !== stB[0]!.text || a === b);
  ist("zu einem fremden Text: keine Aufzeichnung", zeitlupeLesen("Ein Text, der nie gebaut wurde.").length, 0);
  zeitlupeSchalten(false);
  const q = readFileSync("src/ui/studio.ts", "utf8");
  wahr("die Ansicht holt die Aufzeichnung DIESES Textes", /zeitlupeLesen\(out\.textContent \|\| ""\)/.test(q));
  wahr("und sagt es, wenn der Text nicht durch den Bau kam", /Zu diesem Text gibt es keine Aufzeichnung/.test(q));
}

// ── Stufe 3: die Zeitlupe innerhalb des Baus — Schritte mit Konkurrenten ────
{
  zeitlupeSchalten(true);
  const t3 = buildStory(BUILTIN_PRESETS["kafka"] as Bank, inp);            // Zusammenbau (linear)
  const bau = zeitlupeLesen(t3).find((x) => x.name === "Bau")!;
  wahr("der Bau trägt Schritte", !!bau.schritte && bau.schritte.length >= 8, String(bau.schritte?.length));
  const sch = bau.schritte!;
  wahr("jeder Schritt kennt Phase, Quelle, Typ", sch.every((x) => x.phase && x.quelle && x.typ));
  wahr("der Text wächst Schritt für Schritt", sch.every((x, i) => i === 0 || x.text.length > sch[i - 1]!.text.length));
  wahr("der letzte Schritt ist der Rohtext des Baus (bis auf Fugen und Absätze)", (() => { const n = (x: string) => x.toLowerCase().replace(/[^a-zäöüß]/g, ""); const a = n(sch[sch.length - 1]!.text), b = n(bau.text); return a.length > 0 && (b.includes(a.slice(0, 60)) && Math.abs(a.length - b.length) < b.length * 0.25); })());
  wahr("die Entscheidung ist zerlegt (Grund + mindestens ein Term)", sch.every((x) => x.gruende.length >= 1 && x.gruende[0]!.name === "Grund"));
  wahr("Gewicht und Anteil stehen", sch.every((x) => x.score > 0 && x.anteil > 0 && x.anteil <= 1));
  wahr("Konkurrenten mit Gewicht und Anteil, höchstens zwei", sch.some((x) => x.konkurrenten.length === 2) && sch.every((x) => x.konkurrenten.length <= 2 && x.konkurrenten.every((k) => k.score >= 0 && k.text)));
  wahr("ein Konkurrent ist nie der Gewinner", sch.every((x) => x.konkurrenten.every((k) => k.text !== x.atom)));
  // Gemeldet: „Anteil 1 % — Würfelglück" bei einem Gewinner nah an der Spitze. Jetzt Rang, Bester, Durchschnitt.
  wahr("jeder Schritt kennt seinen Rang im Feld", sch.every((x) => (x.rang ?? 0) >= 1 && (x.rang ?? 0) <= x.kandidaten));
  wahr("der Beste ist nie kleiner als der Gewinner", sch.every((x) => (x.bester ?? 0) >= x.score - 1e-9));
  wahr("der Durchschnitt liegt zwischen null und dem Besten", sch.every((x) => (x.durchschnitt ?? 0) > 0 && (x.durchschnitt ?? 0) <= (x.bester ?? 0) + 1e-9));
  wahr("Konkurrenten tragen ihren Rang", sch.every((x) => x.konkurrenten.every((k) => (k.rang ?? 0) >= 1)));
  const q2 = readFileSync("src/ui/studio.ts", "utf8");
  wahr("die Erläuterung urteilt nach Rang, nicht nach Anteil", /quant <= 0\.05 \|\| rang <= 2 \? "unter den Besten"/.test(q2) && /Platz \$\{rang\} von \$\{n\}/.test(q2) && /gegenüber dem Durchschnitt/.test(q2));
  // Dramaturgie: die Schritte sind die Schläge.
  setDramaData({ einstieg: ["Der Bote hört die Glocke"], mitte: ["Ein Netz aus Fäden", "Ein Fenster ohne Glas"], hoehepunkt: ["Die Glocke schweigt"], schluss: ["Zurück bleibt ein Ton"], ausloeser: ["ein Strick"], veraenderungen: ["die Zeit kippt"], konflikte: [], zeitanomalien: [], regeln: [] });
  const t4 = buildStory(BUILTIN_PRESETS["kafka"] as Bank, { ...inp, structure: "dramaturgie" } as never);
  setDramaData(null);
  const bau4 = zeitlupeLesen(t4).find((x) => x.name === "Bau")!;
  wahr("Dramaturgie: Schritte sind Schläge (einstieg zuerst)", !!bau4.schritte && bau4.schritte[0]!.phase === "einstieg" && bau4.schritte.every((x) => x.typ === "schlag"));
  // Gemeldet: Alle zwölf Schläge standen als „Erzählbogen" — jetzt meldet jeder seine wirkliche Quelle.
  {
    const q4 = bau4.schritte!.map((x) => x.quelle);
    wahr("der Haken kommt aus der Wortbank", bau4.schritte!.find((x) => x.phase === "hook")!.quelle === "wortbank");
    wahr("der Höhepunkt aus dem Bogen", bau4.schritte!.find((x) => x.phase === "hoehepunkt")!.quelle === "bogen");
    wahr("der Schluss aus der Wortbank (kein Bogen-Schluss war da)", bau4.schritte!.find((x) => x.phase === "schluss")!.quelle === "wortbank");
    wahr("der Einstieg trägt Kontext und Bogen", /^kontext/.test(bau4.schritte![0]!.quelle));
    wahr("nicht alle Schläge sind Erzählbogen", new Set(q4).size >= 3, [...new Set(q4)].join(","));
  }
  zeitlupeSchalten(false);
  buildStory(BUILTIN_PRESETS["kafka"] as Bank, inp);
  const q = readFileSync("src/ui/studio.ts", "utf8");
  wahr("der Bau-Layer hat den Schritt-Stapel", /class: "zl-schritte"/.test(q) && /Schritt \$\{x\.nr\} von \$\{sch\.length\}/.test(q));
  // Gewünscht: die Quellen an den Schritten.
  wahr("jeder Schritt trägt Farbe und Buchstabe seiner Quelle", /class: "zl-schritt " \+ q\.cls/.test(q) && /el\("span", \{ class: "zl-q" \}, q\.kurz\)/.test(q));
  // Gewünscht: der Fortschritt im Text in Quellfarben, nicht grün.
  wahr("der Text bis dahin ist eine Folge der Atome in Quellfarben", /for \(let j = 0; j <= zeitSchritt; j\+\+\)/.test(q) && /class: "zl-satz " \+ qv\(y\.quelle\)\.cls \+ \(j === zeitSchritt \? " zl-jetzt" : " zl-frueher"\)/.test(q));
  wahr("kein grünes Atom mehr im Schritt", !/class: "zl-satz zl-neu", title: "in diesem Schritt gesetzt"/.test(q));
  // Gewünscht: Der ganze Bau zeigt die Struktur aus den Schritten — alle Atome in Quellfarben.
  wahr("der ganze Bau: alle Atome in Quellfarben statt grün", /if \(zeitSchritt < 0\) \{\s*\n\s*const w = akt\.text/.test(q) && /for \(const y of sch\) \{\s*\n\s*if \(!y\.atom\) continue;\s*\n\s*t\.append\(el\("span", \{ class: "zl-satz " \+ qv\(y\.quelle\)\.cls/.test(q));
  // Gewünscht: die Herkunft der Wortbank — aus welchem Preset — beim Überfahren.
  wahr("Wortbank-Atome nennen ihr Preset (Suche in allen Presets)", /const presetHerkunft = \(text: string\): string =>/.test(q) && /for \(const \[id, p\] of Object\.entries\(getAllPresets\(\)\)\)/.test(q));
  wahr("… im Tooltip des Atoms, in der Kopfzeile und bei den Konkurrenten", /\(y\.quelle === "wortbank" \? "Preset " : ""\) \+ herkunft\(y\.quelle, y\.atom\)/.test(q) && /\$\{x\.quelle === "wortbank" \? "Preset " : ""\}\$\{herkunft\(x\.quelle, x\.atom\)\}/.test(q) && /herkunft\(q\.quelle, q\.text\)/.test(q));
  wahr("Wortbank: das Preset; Bogen: der Name des Bogens", /q === "wortbank" \? presetHerkunft\(text\) : \/bogen\|dramaturgie\/\.test\(q\) \? bogenName\(\) : ""/.test(q));
  // Gemeldet: „Die Tasche aus dem Erzählbogen?" — der Bogen trägt jetzt seinen Namen.
  wahr("der Bogen der Erzählerbank trägt seinen Titel", /drama\.name = `Erzählerbank: \$\{e\.titel \|\| "Ohne Titel"\}`/.test(readFileSync("src/features/erzaehlerbank.ts", "utf8")));
  wahr("der Preset-Bogen trägt das Preset, die Mischung alle Presets", /name: `Preset \$\{presetLabel/.test(q) && /name: `Presets \$\{multiIds/.test(q));
  wahr("die Kopfzeile nennt die Quelle beim Namen", /" — Quelle ", el\("span", \{ class: "zl-legende-item " \+ qv\(x\.quelle\)\.cls \}, qv\(x\.quelle\)\.name \+ /.test(q));
  wahr("eine Legende zählt die Quellen", /class: "muted mini zl-legende"/.test(q) && /sch\.filter\(\(x\) => x\.quelle === q\)\.length/.test(q));
  wahr("dieselben Farben wie die Editieren-Legende", /wortbank: \{ name: "Wortbank", cls: "feed-wb"/.test(q) && /dramaturgie: \{ name: "Erzählbogen", cls: "feed-drama"/.test(q));
  wahr("die Entscheidung mit Zerlegung und Konkurrenten steht daneben", /Konkurrenten, die es nicht wurden/.test(q) && /Zerlegung: /.test(q));
  const qa = readFileSync("src/atoms/assemble.ts", "utf8");
  wahr("die Zerlegung wird nur gerechnet, wenn die Zeitlupe an ist", /if \(ziehungOffenlegen\) \{/.test(qa));
}

console.log(`Prüfstand Zeitlupe — ${geprueft} Prüfungen, ${bestanden} bestanden`);
const proc = globalThis as unknown as { process?: { exit: (c: number) => void } };
if (fails.length) { console.error(`\n❌ Zeitlupe: ${fails.length} Fehler:`); fails.forEach((f) => console.error("  - " + f)); proc.process?.exit(1); }
else console.log(`\n✅ Zeitlupe: alle ${geprueft} Prüfungen bestanden.`);
