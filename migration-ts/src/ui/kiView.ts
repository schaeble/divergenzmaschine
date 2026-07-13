// KI-Tab: Setup (Schlüssel/Modell), KI-Wortbank, An KI übergeben.
// Der Schlüssel bleibt lokal; Aufrufe gehen nur an api.anthropic.com.
import { el, field, textInput, button } from "./dom";
import { saveBank } from "../storage";
import { saveCurrentBankAsUserPreset } from "../wordbank";
import { loadAiKey, saveAiKey, loadAiModel, saveAiModel, generateAiWordbank, smoothText } from "../features/ki";

export function mountKi(root: HTMLElement): void {
  root.innerHTML = "";
  const wrap = el("div", { style: "max-width:720px;margin:1rem auto" });

  // Setup
  const keyIn = el("input", { type: "password", placeholder: "sk-ant-…", value: loadAiKey(), style: "width:100%;padding:6px;margin-top:2px" }) as HTMLInputElement;
  const modelIn = textInput("ki-model", "Modell", loadAiModel());
  const status = el("p", { style: "font:12px system-ui;color:#777" });
  const setStatus = (): void => { status.textContent = loadAiKey() ? `Schlüssel hinterlegt · Modell: ${loadAiModel()}` : "Kein Schlüssel hinterlegt."; };
  const saveBtn = button("Speichern");
  saveBtn.addEventListener("click", () => { saveAiKey(keyIn.value.trim()); saveAiModel(modelIn.value.trim()); setStatus(); });
  const clearBtn = button("Schlüssel löschen", "color:#a00");
  clearBtn.addEventListener("click", () => { saveAiKey(""); keyIn.value = ""; setStatus(); });

  wrap.append(el("h3", { style: "font:600 14px system-ui" }, "KI-Setup (Anthropic)"),
    field("API-Schlüssel", keyIn), field("Modell", modelIn), el("div", {}, saveBtn, clearBtn), status,
    el("p", { style: "font:11px system-ui;color:#999" }, "Der Schlüssel wird nur lokal gespeichert und ausschließlich an api.anthropic.com gesendet. Jede Anfrage verbraucht Guthaben deines Kontos."));

  // KI-Wortbank
  const where = textInput("ki-where", "Wo?"), when = textInput("ki-when", "Wann?"), who = textInput("ki-who", "Wer?"), what = textInput("ki-what", "Was?");
  const extra = textInput("ki-extra", 'Zusatzvorgabe, z.B. „im Stil von Kafka"');
  const wbBtn = button("🤖 KI-Wortbank erstellen");
  const wbInfo = el("p", { style: "font:12px system-ui;color:#777" });
  wbBtn.addEventListener("click", () => {
    void (async () => {
      wbBtn.disabled = true; const old = wbBtn.textContent; wbBtn.textContent = "Erstelle…";
      try {
        const bank = await generateAiWordbank({ where: where.value, when: when.value, who: who.value, what: what.value, userPrompt: extra.value });
        saveBank(bank);
        const name = prompt("Titel für die neue KI-Wortbank:", extra.value.trim() || "KI-Wortbank");
        if (name) saveCurrentBankAsUserPreset(name);
        wbInfo.textContent = "KI-Wortbank erstellt und aktiviert.";
      } catch (e) { wbInfo.textContent = "Fehlgeschlagen: " + (e instanceof Error ? e.message : String(e)); }
      finally { wbBtn.disabled = false; wbBtn.textContent = old; }
    })();
  });
  wrap.append(el("hr", { style: "margin:16px 0" }), el("h3", { style: "font:600 14px system-ui" }, "KI-Wortbank"),
    el("div", { style: "display:grid;grid-template-columns:1fr 1fr;gap:8px" }, field("Wo?", where), field("Wann?", when), field("Wer?", who), field("Was?", what)),
    field("Zusatzvorgabe", extra), el("div", {}, wbBtn), wbInfo);

  // An KI übergeben
  const out = el("textarea", { style: "width:100%;height:140px;padding:8px;font:14px/1.5 Georgia,serif;margin-top:6px" }) as HTMLTextAreaElement;
  const smoothBtn = button("🤖 Letzten Text an KI übergeben");
  smoothBtn.addEventListener("click", () => {
    void (async () => {
      const last = (() => { try { return localStorage.getItem("dm_last_text") || ""; } catch { return ""; } })();
      if (!last.trim()) { out.value = "Kein Text vorhanden (erst im Studio generieren)."; return; }
      smoothBtn.disabled = true; const old = smoothBtn.textContent; smoothBtn.textContent = "Sende an KI…";
      try { out.value = await smoothText(last); }
      catch (e) { out.value = "Fehlgeschlagen: " + (e instanceof Error ? e.message : String(e)); }
      finally { smoothBtn.disabled = false; smoothBtn.textContent = old; }
    })();
  });
  wrap.append(el("hr", { style: "margin:16px 0" }), el("h3", { style: "font:600 14px system-ui" }, "An KI übergeben"), el("div", {}, smoothBtn), out);

  root.append(wrap);
  setStatus();
}
