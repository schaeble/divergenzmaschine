// Prüfstand Register.
//
// Die Zuordnung sagt, welche Welt ein Preset baut und wie darin gesprochen
// wird. Der Autopilot mischt danach gespreizt statt blind.
//
// Die wichtigste Prüfung hier ist die langweiligste: dass JEDES Preset ein
// Register hat. Ein neues Preset ohne Eintrag ist für die Spreizung unsichtbar
// — es wird gezogen, zählt aber als Abstand null und zieht damit jede Mischung
// herunter, in der es steckt. Kein Fehler, keine Meldung. Dieselbe Lücke wie
// beim Selbsttest mit den drei fehlenden Formen.
import { JSDOM } from "jsdom";
const dom = new JSDOM("<!doctype html><html><body></body></html>", { url: "https://x.test/" });
(globalThis as unknown as Record<string, unknown>).localStorage = dom.window.localStorage;
import { BUILTIN_PRESETS } from "../src/presets.data";
import {
  REGISTER, registerVon, abstand, mischAbstand, waehleGespreizt,
  WELT_LABEL, SPRACHE_LABEL, bekannteRegister, setzeEigenes, ladeEigene, EIGEN_KEY,
} from "../src/features/register";

const fails: string[] = [];
const zeilen: string[] = [];
let geprueft = 0;
const ist = (name: string, wert: unknown, soll: unknown): void => {
  geprueft++;
  if (wert === soll) zeilen.push(`  ✓ ${name}`);
  else { zeilen.push(`  ✗ ${name}`); fails.push(`${name}: „${String(wert)}“ — erwartet „${String(soll)}“`); }
};
const wahr = (name: string, b: boolean): void => ist(name, b, true);

// ── 1 · Vollständigkeit in beide Richtungen ─────────────────────────────────
const ids = Object.keys(BUILTIN_PRESETS);
ist("jedes eingebaute Preset hat ein Register",
  ids.filter((i) => !REGISTER[i]).join(", "), "");
ist("und kein Register zeigt auf ein Preset, das es nicht gibt",
  Object.keys(REGISTER).filter((k) => !ids.includes(k)).join(", "), "");
wahr(`es sind ${ids.length} Presets`, ids.length >= 51);
// Die Werte müssen die vorgesehenen sein — ein Tippfehler in einer der 51
// Zeilen wäre sonst ein Register, das nirgends passt.
for (const [id, r] of Object.entries(REGISTER)) {
  if (!WELT_LABEL[r.welt] || !SPRACHE_LABEL[r.sprache]) {
    fails.push(`„${id}“ trägt ein unbekanntes Register: ${r.welt}/${r.sprache}`);
  }
}
wahr("alle Werte sind vorgesehene Stufen", !fails.some((f) => f.includes("unbekanntes Register")));
geprueft++;

// Eigene Presets bekommen KEINEN Ersatzwert: Ein geratenes Register wäre
// schlechter als gar keines, weil die Spreizung dann auf einer Erfindung
// rechnet.
ist("ein eigenes Preset hat kein Register", registerVon("user:MeinPreset"), null);
wahr("der Vorsatz „builtin:“ stört nicht", registerVon("builtin:kafka") !== null);
ist("und liefert dasselbe wie ohne", registerVon("builtin:kafka")?.sprache, registerVon("kafka")?.sprache);

// ── 2 · Die Einordnung selbst ───────────────────────────────────────────────
// Die Fälle, die im Gespräch korrigiert wurden — sie stehen hier, weil genau
// sie beim nächsten Preset wieder falsch gemacht werden.
//
// „Düster ist nicht irreal." Kafka hat keine gebrochene Kausalität; das
// Bedrohliche ist gerade, dass die Behörde konsequent arbeitet.
ist("Kafka baut eine reale Welt", REGISTER.kafka?.welt, "real");
ist("und spricht amtlich", REGISTER.kafka?.sprache, "amtlich");
for (const id of ["dickens", "hugo", "klimakrise", "staatsphilosophie", "philosophie"]) {
  ist(`„${id}“ ist real, nicht irreal`, REGISTER[id]?.welt, "real");
}
// „Gehoben“ war ein Sammelbecken und zerfällt in erzählend und feierlich.
ist("Faust erzählt", REGISTER.faust?.sprache, "erzaehlend");
ist("Eichendorff beschwört", REGISTER.eichendorff?.sprache, "feierlich");
wahr("beide Stufen sind besetzt",
  Object.values(REGISTER).some((r) => r.sprache === "erzaehlend")
  && Object.values(REGISTER).some((r) => r.sprache === "feierlich"));
// Ungeschliffene Rede gehört zu körperlich, nicht in eine eigene Stufe.
ist("Clown spricht körperlich", REGISTER.clown?.sprache, "koerperlich");
ist("Jugendsprache auch", REGISTER.jugendsprache?.sprache, "koerperlich");
// Keine Stufe darf leer bleiben — eine Stufe ohne Preset trägt keine Achse.
for (const s of Object.keys(SPRACHE_LABEL)) {
  wahr(`die Stufe „${s}“ ist besetzt`, Object.values(REGISTER).some((r) => r.sprache === s));
}

// ── 3 · Abstand ─────────────────────────────────────────────────────────────
ist("dasselbe Register hat Abstand null",
  abstand({ welt: "real", sprache: "amtlich" }, { welt: "real", sprache: "amtlich" }), 0);
ist("die beiden Enden haben Abstand eins",
  abstand({ welt: "real", sprache: "nuechtern" }, { welt: "irreal", sprache: "bildhaft" }), 1);
// Beide Achsen zählen gleich viel, obwohl die Sprache mehr Stufen hat.
ist("ein voller Weltwechsel allein ergibt ein halbes",
  abstand({ welt: "real", sprache: "amtlich" }, { welt: "irreal", sprache: "amtlich" }), 0.5);
ist("ein voller Sprachwechsel allein ebenso",
  abstand({ welt: "real", sprache: "nuechtern" }, { welt: "real", sprache: "bildhaft" }), 0.5);
ist("ohne Register kein Abstand", abstand(null, { welt: "real", sprache: "amtlich" }), 0);

// Die Mischung zählt das MINIMUM, nicht den Durchschnitt: Drei Presets, von
// denen zwei aus derselben Ecke kommen, sind in Wahrheit zwei Register.
const weit = mischAbstand(["formalismus", "griechischetragoedie"]);
wahr(`Formalismus und Tragödie liegen weit auseinander (${weit})`, weit >= 0.5);
const nah = mischAbstand(["biologie", "geologie"]);
wahr(`zwei Naturpresets nicht (${nah})`, nah < 0.2);
// Und die Gegenprobe zum Minimum: Ein Ausreißer darf die Mischung nicht retten.
const gemischt = mischAbstand(["biologie", "geologie", "myth"]);
ist("zwei aus derselben Ecke ziehen die Mischung herunter", gemischt, nah);
ist("ein einzelnes Preset hat keinen Abstand", mischAbstand(["kafka"]), 0);
ist("ein unbekanntes Preset zieht auf null", mischAbstand(["kafka", "gibtsnicht"]), 0);

// Die gemeldete Handmischung — der Text, der diesen ganzen Bau ausgelöst hat.
const juergens = mischAbstand(["bergwelt", "formalismus", "griechischetragoedie"]);
wahr(`die gemeldete Mischung ist gespreizt (${juergens})`, juergens >= 0.3);

// ── 4 · Gespreizt wählen ────────────────────────────────────────────────────
const vorrat = Object.keys(REGISTER);
let besser = 0;
const zufall = (): number => Math.random();
for (let i = 0; i < 400; i++) {
  const g = waehleGespreizt(vorrat, 3, zufall);
  const blind = [0, 1, 2].map(() => vorrat[Math.floor(Math.random() * vorrat.length)]!);
  if (mischAbstand(g) > mischAbstand([...new Set(blind)])) besser++;
}
wahr(`gespreizt schlägt blind in ${besser} von 400 Läufen`, besser >= 240);
// Gegenprobe: Es muss trotzdem STREUEN — immer die beiden entferntesten zu
// nehmen ergäbe in jeder Ausgabe dieselbe Paarung.
const paare = new Set(Array.from({ length: 200 }, () => waehleGespreizt(vorrat, 2, zufall).join("+")));
wahr(`die Wahl streut über ${paare.size} verschiedene Paare`, paare.size >= 40);
ist("es kommen so viele heraus wie verlangt", waehleGespreizt(vorrat, 3, zufall).length, 3);
ist("nie mehr als der Vorrat hergibt", waehleGespreizt(["kafka", "myth"], 5, zufall).length, 2);
ist("ein leerer Vorrat ergibt nichts", waehleGespreizt([], 3, zufall).length, 0);
wahr("keine Wiederholung in einer Mischung",
  new Set(waehleGespreizt(vorrat, 3, zufall)).size === 3);

// ── 5 · Unbekanntes enthaelt sich, statt zu schaden ─────────────────────────
// Ein eigenes Preset hat kein Register, und `abstand(null, x)` gibt 0. Bis
// 4.313.0 zaehlte das in die Mischung ein: Die Spreizung hielt ein eigenes
// Preset fuer dasselbe Register wie jedes andere und MIED es systematisch —
// jeder Partner zog die Mischung auf null. Ein eigenes Preset wurde also
// benachteiligt, ohne dass es dafuer einen Grund gaebe.
//
// „Unbekannt" ist eben nicht neutral. Wer nichts weiss, darf nicht das
// Schlechteste annehmen; er muss sich enthalten.
localStorage.removeItem(EIGEN_KEY);
const weitOhne = mischAbstand(["formalismus", "griechischetragoedie", "user:Eigenes"]);
const weitMit = mischAbstand(["formalismus", "griechischetragoedie"]);
ist("ein Preset ohne Register zieht die Mischung nicht herunter", weitOhne, weitMit);
ist("und zaehlt nicht als bekannt", bekannteRegister(["formalismus", "user:Eigenes"]), 1);
// Gegenprobe: Sind zu wenige bekannt, gibt es KEINEN Abstand — sonst kaeme aus
// einem einzigen bekannten Preset eine Zahl, die nichts vergleicht.
ist("ein einzelnes bekanntes Preset ergibt keinen Abstand",
  mischAbstand(["formalismus", "user:A", "user:B"]), 0);
ist("und gar keines auch nicht", mischAbstand(["user:A", "user:B"]), 0);

// Eigene Presets lassen sich einordnen — wer sie geschrieben hat, weiss am
// besten, wohin sie gehoeren.
setzeEigenes("Eigenes", "irreal", "amtlich");
ist("die Zuordnung wird gemerkt", registerVon("user:Eigenes")?.welt, "irreal");
ist("auch ohne Vorsatz", registerVon("Eigenes")?.sprache, "amtlich");
wahr("und wirkt in der Spreizung", mischAbstand(["alltag", "user:Eigenes"]) > 0.5);
// Leere Angaben LOESCHEN die Zuordnung: „unbekannt" ist ein zulaessiger
// Zustand und besser als eine geratene Ecke.
setzeEigenes("Eigenes", "", "");
ist("leere Angaben loeschen sie wieder", registerVon("user:Eigenes"), null);
ist("und die Ablage bleibt sauber", Object.keys(ladeEigene()).length, 0);
wahr("die Ablage wandert in die Projektdatei", EIGEN_KEY.startsWith("divergenz_"));

// ── Ergebnis ────────────────────────────────────────────────────────────────
console.log(`Prüfstand Register — ${geprueft} Prüfungen:`);
zeilen.forEach((z) => console.log(z));
const proc = globalThis as unknown as { process?: { exit: (c: number) => void } };
if (fails.length) {
  console.error(`\n❌ ${fails.length} Fehler bei den Registern:`);
  fails.forEach((f) => console.error("  - " + f));
  proc.process?.exit(1);
} else {
  console.log(`\n✅ Register: alle ${geprueft} Prüfungen bestanden.`);
}
