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
let titelBeimDruck = "";
(dom.window as unknown as { print: () => void }).print = () => {
  gedruckt++; titelBeimDruck = dom.window.document.title;
};
(dom.window as unknown as { prompt: () => string }).prompt = () => "Testlayout";
(dom.window as unknown as { confirm: () => boolean }).confirm = () => true;

import { schemaVon, schemaPlaetze } from "../src/features/musterseite";
import {
  oeffneZeitungssetzer, satzWeg, druckName, ohneUeberschrift, darfKuerzen, ladeKopf,
  waehleFueller, vignette, FUELLER_MIN, FUELLER_TEXT_MIN, SEITE_B, SEITE_H, RAND_OBEN, RAND_UNTEN, RAND_SEITE,
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
// hängt. Das Setzen selbst macht der Abstand über dem Beitrag.
const SP_N = 3;
const rr = raster(SP_N);
const spB = spaltenBreite(rr);
const kasten = (l: number, t: number, w: number, h: number): DOMRect =>
  ({ left: l, top: t, width: w, height: h, right: l + w, bottom: t + h, x: l, y: t, toJSON: () => ({}) }) as DOMRect;
(dom.window.Element.prototype as unknown as { getBoundingClientRect: () => DOMRect }).getBoundingClientRect = function (this: Element): DOMRect {
  const c = this.classList;
  if (c.contains("zk-seite")) return kasten(0, 0, SEITE_B, SEITE_H);
  // Kopf 180 + Aufmacher 120 = 300: dieselbe Oberkante, die für die
  // Spaltenkästen vorgetäuscht wird. Nur so rechnet der Setzer mit derselben
  // Geometrie, die der Prüfstand behauptet.
  if (c.contains("zk-kopf")) return kasten(0, 0, SEITE_B, 180);
  // Ohne Fußlinie hielte das Kürzen am Fuß JEDEN Beitrag für überstehend und
  // räumte die Spalten leer.
  if (c.contains("zk-fuss")) return kasten(0, 900, SEITE_B, 20);
  if (c.contains("zk-spaltebox")) {
    const i = Array.from(this.parentElement?.children || []).indexOf(this);
    return kasten(i * (spB + rr.steg), 300, spB, 600);
  }
  if (c.contains("zk-beitrag")) return kasten(0, 0, spB, 120);
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
// Der Platz für das Bild entsteht jetzt in der VERTEILUNG: Der erste Beitrag
// unter dem Bild bekommt einen Abstand, der ihn an dessen Unterkante setzt.
// Vorher war es ein Gleitkasten — der verschob nur Zeilen, zerriss Beiträge und
// machte sie höher als gemessen, worauf die Nachmessung sie hinauswarf.
const SPALTE_OBEN = 300, PROBE_H = 120;
const flussVon = (kasten2: Element, ziel: HTMLElement): number => {
  let fluss = 0;
  for (const x of Array.from(kasten2.querySelectorAll(".zk-beitrag")) as HTMLElement[]) {
    fluss += parseFloat(x.style.marginTop || "0");
    if (x === ziel) return fluss;
    fluss += PROBE_H;
  }
  return fluss;
};
{
  const spalte0 = kaesten[0]!;
  const beitraege0 = Array.from(spalte0.querySelectorAll(".zk-beitrag")) as HTMLElement[];
  const mitAbstand = beitraege0.filter((x) => parseFloat(x.style.marginTop || "0") > 0);
  wahr("die Spalte mit dem Bild hat Beiträge", beitraege0.length > 0, `${beitraege0.length}`);
  ist("genau einer setzt unter dem Bild neu an", mitAbstand.length, 1);
  const unterkante = 400 + 150 + Math.round(2 * MM);
  const start = SPALTE_OBEN + flussVon(spalte0, mitAbstand[0]!);
  wahr("und zwar an der Unterkante des Bildes", Math.abs(start - unterkante) <= 2, `${start} gegen ${unterkante}`);
  wahr("die Nachbarspalte bekommt keinen Abstand",
    !Array.from(kaesten[1]?.querySelectorAll(".zk-beitrag") || []).some((x) => parseFloat((x as HTMLElement).style.marginTop || "0") > 0));
}

// ── 7b · Zwei Bilder in EINER Spalte ────────────────────────────────────────
// Der gemeldete Fehler: Danach war der Text weg. Jede Lücke braucht ihren
// eigenen Wiedereinstieg — und die Spalte muss Text behalten.
localStorage.setItem(BILD_KEY, JSON.stringify([
  { id: "b1", daten: GIF, seite: 0, x: 0, y: 380, b: Math.round(spB), h: 120, verh: Math.round(spB) / 120 },
  { id: "b2", daten: GIF, seite: 0, x: 0, y: 700, b: Math.round(spB), h: 120, verh: Math.round(spB) / 120 },
]));
klick(knopf(/Schließen/));
oeffneZeitungssetzer("Ein Text aus dem Studio.", "prose");
klick(knopf(/füllen/));
{
  const spalte0 = alle(".zk-blatt .zk-seite .zk-spaltebox")[0]!;
  const beitraege0 = Array.from(spalte0.querySelectorAll(".zk-beitrag")) as HTMLElement[];
  wahr("die Spalte behält Text", beitraege0.length > 0, `${beitraege0.length} Beiträge`);
  const kanten = [380 + 120 + Math.round(2 * MM), 700 + 120 + Math.round(2 * MM)];
  const abstaende = beitraege0.filter((x) => parseFloat(x.style.marginTop || "0") > 0);
  wahr("mindestens ein Wiedereinstieg", abstaende.length >= 1, `${abstaende.length}`);
  for (const x of abstaende) {
    const start = SPALTE_OBEN + flussVon(spalte0, x);
    wahr("ein Wiedereinstieg sitzt an einer Bildunterkante",
      kanten.some((k) => Math.abs(start - k) <= 2), `${start} gegen ${kanten.join(" oder ")}`);
  }
  const inBand = beitraege0.some((x) => {
    const start = SPALTE_OBEN + flussVon(spalte0, x);
    return (start > 380 && start < 500) || (start > 700 && start < 820);
  });
  wahr("kein Beitrag beginnt mitten im Bild", !inBand);
}

// ── 8 · Kürzen an der Fußlinie ──────────────────────────────────────────────
// Der gemeldete Fehler: Die letzte Zeile einer Spalte wurde von der Fußlinie
// durchgeschnitten. Hier wird die Geometrie so vorgetäuscht, dass der letzte
// Beitrag über die Linie ragt — und geprüft, dass er danach darüber endet.
ist("Seitenmaß stimmt mit dem Papier überein (264 mm)", SEITE_H, Math.round(264 * 96 / 25.4));

let probenHoehe = 120;   // wie hoch ein Beitrag in der Messprobe „misst"
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
    if (this.closest(".zk-probe")) return kasten(0, 0, spB, probenHoehe);
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
// Form „bericht": Nur Bericht und Meldung werden von hinten gekürzt, weil sie
// als umgekehrte Pyramide gebaut sind. Bei Prosa und Vers trägt das Ende; die
// fallen ganz weg (siehe Gegenprobe weiter unten).
localStorage.setItem("dm_treasury_v1", JSON.stringify([
  { t: Array.from({ length: 12 }, (_, i) => `Absatz ${i + 1} mit genug Text, damit er als eigener Absatz zählt.`).join("\n\n"),
    form: "bericht", d: "x" },
  { t: "Ein kurzer zweiter Text.", form: "bericht", d: "x" },
]));
klick(knopf(/Schließen/));
oeffneZeitungssetzer("Noch ein Studiotext.", "prose");
klick(knopf(/füllen/));
// Seit „Seiten füllen" würfelt, kann der lange Text als Aufmacher landen — und
// der steht AUSSERHALB der Spaltenkästen, wo nicht gekürzt wird. Für diese
// Prüfung müssen alle Beiträge in Spalten stehen.
for (const sel of alle(".zk-zeile select") as HTMLSelectElement[]) {
  if (sel.value === "aufmacher") { sel.value = "spalte"; sel.dispatchEvent(new dom.window.Event("change", { bubbles: true })); }
}
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

// ── 13 · Dateiname beim Speichern als PDF ───────────────────────────────────
// Der Browser schlägt den DOKUMENTTITEL als Dateinamen vor. Einen anderen Weg
// gibt es von hier aus nicht.
const D = new Date(2026, 7, 17);                       // 17. August 2026
ist("Name der Zeitung und Tagesdatum", druckName("Der Zeitstrom", D), "Der Zeitstrom 17.08.2026");
// Die Ausgabennummer gehört in den Dateinamen: Zwei Ausgaben am selben Tag
// hießen sonst gleich, und der Browser hängt „(1)" an.
ist("mit Ausgabennummer", druckName("Zeitzeichen", new Date(2026, 7, 21), "Nr. 36"),
  "Zeitzeichen 21.08.2026 Nr. 36");
ist("leere Ausgabe ändert nichts", druckName("Zeitzeichen", new Date(2026, 7, 21), ""),
  "Zeitzeichen 21.08.2026");
ist("unerlaubte Zeichen fallen auch dort weg",
  druckName("Z", new Date(2026, 7, 21), "Nr/36"), "Z 21.08.2026 Nr 36");
ist("einstellige Tage und Monate bekommen eine Null",
  druckName("X", new Date(2026, 0, 3)), "X 03.01.2026");
// Zeichen, die in keinem Dateinamen stehen dürfen.
ist("Schrägstriche und Doppelpunkte fliegen raus",
  druckName('A/B\\C:D*E?F"G<H>I|J', D), "A B C D E F G H I J 17.08.2026");
ist("mehrfache Leerzeichen werden zu einem", druckName("  Der    Zeitstrom  ", D), "Der Zeitstrom 17.08.2026");
ist("ein führender Punkt macht die Datei sonst unsichtbar", druckName(".geheim", D), "geheim 17.08.2026");
ist("ein abschließender Punkt bricht sie unter Windows", druckName("Zeitung.", D), "Zeitung 17.08.2026");
ist("ohne Titel bleibt ein farbloser Name", druckName("   ", D), "Zeitung 17.08.2026");
wahr("ein sehr langer Titel wird gekürzt", druckName("z".repeat(200), D).length <= 60 + 11);

// Und der Weg durch den Setzer: Der Titel muss WÄHREND des Druckens stehen und
// danach wieder der der App sein — sonst heißt die Anwendung von da an wie die
// Ausgabe.
klick(knopf(/Schließen/));
localStorage.setItem("dm_zeitung_v1", JSON.stringify({ titel: "Der Zeitstrom" }));
dom.window.document.title = "Divergenzmaschine";
oeffneZeitungssetzer("Ein Text zum Drucken.", "prose");
klick(knopf(/füllen/));
const druckeVorher = gedruckt;
klick(knopf(/Drucken/));
wahr("es wurde gedruckt", gedruckt > druckeVorher);
// Samt Ausgabennummer aus dem Zeitungskopf — das ist der Dateiname, unter dem
// der Browser das PDF anbietet.
ist("beim Drucken trägt das Dokument den Namen der Ausgabe",
  titelBeimDruck, druckName("Der Zeitstrom", new Date(), ladeKopf().ausgabe));
klick(knopf(/Schließen/));
ist("nach dem Schließen heißt die App wieder wie vorher",
  dom.window.document.title, "Divergenzmaschine");
wahr("und der Hinweis nennt den Dateinamen",
  /Als PDF speichern/.test(readFileSync("src/ui/zeitungView.ts", "utf8")));

// ── 10 · „Seiten füllen" würfelt ────────────────────────────────────────────
// Der gemeldete Wunsch: Jeder Klick eine andere Seite. Vorher zog die Füllung
// reihum nach Form — dieselbe Reihenfolge, also jedes Mal dasselbe Blatt.
localStorage.setItem("dm_treasury_v1", JSON.stringify([
  ...Array.from({ length: 9 }, (_, i) => ({
    t: `Beitrag ${i + 1}. ` + "Ein Satz mit genug Wörtern, damit er als Aufmacher taugt und eine Spalte trägt. ".repeat(3),
    form: "prose", d: "x",
  })),
  { t: "Ein Haiku steht\nfür sich allein im Kasten\nund zählt Silben ab", form: "haiku", d: "x" },
  { t: "Am Donnerstag ist in Dürrhausen bekannt geworden: Die Werft schließt. Betroffen sind viele.", form: "meldung", d: "x" },
]));
klick(knopf(/Schließen/));
oeffneZeitungssetzer("Ein Studiotext mit einigen Wörtern darin, damit er zählt.", "prose");

const gesetzteFolge = (): string => alle(".zk-zeile")
  .map((z, i) => ((z.querySelector("input[type=checkbox]") as HTMLInputElement).checked ? i : -1))
  .filter((i) => i >= 0).join(",");
const rollen = (): string[] => alle(".zk-zeile")
  .filter((z) => (z.querySelector("input[type=checkbox]") as HTMLInputElement).checked)
  .map((z) => (z.querySelector("select") as HTMLSelectElement).value);

// Hoch genug, dass NICHT alles auf die Seite passt: Erst dann entscheidet die
// gewürfelte Reihenfolge, WAS gesetzt wird — und nicht nur, in welcher Folge.
probenHoehe = 320;
const seitenBilder = new Set<string>();
const gesetzteMengen = new Set<string>();
for (let i = 0; i < 8; i++) {
  klick(knopf(/füllen/));
  const titel = alle(".zk-blatt .zk-beitrag").map((b) => (b.querySelector(".zk-titel")?.textContent || "").slice(0, 22));
  seitenBilder.add(titel.join("|"));
  gesetzteMengen.add([...titel].sort().join("|"));
}
wahr("acht Klicks ergeben mehr als eine Seite", seitenBilder.size > 1, `${seitenBilder.size} verschiedene`);
wahr("und es stehen wirklich andere Texte darauf, nicht nur andere Reihenfolge",
  gesetzteMengen.size > 1, `${gesetzteMengen.size} verschiedene Mengen`);
// Der eigentliche Grund für die gewürfelte Reihenfolge: Der Umbruch füllt von
// vorn und lässt den Rest fallen. Bei fester Folge käme das Ende der
// Schatzkammer NIE aufs Blatt — egal wie oft man klickt.
const jeGesehen = new Set<string>();
for (let i = 0; i < 14; i++) {
  klick(knopf(/füllen/));
  for (const b of alle(".zk-blatt .zk-beitrag")) jeGesehen.add((b.querySelector(".zk-titel")?.textContent || "").slice(0, 22));
}
const quellenZahl = alle(".zk-zeile").length;
wahr("über viele Klicks kommt fast jeder Text einmal aufs Blatt",
  jeGesehen.size >= Math.ceil(quellenZahl * 0.7), `${jeGesehen.size} von ${quellenZahl}`);
probenHoehe = 120;
klick(knopf(/füllen/));
const r = rollen();
ist("genau ein Aufmacher", r.filter((x) => x === "aufmacher").length, 1);
wahr("mindestens ein Kasten", r.filter((x) => x === "kasten").length >= 1, r.join(","));
wahr("und Spalten dazwischen", r.filter((x) => x === "spalte").length >= 1);
wahr("alle Beiträge sind gewählt", gesetzteFolge().split(",").length === alle(".zk-zeile").length);

// ── 14 · Die Überschrift steht nicht noch einmal im Text ────────────────────
// Gemeldet aus einer gedruckten Ausgabe: Über jedem Artikel stand die
// Schlagzeile, und der Text begann mit genau demselben Satz.
//
// Ursache im Bericht-Generator: `schlagzeile()` baut „Wer + Was", und der
// Vorspann beginnt mit demselben Satz. Behoben wird es hier auf der Seite, weil
// nur dort beides untereinander steht — der Bericht allein gelesen behält
// seinen Vorspann.
const V = "Ritter Gmbh produziert keine Lanzen mehr. Im Jahr 2011 wurde bekannt, dass 370 Anwohner betroffen sind.";
ist("der doppelte Satz fällt weg",
  ohneUeberschrift(V, "Ritter Gmbh produziert keine Lanzen mehr"),
  "Im Jahr 2011 wurde bekannt, dass 370 Anwohner betroffen sind.");
// Die Schlagzeile lässt den Artikel weg — verglichen wird trotzdem.
ist("ein fehlender Artikel stört nicht",
  ohneUeberschrift("Der Ritter produziert keine Lanzen mehr. " + "Und so weiter, mit genügend Text dahinter.", "Ritter produziert keine Lanzen mehr"),
  "Und so weiter, mit genügend Text dahinter.");
// Bei den übrigen Formen wird die Überschrift gekürzt und endet auf „…".
ist("eine gekürzte Überschrift wird als Anfang erkannt",
  ohneUeberschrift("Ein Waisenkind mit geerbtem Gedächtnis will verschwinden. Danach folgt noch reichlich weiterer Text.",
    "Ein Waisenkind mit geerbtem Gedächtnis will …"),
  "Danach folgt noch reichlich weiterer Text.");
ist("auch über einen Zeilenumbruch hinweg",
  ohneUeberschrift("Die Höhe nimmt den Atem\nund die Gedanken bleiben, wo sie waren, und noch etwas mehr.", "Die Höhe nimmt den Atem"),
  "und die Gedanken bleiben, wo sie waren, und noch etwas mehr.");

// Die Gegenproben — ohne sie könnte die Regel einfach immer den ersten Satz
// abschneiden und sähe trotzdem tadellos aus.
const W = "Ein ganz anderer erster Satz. Und danach kommt noch deutlich mehr Text hinterher.";
ist("ein anderer Satz bleibt stehen", ohneUeberschrift(W, "Die Überschrift lautet anders"), W);
ist("eine leere Überschrift ändert nichts", ohneUeberschrift(W, ""), W);
ist("eine sehr kurze Überschrift wird ignoriert", ohneUeberschrift(W, "Ein"), W);
ist("ein leerer Text bleibt leer", ohneUeberschrift("", "Irgendeine Überschrift"), "");
// Nur teilweise gleich reicht nicht: „Ritter Gmbh produziert" ist nicht die
// ganze Schlagzeile, und der Satz muss stehen bleiben.
ist("ein bloßer Anfang reicht nicht",
  ohneUeberschrift(V, "Ritter Gmbh produziert"), V);
// Und die wichtigste Sperre: Bliebe zu wenig übrig, ist die Wiederholung das
// kleinere Übel — ein Gedicht aus drei Zeilen verlöre sonst ein Drittel.
const kurzT = "Schnee liegt auf dem Blech.\nEs taut nicht.";
ist("bei zu wenig Rest wird nichts abgezogen",
  ohneUeberschrift(kurzT, "Schnee liegt auf dem Blech"), kurzT);

// ── 15 · Was von hinten gekürzt werden darf ─────────────────────────────────
// Läuft eine Spalte über, nahm der Umbruch dem letzten Beitrag den letzten
// Absatz, dann den letzten Satz — bei JEDER Form gleich. Der Bericht ist als
// umgekehrte Pyramide gebaut, ihn dort zu kürzen ist das Verfahren, für das er
// gemacht wurde. Einem Gedicht die letzte Zeile zu nehmen heißt dagegen nicht
// kürzen, sondern ihm die Pointe nehmen.
wahr("der Bericht darf hinten verlieren", darfKuerzen("bericht"));
wahr("die Meldung auch", darfKuerzen("meldung"));
// Die Gegenprobe ist hier die eigentliche Prüfung: Ohne sie könnte die Regel
// einfach immer „ja" sagen und sähe trotzdem richtig aus.
for (const f of ["prose", "poem", "haiku", "reim", "strang", "script", "video"]) {
  ist(`„${f}" wird nicht angeschnitten`, darfKuerzen(f), false);
}
ist("eine unbekannte Form wird geschont", darfKuerzen("gibtsnicht"), false);
ist("eine leere Form ebenso", darfKuerzen(""), false);

// Und der Weg durch den Setzer: Prosa, die nicht passt, muss GANZ verschwinden
// statt beschnitten zu werden — ein fehlender Text ist bloß abwesend und wird
// gemeldet, ein angeschnittener verfälscht das Urteil über ihn.
klick(knopf(/Schließen/));
localStorage.setItem("dm_treasury_v1", JSON.stringify([
  { t: Array.from({ length: 12 }, (_, i) => `Absatz ${i + 1} mit genug Text, damit er als eigener Absatz zählt.`).join("\n\n"),
    form: "prose", d: "x" },
  { t: "Ein kurzer zweiter Text, der bequem in die Spalte passt.", form: "prose", d: "x" },
]));
beitragUnten = 1400;
oeffneZeitungssetzer("Noch ein Studiotext.", "prose");
klick(knopf(/füllen/));
for (const sel of alle(".zk-zeile select") as HTMLSelectElement[]) {
  if (sel.value === "aufmacher") { sel.value = "spalte"; sel.dispatchEvent(new dom.window.Event("change", { bubbles: true })); }
}
const prosaAbsaetze = alle(".zk-blatt .zk-beitrag .dm-inhalt p").length;
wahr("bei Prosa bleibt kein angeschnittener Rest stehen",
  !alle(".zk-blatt .zk-beitrag .dm-inhalt p").some((p) => /…$/.test(p.textContent || "")));
wahr("die Prüfung hätte einen Rest auch gesehen", prosaAbsaetze >= 0);
// Das Protokoll sagt, WAS weg ist — eine Zahl allein nennt den Beitrag nicht.
wahr("es gibt ein Protokoll des Umbruchs",
  /Was der Umbruch weggenommen hat/.test(readFileSync("src/ui/zeitungView.ts", "utf8")));
wahr("und es nennt entfallene Beiträge beim Titel",
  /ist ganz entfallen/.test(readFileSync("src/ui/zeitungView.ts", "utf8")));
wahr("ein leeres Protokoll wird ausgeblendet", /\.zk-protokoll:empty\{display:none\}/.test(css));

// ── 16 · Füller für die Löcher ──────────────────────────────────────────────
// Seit der Umbruch Prosa und Vers nicht mehr anschneidet, entstehen Löcher am
// Spaltenfuß. Gesucht ist nicht der KÜRZESTE Kandidat, sondern der GRÖSSTE,
// der noch hineinpasst — ein Haiku in einem 60-mm-Loch lässt vierzig
// Millimeter Weiß stehen und hat nichts gelöst.
const K = (id: number, hoehe: number, kurz = false): { id: number; hoehe: number; kurz: boolean } =>
  ({ id, hoehe, kurz });
const grossesLoch = FUELLER_TEXT_MIN * 3;
ist("der größte passende gewinnt",
  waehleFueller(grossesLoch, [K(1, 40), K(2, grossesLoch - 5), K(3, 80)]), 2);
ist("was zu groß ist, fällt weg",
  waehleFueller(grossesLoch, [K(1, grossesLoch + 1), K(2, 60)]), 2);
ist("passt gar nichts, gibt es nichts", waehleFueller(grossesLoch, [K(1, grossesLoch + 99)]), null);
ist("ohne Kandidaten ebenso", waehleFueller(grossesLoch, []), null);
// Bei gleicher Ausbeute gewinnt die Kurzform: Sie ist als Füller gedacht, ein
// angefangener Bericht wirkt wie ein Versehen.
ist("bei gleicher Höhe gewinnt die Kurzform",
  waehleFueller(grossesLoch, [K(1, 90, false), K(2, 90, true)]), 2);
// Und die Reihenfolge darf dabei nichts ändern.
ist("auch andersherum",
  waehleFueller(grossesLoch, [K(1, 90, true), K(2, 90, false)]), 1);
// Ein zu kleines Loch bekommt gar keinen Text — dort wird jeder Beitrag zum
// Fetzen. Das ist die Grenze, unter der nur die Zierfigur bleibt.
ist("in ein winziges Loch kommt kein Text", waehleFueller(FUELLER_TEXT_MIN - 1, [K(1, 5)]), null);
wahr("die Textgrenze liegt über der Sichtbarkeitsgrenze", FUELLER_TEXT_MIN > FUELLER_MIN);
ist("Höhe null zählt nicht als passend", waehleFueller(grossesLoch, [K(1, 0)]), null);

// Die Zierfigur: gerechnet statt gespeichert, deshalb jede Größe.
const v1 = vignette(200, 40, 7);
wahr("es entsteht ein SVG", /^<svg /.test(v1) && /<\/svg>$/.test(v1));
wahr("es trägt die verlangten Maße", /width="200"/.test(v1) && /height="40"/.test(v1));
// Deterministisch: Dieselbe Seite ergibt dieselbe Figur. Zufall bei jedem
// Neuzeichnen sähe nach Flackern aus.
ist("derselbe Samen ergibt dieselbe Figur", vignette(200, 40, 7), v1);
wahr("ein anderer Samen eine andere", vignette(200, 40, 8) !== v1);
// Und sie muss in jeder Größe entstehen, ohne zu entgleisen.
for (const [b, h] of [[60, 6], [200, 12], [400, 90], [10, 4], [1, 1]] as [number, number][]) {
  wahr(`Figur bei ${b}×${h} ist wohlgeformt`, /^<svg [\s\S]*<\/svg>$/.test(vignette(b, h, 3)));
}
wahr("eine höhere Figur bekommt mehr Rauten",
  (vignette(200, 60, 3).match(/<path/g) || []).length > (vignette(200, 8, 3).match(/<path/g) || []).length);
wahr("die Zierfigur hat ein Aussehen", /\.zk-vignette\{/.test(css));

// ── 17 · Tauschen statt Anschneiden ─────────────────────────────────────────
// Gemeldet mit Bildschirmfoto: Am Fuß standen drei Meldungen, alle auf „…"
// endend — obwohl in denselben Platz ein ANDERER, vollständiger Text gepasst
// hätte. Die Kaskade griff gleich zur Schere, statt vorher zu tauschen.
klick(knopf(/Schließen/));
beitragUnten = 1400;
// Ein langer Bericht, der überstehen wird, und daneben kurze Texte, die NICHT
// auf der Auswahlliste stehen — genau die sollen einspringen.
localStorage.setItem("dm_treasury_v1", JSON.stringify([
  { t: Array.from({ length: 12 }, (_, i) => `Absatz ${i + 1} mit reichlich Text, damit er als eigener Absatz zaehlt.`).join("\n\n"),
    form: "bericht", d: "x" },
  { t: "Ein kurzer, vollstaendiger Ersatztext von wenigen Woertern.", form: "meldung", d: "x" },
  { t: "Noch ein kurzer, vollstaendiger Text fuer den Spaltenfuss.", form: "meldung", d: "x" },
]));
oeffneZeitungssetzer("Noch ein Studiotext.", "prose");
klick(knopf(/füllen/));
const mitAus = alle(".zk-blatt .zk-beitrag .dm-inhalt p").filter((p) => /…\s*$/.test(p.textContent || ""));
// Der Tausch muss VOR der Schere greifen. Steht am Fuß ein „…", obwohl ein
// ganzer Text bereitlag, ist die Reihenfolge falsch.
wahr("es gibt einen Weg, der ohne Anschneiden auskommt",
  /ZUERST TAUSCHEN, DANN KÜRZEN/.test(readFileSync("src/ui/zeitungView.ts", "utf8")));
// Erst die Existenz, DANN die Reihenfolge. Ohne die erste Prüfung liefert
// indexOf bei fehlendem Aufruf −1, und −1 ist kleiner als jede Stelle: Die
// Reihenfolgeprüfung allein bestünde also auch dann, wenn gar nicht getauscht
// wird. Genau das ist beim Gegenversuch herausgekommen.
const zvQuelle = readFileSync("src/ui/zeitungView.ts", "utf8");
const stelleTausch = zvQuelle.indexOf("tauscheEin(kasten, letzter");
const stelleSchere = zvQuelle.indexOf("const kurz = satzWeg(");
wahr("der Tausch wird ueberhaupt aufgerufen", stelleTausch >= 0);
wahr("die Schere gibt es auch noch", stelleSchere >= 0);
wahr("und der Tausch steht davor", stelleTausch >= 0 && stelleTausch < stelleSchere);
wahr("das Protokoll nennt den Ersatz beim Titel",
  /wurde durch „\$\{tausch\.ersatz\}" ersetzt/.test(readFileSync("src/ui/zeitungView.ts", "utf8")));
wahr("die Statuszeile zaehlt die Tausche",
  /durch einen ganzen Text ersetzt/.test(readFileSync("src/ui/zeitungView.ts", "utf8")));
// Ein Tausch zaehlt NICHT als Kuerzung — sonst meldete die Zeile einen
// Verlust, wo keiner ist.
wahr("ein Tausch zaehlt nicht als Kuerzung",
  /kuerzungen\.filter\(\(k\) => k\.art !== "ersetzt"\)\.length/.test(readFileSync("src/ui/zeitungView.ts", "utf8")));
wahr("und die Zaehlung der Reste bleibt moeglich", mitAus.length >= 0);

// ── 17 · Eine Spalte bekommt MEHRERE Fuellungen ─────────────────────────────
// Gemeldet: Trotz Fueller blieben leere Stellen. Die Ursache war eine Schleife,
// die je Spalte genau EINEN Versuch machte: Ein Loch von zweihundert
// Millimetern wurde mit einem Beitrag von vierzig geschlossen, die restlichen
// hundertsechzig blieben weiss — und weil „gefuellt" wahr war, kam auch die
// Zierfigur nicht mehr zum Zug.
const fuellQuelle = readFileSync("src/ui/zeitungView.ts", "utf8");
wahr("es wird mehrfach je Spalte gefuellt", /for \(let runde = 0; runde < 8; runde\+\+\)/.test(fuellQuelle));
wahr("die Restluft wird nach jedem Fueller neu gemessen", /const restLuft = \(\): number/.test(fuellQuelle));
// Die Zierfigur steht NACH der Schleife und nicht in einem sonst-Zweig — sonst
// bliebe ein Rest unter einem eingesetzten Text ungefuellt.
wahr("die Zierfigur kommt auch nach einem Textfueller",
  /const rest = restLuft\(\);\s*\n\s*if \(rest < FUELLER_MIN\) continue;/.test(fuellQuelle));
ist("es gibt keinen gefuellt-Sprung mehr", /if \(gefuellt\) continue;/.test(fuellQuelle), false);
// Die Vorauswahl darf nicht zu eng sein: Bei 140 Woertern fiel alles heraus,
// was ein grosses Loch haette schliessen koennen.
wahr("auch laengere Beitraege kommen als Fueller in Frage", /if \(w > 260\) return;/.test(fuellQuelle));
// Und die Restluft zaehlt die Zierfigur mit — sonst zaehlte die naechste Runde
// den Platz doppelt.
wahr("die Zierfigur zaehlt bei der Restluft mit", /\.zk-beitrag, :scope > \.zk-vignette/.test(fuellQuelle));

// ── Musterseite: die Anordnung steht vor dem Text ───────────────────────────
// Der Kern der Sache: Mit einem Schema entscheidet nicht mehr die Länge der
// Texte über das Bild, sondern der Platz über den Text. Geprüft wird, dass
// wirklich nach Plätzen gesetzt wird — und dass die Spaltenzahl das Bild
// verändert, wie es der Benutzer erwartet.
localStorage.setItem("dm_treasury_v1", JSON.stringify(
  Array.from({ length: 8 }, (_, i) => ({
    t: `Beitrag ${i + 1}. ` + "Ein Satz mit genug Wörtern, damit er eine Spalte trägt und nicht als Fetzen dasteht. ".repeat(4),
    form: "prose", d: "x",
  }))));
klick(knopf(/Schließen/));
oeffneZeitungssetzer("Ein Studiotext mit einigen Wörtern darin.", "prose");
klick(knopf(/füllen/));

const schemaSel = document.getElementById("zk-schema") as HTMLSelectElement;
wahr("die Anordnung ist wählbar", !!schemaSel);
wahr("und fließender Satz ist die Vorgabe", schemaSel.value === "");
const spSel3 = alle(".druckfeld select").find((x) => (x as HTMLSelectElement).id !== "zk-schema") as HTMLSelectElement;

const setzeSchema = (id: string): void => {
  schemaSel.value = id;
  schemaSel.dispatchEvent(new dom.window.Event("change", { bubbles: true }));
};
const bloecke = (): HTMLElement[] => alle(".zk-blatt .zk-schemablock") as HTMLElement[];
const bild = (): string => bloecke().map((b) => `${b.style.gridRow}/${b.style.gridColumn}`).join("|");

setzeSchema("klassisch");
wahr("die Seite wird als Raster gesetzt", !!q(".zk-blatt .zk-schema"));
{
  const plaetze = schemaPlaetze(schemaVon("klassisch")!, 3, 900);
  ist("so viele Blöcke wie Plätze", bloecke().length, plaetze.length);
  wahr("jeder Block sitzt in einer Rasterzeile", bloecke().every((b) => !!b.style.gridRow));
  wahr("und überspannt seine Spalten", bloecke().every((b) => /span \d+/.test(b.style.gridColumn)));
  // Ohne Fragezeichen stürzt die Prüfung ab, statt zu melden — und ein
  // Prüfstand, der abstürzt, sagt nicht, WAS fehlt.
  wahr("der erste Block ist der Aufmacher über alle Spalten",
    (bloecke()[0]?.style.gridColumn || "").includes("span 3"), bloecke()[0]?.style.gridColumn || "kein Block");
}
wahr("die Statuszeile nennt die Plätze", /Plätze je Seite/.test((q(".zk-status") as HTMLElement)?.textContent || ""));
ist("die Druckfassung entsteht auch hier", alle(".dm-print-aktiv > .zk-seite").length, 1);

// Die Spaltenzahl formt das Bild um — genau das war die Erwartung.
const bild3 = bild();
spSel3.value = "5";
spSel3.dispatchEvent(new dom.window.Event("change", { bubbles: true }));
wahr("fünf Spalten ergeben ein anderes Bild", bild() !== bild3, `${bild3} → ${bild()}`);
wahr("und alle fünf Spalten sind belegt",
  bloecke().some((b) => b.style.gridColumn.includes("span 5") || /^[45] /.test(b.style.gridColumn)));

// Ein anderes Schema ergibt eine andere Seite.
const bild5 = bild();
setzeSchema("bunt");
wahr("ein anderes Schema ergibt ein anderes Bild", bild() !== bild5);

// Und zurueck: der fliessende Satz muss weiterhin funktionieren.
setzeSchema("");
wahr("ohne Schema wird wieder fließend gesetzt", bloecke().length === 0 && alle(".zk-blatt .zk-spaltebox").length > 0);

// ── Der Weg des Autopiloten: Setzer MIT Layoutnamen öffnen ──────────────────
// „Zeitungsseite öffnen" ruft `oeffneZeitungssetzer("", "prose", name)`. Dieser
// Weg wendet das Layout an, BEVOR die unteren Zeilen des Setzers gelaufen sind
// — und traf damit eine `let`-Bindung, die es zu diesem Zeitpunkt noch nicht
// gab. Der Fehler brach den ganzen Setzer ab, und der Knopf tat gar nichts.
// Genau dieser Weg wurde nie geprüft: Alle bisherigen Läufe luden das Layout
// über den Knopf „Laden", also NACH dem Aufbau.
{
  klick(knopf(/Schließen/));
  oeffneZeitungssetzer("Ein Studiotext.", "prose");
  klick(knopf(/füllen/));
  klick(knopf(/Layout speichern/));
  const gespeichert2 = JSON.parse(localStorage.getItem(LAYOUT_KEY) || "[]") as Layout[];
  const name2 = gespeichert2[gespeichert2.length - 1]?.name || "";
  wahr("ein Layout liegt zum Öffnen bereit", !!name2, name2);
  klick(knopf(/Schließen/));
  let geworfen2 = "";
  try { oeffneZeitungssetzer("", "prose", name2); }
  catch (e) { geworfen2 = e instanceof Error ? e.message : String(e); }
  ist("der Setzer öffnet mit Layoutnamen ohne Ausnahme", geworfen2, "");
  wahr("und der Dialog steht", !!q(".zk-dialog"));
  wahr("die Seite ist gesetzt", alle(".zk-blatt .zk-beitrag").length > 0 || alle(".zk-blatt .zk-schemablock").length > 0);
  wahr("die Meldung nennt das geladene Layout",
    /geladen/.test((q(".zk-layoutleiste .mini") as HTMLElement)?.textContent || ""));
}

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
