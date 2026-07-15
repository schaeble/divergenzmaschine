// Studio-Tab: Kontext, Regler, Preset, Generieren/Variante/Kopieren,
// Lesemodus (Vollbild) und Vorlesen (SpeechSynthesis).
import type { GenInput, FormKind } from "../types";
import { loadBank, saveBank } from "../storage";
import { getAllPresets, sortedPresetOptions } from "../wordbank";
import { buildStory } from "../generation/buildStory";
import { buildModelFromCorpus } from "../corpus";
import { randomContext } from "../generation/context";
import { el, select, field, textInput, button } from "./dom";
import { worldLogGeneration } from "../features/world";
import { addToTreasury } from "../features/treasury";
import { loadFont, loadFontSize, saveFontPrefs, applyStoryFont } from "../features/fonts";
import { runProbe, runRanking, runAiRanking, type Ranking } from "../generation/scoring";

export function mountStudio(root: HTMLElement): void {
  root.innerHTML = "";
  const wrap = el("div", {});

  const where = textInput("f-where", "Wo?", "auf der Schafsweide");
  const when = textInput("f-when", "Wann?", "vor langer Zeit");
  const who = textInput("f-who", "Wer? (2 durch Komma = Dialog)", "Baucis, Philemon");
  const what = textInput("f-what", "Was passiert?", "ein Wunder geschieht");
  const ctxDice = button("🎲 Kontext würfeln");
  ctxDice.addEventListener("click", () => { const c = randomContext(); where.value = c.where; when.value = c.when; who.value = c.who; what.value = c.what; });
  const ctxKeep = button("📌 Kontext merken", "toggle");
  const CTX_KEY = "divergenz_ctx_v1";
  ctxKeep.title = "Wo/Wann/Wer/Was sichern und bei jedem Start laden";
  const setCtxKeep = (on: boolean): void => {
    ctxKeep.classList.toggle("on", on);
    ctxKeep.setAttribute("aria-pressed", String(on));
    try { if (on) localStorage.setItem(CTX_KEY, JSON.stringify({ where: where.value, when: when.value, who: who.value, what: what.value })); else localStorage.removeItem(CTX_KEY); } catch { /* voll */ }
  };
  ctxKeep.addEventListener("click", () => setCtxKeep(!ctxKeep.classList.contains("on")));
  wrap.append(el("div", { class: "grid2" },
    field("Wo?", where), field("Wann?", when), field("Wer?", who), field("Was passiert?", what)), el("div", { class: "btnrow" }, ctxDice, ctxKeep));

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
  const polish = el("input", { id: "f-polish", type: "checkbox" }) as HTMLInputElement;
  wrap.append(el("div", { class: "grid3" },
    field("Preset", preset), field("Ton", tone), field("Form", form)));

  const lenSlider = el("input", { id: "f-len", type: "range", min: "40", max: "300", step: "10", value: "110", style: "flex:1" }) as HTMLInputElement;
  const lenVal = el("span", { class: "muted" }, "110");
  lenSlider.addEventListener("input", () => { lenVal.textContent = lenSlider.value; });
  const lenRow = el("label", { class: "field lenrow" }, "Textlänge ", lenSlider, " ", lenVal);

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
  const fontRow = el("label", { class: "field lenrow fontrow" }, "Schrift ", fontSel, " Größe ", sizeSlider, " ", sizeVal);

  const out = el("pre", { id: "f-out", class: "out" });
  const kling = el("div", { class: "kling" });

  const genBtn = button("▶ Generieren", "primary");
  const varBtn = button("Variante");
  const copyBtn = button("Kopieren");
  const diceBtn = button("🎲 Würfeln");
  const rollSel = (s: HTMLSelectElement): void => { s.selectedIndex = Math.floor(Math.random() * s.options.length); s.dispatchEvent(new Event("change")); };
  diceBtn.addEventListener("click", () => { [tone, form, structure, mode, persp, rhythm, instab, disruptor, varianz, stil, preset].forEach(rollSel); generate(); });
  const keepBtn = button("⭐ Merken");
  keepBtn.addEventListener("click", () => {
    const n = addToTreasury(out.textContent || "", { who: who.value, where: where.value, when: when.value, what: what.value });
    keepBtn.textContent = n < 0 ? "— schon drin" : `⭐ Gemerkt (${n})`;
    setTimeout(() => (keepBtn.textContent = "⭐ Merken"), 1400);
  });
  const readBtn = button("📖 Lesen");
  const speakBtn = button("🔊 Vorlesen");
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
  const aiRankBtn = button("🤖 KI-Ranking (50)");
  aiRankBtn.addEventListener("click", async () => {
    aiRankBtn.disabled = true; const old = aiRankBtn.textContent; aiRankBtn.textContent = "🤖 bewertet…";
    rankStatus.textContent = "KI-Ranking läuft…";
    try {
      lastRanking = await runAiRanking(loadBank(), readInput(), buildModelFromCorpus(), 50, 10);
      rangeSlider.max = String(lastRanking.all.length); rangeSlider.value = "1"; applyPlace(1);
    } catch (e) { rankStatus.textContent = e instanceof Error ? e.message : String(e); }
    finally { aiRankBtn.disabled = false; aiRankBtn.textContent = old; }
  });
  const rankDetails = el("details", { class: "fine" });
  rankDetails.append(el("summary", {}, "🧪 Test & Ranking"),
    el("div", { class: "btnrow" }, probeBtn, rankBtn, aiRankBtn),
    el("div", { class: "btnrow" }, goldBtn, silverBtn, bronzeBtn),
    el("label", { class: "field lenrow" }, "Rang ", rangeSlider),
    el("div", {}, rankStatus));
  wrap.append(rankDetails);

  const fine = el("details", { class: "fine" });
  fine.append(el("summary", {}, "🧰 Werkzeugkasten"));
  fine.append(fontRow);
  fine.append(el("div", { class: "grid3" },
    field("Struktur", structure), field("Modus", mode), field("Perspektive", persp),
    field("Rhythmus", rhythm), field("Instabilität", instab), field("Markov", markov),
    field("Disruptor", disruptor), field("Varianz", varianz), field("Stil", stil),
    field("Video: Shots", shots), field("Video: Sekunden", secs),
    el("label", { class: "field", style: "display:flex;align-items:center;gap:6px" }, polish, "Sprachschliff")));
  wrap.append(fine);
  root.append(wrap);

  const readInput = (): GenInput => ({
    where: where.value, when: when.value, who: who.value, what: what.value,
    tone: tone.value, varLevel: varianz.value, form: form.value as FormKind,
    structure: structure.value, mode: mode.value, perspective: persp.value,
    rhythm: rhythm.value, markovMode: markov.value, disruptor: disruptor.value,
    archetypeA: "neutral", archetypeB: "psychopath",
    instability: parseInt(instab.value, 10) as 0 | 1 | 2,
    polish: polish.checked, polishStyle: stil.value,
    shots: parseInt(shots.value, 10), totalSec: parseInt(secs.value, 10),
    lenTarget: parseInt(lenSlider.value, 10),
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
      try { localStorage.setItem("dm_last_text", out.textContent || ""); } catch { /* voll */ }
      renderKling(input.form, out.textContent || "");
      worldLogGeneration(input);
    } catch (e) { out.textContent = "Fehler: " + (e instanceof Error ? e.message : String(e)); }
  };
  genBtn.addEventListener("click", generate);
  varBtn.addEventListener("click", generate);
  copyBtn.addEventListener("click", () => { void navigator.clipboard?.writeText(out.textContent || ""); });

  // Lesemodus (Vollbild-Overlay) mit Werkzeugleiste
  readBtn.addEventListener("click", () => {
    const text = out.textContent || "Noch kein Text.";
    const overlay = el("div", { class: "reader" });
    const body = el("div", { class: "reader-text" }, text);
    let fs = 19;
    const setFs = (v: number) => { fs = Math.max(13, Math.min(40, v)); body.style.fontSize = fs + "px"; };

    const smaller = el("button", {}, "A−");
    const bigger = el("button", {}, "A+");
    const copy = el("button", {}, "Kopieren");
    const keep = el("button", {}, "⭐ Merken");
    const speak = el("button", {}, "🔊 Vorlesen");
    const close = el("button", { class: "x" }, "✕");

    smaller.addEventListener("click", () => setFs(fs - 2));
    bigger.addEventListener("click", () => setFs(fs + 2));
    copy.addEventListener("click", () => { void navigator.clipboard?.writeText(text); copy.textContent = "Kopiert ✓"; setTimeout(() => (copy.textContent = "Kopieren"), 1200); });
    keep.addEventListener("click", () => {
      const n = addToTreasury(text, { who: who.value, where: where.value, when: when.value, what: what.value });
      keep.textContent = n < 0 ? "— schon drin" : `⭐ Gemerkt (${n})`;
      setTimeout(() => (keep.textContent = "⭐ Merken"), 1400);
    });
    let rSpeaking = false;
    speak.addEventListener("click", () => {
      const synth = window.speechSynthesis;
      if (!synth) return;
      if (rSpeaking) { synth.cancel(); rSpeaking = false; speak.textContent = "🔊 Vorlesen"; return; }
      const u = new SpeechSynthesisUtterance(text); u.lang = "de-DE";
      u.onend = () => { rSpeaking = false; speak.textContent = "🔊 Vorlesen"; };
      rSpeaking = true; speak.textContent = "⏹ Stopp"; synth.speak(u);
    });
    const dismiss = () => { window.speechSynthesis?.cancel(); overlay.remove(); };
    close.addEventListener("click", dismiss);

    const bar = el("div", { class: "reader-bar" }, smaller, bigger, copy, keep, speak, close);
    overlay.append(bar, body);
    document.body.append(overlay);
  });

  // Vorlesen
  let speaking = false;
  speakBtn.addEventListener("click", () => {
    const synth = window.speechSynthesis;
    if (!synth) return;
    if (speaking) { synth.cancel(); speaking = false; speakBtn.textContent = "🔊 Vorlesen"; return; }
    const u = new SpeechSynthesisUtterance(out.textContent || "");
    u.lang = "de-DE";
    u.onend = () => { speaking = false; speakBtn.textContent = "🔊 Vorlesen"; };
    speaking = true; speakBtn.textContent = "⏹ Stopp"; synth.speak(u);
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
  // Zufallsstart: Preset, Ton und Form
  [preset, tone, form].forEach((s) => { if (s.options.length) s.selectedIndex = Math.floor(Math.random() * s.options.length); });
  applyStoryFont(out, fontSel.value, parseFloat(sizeSlider.value));
  const first = getAllPresets()[preset.value];
  if (first) saveBank(first.bank);
  generate();
}
