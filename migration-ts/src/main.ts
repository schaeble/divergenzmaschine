import "./ui/theme.css";
// Einstieg: Tab-App montieren + Service Worker registrieren (PWA).
import { mountApp } from "./ui/app";
import { applyTheme, loadTheme } from "./features/theme";

applyTheme(loadTheme());
const root = document.getElementById("app");
if (root) mountApp(root);

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch(() => { /* offline nicht verfügbar */ });
  });
}
