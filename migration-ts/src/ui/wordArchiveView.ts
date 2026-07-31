// Wortarchiv (KI-online): Wort-/Phrasen-Kategorien zum Thema erzeugen, prüfen,
// archivieren. Die archivierten Einträge stehen im Preset-Assistenten zum Import bereit.
import { el, button } from "./dom";
import { icon } from "./icons";
import {
  ARCHIVE_CATS, archiveAdd, archiveCount, archiveClearCat,
  archiveReady, generateArchive,
} from "../features/wordarchive";

export function openWordArchive(onClose?: () => void): void {
  const overlay = el("div", { class: "modal" });
  const close = el("button", { class: "x", "aria-label": "Schließen" }, icon("x"));
  const shut = (): void => { overlay.remove(); onClose?.(); };
  close.addEventListener("click", shut);
  overlay.addEventListener("click", (e) => { if (e.target === overlay) shut(); });

  const themeIn = el("input", { class: "wiz-name", placeholder: "Thema/Stimmung (optional), z. B. „Hafen bei Nacht“" }) as HTMLInputElement;

  // Kategorie-Auswahl
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
  const status = el("span", { class: "muted mini" });
  const results = el("div", { class: "wa-results" });

  const overview = el("div", { class: "wa-overview" });
  const renderOverview = (): void => {
    overview.innerHTML = "";
    const nonEmpty = ARCHIVE_CATS.filter(([id]) => archiveCount(id) > 0);
    if (!nonEmpty.length) { overview.append(el("span", { class: "muted mini" }, "Archiv noch leer.")); return; }
    overview.append(el("div", { class: "muted mini" }, "Im Archiv:"));
    const row = el("div", { class: "wa-ovrow" });
    nonEmpty.forEach(([id, label]) => {
      const chip = el("span", { class: "wa-ovchip" }, `${label}: ${archiveCount(id)}`);
      const x = el("button", { class: "wa-ovx", type: "button", title: "Kategorie leeren" }, "✕");
      x.addEventListener("click", () => { if (confirm(`Kategorie „${label}“ im Archiv leeren?`)) { archiveClearCat(id); renderOverview(); } });
      chip.append(x); row.append(chip);
    });
    overview.append(row);
  };

  genBtn.addEventListener("click", () => {
    const rdy = archiveReady();
    if (!rdy.ok) { status.textContent = rdy.msg || "Nicht verfügbar."; return; }
    const cats = Object.keys(boxes).filter((id) => boxes[id]!.checked);
    if (!cats.length) { status.textContent = "Bitte mindestens eine Kategorie wählen."; return; }
    genBtn.disabled = true; status.textContent = "Erzeuge…"; results.innerHTML = "";
    generateArchive(themeIn.value, cats).then((res) => {
      status.textContent = "";
      const theme = themeIn.value.trim();
      ARCHIVE_CATS.filter(([id]) => res[id]?.length).forEach(([id, label]) => {
        const entries = res[id]!;
        const block = el("div", { class: "wa-block" });
        const checks: HTMLInputElement[] = [];
        const chips = el("div", { class: "wa-genchips" });
        entries.forEach((t) => {
          const cb = el("input", { type: "checkbox" }) as HTMLInputElement; cb.checked = true; checks.push(cb);
          const lab = el("label", { class: "chk wa-genitem" }, cb, " " + t);
          (cb as unknown as { _t: string })._t = t;
          chips.append(lab);
        });
        const add = button("Archivieren");
        const info = el("span", { class: "muted mini" });
        add.addEventListener("click", () => {
          const keep = checks.filter((c) => c.checked).map((c) => (c as unknown as { _t: string })._t);
          const n = archiveAdd(id, keep, theme);
          info.textContent = ` ${n} archiviert${theme ? " · Thema „" + theme + "“" : ""}`;
          renderOverview();
        });
        block.append(
          el("div", { class: "wa-blockhead" }, el("b", {}, label + ` (${entries.length})`), add, info),
          chips);
        results.append(block);
      });
      if (!results.children.length) results.append(el("p", { class: "muted" }, "Keine Einträge erhalten — bitte erneut versuchen."));
    }).catch((err: unknown) => { status.textContent = "Fehlgeschlagen: " + (err instanceof Error ? err.message : String(err)); })
      .finally(() => { genBtn.disabled = false; });
  });

  const card = el("div", { class: "modal-card wizard" },
    el("div", { class: "modal-head" }, el("h2", {}, "Wortarchiv (KI)"), close),
    el("div", { class: "modal-body wiz-body" },
      el("p", { class: "muted" }, "Erzeuge Wort- und Phrasen-Kategorien zu einem Thema, prüfe sie und archiviere sie. Im Preset-Assistenten kannst du archivierte Einträge dann pro Schritt über „Aus Archiv laden“ übernehmen."),
      el("div", { class: "field" }, el("span", { class: "field-label" }, "Thema"), themeIn),
      el("div", { class: "field" }, el("span", { class: "field-label lockrow" }, el("span", {}, "Kategorien"), el("span", { class: "btnrow" }, allBtn, noneBtn)), catGrid),
      el("div", { class: "wiz-ex" }, genBtn, status),
      results,
      el("hr", {}),
      overview));
  overlay.append(card);
  document.body.append(overlay);
  renderOverview();
}
