// Schatzkammer: Lieblingstexte dauerhaft sammeln (kompatibel mit dem Original,
// selber Speicher-Schlüssel dm_treasury_v1 — teilt sich die Sammlung mit der
// Monolith-Version auf demselben Origin). Speichern füttert den Korpus.
import { appendToPersistentCorpus } from "../corpus";

const TKEY = "dm_treasury_v1";
const TCAP = 100;

export interface Treasure { t: string; who?: string; where?: string; when?: string; what?: string; d: string; }

export function loadTreasury(): Treasure[] {
  try { const v = JSON.parse(localStorage.getItem(TKEY) || "[]"); return Array.isArray(v) ? v : []; } catch { return []; }
}
function saveTreasury(list: Treasure[]): void { try { localStorage.setItem(TKEY, JSON.stringify(list)); } catch { /* voll */ } }

/** Legt den Text in die Schatzkammer. Rückgabe: neue Anzahl, oder -1 wenn Dublette/leer. */
export function addToTreasury(text: string, ctx: { who?: string; where?: string; when?: string; what?: string }): number {
  const t = (text || "").trim();
  if (!t) return -1;
  const list = loadTreasury();
  if (list.length && list[list.length - 1]!.t === t) return -1;
  list.push({ t, who: ctx.who || "", where: ctx.where || "", when: ctx.when || "", what: ctx.what || "", d: new Date().toISOString().slice(0, 16).replace("T", " ") });
  while (list.length > TCAP) list.shift();
  saveTreasury(list);
  try { appendToPersistentCorpus(t.replace(/\n+/g, " ").trim()); } catch { /* egal */ }
  return list.length;
}

export function deleteTreasureAt(i: number): void {
  const list = loadTreasury();
  if (i >= 0 && i < list.length) { list.splice(i, 1); saveTreasury(list); }
}

export function exportTreasuryTxt(): string {
  return loadTreasury().map((x, i) => `# ${i + 1} — ${x.d}\n${x.who || ""} · ${x.where || ""} · ${x.when || ""}\n\n${x.t}`).join("\n\n———\n\n");
}
