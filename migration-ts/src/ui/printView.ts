// Druckschicht: ein gemeinsames Grundgerüst, darüber je Form ein Druckprofil.
// Kein Server, keine Bibliothek — der Browser-Druckdialog erzeugt das PDF.
//
// Die Vorschau ist DERSELBE DOM wie der Druck, nur in einem Rahmen mit
// A4-Verhältnis dargestellt. So gibt es keine zweite Wahrheit: Was in der
// Vorschau steht, steht auf dem Blatt.

import { el } from "./dom";
import { icon } from "./icons";

export type Profil = "zeitung" | "fliesstext" | "vers" | "haiku" | "buehne" | "shots";

export const PROFIL_LABEL: Record<Profil, string> = {
  zeitung: "Zeitung — zwei Spalten",
  fliesstext: "Fließtext — Blocksatz",
  vers: "Vers — Strophen, breiter Rand",
  haiku: "Haiku — zentriert, viel Weißraum",
  buehne: "Bühne — Sprecher in Kapitälchen",
  shots: "Shots — tabellarisch, Mono",
};

/** Vorbelegung aus der Form. Frei änderbar: Ein Prosatext lässt sich bewusst im
 *  Zeitungssatz drucken. */
export function profilFuerForm(form: string): Profil {
  switch (form) {
    case "bericht": return "zeitung";
    case "haiku": return "haiku";
    case "reim": case "strang": case "poem": return "vers";
    case "drama": case "script": return "buehne";
    case "video": return "shots";
    default: return "fliesstext";
  }
}

interface KopfOpts { blatt: string; rechts: string; datum: boolean; fiktion: boolean; }

// ── Text in Auszeichnung überführen ───────────────────────────────────────
// Die Formen liefern Klartext mit bekannter Struktur. Wer sie nicht auswertet,
// druckt einen grauen Block — die Umbruchdisziplin (Strophen nicht trennen,
// Repliken nicht trennen) braucht Elemente, an denen sie greifen kann.

export function absaetze(text: string): string[] {
  return text.split(/\n{2,}/).map((x) => x.trim()).filter(Boolean);
}

export function inhaltZeitung(text: string): HTMLElement {
  const box = el("div", { class: "dm-inhalt" });
  const teile = absaetze(text);
  // Reihenfolge des Berichts: Dachzeile, Schlagzeile, Vorspann, Rest, Kasten.
  const kastenAb = teile.findIndex((t) => /^Faktenkasten\b/.test(t));
  const kasten = kastenAb >= 0 ? teile.splice(kastenAb, 1)[0]! : "";
  if (teile[0]) box.append(el("div", { class: "dm-dach" }, teile.shift()!));
  if (teile[0]) box.append(el("h1", {}, teile.shift()!));
  if (teile[0]) box.append(el("p", { class: "dm-vorspann" }, teile.shift()!));
  for (const t of teile) box.append(el("p", {}, t));
  if (kasten) {
    const k = el("div", { class: "dm-kasten" });
    const zeilen = kasten.split("\n");
    k.append(el("div", { class: "dm-kastenkopf" }, zeilen.shift() || "Faktenkasten"));
    for (const z of zeilen) if (z.trim()) k.append(el("div", {}, z.trim()));
    box.append(k);
  }
  return box;
}

export function inhaltVers(text: string, proSeite: boolean): HTMLElement {
  const box = el("div", { class: "dm-inhalt" });
  absaetze(text).forEach((strophe, i) => {
    const s = el("div", { class: "dm-strophe" + (proSeite && i > 0 ? " dm-seitenumbruch" : "") });
    for (const zeile of strophe.split("\n")) s.append(el("div", { class: "dm-vers" }, zeile));
    box.append(s);
  });
  return box;
}

function inhaltBuehne(text: string): HTMLElement {
  const box = el("div", { class: "dm-inhalt" });
  for (const zeile of text.split("\n")) {
    const z = zeile.trim();
    if (!z) continue;
    const m = z.match(/^([A-ZÄÖÜ][\wÄÖÜäöüß .-]{0,28}):\s*(.*)$/);
    // Regieanweisungen und die Szenenangabe kursiv, nicht als Replik: "SZENE:"
    // sah wie ein Sprecher aus, weil es dem Muster "Name: Text" entspricht.
    if (/^\(|^\[/.test(z) || /^[A-ZÄÖÜ]{3,}\s*:/.test(z)) { box.append(el("div", { class: "dm-regie" }, z)); continue; }
    if (m) {
      const r = el("div", { class: "dm-replik" });
      r.append(el("span", { class: "dm-sprecher" }, m[1]! + " "), document.createTextNode(m[2] || ""));
      box.append(r);
    } else box.append(el("div", { class: "dm-replik" }, z));
  }
  return box;
}

function inhaltShots(text: string): HTMLElement {
  const box = el("div", { class: "dm-inhalt" });
  const zeilen = text.split("\n");
  let kopf = "";
  for (let i = 0; i < zeilen.length; i++) {
    const z = zeilen[i]!.trim();
    if (!z) continue;
    if (/^Shot\s+\d+/.test(z)) { kopf = z; continue; }
    if (/^DE:\s*/.test(z) && kopf) {
      const s = el("div", { class: "dm-shot" });
      s.append(el("div", { class: "dm-shotnr" }, kopf.replace(/^Shot\s+/, "")));
      s.append(el("div", {}, z.replace(/^DE:\s*/, "")));
      box.append(s); kopf = "";
      continue;
    }
    box.append(el("div", { class: "dm-meta" }, z));
  }
  return box;
}

export function inhaltFliess(text: string): HTMLElement {
  const box = el("div", { class: "dm-inhalt" });
  for (const t of absaetze(text)) box.append(el("p", {}, t));
  return box;
}

export function baueDruckDom(text: string, profil: Profil, o: KopfOpts): HTMLElement {
  const wurzel = el("div", { class: "dm-print", "data-profil": profil });
  const kopf = el("header", { class: "dm-kopf" },
    el("span", {}, o.blatt || ""),
    el("span", {}, [o.rechts, o.datum ? new Date().toLocaleDateString("de-DE") : ""].filter(Boolean).join(" · ")));
  const fuss = el("footer", { class: "dm-fuss" },
    el("span", {}, o.fiktion ? "Fiktiver Bericht · maschinell erzeugt" : ""),
    el("span", {}, ""));
  const inhalt = profil === "zeitung" ? inhaltZeitung(text)
    : profil === "vers" ? inhaltVers(text, false)
    : profil === "haiku" ? inhaltVers(text, true)
    : profil === "buehne" ? inhaltBuehne(text)
    : profil === "shots" ? inhaltShots(text)
    : inhaltFliess(text);
  wurzel.append(kopf, inhalt, fuss);
  return wurzel;
}

// ── Vorschau ──────────────────────────────────────────────────────────────

const GRAD: Record<string, string> = { klein: "0.88", normal: "1", gross: "1.15" };

export function oeffneDruckvorschau(text: string, form: string, titel: string): void {
  if (!text.trim()) return;
  let profil = profilFuerForm(form);

  const buehne = el("div", { class: "druckhuelle" });
  const blatt = el("div", { class: "druckblatt" });

  const profilSel = el("select", {}) as HTMLSelectElement;
  (Object.keys(PROFIL_LABEL) as Profil[]).forEach((p) => profilSel.append(el("option", { value: p }, PROFIL_LABEL[p])));
  profilSel.value = profil;
  const blattIn = el("input", { type: "text", value: titel || "", placeholder: "Blattname oder Titel" }) as HTMLInputElement;
  const datumChk = el("input", { type: "checkbox" }) as HTMLInputElement; datumChk.checked = true;
  const fiktChk = el("input", { type: "checkbox" }) as HTMLInputElement; fiktChk.checked = true;
  const gradSel = el("select", {}) as HTMLSelectElement;
  Object.keys(GRAD).forEach((g) => gradSel.append(el("option", { value: g }, g)));
  gradSel.value = "normal";

  const zeichne = (): void => {
    profil = profilSel.value as Profil;
    // Der Fiktionshinweis ist beim Zeitungssatz NICHT abschaltbar: Ein A4-Blatt
    // im Zeitungssatz ist von echter Presse optisch nicht zu unterscheiden,
    // sobald es das Haus verlässt. Bei den literarischen Profilen besteht diese
    // Verwechslungsgefahr nicht.
    const zwang = profil === "zeitung";
    fiktChk.checked = zwang ? true : fiktChk.checked;
    fiktChk.disabled = zwang;
    blatt.innerHTML = "";
    const dom = baueDruckDom(text, profil, {
      blatt: blattIn.value, rechts: form, datum: datumChk.checked, fiktion: fiktChk.checked,
    });
    dom.style.setProperty("--dm-grad", GRAD[gradSel.value] || "1");
    blatt.append(dom);
    // Der alte Druck-DOM darf nicht liegen bleiben, sonst druckt der zweite
    // Aufruf beide.
    document.querySelectorAll(".dm-print-aktiv").forEach((x) => x.remove());
    const fuerDruck = dom.cloneNode(true) as HTMLElement;
    fuerDruck.classList.add("dm-print-aktiv");
    document.body.append(fuerDruck);
  };
  [profilSel, blattIn, datumChk, fiktChk, gradSel].forEach((x) => {
    x.addEventListener("change", zeichne); x.addEventListener("input", zeichne);
  });

  const feld = (label: string, ...inhalt: (HTMLElement | string)[]): HTMLElement =>
    el("label", { class: "druckfeld" }, el("span", { class: "field-label" }, label), ...inhalt);

  const drucken = el("button", { class: "primary" }, icon("play"), " Drucken");
  drucken.addEventListener("click", () => window.print());
  const zu = el("button", {}, "Schließen");
  const schliessen = (): void => {
    document.querySelectorAll(".dm-print-aktiv").forEach((x) => x.remove());
    buehne.remove();
  };
  zu.addEventListener("click", schliessen);
  buehne.addEventListener("click", (e) => { if (e.target === buehne) schliessen(); });

  buehne.append(el("div", { class: "druckdialog" },
    el("div", { class: "druckleiste" },
      feld("Profil", profilSel), feld("Kopfzeile", blattIn),
      feld("Datum", datumChk), feld("Fiktionshinweis", fiktChk), feld("Schriftgrad", gradSel),
      el("span", { class: "druckspacer" }), drucken, zu),
    blatt));
  document.body.append(buehne);
  zeichne();
}
