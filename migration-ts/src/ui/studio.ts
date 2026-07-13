// Studio-UI: verdrahtet die portierte Engine mit echten Bedienelementen.
// (Kern-Tab. Weitere Tabs — Welt, Ideen, Korpus-Editor, Oszilloskop, KI,
//  Reader, Video — sind bewusst noch nicht portiert.)
import type { GenInput, FormKind } from "../types";
import { loadBank, saveBank } from "../storage";
import { getAllPresets } from "../wordbank";
import { buildStory } from "../generation/buildStory";
import { buildModelFromCorpus } from "../corpus";

type Opt = [string, string]; // [value, label]

const el = <K extends keyof HTMLElementTagNameMap>(tag: K, attrs: Record<string, string> = {}, ...kids: (Node | string)[]): HTMLElementTagNameMap[K] => {
  const e = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === "class") e.className = v; else e.setAttribute(k, v);
  }
  for (const kid of kids) e.append(kid);
  return e;
};

function select(id: string, options: Opt[], value?: string): HTMLSelectElement {
  const s = el("select", { id, style: "width:100%;padding:6px;margin-top:2px" });
  for (const [v, label] of options) {
    const o = el("option", { value: v }, label);
    if (v === value) o.setAttribute("selected", "");
    s.append(o);
  }
  return s;
}

function field(label: string, node: HTMLElement): HTMLElement {
  return el("label", { style: "display:block;font:12px system-ui;color:#555;margin:6px 0" }, label, node);
}

function textInput(id: string, placeholder: string, val = ""): HTMLInputElement {
  const i = el("input", { id, placeholder, value: val, style: "width:100%;padding:6px;margin-top:2px" });
  return i;
}

export function mountStudio(root: HTMLElement): void {
  root.innerHTML = "";
  const wrap = el("main", { style: "font-family:system-ui;max-width:820px;margin:1.5rem auto;padding:0 1rem" });
  wrap.append(el("h1", { style: "font-size:1.2rem" }, "Divergenzmaschine — Studio (TypeScript)"));

  // Kontext
  const where = textInput("f-where", "Wo?", "auf der Schafsweide");
  const when = textInput("f-when", "Wann?", "vor langer Zeit");
  const who = textInput("f-who", "Wer? (2 durch Komma = Dialog)", "Baucis, Philemon");
  const what = textInput("f-what", "Was passiert?", "ein Wunder geschieht");
  const ctx = el("div", { style: "display:grid;grid-template-columns:1fr 1fr;gap:8px" },
    field("Wo?", where), field("Wann?", when), field("Wer?", who), field("Was passiert?", what));
  wrap.append(ctx);

  // Presets
  const preset = select("f-preset", []);
  const refreshPresets = (): void => {
    preset.innerHTML = "";
    for (const p of Object.values(getAllPresets())) preset.append(el("option", { value: p.id }, p.label));
  };
  refreshPresets();
  preset.addEventListener("change", () => {
    const p = getAllPresets()[preset.value];
    if (p) saveBank(p.bank);
  });

  // Regler
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

  const grid = el("div", { style: "display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:8px" },
    field("Preset", preset), field("Ton", tone), field("Form", form),
    field("Struktur", structure), field("Modus", mode), field("Perspektive", persp),
    field("Rhythmus", rhythm), field("Instabilität", instab), field("Markov", markov),
    field("Disruptor", disruptor),
    el("label", { style: "display:flex;align-items:center;gap:6px;font:12px system-ui;color:#555;margin-top:20px" }, polish, "Sprachschliff"));
  wrap.append(grid);

  // Buttons + Ausgabe
  const genBtn = el("button", { style: "padding:8px 16px;margin:12px 8px 0 0;font:600 14px system-ui;cursor:pointer" }, "▶ Generieren");
  const varBtn = el("button", { style: "padding:8px 16px;margin-top:12px;cursor:pointer" }, "Variante");
  const copyBtn = el("button", { style: "padding:8px 16px;margin:12px 0 0 8px;cursor:pointer" }, "Kopieren");
  wrap.append(el("div", {}, genBtn, varBtn, copyBtn));

  const out = el("pre", { id: "f-out", style: "white-space:pre-wrap;background:#f6f6f6;padding:12px;border-radius:8px;margin-top:12px;min-height:80px;font:15px/1.55 Georgia,serif" });
  wrap.append(out);
  root.append(wrap);

  const readInput = (): GenInput => ({
    where: where.value, when: when.value, who: who.value, what: what.value,
    tone: tone.value, varLevel: "wild", form: form.value as FormKind,
    structure: structure.value, mode: mode.value, perspective: persp.value,
    rhythm: rhythm.value, markovMode: markov.value, disruptor: disruptor.value,
    archetypeA: "neutral", archetypeB: "psychopath",
    instability: (parseInt(instab.value, 10) as 0 | 1 | 2),
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

  // Startzustand: aktives Preset in die Bank laden + erste Generierung
  const first = getAllPresets()[preset.value];
  if (first) saveBank(first.bank);
  generate();
}
