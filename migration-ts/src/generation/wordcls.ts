// "Was passiert"-Analyse: Leitverb abtrennen, Satz-Erkennung.
import { clean } from "../text-utils";
import { VERB_CONJ, INFINITIVE_VERBS } from "./verbconj.data";
import { NOUN_GENDER } from "./nouns.data";
import { VERB_TOKEN_RE } from "./verbconj";

export interface LeadVerb { verb: string | null; rest: string; isInfinitiveLed?: boolean; }

// Funktionswörter auf -en/-ern/-eln, die KEINE Infinitive sind (Artikel, Pronomen,
// Präpositionen, Adverbien). Ohne diese Liste würde "einen Kran …" als Verb gelesen.
const NOT_INFINITIVE = new Set([
  "einen", "keinen", "seinen", "ihren", "deinen", "unseren", "euren", "diesen", "jenen", "denen", "welchen",
  "allen", "vielen", "beiden", "manchen", "jeden", "solchen", "anderen", "eigenen", "letzten", "ersten",
  "oben", "unten", "innen", "außen", "hinten", "vorn", "vorne", "neben", "eben", "gegen", "wegen", "gegenüber",
  "morgen", "übermorgen", "wochen", "stunden", "sieben", "zehn", "trotzen", "während", "dessen", "deren", "hinein",
]);
/** Erkennt einen Infinitiv am Satzanfang — auch außerhalb der kuratierten Liste.
 *  Deutsche Infinitive enden auf -en/-eln/-ern; ausgeschlossen werden Funktionswörter
 *  und bekannte Nomen (die Groß-/Kleinschreibung prüft der Aufrufer). */
function looksLikeInfinitive(w: string): boolean {
  if (INFINITIVE_VERBS.has(w)) return true;
  if (w.length < 5 || NOT_INFINITIVE.has(w) || NOUN_GENDER[w]) return false;
  return /(?:[a-zäöüß]{3,})(?:en|ern|eln)$/.test(w);
}

export function extractLeadVerb(text: string): LeadVerb {
  const s = clean(text);
  if (!s) return { verb: null, rest: s };
  const m = s.match(/^([A-Za-zÄÖÜäöüß]+)\s+(.+)$/);
  if (!m) return { verb: null, rest: s };
  const raw = m[1]!;
  const w = raw.toLowerCase();
  if (VERB_CONJ[w]) return { verb: raw, rest: m[2]! };
  // Nur kleingeschriebene Wörter können hier Infinitive sein (Nomen sind groß).
  if (/^[a-zäöüß]/.test(raw) && looksLikeInfinitive(w)) {
    return { verb: null, rest: `${m[2]} ${w}`, isInfinitiveLed: true };
  }
  if (/^[a-zäöüß]+iert$/.test(w)) return { verb: raw, rest: m[2]! };
  return { verb: null, rest: s };
}

// Kuratierte finite Verben, die NICHT in der Konjugationstabelle stehen und
// keine gängigen Nomen sind - so werden ganze Sätze wie "ein Wunder geschieht"
// oder "die Uhr tickt" korrekt als Klausel erkannt (statt hinter ein Modalverb
// gehängt zu werden).
const EXTRA_FINITE_RE = /\b(geschieht|geschehen|geschah|passiert|passieren|passierte|tickt|ticken|atmet|atmen|wächst|wachsen|wuchs|brennt|brennen|brannte|fällt|fallen|fiel|zerfällt|zerfallen|verschwindet|verschwinden|verschwand|erscheint|erscheinen|erschien|endet|enden|endete|beginnt|beginnen|begann|stirbt|sterben|starb|blüht|blühen|klopft|klopfen|flackert|flackern|zerbricht|zerbrechen|zerbrach|dreht|drehen|schweigt|schweigen|schwieg|singt|singen|sang|wandert|wandern|glüht|glühen|tanzt|tanzen|brüllt|brüllen|reagiert|reagieren|zeigt|zeigen|spricht|sprechen|sprach|antwortet|antworten|erinnert|erinnern|verändert|verändern|zittert|zittern|leuchtet|leuchten|schmilzt|schmelzen|regnet|schneit|blitzt|donnert|bebt|läuft|laufen|lief|rinnt|tropft|fließt|fließen|floss|steigt|steigen|stieg|sinkt|sinken|sank|kreist|kreisen|pulsiert|vibriert|summt|brummt|knistert|raschelt|flüstert|flüstern|schreit|schreien|schrie|weint|weinen|lacht|lachen|verglüht|verblasst|zerrinnt|wartet|warten)\b/i;

export function looksLikeFullClause(leadVerb: string | null, rest: string): boolean {
  if (leadVerb) return false;
  return VERB_TOKEN_RE.test(rest || "") || EXTRA_FINITE_RE.test(rest || "");
}

// "Wer?" in echte Personen zerlegen. Ein Komma trennt normalerweise Personen
// ("Baucis, Philemon"), aber ein nachgestellter Relativsatz, eine Präposition
// oder eine Konjunktion gehört zur VORHERIGEN Person und ist keine neue
// ("eine Nonne, die die Welt bereist hat" = eine Person).
const SP_REL = /^(der|die|das|den|dem|des|deren|dessen|welche[rsmn]?|wo|worin|woran|womit|wovon)\b/i;
const SP_CONJ = /^(als|während|weil|wenn|da|obwohl|nachdem|bevor|sodass|damit|dass|ob|indem|sobald|solange)\b/i;
const SP_PREP = /^(mit|ohne|aus|von|vom|in|im|auf|an|am|für|bei|zu|zum|zur|über|unter|vor|nach|durch|gegen|seit|um|entlang|trotz|wegen|innerhalb|außerhalb|samt|nebst)\b/i;
const SP_ENDS_VERB = /(?:\b(hat|hatte|ist|war|sind|waren|wird|wurde|wurden|kann|konnte|will|wollte|muss|musste|bleibt|blieb|kommt|kam|geht|ging)|\w{2,}(?:t|te|en|st|et))\.?$/i;

export function splitSpeakers(who: string): string[] {
  const parts = (who || "").split(",").map((s) => clean(s)).filter(Boolean);
  if (parts.length <= 1) return parts;
  const isContinuation = (p: string): boolean => {
    if (SP_CONJ.test(p) || SP_PREP.test(p)) return true;
    if (SP_REL.test(p) && SP_ENDS_VERB.test(p)) return true;
    return false;
  };
  const out: string[] = [parts[0]!];
  for (let i = 1; i < parts.length; i++) {
    if (isContinuation(parts[i]!)) out[out.length - 1] += ", " + parts[i]!;
    else out.push(parts[i]!);
  }
  return out;
}
