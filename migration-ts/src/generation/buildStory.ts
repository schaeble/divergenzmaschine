// Generierung: volle Kit-Fidelity (buildBaseModules) + Struktur + V4.1-Pipeline.
import type { Bank, GenInput, StoryKit } from "../types";
import { MODE_DATA } from "../modes.data";
import { pick, pickSane, clean, chance } from "../text-utils";
import { makeDialogueScene, pickSpeakerForArchetype } from "./dialogue";
import { postProcessText } from "./postprocess";
import { pickStructureBuilder } from "./structures";
import { looksLikeClausePhrase } from "./beats";
import { archetypeAugmentList } from "./archetype";
import { extractLeadVerb, looksLikeFullClause } from "./wordcls";
import { declineHookPhrase, safeCaseForm } from "./declension";
import { applyDisruptor, applyRhythm, paragraphize, applyPerspective, pronominalize, guessPronoun } from "./shape";
import { MarkovModel, isSaneMarkov } from "../corpus";
import { biasedAutoChoice } from "./autochoice";
import { buildVideoSequenceText } from "./video";
import { enforceWordTarget } from "./length";
import { asProsePoem, asStrang, asReim, asHaiku, asDrama } from "./forms";

const MODES = ["bureau", "tech", "body", "myth", "absurd", "post"];
const STRUCTURES = ["linear", "reverse", "circle", "fragment", "object"];
const PERSPECTIVES = ["third", "first", "second", "we", "object", "split"];
const RHYTHMS = ["breath", "staccato", "long", "fracture", "clean"];
const resBiased = (ui: string, kind: string, opts: string[], aA: string, aB: string): string =>
  ui !== "auto" && opts.includes(ui) ? ui : (biasedAutoChoice(kind, aA, aB) || pick(opts));

/** Baut aus Bank + Eingabe die Bausteine (StoryKit) — volle Fidelity. */
export function buildKit(bank: Bank, input: GenInput, model?: MarkovModel): StoryKit {
  const archA = (input.archetypeA || "neutral").toLowerCase();
  const archB = (input.archetypeB || "neutral").toLowerCase();

  const modeKey = resBiased(input.mode, "mode", MODES, archA, archB);
  const M = MODE_DATA[modeKey] || MODE_DATA.bureau!;
  const structure = resBiased(input.structure, "structure", STRUCTURES, archA, archB);
  const perspective = input.perspective === "auto" ? (biasedAutoChoice("perspective", archA, archB) || pick(PERSPECTIVES)) : input.perspective;
  const rhythm = resBiased(input.rhythm, "rhythm", RHYTHMS, archA, archB);

  const W = clean(input.where) || "an einem Ort";
  const T = clean(input.when) || "zu einer Zeit";
  const PRaw = clean(input.who) || "Jemand";
  const whoParts = PRaw.split(",").map((s) => clean(s)).filter(Boolean);
  const P = whoParts[0] || PRaw;
  const A = clean(input.what) || "etwas";

  const aLead = extractLeadVerb(A);
  const Apure = aLead.rest;
  const AleadVerb = aLead.verb || "";
  const AisInfinitiveLed = !!aLead.isInfinitiveLed;
  const AisClause = !AisInfinitiveLed && looksLikeFullClause(aLead.verb, Apure);

  const markovMode = input.markovMode || "mix";
  const maybeMarkov = (fallback: string, prob = 0.42): string => {
    if (markovMode === "off" || !model) return fallback;
    if (markovMode === "on" || chance(prob)) {
      const m = model.generate(14);
      if (m && isSaneMarkov(m)) return m;
    }
    return fallback;
  };

  const aug = (list: string[], key: string) => archetypeAugmentList(list, archA, archB, key);
  const motif = maybeMarkov(pickSane(aug(bank.motifs, "motifs")), 0.28);
  const hook = maybeMarkov(pickSane(aug(bank.hooks, "hooks")), 0.28);
  const prop = pickSane(aug(bank.props, "props"), 1);

  const hookIsClause = looksLikeClausePhrase(hook);
  const hookQuote = hookIsClause ? clean(hook).replace(/[.!?…]+$/, "") : "";
  const hookAcc = hookIsClause ? `den Satz „${hookQuote}"` : safeCaseForm(hook, declineHookPhrase(hook, "acc"));
  const hookDat = hookIsClause ? `dem Satz „${hookQuote}"` : safeCaseForm(hook, declineHookPhrase(hook, "dat"));
  const propAcc = safeCaseForm(prop, declineHookPhrase(prop, "acc"));
  const propDat = safeCaseForm(prop, declineHookPhrase(prop, "dat"));

  return {
    W, T, P, PRaw, A, motif, hook, hookAcc, hookDat, prop, propAcc, propDat,
    turn: maybeMarkov(pickSane(aug(bank.turns, "turns")), 0.28),
    obstacle: pickSane(aug(bank.obstacles, "obstacles")),
    stake: pickSane(aug(bank.stakes, "stakes")),
    ending: pickSane(aug(bank.endings, "endings")),
    speakerA: P, speakerB: whoParts[1] || pickSpeakerForArchetype(archB),
    mode: M, archetypeA: archA, archetypeB: archB, instability: input.instability,
    Apure, AleadVerb, AisClause, AisInfinitiveLed,
    structure, perspective, rhythm,
  };
}

/** Erzeugt einen Text zu Bank + Eingabe. */
export function buildStory(bank: Bank, input: GenInput, model?: MarkovModel): string {
  const kit = buildKit(bank, input, model);

  const lenTarget = Number.isFinite(input.lenTarget as number) ? (input.lenTarget as number) : 110;
  if (input.form === "script") return makeDialogueScene(kit, lenTarget);
  if (input.form === "video") return buildVideoSequenceText(kit, input.shots ?? 5, input.totalSec ?? 15);
  if (input.form === "poem") {
    const body = pickStructureBuilder(kit.structure === "fragment" ? "linear" : kit.structure)({ ...kit });
    return postProcessText(asProsePoem(body), { ...input, form: "poem" });
  }

  const verseForm = input.form === "reim" || input.form === "haiku" || input.form === "strang" || input.form === "drama";
  const effStructure = verseForm && kit.structure === "fragment" ? "linear" : kit.structure;
  let text = pickStructureBuilder(effStructure)({ ...kit });

  if (effStructure === "fragment") return postProcessText(text, { ...input, form: "strang" });

  text = applyDisruptor(text, input.disruptor).text;
  text = applyRhythm(text, kit.rhythm);
  text = paragraphize(text);
  const paras = text.split(/\n\n+/).map(clean).filter(Boolean);
  text = effStructure === "object"
    ? paras.join("\n\n")
    : applyPerspective(paras, kit.perspective, kit.P, pick(kit.mode.nouns)).join("\n\n");
  if (kit.perspective === "third") text = pronominalize(text, kit.P, guessPronoun(kit.P));
  const finalText = postProcessText(text, input);
  const anchor = kit.ending || kit.Apure;
  if (input.form === "reim") return asReim(finalText, anchor);
  if (input.form === "haiku") return asHaiku(finalText, anchor);
  if (input.form === "strang") return asStrang(finalText, anchor);
  if (input.form === "drama") return asDrama(finalText, kit.speakerA, kit.speakerB || kit.P);
  return enforceWordTarget(finalText, lenTarget, bank, model);
}
