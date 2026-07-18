// Studio-Tab: Kontext, Regler, Preset, Generieren/Variante/Kopieren,
// Lesemodus (Vollbild) und Vorlesen (SpeechSynthesis).
import type { GenInput, FormKind } from "../types";
import { loadBank, saveBank } from "../storage";
import { getAllPresets, sortedPresetOptions } from "../wordbank";
import { buildStory } from "../generation/buildStory";
import { buildModelFromCorpus } from "../corpus";
import { enforceWordTarget } from "../generation/length";
import { randomContext } from "../generation/context";
import { el, select, field, textInput, button } from "./dom";
import { icon } from "./icons";
import { openReader } from "./reader";
import { worldLogGeneration } from "../features/world";
import { addToTreasury } from "../features/treasury";
import { THEMES, loadTheme, applyTheme, loadAccent, saveAccent, applyAccent } from "../features/theme";
import { loadFont, loadFontSize, saveFontPrefs, applyStoryFont } from "../features/fonts";
import { runProbe, runRanking, runAiRanking, type Ranking } from "../generation/scoring";

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
  const ctxDice = el("button", {}, icon("dice"), " Kontext würfeln");
  ctxDice.addEventListener("click", () => { const c = randomContext(); where.value = c.where; when.value = c.when; who.value = c.who; what.value = c.what; });
  const ctxKeep = el("button", { class: "toggle" }, icon("pin"), " Kontext merken");
  const CTX_KEY = "divergenz_ctx_v1";
  ctxKeep.title = "Wo/Wann/Wer/Was sichern und bei jedem Start laden";
  const setCtxKeep = (on: boolean): void => {
    ctxKeep.classList.toggle("on", on);
    ctxKeep.setAttribute("aria-pressed", String(on));
    try { if (on) localStorage.setItem(CTX_KEY, JSON.stringify({ where: where.value, when: when.value, who: who.value, what: what.value })); else localStorage.removeItem(CTX_KEY); } catch { /* voll */ }
  };
  ctxKeep.addEventListener("click", () => setCtxKeep(!ctxKeep.classList.contains("on")));
  // Stärke-Regler (experimentell, nur Prosa): je 4W-Feld direkt darunter.
  const mkWeight = (id: string): HTMLInputElement => el("input", { id, class: "wgt", type: "range", min: "0", max: "3", step: "1", value: "0", title: "Stärke — mehr über dieses Feld" }) as HTMLInputElement;
  const wWo = mkWeight("f-w-wo"), wWann = mkWeight("f-w-wann"), wWer = mkWeight("f-w-wer"), wWas = mkWeight("f-w-was");
  const field4w = (label: string, inp: HTMLInputElement, weight: HTMLInputElement): HTMLElement =>
    field(label, el("div", { class: "field4w" }, clearable(inp), weight));
  wrap.append(el("div", { class: "grid2" },
    field4w("Wo?", where, wWo), field4w("Wann?", when, wWann), field4w("Wer?", who, wWer), field4w("Was passiert?", what, wWas)),
    el("div", { class: "btnrow" }, ctxDice, ctxKeep));

  const preset = select("f-preset", sortedPresetOptions());
  preset.addEventListener("change", () => { const p = getAllPresets()[preset.value]; if (p) saveBank(p.bank); });

  const tone = select("f-tone", [["neutral", "Neutral"], ["mystery", "Mystery"], ["poetic", "Poetisch"], ["dark", "Düster"], ["uplifting", "Hoffnungsvoll"], ["humorous", "Humorvoll"]], "mystery");
  const form = select("f-form", [["prose", "Prosa"], ["poem", "Prosagedicht"], ["strang", "Gedicht-Strang"], ["reim", "Reim"], ["haiku", "Haiku"], ["script", "Szene/Dialog"], ["video", "Multi-Shot (Video)"]], "prose");
  const shots = el("input", { id: "f-shots", type: "number", value: "5", min: "3", max: "10" }) as HTMLInputElement;
  const secs = el("input", { id: "f-secs", type: "number", value: "15", min: "3", max: "600" }) as HTMLInputElement;
  const structure = select("f-structure", [["auto", "Auto"], ["linear", "Linear"], ["reverse", "Reverse"], ["circle", "Kreis"], ["fragment", "Fragment"], ["object", "Objekt"]], "auto");
  const mode = select("f-mode", [["auto", "Auto"], ["bureau", "Bürokratie"], ["tech", "Tech-Mystik"], ["body", "Body"], ["myth", "Myth"], ["absurd", "Absurd"], ["post", "Posthuman"]], "auto");
  const persp = select("f-persp", [["auto", "Auto"], ["third", "Er/Sie"], ["first", "Ich"], ["second", "Du"], ["we", "Wir"], ["object", "Objekt"]], "auto");
  const rhythm = select("f-rhythm", [["auto", "Auto"], ["breath", "Atem"], ["staccato", "Staccato"], ["long", "Lange Bögen"], ["fracture", "Fraktur"], ["clean", "Klar"]], "auto");
  const instab = select("f-instab", [["0", "Aus"], ["1", "Subtil"], ["2", "Aggressiv"]], "2");
  const markov = select("f-markov", [["off", "Aus"], ["mix", "Mix"], ["on", "Stark"]], "off");
  const disruptor = select("f-disruptor", [["auto", "Auto"], ["off", "Aus"], ["on", "An"]], "auto");
  const varianz = select("f-varianz", [["low", "Stabil"], ["mid", "Wild"], ["high", "Radikal"]], "mid");
  const stil = select("f-stil", [["surreal_precise", "Surreal präzise"], ["leicht", "Leicht"], ["stark", "Stark"]], "surreal_precise");
  const ARCH_OPTS: [string, string][] = [["neutral", "Neutral"], ["skorpion", "Skorpion"], ["psychopath", "Psychopath"], ["entdecker", "Entdecker"]];
  const archA = select("f-archa", ARCH_OPTS, "neutral");
  const archB = select("f-archb", ARCH_OPTS, "neutral");
  const polish = el("input", { id: "f-polish", type: "checkbox" }) as HTMLInputElement;
  wrap.append(el("div", { class: "grid3" },
    field("Preset", preset), field("Ton", tone), field("Form", form)));


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
  const lenRow = el("label", { class: "field lenrow" }, el("span", { class: "mlabel" }, "Textlänge"), " ", lenSlider, " ", lenVal);

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
  const kling = el("div", { class: "kling" });

  const genBtn = el("button", { class: "primary" }, icon("play"), " Generieren");
  const varBtn = button("Variante");
  const copyBtn = el("button", {}, icon("copy"), " Kopieren");
  const diceBtn = el("button", {}, icon("dice"), " Würfeln");
  const rollSel = (s: HTMLSelectElement): void => { s.selectedIndex = Math.floor(Math.random() * s.options.length); s.dispatchEvent(new Event("change")); };
  diceBtn.addEventListener("click", () => { rolling = true; [tone, form, structure, mode, persp, rhythm, instab, disruptor, varianz, stil, archA, archB, preset].forEach(rollSel); rolling = false; generate(); });
  const keepLbl = el("span", {}, "Merken");
  const keepBtn = el("button", {}, icon("star"), " ", keepLbl);
  keepBtn.addEventListener("click", () => {
    const n = addToTreasury(out.textContent || "", { who: who.value, where: where.value, when: when.value, what: what.value });
    keepLbl.textContent = n < 0 ? "— schon drin" : `Gemerkt (${n})`;
    setTimeout(() => (keepLbl.textContent = "Merken"), 1400);
  });
  const readBtn = el("button", {}, icon("book"), " Lesen");
  const speakLbl = el("span", {}, "Vorlesen");
  const speakBtn = el("button", {}, icon("volume"), " ", speakLbl);
  wrap.append(el("div", { class: "btnrow" }, genBtn, varBtn, diceBtn, copyBtn, keepBtn, readBtn, speakBtn, lenRow), out, kling);

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
    const extra = item.aiScore !== undefined ? `KI ${item.aiScore}/100${item.grund ? " – " + item.grund : ""}` : `Score ${item.score.toFixed(1)}`;
    rankStatus.textContent = `Platz ${place}: ${extra}`;
  };
  const probeBtn = button("Probe (50)");
  probeBtn.addEventListener("click", () => {
    rankStatus.textContent = "Probe läuft…";
    setTimeout(() => { const r = runProbe(loadBank(), readInput(), buildModelFromCorpus(), 50);
      rankStatus.textContent = `Probe: ${r.total} Texte · ${r.flaggedCount} auffällig · ${r.duplicates} doppelt`; }, 10);
  });
  const rankBtn = button("Ranking (50)");
  const rangeSlider = el("input", { type: "range", min: "1", max: "50", value: "1", class: "rankviz" }) as HTMLInputElement;
  rangeSlider.addEventListener("input", () => applyPlace(parseInt(rangeSlider.value, 10)));
  rankBtn.addEventListener("click", () => {
    rankStatus.textContent = "Ranking läuft…";
    setTimeout(() => { lastRanking = runRanking(loadBank(), readInput(), buildModelFromCorpus(), 50, 10);
      rangeSlider.max = String(lastRanking.all.length); rangeSlider.value = "1"; applyPlace(1); }, 10);
  });
  const goldBtn = button("🥇 #1"); goldBtn.addEventListener("click", () => applyPlace(1));
  const silverBtn = button("🥈 #2"); silverBtn.addEventListener("click", () => applyPlace(2));
  const bronzeBtn = button("🥉 #3"); bronzeBtn.addEventListener("click", () => applyPlace(3));
  const aiRankLbl = el("span", {}, "KI-Ranking (50)");
  const aiRankBtn = el("button", {}, icon("flask"), " ", aiRankLbl);
  aiRankBtn.addEventListener("click", async () => {
    aiRankBtn.disabled = true; const old = aiRankLbl.textContent; aiRankLbl.textContent = "bewertet…";
    rankStatus.textContent = "KI-Ranking läuft…";
    try {
      lastRanking = await runAiRanking(loadBank(), readInput(), buildModelFromCorpus(), 50, 10);
      rangeSlider.max = String(lastRanking.all.length); rangeSlider.value = "1"; applyPlace(1);
    } catch (e) { rankStatus.textContent = e instanceof Error ? e.message : String(e); }
    finally { aiRankBtn.disabled = false; aiRankLbl.textContent = old || "KI-Ranking (50)"; }
  });
  const rankDetails = el("details", { class: "fine" });
  rankDetails.append(el("summary", {}, icon("flask"), " Test & Ranking"),
    el("div", { class: "btnrow" }, probeBtn, rankBtn, aiRankBtn),
    el("div", { class: "btnrow" }, goldBtn, silverBtn, bronzeBtn),
    el("label", { class: "field lenrow" }, el("span", { class: "mlabel" }, "Rang"), " ", rangeSlider),
    el("div", {}, rankStatus));
  wrap.append(rankDetails);

  const fine = el("details", { class: "fine" });
  fine.append(el("summary", {}, icon("tool"), " Werkzeugkasten"));
  fine.append(el("div", { class: "grid3" },
    field("Struktur", structure), field("Modus", mode), field("Perspektive", persp),
    field("Rhythmus", rhythm), field("Instabilität", instab), field("Markov", markov),
    field("Disruptor", disruptor), field("Varianz", varianz), field("Stil", stil),
    field("Archetyp A", archA), field("Archetyp B", archB),
    field("Video: Shots", shots), field("Video: Sekunden", secs),
    el("label", { class: "field", style: "display:flex;align-items:center;gap:6px" }, polish, "Sprachschliff")));
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
  const tabSchrift = el("button", { class: "subtab active" }, "Schrift");
  const tabFarbe = el("button", { class: "subtab" }, "Farbe");
  const showSettingsPanel = (schrift: boolean): void => {
    schriftPanel.style.display = schrift ? "" : "none";
    themePanel.style.display = schrift ? "none" : "";
    tabSchrift.classList.toggle("active", schrift);
    tabFarbe.classList.toggle("active", !schrift);
  };
  tabSchrift.addEventListener("click", () => showSettingsPanel(true));
  tabFarbe.addEventListener("click", () => showSettingsPanel(false));
  const settings = el("details", { class: "fine" });
  settings.append(el("summary", {}, icon("settings"), " Einstellungen"),
    el("div", { class: "subtabs" }, tabSchrift, tabFarbe), schriftPanel, themePanel);
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
      out.textContent = buildStory(loadBank(), input, model);
      baseText = out.textContent || "";
      try { localStorage.setItem("dm_last_text", out.textContent || ""); } catch { /* voll */ }
      renderKling(input.form, out.textContent || "");
      worldLogGeneration(input);
    } catch (e) { out.textContent = "Fehler: " + (e instanceof Error ? e.message : String(e)); }
  };
  genBtn.addEventListener("click", generate);
  varBtn.addEventListener("click", generate);
  // Echtzeit: Preset/Ton/Form sofort anwenden (außer während "Würfeln")
  const liveRegen = (): void => { if (!rolling) generate(); };
  preset.addEventListener("change", liveRegen);
  tone.addEventListener("change", liveRegen);
  form.addEventListener("change", liveRegen);
  // 4W-Gewichtung: live + nur bei Prosa sichtbar
  let emphTimer: ReturnType<typeof setTimeout> | undefined;
  [wWo, wWann, wWer, wWas].forEach((s) => {
    s.addEventListener("input", () => { clearTimeout(emphTimer); emphTimer = setTimeout(() => { if (!rolling) generate(); }, 180); });
  });
  const updEmphVis = (): void => { const show = form.value === "prose"; [wWo, wWann, wWer, wWas].forEach((s) => { s.style.display = show ? "" : "none"; }); };
  form.addEventListener("change", updEmphVis);
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
  // Übergabe aus Ideen überschreibt den Kontext
  try {
    const pend = localStorage.getItem("dm_pending_ctx");
    if (pend) { const c = JSON.parse(pend) as Record<string,string>; if(c.who)who.value=c.who; if(c.where)where.value=c.where; if(c.when)when.value=c.when; if(c.what)what.value=c.what; localStorage.removeItem("dm_pending_ctx"); }
  } catch { /* ignore */ }
  // Übergabe aus Welt/Omnikognition (setzt Regler, Stärke, Wortbank)
  let pendingStudio: Record<string, unknown> | null = null;
  try { const s = localStorage.getItem("dm_pending_studio"); if (s) { pendingStudio = JSON.parse(s) as Record<string, unknown>; localStorage.removeItem("dm_pending_studio"); } } catch { /* ignore */ }
  if (pendingStudio) {
    const P = pendingStudio;
    const setStr = (el: HTMLInputElement, k: string): void => { const v = P[k]; if (typeof v === "string" && v) el.value = v; };
    const setSel = (sel: HTMLSelectElement, k: string): void => { const v = P[k]; if (typeof v === "string" && Array.from(sel.options).some((o) => o.value === v)) sel.value = v; };
    setStr(where, "where"); setStr(when, "when"); setStr(who, "who"); setStr(what, "what");
    setSel(form, "form"); setSel(structure, "structure"); setSel(persp, "perspective"); setSel(rhythm, "rhythm"); setSel(varianz, "varLevel"); setSel(mode, "mode"); setSel(tone, "tone"); setSel(markov, "markovMode"); setSel(archA, "archetypeA"); setSel(archB, "archetypeB");
    const emp = P["emphasis"] as Record<string, number> | undefined;
    if (emp) { wWo.value = String(emp.wo ?? 0); wWann.value = String(emp.wann ?? 0); wWer.value = String(emp.wer ?? 0); wWas.value = String(emp.was ?? 0); }
    if (P["bank"]) {
      saveBank(P["bank"] as never);
      if (!preset.querySelector('option[value="__omni__"]')) {
        const o = document.createElement("option"); o.value = "__omni__"; o.textContent = "Wahrnehmung (Omnikognition)"; preset.insertBefore(o, preset.firstChild);
      }
      preset.value = "__omni__";
    }
  } else {
    // Zufallsstart: Preset, Ton und Form
    [preset, tone, form].forEach((s) => { if (s.options.length) s.selectedIndex = Math.floor(Math.random() * s.options.length); });
  }
  updEmphVis();
  applyStoryFont(out, fontSel.value, parseFloat(sizeSlider.value));
  if (!pendingStudio) { const first = getAllPresets()[preset.value]; if (first) saveBank(first.bank); }
  let pendingText = "";
  try { pendingText = localStorage.getItem("dm_pending_text") || ""; localStorage.removeItem("dm_pending_text"); } catch { /* ignore */ }
  if (pendingText.trim()) {
    out.textContent = pendingText;
    try { localStorage.setItem("dm_last_text", pendingText); } catch { /* voll */ }
    renderKling(readInput().form, pendingText);
  } else {
    generate();
  }
}
