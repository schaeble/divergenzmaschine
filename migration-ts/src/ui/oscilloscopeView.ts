// Oszilloskop-Tab: Satzrhythmus eines Textes visualisieren.
import { el, button } from "./dom";
import { analyze, buildSVG } from "../features/oscilloscope";
import { loadTreasury } from "../features/treasury";

const fmt = (x: number, d = 1): string => x.toFixed(d);

export function mountOscilloscope(root: HTMLElement): void {
  root.innerHTML = "";
  const wrap = el("div", {});
  const ta = el("textarea", { style: "height:120px" }) as HTMLTextAreaElement;
  ta.value = (() => { try { return localStorage.getItem("dm_last_text") || ""; } catch { return ""; } })();
  const viz = el("div", {});
  const stats = el("div", { class: "card" });

  const run = (): void => {
    const m = analyze(ta.value);
    viz.innerHTML = buildSVG(m.wave);
    stats.innerHTML = [
      ["Ø Satzlänge", fmt(m.avgLen), ""], ["Streuung σ", fmt(m.stdLen), ""],
      ["Lexikalische Vielfalt", fmt(m.ttr * 100), "%"], ["Wiederholungsdichte", fmt(m.repetitionRatio * 100), "%"],
      ["Interpunktionsdichte", fmt(m.punctDensity * 100), ""],
    ].map(([l, v, u]) => `<div style="display:flex;justify-content:space-between;border-bottom:1px solid #eee;padding:4px 0"><span>${l}</span><b>${v}${u}</b></div>`).join("");
  };
  const runBtn = button("Analysieren");
  runBtn.addEventListener("click", run);
  const treasures = loadTreasury().slice().reverse();
  const trSel = el("select", {},
    el("option", { value: "" }, treasures.length ? "— aus Schatzkammer wählen —" : "— Schatzkammer leer —"),
    ...treasures.map((it, i) => el("option", { value: String(i) }, `${it.d}${it.who ? " · " + it.who : ""}: ${it.t.slice(0, 40)}…`))) as HTMLSelectElement;
  trSel.addEventListener("change", () => {
    const i = parseInt(trSel.value, 10);
    if (!Number.isNaN(i) && treasures[i]) { ta.value = treasures[i]!.t; run(); }
  });
  const pullBtn = button("↺ aus Generator");
  pullBtn.addEventListener("click", () => {
    const last = (() => { try { return localStorage.getItem("dm_last_text") || ""; } catch { return ""; } })();
    if (!last.trim()) { stats.innerHTML = '<span class="muted">Noch kein generierter Text — erst im Studio generieren.</span>'; return; }
    ta.value = last; run();
  });
  wrap.append(el("p", { class: "muted" }, "Kanal A — Text analysieren (vorbelegt mit der letzten Generierung)"), ta, el("div", { class: "btnrow" }, runBtn, pullBtn, trSel), viz, stats);
  root.append(wrap);
  if (ta.value.trim()) run();
}
