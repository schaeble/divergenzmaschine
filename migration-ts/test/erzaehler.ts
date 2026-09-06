// Prüfstand Erzählerbank: features/erzaehlerbank.ts, die Weiche in
// dramaturgie.ts und der Anschluss in Studio und Reiter.
//
// Gewünscht: Zehn Kurzgeschichten als Dramaturgie-Set, im Studio als Regler
// „Bogen" — fest gewählt, gewürfelt nur auf Wunsch, „aus Preset" wie bisher.
import { JSDOM } from "jsdom";
const dom = new JSDOM("<!doctype html><html><body></body></html>", { url: "https://x.test/" });
(globalThis as unknown as Record<string, unknown>).localStorage = dom.window.localStorage;
import { readFileSync } from "fs";
import { ladeArbeitsplatz, speichereArbeitsplatz, bogenAus, bogenFuerErzeugung, setzeQuelle, ladeQuelle, platzBrauchbar, bauePromptErzaehlung, BAUFORM_ANWEISUNG, archiviere, archivFuer, loescheAusArchiv, ARCHIV_JE_BAUFORM,
  archivEintraege, eintragId, eintragNachId, loescheEintrag, bauformAendern, bogenBeschriftung, letzterGezogen, ableiteSchlagfolge } from "../src/features/erzaehlerbank";
import { SCHLAGFOLGEN } from "../src/features/erzaehlerbank";
import { SCHLAG_NAMEN, SCHLAG_STANDARD } from "../src/generation/dramaturgie";
import { DEFAULT_BANK } from "../src/constants";
import { buildStory } from "../src/generation/buildStory";
import type { GenInput } from "../src/types";
const inp: GenInput = { where: "im Hafen", when: "am Abend", who: "Der Bote", what: "hört die Glocke",
  tone: "mystery", varLevel: "wild", form: "prose", structure: "dramaturgie", mode: "myth", perspective: "third",
  rhythm: "auto", markovMode: "off", disruptor: "auto", archetypeA: "neutral", archetypeB: "psychopath",
  instability: 2, polish: false, polishStyle: "surreal_precise" };
import { ERZAEHLUNGEN_VORLAGEN } from "../src/features/erzaehlungen.data";
import { phasenAusSchlagfolge } from "../src/atoms/assemble";
import { STRUCTURE_OPTS } from "../src/generation/optionen";
import { saveKnobs, loadKnobs } from "../src/features/knobs";
import { preset2AusText } from "../src/features/textpreset";
import { setBogenOverride, loadDramaData, setDramaData, hasDramaData } from "../src/generation/dramaturgie";
import { VORLAGE_EVOLUTION } from "../src/features/textpreset";

const fails: string[] = [];
let geprueft = 0, bestanden = 0;
const ist = (name: string, wert: unknown, soll: unknown): void => {
  geprueft++;
  if (wert === soll) bestanden++;
  else fails.push(`${name}: „${String(wert)}“ — erwartet „${String(soll)}“`);
};
const wahr = (name: string, b: boolean): void => ist(name, b, true);

// ── 1 · Arbeitsplatz und Archiv, stabil gegen Müll ──────────────────────────
localStorage.setItem("dm_erzaehler_arbeitsplatz_v1", "kaputt{");
ist("kaputter Arbeitsplatz → leer", ladeArbeitsplatz().text, "");
speichereArbeitsplatz({ titel: "Evolution", text: VORLAGE_EVOLUTION, folge: "kreis" });
ist("Arbeitsplatz gespeichert und gelesen", ladeArbeitsplatz().titel, "Evolution");
ist("mit Bauform", ladeArbeitsplatz().folge, "kreis");
wahr("brauchbar ab vierzig Wörtern", platzBrauchbar(ladeArbeitsplatz()) && !platzBrauchbar({ titel: "x", text: "zu kurz" }));
localStorage.removeItem("dm_erzaehler_archiv_v1");
archiviere({ titel: "Evolution", text: VORLAGE_EVOLUTION, folge: "kreis" });
ist("das Archiv trägt sie", archivEintraege().length, 1);
const evoId = eintragId({ titel: "Evolution", text: VORLAGE_EVOLUTION, folge: "kreis" });
ist("die Kennung ist stabil und über die Kennung auffindbar", eintragNachId(evoId)!.titel, "Evolution");
ist("die Kennung hängt am Titel, nicht am Text", eintragId({ titel: "Evolution", text: VORLAGE_EVOLUTION + " Noch ein Satz.", folge: "kreis" }), evoId);

// ── 2 · Der Bogen einer Erzählung ───────────────────────────────────────────
const b2 = bogenAus(ladeArbeitsplatz());
wahr("eine volle Erzählung liefert einen Bogen", !!b2 && b2.einstieg.length >= 1 && b2.schluss.length >= 1);
ist("eine dünne liefert null", bogenAus({ titel: "x", text: "zu kurz" }), null);
wahr("die Bauform wird zur Schlagfolge", (b2!.folge || []).join(",") === SCHLAGFOLGEN["kreis"]!.folge.join(","));

// ── 3 · Die Wahl: fest, würfeln, aus Preset ─────────────────────────────────
setzeQuelle(evoId);
ist("die Wahl wird gehalten", ladeQuelle(), evoId);
wahr("fest gewählt → der Bogen dieses Eintrags", JSON.stringify(bogenFuerErzeugung()) === JSON.stringify(b2));
ist("und der gezogene Eintrag ist bekannt", letzterGezogen()!.titel, "Evolution");
setzeQuelle("preset");
ist("aus Preset → null (der Preset-Bogen gilt)", bogenFuerErzeugung(), null);
setzeQuelle("wuerfeln");
wahr("würfeln → ein brauchbarer Bogen aus dem Archiv", !!bogenFuerErzeugung());
setzeQuelle("a:standard:gibtsnicht");
ist("fest auf fehlendem Eintrag → null, die Maschine erzählt wie bisher", bogenFuerErzeugung(), null);
setzeQuelle("unsinn");
ist("Unsinn fällt auf preset zurück", ladeQuelle(), "preset");

// ── 4 · Die Weiche: Override gilt vor dem Preset-Bogen, ohne ihn anzutasten ─
setDramaData({ einstieg: ["Preset-Einstieg."], mitte: [], hoehepunkt: [], schluss: [], ausloeser: [], veraenderungen: [], konflikte: [], zeitanomalien: [], regeln: [] });
ist("ohne Override: der gespeicherte Bogen", loadDramaData()!.einstieg[0], "Preset-Einstieg.");
setBogenOverride(b2);
wahr("mit Override: der Erzähler-Bogen", loadDramaData()!.einstieg[0] !== "Preset-Einstieg.");
wahr("hasDramaData sieht ihn ebenfalls", hasDramaData());
setBogenOverride(null);
ist("abgeräumt: wieder der gespeicherte", loadDramaData()!.einstieg[0], "Preset-Einstieg.");
setDramaData(null);

// ── 5 · Der Anschluss ───────────────────────────────────────────────────────
const st = readFileSync("src/ui/studio.ts", "utf8");
wahr("das Studio hat den Bogen-Regler neben der Struktur", /lockField\("Struktur", structure\),[\s\S]{0,400}?el\("span", \{\}, "Bogen"\)\), bogenSel, bogenStatus\)/.test(st));
wahr("der Bogen ist nicht würfelbar", !/ROLL_SELECTS = \[[^\]]*bogenSel/.test(st));
wahr("der Regler zeigt das Archiv nach Bauform", /const alle = archivEintraege\(\)\.filter\(\(e\) => platzBrauchbar\(e\)\);/.test(st) && /el\("optgroup", \{ label: v\.name \}\)/.test(st));
wahr("die Wahl wird beim Wechsel gesichert", /bogenSel\.addEventListener\("change", \(\) => \{\s*\n\s*setzeQuelle\(bogenSel\.value\); bauformSync\(\);/.test(st));
wahr("vor jeder Erzeugung wird die Weiche gestellt", /setBogenOverride\(bogenFuerErzeugung\(\)\);[\s\S]{0,1200}?const model = /.test(st));
const ap = readFileSync("src/ui/app.ts", "utf8");
wahr("der Reiter steht neben der Wortbank", /\["Wortbank", mountWordbank\],\s*\n\s*\["Erzählerbank", mountErzaehlerbank\],/.test(ap));
const ev = readFileSync("src/ui/erzaehlerbankView.ts", "utf8");
wahr("ein Arbeitsplatz: Titel, Text, Bauform, Bogen-Vorschau, Einfügen, Speichern, Leeren, Archivliste",
  /Bogen zeigen/.test(ev) && /Einfügen/.test(ev) && /Arbeitsplatz leeren/.test(ev) && /preset2AusText\(textIn\.value\)\.drama/.test(ev) && /el\("optgroup", \{ label: v\.name \}\)/.test(ev));
wahr("„Im Studio wählen“ setzt die Quelle auf den Eintrag", /setzeQuelle\(eintragId\(ez\)\)/.test(ev));

// ── Die zehn eingebauten Vorlagen ───────────────────────────────────────────
// Gewünscht: zehn Geschichten mit unterschiedlichen Bögen, einsetzbar in die
// leeren Plätze.
{
  ist("es sind zehn", ERZAEHLUNGEN_VORLAGEN.length, 10);
  wahr("alle brauchbar (über der 40-Wörter-Schwelle)", ERZAEHLUNGEN_VORLAGEN.every((e) => platzBrauchbar(e)));
  ist("die Titel sind verschieden", new Set(ERZAEHLUNGEN_VORLAGEN.map((e) => e.titel)).size, 10);
  wahr("jede trägt Einstieg, Höhepunkt und Schluss", ERZAEHLUNGEN_VORLAGEN.every((e) => {
    const d = preset2AusText(e.text).drama;
    return d.einstieg.length >= 1 && d.hoehepunkt.length >= 1 && d.schluss.length >= 1;
  }));
  wahr("und die Texte sind verschieden lang gebaut (kein Klon)", new Set(ERZAEHLUNGEN_VORLAGEN.map((e) => e.text.length)).size === 10);
  const q2 = readFileSync("src/ui/erzaehlerbankView.ts", "utf8");
  wahr("der Reiter hat den Vorlagen-Knopf (ins Archiv)", /"Vorlagen ins Archiv"/.test(q2));
  wahr("er archiviert alle zehn mit ihrer Geburt", /for \(const v of ERZAEHLUNGEN_VORLAGEN\) archiviere\(\{ \.\.\.v, geburt: v\.folge \}\);/.test(q2));
}

// ── Schlagfolge: Die Bauform ordnet die Schläge wirklich um ─────────────────
// Gewünscht: Der Bogen soll auch die SCHLAGFOLGE variieren — „Katastrophe
// zuerst" beginnt mit dem Höhepunkt, „Kreisschluss" kehrt zum Einstieg
// zurück, „Rückwärts" beginnt mit dem Schluss.
{
  wahr("jede Bauform nennt nur gültige Schläge",
    Object.values(SCHLAGFOLGEN).every((f) => f.folge.every((n) => SCHLAG_NAMEN.has(n))));
  ist("die Standardfolge ist der steigende Bogen", SCHLAGFOLGEN["standard"]!.folge.join(","), SCHLAG_STANDARD.join(","));
  ist("Katastrophe zuerst beginnt mit dem Höhepunkt", SCHLAGFOLGEN["katastrophe"]!.folge[0], "hoehepunkt");
  ist("Rückwärts beginnt mit dem Schluss", SCHLAGFOLGEN["rueckwaerts"]!.folge[0], "schluss");
  ist("der Kreis endet am Einstieg", SCHLAGFOLGEN["kreis"]!.folge.at(-1), "einstieg");
  wahr("der stille Bogen verzichtet auf Wende und Höhepunkt",
    !SCHLAGFOLGEN["still"]!.folge.includes("wende") && !SCHLAGFOLGEN["still"]!.folge.includes("hoehepunkt"));
  wahr("das offene Ende lässt den Schluss aus", !SCHLAGFOLGEN["offen"]!.folge.includes("schluss"));
  wahr("jede Vorlage trägt ihre Bauform", ERZAEHLUNGEN_VORLAGEN.every((e) => !!e.folge && !!SCHLAGFOLGEN[e.folge!]));
  ist("und alle zehn Bauformen kommen vor", new Set(ERZAEHLUNGEN_VORLAGEN.map((e) => e.folge)).size, 10);
  // Wirkung am gebauten Text: „Katastrophe zuerst" stellt den Höhepunkt an
  // den Anfang — ohne „Und dann"-Formel; im Standard steht er hinten mit ihr.
  const bogen = bogenAus({ ...ERZAEHLUNGEN_VORLAGEN[7]! })!;   // Katastrophe zuerst
  wahr("der Bogen trägt die Folge der Bauform", (bogen.folge || []).join(",") === SCHLAGFOLGEN["katastrophe"]!.folge.join(","));
  setDramaData(bogen);
  // Der Ton darf einen Einleitungssatz davorschieben — deshalb zählen die
  // ersten drei Sätze als „Anfang", und die „Und dann"-Formel darf dort
  // nicht stehen.
  let vorn = 0;
  for (let i = 0; i < 12; i++) {
    const t = buildStory(DEFAULT_BANK, inp);
    const kopf = t.split(/(?<=[.!?…])\s+/).slice(0, 3).join(" ");
    if (!/Und dann:/.test(kopf) && bogen.hoehepunkt.some((h) => kopf.includes(h.slice(0, 18)))) vorn++;
  }
  wahr("der Höhepunkt steht am Anfang (12 Läufe, mehrmals getroffen)", vorn >= 6, String(vorn));
  setDramaData(null);
}

// ── Gemeldet aus einem Blatt: Wiederholung, Zeitkopf, Nebensatz-Schnitt ─────
{
  // 1) Kein Bogen-Satz zweimal im selben Text.
  const d1: import("../src/generation/dramaturgie").DramaData = { einstieg: ["Ein Absender ohne Namen, eine Schrift wie seine eigene"], mitte: ["Ein Absender ohne Namen, eine Schrift wie seine eigene", "Die zweite Zeile"],
    hoehepunkt: ["Der Gipfel"], schluss: [], ausloeser: [], veraenderungen: ["Alles dreht"], konflikte: [], zeitanomalien: [], regeln: [], folge: ["einstieg", "mitte", "mitte", "wende", "hoehepunkt"] };
  setDramaData(d1);
  let doppelt = 0;
  for (let i = 0; i < 20; i++) { const t = buildStory(DEFAULT_BANK, inp);
    if ((t.match(/eine Schrift wie seine eigene/g) || []).length > 1) doppelt++; }
  ist("kein Bogen-Satz zweimal im selben Text (20 Läufe)", doppelt, 0);
  // 2) „Dann, unvermittelt:" nie vor einem Satz, der selbst mit einem Zeitwort beginnt.
  const d2: import("../src/generation/dramaturgie").DramaData = { einstieg: ["Der Anfang steht"], mitte: [], hoehepunkt: ["Plötzlich weiß er alles"], schluss: [],
    ausloeser: ["Davor wartet er drei Tage neben dem Briefkasten"], veraenderungen: [], konflikte: [], zeitanomalien: [], regeln: [], folge: ["einstieg", "ausloeser", "hoehepunkt"] };
  setDramaData(d2);
  let zeitkopf = 0;
  for (let i = 0; i < 20; i++) { const t = buildStory(DEFAULT_BANK, inp);
    if (/(Dann, unvermittelt: Davor|Und dann: Plötzlich)/.test(t)) zeitkopf++; }
  ist("keine Zeit-Formel vor einem Zeitwort (20 Läufe)", zeitkopf, 0);
  setDramaData(null);
}

// ── Gemeldet, zweites Blatt: Wiederholung über Systemgrenzen, Nebensatz-Wann ─
{
  const d3: import("../src/generation/dramaturgie").DramaData = { einstieg: ["Der Anfang steht"], mitte: [], hoehepunkt: [], schluss: [],
    ausloeser: ["die Karten der Wahrsagerin zeigen zweimal denselben Tod"], veraenderungen: [], konflikte: [], zeitanomalien: [], regeln: [],
    folge: ["einstieg", "ausloeser", "wende"] };
  setDramaData(d3);
  const bankMitTurn = { ...DEFAULT_BANK, turns: ["die Karten der Wahrsagerin zeigen zweimal denselben Tod"] };
  let mehrfach = 0;
  for (let i = 0; i < 25; i++) { const t = buildStory(bankMitTurn, { ...inp, tension: "high" as never });
    if ((t.match(/Karten der Wahrsagerin/g) || []).length > 1) mehrfach++; }
  ist("Bogen-Auslöser und Bank-Wende mit gleichem Wortlaut: höchstens einmal (25 Läufe)", mehrfach, 0);
  const d4: import("../src/generation/dramaturgie").DramaData = { ...d3, ausloeser: [], folge: ["einstieg"] };
  setDramaData(d4);
  const t2 = buildStory(DEFAULT_BANK, { ...inp, when: "Nachdem die letzte Grenze fiel, als die Zeitungen schwiegen", where: "hoch in der Luft", polish: false });
  wahr("kein nacktes „… schwiegen hoch in der Luft.“", !/schwiegen hoch in der Luft\./i.test(t2));
  wahr("der Einstiegssatz schließt das Fragment mit Strich", /schwiegen hoch in der Luft — der Anfang steht/i.test(t2));
  setDramaData(null);
}

// ── KI: jeden Bogen für sich neu erzählen ───────────────────────────────────
// Gewünscht: die zehn Bögen sollen per KI erneuert werden können, jeder für
// sich. Offline prüfbar: der Prompt-Bau und die Verdrahtung des Knopfes.
{
  wahr("jede Bauform hat ihre Anweisung", Object.keys(SCHLAGFOLGEN).every((k) => !!BAUFORM_ANWEISUNG[k]));
  const pr = bauePromptErzaehlung("rueckwaerts", "Ein Brief im Fluss");
  wahr("der Prompt nennt die Bauform", /rückwärts erzählt: beginne mit dem Ende/.test(pr));
  wahr("und das Thema", /Ein Brief im Fluss/.test(pr));
  wahr("und verlangt JSON mit Titel und Text", /NUR mit JSON/.test(pr) && /"titel"/.test(pr) && /"text"/.test(pr));
  wahr("und die Wortspanne", /120 bis 170 Wörter/.test(pr));
  ist("unbekannte Bauform fällt auf die Standard-Anweisung", bauePromptErzaehlung("gibtsnicht").includes(BAUFORM_ANWEISUNG["standard"]!), true);
  const qv = readFileSync("src/ui/erzaehlerbankView.ts", "utf8");
  wahr("der Arbeitsplatz hat den KI-Knopf", /"KI: neu erzählen"/.test(qv));
  wahr("er erzählt in der Bauform des Platzes, Thema aus dem Titel", /kiErzaehlung\(folgeSel\.value, titelIn\.value\.trim\(\) \|\| undefined\)/.test(qv));
  wahr("Erfolg ersetzt den Arbeitsplatz und archiviert", /geburt = folgeSel\.value;\s*\n\s*titelIn\.value = neu\.titel; textIn\.value = neu\.text;\s*\n\s*const ez = aktuell\(\); speichereArbeitsplatz\(ez\); archiviere\(ez\);/.test(qv));
  wahr("Fehler stehen im Knopf, nichts scheitert stumm", /"KI-Fehler — noch einmal\?"/.test(qv));
}

// ── Archiv: mehrere Geschichten je Bauform, über den Titel wählbar ──────────
{
  localStorage.removeItem("dm_erzaehler_archiv_v1");
  archiviere({ titel: "Die Herde am Abhang", text: "Ein Text, der lang genug ist, um brauchbar zu sein. ".repeat(5), folge: "standard" });
  archiviere({ titel: "Der Fährmann", text: "Noch ein Text, der lang genug ist, um brauchbar zu sein. ".repeat(5), folge: "standard" });
  archiviere({ titel: "Das Haus", text: "Ein Kreis-Text, der lang genug ist, um brauchbar zu sein. ".repeat(5), folge: "kreis" });
  ist("zwei Geschichten unterm Steigenden Bogen", archivFuer("standard").length, 2);
  ist("neueste zuerst", archivFuer("standard")[0]!.titel, "Der Fährmann");
  ist("die Bauformen sind getrennt", archivFuer("kreis").length, 1);
  // Dedupe: gleicher Titel und Text rückt nur nach vorn.
  archiviere({ titel: "Die Herde am Abhang", text: "Ein Text, der lang genug ist, um brauchbar zu sein. ".repeat(5), folge: "standard" });
  ist("gleicher Titel und Text: kein Doppel", archivFuer("standard").length, 2);
  ist("aber wieder vorn", archivFuer("standard")[0]!.titel, "Die Herde am Abhang");
  // Gewünscht (4.335.7): Gleicher Titel, neuer Text = nur der Fortschritt
  // wird gespeichert, keine neue Version. Erst ein neuer Titel ist neu.
  archiviere({ titel: "Die Herde am Abhang", text: "Ein ganz anderer Text, der lang genug ist, um brauchbar zu sein. ".repeat(5), folge: "standard" });
  ist("gleicher Titel mit neuem Text: keine neue Version", archivFuer("standard").length, 2);
  wahr("aber der Text ist der neue", archivFuer("standard")[0]!.text.startsWith("Ein ganz anderer Text"));
  archiviere({ titel: "Die Herde am Abhang, zweiter Versuch", text: "Ein ganz anderer Text, der lang genug ist, um brauchbar zu sein. ".repeat(5), folge: "standard" });
  ist("neuer Titel: neue Version", archivFuer("standard").length, 3);
  // Ohne Titel gilt der Wortlaut — namenlose Texte überschreiben sich nicht.
  archiviere({ titel: "", text: "Namenlos eins, lang genug, um brauchbar zu sein, wirklich. ".repeat(5), folge: "standard" });
  archiviere({ titel: "", text: "Namenlos zwei, lang genug, um brauchbar zu sein, wirklich. ".repeat(5), folge: "standard" });
  ist("zwei namenlose Texte bleiben zwei Einträge", archivFuer("standard").length, 5);
  loescheAusArchiv("standard", 0);
  ist("löschen trifft den gewählten Eintrag", archivFuer("standard").length, 4);
  // Deckel.
  for (let k = 0; k < ARCHIV_JE_BAUFORM + 5; k++) archiviere({ titel: "T" + k, text: "Deckel-Text, der lang genug ist, um brauchbar zu sein. ".repeat(5), folge: "still" });
  ist("höchstens zwanzig je Bauform", archivFuer("still").length, ARCHIV_JE_BAUFORM);
  localStorage.removeItem("dm_erzaehler_archiv_v1");
  const qa = readFileSync("src/ui/erzaehlerbankView.ts", "utf8");
  wahr("die Liste zeigt ALLE Geschichten, nach Bauform gruppiert", /for \(const \[k, v\] of Object\.entries\(SCHLAGFOLGEN\)\) \{\s*\n\s*const gruppe = alle\.filter/.test(qa));
  wahr("wählen holt in den Arbeitsplatz", /titelIn\.value = x\.titel; textIn\.value = x\.text;/.test(qa));
  wahr("Speichern und KI archivieren", (qa.match(/archiviere\(ez\);/g) || []).length >= 2);
  // Löschen und Bauform ändern über die Kennung.
  archiviere({ titel: "Zum Löschen", text: VORLAGE_EVOLUTION, folge: "still" });
  const idL = eintragId({ titel: "Zum Löschen", text: VORLAGE_EVOLUTION, folge: "still" });
  loescheEintrag(idL);
  ist("löschen über die Kennung", eintragNachId(idL), null);
  archiviere({ titel: "Zieht um", text: VORLAGE_EVOLUTION, folge: "still", geburt: "still" });
  const idU = bauformAendern(eintragId({ titel: "Zieht um", text: VORLAGE_EVOLUTION, folge: "still" }), "offen");
  ist("Bauform ändern zieht ins andere Archiv, Geburt bleibt", eintragNachId(idU!)!.geburt, "still");
  ist("… und die neue Kennung trägt die Bauform", eintragNachId(idU!)!.folge, "offen");

}

// ── Herkunft festhalten: die Geburts-Bauform wandert mit ────────────────────
// Gewünscht (Option 1): Dieselbe Geschichte darf in jedem Bogen liegen, aber
// Geliehenes trägt ein Kennzeichen — die Archive laufen nicht leise zusammen.
{
  localStorage.removeItem("dm_erzaehler_archiv_v1");
  const txt = "Eine Geschichte, die lang genug ist, um brauchbar zu sein. ".repeat(5);
  archiviere({ titel: "Die Herde", text: txt, folge: "standard" });
  ist("beim ersten Archivieren wird die Geburt festgeschrieben", archivFuer("standard")[0]!.geburt, "standard");
  archiviere({ titel: "Die Herde", text: txt, folge: "kreis" });
  ist("unter fremder Bauform bleibt die Geburt erhalten", archivFuer("kreis")[0]!.geburt, "standard");
  archiviere({ titel: "Die Herde", text: txt + "Ganz neu erzählt. ", folge: "kreis" });
  ist("gleicher Titel, neuer Text: Fortschritt, die Geburt bleibt", archivFuer("kreis")[0]!.geburt, "standard");
  ist("und es bleibt EIN Eintrag unter Kreis", archivFuer("kreis").length, 1);
  archiviere({ titel: "Die Herde, neu", text: txt + "Ganz neu erzählt. ", folge: "kreis" });
  ist("neuer Titel = neue Geschichte, geboren hier", archivFuer("kreis")[0]!.geburt, "kreis");
  localStorage.removeItem("dm_erzaehler_archiv_v1");
  const qg = readFileSync("src/ui/erzaehlerbankView.ts", "utf8");
  wahr("die Auswahl kennzeichnet Geliehenes mit ⇄ und Namen", /const geliehen = x\.geburt && x\.geburt !== k;/.test(qg) && /· ⇄ \$\{SCHLAGFOLGEN\[x\.geburt!\]\?\.name \|\| x\.geburt\}/.test(qg));
  wahr("Wählen trägt die Geburt in den Arbeitsplatz", /geburt = x\.geburt \|\| x\.folge;/.test(qg));
  wahr("die KI setzt die Geburt auf ihre Bauform", /geburt = folgeSel\.value;/.test(qg));
}

// ── „Text löschen“ neben „Arbeitsplatz leeren“ — löscht die gewählte Geschichte sofort
{
  const qt = readFileSync("src/ui/erzaehlerbankView.ts", "utf8");
  wahr("der Knopf heißt „Text löschen“", /"Text löschen"/.test(qt));
  wahr("er steht in der Knopfzeile neben dem Leeren", /speichern, imStudio, leeren, archivWeg\)/.test(qt));
  wahr("er löscht unmittelbar, ohne Nachfrage", /archivWeg\.addEventListener\("click", \(\) => \{\s*\n\s*if \(!archivSel\.value\) return;\s*\n\s*if \(ladeQuelle\(\) === archivSel\.value\) setzeQuelle\("preset"\);\s*\n\s*loescheEintrag/.test(qt));
  wahr("„Archiv leeren“ fragt nach", /confirm\("Alle Geschichten aus dem Archiv löschen\?/.test(qt));
}

// ── Rekombination mit Bogen — der geregelte Mittelweg (4.337.0) ─────────────
{
  const V = ERZAEHLUNGEN_VORLAGEN;
  wahr("die Struktur steht zur Wahl", STRUCTURE_OPTS.some(([v]) => v === "bogen"));
  ist("Katastrophe zuerst beginnt im Umschlag", phasenAusSchlagfolge(SCHLAGFOLGEN["katastrophe"]!.folge)[0], "umschlag");
  ist("Rückwärts beginnt im Schluss", phasenAusSchlagfolge(SCHLAGFOLGEN["rueckwaerts"]!.folge)[0], "schluss");
  ist("Standard beginnt in der Exposition und endet im Schluss", phasenAusSchlagfolge(SCHLAGFOLGEN["standard"]!.folge).join(",").replace(/^exposition.*schluss$/, "ok"), "ok");
  ist("ohne Folge: die lineare Folge, zehn Schritte", phasenAusSchlagfolge(null).length, 10);
  // Die Stellschraube regelt von B nach A: Bogen-Wortanteil steigt mit ihr.
  const e = V[0]!; const d = preset2AusText(e.text).drama; d.folge = SCHLAGFOLGEN["standard"]!.folge; setDramaData(d);
  const bogenWoerter = new Set(e.text.toLowerCase().match(/[a-zäöüß]{6,}/g) || []);
  const anteil = (t: string): number => { const w = t.toLowerCase().match(/[a-zäöüß]{6,}/g) || []; return w.filter((x) => bogenWoerter.has(x)).length / Math.max(1, w.length); };
  const mess = (bogen: number): number => { saveKnobs({ ...loadKnobs(), bogen }); let sum = 0; for (let i = 0; i < 12; i++) sum += anteil(buildStory(DEFAULT_BANK, { ...inp, structure: "bogen" as never, lenTarget: 160, polish: false } as never)); return sum / 12; };
  const a0 = mess(0), a100 = mess(100), a250 = mess(250);
  wahr("0 % → 100 % → 250 %: der Bogen-Anteil steigt", a0 < a100 && a100 < a250, `${(a0*100).toFixed(0)} < ${(a100*100).toFixed(0)} < ${(a250*100).toFixed(0)}`);
  wahr("bei 0 % ist der Bogen praktisch stumm (unter 25 %)", a0 < 0.25, (a0*100).toFixed(0) + "%");
  wahr("bei 250 % trägt er (über 35 %)", a250 > 0.35, (a250*100).toFixed(0) + "%");
  saveKnobs({ ...loadKnobs(), bogen: 100 });
  setDramaData(null);
  const qs = readFileSync("src/ui/studio.ts", "utf8");
  wahr("der Studio-Hinweis kennt die neue Struktur", /structure\.value === "bogen" \? "Rekombination mit Bogen"/.test(qs));
  const qb = readFileSync("src/generation/buildStory.ts", "utf8");
  wahr("Auto würfelt sie nicht (sie braucht einen Bogen)", /x !== "bogen"\)/.test(qb));
}

// ── Bauplan für „Rekombination mit Bogen“ ───────────────────────────────────
// Gewünscht: ein Bauplan auch für die neue Struktur — bisher gab es keinen.
{
  const qp = readFileSync("src/ui/studio.ts", "utf8");
  wahr("der Bauplan schaltet sich auch bei „bogen“ ein", /const on = planChk\.checked && \(structure\.value === "rekombination" \|\| mitBogen\)/.test(qp));
  wahr("Kopfzeile nennt Bogen, Stellschraube und Bogen-Anteil", /Bausteinen aus dem Bogen/.test(qp) && /Erzählbogen \$\{loadKnobs\(\)\.bogen\} %/.test(qp) && /letzterGezogen\(\) \|\|/.test(qp));
  wahr("und die Phasenfolge aus der Schlagfolge", /"Phasenfolge: " \+ folge\.map/.test(qp));
  wahr("Bogen-Bausteine sind gekennzeichnet", /einstieg: "Bogen · Einstieg"/.test(qp) && /hoehepunkt: "Bogen · Höhepunkt"/.test(qp));
  const qh = readFileSync("src/ui/helpView.ts", "utf8");
  wahr("die Hilfe sagt es", /Bauplan \(Rekombination und Rekombination mit Bogen\)/.test(qh));
}

// ── Infoblasen in der Struktur-Ansicht: welcher Bogen geladen ist ───────────
{
  localStorage.removeItem("dm_erzaehler_archiv_v1");
  const lt = { titel: "Der Leuchtturm", text: "Ein Text, der lang genug ist, um brauchbar zu sein. ".repeat(6), folge: "still" };
  archiviere(lt);
  setzeQuelle(eintragId(lt)); bogenFuerErzeugung();
  ist("fester Eintrag: die Blase nennt den Titel", bogenBeschriftung().bogen, "Der Leuchtturm");
  ist("und die Bauform", bogenBeschriftung().bauform, "Stiller Bogen");
  setzeQuelle("wuerfeln"); bogenFuerErzeugung();
  ist("beim Würfeln: der konkret gezogene Eintrag", letzterGezogen()!.titel, "Der Leuchtturm");
  wahr("und die Blase sagt „gewürfelt“", /^gewürfelt: Der Leuchtturm$/.test(bogenBeschriftung().bogen));
  setzeQuelle("preset"); bogenFuerErzeugung();
  ist("aus Preset: die Blase sagt es", bogenBeschriftung().bogen, "aus Preset");
  const qv = readFileSync("src/ui/structureView.ts", "utf8");
  wahr("die Struktur-Ansicht zeichnet Bogen, Bauform, Phasenfolge", /\["Bogen", snap\.bogen\]/.test(qv) && /\["Bauform", snap\.bauform\]/.test(qv) && /\["Phasenfolge", snap\.phasenfolge\]/.test(qv));
  const qs2 = readFileSync("src/ui/studio.ts", "utf8");
  wahr("der Schnappschuss trägt sie beim Erzeugen ein", /const b = bogenBeschriftung\(\);/.test(qs2) && /out\.phasenfolge = phasenAusSchlagfolge/.test(qs2));
  localStorage.removeItem("dm_erzaehler_archiv_v1");
}

// ── Die Blasen sind schaltbar ───────────────────────────────────────────────
{
  const qs3 = readFileSync("src/ui/studio.ts", "utf8");
  wahr("Bogen und Bauform gehen als Auswahlfelder in die Schnellwahl", /\.\.\.\(snap\?\.bogen \? \{ Bogen: bogenSel, Bauform: bauformSel \} : \{\}\)/.test(qs3));
  wahr("die Bauform-Auswahl zieht den Eintrag ins andere Archiv um", /const neuId = bauformAendern\(q, bauformSel\.value\);/.test(qs3));
  wahr("bei „aus Preset“/„würfeln“ ist die Bauform nicht schaltbar", /bauformSel\.disabled = !e;/.test(qs3));
  wahr("kein Schloss an den Bogen-Blasen", /sel === bogenSel \|\| sel === bauformSel \? null : lockBtn\(sel\)/.test(qs3));
  const qv2 = readFileSync("src/ui/structureView.ts", "utf8");
  wahr("der gezogene Platz bleibt als eigene Info-Blase", /\["Gezogen", snap\.bogen\.replace/.test(qv2));
}

// ── Punkt 1 des Zielbilds: Kopplung Bogen ↔ Struktur ────────────────────────
{
  const q1 = readFileSync("src/ui/studio.ts", "utf8");
  wahr("die Wahl eines Bogens stellt die Struktur auf Dramaturgie", /if \(bogenSel\.value !== "preset" && form\.value === "prose" && structure\.value !== "dramaturgie" && structure\.value !== "bogen"\) \{\s*\n\s*strukturVorher = structure\.value;\s*\n\s*structure\.value = "dramaturgie";/.test(q1));
  wahr("… sichtbar und rücknehmbar", /zurück auf „\$\{/.test(q1) && /structure\.value = strukturVorher!; strukturVorher = null;/.test(q1));
  wahr("unter dem Regler steht, ob der Bogen wirkt", /bogenStatus\.append\("wirkt nicht: Struktur ist „/.test(q1) && /wirkt nicht: nur bei Form „Prosa“/.test(q1) && /wirkt nicht: der gewählte Eintrag fehlt im Archiv/.test(q1));
  wahr("die Statuszeile hängt am Regler", /el\("span", \{\}, "Bogen"\)\), bogenSel, bogenStatus\)/.test(q1));
  wahr("Struktur- und Formwechsel zeichnen sie neu", /form\.addEventListener\("change", bogenStatusMalen\)/.test(q1));
  wahr("„aus Preset“ löscht die Rücknahme", /if \(bogenSel\.value === "preset"\) strukturVorher = null;/.test(q1));
}

// ── Punkt 4 des Zielbilds: die Erzählerbank lernt ───────────────────────────
{
  // (a) Eigene Schlagfolge aus dem Text.
  wahr("die Bauform „eigen“ steht zur Wahl", !!SCHLAGFOLGEN["eigen"]);
  const f = ableiteSchlagfolge(ERZAEHLUNGEN_VORLAGEN[1]!.text);   // Kreisschluss
  ist("beginnt mit dem Einstieg", f[0], "einstieg");
  ist("endet mit dem Schluss", f[f.length - 1], "schluss");
  wahr("trägt genau einen Höhepunkt", f.filter((x) => x === "hoehepunkt").length === 1);
  wahr("höchstens zwölf Schläge", f.length <= 12, String(f.length));
  wahr("keine zwei gleichen in Folge", f.every((x, i) => i === 0 || x !== f[i - 1]));
  wahr("die Folge stammt aus dem Text (Wende vor Höhepunkt)", f.indexOf("wende") < f.indexOf("hoehepunkt"));
  ist("ohne Text: die Standardfolge", ableiteSchlagfolge("").join(","), SCHLAGFOLGEN["standard"]!.folge.join(","));
  // bogenAus setzt sie in den Override.
  ist("bogenAus trägt die abgeleitete Folge", (bogenAus({ titel: "Haus", text: ERZAEHLUNGEN_VORLAGEN[1]!.text, folge: "eigen" })!.folge || []).join(","), f.join(","));
  // (c) Aus der Schatzkammer zurück.
  const qt = readFileSync("src/ui/treasuryView.ts", "utf8");
  wahr("die Schatzkammer hat den Knopf → Erzählerbank", /button\("→ Erzählerbank"\)/.test(qt));
  wahr("er legt in den Arbeitsplatz, archiviert und wählt im Studio", /speichereArbeitsplatz\(ez\);\s*\n\s*archiviere\(ez\);\s*\n\s*setzeQuelle\(eintragId\(ez\)\);/.test(qt));
  wahr("mit eigener Schlagfolge", /folge: "eigen", geburt: "eigen"/.test(qt));
  const qv = readFileSync("src/ui/erzaehlerbankView.ts", "utf8");
  wahr("„Bogen zeigen“ nennt die abgeleitete Schlagfolge", /Schlagfolge \(abgeleitet\): /.test(qv));
}

console.log(`Prüfstand Erzählerbank — ${geprueft} Prüfungen, ${bestanden} bestanden`);
const proc = globalThis as unknown as { process?: { exit: (c: number) => void } };
if (fails.length) {
  console.error(`\n❌ Erzählerbank: ${fails.length} Fehler:`);
  fails.forEach((f) => console.error("  - " + f));
  proc.process?.exit(1);
} else {
  console.log(`\n✅ Erzählerbank: alle ${geprueft} Prüfungen bestanden.`);
}
