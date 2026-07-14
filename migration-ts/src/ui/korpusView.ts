// Korpus-Tab: Trainingstext hinzufügen, Statistik, löschen, exportieren.
import { el, button } from "./dom";
import { loadPersistentCorpus, savePersistentCorpus, appendToPersistentCorpus } from "../corpus";

export function mountKorpus(root: HTMLElement): void {
  root.innerHTML = "";
  const wrap = el("div", {});
  const ta = el("textarea", { style: "height:160px", placeholder: "Trainings-Text für den Markov-Korpus" });
  const info = el("p", { class: "muted" });
  const refresh = (): void => { info.textContent = `Persistenter Korpus: ${loadPersistentCorpus().length} Zeichen`; };

  const addBtn = button("Zum Korpus hinzufügen");
  addBtn.addEventListener("click", () => { if (ta.value.trim()) { appendToPersistentCorpus(ta.value); ta.value = ""; refresh(); } });

  const clearBtn = button("Korpus löschen", "danger");
  clearBtn.addEventListener("click", () => { if (confirm("Korpus wirklich löschen?")) { savePersistentCorpus(""); refresh(); } });

  const exportBtn = button("Export (TXT)");
  exportBtn.addEventListener("click", () => {
    const blob = new Blob([loadPersistentCorpus()], { type: "text/plain" });
    const a = el("a", { href: URL.createObjectURL(blob), download: "korpus.txt" });
    a.click();
  });

  wrap.append(ta, el("div", { class: "btnrow" }, addBtn, clearBtn, exportBtn), info);
  root.append(wrap);
  refresh();
}
