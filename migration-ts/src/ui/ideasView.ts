// Ideen-Tab: Prämissen-Batch generieren und anzeigen.
import { el, button } from "./dom";
import { generateIdeaBatch } from "../generation/ideas";

export function mountIdeas(root: HTMLElement): void {
  root.innerHTML = "";
  const wrap = el("div", { style: "max-width:720px;margin:1rem auto" });
  const count = el("input", { type: "number", value: "10", min: "1", max: "30", style: "width:60px;padding:6px" }) as HTMLInputElement;
  const genBtn = button("💡 Ideen generieren");
  const list = el("div", { style: "margin-top:12px" });

  const render = (): void => {
    list.innerHTML = "";
    for (const idea of generateIdeaBatch(parseInt(count.value, 10) || 10)) {
      list.append(el("p", { style: "margin:8px 0;padding:8px;background:#f6f6f6;border-radius:6px;font:14px/1.5 system-ui" },
        idea.text, el("span", { style: "color:#999;font-size:12px" }, `  · ${idea.archetype} · ${idea.presetLabel}`)));
    }
  };
  genBtn.addEventListener("click", render);
  wrap.append(el("div", {}, "Anzahl ", count, " ", genBtn), list);
  root.append(wrap);
  render();
}
