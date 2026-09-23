// Prüfstand Geschmack (4.370.0).
//
// Der gefährliche Fehler hier ist nicht der Absturz, sondern die zu schnelle
// Maschine: Ein einziger Klick darf die Auslese nicht kippen, und ein Motiv,
// das dreimal gefiel und dreimal störte, darf nicht wie ein unbekanntes
// aussehen. Beides wird unten mit Gegenprobe geprüft — erst der ungeglättete
// Wert, dann der geglättete.
import { JSDOM } from "jsdom";
const dom = new JSDOM("<!doctype html><html><body></body></html>", { url: "https://x.test/" });
const G = globalThis as unknown as Record<string, unknown>;
for (const k of ["window", "document", "localStorage", "navigator", "Blob", "URL"]) {
  try { Object.defineProperty(G, k, { value: (dom.window as unknown as Record<string, unknown>)[k], writable: true, configurable: true }); } catch { /* da */ }
}

import {
  trageUrteilEin, ladeGeschmack, loescheGeschmack, geschmackWert, neigung, abneigung,
  wertung, urteile, reglerSchluessel, GESCHMACK_REGLER,
} from "../src/features/geschmack";
import { feedLivePools, schwaecheLivePools, loadLive, clearLivePools, LIVE_W } from "../src/features/livepools";

const fails: string[] = [];
let geprueft = 0, bestanden = 0;
const ist = (name: string, wert: unknown, soll: unknown): void => {
  geprueft++;
  if (wert === soll) bestanden++; else fails.push(`${name}: „${String(wert)}“ — erwartet „${String(soll)}“`);
};
const wahr = (name: string, b: boolean, zusatz = ""): void => ist(name + (zusatz ? ` (${zusatz})` : ""), b, true);
const nahe = (name: string, wert: number, soll: number, tol = 0.001): void => {
  geprueft++;
  if (Math.abs(wert - soll) <= tol) bestanden++; else fails.push(`${name}: ${wert.toFixed(3)} — erwartet ${soll.toFixed(3)}`);
};

const TEXT_A = "Im Zimmer steht ein Wächter. Die Fenster hängen über dem Hafen. Ein Koffer bleibt zu.";
const TEXT_B = "Der Alarm läuft durch das Protokoll. Eine Frist gilt rückwirkend im Amt.";
const SET_A = { tone: "melancholisch", structure: "rekombination", preset: "rimbaud", lenTarget: "180", serie: "X" };
const SET_B = { tone: "ironisch", structure: "klassisch", preset: "bureau", lenTarget: "90" };

// ── 1 · Glättung ────────────────────────────────────────────────────────────
{
  nahe("ein einziges Ja bleibt gedämpft", wertung({ plus: 1, minus: 0 }), 1 / 3);
  nahe("vier Ja nähern sich 1", wertung({ plus: 4, minus: 0 }), 4 / 6);
  nahe("strittig ergibt 0", wertung({ plus: 3, minus: 3 }), 0);
  ist("unbekannt hat keine Urteile", urteile({ plus: 0, minus: 0 }), 0);
  ist("strittig hat sechs Urteile", urteile({ plus: 3, minus: 3 }), 6);
  // Gegenprobe: ohne Glättung wäre der erste Klick schon voller Ausschlag,
  // und strittig sähe aus wie unbekannt.
  const roh = (p: number, m: number): number => (p + m ? (p - m) / (p + m) : 0);
  ist("Gegenprobe: ungeglättet kippt ein Klick auf 1", roh(1, 0), 1);
  ist("Gegenprobe: ungeglättet ist strittig = unbekannt", roh(3, 3), roh(0, 0));
}

// ── 2 · Urteile buchen ──────────────────────────────────────────────────────
{
  loescheGeschmack();
  trageUrteilEin(TEXT_A, SET_A, 1);
  const s = ladeGeschmack();
  ist("ein Ja gezählt", s.gefallen, 1);
  ist("kein Nein", s.verworfen, 0);
  wahr("Wendungen aufgenommen", s.phrasen.length > 0, String(s.phrasen.length));
  wahr("alle Wendungen klein geschrieben", s.phrasen.every((e) => e.t === e.t.toLowerCase()));
  wahr("Stil-Regler gebucht", s.regler.some((e) => e.t === reglerSchluessel("tone", "melancholisch")));
  wahr("Preset gebucht", s.regler.some((e) => e.t === reglerSchluessel("preset", "rimbaud")));
  wahr("Länge NICHT gebucht", !s.regler.some((e) => e.t.startsWith("lenTarget=")), s.regler.map((e) => e.t).join(","));
  wahr("Serie NICHT gebucht", !s.regler.some((e) => e.t.startsWith("serie=")));
  wahr("nur erlaubte Regler", s.regler.every((e) => (GESCHMACK_REGLER as readonly string[]).includes(e.t.slice(0, e.t.indexOf("=")))));

  trageUrteilEin(TEXT_A, SET_A, -1);
  const s2 = ladeGeschmack();
  const ton = s2.regler.find((e) => e.t === reglerSchluessel("tone", "melancholisch"))!;
  ist("Ja und Nein stehen getrennt", `${ton.plus}/${ton.minus}`, "1/1");
  nahe("strittiger Ton wertet 0", wertung(ton), 0);
  ist("beide Zähler geführt", `${s2.gefallen}/${s2.verworfen}`, "1/1");
}

// ── 3 · Neigung und Abneigung ───────────────────────────────────────────────
{
  loescheGeschmack();
  for (let i = 0; i < 3; i++) trageUrteilEin(TEXT_A, SET_A, 1);
  for (let i = 0; i < 3; i++) trageUrteilEin(TEXT_B, SET_B, -1);
  const n = neigung();
  const ton = n.find((x) => x.regler === "tone");
  ist("bevorzugter Ton erkannt", ton?.wert, "melancholisch");
  wahr("Neigung ist positiv", !!ton && ton.punkte > 0, String(ton?.punkte.toFixed(2)));
  wahr("je Regler nur eine Stellung", new Set(n.map((x) => x.regler)).size === n.length);
  wahr("der abgelehnte Ton steht NICHT in der Neigung", !n.some((x) => x.wert === "ironisch"), n.map((x) => x.regler + "=" + x.wert).join(","));
  const ab = abneigung();
  wahr("abgelehnter Ton steht in der Abneigung", ab.some((x) => x.wert === "ironisch"), ab.map((x) => x.wert).join(","));
  wahr("Abneigung ist negativ", ab.every((x) => x.punkte < 0));
  // Gegenprobe: ein einzelnes Urteil reicht nicht.
  loescheGeschmack();
  trageUrteilEin(TEXT_A, SET_A, 1);
  ist("ein einziges Urteil ergibt noch keine Neigung", neigung().length, 0);
  ist("mit minUrteile=1 dagegen schon", neigung(undefined, 1).length > 0, true);
}

// ── 4 · Wirkung auf die Auslese ─────────────────────────────────────────────
{
  loescheGeschmack();
  ist("ohne Urteile ist der Wert 0", geschmackWert(TEXT_A), 0);
  for (let i = 0; i < 3; i++) { trageUrteilEin(TEXT_A, SET_A, 1); trageUrteilEin(TEXT_B, SET_B, -1); }
  const gut = geschmackWert(TEXT_A), schlecht = geschmackWert(TEXT_B);
  wahr("gemochter Text bekommt Plus", gut > 0, gut.toFixed(2));
  wahr("verworfener Text bekommt Minus", schlecht < 0, schlecht.toFixed(2));
  wahr("fremder Text bleibt bei 0", geschmackWert("Ein völlig anderer Satz über Pilze.") === 0);
  wahr("der Wert bleibt im Rahmen", Math.abs(gut) <= 1 && Math.abs(schlecht) <= 1);
  // In der Auslese sind das 20 Punkte — genug zum Entscheiden, zu wenig zum Tragen.
  wahr("Ausschlag in der Auslese unter 20 Punkten", Math.abs(gut * 20) < 20, (gut * 20).toFixed(1));
}

// ── 5 · Verwerfen nimmt die Fütterung zurück ────────────────────────────────
{
  clearLivePools();
  feedLivePools(TEXT_A, LIVE_W.gen);
  const vorher = loadLive();
  wahr("Erzeugen füttert die Pools", vorher.length > 0, String(vorher.length));
  schwaecheLivePools(TEXT_A, LIVE_W.gen);
  ist("Verwerfen nimmt die Fütterung zurück", loadLive().length, 0);

  // Was mehrfach bestätigt wurde, überlebt ein einzelnes Nein.
  clearLivePools();
  feedLivePools(TEXT_A, LIVE_W.schatz);   // Gewicht 3
  schwaecheLivePools(TEXT_A, LIVE_W.gen); // Gewicht 1
  const rest = loadLive();
  wahr("Gemerktes überlebt ein Verwerfen", rest.length > 0 && rest.every((e) => e.n === LIVE_W.schatz - LIVE_W.gen), rest.map((e) => e.n).join(","));
  // Fremder Text lässt die Pools in Ruhe.
  const vorZahl = loadLive().length;
  schwaecheLivePools("Ein völlig anderer Satz über Pilze.", LIVE_W.gen);
  ist("fremder Text schwächt nichts", loadLive().length, vorZahl);
  clearLivePools();
}

console.log(`Prüfstand Geschmack — ${geprueft} Prüfungen, ${bestanden} bestanden`);
const proc = globalThis as unknown as { process?: { exit: (c: number) => void } };
if (fails.length) {
  console.error(`\n❌ Geschmack: ${fails.length} Fehler:`);
  fails.forEach((f) => console.error("  - " + f));
  proc.process?.exit(1);
} else {
  console.log(`\n✅ Geschmack: alle ${geprueft} Prüfungen bestanden.`);
}
