// Preset-Hygiene — Beinahe-Doppel im Material.
//
// Punkt 3 des Zielbilds: „Ein Brief, der ohne Absender ankommt" und „Ein
// vergessener Brief taucht plötzlich wieder auf" sind kein Bau-Fehler, aber
// im Text erzeugen sie gefühlte Wiederholung, die kein Wächter des Baus
// beheben kann — nur das Preset selbst. Bisher sah das nur der Leser.
//
// Hier wird die Ähnlichkeit zweier Bausteine über ihre Inhaltswort-Stämme
// gemessen (Wörter ab vier Buchstaben, Funktionswörter ausgenommen, auf fünf
// Buchstaben gestutzt — „Briefe"/„Brief", „vergessen"/„vergisst" treffen
// sich). Ein Paar gilt als Beinahe-Doppel, wenn die Stämme sich stark decken
// ODER wenn beide dasselbe Kernwort tragen und kurz sind. Funktioniert über
// Kategoriegrenzen (ein Bild und ein Haken über denselben Brief zählen).
import type { Bank } from "../types";

const FUNKTION = new Set(["aber", "auch", "dann", "denn", "dass", "dem", "den", "der", "des", "die", "das", "ein", "eine", "einen", "einem",
  "einer", "eines", "kein", "keine", "keinen", "nicht", "nichts", "niemand", "jemand", "noch", "nur", "oder", "ohne", "sich", "sein", "seine",
  "seinen", "ihre", "ihren", "ihrem", "über", "unter", "wieder", "wird", "werden", "wurde", "ist", "sind", "war", "hat", "haben", "kann",
  "muss", "will", "soll", "mehr", "sehr", "ganz", "immer", "alles", "etwas", "diese", "dieser", "dieses", "jede", "jeder", "jedes",
  "wenn", "weil", "wie", "als", "vor", "nach", "mit", "von", "aus", "bei", "zum", "zur", "beim", "vom", "durch", "gegen", "zwischen",
  "hinter", "neben", "seit", "schon", "erst", "dort", "hier", "jetzt", "heute", "gestern", "morgen", "plötzlich", "langsam", "leise",
  "einmal", "zweimal", "manchmal", "irgendwo", "irgendwann", "nie", "niemals", "gibt", "geht", "kommt", "steht", "liegt", "bleibt", "macht"]);

export function staemme(text: string): Set<string> {
  const out = new Set<string>();
  for (const w of ((text || "").toLowerCase().match(/[a-zäöüß]{4,}/g) || [])) {
    if (FUNKTION.has(w)) continue;
    out.add(w.slice(0, 5));
  }
  return out;
}

/** Ähnlichkeit 0…1: Anteil gemeinsamer Stämme an den Stämmen des kürzeren. */
export function aehnlichkeit(a: string, b: string): number {
  const sa = staemme(a), sb = staemme(b);
  if (!sa.size || !sb.size) return 0;
  let gemeinsam = 0;
  for (const s of sa) if (sb.has(s)) gemeinsam++;
  return gemeinsam / Math.min(sa.size, sb.size);
}

/** Kernwörter: großgeschriebene Nomen (ab fünf Buchstaben), als Stamm. */
export function kernwoerter(text: string): Set<string> {
  const out = new Set<string>();
  for (const w of ((text || "").match(/[A-ZÄÖÜ][a-zäöüß]{4,}/g) || [])) {
    const l = w.toLowerCase();
    if (FUNKTION.has(l)) continue;
    out.add(l.slice(0, 5));
  }
  return out;
}

export type DoppelArt = "identisch" | "ähnlich" | "kernwort";
export interface Doppel { a: string; b: string; katA: string; katB: string; grad: number; kern: string; art: DoppelArt }

/** Beinahe-Doppel in einer Bank, drei Arten:
 *  - identisch: gleicher Wortlaut (auch über Kategorien).
 *  - ähnlich: Stämme decken sich zu mindestens `schwelle` (Vorgabe 0,6) bei
 *    mindestens zwei gemeinsamen — über Kategorien, aber ohne Requisiten
 *    (eine Requisite IST oft der Kern eines Bildes, das ist Bauweise).
 *  - kernwort: dasselbe Kernnomen in derselben Kategorie („Ein Brief, der
 *    ohne Absender ankommt" / „Ein vergessener Brief taucht wieder auf").
 *  Sortiert: identisch, ähnlich (nach Grad), kernwort. */
export function findeDoppel(bank: Bank, schwelle = 0.6): Doppel[] {
  const eintraege: { text: string; kat: string; st: Set<string>; kern: Set<string> }[] = [];
  for (const [kat, liste] of Object.entries(bank as unknown as Record<string, unknown>)) {
    if (!Array.isArray(liste) || kat === "verwandlungen") continue;
    for (const t of liste as string[]) { const text = (t || "").trim(); if (text) eintraege.push({ text, kat, st: staemme(text), kern: kernwoerter(text) }); }
  }
  const out: Doppel[] = [];
  for (let i = 0; i < eintraege.length; i++) {
    for (let j = i + 1; j < eintraege.length; j++) {
      const A = eintraege[i]!, B = eintraege[j]!;
      if (A.text.toLowerCase() === B.text.toLowerCase()) { out.push({ a: A.text, b: B.text, katA: A.kat, katB: B.kat, grad: 1, kern: "", art: "identisch" }); continue; }
      if (!A.st.size || !B.st.size) continue;
      let gemeinsam = 0; let kern = "";
      for (const s of A.st) if (B.st.has(s)) { gemeinsam++; if (!kern) kern = s; }
      const grad = gemeinsam / Math.min(A.st.size, B.st.size);
      const ohneRequisit = A.kat !== "props" && B.kat !== "props";
      if (ohneRequisit && gemeinsam >= 2 && grad >= schwelle) { out.push({ a: A.text, b: B.text, katA: A.kat, katB: B.kat, grad, kern, art: "ähnlich" }); continue; }
      if (A.kat === B.kat && A.kat !== "props") {
        let k = "";
        for (const s of A.kern) if (B.kern.has(s)) { k = s; break; }
        if (k) out.push({ a: A.text, b: B.text, katA: A.kat, katB: B.kat, grad, kern: k, art: "kernwort" });
      }
    }
  }
  const rang: Record<DoppelArt, number> = { identisch: 0, "ähnlich": 1, kernwort: 2 };
  return out.sort((x, y) => rang[x.art] - rang[y.art] || y.grad - x.grad);
}

/** Kernwörter, die in mehreren Bausteinen stehen (Requisiten ausgenommen —
 *  sie SIND die Kerne). Als Gruppen, größte zuerst: „brief: 3 Bausteine". Das
 *  ist die Sicht, in der man Beinahe-Doppel wie Samowar/Samowar oder Ikone/
 *  Ikone über Kategoriegrenzen sieht, ohne dass jedes Paar gelistet wird. */
export interface KernGruppe { kern: string; eintraege: { text: string; kat: string }[] }
export function kernwortGruppen(bank: Bank, mindestens = 2): KernGruppe[] {
  const gruppen = new Map<string, { text: string; kat: string }[]>();
  for (const [kat, liste] of Object.entries(bank as unknown as Record<string, unknown>)) {
    if (!Array.isArray(liste) || kat === "verwandlungen" || kat === "props") continue;
    for (const t of liste as string[]) {
      const text = (t || "").trim(); if (!text) continue;
      for (const k of kernwoerter(text)) { const g = gruppen.get(k) || []; g.push({ text, kat }); gruppen.set(k, g); }
    }
  }
  return [...gruppen.entries()].filter(([, e]) => e.length >= mindestens)
    .map(([kern, eintraege]) => ({ kern, eintraege })).sort((a, b) => b.eintraege.length - a.eintraege.length);
}
