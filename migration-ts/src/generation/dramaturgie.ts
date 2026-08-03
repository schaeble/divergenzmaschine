// Phase 3: datengetriebener Dramaturgie-Struktur-Bauer. Liest den Erzählbogen eines
// aktiven Preset 2.0 (einstieg → mitte → höhepunkt → schluss, plus transformation/
// konflikte/zeitanomalien/regeln) und baut den Text entlang dieses Bogens — offline.
import type { StoryKit } from "../types";
import { pick, chance, ensurePunct } from "../text-utils";
import { cap, joinBeats, frameTurn, reframeStake } from "./beats";

export interface DramaData {
  einstieg: string[]; mitte: string[]; hoehepunkt: string[]; schluss: string[];
  ausloeser: string[]; veraenderungen: string[]; konflikte: string[]; zeitanomalien: string[]; regeln: string[];
}
const DKEY = "dm_dramaturgie_v1";

export function setDramaData(d: DramaData | null): void {
  try { if (d) localStorage.setItem(DKEY, JSON.stringify(d)); else localStorage.removeItem(DKEY); } catch { /* voll */ }
}
export function loadDramaData(): DramaData | null {
  try { const r = localStorage.getItem(DKEY); return r ? (JSON.parse(r) as DramaData) : null; } catch { return null; }
}
export function hasDramaData(): boolean {
  const d = loadDramaData();
  return !!(d && (d.einstieg.length || d.mitte.length || d.hoehepunkt.length || d.veraenderungen.length));
}

const some = (a: string[] | undefined): boolean => Array.isArray(a) && a.length > 0;

export function buildDramaturgie(kit: StoryKit): string {
  const d = loadDramaData();
  const M = kit.mode;
  const beats: string[] = [];

  // 1) Einstieg — Ort/Zeit + gewöhnlicher Ausgangszustand
  beats.push(d && some(d.einstieg)
    ? `${cap(kit.T)} ${kit.W}. ${cap(pick(d.einstieg))}.`
    : `${cap(kit.T)} ${kit.W} bemerkt ${kit.P} ${kit.hookAcc}.`);

  // 2) Irritation — der Hook
  beats.push(cap(ensurePunct(kit.hook)));

  // 3) Regel/Naturgesetz als Atmosphäre
  beats.push(d && some(d.regeln) && chance(0.7) ? cap(ensurePunct(pick(d.regeln))) : ensurePunct(pick(M.rules)));

  // 4) Mitte — Suche/Hinweise
  if (d && some(d.mitte)) {
    beats.push(`${cap(pick(d.mitte))}.`);
    if (d.mitte.length > 1 && chance(0.6)) beats.push(`${cap(pick(d.mitte))}.`);
  }

  // 5) Konflikt
  const konf = d && some(d.konflikte) ? pick(d.konflikte) : "";
  beats.push(konf ? `Es geht um ${konf}.` : `${kit.P} ${kit.AleadVerb || (kit.AisInfinitiveLed ? "will" : "sucht")} ${kit.Apure}, aber ${kit.obstacle}.`);

  // 6) Auslöser → Veränderung (die Wende)
  if (d && some(d.ausloeser)) beats.push(`Dann, unvermittelt: ${cap(pick(d.ausloeser))}.`);
  beats.push(frameTurn(d && some(d.veraenderungen) ? pick(d.veraenderungen) : kit.turn));

  // 7) Zeitanomalie (optional)
  if (d && some(d.zeitanomalien) && chance(0.4)) beats.push(cap(ensurePunct(pick(d.zeitanomalien))));

  // 8) Höhepunkt
  if (d && some(d.hoehepunkt)) beats.push(`Und dann: ${cap(pick(d.hoehepunkt))}.`);
  beats.push(reframeStake(kit.stake));

  // 9) Schluss
  beats.push(ensurePunct(kit.ending));

  return joinBeats(beats, kit.P);
}
