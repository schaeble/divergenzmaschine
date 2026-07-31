// Wortarchiv (offline) als Fenster: Wörter werden direkt in benannte Gruppen
// archiviert. Angezeigt werden nur die Gruppennamen (aufklappbar). Gruppen lassen
// sich umbenennen, ihr Inhalt kopieren, löschen. Steht dem Preset-Assistenten bereit.
import { el, button } from "./dom";
import { icon } from "./icons";
import {
  splitEntries, offlineAddPool, offlineGroups, offlineGroupEntries,
  offlineSetGroup, offlineDeleteGroup, offlineRenameGroup, offlineRemoveFromGroup,
} from "../features/offlinearchive";

export function openOfflineArchive(onClose?: () => void): void {
  const overlay = el("div", { class: "modal" });
  const close = el("button", { class: "x", "aria-label": "Schließen" }, icon("x"));
  const shut = (): void => { overlay.remove(); onClose?.(); };
  close.addEventListener("click", shut);
  overlay.addEventListener("click", (e) => { if (e.target === overlay) shut(); });

  const info = el("span", { class: "muted mini" });
  const manual = el("textarea", { style: "height:64px", placeholder: "Wörter einfügen — ein Eintrag pro Zeile" }) as HTMLTextAreaElement;
  const groupName = el("input", { placeholder: "Gruppenname", style: "flex:1" }) as HTMLInputElement;
  const groupsWrap = el("div", { class: "off-groups" });
  const expanded = new Set<string>();

  const render = (): void => {
    groupsWrap.innerHTML = "";
    const groups = offlineGroups();
    const names = Object.keys(groups).sort((a, b) => a.localeCompare(b, "de"));
    if (!names.length) { groupsWrap.append(el("span", { class: "muted mini" }, "Noch keine Gruppen — oben Wörter einfügen, Gruppennamen vergeben und „Archivieren“.")); return; }
    names.forEach((nm) => {
      const entries = groups[nm]!;
      const open = expanded.has(nm);
      const row = el("div", { class: "off-group" });
      const nameBtn = el("button", { class: "off-groupname", type: "button", title: open ? "Zuklappen" : "Aufklappen" }, (open ? "▾ " : "▸ ") + nm + ` (${entries.length})`);
      nameBtn.addEventListener("click", () => { if (open) expanded.delete(nm); else expanded.add(nm); render(); });
      const renameB = button("Umbenennen");
      renameB.addEventListener("click", () => {
        const raw = prompt("Neuer Gruppenname:", nm); if (raw === null) return;
        const neu = raw.trim(); if (!neu || neu === nm) return;
        if (offlineGroups()[neu] && !confirm(`„${neu}“ existiert bereits — zusammenführen?`)) return;
        offlineRenameGroup(nm, neu); if (expanded.has(nm)) { expanded.delete(nm); expanded.add(neu); } render();
      });
      const copyB = button("Inhalt kopieren");
      copyB.addEventListener("click", () => {
        const text = offlineGroupEntries(nm).join("\n");
        const nav = navigator as unknown as { clipboard?: { writeText?: (t: string) => Promise<void> } };
        if (nav.clipboard && nav.clipboard.writeText) nav.clipboard.writeText(text).then(() => { info.textContent = `„${nm}“ kopiert (${entries.length}).`; }).catch(() => { info.textContent = "Kopieren nicht möglich."; });
        else info.textContent = "Kopieren nicht möglich.";
      });
      const delB = button("Löschen", "danger");
      delB.addEventListener("click", () => { if (confirm(`Gruppe „${nm}“ löschen?`)) { offlineDeleteGroup(nm); expanded.delete(nm); render(); } });
      row.append(el("div", { class: "off-grouphead" }, nameBtn, renameB, copyB, delB));
      if (open) {
        const chips = el("div", { class: "off-chips" });
        entries.forEach((w) => {
          const x = el("button", { class: "off-x", type: "button", title: "Aus Gruppe entfernen" }, "✕");
          x.addEventListener("click", () => { offlineRemoveFromGroup(nm, w); render(); });
          chips.append(el("span", { class: "off-chip" }, w, x));
        });
        row.append(chips);
      }
      groupsWrap.append(row);
    });
  };

  const archive = (entries: string[]): void => {
    const nm = groupName.value.trim();
    if (!nm) { info.textContent = "Bitte einen Gruppennamen angeben."; groupName.focus(); return; }
    if (!entries.length) { info.textContent = "Keine Wörter zum Archivieren."; return; }
    offlineSetGroup(nm, entries);   // in die Gruppe
    offlineAddPool(entries);        // und in den Gesamtpool (für „Offline · Alle Wörter“ im Assistenten)
    manual.value = "";
    info.textContent = `${entries.length} in „${nm}“ archiviert.`;
    expanded.add(nm); render();
  };

  const pasteBtn = el("button", {}, icon("copy"), " Aus Zwischenablage");
  pasteBtn.addEventListener("click", () => {
    const nav = navigator as unknown as { clipboard?: { readText?: () => Promise<string> } };
    if (!nav.clipboard || !nav.clipboard.readText) { info.textContent = "Zwischenablage nicht lesbar — bitte Text ins Feld einfügen."; manual.focus(); return; }
    nav.clipboard.readText().then((txt) => { manual.value = (manual.value.trim() ? manual.value.replace(/\n+$/, "") + "\n" : "") + txt; info.textContent = "Aus Zwischenablage übernommen — Gruppennamen vergeben und archivieren."; manual.focus(); })
      .catch(() => { info.textContent = "Zwischenablage nicht lesbar — bitte Text ins Feld einfügen."; manual.focus(); });
  });
  const archiveBtn = el("button", { class: "primary" }, icon("folder"), " Archivieren");
  archiveBtn.addEventListener("click", () => archive(splitEntries(manual.value)));

  const card = el("div", { class: "modal-card wizard" },
    el("div", { class: "modal-head" }, el("h2", {}, "Wortarchiv (offline)"), close),
    el("div", { class: "modal-body wiz-body" },
      el("p", { class: "muted" }, "Füge Wörter ein, vergib einen Gruppennamen und archiviere sie. Es werden nur die Gruppennamen angezeigt — zum Ansehen aufklappen. Gruppen lassen sich umbenennen, ihr Inhalt kopieren. Sie stehen im Preset-Assistenten unter „Aus Archiv laden“ bereit."),
      el("div", { class: "btnrow" }, manual),
      el("div", { class: "btnrow" }, pasteBtn, groupName, archiveBtn),
      info,
      el("hr", {}),
      groupsWrap));
  overlay.append(card);
  document.body.append(overlay);
  render();
}
