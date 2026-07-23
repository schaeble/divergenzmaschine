// Einzige Versionsquelle: package.json. Dieses Skript trägt die Version in alle
// abhängigen Stellen ein, damit sie beim Build nicht mehr von Hand gepflegt werden.
// Läuft automatisch als prebuild.
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const version = JSON.parse(readFileSync(join(root, "package.json"), "utf8")).version;
if (!version) { console.error("sync-version: keine version in package.json"); process.exit(1); }

const edits = [
  ["src/version.ts", (s) => s.replace(/export const VERSION = "[^"]*";/, `export const VERSION = "${version}";`)],
  ["public/version.txt", () => version + "\n"],
  ["public/sw.js", (s) => s.replace(/const CACHE = '[^']*';/, `const CACHE = 'divergenzmaschine-ts-${version}';`)],
  ["index.html", (s) => s.replace(/(<meta name="dm-build" content=")[^"]*(")/, `$1${version}$2`)],
];

let changed = 0;
for (const [rel, fn] of edits) {
  const p = join(root, rel);
  const before = readFileSync(p, "utf8");
  const after = fn(before);
  if (after !== before) { writeFileSync(p, after); changed++; }
}
console.log(`sync-version: ${version} → ${changed} Datei(en) aktualisiert`);
