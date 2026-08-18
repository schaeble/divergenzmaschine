// Schatzkammer: Lieblingstexte dauerhaft sammeln (kompatibel mit dem Original,
// selber Speicher-Schlüssel dm_treasury_v1 — teilt sich die Sammlung mit der
// Monolith-Version auf demselben Origin). Speichern füttert den Korpus.
import { appendToPersistentCorpus } from "../corpus";
import { feedLivePools, LIVE_W } from "./livepools";
import { safeSet } from "./storage-status";

const TKEY = "dm_treasury_v1";
const TCAP = 100;

/** Ein gemerkter Text. `set` ist die Reglerstellung, mit der er entstanden ist —
 *  seit 4.229.0. Sie wird mitgeschrieben, weil die Schatzkammer das einzige
 *  belastbare „gut" dieses Programms ist: Was der Benutzer behält, ist das
 *  Urteil. Ohne die Einstellungen ließ sich daraus nichts lernen. Ältere
 *  Einträge haben kein `set` — jede Auswertung muss damit rechnen. */
export interface Treasure {
  t: string; who?: string; where?: string; when?: string; what?: string; form?: string;
  d: string; secret?: boolean;
  set?: Record<string, string>;
}

export function loadTreasury(): Treasure[] {
  try { const v = JSON.parse(localStorage.getItem(TKEY) || "[]"); return Array.isArray(v) ? v : []; } catch { return []; }
}
function saveTreasury(list: Treasure[]): void { safeSet(TKEY, JSON.stringify(list), "Schatzkammer"); }

/** Legt den Text in die Schatzkammer. Rückgabe: neue Anzahl, oder -1 wenn Dublette/leer. */
export interface TreasureCtx { who?: string; where?: string; when?: string; what?: string; form?: string; set?: Record<string, string> }

export function addToTreasury(text: string, ctx: TreasureCtx): number {
  const t = (text || "").trim();
  if (!t) return -1;
  const list = loadTreasury();
  if (list.length && list[list.length - 1]!.t === t) return -1;
  list.push({ t, who: ctx.who || "", where: ctx.where || "", when: ctx.when || "", what: ctx.what || "", form: ctx.form || "", d: new Date().toISOString().slice(0, 16).replace("T", " "), ...(ctx.set ? { set: ctx.set } : {}) });
  while (list.length > TCAP) list.shift();
  saveTreasury(list);
  try { appendToPersistentCorpus(t.replace(/\n+/g, " ").trim()); } catch { /* egal */ }
  try { feedLivePools(t, LIVE_W.schatz); } catch { /* egal */ }
  return list.length;
}

/** Legt den Text direkt in den Tresor (geheim). Füttert bewusst WEDER Korpus NOCH
 *  lebendige Pools — Tresor-Texte bleiben isoliert. Rückgabe: neue Anzahl, oder -1. */
export function addToTreasurySecret(text: string, ctx: TreasureCtx): number {
  const t = (text || "").trim();
  if (!t) return -1;
  const list = loadTreasury();
  if (list.length && list[list.length - 1]!.t === t) return -1;
  list.push({ t, who: ctx.who || "", where: ctx.where || "", when: ctx.when || "", what: ctx.what || "", form: ctx.form || "", d: new Date().toISOString().slice(0, 16).replace("T", " "), secret: true, ...(ctx.set ? { set: ctx.set } : {}) });
  while (list.length > TCAP) list.shift();
  saveTreasury(list);
  return list.length;
}

/** Ersetzt die gesamte Sammlung (Projektdatei-Import). */
export function replaceTreasury(list: Treasure[]): void {
  saveTreasury(Array.isArray(list) ? list.filter((x) => x && typeof x.t === "string").slice(-TCAP) : []);
}

export function deleteTreasureAt(i: number): void {
  const list = loadTreasury();
  if (i >= 0 && i < list.length) { list.splice(i, 1); saveTreasury(list); }
}

/** Schaltet das Geheim-Flag eines Eintrags (Tresor). */
export function setTreasureSecretAt(i: number, secret: boolean): void {
  const list = loadTreasury();
  if (i >= 0 && i < list.length) { list[i]!.secret = secret; saveTreasury(list); }
}

/** Leert die gesamte Schatzkammer. Korpus/Pools bleiben unberührt (wie beim Einzel-Löschen). */
export function clearTreasury(): void { saveTreasury([]); }

export function exportTreasuryTxt(): string {
  return loadTreasury().map((x, i) => `# ${i + 1} — ${x.d}\n${x.who || ""} · ${x.where || ""} · ${x.when || ""}\n\n${x.t}`).join("\n\n———\n\n");
}


// ── Typ-Bestimmung & Statistik für die Übersicht ────────────────────────────
const FORM_LABEL: Record<string, string> = {
  prose: "Prosa", poem: "Prosagedicht", strang: "Gedicht-Strang", reim: "Reim",
  haiku: "Haiku", drama: "Drama", script: "Szene/Dialog", video: "Multi-Shot",
  montage: "Montage", workshop: "Werkstatt", assoz: "Assoziation",
};

/** Anzahl der Wörter eines Textes. */
export function wordCount(t: string): number {
  return (t || "").trim().split(/\s+/).filter(Boolean).length;
}

/** Form-Typ eines Eintrags: gespeichertes Feld bevorzugt, sonst Heuristik aus dem Text. */
export function treasureType(tr: Treasure): string {
  if (tr.form && FORM_LABEL[tr.form]) return FORM_LABEL[tr.form]!;
  const t = (tr.t || "").trim();
  if (!t) return "—";
  const lines = t.split(/\n/).map((l) => l.trim()).filter(Boolean);
  if (/^SZENE:/m.test(t) || lines.filter((l) => /^[^:\n]{1,28}:\s/.test(l)).length >= 2) return "Szene/Dialog";
  if (/\bShot\s*\d+/i.test(t)) return "Multi-Shot";
  const shortLines = lines.filter((l) => l.split(/\s+/).filter(Boolean).length <= 7).length;
  if (lines.length === 3 && shortLines === 3) return "Haiku";
  // mehrzeilige Vers-Form: viele kurze Zeilen, kaum fortlaufende Sätze
  if (lines.length >= 3 && shortLines / lines.length > 0.6 && !/[.!?…] +[A-ZÄÖÜ]/.test(t)) return "Vers";
  return "Prosa";
}

export interface TreasureStats { total: number; words: number; avg: number; byType: Record<string, number>; }

/** Aggregierte Kennzahlen über die gesamte Sammlung. */
export function treasureStats(list: Treasure[]): TreasureStats {
  const byType: Record<string, number> = {};
  let words = 0;
  for (const tr of list) {
    const ty = treasureType(tr);
    byType[ty] = (byType[ty] || 0) + 1;
    words += wordCount(tr.t);
  }
  return { total: list.length, words, avg: list.length ? Math.round(words / list.length) : 0, byType };
}
