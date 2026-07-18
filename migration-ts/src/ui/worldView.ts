// Welt-Tab: Figuren/Orte/Zeitleiste + Omnikognition (Wahrnehmungs-Modus).
import { el, button, select, textInput } from "./dom";
import { icon } from "./icons";
import { loadWorld, worldTick, worldFillContext, resetWorld } from "../features/world";
import { OMNI_PRESETS, OMNI_PRESET_LABELS, profileToStudio, buildOmniPrompt, type CognitiveProfile } from "../features/omnikognition";
import { loadAiKey, callClaude } from "../features/ki";
import { openReader } from "./reader";

type Chk = { v: string; box: HTMLInputElement; el: HTMLElement };
function chkGroup(opts: [string, string][]): Chk[] {
  return opts.map(([v, l]) => { const box = el("input", { type: "checkbox", value: v }) as HTMLInputElement; return { v, box, el: el("label", { class: "chk" }, box, " " + l) }; });
}
const readChk = (g: Chk[]): string[] => g.filter((c) => c.box.checked).map((c) => c.v);
const setChk = (g: Chk[], vals: string[]): void => g.forEach((c) => { c.box.checked = vals.includes(c.v); });

export function mountWorld(root: HTMLElement): void {
  root.innerHTML = "";
  const wrap = el("div", {});
  const cols = el("div", { class: "grid2" });
  const tl = el("div", {});
  const list = (title: string, items: string[]): HTMLElement =>
    el("div", {}, el("h3", {}, title), el("div", {}, ...(items.length ? items.map((i) => el("div", {}, i)) : [el("div", { class: "muted" }, "—")])));
  const render = (): void => {
    const w = loadWorld();
    cols.innerHTML = ""; cols.append(list("Figuren", w.figuren), list("Orte", w.orte));
    tl.innerHTML = ""; tl.append(el("h3", {}, `Zeitleiste (Tag ${w.tag})`), el("div", { class: "muted" }, ...w.timeline.slice(-12).reverse().map((t) => el("div", {}, t))));
  };
  const tickBtn = el("button", {}, icon("clock"), " Zeit vergeht");
  tickBtn.addEventListener("click", () => { worldTick(); render(); });
  const useBtn = button("In Generator übernehmen");
  useBtn.addEventListener("click", () => { const ctx = worldFillContext(); try { localStorage.setItem("dm_pending_ctx", JSON.stringify(ctx)); } catch { /* voll */ } alert(`Übernommen: ${ctx.who}, ${ctx.where}. Wechsle in den Studio-Tab.`); });
  const resetBtn = button("Welt zurücksetzen", "danger");
  resetBtn.addEventListener("click", () => { if (confirm("Welt wirklich zurücksetzen?")) { resetWorld(); render(); } });
  wrap.append(el("h2", {}, "Welt"), el("div", { class: "btnrow" }, tickBtn, useBtn, resetBtn), cols, tl);

  // ---- Omnikognition ----
  const nameIn = textInput("omni-name", "Name des Wesens", "");
  const presetSel = select("omni-preset", [["", "— eigenes —"], ...OMNI_PRESET_LABELS]);
  const channels = chkGroup([["licht", "Licht"], ["schall", "Schall"], ["geruch", "Gerüche"], ["efeld", "E-Feld"], ["magnet", "Magnet"], ["vibration", "Vibration"], ["temperatur", "Temperatur"]]);
  const fokus = chkGroup([["objekt", "Objekt"], ["bewegung", "Bewegung"], ["nahrung", "Nahrung"], ["feind", "Feind"], ["sozial", "Sozial"], ["muster", "Muster"]]);
  const ziel = chkGroup([["nahrung", "Nahrung"], ["fortpflanzung", "Fortpflanzung"], ["kooperation", "Kooperation"], ["revier", "Revier"], ["schwarm", "Schwarm"], ["ueberleben", "Überleben"]]);
  const dim = select("omni-dim", [["2d", "2D"], ["3d", "3D"]], "3d");
  const reach = select("omni-reach", [["nah", "Nahbereich"], ["fern", "Fernbereich"]], "nah");
  const medium = select("omni-medium", [["wasser", "Wasser"], ["luft", "Luft"], ["boden", "Boden"]], "luft");
  const zeit = select("omni-zeit", [["schnell", "schnell"], ["mittel", "mittel"], ["langsam", "langsam"]], "mittel");
  const aufl = select("omni-aufl", [["grob", "grob"], ["mittel", "mittel"], ["fein", "fein"]], "mittel");
  const ged = select("omni-ged", [["angeboren", "angeboren"], ["kurz", "kurzfristig"], ["lang", "langfristig"]], "kurz");
  const komm = select("omni-komm", [["sprache", "Sprache"], ["laut", "Laute"], ["duft", "Duft"], ["licht", "Licht"], ["efeld", "elektrisch"], ["chem", "chemisch"], ["beruehrung", "Berührung"]], "laut");
  const strat = select("omni-strat", [["reflex", "reflexartig"], ["instinkt", "instinktiv"], ["lern", "lernbasiert"], ["planend", "planend"]], "instinkt");
  const modell = select("omni-modell", [["kein", "kein Selbst"], ["schwach", "schwaches"], ["stark", "starkes"], ["verteilt", "verteilt"]], "schwach");

  const fld = (l: string, n: HTMLElement): HTMLElement => el("label", { class: "field" }, el("span", { class: "field-label" }, l), n);
  const grp = (l: string, g: Chk[]): HTMLElement => el("div", { class: "field" }, el("span", { class: "field-label" }, l), el("div", { class: "chkrow" }, ...g.map((c) => c.el)));

  const readProfile = (): CognitiveProfile => ({
    name: nameIn.value.trim(), channels: readChk(channels), dim: dim.value as "2d" | "3d", reach: reach.value as "nah" | "fern",
    medium: medium.value as "wasser" | "luft" | "boden", zeit: zeit.value as "schnell" | "mittel" | "langsam",
    aufloesung: aufl.value as "grob" | "mittel" | "fein", fokus: readChk(fokus), gedaechtnis: ged.value as "angeboren" | "kurz" | "lang",
    kommunikation: komm.value, strategie: strat.value as "reflex" | "instinkt" | "lern" | "planend",
    modell: modell.value as "kein" | "schwach" | "stark" | "verteilt", ziel: readChk(ziel),
  });
  const applyPreset = (id: string): void => {
    const p = OMNI_PRESETS[id]; if (!p) return;
    nameIn.value = p.name; setChk(channels, p.channels); setChk(fokus, p.fokus); setChk(ziel, p.ziel);
    dim.value = p.dim; reach.value = p.reach; medium.value = p.medium; zeit.value = p.zeit; aufl.value = p.aufloesung;
    ged.value = p.gedaechtnis; komm.value = p.kommunikation; strat.value = p.strategie; modell.value = p.modell;
  };
  presetSel.addEventListener("change", () => { if (presetSel.value) applyPreset(presetSel.value); });
  applyPreset("fledermaus"); presetSel.value = "fledermaus";

  const transferBtn = el("button", { class: "primary" }, icon("play"), " Ins Studio übertragen");
  transferBtn.addEventListener("click", () => {
    try { localStorage.setItem("dm_pending_studio", JSON.stringify(profileToStudio(readProfile()))); } catch { /* voll */ }
    const st = [...document.querySelectorAll(".tabbar button")].find((b) => b.textContent === "Studio") as HTMLButtonElement | undefined;
    if (st) st.click();
  });
  const kiOut = el("textarea", { class: "out", readonly: "", style: "min-height:160px;display:none" }) as HTMLTextAreaElement;
  const kiLbl = el("span", {}, "Von KI schreiben lassen");
  const kiBtn = el("button", {}, icon("flask"), " ", kiLbl);
  kiBtn.addEventListener("click", () => {
    void (async () => {
      if (!loadAiKey()) { kiOut.style.display = ""; kiOut.value = "Kein API-Schlüssel (im KI-Tab hinterlegen)."; return; }
      kiBtn.disabled = true; const old = kiLbl.textContent; kiLbl.textContent = "Sende an KI…"; kiOut.style.display = ""; kiOut.value = "…";
      try { kiOut.value = await callClaude(buildOmniPrompt(readProfile()), 2048); }
      catch (e) { kiOut.value = "Fehlgeschlagen: " + (e instanceof Error ? e.message : String(e)); }
      finally { kiBtn.disabled = false; kiLbl.textContent = old || "Von KI schreiben lassen"; }
    })();
  });
  const kiCopy = button("Kopieren"); kiCopy.addEventListener("click", () => { if (kiOut.value.trim()) void navigator.clipboard?.writeText(kiOut.value); });
  const kiRead = el("button", {}, icon("book"), " Lesemodus"); kiRead.addEventListener("click", () => { if (kiOut.value.trim()) openReader(kiOut.value); });

  wrap.append(
    el("hr", { style: "margin:18px 0" }),
    el("h2", {}, "Omnikognition — Wahrnehmungs-Modus"),
    el("p", { class: "muted" }, "Formt Perspektive, Rhythmus und Bildwelt eines Textes aus der Umwelt eines Lebewesens. Wähle ein Preset oder stelle die zehn Kriterien selbst ein."),
    el("div", { class: "grid2" }, fld("Preset", presetSel), fld("Name", nameIn)),
    grp("Sinneskanäle", channels),
    el("div", { class: "grid3" }, fld("Dimension", dim), fld("Reichweite", reach), fld("Medium", medium)),
    el("div", { class: "grid3" }, fld("Zeitwahrnehmung", zeit), fld("Auflösung", aufl), fld("Gedächtnis", ged)),
    grp("Aufmerksamkeitsfokus", fokus),
    el("div", { class: "grid3" }, fld("Kommunikation", komm), fld("Entscheidung", strat), fld("Selbst-/Umweltmodell", modell)),
    grp("Lebensziel", ziel),
    el("div", { class: "btnrow" }, transferBtn, kiBtn),
    el("div", { class: "btnrow" }, kiCopy, kiRead),
    kiOut,
  );

  root.append(wrap);
  render();
}
