// Tab-Gerüst: Studio · Wortbank · Korpus.
import { el } from "./dom";
import { VERSION } from "../version";
import { exportProject, importProject } from "../features/project";
import { icon } from "./icons";
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
  const header = el("div", { class: "apphead" },
    el("h1", { class: "apptitle" }, "Divergenzmaschine", el("span", { class: "ver", title: "Build-Version" }, "v" + VERSION)),
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
