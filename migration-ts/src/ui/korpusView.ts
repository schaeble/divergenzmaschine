// Korpus-Tab: Trainingstext hinzufügen, Statistik, löschen, exportieren.
import { el, button } from "./dom";
import { loadPersistentCorpus, savePersistentCorpus, appendToPersistentCorpus, corpusHygiene } from "../corpus";

export function mountKorpus(root: HTMLElement): void {
  root.innerHTML = "";
  const wrap = el("div", {});
  const ta = el("textarea", { style: "height:160px", placeholder: "Trainings-Text für den Markov-Korpus" });
  const info = el("p", { class: "muted" });
  const refresh = (): void => { info.textContent = `Persistenter Korpus: ${loadPersistentCorpus().length} Zeichen`; };

  const addBtn = button("Zum Korpus hinzufügen");
  addBtn.addEventListener("click", () => {
    if (!ta.value.trim()) return;
    const h = corpusHygiene(ta.value);
    appendToPersistentCorpus(h.text);
    ta.value = "";
    refresh();
    info.textContent = `Hinzugefügt: ${h.stats.sentencesAfter} Sätze übernommen, ${h.stats.removed} verworfen. · ${info.textContent}`;
  });

  const cleanBtn = button("Korpus säubern");
  cleanBtn.addEventListener("click", () => {
    const cur = loadPersistentCorpus();
    if (!cur.trim()) { info.textContent = "Korpus ist leer."; return; }
    const h = corpusHygiene(cur);
    if (h.stats.removed === 0 && h.stats.duplicates === 0) { info.textContent = "Nichts zu säubern — Korpus ist bereits sauber."; return; }
    if (!confirm(`Säubern entfernt ${h.stats.removed} Sätze (davon ${h.stats.duplicates} Duplikate) und schrumpft den Korpus von ${h.stats.charsBefore} auf ${h.stats.charsAfter} Zeichen. Vorher exportieren? Abbrechen = nein. Fortfahren?`)) return;
    savePersistentCorpus(h.text);
    refresh();
    info.textContent = `Gesäubert: ${h.stats.sentencesBefore} → ${h.stats.sentencesAfter} Sätze (${h.stats.removed} entfernt, ${h.stats.duplicates} Duplikate).`;
  });

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

  wrap.append(ta, el("div", { class: "btnrow" }, addBtn, showBtn, cleanBtn, exportBtn, clearBtn), info, view,
    el("p", { class: "muted" }, "Säubern segmentiert den Korpus satzweise und entfernt Fragmente, Kopfzeilen-Reste und doppelte Sätze — der Markov-Generator lernt sonst Fehler mit. Neu hinzugefügter Text wird bereits beim Hinzufügen gesäubert."));
  root.append(wrap);
  refresh();
}
