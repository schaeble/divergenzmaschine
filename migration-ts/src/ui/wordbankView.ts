// Wortbank-Tab: Preset-Wahl, Listen-Editor, Mutation, Reset, Als Preset speichern.
import type { BankKey } from "../types";
import { el, select, field, button } from "./dom";
import { loadBank, saveBank, normalizeBankShape } from "../storage";
import { getAllPresets, sortedPresetOptions, saveCurrentBankAsUserPreset, deleteUserPreset, mutateBank, bankEntryCount, buildAutoMixBank, saveActiveBankLabel, loadActiveBankLabel, AUTOMIX_ID } from "../wordbank";
import { DEFAULT_BANK } from "../constants";
import { loadPersistentCorpus } from "../corpus";
import { feedLivePools, LIVE_W } from "../features/livepools";
import { preset2ToBank, preset2Name, preset2Active, builtinSettings, generateAiPreset2, setActive2, getActive2, saveUserPreset2, getUserPreset2, deleteUserPreset2, loadUserPresets2, type Active2 } from "../features/preset2";
import { setDramaData } from "../generation/dramaturgie";
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

  // Opt-in: Preset-Stimmung/Parameter ins Studio übernehmen (früh deklariert, unten in die UI gehängt).
  const applyParamsChk = el("input", { type: "checkbox", id: "wb-p2apply" }) as HTMLInputElement;
  applyParamsChk.checked = true;
  const applyParamsRow = el("label", { class: "chk", title: "Setzt beim naechsten Oeffnen des Studios Ton, Form (bei hohem Dialoganteil) und Disruptor/Instabilitaet (bei Surrealismus) aus dem gewaehlten Preset." }, applyParamsChk, " Bei Preset: Ton & Parameter ins Studio uebernehmen");
  let refresh2: () => void = () => {};
  const applyActive2 = (a: Active2 | null): void => {
    setActive2(a);
    setDramaData(a ? a.drama : null);
    if (a && a.pools && a.pools.length) { try { feedLivePools(a.pools.join(". ") + ".", LIVE_W.schatz); } catch { /* egal */ } }
    if (a && applyParamsChk.checked && a.settings && Object.keys(a.settings).length) { try { localStorage.setItem("dm_pending_studio", JSON.stringify(a.settings)); } catch { /* voll */ } }
    refresh2();
  };
  const stagedInfo = (a: Active2 | null): string => {
    if (!a || !applyParamsChk.checked) return "";
    const st = a.settings; const parts: string[] = [];
    if (st.tone) parts.push("Ton " + st.tone);
    if (st.form) parts.push("Form Szene/Dialog");
    if (st.disruptor) parts.push("Disruptor an");
    if (st.instability) parts.push("Instabilität " + st.instability);
    if (st.structure) parts.push("Struktur Dramaturgie");
    return parts.length ? ` · fürs Studio vorgemerkt: ${parts.join(", ")}` : "";
  };
  const markedOptions = (): [string, string][] => {
    const u2 = loadUserPresets2();
    return sortedPresetOptions().map(([v, l]) => [v, v.startsWith("user:") && u2[v.slice(5)] ? l + " ✦2.0" : l] as [string, string]);
  };
  const preset = select("wb-preset", markedOptions());
  if (preset.options.length > 1) preset.selectedIndex = 1;  // nicht Auto-Mix als Standard anzeigen
  const delPresetBtn = button("Preset löschen", "danger");
  const updDelPreset = (): void => { delPresetBtn.style.display = preset.value.startsWith("user:") ? "" : "none"; };
  const rebuildPresets = (keep?: string): void => {
    preset.innerHTML = "";
    for (const [v, l] of markedOptions()) preset.append(el("option", { value: v }, l));
    if (keep && Array.from(preset.options).some((o) => o.value === keep)) preset.value = keep;
    else if (preset.options.length > 1) preset.selectedIndex = 1;
    updDelPreset();
  };
  preset.addEventListener("change", () => {
    const p = getAllPresets()[preset.value];
    updDelPreset();
    if (preset.value === AUTOMIX_ID) { saveBank(buildAutoMixBank()); saveActiveBankLabel("Auto-Mix"); load(); return; }
    if (p) {
      saveBank(p.bank); saveActiveBankLabel(p.label || preset.value); load();
      try { const voc = [...(p.bank.motifs || []), ...(p.bank.props || []), ...(p.bank.turns || [])].join(". "); if (voc.trim()) feedLivePools(voc, LIVE_W.gen); } catch { /* egal */ }
      const id = preset.value;
      if (id.startsWith("user:")) {
        applyActive2(getUserPreset2(id.slice(5)));  // 2.0-Preset wiederherstellen (oder null)
      } else {
        setActive2(null); setDramaData(null);
        if (applyParamsChk.checked) { const st = builtinSettings(id); if (Object.keys(st).length) { try { localStorage.setItem("dm_pending_studio", JSON.stringify(st)); } catch { /* voll */ } } }
      }
    }
  });
  delPresetBtn.addEventListener("click", () => {
    if (!preset.value.startsWith("user:")) return;
    const name = preset.value.slice(5);
    if (!confirm(`Eigenes Preset „${name}" löschen? (Die aktuelle Wortbank bleibt unverändert.)`)) return;
    deleteUserPreset(name); deleteUserPreset2(name);
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
    if (name) {
      saveCurrentBankAsUserPreset(name);
      const a2 = getActive2(); if (a2) saveUserPreset2(name.trim().slice(0, 40), a2);
      rebuildPresets("user:" + name.trim().slice(0, 40));
    }
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
        const a2 = p2 ? preset2Active(parsed) : null;
        applyActive2(a2);
        fullInfo.textContent = `Geladen — ${bankEntryCount(bank)} Einträge${a2 && a2.pools.length ? ` · ${a2.pools.length} Kontext-Begriffe in die Pools` : ""}${stagedInfo(a2)}.`;
      } catch { fullInfo.textContent = "Datei nicht lesbar (kein gültiges JSON)."; }
      fileIn.value = "";
    };
    r.readAsText(fl);
  });
  const loadFileBtn = el("button", {}, icon("refresh"), " Aus Datei laden…");
  loadFileBtn.addEventListener("click", () => fileIn.click());
  // ── Preset-2.0-Felder (nur bei aktivem 2.0-Preset editierbar) ──
  const P2FIELDS: [string, string][] = [
    ["einstieg", "Einstieg"], ["mitte", "Mitte"], ["hoehepunkt", "Höhepunkt"], ["schluss", "Schluss"],
    ["ausloeser", "Auslöser"], ["veraenderungen", "Veränderungen"], ["konflikte", "Konflikte"],
    ["zeitanomalien", "Zeitanomalien"], ["regeln", "Regeln / Naturgesetze"],
  ];
  const p2Areas: Record<string, HTMLTextAreaElement> = {};
  const p2Grid = el("div", {});
  for (const [key, label] of P2FIELDS) {
    const t = el("textarea", { id: "wb-p2-" + key, style: "height:66px", placeholder: "Ein Eintrag pro Zeile" }) as HTMLTextAreaElement;
    p2Areas[key] = t;
    p2Grid.append(el("div", { class: "field" }, el("span", { class: "field-label" }, label), t));
  }
  const p2Pools = el("textarea", { id: "wb-p2-pools", style: "height:66px", placeholder: "Orte, Figuren, Objekte … (ein Eintrag pro Zeile)" }) as HTMLTextAreaElement;
  p2Grid.append(el("div", { class: "field" }, el("span", { class: "field-label" }, "Kontext-Pools"), p2Pools));
  const p2ToneSel = select("wb-p2-tone", [["", "(kein)"], ["neutral", "Neutral"], ["mystery", "Mystery"], ["poetic", "Poetisch"], ["melancholisch", "Melancholisch"], ["dark", "Düster"], ["unheimlich", "Unheimlich"], ["uplifting", "Hoffnungsvoll"], ["zaertlich", "Zärtlich"], ["traeumerisch", "Träumerisch"], ["nuechtern", "Nüchtern"], ["ironisch", "Ironisch"], ["humorous", "Humorvoll"]], "");
  const lines2 = (t: HTMLTextAreaElement): string[] => t.value.split("\n").map((x) => x.trim()).filter(Boolean);
  const apply2Btn = button("2.0-Felder übernehmen");
  const p2fInfo = el("span", { class: "muted" });
  apply2Btn.addEventListener("click", () => {
    const a = getActive2(); if (!a) return;
    const drama = {
      einstieg: lines2(p2Areas.einstieg!), mitte: lines2(p2Areas.mitte!), hoehepunkt: lines2(p2Areas.hoehepunkt!), schluss: lines2(p2Areas.schluss!),
      ausloeser: lines2(p2Areas.ausloeser!), veraenderungen: lines2(p2Areas.veraenderungen!), konflikte: lines2(p2Areas.konflikte!),
      zeitanomalien: lines2(p2Areas.zeitanomalien!), regeln: lines2(p2Areas.regeln!),
    };
    const anyDrama = Object.values(drama).some((x) => x.length > 0);
    const settings = { ...a.settings, tone: p2ToneSel.value || undefined, structure: anyDrama ? "dramaturgie" : undefined };
    const a2: Active2 = { drama: anyDrama ? drama : null, pools: lines2(p2Pools), settings };
    setActive2(a2); setDramaData(a2.drama);
    if (preset.value.startsWith("user:")) saveUserPreset2(preset.value.slice(5), a2);
    p2fInfo.textContent = "2.0-Felder übernommen ✓" + (preset.value.startsWith("user:") ? " · Preset aktualisiert" : "");
    setTimeout(() => (p2fInfo.textContent = ""), 2500);
  });
  const render2 = (): void => {
    const a = getActive2();
    p2Wrap.style.display = a ? "" : "none";
    if (!a) return;
    const d = a.drama as Record<string, string[]> | null;
    for (const [key] of P2FIELDS) p2Areas[key]!.value = d && Array.isArray(d[key]) ? d[key]!.join("\n") : "";
    p2Pools.value = (a.pools || []).join("\n");
    p2ToneSel.value = a.settings && a.settings.tone ? a.settings.tone : "";
  };
  const p2Wrap = el("div", { style: "display:none" },
    el("hr", {}),
    el("p", { class: "muted" }, "Preset-2.0-Felder — nur bei aktivem 2.0-Preset. Erzählbogen (Einstieg→Schluss), Auslöser/Veränderungen, Konflikte, Zeitanomalien, Regeln, Kontext-Pools und Ton. „2.0-Felder übernehmen“ aktualisiert Dramaturgie, Pools und Ton (und ein geladenes eigenes 2.0-Preset)."),
    el("label", { class: "field lenrow" }, "Ton ", p2ToneSel),
    p2Grid,
    el("div", { class: "btnrow" }, apply2Btn, p2fInfo));
  refresh2 = render2;

  const fullBox = el("details", { class: "fine" });
  fullBox.addEventListener("toggle", () => { if (fullBox.open) { renderFull(); render2(); } });
  fullBox.append(
    el("summary", {}, icon("floppy"), " Ganze Wortbank bearbeiten & sichern"),
    el("p", { class: "muted" }, "Alle Kategorien direkt bearbeiten. „Alle übernehmen“ speichert in die aktive Wortbank; „Speichern unter“ schreibt sie als JSON-Datei; „Aus Datei laden“ liest eine gespeicherte Wortbank (oder ein Projekt) wieder ein."),
    fullGrid,
    el("div", { class: "btnrow" }, applyAllBtn, saveAsFileBtn, loadFileBtn, fileIn),
    p2Wrap,
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
        const a2 = preset2Active(r.obj);
        applyActive2(a2);
        p2Info.textContent = `„${r.name}“ erzeugt & aktiviert (${bankEntryCount(r.bank)} Einträge${a2.pools.length ? `, ${a2.pools.length} Kontext-Begriffe in die Pools` : ""}${stagedInfo(a2)}). Unten als Datei sichern oder als Preset speichern.`;
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
