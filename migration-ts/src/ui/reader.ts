// Wiederverwendbarer Vollbild-Lesemodus mit Werkzeugleiste.
import { el } from "./dom";
import { icon } from "./icons";
import { addToTreasury } from "../features/treasury";
import { speichereText } from "../features/textexport";
import { VERSION } from "../version";

// `form` ist der ANZEIGENAME („Prosa", „Assoziation"), nicht der Schluessel der
// Auswahlliste: Der Leser gibt ihn unveraendert in den Dateikopf weiter.
export interface ReaderCtx {
  who?: string; where?: string; when?: string; what?: string; titel?: string;
  form?: string; einstellungen?: Record<string, string>;
}

export function openReader(text: string, ctx: ReaderCtx = {}): void {
  const t = text || "Noch kein Text.";
  const overlay = el("div", { class: "reader" });
  const body = el("div", { class: "reader-text" }, t);
  // Der Titel steht im Leser über dem Text, wenn das Studio einen mitgibt.
  if (ctx.titel) body.prepend(el("h2", { class: "text-titel" }, ctx.titel));
  let fs = 19;
  const setFs = (v: number): void => { fs = Math.max(13, Math.min(40, v)); body.style.fontSize = fs + "px"; };

  const smaller = el("button", { title: "Kleiner" }, "A−");
  const bigger = el("button", { title: "Größer" }, "A+");
  const copyLbl = el("span", {}, "Kopieren");
  const copy = el("button", {}, icon("copy"), " ", copyLbl);
  const keepLbl = el("span", {}, "Merken");
  const keep = el("button", {}, icon("star"), " ", keepLbl);
  // Speichern gehoert in DIESE Leiste, nicht nur unter die Textbox: Im
  // einfachen Modus fuehrt „Los" unmittelbar hierher, und wer den Text hier
  // liest, hat den Knopf im Studio gar nicht vor Augen (4.369.0).
  const save = el("button", { title: "Als Textdatei speichern — mit Umschalt als Markdown" }, icon("floppy"), " Speichern");
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
  save.addEventListener("click", (ev) => {
    speichereText(t, {
      titel: ctx.titel, form: ctx.form, who: ctx.who, where: ctx.where, when: ctx.when, what: ctx.what,
      version: VERSION, einstellungen: ctx.einstellungen,
    }, (ev as MouseEvent).shiftKey ? "md" : "txt");
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

  overlay.append(el("div", { class: "reader-bar" }, smaller, bigger, copy, keep, save, speak, close), body);
  document.body.append(overlay);
}
