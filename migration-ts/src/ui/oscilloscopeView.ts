// Oszilloskop-Tab: (1) Satzrhythmus eines Textes messen, (2) Rhythmus-Transplantation:
// eine Kurve steuert die Generierung (Kurve -> Text), aus Vorbild-Texten ablesbar.
import { el, button, select } from "./dom";
import { icon } from "./icons";
import { analyze, buildSVG, buildSVG2 } from "../features/oscilloscope";
import { loadTreasury, addToTreasury } from "../features/treasury";
import { loadBank } from "../storage";
import { getAllPresets, sortedPresetOptions, buildAutoMixBank, loadActiveBankLabel, AUTOMIX_ID } from "../wordbank";
import { buildModelFromCorpus } from "../corpus";
import { generateToCurve, curveFromText, CURVE_PRESETS } from "../generation/rhythmcurve";
import { loadCurves, saveCurve, deleteCurve } from "../features/rhythm";
import type { GenInput, Bank } from "../types";

const fmt = (x: number, d = 1): string => x.toFixed(d);

export function mountOscilloscope(root: HTMLElement): void {
  root.innerHTML = "";
  const wrap = el("div", {});
  const step = (n: number, title: string): HTMLElement =>
    el("div", { class: "oszstep" }, el("span", { class: "oszstepnum" }, String(n)), el("b", {}, title));
  // Wird später (nach Pad-Aufbau) auf loadIntoPad gesetzt: zeigt jede gewählte Kurve sofort im Pad.
  let syncPad: (arr: number[]) => void = () => {};

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
  const pasteBtn = el("button", {}, icon("copy"), " Einfügen");
  pasteBtn.addEventListener("click", () => {
    navigator.clipboard?.readText().then((t) => { if (t) { ta.value = t; run(); } })
      .catch(() => { stats.innerHTML = '<span class="muted">Einfügen nicht erlaubt — bitte im Feld mit Strg+V (bzw. ⌘V) einfügen.</span>'; });
  });
  const clearBtn = el("button", {}, "✕ Leeren");
  clearBtn.addEventListener("click", () => { ta.value = ""; viz.innerHTML = ""; stats.innerHTML = ""; });
  wrap.append(
    el("h2", {}, "Messen — Text → Kurve"),
    el("p", { class: "muted" }, "Kanal A: einen Text analysieren. Vorbelegt mit der letzten Generierung; für Fremdtexte (Kleist, Kafka …) einfügen."),
    ta,
    el("div", { class: "btnrow" }, runBtn, pasteBtn, clearBtn, pullBtn),
    trRow, viz, stats);

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
    syncPad(curve);
  });
  const presetRow = el("div", { class: "btnrow" }, el("span", { class: "muted" }, "Muster:"));
  CURVE_PRESETS.forEach((p) => {
    const b = button(p.label);
    b.addEventListener("click", () => { setCurve(p.curve, p.label); syncPad(curve); });
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
    if (c) { setCurve(c.curve, c.name); syncPad(curve); }
  });
  const delSavedBtn = button("Löschen", "danger");
  delSavedBtn.addEventListener("click", () => { if (savedSel.value) { deleteCurve(savedSel.value); refreshSaved(); } });
  const saveBtn = button("Aktuelle Kurve speichern");
  saveBtn.addEventListener("click", () => {
    if (!curve.length) return;
    const name = prompt("Name für diese Kurve (z. B. „Kleist“):", curveName === "aus Vorbild-Text" ? "" : curveName);
    if (name && name.trim()) { saveCurve(name.trim(), curve); refreshSaved(); curveName = name.trim(); updCurveInfo(); }
  });

  // ── Zeichen-Pad: Kurve mit Finger/Maus malen (v2) ──
  const PW = 600, PH = 220, pL = 30, pR = 10, pT = 10, pB = 26;
  const clampN = (v: number, lo: number, hi: number): number => Math.max(lo, Math.min(hi, v));
  let maxWords = 30;
  let rawPts: { x: number; y: number }[] = [];
  let drawing = false;

  const slotSl = el("input", { type: "range", min: "6", max: "20", step: "1", value: "10", style: "flex:1" }) as HTMLInputElement;
  const slotVal = el("span", { class: "muted" }, "10");
  const maxSl = el("input", { type: "range", min: "12", max: "100", step: "1", value: "30", style: "flex:1" }) as HTMLInputElement;
  const maxVal = el("span", { class: "muted" }, "30");
  const smoothChk = el("input", { type: "checkbox" }) as HTMLInputElement;
  const pad = el("div", { style: "border:1px solid var(--border2);border-radius:8px;overflow:hidden;touch-action:none;cursor:crosshair;user-select:none" });

  const xAtI = (i: number, n: number): number => pL + (n > 1 ? i / (n - 1) : 0) * (PW - pL - pR);
  const yAtV = (v: number): number => PH - pB - (v / maxWords) * (PH - pT - pB);
  const wordsAtY = (y: number): number => clampN(Math.round((PH - pB - y) / (PH - pT - pB) * maxWords), 2, maxWords);

  const gridSVG = (): string => {
    let g = "";
    for (let i = 0; i <= 4; i++) { const v = (maxWords / 4) * i, y = yAtV(v); g += `<line x1="${pL}" y1="${y.toFixed(1)}" x2="${PW - pR}" y2="${y.toFixed(1)}" stroke="#20242b"/><text x="${pL - 5}" y="${(y + 3).toFixed(1)}" font-size="9" fill="#888" text-anchor="end">${Math.round(v)}</text>`; }
    return g;
  };
  const paintGrid = (): void => {
    pad.innerHTML = `<svg viewBox="0 0 ${PW} ${PH}" width="100%" style="display:block;background:#0a0c10">${gridSVG()}<path class="fh" d="" fill="none" stroke="#5ad" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/><g class="dots"></g></svg>`;
  };
  paintGrid();
  const paintFh = (): void => {
    const p = pad.querySelector(".fh"); if (!p) return;
    p.setAttribute("d", rawPts.map((q, i) => (i ? "L" : "M") + q.x.toFixed(1) + "," + q.y.toFixed(1)).join(" "));
  };
  const paintDots = (words: number[]): void => {
    const g = pad.querySelector(".dots"); if (!g) return;
    const n = words.length;
    let s = `<path d="${words.map((w, i) => (i ? "L" : "M") + xAtI(i, n).toFixed(1) + "," + yAtV(w).toFixed(1)).join(" ")}" fill="none" stroke="#8b94a7" stroke-width="1.5" stroke-dasharray="4 3"/>`;
    words.forEach((w, i) => { s += `<circle cx="${xAtI(i, n).toFixed(1)}" cy="${yAtV(w).toFixed(1)}" r="3.5" fill="#5ad"/>`; });
    g.innerHTML = s;
  };

  const resample = (): number[] => {
    if (rawPts.length < 2) return [];
    const slots = parseInt(slotSl.value, 10);
    // Gezeichnete Linie an der exakten Slot-x-Position abtasten (bewahrt Spitzen,
    // im Gegensatz zum Bin-Mitteln, das Extreme flachdrückt).
    const pts = rawPts.slice().sort((a, b) => a.x - b.x);
    const yAtX = (sx: number): number => {
      if (sx <= pts[0]!.x) return pts[0]!.y;
      if (sx >= pts[pts.length - 1]!.x) return pts[pts.length - 1]!.y;
      for (let k = 0; k < pts.length - 1; k++) {
        const a = pts[k]!, b = pts[k + 1]!;
        if (sx >= a.x && sx <= b.x) { const t = b.x === a.x ? 0 : (sx - a.x) / (b.x - a.x); return a.y + (b.y - a.y) * t; }
      }
      return pts[pts.length - 1]!.y;
    };
    let words: number[] = [];
    for (let i = 0; i < slots; i++) { const sx = pL + (slots > 1 ? i / (slots - 1) : 0) * (PW - pL - pR); words.push(wordsAtY(yAtX(sx))); }
    if (smoothChk.checked && words.length >= 3) {
      words = words.map((_, i) => clampN(Math.round((words[Math.max(0, i - 1)]! + words[i]! + words[Math.min(words.length - 1, i + 1)]!) / 3), 2, maxWords));
    }
    return words;
  };
  const commit = (): void => { const w = resample(); if (w.length < 2) return; paintDots(w); setCurve(w, "gezeichnet"); };

  const toVB = (ev: PointerEvent): { x: number; y: number } => {
    const svg = pad.querySelector("svg")!; const r = svg.getBoundingClientRect();
    return { x: clampN((ev.clientX - r.left) / r.width * PW, pL, PW - pR), y: clampN((ev.clientY - r.top) / r.height * PH, pT, PH - pB) };
  };
  pad.addEventListener("pointerdown", (e) => { drawing = true; rawPts = [toVB(e)]; try { pad.setPointerCapture(e.pointerId); } catch { /* egal */ } paintFh(); e.preventDefault(); });
  pad.addEventListener("pointermove", (e) => { if (!drawing) return; rawPts.push(toVB(e)); paintFh(); });
  const endDraw = (): void => { if (!drawing) return; drawing = false; commit(); };
  pad.addEventListener("pointerup", endDraw);
  pad.addEventListener("pointercancel", endDraw);

  slotSl.addEventListener("input", () => { slotVal.textContent = slotSl.value; if (rawPts.length > 1) commit(); });
  maxSl.addEventListener("input", () => { maxWords = parseInt(maxSl.value, 10); maxVal.textContent = maxSl.value; paintGrid(); if (rawPts.length > 1) { paintFh(); commit(); } });
  smoothChk.addEventListener("change", () => { if (rawPts.length > 1) commit(); });
  const clearPad = button("Pad leeren");
  clearPad.addEventListener("click", () => { rawPts = []; paintGrid(); });
  // Jede gewählte Kurve (ablesen/Muster/gespeichert) sofort im Pad zeigen — editierbar.
  const loadIntoPad = (arr: number[]): void => {
    if (!arr.length) return;
    const cmax = Math.max(...arr);
    // Achse exakt auf die Kurve skalieren, damit das Pad dieselbe Form wie die Messung oben zeigt.
    maxWords = clampN(cmax + 2, 12, 100); maxSl.value = String(maxWords); maxVal.textContent = String(maxWords);
    slotSl.value = String(clampN(arr.length, 6, 20)); slotVal.textContent = slotSl.value;
    paintGrid();
    rawPts = arr.map((w, i) => ({ x: xAtI(i, arr.length), y: yAtV(w) }));
    paintFh(); paintDots(arr);
  };
  syncPad = loadIntoPad;
  if (curve.length) loadIntoPad(curve);  // Default-Kurve gleich anzeigen
  const drawWrap = el("div", {},
    el("p", { class: "muted", style: "margin:10px 0 4px" }, "Oder die Kurve zeichnen — mit Finger oder Maus über das Feld streichen:"),
    pad,
    el("label", { class: "field lenrow" }, "Sätze ", slotSl, " ", slotVal),
    el("label", { class: "field lenrow" }, "max. Wörter ", maxSl, " ", maxVal),
    el("label", { class: "chk" }, smoothChk, " glätten"),
  );

  // Generierungs-Parameter
  const toneSel = select("osz-tone", [["neutral", "Neutral"], ["mystery", "Mystery"], ["poetic", "Poetisch"], ["melancholisch", "Melancholisch"], ["dark", "Düster"], ["nuechtern", "Nüchtern"], ["ironisch", "Ironisch"]], "neutral");
  const markSel = select("osz-markov", [["off", "Markov: Aus"], ["mix", "Markov: Mix"], ["on", "Markov: Stark"]], "off");
  // Preset-Wahl fürs Generieren (Standard: aktive Wortbank; ohne den globalen Stand zu ändern)
  const presetSel = el("select", { id: "osz-preset" }) as HTMLSelectElement;
  presetSel.append(el("option", { value: "" }, `★ Aktive Wortbank (${loadActiveBankLabel() || "—"})`));
  for (const [v, l] of sortedPresetOptions()) presetSel.append(el("option", { value: v }, l));
  const bankForPreset = (id: string): Bank => {
    if (!id) return loadBank();
    if (id === AUTOMIX_ID) return buildAutoMixBank();
    const p = getAllPresets()[id];
    return p ? p.bank : loadBank();
  };
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
        const r = generateToCurve(bankForPreset(presetSel.value), baseInput(), model, curve, 8);
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
    step(1, "Ziel-Kurve wählen"),
    el("p", { class: "muted" }, "Aus dem Text oben ablesen, ein Muster nehmen oder eine gespeicherte laden — die Kurve erscheint sofort im Pad unten und lässt sich dort von Hand nachziehen."),
    el("div", { class: "btnrow" }, readBtn, saveBtn, clearPad),
    presetRow,
    el("label", { class: "field lenrow" }, "Gespeichert ", savedSel, " ", loadSavedBtn, " ", delSavedBtn),
    drawWrap,
    curveInfo,
    step(2, "Womit schreiben"),
    el("p", { class: "muted" }, "Preset liefert das Vokabular, Ton die Färbung. Figuren/Ort werden je Satz zufällig gewürfelt."),
    el("label", { class: "field lenrow" }, "Preset ", presetSel),
    el("div", { class: "btnrow" }, toneSel, markSel),
    step(3, "Erzeugen"),
    el("div", { class: "btnrow" }, genBtn),
    genInfo,
    sollIst,
    outPre,
    el("div", { class: "btnrow" }, copyBtn, keepBtn, toStudioBtn),
  );

  root.append(wrap);
  if (ta.value.trim()) run();
}
