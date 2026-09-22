// Textexport (4.368.0).
//
// Bis hierher ließ sich ein Text im Studio nur kopieren. Die Schatzkammer
// schrieb eine TXT-Datei, aber ohne Form und ohne Reglerstellung — gerade die
// zwei Angaben, ohne die man einem Text später nicht mehr ansieht, wie er
// entstanden ist. Hier steht beides als REINE Rechnung: Text + Kopf → Datei-
// inhalt. Der Browser-Teil (herunterladen) steht ganz unten und wird von den
// Prüfständen nicht berührt.
//
// Zwei Formate:
//  txt — für jeden Editor; der Kopf steht über einer Trennlinie.
//  md  — Markdown. Die Zeilenbrüche des Textes MÜSSEN erhalten bleiben
//        (Reim, Haiku, Gedicht-Strang leben davon), Markdown fasst einfache
//        Umbrüche aber zu einem Absatz zusammen. Deshalb bekommt jede Zeile
//        innerhalb eines Absatzes einen harten Umbruch, und Zeilenanfänge, die
//        Markdown als Überschrift, Liste oder Zitat läse, werden entwertet.

import type { Treasure } from "./treasury";

export type ExportFormat = "txt" | "md";

export interface ExportKopf {
  titel?: string;
  form?: string;            // Anzeigename, z. B. „Prosa"
  who?: string; where?: string; when?: string; what?: string;
  datum?: string;           // „2026-09-22 14:03"
  version?: string;
  einstellungen?: Record<string, string>;
  tresor?: boolean;
}

/** Welche Reglerwerte in den Kopf kommen, und unter welchem Namen. Was hier
 *  nicht steht, bleibt draußen — der Kopf soll lesbar sein, keine Speicherkopie. */
const EINSTELLUNG_NAMEN: [string, string][] = [
  ["preset", "Preset"], ["tone", "Ton"], ["structure", "Struktur"], ["mode", "Modus"],
  ["perspective", "Perspektive"], ["rhythm", "Rhythmus"], ["tension", "Spannung"],
  ["ressort", "Ressort"], ["lenTarget", "Länge"],
  ["serie", "Serie"], ["folge", "Folge"],
];

export function einstellungsZeile(set?: Record<string, string>): string {
  if (!set) return "";
  return EINSTELLUNG_NAMEN
    .filter(([k]) => (set[k] || "").trim() !== "")
    .map(([k, n]) => `${n}: ${set[k]!.trim()}`)
    .join(" · ");
}

function wZeile(k: ExportKopf): string {
  return ([["Wer", k.who], ["Wo", k.where], ["Wann", k.when], ["Was", k.what]] as [string, string | undefined][])
    .filter(([, v]) => (v || "").trim() !== "")
    .map(([n, v]) => `${n}: ${v!.trim()}`)
    .join(" · ");
}

function kopfZeilen(k: ExportKopf): string[] {
  const erste = [
    k.form ? `Form: ${k.form}` : "",
    k.datum ? `Datum: ${k.datum}` : "",
    k.tresor ? "Tresor" : "",
    k.version ? `Divergenzmaschine ${k.version}` : "",
  ].filter(Boolean).join(" · ");
  return [erste, wZeile(k), einstellungsZeile(k.einstellungen)].filter(Boolean);
}

/** Entwertet, was Markdown am Zeilenanfang als Auszeichnung läse. */
export function mdZeileSchuetzen(z: string): string {
  let s = z.replace(/\\/g, "\\\\");                   // erst der Rückstrich selbst
  s = s.replace(/[*_`[\]<]/g, (m) => "\\" + m);            // Hervorhebung, Code, Verweis, HTML
  s = s.replace(/^(\s*)([#>+\-=|])/, "$1\\$2");            // Überschrift, Zitat, Liste, Unterstreichung, Tabelle
  s = s.replace(/^(\s*\d+)([.)])(\s|$)/, "$1\\$2$3");      // „1. Zeit" wäre eine nummerierte Liste
  return s;
}

/** Text → Markdown mit erhaltenen Zeilenbrüchen. */
export function mdText(text: string): string {
  const absaetze = text.replace(/\r\n?/g, "\n").trim().split(/\n\s*\n/);
  return absaetze
    .map((a) => a.split("\n").map((z) => mdZeileSchuetzen(z.trimEnd())).join("  \n"))
    .join("\n\n");
}

/** Ein Text mit Kopf als Dateiinhalt. */
export function textDatei(text: string, kopf: ExportKopf, format: ExportFormat): string {
  const t = (text || "").replace(/\r\n?/g, "\n").trim();
  const zeilen = kopfZeilen(kopf);
  const titel = (kopf.titel || "").trim();
  if (format === "md") {
    const teile: string[] = [];
    if (titel) teile.push(`# ${mdZeileSchuetzen(titel)}`);
    if (zeilen.length) teile.push(zeilen.map((z) => `*${mdZeileSchuetzen(z)}*`).join("  \n"));
    teile.push(mdText(t));
    return teile.join("\n\n") + "\n";
  }
  const teile: string[] = [];
  if (titel) teile.push(titel + "\n" + "=".repeat(Math.min(Math.max(titel.length, 3), 72)));
  if (zeilen.length) teile.push(zeilen.join("\n"));
  const kopfTeil = teile.join("\n\n");
  return (kopfTeil ? kopfTeil + "\n\n" + "—".repeat(24) + "\n\n" : "") + t + "\n";
}

/** Die ganze Schatzkammer als eine Datei. Tresor-Texte werden mitgenommen und
 *  gekennzeichnet — wer sie nicht will, soll es sehen und nicht vermuten. */
export function schatzkammerDatei(
  list: Treasure[], format: ExportFormat, formName: (t: Treasure) => string, version = "",
): string {
  const kopf = format === "md"
    ? `# Schatzkammer\n\n*${list.length} Texte${version ? ` · Divergenzmaschine ${version}` : ""}*`
    : `Schatzkammer — ${list.length} Texte${version ? ` · Divergenzmaschine ${version}` : ""}`;
  const eintraege = list.map((x, i) => {
    const k: ExportKopf = {
      form: formName(x), datum: x.d, who: x.who, where: x.where, when: x.when, what: x.what,
      einstellungen: x.set, tresor: !!x.secret,
    };
    if (format === "md") {
      return [`## ${i + 1}`, kopfZeilen(k).map((z) => `*${mdZeileSchuetzen(z)}*`).join("  \n"), mdText(x.t)]
        .filter(Boolean).join("\n\n");
    }
    return [`# ${i + 1}`, ...kopfZeilen(k), "", (x.t || "").trim()].join("\n");
  });
  const trenner = format === "md" ? "\n\n---\n\n" : "\n\n" + "—".repeat(24) + "\n\n";
  return [kopf, ...eintraege].join(trenner) + "\n";
}

/** Dateiname ohne Umlaute und Sonderzeichen, damit er überall durchgeht. */
export function dateiname(stamm: string, titel: string, format: ExportFormat, datum = new Date()): string {
  const slug = (titel || "")
    .toLowerCase()
    .replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue").replace(/ß/g, "ss")
    .normalize("NFKD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")
    .slice(0, 40).replace(/-+$/, "");
  const tag = datum.toISOString().slice(0, 10);
  return [stamm, slug, tag].filter(Boolean).join("_") + "." + format;
}

/** Datum und Uhrzeit fuer den Kopf: „2026-09-22 14:03", in Ortszeit.
 *  Nicht toISOString — das rechnet nach UTC und datiert abends zurueck. */
export function zeitStempel(d = new Date()): string {
  const z = (n: number): string => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${z(d.getMonth() + 1)}-${z(d.getDate())} ${z(d.getHours())}:${z(d.getMinutes())}`;
}

// ── Browser ──────────────────────────────────────────────────────────────────

/** Lädt einen Text als Datei herunter. Der Anker muss im Dokument hängen, sonst
 *  übergeht ihn Firefox; die Adresse wird erst nach dem Klick freigegeben. */
export function ladeHerunter(inhalt: string, name: string, format: ExportFormat): void {
  const mime = format === "md" ? "text/markdown;charset=utf-8" : "text/plain;charset=utf-8";
  const url = URL.createObjectURL(new Blob([inhalt], { type: mime }));
  const a = document.createElement("a");
  a.href = url; a.download = name; a.style.display = "none";
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}

/** Ein Text mit Kopf als Datei — der eine Weg fuer Studio und Lesemodus.
 *  Rueckgabe: false, wenn nichts zu speichern war. */
export function speichereText(text: string, kopf: ExportKopf, format: ExportFormat): boolean {
  if (!(text || "").trim()) return false;
  const jetzt = new Date();
  const voll: ExportKopf = { datum: zeitStempel(jetzt), ...kopf };
  ladeHerunter(textDatei(text, voll, format), dateiname("divergenz", voll.titel || voll.form || "", format, jetzt), format);
  return true;
}
