// Studio-Tab: Kontext, Regler, Preset, Generieren/Variante/Kopieren,
// Lesemodus (Vollbild) und Vorlesen (SpeechSynthesis).
import type { GenInput, FormKind } from "../types";
import { loadBank, saveBank } from "../storage";
import { getAllPresets, saveActiveBankLabel, buildAutoMixBank, buildMergedBank, lastAutoMixSources, AUTOMIX_ID } from "../wordbank";
import { markedPresetOptions, getUserPreset2 } from "../features/preset2";
import { setDramaData } from "../generation/dramaturgie";
import { buildStory } from "../generation/buildStory";
import { getMarkovTrace } from "../generation/markovTrace";
import { buildModelFromCorpus, savePersistentCorpus } from "../corpus";
import { feedLivePools, LIVE_W } from "../features/livepools";
import { enforceWordTarget } from "../generation/length";
import { randomContext } from "../generation/context";
import { normWhere, normWhen, normWho, rateWhere, rateWhen, rateWho } from "../generation/ctxnorm";
import { getTraceFor, fuegeteilAnteil } from "../atoms/trace";
import { saveSchnappschuss, loadSchnappschuss } from "../features/sources";
import { renderTextstruktur } from "./structureView";
import { extractLeadVerb, looksLikeFullClause, splitSpeakers } from "../generation/wordcls";
import { el, select, field, textInput, button } from "./dom";
import { icon } from "./icons";
import { openReader } from "./reader";
import { worldLogGeneration } from "../features/world";
import { addToTreasury, addToTreasurySecret, clearTreasury } from "../features/treasury";
import { THEMES, loadTheme, applyTheme, loadAccent, saveAccent, applyAccent } from "../features/theme";
import { loadAiKey, saveAiKey, loadAiModel, saveAiModel } from "../features/ki";
import { storageReport } from "../features/storage-status";
import { loadFont, loadFontSize, saveFontPrefs, applyStoryFont } from "../features/fonts";
import { runProbe, runRanking, bestOf, type Ranking } from "../generation/scoring";
import { TONE_DATA } from "../generation/tone.data";
import { liveTexts } from "../features/livepools";

// Überlebt den Tab-Wechsel: mountStudio läuft bei jeder Rückkehr neu.
let studioSchonGewuerfelt = false;
const studioReglerStand: Record<string, string> = {};

export function mountStudio(root: HTMLElement): void {
  root.innerHTML = "";
  const wrap = el("div", {});

  const where = textInput("f-where", "Wo?", "auf der Schafsweide");
  const when = textInput("f-when", "Wann?", "vor langer Zeit");
  const who = textInput("f-who", "Wer? (mehrere durch Komma = Dialog)", "Baucis, Philemon");
  const what = textInput("f-what", "Was passiert?", "ein Wunder geschieht");
  const clearable = (input: HTMLInputElement): HTMLElement => {
    const x = el("button", { class: "clr", type: "button", title: "Feld leeren" }, "×");
    x.addEventListener("click", () => { input.value = ""; input.dispatchEvent(new Event("input")); input.focus(); });
    return el("div", { class: "inwrap" }, input, x);
  };
  // Festhalter: gesperrte Regler/Felder bleiben beim Würfeln unverändert (persistiert).
  const LOCK_KEY = "divergenz_studio_locks_v1";
  const locked = new Set<string>((() => { try { return JSON.parse(localStorage.getItem(LOCK_KEY) || "[]") as string[]; } catch { return []; } })());
  const saveLocks = (): void => { try { localStorage.setItem(LOCK_KEY, JSON.stringify([...locked])); } catch { /* voll */ } };
  // Gesperrte Felder merken sich zusätzlich ihren Wert über den Neustart.
  const LOCKVAL_KEY = "divergenz_locked_vals_v1";
  const lockVals: Record<string, string> = (() => { try { return JSON.parse(localStorage.getItem(LOCKVAL_KEY) || "{}") as Record<string, string>; } catch { return {}; } })();
  const saveLockVals = (): void => { try { localStorage.setItem(LOCKVAL_KEY, JSON.stringify(lockVals)); } catch { /* voll */ } };
  const lockCtrls: Record<string, HTMLSelectElement | HTMLInputElement> = {};
  const lockPainters: Record<string, Array<() => void>> = {};
  const restoreLocked = (): void => { for (const id of locked) { const c = lockCtrls[id]; if (c && lockVals[id] !== undefined) c.value = lockVals[id]!; } };
  const lockBtn = (ctrl: HTMLSelectElement | HTMLInputElement): HTMLButtonElement => {
    lockCtrls[ctrl.id] = ctrl;
    const upd = (): void => { if (locked.has(ctrl.id)) { lockVals[ctrl.id] = ctrl.value; saveLockVals(); } };
    ctrl.addEventListener("input", upd); ctrl.addEventListener("change", upd);
    const b = el("button", { class: "lockbtn", type: "button", title: "Beim Würfeln festhalten (Wert bleibt auch nach Neustart)" }) as HTMLButtonElement;
    const paint = (): void => { b.innerHTML = ""; b.append(icon(locked.has(ctrl.id) ? "lock" : "lockOpen")); b.classList.toggle("on", locked.has(ctrl.id)); };
    (lockPainters[ctrl.id] ||= []).push(paint);
    const repaint = (): void => { (lockPainters[ctrl.id] || [paint]).forEach((fn) => fn()); };
    b.addEventListener("click", () => {
      if (locked.has(ctrl.id)) { locked.delete(ctrl.id); delete lockVals[ctrl.id]; }
      else { locked.add(ctrl.id); lockVals[ctrl.id] = ctrl.value; }
      saveLocks(); saveLockVals(); repaint();
    });
    paint(); return b;
  };
  const lockField = (label: string, sel: HTMLSelectElement): HTMLElement =>
    el("div", { class: "field" }, el("span", { class: "field-label lockrow" }, el("span", {}, label), lockBtn(sel)), sel);

  const ctxDice = el("button", {}, icon("dice"), " Kontext würfeln");
  ctxDice.addEventListener("click", () => { const c = randomContext(); if (!locked.has(where.id)) where.value = c.where; if (!locked.has(when.id)) when.value = c.when; if (!locked.has(who.id)) who.value = c.who; if (!locked.has(what.id)) what.value = c.what; updHints(); ctxSichern(); });
  const ctxKeep = el("button", { class: "toggle" }, icon("pin"), " Kontext merken");
  const CTX_KEY = "divergenz_ctx_v1";
  ctxKeep.title = "Wo/Wann/Wer/Was sichern und bei jedem Start laden";
  const setCtxKeep = (on: boolean): void => {
    ctxKeep.classList.toggle("on", on);
    ctxKeep.setAttribute("aria-pressed", String(on));
    try { if (on) localStorage.setItem(CTX_KEY, JSON.stringify({ where: where.value, when: when.value, who: who.value, what: what.value })); else localStorage.removeItem(CTX_KEY); } catch { /* voll */ }
  };
  ctxKeep.addEventListener("click", () => setCtxKeep(!ctxKeep.classList.contains("on")));
  // Der Schalter hat den Kontext bisher nur im Moment des Klicks gesichert. Wer ihn
  // früh einschaltet und die Felder danach ändert, bekam beim nächsten Aufbau die
  // alte Momentaufnahme zurück — genau der scheinbare Reset auf „London / Tom“.
  const ctxSichern = (): void => {
    if (!ctxKeep.classList.contains("on")) return;
    try { localStorage.setItem(CTX_KEY, JSON.stringify({ where: where.value, when: when.value, who: who.value, what: what.value })); } catch { /* voll */ }
  };
  [where, when, who, what].forEach((f) => { f.addEventListener("input", ctxSichern); f.addEventListener("change", ctxSichern); });
  // Stärke-Regler (experimentell, nur Prosa): je 4W-Feld direkt darunter.
  const mkWeight = (id: string): HTMLInputElement => el("input", { id, class: "wgt", type: "range", min: "0", max: "3", step: "1", value: "0", title: "Stärke — mehr über dieses Feld" }) as HTMLInputElement;
  const wWo = mkWeight("f-w-wo"), wWann = mkWeight("f-w-wann"), wWer = mkWeight("f-w-wer"), wWas = mkWeight("f-w-was");
  // Live-Hinweis: zeigt, wie die Engine den Wert grammatisch einsetzt („→ im Hafen“)
  const hintWo = el("span", { class: "ctxhint" });
  const hintWann = el("span", { class: "ctxhint" });
  const hintWer = el("span", { class: "ctxhint" });
  const hintWas = el("span", { class: "ctxhint" });
  const updHints = (): void => {
    const h = (inp: HTMLInputElement, fn: (v: string) => string, out: HTMLElement): void => {
      const v = inp.value.trim(); const n = v ? fn(v) : "";
      out.textContent = v && n && n !== v ? "→ " + n : "";
    };
    h(where, normWhere, hintWo); h(when, normWhen, hintWann);
    // Wer: normalisierte Form UND die Rollenverteilung (erste Figur = Hauptfigur)
    {
      const v = who.value.trim();
      if (!v) hintWer.textContent = "";
      else {
        const n = normWho(v);
        const sp = splitSpeakers(n);
        const norm = n !== v ? "→ " + n + " · " : "";
        if (sp.length <= 1) hintWer.textContent = norm + "eine Figur — sie trägt die Handlung";
        else if (form.value === "script") hintWer.textContent = norm + `${sp.length} Sprecher: ${sp.join(", ")} — reihum im Dialog`;
        else hintWer.textContent = norm + `Hauptfigur: ${sp[0]} · Nebenfigur${sp.length > 2 ? "n" : ""}: ${sp.slice(1).join(", ")} — die Handlung aus „Was passiert?" gehört der Hauptfigur, die übrigen werden eingewoben`;
      }
    }
    // Was: zeigt, WIE die Engine den Wert einwebt (Satz / Handlung / Vorhaben / Ereignis)
    const a = what.value.trim();
    let wasScore = -1;
    if (!a) hintWas.textContent = "";
    else {
      const lead = extractLeadVerb(a);
      if (lead.isInfinitiveLed) { hintWas.textContent = "→ als Vorhaben eingewoben („will " + lead.rest + "“)"; wasScore = 0.9; }
      else if (lead.verb) { hintWas.textContent = "→ als Handlung eingewoben (Verb: " + lead.verb + ")"; wasScore = 1; }
      else if (looksLikeFullClause(lead.verb, lead.rest)) { hintWas.textContent = "→ als eigener Satz eingewoben"; wasScore = 1; }
      else { hintWas.textContent = "→ als Ereignis-Phrase eingewoben"; wasScore = a.length >= 4 ? 0.7 : 0.4; }
    }
    // Farbcode: Feldhintergrund rot→grün je nach Einsetzbarkeit
    const tint = (inp: HTMLInputElement, score: number): void => {
      if (score < 0) { inp.style.backgroundColor = ""; return; }
      const hue = Math.round(120 * Math.max(0, Math.min(1, score)));
      inp.style.backgroundColor = `hsl(${hue} 65% 42% / 0.20)`;
    };
    tint(where, rateWhere(where.value)); tint(when, rateWhen(when.value)); tint(who, rateWho(who.value)); tint(what, wasScore);
  };
  [where, when, who, what].forEach((i) => i.addEventListener("input", updHints));
  const field4w = (label: string, inp: HTMLInputElement, weight: HTMLInputElement, hint?: HTMLElement): HTMLElement =>
    el("label", { class: "field" },
      el("span", { class: "field-label lockrow" }, el("span", {}, label), lockBtn(inp)),
      el("div", { class: "field4w" }, clearable(inp), weight),
      ...(hint ? [hint] : []));
  wrap.append(el("div", { class: "grid2" },
    field4w("Wo?", where, wWo, hintWo), field4w("Wann?", when, wWann, hintWann), field4w("Wer?", who, wWer, hintWer), field4w("Was passiert?", what, wWas, hintWas)),
    el("div", { class: "btnrow" }, ctxDice, ctxKeep));

  const lockBar = el("div", { class: "lockbar" });
  const preset = select("f-preset", markedPresetOptions());
  const MULTI_ID = "__multi__";
  const MULTI_KEY = "dm_multi_presets_v1";
  const saveMulti = (): void => { try { if (multiIds.length >= 2) localStorage.setItem(MULTI_KEY, JSON.stringify(multiIds)); else localStorage.removeItem(MULTI_KEY); } catch { /* voll */ } };
  const loadMulti = (): string[] => { try { const r = localStorage.getItem(MULTI_KEY); const a = r ? JSON.parse(r) : []; return Array.isArray(a) ? a.filter((x) => typeof x === "string") : []; } catch { return []; } };
  let multiIds: string[] = loadMulti();
  preset.addEventListener("change", () => {
    if (preset.value === MULTI_ID) { if (multiIds.length >= 2) applyMulti(); return; }
    if (multiIds.length) { multiIds = []; saveMulti(); }
    if (preset.value === AUTOMIX_ID) { saveBank(buildAutoMixBank()); saveActiveBankLabel("Auto-Mix"); setDramaData(null); return; }
    const p = getAllPresets()[preset.value];
    if (!p) return;
    saveBank(p.bank); saveActiveBankLabel(p.label || preset.value);
    const a2 = preset.value.startsWith("user:") ? getUserPreset2(preset.value.slice(5)) : null;
    if (a2) {
      setDramaData(a2.drama);
      const setV = (sel: HTMLSelectElement, v?: string): void => { if (v && Array.from(sel.options).some((o) => o.value === v)) sel.value = v; };
      const st = a2.settings;
      setV(tone, st.tone); setV(form, st.form); setV(structure, st.structure); setV(disruptor, st.disruptor); setV(instab, st.instability);
    } else { setDramaData(null); }
  });

  // ── Preset-Auswahl: eins ODER mehrere ankreuzen (steuert das versteckte Select) ──
  const stripIcon = (l: string): string => l.replace(/^[^\p{L}\p{N}]+/u, "").replace(/\s*✦2\.0$/, "").trim();
  const applyMulti = (): void => {
    if (multiIds.length < 2) return;
    saveBank(buildMergedBank(multiIds));
    const labels = multiIds.map((id) => stripIcon(getAllPresets()[id]?.label || id));
    saveActiveBankLabel("Mix: " + labels.join(" + "));
    setDramaData(null);
  };
  const ensureMultiOption = (): void => {
    let o = preset.querySelector('option[value="' + MULTI_ID + '"]') as HTMLOptionElement | null;
    if (!o) { o = document.createElement("option"); o.value = MULTI_ID; preset.insertBefore(o, preset.firstChild); }
    o.textContent = `Mehrere (${multiIds.length})`;
  };
  preset.style.display = "none"; // verstecktes Zustands-Element; die Checkbox-Liste steuert es
  const presetList = el("div", { class: "mplist" });
  const presetStatus = el("span", { class: "muted mini" });
  const autoMixStudioBtn = el("button", { class: "automixbtn", type: "button", title: "Pro Kategorie ein zufälliges Preset zusammenwürfeln" }, icon("dice"), " Auto-Mix würfeln");
  autoMixStudioBtn.addEventListener("click", () => {
    multiIds = []; saveMulti();
    preset.value = AUTOMIX_ID; preset.dispatchEvent(new Event("change"));
    renderPresetChecks();
  updHints();
  requestAnimationFrame(positionArrows);
  });
  const renderPresetChecks = (): void => {
    presetList.innerHTML = "";
    const selected = new Set<string>(preset.value === MULTI_ID ? multiIds : [preset.value]);
    const boxes: HTMLInputElement[] = [];
    const CATL: Record<string, string> = { motifs: "Motive", hooks: "Hooks", props: "Requisiten", turns: "Wendungen", obstacles: "Hindernisse", stakes: "Einsätze", endings: "Enden" };
    const mixSrc = preset.value === AUTOMIX_ID ? lastAutoMixSources() : {};
    markedPresetOptions().filter(([v]) => v !== AUTOMIX_ID).forEach(([v, l]) => {
      const cb = el("input", { type: "checkbox" }) as HTMLInputElement;
      cb.checked = selected.has(v); cb.value = v;
      cb.addEventListener("change", () => applySelection(boxes.filter((b) => b.checked).map((b) => b.value)));
      boxes.push(cb);
      const cats = mixSrc[v];
      const item = el("label", { class: "chk mpitem" + (cats ? " mixsrc" : "") }, cb, " " + l);
      if (cats) { item.title = "Auto-Mix-Quelle: " + cats.map((k) => CATL[k] || k).join(", "); item.append(el("span", { class: "mixsrc-badge" }, String(cats.length))); }
      presetList.append(item);
    });
    const curOpt = Array.from(preset.options).find((o) => o.value === preset.value);
    if (preset.value === MULTI_ID) {
      // Namen statt bloßer Anzahl — bei vielen Presets die ersten drei plus Rest
      const namen = multiIds.map((id) => stripIcon(getAllPresets()[id]?.label || id));
      const kurz = namen.length <= 3 ? namen.join(" + ") : namen.slice(0, 3).join(" + ") + ` + ${namen.length - 3} weitere`;
      presetStatus.textContent = `Aktiv: ${kurz}`;
      presetStatus.title = namen.join(" + ");
    } else if (preset.value === AUTOMIX_ID) {
      presetStatus.textContent = "Aktiv: Auto-Mix — Quellen schattiert"; presetStatus.title = "";
    } else {
      presetStatus.textContent = "Aktiv: " + (curOpt ? (curOpt.textContent || "—") : "—"); presetStatus.title = "";
    }
  };
  function applySelection(rawIds: string[]): void {
    const ids = rawIds.filter((v) => v !== MULTI_ID && v !== AUTOMIX_ID && v !== "__omni__");
    if (ids.length === 0) { renderPresetChecks(); return; }
    if (ids.length === 1) { multiIds = []; saveMulti(); preset.value = ids[0]!; preset.dispatchEvent(new Event("change")); renderPresetChecks(); return; }
    multiIds = ids; saveMulti(); applyMulti(); ensureMultiOption(); preset.value = MULTI_ID; renderPresetChecks(); liveRegen();
  }

  const tone = select("f-tone", [["neutral", "Neutral"], ["mystery", "Mystery"], ["poetic", "Poetisch"], ["melancholisch", "Melancholisch"], ["dark", "Düster"], ["unheimlich", "Unheimlich"], ["uplifting", "Hoffnungsvoll"], ["zaertlich", "Zärtlich"], ["traeumerisch", "Träumerisch"], ["nuechtern", "Nüchtern"], ["ironisch", "Ironisch"], ["humorous", "Humorvoll"]], "mystery");
  const form = select("f-form", [["prose", "Prosa"], ["poem", "Prosagedicht"], ["strang", "Gedicht-Strang"], ["reim", "Reim"], ["haiku", "Haiku"], ["script", "Szene/Dialog"], ["video", "Multi-Shot (Video)"]], "prose");
  const shots = el("input", { id: "f-shots", type: "number", value: "5", min: "3", max: "10" }) as HTMLInputElement;
  const secs = el("input", { id: "f-secs", type: "number", value: "15", min: "3", max: "600" }) as HTMLInputElement;
  const structure = select("f-structure", [["auto", "Auto"], ["linear", "Linear"], ["reverse", "Reverse"], ["circle", "Kreis"], ["fragment", "Fragment"], ["object", "Objekt"], ["dramaturgie", "Dramaturgie (Preset 2.0)"], ["rekombination", "Rekombination (geprüft)"]], "auto");
  const mode = select("f-mode", [["auto", "Auto"], ["bureau", "Bürokratie"], ["tech", "Tech-Mystik"], ["body", "Body"], ["myth", "Myth"], ["absurd", "Absurd"], ["post", "Posthuman"]], "auto");
  const persp = select("f-persp", [["auto", "Auto"], ["third", "Er/Sie"], ["first", "Ich"], ["second", "Du"], ["we", "Wir"], ["object", "Objekt"]], "auto");
  const rhythm = select("f-rhythm", [["auto", "Auto"], ["breath", "Atem"], ["staccato", "Staccato"], ["long", "Lange Bögen"], ["fracture", "Fraktur"], ["clean", "Klar"]], "auto");
  const tension = select("f-tension", [["off", "Aus"], ["top", "Oben (12 Uhr)"], ["mid", "Mitte (3 Uhr)"], ["low", "Unten (6 Uhr)"]], "off");
  const cast = select("f-cast", [["0", "Offen"], ["0.5", "Mittel"], ["1", "Streng"]], "0.5");
  const instab = select("f-instab", [["0", "Aus"], ["1", "Subtil"], ["2", "Aggressiv"]], "2");
  const markov = select("f-markov", [["off", "Aus"], ["mix", "Mix"], ["on", "Stark"]], "off");
  const disruptor = select("f-disruptor", [["auto", "Auto"], ["off", "Aus"], ["on", "An"]], "auto");
  const varianz = select("f-varianz", [["low", "Stabil"], ["mid", "Wild"], ["high", "Radikal"]], "mid");
  const stil = select("f-stil", [["surreal_precise", "Surreal präzise"], ["leicht", "Leicht"], ["stark", "Stark"]], "surreal_precise");
  const ARCH_OPTS: [string, string][] = [["neutral", "Neutral"], ["skorpion", "Skorpion"], ["psychopath", "Psychopath"], ["entdecker", "Entdecker"]];
  const archA = select("f-archa", ARCH_OPTS, "neutral");
  const archB = select("f-archb", ARCH_OPTS, "neutral");
  // Alle würfelbaren Stil-Regler (Würfeln-Knopf UND Zufallsstart nutzen dieselbe Liste)
  const ROLL_SELECTS = [tone, form, structure, mode, persp, rhythm, tension, cast, instab, markov, disruptor, varianz, stil, archA, archB, preset];
  const polish = el("input", { id: "f-polish", type: "checkbox" }) as HTMLInputElement;
  const presetField = el("div", { class: "field presetfield" },
    el("span", { class: "field-label lockrow" }, el("span", {}, "Preset — eins oder mehrere ankreuzen"), presetStatus, lockBtn(preset)),
    preset,
    el("div", { class: "btnrow" }, autoMixStudioBtn),
    presetList);
  wrap.append(presetField);
  wrap.append(el("div", { class: "grid3" }, lockField("Ton", tone), lockField("Form", form)));


  const lenSlider = el("input", { id: "f-len", type: "range", min: "40", max: "300", step: "10", value: "110", style: "flex:1" }) as HTMLInputElement;
  const lenVal = el("span", { class: "muted" }, "110");
  let lenTimer: ReturnType<typeof setTimeout> | undefined;
  let baseText = "";
  let rolling = false;  // true während "Würfeln" alle Selects ändert (verhindert Mehrfach-Generierung)
  const applyLengthLive = (): void => {
    const target = parseInt(lenSlider.value, 10);
    const form = readInput().form;
    if (form === "prose") {
      const src = baseText.trim() ? baseText : (out.textContent || "");
      if (!src.trim()) { generate(); return; }
      out.textContent = enforceWordTarget(src, target, loadBank(), markov.value !== "off" ? buildModelFromCorpus(2) : undefined);
      try { localStorage.setItem("dm_last_text", out.textContent || ""); } catch { /* voll */ }
      refreshFeeds();
    } else if (form === "script") {
      generate();
    }
    // Vers-/Videoformen: Textlänge ohne Wirkung
  };
  lenSlider.addEventListener("input", () => {
    lenVal.textContent = lenSlider.value;
    clearTimeout(lenTimer);
    lenTimer = setTimeout(applyLengthLive, 180);
  });
  const lenRow = el("div", { class: "field lenrow" }, el("span", { class: "mlabel lockrow" }, el("span", {}, "Textlänge"), lockBtn(lenSlider)), lenSlider, " ", lenVal);

  // Schriftart + Schriftgröße der Ausgabe (neben der Textlänge)
  const fontSel = el("select", { id: "f-font" },
    ...([["serif","Serif"],["classic","Times"],["sans","Sans"],["mono","Mono"]] as [string,string][])
      .map(([v,l]) => el("option", { value: v }, l))) as HTMLSelectElement;
  const sizeSlider = el("input", { id: "f-fontsize", type: "range", min: "14", max: "32", step: "0.5", value: String(loadFontSize()) }) as HTMLInputElement;
  const sizeVal = el("span", { class: "muted" }, String(loadFontSize()));
  fontSel.value = loadFont();
  const applyFont = (): void => { applyStoryFont(out, fontSel.value, parseFloat(sizeSlider.value)); sizeVal.textContent = sizeSlider.value; saveFontPrefs(fontSel.value, parseFloat(sizeSlider.value)); };
  fontSel.addEventListener("change", applyFont);
  sizeSlider.addEventListener("input", applyFont);
  const fontRow = el("label", { class: "field lenrow fontrow" }, el("span", { class: "mlabel" }, "Schrift"), " ", fontSel, " ", el("span", { class: "mlabel" }, "Größe"), " ", sizeSlider, " ", sizeVal);

  const out = el("pre", { id: "f-out", class: "out" });
  // Neue Variante per Pfeil (PC) oder Wischen links/rechts (Handy)
  const genArrows: HTMLButtonElement[] = [];
  const mkGenArrow = (dir: "left" | "right"): HTMLButtonElement => {
    const b = el("button", { class: "genarrow " + dir, type: "button", title: "Neue Variante generieren", "aria-label": "Neue Variante generieren" }, dir === "left" ? "‹" : "›") as HTMLButtonElement;
    // pointerdown statt click: löst sofort aus, auch wenn sich das Layout danach ändert
    b.addEventListener("pointerdown", (e) => { e.preventDefault(); generate(); });
    genArrows.push(b);
    return b;
  };
  const outWrap = el("div", { class: "outwrap" }, mkGenArrow("left"), out, mkGenArrow("right"));
  // Pfeile mittig im SICHTBAREN Ausschnitt des Textfensters halten — unabhängig
  // von der Inhaltshöhe (kein Springen beim Generieren).
  const positionArrows = (): void => {
    const r = outWrap.getBoundingClientRect();
    if (r.height <= 0) return;
    const visTop = Math.max(r.top, 0);
    const visBot = Math.min(r.bottom, window.innerHeight);
    let center = (visTop + visBot) / 2 - r.top;
    center = Math.max(40, Math.min(r.height - 40, center));
    for (const a of genArrows) a.style.top = center + "px";
  };
  window.addEventListener("scroll", positionArrows, { passive: true });
  window.addEventListener("resize", positionArrows);
  let swipeX = 0, swipeY = 0;
  out.addEventListener("touchstart", (e) => { const t = e.touches[0]; if (t) { swipeX = t.clientX; swipeY = t.clientY; } }, { passive: true });
  out.addEventListener("touchend", (e) => {
    const t = e.changedTouches[0]; if (!t) return;
    const dx = t.clientX - swipeX, dy = t.clientY - swipeY;
    if (Math.abs(dx) > 60 && Math.abs(dx) > 2 * Math.abs(dy)) generate();
  }, { passive: true });
  const kling = el("div", { class: "kling" });

  // ── Einspeisungen färben: zeigt, welche Textteile aus welcher Quelle stammen ──
  const feedsChk = el("input", { type: "checkbox", id: "f-feeds" }) as HTMLInputElement;
  const legDot = (c: string, l: string): HTMLElement => el("span", { class: "feeditem" }, el("span", { class: "feeddot " + c }), " " + l);
  // Bauplan: zeigt bei der Struktur „Rekombination“, aus welchen Atomen der Text entstand
  const planChk = el("input", { type: "checkbox", id: "f-plan" }) as HTMLInputElement;
  const planBox = el("div", { class: "bauplan", style: "display:none" });
  const PHASE_LABEL: Record<string, string> = { exposition: "Eröffnung", verdichtung: "Verdichtung", umschlag: "Umschlag", schluss: "Schluss" };
  const KAT_LABEL: Record<string, string> = { motifs: "Motiv", hooks: "Haken", props: "Requisite", turns: "Wendung", obstacles: "Hindernis", stakes: "Einsatz", endings: "Ende" };
  const renderPlan = (): void => {
    const on = planChk.checked && structure.value === "rekombination";
    planBox.style.display = on ? "" : "none";
    if (!on) return;
    const tr = getTraceFor(out.textContent || "");
    planBox.innerHTML = "";
    if (!tr.length) { planBox.append(el("span", { class: "muted mini" }, "Noch kein Rekombinations-Text erzeugt.")); return; }
    // Kennzahlen: Fügeteil-Anteil (Deckel 25 %) und verschlucktes Material
    const anteil = Math.round(fuegeteilAnteil() * 100);
    // Sätze im Text, die zu keinem Baustein gehören (Ton-Einschübe, Nachbearbeitung)
    const norm = (t: string): string => t.toLowerCase().replace(/[^a-zäöüß ]/g, " ").replace(/\s+/g, " ").trim();
    const bausteine = tr.map((x) => norm(x.text)).filter(Boolean);
    const fremd = (out.textContent || "").split(/(?<=[.!?…])\s+/)
      .map((x) => norm(x)).filter((x) => x.split(" ").length >= 3)
      .filter((satz) => !bausteine.some((b) => b.includes(satz.slice(0, 24)) || satz.includes(b.slice(0, 24))));
    planBox.append(el("div", { class: "muted mini bp-kopf" },
      `${tr.length} Bausteine · ${anteil} % Fügeteile${anteil > 25 ? " ⚠" : ""}` +
      (fremd.length ? ` · ${fremd.length} Satz/Sätze aus der Nachbearbeitung (Ton, Glättung)` : "")));
    let letztePhase = "";
    for (const s of tr) {
      if (s.phase !== letztePhase) {
        planBox.append(el("div", { class: "bp-phase ph-" + s.phase }, PHASE_LABEL[s.phase] || s.phase));
        letztePhase = s.phase;
      }
      const herkunft = s.quelle === "vorlage" ? "Fügeteil · " + s.typ : (KAT_LABEL[s.kategorie] || s.kategorie);
      const row = el("div", { class: "bp-zeile q-" + s.quelle },
        el("span", { class: "bp-tag" }, herkunft),
        el("span", { class: "bp-text" }, s.text));
      if (s.fueller) for (const f of s.fueller) row.append(el("span", { class: "bp-fill" }, "↳ " + (KAT_LABEL[f.kategorie] || f.kategorie) + ": " + f.text));
      planBox.append(row);
    }
  };
  planChk.addEventListener("change", renderPlan);

  // Textstruktur direkt unter dem Text: woraus besteht er, mit welchen Einstellungen?
  const struktChk = el("input", { type: "checkbox", id: "f-struktur" }) as HTMLInputElement;
  // Vorrats-Hinweis: Die Rekombination baut aus typisierten Bausteinen, und jeder
  // Satz darf nur einmal vorkommen. Reicht das Material nicht fuer die Ziellaenge,
  // wurde der Text bisher stillschweigend kuerzer - das sieht nach einem Fehler aus,
  // ist aber eine Materialgrenze. Also benennen.
  const vorratHint = el("p", { class: "muted mini", style: "display:none" });
  const updVorrat = (): void => {
    const txt = out.textContent || "";
    const ziel = parseInt(lenSlider.value, 10) || 0;
    const ist = txt.split(/\s+/).filter(Boolean).length;
    const knapp = structure.value === "rekombination" && ziel > 0 && ist > 0 && ist / ziel < 0.85;
    vorratHint.style.display = knapp ? "" : "none";
    if (knapp) vorratHint.textContent = `${ist} statt ${ziel} Wörtern: Der Baustein-Vorrat des gewählten Presets ist erschöpft. `
      + `Die Rekombination lässt jeden Satz nur einmal zu — für längere Texte mehrere Presets aktivieren oder Auto-Mix wählen.`;
  };
  const struktBox = el("div", { class: "struktur-inline", style: "display:none" });
  const renderStruktur = (): void => {
    if (!struktChk.checked) { struktBox.style.display = "none"; return; }
    struktBox.style.display = "";
    struktBox.innerHTML = "";
    struktBox.append(renderTextstruktur(out.textContent || "", loadSchnappschuss()));
  };
  struktChk.addEventListener("change", renderStruktur);

  // Textstruktur direkt unter dem Text: woraus besteht er, mit welchen Einstellungen?

  // Selbsttest direkt im Studio — greifen alle Features? (Vollansicht im Diagnose-Tab)
  const undoBtn = el("button", { class: "undochip", type: "button", title: "Letzte Änderung rückgängig (Strg+Z)" }, "↩ Rückgängig") as HTMLButtonElement;
  undoBtn.disabled = true;
  const feedsRow = el("div", { class: "feedsrow" },
    el("label", { class: "chk" }, feedsChk, " Editieren"),
    legDot("feed-wb", "Wortbank"), legDot("feed-ton", "Ton"), legDot("feed-4w", "4W-Kontext"), legDot("feed-pool", "Lebendige Pools"), legDot("feed-markov", "Markov"),
    el("span", { class: "muted" }, "· unmarkiert = Vorlagen · alles anklickbar"),
    el("label", { class: "chk planchk" }, planChk, " Bauplan"),
    el("label", { class: "chk planchk" }, struktChk, " Struktur"), undoBtn);

  interface FMatch { s: number; e: number; cls: string; prio: number; }
  const escFeeds = (t: string): string => t.replace(/[&<>]/g, (c) => (c === "&" ? "&amp;" : c === "<" ? "&lt;" : "&gt;"));
  const collectFeed = (phrases: string[], cls: string, prio: number, low: string, acc: FMatch[]): void => {
    for (const raw of phrases) {
      const ph = (raw || "").trim(); if (ph.length < 5) continue;
      const pl = ph.toLowerCase(); let from = 0, idx = low.indexOf(pl, from);
      while (idx !== -1) { acc.push({ s: idx, e: idx + pl.length, cls, prio }); from = idx + pl.length; if (acc.length > 4000) return; idx = low.indexOf(pl, from); }
    }
  };
  const renderFeeds = (): void => {
    const plain = out.textContent || "";
    if (!feedsChk.checked) { out.textContent = plain; return; }
    const low = plain.toLowerCase();
    const m: FMatch[] = [];
    if (tone.value !== "neutral") { const td = TONE_DATA[tone.value]; if (td) collectFeed([...td.opener, ...td.flavor], "feed-ton", 3, low, m); }
    const w4: string[] = [];
    [who.value, where.value, when.value, what.value].forEach((v) => (v || "").split(",").forEach((t) => { const x = t.trim(); if (x.length >= 4) w4.push(x); }));
    collectFeed(w4, "feed-4w", 2, low, m);
    try { const b = loadBank() as unknown as Record<string, string[]>; const all: string[] = []; for (const k of Object.keys(b)) if (Array.isArray(b[k])) all.push(...b[k]!); collectFeed(all, "feed-wb", 1, low, m); } catch { /* egal */ }
    try { collectFeed(liveTexts(), "feed-pool", 1, low, m); } catch { /* egal */ }
    try { collectFeed(getMarkovTrace(), "feed-markov", 2, low, m); } catch { /* egal */ }
    m.sort((a, b) => a.s - b.s || (b.e - b.s) - (a.e - a.s) || b.prio - a.prio);
    // unmarkierte Lücke: als klick-/editierbaren feed-plain-Span ausgeben (Randweißraum bleibt außen)
    const emitPlain = (seg: string): string => {
      if (!seg) return "";
      if (!seg.trim()) return escFeeds(seg);
      const lead = (seg.match(/^\s*/) || [""])[0];
      const trail = (seg.match(/\s*$/) || [""])[0];
      const core = seg.slice(lead.length, seg.length - trail.length);
      return escFeeds(lead) + `<span class="feed-plain">` + escFeeds(core) + "</span>" + escFeeds(trail);
    };
    let html = "", i = 0, last = -1;
    for (const x of m) { if (x.s < last) continue; html += emitPlain(plain.slice(i, x.s)) + `<span class="${x.cls}">` + escFeeds(plain.slice(x.s, x.e)) + "</span>"; i = x.e; last = x.e; }
    html += emitPlain(plain.slice(i));
    out.innerHTML = html;
  };
  const refreshFeeds = (): void => { if (feedsChk.checked) renderFeeds(); };
  feedsChk.addEventListener("change", renderFeeds);

  // ── Passagen-Austausch: farbigen Span anklicken -> Alternativen aus demselben Pool ──
  const feedPop = el("div", { class: "feedpop", style: "display:none" });
  document.body.appendChild(feedPop);
  let popSpan: HTMLElement | null = null;
  const hidePop = (): void => { feedPop.style.display = "none"; popSpan = null; };
  document.addEventListener("click", (e) => { if (feedPop.style.display !== "none" && !feedPop.contains(e.target as Node) && (e.target as HTMLElement) !== popSpan) hidePop(); }, true);
  const persistEdit = (): void => { try { localStorage.setItem("dm_last_text", out.textContent || ""); } catch { /* voll */ } };

  // ── Undo-Verlauf fürs Editieren (letzte ~12 Textzustände) ──
  const undoStack: string[] = [];
  const updateUndoBtn = (): void => { undoBtn.disabled = undoStack.length === 0; };
  const pushUndo = (): void => { undoStack.push(out.textContent || ""); if (undoStack.length > 12) undoStack.shift(); updateUndoBtn(); };
  const clearUndo = (): void => { undoStack.length = 0; updateUndoBtn(); };
  const doUndo = (): void => { const prev = undoStack.pop(); if (prev === undefined) return; out.textContent = prev; persistEdit(); renderFeeds(); updateUndoBtn(); };
  undoBtn.addEventListener("click", doUndo);
  document.addEventListener("keydown", (e) => {
    if (!(e.ctrlKey || e.metaKey) || e.shiftKey || e.key.toLowerCase() !== "z") return;
    const t = e.target as HTMLElement | null;
    if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return; // native Undo im Feld
    if (!undoStack.length) return;
    e.preventDefault(); doUndo();
  });

  // Kontext-Nähe: Jaccard über Wortstämme (5-Zeichen-Stämme), offline.
  const FEED_STOP = new Set(["und", "oder", "aber", "denn", "sondern", "sowie", "eine", "einen", "einem", "einer", "eines", "der", "die", "das", "den", "dem", "des", "mit", "von", "für", "auf", "aus", "ist", "sind", "war", "sich", "nicht", "auch", "wie", "als", "was", "wer", "wann", "über", "unter", "durch", "zwischen", "diese", "dieser", "dieses", "sein", "seine", "ihre", "ihrer", "immer", "schon", "noch", "dann", "aber", "wird", "wurde"]);
  const feedStems = (t: string): Set<string> => { const set = new Set<string>(); for (const w of (t.toLowerCase().match(/[a-zäöüß]{4,}/g) || [])) { if (FEED_STOP.has(w)) continue; set.add(w.slice(0, 5)); } return set; };
  const feedJac = (a: Set<string>, b: Set<string>): number => { if (!a.size || !b.size) return 0; let inter = 0; for (const x of a) if (b.has(x)) inter++; return inter / (a.size + b.size - inter); };

  const altsFor = (cls: string, cur: string): string[] => {
    const inText = (out.textContent || "").toLowerCase();
    const norm = (arr: string[]): string[] => [...new Set(arr.map((x) => (x || "").trim()).filter((a) => a.length >= 2 && a.toLowerCase() !== cur.toLowerCase() && !inText.includes(a.toLowerCase())))];
    let pool: string[] = [];
    try {
      if (cls === "feed-wb") { const b = loadBank() as unknown as Record<string, string[]>; let cat: string[] | null = null; for (const k of Object.keys(b)) if (Array.isArray(b[k]) && b[k]!.some((x) => x.toLowerCase() === cur.toLowerCase())) { cat = b[k]!; break; } pool = cat || Object.values(b).flat(); }
      else if (cls === "feed-pool") pool = liveTexts();
      else if (cls === "feed-ton") { const td = TONE_DATA[tone.value]; pool = td ? [...td.opener, ...td.flavor] : []; }
      else if (cls === "feed-4w") pool = [who.value, where.value, when.value, what.value];
      else if (cls === "feed-markov") { const model = buildModelFromCorpus(2); const n = Math.max(6, cur.split(/\s+/).filter(Boolean).length + 2); for (let i = 0; i < 12; i++) { const g = model.generate(n); if (g) pool.push(g); } }
    } catch { /* egal */ }
    const uniq = norm(pool);
    const ctxStems = feedStems((out.textContent || "").split(new RegExp(cur.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i")).join(" "));
    const scored = uniq.map((t) => ({ t, sc: feedJac(feedStems(t), ctxStems) }));
    for (let i = scored.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [scored[i], scored[j]] = [scored[j]!, scored[i]!]; } // Zufalls-Tiebreak
    scored.sort((a, b) => b.sc - a.sc);                        // nach Kontextnähe
    const top = scored.slice(0, Math.min(12, scored.length));   // relevanteste behalten
    for (let i = top.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [top[i], top[j]] = [top[j]!, top[i]!]; } // „Neu“ variiert
    return top.slice(0, 6).map((x) => x.t);
  };
  // Steht die Passage am Satzanfang? (Textanfang oder direkt nach Satzzeichen)
  const atSentenceStart = (span: HTMLElement): boolean => {
    try {
      const range = document.createRange();
      range.setStart(out, 0);
      range.setEndBefore(span);
      const before = range.toString().replace(/\s+$/, "");
      if (!before) return true;
      return /[.!?…:][")»“”'\]]?$/.test(before);
    } catch { return false; }
  };
  // Ersten Buchstaben groß (auch hinter öffnendem Anführungszeichen/Klammer)
  const capFirst = (t: string): string => t.replace(/^(\s*["„«»'(\[]*\s*)?(\p{L})/u, (_m, pre: string | undefined, ch: string) => (pre || "") + ch.toLocaleUpperCase("de-DE"));
  const replaceSpan = (span: HTMLElement, txt: string): void => {
    pushUndo();
    const v = atSentenceStart(span) ? capFirst(txt) : txt;
    span.textContent = v; persistEdit(); renderFeeds(); hidePop();
  };
  const removeSpan = (span: HTMLElement): void => {
    pushUndo();
    span.textContent = "";
    const cleaned = (out.textContent || "").replace(/\s{2,}/g, " ").replace(/\s+([,.;:!?…])/g, "$1").replace(/([.!?…])(?:\s*\1)+/g, "$1").trim();
    out.textContent = cleaned; persistEdit(); renderFeeds(); hidePop();
  };
  const openPop = (span: HTMLElement): void => {
    popSpan = span;
    const cls = (span.className.match(/feed-[a-z0-9]+/) || ["feed-wb"])[0]!;
    const cur = span.textContent || "";
    const titles: Record<string, string> = { "feed-wb": "Wortbank", "feed-ton": "Ton", "feed-4w": "4W-Kontext", "feed-pool": "Lebendige Pools", "feed-markov": "Markov", "feed-plain": "Text" };
    feedPop.innerHTML = "";
    const closeX = el("button", { class: "feedpop-x", type: "button", title: "Schließen", "aria-label": "Schließen" }, "✕");
    closeX.addEventListener("click", hidePop);
    feedPop.append(closeX);
    feedPop.append(el("div", { class: "muted pophead" }, `„${cur.length > 44 ? cur.slice(0, 44) + "…" : cur}“ · ${titles[cls] || "Passage"}`));
    const del = el("button", { class: "danger" }, "✕ Entfernen"); del.addEventListener("click", () => removeSpan(span));
    if (cls === "feed-plain") {
      // unmarkierter Abschnitt: freie Textbearbeitung (z. B. fehlende Wörter einfügen)
      const ta = el("textarea", { class: "freeedit" }) as HTMLTextAreaElement;
      ta.value = cur;
      const freeBtn = button("Übernehmen");
      freeBtn.addEventListener("click", () => { const v = ta.value.replace(/\s+/g, " ").trim(); if (v) replaceSpan(span, v); else removeSpan(span); });
      feedPop.append(el("div", { class: "muted mini" }, "Text frei bearbeiten — fehlende Wörter einfügen oder umformulieren."), ta, el("div", { class: "row" }, del, freeBtn));
      setTimeout(() => { ta.focus(); const n = ta.value.length; ta.setSelectionRange(n, n); }, 0);
    } else {
      const altwrap = el("div", {});
      const fill = (): void => {
        altwrap.innerHTML = "";
        const alts = altsFor(cls, cur);
        if (!alts.length) altwrap.append(el("div", { class: "muted" }, "Keine Alternativen im Pool."));
        alts.forEach((a) => { const b = el("button", { class: "alt" }, a); b.addEventListener("click", () => replaceSpan(span, a)); altwrap.append(b); });
      };
      fill();
      const reroll = el("button", {}, icon("dice"), " Neu"); reroll.addEventListener("click", fill);
      // Grammatik/Text der Passage direkt anpassen (vorbefüllt) — ohne Neuschreiben/Ersetzen
      const edit = el("textarea", { class: "freeedit" }) as HTMLTextAreaElement; edit.value = cur;
      const editBtn = button("Übernehmen");
      editBtn.addEventListener("click", () => { const v = edit.value.replace(/\s+/g, " ").trim(); if (!v) { removeSpan(span); return; } if (v !== cur) replaceSpan(span, v); else hidePop(); });
      feedPop.append(altwrap, el("div", { class: "row" }, reroll, del), el("div", { class: "muted mini" }, "Oder Grammatik anpassen — Text der Passage direkt bearbeiten:"), edit, el("div", { class: "row" }, editBtn));
    }
    const r = span.getBoundingClientRect();
    feedPop.style.display = "";                    // erst einblenden, damit Maße messbar sind
    const pw = feedPop.offsetWidth || 330;
    const ph = feedPop.offsetHeight || 0;
    const vh = window.innerHeight, vw = window.innerWidth;
    feedPop.style.left = Math.min(vw - pw - 8, Math.max(8, r.left)) + "px";
    let top = r.bottom + 6;                         // bevorzugt unter der Stelle
    if (top + ph > vh - 8) {                        // passt unten nicht: über die Stelle klappen
      const above = r.top - ph - 6;
      top = above >= 8 ? above : Math.max(8, vh - ph - 8); // sonst an den unteren Rand klemmen
    }
    feedPop.style.top = top + "px";
  };
  out.addEventListener("click", (e) => {
    if (!feedsChk.checked) return;
    const t = (e.target as HTMLElement).closest('span[class^="feed-"]') as HTMLElement | null;
    if (!t) return;
    e.preventDefault(); e.stopPropagation(); openPop(t);
  });

  const genBtn = el("button", { class: "primary" }, icon("play"), " Generieren");
  const varBtn = button("Variante");
  const copyBtn = el("button", {}, icon("copy"), " Kopieren");
  const diceBtn = el("button", {}, icon("dice"), " Würfeln");
  const rollSel = (s: HTMLSelectElement): void => { if (locked.has(s.id)) return; s.selectedIndex = Math.floor(Math.random() * s.options.length); s.dispatchEvent(new Event("change")); };
  diceBtn.addEventListener("click", () => { rolling = true; ROLL_SELECTS.forEach(rollSel); rolling = false; renderPresetChecks(); generate(); });
  const keepLbl = el("span", {}, "Merken");
  const keepBtn = el("button", {}, icon("star"), " ", keepLbl);
  keepBtn.addEventListener("click", () => {
    const n = addToTreasury(out.textContent || "", { who: who.value, where: where.value, when: when.value, what: what.value, form: form.value });
    keepLbl.textContent = n < 0 ? "— schon drin" : `Gemerkt (${n})`;
    setTimeout(() => (keepLbl.textContent = "Merken"), 1400);
  });
  const vaultLbl = el("span", {}, "Tresor");
  const vaultBtn = el("button", {}, icon("lock"), " ", vaultLbl);
  vaultBtn.addEventListener("click", () => {
    const n = addToTreasurySecret(out.textContent || "", { who: who.value, where: where.value, when: when.value, what: what.value, form: form.value });
    vaultLbl.textContent = n < 0 ? "— schon drin" : `Im Tresor (${n})`;
    setTimeout(() => (vaultLbl.textContent = "Tresor"), 1400);
  });
  const readBtn = el("button", {}, icon("book"), " Lesen");
  const speakLbl = el("span", {}, "Vorlesen");
  const speakBtn = el("button", {}, icon("volume"), " ", speakLbl);
  const bestChk = el("input", { type: "checkbox", id: "f-best" }) as HTMLInputElement;
  bestChk.checked = true;
  const bestLbl = el("label", { class: "chk", title: "Erzeugt bei jedem Klick 12 Kandidaten und zeigt den bestbewerteten (Längentreue, Wortvielfalt, Rhythmus, wenig Wiederholung, Grammatik, Abstand zur Schatzkammer)." }, bestChk, " Bestenauslese");
  wrap.append(el("div", { class: "btnrow" }, genBtn, varBtn, diceBtn, copyBtn, keepBtn, vaultBtn, readBtn, speakBtn, lenRow, bestLbl), outWrap, vorratHint, feedsRow, planBox, struktBox, kling);

  // ── Test & Ranking ──
  let lastRanking: Ranking | null = null;
  const rankStatus = el("span", { class: "muted", id: "f-rankstatus" }, "");
  const applyPlace = (place: number): void => {
    if (!lastRanking || !lastRanking.all.length) { rankStatus.textContent = "Erst Ranking ausführen."; return; }
    const item = lastRanking.all[Math.max(0, Math.min(lastRanking.all.length - 1, place - 1))];
    if (!item) return;
    out.textContent = item.txt;
    try { localStorage.setItem("dm_last_text", item.txt); } catch { /* voll */ }
    renderKling(readInput().form, item.txt);
    refreshFeeds();
    const nov = item.novelty !== undefined ? ` · Neuheit ${Math.round(item.novelty * 100)}%` : "";
    const surp = item.surprise !== undefined ? ` · Überraschung ${Math.round(item.surprise * 100)}%` : "";
    const con = item.constraintsOk === false ? " · ⚠ Einbauwörter unvollständig" : "";
    const gr = item.grammar ? ` · ⚠ ${item.grammar} Grammatik` : "";
    const extra = item.aiScore !== undefined ? `KI ${item.aiScore}/100${item.grund ? " – " + item.grund : ""}` : `Score ${item.score.toFixed(1)}${nov}${surp}${gr}${con}`;
    rankStatus.textContent = `Platz ${place}: ${extra}`;
  };
  const novSlider = el("input", { id: "f-novelty", type: "range", min: "0", max: "100", step: "5", value: "30", class: "rankviz" }) as HTMLInputElement;
  const novVal = el("span", { class: "muted" }, "30 %");
  const updNovVal = (): void => { novVal.textContent = novSlider.value + " %"; };
  novSlider.addEventListener("input", updNovVal);
  const noveltyW = (): number => (parseInt(novSlider.value, 10) || 0) / 100;

  const surpSlider = el("input", { id: "f-surprise", type: "range", min: "0", max: "100", step: "5", value: "0", class: "rankviz" }) as HTMLInputElement;
  const surpVal = el("span", { class: "muted" }, "aus");
  const updSurpVal = (): void => { const v = parseInt(surpSlider.value, 10) || 0; surpVal.textContent = v === 0 ? "aus" : "Ziel " + v + " %"; };
  surpSlider.addEventListener("input", updSurpVal);
  const mustIn = el("input", { placeholder: "Einbauwörter, mit Komma getrennt" }) as HTMLInputElement;
  const avoidChk = el("input", { type: "checkbox" }) as HTMLInputElement;
  const gramChk = el("input", { type: "checkbox" }) as HTMLInputElement;
  const rankOpts = (): import("../generation/scoring").RankOptions => {
    const sv = (parseInt(surpSlider.value, 10) || 0) / 100;
    return {
      noveltyWeight: noveltyW(),
      surpriseWeight: sv > 0 ? 0.6 : 0,
      surpriseTarget: sv > 0 ? sv : 0.5,
      mustWords: mustIn.value.split(/[,;]/).map((w) => w.trim()).filter(Boolean),
      avoidFrequent: avoidChk.checked,
      grammarFilter: gramChk.checked,
      castDiscipline: parseFloat(cast.value) || 0,
      perspective: persp.value,
      expectedCast: who.value.split(/[,;]/).map((x) => x.trim()).filter(Boolean),
    };
  };

  const probeBtn = button("Probe (50)");
  probeBtn.addEventListener("click", () => {
    rankStatus.textContent = "Probe läuft…";
    setTimeout(() => { const r = runProbe(loadBank(), readInput(), buildModelFromCorpus(), 50);
      rankStatus.textContent = `Probe: ${r.total} Texte · ${r.flaggedCount} auffällig · ${r.grammarCount} Grammatik · ${r.duplicates} doppelt`; }, 10);
  });
  const rankBtn = button("Ranking (50)");
  const rangeSlider = el("input", { id: "f-rang", type: "range", min: "1", max: "50", value: "1", class: "rankviz" }) as HTMLInputElement;
  const rangeVal = el("span", { class: "muted" }, "1");
  rangeSlider.addEventListener("input", () => { rangeVal.textContent = "#" + rangeSlider.value; applyPlace(parseInt(rangeSlider.value, 10)); });
  rankBtn.addEventListener("click", () => {
    rankStatus.textContent = "Ranking läuft…";
    setTimeout(() => { lastRanking = runRanking(loadBank(), readInput(), buildModelFromCorpus(), 50, 10, rankOpts());
      rangeSlider.max = String(lastRanking.all.length); rangeSlider.value = "1"; rangeVal.textContent = "#1"; applyPlace(1); }, 10);
  });
  const goldBtn = button("🥇 #1"); goldBtn.addEventListener("click", () => applyPlace(1));
  const silverBtn = button("🥈 #2"); silverBtn.addEventListener("click", () => applyPlace(2));
  const bronzeBtn = button("🥉 #3"); bronzeBtn.addEventListener("click", () => applyPlace(3));
  // Regler mit Schloss (hält den Wert beim Würfeln und über den Neustart)
  const sliderField = (label: string, sl: HTMLInputElement, val: HTMLElement, hint: string): HTMLElement =>
    el("div", { class: "field rankrow" },
      el("span", { class: "field-label lockrow" }, el("span", {}, label), lockBtn(sl)),
      el("div", { class: "rankslide" }, sl, val),
      el("span", { class: "muted mini" }, hint));

  const rankDetails = el("details", { class: "fine" });
  rankDetails.append(el("summary", {}, icon("flask"), " Test & Ranking"),
    // 1 Erzeugen & bewerten
    el("div", { class: "ranksec" },
      el("div", { class: "ranksec-h" }, "1 · Erzeugen und bewerten"),
      el("div", { class: "btnrow" }, probeBtn, rankBtn),
      rankStatus),
    // 2 Bewertungsmaßstab
    el("div", { class: "ranksec" },
      el("div", { class: "ranksec-h" }, "2 · Bewertungsmaßstab"),
      el("div", { class: "rankgrid" },
        sliderField("Neuheit", novSlider, novVal, "Abstand zur Schatzkammer belohnen"),
        sliderField("Überraschung", surpSlider, surpVal, "Zielwert der Unwahrscheinlichkeit im eigenen Korpus — braucht einen Korpus; 0 % = aus")),
      el("label", { class: "field" }, el("span", { class: "field-label" }, "Einbauwörter"), mustIn),
      el("div", { class: "chkrow" },
        el("label", { class: "chk" }, avoidChk, " Häufigste Korpus-Wörter meiden"),
        el("label", { class: "chk" }, gramChk, " Grammatik-Filter (auffällige Varianten abwerten)"))),
    // 3 Ergebnis wählen
    el("div", { class: "ranksec" },
      el("div", { class: "ranksec-h" }, "3 · Ergebnis wählen"),
      el("div", { class: "btnrow" }, goldBtn, silverBtn, bronzeBtn),
      el("div", { class: "field rankrow" },
        el("span", { class: "field-label" }, "Rang durchblättern"),
        el("div", { class: "rankslide" }, rangeSlider, rangeVal))));
  wrap.append(rankDetails);

  const fine = el("details", { class: "fine" });
  fine.append(el("summary", {}, icon("tool"), " Werkzeugkasten"));
  // Rekombination baut aus typisierten Atomen und kann nur Fliesstext erzeugen.
  // Bei Vers- und Dialogformen greift sie nicht - das muss die Oberflaeche sagen,
  // statt stillschweigend den Schablonenweg zu nehmen.
  const rekHint = el("p", { class: "muted mini", style: "display:none" });
  const updRekHint = (): void => {
    const passt = form.value === "prose" || form.value === "poem";
    const an = structure.value === "rekombination" && !passt;
    rekHint.style.display = an ? "" : "none";
    if (an) rekHint.textContent = `Hinweis: „Rekombination (geprüft)“ wirkt nur bei Prosa und Prosagedicht. `
      + `Bei „${form.options[form.selectedIndex]?.text || form.value}“ baut die Maschine über die Schablonen — die Struktur bleibt hier ohne Wirkung.`;
  };
  form.addEventListener("change", updRekHint);
  structure.addEventListener("change", updRekHint);
  updRekHint();
  fine.append(el("div", { class: "grid3" },
    lockField("Struktur", structure), lockField("Modus", mode), lockField("Perspektive", persp),
    lockField("Rhythmus", rhythm), lockField("Instabilität", instab), lockField("Markov", markov),
    lockField("Disruptor", disruptor), lockField("Varianz", varianz), lockField("Stil", stil),
    lockField("Spannung", tension), lockField("Figurendisziplin", cast),
    lockField("Archetyp A", archA), lockField("Archetyp B", archB),
    field("Video: Shots", shots), field("Video: Sekunden", secs),
    el("label", { class: "field", style: "display:flex;align-items:center;gap:6px" }, polish, "Sprachschliff")));
  fine.append(rekHint);
  wrap.append(fine);

  // ⚙️ Einstellungen (Farb-Themes)
  const themeSel = select("f-theme", THEMES.map((t) => [t.id, t.label] as [string, string]), loadTheme());
  themeSel.addEventListener("change", () => applyTheme(themeSel.value));
  const schriftPanel = el("div", {}, fontRow);
  const accentIn = el("input", { id: "f-accent", type: "color", value: loadAccent() || "#8b5cf6", style: "width:52px;height:34px;padding:2px" }) as HTMLInputElement;
  accentIn.addEventListener("input", () => { applyAccent(accentIn.value); saveAccent(accentIn.value); });
  const accentReset = button("Standard");
  accentReset.addEventListener("click", () => { saveAccent(""); applyAccent(""); });
  const themePanel = el("div", { style: "display:none" },
    field("Farb-Theme", themeSel),
    field("Eigene Akzentfarbe", el("div", { class: "btnrow" }, accentIn, accentReset)));
  // KI-Zugang (Schlüssel bleibt lokal, Aufrufe nur an api.anthropic.com)
  const keyIn = el("input", { type: "password", placeholder: "sk-ant-…", value: loadAiKey() }) as HTMLInputElement;
  const modelIn = el("input", { placeholder: "Modell", value: loadAiModel() }) as HTMLInputElement;
  const kiStatus = el("p", { class: "muted" }, "");
  const setKiStatus = (): void => { kiStatus.textContent = loadAiKey() ? `Schlüssel hinterlegt · Modell: ${loadAiModel()}` : "Kein Schlüssel hinterlegt — KI-Funktionen sind inaktiv."; };
  const keySave = button("Speichern");
  keySave.addEventListener("click", () => { saveAiKey(keyIn.value.trim()); saveAiModel(modelIn.value.trim()); setKiStatus(); });
  const keyClear = button("Schlüssel löschen", "danger");
  keyClear.addEventListener("click", () => { saveAiKey(""); keyIn.value = ""; setKiStatus(); });
  setKiStatus();
  const kiPanel = el("div", { style: "display:none" },
    field("API-Schlüssel", keyIn), field("Modell", modelIn),
    el("div", { class: "btnrow" }, keySave, keyClear), kiStatus,
    el("p", { class: "muted" }, "Wird nur lokal gespeichert und ausschließlich an api.anthropic.com gesendet. Jede Anfrage verbraucht Guthaben deines Kontos."));

  // Speicher-Reiter
  const memLine = el("p", { class: "muted" }, "…");
  const memRefresh = button("Aktualisieren");
  const refreshMem = (): void => { void storageReport().then((r) => { memLine.textContent = r.text; }); };
  memRefresh.addEventListener("click", refreshMem);
  const memReset = button("Korpus + Schatzkammer leeren", "danger");
  const memResetInfo = el("span", { class: "muted" });
  memReset.addEventListener("click", () => {
    if (!confirm("Korpus UND Schatzkammer vollständig leeren? Das lässt sich nicht rückgängig machen. Wortbank, Presets und Einstellungen bleiben erhalten.")) return;
    savePersistentCorpus("");
    clearTreasury();
    refreshMem();
    memResetInfo.textContent = "Korpus und Schatzkammer geleert.";
    setTimeout(() => (memResetInfo.textContent = ""), 2500);
  });
  const memPanel = el("div", { style: "display:none" },
    field("Belegung", memLine),
    el("div", { class: "btnrow" }, memRefresh),
    el("hr", {}),
    el("div", { class: "btnrow" }, memReset, memResetInfo),
    el("p", { class: "muted" }, "Setzt den Markov-Korpus und die Schatzkammer zurück (leert beide). Wortbank, Presets, Einstellungen und lebendige Pools bleiben erhalten. Für ein vollständiges Backup vorher oben rechts „Exportieren“."),
    el("p", { class: "muted" }, "Der Browser speichert alles lokal. Wird es eng, erscheint bei jedem Sichern oben ein Warnband; dann Korpus kürzen, Schatzkammer aufräumen oder ein Projekt exportieren und Daten löschen."));

  const tabSchrift = el("button", { class: "subtab active" }, "Schrift");
  const tabFarbe = el("button", { class: "subtab" }, "Farbe");
  const tabKi = el("button", { class: "subtab" }, "KI-Zugang");
  const tabMem = el("button", { class: "subtab" }, "Speicher");
  const showSettingsPanel = (which: "schrift" | "farbe" | "ki" | "mem"): void => {
    schriftPanel.style.display = which === "schrift" ? "" : "none";
    themePanel.style.display = which === "farbe" ? "" : "none";
    kiPanel.style.display = which === "ki" ? "" : "none";
    memPanel.style.display = which === "mem" ? "" : "none";
    tabSchrift.classList.toggle("active", which === "schrift");
    tabFarbe.classList.toggle("active", which === "farbe");
    tabKi.classList.toggle("active", which === "ki");
    tabMem.classList.toggle("active", which === "mem");
    if (which === "mem") refreshMem();
  };
  tabSchrift.addEventListener("click", () => showSettingsPanel("schrift"));
  tabFarbe.addEventListener("click", () => showSettingsPanel("farbe"));
  tabKi.addEventListener("click", () => showSettingsPanel("ki"));
  tabMem.addEventListener("click", () => showSettingsPanel("mem"));
  const settings = el("details", { class: "fine" });
  settings.append(el("summary", {}, icon("settings"), " Einstellungen"),
    el("div", { class: "subtabs" }, tabSchrift, tabFarbe, tabKi, tabMem), schriftPanel, themePanel, kiPanel, memPanel);
  wrap.append(settings);

  root.append(wrap);

  const readInput = (): GenInput => ({
    where: where.value, when: when.value, who: who.value, what: what.value,
    tone: tone.value, varLevel: varianz.value, form: form.value as FormKind,
    structure: structure.value, mode: mode.value, perspective: persp.value,
    rhythm: rhythm.value, markovMode: markov.value, disruptor: disruptor.value,
    archetypeA: archA.value, archetypeB: archB.value,
    instability: parseInt(instab.value, 10) as 0 | 1 | 2,
    polish: polish.checked, polishStyle: stil.value,
    shots: parseInt(shots.value, 10), totalSec: parseInt(secs.value, 10),
    lenTarget: parseInt(lenSlider.value, 10),
    tension: tension.value,
    emphasis: { wo: parseInt(wWo.value, 10), wann: parseInt(wWann.value, 10), wer: parseInt(wWer.value, 10), was: parseInt(wWas.value, 10) },
  });
  const KLING_URL = "https://klingai.com";
  const renderKling = (form: string, text: string): void => {
    kling.innerHTML = "";
    if (form !== "video") return;
    const shots = (text || "").split("\n").filter((l) => l.startsWith("DE:")).map((l) => l.replace(/^DE:\s*/, "").trim());
    if (!shots.length) return;
    const head = el("div", { class: "kling-head" },
      el("span", {}, `🎬 ${shots.length} Shots für Kling`),
      el("a", { class: "kling-link", href: KLING_URL, target: "_blank", rel: "noopener" }, "In Kling generieren ↗"));
    const allBtn = button("Alle Shots kopieren");
    allBtn.addEventListener("click", () => { void navigator.clipboard?.writeText(shots.join("\n\n")); });
    head.append(allBtn);
    kling.append(head);
    shots.forEach((s, i) => {
      const copy = button("Kopieren");
      copy.addEventListener("click", () => { void navigator.clipboard?.writeText(s); });
      kling.append(el("div", { class: "kling-shot" }, el("b", {}, `Shot ${i + 1}`), el("span", {}, s), copy));
    });
  };

  const generate = (): void => {
    const model = markov.value !== "off" ? buildModelFromCorpus(2) : undefined;
    const input = readInput();
    try {
      out.textContent = bestChk.checked
        ? bestOf(loadBank(), input, model, 12, { noveltyWeight: 0.5, grammarFilter: true, castDiscipline: parseFloat(cast.value) || 0, expectedCast: who.value.split(/[,;]/).map((x) => x.trim()).filter(Boolean), perspective: persp.value }).txt
        : buildStory(loadBank(), input, model);
      baseText = out.textContent || "";
      ctxSichern();
      updVorrat();
      try { localStorage.setItem("dm_last_text", out.textContent || ""); } catch { /* voll */ }
      renderKling(input.form, out.textContent || "");
      try { feedLivePools(out.textContent || "", LIVE_W.gen); } catch { /* egal */ }
      worldLogGeneration(input);
      // Einstellungen mitschreiben, damit die Diagnose den Text zuordnen kann
      saveSchnappschuss({
        preset: presetStatus.textContent?.replace(/^Aktiv:\s*/, "") || "—",
        ton: tone.options[tone.selectedIndex]?.text || tone.value,
        tonId: tone.value,
        form: form.options[form.selectedIndex]?.text || form.value,
        struktur: structure.options[structure.selectedIndex]?.text || structure.value,
        perspektive: persp.options[persp.selectedIndex]?.text || persp.value,
        rhythmus: rhythm.options[rhythm.selectedIndex]?.text || rhythm.value,
        markov: markov.options[markov.selectedIndex]?.text || markov.value,
        varianz: varianz.options[varianz.selectedIndex]?.text || varianz.value,
        spannung: tension.options[tension.selectedIndex]?.text || tension.value,
        where: where.value, when: when.value, who: who.value, what: what.value,
        laenge: parseInt(lenSlider.value, 10) || 0, bestenauslese: bestChk.checked,
        zeit: new Date().toLocaleTimeString("de-DE"),
      });
      refreshFeeds();
      clearUndo();
      requestAnimationFrame(positionArrows);
      renderPlan();
      renderStruktur();
    } catch (e) { out.textContent = "Fehler: " + (e instanceof Error ? e.message : String(e)); }
  };
  genBtn.addEventListener("click", generate);
  varBtn.addEventListener("click", generate);
  // Echtzeit: Preset/Ton/Form sofort anwenden (außer während "Würfeln")
  const liveRegen = (): void => { if (!rolling) generate(); };
  preset.addEventListener("change", liveRegen);
  tension.addEventListener("change", liveRegen);
  cast.addEventListener("change", liveRegen);
  tone.addEventListener("change", liveRegen);
  form.addEventListener("change", liveRegen);
  // 4W-Gewichtung: live + nur bei Prosa sichtbar
  let emphTimer: ReturnType<typeof setTimeout> | undefined;
  [wWo, wWann, wWer, wWas].forEach((s) => {
    s.addEventListener("input", () => { clearTimeout(emphTimer); emphTimer = setTimeout(() => { if (!rolling) generate(); }, 180); });
  });
  const updEmphVis = (): void => { const show = form.value === "prose"; [wWo, wWann, wWer, wWas].forEach((s) => { s.style.display = show ? "" : "none"; }); };
  form.addEventListener("change", updEmphVis);
  form.addEventListener("change", updHints);
  copyBtn.addEventListener("click", () => { void navigator.clipboard?.writeText(out.textContent || ""); });

  // Lesemodus (Vollbild-Overlay)
  readBtn.addEventListener("click", () => openReader(out.textContent || "", { who: who.value, where: where.value, when: when.value, what: what.value }));

  // Vorlesen
  let speaking = false;
  speakBtn.addEventListener("click", () => {
    const synth = window.speechSynthesis;
    if (!synth) return;
    if (speaking) { synth.cancel(); speaking = false; speakLbl.textContent = "Vorlesen"; return; }
    const u = new SpeechSynthesisUtterance(out.textContent || "");
    u.lang = "de-DE";
    u.onend = () => { speaking = false; speakLbl.textContent = "Vorlesen"; };
    speaking = true; speakLbl.textContent = "Stopp"; synth.speak(u);
  });

  // Gemerkten Kontext laden (falls aktiv)
  try {
    const saved = localStorage.getItem(CTX_KEY);
    if (saved) { const c = JSON.parse(saved) as Record<string,string>; if(c.where!==undefined)where.value=c.where; if(c.when!==undefined)when.value=c.when; if(c.who!==undefined)who.value=c.who; if(c.what!==undefined)what.value=c.what; ctxKeep.classList.add("on"); ctxKeep.setAttribute("aria-pressed","true"); }
  } catch { /* ignore */ }
  // Übergaben aus anderen Tabs: gewünschte Werte merken, um blockierte Schlösser zu melden
  const handedOver: { el: HTMLInputElement | HTMLSelectElement; label: string; want: string }[] = [];
  const hand = (el: HTMLInputElement | HTMLSelectElement, label: string, v: unknown): void => {
    if (typeof v !== "string" || !v) return;
    if (el instanceof HTMLSelectElement && !Array.from(el.options).some((o) => o.value === v)) return;
    handedOver.push({ el, label, want: v }); el.value = v;
  };
  // Übergabe aus Ideen/Schatzkammer/Assoziation überschreibt den Kontext
  try {
    const pend = localStorage.getItem("dm_pending_ctx");
    if (pend) {
      const c = JSON.parse(pend) as Record<string, string>;
      hand(who, "Wer", c.who); hand(where, "Wo", c.where); hand(when, "Wann", c.when); hand(what, "Was passiert", c.what);
      localStorage.removeItem("dm_pending_ctx");
    }
  } catch { /* ignore */ }
  // Übergabe aus Welt/Omnikognition (setzt Regler, Stärke, Wortbank)
  let pendingStudio: Record<string, unknown> | null = null;
  try { const s = localStorage.getItem("dm_pending_studio"); if (s) { pendingStudio = JSON.parse(s) as Record<string, unknown>; localStorage.removeItem("dm_pending_studio"); } } catch { /* ignore */ }
  if (pendingStudio) {
    const P = pendingStudio;
    hand(where, "Wo", P["where"]); hand(when, "Wann", P["when"]); hand(who, "Wer", P["who"]); hand(what, "Was passiert", P["what"]);
    hand(form, "Form", P["form"]); hand(structure, "Struktur", P["structure"]); hand(persp, "Perspektive", P["perspective"]);
    hand(rhythm, "Rhythmus", P["rhythm"]); hand(varianz, "Varianz", P["varLevel"]); hand(mode, "Modus", P["mode"]);
    hand(tone, "Ton", P["tone"]); hand(markov, "Markov", P["markovMode"]); hand(archA, "Archetyp A", P["archetypeA"]);
    hand(archB, "Archetyp B", P["archetypeB"]); hand(disruptor, "Disruptor", P["disruptor"]); hand(instab, "Instabilität", P["instability"]);
    const emp = P["emphasis"] as Record<string, number> | undefined;
    if (emp) { wWo.value = String(emp.wo ?? 0); wWann.value = String(emp.wann ?? 0); wWer.value = String(emp.wer ?? 0); wWas.value = String(emp.was ?? 0); }
    if (P["bank"]) {
      saveBank(P["bank"] as never); saveActiveBankLabel("Wahrnehmung (Omnikognition)");
      if (!preset.querySelector('option[value="__omni__"]')) {
        const o = document.createElement("option"); o.value = "__omni__"; o.textContent = "Wahrnehmung (Omnikognition)"; preset.insertBefore(o, preset.firstChild);
      }
      preset.value = "__omni__";
    }
  } else if (!studioSchonGewuerfelt) {
    // Zufallsstart: alle Regler würfeln (gesperrte bleiben; kein dispatch, generate() folgt am Ende).
    // NUR beim ersten Aufbau je Sitzung — mountStudio läuft bei jedem Tab-Wechsel erneut,
    // und ein Neuwürfeln dort zerstört jeden Vergleichslauf (Ton sprang von Nüchtern
    // auf Hoffnungsvoll, Rhythmus von Fraktur auf Klar).
    ROLL_SELECTS.forEach((s) => { if (!locked.has(s.id) && s.options.length) s.selectedIndex = Math.floor(Math.random() * s.options.length); });
    studioSchonGewuerfelt = true;
  } else {
    // Rückkehr in den Tab: zuletzt gewählte Reglerstellung wiederherstellen
    for (const s of ROLL_SELECTS) { const v = studioReglerStand[s.id]; if (v !== undefined && Array.from(s.options).some((o) => o.value === v)) s.value = v; }
  }
  restoreLocked();
  // Reglerstand festhalten, damit die Rückkehr in den Tab ihn wiederherstellen kann
  const merkeRegler = (): void => { for (const s of ROLL_SELECTS) studioReglerStand[s.id] = s.value; };
  ROLL_SELECTS.forEach((s) => s.addEventListener("change", () => { studioReglerStand[s.id] = s.value; }));
  merkeRegler();
  // Schlösser haben Übergabewerte überschrieben? Hinweis mit Sofortlösung zeigen.
  const blocked = handedOver.filter((h) => locked.has(h.el.id) && h.el.value !== h.want);
  if (blocked.length) {
    const names = blocked.map((b) => b.label).join(", ");
    const applyBtn = button("Schlösser öffnen und übernehmen");
    applyBtn.addEventListener("click", () => {
      for (const b of blocked) { locked.delete(b.el.id); delete lockVals[b.el.id]; b.el.value = b.want; }
      saveLocks(); saveLockVals();
      lockPainters && Object.keys(lockPainters).forEach((id) => (lockPainters[id] || []).forEach((fn) => fn()));
      lockBar.remove(); updHints(); renderPresetChecks(); generate();
    });
    const closeBtn = el("button", { class: "x", type: "button", "aria-label": "Hinweis schließen" }, "✕");
    closeBtn.addEventListener("click", () => lockBar.remove());
    lockBar.append(
      el("span", {}, `🔒 Übernahme unvollständig: ${blocked.length === 1 ? "Ein Feld wurde" : blocked.length + " Felder wurden"} nicht übernommen, weil das Schloss geschlossen ist — ${names}.`),
      applyBtn, closeBtn);
    wrap.insertBefore(lockBar, wrap.firstChild);
  }
  lenVal.textContent = lenSlider.value;
  updNovVal(); updSurpVal(); rangeVal.textContent = "#" + rangeSlider.value;   // Anzeigen nach restoreLocked nachziehen
  updEmphVis();
  applyStoryFont(out, fontSel.value, parseFloat(sizeSlider.value));
  if (!pendingStudio) { if (preset.value === AUTOMIX_ID) { saveBank(buildAutoMixBank()); saveActiveBankLabel("Auto-Mix"); } else { const first = getAllPresets()[preset.value]; if (first) { saveBank(first.bank); saveActiveBankLabel(first.label || preset.value); } } }
  // Mehrfach-Preset-Auswahl nach Neustart wiederherstellen (Merge-Bank + Dropdown-Zustand)
  if (multiIds.length >= 2) { ensureMultiOption(); preset.value = MULTI_ID; applyMulti(); }
  renderPresetChecks();
  updHints();
  requestAnimationFrame(positionArrows);
  let pendingText = "";
  try { pendingText = localStorage.getItem("dm_pending_text") || ""; localStorage.removeItem("dm_pending_text"); } catch { /* ignore */ }
  if (pendingText.trim()) {
    out.textContent = pendingText;
    try { localStorage.setItem("dm_last_text", pendingText); } catch { /* voll */ }
    renderKling(readInput().form, pendingText);
    refreshFeeds();
  } else {
    generate();
  }
}
