// Die fünf Erzähl-Strukturen (linear, reverse, kreis, fragment, objektzentriert).
import type { StoryKit } from "../types";
import { pick, ensurePunct } from "../text-utils";
import { joinBeats, frameTurn, reframeStake, weaveMotif, randomFragmentTime } from "./beats";

type Builder = (kit: StoryKit) => string;

export function buildLinear(kit: StoryKit): string {
  const M = kit.mode;
  const opener = `${kit.T} ${kit.W} bemerkt ${kit.P} ${kit.hookAcc}.`;
  const goal = kit.AisClause
    ? `${kit.P} stellt fest: ${kit.Apure} — aber ${kit.obstacle}.`
    : `${kit.P} ${kit.AleadVerb || "will"} ${kit.Apure}, aber ${kit.obstacle}.`;
  const action = `${kit.P} nimmt ${kit.propAcc} und ${pick(["tritt näher", "fragt nach", "hält den Blick aus", "öffnet, was verschlossen war", "bleibt stehen"])}.`;
  const modeSpice = `Es riecht ${pick(M.images)}. ${pick(M.rules)}`;
  return joinBeats([opener, modeSpice, goal, action, frameTurn(kit.turn), reframeStake(kit.stake), kit.ending], kit.P);
}

export function buildReverse(kit: StoryKit): string {
  const M = kit.mode;
  const end = `${kit.ending}`;
  const reveal = `Du erfährst erst später: ${kit.motif} — das war der Anfang.`;
  const before = `${kit.P} hatte ${kit.propAcc} schon in der Hand, denn ${kit.obstacle}.`;
  const inciting = `${kit.T} ${kit.W}: ${kit.hook}.`;
  const rule = `${pick(M.rules)} Es riecht ${pick(M.images)}.`;
  const turn = `Und dann, rückwärts betrachtet: ${kit.turn}.`;
  return joinBeats([end, reveal, reframeStake(kit.stake), turn, before, rule, inciting], kit.P);
}

export function buildCircle(kit: StoryKit): string {
  const M = kit.mode;
  const a = `${kit.T} ${kit.W} steht ${kit.P} vor ${kit.hookDat}.`;
  const b = (kit.AisClause || kit.AisInfinitiveLed)
    ? `${kit.P} bemerkt: ${kit.Apure}. ${pick(M.rules)}`
    : `${kit.P} ${kit.AleadVerb || "sucht"} ${kit.Apure}. ${pick(M.rules)}`;
  const c = `Die Dinge werden ${pick(["fremd", "zu klar", "unruhig", "präzise"])}, denn ${kit.obstacle}.`;
  let t = joinBeats([a, b, c, frameTurn(kit.turn), reframeStake(kit.stake), kit.ending], kit.P);
  t = weaveMotif(t, kit.motif);
  t += " " + ensurePunct(`Und wieder: ${kit.hook}`);
  return t;
}

export function buildFragment(kit: StoryKit): string {
  const M = kit.mode;
  const shards = [
    `${randomFragmentTime()} — ${kit.hook}.`,
    `Gestern — ${kit.obstacle}.`,
    `Drei Tage später — ${kit.turn}.`,
    `Jetzt — ${kit.P} hält ${kit.propAcc}.`,
    `Notiz — ${pick(M.rules)}`,
    `Rand — Es riecht ${pick(M.images)}.`,
    `Später — ${kit.stake}`,
    `Schluss — ${kit.ending}`,
  ];
  for (let i = shards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shards[i], shards[j]] = [shards[j]!, shards[i]!];
  }
  return shards.join("\n");
}

export function buildObjectCentric(kit: StoryKit): string {
  const M = kit.mode;
  const obj = pick(M.nouns);
  const P = kit.P;
  const a = `Ich bin ${obj}. Ich liege ${kit.W}.`;
  const b = `Ich kenne ${P}. Ich kenne ${kit.hookAcc}.`;
  const c = `Sie nennen es ${pick(["Fehler", "Vorgang", "Omen", "Signal", "Symptom", "Protokoll"])}. Ich nenne es Erinnerung.`;
  const d = `${pick(M.rules)}.`;
  const e = kit.AisClause
    ? `${P} spürt: ${kit.Apure}. ${kit.obstacle}.`
    : `${P} ${kit.AleadVerb || "will"} ${kit.Apure}. ${kit.obstacle}.`;
  const f = `Dann spüre ich: ${kit.turn}.`;
  return joinBeats([a, b, c, d, e, f, reframeStake(kit.stake), kit.ending], kit.P);
}

const BUILDERS: Record<string, Builder> = {
  linear: buildLinear, reverse: buildReverse, circle: buildCircle,
  fragment: buildFragment, object: buildObjectCentric,
};

export function pickStructureBuilder(structure: string): Builder {
  return BUILDERS[structure] || buildLinear;
}
