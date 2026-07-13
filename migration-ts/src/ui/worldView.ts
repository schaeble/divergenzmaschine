// Welt-Tab: Figuren, Orte, Zeitleiste; "Zeit vergeht", Kontext übernehmen, Reset.
import { el, button } from "./dom";
import { loadWorld, worldTick, worldFillContext, resetWorld } from "../features/world";

export function mountWorld(root: HTMLElement): void {
  root.innerHTML = "";
  const wrap = el("div", { style: "max-width:720px;margin:1rem auto" });
  const cols = el("div", { style: "display:grid;grid-template-columns:1fr 1fr;gap:12px" });
  const tl = el("div", { style: "margin-top:12px" });

  const list = (title: string, items: string[]): HTMLElement =>
    el("div", {}, el("h3", { style: "font:600 13px system-ui;margin:.3rem 0" }, title),
      el("div", { style: "font:13px/1.5 system-ui;color:#333" }, ...(items.length ? items.map((i) => el("div", {}, i)) : [el("div", { style: "color:#999" }, "—")])));

  const render = (): void => {
    const w = loadWorld();
    cols.innerHTML = "";
    cols.append(list("Figuren", w.figuren), list("Orte", w.orte));
    tl.innerHTML = "";
    tl.append(el("h3", { style: "font:600 13px system-ui;margin:.3rem 0" }, `Zeitleiste (Tag ${w.tag})`),
      el("div", { style: "font:12px/1.5 system-ui;color:#555" }, ...w.timeline.slice(-12).reverse().map((t) => el("div", {}, t))));
  };

  const tickBtn = button("⏳ Zeit vergeht");
  tickBtn.addEventListener("click", () => { worldTick(); render(); });
  const useBtn = button("In Generator übernehmen");
  useBtn.addEventListener("click", () => {
    const ctx = worldFillContext();
    try { localStorage.setItem("dm_pending_ctx", JSON.stringify(ctx)); } catch { /* voll */ }
    alert(`Übernommen: ${ctx.who}, ${ctx.where}. Wechsle in den Studio-Tab.`);
  });
  const resetBtn = button("Welt zurücksetzen", "color:#a00");
  resetBtn.addEventListener("click", () => { if (confirm("Welt wirklich zurücksetzen?")) { resetWorld(); render(); } });

  wrap.append(el("div", {}, tickBtn, useBtn, resetBtn), cols, tl);
  root.append(wrap);
  render();
}
