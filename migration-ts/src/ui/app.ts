// Tab-Gerüst: Studio · Wortbank · Korpus.
import { el } from "./dom";
import { mountStudio } from "./studio";
import { mountWordbank } from "./wordbankView";
import { mountKorpus } from "./korpusView";

const TABS: [string, (root: HTMLElement) => void][] = [
  ["Studio", mountStudio],
  ["Wortbank", mountWordbank],
  ["Korpus", mountKorpus],
];

export function mountApp(root: HTMLElement): void {
  root.innerHTML = "";
  const shell = el("div", { style: "font-family:system-ui;max-width:900px;margin:0 auto;padding:1rem" });
  shell.append(el("h1", { style: "font-size:1.2rem" }, "Divergenzmaschine — TypeScript"));

  const bar = el("div", { style: "display:flex;gap:4px;border-bottom:1px solid #ddd;margin-bottom:8px" });
  const content = el("div", {});
  const buttons: HTMLButtonElement[] = [];

  TABS.forEach(([name, mount], i) => {
    const b = el("button", { style: "padding:8px 14px;border:0;background:none;cursor:pointer;font:14px system-ui;border-bottom:2px solid transparent" }, name);
    b.addEventListener("click", () => {
      buttons.forEach((x) => (x.style.borderBottomColor = "transparent"));
      b.style.borderBottomColor = "#333";
      mount(content);
    });
    buttons.push(b);
    bar.append(b);
    if (i === 0) { b.style.borderBottomColor = "#333"; mount(content); }
  });

  shell.append(bar, content);
  root.append(shell);
}
