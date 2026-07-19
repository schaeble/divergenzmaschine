// Projekt speichern/laden: Wortbank, eigene Presets, Korpus und Einstellungen
// als eine JSON-Datei sichern bzw. wiederherstellen.
import { loadBank, saveBank, normalizeBankShape, loadSettings, saveSettings } from "../storage";
import { loadUserPresets, saveUserPresets } from "../wordbank";
import { loadPersistentCorpus, savePersistentCorpus } from "../corpus";
import { loadTreasury, replaceTreasury, type Treasure } from "./treasury";
import { loadIdeaUserPresets, saveIdeaUserPresetsAll, type IdeaProfile } from "./ideaprofile";
import { loadOmniUserPresets, saveOmniUserPresetsAll, type CognitiveProfile } from "./omnikognition";
import { exportLivePools, importLivePools, type LiveItem } from "./livepools";
import type { Bank, Settings } from "../types";

interface ProjectFile {
  version?: number; timestamp?: string;
  wordbank?: unknown; presets?: Record<string, Bank>; corpus?: string; settings?: Settings;
  treasury?: Treasure[]; ideaPresets?: Record<string, IdeaProfile>;
  omniPresets?: Record<string, CognitiveProfile>; livePools?: LiveItem[];
}

export function exportProject(): void {
  const project: ProjectFile = {
    version: 2, timestamp: new Date().toISOString(),
    wordbank: loadBank(), presets: loadUserPresets(), corpus: loadPersistentCorpus(), settings: loadSettings(),
    treasury: loadTreasury(), ideaPresets: loadIdeaUserPresets(),
    omniPresets: loadOmniUserPresets(), livePools: exportLivePools(),
  };
  const blob = new Blob([JSON.stringify(project, null, 2)], { type: "application/json;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = `divergenz_projekt_${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 0);
}

export function importProject(file: File): Promise<void> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const p = JSON.parse(String(reader.result || "")) as ProjectFile;
        if (p.wordbank) saveBank(normalizeBankShape(p.wordbank));
        if (p.presets) saveUserPresets(p.presets);
        if (typeof p.corpus === "string") savePersistentCorpus(p.corpus);
        if (p.settings) saveSettings(p.settings);
        if (Array.isArray(p.treasury)) replaceTreasury(p.treasury);
        if (p.ideaPresets) saveIdeaUserPresetsAll(p.ideaPresets);
        if (p.omniPresets) saveOmniUserPresetsAll(p.omniPresets);
        if (p.livePools) importLivePools(p.livePools);
        resolve();
      } catch (e) { reject(e instanceof Error ? e : new Error(String(e))); }
    };
    reader.onerror = () => reject(new Error("Datei konnte nicht gelesen werden."));
    reader.readAsText(file);
  });
}
