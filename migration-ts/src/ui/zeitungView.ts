// Zeitungsseite: ein Setzer, der mehrere Beiträge zu einer Seite fügt.
//
// Der Druckmodus konnte bisher EINEN Text setzen. Eine Zeitungsseite besteht
// aber aus mehreren — Aufmacher, Spalten, ein Kasten mit einem Gedicht — und
// aus einem Kopf, der die Zeitung erst zu einer macht.
//
// Der Inhalt kommt aus der Schatzkammer: Dort liegt jeder gemerkte Text mit
// seiner Form, und genau danach lässt sich auswählen.

import { el } from "./dom";
import { icon } from "./icons";
import { loadTreasury, type Treasure } from "../features/treasury";
import { inhaltVers, inhaltFliess, absaetze } from "./printView";
import { umbrechen, fuellgrad, type Messbar, type UmbruchTeil, type Seite } from "./umbruch";
import {
  ladeBilder, sichereBilder, neuerRahmen, verschiebe, skaliereEcke, begrenze,
  leseBilddatei, stapelLege, stapelNimm, BILD_ANZAHL,
  rasteRahmen, spaltenBreite, spaltenZahl, bildplatz, spaltenlagen,
  plaetze, platzBesetzt, rahmenAusPlatz,
  type Bildrahmen, type Raster, type Platz,
} from "../features/zeitungsbilder";
import {
  ladeLayouts, sichereLayouts, legeLayout, entferneLayout, ordneZu, textSchluessel,
  type Layout,
} from "../features/zeitungslayout";

// A4 bei 96 dpi, abzueglich der Raender aus .druckblatt (16 mm oben/unten,
// 14 mm seitlich). Die Zahlen stehen hier und nicht im CSS, weil die Verteilung
// sie kennen muss - gemessen wird trotzdem am echten Element.
// Nicht das ganze Blatt, sondern der BEDRUCKBARE Bereich: A4 minus der
// Seitenraender aus @page (20 mm oben/unten, 18 mm seitlich). Vorschau und Druck
// benutzen dieselbe Groesse - vorher hatte die Vorschau 794 x 1123 px mit
// eigenem Innenabstand, der Druck zusaetzlich die @page-Raender, und die Seite
// war im Druck hoeher als das Papier: Alles ausser dem Aufmacher rutschte auf
// Seite 2.
const MM = 96 / 25.4;
// Die Seitenränder. Sie stehen HIER und in @page (theme.css) — und müssen
// übereinstimmen, sonst rechnet die Verteilung mit einer anderen Seite als der,
// die gedruckt wird. Genau das war der Fall: Die Rechnung nahm 297 − 2×20 = 257
// mm an, gedruckt wurden 297 − 20 − 22 = 255 mm. Zwei Millimeter zu viel, rund
// eine halbe Zeile — die dann unten an der Fußlinie abgeschnitten wurde.
//
// Oben und unten sind schmaler als früher: Der Zeitungskopf sitzt damit höher
// auf dem Blatt, wie es sich für einen Kopf gehört, und es passt mehr Satz auf
// die Seite.
export const RAND_OBEN = 15, RAND_UNTEN = 18, RAND_SEITE = 18;   // mm
export const SEITE_B = Math.round((210 - 2 * RAND_SEITE) * MM);          // 658 px
export const SEITE_H = Math.round((297 - RAND_OBEN - RAND_UNTEN) * MM);  // 998 px

export type Rolle = "aufmacher" | "spalte" | "kasten";

export interface Zeitungskopf {
  titel: string; motto: string; ausgabe: string; preis: string;
  datum: boolean; linien: boolean; fraktur: boolean;
}

const KEY = "dm_zeitung_v1";
const KOPF_VORGABE: Zeitungskopf = {
  titel: "Der Zeit", motto: "Unabhängig · maschinell erzeugt", ausgabe: "Nr. 1",
  preis: "", datum: true, linien: true, fraktur: false,
};

export function ladeKopf(): Zeitungskopf {
  try {
    const r = localStorage.getItem(KEY);
    if (!r) return { ...KOPF_VORGABE };
    return { ...KOPF_VORGABE, ...(JSON.parse(r) as Partial<Zeitungskopf>) };
  } catch { return { ...KOPF_VORGABE }; }
}
export function sichereKopf(k: Zeitungskopf): void {
  try { localStorage.setItem(KEY, JSON.stringify(k)); } catch { /* voll */ }
}

/** Der Name, unter dem der Browser die Seite ablegt.
 *
 *  Beim „Als PDF speichern“ schlägt jeder Browser den DOKUMENTTITEL als
 *  Dateinamen vor — es gibt keinen anderen Weg, ihn von hier aus zu setzen.
 *  Deshalb wird der Titel für die Dauer des Druckens ausgetauscht.
 *
 *  Ein Dateiname darf nicht alles enthalten: Schrägstriche, Doppelpunkte und
 *  Anführungszeichen ersetzt der eine Browser stillschweigend, der andere
 *  hängt sich daran auf. Sie fliegen deshalb hier heraus, nicht erst dort. */
export function druckName(titel: string, d = new Date()): string {
  const zwei = (n: number): string => String(n).padStart(2, "0");
  const datum = `${zwei(d.getDate())}.${zwei(d.getMonth() + 1)}.${d.getFullYear()}`;
  // Punkte am Rand fallen mit weg: Ein führender Punkt macht die Datei auf
  // Linux und macOS unsichtbar, ein abschließender bricht sie unter Windows.
  const roh = (titel || "")
    .replace(/[\\/:*?"<>|\u0000-\u001f]/g, " ")
    .replace(/\s+/g, " ")
    .replace(/^[.\s]+|[.\s]+$/g, "");
  const name = roh.slice(0, 60).replace(/[.\s]+$/, "");
  // Ohne Titel bliebe nur das Datum — das sagt in einem Ordner voller Ausgaben
  // nichts. Lieber ein farbloser Name als gar keiner.
  return `${name || "Zeitung"} ${datum}`;
}

const FORM_LABEL: Record<string, string> = {
  prose: "Prosa", bericht: "Bericht", reim: "Reim", haiku: "Haiku",
  poem: "Prosagedicht", strang: "Strang", script: "Szene", video: "Multi-Shot", meldung: "Meldung",
};

/** Überschrift eines Beitrags. Der Bericht bringt seine eigene mit — sie steht
 *  in der zweiten Zeile, zwischen Dachzeile und Vorspann. Alle anderen Formen
 *  haben keine, dort wird die erste Zeile gekürzt. */
export function ueberschriftVon(t: Treasure): string {
  const abs = absaetze(t.t);
  // Die Meldung ist zu kurz für eine eigene Überschrift: Die gekürzte erste
  // Zeile wäre die halbe Meldung, und im Kasten stünde alles doppelt. Zeitungen
  // setzen Kurzmeldungen deshalb unter eine gemeinsame Zeile.
  if (t.form === "meldung") return "Kurz gemeldet";
  if (t.form === "bericht" && abs.length >= 2) return abs[1]!;
  const erste = (abs[0] || "").split("\n")[0] || "";
  const kurz = erste.replace(/[.!?…]+$/, "").trim();
  return kurz.length > 60 ? kurz.slice(0, 57).replace(/\s+\S*$/, "") + " …" : kurz;
}

/** Rumpf eines Beitrags — beim Bericht ohne Dachzeile, Schlagzeile und
 *  Faktenkasten, die setzt die Seite selbst. */
function rumpfVon(t: Treasure): string {
  if (t.form !== "bericht") return t.t;
  const abs = absaetze(t.t).filter((x) => !/^Faktenkasten\b/.test(x));
  return abs.slice(2).join("\n\n");
}

/** Nimmt den letzten Satz weg und setzt drei Punkte. Für Spalten, die auch
 *  nach dem Entfernen ganzer Beiträge noch überlaufen.
 *
 *  Gibt "" zurück, wenn nichts Sinnvolles übrig bliebe — dann fällt der ganze
 *  Absatz weg. Die Falle: `\d[\d.]*` verschluckt den Satzpunkt; deshalb wird
 *  eine Ziffer vor dem Punkt ausgeschlossen, sonst endete der Text an „1902." */
export function satzWeg(text: string): string {
  const t = (text || "").replace(/\s*…\s*$/, "").trim();
  if (t.length < 40) return "";
  const treffer = [...t.matchAll(/(?<!\d)[.!?](?=\s|$)/g)];
  const letzter = treffer.length > 1 ? treffer[treffer.length - 2] : undefined;
  // Mindestens ein gutes Dutzend Zeichen müssen stehen bleiben — sonst wird aus
  // dem Absatz ein Wortfetzen mit drei Punkten.
  if (letzter && letzter.index !== undefined && letzter.index > 15) {
    return t.slice(0, letzter.index + 1).trim() + " …";
  }
  // Kein zweiter Satz: die letzten Wörter wegnehmen.
  const worte = t.split(/\s+/);
  if (worte.length < 12) return "";
  return worte.slice(0, Math.max(8, worte.length - 6)).join(" ") + " …";
}

function istVers(form?: string): boolean {
  return form === "reim" || form === "haiku" || form === "strang" || form === "poem";
}

function beitrag(t: Treasure, rolle: Rolle, titel: string, skala = 1, zwischenraum = 0, vorabstand = 0): HTMLElement {
  const box = el("div", { class: "zk-beitrag zk-" + rolle });
  // Die Schriftskala wirkt ueber eine eigene Variable, damit sie sich mit dem
  // Schriftgrad der Seite multipliziert statt ihn zu ueberschreiben.
  if (skala !== 1) box.style.setProperty("--zk-skala", String(skala));
  if (zwischenraum) box.style.marginBottom = zwischenraum + "px";
  // Der Platz, den ein Bild darüber belegt. Als Abstand, nicht als Gleitkasten:
  // So ist die tatsächliche Höhe genau die gemessene.
  if (vorabstand) box.style.marginTop = vorabstand + "px";
  if (t.form === "bericht") {
    const abs = absaetze(t.t);
    if (abs[0]) box.append(el("div", { class: "zk-dach" }, abs[0]));
  } else if (t.form) {
    box.append(el("div", { class: "zk-dach" }, FORM_LABEL[t.form] || t.form));
  }
  box.append(el(rolle === "aufmacher" ? "h1" : "h2", { class: "zk-titel" }, titel));
  const rumpf = rumpfVon(t);
  const inhalt = istVers(t.form) ? inhaltVers(rumpf, false) : inhaltFliess(rumpf);
  box.append(inhalt);
  if (t.form === "bericht" && rolle === "aufmacher") {
    const kasten = absaetze(t.t).find((x) => /^Faktenkasten\b/.test(x));
    if (kasten) {
      const k = el("div", { class: "dm-kasten" });
      const zeilen = kasten.split("\n");
      k.append(el("div", { class: "dm-kastenkopf" }, zeilen.shift() || "Faktenkasten"));
      for (const z of zeilen) if (z.trim()) k.append(el("div", {}, z.trim()));
      // IN den Spaltenfluss haengen, nicht darunter: Als Block ueber die volle
      // Breite schob er alles Weitere von der Seite.
      inhalt.append(k);
    }
  }
  return box;
}

export interface SeitenTeil { t: Treasure; rolle: Rolle; titel: string; }

export interface SeitenTeil { t: Treasure; rolle: Rolle; titel: string; skala?: number; zwischenraum?: number; vorabstand?: number }

/** Eine Seite bauen. `mitKopf` nur auf der ersten — der Zeitungskopf steht
 *  einmal, nicht auf jeder Seite. */
export function baueZeitungsseite(kopf: Zeitungskopf, teile: SeitenTeil[], spalten = 3, mitKopf = true): HTMLElement {
  const wurzel = el("div", { class: "dm-print zk-seite", "data-profil": "zeitungsseite" });
  if (mitKopf) {
    const k = el("header", { class: "zk-kopf" + (kopf.linien ? " zk-linien" : "") + (kopf.fraktur ? " zk-fraktur" : "") });
    k.append(el("div", { class: "zk-name" }, kopf.titel || "Ohne Titel"));
    if (kopf.motto) k.append(el("div", { class: "zk-motto" }, kopf.motto));
    k.append(el("div", { class: "zk-meta" },
      el("span", {}, kopf.ausgabe || ""),
      el("span", {}, kopf.datum ? new Date().toLocaleDateString("de-DE", { weekday: "long", day: "numeric", month: "long", year: "numeric" }) : ""),
      el("span", {}, kopf.preis || "")));
    wurzel.append(k);
  }

  for (const a of teile.filter((x) => x.rolle === "aufmacher")) {
    wurzel.append(beitrag(a.t, "aufmacher", a.titel, a.skala ?? 1, a.zwischenraum ?? 0));
  }

  // Feste Spaltenkaesten statt CSS-columns: Nur so bestimmt der Umbruch, was in
  // welcher Spalte steht - die Spaltenbalance von CSS laesst sich nicht steuern
  // und hinterlaesst an den Fuessen ungleiche Loecher.
  const raster = el("div", { class: "zk-raster", style: `--zk-spalten:${spalten}` });
  const boxen: HTMLElement[] = [];
  for (let i = 0; i < spalten; i++) { const b = el("div", { class: "zk-spaltebox" }); boxen.push(b); raster.append(b); }
  const rest = teile.filter((x) => x.rolle !== "aufmacher");
  rest.forEach((x, i) => {
    const sp = (x as SeitenTeil & { spalte?: number }).spalte ?? (i % spalten);
    (boxen[Math.max(0, Math.min(spalten - 1, sp))] || boxen[0]!)
      .append(beitrag(x.t, x.rolle, x.titel, x.skala ?? 1, x.zwischenraum ?? 0, x.vorabstand ?? 0));
  });
  wurzel.append(raster);

  wurzel.append(el("footer", { class: "zk-fuss" },
    el("span", {}, "Fiktive Zeitung · maschinell erzeugt"),
    el("span", {}, kopf.titel || "")));
  return wurzel;
}

/** Misst die Höhe eines Beitrags in einer echten Spalte. Geht nur im Browser —
 *  deshalb steckt die Verteilung in umbruch.ts und bekommt diese Funktion. */
export function browserMessung(quellen: Treasure[], rollen: Rolle[], titel: string[],
                               spaltenbreite: number, vollbreite: number): Messbar & { aufmacher(id: number): number } {
  const mach = (breite: number): HTMLElement => {
    const p = el("div", { class: "dm-print zk-seite zk-probe", "data-profil": "zeitungsseite" });
    p.style.cssText = `position:absolute;left:-99999px;top:0;width:${breite}px;visibility:hidden`;
    document.body.append(p);
    return p;
  };
  const probeSpalte = mach(spaltenbreite);
  // Zweite Probe in voller Breite: Der Aufmacher laeuft ueber alle Spalten. In
  // Spaltenbreite gemessen kam er auf das Dreifache seiner echten Hoehe - danach
  // war rechnerisch kein Platz mehr, und alles Weitere rutschte auf Seite 2.
  const probeVoll = mach(vollbreite);
  const cache = new Map<string, number>();
  const miss = (probe: HTMLElement, id: number, rolle: Rolle, skala: number, key: string): number => {
    const c = cache.get(key);
    if (c !== undefined) return c;
    probe.innerHTML = "";
    const b = beitrag(quellen[id]!, rolle, titel[id] || "", skala, 0);
    probe.append(b);
    const h = b.getBoundingClientRect().height || b.offsetHeight;
    cache.set(key, h);
    return h;
  };
  return {
    hoehe: (id, skala) => miss(probeSpalte, id, rollen[id] || "spalte", skala, `s${id}:${skala}`),
    aufmacher: (id) => miss(probeVoll, id, "aufmacher", 1, `a${id}`),
  };
}

// ── Setzer ────────────────────────────────────────────────────────────────

function rolleFuer(t: Treasure, ersteR: boolean): Rolle {
  // Die Meldung gehört in den Kasten — so setzt eine Zeitung ihre Kurzmeldungen,
  // und sie ist zu kurz, um eine Spalte zu tragen. Aufmacher wird sie nie.
  if (t.form === "meldung") return "kasten";
  if (istVers(t.form)) return "kasten";
  return ersteR ? "aufmacher" : "spalte";
}

export function oeffneZeitungssetzer(aktuellerText: string, aktuelleForm: string, layoutSofort = ""): void {
  const kopf = ladeKopf();
  const quellen: Treasure[] = [];
  if (aktuellerText.trim()) quellen.push({ t: aktuellerText, form: aktuelleForm, d: "im Studio" });
  quellen.push(...loadTreasury().slice().reverse());

  let spalten = 3, seitenZahl = 1;
  const gewaehlt = new Map<number, { rolle: Rolle; titel: string }>();

  // Die Reihenfolge, in der die Beiträge auf die Seite kommen. Sie ist NICHT
  // die Listenreihenfolge: „Seiten füllen" würfelt sie, und der Umbruch füllt
  // in genau dieser Folge, bis die Seite voll ist. Was danach kommt, fällt
  // heraus — deshalb entscheidet die Reihenfolge, WAS auf dem Blatt steht.
  let reihenfolge: number[] = [];
  const mische = <T,>(xs: T[]): T[] => {
    const a = [...xs];
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j]!, a[i]!]; }
    return a;
  };
  const wortzahl = (t: string): number => (t.match(/[A-Za-zÄÖÜäöüß]+/g) || []).length;

  let bilder: Bildrahmen[] = ladeBilder();
  let gewaehltesBild: string | null = null;

  const buehne = el("div", { class: "druckhuelle" });
  const blatt = el("div", { class: "druckblatt zk-blatt" });
  const status = el("div", { class: "zk-status muted mini" });

  /** Passt das Blatt an die Kastenbreite an. Auf dem Handy stand vorher ein
   *  794 px breites Papier in einem rund 360 px breiten Kasten und musste
   *  waagerecht gescrollt werden — man sah nie die ganze Seite und konnte ein
   *  Bild nicht im Verhältnis zum Satz setzen.
   *
   *  Verkleinert wird das ganze Blatt, nicht der Satz: Ein transform ändert die
   *  Layoutmaße nicht, also rechnen Umbruch und Nachmessung unverändert in
   *  Seitenpixeln. Ziehen und Aufziehen stimmen automatisch mit, weil
   *  `massstab()` und die Bildschicht den Maßstab am gemessenen Kasten
   *  nehmen (`rect.width / SEITE_B`) und nicht als 1 annehmen.
   *
   *  Nie vergrößern: Auf einem breiten Bildschirm soll die Seite ihre echte
   *  Größe behalten. */
  const PAPIER_B = Math.round(210 * MM);
  const passeZoom = (): void => {
    const platz = blatt.clientWidth;
    const k = platz > 0 ? Math.min(1, platz / PAPIER_B) : 1;
    // Unter einem Viertel wird nichts mehr erkennbar; dann lieber scrollen.
    const eng = k < 0.995;
    blatt.classList.toggle("zk-eng", eng);
    blatt.style.setProperty("--zk-zoom", String(Math.max(0.25, k)));
  };

  // ── Rückgängig ──────────────────────────────────────────────────────────
  // Eine Momentaufnahme des GANZEN Setzers, nicht nur der Bilder: Kopf,
  // Spalten, Seitenzahl, Beitragsauswahl und Bilder. Der Stapel hält 40
  // Schritte; zwei gleiche Aufnahmen hintereinander kommen nicht hinein.
  interface Stand {
    kopf: Zeitungskopf; spalten: number; seiten: number;
    gewaehlt: [number, { rolle: Rolle; titel: string }][]; bilder: Bildrahmen[];
  }
  let stapel: string[] = [];
  const zurueckBtn = el("button", { title: "Letzten Schritt zurücknehmen" }, "↶ Zurück") as HTMLButtonElement;
  const standJetzt = (): Stand => ({
    kopf: { ...kopf }, spalten, seiten: seitenZahl,
    gewaehlt: [...gewaehlt.entries()].map(([i, v]) => [i, { ...v }]), bilder,
  });
  const zurueckZeigen = (): void => {
    if (stapel.length) zurueckBtn.removeAttribute("disabled");
    else zurueckBtn.setAttribute("disabled", "");
  };
  function merkeStand(): void { stapel = stapelLege(stapel, standJetzt()); zurueckZeigen(); }
  const zurueck = (): void => {
    const g = stapelNimm(stapel);
    stapel = g.stapel;
    zurueckZeigen();
    if (!g.stand) return;
    const s2 = JSON.parse(g.stand) as Stand;
    Object.assign(kopf, s2.kopf);
    spalten = s2.spalten; seitenZahl = s2.seiten;
    gewaehlt.clear();
    for (const [i, v] of s2.gewaehlt) gewaehlt.set(i, v);
    bilder = s2.bilder;
    gewaehltesBild = null;
    sichereBilder(bilder);
    nachzieher.forEach((fn) => fn());
    bauListe();
    zeichne();
  };
  zurueckBtn.addEventListener("click", zurueck);
  zurueckZeigen();

  // Die Felder lesen ihren Wert über eine Funktion statt einmalig beim Bauen.
  // Nur so kann „Zurück" die Leiste nachziehen — vorher zeigte sie nach einem
  // Rücksprung noch den alten Text, während die Seite schon den neuen setzte.
  const nachzieher: (() => void)[] = [];
  const feldT = (label: string, lies: () => string, cb: (v: string) => void): HTMLElement => {
    const i = el("input", { type: "text", value: lies() }) as HTMLInputElement;
    // Momentaufnahme beim Hineinklicken, nicht bei jedem Tastendruck: Sonst
    // liegen dreißig Zwischenstände im Stapel und „Zurück" nimmt Buchstaben weg.
    i.addEventListener("focus", merkeStand);
    i.addEventListener("input", () => { cb(i.value); zeichne(); });
    nachzieher.push(() => { i.value = lies(); });
    return el("label", { class: "druckfeld" }, el("span", { class: "field-label" }, label), i);
  };
  const feldC = (label: string, lies: () => boolean, cb: (v: boolean) => void): HTMLElement => {
    const i = el("input", { type: "checkbox" }) as HTMLInputElement;
    i.checked = lies();
    i.addEventListener("change", () => { merkeStand(); cb(i.checked); zeichne(); });
    nachzieher.push(() => { i.checked = lies(); });
    return el("label", { class: "druckfeld" }, el("span", { class: "field-label" }, label), i);
  };
  const feldZ = (label: string, lies: () => number, min: number, max: number, cb: (v: number) => void): HTMLElement => {
    const sel = el("select", {}) as HTMLSelectElement;
    for (let v = min; v <= max; v++) sel.append(el("option", { value: String(v) }, String(v)));
    sel.value = String(lies());
    sel.addEventListener("change", () => { merkeStand(); cb(parseInt(sel.value, 10)); zeichne(); });
    nachzieher.push(() => { sel.value = String(lies()); });
    return el("label", { class: "druckfeld" }, el("span", { class: "field-label" }, label), sel);
  };

  const liste = el("div", { class: "zk-liste" });
  const bauListe = (): void => {
    liste.innerHTML = "";
    if (!quellen.length) {
      liste.append(el("p", { class: "muted" }, "Noch nichts in der Schatzkammer — Texte erst mit „Merken“ sichern."));
      return;
    }
    quellen.forEach((t, i) => {
      const an = el("input", { type: "checkbox" }) as HTMLInputElement;
      an.checked = gewaehlt.has(i);
      const rolle = el("select", {}) as HTMLSelectElement;
      ([["aufmacher", "Aufmacher"], ["spalte", "Spalte"], ["kasten", "Kasten"]] as [Rolle, string][])
        .forEach(([v, l]) => rolle.append(el("option", { value: v }, l)));
      rolle.value = gewaehlt.get(i)?.rolle || rolleFuer(t, i === 0);
      const titel = el("input", { type: "text", value: gewaehlt.get(i)?.titel ?? ueberschriftVon(t) }) as HTMLInputElement;
      const merke = (): void => {
        if (an.checked) gewaehlt.set(i, { rolle: rolle.value as Rolle, titel: titel.value });
        else gewaehlt.delete(i);
        zeichne();
      };
      [an, rolle].forEach((x) => { x.addEventListener("pointerdown", merkeStand); x.addEventListener("change", merke); });
      titel.addEventListener("focus", merkeStand);
      titel.addEventListener("input", merke);
      const wc = (t.t.match(/[A-Za-zÄÖÜäöüß]+/g) || []).length;
      liste.append(el("div", { class: "zk-zeile" },
        an, el("span", { class: "zk-form" }, FORM_LABEL[t.form || ""] || t.form || "—"),
        titel, rolle, el("span", { class: "muted mini" }, `${wc} W`)));
    });
  };

  /** Automatik: so viele Beiträge wählen, wie auf die Seiten passen. Gemischt
   *  nach Form, damit nicht drei Berichte hintereinander stehen. */
  /** Seite füllen: eine neue, zufällige Seite aus der Schatzkammer.
   *
   *  Vorher wurde reihum nach Form gezogen — dieselbe Reihenfolge bei jedem
   *  Klick, also jedes Mal dasselbe Blatt. Jetzt wird gemischt, und weil der
   *  Umbruch in der gewürfelten Folge füllt, bis die Seite voll ist, steht bei
   *  jedem Klick eine andere Auswahl auf dem Papier.
   *
   *  Die Rollen werden dabei gesetzt, nicht gewürfelt: EIN Aufmacher (ein
   *  Vers oder eine Meldung taugt dafür nicht), Verse und Meldungen in den
   *  Kasten, alles Übrige in die Spalten. Findet sich kein Kasten-Kandidat,
   *  wird der kürzeste Beitrag dazu gemacht — eine Seite aus lauter Spalten
   *  sieht aus wie ein Manuskript, nicht wie eine Zeitung.
   */
  const fuellen = (): void => {
    merkeStand();
    gewaehlt.clear();
    if (!quellen.length) { reihenfolge = []; bauListe(); zeichne(); return; }

    const idx = mische(quellen.map((_, i) => i));
    const kastenTaugt = (i: number): boolean => istVers(quellen[i]!.form) || quellen[i]!.form === "meldung";
    // Aufmacher: lang genug und keine Kurzform. Findet sich keiner, bleibt die
    // Seite ohne Aufmacher — der Umbruch kommt damit zurecht.
    const aufI = idx.find((i) => !kastenTaugt(i) && wortzahl(quellen[i]!.t) >= 60)
      ?? idx.find((i) => !kastenTaugt(i));

    reihenfolge = aufI === undefined ? idx : [aufI, ...idx.filter((i) => i !== aufI)];
    for (const i of reihenfolge) {
      gewaehlt.set(i, {
        rolle: i === aufI ? "aufmacher" : rolleFuer(quellen[i]!, false),
        titel: ueberschriftVon(quellen[i]!),
      });
    }
    // Mindestens ein Kasten, wenn es überhaupt mehr als zwei Beiträge gibt.
    const hatKasten = [...gewaehlt.values()].some((v) => v.rolle === "kasten");
    if (!hatKasten && reihenfolge.length > 2) {
      const kandidat = reihenfolge
        .filter((i) => i !== aufI)
        .sort((a, b) => wortzahl(quellen[a]!.t) - wortzahl(quellen[b]!.t))[0];
      if (kandidat !== undefined) gewaehlt.set(kandidat, { ...gewaehlt.get(kandidat)!, rolle: "kasten" });
    }
    bauListe();
    zeichne();
  };

  /** Die Druckfassung: eine Kopie des fertigen Satzes als einziges sichtbares
   *  Element im Druck (`body > *:not(.dm-print-aktiv){display:none}`).
   *
   *  Sie entsteht als eigener Schritt, nicht mehr nur als Nebenwirkung des
   *  Zeichnens. Grund: Jeder Abbruch irgendwo im Zeichnen ließ die alte Kopie
   *  stehen oder gar keine — und der Browser bekam ein Dokument, in dem ALLES
   *  ausgeblendet ist. Der Druckdialog öffnet dann und lädt nichts.
   *
   *  EIN Behälter für alle Seiten. Einzeln angehängt bekam jede Seite
   *  `position:absolute` aus der Druckregel und lag auf der vorigen — gedruckt
   *  wurde die letzte, und der Zeitungskopf der ersten war verdeckt.
   *
   *  Rückgabe: Zahl der Seiten in der Kopie. */
  const mappeBauen = (): number => {
    document.querySelectorAll(".dm-print-aktiv").forEach((x) => x.remove());
    const mappe = el("div", { class: "dm-print-aktiv dm-seiten" });
    let n = 0;
    for (const papier of Array.from(blatt.children)) {
      const seite = papier.firstElementChild as HTMLElement | null;
      if (!seite || !seite.classList.contains("zk-seite")) continue;
      const kopie = seite.cloneNode(true) as HTMLElement;
      // Bedienelemente gehören nicht aufs Papier. Die Druckregel blendet sie
      // aus; hier fliegen sie ganz heraus, damit die Kopie nichts Totes trägt.
      kopie.querySelectorAll(".zk-griff, .zk-bildx, .zk-platz").forEach((x) => x.remove());
      // Und die Auswahlmarke: „.on" ist der blaue Rahmen, mit dem das Bild am
      // Bildschirm zeigt, dass es angefasst ist. Er wurde mitkopiert und stand
      // im Druck um das Foto — eine Bedienspur auf dem Papier.
      kopie.querySelectorAll(".zk-bild.on").forEach((x) => x.classList.remove("on"));
      mappe.append(kopie);
      n++;
    }
    if (n) document.body.append(mappe);
    return n;
  };

  const zeichne = (): void => {
    sichereKopf(kopf);
    blatt.innerHTML = "";
    // Erst die gewürfelte Folge, dann alles, was von Hand dazugehakt wurde.
    // Ohne diese Ordnung füllte der Umbruch immer von der kleinsten Nummer an —
    // und „Seiten füllen" ergab bei jedem Klick dasselbe Blatt.
    const ids = [
      ...reihenfolge.filter((i) => gewaehlt.has(i)),
      ...[...gewaehlt.keys()].filter((i) => !reihenfolge.includes(i)).sort((a, b) => a - b),
    ];
    if (!ids.length) {
      blatt.append(el("p", { class: "muted" }, "Nichts gewählt."));
      // Auch die Druckfassung räumen: Sonst druckt der Browser die Seite, die
      // vor dem Abwählen entstanden war — ein Satz, den niemand mehr sieht.
      document.querySelectorAll(".dm-print-aktiv").forEach((x) => x.remove());
      status.textContent = "";
      return;
    }

    // Erste Seite provisorisch setzen, um Kopfhöhe und Spaltenbreite zu messen.
    const roh = baueZeitungsseite(kopf, ids.map((i) => ({ t: quellen[i]!, rolle: gewaehlt.get(i)!.rolle, titel: gewaehlt.get(i)!.titel })), spalten, true);
    blatt.append(roh);
    const box = roh.querySelector(".zk-spaltebox") as HTMLElement | null;
    const kopfEl = roh.querySelector(".zk-kopf") as HTMLElement | null;
    const kopfCs = kopfEl && window.getComputedStyle(kopfEl);
    const kopfH = kopfEl
      ? kopfEl.getBoundingClientRect().height + (kopfCs ? parseFloat(kopfCs.marginBottom) || 0 : 0)
      : 150;
    const fussEl = roh.querySelector(".zk-fuss") as HTMLElement | null;
    const fussCs = fussEl && window.getComputedStyle(fussEl);
    const fussH = fussEl
      ? fussEl.getBoundingClientRect().height + (fussCs ? parseFloat(fussCs.marginTop) || 0 : 0)
      : 30;
    const breite = box?.getBoundingClientRect().width || 214;
    blatt.innerHTML = "";

    const rollen = quellen.map((t, i) => gewaehlt.get(i)?.rolle || rolleFuer(t, false));
    const titelAlle = quellen.map((t, i) => gewaehlt.get(i)?.titel ?? ueberschriftVon(t));
    const rasterBreite = (roh.querySelector(".zk-raster") as HTMLElement | null)?.getBoundingClientRect().width
      || SEITE_B;
    const mess = browserMessung(quellen, rollen, titelAlle, breite, rasterBreite);
    const teile: UmbruchTeil[] = ids.map((i) => ({ id: i, rolle: rollen[i]! }));
    const inhaltH = SEITE_H - fussH;
    // Der Aufmacher wird in voller Breite gemessen, alles Uebrige in Spaltenbreite.
    const aufId = ids.find((i) => rollen[i] === "aufmacher");
    // Kleiner Sicherheitsstreifen. Er allein genuegt NICHT: Die Abweichung
    // zwischen Vorschau und Druck entsteht je Beitrag, nicht einmal je Spalte -
    // acht Beitraege koennen acht Zeilen mehr ergeben. Deshalb wird unten am
    // fertigen Satz nachgemessen; die Reserve macht das nur seltener noetig.
    const RESERVE = 12;
    const aufH = aufId === undefined ? 0 : mess.aufmacher(aufId);
    const spaltenH = Math.max(0, inhaltH - kopfH - RESERVE - aufH);
    // Die Bilder VOR der Verteilung einrechnen: Sie sperren Bänder in den
    // Spalten, und ein Beitrag, der dort nicht mehr hineinpasst, darf gar nicht
    // erst dorthin gelegt werden. Ohne diesen Schritt legte die Verteilung ihn
    // hin, der Gleitkasten schob ihn unter das Bild hinaus, und die Nachmessung
    // warf ihn heraus: Ein eingefügtes Bild löschte den Text der ganzen Spalte.
    //
    // Gerechnet wird hier, nicht gemessen: Die Spalten stehen zu diesem
    // Zeitpunkt noch nicht. Kopfhöhe und Aufmacher sind aber bekannt, und die
    // Spaltenkanten kommen aus demselben Raster, mit dem auch eingerastet wird.
    const LUFT_BILD = Math.round(2 * MM);
    const luecken = spaltenlagen(rasterVon(), kopfH + aufH, spaltenH).map((lage) => {
      const raus: { oben: number; hoehe: number }[] = [];
      for (const b of bilder) {
        if ((b.seite | 0) !== 0) continue;   // Lücken nur für die erste Seite berechenbar
        const platz = bildplatz(b, lage, LUFT_BILD);
        if (platz) raus.push(platz);
      }
      return raus;
    });
    const o = { spaltenhoehe: inhaltH - kopfH - RESERVE, spalten, seiten: seitenZahl,
      aufmacherhoehe: aufId === undefined ? undefined : aufH,
      // Ab rund 22 mm Restluft kommt noch ein Beitrag hinein und wird unten
      // gekürzt — die Seite soll voll werden, nicht ordentlich halb leer.
      mindestRest: Math.round(22 * MM),
      luecken };
    const seiten: Seite[] = umbrechen(teile, mess, o);

    seiten.forEach((seite, n) => {
      const st: (SeitenTeil & { spalte?: number })[] = seite.teile.map((p) => ({
        t: quellen[p.id]!, rolle: p.rolle, titel: titelAlle[p.id]!,
        skala: p.skala, zwischenraum: p.zwischenraum, vorabstand: p.vorabstand, spalte: p.spalte,
      }));
      const dom = baueZeitungsseite(kopf, st, spalten, n === 0);
      // In der Vorschau steckt die Seite in einem Papierrahmen; im Druck macht
      // das @page. Der Rahmen wird beim Kopieren fuer den Druck weggelassen.
      blatt.append(el("div", { class: "zk-papier" }, dom));
    });

    // Vor jeder Messung am fertigen Satz: Sonst rechnete die Bildschicht mit
    // einem anderen Maßstab, als der Benutzer gleich vor sich sieht.
    passeZoom();

    // Nachmessen am fertigen Satz, nicht an der Probe: Was hier ueberlaeuft,
    // ueberlaeuft auch auf dem Papier. Der letzte Beitrag einer zu vollen Spalte
    // wird entfernt, bis sie passt - lieber ein Beitrag weniger als ein Text,
    // der die Fusslinie durchbricht.
    let entfernt = 0;
    for (const box of Array.from(blatt.querySelectorAll(".zk-spaltebox")) as HTMLElement[]) {
      let schutz = 0;
      // Gezählt werden BEITRÄGE, nicht Kinder: Seit die Spalte einen
      // Bildplatzhalter tragen kann, wäre eine Spalte mit einem Beitrag
      // „zwei Kinder" — und der letzte Beitrag flöge heraus.
      const beitraege = (): HTMLElement[] => Array.from(box.querySelectorAll(":scope > .zk-beitrag")) as HTMLElement[];
      while (box.scrollHeight > box.clientHeight + 1 && beitraege().length > 1 && schutz++ < 20) {
        box.removeChild(beitraege().pop()!);
        entfernt++;
      }
    }
    // Und die SEITE als Ganzes. Die Spaltenpruefung allein genuegt nicht: Der
    // Aufmacher steht ausserhalb der Spaltenkaesten und wurde nie nachgemessen.
    // Ist er eine Zeile hoeher als gerechnet, schiebt er alles nach unten aus
    // der Seite - und genau das lief unten heraus.
    for (const seite2 of Array.from(blatt.querySelectorAll(".zk-seite")) as HTMLElement[]) {
      let schutz = 0;
      while (seite2.scrollHeight > seite2.clientHeight + 1 && schutz++ < 40) {
        // Immer aus der vollsten Spalte nehmen, sonst wird eine leer und eine
        // bleibt zu voll.
        const boxen = Array.from(seite2.querySelectorAll(".zk-spaltebox")) as HTMLElement[];
        const vollste = boxen
          .filter((b) => b.querySelectorAll(":scope > .zk-beitrag").length > 0)
          .sort((a, b) => b.scrollHeight - a.scrollHeight)[0];
        if (!vollste) break;
        const letzte = Array.from(vollste.querySelectorAll(":scope > .zk-beitrag"));
        vollste.removeChild(letzte[letzte.length - 1]!);
        entfernt++;
      }
    }

    // Was jetzt noch übersteht, kann die Entfernung nicht anfassen, ohne die
    // Spalte zu leeren. Kürzen — gemessen an der Fußlinie jeder Seite.
    let gekuerzt = 0;
    for (const seiteEl of Array.from(blatt.querySelectorAll(".zk-seite")) as HTMLElement[]) {
      gekuerzt += kuerzeAmFuss(seiteEl);
    }

    const gesetzt = seiten.reduce((a, s2) => a + s2.teile.length, 0) - entfernt;
    const grad = Math.round(100 * seiten.reduce((a, s2) => a + fuellgrad(s2, mess, o), 0) / Math.max(1, seiten.length));
    const statusText = `${seiten.length} Seite(n) · ${gesetzt} von ${ids.length} Beiträgen gesetzt · Füllung ${grad} %`
      + (entfernt ? ` · ${entfernt} beim Nachmessen entfernt` : "")
      + (gekuerzt ? ` · ${gekuerzt}× am Fuß gekürzt` : "")
      + (gesetzt < ids.length ? ` · ${ids.length - gesetzt} übrig (mehr Seiten wählen)` : "")
      // Ehrlich sagen, wenn die Seite NICHT voll wird: Der Umbruch kann nur
      // verteilen, was da ist. Bei zwei Texten in der Schatzkammer bleibt die
      // Seite halb leer, und das ist kein Fehler des Setzers.
      + (gesetzt >= ids.length && grad < 80 ? " · zu wenig Material für eine volle Seite — mehr Texte merken" : "");
    zeichneBilder();
    document.querySelectorAll(".zk-probe").forEach((x) => x.remove());
    const druckSeiten = mappeBauen();
    status.textContent = statusText + ` · Druckfassung: ${druckSeiten} Seite(n)`;
  };

  // ── Bildrahmen ──────────────────────────────────────────────────────────
  // Die Bilder liegen in einer eigenen Schicht ÜBER dem Satz und nehmen am
  // Umbruch nicht teil: Der Text fließt nicht um sie herum. Das ist Absicht —
  // ein Umfluss müsste in die Höhenmessung eingreifen, und die entscheidet
  // hier über den Seitenumbruch.
  // Das Raster der Seite: dieselben Zahlen, die der Satz benutzt. 6 mm Steg
  // steht in der Stilvorlage (.zk-raster{gap:0 6mm}); das senkrechte Raster
  // sind 5 mm — fein genug für Zwischenlagen, grob genug zum Ausrichten.
  const RASTER_KEY = "divergenz_zeitung_raster_v1";
  let rasterAn = (() => { try { return localStorage.getItem(RASTER_KEY) !== "0"; } catch { return true; } })();
  const rasterVon = (): Raster => ({
    spalten, seiteB: SEITE_B, seiteH: SEITE_H,
    steg: Math.round(6 * MM), zeile: Math.round(5 * MM),
  });
  const rasterBtn = el("button", { class: "toggle" }, "▦ Raster") as HTMLButtonElement;
  const rasterZeigen = (): void => {
    rasterBtn.classList.toggle("on", rasterAn);
    rasterBtn.setAttribute("aria-pressed", String(rasterAn));
    rasterBtn.title = rasterAn
      ? "Bilder rasten auf Spaltenkanten ein (Breite = ganze Spalten). Klicken für freies Ziehen."
      : "Freies Ziehen. Klicken, um am Spaltenraster einzurasten.";
  };
  rasterBtn.addEventListener("click", () => {
    rasterAn = !rasterAn;
    try { localStorage.setItem(RASTER_KEY, rasterAn ? "1" : "0"); } catch { /* voll */ }
    rasterZeigen();
    if (rasterAn && bilder.length) {
      // Beim Einschalten sofort ausrichten — sonst bliebe das Bild krumm
      // stehen und die Taste sähe wirkungslos aus.
      merkeStand();
      bilder = bilder.map((b) => rasteRahmen(b, rasterVon()));
      sichereBilder(bilder);
      zeichne();
    }
    bildStand();
  });
  rasterZeigen();

  // ── Feste Bildplätze ──────────────────────────────────────────────────────
  // Der freie Rahmen verlangt drei Entscheidungen (Lage, Breite, Höhe), von
  // denen zwei niemand treffen will. Ein Platz nimmt alle drei ab: Er steht
  // fest, bevor es ein Bild gibt, das Bild wird hineingeschnitten
  // (object-fit:cover), und zu skalieren gibt es nichts. Der freie Rahmen
  // bleibt daneben bestehen — ein Bild in einem Platz ist ein ganz gewöhnlicher
  // Bildrahmen und lässt sich hinterher noch verschieben und aufziehen.
  const PLATZ_KEY = "divergenz_zeitung_plaetze_v1";
  let plaetzeAn = (() => { try { return localStorage.getItem(PLATZ_KEY) === "1"; } catch { return false; } })();
  /** Der Platz, für den gerade eine Datei gewählt wird. */
  let zielPlatz: { p: Platz; seite: number } | null = null;
  const platzBtn = el("button", { class: "toggle" }, "▤ Plätze") as HTMLButtonElement;
  const platzZeigen = (): void => {
    platzBtn.classList.toggle("on", plaetzeAn);
    platzBtn.setAttribute("aria-pressed", String(plaetzeAn));
    platzBtn.title = plaetzeAn
      ? "Feste Bildplätze werden angezeigt. Auf einen Platz tippen, um dort ein Bild einzusetzen."
      : "Feste Bildplätze im Spaltenraster anzeigen — Bild einsetzen, ohne etwas zu skalieren.";
  };
  platzBtn.addEventListener("click", () => {
    plaetzeAn = !plaetzeAn;
    try { localStorage.setItem(PLATZ_KEY, plaetzeAn ? "1" : "0"); } catch { /* voll */ }
    platzZeigen();
    zeichne();
  });
  platzZeigen();

  const dateiWahl = el("input", { type: "file", accept: "image/*", style: "display:none" }) as HTMLInputElement;
  const bildBtn = el("button", {}, icon("folder"), " Bild einfügen");
  const bildInfo = el("span", { class: "muted mini" }, "");

  // Der Stand nennt Zahlen, nicht nur ein Gefühl: Wenn ein Bild „springt", muss
  // ablesbar sein, WOHIN. Ohne diese Anzeige war der einzige Befund „geht nicht".
  const bildStand = (live?: Bildrahmen): void => {
    if (!bilder.length) { bildInfo.textContent = ""; return; }
    const z = live || bilder[bilder.length - 1]!;
    const k = spaltenZahl(z.b, rasterVon());
    bildInfo.textContent = `${bilder.length} Bild${bilder.length === 1 ? "" : "er"}`
      + ` · zuletzt: x ${Math.round(z.x)} · y ${Math.round(z.y)} · ${Math.round(z.b)} × ${Math.round(z.h)} px`
      + ` · Breite ${k} ${k === 1 ? "Spalte" : "Spalten"} (Seite ${((z.seite | 0) + 1)})`
      + (rasterAn ? " · Raster an" : " · frei") + " — ziehen zum Verschieben, Ecke unten rechts zum Aufziehen";
  };

  /** Maßstab zwischen Bildschirm und Seitenrechnung. Die Seite ist in mm
   *  gesetzt; bei anderer Bildschirmauflösung oder Zoom stimmen Zeigerwege und
   *  Seitenpixel sonst nicht überein. */
  const massstab = (seiteEl: HTMLElement): number => {
    const w = seiteEl.getBoundingClientRect().width;
    return w > 0 ? w / SEITE_B : 1;
  };

  const rahmenEl = (bild: Bildrahmen, seiteEl: HTMLElement, seiteNr: number): HTMLElement => {
    const box = el("div", { class: "zk-bild" + (gewaehltesBild === bild.id ? " on" : "") });
    // Der Stand DIESES Rahmens, fortgeschrieben über mehrere Griffe hinweg.
    //
    // Vorher startete jeder Griff bei `bild` — dem Stand, den der Rahmen beim
    // Zeichnen mitbekommen hatte. `los()` schreibt aber nur in die Liste
    // `bilder` und zeichnet NICHT neu (das Element steht ja schon richtig).
    // Damit war `bild` nach dem ersten Griff veraltet: Wer ein Bild verkleinert
    // und danach verschiebt, verschob einen Rahmen, der noch die alte Größe
    // trug — das Bild sprang auf seine Ausgangsgröße zurück. Dasselbe galt für
    // zwei Verschiebungen hintereinander.
    let stand: Bildrahmen = { ...bild };
    const legeAn = (r: Bildrahmen): void => {
      box.style.left = r.x + "px"; box.style.top = r.y + "px";
      box.style.width = r.b + "px"; box.style.height = r.h + "px";
    };
    legeAn(bild);
    box.append(el("img", { src: bild.daten, alt: "", draggable: "false" }));
    const griff = el("div", { class: "zk-griff", title: "Aufziehen" });
    const weg = el("button", { class: "zk-bildx", type: "button", title: "Bild entfernen" }, "✕");
    box.append(griff, weg);

    // Der Löschknopf liegt IM Bildrahmen, und der Rahmen bricht sein
    // `pointerdown` ab (preventDefault, damit das Ziehen nicht scrollt). Auf
    // einem Zeigegerät ohne Maus unterdrückt ein abgebrochenes `pointerdown`
    // aber die nachgereichten Maus-Ersatzereignisse — einschließlich `click`.
    // Am Rechner feuerte der Klick trotzdem, auf dem Handy nie: Ein Bild ließ
    // sich dort nicht entfernen.
    //
    // Die Berührung wird deshalb hier angehalten, BEVOR sie den Rahmen
    // erreicht. Nicht abgebrochen — nur ein nicht abgebrochenes `pointerdown`
    // lässt den Klick nachkommen.
    weg.addEventListener("pointerdown", (e) => { e.stopPropagation(); });
    weg.addEventListener("click", (e) => {
      e.stopPropagation();
      merkeStand();
      bilder = bilder.filter((b) => b.id !== bild.id);
      sichereBilder(bilder); bildStand(); zeichne();
    });

    // Ziehen und Aufziehen laufen über dieselbe Schleife.
    //
    // Die Zuhörer hängen am FENSTER, nicht am Bild und nicht am Zeigerfang
    // (setPointerCapture). Der Fang ist bequem, aber er bricht still: Er wirft
    // bei fremder Zeiger-Kennung, und wo er ausfällt, endet die Bewegung, sobald
    // der Zeiger den Rahmen verlässt — genau das sieht aus wie „das Bild lässt
    // sich nicht verschieben". Am Fenster kommt jede Bewegung an.
    //
    // Der Stand wird EINMAL vor dem Griff gemerkt, nicht bei jeder Bewegung —
    // sonst räumt ein einziges Verschieben den Rückgängig-Stapel leer.
    const griffAn = (e: PointerEvent, modus: "zieh" | "skal"): void => {
      e.preventDefault(); e.stopPropagation();
      merkeStand();
      gewaehltesBild = bild.id;
      for (const a of Array.from(document.querySelectorAll(".zk-bild.on"))) a.classList.remove("on");
      box.classList.add("on");
      if (rasterAn) box.parentElement?.classList.add("zeigt");
      const f = massstab(seiteEl) || 1;
      const startX = e.clientX, startY = e.clientY;
      const start: Bildrahmen = { ...stand };
      let jetzt: Bildrahmen = { ...stand };
      const beweg = (ev: Event): void => {
        const pe = ev as PointerEvent;
        const dx = (pe.clientX - startX) / f, dy = (pe.clientY - startY) / f;
        jetzt = modus === "zieh"
          ? verschiebe(start, dx, dy, SEITE_B, SEITE_H)
          : skaliereEcke(start, dx, SEITE_B, SEITE_H);
        if (rasterAn) jetzt = rasteRahmen(jetzt, rasterVon());
        legeAn(jetzt);
        bildStand(jetzt);
      };
      const los = (): void => {
        box.parentElement?.classList.remove("zeigt");
        window.removeEventListener("pointermove", beweg, true);
        window.removeEventListener("pointerup", los, true);
        window.removeEventListener("pointercancel", los, true);
        // In die EINE Wahrheit schreiben, aus der neu gezeichnet wird. Ohne
        // diesen Schritt stünde die neue Lage nur im Stil des Elements — und
        // wäre beim nächsten Neuzeichnen weg.
        const i = bilder.findIndex((b) => b.id === bild.id);
        // Nur schreiben, wenn es das Bild noch gibt. Ein „sonst anhängen" wäre
        // bequem, holte aber ein gerade gelöschtes Bild zurück — die Gegenprobe
        // hat genau das gezeigt: aus einem Bild wurden zwei.
        if (i >= 0) bilder[i] = { ...jetzt, seite: seiteNr };
        // Und in den Stand DIESES Rahmens, sonst startet der nächste Griff
        // wieder bei der Lage vom Zeichnen.
        stand = { ...jetzt, seite: seiteNr };
        if (!sichereBilder(bilder)) status.textContent = "Lage geändert, aber nicht gesichert — der Browser-Speicher ist voll.";
        bildStand();
      };
      window.addEventListener("pointermove", beweg, true);
      window.addEventListener("pointerup", los, true);
      window.addEventListener("pointercancel", los, true);
    };
    box.addEventListener("pointerdown", (e) => griffAn(e as PointerEvent, "zieh"));
    griff.addEventListener("pointerdown", (e) => griffAn(e as PointerEvent, "skal"));
    return box;
  };

  // Der Platz für die Bilder wird nicht mehr hier freigehalten, sondern in der
  // VERTEILUNG: `umbrechen()` bekommt die gesperrten Bänder und setzt den ersten
  // Beitrag unter einem Bild mit einem Abstand an dessen Unterkante. Der frühere
  // Gleitkasten (`.zk-bildplatz`) ist raus — er verschob nur Zeilen, zerriss
  // Beiträge und machte sie höher als gemessen, worauf die Nachmessung sie
  // hinauswarf: Ein eingefügtes Bild löschte den Text der ganzen Spalte.

  /** Kürzt, bis kein Text mehr die Fußlinie berührt.
   *
   *  Gemessen wird an der FUSSLINIE selbst (`getBoundingClientRect`), nicht an
   *  `scrollHeight` des Spaltenkastens. Grund: Der Kasten ist ein Rasterfeld
   *  und wächst mit seinem Inhalt — die Zeile, die unten heraushängt, macht ihn
   *  höher, statt einen Überlauf zu melden. Die Prüfung sah dann nichts, und
   *  `overflow:hidden` schnitt die Zeile in der Mitte durch. Die Fußlinie
   *  dagegen ist genau das, was der Text nicht berühren darf.
   *
   *  Die Reserve fängt zusätzlich den Unterschied zwischen Bildschirm und
   *  Papier ab: Andere Silbentrennung, andere Rundung, eine Zeile mehr.
   *
   *  Erst Sätze, dann Absätze, zuletzt ganze Beiträge — in dieser Reihenfolge,
   *  weil jeder Schritt mehr wegnimmt als der vorige. */
  const RESERVE_FUSS = Math.round(3 * MM);
  const kuerzeAmFuss = (seiteEl: HTMLElement): number => {
    const sR = seiteEl.getBoundingClientRect();
    if (!sR.height) return 0;                     // ohne Layout nichts zu messen
    const fuss = seiteEl.querySelector(".zk-fuss") as HTMLElement | null;
    const grenze = (fuss ? fuss.getBoundingClientRect().top : sR.bottom) - RESERVE_FUSS;
    let gekuerzt = 0;
    for (const kasten of Array.from(seiteEl.querySelectorAll(".zk-spaltebox")) as HTMLElement[]) {
      let schutz = 0;
      while (schutz++ < 150) {
        const beitraege = Array.from(kasten.querySelectorAll(":scope > .zk-beitrag")) as HTMLElement[];
        const letzter = beitraege[beitraege.length - 1];
        if (!letzter) break;
        if (letzter.getBoundingClientRect().bottom <= grenze) break;
        const inhalt = letzter.querySelector(".dm-inhalt") as HTMLElement | null;
        const letztesKind = inhalt?.lastElementChild as HTMLElement | null;
        if (inhalt && letztesKind) {
          if (inhalt.children.length > 1) { inhalt.removeChild(letztesKind); gekuerzt++; continue; }
          const kurz = satzWeg(letztesKind.textContent || "");
          if (kurz) { letztesKind.textContent = kurz; gekuerzt++; continue; }
        }
        // Am Beitrag ist nichts mehr zu kürzen: ganz heraus — außer er ist der
        // einzige der Spalte, dann bliebe sie leer.
        if (beitraege.length > 1) { kasten.removeChild(letzter); gekuerzt++; continue; }
        break;
      }
    }
    return gekuerzt;
  };

  /** Wo fängt der Spaltenbereich an und wie hoch ist er — in Seitenkoordinaten.
   *  Gemessen am echten Kasten, nicht gerechnet: Der Anfang hängt an Kopfhöhe
   *  und Aufmacher, und die stehen erst, wenn gesetzt ist. Ohne Maße (Prüfstand
   *  ohne Layout) gibt es null, und dann keine Plätze. */
  const spaltenbereich = (seiteEl: HTMLElement): { oben: number; hoehe: number } | null => {
    const seiteR = seiteEl.getBoundingClientRect();
    if (!seiteR.width || !seiteR.height) return null;
    const f = seiteR.width / SEITE_B;
    const kaesten = Array.from(seiteEl.querySelectorAll(".zk-spaltebox")) as HTMLElement[];
    let oben = Infinity, unten = -Infinity;
    for (const k of kaesten) {
      const r = k.getBoundingClientRect();
      if (!r.height) continue;
      oben = Math.min(oben, (r.top - seiteR.top) / f);
      unten = Math.max(unten, (r.bottom - seiteR.top) / f);
    }
    if (!isFinite(oben) || unten <= oben) return null;
    return { oben, hoehe: unten - oben };
  };

  /** Die freien Plätze einer Seite als anklickbare Felder. Besetzte Plätze
   *  werden weggelassen — ein Feld über einem Bild wäre eine Falle. */
  const platzElemente = (seiteEl: HTMLElement, seiteNr: number): HTMLElement[] => {
    const bereich = spaltenbereich(seiteEl);
    if (!bereich) return [];
    const aufSeite = bilder.filter((b) => (b.seite | 0) === seiteNr);
    const raus: HTMLElement[] = [];
    for (const p of plaetze(rasterVon(), bereich.oben, bereich.hoehe)) {
      if (platzBesetzt(p, aufSeite)) continue;
      const f = el("button", { class: "zk-platz", type: "button",
        title: `Bild in diesen Platz einsetzen (${p.name})` },
        el("span", {}, p.name));
      f.style.left = p.x + "px"; f.style.top = p.y + "px";
      f.style.width = p.b + "px"; f.style.height = p.h + "px";
      f.addEventListener("click", (e) => {
        e.stopPropagation();
        if (bilder.length >= BILD_ANZAHL) {
          status.textContent = `Höchstens ${BILD_ANZAHL} Bilder — erst eines entfernen.`;
          return;
        }
        zielPlatz = { p, seite: seiteNr };
        dateiWahl.value = "";
        dateiWahl.click();
      });
      raus.push(f);
    }
    return raus;
  };

  /** Bilder auf die fertig gesetzten Seiten legen. Läuft NACH dem Nachmessen
   *  und VOR dem Kopieren für den Druck — sonst fehlten sie auf dem Papier. */
  const zeichneBilder = (): void => {
    const seitenEl = Array.from(blatt.querySelectorAll(".zk-seite")) as HTMLElement[];
    if (!seitenEl.length) return;
    seitenEl.forEach((seiteEl, n) => {
      // Bezugsrahmen der Bildschicht am Element festmachen, nicht nur in der
      // Stilvorlage: Fehlt `position:relative` auf der Seite, bezieht sich die
      // Schicht auf den nächsten gesetzten Vorfahren — im Setzer ist das die
      // bildschirmfüllende Hülle. Das Bild schwebte dann neben dem Papier.
      if (!seiteEl.style.position) seiteEl.style.position = "relative";
      const schicht = el("div", { class: "zk-bilder" });
      // Rasterlinien: nur beim Ziehen sichtbar (Klasse „zeigt"), damit die
      // Vorschau sonst aussieht wie das Papier.
      const r = rasterVon();
      const sp = spaltenBreite(r);
      const hilfe = el("div", { class: "zk-rasterhilfe" });
      hilfe.style.backgroundImage =
        `repeating-linear-gradient(to right, rgba(139,92,246,.16) 0 ${sp.toFixed(2)}px, rgba(139,92,246,0) ${sp.toFixed(2)}px ${(sp + r.steg).toFixed(2)}px)`;
      schicht.append(hilfe);
      if (plaetzeAn) schicht.append(...platzElemente(seiteEl, n));
      // Ein Bild auf einer Seite, die es nicht mehr gibt (Seitenzahl verkleinert),
      // wandert auf die letzte — sonst wäre es unsichtbar und unerreichbar.
      for (const b of bilder) {
        const seite = Math.min(Math.max(0, b.seite | 0), seitenEl.length - 1);
        if (seite !== n) continue;
        schicht.append(rahmenEl(begrenze(b, SEITE_B, SEITE_H), seiteEl, n));
      }
      if (schicht.children.length > 1) seiteEl.append(schicht);   // > 1: die Rasterhilfe zählt nicht
    });
  };

  bildBtn.addEventListener("click", () => {
    if (bilder.length >= BILD_ANZAHL) {
      status.textContent = `Höchstens ${BILD_ANZAHL} Bilder — erst eines entfernen.`;
      return;
    }
    // Der freie Weg: kein Platz im Spiel, sonst läge das nächste Bild dort, wo
    // zuletzt ein Platz angeklickt wurde.
    zielPlatz = null;
    dateiWahl.value = "";
    dateiWahl.click();
  });
  dateiWahl.addEventListener("change", () => {
    const datei = dateiWahl.files && dateiWahl.files[0];
    const ziel = zielPlatz;
    zielPlatz = null;
    if (!datei) return;
    leseBilddatei(datei).then(({ daten, b, h }) => {
      merkeStand();
      // In einem Platz kommt die Geometrie vom PLATZ, nicht vom Bild — und
      // deshalb wird auch nicht eingerastet: Der Platz LIEGT schon im Raster.
      let r = ziel
        ? rahmenAusPlatz(daten, ziel.p, ziel.seite)
        : neuerRahmen(daten, b, h, SEITE_B, SEITE_H, 0);
      if (!ziel && rasterAn) r = rasteRahmen(r, rasterVon());
      bilder = [...bilder, r];
      gewaehltesBild = r.id;
      if (!sichereBilder(bilder)) status.textContent = "Bild eingefügt, aber nicht gesichert — der Browser-Speicher ist voll.";
      bildStand(); zeichne();
    }).catch((e: unknown) => {
      status.textContent = e instanceof Error ? e.message : "Das Bild ließ sich nicht einlesen.";
    });
  });

  // ── Layouts ─────────────────────────────────────────────────────────────
  // Gespeichert wird der ganze Setzer: Kopf, Spalten, Seiten, Beitragsauswahl
  // mit Rolle und Überschrift, dazu die Bilder. Die Beiträge merken sich über
  // einen Textschlüssel, nicht über ihre Listenposition — die verschiebt sich
  // beim nächsten „Merken" in der Schatzkammer.
  let layouts: Layout[] = ladeLayouts();
  const layoutSel = el("select", { title: "Gespeichertes Layout" }) as HTMLSelectElement;
  const layoutInfo = el("span", { class: "muted mini" }, "");
  const layoutListe = (auswahl?: string): void => {
    layoutSel.innerHTML = "";
    layoutSel.append(el("option", { value: "" }, layouts.length ? "— Layout wählen —" : "— noch keins gespeichert —"));
    for (const l of layouts) layoutSel.append(el("option", { value: l.name }, `${l.name} (${l.teile.length} Beiträge${l.bilder.length ? ", " + l.bilder.length + " Bild" + (l.bilder.length === 1 ? "" : "er") : ""})`));
    if (auswahl) layoutSel.value = auswahl;
  };
  const layoutSpeichern = el("button", {}, icon("floppy"), " Layout speichern");
  const layoutLaden = el("button", {}, icon("folder"), " Laden");
  const layoutWeg = el("button", { class: "danger" }, "Löschen");

  layoutSpeichern.addEventListener("click", () => {
    const ids = [...gewaehlt.keys()].sort((a, b) => a - b);
    if (!ids.length && !bilder.length) { layoutInfo.textContent = "Nichts zu speichern — erst Beiträge wählen."; return; }
    const vorschlag = layoutSel.value || (kopf.titel ? `${kopf.titel} ${new Date().toLocaleDateString("de-DE")}` : "Layout");
    const name = (window.prompt("Name des Layouts:", vorschlag) || "").trim();
    if (!name) return;
    const neuLayout: Layout = {
      name, d: new Date().toISOString(),
      kopf: { ...kopf }, spalten, seiten: seitenZahl,
      teile: ids.map((i) => ({ schluessel: textSchluessel(quellen[i]!), rolle: gewaehlt.get(i)!.rolle, titel: gewaehlt.get(i)!.titel })),
      bilder: bilder.map((b) => ({ ...b })),
    };
    layouts = legeLayout(layouts, neuLayout);
    const ok = sichereLayouts(layouts);
    layoutListe(name);
    layoutInfo.textContent = ok
      ? `„${name}" gespeichert · ${neuLayout.teile.length} Beiträge, ${neuLayout.bilder.length} Bilder`
      : `„${name}" passt nicht mehr in den Speicher — ältere Layouts oder Bilder löschen.`;
  });

  /** Ein Layout anwenden. Als eigene Funktion, weil der Autopilot beim Öffnen
   *  gleich sein frisch abgelegtes Layout haben will — der Weg über einen
   *  nachgestellten Klick auf den Knopf wäre eine Wette darauf, dass die
   *  Auswahlliste schon steht. */
  const wendeLayoutAn = (l: Layout): void => {
    merkeStand();
    Object.assign(kopf, l.kopf);
    spalten = l.spalten; seitenZahl = l.seiten;
    const { zuordnung, gefunden, fehlend } = ordneZu(l.teile, quellen);
    gewaehlt.clear();
    for (const [i, v] of zuordnung) gewaehlt.set(i, { ...v });
    bilder = (l.bilder || []).map((b) => ({ ...b }));
    sichereBilder(bilder);
    nachzieher.forEach((fn) => fn());
    bauListe(); bildStand(); zeichne();
    // Ehrlich benennen, was NICHT wiederhergestellt werden konnte: Ein Layout
    // kann Texte nennen, die inzwischen aus der Schatzkammer gelöscht wurden.
    layoutInfo.textContent = `„${l.name}" geladen · ${gefunden} Beiträge gefunden`
      + (fehlend ? ` · ${fehlend} fehlen (nicht mehr in der Schatzkammer)` : "");
  };

  layoutLaden.addEventListener("click", () => {
    const l = layouts.find((x) => x.name === layoutSel.value);
    if (!l) { layoutInfo.textContent = "Erst ein Layout auswählen."; return; }
    wendeLayoutAn(l);
  });

  layoutWeg.addEventListener("click", () => {
    const name = layoutSel.value;
    if (!name) { layoutInfo.textContent = "Erst ein Layout auswählen."; return; }
    if (!confirm(`Layout „${name}" löschen?`)) return;
    layouts = entferneLayout(layouts, name);
    sichereLayouts(layouts);
    layoutListe();
    layoutInfo.textContent = `„${name}" gelöscht`;
  });
  layoutListe();
  // Der Autopilot legt ein Layout ab und oeffnet den Setzer damit. Nach
  // `layoutListe()`, damit die Auswahl schon steht und der Name in der Liste
  // sichtbar ist — sonst waere das Blatt gesetzt und die Liste zeigte etwas
  // anderes an.
  if (layoutSofort) {
    const l = layouts.find((x) => x.name === layoutSofort);
    if (l) { layoutSel.value = l.name; wendeLayoutAn(l); }
    else layoutInfo.textContent = `Layout „${layoutSofort}" nicht gefunden.`;
  }

  const autoBtn = el("button", { title: "Würfelt eine neue Seite aus der Schatzkammer — jeder Klick eine andere Auswahl" }, icon("dice"), " Seiten füllen");
  autoBtn.addEventListener("click", fuellen);
  const drucken = el("button", { class: "primary" }, icon("play"), " Drucken");
  // Der Titel, den die App sonst trägt. EINMAL beim Öffnen gemerkt, nicht bei
  // jedem Druck: Wer zweimal hintereinander druckt, bevor der Browser das
  // Zurücksetzen auslöst, hätte sonst den Druckttitel als „Grundtitel“
  // festgehalten — und die App hieße von da an „Der Zeitstrom 17.08.2026“.
  const grundTitel = document.title;
  let titelLaeuft = 0;
  const titelZurueck = (): void => {
    if (!titelLaeuft) return;
    clearTimeout(titelLaeuft);
    titelLaeuft = 0;
    document.title = grundTitel;
    window.removeEventListener("afterprint", titelZurueck);
  };
  drucken.addEventListener("click", () => {
    // Kopie unmittelbar vor dem Druck neu bauen — nicht darauf vertrauen, dass
    // der letzte Zeichenlauf sie hinterlassen hat.
    const n = mappeBauen();
    if (!n) {
      status.textContent = "Nichts zu drucken — erst Beiträge anhaken oder „Seiten füllen“ klicken.";
      return;
    }
    // Der Dokumenttitel ist der Dateiname, den der Browser beim „Als PDF
    // speichern“ vorschlägt. Er wird VOR dem Druck gesetzt und danach wieder
    // zurückgenommen — sonst hieße die App weiter wie die Ausgabe.
    //
    // Zurückgenommen wird über `afterprint`; nicht jeder Browser meldet das
    // zuverlässig (und im eingebetteten Fenster mancher Handy-Browser gar
    // nicht), deshalb zusätzlich eine Uhr. Sie ist großzügig gestellt: Wer im
    // Druckdialog noch Einstellungen ändert, braucht seine Zeit, und ein zu
    // früh zurückgesetzter Titel wäre genau der Fehler, der behoben werden soll.
    titelZurueck();
    document.title = druckName(kopf.titel);
    window.addEventListener("afterprint", titelZurueck);
    titelLaeuft = setTimeout(titelZurueck, 120_000) as unknown as number;
    window.print();
  });
  const zu = el("button", {}, "Schließen");
  // Beim Drehen des Geräts ändert sich die Kastenbreite. Nur die Verkleinerung
  // wird nachgezogen, NICHT neu gesetzt: Ein voller Zeichenlauf würde bei jedem
  // Dreh die Nachmessung wiederholen und könnte Beiträge entfernen.
  const beiGroesse = (): void => passeZoom();
  window.addEventListener("resize", beiGroesse);
  window.addEventListener("orientationchange", beiGroesse);
  const schliessen = (): void => {
    titelZurueck();
    window.removeEventListener("resize", beiGroesse);
    window.removeEventListener("orientationchange", beiGroesse);
    document.querySelectorAll(".dm-print-aktiv, .zk-probe").forEach((x) => x.remove());
    buehne.remove();
  };
  zu.addEventListener("click", schliessen);
  buehne.addEventListener("click", (e) => { if (e.target === buehne) schliessen(); });

  buehne.append(el("div", { class: "druckdialog zk-dialog" },
    el("div", { class: "druckleiste" },
      feldT("Zeitungstitel", () => kopf.titel, (v) => { kopf.titel = v; }),
      feldT("Motto", () => kopf.motto, (v) => { kopf.motto = v; }),
      feldT("Ausgabe", () => kopf.ausgabe, (v) => { kopf.ausgabe = v; }),
      feldT("Preis", () => kopf.preis, (v) => { kopf.preis = v; }),
      feldZ("Spalten", () => spalten, 2, 5, (v) => { spalten = v; }),
      feldZ("Seiten", () => seitenZahl, 1, 8, (v) => { seitenZahl = v; }),
      feldC("Datum", () => kopf.datum, (v) => { kopf.datum = v; }),
      feldC("Linien", () => kopf.linien, (v) => { kopf.linien = v; }),
      feldC("Gebrochene Schrift", () => kopf.fraktur, (v) => { kopf.fraktur = v; }),
      el("span", { class: "druckspacer" }), bildBtn, platzBtn, rasterBtn, zurueckBtn, autoBtn, drucken, zu, dateiWahl),
    el("p", { class: "muted mini zk-druckhinweis" },
      "Beim Drucken zeigt der Browser oben Datum und Seitentitel und unten die Adresse — das ist SEINE Kopfzeile, nicht die der Zeitung. "
      + "Im Druckdialog unter „Weitere Einstellungen“ den Haken bei „Kopf- und Fußzeilen“ entfernen; dann rückt der Zeitungskopf nach oben. "
      + "Der Browser merkt sich die Einstellung. "
      + "Beim „Als PDF speichern“ schlägt er den Namen der Zeitung mit dem Tagesdatum vor."),
    el("div", { class: "druckleiste zk-layoutleiste" },
      el("span", { class: "chips-label" }, "Layout:"), layoutSel,
      layoutSpeichern, layoutLaden, layoutWeg, layoutInfo),
    bildInfo,
    status,
    el("div", { class: "zk-spalten" }, liste, blatt)));
  document.body.append(buehne);
  bauListe();
  bildStand();
  zeichne();
}
