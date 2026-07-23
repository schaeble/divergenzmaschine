// Speicher-Status: macht einen vollen localStorage sichtbar (statt still zu
// scheitern) und schätzt die Belegung. Roadmap 1.3.

/** Erkennt einen „Speicher voll"-Fehler über Browsergrenzen hinweg. */
export function isQuotaError(e: unknown): boolean {
  if (!(e instanceof DOMException)) return false;
  return e.name === "QuotaExceededError"
    || e.name === "NS_ERROR_DOM_QUOTA_REACHED"
    || e.code === 22 || e.code === 1014;
}

let banner: HTMLElement | null = null;

/** Zeigt einen dauerhaften, schließbaren Hinweis, dass ein Speichern scheiterte. */
export function notifyStorageFull(where: string): void {
  try {
    if (!banner) {
      banner = document.createElement("div");
      banner.setAttribute("role", "alert");
      banner.style.cssText =
        "position:fixed;left:0;right:0;top:0;z-index:9999;padding:10px 14px;"
        + "background:#7f1d1d;color:#fff;font:14px/1.4 system-ui,sans-serif;"
        + "display:flex;gap:12px;align-items:center;justify-content:center;box-shadow:0 2px 8px rgba(0,0,0,.4)";
      const x = document.createElement("button");
      x.textContent = "✕";
      x.style.cssText = "background:transparent;border:0;color:#fff;font-size:16px;cursor:pointer";
      x.addEventListener("click", () => { banner?.remove(); banner = null; });
      const span = document.createElement("span");
      span.id = "storage-msg";
      banner.append(span, x);
      document.body.appendChild(banner);
    }
    const msg = banner.querySelector("#storage-msg");
    if (msg) msg.textContent =
      `Speicher voll — „${where}" konnte nicht gesichert werden. `
      + "Bitte Korpus kürzen, Schatzkammer aufräumen oder ein Projekt exportieren und Daten löschen.";
  } catch { /* DOM nicht verfügbar */ }
}

/** Sicheres Schreiben: meldet einen vollen Speicher sichtbar, schluckt anderes. */
export function safeSet(key: string, value: string, where: string): boolean {
  try { localStorage.setItem(key, value); return true; }
  catch (e) { if (isQuotaError(e)) notifyStorageFull(where); return false; }
}

const fmt = (bytes: number): string =>
  bytes >= 1024 * 1024 ? (bytes / 1024 / 1024).toFixed(1) + " MB" : Math.round(bytes / 1024) + " KB";

export interface StorageReport { localBytes: number; usage?: number; quota?: number; text: string; }

/** Belegung: exakte localStorage-Größe + (falls verfügbar) Origin-Schätzung. */
export async function storageReport(): Promise<StorageReport> {
  let localBytes = 0;
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i); if (k === null) continue;
      const v = localStorage.getItem(k) || "";
      localBytes += (k.length + v.length) * 2; // UTF-16
    }
  } catch { /* gesperrt */ }

  let usage: number | undefined, quota: number | undefined;
  try {
    if (navigator.storage?.estimate) { const e = await navigator.storage.estimate(); usage = e.usage; quota = e.quota; }
  } catch { /* nicht verfügbar */ }

  let text = `localStorage: ${fmt(localBytes)}`;
  if (usage !== undefined && quota) {
    const pct = Math.round((usage / quota) * 100);
    text += ` · Origin gesamt: ${fmt(usage)} / ${fmt(quota)} (${pct} %)`;
  }
  return { localBytes, usage, quota, text };
}
