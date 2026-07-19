// Ideen-Tab: Ideen-Profil (10 Merkmale + Presets + KI-Profil + Divergenz)
// steuert den Prämissen-Generator. Slice A des Welt-artigen Umbaus.
import { el, button, select, textInput } from "./dom";
import { icon } from "./icons";
import { generateIdeaBatch } from "../generation/ideas";
import {
  IDEA_PRESETS, IDEA_PRESET_LABELS, ideaProfileToConfig,
  buildIdeaProfilePrompt, normalizeIdeaProfile,
  loadIdeaUserPresets, saveIdeaUserPreset, deleteIdeaUserPreset,
  type IdeaProfile,
} from "../features/ideaprofile";
import { loadAiKey, callClaude, extractJson } from "../features/ki";

export function mountIdeas(root: HTMLElement): void {
  root.innerHTML = "";
  const wrap = el("div", {});

  const nameIn = textInput("idea-name", "Thema/Motiv (optional)", "");
  const presetSel = select("idea-preset", [["", "— eigenes —"], ...IDEA_PRESET_LABELS]);

  const genre = select("idea-genre", [["mystery", "Mystery"], ["scifi", "SciFi"], ["maerchen", "Märchen"], ["absurd", "Absurd"], ["alltag", "Alltag"], ["horror", "Horror"], ["satire", "Satire"]], "mystery");
  const ton = select("idea-ton", [["duester", "düster"], ["hoffnung", "hoffnungsvoll"], ["ironisch", "ironisch"], ["melancholisch", "melancholisch"], ["unheimlich", "unheimlich"], ["verspielt", "verspielt"]], "duester");
  const prot = select("idea-prot", [["einzel", "Einzelgänger"], ["kollektiv", "Kollektiv"], ["kind", "Kind"], ["institution", "Institution"], ["nichtmensch", "Nicht-Mensch"], ["antiheld", "Antiheld"]], "einzel");
  const konflikt = select("idea-konf", [["raetsel", "Rätsel"], ["kampf", "gegen anderen"], ["inner", "innerer Konflikt"], ["natur", "gegen Natur"], ["system", "gegen System"], ["zeit", "gegen die Zeit"]], "raetsel");
  const ort = select("idea-ort", [["urban", "urban"], ["natur", "Natur"], ["raum", "geschlossener Raum"], ["grenze", "Grenze/Übergang"], ["nirgendwo", "Nirgendwo"], ["institution", "Institution"]], "urban");
  const zeit = select("idea-zeit", [["gegenwart", "Gegenwart"], ["historisch", "historisch"], ["zukunft", "Zukunft"], ["zeitlos", "zeitlos"], ["umbruch", "Umbruch"]], "gegenwart");
  const massstab = select("idea-mass", [["intim", "intim"], ["mittel", "mittel"], ["episch", "episch"], ["kosmisch", "kosmisch"]], "intim");
  const wendung = select("idea-wend", [["umkehr", "Umkehr"], ["enthuellung", "Enthüllung"], ["eskalation", "Eskalation"], ["offen", "offenes Ende"], ["paradox", "Paradox"], ["ironie", "Ironie"]], "enthuellung");
  const fokus = select("idea-fok", [["figur", "Figur"], ["konzept", "Konzept"], ["atmo", "Atmosphäre"], ["handlung", "Handlung"], ["form", "Form/Sprache"]], "figur");
  const diverg = el("input", { type: "range", min: "0", max: "100", step: "5", value: "40", id: "idea-div" }) as HTMLInputElement;
  const divVal = el("span", { class: "muted" }, "40");
  diverg.addEventListener("input", () => { divVal.textContent = diverg.value; });

  const fld = (l: string, n: HTMLElement): HTMLElement => el("label", { class: "field" }, el("span", { class: "field-label" }, l), n);

  const readProfile = (): IdeaProfile => ({
    name: nameIn.value.trim(),
    genre: genre.value as IdeaProfile["genre"], ton: ton.value as IdeaProfile["ton"],
    protagonist: prot.value as IdeaProfile["protagonist"], konflikt: konflikt.value as IdeaProfile["konflikt"],
    ort: ort.value as IdeaProfile["ort"], zeit: zeit.value as IdeaProfile["zeit"],
    massstab: massstab.value as IdeaProfile["massstab"], wendung: wendung.value as IdeaProfile["wendung"],
    fokus: fokus.value as IdeaProfile["fokus"], divergenz: parseInt(diverg.value, 10) || 0,
  });
  const applyProfile = (p: IdeaProfile): void => {
    nameIn.value = p.name; genre.value = p.genre; ton.value = p.ton; prot.value = p.protagonist;
    konflikt.value = p.konflikt; ort.value = p.ort; zeit.value = p.zeit; massstab.value = p.massstab;
    wendung.value = p.wendung; fokus.value = p.fokus; diverg.value = String(p.divergenz); divVal.textContent = String(p.divergenz);
  };

  const delBtn = button("Preset löschen", "danger");
  const updDel = (): void => { delBtn.style.display = presetSel.value.startsWith("user:") ? "" : "none"; };
  const rebuildPresetSel = (): void => {
    const cur = presetSel.value;
    presetSel.innerHTML = "";
    const add = (v: string, l: string): void => { const o = document.createElement("option"); o.value = v; o.textContent = l; presetSel.appendChild(o); };
    add("", "— eigenes —");
    IDEA_PRESET_LABELS.forEach(([v, l]) => add(v, l));
    Object.entries(loadIdeaUserPresets()).forEach(([id, pr]) => add(id, "★ " + (pr.name || id.replace("user:", ""))));
    presetSel.value = cur;
  };
  presetSel.addEventListener("change", () => {
    const v = presetSel.value;
    if (v.startsWith("user:")) { const p = loadIdeaUserPresets()[v]; if (p) applyProfile({ ...p, name: p.name }); }
    else if (v) { const p = IDEA_PRESETS[v]; if (p) applyProfile(p); }
    updDel();
  });
  rebuildPresetSel();

  // Zufallsstart: alle Merkmale auswürfeln.
  const randSel = (s: HTMLSelectElement): void => {
    if (s.options.length) s.value = s.options[Math.floor(Math.random() * s.options.length)]!.value;
  };
  const randomize = (): void => {
    [genre, ton, prot, konflikt, ort, zeit, massstab, wendung, fokus].forEach(randSel);
    diverg.value = String(Math.floor(Math.random() * 21) * 5);
    divVal.textContent = diverg.value;
    nameIn.value = ""; presetSel.value = ""; updDel();
  };
  randomize();

  // ---- Ausgabe ----
  const list = el("div", {});
  const count = el("input", { type: "number", value: "10", min: "1", max: "30", style: "width:70px" }) as HTMLInputElement;
  const render = (): void => {
    list.innerHTML = "";
    const cfg = ideaProfileToConfig(readProfile());
    for (const idea of generateIdeaBatch(parseInt(count.value, 10) || 10, cfg)) {
      const take = button("→ Studio");
      take.addEventListener("click", () => {
        try { localStorage.setItem("dm_pending_ctx", JSON.stringify({ who: idea.seedWho, where: idea.seedWhere, when: idea.seedWhen, what: idea.seedWhat })); } catch { /* voll */ }
        const st = [...document.querySelectorAll(".tabbar button")].find((b) => b.textContent === "Studio") as HTMLButtonElement | undefined;
        if (st) st.click();
      });
      list.append(el("div", { class: "idea" },
        el("p", { class: "idea-text" }, idea.text, el("span", { class: "muted" }, `  · ${idea.archetype} · ${idea.presetLabel}`)),
        take));
    }
  };

  const genBtn = el("button", { class: "primary" }, icon("dice"), " Ideen generieren");
  genBtn.addEventListener("click", render);
  const rndBtn = el("button", {}, icon("refresh"), " Würfeln");
  rndBtn.addEventListener("click", () => { randomize(); render(); });

  const profLbl = el("span", {}, "KI-Profil erzeugen");
  const profBtn = el("button", {}, icon("flask"), " ", profLbl);
  profBtn.addEventListener("click", () => {
    void (async () => {
      if (!loadAiKey()) { alert("Kein API-Schlüssel — bitte im KI-Tab hinterlegen."); return; }
      profBtn.disabled = true; const old = profLbl.textContent; profLbl.textContent = "Erzeuge…";
      try {
        const nm = nameIn.value.trim() || "Idee";
        const raw = await callClaude(buildIdeaProfilePrompt(nm), 800);
        applyProfile(normalizeIdeaProfile(extractJson(raw), nm));
        presetSel.value = ""; updDel();
      } catch (e) { alert("Fehlgeschlagen: " + (e instanceof Error ? e.message : String(e))); }
      finally { profBtn.disabled = false; profLbl.textContent = old || "KI-Profil erzeugen"; }
    })();
  });
  const saveBtn = button("Als Preset speichern");
  saveBtn.addEventListener("click", () => {
    const p = readProfile(); if (!p.name.trim()) { alert("Bitte ein Thema/Motiv als Namen eintragen."); return; }
    const id = saveIdeaUserPreset(p); rebuildPresetSel(); presetSel.value = id; updDel();
  });
  delBtn.addEventListener("click", () => { const v = presetSel.value; if (v.startsWith("user:")) { deleteIdeaUserPreset(v); rebuildPresetSel(); presetSel.value = ""; updDel(); } });

  wrap.append(
    el("h2", {}, "Ideen — Prämissen-Modus"),
    el("p", { class: "muted" }, "Zehn Merkmale formen die Richtung der Prämissen. Wähle ein Preset, stelle die Regler selbst ein oder lass die KI aus einem Thema ein Profil bauen. Der Divergenz-Regler steuert, wie wild die Streuung wird."),
    el("div", { class: "grid2" }, fld("Preset", presetSel), fld("Thema/Motiv", nameIn)),
    el("div", { class: "grid3" }, fld("Genre", genre), fld("Ton", ton), fld("Protagonist", prot)),
    el("div", { class: "grid3" }, fld("Konfliktart", konflikt), fld("Ort-Typ", ort), fld("Zeit/Epoche", zeit)),
    el("div", { class: "grid3" }, fld("Maßstab", massstab), fld("Wendungstyp", wendung), fld("Fokus", fokus)),
    fld("Divergenz (zahm → radikal)", el("div", { class: "chkrow" }, diverg, " ", divVal)),
    el("div", { class: "btnrow" }, "Anzahl ", count, " ", genBtn, rndBtn, profBtn),
    el("div", { class: "btnrow" }, saveBtn, delBtn),
    list,
  );
  root.append(wrap);
  render();
}
