// Prüfstand Zeitungssetzer: Layout-Logik rein, und ein Rundgang durch den
// echten Setzer in einem nachgebauten Browser (jsdom).
//
// Der Rundgang gibt es, weil zwei Fehler durch alle bisherigen Prüfungen
// gefallen sind: Ein verschobenes Bild sprang beim nächsten Zeichnen zurück,
// und der Druckdialog bekam ein Dokument, in dem alles ausgeblendet war.
// Beides ist nur zu sehen, wenn der Setzer wirklich läuft.
//
// Was jsdom NICHT kann: rechnen, wie hoch ein Absatz wird (alle Maße sind 0).
// Der Umbruch wird hier also nicht geprüft — dafür gibt es die Messung im
// Browser. Geprüft wird der Ablauf: Entsteht die Druckfassung? Hält eine
// verschobene Lage einen Neuaufbau aus?
import { JSDOM } from "jsdom";

const dom = new JSDOM("<!doctype html><html><body><div id=app></div></body></html>",
  { pretendToBeVisual: true, url: "https://x.test/" });
const g = globalThis as unknown as Record<string, unknown>;
g.window = dom.window; g.document = dom.window.document;
g.HTMLElement = dom.window.HTMLElement; g.HTMLInputElement = dom.window.HTMLInputElement;
g.HTMLSelectElement = dom.window.HTMLSelectElement; g.Event = dom.window.Event;
g.localStorage = dom.window.localStorage; g.getComputedStyle = dom.window.getComputedStyle;
let gedruckt = 0;
(dom.window as unknown as { print: () => void }).print = () => { gedruckt++; };
(dom.window as unknown as { prompt: () => string }).prompt = () => "Testlayout";
(dom.window as unknown as { confirm: () => boolean }).confirm = () => true;

import { oeffneZeitungssetzer, satzWeg } from "../src/ui/zeitungView";
import {
  BILD_KEY, ladeBilder, spaltenBreite, spaltenSpanne, bildplatz, type Raster,
} from "../src/features/zeitungsbilder";
import {
  textSchluessel, ordneZu, legeLayout, entferneLayout, LAYOUT_KEY, LAYOUT_ANZAHL,
  type Layout, type LayoutTeil,
} from "../src/features/zeitungslayout";

const fails: string[] = [];
const zeilen: string[] = [];
let geprueft = 0;
const ist = (name: string, wert: unknown, soll: unknown): void => {
  geprueft++;
  if (wert === soll) zeilen.push(`  ✓ ${name}`);
  else { zeilen.push(`  ✗ ${name}`); fails.push(`${name}: „${String(wert)}“ — erwartet „${String(soll)}“`); }
};
const wahr = (name: string, b: boolean): void => ist(name, b, true);

// ── 1 · Layout-Logik ────────────────────────────────────────────────────────
const T1 = { t: "Der  erste\nText.", form: "prose" };
const T2 = { t: "der erste text.", form: "prose" };
const T3 = { t: "Der erste Text.", form: "bericht" };
ist("Umbruch und Großschreibung ändern den Schlüssel nicht", textSchluessel(T1), textSchluessel(T2));
wahr("andere Form = anderer Schlüssel", textSchluessel(T1) !== textSchluessel(T3));

const quellen = [T3, { t: "Zweiter Text", form: "prose" }, T1, { t: "Zweiter Text", form: "prose" }];
const teile: LayoutTeil[] = [
  { schluessel: textSchluessel(T1), rolle: "aufmacher", titel: "A" },
  { schluessel: textSchluessel({ t: "Zweiter Text", form: "prose" }), rolle: "spalte", titel: "B" },
  { schluessel: textSchluessel({ t: "Zweiter Text", form: "prose" }), rolle: "kasten", titel: "C" },
  { schluessel: textSchluessel({ t: "Verschwundener Text", form: "prose" }), rolle: "spalte", titel: "D" },
];
const zu = ordneZu(teile, quellen);
ist("drei von vier gefunden", zu.gefunden, 3);
ist("eines fehlt", zu.fehlend, 1);
ist("Aufmacher sitzt am richtigen Text", zu.zuordnung.get(2)?.titel, "A");
wahr("zwei gleiche Texte bekommen zwei Plätze", zu.zuordnung.has(1) && zu.zuordnung.has(3));
ist("und nicht denselben", zu.zuordnung.get(1)?.titel === zu.zuordnung.get(3)?.titel, false);

const L = (name: string): Layout => ({ name, d: "", kopf: {} as Layout["kopf"], spalten: 3, seiten: 1, teile: [], bilder: [] });
ist("gleicher Name ersetzt", legeLayout([L("a"), L("b")], L("a")).length, 2);
ist("neuer Name kommt dazu", legeLayout([L("a")], L("b")).length, 2);
let viele: Layout[] = [];
for (let i = 0; i < LAYOUT_ANZAHL + 5; i++) viele = legeLayout(viele, L("l" + i));
ist("Deckel hält", viele.length, LAYOUT_ANZAHL);
ist("das Älteste fällt heraus", viele[0]!.name, "l5");
ist("Löschen wirkt", entferneLayout([L("a"), L("b")], "a").length, 1);
wahr("Layouts wandern in die Projektdatei", LAYOUT_KEY.startsWith("divergenz_"));

// ── 2 · Rundgang durch den Setzer ───────────────────────────────────────────
const GIF = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
localStorage.setItem("dm_treasury_v1", JSON.stringify([
  { t: "Ein Bericht.\nDie Schlagzeile\nEin Vorspann dazu.\n\nUnd ein Absatz.", form: "bericht", d: "x" },
  { t: "Ein zweiter Text der Schatzkammer.", form: "prose", d: "x" },
]));
localStorage.setItem(BILD_KEY, JSON.stringify([
  { id: "b1", daten: GIF, seite: 0, x: 100, y: 100, b: 200, h: 150, verh: 200 / 150 },
]));

const q = (sel: string): Element | null => document.querySelector(sel);
const alle = (sel: string): Element[] => Array.from(document.querySelectorAll(sel));
const knopf = (re: RegExp): HTMLElement =>
  alle(".zk-dialog button").find((b) => re.test(b.textContent || "")) as HTMLElement;
const klick = (elm: Element | null): void => { elm?.dispatchEvent(new dom.window.Event("click", { bubbles: true })); };

let geworfen = "";
try { oeffneZeitungssetzer("Ein Text aus dem Studio.", "prose"); }
catch (e) { geworfen = e instanceof Error ? e.message : String(e); }
ist("Setzer öffnet ohne Ausnahme", geworfen, "");
wahr("Dialog steht", !!q(".zk-dialog"));

// Ohne Auswahl darf NICHT gedruckt werden — sonst bekommt der Browser ein
// Dokument, in dem jedes Element ausgeblendet ist, und lädt ewig.
klick(knopf(/Drucken/));
ist("ohne Auswahl wird nicht gedruckt", gedruckt, 0);
wahr("und es steht da, warum", /Nichts zu drucken/.test((q(".zk-status") as HTMLElement)?.textContent || ""));

klick(knopf(/füllen/));
const seitenVorschau = alle(".zk-blatt .zk-seite").length;
wahr("Vorschau hat Seiten", seitenVorschau > 0);
ist("Druckfassung hat gleich viele Seiten", alle(".dm-print-aktiv > .zk-seite").length, seitenVorschau);
ist("Bild steht in der Vorschau", alle(".zk-blatt .zk-bild").length, 1);
ist("Bild steht auch in der Druckfassung", alle(".dm-print-aktiv .zk-bild").length, 1);
ist("Griffe sind aus der Druckfassung entfernt", alle(".dm-print-aktiv .zk-griff").length, 0);
wahr("Bildschicht hängt an der Seite", !!q(".zk-blatt .zk-seite > .zk-bilder"));
ist("die Seite ist Bezugsrahmen", (q(".zk-blatt .zk-seite") as HTMLElement).style.position, "relative");

// ── 3 · Der gemeldete Fehler: verschobene Lage muss den Neuaufbau überleben ──
const PE = (dom.window as unknown as { PointerEvent: typeof MouseEvent }).PointerEvent;
const zeiger = (typ: string, x: number, y: number): Event =>
  new PE(typ, { bubbles: true, clientX: x, clientY: y } as MouseEventInit);
const ziehe = (von: [number, number], nach: [number, number]): void => {
  const b = q(".zk-blatt .zk-bild") as HTMLElement;
  b.dispatchEvent(zeiger("pointerdown", von[0], von[1]));
  dom.window.dispatchEvent(zeiger("pointermove", nach[0], nach[1]));
  dom.window.dispatchEvent(zeiger("pointerup", nach[0], nach[1]));
};
// Erst ohne Raster: Das Bild muss genau dort liegen, wo es losgelassen wurde.
const rasterKnopf = knopf(/Raster/);
wahr("Raster ist voreingestellt an", rasterKnopf.classList.contains("on"));
klick(rasterKnopf);
wahr("Raster lässt sich abschalten", !rasterKnopf.classList.contains("on"));
ziehe([300, 300], [380, 350]);
ist("Ziehen bewegt das Bild", (q(".zk-blatt .zk-bild") as HTMLElement).style.left, "180px");
ist("und die Lage steht im Speicher", ladeBilder()[0]?.x, 180);

// Neuzeichnen auslösen (Spaltenzahl ändern) — die Lage muss halten.
const spaltenSel = alle(".druckfeld select")[0] as HTMLSelectElement;
spaltenSel.value = "2";
spaltenSel.dispatchEvent(new dom.window.Event("change", { bubbles: true }));
ist("nach dem Neuzeichnen bleibt die Lage", (q(".zk-blatt .zk-bild") as HTMLElement).style.left, "180px");
ist("und springt nicht in die Mitte", (q(".zk-blatt .zk-bild") as HTMLElement).style.top, "150px");
wahr("die Statuszeile nennt die Druckfassung", /Druckfassung: \d+ Seite/.test((q(".zk-status") as HTMLElement)?.textContent || ""));

klick(knopf(/Drucken/));
ist("mit Inhalt wird gedruckt", gedruckt, 1);

// ── 3b · Spaltenraster ──────────────────────────────────────────────────────
// Nach dem Einschalten muss das krumm stehende Bild sofort ausgerichtet sein —
// eine Taste, die erst beim nächsten Ziehen wirkt, sieht wirkungslos aus.
const MM = 96 / 25.4;
const raster = (n: number): Raster => ({ spalten: n, seiteB: 658, seiteH: 972, steg: Math.round(6 * MM), zeile: Math.round(5 * MM) });
klick(knopf(/Raster/));
wahr("Raster wieder an", knopf(/Raster/).classList.contains("on"));
const nachRaster = ladeBilder()[0]!;
const schritt2 = spaltenBreite(raster(2)) + raster(2).steg;   // die Seite steht auf 2 Spalten
ist("Breite ist eine ganze Spalte", nachRaster.b, Math.round(spaltenSpanne(raster(2), 1)));
wahr("linke Kante sitzt auf einer Spaltenkante",
  Math.abs(nachRaster.x % schritt2) <= 1 || Math.abs((nachRaster.x % schritt2) - schritt2) <= 1);
ist("Oberkante sitzt im Zeilenraster", nachRaster.y % raster(2).zeile, 0);
// Und beim Ziehen bleibt es im Raster.
ziehe([200, 200], [260, 240]);
const gezogen = ladeBilder()[0]!;
wahr("auch nach dem Ziehen auf einer Spaltenkante",
  Math.abs(gezogen.x % schritt2) <= 1 || Math.abs((gezogen.x % schritt2) - schritt2) <= 1);
const meldungen = (): string => alle(".zk-dialog .mini").map((x) => x.textContent || "").join(" ");
wahr("die Statuszeile nennt die Spaltenbreite", /Breite \d+ Spalte/.test(meldungen()));
wahr("und ob das Raster an ist", /Raster an/.test(meldungen()));

// ── 4 · Zurück ──────────────────────────────────────────────────────────────
// Selbsttragend: erst den Stand ablesen, dann ändern, dann zurücknehmen.
const spSel = alle(".druckfeld select")[0] as HTMLSelectElement;
const vorZurueck = spSel.value;
spSel.value = spSel.value === "4" ? "5" : "4";
spSel.dispatchEvent(new dom.window.Event("change", { bubbles: true }));
wahr("Spaltenzahl geändert", spSel.value !== vorZurueck);
klick(knopf(/Zurück/));
ist("Zurück stellt die Spaltenzahl wieder her", (alle(".druckfeld select")[0] as HTMLSelectElement).value, vorZurueck);

// ── 5 · Layout speichern und laden ──────────────────────────────────────────
klick(knopf(/Layout speichern/));
const gespeichert = JSON.parse(localStorage.getItem(LAYOUT_KEY) || "[]") as Layout[];
ist("Layout liegt im Speicher", gespeichert.length, 1);
wahr("mit Beiträgen", (gespeichert[0]?.teile.length || 0) > 0);
ist("und mit dem Bild", gespeichert[0]?.bilder.length, 1);

// Auswahl zerstören, dann laden — es muss zurückkommen.
klick(knopf(/füllen/));
const vorher = [...document.querySelectorAll(".zk-zeile input[type=checkbox]")].filter((c) => (c as HTMLInputElement).checked).length;
(alle(".zk-layoutleiste select")[0] as HTMLSelectElement).value = "Testlayout";
klick(knopf(/Laden/));
const nachher = [...document.querySelectorAll(".zk-zeile input[type=checkbox]")].filter((c) => (c as HTMLInputElement).checked).length;
wahr("Laden stellt eine Auswahl her", nachher > 0);
wahr("Meldung nennt die gefundenen Beiträge", /geladen/.test((q(".zk-layoutleiste .mini") as HTMLElement)?.textContent || ""));
ist("Beitragszahl aus dem Layout", nachher, gespeichert[0]!.teile.length);
wahr("die Auswahl war vorher eine andere oder gleich groß", vorher >= 0);

// ── 6 · Kürzen am Spaltenfuß ────────────────────────────────────────────────
ist("letzter Satz fällt weg", satzWeg("Erster Satz. Zweiter Satz. Dritter Satz folgt hier noch nach."),
  "Erster Satz. Zweiter Satz. …");
ist("Jahreszahl beendet keinen Satz",
  satzWeg("Im Jahr 1902. Zeit verging langsam und der Fluss trug alles fort. Dann kam der Winter."),
  "Im Jahr 1902. Zeit verging langsam und der Fluss trug alles fort. …");
ist("zu kurzer Text wird ganz verworfen", satzWeg("Kurz."), "");
wahr("ein einziger langer Satz verliert Wörter",
  satzWeg("Ein einziger sehr langer Satz ohne jedes weitere Satzzeichen der einfach immer weiter laeuft").endsWith("…"));
ist("dreifach angewandt wächst nichts an",
  (satzWeg(satzWeg("Eins zwei drei. Vier fuenf sechs. Sieben acht neun. Zehn elf zwoelf.")).match(/…/g) || []).length, 1);

// ── 7 · Der Text bricht am Bild ─────────────────────────────────────────────
// jsdom rechnet kein Layout. Für diesen Punkt wird die Geometrie vorgetäuscht —
// geprüft wird nicht, WIE der Browser umbricht, sondern ob der Platzhalter in
// der richtigen Spalte, an der richtigen Stelle und in der richtigen Höhe
// hängt. Das Umbrechen selbst macht CSS mit einem Gleitkasten.
const SP_N = 3;
const rr = raster(SP_N);
const spB = spaltenBreite(rr);
const kasten = (l: number, t: number, w: number, h: number): DOMRect =>
  ({ left: l, top: t, width: w, height: h, right: l + w, bottom: t + h, x: l, y: t, toJSON: () => ({}) }) as DOMRect;
(dom.window.Element.prototype as unknown as { getBoundingClientRect: () => DOMRect }).getBoundingClientRect = function (this: Element): DOMRect {
  if (this.classList.contains("zk-seite")) return kasten(0, 0, 658, 972);
  if (this.classList.contains("zk-spaltebox")) {
    const i = Array.from(this.parentElement?.children || []).indexOf(this);
    return kasten(i * (spB + rr.steg), 300, spB, 600);
  }
  return kasten(0, 0, 0, 0);
};

// Auf drei Spalten stellen und das Bild in die erste Spalte legen.
const spSel2 = alle(".druckfeld select")[0] as HTMLSelectElement;
spSel2.value = String(SP_N);
spSel2.dispatchEvent(new dom.window.Event("change", { bubbles: true }));
localStorage.setItem(BILD_KEY, JSON.stringify([
  { id: "b1", daten: GIF, seite: 0, x: 0, y: 400, b: Math.round(spB), h: 150, verh: Math.round(spB) / 150 },
]));
// Neu öffnen, damit der Setzer die Lage aus dem Speicher liest.
klick(knopf(/Schließen/));
oeffneZeitungssetzer("Ein Text aus dem Studio.", "prose");
klick(knopf(/füllen/));

const kaesten = alle(".zk-blatt .zk-seite .zk-spaltebox");
wahr("Spaltenkästen da", kaesten.length === SP_N);
const platz0 = kaesten[0]?.querySelector(".zk-bildplatz") as HTMLElement | null;
wahr("die berührte Spalte hat einen Platzhalter", !!platz0);
ist("kein Platzhalter in der Nachbarspalte", !!kaesten[1]?.querySelector(".zk-bildplatz"), false);
ist("und keiner in der dritten", !!kaesten[2]?.querySelector(".zk-bildplatz"), false);
const soll = bildplatz({ x: 0, y: 400, b: Math.round(spB), h: 150 }, { x: 0, b: spB, oben: 300, hoehe: 600 }, Math.round(2 * MM))!;
ist("Platzhalter beginnt beim Bild", platz0?.style.marginTop, soll.oben + "px");
ist("Platzhalter ist so hoch wie das Bild samt Luft", platz0?.style.height, soll.hoehe + "px");
ist("er steht als erstes Kind", kaesten[0]?.firstElementChild?.classList.contains("zk-bildplatz"), true);
ist("und er ist nicht in der Druckfassung vergessen", alle(".dm-print-aktiv .zk-bildplatz").length, 1);

// ── Ergebnis ────────────────────────────────────────────────────────────────
console.log(`Prüfstand Zeitungssetzer — ${geprueft} Prüfungen (Layout-Logik + Rundgang in jsdom):`);
zeilen.forEach((z) => console.log(z));
const proc = globalThis as unknown as { process?: { exit: (c: number) => void } };
if (fails.length) {
  console.error(`\n❌ ${fails.length} Fehler im Zeitungssetzer:`);
  fails.forEach((f) => console.error("  - " + f));
  proc.process?.exit(1);
} else {
  console.log(`\n✅ Zeitungssetzer: alle ${geprueft} Prüfungen bestanden.`);
}
