// Video/Multi-Shot: Shot-Beschreibungen + Sequenz-Text.
import type { StoryKit } from "../types";
import { pick, clean, ensurePunct } from "../text-utils";
import { cap } from "./beats";
import { VIDEO_RULES, VIDEO_CAM_EXTENDED, VIDEO_LIGHT, VIDEO_TEX } from "./video.data";

export const clampShotCount = (n: number): number => Math.max(3, Math.min(10, Number.isFinite(n) ? n : 5));
export const clampTotalSec = (n: number): number => Math.max(3, Math.min(600, Number.isFinite(n) ? n : 15));
const fmtSec = (x: number): string => { if (!isFinite(x)) return "0s"; const v = Math.round(x * 10) / 10; return (v % 1 === 0 ? v.toFixed(0) : String(v)) + "s"; };
const pickSymbol = (): string => pick(["⊗", "⟂", "⟡", "⌁", "⟟", "⟐", "✶", "⟁"]);
const stripTailPunct = (s: string): string => clean(s).replace(/[.!?…]+$/, "");

// Finite Verbformen, die im Nebensatz ans Ende gehoeren. Bewusst eine kurze,
// geschlossene Liste: Lieber die Fuegung vermeiden als sie falsch bauen.
const FINIT = /^(ist|sind|war|waren|hat|haben|hatte|wird|werden|wurde|kann|koennen|können|muss|müssen|will|wollen|bleibt|bleiben|steht|stehen|geht|gehen|kommt|kommen|liegt|liegen|zeigt|zeigen|faellt|fällt|reicht|gilt|klingt|wirkt|scheint|fehlt|passt|stimmt)$/i;

/** Bringt einen Hauptsatz in die Nebensatzstellung: "die Frist ist vorbei"
 *  -> "die Frist vorbei ist". Gibt null zurueck, wenn die Form unklar ist -
 *  dann baut der Aufrufer lieber einen Doppelpunkt als einen falschen dass-Satz.
 *  Vorher stand im Text "Tim bemerkt, dass die Zustaendigkeit ist unklar". */
function verbAnsEnde(satz: string): string | null {
  const w = stripTailPunct(satz).split(/\s+/).filter(Boolean);
  if (w.length < 3 || w.length > 9) return null;
  const vi = w.findIndex((x) => FINIT.test(x));
  if (vi < 1 || vi === w.length - 1) return null;        // schon am Ende oder nicht gefunden
  if (w.slice(vi + 1).some((x) => FINIT.test(x))) return null;   // zwei finite Verben: zu unsicher
  const verb = w[vi]!;
  return [...w.slice(0, vi), ...w.slice(vi + 1), verb].join(" ");
}
function normalizePlace(W: string): string {
  const w = clean(W);
  if (!w) return "an einem Ort";
  if (/^(im|am|in|auf|bei|unter|über|vor|hinter)\b/i.test(w)) return w;
  return "an einem " + w;
}

function buildVideoShots(kit: StoryKit, shotCount: number, lenTarget = 0): string[] {
  const sym = pickSymbol();
  const place = normalizePlace(kit.W);
  const who = kit.P;
  const objClean = stripTailPunct(pick([kit.hookDat, kit.propDat]));
  const shots: string[] = [];
  shots.push(`${cap(place)} steht ${who} nahe ${objClean}. ${cap(pick(VIDEO_LIGHT))}. ${cap(pick(VIDEO_CAM_EXTENDED))}. ${cap(pick(VIDEO_TEX))}.`);
  const hindernis = verbAnsEnde(kit.obstacle);
  shots.push(`Regel: ${cap(pick(VIDEO_RULES))}. ${sym}. ${hindernis
    ? `${who} bemerkt, dass ${hindernis}`
    : `${who} bemerkt: ${stripTailPunct(kit.obstacle)}`}. ${cap(pick(VIDEO_CAM_EXTENDED))}.`);
  shots.push(`${ensurePunct(kit.turn)} Der Raum reagiert: ${sym} pulsiert, und ${pick(["die Wände atmen", "die Perspektive kippt", "der Boden verschiebt sich", "die Luft wird körnig"])}. ${cap(pick(VIDEO_LIGHT))}.`);
  shots.push((kit.AisClause || kit.AisInfinitiveLed)
    ? `${who} erkennt: ${stripTailPunct(kit.Apure)} — aber ${pick(["die Zeit springt", "die Regeln drehen sich um", "die Schatten lösen sich"])}. ${cap(pick(VIDEO_CAM_EXTENDED))}.`
    : `${who} ${kit.AleadVerb || (kit.AisInfinitiveLed ? "will" : "versucht")} ${stripTailPunct(kit.Apure)}, aber ${pick(["die Zeit springt", "die Regeln drehen sich um", "die Schatten lösen sich"])}. ${cap(pick(VIDEO_CAM_EXTENDED))}.`);
  shots.push(`${ensurePunct(kit.ending)} Nur: ${pick(["der Riss", "das Fenster", `das Symbol ${sym}`, "die Karte"])} bleibt sichtbar. ${cap(pick(VIDEO_TEX))}.`);
  while (shots.length < shotCount) {
    shots.splice(Math.min(shots.length, 4), 0, `${who} passiert an ${pick(["einer Kante", "einem Spiegel", "einer Tür ohne Griff"])} vorbei. ${cap(pick(VIDEO_LIGHT))}. ${cap(pick(VIDEO_CAM_EXTENDED))}.`);
  }
  // Bei hoher Ziellaenge bekommt jeder Shot zusaetzliche Bildangaben, statt dass
  // die Sequenz laenger wird - der Schnitt soll bei der eingestellten Shot-Zahl
  // bleiben.
  const fertig = shots.slice(0, shotCount);
  if (lenTarget > 0) {
    // Nicht rechnen, sondern nachlegen bis die Marke steht: Eine Formel aus
    // Shot-Zahl und Zieltext verfehlte sie deutlich (bei Ziel 400 kamen 207
    // Woerter heraus), weil die Grundbeschreibungen unterschiedlich lang sind.
    const zaehl = (): number => fertig.join(" ").split(/\s+/).filter(Boolean).length;
    for (let runde = 0; runde < 12 && zaehl() < lenTarget * 0.92; runde++) {
      for (let i = 0; i < fertig.length && zaehl() < lenTarget * 0.92; i++) {
        // Keine Bildangabe zweimal im selben Shot - "Floating dust. ... Floating
        // dust." liest sich wie ein Fehler, nicht wie eine Anweisung.
        const frei = (liste: string[]): string | null => {
          // Gross-/Kleinschreibung ignorieren: Eingesetzt wird mit cap(), in der
          // Liste steht die Kleinform - der Vergleich lief sonst immer ins Leere.
          const schon = fertig[i]!.toLowerCase();
          const offen = liste.filter((x) => !schon.includes(x.toLowerCase()));
          return offen.length ? pick(offen) : null;
        };
        const tex = frei(VIDEO_TEX as unknown as string[]);
        const licht = frei(VIDEO_LIGHT as unknown as string[]);
        if (!tex && !licht) break;
        fertig[i] += (tex ? " " + cap(tex) + "." : "") + (licht ? " " + cap(licht) + "." : "");
      }
    }
  }
  return fertig;
}

export function buildVideoSequenceText(kit: StoryKit, shotCount = 5, totalSec = 15, lenTarget = 0): string {
  const n = clampShotCount(shotCount);
  const total = clampTotalSec(totalSec);
  const dur = total / n;
  // F.2: Die Textmenge je Shot folgt dem Laengenregler. Die Shot-ZAHL bleibt am
  // eigenen Regler - sie ist eine Angabe fuer den Schnitt, keine Textlaenge.
  const shots = buildVideoShots(kit, n, lenTarget);
  const out = [`SEQUENZ — ${kit.mode.label || ""}`.trim(), `WER: ${kit.PRaw || kit.P}`, `WO: ${kit.W}`, `WANN: ${kit.T}`, `WAS: ${kit.A}`, `GESAMTLÄNGE: ${fmtSec(total)} • ${fmtSec(dur)} pro Shot`, ""];
  for (let i = 0; i < shots.length; i++) { out.push(`Shot ${i + 1} (${fmtSec(dur)})`, `DE: ${shots[i]}`, ""); }
  return out.join("\n");
}
