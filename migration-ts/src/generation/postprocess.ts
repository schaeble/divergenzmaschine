// Nachbearbeitung des generierten Textes: Kohärenz-Schliff + Reparatur.
// Hinweis: Ton-Einfärbung und Sprachschliff (polishGerman) sind bewusst
// noch nicht portiert (Phase 4) — hier steckt der Kern der Bereinigung.
import type { GenInput } from "../types";
import { looksLikeFullClause } from "./wordcls";
import { escapeRegExp, splitSentences, pick } from "../text-utils";
import { coherenceWords } from "./nlp";
import { TONE_DATA } from "./tone.data";
import { loadKnobs } from "../features/knobs";
import { applyToneRegister } from "./tone.shape";
import { insertToneFlavor } from "./beats";
import { polishGerman } from "./polish";
import { applySatzlaenge, entferneDubletten, OBJEKT_KOPF_RE } from "./shape";
import { hatFinitesVerb } from "../atoms/derive";
import { personKopf, splitSpeakers } from "./wordcls";
import { normWho } from "./ctxnorm";
import { loadDramaData } from "./dramaturgie";

type Input = Partial<GenInput>;

// WAECHTER-OK: bewusste Teilmenge. Das sind die Formen, die ZEILENWEISE
// gesetzt werden — Vers, Dialog, Shotliste. Sie lässt sich aus FORM_OPTS nicht
// ableiten, weil dort nur steht, WELCHE Formen es gibt, nicht welche in Zeilen
// stehen. Kommt eine neue Zeilenform dazu, gehört sie hier ausdrücklich
// eingetragen; genau deshalb steht sie hier und nicht als Filter.
const LINE_FORMS = new Set(["script", "video", "strang", "reim", "haiku", "poem"]);
const isLineForm = (input?: Input): boolean =>
  !!input && !!input.form && LINE_FORMS.has(input.form);

/** Doppelte Abstaende einebnen, OHNE die Zeilenstruktur zu zerstoeren.
 *  Vorher stand hier /\s{2,}/ -> " ". Das trifft auch "\n\n": Die Absaetze der
 *  Prosa und die Zeilen von Multi-Shot, Prosagedicht und Vers wurden am Ende der
 *  Nachbearbeitung zu einem einzigen Block plattgewalzt - gemessen hatte jede
 *  Form genau eine Zeile. paragraphize() lief also, und der Schritt danach nahm
 *  sein Ergebnis wieder zurueck. */
function glaetten(t: string): string {
  return t
    .replace(/[ \t]{2,}/g, " ")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]+([,.;:!?])/g, "$1")
    .trim();
}

/** Entfernt abgebrochene und themenfremde Sätze (semantische Gewichtung). */
/** Ist der Satz mitten im Wort abgebrochen?
 *
 *  Die erste Fassung fragte nur: „Endet er auf einem Funktionswort?" — und
 *  loeschte damit 73 tadellose Saetze aus den Presets, gemessen 3 Prozent aller
 *  Bank-Saetze bis zwoelf Woerter: „Die Stadt springt mich an.", „ein Blick loest
 *  Panik aus", „Und das Meer bleibt, wie es ist." Auch der Rahmensatz der
 *  Objektperspektive verschwand so („… und zaehle mit.").
 *
 *  Deshalb zwei Klassen. Artikel und Konjunktionen koennen einen deutschen Satz
 *  NIE beenden — dort bleibt es beim Verwerfen. Trennbare Praefixe und die
 *  Kopula koennen es sehr wohl; sie gelten nur als Bruchstueck, wenn im Satz
 *  ueberhaupt kein finites Verb steht. */
const ABGESCHNITTEN = /(^|\s)(eine|einem|einen|einer|eines|der|die|dem|den|des|und|oder|aber|wie|als|im|am|bei|für|ohne)$/i;
// „ein" und „das" stehen bewusst hier und nicht oben: „Der Wartende steigt doch
// ein." ist ein trennbares Praefix, „Sag ehrlich, fuehlst du das?" ein
// Demonstrativpronomen. Als Artikel koennen sie nicht am Satzende stehen — der
// Unterschied ist das finite Verb.
const NUR_OHNE_VERB = /(^|\s)(mit|an|auf|zu|vor|nach|aus|ist|sind|wird|ein|das)$/i;
export function istAbgeschnitten(bare: string): boolean {
  if (!bare || bare.split(/\s+/).length > 12) return false;
  if (ABGESCHNITTEN.test(bare)) return true;
  return NUR_OHNE_VERB.test(bare) && !hatFinitesVerb(bare);
}

/** Setzt das schließende Komma hinter den Relativsatz der Figur. */
export function schliesseFigurenkomma(text: string, who?: string): string {
  const roh = (who || "").trim();
  if (!roh || !roh.includes(",")) return text;
  const figur = personKopf(splitSpeakers(normWho(roh))[0] || "");
  // Nur wenn der KOPF selbst einen Relativsatz trägt — ein abgetrennter Zusatz
  // steht gar nicht mehr im Text.
  if (!figur.includes(",")) return text;
  try {
    // Danach ein Kleinbuchstabe: Dort geht der Satz mit einem Verb weiter.
    // Vor Satzzeichen, Doppelpunkt oder Großbuchstaben wird nichts eingefügt.
    // OHNE Rücksicht auf Groß-/Kleinschreibung: Ein Schritt weiter oben setzt
    // die Figur auf die Roheingabe zurück („ein Schulmädchen …"), und die
    // Satzanfänge werden erst ganz zum Schluss wieder groß. Gesucht wird
    // deshalb in beiden Schreibungen, ersetzt wird die gefundene.
    const re = new RegExp("(" + escapeRegExp(figur) + ")(\\s+)(?=[a-zäöüß])", "gi");
    return text.replace(re, "$1,$2");
  } catch { return text; }
}

export function coherencePass(text: string, input?: Input): string {
  try {
    if (isLineForm(input)) return text;
    const t = String(text || "").replace(/\.\s*\.+/g, ".");
    const paras = t.split(/\n{2,}/);

    const freq: Record<string, number> = {};
    coherenceWords(t).forEach((w) => { freq[w] = (freq[w] || 0) + 1; });
    const motif = new Set(Object.keys(freq).filter((w) => freq[w]! >= 2));
    [input?.who, input?.where, input?.what].forEach((s) =>
      coherenceWords(s || "").forEach((w) => motif.add(w)));
    const bogen = loadDramaData();
    if (bogen) {
      for (const feld of [bogen.einstieg, bogen.mitte, bogen.hoehepunkt, bogen.ausloeser,
        bogen.veraenderungen, bogen.konflikte, bogen.zeitanomalien, bogen.regeln]) {
        for (const satz of feld || []) coherenceWords(satz).forEach((w) => motif.add(w));
      }
    }
    // Der ERZÄHLBOGEN gehört zum Motivgeflecht — er IST es sogar.
    //
    // Gemessen: Die Regel unten warf den Höhepunkt in 41 von 120
    // Dramaturgie-Texten weg (34 %). Er steht am Ende, und sein Wortlaut („die
    // Akte trägt den eigenen Namen") teilt oft kein Wort mit dem übrigen Text —
    // genau das Merkmal, an dem die Regel ein verirrtes Atom erkennt. Ohne die
    // Regel: 0 von 120.
    //
    // Die Struktur, die einen vollständigen Bogen verspricht, verlor ihn also in
    // jedem dritten Text. Kein Wortlaut des Bogens gilt jetzt noch als
    // unverbunden.


    const allowBreaks = input?.disruptor === "on";
    const maxRemove = Math.max(1, Math.floor(splitSentences(t).length * 0.25));
    let removed = 0;

    const outParas: string[] = [];
    paras.forEach((p, pi) => {
      const sents = splitSentences(p);
      const kept = sents.filter((s, si) => {
        const bare = s.trim().replace(/["»«)\]]+$/, "").replace(/[.!?…]+$/, "").trim();
        if (istAbgeschnitten(bare)) { removed++; return false; }
        if (removed >= maxRemove) return true;
        const late = pi === paras.length - 1 && sents.length >= 4 && si >= Math.floor(sents.length / 2);
        if (late) {
          const cw = coherenceWords(s);
          if (cw.length >= 2 && !cw.some((w) => motif.has(w))) {
            if (allowBreaks && Math.random() < 0.5) return true;
            removed++; return false;
          }
        }
        return true;
      });
      if (kept.length) outParas.push(kept.join(" "));
    });
    const result = outParas.join("\n\n").trim();
    return result.length >= 60 ? result : text;
  } catch {
    return text;
  }
}

/** Zeichen-/Grammatik-/Label-Reparatur (Kohärenz-Schliff v2, inkl. Fixes 1–5). */
export function coherenceRepairV2(t: string, input?: Input): string {
  t = String(t ?? "");

  // Lever 4: geleakte Modus-/Sektionslabels in Klammern
  t = t.replace(/\(\s*[A-ZÄÖÜ][\wäöüß-]{2,}\s*\)/g, " ");
  // Lever 2: Zeichen-/Anführungs-Artefakte
  t = t.replace(/,\s*([.!?…])/g, "$1");
  t = t.replace(/([.!?…])\s*,/g, ",");  // Punkt/Ausrufe-/Fragezeichen direkt vor Komma -> nur Komma
  t = t.replace(/\s*,\s*,\s*/g, ", ");
  t = t.replace(/„\s+/g, "„").replace(/\s+"/g, '"');
  t = t.replace(/([.!?…])\s*\1+/g, "$1");

  // Fix 1: unpaarige Anführungszeichen
  if (((t.match(/"/g) || []).length) % 2 === 1) t = t.replace(/"/g, "");
  { const o = (t.match(/„/g) || []).length, c = (t.match(/[“”]/g) || []).length; if (o !== c) t = t.replace(/[„“”]/g, ""); }
  // Fix 2: kaputte Possessivform aus Perspektivwechsel
  t = t.replace(/\bich'(?=\s)/gi, "meine").replace(/\bdu'(?=\s)/gi, "deine")
    .replace(/\bwir'(?=\s)/gi, "unsere").replace(/\ber'(?=\s)/gi, "seine")
    .replace(/\bsie'(?=\s)/gi, "ihre").replace(/\bes'(?=\s)/gi, "seine");
  // Fix 4a: Großschreibung nach Doppelpunkt — nur wenn ein VOLLSTÄNDIGER SATZ folgt.
  // Deutsche Regel: „Was Tom will: einen Kran stürzen sehen." bleibt klein,
  // „Tom bemerkt: Die Tür ist offen." wird groß.
  t = t.replace(/(:\s+)([a-zäöüß][^.!?…]*)/g, (m: string, p1: string, rest: string) =>
    (looksLikeFullClause(null, rest) || /^(warum|weshalb|wieso|wie|was|wer|wen|wem|wann|wo|wohin|woher|ob)\b/i.test(rest))
      ? p1 + rest.charAt(0).toUpperCase() + rest.slice(1) : m);
  // Fix 4b: Eigennamen aus "Wer" korrekt kapitalisieren
  String(input?.who || "").split(/[,;]/).map((x) => x.trim()).filter(Boolean).forEach((n) => {
    const esc = escapeRegExp(n);
    try { t = t.replace(new RegExp("\\b" + esc + "(s|')?\\b", "giu"), (_m, suf: string) => n + (suf || "")); } catch { /* ungültiger Name */ }
  });

  if (isLineForm(input)) {
    return glaetten(t);
  }

  // Absatzmarken schuetzen: Die Schleife setzt den Text am Ende mit join(" ")
  // wieder zusammen und loeschte damit jede Leerzeile - die Absaetze der Prosa
  // und die Zeilen des Prosagedichts ueberlebten die Nachbearbeitung nie.
  const ABS = "\u241E";
  t = t.replace(/[ \t]*\n{2,}[ \t]*/g, " " + ABS + " ");
  const sents = t.split(/(?<=[.!?…])\s+/).filter(Boolean);
  const kept: string[] = [];
  for (let s of sents) {
    const bare = s.trim().replace(/["“”»«]+$/, "").replace(/[.!?…]+$/, "").trim();
    const opens = (s.match(/„/g) || []).length, closes = (s.match(/[“”»]/g) || []).length;
    if (/\bSatz\s+„/.test(s) && opens > closes) continue;
    if (/,\s+(die|der|das|dem|den|des)\s+(die|der|das|dem|den|des)\s+\p{L}+$/iu.test(bare)) continue;
    if (opens > closes) s = s.replace(/„\s*/g, "");
    s = beugeNachDu(s);
    const _st = s.trim();
    if (kept.length && kept[kept.length - 1] === _st) continue; // aufeinanderfolgende Dublette
    kept.push(_st);
  }
  t = kept.join(" ").replace(/\s*\u241E\s*/g, "\n\n");

  // Fix 3: Pronomen-Kongruenz bei Plural-Subjekt
  t = t.replace(/(\bich und [A-ZÄÖÜ][\wäöüß]+[^.!?…]*?)\bsie sich\b/gu, "$1wir uns");
  t = t.replace(/([A-ZÄÖÜ][\wäöüß]+ und ich[^.!?…]*?)\bsie sich\b/gu, "$1wir uns");

  // Lever 5: Konnektor-Dedupe
  const CONN = [/\bDann kippt es\b/gi, /\bDabei:\s*plötzlich\b/gi, /\bUnd immer wieder\b/gi, /\bAm Ende bleibt klar\b/gi];
  CONN.forEach((re) => { let n = 0; t = t.replace(re, (m) => (++n > 1 ? "" : m)); });

  t = glaetten(t).replace(/„[ \t]+/g, "„");
  return t;
}

/** Volle Nachbearbeitung: Namens-Ersetzung, Großschreibung, Kohärenz-Schliff. */
/** Unbestimmter Artikel MITTEN im Satz klein.
 *
 *  Als eigene Funktion, weil BERICHT und MELDUNG den Schliff bewusst NICHT
 *  durchlaufen — er zieht Sätze zusammen und streut Ton ein, und beides würde
 *  einem Bericht Fakten hinzufügen oder wegnehmen. Diese eine Regel darf aber
 *  überall gelten: Sie ändert keine Fakten, nur einen Buchstaben.
 *
 *  Im Deutschen ist „Ein" mitten im Satz immer klein. Ausgenommen bleibt, was
 *  wirklich ein Anfang ist: nach Punkt, Doppelpunkt, öffnendem
 *  Anführungszeichen, Klammer — und am ZEILENanfang, denn Verse fangen groß an.
 *  Der Umbruch steckt im Zwischenraum, nicht im Zeichen davor. */
// Seit 4.328.3 auch der bestimmte Artikel: „ich kenne Der Bote", „Da hält Der
// Bote inne" standen im Blatt — das Wer-Feld trägt seinen Kopf groß, und die
// Rahmen setzen es unverändert in die Satzmitte. Nach „—" ist es ebenfalls
// Satzmitte („drei nicht — Der Bote spürt").
export function kleinerArtikel(t: string): string {
  // Dieselbe Klasse — ändert keine Fakten, nur ein Zeichen: kein Leerzeichen
  // vor Komma, Semikolon, Punkt. Ein Was mit Komma hinter dem Leitverb
  // („bringt, was …") kommt aus den Vorlagen als „bringt , was", auch im
  // Bericht („Der Bote bringt , was niemand hören will", sagte …).
  return (t || "").replace(/[ \t]+([,;.!?])/g, "$1").replace(/([^\s.!?…:„"»(])([ \t]+)(Ein|Eine|Einen|Einem|Einer|Eines|Der|Die|Das|Den|Dem|Des)\b/g,
    (_m: string, vor: string, sp: string, w: string) => vor + sp + w.charAt(0).toLowerCase() + w.slice(1));
}

// ── Fix 5: Verben nach „du" in die zweite Person ─────────────────────────────
const DU: [RegExp, string][] = [
  [/\btritt\b/g, "trittst"], [/\bhält\b/g, "hältst"], [/\bnimmt\b/g, "nimmst"],
  [/\bsieht\b/g, "siehst"], [/\bgeht\b/g, "gehst"], [/\bsteht\b/g, "stehst"],
  [/\bträgt\b/g, "trägst"], [/\bführt\b/g, "führst"], [/\bfindet\b/g, "findest"],
  [/\bsucht\b/g, "suchst"], [/\bkommt\b/g, "kommst"], [/\bbricht\b/g, "brichst"],
];
export function beugeNachDu(s: string): string {
  const di = s.search(/\bdu\b/i);
  if (di < 0) return s;
  const head = s.slice(0, di);
  let tail = s.slice(di);
  // Nur bis zum nächsten Subjektwechsel konjugieren — sonst wird aus
  // „du findest den Bug, aber er findet dich“ ein „aber er findest dich“.
  // Gemeldet: „bemerkst du eine Kapsel unter kaltem Licht — etwas
  // Bekanntes trägst einen fremden Namen", „Du bist kein Hundeklo — das
  // Fieber gehst unter Deck", „ein Schulheft, in dem etwas anderes stehst
  // als Latein". Der Wechsel wurde nur nach einer Konjunktion erkannt;
  // nach Gedankenstrich, Semikolon, Doppelpunkt oder Komma (Nebensatz,
  // Relativsatz) lief die Beugung weiter, obwohl dort ein neues Subjekt
  // steht. Jetzt endet sie an jedem dieser Zeichen — was nach dem Komma
  // noch zum Du gehört, hat sein Verb schon davor.
  const wechsel = tail.search(/[,;:—–(]|\b(?:aber|und|doch|denn|sondern|oder|während|als)\s+(?:er|sie|es|man|wir|ihr|der|die|das|ein|eine|etwas|nichts|jemand|niemand)\b/i);
  let rest = "";
  if (wechsel > 0) { rest = tail.slice(wechsel); tail = tail.slice(0, wechsel); }
  DU.forEach(([re, rep]) => { tail = tail.replace(re, rep); });
  return head + tail + rest;
}

export function kleinesPronomen(t: string): string {
  return (t || "").replace(/([;—–][ \t]+)(Ich|Er|Es|Wir|Du|Man|Ihr)\b/g, (_m: string, sp: string, w: string) => sp + w.toLowerCase());
}

export function postProcessText(txt: string, input?: Input): string {
  let t = (txt ?? "").toString();
  t = t.replace(/(^|[.!?…]\s+)([a-zäöü])/g, (_m, p1: string, p2: string) => p1 + p2.toUpperCase());
  // Nach Konjunktion mitten im Satz: gross geschriebene Artikel/Pronomen klein
  // ("…, und Die Vergangenheit" -> "…, und die Vergangenheit"). Nomen (Realitaet)
  // stehen nicht in der Liste und bleiben gross.
  t = t.replace(/\b(und|oder|aber|denn|sondern|sowie|nur|auch|selbst|sogar|erst|schon|noch|doch|nun|dann)(\s+)(die|der|das|den|dem|des|ein|eine|einen|einem|einer|sie|er|es|man|wir|ich|du|ihr|ihre|sein|seine|dann|dabei|dadurch|vielleicht|plötzlich)\b/gi, (_m: string, c: string, sp: string, w: string) => c + sp + w.charAt(0).toLowerCase() + w.slice(1));

  // Pronomen nach Semikolon oder Gedankenstrich klein: „Eine ohne Rückfahrkarte
  // will bleiben; Ich kenne den Satz …" stand im Blatt. Die Zusammenziehung
  // im Rhythmus lässt nach „; " die Großschreibung absichtlich stehen (Nomen,
  // Namen) — ein Pronomen ist aber kein Nomen. „Sie" bleibt außen vor: Es
  // könnte die Anrede sein.
  t = kleinesPronomen(t);

  // Unbestimmter Artikel MITTEN im Satz klein.
  //
  // Gemeldet aus einem erzeugten Text: „… bemerkt Ein Bergsteiger eine Waage",
  // „Was Ein Bergsteiger will", „Ein Bergsteiger hält …". Die Figur kommt aus
  // dem Wer-Feld und wird unveraendert eingesetzt — auch dort, wo sie nicht am
  // Satzanfang steht. Die Regel darueber fasst nur Konjunktionen; hier steht
  // ein Verb oder ein Fragewort davor.
  //
  // Im Deutschen ist „Ein" mitten im Satz immer klein. Ausgenommen bleibt, was
  // WIRKLICH ein Anfang ist: nach Punkt, Doppelpunkt, oeffnendem
  // Anfuehrungszeichen, Klammer und am Zeilenanfang — dort kann ein neuer Satz
  // beginnen, und Verse fangen ohnehin gross an.
  // Der Zwischenraum darf KEINEN Zeilenumbruch enthalten: „Zeile eins\nEin
  // Vers" ist ein Zeilenanfang und bleibt gross. Den Umbruch nur aus der
  // Zeichenklasse davor auszuschliessen genuegte nicht — er steckte im
  // Zwischenraum.
  t = kleinerArtikel(t);

  const name = (input?.who ?? "").toString().trim();
  if (name) {
    const esc = escapeRegExp(name);
    try {
      t = t.replace(new RegExp(`(?<![\\p{L}\\p{N}_])${esc}(?![\\p{L}\\p{N}_])`, "giu"), name);
    } catch {
      t = t.replace(new RegExp(`\\b${esc}\\b`, "gi"), name);
    }
  }

  // Ton-Einfärbung: Einleitung + verteilte Flavor-Einschübe (nicht bei
  // Zeilenformen). Frueher hing das zusaetzlich am Sprachschliff-Haken: Wer ihn
  // setzte, verlor stillschweigend den ganzen Ton - im Schalter stand davon
  // nichts. Die Menge steuert jetzt allein der Regler "Ton-Einschuebe", 0 = aus.
  if (!isLineForm(input) && input?.tone && TONE_DATA[input.tone]) {
    const td = TONE_DATA[input.tone]!;
    // Die Ton-Einleitung gehoert hinter den Rahmensatz der Objektperspektive,
    // nicht davor. Sonst beginnt der Text mit dem Ton, und die Zeitung schnitt
    // die Ueberschrift mitten im Rahmen ab: „Kurz und ohne Pathos: So liegt der
    // Fall. Ich bin das …"
    if (td.opener.length) {
      const kopf = t.match(OBJEKT_KOPF_RE);
      t = kopf ? `${kopf[1]} ${pick(td.opener)} ${t.slice(kopf[0].length)}` : `${pick(td.opener)} ${t}`;
    }
    if (td.flavor.length) {
      const wc = t.trim().split(/\s+/).filter(Boolean).length;
      // A.3: Der Ton-Regler skaliert die Zahl der Einschuebe. Bei 0 bleibt nur die
      // Einleitung, bei 250 % bis zu sieben.
      const f = (loadKnobs().ton || 0) / 100;
      const inserts = Math.max(0, Math.min(7, Math.round(Math.max(1, Math.round(wc / 90)) * f)));
      for (let i = 0; i < inserts; i++) t = insertToneFlavor(t, pick(td.flavor));
    }
    // Register-Nachlauf: Ton formt auch die Satzmuster (nüchtern flach, ironisch trocken).
    t = applyToneRegister(t, input.tone);
  }

  // Satzlaenge ganz zum Schluss: Rhythmus, Spannung und die Ton-Einschuebe
  // zerlegen oder ergaenzen Saetze - wer die Laenge steuern will, muss das
  // letzte Wort haben, sonst schneidet Staccato wieder auf.
  // Nicht bei Zeilenformen: Dort ist die Zeile die Einheit, nicht der Satz -
  // "Shot 1 (3s)" und "DE: ..." wuerden sonst zu einer Zeile verschmelzen, und
  // ein Vers waere kein Vers mehr.
  // VOR der Zusammenziehung: Sie verkleidet die Dublette als Halbsatz mit
  // Gedankenstrich, und dann ist sie schwerer zu erkennen als vorher.
  if (!isLineForm(input)) t = entferneDubletten(t);
  if (!isLineForm(input)) t = applySatzlaenge(t, loadKnobs().satzlaenge);
  // Und danach noch einmal: Die Zusammenziehung kann zwei gleiche Sätze erst
  // nebeneinander bringen, indem sie einen dritten dazwischen wegnimmt.
  if (!isLineForm(input)) t = entferneDubletten(t);

  // Sprachschliff: laeuft immer. Was uebrig ist, ist in jedem Text richtig.
  t = polishGerman(t, { who: name });

  // Der nachgestellte Relativsatz der Figur muss geschlossen werden. Im Blatt
  // stand „Ein Schulmädchen, das Karten fälscht bemerkt: …" — der Satz öffnet
  // ein Komma und schließt es nie. Gemessen: 6 von 250 Texten.
  //
  // Möglich ist die Reparatur nur, WEIL die Figur wörtlich bekannt ist. Ein
  // allgemeiner Erkenner für Relativsätze wäre hier so unzuverlässig wie alle
  // anderen; hier wird eine bekannte Zeichenkette gesucht, sonst nichts.
  t = schliesseFigurenkomma(t, input?.who);
  t = coherencePass(t, input);
  t = coherenceRepairV2(t, input);
  t = t.replace(/(^|[.!?…]\s+)([a-zäöü])/g, (_m, p1: string, p2: string) => p1 + p2.toUpperCase());
  // Nach Konjunktion mitten im Satz: gross geschriebene Artikel/Pronomen klein
  // ("…, und Die Vergangenheit" -> "…, und die Vergangenheit"). Nomen (Realitaet)
  // stehen nicht in der Liste und bleiben gross.
  t = t.replace(/\b(und|oder|aber|denn|sondern|sowie|nur|auch|selbst|sogar|erst|schon|noch|doch|nun|dann)(\s+)(die|der|das|den|dem|des|ein|eine|einen|einem|einer|sie|er|es|man|wir|ich|du|ihr|ihre|sein|seine|dann|dabei|dadurch|vielleicht|plötzlich)\b/gi, (_m: string, c: string, sp: string, w: string) => c + sp + w.charAt(0).toLowerCase() + w.slice(1));
  return t.trim();
}
