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
export const BEITRAEGE_MAX = 7;
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
): Auftrag[] {
  const n = Math.max(BEITRAEGE_MIN, Math.min(BEITRAEGE_MAX, Math.round(anzahl) || BEITRAEGE_VORGABE));
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
