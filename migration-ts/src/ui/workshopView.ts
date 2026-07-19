// Werkstatt-Tab: aus dem Maschinen-Rohtext in drei Stufen eine Kurzgeschichte.
import { el, field, select, button } from "./dom";
import { icon } from "./icons";
import { loadAiKey, callClaude, callClaudeEx, extractJson } from "../features/ki";
import { loadTreasury, addToTreasury } from "../features/treasury";
import { loadActiveBankLabel } from "../wordbank";
import { openReader } from "./reader";
import {
  LEN_OPTS, PERS_OPTS, ZEIT_OPTS, TON_OPTS, SCHLUSS_OPTS,
  buildOutlinePrompt, normalizeOutline, buildDraftPrompt, buildPolishPrompt,
  gatherMaterialDetailed, loadWorkshop, saveWorkshop,
  loadWorkshopProjects, saveWorkshopProject, deleteWorkshopProject,
  type WorkshopOpts, type Outline, type Receipts,
} from "../features/workshop";

const lastText = (): string => { try { return localStorage.getItem("dm_last_text") || ""; } catch { return ""; } };
const ta = (rows: string, ph: string): HTMLTextAreaElement =>
  el("textarea", { class: "out", rows, placeholder: ph, style: "width:100%" }) as HTMLTextAreaElement;

export function mountWorkshop(root: HTMLElement): void {
  root.innerHTML = "";
  const wrap = el("div", {});
  const saved = loadWorkshop();

  // ---- Quelle ----
  const rawPane = ta("6", "Rohtext — aus dem Studio, der Schatzkammer oder selbst eingefügt.");
  rawPane.value = saved?.raw || lastText();
  const useLast = button("Letzten Studio-Text holen");
  useLast.addEventListener("click", () => { rawPane.value = lastText(); });
  const treasures = loadTreasury().slice().reverse();
  const trSel = select("ws-tr", [["", treasures.length ? "— Schatzkammer-Text wählen —" : "— Schatzkammer leer —"],
    ...treasures.map((it, i) => [String(i), `${it.d}${it.who ? " · " + it.who : ""}: ${it.t.slice(0, 40)}…`] as [string, string])]);
  trSel.addEventListener("change", () => {
    const i = parseInt(trSel.value, 10);
    const it = Number.isNaN(i) ? undefined : treasures[i];
    if (it) rawPane.value = it.t;
  });

  // ---- Optionen ----
  const lenSel = select("ws-len", LEN_OPTS, String(saved?.opts.laenge ?? 900));
  const persSel = select("ws-pers", PERS_OPTS, saved?.opts.perspektive ?? "ersie");
  const zeitSel = select("ws-zeit", ZEIT_OPTS, saved?.opts.zeitform ?? "praeteritum");
  const tonSel = select("ws-ton", TON_OPTS, saved?.opts.ton ?? "dicht");
  const schlSel = select("ws-schl", SCHLUSS_OPTS, saved?.opts.schluss ?? "pointe");
  // ---- Wortmaterial: sichtbar, editierbar, abschaltbar ----
  const matUse = el("input", { type: "checkbox" }) as HTMLInputElement;
  matUse.checked = saved?.useMaterial !== false;
  const matPane = ta("6", "Begriffe, die in Stufe 2 mitgeschickt werden — einer je Zeile.");
  const matInfo = el("span", { class: "muted" }, "");
  let matEdited = saved?.materialEdited === true;

  /** Beschriftung beschreibt immer das, was tatsächlich im Feld steht. */
  const updMatInfo = (fresh?: { bank: number; live: number }): void => {
    const n = matPane.value.split("\n").map((x) => x.trim()).filter(Boolean).length;
    if (matEdited) {
      matInfo.textContent = `${n} Begriffe · von Hand geändert, weicht von der aktuellen Wortbank ab`;
    } else if (fresh) {
      const src = loadActiveBankLabel();
      matInfo.textContent = `${n} Begriffe · ${fresh.bank} aus der Wortbank${src ? " „" + src + "“" : ""} · ${fresh.live} aus den lebendigen Pools`;
    } else {
      matInfo.textContent = `${n} Begriffe`;
    }
  };
  const fillMaterial = (): void => {
    const d = gatherMaterialDetailed();
    const merged = [...new Set([...d.bank, ...d.live])].slice(0, 24);
    matPane.value = merged.join("\n");
    matEdited = false;
    updMatInfo({ bank: d.bank.length, live: d.live.length });
  };
  // Beim Öffnen immer frisch aus der Wortbank — außer du hast von Hand eingegriffen.
  if (matEdited && typeof saved?.material === "string") { matPane.value = saved.material; updMatInfo(); }
  else { fillMaterial(); }

  const matReload = button("Aus Wortbank + Pools neu laden");
  matReload.addEventListener("click", () => { fillMaterial(); persist(); });
  const readMaterial = (): string[] =>
    matUse.checked ? matPane.value.split("\n").map((x) => x.trim()).filter(Boolean) : [];
  const matBox = el("details", { class: "fine" });
  matBox.append(
    el("summary", {}, icon("tool"), " Wortmaterial für Stufe 2"),
    el("p", { class: "muted" }, "Diese Begriffe gehen mit in den Schreib-Prompt und färben die Ausarbeitung — unabhängig davon, was in der Quelle steht. Beim Öffnen wird immer die aktuell aktive Wortbank geladen; eigene Änderungen bleiben erhalten und werden als solche gekennzeichnet."),
    el("label", { class: "chk" }, matUse, " Wortmaterial verwenden"),
    matPane,
    el("div", { class: "btnrow" }, matReload, matInfo));

  // ---- Quittungen je Stufe ----
  const rc: Receipts = { ...(saved?.receipts || {}) };
  const rcOutline = el("span", { class: "muted" }, rc.outline || "");
  const rcDraft = el("span", { class: "muted" }, rc.draft || "");
  const rcFinal = el("span", { class: "muted" }, rc.final || "");
  const stamp = (): string => new Date().toTimeString().slice(0, 5);
  /** Deutsch braucht rund 3–4 Tokens je Wort; grosszuegig plus Puffer, gedeckelt. */
  const budget = (zielWoerter: number): number => Math.min(8192, Math.ceil(zielWoerter * 5) + 1000);
  const words = (v: string): number => (v.trim().match(/\S+/g) || []).length;

  const readOpts = (): WorkshopOpts => ({
    laenge: parseInt(lenSel.value, 10) || 900,
    perspektive: persSel.value as WorkshopOpts["perspektive"],
    zeitform: zeitSel.value as WorkshopOpts["zeitform"],
    ton: tonSel.value as WorkshopOpts["ton"],
    schluss: schlSel.value as WorkshopOpts["schluss"],
  });

  // ---- Stufe 1: Gerüst ----
  const figur = el("input", { placeholder: "Figur" }) as HTMLInputElement;
  const wunsch = el("input", { placeholder: "Wunsch" }) as HTMLInputElement;
  const hindernis = el("input", { placeholder: "Hindernis" }) as HTMLInputElement;
  const wendung = el("input", { placeholder: "Wendung" }) as HTMLInputElement;
  const schlussIn = el("input", { placeholder: "Schluss" }) as HTMLInputElement;
  const beatsPane = ta("6", "Szenenschritte — eine Zeile je Schritt. Frei änderbar.");
  const applyOutline = (o: Outline): void => {
    figur.value = o.figur; wunsch.value = o.wunsch; hindernis.value = o.hindernis;
    wendung.value = o.wendung; schlussIn.value = o.schluss; beatsPane.value = o.beats.join("\n");
  };
  const readOutline = (): Outline => ({
    figur: figur.value.trim(), wunsch: wunsch.value.trim(), hindernis: hindernis.value.trim(),
    wendung: wendung.value.trim(), schluss: schlussIn.value.trim(),
    beats: beatsPane.value.split("\n").map((x) => x.replace(/^\s*\d+[.)]\s*/, "").trim()).filter(Boolean),
  });
  if (saved?.outline) applyOutline(saved.outline);

  // ---- Stufen 2+3 ----
  const draftPane = ta("14", "Rohfassung erscheint hier.");
  draftPane.value = saved?.draft || "";
  const finalPane = ta("14", "Endfassung erscheint hier.");
  finalPane.value = saved?.final || "";

  const persist = (): void => saveWorkshop({
    raw: rawPane.value, outline: readOutline(), draft: draftPane.value, final: finalPane.value, opts: readOpts(),
    material: matPane.value, useMaterial: matUse.checked, materialEdited: matEdited, receipts: rc,
  });
  matUse.addEventListener("change", persist);
  matPane.addEventListener("input", () => { matEdited = true; updMatInfo(); persist(); });

  /** Kleines ✕ zum Leeren — nur sichtbar, wenn das Feld etwas enthält. */
  const mkClear = (pane: HTMLTextAreaElement, after?: () => void): HTMLButtonElement => {
    const b = el("button", { class: "danger", title: "Feld leeren" }, "✕") as HTMLButtonElement;
    const upd = (): void => { b.style.display = pane.value.trim() ? "" : "none"; };
    b.addEventListener("click", () => { pane.value = ""; upd(); if (after) after(); persist(); });
    pane.addEventListener("input", upd);
    upd();
    return b;
  };
  const rawClear = mkClear(rawPane);
  const beatsClear = mkClear(beatsPane);

  const status = el("p", { class: "muted" }, "");
  const run = async (btn: HTMLButtonElement, lbl: HTMLElement, def: string, fn: () => Promise<void>): Promise<void> => {
    if (!loadAiKey()) { alert("Kein API-Schlüssel — bitte unter Studio ▸ Einstellungen hinterlegen."); return; }
    btn.disabled = true; lbl.textContent = "Sende an KI…"; status.textContent = "";
    try { await fn(); persist(); }
    catch (e) { status.textContent = "Fehlgeschlagen: " + (e instanceof Error ? e.message : String(e)); }
    finally { btn.disabled = false; lbl.textContent = def; }
  };

  // ---- Werkstatt-Projekt: benennen, speichern, laden ----
  const projName = el("input", { placeholder: "Name des Projekts" }) as HTMLInputElement;
  const projSel = select("ws-proj", [["", "— gespeicherte Projekte —"]]);
  const projInfo = el("span", { class: "muted" }, "");
  const projDel = button("Löschen", "danger");
  const rebuildProjSel = (): void => {
    const cur = projSel.value;
    projSel.innerHTML = "";
    const add = (v: string, l: string): void => { const o = document.createElement("option"); o.value = v; o.textContent = l; projSel.appendChild(o); };
    const all = loadWorkshopProjects();
    const ids = Object.keys(all).sort((a, b) => (all[b]!.d || "").localeCompare(all[a]!.d || ""));
    add("", ids.length ? "— gespeicherte Projekte —" : "— noch keine gespeichert —");
    ids.forEach((id) => add(id, `${all[id]!.name || id} · ${all[id]!.d || ""}`));
    projSel.value = cur;
    projDel.style.display = projSel.value ? "" : "none";
  };
  projSel.addEventListener("change", () => { projDel.style.display = projSel.value ? "" : "none"; });

  const projSave = button("Speichern");
  projSave.addEventListener("click", () => {
    const nm = projName.value.trim();
    if (!nm) { projInfo.textContent = "Bitte einen Namen eintragen."; return; }
    const id = saveWorkshopProject({
      name: nm, raw: rawPane.value, opts: readOpts(), outline: readOutline(),
      draft: draftPane.value, final: finalPane.value, d: "",
      material: matPane.value, useMaterial: matUse.checked,
    });
    rebuildProjSel(); projSel.value = id; projDel.style.display = "";
    projInfo.textContent = "gespeichert ✓";
    setTimeout(() => (projInfo.textContent = ""), 1800);
  });
  const projLoad = button("Laden");
  projLoad.addEventListener("click", () => {
    const id = projSel.value; if (!id) return;
    const p = loadWorkshopProjects()[id]; if (!p) return;
    projName.value = p.name || "";
    rawPane.value = p.raw || "";
    lenSel.value = String(p.opts?.laenge ?? 900);
    persSel.value = p.opts?.perspektive ?? "ersie";
    zeitSel.value = p.opts?.zeitform ?? "praeteritum";
    tonSel.value = p.opts?.ton ?? "dicht";
    schlSel.value = p.opts?.schluss ?? "pointe";
    if (p.outline) applyOutline(p.outline);
    draftPane.value = p.draft || "";
    finalPane.value = p.final || "";
    if (typeof p.material === "string") { matPane.value = p.material; matEdited = true; updMatInfo(); }
    matUse.checked = p.useMaterial !== false;
    draftActions.upd(); finalActions.upd(); persist();
    projInfo.textContent = "geladen ✓";
    setTimeout(() => (projInfo.textContent = ""), 1800);
  });
  projDel.addEventListener("click", () => {
    const id = projSel.value; if (!id) return;
    deleteWorkshopProject(id); rebuildProjSel(); projSel.value = "";
    projDel.style.display = "none";
    projInfo.textContent = "gelöscht";
    setTimeout(() => (projInfo.textContent = ""), 1800);
  });
  rebuildProjSel();

  const s1Lbl = el("span", {}, "1 · Gerüst erzeugen");
  const s1 = el("button", { class: "primary" }, icon("flask"), " ", s1Lbl) as HTMLButtonElement;
  s1.addEventListener("click", () => void run(s1, s1Lbl, "1 · Gerüst erzeugen", async () => {
    const raw = rawPane.value.trim();
    if (!raw) { status.textContent = "Kein Rohtext."; return; }
    const out = await callClaude(buildOutlinePrompt(raw, {}, readOpts()), 1500);
    const ol = normalizeOutline(extractJson(out));
    applyOutline(ol);
    rc.outline = `Gerüst erzeugt · ${stamp()} · ${ol.beats.length} Szenenschritte`;
    rcOutline.textContent = rc.outline;
  }));

  const s2Lbl = el("span", {}, "2 · Rohfassung schreiben");
  const s2 = el("button", {}, icon("flask"), " ", s2Lbl) as HTMLButtonElement;
  s2.addEventListener("click", () => void run(s2, s2Lbl, "2 · Rohfassung schreiben", async () => {
    const ol = readOutline();
    if (!ol.beats.length) { status.textContent = "Kein Gerüst — erst Stufe 1, oder Szenenschritte selbst eintragen."; return; }
    const o = readOpts();
    const mat = readMaterial();
    const r = await callClaudeEx(buildDraftPrompt(rawPane.value.trim(), {}, ol, o, mat), budget(o.laenge));
    draftPane.value = r.text;
    draftActions.upd();
    rc.draft = `Rohfassung · ${stamp()} · ${words(draftPane.value)} Wörter · ${mat.length ? mat.length + " Begriffe Material" : "ohne Material"}${r.truncated ? " · ⚠ am Token-Limit abgeschnitten" : ""}`;
    rcDraft.textContent = rc.draft;
  }));

  const s3Lbl = el("span", {}, "3 · Politur");
  const s3 = el("button", {}, icon("flask"), " ", s3Lbl) as HTMLButtonElement;
  s3.addEventListener("click", () => void run(s3, s3Lbl, "3 · Politur", async () => {
    const d = draftPane.value.trim();
    if (!d) { status.textContent = "Keine Rohfassung."; return; }
    const o = readOpts();
    const r = await callClaudeEx(buildPolishPrompt(d, o), budget(Math.max(o.laenge, words(d))));
    finalPane.value = r.text;
    finalActions.upd();
    rc.final = `Endfassung · ${stamp()} · ${words(finalPane.value)} Wörter (aus ${words(d)})${r.truncated ? " · ⚠ am Token-Limit abgeschnitten" : ""}`;
    rcFinal.textContent = rc.final;
  }));

  // ---- Aktionen: jedes Feld bekommt seine eigene Reihe ----
  const wordCount = (v: string): number => (v.trim().match(/\S+/g) || []).length;

  const mkActions = (pane: HTMLTextAreaElement, filePrefix: string): { row: HTMLElement; upd: () => void } => {
    const count = el("span", { class: "muted" }, "");
    const info = el("span", { class: "muted" }, "");
    const upd = (): void => { const n = wordCount(pane.value); count.textContent = n ? `${n} Wörter` : ""; };

    const copyBtn = button("Kopieren");
    copyBtn.addEventListener("click", () => {
      const v = pane.value.trim(); if (!v) return;
      void navigator.clipboard?.writeText(v);
      const o = copyBtn.textContent; copyBtn.textContent = "Kopiert ✓"; setTimeout(() => (copyBtn.textContent = o), 1200);
    });
    const readBtn = el("button", {}, icon("book"), " Lesemodus");
    readBtn.addEventListener("click", () => { const v = pane.value.trim(); if (v) openReader(v); });
    const keepBtn = el("button", {}, icon("star"), " Merken");
    keepBtn.addEventListener("click", () => {
      const v = pane.value.trim(); if (!v) return;
      const n = addToTreasury(v, {});
      info.textContent = n < 0 ? "schon vorhanden" : `in der Schatzkammer (${n})`;
      setTimeout(() => (info.textContent = ""), 2200);
    });
    const txtBtn = button("Als TXT");
    txtBtn.addEventListener("click", () => {
      const v = pane.value.trim(); if (!v) return;
      const a = el("a", { href: URL.createObjectURL(new Blob([v], { type: "text/plain;charset=utf-8" })), download: `${filePrefix}_${new Date().toISOString().slice(0, 10)}.txt` });
      a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 0);
    });

    const clr = mkClear(pane, upd);
    pane.addEventListener("input", () => { upd(); persist(); });
    return { row: el("div", { class: "btnrow" }, count, " ", copyBtn, readBtn, keepBtn, txtBtn, clr, info), upd };
  };

  const draftActions = mkActions(draftPane, "rohfassung");
  const finalActions = mkActions(finalPane, "kurzgeschichte");

  const step = (n: string, t: string): HTMLElement => el("h3", { style: "margin:18px 0 8px" }, n + " " + t);

  wrap.append(
    el("h2", {}, "Werkstatt — aus dem Rohtext eine Kurzgeschichte"),
    el("p", { class: "muted" }, "Drei Stufen: erst das Gerüst, das du korrigieren kannst, dann die Fassung, dann die Politur. Das Wortmaterial aus Wortbank und lebendigen Pools geht mit ein, damit der Text nach deiner Maschine klingt. Braucht einen API-Schlüssel (Studio ▸ Einstellungen)."),

    step("", "Quelle"),
    rawPane,
    el("div", { class: "btnrow" }, useLast, trSel, rawClear),
    matBox,

    step("", "Vorgaben"),
    el("div", { class: "grid3" }, field("Länge", lenSel), field("Perspektive", persSel), field("Zeitform", zeitSel)),
    el("div", { class: "grid2" }, field("Ton", tonSel), field("Schluss", schlSel)),

    step("1 ·", "Gerüst"),
    el("div", { class: "grid2" }, field("Werkstatt-Projekt", projName), field("Gespeichert", projSel)),
    el("div", { class: "btnrow" }, projSave, projLoad, projDel, projInfo),
    el("p", { class: "muted" }, "Speichert Quelle, Vorgaben, Gerüst und beide Fassungen unter diesem Namen. Wandert auch in die Projektdatei oben rechts."),
    el("div", { class: "btnrow" }, s1, rcOutline),
    el("div", { class: "grid2" }, field("Figur", figur), field("Wunsch", wunsch)),
    el("div", { class: "grid2" }, field("Hindernis", hindernis), field("Wendung", wendung)),
    field("Schluss", schlussIn),
    field("Szenenschritte", beatsPane),
    el("div", { class: "btnrow" }, beatsClear),

    step("2 ·", "Rohfassung"),
    el("div", { class: "btnrow" }, s2, rcDraft),
    draftPane,
    draftActions.row,

    step("3 ·", "Endfassung"),
    el("div", { class: "btnrow" }, s3, rcFinal),
    finalPane,
    finalActions.row,
    status,
  );
  root.append(wrap);
  draftActions.upd();
  finalActions.upd();
}
