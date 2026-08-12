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

function beitrag(t: Treasure, rolle: Rolle, titel: string): HTMLElement {
  const box = el("div", { class: "zk-beitrag zk-" + rolle });
  if (t.form === "bericht") {
    const abs = absaetze(t.t);
    if (abs[0]) box.append(el("div", { class: "zk-dach" }, abs[0]));
  } else if (t.form) {
    box.append(el("div", { class: "zk-dach" }, FORM_LABEL[t.form] || t.form));
  }
  box.append(el(rolle === "aufmacher" ? "h1" : "h2", { class: "zk-titel" }, titel));
  const rumpf = rumpfVon(t);
  box.append(istVers(t.form) ? inhaltVers(rumpf, false) : inhaltFliess(rumpf));
  if (t.form === "bericht") {
    const kasten = absaetze(t.t).find((x) => /^Faktenkasten\b/.test(x));
    if (kasten && rolle === "aufmacher") {
      const k = el("div", { class: "dm-kasten" });
      const zeilen = kasten.split("\n");
      k.append(el("div", { class: "dm-kastenkopf" }, zeilen.shift() || "Faktenkasten"));
      for (const z of zeilen) if (z.trim()) k.append(el("div", {}, z.trim()));
      box.append(k);
    }
  }
  return box;
}

export interface SeitenTeil { t: Treasure; rolle: Rolle; titel: string; }

export function baueZeitungsseite(kopf: Zeitungskopf, teile: SeitenTeil[]): HTMLElement {
  const wurzel = el("div", { class: "dm-print zk-seite", "data-profil": "zeitungsseite" });
  const k = el("header", { class: "zk-kopf" + (kopf.linien ? " zk-linien" : "") + (kopf.fraktur ? " zk-fraktur" : "") });
  k.append(el("div", { class: "zk-name" }, kopf.titel || "Ohne Titel"));
  if (kopf.motto) k.append(el("div", { class: "zk-motto" }, kopf.motto));
  k.append(el("div", { class: "zk-meta" },
    el("span", {}, kopf.ausgabe || ""),
    el("span", {}, kopf.datum ? new Date().toLocaleDateString("de-DE", { weekday: "long", day: "numeric", month: "long", year: "numeric" }) : ""),
    el("span", {}, kopf.preis || "")));
  wurzel.append(k);

  const auf = teile.filter((x) => x.rolle === "aufmacher");
  const sp = teile.filter((x) => x.rolle === "spalte");
  const ka = teile.filter((x) => x.rolle === "kasten");

  for (const a of auf) wurzel.append(beitrag(a.t, "aufmacher", a.titel));
  if (sp.length || ka.length) {
    const raster = el("div", { class: "zk-raster" });
    for (const x of sp) raster.append(beitrag(x.t, "spalte", x.titel));
    for (const x of ka) raster.append(beitrag(x.t, "kasten", x.titel));
    wurzel.append(raster);
  }
  wurzel.append(el("footer", { class: "zk-fuss" },
    el("span", {}, "Fiktive Zeitung · maschinell erzeugt"),
    el("span", {}, kopf.titel || "")));
  return wurzel;
}

// ── Setzer ────────────────────────────────────────────────────────────────

export function oeffneZeitungssetzer(aktuellerText: string, aktuelleForm: string): void {
  const kopf = ladeKopf();
  const schatz = loadTreasury().slice().reverse();
  const quellen: Treasure[] = [];
  if (aktuellerText.trim()) {
    quellen.push({ t: aktuellerText, form: aktuelleForm, d: "im Studio" });
  }
  quellen.push(...schatz);

  const gewaehlt = new Map<number, { rolle: Rolle; titel: string }>();
  const buehne = el("div", { class: "druckhuelle" });
  const blatt = el("div", { class: "druckblatt" });

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
      const vorschlag = istVers(t.form) ? "kasten" : i === 0 ? "aufmacher" : "spalte";
      rolle.value = gewaehlt.get(i)?.rolle || (vorschlag as Rolle);
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
        titel, rolle, el("span", { class: "muted mini" }, `${wc} W · ${t.d}`)));
    });
  };

  const zeichne = (): void => {
    sichereKopf(kopf);
    const teile: SeitenTeil[] = [...gewaehlt.entries()]
      .sort((a, b) => a[0] - b[0])
      .map(([i, v]) => ({ t: quellen[i]!, rolle: v.rolle, titel: v.titel }));
    blatt.innerHTML = "";
    const dom = baueZeitungsseite(kopf, teile);
    blatt.append(dom);
    document.querySelectorAll(".dm-print-aktiv").forEach((x) => x.remove());
    const kopie = dom.cloneNode(true) as HTMLElement;
    kopie.classList.add("dm-print-aktiv");
    document.body.append(kopie);
  };

  const drucken = el("button", { class: "primary" }, icon("play"), " Drucken");
  drucken.addEventListener("click", () => window.print());
  const zu = el("button", {}, "Schließen");
  const schliessen = (): void => {
    document.querySelectorAll(".dm-print-aktiv").forEach((x) => x.remove());
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
      feldC("Datum", kopf.datum, (v) => { kopf.datum = v; }),
      feldC("Linien", kopf.linien, (v) => { kopf.linien = v; }),
      feldC("Gebrochene Schrift", kopf.fraktur, (v) => { kopf.fraktur = v; }),
      el("span", { class: "druckspacer" }), drucken, zu),
    el("div", { class: "zk-spalten" }, liste, blatt)));
  document.body.append(buehne);
  bauListe();
  zeichne();
}
