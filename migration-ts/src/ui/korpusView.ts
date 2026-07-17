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

  const view = el("pre", { class: "out", style: "display:none;max-height:320px;overflow:auto;margin-top:10px" });
  const showBtn = button("Inhalt anzeigen");
  let shown = false;
  showBtn.addEventListener("click", () => {
    shown = !shown;
    if (shown) {
      const c = loadPersistentCorpus();
      view.textContent = c ? (c.length > 6000 ? "…(gekürzt, letzte 6000 Zeichen)\n\n" + c.slice(-6000) : c) : "(Korpus ist leer)";
      view.style.display = ""; showBtn.textContent = "Inhalt ausblenden";
    } else { view.style.display = "none"; showBtn.textContent = "Inhalt anzeigen"; }
  });
  const exportBtn = button("Export (TXT)");
  exportBtn.addEventListener("click", () => {
    const blob = new Blob([loadPersistentCorpus()], { type: "text/plain" });
    const a = el("a", { href: URL.createObjectURL(blob), download: "korpus.txt" });
    a.click();
  });

  wrap.append(ta, el("div", { class: "btnrow" }, addBtn, showBtn, clearBtn, exportBtn), info, view);
  root.append(wrap);
  refresh();
}
