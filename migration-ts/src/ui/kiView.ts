// KI-Tab: Setup (Schlüssel/Modell), KI-Wortbank, An KI übergeben.
// Der Schlüssel bleibt lokal; Aufrufe gehen nur an api.anthropic.com.
import { el, field, textInput, button } from "./dom";
import { icon } from "./icons";
import { saveBank } from "../storage";
import { saveCurrentBankAsUserPreset } from "../wordbank";
import { loadAiKey, saveAiKey, loadAiModel, saveAiModel, generateAiWordbank, smoothText } from "../features/ki";

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

  // An KI übergeben - Original und KI-Fassung nebeneinander
  const lastText = (): string => { try { return localStorage.getItem("dm_last_text") || ""; } catch { return ""; } };
  const origPane = el("textarea", { class: "out comparepane", readonly: "" }) as HTMLTextAreaElement;
  const aiPane = el("textarea", { class: "out comparepane", readonly: "" }) as HTMLTextAreaElement;
  origPane.value = lastText();
  const copyOrig = button("Original kopieren");
  const copyAi = button("KI-Fassung kopieren");
  const flash = (b: HTMLButtonElement, val: string): void => { if (!val) return; void navigator.clipboard?.writeText(val); const o = b.textContent; b.textContent = "Kopiert ✓"; setTimeout(() => (b.textContent = o), 1200); };
  copyOrig.addEventListener("click", () => flash(copyOrig, origPane.value));
  copyAi.addEventListener("click", () => flash(copyAi, aiPane.value));
  const smoothLbl = el("span", {}, "Letzten Text an KI übergeben");
  const smoothBtn = el("button", {}, icon("flask"), " ", smoothLbl);
  smoothBtn.addEventListener("click", () => {
    void (async () => {
      const last = lastText();
      if (!last.trim()) { aiPane.value = "Kein Text vorhanden (erst im Studio generieren)."; return; }
      origPane.value = last;
      smoothBtn.disabled = true; const old = smoothLbl.textContent; smoothLbl.textContent = "Sende an KI…"; aiPane.value = "…";
      try { aiPane.value = await smoothText(last); }
      catch (e) { aiPane.value = "Fehlgeschlagen: " + (e instanceof Error ? e.message : String(e)); }
      finally { smoothBtn.disabled = false; smoothLbl.textContent = old || "Letzten Text an KI übergeben"; }
    })();
  });
  const compare = el("div", { class: "compare" },
    el("div", { class: "compare-col" }, el("div", { class: "compare-head" }, el("span", { class: "muted" }, "Original"), copyOrig), origPane),
    el("div", { class: "compare-col" }, el("div", { class: "compare-head" }, el("span", { class: "muted" }, "KI-Überarbeitung"), copyAi), aiPane));
  wrap.append(el("hr", { style: "margin:16px 0" }), el("h3", {}, "An KI übergeben"), el("div", { class: "btnrow" }, smoothBtn), compare);

  root.append(wrap);
  setStatus();
}
