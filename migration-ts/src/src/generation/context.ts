// Kontext-Würfel: füllt Wo/Wann/Wer/Was aus den Pools (wie freshWho/… im Original).
import { pick } from "../text-utils";
import { CTX_WHO, CTX_WHERE, CTX_WHEN, CTX_WHAT, WHO_TWISTS, WHERE_TWISTS, WHEN_TWISTS, WHAT_TWISTS } from "./ideas.data";

const roll = (base: string[], tw: string[]): string => {
  const b = pick(base);
  return Math.random() < 0.5 ? b : b + ", " + pick(tw);
};

export function randomContext(): { where: string; when: string; who: string; what: string } {
  return {
    who: roll(CTX_WHO, WHO_TWISTS),
    where: roll(CTX_WHERE, WHERE_TWISTS),
    when: roll(CTX_WHEN, WHEN_TWISTS),
    what: roll(CTX_WHAT, WHAT_TWISTS),
  };
}
