// Oszilloskop-Tab: (1) Satzrhythmus eines Textes messen, (2) Rhythmus-Transplantation:
// eine Kurve steuert die Generierung (Kurve -> Text), aus Vorbild-Texten ablesbar.
import { el, button, select } from "./dom";
import { icon } from "./icons";
import { analyze, buildSVG, buildSVG2 } from "../features/oscilloscope";
import { loadTreasury, addToTreasury } from "../features/treasury";
import { loadBank } from "../storage";
import { buildModelFromCorpus } from "../corpus";
import { generateToCurve, curveFromText, CURVE_PRESETS } from "../generation/rhythmcurve";
import { loadCurves, saveCurve, deleteCurve } from "../features/rhythm";
import type { GenInput } from "../types";

const fmt = (x: number, d = 1): string => x.toFixed(d);

export function mountOscilloscope(root: HTMLElement): void {
  root.innerHTML = "";
  const wrap = el("div", {});

  // ═══ 1) Messen (Text -> Kurve) ═══
  const ta = el("textarea", { style: "height:120px" }) as HTMLTextAreaElement;
  ta.value = (() => { try { return localStorage.getItem("dm_last_text") || ""; } catch { return ""; } })();
  const viz = el("div", {});
  const stats = el("div", { class: "card" });

  const run = (): void => {
    const m = analyze(ta.value);
    viz.innerHTML = buildSVG(m.wave);
    stats.innerHTML = [
      ["Ø Satzlänge", fmt(m.avgLen), ""], ["Streuung σ", fmt(m.stdLen), ""],
      ["Lexikalische Vielfalt", fmt(m.ttr * 100), "%"], ["Wiederholungsdichte", fmt(m.repetitionRatio * 100), "%"],
      ["Interpunktionsdichte", fmt(m.punctDensity * 100), ""],
    ].map(([l, v, u]) => `<div style="display:flex;justify-content:space-between;border-bottom:1px solid #2a2f38;padding:4px 0"><span>${l}</span><b>${v}${u}</b></div>`).join("");
  };
  const runBtn = button("Analysieren");
  runBtn.addEventListener("click", run);
  const treasures = loadTreasury().slice().reverse();
  const trLabel = el("span", { class: "muted" });
  const trSlider = el("input", { id: "osz-treasure", type: "range", min: "0", max: String(Math.max(0, treasures.length - 1)), step: "1", value: "0", style: "flex:1" }) as HTMLInputElement;
  const loadTreasureAt = (): void => {
    const i = parseInt(trSlider.value, 10);
    const it = treasures[i];
    if (!it) return;
    ta.value = it.t;
    trLabel.textContent = `${i + 1}/${treasures.length}${it.who ? " · " + it.who : ""}${it.d ? " · " + it.d : ""}`;
    run();
  };
  trSlider.addEventListener("input", loadTreasureAt);
  const trRow = treasures.length
    ? el("label", { class: "field lenrow" }, "Schatzkammer ", trSlider, " ", trLabel)
    : el("p", { class: "muted" }, "Schatzkammer leer — im Studio Texte mit ⭐ Merken sichern.");
  const pullBtn = el("button", {}, icon("refresh"), " aus Generator");
  pullBtn.addEventListener("click", () => {
    const last = (() => { try { return localStorage.getItem("dm_last_text") || ""; } catch { return ""; } })();
    if (!last.trim()) { stats.innerHTML = '<span class="muted">Noch kein generierter Text — erst im Studio generieren.</span>'; return; }
    ta.value = last; run();
  });
  wrap.append(el("p", { class: "muted" }, "Kanal A — Text analysieren (vorbelegt mit der letzten Generierung)"), ta, el("div", { class: "btnrow" }, runBtn, pullBtn), trRow, viz, stats);

  // ═══ 2) Rhythmus-Transplantation (Kurve -> Text) ═══
  wrap.append(el("hr", {}));
  wrap.append(el("h2", {}, "Rhythmus-Transplantation"));
  wrap.append(el("p", { class: "muted" }, "Eine Satzlängen-Kurve steuert die Generierung: aus dem Text oben abgelesen oder als Muster gewählt. Das Vokabular kommt aus der aktiven Wortbank — jedes Preset schreibt im Atem eines fremden Textes. Rhythmus (Form) und Wortmaterial (Inhalt) werden getrennte Achsen."));

  let curve: number[] = CURVE_PRESETS[2]!.curve.slice(); // Default: Wechselatem
  let curveName = "Wechselatem";
  const curveInfo = el("div", { class: "muted", style: "margin:6px 0" });
  const updCurveInfo = (): void => {
    const avg = curve.length ? curve.reduce((a, b) => a + b, 0) / curve.length : 0;
    curveInfo.textContent = curve.length
      ? `Ziel-Kurve „${curveName}“: ${curve.length} Sätze · Ø ${avg.toFixed(1)} Wörter · [${curve.join(", ")}]`
      : "Keine Ziel-Kurve gewählt.";
  };
  const setCurve = (c: number[], name: string): void => {
    curve = c.map((n) => Math.max(1, Math.round(n))); curveName = name; updCurveInfo();
  };

  // Quelle: aus Text oben ablesen + Preset-Kurven
  const readBtn = button("Kurve aus Text oben ablesen");
  readBtn.addEventListener("click", () => {
    const c = curveFromText(ta.value);
    if (c.length < 2) { curveInfo.textContent = "Text oben zu kurz — mindestens 2 Sätze nötig."; return; }
    setCurve(c, "aus Vorbild-Text");
  });
  const presetRow = el("div", { class: "btnrow" }, el("span", { class: "muted" }, "Muster:"));
  CURVE_PRESETS.forEach((p) => {
    const b = button(p.label);
    b.addEventListener("click", () => setCurve(p.curve, p.label));
    presetRow.append(b);
  });

  // Gespeicherte Kurven
  const savedSel = el("select", { id: "osz-saved" }) as HTMLSelectElement;
  const refreshSaved = (): void => {
    savedSel.innerHTML = "";
    const list = loadCurves();
    if (!list.length) { savedSel.append(el("option", { value: "" }, "— keine gespeichert —")); savedSel.disabled = true; return; }
    savedSel.disabled = false;
    list.forEach((c) => savedSel.append(el("option", { value: c.name }, `${c.name} (${c.curve.length})`)));
  };
  refreshSaved();
  const loadSavedBtn = button("Laden");
  loadSavedBtn.addEventListener("click", () => {
    const c = loadCurves().find((x) => x.name === savedSel.value);
    if (c) setCurve(c.curve, c.name);
  });
  const delSavedBtn = button("Löschen", "danger");
  delSavedBtn.addEventListener("click", () => { if (savedSel.value) { deleteCurve(savedSel.value); refreshSaved(); } });
  const saveBtn = button("Aktuelle Kurve speichern");
  saveBtn.addEventListener("click", () => {
    if (!curve.length) return;
    const name = prompt("Name für diese Kurve (z. B. „Kleist“):", curveName === "aus Vorbild-Text" ? "" : curveName);
    if (name && name.trim()) { saveCurve(name.trim(), curve); refreshSaved(); curveName = name.trim(); updCurveInfo(); }
  });

  // Generierungs-Parameter
  const toneSel = select("osz-tone", [["neutral", "Neutral"], ["mystery", "Mystery"], ["poetic", "Poetisch"], ["melancholisch", "Melancholisch"], ["dark", "Düster"], ["nuechtern", "Nüchtern"], ["ironisch", "Ironisch"]], "neutral");
  const markSel = select("osz-markov", [["off", "Markov: Aus"], ["mix", "Markov: Mix"], ["on", "Markov: Stark"]], "off");
  const genBtn = el("button", { class: "primary" }, icon("play"), " Gegen Kurve generieren");
  const outPre = el("pre", { class: "out", style: "min-height:60px" });
  const sollIst = el("div", {});
  const genInfo = el("div", { class: "muted", style: "margin:6px 0" });

  const baseInput = (): GenInput => ({
    where: "", when: "", who: "", what: "",
    tone: toneSel.value, varLevel: "wild", form: "prose",
    structure: "auto", mode: "auto", perspective: "auto",
    rhythm: "auto", markovMode: markSel.value, disruptor: "off",
    archetypeA: "neutral", archetypeB: "neutral", instability: 0,
    polish: false, polishStyle: "surreal", lenTarget: 110,
  });

  genBtn.addEventListener("click", () => {
    if (curve.length < 2) { genInfo.textContent = "Erst eine Ziel-Kurve wählen (ablesen oder Muster)."; return; }
    genBtn.setAttribute("disabled", "");
    outPre.textContent = "… generiere gegen die Kurve …";
    setTimeout(() => {
      try {
        const model = markSel.value !== "off" ? buildModelFromCorpus(2) : undefined;
        const r = generateToCurve(loadBank(), baseInput(), model, curve, 6);
        outPre.textContent = r.text;
        sollIst.innerHTML = buildSVG2(r.targets, r.actual);
        const mae = r.targets.length ? r.targets.map((t, i) => Math.abs(t - (r.actual[i] ?? 0))).reduce((a, b) => a + b, 0) / r.targets.length : 0;
        genInfo.textContent = `${r.targets.length} Sätze · mittlere Abweichung ${mae.toFixed(1)} Wörter · Kandidaten-Pool ${r.poolSize}`;
        try { localStorage.setItem("dm_last_text", r.text); } catch { /* voll */ }
      } catch (e) {
        outPre.textContent = "Fehler: " + (e instanceof Error ? e.message : String(e));
      } finally { genBtn.removeAttribute("disabled"); }
    }, 10);
  });

  const copyBtn = button("Kopieren");
  copyBtn.addEventListener("click", () => { void navigator.clipboard?.writeText(outPre.textContent || ""); });
  const keepLbl = el("span", {}, "Merken");
  const keepBtn = el("button", {}, icon("star"), " ", keepLbl);
  keepBtn.addEventListener("click", () => {
    const n = addToTreasury(outPre.textContent || "", { form: "prose" });
    keepLbl.textContent = n < 0 ? "— leer/schon drin" : `Gemerkt (${n})`;
    setTimeout(() => (keepLbl.textContent = "Merken"), 1400);
  });
  const toStudioBtn = el("button", {}, icon("arrowRight"), " ins Studio");
  toStudioBtn.addEventListener("click", () => {
    const txt = outPre.textContent || ""; if (!txt.trim()) return;
    try { localStorage.setItem("dm_pending_text", txt); } catch { /* voll */ }
    const st = [...document.querySelectorAll(".tabbar button")].find((b) => b.textContent === "Studio") as HTMLButtonElement | undefined;
    if (st) st.click();
  });

  updCurveInfo();
  wrap.append(
    el("div", { class: "btnrow" }, readBtn, saveBtn),
    presetRow,
    el("label", { class: "field lenrow" }, "Gespeichert ", savedSel, " ", loadSavedBtn, " ", delSavedBtn),
    curveInfo,
    el("div", { class: "btnrow" }, toneSel, markSel, genBtn),
    genInfo,
    sollIst,
    outPre,
    el("div", { class: "btnrow" }, copyBtn, keepBtn, toStudioBtn),
  );

  root.append(wrap);
  if (ta.value.trim()) run();
}
