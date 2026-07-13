// Video/Multi-Shot: Shot-Beschreibungen + Sequenz-Text.
import type { StoryKit } from "../types";
import { pick, clean, ensurePunct } from "../text-utils";
import { cap } from "./beats";
import { VIDEO_RULES, VIDEO_CAM_EXTENDED, VIDEO_LIGHT, VIDEO_TEX } from "./video.data";

export const clampShotCount = (n: number): number => Math.max(3, Math.min(10, Number.isFinite(n) ? n : 5));
export const clampTotalSec = (n: number): number => Math.max(3, Math.min(600, Number.isFinite(n) ? n : 15));
const fmtSec = (x: number): string => { if (!isFinite(x)) return "0s"; const v = Math.round(x * 10) / 10; return (v % 1 === 0 ? v.toFixed(0) : String(v)) + "s"; };
const pickSymbol = (): string => pick(["⊗", "⟂", "⟡", "⌁", "⟟", "⟐", "✶", "⟁"]);
const stripTailPunct = (s: string): string => clean(s).replace(/[.!?…]+$/, "");
function normalizePlace(W: string): string {
  const w = clean(W);
  if (!w) return "an einem Ort";
  if (/^(im|am|in|auf|bei|unter|über|vor|hinter)\b/i.test(w)) return w;
  return "an einem " + w;
}

function buildVideoShots(kit: StoryKit, shotCount: number): string[] {
  const sym = pickSymbol();
  const place = normalizePlace(kit.W);
  const who = kit.P;
  const objClean = stripTailPunct(pick([kit.hookDat, kit.propDat]));
  const shots: string[] = [];
  shots.push(`${cap(place)} steht ${who} nahe ${objClean}. ${cap(pick(VIDEO_LIGHT))}. ${cap(pick(VIDEO_CAM_EXTENDED))}. ${cap(pick(VIDEO_TEX))}.`);
  shots.push(`Regel: ${cap(pick(VIDEO_RULES))}. ${sym}. ${who} bemerkt, dass ${stripTailPunct(kit.obstacle)}. ${cap(pick(VIDEO_CAM_EXTENDED))}.`);
  shots.push(`${ensurePunct(kit.turn)} Der Raum reagiert: ${sym} pulsiert, und ${pick(["die Wände atmen", "die Perspektive kippt", "der Boden verschiebt sich", "die Luft wird körnig"])}. ${cap(pick(VIDEO_LIGHT))}.`);
  shots.push((kit.AisClause || kit.AisInfinitiveLed)
    ? `${who} erkennt: ${stripTailPunct(kit.Apure)} — aber ${pick(["die Zeit springt", "die Regeln drehen sich um", "die Schatten lösen sich"])}. ${cap(pick(VIDEO_CAM_EXTENDED))}.`
    : `${who} ${kit.AleadVerb || "versucht"} ${stripTailPunct(kit.Apure)}, aber ${pick(["die Zeit springt", "die Regeln drehen sich um", "die Schatten lösen sich"])}. ${cap(pick(VIDEO_CAM_EXTENDED))}.`);
  shots.push(`${ensurePunct(kit.ending)} Nur: ${pick(["der Riss", "das Fenster", `das Symbol ${sym}`, "die Karte"])} bleibt sichtbar. ${cap(pick(VIDEO_TEX))}.`);
  while (shots.length < shotCount) {
    shots.splice(Math.min(shots.length, 4), 0, `${who} passiert an ${pick(["einer Kante", "einem Spiegel", "einer Tür ohne Griff"])} vorbei. ${cap(pick(VIDEO_LIGHT))}. ${cap(pick(VIDEO_CAM_EXTENDED))}.`);
  }
  return shots.slice(0, shotCount);
}

export function buildVideoSequenceText(kit: StoryKit, shotCount = 5, totalSec = 15): string {
  const n = clampShotCount(shotCount);
  const total = clampTotalSec(totalSec);
  const dur = total / n;
  const shots = buildVideoShots(kit, n);
  const out = [`SEQUENZ — ${kit.mode.label || ""}`.trim(), `WER: ${kit.PRaw || kit.P}`, `WO: ${kit.W}`, `WANN: ${kit.T}`, `WAS: ${kit.A}`, `GESAMTLÄNGE: ${fmtSec(total)} • ${fmtSec(dur)} pro Shot`, ""];
  for (let i = 0; i < shots.length; i++) { out.push(`Shot ${i + 1} (${fmtSec(dur)})`, `DE: ${shots[i]}`, ""); }
  return out.join("\n");
}
