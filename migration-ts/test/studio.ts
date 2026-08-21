// Prüfstand Studio: die Knopfzeile über den vier W, die Klappfelder und die
// Ton-Vorräte.
//
// Der Studio-Reiter lässt sich hier DOCH aufbauen: jsdom mit den nötigen
// Browser-Zutaten trägt mountStudio(). Damit ist ein Teil dieses Prüfstands
// kein Blick mehr auf den Quelltext, sondern auf die laufende Oberfläche —
// Knöpfe werden geklickt, Werte gelesen. Die Regex-Prüfungen bleiben daneben
// stehen, weil sie Zusagen festhalten, die eine Messung nicht sieht.
//
// Was hier NICHT geprüft wird: wie es aussieht. jsdom rechnet kein Layout.
import { readFileSync } from "fs";
import { JSDOM } from "jsdom";
const dom = new JSDOM("<!doctype html><html><body></body></html>", { url: "https://x.test/", pretendToBeVisual: true });
const G = globalThis as unknown as Record<string, unknown>;
for (const k of ["window", "document", "localStorage", "navigator", "HTMLElement", "HTMLInputElement",
  "HTMLSelectElement", "HTMLButtonElement", "Event", "CustomEvent", "Node", "getComputedStyle",
  "requestAnimationFrame", "cancelAnimationFrame", "MutationObserver", "Blob", "URL", "FileReader",
  "Image", "DOMParser"]) {
  // navigator ist in neueren Node-Fassungen ein Nur-Lese-Zugriff — zuweisen
  // wirft, definieren geht.
  try { Object.defineProperty(G, k, { value: (dom.window as unknown as Record<string, unknown>)[k], writable: true, configurable: true }); } catch { /* schon da */ }
}
// Zwei Zutaten, die jsdom nicht mitbringt und das Studio benutzt.
const keinMedia = (): unknown => ({ matches: false, addEventListener: () => {}, removeEventListener: () => {}, addListener: () => {}, removeListener: () => {} });
Object.defineProperty(G, "matchMedia", { value: keinMedia, writable: true, configurable: true });
(dom.window as unknown as Record<string, unknown>)["matchMedia"] = keinMedia;
(dom.window.Element.prototype as unknown as Record<string, unknown>)["scrollIntoView"] = function (): void {};
import { TONE_DATA } from "../src/generation/tone.data";
import { uebernehmeKontext, geaendert, W4_FELDER, offeneQuellen, ziehQuelle, QUELLEN, QUELLE_LABEL } from "../src/features/kontext";
import { worldFillContext, WELT_SAAT } from "../src/features/world";
import { mountStudio } from "../src/ui/studio";
import { regle, saveZiele, loadKnobs, saveKnobs, KNOB_VORGABE, ZIEL_KNOB } from "../src/features/knobs";

const fails: string[] = [];
let geprueft = 0, bestanden = 0;
const ist = (name: string, wert: unknown, soll: unknown): void => {
  geprueft++;
  if (wert === soll) bestanden++; else fails.push(`${name}: „${String(wert)}“ — erwartet „${String(soll)}“`);
};
const wahr = (name: string, b: boolean, zusatz = ""): void => ist(name + (zusatz ? ` (${zusatz})` : ""), b, true);

const studio = readFileSync("src/ui/studio.ts", "utf8");
const css = readFileSync("src/ui/theme.css", "utf8");

// ── 1 · „Alles würfeln" ─────────────────────────────────────────────────────
wahr("es gibt den Knopf", /" Alles würfeln"/.test(studio));
wahr("er steht in der Knopfzeile neben dem Kontextwürfel",
  /btnrow" \}, ctxDice, alleBtn/.test(studio));
// Der Kontext kommt aus der WELT — das ist der Unterschied zum vorhandenen
// Würfel, der aus einem festen Vorrat zieht.
// Was der Knopf TUT, steht weiter unten als Messung an der laufenden
// Oberfläche (Abschnitt 4 und 6). Hier bleibt nur, was eine Messung nicht
// sieht: dass die Welt überhaupt eine der Quellen ist. Die drei Regex-Prüfungen,
// die vorher hier standen, mussten bei jeder Umformulierung des Klick-Rumpfs
// nachgezogen werden und haben nie einen echten Fehler gefunden.
wahr("die Welt ist eine der Quellen", /worldFillContext\(\)/.test(studio));
wahr("und die Schlösser gehen als Frage hinein", /\(id\) => locked\.has\(id\)/.test(studio));

// ── 1b · Die Regel selbst, nicht ihr Abbild im Quelltext ────────────────────
// Gefragt war: „Werden die Schlösser beim Alles Würfeln berücksichtigt?" Die
// Antwort stand nur im Klickzusammenhang eines 1600-Zeilen-Moduls. Jetzt ist
// sie eine Funktion, und hier steht die Antwort als Prüfung.
const felder = {
  where: { id: "f-where", wert: "im Hafen" }, when: { id: "f-when", wert: "gestern" },
  who: { id: "f-who", wert: "Tom" }, what: { id: "f-what", wert: "wartet" },
};
const welt = { where: "am Deich", when: "im Winter", who: "Ines", what: "sucht das Boot" };
{
  const offen = uebernehmeKontext(felder, welt, () => false);
  ist("ohne Schloss wird alles übernommen", W4_FELDER.map((f) => offen[f]).join("|"), "am Deich|im Winter|Ines|sucht das Boot");
  ist("und alle vier gelten als geändert", geaendert(felder, offen).length, 4);
}
{
  const zu = uebernehmeKontext(felder, welt, (id) => id === "f-who");
  ist("ein gesperrtes Wer bleibt stehen", zu.who, "Tom");
  ist("die anderen wechseln trotzdem", zu.where, "am Deich");
  ist("und die Änderung wird richtig gezählt", geaendert(felder, zu).length, 3);
}
{
  const alles = uebernehmeKontext(felder, welt, () => true);
  ist("alle gesperrt: nichts ändert sich", geaendert(felder, alles).length, 0);
}
{
  const luecke = uebernehmeKontext(felder, { where: "am Deich", who: "" }, () => false);
  ist("ein leerer Vorschlag überschreibt nicht", luecke.who, "Tom");
  ist("und ein fehlendes Feld auch nicht", luecke.when, "gestern");
}

// ── 1c · Die Welt muss etwas zu würfeln haben ───────────────────────────────
// Gemeldet: „Wer aus den 4W wird nicht gewürfelt." Gemessen: Eine frische Welt
// hatte genau EINE Figur und EINEN Ort — da gab es nichts zu würfeln.
{
  const wer = new Set<string>(), wo = new Set<string>();
  for (let i = 0; i < 30; i++) { const c = worldFillContext(); wer.add(c.who); wo.add(c.where); }
  wahr("eine frische Welt liefert verschiedene Figuren", wer.size >= 4, `${wer.size} in 30 Zügen`);
  wahr("und verschiedene Orte", wo.size >= 3, `${wo.size} in 30 Zügen`);
  wahr("die Saat ist mehr als eine", WELT_SAAT >= 4, String(WELT_SAAT));
}

// ── 2 · Schließkreuz in den Klappfeldern ────────────────────────────────────
wahr("es gibt einen Schließer", /const schliesser = /.test(studio));
for (const [name, variable] of [["Test & Ranking", "rankDetails"], ["Werkzeugkasten", "fine"], ["Einstellungen", "settings"]]) {
  wahr(`${name} bekommt eins`, new RegExp(`${variable}\\.append\\(schliesser\\(${variable}\\)`).test(studio));
}
wahr("das ✕ klappt zu, statt umzuschalten", /\(d as HTMLDetailsElement\)\.open = false/.test(studio));
wahr("es unterbricht das Klicken der Kopfzeile", /schliesser[\s\S]{0,300}stopPropagation\(\)/.test(studio));
// Zugeklappt wäre es ein Knopf ohne Wirkung.
wahr("und ist nur im offenen Feld sichtbar", /\.fine:not\(\[open\]\) \.fine-x\{display:none\}/.test(css));

// ── 3 · Ton-Vorräte ─────────────────────────────────────────────────────────
// „Neutral" ist absichtlich leer: kein Ton heißt keine Färbung.
const toene = Object.entries(TONE_DATA).filter(([n]) => n !== "neutral");
wahr("elf Töne mit Vorrat", toene.length >= 11, String(toene.length));
let klein = 0, dublette = 0;
for (const [name, d] of toene) {
  if (d.opener.length < 10) { klein++; fails.push(`${name}.opener nur ${d.opener.length}`); }
  if (d.flavor.length < 16) { klein++; fails.push(`${name}.flavor nur ${d.flavor.length}`); }
  if (new Set(d.opener).size !== d.opener.length) { dublette++; fails.push(`${name}.opener: Dublette`); }
  if (new Set(d.flavor).size !== d.flavor.length) { dublette++; fails.push(`${name}.flavor: Dublette`); }
}
geprueft += 2;
if (!klein) bestanden++; if (!dublette) bestanden++;
// Ein Ton, dessen Einschübe sich mit einem anderen decken, ist kein eigener Ton.
let ueberschneidung = 0;
for (let i = 0; i < toene.length; i++) {
  for (let j = i + 1; j < toene.length; j++) {
    const a = new Set(toene[i]![1].flavor), b = toene[j]![1].flavor;
    if (b.some((x) => a.has(x))) ueberschneidung++;
  }
}
ist("kein Einschub steht in zwei Tönen", ueberschneidung, 0);


// ── 4 · Werkzeugkasten und die Chips unter „Struktur" am selben Draht ───────
// Gemeldet: „Bei dem Werkzeugkasten funktioniert das Schloss nicht." Gemessen:
// Dieselbe Einstellung steht an ZWEI Stellen — als Auswahlfeld im Werkzeugkasten
// und als Chip unter dem Text. Der Chip erzeugte sofort neu, das Auswahlfeld
// nicht, und nur das Auswahlfeld trug ein Schloss. Beides ist jetzt gleich,
// und hier steht es als Prüfung.
{
  const D = dom.window.document;
  const wurzel = D.createElement("div"); D.body.append(wurzel);
  mountStudio(wurzel);
  const holen = (id: string): HTMLSelectElement => D.getElementById(id) as HTMLSelectElement;
  const knopf = (t: RegExp): HTMLButtonElement =>
    Array.from(D.querySelectorAll("button")).find((b) => t.test(b.textContent || "")) as HTMLButtonElement;
  const schlossVon = (n: Element | null): HTMLButtonElement | null =>
    n ? (n.querySelector(".lockbtn") as HTMLButtonElement | null) : null;

  // Erzeugungen zählen: jeder Lauf legt seinen Schnappschuss ab.
  let laeufe = 0;
  const SP = (dom.window as unknown as { Storage: { prototype: Storage } }).Storage.prototype;
  const echt = SP.setItem;
  SP.setItem = function (k: string, v: string): void { if (k === "dm_last_input_v1") laeufe++; return echt.call(this, k, v); };

  const struktur = holen("f-structure");
  wahr("das Studio lässt sich in jsdom aufbauen", !!struktur);
  const anders = (s2: HTMLSelectElement): string =>
    Array.from(s2.options).map((o) => o.value).find((v) => v !== s2.value) || s2.value;

  // Die Struktur-Ansicht einschalten, sonst gibt es keine Chips.
  const anzeige = D.getElementById("f-struktur") as HTMLInputElement;
  anzeige.checked = true; anzeige.dispatchEvent(new dom.window.Event("change"));
  knopf(/Generieren/).click();

  laeufe = 0;
  struktur.value = anders(struktur); struktur.dispatchEvent(new dom.window.Event("change"));
  ist("der Werkzeugkasten erzeugt sofort neu", laeufe, 1);

  const chipVon = (name: string): Element | undefined =>
    Array.from(D.querySelectorAll(".src-chipwrap")).find((c) => (c.querySelector("b")?.textContent || "") === name);
  const chip = chipVon("Struktur");
  wahr("es gibt einen Chip für dieselbe Einstellung", !!chip);
  const mini = chip?.querySelector("select") as HTMLSelectElement;
  ist("der Chip zeigt, was im Werkzeugkasten steht", mini.value, struktur.value);

  laeufe = 0;
  mini.value = anders(mini); mini.dispatchEvent(new dom.window.Event("change"));
  ist("und der Chip erzeugt genau EINEN neuen Text, nicht zwei", laeufe, 1);
  ist("der Chip stellt das Feld im Werkzeugkasten mit um", struktur.value, mini.value);
  SP.setItem = echt;

  // Das Schloss: eines für beide Stellen.
  const chip2 = chipVon("Struktur");
  const chipSchloss = schlossVon(chip2 || null);
  wahr("auch der Chip trägt ein Schloss", !!chipSchloss);
  const kastenSchloss = schlossVon(struktur.closest(".field"));
  wahr("und der Werkzeugkasten auch", !!kastenSchloss);
  // Bewusst ohne „!": Fehlt das Schloss am Chip, soll dieser Prüfstand einen
  // Fehler MELDEN und nicht abstürzen — eine Gegenprobe, die den Lauf abbricht,
  // sagt weniger als eine, die durchläuft.
  const chipSchlossJetzt = (): HTMLButtonElement | null => schlossVon(chipVon("Struktur") || null);
  kastenSchloss?.click();
  wahr("wird es im Werkzeugkasten geschlossen, zeigt der Chip es geschlossen",
    chipSchlossJetzt()?.classList.contains("on") === true);
  chipSchlossJetzt()?.click();
  wahr("und andersherum genauso", kastenSchloss?.classList.contains("on") === false);

  // Und das Schloss hält beim Würfeln — an der laufenden Oberfläche gemessen.
  kastenSchloss?.click();
  const halt = struktur.value;
  let weg = 0;
  for (let i = 0; i < 20; i++) { knopf(/Alles würfeln/).click(); if (struktur.value !== halt) weg++; }
  for (let i = 0; i < 20; i++) { knopf(/Würfeln/).click(); if (struktur.value !== halt) weg++; }
  ist("und hält 40 Würfe lang", weg, 0);
  kastenSchloss?.click();

  // Die Stellschrauben im selben Kasten hatten gar keines.
  wahr("auch die Stellschrauben tragen ein Schloss",
    !!schlossVon(D.getElementById("knob-satzlaenge")));

  // Und die gewürfelte Quelle an der laufenden Oberfläche: Mit gefüllten
  // Vorräten müssen über viele Klicks alle drei vorkommen, und die Zeile unter
  // dem Knopf muss sagen, welche es war.
  D.defaultView!.localStorage.setItem("divergenz_sammler_vorrat_v1", JSON.stringify(
    [{ tag: "2026-01-01", titel: "Artikel A", quelleLabel: "Artikel des Tages",
       ctx: { where: "in Wien", when: "1889", who: "Ada Lovelace", what: "stellt eine Rechnung auf" } }]));
  D.defaultView!.localStorage.setItem("divergenz_bildvorrat_v1", JSON.stringify(
    [{ name: "Foto 1", ctx: { where: "am Kai", when: "im Nebel", who: "ein Kranführer", what: "wartet" } }]));
  const wurzel2 = D.createElement("div"); D.body.append(wurzel2);
  mountStudio(wurzel2);
  const zeilen = (): string[] => Array.from(wurzel2.querySelectorAll(".ctxhint")).map((h) => h.textContent || "").filter(Boolean);
  const alleKnopf = Array.from(wurzel2.querySelectorAll("button")).find((b) => /Alles würfeln/.test(b.textContent || "")) as HTMLButtonElement;
  const quellen = new Set<string>();
  const stil = (wurzel2.querySelector("#f-tone")
    || Array.from(wurzel2.querySelectorAll("select")).find((x) => /tone|ton/i.test(x.id))) as HTMLSelectElement;
  wahr("das Tonfeld ist da", !!stil);
  const stilWerte = new Set<string>();
  for (let i = 0; i < 80; i++) {
    alleKnopf.click();
    const z = zeilen().pop() || "";
    quellen.add(z.split(":")[0]!.split(" · ")[0]!);
    if (stil) stilWerte.add(stil.value);
  }
  ist("alle drei Quellen kommen im Studio vor", [...quellen].sort().join(","), "Abschrift,Welt,Wiki");
  // Gemessen statt im Quelltext nachgelesen: Der Knopf würfelt die Stilregler mit.
  wahr(`und die Stilregler werden mitgewürfelt (${stilWerte.size} Töne)`, stilWerte.size >= 3);
}

// ── 5 · Die Zielregelung hält vor einem Schloss an ──────────────────────────
// Sie verstellt die Stellschrauben nach jeder Erzeugung. Ohne Rücksicht auf das
// Schloss wäre jedes Schloss an einer Stellschraube eine Attrappe.
{
  const vorher = loadKnobs();
  saveZiele({ vorlage: 90 });
  const feld = ZIEL_KNOB["vorlage"];
  saveKnobs({ ...KNOB_VORGABE });
  const offen = regle({ vorlage: 0.1 });
  wahr("ohne Schloss regelt sie nach", offen.bewegt);
  saveKnobs({ ...KNOB_VORGABE });
  const zu = regle({ vorlage: 0.1 }, (f) => f === feld);
  wahr("mit Schloss rührt sie die Stellschraube nicht an", !zu.bewegt);
  ist("und sie meldet die Quelle als fest", zu.fest.includes("vorlage"), true);
  ist("der Wert steht unverändert", loadKnobs()[feld], KNOB_VORGABE[feld]);
  saveZiele({}); saveKnobs(vorher);
}


// ── 6 · Die Quellen von „Alles würfeln" ────────────────────────────────────
// Gefragt: „Wird bei Alles würfeln auch Wiki und Abschrift mitgenommen?" Bis
// 4.263.0 nicht — es zog allein aus der Welt. Jetzt wird die Quelle
// mitgewürfelt, aber nur unter denen, die etwas hergeben.
{
  ist("ohne Vorräte bleibt nur die Welt", offeneQuellen(0, 0).join(","), "welt");
  ist("mit Wiki-Vorrat kommt Wiki dazu", offeneQuellen(7, 0).join(","), "welt,wiki");
  ist("mit Bildvorrat die Abschrift", offeneQuellen(0, 3).join(","), "welt,abschrift");
  ist("mit beiden alle drei", offeneQuellen(7, 3).join(","), "welt,wiki,abschrift");
  // Der Zufall ist ein Parameter — sonst ließe sich das hier nicht messen.
  const offen = offeneQuellen(1, 1);
  ist("erster Zug", ziehQuelle(offen, () => 0), "welt");
  ist("mittlerer Zug", ziehQuelle(offen, () => 0.5), "wiki");
  ist("letzter Zug", ziehQuelle(offen, () => 0.99), "abschrift");
  ist("und 1.0 fällt nicht heraus", ziehQuelle(offen, () => 1), "abschrift");
  ist("aus dem Nichts kommt die Welt", ziehQuelle([], () => 0.5), "welt");
  // Über viele Züge muss jede offene Quelle wirklich vorkommen.
  const gesehen = new Set<string>();
  for (let i = 0; i < 200; i++) gesehen.add(ziehQuelle(offen));
  ist("in 200 Zügen kommen alle drei vor", gesehen.size, 3);
  ist("jede Quelle hat eine Beschriftung", QUELLEN.every((q) => !!QUELLE_LABEL[q]), true);
}

console.log(`Prüfstand Studio — ${geprueft} Prüfungen, ${bestanden} bestanden`);
const proc = globalThis as unknown as { process?: { exit: (c: number) => void } };
if (fails.length) {
  console.error(`\n❌ Studio: ${fails.length} Fehler:`);
  fails.forEach((f) => console.error("  - " + f));
  proc.process?.exit(1);
} else {
  console.log(`\n✅ Studio: alle ${geprueft} Prüfungen bestanden.`);
}
