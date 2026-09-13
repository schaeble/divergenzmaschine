// Prüfstand Namen-Wächter: features/namenwaechter.ts + Anbindung an Wortbank,
// Preset aus Text, Erzählerbank.
//
// Gewünscht: Namen (Vera, Tom …) in Wortbank- und Erzählerbank-Einträgen
// automatisch in sie/er umwandeln.
import { readFileSync } from "fs";
import { entnamen, namenMeldung } from "../src/features/namenwaechter";
import { VORNAMEN } from "../src/generation/namen.data";
import { BUILTIN_PRESETS } from "../src/presets.data";
import type { Bank } from "../src/types";

const fails: string[] = [];
let geprueft = 0, bestanden = 0;
const ist = (name: string, wert: unknown, soll: unknown): void => { geprueft++; if (wert === soll) bestanden++; else fails.push(`${name}: „${String(wert)}“ — erwartet „${String(soll)}“`); };
const wahr = (name: string, b: boolean, zusatz = ""): void => ist(name + (zusatz ? ` (${zusatz})` : ""), b, true);
const e = (t: string): string => entnamen(t).text;

wahr("die Liste kennt über vierhundert Vornamen", VORNAMEN.size > 400, String(VORNAMEN.size));
ist("Nominativ am Satzanfang", e("Vera geht durch den Hof."), "Sie geht durch den Hof.");
ist("Nominativ in der Satzmitte (Inversion)", e("Am Abend kommt Tom."), "Am Abend kommt er.");
ist("Akkusativ nach Verb", e("Er sieht Tom am Fenster."), "Er sieht ihn am Fenster.");
ist("Dativ nach Präposition", e("Mit Vera kommt der Regen."), "Mit ihr kommt der Regen.");
ist("Akkusativ nach Präposition", e("Für Tom bleibt nichts."), "Für ihn bleibt nichts.");
ist("Dativ als indirektes Objekt", e("Er gibt Vera den Schlüssel."), "Er gibt ihr den Schlüssel.");
ist("Genitiv → Possessiv, nach Genus des Nomens", e("Veras Mantel hängt; Toms Haus brennt."), "Ihr Mantel hängt; sein Haus brennt.");
ist("Possessiv vor Plural", e("Toms Bücher liegen da."), "Seine Bücher liegen da.");
ist("zwei Namen mit und", e("Vera und Tom warten."), "Sie und er warten.");
ist("Name mit Artikel bleibt", e("Der Tom kommt nicht."), "Der Tom kommt nicht.");
ist("Anrede am Satzanfang bleibt", e("Vera, komm!"), "Vera, komm!");
ist("unbekannter Name bleibt (Ebi)", e("Jetzt sucht Ebi den Hof."), "Jetzt sucht Ebi den Hof.");
ist("Wörter, die wie Namen aussehen, bleiben (August, Heide)", e("Im August über die Heide."), "Im August über die Heide.");
ist("kein Name: unverändert", e("Später bleibt eine Tasche stehen."), "Später bleibt eine Tasche stehen.");
wahr("die Meldung nennt Zahl und Beispiele", /^2 Namen ersetzt: Vera → sie, Tom → er$/.test(namenMeldung(entnamen("Vera und Tom warten."))));
// Gegenprobe: die eingebauten Presets tragen keine Vornamen — der Wächter ändert dort nichts Nennenswertes.
{
  let geaendert = 0, gesamt = 0;
  for (const b of Object.values(BUILTIN_PRESETS)) for (const l of Object.values(b as Bank)) if (Array.isArray(l)) for (const x of l as string[]) { gesamt++; if (entnamen(x).ersetzt.length) geaendert++; }
  wahr("höchstens ein halbes Prozent der eingebauten Bausteine wird angefasst", geaendert / gesamt < 0.005, `${geaendert} von ${gesamt}`);
}
{
  const qw = readFileSync("src/ui/wordbankView.ts", "utf8");
  wahr("Wortbank: „Alle übernehmen“ lässt den Wächter laufen und meldet", /const e = entnamen\(x\);/.test(qw) && /Namen-Wächter: \$\{namen\}/.test(qw));
  const qt = readFileSync("src/features/textpreset.ts", "utf8");
  wahr("Preset aus Text: jedes Teilstück ohne Namen", /entnamen\(u\.ok && u\.changed \? u\.text : s0\)\.text/.test(qt));
  const qe = readFileSync("src/ui/erzaehlerbankView.ts", "utf8");
  wahr("Erzählerbank: Speichern ersetzt Namen und meldet", /const ne = entnamen\(textIn\.value\);/.test(qe) && /namenMeldung\(ne\)/.test(qe));
}

console.log(`Prüfstand Namen-Wächter — ${geprueft} Prüfungen, ${bestanden} bestanden`);
const proc = globalThis as unknown as { process?: { exit: (c: number) => void } };
if (fails.length) { console.error(`\n❌ Namen-Wächter: ${fails.length} Fehler:`); fails.forEach((f) => console.error("  - " + f)); proc.process?.exit(1); }
else console.log(`\n✅ Namen-Wächter: alle ${geprueft} Prüfungen bestanden.`);
