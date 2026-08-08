// Gemeinsame Darstellung des Selbsttests — genutzt im Diagnose-Tab und
// kompakt im Studio unter der Ausgabe.
import { el } from "./dom";
import type { FeatureResult } from "../features/selftest";

const VERDICT_LABEL: Record<string, string> = {
  ok: "greift", sporadic: "greift sporadisch", dead: "greift nicht", skipped: "nicht prüfbar",
};

/** Zusammenfassung als Chips (grün/gelb/rot/grau). */
export function renderSummary(res: FeatureResult[]): HTMLElement {
  const zahl = (v: string): number => res.filter((r) => r.verdict === v).length;
  return el("div", { class: "diag-summary" },
    el("span", { class: "diag-sum ok" }, `${zahl("ok")} greifen`),
    el("span", { class: "diag-sum sporadic" }, `${zahl("sporadic")} sporadisch`),
    el("span", { class: "diag-sum dead" }, `${zahl("dead")} ohne Wirkung`),
    el("span", { class: "diag-sum skipped" }, `${zahl("skipped")} nicht prüfbar`));
}

/** Volle Ansicht: nach Gruppen, mit Pulsreihen. `kompakt` lässt die Reihen weg. */
export function renderSelfTest(res: FeatureResult[], kompakt = false): HTMLElement {
  const box = el("div", {});
  const gruppen = [...new Set(res.map((r) => r.group))];
  for (const g of gruppen) {
    box.append(el("h3", {}, g));
    const grid = el("div", { class: "diag-grid" });
    res.filter((r) => r.group === g).forEach((r) => {
      const treffer = r.runs.filter(Boolean).length;
      const karte = el("div", { class: "diag-card " + r.verdict });
      karte.append(
        el("div", { class: "diag-head" }, el("span", { class: "diag-lamp" }), el("b", {}, r.label)),
        el("div", { class: "diag-verdict" }, VERDICT_LABEL[r.verdict] || r.verdict,
          ...(r.runs.length ? [el("span", { class: "muted mini" }, ` · ${treffer} von ${r.runs.length} Läufen`)] : [])));
      if (!kompakt && r.runs.length) {
        const puls = el("div", { class: "diag-pulse" });
        r.runs.forEach((hit) => puls.append(el("span", { class: "diag-dot" + (hit ? " on" : "") })));
        karte.append(puls);
      }
      karte.append(el("div", { class: "muted mini diag-note" }, r.note));
      grid.append(karte);
    });
    box.append(grid);
  }
  return box;
}
