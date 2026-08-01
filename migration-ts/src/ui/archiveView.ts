// Wortarchiv (vereinheitlicht): EIN Fenster mit zwei Füllwegen — per KI erzeugen
// oder Wörter einfügen — und einer gemeinsamen Gruppenverwaltung. Nur die
// Gruppennamen sind sichtbar (aufklappbar); Umbenennen, Inhalt kopieren, Löschen.
import { el, button } from "./dom";
import { icon } from "./icons";
import { ARCHIVE_CATS, catLabel, archiveReady, generateArchive } from "../features/wordarchive";
import { splitEntries } from "../features/offlinearchive";
import { archiveGroups, addToGroup, renameGroup, deleteGroup, removeFromGroup, groupEntries } from "../features/archive2";

export function openArchive(onClose?: () => void): void {
  const overlay = el("div", { class: "modal" });
  const close = el("button", { class: "x", "aria-label": "Schließen" }, icon("x"));
  const shut = (): void => { overlay.remove(); onClose?.(); };
  close.addEventListener("click", shut);
  overlay.addEventListener("click", (e) => { if (e.target === overlay) shut(); });

  const info = el("span", { class: "muted mini" });
  const expanded = new Set<string>();
  const groupsWrap = el("div", { class: "off-groups" });

  const renderGroups = (): void => {
    groupsWrap.innerHTML = "";
    const groups = archiveGroups().slice().sort((a, b) => a.name.localeCompare(b.name, "de"));
    if (!groups.length) { groupsWrap.append(el("span", { class: "muted mini" }, "Noch keine Gruppen — oben per KI erzeugen oder Wörter einfügen.")); return; }
    groups.forEach((g) => {
      const nm = g.name;
      const open = expanded.has(nm);
      const row = el("div", { class: "off-group" });
      const nameBtn = el("button", { class: "off-groupname", type: "button", title: open ? "Zuklappen" : "Aufklappen" },
        (open ? "▾ " : "▸ ") + nm + ` (${g.entries.length})` + (g.cat ? ` · ${catLabel(g.cat)}` : ""));
      nameBtn.addEventListener("click", () => { if (open) expanded.delete(nm); else expanded.add(nm); renderGroups(); });
      const renameB = button("Umbenennen");
      renameB.addEventListener("click", () => {
        const raw = prompt("Neuer Gruppenname:", nm); if (raw === null) return;
        const neu = raw.trim(); if (!neu || neu === nm) return;
        if (archiveGroups().some((x) => x.name === neu) && !confirm(`„${neu}“ existiert bereits — zusammenführen?`)) return;
        renameGroup(nm, neu); if (expanded.has(nm)) { expanded.delete(nm); expanded.add(neu); } renderGroups();
      });
      const copyB = button("Inhalt kopieren");
      copyB.addEventListener("click", () => {
        const text = groupEntries(nm).join("\n");
        const nav = navigator as unknown as { clipboard?: { writeText?: (t: string) => Promise<void> } };
        if (nav.clipboard && nav.clipboard.writeText) nav.clipboard.writeText(text).then(() => { info.textContent = `„${nm}“ kopiert (${g.entries.length}).`; }).catch(() => { info.textContent = "Kopieren nicht möglich."; });
        else info.textContent = "Kopieren nicht möglich.";
      });
      const delB = button("Löschen", "danger");
      delB.addEventListener("click", () => { if (confirm(`Gruppe „${nm}“ löschen?`)) { deleteGroup(nm); expanded.delete(nm); renderGroups(); } });
      row.append(el("div", { class: "off-grouphead" }, nameBtn, renameB, copyB, delB));
      if (open) {
        const chips = el("div", { class: "off-chips" });
        g.entries.forEach((w) => {
          const x = el("button", { class: "off-x", type: "button", title: "Aus Gruppe entfernen" }, "✕");
          x.addEventListener("click", () => { removeFromGroup(nm, w); renderGroups(); });
          chips.append(el("span", { class: "off-chip" }, w, x));
        });
        row.append(chips);
      }
      groupsWrap.append(row);
    });
  };

  // ── Füllweg 1: per KI erzeugen ──
  const themeIn = el("input", { class: "wiz-name", placeholder: "Thema/Stimmung (optional), z. B. „Hafen bei Nacht“" }) as HTMLInputElement;
  const boxes: Record<string, HTMLInputElement> = {};
  const catGrid = el("div", { class: "wa-cats" });
  ARCHIVE_CATS.forEach(([id, label]) => {
    const cb = el("input", { type: "checkbox" }) as HTMLInputElement;
    if (["motifs", "hooks", "props", "turns", "obstacles", "stakes", "endings"].includes(id)) cb.checked = true;
    boxes[id] = cb;
    catGrid.append(el("label", { class: "chk mpitem" }, cb, " " + label));
  });
  const setAll = (v: boolean): void => { for (const id in boxes) boxes[id]!.checked = v; };
  const allBtn = button("Alle"); allBtn.addEventListener("click", () => setAll(true));
  const noneBtn = button("Keine"); noneBtn.addEventListener("click", () => setAll(false));
  const genBtn = el("button", { class: "primary" }, icon("play"), " Generieren (KI)");
  const genStatus = el("span", { class: "muted mini" });
  const results = el("div", { class: "wa-results" });
  let blockSavers: Array<() => number> = [];
  const archiveAllBtn = el("button", { class: "primary" }, "Alles archivieren") as HTMLButtonElement;
  archiveAllBtn.disabled = true;
  archiveAllBtn.addEventListener("click", () => {
    const n = blockSavers.reduce((sum, fn) => sum + fn(), 0);
    info.textContent = ` ${n} Einträge archiviert`;
    renderGroups();
  });
  genBtn.addEventListener("click", () => {
    const rdy = archiveReady();
    if (!rdy.ok) { genStatus.textContent = rdy.msg || "Nicht verfügbar."; return; }
    const cats = Object.keys(boxes).filter((id) => boxes[id]!.checked);
    if (!cats.length) { genStatus.textContent = "Bitte mindestens eine Kategorie wählen."; return; }
    genBtn.disabled = true; archiveAllBtn.disabled = true; blockSavers = [];
    genStatus.textContent = `Erzeuge… 0/${cats.length}`; results.innerHTML = "";
    generateArchive(themeIn.value, cats, 15, (d, t) => { genStatus.textContent = `Erzeuge… ${d}/${t}`; }).then((res) => {
      genStatus.textContent = "";
      const theme = themeIn.value.trim();
      ARCHIVE_CATS.filter(([id]) => res[id]?.length).forEach(([id, label]) => {
        const entries = res[id]!;
        const block = el("div", { class: "wa-block" });
        const checks: HTMLInputElement[] = [];
        const chips = el("div", { class: "wa-genchips" });
        entries.forEach((t) => {
          const cb = el("input", { type: "checkbox" }) as HTMLInputElement; cb.checked = true; checks.push(cb);
          (cb as unknown as { _t: string })._t = t;
          chips.append(el("label", { class: "chk wa-genitem" }, cb, " " + t));
        });
        const add = button("Archivieren");
        const binfo = el("span", { class: "muted mini" });
        const saveBlock = (): number => {
          const keep = checks.filter((c) => c.checked).map((c) => (c as unknown as { _t: string })._t);
          const gname = label + (theme ? " · " + theme : "");
          const n = addToGroup(gname, keep, id, theme || undefined);
          binfo.textContent = ` ${n} → „${gname}“`;
          return n;
        };
        blockSavers.push(saveBlock);
        add.addEventListener("click", () => { saveBlock(); renderGroups(); });
        block.append(el("div", { class: "wa-blockhead" }, el("b", {}, label + ` (${entries.length})`), add, binfo), chips);
        results.append(block);
      });
      archiveAllBtn.disabled = blockSavers.length === 0;
      if (!results.children.length) results.append(el("p", { class: "muted" }, "Keine Einträge erhalten — bitte erneut versuchen."));
    }).catch((err: unknown) => { genStatus.textContent = "Fehlgeschlagen: " + (err instanceof Error ? err.message : String(err)); })
      .finally(() => { genBtn.disabled = false; });
  });

  // ── Füllweg 2: Wörter einfügen ──
  const manual = el("textarea", { style: "height:64px", placeholder: "Wörter einfügen — ein Eintrag pro Zeile" }) as HTMLTextAreaElement;
  const groupName = el("input", { placeholder: "Gruppenname", style: "flex:1" }) as HTMLInputElement;
  const pasteBtn = el("button", {}, icon("copy"), " Aus Zwischenablage");
  pasteBtn.addEventListener("click", () => {
    const nav = navigator as unknown as { clipboard?: { readText?: () => Promise<string> } };
    if (!nav.clipboard || !nav.clipboard.readText) { info.textContent = "Zwischenablage nicht lesbar — bitte Text ins Feld einfügen."; manual.focus(); return; }
    nav.clipboard.readText().then((txt) => { manual.value = (manual.value.trim() ? manual.value.replace(/\n+$/, "") + "\n" : "") + txt; manual.focus(); })
      .catch(() => { info.textContent = "Zwischenablage nicht lesbar — bitte Text ins Feld einfügen."; manual.focus(); });
  });
  const addManualBtn = el("button", { class: "primary" }, icon("folder"), " Archivieren");
  addManualBtn.addEventListener("click", () => {
    const nm = groupName.value.trim();
    const entries = splitEntries(manual.value);
    if (!nm) { info.textContent = "Bitte einen Gruppennamen angeben."; groupName.focus(); return; }
    if (!entries.length) { info.textContent = "Keine Wörter zum Archivieren."; return; }
    const n = addToGroup(nm, entries);
    manual.value = ""; info.textContent = `${n} in „${nm}“ archiviert.`;
    expanded.add(nm); renderGroups();
  });

  const kiSec = el("details", { class: "fine", open: "" },
    el("summary", {}, icon("flask"), " Per KI erzeugen"),
    el("div", { class: "field" }, el("span", { class: "field-label" }, "Thema"), themeIn),
    el("div", { class: "field" }, el("span", { class: "field-label lockrow" }, el("span", {}, "Kategorien"), el("span", { class: "btnrow" }, allBtn, noneBtn)), catGrid),
    el("div", { class: "wiz-ex" }, genBtn, archiveAllBtn, genStatus),
    results);
  const pasteSec = el("details", { class: "fine" },
    el("summary", {}, icon("copy"), " Wörter einfügen"),
    el("div", { class: "btnrow" }, manual),
    el("div", { class: "btnrow" }, pasteBtn, groupName, addManualBtn));

  const card = el("div", { class: "modal-card wizard" },
    el("div", { class: "modal-head" }, el("h2", {}, "Wortarchiv"), close),
    el("div", { class: "modal-body wiz-body" },
      el("p", { class: "muted" }, "Ein Archiv, zwei Füllwege: per KI erzeugen oder Wörter einfügen. Alles landet in benannten Gruppen — nur die Namen sind sichtbar, zum Ansehen aufklappen. Gruppen stehen im Preset-Assistenten unter „Aus Archiv laden“ bereit."),
      kiSec,
      pasteSec,
      info,
      el("hr", {}),
      groupsWrap));
  overlay.append(card);
  document.body.append(overlay);
  renderGroups();
}
