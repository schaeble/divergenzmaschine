// Wortbank-Tab: Preset-Wahl, Listen-Editor, Mutation, Reset, Als Preset speichern.
import type { BankKey } from "../types";
import { el, select, field, button } from "./dom";
import { loadBank, saveBank, normalizeBankShape } from "../storage";
import { getAllPresets, sortedPresetOptions, saveCurrentBankAsUserPreset, deleteUserPreset, mutateBank, bankEntryCount, buildAutoMixBank, saveActiveBankLabel, loadActiveBankLabel, AUTOMIX_ID } from "../wordbank";
import { DEFAULT_BANK } from "../constants";
import { loadPersistentCorpus } from "../corpus";
import { feedLivePools, LIVE_W } from "../features/livepools";
import { preset2ToBank, preset2Pools, preset2Name, preset2Settings, generateAiPreset2 } from "../features/preset2";
import { bankFromCorpus } from "../features/corpusbank";
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
  const delPresetBtn = button("Preset löschen", "danger");
  const updDelPreset = (): void => { delPresetBtn.style.display = preset.value.startsWith("user:") ? "" : "none"; };
  const rebuildPresets = (keep?: string): void => {
    preset.innerHTML = "";
    for (const [v, l] of sortedPresetOptions()) preset.append(el("option", { value: v }, l));
    if (keep && Array.from(preset.options).some((o) => o.value === keep)) preset.value = keep;
    else if (preset.options.length > 1) preset.selectedIndex = 1;
    updDelPreset();
  };
  preset.addEventListener("change", () => {
    const p = getAllPresets()[preset.value];
    updDelPreset();
    if (preset.value === AUTOMIX_ID) { saveBank(buildAutoMixBank()); saveActiveBankLabel("Auto-Mix"); load(); return; }
    if (p) { saveBank(p.bank); saveActiveBankLabel(p.label || preset.value); load(); }
  });
  delPresetBtn.addEventListener("click", () => {
    if (!preset.value.startsWith("user:")) return;
    const name = preset.value.slice(5);
    if (!confirm(`Eigenes Preset „${name}" löschen? (Die aktuelle Wortbank bleibt unverändert.)`)) return;
    deleteUserPreset(name);
    rebuildPresets();
  });
  updDelPreset();

  const listSel = select("wb-list", CATS.map(([v, l]) => [v, l] as [string, string]), "motifs");
  const editor = el("textarea", { id: "wb-editor", style: "height:220px", placeholder: "Ein Eintrag pro Zeile" });
  const info = el("p", { class: "muted" }, "");

  let renderFull: () => void = () => {};
  const load = (): void => {
    const bank = loadBank();
    editor.value = (bank[listSel.value as BankKey] || []).join("\n");
    info.textContent = `${bankEntryCount(bank)} Einträge gesamt`;
    // Voll-Felder werden NICHT hier befüllt, um in Arbeit befindliche Bearbeitungen
    // nicht zu überschreiben; das geschieht beim Öffnen des Bereichs (toggle) und
    // nach „Alle übernehmen"/Import.
    if (fullBox.open) renderFull();
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

  const fillBtn = el("button", {}, icon("refresh"), " Aus Korpus füllen");
  fillBtn.title = "Erzeugt aus dem eigenen Korpus (Korpus-Tab) eine Wortbank — als Startpunkt zum Nachschärfen und Speichern.";
  fillBtn.addEventListener("click", () => {
    const corpus = loadPersistentCorpus();
    if (!corpus || corpus.trim().length < 60) { info.textContent = "Korpus ist zu klein — erst im Korpus-Tab Text hinzufügen."; return; }
    const bank = bankFromCorpus(corpus);
    saveBank(bank); saveActiveBankLabel("Aus Korpus"); preset.selectedIndex = -1; load();
    info.textContent = `Aus Korpus gefüllt (${bankEntryCount(bank)} Einträge). Im Listen-Editor nachschärfen, dann „Als Preset speichern".`;
  });
  const saveAs = button("Als Preset speichern");
  saveAs.addEventListener("click", () => {
    const name = prompt("Name für dein Preset:", "MeinPreset");
    if (name) { saveCurrentBankAsUserPreset(name); rebuildPresets("user:" + name.trim().slice(0, 40)); }
  });

  // ---- Ganze Wortbank: alle 7 Kategorien als Textfelder + Datei sichern/laden ----
  const saveTextAs = async (text: string, filename: string): Promise<boolean> => {
    const w = window as unknown as { showSaveFilePicker?: (o: unknown) => Promise<{ createWritable: () => Promise<{ write: (d: Blob) => Promise<void>; close: () => Promise<void> }> }> };
    if (typeof w.showSaveFilePicker === "function") {
      try {
        const h = await w.showSaveFilePicker({ suggestedName: filename, types: [{ description: "Wortbank", accept: { "application/json": [".json"] } }] });
        const wr = await h.createWritable(); await wr.write(new Blob([text], { type: "application/json" })); await wr.close(); return true;
      } catch (e) { if (e instanceof DOMException && e.name === "AbortError") return false; }
    }
    const url = URL.createObjectURL(new Blob([text], { type: "application/json;charset=utf-8" }));
    const a = document.createElement("a"); a.href = url; a.download = filename; document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 0); return true;
  };

  const fullInfo = el("p", { class: "muted" }, "");
  const fullAreas: Record<string, HTMLTextAreaElement> = {};
  const fullGrid = el("div", {});
  for (const [key, label] of CATS) {
    const t = el("textarea", { id: "wb-full-" + key, style: "height:88px", placeholder: "Ein Eintrag pro Zeile" }) as HTMLTextAreaElement;
    fullAreas[key] = t;
    fullGrid.append(el("div", { class: "field" }, el("span", { class: "field-label" }, label), t));
  }
  renderFull = (): void => { const bank = loadBank(); for (const [key] of CATS) if (fullAreas[key]) fullAreas[key]!.value = (bank[key as BankKey] || []).join("\n"); };
  const applyAllBtn = button("Alle übernehmen");
  applyAllBtn.addEventListener("click", () => {
    const bank = loadBank();
    for (const [key] of CATS) bank[key as BankKey] = fullAreas[key]!.value.split("\n").map((x) => x.trim()).filter(Boolean);
    if (!saveBank(bank)) { fullInfo.textContent = "Speichern fehlgeschlagen — Speicher voll. Erst Korpus/Schatzkammer leeren (Einstellungen ▸ Speicher) oder exportieren."; return; }
    load(); renderFull();
    let extra = "";
    if (preset.value.startsWith("user:")) { saveCurrentBankAsUserPreset(preset.value.slice(5)); extra = ` · Preset „${preset.value.slice(5)}“ aktualisiert`; }
    fullInfo.textContent = `Übernommen ✓ — ${bankEntryCount(bank)} Einträge${extra}.`;
  });
  const saveAsFileBtn = el("button", {}, icon("floppy"), " Speichern unter…");
  saveAsFileBtn.addEventListener("click", () => {
    // erst die Textfelder in die Bank übernehmen, dann als Datei sichern
    const bank = loadBank();
    for (const [key] of CATS) bank[key as BankKey] = fullAreas[key]!.value.split("\n").map((x) => x.trim()).filter(Boolean);
    if (!saveBank(bank)) { fullInfo.textContent = "Speichern fehlgeschlagen — Speicher voll."; return; }
    load();
    if (preset.value.startsWith("user:")) saveCurrentBankAsUserPreset(preset.value.slice(5));
    const nm = (loadActiveBankLabel() || "wortbank").replace(/[^0-9A-Za-zäöüÄÖÜß-]+/g, "_").toLowerCase();
    void saveTextAs(JSON.stringify(bank, null, 2), `wortbank_${nm}.json`).then((ok) => { if (ok) fullInfo.textContent = "In Datei gespeichert ✓"; });
  });
  const fileIn = el("input", { type: "file", accept: ".json,application/json", style: "display:none" }) as HTMLInputElement;
  fileIn.addEventListener("change", () => {
    const fl = fileIn.files && fileIn.files[0]; if (!fl) return;
    const r = new FileReader();
    r.onload = () => {
      try {
        const parsed = JSON.parse(String(r.result)) as unknown;
        const p2 = preset2ToBank(parsed);
        const flatSrc = (parsed && typeof parsed === "object" && "wordbank" in (parsed as Record<string, unknown>)) ? (parsed as Record<string, unknown>).wordbank : parsed;
        const bank = p2 ?? normalizeBankShape(flatSrc);
        saveBank(bank); saveActiveBankLabel(p2 ? preset2Name(parsed) : "Aus Datei"); preset.selectedIndex = -1; load(); renderFull();
        const pools = preset2Pools(parsed);
        if (pools.length) { try { feedLivePools(pools.join(". ") + ".", LIVE_W.schatz); } catch { /* egal */ } }
        const staged = p2 ? stageParams(parsed) : "";
        fullInfo.textContent = `Geladen — ${bankEntryCount(bank)} Einträge${pools.length ? ` · ${pools.length} Kontext-Begriffe in die lebendigen Pools` : ""}${staged}.`;
      } catch { fullInfo.textContent = "Datei nicht lesbar (kein gültiges JSON)."; }
      fileIn.value = "";
    };
    r.readAsText(fl);
  });
  const loadFileBtn = el("button", {}, icon("refresh"), " Aus Datei laden…");
  loadFileBtn.addEventListener("click", () => fileIn.click());
  const fullBox = el("details", { class: "fine" });
  fullBox.addEventListener("toggle", () => { if (fullBox.open) renderFull(); });
  fullBox.append(
    el("summary", {}, icon("floppy"), " Ganze Wortbank bearbeiten & sichern"),
    el("p", { class: "muted" }, "Alle Kategorien direkt bearbeiten. „Alle übernehmen“ speichert in die aktive Wortbank; „Speichern unter“ schreibt sie als JSON-Datei; „Aus Datei laden“ liest eine gespeicherte Wortbank (oder ein Projekt) wieder ein."),
    fullGrid,
    el("div", { class: "btnrow" }, applyAllBtn, saveAsFileBtn, loadFileBtn, fileIn),
    fullInfo);

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
        if (name) { saveCurrentBankAsUserPreset(name); rebuildPresets("user:" + name.trim().slice(0, 40)); }
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

  // Phase 2: Preset-2.0-Stimmung/Parameter optional ins Studio uebernehmen.
  const applyParamsChk = el("input", { type: "checkbox", id: "wb-p2apply" }) as HTMLInputElement;
  applyParamsChk.checked = true;
  const applyParamsRow = el("label", { class: "chk", title: "Setzt beim naechsten Oeffnen des Studios Ton, Form (bei hohem Dialoganteil) und Disruptor/Instabilitaet (bei Surrealismus) aus dem Preset 2.0." }, applyParamsChk, " Bei Preset 2.0: Ton & Parameter ins Studio uebernehmen");
  const stageParams = (obj: unknown): string => {
    if (!applyParamsChk.checked) return "";
    const st = preset2Settings(obj);
    if (!Object.keys(st).length) return "";
    try { localStorage.setItem("dm_pending_studio", JSON.stringify(st)); } catch { /* voll */ }
    const parts: string[] = [];
    if (st.tone) parts.push("Ton " + st.tone);
    if (st.form) parts.push("Form Szene/Dialog");
    if (st.disruptor) parts.push("Disruptor an");
    if (st.instability) parts.push("Instabilitaet " + st.instability);
    return parts.length ? ` · fuers Studio vorgemerkt: ${parts.join(", ")}` : "";
  };

  // ---- KI-Preset 2.0 (experimentell): erzeugt ein komplettes Preset 2.0 per KI ----
  const p2Insp = el("input", { placeholder: "Inspiration / Beschreibung, z. B. „Haruki Murakami“" }) as HTMLInputElement;
  const p2Out = el("textarea", { style: "height:150px", placeholder: "Das erzeugte Preset-2.0-JSON erscheint hier." }) as HTMLTextAreaElement;
  const p2Info = el("p", { class: "muted" }, "");
  let p2Json = "";
  const p2Lbl = el("span", {}, "Preset 2.0 erzeugen");
  const p2Btn = el("button", {}, icon("flask"), " ", p2Lbl) as HTMLButtonElement;
  p2Btn.addEventListener("click", () => {
    void (async () => {
      if (!loadAiKey()) { alert("Kein API-Schlüssel — bitte unter Studio ▸ Einstellungen ▸ KI-Zugang hinterlegen."); return; }
      p2Btn.disabled = true; p2Lbl.textContent = "Erzeuge…";
      try {
        const r = await generateAiPreset2(p2Insp.value);
        p2Json = r.json; p2Out.value = r.json;
        saveBank(r.bank); saveActiveBankLabel(r.name); preset.selectedIndex = -1; load(); renderFull();
        const pools = preset2Pools(r.obj);
        if (pools.length) { try { feedLivePools(pools.join(". ") + ".", LIVE_W.schatz); } catch { /* egal */ } }
        const staged = stageParams(r.obj);
        p2Info.textContent = `„${r.name}“ erzeugt & aktiviert (${bankEntryCount(r.bank)} Einträge${pools.length ? `, ${pools.length} Kontext-Begriffe in die Pools` : ""}${staged}). Unten als Datei sichern oder als Preset speichern.`;
      } catch (e) { p2Info.textContent = "Fehlgeschlagen: " + (e instanceof Error ? e.message : String(e)); }
      finally { p2Btn.disabled = false; p2Lbl.textContent = "Preset 2.0 erzeugen"; }
    })();
  });
  const p2SaveBtn = el("button", {}, icon("floppy"), " Als Preset-2.0-Datei speichern…");
  p2SaveBtn.addEventListener("click", () => {
    if (!p2Json.trim()) { p2Info.textContent = "Erst ein Preset 2.0 erzeugen."; return; }
    const nm = (preset2Name(JSON.parse(p2Json)) || "preset2").replace(/[^0-9A-Za-zäöüÄÖÜß-]+/g, "_").toLowerCase();
    void saveTextAs(p2Json, `preset2_${nm}.json`).then((ok) => { if (ok) p2Info.textContent = "Als Datei gespeichert ✓"; });
  });
  const p2Box = el("details", { class: "fine" });
  p2Box.append(
    el("summary", {}, icon("flask"), " KI-Preset 2.0 erzeugen (experimentell)"),
    el("p", { class: "muted" }, "Erzeugt ein komplettes Preset 2.0 (Welt, Orte, Figuren, Objekte, Ton, generatoren). Genutzt werden davon die Wortbank (generatoren) und die Kontext-Felder (in die lebendigen Pools); die übrigen Felder sind Metadaten. Braucht einen API-Schlüssel."),
    field("Inspiration", p2Insp),
    el("div", { class: "btnrow" }, p2Btn, p2SaveBtn),
    p2Info, p2Out);

  wrap.append(
    field("Preset", preset),
    el("div", { class: "btnrow" }, delPresetBtn),
    field("Liste", listSel),
    editor,
    el("div", { class: "btnrow" }, saveBtn, mutBtn, mutSlider, " ", mutVal, resetBtn),
    el("div", { class: "btnrow" }, autoMixBtn, fillBtn, saveAs),
    info,
    applyParamsRow,
    fullBox,
    kiBox,
    p2Box,
  );
  root.append(wrap);
  load();
}
