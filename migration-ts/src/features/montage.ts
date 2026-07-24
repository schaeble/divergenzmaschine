// Montage-Modus (Sammlungs-Ebene): fügt viele Fragmente nach einem Meta-Bogen
// zu einem Ganzen. Scheibe A — offline, reine Anordnung + gemeinsame Klammer.
// Als Daten gebaut, damit die KI-Weberei (Scheibe B) darauf aufsetzen kann.
export interface Fragment { id: string; text: string; source: string }

export interface MetaArc { id: string; label: string; short: string; ki?: boolean }
export const META_ARCS: MetaArc[] = [
  { id: "mosaik", label: "Mosaik", short: "Viele Blickwinkel nebeneinander; das Gesamtbild entsteht aus der Nachbarschaft." },
  { id: "jahreszeiten", label: "Jahreszeiten", short: "Die Fragmente werden auf Frühling → Winter verteilt — eine emotionale Kurve durch Anordnung." },
  { id: "divergenz", label: "Divergenz", short: "Ein Ursprung, mehrere Verzweigungen — ein Baum statt einer Linie." },
  { id: "kaleidoskop", label: "Kaleidoskop", short: "Reihenfolge, die jede Bedeutung der vorigen umfärbt." },
  { id: "emergenz", label: "Emergenz (KI)", short: "Die KI liest alle Fragmente und schreibt das Muster, das keines ausspricht.", ki: true },
  { id: "hyperlink", label: "Hyperlink (KI)", short: "Die KI verwebt die Fragmente zu sich kreuzenden Strängen.", ki: true },
];
export function isKiArc(id: string): boolean { return !!META_ARCS.find((a) => a.id === id)?.ki; }

const clean = (t: string): string => (t || "").trim();
const SEASONS = ["Frühling", "Sommer", "Herbst", "Winter"];
const KALEID = ["", "Und noch einmal, anders:", "Dasselbe, von der Seite:", "Wieder — verschoben:", "Und darunter:", "Noch einmal, kälter:"];

function bucketize<T>(arr: T[], n: number): T[][] {
  const out: T[][] = Array.from({ length: n }, () => [] as T[]);
  arr.forEach((x, i) => out[Math.min(n - 1, Math.floor(i / Math.ceil(arr.length / n)))]!.push(x));
  return out;
}

export function assemble(arcId: string, frags: Fragment[], klammer: string): string {
  const parts = frags.map((f) => clean(f.text)).filter(Boolean);
  if (!parts.length) return "";
  const head = clean(klammer) ? `» ${clean(klammer)} «\n\n` : "";

  switch (arcId) {
    case "jahreszeiten": {
      const buckets = bucketize(parts, 4);
      const secs = buckets.map((b, i) => b.length ? `${SEASONS[i]}\n\n${b.join("\n\n")}` : "").filter(Boolean);
      return head + secs.join("\n\n\n");
    }
    case "divergenz": {
      const [ursprung, ...rest] = parts;
      let out = head + "Ursprung\n\n" + ursprung;
      rest.forEach((p, i) => { out += `\n\n\n→ Möglichkeit ${i + 1}\n\n${p}`; });
      return out;
    }
    case "kaleidoskop": {
      // deterministische Umordnung (Interleave von außen nach innen) + Umdeut-Konnektoren
      const reordered: string[] = [];
      let lo = 0, hi = parts.length - 1;
      while (lo <= hi) { reordered.push(parts[lo]!); if (lo !== hi) reordered.push(parts[hi]!); lo++; hi--; }
      return head + reordered.map((p, i) => (i === 0 ? p : `${KALEID[i % KALEID.length]}\n\n${p}`)).join("\n\n\n");
    }
    case "mosaik":
    default:
      return head + parts.join("\n\n—\n\n");
  }
}

// ---- Persistenz (überlebt Tabwechsel) ----
const MKEY = "dm_montage_v1";
export interface MontageState { fragments: Fragment[]; arc: string; klammer: string; }
export function loadMontage(): MontageState {
  try { const v = JSON.parse(localStorage.getItem(MKEY) || "null"); if (v && Array.isArray(v.fragments)) return v as MontageState; } catch { /* leer */ }
  return { fragments: [], arc: "mosaik", klammer: "" };
}
export function saveMontage(s: MontageState): void {
  try { localStorage.setItem(MKEY, JSON.stringify(s)); } catch { /* voll */ }
}
export const newId = (): string => Math.random().toString(36).slice(2, 9);

// ---- KI-Weberei (Scheibe B): Prompt-Bau ----
export function buildMontagePrompt(arcId: string, frags: Fragment[], klammer: string): string {
  const numbered = frags.map((f, i) => `${i + 1}. ${clean(f.text)}`).join("\n\n");
  const kl = clean(klammer) ? `Gemeinsame Klammer: ${clean(klammer)}.\n` : "";
  if (arcId === "hyperlink") {
    return "Unten stehen mehrere Fragmente als getrennte Erzählstränge (aus einem generativen Textwerkzeug). "
      + "Verwebe sie zu EINEM zusammenhängenden deutschen Text: behalte ihre Bilder und Sätze weitgehend bei, "
      + "aber füge kurze Übergänge ein, die zeigen, wie die Stränge einander kreuzen — ein gemeinsamer Ort, eine Figur, "
      + "ein Moment, an dem sie sich berühren. Erfinde diesen Knoten, wenn nötig. Bewahre den dichten, surrealen Ton; "
      + "glätte die Fremdheit nicht weg. Gib NUR den verwobenen Text zurück.\n\n" + kl + "\nStränge:\n" + numbered;
  }
  // Emergenz
  return "Unten stehen mehrere kurze, scheinbar unabhängige Fragmente (aus einem generativen Textwerkzeug). "
    + "Lies sie als Ganzes. Schreibe einen KURZEN deutschen Schlusstext (4 bis 8 Sätze), der ein verbindendes Muster, "
    + "eine gemeinsame Bewegung oder Bedeutung aufdeckt, die keines der Fragmente ausspricht. Fasse NICHT zusammen und "
    + "wiederhole die Fragmente nicht — schreibe die Erkenntnis, die zwischen ihnen liegt. Dichter, ruhiger Ton. "
    + "Gib NUR den Schlusstext zurück.\n\n" + kl + "\nFragmente:\n" + numbered;
}
