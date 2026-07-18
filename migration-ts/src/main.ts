import "./ui/theme.css";
// Einstieg: Tab-App montieren + Service Worker registrieren (PWA).
import { mountApp } from "./ui/app";
import { applyTheme, loadTheme, applyAccent, loadAccent } from "./features/theme";

applyTheme(loadTheme());
applyAccent(loadAccent());
const root = document.getElementById("app");
if (root) mountApp(root);

if ("serviceWorker" in navigator) {
  const hadController = !!navigator.serviceWorker.controller;
  let reloading = false;
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    if (reloading || !hadController) return;
    reloading = true;
    window.location.reload();
  });
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").then((reg) => {
      reg.update();
      setInterval(() => { void reg.update(); }, 60 * 60 * 1000);
    }).catch(() => { /* offline nicht verfügbar */ });
  });
}
