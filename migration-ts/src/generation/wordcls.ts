// "Was passiert"-Analyse: Leitverb abtrennen, Satz-Erkennung.
import { clean } from "../text-utils";
import { VERB_CONJ, INFINITIVE_VERBS } from "./verbconj.data";
import { VERB_TOKEN_RE } from "./verbconj";

export interface LeadVerb { verb: string | null; rest: string; isInfinitiveLed?: boolean; }

export function extractLeadVerb(text: string): LeadVerb {
  const s = clean(text);
  if (!s) return { verb: null, rest: s };
  const m = s.match(/^([A-Za-zÄÖÜäöüß]+)\s+(.+)$/);
  if (!m) return { verb: null, rest: s };
  const w = m[1]!.toLowerCase();
  if (VERB_CONJ[w]) return { verb: m[1]!, rest: m[2]! };
  if (INFINITIVE_VERBS.has(w)) return { verb: null, rest: `${m[2]} ${w}`, isInfinitiveLed: true };
  if (/^[a-zäöüß]+iert$/.test(w)) return { verb: m[1]!, rest: m[2]! };
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
