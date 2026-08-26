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
export function kuerzeTitel(s: string, max = MAX): string {
  const t = ohnePunkt(clean(s));
  if (t.length <= max) return t;
  const stumpf = t.slice(0, max - 3);
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
export function titelAusKontext(ctx: TitelKontext, max = MAX): string {
  const who = normWho(clean(ctx.who || "")).split(",")[0]!.trim();
  const what = clean(ctx.what || "");
  if (who && what) {
    const lv = extractLeadVerb(what);
    if (lv.verb) return kuerzeTitel(`${cap(who)} ${lv.verb}${lv.rest.startsWith(",") ? "" : " "}${lv.rest}`, max);
    if (lv.isInfinitiveLed) return kuerzeTitel(`${cap(who)} will ${lv.rest}`, max);
    // Ein Vorhaben mit dem Infinitiv am Ende („einen Schlüssel verlieren"):
    // „Ein Wachmann will einen Schlüssel verlieren" — nicht „und".
    const letztes = (what.match(/[a-zäöüß-]+$/) || [""])[0]!;
    if (/^[a-zäöüß]/.test(letztes) && looksLikeInfinitive(letztes) && !/,/.test(what)) return kuerzeTitel(`${cap(who)} will ${what}`, max);
    // Ein Satz ist nur, was VOR dem ersten Komma ein Prädikat hat: „eine
    // Logik, die nur im Tanz erlaubt ist" trägt ihr „ist" im Relativsatz und
    // ist eine Nominalphrase.
    if (looksLikeFullClause(null, what.split(",")[0]!)) return kuerzeTitel(cap(what), max);
    return kuerzeTitel(`${cap(who)} und ${what}`, max);
  }
  if (who) return kuerzeTitel(cap(who), max);
  if (what) {
    const lv = extractLeadVerb(what);
    if (!lv.verb && !lv.isInfinitiveLed) return kuerzeTitel(cap(what), max);
  }
  const when = normWhen(clean(ctx.when || ""));
  const where = normWhere(clean(ctx.where || ""));
  if (when && where) return kuerzeTitel(`${cap(when)}, ${where}`, max);
  return kuerzeTitel(cap(where || when || ""), max);
}

// ── Ein Wort für das Haiku ──────────────────────────────────────────────────
// Vorgabe: Das Haiku bekommt EIN Wort. Genommen wird ein Nomen aus dem Text —
// bevorzugt eines, das Wer, Was oder Wo nennt (der Bezug), sonst das letzte
// Nomen: Die dritte Zeile trägt im Haiku die Auflösung. Ein Nomen ist hier,
// was groß beginnt und nicht am Zeilen- oder Satzanfang steht; die Anfänge
// sind als Rückfall erlaubt, wenn sonst nichts bleibt.
const KEIN_NOMEN = new Set(["ein", "eine", "einen", "einem", "einer", "der", "die", "das", "den", "dem", "des", "und",
  "im", "am", "in", "an", "auf", "wo", "was", "wer", "wie", "es", "ich", "du", "er", "sie", "wir", "man", "kein", "keine",
  "noch", "nur", "dann", "dort", "hier", "jetzt", "nichts", "alles", "etwas", "jemand", "niemand"]);
export function einWort(text: string, ctx: TitelKontext): string {
  const t = (text || "").replace(/\s+/g, " ").trim();
  const bezug = inhaltswoerter(`${ctx.who || ""} ${ctx.what || ""} ${ctx.where || ""}`);
  const nomen: string[] = [];
  const anfaenge: string[] = [];
  const re = /(^|[.!?…\n]\s*|\s)([A-ZÄÖÜ][a-zäöüß-]{2,})/g;
  let m: RegExpExecArray | null;
  const roh = (text || "").trim();
  while ((m = re.exec(roh))) {
    const w = m[2]!.replace(/-$/, "");
    if (KEIN_NOMEN.has(w.toLowerCase())) continue;
    (m[1] === " " ? nomen : anfaenge).push(w);
  }
  const alle = [...nomen, ...anfaenge];
  const passend = alle.find((w) => bezug.has(w.toLowerCase()) || [...bezug].some((b) => b.length >= 5 && w.toLowerCase().includes(b)));
  if (passend) return passend;
  if (nomen.length) return nomen[nomen.length - 1]!;
  if (anfaenge.length) return anfaenge[anfaenge.length - 1]!;
  // Nichts im Text — dann das erste Nomen aus Wer, Was oder Wo.
  const ausCtx = (`${ctx.who || ""} ${ctx.what || ""} ${ctx.where || ""}`.match(/\b[A-ZÄÖÜ][a-zäöüß-]{2,}/g) || [])
    .find((w) => !KEIN_NOMEN.has(w.toLowerCase()));
  return ausCtx || (t ? "Haiku" : "");
}

// ── Nüchtern für den Bericht ────────────────────────────────────────────────
// Vorgabe: Der Bericht bekommt einen nüchternen Titel. Keine Bildzeile, kein
// Bild aus dem Text — Wer und Was in Zeitungskonvention: ohne Artikel am
// Anfang, ohne Auslassung. Dieselbe Regel wie die Schlagzeile des Berichts;
// eine Quelle der Wahrheit, nicht zwei Fassungen derselben Zeile.
export function nuechternerTitel(ctx: TitelKontext): string {
  const roh = titelAusKontext(ctx, 200);
  if (!roh) return "";
  const t = roh.replace(/^(Der|Die|Das|Ein|Eine)\s+(?=[A-ZÄÖÜ])/, "");
  if (t.length <= MAX) return t;
  // Zu lang: an einer Fuge enden, ohne Auslassungszeichen — eine Schlagzeile
  // hat keine drei Punkte. Ohne Fuge bleibt die Zeile ganz; lieber lang als
  // abgehackt.
  const stumpf = t.slice(0, MAX);
  const fuge = Math.max(stumpf.lastIndexOf(", "), stumpf.lastIndexOf(" — "), stumpf.lastIndexOf(" und "), stumpf.lastIndexOf(": "));
  return fuge > 20 ? stumpf.slice(0, fuge).replace(/[,;:—–\s]+$/, "") : t;
}

/** Alle Nomen eines Haikus in der Reihenfolge, in der einWort sie vorzieht. */
function haikuKandidaten(text: string, ctx: TitelKontext): string[] {
  const erstes = einWort(text, ctx);
  const alle = ((text || "").match(/[A-ZÄÖÜ][a-zäöüß-]{2,}/g) || [])
    .map((w) => w.replace(/-$/, "")).filter((w) => !KEIN_NOMEN.has(w.toLowerCase()));
  return [...new Set([erstes, ...alle.reverse()])].filter(Boolean);
}

/** Nüchterne Varianten für den Bericht: Wer + Was, davor Ort oder Zeit als
 *  Marke — so wechselt der Titel, ohne ein Bild zu erfinden. */
function berichtKandidaten(ctx: TitelKontext): string[] {
  const kern = nuechternerTitel(ctx);
  if (!kern) return ["Bericht"];
  const ort = clean(ctx.where || "").split(",")[0]!.replace(/^(in|im|am|an|auf|bei|vor|hinter|unter|über)\s+(der|dem|den|einer|einem)?\s*/i, "").trim();
  const zeit = clean(ctx.when || "");
  const out = [kern];
  if (ort && (kern.length + ort.length) < MAX + 10) out.push(`${cap(ort)}: ${kern}`);
  if (zeit && (kern.length + zeit.length) < MAX + 10) out.push(`${cap(zeit)}: ${kern}`);
  return out;
}

/** Alle Kandidaten für einen Titel, beste zuerst. Leer für die Meldung. */
export function titelKandidaten(text: string, ctx: TitelKontext, form = "prose"): string[] {
  if (form === "meldung") return [];
  if (form === "haiku") return haikuKandidaten(text, ctx);
  if (form === "bericht") return berichtKandidaten(ctx);
  const zeilen = bildzeilen(text);
  const bezug = inhaltswoerter(`${ctx.who || ""} ${ctx.what || ""}`);
  const passend = zeilen.filter((z) => [...inhaltswoerter(z)].some((w) => bezug.has(w)));
  const uebrige = zeilen.filter((z) => !passend.includes(z));
  const kontext = titelAusKontext(ctx);
  const ortzeit = (ctx.when && ctx.where) ? titelAusKontext({ when: ctx.when, where: ctx.where }) : "";
  return [...new Set([...passend, ...uebrige, kontext, ortzeit].filter(Boolean))];
}

/** Der Titel für einen erzeugten Text. Drei Formen haben eigene Regeln:
 *  Haiku ein Wort, Bericht nüchtern, Reim frei (wie Prosa). Die Meldung
 *  bekommt keinen — sie ist zu kurz für eine zweite Zeile.
 *
 *  `gesehen`: zuletzt vergebene Titel. Gemeldet: Bei gleicher Einstellung
 *  wiederholte sich der Titel, weil Wer + Was fest sind und die erste
 *  Bildzeile immer dieselbe war. Jetzt gewinnt der beste Kandidat, der noch
 *  nicht vergeben ist; sind alle vergeben, der am längsten zurückliegende. */
export function titelFuer(text: string, ctx: TitelKontext, form = "prose", gesehen: readonly string[] = []): string {
  const k = titelKandidaten(text, ctx, form);
  if (!k.length) return form === "meldung" ? "" : "Ohne Titel";
  const frisch = k.find((t) => !gesehen.includes(t));
  if (frisch) return frisch;
  // Alle vergeben: der, dessen letzte Verwendung am weitesten zurückliegt.
  return k.slice().sort((a, b) => gesehen.lastIndexOf(a) - gesehen.lastIndexOf(b))[0]!;
}
