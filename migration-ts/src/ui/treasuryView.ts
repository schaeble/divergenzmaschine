// Schatzkammer-Tab: gesammelte Texte ansehen, ins Studio übernehmen, löschen, exportieren.
import { el, button } from "./dom";
import { icon } from "./icons";
import { loadTreasury, deleteTreasureAt, exportTreasuryTxt } from "../features/treasury";

export function mountTreasury(root: HTMLElement): void {
  root.innerHTML = "";
  const wrap = el("div", {});
  const list = el("div", {});

  const render = (): void => {
    const items = loadTreasury();
    list.innerHTML = "";
    if (!items.length) { list.append(el("p", { class: "muted" }, "Noch nichts gemerkt — im Studio auf ⭐ Merken klicken.")); return; }
    items.slice().reverse().forEach((it, ri) => {
      const idx = items.length - 1 - ri;
      const meta = [it.who, it.where, it.when].filter(Boolean).join(" · ");
      const take = el("button", {}, icon("arrowRight"), " Studio");
      take.addEventListener("click", () => {
        try {
          try {
            localStorage.setItem("dm_pending_ctx", JSON.stringify({ who: it.who, where: it.where, when: it.when, what: it.what }));
            localStorage.setItem("dm_pending_text", it.t);
          } catch { /* Speicher gesperrt */ }
        } catch { /* voll */ }
        const st = [...document.querySelectorAll(".tabbar button")].find((b) => b.textContent === "Studio") as HTMLButtonElement | undefined;
        if (st) st.click();
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
      list.append(el("div", { class: "treasure" },
        el("div", { class: "treasure-meta" }, `${it.d}${meta ? "  ·  " + meta : ""}`),
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
  wrap.append(el("h2", {}, "⭐ Schatzkammer"), el("div", { class: "btnrow" }, exportBtn), list);
  root.append(wrap);
  render();
}
