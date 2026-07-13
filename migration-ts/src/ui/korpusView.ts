// Korpus-Tab: Trainingstext hinzufügen, Statistik, löschen, exportieren.
import { el, button } from "./dom";
import { loadPersistentCorpus, savePersistentCorpus, appendToPersistentCorpus } from "../corpus";

export function mountKorpus(root: HTMLElement): void {
  root.innerHTML = "";
  const wrap = el("div", { style: "max-width:720px;margin:1rem auto" });
  const ta = el("textarea", { style: "width:100%;height:160px;padding:8px;font:13px monospace", placeholder: "Trainings-Text für den Markov-Korpus" });
  const info = el("p", { style: "font:12px system-ui;color:#777" });
  const refresh = (): void => { info.textContent = `Persistenter Korpus: ${loadPersistentCorpus().length} Zeichen`; };

  const addBtn = button("Zum Korpus hinzufügen");
  addBtn.addEventListener("click", () => { if (ta.value.trim()) { appendToPersistentCorpus(ta.value); ta.value = ""; refresh(); } });

  const clearBtn = button("Korpus löschen", "color:#a00");
  clearBtn.addEventListener("click", () => { if (confirm("Korpus wirklich löschen?")) { savePersistentCorpus(""); refresh(); } });

  const exportBtn = button("Export (TXT)");
  exportBtn.addEventListener("click", () => {
    const blob = new Blob([loadPersistentCorpus()], { type: "text/plain" });
    const a = el("a", { href: URL.createObjectURL(blob), download: "korpus.txt" });
    a.click();
  });

  wrap.append(ta, el("div", {}, addBtn, clearBtn, exportBtn), info);
  root.append(wrap);
  refresh();
}
