// Assoziationsketten: Rückprojektion aus dem Studio-Text durch jede Form.
import { el, button, select, field } from "./dom";
import { icon } from "./icons";
import { extractSeeds, buildAllChains, type Chain } from "../generation/assoc";
import { addToTreasury } from "../features/treasury";
import { openReader } from "./reader";

const lastText = (): string => { try { return localStorage.getItem("dm_last_text") || ""; } catch { return ""; } };
const joinLinks = (c: Chain, arrow = " → ", jumpArrow = " ⇢ "): string =>
  c.links.map((w, i) => (i === 0 ? w : (i === c.jumpAt ? jumpArrow : arrow) + w)).join("");
const chainText = (c: Chain): string => `${c.label}: ${joinLinks(c)}`;

export function mountAssoc(root: HTMLElement): void {
  root.innerHTML = "";
  const wrap = el("div", {});

  const src = el("textarea", { class: "out", rows: "6", placeholder: "Studio-Text — Grundlage der Rückprojektion.", style: "width:100%" }) as HTMLTextAreaElement;
  src.value = lastText();

  const seedSel = select("as-seed", [["", "— Saatwort —"]]);
  const rebuildSeeds = (): void => {
    const seeds = extractSeeds(src.value);
    seedSel.innerHTML = "";
    const add = (v: string, l: string): void => { const o = document.createElement("option"); o.value = v; o.textContent = l; seedSel.appendChild(o); };
    if (!seeds.length) { add("", "— kein Text —"); return; }
    seeds.forEach((s) => add(s, s));
    seedSel.value = seeds[0]!;
  };
  const fetchBtn = button("Letzten Studio-Text holen");
  fetchBtn.addEventListener("click", () => { src.value = lastText(); rebuildSeeds(); });
  src.addEventListener("input", rebuildSeeds);

  const diceBtn = el("button", {}, icon("dice"), " Saatwort würfeln");
  diceBtn.addEventListener("click", () => {
    const n = seedSel.options.length;
    if (n) seedSel.selectedIndex = Math.floor(Math.random() * n);
    render();
  });

  const lenIn = el("input", { type: "range", min: "4", max: "10", step: "1", value: "6" }) as HTMLInputElement;
  const lenVal = el("span", { class: "muted" }, "6");
  lenIn.addEventListener("input", () => { lenVal.textContent = lenIn.value; });

  const list = el("div", {});
  let current: Chain[] = [];

  const render = (): void => {
    const seed = seedSel.value.trim();
    list.innerHTML = "";
    if (!seed) { list.append(el("p", { class: "muted" }, "Kein Saatwort — erst einen Studio-Text holen.")); return; }
    current = buildAllChains(seed, src.value, parseInt(lenIn.value, 10) || 6);
    for (const c of current) {
      const line = el("p", { class: "idea-text" }, joinLinks(c, "  →  ", "  ⇢  "));
      const toStudio = button("→ Studio");
      toStudio.addEventListener("click", () => {
        const L = c.links;
        try {
          localStorage.setItem("dm_pending_ctx", JSON.stringify({
            who: L[0] || "", where: L[1] || "", when: L[2] || "", what: L.slice(3).join(", ") || L[1] || "",
          }));
        } catch { /* voll */ }
        const st = [...document.querySelectorAll(".tabbar button")].find((b) => b.textContent === "Studio") as HTMLButtonElement | undefined;
        if (st) st.click();
      });
      const copy = button("Kopieren");
      copy.addEventListener("click", () => {
        void navigator.clipboard?.writeText(chainText(c));
        const o = copy.textContent; copy.textContent = "Kopiert ✓"; setTimeout(() => (copy.textContent = o), 1200);
      });
      const keepInfo = el("span", { class: "muted" }, "");
      const keep = el("button", {}, icon("star"), " Merken");
      keep.addEventListener("click", () => {
        const n = addToTreasury(chainText(c), {});
        keepInfo.textContent = n < 0 ? "schon vorhanden" : `gemerkt (${n})`;
        setTimeout(() => (keepInfo.textContent = ""), 2000);
      });
      list.append(el("div", { class: "idea" },
        el("p", { class: "field-label" }, c.label),
        line,
        el("div", { class: "btnrow" }, toStudio, copy, keep, keepInfo)));
    }
  };

  const goBtn = el("button", { class: "primary" }, icon("refresh"), " Ketten erzeugen");
  goBtn.addEventListener("click", render);
  const readBtn = el("button", {}, icon("book"), " Lesemodus");
  readBtn.addEventListener("click", () => {
    if (current.length) openReader(current.map(chainText).join("\n\n"));
  });

  rebuildSeeds();
  wrap.append(
    el("h3", {}, "Assoziationskette"),
    el("p", { class: "muted" }, "Rückprojektion: Ein Wort aus dem Studio-Text läuft durch jede Form. Prosa bleibt im Text und wandert über gemeinsame Sätze weiter; Reim assoziiert über den Klang; Haiku, Gedicht-Strang und Multi-Shot ziehen in ihren eigenen Bildwortschatz ab. Ein ⇢ bedeutet: Hier gibt es keinen echten Reim, die Kette springt über die Vokalverwandtschaft in eine Reimfamilie."),
    src,
    el("div", { class: "btnrow" }, fetchBtn),
    el("div", { class: "grid2" }, field("Saatwort", seedSel), field("Kettenlänge", el("div", { class: "chkrow" }, lenIn, " ", lenVal))),
    el("div", { class: "btnrow" }, goBtn, diceBtn, readBtn),
    list,
  );
  root.append(wrap);
  render();
}
