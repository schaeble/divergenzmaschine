// Textstruktur: woraus besteht ein Text? Gemeinsame Darstellung für den
// Diagnose-Tab und die Ansicht direkt unter dem Studio-Text.
import { el } from "./dom";
import { analysiereHerkunft, QUELLEN_LABEL, type QuellenId, type Schnappschuss } from "../features/sources";
import { loadZiele, saveZiele, type ZielQuelle } from "../features/knobs";

export function renderTextstruktur(text: string, snap: Schnappschuss | null): HTMLElement {
  const box = el("div", {});
  if (!text.trim()) { box.append(el("p", { class: "muted" }, "Noch kein Text erzeugt.")); return box; }
  const h = analysiereHerkunft(text, (snap?.tonId || snap?.ton || "neutral").toLowerCase(),
    { where: snap?.where, when: snap?.when, who: snap?.who, what: snap?.what });

  if (snap) {
    const chips = el("div", { class: "src-settings" });
    const paare: [string, string][] = [["Preset", snap.preset], ["Ton", snap.ton], ["Form", snap.form],
      ["Struktur", snap.struktur], ["Perspektive", snap.perspektive], ["Rhythmus", snap.rhythmus],
      ["Markov", snap.markov], ["Varianz", snap.varianz], ["Spannung", snap.spannung],
      ["Länge", String(snap.laenge)], ["Bestenauslese", snap.bestenauslese ? "an" : "aus"]];
    for (const [k, v] of paare) chips.append(el("span", { class: "src-chip" }, el("b", {}, k), " " + (v || "—")));
    box.append(chips);
    const w4 = el("div", { class: "src-4w" });
    ([["Wo", snap.where], ["Wann", snap.when], ["Wer", snap.who], ["Was", snap.what]] as [string, string][])
      .forEach(([k, v]) => w4.append(el("span", { class: "src-w" }, el("b", {}, k + ": "), v || "—")));
    box.append(w4);
  }

  const band = el("div", { class: "src-band" });
  let pos = 0;
  for (const seg of h.segmente) {
    if (seg.s > pos) band.append(el("span", { class: "src-seg q-vorlage", style: `flex:${seg.s - pos}` }));
    band.append(el("span", { class: "src-seg q-" + seg.quelle, style: `flex:${seg.e - seg.s}`,
      title: QUELLEN_LABEL[seg.quelle] + ": " + text.slice(seg.s, seg.e) }));
    pos = seg.e;
  }
  if (pos < text.length) band.append(el("span", { class: "src-seg q-vorlage", style: `flex:${text.length - pos}` }));
  box.append(el("div", { class: "muted mini" }, "Verlauf des Textes nach Herkunft:"), band);

  const bars = el("div", { class: "src-bars" });
  (Object.keys(QUELLEN_LABEL) as QuellenId[])
    .map((q) => [q, h.anteile[q]] as [QuellenId, number])
    .sort((a, b) => b[1] - a[1])
    .forEach(([q, v]) => bars.append(el("div", { class: "src-row anklickbar", role: "button", tabindex: "0",
      title: "Zeigt, was diesen Anteil steuert",
      onclick: undefined as unknown as string },
      el("span", { class: "src-name" }, QUELLEN_LABEL[q]),
      el("span", { class: "src-bar" }, el("span", { class: "src-fill q-" + q, style: `width:${Math.round(v * 100)}%` })),
      el("span", { class: "src-val" }, Math.round(v * 100) + " %"))));
  // ── A.3: Ziehbare Balken ───────────────────────────────────────────────
  // Vier Quellen haben eine reale Stellschraube dahinter — nur die sind ziehbar.
  // Gezogen wird ein ZIEL, kein Wert: Die Marke zeigt, was gewollt ist, der Balken,
  // was erreicht wurde. Wortbank bleibt Restgröße, der Rest bleibt Anzeige.
  const ZIEHBAR = new Set<string>(["vorlage", "dramaturgie", "ton", "kontext"]);
  const ziele = loadZiele();
  bars.querySelectorAll(".src-row").forEach((row, i) => {
    const qq = (Object.keys(QUELLEN_LABEL) as QuellenId[])
      .map((x) => [x, h.anteile[x]] as [QuellenId, number]).sort((a, b) => b[1] - a[1])[i]?.[0];
    if (!qq || !ZIEHBAR.has(qq)) return;
    const q = qq as ZielQuelle;
    const bar = row.querySelector(".src-bar") as HTMLElement | null;
    if (!bar) return;
    row.classList.add("ziehbar");
    const marke = el("span", { class: "src-ziel" });
    const setzeMarke = (): void => {
      const z = ziele[q];
      if (z === undefined) { marke.style.display = "none"; return; }
      marke.style.display = ""; marke.style.left = Math.max(0, Math.min(100, z)) + "%";
      marke.title = `Ziel ${z} % — erreicht ${(h.anteile[q] * 100).toFixed(0)} %`;
    };
    bar.append(marke); setzeMarke();
    let zieht = false;
    const ausX = (x: number): number => {
      const r = bar.getBoundingClientRect();
      return Math.round(Math.max(0, Math.min(100, ((x - r.left) / Math.max(1, r.width)) * 100)) / 5) * 5;
    };
    bar.addEventListener("pointerdown", (e) => {
      const ev = e as PointerEvent; zieht = true;
      bar.setPointerCapture(ev.pointerId); ev.preventDefault(); ev.stopPropagation();
      ziele[q] = ausX(ev.clientX); setzeMarke();
    });
    bar.addEventListener("pointermove", (e) => {
      if (!zieht) return; ziele[q] = ausX((e as PointerEvent).clientX); setzeMarke();
    });
    const ende = (e: Event): void => {
      if (!zieht) return; zieht = false;
      try { bar.releasePointerCapture((e as PointerEvent).pointerId); } catch { /* egal */ }
      saveZiele(ziele);
      document.dispatchEvent(new CustomEvent("dm-ziel", { detail: { quelle: q, ziel: ziele[q] } }));
    };
    bar.addEventListener("pointerup", ende);
    bar.addEventListener("pointercancel", ende);
    bar.addEventListener("dblclick", (e) => {
      e.stopPropagation(); delete ziele[q]; saveZiele(ziele); setzeMarke();
      document.dispatchEvent(new CustomEvent("dm-ziel", { detail: { quelle: q, ziel: undefined } }));
    });
  });
  bars.querySelectorAll(".src-row").forEach((row, i) => {
    const q = (Object.keys(QUELLEN_LABEL) as QuellenId[])
      .map((x) => [x, h.anteile[x]] as [QuellenId, number]).sort((a, b) => b[1] - a[1])[i]?.[0];
    if (!q) return;
    const los = (): void => { document.dispatchEvent(new CustomEvent("dm-quelle", { detail: q })); };
    row.addEventListener("click", los);
    row.addEventListener("keydown", (e) => {
      const k = (e as KeyboardEvent).key;
      if (k === "Enter" || k === " ") { e.preventDefault(); los(); }
    });
  });
  box.append(bars);

  // Ehrlichkeit der Anzeige: gemessen oder geschätzt, und was dabei untergeht.
  if (h.exakt) {
    box.append(el("p", { class: "muted mini" },
      el("b", {}, "Gemessen. "),
      "Die Anteile stammen aus der Bauspur — für jeden Baustein ist bekannt, woher er kommt. "
      + "„Vorlagen“ ist hier eine echte Größe, keine Restmenge. „Nachbearbeitung“ ist das, was nach dem "
      + "Zusammenbau hinzukommt: Ton-Sätze, Verfugung, Perspektive. Lebendige Pools und Markov stehen auf 0 %, "
      + "weil der Rekombinations-Assembler sie noch nicht als Quelle führt. Im Farbband bleibt unmarkiert, "
      + "was sich im Endtext nicht wörtlich wiederfinden lässt — Vorlagentext, Nachbearbeitung und Bausteine, "
      + "die durch Perspektive oder Glättung umgeschrieben wurden."));
  } else {
    box.append(el("p", { class: "muted mini" },
      el("b", {}, "Geschätzt. "),
      "Die Anteile entstehen durch Abgleich des fertigen Textes mit den Quelllisten. "
      + "„Vorlagen/Schablonen“ ist dabei die Restgröße: alles, was keiner Liste zugeordnet werden konnte — "
      + "feste Satzgerüste, Verbindungswörter und die Nachbearbeitung. Diese Zahl ist also eine Obergrenze."));
  }
  if (h.poolUeberschneidung > 0.02) {
    box.append(el("p", { class: "muted mini" },
      `Hinweis zu den Pools: ${Math.round(h.poolUeberschneidung * 100)} % ihrer Einträge stehen wörtlich auch in der Wortbank `
      + "und werden dort gezählt. Der ausgewiesene Pool-Anteil ist deshalb der ausschließliche Beitrag, nicht der gesamte."));
  }
  return box;
}
