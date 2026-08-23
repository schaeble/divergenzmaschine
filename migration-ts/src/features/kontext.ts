// Kontextübernahme: welcher der vier W-Werte darf überschrieben werden?
//
// Die Regel klang zu einfach, um sie auszulagern — bis die Frage kam, ob die
// Schlösser beim „Alles würfeln" überhaupt gelten. Die Antwort stand nur im
// Klickzusammenhang eines 1600-Zeilen-Moduls und ließ sich nur durch Lesen
// beantworten. Jetzt steht sie hier und wird geprüft.
//
// Zwei Regeln, beide bewusst:
//   · Ein GESPERRTES Feld bleibt, wie es ist. Sonst wäre das Schloss Zierrat.
//   · Ein LEERER Vorschlag überschreibt nichts. Die Welt liefert nicht immer
//     alle vier Werte; ein leeres Feld wäre schlechter als das alte.

export type W4 = "where" | "when" | "who" | "what";
export const W4_FELDER: W4[] = ["where", "when", "who", "what"];

export interface Feld { id: string; wert: string }

/** Rechnet aus: Was soll in den vier Feldern stehen?
 *
 *  Rein — kein DOM, kein Schreiben. Der Aufrufer setzt die Werte. */
export function uebernehmeKontext(
  felder: Record<W4, Feld>,
  vorschlag: Partial<Record<W4, string>>,
  gesperrt: (id: string) => boolean,
): Record<W4, string> {
  const raus = {} as Record<W4, string>;
  for (const f of W4_FELDER) {
    const alt = felder[f].wert;
    const neu = (vorschlag[f] || "").trim();
    raus[f] = !neu || gesperrt(felder[f].id) ? alt : neu;
  }
  return raus;
}

/** Welche Felder hat die Übernahme wirklich verändert? Für die Anzeige — und
 *  damit „nichts passiert" von „nichts zu tun" unterscheidbar bleibt. */
export function geaendert(
  felder: Record<W4, Feld>,
  neu: Record<W4, string>,
): W4[] {
  return W4_FELDER.filter((f) => felder[f].wert !== neu[f]);
}

// ── Quellen für „Alles würfeln" ────────────────────────────────────────────
// Gefragt: „Wird bei Alles würfeln auch Wiki und Abschrift mitgenommen?" Bis
// 4.263.0 nicht — der Knopf zog die vier W allein aus der Welt, und die beiden
// Vorräte lagen daneben, jeder hinter einer eigenen Taste. Ein Knopf, der
// „alles" heißt und eine von drei Quellen benutzt, verspricht zu viel.
//
// Jetzt wird die Quelle mitgewürfelt. Die Welt ist immer dabei: Sie legt sich
// selbst an und liefert auch beim ersten Start etwas. Wiki und Abschrift kommen
// nur mit gefülltem Vorrat in den Topf — eine leere Quelle zu ziehen hieße, dass
// der Knopf mal wirkt und mal nicht, ohne dass man sähe, warum.

// „ideen" kam in 4.297.0 dazu, und der Einwand dazu war berechtigt: „Der
// Ideen-Knopf könnte doch gleichwertig neben der Welt stehen. Die Welt speist
// auch das Studio." Genau so ist es. Eine Prämisse trägt Wo/Wann/Wer/Was wie
// jede andere Quelle — der Weg „→ Studio" übergibt seit jeher nichts anderes.
// Dass der Reiter Ideen daneben noch etwas anderes tut (Prämissensätze
// formulieren), macht ihn nicht zu einer anderen Art von Quelle.
// „omni" kam in 4.299.0 dazu: die Omnikognition aus dem Reiter Welt, gewünscht
// als eigene Quelle. Sie liefert nicht nur die vier W, sondern die passenden
// Stilregler dazu — ein Wesen wahrzunehmen ist eine Haltung, keine Ortsangabe.
export const QUELLEN = ["welt", "wiki", "abschrift", "thema", "ideen", "omni"] as const;
export type Quelle = typeof QUELLEN[number];
export const QUELLE_LABEL: Record<Quelle, string> = {
  welt: "Welt", wiki: "Wiki", abschrift: "Abschrift", thema: "Thema", ideen: "Ideen", omni: "Wahrnehmung",
};

/** Welche Quellen stehen bereit? */
export function offeneQuellen(wikiFunde: number, bildFunde: number, themaFunde = 0): Quelle[] {
  // Welt, Ideen und Wahrnehmung sind immer dabei: Alle drei liefern auch beim
  // ersten Start etwas (die Welt legt sich selbst an, die beiden anderen haben
  // eingebaute Profile).
  const raus: Quelle[] = ["welt", "ideen", "omni"];
  if (wikiFunde > 0) raus.push("wiki");
  if (bildFunde > 0) raus.push("abschrift");
  if (themaFunde > 0) raus.push("thema");
  return raus;
}

/** Zieht eine davon. Der Zufall ist ein Parameter, damit die Prüfung ihn
 *  festhalten kann — sonst ließe sich „jede Quelle kommt vor" nicht messen. */
export function ziehQuelle(offen: Quelle[], zufall: () => number = Math.random): Quelle {
  if (!offen.length) return "welt";
  return offen[Math.min(offen.length - 1, Math.floor(zufall() * offen.length))]!;
}
