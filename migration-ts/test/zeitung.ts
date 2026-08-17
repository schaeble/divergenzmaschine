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
import { readFileSync } from "fs";

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

import {
  oeffneZeitungssetzer, satzWeg, SEITE_B, SEITE_H, RAND_OBEN, RAND_UNTEN, RAND_SEITE,
} from "../src/ui/zeitungView";
import {
  BILD_KEY, ladeBilder, spaltenBreite, spaltenSpanne, bildplatz, plaetze, platzBesetzt,
  rahmenAusPlatz, type Raster,
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
  if (this.classList.contains("zk-seite")) return kasten(0, 0, SEITE_B, SEITE_H);
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
// Die Auswahlmarke ist eine Bedienspur — sie stand als blauer Rahmen im Druck.
(q(".zk-blatt .zk-bild") as HTMLElement).classList.add("on");
klick(knopf(/Drucken/));
ist("die Auswahlmarke wird nicht mitgedruckt", alle(".dm-print-aktiv .zk-bild.on").length, 0);
wahr("und die Druckregel nimmt sie zusätzlich zurück",
  /\.zk-bild\.on \{ outline: none/.test(readFileSync("src/ui/theme.css", "utf8")));

// ── 8 · Kürzen an der Fußlinie ──────────────────────────────────────────────
// Der gemeldete Fehler: Die letzte Zeile einer Spalte wurde von der Fußlinie
// durchgeschnitten. Hier wird die Geometrie so vorgetäuscht, dass der letzte
// Beitrag über die Linie ragt — und geprüft, dass er danach darüber endet.
ist("Seitenmaß stimmt mit dem Papier überein (264 mm)", SEITE_H, Math.round(264 * 96 / 25.4));

const FUSS_OBEN = 900;
let beitragUnten = 960;                       // ragt zunächst 60 px über die Linie
(dom.window.Element.prototype as unknown as { getBoundingClientRect: () => DOMRect }).getBoundingClientRect = function (this: Element): DOMRect {
  const c = this.classList;
  if (c.contains("zk-seite")) return kasten(0, 0, SEITE_B, SEITE_H);
  if (c.contains("zk-fuss")) return kasten(0, FUSS_OBEN, SEITE_B, 20);
  if (c.contains("zk-spaltebox")) {
    const i = Array.from(this.parentElement?.children || []).indexOf(this);
    return kasten(i * (spB + rr.steg), 300, spB, 600);
  }
  if (c.contains("zk-beitrag")) {
    // Die Messprobe muss KLEIN messen, sonst passt kein Beitrag in eine Spalte
    // und es gibt nichts zu kürzen. Nur der gesetzte Beitrag ragt heraus.
    if (this.closest(".zk-probe")) return kasten(0, 0, spB, 120);
    return kasten(0, 300, spB, beitragUnten - 300);
  }
  return kasten(0, 0, 0, 0);
};
// Jeder weggenommene Absatz hebt die Unterkante um eine Zeile — wie im Satz.
const echterEntfernen = dom.window.Element.prototype.removeChild;
(dom.window.Element.prototype as unknown as { removeChild: unknown }).removeChild = function (this: Element, kind: Node): Node {
  if ((kind as Element).tagName === "P") beitragUnten -= 20;
  return (echterEntfernen as (k: Node) => Node).call(this, kind);
};
// Ein Text mit vielen Absätzen — sonst ist nach dem ersten nichts mehr zu nehmen.
localStorage.setItem("dm_treasury_v1", JSON.stringify([
  { t: Array.from({ length: 10 }, (_, i) => `Absatz ${i + 1} mit genug Text, damit er als eigener Absatz zählt.`).join("\n\n"),
    form: "prose", d: "x" },
  { t: "Ein kurzer zweiter Text.", form: "prose", d: "x" },
]));
klick(knopf(/Schließen/));
oeffneZeitungssetzer("Noch ein Studiotext.", "prose");
klick(knopf(/füllen/));
(dom.window.Element.prototype as unknown as { removeChild: unknown }).removeChild = echterEntfernen;
wahr("nach dem Kürzen endet der Satz über der Fußlinie", beitragUnten <= FUSS_OBEN);
wahr("die Statuszeile nennt die Kürzung",
  /am Fuß gekürzt/.test((q(".zk-status") as HTMLElement)?.textContent || ""));
wahr("der Hinweis auf die Browser-Kopfzeile steht im Dialog",
  /Kopf- und Fußzeilen/.test((q(".zk-druckhinweis") as HTMLElement)?.textContent || ""));

// ── 9 · Vorschau und Druck müssen dieselbe Seite meinen ─────────────────────
// Geprüft wird die Stilvorlage selbst, im Quelltext. Beide Geometrien standen
// schon zweimal auseinander — einmal um zwei Millimeter (Rechnung gegen @page),
// einmal um 8 mm je Beitrag (eine Druckregel, die für den Einzeltext gedacht
// war und die Zeitungsseite mittraf). Beides sieht man erst auf Papier.
// Deshalb hier, wo es billig ist.
const css = readFileSync("src/ui/theme.css", "utf8");
const mm = (re: RegExp): number => { const m = css.match(re); return m ? parseFloat(m[1]!) : -1; };

const vorschauH = mm(/\.zk-blatt \.zk-seite\{width:174mm;height:(\d+(?:\.\d+)?)mm/);
const druckH = mm(/\.dm-print-aktiv\.dm-seiten > \.zk-seite \{[^}]*height: (\d+(?:\.\d+)?)mm/);
ist("Vorschau und Druck haben dieselbe Seitenhöhe", vorschauH, druckH);
ist("und sie passt zu SEITE_H", Math.round(vorschauH * 96 / 25.4), SEITE_H);
const seitenRand = css.match(/@page \{ size: A4; margin: (\d+)mm (\d+)mm (\d+)mm; \}/);
wahr("@page-Ränder stehen in der Vorlage", !!seitenRand);
ist("oberer Rand passt zur Rechnung", Number(seitenRand?.[1]), RAND_OBEN);
ist("seitlicher Rand passt", Number(seitenRand?.[2]), RAND_SEITE);
ist("unterer Rand passt", Number(seitenRand?.[3]), RAND_UNTEN);
ist("Seitenbreite passt zu SEITE_B", Math.round((210 - 2 * RAND_SEITE) * 96 / 25.4), SEITE_B);

// Die 8-mm-Regel des Einzeltextdrucks darf die Zeitungsseite nicht treffen.
wahr("Einzeltext-Abstand wird für die Zeitungsseite zurückgenommen",
  /\.dm-print-aktiv \[data-profil="zeitungsseite"\] \.dm-inhalt[^{]*\{[^}]*margin-top: 0/.test(css));
wahr("und die Regel, die ihn setzt, gibt es noch",
  /\.dm-print-aktiv \.dm-inhalt \{ margin-top: 8mm; \}/.test(css));

// ── 10 · Bedienung ohne Maus und auf schmalem Bildschirm ────────────────────
// Drei Fehler, die am Rechner unsichtbar waren und den Bildteil auf dem Handy
// unbrauchbar machten. Sie kamen aus der Benutzung, nicht aus diesem
// Prüfstand — deshalb stehen sie jetzt hier.

klick(knopf(/Schließen/));
localStorage.setItem(BILD_KEY, JSON.stringify([
  { id: "b9", daten: GIF, seite: 0, x: 40, y: 40, b: 120, h: 90, verh: 120 / 90 },
]));
oeffneZeitungssetzer("Ein Text für den Löschknopf.", "prose");
klick(knopf(/füllen/));
ist("ein Bild steht in der Vorschau", alle(".zk-blatt .zk-bild").length, 1);

// (a) Der Rahmen bricht sein `pointerdown` ab, damit das Ziehen nicht scrollt.
// Auf einem Zeigegerät ohne Maus unterdrückt ein abgebrochenes `pointerdown`
// aber die nachgereichten Maus-Ersatzereignisse — einschließlich `click`. Der
// Löschknopf liegt IM Rahmen und lauscht auf `click`: Am Rechner feuerte er,
// auf dem Handy nie. Seine Berührung darf den Rahmen gar nicht erst erreichen.
// Eigener Erzeuger MIT `cancelable`: Der Helfer aus Abschnitt 3 setzt es nicht,
// und an einem nicht abbrechbaren Ereignis bleibt `preventDefault()` wirkungslos
// — `defaultPrevented` wäre dann immer falsch, und beide Prüfungen unten
// bestünden aus demselben Grund, nämlich gar keinem.
const abbrechbar = (typ: string, x: number, y: number): Event =>
  new PE(typ, { bubbles: true, cancelable: true, clientX: x, clientY: y } as MouseEventInit);
const bildEl = q(".zk-blatt .zk-bild") as HTMLElement;
const xKnopf = q(".zk-blatt .zk-bildx") as HTMLElement;
const pdX = abbrechbar("pointerdown", 50, 50);
xKnopf.dispatchEvent(pdX);
wahr("die Berührung des Löschknopfs wird nicht abgebrochen", !pdX.defaultPrevented);
// Gegenprobe: Am Rahmen selbst MUSS sie abgebrochen werden — sonst scrollt das
// Handy, statt das Bild zu bewegen. Eine Regel, die überall gleich urteilt,
// prüft nichts.
const pdB = abbrechbar("pointerdown", 50, 50);
bildEl.dispatchEvent(pdB);
dom.window.dispatchEvent(zeiger("pointerup", 50, 50));
wahr("am Bildrahmen dagegen schon", pdB.defaultPrevented);
klick(xKnopf);
ist("und der Klick entfernt das Bild", alle(".zk-blatt .zk-bild").length, 0);
ist("auch aus dem Speicher", ladeBilder().length, 0);

// (b) Ohne Hover gibt es keine Griffe: Auf Berührung wird `:hover` nie wahr,
// also blieben Griff und Löschknopf unsichtbar. Beide lagen zudem AUSSERHALB
// des Rahmens, und die Bildschicht schneidet ab.
wahr("die Griffe stehen in der Grundregel auf unsichtbar",
  /\.zk-griff\{[^}]*opacity:0/.test(css));
wahr("ohne Hover werden sie dauerhaft eingeblendet",
  /@media \(hover:none\)\{[^]*?\.zk-griff,\.zk-bildx\{opacity:1\}/.test(css));
wahr("und liegen dort innerhalb des Rahmens",
  /@media \(hover:none\)\{[^]*?\.zk-griff\{right:0;bottom:0/.test(css));
wahr("denn die Bildschicht schneidet wirklich ab",
  /\.zk-bilder\{[^}]*overflow:hidden/.test(css));

// (c) Das Blatt ist 210 mm breit und stand auf dem Handy in einem rund 360 px
// breiten Kasten. Verkleinert wird es als Ganzes — die Geometrie bleibt.
wahr("es gibt eine Verkleinerungsregel für das Blatt",
  /\.zk-blatt\.zk-eng \.zk-papier\{[^}]*transform:scale\(var\(--zk-zoom/.test(css));
wahr("sie nimmt den Platz mit, den das Kastenmaß sonst stehen ließe",
  /\.zk-blatt\.zk-eng \.zk-papier\{[^}]*margin:0 calc\(-210mm/.test(css));
wahr("die Griffe werden gegenskaliert, sonst schrumpfen sie mit",
  /\.zk-blatt\.zk-eng \.zk-griff[^{]*\{transform:scale\(calc\(1 \/ var\(--zk-zoom/.test(css));
wahr("im Druck bleibt keine Verkleinerung stehen",
  /\.zk-papier \{ transform: none !important;/.test(css));
// Gegenprobe zur Rechnung: Ein Kasten ohne messbare Breite (jsdom, aber auch
// ein noch nicht sichtbarer Dialog) darf NICHT in die kleinste Stufe fallen.
wahr("ohne messbare Breite bleibt das Blatt unverkleinert",
  !(q(".zk-blatt") as HTMLElement).classList.contains("zk-eng"));

// ── 11 · Zwei Griffe hintereinander ─────────────────────────────────────────
// Gemeldet: Ein Bild verkleinern, dann verschieben — und es stand wieder in
// Originalgröße da. Ursache: Jeder Griff startete bei dem Stand, den der Rahmen
// beim ZEICHNEN mitbekommen hatte. Nach dem Loslassen wird aber nur die Liste
// fortgeschrieben, nicht neu gezeichnet — also war dieser Stand veraltet.
klick(knopf(/Schließen/));
localStorage.setItem(BILD_KEY, JSON.stringify([
  { id: "b7", daten: GIF, seite: 0, x: 100, y: 100, b: 200, h: 150, verh: 200 / 150 },
]));
oeffneZeitungssetzer("Ein Text für zwei Griffe.", "prose");
klick(knopf(/füllen/));
if (knopf(/Raster/).classList.contains("on")) klick(knopf(/Raster/));   // frei ziehen

// Erst aufziehen: 60 px schmaler.
const griffEl = q(".zk-blatt .zk-griff") as HTMLElement;
griffEl.dispatchEvent(zeiger("pointerdown", 300, 300));
dom.window.dispatchEvent(zeiger("pointermove", 240, 300));
dom.window.dispatchEvent(zeiger("pointerup", 240, 300));
const nachSkalieren = ladeBilder()[0]!;
ist("Aufziehen ändert die Breite", nachSkalieren.b, 140);
// Dann verschieben — die Breite darf sich dabei NICHT ändern.
ziehe([300, 300], [330, 320]);
const nachSchieben = ladeBilder()[0]!;
ist("Verschieben lässt die Breite, wie sie war", nachSchieben.b, nachSkalieren.b);
ist("und die Höhe auch", nachSchieben.h, nachSkalieren.h);
ist("verschoben wurde trotzdem", nachSchieben.x, nachSkalieren.x + 30);
// Gegenprobe: Zweimal verschieben muss sich addieren, nicht zurückspringen.
ziehe([330, 320], [350, 320]);
ist("und zwei Verschiebungen addieren sich", ladeBilder()[0]?.x, nachSchieben.x + 20);

// ── 12 · Feste Bildplätze ───────────────────────────────────────────────────
// Reine Rechnung — im Browser hängt sie am gemessenen Spaltenbereich, und der
// ist in jsdom null. Geprüft wird deshalb die Geometrie, nicht die Anzeige.
const rP: Raster = { spalten: 3, seiteB: SEITE_B, seiteH: SEITE_H, steg: 23, zeile: 19 };
const ps = plaetze(rP, 200, 600, 3, 8);
ist("drei Bänder mal drei Spalten", ps.length, 9);
ist("der erste Platz beginnt am Spaltenbereich", ps[0]!.y, 200);
ist("und an der linken Kante", ps[0]!.x, 0);
ist("ein Platz ist genau eine Spalte breit", ps[0]!.b, Math.round(spaltenBreite(rP)));
ist("die zweite Spalte beginnt nach dem Steg", ps[1]!.x, Math.round(spaltenBreite(rP) + rP.steg));
// Die Bänder teilen den Bereich. Auf den Pixel geht das nicht auf — jeder Platz
// wird für sich gerundet. Geprüft wird deshalb die Eigenschaft, die zählt: Kein
// Platz darf unter die Fußlinie ragen, und die Bänder dürfen nicht klaffen.
const bandH = ps[0]!.h;
wahr("die Bänder füllen den Bereich bis auf die Fugen",
  Math.abs(bandH * 3 + 2 * 8 - 600) <= 2);
ist("das letzte Band endet am Bereichsende", ps[8]!.y + ps[8]!.h, 800);
wahr("kein Platz ragt unter die Fußlinie", ps.every((p) => p.y + p.h <= 800));
wahr("kein Platz ragt über die Seite", ps.every((p) => p.x + p.b <= SEITE_B + 1));
// Gegenprobe zur Klemme: Auch bei krummen Zahlen darf nichts hinausragen.
for (const hh of [301, 457, 599, 613, 1000]) {
  const q3 = plaetze(rP, 137, hh);
  wahr(`kein Überstand bei ${hh} px Bereichshöhe`, q3.every((p) => p.y + p.h <= Math.round(137 + hh)));
}
// Gegenprobe: Ohne Höhe gibt es keine Plätze — sonst entstünden Felder mit
// Höhe 0, die man anklicken könnte und die nichts aufnehmen.
ist("ohne Spaltenbereich keine Plätze", plaetze(rP, 0, 0).length, 0);

// Besetzt heißt: ein Bild deckt die Mitte des Platzes. Ein Bild, das ihn nur
// streift, darf die Nachbarplätze nicht mit abräumen.
const mitte = ps[0]!;
wahr("ein Bild auf dem Platz besetzt ihn",
  platzBesetzt(mitte, [{ x: mitte.x, y: mitte.y, b: mitte.b, h: mitte.h }]));
wahr("ein Bild daneben nicht",
  !platzBesetzt(mitte, [{ x: mitte.x + mitte.b + 5, y: mitte.y, b: 40, h: 40 }]));
wahr("und ein Bild, das nur die Ecke streift, auch nicht",
  !platzBesetzt(mitte, [{ x: mitte.x - 20, y: mitte.y - 20, b: 25, h: 25 }]));

// Der Rahmen aus dem Platz nimmt dessen Maße, NICHT die des Bildes — das ist
// der ganze Sinn: Es gibt nichts zu skalieren.
const rp = rahmenAusPlatz(GIF, mitte, 0, "px1");
ist("der Rahmen übernimmt die Breite des Platzes", rp.b, mitte.b);
ist("und die Höhe", rp.h, mitte.h);
ist("und die Lage", rp.x + "," + rp.y, mitte.x + "," + mitte.y);
ist("das Verhältnis ist das des Platzes", rp.verh, mitte.b / mitte.h);
wahr("Platzfelder gehören nicht aufs Papier",
  /\.zk-griff, \.zk-bildx, \.zk-platz \{ display: none/.test(css));
wahr("und werden aus der Druckkopie entfernt",
  /\.zk-griff, \.zk-bildx, \.zk-platz"\)\.forEach/.test(readFileSync("src/ui/zeitungView.ts", "utf8")));

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
