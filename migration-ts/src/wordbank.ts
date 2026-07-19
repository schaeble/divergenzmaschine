// Presets (Built-in + eigene) und die verstärkte Mutations-Engine.
import type { Bank, BankKey, Preset } from "./types";
import { STORAGE_PRESETS, BANK_KEYS } from "./constants";
import { BUILTIN_PRESETS, PRESET_LABELS } from "./presets.data";
import { MODE_DATA } from "./modes.data";
import { clean, pick, chance } from "./text-utils";
import { normalizeBankShape, loadBank } from "./storage";

export function loadUserPresets(): Record<string, Bank> {
  try {
    const raw = localStorage.getItem(STORAGE_PRESETS);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as unknown;
    return parsed && typeof parsed === "object"
      ? (parsed as Record<string, Bank>)
      : {};
  } catch {
    return {};
  }
}

export function saveUserPresets(user: Record<string, Bank>): void {
  localStorage.setItem(STORAGE_PRESETS, JSON.stringify(user));
}

const ACTIVE_KEY = "divergenz_active_preset_v1";
/** Merkt sich, aus welcher Quelle die aktuelle Wortbank stammt (nur zur Anzeige). */
export function saveActiveBankLabel(label: string): void {
  try { localStorage.setItem(ACTIVE_KEY, label || ""); } catch { /* voll */ }
}
export function loadActiveBankLabel(): string {
  try { return localStorage.getItem(ACTIVE_KEY) || ""; } catch { return ""; }
}

export function presetLabel(id: string): string {
  return PRESET_LABELS[id] ?? id;
}

/** Alle verfügbaren Presets: eingebaut zuerst, dann eigene. */
export function getAllPresets(): Record<string, Preset> {
  const all: Record<string, Preset> = {};
  for (const [id, bank] of Object.entries(BUILTIN_PRESETS)) {
    all[`builtin:${id}`] = {
      id: `builtin:${id}`, label: presetLabel(id), kind: "builtin",
      bank: normalizeBankShape(bank),
    };
  }
  for (const [name, bank] of Object.entries(loadUserPresets())) {
    all[`user:${name}`] = {
      id: `user:${name}`, label: `👤 ${name}`, kind: "user",
      bank: normalizeBankShape(bank),
    };
  }
  return all;
}

/** Preset-Optionen für Dropdowns: eingebaute zuerst, dann eigene — je alphabetisch
 *  nach Namen (führendes Icon wird ignoriert), deutsche Sortierung. */
export function sortedPresetOptions(): [string, string][] {
  const all = Object.values(getAllPresets());
  const key = (p: Preset): string => p.label.replace(/^[^\p{L}\p{N}]+/u, "").trim();
  const byName = (a: Preset, b: Preset): number => key(a).localeCompare(key(b), "de", { sensitivity: "base" });
  const builtins = all.filter((p) => p.kind === "builtin").sort(byName);
  const users = all.filter((p) => p.kind === "user").sort(byName);
  return [...builtins, ...users].map((p) => [p.id, p.label] as [string, string]);
}

export function saveCurrentBankAsUserPreset(name: string): void {
  if (!name || !name.trim()) return;
  const safe = name.trim().slice(0, 40);
  const user = loadUserPresets();
  user[safe] = normalizeBankShape(loadBank());
  saveUserPresets(user);
}

/** Auto-Mix: pro Kategorie ein zufälliges Preset ziehen. */
export function buildAutoMixBank(): Bank {
  const pool = Object.values(getAllPresets());
  const out = {} as Bank;
  for (const k of BANK_KEYS) {
    const src = pick(pool);
    out[k] = Array.isArray(src.bank[k]) ? src.bank[k].slice() : [];
  }
  return normalizeBankShape(out);
}

// ── Verstärkte Mutations-Engine (v2), jetzt als reine Funktion ───────
const ADJ = [
  "fahl", "gläsern", "zerfranst", "schattenhaft", "brüchig", "namenlos",
  "flirrend", "versehrt", "lautlos", "verkantet", "phosphoreszierend", "kalt",
];

/**
 * Erzeugt aus einer Bank eine stärker mutierte neue Bank.
 * @param bank   Ausgangs-Wortbank
 * @param amount Reglerstärke 0..500
 */
export function mutateBank(bank: Bank, amount: number): Bank {
  const modeKeys = Object.keys(MODE_DATA);
  const amt = Math.max(0, Math.min(500, amount | 0));
  const intensity = amt / 500;
  const mutateRate = 0.4 + 0.55 * intensity;
  const maxSwaps = 1 + Math.round(intensity * 2);
  const HARD_CAP = 80;

  const M = () => MODE_DATA[pick(modeKeys)]!;
  const freshWord = (): string => {
    const m = M();
    return pick(m.nouns.concat(m.verbs));
  };

  const injectAdj = (s: string): string =>
    s.replace(/\b(ein|eine|einen|einem|einer)\s+([A-Za-zÄÖÜäöüß]+)/i,
      (_m, a: string, n: string) => `${a} ${pick(ADJ)} ${n}`);

  const intensify = (s: string): string => {
    if (/[.!?]$/.test(s)) {
      return chance(0.5)
        ? "Beinahe " + s.charAt(0).toLowerCase() + s.slice(1)
        : s.replace(/[.!?]$/, " – und mehr.");
    }
    return chance(0.5) ? s + ", das nicht endet" : "kaum " + s;
  };

  const crossover = (a: string, b: string): string => {
    const wa = String(a).split(" "), wb = String(b).split(" ");
    if (wa.length < 2 || wb.length < 2) return a;
    const ca = Math.max(1, Math.floor(wa.length / 2));
    const cb = Math.max(1, Math.floor(wb.length / 2));
    return wa.slice(0, ca).concat(wb.slice(cb)).join(" ");
  };

  const swapWords = (s: string, n: number): string => {
    const w = String(s).split(" ");
    for (let i = 0; i < n && w.length; i++) {
      w[Math.floor(Math.random() * w.length)] = freshWord();
    }
    return w.join(" ");
  };

  const mutateEntry = (src: string[]): string => {
    let s = pick(src);
    if (chance(0.35 * (0.5 + intensity))) s = crossover(s, pick(src));
    s = swapWords(s, 1 + Math.floor(Math.random() * maxSwaps));
    if (chance(0.3 * intensity)) s = injectAdj(s);
    if (chance(0.25 * intensity)) s = intensify(s);
    return clean(s);
  };

  const mutateList = (list: string[], templates: string[]): string[] => {
    if (!Array.isArray(list) || !list.length) return list;
    const outSet = new Set(list.map(clean).filter(Boolean));
    const grow = Math.round(amt / 25);
    const target = Math.min(
      HARD_CAP,
      outSet.size + Math.max(grow, Math.round(outSet.size * mutateRate)),
    );
    const src = list.concat(templates);
    let guard = 0;
    while (outSet.size < target && guard < target * 200) {
      guard++;
      const v = mutateEntry(src);
      if (v && v.split(/\s+/).filter(Boolean).length >= 2) outSet.add(v);
    }
    return Array.from(outSet);
  };

  const gen = (fn: () => string): string[] => Array.from({ length: 6 }, fn);
  const out: Bank = normalizeBankShape(bank);
  out.motifs = mutateList(out.motifs, gen(() => `ein ${freshWord()}, das sich verändert`));
  out.hooks = mutateList(out.hooks, gen(() => `ein ${freshWord()} im falschen Winkel`));
  out.props = mutateList(out.props, gen(() => `ein ${freshWord()} aus fremder Hand`));
  out.turns = mutateList(out.turns, gen(() => pick(M().rules)));
  out.obstacles = mutateList(out.obstacles, gen(() => `Weil: ${pick(M().rules)}`));
  out.stakes = mutateList(out.stakes, gen(() => `Der Einsatz ist, zu sehen ${pick(M().images)}.`));
  out.endings = mutateList(out.endings, [
    "Und dann—", "Es bleibt.", "Kein Ende.", "Und nichts kehrte zurück.", "So blieb die Frage offen.",
  ]);
  return out;
}

/** Gesamtzahl der Einträge einer Bank (für Anzeige/Tests). */
export function bankEntryCount(bank: Bank): number {
  return (BANK_KEYS as readonly BankKey[]).reduce((a, k) => a + (bank[k]?.length ?? 0), 0);
}
