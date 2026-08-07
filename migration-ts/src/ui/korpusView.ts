// Korpus-Tab: Trainingstext hinzufügen, Statistik, löschen, exportieren.
import { el, button } from "./dom";
import { loadPersistentCorpus, savePersistentCorpus, appendToPersistentCorpus, corpusHygiene } from "../corpus";
import { loadSettings, saveSettings } from "../storage";

export function mountKorpus(root: HTMLElement): void {
  root.innerHTML = "";
  const wrap = el("div", {});
  const ta = el("textarea", { style: "height:160px", placeholder: "Trainings-Text für den Markov-Korpus" });
  const info = el("p", { class: "muted" });
  const refresh = (): void => { info.textContent = `Persistenter Korpus: ${loadPersistentCorpus().length} Zeichen · ${loadPersistentCorpus().split(/\n{2,}/).filter((x) => x.trim()).length} Einträge`; };

  // ── Selbstfütterung ───────────────────────────────────────────────────
  // Ohne diesen Schalter wächst der Korpus nur über "Merken" und Handeingabe;
  // der Markov-Generator bleibt dann dauerhaft ohne Nahrung.
  const feedChk = el("input", { type: "checkbox", id: "korp-selffeed" }) as HTMLInputElement;
  feedChk.checked = (() => { try { const s = loadSettings(); return !!(s.enabled && s.learnStories); } catch { return false; } })();
  const feedNote = el("p", { class: "muted mini" });
  const updFeed = (): void => {
    feedNote.textContent = feedChk.checked
      ? "An: Bei eingeschalteter Bestenauslese wandert der Siegertext jeder Generierung in den Korpus. Der Markov-Generator lernt dadurch auch aus seinen eigenen Texten — das schärft den Ton, kann aber Wendungen verfestigen. Gelegentlich säubern."
      : "Aus: In den Korpus kommt nur, was du merkst oder von Hand einfügst. Ist der Korpus leer, liefert der Markov-Regler im Studio nichts.";
  };
  feedChk.addEventListener("change", () => {
    try {
      const s = loadSettings();
      saveSettings({ ...s, enabled: feedChk.checked, learnStories: true });
    } catch { /* voll */ }
    updFeed();
  });
  const feedLbl = el("label", { class: "chk", title: "Schreibt den Siegertext der Bestenauslese in den Korpus." }, feedChk, " Selbstfütterung: erzeugte Texte aufnehmen");
  updFeed();

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

  wrap.append(ta, el("div", { class: "btnrow" }, addBtn, showBtn, mgrBtn, cleanBtn, exportBtn, clearBtn), info,
    el("div", { class: "btnrow" }, feedLbl), feedNote, view, mgr,
    el("p", { class: "muted" }, "Säubern segmentiert den Korpus satzweise und entfernt Fragmente, Kopfzeilen-Reste und doppelte Sätze — der Markov-Generator lernt sonst Fehler mit. Neu hinzugefügter Text wird bereits beim Hinzufügen gesäubert."),
    el("p", { class: "muted rightsnote" }, "⚖ Rechtlicher Hinweis: Dieser Text wird auf zwei Wegen weiterverwendet. Der Markov-Generator lernt daraus und kann Wortfolgen wiedergeben. Und der Regler „Korpus-Bausteine“ im Werkzeugkasten setzt ganze Sätze von hier — nicht Fragmente, sondern vollständige Sätze — unverändert in den erzeugten Text. Fügst du urheberrechtlich geschützte Literatur ein, auch Übersetzungen, die sind eigenständig geschützt, selbst wenn das Original gemeinfrei ist, dann steht sie wörtlich in deinen Texten. Für den privaten Gebrauch ist das unbedenklich; vor einer Veröffentlichung prüfe, woraus dein Korpus besteht. Unbedenklich sind eigene Texte, die Erzeugnisse dieser App und gemeinfreie Werke (Urheber vor mehr als 70 Jahren verstorben)."));
  root.append(wrap);
  refresh();
}
