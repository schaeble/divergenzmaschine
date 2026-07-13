// Phase-3-Nachweis: Kit-Zusammenbau, Baseline-Prosa, Dialog-Engine und der
// Kohärenz-Schliff laufen als getypte Module zusammen.
import type { GenInput } from "./types";
import { loadBank } from "./storage";
import { getAllPresets } from "./wordbank";
import { buildStory } from "./generation/buildStory";
import { postProcessText } from "./generation/postprocess";

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

const baseInput = (over: Partial<GenInput>): GenInput => ({
  where: "auf der Schafsweide", when: "vor langer Zeit",
  who: "Baucis, Philemon", what: "ein Wunder geschieht",
  tone: "neutral", varLevel: "wild", form: "prose",
  structure: "auto", mode: "myth", perspective: "auto",
  rhythm: "auto", markovMode: "off", disruptor: "auto",
  archetypeA: "neutral", archetypeB: "psychopath", instability: 2,
  polish: false, polishStyle: "surreal_precise",
  ...over,
});

function render(): void {
  const app = document.getElementById("app");
  if (!app) return;

  const bank = loadBank();
  const presetCount = Object.keys(getAllPresets()).length;

  const structures = ["linear","reverse","circle","fragment","object"];
  const proseByStructure = structures.map((s) => [s, buildStory(bank, baseInput({ form: "prose", structure: s }))] as const);
  const prose = buildStory(bank, baseInput({ form: "prose", structure: "linear", tone: "mystery" }));
  const scene = buildStory(bank, baseInput({ form: "script" }));

  // Reparatur-Demo an einem absichtlich kaputten Text
  const messy = `Nicht zu vergessen: philemons Blick. Ich hatte eine Feder" schon in der Hand. Ich' Hände glühen. Plötzlich lächeln ich und Philemon, als erinnerten sie sich.`;
  const repaired = postProcessText(messy, baseInput({}));

  app.innerHTML = `
    <main style="font-family:system-ui;max-width:720px;margin:2.5rem auto;padding:0 1rem;line-height:1.5">
      <h1 style="font-size:1.25rem">Divergenzmaschine — TS-Migration · Phase 3</h1>
      <p>${presetCount} Presets · Generierung + Dialog-Engine + Kohärenz-Schliff
         laufen als getypte Module.</p>

      <h2 style="font-size:1rem">Prosa mit Ton (Mystery, linear)</h2>
      <blockquote style="border-left:3px solid #ccc;padding-left:.75rem;color:#333">${esc(prose)}</blockquote>

      <h2 style="font-size:1rem">Struktur-Varianten</h2>
      ${proseByStructure.map(([s, txt]) => `<p style="margin:.4rem 0"><b>${s}:</b> ${esc(txt).slice(0, 220)}…</p>`).join("")}

      <h2 style="font-size:1rem">Dialog-Szene</h2>
      <pre style="white-space:pre-wrap;background:#f6f6f6;padding:.75rem;border-radius:6px;font:inherit">${esc(scene)}</pre>

      <h2 style="font-size:1rem">Kohärenz-Schliff (Reparatur)</h2>
      <p style="color:#a00">vorher: ${esc(messy)}</p>
      <p style="color:#070">nachher: ${esc(repaired)}</p>
    </main>`;
}

render();
