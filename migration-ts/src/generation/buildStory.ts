// Baseline-Generierung: Kit-Zusammenbau aus Bank + Eingabe und ein einfacher
// Prosa-/Dialog-Text. Die vollen Struktur-Varianten (linear/reverse/kreis/…)
// und Markov-Einmischung folgen in einer späteren Phase — hier geht es um das
// getypte Zusammenspiel der Module.
import type { Bank, GenInput, StoryKit } from "../types";
import { MODE_DATA } from "../modes.data";
import { pick, pickSane, capFirst, clean } from "../text-utils";
import { makeDialogueScene } from "./dialogue";
import { postProcessText } from "./postprocess";

function resolveMode(modeKey: string) {
  return MODE_DATA[modeKey] ?? pick(Object.values(MODE_DATA));
}

/** Baut aus Bank + Eingabe die Bausteine (StoryKit) eines Laufs. */
export function buildKit(bank: Bank, input: GenInput): StoryKit {
  const who = clean(input.who) || "Jemand";
  const whoParts = who.split(/\s*,\s*/).filter(Boolean);
  const prop = pickSane(bank.props, 1);
  return {
    W: clean(input.where) || "an einem unbestimmten Ort",
    T: clean(input.when) || "irgendwann",
    P: whoParts[0] || who,
    motif: pickSane(bank.motifs),
    hook: pickSane(bank.hooks),
    hookAcc: pickSane(bank.hooks),
    hookDat: pickSane(bank.hooks),
    prop,
    propAcc: prop,
    propDat: prop,
    turn: pickSane(bank.turns),
    obstacle: pickSane(bank.obstacles),
    stake: pickSane(bank.stakes),
    ending: pickSane(bank.endings),
    speakerA: whoParts[0] || who,
    speakerB: whoParts[1] || "",
    mode: resolveMode(input.mode),
    archetypeA: input.archetypeA || "neutral",
    archetypeB: input.archetypeB || "neutral",
    instability: input.instability,
  };
}

/** Erzeugt einen Text zu Bank + Eingabe (Baseline). */
export function buildStory(bank: Bank, input: GenInput): string {
  const kit = buildKit(bank, input);
  const lenTarget = 110;

  if (input.form === "script") {
    return makeDialogueScene(kit, lenTarget);
  }

  // Baseline-Prosa: Bausteine zu einem kurzen Absatz fügen, dann Nachbearbeitung.
  const raw = [
    `${kit.W}, ${kit.T}: ${kit.P} bemerkt ${kit.motif}.`,
    `${capFirst(kit.hook)}.`,
    `Doch ${kit.obstacle}.`,
    `Dann ${kit.turn}.`,
    kit.stake,
    kit.ending,
  ].join(" ");

  return postProcessText(raw, input);
}
