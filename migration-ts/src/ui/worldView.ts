// Welt-Tab: Figuren, Orte, Zeitleiste; "Zeit vergeht", Kontext übernehmen, Reset.
import { el, button } from "./dom";
import { loadWorld, worldTick, worldFillContext, resetWorld } from "../features/world";

export function mountWorld(root: HTMLElement): void {
  root.innerHTML = "";
  const wrap = el("div", {});
  const cols = el("div", { class: "grid2" });
  const tl = el("div", {});

  const list = (title: string, items: string[]): HTMLElement =>
    el("div", {}, el("h3", {}, title),
      el("div", {}, ...(items.length ? items.map((i) => el("div", {}, i)) : [el("div", { class: "muted" }, "—")])));

  const render = (): void => {
    const w = loadWorld();
    cols.innerHTML = "";
    cols.append(list("Figuren", w.figuren), list("Orte", w.orte));
    tl.innerHTML = "";
    tl.append(el("h3", {}, `Zeitleiste (Tag ${w.tag})`),
      el("div", { class: "muted" }, ...w.timeline.slice(-12).reverse().map((t) => el("div", {}, t))));
  };

  const tickBtn = button("⏳ Zeit vergeht");
  tickBtn.addEventListener("click", () => { worldTick(); render(); });
  const useBtn = button("In Generator übernehmen");
  useBtn.addEventListener("click", () => {
    const ctx = worldFillContext();
    try { localStorage.setItem("dm_pending_ctx", JSON.stringify(ctx)); } catch { /* voll */ }
    alert(`Übernommen: ${ctx.who}, ${ctx.where}. Wechsle in den Studio-Tab.`);
  });
  const resetBtn = button("Welt zurücksetzen", "danger");
  resetBtn.addEventListener("click", () => { if (confirm("Welt wirklich zurücksetzen?")) { resetWorld(); render(); } });

  wrap.append(el("div", { class: "btnrow" }, tickBtn, useBtn, resetBtn), cols, tl);
  root.append(wrap);
  render();
}
