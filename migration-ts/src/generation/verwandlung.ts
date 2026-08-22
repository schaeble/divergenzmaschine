// Motivverwandlung: Was aus einem Bild wird, wenn es wiederkehrt.
//
// Vorgeschlagen als Feld einer „Narrative DNA": „Telefon→Stille",
// „Katze→Schatten", „Regen→Nebel". Von allem, was so ein Format anbietet, ist
// das der kleinste Eingriff mit dem sichtbarsten Ergebnis — und der einzige,
// der reines MATERIAL ist statt einer Regel in Prosa. Eine Liste von Paaren
// kann man aufschreiben; „Ein Zufall erzeugt mindestens zwei neue Fragen" kann
// man nicht ausführen.
//
// Was hier passiert: Das erste Vorkommen bleibt stehen — es führt das Motiv
// ein. Jedes weitere wird verwandelt. Der Leser sieht dasselbe Ding zweimal,
// und beim zweiten Mal ist es etwas anderes geworden.
import { escapeRegExp } from "../text-utils";
import { guessGender } from "./declension";

export interface Verwandlung { von: string; nach: string }

/** Geschlecht des Grundworts. Mehrwortige Ziele („offene Frage") werden am
 *  letzten Wort bestimmt — im Deutschen trägt es das Genus. */
function geschlecht(w: string): "m" | "f" | "n" | undefined {
  const kern = (w || "").trim().split(/\s+/).pop() || "";
  return guessGender(kern.replace(/[^A-Za-zÄÖÜäöüß]/g, ""));
}

/** Warum ein Paar abgelehnt wurde — für die Oberfläche und den Prüfstand.
 *  Eine Ablehnung ohne Grund sieht aus wie ein Fehler. */
export function pruefePaar(roh: string): { ok: boolean; grund: string } {
  const m = String(roh).split(/\s*(?:→|->|>)\s*/);
  if (m.length !== 2) return { ok: false, grund: "kein Pfeil zwischen zwei Wörtern" };
  const von = m[0]!.trim(), nach = m[1]!.trim();
  if (!von || !nach) return { ok: false, grund: "eine Seite ist leer" };
  if (von.toLowerCase() === nach.toLowerCase()) return { ok: false, grund: "beide Seiten gleich" };
  const g1 = geschlecht(von), g2 = geschlecht(nach);
  if (!g1) return { ok: false, grund: `Geschlecht von „${von}“ unbekannt` };
  if (!g2) return { ok: false, grund: `Geschlecht von „${nach}“ unbekannt` };
  if (g1 !== g2) return { ok: false, grund: `verschiedenes Geschlecht (${g1} gegen ${g2})` };
  return { ok: true, grund: "" };
}

/** Zerlegt die Einträge einer Bank. Erlaubt sind „A→B", „A -> B" und „A > B" —
 *  der Pfeil ist auf mancher Tastatur eine Übung. */
export function leseVerwandlungen(roh: string[] | undefined): Verwandlung[] {
  const raus: Verwandlung[] = [];
  for (const z of roh || []) {
    const m = String(z).split(/\s*(?:→|->|>)\s*/);
    if (m.length !== 2) continue;
    const von = m[0]!.trim(), nach = m[1]!.trim();
    // Ein Paar ohne Ziel verwandelt nichts, und ein Wort in sich selbst zu
    // verwandeln ist ein aufwendiger Weg, nichts zu tun.
    if (!von || !nach || von.toLowerCase() === nach.toLowerCase()) continue;
    // BEIDE Wörter müssen dasselbe Geschlecht haben, und beide müssen bekannt
    // sein. Sonst steht im Text „das Stille", weil „Telefon" sächlich ist und
    // „Stille" weiblich — der Artikel davor wird ja nicht mitverwandelt.
    //
    // Den Artikel mitzuändern wäre möglich, aber nur halb: Aus „das" ließe sich
    // nicht ablesen, ob Nominativ oder Akkusativ gemeint war, und bei
    // maskulinen Zielen unterscheiden die sich („der" gegen „den"). Ein Paar,
    // das nur manchmal stimmt, ist schlechter als eines, das abgelehnt wird.
    const g1 = geschlecht(von), g2 = geschlecht(nach);
    if (!g1 || !g2 || g1 !== g2) continue;
    raus.push({ von, nach });
  }
  return raus;
}

/** Behält die Groß-/Kleinschreibung der Fundstelle bei. Ein Motiv am
 *  Satzanfang steht groß, mitten im Satz klein — das Ziel muss sich danach
 *  richten, sonst entsteht „Der telefon" oder „stille bleibt". */
function wieGefunden(gefunden: string, ziel: string): string {
  const grossAmAnfang = /^[A-ZÄÖÜ]/.test(gefunden);
  return grossAmAnfang
    ? ziel.charAt(0).toUpperCase() + ziel.slice(1)
    : ziel.charAt(0).toLowerCase() + ziel.slice(1);
}

/** Verwandelt jedes WEITERE Vorkommen eines Motivs.
 *
 *  Das erste bleibt: Ohne Einführung ist die Verwandlung keine, sondern nur ein
 *  anderes Wort. Gezählt wird über den ganzen Text, nicht je Absatz — ein Motiv
 *  kehrt über Absatzgrenzen hinweg wieder, das ist der Sinn der Sache. */
export function verwandleMotive(text: string, paare: Verwandlung[]): string {
  if (!text || !paare.length) return text;
  let t = text;
  for (const { von, nach } of paare) {
    let gesehen = 0;
    try {
      // Wortgrenzen aus dem deutschen Alphabet, nicht \b: Das ist in JavaScript
      // ASCII und sieht zwischen „F" und „ü" eine Grenze. Diese Falle hat in
      // diesem Programm schon zweimal zugeschlagen.
      const re = new RegExp(`(^|[^A-Za-zÄÖÜäöüß])(${escapeRegExp(von)})(?![A-Za-zÄÖÜäöüß])`, "gi");
      t = t.replace(re, (ganz: string, davor: string, wort: string) => {
        gesehen++;
        return gesehen === 1 ? ganz : davor + wieGefunden(wort, nach);
      });
    } catch { /* ein unbrauchbares Paar überspringt seine Verwandlung */ }
  }
  return t;
}

/** Wie oft hat die Verwandlung gegriffen? Für Prüfstand und Messung — eine
 *  Änderung, die sich nicht zählen lässt, lässt sich nicht belegen. */
export function zaehleVerwandlungen(vorher: string, nachher: string, paare: Verwandlung[]): number {
  let n = 0;
  for (const { nach } of paare) {
    const zaehl = (s: string): number => {
      try {
        const re = new RegExp(`(^|[^A-Za-zÄÖÜäöüß])${escapeRegExp(nach)}(?![A-Za-zÄÖÜäöüß])`, "gi");
        return (s.match(re) || []).length;
      } catch { return 0; }
    };
    n += Math.max(0, zaehl(nachher) - zaehl(vorher));
  }
  return n;
}
