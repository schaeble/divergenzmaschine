// Tab-Gerüst: Studio · Wortbank · Korpus.
import { el } from "./dom";
import { mountStudio } from "./studio";
import { mountWordbank } from "./wordbankView";
import { mountKorpus } from "./korpusView";
import { mountIdeas } from "./ideasView";
import { mountWorld } from "./worldView";
import { mountOscilloscope } from "./oscilloscopeView";
import { mountKi } from "./kiView";

const TABS: [string, (root: HTMLElement) => void][] = [
  ["Studio", mountStudio],
  ["Ideen", mountIdeas],
  ["Welt", mountWorld],
  ["Wortbank", mountWordbank],
  ["Korpus", mountKorpus],
  ["Oszilloskop", mountOscilloscope],
  ["KI", mountKi],
];

export function mountApp(root: HTMLElement): void {
  root.innerHTML = "";
  const shell = el("div", { class: "app" });
  shell.append(el("h1", {}, "Divergenzmaschine"));

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
