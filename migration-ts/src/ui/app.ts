// Tab-Gerüst: Studio · Wortbank · Korpus.
import { el } from "./dom";
import { VERSION } from "../version";
import { exportProject, importProject } from "../features/project";
import { icon } from "./icons";

function showAbout(): void {
  const overlay = el("div", { class: "modal" });
  const close = el("button", { class: "x", "aria-label": "Schließen" }, icon("x"));
  close.addEventListener("click", () => overlay.remove());
  overlay.addEventListener("click", (e) => { if (e.target === overlay) overlay.remove(); });
  const card = el("div", { class: "modal-card" },
    el("div", { class: "modal-head" }, el("h2", {}, "Über die Divergenzmaschine"), close),
    el("div", { class: "modal-body" },
      el("p", {}, "Divergenzmaschine ist ein im Kern offline arbeitendes Werkzeug für prozedurales, assoziatives Schreiben auf Deutsch. Statt Zufallssätze baut sie Texte über eine mehrstufige Pipeline: wählbare Strukturen (linear, umgekehrt, kreisförmig, fragmentiert, objektzentriert) und Formen (Prosa, Prosagedicht, Gedicht-Strang, Reim, Haiku, Szene/Dialog, Multi-Shot), Perspektivwechsel mit grammatischer Anpassung und ein Markov-Modul, das aus einem selbst trainierbaren Korpus lernt. Eine Wiederholungsprüfung verwirft monotone Varianten; „Test & Ranking“ erzeugt und bewertet mehrere Fassungen, damit sich die stärkste auswählen lässt. Dazu: eine Ideenmaschine für kurze Prämissen, ein Weltensimulator für Figuren, Orte und Zeitleiste, ein Satzrhythmus-Oszilloskop, Presets (inkl. Auto-Mix), eine editierbare Wortbank, Farb-Themes und volle Projekt-Speicherung — alle Regler wirken in Echtzeit."),
      el("p", {}, "Neu ist ihr Potential als Frontend: Die Maschine liefert offline die assoziativen Rohtexte und Prämissen, und auf Wunsch arbeitet Claude sie per Klick zu einem zusammenhängenden Text von 500, 750 oder 1000 Wörtern aus. So verbindet sie divergentes Assoziieren mit gezielter Ausarbeitung. Ohne eigenen API-Schlüssel bleibt sie vollständig offline."),
      el("p", { class: "muted" }, "→ Trage links „Wo / Wann / Wer / Was passiert“ ein und klicke auf „Generieren“, um deine erste Geschichte zu erzeugen.")));
  overlay.append(card);
  document.body.append(overlay);
}
import { mountStudio } from "./studio";
import { mountWordbank } from "./wordbankView";
import { mountKorpus } from "./korpusView";
import { mountIdeas } from "./ideasView";
import { mountTreasury } from "./treasuryView";
import { mountWorld } from "./worldView";
import { mountOscilloscope } from "./oscilloscopeView";
import { mountKi } from "./kiView";
import { mountHelp } from "./helpView";

const TABS: [string, (root: HTMLElement) => void][] = [
  ["Studio", mountStudio],
  ["Ideen", mountIdeas],
  ["Schatzkammer", mountTreasury],
  ["Welt", mountWorld],
  ["Wortbank", mountWordbank],
  ["Korpus", mountKorpus],
  ["Oszilloskop", mountOscilloscope],
  ["KI", mountKi],
  ["Hilfe", mountHelp],
];

export function mountApp(root: HTMLElement): void {
  root.innerHTML = "";
  const shell = el("div", { class: "app" });
  const saveBtn = el("button", { class: "topbtn", title: "Projekt speichern (JSON: Wortbank, Presets, Korpus, Einstellungen)" }, icon("floppy"), " Speichern");
  const loadBtn = el("button", { class: "topbtn", title: "Projekt laden (JSON)" }, icon("folder"), " Laden");
  const fileIn = el("input", { type: "file", accept: "application/json,.json", style: "display:none" }) as HTMLInputElement;
  const projStatus = el("span", { class: "projstatus muted" }, "");
  saveBtn.addEventListener("click", () => { exportProject(); projStatus.textContent = "gespeichert ✓"; setTimeout(() => (projStatus.textContent = ""), 1600); });
  loadBtn.addEventListener("click", () => fileIn.click());
  fileIn.addEventListener("change", () => {
    const f = fileIn.files && fileIn.files[0];
    if (!f) return;
    projStatus.textContent = "lade…";
    importProject(f).then(() => { projStatus.textContent = "geladen ✓ — Ansicht wird aktualisiert"; setTimeout(() => location.reload(), 700); })
      .catch((e: unknown) => { projStatus.textContent = "Fehler: " + (e instanceof Error ? e.message : String(e)); });
    fileIn.value = "";
  });
  const titleLink = el("span", { class: "apptitle-link", title: "Über die Divergenzmaschine — klicken" }, "Divergenzmaschine");
  titleLink.addEventListener("click", showAbout);
  const header = el("div", { class: "apphead" },
    el("h1", { class: "apptitle" }, titleLink, el("span", { class: "ver", title: "Build-Version" }, "v" + VERSION)),
    el("div", { class: "projctl" }, projStatus, saveBtn, loadBtn, fileIn));
  shell.append(header);

  const bar = el("div", { class: "tabbar" });
  const content = el("div", {});
  const buttons: HTMLButtonElement[] = [];

  TABS.forEach(([name, mount], i) => {
    const b = el("button", {}, name);
    b.addEventListener("click", () => {
      buttons.forEach((x) => x.classList.remove("active"));
      b.classList.add("active");
      mount(content);
    });
    buttons.push(b);
    bar.append(b);
    if (i === 0) { b.classList.add("active"); mount(content); }
  });

  shell.append(bar, content);
  root.append(shell);
}
