// Weltensimulator: persistente Figuren, Orte, Zeitleiste, Beziehungen.
import { STORAGE_WORLD } from "../constants";
import { pick, chance, clean } from "../text-utils";
import { cap } from "../generation/beats";
import { CTX_WHO, CTX_WHERE, CTX_WHEN, CTX_WHAT } from "../generation/ideas.data";
import { WORLD_FIG_ARCS, WORLD_FIG_FALLBACK, WORLD_ORT_CYCLE, WORLD_REL_CHAIN } from "./world.data";

export interface World { figuren: string[]; orte: string[]; timeline: string[]; beziehungen: string[]; tag: number; }
const EMPTY = (): World => ({ figuren: [], orte: [], timeline: [], beziehungen: [], tag: 1 });
const stripTail = (s: string): string => clean(s).replace(/[.!?…]+$/, "");
const WORLD_TENSION = /vermisst|beobacht|taucht unter|untergetaucht|geheimnis|gejagt|falle|erpresst|verraten|erkannt|misstrauisch|spur|warnung|gerücht/i;

export function loadWorld(): World {
  try {
    const raw = localStorage.getItem(STORAGE_WORLD);
    if (!raw) return EMPTY();
    const w = JSON.parse(raw) as Partial<World>;
    return {
      figuren: Array.isArray(w.figuren) ? w.figuren : [],
      orte: Array.isArray(w.orte) ? w.orte : [],
      timeline: Array.isArray(w.timeline) ? w.timeline : [],
      beziehungen: Array.isArray(w.beziehungen) ? w.beziehungen : [],
      tag: Number.isFinite(w.tag) ? (w.tag as number) : 1,
    };
  } catch { return EMPTY(); }
}
export function saveWorld(w: World): void { try { localStorage.setItem(STORAGE_WORLD, JSON.stringify(w)); } catch { /* voll */ } }
export function resetWorld(): void { saveWorld(EMPTY()); }

const splitEntry = (line: string): { name: string; status: string } => {
  const p = String(line || "").split(/\s+—\s+/);
  return { name: (p[0] || "").trim(), status: (p[1] || "").trim() };
};
const joinEntry = (name: string, status: string): string => {
  name = String(name || "").trim(); status = String(status || "").trim();
  return status ? `${name} — ${status}` : name;
};

function upsertFigure(name: string, status: string): void {
  name = clean(name); if (!name) return;
  const w = loadWorld();
  const idx = w.figuren.findIndex((l) => splitEntry(l).name.toLowerCase() === name.toLowerCase());
  if (idx >= 0) w.figuren[idx] = joinEntry(name, clean(status) || splitEntry(w.figuren[idx]!).status);
  else w.figuren.push(joinEntry(name, clean(status) || "taucht zum ersten Mal auf"));
  if (w.figuren.length > 100) w.figuren = w.figuren.slice(-100);
  saveWorld(w);
}
function upsertOrt(name: string, zustand: string): void {
  name = clean(name); if (!name) return;
  const w = loadWorld();
  const idx = w.orte.findIndex((l) => splitEntry(l).name.toLowerCase() === name.toLowerCase());
  if (idx >= 0) w.orte[idx] = joinEntry(name, clean(zustand) || splitEntry(w.orte[idx]!).status);
  else w.orte.push(joinEntry(name, clean(zustand) || "wird zum ersten Mal erwähnt"));
  if (w.orte.length > 100) w.orte = w.orte.slice(-100);
  saveWorld(w);
}
function addTimeline(text: string): void {
  text = clean(text); if (!text) return;
  const w = loadWorld(); w.timeline.push(text);
  if (w.timeline.length > 200) w.timeline = w.timeline.slice(-200);
  saveWorld(w);
}

const nextFigStatus = (status: string): string => {
  const key = clean(status).toLowerCase().replace(/[.!?…]+$/, "");
  const opts = WORLD_FIG_ARCS[key];
  if (opts && opts.length) return pick(opts);
  const pool = WORLD_FIG_FALLBACK.filter((s) => s.toLowerCase() !== key);
  return pick(pool.length ? pool : WORLD_FIG_FALLBACK);
};
const nextOrtStatus = (status: string): string => {
  const key = clean(status).toLowerCase().replace(/[.!?…]+$/, "");
  const idx = WORLD_ORT_CYCLE.findIndex((s) => s.toLowerCase() === key);
  if (idx >= 0) { let ni = (idx + 1) % WORLD_ORT_CYCLE.length; if (ni === 0) ni = 1; return WORLD_ORT_CYCLE[ni]!; }
  return pick(WORLD_ORT_CYCLE.slice(1, 4));
};
const nextRelStatus = (status: string): string => {
  const key = clean(status).toLowerCase().replace(/[.!?…]+$/, "");
  const idx = WORLD_REL_CHAIN.findIndex((s) => s.toLowerCase() === key);
  if (idx >= 0) { let ni = (idx + 1) % WORLD_REL_CHAIN.length; if (ni === 0) ni = 1; return WORLD_REL_CHAIN[ni]!; }
  return WORLD_REL_CHAIN[1]!;
};
const relKey = (a: string, b: string): string => [clean(a), clean(b)].sort((x, y) => x.localeCompare(y)).join(" & ");

export function worldTick(): string[] {
  const w = loadWorld();
  if (!w.figuren.length) w.figuren.push(joinEntry(pick(CTX_WHO), "taucht zum ersten Mal auf"));
  if (!w.orte.length) w.orte.push(joinEntry(pick(CTX_WHERE), "wird zum ersten Mal erwähnt"));
  w.tag = (Number.isFinite(w.tag) ? w.tag : 1) + 1;
  const events: string[] = [];

  const fi = Math.floor(Math.random() * w.figuren.length);
  const fig = splitEntry(w.figuren[fi]!);
  const figEvent = nextFigStatus(fig.status);
  w.figuren[fi] = joinEntry(fig.name, figEvent);
  const anchor = w.orte.length && chance(0.5) ? splitEntry(pick(w.orte)).name : "";
  events.push(`${fig.name} ${figEvent}${anchor ? " (" + anchor + ")" : ""}.`);

  if (w.orte.length && chance(0.6)) {
    const oi = Math.floor(Math.random() * w.orte.length);
    const ort = splitEntry(w.orte[oi]!);
    const oe = nextOrtStatus(ort.status);
    w.orte[oi] = joinEntry(ort.name, oe);
    events.push(`${ort.name} ${oe}.`);
  }
  if (w.figuren.length >= 2 && chance(0.55)) {
    if (w.beziehungen.length && chance(0.65)) {
      const ri = Math.floor(Math.random() * w.beziehungen.length);
      const rel = splitEntry(w.beziehungen[ri]!);
      const re = nextRelStatus(rel.status);
      w.beziehungen[ri] = joinEntry(rel.name, re);
      events.push(`${rel.name} ${re}.`);
    } else {
      const names = w.figuren.map((l) => splitEntry(l).name);
      const a = pick(names);
      const rest = names.filter((n) => n !== a);
      if (rest.length) {
        const key = relKey(a, pick(rest));
        if (!w.beziehungen.some((l) => splitEntry(l).name === key)) {
          w.beziehungen.push(joinEntry(key, WORLD_REL_CHAIN[0]!));
          events.push(`${key} ${WORLD_REL_CHAIN[0]}.`);
        }
      }
    }
    if (w.beziehungen.length > 60) w.beziehungen = w.beziehungen.slice(-60);
  }
  w.timeline.push(`Tag ${w.tag} — ${events.join(" ")}`);
  if (w.timeline.length > 200) w.timeline = w.timeline.slice(-200);
  saveWorld(w);
  return events;
}

function whatFromStatus(status: string): string {
  const s = (status || "").toLowerCase();
  if (/vermisst|taucht unter|gerücht/.test(s)) return "will unerkannt zurückkehren";
  if (/beobacht/.test(s)) return "will den Beobachter stellen";
  if (/geheimnis|akte/.test(s)) return "will das Geheimnis beweisen";
  if (/gejagt|erkannt|entkommt/.test(s)) return "will die Verfolger abschütteln";
  if (/spur/.test(s)) return "will die Spur zu Ende verfolgen";
  return "";
}

/** Zieht Kontext aus der Welt (ohne DOM) — für "In Generator übernehmen". */
export function worldFillContext(): { who: string; where: string; when: string; what: string } {
  const w = loadWorld();
  let dirty = false;
  if (!w.figuren.length) { w.figuren.push(joinEntry(pick(CTX_WHO), "taucht zum ersten Mal auf")); dirty = true; }
  if (!w.orte.length) { w.orte.push(joinEntry(pick(CTX_WHERE), "wird zum ersten Mal erwähnt")); dirty = true; }
  if (dirty) saveWorld(w);
  const tense = w.figuren.filter((l) => WORLD_TENSION.test(l));
  const fig = splitEntry(pick(tense.length ? tense : w.figuren));
  const lived = w.orte.filter((l) => !/zum ersten Mal erwähnt/i.test(l));
  const ort = splitEntry(pick(lived.length ? lived : w.orte));
  return { who: fig.name, where: ort.name, when: pick(CTX_WHEN), what: whatFromStatus(fig.status) || pick(CTX_WHAT) };
}

/** Nach einer Generierung die Welt fortschreiben. */
export function worldLogGeneration(input: { who?: string; where?: string; what?: string; when?: string }): void {
  try {
    const who = clean(input.who || ""), where = clean(input.where || ""), what = clean(input.what || ""), when = clean(input.when || "");
    if (who) upsertFigure(who, what || "aktiv");
    if (where) upsertOrt(where, what ? `Schauplatz: ${stripTail(what)}` : "besucht");
    if (who || where) {
      const tag = loadWorld().tag || 1;
      addTimeline(`Tag ${tag} — ${who ? cap(who) : "Jemand"} ${what || "handelt"}${where ? ", " + where : ""}${when ? " (" + when + ")" : ""}.`);
    }
  } catch { /* darf Generierung nie blockieren */ }
}
