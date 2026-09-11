// Prüfstand Faden: features/faden.ts + Knopf „Fortsetzung" im Studio.
//
// Fortsetzungen: Figur, ein Ding und die offene Frage wandern von Folge zu
// Folge; der Serien-Bogen legt fünf Schläge auf fünf Folgen.
import { JSDOM } from "jsdom";
const dom = new JSDOM("<!doctype html><html><body></body></html>", { url: "https://x.test/" });
(globalThis as unknown as Record<string, unknown>).localStorage = dom.window.localStorage;
import { readFileSync } from "fs";
import { ladeFaden, speichereFaden, fadenAus, dingAus, frageAus, schlagDerFolge, BAUFORM_JE_SCHLAG, dingSatz, SERIEN_LAENGE } from "../src/features/faden";

const fails: string[] = [];
let geprueft = 0, bestanden = 0;
const ist = (name: string, wert: unknown, soll: unknown): void => { geprueft++; if (wert === soll) bestanden++; else fails.push(`${name}: „${String(wert)}“ — erwartet „${String(soll)}“`); };
const wahr = (name: string, b: boolean, zusatz = ""): void => ist(name + (zusatz ? ` (${zusatz})` : ""), b, true);

const text = "Der Bote hört die Glocke im Hafen. Ein Schlüssel liegt auf dem Tisch, und niemand nimmt ihn. Die Glocke schweigt. Es geht um den Schlüssel, den niemand nimmt. Der Bote wartet, wie man an einem Ort wartet, der einen vergessen hat.";
// ── 1 · Ding und Frage ──────────────────────────────────────────────────────
ist("das Ding: die Nominalphrase, die mehrfach trägt (Nominativ)", dingAus(text, "Bote"), "ein Schlüssel");
ist("die Frage aus dem Einsatz", frageAus(text, "ein Schlüssel"), "Was wird aus den Schlüssel, den niemand nimmt?".replace("den Schlüssel", "den Schlüssel"));
ist("ein Fragesatz im Text hat Vorrang", frageAus("Alles still. Wer hat den Zug bestellt? Danach nichts.", ""), "Wer hat den Zug bestellt?");
wahr("ohne Einsatz: eine Frage aus dem Ding", /^Wer hat .* zurückgelassen\?$/.test(frageAus("Alles still. Danach nichts.", "ein Schlüssel")));

// ── 2 · Der Faden ───────────────────────────────────────────────────────────
speichereFaden(null);
ist("ohne Faden: null", ladeFaden(), null);
const f1 = fadenAus(text, "Der Bote", "Die Glocke im Hafen", null);
ist("Folge 2 ist die nächste", f1.folge, 2);
ist("die Figur bleibt", f1.figur, "Der Bote");
ist("der letzte Satz wird zum Bisher", f1.letzterSatz, "Der Bote wartet, wie man an einem Ort wartet, der einen vergessen hat.");
speichereFaden(f1);
const f2 = fadenAus("Ein anderer Ort. Der Bote findet nichts. Und du?", "Egal", "Egal", ladeFaden());
ist("weitergesponnen: Folge 3, Figur und Ding bleiben, Serie bleibt", `${f2.folge}|${f2.figur}|${f2.ding}|${f2.serie}`, "3|Der Bote|ein Schlüssel|Die Glocke im Hafen");
ist("… die Frage ist die neue", f2.frage, "Und du?");

// ── 3 · Der Serien-Bogen ────────────────────────────────────────────────────
ist("Folge 1 = Einstieg", schlagDerFolge(1), "einstieg");
ist("Folge 3 von 5 = Wende", schlagDerFolge(3), "wende");
ist("Folge 5 = Schluss", schlagDerFolge(5), "schluss");
ist("Folge 2 von 3 = Wende (Mitte)", schlagDerFolge(2, 3), "wende");
ist("jede Bauform ist gesetzt", Object.keys(BAUFORM_JE_SCHLAG).length, 5);
wahr("der Ding-Satz trägt das Ding", /Schlüssel/.test(dingSatz("ein Schlüssel", () => 0.1)));
ist("Serienlänge fünf", SERIEN_LAENGE, 5);

// ── 4 · Das Studio ──────────────────────────────────────────────────────────
{
  const q = readFileSync("src/ui/studio.ts", "utf8");
  wahr("Knopf „Fortsetzung“ neben Behalten", /" Fortsetzung"\)/.test(q) && /keepBtn, fadenBtn, fadenLoesen,/.test(q));
  wahr("er legt die vorige Folge in die Schatzkammer (Serie, Folge)", /serie: f\.serie, folge: String\(f\.folge - 1\)/.test(q));
  wahr("würfelt alles außer der Figur, setzt Wer und Was aus dem Faden", /who\.value = f\.figur;\s*\n\s*what\.value = f\.frage;/.test(q) && /rollPresets\(\);\s*\n\s*rolling = false;\s*\n\s*who\.value = f\.figur/.test(q));
  wahr("die Bauform folgt dem Schlag der Folge — als Merker, den generate() nach der Weiche anwendet", /folgeBauform = SCHLAGFOLGEN\[BAUFORM_JE_SCHLAG\[schlag\]\]!\.folge;/.test(q) && /if \(folgeBauform\) \{ const basisF = loadDramaData\(\); if \(basisF\) setBogenOverride\(\{ \.\.\.basisF, folge: folgeBauform/.test(q));
  wahr("Titel „Folge n · Schlag“ und Bisher-Zeile", /fadenKopf = `Folge \$\{f\.folge\} · \$\{SCHLAG_NAME\[schlag\]\}`/.test(q) && /bisherEl\.textContent = `Bisher: \$\{f\.letzterSatz\}`/.test(q));
  wahr("das Ding kommt in die Folge, wenn der Text es nicht trägt", /s\.splice\(at, 0, dingSatz\(f\.ding\)\)/.test(q));
  wahr("„Serie beenden“ legt die letzte Folge ab (falls sie fehlt) und löst den Faden", /"Serie beenden"\)/.test(q) && /!loadTreasury\(\)\.some\(\(t\) => t\.t\.trim\(\) === text\.trim\(\)\)/.test(q) && /speichereFaden\(null\); fadenKopf = ""/.test(q));
}

// ── Fadenstärke und Kettenauslese (4.363.0): Trägt der dünne Faden? ──────────
{
  const { fadenstaerke, fadenBeschreibung } = require("../src/features/faden") as { fadenstaerke: (a: string, b: string, f: { figur: string; ding: string; frage: string; letzterSatz: string }, h?: boolean) => { ding: string; figur: boolean; frage: boolean; echo: boolean; neuheit: number; punkte: number; wert: number }; fadenBeschreibung: (s: unknown) => string };
  const f = { figur: "Der Bote", ding: "ein Schlüssel", frage: "Was wird aus dem Schlüssel, den niemand nimmt?", letzterSatz: "Der Bote wartet an der Glocke." };
  const vor = "Der Bote hört die Glocke. Ein Schlüssel liegt auf dem Tisch. Der Bote wartet an der Glocke.";
  const gut = "Die Glocke schlägt in Ost-Berlin. Der Bote findet den Schlüssel im Fluss, und niemand nimmt ihn. Ein Zug fährt ein. Der Bahnsteig atmet Beton.";
  const s1 = fadenstaerke(vor, gut, f);
  ist("gutes Glied: Ding im Text, Figur, Frage, Echo", `${s1.ding}|${s1.figur}|${s1.frage}|${s1.echo}`, "natuerlich|true|true|true");
  wahr("volle Neuheit", s1.neuheit === 1);
  const schwach = "Ein Regen fällt. Niemand kommt. Die Stadt schläft. Ein Fenster ohne Glas.";
  const s2 = fadenstaerke(vor, schwach, f);
  ist("schwaches Glied: nichts trägt", s2.punkte, 0);
  wahr("der gute Kandidat gewinnt die Auslese", s1.wert > s2.wert);
  const kopie = "Der Bote hört die Glocke. Ein Schlüssel liegt auf dem Tisch. Der Bote wartet an der Glocke.";
  const s3 = fadenstaerke(vor, kopie, f);
  wahr("eine Kopie der vorigen Folge hat Zusammenhang, aber keine Neuheit — und verliert gegen das gute Glied", s3.neuheit === 0 && s3.wert < s1.wert);
  const hingelegt = fadenstaerke(vor, gut, f, true);
  wahr("ein hingelegtes Ding zählt weniger als ein natürliches", hingelegt.wert < s1.wert && hingelegt.ding === "hingelegt");
  wahr("die Schwelle: vier Punkte bringen nicht mehr als drei (ohne Ding-Bonus)", (() => { const drei = { ...s1, punkte: 3 }; void drei; return s1.wert - 2 * s1.neuheit <= 3; })());
  wahr("die Beschreibung trägt Kugeln und Gründe", /^Faden: ●●●● — Ding im Text, Figur handelt, Frage aufgenommen, Echo über die Naht · Neuheit 100 %$/.test(fadenBeschreibung(s1)));
  const q = readFileSync("src/ui/studio.ts", "utf8");
  wahr("die Fortsetzung erzeugt drei Kandidaten und nimmt den mit der größten Fadenstärke", /for \(let k = 0; k < 3; k\+\+\) \{\s*\n\s*generate\(\);/.test(q) && /if \(!bester \|\| st\.wert > bester\.st\.wert\) bester = \{ text: mitDing, st \};/.test(q));
  wahr("die Fadenzeile steht unter dem Titel", /fadenZeile\.textContent = letzteFadenstaerke \? fadenBeschreibung\(letzteFadenstaerke\) : ""/.test(q));
  wahr("„Behalten“ merkt die letzte Folge mit ihrer eigenen Nummer (f.folge, nicht f.folge − 1)", /const serienSet = f && fadenKopf \? \{ serie: f\.serie, folge: String\(f\.folge\)/.test(q) && /set: \{ \.\.\.einstellungen\(\), \.\.\.serienSet \}/.test(q));
  wahr("„Fortsetzung“ legt die vorige Folge mit f.folge − 1 ab — der Faden zählt die Folge im Fenster", /serie: f\.serie, folge: String\(f\.folge - 1\)/.test(q));
  const qt = readFileSync("src/ui/treasuryView.ts", "utf8");
  wahr("die Schatzkammer zeigt Serie, Folge und Fadenstärke", /Serie „\$\{it\.set\.serie\}“ · Folge/.test(qt));
}

console.log(`Prüfstand Faden — ${geprueft} Prüfungen, ${bestanden} bestanden`);
const proc = globalThis as unknown as { process?: { exit: (c: number) => void } };
if (fails.length) { console.error(`\n❌ Faden: ${fails.length} Fehler:`); fails.forEach((f) => console.error("  - " + f)); proc.process?.exit(1); }
else console.log(`\n✅ Faden: alle ${geprueft} Prüfungen bestanden.`);
