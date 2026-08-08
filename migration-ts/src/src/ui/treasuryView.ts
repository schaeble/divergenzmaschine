// Schatzkammer-Tab: Übersicht + gesammelte Texte ansehen, ins Studio übernehmen,
// löschen, exportieren. Zeigt pro Text Form-Typ und Wortzahl.
// Tresor: als geheim markierte Texte sind verborgen; das unbeschriftete
// Feld im Filter schaltet den Tresor mit „#g“ frei (× oder Tab-Wechsel verbirgt ihn wieder).
import { el, button } from "./dom";
import { icon } from "./icons";
import {
  loadTreasury, deleteTreasureAt, clearTreasury, exportTreasuryTxt,
  treasureType, wordCount, treasureStats, setTreasureSecretAt,
} from "../features/treasury";

const nf = (n: number): string => n.toLocaleString("de-DE");
const SECRET = " geheim"; // Sentinel-Filter für den Tresor

export function mountTreasury(root: HTMLElement): void {
  root.innerHTML = "";
  const wrap = el("div", {});
  const overview = el("div", { class: "treasure-overview" });
  const list = el("div", {});
  let clearBtn: HTMLButtonElement;
  let filter: string | null = null; // aktiver Form-Filter (Anzeigename), SECRET oder null = alle
  let unlocked = false;             // Tresor sichtbar?

  // Stabiles unbeschriftetes Feld (wird NICHT bei jedem Render neu gebaut → Fokus bleibt).
  const secretIn = el("input", { class: "secretfield", type: "text", "aria-label": "" }) as HTMLInputElement;
  const secretClear = el("button", { class: "secretclear", type: "button", title: "Schließen" }, "✕");
  const relock = (): void => { if (filter === SECRET) filter = null; };
  secretIn.addEventListener("input", () => {
    const now = secretIn.value.trim().toLowerCase() === "#g";
    if (now !== unlocked) { unlocked = now; if (!unlocked) relock(); render(); }
  });
  secretClear.addEventListener("mousedown", (e) => e.preventDefault()); // kein Fokusverlust → kein Layout-Sprung
  secretClear.addEventListener("click", () => {
    secretIn.value = "";
    if (unlocked) { unlocked = false; relock(); render(); }
  });
  const secretRow = el("div", { class: "secretrow" }, secretIn, secretClear);

  const renderOverview = (shown: ReturnType<typeof loadTreasury>, secretCount: number): void => {
    overview.innerHTML = "";
    if (!shown.length && !(unlocked && secretCount)) {
      overview.append(el("span", { class: "muted" }, "Noch keine Texte gesammelt."));
      return;
    }
    const st = treasureStats(shown);
    overview.append(el("div", { class: "big" },
      `${nf(st.total)} ${st.total === 1 ? "Text" : "Texte"} · ${nf(st.words)} Wörter · Ø ${nf(st.avg)} pro Text`));
    const chips = el("div", { class: "chips" });
    chips.append(el("span", { class: "chips-label" }, "Zum Filtern wählen:"));
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
    if (unlocked && secretCount) {
      const sChip = el("button", { class: "tchip secretchip" + (filter === SECRET ? " active" : ""), type: "button" },
        icon("lock", 13), ` Tresor · ${nf(secretCount)}`) as HTMLButtonElement;
      sChip.addEventListener("click", () => { filter = filter === SECRET ? null : SECRET; render(); });
      chips.append(sChip);
    }
    overview.append(chips);
  };

  const render = (): void => {
    const all = loadTreasury();
    const secretCount = all.filter((it) => it.secret).length;
    const shown = unlocked ? all : all.filter((it) => !it.secret);
    if (clearBtn) clearBtn.disabled = all.length === 0;
    renderOverview(shown, secretCount);

    let items: ReturnType<typeof loadTreasury>;
    if (filter === SECRET) items = all.filter((it) => it.secret);
    else if (filter) items = shown.filter((it) => treasureType(it) === filter);
    else items = shown;

    list.innerHTML = "";
    if (!all.length) {
      list.append(el("p", { class: "muted" }, "Noch nichts gemerkt — im Studio auf Merken klicken."));
      return;
    }
    if (!items.length) {
      const msg = filter === SECRET ? "Der Tresor ist leer." : `Keine Texte der Form „${filter}“.`;
      list.append(el("p", { class: "muted" }, msg));
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
      const secretBtn = it.secret
        ? el("button", {}, icon("lockOpen"), " Aus Tresor")
        : el("button", {}, icon("lock"), " In Tresor");
      secretBtn.addEventListener("click", () => { setTreasureSecretAt(idx, !it.secret); render(); });
      const del = button("Löschen", "danger");
      del.addEventListener("click", () => { deleteTreasureAt(idx); render(); });

      const metaRow = el("div", { class: "treasure-meta" },
        el("span", { class: "tbadge" }, type),
        el("span", { class: "tcount" }, `${nf(wc)} Wörter`),
        el("span", { class: "tdate" }, it.d),
        ...(it.secret ? [el("span", { class: "tsecret" }, icon("lock", 13), " Tresor")] : []),
        ...(ctxMeta ? [el("span", { class: "tctx" }, ctxMeta)] : []));

      list.append(el("div", { class: "treasure" + (it.secret ? " secret" : "") },
        metaRow,
        el("pre", { class: "out treasure-text" }, it.t),
        el("div", { class: "btnrow" }, take, copy, speak, secretBtn, del)));
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
    el("h2", {}, "Schatzkammer"),
    overview,
    secretRow,
    el("div", { class: "btnrow" }, exportBtn, clearBtn),
    list);
  root.append(wrap);
  render();
}
