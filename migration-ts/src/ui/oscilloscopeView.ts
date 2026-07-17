// Oszilloskop-Tab: Satzrhythmus eines Textes visualisieren.
import { el, button } from "./dom";
import { icon } from "./icons";
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
  // Schatzkammer als Regler: von links nach rechts durch die Texte blättern (Echtzeit)
  const treasures = loadTreasury().slice().reverse();
  const trLabel = el("span", { class: "muted" });
  const trSlider = el("input", { id: "osz-treasure", type: "range", min: "0", max: String(Math.max(0, treasures.length - 1)), step: "1", value: "0", style: "flex:1" }) as HTMLInputElement;
  const loadTreasureAt = (): void => {
    const i = parseInt(trSlider.value, 10);
    const it = treasures[i];
    if (!it) return;
    ta.value = it.t;
    trLabel.textContent = `${i + 1}/${treasures.length}${it.who ? " · " + it.who : ""}${it.d ? " · " + it.d : ""}`;
    run();
  };
  trSlider.addEventListener("input", loadTreasureAt);
  const trRow = treasures.length
    ? el("label", { class: "field lenrow" }, "Schatzkammer ", trSlider, " ", trLabel)
    : el("p", { class: "muted" }, "Schatzkammer leer — im Studio Texte mit ⭐ Merken sichern.");
  const pullBtn = el("button", {}, icon("refresh"), " aus Generator");
  pullBtn.addEventListener("click", () => {
    const last = (() => { try { return localStorage.getItem("dm_last_text") || ""; } catch { return ""; } })();
    if (!last.trim()) { stats.innerHTML = '<span class="muted">Noch kein generierter Text — erst im Studio generieren.</span>'; return; }
    ta.value = last; run();
  });
  wrap.append(el("p", { class: "muted" }, "Kanal A — Text analysieren (vorbelegt mit der letzten Generierung)"), ta, el("div", { class: "btnrow" }, runBtn, pullBtn), trRow, viz, stats);
  root.append(wrap);
  if (ta.value.trim()) run();
}
