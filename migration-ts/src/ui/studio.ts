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

export function mountStudio(root: HTMLElement): void {
  root.innerHTML = "";
  const wrap = el("div", {});

  const where = textInput("f-where", "Wo?", "auf der Schafsweide");
  const when = textInput("f-when", "Wann?", "vor langer Zeit");
  const who = textInput("f-who", "Wer? (2 durch Komma = Dialog)", "Baucis, Philemon");
  const what = textInput("f-what", "Was passiert?", "ein Wunder geschieht");
  const ctxDice = button("🎲 Kontext würfeln");
  ctxDice.addEventListener("click", () => { const c = randomContext(); where.value = c.where; when.value = c.when; who.value = c.who; what.value = c.what; });
  wrap.append(el("div", { class: "grid2" },
    field("Wo?", where), field("Wann?", when), field("Wer?", who), field("Was passiert?", what)), el("div", { class: "btnrow" }, ctxDice));

  const preset = select("f-preset", sortedPresetOptions());
  preset.addEventListener("change", () => { const p = getAllPresets()[preset.value]; if (p) saveBank(p.bank); });

  const tone = select("f-tone", [["neutral", "Neutral"], ["mystery", "Mystery"], ["poetic", "Poetisch"], ["dark", "Düster"], ["uplifting", "Hoffnungsvoll"], ["humorous", "Humorvoll"]], "mystery");
  const form = select("f-form", [["prose", "Prosa"], ["drama", "Drama"], ["poem", "Prosagedicht"], ["strang", "Gedicht-Strang"], ["reim", "Reim"], ["haiku", "Haiku"], ["script", "Szene/Dialog"], ["video", "Multi-Shot (Video)"]], "prose");
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

  const out = el("pre", { id: "f-out", class: "out" });

  const genBtn = button("▶ Generieren", "primary");
  const varBtn = button("Variante");
  const copyBtn = button("Kopieren");
  const diceBtn = button("🎲 Würfeln");
  const rollSel = (s: HTMLSelectElement): void => { s.selectedIndex = Math.floor(Math.random() * s.options.length); s.dispatchEvent(new Event("change")); };
  diceBtn.addEventListener("click", () => { [tone, form, structure, mode, persp, rhythm, instab, disruptor, varianz, stil, preset].forEach(rollSel); generate(); });
  const readBtn = button("📖 Lesen");
  const speakBtn = button("🔊 Vorlesen");
  wrap.append(el("div", { class: "btnrow" }, genBtn, varBtn, diceBtn, copyBtn, readBtn, speakBtn), out);

  const fine = el("details", { class: "fine" });
  fine.append(el("summary", {}, "🧰 Werkzeugkasten"));
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
  });
  const generate = (): void => {
    const model = markov.value !== "off" ? buildModelFromCorpus(2) : undefined;
    const input = readInput();
    try {
      out.textContent = buildStory(loadBank(), input, model);
      try { localStorage.setItem("dm_last_text", out.textContent || ""); } catch { /* voll */ }
      worldLogGeneration(input);
    } catch (e) { out.textContent = "Fehler: " + (e instanceof Error ? e.message : String(e)); }
  };
  genBtn.addEventListener("click", generate);
  varBtn.addEventListener("click", generate);
  copyBtn.addEventListener("click", () => { void navigator.clipboard?.writeText(out.textContent || ""); });

  // Lesemodus (Vollbild-Overlay)
  readBtn.addEventListener("click", () => {
    const overlay = el("div", { class: "reader" });
    overlay.append(el("button", { class: "x" }, "✕"));
    overlay.append(el("div", {}, out.textContent || "Noch kein Text."));
    overlay.addEventListener("click", () => overlay.remove());
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

  try {
    const pend = localStorage.getItem("dm_pending_ctx");
    if (pend) { const c = JSON.parse(pend) as Record<string,string>; where.value=c.who?c.where:where.value; if(c.who)who.value=c.who; if(c.where)where.value=c.where; if(c.when)when.value=c.when; if(c.what)what.value=c.what; localStorage.removeItem("dm_pending_ctx"); }
  } catch { /* ignore */ }
  const first = getAllPresets()[preset.value];
  if (first) saveBank(first.bank);
  generate();
}
