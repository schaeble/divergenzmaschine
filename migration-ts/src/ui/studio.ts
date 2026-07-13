// Studio-Tab: Kontext, Regler, Preset, Generieren/Variante/Kopieren,
// Lesemodus (Vollbild) und Vorlesen (SpeechSynthesis).
import type { GenInput, FormKind } from "../types";
import { loadBank, saveBank } from "../storage";
import { getAllPresets } from "../wordbank";
import { buildStory } from "../generation/buildStory";
import { buildModelFromCorpus } from "../corpus";
import { el, select, field, textInput, button } from "./dom";

export function mountStudio(root: HTMLElement): void {
  root.innerHTML = "";
  const wrap = el("div", { style: "max-width:820px;margin:1rem auto" });

  const where = textInput("f-where", "Wo?", "auf der Schafsweide");
  const when = textInput("f-when", "Wann?", "vor langer Zeit");
  const who = textInput("f-who", "Wer? (2 durch Komma = Dialog)", "Baucis, Philemon");
  const what = textInput("f-what", "Was passiert?", "ein Wunder geschieht");
  wrap.append(el("div", { style: "display:grid;grid-template-columns:1fr 1fr;gap:8px" },
    field("Wo?", where), field("Wann?", when), field("Wer?", who), field("Was passiert?", what)));

  const preset = select("f-preset", Object.values(getAllPresets()).map((p) => [p.id, p.label] as [string, string]));
  preset.addEventListener("change", () => { const p = getAllPresets()[preset.value]; if (p) saveBank(p.bank); });

  const tone = select("f-tone", [["neutral", "Neutral"], ["mystery", "Mystery"], ["poetic", "Poetisch"], ["dark", "Düster"], ["uplifting", "Hoffnungsvoll"], ["humorous", "Humorvoll"]], "mystery");
  const form = select("f-form", [["prose", "Prosa"], ["script", "Szene/Dialog"]], "prose");
  const structure = select("f-structure", [["auto", "Auto"], ["linear", "Linear"], ["reverse", "Reverse"], ["circle", "Kreis"], ["fragment", "Fragment"], ["object", "Objekt"]], "auto");
  const mode = select("f-mode", [["auto", "Auto"], ["bureau", "Bürokratie"], ["tech", "Tech-Mystik"], ["body", "Body"], ["myth", "Myth"], ["absurd", "Absurd"], ["post", "Posthuman"]], "auto");
  const persp = select("f-persp", [["auto", "Auto"], ["third", "Er/Sie"], ["first", "Ich"], ["second", "Du"], ["we", "Wir"], ["object", "Objekt"]], "auto");
  const rhythm = select("f-rhythm", [["auto", "Auto"], ["breath", "Atem"], ["staccato", "Staccato"], ["long", "Lange Bögen"], ["fracture", "Fraktur"], ["clean", "Klar"]], "auto");
  const instab = select("f-instab", [["0", "Aus"], ["1", "Subtil"], ["2", "Aggressiv"]], "2");
  const markov = select("f-markov", [["off", "Aus"], ["mix", "Mix"], ["on", "Stark"]], "off");
  const disruptor = select("f-disruptor", [["auto", "Auto"], ["off", "Aus"], ["on", "An"]], "auto");
  const polish = el("input", { id: "f-polish", type: "checkbox" }) as HTMLInputElement;
  wrap.append(el("div", { style: "display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:8px" },
    field("Preset", preset), field("Ton", tone), field("Form", form),
    field("Struktur", structure), field("Modus", mode), field("Perspektive", persp),
    field("Rhythmus", rhythm), field("Instabilität", instab), field("Markov", markov),
    field("Disruptor", disruptor),
    el("label", { style: "display:flex;align-items:center;gap:6px;font:12px system-ui;color:#555;margin-top:20px" }, polish, "Sprachschliff")));

  const out = el("pre", { id: "f-out", style: "white-space:pre-wrap;background:#f6f6f6;padding:12px;border-radius:8px;margin-top:12px;min-height:80px;font:15px/1.55 Georgia,serif" });

  const genBtn = button("▶ Generieren", "font-weight:600");
  const varBtn = button("Variante");
  const copyBtn = button("Kopieren");
  const readBtn = button("📖 Lesen");
  const speakBtn = button("🔊 Vorlesen");
  wrap.append(el("div", {}, genBtn, varBtn, copyBtn, readBtn, speakBtn), out);
  root.append(wrap);

  const readInput = (): GenInput => ({
    where: where.value, when: when.value, who: who.value, what: what.value,
    tone: tone.value, varLevel: "wild", form: form.value as FormKind,
    structure: structure.value, mode: mode.value, perspective: persp.value,
    rhythm: rhythm.value, markovMode: markov.value, disruptor: disruptor.value,
    archetypeA: "neutral", archetypeB: "psychopath",
    instability: parseInt(instab.value, 10) as 0 | 1 | 2,
    polish: polish.checked, polishStyle: "surreal_precise",
  });
  const generate = (): void => {
    const model = markov.value !== "off" ? buildModelFromCorpus(2) : undefined;
    try { out.textContent = buildStory(loadBank(), readInput(), model); }
    catch (e) { out.textContent = "Fehler: " + (e instanceof Error ? e.message : String(e)); }
  };
  genBtn.addEventListener("click", generate);
  varBtn.addEventListener("click", generate);
  copyBtn.addEventListener("click", () => { void navigator.clipboard?.writeText(out.textContent || ""); });

  // Lesemodus (Vollbild-Overlay)
  readBtn.addEventListener("click", () => {
    const overlay = el("div", { style: "position:fixed;inset:0;background:#0a0c10;color:#eee;padding:6vh 8vw;overflow:auto;z-index:9999;font:19px/1.7 Georgia,serif" });
    overlay.append(el("button", { style: "position:fixed;top:12px;right:16px;font:16px system-ui;cursor:pointer" }, "✕"));
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

  const first = getAllPresets()[preset.value];
  if (first) saveBank(first.bank);
  generate();
}
