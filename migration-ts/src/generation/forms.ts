// Vers-/Sonderformen: Prosagedicht, Gedicht-Strang, Reim, Haiku, Drama.
// Prosagedicht ist 1:1 portiert; die übrigen sind formtreu, aber gegenüber
// den sehr detaillierten Original-Heuristiken gestrafft (kürzere Helferketten).
import { applyReimPoem } from "./reim";
import { applyHaikuPoem } from "./haiku";
import { applyStrangPoem } from "./strang";
import { buildDramaConflict, applyDramaModule } from "./drama";

/** Prosagedicht: je 2 Sätze ein Block. (1:1 aus dem Original.) */
export function asProsePoem(text: string): string {
  const s = text.replace(/\s+/g, " ").split(/(?<=[.!?…])\s+/).filter(Boolean);
  const lines: string[] = [];
  for (let i = 0; i < s.length; i++) { lines.push(s[i]!); if ((i + 1) % 2 === 0 && i < s.length - 1) lines.push(""); }
  return lines.join("\n");
}

// ── gemeinsame Vers-Helfer ──────────────────────────────────────────

/** Gedicht-Strang: delegiert an die faithful Engine. */
export function asStrang(text: string, anchor = ""): string {
  return applyStrangPoem(text, anchor);
}

/** Reim: echter Paarreim (AABB) — delegiert an die faithful Engine. */
export function asReim(text: string, anchor = ""): string {
  return applyReimPoem(text, anchor);
}

/** Haiku: echtes 5-7-5 — delegiert an die faithful Engine. */
export function asHaiku(text: string, anchor = ""): string {
  return applyHaikuPoem(text, anchor);
}

// ── Drama ──────────────────────────────────────────────────────────
export function asDrama(text: string, whoA: string, whoB: string): string {
  return applyDramaModule(text, buildDramaConflict(whoA, whoB, (whoA || "") + "|" + (whoB || "")));
}
