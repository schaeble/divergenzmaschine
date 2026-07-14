// Schatzkammer-Tab: gesammelte Texte ansehen, ins Studio übernehmen, löschen, exportieren.
import { el, button } from "./dom";
import { loadTreasury, deleteTreasureAt, exportTreasuryTxt } from "../features/treasury";

export function mountTreasury(root: HTMLElement): void {
  root.innerHTML = "";
  const wrap = el("div", {});
  const list = el("div", {});

  const render = (): void => {
    const items = loadTreasury();
    list.innerHTML = "";
    if (!items.length) { list.append(el("p", { class: "muted" }, "Noch nichts gemerkt — im Studio auf ⭐ Merken klicken.")); return; }
    items.slice().reverse().forEach((it, ri) => {
      const idx = items.length - 1 - ri;
      const meta = [it.who, it.where, it.when].filter(Boolean).join(" · ");
      const take = button("→ Studio");
      take.addEventListener("click", () => {
        try { localStorage.setItem("dm_pending_ctx", JSON.stringify({ who: it.who, where: it.where, when: it.when, what: it.what })); } catch { /* voll */ }
        const st = [...document.querySelectorAll(".tabbar button")].find((b) => b.textContent === "Studio") as HTMLButtonElement | undefined;
        if (st) st.click();
      });
      const copy = button("Kopieren");
      copy.addEventListener("click", () => { void navigator.clipboard?.writeText(it.t); });
      const del = button("Löschen", "danger");
      del.addEventListener("click", () => { deleteTreasureAt(idx); render(); });
      list.append(el("div", { class: "treasure" },
        el("div", { class: "treasure-meta" }, `${it.d}${meta ? "  ·  " + meta : ""}`),
        el("pre", { class: "out treasure-text" }, it.t),
        el("div", { class: "btnrow" }, take, copy, del)));
    });
  };

  const exportBtn = button("Alle als TXT exportieren");
  exportBtn.addEventListener("click", () => {
    const blob = new Blob([exportTreasuryTxt()], { type: "text/plain" });
    const a = el("a", { href: URL.createObjectURL(blob), download: "schatzkammer.txt" });
    a.click();
  });
  wrap.append(el("h2", {}, "⭐ Schatzkammer"), el("div", { class: "btnrow" }, exportBtn), list);
  root.append(wrap);
  render();
}
