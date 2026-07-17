// Farb-Themes: setzt data-theme auf <html>, gespeichert in localStorage.
export interface ThemeDef { id: string; label: string; }
export const THEMES: ThemeDef[] = [
  { id: "maschinenraum", label: "Maschinenraum" },
  { id: "mitternacht", label: "Mitternacht" },
  { id: "bernstein", label: "Bernstein" },
  { id: "traumlogik", label: "Traumlogik" },
  { id: "papier", label: "Papier (hell)" },
];
const KEY = "divergenz_theme_v1";

export function loadTheme(): string {
  try { const v = localStorage.getItem(KEY); if (v && THEMES.some((t) => t.id === v)) return v; } catch { /* ignore */ }
  return "maschinenraum";
}
export function applyTheme(id: string): void {
  document.documentElement.setAttribute("data-theme", id);
  try { localStorage.setItem(KEY, id); } catch { /* voll */ }
}
