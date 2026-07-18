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

// Eigene Akzentfarbe (überschreibt das Theme, auf Wunsch)
const ACCENT_KEY = "divergenz_accent_v1";
export function loadAccent(): string { try { return localStorage.getItem(ACCENT_KEY) || ""; } catch { return ""; } }
export function saveAccent(c: string): void { try { if (c) localStorage.setItem(ACCENT_KEY, c); else localStorage.removeItem(ACCENT_KEY); } catch { /* voll */ } }

function parseHex(hex: string): [number, number, number] | null {
  const m = /^#?([0-9a-fA-F]{6})$/.exec(hex.trim());
  if (!m) return null;
  const n = parseInt(m[1]!, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
function darken(hex: string, f = 0.82): string {
  const rgb = parseHex(hex); if (!rgb) return hex;
  return "#" + rgb.map((x) => Math.round(x * f).toString(16).padStart(2, "0")).join("");
}
export function applyAccent(c: string): void {
  const s = document.documentElement.style;
  const rgb = parseHex(c);
  if (c && rgb) {
    s.setProperty("--acc", c);
    s.setProperty("--acc-hover", darken(c));
    s.setProperty("--focus-glow", `rgba(${rgb[0]},${rgb[1]},${rgb[2]},0.20)`);
  } else {
    s.removeProperty("--acc");
    s.removeProperty("--acc-hover");
    s.removeProperty("--focus-glow");
  }
}
