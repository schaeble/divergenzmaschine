// Der einfache Kopf: vier Entscheidungen statt siebenunddreißig Regler.
//
// WELCHE VIER — und warum gerade die. Nicht geraten, sondern aus dem
// Wirkungsmesser abgelesen: Die FORM schlägt mit rund 50 aus, die Perspektive
// mit 15, Struktur (1,47), Modus (2,15) und Ton (2,08) liegen auf oder unter
// dem Rauschniveau der Blindprobe (~1,9). Ein einfacher Kopf, der Ton und
// Struktur anböte, böte Knöpfe an, die nichts tun.
//
// Der zweite große Hebel steht in keinem Reglerkasten: die WORTBANK. Dass eine
// Bank für alle Beiträge die Einförmigkeit des Autopiloten verursachte, war der
// Befund von 4.250.0 — Ton und Rhythmus formen nur, die Bank bestimmt, wovon
// ein Text handelt. Deshalb ist der zweite Regler hier die REIBUNG: wie weit
// die gemischten Register auseinanderliegen dürfen.
//
// Bleiben Länge und ein Satz, aus dem die vier W kommen. Alles Übrige würfelt
// die Maschine — und der Schaltplan zeigt, was sie gewürfelt hat.

import type { FormKind } from "../types";

/** Die vier Formen des Kopfes. Bewusst nicht alle neun: „strang", „reim",
 *  „haiku", „video" und „meldung" sind Sonderfälle, die man gezielt sucht —
 *  wer sie will, klappt den Kopf zu und stellt sie ein. */
export const KOPF_FORMEN: [FormKind, string][] = [
  ["bericht", "Zeitungsbericht"], ["prose", "Prosa"], ["poem", "Gedicht"], ["script", "Szene"],
];

/** Zielwortzahl je Stufe. Die mittlere entspricht der bisherigen Vorgabe. */
export const LAENGE_STUFEN = [70, 140, 260];
export const LAENGE_NAMEN = ["kurz", "mittel", "lang"];

/** Wie viele Presets gemischt werden. Die Stufen sind dieselben, die der
 *  Autopilot seit 4.311.0 zieht — ein Kopf, der etwas anderes täte als der
 *  Automat, wäre eine zweite Wahrheit über dieselbe Sache. */
export const REIBUNG_STUFEN = [1, 2, 3];
export const REIBUNG_NAMEN = ["einstimmig", "gemischt", "weit auseinander"];

/** Was die Probe zeigt. Die Sätze sind nicht erfunden: Der rechte ist die
 *  Bauart, die im Betrieb den bisher besten Text ergeben hat — Amtsdeutsch,
 *  das auf ein Opfer trifft. */
export interface Probe {
  teile: [string, 1 | 2][];
  register: [string, 1 | 2][];
  fuss: string;
}
export const PROBEN: Probe[] = [
  {
    teile: [["Der Wachmann notiert die Uhrzeit und schließt das Tor.", 1]],
    register: [["Formalismus", 1]],
    fuss: "ein Register · geschlossen, sicher, vorhersehbar",
  },
  {
    teile: [
      ["Der Wachmann notiert die Uhrzeit.", 1],
      [" Die Frist beginnt mit einem Ereignis ohne Datum.", 2],
    ],
    register: [["Formalismus", 1], ["Hafen", 2]],
    fuss: "zwei Register · sie stehen nebeneinander",
  },
  {
    teile: [
      ["Die Unterlagen liegen vollständig vor", 1],
      [" — nur der Einsatz ist ein Kind, das nicht sterben durfte.", 2],
    ],
    register: [["Formalismus", 1], ["Griechische Tragödie", 2], ["Bergwelt", 2]],
    fuss: "drei Register · sie treffen im selben Satz aufeinander",
  },
];

/** Vorschläge für das Saatfeld. */
export const SAAT_BEISPIELE = [
  "Ein Wachmann am Hafen, 1953.",
  "Eine Klinik, die den Namen wechselt.",
  "Zwei Becher auf einem Tisch in Edinburgh.",
  "Ein Zimmer, das im Plan nicht vorkommt.",
  "Der Bote bringt, was niemand hören will.",
];

// ── Ein Satz wird zu vier W ─────────────────────────────────────────────────
// Der Kopf fragt nach EINEM Satz, nicht nach vier Feldern. Das ist der Punkt:
// „Ein Wachmann am Hafen, 1953" schreibt man in drei Sekunden, vier Felder
// füllt man in zwanzig.
//
// Die Zerlegung ist eine HEURISTIK und keine Grammatik. Sie erkennt eine
// Jahreszahl und eine Ortsangabe mit Präposition, alles davor gilt als Wer, der
// Rest als Was. Wo sie danebengreift, steht das Ergebnis in den vier Feldern
// des Studios und lässt sich dort berichtigen — deshalb SCHREIBT der Kopf in
// die echten Felder und hält nichts für sich.

const ORTS_WORT = /\b(?:am|an|auf|bei|im|in|vor|hinter|unter|über|neben|zwischen)\s+(?:der|dem|den|die|das|einem|einer|einen|eine|ein)?\s*[A-ZÄÖÜ][\wÄÖÜäöüß-]*(?:\s+[A-ZÄÖÜ][\wÄÖÜäöüß-]*)?/u;
const JAHR = /\b(?:im Jahr\s+)?(1[0-9]{3}|20[0-9]{2})\b/u;

export interface VierW { who: string; where: string; when: string; what: string }

export function zerlegeSaat(satz: string): VierW {
  const roh = (satz || "").replace(/\s+/g, " ").trim().replace(/[.]$/, "");
  if (!roh) return { who: "", where: "", when: "", what: "" };
  let rest = roh;

  const j = JAHR.exec(rest);
  const when = j ? `im Jahr ${j[1]}` : "";
  if (j) rest = (rest.slice(0, j.index) + rest.slice(j.index + j[0].length)).replace(/\s*,\s*$/, "").trim();

  const o = ORTS_WORT.exec(rest);
  const where = o ? o[0].replace(/\s+/g, " ").trim() : "";
  // Beim Herausschneiden entstehen doppelte Leerzeichen und hängende Kommas —
  // „Zwei Becher  in Edinburgh". Sie stehen sonst so in den Feldern des
  // Studios und von dort im Text.
  if (o) rest = (rest.slice(0, o.index) + rest.slice(o.index + o[0].length)).replace(/\s{2,}/g, " ").trim();

  rest = rest.replace(/\s{2,}/g, " ").replace(/[,;]\s*$/, "").replace(/,\s*(?=[a-zäöüß])/, ", ").trim();
  // Was übrig ist, teilt sich am ersten finiten Verb: davor die Figur, danach
  // der Vorgang. Ohne erkennbares Verb ist alles die Figur — ein Was zu
  // erfinden wäre schlechter als keines.
  const v = /\s(?:ist|sind|war|waren|wird|werden|hat|haben|kommt|kommen|geht|gehen|bringt|wechselt|verschwindet|beginnt|endet|steht|liegt|trägt|nimmt|sucht|findet|verliert|öffnet|schließt)\b/u.exec(rest);
  const who = (v ? rest.slice(0, v.index) : rest).replace(/,\s*$/, "").trim();
  const what = v ? rest.slice(v.index).trim() : "";
  return { who, where, when, what };
}

// ── Was der Kopf in die echten Regler schreibt ──────────────────────────────

export interface KopfWahl { form: number; laenge: number; reibung: number; saat: string }

export interface KopfStellung {
  form: FormKind;
  lenTarget: number;
  presets: number;
  ctx: VierW;
}

/** Übersetzt die vier Entscheidungen in Reglerstellungen.
 *
 *  KEINE zweite Schicht: Was hier herauskommt, wird in die vorhandenen Felder
 *  geschrieben und ausgelöst wie eine Bedienung von Hand. Ein Kopf, der eigene
 *  Werte führte, wäre genau die zweite Liste, gegen die der Wächter gebaut
 *  wurde — und der Schaltplan zeigte etwas anderes als das Studio. */
export function stellung(w: KopfWahl): KopfStellung {
  const i = (n: number, max: number): number => Math.max(0, Math.min(max, Math.round(n) || 0));
  return {
    form: KOPF_FORMEN[i(w.form, KOPF_FORMEN.length - 1)]![0],
    lenTarget: LAENGE_STUFEN[i(w.laenge, LAENGE_STUFEN.length - 1)]!,
    presets: REIBUNG_STUFEN[i(w.reibung, REIBUNG_STUFEN.length - 1)]!,
    ctx: zerlegeSaat(w.saat),
  };
}

export const KOPF_KEY = "divergenz_einfach_v1";
export const VORGABE: KopfWahl = { form: 1, laenge: 1, reibung: 1, saat: SAAT_BEISPIELE[0]! };

export function ladeWahl(): KopfWahl {
  try {
    const r = JSON.parse(localStorage.getItem(KOPF_KEY) || "null") as Partial<KopfWahl> | null;
    return r ? { ...VORGABE, ...r } : { ...VORGABE };
  } catch { return { ...VORGABE }; }
}
export function sichereWahl(w: KopfWahl): void {
  try { localStorage.setItem(KOPF_KEY, JSON.stringify(w)); } catch { /* voll */ }
}
