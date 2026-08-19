// Bildwelt: Was sich aus Bildern angesammelt hat.
//
// Der Reiter ist zum Ansehen, Filtern und Wegwerfen da, nicht zum Sammeln —
// gesammelt wird im Sammler. Getrennt, weil es zwei Tätigkeiten sind: Material
// beschaffen und Material übersehen.
//
// Er steht an der Stelle, an der die Montage stand. Kein vierzehnter Reiter:
// Einen hinzuzufügen ist einzeln immer vertretbar und ergibt in Summe eine
// unbenutzbare Leiste.
import { el, button } from "./dom";
import { icon } from "./icons";
import { appendToPersistentCorpus, loadPersistentCorpus } from "../corpus";
import {
  modi as alleModi, ladeBildwelt, sichereBildwelt, etikettenStand, filtere,
  baueBank, BILDWELT_DECKEL, type Bildernte,
} from "../features/bildwelt";

export function mountBildwelt(root: HTMLElement): void {
  root.innerHTML = "";
  const wrap = el("div", {});
  let ernten = ladeBildwelt();
  let modusFilter: string[] = [];
  let etikettFilter: string[] = [];

  const stand = el("p", { class: "muted" }, "");
  const filterModi = el("div", { class: "btnrow" });
  const filterTags = el("div", { class: "chips" });
  const bankAnzeige = el("div", {});
  const status = el("span", { class: "muted mini" }, "");

  const zeichneFilter = (): void => {
    filterModi.innerHTML = "";
    for (const m of alleModi()) {
      const n = ernten.filter((e) => e.modus === m.id).length;
      if (!n) continue;
      const b = el("button", { class: "toggle" + (modusFilter.includes(m.id) ? " on" : ""), type: "button" },
        `${m.label} (${n})`) as HTMLButtonElement;
      b.addEventListener("click", () => {
        modusFilter = modusFilter.includes(m.id) ? modusFilter.filter((x) => x !== m.id) : [...modusFilter, m.id];
        zeichne();
      });
      filterModi.append(b);
    }
    filterTags.innerHTML = "";
    for (const t of etikettenStand(ernten)) {
      const an = etikettFilter.some((x) => x.toLowerCase() === t.name.toLowerCase());
      const b = el("button", { class: "tchip" + (an ? " on" : ""), type: "button" },
        `${t.name} (${t.n})`) as HTMLButtonElement;
      b.addEventListener("click", () => {
        etikettFilter = an
          ? etikettFilter.filter((x) => x.toLowerCase() !== t.name.toLowerCase())
          : [...etikettFilter, t.name];
        zeichne();
      });
      filterTags.append(b);
    }
  };

  const wortReihe = (titel: string, woerter: string[]): HTMLElement => {
    const k = el("div", { style: "margin:10px 0" },
      el("p", { class: "mini", style: "margin:0 0 4px" }, el("b", {}, `${titel} (${woerter.length})`)));
    const c = el("div", { class: "chips" });
    // Nicht alles auf einmal: Bei zweihundert Bildern stehen hier schnell
    // tausend Wörter, und eine Wand aus Wörtern liest niemand.
    const zeigen = woerter.slice(0, 120);
    for (const w of zeigen) c.append(el("span", { class: "tchip" }, w));
    if (woerter.length > zeigen.length) {
      c.append(el("span", { class: "muted mini" }, `… und ${woerter.length - zeigen.length} weitere`));
    }
    k.append(c);
    return k;
  };

  const zeichne = (): void => {
    ernten = ladeBildwelt();
    zeichneFilter();
    const gewaehlt = filtere(ernten, { modi: modusFilter, etiketten: etikettFilter });
    const bank = baueBank(gewaehlt);
    const bilder = new Set(gewaehlt.map((e) => e.abdruck)).size;

    stand.textContent = ernten.length
      ? `${ernten.length} Lesungen aus ${new Set(ernten.map((e) => e.abdruck)).size} Bildern`
        + (gewaehlt.length !== ernten.length ? ` · Auswahl: ${gewaehlt.length} Lesungen aus ${bilder} Bildern` : "")
        + ` · ${bank.nomen.length} Substantive, ${bank.verben.length} Verben, ${bank.bilder.length} Fügungen`
      : "Noch nichts gelesen. Im Reiter „Sammler“ unter „Bilder als Material“ Blickwinkel wählen und Bilder lesen.";

    bankAnzeige.innerHTML = "";
    if (!gewaehlt.length) {
      if (ernten.length) bankAnzeige.append(el("p", { class: "muted" }, "Diese Auswahl ist leer."));
      return;
    }
    bankAnzeige.append(
      wortReihe("Substantive", bank.nomen),
      wortReihe("Verben", bank.verben),
      wortReihe("Fügungen", bank.bilder),
    );
  };

  // Die Bank in den Korpus: eine Wortliste, kein Text. Das ist Absicht — die
  // Fügungen sind Bausteine, und die Maschine soll sie verbinden, nicht ein
  // Modell im Voraus.
  const korpusBtn = el("button", { class: "primary" }, icon("arrowRight"), " Auswahl in den Korpus") as HTMLButtonElement;
  korpusBtn.addEventListener("click", () => {
    const bank = baueBank(filtere(ernten, { modi: modusFilter, etiketten: etikettFilter }));
    const text = [...bank.bilder, ...bank.nomen, ...bank.verben].join(". ");
    if (!text.trim()) return;
    const vorher = loadPersistentCorpus().length;
    appendToPersistentCorpus(text);
    status.textContent = `Übernommen — Korpus ${vorher} → ${loadPersistentCorpus().length} Zeichen.`;
  });

  const wegBtn = button("Auswahl löschen", "danger");
  wegBtn.addEventListener("click", () => {
    const gewaehlt = filtere(ernten, { modi: modusFilter, etiketten: etikettFilter });
    if (!gewaehlt.length) return;
    if (!confirm(`${gewaehlt.length} Lesungen löschen? Die Bilder selbst sind nicht betroffen — sie liegen ohnehin nicht hier.`)) return;
    const raus = new Set(gewaehlt.map((e: Bildernte) => e.abdruck + "#" + e.modus));
    const rest = ernten.filter((e) => !raus.has(e.abdruck + "#" + e.modus));
    if (!sichereBildwelt(rest)) { status.textContent = "Löschen fehlgeschlagen."; return; }
    modusFilter = []; etikettFilter = [];
    zeichne();
    status.textContent = `${gewaehlt.length} Lesungen gelöscht.`;
  });

  const allesBtn = button("Filter zurücksetzen");
  allesBtn.addEventListener("click", () => { modusFilter = []; etikettFilter = []; zeichne(); });

  wrap.append(
    el("h2", {}, "Bildwelt"),
    el("p", { class: "muted" },
      "Wortbänke aus deinen Bildern, gesammelt über viele Lesungen. Ein einzelnes Foto gibt "
      + "fünfzehn Substantive her — das trägt nichts. Erst über zweihundert Bilder wird daraus "
      + "ein Vorrat, aus dem sich schöpfen lässt."),
    el("p", { class: "muted mini" },
      "Die Bilder selbst liegen nicht hier und nirgends sonst in dieser App — sie werden zum "
      + "Lesen verschickt und nicht behalten. Was bleibt, sind diese Wörter."),
    stand,
    el("h3", { style: "margin:14px 0 4px" }, "Blickwinkel"),
    filterModi,
    el("h3", { style: "margin:14px 0 4px" }, "Etiketten"),
    filterTags,
    el("div", { class: "btnrow", style: "margin-top:10px" }, korpusBtn, allesBtn, wegBtn, status),
    bankAnzeige,
    el("p", { class: "muted mini", style: "margin-top:16px" },
      `Höchstens ${BILDWELT_DECKEL} Lesungen; darüber fällt die älteste heraus. `
      + "Die Bildwelt wandert mit der Projektdatei."),
  );
  root.append(wrap);
  zeichne();
}
