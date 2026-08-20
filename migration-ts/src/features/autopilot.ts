// Autopilot: eine ganze Zeitungsseite auf einen Druck.
//
// Ausdrücklich OHNE bezahlte KI. Alles, was hier läuft, läuft offline: Bank,
// Presets, Markov-Korpus, Sammler-Vorrat, Bildvorrat, Kontextwürfel. Das ist
// keine Sparsamkeit, sondern der Punkt — eine Zeitung, die nur mit Netz und
// Guthaben entsteht, ist kein Automat, sondern ein Abonnement.
//
// Hier steht nur die PLANUNG: Was soll auf der Seite stehen, in welcher Form,
// wie lang, woher der Kontext. Das Erzeugen selbst macht die Ansicht mit den
// vorhandenen Bausteinen — hier wäre es nicht prüfbar.

import type { FormKind, GenInput } from "../types";
import {
  TONE_OPTS, STRUCTURE_OPTS, MODE_OPTS, PERSP_OPTS, RHYTHM_OPTS,
  VARIANZ_OPTS, DISRUPTOR_OPTS, ARCH_OPTS, werte,
} from "../generation/optionen";

/** Was ein einzelner Beitrag werden soll. */
export interface Auftrag {
  form: FormKind;
  /** Ziel-Wortzahl. Der Umbruch braucht Unterschiede: Vier gleich lange
   *  Beiträge ergeben eine Tapete, keine Seite. */
  woerter: number;
  /** Woher der 4W-Kontext kommt. */
  quelle: Quelle;
  /** Nur zur Anzeige, damit man beim Warten sieht, was gerade entsteht. */
  was: string;
}

/** Woher die vier W eines Beitrags stammen.
 *
 *  „idee" ist der Ideengenerator: Er liefert eine Prämisse samt Figur, Ort,
 *  Zeit und Vorgang — anders als Würfel und Vorrat erfindet er einen
 *  ZUSAMMENHANG, statt vier Felder nebeneinanderzustellen. */
export type Quelle = "vorrat" | "bild" | "wuerfel" | "idee";

/** Die Formen, die auf einer Zeitungsseite Sinn ergeben. „video" und „shots"
 *  fehlen mit Absicht: Sie erzeugen Drehbuchlisten, die im Satzspiegel wie ein
 *  Fehler aussehen. */
export const SEITEN_FORMEN: FormKind[] = ["bericht", "meldung", "prose", "poem"] as FormKind[];

/** Wie viele Beiträge eine Seite verträgt. Weniger als drei füllt sie nicht,
 *  mehr als sieben fällt beim Umbruch ohnehin hinten herunter — der Setzer
 *  füllt der Reihe nach, bis das Blatt voll ist. */
export const BEITRAEGE_MIN = 3;
/** Wie viele Beiträge EINE Seite verträgt. Der Setzer füllt der Reihe nach,
 *  bis das Blatt voll ist, und lässt den Rest liegen — mehr zu erzeugen kostet
 *  nur Rechenzeit. Großzügig gewählt, weil eine Seite mit fünf Spalten und
 *  vielen Kurzformen deutlich mehr fasst als eine dreispaltige mit Aufmachern. */
export const BEITRAEGE_JE_SEITE = 12;
/** Harte Obergrenze über alle Seiten. Jeder Beitrag ist ein voller
 *  Generatorlauf; bei fünfzig wartet man Minuten vor einer eingefrorenen
 *  Ansicht. */
export const BEITRAEGE_MAX = 40;

/** Wie viele Beiträge bei dieser Seitenzahl sinnvoll sind.
 *
 *  Vorher stand hier eine feste Sieben — aus einer Zeit, in der es nur eine
 *  Seite gab. Wer zwei Seiten und sechzehn Beiträge einstellte, bekam sieben
 *  und eine fast leere zweite Seite, ohne dass irgendwo stand, warum. Eine
 *  Grenze, die stillschweigend zugreift, ist schlimmer als eine, die zu eng
 *  ist. */
export function maxBeitraege(seiten: number): number {
  const s = Math.max(1, Math.min(8, Math.round(seiten) || 1));
  return Math.max(BEITRAEGE_MIN, Math.min(BEITRAEGE_MAX, s * BEITRAEGE_JE_SEITE));
}
export const BEITRAEGE_VORGABE = 5;

const zieh = <T,>(liste: T[], rnd: () => number): T =>
  liste[Math.min(liste.length - 1, Math.max(0, Math.floor(rnd() * liste.length)))]!;

/** Der Besetzungsplan einer Seite.
 *
 *  Die Mischung ist nicht zufällig, sondern eine Zeitungsform: ein langer
 *  Aufmacher, dann Mittleres, dazu mindestens eine Kurzform als Kasten. Rein
 *  zufällig gezogen kämen regelmäßig vier gleich lange Berichte heraus, und die
 *  Seite sähe aus wie ein Blockschema.
 *
 *  `hatVorrat` und `hatBild` sagen, welche Kontextquellen überhaupt gefüllt
 *  sind — ist keine da, bleibt der Würfel, und der funktioniert immer. */
export function baueBesetzung(
  anzahl: number, hatVorrat: boolean, hatBild: boolean, rnd: () => number = Math.random,
  max = BEITRAEGE_JE_SEITE,
): Auftrag[] {
  const obergrenze = Math.max(BEITRAEGE_MIN, Math.min(BEITRAEGE_MAX, Math.round(max) || BEITRAEGE_JE_SEITE));
  const n = Math.max(BEITRAEGE_MIN, Math.min(obergrenze, Math.round(anzahl) || BEITRAEGE_VORGABE));
  const quellen: Quelle[] = ["wuerfel"];
  if (hatVorrat) quellen.push("vorrat");
  if (hatBild) quellen.push("bild");
  // Die Ideen sind immer da — sie brauchen keinen Vorrat, nur den Generator.
  quellen.push("idee");
  // REIHUM statt zufällig. Beim Ziehen kam es regelmäßig vor, dass alle
  // Beiträge einer Ausgabe aus derselben Quelle stammten — und wenn der
  // Bildvorrat gerade aus dreissig Tempelfotos besteht, handelt die ganze
  // Zeitung von Tempeln. Reihum ist keine Geschmacksfrage, sondern der
  // Unterschied zwischen einer Seite und einer Wiederholung.
  let zaehler = 0;
  const naechsteQuelle = (): Quelle => quellen[zaehler++ % quellen.length]!;

  const auftraege: Auftrag[] = [];
  // 1 · Der Aufmacher. Bericht ODER Prosa — vorher stand hier fest „bericht",
  // und über siebzehn Ausgaben war der Aufmacher ausnahmslos ein Bericht. Der
  // Bericht bringt zwar von sich aus Schlagzeile, Vorspann und Faktenkasten
  // mit; das macht ihn bequem, aber nicht zum einzig Möglichen. Eine
  // Prosa-Titelgeschichte ist der Grund, warum das hier eine Divergenzmaschine
  // ist und keine Nachrichtenagentur.
  const aufmacherForm = (rnd() < 0.5 ? "bericht" : "prose") as FormKind;
  auftraege.push({
    form: aufmacherForm, woerter: 260 + Math.floor(rnd() * 120),
    quelle: naechsteQuelle(), was: "Aufmacher",
  });
  // 2 · Ein Kasten. Kurz, und die Kurzform trägt die Seite optisch.
  auftraege.push({ form: "meldung" as FormKind, woerter: 70 + Math.floor(rnd() * 40), quelle: naechsteQuelle(), was: "Kasten" });
  // 3 · Der Rest. Vorher lief hier ein FESTER Zyklus („bericht, prose, meldung,
  // prose, poem", immer in dieser Reihenfolge) — jede Ausgabe hatte damit
  // dieselbe Gestalt. Jetzt gezogen, aber aus einem Beutel, der die Mischung
  // sichert: Ohne ihn kämen regelmäßig fünf Berichte hintereinander.
  const beutel: FormKind[] = ["bericht", "prose", "prose", "meldung", "poem", "bericht", "prose", "meldung"] as FormKind[];
  for (let i = 2; i < n; i++) {
    const form = zieh(beutel, rnd);
    const woerter = form === "poem" ? 40 + Math.floor(rnd() * 30)
      : form === "meldung" ? 80 + Math.floor(rnd() * 50)
        : 130 + Math.floor(rnd() * 110);
    auftraege.push({ form, woerter, quelle: naechsteQuelle(), was: `Beitrag ${i + 1}` });
  }
  return auftraege;
}

/** Aus einem Auftrag und einem Kontext die Eingabe für die Erzeugung.
 *
 *  Die Regler werden gewürfelt, aber nicht alle: Form und Länge stehen im
 *  Auftrag, und „markovMode" bleibt an, weil der Korpus sonst ungenutzt bliebe
 *  — er ist der Teil, der die Texte an DIESE Maschine bindet statt an die
 *  eingebauten Schablonen. */
export function baueEingabe(
  a: Auftrag, ctx: { who: string; where: string; when: string; what: string },
  rnd: () => number = Math.random,
): GenInput {
  const w = <T,>(l: T[]): T => zieh(l, rnd);
  return {
    who: ctx.who, where: ctx.where, when: ctx.when, what: ctx.what,
    form: a.form,
    lenTarget: a.woerter,
    // ALLE Werte kommen aus den echten Reglerlisten. Vorher standen hier
    // eigene, nie abgeglichene Listen: „ringkomposition", „duester",
    // „wechsel", „mild", „er", „sie" — Werte, die es nicht gibt. Sie fielen
    // still auf die Vorgabe zurück, und die Maschine variierte nur zum Schein.
    tone: w(werte(TONE_OPTS)),
    varLevel: w(werte(VARIANZ_OPTS)),
    // „rekombination" ist im Studio die VORGABE und war hier nie erreichbar —
    // daher fehlten die Rekombinationstexte vollständig. Sie steht jetzt
    // doppelt im Beutel, weil sie das Verfahren ist, das diese Maschine
    // ausmacht.
    structure: w([...werte(STRUCTURE_OPTS), "rekombination"]),
    mode: w(werte(MODE_OPTS)),
    perspective: w(werte(PERSP_OPTS)),
    rhythm: w(werte(RHYTHM_OPTS)),
    markovMode: "on",
    disruptor: w(werte(DISRUPTOR_OPTS)),
    // „auto" gibt es bei den Archetypen nicht — es war schlicht falsch und
    // ergab immer denselben Rückfall.
    archetypeA: w(werte(ARCH_OPTS)), archetypeB: w(werte(ARCH_OPTS)),
    instability: w([0, 1, 1, 2]) as GenInput["instability"],
    ressort: "auto",
  };
}

/** Eine Überschrift aus dem Kontext, falls der Text selbst keine mitbringt.
 *  Kurz halten: Eine Überschrift, die über drei Zeilen läuft, sprengt die
 *  Spalte. */
export function titelAus(ctx: { who: string; what: string }, ersatz = "Ohne Titel"): string {
  const roh = `${ctx.who || ""} ${ctx.what || ""}`.replace(/\s+/g, " ").trim();
  if (!roh) return ersatz;
  const kurz = roh.length <= 60 ? roh : roh.slice(0, 57).replace(/\s+\S*$/, "") + "…";
  return kurz.charAt(0).toUpperCase() + kurz.slice(1);
}

// ── Die Ausgabennummer ──────────────────────────────────────────────────────

/** Zählt die Nummer im Ausgabefeld hoch und lässt alles andere stehen.
 *
 *  Das Feld ist frei beschreibbar („Nr. 1", „Ausgabe 12", „III/2026"), deshalb
 *  wird nicht geparst, sondern die LETZTE Zahlengruppe erhöht. Führende Nullen
 *  bleiben: Wer „Nr. 007" schreibt, meint das so. */
export function naechsteAusgabe(roh: string): string {
  const s = (roh || "").trim();
  if (!s) return "Nr. 2";
  const m = /(\d+)(\D*)$/.exec(s);
  // Keine Zahl da — anhängen statt raten. „Sonderausgabe" wird zu
  // „Sonderausgabe 2", weil die vorliegende die erste war.
  if (!m) return s + " 2";
  const alt = m[1]!;
  const neu = String(parseInt(alt, 10) + 1).padStart(alt.length, "0");
  return s.slice(0, m.index) + neu + m[2]!;
}

/** Der Name, unter dem das Layout abgelegt wird.
 *
 *  Die Nummer gehört zwingend hinein: Die Ablage ERSETZT Layouts gleichen
 *  Namens. Ohne Nummer überschriebe jede Ausgabe die vorige, und der Autopilot
 *  hinterließe genau ein Layout statt einer Reihe. */
export function layoutName(basis: string, ausgabe: string): string {
  const b = (basis || "").trim().replace(/\s+/g, " ") || "Ausgabe";
  const a = (ausgabe || "").trim().replace(/\s+/g, " ");
  return (a ? `${b} ${a}` : b).slice(0, 60);
}

// ── Rollen nach dem Erzeugen ────────────────────────────────────────────────

export type Rollenname = "aufmacher" | "normal" | "kasten";

/** Verteilt die Rollen nach der WIRKLICHEN Länge, nicht nach der geplanten.
 *
 *  Der Generator trifft die Zielwortzahl nicht auf das Wort genau, und ein
 *  Aufmacher, der kürzer geriet als die Meldung daneben, sieht auf der Seite
 *  aus wie ein Fehler. Deshalb wird nach dem Erzeugen noch einmal sortiert. */
export function verteileRollen(texte: { text: string; form: FormKind }[]): Rollenname[] {
  const worte = (t: string): number => (t.match(/[A-Za-zÄÖÜäöüß]+/g) || []).length;
  const kurzform = (f: FormKind): boolean =>
    f === "haiku" || f === "poem" || f === "reim" || f === "meldung";
  const rollen: Rollenname[] = texte.map(() => "normal");
  if (!texte.length) return rollen;

  const alle = texte.map((t, i) => ({ i, n: worte(t.text), kurz: kurzform(t.form) }));
  // Der Aufmacher kommt aus dem Fließtext. Gibt es keinen, nimmt der längste
  // Text die Stelle ein — eine Seite ohne Aufmacher hat keinen Einstieg.
  const fliess = alle.filter((x) => !x.kurz);
  const auf = (fliess.length ? fliess : alle).slice().sort((a, b) => b.n - a.n)[0];
  if (auf) rollen[auf.i] = "aufmacher";

  // Ein Kasten erst ab drei Beiträgen: Bei zweien nähme er die halbe Seite ein.
  if (texte.length >= 3) {
    const rest = alle.filter((x) => x.i !== auf?.i);
    const kandidat = rest.filter((x) => x.kurz).sort((a, b) => a.n - b.n)[0]
      ?? rest.slice().sort((a, b) => a.n - b.n)[0];
    if (kandidat) rollen[kandidat.i] = "kasten";
  }
  return rollen;
}

// ── Was eine Form wirklich liefert ──────────────────────────────────────────
// Gemessen, nicht geschätzt: 12 Läufe je Form und Zielwortzahl, gegen die
// tatsächliche Ausgabe gehalten (Stand 4.251.0).
//
//   prose    Ziel  40 → 35     Ziel 200 → 192    Ziel 350 → 341    folgt
//   bericht  Ziel  40 → 152    Ziel 200 → 223    Ziel 350 → 379    ab ~200
//   meldung  Ziel  40 → 29     Ziel 200 → 29     Ziel 350 → 29     folgt NICHT
//   poem     Ziel  40 → 69     Ziel 200 → 71     Ziel 350 → 66     folgt NICHT
//
// Der Längenregler wird also sehr wohl benutzt — aber Meldung und Gedicht
// haben eine feste Gestalt, und der Bericht kann unter 150 Wörtern gar nicht
// existieren: Schlagzeile, Vorspann, zwei Zitate und Faktenkasten sind sein
// Gerüst.
//
// Der Autopilot plante bisher eine Meldung mit 80 bis 130 Wörtern und bekam 29.
// Bei acht Beiträgen summierte sich das auf mehrere hundert Wörter, die auf
// dem Papier fehlten — genau die Leerstellen.

export interface FormErtrag {
  /** Was die Form mindestens liefert, egal welche Zielzahl man setzt. */
  min: number;
  /** Was sie höchstens liefert. */
  max: number;
  /** Folgt sie dem Längenregler überhaupt? */
  steuerbar: boolean;
}

export const ERTRAG: Record<string, FormErtrag> = {
  prose: { min: 60, max: 420, steuerbar: true },
  bericht: { min: 150, max: 460, steuerbar: true },
  meldung: { min: 28, max: 32, steuerbar: false },
  poem: { min: 55, max: 80, steuerbar: false },
  haiku: { min: 10, max: 22, steuerbar: false },
  reim: { min: 40, max: 90, steuerbar: false },
  strang: { min: 40, max: 120, steuerbar: false },
};

export function ertragVon(form: string): FormErtrag {
  return ERTRAG[form] || { min: 60, max: 300, steuerbar: true };
}

/** Wie viele Wörter eine Seite fasst.
 *
 *  Aus gesetzten Ausgaben abgelesen: Eine dreispaltige A4-Seite trägt rund 620
 *  Wörter, bis der Fuß erreicht ist. Mehr Spalten heißt mehr Stege und mehr
 *  Überschriften, also etwas weniger Text — nicht mehr.
 *
 *  Eine Schätzung, und sie wird auch so genannt. Die genaue Zahl hängt an
 *  Schriftgrad, Bildern und Formenmischung; korrigieren lässt sie sich am
 *  Füllgrad, den der Setzer nach jedem Umbruch meldet. */
export function woerterJeSeite(spalten: number): number {
  const sp = Math.max(2, Math.min(5, Math.round(spalten) || 3));
  return Math.round(620 - (sp - 3) * 35);
}

/** Verteilt die Zielwortzahlen so, dass die Seite aufgeht.
 *
 *  Die nicht steuerbaren Formen liefern, was sie liefern — sie werden zuerst
 *  abgezogen. Was übrig bleibt, tragen Prosa und Bericht, und zwar nach ihrem
 *  bisherigen Gewicht: Ein Aufmacher, der doppelt so lang geplant war wie ein
 *  Spaltenstück, bleibt doppelt so lang. Am Ende wird auf das geklemmt, was die
 *  Form überhaupt hergibt — und der Rest noch einmal umgelegt.
 *
 *  Rein und damit ohne Browser prüfbar. */
export function planeLaengen(auftraege: Auftrag[], spalten: number, seiten: number): Auftrag[] {
  const platz = woerterJeSeite(spalten) * Math.max(1, Math.min(8, Math.round(seiten) || 1));
  const raus = auftraege.map((a) => ({ ...a }));
  if (!raus.length) return raus;

  // 1 · Feste Formen: Sie bekommen ihren Mittelwert und sind damit erledigt.
  let fest = 0;
  const flexibel: number[] = [];
  raus.forEach((a, i) => {
    const e = ertragVon(a.form);
    if (!e.steuerbar) { a.woerter = Math.round((e.min + e.max) / 2); fest += a.woerter; }
    else flexibel.push(i);
  });
  if (!flexibel.length) return raus;

  // 2 · Der Rest wird nach bisherigem Gewicht verteilt.
  const rest = Math.max(0, platz - fest);
  const summe = flexibel.reduce((a, i) => a + Math.max(1, raus[i]!.woerter), 0);
  for (const i of flexibel) {
    raus[i]!.woerter = Math.round((rest * Math.max(1, raus[i]!.woerter)) / summe);
  }

  // 3 · Klemmen auf das, was die Form hergibt — und den Überschuss umlegen.
  // Ohne diesen Schritt bekäme ein Bericht 40 Wörter zugeteilt und lieferte
  // 150, und die Rechnung wäre für die Katz.
  for (let runde = 0; runde < 4; runde++) {
    let ueberschuss = 0;
    const offen: number[] = [];
    for (const i of flexibel) {
      const e = ertragVon(raus[i]!.form);
      if (raus[i]!.woerter < e.min) { ueberschuss -= e.min - raus[i]!.woerter; raus[i]!.woerter = e.min; }
      else if (raus[i]!.woerter > e.max) { ueberschuss += raus[i]!.woerter - e.max; raus[i]!.woerter = e.max; }
      else offen.push(i);
    }
    if (!ueberschuss || !offen.length) break;
    const je = ueberschuss / offen.length;
    for (const i of offen) raus[i]!.woerter = Math.round(raus[i]!.woerter + je);
  }
  return raus;
}

/** Was die geplante Besetzung voraussichtlich liefert — gegen den Platz
 *  gehalten. Damit der Nutzer VOR dem Druck sieht, ob die Seite aufgeht. */
export function platzBilanz(auftraege: Auftrag[], spalten: number, seiten: number): {
  platz: number; erwartet: number; luecke: number;
} {
  const platz = woerterJeSeite(spalten) * Math.max(1, Math.min(8, Math.round(seiten) || 1));
  const erwartet = auftraege.reduce((a, x) => {
    const e = ertragVon(x.form);
    return a + Math.max(e.min, Math.min(e.max, x.woerter));
  }, 0);
  return { platz, erwartet, luecke: platz - erwartet };
}

// ── Gedächtnis über Ausgaben hinweg ─────────────────────────────────────────
// Innerhalb einer Ausgabe wird kein Kontext zweimal gezogen. Über AUSGABEN
// hinweg war das nicht so — und dort fällt es stärker auf: Zwei Zeitungen
// hintereinander mit derselben Schlagzeile sehen nicht nach Zufall aus,
// sondern nach Defekt.
//
// Der Weltwürfel begünstigt das systematisch. `worldFillContext` bevorzugt
// Figuren mit einem Spannungsvermerk, und zwar nicht als Neigung, sondern als
// harten Filter: Sobald EINE Figur „gejagt" oder „vermisst" heißt, kommen die
// übrigen gar nicht mehr an die Reihe. Steht dann nur eine solche Figur in der
// Welt, liefert der Würfel dauerhaft dieselbe — samt derselben Absicht, denn
// `whatFromStatus` leitet das Was aus genau diesem Vermerk ab.

export const KTX_KEY = "divergenz_autopilot_ktx_v1";
/** Wie viele zuletzt benutzte Kontexte gemieden werden. Dreißig sind rund
 *  sechs Ausgaben — weit genug, dass eine Wiederholung nicht auffällt, und eng
 *  genug, dass ein kleiner Vorrat nicht vollständig gesperrt wird. */
export const GEDAECHTNIS_TIEFE = 30;

/** Die Kennung eines Kontexts. Wann bleibt draußen: Dieselbe Figur am selben
 *  Ort mit derselben Absicht ist eine Wiederholung, auch wenn es diesmal im
 *  Frühjahr spielt. */
export function ktxSchluessel(c: { who?: string; where?: string; what?: string }): string {
  const n = (v?: string): string => (v || "").toLowerCase().replace(/\s+/g, " ").trim();
  return `${n(c.who)}|${n(c.where)}|${n(c.what)}`;
}

export function ladeGedaechtnis(): string[] {
  try {
    const r = JSON.parse(localStorage.getItem(KTX_KEY) || "[]") as unknown;
    return Array.isArray(r) ? r.filter((x): x is string => typeof x === "string") : [];
  } catch { return []; }
}

/** Schreibt benutzte Kontexte fort. Das Älteste fällt vorn heraus, Bekanntes
 *  rutscht ans Ende — sonst verfiele ein oft benutzter Kontext irgendwann aus
 *  dem Gedächtnis und käme sofort wieder. */
export function merkeGedaechtnis(alt: string[], neu: string[], tiefe = GEDAECHTNIS_TIEFE): string[] {
  const raus = alt.filter((k) => !neu.includes(k));
  raus.push(...neu.filter((k, i) => k && neu.indexOf(k) === i));
  return raus.length > tiefe ? raus.slice(raus.length - tiefe) : raus;
}

export function sichereGedaechtnis(liste: string[]): boolean {
  try { localStorage.setItem(KTX_KEY, JSON.stringify(liste)); return true; } catch { return false; }
}

/** Wie viele zuletzt benutzte WAS-Formulierungen zusätzlich gemieden werden.
 *
 *  Der ganze Schlüssel reicht nicht. Die Schlagzeile eines Berichts ist „Wer +
 *  Was" — steht dort zweimal dasselbe Was, sieht die Zeile gleich aus, auch
 *  wenn ein anderer Name davorsteht: „Eine Bibliothek will die Verfolger
 *  abschütteln", dann „Eine Klinik will die Verfolger abschütteln". Genau so
 *  gemeldet.
 *
 *  Flacher als das Gedächtnis für ganze Kontexte: Es gibt nur eine Handvoll
 *  Was-Formulierungen. Würden zu viele gesperrt, bliebe nichts übrig. */
export const WAS_TIEFE = 8;

/** Das Was aus einem Schlüssel. Der Schlüssel ist „wer|wo|was"; die Liste der
 *  zuletzt benutzten Was-Formulierungen wird daraus abgeleitet statt getrennt
 *  gespeichert — zwei Ablagen, die dasselbe meinen, laufen auseinander. */
export function wasAusSchluessel(k: string): string {
  const teile = (k || "").split("|");
  return teile.length >= 3 ? teile[2]! : "";
}

/** Die zuletzt benutzten Was-Formulierungen, jüngste zuletzt. */
export function letzteWas(gedaechtnis: string[], tiefe = WAS_TIEFE): Set<string> {
  const raus = new Set<string>();
  for (const k of gedaechtnis.slice(-tiefe)) {
    const w = wasAusSchluessel(k);
    if (w) raus.add(w);
  }
  return raus;
}

// ── Platzbedarf ─────────────────────────────────────────────────────────────
// Gemeldet: Leerstellen auf der Zeitungsseite. Die Vermutung war, der
// Textlängenregler werde nicht genutzt — er wird gesetzt, aber ZWEI FORMEN
// ignorieren ihn: `bericht` und `meldung` kehren in `buildStory` zurück, bevor
// `enforceWordTarget` läuft. Das steht dort mit gutem Grund (Kürzen würde einem
// Bericht Fakten wegnehmen), heißt aber: Ausgerechnet die beiden Formen, die
// der Autopilot am häufigsten setzt, richten sich nach keiner Vorgabe.
//
// Dazu kam, dass niemand ausgerechnet hat, wie viel Text die Seite überhaupt
// fasst. Die Wortzahlen waren geraten.

/** Wörter, die eine Seite ungefähr aufnimmt.
 *
 *  Aus der Geometrie: 264 mm Höhe abzüglich Kopf und Fußlinie ergibt rund
 *  226 mm Spaltenraum, bei 4,4 mm Zeilenhöhe etwa 51 Zeilen je Spalte. Die
 *  Spaltenbreite verschiebt nur, wie sich das auf Spalten verteilt — drei
 *  breite Spalten fassen ungefähr so viel wie vier schmale.
 *
 *  Bewusst eine RUNDE Zahl: Sie ist ein Startwert, der sich selbst korrigiert
 *  (siehe `neuerFaktor`). Sie auf drei Stellen auszurechnen täuschte eine
 *  Genauigkeit vor, die die Schriftgröße jederzeit widerlegt. */
export const WOERTER_JE_SEITE = 900;
/** Was Überschrift, Dachzeile und Abstand je Beitrag kosten — gerechnet in
 *  Wörtern, damit es sich mit dem Budget verrechnen lässt. */
export const OVERHEAD_JE_BEITRAG = 28;

/** Wie viele Wörter die Ausgabe insgesamt tragen soll.
 *
 *  `faktor` ist die Selbstkorrektur aus dem letzten Lauf: 1 heißt „Schätzung
 *  stimmte", 1,2 heißt „es passte mehr hinein als gedacht". */
export function platzBudget(seiten: number, anzahl: number, faktor = 1): number {
  const s = Math.max(1, Math.min(8, Math.round(seiten) || 1));
  const n = Math.max(1, Math.round(anzahl) || 1);
  const f = Math.max(0.4, Math.min(2.5, faktor || 1));
  return Math.max(120, Math.round(s * WOERTER_JE_SEITE * f - n * OVERHEAD_JE_BEITRAG));
}

/** Grenzen je Form. Ein Haiku mit 300 Wörtern ist keins mehr, und ein Bericht
 *  unter 120 Wörtern hat keinen Vorspann. Ohne diese Klammern würde die
 *  Verteilung die Formen zerstören, um das Budget zu treffen. */
export const LAENGEN_GRENZEN: Record<string, [number, number]> = {
  haiku: [12, 24], poem: [40, 160], reim: [40, 160], strang: [40, 200],
  meldung: [30, 90], bericht: [140, 620], prose: [70, 480],
};

/** Verteilt das Budget auf die Aufträge — im Verhältnis ihrer geplanten Längen,
 *  damit der Aufmacher Aufmacher bleibt und der Kasten Kasten.
 *
 *  Zwei Durchgänge: Erst proportional, dann werden die Werte in ihre
 *  Formgrenzen gezwungen und der Rest auf die verteilt, die noch Luft haben.
 *  Ohne den zweiten Durchgang bekäme ein Haiku bei großem Budget 300 Wörter
 *  und ein Bericht bei kleinem 40. */
export function verteileLaengen<T extends { form: string; woerter: number }>(
  auftraege: T[], budget: number,
): T[] {
  if (!auftraege.length) return [];
  const summe = auftraege.reduce((a, x) => a + Math.max(1, x.woerter), 0);
  const grenze = (f: string): [number, number] => LAENGEN_GRENZEN[f] || [40, 500];

  const erst = auftraege.map((a) => {
    const anteil = Math.max(1, a.woerter) / summe;
    const [min, max] = grenze(a.form);
    const roh = Math.round(budget * anteil);
    return { a, roh, min, max, wert: Math.max(min, Math.min(max, roh)) };
  });

  // Was durch die Klammern verloren ging oder zu viel wurde, wandert zu den
  // Beiträgen, die noch Luft nach oben bzw. unten haben.
  let rest = budget - erst.reduce((s2, x) => s2 + x.wert, 0);
  for (let runde = 0; runde < 4 && Math.abs(rest) > 5; runde++) {
    const offen = erst.filter((x) => (rest > 0 ? x.wert < x.max : x.wert > x.min));
    if (!offen.length) break;
    const je = rest / offen.length;
    for (const x of offen) {
      const neu = Math.max(x.min, Math.min(x.max, Math.round(x.wert + je)));
      rest -= neu - x.wert;
      x.wert = neu;
    }
  }
  return erst.map((x) => ({ ...x.a, woerter: x.wert }));
}

// ── Selbstkorrektur ─────────────────────────────────────────────────────────
// Die Schätzung oben ist geometrisch und kennt weder Schriftgröße noch
// Preset-Wortlängen. Statt sie feiner zu rechnen — was eine Genauigkeit
// vortäuschte, die es nicht gibt — lernt sie aus dem gemessenen Füllgrad des
// letzten Laufs. Der Setzer kennt ihn ohnehin.

export const KALIB_KEY = "divergenz_autopilot_kalib_v1";

/** Der neue Faktor aus dem gemessenen Füllgrad.
 *
 *  Gedämpft: Nur ein Drittel des Fehlers wird ausgeglichen. Ein voller
 *  Ausgleich schwingt — eine zu volle Seite führte zum Untermaß und umgekehrt,
 *  und die Ausgaben wechselten zwischen Überlauf und Leere. */
export function neuerFaktor(alt: number, fuellgradProzent: number): number {
  const a = Math.max(0.4, Math.min(2.5, alt || 1));
  const g = Math.max(1, Math.min(200, fuellgradProzent));
  // Ziel sind 96 %: knapp voll, aber ohne dass der Umbruch am Fuß kürzen muss.
  const soll = 96;
  const roh = a * (soll / g);
  return Math.max(0.4, Math.min(2.5, Math.round((a + (roh - a) / 3) * 1000) / 1000));
}

export function ladeFaktor(): number {
  try {
    const v = Number(JSON.parse(localStorage.getItem(KALIB_KEY) || "null"));
    return Number.isFinite(v) && v > 0 ? Math.max(0.4, Math.min(2.5, v)) : 1;
  } catch { return 1; }
}

export function sichereFaktor(f: number): void {
  try { localStorage.setItem(KALIB_KEY, JSON.stringify(f)); } catch { /* voll */ }
}

// ── Bericht auf Länge bringen ───────────────────────────────────────────────

/** Kürzt einen Bericht auf die Zielwortzahl, indem ABSÄTZE von hinten
 *  wegfallen.
 *
 *  Nicht mit `enforceWordTarget`: Das schneidet Sätze und nähme dem Bericht
 *  Fakten aus dem Zusammenhang — genau deshalb ist er dort ausgenommen. Ein
 *  Bericht ist aber als umgekehrte Pyramide gebaut, hinten steht das
 *  Unwichtigste. Absatzweise zu kürzen ist das Verfahren, für das er gemacht
 *  wurde; der Setzer tut am Spaltenfuß dasselbe.
 *
 *  Dachzeile und Schlagzeile (die ersten beiden Absätze) und der Faktenkasten
 *  bleiben immer stehen — ohne sie ist es kein Bericht mehr. */
export function kuerzeBericht(text: string, ziel: number): string {
  const abs = (text || "").split(/\n{2,}/).map((x) => x.trim()).filter(Boolean);
  if (abs.length < 4) return text;
  const zaehl = (s: string): number => (s.match(/\S+/g) || []).length;
  const kastenAb = abs.findIndex((x) => /^Faktenkasten\b/.test(x));
  const kasten = kastenAb >= 0 ? abs.slice(kastenAb) : [];
  const rumpf = kastenAb >= 0 ? abs.slice(0, kastenAb) : abs.slice();
  // Kopf: Dachzeile, Schlagzeile, Vorspann — darunter wird nicht gegangen.
  const kopf = rumpf.slice(0, 3);
  const koerper = rumpf.slice(3);
  const fest = [...kopf, ...kasten].reduce((a, x) => a + zaehl(x), 0);
  const behalten: string[] = [];
  let summe = fest;
  for (const a of koerper) {
    const w = zaehl(a);
    if (summe + w > ziel && behalten.length) break;
    behalten.push(a); summe += w;
  }
  return [...kopf, ...behalten, ...kasten].join("\n\n");
}
