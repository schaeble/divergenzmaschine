// Wortarchiv (offline) als Fenster: ungeordneter Pool aus der Zwischenablage,
// bei Bedarf in selbst benannte Gruppen. Steht dem Preset-Assistenten bereit.
import { el, button } from "./dom";
import { icon } from "./icons";
import {
  splitEntries, offlineAddPool, offlinePool, offlineGroups,
  offlineRemoveFromPool, offlineClearPool, offlineSetGroup, offlineDeleteGroup,
} from "../features/offlinearchive";

export function openOfflineArchive(onClose?: () => void): void {
  const overlay = el("div", { class: "modal" });
  const close = el("button", { class: "x", "aria-label": "Schließen" }, icon("x"));
  const shut = (): void => { overlay.remove(); onClose?.(); };
  close.addEventListener("click", shut);
  overlay.addEventListener("click", (e) => { if (e.target === overlay) shut(); });

  const info = el("span", { class: "muted mini" });
  const manual = el("textarea", { style: "height:60px", placeholder: "…oder hier Wörter einfügen (ein Eintrag pro Zeile) und „Hinzufügen“" }) as HTMLTextAreaElement;
  const poolWrap = el("div", { class: "off-pool" });
  const groupsWrap = el("div", {});
  const groupName = el("input", { placeholder: "Gruppenname", style: "flex:1" }) as HTMLInputElement;
  let checks: HTMLInputElement[] = [];

  const render = (): void => {
    poolWrap.innerHTML = ""; checks = [];
    const pool = offlinePool();
    poolWrap.append(el("div", { class: "muted mini" }, `Alle Wörter (${pool.length}) — ankreuzen zum Gruppieren:`));
    if (!pool.length) poolWrap.append(el("span", { class: "muted mini" }, "Noch nichts eingefügt."));
    const chips = el("div", { class: "off-chips" });
    pool.forEach((w) => {
      const cb = el("input", { type: "checkbox" }) as HTMLInputElement; cb.value = w; checks.push(cb);
      const del = el("button", { class: "off-x", type: "button", title: "Entfernen" }, "✕");
      del.addEventListener("click", () => { offlineRemoveFromPool(w); render(); });
      chips.append(el("label", { class: "off-chip" }, cb, " " + w, del));
    });
    poolWrap.append(chips);
    groupsWrap.innerHTML = "";
    const groups = offlineGroups();
    const names = Object.keys(groups).sort((a, b) => a.localeCompare(b, "de"));
    if (names.length) {
      groupsWrap.append(el("div", { class: "muted mini" }, "Gruppen:"));
      names.forEach((nm) => {
        const g = el("div", { class: "off-group" });
        const delG = el("button", { class: "danger", type: "button" }, "Gruppe löschen");
        delG.addEventListener("click", () => { offlineDeleteGroup(nm); render(); });
        g.append(el("div", { class: "off-grouphead" }, el("b", {}, `${nm} (${groups[nm]!.length})`), delG),
          el("div", { class: "off-chips" }, ...groups[nm]!.map((w) => el("span", { class: "off-chip" }, w))));
        groupsWrap.append(g);
      });
    }
  };

  const pasteBtn = el("button", { class: "primary" }, icon("copy"), " Aus Zwischenablage einfügen");
  pasteBtn.addEventListener("click", () => {
    const nav = navigator as unknown as { clipboard?: { readText?: () => Promise<string> } };
    if (!nav.clipboard || !nav.clipboard.readText) { info.textContent = "Zwischenablage nicht lesbar — bitte unten manuell einfügen."; manual.focus(); return; }
    nav.clipboard.readText().then((txt) => { const n = offlineAddPool(splitEntries(txt)); info.textContent = `${n} eingefügt`; render(); })
      .catch(() => { info.textContent = "Zwischenablage nicht lesbar — bitte unten manuell einfügen."; manual.focus(); });
  });
  const addBtn = button("Hinzufügen");
  addBtn.addEventListener("click", () => { const n = offlineAddPool(splitEntries(manual.value)); manual.value = ""; info.textContent = `${n} hinzugefügt`; render(); });
  const clearBtn = button("Pool leeren", "danger");
  clearBtn.addEventListener("click", () => { if (offlinePool().length && confirm("Alle Wörter im Offline-Pool löschen? (Gruppen bleiben.)")) { offlineClearPool(); render(); } });
  const groupBtn = button("Auswahl als Gruppe speichern");
  groupBtn.addEventListener("click", () => {
    const sel = checks.filter((c) => c.checked).map((c) => c.value);
    const nm = groupName.value.trim();
    if (!nm) { info.textContent = "Bitte Gruppennamen angeben."; return; }
    if (!sel.length) { info.textContent = "Bitte Einträge ankreuzen."; return; }
    offlineSetGroup(nm, sel); groupName.value = ""; info.textContent = `Gruppe „${nm}“ gespeichert (${sel.length}).`; render();
  });

  const card = el("div", { class: "modal-card wizard" },
    el("div", { class: "modal-head" }, el("h2", {}, "Wortarchiv (offline)"), close),
    el("div", { class: "modal-body wiz-body" },
      el("p", { class: "muted" }, "Füge Wörter aus der Zwischenablage in einen ungeordneten Pool. Bei Bedarf kreuzt du Einträge an und speicherst sie unter einem eigenen Gruppennamen. Pool und Gruppen stehen im Preset-Assistenten unter „Aus Archiv laden“ bereit."),
      el("div", { class: "btnrow" }, pasteBtn, clearBtn, info),
      el("div", { class: "btnrow" }, manual, addBtn),
      poolWrap,
      el("div", { class: "btnrow" }, groupName, groupBtn),
      groupsWrap));
  overlay.append(card);
  document.body.append(overlay);
  render();
}
