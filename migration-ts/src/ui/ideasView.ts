// Ideen-Tab: Prämissen-Batch generieren und anzeigen.
import { el, button } from "./dom";
import { generateIdeaBatch } from "../generation/ideas";

export function mountIdeas(root: HTMLElement): void {
  root.innerHTML = "";
  const wrap = el("div", {});
  const count = el("input", { type: "number", value: "10", min: "1", max: "30", style: "width:70px" }) as HTMLInputElement;
  const genBtn = button("💡 Ideen generieren");
  const list = el("div", {});

  const render = (): void => {
    list.innerHTML = "";
    for (const idea of generateIdeaBatch(parseInt(count.value, 10) || 10)) {
      const take = button("→ Studio");
      take.addEventListener("click", () => {
        try { localStorage.setItem("dm_pending_ctx", JSON.stringify({ who: idea.seedWho, where: idea.seedWhere, when: idea.seedWhen, what: idea.seedWhat })); } catch { /* voll */ }
        const studioTab = [...document.querySelectorAll(".tabbar button")].find((b) => b.textContent === "Studio") as HTMLButtonElement | undefined;
        if (studioTab) studioTab.click();
      });
      list.append(el("div", { class: "idea" },
        el("p", { class: "idea-text" }, idea.text, el("span", { class: "muted" }, `  · ${idea.archetype} · ${idea.presetLabel}`)),
        take));
    }
  };
  genBtn.addEventListener("click", render);
  wrap.append(el("div", { class: "btnrow" }, "Anzahl ", count, " ", genBtn), list);
  root.append(wrap);
  render();
}
