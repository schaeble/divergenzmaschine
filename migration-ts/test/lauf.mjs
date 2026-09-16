// Laeufer der Pruefstaende (4.366.0): buendelt jeden genannten Pruefstand mit
// esbuild nach test/.tmp/<name>.cjs und laeuft ihn; bricht beim ersten roten ab.
//
// Warum: Der alte Gesamtlauf war eine 56-teilige Kette in package.json. In
// einer Werkstatt mit Zeitgrenze erreichte er nur die ersten sechzehn — die
// uebrigen vierzig liefen wochenlang nicht mit, drei waren rot, ohne dass es
// jemand sah. Jetzt: zwei Haelften (test:a, test:b), jede fuer sich unter
// der Grenze, und `npm run test:einer <name>` fuer einen einzelnen. Die
// Buendel liegen in test/.tmp/ (nicht im Repository).
import { spawnSync } from "node:child_process";
import { mkdirSync } from "node:fs";

const namen = process.argv.slice(2);
if (!namen.length) { console.error("Aufruf: node test/lauf.mjs <pruefstand> [<pruefstand> …]"); process.exit(2); }
mkdirSync("test/.tmp", { recursive: true });
const t0 = Date.now();
for (const n of namen) {
  const out = `test/.tmp/${n}.cjs`;
  const b = spawnSync("npx", ["esbuild", `test/${n}.ts`, "--bundle", "--platform=node", "--format=cjs", `--outfile=${out}`, "--log-level=error", "--external:jsdom"], { stdio: "inherit" });
  if (b.status !== 0) { console.error(`\n❌ Buendeln fehlgeschlagen: ${n}`); process.exit(1); }
  const r = spawnSync("node", [out], { stdio: "inherit" });
  if (r.status !== 0) { console.error(`\n❌ Pruefstand rot: ${n}`); process.exit(1); }
}
console.log(`\n${namen.length} Pruefstaende gruen in ${((Date.now() - t0) / 1000).toFixed(0)} s: ${namen.join(", ")}`);
