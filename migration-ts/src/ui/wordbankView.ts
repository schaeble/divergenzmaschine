// Wortbank-Tab: Preset-Wahl, Listen-Editor, Mutation, Reset, Als Preset speichern.
import type { BankKey } from "../types";
import { el, select, field, button } from "./dom";
import { loadBank, saveBank, normalizeBankShape } from "../storage";
import { getAllPresets, sortedPresetOptions, saveCurrentBankAsUserPreset, mutateBank, bankEntryCount } from "../wordbank";
import { DEFAULT_BANK } from "../constants";

const CATS: [BankKey, string][] = [
  ["motifs", "Motive"], ["hooks", "Hooks"], ["props", "Requisiten"], ["turns", "Wendungen"],
  ["obstacles", "Hindernisse"], ["stakes", "Einsätze"], ["endings", "Enden"],
];

export function mountWordbank(root: HTMLElement): void {
  root.innerHTML = "";
  const wrap = el("div", {});

  const preset = select("wb-preset", sortedPresetOptions());
  preset.addEventListener("change", () => {
    const p = getAllPresets()[preset.value];
    if (p) { saveBank(p.bank); load(); }
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

  const mutSlider = el("input", { id: "wb-mut", type: "range", min: "0", max: "500", step: "10", value: "300", style: "width:auto;vertical-align:middle" });
  const mutVal = el("span", { class: "muted" }, "300");
  mutSlider.addEventListener("input", () => { mutVal.textContent = mutSlider.value; });
  const mutBtn = button("Mutation");
  mutBtn.addEventListener("click", () => { saveBank(mutateBank(loadBank(), parseInt(mutSlider.value, 10))); load(); });

  const resetBtn = button("Reset", "danger");
  resetBtn.addEventListener("click", () => { saveBank(normalizeBankShape(DEFAULT_BANK)); load(); });

  const saveAs = button("Als Preset speichern");
  saveAs.addEventListener("click", () => {
    const name = prompt("Name für dein Preset:", "MeinPreset");
    if (name) { saveCurrentBankAsUserPreset(name); preset.innerHTML = ""; for (const [v, l] of sortedPresetOptions()) preset.append(el("option", { value: v }, l)); }
  });

  wrap.append(
    field("Preset", preset),
    field("Liste", listSel),
    editor,
    el("div", { class: "btnrow" }, saveBtn, mutBtn, mutSlider, " ", mutVal, resetBtn),
    el("div", { class: "btnrow" }, saveAs),
    info,
  );
  root.append(wrap);
  load();
}
