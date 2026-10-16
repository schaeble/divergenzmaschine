// Prüfstand Multi-Shot: generation/video.ts — Shots als Bildszenen.
//
// Gemeldet: zu schwache Sequenzen, zu kurz, wenig ausdrucksstark, zu wenig
// bildhaft. Hier steht, dass jeder Shot seine Sichtplätze trägt (Bild,
// Bewegung, Nah, Licht, Schnitt), dass die Länge dem Regler folgt, dass nichts
// Englisches mehr im Bild steht und dass sich Requisiten nicht wiederholen.
import { JSDOM } from "jsdom";
const dom = new JSDOM("<!doctype html><html><body></body></html>", { url: "https://x.test/" });
(globalThis as unknown as Record<string, unknown>).localStorage = dom.window.localStorage;
import { readFileSync } from "fs";
import { DEFAULT_BANK } from "../src/constants";
import { presetAusText } from "../src/features/textpreset";
import { buildStory, buildKit } from "../src/generation/buildStory";
import { buildVideoSequenceText, prosaSaetze, verteileSaetze, clampTotalSec } from "../src/generation/video";
import { setDramaData } from "../src/generation/dramaturgie";
import type { GenInput } from "../src/types";

const fails: string[] = [];
let geprueft = 0, bestanden = 0;
const ist = (name: string, wert: unknown, soll: unknown): void => {
  geprueft++;
  if (wert === soll) bestanden++;
  else fails.push(`${name}: „${String(wert)}“ — erwartet „${String(soll)}“`);
};
const wahr = (name: string, b: boolean, zusatz = ""): void => ist(name + (zusatz ? ` (${zusatz})` : ""), b, true);

const inp: GenInput = { where: "in einem verlassenen Bahnhof", when: "vor dem ersten Zug", who: "Eine Uhrmacherin", what: "sucht einen Ton, der fehlt",
  tone: "mystery", varLevel: "wild", form: "video", structure: "linear", mode: "myth", perspective: "third",
  rhythm: "auto", markovMode: "off", disruptor: "off", archetypeA: "neutral", archetypeB: "psychopath",
  instability: 0, polish: false, polishStyle: "surreal_precise", shots: 5, totalSec: 25, lenTarget: 200 } as never;
// Seit 4.386.0 erzählen die Shots einen Prosatext nach (Abschnitt 7). Die
// Bildszenen aus Bank und Bogen bleiben der Weg, wenn keine Prosa entsteht —
// die Abschnitte 1, 3, 4 und 5 prüfen ihn direkt, ohne Vorlage.
const bau = (o: Partial<GenInput> = {}): string => { const i = { ...inp, ...o } as never as GenInput; return buildVideoSequenceText(buildKit(DEFAULT_BANK, i), i.shots ?? 5, i.totalSec ?? 30, (i.lenTarget as number) ?? 110, DEFAULT_BANK, i.tone); };
const bauMitProsa = (o: Partial<GenInput> = {}): string => buildStory(DEFAULT_BANK, { ...inp, ...o } as never);
const shots = (t: string): string[] => t.split("\n").filter((l) => l.startsWith("DE: ")).map((l) => l.slice(4));

// ── 1 · Sichtplätze ─────────────────────────────────────────────────────────
{
  const t = bau({ lenTarget: 200 } as never);
  const sh = shots(t);
  ist("fünf Shots", sh.length, 5);
  wahr("der erste Shot verankert Ort und Figur", /^In einem verlassenen Bahnhof: Eine Uhrmacherin nahe /.test(sh[0]!));
  wahr("jeder Shot außer dem letzten hat ein Nah-Detail", sh.slice(0, -1).every((s) => /Nah: /.test(s)));
  wahr("jeder Shot außer dem letzten endet mit einem Schnitt", sh.slice(0, -1).every((s) => /(Schnitt\.|das Bild geht\.|Atemzug lang\.|Überblendung ins Nächste\.|das Bild nicht\.|Das Bild reißt\.)$/.test(s)));
  wahr("der letzte Shot trägt den Schluss und lässt etwas sichtbar", /Nur (der Riss|das Fenster|die Karte|das Licht) bleibt sichtbar\.$/.test(sh[4]!));
  wahr("jeder Shot hat eine KAMERA-Zeile auf Deutsch", (t.match(/^KAMERA: .+\.$/gm) || []).length === 5 && !/KAMERA: .*(camera|push|pull|close-up)/i.test(t));
  wahr("kein Englisch mehr im Bild", !/\b(cold blue light|floating dust|fine fog|neon flicker|slow push)\b/i.test(t));
  wahr("Licht auf Deutsch ab Stufe 2", /(Blau|Neonlicht|Natriumlicht|Gegenlicht|Mondlicht|bewölkter Tag|Staub|Nebel|Schnee|Kondenswasser|Licht|Farben|nachdunkelt|Glanz|körnig)/.test(sh[1]!));
}

// ── 2 · Länge folgt dem Regler ──────────────────────────────────────────────
{
  const w = (lt: number): number => { let s = 0; for (let i = 0; i < 6; i++) s += bauMitProsa({ lenTarget: lt } as never).split(/\s+/).length; return s / 6; };
  const a = w(110), b = w(200), c = w(300);
  wahr("110 < 200 < 300 im Wortmaß", a < b && b < c, `${a.toFixed(0)} < ${b.toFixed(0)} < ${c.toFixed(0)}`);
  wahr("bei 300 über 250 Wörter (vorher blieb es dünn)", c > 250, c.toFixed(0));
}

// ── 3 · Keine Wiederholungen der Requisiten ─────────────────────────────────
{
  let doppelt = 0;
  for (let i = 0; i < 15; i++) {
    const sh = shots(bau({ lenTarget: 200 } as never));
    const nah = sh.map((s) => (s.match(/Nah: ([^.]+)\./) || [])[1]).filter(Boolean).map((x) => x!.toLowerCase().replace(/^(einen|einem|eine|ein)\s/, "ein "));
    if (new Set(nah).size !== nah.length) doppelt++;
    const erste = (sh[0]!.match(/nahe ([^.]+)\./) || [])[1];
    if (erste && nah.includes(erste.toLowerCase().replace(/^(einem|einer)\s/, "ein "))) doppelt++;
  }
  ist("Requisiten wiederholen sich nicht (15 Läufe)", doppelt, 0);
  wahr("Nah steht im Nominativ", !/Nah: einen /.test(bau({ lenTarget: 300 } as never)));
}

// ── 4 · Der Bogen sitzt an den Gelenken ─────────────────────────────────────
{
  setDramaData({ einstieg: ["Der Bahnhof atmet zum ersten Mal"], mitte: ["Ein Zug, der nie kommt"], hoehepunkt: ["Die Uhr schlägt ohne Zeiger"], schluss: [],
    ausloeser: ["ein Fahrplan aus Wachs"], veraenderungen: ["die Gleise beginnen zu singen"], konflikte: [], zeitanomalien: [], regeln: [] });
  const sh = shots(bau({ lenTarget: 200 } as never));
  wahr("Einstieg des Bogens im ersten Shot", /Der Bahnhof atmet zum ersten Mal/.test(sh[0]!));
  wahr("Höhepunkt des Bogens in der Mitte", /Die Uhr schlägt ohne Zeiger/.test(sh[2]!));
  setDramaData(null);
}

// ── 5 · Dramaturgie-Bogen mit Schlagfolge (Erzählerbank) ─────────────────────
{
  const B = { einstieg: ["Der Bahnhof atmet zum ersten Mal"], mitte: ["Ein Zug, der nie kommt", "Eine Bank ohne Sitzfläche"], hoehepunkt: ["Die Uhr schlägt ohne Zeiger"], schluss: ["Zurück bleibt ein Fahrplan aus Wachs"],
    ausloeser: ["ein Fahrplan aus Wachs"], veraenderungen: ["die Gleise beginnen zu singen"], konflikte: ["den letzten Zug"], zeitanomalien: [], regeln: [] };
  // Katastrophe zuerst: der Höhepunkt steht im ersten Shot.
  setDramaData({ ...B, folge: ["hoehepunkt", "einstieg", "hook", "mitte", "konflikt", "ausloeser", "wende", "einsatz", "schluss"] });
  let sh = shots(bau({ lenTarget: 200 } as never));
  wahr("Katastrophe zuerst: Höhepunkt im ersten Shot", /Die Uhr schlägt ohne Zeiger/.test(sh[0]!));
  wahr("… der Einstieg folgt danach", /Der Bahnhof atmet zum ersten Mal/.test(sh[0]! + sh[1]!) && sh[0]!.indexOf("Die Uhr") < (sh[0]! + " " + sh[1]!).indexOf("Der Bahnhof"));
  wahr("… der Schluss steht im letzten Shot", /Fahrplan aus Wachs/.test(sh[4]!));
  wahr("Konflikt als „Es geht um …“", /Es geht um den letzten Zug/.test(sh.join(" ")));
  wahr("Wende als „Etwas kippt: …“", /Etwas kippt: [Dd]ie Gleise beginnen zu singen/.test(sh.join(" ")));
  // Rückwärts: der Schluss zuerst, der Einstieg zuletzt.
  setDramaData({ ...B, folge: ["schluss", "hoehepunkt", "wende", "ausloeser", "konflikt", "mitte", "regel", "hook", "einstieg"] });
  sh = shots(bau({ lenTarget: 200 } as never));
  wahr("Rückwärts: Schluss im ersten Shot", /Fahrplan aus Wachs/.test(sh[0]!));
  wahr("Rückwärts: Einstieg im letzten Shot", /Der Bahnhof atmet zum ersten Mal/.test(sh[4]!));
  setDramaData(null);
  const qs = readFileSync("src/ui/studio.ts", "utf8");
  wahr("das Studio sagt bei Multi-Shot: wirkt", /wirkt · der Prosatext folgt der Schlagfolge, die Shots folgen dem Prosatext/.test(qs));
}

// ── 6 · Sequenz „Wohnungslos": Material aus einem Zeitungstext ─────────────
{
  const artikel = "Neumeier hat gerade seinen Dienstwagen abgestellt, auf einem Parkplatz neben den Bahngleisen, unweit des Bonner Hauptbahnhofs. Da, der Flohzirkus!«, flüstert Neumeier. Ein Sozialarbeiter aus der Unterkunft, in der Micha Neumeier lebt, nennt ihn »absolut zuverlässig«. Irgendetwas darin fühlte sich nach einem echten Neuanfang an. Jetzt läuft er durch eine Unterführung, einen unbeleuchteten Tunnel, auf dem Boden liegen aufgeweichte Pappen und alte Kleider herum. Ein Bündel Papier mit Wasserflecken. Eine Decke im Regen. Es geht um ein Zuhause. Oder in einem Heim. Nur ein Zuhause finden sie nicht. Ein kleiner Trost bleibt trotzdem. Zum ersten Mal seit Langem scheint der Weg wieder offen. Es reicht diesmal für alle.";
  const bank = presetAusText(artikel).bank;
  let dubl = 0, praet = 0, halbeZitate = 0, nahMitVerb = 0, schlechterOrt = 0;
  for (let i = 0; i < 10; i++) {
    const t = buildStory(bank as never, { ...inp, where: "Urbane Straße mit Graffiti-Wand", lenTarget: 200 } as never);
    const tb = buildVideoSequenceText(buildKit(bank as never, { ...inp, where: "Urbane Straße mit Graffiti-Wand", lenTarget: 200 } as never), 5, 30, 200, bank as never, "mystery");
    if (/Nah: Oder /.test(tb) || /Nah: .*flüstert/.test(tb)) nahMitVerb++;
    const saetze = t.split(/(?<=[.!?…])\s+/).map((x) => x.toLowerCase().replace(/[^a-zäöüß ]/g, "").trim()).filter((x) => x.split(" ").length >= 4);
    dubl += saetze.length - new Set(saetze).size;
    if (/fühlte sich/.test(t)) praet++;
    if (/»absolut zuverlässig\./.test(t) || /Flohzirkus!«/.test(t)) halbeZitate++;
    if (/Nah: Oder /.test(t) || /Nah: .*flüstert/.test(t)) nahMitVerb++;
    if (/An einem Urbane/.test(t)) schlechterOrt++;
  }
  ist("keine Dubletten mehr (10 Läufe)", dubl, 0);
  ist("Präteritum wird zum Präsens", praet, 0);
  ist("halbe Zitate fallen (Satz-Wächter)", halbeZitate, 0);
  ist("Nah verlangt eine Nominalphrase", nahMitVerb, 0);
  ist("Ort mit Adjektiv ohne Artikel wird gebeugt", schlechterOrt, 0);
  wahr("„Auf einer urbanen Straße“", /Auf einer urbanen Straße mit Graffiti-Wand/.test(buildStory(bank as never, { ...inp, where: "Urbane Straße mit Graffiti-Wand" } as never)));
}

// ── 7 · Prosa als Vorlage, 30 Sekunden (4.386.0) ───────────────────────────
// Gewünscht: Gesamtlänge 30 Sekunden; die Grundidee kommt aus dem Prosatext.
{
  ist("Vorgabe der Gesamtlänge: 30 Sekunden", clampTotalSec(NaN), 30);
  const qs = readFileSync("src/ui/studio.ts", "utf8");
  wahr("das Studio-Feld steht auf 30", /id: "f-secs", type: "number", value: "30"/.test(qs));
  const t = bauMitProsa({ totalSec: undefined, lenTarget: 200 } as never);
  wahr("GESAMTLÄNGE 30s, 6s je Shot", /GESAMTLÄNGE: 30s • 6s pro Shot/.test(t), t.split("\n").find((l) => l.startsWith("GESAMT")) || "");
  wahr("eine GRUNDIDEE im Kopf", /^GRUNDIDEE: .+/m.test(t));
  // Verteilung: der Reihe nach, erster und letzter Satz bleiben.
  const v = verteileSaetze(["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l"], 3, 2);
  ist("gekürzt auf 3 × 2", v.flat().length, 6);
  wahr("erster und letzter Satz bleiben, in Reihenfolge", v.flat()[0] === "a" && v.flat()[5] === "l" && v.flat().join("") === [...v.flat()].sort().join(""));
  ist("wenige Sätze: keiner fällt weg", verteileSaetze(["a", "b", "c"], 5, 2).flat().join(""), "abc");
  wahr("prosaSaetze trennt auch nach Zitat", prosaSaetze("„Komm mit.“ Der Hase lacht. Er läuft.").length === 3);
  ist("ein Zitat über zwei Sätze bleibt zusammen", prosaSaetze("„Komm. Wir gehen.“ Er lacht.")[0], "„Komm. Wir gehen.“");
  ist("Gegenprobe: ein halbes Zitat fällt", prosaSaetze("Er nennt ihn »absolut zuverlässig. Da, der Zirkus!«, flüstert er. Es regnet.").join(" | "), "Es regnet.");
  // Die Fabel als Multi-Shot: Die Shots erzählen sie der Reihe nach.
  const fab = bauMitProsa({ welt: "fabel", where: "am Rand eines Waldes", when: "", who: "Hase, Igel", what: "Wer sich seines Vorsprungs zu sicher ist, verliert ihn.", lenTarget: 200 } as never);
  const fs = shots(fab);
  wahr("Fabel: der erste Shot stellt Hase und Igel vor", /Ein Hase und ein Igel/.test(fs[0]!), fs[0]!);
  wahr("Fabel: der letzte Shot trägt die Lehre", /Wer sich seines Vorsprungs zu sicher ist, verliert ihn/.test(fs[fs.length - 1]!), fs[fs.length - 1]!);
  // Gegenprobe: Mit Prosa-Vorlage stehen keine losen Bank-Requisiten im Shot;
  // ohne Vorlage (Bildszenen) schon.
  wahr("mit Vorlage kein „Nah:“ aus der Bank", !/Nah: /.test(fab));
  wahr("Gegenprobe: ohne Vorlage gibt es „Nah:“", /Nah: /.test(bau({ lenTarget: 200 } as never)));
  // Der Fund beim Bauen: „… ist es Winter.“ ein Bild … (kleinerArtikel).
  let klein = 0;
  for (let i = 0; i < 8; i++) if (/[.!?]“ (ein|eine|der|die|das) /.test(bauMitProsa({ welt: "fabel", where: "am Rand eines Waldes", when: "", who: "Hase, Igel", what: "Wer sich seines Vorsprungs zu sicher ist, verliert ihn.", lenTarget: 200 } as never))) klein++;
  ist("nach Satzende im Zitat kein kleiner Artikel", klein, 0);
}

console.log(`Prüfstand Multi-Shot — ${geprueft} Prüfungen, ${bestanden} bestanden`);
const proc = globalThis as unknown as { process?: { exit: (c: number) => void } };
if (fails.length) {
  console.error(`\n❌ Multi-Shot: ${fails.length} Fehler:`);
  fails.forEach((f) => console.error("  - " + f));
  proc.process?.exit(1);
} else {
  console.log(`\n✅ Multi-Shot: alle ${geprueft} Prüfungen bestanden.`);
}
