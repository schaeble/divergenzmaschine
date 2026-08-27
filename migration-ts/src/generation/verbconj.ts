// Verb-Konjugation für Perspektivwechsel (VERB_CONJ + Näherung).
import { VERB_CONJ } from "./verbconj.data";
import { cap } from "./beats";
import { beugeVerb } from "./verben";

export const VERB_TOKEN_RE = new RegExp("\\b(" + Object.keys(VERB_CONJ).join("|") + ")\\b", "i");

export function conjugateVerbToken(verb: string, person: string): string {
  if (!verb) return verb;
  const isCap = /^[A-ZÄÖÜ]/.test(verb);
  const low = verb.toLowerCase();
  const table = VERB_CONJ[low];
  let out: string;
  if (table && table[person]) {
    out = table[person]!;
  } else {
    // Ohne Tabelleneintrag: die Morphologie (verben.ts) statt der alten
    // Näherung, die aus „wartet" ein „wartst" und aus „trägt" kein „tragen"
    // machte.
    const p = person === "ich" || person === "du" || person === "wir" || person === "ihr" ? person : "er";
    out = beugeVerb(low, p) ?? low;
  }
  return isCap ? cap(out) : out;
}
