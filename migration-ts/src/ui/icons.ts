// Monochrome Linien-Icons (Tabler-Stil), erben Farbe/Größe vom Button-Text.
const P: Record<string, string> = {
  floppy: '<path d="M6 4h10l4 4v10a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2"/><circle cx="12" cy="14" r="2"/><path d="M14 4v4h-6v-4"/>',
  folder: '<path d="M5 4h4l3 3h7a2 2 0 0 1 2 2v8a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-11a2 2 0 0 1 2 -2"/>',
  dice: '<rect x="4" y="4" width="16" height="16" rx="2"/><circle cx="8.5" cy="8.5" r="1"/><circle cx="15.5" cy="8.5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="8.5" cy="15.5" r="1"/><circle cx="15.5" cy="15.5" r="1"/>',
  pin: '<path d="M9 4h6"/><path d="M10 4v6l-2 4v2h8v-2l-2 -4v-6"/><path d="M12 16v5"/>',
  play: '<path d="M7 4v16l13 -8z"/>',
  star: '<path d="M12 4l2.5 5l5.5 .8l-4 3.9l1 5.5l-5 -2.6l-5 2.6l1 -5.5l-4 -3.9l5.5 -.8z"/>',
  book: '<path d="M3 5a3 3 0 0 1 6 0v14a2 2 0 0 0 -4 0"/><path d="M9 5a3 3 0 0 1 6 0v14"/><path d="M15 5a3 3 0 0 1 6 0v11a2 2 0 0 1 -2 2h-8"/>',
  volume: '<path d="M6 15h-2a1 1 0 0 1 -1 -1v-4a1 1 0 0 1 1 -1h2l3.5 -4.5a.8 .8 0 0 1 1.5 .5v14a.8 .8 0 0 1 -1.5 .5z"/><path d="M15 8a5 5 0 0 1 0 8"/>',
  copy: '<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8v-2a2 2 0 0 0 -2 -2h-8a2 2 0 0 0 -2 2v8a2 2 0 0 0 2 2h2"/>',
  tool: '<path d="M7 10h3v-3l-3.2 -3.2a5.5 5.5 0 0 1 7.4 7.4l6 6a2 2 0 0 1 -2.8 2.8l-6 -6a5.5 5.5 0 0 1 -7.4 -7.4z"/>',
  settings: '<path d="M10.3 4.3c.4 -1.7 2.9 -1.7 3.3 0a1.7 1.7 0 0 0 2.6 1.1c1.5 -.9 3.3 .8 2.4 2.4a1.7 1.7 0 0 0 1 2.5c1.8 .4 1.8 2.9 0 3.3a1.7 1.7 0 0 0 -1 2.6c.9 1.5 -.8 3.3 -2.4 2.4a1.7 1.7 0 0 0 -2.6 1c-.4 1.8 -2.9 1.8 -3.3 0a1.7 1.7 0 0 0 -2.6 -1c-1.5 .9 -3.3 -.8 -2.4 -2.4a1.7 1.7 0 0 0 -1 -2.6c-1.8 -.4 -1.8 -2.9 0 -3.3a1.7 1.7 0 0 0 1 -2.5c-.9 -1.6 .9 -3.3 2.4 -2.4c1 .6 2.3 .1 2.6 -1z"/><circle cx="12" cy="12" r="3"/>',
  flask: '<path d="M9 3h6"/><path d="M10 9h4"/><path d="M10 3v6l-4.5 9.5a.9 .9 0 0 0 .8 1.5h11.4a.9 .9 0 0 0 .8 -1.5l-4.5 -9.5v-6"/>',
  refresh: '<path d="M20 11a8 8 0 0 0 -15.5 -2m-.5 -4v4h4"/><path d="M4 13a8 8 0 0 0 15.5 2m.5 4v-4h-4"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/>',
  arrowRight: '<path d="M5 12h14"/><path d="M13 6l6 6l-6 6"/>',
};
export function icon(name: string, size = 16): HTMLSpanElement {
  const s = document.createElement("span");
  s.className = "ic";
  s.setAttribute("aria-hidden", "true");
  s.innerHTML = `<svg viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">${P[name] || ""}</svg>`;
  return s;
}
