// Welt-Tab: Omnikognition (Wahrnehmungs-Modus).
import { el, button, select, textInput } from "./dom";
import { icon } from "./icons";
import { OMNI_PRESETS, OMNI_PRESET_LABELS, profileToStudio, buildProfilePrompt, normalizeProfile, loadOmniUserPresets, saveOmniUserPreset, deleteOmniUserPreset, type CognitiveProfile } from "../features/omnikognition";
import { loadAiKey, callClaude, extractJson } from "../features/ki";

type Chk = { v: string; box: HTMLInputElement; el: HTMLElement };
function chkGroup(opts: [string, string][]): Chk[] {
  return opts.map(([v, l]) => { const box = el("input", { type: "checkbox", value: v }) as HTMLInputElement; return { v, box, el: el("label", { class: "chk" }, box, " " + l) }; });
}
const readChk = (g: Chk[]): string[] => g.filter((c) => c.box.checked).map((c) => c.v);
const setChk = (g: Chk[], vals: string[]): void => g.forEach((c) => { c.box.checked = vals.includes(c.v); });

export function mountWorld(root: HTMLElement): void {
  root.innerHTML = "";
  const wrap = el("div", {});

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
  const applyProfile = (p: CognitiveProfile): void => {
    nameIn.value = p.name; setChk(channels, p.channels); setChk(fokus, p.fokus); setChk(ziel, p.ziel);
    dim.value = p.dim; reach.value = p.reach; medium.value = p.medium; zeit.value = p.zeit; aufl.value = p.aufloesung;
    ged.value = p.gedaechtnis; komm.value = p.kommunikation; strat.value = p.strategie; modell.value = p.modell;
  };
  const delBtn = button("Preset löschen", "danger");
  const updDel = (): void => { delBtn.style.display = presetSel.value.startsWith("user:") ? "" : "none"; };
  const rebuildPresetSel = (): void => {
    const cur = presetSel.value;
    presetSel.innerHTML = "";
    const add = (v: string, l: string): void => { const o = document.createElement("option"); o.value = v; o.textContent = l; presetSel.appendChild(o); };
    add("", "— eigenes —");
    OMNI_PRESET_LABELS.forEach(([v, l]) => add(v, l));
    Object.entries(loadOmniUserPresets()).forEach(([id, pr]) => add(id, "★ " + (pr.name || id.replace("user:", ""))));
    presetSel.value = cur;
  };
  presetSel.addEventListener("change", () => {
    const v = presetSel.value;
    if (v.startsWith("user:")) { const p = loadOmniUserPresets()[v]; if (p) applyProfile(p); }
    else if (v) { const p = OMNI_PRESETS[v]; if (p) applyProfile(p); }
    updDel();
  });
  rebuildPresetSel();
  applyProfile(OMNI_PRESETS["fledermaus"]!); presetSel.value = "fledermaus"; updDel();

  const transferBtn = el("button", { class: "primary" }, icon("play"), " Ins Studio übertragen");
  transferBtn.addEventListener("click", () => {
    try { localStorage.setItem("dm_pending_studio", JSON.stringify(profileToStudio(readProfile()))); } catch { /* voll */ }
    const st = [...document.querySelectorAll(".tabbar button")].find((b) => b.textContent === "Studio") as HTMLButtonElement | undefined;
    if (st) st.click();
  });
  const profLbl = el("span", {}, "KI-Profil erzeugen");
  const profBtn = el("button", {}, icon("flask"), " ", profLbl);
  profBtn.addEventListener("click", () => {
    void (async () => {
      if (!loadAiKey()) { alert("Kein API-Schlüssel — bitte im KI-Tab hinterlegen."); return; }
      profBtn.disabled = true; const old = profLbl.textContent; profLbl.textContent = "Erzeuge…";
      try {
        const raw = await callClaude(buildProfilePrompt(nameIn.value.trim() || "ein Wesen"), 800);
        applyProfile(normalizeProfile(extractJson(raw), nameIn.value.trim() || "ein Wesen"));
        presetSel.value = ""; updDel();
      } catch (e) { alert("Fehlgeschlagen: " + (e instanceof Error ? e.message : String(e))); }
      finally { profBtn.disabled = false; profLbl.textContent = old || "KI-Profil erzeugen"; }
    })();
  });
  const saveBtn = button("Als Preset speichern");
  saveBtn.addEventListener("click", () => {
    const p = readProfile(); if (!p.name.trim()) { alert("Bitte einen Namen für das Wesen eintragen."); return; }
    const id = saveOmniUserPreset(p); rebuildPresetSel(); presetSel.value = id; updDel();
  });
  delBtn.addEventListener("click", () => { const v = presetSel.value; if (v.startsWith("user:")) { deleteOmniUserPreset(v); rebuildPresetSel(); presetSel.value = ""; updDel(); } });

  wrap.append(
    el("h2", {}, "Omnikognition — Wahrnehmungs-Modus"),
    el("p", { class: "muted" }, "Formt Perspektive, Rhythmus und Bildwelt eines Textes aus der Umwelt eines Lebewesens. Wähle ein Preset oder stelle die zehn Kriterien selbst ein."),
    el("div", { class: "grid2" }, fld("Preset", presetSel), fld("Name", nameIn)),
    grp("Sinneskanäle", channels),
    el("div", { class: "grid3" }, fld("Dimension", dim), fld("Reichweite", reach), fld("Medium", medium)),
    el("div", { class: "grid3" }, fld("Zeitwahrnehmung", zeit), fld("Auflösung", aufl), fld("Gedächtnis", ged)),
    grp("Aufmerksamkeitsfokus", fokus),
    el("div", { class: "grid3" }, fld("Kommunikation", komm), fld("Entscheidung", strat), fld("Selbst-/Umweltmodell", modell)),
    grp("Lebensziel", ziel),
    el("div", { class: "btnrow" }, transferBtn, profBtn),
    el("div", { class: "btnrow" }, saveBtn, delBtn),
  );

  root.append(wrap);
}
