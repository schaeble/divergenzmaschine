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
  wahr("Schalter „Zeitlupe“ neben dem Bauplan", /ansicht\(planChk, "Bauplan"\), ansicht\(zeitChk, "Zeitlupe"\)/.test(q));
  wahr("der Schalter steuert den Rekorder", /zeitlupeSchalten\(on\)/.test(q));
  wahr("Stapel und Ebene liegen im Textfenster", /mkGenArrow\("left"\), spur, out, zeitEbene, zeitStapel, mkGenArrow\("right"\)/.test(q));
  wahr("nur im Editiermodus", /const sichtbar = on && feedsChk\.checked;/.test(q));
  wahr("jede Stufe ist ein klickbarer Layer", /class: "zl-layer"/.test(q) && /b\.addEventListener\("click", \(\) => \{ zeitStufe = letzte \? -1 : i; renderZeit\(\); \}\)/.test(q));
  wahr("die Ebene liegt über dem Text, der Text bleibt", /out\.classList\.add\("zl-unter"\)/.test(q) && !/out\.textContent = akt/.test(q));
  wahr("die letzte Stufe nimmt die Ebene weg (Editieren bleibt möglich)", /if \(zeitStufe < 0\) \{ zeitEbene\.style\.display = "none"/.test(q));
  wahr("Marken: neu, geändert, gefallen", /zl-" \+ sz\.marke/.test(q) && /zl-weg/.test(q));
  wahr("kein Abspielen mehr", !/Abspielen/.test(q) && !/f-zl-tempo/.test(q));
  wahr("nach jeder Erzeugung: Ebene weg, Stapel neu", /if \(zeitChk\.checked\) \{ zeitStufe = -1; renderZeit\(\); \}/.test(q));
}

console.log(`Prüfstand Zeitlupe — ${geprueft} Prüfungen, ${bestanden} bestanden`);
const proc = globalThis as unknown as { process?: { exit: (c: number) => void } };
if (fails.length) { console.error(`\n❌ Zeitlupe: ${fails.length} Fehler:`); fails.forEach((f) => console.error("  - " + f)); proc.process?.exit(1); }
else console.log(`\n✅ Zeitlupe: alle ${geprueft} Prüfungen bestanden.`);
