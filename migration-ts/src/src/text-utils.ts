// Reine Hilfsfunktionen ohne Zustand — 1:1 aus dem heutigen Code portiert,
// jetzt getypt. Kein DOM-Zugriff.

/** Trimmt und normalisiert Whitespace. */
export function clean(s: unknown): string {
  return (s ?? "").toString().trim().replace(/\s+/g, " ");
}

/** Zufälliges Element aus einer Liste. */
export function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]!;
}

/** Wie pick(), aber überspringt entartete/zu kurze Einträge (< minWords Wörter). */
export function pickSane(arr: readonly string[], minWords = 2): string {
  const list = Array.isArray(arr) ? arr : [];
  const ok = list.filter(
    (x) => String(x ?? "").trim().split(/\s+/).filter(Boolean).length >= minWords,
  );
  return (ok.length ? pick(ok) : pick(list)) ?? "";
}

/** Zufallsentscheidung mit Wahrscheinlichkeit p (0..1). */
export function chance(p: number): boolean {
  return Math.random() < p;
}

/** Stellt sicher, dass der String mit einem Satzzeichen endet. */
export function ensurePunct(s: string): string {
  s = clean(s);
  if (!s) return "";
  return /[.!?…]$/.test(s) ? s : s + ".";
}

/** Erster Buchstabe groß. */
export function capFirst(s: string): string {
  s = String(s ?? "").trim();
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
}

/** Regex-Sonderzeichen maskieren. */
export function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Zerlegt einen Text in Sätze (nach . ! ? …). */
export function splitSentences(txt: string): string[] {
  return txt.replace(/\s+/g, " ").trim().split(/(?<=[.!?…])\s+/).filter(Boolean);
}
