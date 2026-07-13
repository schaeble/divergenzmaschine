// Kleine DOM-Helfer für die UI-Module.
export function el<K extends keyof HTMLElementTagNameMap>(
  tag: K, attrs: Record<string, string> = {}, ...kids: (Node | string)[]
): HTMLElementTagNameMap[K] {
  const e = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === "class") e.className = v; else e.setAttribute(k, v);
  }
  for (const kid of kids) e.append(kid);
  return e;
}

export type Opt = [string, string];

export function select(id: string, options: Opt[], value?: string): HTMLSelectElement {
  const s = el("select", { id, style: "width:100%;padding:6px;margin-top:2px" });
  for (const [v, label] of options) {
    const o = el("option", { value: v }, label);
    if (v === value) o.setAttribute("selected", "");
    s.append(o);
  }
  return s;
}

export function field(label: string, node: HTMLElement): HTMLElement {
  return el("label", { style: "display:block;font:12px system-ui;color:#555;margin:6px 0" }, label, node);
}

export function textInput(id: string, placeholder: string, val = ""): HTMLInputElement {
  return el("input", { id, placeholder, value: val, style: "width:100%;padding:6px;margin-top:2px" });
}

export function button(label: string, style = ""): HTMLButtonElement {
  return el("button", { style: "padding:8px 14px;margin:8px 8px 0 0;cursor:pointer;font:14px system-ui;" + style }, label);
}
