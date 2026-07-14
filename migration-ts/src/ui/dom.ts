// Kleine DOM-Helfer für die UI-Module (klassenbasiert, Styling via theme.css).
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
  const s = el("select", { id });
  for (const [v, label] of options) {
    const o = el("option", { value: v }, label);
    if (v === value) o.setAttribute("selected", "");
    s.append(o);
  }
  return s;
}

export function field(label: string, node: HTMLElement): HTMLElement {
  return el("label", { class: "field" }, label, node);
}

export function textInput(id: string, placeholder: string, val = ""): HTMLInputElement {
  return el("input", { id, placeholder, value: val });
}

export function button(label: string, variant = ""): HTMLButtonElement {
  return el("button", variant ? { class: variant } : {}, label);
}
