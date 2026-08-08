// Vereinheitlichtes Wortarchiv (v2): EIN Speicher aus benannten Gruppen.
// Eine Gruppe kann optional einer Assistenten-Kategorie (cat) und einem Thema
// zugeordnet sein — KI-generierte Gruppen tragen beides, eingefügte nur den Namen.
// Migriert beim ersten Laden verlustfrei die alten Speicher (KI-Archiv + Offline-Archiv).
import { catLabel } from "./wordarchive";

export interface ArchiveGroup { name: string; cat?: string; theme?: string; entries: string[]; }
export interface Archive2 { groups: ArchiveGroup[]; }

const KEY = "dm_archive2_v1";
const OLD_KI = "dm_wordarchive_v1";
const OLD_OFF = "dm_offline_archive_v1";

const dedupe = (arr: string[]): string[] => {
  const have = new Set<string>(); const out: string[] = [];
  for (const raw of arr) { const t = (raw || "").trim(); if (t && !have.has(t.toLowerCase())) { have.add(t.toLowerCase()); out.push(t); } }
  return out;
};

/** Wandelt die alten Speicherformate in Gruppen um (für Migration und Projekt-Import). */
export function migrateOldArchives(ki: unknown, off: unknown): ArchiveGroup[] {
  const groups: ArchiveGroup[] = [];
  if (ki && typeof ki === "object") {
    for (const [cat, list] of Object.entries(ki as Record<string, unknown>)) {
      if (!Array.isArray(list)) continue;
      const byTheme: Record<string, string[]> = {};
      for (const e of list as Array<{ t?: string; theme?: string }>) {
        const t = (e && typeof e.t === "string" ? e.t : "").trim(); if (!t) continue;
        const th = e.theme || "";
        (byTheme[th] ||= []).push(t);
      }
      for (const [th, entries] of Object.entries(byTheme)) {
        groups.push({ name: catLabel(cat) + (th ? " · " + th : ""), cat, theme: th || undefined, entries: dedupe(entries) });
      }
    }
  }
  if (off && typeof off === "object") {
    const o = off as { pool?: unknown; groups?: unknown };
    if (Array.isArray(o.pool) && o.pool.length) groups.push({ name: "Eingefügt", entries: dedupe((o.pool as unknown[]).map(String)) });
    if (o.groups && typeof o.groups === "object") {
      for (const [nm, list] of Object.entries(o.groups as Record<string, unknown>)) {
        if (Array.isArray(list)) groups.push({ name: nm, entries: dedupe((list as unknown[]).map(String)) });
      }
    }
  }
  return groups;
}

export function loadArchive2(): Archive2 {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) { const v = JSON.parse(raw) as Archive2; return v && Array.isArray(v.groups) ? v : { groups: [] }; }
    // Einmalige Migration der alten Speicher
    const ki = JSON.parse(localStorage.getItem(OLD_KI) || "null");
    const off = JSON.parse(localStorage.getItem(OLD_OFF) || "null");
    const a: Archive2 = { groups: migrateOldArchives(ki, off) };
    localStorage.setItem(KEY, JSON.stringify(a));
    return a;
  } catch { return { groups: [] }; }
}
export function saveArchive2(a: Archive2): void { try { localStorage.setItem(KEY, JSON.stringify(a)); } catch { /* voll */ } }

/** Gruppen zusammenführen (Projekt-Import): vorhandene Namen werden vereinigt. */
export function mergeArchive2(groups: ArchiveGroup[]): void {
  const a = loadArchive2();
  for (const g of groups) {
    const ex = a.groups.find((x) => x.name === g.name);
    if (ex) { ex.entries = dedupe([...ex.entries, ...g.entries]); if (!ex.cat && g.cat) ex.cat = g.cat; }
    else a.groups.push({ ...g, entries: dedupe(g.entries) });
  }
  saveArchive2(a);
}

export function archiveGroups(): ArchiveGroup[] { return loadArchive2().groups; }
export function archiveGroupNames(): string[] { return archiveGroups().map((g) => g.name).sort((a, b) => a.localeCompare(b, "de")); }
export function groupEntries(name: string): string[] { return archiveGroups().find((g) => g.name === name)?.entries || []; }
export function entriesForCat(cat: string): string[] { return dedupe(archiveGroups().filter((g) => g.cat === cat).flatMap((g) => g.entries)); }
export function themesForCat(cat: string): string[] {
  const set = new Set<string>();
  for (const g of archiveGroups()) if (g.cat === cat && g.theme) set.add(g.theme);
  return [...set].sort((a, b) => a.localeCompare(b, "de"));
}
export function entriesForCatTheme(cat: string, theme: string): string[] {
  return dedupe(archiveGroups().filter((g) => g.cat === cat && (!theme || g.theme === theme)).flatMap((g) => g.entries));
}
export function allEntries(): string[] { return dedupe(archiveGroups().flatMap((g) => g.entries)); }

/** Legt/ergänzt eine Gruppe. Rückgabe: Anzahl neu aufgenommener Einträge. */
export function addToGroup(name: string, entries: string[], cat?: string, theme?: string): number {
  const nm = (name || "").trim().slice(0, 60); if (!nm) return 0;
  const a = loadArchive2();
  let g = a.groups.find((x) => x.name === nm);
  if (!g) { g = { name: nm, cat, theme, entries: [] }; a.groups.push(g); }
  const have = new Set(g.entries.map((x) => x.toLowerCase()));
  let added = 0;
  for (const raw of entries) { const t = (raw || "").trim(); if (t && !have.has(t.toLowerCase())) { have.add(t.toLowerCase()); g.entries.push(t); added++; } }
  saveArchive2(a); return added;
}
export function renameGroup(oldName: string, newName: string): void {
  const nm = (newName || "").trim().slice(0, 60);
  const a = loadArchive2();
  const src = a.groups.find((x) => x.name === oldName);
  if (!src || !nm || oldName === nm) return;
  const dst = a.groups.find((x) => x.name === nm);
  if (dst) { dst.entries = dedupe([...dst.entries, ...src.entries]); a.groups = a.groups.filter((x) => x !== src); }
  else src.name = nm;
  saveArchive2(a);
}
export function deleteGroup(name: string): void { const a = loadArchive2(); a.groups = a.groups.filter((x) => x.name !== name); saveArchive2(a); }
export function removeFromGroup(name: string, entry: string): void {
  const a = loadArchive2(); const g = a.groups.find((x) => x.name === name); if (!g) return;
  g.entries = g.entries.filter((x) => x !== entry); saveArchive2(a);
}
