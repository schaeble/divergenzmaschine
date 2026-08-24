// Prüfstand Nutzungszähler. Reine Rechnung.
//
// Der Zähler soll die eine Frage beantworten, die sich weder erinnern noch
// schätzen lässt: Was wird benutzt? Damit er das kann, muss er zwei Dinge
// richtig machen, die man leicht falsch macht.
import { readFileSync } from "fs";
import { JSDOM } from "jsdom";
const dom = new JSDOM("<!doctype html><html><body></body></html>", { url: "https://x.test/" });
(globalThis as unknown as Record<string, unknown>).localStorage = dom.window.localStorage;

import {
  merke, alsListe, seitWann, ladeNutzung, sichereNutzung, NUTZUNG_KEY, type Stand,
} from "../src/features/nutzung";

const fails: string[] = [];
const zeilen: string[] = [];
let geprueft = 0;
const ist = (name: string, wert: unknown, soll: unknown): void => {
  geprueft++;
  if (wert === soll) zeilen.push(`  ✓ ${name}`);
  else { zeilen.push(`  ✗ ${name}`); fails.push(`${name}: „${String(wert)}“ — erwartet „${String(soll)}“`); }
};
const wahr = (name: string, b: boolean): void => ist(name, b, true);

const TAG = 86400000;
const T0 = 1_700_000_000_000;

// ── 1 · Verbuchen ───────────────────────────────────────────────────────────
const s1 = merke({}, "Studio", T0);
ist("der erste Gebrauch zählt eins", s1.Studio?.n, 1);
ist("und merkt sich den Zeitpunkt", s1.Studio?.zuletzt, T0);
ist("auch als ersten", s1.Studio?.zuerst, T0);
const s2 = merke(s1, "Studio", T0 + TAG);
ist("der zweite zählt weiter", s2.Studio?.n, 2);
ist("der letzte Zeitpunkt rückt nach", s2.Studio?.zuletzt, T0 + TAG);
// Der ERSTE bleibt stehen — er beantwortet „seit wann wird gezählt", und ohne
// ihn wäre jede Zahl bedeutungslos: Zwei Aufrufe sind viel an einem Tag und
// nichts in acht Wochen.
ist("der erste Zeitpunkt bleibt stehen", s2.Studio?.zuerst, T0);
ist("ein leerer Name wird nicht verbucht", Object.keys(merke({}, "", T0)).length, 0);
ist("Leerraum auch nicht", Object.keys(merke({}, "   ", T0)).length, 0);
ist("verschiedene Namen zählen getrennt", Object.keys(merke(s2, "Korpus", T0)).length, 2);

// ── 2 · Die Liste ───────────────────────────────────────────────────────────
// DER KERNPUNKT: Die Liste zeigt, was es GIBT — nicht, was benutzt wurde. Ein
// Baustein, der nie geöffnet wurde, wäre sonst unsichtbar. Genau der ist aber
// die Antwort auf die Frage.
const alle = ["Studio", "Korpus", "Bildwelt", "Autopilot"];
const stand: Stand = {
  Studio: { n: 40, zuletzt: T0, zuerst: T0 - 30 * TAG },
  Korpus: { n: 3, zuletzt: T0 - 5 * TAG, zuerst: T0 - 20 * TAG },
};
const l = alsListe(stand, alle, T0);
ist("die Liste zeigt ALLE Bausteine", l.length, 4);
wahr("auch die nie benutzten", l.some((z) => z.id === "Bildwelt" && z.nie));
// Ungenutztes zuerst: Wer die Liste öffnet, sucht nicht den Spitzenreiter,
// sondern den Ballast.
wahr("Ungenutztes steht oben", l[0]!.nie && l[1]!.nie);
ist("dann das Seltenste", l[2]?.id, "Korpus");
ist("und zuletzt das Häufigste", l[3]?.id, "Studio");
ist("die Anzahl stimmt", l[3]?.n, 40);
ist("die Tage seit dem letzten Mal auch", l[2]?.tage, 5);
ist("heute benutzt ergibt null Tage", l[3]?.tage, 0);
ist("nie benutzt ergibt minus eins", l[0]?.tage, -1);
// Gegenprobe: Ohne Bausteinliste wäre die Auskunft wertlos — dann zeigte sie
// nur, was ohnehin schon benutzt wurde.
ist("ohne Bausteine ist die Liste leer", alsListe(stand, [], T0).length, 0);
ist("ein unbekannter Zähler taucht nicht auf",
  alsListe({ Geist: { n: 9, zuletzt: T0, zuerst: T0 } }, alle, T0).filter((z) => z.id === "Geist").length, 0);

// Seit wann gezählt wird — der FRÜHESTE Eintrag, nicht der letzte.
ist("seit dem frühesten Eintrag", seitWann(stand), T0 - 30 * TAG);
ist("ohne Einträge null", seitWann({}), 0);

// ── 3 · Speichern ───────────────────────────────────────────────────────────
wahr("die Zählung wandert in die Projektdatei", NUTZUNG_KEY.startsWith("divergenz_"));
localStorage.removeItem(NUTZUNG_KEY);
ist("ohne Eintrag ist es leer", Object.keys(ladeNutzung()).length, 0);
sichereNutzung(stand);
ist("Gesichertes kommt zurück", ladeNutzung().Studio?.n, 40);
localStorage.setItem(NUTZUNG_KEY, "{kein json");
ist("kaputter Inhalt ergibt eine leere Zählung", Object.keys(ladeNutzung()).length, 0);
localStorage.setItem(NUTZUNG_KEY, JSON.stringify([1, 2, 3]));
ist("eine Liste statt eines Objekts ebenso", Object.keys(ladeNutzung()).length, 0);
localStorage.setItem(NUTZUNG_KEY, JSON.stringify({ A: { n: "viele" }, B: { n: 2 }, C: { n: 0 } }));
ist("Unsinn in der Anzahl fällt weg", Object.keys(ladeNutzung()).join(","), "B");
ist("und fehlende Zeitpunkte werden null", ladeNutzung().B?.zuletzt, 0);

// ── 4 · Gezählt wird am Klick ───────────────────────────────────────────────
// Der erste Reiter wird beim Start gemountet, ohne dass ihn jemand gewählt
// hätte. Zählte man das Zeichnen mit, stünde „Studio" bei jedem Start höher
// und die Liste wäre unbrauchbar — sie misst dann die Startroutine, nicht die
// Benutzung.
const app = readFileSync("src/ui/app.ts", "utf8");
wahr("im Klick-Zuhörer wird gezählt", /addEventListener\("click", \(\) => \{[\s\S]{0,400}?zaehle\(name\);/.test(app));
ist("beim Zeichnen nicht", /zeichneLeiste[\s\S]{0,200}?nachName\.get\(erster\)\?\.\(content\);[\s\S]{0,80}?zaehle\(/.test(app), false);

// ── 5 · Die Textstruktur ist aus der Diagnose heraus ────────────────────────
// Sie zerlegt den zuletzt erzeugten Text nach Herkunft — eine Frage, die man
// WÄHREND des Schreibens stellt. Im Studio stand sie ohnehin schon; die
// Diagnose war ein zweiter Ort für dieselbe Sache.
const diag = readFileSync("src/ui/diagnoseView.ts", "utf8");
const studio = readFileSync("src/ui/studio.ts", "utf8");
ist("die Diagnose zeigt sie nicht mehr", /renderTextstruktur/.test(diag), false);
wahr("das Studio schon", /renderTextstruktur/.test(studio));
wahr("die Nutzungstabelle steht stattdessen dort", /Nutzung — was wird tatsaechlich benutzt/.test(diag));

// ── Ergebnis ────────────────────────────────────────────────────────────────
console.log(`Prüfstand Nutzung — ${geprueft} Prüfungen:`);
zeilen.forEach((z) => console.log(z));
const proc = globalThis as unknown as { process?: { exit: (c: number) => void } };
if (fails.length) {
  console.error(`\n❌ ${fails.length} Fehler beim Nutzungszähler:`);
  fails.forEach((f) => console.error("  - " + f));
  proc.process?.exit(1);
} else {
  console.log(`\n✅ Nutzung: alle ${geprueft} Prüfungen bestanden.`);
}
