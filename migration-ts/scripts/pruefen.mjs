// Der Gesamtlauf der Pruefstaende (4.365.2).
//
// Vorher lief npm test als EINE Befehlskette: esbuild + node je Pruefstand,
// verkettet mit &&. Sie brach beim ersten Fehler ab — und wer sie mit einer
// Zeitgrenze aufrief, sah nur die ersten sechzehn; die uebrigen 41 liefen
// wochenlang nicht mit, drei waren rot, niemand sah es.
//
// Jetzt: jeder Pruefstand laeuft als eigener Prozess mit eigener Zeitgrenze;
// nichts bricht die Reihe ab; am Ende steht die Tafel — welche gruen, welche
// rot, welche zu langsam — und die Zahl. Der Lauf laesst sich in Teile
// zerlegen (node scripts/pruefen.mjs 1/3), damit auch ein Aufrufer mit
// kurzer Zeitgrenze alles sieht, Teil fuer Teil.
//
// Aufruf: node scripts/pruefen.mjs            alle
//         node scripts/pruefen.mjs 2/3        zweites Drittel
//         node scripts/pruefen.mjs studio     einer
import { readdirSync, existsSync } from "fs";
import { spawnSync } from "child_process";

const ZEIT_JE = 290_000;
const alle = readdirSync("test").filter((f) => /^[a-z0-9-]+\.ts$/.test(f) && !/\.data\.ts$/.test(f)).map((f) => f.replace(/\.ts$/, "")).sort();
const arg = process.argv[2] || "";
let liste = alle;
const teil = arg.match(/^(\d+)\/(\d+)$/);
if (teil) { const [, n, m] = teil.map(Number); const je = Math.ceil(alle.length / m); liste = alle.slice((n - 1) * je, n * je); }
else if (arg) liste = alle.filter((t) => t === arg);

const tafel = [];
let gruen = 0, rot = 0;
for (const t of liste) {
  const out = `test/.${t}.lauf.cjs`;
  const b = spawnSync("npx", ["esbuild", `test/${t}.ts`, "--bundle", "--platform=node", "--format=cjs", `--outfile=${out}`, "--log-level=error", "--external:jsdom"], { encoding: "utf8" });
  if (b.status !== 0) { tafel.push(`❌ ${t}: baut nicht — ${(b.stderr || "").split("\n")[0]}`); rot++; continue; }
  const t0 = Date.now();
  const r = spawnSync("node", [out], { encoding: "utf8", timeout: ZEIT_JE, maxBuffer: 64 * 1024 * 1024 });
  const dauer = ((Date.now() - t0) / 1000).toFixed(0);
  const text = (r.stdout || "") + (r.stderr || "");
  const ok = r.status === 0 && /✅/.test(text);
  const zeile = (text.match(/^(✅|❌)[^\n]*/m) || [ok ? `✅ ${t}` : `❌ ${t}`])[0];
  const fehler = (text.match(/^  - [^\n]*/gm) || []).slice(0, 4);
  if (r.error && r.error.code === "ETIMEDOUT") { tafel.push(`❌ ${t}: Zeitgrenze (${ZEIT_JE / 1000} s)`); rot++; continue; }
  if (ok) gruen++; else rot++;
  tafel.push(`${zeile} · ${dauer} s` + (fehler.length && !ok ? "\n" + fehler.join("\n") : ""));
}
console.log(tafel.join("\n"));
console.log(`\n${gruen} gruen · ${rot} rot · ${liste.length} von ${alle.length} Pruefstaenden` + (teil ? ` (Teil ${arg})` : ""));
if (existsSync("test") && rot) process.exit(1);
