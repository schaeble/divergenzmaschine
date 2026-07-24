// Montage-Tab: Fragmente sammeln und nach einem Meta-Bogen zusammensetzen (Scheibe A).
import { el, button, select, field, textInput } from "./dom";
import { icon } from "./icons";
import { loadTreasury, addToTreasury } from "../features/treasury";
import { openReader } from "./reader";
import { META_ARCS, assemble, isKiArc, buildMontagePrompt, loadMontage, saveMontage, newId, type Fragment } from "../features/montage";
import { loadAiKey, callClaudeStream, isOnline } from "../features/ki";

const lastText = (): string => { try { return localStorage.getItem("dm_last_text") || ""; } catch { return ""; } };

export function mountMontage(root: HTMLElement): void {
  root.innerHTML = "";
  const wrap = el("div", {});
  const st = loadMontage();
  let frags: Fragment[] = st.fragments;

  const klammer = textInput("mo-klammer", "Klammer — gemeinsames Motiv/Figur/Ort (optional)", st.klammer);
  const arcSel = select("mo-arc", META_ARCS.map((a) => [a.id, a.label] as [string, string]), st.arc);
  const arcInfo = el("span", { class: "muted" }, "");
  const updArc = (): void => { const a = META_ARCS.find((x) => x.id === arcSel.value); arcInfo.textContent = a ? a.short : ""; };
  arcSel.addEventListener("change", () => { updArc(); persist(); });
  updArc();

  const listBox = el("div", {});
  const out = el("textarea", { class: "out", rows: "12", placeholder: "Zusammengesetzter Text erscheint hier.", style: "width:100%" }) as HTMLTextAreaElement;

  const persist = (): void => saveMontage({ fragments: frags, arc: arcSel.value, klammer: klammer.value });
  klammer.addEventListener("input", persist);

  const renderList = (): void => {
    listBox.innerHTML = "";
    if (!frags.length) { listBox.append(el("p", { class: "muted" }, "Noch keine Fragmente. Unten hinzufügen.")); return; }
    frags.forEach((f, i) => {
      const up = button("↑"); up.addEventListener("click", () => { if (i > 0) { [frags[i - 1], frags[i]] = [frags[i]!, frags[i - 1]!]; renderList(); persist(); } });
      const down = button("↓"); down.addEventListener("click", () => { if (i < frags.length - 1) { [frags[i + 1], frags[i]] = [frags[i]!, frags[i + 1]!]; renderList(); persist(); } });
      const del = button("✕", "danger"); del.addEventListener("click", () => { frags.splice(i, 1); renderList(); persist(); });
      listBox.append(el("div", { class: "idea" },
        el("p", { class: "idea-text" }, `${i + 1}. ${f.text.slice(0, 90)}${f.text.length > 90 ? "…" : ""}`, el("span", { class: "muted" }, `  · ${f.source}`)),
        el("div", { class: "btnrow" }, up, down, del)));
    });
  };
  const addFrag = (text: string, source: string): void => {
    const t = (text || "").trim(); if (!t) return;
    frags.push({ id: newId(), text: t, source }); renderList(); persist();
  };

  // Quellen
  const treasures = loadTreasury().slice().reverse();
  const trSel = select("mo-tr", [["", treasures.length ? "— Schatzkammer-Text wählen —" : "— Schatzkammer leer —"],
    ...treasures.map((it, i) => [String(i), `${it.d}: ${it.t.slice(0, 45)}…`] as [string, string])]);
  const trAdd = button("+ hinzufügen");
  trAdd.addEventListener("click", () => { const i = parseInt(trSel.value, 10); const it = Number.isNaN(i) ? undefined : treasures[i]; if (it) addFrag(it.t, "Schatzkammer"); });
  const allTr = button("Alle aus Schatzkammer");
  allTr.addEventListener("click", () => { treasures.slice().reverse().forEach((it) => addFrag(it.t, "Schatzkammer")); });

  const lastBtn = button("Letzten Studio-Text");
  lastBtn.addEventListener("click", () => addFrag(lastText(), "Studio"));

  const pasteTa = el("textarea", { rows: "3", placeholder: "Text einfügen und hinzufügen", style: "width:100%" }) as HTMLTextAreaElement;
  const pasteAdd = button("Einfügen hinzufügen");
  pasteAdd.addEventListener("click", () => { addFrag(pasteTa.value, "eingefügt"); pasteTa.value = ""; });

  // Zusammensetzen + Ausgabe
  const status = el("span", { class: "muted" }, "");
  const cancelBtn = el("button", { class: "danger", style: "display:none" }, "Abbrechen") as HTMLButtonElement;
  let ac: AbortController | null = null;
  cancelBtn.addEventListener("click", () => ac?.abort());

  const composeBtn = el("button", { class: "primary" }, icon("tool"), " Zusammensetzen");
  composeBtn.addEventListener("click", () => {
    if (!frags.length) { status.textContent = "Keine Fragmente."; return; }
    if (!isKiArc(arcSel.value)) { out.value = assemble(arcSel.value, frags, klammer.value); status.textContent = ""; return; }
    void (async () => {
      if (!loadAiKey()) { status.textContent = "KI-Bogen braucht einen API-Schlüssel (Studio ▸ Einstellungen ▸ KI-Zugang)."; return; }
      if (!isOnline()) { status.textContent = "Offline — KI-Weberei nicht verfügbar."; return; }
      const totalWords = frags.reduce((n, f) => n + (f.text.match(/\S+/g) || []).length, 0);
      const budget = arcSel.value === "emergenz" ? 1500 : Math.min(8192, totalWords * 3 + 800);
      // Emergenz: Fragmente bleiben stehen, die Erkenntnis kommt darunter. Hyperlink: verwobener Gesamttext.
      const body = arcSel.value === "emergenz" ? assemble("mosaik", frags, klammer.value) + "\n\n\n— Emergenz —\n\n" : "";
      composeBtn.disabled = true; status.textContent = "Webt…"; ac = new AbortController(); cancelBtn.style.display = "";
      out.value = body;
      try {
        const r = await callClaudeStream(buildMontagePrompt(arcSel.value, frags, klammer.value), budget,
          (_c, full) => { out.value = body + full; }, ac.signal);
        out.value = body + r.text; status.textContent = "fertig.";
      } catch (e) { status.textContent = ac.signal.aborted ? "Abgebrochen." : "Fehlgeschlagen: " + (e instanceof Error ? e.message : String(e)); }
      finally { composeBtn.disabled = false; cancelBtn.style.display = "none"; ac = null; }
    })();
  });
  const copyBtn = button("Kopieren");
  copyBtn.addEventListener("click", () => { if (out.value.trim()) { void navigator.clipboard?.writeText(out.value); const o = copyBtn.textContent; copyBtn.textContent = "Kopiert ✓"; setTimeout(() => (copyBtn.textContent = o), 1200); } });
  const readBtn = el("button", {}, icon("book"), " Lesemodus");
  readBtn.addEventListener("click", () => { if (out.value.trim()) openReader(out.value); });
  const keepInfo = el("span", { class: "muted" }, "");
  const keepBtn = el("button", {}, icon("star"), " Merken");
  keepBtn.addEventListener("click", () => { if (!out.value.trim()) return; const n = addToTreasury(out.value, {}); keepInfo.textContent = n < 0 ? "schon vorhanden" : `gemerkt (${n})`; setTimeout(() => (keepInfo.textContent = ""), 2000); });
  const toWerk = button("→ Werkstatt");
  toWerk.addEventListener("click", () => {
    if (!out.value.trim()) return;
    try { localStorage.setItem("dm_pending_workshop_src", out.value); } catch { /* voll */ }
    const w = [...document.querySelectorAll(".tabbar button")].find((b) => b.textContent === "Werkstatt") as HTMLButtonElement | undefined;
    if (w) w.click();
  });
  const txtBtn = button("Als TXT");
  txtBtn.addEventListener("click", () => { if (!out.value.trim()) return; const a = el("a", { href: URL.createObjectURL(new Blob([out.value], { type: "text/plain;charset=utf-8" })), download: `montage_${new Date().toISOString().slice(0, 10)}.txt` }); a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 0); });
  const clearBtn = button("Fragmente leeren", "danger");
  clearBtn.addEventListener("click", () => { if (frags.length && confirm("Alle Fragmente aus der Montage entfernen? (Die Schatzkammer bleibt unberührt.)")) { frags = []; renderList(); persist(); } });

  wrap.append(
    el("h2", {}, "Montage — Fragmente zu einem Ganzen"),
    el("p", { class: "muted" }, "Sammle Fragmente (Schatzkammer, letzter Studio-Text, eingefügt) und setze sie nach einem Meta-Bogen zusammen. Rein offline: Anordnung plus gemeinsame Klammer. Das Verweben per KI (Emergenz, Hyperlink) kommt als eigener Schritt."),
    el("div", { class: "grid2" }, field("Klammer", klammer), field("Meta-Bogen", el("div", { class: "chkrow" }, arcSel, " ", arcInfo))),
    el("h3", { style: "margin:14px 0 6px" }, "Fragmente"),
    listBox,
    el("div", { class: "btnrow" }, trSel, trAdd, allTr),
    el("div", { class: "btnrow" }, lastBtn, clearBtn),
    pasteTa,
    el("div", { class: "btnrow" }, pasteAdd),
    el("h3", { style: "margin:14px 0 6px" }, "Ergebnis"),
    el("div", { class: "btnrow" }, composeBtn, cancelBtn, status),
    out,
    el("div", { class: "btnrow" }, copyBtn, readBtn, keepBtn, txtBtn, toWerk, keepInfo),
  );
  root.append(wrap);
  renderList();
}
