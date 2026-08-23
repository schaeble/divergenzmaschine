// Einzige Stelle, die den Browser-Speicher berührt. Eingehende Daten werden
// hier an der Grenze geprüft und in die richtige Form gebracht.
import { safeSet } from "./features/storage-status";
import { pruefePaar } from "./generation/verwandlung";
import type { Bank, Settings } from "./types";
import { STORAGE_BANK, STORAGE_SETTINGS, DEFAULT_BANK, BANK_KEYS } from "./constants";
import { clean } from "./text-utils";

/** Bringt beliebige Eingabedaten auf die gültige Bank-Form (7 Listen, bereinigt). */
export function normalizeBankShape(bank: unknown): Bank {
  const out: Bank = structuredClone(DEFAULT_BANK);
  const src = (bank ?? {}) as Record<string, unknown>;
  for (const k of BANK_KEYS) {
    const v = src[k];
    if (Array.isArray(v)) out[k] = v.map(clean).filter(Boolean);
  }
  // `verwandlungen` ist keine Textkategorie und stand deshalb nicht in
  // BANK_KEYS — mit der Folge, dass diese Funktion sie STILL wegwarf. 41 der 51
  // eingebauten Presets tragen Motivverwandlungen; ein selbst erzeugtes konnte
  // nie welche haben, auch wenn das Modell welche geliefert hätte.
  //
  // Übernommen werden nur Paare, die auch wirken: gleiches Geschlecht auf
  // beiden Seiten. Ein Paar, das `leseVerwandlungen` später still verwirft,
  // wäre Zierrat in der Datei.
  const v = src["verwandlungen"];
  if (Array.isArray(v)) {
    const gut = v.map(clean).filter(Boolean).filter((x) => pruefePaar(x).ok);
    if (gut.length) out.verwandlungen = gut;
  }
  return out;
}

export function loadBank(): Bank {
  try {
    const raw = localStorage.getItem(STORAGE_BANK);
    if (!raw) return structuredClone(DEFAULT_BANK);
    return normalizeBankShape(JSON.parse(raw));
  } catch {
    return structuredClone(DEFAULT_BANK);
  }
}

export function saveBank(bank: Bank): boolean {
  return safeSet(STORAGE_BANK, JSON.stringify(bank), "Wortbank");
}

const DEFAULT_SETTINGS: Settings = { enabled: false, learnStories: true, useSaved: false };

export function loadSettings(): Settings {
  try {
    const raw = localStorage.getItem(STORAGE_SETTINGS);
    if (!raw) return { ...DEFAULT_SETTINGS };
    const p = JSON.parse(raw) as Partial<Settings>;
    return {
      enabled: !!p.enabled,
      learnStories: p.learnStories !== false,
      useSaved: !!p.useSaved,
    };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

export function saveSettings(s: Settings): void {
  safeSet(STORAGE_SETTINGS, JSON.stringify(s), "Einstellungen");
}
