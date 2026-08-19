// Prüfstand Reiter. Reine Rechnung, kein Browser außer dem Speicher.
//
// Zwei Fälle tragen den ganzen Prüfstand, weil sie sonst erst auffallen, wenn
// es zu spät ist:
//
// 1. Ein NEUER Reiter muss erscheinen. Die gespeicherte Reihenfolge ist eine
//    Liste von Namen; würde nur sie angezeigt, bliebe ein später
//    hinzugekommener Reiter für immer unsichtbar.
// 2. Man darf sich nicht AUSSPERREN. Die Einstellung liegt im Studio — wer es
//    ausblendet, kommt nie wieder daran.
import { JSDOM } from "jsdom";
const dom = new JSDOM("<!doctype html><html><body></body></html>", { url: "https://x.test/" });
(globalThis as unknown as Record<string, unknown>).localStorage = dom.window.localStorage;

import {
  ordne, sichtbar, verschiebe, schalte, ladeStand, sichereStand,
  setzeKanon, derKanon, REITER_KEY, PFLICHT,
} from "../src/features/reiter";

const fails: string[] = [];
const zeilen: string[] = [];
let geprueft = 0;
const ist = (name: string, wert: unknown, soll: unknown): void => {
  geprueft++;
  if (wert === soll) zeilen.push(`  ✓ ${name}`);
  else { zeilen.push(`  ✗ ${name}`); fails.push(`${name}: „${String(wert)}“ — erwartet „${String(soll)}“`); }
};
const wahr = (name: string, b: boolean): void => ist(name, b, true);

const KANON = ["Studio", "Ideen", "Korpus", "Bildwelt", "Drucken", "Hilfe"];

// ── 1 · Reihenfolge zusammenführen ──────────────────────────────────────────
ist("ohne gespeicherte Ordnung gilt die eingebaute", ordne(KANON, []).join(","), KANON.join(","));
ist("eine eigene Ordnung wird übernommen",
  ordne(KANON, ["Hilfe", "Studio", "Ideen", "Korpus", "Bildwelt", "Drucken"]).join(","),
  "Hilfe,Studio,Ideen,Korpus,Bildwelt,Drucken");
ist("ein verschwundener Reiter fällt weg",
  ordne(KANON, ["Montage", "Studio"]).indexOf("Montage"), -1);
ist("Doppelte in der gespeicherten Ordnung zählen einmal",
  ordne(KANON, ["Studio", "Studio", "Ideen"]).filter((n) => n === "Studio").length, 1);
ist("und es geht nichts verloren", ordne(KANON, ["Studio", "Studio"]).length, KANON.length);

// Der wichtigste Fall: Ein neuer Reiter erscheint AN SEINER STELLE, nicht am
// Ende. Ganz hinten übersieht man ihn — und dann weiß niemand, dass es ihn gibt.
const altOrdnung = ["Studio", "Ideen", "Korpus", "Hilfe"];
const mitNeu = ordne(["Studio", "Ideen", "Korpus", "Bildwelt", "Hilfe"], altOrdnung);
wahr("ein neuer Reiter erscheint überhaupt", mitNeu.includes("Bildwelt"));
ist("und zwar hinter seinem Vorgänger", mitNeu.indexOf("Bildwelt"), mitNeu.indexOf("Korpus") + 1);
ist("nicht am Ende", mitNeu[mitNeu.length - 1], "Hilfe");
// Ein neuer Reiter ganz vorn hat keinen Vorgänger — er muss trotzdem vorn landen.
ist("ein neuer erster Reiter kommt nach vorn",
  ordne(["Neu", "Studio", "Ideen"], ["Studio", "Ideen"])[0], "Neu");
// Ein neuer Reiter setzt sich neben seinen Nachbarn aus der eingebauten
// Liste — auch dann, wenn er dabei mitten in eine eigene Anordnung gerät. Das
// ist der bewusste Preis: Sichtbar an der thematisch richtigen Stelle ist mehr
// wert als eine unangetastete Reihenfolge, denn umsortieren kann man später,
// einen nie gesehenen Reiter nicht.
const eigen = ordne(["Studio", "Ideen", "Korpus", "Bildwelt"], ["Korpus", "Studio", "Ideen"]);
ist("ein neuer Reiter setzt sich neben seinen Nachbarn",
  eigen.indexOf("Bildwelt"), eigen.indexOf("Korpus") + 1);
ist("auch wenn er dabei in die eigene Anordnung gerät", eigen.join(","), "Korpus,Bildwelt,Studio,Ideen");
ist("verloren geht dabei nichts", eigen.length, 4);

// ── 2 · Sichtbarkeit ────────────────────────────────────────────────────────
ist("ohne Ausblendung erscheint alles", sichtbar(KANON, { ordnung: [], versteckt: [] }).length, KANON.length);
ist("Ausgeblendetes verschwindet",
  sichtbar(KANON, { ordnung: [], versteckt: ["Ideen", "Hilfe"] }).length, KANON.length - 2);
wahr("und zwar das richtige",
  !sichtbar(KANON, { ordnung: [], versteckt: ["Ideen"] }).includes("Ideen"));

// Die Aussperr-Falle. Beide Wege müssen abgefangen sein.
wahr("das Studio lässt sich nicht ausblenden",
  sichtbar(KANON, { ordnung: [], versteckt: ["Studio"] }).includes("Studio"));
const alles = sichtbar(KANON, { ordnung: [], versteckt: [...KANON] });
wahr("und alles auszublenden ergibt keine leere Leiste", alles.length > 0);
wahr("übrig bleibt der Pflichtreiter", alles.includes("Studio"));
// Gegenprobe: Auch wenn der Pflichtreiter gar nicht in der Liste steht, darf
// nichts Leeres herauskommen — sonst wäre die Rettung an eine Annahme geknüpft.
const ohnePflicht = sichtbar(["Ideen", "Korpus"], { ordnung: [], versteckt: ["Ideen", "Korpus"] });
ist("ohne Pflichtreiter bleibt trotzdem einer stehen", ohnePflicht.length, 1);
// Und die Gegenprobe zur Sperre selbst: Ein anderer Reiter MUSS ausblendbar
// sein — sonst prüfte die Regel oben nur, dass nie etwas verschwindet.
wahr("ein gewöhnlicher Reiter verschwindet wirklich",
  !sichtbar(KANON, { ordnung: [], versteckt: ["Korpus"] }).includes("Korpus"));

ist("Sichtbarkeit hält die eigene Reihenfolge ein",
  sichtbar(KANON, { ordnung: ["Hilfe", "Studio"], versteckt: ["Ideen"] })[0], "Hilfe");

// ── 3 · Verschieben ─────────────────────────────────────────────────────────
ist("nach vorn", verschiebe(["a", "b", "c"], "b", -1).join(","), "b,a,c");
ist("nach hinten", verschiebe(["a", "b", "c"], "b", 1).join(","), "a,c,b");
// Am Rand geschieht nichts. Kein Umlauf: Ein Reiter, der beim Klick auf „hoch“
// ans Ende springt, wirkt wie ein Fehler.
ist("ganz vorn passiert nichts mehr", verschiebe(["a", "b"], "a", -1).join(","), "a,b");
ist("ganz hinten auch nicht", verschiebe(["a", "b"], "b", 1).join(","), "a,b");
ist("ein unbekannter Name ändert nichts", verschiebe(["a", "b"], "x", 1).join(","), "a,b");
ist("die Liste bleibt gleich lang", verschiebe(["a", "b", "c"], "a", 1).length, 3);

// ── 4 · Schalten ────────────────────────────────────────────────────────────
ist("ausblenden merkt sich das", schalte({ ordnung: [], versteckt: [] }, "Korpus", false).versteckt.join(","), "Korpus");
ist("einblenden nimmt es zurück", schalte({ ordnung: [], versteckt: ["Korpus"] }, "Korpus", true).versteckt.length, 0);
ist("zweimal ausblenden bleibt einmal",
  schalte(schalte({ ordnung: [], versteckt: [] }, "Korpus", false), "Korpus", false).versteckt.length, 1);
// Die Sperre steht in der Rechnung und nicht nur in der Oberfläche — sonst
// griffe sie nicht, wenn der Stand aus einer Projektdatei kommt.
ist("das Studio lässt sich auch hier nicht ausblenden",
  schalte({ ordnung: [], versteckt: [] }, "Studio", false).versteckt.length, 0);
ist("die Ordnung bleibt beim Schalten unberührt",
  schalte({ ordnung: ["b", "a"], versteckt: [] }, "a", false).ordnung.join(","), "b,a");

// ── 5 · Speichern ───────────────────────────────────────────────────────────
wahr("die Einstellung wandert in die Projektdatei", REITER_KEY.startsWith("divergenz_"));
localStorage.removeItem(REITER_KEY);
ist("ohne Eintrag ist der Stand leer", ladeStand().ordnung.length, 0);
sichereStand({ ordnung: ["Hilfe", "Studio"], versteckt: ["Ideen"] });
ist("Gesichertes kommt zurück", ladeStand().ordnung.join(","), "Hilfe,Studio");
ist("mitsamt Ausblendung", ladeStand().versteckt.join(","), "Ideen");
localStorage.setItem(REITER_KEY, "{kein json");
ist("kaputter Inhalt ergibt einen leeren Stand", ladeStand().ordnung.length, 0);
localStorage.setItem(REITER_KEY, JSON.stringify({ ordnung: "kein array", versteckt: [7, "Ideen"] }));
ist("Unsinn in der Ordnung ergibt eine Liste", ladeStand().ordnung.length, 0);
ist("und Zahlen fallen aus der Ausblendung", ladeStand().versteckt.join(","), "Ideen");

// ── 6 · Der eingetragene Kanon ──────────────────────────────────────────────
// Eine Liste und nicht zwei: Die Namen stehen bei ihren Ansichten in app.ts.
// Sie hier noch einmal aufzuschreiben hiesse, zwei Listen zu führen, die
// dasselbe meinen — und die laufen auseinander.
ist("vor dem Eintragen ist der Kanon leer", derKanon().length, 0);
setzeKanon(KANON);
ist("nach dem Eintragen steht er", derKanon().join(","), KANON.join(","));
setzeKanon(["a"]);
ist("und lässt sich ersetzen", derKanon().join(","), "a");
const kopie = derKanon(); kopie.push("b");
ist("die Liste wird als Kopie herausgegeben, nicht als Griff", derKanon().length, 1);

wahr("das Studio ist Pflichtreiter", PFLICHT.includes("Studio"));

// ── Ergebnis ────────────────────────────────────────────────────────────────
console.log(`Prüfstand Reiter — ${geprueft} Prüfungen:`);
zeilen.forEach((z) => console.log(z));
const proc = globalThis as unknown as { process?: { exit: (c: number) => void } };
if (fails.length) {
  console.error(`\n❌ ${fails.length} Fehler bei den Reitern:`);
  fails.forEach((f) => console.error("  - " + f));
  proc.process?.exit(1);
} else {
  console.log(`\n✅ Reiter: alle ${geprueft} Prüfungen bestanden.`);
}
