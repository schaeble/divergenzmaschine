// Verb-Konjugation für Perspektivwechsel (VERB_CONJ + Näherung).
import { VERB_CONJ } from "./verbconj.data";
import { cap } from "./beats";

export const VERB_TOKEN_RE = new RegExp("\\b(" + Object.keys(VERB_CONJ).join("|") + ")\\b", "i");

export function conjugateVerbToken(verb: string, person: string): string {
  if (!verb) return verb;
  const isCap = /^[A-ZÄÖÜ]/.test(verb);
  const low = verb.toLowerCase();
  const table = VERB_CONJ[low];
  let out: string;
  if (table && table[person]) {
    out = table[person]!;
  } else if (person === "ich") {
    out = /et$/.test(low) ? low.slice(0, -1) : /t$/.test(low) ? low.slice(0, -1) + "e" : low;
  } else if (person === "du") {
    out = /et$/.test(low) ? low.slice(0, -1) + "st" : low;
  } else {
    out = low;
  }
  return isCap ? cap(out) : out;
}
