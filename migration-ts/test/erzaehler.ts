// Prüfstand Erzählerbank: features/erzaehlerbank.ts, die Weiche in
// dramaturgie.ts und der Anschluss in Studio und Reiter.
//
// Gewünscht: Zehn Kurzgeschichten als Dramaturgie-Set, im Studio als Regler
// „Bogen" — fest gewählt, gewürfelt nur auf Wunsch, „aus Preset" wie bisher.
import { JSDOM } from "jsdom";
const dom = new JSDOM("<!doctype html><html><body></body></html>", { url: "https://x.test/" });
(globalThis as unknown as Record<string, unknown>).localStorage = dom.window.localStorage;
import { readFileSync } from "fs";
import { ladeErzaehlerbank, speichereErzaehlerbank, erzaehlerBogen, bogenFuerErzeugung, setzeQuelle, ladeQuelle, platzBrauchbar, ERZAEHLER_PLAETZE, bauePromptErzaehlung, BAUFORM_ANWEISUNG, archiviere, archivFuer, loescheAusArchiv, ARCHIV_JE_BAUFORM } from "../src/features/erzaehlerbank";
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

// ── 1 · Die Bank: zehn Plätze, stabil gegen Müll ────────────────────────────
ist("immer zehn Plätze", ladeErzaehlerbank().length, ERZAEHLER_PLAETZE);
localStorage.setItem("dm_erzaehlerbank_v1", "kaputt{");
ist("kaputter Speicher → zehn leere Plätze", ladeErzaehlerbank().filter((e) => !e.text).length, ERZAEHLER_PLAETZE);
const bank = ladeErzaehlerbank();
bank[2] = { titel: "Evolution", text: VORLAGE_EVOLUTION };
speichereErzaehlerbank(bank);
ist("gespeichert und gelesen", ladeErzaehlerbank()[2]!.titel, "Evolution");
wahr("brauchbar ab vierzig Wörtern", platzBrauchbar(bank[2]!) && !platzBrauchbar({ titel: "x", text: "zu kurz" }));

// ── 2 · Der Bogen je Platz ──────────────────────────────────────────────────
const b2 = erzaehlerBogen(2);
wahr("ein voller Platz liefert einen Bogen", !!b2 && b2.einstieg.length >= 1 && b2.schluss.length >= 1);
ist("ein leerer Platz liefert null", erzaehlerBogen(5), null);

// ── 3 · Die Wahl: fest, würfeln, aus Preset ─────────────────────────────────
setzeQuelle("2");
ist("die Wahl wird gehalten", ladeQuelle(), "2");
wahr("fest gewählt → der Bogen dieses Platzes", JSON.stringify(bogenFuerErzeugung()) === JSON.stringify(b2));
setzeQuelle("preset");
ist("aus Preset → null (der Preset-Bogen gilt)", bogenFuerErzeugung(), null);
setzeQuelle("wuerfeln");
wahr("würfeln → ein brauchbarer Bogen", !!bogenFuerErzeugung());
setzeQuelle("5");
ist("fest auf leerem Platz → null, die Maschine erzählt wie bisher", bogenFuerErzeugung(), null);
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
// Der Bogen hat bewusst KEIN Schloss: Der Würfel fasst ihn nicht an (nicht in
// ROLL_SELECTS), die Wahl ist ohnehin fest — ein Schloss schützte nichts.
wahr("das Studio hat den Bogen-Regler neben der Struktur", /lockField\("Struktur", structure\),[\s\S]{0,400}?el\("span", \{\}, "Bogen"\)\), bogenSel\)/.test(st));
wahr("der Bogen ist nicht würfelbar", !/ROLL_SELECTS = \[[^\]]*bogenSel/.test(st));
wahr("die Wahl wird beim Wechsel gesichert", /bogenSel\.addEventListener\("change", \(\) => setzeQuelle\(bogenSel\.value\)\)/.test(st));
wahr("vor jeder Erzeugung wird die Weiche gestellt", /setBogenOverride\(bogenFuerErzeugung\(\)\);\s*\n\s*const model = /.test(st));
const ap = readFileSync("src/ui/app.ts", "utf8");
wahr("der Reiter steht neben der Wortbank", /\["Wortbank", mountWordbank\],\s*\n\s*\["Erzählerbank", mountErzaehlerbank\],/.test(ap));
const ev = readFileSync("src/ui/erzaehlerbankView.ts", "utf8");
wahr("jeder Platz hat Titel, Text, Bogen-Vorschau, Einfügen, Speichern, Leeren",
  /Bogen zeigen/.test(ev) && /Einfügen/.test(ev) && /Platz leeren/.test(ev) && /preset2AusText\(textIn\.value\)\.drama/.test(ev));

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
  wahr("der Reiter hat den Vorlagen-Knopf", /"Vorlagen einsetzen \(leere Plätze\)"/.test(q2));
  wahr("er füllt nur leere Plätze", /if \(alle\[i\]!\.text\.trim\(\)\) continue;/.test(q2));
  wahr("belegte Plätze melden sich statt zu überschreiben", /"Kein Platz frei"/.test(q2));
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
  const alle = ladeErzaehlerbank();
  alle[0] = { ...ERZAEHLUNGEN_VORLAGEN[7]! };   // Katastrophe zuerst
  speichereErzaehlerbank(alle);
  const bogen = erzaehlerBogen(0)!;
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
  wahr("jeder Platz hat den KI-Knopf", /"KI: neu erzählen"/.test(qv));
  wahr("er erzählt in der Bauform des Platzes, Thema aus dem Titel", /kiErzaehlung\(folgeSel\.value, titelIn\.value\.trim\(\) \|\| undefined\)/.test(qv));
  wahr("Erfolg ersetzt den Platz und speichert", /alle\[i\] = \{ \.\.\.neu, folge: folgeSel\.value, geburt: folgeSel\.value \};\s*\n\s*speichereErzaehlerbank\(alle\)/.test(qv));
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
  wahr("die Auswahl gehört zur Bauform des Platzes", /archivFuer\(folgeSel\.value\)/.test(qa) && /folgeSel\.addEventListener\("change", fuelleArchiv\)/.test(qa));
  wahr("wählen lädt und speichert den Platz", /titelIn\.value = e\.titel; textIn\.value = e\.text;/.test(qa));
  wahr("Speichern und KI archivieren", (qa.match(/archiviere\(alle\[i\]!\);/g) || []).length === 2);
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
  wahr("die Auswahl kennzeichnet Geliehenes mit ⇄ und Namen", /e\.geburt && e\.geburt !== folgeSel\.value/.test(qg) && /` · ⇄ \$\{name\}`/.test(qg));
  wahr("Wählen trägt die Geburt in den Platz", /geburt: e\.geburt \|\| e\.folge/.test(qg));
  wahr("die KI setzt die Geburt auf ihre Bauform", /geburt: folgeSel\.value \}/.test(qg));
}

// ── „Alles zurücksetzen“ neben den Vorlagen ─────────────────────────────────
{
  const qz = readFileSync("src/ui/erzaehlerbankView.ts", "utf8");
  wahr("es gibt den Knopf neben den Vorlagen", /"Alles zurücksetzen"/.test(qz) && /vorlagenBtn, leerenBtn/.test(qz));
  wahr("er fragt nach, bevor er leert", /if \(!confirm\("Alle zehn Plätze leeren\?/.test(qz));
  // Nachgemeldet: Die zehn Bauformen werden wiederhergestellt, je Platz eine.
  wahr("er leert alle Plätze und stellt die zehn Bauformen wieder her", /folge: ERZAEHLUNGEN_VORLAGEN\[i\]\?\.folge \|\| "standard"/.test(qz));
  wahr("die Vorlagen tragen zehn verschiedene Bauformen", new Set(ERZAEHLUNGEN_VORLAGEN.map((e) => e.folge)).size === 10);
  wahr("das Archiv bleibt unangetastet (kein Archiv-Zugriff im Handler)", !/leerenBtn[\s\S]{0,600}speichereArchiv|leerenBtn[\s\S]{0,600}dm_erzaehler_archiv/.test(qz));
}

// ── Löschen aus dem Archiv: sichtbar beschriftet, mit Nachfrage und Namen ───
{
  const ql = readFileSync("src/ui/erzaehlerbankView.ts", "utf8");
  wahr("der Löschknopf ist beschriftet", /"Text löschen"/.test(ql));
  // Nachgemeldet: Das Löschen soll UNMITTELBAR wirken — die Nachfrage ist weg,
  // dafür ist der Knopf ohne Auswahl ausgegraut.
  wahr("er löscht unmittelbar ohne Nachfrage", !/archivWeg\.addEventListener\("click", \(\) => \{[\s\S]{0,400}?confirm/.test(ql));
}

// ── „Text löschen“ neben „Platz leeren“ — löscht die gewählte Geschichte sofort
{
  const qt = readFileSync("src/ui/erzaehlerbankView.ts", "utf8");
  wahr("der Knopf heißt „Text löschen“, kein × mehr", /"Text löschen"/.test(qt) && !qt.includes('}, "\u00d7")'));
  wahr("er steht neben „Platz leeren“", /speichern, leeren, archivWeg\)/.test(qt));
  wahr("er löscht unmittelbar, ohne Nachfrage", /archivWeg\.addEventListener\("click"/.test(qt) && !/archivWeg\.addEventListener\("click", \(\) => \{\s*\n\s*if \(!confirm/.test(qt));
  wahr("ohne Auswahl ist er ausgegraut", /archivWeg\.disabled = !liste\.length \|\| archivSel\.value === ""/.test(qt));
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
