// Projekt speichern/laden: Wortbank, eigene Presets, Korpus und Einstellungen
// als eine JSON-Datei sichern bzw. wiederherstellen.
import { loadBank, saveBank, normalizeBankShape, loadSettings, saveSettings } from "../storage";
import { loadUserPresets, saveUserPresets } from "../wordbank";
import { loadPersistentCorpus, savePersistentCorpus } from "../corpus";
import { loadTreasury, replaceTreasury, type Treasure } from "./treasury";
import { loadIdeaUserPresets, saveIdeaUserPresetsAll, type IdeaProfile } from "./ideaprofile";
import { loadOmniUserPresets, saveOmniUserPresetsAll, type CognitiveProfile } from "./omnikognition";
import { exportLivePools, importLivePools, type LiveItem } from "./livepools";
import { loadWorkshopProjects, saveWorkshopProjectsAll, type WorkshopProject } from "./workshop";
import { loadUserPresets2, saveUserPresets2All, getActive2, setActive2, type Active2 } from "./preset2";
import { type Archive } from "./wordarchive";
import { type OfflineArchive } from "./offlinearchive";
import { loadArchive2, saveArchive2, mergeArchive2, migrateOldArchives, type Archive2 } from "./archive2";
import type { Bank, Settings } from "../types";

interface ProjectFile {
  version?: number; timestamp?: string;
  wordbank?: unknown; presets?: Record<string, Bank>; corpus?: string; settings?: Settings;
  treasury?: Treasure[]; ideaPresets?: Record<string, IdeaProfile>;
  omniPresets?: Record<string, CognitiveProfile>; livePools?: LiveItem[];
  workshopProjects?: Record<string, WorkshopProject>;
  presets2?: Record<string, Active2>; active2?: Active2 | null; wordArchive?: Archive; offlineArchive?: OfflineArchive; archive2?: Archive2;
  /** Alle uebrigen Schluessel des Speichers. Aufgefallen bei einem
   *  Rechnerwechsel: Die acht Stellschrauben (dm_knobs_v1), die Umwelt
   *  (dm_umwelt_v1), die Zielvorgaben und der gemerkte 4W-Kontext standen in
   *  KEINEM Feld dieser Datei - wer umzieht, verliert sie stillschweigend.
   *  Statt sie einzeln nachzutragen und beim naechsten Regler wieder zu
   *  vergessen, wandert hier alles mit, was zum Programm gehoert. */
  rest?: Record<string, string>;
}

/** Schluessel, die zum Programm gehoeren. Praefixe statt Liste, damit ein neuer
 *  Regler ohne Zutun mitgesichert wird. */
const REST_PRAEFIX = ["dm_", "divergenz_"];
/** Was anderswo schon vollstaendig gesichert wird, gehoert nicht doppelt hinein. */
const REST_AUSNAHME = new Set(["divergenz_settings_v1", "dm_treasury_v1", "divergenz_live_pools_v1"]);

function sammleRest(): Record<string, string> {
  const out: Record<string, string> = {};
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (!k || REST_AUSNAHME.has(k)) continue;
      if (!REST_PRAEFIX.some((px) => k.startsWith(px))) continue;
      const v = localStorage.getItem(k);
      if (v !== null) out[k] = v;
    }
  } catch { /* kein Speicher */ }
  return out;
}

/** Exportiert das Projekt. Zeigt — wo unterstützt — einen echten „Speichern unter"-
 *  Dialog (File System Access API); sonst klassischer Download. Rückgabe: false, wenn
 *  der Nutzer den Dialog abgebrochen hat, sonst true. */
export async function exportProject(): Promise<boolean> {
  const project: ProjectFile = {
    version: 2, timestamp: new Date().toISOString(),
    wordbank: loadBank(), presets: loadUserPresets(), corpus: loadPersistentCorpus(), settings: loadSettings(),
    treasury: loadTreasury(), ideaPresets: loadIdeaUserPresets(),
    omniPresets: loadOmniUserPresets(), livePools: exportLivePools(),
    workshopProjects: loadWorkshopProjects(),
    presets2: loadUserPresets2(), active2: getActive2(), archive2: loadArchive2(),
    rest: sammleRest(),
  };
  const json = JSON.stringify(project, null, 2);
  const filename = `divergenz_projekt_${new Date().toISOString().slice(0, 10)}.json`;

  // „Speichern unter"-Dialog (Chromium-basierte Browser)
  const w = window as unknown as { showSaveFilePicker?: (o: unknown) => Promise<{ createWritable: () => Promise<{ write: (d: Blob) => Promise<void>; close: () => Promise<void> }> }> };
  if (typeof w.showSaveFilePicker === "function") {
    try {
      const handle = await w.showSaveFilePicker({
        suggestedName: filename,
        types: [{ description: "Divergenz-Projekt", accept: { "application/json": [".json"] } }],
      });
      const writable = await handle.createWritable();
      await writable.write(new Blob([json], { type: "application/json" }));
      await writable.close();
      return true;
    } catch (e) {
      if (e instanceof DOMException && e.name === "AbortError") return false;  // Nutzer hat abgebrochen
      // sonst: auf klassischen Download zurückfallen
    }
  }

  // Fallback: Download in den Standardordner
  const blob = new Blob([json], { type: "application/json;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 0);
  return true;
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
        if (p.workshopProjects) saveWorkshopProjectsAll(p.workshopProjects);
        if (p.presets2) saveUserPresets2All(p.presets2);
        if ("active2" in p) setActive2(p.active2 ?? null);
        if (p.rest) {
          for (const [k, v] of Object.entries(p.rest)) {
            if (!REST_PRAEFIX.some((px) => k.startsWith(px)) || REST_AUSNAHME.has(k)) continue;
            try { localStorage.setItem(k, v); } catch { /* voll */ }
          }
        }
        if (p.archive2 && Array.isArray(p.archive2.groups)) saveArchive2(p.archive2);
        else if (p.wordArchive || p.offlineArchive) mergeArchive2(migrateOldArchives(p.wordArchive ?? null, p.offlineArchive ?? null));
        resolve();
      } catch (e) { reject(e instanceof Error ? e : new Error(String(e))); }
    };
    reader.onerror = () => reject(new Error("Datei konnte nicht gelesen werden."));
    reader.readAsText(file);
  });
}
