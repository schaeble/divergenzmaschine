// Atomisierung — lange Bausteine werden zu Atomen.
//
// Gemeldet: Manche Presets geben sehr lange Passagen wieder. Die eingebauten
// Presets sind kurz (Median 7, Höchstwert 14 Wörter), aber Presets aus Text,
// Sammler-Funde, KI-Erzählungen und Erzählerbank-Bögen bringen Sätze bis 22
// Wörter und mehr — und der Zusammenbau setzt Bausteine ganz. Ein Baustein von
// 20 Wörtern ist kein Atom, sondern eine Passage; der Text wird zum Zitat.
//
// Hier wird jeder Baustein vor dem Pool auf die Atomgröße gebracht (Stellschraube
// „Atomgröße" in der Werkstatt, Vorgabe 14 Wörter, 0 = aus), an Stellen, die
// beide Seiten tragfähig lassen:
//
//   1. Gedankenstrich, Semikolon, Doppelpunkt: Beide Seiten werden eigene Atome.
//   2. „, und" / „, aber" / „, doch" / „, denn" zwischen zwei Hauptsätzen (beide
//      mit finitem Verb): Beide werden eigene Atome, die Konjunktion fällt.
//   3. Ein NACHGESTELLTER Nebensatz (Relativsatz, dass/weil/wenn/als/während/
//      ohne …) wird abgeschnitten, wenn der Hauptsatz davor allein steht
//      (Verb oder Nominalphrase, mindestens vier Wörter). Der Nebensatz ist
//      kein Atom und fällt weg.
//   4. Was danach noch zu lang ist, bleibt ganz — aber der Zusammenbau zieht
//      es seltener (Abzug je überzähligem Wort, siehe assemble.ts).
import { hatFinitesVerb } from "./derive";

const wc = (s: string): number => (s.match(/[A-Za-zÄÖÜäöüß]+/g) || []).length;
const trimSatz = (s: string): string => s.trim().replace(/^[,;:—–\s]+|[,;:—–\s]+$/g, "").trim();

const NP_KOPF = /^(der|die|das|ein|eine|einen|einem|einer|kein|keine|zwei|drei|manche|viele|jede[rs]?|alle)\b/i;
const NEBENSATZ = /,\s+(der|die|das|dem|den|dessen|deren|welche[rsmn]?|dass|weil|wenn|als|während|obwohl|nachdem|bevor|sobald|solange|seit|seitdem|damit|sodass|ohne|um|statt|anstatt|wo|worin|was|wer|wie|ob|falls|indem)\b[^,]*$/i;

/** Steht dieser Teil allein? Finites Verb oder eine Nominalphrase mit Kopf. */
const tragfaehig = (s: string): boolean => wc(s) >= 3 && (hatFinitesVerb(s) || NP_KOPF.test(s));

/** Zerlegt einen Baustein in Atome von höchstens `max` Wörtern, soweit es
 *  tragfähig geht. `max` 0 = aus (der Baustein bleibt, wie er ist). */
export function atomisiere(text: string, max: number): string[] {
  const t = trimSatz(text || "");
  if (!t) return [];
  if (!max || max < 6 || wc(t) <= max) return [t];

  // 1. Harte Fugen — jede Seite eigenständig weiter zerlegen.
  const harte = t.split(/\s*(?:—|–|;|:)\s+/).map(trimSatz).filter((x) => wc(x) >= 3);
  if (harte.length > 1) return harte.flatMap((x) => atomisiere(x, max));

  // 2. Zwei Hauptsätze, verbunden mit Konjunktion nach Komma.
  const koord = t.match(/^(.+?),\s+(und|aber|doch|denn|sondern)\s+(.+)$/i);
  if (koord && hatFinitesVerb(koord[1]!) && hatFinitesVerb(koord[3]!) && wc(koord[1]!) >= 3 && wc(koord[3]!) >= 3)
    return [...atomisiere(koord[1]!, max), ...atomisiere(koord[3]!, max)];

  // 3. Nachgestellter Nebensatz: Hauptsatz behalten, Nebensatz fällt.
  const ns = t.match(NEBENSATZ);
  if (ns && ns.index !== undefined) {
    const haupt = trimSatz(t.slice(0, ns.index));
    if (tragfaehig(haupt) && wc(haupt) >= 4) return atomisiere(haupt, max);
  }

  // 4. Bleibt lang — ganz lassen, der Abzug beim Ziehen übernimmt.
  return [t];
}

/** Wie viele Wörter ein Atom über der Größe liegt — für den Abzug beim Ziehen. */
export function ueberlaenge(text: string, max: number): number {
  if (!max || max < 6) return 0;
  return Math.max(0, wc(text) - max);
}
