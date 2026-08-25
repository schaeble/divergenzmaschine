// Assoziationsketten: Rückprojektion aus dem Studio-Text durch jede Form.
import { el, button, select, field } from "./dom";
import { icon } from "./icons";
import {
  extractSeeds, chainFor, setzeFort, verwirf, alsMotive, alsBilder,
} from "../generation/assoc";
import { loadBank, saveBank } from "../storage";
import { saveActiveBankLabel, loadActiveBankLabel } from "../wordbank";
import type { Bank } from "../types";
import { addToTreasury } from "../features/treasury";
import { openReader } from "./reader";

const lastText = (): string => { try { return localStorage.getItem("dm_last_text") || ""; } catch { return ""; } };

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
    neuBauen();
  });

  const lenIn = el("input", { type: "range", min: "4", max: "10", step: "1", value: "6" }) as HTMLInputElement;
  const lenVal = el("span", { class: "muted" }, "6");
  lenIn.addEventListener("input", () => { lenVal.textContent = lenIn.value; });

  const list = el("div", {});
  const info = el("p", { class: "muted mini" }, "");
  // EINE Kette statt sieben. Der Reiter baute bis 4.317 sieben nebeneinander,
  // eine je Form — eine Auslage, kein Werkzeug: Man waehlt nicht, man
  // betrachtet. Was fehlte, war nicht Auswahl, sondern BEWEGUNG.
  let kette: string[] = [];

  const render = (): void => {
    list.innerHTML = "";
    if (!kette.length) {
      list.append(el("p", { class: "muted" }, "Kein Saatwort — erst einen Studio-Text holen."));
      info.textContent = "";
      return;
    }
    // Jedes Glied ist ein Knopf: antippen heisst „von hier aus weiter". Der Weg
    // dorthin bleibt stehen, nur der Rest wird neu gezogen. Damit wird aus der
    // Liste eine Bewegung, und der Benutzer steuert statt zu betrachten.
    const zeile = el("p", { class: "idea-text" });
    kette.forEach((w, i) => {
      if (i) zeile.append(el("span", { class: "muted" }, "  →  "));
      const g = el("button", {
        class: "chip", title: "Von hier aus weitergehen (mit ⌥/Alt: dieses Glied verwerfen)",
      }, w);
      g.addEventListener("click", (ev) => {
        const e = ev as MouseEvent;
        kette = e.altKey ? verwirf(kette, i, src.value)
          : setzeFort(kette, i, src.value, parseInt(lenIn.value, 10) || 6);
        render();
      });
      zeile.append(g);
    });
    list.append(zeile);
    info.textContent = `${kette.length} Glieder · ein Glied antippen geht von dort aus weiter, `
      + "mit Alt-Taste verwirft es das Glied. Das Saatwort bleibt immer stehen.";

    const motive = alsMotive(kette);
    const bilder = alsBilder(kette);
    const bankInfo = el("span", { class: "muted mini" }, "");
    // DER AUSGANG, auf den es ankommt. „→ Studio" wirkt auf EINEN Text, die
    // Wortbank auf jeden kuenftigen — und Kettenglieder sind genau das, woraus
    // Motive und Bilder bestehen.
    const inBank = el("button", { class: "primary" }, icon("arrowRight"),
      ` ${motive.length} Motive + ${bilder.length} Bilder in die Wortbank`);
    inBank.disabled = !motive.length;
    inBank.addEventListener("click", () => {
      const b = loadBank();
      const neu: Bank = { ...b, motifs: [...(b.motifs || []), ...motive] } as Bank;
      const bank = neu as unknown as Record<string, string[]>;
      bank["images"] = [...((bank["images"] as string[]) || []), ...bilder];
      saveBank(neu);
      saveActiveBankLabel(loadActiveBankLabel() + " + Kette");
      bankInfo.textContent = `${motive.length + bilder.length} Einträge übernommen — sie wirken ab dem nächsten Text.`;
    });

    // „→ Studio" nur noch in EIN Feld. Vorher verteilte er die Glieder auf die
    // vier W — erstes als Wer, zweites als Wo, drittes als Wann. Eine Kette ist
    // aber eine Reihe von Assoziationen und kein Vierertupel; „Nebel" als Wer
    // ergibt Unsinn, und dann drueckt man den Knopf kein zweites Mal.
    const toStudio = button("→ Studio (als Was)");
    toStudio.addEventListener("click", () => {
      try {
        localStorage.setItem("dm_pending_ctx", JSON.stringify({ what: kette.join(", ") }));
      } catch { /* voll */ }
      const st = [...document.querySelectorAll(".tabbar button")].find((b) => b.textContent === "Studio") as HTMLButtonElement | undefined;
      if (st) st.click();
    });
    const copy = button("Kopieren");
    copy.addEventListener("click", () => {
      void navigator.clipboard?.writeText(kette.join(" → "));
      const o = copy.textContent; copy.textContent = "Kopiert ✓"; setTimeout(() => (copy.textContent = o), 1200);
    });
    const keepInfo = el("span", { class: "muted" }, "");
    const keep = el("button", {}, icon("star"), " Merken");
    keep.addEventListener("click", () => {
      const n = addToTreasury(kette.join(" → "), { form: "assoz" });
      keepInfo.textContent = n < 0 ? "schon vorhanden" : `gemerkt (${n})`;
      setTimeout(() => (keepInfo.textContent = ""), 2000);
    });
    list.append(
      el("div", { class: "btnrow", style: "margin-top:8px" }, inBank, bankInfo),
      el("div", { class: "btnrow" }, toStudio, copy, keep, keepInfo),
      el("p", { class: "muted mini" },
        motive.length
          ? `Beispiel: „${motive[0]}“ · „${bilder[0] || "—"}“`
          : "Für Motive braucht die Kette mindestens zwei großgeschriebene Glieder — sie führen die Nominalphrase an."),
    );
  };

  const neuBauen = (): void => {
    const seed = seedSel.value.trim();
    kette = seed ? chainFor("prose", seed, src.value, parseInt(lenIn.value, 10) || 6) : [];
    render();
  };

  const goBtn = el("button", { class: "primary" }, icon("refresh"), " Ketten erzeugen");
  goBtn.addEventListener("click", neuBauen);
  const readBtn = el("button", {}, icon("book"), " Lesemodus");
  readBtn.addEventListener("click", () => {
    if (kette.length) openReader(kette.join(" → "));
  });

  rebuildSeeds();
  wrap.append(
    el("h3", {}, "Assoziationskette"),
    el("p", { class: "muted" }, "Rückprojektion: Ein Wort aus dem Studio-Text wandert über gemeinsame Sätze weiter. Jedes Glied ist anklickbar — antippen geht von dort aus weiter, mit Alt-Taste verwirft es das Glied. Der Weg dorthin bleibt stehen. Der wichtigste Ausgang ist die Wortbank: Kettenglieder sind genau das, woraus Motive und Bilder bestehen, und dort wirken sie auf jeden künftigen Text statt auf einen einzigen."),
    src,
    el("div", { class: "btnrow" }, fetchBtn),
    el("div", { class: "grid2" }, field("Saatwort", seedSel), field("Kettenlänge", el("div", { class: "chkrow" }, lenIn, " ", lenVal))),
    el("div", { class: "btnrow" }, goBtn, diceBtn, readBtn),
    info,
    list,
  );
  root.append(wrap);
  render();
}
