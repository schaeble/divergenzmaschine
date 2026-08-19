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

export type Quelle = "vorrat" | "bild" | "wuerfel";

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
  // REIHUM statt zufällig. Beim Ziehen kam es regelmäßig vor, dass alle
  // Beiträge einer Ausgabe aus derselben Quelle stammten — und wenn der
  // Bildvorrat gerade aus dreissig Tempelfotos besteht, handelt die ganze
  // Zeitung von Tempeln. Reihum ist keine Geschmacksfrage, sondern der
  // Unterschied zwischen einer Seite und einer Wiederholung.
  let zaehler = 0;
  const naechsteQuelle = (): Quelle => quellen[zaehler++ % quellen.length]!;

  const auftraege: Auftrag[] = [];
  // 1 · Der Aufmacher. Immer ein Bericht: Er ist die einzige Form, die von sich
  // aus Überschrift, Vorspann und Faktenkasten mitbringt.
  auftraege.push({ form: "bericht" as FormKind, woerter: 260 + Math.floor(rnd() * 120), quelle: naechsteQuelle(), was: "Aufmacher" });
  // 2 · Ein Kasten. Kurz, und die Kurzform trägt die Seite optisch.
  auftraege.push({ form: "meldung" as FormKind, woerter: 70 + Math.floor(rnd() * 40), quelle: naechsteQuelle(), was: "Kasten" });
  // 3 · Der Rest gemischt, damit die Längen auseinanderlaufen.
  const rest: FormKind[] = ["bericht", "prose", "meldung", "prose", "poem"] as FormKind[];
  for (let i = 2; i < n; i++) {
    const form = rest[(i - 2) % rest.length]!;
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
    tone: w(["neutral", "kalt", "warm", "ironisch", "duester"]),
    varLevel: w(["mid", "high"]),
    structure: w(["linear", "ringkomposition", "montage"]),
    mode: w(["bureau", "tech", "body", "myth", "absurd", "post"]),
    perspective: w(["auto", "er", "sie", "ich", "wir"]),
    rhythm: w(["auto", "kurz", "lang", "wechsel"]),
    markovMode: "on",
    disruptor: w(["off", "mild", "stark"]),
    archetypeA: "auto", archetypeB: "auto",
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
