import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";

// Bündelt alles in EINE index.html — wie heute, aber aus getypten Quellen erzeugt.
export default defineConfig({
  plugins: [viteSingleFile()],
  build: { target: "es2020", cssCodeSplit: false, assetsInlineLimit: 100000000 },
});
