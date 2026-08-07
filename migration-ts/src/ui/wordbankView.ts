// Wortbank-Tab: Preset-Wahl, Listen-Editor, Mutation, Reset, Als Preset speichern.
import type { BankKey } from "../types";
import { el, select, field, button } from "./dom";
import { loadBank, saveBank, normalizeBankShape } from "../storage";
import { getAllPresets, sortedPresetOptions, saveCurrentBankAsUserPreset, deleteUserPreset, mutateBank, bankEntryCount, buildAutoMixBank, saveActiveBankLabel, loadActiveBankLabel, loadUserPresets, saveUserPresets, AUTOMIX_ID } from "../wordbank";
import { DEFAULT_BANK } from "../constants";
import { loadPersistentCorpus } from "../corpus";
import { feedLivePools, LIVE_W } from "../features/livepools";
import { openPresetWizard } from "./presetWizard";
import { openArchive } from "./archiveView";
import { preset2ToBank, preset2Name, preset2Active, builtinSettings, generateAiPreset2, setActive2, getActive2, saveUserPreset2, saveUserPresets2All, getUserPreset2, deleteUserPreset2, loadUserPresets2, type Active2 } from "../features/preset2";
import { setDramaData } from "../generation/dramaturgie";
import { isPastTense, toPresent, isSecondPerson, isFirstPerson } from "../generation/coherence";
import { bankFromCorpus } from "../features/corpusbank";
import { icon } from "./icons";
import { loadAiKey } from "../features/ki";
import { loadSchnappschuss } from "../features/sources";

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
  const renamePresetBtn = button("Preset umbenennen");

  const updDelPreset = (): void => { const isUser = preset.value.startsWith("user:"); delPresetBtn.disabled = !isUser; renamePresetBtn.disabled = !isUser; delPresetBtn.title = isUser ? "" : "Nur für eigene Presets"; renamePresetBtn.title = isUser ? "" : "Nur für eigene Presets"; };
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
  renamePresetBtn.addEventListener("click", () => {
    if (!preset.value.startsWith("user:")) return;
    const old = preset.value.slice(5);
    const raw = prompt("Neuer Name für das Preset:", old);
    if (raw === null) return;
    const neu = raw.trim().slice(0, 40);
    if (!neu || neu === old) return;
    const users = loadUserPresets();
    if (users[neu] && !confirm(`„${neu}" existiert bereits — überschreiben?`)) return;
    if (users[old]) { users[neu] = users[old]!; delete users[old]; saveUserPresets(users); }
    const u2 = loadUserPresets2();
    if (u2[old]) { u2[neu] = u2[old]!; delete u2[old]; saveUserPresets2All(u2); }
    if ((loadActiveBankLabel() || "") === old) saveActiveBankLabel(neu);
    rebuildPresets("user:" + neu);
  });
  updDelPreset();


  const info = el("p", { class: "muted" }, "");

  let renderFull: () => void = () => {};
  const load = (): void => {
    const bank = loadBank();
    info.textContent = `${bankEntryCount(bank)} Einträge gesamt`;
    // Voll-Felder werden NICHT hier befüllt, um in Arbeit befindliche Bearbeitungen
    // nicht zu überschreiben; das geschieht beim Öffnen des Bereichs (toggle) und
    // nach „Alle übernehmen"/Import.
    if (fullBox.open) renderFull();
  };
  const autoMixBtn = el("button", {}, icon("dice"), " Auto-Mix würfeln");
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
    // Die Bank entsteht AUSSCHLIESSLICH aus diesem Korpus. Wer ihn nicht im Kopf hat,
    // bekommt eine Wortbank zum Thema seiner letzten Versuche und vergibt beim
    // Speichern ahnungslos einen ganz anderen Namen. Also vorher zeigen, woraus gebaut wird.
    const eintraege = corpus.split(/\n{2,}/).map((x) => x.trim()).filter(Boolean);
    const probe = eintraege.slice(0, 5)
      .map((e, i) => `  ${i + 1}. ${e.slice(0, 70)}${e.length > 70 ? "…" : ""}`).join("\n");
    const mehr = eintraege.length > 5 ? `\n  … und ${eintraege.length - 5} weitere` : "";
    if (!confirm(`Die Wortbank entsteht ausschließlich aus deinem Korpus — ihr Thema ist das Thema dieser Texte.\n\n`
      + `${eintraege.length} ${eintraege.length === 1 ? "Eintrag" : "Einträge"}, ${corpus.length} Zeichen:\n${probe}${mehr}\n\nFortfahren?`)) return;
    const bank = bankFromCorpus(corpus);
    saveBank(bank); saveActiveBankLabel("Aus Korpus"); preset.selectedIndex = -1; load();
    info.textContent = `Aus Korpus gefüllt (${bankEntryCount(bank)} Einträge). Im Listen-Editor nachschärfen, dann „Als Preset speichern".`;
  });
  const saveAs = button("Als Preset speichern");
  saveAs.addEventListener("click", () => {
    // Vorschlag: der aktive Bank-Name (nach „KI-Preset 2.0 erzeugen“ = Inspirations-/Beschreibungsname)
    const label = (loadActiveBankLabel() || "").trim();
    const def = label.replace(/^[^0-9A-Za-zÄÖÜäöüß]+/, "").trim() || "MeinPreset";
    // Gespeichert wird die AKTIVE Bank — und die ist ein flüchtiger Arbeitsplatz:
    // Eine Mehrfachauswahl im Studio überschreibt sie mit der Mischung. Wer danach
    // hier speichert, legt die Mischung unter dem alten Namen ab. Deshalb erst zeigen,
    // was tatsächlich abgelegt wird.
    const n = bankEntryCount(loadBank());
    const istMix = /^(Mix:|Auto-Mix)/i.test(label);
    const warn = istMix
      ? `\n\n⚠ ACHTUNG: Die aktive Bank ist eine MISCHUNG („${label}“). Gespeichert wird diese Mischung, `
        + `nicht das ursprüngliche Preset. Wenn du ein einzelnes Preset sichern willst, wähle es zuerst allein aus.`
      : "";
    if (!confirm(`Gespeichert wird die aktive Wortbank:\n\n„${label || "ohne Namen"}“ · ${n} Einträge${warn}\n\nFortfahren?`)) return;
    const name = prompt("Name für dein Preset:", def);
    if (name) {
      saveCurrentBankAsUserPreset(name);
      const a2 = getActive2(); if (a2) saveUserPreset2(name.trim().slice(0, 40), a2);
      rebuildPresets("user:" + name.trim().slice(0, 40));
    }
  });

  const wizardBtn = el("button", { class: "primary" }, icon("tool"), " Preset-Assistent (offline)");
  wizardBtn.addEventListener("click", () => {
    openPresetWizard((id) => {
      if (!id) return;
      rebuildPresets(id);
      load(); renderFull();
    });
  });
  const archiveBtn = button("Wortarchiv");
  archiveBtn.addEventListener("click", () => openArchive());

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
  // Tempus-Hinweis je Kategorie: Die Engine baut im Präsens — Präteritum-Einträge
  // erzeugen Zeitebenen-Sprünge im fertigen Text.
  const tenseHints: Record<string, HTMLElement> = {};
  const updTenseHint = (key: string): void => {
    const h = tenseHints[key]; const ta = fullAreas[key]; if (!h || !ta) return;
    const lines = ta.value.split("\n").map((x) => x.trim()).filter(Boolean);
    const past = lines.filter(isPastTense);
    const persons = lines.filter((x) => isSecondPerson(x) || isFirstPerson(x));
    const msgs: string[] = [];
    if (past.length) msgs.push(`${past.length}× Präteritum (z. B. „${past[0]!.slice(0, 40)}“) — die Engine schreibt im Präsens`);
    if (persons.length) msgs.push(`${persons.length}× Ich-/Du-Form (z. B. „${persons[0]!.slice(0, 40)}“) — bricht die Erzählperspektive`);
    if (!msgs.length) { h.textContent = ""; h.className = "muted mini"; return; }
    h.className = "muted mini tensewarn";
    h.textContent = "⚠ " + msgs.join(" · ");
  };
  for (const [key, label] of CATS) {
    const t = el("textarea", { id: "wb-full-" + key, style: "height:88px", placeholder: "Ein Eintrag pro Zeile" }) as HTMLTextAreaElement;
    fullAreas[key] = t;
    const hint = el("div", { class: "muted mini" });
    tenseHints[key] = hint;
    t.addEventListener("input", () => updTenseHint(key));
    fullGrid.append(el("div", { class: "field" }, el("span", { class: "field-label" }, label), t, hint));
  }
  renderFull = (): void => { const bank = loadBank(); for (const [key] of CATS) if (fullAreas[key]) { fullAreas[key]!.value = (bank[key as BankKey] || []).join("\n"); updTenseHint(key); } };
  // Offline-Konverter: wandelt eindeutige Präteritum-Formen in Präsens; unsichere bleiben stehen.
  const tenseFixBtn = button("Präteritum → Präsens");
  tenseFixBtn.title = "Wandelt eindeutige Vergangenheitsformen in Präsens. Unsichere Fälle bleiben unverändert und werden weiter markiert.";
  tenseFixBtn.addEventListener("click", () => {
    let changed = 0, kept = 0;
    for (const [key] of CATS) {
      const ta = fullAreas[key]; if (!ta) continue;
      const lines = ta.value.split("\n");
      const out = lines.map((line) => {
        if (!line.trim() || !isPastTense(line)) return line;
        const r = toPresent(line);
        if (r.changed) { changed++; return r.text; }
        kept++; return line;
      });
      ta.value = out.join("\n"); updTenseHint(key);
    }
    fullInfo.textContent = changed || kept
      ? `${changed} Eintrag/Einträge ins Präsens gesetzt${kept ? `, ${kept} unsicher gelassen (bitte selbst prüfen)` : ""}. Noch nicht gespeichert — „Alle übernehmen“ klicken.`
      : "Keine eindeutigen Präteritum-Formen gefunden.";
  });
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

  const fullBox = el("details", { class: "fine", open: "" });
  fullBox.addEventListener("toggle", () => { if (fullBox.open) { renderFull(); render2(); } });
  fullBox.append(
    el("summary", {}, icon("floppy"), " Preset bearbeiten und sichern"),
    el("p", { class: "muted" }, "Alle Kategorien direkt bearbeiten. „Alle übernehmen“ speichert in die aktive Wortbank; „Speichern unter“ schreibt sie als JSON-Datei; „Aus Datei laden“ liest eine gespeicherte Wortbank (oder ein Projekt) wieder ein."),
    fullGrid,
    el("div", { class: "btnrow" }, applyAllBtn, tenseFixBtn, saveAsFileBtn, loadFileBtn, fileIn),
    p2Wrap,
    fullInfo);




  // ---- KI-Preset 2.0 (experimentell): erzeugt ein komplettes Preset 2.0 per KI ----
  const p2Insp = el("input", { placeholder: "Inspiration / Beschreibung, z. B. „Haruki Murakami“" }) as HTMLInputElement;
  const p2Out = el("textarea", { style: "height:150px", placeholder: "Das erzeugte Preset-2.0-JSON erscheint hier." }) as HTMLTextAreaElement;
  const p2Info = el("p", { class: "muted" }, "");
  let p2Json = "";
  // 4W-Schalter: Frueher floss der Studio-Kontext bei manchen Wegen unbemerkt in den
  // Auftrag - daher die Hirten in sechs eingebauten Presets. Jetzt ist es eine
  // bewusste Entscheidung, und der Hinweis zeigt, worum es geht.
  const p2Ctx = el("input", { type: "checkbox", id: "p2-ctx" }) as HTMLInputElement;
  const p2CtxInfo = el("span", { class: "muted mini" }, "");
  const vierW = (): { where: string; when: string; who: string; what: string } => {
    const sn = loadSchnappschuss();
    return { where: sn?.where || "", when: sn?.when || "", who: sn?.who || "", what: sn?.what || "" };
  };
  const updP2Ctx = (): void => {
    const c = vierW();
    const teile = [c.where, c.when, c.who, c.what].filter(Boolean).join(" · ");
    p2CtxInfo.textContent = p2Ctx.checked
      ? (teile ? `→ fließt in den Auftrag ein: ${teile}` : "→ keine 4W-Angaben im Studio gesetzt")
      : (teile ? `aus: ${teile} bleibt außen vor — das Preset richtet sich allein nach der Inspiration` : "");
  };
  p2Ctx.addEventListener("change", updP2Ctx);
  const p2CtxLbl = el("label", { class: "chk", title: "Nimmt Wo/Wann/Wer/Was aus dem Studio in den Auftrag auf." },
    p2Ctx, " 4W-Kontext einbeziehen");
  const p2Lbl = el("span", {}, "Preset 2.0 erzeugen");
  const p2Btn = el("button", {}, icon("flask"), " ", p2Lbl) as HTMLButtonElement;
  p2Btn.addEventListener("click", () => {
    void (async () => {
      if (!loadAiKey()) { alert("Kein API-Schlüssel — bitte unter Studio ▸ Einstellungen ▸ KI-Zugang hinterlegen."); return; }
      p2Btn.disabled = true; p2Lbl.textContent = "Erzeuge…";
      try {
        const r = await generateAiPreset2(p2Insp.value, undefined, p2Ctx.checked ? vierW() : null);
        p2Json = r.json; p2Out.value = r.json;
        saveBank(r.bank); saveActiveBankLabel(r.name); preset.selectedIndex = -1; load(); renderFull();
        const a2 = preset2Active(r.obj);
        applyActive2(a2);
        p2Info.textContent = `„${r.name}“ erzeugt & aktiviert (${bankEntryCount(r.bank)} Einträge${a2.pools.length ? `, ${a2.pools.length} Kontext-Begriffe in die Pools` : ""}${stagedInfo(a2)}). Unten als Datei sichern oder als Preset speichern.`;
      } catch (e) { p2Info.textContent = "Fehlgeschlagen: " + (e instanceof Error ? e.message : String(e)); }
      finally { p2Btn.disabled = false; p2Lbl.textContent = "Preset 2.0 erzeugen"; }
    })();
  });
  updP2Ctx();
  // Bestehendes Preset auf 2.0 heben: nutzt den Saat-Pfad ("Thema beibehalten und
  // schaerfen"), der bisher nur im Prompt existierte, aber von keiner Schaltflaeche
  // aufgerufen wurde. Ergaenzt Dramaturgie, Transformation, Konflikte, Zeitanomalien
  // und Regeln - ohne Dramaturgie-Block ist die Struktur "Dramaturgie" wirkungslos.
  const p2UpLbl = el("span", {}, "Aktives Preset auf 2.0 heben");
  const p2UpBtn = el("button", {}, icon("flask"), " ", p2UpLbl) as HTMLButtonElement;
  p2UpBtn.addEventListener("click", () => {
    void (async () => {
      if (!loadAiKey()) { alert("Kein API-Schlüssel — bitte unter Studio ▸ Einstellungen ▸ KI-Zugang hinterlegen."); return; }
      const label = (loadActiveBankLabel() || "").trim();
      const bank = loadBank();
      const n = bankEntryCount(bank);
      if (n < 10) { p2Info.textContent = "Die aktive Wortbank ist zu klein — erst ein Preset auswählen."; return; }
      if (!confirm(`„${label || "aktive Bank"}“ (${n} Einträge) wird als Vorlage an die KI geschickt.\n\n`
        + `Das Thema bleibt erhalten; ergänzt werden Dramaturgie, Transformation, Konflikte, Zeitanomalien und Regeln. `
        + `Zeitformen werden ins Präsens gebracht, fehlende Artikel ergänzt.\n\nDas Ergebnis ersetzt die aktive Bank — `
        + `unter „Als Preset speichern“ landet es erst, wenn du es speicherst.\n\nFortfahren?`)) return;
      p2UpBtn.disabled = true; p2UpLbl.textContent = "Hebe…";
      try {
        const r = await generateAiPreset2(label || "unbenannt", JSON.stringify(bank), p2Ctx.checked ? vierW() : null);
        p2Json = r.json; p2Out.value = r.json;
        saveBank(r.bank); saveActiveBankLabel(r.name || label); preset.selectedIndex = -1; load(); renderFull();
        const a2 = preset2Active(r.obj);
        applyActive2(a2);
        p2Info.textContent = `„${r.name}“ auf 2.0 gehoben: ${n} → ${bankEntryCount(r.bank)} Einträge`
          + `${a2.drama ? ", mit Dramaturgie-Block" : ", OHNE Dramaturgie-Block (bitte prüfen)"}. `
          + `Vergleiche das JSON, bevor du es als Preset speicherst.`;
      } catch (e) { p2Info.textContent = "Fehlgeschlagen: " + (e instanceof Error ? e.message : String(e)); }
      finally { p2UpBtn.disabled = false; p2UpLbl.textContent = "Aktives Preset auf 2.0 heben"; }
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
    el("summary", {}, icon("flask"), " KI-Preset 2.0 erzeugen"),
    el("p", { class: "muted" }, "Erzeugt ein komplettes Preset 2.0 (Welt, Orte, Figuren, Objekte, Ton, generatoren). Genutzt werden davon die Wortbank (generatoren) und die Kontext-Felder (in die lebendigen Pools); die übrigen Felder sind Metadaten. Braucht einen API-Schlüssel."),
    field("Inspiration", p2Insp),
    el("div", { class: "btnrow" }, p2Btn, p2UpBtn, p2CtxLbl, p2SaveBtn), p2CtxInfo,
    p2Info, p2Out);

  const rulesBox = el("details", { class: "fine" });
  rulesBox.append(
    el("summary", {}, icon("settings"), " Regeln zum Befüllen"),
    el("p", { class: "muted" }, "Ein Eintrag pro Zeile. Was die Engine automatisch macht: Satzanfänge großschreiben, Groß/Klein nach „und/oder/aber …“ anpassen, Requisiten deklinieren (Artikel klein). Was du selbst richtig setzen musst: deutsche Nomen großschreiben (die Engine erkennt keine Nomen) und satzartige Einträge im PRÄSENS formulieren („die Tür bleibt verschlossen“, nicht „blieb“) — die Engine baut im Präsens, Präteritum erzeugt Zeitsprünge im Text."),
    (() => { const ul = el("ul", { class: "help-list" });
      ([
        ["Motive", "kurze, bildhafte Phrasen (3–8 Wörter), ohne Punkt am Ende, z. B. „ein leerer Bahnhof am Nachmittag“."],
        ["Hooks", "kleine, irritierende Details als ganzer Satz, z. B. „Das Telefon klingelte genau einmal.“"],
        ["Requisiten", "Gegenstände, z. B. „ein Kompass“, „eine Muschel“. Werden automatisch dekliniert (Artikel-Schreibweise egal). Bei klarer Endung (-ung/-heit/-keit → die, -chen/-lein → das, -er/-ling → der) genügt das bloße Nomen — die Engine ergänzt den Artikel. Bei uneindeutigen Nomen (z. B. Muschel, Segel) bitte den Artikel angeben."],
        ["Wendungen", "Wendepunkte als kurzer Satz/Phrase, z. B. „eine Katze führt den Weg“."],
        ["Hindernisse", "Hindernisse als kurzer Satz, z. B. „die Stadt schweigt“."],
        ["Einsätze", "kurze Nominalphrasen (worum es geht), z. B. „Identität“, „die Rückkehr an ein Ufer“."],
        ["Enden", "Schlusssätze als ganzer Satz, z. B. „Die Musik spielte weiter.“"],
      ] as [string, string][]).forEach(([k, v]) => ul.append(el("li", {}, el("b", {}, k), " — " + v)));
      return ul; })(),
    el("p", { class: "muted" }, "Faustregel: schreib jeden Eintrag so, wie er mitten im Satz stünde — führender Artikel/Pronomen klein, Nomen groß. Anführungszeichen oder Sonderzeichen sind nicht nötig."));
  // ---- Mehrere Presets per KI aktualisieren ----
  const batchInfo = el("p", { class: "muted" }, "");
  const batchList = el("div", { style: "max-height:200px;overflow:auto;border:1px solid var(--border);border-radius:8px;padding:8px 10px;margin:6px 0" });
  const batchChks: Record<string, HTMLInputElement> = {};
  const rebuildBatchList = (): void => {
    batchList.innerHTML = ""; for (const k of Object.keys(batchChks)) delete batchChks[k];
    for (const [id, label] of sortedPresetOptions()) {
      if (id === AUTOMIX_ID) continue;
      const c = el("input", { type: "checkbox" }) as HTMLInputElement;
      batchChks[id] = c;
      batchList.append(el("label", { class: "chk", style: "display:block" }, c, " " + label + (id.startsWith("builtin:") ? " → Kopie „…2.0“" : "")));
    }
  };
  rebuildBatchList();
  const selAll = button("Alle"); selAll.addEventListener("click", () => { for (const c of Object.values(batchChks)) c.checked = true; });
  const selNone = button("Keine"); selNone.addEventListener("click", () => { for (const c of Object.values(batchChks)) c.checked = false; });
  const stripIcon = (l: string): string => l.replace(/^[^A-Za-z0-9ÄÖÜäöüß]+/, "").trim();
  const batchLbl = el("span", {}, "Ausgewählte aktualisieren");
  const batchBtn = el("button", { class: "primary" }, icon("flask"), " ", batchLbl) as HTMLButtonElement;
  batchBtn.addEventListener("click", () => {
    void (async () => {
      if (!loadAiKey()) { alert("Kein API-Schlüssel — bitte unter Studio ▸ Einstellungen ▸ KI-Zugang hinterlegen."); return; }
      const ids = Object.keys(batchChks).filter((id) => batchChks[id]!.checked);
      if (!ids.length) { batchInfo.textContent = "Nichts ausgewählt."; return; }
      batchBtn.disabled = true; let done = 0, failed = 0;
      for (const id of ids) {
        const p = getAllPresets()[id]; if (!p) continue;
        batchLbl.textContent = `Aktualisiere… (${done + failed + 1}/${ids.length})`;
        batchInfo.textContent = `${p.label}: läuft …`;
        try {
          const seed = JSON.stringify({ thema: p.label, generatoren: p.bank, ...(id.startsWith("user:") && getUserPreset2(id.slice(5)) ? (() => { const a = getUserPreset2(id.slice(5))!; return a.drama ? { dramaturgie: { einstieg: a.drama.einstieg, mitte: a.drama.mitte, hoehepunkt: a.drama.hoehepunkt, schluss: a.drama.schluss }, transformation: { ausloeser: a.drama.ausloeser, veraenderungen: a.drama.veraenderungen }, konflikte: { typisch: a.drama.konflikte } } : {}; })() : {}) });
          const r = await generateAiPreset2(stripIcon(p.label), seed);
          const a2 = preset2Active(r.obj);
          if (id.startsWith("user:")) {
            const name = id.slice(5);
            const users = loadUserPresets(); users[name] = r.bank; saveUserPresets(users); saveUserPreset2(name, a2);
          } else {
            const name = (stripIcon(p.label) + " 2.0").slice(0, 40);
            const users = loadUserPresets(); users[name] = r.bank; saveUserPresets(users); saveUserPreset2(name, a2);
          }
          done++;
        } catch { failed++; }
      }
      rebuildPresets(); rebuildBatchList();
      batchBtn.disabled = false; batchLbl.textContent = "Ausgewählte aktualisieren";
      batchInfo.textContent = `Fertig: ${done} aktualisiert${failed ? `, ${failed} fehlgeschlagen` : ""}.`;
    })();
  });
  const batchBox = el("details", { class: "fine" });
  batchBox.addEventListener("toggle", () => { if (batchBox.open) rebuildBatchList(); });
  batchBox.append(
    el("summary", {}, icon("flask"), " Mehrere Presets per KI aktualisieren"),
    el("p", { class: "muted" }, "Ausgewählte Presets werden nacheinander per KI verbessert (Grammatik/Artikel, mehr Einträge, 2.0-Felder). Eigene Presets werden ersetzt; eingebaute als neue Kopie „…2.0“ gespeichert. Braucht einen API-Schlüssel und verbraucht pro Preset eine Anfrage."),
    el("div", { class: "btnrow" }, selAll, selNone),
    batchList,
    el("div", { class: "btnrow" }, batchBtn),
    batchInfo);


  wrap.append(
    el("div", { class: "btnrow" }, wizardBtn, archiveBtn),
    field("Preset", preset),
    el("div", { class: "btnrow" }, delPresetBtn, renamePresetBtn),
    rulesBox,
    el("div", { class: "btnrow" }, mutBtn, mutSlider, " ", mutVal, resetBtn),
    el("div", { class: "btnrow" }, autoMixBtn, fillBtn, saveAs),
    info,
    applyParamsRow,
    fullBox,
    p2Box,
    batchBox,
  );
  root.append(wrap);
  load();
  refresh2(); // 2.0-Felder initial füllen — die Box ist jetzt standardmäßig offen
}
