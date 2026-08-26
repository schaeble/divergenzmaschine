// Ein Titel über dem erzeugten Text — grammatisch sicher, aus dem Inhalt.
//
// Ein Titel ist im Deutschen fast immer eine NOMINALPHRASE („Ein Museum, das
// seine Exponate verliert"), seltener ein ganzer Satz. Die Maschine soll
// keine neue Grammatik erfinden, deshalb nimmt sie, was sie sicher hat — in
// dieser Reihenfolge:
//
//   1. Eine Bildzeile AUS DEM TEXT: ein Satz, der mit Artikel beginnt, kein
//      eigenes Prädikat hat und höchstens einen Relativsatz nachschiebt.
//      Solche Zeilen streut die Verdichtung am Peak ein; sie sind schon
//      Titel. Bevorzugt wird die, die ein Inhaltswort mit Wer oder Was
//      teilt — „gemäß Inhalt", nicht die erstbeste.
//   2. Wer + Was aus dem Kontext, wenn das Was verb-geführt ist („Der Bote
//      bringt, was niemand hören will") oder selbst ein Satz ist. Ein Was,
//      das eine Nominalphrase ist, wird mit „und" angehängt — „Der Bote und
//      eine Logik, die nur im Tanz erlaubt ist" ist ein Titel, „Der Bote
//      eine Logik" keiner.
//   3. Wann und Wo: „Im Jahr 2041, in einer Kaserne".
//
// Gekürzt wird an einer FUGE (Komma, Gedankenstrich, Doppelpunkt), nie
// mitten im Satzglied — dieselbe Regel wie in der Zeitung (ueberschriftVon).
// Bericht und Meldung bekommen keinen Titel: Der Bericht bringt seine
// Schlagzeile mit, die Meldung ist zu kurz für eine zweite Zeile.
import { extractLeadVerb, looksLikeFullClause, wirktFinit, looksLikeInfinitive } from "./wordcls";
import { VERB_CONJ } from "./verbconj.data";
import { normWho, normWhere, normWhen } from "./ctxnorm";
import { clean } from "../text-utils";

export interface TitelKontext { who?: string; where?: string; when?: string; what?: string; }

const MAX = 60;
const cap = (s: string): string => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);
const ohnePunkt = (s: string): string => s.replace(/[.!?…]+$/, "").trim();

/** Bildzeile: Artikel/Zahlwort, Nomen, höchstens ein Relativsatz — kein Prädikat davor. */
const BILDZEILE = /^(Ein|Eine|Der|Die|Das|Zwei|Drei|Kein|Keine|Jede|Jeder|Jedes|Mein|Meine)\s+[A-ZÄÖÜ][a-zäöüß-]+(?:\s+[A-Za-zÄÖÜäöüß-]+){0,5}(?:,\s+(?:der|die|das|den|dem|deren|dessen|wo|worin)\s+[^,.;:!?]{3,60})?$/;

const STOP = new Set(["der", "die", "das", "den", "dem", "des", "ein", "eine", "einen", "einem", "einer", "und", "oder",
  "aber", "in", "im", "an", "am", "auf", "mit", "von", "vom", "zu", "zur", "zum", "nicht", "nur", "noch", "wie", "als",
  "was", "wer", "wo", "wann", "sich", "ist", "sind", "war", "hat", "wird", "kein", "keine", "jemand", "niemand", "es"]);
const inhaltswoerter = (s: string): Set<string> =>
  new Set((s.toLowerCase().match(/[a-zäöüß-]{3,}/g) || []).filter((w) => !STOP.has(w)));

/** Auf Titellänge bringen: ganz, oder an einer Fuge gekürzt. */
export function kuerzeTitel(s: string): string {
  const t = ohnePunkt(clean(s));
  if (t.length <= MAX) return t;
  const stumpf = t.slice(0, MAX - 3);
  const fuge = Math.max(stumpf.lastIndexOf(", "), stumpf.lastIndexOf(" — "), stumpf.lastIndexOf(": "), stumpf.lastIndexOf("; "));
  const rumpf = fuge > 20 ? stumpf.slice(0, fuge) : stumpf.replace(/\s+\S*$/, "");
  return rumpf.replace(/[,;:—–\s]+$/, "") + " …";
}

const FINIT = /^(ist|sind|war|waren|hat|hatte|wird|wurde|kann|muss|will|soll|darf|mag|bleibt|kommt|geht|steht|liegt|fehlt|zählt|trägt|gibt|weiß)$/;
/** Steht im Kopf der Zeile (vor dem Relativsatz) ein Prädikat? Dann ist es
 *  ein Satz („Die Tür ist verschlossen"), kein Titel. */
const hatPraedikat = (kopf: string): boolean =>
  kopf.split(/\s+/).slice(1).some((w) => FINIT.test(w) || !!VERB_CONJ[w] || wirktFinit(w));

/** Bildzeilen aus dem Text — Kandidaten für einen Titel, in Textreihenfolge.
 *  Mindestens drei Wörter: „Ein Siegel" sagt nichts. */
export function bildzeilen(text: string): string[] {
  return (text || "").replace(/\s+/g, " ").split(/(?<=[.!?…])\s+/)
    .map((s) => ohnePunkt(s.trim()))
    .filter((s) => BILDZEILE.test(s) && s.length <= MAX
      && (s.match(/\S+/g) || []).length >= 3
      && !hatPraedikat(s.split(",")[0]!));
}

/** Wer + Was als Titel, grammatisch nach der Art des Was. Leer, wenn beides fehlt. */
export function titelAusKontext(ctx: TitelKontext): string {
  const who = normWho(clean(ctx.who || "")).split(",")[0]!.trim();
  const what = clean(ctx.what || "");
  if (who && what) {
    const lv = extractLeadVerb(what);
    if (lv.verb) return kuerzeTitel(`${cap(who)} ${lv.verb}${lv.rest.startsWith(",") ? "" : " "}${lv.rest}`);
    if (lv.isInfinitiveLed) return kuerzeTitel(`${cap(who)} will ${lv.rest}`);
    // Ein Vorhaben mit dem Infinitiv am Ende („einen Schlüssel verlieren"):
    // „Ein Wachmann will einen Schlüssel verlieren" — nicht „und".
    const letztes = (what.match(/[a-zäöüß-]+$/) || [""])[0]!;
    if (/^[a-zäöüß]/.test(letztes) && looksLikeInfinitive(letztes) && !/,/.test(what)) return kuerzeTitel(`${cap(who)} will ${what}`);
    // Ein Satz ist nur, was VOR dem ersten Komma ein Prädikat hat: „eine
    // Logik, die nur im Tanz erlaubt ist" trägt ihr „ist" im Relativsatz und
    // ist eine Nominalphrase.
    if (looksLikeFullClause(null, what.split(",")[0]!)) return kuerzeTitel(cap(what));
    return kuerzeTitel(`${cap(who)} und ${what}`);
  }
  if (who) return kuerzeTitel(cap(who));
  if (what) {
    const lv = extractLeadVerb(what);
    if (!lv.verb && !lv.isInfinitiveLed) return kuerzeTitel(cap(what));
  }
  const when = normWhen(clean(ctx.when || ""));
  const where = normWhere(clean(ctx.where || ""));
  if (when && where) return kuerzeTitel(`${cap(when)}, ${where}`);
  return kuerzeTitel(cap(where || when || ""));
}

/** Der Titel für einen erzeugten Text. Leer für Formen, die keinen brauchen. */
export function titelFuer(text: string, ctx: TitelKontext, form = "prose"): string {
  if (form === "bericht" || form === "meldung") return "";
  const zeilen = bildzeilen(text);
  if (zeilen.length) {
    const bezug = inhaltswoerter(`${ctx.who || ""} ${ctx.what || ""}`);
    const passend = zeilen.find((z) => [...inhaltswoerter(z)].some((w) => bezug.has(w)));
    return passend || zeilen[0]!;
  }
  return titelAusKontext(ctx) || "Ohne Titel";
}
