// Wortarchiv: gesammelte, per KI erzeugte Wort-/Phrasen-Kategorien, die dem
// Preset-Assistenten als Import-Quelle dienen. Rein lokal gespeichert.
import { loadAiKey, isOnline, callClaude, extractJson } from "./ki";

export interface ArchiveEntry { t: string; theme?: string; }
export type Archive = Record<string, ArchiveEntry[]>;

const KEY = "dm_wordarchive_v1";

// Kategorien: 7 Kern + Dramaturgie (2.0) + 3 kuriose. id → [Label, KI-Hinweis]
export const ARCHIVE_CATS: [string, string, string][] = [
  ["motifs", "Motive", "kurze, bildhafte Kernbilder (3–8 Wörter), ohne Punkt"],
  ["hooks", "Hooks", "auslösende Details/Reize, die neugierig machen"],
  ["props", "Requisiten", "Gegenstände mit Artikel (der/die/das …)"],
  ["turns", "Wendungen", "Wendepunkte als kurzer Satz/Phrase"],
  ["obstacles", "Hindernisse", "Widerstände, die sich der Figur entgegenstellen"],
  ["stakes", "Einsätze", "was auf dem Spiel steht"],
  ["endings", "Enden", "Schlussbilder oder -sätze"],
  ["einstieg", "Einstiege", "knappe Anfangs-Phasen eines Erzählbogens"],
  ["mitte", "Mitten", "Phasen der Entwicklung in der Mitte"],
  ["hoehepunkt", "Höhepunkte", "Zuspitzungen/Wendemomente"],
  ["schluss", "Schlüsse", "Schluss-Stilworte (z. B. offen, melancholisch)"],
  ["ausloeser", "Auslöser", "was die Wende in Gang setzt"],
  ["veraenderungen", "Veränderungen", "wie sich Figur oder Welt wandelt"],
  ["konflikte", "Konflikte", "typische Spannungen/Gegensätze (X gegen Y)"],
  ["zeitanomalien", "Zeitanomalien", "Brüche in der Zeit"],
  ["regeln", "Weltregeln", "Natur-/Weltgesetze, die im Text gelten"],
  ["kuriose_woerter", "Kuriose deutsche Wörter", "seltene, schöne oder skurrile deutsche Substantive (ein Wort), z. B. Kummerspeck, Fernweh, Ohrwurm"],
  ["kuriose_gegenstaende", "Kuriose Gegenstände", "ungewöhnliche, skurrile Gegenstände mit Artikel, z. B. „ein Nebelhorn ohne Schiff“"],
  ["kuriose_wendungen", "Kuriose Wendungen", "überraschende, schräge Wendungen oder Redewendungen als kurze Phrase"],
];
export const catLabel = (id: string): string => ARCHIVE_CATS.find((c) => c[0] === id)?.[1] || id;

export function loadArchive(): Archive {
  try { const v = JSON.parse(localStorage.getItem(KEY) || "{}"); return v && typeof v === "object" ? v as Archive : {}; } catch { return {}; }
}
export function saveArchive(a: Archive): void { try { localStorage.setItem(KEY, JSON.stringify(a)); } catch { /* voll */ } }

/** Fügt Einträge einer Kategorie hinzu (dedupliziert, case-insensitiv). Rückgabe: Anzahl neu. */
export function archiveAdd(cat: string, entries: string[], theme?: string): number {
  const a = loadArchive();
  const list = a[cat] || (a[cat] = []);
  const have = new Set(list.map((e) => e.t.toLowerCase()));
  let added = 0;
  for (const raw of entries) {
    const t = (raw || "").trim();
    if (!t || have.has(t.toLowerCase())) continue;
    have.add(t.toLowerCase());
    list.push({ t, theme: theme && theme.trim() ? theme.trim() : undefined });
    added++;
  }
  saveArchive(a);
  return added;
}
export function archiveGet(cat: string): ArchiveEntry[] { return loadArchive()[cat] || []; }
export function archiveThemes(cat: string): string[] {
  const set = new Set<string>();
  for (const e of archiveGet(cat)) if (e.theme) set.add(e.theme);
  return [...set].sort((a, b) => a.localeCompare(b, "de"));
}
export function archiveCount(cat: string): number { return (loadArchive()[cat] || []).length; }
export function archiveRemoveEntry(cat: string, t: string): void {
  const a = loadArchive(); if (!a[cat]) return;
  a[cat] = a[cat]!.filter((e) => e.t !== t); saveArchive(a);
}
export function archiveClearCat(cat: string): void { const a = loadArchive(); delete a[cat]; saveArchive(a); }

export function archiveReady(): { ok: boolean; msg?: string } {
  if (!isOnline()) return { ok: false, msg: "Offline — das Wortarchiv braucht eine Internetverbindung." };
  if (!loadAiKey()) return { ok: false, msg: "Kein API-Schlüssel — bitte unter Studio ▸ Einstellungen ▸ KI-Zugang hinterlegen." };
  return { ok: true };
}

/** Erzeugt per KI pro gewählter Kategorie ~15 Einträge zum Thema. */
export async function generateArchive(theme: string, cats: string[], perCat = 15): Promise<Record<string, string[]>> {
  const chosen = ARCHIVE_CATS.filter((c) => cats.includes(c[0]));
  const themeLine = theme.trim() ? `Thema/Stimmung: „${theme.trim()}“. Alle Einträge sollen dazu passen.` : "Frei erfunden, stimmig und konkret.";
  const catBlock = chosen.map((c) => `  "${c[0]}": [${perCat} Einträge — ${c[2]}]`).join(",\n");
  const prompt = "Du hilfst, ein Wortarchiv für ein deutsches Schreibwerkzeug zu füllen. "
    + themeLine + "\n\n"
    + `Gib pro Kategorie ${perCat} konkrete, kurze deutsche Einträge. Konkret und bildhaft, keine Erklärungen, keine Nummerierung. `
    + "Requisiten/Gegenstände mit Artikel. Kuriose deutsche Wörter sind einzelne Substantive.\n\n"
    + "Antworte AUSSCHLIESSLICH mit einem JSON-Objekt in genau dieser Form:\n{\n" + catBlock + "\n}";
  const raw = await callClaude(prompt, 3000, "{");
  const obj = extractJson(raw.trim().startsWith("{") ? raw : "{" + raw) as Record<string, unknown>;
  const out: Record<string, string[]> = {};
  for (const c of chosen) {
    const arr = obj[c[0]];
    out[c[0]] = Array.isArray(arr) ? arr.map((x) => String(x).trim()).filter(Boolean) : [];
  }
  return out;
}
