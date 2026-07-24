// Montage-Modus (Sammlungs-Ebene): fügt viele Fragmente nach einem Meta-Bogen
// zu einem Ganzen. Scheibe A — offline, reine Anordnung + gemeinsame Klammer.
// Als Daten gebaut, damit die KI-Weberei (Scheibe B) darauf aufsetzen kann.
export interface Fragment { id: string; text: string; source: string }

export interface MetaArc { id: string; label: string; short: string }
export const META_ARCS: MetaArc[] = [
  { id: "mosaik", label: "Mosaik", short: "Viele Blickwinkel nebeneinander; das Gesamtbild entsteht aus der Nachbarschaft." },
  { id: "jahreszeiten", label: "Jahreszeiten", short: "Die Fragmente werden auf Frühling → Winter verteilt — eine emotionale Kurve durch Anordnung." },
  { id: "divergenz", label: "Divergenz", short: "Ein Ursprung, mehrere Verzweigungen — ein Baum statt einer Linie." },
  { id: "kaleidoskop", label: "Kaleidoskop", short: "Reihenfolge, die jede Bedeutung der vorigen umfärbt." },
];

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
