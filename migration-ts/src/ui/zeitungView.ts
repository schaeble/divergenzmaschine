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

// A4 bei 96 dpi, abzueglich der Raender aus .druckblatt (16 mm oben/unten,
// 14 mm seitlich). Die Zahlen stehen hier und nicht im CSS, weil die Verteilung
// sie kennen muss - gemessen wird trotzdem am echten Element.
export const A4_BREITE = 794, A4_HOEHE = 1123;
export const RAND_X = Math.round(14 * 96 / 25.4), RAND_Y = Math.round(16 * 96 / 25.4);

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

const FORM_LABEL: Record<string, string> = {
  prose: "Prosa", bericht: "Bericht", reim: "Reim", haiku: "Haiku",
  poem: "Prosagedicht", strang: "Strang", script: "Szene", video: "Multi-Shot",
};

/** Überschrift eines Beitrags. Der Bericht bringt seine eigene mit — sie steht
 *  in der zweiten Zeile, zwischen Dachzeile und Vorspann. Alle anderen Formen
 *  haben keine, dort wird die erste Zeile gekürzt. */
export function ueberschriftVon(t: Treasure): string {
  const abs = absaetze(t.t);
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

function istVers(form?: string): boolean {
  return form === "reim" || form === "haiku" || form === "strang" || form === "poem";
}

function beitrag(t: Treasure, rolle: Rolle, titel: string, skala = 1, zwischenraum = 0): HTMLElement {
  const box = el("div", { class: "zk-beitrag zk-" + rolle });
  // Die Schriftskala wirkt ueber eine eigene Variable, damit sie sich mit dem
  // Schriftgrad der Seite multipliziert statt ihn zu ueberschreiben.
  if (skala !== 1) box.style.setProperty("--zk-skala", String(skala));
  if (zwischenraum) box.style.marginBottom = zwischenraum + "px";
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

export interface SeitenTeil { t: Treasure; rolle: Rolle; titel: string; skala?: number; zwischenraum?: number }

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
      .append(beitrag(x.t, x.rolle, x.titel, x.skala ?? 1, x.zwischenraum ?? 0));
  });
  wurzel.append(raster);

  wurzel.append(el("footer", { class: "zk-fuss" },
    el("span", {}, "Fiktive Zeitung · maschinell erzeugt"),
    el("span", {}, kopf.titel || "")));
  return wurzel;
}

/** Misst die Höhe eines Beitrags in einer echten Spalte. Geht nur im Browser —
 *  deshalb steckt die Verteilung in umbruch.ts und bekommt diese Funktion. */
export function browserMessung(quellen: Treasure[], rollen: Rolle[], titel: string[], spaltenbreite: number): Messbar {
  const probe = el("div", { class: "dm-print zk-seite zk-probe", "data-profil": "zeitungsseite" });
  probe.style.cssText = `position:absolute;left:-99999px;top:0;width:${spaltenbreite}px;visibility:hidden`;
  document.body.append(probe);
  const cache = new Map<string, number>();
  return {
    hoehe(id, skala) {
      const key = id + ":" + skala;
      const c = cache.get(key);
      if (c !== undefined) return c;
      probe.innerHTML = "";
      const b = beitrag(quellen[id]!, rollen[id] || "spalte", titel[id] || "", skala, 0);
      probe.append(b);
      const h = b.getBoundingClientRect().height || b.offsetHeight;
      cache.set(key, h);
      return h;
    },
  };
}

// ── Setzer ────────────────────────────────────────────────────────────────

function rolleFuer(t: Treasure, ersteR: boolean): Rolle {
  if (istVers(t.form)) return "kasten";
  return ersteR ? "aufmacher" : "spalte";
}

export function oeffneZeitungssetzer(aktuellerText: string, aktuelleForm: string): void {
  const kopf = ladeKopf();
  const quellen: Treasure[] = [];
  if (aktuellerText.trim()) quellen.push({ t: aktuellerText, form: aktuelleForm, d: "im Studio" });
  quellen.push(...loadTreasury().slice().reverse());

  let spalten = 3, seitenZahl = 1;
  const gewaehlt = new Map<number, { rolle: Rolle; titel: string }>();

  const buehne = el("div", { class: "druckhuelle" });
  const blatt = el("div", { class: "druckblatt zk-blatt" });
  const status = el("div", { class: "zk-status muted mini" });

  const feldT = (label: string, wert: string, cb: (v: string) => void): HTMLElement => {
    const i = el("input", { type: "text", value: wert }) as HTMLInputElement;
    i.addEventListener("input", () => { cb(i.value); zeichne(); });
    return el("label", { class: "druckfeld" }, el("span", { class: "field-label" }, label), i);
  };
  const feldC = (label: string, wert: boolean, cb: (v: boolean) => void): HTMLElement => {
    const i = el("input", { type: "checkbox" }) as HTMLInputElement;
    i.checked = wert;
    i.addEventListener("change", () => { cb(i.checked); zeichne(); });
    return el("label", { class: "druckfeld" }, el("span", { class: "field-label" }, label), i);
  };
  const feldZ = (label: string, wert: number, min: number, max: number, cb: (v: number) => void): HTMLElement => {
    const sel = el("select", {}) as HTMLSelectElement;
    for (let v = min; v <= max; v++) sel.append(el("option", { value: String(v) }, String(v)));
    sel.value = String(wert);
    sel.addEventListener("change", () => { cb(parseInt(sel.value, 10)); zeichne(); });
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
      [an, rolle].forEach((x) => x.addEventListener("change", merke));
      titel.addEventListener("input", merke);
      const wc = (t.t.match(/[A-Za-zÄÖÜäöüß]+/g) || []).length;
      liste.append(el("div", { class: "zk-zeile" },
        an, el("span", { class: "zk-form" }, FORM_LABEL[t.form || ""] || t.form || "—"),
        titel, rolle, el("span", { class: "muted mini" }, `${wc} W`)));
    });
  };

  /** Automatik: so viele Beiträge wählen, wie auf die Seiten passen. Gemischt
   *  nach Form, damit nicht drei Berichte hintereinander stehen. */
  const fuellen = (): void => {
    gewaehlt.clear();
    const nachForm = new Map<string, number[]>();
    quellen.forEach((t, i) => {
      const k = t.form || "?";
      if (!nachForm.has(k)) nachForm.set(k, []);
      nachForm.get(k)!.push(i);
    });
    // Reihum aus jeder Form ziehen: erst ein Bericht, dann Prosa, dann Vers …
    const reihen = [...nachForm.values()];
    const misch: number[] = [];
    for (let r = 0; misch.length < quellen.length; r++) {
      let leer = true;
      for (const reihe of reihen) if (reihe[r] !== undefined) { misch.push(reihe[r]!); leer = false; }
      if (leer) break;
    }
    misch.forEach((i, n) => gewaehlt.set(i, { rolle: rolleFuer(quellen[i]!, n === 0), titel: ueberschriftVon(quellen[i]!) }));
    bauListe();
    zeichne(true);
  };

  const zeichne = (nachFuellung = false): void => {
    sichereKopf(kopf);
    blatt.innerHTML = "";
    const ids = [...gewaehlt.keys()].sort((a, b) => a - b);
    if (!ids.length) { blatt.append(el("p", { class: "muted" }, "Nichts gewählt.")); status.textContent = ""; return; }

    // Erste Seite provisorisch setzen, um Kopfhöhe und Spaltenbreite zu messen.
    const roh = baueZeitungsseite(kopf, ids.map((i) => ({ t: quellen[i]!, rolle: gewaehlt.get(i)!.rolle, titel: gewaehlt.get(i)!.titel })), spalten, true);
    blatt.append(roh);
    const box = roh.querySelector(".zk-spaltebox") as HTMLElement | null;
    const kopfH = (roh.querySelector(".zk-kopf") as HTMLElement | null)?.getBoundingClientRect().height ?? 150;
    const fussH = (roh.querySelector(".zk-fuss") as HTMLElement | null)?.getBoundingClientRect().height ?? 30;
    const breite = box?.getBoundingClientRect().width || 214;
    blatt.innerHTML = "";

    const rollen = quellen.map((t, i) => gewaehlt.get(i)?.rolle || rolleFuer(t, false));
    const titelAlle = quellen.map((t, i) => gewaehlt.get(i)?.titel ?? ueberschriftVon(t));
    const mess = browserMessung(quellen, rollen, titelAlle, breite);
    const teile: UmbruchTeil[] = ids.map((i) => ({ id: i, rolle: rollen[i]! }));
    const inhaltH = A4_HOEHE - 2 * RAND_Y - fussH;
    const o = { spaltenhoehe: inhaltH - kopfH, spalten, seiten: seitenZahl,
      aufmacherhoehe: undefined as number | undefined };
    const seiten: Seite[] = umbrechen(teile, mess, o);

    seiten.forEach((seite, n) => {
      const st: (SeitenTeil & { spalte?: number })[] = seite.teile.map((p) => ({
        t: quellen[p.id]!, rolle: p.rolle, titel: titelAlle[p.id]!,
        skala: p.skala, zwischenraum: p.zwischenraum, spalte: p.spalte,
      }));
      const dom = baueZeitungsseite(kopf, st, spalten, n === 0);
      if (n > 0) dom.classList.add("dm-seitenumbruch");
      blatt.append(dom);
    });

    const gesetzt = seiten.reduce((a, s2) => a + s2.teile.length, 0);
    const grad = Math.round(100 * seiten.reduce((a, s2) => a + fuellgrad(s2, mess, o), 0) / Math.max(1, seiten.length));
    status.textContent = `${seiten.length} Seite(n) · ${gesetzt} von ${ids.length} Beiträgen gesetzt · Füllung ${grad} %`
      + (gesetzt < ids.length ? " · Rest passt nicht mehr — mehr Seiten wählen" : "")
      + (nachFuellung ? "" : "");
    document.querySelectorAll(".zk-probe").forEach((x) => x.remove());
    document.querySelectorAll(".dm-print-aktiv").forEach((x) => x.remove());
    // EIN Behaelter fuer alle Seiten. Einzeln angehaengt bekam jede Seite
    // position:absolute aus der Druckregel und lag auf der vorigen - gedruckt
    // wurde die letzte, und der Zeitungskopf der ersten war verdeckt.
    const mappe = el("div", { class: "dm-print-aktiv dm-seiten" });
    for (const s2 of Array.from(blatt.children)) mappe.append(s2.cloneNode(true));
    document.body.append(mappe);
  };

  const autoBtn = el("button", {}, icon("dice"), " Seiten füllen");
  autoBtn.addEventListener("click", fuellen);
  const drucken = el("button", { class: "primary" }, icon("play"), " Drucken");
  drucken.addEventListener("click", () => window.print());
  const zu = el("button", {}, "Schließen");
  const schliessen = (): void => {
    document.querySelectorAll(".dm-print-aktiv, .zk-probe").forEach((x) => x.remove());
    buehne.remove();
  };
  zu.addEventListener("click", schliessen);
  buehne.addEventListener("click", (e) => { if (e.target === buehne) schliessen(); });

  buehne.append(el("div", { class: "druckdialog zk-dialog" },
    el("div", { class: "druckleiste" },
      feldT("Zeitungstitel", kopf.titel, (v) => { kopf.titel = v; }),
      feldT("Motto", kopf.motto, (v) => { kopf.motto = v; }),
      feldT("Ausgabe", kopf.ausgabe, (v) => { kopf.ausgabe = v; }),
      feldT("Preis", kopf.preis, (v) => { kopf.preis = v; }),
      feldZ("Spalten", spalten, 2, 5, (v) => { spalten = v; }),
      feldZ("Seiten", seitenZahl, 1, 8, (v) => { seitenZahl = v; }),
      feldC("Datum", kopf.datum, (v) => { kopf.datum = v; }),
      feldC("Linien", kopf.linien, (v) => { kopf.linien = v; }),
      feldC("Gebrochene Schrift", kopf.fraktur, (v) => { kopf.fraktur = v; }),
      el("span", { class: "druckspacer" }), autoBtn, drucken, zu),
    status,
    el("div", { class: "zk-spalten" }, liste, blatt)));
  document.body.append(buehne);
  bauListe();
  zeichne();
}
