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
  ["bericht", "Zeitungsbericht"], ["prose", "Prosa"], ["reim", "Reim"], ["haiku", "Haiku"],
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

// Bis zu zwei kleingeschriebene Adjektive zwischen Artikel und Nomen:
// „in einer kleinen Stadt", „in der schlaflosen alten Stadt". Ohne sie blieb
// der Ort im WER kleben — so stand im Wetter-Beispiel „… in einer kleinen
// Stadt hält den Verband" als Figur im Blatt. Die Adjektiv-Endungen sind
// ausdruecklich (-e/-en/-er/-em/-es), damit kein beliebiges Kleinwort
// verschluckt wird.
// Nach dem Nomen dürfen weitere Präpositionsglieder folgen („in einer
// Markthalle vor Sonnenaufgang", „an einer Steilküste im Nebel") — genau so
// sehen die Orte der Welt aus. Die Kette bricht an Komma oder Verb ab.
const ORTS_WORT = /\b(?:am|an|auf|bei|im|in|vor|hinter|unter|über|neben|zwischen)\s+(?:der|dem|den|die|das|einem|einer|einen|eine|ein)?\s*(?:[a-zäöüß]+(?:e|en|er|em|es)\s+){0,2}[A-ZÄÖÜ][\wÄÖÜäöüß-]*(?:\s+[A-ZÄÖÜ][\wÄÖÜäöüß-]*)?(?:\s+(?:am|an|auf|bei|im|in|vor|hinter|unter|über|neben|zwischen|nach|ohne|mit)\s+(?:der|dem|den|die|das|einem|einer|einen|eine|ein)?\s*(?:[a-zäöüß]+(?:e|en|er|em|es)\s+){0,2}[A-ZÄÖÜ][\wÄÖÜäöüß-]*)*/u;
const JAHR = /\b(?:im Jahr\s+)?(1[0-9]{3}|20[0-9]{2})\b/u;

export interface VierW { who: string; where: string; when: string; what: string }

/** Die finiten Verben, an denen die Zerlegung Figur und Vorgang trennt.
 *  Erweitert um die Verben, mit denen die Welt-Vorgänge beginnen (entdeckt,
 *  erbt, verhört, beantragt …) — sonst könnte der Würfelvorrat Sätze
 *  anbieten, die die eigene Zerlegung nicht wieder auseinanderbekommt. */
const VERBEN = "ist|sind|war|waren|wird|werden|hat|haben|kommt|kommen|geht|gehen|bringt|wechselt|verschwindet|beginnt|endet|steht|liegt|trägt|nimmt|sucht|findet|verliert|öffnet|schließt|entdeckt|verfolgt|stößt|rekonstruiert|erbt|entziffert|verhört|beantragt|erfindet|sammelt|zählt|bewacht|notiert|verweigert|behauptet|vergisst|wartet|baut|schreibt|liest|ruft|fragt|schweigt|flieht|versteckt|vertauscht|übersetzt|repariert|kartiert|archiviert|hält|zieht|bleibt|fällt|läuft|treibt|legt|setzt|stellt|zeigt|hört|sieht|kennt|glaubt|meldet|warnt|bekommt|erhält|muss|will|soll|lässt|macht|gibt|sagt|trifft|bemerkt|erkennt|erwacht|verspricht|weckt|verhandelt|löst|füllt|verklagt|bricht|kehrt|räumt|verpasst|beantwortet|kündigt|verschiebt|wacht|gräbt|gewinnt|verwaltet|beruft|optimiert|reformiert|privatisiert|digitalisiert|gründet|tauscht|verkauft|folgt|spricht";
const VERB_ANFANG = new RegExp("^(?:" + VERBEN + ")\\b", "u");
const VERB_IRGENDWO = new RegExp("\\b(?:" + VERBEN + ")\\b", "u");

/** Das HAUPTverb finden — nicht das erste Verb. Deutsche Nebensätze tragen
 *  ihr Verb am Ende: In „Ein Kind, das nur nachts spricht, entdeckt ein
 *  Signal" ist „spricht" das Ende des Relativsatzes, nicht der Vorgang. Mit
 *  der wachsenden Verbliste sprang die Trennung sonst mitten in die Figur.
 *
 *  Die Regel: Ein Verb, dessen Komma-Abschnitt mit einem Relativ- oder
 *  Fragepronomen beginnt und noch KEIN Verb enthält, ist das Nebensatz-Ende
 *  und wird übersprungen; das nächste Verb danach ist wieder Hauptsatz. */
function findeHauptverb(rest: string): { index: number } | null {
  const re = new RegExp("\\s(?:" + VERBEN + ")\\b", "gu");
  let m: RegExpExecArray | null;
  while ((m = re.exec(rest))) {
    const davor = rest.slice(0, m.index);
    const komma = davor.lastIndexOf(",");
    if (komma >= 0) {
      const abschnitt = davor.slice(komma + 1);
      if (/^\s*(der|die|das|den|dem|dessen|deren|was|wer|wo)\b/i.test(abschnitt)
        && !VERB_IRGENDWO.test(abschnitt)) continue;
    }
    return { index: m.index };
  }
  return null;
}

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
  const v = findeHauptverb(rest);
  const who = (v ? rest.slice(0, v.index) : rest).replace(/,\s*$/, "").trim();
  const what = v ? rest.slice(v.index).trim() : "";
  return { who, where, when, what };
}

// ── Was der Kopf in die echten Regler schreibt ──────────────────────────────

export interface KopfWahl {
  form: number; laenge: number; reibung: number; saat: string;
  /** Ist der einfache Kopf der ganze Reiter? Vorgabe JA.
   *
   *  Das Studio hat siebenunddreissig Regler, und wer es zum ersten Mal
   *  oeffnet, sieht sie alle. Der einfache Kopf ersetzt sie beim Aufruf; wer
   *  mehr will, klappt auf. Die Wahl bleibt gespeichert — wer einmal alles
   *  sehen wollte, will es beim naechsten Mal wieder. */
  einfach?: boolean;
}

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

/** Der Vorrat für den Saat-Würfel. Gemeldet: „Hier sind zu wenig Fälle
 *  möglich" — der Würfel kannte nur die fünf festen Beispiele, während
 *  Live-Pool und Welt brachlagen.
 *
 *  Drei Quellen: die festen Beispiele als Boden, kurze satzfähige Phrasen aus
 *  dem Live-Pool (dasselbe Material, aus dem die Probe schöpft), und ein Satz
 *  aus der Welt (Figur + Ort + Vorgang) — der aber nur, wenn die EIGENE
 *  Zerlegung ihn wieder auseinanderbekommt: Ein Vorschlag, der beim Erzeugen
 *  zu Brei zerfällt, wäre schlechter als keiner. */
/** Die satzfähigen Phrasen des Live-Pools: kurz, mit Punkt, großgeschrieben. */
export function poolSaetze(phrasen: string[]): string[] {
  const raus: string[] = [];
  for (const p of phrasen) {
    const t = (p || "").replace(/\s+/g, " ").trim().replace(/[.!?…]+$/, "");
    if (t.length < 18 || t.length > 70 || !/\s/.test(t)) continue;
    raus.push(t.charAt(0).toUpperCase() + t.slice(1) + ".");
  }
  return [...new Set(raus)];
}

/** Ein Satz aus einer Welt-Ziehung — mit der Probe aufs Exempel: Der Satz
 *  zählt nur, wenn die eigene Zerlegung Ort und Vorgang WIRKLICH
 *  zurückgewinnt. Reicht es nicht, wird stufenweise gekürzt — erst der
 *  Vorgang, dann der Ort. Die Figur allein besteht immer. */
export function weltSatz(welt: VierW | null): string | null {
  if (!welt || !welt.who) return null;
  const wer = welt.who.trim().charAt(0).toUpperCase() + welt.who.trim().slice(1);
  const ort = welt.where && ORTS_WORT.test(welt.where) ? ` ${welt.where.trim()}` : "";
  const tat = welt.what && VERB_ANFANG.test(welt.what.trim()) ? ` ${welt.what.trim()}` : "";
  const passt = (s: string): boolean => {
    const z = zerlegeSaat(s);
    if (ort && s.includes(ort) && z.where !== welt.where.trim()) return false;
    if (tat && s.includes(tat) && z.what !== welt.what.trim().replace(/[.]$/, "")) return false;
    return true;
  };
  const kandidaten = [`${wer}${ort}${tat}.`, `${wer}${tat}.`, `${wer}${ort}.`, `${wer}.`];
  return kandidaten.find(passt) || `${wer}.`;
}

export function saatVorrat(phrasen: string[], welt: VierW | null): string[] {
  const raus = [...SAAT_BEISPIELE, ...poolSaetze(phrasen)];
  const s = weltSatz(welt);
  if (s && !raus.includes(s)) raus.push(s);
  return [...new Set(raus)];
}

/** EIN Zug für den Würfel — nach QUELLE gewichtet statt gleichverteilt.
 *
 *  Gemeldet: Die fünf festen Beispiele und dieselben Pool-Fragmente häuften
 *  sich. Gemessen: Bei gleichverteiltem Zug über den Topf lagen die Beispiele
 *  bei 49 %, der immergleiche Pool bei 39 %, die Welt bei 12 % — die
 *  Beispiele liegen IMMER im Topf, die Welt hatte nur einen Platz je Wurf.
 *
 *  Jetzt: Welt 50 %, Pool 40 %, Beispiele 10 % (leere Quellen fallen an die
 *  nächste), je Zug bis zu drei frische Welt-Ziehungen, und `meiden` hält
 *  das zuletzt Gezogene fern. */
export function ziehSaat(
  phrasen: string[], weltZieher: () => VierW | null,
  meiden: string[] = [], rnd: () => number = Math.random,
): string {
  const frisch = (a: string[]): string[] => a.filter((x) => !meiden.includes(x));
  const pool = frisch(poolSaetze(phrasen));
  const welt: string[] = [];
  for (let i = 0; i < 5 && welt.length < 3; i++) {
    const s = weltSatz(weltZieher());
    if (s && !meiden.includes(s) && !welt.includes(s)) welt.push(s);
  }
  const beispiele = frisch([...SAAT_BEISPIELE]);
  const wahl = rnd();
  const aus = (a: string[]): string => a[Math.min(a.length - 1, Math.floor(rnd() * a.length))]!;
  if (welt.length && wahl < 0.5) return aus(welt);
  if (pool.length && wahl < 0.9) return aus(pool);
  if (beispiele.length && wahl >= 0.9) return aus(beispiele);
  // Leere Quellen fallen der Reihe nach an die nächste.
  if (welt.length) return aus(welt);
  if (pool.length) return aus(pool);
  if (beispiele.length) return aus(beispiele);
  return SAAT_BEISPIELE[0]!;
}

export const KOPF_KEY = "divergenz_einfach_v1";
export const VORGABE: KopfWahl = { form: 1, laenge: 1, reibung: 1, saat: SAAT_BEISPIELE[0]!, einfach: true };

export function ladeWahl(): KopfWahl {
  try {
    const r = JSON.parse(localStorage.getItem(KOPF_KEY) || "null") as Partial<KopfWahl> | null;
    return r ? { ...VORGABE, ...r } : { ...VORGABE };
  } catch { return { ...VORGABE }; }
}
export function sichereWahl(w: KopfWahl): void {
  try { localStorage.setItem(KOPF_KEY, JSON.stringify(w)); } catch { /* voll */ }
}

// ── Die Probe aus lebendigem Material ───────────────────────────────────────
// Die Sätze oben sind Muster — sie zeigen die Bauart, aber sie sind nicht
// SEINE. Sobald die lebendigen Pools etwas hergeben, wird die Probe daraus
// gebaut: Dann führt sie nicht mehr vor, wie eine Kollision aussehen KÖNNTE,
// sondern wie sie in diesem Korpus klingt.
//
// Das ist der Unterschied zwischen einem Werbebild und einem Spiegel.

/** Baut eine Probe aus vorhandenen Phrasen.
 *
 *  `stufe` ist die Reibung: eine Phrase, zwei nebeneinander, zwei im selben
 *  Satz verschmolzen. Reicht das Material nicht, gibt die Funktion `null`
 *  zurück und die eingebaute Probe bleibt stehen — eine Kollision aus einer
 *  einzigen Phrase wäre keine. */
/** `versatz` blättert durch das Material: Bei jedem Druck auf die Probe rückt
 *  das Fenster um eins weiter. Die Probe ist dadurch kein Schaufenster mehr,
 *  sondern ein Blättern — man sieht, WORAUS die Maschine gerade schöpft, statt
 *  einen Beleg dafür, dass sie irgendwoher schöpft. */
export function probeAus(phrasen: string[], stufe: number, versatz = 0): Probe | null {
  const gut = phrasen
    .map((p) => p.replace(/\s+/g, " ").trim().replace(/[.!?…]+$/, ""))
    .filter((p) => p.length >= 18 && p.length <= 90 && /\s/.test(p));
  if (gut.length < 2) return null;
  const s = Math.max(0, Math.min(2, Math.round(stufe)));
  // Aus dem Vorrat greifen, nicht ziehen: Dieselbe Stufe soll dieselbe Probe
  // zeigen, solange sich das Material nicht ändert. Ein Wackeln bei jedem
  // Reglerzug wäre Flackern und keine Auskunft.
  // Modulo, damit das Blättern umläuft: Am Ende der Liste fängt es wieder vorn
  // an, statt stehenzubleiben — sonst wüsste niemand, ob die Probe erschöpft
  // ist oder der Druck nicht ankam.
  const v = ((Math.round(versatz) % gut.length) + gut.length) % gut.length;
  const a = gut[v]!;
  const b = gut[(v + 1 + s) % gut.length]!;
  // Gross am Satzanfang. Die Phrasen kommen klein aus den Pools — im Bild stand
  // „ein Ritterhandschuh. eine Erschütterung." Ein Beispiel, das selbst falsch
  // gesetzt ist, macht nicht neugierig, sondern misstrauisch.
  const satz = (t: string): string => t.charAt(0).toUpperCase() + t.slice(1) + ".";
  if (s === 0) {
    return {
      teile: [[satz(a), 1]],
      register: [["dein Material", 1]],
      fuss: "ein Register · geschlossen, sicher, vorhersehbar",
    };
  }
  if (s === 1) {
    return {
      teile: [[satz(a), 1], [" " + satz(b), 2]],
      register: [["dein Material", 1], ["zweite Bank", 2]],
      fuss: "zwei Register · sie stehen nebeneinander",
    };
  }
  return {
    teile: [[a.charAt(0).toUpperCase() + a.slice(1), 1], [" — " + b + ".", 2]],
    register: [["dein Material", 1], ["zweite Bank", 2], ["dritte Bank", 2]],
    fuss: "drei Register · sie treffen im selben Satz aufeinander",
  };
}
