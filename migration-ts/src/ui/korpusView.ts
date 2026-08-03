// Korpus-Tab: Trainingstext hinzufügen, Statistik, löschen, exportieren.
import { el, button } from "./dom";
import { loadPersistentCorpus, savePersistentCorpus, appendToPersistentCorpus, corpusHygiene } from "../corpus";

export function mountKorpus(root: HTMLElement): void {
  root.innerHTML = "";
  const wrap = el("div", {});
  const ta = el("textarea", { style: "height:160px", placeholder: "Trainings-Text für den Markov-Korpus" });
  const info = el("p", { class: "muted" });
  const refresh = (): void => { info.textContent = `Persistenter Korpus: ${loadPersistentCorpus().length} Zeichen · ${loadPersistentCorpus().split(/\n{2,}/).filter((x) => x.trim()).length} Einträge`; };

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

  // ── Einträge einzeln löschen ──────────────────────────────────────────
  const segsOf = (): string[] => loadPersistentCorpus().split(/\n{2,}/).map((x) => x.trim()).filter(Boolean);
  const mgr = el("div", { class: "korpus-mgr", style: "display:none;margin-top:10px" });
  const renderMgr = (): void => {
    mgr.innerHTML = "";
    const segs = segsOf();
    if (!segs.length) { mgr.append(el("p", { class: "muted" }, "Korpus ist leer.")); return; }
    mgr.append(el("p", { class: "muted" }, `${segs.length} ${segs.length === 1 ? "Eintrag" : "Einträge"} — einzeln löschbar:`));
    segs.forEach((seg, i) => {
      const words = (seg.match(/\S+/g) || []).length;
      const prev = seg.length > 200 ? seg.slice(0, 200) + "…" : seg;
      const del = button("Löschen", "danger");
      del.addEventListener("click", () => {
        const cur = segsOf();
        if (i >= cur.length) { renderMgr(); return; }
        if (!confirm(`Diesen Eintrag (#${i + 1}) aus dem Korpus löschen?`)) return;
        cur.splice(i, 1);
        savePersistentCorpus(cur.join("\n\n"));
        renderMgr(); refresh();
      });
      mgr.append(el("div", { class: "korpus-entry" },
        el("div", { class: "muted mini" }, `#${i + 1} · ${words} Wörter`),
        el("div", { class: "korpus-prev" }, prev),
        el("div", { class: "btnrow" }, del)));
    });
  };
  const mgrBtn = button("Einträge verwalten");
  let mgrShown = false;
  mgrBtn.addEventListener("click", () => {
    mgrShown = !mgrShown;
    if (mgrShown) { renderMgr(); mgr.style.display = ""; mgrBtn.textContent = "Verwaltung ausblenden"; }
    else { mgr.style.display = "none"; mgrBtn.textContent = "Einträge verwalten"; }
  });

  wrap.append(ta, el("div", { class: "btnrow" }, addBtn, showBtn, mgrBtn, cleanBtn, exportBtn, clearBtn), info, view, mgr,
    el("p", { class: "muted" }, "Säubern segmentiert den Korpus satzweise und entfernt Fragmente, Kopfzeilen-Reste und doppelte Sätze — der Markov-Generator lernt sonst Fehler mit. Neu hinzugefügter Text wird bereits beim Hinzufügen gesäubert."),
    el("p", { class: "muted rightsnote" }, "⚖ Rechtlicher Hinweis: Der Markov-Generator lernt aus genau diesem Text und kann Wortfolgen daraus im erzeugten Text wiedergeben. Fügst du urheberrechtlich geschützte Literatur ein — auch Übersetzungen, die sind eigenständig geschützt, selbst wenn das Original gemeinfrei ist —, können Fragmente davon in deinen Texten auftauchen. Für den privaten Gebrauch ist das unbedenklich; vor einer Veröffentlichung prüfe, woraus dein Korpus besteht. Unbedenklich sind eigene Texte und gemeinfreie Werke (Urheber vor mehr als 70 Jahren verstorben)."));
  root.append(wrap);
  refresh();
}
