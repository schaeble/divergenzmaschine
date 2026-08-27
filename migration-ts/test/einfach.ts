// Prüfstand: der einfache Kopf über dem Studio.
//
// Vier Entscheidungen statt siebenunddreißig Reglern. Welche vier, ist nicht
// geraten: Der Wirkungsmesser sagt, dass die FORM mit rund 50 ausschlägt,
// während Struktur (1,47), Modus (2,15) und Ton (2,08) auf oder unter dem
// Rauschniveau der Blindprobe (~1,9) liegen. Ein einfacher Kopf, der Ton und
// Struktur anböte, böte Knöpfe an, die nichts tun.
//
// Die wichtigste Prüfung hier ist die vorletzte: dass der Kopf in die ECHTEN
// Regler schreibt. Ein Kopf mit eigenen Werten wäre die zweite Liste, gegen die
// der Wächter gebaut wurde — und der Schaltplan zeigte etwas anderes als das
// Studio, der Fehler, der zuletzt drei Anläufe gekostet hat.
import { readFileSync } from "fs";
import { JSDOM } from "jsdom";
const dom = new JSDOM("<!doctype html><html><body></body></html>", { url: "https://x.test/" });
(globalThis as unknown as Record<string, unknown>).localStorage = dom.window.localStorage;

import {
  zerlegeSaat, stellung, saatVorrat, ziehSaat, kopfKontext, KOPF_FORMEN, LAENGE_STUFEN, REIBUNG_STUFEN,
  LAENGE_NAMEN, REIBUNG_NAMEN, PROBEN, SAAT_BEISPIELE, KOPF_KEY, probeAus, VORGABE,
} from "../src/features/einfach";
import { FORM_OPTS } from "../src/generation/optionen";

const fails: string[] = [];
const zeilen: string[] = [];
let geprueft = 0;
const ist = (name: string, wert: unknown, soll: unknown): void => {
  geprueft++;
  if (wert === soll) zeilen.push(`  ✓ ${name}`);
  else { zeilen.push(`  ✗ ${name}`); fails.push(`${name}: „${String(wert)}“ — erwartet „${String(soll)}“`); }
};
const wahr = (name: string, b: boolean): void => ist(name, b, true);

// ── 1 · Ein Satz wird zu vier W ─────────────────────────────────────────────
// Der Kopf fragt nach EINEM Satz, nicht nach vier Feldern. „Ein Wachmann am
// Hafen, 1953" schreibt man in drei Sekunden, vier Felder füllt man in zwanzig.
const a = zerlegeSaat("Ein Wachmann am Hafen, 1953.");
ist("die Figur wird erkannt", a.who, "Ein Wachmann");
ist("der Ort auch", a.where, "am Hafen");
ist("und die Zeit", a.when, "im Jahr 1953");
const b = zerlegeSaat("Der Bote bringt, was niemand hören will.");
ist("ohne Ort und Zeit bleibt die Figur", b.who, "Der Bote");
ist("und der Vorgang steht im Was", b.what, "bringt, was niemand hören will");
// Beim Herausschneiden entstehen sonst doppelte Leerzeichen und hängende
// Kommas — sie stünden so in den Feldern und von dort im Text.
for (const s of SAAT_BEISPIELE) {
  const v = zerlegeSaat(s);
  const alle = [v.who, v.where, v.when, v.what].join("|");
  wahr(`kein doppeltes Leerzeichen bei „${s.slice(0, 28)}…“`, !/ {2}/.test(alle));
  wahr("und kein hängendes Komma", !/[,;]\s*$/.test(v.who));
}
// Ohne erkennbares Verb bleibt das Was LEER. Eines zu erfinden wäre schlechter
// als keines — der Generator füllt es dann selbst.
ist("ohne Verb kein erfundenes Was", zerlegeSaat("Nur ein Wort").what, "");
ist("ein leerer Satz ergibt leere Felder", zerlegeSaat("").who, "");
ist("und stürzt nicht ab", typeof zerlegeSaat("").what, "string");

// ── 2 · Die Stellung ────────────────────────────────────────────────────────
const st = stellung({ form: 0, laenge: 2, reibung: 2, saat: "Ein Wachmann am Hafen, 1953." });
ist("die Form kommt aus der Wahl", st.form, KOPF_FORMEN[0]![0]);
ist("die Länge aus der Stufe", st.lenTarget, LAENGE_STUFEN[2]);
ist("die Reibung ergibt drei Presets", st.presets, REIBUNG_STUFEN[2]);
ist("und der Kontext ist zerlegt", st.ctx.where, "am Hafen");
// Unsinn darf nicht durchschlagen: Ein Index außerhalb der Liste wäre sonst
// „undefined" in einem Reglerfeld.
ist("ein zu großer Index wird geklammert",
  stellung({ form: 99, laenge: 99, reibung: 99, saat: "" }).form, KOPF_FORMEN[KOPF_FORMEN.length - 1]![0]);
ist("ein negativer auch", stellung({ form: -5, laenge: -5, reibung: -5, saat: "" }).lenTarget, LAENGE_STUFEN[0]);

// Jede angebotene Form muss es wirklich geben — sonst hat der Kopf einen Knopf,
// der ins Leere zeigt.
for (const [f] of KOPF_FORMEN) {
  wahr(`die Form „${f}“ steht in den Reglerlisten`, FORM_OPTS.some(([v]) => v === f));
}
ist("es gibt drei Längenstufen", LAENGE_STUFEN.length, LAENGE_NAMEN.length);
ist("und drei Reibungsstufen", REIBUNG_STUFEN.length, REIBUNG_NAMEN.length);
ist("zu jeder Reibungsstufe gibt es eine Probe", PROBEN.length, REIBUNG_STUFEN.length);
// Die Probe muss die Reibung ZEIGEN: mehr Stufe, mehr Register im selben Satz.
wahr("die erste Probe hat ein Register", PROBEN[0]!.register.length === 1);
wahr("die letzte hat mehr", PROBEN[2]!.register.length > PROBEN[0]!.register.length);
wahr("und zwei Farben im Satz", PROBEN[2]!.teile.some(([, r]) => r === 2));
ist("die erste Probe hat nur eine Farbe", PROBEN[0]!.teile.every(([, r]) => r === 1), true);

wahr("die Wahl wandert in die Projektdatei", KOPF_KEY.startsWith("divergenz_"));

// ── 3 · Der Kopf schreibt in die ECHTEN Regler ──────────────────────────────
// Die Kernregel. Eine bloße Zuweisung ginge nur den halben Weg: An den
// change-Ereignissen hängen die Wortbank, der Anlagenstand für den Schaltplan
// und die Merkzettel für den Reiterwechsel. Genau das haben wir zuletzt dreimal
// hintereinander gelernt.
const q = readFileSync("src/ui/studio.ts", "utf8");
const block = q.slice(q.indexOf("const kopfLos"), q.indexOf("const reihe = (marke"));
wahr("der Kopf setzt die echte Form", /form\.value = st\.form/.test(block));
wahr("und löst aus", /form\.dispatchEvent\(new Event\("change"\)\)/.test(block));
wahr("er setzt den echten Längenschieber", /lenSlider\.value = String\(st\.lenTarget\)/.test(block));
wahr("und löst auch dort aus", /lenSlider\.dispatchEvent/.test(block));
wahr("er schreibt in die vier W", /feld\.dispatchEvent\(new Event\("input"\)\)/.test(block));
// Seit 4.323.1 wuerfelt der Erzeugen-Knopf die Presets NICHT mehr: Der
// Reibungsregler schreibt sofort in die echte Auswahl — Kopf und Studio waren
// sonst „nicht synchron", und das Wuerfeln ersetzte eine Handauswahl
// kommentarlos.
const reibBlock = q.slice(q.indexOf('reibungIn.addEventListener("input"'), q.indexOf("// Studio -> Kopf"));
wahr("der Regler schreibt sofort in die echte Auswahl", /applySelection\(ids\)/.test(reibBlock));
wahr("ohne Auswahl zieht er gespreizt", /waehleGespreizt\(vorrat, ziel\)/.test(reibBlock));
wahr("beim Runterdrehen bleibt Angekreuztes stehen", /ids\.slice\(0, ziel\)/.test(reibBlock));
wahr("beim Hochdrehen wird nach Mischabstand ergänzt", /ergaenzeGespreizt\(ids, ziel, vorrat\)/.test(reibBlock));
// Und das Blaettern in der Probe stellt das naechste Register wirklich ein —
// seit die Probe die echte Auswahl zeigt, waere ein blosser Anzeige-Index
// ein toter Knopf (gemeldet).
const blaetterBlock = q.slice(q.indexOf('probeBox.addEventListener("click"'), q.indexOf("const kopfLos"));
wahr("weiterblättern stellt das nächste Register ein", /applySelection\(ergaenzeGespreizt\(/.test(blaetterBlock));
wahr("und hält am Preset-Schloss an", /locked\.has\(preset\.id\)/.test(blaetterBlock));
wahr("und der Erzeugen-Knopf würfelt nicht mehr um", !/waehleGespreizt\(vorrat, st\.presets\)/.test(block));
// SCHLÖSSER halten auch hier: Wer einen Regler festgehalten hat, will ihn nicht
// von einem Kopf überschrieben bekommen.
for (const feld of ["form", "lenSlider"]) {
  wahr(`ein Schloss auf „${feld}“ hält`, new RegExp(`locked\\.has\\(${feld}\\.id\\)`).test(block));
}
// Das Preset-Schloss haelt dort, wo seit 4.323.1 geschrieben wird: am Regler.
wahr("ein Schloss auf „preset“ hält (am Reibungsregler)", /locked\.has\(preset\.id\)/.test(reibBlock));
wahr("auch auf den vier W", /locked\.has\(feld\.id\)/.test(block));
// Und keine zweite Ablage für Reglerwerte: Der Kopf merkt sich nur die vier
// Entscheidungen, nicht deren Auswirkung.
ist("der Kopf führt keine eigenen Reglerwerte",
  /divergenz_einfach_v1[\s\S]{0,400}tone|rhythm|structure/.test(readFileSync("src/features/einfach.ts", "utf8").slice(0, 200)), false);

// ── 2b · Zerlegung: Adjektiv im Ort, erweiterte Verben, Würfelvorrat ───────
// Gemeldet (4.326.0): Der Saat-Würfel kannte nur fünf feste Beispiele.
// Jetzt schöpft er aus Live-Pool und Welt — und die Zerlegung muss die
// Welt-Sätze wieder auseinanderbekommen.
{
  const z1 = zerlegeSaat("Eine Uhrmacherin in einer schlaflosen Stadt");
  ist("ein Ort mit kleingeschriebenem Adjektiv wird erkannt", z1.where, "in einer schlaflosen Stadt");
  ist("… und die Figur bleibt sauber", z1.who, "Eine Uhrmacherin");
  // Das Wetter-Beispiel aus dem Blatt: „… in einer kleinen Stadt hält den
  // Verband" stand komplett im WER.
  const z2 = zerlegeSaat("Ein Wachmann in einer kleinen Stadt hält den Verband");
  ist("das gemeldete Blatt-Beispiel zerfällt jetzt richtig", z2.where, "in einer kleinen Stadt");
  ist("… mit dem Vorgang im Was", z2.what, "hält den Verband");
  const z3 = zerlegeSaat("Eine Archivarin entdeckt ein zweites Testament");
  ist("die Welt-Verben trennen Figur und Vorgang", z3.what, "entdeckt ein zweites Testament");
  // Nebensätze tragen ihr Verb am Ende — dort darf die Trennung nicht
  // zuspringen. Gemessen (4.326.1): Mit der wachsenden Verbliste zerfiel
  // „Ein Kind, das nur nachts spricht" sonst mitten in der Figur.
  const z4 = zerlegeSaat("Ein Kind, das nur nachts spricht entdeckt ein Signal aus dem Nichts");
  ist("ein Relativsatz-Verb trennt nicht", z4.who, "Ein Kind, das nur nachts spricht");
  ist("… erst das Hauptverb danach", z4.what, "entdeckt ein Signal aus dem Nichts");
  const z5 = zerlegeSaat("Eine Klinik, die den Namen wechselt");
  ist("ein reiner Relativsatz bleibt ganz in der Figur", z5.who, "Eine Klinik, die den Namen wechselt");
  ist("… und erfindet kein Was", z5.what, "");
  // Und der Welt-Satz wird mit der Probe aufs Exempel gebaut: Eine Figur mit
  // Relativsatz-Verb bekommt den Vorgang nur, wenn die Zerlegung ihn danach
  // wiederfindet.
  const mitRelativ = saatVorrat([], { who: "ein Kind, das nur nachts spricht", where: "in einem Museum nach Schließung", when: "", what: "entdeckt ein zweites Testament" });
  const rs = mitRelativ.find((v) => v.includes("Kind"));
  wahr("die Relativsatz-Figur bekommt ihren Satz", !!rs);
  const rz = zerlegeSaat(rs || "");
  ist("… und er zerfällt richtig: der Ort", rz.where, "in einem Museum nach Schließung");
  ist("… der Vorgang", rz.what, "entdeckt ein zweites Testament");

  const vorrat = saatVorrat(
    ["ein Rad, das sich ohne Achse dreht", "zu kurz", "x".repeat(90)],
    { who: "eine Kartographin ohne Karten", where: "in einem verlassenen Bahnhof", when: "kurz vor Mitternacht", what: "entdeckt ein zweites Testament" },
  );
  wahr("die festen Beispiele bleiben der Boden", SAAT_BEISPIELE.every((b) => vorrat.includes(b)));
  wahr("Pool-Phrasen kommen großgeschrieben und mit Punkt", vorrat.includes("Ein Rad, das sich ohne Achse dreht."));
  wahr("zu kurze Schnipsel bleiben draußen", !vorrat.some((v) => v.includes("zu kurz")));
  // Nur die POOL-Phrasen sind gedeckelt — der Welt-Satz darf länger sein.
  wahr("überlange auch", !vorrat.some((v) => /xxxxx/.test(v)));
  const weltSatz = vorrat.find((v) => v.includes("Kartographin"));
  wahr("die Welt liefert einen Satz", !!weltSatz);
  const rueck = zerlegeSaat(weltSatz || "");
  ist("… den die eigene Zerlegung wieder auseinanderbekommt: der Ort", rueck.where, "in einem verlassenen Bahnhof");
  ist("… und der Vorgang", rueck.what, "entdeckt ein zweites Testament");
  // Gegentest: Ein Welt-Vorgang, den die Zerlegung NICHT kennt, wird nicht
  // in den Satz gebaut — er zerfiele beim Erzeugen zu Brei.
  const ohne = saatVorrat([], { who: "ein Bote", where: "am Hafen", when: "", what: "zerbröselt jede Gewissheit" });
  wahr("unzerlegbare Vorgänge bleiben draußen", !ohne.some((v) => v.includes("zerbröselt")));
}

// ── 2c · Der Würfel zieht nach Quelle gewichtet ────────────────────────────
// Gemeldet (4.327.0): Die fünf Beispiele und dieselben Pool-Fragmente
// häuften sich — gleichverteilt über den Topf lagen sie bei 49 % + 39 %,
// die Welt bei 12 %.
{
  const POOL = ["ein Rad, das sich ohne Achse dreht", "eine Karte ohne Norden liegt aus"];
  const WELT = { who: "eine Uhrmacherin", where: "am Hafen", when: "", what: "entdeckt ein zweites Testament" };
  // Deterministischer Zufall: erst die Quellwahl, dann der Index.
  const rndFolge = (...w: number[]): (() => number) => { let i = 0; return () => w[i++ % w.length]!; };
  const zug1 = ziehSaat(POOL, () => WELT, [], rndFolge(0.1, 0));
  wahr("unter 0,5 kommt die Welt", zug1.includes("Uhrmacherin"));
  const zug2 = ziehSaat(POOL, () => WELT, [], rndFolge(0.7, 0));
  wahr("zwischen 0,5 und 0,9 der Pool", zug2.includes("Rad") || zug2.includes("Karte"));
  const zug3 = ziehSaat(POOL, () => WELT, [], rndFolge(0.95, 0));
  wahr("darüber die Beispiele", SAAT_BEISPIELE.includes(zug3));
  // Leere Quellen fallen an die nächste — ohne Pool landet 0,7 nicht im Leeren.
  const zug4 = ziehSaat([], () => WELT, [], rndFolge(0.7, 0));
  wahr("ohne Pool fällt der Zug an die Welt", zug4.includes("Uhrmacherin"));
  // Und die Merkliste hält das zuletzt Gezogene fern.
  const gemieden = ziehSaat(POOL, () => WELT, [zug2], rndFolge(0.7, 0, 0.7, 0));
  wahr("das Gemiedene kommt nicht wieder", gemieden !== zug2);
  // Häufigkeit über 400 Züge mit echtem Zufall: Die Beispiele sind selten.
  let beispiele = 0;
  for (let i = 0; i < 400; i++) if (SAAT_BEISPIELE.includes(ziehSaat(POOL, () => WELT))) beispiele++;
  wahr(`die Beispiele bleiben unter 20 % (${Math.round(beispiele / 4)} %)`, beispiele / 400 < 0.2);
}

// ── 3b · Die Probe aus lebendigem Material ─────────────────────────────────
// Die eingebauten Sätze zeigen die Bauart, aber sie sind nicht SEINE. Sobald
// die lebendigen Pools etwas hergeben, wird die Probe daraus gebaut: Dann
// führt sie nicht mehr vor, wie eine Kollision aussehen KÖNNTE, sondern wie
// sie in diesem Korpus klingt.
const PH = [
  "Die Unterlagen liegen vollständig vor",
  "der Einsatz ist ein Kind das nicht sterben durfte",
  "die Frist beginnt mit einem Ereignis ohne Datum",
];
const p0 = probeAus(PH, 0)!;
const p2 = probeAus(PH, 2)!;
wahr("aus eigenem Material entsteht eine Probe", !!p0);
ist("bei Stufe null ein Register", p0.register.length, 1);
wahr("und eine Farbe", p0.teile.every(([, r]) => r === 1));
wahr("bei Stufe zwei mehrere Register", p2.register.length > 1);
wahr("und zwei Farben im selben Satz", p2.teile.some(([, r]) => r === 2));
wahr("die Phrasen stehen wirklich drin", p2.teile.map(([t]) => t).join("").includes("Unterlagen"));
// Gross am Satzanfang. Die Phrasen kommen klein aus den Pools — im Bild stand
// „ein Ritterhandschuh. eine Erschütterung." Ein Beispiel, das selbst falsch
// gesetzt ist, macht nicht neugierig, sondern misstrauisch.
for (const s2 of [0, 1, 2]) {
  const t = probeAus(["ein Ritterhandschuh im Regen", "eine Erschütterung ohne Namen",
    "die Frist beginnt ohne Datum"], s2)!.teile.map(([x]) => x).join("");
  wahr(`Stufe ${s2} beginnt gross`, /^[A-ZÄÖÜ]/.test(t));
  ist(`Stufe ${s2} hat keinen kleinen Satzanfang`, /[.!?] [a-zäöü]/.test(t), false);
}
// Reicht das Material nicht, bleibt die eingebaute Probe stehen — eine
// Kollision aus einer einzigen Phrase wäre keine.
ist("eine Phrase reicht nicht", probeAus(["Nur eine Phrase hier drin"], 2), null);
ist("gar keine auch nicht", probeAus([], 1), null);
ist("zu kurze Schnipsel zählen nicht", probeAus(["kurz", "auch"], 1), null);
// BLAETTERN: Bei jedem Druck auf die Probe rueckt das Fenster um eins weiter.
// Die Probe ist dadurch kein Schaufenster mehr, sondern ein Blaettern — man
// sieht, WORAUS die Maschine gerade schoepft.
const P4 = [...PH, "ein Zimmer das im Plan nicht vorkommt"];
const s0 = probeAus(P4, 1, 0)!.teile.map(([t]) => t).join("");
const s1 = probeAus(P4, 1, 1)!.teile.map(([t]) => t).join("");
wahr("ein Druck zeigt anderes Material", s0 !== s1);
// Modulo: Am Ende faengt es wieder vorn an. Bliebe es stehen, wuesste niemand,
// ob die Probe erschoepft ist oder der Druck nicht ankam.
ist("und am Ende laeuft es um", probeAus(P4, 1, P4.length)!.teile.map(([t]) => t).join(""), s0);
ist("ein negativer Versatz stuerzt nicht ab", typeof probeAus(P4, 1, -3), "object");
// Und die Probe ist wirklich ein Knopf.
wahr("die Probe ist anklickbar", /button\.ek-probe\{/.test(readFileSync("src/ui/theme.css", "utf8")));
wahr("und der Klick blaettert weiter", /probeVersatz\+\+;/.test(q));
wahr("sie nennt die WIRKLICH aktiven Presets", /const aktivName = aktivePresetIds\(\)/.test(q));

// Dieselbe Stufe muss dieselbe Probe zeigen: Ein Wackeln bei jedem Reglerzug
// wäre Flackern und keine Auskunft.
ist("dieselbe Stufe ergibt dieselbe Probe",
  JSON.stringify(probeAus(PH, 1)), JSON.stringify(probeAus(PH, 1)));

// ── 3c · Die Formen kommen wirklich an ─────────────────────────────────────
// Gemeldet: „Bis jetzt kommt immer Prosa als Ergebnis." Ein Preset bringt
// eigene Einstellungen mit und setzt sie beim Wechsel — darunter die Form.
// Wurde die Form VOR dem Preset gesetzt, überschrieb das Preset sie eine Zeile
// später wieder, und der Kopf wirkte an dieser Stelle folgenlos.
const iForm = q.indexOf("form.value = st.form");
wahr("die Form wird gesetzt", iForm > 0);
// Erzeugen würfelt die übrigen Stilregler (4.325.0) — aber nie die vier
// Entscheidungen des Vorspanns, die Presets oder das Ressort.
wahr("Erzeugen würfelt die übrigen Regler", /for \(const s of ROLL_SELECTS\)/.test(block));
wahr("… aber nicht Form, Preset oder Ressort", /s === form \|\| s === preset \|\| s === ressort/.test(block));
wahr("… und das Ressort geht auf Auto", /ressort\.value = "auto"/.test(block));
// Der Rueckweg: Aenderungen der Studio-Auswahl ziehen den Regler nach — die
// Mehrfachauswahl wirft kein change-Ereignis, deshalb der Haken in
// renderPresetChecks.
wahr("die Studio-Auswahl zieht den Regler nach", /kopfPresetSync\?\.\(\);/.test(q));
wahr("auch ohne change-Ereignis (Mehrfachauswahl)", /kopfPresetSync = \(\): void =>/.test(q));
// „Gedicht" hiess im Kopf „poem"; gemeldet wurde, dass Reim gewünscht ist.
wahr("die Formen heissen jetzt anders", KOPF_FORMEN.some(([f]) => f === "reim"));
ist("und Gedicht ist nicht mehr dabei", KOPF_FORMEN.some(([f]) => f === "poem"), false);
wahr("das Haiku ist dabei", KOPF_FORMEN.some(([f]) => f === "haiku"));
ist("und die Szene nicht mehr", KOPF_FORMEN.some(([f]) => f === "script"), false);
// Ein Loeschknopf im Eingabefeld: Ohne ihn markiert man den Satz und tippt
// darueber — auf dem Handy drei Griffe fuer etwas, das einer sein sollte.
wahr("das Saatfeld hat einen Loeschknopf", /class: "ek-weg"/.test(q));
wahr("und er leert wirklich", /saatIn\.value = ""; kopfWahl\.saat = ""/.test(q));

// ── 3d · Festgehaltene Regler werden ANGEZEIGT ─────────────────────────────
// Der teuerste Fehler dieser Reihe. Der Kopf laesst festgehaltene Regler in
// Ruhe — das war Absicht und ist richtig. Aber er sagte es NICHT: Man klickte
// Reim, der Chip sprang an, der Knopf erzeugte, und nichts geschah.
//
// Drei Meldungen und drei falsche Diagnosen von mir spaeter stand die Ursache
// im Schaltplan: ein Schloss an der Form, eines an der Laenge, eines an der
// Struktur. Sichtbar war sie nur dort — nicht an der Stelle, an der man
// gearbeitet hat.
//
// Ein Knopf, den man druecken kann und der nichts tut, ist schlechter als
// einer, den man nicht druecken kann.
const kq = q.slice(q.indexOf("const zeigeSchloesser"), q.indexOf("const kopfLos"));
wahr("gesperrte Formchips sind wirklich gesperrt", /\.disabled = fSperr/.test(kq));
wahr("und der Klick greift gar nicht erst", /if \(locked\.has\(form\.id\)\) return;/.test(q));
wahr("der Laengenschieber ebenso", /laengeIn\.disabled = true/.test(kq));
wahr("der Reibungsschieber ebenso", /reibungIn\.disabled = true/.test(kq));
// Und ein Satz, der es benennt — fuer die Schieber gibt es keine Chips, an
// denen man es sehen koennte.
wahr("es gibt einen Hinweis", /gesperrtHinweis\.textContent = \(fest\.length/.test(kq));
// Und die Chips folgen dem ECHTEN Regler, nicht der gemerkten Wahl. Wer im
// Reglerkasten die Form aendert, sah im Kopf sonst weiter die alte — ein Chip,
// der einen Zustand behauptet, den es nicht gibt.
wahr("die Chips folgen dem echten Regler",
  /const iJetzt = KOPF_FORMEN\.findIndex\(\(\[f\]\) => f === form\.value\)/.test(kq));
wahr("und ein Chipklick zieht ihn mit", /form\.value = KOPF_FORMEN\[i\]!\[0\]/.test(q));
// Eine Form ausserhalb der vier drueckt KEINEN Chip — einen zu markieren waere
// gelogen, „Haiku" ist nicht „Prosa".
wahr("eine fremde Form bekommt einen eigenen Satz", /diese Form bietet der Kopf nicht an/.test(kq));
wahr("er nennt die betroffenen Regler", /fest\.join\(", "\)/.test(kq));
wahr("und sagt, wo das Schloss steht", /alle Regler zeigen/.test(kq));
// Er muss sich MITAKTUALISIEREN: Wer im Reglerkasten ein Schloss oeffnet, soll
// den Kopf sofort frei sehen und nicht erst nach einem Reiterwechsel.
wahr("der Kopf haengt an der Schloss-Anzeige", /lockPainters\[c\.id\] \|\|= \[\]/.test(q));
wahr("und wird beim Aufbau einmal gezeichnet", /\n  zeigeSchloesser\(\);/.test(q));
// Gegenprobe: Ohne Schloss darf NICHTS gesperrt sein — sonst waere die Anzeige
// immer an und sagte nichts aus.
wahr("ohne Schloss bleibt alles frei", /laengeIn\.disabled = false/.test(kq));
wahr("auch die Reibung", /reibungIn\.disabled = false/.test(kq));

// ── 4 · Der Kopf ist ein Umschalter, kein Reiter ────────────────────────────
// Vierzehn Reiter sind genug, und der Nutzungszähler sammelt gerade die Daten
// dazu, welche davon Ballast sind.
wahr("er sitzt im Studio", /wrap\.prepend\(kopf\)/.test(q));
// Er ERSETZT den Reglerkasten beim Aufruf, er steht nicht darüber. Das Studio
// hat siebenunddreißig Regler, und wer es zum ersten Mal öffnet, sah sie alle.
ist("der einfache Modus ist die Vorgabe", VORGABE.einfach, true);
wahr("und er blendet den Reglerkasten aus", /studio-einfach/.test(q));
wahr("die Umschaltung ist ein Knopf, kein Aufklapper", /umschalter\.addEventListener\("click"/.test(q));
ist("kein details/summary mehr", /class: "ek-kopf", open/.test(q), false);
wahr("das Stilblatt blendet alles außer dem Kopf aus",
  /\.studio-einfach > \*:not\(\.ek-kopf\)\{display:none\}/.test(readFileSync("src/ui/theme.css", "utf8")));
// „Text erzeugen" führt ins LESEN. Wer den Kopf benutzt, will einen Text —
// nicht eine Textbox unter einem Formular.
wahr("der Knopf öffnet den Leser", /openReader\(out\.textContent/.test(q));
wahr("aber nur im einfachen Modus", /if \(kopfWahl\.einfach\) \{[\s\S]{0,120}openReader/.test(q));
wahr("und gibt die vier W mit", /who: who\.value, where: where\.value/.test(q));
// Die Probe kommt aus dem lebendigen Material, wenn es welches gibt.
wahr("die Probe zieht lebendiges Material heran", /probeAus\(liveTexts\(\)/.test(q));
wahr("und fällt sonst auf das Muster zurück", /\?\? PROBEN\[/.test(q));
ist("und ist kein eigener Reiter",
  /\["Einfach", mount/.test(readFileSync("src/ui/app.ts", "utf8")), false);

// ── 5b · Frage und Inversion: nichts vor dem Verb ist die Figur ──────────────
// Gemeldet: „Wo ist Gott?" wurde zu Wer „Wo", Was „ist Gott?".
{
  const f = zerlegeSaat("Wo ist Gott?");
  ist("eine Frage ist ganz der Vorgang", f.what, "Wo ist Gott?");
  ist("und die Figur bleibt leer", f.who, "");
  const d = zerlegeSaat("Dann kommt der Bote.");
  ist("ein Adverb vor dem Verb ist keine Figur", d.who, "");
  ist("der ganze Satz ist der Vorgang", d.what, "Dann kommt der Bote");
  // Gegenprobe: Eine echte Figur vor dem Verb bleibt Figur.
  const b = zerlegeSaat("Der Bote bringt, was niemand hören will.");
  ist("Figur bleibt Figur", b.who, "Der Bote");
  // Und beim Erzeugen wird die leere Figur gewürfelt, der Vorgang bleibt.
  const k = kopfKontext(f, { who: "Eine Uhrmacherin", where: "im Hafen", when: "im Jahr 1911" }, { who: "Alt", where: "", when: "", what: "" });
  ist("die Figur kommt aus dem Wurf", k.who, "Eine Uhrmacherin");
  ist("der Vorgang bleibt die Frage", k.what, "Wo ist Gott?");
}

// ── 6 · Beim Erzeugen: Was fix, Wer/Wo/Wann gewürfelt ───────────────────────
// Gemeldet: „Beim Würfeln sollen die 3W mitgewürfelt werden. 1W ist fix und
// kommt aus dem Wovon." Vorher blieb alles stehen, was die Saat nicht nannte.
{
  const alt = { who: "Alte Figur", where: "im alten Ort", when: "gestern", what: "schläft" };
  const wurf = { who: "Eine Uhrmacherin", where: "in einer Werkstatt", when: "im Jahr 1911", what: "erbt eine Uhr" };
  // Saat mit Vorgang, ohne Figur/Ort/Zeit: die drei kommen aus dem Wurf.
  const k1 = kopfKontext(zerlegeSaat("Der Bote bringt, was niemand hören will."), wurf, alt);
  ist("das Was kommt aus der Saat", k1.what, "bringt, was niemand hören will");
  ist("die Figur aus der Saat bleibt", k1.who, "Der Bote");
  ist("der Ort wird gewürfelt", k1.where, "in einer Werkstatt");
  ist("die Zeit wird gewürfelt", k1.when, "im Jahr 1911");
  // Gegenprobe: Das Was des Wurfs darf NIE das der Saat verdrängen.
  ist("der Wurf überschreibt das Was nicht", k1.what === wurf.what, false);
  // Saat nennt Ort und Zeit selbst: nichts davon wird überwürfelt.
  const k2 = kopfKontext(zerlegeSaat("Ein Wachmann am Hafen, 1953."), wurf, alt);
  ist("ein genannter Ort bleibt", k2.where, "am Hafen");
  ist("eine genannte Zeit bleibt", k2.when, "im Jahr 1953");
  ist("eine genannte Figur bleibt", k2.who, "Ein Wachmann");
  // Ohne Verb kein Vorgang: dann bleibt das alte Was, geraten wird nicht.
  ist("ohne Verb bleibt das alte Was", k2.what, "schläft");
  // Leerer Wurf: erst dann der alte Studio-Wert.
  const k3 = kopfKontext(zerlegeSaat("Der Bote bringt, was niemand hören will."), {}, alt);
  ist("leerer Wurf → alter Ort", k3.where, "im alten Ort");
  ist("leerer Wurf → alte Zeit", k3.when, "gestern");
}
// Und das Studio nutzt die Regel wirklich — mit einem Wurf aus der Welt.
wahr("„Text erzeugen\" würfelt die drei W aus der Welt", /const wurf = [\s\S]{0,120}worldFillContext\(\)[\s\S]{0,200}kopfKontext\(st\.ctx, wurf/.test(q));

// ── Ergebnis ────────────────────────────────────────────────────────────────
console.log(`Prüfstand einfacher Kopf — ${geprueft} Prüfungen:`);
zeilen.forEach((z) => console.log(z));
const proc = globalThis as unknown as { process?: { exit: (c: number) => void } };
if (fails.length) {
  console.error(`\n❌ ${fails.length} Fehler im einfachen Kopf:`);
  fails.forEach((f) => console.error("  - " + f));
  proc.process?.exit(1);
} else {
  console.log(`\n✅ Einfacher Kopf: alle ${geprueft} Prüfungen bestanden.`);
}
