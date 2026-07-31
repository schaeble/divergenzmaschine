// Offline-Wortarchiv: ein ungeordneter Pool aller eingefügten Wörter/Phrasen
// plus optionale, selbst benannte Gruppen. Rein lokal, ohne KI. Steht auch dem
// Preset-Assistenten als Import-Quelle bereit.
const KEY = "dm_offline_archive_v1";

export interface OfflineArchive { pool: string[]; groups: Record<string, string[]>; }

export function loadOffline(): OfflineArchive {
  try {
    const v = JSON.parse(localStorage.getItem(KEY) || "{}");
    const pool = Array.isArray(v.pool) ? (v.pool as unknown[]).map(String) : [];
    const groups = v.groups && typeof v.groups === "object" ? v.groups as Record<string, string[]> : {};
    return { pool, groups };
  } catch { return { pool: [], groups: {} }; }
}
export function saveOffline(a: OfflineArchive): void { try { localStorage.setItem(KEY, JSON.stringify(a)); } catch { /* voll */ } }

/** Zerlegt eingefügten Text in Einträge: pro Zeile ein Eintrag; einzeilig → nach Komma/Semikolon/Tab. */
export function splitEntries(text: string): string[] {
  let parts = (text || "").split(/[\r\n]+/).map((t) => t.trim()).filter(Boolean);
  if (parts.length <= 1) parts = (text || "").split(/[,;\t]+/).map((t) => t.trim()).filter(Boolean);
  return parts;
}

/** Fügt Einträge dem Pool hinzu (dedupliziert, case-insensitiv). Rückgabe: Anzahl neu. */
export function offlineAddPool(entries: string[]): number {
  const a = loadOffline();
  const have = new Set(a.pool.map((x) => x.toLowerCase()));
  let added = 0;
  for (const raw of entries) {
    const t = (raw || "").trim();
    if (!t || have.has(t.toLowerCase())) continue;
    have.add(t.toLowerCase()); a.pool.push(t); added++;
  }
  saveOffline(a); return added;
}
export function offlinePool(): string[] { return loadOffline().pool; }
export function offlineGroups(): Record<string, string[]> { return loadOffline().groups; }
export function offlineGroupNames(): string[] { return Object.keys(loadOffline().groups).sort((a, b) => a.localeCompare(b, "de")); }
export function offlineGroupEntries(name: string): string[] { return loadOffline().groups[name] || []; }

export function offlineRemoveFromPool(entry: string): void {
  const a = loadOffline(); a.pool = a.pool.filter((x) => x !== entry); saveOffline(a);
}
export function offlineClearPool(): void { const a = loadOffline(); a.pool = []; saveOffline(a); }

/** Legt/ergänzt eine benannte Gruppe mit den gewählten Einträgen (dedupliziert). */
export function offlineSetGroup(name: string, entries: string[]): void {
  const nm = (name || "").trim().slice(0, 40); if (!nm) return;
  const a = loadOffline();
  const have = new Set((a.groups[nm] || []).map((x) => x.toLowerCase()));
  const list = a.groups[nm] || (a.groups[nm] = []);
  for (const raw of entries) { const t = (raw || "").trim(); if (t && !have.has(t.toLowerCase())) { have.add(t.toLowerCase()); list.push(t); } }
  saveOffline(a);
}
export function offlineDeleteGroup(name: string): void { const a = loadOffline(); delete a.groups[name]; saveOffline(a); }

/** Benennt eine Gruppe um; existiert das Ziel bereits, werden die Einträge zusammengeführt. */
export function offlineRenameGroup(oldName: string, newName: string): void {
  const nm = (newName || "").trim().slice(0, 40);
  const a = loadOffline();
  if (!nm || !a.groups[oldName] || oldName === nm) return;
  const target = a.groups[nm] || [];
  const have = new Set(target.map((x) => x.toLowerCase()));
  for (const w of a.groups[oldName]!) if (!have.has(w.toLowerCase())) { have.add(w.toLowerCase()); target.push(w); }
  a.groups[nm] = target; delete a.groups[oldName]; saveOffline(a);
}
/** Entfernt einen Eintrag aus einer Gruppe (der Pool bleibt unberührt). */
export function offlineRemoveFromGroup(name: string, entry: string): void {
  const a = loadOffline(); if (!a.groups[name]) return;
  a.groups[name] = a.groups[name]!.filter((x) => x !== entry); saveOffline(a);
}
