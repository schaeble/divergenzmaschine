// Schriftart/-größe der Story-Ausgabe (Studio-Regler), lokal persistiert.
export const STORY_FONT_STACKS: Record<string, string> = {
  serif: "Georgia, 'Iowan Old Style', 'Times New Roman', serif",
  classic: "'Times New Roman', Times, serif",
  sans: "'Syne', 'Segoe UI', system-ui, sans-serif",
  mono: "'DM Mono', ui-monospace, monospace",
};
const FONT_KEY = "divergenz_story_font_v1";
const SIZE_KEY = "divergenz_story_fontsize_v1";
export const FONT_DEFAULT = "serif";
export const SIZE_DEFAULT = 19;

export function loadFont(): string { try { return localStorage.getItem(FONT_KEY) || FONT_DEFAULT; } catch { return FONT_DEFAULT; } }
export function loadFontSize(): number { try { const v = parseFloat(localStorage.getItem(SIZE_KEY) || ""); return Number.isFinite(v) ? v : SIZE_DEFAULT; } catch { return SIZE_DEFAULT; } }
export function saveFontPrefs(fam: string, size: number): void { try { localStorage.setItem(FONT_KEY, fam); localStorage.setItem(SIZE_KEY, String(size)); } catch { /* voll */ } }
export function applyStoryFont(host: HTMLElement, fam: string, size: number): void {
  host.style.fontFamily = STORY_FONT_STACKS[fam] || STORY_FONT_STACKS.serif;
  host.style.fontSize = size + "px";
}
