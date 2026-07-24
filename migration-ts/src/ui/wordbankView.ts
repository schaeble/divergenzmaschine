// Wortbank-Tab: Preset-Wahl, Listen-Editor, Mutation, Reset, Als Preset speichern.
import type { BankKey } from "../types";
import { el, select, field, button } from "./dom";
import { loadBank, saveBank, normalizeBankShape } from "../storage";
import { getAllPresets, sortedPresetOptions, saveCurrentBankAsUserPreset, mutateBank, bankEntryCount, buildAutoMixBank, saveActiveBankLabel, loadActiveBankLabel, AUTOMIX_ID } from "../wordbank";
import { DEFAULT_BANK } from "../constants";
import { icon } from "./icons";
import { loadAiKey, generateAiWordbank } from "../features/ki";

const CATS: [BankKey, string][] = [
  ["motifs", "Motive"], ["hooks", "Hooks"], ["props", "Requisiten"], ["turns", "Wendungen"],
  ["obstacles", "Hindernisse"], ["stakes", "Einsätze"], ["endings", "Enden"],
];

export function mountWordbank(root: HTMLElement): void {
  root.innerHTML = "";
  const wrap = el("div", {});

  const preset = select("wb-preset", sortedPresetOptions());
  if (preset.options.length > 1) preset.selectedIndex = 1;  // nicht Auto-Mix als Standard anzeigen
  preset.addEventListener("change", () => {
    const p = getAllPresets()[preset.value];
    if (preset.value === AUTOMIX_ID) { saveBank(buildAutoMixBank()); saveActiveBankLabel("Auto-Mix"); load(); return; }
    if (p) { saveBank(p.bank); saveActiveBankLabel(p.label || preset.value); load(); }
  });

  const listSel = select("wb-list", CATS.map(([v, l]) => [v, l] as [string, string]), "motifs");
  const editor = el("textarea", { id: "wb-editor", style: "height:220px", placeholder: "Ein Eintrag pro Zeile" });
  const info = el("p", { class: "muted" }, "");

  const load = (): void => {
    const bank = loadBank();
    editor.value = (bank[listSel.value as BankKey] || []).join("\n");
    info.textContent = `${bankEntryCount(bank)} Einträge gesamt`;
  };
  listSel.addEventListener("change", load);

  const saveBtn = button("Speichern");
  saveBtn.addEventListener("click", () => {
    const bank = loadBank();
    bank[listSel.value as BankKey] = editor.value.split("\n").map((s) => s.trim()).filter(Boolean);
    saveBank(bank); load();
  });

  const autoMixBtn = el("button", {}, icon("dice"), " Würfeln");
  autoMixBtn.title = "Pro Kategorie ein zufälliges Preset neu zusammenwürfeln";
  autoMixBtn.addEventListener("click", () => { saveBank(buildAutoMixBank()); saveActiveBankLabel("Auto-Mix"); preset.value = AUTOMIX_ID; load(); });

  const mutSlider = el("input", { id: "wb-mut", type: "range", min: "0", max: "500", step: "10", value: "300", style: "width:auto;vertical-align:middle" });
  const mutVal = el("span", { class: "muted" }, "300");
  mutSlider.addEventListener("input", () => { mutVal.textContent = mutSlider.value; });
  const mutBtn = button("Mutation");
  mutBtn.addEventListener("click", () => { saveBank(mutateBank(loadBank(), parseInt(mutSlider.value, 10))); saveActiveBankLabel((loadActiveBankLabel() || "Wortbank").replace(/ \(mutiert\)$/, "") + " (mutiert)"); load(); });

  const resetBtn = button("Reset", "danger");
  resetBtn.addEventListener("click", () => { saveBank(normalizeBankShape(DEFAULT_BANK)); saveActiveBankLabel("Standard"); load(); });

  const saveAs = button("Als Preset speichern");
  saveAs.addEventListener("click", () => {
    const name = prompt("Name für dein Preset:", "MeinPreset");
    if (name) { saveCurrentBankAsUserPreset(name); preset.innerHTML = ""; for (const [v, l] of sortedPresetOptions()) preset.append(el("option", { value: v }, l)); }
  });

  // ---- KI-Wortbank (aus dem früheren KI-Tab) ----
  const kiWhere = el("input", { placeholder: "Wo?" }) as HTMLInputElement;
  const kiWhen = el("input", { placeholder: "Wann?" }) as HTMLInputElement;
  const kiWho = el("input", { placeholder: "Wer?" }) as HTMLInputElement;
  const kiWhat = el("input", { placeholder: "Was?" }) as HTMLInputElement;
  const kiExtra = el("input", { placeholder: "Zusatzvorgabe, z. B. „im Stil von Kafka“" }) as HTMLInputElement;
  const kiLbl = el("span", {}, "KI-Wortbank erstellen");
  const kiBtn = el("button", {}, icon("flask"), " ", kiLbl) as HTMLButtonElement;
  const kiInfo = el("p", { class: "muted" }, "");
  kiBtn.addEventListener("click", () => {
    void (async () => {
      if (!loadAiKey()) { alert("Kein API-Schlüssel — bitte unter Studio ▸ Einstellungen ▸ KI-Zugang hinterlegen."); return; }
      kiBtn.disabled = true; kiLbl.textContent = "Erstelle…";
      try {
        const bank = await generateAiWordbank({ where: kiWhere.value, when: kiWhen.value, who: kiWho.value, what: kiWhat.value, userPrompt: kiExtra.value });
        saveBank(bank);
        saveActiveBankLabel("KI-Wortbank");
        const name = prompt("Titel für die neue KI-Wortbank:", kiExtra.value.trim() || "KI-Wortbank");
        if (name) { saveCurrentBankAsUserPreset(name); preset.innerHTML = ""; for (const [v, l] of sortedPresetOptions()) preset.append(el("option", { value: v }, l)); }
        load();
        kiInfo.textContent = "KI-Wortbank erstellt und aktiviert.";
      } catch (e) { kiInfo.textContent = "Fehlgeschlagen: " + (e instanceof Error ? e.message : String(e)); }
      finally { kiBtn.disabled = false; kiLbl.textContent = "KI-Wortbank erstellen"; }
    })();
  });
  const kiBox = el("details", { class: "fine" });
  kiBox.append(el("summary", {}, icon("flask"), " KI-Wortbank erzeugen"),
    el("div", { class: "grid2" }, field("Wo?", kiWhere), field("Wann?", kiWhen), field("Wer?", kiWho), field("Was?", kiWhat)),
    field("Zusatzvorgabe", kiExtra), el("div", { class: "btnrow" }, kiBtn), kiInfo);

  wrap.append(
    field("Preset", preset),
    field("Liste", listSel),
    editor,
    el("div", { class: "btnrow" }, saveBtn, mutBtn, mutSlider, " ", mutVal, resetBtn),
    el("div", { class: "btnrow" }, autoMixBtn, saveAs),
    info,
    kiBox,
  );
  root.append(wrap);
  load();
}
