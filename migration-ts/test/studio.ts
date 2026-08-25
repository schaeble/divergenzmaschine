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
import { mountWordbank } from "../src/ui/wordbankView";
import { mountIdeas } from "../src/ui/ideasView";
import { loadBank } from "../src/storage";
import { BUILTIN_PRESETS } from "../src/presets.data";
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
  // Die Voraussetzung wird HERGESTELLT, nicht angenommen. Der Prüfstand
  // behauptet „eine frische Welt" — er lief aber gegen die Welt, die zufällig
  // gerade in der Ablage stand. Hat ein anderer Teil des Laufs vorher Figuren
  // gelernt, misst er etwas anderes als seinen eigenen Satz und fällt
  // sporadisch: einmal „3 in 30 Zügen", während er allein 5 bis 6 liefert
  // (3000 Versuche: 97,8 % sechs, 2,2 % fünf, nie weniger).
  try { localStorage.removeItem("divergenz_world_v1"); } catch { /* egal */ }
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
  // Seit 4.297.0 ist „Ideen" eine Quelle wie die Welt — beide sind immer dabei.
  ist("alle offenen Quellen kommen im Studio vor", [...quellen].sort().join(","), "Abschrift,Ideen,Wahrnehmung,Welt,Wiki");
  // Die vierte Quelle: der Themenpool. Er ist in diesem Lauf leer und darf
  // deshalb NICHT vorkommen — eine leere Quelle zu ziehen hieße, dass der Knopf
  // mal wirkt und mal nicht.
  wahr("der leere Themenpool kommt nicht in den Topf", !quellen.has("Thema"));
  // Und die Taste dazu gibt es.
  wahr("es gibt eine Taste „Thema“",
    !!Array.from(wurzel2.querySelectorAll("button")).find((b) => /^\s*Thema\s*$/.test(b.textContent || "")));
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
  // Seit 4.297.0 sind Welt UND Ideen immer dabei: Beide liefern auch beim
  // ersten Start etwas, die drei Vorräte nur mit Inhalt.
  ist("ohne Vorräte bleiben Welt, Ideen und Wahrnehmung", offeneQuellen(0, 0).join(","), "welt,ideen,omni");
  ist("mit Wiki-Vorrat kommt Wiki dazu", offeneQuellen(7, 0).join(","), "welt,ideen,omni,wiki");
  ist("mit Bildvorrat die Abschrift", offeneQuellen(0, 3).join(","), "welt,ideen,omni,abschrift");
  ist("mit beiden alle fünf", offeneQuellen(7, 3).join(","), "welt,ideen,omni,wiki,abschrift");
  // Der Zufall ist ein Parameter — sonst ließe sich das hier nicht messen.
  const offen = offeneQuellen(1, 1);
  ist("erster Zug", ziehQuelle(offen, () => 0), "welt");
  ist("zweiter Zug", ziehQuelle(offen, () => 0.25), "ideen");
  ist("dritter Zug", ziehQuelle(offen, () => 0.45), "omni");
  ist("letzter Zug", ziehQuelle(offen, () => 0.99), "abschrift");
  ist("und 1.0 fällt nicht heraus", ziehQuelle(offen, () => 1), "abschrift");
  ist("aus dem Nichts kommt die Welt", ziehQuelle([], () => 0.5), "welt");
  // Über viele Züge muss jede offene Quelle wirklich vorkommen.
  const gesehen = new Set<string>();
  for (let i = 0; i < 200; i++) gesehen.add(ziehQuelle(offen));
  ist("in 200 Zügen kommt jede offene Quelle vor", gesehen.size, offen.length);
  ist("jede Quelle hat eine Beschriftung", QUELLEN.every((q) => !!QUELLE_LABEL[q]), true);
}


// ── 7 · Keine Theme-Farbe fest in einer Regel ─────────────────────────────
// Gemeldet: „Die Schrift in den Shots ist kaum lesbar." Ursache war
// `.kling-shot span{color:#e7ebf2}` — der Textton des DUNKLEN Themes, fest in
// die Regel geschrieben. Im hellen Thema „Papier" ist --text fast schwarz, und
// die Shots standen weiß auf weiß.
//
// Geprüft wird die Klasse, nicht der Einzelfall: Kein Selektor außerhalb der
// Theme-Blöcke darf einen Farbwert benutzen, den ein Theme als Variable führt.
// Wer die Farbe braucht, nimmt die Variable — dann wandert sie beim
// Themenwechsel mit.
{
  // Kommentare zuerst raus: Sie nennen die alte Farbe, um zu erklären, warum sie
  // weg musste — und lösten damit die eigene Prüfung aus.
  const zeilen = css.replace(/\/\*[\s\S]*?\*\//g, "").split("\n");
  // Werte, die in einem Theme-Block als Variable stehen. #fff bleibt außen vor:
  // Weiß auf einer Akzentfläche und das Papier der Druckseite sind gewollt und
  // gerade NICHT themenabhängig.
  const werte = new Set<string>();
  for (const m of css.replace(/\/\*[\s\S]*?\*\//g, "").matchAll(/--(?:text|bg|panel2?|muted|border2?|acc-hover|input-bg|out-fg):\s*(#[0-9a-fA-F]{3,6})/g)) {
    const w = m[1]!.toLowerCase();
    if (w !== "#fff" && w !== "#ffffff") werte.add(w);
  }
  wahr(`es gibt Theme-Farben zu prüfen (${werte.size})`, werte.size >= 8);
  let inBlock = false;
  const funde: string[] = [];
  for (const z of zeilen) {
    if (/^\s*(:root|\[data-theme=)/.test(z)) inBlock = true;
    if (inBlock) { if (z.includes("}")) inBlock = false; continue; }
    for (const w of werte) {
      if (z.toLowerCase().includes(w)) { funde.push(`${w} in „${z.trim().slice(0, 60)}“`); break; }
    }
  }
  ist("keine Theme-Farbe steht fest in einer Regel", funde.join(" | "), "");
}


// ── Der Würfel fasst alles an, was ein Schloss trägt ──────────────────────
// Gemeldet: „Alles würfeln — die Stellschrauben für die Rekombination bleiben
// immer gleich, keine Änderung über drei Läufe." Nachgestellt an der laufenden
// Oberfläche: Von 24 Auswahlfeldern mit Schloss bewegten sich bei 25 Klicks
// genau 16. Die acht Stellschrauben (k-fuegeteil, k-w4max, k-abstand, k-bogen,
// k-ton, k-korpus, k-phrase, k-satzlaenge) blieben in JEDEM Lauf stehen — bei
// „Würfeln" wie bei „Alles würfeln".
//
// Ursache war eine abgeschriebene Liste: `ROLL_SELECTS` wurde von Hand gepflegt,
// die Stellschrauben kamen später dazu und wurden nie eingetragen. Ihr Schloss
// war damit Zierrat: Es schützte vor etwas, das nie geschah.
//
// Diese Prüfung zählt nicht die Liste nach, sondern misst am gemounteten Studio,
// dass sich JEDES Auswahlfeld mit Schloss bei genuegend Wuerfen mindestens einmal
// bewegt. Eine neue Liste wäre derselbe Fehler noch einmal.
{
  const Dok = dom.window.document;
  const wurzel3 = Dok.createElement("div");
  Dok.body.append(wurzel3);
  mountStudio(wurzel3);
  const alleKnopf3 = Array.from(wurzel3.querySelectorAll("button"))
    .find((b) => /Alles würfeln/.test(b.textContent || "")) as HTMLButtonElement | undefined;
  // NACHTRAG 4.289.0: Auch die SCHIEBER zählen. Gemeldet: „Länge und
  // Überraschung würfelt sich nicht mit." Diese Prüfung suchte bis hierher nur
  // nach `select` — genau wie der Würfel, den sie prüfen sollte. Ein Prüfstand,
  // der dieselbe zu enge Frage stellt wie der Code, bestätigt ihn nur.
  const mitSchloss = (): (HTMLSelectElement | HTMLInputElement)[] =>
    Array.from(wurzel3.querySelectorAll("select, input[type=range]")).filter((sel) => {
      const feld = sel.closest(".field") || sel.closest(".lenrow") || sel.closest(".rankrow");
      return !!feld && !!feld.querySelector(".lockbtn");
    }) as (HTMLSelectElement | HTMLInputElement)[];
  const felder = mitSchloss();
  wahr(`es gibt Bedienelemente mit Schloss (${felder.length})`, felder.length >= 30);
  wahr("die Taste Alles wuerfeln ist da", !!alleKnopf3);
  if (alleKnopf3 && felder.length) {
    const start: Record<string, string> = {};
    for (const sel of felder) start[sel.id] = sel.value;
    const bewegt = new Set<string>();
    // 30 Würfe: Ein Feld mit zwei Stellungen bleibt mit 2^-30 zufällig stehen.
    // Der Schieber der Textlänge hat 53 Stufen, die Gewichtung vier.
    for (let i = 0; i < 30; i++) {
      alleKnopf3.click();
      for (const sel of felder) if (sel.value !== start[sel.id]) bewegt.add(sel.id);
    }
    const tot = felder.filter((sel) => !bewegt.has(sel.id)).map((sel) => sel.id);
    ist("jedes Feld mit Schloss wird auch gewürfelt", tot.join(", "), "");

    // Gegenrichtung: Ein Schloss muss weiterhin halten. Ohne diese Prüfung wäre
    // „alles würfeln" auch dann grün, wenn der Würfel die Schlösser ignoriert.
    const korpus = wurzel3.querySelector("#k-korpus") as HTMLSelectElement | null;
    const feld = korpus ? (korpus.closest(".field") as HTMLElement | null) : null;
    const schloss = feld ? (feld.querySelector(".lockbtn") as HTMLButtonElement | null) : null;
    if (korpus && schloss) {
      const gehalten = korpus.value;
      schloss.click();
      let verschoben = 0;
      for (let i = 0; i < 20; i++) { alleKnopf3.click(); if (korpus.value !== gehalten) verschoben++; }
      ist("eine gesperrte Stellschraube bleibt stehen", verschoben, 0);
      schloss.click();
    }
  }
}


// ── Der Preset-Editor listet jede Liste, die ein Preset tragen kann ───────
// Gefragt: „Wortbank, Preset bearbeiten und sichern — sind alle neuen
// Kategorien aufgelistet?" Nein: `verwandlungen` fehlte. Der Editor läuft über
// `CATS`, und `CATS` zählt TEXTkategorien auf — die Motivverwandlungen sind
// keine, ihre Einträge stehen nie im Text. Genau deshalb sind sie durchgefallen.
//
// Folge, still wie immer: 41 der 51 eingebauten Presets tragen Paare. Wer eines
// bearbeitete, sah sie nicht und konnte sie beim Speichern nicht behalten.
//
// Diese Prüfung zählt keine Liste nach, sondern hält den Editor gegen das, was
// die Presets WIRKLICH tragen.
{
  const Dok2 = dom.window.document;
  const wurzelW = Dok2.createElement("div");
  Dok2.body.append(wurzelW);
  mountWordbank(wurzelW);
  const imEditor = new Set(Array.from(wurzelW.querySelectorAll("textarea[id^=wb-full-]"))
    .map((t) => (t as HTMLElement).id.replace("wb-full-", "")));
  const imBestand = new Set<string>();
  for (const b of Object.values(BUILTIN_PRESETS) as unknown as Record<string, unknown>[]) {
    for (const k of Object.keys(b)) { const v = b[k]; if (Array.isArray(v) && v.length) imBestand.add(k); }
  }
  wahr(`der Editor hat Felder (${imEditor.size})`, imEditor.size >= 8);
  const fehlt = [...imBestand].filter((k) => !imEditor.has(k)).sort();
  ist("jede Liste des Bestands hat ein Feld im Editor", fehlt.join(", "), "");
  const zuviel = [...imEditor].filter((k) => !imBestand.has(k)).sort();
  ist("und der Editor erfindet keine", zuviel.join(", "), "");

  // Ein Feld, das man sieht und beim Speichern verliert, wäre schlimmer als
  // keines. Also einmal durch: eintragen, übernehmen, zurücklesen.
  const feld = wurzelW.querySelector("#wb-full-verwandlungen") as HTMLTextAreaElement | null;
  const uebernehmen = Array.from(wurzelW.querySelectorAll("button"))
    .find((b) => /Alle übernehmen/.test(b.textContent || "")) as HTMLButtonElement | undefined;
  wahr("das Feld für die Verwandlungen ist da", !!feld);
  wahr("und die Taste Alle uebernehmen auch", !!uebernehmen);
  if (feld && uebernehmen) {
    feld.value = "Glocke→Stimme\nTurm→Berg";
    feld.dispatchEvent(new dom.window.Event("input"));
    uebernehmen.click();
    ist("die Paare überstehen das Speichern", (loadBank().verwandlungen || []).join(" "), "Glocke→Stimme Turm→Berg");
    // Und der Hinweis meldet ein Paar, das nicht wirkt.
    feld.value = "Glocke→Stimme\nGlocke→Berg";
    feld.dispatchEvent(new dom.window.Event("input"));
    const hinweis = (feld.parentElement?.textContent || "");
    wahr("ein Paar mit falschem Geschlecht wird angezeigt", /wirken nicht|verschiedenes Geschlecht/.test(hinweis));
  }
}


// ── Übergaben aus anderen Reitern kommen an ──────────────────────────────
// Gefragt: „Werden die Ideen ins Studio übertragen oder steht das still?"
// Nachgestellt — und es stand still, seit 4.294.0 und durch eigenes Verschulden:
// Damit ein Wurf aus dem Reiter Diagnose beim Zurückwechseln ankommt, wurden die
// vier W in den Merkzettel aufgenommen. Dessen Wiederherstellung lief NACH der
// Übergabe aus `dm_pending_ctx` und setzte den alten Kontext zurück. „→ Studio"
// aus dem Reiter Ideen sah aus, als täte es nichts.
//
// Die Regel dahinter: Was ein anderer Reiter übergibt, hat Vorrang vor dem
// Gemerkten. Der Merkzettel soll einen Reiterwechsel überbrücken, nicht eine
// Absicht überschreiben.
{
  const Dok3 = dom.window.document;
  const wurzelS = Dok3.createElement("div");
  Dok3.body.append(wurzelS);
  mountStudio(wurzelS);
  // Attributwähler statt „#id": Im Prüfstand hängen mehrere Studios im selben
  // Dokument, und jsdom findet eine doppelt vergebene Kennung im Teilbaum nicht
  // zuverlässig über den Id-Wähler.
  const feld = (id: string): HTMLInputElement => wurzelS.querySelector(`[id="${id}"]`) as HTMLInputElement;
  const wert = (id: string): string => feld(id).value;
  const vorher = wert("f-where");
  localStorage.setItem("dm_pending_ctx", JSON.stringify({
    who: "ein Spiegel mit Gedächtnis", where: "an einem vergessenen Koordinatenpunkt",
    when: "kurz vor dem Aufbruch", what: "beantragt eine Genehmigung zu existieren",
  }));
  mountStudio(wurzelS);
  ist("die Übergabe aus einem anderen Reiter kommt an", wert("f-where"), "an einem vergessenen Koordinatenpunkt");
  ist("und auch das Wer", wert("f-who"), "ein Spiegel mit Gedächtnis");
  wahr("sie ersetzt den vorherigen Kontext", wert("f-where") !== vorher);
  mountStudio(wurzelS);
  ist("und überlebt den nächsten Reiterwechsel", wert("f-where"), "an einem vergessenen Koordinatenpunkt");
}

// ── Der Reiter Ideen behält seine Einstellung ────────────────────────────
// Beim Nachsehen mitgefunden: `mountIdeas` würfelte bei JEDEM Aufbau alle zehn
// Merkmale neu. Wer sie von Hand gesetzt, ins Studio geschaut und
// zurückgewechselt hat, fand ein fremdes Profil vor. Im Studio gibt es dieselbe
// Regel seit langem; hier fehlte sie.
{
  const Dok4 = dom.window.document;
  const wurzelI = Dok4.createElement("div");
  Dok4.body.append(wurzelI);
  mountIdeas(wurzelI);
  const lesen = (): string => ["idea-genre", "idea-ton", "idea-mass", "idea-div"]
    .map((id) => (wurzelI.querySelector(`[id="${id}"]`) as HTMLSelectElement | HTMLInputElement).value).join("/");
  const setz = (id: string, v: string): void => {
    const e = wurzelI.querySelector(`[id="${id}"]`) as HTMLSelectElement;
    e.value = v; e.dispatchEvent(new dom.window.Event("change"));
  };
  setz("idea-genre", "horror"); setz("idea-ton", "ironisch"); setz("idea-mass", "kosmisch");
  const gesetzt = lesen();
  mountIdeas(wurzelI);
  ist("die eingestellten Merkmale überleben den Reiterwechsel", lesen(), gesetzt);
  wahr("und sie sind wirklich gesetzt", /horror\/ironisch\/kosmisch/.test(gesetzt));
}

// ── Reibung ↔ Preset-Auswahl: eine Wahrheit ────────────────────────────────
// Gemeldet (4.323.1): Der einfache Kopf war in Bezug auf die Presets nicht
// synchron mit den Einstellungen im Studio. Der Regler stand still, wenn man
// im Studio ankreuzte, und griff selbst erst beim Erzeugen — mit neu
// gewürfelten Presets, die eine Handauswahl kommentarlos ersetzten.
{
  const Dok5 = dom.window.document;
  localStorage.removeItem("dm_multi_presets_v1");
  const wurzelR = Dok5.createElement("div");
  Dok5.body.append(wurzelR);
  mountStudio(wurzelR);
  const reibung = wurzelR.querySelector('input[aria-label="Reibung zwischen den Registern"]') as HTMLInputElement;
  const kaesten = (): HTMLInputElement[] => Array.from(wurzelR.querySelectorAll(".mplist input[type=checkbox]")) as HTMLInputElement[];
  const klick = (i: number): void => { const k = kaesten()[i]!; k.checked = !k.checked; k.dispatchEvent(new dom.window.Event("change")); };
  wahr("es gibt den Reibungsregler", !!reibung);
  // Studio → Kopf: Ankreuzen zieht den Regler nach (Reibung folgt der Auswahl).
  ist("Ausgangslage: ein Preset ist angekreuzt", kaesten().filter((k) => k.checked).length, 1);
  ist("… und der Regler steht auf einstimmig", reibung.value, "0");
  const freie = kaesten().map((k, i) => [k.checked, i] as const).filter(([c]) => !c).map(([, i]) => i);
  klick(freie[0]!);
  ist("zweites Preset angekreuzt → gemischt", reibung.value, "1");
  klick(freie[1]!);
  ist("drittes Preset angekreuzt → weit auseinander", reibung.value, "2");
  // Kopf → Studio: Der Regler schreibt sofort in die echte Auswahl — und
  // behält Angekreuztes, statt neu zu würfeln.
  const drei = kaesten().filter((k) => k.checked).map((k) => k.value);
  reibung.value = "1"; reibung.dispatchEvent(new dom.window.Event("input"));
  const zwei = kaesten().filter((k) => k.checked).map((k) => k.value);
  ist("Regler auf gemischt → zwei Presets aktiv", zwei.length, 2);
  wahr("… und beide waren vorher schon angekreuzt", zwei.every((id) => drei.includes(id)));
  reibung.value = "2"; reibung.dispatchEvent(new dom.window.Event("input"));
  const wieder = kaesten().filter((k) => k.checked).map((k) => k.value);
  ist("hochgedreht → drei Presets aktiv", wieder.length, 3);
  wahr("… die zwei vorhandenen blieben stehen", zwei.every((id) => wieder.includes(id)));
  // Zusage im Quelltext, die eine Messung nicht sieht: Der Erzeugen-Knopf
  // würfelt die Presets nicht mehr um — das Würfeln war die andere Hälfte
  // der Unsynchronität.
  wahr("Erzeugen würfelt die Presets nicht mehr um", !/waehleGespreizt\(vorrat, st\.presets\)/.test(studio));
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
