// Benannte Rhythmus-Kurven dauerhaft speichern (Vorbild-Kurven wiederverwenden).
import { safeSet } from "./storage-status";

const RKEY = "dm_rhythm_curves_v1";
export interface SavedCurve { name: string; curve: number[]; d: string; }

export function loadCurves(): SavedCurve[] {
  try { const v = JSON.parse(localStorage.getItem(RKEY) || "[]"); return Array.isArray(v) ? v : []; } catch { return []; }
}
function save(list: SavedCurve[]): void { safeSet(RKEY, JSON.stringify(list), "Rhythmus-Kurven"); }

/** Speichert (oder ersetzt) eine Kurve unter einem Namen. */
export function saveCurve(name: string, curve: number[]): void {
  const nm = (name || "").trim();
  if (!nm || !curve.length) return;
  const list = loadCurves().filter((c) => c.name !== nm);
  list.push({ name: nm, curve: curve.map((n) => Math.max(1, Math.round(n))), d: new Date().toISOString().slice(0, 16).replace("T", " ") });
  save(list.slice(-50));
}
export function deleteCurve(name: string): void {
  save(loadCurves().filter((c) => c.name !== name));
}
