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
      list.append(el("p", { class: "card" },
        idea.text, el("span", { class: "muted" }, `  · ${idea.archetype} · ${idea.presetLabel}`)));
    }
  };
  genBtn.addEventListener("click", render);
  wrap.append(el("div", { class: "btnrow" }, "Anzahl ", count, " ", genBtn), list);
  root.append(wrap);
  render();
}
