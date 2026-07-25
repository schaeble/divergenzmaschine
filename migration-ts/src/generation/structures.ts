// Die fünf Erzähl-Strukturen (linear, reverse, kreis, fragment, objektzentriert).
import type { StoryKit } from "../types";
import { pick, ensurePunct } from "../text-utils";
import { joinBeats, frameTurn, reframeStake, weaveMotif, randomFragmentTime, cap } from "./beats";
import { pickFreshIndex } from "./cooldown";

type Builder = (kit: StoryKit) => string;

const rot = <T>(key: string, arr: T[]): T => arr[pickFreshIndex(key, arr.length)]!;

export function buildLinear(kit: StoryKit): string {
  const M = kit.mode;
  // Opener-Varianten (alle mit ${hookAcc} im Akkusativ-Slot, damit die Grammatik stimmt).
  const opener = rot("lin.opener", [
    `${kit.T} ${kit.W} bemerkt ${kit.P} ${kit.hookAcc}.`,
    `${kit.T} ${kit.W} findet ${kit.P} ${kit.hookAcc}.`,
    `${kit.P} sieht ${kit.hookAcc} — ${kit.T}, ${kit.W}.`,
    `Zuerst ${kit.W}, ${kit.T}: ${kit.P} bemerkt ${kit.hookAcc}.`,
    `${kit.T} ${kit.W}. ${kit.P} hält ${kit.hookAcc} fest.`,
  ]);
  const goal = kit.AisClause
    ? rot("lin.goalC", [
        `${kit.P} stellt fest: ${kit.Apure} — aber ${kit.obstacle}.`,
        `${kit.P} begreift: ${kit.Apure}. Doch ${kit.obstacle}.`,
        `Klar wird: ${kit.Apure}. Nur ${kit.obstacle}.`,
      ])
    : rot("lin.goal", [
        `${kit.P} ${kit.AleadVerb || "will"} ${kit.Apure}, aber ${kit.obstacle}.`,
        `${kit.P} ${kit.AleadVerb || "will"} ${kit.Apure} — ${kit.obstacle}.`,
        `Was ${kit.P} ${kit.AleadVerb || "will"}: ${kit.Apure}. Was im Weg steht: ${kit.obstacle}.`,
      ]);
  const action = rot("lin.action", [
    `${kit.P} nimmt ${kit.propAcc} und ${pick(["tritt näher", "fragt nach", "hält den Blick aus", "öffnet, was verschlossen war", "bleibt stehen"])}.`,
    `${kit.P} hält ${kit.propAcc} und ${pick(["zögert", "atmet durch", "macht den ersten Schritt", "hört auf zu zählen"])}.`,
    `${kit.P} greift nach dem, was bleibt, und ${pick(["wartet", "horcht", "rechnet", "beginnt"])}.`,
    `${kit.P} legt ${kit.propAcc} beiseite und ${pick(["sieht auf", "sagt es doch", "dreht sich um", "bleibt"])}.`,
  ]);
  const modeSpice = pick([
    `Es riecht ${rot("mode.img", M.images)}. ${rot("mode.rule", M.rules)}`,
    `${rot("mode.rule", M.rules)} Es riecht ${rot("mode.img", M.images)}.`,
    `Irgendwo ${rot("mode.img", M.images)}. ${rot("mode.rule", M.rules)}`,
  ]);
  const beats = [opener, modeSpice, goal, action, frameTurn(kit.turn), reframeStake(kit.stake), kit.ending];
  // gelegentlich ein zusaetzlicher Sinneseindruck zwischen Ziel und Wende
  if (Math.random() < 0.4) beats.splice(4, 0, `${pick(["Ein Geräusch", "Ein Licht", "Ein Schatten", "Ein Zug Luft"])} ${pick(["verändert alles", "bleibt", "kippt den Moment", "zieht vorbei"])}.`);
  return joinBeats(beats, kit.P);
}

export function buildReverse(kit: StoryKit): string {
  const M = kit.mode;
  const end = `${kit.ending}`;
  const reveal = `Du erfährst erst später: ${kit.motif} — das war der Anfang.`;
  const before = `${kit.P} hatte ${kit.propAcc} schon in der Hand, denn ${kit.obstacle}.`;
  const inciting = `${kit.T} ${kit.W}: ${kit.hook}.`;
  const rule = `${rot("mode.rule", M.rules)} Es riecht ${rot("mode.img", M.images)}.`;
  const turn = `Und dann, rückwärts betrachtet: ${kit.turn}.`;
  return joinBeats([end, reveal, reframeStake(kit.stake), turn, before, rule, inciting], kit.P);
}

export function buildCircle(kit: StoryKit): string {
  const M = kit.mode;
  const a = rot("circ.a", [
    `${kit.T} ${kit.W} steht ${kit.P} vor ${kit.hookDat}.`,
    `${kit.T} ${kit.W}: wieder ${kit.hookDat} gegenüber steht ${kit.P}.`,
    `Am Anfang steht ${kit.P} vor ${kit.hookDat}. ${kit.T}, ${kit.W}.`,
  ]);
  const b = (kit.AisClause || kit.AisInfinitiveLed)
    ? `${kit.P} bemerkt: ${kit.Apure}. ${rot("mode.rule", M.rules)}`
    : `${kit.P} ${kit.AleadVerb || "sucht"} ${kit.Apure}. ${rot("mode.rule", M.rules)}`;
  const c = `Die Dinge werden ${pick(["fremd", "zu klar", "unruhig", "präzise"])}, denn ${kit.obstacle}.`;
  let t = joinBeats([a, b, c, frameTurn(kit.turn), reframeStake(kit.stake), kit.ending], kit.P);
  t = weaveMotif(t, kit.motif);
  t += " " + ensurePunct(pick([`Und wieder: ${kit.hook}`, `Und von vorn: ${kit.hook}`, `Der Kreis schließt sich: ${kit.hook}`]));
  return t;
}

export function buildFragment(kit: StoryKit): string {
  const M = kit.mode;
  // Fragmentierte, nicht-lineare Prosa: Zeitsprünge und Brüche als kurze, in den
  // Fluss eingewobene Marker — kein starres "Label — Satz" mehr (das las sich als
  // Aufzählung und musste von der Korpus-Hygiene wieder entfernt werden).
  const beats = [
    cap(ensurePunct(kit.hook)),
    cap(ensurePunct(kit.obstacle)),
    cap(frameTurn(kit.turn)),
    cap(ensurePunct(`${kit.P} hält ${kit.propAcc}`)),
    cap(ensurePunct(rot("mode.rule", M.rules))),
    cap(ensurePunct(`Es riecht ${rot("mode.img", M.images)}`)),
    cap(reframeStake(kit.stake)),
    cap(ensurePunct(kit.ending)),
  ];
  // mischen für den Sprung-Charakter
  for (let i = beats.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [beats[i], beats[j]] = [beats[j]!, beats[i]!];
  }
  // Zeit-/Bruchmarker, sparsam zwischen die Beats gesetzt
  const marks = [
    "Später.", "Davor.", "Viel früher.", "Und dann, ohne Übergang.",
    "Irgendwann dazwischen.", "Rückwärts betrachtet.", `Gegen ${randomFragmentTime()}.`,
  ];
  for (let i = marks.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [marks[i], marks[j]] = [marks[j]!, marks[i]!];
  }
  const woven: string[] = [];
  let mi = 0;
  beats.forEach((b, i) => {
    if (i > 0 && Math.random() < 0.5 && mi < marks.length) woven.push(marks[mi++]!);
    woven.push(b);
  });
  return joinBeats(woven, kit.P);
}

export function buildObjectCentric(kit: StoryKit): string {
  const M = kit.mode;
  const obj = pick(M.nouns);
  const P = kit.P;
  const a = `Ich bin ${obj}. Ich liege ${kit.W}.`;
  const b = `Ich kenne ${P}. Ich kenne ${kit.hookAcc}.`;
  const c = `Sie nennen es ${pick(["Fehler", "Vorgang", "Omen", "Signal", "Symptom", "Protokoll", "Zufall", "Nichts"])}. Ich nenne es ${pick(["Erinnerung", "Beweis", "Anfang", "Schuld"])}.`;
  const d = ensurePunct(rot("mode.rule", M.rules));
  const e = kit.AisClause
    ? `${P} spürt: ${kit.Apure}. ${kit.obstacle}.`
    : `${P} ${kit.AleadVerb || "will"} ${kit.Apure}. ${kit.obstacle}.`;
  const f = pick([`Dann spüre ich: ${kit.turn}.`, `Und dann, durch mich hindurch: ${kit.turn}.`, `Ich registriere: ${kit.turn}.`]);
  return joinBeats([a, b, c, d, e, f, reframeStake(kit.stake), kit.ending], kit.P);
}

const BUILDERS: Record<string, Builder> = {
  linear: buildLinear, reverse: buildReverse, circle: buildCircle,
  fragment: buildFragment, object: buildObjectCentric,
};

export function pickStructureBuilder(structure: string): Builder {
  return BUILDERS[structure] || buildLinear;
}
