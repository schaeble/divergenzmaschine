// KI-Tab: Setup (Schlüssel/Modell), KI-Wortbank, An KI übergeben.
// Der Schlüssel bleibt lokal; Aufrufe gehen nur an api.anthropic.com.
import { el, field, textInput, button, select } from "./dom";
import { icon } from "./icons";
import { saveBank } from "../storage";
import { saveCurrentBankAsUserPreset } from "../wordbank";
import { loadAiKey, saveAiKey, loadAiModel, saveAiModel, generateAiWordbank, elaborateText } from "../features/ki";
import { loadTreasury } from "../features/treasury";

export function mountKi(root: HTMLElement): void {
  root.innerHTML = "";
  const wrap = el("div", {});

  // Setup
  const keyIn = el("input", { type: "password", placeholder: "sk-ant-…", value: loadAiKey() }) as HTMLInputElement;
  const modelIn = textInput("ki-model", "Modell", loadAiModel());
  const status = el("p", { class: "muted" });
  const setStatus = (): void => { status.textContent = loadAiKey() ? `Schlüssel hinterlegt · Modell: ${loadAiModel()}` : "Kein Schlüssel hinterlegt."; };
  const saveBtn = button("Speichern");
  saveBtn.addEventListener("click", () => { saveAiKey(keyIn.value.trim()); saveAiModel(modelIn.value.trim()); setStatus(); });
  const clearBtn = button("Schlüssel löschen", "color:#a00");
  clearBtn.addEventListener("click", () => { saveAiKey(""); keyIn.value = ""; setStatus(); });

  wrap.append(el("h3", {}, "KI-Setup (Anthropic)"),
    field("API-Schlüssel", keyIn), field("Modell", modelIn), el("div", { class: "btnrow" }, saveBtn, clearBtn), status,
    el("p", { class: "muted" }, "Der Schlüssel wird nur lokal gespeichert und ausschließlich an api.anthropic.com gesendet. Jede Anfrage verbraucht Guthaben deines Kontos."));

  // KI-Wortbank
  const where = textInput("ki-where", "Wo?"), when = textInput("ki-when", "Wann?"), who = textInput("ki-who", "Wer?"), what = textInput("ki-what", "Was?");
  const extra = textInput("ki-extra", 'Zusatzvorgabe, z.B. „im Stil von Kafka"');
  const wbLbl = el("span", {}, "KI-Wortbank erstellen");
  const wbBtn = el("button", {}, icon("flask"), " ", wbLbl);
  const wbInfo = el("p", { class: "muted" });
  wbBtn.addEventListener("click", () => {
    void (async () => {
      wbBtn.disabled = true; const old = wbLbl.textContent; wbLbl.textContent = "Erstelle…";
      try {
        const bank = await generateAiWordbank({ where: where.value, when: when.value, who: who.value, what: what.value, userPrompt: extra.value });
        saveBank(bank);
        const name = prompt("Titel für die neue KI-Wortbank:", extra.value.trim() || "KI-Wortbank");
        if (name) saveCurrentBankAsUserPreset(name);
        wbInfo.textContent = "KI-Wortbank erstellt und aktiviert.";
      } catch (e) { wbInfo.textContent = "Fehlgeschlagen: " + (e instanceof Error ? e.message : String(e)); }
      finally { wbBtn.disabled = false; wbLbl.textContent = old || "KI-Wortbank erstellen"; }
    })();
  });
  wrap.append(el("hr", { style: "margin:16px 0" }), el("h3", {}, "KI-Wortbank"),
    el("div", { class: "grid2" }, field("Wo?", where), field("Wann?", when), field("Wer?", who), field("Was?", what)),
    field("Zusatzvorgabe", extra), el("div", { class: "btnrow" }, wbBtn), wbInfo);

  // Ausarbeiten (KI): letzten Text oder Schatzkammer-Text auf Ziellänge entfalten
  const lastText = (): string => { try { return localStorage.getItem("dm_last_text") || ""; } catch { return ""; } };
  const origPane = el("textarea", { class: "out comparepane", readonly: "" }) as HTMLTextAreaElement;
  const aiPane = el("textarea", { class: "out comparepane", readonly: "" }) as HTMLTextAreaElement;
  origPane.value = lastText();
  const copyOrig = button("Original kopieren");
  const copyAi = button("Ausarbeitung kopieren");
  const flash = (b: HTMLButtonElement, val: string): void => { if (!val) return; void navigator.clipboard?.writeText(val); const o = b.textContent; b.textContent = "Kopiert ✓"; setTimeout(() => (b.textContent = o), 1200); };
  copyOrig.addEventListener("click", () => flash(copyOrig, origPane.value));
  copyAi.addEventListener("click", () => flash(copyAi, aiPane.value));

  const lenSel = select("ki-len", [["500", "\u2248 500 Wörter"], ["750", "\u2248 750 Wörter"], ["1000", "\u2248 1000 Wörter"]], "500");
  const treasures = loadTreasury().slice().reverse();
  const trSel = select("ki-treasure", [["", treasures.length ? "\u2014 Schatzkammer-Text wählen \u2014" : "\u2014 Schatzkammer leer \u2014"],
    ...treasures.map((it, i) => [String(i), `${it.d}${it.who ? " · " + it.who : ""}: ${it.t.slice(0, 40)}…`] as [string, string])]);

  const runElaborate = (source: string, btn: HTMLButtonElement, lbl: HTMLElement, def: string): void => {
    void (async () => {
      if (!source.trim()) { aiPane.value = "Kein Text vorhanden."; return; }
      origPane.value = source;
      const n = parseInt(lenSel.value, 10);
      btn.disabled = true; const old = lbl.textContent; lbl.textContent = "Sende an KI…"; aiPane.value = "…";
      try { aiPane.value = await elaborateText(source, n); }
      catch (e) { aiPane.value = "Fehlgeschlagen: " + (e instanceof Error ? e.message : String(e)); }
      finally { btn.disabled = false; lbl.textContent = old || def; }
    })();
  };
  const lastLbl = el("span", {}, "Letzten Text ausarbeiten");
  const lastBtn = el("button", {}, icon("flask"), " ", lastLbl);
  lastBtn.addEventListener("click", () => runElaborate(lastText(), lastBtn, lastLbl, "Letzten Text ausarbeiten"));
  const trLbl = el("span", {}, "Schatzkammer-Text ausarbeiten");
  const trBtn = el("button", {}, icon("flask"), " ", trLbl);
  trBtn.addEventListener("click", () => { const i = parseInt(trSel.value, 10); const it = Number.isNaN(i) ? undefined : treasures[i]; runElaborate(it ? it.t : "", trBtn, trLbl, "Schatzkammer-Text ausarbeiten"); });

  const compare = el("div", { class: "compare" },
    el("div", { class: "compare-col" }, el("div", { class: "compare-head" }, el("span", { class: "muted" }, "Original"), copyOrig), origPane),
    el("div", { class: "compare-col" }, el("div", { class: "compare-head" }, el("span", { class: "muted" }, "KI-Ausarbeitung"), copyAi), aiPane));
  wrap.append(el("hr", { style: "margin:16px 0" }), el("h3", {}, "Ausarbeiten (KI)"),
    field("Ziellänge", lenSel),
    el("div", { class: "btnrow" }, lastBtn),
    el("div", { class: "btnrow" }, trSel, trBtn),
    compare);

  root.append(wrap);
  setStatus();
}
