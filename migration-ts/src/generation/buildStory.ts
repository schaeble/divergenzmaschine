// Generierung: Kit-Zusammenbau + Struktur-Auswahl + Nachbearbeitung.
import type { Bank, GenInput, StoryKit } from "../types";
import { MODE_DATA } from "../modes.data";
import { pick, pickSane, clean } from "../text-utils";
import { makeDialogueScene } from "./dialogue";
import { postProcessText } from "./postprocess";
import { pickStructureBuilder } from "./structures";
import { looksLikeClausePhrase } from "./beats";

function resolveMode(modeKey: string) {
  return MODE_DATA[modeKey] ?? pick(Object.values(MODE_DATA));
}

const STRUCTURES = ["linear", "reverse", "circle", "fragment", "object"];
function resolveStructure(structure: string): string {
  return STRUCTURES.includes(structure) ? structure : pick(STRUCTURES);
}

/** Baut aus Bank + Eingabe die Bausteine (StoryKit) eines Laufs. */
export function buildKit(bank: Bank, input: GenInput): StoryKit {
  const who = clean(input.who) || "Jemand";
  const whoParts = who.split(/\s*,\s*/).filter(Boolean);
  const prop = pickSane(bank.props, 1);
  const hook = pickSane(bank.hooks);
  const hookIsClause = looksLikeClausePhrase(hook);
  const hookQuote = clean(hook).replace(/[.!?…]+$/, "");
  const apure = clean(input.what).replace(/[.!?…]+$/, "") || "etwas zu verstehen";
  return {
    W: clean(input.where) || "an einem unbestimmten Ort",
    T: clean(input.when) || "irgendwann",
    P: whoParts[0] || who,
    motif: pickSane(bank.motifs),
    hook,
    hookAcc: hookIsClause ? `den Satz „${hookQuote}"` : hook,
    hookDat: hookIsClause ? `dem Satz „${hookQuote}"` : hook,
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
    Apure: apure,
    AleadVerb: "",
    AisClause: looksLikeClausePhrase(apure),
    AisInfinitiveLed: /^zu\s/i.test(apure),
  };
}

/** Erzeugt einen Text zu Bank + Eingabe. */
export function buildStory(bank: Bank, input: GenInput): string {
  const kit = buildKit(bank, input);

  if (input.form === "script") {
    return makeDialogueScene(kit, 110);
  }

  const structure = resolveStructure(input.structure);
  const builder = pickStructureBuilder(structure);
  const raw = builder({ ...kit });

  // Fragment ist zeilenbasiert -> Kohärenz-Schliff überspringt es korrekt.
  return postProcessText(raw, { ...input, form: structure === "fragment" ? "strang" : input.form });
}
