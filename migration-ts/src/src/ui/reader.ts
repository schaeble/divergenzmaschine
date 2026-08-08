// Wiederverwendbarer Vollbild-Lesemodus mit Werkzeugleiste.
import { el } from "./dom";
import { icon } from "./icons";
import { addToTreasury } from "../features/treasury";

export interface ReaderCtx { who?: string; where?: string; when?: string; what?: string; }

export function openReader(text: string, ctx: ReaderCtx = {}): void {
  const t = text || "Noch kein Text.";
  const overlay = el("div", { class: "reader" });
  const body = el("div", { class: "reader-text" }, t);
  let fs = 19;
  const setFs = (v: number): void => { fs = Math.max(13, Math.min(40, v)); body.style.fontSize = fs + "px"; };

  const smaller = el("button", { title: "Kleiner" }, "A−");
  const bigger = el("button", { title: "Größer" }, "A+");
  const copyLbl = el("span", {}, "Kopieren");
  const copy = el("button", {}, icon("copy"), " ", copyLbl);
  const keepLbl = el("span", {}, "Merken");
  const keep = el("button", {}, icon("star"), " ", keepLbl);
  const speakLbl = el("span", {}, "Vorlesen");
  const speak = el("button", {}, icon("volume"), " ", speakLbl);
  const close = el("button", { class: "x", "aria-label": "Schließen" }, icon("x"));

  smaller.addEventListener("click", () => setFs(fs - 2));
  bigger.addEventListener("click", () => setFs(fs + 2));
  copy.addEventListener("click", () => { void navigator.clipboard?.writeText(t); copyLbl.textContent = "Kopiert ✓"; setTimeout(() => (copyLbl.textContent = "Kopieren"), 1200); });
  keep.addEventListener("click", () => {
    const n = addToTreasury(t, ctx);
    keepLbl.textContent = n < 0 ? "— schon drin" : `Gemerkt (${n})`;
    setTimeout(() => (keepLbl.textContent = "Merken"), 1400);
  });
  let rSpeaking = false;
  speak.addEventListener("click", () => {
    const synth = window.speechSynthesis;
    if (!synth) return;
    if (rSpeaking) { synth.cancel(); rSpeaking = false; speakLbl.textContent = "Vorlesen"; return; }
    synth.cancel();
    const u = new SpeechSynthesisUtterance(t); u.lang = "de-DE";
    u.onend = () => { rSpeaking = false; speakLbl.textContent = "Vorlesen"; };
    rSpeaking = true; speakLbl.textContent = "Stopp"; synth.speak(u);
  });
  const dismiss = (): void => { window.speechSynthesis?.cancel(); overlay.remove(); };
  close.addEventListener("click", dismiss);

  overlay.append(el("div", { class: "reader-bar" }, smaller, bigger, copy, keep, speak, close), body);
  document.body.append(overlay);
}
