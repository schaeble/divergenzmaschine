// Diagnose-Tab: Selbsttest der eingebauten Features. Zeigt pro Feature eine
// Ampel-Kachel (greift / sporadisch / greift nicht / nicht prüfbar) und darunter
// eine Pulsreihe: ein Punkt je Testlauf, leuchtend wenn das Feature gewirkt hat.
import { el } from "./dom";
import { icon } from "./icons";
import { runSelfTest, type FeatureResult } from "../features/selftest";

const VERDICT_LABEL: Record<string, string> = {
  ok: "greift", sporadic: "greift sporadisch", dead: "greift nicht", skipped: "nicht prüfbar",
};

export function mountDiagnose(root: HTMLElement): void {
  root.innerHTML = "";
  const wrap = el("div", {});
  const status = el("span", { class: "muted mini" });
  const summary = el("div", { class: "diag-summary" });
  const body = el("div", {});

  const render = (res: FeatureResult[]): void => {
    body.innerHTML = ""; summary.innerHTML = "";
    const count = (v: string): number => res.filter((r) => r.verdict === v).length;
    summary.append(
      el("span", { class: "diag-sum ok" }, `${count("ok")} greifen`),
      el("span", { class: "diag-sum sporadic" }, `${count("sporadic")} sporadisch`),
      el("span", { class: "diag-sum dead" }, `${count("dead")} ohne Wirkung`),
      el("span", { class: "diag-sum skipped" }, `${count("skipped")} nicht prüfbar`));

    const groups = [...new Set(res.map((r) => r.group))];
    for (const g of groups) {
      body.append(el("h3", {}, g));
      const grid = el("div", { class: "diag-grid" });
      res.filter((r) => r.group === g).forEach((r) => {
        const hits = r.runs.filter(Boolean).length;
        const card = el("div", { class: "diag-card " + r.verdict });
        const pulse = el("div", { class: "diag-pulse" });
        r.runs.forEach((hit) => pulse.append(el("span", { class: "diag-dot" + (hit ? " on" : "") })));
        card.append(
          el("div", { class: "diag-head" }, el("span", { class: "diag-lamp" }), el("b", {}, r.label)),
          el("div", { class: "diag-verdict" }, VERDICT_LABEL[r.verdict] || r.verdict,
            ...(r.runs.length ? [el("span", { class: "muted mini" }, ` · ${hits} von ${r.runs.length} Läufen`)] : [])),
          ...(r.runs.length ? [pulse] : []),
          el("div", { class: "muted mini diag-note" }, r.note));
        grid.append(card);
      });
      body.append(grid);
    }
  };

  const startBtn = el("button", { class: "primary" }, icon("play"), " Selbsttest starten") as HTMLButtonElement;
  startBtn.addEventListener("click", () => {
    startBtn.disabled = true; status.textContent = "Läuft…"; body.innerHTML = ""; summary.innerHTML = "";
    // Im nächsten Frame starten, damit der Status sichtbar wird
    setTimeout(() => {
      try {
        const res = runSelfTest((done, total, label) => { status.textContent = `Prüfe ${done}/${total} — ${label}`; });
        status.textContent = "Fertig · " + new Date().toLocaleTimeString("de-DE");
        render(res);
      } catch (e) { status.textContent = "Fehlgeschlagen: " + (e instanceof Error ? e.message : String(e)); }
      finally { startBtn.disabled = false; }
    }, 30);
  });

  wrap.append(
    el("h2", {}, "Diagnose — greifen alle Features?"),
    el("p", { class: "muted" }, "Der Selbsttest erzeugt pro Feature mehrere Texte und prüft, ob das Feature im Ergebnis nachweisbar wirkt. Kein Qualitätsurteil — nur die Frage, ob der Schalter etwas bewirkt. Viele Features sind absichtlich sporadisch (z. B. der Disruptor feuert nur gelegentlich); die Pulsreihe zeigt das als gepunkteten Streifen statt als Fehler."),
    el("div", { class: "btnrow" }, startBtn, status),
    summary,
    body,
    el("p", { class: "muted mini" }, "Legende: ● grün = greift zuverlässig · ● gelb = greift sporadisch (oft gewollt) · ● rot = keine Wirkung nachweisbar · ● grau = nicht prüfbar (fehlende Voraussetzung, z. B. leerer Korpus). Jeder Punkt der Reihe ist ein Testlauf."));
  root.append(wrap);
}
