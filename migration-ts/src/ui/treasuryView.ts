// Schatzkammer-Tab: Übersicht + gesammelte Texte ansehen, ins Studio übernehmen,
// löschen, exportieren. Zeigt pro Text Form-Typ und Wortzahl.
import { el, button } from "./dom";
import { icon } from "./icons";
import {
  loadTreasury, deleteTreasureAt, clearTreasury, exportTreasuryTxt,
  treasureType, wordCount, treasureStats,
} from "../features/treasury";

const nf = (n: number): string => n.toLocaleString("de-DE");

export function mountTreasury(root: HTMLElement): void {
  root.innerHTML = "";
  const wrap = el("div", {});
  const overview = el("div", { class: "treasure-overview" });
  const list = el("div", {});
  let clearBtn: HTMLButtonElement;
  let filter: string | null = null; // aktiver Form-Filter (Anzeigename) oder null = alle

  const renderOverview = (items: ReturnType<typeof loadTreasury>): void => {
    overview.innerHTML = "";
    if (!items.length) {
      overview.append(el("span", { class: "muted" }, "Noch keine Texte gesammelt."));
      return;
    }
    const st = treasureStats(items);
    overview.append(el("div", { class: "big" },
      `${nf(st.total)} ${st.total === 1 ? "Text" : "Texte"} · ${nf(st.words)} Wörter · Ø ${nf(st.avg)} pro Text`));
    const chips = el("div", { class: "chips" });
    const allChip = el("button", { class: "tchip" + (filter === null ? " active" : ""), type: "button" },
      `Alle · ${nf(st.total)}`) as HTMLButtonElement;
    allChip.addEventListener("click", () => { filter = null; render(); });
    chips.append(allChip);
    Object.entries(st.byType).sort((a, b) => b[1] - a[1]).forEach(([ty, n]) => {
      const chip = el("button", { class: "tchip" + (filter === ty ? " active" : ""), type: "button" },
        `${ty} · ${n}`) as HTMLButtonElement;
      chip.addEventListener("click", () => { filter = filter === ty ? null : ty; render(); });
      chips.append(chip);
    });
    overview.append(chips);
  };

  const render = (): void => {
    const all = loadTreasury();
    if (clearBtn) clearBtn.disabled = all.length === 0;
    renderOverview(all);
    const items = filter ? all.filter((it) => treasureType(it) === filter) : all;
    list.innerHTML = "";
    if (!all.length) {
      list.append(el("p", { class: "muted" }, "Noch nichts gemerkt — im Studio auf ⭐ Merken klicken."));
      return;
    }
    if (!items.length) {
      list.append(el("p", { class: "muted" }, `Keine Texte der Form „${filter}“.`));
      return;
    }
    items.slice().reverse().forEach((it) => {
      const idx = all.indexOf(it);
      const ctxMeta = [it.who, it.where, it.when].filter(Boolean).join(" · ");
      const type = treasureType(it);
      const wc = wordCount(it.t);

      const take = el("button", {}, icon("arrowRight"), " Studio");
      take.addEventListener("click", () => {
        try {
          localStorage.setItem("dm_pending_ctx", JSON.stringify({ who: it.who, where: it.where, when: it.when, what: it.what }));
          localStorage.setItem("dm_pending_text", it.t);
        } catch { /* Speicher gesperrt */ }
        const stab = [...document.querySelectorAll(".tabbar button")].find((b) => b.textContent === "Studio") as HTMLButtonElement | undefined;
        if (stab) stab.click();
      });
      const copy = button("Kopieren");
      copy.addEventListener("click", () => { void navigator.clipboard?.writeText(it.t); });
      const speakLbl = el("span", {}, "Vorlesen");
      const speak = el("button", {}, icon("volume"), " ", speakLbl);
      let speaking = false;
      speak.addEventListener("click", () => {
        const synth = window.speechSynthesis;
        if (!synth) return;
        if (speaking) { synth.cancel(); speaking = false; speakLbl.textContent = "Vorlesen"; return; }
        synth.cancel();
        const u = new SpeechSynthesisUtterance(it.t); u.lang = "de-DE";
        u.onend = () => { speaking = false; speakLbl.textContent = "Vorlesen"; };
        speaking = true; speakLbl.textContent = "Stopp"; synth.speak(u);
      });
      const del = button("Löschen", "danger");
      del.addEventListener("click", () => { deleteTreasureAt(idx); render(); });

      const metaRow = el("div", { class: "treasure-meta" },
        el("span", { class: "tbadge" }, type),
        el("span", { class: "tcount" }, `${nf(wc)} Wörter`),
        el("span", { class: "tdate" }, it.d),
        ...(ctxMeta ? [el("span", { class: "tctx" }, ctxMeta)] : []));

      list.append(el("div", { class: "treasure" },
        metaRow,
        el("pre", { class: "out treasure-text" }, it.t),
        el("div", { class: "btnrow" }, take, copy, speak, del)));
    });
  };

  const exportBtn = button("Alle als TXT exportieren");
  exportBtn.addEventListener("click", () => {
    const blob = new Blob([exportTreasuryTxt()], { type: "text/plain" });
    const a = el("a", { href: URL.createObjectURL(blob), download: "schatzkammer.txt" });
    a.click();
  });
  clearBtn = button("Alle löschen", "danger");
  clearBtn.addEventListener("click", () => {
    const n = loadTreasury().length;
    if (!n) return;
    if (!confirm(`Alle ${n} Texte aus der Schatzkammer löschen? Das lässt sich nicht rückgängig machen. (Korpus und Pools bleiben erhalten.)`)) return;
    clearTreasury();
    render();
  });

  wrap.append(
    el("h2", {}, "⭐ Schatzkammer"),
    overview,
    el("div", { class: "btnrow" }, exportBtn, clearBtn),
    list);
  root.append(wrap);
  render();
}
