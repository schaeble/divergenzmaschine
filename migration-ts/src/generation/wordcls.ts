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

export function looksLikeFullClause(leadVerb: string | null, rest: string): boolean {
  return !leadVerb && VERB_TOKEN_RE.test(rest || "");
}
