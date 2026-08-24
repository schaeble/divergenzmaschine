// Wächter: meldet Module, die still veraltet sind.
//
// Anlass ist ein Muster, das sich über viele Sitzungen wiederholt hat. Der
// Preset-Assistent führte durch sieben Listen, während die Wortbank acht hatte.
// Der Autopilot würfelte aus eigenen Reglerlisten, in denen die Hälfte der
// Werte gar nicht existierte. Die Auflösung von „auto" in `buildStory` kannte
// „rekombination" nicht — ausgerechnet das Verfahren, das im Studio die Vorgabe
// ist. Eine 5-7-5-Prüfung stand da und wurde von niemandem aufgerufen.
//
// Keiner dieser Fälle hat je eine Fehlermeldung erzeugt. Nichts war kaputt,
// alles lief — es tat nur nicht, was es behauptete. Das ist die charakteristische
// Fehlerart dieses Projekts, und sie hat immer dieselbe Wurzel: EINE ZWEITE
// LISTE. Irgendwo steht etwas zum zweiten Mal, das eine maßgebliche Quelle hat,
// und beim nächsten Ausbau wird nur die eine nachgezogen.
//
// Der Wächter sucht deshalb nicht nach Fehlern, sondern nach ZWEITEN LISTEN.
//
// Er prüft am Quelltext, nicht zur Laufzeit — im Browser gibt es keinen
// Quelltext. Sein Ort ist der Prüfstand, nicht die Oberfläche.
//
// AUSWEG: Manche zweite Liste ist gewollt (eine bewusste Teilmenge). Eine Zeile
// mit `WAECHTER-OK:` und einer Begründung in den zehn Zeilen davor nimmt die
// Stelle aus. Ohne Begründung wäre die Ausnahme genau die Tür, durch die der
// nächste stille Verfall kommt.
import { readFileSync, readdirSync } from "fs";

const fails: string[] = [];
const zeilen: string[] = [];
let geprueft = 0;
const ist = (name: string, wert: unknown, soll: unknown): void => {
  geprueft++;
  if (wert === soll) zeilen.push(`  ✓ ${name}`);
  else { zeilen.push(`  ✗ ${name}`); fails.push(`${name}: „${String(wert)}“ — erwartet „${String(soll)}“`); }
};
const wahr = (name: string, b: boolean): void => ist(name, b, true);

const dateien: string[] = [];
const geh = (d: string): void => {
  for (const e of readdirSync(d, { withFileTypes: true })) {
    if (e.isDirectory()) geh(d + "/" + e.name);
    else if (e.name.endsWith(".ts")) dateien.push(d + "/" + e.name);
  }
};
geh("src");
const inhalt = new Map(dateien.map((f) => [f, readFileSync(f, "utf8")]));

/** Steht in den zehn Zeilen über der Fundstelle eine begründete Ausnahme? */
const freigegeben = (quelle: string, stelle: number): boolean => {
  const vorher = quelle.slice(0, stelle).split("\n").slice(-10).join("\n");
  return /WAECHTER-OK:\s*\S+/.test(vorher);
};

// ── 1 · Zweite Wertelisten ──────────────────────────────────────────────────
// Die Reglerwerte stehen EINMAL in generation/optionen.ts. Ein Feld-Literal,
// das überwiegend aus ihnen besteht, ist eine Kopie — auch wenn sie heute noch
// stimmt. Beim Autopiloten stimmte sie auch, bis sie es nicht mehr tat.
//
// Nur LISTEN werden gemeldet, keine Vergleiche: `input.form === "haiku"` ist
// Benutzung, keine Zweitliste. Ohne diese Unterscheidung meldete ein erster
// Versuch 37 Stellen, von denen drei echt waren — und eine Warnliste, die zu
// neun Zehnteln Fehlalarm ist, wird nach zwei Wochen ignoriert.
const opt = inhalt.get("src/generation/optionen.ts") || "";
const kanon: Record<string, string[]> = {};
// Nicht-gierig bis zum ERSTEN „];" — mit `\n\];` verschluckte das Muster die
// einzeiligen Listen und führte mehrere zu einer zusammen. Der Wächter meldete
// dadurch Stellen, die gegen eine Liste verstießen, die es so nie gab. Ein
// Wächter, der falsch misst, ist schlimmer als keiner: Man lernt, ihm nicht zu
// glauben.
for (const m of opt.matchAll(/export const (\w+_OPTS): Wahlliste = \[([\s\S]*?)\];/g)) {
  kanon[m[1]!] = [...m[2]!.matchAll(/\["([^"]+)",/g)].map((x) => x[1]!);
}
zeilen.push("  · Listen: " + Object.entries(kanon).map(([k, v]) => `${k}(${v.length})`).join(" "));
wahr("die maßgeblichen Wertelisten sind auffindbar", Object.keys(kanon).length >= 6);

const kopien: string[] = [];
for (const [f, s] of inhalt) {
  // types.ts hält die Typen, optionen.ts die Werte — beide sind die Quelle.
  if (f.endsWith("optionen.ts") || f.endsWith("types.ts")) continue;
  for (const m of s.matchAll(/\[[^[\]{}]{10,400}\]/g)) {
    const strings = [...m[0].matchAll(/["']([^"']+)["']/g)].map((x) => x[1]!);
    if (strings.length < 4) continue;
    for (const [name, werte] of Object.entries(kanon)) {
      const treffer = strings.filter((x) => werte.includes(x));
      if (treffer.length < 4 || treffer.length < strings.length * 0.7) continue;
      if (freigegeben(s, m.index!)) continue;
      kopien.push(`${f}:${s.slice(0, m.index!).split("\n").length} — ${treffer.length} Werte aus ${name}`);
    }
  }
}
ist("keine zweite Werteliste neben optionen.ts", kopien.length, 0);
if (kopien.length) kopien.forEach((k) => zeilen.push(`      ${k}`));

// ── 2 · Werte, die es nirgends gibt ─────────────────────────────────────────
// Die Gegenrichtung, und die ist die gefährlichere: Ein Wert, der in einer
// Liste steht, aber in keiner maßgeblichen — der Regler kann ihn nie setzen,
// und wer ihn auswertet, wartet vergebens. „split" als Perspektive war so ein
// Fall: von „auto" wählbar, von niemandem verarbeitet.
const erfunden: string[] = [];
for (const [f, s] of inhalt) {
  if (f.endsWith("optionen.ts") || f.endsWith("types.ts")) continue;
  for (const m of s.matchAll(/\[[^[\]{}]{10,400}\]/g)) {
    const strings = [...m[0].matchAll(/["']([^"']+)["']/g)].map((x) => x[1]!);
    if (strings.length < 4) continue;
    for (const [name, werte] of Object.entries(kanon)) {
      const treffer = strings.filter((x) => werte.includes(x));
      // Nur wenn die Liste erkennbar DIESE Regler meint, zählt ein Ausreißer.
      if (treffer.length < strings.length - 1 || treffer.length < 4) continue;
      const fremd = strings.filter((x) => !werte.includes(x));
      if (!fremd.length || freigegeben(s, m.index!)) continue;
      erfunden.push(`${f}:${s.slice(0, m.index!).split("\n").length} — „${fremd.join(", ")}" steht in keiner ${name}`);
    }
  }
}
ist("kein Wert ohne Entsprechung in den Reglerlisten", erfunden.length, 0);
if (erfunden.length) erfunden.forEach((k) => zeilen.push(`      ${k}`));

// ── 3 · Verwaiste Module ────────────────────────────────────────────────────
// Ein Modul, das niemand einbindet, läuft nie — und veraltet deshalb
// unbemerkt. Es ist kein Fehler, aber eine Entscheidung, die jemand treffen
// sollte: ausbauen oder wegwerfen.
const verwaist: string[] = [];
for (const f of dateien) {
  const name = f.split("/").pop()!.replace(/\.ts$/, "");
  if (name === "main" || f.endsWith(".data.ts")) continue;
  const benutzt = [...inhalt.entries()].some(([g, s]) =>
    g !== f && new RegExp(`["'/]${name}["']`).test(s));
  if (!benutzt) verwaist.push(f);
}
// Als BEFUND, nicht als Fehler: Toter Code bricht nichts, und ihn zum
// Fehlschlag zu machen hieße, den Prüfstand für eine Aufräumfrage rot zu
// färben. Genau daran gewöhnt man sich, und dann sieht man auch die echten
// nicht mehr.
zeilen.push(verwaist.length
  ? `  · Befund: ${verwaist.length} Modul(e) werden nirgends eingebunden — ${verwaist.join(", ")}`
  : "  · Befund: kein verwaistes Modul");

// ── 4 · Der Wächter prüft sich selbst ───────────────────────────────────────
// Ein Wächter, der nichts finden KANN, sieht aus wie einer, der nichts findet.
const probe = 'const X = ["bureau", "tech", "body", "myth", "absurd", "post"];';
const treffer = Object.entries(kanon).some(([, werte]) => {
  const strings = [...probe.matchAll(/["']([^"']+)["']/g)].map((x) => x[1]!);
  const t = strings.filter((x) => werte.includes(x));
  return t.length >= 4 && t.length >= strings.length * 0.7;
});
wahr("eine untergeschobene Kopie würde erkannt", treffer);
wahr("die Freigabe braucht eine Begründung",
  !freigegeben("// WAECHTER-OK:\nx", 20) || /WAECHTER-OK:\s*\S/.test("WAECHTER-OK: Grund"));
ist("ohne Begründung greift die Freigabe nicht", freigegeben("// nur ein Kommentar\n", 22), false);

// ── Ergebnis ────────────────────────────────────────────────────────────────
console.log(`Wächter — ${geprueft} Prüfungen am Quelltext:`);
zeilen.forEach((z) => console.log(z));
const proc = globalThis as unknown as { process?: { exit: (c: number) => void } };
if (fails.length) {
  console.error(`\n❌ ${fails.length} Modul(e) sind still veraltet:`);
  fails.forEach((f) => console.error("  - " + f));
  console.error("  Entweder aus der maßgeblichen Quelle ableiten oder mit „WAECHTER-OK: <Grund>\" freigeben.");
  proc.process?.exit(1);
} else {
  console.log(`\n✅ Wächter: keine zweite Liste, kein erfundener Wert.`);
}
