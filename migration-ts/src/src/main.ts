import "./ui/theme.css";
// Einstieg: Tab-App montieren + Service Worker registrieren (PWA).
import { mountApp } from "./ui/app";
import { applyTheme, loadTheme, applyAccent, loadAccent } from "./features/theme";

try { applyTheme(loadTheme()); applyAccent(loadAccent()); } catch { /* Theme optional */ }
const root = document.getElementById("app");
if (root) {
  try {
    mountApp(root);
  } catch (e) {
    // Lieber eine lesbare Meldung als eine weisse Seite.
    root.textContent = "";
    const box = document.createElement("div");
    box.style.cssText = "padding:24px;font:15px/1.6 system-ui,sans-serif;color:#e6e9ef;background:#12151c;min-height:100vh";
    box.innerHTML = "<h2 style=\"margin:0 0 8px\">Die Divergenzmaschine konnte nicht starten.</h2>"
      + "<p style=\"margin:0 0 12px;opacity:.8\">Meist liegt es daran, dass der Browser den lokalen Speicher sperrt "
      + "(blockierte Cookies und Websitedaten, oder eine eingebettete Vorschau).</p>";
    const pre = document.createElement("pre");
    pre.style.cssText = "white-space:pre-wrap;opacity:.7;font-size:13px";
    pre.textContent = e instanceof Error ? e.message : String(e);
    box.appendChild(pre);
    root.appendChild(box);
  }
}

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
